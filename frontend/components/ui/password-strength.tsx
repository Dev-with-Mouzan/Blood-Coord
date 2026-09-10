import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X } from "@phosphor-icons/react";

const RULES = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Upper & lowercase", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
  { label: "A symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const LEVELS = [
  { label: "Weak", bar: "bg-blood-500", text: "text-blood-600" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Good", bar: "bg-amber-400", text: "text-amber-500" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
] as const;

export function PasswordStrength({ password }: { password: string }) {
  const reduce = useReducedMotion();
  const score = RULES.filter((r) => r.test(password)).length;
  const level = LEVELS[Math.max(score - 1, 0)];
  const hasInput = password.length > 0;

  return (
    <div className="flex flex-col gap-2.5" aria-live="polite">
      {/* Strength bars */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1.5">
          {RULES.map((_, i) => {
            const filled = hasInput && score >= i + 1;
            return (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/10">
                <motion.div
                  className={`h-full origin-left rounded-full ${level.bar}`}
                  initial={false}
                  animate={{ scaleX: filled ? 1 : 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 30 }
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="w-14 text-right text-xs font-semibold">
          <AnimatePresence mode="popLayout" initial={false}>
            {hasInput ? (
              <motion.span
                key={level.label}
                initial={reduce ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className={`inline-block ${level.text}`}
              >
                {level.label}
              </motion.span>
            ) : (
              <motion.span
                key="empty"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                className="inline-block text-ink-400"
              >
                —
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live checklist */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                passed ? "font-medium text-emerald-700" : "text-ink-500"
              }`}
            >
              <motion.span
                key={passed ? "yes" : "no"}
                initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 25 }}
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  passed ? "bg-emerald-500/15 text-emerald-600" : "bg-ink-900/5 text-ink-400"
                }`}
              >
                {passed ? <Check size={10} weight="bold" /> : <X size={10} weight="bold" />}
              </motion.span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
