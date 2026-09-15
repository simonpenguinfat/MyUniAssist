import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM: there is no __dirname here, so derive the script directory from import.meta.url.
const here = path.dirname(fileURLToPath(import.meta.url));

const csvPath = [
  path.join(here, "../data/CDS_109_Universities_Consolidated_Statistics.csv"),
  "C:/Users/Admin/Downloads/CDS_109_Universities_Consolidated_Statistics.csv",
].find((p) => fs.existsSync(p));
if (!csvPath) {
  console.error("CDS CSV not found in data/ or Downloads/");
  process.exit(1);
}
const outTs = path.join(here, "../src/lib/universities.ts");
const oldPath = path.join(here, "old-universities.ts");

/** city, state, region, setting, website */
const META = {
  "American University": ["Washington", "DC", "Northeast", "Urban", "https://www.american.edu/"],
  "Auburn University": ["Auburn", "AL", "South", "College town", "https://www.auburn.edu/"],
  "Baylor University": ["Waco", "TX", "South", "Urban", "https://www.baylor.edu/"],
  "Binghamton University": ["Binghamton", "NY", "Northeast", "Suburban", "https://www.binghamton.edu/"],
  "Boston College": ["Chestnut Hill", "MA", "Northeast", "Suburban", "https://www.bc.edu/"],
  "Boston University": ["Boston", "MA", "Northeast", "Urban", "https://www.bu.edu/"],
  "Brandeis University": ["Waltham", "MA", "Northeast", "Suburban", "https://www.brandeis.edu/"],
  "Brown University": ["Providence", "RI", "Northeast", "Urban", "https://www.brown.edu/"],
  "California Institute of Technology": ["Pasadena", "CA", "West", "Suburban", "https://www.caltech.edu/"],
  "Carnegie Mellon University": ["Pittsburgh", "PA", "Northeast", "Urban", "https://www.cmu.edu/"],
  "Case Western Reserve University": ["Cleveland", "OH", "Midwest", "Urban", "https://case.edu/"],
  "Clemson University": ["Clemson", "SC", "South", "College town", "https://www.clemson.edu/"],
  "Colorado School of Mines": ["Golden", "CO", "West", "Suburban", "https://www.mines.edu/"],
  "Columbia University": ["New York", "NY", "Northeast", "Urban", "https://www.columbia.edu/"],
  "Cornell University": ["Ithaca", "NY", "Northeast", "College town", "https://www.cornell.edu/"],
  "Dartmouth College": ["Hanover", "NH", "Northeast", "College town", "https://home.dartmouth.edu/"],
  "Drexel University": ["Philadelphia", "PA", "Northeast", "Urban", "https://drexel.edu/"],
  "Duke University": ["Durham", "NC", "South", "Suburban", "https://www.duke.edu/"],
  "Emory University": ["Atlanta", "GA", "South", "Suburban", "https://www.emory.edu/"],
  "Florida International University": ["Miami", "FL", "South", "Urban", "https://www.fiu.edu/"],
  "Florida State University": ["Tallahassee", "FL", "South", "College town", "https://www.fsu.edu/"],
  "Fordham University": ["New York", "NY", "Northeast", "Urban", "https://www.fordham.edu/"],
  "George Washington University": ["Washington", "DC", "Northeast", "Urban", "https://www.gwu.edu/"],
  "Georgetown University": ["Washington", "DC", "Northeast", "Urban", "https://www.georgetown.edu/"],
  "Georgia Institute of Technology": ["Atlanta", "GA", "South", "Urban", "https://www.gatech.edu/"],
  "Gonzaga University": ["Spokane", "WA", "West", "Urban", "https://www.gonzaga.edu/"],
  "Harvard University": ["Cambridge", "MA", "Northeast", "Urban", "https://www.harvard.edu/"],
  "Howard University": ["Washington", "DC", "Northeast", "Urban", "https://www.howard.edu/"],
  "Indiana University Bloomington": ["Bloomington", "IN", "Midwest", "College town", "https://www.indiana.edu/"],
  "Johns Hopkins University": ["Baltimore", "MD", "Northeast", "Urban", "https://www.jhu.edu/"],
  "Lehigh University": ["Bethlehem", "PA", "Northeast", "Suburban", "https://www.lehigh.edu/"],
  "Loyola Marymount University": ["Los Angeles", "CA", "West", "Suburban", "https://www.lmu.edu/"],
  "Marquette University": ["Milwaukee", "WI", "Midwest", "Urban", "https://www.marquette.edu/"],
  "Massachusetts Institute of Technology": ["Cambridge", "MA", "Northeast", "Urban", "https://www.mit.edu/"],
  "Michigan State University": ["East Lansing", "MI", "Midwest", "College town", "https://msu.edu/"],
  "New Jersey Institute of Technology": ["Newark", "NJ", "Northeast", "Urban", "https://www.njit.edu/"],
  "New York University": ["New York", "NY", "Northeast", "Urban", "https://www.nyu.edu/"],
  "North Carolina State University": ["Raleigh", "NC", "South", "Urban", "https://www.ncsu.edu/"],
  "Northeastern University": ["Boston", "MA", "Northeast", "Urban", "https://www.northeastern.edu/"],
  "Northwestern University": ["Evanston", "IL", "Midwest", "Suburban", "https://www.northwestern.edu/"],
  "Ohio State University": ["Columbus", "OH", "Midwest", "Urban", "https://www.osu.edu/"],
  "Pennsylvania State University": ["University Park", "PA", "Northeast", "College town", "https://www.psu.edu/"],
  "Pepperdine University": ["Malibu", "CA", "West", "Suburban", "https://www.pepperdine.edu/"],
  "Princeton University": ["Princeton", "NJ", "Northeast", "Suburban", "https://www.princeton.edu/"],
  "Purdue University": ["West Lafayette", "IN", "Midwest", "College town", "https://www.purdue.edu/"],
  "Rensselaer Polytechnic Institute": ["Troy", "NY", "Northeast", "Suburban", "https://www.rpi.edu/"],
  "Rice University": ["Houston", "TX", "South", "Urban", "https://www.rice.edu/"],
  "Rochester Institute of Technology": ["Rochester", "NY", "Northeast", "Suburban", "https://www.rit.edu/"],
  "Rutgers University-Camden": ["Camden", "NJ", "Northeast", "Urban", "https://www.camden.rutgers.edu/"],
  "Rutgers University-New Brunswick": ["New Brunswick", "NJ", "Northeast", "Urban", "https://www.rutgers.edu/"],
  "Rutgers University-Newark": ["Newark", "NJ", "Northeast", "Urban", "https://www.newark.rutgers.edu/"],
  "Saint Louis University": ["St. Louis", "MO", "Midwest", "Urban", "https://www.slu.edu/"],
  "Santa Clara University": ["Santa Clara", "CA", "West", "Suburban", "https://www.scu.edu/"],
  "Southern Methodist University": ["Dallas", "TX", "South", "Urban", "https://www.smu.edu/"],
  "Stanford University": ["Stanford", "CA", "West", "Suburban", "https://www.stanford.edu/"],
  "Stevens Institute of Technology": ["Hoboken", "NJ", "Northeast", "Urban", "https://www.stevens.edu/"],
  "Stony Brook University": ["Stony Brook", "NY", "Northeast", "Suburban", "https://www.stonybrook.edu/"],
  "Syracuse University": ["Syracuse", "NY", "Northeast", "Urban", "https://www.syracuse.edu/"],
  "Temple University": ["Philadelphia", "PA", "Northeast", "Urban", "https://www.temple.edu/"],
  "Texas A&M University": ["College Station", "TX", "South", "College town", "https://www.tamu.edu/"],
  "Texas Christian University": ["Fort Worth", "TX", "South", "Suburban", "https://www.tcu.edu/"],
  "Tufts University": ["Medford", "MA", "Northeast", "Suburban", "https://www.tufts.edu/"],
  "Tulane University": ["New Orleans", "LA", "South", "Urban", "https://tulane.edu/"],
  "University at Buffalo": ["Buffalo", "NY", "Northeast", "Suburban", "https://www.buffalo.edu/"],
  "University of California, Berkeley": ["Berkeley", "CA", "West", "Urban", "https://www.berkeley.edu/"],
  "University of California, Davis": ["Davis", "CA", "West", "College town", "https://www.ucdavis.edu/"],
  "University of California, Irvine": ["Irvine", "CA", "West", "Suburban", "https://www.uci.edu/"],
  "University of California, Los Angeles": ["Los Angeles", "CA", "West", "Urban", "https://www.ucla.edu/"],
  "University of California, Merced": ["Merced", "CA", "West", "Suburban", "https://www.ucmerced.edu/"],
  "University of California, Riverside": ["Riverside", "CA", "West", "Suburban", "https://www.ucr.edu/"],
  "University of California, San Diego": ["La Jolla", "CA", "West", "Suburban", "https://www.ucsd.edu/"],
  "University of California, Santa Barbara": ["Santa Barbara", "CA", "West", "Suburban", "https://www.ucsb.edu/"],
  "University of California, Santa Cruz": ["Santa Cruz", "CA", "West", "Suburban", "https://www.ucsc.edu/"],
  "University of Chicago": ["Chicago", "IL", "Midwest", "Urban", "https://www.uchicago.edu/"],
  "University of Colorado Boulder": ["Boulder", "CO", "West", "College town", "https://www.colorado.edu/"],
  "University of Connecticut": ["Storrs", "CT", "Northeast", "College town", "https://uconn.edu/"],
  "University of Delaware": ["Newark", "DE", "Northeast", "Suburban", "https://www.udel.edu/"],
  "University of Florida": ["Gainesville", "FL", "South", "College town", "https://www.ufl.edu/"],
  "University of Georgia": ["Athens", "GA", "South", "College town", "https://www.uga.edu/"],
  "University of Illinois Chicago": ["Chicago", "IL", "Midwest", "Urban", "https://www.uic.edu/"],
  "University of Illinois Urbana-Champaign": ["Champaign", "IL", "Midwest", "College town", "https://illinois.edu/"],
  "University of Iowa": ["Iowa City", "IA", "Midwest", "College town", "https://uiowa.edu/"],
  "University of Maryland, College Park": ["College Park", "MD", "Northeast", "Suburban", "https://www.umd.edu/"],
  "University of Massachusetts Amherst": ["Amherst", "MA", "Northeast", "College town", "https://www.umass.edu/"],
  "University of Miami": ["Coral Gables", "FL", "South", "Suburban", "https://www.miami.edu/"],
  "University of Michigan, Ann Arbor": ["Ann Arbor", "MI", "Midwest", "College town", "https://umich.edu/"],
  "University of Minnesota Twin Cities": ["Minneapolis", "MN", "Midwest", "Urban", "https://twin-cities.umn.edu/"],
  "University of Missouri": ["Columbia", "MO", "Midwest", "College town", "https://missouri.edu/"],
  "University of North Carolina at Chapel Hill": ["Chapel Hill", "NC", "South", "College town", "https://www.unc.edu/"],
  "University of Notre Dame": ["Notre Dame", "IN", "Midwest", "Suburban", "https://www.nd.edu/"],
  "University of Pennsylvania": ["Philadelphia", "PA", "Northeast", "Urban", "https://www.upenn.edu/"],
  "University of Pittsburgh": ["Pittsburgh", "PA", "Northeast", "Urban", "https://www.pitt.edu/"],
  "University of Rochester": ["Rochester", "NY", "Northeast", "Suburban", "https://www.rochester.edu/"],
  "University of South Florida": ["Tampa", "FL", "South", "Urban", "https://www.usf.edu/"],
  "University of Southern California": ["Los Angeles", "CA", "West", "Urban", "https://www.usc.edu/"],
  "University of Tennessee, Knoxville": ["Knoxville", "TN", "South", "Urban", "https://www.utk.edu/"],
  "University of Texas at Austin": ["Austin", "TX", "South", "Urban", "https://www.utexas.edu/"],
  "University of Virginia": ["Charlottesville", "VA", "South", "College town", "https://www.virginia.edu/"],
  "University of Washington": ["Seattle", "WA", "West", "Urban", "https://www.washington.edu/"],
  "University of Wisconsin-Madison": ["Madison", "WI", "Midwest", "College town", "https://www.wisc.edu/"],
  "Vanderbilt University": ["Nashville", "TN", "South", "Urban", "https://www.vanderbilt.edu/"],
  "Villanova University": ["Villanova", "PA", "Northeast", "Suburban", "https://www1.villanova.edu/"],
  "Virginia Tech": ["Blacksburg", "VA", "South", "College town", "https://www.vt.edu/"],
  "Wake Forest University": ["Winston-Salem", "NC", "South", "Suburban", "https://www.wfu.edu/"],
  "Washington University in St. Louis": ["St. Louis", "MO", "Midwest", "Suburban", "https://wustl.edu/"],
  "William & Mary": ["Williamsburg", "VA", "South", "College town", "https://www.wm.edu/"],
  "Worcester Polytechnic Institute": ["Worcester", "MA", "Northeast", "Urban", "https://www.wpi.edu/"],
  "Yale University": ["New Haven", "CT", "Northeast", "Urban", "https://www.yale.edu/"],
  "Yeshiva University": ["New York", "NY", "Northeast", "Urban", "https://www.yu.edu/"],
};

