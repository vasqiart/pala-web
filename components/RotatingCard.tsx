"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { SectionItem } from "@/lib/sections";
import FeatureCardShell from "@/components/cards/FeatureCardShell";
import MobileButtonDogIcon from "@/components/MobileButtonDogIcon";

type Props = SectionItem;

function MobileCtaDog({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={32}
      height={32}
      className="h-8 w-auto pointer-events-none"
    />
  );
}

export default function RotatingCard({
  id,
  title,
  subtitle,
  description,
  ctaLabel,
  ctaHref,
  initialRotation,
  innerRotation,
  links,
  cardImage,
  cardDecorImage,
  inlineImage,
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

  const paragraphs = description.split(/\n\n+/);
  const isAboutLinksCard = id === "links" && Array.isArray(links) && links.length > 0;

  return (
    <div
      ref={wrapperRef}
      className="will-change-transform"
      style={{
        transform: `rotate(${initialRotation}deg)`,
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
        {cardDecorImage ? (
          <div className="relative h-full w-full">
            <div
              className={`flex h-full gap-4 ${cardImage ? "flex-col md:flex-row md:items-end" : ""} ${isAboutLinksCard ? "h-full" : ""}`}
            >
              <FeatureCardShell
                title={title}
                subtitle={subtitle}
                ctaLabel={ctaLabel}
                ctaHref={ctaHref}
                className={cardImage ? "min-w-0 flex-1" : ""}
                bodyClassName={isAboutLinksCard ? "flex flex-col min-h-0" : ""}
                footerTrailing={
                  id === "karp" && cardDecorImage ? (
                    <MobileCtaDog src={cardDecorImage} alt="" />
                  ) : undefined
                }
              >
                <div className={isAboutLinksCard ? "mb-4 shrink-0" : "mb-6"}>
              {inlineImage ? (
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 whitespace-pre-line text-sm leading-relaxed text-gray-600 md:text-base">
                    {paragraphs.map((p) => p.trim()).join("\n\n")}
                  </p>
                  <a
                    href={inlineImage.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center underline decoration-gray-400 hover:opacity-90 hover:decoration-gray-600 transition-opacity"
                    aria-label="Open Palantir Investors"
                  >
                    <Image
                      src={inlineImage.src}
                      alt=""
                      width={133}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                  </a>
                </div>
              ) : (
                paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`whitespace-pre-line text-sm ${id === "company" || id === "karp" ? "leading-6" : "leading-relaxed"} text-gray-600 md:text-base ${i < paragraphs.length - 1 ? (id === "earnings" || id === "company" || id === "karp" ? "mb-1" : "mb-3") : ""}`}
                  >
                    {paragraph.trim()}
                  </p>
                ))
              )}
            </div>
            {links && links.length > 0 && (
              <ul
                className={
                  isAboutLinksCard
                    ? "mb-4 flex-1 min-h-0 space-y-2 overflow-y-auto pr-1"
                    : "mb-6 space-y-2"
                }
              >
                {links.map((item, i) => (
                  <li key={i} className={isAboutLinksCard ? "h-14" : ""}>
                    {isAboutLinksCard ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-14 w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/60 px-3 py-2 text-left transition duration-200 hover:-translate-y-[1px] hover:border-gray-300 hover:shadow-[0_8px_18px_rgba(0,0,0,0.07)]"
                        aria-label={`Open link: ${item.title}`}
                      >
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded">
                          <Image
                            src={`/assets/logos/${item.logo}`}
                            alt=""
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium leading-tight text-gray-800">{item.title}</span>
                          <span className="mt-0.5 block truncate text-xs leading-tight text-gray-500">
                            {item.description}
                          </span>
                        </span>
                      </a>
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 transition-colors hover:bg-gray-100/90"
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                          <Image
                            src={`/assets/logos/${item.logo}`}
                            alt=""
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-gray-800">{item.title}</span>
                          <span className="mt-1 block truncate text-xs text-gray-500">{item.description}</span>
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
              </FeatureCardShell>
              {cardImage && (
                <div
                  className={
                    id === "company"
                      ? "flex w-[200px] shrink-0 justify-center pb-[clamp(10px,1.8vh,22px)] pr-[clamp(12px,2vw,28px)] pt-[clamp(10px,1.8vh,22px)] md:mt-2 md:w-[220px] md:self-end md:mr-20"
                      : "shrink-0 pb-[clamp(10px,1.8vh,22px)] pr-[clamp(12px,2vw,28px)] pt-[clamp(10px,1.8vh,22px)] md:mt-2 md:self-end"
                  }
                >
                  <Image
                    src={cardImage}
                    alt="paradog"
                    width={220}
                    height={220}
                    className="h-auto w-[160px] md:w-[200px] lg:w-[220px]"
                  />
                </div>
              )}
            </div>
            <div
              className="absolute right-14 top-1/2 z-10 h-auto w-[clamp(140px,16vw,220px)] -translate-y-1/2 pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] bg-transparent hidden md:block"
              aria-hidden
            >
              <Image
                src={cardDecorImage}
                alt=""
                width={220}
                height={220}
                className="block h-auto w-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div
            className={`flex h-full gap-4 ${cardImage ? "flex-col md:flex-row md:items-end" : ""} ${isAboutLinksCard ? "h-full" : ""}`}
          >
            <FeatureCardShell
              title={title}
              subtitle={subtitle}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              className={cardImage ? "min-w-0 flex-1" : ""}
              bodyClassName={isAboutLinksCard ? "flex flex-col min-h-0" : ""}
              footerTrailing={
                (id === "about" || id === "company") && cardImage ? (
                  <MobileButtonDogIcon src={cardImage} alt="" />
                ) : undefined
              }
            >
              <div className={isAboutLinksCard ? "mb-4 shrink-0" : "mb-6"}>
                {inlineImage ? (
                  <div className="flex flex-col gap-2 items-start md:flex-row md:items-center md:justify-between md:gap-3">
                    <p className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-relaxed text-gray-600 md:overflow-visible md:whitespace-pre-line md:text-base">
                      {paragraphs.map((p) => p.trim()).join("\n\n")}
                    </p>
                    <a
                      href={inlineImage.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center underline decoration-gray-400 opacity-80 transition-opacity md:opacity-100 md:hover:opacity-90 md:hover:decoration-gray-600"
                      aria-label="Open Palantir Investors"
                    >
                      <Image
                        src={inlineImage.src}
                        alt=""
                        width={133}
                        height={32}
                        className="w-16 h-auto object-contain md:w-auto md:h-8"
                      />
                    </a>
                  </div>
                ) : (
                  paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className={`whitespace-pre-line text-sm ${id === "company" || id === "karp" ? "leading-6" : "leading-relaxed"} text-gray-600 md:text-base ${i < paragraphs.length - 1 ? (id === "earnings" || id === "company" || id === "karp" ? "mb-1" : "mb-3") : ""}`}
                    >
                      {paragraph.trim()}
                    </p>
                  ))
                )}
              </div>
              {links && links.length > 0 && (
                <ul
                  className={
                    isAboutLinksCard
                      ? "mb-4 flex-1 min-h-0 space-y-2 overflow-y-auto pr-1"
                      : "mb-6 space-y-2"
                  }
                >
                  {links.map((item, i) => (
                    <li key={i} className={isAboutLinksCard ? "h-14" : ""}>
                      {isAboutLinksCard ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-14 w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/60 px-3 py-2 text-left transition duration-200 hover:-translate-y-[1px] hover:border-gray-300 hover:shadow-[0_8px_18px_rgba(0,0,0,0.07)]"
                          aria-label={`Open link: ${item.title}`}
                        >
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded">
                            <Image
                              src={`/assets/logos/${item.logo}`}
                              alt=""
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-tight text-gray-800">{item.title}</span>
                            <span className="mt-0.5 block truncate text-xs leading-tight text-gray-500">
                              {item.description}
                            </span>
                          </span>
                        </a>
                      ) : (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 transition-colors hover:bg-gray-100/90"
                        >
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                            <Image
                              src={`/assets/logos/${item.logo}`}
                              alt=""
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-gray-800">{item.title}</span>
                            <span className="mt-1 block truncate text-xs text-gray-500">{item.description}</span>
                          </span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </FeatureCardShell>
            {cardImage && (
              <div
                className={
                  id === "company"
                    ? "flex w-[200px] shrink-0 justify-center pb-[clamp(10px,1.8vh,22px)] pr-[clamp(12px,2vw,28px)] pt-[clamp(10px,1.8vh,22px)] md:mt-2 md:w-[220px] md:self-end md:mr-20 hidden md:flex"
                    : `shrink-0 pb-[clamp(10px,1.8vh,22px)] pr-[clamp(12px,2vw,28px)] pt-[clamp(10px,1.8vh,22px)] md:mt-2 md:self-end${id === "about" ? " hidden md:block" : ""}`
                }
              >
                <Image
                  src={cardImage}
                  alt="paradog"
                  width={220}
                  height={220}
                  className="h-auto w-[160px] md:w-[200px] lg:w-[220px]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
