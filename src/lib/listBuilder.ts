import { UNIVERSITIES, type University } from "@/lib/universities";

export type ListBuilderInput = {
  extracurriculars: string;
  gpa: number;
  sat?: number;
  act?: number;
  personality: string;
  locationInterest: string;
  universityInterests: string;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  includeSafeties: boolean;
  includeMatches: boolean;
  includeReaches: boolean;
};

export type RankedUniversity = {
  university: University;
  category: "Safety" | "Match" | "Reach";
  fitScore: number;
  rationale: string;
};

function tokenize(raw: string) {
  return new Set(
    raw
      .toLowerCase()
      .split(/[,/;|]+|\s+/)
      .map((t) => t.trim().replace(/[^a-z0-9+#-]/g, ""))
      .filter((t) => t.length >= 3)
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function overlapScore(a: Set<string>, b: Set<string>, maxPts: number) {
  if (a.size === 0 || b.size === 0) return Math.floor(maxPts / 3);
  let hits = 0;
  a.forEach((t) => {
    if (b.has(t)) hits += 1;
  });
  if (hits === 0) return 2;
  return Math.min(maxPts, 4 + hits * 5);
}

function academicFit(input: ListBuilderInput, u: University) {
  const gpaDelta = input.gpa - u.avgGpa;
  const gpaPts = Math.round(clamp(18 + gpaDelta * 28, 0, 30));
  let testPts = 12;
  if (input.sat != null) {
    testPts = Math.round(clamp(14 + ((input.sat - u.satMid) / 80) * 10, 0, 22));
  } else if (input.act != null) {
    testPts = Math.round(clamp(14 + ((input.act - u.actMid) / 2) * 10, 0, 22));
  }
  return gpaPts + testPts;
}

function categorize(
  input: ListBuilderInput,
  u: University,
  academicScore: number
): RankedUniversity["category"] {
  const gpaEdge = input.gpa - u.avgGpa;
  let testEdge = 0;
  if (input.sat != null) testEdge = input.sat - u.satMid;
  else if (input.act != null) testEdge = (input.act - u.actMid) * 40;

  if (u.acceptanceRate <= 0.12 || academicScore < 28 || (gpaEdge < -0.15 && testEdge < -40)) {
    return "Reach";
  }
  if (u.acceptanceRate >= 0.45 && academicScore >= 38 && gpaEdge >= 0.05) return "Safety";
  if (academicScore >= 42 && (gpaEdge >= 0.12 || testEdge >= 60)) return "Safety";
  if (academicScore <= 32 || gpaEdge < -0.05) return "Reach";
  return "Match";
}

function locationFit(location: string, u: University) {
  const loc = location.trim().toLowerCase();
  if (!loc || loc === "any" || loc === "no preference") return 12;
  const region = u.region.toLowerCase();
  const state = u.state.toLowerCase();
  const setting = u.setting.toLowerCase();
  if (loc.includes(region) || region.includes(loc) || loc.includes(state)) return 20;
  if (loc.includes("urban") && setting.includes("urban")) return 16;
  if (loc.includes("suburban") && setting.includes("suburban")) return 16;
  if (loc.includes("college town") && setting.includes("college town")) return 16;
  if (loc.includes("rural") && setting.includes("rural")) return 16;
  return 5;
}

export function buildUniversityList(
  input: ListBuilderInput,
  catalog: University[] = UNIVERSITIES
): RankedUniversity[] {
  const interestTokens = tokenize(input.universityInterests);
  const ecTokens = tokenize(input.extracurriculars);
  const personality = input.personality.trim().toLowerCase();
  const ranked: RankedUniversity[] = [];

  for (const u of catalog) {
    const acceptPct = u.acceptanceRate * 100;
    if (input.minAcceptanceRate != null && acceptPct < input.minAcceptanceRate) continue;
    if (input.maxAcceptanceRate != null && acceptPct > input.maxAcceptanceRate) continue;

    const academicScore = academicFit(input, u);
    const locScore = locationFit(input.locationInterest, u);
    const interestScore = overlapScore(interestTokens, tokenize(u.interests), 28);
    const personalityScore = personality
      .split(",")
      .some((p) => u.personalityFit.toLowerCase().includes(p.trim()))
      ? 18
      : tokenize(u.personalityFit).has(personality)
        ? 10
        : 4;
    const ecScore = overlapScore(ecTokens, tokenize(u.extracurricularFit), 16);
    const fitScore = clamp(
      academicScore + locScore + interestScore + personalityScore + ecScore,
      0,
      100
    );
    const category = categorize(input, u, academicScore);

    if (category === "Safety" && !input.includeSafeties) continue;
    if (category === "Match" && !input.includeMatches) continue;
    if (category === "Reach" && !input.includeReaches) continue;

    ranked.push({
      university: u,
      category,
      fitScore,
      rationale: `${category} · academics ${academicScore}/52 · location ${locScore}/20 · interests ${interestScore}/28 · accept ${(u.acceptanceRate * 100).toFixed(1)}%`,
    });
  }

  const order = { Safety: 0, Match: 1, Reach: 2 } as const;
  return ranked
    .sort(
      (a, b) =>
        order[a.category] - order[b.category] ||
        b.fitScore - a.fitScore ||
        a.university.name.localeCompare(b.university.name)
    )
    .slice(0, 24);
}
