'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
  /** Which nav item is active: 'dashboard' | 'bookings' | 'payments' | 'payment-links' */
  currentNav?: 'dashboard' | 'bookings' | 'payments' | 'payment-links';
};

const navItems: Array<{ key: 'dashboard' | 'bookings' | 'payments' | 'payment-links'; label: string; href: string; icon: React.ReactNode }> = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/admin-dashboard',
    icon: <DashboardIcon className="size-5" />,
  },
  {
    key: 'bookings',
    label: 'Bookings',
    href: '/admin',
    icon: <CalendarListIcon className="size-5" />,
  },
  {
    key: 'payments',
    label: 'Payments',
    href: '/admin-dashboard/payments',
    icon: <PaymentsIcon className="size-5" />,
  },
  {
    key: 'payment-links',
    label: 'Payment Links',
    href: '/admin-dashboard/payment-links',
    icon: <LinkIcon className="size-5" />,
  },
];

export function AdminLayout({ children, title, currentNav }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      setCheckingAuth(true);
      setAuthError(null);
      try {
        const res = await fetch("/api/auth/session", { method: "GET", credentials: "include" });
        if (!isMounted) return;
        if (!res.ok) throw new Error("You must be signed in to access this page.");
        const data = await res.json();
        if (data?.user?.role !== "ADMIN") throw new Error("Only administrators can access this page.");
        setIsAuthorized(true);
      } catch (err) {
        setIsAuthorized(false);
        setAuthError((err as Error).message ?? "Access denied.");
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    };
    verify();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-10 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
          <p className="text-sm font-medium text-slate-400">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/50 p-6 text-center shadow-xl sm:p-8">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rose-500/20">
            <LockIcon className="size-7 text-rose-400" />
          </div>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Access denied</h1>
          <p className="mt-2 text-sm text-slate-400">{authError}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  const activeNav = currentNav ?? (pathname === '/admin-dashboard' ? 'dashboard' : pathname.includes('/payments') ? 'payments' : 'bookings');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/98 shadow-xl
          transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-800/80 px-4 lg:justify-start">
          <Link href="/admin-dashboard" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-sky-600 text-sm font-bold text-slate-950">
              fx
            </span>
            <span className="font-semibold text-white">fix<span className="text-sky-400">nex</span></span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`
                  flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
                  ${isActive
                    ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 p-3 space-y-1">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800/80 hover:text-white"
          >
            <HomeIcon className="size-5" />
            Back to site
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 px-3 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-sky-500 to-indigo-500 text-xs font-bold text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Admin</p>
              <p className="truncate text-xs text-slate-400">Dashboard</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-slate-800/80 bg-slate-950/95 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="size-5" />
          </button>
          {title && (
            <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
              {title}
            </h1>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function CalendarListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PaymentsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
