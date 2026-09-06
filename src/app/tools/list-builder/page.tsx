import { ListBuilderForm } from "@/components/ListBuilderForm";
import { getUniversities } from "@/lib/getUniversities";

export default async function ListBuilderPage() {
  const universities = await getUniversities();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold italic text-[var(--teal)]">build</p>
      <h1 className="font-serif mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        AI university application list builder
      </h1>
      <p className="mt-2 max-w-3xl text-[var(--ink)]/70">
        Score campuses on academics, extracurriculars, personality, location, interests, and
        acceptance rate — then sort into safeties, matches, and reaches.
      </p>
      <div className="mt-8 border-t border-[var(--line)] bg-white/70 p-5 md:p-6">
        <ListBuilderForm universities={universities} />
      </div>
    </div>
  );
}
