"use client";

import type { KarpImageItem } from "@/lib/karpImages";

/** 後で masonry / randomOffset 等を追加する場合はここで分岐 */
const GALLERY_LAYOUT_MODE = "grid" as const;

type Props = {
  images: KarpImageItem[];
  onSelect: (index: number) => void;
};

export default function KarpGallery({ images, onSelect }: Props) {
  if (images.length === 0) {
    return (
      <div className="grid min-h-[200px] w-full max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 items-center" />
    );
  }

  const gridClass =
    GALLERY_LAYOUT_MODE === "grid"
      ? "grid w-full max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 items-center"
      : "grid w-full max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 items-center";

  return (
    <div className="flex justify-center">
      <div className={gridClass}>
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onSelect(index)}
            className="group relative w-full overflow-hidden rounded-2xl bg-white/95 transition-transform transition-shadow duration-200 ease-out hover:-translate-y-2 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="block w-full h-auto opacity-90 transition-[filter,opacity,transform] duration-200 ease-out [filter:saturate(0.75)_contrast(0.95)_brightness(0.98)] group-hover:opacity-100 group-hover:[filter:saturate(1)_contrast(1)_brightness(1)] motion-reduce:transition-none"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
