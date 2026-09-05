import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { UNIVERSITIES } from "@/lib/universities";

export default async function DashboardPage() {
  let name = "Student";
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      name =
        (data.user?.user_metadata?.full_name as string | undefined) ||
        data.user?.email?.split("@")[0] ||
        "Student";
    } catch {
      name = "Student";
    }
  }

  return (
    <>
      <SiteHeader />
      <section className="px-[6vw] py-14">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal)]">
          Signed in
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight">
          Welcome back, {name}
        </h1>
        <p className="mt-2 text-[var(--ink)]/75">
          Your personal workspace across {UNIVERSITIES.length} campuses.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/tools/common-data-set"
            className="rounded-3xl border border-[var(--line)] bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(6,47,56,0.18)]"
          >
            <h2 className="font-display text-xl font-bold">Common Data Set</h2>
            <p className="mt-2 text-[var(--ink)]/75">
              Browse acceptance rates, GPA/test midpoints, and official CDS documents.
            </p>
          </Link>
          <Link
            href="/tools/vr-tours"
            className="rounded-3xl border border-[var(--line)] bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(6,47,56,0.18)]"
          >
            <h2 className="font-display text-xl font-bold">VR tours</h2>
            <p className="mt-2 text-[var(--ink)]/75">
              Open each university’s official virtual campus tour in one click.
            </p>
          </Link>
          <Link
            href="/tools/list-builder"
            className="rounded-3xl bg-gradient-to-br from-[var(--teal-deep)] to-[var(--teal)] p-6 text-white transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(6,47,56,0.18)]"
          >
            <h2 className="font-display text-xl font-bold">AI list builder</h2>
            <p className="mt-2 text-white/85">
              Generate safeties, matches, and reaches from academics, activities, and fit.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
