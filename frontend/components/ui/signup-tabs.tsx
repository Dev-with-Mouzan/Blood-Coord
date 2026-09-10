import { useNavigate } from "react-router-dom";

type Role = "donor" | "requester";

const TABS: { role: Role; label: string }[] = [
  { role: "donor", label: "I'm a donor" },
  { role: "requester", label: "I'm a requester" },
];

export function SignupTabs({ active }: { active: Role }) {
  const navigate = useNavigate();

  return (
    <div
      role="group"
      aria-label="Account type"
      className="grid grid-cols-2 gap-1 rounded-full border border-ink-900/10 bg-bone-100 p-1"
    >
      {TABS.map((tab) => {
        const isActive = tab.role === active;
        return (
          <button
            key={tab.role}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              if (!isActive) navigate(`/signup?role=${tab.role}`, { replace: true });
            }}
            className={
              isActive
                ? "rounded-full bg-bone-50 px-4 py-2 text-sm font-semibold text-ink-950 shadow-[0_1px_3px_rgba(26,20,16,0.14)]"
                : "rounded-full px-4 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}