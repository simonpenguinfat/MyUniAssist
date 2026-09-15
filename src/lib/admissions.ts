import type {
  AdmissionFactorKey,
  AdmissionFactors,
  University,
} from "@/lib/universities";
import {
  activityAlignment,
  PROGRAMS_BY_KEY,
  programTier,
  type ProgramKey,
} from "@/lib/programs";

/* -------------------------------------------------------------------------
 * Student profile
 * ---------------------------------------------------------------------- */

export type ActivityTier =
  /** National/international distinction, or founded something with real reach. */
  | 1
  /** State-level distinction, or sustained leadership of a significant group. */
  | 2
  /** Meaningful school-level leadership or multi-year commitment. */
  | 3
  /** Participation. */
  | 4;

export type RatedActivity = {
  name: string;
  tier: ActivityTier;
  leadership: boolean;
  /** Years of involvement, used as a commitment signal. */
  years: number;
};

export type CourseRigor = "low" | "moderate" | "high" | "highest";

export type StudentProfile = {
  /** As reported by the student. */
  gpa: number;
  gpaScale: "weighted" | "unweighted";
  sat?: number;
  act?: number;
  /** Whether the student intends to submit scores at test-optional schools. */
  submitTests: boolean;
  courseRigor: CourseRigor;
  /** "Top 5%" -> 5. Optional; many schools no longer rank. */
  classRankPercentile?: number;
  activities: RatedActivity[];
  /** 1 (weak) – 5 (exceptional). Self-assessed, used only as a soft nudge. */
  essayStrength: number;
  recommendationStrength: number;
  intendedPrograms: ProgramKey[];
  /** Raw text kept for program/activity keyword alignment. */
  activitiesText: string;
  homeState?: string;
  preferredRegions: string[];
  preferredSettings: string[];
  preferredSizes: string[];
  /** Annual all-in budget in USD; undefined means cost is not a constraint. */
  maxAnnualCostUsd?: number;
  firstGeneration: boolean;
  legacy: boolean;
  /** Student will visit / interview / write supplements that show real interest. */
  demonstratesInterest: boolean;
};

/* -------------------------------------------------------------------------
 * Statistics helpers
 * ---------------------------------------------------------------------- */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function logit(p: number) {
  const q = clamp(p, 0.001, 0.999);
  return Math.log(q / (1 - q));
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * The gap between a school's 25th and 75th percentile spans 1.349 standard
 * deviations for a normal distribution, which is how we recover a spread from
 * the two percentiles the Common Data Set actually publishes.
 */
const IQR_TO_SIGMA = 1.349;

function spreadFromPercentiles(
  p25: number | null,
  p75: number | null,
  fallback: number,
  min: number,
  max: number
) {
  if (p25 == null || p75 == null || p75 <= p25) return fallback;
  return clamp((p75 - p25) / IQR_TO_SIGMA, min, max);
}

/* -------------------------------------------------------------------------
 * CDS admission factor weights
 * ---------------------------------------------------------------------- */

/**
 * CDS C7 uses 4 = Very Important … 1 = Not Considered. Map to a 0–1 weight so
 * a school that says it does not consider a factor contributes nothing for it.
 */
function factorWeight(factors: AdmissionFactors, key: AdmissionFactorKey, fallback: number) {
  const raw = factors?.[key];
  if (raw == null) return fallback;
  switch (raw) {
    case 4:
      return 1;
    case 3:
      return 0.65;
    case 2:
      return 0.3;
    default:
      return 0;
  }
}

export function factorLabel(score: number | null): string {
  switch (score) {
    case 4:
      return "Very important";
    case 3:
      return "Important";
    case 2:
      return "Considered";
    case 1:
      return "Not considered";
    default:
      return "Not reported";
  }
}

/* -------------------------------------------------------------------------
 * Academic standing relative to one school
 * ---------------------------------------------------------------------- */

/** How many extra grade points a rigorous schedule adds on a weighted scale. */
const RIGOR_WEIGHT_BUMP: Record<CourseRigor, number> = {
  highest: 0.45,
  high: 0.32,
  moderate: 0.18,
  low: 0.05,
};

/**
 * Schools report GPA on whichever scale they collect. Anything above ~4.05 is
 * necessarily weighted, so put the student on the same scale before comparing.
 */
function alignGpa(student: StudentProfile, schoolGpa: number) {
  const schoolIsWeighted = schoolGpa > 4.05;
  const studentIsWeighted = student.gpaScale === "weighted";
  if (schoolIsWeighted === studentIsWeighted) return student.gpa;
  if (schoolIsWeighted && !studentIsWeighted) {
    return student.gpa + RIGOR_WEIGHT_BUMP[student.courseRigor];
  }
  return Math.max(0, student.gpa - RIGOR_WEIGHT_BUMP[student.courseRigor]);
}

/**
 * The workbook is sparse: of 109 schools it publishes an average GPA for 12
 * and test percentiles for 65, but an acceptance rate for 76. Where a school
 * reports nothing, infer the academic profile its acceptance rate implies
 * rather than silently scoring the student against zero.
 *
 * Points are (acceptance rate, typical admitted score) on the national curve.
 */
const IMPLIED_SAT: [number, number][] = [
  [0.04, 1540],
  [0.1, 1500],
  [0.2, 1450],
  [0.3, 1400],
  [0.4, 1345],
  [0.55, 1285],
  [0.7, 1225],
  [0.85, 1150],
  [0.95, 1080],
];

const IMPLIED_GPA: [number, number][] = [
  [0.04, 3.95],
  [0.1, 3.92],
  [0.2, 3.87],
  [0.3, 3.81],
  [0.4, 3.74],
  [0.55, 3.65],
  [0.7, 3.55],
  [0.85, 3.45],
  [0.95, 3.35],
];

function interpolate(points: [number, number][], x: number) {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x0, y0] = points[i - 1];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return last[1];
}

