"use client";

import { useEffect, useRef } from "react";

const WIDGET_SCRIPT_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
const DEFAULT_SYMBOL = "NASDAQ:PLTR";

type TVChartProps = {
  symbol?: string;
  className?: string;
  height?: number;
};

export default function TVChart({
  symbol = DEFAULT_SYMBOL,
  className = "",
  height = 240,
}: TVChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastInitRef = useRef<{ symbol: string; height: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const existing = container.querySelector(".tradingview-widget-container");
    const same =
      lastInitRef.current?.symbol === symbol && lastInitRef.current?.height === height;
    if (existing && same) return;

    container.innerHTML = "";
    lastInitRef.current = { symbol, height };

    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    wrapper.style.minHeight = `${height}px`;
    container.appendChild(wrapper);

    const placeholder = document.createElement("div");
    placeholder.className = "tradingview-widget-container__widget";
    placeholder.style.height = "calc(100% - 32px)";
    placeholder.style.width = "100%";
    wrapper.appendChild(placeholder);

    const embedScript = document.createElement("script");
    embedScript.type = "text/javascript";
    embedScript.src = WIDGET_SCRIPT_URL;
    embedScript.async = true;
    embedScript.textContent = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    wrapper.appendChild(embedScript);

    return () => {
      // Do not clear container.innerHTML so async script can run without null refs
    };
  }, [symbol, height]);

  return (
    <div
      ref={containerRef}
      className={`min-h-[240px] min-w-0 overflow-hidden ${className}`}
      style={{ width: "100%", minHeight: height }}
    />
  );
}
