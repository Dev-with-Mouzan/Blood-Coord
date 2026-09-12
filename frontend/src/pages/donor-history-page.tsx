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
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="text-center">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl md:text-4xl">
                  Donation History
                </h1>
                <p className="mt-1 text-sm text-ink-500 sm:mt-2 sm:text-base">
                  Track your past donations and their impact.
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-3 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 sm:text-xs">
                    Total Donations
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink-950 sm:text-2xl">3</p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-3 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 sm:text-xs">
                    Lives Impacted
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink-950 sm:text-2xl">3</p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-3 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 sm:text-xs">
                    Total Units
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink-950 sm:text-2xl">4</p>
                </div>
              </div>

              {/* History — Desktop Table */}
              <div className="hidden rounded-3xl border border-ink-900/10 bg-bone-50 sm:block">
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

              {/* History — Mobile Cards */}
              <div className="flex flex-col gap-3 sm:hidden">
                {MOCK_HISTORY.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-ink-900/10 bg-bone-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{item.hospital}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{item.recipient}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-ink-500">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span className="h-1 w-1 rounded-full bg-ink-300" />
                      <span>{item.units} unit{item.units > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}