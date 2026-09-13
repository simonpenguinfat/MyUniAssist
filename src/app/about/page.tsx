import { MarketingNav } from "@/components/MarketingNav";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <MarketingNav />
      <section className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Built for the college list phase
        </h1>
        <p className="mt-4 text-lg text-[var(--ink)]/80">
          UniAssist helps students move from scattered spreadsheets to a signed-in workspace:
          Common Data Set research and a fit-based application list builder.
        </p>
        <p className="mt-4 text-[var(--ink)]/80">
          The matching engine weighs GPA, SAT/ACT, extracurricular themes, personality fit,
          regional preferences, university interests, and acceptance-rate bands — then sorts
          campuses into safety, match, and reach.
        </p>
      </section>
    </div>
  );
}
