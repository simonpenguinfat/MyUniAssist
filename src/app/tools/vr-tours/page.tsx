import { getUniversities, searchUniversityList } from "@/lib/getUniversities";

export default async function VrToursPage({
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
        VR campus tours
      </h1>
      <p className="mt-2 text-[#5d6f82]">
        Direct links to each university’s official virtual tour. Edit links in{" "}
        <code className="rounded bg-[#eef2f6] px-1">src/lib/universities.ts</code> or Supabase.
      </p>
      <form className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Find a campus"
          className="flex-1 rounded-lg border border-[#d5dde6] bg-white px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#2f6fed] px-5 py-3 font-bold text-white"
        >
          Search
        </button>
      </form>

      <div className="mt-6 grid gap-3">
        {universities.map((u) => (
          <article
            key={u.id}
            className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#d5dde6] bg-white px-5 py-4 sm:flex-row sm:items-center"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-[#13263d]">{u.name}</h2>
              <p className="text-sm text-[#5d6f82]">
                {u.city}, {u.state} · {u.setting}
              </p>
            </div>
            <a
              href={u.vrTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#2f6fed] px-4 py-2 font-bold text-white"
            >
              Open VR tour
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
