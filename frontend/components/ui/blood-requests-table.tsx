import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { BloodRequest } from "@/types";

interface BloodRequestsTableProps {
  bloodGroup: string;
}

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

export function BloodRequestsTable({ bloodGroup }: BloodRequestsTableProps) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = getToken("donor");
        if (!token) return;
        const data = await api.get<BloodRequest[]>("/requests", token);
        const matching = data.filter(
          (r) => r.blood_type === bloodGroup && r.status !== "CLOSED"
        );
        setRequests(matching);
      } catch {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [bloodGroup]);

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blood-600 border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-sm text-ink-500">
            No matching blood requests right now.
          </p>
          <Link
            to="/search"
            className="rounded-full bg-blood-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blood-500"
          >
            Browse all requests
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-xs font-semibold uppercase tracking-wider text-ink-400">
                <th className="px-6 py-3">Hospital</th>
                <th className="px-6 py-3">Blood Type</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Urgency</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Posted</th>
                <th className="px-6 py-3"></th>
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
                  <td className="px-6 py-4">
                    <Link
                      to={`/chat/${req.public_id}`}
                      className="rounded-full bg-blood-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blood-500"
                    >
                      Respond
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