function parseCSV(text) {
  const rows = [];
  let i = 0;
  let field = "";
  let row = [];
  let inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQ = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQ = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function num(v) {
  if (v == null || v === "" || v === "NA") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function norm(s) {
  return s
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/university|college|of|at|the|in/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadOldSeed() {
  if (!fs.existsSync(oldPath)) return new Map();
  const text = fs.readFileSync(oldPath, "utf8").replace(/\r\n/g, "\n");
  const map = new Map();
  const re =
    /name:\s*"([^"]+)"[\s\S]*?setting:\s*"([^"]+)"[\s\S]*?interests:\s*"([^"]+)"[\s\S]*?personalityFit:\s*"([^"]+)"[\s\S]*?extracurricularFit:\s*"([^"]+)"[\s\S]*?vrTourUrl:\s*"([^"]+)"[\s\S]*?websiteUrl:\s*"([^"]+)"[\s\S]*?sizeBand:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) {
    const [, name, setting, interests, personalityFit, extracurricularFit, vrTourUrl, websiteUrl, sizeBand] =
      m;
    const city = (text.slice(m.index, m.index + 200).match(/city:\s*"([^"]+)"/) || [])[1];
    const state = (text.slice(m.index, m.index + 250).match(/state:\s*"([^"]+)"/) || [])[1];
    const region = (text.slice(m.index, m.index + 300).match(/region:\s*"([^"]+)"/) || [])[1];
    map.set(norm(name), {
      city,
      state,
      region,
      setting,
      interests,
      personalityFit,
      extracurricularFit,
      sizeBand,
      websiteUrl,
      vrTourUrl,
      name,
    });
  }
  return map;
}

