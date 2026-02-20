'use client';

import { useRef, useEffect, useState } from 'react';
import pricingData from '@/app/db/pricing.json';

const PlansPricing = () => {
  const scrollContainerRef = useRef(null);
  const middleCardRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const centerMiddleCard = () => {
      // Only center on mobile screens (below md breakpoint)
      if (window.innerWidth >= 768) return;
      
      if (scrollContainerRef.current && middleCardRef.current) {
        const container = scrollContainerRef.current;
        const card = middleCardRef.current;
        
        // Calculate scroll position to center the middle card
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        // Center the card: card position - half container width + half card width
        const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    };

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(centerMiddleCard, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '' });
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
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      // For now, we'll just show the success message
      setIsSubmitted(true);
      
      // Optional: Reset form after 3 seconds and close modal
      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <section className="w-full flex justify-center items-center bg-black py-12 sm:py-16 md:py-20">
            {/* <div className="pointer-events-none absolute -top-24 -right-20 w-[28rem] h-[28rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.55),rgba(14,165,233,0.28),transparent_68%)] blur-[90px] opacity-95 animate-glow-slow" aria-hidden /> */}
      <div className="pointer-events-none absolute top-10 left-16 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38),rgba(37,99,235,0.2),transparent_65%)] blur-[70px] opacity-85 rotate-12 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.42),rgba(59,130,246,0.22),transparent_68%)] blur-[70px] opacity-85 -translate-x-1/2 -translate-y-1/2 animate-glow-fast" aria-hidden />
      <div className="pointer-events-none absolute top-[48%] right-1/3 w-44 h-44 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.4),rgba(14,165,233,0.22),transparent_65%)] blur-[65px] opacity-80 translate-x-1/3 -translate-y-1/2 animate-glow-fast" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -left-24 w-[22rem] h-[22rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.45),rgba(37,99,235,0.22),transparent_68%)] blur-[80px] opacity-90 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-60 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.42),rgba(59,130,246,0.22),transparent_60%)] blur-[70px] opacity-85 animate-glow-slow" aria-hidden />
      <div className="pointer-events-none absolute top-[60%] right-10 w-[20rem] h-[20rem] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.42),rgba(56,189,248,0.2),transparent_65%)] blur-[85px] opacity-95 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 -left-14 w-[19rem] h-[19rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.36),rgba(14,165,233,0.18),transparent_68%)] blur-[90px] opacity-85 animate-glow-slow" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 w-[24rem] h-[24rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.34),rgba(37,99,235,0.18),transparent_65%)] blur-[110px] opacity-85 animate-glow-medium" aria-hidden />
      {/* <div className="pointer-events-none absolute -bottom-28 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38),rgba(37,99,235,0.18),transparent_65%)] blur-[95px] opacity-90 animate-glow-slow" aria-hidden /> */}
      <div className="w-full max-w-[1264px] px-4 sm:px-6 md:px-8 flex flex-col items-center gap-12 sm:gap-16 md:gap-20">
        
        {/* Header Section */}
        <div className="self-stretch flex flex-col items-center gap-4 sm:gap-6">
          <div className="self-stretch flex flex-col gap-2">
            <div className="text-center text-white text-2xl sm:text-3xl md:text-4xl font-medium font-['Space_Grotesk'] leading-tight sm:leading-[55.20px]">
              Plans and Pricing
            </div>
            <div className="text-center text-white text-sm sm:text-base md:text-lg font-light leading-6 sm:leading-7 tracking-tight px-2">
              Whether it's a villa, apartment, office, or entire building, FixNex delivers full-spectrum
              <br className="hidden sm:block"/>
              maintenance powered by AI prediction and real-time monitoring.
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex flex-nowrap md:flex-wrap md:justify-center h-[800px] items-center gap-4 md:gap-16 px-4 md:px-0 min-w-max md:min-w-0">
            {pricingData.map((plan, index) => (
              <div 
                key={index}
                ref={index === 1 ? middleCardRef : null}
                className={`
                  ${index === 1 ? 'h-[568px] p-5 bg-gradient-to-b from-sky-700/70 to-gray-950/70 rounded-3xl outline outline-1 outline-offset-[-1px] outline-blue-500 md:scale-105' : 'h-[469px] p-4 bg-gradient-to-b from-slate-950/20 to-gray-950/20 rounded-[19.82px] outline outline-[0.83px] outline-offset-[-0.83px] outline-blue-500'}
                  inline-flex flex-col justify-start items-start gap-8 hover:scale-110 transition-all duration-300 relative
                  flex-shrink-0 w-[300px] md:w-auto snap-center
                `}
              >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="self-stretch flex flex-col gap-4">
                <div className={`${index === 1 ? 'w-full md:w-60' : 'w-full md:w-52'} flex flex-col gap-8`}>
                  {/* Plan Name & Description */}
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col gap-1">
                      <div className={`text-white ${index === 1 ? 'text-lg sm:text-xl' : 'text-base'} font-medium font-['Space_Grotesk'] ${index === 1 ? 'leading-6 sm:leading-7' : 'leading-6'}`}>
                        {plan.plan}
                      </div>
                      <div className={`text-white/80 ${index === 1 ? 'text-sm leading-5' : 'text-xs leading-4'} font-light`}>
                        {plan.idealFor}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="self-stretch inline-flex items-end gap-1">
                    <div className={`text-white text-2xl sm:text-3xl font-medium font-['Space_Grotesk'] ${index === 1 ? 'leading-10 sm:leading-[56px]' : 'leading-10'}`}>
                      AED {plan.price}
                    </div>
                    <div className="py-1.5 flex justify-center items-center gap-2">
                      <div className={`text-white/80 ${index === 1 ? 'text-sm leading-6' : 'text-xs leading-5'} font-normal font-['Space_Grotesk']`}>
                        / per {plan.period}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Get Started Button */}
                <button 
                  onClick={() => handleGetStarted(plan)}
                  className={`
                    ${index === 1 
                      ? 'w-full md:w-72 px-3.5 py-3 bg-gradient-to-b from-sky-400 to-blue-500 rounded-xl border border-sky-300/50 shadow-[0_4px_8.7px_0_#000205_inset] outline outline-1 outline-offset-[-1px] outline-sky-300/50' 
                      : 'w-full md:w-60 px-3 py-2.5 bg-gradient-to-b from-sky-500/90 to-blue-500/90 rounded-[9.91px] border border-sky-300/40 shadow-[0_4px_8.7px_0_#000205_inset] outline outline-[0.83px] outline-offset-[-0.83px] outline-sky-300/40'
                    }
                    inline-flex justify-center items-center gap-2 overflow-hidden
                    hover:scale-105 hover:shadow-xl hover:shadow-sky-400/30 hover:from-sky-300 hover:to-blue-400 transition-all duration-300 cursor-pointer
                  `}
                >
                  <div className={`text-white ${index === 1 ? 'text-sm leading-5' : 'text-xs leading-4'} font-medium`}>
                    Get Started
                  </div>
                </button>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="inline-flex items-center gap-2">
                    {/* Check Icon */}
                    <div className="relative shrink-0">
                      <svg 
                        width={index === 1 ? "16" : "14"} 
                        height={index === 1 ? "16" : "14"} 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M12.7134 3.29997C15.3601 5.94664 15.3134 10.2666 12.58 12.8599C10.0534 15.2533 5.95339 15.2533 3.42006 12.8599C0.680056 10.2666 0.633382 5.94664 3.28671 3.29997C5.88671 0.693304 10.1134 0.693304 12.7134 3.29997Z" 
                          stroke="white" 
                          strokeOpacity="0.8" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M5.16675 7.99995L7.05341 9.88661L10.8334 6.11328" 
                          stroke="white" 
                          strokeOpacity="0.8" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    
                    {/* Feature Text */}
                    <div className={`text-white/80 ${index === 1 ? 'text-sm leading-5' : 'text-xs leading-5'} font-normal font-['Space_Grotesk']`}>
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Additional Info / FAQ Link */}
        <div className="text-center">
          {/* <p className="text-white/60 text-sm font-['Poppins'] mb-4">
            All plans include basic maintenance coverage. Upgrade or downgrade anytime.
          </p> */}
          {/* <button className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold font-['Space_Grotesk'] underline transition-colors">
            Compare plans in detail →
          </button> */}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-md bg-gradient-to-b from-slate-950/95 to-gray-950/95 rounded-3xl outline outline-1 outline-blue-500/50 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                {/* Modal Header */}
                <div className="mb-6">
                  <h2 className="text-white text-2xl sm:text-3xl font-medium font-['Space_Grotesk'] mb-2">
                    Get Started with {selectedPlan?.plan}
                  </h2>
                  <p className="text-white/70 text-sm font-light">
                    Fill in your details and our team will reach out to you shortly.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name Field */}
                  <div className="flex flex-col gap-2">
                    <label 
                      htmlFor="name" 
                      className="text-white/90 text-sm font-medium font-['Space_Grotesk']"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 bg-slate-900/50 border rounded-xl
                        text-white placeholder-white/40 font-['Space_Grotesk']
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                        transition-all duration-300
                        ${errors.name ? 'border-red-500/50' : 'border-white/20'}
                      `}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs font-['Space_Grotesk']">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label 
                      htmlFor="email" 
                      className="text-white/90 text-sm font-medium font-['Space_Grotesk']"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 bg-slate-900/50 border rounded-xl
                        text-white placeholder-white/40 font-['Space_Grotesk']
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                        transition-all duration-300
                        ${errors.email ? 'border-red-500/50' : 'border-white/20'}
                      `}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs font-['Space_Grotesk']">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="flex flex-col gap-2">
                    <label 
                      htmlFor="phone" 
                      className="text-white/90 text-sm font-medium font-['Space_Grotesk']"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 bg-slate-900/50 border rounded-xl
                        text-white placeholder-white/40 font-['Space_Grotesk']
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                        transition-all duration-300
                        ${errors.phone ? 'border-red-500/50' : 'border-white/20'}
                      `}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs font-['Space_Grotesk']">{errors.phone}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 px-6 py-3.5 bg-gradient-to-b from-blue-500 to-sky-800 rounded-xl 
                             text-white text-sm font-medium font-['Space_Grotesk']
                             hover:scale-105 hover:shadow-xl transition-all duration-300
                             shadow-[inset_0px_0px_1px_2px_rgba(0,0,0,0.15)] outline outline-1 outline-offset-[-1px] outline-blue-500/50"
                  >
                    Submit
                  </button>
                </form>
              </>
            ) : (
              /* Success Message */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-6">
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto"
                  >
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="30" 
                      stroke="rgb(59, 130, 246)" 
                      strokeWidth="2" 
                      strokeOpacity="0.8"
                    />
                    <path 
                      d="M20 32L28 40L44 24" 
                      stroke="rgb(59, 130, 246)" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-white text-2xl font-medium font-['Space_Grotesk'] mb-3">
                  Thank You!
                </h3>
                <p className="text-white/80 text-base font-light font-['Space_Grotesk'] leading-6">
                  Our team will reach out to you shortly.
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
