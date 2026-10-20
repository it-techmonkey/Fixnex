"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header";
import PasswordInput from "../components/common/PasswordInput";
import { PASSWORD_RULES, validatePassword } from "@/lib/passwordPolicy";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          setUser(data.user);
        } else {
          router.replace("/login?redirect=/account");
        }
      })
      .catch(() => {
        if (active) router.replace("/login?redirect=/account");
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  const wrongCurrent = error.toLowerCase().includes("current password is incorrect");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
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
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <main className="mt-20 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          {checking || !user ? (
            <div className="py-10 text-center text-sm text-white/60">Loading...</div>
          ) : (
            <>
              <header className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
                <p className="text-sm text-white/60">
                  {user.fullName} &middot; {user.email}
                </p>
              </header>

              <h2 className="text-lg font-medium">Change password</h2>

              {user.authProvider === "GOOGLE" ? (
                <p className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                  You sign in with Google, so there is no FixNex password to change.
                </p>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}{" "}
                      {wrongCurrent && (
                        <Link href="/forgot-password" className="font-medium underline">
                          Forgot your password?
                        </Link>
                      )}
                    </p>
                  )}
                  {success && (
                    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      Password updated. Your other devices have been signed out.
                    </p>
                  )}

                  <label className="block text-sm font-medium text-white/70">
                    Current password
                    <PasswordInput
                      wrapperClassName="mt-2"
                      className={inputClass}
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-white/70">
                    New password
                    <PasswordInput
                      wrapperClassName="mt-2"
                      className={inputClass}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <ul className="space-y-1 text-xs">
                    {PASSWORD_RULES.map((rule) => (
                      <li key={rule.id} className={rule.test(newPassword) ? "text-emerald-300" : "text-white/45"}>
                        {rule.test(newPassword) ? "✓" : "•"} {rule.label}
                      </li>
                    ))}
                  </ul>

                  <label className="block text-sm font-medium text-white/70">
                    Confirm new password
                    <PasswordInput
                      wrapperClassName="mt-2"
                      className={inputClass}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Updating..." : "Update password"}
                  </button>

                  <p className="text-center text-xs text-white/50">
                    Do not remember your current password?{" "}
                    <Link href="/forgot-password" className="text-blue-400 underline">
                      Reset it by email
                    </Link>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
