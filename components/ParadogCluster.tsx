"use client";

import { useEffect, useState } from "react";
import { PARADOG_IMAGE_PATHS } from "@/lib/paradogImages";

/** FV用16枚を固定参照（確実に16件） */
const FV_IMAGES = PARADOG_IMAGE_PATHS;

type LayoutItem = {
  x: string;
  y: string;
  scale: number;
  rotate: number;
  zIndex: number;
};

/**
 * 16枚の座標・スケール・重なり順を一元管理（PC用・変更禁止）
 * 集合写真っぽいレイアウト（端で切れてもOK、存在感優先）
 */
const LAYOUT: LayoutItem[] = [
  { x: "50%", y: "45%", scale: 1.1, rotate: -4, zIndex: 10 },
  { x: "28%", y: "38%", scale: 0.9, rotate: 6, zIndex: 5 },
  { x: "72%", y: "40%", scale: 0.95, rotate: -6, zIndex: 6 },
  { x: "18%", y: "55%", scale: 0.85, rotate: 8, zIndex: 3 },
  { x: "82%", y: "52%", scale: 0.88, rotate: -8, zIndex: 4 },
  { x: "50%", y: "28%", scale: 0.9, rotate: 2, zIndex: 8 },
  { x: "38%", y: "62%", scale: 0.8, rotate: -3, zIndex: 2 },
  { x: "62%", y: "65%", scale: 0.82, rotate: 4, zIndex: 2 },
  { x: "12%", y: "42%", scale: 0.75, rotate: 10, zIndex: 1 },
  { x: "88%", y: "48%", scale: 0.78, rotate: -10, zIndex: 1 },
  // index 10（①）→ 中央下（②の位置へ入れ替え）
  { x: "48%", y: "70%", scale: 0.9, rotate: -2, zIndex: 6 },
  { x: "32%", y: "28%", scale: 0.7, rotate: 5, zIndex: 4 },
  { x: "68%", y: "30%", scale: 0.72, rotate: -5, zIndex: 4 },
  { x: "22%", y: "68%", scale: 0.68, rotate: 7, zIndex: 1 },
  { x: "78%", y: "70%", scale: 0.7, rotate: -7, zIndex: 1 },
  // index 15（②）→ 右上の空白へ（入れ替え・被り回避 x=86%）
  { x: "86%", y: "34%", scale: 0.78, rotate: -6, zIndex: 3 },
];

/**
 * モバイル（md未満）専用：外接矩形がviewport内に収まるよう満遍なく配置
 * 4x4ベースにオフセットでランダム感を残す
 */
const LAYOUT_MOBILE: LayoutItem[] = [
  { x: "22%", y: "22%", scale: 0.92, rotate: -4, zIndex: 4 },
  { x: "42%", y: "20%", scale: 0.88, rotate: 6, zIndex: 3 },
  { x: "62%", y: "24%", scale: 0.9, rotate: -6, zIndex: 5 },
  { x: "80%", y: "22%", scale: 0.85, rotate: 8, zIndex: 2 },
  { x: "20%", y: "42%", scale: 0.87, rotate: 5, zIndex: 3 },
  { x: "40%", y: "44%", scale: 0.93, rotate: -3, zIndex: 6 },
  { x: "60%", y: "40%", scale: 0.88, rotate: 4, zIndex: 4 },
  { x: "78%", y: "42%", scale: 0.86, rotate: -8, zIndex: 2 },
  { x: "24%", y: "60%", scale: 0.9, rotate: -5, zIndex: 4 },
  { x: "44%", y: "58%", scale: 0.85, rotate: 7, zIndex: 3 },
  { x: "58%", y: "62%", scale: 0.91, rotate: -2, zIndex: 5 },
  { x: "76%", y: "60%", scale: 0.84, rotate: 6, zIndex: 2 },
  { x: "22%", y: "78%", scale: 0.86, rotate: 3, zIndex: 2 },
  { x: "42%", y: "76%", scale: 0.89, rotate: -7, zIndex: 4 },
  { x: "60%", y: "80%", scale: 0.87, rotate: 5, zIndex: 3 },
  { x: "78%", y: "78%", scale: 0.88, rotate: -6, zIndex: 4 },
];

const MD_BREAKPOINT = 768;

export default function ParadogCluster() {
  const [isMdOrLarger, setIsMdOrLarger] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const update = () => setIsMdOrLarger(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const layoutList = isMdOrLarger ? LAYOUT : LAYOUT_MOBILE;
  const sizeClass = isMdOrLarger
    ? "clamp(80px, 12vw, 160px)"
    : "clamp(100px, 18vw, 200px)";

  return (
    <div
      className="absolute inset-0 overflow-hidden scale-100 origin-center"
      style={{ minHeight: 0 }}
    >
      {FV_IMAGES.map((src, i) => {
        const layout = layoutList[i] ?? layoutList[0];
        return (
          <div
            key={`${src}-${i}`}
            className="absolute will-change-transform"
            style={{
              left: layout.x,
              top: layout.y,
              transform: `translate(-50%, -50%) scale(${layout.scale}) rotate(${layout.rotate}deg)`,
              zIndex: layout.zIndex,
              width: sizeClass,
              height: sizeClass,
            }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-3xl bg-white/60"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
                filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.06))",
              }}
            >
              <img
                src={src}
                alt={`ぱらどっぐ ${i + 1}`}
                className="absolute inset-0 h-full w-full object-contain"
                loading={i < 6 ? "eager" : "lazy"}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div
                className="hidden absolute inset-0 flex items-center justify-center rounded-3xl bg-gray-200/90 text-gray-500 text-xs"
                aria-hidden
              >
                {i + 1}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
