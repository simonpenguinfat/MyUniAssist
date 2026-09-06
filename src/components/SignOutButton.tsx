"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton({
  ghost = false,
  variant = "default",
}: {
  ghost?: boolean;
  variant?: "default" | "sidebar";
}) {
  const router = useRouter();

  async function signOut() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const className =
    variant === "sidebar"
      ? "w-full rounded-md border border-white/15 bg-[#13263d] px-3 py-2 text-left text-sm font-semibold text-[#d7e0ea] transition hover:bg-[#1a3352] hover:text-white"
      : ghost
        ? "rounded-full border border-white/70 px-4 py-2"
        : "rounded-full border border-[var(--ink)]/20 px-4 py-2";

  return (
    <button type="button" onClick={signOut} className={className}>
      Sign out
    </button>
  );
}
