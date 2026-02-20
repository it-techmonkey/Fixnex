"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Integrations", href: "/integrations" },
      { label: "Pricing", href: "/#plans-pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our team", href: "/aboutus" },
      { label: "Our values", href: "/aboutus#values" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Downloads", href: "/downloads" },
      { label: "Documentation", href: "/docs" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18.9419 5.76947C17.6279 5.16787 16.2407 4.74109 14.8158 4.5C14.6208 4.84857 14.4444 5.20721 14.2872 5.57441C12.7694 5.34569 11.2259 5.34569 9.70802 5.57441C9.55081 5.20725 9.37438 4.84862 9.17947 4.5C7.75362 4.74312 6.36551 5.17092 5.05017 5.77261C2.43887 9.63607 1.73099 13.4036 2.08493 17.1176C3.61417 18.2475 5.32583 19.1067 7.14549 19.6581C7.55523 19.107 7.91779 18.5224 8.22934 17.9104C7.6376 17.6894 7.06647 17.4167 6.52256 17.0956C6.66571 16.9917 6.80571 16.8848 6.94099 16.781C8.52365 17.5252 10.251 17.9111 12 17.9111C13.7489 17.9111 15.4763 17.5252 17.059 16.781C17.1958 16.8926 17.3358 16.9996 17.4774 17.0956C16.9324 17.4173 16.3603 17.6905 15.7675 17.912C16.0786 18.5237 16.4412 19.1078 16.8513 19.6581C18.6726 19.109 20.3855 18.2501 21.915 17.1192C22.3303 12.8121 21.2056 9.0792 18.9419 5.76947ZM8.67766 14.8335C7.69135 14.8335 6.8765 13.9384 6.8765 12.8373C6.8765 11.7361 7.66303 10.8332 8.67452 10.8332C9.686 10.8332 10.4946 11.7361 10.4773 12.8373C10.4599 13.9384 9.68285 14.8335 8.67766 14.8335ZM15.3223 14.8335C14.3344 14.8335 13.5227 13.9384 13.5227 12.8373C13.5227 11.7361 14.3092 10.8332 15.3223 10.8332C16.3354 10.8332 17.1376 11.7361 17.1203 12.8373C17.103 13.9384 16.3275 14.8335 15.3223 14.8335Z"
          fill="#EFEDFD"
          fillOpacity="0.3"
        />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19.8986 7.85709C19.9107 8.03438 19.9107 8.21166 19.9107 8.39058C19.9107 13.8424 15.8139 20.13 8.32282 20.13C6.10992 20.13 3.94298 19.4878 2.08008 18.277C2.40185 18.3162 2.72524 18.3358 3.04943 18.3367C4.8833 18.3383 6.66476 17.7149 8.1075 16.5671C6.36476 16.5336 4.83653 15.3824 4.30266 13.7019C4.91314 13.8211 5.54217 13.7966 6.14137 13.6308C4.24137 13.2419 2.87443 11.5507 2.87443 9.58666C2.87443 9.53438 2.87443 9.53438 2.87443 9.53438C3.44056 9.85382 4.07443 10.0311 4.72282 10.0507C2.9333 8.83911 2.38169 6.42735 3.46234 4.54173C5.53008 7.11934 8.58088 8.68634 11.8559 8.85219C11.5277 7.41918 11.976 5.91755 13.0341 4.91019C14.6744 3.3481 17.2543 3.42817 18.7962 5.08911C19.7083 4.90692 20.5825 4.56787 21.3825 4.08748C21.0785 5.04254 20.4422 5.85382 19.5922 6.36934C20.3994 6.27294 21.1881 6.05398 21.9309 5.71983C21.3841 6.5499 20.6954 7.27294 19.8986 7.85709Z"
          fill="#EFEDFD"
          fillOpacity="0.3"
        />
      </svg>
    ),
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  return (
    <footer className="relative mt-24 w-full border-t border-white/5 bg-[#040b16] text-white">
      <div className="pointer-events-none absolute inset-0">
        {/* <div className="absolute -top-32 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35)_0%,rgba(4,12,33,0)_65%)] blur-3xl" /> */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="rounded-2xl border border-white/10 bg-white/2 p-6 backdrop-blur">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-4">
                  <Link href="/" className="flex items-center" aria-label="FixNex Home">
                    <Image
                      src="/logo.webp"
                      alt="FixNex logo"
                      width={100}
                      height={50}
                      priority
                      className="object-contain"
                    />
                  </Link>
                  <p className="max-w-md text-sm text-slate-200/70 sm:text-base">
                    Intelligent, predictive maintenance tailored for modern properties. We keep every system running
                    smoothly so you can focus on what matters most.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* {socialLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-label={item.name}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:text-white hover:shadow-[0_12px_40px_-16px_rgba(56,189,248,0.7)]"
                      >
                        {item.icon}
                      </Link>
                    ))} */}
                  </div>
                </div>
              </div>
              <div className="mt-8 grid gap-6 text-sm text-slate-200/80 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-white/90">Talk to us</p>
                  <div className="mt-2 space-y-1">
                    <a href="mailto:info@fixnex.ae" className="block transition hover:text-sky-300">
                    info@fixnex.ae
                    </a>
                    <a href="tel:+971585150800" className="block transition hover:text-sky-300">
                      +971 58 515 0800
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white/90">Visit us</p>
                  <p className="mt-2 text-slate-200/70">
                    Office 904, Abraj Center <br />
                    Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
            </div>

            <div className="h-full rounded-2xl border border-white/10 bg-linear-to-br from-white/4 via-white/2 to-transparent p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">Stay in the loop</h3>
              <p className="mt-3 max-w-sm text-sm text-slate-200/70">
                Get curated maintenance strategies, product updates, and exclusive offers straight to your inbox.
              </p>
              <form
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  const submittedEmail = email.trim();

                  if (!submittedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submittedEmail)) {
                    setStatus("error");
                    return;
                  }

                  setEmail(submittedEmail);
                  setStatus("success");
                }}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="name@company.com"
                  name="newsletter-email"
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-slate-300/50 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed disabled:opacity-60"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status !== "idle") {
                      setStatus("idle");
                    }
                  }}
                  disabled={status === "success"}
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-sky-600 via-sky-500 to-blue-500 px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.9)] transition hover:scale-[1.02] hover:shadow-[0_20px_45px_-20px_rgba(59,130,246,1)] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={status === "success"}
                >
                  {status === "success" ? "Subscribed" : "Subscribe"}
                </button>
              </form>
              <p
                className={`mt-3 text-xs ${
                  status === "error" ? "text-rose-300/80" : "text-slate-200/60"
                }`}
              >
                {status === "success"
                  ? "Thanks for subscribing! We'll be in touch soon."
                  : status === "error"
                    ? "Please enter a valid email address to subscribe."
                    : "We respect your privacy. Unsubscribe anytime."}
              </p>
            </div>
          </div>

          {/* <div className="grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-5">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/70">
                  {column.title}
                </h4>
                <ul className="space-y-3 text-sm text-slate-200/70">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-white"
                      >
                        <span className="h-px w-3 bg-white/0 transition group-hover:w-6 group-hover:bg-white/70" aria-hidden="true" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div> */}

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/admin-dashboard" className="transition hover:text-white text-xs">
                Admin Dashboard
              </Link>
            </div>
            <p>© {new Date().getFullYear()} FixNex. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;