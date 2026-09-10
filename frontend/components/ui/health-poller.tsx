import { useEffect } from "react";

export function HealthPoller({ intervalMs = 5 * 60 * 1000 }: { intervalMs?: number }) {
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch("/health", { cache: "no-store" });
      } catch {
        // backend unreachable — the next tick will retry
      }
    };

    void ping();
    const id = window.setInterval(ping, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return null;
}