import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button, Field, Select, TextInput } from "@/components/ui/form";
import { requestsApi, URGENCY_LEVELS } from "@/lib/requests";
import type { BloodGroup, BloodRequest, RequesterProfile } from "@/types";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RequesterDashboardPage() {
  const { user } = useAuth();
  const requester = user && "address" in user && !("blood_group" in user) ? (user as RequesterProfile) : null;

  return (
    <AuthGate>
      <DashboardShell title={requester ? `Welcome, ${requester.name.split(" ")[0]}` : "Requester dashboard"}>
        <RequesterContent />
      </DashboardShell>
    </AuthGate>
  );
}

function RequesterContent() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      blood_type: String(form.get("blood_type") ?? "") as BloodGroup,
      address: String(form.get("address") ?? "").trim(),
      hospital: String(form.get("hospital") ?? "").trim(),
      units_needed: Number(form.get("units_needed")) || 1,
      urgency: String(form.get("urgency") ?? "NORMAL") as BloodRequest["urgency"],
      patient_context: String(form.get("patient_context") ?? "").trim() || undefined,
    };

    try {
      await requestsApi.create(payload);
      setMessage({ kind: "ok", text: "Request submitted. We're matching it now." });
      e.currentTarget.reset();
      load();
    } catch (err) {
      setMessage({ kind: "err", text: err instanceof Error ? err.message : "Failed to submit request." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
          Create a blood request
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Matching runs against eligible, available donors nearby.
        </p>

        {message ? (
          <div
            className={
              "mt-4 rounded-xl border px-4 py-3 text-sm " +
              (message.kind === "ok"
                ? "border-emerald-600/20 bg-emerald-50 text-emerald-700"
                : "border-blood-600/20 bg-blood-50 text-blood-700")
            }
          >
            {message.text}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Field label="Blood group needed" htmlFor="blood_type">
            <Select id="blood_type" name="blood_type" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {BLOOD_GROUPS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Hospital" htmlFor="hospital">
            <TextInput id="hospital" name="hospital" required minLength={2} placeholder="City General Hospital" />
          </Field>

          <Field label="Location / area" htmlFor="address">
            <TextInput id="address" name="address" required minLength={3} placeholder="City, locality" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Units needed" htmlFor="units_needed">
              <TextInput id="units_needed" name="units_needed" type="number" min={1} max={50} defaultValue={1} />
            </Field>
            <Field label="Urgency" htmlFor="urgency">
              <Select id="urgency" name="urgency" defaultValue="NORMAL">
                {URGENCY_LEVELS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0) + u.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Patient context (optional)" htmlFor="patient_context">
            <TextInput id="patient_context" name="patient_context" placeholder="e.g. Emergency surgery, O- blood" />
          </Field>

          <Button type="submit" fullWidth loading={submitting}>
            Submit request
          </Button>
        </form>
      </div>

      <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
          Your requests
        </h2>
        <p className="mt-1 text-sm text-ink-500">Track how quickly each request gets a donor.</p>

        <div className="mt-6 flex flex-col gap-3">
          {loading ? (
            <div className="flex h-24 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
            </div>
          ) : requests.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-900/15 px-5 py-8 text-center text-sm text-ink-500">
              No requests yet. Create your first blood request.
            </p>
          ) : (
            requests.map((r) => (
              <div
                key={r.public_id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-ink-900/10 bg-bone-100 px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-ink-950">
                    {r.hospital}
                  </p>
                  <p className="text-sm text-ink-500">
                    {r.blood_type} · {r.units_needed} unit{r.units_needed > 1 ? "s" : ""} · {r.address}
                  </p>
                </div>
                <span
                  className={
                    "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold " +
                    (r.status === "PENDING"
                      ? "bg-amber-100 text-amber-700"
                      : r.status === "FULFILLED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-ink-900/10 text-ink-600")
                  }
                >
                  {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}