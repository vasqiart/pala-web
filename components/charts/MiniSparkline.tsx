"use client";

import { useEffect, useRef } from "react";

export type SparkPoint = { t: number; v: number };

type Props = {
  points: SparkPoint[];
  height?: number;
  className?: string;
};

const DEFAULT_HEIGHT = 56;

export default function MiniSparkline({
  points,
  height = DEFAULT_HEIGHT,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<import("lightweight-charts").IChartApi | null>(null);
  const seriesRef = useRef<ReturnType<import("lightweight-charts").IChartApi["addSeries"]> | null>(null);

  const isEmpty = !points?.length;

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

    import("lightweight-charts").then(({ createChart, LineSeries }) => {
      if (cancelled || !containerRef.current) return;
      const chart = createChart(container, {
        layout: { textColor: "transparent" },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        rightPriceScale: { visible: false, borderVisible: false },
        leftPriceScale: { visible: false, borderVisible: false },
        timeScale: { visible: false, borderVisible: false },
        crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
        width: container.clientWidth || 120,
        height,
      });
      chartRef.current = chart;
      const series = chart.addSeries(LineSeries, { color: "#6b7280", lineWidth: 1 });
      seriesRef.current = series;
      const data = points.map(({ t, v }) => ({
        time: Math.floor(t / 1000) as import("lightweight-charts").UTCTimestamp,
        value: v,
      }));
      series.setData(data);
      chart.timeScale().fitContent();

      requestAnimationFrame(() => requestAnimationFrame(applySize));
      ro = new ResizeObserver(applySize);
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
  }, [isEmpty, height]);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || isEmpty) return;
    const data = points.map(({ t, v }) => ({
      time: Math.floor(t / 1000) as import("lightweight-charts").UTCTimestamp,
      value: v,
    }));
    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
  }, [points, isEmpty]);

  if (isEmpty) {
    return (
      <div
        className={`flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={{ height }}
      >
        —
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height, minHeight: height }}
    />
  );
}
