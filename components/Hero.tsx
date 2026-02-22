"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ParadogCluster from "./ParadogCluster";

/**
 * FV: 100vh fixed、中央に16枚の集合写真風
 * スクロールで opacity 1→0.6、scale 1→0.85 で背景化（消さない）
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0.6,
        scale: 0.85,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "400px top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 flex items-center justify-center bg-[#fafafa]"
      style={{
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
      }}
      aria-hidden
    >
      {/* レイヤー管理用ラッパー（スタッキングコンテキストを明示） */}
      <div className="relative h-full w-full">
        {/* 1) 背景ノイズ: z-0 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* 2) 背面テキスト「Palantir」: z-10（ノイズより前、カードより後）。md以上のみ */}
        <div
          className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex"
          style={{ zIndex: 10 }}
          aria-hidden
        >
          <span
            className="whitespace-nowrap text-center"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "clamp(6rem, 28vw, 18rem)",
              color: "rgba(0, 0, 0, 0.05)",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            Palantir
          </span>
        </div>
        {/* 3) カード群: z-20（必ず最前）。inset-0 で親と同じサイズにし、潰れ防止 */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 20 }}
        >
          <ParadogCluster />
        </div>
      </div>
    </div>
  );
}
