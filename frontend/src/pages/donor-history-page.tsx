import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import type { DonorProfile } from "@/types";

const MOCK_HISTORY = [
  {
    id: "don-001",
    date: "2025-11-15",
    hospital: "City General Hospital",
    units: 1,
    recipient: "Emergency surgery patient",
    status: "Completed",
  },
  {
    id: "don-002",
    date: "2025-08-20",
    hospital: "St. Mary Medical Center",
    units: 1,
    recipient: "Cancer treatment patient",
    status: "Completed",
  },
  {
    id: "don-003",
    date: "2025-05-10",
    hospital: "Downtown Clinic",
    units: 2,
    recipient: "Accident victim",
    status: "Completed",
  },
];

export default function DonorHistoryPage() {
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
                  Donation History
                </h1>
                <p className="mt-2 text-ink-500">
                  Track your past donations and their impact.
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Total Donations
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink-950">3</p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Lives Impacted
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink-950">3</p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Total Units
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink-950">4</p>
                </div>
              </div>

              {/* History Table */}
              <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-xs font-semibold uppercase tracking-wider text-ink-400">
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Hospital</th>
                        <th className="px-6 py-3">Units</th>
                        <th className="px-6 py-3">Recipient</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/5">
                      {MOCK_HISTORY.map((item) => (
                        <tr key={item.id} className="hover:bg-ink-900/5">
                          <td className="px-6 py-4 text-ink-700">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-ink-900">
                            {item.hospital}
                          </td>
                          <td className="px-6 py-4 text-ink-700">{item.units}</td>
                          <td className="px-6 py-4 text-ink-700">{item.recipient}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}