/** How much of this school's academic profile came from the workbook. */
export type DataConfidence = "reported" | "partial" | "modelled";

type SchoolAcademics = {
  satMid: number;
  satSigma: number;
  actMid: number | null;
  actSigma: number;
  gpa: number;
  /** Implied GPAs are unweighted-equivalent; reported ones may be weighted. */
  gpaIsWeighted: boolean;
  satEstimated: boolean;
  gpaEstimated: boolean;
};

function schoolAcademics(u: University): SchoolAcademics {
  const rate = baseAcceptanceRate(u);

  const satEstimated = u.satMid == null;
  const satMid = u.satMid ?? Math.round(interpolate(IMPLIED_SAT, rate));
  const satSigma = spreadFromPercentiles(u.sat25, u.sat75, 75, 30, 140);

  const actSigma = spreadFromPercentiles(u.act25, u.act75, 2.6, 1.2, 5);

  const gpaEstimated = u.avgGpa == null;
  const gpa = u.avgGpa ?? interpolate(IMPLIED_GPA, rate);

  return {
    satMid,
    satSigma,
    actMid: u.actMid,
    actSigma,
    gpa,
    gpaIsWeighted: !gpaEstimated && gpa > 4.05,
    satEstimated,
    gpaEstimated,
  };
}

export function dataConfidence(u: University): DataConfidence {
  const reported =
    (u.acceptanceRate != null ? 1 : 0) +
    (u.satMid != null ? 1 : 0) +
    (u.avgGpa != null ? 1 : 0) +
    (u.admissionFactors?.gpa != null ? 1 : 0);
  if (reported >= 3) return "reported";
  if (reported >= 1) return "partial";
  return "modelled";
}

export type AcademicStanding = {
  /** Standard deviations above/below the school's middle, blended. */
  z: number;
  testZ: number | null;
  gpaZ: number | null;
  /** Percentile of the admitted class the student's test score lands in. */
  testPercentile: number | null;
  usedTest: "sat" | "act" | null;
  /** True when part of the comparison came from the implied national curve. */
  estimated: boolean;
  confidence: DataConfidence;
};

export function academicStanding(
  student: StudentProfile,
  u: University
): AcademicStanding {
  const school = schoolAcademics(u);

  let testZ: number | null = null;
  let usedTest: AcademicStanding["usedTest"] = null;

  if (student.submitTests) {
    if (student.sat != null) {
      testZ = (student.sat - school.satMid) / school.satSigma;
      usedTest = "sat";
    } else if (student.act != null && school.actMid != null) {
      testZ = (student.act - school.actMid) / school.actSigma;
      usedTest = "act";
    } else if (student.act != null) {
      // No ACT profile for this school: convert to the SAT scale via concordance.
      testZ = (actToSat(student.act) - school.satMid) / school.satSigma;
      usedTest = "act";
    }
  }

  // CDS publishes no GPA spread; 0.22 is a realistic class-wide sigma and is
  // deliberately wide because high-school GPA is heavily compressed at the top.
  const alignedGpa = school.gpaIsWeighted
    ? alignGpa(student, school.gpa)
    : toUnweighted(student);
  const gpaZ = (alignedGpa - school.gpa) / 0.22;

  const wTest = testZ == null ? 0 : factorWeight(u.admissionFactors, "tests", 0.6);
  // GPA is never truly ignored, even where the CDS row says only "considered".
  const wGpa = Math.max(factorWeight(u.admissionFactors, "gpa", 1), 0.5);

  const z =
    wTest + wGpa === 0 ? 0 : ((testZ ?? 0) * wTest + gpaZ * wGpa) / (wTest + wGpa);

  return {
    z: clamp(z, -4, 4),
    testZ,
    gpaZ,
    testPercentile: testZ == null ? null : Math.round(normalCdf(testZ) * 100),
    usedTest,
    estimated: school.satEstimated || school.gpaEstimated,
    confidence: dataConfidence(u),
  };
}

