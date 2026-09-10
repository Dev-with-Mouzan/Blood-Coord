import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  MagnifyingGlass,
  Drop,
  ArrowRight,
  MapPin,
  Hospital,
  Clock,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/form";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { BloodRequest, DonorProfile } from "@/types";

function DonorMatches() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const token = getToken("donor");
      const data = await api.get<BloodRequest[]>("/donors/me/matching-requests", token);
      setRequests(data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/15 px-5 py-12 text-center">
        <p className="text-sm text-ink-500">No matching requests right now.</p>
        <p className="mt-1 text-xs text-ink-400">Check back later — new requests come in regularly.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {requests.map((r, i) => (
        <RequestRow key={r.public_id} request={r} delay={i * 0.04} role="donor" />
      ))}
    </div>
  );
}

function RequesterMatches() {
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken("requester");
        const data = await api.get<BloodRequest[]>("/requests/me", token);
        setMyRequests(data);
      } catch {
        setMyRequests([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadMatches = useCallback(async (requestId: string) => {
    setSelectedId(requestId);
    setLoadingMatches(true);
    setDonors([]);
    try {
      const token = getToken("requester");
      const data = await api.get<DonorProfile[]>(`/requests/${requestId}/matches`, token);
      setDonors(data);
    } catch {
      setDonors([]);
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
      </div>
    );
  }

  if (myRequests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/15 px-5 py-12 text-center">
        <p className="text-sm text-ink-500">You haven't created any requests yet.</p>
        <Link
          to="/dashboard/requester"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blood-600 hover:underline"
        >
          Create a request <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-ink-600">Select a request to view matches:</p>
        {myRequests.map((r) => (
          <button
            key={r.public_id}
            type="button"
            onClick={() => loadMatches(r.public_id)}
            className={
              "flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all " +
              (selectedId === r.public_id
                ? "border-blood-500/50 bg-blood-50"
                : "border-ink-900/10 bg-bone-50 hover:border-ink-900/20")
            }
          >
            <div>
              <p className="font-semibold text-ink-950">{r.hospital}</p>
              <p className="text-sm text-ink-500">
                {r.blood_type} · {r.units_needed} unit{r.units_needed > 1 ? "s" : ""} · {r.address}
              </p>
            </div>
            <span className="text-xs font-semibold text-ink-400">
              {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
            </span>
          </button>
        ))}
      </div>

      {selectedId && (
        <div className="flex flex-col gap-3">
          {loadingMatches ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
            </div>
          ) : donors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-900/15 px-5 py-10 text-center">
              <p className="text-sm text-ink-500">No matching donors found for this request.</p>
            </div>
          ) : (
            donors.map((d, i) => (
              <DonorRow key={d.public_id} donor={d} requestId={selectedId} delay={i * 0.04} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function RequestRow({
  request,
  delay,
  role,
}: {
  request: BloodRequest;
  delay: number;
  role: "donor";
}) {
  const navigate = useNavigate();

  async function handleContact() {
    const token = getToken(role);
    if (!token) return;
    try {
      const thread = await api.post<{ public_id: string }>(
        "/chat/threads",
        { request_public_id: request.public_id },
        token
      );
      navigate(`/chat/${thread.public_id}`);
    } catch {
      // silently fail
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between gap-4 rounded-2xl border border-ink-900/10 bg-bone-50 px-5 py-4"
    >
      <div className="min-w-0">
        <p className="font-semibold text-ink-950">{request.hospital}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Drop size={13} weight="fill" className="text-blood-600" />
            {request.blood_type}
          </span>
          <span className="inline-flex items-center gap-1">
            <Hospital size={13} className="text-ink-400" />
            {request.units_needed} unit{request.units_needed > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="text-ink-400" />
            {request.address}
          </span>
          {request.patient_context && (
            <span className="inline-flex items-center gap-1">
              <Clock size={13} className="text-ink-400" />
              {request.urgency.charAt(0) + request.urgency.slice(1).toLowerCase()}
            </span>
          )}
        </div>
        {request.patient_context && (
          <p className="mt-1 text-xs text-ink-400">{request.patient_context}</p>
        )}
      </div>
      <Button onClick={handleContact} className="shrink-0">
        Contact
      </Button>
    </motion.div>
  );
}

function DonorRow({
  donor,
  requestId,
  delay,
}: {
  donor: DonorProfile;
  requestId: string;
  delay: number;
}) {
  const navigate = useNavigate();

  async function handleContact() {
    const token = getToken("requester");
    if (!token) return;
    try {
      const thread = await api.post<{ public_id: string }>(
        "/chat/threads",
        { request_public_id: requestId, donor_public_id: donor.public_id },
        token
      );
      navigate(`/chat/${thread.public_id}`);
    } catch {
      // silently fail
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between gap-4 rounded-2xl border border-ink-900/10 bg-bone-50 px-5 py-4"
    >
      <div className="min-w-0">
        <p className="font-semibold text-ink-950">{donor.name}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Drop size={13} weight="fill" className="text-blood-600" />
            {donor.blood_group}
          </span>
          <span>{donor.address}</span>
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold " +
              (donor.available_to_donate
                ? "bg-emerald-100 text-emerald-700"
                : "bg-ink-900/5 text-ink-500")
            }
          >
            <span
              className={
                "h-1.5 w-1.5 rounded-full " +
                (donor.available_to_donate ? "bg-emerald-500" : "bg-ink-400")
              }
            />
            {donor.available_to_donate ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
      <Button onClick={handleContact} className="shrink-0">
        Contact
      </Button>
    </motion.div>
  );
}

export default function SearchPage() {
  const { role } = useAuth();

  return (
    <AuthGate>
      <DashboardShell title={role === "donor" ? "Find matching requests" : "Find matching donors"}>
        {role === "donor" ? <DonorMatches /> : <RequesterMatches />}
      </DashboardShell>
    </AuthGate>
  );
}