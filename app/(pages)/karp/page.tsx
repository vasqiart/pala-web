"use client";

import { useState } from "react";
import KarpGallery from "@/components/KarpGallery";
import KarpLightbox from "@/components/KarpLightbox";
import PageHeading from "@/components/PageHeading";
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
      <PageHeading title="ALEX KARP" subtitle="Photo Gallery" />
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
