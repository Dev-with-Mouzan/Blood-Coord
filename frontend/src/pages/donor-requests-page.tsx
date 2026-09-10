import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import { BloodRequestsTable } from "@/components/ui/blood-requests-table";
import type { DonorProfile } from "@/types";

export default function DonorRequestsPage() {
  const { user } = useAuth();
  const donor = user && "blood_group" in user ? (user as DonorProfile) : null;

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <DonorNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {donor && (
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  Blood Requests
                </h1>
                <p className="mt-2 text-ink-500">
                  View and respond to blood requests matching your blood type.
                </p>
              </div>

              <BloodRequestsTable bloodGroup={donor.blood_group} />
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}