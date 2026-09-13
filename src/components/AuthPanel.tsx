"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthPanel({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error") === "oauth";
  const nextPath = safeNext(searchParams.get("next"));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();
async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!configured) {
      setError("Add Supabase keys to .env.local first (see README).");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        setMessage(
          "Account created. Check your email if confirmation is required, then sign in."
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(nextPath);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError(null);
    if (!configured) {
      setError("Add Supabase keys to .env.local first (see README).");
      return;
    }
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <section className="mx-auto mt-16 w-[min(420px,calc(100%-2rem))] animate-rise rounded-3xl border border-[var(--line)] bg-white/85 p-7 shadow-[0_18px_50px_rgba(6,47,56,0.18)]">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        {mode === "signin" ? "Sign in" : "Create your account"}
      </h1>

      {!configured && (
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          Supabase is not configured yet. Copy <code>.env.local.example</code> to{" "}
          <code>.env.local</code> and add your project URL + anon key.
        </p>
      )}

      <button
        type="button"
        onClick={signInWithGoogle}
        className="mt-5 w-full rounded-full border border-[var(--line)] bg-white px-4 py-3 font-bold hover:bg-[var(--paper)]"
      >
        Continue with Google
      </button>

      <div className="my-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm font-semibold text-[var(--ink)]/55">
        <span className="h-px bg-[var(--line)]" />
        <span>or email</span>
        <span className="h-px bg-[var(--line)]" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        {mode === "signup" && (
          <label className="grid gap-1 text-sm font-semibold">
            Full name
            <input
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
        )}
        <label className="grid gap-1 text-sm font-semibold">
          Email
          <input
            type="email"
            className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Password
          <input
            type="password"
            minLength={8}
            className="rounded-xl border border-[var(--line)] bg-white px-3 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-red-700">{oauthError ? "Google sign-in failed. Try again or use email." : error}</p>}
        {message && <p className="text-sm text-teal-800">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--citrus)] px-4 py-3 font-bold text-[var(--ink)] disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[var(--ink)]/70">
        {mode === "signin" ? (
          <>
            New here? <Link href="/signup">Create an account</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/signin">Sign in</Link>
          </>
        )}
      </p>
    </section>
  );
}

function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  return raw;
}
