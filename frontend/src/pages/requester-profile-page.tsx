import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { RequesterNavbar } from "@/components/ui/requester-navbar";
import type { RequesterProfile } from "@/types";

export default function RequesterProfilePage() {
  const { user } = useAuth();
  const requester = user && "address" in user && !("blood_group" in user) ? (user as RequesterProfile) : null;

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <RequesterNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {requester && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  My Profile
                </h1>
                <p className="mt-2 text-ink-500">
                  View and update your information.
                </p>
              </div>

              <div className="mx-auto w-full max-w-2xl">
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blood-100 font-display text-4xl font-bold text-blood-600">
                      {requester.name.charAt(0)}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">
                      {requester.name}
                    </h3>

                    <div className="mt-6 flex w-full flex-col gap-3 border-t border-ink-900/10 pt-5">
                      <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                        <span className="text-sm font-medium text-ink-600">Name</span>
                        <span className="text-sm font-semibold text-ink-900">
                          {requester.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                        <span className="text-sm font-medium text-ink-600">Address</span>
                        <span className="text-sm font-semibold text-ink-900">
                          {requester.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}
