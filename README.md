# MyUniAssist

University application help site — same architecture pattern as nobscomputers:

| Piece | Role |
|---|---|
| **Next.js** | Website + tools |
| **Tailwind CSS** | Styling |
| **Supabase** | Login (email + Google), user data |
| **Vercel** | Hosting when you go live |

## Features

- Sign up / sign in (email) + **Continue with Google**
- Common Data Set browser
- VR campus tour links
- AI list builder (safeties / matches / reaches)

## Local setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local with your Supabase URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API → copy **Project URL** and **anon public** key into `.env.local`.
3. Authentication → Providers → enable **Google** (add Google OAuth client ID/secret).
4. Authentication → URL configuration → add:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_VERCEL_DOMAIN/auth/callback`
5. Optional: run `supabase/schema.sql` in the SQL editor.

Campus tool data ships in `src/lib/universities.ts` so the tools work even before you seed Supabase tables.

### Google Cloud OAuth

Authorized redirect URI for Supabase Google provider:

`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

## Edit in Cursor

| Change | Where |
|---|---|
| Pages | `src/app/**` |
| UI components | `src/components/**` |
| University data / matching | `src/lib/universities.ts`, `src/lib/listBuilder.ts` |
| Auth helpers | `src/lib/supabase/**` |

## Legacy Java version

The previous Spring Boot build is archived under `legacy-java/` (not used by this app).
