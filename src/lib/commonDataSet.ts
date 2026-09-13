import { readFileSync } from "node:fs";
import path from "node:path";

import { UNIVERSITIES } from "@/lib/universities";

export type CdsValueFlag = {
  field: string;
  reason: string;
};

export type CdsProfile = {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  usNewsRank: number | null;
  websiteUrl: string;
  cdsSourceUrl: string | null;
  sourceTxtFile: string | null;
  searchHint: string | null;
  admissions: {
    applicantsTotal: number | null;
    admittedTotal: number | null;
    enrolledTotal: number | null;
    acceptanceRatePct: number | null;
    waitlistOffered: number | null;
    waitlistAdmitted: number | null;
    yieldRatePct: number | null;
  };
  admissionFactors: Record<string, number | null>;
  tests: {
    sat: { p25: number | null; p50: number | null; p75: number | null; total: number | null };
    act: { p25: number | null; p50: number | null; p75: number | null };
    submittingSatPct: number | null;
    submittingActPct: number | null;
  };
  gpa: {
    average: number | null;
    distribution: {
      gte3_75Pct: number | null;
      gte3_5Pct: number | null;
      gte3_25Pct: number | null;
      gte3_0Pct: number | null;
      gte2_5Pct: number | null;
      gte2_0Pct: number | null;
      lt2_0Pct: number | null;
    };
  };
  costs: {
    tuitionSingleUsd: number | null;
    tuitionInStateUsd: number | null;
    tuitionOutOfStateUsd: number | null;
    requiredFeesUsd: number | null;
    housingAndFoodUsd: number | null;
    booksAndSuppliesUsd: number | null;
    transportationUsd: number | null;
    otherExpensesUsd: number | null;
    coaTotalSingleUsd: number | null;
    coaTotalInStateUsd: number | null;
    coaTotalOutOfStateUsd: number | null;
    needMetPct: number | null;
    averageAidPackageUsd: number | null;
  };
  diversity: {
    denominator: number | null;
    aianPct: number | null;
    asianPct: number | null;
    blackPct: number | null;
    hispanicPct: number | null;
    nhpiPct: number | null;
    whitePct: number | null;
    twoOrMorePct: number | null;
    unknownPct: number | null;
    nonresidentPct: number | null;
  };
  flaggedValues: CdsValueFlag[];
};

const FACTOR_FIELDS = [
  ["rigor_secondary_school_record", "ADMISSION_FACTOR_RIGOR_SCORE"],
  ["class_rank", "ADMISSION_FACTOR_CLASS_RANK_SCORE"],
  ["academic_gpa", "ADMISSION_FACTOR_ACADEMIC_GPA_SCORE"],
  ["standardized_test_scores", "ADMISSION_FACTOR_STANDARDIZED_TESTS_SCORE"],
  ["application_essay", "ADMISSION_FACTOR_ESSAY_SCORE"],
  ["recommendations", "ADMISSION_FACTOR_RECOMMENDATIONS_SCORE"],
  ["interview", "ADMISSION_FACTOR_INTERVIEW_SCORE"],
  ["extracurricular_activities", "ADMISSION_FACTOR_EXTRACURRICULARS_SCORE"],
  ["talent_ability", "ADMISSION_FACTOR_TALENT_ABILITY_SCORE"],
  ["character_personal_qualities", "ADMISSION_FACTOR_CHARACTER_PERSONAL_SCORE"],
  ["first_generation", "ADMISSION_FACTOR_FIRST_GENERATION_SCORE"],
  ["alumni_relation", "ADMISSION_FACTOR_ALUMNI_RELATION_SCORE"],
  ["geographical_residence", "ADMISSION_FACTOR_GEOGRAPHIC_RESIDENCE_SCORE"],
  ["state_residency", "ADMISSION_FACTOR_STATE_RESIDENCY_SCORE"],
  ["religious_affiliation", "ADMISSION_FACTOR_RELIGIOUS_AFFILIATION_SCORE"],
  ["volunteer_work", "ADMISSION_FACTOR_VOLUNTEER_WORK_SCORE"],
  ["work_experience", "ADMISSION_FACTOR_WORK_EXPERIENCE_SCORE"],
  ["level_of_applicant_interest", "ADMISSION_FACTOR_APPLICANT_INTEREST_SCORE"],
] as const;