const old = loadOldSeed();
const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCSV(raw);
const headers = rows[0];
const idx = Object.fromEntries(headers.map((h, i) => [h, i]));


/**
 * CDS section C7 importance scores, already numeric in the workbook.
 * 4 = Very Important, 3 = Important, 2 = Considered, 1 = Not Considered.
 * These are what let the model weight each school the way that school says it
 * actually reads an application.
 */
const FACTOR_COLUMNS = {
  rigor: "ADMISSION_FACTOR_RIGOR_SCORE",
  classRank: "ADMISSION_FACTOR_CLASS_RANK_SCORE",
  gpa: "ADMISSION_FACTOR_ACADEMIC_GPA_SCORE",
  tests: "ADMISSION_FACTOR_STANDARDIZED_TESTS_SCORE",
  essay: "ADMISSION_FACTOR_ESSAY_SCORE",
  recommendations: "ADMISSION_FACTOR_RECOMMENDATIONS_SCORE",
  interview: "ADMISSION_FACTOR_INTERVIEW_SCORE",
  extracurriculars: "ADMISSION_FACTOR_EXTRACURRICULARS_SCORE",
  talent: "ADMISSION_FACTOR_TALENT_ABILITY_SCORE",
  character: "ADMISSION_FACTOR_CHARACTER_PERSONAL_SCORE",
  firstGeneration: "ADMISSION_FACTOR_FIRST_GENERATION_SCORE",
  alumniRelation: "ADMISSION_FACTOR_ALUMNI_RELATION_SCORE",
  geographicResidence: "ADMISSION_FACTOR_GEOGRAPHIC_RESIDENCE_SCORE",
  stateResidency: "ADMISSION_FACTOR_STATE_RESIDENCY_SCORE",
  volunteerWork: "ADMISSION_FACTOR_VOLUNTEER_WORK_SCORE",
  workExperience: "ADMISSION_FACTOR_WORK_EXPERIENCE_SCORE",
  applicantInterest: "ADMISSION_FACTOR_APPLICANT_INTEREST_SCORE",
};

