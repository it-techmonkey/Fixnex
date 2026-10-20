"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header";
import { PASSWORD_RULES, validatePassword } from "@/lib/passwordPolicy";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const policyError = validatePassword(newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.message ?? "Unable to reset the password. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          This reset link is incomplete. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="block w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-sm font-semibold text-white"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Your password has been reset. You have been signed out everywhere, so please sign in with
          your new password.
        </p>
        <Link
          href="/login"
          className="block w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-center text-sm font-semibold text-white"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}{" "}
          {error.includes("link") && (
            <Link href="/forgot-password" className="underline">
              Request a new link
            </Link>
          )}
        </p>
      )}

      <label className="block text-sm font-medium text-white/70">
        New password
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          autoComplete="new-password"
          className={inputClass}
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          className={inputClass}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : "Reset password"}
      </button>
    </form>
  );
};

const ResetPasswordPage = () => (
  <div className="flex min-h-screen flex-col bg-black text-white">
    <Header />

    <main className="mt-20 flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
          <p className="text-sm text-white/60">Pick a password you have not used before.</p>
        </header>
        <Suspense fallback={<div className="text-center text-white/60">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  </div>
);

export default ResetPasswordPage;
