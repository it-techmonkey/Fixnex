"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { PASSWORD_RULES, validatePassword } from "@/lib/passwordPolicy";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const wrongCurrent = error?.toLowerCase().includes("current password is incorrect") ?? false;
  const inputType = showPasswords ? "text" : "password";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const policyError = validatePassword(newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.message ?? "Unable to change the password. Please try again.");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Account" currentNav="account">
      <div className="mx-auto w-full max-w-xl p-4 sm:p-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl sm:p-8">
          <h1 className="text-xl font-semibold text-white">Change password</h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter your current password, then choose a new one. You stay signed in on this device and
            are signed out everywhere else.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
                {wrongCurrent && (
                  <>
                    {" "}
                    <Link href="/forgot-password" className="font-medium text-sky-300 underline">
                      Forgot your password?
                    </Link>
                  </>
                )}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Password updated. Other devices have been signed out.
              </div>
            )}

            <label className="block text-sm font-medium text-slate-300">
              Current password
              <input
                type={inputType}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className={inputClass}
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              New password
              <input
                type={inputType}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className={inputClass}
                required
              />
            </label>

            <ul className="space-y-1 text-xs">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.id} className={rule.test(newPassword) ? "text-emerald-300" : "text-slate-500"}>
                  {rule.test(newPassword) ? "✓" : "•"} {rule.label}
                </li>
              ))}
            </ul>

            <label className="block text-sm font-medium text-slate-300">
              Confirm new password
              <input
                type={inputType}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={inputClass}
                required
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="size-4 rounded border-slate-600 bg-slate-950"
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Do not remember your current password?{" "}
            <Link href="/forgot-password" className="text-sky-400 underline">
              Reset it by email
            </Link>
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
