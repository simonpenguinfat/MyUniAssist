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
      <h1 className="font-display text-3xl font-bold tracking-tight text-[#13263d]">
        Common Data Set
      </h1>
      <p className="mt-2 text-[#5d6f82]">
        Quick admissions snapshot plus a link to each school’s official CDS.
      </p>
      <form className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by school, city, state, or region"
          className="flex-1 rounded-lg border border-[#d5dde6] bg-white px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#2f6fed] px-5 py-3 font-bold text-white"
        >
          Search
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#d5dde6] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#f3f6f9] text-xs uppercase tracking-wide text-[#5d6f82]">
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
              <tr key={u.id} className="border-t border-[#e6ebf0]">
                <td className="px-4 py-3 font-medium text-[#13263d]">{u.name}</td>
                <td className="px-4 py-3 text-[#5d6f82]">
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
                    className="font-semibold text-[#2f6fed]"
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
