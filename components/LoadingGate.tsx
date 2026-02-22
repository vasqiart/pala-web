"use client";

import { useEffect, useState } from "react";

const LOADING_KEY = "paradog-loading-done";
const LOADING_DURATION_MS = 2500;

export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoading, setShowLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const done = sessionStorage.getItem(LOADING_KEY);
    if (done === "1") {
      const t = setTimeout(() => setShowLoading(false), 0);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem(LOADING_KEY, "1");
      setShowLoading(false);
    }, LOADING_DURATION_MS);

    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-pulse rounded-full text-lg text-gray-500">
          ぱらどっぐ
        </div>
      </div>
    );
  }

  if (!showLoading) {
    return <>{children}</>;
  }

  // ローディング中は children を描画しない（invisible で描画すると FV の Image が DOM に出ない事象を避ける）
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-[#f8f8f8]"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2">
        <span
          className="animate-bounce text-xl font-medium text-gray-600"
          style={{ animationDuration: "1.2s" }}
        >
          ぱらどっぐ × Palantir
        </span>
        <span className="text-xs text-gray-400">unofficial fan site</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
