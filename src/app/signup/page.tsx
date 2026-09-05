import { SiteHeader } from "@/components/SiteHeader";
import { AuthPanel } from "@/components/AuthPanel";

export default function SignUpPage() {
  return (
    <>
      <SiteHeader />
      <AuthPanel mode="signup" />
    </>
  );
}
