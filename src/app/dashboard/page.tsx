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
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2f6fed]">Overview</p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-[#13263d]">
        Welcome back, {name}
      </h1>
      <p className="mt-2 text-[#5d6f82]">
        Your personal workspace across {universities.length} campuses.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/tools/common-data-set"
          className="rounded-xl border border-[#d5dde6] bg-white p-5 transition hover:border-[#2f6fed]/40 hover:shadow-[0_10px_30px_rgba(19,38,61,0.08)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a8b9e]">Research</p>
          <h2 className="font-display mt-2 text-xl font-bold text-[#13263d]">Common Data Set</h2>
          <p className="mt-2 text-sm text-[#5d6f82]">
            Acceptance rates, GPA/test midpoints, and official CDS links.
          </p>
        </Link>

        <Link
          href="/tools/vr-tours"
          className="rounded-xl border border-[#d5dde6] bg-white p-5 transition hover:border-[#2f6fed]/40 hover:shadow-[0_10px_30px_rgba(19,38,61,0.08)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a8b9e]">Explore</p>
          <h2 className="font-display mt-2 text-xl font-bold text-[#13263d]">VR tours</h2>
          <p className="mt-2 text-sm text-[#5d6f82]">
            Jump into each university’s official virtual campus tour.
          </p>
        </Link>

        <Link
          href="/tools/list-builder"
          className="rounded-xl border border-transparent bg-[#13263d] p-5 text-white transition hover:bg-[#1a3352]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8eb0ff]">Build</p>
          <h2 className="font-display mt-2 text-xl font-bold">AI list builder</h2>
          <p className="mt-2 text-sm text-white/75">
            Generate safeties, matches, and reaches from your profile.
          </p>
        </Link>
      </div>
    </div>
  );
}
