"use client";

import { useState } from "react";
import KarpGallery from "@/components/KarpGallery";
import KarpLightbox from "@/components/KarpLightbox";
import { KARP_IMAGES } from "@/lib/karpImages";

/**
 * KARP ページ（URL は /karp）。
 * ルートを変更する場合はこのファイルの存在パスと Header の NAV_ITEMS href を合わせて変更する。
 */
const N = KARP_IMAGES.length;

export default function KarpPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const selectedImage =
    lightboxIndex !== null ? KARP_IMAGES[lightboxIndex] ?? null : null;

  const onPrev = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + N) % N
    );
  const onNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % N));

  return (
    <main className="relative min-h-screen w-full pt-16" style={{ zIndex: 10 }}>
      <header className="px-4 pb-6 pt-4 md:px-6 md:pt-6">
        <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
          Alex Karp
        </h1>
        <p className="mt-1 text-sm text-gray-500">Photo Gallery</p>
      </header>
      <KarpGallery images={KARP_IMAGES} onSelect={setLightboxIndex} />
      {selectedImage && (
        <KarpLightbox
          src={selectedImage.src}
          alt={selectedImage.alt}
          open={true}
          onClose={() => setLightboxIndex(null)}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </main>
  );
}
