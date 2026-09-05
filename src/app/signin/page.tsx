import { SiteHeader } from "@/components/SiteHeader";
import { AuthPanel } from "@/components/AuthPanel";

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <AuthPanel mode="signin" />
    </>
  );
}
