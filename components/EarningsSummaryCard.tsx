"use client";

import { type ReactNode, useEffect, useRef } from "react";
import FeatureCardShell from "@/components/cards/FeatureCardShell";
import { gsap } from "@/lib/gsap";
import type { SectionItem } from "@/lib/sections";

type Props = SectionItem;

function RowCard({
  number,
  children,
}: {
  number: number;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 rounded-[10px] border border-black/5 bg-black/[0.015] px-[10px] py-[clamp(3px,0.55vh,8px)]">
      <div className="w-8 shrink-0 text-right text-[clamp(10px,1.25vh,13px)] font-semibold text-gray-500">
        {number}.
      </div>
      <p className="min-w-0 whitespace-pre-wrap break-words text-[clamp(10.5px,1.38vh,14px)] font-normal leading-[1.42] text-gray-700">
        {children}
      </p>
    </li>
  );
}

export default function EarningsSummaryCard({
  ctaLabel,
  ctaHref,
  initialRotation,
  innerRotation,
}: Props) {
  const summaryRotation = 0;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { rotation: summaryRotation },
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
  }, [summaryRotation, innerRotation]);

  return (
    <div
      ref={wrapperRef}
      className="h-full will-change-transform"
      style={{
        transform: `rotate(${summaryRotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <div
        ref={innerRef}
        className="h-full w-full overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        style={{
          transformOrigin: "center center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <FeatureCardShell
          title="Earnings Snapshot"
          subtitle="Latest Quarter Highlights"
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
        >
          <ul className="space-y-[clamp(3px,0.55vh,8px)]">
              <RowCard number={1}>
                US revenue は<span className="text-xs text-gray-500">前年同期比</span>{" "}
                <span className="text-gray-500">+93%</span>、<span className="text-xs text-gray-500">前四半期比</span>{" "}
                <span className="text-gray-500">+22%</span> 増の{" "}
                <span className="font-semibold text-gray-800">$1.08 billion（約¥1,674億円）</span> に拡大しました。
              </RowCard>
              <RowCard number={2}>
                US commercial revenue は<span className="text-xs text-gray-500">前年同期比</span>{" "}
                <span className="text-gray-500">+137%</span>、<span className="text-xs text-gray-500">前四半期比</span>{" "}
                <span className="text-gray-500">+28%</span> 増の{" "}
                <span className="font-semibold text-gray-800">$507 million（約¥786億円）</span> に拡大しました。
              </RowCard>
              <RowCard number={3}>
                US government revenue は<span className="text-xs text-gray-500">前年同期比</span>{" "}
                <span className="text-gray-500">+66%</span>、<span className="text-xs text-gray-500">前四半期比</span>{" "}
                <span className="text-gray-500">+17%</span> 増の{" "}
                <span className="font-semibold text-gray-800">$570 million（約¥884億円）</span> に拡大しました。
              </RowCard>
              <RowCard number={4}>
                <span className="block">
                  売上は<span className="text-xs text-gray-500">前年同期比</span>{" "}
                  <span className="text-gray-500">+70%</span>、<span className="text-xs text-gray-500">前四半期比</span>{" "}
                  <span className="text-gray-500">+19%</span> 増の{" "}
                  <span className="font-semibold text-gray-800">$1.41 billion（約¥2,186億円）</span> に拡大しました。
                </span>
                <span className="block text-gray-500">
                  <span className="block">
                    {"また Strategic Commercial Contracts を除くと、前年同期比 +72%、前四半期比 +19% でした。"}
                  </span>
                </span>
              </RowCard>
              <RowCard number={5}>
                Rule of 40 スコアは <strong className="text-gray-800">127%</strong> でした。
              </RowCard>
              <RowCard number={6}>
                <span className="font-semibold text-gray-800">$1 million</span>以上 の案件を 180件、
                <span className="font-semibold text-gray-800">$5 million</span>以上 を 84件、
                <span className="font-semibold text-gray-800">$10 million</span>以上 を 61件 クローズしました。
              </RowCard>
              <RowCard number={7}>
                Adjusted free cash flow は{" "}
                <span className="font-semibold text-gray-800">$791 million（約¥1,226億円）</span>、マージンは{" "}
                <span className="text-gray-500">56%</span> でした。
              </RowCard>
              <RowCard number={8}>
                Adjusted operating income は{" "}
                <span className="font-semibold text-gray-800">$798 million（約¥1,237億円）</span>、マージンは{" "}
                <span className="text-gray-500">57%</span> でした。
              </RowCard>
              <RowCard number={9}>
                US commercial remaining deal value（“RDV”） は
                <span className="text-xs text-gray-500">前年同期比</span>{" "}
                <span className="text-gray-500">+145%</span>、
                <span className="text-xs text-gray-500">前四半期比</span>{" "}
                <span className="text-gray-500">+21%</span> 増の{" "}
                <span className="font-semibold text-gray-800">$4.38 billion（約¥6,789億円）</span> に拡大しました。
              </RowCard>
              <RowCard number={10}>
                US commercial total contract value（“TCV”） は過去最高の四半期となり、
                <span className="font-semibold text-gray-800">$1.34 billion（約¥2,077億円）</span>。
                <span className="text-xs text-gray-500">前年同期比</span>{" "}
                <span className="text-gray-500">+67%</span> でした。
              </RowCard>
              <RowCard number={11}>
                TCV は過去最高の四半期となり、
                <span className="font-semibold text-gray-800">$4.26 billion（約¥6,603億円）</span>。
                <span className="text-xs text-gray-500">前年同期比</span>{" "}
                <span className="text-gray-500">+138%</span> でした。
              </RowCard>
              <RowCard number={12}>
                Adjusted EPS は <span className="font-semibold text-gray-800">$0.25（約¥38.75）</span>
                、GAAP EPS は <span className="font-semibold text-gray-800">$0.24（約¥37.20）</span> でした。
              </RowCard>
            </ul>
        </FeatureCardShell>
      </div>
    </div>
  );
}
