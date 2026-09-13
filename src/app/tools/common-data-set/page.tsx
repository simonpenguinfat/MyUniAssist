import {
  admissionFactorLabel,
  getCommonDataSetProfiles,
  searchCdsProfiles,
  type CdsProfile,
} from "@/lib/commonDataSet";

const FACTOR_LABELS: [keyof CdsProfile["admissionFactors"], string][] = [
  ["rigor_secondary_school_record", "Rigor of secondary school record"],
  ["class_rank", "Class rank"],
  ["academic_gpa", "Academic GPA"],
  ["standardized_test_scores", "Standardized test scores"],
  ["application_essay", "Application essay"],
  ["recommendations", "Recommendations"],
  ["interview", "Interview"],
  ["extracurricular_activities", "Extracurricular activities"],
  ["talent_ability", "Talent/ability"],
  ["character_personal_qualities", "Character/personal qualities"],
  ["first_generation", "First generation"],
  ["alumni_relation", "Alumni relation"],
  ["geographical_residence", "Geographical residence"],
  ["state_residency", "State residency"],
  ["religious_affiliation", "Religious affiliation"],
  ["volunteer_work", "Volunteer work"],
  ["work_experience", "Work experience"],
  ["level_of_applicant_interest", "Level of applicant interest"],
];

function formatUsd(value: number | null) {
  if (value == null) return "Not reported";
  return `$${value.toLocaleString("en-US")}`;
}

function formatPct(value: number | null, decimals = 1) {
  if (value == null) return "Not reported";
  return `${value.toFixed(decimals)}%`;
}

function formatScore(value: number | null) {
  if (value == null) return "Not reported";
  return String(value);
}

function formatGpaDistribution(profile: CdsProfile) {
  const d = profile.gpa.distribution;
  return [
    formatPct(d.gte3_75Pct),
    formatPct(d.gte3_5Pct),
    formatPct(d.gte3_25Pct),
    formatPct(d.gte3_0Pct),
    formatPct(d.gte2_5Pct),
    formatPct(d.gte2_0Pct),
    formatPct(d.lt2_0Pct),
  ].join(" / ");
}

