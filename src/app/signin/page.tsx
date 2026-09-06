import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { AuthPanel } from "@/components/AuthPanel";

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<p className="p-8 text-center">Loading…</p>}>
        <AuthPanel mode="signin" />
      </Suspense>
    </>
  );
}
