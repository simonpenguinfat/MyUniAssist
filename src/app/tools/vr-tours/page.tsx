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
      <p className="text-sm font-semibold italic text-[var(--teal)]">explore</p>
      <h1 className="font-serif mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        VR campus tours
      </h1>
      <p className="mt-2 text-[var(--ink)]/70">
        Direct links to each university’s official virtual tour.
      </p>
      <form className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Find a campus"
          className="flex-1 rounded-lg border border-[var(--line)] bg-white px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--teal)] px-5 py-3 font-bold text-white"
        >
          Search
        </button>
      </form>

      <div className="mt-6 grid gap-3">
        {universities.map((u) => (
          <article
            key={u.id}
            className="flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] bg-white/70 px-1 py-4 sm:flex-row sm:items-center sm:px-2"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--ink)]">{u.name}</h2>
              <p className="text-sm text-[var(--ink)]/65">
                {u.city}, {u.state} · {u.setting}
              </p>
            </div>
            <a
              href={u.vrTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[var(--teal)] px-4 py-2 font-bold text-white"
            >
              Open VR tour
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
