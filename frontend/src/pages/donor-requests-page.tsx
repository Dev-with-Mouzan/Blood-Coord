import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import { requestsApi } from "@/lib/requests";
import type { DonorRequest, DonorProfile } from "@/types";
import { Check, X, ChatCircleDots, Drop, MapPin, Clock } from "@phosphor-icons/react";

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
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  Blood Requests
                </h1>
                <p className="mt-2 text-ink-500">
                  Manage incoming requests and chat with accepted requesters.
                </p>
              </div>

              <IncomingRequestsList />
              <AcceptedRequestsList />
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}

function IncomingRequestsList() {
  const [requests, setRequests] = useState<DonorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setRequests(await requestsApi.listIncoming());
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAccept(publicId: string) {
    try {
      await requestsApi.acceptRequest(publicId);
      load();
    } catch {
      // handle silently
    }
  }

  async function handleReject(publicId: string) {
    try {
      await requestsApi.rejectRequest(publicId);
      load();
    } catch {
      // handle silently
    }
  }

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
      <div className="border-b border-ink-900/10 px-6 py-4">
        <h2 className="font-display text-lg font-semibold text-ink-950">Incoming Requests</h2>
        <p className="text-sm text-ink-500">Requesters waiting for your response</p>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="text-sm text-ink-500">No incoming requests</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-xs font-semibold uppercase tracking-wider text-ink-400">
                <th className="px-6 py-3">Hospital</th>
                <th className="px-6 py-3">Blood Type</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Urgency</th>
                <th className="px-6 py-3">Actions</th>
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
                  <td className="px-6 py-4 text-ink-700">{req.address}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      req.urgency === "CRITICAL" ? "bg-red-100 text-red-700" :
                      req.urgency === "URGENT" ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(req.public_id)}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        <Check size={14} weight="bold" />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(req.public_id)}
                        className="inline-flex items-center gap-1 rounded-full border border-ink-900/20 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-900/5"
                      >
                        <X size={14} weight="bold" />
                        Reject
                      </button>
                    </div>
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

function AcceptedRequestsList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<DonorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setRequests(await requestsApi.listAccepted());
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
      <div className="border-b border-ink-900/10 px-6 py-4">
        <h2 className="font-display text-lg font-semibold text-ink-950">Accepted Requests</h2>
        <p className="text-sm text-ink-500">Chat with requesters whose requests you accepted</p>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="text-sm text-ink-500">No accepted requests yet</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-xs font-semibold uppercase tracking-wider text-ink-400">
                <th className="px-6 py-3">Hospital</th>
                <th className="px-6 py-3">Blood Type</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Actions</th>
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
                  <td className="px-6 py-4 text-ink-700">{req.address}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/chat/${req.blood_request_public_id}`)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blood-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blood-500"
                    >
                      <ChatCircleDots size={14} />
                      Chat
                    </button>
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
