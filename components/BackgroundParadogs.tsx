"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

/** シード付き簡易乱数（再現可能な配置用） */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

const EDGE_MARGIN = 32;
/** グリッド1セル辺りの目安サイズ（px）。これで gridX/gridY を算出 */
const CELL_SIZE_PX = 240;
const CELL_FILL_RATIO = 0.8;
const TARGET_COUNT_MIN = 12;
const TARGET_COUNT_MAX = 24;
const CELL_JITTER_LO = 0.2;
const CELL_JITTER_HI = 0.8;
const CELL_RETRIES = 40;
const MIN_DISTANCE_PX_MIN = 90;
const MIN_DISTANCE_PX_MAX = 150;
/** 中央→右下へ逃がす補正（ABOUTのみ）：中央ゾーン・最大体数・オフセット範囲・再試行回数 */
const CENTER_ZONE_MIN = 0.35;
const CENTER_ZONE_MAX = 0.65;
const CENTER_REDISTRIBUTE_MAX = 10;
const REDISTRIBUTE_OFFSET_VW = [0.12, 0.22];
const REDISTRIBUTE_OFFSET_VH = [0.12, 0.22];
const REDISTRIBUTE_RETRIES = 15;
const COLLISION_JITTER_SCALE = [0.9, 1.15];
const COLLISION_JITTER_ROTATE = 10;
/** ABOUT 背景キャラのサイズを TOP より少し大きくする倍率 */
const ABOUT_SIZE_BOOST = 1.2;


export type SafeZonePercent = {
  /** 中央禁止帯の幅（ビューポート幅に対する割合 0-1）。例: 0.1 = 中央 10% が禁止 */
  centerBandWidth: number;
  /** 中央禁止帯の高さ（ビューポート高さに対する割合 0-1）。例: 0.1 = 中央 10% が禁止 */
  centerBandHeight: number;
};

const DEFAULT_SAFE_ZONE: SafeZonePercent = {
  centerBandWidth: 0.1,
  centerBandHeight: 0.1,
};

/** TOP と同一の濃さ・サイズレンジ基準値（変更禁止） */
const OPACITY = 0.1;
/** ABOUT 背景：存在が分かる程度の視認性（0.25 超えず）。強制テスト 0.60 で反映確認後、0.24 に戻す */
const OPACITY_ABOUT = 0.6;
const SIZE_MIN_PX = 48;
const SIZE_MAX_PX = 96;
const SIZE_VW = 6;
const ROTATE_RANGE = 12;

export type PlacementMode = "random" | "grid" | "collisionFree";

type PositionItem = { x: number; y: number; src: string; rotate: number; scale: number };

type Props = {
  imagePaths: string[];
  /** 表示するキャラ数（TOP と同数なら 16） */
  count: number;
  /** 中央の立入禁止領域。placementMode=random で使用 */
  safeZone?: SafeZonePercent;
  /** 配置の再現用シード（省略時は 42） */
  seed?: number;
  /** サイズ倍率（1 = TOP 同一。ABOUT は 1.1〜1.15 で少し大きく） */
  sizeScale?: number;
  /** 配置モード。collisionFree = 禁止領域・衝突回避・中心にも配置 */
  placementMode?: PlacementMode;
  /** 生成密度の倍率（collisionFree 時に適用。1 = 既存どおり） */
  densityMultiplier?: number;
  /** 配置の軽いバリエーション */
  layoutPreset?: "default" | "sharePrice";
  /** モバイル時のみ、この数以上を表示する（collisionFree 時。省略時は従来どおり） */
  minCountMobile?: number;
};

/**
 * 背景用のキャラ画像を散らして表示するレイヤー。
 * 中央 safe zone には配置せず、外側寄りに表示する。
 */
/**
 * 4x3 グリッドで 16 スロット。中央 (1,1)(2,1) は避け、左右列に多め。
 */
