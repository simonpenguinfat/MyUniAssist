import { SiteHeader } from "@/components/SiteHeader";
import { searchUniversities } from "@/lib/universities";

export default async function VrToursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const universities = searchUniversities(q);

  return (
    <>
      <SiteHeader />
      <section className="px-[6vw] py-12">
        <h1 className="font-display text-4xl font-bold tracking-tight">VR campus tours</h1>
        <p className="mt-2 text-[var(--ink)]/75">
          Direct links to each university’s official virtual tour or visit experience.
        </p>
        <form className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            name="q"
            defaultValue={q}
            placeholder="Find a campus"
            className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--citrus)] px-5 py-3 font-bold text-[var(--ink)]"
          >
            Search
          </button>
        </form>

        <div className="mt-6 grid gap-3">
          {universities.map((u) => (
            <article
              key={u.id}
              className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white/80 px-5 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="font-display text-lg font-bold">{u.name}</h2>
                <p className="text-sm text-[var(--ink)]/70">
                  {u.city}, {u.state} · {u.setting}
                </p>
              </div>
              <a
                href={u.vrTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[var(--citrus)] px-4 py-2 font-bold text-[var(--ink)]"
              >
                Open VR tour
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
