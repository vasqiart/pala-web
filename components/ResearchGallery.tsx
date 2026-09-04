"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ResearchLightbox from "@/components/ResearchLightbox";
import {
  RESEARCH_CATEGORIES,
  type ResearchMaterial,
} from "@/lib/researchMaterials";

type Props = {
  materials: ResearchMaterial[];
};

type Filter = (typeof RESEARCH_CATEGORIES)[number];

export default function ResearchGallery({ materials }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const filteredMaterials = useMemo(
    () =>
      filter === "ALL"
        ? materials
        : materials.filter((material) => material.categories.includes(filter)),
    [filter, materials]
  );

  const selectedMaterial = materials.find(
    (material) => material.slug === selectedSlug
  );

  return (
    <>
      <main className="relative min-h-screen w-full bg-[#fafafa] pt-16">
        <div className="mx-auto flex w-full max-w-[1680px] min-w-0 flex-col items-start md:flex-row">
          <aside className="w-full shrink-0 px-5 pb-3 pt-7 md:sticky md:top-16 md:w-72 md:px-6 md:py-9">
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
              RESEARCH
            </h1>
            <p className="mt-1 text-sm text-gray-500">Original Research</p>

            <div
              className="mt-5 flex flex-wrap gap-2"
              role="group"
              aria-label="資料カテゴリー"
            >
              {RESEARCH_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`min-h-9 rounded-full px-3 py-2 text-[10px] font-medium tracking-[0.08em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${
                    filter === category
                      ? "bg-gray-800 text-white"
                      : "border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  aria-pressed={filter === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>

          <section className="min-w-0 flex-1 px-4 pb-16 pt-4 sm:px-6 md:pt-9 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMaterials.map((material, index) => {
                const cover = material.images[0];
                const pageCount = material.images.length;

                return (
                  <article
                    key={material.slug}
                    className="w-full"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlug(material.slug);
                        setPageIndex(0);
                      }}
                      className="group relative block w-full text-left transition-transform duration-200 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      aria-label={`${material.title}を開く${pageCount > 1 ? `、全${pageCount}ページ` : ""}`}
                    >
                      {pageCount > 1 && (
                        <>
                          <span className="absolute inset-0 translate-x-2 translate-y-2 rounded-[22px] border border-gray-200 bg-white shadow-sm" />
                          <span className="absolute inset-0 translate-x-1 translate-y-1 rounded-[22px] border border-gray-200 bg-white" />
                        </>
                      )}

                      <span className="relative block overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[0_10px_38px_rgba(15,23,42,0.08)] transition-shadow duration-200 group-hover:shadow-[0_18px_52px_rgba(15,23,42,0.13)]">
                        <span className="relative block overflow-hidden bg-[#f4f4f2]">
                          <Image
                            src={cover.src}
                            alt={cover.alt}
                            width={cover.width}
                            height={cover.height}
                            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1279px) 44vw, 30vw"
                            priority={index < 2}
                            className="block h-auto w-full opacity-[0.96] transition-[filter,opacity,transform] duration-300 [filter:saturate(0.88)_contrast(0.98)] group-hover:scale-[1.01] group-hover:opacity-100 group-hover:[filter:saturate(1)_contrast(1)] motion-reduce:transition-none"
                          />
                          {pageCount > 1 && (
                            <span className="absolute right-3 top-3 rounded-full bg-slate-900/85 px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-white shadow-sm backdrop-blur-sm">
                              {pageCount} PAGES
                            </span>
                          )}
                        </span>

                        <span className="block px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <time
                              dateTime={material.date}
                              className="text-[10px] font-medium tracking-[0.14em] text-gray-400"
                            >
                              {material.displayDate}
                            </time>
                            <span className="flex flex-wrap justify-end gap-1.5">
                              {material.categories.map((category) => (
                                <span
                                  key={category}
                                  className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium tracking-[0.08em] text-gray-500"
                                >
                                  {category}
                                </span>
                              ))}
                            </span>
                          </span>
                          <span className="mt-2 block text-sm font-semibold leading-snug text-gray-800 sm:text-[15px]">
                            {material.title}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                            {material.summary}
                          </span>
                        </span>
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>

            {filteredMaterials.length === 0 && (
              <p className="py-20 text-center text-sm text-gray-400">
                このカテゴリーの資料はまだありません。
              </p>
            )}
          </section>
        </div>
      </main>

      {selectedMaterial && (
        <ResearchLightbox
          material={selectedMaterial}
          pageIndex={pageIndex}
          onPageChange={setPageIndex}
          onClose={() => setSelectedSlug(null)}
        />
      )}
    </>
  );
}
