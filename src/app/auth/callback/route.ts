import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(absoluteUrl(request, next));
      }
      console.error("OAuth exchange error:", error.message);
    } catch (err) {
      console.error("OAuth callback failed:", err);
    }
  }

  return NextResponse.redirect(absoluteUrl(request, "/signin?error=oauth"));
}

function absoluteUrl(request: Request, path: string) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  // Behind nginx, request.url is often http://127.0.0.1:3000 — use public host instead.
  if (forwardedHost) {
    const proto = forwardedProto ?? "https";
    return `${proto}://${forwardedHost}${path}`;
  }

  return `${url.origin}${path}`;
}

function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  return raw;
}
