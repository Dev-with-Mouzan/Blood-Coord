import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import type { DonorProfile, Notification } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "@/lib/auth-client";
import {
  Drop,
  UserCircle,
  MagnifyingGlass,
  ChatCircleDots,
  ArrowRight,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";

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

const activityConfig: Record<string, { color: string; icon: string }> = {
  request: { color: "bg-blue-50 text-blue-600", icon: "R" },
  donation: { color: "bg-emerald-50 text-emerald-600", icon: "D" },
  profile: { color: "bg-amber-50 text-amber-600", icon: "P" },
};

const quickActions = [
  {
    to: "/dashboard/donor/profile",
    icon: UserCircle,
    label: "My Profile",
    description: "View and edit your details",
  },
  {
    to: "/search",
    icon: MagnifyingGlass,
    label: "Find Requests",
    description: "Browse nearby blood requests",
  },
  {
    to: "/dashboard/donor/requests",
    icon: ChatCircleDots,
    label: "Blood Requests",
    description: "View requests matching your type",
  },
];

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const donor = user && "blood_group" in user ? (user as DonorProfile) : null;
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = getToken("donor");
    if (!token) return;
    fetch("/api/v1/donors/me/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <DonorNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {donor && (
            <div className="flex flex-col gap-8">
              {/* Welcome Section */}
              <div className="relative overflow-hidden rounded-3xl border border-ink-900/10 bg-bone-50 p-8 md:p-10">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blood-100/60" />
                <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-blood-50" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blood-600 font-display text-2xl font-bold text-white shadow-lg shadow-blood-600/20">
                      {donor.name.charAt(0)}
                    </span>
                    <div>
                      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                        Hello, {donor.name.split(" ")[0]}
                      </h1>
                      <p className="mt-1 text-ink-500">
                        Welcome back to your donor dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-4 py-2 text-sm font-semibold text-blood-700">
                      <Drop size={14} weight="fill" />
                      {donor.blood_group}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                        donor.eligible_status
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          donor.eligible_status ? "bg-emerald-500" : "bg-ink-400"
                        }`}
                      />
                      {donor.eligible_status ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Blood Group"
                  value={donor.blood_group}
                  icon={<Drop size={18} weight="fill" className="text-blood-600" />}
                />
                <div className="relative overflow-hidden rounded-2xl border border-ink-900/10 bg-bone-50 p-5 transition-all hover:border-ink-900/20 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Eligibility</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${donor.eligible_status ? "bg-emerald-500" : "bg-ink-300"}`} />
                        <p className={`font-display text-xl font-semibold ${donor.eligible_status ? "text-emerald-600" : "text-ink-400"}`}>
                          {donor.eligible_status ? "Eligible" : "Not Eligible"}
                        </p>
                      </div>
                    </div>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${donor.eligible_status ? "bg-emerald-50" : "bg-bone-100"}`}>
                      <CheckCircle size={18} className={donor.eligible_status ? "text-emerald-600" : "text-ink-400"} />
                    </span>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-ink-900/10 bg-bone-50 p-5 transition-all hover:border-ink-900/20 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Availability</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${donor.available_to_donate ? "bg-blue-500" : "bg-ink-300"}`} />
                        <p className={`font-display text-xl font-semibold ${donor.available_to_donate ? "text-blue-600" : "text-ink-400"}`}>
                          {donor.available_to_donate ? "Available" : "Unavailable"}
                        </p>
                      </div>
                    </div>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${donor.available_to_donate ? "bg-blue-50" : "bg-bone-100"}`}>
                      <Clock size={18} className={donor.available_to_donate ? "text-blue-600" : "text-ink-400"} />
                    </span>
                  </div>
                </div>
                <StatCard
                  label="Last Donation"
                  value={donor.last_donation_date || "Never"}
                  icon={<Clock size={18} className="text-ink-400" />}
                />
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="mb-4 font-display text-lg font-semibold text-ink-950">
                  Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.to}
                      to={action.to}
                      className="group flex items-center gap-4 rounded-2xl border border-ink-900/10 bg-bone-50 p-5 transition-all hover:-translate-y-0.5 hover:border-blood-500/30 hover:shadow-lg hover:shadow-blood-600/5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blood-100 text-blood-600 transition-colors group-hover:bg-blood-600 group-hover:text-white">
                        <action.icon size={22} weight="duotone" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-950">{action.label}</p>
                        <p className="mt-0.5 text-xs text-ink-500 truncate">{action.description}</p>
                      </div>
                      <ArrowRight size={16} className="ml-auto shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blood-600" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Activity & History */}
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Activity Feed */}
                <div className="lg:col-span-2 rounded-3xl border border-ink-900/10 bg-bone-50">
                  <div className="border-b border-ink-900/10 px-6 py-4">
                    <h2 className="font-display text-lg font-semibold text-ink-950">
                      Recent Activity
                    </h2>
                  </div>
                  <div className="divide-y divide-ink-900/5">
                    {notifications.length === 0 && (
                      <p className="px-6 py-8 text-sm text-ink-400 text-center">
                        No notifications yet
                      </p>
                    )}
                    {notifications.map((item) => {
                      const cfg = activityConfig[item.type] || activityConfig.request;
                      const timeAgo = getTimeAgo(item.created_at);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-ink-900/5 ${!item.is_read ? "bg-blood-50/30" : ""}`}
                        >
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${cfg.color}`}
                          >
                            {cfg.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                            <p className="mt-0.5 text-sm text-ink-500 line-clamp-2">
                              {item.message}
                            </p>
                            <span className="mt-1.5 inline-block text-xs text-ink-400">
                              {timeAgo}
                            </span>
                          </div>
                          {!item.is_read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blood-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donation History */}
                <div className="lg:col-span-3 rounded-3xl border border-ink-900/10 bg-bone-50">
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
                          <tr key={item.id} className="transition-colors hover:bg-ink-900/5">
                            <td className="px-6 py-4 text-ink-700">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-medium text-ink-900">
                              {item.hospital}
                            </td>
                            <td className="px-6 py-4 text-ink-700">{item.units}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                <span className="h-1 w-1 rounded-full bg-emerald-500" />
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

function StatCard({
  label,
  value,
  valueColor = "text-ink-950",
  icon,
}: {
  label: string;
  value: string;
  valueColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink-900/10 bg-bone-50 p-5 transition-all hover:border-ink-900/20 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
          <p className={`mt-1.5 font-display text-xl font-semibold ${valueColor}`}>{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bone-100 transition-colors group-hover:bg-blood-50">
          {icon}
        </span>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
