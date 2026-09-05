import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader transparent />
      <section className="relative min-h-screen overflow-hidden text-white">
        <div
          className="animate-drift absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(6,47,56,0.25) 0%, rgba(6,47,56,0.78) 62%, rgba(6,47,56,0.92) 100%), url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="animate-rise relative z-10 max-w-[46rem] px-[6vw] pb-16 pt-36">
          <p className="font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight">
            MyUniAssist
          </p>
          <h1 className="font-display mt-2 max-w-[18ch] text-[clamp(1.5rem,3.4vw,2.35rem)] font-bold tracking-tight">
            Build a college list that fits who you are.
          </h1>
          <p className="mt-3 max-w-[38rem] text-lg text-white/90">
            Sign in for Common Data Set lookups, campus VR tours, and an AI-assisted list builder
            tuned to your grades, activities, and goals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-[var(--citrus)] px-5 py-3 font-bold text-[var(--ink)]"
            >
              Get started
            </Link>
            <Link href="/signin" className="rounded-full border border-white/70 px-5 py-3 font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] px-[6vw] py-16">
        <h2 className="font-display text-3xl font-bold tracking-tight">Three tools. One account.</h2>
        <p className="mt-2 max-w-xl text-[var(--ink)]/75">
          After you sign in, MyUniAssist unlocks the research stack applicants actually use.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Common Data Set", "Scan acceptance rates, mid-50 test scores, and official CDS links."],
            ["VR campus tours", "Jump into each university’s official virtual tour from one place."],
            [
              "AI list builder",
              "Balance safeties, matches, and reaches using academics, personality, location, and interests.",
            ],
          ].map(([title, body], i) => (
            <article
              key={title}
              className="animate-rise border-t-2 border-[var(--teal)] pt-4"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-[var(--ink)]/75">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="px-[6vw] py-10 text-sm text-[var(--ink)]/60">
        MyUniAssist — Next.js + Tailwind + Supabase. Deploy on Vercel.
      </footer>
    </>
  );
}
