"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  usePortalOnMobile?: boolean;
};

const MOBILE_MAX_WIDTH = 767;

function getViewportHeightPx(): number {
  if (typeof window === "undefined") return 768;
  return window.visualViewport?.height ?? window.innerHeight;
}

export default function BackgroundPortal({ children, usePortalOnMobile }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [vvhPx, setVvhPx] = useState<number | null>(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => setIsMobile(mq.matches);

    update();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    } else {
      // legacy Safari (addListener/removeListener not in MediaQueryList type)
      // @ts-expect-error legacy Safari MediaQueryList
      mq.addListener(update);
      // @ts-expect-error legacy Safari MediaQueryList
      return () => mq.removeListener(update);
    }
  }, []);

  const shouldPortal = Boolean(usePortalOnMobile) && isMobile;

  useLayoutEffect(() => {
    if (!shouldPortal || typeof window === "undefined") return;

    const update = () => {
      const h = getViewportHeightPx();
      setVvhPx((prev) => (prev === h ? prev : h));
    };

    update();

    const vv = window.visualViewport;
    let rafId: number | null = null;

    const onViewportChange = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    if (vv) {
      vv.addEventListener("resize", onViewportChange);
      return () => {
        vv.removeEventListener("resize", onViewportChange);
        if (rafId != null) cancelAnimationFrame(rafId);
      };
    } else {
      window.addEventListener("resize", onViewportChange);
      return () => {
        window.removeEventListener("resize", onViewportChange);
        if (rafId != null) cancelAnimationFrame(rafId);
      };
    }
  }, [shouldPortal]);

  // PC または Portal不要
  if (!shouldPortal) return <>{children}</>;

  // モバイル Portal対象 → mounted まで描画しない（チラつき防止）
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-0 pointer-events-none"
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: vvhPx != null ? `${vvhPx}px` : "100vh",
      }}
    >
      {children}
    </div>,
    document.body
  );
}
