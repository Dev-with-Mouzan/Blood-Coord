import { useAuth } from "@/components/auth/auth-context";
import { AuthGate } from "@/components/auth/auth-gate";
import { RequesterNavbar } from "@/components/ui/requester-navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, MapPin, Shield, SignOut, Pencil, Check, X } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { RequesterProfile } from "@/types";

export default function RequesterProfilePage() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const requester = user && "address" in user && !("blood_group" in user) ? (user as RequesterProfile) : null;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: requester?.name || "",
    address: requester?.address || "",
  });

  useEffect(() => {
    if (requester) {
      setFormData({
        name: requester.name,
        address: requester.address,
      });
    }
  }, [requester]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  async function handleSave() {
    const token = getToken("requester");
    if (!token) return;

    setSaving(true);
    try {
      await api.patch("/requesters/me", formData, token);
      await refresh();
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (requester) {
      setFormData({
        name: requester.name,
        address: requester.address,
      });
    }
    setEditing(false);
  }

  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-bone-100">
        <RequesterNavbar />

        <main className="container-shell pt-24 pb-8 md:pt-28 md:pb-12">
          {requester && (
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
                        {requester.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-white">
                          {requester.name}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                          <MapPin size={14} weight="fill" />
                          {requester.address}
                        </p>
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
                            <span className="text-sm font-medium text-ink-900">
                              {requester.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                          Address
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-bone-100 px-4 py-3 text-sm font-medium text-ink-900 outline-none focus:border-blood-500 focus:ring-1 focus:ring-blood-500"
                          />
                        ) : (
                          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-bone-100 px-4 py-3">
                            <MapPin size={18} className="text-ink-400" />
                            <span className="text-sm font-medium text-ink-900">
                              {requester.address}
                            </span>
                          </div>
                        )}
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
                              <p className="text-xs text-ink-500">Blood Requester</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-bone-100 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <User size={18} className="text-ink-400" />
                            <div>
                              <p className="text-sm font-medium text-ink-900">User ID</p>
                              <p className="text-xs text-ink-500 font-mono">{requester.public_id.slice(0, 12)}…</p>
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
