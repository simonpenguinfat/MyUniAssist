import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AppSidebar } from "@/components/AppSidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  let email: string | null = null;
  let name = "Student";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
      name =
        (data.user?.user_metadata?.full_name as string | undefined) ||
        email?.split("@")[0] ||
        "Student";
    } catch {
      email = null;
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AppSidebar email={email} name={name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-black/5 bg-white/90 px-6 backdrop-blur">
          <p className="text-sm font-semibold text-[var(--ink)]/70">Workspace</p>
          <p className="truncate text-sm text-[var(--ink)]/55">{email ?? "Signed in"}</p>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
