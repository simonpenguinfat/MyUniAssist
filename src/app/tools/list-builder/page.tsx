import { SiteHeader } from "@/components/SiteHeader";
import { ListBuilderForm } from "@/components/ListBuilderForm";
import { getUniversities } from "@/lib/getUniversities";

export default async function ListBuilderPage() {
  const universities = await getUniversities();

  return (
    <>
      <SiteHeader />
      <section className="px-[6vw] py-12">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          AI university application list builder
        </h1>
        <p className="mt-2 max-w-3xl text-[var(--ink)]/75">
          Score campuses on academics, extracurriculars, personality, location, interests, and
          acceptance rate — then sort into safeties, matches, and reaches.
        </p>
        <div className="mt-8">
          <ListBuilderForm universities={universities} />
        </div>
      </section>
    </>
  );
}
