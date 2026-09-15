/**
 * Calibration checks for the admissions model.
 *
 * These are not unit tests of implementation detail — they assert that the
 * model's output stays inside ranges a college counsellor would recognise.
 * Run with: npm run check
 */
import { estimateAdmission, type StudentProfile } from "../src/lib/admissions";
import { buildList, buildUniversityList, summarize } from "../src/lib/listBuilder";
import { matchPrograms } from "../src/lib/programs";
import { parseActivities } from "../src/lib/activityParser";
import { UNIVERSITIES_BY_ID } from "../src/lib/universities";

let failures = 0;
let checks = 0;

function school(id: string) {
  const u = UNIVERSITIES_BY_ID.get(id);
  if (!u) throw new Error(`unknown school in test: ${id}`);
  return u;
}

function expectBetween(label: string, value: number, lo: number, hi: number) {
  checks += 1;
  const ok = value >= lo && value <= hi;
  if (!ok) failures += 1;
  const shown = value < 1 ? `${(value * 100).toFixed(1)}%` : value.toFixed(1);
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label}: ${shown} (expected ${
      lo < 1 ? `${(lo * 100).toFixed(0)}–${(hi * 100).toFixed(0)}%` : `${lo}–${hi}`
    })`
  );
}

function expect(label: string, condition: boolean, detail = "") {
  checks += 1;
  if (!condition) failures += 1;
  console.log(`${condition ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

const base: StudentProfile = {
  gpa: 3.7,
  gpaScale: "unweighted",
  sat: 1350,
  submitTests: true,
  courseRigor: "moderate",
  activities: [],
  essayStrength: 3,
  recommendationStrength: 3,
  intendedPrograms: [],
  activitiesText: "",
  preferredRegions: [],
  preferredSettings: [],
  preferredSizes: [],
  firstGeneration: false,
  legacy: false,
  demonstratesInterest: false,
};

const strong: StudentProfile = {
  ...base,
  gpa: 3.98,
  sat: 1560,
  courseRigor: "highest",
  essayStrength: 5,
  recommendationStrength: 5,
  activities: [
    { name: "Founded a nonprofit", tier: 1, leadership: true, years: 3 },
    { name: "USAMO qualifier", tier: 1, leadership: false, years: 3 },
    { name: "Varsity captain", tier: 2, leadership: true, years: 4 },
    { name: "Research internship", tier: 2, leadership: false, years: 2 },
  ],
  activitiesText: "founded a nonprofit, USAMO qualifier, varsity captain, research internship",
};

const average: StudentProfile = {
  ...base,
  gpa: 3.3,
  sat: 1150,
  courseRigor: "low",
  activities: [
    { name: "Soccer", tier: 4, leadership: false, years: 2 },
    { name: "Art club", tier: 4, leadership: false, years: 1 },
  ],
  activitiesText: "soccer, art club",
};

console.log("\n=== Elite schools stay lotteries even for top students ===");
for (const id of ["harvard-university", "stanford-university", "princeton-university"]) {
  const est = estimateAdmission(strong, school(id));
  expectBetween(`${school(id).name} / outstanding applicant`, est.probability, 0.05, 0.4);
  expect(`  ${school(id).name} never classified Safety`, est.category !== "Safety", est.category);
}

console.log("\n=== A weak applicant at an elite school is a far reach ===");
{
  const est = estimateAdmission(average, school("harvard-university"));
  expectBetween("Harvard / below-average applicant", est.probability, 0.001, 0.03);
  expect("  classified Reach", est.category === "Reach", est.category);
  expect("  flagged far reach", est.farReach);
}

console.log("\n=== Less selective schools behave like safeties ===");
for (const id of ["university-of-south-florida", "temple-university", "university-of-iowa"]) {
  const est = estimateAdmission(strong, school(id));
  expectBetween(`${school(id).name} / outstanding applicant`, est.probability, 0.75, 0.97);
  expect(`  ${school(id).name} classified Safety`, est.category === "Safety", est.category);
}

console.log("\n=== In-state residency moves public university odds ===");
{
  const u = school("university-of-north-carolina-at-chapel-hill");
  const outOfState = estimateAdmission({ ...strong, homeState: "CA" }, u);
  const inState = estimateAdmission({ ...strong, homeState: "NC" }, u);
  expect(
    "UNC in-state beats out-of-state",
    inState.probability > outOfState.probability,
    `in ${(inState.probability * 100).toFixed(1)}% vs out ${(outOfState.probability * 100).toFixed(1)}%`
  );
}

console.log("\n=== Extracurriculars matter more where CDS says they do ===");
{
  // Same student, strong vs empty activities, at a school that rates ECs highly.
  const u = school("yale-university");
  const withEc = estimateAdmission(strong, u);
  const withoutEc = estimateAdmission({ ...strong, activities: [], activitiesText: "" }, u);
  expect(
    "Yale rewards a strong activity profile",
    withEc.probability > withoutEc.probability,
    `${(withEc.probability * 100).toFixed(1)}% vs ${(withoutEc.probability * 100).toFixed(1)}%`
  );
}

console.log("\n=== Program matching reads real student wording ===");
expect(
  "'I want to study computer science'",
  matchPrograms("I want to study computer science").includes("computer-science")
);
expect(
  "'pre-med, maybe neuroscience'",
  matchPrograms("pre-med, maybe neuroscience").includes("biology-premed")
);
expect(
  "'mechanical engineering'",
  matchPrograms("mechanical engineering").includes("mechanical-aerospace-engineering")
);
expect("'musical theatre'", matchPrograms("musical theatre").includes("performing-arts"));

console.log("\n=== Activity parser tiers free text ===");
{
  const parsed = parseActivities(
    "Founded a nonprofit teaching coding (3 years)\nVarsity soccer captain\nMath club member"
  );
  expect("parsed three activities", parsed.length === 3, `got ${parsed.length}`);
  expect("nonprofit founder is tier 1 or 2", parsed[0].tier <= 2, `tier ${parsed[0].tier}`);
  expect("captain counts as leadership", parsed[1].leadership);
  expect("plain membership is tier 4", parsed[2].tier === 4, `tier ${parsed[2].tier}`);
}

console.log("\n=== Built lists are balanced and program-aware ===");
{
  const cs: StudentProfile = {
    ...strong,
    intendedPrograms: ["computer-science"],
    homeState: "CA",
    preferredRegions: [],
  };
  const list = buildUniversityList(cs);
  const counts = summarize(list);
  expect("list has safeties", counts.safeties > 0, JSON.stringify(counts));
  expect("list has matches", counts.matches > 0, JSON.stringify(counts));
  expect("list has reaches", counts.reaches > 0, JSON.stringify(counts));
  expect("no duplicate schools", new Set(list.map((r) => r.university.id)).size === list.length);

  const names = list.map((r) => r.university.name);
  expect(
    "CS student sees at least one CS powerhouse",
    names.some((n) =>
      ["Carnegie Mellon University", "Massachusetts Institute of Technology", "University of California, Berkeley", "Stanford University", "University of Illinois Urbana-Champaign", "Georgia Institute of Technology", "Cornell University", "University of Washington"].includes(n)
    ),
    names.slice(0, 5).join(", ")
  );

  const weakList = buildList({ ...average, intendedPrograms: ["business-finance"] });
  expect(
    "weaker student's list is not all elite schools",
    weakList.schools.every(
      (r) => r.category !== "Safety" || (r.university.acceptanceRate ?? 1) >= 0.2
    )
  );
  expect(
    "a list short on safeties says so instead of mislabelling matches",
    weakList.counts.safeties >= 2 ||
      weakList.warnings.some((w) => w.toLowerCase().includes("safet")),
    `safeties=${weakList.counts.safeties}, warnings=${weakList.warnings.length}`
  );
  expect(
    "data provenance is disclosed",
    weakList.dataNote.length > 0 && /Common Data Set/.test(weakList.dataNote)
  );
}

console.log("\n=== Region and budget filters are respected ===");
{
  const list = buildUniversityList(
    { ...strong, intendedPrograms: ["computer-science"], preferredRegions: ["West"] },
    undefined,
    { regions: ["West"] }
  );
  expect(
    "region filter holds",
    list.every((r) => r.university.region === "West"),
    `${list.length} schools`
  );
}

console.log(
  `\n${failures === 0 ? "All checks passed" : `${failures} FAILURE(S)`} — ${checks} checks\n`
);
process.exit(failures === 0 ? 0 : 1);
