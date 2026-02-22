"use client";

import type { PageSections } from "@/lib/sections";
import type { SectionItem } from "@/lib/sections";
import RotatingCard from "./RotatingCard";
import SharePriceCard from "./SharePriceCard";
import ValuationCard from "./ValuationCard";
import EarningsSummaryCard from "./EarningsSummaryCard";

type Props = {
  sections: PageSections;
  /** TOP のとき true（FV 分のスペーサーを表示）。他ページでは false */
  topSpacer?: boolean;
  /** サブページ用。指定時は main 先頭にタイトルブロックを表示（崩れ防止） */
  pageTitle?: string;
  pageSubtitle?: string;
  /** true のとき各カード外枠に data-about-card を付与（背景配置の禁止領域取得用・見た目は不変） */
  markCardsForBackground?: boolean;
};

export default function ScrollSections({
  sections,
  topSpacer = true,
  pageTitle,
  pageSubtitle,
  markCardsForBackground = false,
}: Props) {
  return (
    <main
      className="relative min-h-screen w-full pt-16"
      style={{ zIndex: 10 }}
    >
      {topSpacer && (
        <div className="h-screen w-full shrink-0" aria-hidden />
      )}
      {!topSpacer && pageTitle && (
        <header className="px-4 pb-6 pt-4 md:px-6 md:pt-6">
          <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="mt-1 text-sm text-gray-500">{pageSubtitle}</p>
          )}
        </header>
      )}
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={
            section.id === "summary"
              ? "flex min-h-[100vh] items-start justify-center px-4 pb-2 pt-2 md:px-6 md:pb-3 md:pt-3"
              : index === 0 && pageTitle && !topSpacer
                ? "flex min-h-[100vh] items-center justify-center px-4 pt-8 pb-20 md:px-6 md:py-24"
                : "flex min-h-[100vh] items-center justify-center px-4 py-20 md:px-6 md:py-24"
          }
          style={{ minHeight: section.id === "summary" ? "calc(100vh - 72px)" : "100vh" }}
        >
          <div
            className={
              section.id === "summary"
                ? "w-[92%] max-w-[1120px] h-auto min-h-[min(620px,calc(100vh-190px))] md:h-[min(620px,calc(100vh-190px))] md:max-h-[620px]"
                : "w-[92%] max-w-4xl sm:w-[90%]" +
                  (markCardsForBackground && index === 0 ? " translate-x-3 md:translate-x-0" : "")
            }
            style={
              section.id === "summary"
                ? undefined
                : {
                    height: "clamp(55vh, 70vh, 75vh)",
                    maxHeight: "75vh",
                    minHeight: undefined,
                  }
            }
            {...(markCardsForBackground ? { "data-about-card": "" } : {})}
          >
            {section.id === "price" ? (
              <SharePriceCard {...(section as SectionItem)} />
            ) : section.id === "valuation" ? (
              <ValuationCard {...(section as SectionItem)} />
            ) : section.id === "summary" ? (
              <EarningsSummaryCard {...(section as SectionItem)} />
            ) : (
              <RotatingCard {...section} />
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
