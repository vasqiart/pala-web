"use client";

import { useState } from "react";
import BackgroundParadogs from "@/components/BackgroundParadogs";
import BackgroundPortal from "@/components/BackgroundPortal";
import KarpGallery from "@/components/KarpGallery";
import KarpLightbox from "@/components/KarpLightbox";
import PageHeading from "@/components/PageHeading";
import { KARP_BG_IMAGES } from "@/lib/karpBackgroundImages";
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
    <>
      <BackgroundPortal usePortalOnMobile>
        <BackgroundParadogs
          imagePaths={[
            ...KARP_BG_IMAGES,
            ...KARP_BG_IMAGES,
            ...KARP_BG_IMAGES,
          ]}
          count={12}
          placementMode="collisionFree"
          sizeScale={1.9}
          densityMultiplier={0.86}
          minCountMobile={6}
          seed={20261003}
          avoidSelector="[data-background-avoid]"
          topBandCount={4}
        />
      </BackgroundPortal>
      <main className="relative min-h-screen w-full pt-16" style={{ zIndex: 10 }}>
        <PageHeading title="ALEX KARP" subtitle="Photo Gallery" />
        <div className="flex min-w-0 flex-row items-start">
          <div data-background-avoid className="w-72 shrink-0 px-4 pb-6 md:px-6">
            <p className="text-xs leading-relaxed text-gray-500" aria-label="Disclaimer">
              If there are any concerns regarding the publication of these photos of CEO Alex Karp, please contact us via X. We will promptly remove them.
            </p>
          </div>
          <div className="flex min-w-0 flex-1 justify-center">
            <KarpGallery images={KARP_IMAGES} onSelect={setLightboxIndex} />
          </div>
        </div>
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
    </>
  );
}
