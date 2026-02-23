"use client";

import { useEffect, useRef } from "react";

const WIDGET_SCRIPT_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
const DEFAULT_SYMBOL = "NASDAQ:PLTR";

type TVSingleQuoteProps = {
  symbol?: string;
  className?: string;
};

export default function TVSingleQuote({
  symbol = DEFAULT_SYMBOL,
  className = "",
}: TVSingleQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSymbolRef = useRef<string>(symbol);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const existing = container.querySelector(".tradingview-widget-container");
    if (existing && lastSymbolRef.current === symbol) return;

    container.innerHTML = "";
    lastSymbolRef.current = symbol;

    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    container.appendChild(wrapper);

    const placeholder = document.createElement("div");
    placeholder.className = "tradingview-widget-container__widget";
    Object.assign(placeholder.style, {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
    wrapper.appendChild(placeholder);

    const embedScript = document.createElement("script");
    embedScript.type = "text/javascript";
    embedScript.src = WIDGET_SCRIPT_URL;
    embedScript.async = true;
    embedScript.textContent = JSON.stringify({
      symbol,
      width: "100%",
      colorTheme: "light",
      isTransparent: true,
      locale: "en",
      largeChartUrl: "",
      support_host: "https://www.tradingview.com",
    });
    wrapper.appendChild(embedScript);

    return () => {
      // Do not clear container.innerHTML so async script can run without null refs
    };
  }, [symbol]);

  return (
    <>
      <style>{`.tv-single-quote-root .tradingview-widget-container__widget iframe { display: block; margin: 0 auto; max-width: 100%; }`}</style>
      <div
        ref={containerRef}
        className={`tv-single-quote-root h-full w-full min-h-0 min-w-0 overflow-hidden ${className}`}
      />
    </>
  );
}