/** Student GPA expressed on an unweighted 4.0 scale. */
function toUnweighted(student: StudentProfile) {
  if (student.gpaScale === "unweighted") return student.gpa;
  return Math.max(0, student.gpa - RIGOR_WEIGHT_BUMP[student.courseRigor]);
}

/** Concordance midpoints, used only when a school reports SAT but not ACT. */
function actToSat(act: number) {
  const table: [number, number][] = [
    [36, 1590],
    [34, 1530],
    [32, 1450],
    [30, 1390],
    [28, 1320],
    [26, 1240],
    [24, 1180],
    [22, 1110],
    [20, 1030],
    [18, 960],
    [16, 880],
  ];
  if (act >= 36) return 1590;
  if (act <= 16) return 880;
  for (let i = 1; i < table.length; i++) {
    const [a1, s1] = table[i];
    const [a0, s0] = table[i - 1];
    if (act >= a1) return s1 + ((act - a1) / (a0 - a1)) * (s0 - s1);
  }
  return 1000;
}

/** Abramowitz & Stegun 7.1.26 error-function approximation. */
function erf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/* -------------------------------------------------------------------------
 * Soft profile (extracurriculars, essays, recommendations)
 * ---------------------------------------------------------------------- */

/** Tier 1 activities are rare and carry most of the signal. */
const TIER_POINTS: Record<ActivityTier, number> = { 1: 10, 2: 6, 3: 3, 4: 1 };

export type SoftProfile = {
  /** 0–1, how strong the out-of-classroom profile is in absolute terms. */
  strength: number;
  points: number;
  topTier: ActivityTier | null;
  leadershipCount: number;
};

export function softProfile(student: StudentProfile): SoftProfile {
  let points = 0;
  let leadershipCount = 0;
  let topTier: ActivityTier | null = null;

  // Diminishing returns: a 12-activity list is not three times a 4-activity one.
  const sorted = [...student.activities].sort((a, b) => a.tier - b.tier);
  sorted.forEach((activity, index) => {
    const decay = 1 / (1 + index * 0.35);
    let value = TIER_POINTS[activity.tier] * decay;
    if (activity.leadership) value *= 1.25;
    if (activity.years >= 3) value *= 1.15;
    points += value;
    if (activity.leadership) leadershipCount += 1;
    if (topTier == null || activity.tier < topTier) topTier = activity.tier;
  });

  // ~22 points is a genuinely standout profile; scale to 0–1 against that.
  const strength = clamp(points / 22, 0, 1);
  return { strength, points: Math.round(points * 10) / 10, topTier, leadershipCount };
}

/* -------------------------------------------------------------------------
 * Admission probability
 * ---------------------------------------------------------------------- */

/**
 * How strongly academic standing moves the odds. Tuned so that a student one
 * sigma above a school's middle roughly doubles their odds at a mid-selectivity
 * school, which matches how admit-rate-by-decile tables actually look.
 */
const ACADEMIC_BETA = 1.15;

export type AdmissionEstimate = {
  probability: number;
  category: "Safety" | "Match" | "Reach";
  /** Set when a reach is genuinely a long shot rather than a near-miss. */
  farReach: boolean;
  academic: AcademicStanding;
  soft: SoftProfile;
  baseRate: number;
  /** Human-readable drivers, strongest first. */
  drivers: string[];
};

function baseAcceptanceRate(u: University): number {
  if (u.acceptanceRate != null) return clamp(u.acceptanceRate, 0.01, 0.99);
  // No reported rate: infer a plausible one from national rank.
  if (u.usNewsRank == null) return 0.5;
  if (u.usNewsRank <= 10) return 0.07;
  if (u.usNewsRank <= 25) return 0.15;
  if (u.usNewsRank <= 50) return 0.28;
  if (u.usNewsRank <= 100) return 0.45;
  return 0.6;
}

