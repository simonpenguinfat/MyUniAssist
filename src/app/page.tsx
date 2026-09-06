import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { UniMarquee } from "@/components/UniMarquee";
import { BrandLogo } from "@/components/BrandLogo";

export default function HomePage() {
  return (
    <div className="bg-white text-[var(--ink)]">
      <MarketingNav />

      <section className="relative min-h-[84vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 42%, rgba(255,255,255,0.35) 70%, rgba(6,47,56,0.25) 100%), url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="relative z-10 mx-auto flex min-h-[84vh] max-w-6xl flex-col justify-center px-5 py-20">
          <BrandLogo
            variant="full"
            href={null}
            priority
            className="h-[clamp(5.5rem,14vw,9rem)] w-auto"
          />
          <h1 className="font-serif mt-6 max-w-[16ch] text-[clamp(1.85rem,4vw,3.1rem)] font-semibold leading-[1.12] tracking-tight text-[var(--ink)]">
            Build a college list that actually fits you.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-[var(--ink)]/70">
            CDS research, campus VR tours, and an AI list builder — in one signed-in workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--teal)] px-6 py-3.5 text-base font-bold text-white"
            >
              Get started free
            </Link>
            <p className="text-sm text-[var(--ink)]/55">No credit card required.</p>
          </div>
        </div>
      </section>

      <UniMarquee />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-sm font-semibold italic text-[var(--teal)]">how it works</p>
        <h2 className="font-serif mt-2 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
          What you get after you sign in
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            [
              "01",
              "Common Data Set",
              "Compare acceptance rates, mid-50 scores, and jump to official CDS documents.",
            ],
            [
              "02",
              "VR campus tours",
              "Tour campuses from one list — each link goes to the school’s official virtual visit.",
            ],
            [
              "03",
              "AI list builder",
              "Turn grades, activities, personality, and location into safeties, matches, and reaches.",
            ],
          ].map(([num, title, body]) => (
            <article key={num} className="border-t border-[var(--ink)]/10 pt-5">
              <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">{num}</p>
              <h3 className="font-display mt-2 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-[var(--ink)]/70">{body}</p>
            </article>
          ))}
        </div>
        <Link
          href="/signup"
          className="mt-10 inline-flex rounded-lg bg-[var(--citrus)] px-5 py-3 font-bold text-[var(--ink)]"
        >
          Create your account
        </Link>
      </section>

      <footer className="border-t border-black/5 px-5 py-10 text-sm text-[var(--ink)]/55">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo variant="full" className="h-12 w-auto" />
          <p>University application help for building smarter lists.</p>
        </div>
      </footer>
    </div>
  );
}
