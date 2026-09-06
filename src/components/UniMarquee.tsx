const NAMES = [
  "Stanford",
  "MIT",
  "Harvard",
  "Yale",
  "Princeton",
  "Berkeley",
  "UCLA",
  "Michigan",
  "UVa",
  "UNC",
  "Georgia Tech",
  "UT Austin",
  "UW",
  "Wisconsin",
  "Ohio State",
  "Penn State",
  "Purdue",
  "Florida",
  "UIUC",
  "NYU",
  "USC",
  "CMU",
  "Duke",
  "Northwestern",
];

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