/**
 * Public/private control. The CSV only reports separate in-state and
 * out-of-state tuition for 3 of the 109 schools, so it cannot be inferred from
 * the data; this list is explicit. State-related schools (Pitt, Temple) count
 * as public because they charge a resident rate.
 */
const PUBLIC_SCHOOLS = new Set([
  "auburn-university",
  "binghamton-university",
  "clemson-university",
  "colorado-school-of-mines",
  "florida-international-university",
  "florida-state-university",
  "georgia-institute-of-technology",
  "indiana-university-bloomington",
  "michigan-state-university",
  "new-jersey-institute-of-technology",
  "north-carolina-state-university",
  "ohio-state-university",
  "pennsylvania-state-university",
  "purdue-university",
  "rutgers-university-camden",
  "rutgers-university-new-brunswick",
  "rutgers-university-newark",
  "stony-brook-university",
  "temple-university",
  "texas-a-and-m-university",
  "university-at-buffalo",
  "university-of-california-berkeley",
  "university-of-california-davis",
  "university-of-california-irvine",
  "university-of-california-los-angeles",
  "university-of-california-merced",
  "university-of-california-riverside",
  "university-of-california-san-diego",
  "university-of-california-santa-barbara",
  "university-of-california-santa-cruz",
  "university-of-colorado-boulder",
  "university-of-connecticut",
  "university-of-delaware",
  "university-of-florida",
  "university-of-georgia",
  "university-of-illinois-chicago",
  "university-of-illinois-urbana-champaign",
  "university-of-iowa",
  "university-of-maryland-college-park",
  "university-of-massachusetts-amherst",
  "university-of-michigan-ann-arbor",
  "university-of-minnesota-twin-cities",
  "university-of-missouri",
  "university-of-north-carolina-at-chapel-hill",
  "university-of-pittsburgh",
  "university-of-south-florida",
  "university-of-tennessee-knoxville",
  "university-of-texas-at-austin",
  "university-of-virginia",
  "university-of-washington",
  "university-of-wisconsin-madison",
  "virginia-tech",
  "william-and-mary",
]);

