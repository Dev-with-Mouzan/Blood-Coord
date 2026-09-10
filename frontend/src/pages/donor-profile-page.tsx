import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import { useEffect, useState } from "react";
import type { DonorProfile } from "@/types";

export default function DonorProfilePage() {
  const { user, refresh } = useAuth();
  const donor = user && "blood_group" in user ? (user as DonorProfile) : null;

  const [formData, setFormData] = useState({
    name: donor?.name || "",
    age: donor?.age || 0,
    gender: donor?.gender || "",
    address: donor?.address || "",
    weight: donor?.weight || 0,
    health_status: donor?.health_status || "",
    available_to_donate: donor?.available_to_donate || false,
  });

  useEffect(() => {
    if (donor) {
      setFormData({
        name: donor.name,
        age: donor.age,
        gender: donor.gender,
        address: donor.address,
        weight: donor.weight || 0,
        health_status: donor.health_status || "",
        available_to_donate: donor.available_to_donate,
      });
    }
  }, [donor]);

  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
    setSaved(false);
  }

  function handleToggleAvailable() {
    setFormData((prev) => ({ ...prev, available_to_donate: !prev.available_to_donate }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <DonorNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {donor && (
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  My Profile
                </h1>
                <p className="mt-2 text-ink-500">
                  Update your personal information and donation preferences.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                {/* Profile Card */}
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blood-100 font-display text-4xl font-bold text-blood-600">
                      {donor.name.charAt(0)}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">
                      {donor.name}
                    </h3>
                    <span className="mt-2 rounded-full bg-blood-50 px-4 py-1.5 text-sm font-semibold text-blood-700">
                      {donor.blood_group}
                    </span>

                    <div className="mt-6 flex w-full flex-col gap-3 border-t border-ink-900/10 pt-5">
                      <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                        <span className="text-sm font-medium text-ink-600">Eligible</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          donor.eligible_status ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-500"
                        }`}>
                          {donor.eligible_status ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                        <span className="text-sm font-medium text-ink-600">Available</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          formData.available_to_donate ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-500"
                        }`}>
                          {formData.available_to_donate ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                        <span className="text-sm font-medium text-ink-600">Last Donation</span>
                        <span className="text-sm font-semibold text-ink-900">
                          {donor.last_donation_date || "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-8">
                  <h3 className="font-display text-lg font-semibold text-ink-950">Edit Details</h3>
                  <div className="mt-5 flex flex-col gap-5">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Health Status
                        </label>
                        <input
                          type="text"
                          name="health_status"
                          value={formData.health_status}
                          onChange={handleChange}
                          placeholder="e.g. Excellent"
                          className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                      <span className="text-sm font-medium text-ink-600">Available to donate</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={formData.available_to_donate}
                        onClick={handleToggleAvailable}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                          formData.available_to_donate ? "bg-blood-600" : "bg-ink-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                            formData.available_to_donate ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-full bg-blood-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blood-500"
                      >
                        Save Changes
                      </button>
                      {saved && (
                        <span className="text-sm font-medium text-emerald-600">
                          Changes saved successfully
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGate>
  );
}