import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { ChatCircleDots, User } from "@phosphor-icons/react";

interface ChatThread {
  public_id: string;
  donor_name: string;
  donor_blood_group: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export default function DonorChatsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const donor = user && "blood_group" in user ? user : null;
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken("donor");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const data = await api.get<ChatThread[]>("/chat/threads", token);
        setThreads(Array.isArray(data) ? data : []);
      } catch {
        setThreads([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <DonorNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {donor && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  Messages
                </h1>
                <p className="mt-2 text-ink-500">
                  Chat with requesters about blood requests.
                </p>
              </div>

              <div className="mx-auto w-full max-w-2xl">
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
                    </div>
                  ) : threads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-900/5">
                        <ChatCircleDots size={32} className="text-ink-300" />
                      </span>
                      <p className="mt-4 text-sm text-ink-500">
                        No conversations yet.
                      </p>
                      <p className="mt-1 text-xs text-ink-400">
                        Start a chat from a blood request.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-ink-900/5">
                      {threads.map((thread) => (
                        <button
                          key={thread.public_id}
                          type="button"
                          onClick={() => navigate(`/chat/${thread.public_id}`)}
                          className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-ink-900/5"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blood-100">
                            <User size={20} weight="fill" className="text-blood-600" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-ink-900">
                                {thread.donor_name}
                              </p>
                            </div>
                            <p className="mt-0.5 text-xs text-ink-500 truncate">
                              {thread.last_message || "No messages yet"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {thread.last_message_time && (
                              <span className="text-[10px] text-ink-400">
                                {new Date(thread.last_message_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                            {thread.unread_count > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blood-500 px-1.5 text-[10px] font-bold text-white">
                                {thread.unread_count}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}
