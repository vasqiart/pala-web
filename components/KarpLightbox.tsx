"use client";

import { useEffect, useCallback, useState } from "react";

type Props = {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function KarpLightbox({
  src,
  alt,
  open,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [imageSize, setImageSize] = useState<{ src: string; width: number; height: number } | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0, density: 1 });

  useEffect(() => {
    if (!open) return;
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight, density: window.devicePixelRatio || 1 });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  const loaded = imageSize?.src === src && viewport.width > 0;
  const scale = loaded ? Math.min(
    1 / viewport.density,
    (Math.min(viewport.width * (viewport.width >= 640 ? 0.88 : 0.94), 1100) - 20) / imageSize.width,
    (viewport.height * 0.82 - 20) / imageSize.height,
  ) : 0;

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!open) return;
    let raf1: number | null = null;
    const raf2 = requestAnimationFrame(() => {
      raf1 = requestAnimationFrame(() => {
        setMounted(false);
        setMounted(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf2);
      if (raf1 !== null) cancelAnimationFrame(raf1);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [open, handleKeydown]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[6px] transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}
      style={{ background: "rgba(10, 10, 12, 0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-label="画像を拡大表示"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex max-h-[82vh] min-w-0 max-w-[94vw] items-center justify-center overflow-hidden rounded-2xl p-1.5 transition-all duration-200 sm:max-w-[min(88vw,1100px)] sm:p-2.5"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          background: "rgba(255,255,255,0.06)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(4px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[calc(82vh-20px)] min-h-0 overflow-hidden rounded-2xl">
          <img
            key={src}
            src={src}
            alt={alt}
            className="block object-contain rounded-2xl"
            style={{ width: loaded ? imageSize.width * scale : 1, height: loaded ? imageSize.height * scale : 1, visibility: loaded ? "visible" : "hidden" }}
            onLoad={(event) => {
              const image = event.currentTarget;
              setImageSize({ src, width: image.naturalWidth, height: image.naturalHeight });
            }}
            draggable={false}
          />
        </div>
        {onPrev != null && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/45 sm:left-3 sm:h-9 sm:w-9"
            aria-label="前の写真"
          >
            <span className="text-lg leading-none" aria-hidden>
              ‹
            </span>
          </button>
        )}
        {onNext != null && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/45 sm:right-3 sm:h-9 sm:w-9"
            aria-label="次の写真"
          >
            <span className="text-lg leading-none" aria-hidden>
              ›
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white transition-colors hover:bg-black/50 sm:right-2.5 sm:top-2.5 sm:h-8 sm:w-8"
          aria-label="閉じる"
        >
          <span className="text-sm leading-none" aria-hidden>
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