const MISSING_URL_STUB_SCHOOLS = [
  "Brandeis University",
  "Chapman University",
  "Clark University",
  "Creighton University",
  "DePaul University",
  "Drexel University",
  "Elon University",
  "Fordham University",
  "George Mason University",
  "Gonzaga University",
  "Howard University",
  "Illinois Institute of Technology",
  "Lehigh University",
  "Loyola Marymount University",
  "Marquette University",
  "Miami University Oxford",
  "New Jersey Institute of Technology",
  "Northeastern University",
  "Pepperdine University",
  "Rensselaer Polytechnic Institute",
  "Rochester Institute of Technology",
  "Rowan University",
  "Saint Louis University",
  "Santa Clara University",
  "Seton Hall University",
  "Southern Methodist University",
  "Stevens Institute of Technology",
  "Temple University",
  "Texas Christian University",
  "Tulane University",
  "University of Alabama at Birmingham",
  "University of Dayton",
  "University of Denver",
  "University of Maryland Baltimore County",
  "University of Missouri-Kansas City",
  "University of Oklahoma Health Sciences",
  "University of San Francisco",
  "University of Texas at Dallas",
  "Villanova University",
  "Wake Forest University",
  "Washington State University",
  "Wayne State University",
  "Worcester Polytechnic Institute",
  "Yeshiva University",
  "Binghamton University SUNY",
  "Colorado State University",
  "Louisiana State University",
  "Mississippi State University",
  "Oklahoma State University",
  "University of Mississippi",
  "Williams College",
  "Amherst College",
  "Swarthmore College",
  "Pomona College",
  "Wellesley College",
  "Bowdoin College",
  "Carleton College",
  "Claremont McKenna College",
  "Middlebury College",
  "Washington and Lee University",
  "Davidson College",
  "Grinnell College",
  "Hamilton College",
  "Haverford College",
  "Vassar College",
  "Colby College",
  "Colgate University",
  "Smith College",
  "Wesleyan University",
  "Bates College",
  "Harvey Mudd College",
  "Barnard College",
  "University of Richmond",
  "Macalester College",
  "Bryn Mawr College",
  "Kenyon College",
  "Scripps College",
  "Oberlin College",
  "Mount Holyoke College",
  "Colorado College",
  "Trinity College",
  "Bucknell University",
  "College of the Holy Cross",
  "Lafayette College",
  "Skidmore College",
  "Union College",
  "Whitman College",
  "Denison University",
  "DePauw University",
  "Dickinson College",
  "Franklin and Marshall College",
  "Furman University",
  "Occidental College",
  "Pitzer College",
  "Rhodes College",
  "St. Olaf College",
  "Connecticut College",
  "Gettysburg College",
  "Bard College",
  "Spelman College",
  "Sewanee: The University of the South",
  "Berea College",
];

const FLAGGED_BY_SCHOOL: Record<string, CdsValueFlag[]> = {
  "dartmouth-college": [{ field: "acceptance_rate_pct", reason: "Data flagged — verify with source." }],
  "university-of-california-san-diego": [
    { field: "applicants_total", reason: "Data flagged — verify with source." },
  ],
  "university-of-san-diego": [
    { field: "applicants_total", reason: "Data flagged — verify with source." },
    { field: "admitted_total", reason: "Data flagged — verify with source." },
  ],
  "university-of-north-carolina-at-chapel-hill": [
    { field: "tuition", reason: "Data flagged — verify with source." },
  ],
  "university-of-louisville": [{ field: "tuition", reason: "Data flagged — verify with source." }],
  "university-of-south-carolina": [
    { field: "books_and_supplies", reason: "Data flagged — verify with source." },
  ],
};

