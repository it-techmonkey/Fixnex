'use client';

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message ?? "Unable to log in. Please try again.");
        return;
      }

      // Get redirect URL from query parameter, default to home page
      const redirectUrl = searchParams.get("redirect") || "/";
      
      alert("Login successful! Redirecting...");
      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <header className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Sign in</h2>
          <p className="text-sm text-white/60">
            Enter your credentials to access your FixNex control panel.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <label className="block text-sm font-medium text-white/70">
            Email address
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              required
            />
          </label>

          <label className="block text-sm font-medium text-white/70">
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              required
            />
          </label>

          <div className="flex items-center justify-between text-sm text-white/65">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 rounded border border-white/25 bg-black/50 text-blue-500 focus:ring-blue-400"
                defaultChecked
              />
              Keep me signed in
            </label>
            <Link href="#" className="text-blue-400 transition hover:text-blue-300">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-white/65">
          New to FixNex?{' '}
          <Link href="/signup" className="text-blue-400 transition hover:text-blue-300">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <main className="flex flex-1 flex-col lg:flex-row mt-20">
        <section className="relative w-full lg:w-1/2">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/auth.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.65)",
            }}
          />

          <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between px-8 py-16 lg:px-16 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Welcome Back
              </span>
              <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Manage every booking in one beautiful dashboard.
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
                Log in to reschedule visits, approve quotes, and get real-time support from FixNex specialists. Your property care, streamlined.
              </p>
            </div>

            <div className="mt-12 grid gap-4 text-sm text-white/75">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-white/20 bg-white/15">✓</span>
                On-demand maintenance slots across Dubai
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-white/20 bg-white/15">✓</span>
                AI-powered diagnostics and transparent pricing
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-white/20 bg-white/15">✓</span>
                Priority support for premium members
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={
          <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <div className="text-center text-white/60">Loading...</div>
            </div>
          </section>
        }>
          <LoginForm />
        </Suspense>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default LoginPage;