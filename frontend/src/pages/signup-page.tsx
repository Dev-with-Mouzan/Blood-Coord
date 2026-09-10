import { useSearchParams } from "react-router-dom";
import { DonorSignupForm } from "@/components/forms/donor-signup-form";
import { RequesterSignupForm } from "@/components/forms/requester-signup-form";
import { AuthShell } from "@/components/ui/auth-shell";
import { SignupTabs } from "@/components/ui/signup-tabs";

type Role = "donor" | "requester";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const role: Role = searchParams.get("role") === "requester" ? "requester" : "donor";

  return (
    <AuthShell
      eyebrow={role === "donor" ? "For donors" : "For requesters"}
      title={role === "donor" ? "Become a donor" : "Request blood"}
      subtitle={
        role === "donor"
          ? "List your blood group, weight, and location. When an urgent request comes in near you, you'll be in the loop."
          : "Hospitals, blood banks, and families register here to get matched with eligible donors nearby."
      }
    >
      <SignupTabs active={role} />
      {role === "donor" ? <DonorSignupForm /> : <RequesterSignupForm />}
    </AuthShell>
  );
}