"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import BackgroundParadogs from "@/components/BackgroundParadogs";
import { SHARE_PRICE_BG_IMAGES } from "@/lib/sharePriceBackgroundImages";

type PlacedItem = {
  src: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  scale: number;
};

const DESKTOP_BREAKPOINT = 768;
const COLS = 5;
const ROWS = 4;
const MARGIN_PX = 28;
const FIXED_SEED = 20260205;
const OPACITY = 0.6;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDesktopLayout(vw: number, vh: number): PlacedItem[] {
  const rnd = mulberry32(FIXED_SEED);
  const cellW = Math.max(1, (vw - MARGIN_PX * 2) / COLS);
  const cellH = Math.max(1, (vh - MARGIN_PX * 2) / ROWS);

  const allCellIndexes = Array.from({ length: COLS * ROWS }, (_, i) => i);
  for (let i = allCellIndexes.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [allCellIndexes[i], allCellIndexes[j]] = [allCellIndexes[j]!, allCellIndexes[i]!];
  }
  const selectedCellIndexes = allCellIndexes.slice(0, SHARE_PRICE_BG_IMAGES.length);

  return SHARE_PRICE_BG_IMAGES.map((src, i) => {
    const cellIndex = selectedCellIndexes[i]!;
    const col = cellIndex % COLS;
    const row = Math.floor(cellIndex / COLS);

    // セル境界からはみ出さないよう、中心付近だけ使う。
    const jitterX = 0.38 + rnd() * 0.24;
    const jitterY = 0.38 + rnd() * 0.24;
    const x = MARGIN_PX + col * cellW + cellW * jitterX;
    const y = MARGIN_PX + row * cellH + cellH * jitterY;

    // ABOUT比60%の見た目密度になるよう、セル内サイズは控えめに。
    const size = Math.min(cellW, cellH) * (0.56 + rnd() * 0.08);

    return {
      src,
      x,
      y,
      size,
      rotate: (rnd() - 0.5) * 14,
      scale: 0.92 + rnd() * 0.16,
    };
  });
}

export default function SharePriceBackground() {
  const [viewport, setViewport] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const update = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isDesktop = viewport.w >= DESKTOP_BREAKPOINT;

  const desktopItems = useMemo(() => {
    if (!isDesktop || viewport.w === 0 || viewport.h === 0) return [];
    return buildDesktopLayout(viewport.w, viewport.h);
  }, [isDesktop, viewport.w, viewport.h]);

  if (!isDesktop) {
    return (
      <BackgroundParadogs
        imagePaths={SHARE_PRICE_BG_IMAGES}
        count={SHARE_PRICE_BG_IMAGES.length}
        placementMode="collisionFree"
        sizeScale={1.12}
        minCountMobile={17}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }} aria-hidden>
      {desktopItems.map((item, i) => (
        <div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg) scale(${item.scale})`,
            opacity: 1,
          }}
        >
          <img
            src={item.src}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
            style={{ opacity: OPACITY }}
          />
        </div>
      ))}
    </div>
  );
}
