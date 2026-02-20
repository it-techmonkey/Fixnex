'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'How do I book a service?',
    answer: 'Through our website or WhatsApp AI assistant — no phone calls needed.',
  },
  {
    question: 'What makes FixNex different?',
    answer: 'AI prediction, total transparency, and a truly person-less experience.',
  },
  {
    question: 'Do you cover emergencies?',
    answer: 'Yes. All plans include 24/7 emergency response.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, instantly from your dashboard — no penalties.',
  },
  {
    question: 'How does AI actually help me?',
    answer: 'Our system predicts failures before they happen, preventing expensive damage.',
  },
  {
    question: 'Do you handle commercial buildings?',
    answer: 'Absolutely — we serve offices, warehouses, and full developments.',
  },
  {
    question: 'Is my data safe?',
    answer: 'Yes. FixNex uses encrypted cloud systems hosted in the UAE.',
  },
  {
    question: 'Do I need to talk to anyone to confirm a booking?',
    answer: "No — everything is automated. You'll receive updates digitally.",
  },
  {
    question: 'What if I move to another home?',
    answer: 'Your subscription moves with you — simple and seamless.',
  },
  {
    question: 'How fast is response time?',
    answer: 'Usually within hours. FixNex predicts, plans, and dispatches before you even ask.',
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 text-white">
        <div className="text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-wide text-blue-200/80">Support</p> */}
          <h2 className="my-3 font-['Space_Grotesk'] text-3xl font-medium leading-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          {/* <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-slate-200/70 sm:text-base">
            Still curious? <Link href="/contact" className="underline hover:text-blue-200">Talk to Nex AI</Link> or reach our support
            team for tailored help.
          </p> */}
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl  border-white/10 bg-black/30 bg-gradient-to-r from-stone-950 to-slate-900 shadow-[0_16px_40px_rgba(3,7,18,0.35)] backdrop-blur"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-stone-950 to-slate-900 px-5 py-1 text-left transition hover:bg-white/5 sm:px-6 sm:py-2"
                >
                  <span className="text-base font-medium sm:text-lg ">{faq.question}</span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center  transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19.5 9L12 16.5L4.5 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                {isOpen ? (
                  <div className="border-t border-white/5 bg-gradient-to-r from-stone-800/80 via-slate-700/70 to-slate-800/60 px-5 py-4 text-sm text-slate-200 sm:px-6 sm:py-5 sm:text-base">
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faqs;