function buildGridSlots16(rnd: () => number): Array<{ x: number; y: number }> {
  const cols = 4;
  const rows = 3;
  const offset = () => (rnd() - 0.5) * 12;
  const slot = (c: number, r: number) => ({
    x: ((c + 0.5) / cols) * 100 + offset(),
    y: ((r + 0.5) / rows) * 100 + offset(),
  });
  return [
    slot(0, 0), slot(0, 0), slot(0, 1), slot(0, 1), slot(0, 2), slot(0, 2),
    slot(3, 0), slot(3, 0), slot(3, 1), slot(3, 1), slot(3, 2), slot(3, 2),
    slot(1, 0), slot(2, 0), slot(1, 2), slot(2, 2),
  ];
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * 配置失敗時のフェイルセーフ: 禁止領域を無視した固定テンプレ（中心＋四隅＋左右中）＋ジッター
 */
function getFallbackPositions(
  imagePaths: string[],
  count: number,
  seed: number,
  _sizeScale: number,
  vw: number,
  vh: number,
  yMin: number
): PositionItem[] {
  const margin = EDGE_MARGIN;
  const rnd = mulberry32(seed + 9999);
  const shuffled = [...imagePaths];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const rangeY = vh - margin - yMin;
  const templates: Array<[number, number]> = [
    [0.5, 0.5],
    [0.2, 0.2],
    [0.8, 0.2],
    [0.2, 0.8],
    [0.8, 0.8],
    [0.15, 0.5],
    [0.85, 0.5],
    [0.5, 0.2],
    [0.5, 0.8],
    [0.35, 0.35],
    [0.65, 0.35],
    [0.35, 0.65],
    [0.65, 0.65],
    [0.3, 0.15],
    [0.7, 0.15],
    [0.3, 0.85],
    [0.7, 0.85],
  ];
  const jitter = () => (rnd() - 0.5) * 0.08;
  return templates.slice(0, Math.max(6, count)).map(([qx, qy], i) => ({
    x: margin + (vw - 2 * margin) * (qx + jitter()),
    y: yMin + rangeY * (qy + jitter()),
    src: shuffled[i % shuffled.length]!,
    rotate: (rnd() - 0.5) * 2 * COLLISION_JITTER_ROTATE,
    scale: COLLISION_JITTER_SCALE[0]! + rnd() * (COLLISION_JITTER_SCALE[1]! - COLLISION_JITTER_SCALE[0]!),
  }));
}

/**
 * 100vh 全面をセルサイズベースのグリッドで均等配置。
 * カード禁止なし（背面に隠れる）。minDistance で被り防止。配置数はスロットの 70〜90% で自動算出。
 */
function computeCollisionFreePositions(
  imagePaths: string[],
  _count: number,
  seed: number,
  _sizeScale: number,
  densityMultiplier: number,
  layoutPreset: "default" | "sharePrice",
  minCountMobile?: number
): PositionItem[] {
  if (typeof window === "undefined") return [];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktopLike = vw >= 768;
  const effectiveDensity = isDesktopLike ? densityMultiplier : 1;
  const margin = EDGE_MARGIN;
  const usableW = vw - 2 * margin;
  const usableH = vh - 2 * margin;
  const cellSizePx =
    !isDesktopLike && minCountMobile != null && minCountMobile > 0
      ? Math.min(
          CELL_SIZE_PX,
          Math.floor(Math.min(usableW, usableH) / Math.ceil(Math.sqrt(minCountMobile)))
        )
      : CELL_SIZE_PX;
  const gridX = Math.max(1, Math.floor(usableW / cellSizePx));
  const gridY = Math.max(1, Math.floor(usableH / cellSizePx));
  const totalSlots = gridX * gridY;
  const baseTargetCount = Math.min(
    imagePaths.length * 2,
    Math.max(TARGET_COUNT_MIN, Math.min(TARGET_COUNT_MAX, Math.round(totalSlots * CELL_FILL_RATIO)))
  );
  let targetCount = Math.max(
    1,
    Math.round(baseTargetCount * Math.max(0.1, effectiveDensity))
  );
  if (!isDesktopLike && minCountMobile != null && minCountMobile > 0) {
    targetCount = Math.max(targetCount, Math.min(minCountMobile, imagePaths.length));
  }
  const cellW = usableW / gridX;
  const cellH = usableH / gridY;
  const charSize = Math.min(cellW, cellH) * 0.9;
  const minDistPx = Math.min(
    MIN_DISTANCE_PX_MAX,
    Math.max(MIN_DISTANCE_PX_MIN, charSize)
  );

  const inBounds = (x: number, y: number) =>
    x >= margin && x <= vw - margin && y >= margin && y <= vh - margin;

  const cells: Array<[number, number]> = [];
  for (let r = 0; r < gridY; r++) {
    for (let c = 0; c < gridX; c++) {
      cells.push([c, r]);
    }
  }
  const rnd = mulberry32(seed);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [cells[i], cells[j]] = [cells[j]!, cells[i]!];
  }

  const shuffled = [...imagePaths];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  const placed: Array<{ x: number; y: number }> = [];

  const tryFill = (minD: number): void => {
    for (const [c, r] of cells) {
      if (placed.length >= targetCount) break;
      const cellLeft = margin + c * cellW;
      const cellTop = margin + r * cellH;
      let ok = false;
      for (let t = 0; t < CELL_RETRIES; t++) {
        const u = CELL_JITTER_LO + rnd() * (CELL_JITTER_HI - CELL_JITTER_LO);
        const v = CELL_JITTER_LO + rnd() * (CELL_JITTER_HI - CELL_JITTER_LO);
        const x = cellLeft + u * cellW;
        const y = cellTop + v * cellH;
        if (!inBounds(x, y)) continue;
        if (placed.some((p) => dist(p, { x, y }) < minD)) continue;
        placed.push({ x, y });
        ok = true;
        break;
      }
      if (!ok && placed.length < targetCount) {
        for (let t = 0; t < CELL_RETRIES; t++) {
          const u = CELL_JITTER_LO + rnd() * (CELL_JITTER_HI - CELL_JITTER_LO);
          const v = CELL_JITTER_LO + rnd() * (CELL_JITTER_HI - CELL_JITTER_LO);
          const x = cellLeft + u * cellW;
          const y = cellTop + v * cellH;
          if (!inBounds(x, y)) continue;
          if (placed.some((p) => dist(p, { x, y }) < minD * 0.85)) continue;
          placed.push({ x, y });
          break;
        }
      }
    }
  };

  tryFill(minDistPx);
  if (placed.length < targetCount) {
    placed.length = 0;
    tryFill(minDistPx * 0.88);
  }
  if (placed.length < targetCount) {
    placed.length = 0;
    tryFill(minDistPx * 0.75);
  }
  const result = placed.slice(0, targetCount);

  if (result.length === 0) {
    return getFallbackPositions(imagePaths, Math.max(12, targetCount), seed, 1, vw, vh, margin);
  }

  let items: PositionItem[] = result.map((p, i) => ({
    x: p.x,
    y: p.y,
    src: shuffled[i % shuffled.length]!,
    rotate: (rnd() - 0.5) * 2 * COLLISION_JITTER_ROTATE,
    scale: COLLISION_JITTER_SCALE[0]! + rnd() * (COLLISION_JITTER_SCALE[1]! - COLLISION_JITTER_SCALE[0]!),
  }));

  const centerLeft = vw * CENTER_ZONE_MIN;
  const centerRight = vw * CENTER_ZONE_MAX;
  const centerTop = vh * CENTER_ZONE_MIN;
  const centerBottom = vh * CENTER_ZONE_MAX;
  const inCenter = (item: PositionItem) =>
    item.x >= centerLeft && item.x <= centerRight &&
    item.y >= centerTop && item.y <= centerBottom;

  let centerIndices = items.map((_, i) => i).filter((i) => inCenter(items[i]!));
  if (centerIndices.length > CENTER_REDISTRIBUTE_MAX) {
    for (let i = centerIndices.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [centerIndices[i], centerIndices[j]] = [centerIndices[j]!, centerIndices[i]!];
    }
    centerIndices = centerIndices.slice(0, CENTER_REDISTRIBUTE_MAX);
  }

  for (const idx of centerIndices) {
    const orig = items[idx]!;
    let done = false;
    for (let t = 0; t < REDISTRIBUTE_RETRIES && !done; t++) {
      const dxVw = REDISTRIBUTE_OFFSET_VW[0]! + rnd() * (REDISTRIBUTE_OFFSET_VW[1]! - REDISTRIBUTE_OFFSET_VW[0]!);
      const dyVh = REDISTRIBUTE_OFFSET_VH[0]! + rnd() * (REDISTRIBUTE_OFFSET_VH[1]! - REDISTRIBUTE_OFFSET_VH[0]!);
      const newX = Math.max(margin, Math.min(vw - margin, orig.x + dxVw * vw));
      const newY = Math.max(margin, Math.min(vh - margin, orig.y + dyVh * vh));
      const others = items.filter((_, i) => i !== idx);
      if (others.every((o) => dist(o, { x: newX, y: newY }) >= minDistPx)) {
        items[idx] = { ...orig, x: newX, y: newY };
        done = true;
      }
    }
  }

  if (layoutPreset === "sharePrice" && isDesktopLike) {
    const topBiasPx = vh * 0.05;
    const centerX = vw / 2;
    items = items.map((item) => {
      const shiftedY = Math.max(margin, Math.min(vh - margin, item.y - topBiasPx));
      const shiftedX = centerX + (item.x - centerX) * 0.93;
      return {
        ...item,
        x: Math.max(margin, Math.min(vw - margin, shiftedX)),
        y: shiftedY,
      };
    });
  }

  return items;
}

