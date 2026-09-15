"use client";

import { FormEvent, useState } from "react";
import type { RankedUniversity } from "@/lib/listBuilder";
import type { ProgramKey } from "@/lib/programs";
import type { RatedActivity } from "@/lib/admissions";

type BuildResponse = {
  schools: RankedUniversity[];
  counts: { safeties: number; matches: number; reaches: number };
  warnings: string[];
  dataNote: string;
  strategy: string | null;
  profileSummary: string | null;
  interpretedPrograms: ProgramKey[];
  interpretedActivities: RatedActivity[];
  aiStatus: {
    configured: boolean;
    requested: boolean;
    profileRead: boolean;
    adviceWritten: boolean;
  };
  catalogSize: number;
};

const REGIONS = ["Northeast", "South", "Midwest", "West"];
const SETTINGS = ["Urban", "Suburban", "College town"];
const SIZES = ["Small", "Medium", "Large"];
const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
  "NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY",
];

const RIGOR_LABELS: Record<string, string> = {
  highest: "Most demanding available (many AP/IB/dual enrolment)",
  high: "Demanding (several AP/IB)",
  moderate: "Some honours or AP",
  low: "Mostly standard courses",
};

const inputClass =
  "rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none focus:border-[var(--teal)]";
const labelClass = "grid gap-1.5 text-sm font-semibold text-[var(--ink)]";

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              active
                ? "border-[var(--teal)] bg-[var(--teal)] text-white"
                : "border-[var(--line)] bg-white text-[var(--ink)]/75 hover:border-[var(--teal)]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function ListBuilderForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BuildResponse | null>(null);

  const [gpa, setGpa] = useState(3.7);
  const [gpaScale, setGpaScale] = useState<"weighted" | "unweighted">("unweighted");
  const [sat, setSat] = useState<string>("1420");
  const [act, setAct] = useState<string>("");
  const [submitTests, setSubmitTests] = useState(true);
  const [courseRigor, setCourseRigor] = useState("high");
  const [classRank, setClassRank] = useState<string>("");
  const [essayStrength, setEssayStrength] = useState(3);
  const [recStrength, setRecStrength] = useState(3);

  const [intendedMajorText, setIntendedMajorText] = useState("computer science");
  const [activitiesText, setActivitiesText] = useState(
    "Robotics team, build lead (3 years)\nFounded a coding club for middle schoolers\nVarsity cross country\nPart-time job at a hardware store"
  );
  const [aboutText, setAboutText] = useState("");

  const [homeState, setHomeState] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [settings, setSettings] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");

  const [firstGeneration, setFirstGeneration] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [demonstratesInterest, setDemonstratesInterest] = useState(false);

  const [safeties, setSafeties] = useState(4);
  const [matches, setMatches] = useState(6);
  const [reaches, setReaches] = useState(5);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const satNum = sat ? Number(sat) : undefined;
    const actNum = act ? Number(act) : undefined;
    if (submitTests && satNum == null && actNum == null) {
      setError("Enter an SAT or ACT score, or switch to test-optional.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/list-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gpa,
          gpaScale,
          sat: satNum,
          act: actNum,
          submitTests,
          courseRigor,
          classRankPercentile: classRank ? Number(classRank) : undefined,
          essayStrength,
          recommendationStrength: recStrength,
          intendedMajorText,
          activitiesText,
          aboutText,
          homeState: homeState || undefined,
          preferredRegions: regions,
          preferredSettings: settings,
          preferredSizes: sizes,
          maxAnnualCostUsd: budget ? Number(budget) : undefined,
          firstGeneration,
          legacy,
          demonstratesInterest,
          shape: { safeties, matches, reaches },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Something went wrong building your list.");
        return;
      }
      setResult(data as BuildResponse);
    } catch {
      setError("Could not reach the list builder. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-8">
        {/* ---------------- Academics ---------------- */}
        <fieldset className="grid gap-4">
          <legend className="font-display text-lg font-bold text-[var(--teal-deep)]">
            1 · Academics
          </legend>

          <div className="grid gap-3 md:grid-cols-3">
            <label className={labelClass}>
              GPA
              <input
                type="number"
                step="0.01"
                min={0}
                max={5}
                required
                className={inputClass}
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
              />
            </label>
            <label className={labelClass}>
              GPA scale
              <select
                className={inputClass}
                value={gpaScale}
                onChange={(e) =>
                  setGpaScale(e.target.value as "weighted" | "unweighted")
                }
              >
                <option value="unweighted">Unweighted (4.0 max)</option>
                <option value="weighted">Weighted (above 4.0 possible)</option>
              </select>
            </label>
            <label className={labelClass}>
              Class rank (top %) — optional
              <input
                type="number"
                min={1}
                max={100}
                placeholder="e.g. 10"
                className={inputClass}
                value={classRank}
                onChange={(e) => setClassRank(e.target.value)}
              />
            </label>

            <label className={labelClass}>
              SAT
              <input
                type="number"
                min={400}
                max={1600}
                className={inputClass}
                value={sat}
                onChange={(e) => setSat(e.target.value)}
              />
            </label>
            <label className={labelClass}>
              ACT
              <input
                type="number"
                min={1}
                max={36}
                className={inputClass}
                value={act}
                onChange={(e) => setAct(e.target.value)}
              />
            </label>
            <label className={labelClass}>
              Course rigor
              <select
                className={inputClass}
                value={courseRigor}
                onChange={(e) => setCourseRigor(e.target.value)}
              >
                {Object.entries(RIGOR_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={!submitTests}
              onChange={(e) => setSubmitTests(!e.target.checked)}
            />
            Apply test-optional (don&rsquo;t score me on tests)
          </label>
        </fieldset>

        {/* ---------------- Program & activities ---------------- */}
        <fieldset className="grid gap-4">
          <legend className="font-display text-lg font-bold text-[var(--teal-deep)]">
            2 · What you want to study, and what you do
          </legend>

          <label className={labelClass}>
            Intended major or field
            <input
              className={inputClass}
              placeholder="e.g. biomedical engineering, or pre-med and maybe neuroscience"
              value={intendedMajorText}
              onChange={(e) => setIntendedMajorText(e.target.value)}
            />
            <span className="text-xs font-normal text-[var(--ink)]/55">
              Plain English is fine — this is read and mapped to programs.
            </span>
          </label>

          <label className={labelClass}>
            Extracurricular activities
            <textarea
              rows={5}
              className={inputClass}
              placeholder={"One per line. Include roles, awards and how long you've done it."}
              value={activitiesText}
              onChange={(e) => setActivitiesText(e.target.value)}
            />
            <span className="text-xs font-normal text-[var(--ink)]/55">
              Detail matters: &ldquo;captain, 3 years&rdquo; scores differently from &ldquo;member&rdquo;.
            </span>
          </label>

          <label className={labelClass}>
            Anything else worth knowing — optional
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Work, family responsibilities, a project you care about, what you want out of college."
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className={labelClass}>
              Essay strength: {essayStrength}/5
              <input
                type="range"
                min={1}
                max={5}
                value={essayStrength}
                onChange={(e) => setEssayStrength(Number(e.target.value))}
              />
            </label>
            <label className={labelClass}>
              Recommendation strength: {recStrength}/5
              <input
                type="range"
                min={1}
                max={5}
                value={recStrength}
                onChange={(e) => setRecStrength(Number(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        {/* ---------------- Preferences ---------------- */}
        <fieldset className="grid gap-4">
          <legend className="font-display text-lg font-bold text-[var(--teal-deep)]">
            3 · Where and how you want to study
          </legend>

          <div className="grid gap-3 md:grid-cols-2">
            <label className={labelClass}>
              Home state (drives in-state odds and tuition)
              <select
                className={inputClass}
                value={homeState}
                onChange={(e) => setHomeState(e.target.value)}
              >
                <option value="">Not saying</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Max annual cost (USD) — optional
              <input
                type="number"
                min={0}
                step={1000}
                placeholder="e.g. 45000"
                className={inputClass}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>
          </div>

          <div className={labelClass}>
            Regions
            <Chips
              options={REGIONS}
              selected={regions}
              onToggle={(v) => toggle(regions, setRegions, v)}
            />
          </div>
          <div className={labelClass}>
            Campus setting
            <Chips
              options={SETTINGS}
              selected={settings}
              onToggle={(v) => toggle(settings, setSettings, v)}
            />
          </div>
          <div className={labelClass}>
            Size
            <Chips
              options={SIZES}
              selected={sizes}
              onToggle={(v) => toggle(sizes, setSizes, v)}
            />
          </div>

          <div className="flex flex-wrap gap-4 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3">
            {(
              [
                [firstGeneration, setFirstGeneration, "First-generation student"],
                [legacy, setLegacy, "Parent attended one of my schools"],
                [
                  demonstratesInterest,
                  setDemonstratesInterest,
                  "I'll visit / interview / write real supplements",
                ],
              ] as const
            ).map(([value, setter, label]) => (
              <label key={label} className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setter(e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* ---------------- Shape ---------------- */}
        <fieldset className="grid gap-3">
          <legend className="font-display text-lg font-bold text-[var(--teal-deep)]">
            4 · List shape
          </legend>
          <div className="grid gap-3 md:grid-cols-3">
            {(
              [
                ["Safeties", safeties, setSafeties],
                ["Matches", matches, setMatches],
                ["Reaches", reaches, setReaches],
              ] as const
            ).map(([label, value, setter]) => (
              <label key={label} className={labelClass}>
                {label}
                <input
                  type="number"
                  min={0}
                  max={10}
                  className={inputClass}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-full bg-[var(--citrus)] px-6 py-3 text-lg font-bold text-[var(--ink)] disabled:opacity-60"
          >
            {loading ? "Building your list…" : "Build my list"}
          </button>
          {loading && (
            <span className="text-sm text-[var(--ink)]/60">
              Scoring 109 schools and writing your notes…
            </span>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {error}
          </p>
        )}
      </form>

      {result && <Results result={result} />}
    </div>
  );
}

function Results({ result }: { result: BuildResponse }) {
  const { counts, aiStatus } = result;

  return (
    <div className="mt-12 grid gap-5">
      <div className="flex flex-wrap items-baseline gap-4 border-t border-[var(--line)] pt-6">
        <h2 className="font-display text-2xl font-extrabold text-[var(--teal-deep)]">
          Your list
        </h2>
        <span className="font-bold text-emerald-800">{counts.safeties} safeties</span>
        <span className="font-bold text-sky-900">{counts.matches} matches</span>
        <span className="font-bold text-rose-800">{counts.reaches} reaches</span>
      </div>

      {result.profileSummary && (
        <p className="text-[var(--ink)]/80">{result.profileSummary}</p>
      )}

      {result.strategy && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--fog)] p-5">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-[var(--teal)]">
            Strategy
          </h3>
          <p className="mt-2 text-[var(--ink)]/85">{result.strategy}</p>
        </div>
      )}

      {result.warnings.map((warning) => (
        <p
          key={warning}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
        >
          {warning}
        </p>
      ))}

      {result.interpretedPrograms.length > 0 && (
        <p className="text-sm text-[var(--ink)]/60">
          Matched to programs:{" "}
          <span className="font-semibold text-[var(--teal)]">
            {result.interpretedPrograms.join(", ")}
          </span>
        </p>
      )}

      {result.schools.length === 0 && (
        <p className="text-[var(--ink)]/70">
          No schools matched those filters. Widen the region, raise the budget, or
          increase the list size.
        </p>
      )}

      {result.schools.map((school) => (
        <SchoolCard key={school.university.id} school={school} />
      ))}

      <div className="mt-2 grid gap-2 border-t border-[var(--line)] pt-4 text-xs text-[var(--ink)]/55">
        <p>{result.dataNote}</p>
        <p>
          Odds are modelled from Common Data Set statistics across{" "}
          {result.catalogSize} universities. They are estimates to plan with, not
          predictions — no model sees your essays or your reader.
        </p>
        <p>
          {aiStatus.adviceWritten
            ? "Notes written by Claude; every category and probability was computed from the data, not generated."
            : aiStatus.configured
              ? "Written notes were unavailable for this request, so the list shows the computed reasoning only."
              : "Running without an ANTHROPIC_API_KEY, so the list shows computed reasoning without written notes."}
        </p>
      </div>
    </div>
  );
}

function SchoolCard({ school }: { school: RankedUniversity }) {
  const { university: u, admission } = school;
  const badge =
    school.category === "Safety"
      ? "bg-emerald-100 text-emerald-900"
      : school.category === "Match"
        ? "bg-sky-100 text-sky-900"
        : "bg-rose-100 text-rose-900";

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 md:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide ${badge}`}
          >
            {school.category}
            {school.farReach ? " · far" : ""}
          </span>
          {u.usNewsRank != null && (
            <span className="text-xs font-semibold text-[var(--ink)]/50">
              #{u.usNewsRank} national
            </span>
          )}
          {admission.academic.confidence !== "reported" && (
            <span
              className="text-xs font-semibold text-amber-700"
              title="This school reports limited Common Data Set figures, so its odds are modelled from its acceptance rate."
            >
              limited CDS data
            </span>
          )}
        </div>

        <h3 className="font-display mt-2 text-xl font-bold text-[var(--ink)]">
          {u.name}
        </h3>
        <p className="text-sm text-[var(--ink)]/70">
          {u.city}, {u.state} · {u.setting} · {u.sizeBand}
          {school.estimatedAnnualCostUsd != null &&
            ` · ~$${school.estimatedAnnualCostUsd.toLocaleString()}/yr`}
        </p>

        {school.advisorNote && (
          <p className="mt-3 border-l-2 border-[var(--citrus)] pl-3 text-[var(--ink)]/85">
            {school.advisorNote}
          </p>
        )}

        <ul className="mt-3 grid gap-1 text-sm text-[var(--ink)]/65">
          {school.reasons.map((reason) => (
            <li key={reason}>· {reason}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-row items-end gap-6 md:flex-col md:items-end md:gap-4">
        <div className="md:text-right">
          <p className="font-display text-3xl font-extrabold text-[var(--teal)]">
            {Math.round(school.probability * 100)}%
          </p>
          <p className="text-xs text-[var(--ink)]/55">estimated chance</p>
        </div>
        <div className="md:text-right">
          <p className="font-display text-2xl font-bold text-[var(--ink)]">
            {school.fitScore}
          </p>
          <p className="text-xs text-[var(--ink)]/55">fit / 100</p>
        </div>
        <div className="flex gap-3 md:flex-col md:items-end md:gap-1">
          <a
            href={u.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--teal)] underline"
          >
            Website
          </a>
          <a
            href={u.cdsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--teal)] underline"
          >
            Data
          </a>
        </div>
      </div>
    </article>
  );
}
