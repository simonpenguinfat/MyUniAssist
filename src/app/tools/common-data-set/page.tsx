import { SiteHeader } from "@/components/SiteHeader";
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
    <>
      <SiteHeader />
      <section className="px-[6vw] py-12">
        <h1 className="font-display text-4xl font-bold tracking-tight">Common Data Set</h1>
        <p className="mt-2 text-[var(--ink)]/75">
          Quick admissions snapshot plus a link to each school’s official CDS.
        </p>
        <form className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by school, city, state, or region"
            className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--citrus)] px-5 py-3 font-bold text-[var(--ink)]"
          >
            Search
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#eef4f6] text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">University</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Accept</th>
                <th className="px-4 py-3">Avg GPA</th>
                <th className="px-4 py-3">SAT mid</th>
                <th className="px-4 py-3">ACT mid</th>
                <th className="px-4 py-3">CDS</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((u) => (
                <tr key={u.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">
                    {u.city}, {u.state}
                  </td>
                  <td className="px-4 py-3">{(u.acceptanceRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3">{u.avgGpa.toFixed(2)}</td>
                  <td className="px-4 py-3">{u.satMid}</td>
                  <td className="px-4 py-3">{u.actMid}</td>
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
      </section>
    </>
  );
}
