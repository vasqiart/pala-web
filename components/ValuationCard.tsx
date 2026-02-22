"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import type { SectionItem } from "@/lib/sections";
import type { FundamentalsResponse } from "@/app/api/fundamentals/route";
import type { ValuationHistoryResponse } from "@/app/api/valuation-history/route";
import MiniSparkline from "@/components/charts/MiniSparkline";
import FeatureCardShell from "@/components/cards/FeatureCardShell";

const TABS = [
  { id: "marketcap", label: "Market Cap" },
  { id: "ps", label: "P/S (TTM / NTM)" },
  { id: "pe", label: "P/E (TTM / NTM)" },
  { id: "rule40", label: "Rule of 40 (TTM)" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = SectionItem;

export default function ValuationCard({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  initialRotation,
  innerRotation,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fund, setFund] = useState<FundamentalsResponse | null>(null);
  const [history, setHistory] = useState<ValuationHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("marketcap");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fundRes, historyRes] = await Promise.all([
          fetch("/api/fundamentals?symbol=PLTR"),
          fetch("/api/valuation-history?symbol=PLTR"),
        ]);
        if (!cancelled && fundRes.ok) setFund(await fundRes.json());
        if (!cancelled && historyRes.ok) setHistory(await historyRes.json());
      } catch {
        if (!cancelled) setFund(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current || !innerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { rotation: initialRotation },
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
          rotation: innerRotation,
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
  }, [initialRotation, innerRotation]);

  const marketCap =
    fund && fund.price > 0 && fund.sharesDiluted > 0 ? fund.price * fund.sharesDiluted : null;
  const marketCapB = marketCap != null ? marketCap / 1e9 : null;
  const psTTM =
    marketCap != null && fund && fund.revenueTTM > 0 ? marketCap / fund.revenueTTM : null;
  const psNTM =
    marketCap != null && fund?.revenueNTM != null && fund.revenueNTM > 0
      ? marketCap / fund.revenueNTM
      : null;
  const peTTM =
    fund && fund.price > 0 && fund.epsTTM != null && fund.epsTTM > 0
      ? fund.price / fund.epsTTM
      : null;
  const peNTM =
    fund && fund.price > 0 && fund.epsNTM != null && fund.epsNTM > 0
      ? fund.price / fund.epsNTM
      : null;
  const revGrowth =
    fund?.revenueTTM != null && fund?.revenueTTM1yAgo != null && fund.revenueTTM1yAgo > 0
      ? (fund.revenueTTM / fund.revenueTTM1yAgo - 1) * 100
      : null;
  const fcfMargin =
    fund?.fcfTTM != null && fund?.revenueTTM != null && fund.revenueTTM > 0
      ? (fund.fcfTTM / fund.revenueTTM) * 100
      : null;
  const rule40 = revGrowth != null && fcfMargin != null ? revGrowth + fcfMargin : null;

  const points = history?.points ?? [];
  const shares = fund?.sharesDiluted ?? 0;
  const marketCapSparkline = points.map((p) => ({ t: p.t, v: p.marketCap }));
  const psTTMSparkline =
    fund?.revenueTTM != null && fund.revenueTTM > 0
      ? points.map((p) => ({ t: p.t, v: p.marketCap / fund.revenueTTM }))
      : [];
  const epsTTM = fund?.epsTTM;
  const peTTMSparkline =
    shares > 0 && epsTTM != null && epsTTM > 0
      ? points.map((p) => ({ t: p.t, v: (p.marketCap / shares) / epsTTM }))
      : [];

  const naReason = (tab: TabId): string | null => {
    if (tab === "marketcap") return fund?.sharesDiluted === 0 ? "Missing diluted shares" : null;
    if (tab === "ps")
      return psTTM == null ? "Missing revenue TTM" : psNTM == null ? "Missing revenue NTM" : null;
    if (tab === "pe")
      return peTTM == null ? "Missing EPS TTM" : peNTM == null ? "Missing EPS NTM" : null;
    if (tab === "rule40")
      return rule40 == null ? "Missing revenue TTM or FCF TTM or prior year revenue" : null;
    return null;
  };

  return (
    <div
      ref={wrapperRef}
      className="will-change-transform"
      style={{ transform: `rotate(${initialRotation}deg)`, transformOrigin: "center center" }}
    >
      <div
        ref={innerRef}
        className="h-full w-full min-w-0 overflow-hidden rounded-[2rem] bg-white/95 md:min-w-[640px]"
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
        >
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[120px]">
          {activeTab === "marketcap" && (
            <>
              <p className="text-2xl font-semibold text-gray-800 md:text-3xl">
                {loading ? "—" : marketCapB != null ? `$${marketCapB.toFixed(2)} B` : "N/A"}
              </p>
              {marketCapB == null && !loading && (
                <p className="mt-1 text-xs text-gray-500">{naReason("marketcap") ?? ""}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">as-of {fund?.asOfET ?? "—"}</p>
              <div className="mt-2 h-14 w-full max-w-[200px]">
                {marketCapSparkline.length > 0 ? (
                  <MiniSparkline points={marketCapSparkline} height={56} />
                ) : (
                  <span className="text-xs text-gray-400">No history</span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                <strong>Formula:</strong> Market Cap = Last Price × Diluted Shares Outstanding.
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                <strong>Data:</strong> Last Price (real-time), Diluted Shares (latest filing).
              </p>
            </>
          )}
          {activeTab === "ps" && (
            <>
              <p className="text-2xl font-semibold text-gray-800 md:text-3xl">
                {loading ? "—" : psTTM != null ? `TTM ${psTTM.toFixed(1)}x` : "N/A"}
                {psNTM != null && ` / NTM ${psNTM.toFixed(1)}x`}
              </p>
              {psTTM == null && psNTM == null && !loading && (
                <p className="mt-1 text-xs text-gray-500">{naReason("ps") ?? ""}</p>
              )}
              {psTTM != null && psNTM == null && !loading && (
                <p className="mt-1 text-xs text-gray-500">NTM: Missing NTM estimates</p>
              )}
              <p className="mt-1 text-xs text-gray-500">as-of {fund?.asOfET ?? "—"}</p>
              <div className="mt-2 h-14 w-full max-w-[200px]">
                {psTTMSparkline.length > 0 ? (
                  <MiniSparkline points={psTTMSparkline} height={56} />
                ) : (
                  <span className="text-xs text-gray-400">No history</span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                <strong>Formula:</strong> P/S (TTM) = Market Cap / Revenue (TTM). P/S (NTM) = Market Cap / Revenue (NTM estimate).
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                <strong>Data:</strong> Revenue (TTM/NTM from filings and estimates).
              </p>
            </>
          )}
          {activeTab === "pe" && (
            <>
              <p className="text-2xl font-semibold text-gray-800 md:text-3xl">
                {loading ? "—" : peTTM != null ? `TTM ${peTTM.toFixed(0)}x` : "N/A"}
                {peNTM != null && ` / NTM ${peNTM.toFixed(0)}x`}
              </p>
              {peTTM == null && peNTM == null && !loading && (
                <p className="mt-1 text-xs text-gray-500">{naReason("pe") ?? ""}</p>
              )}
              {peTTM != null && peNTM == null && !loading && (
                <p className="mt-1 text-xs text-gray-500">NTM: Missing NTM estimates</p>
              )}
              <p className="mt-1 text-xs text-gray-500">as-of {fund?.asOfET ?? "—"}</p>
              <div className="mt-2 h-14 w-full max-w-[200px]">
                {peTTMSparkline.length > 0 ? (
                  <MiniSparkline points={peTTMSparkline} height={56} />
                ) : (
                  <span className="text-xs text-gray-400">No history</span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                <strong>Formula:</strong> P/E (TTM) = Price / EPS (TTM GAAP). P/E (NTM) = Price / EPS (NTM estimate).
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                <strong>Data:</strong> EPS (TTM/NTM from filings and estimates).
              </p>
            </>
          )}
          {activeTab === "rule40" && (
            <>
              <p className="text-2xl font-semibold text-gray-800 md:text-3xl">
                {loading ? "—" : rule40 != null ? `${rule40.toFixed(1)}%` : "N/A"}
              </p>
              {rule40 == null && !loading && (
                <p className="mt-1 text-xs text-gray-500">{naReason("rule40") ?? ""}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">as-of {fund?.asOfET ?? "—"}</p>
              <div className="mt-2 h-14 w-full max-w-[200px]">
                {marketCapSparkline.length > 0 ? (
                  <MiniSparkline points={marketCapSparkline} height={56} />
                ) : (
                  <span className="text-xs text-gray-400">No history</span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                <strong>Formula:</strong> Rule of 40 (TTM) = Revenue Growth (TTM YoY) + FCF Margin (TTM).
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                <strong>Data:</strong> Revenue TTM, FCF TTM, Revenue TTM 1y ago.
              </p>
            </>
          )}
        </div>
        </FeatureCardShell>
      </div>
    </div>
  );
}
