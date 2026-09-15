import type { ActivityTier, RatedActivity } from "@/lib/admissions";

/**
 * Turns a student's free-text activity list into rated activities without
 * calling a model. The AI route replaces this with a much better reading when
 * an API key is configured; this keeps the tool fully functional without one.
 */

/** Distinction at national level or genuine independent creation. */
const TIER_1 = [
  "international",
  "national",
  "nationals",
  "isef",
  "regeneron",
  "usamo",
  "usajmo",
  "usabo semifinalist",
  "physics olympiad semifinalist",
  "chemistry olympiad national",
  "math olympiad",
  "usaco platinum",
  "usaco gold",
  "team usa",
  "world championship",
  "published",
  "publication",
  "patent",
  "presidential scholar",
  "intel sts",
  "siemens",
  "all-american",
  "recruited athlete",
  "carnegie hall",
  "youngarts",
  "national merit finalist",
  "signed with",
  "founded a nonprofit",
];

/** State-level distinction, or founding/leading something substantial. */
const TIER_2 = [
  "state",
  "statewide",
  "regional",
  "founder",
  "founded",
  "co-founder",
  "cofounder",
  "editor-in-chief",
  "editor in chief",
  "first place",
  "1st place",
  "champion",
  "gold medal",
  "valedictorian",
  "internship",
  "research assistant",
  "published article",
  "all-state",
  "all state",
  "drum major",
  "concertmaster",
  "eagle scout",
  "gold award",
  "varsity captain",
  "student body president",
];

/** School-level leadership or a sustained, visible role. */
const TIER_3 = [
  "president",
  "captain",
  "vice president",
  "treasurer",
  "secretary",
  "officer",
  "chair",
  "director",
  "section leader",
  "editor",
  "lead",
  "head",
  "manager",
  "coordinator",
  "varsity",
  "tutor",
  "mentor",
  "volunteer",
  "teaching assistant",
];

const LEADERSHIP = [
  "president",
  "captain",
  "founder",
  "founded",
  "co-founder",
  "cofounder",
  "editor",
  "chair",
  "director",
  "officer",
  "lead",
  "head",
  "manager",
  "coordinator",
  "drum major",
  "treasurer",
  "secretary",
  "section leader",
];

function includesAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n));
}

/** "(4 years)", "4 yrs", "since freshman year", "9th-12th". */
function detectYears(text: string): number {
  const explicit = text.match(/(\d)\s*(?:\+\s*)?(?:years?|yrs?)\b/);
  if (explicit) return Math.min(4, Number(explicit[1]));
  if (/\b(?:9th|freshman)\b/.test(text)) return 4;
  if (/\b(?:10th|sophomore)\b/.test(text)) return 3;
  if (/\b(?:11th|junior)\b/.test(text)) return 2;
  if (/\ball four years\b/.test(text)) return 4;
  return 1;
}

/** A state/regional/school qualifier caps an entry below national tier. */
const LOCAL_QUALIFIER = /\b(state|statewide|regional|county|district|school|local)\b/;

function detectTier(text: string): ActivityTier {
  const nationallyDistinguished = includesAny(text, TIER_1);
  if (nationallyDistinguished && !LOCAL_QUALIFIER.test(text)) return 1;
  if (nationallyDistinguished || includesAny(text, TIER_2)) return 2;
  if (includesAny(text, TIER_3)) return 3;
  return 4;
}

/**
 * One line per activity is the common shape, and lines routinely contain
 * commas ("Hospital volunteer, 200 hours"). So only fall back to splitting on
 * commas when the student wrote everything on a single line.
 */
function splitEntries(raw: string): string[] {
  const text = (raw ?? "").trim();
  if (!text) return [];

  const separator = /[\n;•]/.test(text) ? /[\n;•]+/ : /[,\n;•]+/;
  return text
    .split(separator)
    .map((s) => s.replace(/^[\s\-*\u2022]+/, "").replace(/^\d+[.)]\s*/, "").trim())
    .filter((s) => s.length >= 3);
}

export function parseActivities(raw: string): RatedActivity[] {
  const entries = splitEntries(raw ?? "");
  const seen = new Set<string>();
  const out: RatedActivity[] = [];

  for (const entry of entries) {
    const key = entry.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: entry.length > 90 ? `${entry.slice(0, 87)}…` : entry,
      tier: detectTier(key),
      leadership: includesAny(key, LEADERSHIP),
      years: detectYears(key),
    });
    if (out.length >= 12) break;
  }

  return out;
}
