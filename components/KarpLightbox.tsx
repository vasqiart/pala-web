"use client";

import { useEffect, useCallback, useState } from "react";

/** 後で等倍／最大表示に切替えるときはここを変更 */
const LIGHTBOX_SIZE_MODE = "contain" as const;

function getLightboxImageClassName(): string {
  switch (LIGHTBOX_SIZE_MODE) {
    case "contain":
      return "block h-full w-full max-h-[82vh] max-w-full object-contain rounded-2xl";
    default:
      return "block h-full w-full max-h-[82vh] max-w-full object-contain rounded-2xl";
  }
}

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
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
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
        className="relative flex max-h-[82vh] min-w-0 max-w-[min(88vw,1100px)] items-center justify-center overflow-hidden rounded-2xl p-2.5 transition-all duration-200"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          background: "rgba(255,255,255,0.06)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(4px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[calc(82vh-20px)] min-h-0 flex-1 overflow-hidden rounded-2xl">
          <img
            src={src}
            alt={alt}
            className={getLightboxImageClassName()}
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
            className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
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
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
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
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition-colors hover:bg-white/40"
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
