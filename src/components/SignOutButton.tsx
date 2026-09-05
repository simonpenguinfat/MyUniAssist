"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton({ ghost = false }: { ghost?: boolean }) {
  const router = useRouter();

  async function signOut() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className={
        ghost
          ? "rounded-full border border-white/70 px-4 py-2"
          : "rounded-full border border-[var(--ink)]/20 px-4 py-2"
      }
    >
      Sign out
    </button>
  );
}
