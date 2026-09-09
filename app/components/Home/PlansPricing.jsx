'use client';

import { useState } from 'react';
import pricingData from '@/app/db/pricing.json';

const { header, propertyTypes, facilities, plans } = pricingData;

const CheckIcon = ({ muted = false }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="white" strokeOpacity={muted ? '0.3' : '0.8'} />
    {!muted && (
      <path
        d="M5.16675 7.99995L7.05341 9.88661L10.8334 6.11328"
        stroke="white"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    aria-hidden="true"
  >
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatPrice = (value) => {
  if (value === null || value === undefined) return null;
  return `AED ${value.toLocaleString('en-US')}`;
};

const emptyLead = { name: '', email: '', phone: '', message: '' };

const PlansPricing = () => {
  const recommendedId = plans.find((p) => p.recommended)?.id ?? plans[0]?.id;

  const [propertyType, setPropertyType] = useState(propertyTypes[0].id);
  const [openCards, setOpenCards] = useState({ [recommendedId]: true });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState(emptyLead);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedProperty = propertyTypes.find((t) => t.id === propertyType);
  const isEnquiry = selectedPlan?.type === 'enquiry';

  const toggleCard = (planId) => {
    setOpenCards((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

  const handleCtaClick = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormData(emptyLead);
    setSelectedFacilities([]);
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setIsSubmitted(false);
    setFormData(emptyLead);
    setSelectedFacilities([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TODO (Phase 4): send this payload to a real endpoint.
    // Subscription plans -> checkout with recurring monthly mandate.
    // FixMax -> enquiry queue / sales email.
    const payload = {
      planId: selectedPlan?.id,
      planName: selectedPlan?.plan,
      type: selectedPlan?.type,
      propertyType,
      propertyLabel: selectedProperty?.label,
      price: selectedPlan?.prices?.[propertyType] ?? selectedPlan?.priceLabel,
      facilities: isEnquiry ? selectedFacilities : undefined,
      ...formData,
    };
    if (typeof window !== 'undefined') {
      console.info('FixNex plan request', payload);
    }

    setIsSubmitted(true);
    setTimeout(handleCloseModal, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  return (
    <section className="relative w-full flex justify-center bg-black py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="pointer-events-none absolute top-10 left-16 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.32),rgba(37,99,235,0.16),transparent_65%)] blur-[80px] opacity-80 rotate-12 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -left-24 w-[22rem] h-[22rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.36),rgba(37,99,235,0.18),transparent_68%)] blur-[90px] opacity-80 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute top-[55%] right-4 w-[20rem] h-[20rem] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.34),rgba(56,189,248,0.16),transparent_65%)] blur-[95px] opacity-85 animate-glow-slow" aria-hidden />

      <div className="relative w-full max-w-[1200px] px-4 sm:px-6 md:px-8 flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-medium font-['Space_Grotesk'] leading-tight">
            {header.title}
          </h2>
          <p className="text-white/75 text-sm sm:text-base font-light leading-6">{header.subtitle}</p>
          <p className="text-white/45 text-xs sm:text-sm font-light">{header.note}</p>
        </div>

        {/* Step 1 - property type */}
        <div className="w-full flex flex-col gap-3 mt-10 sm:mt-14">
          <span className="text-white/50 text-xs font-medium uppercase tracking-[0.16em]">
            1 &middot; {header.step1Label}
          </span>
          <div
            role="tablist"
            aria-label="Property type"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          >
            {propertyTypes.map((type) => {
              const active = type.id === propertyType;
              return (
                <button
                  key={type.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPropertyType(type.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 cursor-pointer
                    ${active
                      ? 'bg-sky-500/10 outline outline-1 outline-offset-[-1px] outline-sky-400'
                      : 'bg-white/[0.02] outline outline-1 outline-offset-[-1px] outline-white/10 hover:outline-white/25'}
                  `}
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      active ? 'bg-sky-500 border-sky-500' : 'border-white/30'
                    }`}
                  >
                    {active && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-white text-sm font-medium font-['Space_Grotesk'] leading-tight">
                      {type.label}
                    </span>
                    <span className={`text-xs font-normal ${active ? 'text-white/80' : 'text-white/50'}`}>
                      from {formatPrice(type.startingPrice)} / month
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 - plans */}
        <div className="w-full flex flex-col gap-3 mt-10 sm:mt-14">
          <span className="text-white/50 text-xs font-medium uppercase tracking-[0.16em]">
            2 &middot; {header.step2Label}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:items-stretch mt-4 sm:mt-6">
            {plans.map((plan) => {
              const isOpen = !!openCards[plan.id];
              const priceValue = plan.prices?.[propertyType];
              const priceText = plan.priceLabel ?? formatPrice(priceValue);

              return (
                <div
                  key={plan.id}
                  className={`
                    relative flex flex-col rounded-3xl p-5 sm:p-6 transition-all duration-300
                    ${plan.recommended
                      ? 'bg-gradient-to-b from-sky-800/50 to-gray-950/60 outline outline-1 outline-offset-[-1px] outline-sky-500'
                      : 'bg-white/[0.02] outline outline-1 outline-offset-[-1px] outline-white/12'}
                  `}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg">
                      Most popular
                    </div>
                  )}

                  {/* Header row - toggles on mobile only */}
                  <button
                    type="button"
                    onClick={() => toggleCard(plan.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left cursor-pointer md:cursor-default"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white text-lg font-medium font-['Space_Grotesk'] leading-6">
                          {plan.plan}
                        </span>
                        <span className="text-white/55 text-xs font-light leading-5 md:hidden">
                          {plan.mobileSummary}
                        </span>
                        <span className="text-white/55 text-xs font-light leading-5 hidden md:block">
                          {plan.idealFor}
                        </span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-white text-xl sm:text-2xl font-medium font-['Space_Grotesk'] leading-7">
                          {priceText}
                        </span>
                        {plan.type === 'subscription' && (
                          <span className="text-white/55 text-[11px] font-normal font-['Space_Grotesk']">
                            / per {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* mobile-only expand affordance */}
                    <span className="mt-3 inline-flex items-center gap-1 text-sky-400 text-xs font-medium md:hidden">
                      {isOpen ? 'Hide details' : "See what's included"}
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>

                  {/* Body - always visible on md+, toggled on mobile */}
                  <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 gap-4 mt-4`}>
                    <button
                      type="button"
                      onClick={() => handleCtaClick(plan)}
                      data-plan={plan.id}
                      className={`
                        w-full px-4 py-2.5 rounded-xl inline-flex justify-center items-center text-sm font-medium
                        transition-all duration-300 cursor-pointer
                        ${plan.recommended
                          ? 'bg-gradient-to-b from-sky-400 to-blue-500 text-white border border-sky-300/50 shadow-[0_4px_8.7px_0_#000205_inset] hover:from-sky-300 hover:to-blue-400'
                          : 'bg-transparent text-sky-300 border border-sky-400/40 hover:bg-sky-400/10'}
                      `}
                    >
                      {plan.cta}
                    </button>

                    <div className="h-px bg-white/10" />

                    <ul className="flex flex-col gap-2.5">
                      {plan.features.map((feature, i) => (
                        <li key={`f-${i}`} className="flex items-start gap-2.5">
                          <span className="shrink-0 pt-0.5">
                            <CheckIcon />
                          </span>
                          <span className="text-white/80 text-[13px] font-normal font-['Space_Grotesk'] leading-5">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.excluded?.map((feature, i) => (
                        <li key={`x-${i}`} className="flex items-start gap-2.5">
                          <span className="shrink-0 pt-0.5">
                            <CheckIcon muted />
                          </span>
                          <span className="text-white/35 text-[13px] font-normal font-['Space_Grotesk'] leading-5">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs font-light mt-10">
          {header.footnote} &middot; Prices shown for {selectedProperty?.label.toLowerCase()}.
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={handleCloseModal}
        >
          <div
            className={`relative w-full ${isEnquiry ? 'max-w-lg' : 'max-w-md'} max-h-[88vh] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* top accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(56,189,248,0.18),transparent_70%)]" aria-hidden />

            <button
              onClick={handleCloseModal}
              className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
                {/* Header */}
                <div className="relative shrink-0 px-6 sm:px-8 pt-7 pb-5 border-b border-white/[0.08]">
                  <h3 className="text-white text-xl sm:text-2xl font-medium font-['Space_Grotesk'] pr-8">
                    {isEnquiry ? `Request a ${selectedPlan.plan} quote` : `Subscribe to ${selectedPlan.plan}`}
                  </h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-sky-500/10 border border-sky-400/25 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                      {selectedProperty?.label}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/75">
                      {selectedPlan.type === 'subscription' && selectedPlan.prices?.[propertyType]
                        ? `${formatPrice(selectedPlan.prices[propertyType])} / month`
                        : 'Custom quote'}
                    </span>
                  </div>
                  <p className="mt-3 text-white/50 text-xs font-light leading-5">
                    Share a few details and our team will get back to you shortly.
                  </p>
                </div>

                {/* Scrollable body (scrollbar hidden) */}
                <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-6 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {isEnquiry && (
                    <div className="flex flex-col gap-2.5">
                      <span className="text-white/45 text-[11px] font-semibold uppercase tracking-[0.14em]">
                        Facilities present
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {facilities.map((facility) => {
                          const checked = selectedFacilities.includes(facility);
                          return (
                            <button
                              type="button"
                              key={facility}
                              onClick={() => toggleFacility(facility)}
                              aria-pressed={checked}
                              className={`
                                flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-[13px] font-['Space_Grotesk']
                                border transition-all duration-200
                                ${checked
                                  ? 'border-sky-400/70 bg-sky-500/10 text-white'
                                  : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white/90'}
                              `}
                            >
                              <span
                                className={`shrink-0 w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                  checked ? 'bg-sky-400 border-sky-400' : 'border-white/30'
                                }`}
                              >
                                {checked && (
                                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0a0f1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </span>
                              {facility}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <span className="text-white/45 text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Your details
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-white/80 text-[13px] font-medium font-['Space_Grotesk']">
                        Full name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-white/30 text-sm font-['Space_Grotesk'] outline-none transition-all duration-200 focus:bg-white/[0.06] focus:border-sky-400/60 focus:ring-4 focus:ring-sky-500/10 ${
                          errors.name ? 'border-red-500/60' : 'border-white/10'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-400 text-xs font-['Space_Grotesk']">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-white/80 text-[13px] font-medium font-['Space_Grotesk']">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-white/30 text-sm font-['Space_Grotesk'] outline-none transition-all duration-200 focus:bg-white/[0.06] focus:border-sky-400/60 focus:ring-4 focus:ring-sky-500/10 ${
                          errors.email ? 'border-red-500/60' : 'border-white/10'
                        }`}
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs font-['Space_Grotesk']">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-white/80 text-[13px] font-medium font-['Space_Grotesk']">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-white/30 text-sm font-['Space_Grotesk'] outline-none transition-all duration-200 focus:bg-white/[0.06] focus:border-sky-400/60 focus:ring-4 focus:ring-sky-500/10 ${
                          errors.phone ? 'border-red-500/60' : 'border-white/10'
                        }`}
                        placeholder="+971 50 000 0000"
                      />
                      {errors.phone && <p className="text-red-400 text-xs font-['Space_Grotesk']">{errors.phone}</p>}
                    </div>

                    {isEnquiry && (
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="message" className="text-white/80 text-[13px] font-medium font-['Space_Grotesk']">
                          Anything else? <span className="text-white/35 font-normal">(optional)</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm font-['Space_Grotesk'] outline-none transition-all duration-200 focus:bg-white/[0.06] focus:border-sky-400/60 focus:ring-4 focus:ring-sky-500/10 resize-none"
                          placeholder="Tell us about your property"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-[#0a0f1f]">
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-b from-sky-400 to-blue-500 text-white text-sm font-semibold font-['Space_Grotesk'] border border-sky-300/50 shadow-[0_4px_8.7px_0_#000205_inset] hover:from-sky-300 hover:to-blue-400 hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-200 cursor-pointer"
                  >
                    {isEnquiry ? 'Send enquiry' : 'Continue'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-8 py-12">
                <div className="mb-5">
                  <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    <circle cx="32" cy="32" r="30" stroke="rgb(56, 189, 248)" strokeWidth="2" strokeOpacity="0.85" />
                    <path d="M20 32L28 40L44 24" stroke="rgb(56, 189, 248)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-white text-2xl font-medium font-['Space_Grotesk'] mb-2.5">Thank you!</h3>
                <p className="text-white/70 text-sm font-light font-['Space_Grotesk'] leading-6 max-w-xs">
                  Our team will reach out to you shortly about your {selectedPlan.plan} request.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PlansPricing;
