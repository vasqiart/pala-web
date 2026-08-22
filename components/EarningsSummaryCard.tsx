"use client";

import { useEffect, useRef, useState } from "react";
import FeatureCardShell from "@/components/cards/FeatureCardShell";
import {
  EARNINGS_ARCHIVE,
  LATEST_EARNINGS,
  type EarningsQuarter,
  type FinancialHighlight,
} from "@/lib/earnings";
import { gsap } from "@/lib/gsap";
import type { SectionItem } from "@/lib/sections";

type Props = SectionItem;
const MOBILE_VISIBLE_COUNT = 4;
const ARCHIVE_YEARS = [
  ...new Set(EARNINGS_ARCHIVE.map((quarter) => quarter.fiscalYear)),
];
const LATEST_ARCHIVE_YEAR = ARCHIVE_YEARS[0]!;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightText({ item }: { item: FinancialHighlight }) {
  const emphasis = item.emphasis ?? [];
  const muted = item.muted ?? [];
  const tokens = [...new Set([...emphasis, ...muted])].sort(
    (a, b) => b.length - a.length
  );

  if (tokens.length === 0) return item.text;

  const parts = item.text.split(
    new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "g")
  );

  return parts.map((part, index) => {
    if (emphasis.includes(part)) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-gray-800">
          {part}
        </strong>
      );
    }

    if (muted.includes(part)) {
      return (
        <span key={`${part}-${index}`} className="text-gray-500">
          {part}
        </span>
      );
    }

    return part;
  });
}

function RowCard({ number, item }: { number: number; item: FinancialHighlight }) {
  return (
    <li className="flex items-start gap-2 rounded-[10px] border border-black/5 bg-black/[0.015] px-[10px] py-[clamp(3px,0.55vh,8px)]">
      <div className="w-8 shrink-0 text-right text-[clamp(10px,1.25vh,13px)] font-semibold text-gray-500">
        {number}.
      </div>
      <p className="min-w-0 whitespace-pre-wrap break-words text-[clamp(10.5px,1.38vh,14px)] font-normal leading-[1.42] text-gray-700">
        <HighlightText item={item} />
      </p>
    </li>
  );
}

function QuarterMeta({ quarter }: { quarter: EarningsQuarter }) {
  return (
    <div className="mb-[clamp(6px,0.9vh,12px)] flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[clamp(9.5px,1.18vh,12px)] leading-tight text-gray-500">
      <span className="font-semibold text-gray-700">{quarter.quarter}</span>
      <span aria-hidden className="text-gray-300">/</span>
      <span>{quarter.periodEnded}</span>
      <span aria-hidden className="text-gray-300">/</span>
      <span>{quarter.reportedAt}</span>
    </div>
  );
}

function HighlightList({
  items,
  listId,
}: {
  items: FinancialHighlight[];
  listId?: string;
}) {
  return (
    <ul id={listId} className="space-y-[clamp(3px,0.55vh,8px)]">
      {items.map((item, index) => (
        <RowCard key={`${index}-${item.text}`} number={index + 1} item={item} />
      ))}
    </ul>
  );
}