/**
 * The workbook writes 0 (not NA) into every admission-factor column for
 * schools whose CDS section C7 was never retrieved — those rows also carry
 * ADMISSION_FACTORS_CDS_YEAR = NA. A 0 therefore means "not reported", NOT
 * "not considered", and must become null so the model falls back to a default
 * rather than concluding the school ignores grades.
 */
/**
 * The year columns hold either a real CDS year ("2025-26") or bookkeeping
 * strings like "LATEST_CDS_SNAPSHOT_AS_OF_2026-07-27". Only the former is
 * meaningful to show a student.
 */
function cdsYear(raw) {
  const value = (raw ?? "").trim();
  return /^\d{4}(-\d{2})?$/.test(value) ? value : null;
}

function factorScore(raw) {
  const n = num(raw);
  if (n == null || n < 1 || n > 4) return null;
  return n;
}

const universities = [];
for (const r of rows.slice(1)) {
  const name = (r[idx.UNIVERSITY] || "").trim();
  if (!name) continue;

  const acceptPct = num(r[idx.ACCEPTANCE_RATE_PERCENT]);
  const gpa = num(r[idx.AVERAGE_HIGH_SCHOOL_GPA]);
  const sat25 = num(r[idx.SAT_25TH]);
  const sat75 = num(r[idx.SAT_75TH]);
  const act25 = num(r[idx.ACT_25TH]);
  const act75 = num(r[idx.ACT_75TH]);

  let sat = num(r[idx.SAT_TYPICAL_SCORE_PROXY]);
  if (sat == null) sat = num(r[idx.SAT_MEDIAN_REPORTED]);
  if (sat == null && sat25 != null && sat75 != null) sat = (sat25 + sat75) / 2;
  let act = num(r[idx.ACT_TYPICAL_SCORE_PROXY]);
  if (act == null) act = num(r[idx.ACT_MEDIAN_REPORTED]);
  if (act == null && act25 != null && act75 != null) act = (act25 + act75) / 2;

  const rank = num(r[idx.US_NEWS_2026_RANK]);
  const tuitionInState = num(r[idx.TUITION_IN_STATE_USD]);
  const tuitionOutOfState = num(r[idx.TUITION_OUT_OF_STATE_USD]);
  const tuition =
    num(r[idx.TUITION_SINGLE_RATE_USD]) ?? tuitionOutOfState ?? tuitionInState;
  const totalCost =
    num(r[idx.TOTAL_COST_SINGLE_RATE_USD]) ??
    num(r[idx.TOTAL_COST_OUT_OF_STATE_USD]) ??
    num(r[idx.TOTAL_COST_IN_STATE_USD]);

  const admissionFactors = {};
  for (const [key, col] of Object.entries(FACTOR_COLUMNS)) {
    admissionFactors[key] = factorScore(r[idx[col]]);
  }

  let cds =
    r[idx.PRIMARY_ADMISSIONS_SOURCE_URL] ||
    r[idx.ADMISSION_FACTORS_SOURCE_URL] ||
    "";
  if (!cds || cds === "NA") cds = "https://www.collegedata.fyi/";

  const meta = META[name];
  const prev = old.get(norm(name));
  // fuzzy old match
  let prevFuzzy = prev;
  if (!prevFuzzy) {
    for (const [k, v] of old.entries()) {
      if (norm(name).includes(k) || k.includes(norm(name))) {
        prevFuzzy = v;
        break;
      }
    }
  }

  const vrTourUrl =
    prevFuzzy?.vrTourUrl && !prevFuzzy.vrTourUrl.includes("google.com/search")
      ? prevFuzzy.vrTourUrl
      : `https://www.google.com/search?q=${encodeURIComponent(name + " virtual tour")}`;

  const [city, state, region, setting, website] = meta || [
    prevFuzzy?.city || "—",
    prevFuzzy?.state || "US",
    prevFuzzy?.region || "United States",
    prevFuzzy?.setting || "Campus",
    prevFuzzy?.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(name)}`,
  ];

  universities.push({
    id: slug(name),
    name,
    city,
    state,
    region,
    usNewsRank: rank,
    acceptanceRate: acceptPct != null ? Math.round(acceptPct * 100) / 10000 : null,
    avgGpa: gpa != null ? Math.round(gpa * 100) / 100 : null,
    satMid: sat != null ? Math.round(sat) : null,
    sat25: sat25 != null ? Math.round(sat25) : null,
    sat75: sat75 != null ? Math.round(sat75) : null,
    actMid: act != null ? Math.round(act) : null,
    act25: act25 != null ? Math.round(act25) : null,
    act75: act75 != null ? Math.round(act75) : null,
    tuitionUsd: tuition != null ? Math.round(tuition) : null,
    tuitionInStateUsd: tuitionInState != null ? Math.round(tuitionInState) : null,
    tuitionOutOfStateUsd:
      tuitionOutOfState != null ? Math.round(tuitionOutOfState) : null,
    totalCostUsd: totalCost != null ? Math.round(totalCost) : null,
    isPublic: PUBLIC_SCHOOLS.has(slug(name)),
    admissionFactors,
    admissionFactorsYear: cdsYear(r[idx.ADMISSION_FACTORS_CDS_YEAR]),
    acceptanceRateYear: cdsYear(r[idx.ACCEPTANCE_RATE_CDS_YEAR]),
    setting,
    interests: prevFuzzy?.interests || "academics,research,campus life",
    personalityFit: prevFuzzy?.personalityFit || "balanced,ambitious",
    extracurricularFit:
      prevFuzzy?.extracurricularFit || "clubs,research,service,athletics",
    vrTourUrl,
    cdsUrl: cds,
    websiteUrl: website || prevFuzzy?.websiteUrl,
    sizeBand: prevFuzzy?.sizeBand || "Large",
  });
}

universities.sort((a, b) => {
  const ar = a.usNewsRank ?? 9999;
  const br = b.usNewsRank ?? 9999;
  if (ar !== br) return ar - br;
  return a.name.localeCompare(b.name);
});

const missingMeta = universities.filter((u) => !META[u.name]).map((u) => u.name);
if (missingMeta.length) {
  console.warn("Missing META for:", missingMeta.join(", "));
}

const file = `export type AdmissionFactorKey =
  | "rigor"
  | "classRank"
  | "gpa"
  | "tests"
  | "essay"
  | "recommendations"
  | "interview"
  | "extracurriculars"
  | "talent"
  | "character"
  | "firstGeneration"
  | "alumniRelation"
  | "geographicResidence"
  | "stateResidency"
  | "volunteerWork"
  | "workExperience"
  | "applicantInterest";

/**
 * CDS section C7 importance, verbatim from the workbook:
 * 4 = Very Important, 3 = Important, 2 = Considered, 1 = Not Considered,
 * null = the school did not report that row.
 */
export type AdmissionFactors = Record<AdmissionFactorKey, number | null>;

export type University = {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  /** US News 2026 national rank from CDS workbook; null if unranked in source. */
  usNewsRank: number | null;
  /** Fraction 0–1; null when CDS reports NA. */
  acceptanceRate: number | null;
  avgGpa: number | null;
  satMid: number | null;
  sat25: number | null;
  sat75: number | null;
  actMid: number | null;
  act25: number | null;
  act75: number | null;
  /** Best available tuition (single / OOS / in-state) in USD. */
  tuitionUsd: number | null;
  tuitionInStateUsd: number | null;
  tuitionOutOfStateUsd: number | null;
  /** Tuition + housing + books + transport + personal, per CDS. */
  totalCostUsd: number | null;
  /** Public (or state-related) institutions charge a resident tuition rate. */
  isPublic: boolean;
  admissionFactors: AdmissionFactors;
  admissionFactorsYear: string | null;
  acceptanceRateYear: string | null;
  setting: string;
  interests: string;
  personalityFit: string;
  extracurricularFit: string;
  vrTourUrl: string;
  cdsUrl: string;
  websiteUrl: string;
  sizeBand: string;
};

/** Seeded from CDS_109_Universities_Consolidated_Statistics.csv (${universities.length} schools). */
export const UNIVERSITIES: University[] = ${JSON.stringify(universities, null, 2)};

export const UNIVERSITIES_BY_ID: Map<string, University> = new Map(
  UNIVERSITIES.map((u) => [u.id, u])
);

export function searchUniversities(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return UNIVERSITIES;
  return UNIVERSITIES.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.city.toLowerCase().includes(query) ||
      u.state.toLowerCase().includes(query) ||
      u.region.toLowerCase().includes(query)
  );
}

export function formatAcceptance(rate: number | null) {
  if (rate == null) return "—";
  return \`\${(rate * 100).toFixed(1)}%\`;
}
`;

fs.writeFileSync(outTs, file);
console.log(`Wrote ${universities.length} universities to ${outTs}`);
