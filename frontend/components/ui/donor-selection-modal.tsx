import { useEffect, useState } from "react";
import { X, Drop, Check, ChatCircleDots } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { requestsApi, type DonorInfo, type AvailableDonorsResponse } from "@/lib/requests";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";

interface DonorSelectionModalProps {
  requestPublicId: string;
  onClose: () => void;
  onNotified: () => void;
}

export function DonorSelectionModal({ requestPublicId, onClose, onNotified }: DonorSelectionModalProps) {
  const [data, setData] = useState<AvailableDonorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await requestsApi.getAvailableDonors(requestPublicId);
        setData(result);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, [requestPublicId]);

  function toggleDonor(publicId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) {
        next.delete(publicId);
      } else {
        next.add(publicId);
      }
      return next;
    });
  }

  function selectAll(donors: DonorInfo[]) {
    setSelected((prev) => {
      const next = new Set(prev);
      donors.forEach((d) => next.add(d.public_id));
      return next;
    });
  }

  async function handleSend() {
    if (selected.size === 0) return;
    setSending(true);
    try {
      await requestsApi.notifyDonors(requestPublicId, Array.from(selected));
      setSent(true);
      setTimeout(() => {
        onNotified();
        onClose();
      }, 1500);
    } catch {
      // handle error
    } finally {
      setSending(false);
    }
  }

  const totalDonors = (data?.exact_match.length ?? 0) + (data?.compatible.length ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border border-ink-900/10 bg-bone-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-950">
              Select Donors to Notify
            </h2>
            <p className="text-sm text-ink-500">
              {totalDonors} donor{totalDonors !== 1 ? "s" : ""} available for {data?.request_blood_type} blood
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-400 hover:bg-ink-900/5 hover:text-ink-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
            </div>
          ) : sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Check size={32} className="text-emerald-600" />
              </span>
              <p className="mt-4 text-lg font-semibold text-ink-950">Notifications Sent!</p>
              <p className="mt-1 text-sm text-ink-500">
                {selected.size} donor{selected.size !== 1 ? "s" : ""} have been notified
              </p>
            </div>
          ) : totalDonors === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-ink-500">No matching donors available right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Exact Match */}
              {data && data.exact_match.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Exact Match
                      </span>
                      <span className="text-xs text-ink-400">
                        {data.exact_match.length} donor{data.exact_match.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectAll(data.exact_match)}
                      className="text-xs font-semibold text-blood-600 hover:text-blood-700"
                    >
                      Select all
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {data.exact_match.map((donor) => (
                      <DonorCard
                        key={donor.public_id}
                        donor={donor}
                        selected={selected.has(donor.public_id)}
                        onToggle={() => toggleDonor(donor.public_id)}
                        isExact
                        requestPublicId={requestPublicId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Compatible */}
              {data && data.compatible.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Compatible
                      </span>
                      <span className="text-xs text-ink-400">
                        {data.compatible.length} donor{data.compatible.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectAll(data.compatible)}
                      className="text-xs font-semibold text-blood-600 hover:text-blood-700"
                    >
                      Select all
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {data.compatible.map((donor) => (
                      <DonorCard
                        key={donor.public_id}
                        donor={donor}
                        selected={selected.has(donor.public_id)}
                        onToggle={() => toggleDonor(donor.public_id)}
                        isExact={false}
                        requestPublicId={requestPublicId}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !sent && totalDonors > 0 && (
          <div className="flex items-center justify-between border-t border-ink-900/10 px-6 py-4">
            <p className="text-sm text-ink-500">
              {selected.size} donor{selected.size !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-ink-900/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={selected.size === 0 || sending}
                className="rounded-full bg-blood-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blood-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "Sending..." : `Notify ${selected.size} donor${selected.size !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DonorCard({
  donor,
  selected,
  onToggle,
  isExact,
  requestPublicId,
}: {
  donor: DonorInfo;
  selected: boolean;
  onToggle: () => void;
  isExact: boolean;
  requestPublicId: string;
}) {
  const navigate = useNavigate();
  const [creatingChat, setCreatingChat] = useState(false);

  async function handleMessage(e: React.MouseEvent) {
    e.stopPropagation();
    setCreatingChat(true);
    try {
      const token = getToken("requester");
      if (!token) return;
      const thread = await api.post<{ public_id: string }>(
        "/chat/threads",
        { request_public_id: requestPublicId, donor_public_id: donor.public_id },
        token
      );
      navigate(`/chat/${thread.public_id}`);
    } catch {
      // handle silently
    } finally {
      setCreatingChat(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-blood-500 bg-blood-50"
          : "border-ink-900/10 bg-bone-100 hover:border-ink-900/20"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${
          isExact ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {donor.blood_group}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900">{donor.name}</p>
        <p className="mt-0.5 text-xs text-ink-500 truncate">{donor.address}</p>
      </div>
      <button
        type="button"
        onClick={handleMessage}
        disabled={creatingChat}
        className="shrink-0 rounded-full p-2 text-ink-400 transition-colors hover:bg-blood-50 hover:text-blood-600"
        title="Message donor"
      >
        <ChatCircleDots size={18} />
      </button>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected
            ? "border-blood-600 bg-blood-600 text-white"
            : "border-ink-300 bg-bone-50"
        }`}
      >
        {selected && <Check size={14} weight="bold" />}
      </span>
    </button>
  );
}
