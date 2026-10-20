"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/layout/Header";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  // When already signed in, the link goes to that account's email and nothing needs typing.
  const [checkingSession, setCheckingSession] = useState(true);
  const [signedInEmail, setSignedInEmail] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.user?.email) setSignedInEmail(data.user.email);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const targetEmail = signedInEmail || email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!targetEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <main className="mt-20 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Forgot password</h1>
            <p className="text-sm text-white/60">
              {signedInEmail
                ? "We will send a link to your account email so you can choose a new password."
                : "Enter your account email and we will send you a link to choose a new password."}
            </p>
          </header>

          {checkingSession ? (
            <div className="py-6 text-center text-sm text-white/60">Loading...</div>
          ) : sent ? (
            <div className="space-y-4">
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                If an account exists for that email, we have sent a password reset link. It expires in
                30 minutes. Check your spam folder if you do not see it.
              </p>
              <Link
                href={signedInEmail ? "/admin-dashboard/account" : "/login"}
                className="block w-full rounded-xl border border-white/15 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {signedInEmail ? "Back to account" : "Back to sign in"}
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              {signedInEmail ? (
                <p className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-sm text-white/80">
                  The reset link will be sent to
                  <span className="mt-1 block break-all font-semibold text-white">{signedInEmail}</span>
                </p>
              ) : (
                <label className="block text-sm font-medium text-white/70">
                  Email address
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className={inputClass}
                    required
                  />
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center text-sm text-white/65">
                {signedInEmail ? "Changed your mind?" : "Remembered it?"}{" "}
                <Link
                  href={signedInEmail ? "/admin-dashboard/account" : "/login"}
                  className="text-blue-400 transition hover:text-blue-300"
                >
                  {signedInEmail ? "Back to account" : "Back to sign in"}
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
