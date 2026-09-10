import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { DonorNavbar } from "@/components/ui/donor-navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Shield, SignOut, Pencil, Check, X, Drop, Heart, Calendar } from "@phosphor-icons/react";
import { getToken } from "@/lib/auth-client";
import type { DonorProfile } from "@/types";

export default function DonorProfilePage() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const donor = user && "blood_group" in user ? (user as DonorProfile) : null;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
    setSaved(false);
  }

  async function handleToggleAvailable() {
    const newValue = !formData.available_to_donate;
    setFormData((prev) => ({ ...prev, available_to_donate: newValue }));
    setSaved(false);
    const token = getToken("donor");
    if (token) {
      await fetch("/api/v1/donors/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ available_to_donate: newValue }),
      });
      await refresh();
    }
  }

  async function handleSave() {
    setSaving(true);
    const token = getToken("donor");
    if (token) {
      await fetch("/api/v1/donors/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      await refresh();
    }
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
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
    setEditing(false);
  }

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <DonorNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {donor && (
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                  My Profile
                </h1>
                <p className="mt-2 text-ink-500">
                  Manage your account settings.
                </p>
              </div>

              <div className="mx-auto w-full max-w-2xl">
                {/* Profile Card */}
                <div className="rounded-3xl border border-ink-900/10 bg-bone-50 shadow-sm">
                  {/* Cover / Avatar Section */}
                  <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-blood-600 to-blood-500 px-8 py-10">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />
                    <div className="relative flex items-center gap-5">
                      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white font-display text-3xl font-bold text-blood-600 shadow-lg">
                        {donor.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-white">
                          {donor.name}
                        </h2>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-sm text-white/80">
                            <Drop size={14} weight="fill" />
                            {donor.blood_group}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-white/80">
                            <MapPin size={14} weight="fill" />
                            {donor.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-6 md:p-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-ink-950">
                        Personal Information
                      </h3>
                      {!editing ? (
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-blood-600 transition-colors hover:bg-blood-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-ink-900/5"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1 rounded-full bg-blood-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blood-500 disabled:opacity-50"
                          >
                            {saving ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                              <Check size={14} />
                            )}
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="mt-6 flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Full Name
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                          />
                        ) : (
                          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                            <User size={18} className="text-ink-400" />
                            <span className="text-sm font-medium text-ink-900">{donor.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                            Age
                          </label>
                          {editing ? (
                            <input
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                            />
                          ) : (
                            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                              <Calendar size={18} className="text-ink-400" />
                              <span className="text-sm font-medium text-ink-900">{donor.age} years</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                            Gender
                          </label>
                          {editing ? (
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
                          ) : (
                            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                              <User size={18} className="text-ink-400" />
                              <span className="text-sm font-medium text-ink-900 capitalize">{donor.gender}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Address
                        </label>
                        {editing ? (
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={2}
                            className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                          />
                        ) : (
                          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                            <MapPin size={18} className="text-ink-400" />
                            <span className="text-sm font-medium text-ink-900">{donor.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                            Weight (kg)
                          </label>
                          {editing ? (
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                            />
                          ) : (
                            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                              <Heart size={18} className="text-ink-400" />
                              <span className="text-sm font-medium text-ink-900">{donor.weight || "N/A"} kg</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                            Health Status
                          </label>
                          {editing ? (
                            <input
                              type="text"
                              name="health_status"
                              value={formData.health_status}
                              onChange={handleChange}
                              placeholder="e.g. Excellent"
                              className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                            />
                          ) : (
                            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                              <Heart size={18} className="text-ink-400" />
                              <span className="text-sm font-medium text-ink-900">{donor.health_status || "N/A"}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Available to Donate Toggle */}
                      <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                        <span className="text-sm font-medium text-ink-600">Available to donate</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.available_to_donate}
                          onClick={handleToggleAvailable}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-all ${
                            formData.available_to_donate
                              ? "bg-blood-600"
                              : "bg-ink-200 shadow-[0_0_10px_rgba(0,0,0,0.15)]"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                              formData.available_to_donate ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Success Message */}
                    {saved && (
                      <div className="mt-4 rounded-xl border border-emerald-600/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Profile updated successfully!
                      </div>
                    )}

                    {/* Account Section */}
                    <div className="mt-8 border-t border-ink-900/10 pt-6">
                      <h3 className="font-display text-lg font-semibold text-ink-950">
                        Account
                      </h3>
                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Shield size={18} className="text-ink-400" />
                            <div>
                              <p className="text-sm font-medium text-ink-900">Account Type</p>
                              <p className="text-xs text-ink-500">Blood Donor</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-blood-100 px-3 py-1 text-xs font-semibold text-blood-700">
                            {donor.blood_group}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <User size={18} className="text-ink-400" />
                            <div>
                              <p className="text-sm font-medium text-ink-900">User ID</p>
                              <p className="text-xs text-ink-500 font-mono">{donor.public_id.slice(0, 12)}…</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sign Out */}
                    <div className="mt-8 border-t border-ink-900/10 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-900/20 px-6 py-3 text-sm font-semibold text-ink-600 transition-all hover:border-red-500/30 hover:bg-red-50 hover:text-red-600"
                      >
                        <SignOut size={18} weight="bold" />
                        Sign out
                      </button>
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
