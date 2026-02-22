"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import type { SectionItem } from "@/lib/sections";
import PriceAreaChart from "@/components/charts/PriceAreaChart";
import FeatureCardShell from "@/components/cards/FeatureCardShell";

const QUOTE_SYMBOL = "PLTR";
const PRICE_REFETCH_MS = 60_000;

type MarketResponse = { isOpen: boolean; session: string; asOfET: string; reason?: string };
type PriceResponse = {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
  asOfET: string;
};
type OhlcResponse = {
  symbol: string;
  timeframe: string;
  candles: Array<{ t: number; o: number; h: number; l: number; c: number }>;
  error?: string;
};

type Props = SectionItem;

export default function SharePriceCard({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  initialRotation,
  innerRotation,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [market, setMarket] = useState<MarketResponse | null>(null);
  const [price, setPrice] = useState<PriceResponse | null>(null);
  const [ohlc, setOhlc] = useState<OhlcResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMarket = async () => {
    try {
      const res = await fetch("/api/market");
      if (res.ok) setMarket(await res.json());
    } catch { /* ignore */ }
  };
  const fetchPrice = async () => {
    try {
      const res = await fetch(`/api/price?symbol=${QUOTE_SYMBOL}`);
      if (!res.ok) throw new Error("price");
      const data = await res.json();
      setPrice(data);
      setError(false);
    } catch {
      setError(true);
      setPrice(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchOhlc = async () => {
    try {
      const res = await fetch(`/api/ohlc?symbol=${QUOTE_SYMBOL}`);
      if (res.ok) setOhlc(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => {
    (async () => {
      await fetchMarket();
      await fetchPrice();
      await fetchOhlc();
    })();
  }, []);

  useEffect(() => {
    if (!market?.isOpen) return;
    const id = setInterval(() => {
      fetchMarket();
      fetchPrice();
      fetchOhlc();
    }, PRICE_REFETCH_MS);
    return () => clearInterval(id);
  }, [market?.isOpen]);

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

  const priceStr = loading || error || price == null ? "—" : price.price.toFixed(2);
  const changeStr =
    loading || error || price == null
      ? "—"
      : (() => {
          const sign = price.change >= 0 ? "+" : "";
          return `${sign}$${price.change.toFixed(2)} (${sign}${price.changePct.toFixed(2)}%)`;
        })();
  const changeColor =
    price == null || loading || error
      ? "text-gray-500"
      : price.change > 0
        ? "text-green-600"
        : price.change < 0
          ? "text-red-600"
          : "text-gray-500";
  const marketStr = market ? (market.isOpen ? "Open" : "Closed") : "—";
  const lastUpdateStr = price?.asOfET ?? "—";

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
            <div className="flex min-w-0 shrink-0 flex-col justify-center rounded-2xl border border-gray-200 bg-white/40 p-4">
              <p className="text-xl font-semibold tracking-tight text-gray-800 md:text-2xl">
                <span className="block">{QUOTE_SYMBOL}</span>
                <span className="block">{priceStr} USD</span>
              </p>
              <p className={`mt-1 text-sm font-medium ${changeColor}`}>{changeStr}</p>
              <p className="mt-2 text-xs text-gray-400">Market: {marketStr}</p>
              <p className="mt-0.5 text-xs text-gray-400">Last update: {lastUpdateStr}</p>
              {market?.isOpen && (
                <p className="mt-2 text-xs text-gray-500">Updates every 1 min during market hours.</p>
              )}
              {error && <p className="mt-1 text-xs text-gray-500">Failed to load</p>}
            </div>
            <div className="min-h-[240px] min-w-0">
              <PriceAreaChart candles={ohlc?.candles ?? []} height={240} className="h-[240px] w-full" />
              {ohlc?.error && ohlc.candles.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">Data source error</p>
              )}
            </div>
          </div>
        </FeatureCardShell>
      </div>
    </div>
  );
}
