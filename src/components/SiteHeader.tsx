import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SignOutButton } from "@/components/SignOutButton";

export async function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <header
      className={
        transparent
          ? "absolute z-20 flex w-full items-center justify-between gap-4 px-[6vw] py-4 text-white"
          : "sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[rgba(245,248,249,0.88)] px-[6vw] py-4 backdrop-blur"
      }
    >
      <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
        MyUniAssist
      </Link>
      <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
        <Link href="/about" className="opacity-90 hover:opacity-100">
          About
        </Link>
        {email ? (
          <>
            <Link href="/dashboard" className="opacity-90 hover:opacity-100">
              Tools
            </Link>
            <span className="hidden opacity-70 sm:inline">{email}</span>
            <SignOutButton ghost={transparent} />
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className={
                transparent
                  ? "rounded-full border border-white/70 px-4 py-2"
                  : "rounded-full border border-[var(--ink)]/20 px-4 py-2"
              }
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--citrus)] px-4 py-2 font-bold text-[var(--ink)]"
            >
              Create account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
