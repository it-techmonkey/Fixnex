import Link from "next/link";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import type { LegalPolicy } from "../../legal-policies";

const policyLinks = [
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/service-delivery-parts-delivery-policy", label: "Delivery" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/refund-policy", label: "Refunds" },
];

type LegalPolicyPageProps = {
  policy: LegalPolicy;
};

export default function LegalPolicyPage({ policy }: LegalPolicyPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <Header />

      <main className="relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(59, 130, 246, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(to bottom, black 0%, black 42%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute right-[-18rem] top-20 h-[36rem] w-[36rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute left-[-16rem] top-[32rem] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />

        <section className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-32 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300/80">
                FixNex Legal
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {policy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                {policy.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  Effective date: {policy.effectiveDate}
                </span>
                <a
                  href="mailto:info@fixnex.ae"
                  className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-100 transition hover:border-blue-300/60 hover:bg-blue-500/20"
                >
                  Contact FixNex
                </a>
              </div>
            </div>

            <aside className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Policies
              </p>
              <nav className="mt-4 grid gap-2" aria-label="Legal policies">
                {policyLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        </section>

        <section className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8">
          <nav
            className="hidden self-start rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur lg:sticky lg:top-24 lg:block"
            aria-label={`${policy.title} sections`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              On This Page
            </p>
            <ol className="mt-4 space-y-1">
              {policy.sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#section-${index + 1}`}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8 lg:p-10">
            <div className="space-y-8">
              {policy.sections.map((section, index) => (
                <section
                  key={section.title}
                  id={`section-${index + 1}`}
                  className="scroll-mt-28 border-b border-white/10 pb-8 last:border-b-0 last:pb-0"
                >
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    {index + 1}. {section.title}
                  </h2>
                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets ? (
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" aria-hidden />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
