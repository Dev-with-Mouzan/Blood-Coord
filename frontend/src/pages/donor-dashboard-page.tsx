import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import type { DonorProfile } from "@/types";
import { Link } from "react-router-dom";

const MOCK_ACTIVITY = [
  {
    id: "act-001",
    type: "request",
    title: "New blood request nearby",
    description: "City General Hospital needs 2 units of O+ blood",
    time: "2 hours ago",
    action: "View",
    href: "/dashboard/donor/requests",
  },
  {
    id: "act-002",
    type: "donation",
    title: "Donation confirmed",
    description: "Your donation at St. Mary Medical Center is confirmed for Oct 15",
    time: "1 day ago",
    action: "View",
    href: "/dashboard/donor/history",
  },
  {
    id: "act-003",
    type: "profile",
    title: "Profile updated",
    description: "Your availability status was changed to Available",
    time: "3 days ago",
    action: "View",
    href: "/dashboard/donor/profile",
  },
];

const MOCK_HISTORY = [
  {
    id: "don-001",
    date: "2025-11-15",
    hospital: "City General Hospital",
    units: 1,
    status: "Completed",
  },
  {
    id: "don-002",
    date: "2025-08-20",
    hospital: "St. Mary Medical Center",
    units: 1,
    status: "Completed",
  },
  {
    id: "don-003",
    date: "2025-05-10",
    hospital: "Downtown Clinic",
    units: 2,
    status: "Completed",
  },
];

const activityColors: Record<string, string> = {
  request: "bg-blue-100 text-blue-600",
  donation: "bg-emerald-100 text-emerald-600",
  profile: "bg-amber-100 text-amber-600",
};

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const donor = user && "blood_group" in user ? (user as DonorProfile) : null;

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <DonorNavbar />

        <main className="container-shell py-8 md:py-12">
          {donor && (
            <div className="flex flex-col gap-8">
              {/* Welcome Banner */}
              <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                      Hello, {donor.name.split(" ")[0]}
                    </h1>
                    <p className="mt-2 text-ink-500">
                      Welcome back to your donor dashboard.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-blood-200 bg-blood-50 px-4 py-2 text-sm font-semibold text-blood-700">
                      {donor.blood_group}
                    </span>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      donor.eligible_status
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-ink-100 text-ink-500"
                    }`}>
                      {donor.eligible_status ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Blood Group
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink-950">
                    {donor.blood_group}
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Eligible
                  </p>
                  <p className={`mt-1 font-display text-2xl font-semibold ${
                    donor.eligible_status ? "text-emerald-600" : "text-ink-400"
                  }`}>
                    {donor.eligible_status ? "Yes" : "No"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Available
                  </p>
                  <p className={`mt-1 font-display text-2xl font-semibold ${
                    donor.available_to_donate ? "text-blue-600" : "text-ink-400"
                  }`}>
                    {donor.available_to_donate ? "Yes" : "No"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Last Donation
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink-950">
                    {donor.last_donation_date || "Never"}
                  </p>
                </div>
              </div>

              {/* Activity Feed & History Grid */}
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                {/* Activity Feed */}
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
                  <div className="border-b border-ink-900/10 px-6 py-4">
                    <h2 className="font-display text-lg font-semibold text-ink-950">
                      Recent Activity
                    </h2>
                  </div>
                  <div className="divide-y divide-ink-900/5">
                    {MOCK_ACTIVITY.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 px-6 py-4">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${activityColors[item.type]}`}>
                          {item.type === "request" ? "R" : item.type === "donation" ? "D" : "P"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                          <p className="mt-0.5 text-sm text-ink-500 line-clamp-2">{item.description}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-xs text-ink-400">{item.time}</span>
                            <Link
                              to={item.href}
                              className="text-xs font-semibold text-blood-600 hover:text-blood-700"
                            >
                              {item.action}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donation History */}
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
                  <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
                    <h2 className="font-display text-lg font-semibold text-ink-950">
                      Donation History
                    </h2>
                    <Link
                      to="/dashboard/donor/history"
                      className="text-sm font-semibold text-blood-600 hover:text-blood-700"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-ink-900/10 text-xs font-semibold uppercase tracking-wider text-ink-400">
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Hospital</th>
                          <th className="px-6 py-3">Units</th>
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
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}