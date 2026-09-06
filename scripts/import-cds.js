const fs = require("fs");
const path = require("path");

const csvPath = [
  path.join(__dirname, "../data/CDS_109_Universities_Consolidated_Statistics.csv"),
  "C:/Users/Admin/Downloads/CDS_109_Universities_Consolidated_Statistics.csv",
].find((p) => fs.existsSync(p));
if (!csvPath) {
  console.error("CDS CSV not found in data/ or Downloads/");
  process.exit(1);
}
const outTs = path.join(__dirname, "../src/lib/universities.ts");
const oldPath = path.join(__dirname, "old-universities.ts");

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

const universities = [];
for (const r of rows.slice(1)) {
  const name = (r[idx.UNIVERSITY] || "").trim();
  if (!name) continue;

  const acceptPct = num(r[idx.ACCEPTANCE_RATE_PERCENT]);
  const gpa = num(r[idx.AVERAGE_HIGH_SCHOOL_GPA]);
  let sat = num(r[idx.SAT_TYPICAL_SCORE_PROXY]);
  if (sat == null) sat = num(r[idx.SAT_MEDIAN_REPORTED]);
  if (sat == null) {
    const a = num(r[idx.SAT_25TH]);
    const b = num(r[idx.SAT_75TH]);
    if (a != null && b != null) sat = Math.round((a + b) / 2);
  }
  let act = num(r[idx.ACT_TYPICAL_SCORE_PROXY]);
  if (act == null) act = num(r[idx.ACT_MEDIAN_REPORTED]);
  if (act == null) {
    const a = num(r[idx.ACT_25TH]);
    const b = num(r[idx.ACT_75TH]);
    if (a != null && b != null) act = Math.round((a + b) / 2);
  }

  const rank = num(r[idx.US_NEWS_2026_RANK]);
  const tuition =
    num(r[idx.TUITION_SINGLE_RATE_USD]) ??
    num(r[idx.TUITION_OUT_OF_STATE_USD]) ??
    num(r[idx.TUITION_IN_STATE_USD]);

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

  const [city, state, region, setting, website] = meta || [
    prevFuzzy?.city || "—",
    prevFuzzy?.state || "US",
    prevFuzzy?.region || "United States",
    prevFuzzy?.setting || "Campus",
    prevFuzzy?.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(name)}`,
  ];

  const websiteUrl = website || prevFuzzy?.websiteUrl;
  const vrTourUrl =
    prevFuzzy?.vrTourUrl && !prevFuzzy.vrTourUrl.includes("google.com/search")
      ? prevFuzzy.vrTourUrl
      : `https://www.google.com/search?q=${encodeURIComponent(name + " virtual tour")}`;

  universities.push({
    id: slug(name),
    name,
    city,
    state,
    region,
    usNewsRank: rank,
    acceptanceRate:
      acceptPct != null ? Math.round(acceptPct * 100) / 10000 : null,
    avgGpa: gpa != null ? Math.round(gpa * 100) / 100 : null,
    satMid: sat != null ? Math.round(sat) : null,
    actMid: act != null ? Math.round(act) : null,
    tuitionUsd: tuition != null ? Math.round(tuition) : null,
    setting,
    interests: prevFuzzy?.interests || "academics,research,campus life",
    personalityFit: prevFuzzy?.personalityFit || "balanced,ambitious",
    extracurricularFit:
      prevFuzzy?.extracurricularFit || "clubs,research,service,athletics",
    vrTourUrl,
    cdsUrl: cds,
    websiteUrl,
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

const file = `export type University = {
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
  actMid: number | null;
  /** Best available tuition (single / OOS / in-state) in USD. */
  tuitionUsd: number | null;
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