export default async function CommonDataSetPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const all = getCommonDataSetProfiles();
  const universities = searchCdsProfiles(all, q);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold italic text-[var(--teal)]">research</p>
      <h1 className="font-serif mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        Common Data Set
      </h1>
      <p className="mt-2 text-[var(--ink)]/70">
        Admissions snapshot for {all.length} schools. Values marked &quot;Not reported&quot; are unavailable
        in parsed CDS data.
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
        <table className="w-full min-w-[1080px] text-left text-sm">
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
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((u) => (
              <tr key={u.id} className="border-t border-[var(--line)] align-top">
                <td className="px-4 py-3 text-[var(--ink)]/55">
                  {u.usNewsRank != null ? `#${u.usNewsRank}` : "—"}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--ink)]">{u.name}</td>
                <td className="px-4 py-3 text-[var(--ink)]/70">
                  {u.city}, {u.state}
                </td>
                <td className="px-4 py-3">{formatPct(u.admissions.acceptanceRatePct)}</td>
                <td className="px-4 py-3">
                  {u.gpa.average != null ? u.gpa.average.toFixed(2) : "Not reported"}
                </td>
                <td className="px-4 py-3">{u.tests.sat.total ?? "Not reported"}</td>
                <td className="px-4 py-3">{u.tests.act.p50 ?? "Not reported"}</td>
                <td className="px-4 py-3">
                  {formatUsd(
                    u.costs.tuitionSingleUsd ??
                      u.costs.tuitionOutOfStateUsd ??
                      u.costs.tuitionInStateUsd
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.cdsSourceUrl ? (
                    <a
                      href={u.cdsSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--teal)]"
                    >
                      View official Common Data Set
                    </a>
                  ) : (
                    <span className="text-[var(--ink)]/60">Not reported</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--ink)]/80">
                  <details>
                    <summary className="cursor-pointer font-semibold text-[var(--ink)]">
                      Detailed CDS fields for {u.name}
                    </summary>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <section>
                        <h3 className="font-semibold">Admissions</h3>
                        <ul className="mt-1 space-y-1 text-xs text-[var(--ink)]/80">
                          <li>Applicants total: {formatScore(u.admissions.applicantsTotal)}</li>
                          <li>Admitted total: {formatScore(u.admissions.admittedTotal)}</li>
                          <li>Enrolled total: {formatScore(u.admissions.enrolledTotal)}</li>
                          <li>
                            Waitlist offered: {formatScore(u.admissions.waitlistOffered)}
                          </li>
                          <li>
                            Waitlist admitted: {formatScore(u.admissions.waitlistAdmitted)}
                          </li>
                          <li>Yield rate: {formatPct(u.admissions.yieldRatePct)}</li>
                        </ul>
                      </section>
                      <section>
                        <h3 className="font-semibold">Test scores</h3>
                        <ul className="mt-1 space-y-1 text-xs text-[var(--ink)]/80">
                          <li>
                            SAT 25/50/75: {formatScore(u.tests.sat.p25)} /{" "}
                            {formatScore(u.tests.sat.p50)} / {formatScore(u.tests.sat.p75)}
                          </li>
                          <li>
                            ACT 25/50/75: {formatScore(u.tests.act.p25)} /{" "}
                            {formatScore(u.tests.act.p50)} / {formatScore(u.tests.act.p75)}
                          </li>
                          <li>% submitting SAT: {formatPct(u.tests.submittingSatPct)}</li>
                          <li>% submitting ACT: {formatPct(u.tests.submittingActPct)}</li>
                        </ul>
                      </section>
                      <section>
                        <h3 className="font-semibold">Costs</h3>
                        <ul className="mt-1 space-y-1 text-xs text-[var(--ink)]/80">
                          <li>Tuition (single): {formatUsd(u.costs.tuitionSingleUsd)}</li>
                          <li>Tuition (in-state): {formatUsd(u.costs.tuitionInStateUsd)}</li>
                          <li>
                            Tuition (out-of-state): {formatUsd(u.costs.tuitionOutOfStateUsd)}
                          </li>
                          <li>Required fees: {formatUsd(u.costs.requiredFeesUsd)}</li>
                          <li>Housing & food: {formatUsd(u.costs.housingAndFoodUsd)}</li>
                          <li>Books & supplies: {formatUsd(u.costs.booksAndSuppliesUsd)}</li>
                          <li>Transportation: {formatUsd(u.costs.transportationUsd)}</li>
                          <li>Other expenses: {formatUsd(u.costs.otherExpensesUsd)}</li>
                          <li>Total COA: {formatUsd(u.costs.coaTotalSingleUsd)}</li>
                          <li>% need met: {formatPct(u.costs.needMetPct)}</li>
                          <li>Average aid package: {formatUsd(u.costs.averageAidPackageUsd)}</li>
                        </ul>
                      </section>
                      <section>
                        <h3 className="font-semibold">Campus diversity</h3>
                        <ul className="mt-1 space-y-1 text-xs text-[var(--ink)]/80">
                          <li>Population denominator: {formatScore(u.diversity.denominator)}</li>
                          <li>AIAN: {formatPct(u.diversity.aianPct, 3)}</li>
                          <li>Asian: {formatPct(u.diversity.asianPct, 3)}</li>
                          <li>Black: {formatPct(u.diversity.blackPct, 3)}</li>
                          <li>Hispanic: {formatPct(u.diversity.hispanicPct, 3)}</li>
                          <li>NHPI: {formatPct(u.diversity.nhpiPct, 3)}</li>
                          <li>White: {formatPct(u.diversity.whitePct, 3)}</li>
                          <li>Two or more: {formatPct(u.diversity.twoOrMorePct, 3)}</li>
                          <li>Unknown: {formatPct(u.diversity.unknownPct, 3)}</li>
                          <li>Nonresident: {formatPct(u.diversity.nonresidentPct, 3)}</li>
                        </ul>
                      </section>
                    </div>
                    <section className="mt-3">
                      <h3 className="font-semibold">Admission factors (C7)</h3>
                      <div className="mt-2 grid gap-x-4 gap-y-1 text-xs text-[var(--ink)]/80 md:grid-cols-2">
                        {FACTOR_LABELS.map(([key, label]) => (
                          <div key={key} className="flex items-start justify-between gap-3">
                            <span>{label}</span>
                            <span className="font-medium">
                              {admissionFactorLabel(u.admissionFactors[key])}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className="mt-3 text-xs text-[var(--ink)]/75">
                      <p>
                        GPA distribution ≥3.75 / ≥3.50 / ≥3.25 / ≥3.00 / ≥2.50 / ≥2.00 / &lt;2.00:
                        {" "}
                        {formatGpaDistribution(u)}
                      </p>
                      {u.searchHint ? <p className="mt-1">Search hint: {u.searchHint}</p> : null}
                      {u.flaggedValues.length > 0 ? (
                        <p className="mt-1 text-amber-700">
                          {u.flaggedValues.map((item) => `${item.field}: ${item.reason}`).join(" ")}
                        </p>
                      ) : null}
                    </section>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
