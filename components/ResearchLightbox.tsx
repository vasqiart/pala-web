"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef } from "react";
import type { ResearchMaterial } from "@/lib/researchMaterials";

type Props = {
  material: ResearchMaterial;
  pageIndex: number;
  onPageChange: (index: number) => void;
  onClose: () => void;
};

export default function ResearchLightbox({
  material,
  pageIndex,
  onPageChange,
  onClose,
}: Props) {
  const touchStartX = useRef<number | null>(null);
  const pageCount = material.images.length;
  const image = material.images[pageIndex];

  const onPrev = useCallback(() => {
    onPageChange((pageIndex - 1 + pageCount) % pageCount);
  }, [onPageChange, pageCount, pageIndex]);

  const onNext = useCallback(() => {
    onPageChange((pageIndex + 1) % pageCount);
  }, [onPageChange, pageCount, pageIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (pageCount > 1 && event.key === "ArrowLeft") onPrev();
      if (pageCount > 1 && event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onNext, onPrev, pageCount]);

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex flex-col px-3 py-3 backdrop-blur-[6px] sm:px-6 sm:py-5"
      style={{ background: "rgba(10, 10, 12, 0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${material.title}を拡大表示`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-3 text-white">
        <div className="min-w-0 py-1">
          <p className="text-[10px] font-medium tracking-[0.16em] text-white/60 sm:text-xs">
            {material.displayDate}
          </p>
          <h2 className="mt-1 truncate text-sm font-medium sm:text-base">
            {material.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl leading-none transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>

      <div
        className="relative mx-auto mt-3 flex min-h-0 w-full max-w-7xl flex-1 items-center justify-center"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (start == null || end == null || pageCount < 2) return;
          const distance = end - start;
          if (Math.abs(distance) < 48) return;
          if (distance > 0) onPrev();
          else onNext();
        }}
      >
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          priority
          className="h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        />

        {pageCount > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/65 text-3xl text-white shadow-lg transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-3"
              aria-label="前のページ"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/65 text-3xl text-white shadow-lg transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-3"
              aria-label="次のページ"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="mx-auto mt-3 flex w-full max-w-7xl items-center justify-center gap-3 text-white">
        {pageCount > 1 && (
          <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full bg-white/10 px-3 py-2">
            {material.images.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => onPageChange(index)}
                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-xs font-medium transition-colors ${
                  index === pageIndex
                    ? "bg-white text-slate-900"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                aria-label={`${index + 1}ページ目を表示`}
                aria-current={index === pageIndex ? "page" : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
        <span className="shrink-0 text-xs text-white/65">
          {pageIndex + 1} / {pageCount}
        </span>
      </div>
    </div>,
    document.body
  );
}
