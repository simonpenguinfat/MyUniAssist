import { UNIVERSITIES } from "@/lib/universities";

const SHORT: Record<string, string> = {
  "Stanford University": "Stanford",
  "Massachusetts Institute of Technology": "MIT",
  "Harvard University": "Harvard",
  "Yale University": "Yale",
  "Princeton University": "Princeton",
  "University of California, Berkeley": "Berkeley",
  "University of California, Los Angeles": "UCLA",
  "University of Michigan, Ann Arbor": "Michigan",
  "University of Virginia": "UVa",
  "University of North Carolina at Chapel Hill": "UNC",
  "Georgia Institute of Technology": "Georgia Tech",
  "University of Texas at Austin": "UT Austin",
  "University of Washington": "UW",
  "University of Wisconsin-Madison": "Wisconsin",
  "Ohio State University": "Ohio State",
  "Pennsylvania State University": "Penn State",
  "Purdue University": "Purdue",
  "University of Florida": "Florida",
  "University of Illinois Urbana-Champaign": "UIUC",
  "New York University": "NYU",
  "University of Southern California": "USC",
  "Carnegie Mellon University": "CMU",
  "Duke University": "Duke",
  "Northwestern University": "Northwestern",
};

const NAMES = UNIVERSITIES.filter((u) => SHORT[u.name])
  .slice(0, 24)
  .map((u) => SHORT[u.name] || u.name);

export function UniMarquee() {
  const row = [...NAMES, ...NAMES];
  return (
    <div className="border-y border-black/5 bg-white py-8">
      <p className="mx-auto mb-5 max-w-3xl px-5 text-center text-sm text-[var(--ink)]/55">
        Research campuses students explore with MyUniAssist — from reaches to strong safeties.
      </p>
      <div className="uni-marquee relative overflow-hidden">
        <div className="uni-marquee-track flex w-max gap-10 px-5">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display whitespace-nowrap text-lg font-bold tracking-tight text-[var(--ink)]/35"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
