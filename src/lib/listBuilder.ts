import {
  estimateAdmission,
  fitBreakdown,
  annualCost,
  type AdmissionEstimate,
  type FitBreakdown,
  type StudentProfile,
} from "@/lib/admissions";
import { UNIVERSITIES, type University } from "@/lib/universities";

export type RankedUniversity = {
  university: University;
  category: AdmissionEstimate["category"];
  farReach: boolean;
  /** Estimated chance of admission for this student, 0–1. */
  probability: number;
  /** How well the school matches what the student wants, 0–100. */
  fitScore: number;
  /** Ranking key: fit weighted by how realistic the school is. */
  overallScore: number;
  admission: AdmissionEstimate;
  fit: FitBreakdown;
  /** Cost the student would actually face, in-state rate where applicable. */
  estimatedAnnualCostUsd: number | null;
  reasons: string[];
  /** Filled in by the AI layer when an API key is configured. */
  advisorNote?: string;
};

export type ListShape = {
  safeties: number;
  matches: number;
  reaches: number;
};

export const DEFAULT_LIST_SHAPE: ListShape = { safeties: 4, matches: 6, reaches: 5 };

export type BuildOptions = {
  shape?: ListShape;
  /** Hard filters applied before scoring. */
  regions?: string[];
  maxAnnualCostUsd?: number;
  excludeIds?: string[];
};

function reasonsFor(
  u: University,
  admission: AdmissionEstimate,
  fit: FitBreakdown,
  cost: number | null
): string[] {
  const reasons: string[] = [];
  reasons.push(...fit.notes.slice(0, 3));
  reasons.push(...admission.drivers.slice(0, 3));

  if (u.acceptanceRate != null) {
    reasons.push(
      `Admits ${(u.acceptanceRate * 100).toFixed(1)}% of applicants${
        u.acceptanceRateYear ? ` (CDS ${u.acceptanceRateYear})` : ""
      }`
    );
  }
  if (cost != null) {
    reasons.push(`About $${cost.toLocaleString()} per year before aid`);
  }

  // De-duplicate while preserving order.
  return [...new Set(reasons)].slice(0, 6);
}

/**
 * Ranking blends fit with realism. A perfect-fit school the student cannot get
 * into is not a useful list entry, and neither is a guaranteed admit they would
 * hate, so each category gets its own realism curve.
 */
function overallScore(fit: number, probability: number, category: string) {
  const realism =
    category === "Reach"
      ? 0.55 + probability * 1.6
      : category === "Match"
        ? 0.85 + probability * 0.3
        : 0.8 + (1 - probability) * 0.25;
  return Math.round(fit * Math.min(realism, 1.15) * 10) / 10;
}

export type BuiltList = {
  schools: RankedUniversity[];
  counts: { safeties: number; matches: number; reaches: number };
  /** Honest notes about what the list could not deliver. */
  warnings: string[];
  /** How much of the list rests on reported vs modelled CDS data. */
  dataNote: string;
};

/**
 * The catalog is 109 selective national universities. For some profiles it
 * genuinely contains no safety, and saying so is far more useful than
 * relabelling a match — an unbalanced list is the single most common and most
 * costly mistake in a student-built college list.
 */
function warningsFor(
  picked: RankedUniversity[],
  shape: ListShape,
  catalogSize: number,
  budgetRequested: boolean
): string[] {
  const warnings: string[] = [];
  const counts = summarize(picked);

  if (counts.safeties === 0) {
    warnings.push(
      "No school in this dataset is a safety for this profile. The catalog covers 109 selective national universities, so add two or three local or regional public universities — a list without a true safety is not a finished list."
    );
  } else if (counts.safeties < Math.min(2, shape.safeties)) {
    warnings.push(
      "Only one safety was found. Aim for at least two schools you would be genuinely happy to attend and are confident of admission to."
    );
  }

  if (counts.matches === 0) {
    warnings.push(
      "No matches were found, which usually means the filters are too narrow. Widening the region or budget will surface schools in the 30–70% range."
    );
  }

  if (picked.length < shape.safeties + shape.matches + shape.reaches) {
    warnings.push(
      `Only ${picked.length} of the requested ${
        shape.safeties + shape.matches + shape.reaches
      } schools matched the filters, out of ${catalogSize} in the catalog.`
    );
  }

  if (budgetRequested && picked.length > 0) {
    const noCost = picked.filter((r) => r.estimatedAnnualCostUsd == null).length;
    if (noCost >= Math.ceil(picked.length / 2)) {
      warnings.push(
        `The Common Data Set workbook reports no cost figures for ${noCost} of these ${picked.length} schools, so the budget could not be applied to them. Check each school's net price calculator directly.`
      );
    }
  }

  const overBudget = picked.filter((r) =>
    r.reasons.some((x) => x.includes("above the stated budget"))
  );
  if (overBudget.length >= Math.ceil(picked.length / 2) && picked.length > 0) {
    warnings.push(
      "Most of this list sits above the stated budget at sticker price. Run each school's net price calculator before committing to it."
    );
  }

  return warnings;
}

