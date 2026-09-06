import { formatAcceptance } from "@/lib/universities";
import { getUniversities, searchUniversityList } from "@/lib/getUniversities";

export default async function CommonDataSetPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const all = await getUniversities();
  const universities = searchUniversityList(all, q);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold italic text-[var(--teal)]">research</p>
      <h1 className="font-serif mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        Common Data Set
      </h1>
      <p className="mt-2 text-[var(--ink)]/70">
        Admissions snapshot for {all.length} universities from the CDS workbook (US News 2026
        ranks + CDS stats). “—” means the source reported NA.
      </p>
      <form className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by school, city, state, or region"
          className="flex-1 rounded-lg border border-[var(--line)] bg-white px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--teal)] px-5 py-3 font-bold text-white"
        >
          Search
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-[var(--fog)] text-xs uppercase tracking-wide text-[var(--ink)]/55">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Accept</th>
              <th className="px-4 py-3">Avg GPA</th>
              <th className="px-4 py-3">SAT mid</th>
              <th className="px-4 py-3">ACT mid</th>
              <th className="px-4 py-3">Tuition</th>
              <th className="px-4 py-3">CDS</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((u) => (
              <tr key={u.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 text-[var(--ink)]/55">
                  {u.usNewsRank != null ? `#${u.usNewsRank}` : "—"}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--ink)]">{u.name}</td>
                <td className="px-4 py-3 text-[var(--ink)]/70">
                  {u.city}, {u.state}
                </td>
                <td className="px-4 py-3">{formatAcceptance(u.acceptanceRate)}</td>
                <td className="px-4 py-3">{u.avgGpa != null ? u.avgGpa.toFixed(2) : "—"}</td>
                <td className="px-4 py-3">{u.satMid ?? "—"}</td>
                <td className="px-4 py-3">{u.actMid ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.tuitionUsd != null
                    ? `$${u.tuitionUsd.toLocaleString("en-US")}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={u.cdsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--teal)]"
                  >
                    Open CDS
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