function ArchiveContent({
  kind,
  isMdOrLarger,
}: {
  kind: "earnings" | "guidance";
  isMdOrLarger: boolean;
}) {
  const [openQuarterId, setOpenQuarterId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "all">(() =>
    isMdOrLarger ? "all" : LATEST_ARCHIVE_YEAR
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const visibleYears =
    selectedYear === "all" ? ARCHIVE_YEARS : [selectedYear];

  const selectYear = (year: number | "all") => {
    setSelectedYear(year);
    setOpenQuarterId(null);
  };

  return (
    <div
      ref={scrollAreaRef}
      className="h-full min-h-0 touch-pan-y overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
    >
      <div className="sticky top-0 z-10 mb-3 border-b border-gray-200/70 bg-white/95 pb-3 pt-0.5 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-semibold tracking-[0.08em] text-gray-500 md:text-[11px]">
          <span>{EARNINGS_ARCHIVE.length} QUARTERS · SINCE LISTING</span>
          <span className="hidden text-gray-400 sm:inline">Q3 FY2020 — Q1 FY2026</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Fiscal year filter">
          <button
            type="button"
            aria-pressed={selectedYear === "all"}
            onClick={() => selectYear("all")}
            className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.08em] transition-colors md:min-h-0 md:px-3 md:py-1 md:text-[11px] ${
              selectedYear === "all"
                ? "border-gray-800 bg-gray-800 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            ALL
          </button>
          {ARCHIVE_YEARS.map((year) => (
            <button
              key={year}
              type="button"
              aria-pressed={selectedYear === year}
              onClick={() => selectYear(year)}
              className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.08em] transition-colors md:min-h-0 md:px-3 md:py-1 md:text-[11px] ${
                selectedYear === year
                  ? "border-gray-800 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visibleYears.map((year) => (
          <section key={year} aria-label={`FY${year}`}>
            {selectedYear === "all" && (
              <h3
                id={`${kind}-fy-${year}`}
                className="mb-1.5 pl-1 text-[10px] font-semibold tracking-[0.12em] text-gray-400 md:text-[11px]"
              >
                FY{year}
              </h3>
            )}
            <div className="space-y-2.5">
              {EARNINGS_ARCHIVE.filter(
                (quarter) => quarter.fiscalYear === year
              ).map((quarter) => {
                const isOpen = openQuarterId === quarter.id;
                const panelId = `${kind}-${quarter.id}-panel`;
                const title =
                  kind === "earnings" ? quarter.quarter : quarter.guidance.title;
                const summary =
                  kind === "earnings"
                    ? quarter.earningsArchiveSummary
                    : quarter.guidance.archiveSummary;
                const items =
                  kind === "earnings"
                    ? quarter.earnings
                    : quarter.guidance.items;

                return (
                  <article
                    key={quarter.id}
                    className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-50/55"
                  >
                    <button
                      type="button"
                      className="relative flex min-h-[88px] w-full flex-col items-stretch px-4 py-3 text-left transition-colors hover:bg-gray-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-400 md:min-h-0 md:flex-row md:items-center md:pr-[10.5rem]"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={(event) => {
                        setOpenQuarterId(isOpen ? null : quarter.id);

                        if (!isOpen && !isMdOrLarger) {
                          const article = event.currentTarget.parentElement;
                          requestAnimationFrame(() => {
                            if (!article || !scrollAreaRef.current) return;
                            scrollAreaRef.current.scrollTo({
                              top: Math.max(article.offsetTop - 112, 0),
                              behavior: "smooth",
                            });
                          });
                        }
                      }}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-gray-800 md:text-base">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-gray-500 md:text-xs">
                          {kind === "earnings"
                            ? `${quarter.periodEnded} · ${quarter.reportedAt}`
                            : `Issued with ${quarter.quarter} results · ${quarter.reportedAt.replace("Reported ", "")}`}
                        </span>
                        <span className="mt-1.5 block line-clamp-2 text-xs leading-relaxed text-gray-600 md:truncate md:text-sm md:leading-normal">
                          {summary}
                        </span>
                      </span>
                      <span className="mt-3 inline-flex min-h-11 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gray-800 px-4 py-2 text-[11px] font-semibold tracking-[0.08em] text-white md:absolute md:right-4 md:top-1/2 md:mt-0 md:min-h-0 md:w-auto md:-translate-y-1/2 md:px-3 md:py-1.5">
                        {isOpen
                          ? "CLOSE"
                          : kind === "earnings"
                            ? "VIEW QUARTER"
                            : "VIEW GUIDANCE"}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        className="border-t border-gray-200/80 bg-white/80 px-3 py-3 md:px-4"
                      >
                        <QuarterMeta quarter={quarter} />
                        <HighlightList items={items} />
                        <a
                          href={quarter.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex min-h-11 items-center rounded-lg px-1 text-[11px] font-semibold tracking-[0.06em] text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                        >
                          OFFICIAL SOURCE
                        </a>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function EarningsSummaryCard({
  id,
  ctaLabel,
  ctaHref,
  initialRotation,
  innerRotation,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isMdOrLarger, setIsMdOrLarger] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const isArchive = id.endsWith("archive");
  const isGuidance = id.startsWith("guidance");
  const isContentSizedGuidance = id === "guidance-snapshot";
  const title = isGuidance
    ? isArchive
      ? "Guidance Archive"
      : "Guidance Snapshot"
    : isArchive
      ? "Earnings Archive"
      : "Earnings Snapshot";
  const subtitle = isArchive
    ? isGuidance
      ? "Past Outlooks · As Originally Issued"
      : "Past Quarter Highlights"
    : isGuidance
      ? LATEST_EARNINGS.guidance.title
      : `${LATEST_EARNINGS.quarter} Earnings Highlights`;
  const allItems = isGuidance
    ? LATEST_EARNINGS.guidance.items
    : LATEST_EARNINGS.earnings;
  const visibleItems =
    isMdOrLarger || expanded ? allItems : allItems.slice(0, MOBILE_VISIBLE_COUNT);
  const listId = `${id}-list`;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsMdOrLarger(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isMdOrLarger && expanded && innerRef.current) {
      innerRef.current.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, [expanded, isMdOrLarger]);

  useEffect(() => {
    if (!wrapperRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      const mobileInitialRotation = isArchive
        ? Math.sign(initialRotation) * 4
        : initialRotation;
      const mobileInnerRotation = isArchive
        ? Math.sign(innerRotation) * 3
        : innerRotation;

      gsap.fromTo(
        wrapperRef.current,
        {
          rotation:
            id === "earnings-snapshot"
              ? 0
              : isMdOrLarger
                ? initialRotation
                : mobileInitialRotation,
        },
        {
          rotation: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        innerRef.current,
        { rotation: 0 },
        {
          rotation: isMdOrLarger ? innerRotation : mobileInnerRotation,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [id, initialRotation, innerRotation, isArchive, isMdOrLarger]);

  return (
    <div
      ref={wrapperRef}
      className={`${isContentSizedGuidance ? "h-auto" : "h-full"} will-change-transform`}
    >
      <div
        ref={innerRef}
        className={`${isContentSizedGuidance ? "h-auto" : "h-full"} w-full scroll-mt-4 rounded-[2rem] bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:scroll-mt-0 ${
          !isArchive && !isMdOrLarger && expanded ? "overflow-visible" : "overflow-hidden"
        }`}
        style={{
          transformOrigin: "center center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <FeatureCardShell
          title={title}
          subtitle={subtitle}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          bodyClassName={!isArchive && !isMdOrLarger && expanded ? "overflow-visible" : ""}
        >
          {isArchive ? (
            <ArchiveContent
              key={isMdOrLarger ? "desktop" : "mobile"}
              kind={isGuidance ? "guidance" : "earnings"}
              isMdOrLarger={isMdOrLarger}
            />
          ) : (
            <div className="min-h-0">
              <QuarterMeta quarter={LATEST_EARNINGS} />
              <HighlightList items={visibleItems} listId={listId} />
              {!isMdOrLarger && allItems.length > MOBILE_VISIBLE_COUNT && (
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-2 text-sm text-gray-500 underline underline-offset-2"
                  aria-expanded={expanded}
                  aria-controls={listId}
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </FeatureCardShell>
      </div>
    </div>
  );
}