function dataNoteFor(picked: RankedUniversity[]): string {
  if (picked.length === 0) return "No schools scored.";
  const modelled = picked.filter(
    (r) => r.admission.academic.confidence !== "reported"
  ).length;
  if (modelled === 0) {
    return "Every school here was scored against its own reported Common Data Set figures.";
  }
  return `${picked.length - modelled} of ${picked.length} schools were scored against fully reported Common Data Set figures; the other ${modelled} fall back to figures implied by their acceptance rate, so treat those odds as rougher.`;
}

/** Convenience wrapper returning just the schools. */
export function buildUniversityList(
  student: StudentProfile,
  catalog: University[] = UNIVERSITIES,
  options: BuildOptions = {}
): RankedUniversity[] {
  return buildList(student, catalog, options).schools;
}

export function buildList(
  student: StudentProfile,
  catalog: University[] = UNIVERSITIES,
  options: BuildOptions = {}
): BuiltList {
  const shape = options.shape ?? DEFAULT_LIST_SHAPE;
  const exclude = new Set(options.excludeIds ?? []);
  const regionFilter = (options.regions ?? []).filter(
    (r) => r && r.toLowerCase() !== "any"
  );

  const scored: RankedUniversity[] = [];

  for (const u of catalog) {
    if (exclude.has(u.id)) continue;
    if (
      regionFilter.length > 0 &&
      !regionFilter.some((r) => r.toLowerCase() === u.region.toLowerCase())
    ) {
      continue;
    }

    const inState =
      student.homeState != null &&
      student.homeState.toUpperCase() === u.state.toUpperCase();
    const cost = annualCost(u, inState);

    if (
      options.maxAnnualCostUsd != null &&
      cost != null &&
      // Allow headroom: aid routinely closes a gap of this size.
      cost > options.maxAnnualCostUsd * 1.35
    ) {
      continue;
    }

    const admission = estimateAdmission(student, u);
    const fit = fitBreakdown(student, u, admission.academic);

    scored.push({
      university: u,
      category: admission.category,
      farReach: admission.farReach,
      probability: admission.probability,
      fitScore: fit.score,
      overallScore: overallScore(fit.score, admission.probability, admission.category),
      admission,
      fit,
      estimatedAnnualCostUsd: cost,
      reasons: reasonsFor(u, admission, fit, cost),
    });
  }

  const byCategory = {
    Safety: scored.filter((s) => s.category === "Safety"),
    Match: scored.filter((s) => s.category === "Match"),
    Reach: scored.filter((s) => s.category === "Reach"),
  };

  for (const list of Object.values(byCategory)) {
    list.sort(
      (a, b) =>
        b.overallScore - a.overallScore ||
        b.fitScore - a.fitScore ||
        a.university.name.localeCompare(b.university.name)
    );
  }

  // Spread reaches across difficulty so the list is not 5 sub-5% lotteries.
  const reaches = interleaveReaches(byCategory.Reach, shape.reaches);

  const picked = [
    ...byCategory.Safety.slice(0, shape.safeties),
    ...byCategory.Match.slice(0, shape.matches),
    ...reaches,
  ];

  const order = { Safety: 0, Match: 1, Reach: 2 } as const;
  const schools = picked.sort(
    (a, b) => order[a.category] - order[b.category] || b.overallScore - a.overallScore
  );

  return {
    schools,
    counts: summarize(schools),
    warnings: warningsFor(
      schools,
      shape,
      catalog.length,
      options.maxAnnualCostUsd != null
    ),
    dataNote: dataNoteFor(schools),
  };
}

/**
 * Takes the best reaches but guarantees the near-misses are represented rather
 * than letting the highest-fit (usually most famous) schools take every slot.
 */
function interleaveReaches(reaches: RankedUniversity[], limit: number) {
  if (reaches.length <= limit) return reaches;
  const near = reaches.filter((r) => !r.farReach);
  const far = reaches.filter((r) => r.farReach);
  const nearTarget = Math.max(1, Math.ceil(limit * 0.6));
  const picked = [
    ...near.slice(0, nearTarget),
    ...far.slice(0, limit - Math.min(near.length, nearTarget)),
  ];
  // Top up if one bucket was short.
  for (const r of reaches) {
    if (picked.length >= limit) break;
    if (!picked.includes(r)) picked.push(r);
  }
  return picked.slice(0, limit);
}

export function summarize(list: RankedUniversity[]) {
  return {
    safeties: list.filter((r) => r.category === "Safety").length,
    matches: list.filter((r) => r.category === "Match").length,
    reaches: list.filter((r) => r.category === "Reach").length,
  };
}
