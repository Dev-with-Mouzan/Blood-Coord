import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { RequesterNavbar } from "@/components/ui/requester-navbar";
import { requestsApi } from "@/lib/requests";
import type { BloodRequest, RequesterProfile } from "@/types";
import {
  ChatCircleDots,
  Plus,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function RequesterDashboardPage() {
  const { user } = useAuth();
  const requester = user && "address" in user && !("blood_group" in user) ? (user as RequesterProfile) : null;

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <RequesterNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {requester && (
            <div className="flex flex-col gap-8">
              {/* Welcome Section */}
              <div className="relative overflow-hidden rounded-3xl border border-ink-900/10 bg-bone-50 p-8 md:p-10">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blood-100/60" />
                <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-blood-50" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blood-600 font-display text-2xl font-bold text-white shadow-lg shadow-blood-600/20">
                      {requester.name.charAt(0)}
                    </span>
                    <div>
                      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                        Hello, {requester.name.split(" ")[0]}
                      </h1>
                      <p className="mt-1 text-ink-500">
                        Welcome back to your requester dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="mb-4 text-center font-display text-lg font-semibold text-ink-950">
                  Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    to="/dashboard/requester/requests"
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-900/10 bg-bone-50 p-6 text-center transition-all hover:-translate-y-0.5 hover:border-blood-500/30 hover:shadow-lg hover:shadow-blood-600/5"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood-100 text-blood-600 transition-colors group-hover:bg-blood-600 group-hover:text-white">
                      <Plus size={24} weight="duotone" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-950">New Request</p>
                      <p className="mt-1 text-xs text-ink-500">Create a new blood request</p>
                    </div>
                  </Link>
                  <Link
                    to="/dashboard/requester/chats"
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-900/10 bg-bone-50 p-6 text-center transition-all hover:-translate-y-0.5 hover:border-blood-500/30 hover:shadow-lg hover:shadow-blood-600/5"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood-100 text-blood-600 transition-colors group-hover:bg-blood-600 group-hover:text-white">
                      <ChatCircleDots size={24} weight="duotone" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-950">Messages</p>
                      <p className="mt-1 text-xs text-ink-500">Chat with donors</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* My Requests */}
              <RequesterRequests />
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}

function RequesterRequests() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setRequests(await requestsApi.listMine());
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statusStyles: Record<string, string> = {
    PENDING: "bg-blue-100 text-blue-700",
    MATCHING: "bg-amber-100 text-amber-700",
    FULFILLED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-ink-100 text-ink-500",
  };

  const urgencyStyles: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700",
    URGENT: "bg-amber-100 text-amber-700",
    NORMAL: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
      <div className="flex items-center justify-center border-b border-ink-900/10 px-6 py-4">
        <h2 className="font-display text-lg font-semibold text-ink-950">
          My Requests
        </h2>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="text-sm text-ink-500">
              No requests yet. Create your first blood request.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-xs font-semibold uppercase tracking-wider text-ink-400">
                <th className="px-6 py-3">Hospital</th>
                <th className="px-6 py-3">Blood Type</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Urgency</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {requests.map((req) => (
                <tr key={req.public_id} className="hover:bg-ink-900/5">
                  <td className="px-6 py-4 font-medium text-ink-900">
                    {req.hospital}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blood-100 px-2.5 py-1 text-xs font-semibold text-blood-700">
                      {req.blood_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-700">{req.units_needed}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyStyles[req.urgency] || ""}`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[req.status] || ""}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
