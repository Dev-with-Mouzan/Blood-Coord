import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  PaperPlaneRight,
  ArrowLeft,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Message {
  sender_role: string;
  content: string;
  created_at: string;
}

interface Thread {
  public_id: string;
}

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = getToken(role ?? "donor");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        try {
          const data = await api.get<Message[]>(
            `/chat/threads/${chatId}/messages`,
            token
          );
          setMessages(data);
          setThreadId(chatId);
          setLoading(false);
          return;
        } catch {
          // Not a thread ID, try creating a thread from blood request
        }

        const thread = await api.post<Thread>(
          "/chat/threads",
          { request_public_id: chatId },
          token
        );
        setThreadId(thread.public_id);

        const data = await api.get<Message[]>(
          `/chat/threads/${thread.public_id}/messages`,
          token
        );
        setMessages(data);
      } catch {
        // thread may not have messages yet
      } finally {
        setLoading(false);
      }
    })();
  }, [chatId, role, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending || !threadId) return;

    const token = getToken(role ?? "donor");
    if (!token) return;

    setSending(true);
    try {
      const msg = await api.post<Message>(
        `/chat/threads/${threadId}/messages`,
        { content: newMessage.trim() },
        token
      );
      if (msg) {
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <AuthGate>
      <div className="flex h-[100dvh] flex-col bg-bone-100">
        {/* Background image */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Main blood drop pattern - flipped upward */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 105C53 105 46 94 46 78C46 58 60 40 60 40C60 40 74 58 74 78C74 94 67 105 60 105Z' fill='%238B0000' opacity='0.9'/%3E%3Ccircle cx='15' cy='25' r='5' fill='%238B0000' opacity='0.4'/%3E%3Ccircle cx='105' cy='95' r='4' fill='%238B0000' opacity='0.35'/%3E%3Ccircle cx='20' cy='85' r='2.5' fill='%238B0000' opacity='0.25'/%3E%3Ccircle cx='100' cy='35' r='3' fill='%238B0000' opacity='0.3'/%3E%3Ccircle cx='60' cy='15' r='2' fill='%238B0000' opacity='0.2'/%3E%3Ccircle cx='35' cy='55' r='1.5' fill='%238B0000' opacity='0.2'/%3E%3Ccircle cx='85' cy='65' r='1.5' fill='%238B0000' opacity='0.2'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-bone-100/50 via-transparent to-bone-100/50" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-ink-950/95 backdrop-blur-xl">
          <div className="container-shell flex h-16 items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-bone-200 transition-colors hover:bg-bone-50/10"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blood-600 text-white">
                <ChatCircleDots size={20} />
              </span>
              <div>
                <h1 className="text-sm font-semibold text-bone-50">
                  Blood Request Chat
                </h1>
                <p className="text-xs text-bone-200/60">
                  Request #{chatId.slice(0, 8)}…
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat container */}
        <main className="relative z-10 flex-1 overflow-auto px-4 py-6 md:px-8">
          <div className="mx-auto flex h-full max-w-2xl flex-col">
            {/* Messages card */}
            <div className="flex flex-1 flex-col rounded-3xl border border-ink-900/10 bg-bone-50/80 shadow-xl backdrop-blur-sm">
              {/* Messages area */}
              <div className="flex-1 overflow-auto rounded-t-3xl p-4 md:p-6">
                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blood-100">
                      <ChatCircleDots size={32} className="text-blood-400" />
                    </span>
                    <p className="mt-4 text-sm text-ink-500">
                      No messages yet. Start the conversation.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map((msg, i) => {
                      const isMe = msg.sender_role === role;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: i * 0.02,
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={
                            "flex " + (isMe ? "justify-end" : "justify-start")
                          }
                        >
                          <div
                            className={
                              "relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[65%] " +
                              (isMe
                                ? "rounded-br-md bg-blood-600 text-white shadow-blood-600/20"
                                : "rounded-bl-md border border-ink-900/10 bg-ink-950/5 text-ink-900")
                            }
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <time
                              className={
                                "mt-1 block text-[10px] " +
                                (isMe ? "text-white/60" : "text-ink-400")
                              }
                            >
                              {formatTime(msg.created_at)}
                            </time>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="border-t border-ink-900/10 rounded-b-3xl bg-bone-50 p-4">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message…"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1 rounded-full border border-ink-900/10 bg-bone-100 px-5 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-blood-500 focus:outline-none focus:ring-2 focus:ring-blood-500/20"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blood-600 text-white shadow-lg shadow-blood-600/20 transition-all hover:bg-blood-500 hover:shadow-blood-600/30 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <PaperPlaneRight size={20} weight="fill" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