export default function BackgroundParadogs({
  imagePaths,
  count,
  safeZone = DEFAULT_SAFE_ZONE,
  seed = 42,
  sizeScale = 1,
  placementMode = "random",
  densityMultiplier = 1,
  layoutPreset = "default",
  minCountMobile,
}: Props) {
  const [collisionPositions, setCollisionPositions] = useState<PositionItem[] | null>(null);
  const seedRef = useRef(seed);

  const runCollisionFree = useCallback(() => {
    const next = computeCollisionFreePositions(
      imagePaths,
      count,
      seedRef.current,
      sizeScale,
      densityMultiplier,
      layoutPreset,
      minCountMobile
    );
    setCollisionPositions(next);
  }, [imagePaths, count, sizeScale, densityMultiplier, layoutPreset, minCountMobile]);

  useLayoutEffect(() => {
    if (placementMode !== "collisionFree") return;
    let rafId: number;
    let attempts = 0;
    const maxAttempts = 5;
    const runAfterPaint = () => {
      runCollisionFree();
      attempts++;
      if (attempts < maxAttempts) rafId = requestAnimationFrame(runAfterPaint);
    };
    rafId = requestAnimationFrame(runAfterPaint);
    const debounced = debounce(runCollisionFree, 180);
    window.addEventListener("resize", debounced);
    let ro: ResizeObserver | null = null;
    const cardEl = document.querySelector("[data-about-card]");
    if (typeof ResizeObserver !== "undefined" && cardEl) {
      ro = new ResizeObserver(debounced);
      ro.observe(cardEl);
    }
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", debounced);
      if (ro && cardEl) ro.unobserve(cardEl);
    };
  }, [placementMode, runCollisionFree]);

  const memoPositions = useMemo(() => {
    if (placementMode === "collisionFree") return null;
    const rnd = mulberry32(seed);
    const list: Array<{ src: string; x: number; y: number; rotate: number; scale: number }> = [];
    const shuffled = [...imagePaths];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    let slots: Array<{ x: number; y: number }>;
    if (placementMode === "grid" && count === 16) {
      slots = buildGridSlots16(rnd);
    } else {
      const xLow = 50 - (safeZone.centerBandWidth * 100) / 2;
      const xHigh = 50 + (safeZone.centerBandWidth * 100) / 2;
      const yLow = 50 - (safeZone.centerBandHeight * 100) / 2;
      const yHigh = 50 + (safeZone.centerBandHeight * 100) / 2;
      slots = [];
      for (let i = 0; i < count; i++) {
        let x: number, y: number;
        if (rnd() < 0.5) x = rnd() * Math.max(0, xLow);
        else x = xHigh + rnd() * Math.max(0, 100 - xHigh);
        if (rnd() < 0.5) y = rnd() * Math.max(0, yLow);
        else y = yHigh + rnd() * Math.max(0, 100 - yHigh);
        slots.push({ x, y });
      }
    }
    for (let i = 0; i < count; i++) {
      const slot = slots[i] ?? { x: 50, y: 50 };
      list.push({
        src: shuffled[i % shuffled.length]!,
        x: slot.x,
        y: slot.y,
        rotate: (rnd() - 0.5) * 2 * ROTATE_RANGE,
        scale: 0.85 + rnd() * 0.3,
      });
    }
    return list;
  }, [imagePaths, count, safeZone.centerBandWidth, safeZone.centerBandHeight, seed, placementMode]);

  const positions = placementMode === "collisionFree" ? collisionPositions : memoPositions;
  const usePx = placementMode === "collisionFree" && collisionPositions != null;
  const sizeMultiplier = placementMode === "collisionFree" ? sizeScale * ABOUT_SIZE_BOOST : sizeScale;
  const minPx = Math.round(SIZE_MIN_PX * sizeMultiplier);
  const maxPx = Math.round(SIZE_MAX_PX * sizeMultiplier);
  const vwNum = Number((SIZE_VW * sizeMultiplier).toFixed(1));

  const isAbout = placementMode === "collisionFree";
  const opacity = isAbout ? OPACITY_ABOUT : OPACITY;
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      {positions != null &&
        positions.length > 0 &&
        positions.map((item, i) => (
          <div
            key={i}
            {...(isAbout ? { "data-about-bg": "true" as const } : {})}
            className="absolute md:will-change-transform"
            style={{
              left: usePx ? item.x : `${item.x}%`,
              top: usePx ? item.y : `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${item.scale})`,
              width: `clamp(${minPx}px, ${vwNum}vw, ${maxPx}px)`,
              height: `clamp(${minPx}px, ${vwNum}vw, ${maxPx}px)`,
              opacity: isAbout ? 1 : opacity,
            }}
          >
            <img
              src={item.src}
              alt=""
              className="h-full w-full object-contain"
              loading="lazy"
              style={isAbout ? { opacity: OPACITY_ABOUT } : undefined}
            />
          </div>
        ))}
    </div>
  );
}
