"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  buildUniversityList,
  type ListBuilderInput,
  type RankedUniversity,
} from "@/lib/listBuilder";
import type { University } from "@/lib/universities";

export function ListBuilderForm({ universities }: { universities: University[] }) {
  const [results, setResults] = useState<RankedUniversity[] | null>(null);
  const [form, setForm] = useState<ListBuilderInput>({
    extracurriculars: "research, clubs, service",
    gpa: 3.7,
    sat: 1420,
    personality: "balanced",
    locationInterest: "Any",
    universityInterests: "engineering, research",
    includeSafeties: true,
    includeMatches: true,
    includeReaches: true,
  });

  const counts = useMemo(() => {
    if (!results) return null;
    return {
      safety: results.filter((r) => r.category === "Safety").length,
      match: results.filter((r) => r.category === "Match").length,
      reach: results.filter((r) => r.category === "Reach").length,
    };
  }, [results]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.sat == null && form.act == null) {
      alert("Enter an SAT or ACT score (or both).");
      return;
    }
    setResults(buildUniversityList(form, universities));
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-semibold">
            GPA (0–4.0)
            <input
              type="number"
              step="0.01"
              min={0}
              max={4}
              required
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.gpa}
              onChange={(e) => setForm({ ...form, gpa: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            SAT
            <input
              type="number"
              min={400}
              max={1600}
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.sat ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  sat: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            ACT
            <input
              type="number"
              min={1}
              max={36}
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.act ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  act: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Type of person
            <select
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.personality}
              onChange={(e) => setForm({ ...form, personality: e.target.value })}
            >
              {[
                "ambitious",
                "analytical",
                "creative",
                "outgoing",
                "balanced",
                "innovator",
                "leader",
                "adventurous",
                "collaborative",
                "practical",
              ].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Locational interests
            <select
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.locationInterest}
              onChange={(e) => setForm({ ...form, locationInterest: e.target.value })}
            >
              {["Any", "West", "Northeast", "Midwest", "South", "Urban", "Suburban", "College town"].map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                )
              )}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Min acceptance rate %
            <input
              type="number"
              min={0}
              max={100}
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.minAcceptanceRate ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  minAcceptanceRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Max acceptance rate %
            <input
              type="number"
              min={0}
              max={100}
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={form.maxAcceptanceRate ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxAcceptanceRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </label>
        </div>

        <label className="grid gap-1 text-sm font-semibold">
          University interests
          <input
            required
            className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
            value={form.universityInterests}
            onChange={(e) => setForm({ ...form, universityInterests: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Extracurricular activities
          <textarea
            required
            rows={3}
            className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
            value={form.extracurriculars}
            onChange={(e) => setForm({ ...form, extracurriculars: e.target.value })}
          />
        </label>

        <fieldset className="flex flex-wrap gap-4 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <legend className="px-1 text-sm font-bold">Include categories</legend>
          {(
            [
              ["includeSafeties", "Safeties"],
              ["includeMatches", "Matches"],
              ["includeReaches", "Reaches"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          className="w-fit rounded-full bg-[var(--citrus)] px-6 py-3 text-lg font-bold text-[var(--ink)]"
        >
          Build my list
        </button>
      </form>

      {results && counts && (
        <div className="mt-10 grid gap-3">
          <div className="flex flex-wrap gap-4 font-bold text-[var(--teal-deep)]">
            <span>{counts.safety} safeties</span>
            <span>{counts.match} matches</span>
            <span>{counts.reach} reaches</span>
          </div>
          {results.length === 0 && (
            <p className="text-[var(--ink)]/70">No schools matched. Widen filters and try again.</p>
          )}
          {results.map((r) => (
            <article
              key={r.university.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 md:flex-row"
            >
              <div>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-extrabold uppercase tracking-wide ${
                    r.category === "Safety"
                      ? "bg-emerald-100 text-emerald-800"
                      : r.category === "Match"
                        ? "bg-sky-100 text-sky-900"
                        : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {r.category}
                </span>
                <h2 className="font-display mt-2 text-xl font-bold">{r.university.name}</h2>
                <p className="text-sm text-[var(--ink)]/75">
                  {r.university.city}, {r.university.state} ·{" "}
                  {(r.university.acceptanceRate * 100).toFixed(1)}% accept
                </p>
                <p className="mt-1 text-sm text-[var(--ink)]/65">{r.rationale}</p>
              </div>
              <div className="md:text-right">
                <p className="font-display text-3xl font-extrabold text-[var(--teal)]">
                  {r.fitScore}
                </p>
                <p className="text-sm text-[var(--ink)]/60">fit score</p>
                <a
                  href={r.university.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[var(--teal)]"
                >
                  Website
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
