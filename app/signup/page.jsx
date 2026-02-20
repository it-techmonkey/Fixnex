'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const SignupPage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const derivePhoneParts = (input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { phone: null, countryCode: null };
    }

    if (trimmed.startsWith("+")) {
      const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
      if (match) {
        const code = match[1];
        const rest = match[2].replace(/\s+/g, "");
        return {
          phone: rest || null,
          countryCode: code,
        };
      }
    }

    return { phone: trimmed, countryCode: null };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Full name, email, and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { phone, countryCode } = derivePhoneParts(phoneNumber);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber: phone,
          countryCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message ?? "Unable to sign up. Please try again.");
        return;
      }

      alert("Signup successful! Redirecting to the home page.");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              filter: "brightness(0.6)",
            }}
          />

          <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between px-8 py-16 lg:px-16 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Get Started
              </span>
              <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Create your FixNex account and elevate every service experience.
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
                Build a personalised maintenance hub, save preferred locations, and unlock priority booking windows across Dubai.
              </p>
            </div>

            <div className="mt-12 grid gap-4 text-sm text-white/75">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-white/20 bg-white/15">✓</span>
                Instant access to 60+ curated home and office services
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-white/20 bg-white/15">✓</span>
                Transparent pricing with loyalty rewards built in
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-white/20 bg-white/15">✓</span>
                Collaborate with your team through shared dashboards
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <header className="space-y-2 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Create an account</h2>
              <p className="text-sm text-white/60">
                Tell us a little about yourself to start automating your maintenance workflow.
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <label className="block text-sm font-medium text-white/70">
                Full name
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </label>

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
                Phone number
                <input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </label>

              <label className="block text-sm font-medium text-white/70">
                Password
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-white/70">
                Confirm password
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </label>

              <div className="flex items-start gap-3 text-sm text-white/65">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border border-white/25 bg-black/50 text-blue-500 focus:ring-blue-400"
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link href="#" className="text-blue-400 transition hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-blue-400 transition hover:text-blue-300">
                    Privacy Policy
                  </Link>.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-center text-sm text-white/65">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 transition hover:text-blue-300">
                Log in instead
              </Link>
            </p>
          </div>
        </section>
      </main>

    </div>
  );
};

export default SignupPage;

