"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

const tools = [
  {
    href: "/tools/common-data-set",
    title: "Common Data Set",
    desc: "Browse acceptance rates, GPA/test midpoints, and official CDS links.",
    icon: "cds",
  },
  {
    href: "/tools/vr-tours",
    title: "VR campus tours",
    desc: "Open each university’s official virtual tour in one click.",
    icon: "vr",
  },
  {
    href: "/tools/list-builder",
    title: "AI list builder",
    desc: "Build safeties, matches, and reaches from your academics and fit.",
    icon: "list",
  },
  {
    href: "/dashboard",
    title: "Your workspace",
    desc: "Signed-in home for all tools, saved in one personal account.",
    icon: "dash",
  },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <BrandLogo variant="full" className="h-9 w-auto max-w-[12rem]" priority />

        <nav className="relative flex items-center gap-6 text-sm font-semibold text-[var(--ink)]/80" ref={panelRef}>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-[var(--teal)]"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            Tools
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <Link href="/about" className="hidden hover:text-[var(--teal)] sm:inline">
            About
          </Link>

          {open && (
            <div className="absolute left-1/2 top-[calc(100%+0.75rem)] w-[min(920px,92vw)] -translate-x-1/2 rounded-2xl border border-black/8 bg-white p-5 shadow-[0_24px_60px_rgba(11,31,40,0.14)] md:left-0 md:translate-x-0">
              <div className="grid gap-2 md:grid-cols-[1.4fr_0.8fr]">
                <div className="grid gap-1 sm:grid-cols-2">
                  {tools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl p-3 transition hover:bg-[var(--fog)]"
                    >
                      <div className="mb-2 text-[var(--teal)]">{toolIcon(t.icon)}</div>
                      <p className="font-bold text-[var(--ink)]">{t.title}</p>
                      <p className="mt-1 text-sm font-normal text-[var(--ink)]/65">{t.desc}</p>
                    </Link>
                  ))}
                </div>
                <aside className="rounded-xl bg-[var(--fog)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--teal)]">
                    Start here
                  </p>
                  <p className="mt-3 font-display text-xl font-bold text-[var(--ink)]">
                    Build a smarter college list
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink)]/70">
                    Create a free account to unlock CDS research, VR tours, and the list builder.
                  </p>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="mt-4 inline-flex rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-bold text-white"
                  >
                    Create account →
                  </Link>
                </aside>
              </div>
            </div>
          )}
        </nav>

        <Link
          href="/signin"
          className="rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-bold text-white"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

function toolIcon(kind: string) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
  } as const;
  if (kind === "cds")
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M9 4v16" />
      </svg>
    );
  if (kind === "vr")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    );
  if (kind === "list")
    return (
      <svg {...common}>
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
