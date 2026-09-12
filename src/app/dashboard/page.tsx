import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUniversities } from "@/lib/getUniversities";

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

  const universities = await getUniversities();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold italic text-[var(--teal)]">overview</p>
      <h1 className="font-serif mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        Welcome back, {name}
      </h1>
      <p className="mt-2 text-[var(--ink)]/70">
        Your personal workspace across {universities.length} campuses.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/tools/common-data-set"
          className="border-t border-[var(--ink)]/10 bg-white/70 pt-5 transition hover:border-[var(--teal)]"
        >
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">01</p>
          <h2 className="font-display mt-2 text-xl font-bold text-[var(--ink)]">Common Data Set</h2>
          <p className="mt-2 text-sm text-[var(--ink)]/70">
            Acceptance rates, GPA/test midpoints, and official CDS links.
          </p>
        </Link>

        <Link
          href="/tools/list-builder"
          className="rounded-lg bg-[var(--teal)] p-5 text-white transition hover:bg-[var(--teal-deep)]"
        >
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--citrus)]">02</p>
          <h2 className="font-display mt-2 text-xl font-bold">AI list builder</h2>
          <p className="mt-2 text-sm text-white/75">
            Generate safeties, matches, and reaches from your profile.
          </p>
        </Link>
      </div>
    </div>
  );
}
