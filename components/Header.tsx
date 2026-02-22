"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "TOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/company", label: "PALANTIR" },
  { href: "/price", label: "SHARE PRICE" },
  { href: "/earnings", label: "EARNINGS" },
  { href: "/contracts", label: "CONTRACTS" },
  { href: "/karp", label: "KARP" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > lastY && y > 80) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          setLastY(y);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 transition-transform duration-300 ease-out md:px-6 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
      }}
    >
      <Link
        href="/"
        className="flex flex-col rounded-2xl px-2 py-1 transition-opacity hover:opacity-80"
      >
        <span className="text-sm font-medium text-gray-800 md:text-base">
          ぱらどっぐ × Palantir
        </span>
        <span className="text-[10px] text-gray-500 md:text-xs">
          Unofficial fan site
        </span>
      </Link>

      {/* PC: 横並びメニュー */}
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-gray-200 text-gray-800"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            {label}
          </Link>
        ))}
        <a
          href="https://x.com/PLTR_Dog"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          X
        </a>
      </nav>

      {/* SP: ハンバーガー */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700"
          aria-label="メニュー"
          aria-expanded={mobileOpen}
        >
          <span className="flex h-4 w-5 flex-col justify-between">
            <span
              className={`block h-0.5 w-4 rounded-full bg-current transition-transform ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-current transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-current transition-transform ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
      {mobileOpen && (
        <div
          className="absolute left-0 right-0 top-full border-t border-gray-200 bg-white/98 shadow-lg md:hidden"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <nav className="flex flex-col p-4">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  pathname === href
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://x.com/PLTR_Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-gray-800 px-4 py-3 text-center text-sm font-medium text-white"
            >
              X
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