export function estimateAdmission(
  student: StudentProfile,
  u: University
): AdmissionEstimate {
  const academic = academicStanding(student, u);
  const soft = softProfile(student);
  const baseRate = baseAcceptanceRate(u);
  const factors = u.admissionFactors;
  const drivers: string[] = [];

  let shift = 0;

  /**
   * How much of the application beyond grades and scores this school actually
   * reads. A school admitting 4% weighs essays, activities and character
   * heavily; one admitting 85% is mostly checking that the transcript clears a
   * bar. Without this, penalties stack — a below-average student was coming out
   * at 51% odds against an 83% acceptance rate.
   */
  const holisticWeight = clamp(1 - baseRate, 0.18, 1);

  // --- Academics -------------------------------------------------------
  /**
   * Academic standing separates applicants least at both extremes and most in
   * the middle. At a 4% school nearly every applicant already clears the bar;
   * at an 85% school nearly every applicant is admitted regardless. The
   * inverted-U peaks near a 50% acceptance rate.
   */
  const selectivityDamping = clamp(0.6 + 1.5 * baseRate * (1 - baseRate), 0.5, 1.05);
  const academicShift = ACADEMIC_BETA * academic.z * selectivityDamping;
  shift += academicShift;

  if (!academic.estimated) {
    if (academic.z >= 0.75) {
      drivers.push("Academics sit above this school's middle 50%");
    } else if (academic.z <= -0.75) {
      drivers.push("Academics sit below this school's middle 50%");
    } else {
      drivers.push("Academics land inside this school's middle 50%");
    }
  }

  // --- Course rigor ----------------------------------------------------
  const rigorWeight = factorWeight(factors, "rigor", 0.8);
  const rigorScore = { highest: 1, high: 0.6, moderate: 0.1, low: -0.5 }[
    student.courseRigor
  ];
  shift += rigorWeight * rigorScore * 0.45 * holisticWeight;
  if (rigorWeight >= 0.65 && student.courseRigor === "highest") {
    drivers.push("Rates course rigor very highly, and the schedule matches");
  } else if (rigorWeight >= 0.65 && student.courseRigor === "low") {
    drivers.push("Rates course rigor very highly, and the schedule is light");
  }

  // --- Class rank ------------------------------------------------------
  if (student.classRankPercentile != null) {
    const rankWeight = factorWeight(factors, "classRank", 0.3);
    // Top 1% -> +1, top 25% -> 0, bottom half -> negative.
    const rankScore = clamp((25 - student.classRankPercentile) / 24, -1.5, 1);
    shift += rankWeight * rankScore * 0.4 * holisticWeight;
  }

  // --- Extracurriculars, talent, character ------------------------------
  const ecWeight = factorWeight(factors, "extracurriculars", 0.5);
  const talentWeight = factorWeight(factors, "talent", 0.4);
  const characterWeight = factorWeight(factors, "character", 0.5);
  const volunteerWeight = factorWeight(factors, "volunteerWork", 0.3);
  const softWeight =
    (ecWeight + talentWeight + characterWeight + volunteerWeight) / 4;
  // Centre at 0.45 so an average profile is neutral, not a penalty.
  const softShift = softWeight * (soft.strength - 0.45) * 1.9 * holisticWeight;
  shift += softShift;

  const readsHolistically = softWeight >= 0.6 && holisticWeight >= 0.5;
  if (readsHolistically && soft.strength >= 0.6) {
    drivers.push("Weighs activities heavily, and this profile is strong there");
  } else if (readsHolistically && soft.strength < 0.3) {
    drivers.push("Weighs activities heavily, and this profile is thin there");
  } else if (holisticWeight <= 0.3) {
    drivers.push("Admits largely on grades and scores");
  }

  // --- Essays and recommendations ---------------------------------------
  const essayWeight = factorWeight(factors, "essay", 0.4);
  const recWeight = factorWeight(factors, "recommendations", 0.4);
  shift += essayWeight * ((student.essayStrength - 3) / 2) * 0.45 * holisticWeight;
  shift += recWeight * ((student.recommendationStrength - 3) / 2) * 0.35 * holisticWeight;

  // --- Residency hooks ---------------------------------------------------
  // Only adjust when the student actually told us where they live. Treating an
  // unanswered question as "out of state" silently penalised every public
  // university on the list.
  const residencyKnown = student.homeState != null && student.homeState.trim() !== "";
  const inState =
    residencyKnown &&
    student.homeState!.toUpperCase() === u.state.toUpperCase();
  const stateWeight = factorWeight(factors, "stateResidency", u.isPublic ? 0.6 : 0);
  if (u.isPublic && stateWeight > 0 && residencyKnown) {
    if (inState) {
      shift += stateWeight * 0.85;
      drivers.push("Public university that favours in-state applicants");
    } else {
      shift -= stateWeight * 0.5;
      drivers.push("Public university where out-of-state admission is tighter");
    }
  }

  const geoWeight = factorWeight(factors, "geographicResidence", 0.2);
  if (residencyKnown && !inState && geoWeight > 0 && !u.isPublic) {
    // Private schools chasing geographic spread favour distant applicants.
    shift += geoWeight * 0.2;
  }

  // --- Other declared hooks ----------------------------------------------
  if (student.firstGeneration) {
    const w = factorWeight(factors, "firstGeneration", 0.2);
    shift += w * 0.5 * holisticWeight;
    if (w >= 0.65) drivers.push("Considers first-generation status importantly");
  }
  if (student.legacy) {
    const w = factorWeight(factors, "alumniRelation", 0.2);
    shift += w * 0.45 * holisticWeight;
    if (w >= 0.65) drivers.push("Weighs alumni relations importantly");
  }
  if (student.demonstratesInterest) {
    const w = factorWeight(factors, "applicantInterest", 0.2);
    shift += w * 0.5 * holisticWeight;
    if (w >= 0.65) drivers.push("Tracks demonstrated interest — visits and supplements count");
  }

  // Keep any single application from swinging further than reality allows.
  shift = clamp(shift, -4, 4);

  const probability = clamp(sigmoid(logit(baseRate) + shift), 0.01, 0.97);
  const { category, farReach } = categorize(probability, baseRate);

  return { probability, category, farReach, academic, soft, baseRate, drivers };
}

