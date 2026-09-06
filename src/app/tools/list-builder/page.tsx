import { ListBuilderForm } from "@/components/ListBuilderForm";
import { getUniversities } from "@/lib/getUniversities";

export default async function ListBuilderPage() {
  const universities = await getUniversities();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-bold tracking-tight text-[#13263d]">
        AI university application list builder
      </h1>
      <p className="mt-2 max-w-3xl text-[#5d6f82]">
        Score campuses on academics, extracurriculars, personality, location, interests, and
        acceptance rate — then sort into safeties, matches, and reaches.
      </p>
      <div className="mt-8 rounded-xl border border-[#d5dde6] bg-white p-5 md:p-6">
        <ListBuilderForm universities={universities} />
      </div>
    </div>
  );
}
