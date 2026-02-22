"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

const SUMMARY_GAP = "clamp(4px, 0.7vh, 10px)";

export default function FeatureCardShell({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  children,
  className = "",
  bodyClassName = "",
}: Props) {
  return (
    <div
      className={`flex h-full flex-col px-[clamp(12px,2vw,28px)] py-[clamp(10px,1.8vh,22px)] ${className}`}
      style={{ ["--summary-gap"]: SUMMARY_GAP } as React.CSSProperties}
    >
      <header className="shrink-0">
        <h2 className="mb-0.5 text-[clamp(15px,2.1vh,20px)] font-semibold text-gray-800">
          {title}
        </h2>
        <p className="pb-[var(--summary-gap)] text-[clamp(11px,1.4vh,14px)] text-gray-500">
          {subtitle}
        </p>
      </header>

      <div
        className={`min-h-0 flex-1 overflow-hidden ${bodyClassName}`}
      >
        {children}
      </div>

      <footer className="shrink-0 pt-[var(--summary-gap)]">
        <Link
          href={ctaHref}
          className="inline-block rounded-full bg-gray-800 px-[clamp(12px,1.6vw,20px)] py-[clamp(5px,0.9vh,10px)] text-[clamp(11px,1.35vh,14px)] font-medium text-white transition-opacity hover:opacity-90"
        >
          {ctaLabel}
        </Link>
      </footer>
    </div>
  );
}
