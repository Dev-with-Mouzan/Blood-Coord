import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { requestsApi } from "@/lib/requests";
import { DonorSelectionModal } from "@/components/ui/donor-selection-modal";
import type { BloodGroup, BloodRequest } from "@/types";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = ["CRITICAL", "URGENT", "NORMAL"] as const;

interface CreateRequestModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateRequestModal({ onClose, onCreated }: CreateRequestModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

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
      const request = await requestsApi.create(payload);
      setCreatedRequestId(request.public_id);
      setShowDonorModal(true);
    } catch (err) {
      setMessage({ kind: "err", text: err instanceof Error ? err.message : "Failed to submit request." });
    } finally {
      setSubmitting(false);
    }
  }

  if (showDonorModal && createdRequestId) {
    return (
      <DonorSelectionModal
        requestPublicId={createdRequestId}
        onClose={() => {
          onCreated();
          onClose();
        }}
        onNotified={() => {}}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-ink-900/10 bg-bone-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Create a Blood Request
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-400 hover:bg-ink-900/5 hover:text-ink-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {message ? (
            <div
              className={
                "rounded-xl border px-4 py-3 text-sm " +
                (message.kind === "ok"
                  ? "border-emerald-600/20 bg-emerald-50 text-emerald-700"
                  : "border-blood-600/20 bg-blood-50 text-blood-700")
              }
            >
              {message.text}
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Blood group needed
            </label>
            <select
              name="blood_type"
              required
              defaultValue=""
              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
            >
              <option value="" disabled>Select</option>
              {BLOOD_GROUPS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Hospital
            </label>
            <input
              type="text"
              name="hospital"
              required
              minLength={2}
              placeholder="City General Hospital"
              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Location / area
            </label>
            <input
              type="text"
              name="address"
              required
              minLength={3}
              placeholder="City, locality"
              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Units needed
              </label>
              <input
                type="number"
                name="units_needed"
                min={1}
                max={50}
                defaultValue={1}
                className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Urgency
              </label>
              <select
                name="urgency"
                defaultValue="NORMAL"
                className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
              >
                {URGENCY_LEVELS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0) + u.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Patient context (optional)
            </label>
            <input
              type="text"
              name="patient_context"
              placeholder="e.g. Emergency surgery, O- blood"
              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-900/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-blood-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blood-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
