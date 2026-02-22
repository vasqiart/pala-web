"use client";

import { useEffect, useRef } from "react";

export type Candle = { t: number; o: number; h: number; l: number; c: number };

type Props = {
  candles: Candle[];
  className?: string;
  height?: number;
};

const DEFAULT_HEIGHT = 240;
const MIN_HEIGHT = 220;

export default function PriceAreaChart({
  candles,
  className = "",
  height = DEFAULT_HEIGHT,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<import("lightweight-charts").IChartApi | null>(null);
  const seriesRef = useRef<ReturnType<import("lightweight-charts").IChartApi["addSeries"]> | null>(null);

  const h = Math.max(MIN_HEIGHT, height);
  const isEmpty = !candles?.length;

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || isEmpty) return;

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    const container = containerRef.current;

    const applySize = () => {
      if (!chartRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const H = containerRef.current.clientHeight;
      if (w > 0 && H > 0) chartRef.current.applyOptions({ width: w, height: H });
    };

    import("lightweight-charts").then(({ createChart, CandlestickSeries }) => {
      if (cancelled || !containerRef.current) return;
      const chart = createChart(container, {
        layout: { textColor: "#6b7280" },
        grid: { vertLines: { visible: false }, horzLines: { color: "rgba(0,0,0,0.06)" } },
        rightPriceScale: { borderVisible: true },
        timeScale: { borderVisible: true, timeVisible: true, secondsVisible: false },
        width: container.clientWidth || 400,
        height: h,
      });
      chartRef.current = chart;
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: true,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      seriesRef.current = series;
      const data = candles.map(({ t, o, h: high, l: low, c: close }) => ({
        time: Math.floor(t / 1000) as import("lightweight-charts").UTCTimestamp,
        open: o,
        high,
        low,
        close,
      }));
      series.setData(data);
      chart.timeScale().fitContent();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          applySize();
          let retries = 0;
          const retry = () => {
            if (!containerRef.current || retries >= 3) return;
            if (containerRef.current.clientWidth === 0) {
              retries++;
              setTimeout(retry, 0);
            } else applySize();
          };
          setTimeout(retry, 0);
        });
      });

      ro = new ResizeObserver(() => applySize());
      ro.observe(container);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [isEmpty, h]);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || isEmpty) return;
    const data = candles.map(({ t, o, h: high, l: low, c: close }) => ({
      time: Math.floor(t / 1000) as import("lightweight-charts").UTCTimestamp,
      open: o,
      high,
      low,
      close,
    }));
    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
  }, [candles, isEmpty]);

  if (isEmpty) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50/50 ${className}`}
        style={{ minHeight: h }}
      >
        <p className="text-sm text-gray-500">No data</p>
        <p className="mt-1 text-xs text-gray-400">Try again later</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: h, minHeight: h }}
    />
  );
}
