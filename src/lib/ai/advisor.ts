import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import type { RatedActivity, StudentProfile } from "@/lib/admissions";
import type { RankedUniversity } from "@/lib/listBuilder";
import { PROGRAMS, type ProgramKey } from "@/lib/programs";

/**
 * The AI layer reads the student's own words and writes the explanation. It
 * deliberately does NOT decide safety/match/reach — those come from the CDS
 * figures in `admissions.ts`, so the numbers stay auditable and reproducible
 * and the model cannot flatter a student into a badly balanced list.
 */

const MODEL = "claude-opus-5";

export function isAiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function client() {
  return new Anthropic({
    // 45s keeps a hung upstream from holding the request open indefinitely.
    timeout: 45_000,
    maxRetries: 1,
  });
}

const PROGRAM_KEYS = PROGRAMS.map((p) => p.key) as [ProgramKey, ...ProgramKey[]];

/* -------------------------------------------------------------------------
 * Step 1 — read the student's free text into structured signals
 * ---------------------------------------------------------------------- */

const ProfileReadSchema = z.object({
  programs: z
    .array(z.enum(PROGRAM_KEYS))
    .describe("Up to 3 program keys the student is aiming at, best match first."),
  activities: z
    .array(
      z.object({
        name: z.string().describe("Short label for the activity, max 80 chars."),
        tier: z
          .number()
          .int()
          .min(1)
          .max(4)
          .describe(
            "1 = national/international distinction or founded something with real reach. 2 = state-level distinction or founding/leading something substantial. 3 = school-level leadership or multi-year commitment. 4 = participation."
          ),
        leadership: z.boolean(),
        years: z.number().int().min(1).max(4),
      })
    )
    .describe("Every distinct activity the student described, max 12."),
  profileSummary: z
    .string()
    .describe("Two sentences describing this applicant's shape, written to the student as 'you'."),
});

export type ProfileRead = z.infer<typeof ProfileReadSchema>;

const PROFILE_SYSTEM = `You read a high-school student's description of themselves and turn it into structured data for a college list builder.

Rate activities the way an experienced admissions reader would, not the way a proud parent would:
- Tier 1 is rare. National or international distinction (USAMO, ISEF finalist, published research, recruited athlete, national arts award), or founding something with genuine outside reach.
- Tier 2 is state-level distinction, or founding/leading an organisation that really operates.
- Tier 3 is school-level leadership or a sustained multi-year commitment.
- Tier 4 is participation. Most activities are tier 4, and that is normal.

Do not inflate. A club member who lists "member of Key Club" is tier 4 even if they write it enthusiastically. Infer years only when the student states or clearly implies duration; otherwise use 1.

Pick program keys only from the provided list, and only ones the student's own words support.`;

