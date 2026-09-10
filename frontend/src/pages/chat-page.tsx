import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  PaperPlaneRight,
  ArrowLeft,
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

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken(role ?? "donor");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const data = await api.get<Message[]>(
          `/chat/threads/${chatId}/messages`,
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
    if (!newMessage.trim() || sending) return;

    const token = getToken(role ?? "donor");
    if (!token) return;

    setSending(true);
    try {
      const msg = await api.post<Message>(
        `/chat/threads/${chatId}/messages`,
        { content: newMessage.trim() },
        token
      );
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch {
      // handle silently
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthGate>
      <div className="flex h-[100dvh] flex-col bg-bone-100">
        <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-bone-50/80 backdrop-blur-md">
          <div className="container-shell flex h-16 items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-bone-50 text-ink-600 transition-colors hover:bg-ink-900/5"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-ink-950">Chat</h1>
              <p className="text-xs text-ink-400">
                Request {chatId.slice(0, 8)}…
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-6">
          <div className="mx-auto max-w-2xl">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-ink-500">No messages yet. Start the conversation.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((msg, i) => {
                  const isMe = msg.sender_role === role;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.02,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={
                        "flex " + (isMe ? "justify-end" : "justify-start")
                      }
                    >
                      <div
                        className={
                          "max-w-[80%] rounded-2xl px-4 py-3 " +
                          (isMe
                            ? "bg-blood-600 text-white"
                            : "border border-ink-900/10 bg-bone-50 text-ink-900")
                        }
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <time
                          className={
                            "mt-1 block text-[10px] " +
                            (isMe ? "text-white/60" : "text-ink-400")
                          }
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        <form
          onSubmit={handleSend}
          className="border-t border-ink-900/10 bg-bone-50 px-4 py-4"
        >
          <div className="mx-auto flex max-w-2xl gap-3">
            <input
              type="text"
              placeholder="Type a message…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="flex-1 rounded-full border border-ink-900/15 bg-bone-100 px-5 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-blood-500 focus:outline-none focus:ring-2 focus:ring-blood-500/20"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors hover:bg-blood-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PaperPlaneRight size={20} weight="fill" />
            </button>
          </div>
        </form>
      </div>
    </AuthGate>
  );
}