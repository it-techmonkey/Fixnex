"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type SessionState = {
  loading: boolean;
  isAuthenticated: boolean;
};

const Header = () => {
  const [session, setSession] = useState<SessionState>({ loading: true, isAuthenticated: false });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) {
          return;
        }

        if (response.ok) {
          setSession({ loading: false, isAuthenticated: true });
        } else {
          setSession({ loading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        if (!cancelled) {
          setSession({ loading: false, isAuthenticated: false });
        }
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      scrollPositionRef.current = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      const previousScrollPosition = scrollPositionRef.current;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo({ top: previousScrollPosition, behavior: "auto" });
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen && isMenuVisible) {
      const timeout = window.setTimeout(() => {
        setIsMenuVisible(false);
      }, 300);

      return () => window.clearTimeout(timeout);
    }
  }, [isMenuOpen, isMenuVisible]);

  const navigationLinks = [
    { label: "About Us", href: "/aboutus" },
    { label: "Services", href: "/services" },
  ];

  const openMenu = () => {
    if (isMenuOpen) {
      return;
    }
    setIsMenuVisible(true);
    requestAnimationFrame(() => setIsMenuOpen(true));
  };

  const closeMenu = () => {
    if (!isMenuOpen) {
      return;
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  return (
    <header className="absolute top-0 z-50 w-full bg-black/10 backdrop-blur-sm ">
      <div className="mx-auto flex w-full  items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="FixNex Home" onClick={closeMenu}>
          <Image
            src="/logo.webp"
            alt="FixNex logo"
            width={100}
            height={60}
            priority
            className="object-contain py-1 pl-2 sm:pl-0"
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-8 text-sm font-heading text-gray-300 md:flex"
          aria-label="Main navigation"
        >
          {navigationLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-100">
              {item.label}
            </Link>
          ))}
          <Link
            href="/bookings"
            className=" px-4 py-2 text-sm font-normal  transition -mr-40"
          >
            Booking
          </Link>
        </nav>

        <div className="hidden flex-row items-center gap-5 font-heading text-sm opacity-95 md:flex">
          <Link
            href="/chat"
            className="rounded-lg bg-white py-3 px-6 text-black font-medium transition-colors hover:bg-gray-100"
          >
            Nex AI
          </Link>
          <div className="flex flex-row items-center gap-5">
            <Link href="/cart" aria-label="Shopping Cart" className="transition-opacity hover:opacity-100">
              <Image src="/ShoppingCart.svg" alt="Shopping cart" width={24} height={24} />
            </Link>
            {session.loading ? (
              <div className="size-6 animate-pulse rounded-full bg-white/40" aria-hidden />
            ) : session.isAuthenticated ? (
              <button
                onClick={async () => {
                  try {
                    await fetch("/api/auth/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                  } catch (error) {
                    console.error("Failed to log out:", error);
                  } finally {
                    setSession({ loading: false, isAuthenticated: false });
                    window.location.href = "/";
                  }
                }}
                className="rounded-lg border border-white/40 py-3 px-6 text-white transition-colors hover:bg-white/10"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-white/40 py-3 px-6 text-white transition-colors hover:bg-white/10"
              >
                Log In
              </Link>
            )}
          </div>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d={isMenuOpen ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"}
            />
          </svg>
        </button>
      </div>

      {isMenuVisible && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
              isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <aside
            className={`fixed inset-y-0 right-0 z-50 flex h-screen w-full max-w-xs flex-col bg-black text-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
              isMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
            }`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isMenuOpen}
          >
        <div className="flex items-center justify-between px-6 py-5">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6 text-base font-medium">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 transition hover:bg-white/10"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bookings"
            className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
            onClick={closeMenu}
          >
            Booking
          </Link>
        </nav>

        <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-6">
          <Link
            href="/chat"
            className="rounded-lg bg-white py-3 text-center text-sm font-semibold text-black transition hover:bg-gray-100"
            onClick={closeMenu}
          >
            Nex AI
          </Link>

          <Link
            href="/cart"
            className="flex items-center justify-center gap-3 rounded-lg border border-white/20 py-3 px-4 text-sm transition hover:bg-white/10"
            onClick={closeMenu}
          >
            <Image src="/ShoppingCart.svg" alt="Shopping cart" width={24} height={24} />
            View Cart
          </Link>

          {session.loading ? (
            <div className="h-12 w-full animate-pulse rounded-lg bg-white/20" aria-hidden />
          ) : session.isAuthenticated ? (
            <button
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                } catch (error) {
                  console.error("Failed to log out:", error);
                } finally {
                  setSession({ loading: false, isAuthenticated: false });
                  window.location.href = "/";
                }
              }}
              className="rounded-lg border border-white/20 py-3 text-sm transition hover:bg-white/10"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-white/20 py-3 text-center text-sm transition hover:bg-white/10"
              onClick={closeMenu}
            >
              Log In
            </Link>
          )}
        </div>
          </aside>
        </>
      )}
    </header>
  );
};

export default Header;
