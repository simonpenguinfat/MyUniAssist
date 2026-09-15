# UniAssist

University application help — Next.js + Tailwind + Supabase (+ optional Vultr).

Repo: https://github.com/simonpenguinfat/MyUniAssist

| Piece | Role |
|---|---|
| **Next.js** | Website + tools |
| **Tailwind CSS** | Styling |
| **Supabase** | Login (email + Google), optional universities DB |
| **Vercel or Vultr** | Hosting |

## Features

- Email sign up / sign in + Google OAuth
- Common Data Set browser
- VR campus tour links (`vrTourUrl`)
- AI list builder (safeties / matches / reaches) — see below

## How the list builder works

The builder splits into two halves on purpose: **the numbers are computed, the
words are generated.** A language model never decides whether a school is a
safety, so results are reproducible and auditable.

**1. The model (`src/lib/admissions.ts`)** scores the student against each
school's own Common Data Set figures:

- Test scores are placed on the school's 25th/75th percentile band (the gap
  between them spans 1.349σ, which is how a spread is recovered from two
  percentiles).
- GPA is put on the same scale as the school reports — anything above 4.05 is
  necessarily weighted — before comparing.
- **Each school's CDS section C7 weights are applied**, so a school that calls
  extracurriculars "Very Important" lets a strong activity profile move the
  odds, and one that admits on numbers does not.
- Non-academic factors are scaled by selectivity: a 4% school reads essays and
  character closely, an 85% school is mostly checking the transcript.
- In-state residency, first-generation status, legacy and demonstrated interest
  apply only where the school reports weighing them.
- Safety / Match / Reach comes from the resulting probability, with a hard rule
  that no school admitting under 20% is ever labelled a safety.

**2. Program and activity fit (`src/lib/programs.ts`)** maps the student's own
wording ("pre-med, maybe neuroscience") to 38 program areas, and scores each
school as a standout, strong or general department for them.

**3. The AI layer (`src/lib/ai/advisor.ts`)**, when `ANTHROPIC_API_KEY` is set,
reads the free-text activity list into rated entries the way an admissions
reader would, and writes the per-school notes and strategy paragraph. Without a
key the tool still works end to end — a keyword parser fills in, and the UI says
so.

### Data honesty

The bundled workbook is sparse: of 109 schools it reports an acceptance rate for
76, test percentiles for 65, an average GPA for 12, and C7 admission factors for
17. Where a school reports nothing, the model infers its academic profile from
its acceptance rate and **labels that school "limited CDS data"** in the UI.
Missing values are `null`, never `0` — the workbook writes `0` into the factor
columns for schools it never retrieved, and reading those as "not considered"
made the model conclude schools ignore grades.

```bash
npm run check       # calibration checks for the admissions model
npm run import-cds  # regenerate src/lib/universities.ts from data/*.csv
```

## Edit school / VR tour data

**Option A (quick):** edit `src/lib/universities.ts` — change `vrTourUrl`, CDS links, stats, etc.

**Option B (Supabase DB):**
1. Run `supabase/schema.sql` in the Supabase SQL editor
2. Insert/update rows in the `universities` table (including `vr_tour_url`)
3. The app prefers Supabase data when the table has rows; otherwise it uses the local file

## Local setup

```bash
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
# optional: set ANTHROPIC_API_KEY to turn on the written coaching notes
npm run dev
```

Open http://localhost:3000

### Supabase Auth (Google)

1. Authentication → Providers → Google → enable + paste Google Client ID/Secret  
2. Google Cloud redirect URI: `https://YOUR_REF.supabase.co/auth/v1/callback`  
3. Supabase URL config redirect: `http://localhost:3000/auth/callback` (and production URL later)

## Deploy

### Vercel (easiest)

1. Import the GitHub repo in Vercel  
2. Add env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and optionally `ANTHROPIC_API_KEY`  
3. Deploy  

### Vultr VM

1. Point domain DNS **A @** and **A www** to the Vultr IP (Web Hosting Canada DNS Zone Editor)  
2. SSH in, clone the repo, create `.env.local`  
3. Run `bash deploy/vultr-setup.sh`  
4. Optional: `certbot --nginx -d yourdomain.com`  

Open firewall **TCP 22** (SSH), **80**, **443**.

## Project map

| Change | Where |
|---|---|
| Pages | `src/app/**` |
| UI | `src/components/**` |
| Local campus seed | `src/lib/universities.ts` (generated — edit `scripts/import-cds.mjs`) |
| Admissions model | `src/lib/admissions.ts` |
| Program taxonomy + per-school strength | `src/lib/programs.ts` |
| List assembly + warnings | `src/lib/listBuilder.ts` |
| AI reading / coaching notes | `src/lib/ai/advisor.ts` |
| List builder API | `src/app/api/list-builder/route.ts` |
| Model calibration checks | `scripts/check-admissions.ts` |
| Load from Supabase | `src/lib/getUniversities.ts` |
| Auth | `src/lib/supabase/**`, `src/components/AuthPanel.tsx` |
| Vultr script | `deploy/vultr-setup.sh` |
