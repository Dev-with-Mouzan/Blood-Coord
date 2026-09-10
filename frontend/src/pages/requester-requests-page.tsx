import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { RequesterNavbar } from "@/components/ui/requester-navbar";
import { CreateRequestModal } from "@/components/ui/create-request-modal";
import { requestsApi } from "@/lib/requests";
import type { BloodRequest, RequesterProfile } from "@/types";
import { Plus } from "@phosphor-icons/react";

const urgencyStyles: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700",
  URGENT: "bg-amber-100 text-amber-700",
  NORMAL: "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-700",
  MATCHING: "bg-amber-100 text-amber-700",
  FULFILLED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-ink-100 text-ink-500",
};

export default function RequesterRequestsPage() {
  const { user } = useAuth();
  const requester = user && "address" in user && !("blood_group" in user) ? (user as RequesterProfile) : null;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <RequesterNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {requester && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  My Requests
                </h1>
                <p className="mt-2 text-ink-500">
                  Track and manage your blood requests.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-blood-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blood-500"
                >
                  <Plus size={18} weight="bold" />
                  New Request
                </button>
              </div>

              <RequesterRequestsList key={refreshKey} />
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </AuthGate>
  );
}

function RequesterRequestsList() {
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

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="text-sm text-ink-500">
              No requests yet. Click "New Request" above to create one.
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