const UNIVERSITY_META = new Map(
  UNIVERSITIES.map((u) => [
    normalizeName(u.name),
    {
      city: u.city,
      state: u.state,
      region: u.region,
      websiteUrl: u.websiteUrl,
      usNewsRank: u.usNewsRank,
    },
  ])
);

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          current += '"';
          i++;
          continue;
        }
        inQuotes = false;
        continue;
      }
      current += char;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(current);
      current = "";
      continue;
    }
    if (char === "\r") continue;
    if (char === "\n") {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }
    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }
  return rows;
}

function parseNumber(value: string | undefined) {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  const upper = normalized.toUpperCase();
  if (upper === "NA" || upper === "NOT_REPORTED" || upper === "NULL") return null;
  const n = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function numberFromColumns(
  row: string[],
  idx: Record<string, number>,
  candidates: string[]
) {
  for (const candidate of candidates) {
    const columnIndex = idx[candidate];
    if (columnIndex == null) continue;
    return parseNumber(row[columnIndex]);
  }
  return null;
}

function buildStub(name: string): CdsProfile {
  const meta = UNIVERSITY_META.get(normalizeName(name));
  return {
    id: slugify(name),
    name,
    city: meta?.city ?? "Not reported",
    state: meta?.state ?? "Not reported",
    region: meta?.region ?? "Not reported",
    usNewsRank: meta?.usNewsRank ?? null,
    websiteUrl: meta?.websiteUrl ?? "",
    cdsSourceUrl: null,
    sourceTxtFile: null,
    searchHint: `Search "${name} Common Data Set"`,
    admissions: {
      applicantsTotal: null,
      admittedTotal: null,
      enrolledTotal: null,
      acceptanceRatePct: null,
      waitlistOffered: null,
      waitlistAdmitted: null,
      yieldRatePct: null,
    },
    admissionFactors: Object.fromEntries(FACTOR_FIELDS.map(([k]) => [k, null])),
    tests: {
      sat: { p25: null, p50: null, p75: null, total: null },
      act: { p25: null, p50: null, p75: null },
      submittingSatPct: null,
      submittingActPct: null,
    },
    gpa: {
      average: null,
      distribution: {
        gte3_75Pct: null,
        gte3_5Pct: null,
        gte3_25Pct: null,
        gte3_0Pct: null,
        gte2_5Pct: null,
        gte2_0Pct: null,
        lt2_0Pct: null,
      },
    },
    costs: {
      tuitionSingleUsd: null,
      tuitionInStateUsd: null,
      tuitionOutOfStateUsd: null,
      requiredFeesUsd: null,
      housingAndFoodUsd: null,
      booksAndSuppliesUsd: null,
      transportationUsd: null,
      otherExpensesUsd: null,
      coaTotalSingleUsd: null,
      coaTotalInStateUsd: null,
      coaTotalOutOfStateUsd: null,
      needMetPct: null,
      averageAidPackageUsd: null,
    },
    diversity: {
      denominator: null,
      aianPct: null,
      asianPct: null,
      blackPct: null,
      hispanicPct: null,
      nhpiPct: null,
      whitePct: null,
      twoOrMorePct: null,
      unknownPct: null,
      nonresidentPct: null,
    },
    flaggedValues: FLAGGED_BY_SCHOOL[slugify(name)] ?? [],
  };
}

function buildProfilesFromCsv(): CdsProfile[] {
  const csvPath = path.join(process.cwd(), "data", "CDS_109_Universities_Consolidated_Statistics.csv");
  const raw = readFileSync(csvPath, "utf8");
  const rows = parseCsv(raw);
  const headers = rows[0];
  const idx = Object.fromEntries(headers.map((header, index) => [header, index]));
  const rankColumn = headers.find((header) => /^US_NEWS_.*_RANK$/.test(header));
  const profiles: CdsProfile[] = [];

  for (const row of rows.slice(1)) {
    const name = row[idx.UNIVERSITY]?.trim();
    if (!name) continue;
    const meta = UNIVERSITY_META.get(normalizeName(name));
    const id = slugify(name);
    const factors = Object.fromEntries(
      FACTOR_FIELDS.map(([key, source]) => [key, parseNumber(row[idx[source]])])
    );

    profiles.push({
      id,
      name,
      city: meta?.city ?? "Not reported",
      state: meta?.state ?? "Not reported",
      region: meta?.region ?? "Not reported",
      usNewsRank: (rankColumn ? parseNumber(row[idx[rankColumn]]) : null) ?? meta?.usNewsRank ?? null,
      websiteUrl: meta?.websiteUrl ?? "",
      cdsSourceUrl:
        row[idx.PRIMARY_ADMISSIONS_SOURCE_URL] && row[idx.PRIMARY_ADMISSIONS_SOURCE_URL] !== "NA"
          ? row[idx.PRIMARY_ADMISSIONS_SOURCE_URL]
          : row[idx.ADMISSION_FACTORS_SOURCE_URL] && row[idx.ADMISSION_FACTORS_SOURCE_URL] !== "NA"
            ? row[idx.ADMISSION_FACTORS_SOURCE_URL]
            : row[idx.COST_SOURCE_URL] && row[idx.COST_SOURCE_URL] !== "NA"
              ? row[idx.COST_SOURCE_URL]
              : row[idx.DIVERSITY_SOURCE_URL] && row[idx.DIVERSITY_SOURCE_URL] !== "NA"
                ? row[idx.DIVERSITY_SOURCE_URL]
                : null,
      sourceTxtFile: row[idx.SOURCE_TXT_FILE] && row[idx.SOURCE_TXT_FILE] !== "NA" ? row[idx.SOURCE_TXT_FILE] : null,
      searchHint: null,
      admissions: {
        applicantsTotal: numberFromColumns(row, idx, ["APPLICANTS_TOTAL", "APPLICANTS"]),
        admittedTotal: numberFromColumns(row, idx, ["ADMITTED_TOTAL", "ADMITTED"]),
        enrolledTotal: numberFromColumns(row, idx, ["ENROLLED_TOTAL", "ENROLLED"]),
        acceptanceRatePct: parseNumber(row[idx.ACCEPTANCE_RATE_PERCENT]),
        waitlistOffered: numberFromColumns(row, idx, ["WAITLIST_OFFERED"]),
        waitlistAdmitted: numberFromColumns(row, idx, ["WAITLIST_ADMITTED"]),
        yieldRatePct: numberFromColumns(row, idx, ["YIELD_RATE_PERCENT", "YIELD_RATE_PCT"]),
      },
      admissionFactors: factors,
      tests: {
        sat: {
          p25: parseNumber(row[idx.SAT_25TH]),
          p50: parseNumber(row[idx.SAT_MEDIAN_REPORTED]),
          p75: parseNumber(row[idx.SAT_75TH]),
          total: parseNumber(row[idx.SAT_TYPICAL_SCORE_PROXY]),
        },
        act: {
          p25: parseNumber(row[idx.ACT_25TH]),
          p50: parseNumber(row[idx.ACT_MEDIAN_REPORTED]),
          p75: parseNumber(row[idx.ACT_75TH]),
        },
        submittingSatPct: numberFromColumns(row, idx, ["PERCENT_SUBMITTING_SAT", "SUBMITTING_SAT_PERCENT"]),
        submittingActPct: numberFromColumns(row, idx, ["PERCENT_SUBMITTING_ACT", "SUBMITTING_ACT_PERCENT"]),
      },
      gpa: {
        average: parseNumber(row[idx.AVERAGE_HIGH_SCHOOL_GPA]),
        distribution: {
          gte3_75Pct: numberFromColumns(row, idx, ["GPA_DIST_3_75_UP_PCT"]),
          gte3_5Pct: numberFromColumns(row, idx, ["GPA_DIST_3_5_TO_3_74_PCT"]),
          gte3_25Pct: numberFromColumns(row, idx, ["GPA_DIST_3_25_TO_3_49_PCT"]),
          gte3_0Pct: numberFromColumns(row, idx, ["GPA_DIST_3_0_TO_3_24_PCT"]),
          gte2_5Pct: numberFromColumns(row, idx, ["GPA_DIST_2_5_TO_2_99_PCT"]),
          gte2_0Pct: numberFromColumns(row, idx, ["GPA_DIST_2_0_TO_2_49_PCT"]),
          lt2_0Pct: numberFromColumns(row, idx, ["GPA_DIST_LT_2_0_PCT"]),
        },
      },
      costs: {
        tuitionSingleUsd: parseNumber(row[idx.TUITION_SINGLE_RATE_USD]),
        tuitionInStateUsd: parseNumber(row[idx.TUITION_IN_STATE_USD]),
        tuitionOutOfStateUsd: parseNumber(row[idx.TUITION_OUT_OF_STATE_USD]),
        requiredFeesUsd: numberFromColumns(row, idx, ["REQUIRED_FEES_USD"]),
        housingAndFoodUsd: parseNumber(row[idx.HOUSING_AND_FOOD_USD]),
        booksAndSuppliesUsd: parseNumber(row[idx.BOOKS_AND_SUPPLIES_USD]),
        transportationUsd: parseNumber(row[idx.TRANSPORTATION_USD]),
        otherExpensesUsd: parseNumber(row[idx.PERSONAL_OTHER_EXPENSES_USD]),
        coaTotalSingleUsd: parseNumber(row[idx.TOTAL_COST_SINGLE_RATE_USD]),
        coaTotalInStateUsd: parseNumber(row[idx.TOTAL_COST_IN_STATE_USD]),
        coaTotalOutOfStateUsd: parseNumber(row[idx.TOTAL_COST_OUT_OF_STATE_USD]),
        needMetPct: numberFromColumns(row, idx, ["PERCENT_NEED_MET", "NEED_MET_PERCENT"]),
        averageAidPackageUsd: numberFromColumns(row, idx, ["AVERAGE_AID_PACKAGE_USD"]),
      },
      diversity: {
        denominator: parseNumber(row[idx.DIVERSITY_DENOMINATOR]),
        aianPct: parseNumber(row[idx.AIAN_PERCENT]),
        asianPct: parseNumber(row[idx.ASIAN_PERCENT]),
        blackPct: parseNumber(row[idx.BLACK_PERCENT]),
        hispanicPct: parseNumber(row[idx.HISPANIC_PERCENT]),
        nhpiPct: parseNumber(row[idx.NHPI_PERCENT]),
        whitePct: parseNumber(row[idx.WHITE_PERCENT]),
        twoOrMorePct: parseNumber(row[idx.TWO_OR_MORE_PERCENT]),
        unknownPct: parseNumber(row[idx.UNKNOWN_PERCENT]),
        nonresidentPct: parseNumber(row[idx.NONRESIDENT_PERCENT]),
      },
      flaggedValues: FLAGGED_BY_SCHOOL[id] ?? [],
    });
  }

  const profileById = new Set(profiles.map((profile) => profile.id));
  for (const name of MISSING_URL_STUB_SCHOOLS) {
    const id = slugify(name);
    if (!profileById.has(id)) {
      profiles.push(buildStub(name));
      profileById.add(id);
    }
  }

  profiles.sort((left, right) => {
    const leftRank = left.usNewsRank ?? 99999;
    const rightRank = right.usNewsRank ?? 99999;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.name.localeCompare(right.name);
  });

  return profiles;
}

const CDS_PROFILES = buildProfilesFromCsv();

export function getCommonDataSetProfiles() {
  return CDS_PROFILES;
}

export function searchCdsProfiles(list: CdsProfile[], q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return list;
  return list.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query) ||
      item.state.toLowerCase().includes(query) ||
      item.region.toLowerCase().includes(query)
  );
}

export function admissionFactorLabel(score: number | null) {
  if (score == null || score < 0) return "Not reported";
  if (score >= 3) return "Very important";
  if (score === 2) return "Important";
  if (score === 1) return "Considered";
  return "Not considered";
}
