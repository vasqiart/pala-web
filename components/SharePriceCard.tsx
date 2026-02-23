"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { SectionItem } from "@/lib/sections";
import FeatureCardShell from "@/components/cards/FeatureCardShell";
import TVSingleQuote from "@/components/TVSingleQuote";
import TVChart from "@/components/TVChart";

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
            <div className="relative flex h-[240px] min-w-0 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/40 p-4" style={{ width: "100%" }} data-share-price-left-card>
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="flex h-[200px] w-full max-w-full flex-col overflow-hidden" data-share-price-widget-frame>
                  <div className="min-h-0 w-full flex-1">
                    <TVSingleQuote className="h-full w-full min-h-0" />
                  </div>
                  <p className="shrink-0 pt-1 text-center text-xs text-gray-500">
                    ※この株価は15分遅れなので参考程度にお頼み申す
                  </p>
                </div>
              </div>
            </div>
            <div className="min-h-[240px] min-w-0 overflow-hidden" style={{ width: "100%" }}>
              <TVChart height={240} className="h-[240px] w-full" />
            </div>
          </div>
        </FeatureCardShell>
      </div>
    </div>
  );
}