export async function readProfile(input: {
  aboutText: string;
  activitiesText: string;
  intendedMajorText: string;
}): Promise<ProfileRead | null> {
  if (!isAiConfigured()) return null;

  const programList = PROGRAMS.map((p) => `${p.key} (${p.label})`).join("\n");

  try {
    const response = await client().messages.parse({
      model: MODEL,
      // Bounded structured output; no need for a large ceiling here.
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "low",
        format: zodOutputFormat(ProfileReadSchema),
      },
      system: PROFILE_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Available program keys:\n${programList}\n\n---\nIntended major, in the student's words:\n${
            input.intendedMajorText || "(not stated)"
          }\n\nActivities, in the student's words:\n${
            input.activitiesText || "(not stated)"
          }\n\nAnything else the student said about themselves:\n${
            input.aboutText || "(not stated)"
          }`,
        },
      ],
    });

    return response.parsed_output ?? null;
  } catch (error) {
    // The deterministic parser covers this path; never fail the request.
    console.error("[advisor] profile read failed:", describeError(error));
    return null;
  }
}

/** Convert the model's reading into the engine's activity type. */
export function toRatedActivities(read: ProfileRead): RatedActivity[] {
  return read.activities.slice(0, 12).map((a) => ({
    name: a.name.slice(0, 90),
    tier: Math.min(4, Math.max(1, a.tier)) as RatedActivity["tier"],
    leadership: a.leadership,
    years: Math.min(4, Math.max(1, a.years)),
  }));
}

/* -------------------------------------------------------------------------
 * Step 2 — explain the list that the model already computed
 * ---------------------------------------------------------------------- */

const AdviceSchema = z.object({
  strategy: z
    .string()
    .describe(
      "3-5 sentences of overall strategy for this list, addressed to the student as 'you'. Reference the actual balance of safeties, matches and reaches."
    ),
  notes: z
    .array(
      z.object({
        id: z.string().describe("The school id exactly as given."),
        note: z
          .string()
          .describe(
            "One or two sentences on why this school is on the list for this specific student, and what to do about it."
          ),
      })
    )
    .describe("One note per school provided, in the same order."),
});

export type Advice = z.infer<typeof AdviceSchema>;

const ADVICE_SYSTEM = `You are an experienced, straight-talking college counsellor writing notes on a college list that has already been built and categorised.

The safety/match/reach label and the admission probability for each school were computed from Common Data Set statistics. Treat them as given: never dispute, recalculate, or soften them. Your job is to explain why each school earned its place for this particular student and what they should do next about it.

Rules:
- Address the student directly as "you".
- Be specific to the student's stated major and activities. A note that would fit any applicant is a wasted note.
- Name the real trade-off where there is one: cost, size, location, or how far the odds are from comfortable.
- Do not invent facts about a school's programs, campus, or statistics beyond what you are given.
- No filler openers, no praise for its own sake, no exclamation marks.
- Keep each note under 45 words.`;

export async function writeAdvice(
  student: StudentProfile,
  schools: RankedUniversity[],
  profileSummary: string | null
): Promise<Advice | null> {
  if (!isAiConfigured() || schools.length === 0) return null;

  const roster = schools
    .map((r) => {
      const cost =
        r.estimatedAnnualCostUsd != null
          ? `$${r.estimatedAnnualCostUsd.toLocaleString()}/yr`
          : "cost not reported";
      return [
        `id: ${r.university.id}`,
        `  name: ${r.university.name} — ${r.university.city}, ${r.university.state} (${r.university.region}, ${r.university.setting}, ${r.university.sizeBand})`,
        `  verdict: ${r.category}${r.farReach ? " (far reach)" : ""}, estimated ${Math.round(r.probability * 100)}% chance`,
        `  fit score: ${r.fitScore}/100${r.fit.bestProgram ? `, program standing: ${r.fit.bestProgram.label} — ${r.fit.bestProgram.tier}` : ""}`,
        `  cost: ${cost}`,
        `  drivers: ${r.reasons.join("; ")}`,
      ].join("\n");
    })
    .join("\n\n");

  const activities = student.activities
    .map((a) => `${a.name} (tier ${a.tier}${a.leadership ? ", leadership" : ""}, ${a.years}y)`)
    .join("; ");

  try {
    const response = await client().messages.parse({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: zodOutputFormat(AdviceSchema),
      },
      system: ADVICE_SYSTEM,
      messages: [
        {
          role: "user",
          content: `STUDENT
GPA ${student.gpa} (${student.gpaScale}), course rigor ${student.courseRigor}
${student.sat ? `SAT ${student.sat}` : ""}${student.act ? ` ACT ${student.act}` : ""}${!student.submitTests ? " (applying test-optional)" : ""}
Home state: ${student.homeState || "not stated"}
Intended programs: ${student.intendedPrograms.join(", ") || "undecided"}
Activities: ${activities || "none listed"}
${profileSummary ? `Summary: ${profileSummary}` : ""}
Budget: ${student.maxAnnualCostUsd ? `$${student.maxAnnualCostUsd.toLocaleString()}/yr` : "not stated"}
Wants: ${[...student.preferredRegions, ...student.preferredSettings, ...student.preferredSizes].join(", ") || "no strong preference"}

LIST (${schools.length} schools, already categorised — do not change these labels)

${roster}

Write the strategy paragraph and exactly one note per school, using the ids given.`,
        },
      ],
    });

    return response.parsed_output ?? null;
  } catch (error) {
    console.error("[advisor] advice generation failed:", describeError(error));
    return null;
  }
}

function describeError(error: unknown) {
  if (error instanceof Anthropic.AuthenticationError) return "invalid ANTHROPIC_API_KEY";
  if (error instanceof Anthropic.RateLimitError) return "rate limited";
  if (error instanceof Anthropic.APIError) return `API error ${error.status}: ${error.message}`;
  return error instanceof Error ? error.message : String(error);
}
