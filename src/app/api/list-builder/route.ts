import { z } from "zod";

import { parseActivities } from "@/lib/activityParser";
import type { CourseRigor, StudentProfile } from "@/lib/admissions";
import { getUniversities } from "@/lib/getUniversities";
import { buildList, DEFAULT_LIST_SHAPE } from "@/lib/listBuilder";
import { matchPrograms, PROGRAMS, type ProgramKey } from "@/lib/programs";
import {
  isAiConfigured,
  readProfile,
  toRatedActivities,
  writeAdvice,
} from "@/lib/ai/advisor";

/** Calls an external API and reads per-request input; never prerender. */
export const dynamic = "force-dynamic";

const PROGRAM_KEYS = new Set(PROGRAMS.map((p) => p.key));

const RequestSchema = z.object({
  gpa: z.number().min(0).max(5),
  gpaScale: z.enum(["weighted", "unweighted"]),
  sat: z.number().int().min(400).max(1600).optional(),
  act: z.number().int().min(1).max(36).optional(),
  submitTests: z.boolean().default(true),
  courseRigor: z.enum(["low", "moderate", "high", "highest"]),
  classRankPercentile: z.number().min(0).max(100).optional(),
  essayStrength: z.number().min(1).max(5).default(3),
  recommendationStrength: z.number().min(1).max(5).default(3),
  intendedMajorText: z.string().max(400).default(""),
  activitiesText: z.string().max(4000).default(""),
  aboutText: z.string().max(2000).default(""),
  homeState: z.string().max(2).optional(),
  preferredRegions: z.array(z.string().max(40)).max(6).default([]),
  preferredSettings: z.array(z.string().max(40)).max(6).default([]),
  preferredSizes: z.array(z.string().max(40)).max(6).default([]),
  maxAnnualCostUsd: z.number().min(0).max(200_000).optional(),
  firstGeneration: z.boolean().default(false),
  legacy: z.boolean().default(false),
  demonstratesInterest: z.boolean().default(false),
  shape: z
    .object({
      safeties: z.number().int().min(0).max(10),
      matches: z.number().int().min(0).max(12),
      reaches: z.number().int().min(0).max(12),
    })
    .optional(),
  /** Set false to skip the model and use the deterministic engine only. */
  useAi: z.boolean().default(true),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid profile.", details: parsed.error.issues.slice(0, 8) },
      { status: 400 }
    );
  }
  const input = parsed.data;

  if (input.sat == null && input.act == null && input.submitTests) {
    return Response.json(
      { error: "Enter an SAT or ACT score, or switch to test-optional." },
      { status: 400 }
    );
  }

  const wantsAi = input.useAi && isAiConfigured();

  // --- Step 1: understand the student ---------------------------------
  const aiRead = wantsAi
    ? await readProfile({
        aboutText: input.aboutText,
        activitiesText: input.activitiesText,
        intendedMajorText: input.intendedMajorText,
      })
    : null;

  const programs: ProgramKey[] = (
    aiRead?.programs?.filter((k): k is ProgramKey => PROGRAM_KEYS.has(k)) ?? []
  ).slice(0, 3);

  const fallbackPrograms = matchPrograms(
    `${input.intendedMajorText} ${input.aboutText}`.trim()
  );

  const student: StudentProfile = {
    gpa: input.gpa,
    gpaScale: input.gpaScale,
    sat: input.sat,
    act: input.act,
    submitTests: input.submitTests && (input.sat != null || input.act != null),
    courseRigor: input.courseRigor as CourseRigor,
    classRankPercentile: input.classRankPercentile,
    activities:
      aiRead != null ? toRatedActivities(aiRead) : parseActivities(input.activitiesText),
    essayStrength: input.essayStrength,
    recommendationStrength: input.recommendationStrength,
    intendedPrograms: programs.length > 0 ? programs : fallbackPrograms,
    activitiesText: input.activitiesText,
    homeState: input.homeState?.toUpperCase(),
    preferredRegions: input.preferredRegions,
    preferredSettings: input.preferredSettings,
    preferredSizes: input.preferredSizes,
    maxAnnualCostUsd: input.maxAnnualCostUsd,
    firstGeneration: input.firstGeneration,
    legacy: input.legacy,
    demonstratesInterest: input.demonstratesInterest,
  };

  // --- Step 2: score deterministically --------------------------------
  const catalog = await getUniversities();
  const built = buildList(student, catalog, {
    shape: input.shape ?? DEFAULT_LIST_SHAPE,
    regions: input.preferredRegions,
    maxAnnualCostUsd: input.maxAnnualCostUsd,
  });

  // --- Step 3: explain it ----------------------------------------------
  const advice = wantsAi
    ? await writeAdvice(student, built.schools, aiRead?.profileSummary ?? null)
    : null;

  if (advice) {
    const byId = new Map(advice.notes.map((n) => [n.id, n.note]));
    for (const school of built.schools) {
      const note = byId.get(school.university.id);
      if (note) school.advisorNote = note;
    }
  }

  return Response.json({
    schools: built.schools,
    counts: built.counts,
    warnings: built.warnings,
    dataNote: built.dataNote,
    strategy: advice?.strategy ?? null,
    profileSummary: aiRead?.profileSummary ?? null,
    interpretedPrograms: student.intendedPrograms,
    interpretedActivities: student.activities,
    /** Tells the UI which engine produced the explanations. */
    aiStatus: {
      configured: isAiConfigured(),
      requested: input.useAi,
      profileRead: aiRead != null,
      adviceWritten: advice != null,
    },
    catalogSize: catalog.length,
  });
}

export async function GET() {
  return Response.json({
    ok: true,
    aiConfigured: isAiConfigured(),
    programs: PROGRAMS.map((p) => ({ key: p.key, label: p.label })),
  });
}