/**
 * Counsellor convention: a school is only a safety if you would be shocked to
 * be denied. Very low acceptance rates make that impossible regardless of
 * stats, which is the single most common mistake in a student-built list.
 */
function categorize(probability: number, baseRate: number) {
  let category: AdmissionEstimate["category"];
  if (probability >= 0.7) category = "Safety";
  else if (probability >= 0.3) category = "Match";
  else category = "Reach";

  if (baseRate < 0.2 && category === "Safety") category = "Match";
  if (baseRate < 0.1) category = "Reach";

  return { category, farReach: category === "Reach" && probability < 0.1 };
}

/* -------------------------------------------------------------------------
 * Fit — a different question from odds
 * ---------------------------------------------------------------------- */

export type FitBreakdown = {
  score: number;
  program: number;
  location: number;
  cost: number;
  size: number;
  activities: number;
  academicEnvironment: number;
  notes: string[];
  bestProgram: { key: ProgramKey; label: string; tier: string } | null;
};

const SIZE_ORDER = ["Small", "Medium", "Large"];

export function fitBreakdown(
  student: StudentProfile,
  u: University,
  academic: AcademicStanding
): FitBreakdown {
  const notes: string[] = [];

  // --- Program (35) -----------------------------------------------------
  let program = 0;
  let bestProgram: FitBreakdown["bestProgram"] = null;
  if (student.intendedPrograms.length > 0) {
    for (const key of student.intendedPrograms) {
      const tier = programTier(u.id, key);
      const value = tier === "standout" ? 35 : tier === "strong" ? 26 : 0;
      if (value > program) {
        program = value;
        bestProgram = {
          key,
          label: PROGRAMS_BY_KEY.get(key)?.label ?? key,
          tier,
        };
      }
    }
    if (program === 0) {
      // Not a named leader: fall back to overall academic standing.
      const rank = u.usNewsRank ?? 200;
      program = rank <= 25 ? 21 : rank <= 50 ? 18 : rank <= 100 ? 14 : 11;
      const first = student.intendedPrograms[0];
      bestProgram = {
        key: first,
        label: PROGRAMS_BY_KEY.get(first)?.label ?? first,
        tier: "general",
      };
    } else if (bestProgram) {
      notes.push(
        bestProgram.tier === "standout"
          ? `Nationally recognised for ${bestProgram.label}`
          : `Strong department for ${bestProgram.label}`
      );
    }
  } else {
    program = 18;
  }

  // --- Location (20) ----------------------------------------------------
  let location = 8;
  const wantsRegion = student.preferredRegions.filter(
    (r) => r && r.toLowerCase() !== "any"
  );
  const wantsSetting = student.preferredSettings.filter(
    (s) => s && s.toLowerCase() !== "any"
  );
  if (wantsRegion.length === 0 && wantsSetting.length === 0) {
    location = 14;
  } else {
    let hits = 0;
    let asked = 0;
    if (wantsRegion.length > 0) {
      asked += 1;
      if (wantsRegion.some((r) => r.toLowerCase() === u.region.toLowerCase())) {
        hits += 1;
        notes.push(`In a preferred region (${u.region})`);
      }
    }
    if (wantsSetting.length > 0) {
      asked += 1;
      if (wantsSetting.some((s) => s.toLowerCase() === u.setting.toLowerCase())) {
        hits += 1;
        notes.push(`${u.setting} campus, as requested`);
      }
    }
    location = asked === 0 ? 14 : Math.round(4 + (hits / asked) * 16);
  }
  if (
    student.homeState &&
    student.homeState.toUpperCase() === u.state.toUpperCase()
  ) {
    location = Math.min(20, location + 3);
  }

  // --- Cost (15) --------------------------------------------------------
  let cost = 9;
  const inState =
    student.homeState != null &&
    student.homeState.toUpperCase() === u.state.toUpperCase();
  const sticker = annualCost(u, inState);
  if (student.maxAnnualCostUsd != null && sticker != null) {
    const ratio = sticker / student.maxAnnualCostUsd;
    if (ratio <= 0.85) {
      cost = 15;
      notes.push("Comfortably inside the stated budget");
    } else if (ratio <= 1) {
      cost = 12;
    } else if (ratio <= 1.25) {
      cost = 6;
      notes.push("Above budget at sticker price — aid would need to close the gap");
    } else {
      cost = 2;
      notes.push("Well above the stated budget at sticker price");
    }
  } else if (sticker == null) {
    cost = 8;
  }

  // --- Size (10) --------------------------------------------------------
  let size = 6;
  const wantsSize = student.preferredSizes.filter(
    (s) => s && s.toLowerCase() !== "any"
  );
  if (wantsSize.length === 0) {
    size = 8;
  } else if (wantsSize.some((s) => s.toLowerCase() === u.sizeBand.toLowerCase())) {
    size = 10;
  } else {
    const wantIndex = SIZE_ORDER.indexOf(wantsSize[0]);
    const haveIndex = SIZE_ORDER.indexOf(u.sizeBand);
    size = wantIndex >= 0 && haveIndex >= 0 && Math.abs(wantIndex - haveIndex) === 1 ? 6 : 3;
  }

  // --- Activity ecosystem (12) -------------------------------------------
  let activities = 4;
  if (student.intendedPrograms.length > 0 && student.activitiesText.trim()) {
    let hits = 0;
    for (const key of student.intendedPrograms) {
      hits = Math.max(hits, activityAlignment(student.activitiesText, key));
    }
    activities = clamp(3 + hits * 3, 0, 12);
    if (hits >= 2) {
      notes.push("Activities already point at the intended major");
    }
  }

  // --- Academic environment (8) ------------------------------------------
  // Best fit is a school where the student is neither drowning nor coasting.
  const z = academic.z;
  let academicEnvironment: number;
  if (z >= -0.5 && z <= 1.25) academicEnvironment = 8;
  else if (z > 1.25 && z <= 2.25) academicEnvironment = 6;
  else if (z < -0.5 && z >= -1.25) academicEnvironment = 5;
  else if (z > 2.25) {
    academicEnvironment = 4;
    notes.push("Academically well clear of the typical admit");
  } else {
    academicEnvironment = 2;
    notes.push("A stretch academically — the workload would be demanding");
  }

  const score = clamp(
    program + location + cost + size + activities + academicEnvironment,
    0,
    100
  );

  return {
    score: Math.round(score),
    program,
    location,
    cost,
    size,
    activities,
    academicEnvironment,
    notes,
    bestProgram,
  };
}

/** All-in annual cost, preferring the rate the student would actually pay. */
export function annualCost(u: University, inState: boolean): number | null {
  if (inState && u.tuitionInStateUsd != null) {
    const extras =
      u.totalCostUsd != null && u.tuitionOutOfStateUsd != null
        ? u.totalCostUsd - u.tuitionOutOfStateUsd
        : 0;
    return u.tuitionInStateUsd + Math.max(0, extras);
  }
  return u.totalCostUsd ?? u.tuitionUsd;
}
