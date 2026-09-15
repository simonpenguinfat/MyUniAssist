import { ListBuilderForm } from "@/components/ListBuilderForm";
import { isAiConfigured } from "@/lib/ai/advisor";
import { UNIVERSITIES } from "@/lib/universities";

export default function ListBuilderPage() {
  const aiReady = isAiConfigured();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold italic text-[var(--teal)]">build</p>
      <h1 className="font-serif mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        AI university application list builder
      </h1>
      <p className="mt-2 max-w-3xl text-[var(--ink)]/70">
        Your grades, scores, program and activities are scored against the Common Data
        Set figures for {UNIVERSITIES.length} universities — including each school&rsquo;s own
        statement of how much it weighs rigor, essays, activities and residency — to
        estimate your odds and sort the result into safeties, matches and reaches.
      </p>

      {!aiReady && (
        <p className="mt-4 max-w-3xl rounded-xl border border-[var(--line)] bg-[var(--fog)] px-4 py-3 text-sm text-[var(--ink)]/75">
          Written coaching is off because no <code>ANTHROPIC_API_KEY</code> is set. The
          list, odds and reasoning below are computed from the data either way.
        </p>
      )}

      <div className="mt-8 border-t border-[var(--line)] bg-white/70 p-5 md:p-6">
        <ListBuilderForm />
      </div>
    </div>
  );
}
