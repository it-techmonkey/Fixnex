"use client";

import { MouseEvent, useCallback, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import Hero_background from "./components/Home/Hero_background";
import Header from "./components/layout/Header";

// Lazy load below-the-fold components for faster initial render
const CoreServices = dynamic(() => import("./components/Home/CoreServices"), {
  loading: () => <div className="min-h-[400px]" />,
});
const PlansPricing = dynamic(() => import("./components/Home/PlansPricing"), {
  loading: () => <div className="min-h-[400px]" />,
});
const Faqs = dynamic(() => import("./components/Home/Faqs"), {
  loading: () => <div className="min-h-[200px]" />,
});
const Footer = dynamic(() => import("./components/layout/Footer"), {
  loading: () => <div className="min-h-[200px]" />,
});
const Feedback = dynamic(() => import("./components/Home/feedback"), {
  loading: () => <div className="min-h-[200px]" />,
});


// Memoized Hero Section Content with optimized class name memoization
const HeroContent = memo(({ handlePlansScroll, handleCoreServicesScroll }: {
  handlePlansScroll: (e: MouseEvent<HTMLAnchorElement>) => void;
  handleCoreServicesScroll: (e: MouseEvent<HTMLAnchorElement>) => void;
}) => {
  // Memoize heading class name concatenation
  const headingClass = useMemo(() => 
    `text-center font-heading pt-16 sm:pt-12 md:pt-8 lg:pt-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium bg-[linear-gradient(90deg,#FFF_0%,#E8E8E8_100%)] bg-clip-text text-transparent max-w-6xl px-2`,
    []
  );

  // Memoize description class name concatenation
  const descriptionClass = useMemo(() =>
    `sm:text-center w-full sm:w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] font-sans text-sm sm:text-base md:text-lg font-normal text-[#DEDEDE] max-w-4xl px-2 text-justify py-4`,
    []
  );

  // Memoize CTA container class name concatenation
  const ctaClass = useMemo(() =>
    `flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto px-4`,
    []
  );

  // Memoize button class names to avoid recreation
  const explorePlansClass = useMemo(() =>
    "w-40 sm:w-auto flex justify-center items-center py-2.5 sm:py-3 px-5 sm:px-6 text-white text-sm sm:text-base rounded-xl border border-[#2058C1] bg-[linear-gradient(170deg,#000_16%,#004DA7_82.58%)] shadow-[0_4px_8.7px_0_#000205_inset] hover:scale-105 transition-transform",
    []
  );

  const bookAFixClass = useMemo(() =>
    "Frame48098831 w-42 sm:w-44 px-5 sm:px-6 py-2.5 sm:py-3.5 bg-[#0000006c] rounded-xl shadow-[inset_0px_4px_8.699999809265137px_0px_rgba(0,56,122,1.00)] outline outline-1 outline-offset-[-1px] outline-blue-700 inline-flex justify-center items-center gap-2.5 transition-transform hover:scale-105",
    []
  );

  return (
    <>
      <div className={headingClass}>The Future of Maintenance Has Arrived</div>
      <div className={descriptionClass}>
        FixNex is the smart way to maintain your property.
        We use AI monitoring, smart sensors, and a skilled technical team to protect and maintain apartments, villas, and full buildings. From predicting issues before they happen to delivering fast, reliable fixes, FixNex gives you a fully managed maintenance experience — simple, proactive, and worry-free.
      </div>
      <div className={ctaClass}>
        <Link
          href="#plans-pricing"
          onClick={handlePlansScroll}
          className={explorePlansClass}
        >
          Explore Plans
        </Link>
        <Link
          href="#core-services"
          onClick={handleCoreServicesScroll}
          className={bookAFixClass}
        >
          <span data-layer="Book a Fix" className="BookAFix justify-start text-white text-sm sm:text-base font-normal font-['Inter'] leading-5">
            Book a Fix
          </span>
        </Link>
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for HeroContent memoization
  return (
    prevProps.handlePlansScroll === nextProps.handlePlansScroll &&
    prevProps.handleCoreServicesScroll === nextProps.handleCoreServicesScroll
  );
});

HeroContent.displayName = "HeroContent";

export default function Home() {

  const handlePlansScroll = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById("plans-pricing");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "plans-pricing";
    }
  }, []);

  const handleCoreServicesScroll = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById("core-services");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "core-services";
    }
  }, []);

  return (
    <div className="w-full h-full bg-black overflow-x-hidden overflow-y-hidden">
        <Header />
        <section className="relative h-full min-h-screen z-30 flex items-center justify-center flex-col gap-4 sm:gap-6 md:gap-8 w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <Hero_background />
          <HeroContent 
            handlePlansScroll={handlePlansScroll}
            handleCoreServicesScroll={handleCoreServicesScroll}
          />
        </section>

        <div className="w-full bg-black min-h-screen py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
          <div className="self-stretch text-center justify-start text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium font-['Space_Grotesk'] mb-4 sm:mb-6 md:mb-8 -mt-20 px-2">
          Find Your Service with Nex AI
          </div>
          <div className="self-stretch text-center justify-start text-white text-sm sm:text-base md:text-lg font-light leading-6 sm:leading-7 tracking-wider w-full sm:w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto max-w-4xl px-2">
          Whether it's a villa, apartment, office, or entire building, FixNex delivers full-spectrum maintenance powered by AI prediction and real-time monitoring.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-6 sm:mt-8 md:mt-10 gap-3 sm:gap-4 md:gap-5 px-4">
          <Link href="/chat" className=" sm:w-auto flex justify-center items-center py-2.5 sm:py-3 px-5 sm:px-6 text-white text-sm sm:text-base rounded-xl border border-[#2058C1] bg-[linear-gradient(170deg,#000_16%,#004DA7_82.58%)] shadow-[0_4px_8.7px_0_#000205_inset] hover:scale-105 transition-transform">Explore Nex AI</Link>
          </div>
  
        {/*Three Cards*/}
        <div data-layer="Frame 48098893" className="Frame48098893 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8 lg:gap-10 mt-8 sm:mt-10 md:mt-12 lg:mt-16 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Card 1 */}
          <div className="group w-full max-w-md mx-auto sm:max-w-none h-80 flex flex-col justify-center items-center bg-slate-950 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 ">
            <div className="w-full max-w-[22rem] h-44 justify-self-center flex justify-center items-center mt-5 bg-slate-950 rounded-xl border border-white/10 overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <div data-svg-wrapper className="Vector absolute transition-opacity duration-300 group-hover:opacity-80">
                <svg width="365" height="175" viewBox="0 0 365 175" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-full">
                <path d="M139.294 178.526H247.158M-30.8366 -8.79659L-30.8366 217M-16.4547 -8.79659L-16.4547 217M-2.07292 -8.79659L-2.07293 217M12.3089 -8.79659L12.3089 217M26.6907 -8.79659L26.6907 217M41.0726 -8.79659L41.0725 217M55.4544 -8.79659L55.4544 217M69.8362 -8.79659L69.8362 217M84.218 -8.79659L84.218 217M-31 208.012H414.837M98.5999 -8.79659L98.5998 217M-31 194.137H414.837M112.982 -8.79659L112.982 217M-31 180.261H414.837M127.364 -8.79659L127.363 217M-31 166.385H414.837M141.745 -8.79659L141.745 217M-31 152.509H414.837M156.127 -8.79659L156.127 217M-31 138.633H414.837M170.509 -8.79659L170.509 217M-31 124.758H414.837M184.891 -8.79659L184.891 217M-31 110.882H414.837M199.273 -8.79659L199.273 217M-31 97.0061H414.837M213.654 -8.79659L213.654 217M-31 83.1304H414.837M228.036 -8.79659L228.036 217M-31 69.2546H414.837M242.418 -8.79659L242.418 217M-31 55.3788H414.837M256.8 -8.79659L256.8 217M-31 41.5031H414.837M271.182 -8.79659L271.182 217M-31 27.6273H414.837M285.564 -8.79659L285.564 217M-31 13.7515H414.837M299.945 -8.79659L299.945 217M-31 -0.124232H414.837M314.327 -8.79659V217M-31 -14L414.837 -14M328.709 -8.79659V217M343.091 -8.79659V217M357.473 -8.79659V217M371.855 -8.79659V217M386.236 -8.79659V217M400.618 -8.79659V217M415 -8.79659V217" stroke="url(#paint0_radial_1_8378)" strokeWidth="0.888544"/>
                <defs>
                <radialGradient id="paint0_radial_1_8378" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(192 87.7913) rotate(90) scale(129.209 249.468)">
                <stop stopColor="white" stopOpacity="0.12"/>
                <stop offset="0.6" stopColor="white" stopOpacity="0"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
              <div className="Frame48098892 max-w-[16rem] sm:max-w-[18rem] p-3 sm:p-3.5 absolute bg-white/10 rounded-xl inline-flex justify-center items-center gap-2.5 transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:-translate-y-1">
                <div className="justify-start text-white text-xs sm:text-sm font-medium leading-5 tracking-tight">I want a Cleaning Service on 5th July at Business Bay</div>
              </div>
              <div className="Rectangle31 w-44 h-14 absolute bg-blue-500/60 blur-3xl transition-opacity duration-300 group-hover:bg-blue-400/70 group-hover:opacity-80" />
              <div className="Rectangle32 w-44 h-14 absolute bg-blue-700/60 blur-3xl transition-opacity duration-300 group-hover:bg-blue-600/70 group-hover:opacity-80" />
              </div>
            <div className="Frame48098901 w-full max-w-[22rem]  mt-5 px-4 flex flex-col justify-center items-center transition-all duration-300 group-hover:translate-y-1">
              <div className="self-stretch justify-start text-white text-base sm:text-lg font-normal leading-6 tracking-tight">Describe Your Problem</div>
              <div className="self-stretch justify-start text-stone-400 text-sm sm:text-base leading-6 tracking-tight">Just type your requirements FIN AI instantly recommends the best service for you.</div>
            </div>
          </div>
          {/* Card 2 */}
          
          <div data-property-1="1" className="Component11 group w-full max-w-md mx-auto sm:max-w-none h-80 relative flex flex-col justify-center items-center bg-slate-950 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className=" w-full max-w-[22rem] h-44 justify-self-center flex justify-center items-center mt-5 bg-slate-950 rounded-xl border border-white/10 overflow-hidden transition-transform duration-300 group-hover:scale-105 -translate-y-1">
              <div className="Rectangle31 w-44 h-14 left-[152px] top-[66px] absolute bg-blue-500/60 blur-3xl transition-opacity duration-300 group-hover:bg-blue-400/70 group-hover:opacity-80" />
              <div className="Rectangle32 w-44 h-14 left-[-22px] top-[-2px] absolute bg-blue-700/60 blur-3xl transition-opacity duration-300 group-hover:bg-blue-600/70 group-hover:opacity-80" />
              <div data-layer="Frame 48098898" className="Frame48098898 w-32 h-10 p-2.5 left-[115px] top-[68px] absolute bg-gradient-to-b from-blue-500 to-sky-800 rounded-[20px] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.61)] blur-sm inline-flex justify-center items-center gap-2.5 transition-all duration-300 hover:from-blue-600 hover:to-sky-900 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 hover:-translate-y-0.5">
                <div data-layer="Book Now" className="BookNow justify-start text-white text-sm font-medium font-['Poppins'] leading-4 tracking-tight">Book Now</div>
              </div>
              <Link href="/services" className="Frame48098897 w-32 h-10 p-2.5 left-[115px] top-[68px] absolute bg-gradient-to-b from-blue-500 to-sky-800 rounded-[20px] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.61)] inline-flex justify-center items-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-115 hover:-translate-y-0.5 cursor-pointer z-10">
                <div data-layer="Book Now" className="BookNow justify-start text-white text-sm font-medium font-['Poppins'] leading-4 tracking-tight">Book Now</div>
              </Link>
              <div data-svg-wrapper data-layer="Vector 5" className="Vector5 left-[115px] top-[-2px] absolute">
                <svg width="1" height="175" viewBox="0 0 1 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.500008 188C0.500008 178.44 0.500003 57.3501 0.5 -2" stroke="url(#paint0_linear_195_325)" strokeOpacity="0.13"/>
                <defs>
                <linearGradient id="paint0_linear_195_325" x1="1" y1="-2" x2="1.00001" y2="188" gradientUnits="userSpaceOnUse">
                <stop stopColor="#707070"/>
                <stop offset="1" stopColor="#999999"/>
                </linearGradient>
                </defs>
              </svg>
            </div>
              <div data-svg-wrapper data-layer="Vector 7" className="Vector7 left-[251px] top-0 absolute">
                <svg width="1" height="175" viewBox="0 0 1 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.500008 190C0.500008 180.44 0.500003 59.3501 0.5 0" stroke="url(#paint0_linear_195_326)" strokeOpacity="0.13"/>
                <defs>
                <linearGradient id="paint0_linear_195_326" x1="1" y1="-2.18557e-08" x2="1.00001" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#707070"/>
                <stop offset="1" stopColor="#999999"/>
                </linearGradient>
                </defs>
                </svg>
                </div>
              <div data-svg-wrapper data-layer="Vector 6" className="Vector6 left-0 top-[107px] absolute">
                <svg width="365" height="1" viewBox="0 0 365 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M379 0.500033C359.931 0.500031 118.388 0.50001 0 0.5" stroke="url(#paint0_linear_195_327)" strokeOpacity="0.13"/>
                <defs>
                <linearGradient id="paint0_linear_195_327" x1="4.37114e-08" y1="0" x2="379" y2="3.31332e-05" gradientUnits="userSpaceOnUse">
                <stop stopColor="#707070"/>
                <stop offset="1" stopColor="#999999"/>
                </linearGradient>
                </defs>
                </svg>
              </div>
              <div data-svg-wrapper data-layer="Vector 8" className="Vector8 left-0 top-[68px] absolute">
                <svg width="365" height="1" viewBox="0 0 365 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M379 0.500033C359.931 0.500031 118.388 0.50001 0 0.5" stroke="url(#paint0_linear_195_328)" strokeOpacity="0.13"/>
                <defs>
                <linearGradient id="paint0_linear_195_328" x1="4.37114e-08" y1="0" x2="379" y2="3.31332e-05" gradientUnits="userSpaceOnUse">
                <stop stopColor="#707070"/>
                <stop offset="1" stopColor="#999999"/>
                </linearGradient>
                </defs>
                </svg>
              </div>
            </div>
            <div  className="w-full max-w-[22rem]  mt-5 px-4 flex flex-col justify-center items-center transition-all duration-300 group-hover:translate-y-1">
              <div className="self-stretch justify-start text-white text-base sm:text-lg font-normal leading-6 tracking-tight">Confirm Your Service</div>
              <div className="self-stretch justify-start text-stone-400 text-sm sm:text-base font-normal leading-6 tracking-tight">Provide a few quick details and lock in your service selection.</div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="roup w-full max-w-md mx-auto sm:max-w-none h-90 px- sm:h-80 relative flex flex-col justify-center items-center bg-slate-950 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="w-full max-w-[22rem] h-44 justify-self-center flex justify-center items-center mt-5 bg-slate-950 rounded-xl border border-white/10 overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <div data-svg-wrapper className="flex justify-center items-center absolute transition-opacity duration-300 group-hover:opacity-80">
                <svg width="365" height="175" viewBox="0 0 365 175" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M139.294 170.526H247.158M-30.8366 -16.7966L-30.8366 209M-16.4547 -16.7966L-16.4547 209M-2.07292 -16.7966L-2.07293 209M12.3089 -16.7966L12.3089 209M26.6907 -16.7966L26.6907 209M41.0726 -16.7966L41.0725 209M55.4544 -16.7966L55.4544 209M69.8362 -16.7966L69.8362 209M84.218 -16.7966L84.218 209M-31 200.012H414.837M98.5999 -16.7966L98.5998 209M-31 186.137H414.837M112.982 -16.7966L112.982 209M-31 172.261H414.837M127.364 -16.7966L127.363 209M-31 158.385H414.837M141.745 -16.7966L141.745 209M-31 144.509H414.837M156.127 -16.7966L156.127 209M-31 130.633H414.837M170.509 -16.7966L170.509 209M-31 116.758H414.837M184.891 -16.7966L184.891 209M-31 102.882H414.837M199.273 -16.7966L199.273 209M-31 89.0061H414.837M213.654 -16.7966L213.654 209M-31 75.1304H414.837M228.036 -16.7966L228.036 209M-31 61.2546H414.837M242.418 -16.7966L242.418 209M-31 47.3788H414.837M256.8 -16.7966L256.8 209M-31 33.5031H414.837M271.182 -16.7966L271.182 209M-31 19.6273H414.837M285.564 -16.7966L285.564 209M-31 5.75154H414.837M299.945 -16.7966L299.945 209M-31 -8.12423H414.837M314.327 -16.7966V209M-31 -22L414.837 -22M328.709 -16.7966V209M343.091 -16.7966V209M357.473 -16.7966V209M371.855 -16.7966V209M386.236 -16.7966V209M400.618 -16.7966V209M415 -16.7966V209" stroke="url(#paint0_radial_1_1250)" strokeWidth="0.888544"/>
                <defs>
                <radialGradient id="paint0_radial_1_1250" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(192 79.7913) rotate(90) scale(129.209 249.468)">
                <stop stopColor="white" stopOpacity="0.41"/>
                <stop offset="0.6" stopColor="white" stopOpacity="0"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <div className="relative">
              <Image 
                src="/serviceaed.png" 
                alt="Service AED" 
                width={365}
                height={175}
                className="w-full h-auto object-contain transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/60 active:scale-105 active:-translate-y-1 active:shadow-xl active:shadow-blue-500/40 rounded-23"
                loading="lazy"
                priority={false}
              />
            </div>

              <div className="Rectangle31 w-44 h-14 absolute right-4 top-16 bg-blue-500/60 blur-3xl transition-opacity duration-300 group-hover:bg-blue-400/70 group-hover:opacity-80" />
              <div className="Rectangle32 w-44 h-14 absolute left-0 top-0 bg-blue-700/60 blur-3xl transition-opacity duration-300 group-hover:bg-blue-600/70 group-hover:opacity-80" />
              </div>
            <div className="w-full max-w-[22rem] px-4 flex flex-col justify-center items-center mt-5 bg-slate-950 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <div className="self-stretch justify-start text-white text-base sm:text-lg font-normal leading-6 tracking-tight">Make the Payment</div>
              <div className="self-stretch justify-start text-stone-400 text-sm sm:text-base font-normal leading-6 tracking-tight">Complete your booking payment and that's it! Your service is confirmed.</div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Our Core services */}
          <div id="core-services">
            <CoreServices/>
          </div>
          <div className="bg-black flex justify-center items-center">
          <div id="plans-pricing" className="w-full">
            <PlansPricing/>
          </div>
          </div>
  
          
          <div className="bg-black flex justify-center items-center px-4 sm:px-6 md:px-8">
          <div data-layer="Frame 48099006" className="Frame48099006 w-full max-w-7xl flex flex-col lg:flex-row justify-start items-start lg:items-center gap-6 sm:gap-8 lg:gap-12 py-8 sm:py-12 md:py-16">
              <div data-layer="Frame 48099005" className="Frame48099005 w-full lg:w-auto flex-1 inline-flex flex-col justify-start items-start gap-4 sm:gap-5 md:gap-7">
                <div data-layer="Frame 48099004" className="Frame48099004 px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-900/20 rounded-[20px] inline-flex justify-center items-center gap-2.5">
                  <div data-layer="Careers" className="Careers justify-start text-white text-xs sm:text-sm md:text-base font-normal leading-5">Careers</div>
                </div>
                <div data-layer="Join the Future of Fixing" className="w-full justify-start"><span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium font-['Space_Grotesk'] leading-tight">Join the Future of Fixing<br/></span><span className="text-white text-sm sm:text-base md:text-lg font-light leading-6 md:leading-7 tracking-tight"><br/> We're building the UAE's smartest maintenance network — and we're hiring visionaries. If you're a skilled technician, engineer, or innovator ready to redefine property services, FixNex is where you belong.<br/><br/></span><span className="text-white text-sm sm:text-base md:text-lg font-bold leading-6 md:leading-7 tracking-tight"> Apply: </span><span className="text-white text-sm sm:text-base md:text-lg font-bold underline leading-6 md:leading-7 tracking-tight hover:text-blue-400 transition-colors cursor-pointer">careers@fixnex.ae<br/></span></div>
              </div>
              <Image 
                data-layer="Rectangle 51" 
                className="Rectangle51 w-full lg:w-auto lg:max-w-md xl:max-w-lg 2xl:max-w-[536px] h-56 sm:h-64 md:h-80 lg:h-96 rounded-xl object-cover" 
                src="/fridge.png" 
                alt="Careers"
                width={536}
                height={384}
                loading="lazy"
                priority={false}
              />
            </div>
  
          </div>
  
          <div className="bg-black w-full flex flex-col justify-center items-center px-4 md:px-6">
            <Feedback/>
            <Faqs/>
          </div>
          <div className="bg-black w-full h-fit flex justify-center items-center px-4 md:px-6">
            <Footer/>
          </div>
    </div>
  );
}
