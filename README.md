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
- AI list builder (safeties / matches / reaches)

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
2. Add env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
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
| Local campus seed | `src/lib/universities.ts` |
| List matching | `src/lib/listBuilder.ts` |
| Load from Supabase | `src/lib/getUniversities.ts` |
| Auth | `src/lib/supabase/**`, `src/components/AuthPanel.tsx` |
| Vultr script | `deploy/vultr-setup.sh` |
