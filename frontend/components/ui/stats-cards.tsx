import type { DonorProfile } from "@/types";

interface StatsCardsProps {
  donor: DonorProfile;
}

export function StatsCards({ donor }: StatsCardsProps) {
  const stats = [
    {
      label: "Blood Group",
      value: donor.blood_group,
    },
    {
      label: "Eligible to Donate",
      value: donor.eligible_status ? "Yes" : "No",
    },
    {
      label: "Available",
      value: donor.available_to_donate ? "Yes" : "No",
    },
    {
      label: "Last Donation",
      value: donor.last_donation_date || "Never",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-ink-900/10 bg-bone-50 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            {stat.label}
          </p>
          <p className="mt-1 font-display text-xl font-semibold text-ink-950">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
