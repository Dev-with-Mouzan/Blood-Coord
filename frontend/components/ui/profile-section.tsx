import type { DonorProfile } from "@/types";

interface ProfileSectionProps {
  donor: DonorProfile;
}

export function ProfileSection({ donor }: ProfileSectionProps) {
  const details = [
    { label: "Full Name", value: donor.name },
    { label: "Blood Group", value: donor.blood_group },
    { label: "Age", value: `${donor.age} years` },
    { label: "Gender", value: donor.gender.charAt(0).toUpperCase() + donor.gender.slice(1) },
    { label: "Address", value: donor.address },
    ...(donor.weight ? [{ label: "Weight", value: `${donor.weight} kg` }] : []),
    ...(donor.health_status ? [{ label: "Health Status", value: donor.health_status }] : []),
  ];

  return (
    <div id="profile" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blood-100 font-display text-3xl font-bold text-blood-600">
            {donor.name.charAt(0)}
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink-950">
            {donor.name}
          </h3>
          <span className="mt-2 rounded-full bg-blood-50 px-3 py-1 text-sm font-semibold text-blood-700">
            {donor.blood_group}
          </span>

          <div className="mt-6 flex w-full flex-col gap-3 border-t border-ink-900/10 pt-5">
            <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
              <span className="text-sm font-medium text-ink-600">Eligible</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                donor.eligible_status ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-500"
              }`}>
                {donor.eligible_status ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
              <span className="text-sm font-medium text-ink-600">Available</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                donor.available_to_donate ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-500"
              }`}>
                {donor.available_to_donate ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
        <h3 className="font-display text-lg font-semibold text-ink-950">Personal Details</h3>
        <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
