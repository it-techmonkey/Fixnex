'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Icons from '@/app/components/icons';
import serviceData from '@/app/db/service.json';
import { slugify } from '@/app/utils/slugify';
import { getServiceImage } from '@/app/services/service-images';

interface SelectedService {
  name: string;
  member_price: number | string;
  normal_price: number | string;
  categoryIndex: number;
}

const CoreServices = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const openCategoryDetails = (index: number) => {
    setSelectedCategory(index);
    // Scroll to the section where modal appears
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  const closeCategoryDetails = () => {
    setSelectedCategory(null);
    setSelectedService(null);
  };

  const handleServiceClick = (service: { name: string; member_price: number | string; normal_price: number | string }, categoryIndex: number) => {
    setSelectedService({
      name: service.name,
      member_price: service.member_price,
      normal_price: service.normal_price,
      categoryIndex
    });
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const navigateToService = () => {
    if (selectedService) {
      const slug = slugify(selectedService.name);
      router.push(`/services/${slug}`);
    }
  };

  return (
    <>
      <section ref={sectionRef} className="w-full flex justify-center items-center bg-black py-12 sm:py-16 md:py-20 relative overflow-hidden -mt-10">
      {/* <div className="pointer-events-none absolute -top-24 -right-20 w-[28rem] h-[28rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.55),rgba(14,165,233,0.28),transparent_68%)] blur-[90px] opacity-95 animate-glow-slow" aria-hidden /> */}
      <div className="pointer-events-none absolute top-10 left-16 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38),rgba(37,99,235,0.2),transparent_65%)] blur-[70px] opacity-85 rotate-12 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.42),rgba(59,130,246,0.22),transparent_68%)] blur-[70px] opacity-85 -translate-x-1/2 -translate-y-1/2 animate-glow-fast" aria-hidden />
      <div className="pointer-events-none absolute top-[48%] right-1/3 w-44 h-44 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.4),rgba(14,165,233,0.22),transparent_65%)] blur-[65px] opacity-80 translate-x-1/3 -translate-y-1/2 animate-glow-fast" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -left-24 w-[22rem] h-[22rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.45),rgba(37,99,235,0.22),transparent_68%)] blur-[80px] opacity-90 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-60 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.42),rgba(59,130,246,0.22),transparent_60%)] blur-[70px] opacity-85 animate-glow-slow" aria-hidden />
      <div className="pointer-events-none absolute top-[60%] right-10 w-[20rem] h-[20rem] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.42),rgba(56,189,248,0.2),transparent_65%)] blur-[85px] opacity-95 animate-glow-medium" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 -left-14 w-[19rem] h-[19rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.36),rgba(14,165,233,0.18),transparent_68%)] blur-[90px] opacity-85 animate-glow-slow" aria-hidden />
      {/* <div className="pointer-events-none absolute -bottom-32 right-1/4 w-[24rem] h-[24rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.34),rgba(37,99,235,0.18),transparent_65%)] blur-[110px] opacity-85 animate-glow-medium" aria-hidden /> */}
      {/* <div className="pointer-events-none absolute -bottom-28 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38),rgba(37,99,235,0.18),transparent_65%)] blur-[95px] opacity-90 animate-glow-slow" aria-hidden /> */}
      <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 flex flex-col gap-8 sm:gap-10 md:gap-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-center text-white text-2xl sm:text-3xl md:text-4xl font-medium font-['Space_Grotesk'] leading-tight sm:leading-[55.20px]">
              Our Core Services
            </div>
            <div className="text-center text-white text-sm sm:text-base md:text-lg font-normal leading-6 sm:leading-7 tracking-tight px-2">
              Whether it's a villa, apartment, office, or entire building, FixNex delivers full-spectrum
              <br className="hidden sm:block"/>
              maintenance powered by AI prediction and real-time monitoring.
            </div>
          </div>
        </div>

        {/* Service Categories - Grid of Category Boxes */}
        <div className="flex flex-col gap-6 sm:gap-7 justify-center items-center">
          
          {/* Row 1 - First 4 categories */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 w-full max-w-6xl">
            {serviceData.slice(0, 4).map((category, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-3 sm:gap-3.5 cursor-pointer group"
                onClick={() => openCategoryDetails(index)}
              >
                {/* Category Box with 2x2 Icon Grid */}
                <div className="p-3 sm:p-4 bg-white/10 rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-5 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                  <div className="w-32 sm:w-36 flex justify-center items-center gap-2.5 sm:gap-3 flex-wrap">
                    {/* Display first 4 services' icons in 2x2 grid */}
                    {category.services.slice(0, 4).map((service, sIndex) => {
                      const IconComponent = Icons[service.icon as keyof typeof Icons];
                      return (
                        <div 
                          key={sIndex}
                          className="size-14 sm:size-16 relative bg-white/10 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                          title={service.name}
                        >
                          <div className="relative z-10">
                            {IconComponent && <IconComponent width={24} height={24} className="sm:w-7 sm:h-7" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Category Title */}
                <div className="w-full max-w-72 text-center text-white text-base sm:text-lg md:text-xl font-medium font-['Space_Grotesk'] leading-7 sm:leading-8 tracking-wide group-hover:text-blue-400 transition-colors">
                  {category.category}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Next 4 categories (or remaining) */}
          {serviceData.length > 4 && (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 w-full max-w-6xl">
              {serviceData.slice(4, 8).map((category, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center gap-3 sm:gap-3.5 cursor-pointer group"
                  onClick={() => openCategoryDetails(index + 4)}
                >
                  {/* Category Box with 2x2 Icon Grid */}
                  <div className="p-3 sm:p-4 bg-white/10 rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-5 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                    <div className="w-32 sm:w-36 flex justify-center items-center gap-2.5 sm:gap-3 flex-wrap">
                      {category.services.slice(0, 4).map((service, sIndex) => {
                        const IconComponent = Icons[service.icon as keyof typeof Icons];
                        return (
                          <div 
                            key={sIndex}
                            className="size-14 sm:size-16 relative bg-white/10 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                            title={service.name}
                          >
                            <div className="relative z-10">
                              {IconComponent && <IconComponent width={24} height={24} className="sm:w-7 sm:h-7" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Category Title */}
                  <div className="w-full max-w-72 text-center text-white text-base sm:text-lg md:text-xl font-medium font-['Space_Grotesk'] leading-7 sm:leading-8 tracking-wide group-hover:text-blue-400 transition-colors">
                    {category.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Row 3 - Remaining categories (centered) */}
          {serviceData.length > 8 && (
            <div className="flex justify-center w-full">
              <div className="grid  place-items-center">
                {serviceData.slice(8).map((category, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-3 sm:gap-3.5 cursor-pointer group"
                    onClick={() => openCategoryDetails(index + 8)}
                  >
                    {/* Category Box with 2x2 Icon Grid */}
                    <div className="p-3 sm:p-4 bg-white/10 rounded-xl flex flex-col justify-center items-start gap-4 sm:gap-5 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                      <div className="w-32 sm:w-36 flex justify-center items-center gap-2.5 sm:gap-3 flex-wrap">
                        {/* Display first 4 services' icons in 2x2 grid */}
                        {category.services.slice(0, 4).map((service, sIndex) => {
                          const IconComponent = Icons[service.icon as keyof typeof Icons];
                          return (
                            <div 
                              key={sIndex}
                              className="size-14 sm:size-16 relative bg-white/10 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                              title={service.name}
                            >
                              <div className="relative z-10">
                                {IconComponent && <IconComponent width={24} height={24} className="sm:w-7 sm:h-7" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Category Title */}
                    <div className="w-full max-w-72 text-center text-white text-base sm:text-lg md:text-xl font-medium font-['Space_Grotesk'] leading-7 sm:leading-8 tracking-wide group-hover:text-blue-400 transition-colors">
                      {category.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes glowPulseSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate3d(0, -8px, 0) scale(1.05);
            opacity: 0.85;
          }
        }
        @keyframes glowPulseMedium {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.74;
          }
          50% {
            transform: translate3d(0, -12px, 0) scale(1.08);
            opacity: 0.92;
          }
        }
        @keyframes glowPulseFast {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(0.98);
            opacity: 0.68;
          }
          50% {
            transform: translate3d(0, -14px, 0) scale(1.08);
            opacity: 0.9;
          }
        }
        .animate-glow-slow {
          animation: glowPulseSlow 16s ease-in-out infinite;
        }
        .animate-glow-medium {
          animation: glowPulseMedium 11s ease-in-out infinite;
        }
        .animate-glow-fast {
          animation: glowPulseFast 8s ease-in-out infinite;
        }
      `}</style>
    </section>

    {/* Modal/Popup for Category Details - Outside section for proper viewport positioning */}
      {selectedCategory !== null && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto animate-fadeIn"
          onClick={closeCategoryDetails}
        >
          <div className="w-full flex justify-center px-3 sm:px-4 md:px-6">
            <div 
              className="bg-transparent rounded-2xl w-full max-w-5xl animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button */}
              <div className="sticky top-0 bg-black/70 backdrop-blur-md z-10 p-3 sm:p-4 md:p-6 rounded-t-2xl">
                <div className="flex items-center justify-end">
                  <button 
                    onClick={closeCategoryDetails}
                    className="text-white/80 hover:text-white text-xl sm:text-2xl font-light transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full size-10 sm:size-12 flex items-center justify-center"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Services Grid */}
              <div className="p-4 sm:p-6 md:p-10 pt-2 sm:pt-4">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-11">
                  {serviceData[selectedCategory].services.map((service, sIndex) => {
                    const IconComponent = Icons[service.icon as keyof typeof Icons];
                    
                    return (
                      <div 
                        key={sIndex}
                        className="flex flex-col items-center gap-2 sm:gap-2.5 group cursor-pointer"
                        onClick={() => handleServiceClick(service, selectedCategory)}
                      >
                        {/* Icon Box */}
                        <div className="size-14 sm:size-16 relative bg-white/10 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                          <div className="relative z-10">
                            {IconComponent && <IconComponent width={24} height={24} className="sm:w-7 sm:h-7" />}
                          </div>
                        </div>
                        
                        {/* Service Name */}
                        <div className="w-full text-center text-white text-xs sm:text-base md:text-lg font-medium font-['Space_Grotesk'] capitalize leading-tight sm:leading-6 group-hover:text-blue-400 transition-colors break-words">
                          {service.name}
                        </div>

                        {/* Price Badge on Hover */}
                        <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-emerald-400 text-xs sm:text-sm font-bold font-['Space_Grotesk']">
                            {typeof service.member_price === 'number' ? `AED ${service.member_price}` : service.member_price}
                          </div>
                          <div className="text-white/60 text-[10px] sm:text-xs font-['Poppins'] text-center">
                            Click to view details
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal - Shows image and price */}
      {selectedService !== null && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] overflow-y-auto animate-fadeIn"
          onClick={closeServiceDetails}
        >
          <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 md:py-12">
            <div 
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg md:max-w-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] animate-slideUp border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-end p-3 sm:p-4 relative z-10">
                <button 
                  onClick={closeServiceDetails}
                  className="text-white/70 hover:text-white text-lg sm:text-xl font-light transition-all duration-200 p-1.5 sm:p-2 bg-white/5 hover:bg-white/15 rounded-full size-8 sm:size-9 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:border-white/20"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="px-4 sm:px-6 md:px-7 pb-5 sm:pb-6 md:pb-7">
                {/* Service Image */}
                <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg border border-white/5">
                  {(() => {
                    const imageData = getServiceImage(selectedService.name);
                    if (imageData) {
                      return (
                        <>
                          <Image
                            src={imageData.src}
                            alt={imageData.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 500px, 600px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </>
                      );
                    }
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-slate-800/40">
                        <div className="text-white/30">
                          {(() => {
                            const IconComponent = serviceData[selectedService.categoryIndex]?.services.find(s => s.name === selectedService.name)?.icon;
                            const Icon = IconComponent ? Icons[IconComponent as keyof typeof Icons] : null;
                            return Icon ? <Icon width={56} height={56} className="w-14 h-14 sm:w-16 sm:h-16" /> : '📷';
                          })()}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Service Name */}
                <h2 className="text-white text-xl sm:text-2xl md:text-2xl font-semibold font-['Space_Grotesk'] mb-4 sm:mb-5 text-center capitalize leading-tight px-2">
                  {selectedService.name}
                </h2>

                {/* Price Information */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  {/* Member Price */}
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border border-emerald-500/25 rounded-lg sm:rounded-xl p-3.5 sm:p-4 w-full sm:w-auto sm:flex-1 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                    <div className="text-emerald-400/90 text-[10px] sm:text-xs font-medium font-['Space_Grotesk'] uppercase tracking-wider">
                      Member Price
                    </div>
                    <div className="text-emerald-400 text-xl sm:text-2xl md:text-2xl font-bold font-['Space_Grotesk']">
                      {typeof selectedService.member_price === 'number' 
                        ? `AED ${selectedService.member_price}` 
                        : selectedService.member_price}
                    </div>
                  </div>

                  {/* Normal Price */}
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3.5 sm:p-4 w-full sm:w-auto sm:flex-1 backdrop-blur-sm shadow-lg">
                    <div className="text-white/50 text-[10px] sm:text-xs font-medium font-['Space_Grotesk'] uppercase tracking-wider">
                      Regular Price
                    </div>
                    <div className="text-white/80 text-lg sm:text-xl md:text-xl font-bold font-['Space_Grotesk'] line-through">
                      {typeof selectedService.normal_price === 'number' 
                        ? `AED ${selectedService.normal_price}` 
                        : selectedService.normal_price}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={navigateToService}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold font-['Space_Grotesk'] py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={closeServiceDetails}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white font-medium font-['Space_Grotesk'] py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base border border-white/15 hover:border-white/25 backdrop-blur-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoreServices;
