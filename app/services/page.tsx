"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Icons from "@/app/components/icons";
import { slugify } from "@/app/utils/slugify";
import { getServiceImage } from "./service-images";

type ApiService = {
  id: string;
  name: string;
  normal_price: string | number;
  member_price: string | number;
  icon: string;
  category: {
    id: string;
    name: string;
  };
};

type CategoryGroup = {
  category: string;
  services: ApiService[];
};

const formatPrice = (price: ApiService["normal_price"]) => {
  if (price === null || price === undefined) {
    return "AED 0";
  }

  if (typeof price === "number") {
    return `AED ${price}`;
  }

  const trimmed = price.trim();
  if (trimmed.length === 0) {
    return "AED 0";
  }

  if (/^aed\b/i.test(trimmed)) {
    return trimmed;
  }

  // Only prefix AED for strings that contain a digit. Otherwise, return as-is (e.g., "Custom Pricing").
  return /\d/.test(trimmed) ? `AED ${trimmed}` : trimmed;
};

const ServicesPage = () => {
  const router = useRouter();
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        if (isMounted) {
          setServices(data.services ?? []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load services:", err);
          setError("Unable to load services. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedCategories = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, ApiService[]>();

    for (const service of services) {
      const categoryName = service.category?.name ?? "Uncategorized";
      if (!map.has(categoryName)) {
        map.set(categoryName, []);
      }
      map.get(categoryName)?.push(service);
    }

    return Array.from(map.entries())
      .map(([category, groupedServices]) => ({
        category,
        services: groupedServices,
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [services]);

  useEffect(() => {
    if (groupedCategories.length === 0) {
      setSelectedCategoryIndex(0);
      return;
    }

    setSelectedCategoryIndex((prev) => {
      if (prev < groupedCategories.length) {
        return prev;
      }
      return 0;
    });
  }, [groupedCategories]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleEscape); 
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleEscape);
      }
    };
  }, []);

  const categories = groupedCategories.map((cat) => cat.category);
  const currentCategory = groupedCategories[selectedCategoryIndex];

  if (loading) {
    return (
      <div className="w-full bg-[#0f0f0f] h-full relative">
        <div className="w-full bg-[#0f0f0f] pt-20 relative z-10 ">
          <Header />
          <div className="w-full min-h-screen bg-black h-fit flex flex-col items-center justify-center text-white space-y-4 px-4">
            <div className="size-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/80 text-base sm:text-lg font-['Space_Grotesk']">Loading services...</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !currentCategory) {
    return (
      <div className="w-full h-full relative">
        <div className="w-full pt-20 relative z-10 ">
          <Header />
          <div className="w-full min-h-screen bg-black h-fit flex flex-col items-center justify-center text-center text-white space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk']">
              {error ? "Oops! Something went wrong" : "No services found"}
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-lg">
              {error ?? "We couldn't find any services at the moment. Please try again later."}
            </p>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-sm sm:text-base bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Try Again
              </button>
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
  const handleCategorySelect = (index: number) => {
    setSelectedCategoryIndex(index);
    setIsSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="justify-start text-white text-xl sm:text-2xl md:text-3xl font-medium   leading-tight sm:leading-8 pl-4 md:pl-20 mt-6 sm:mt-8">
        Browse Services
      </div>
      <div className="justify-start text-zinc-500 text-sm sm:text-base font-normal leading-6 flex flex-col gap-2 sm:gap-4 py-6 sm:py-10 w-full px-4">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(index)}
            className={`text-left px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-['Space_Grotesk'] text-sm sm:text-base ${
              selectedCategoryIndex === index
                ? "bg-linear-to-r from-blue-700 to-sky-950 text-white shadow-lg shadow-blue-500/30 border border-blue-500/30"
                : "text-white/70 hover:bg-gray-800/50 hover:text-white border border-transparent"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="w-full bg-[#0f0f0f] h-full relative">
      <div className="w-full bg-[#0f0f0f] pt-20 relative z-10 ">
        <Header />
        <div className="w-full min-h-screen bg-black h-fit ">
          <div className="w-full mx-auto h-fit relative">
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar Overlay */}
              {isSidebarOpen && (
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                />
              )}

              {/* Sidebar */}
              <aside
                className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs sm:max-w-sm bg-linear-to-b from-[#121316] to-[#0a0a0b] overflow-y-auto border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-1/4 lg:max-w-none lg:flex lg:flex-col lg:translate-x-0 lg:border-none lg:shadow-none lg:bg-[#121316] ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
              >
                <div className="flex justify-between items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-white/10 lg:hidden">
                  <span className="text-white text-lg sm:text-xl font-semibold font-['Space_Grotesk']">
                    Services
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-white/60 hover:text-white transition p-2 rounded-lg hover:bg-white/10"
                    aria-label="Close services menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div 
                className="flex flex-col items-center text-center lg:text-left lg:items-start px-2 sm:px-0">
                  {sidebarContent}
                </div>
              </aside>

              {/* Right Content Area */}
              <div className="flex-1 bg-[#0f0f0f] p-4 sm:p-6 md:p-8 lg:p-10 min-h-screen lg:ml-0">
                {/* Mobile Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8 lg:hidden">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs sm:text-sm  truncate">
                    <span className="hidden sm:inline">Home / Services /</span>
                    {/* <span className="text-white/80 font-medium truncate">{currentCategory.category}</span> */}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:scale-105 shadow-lg shadow-black/20 font-['Space_Grotesk']"
                    aria-label="Open services menu"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>Categories</span>
                  </button>
                </div>

                {/* Breadcrumbs - Desktop */}
                <div className="hidden lg:block text-neutral-400 text-sm mb-6 ">
                  Home / Services / {currentCategory.category}
                </div>

                {/* Service Title */}
                <h1 className="text-white  text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium font-['Space_Grotesk'] mb-4 sm:mb-6 leading-tight">
                  {currentCategory.category}
                </h1>

                {/* Service Stats */}
                <div className="flex  sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-white/90 text-xs sm:text-sm  font-medium">
                      {currentCategory.services.length} {currentCategory.services.length === 1 ? 'Service' : 'Services'} Available
                    </span>
                  </div>
                  <div className="flex  items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="size-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-white/90 text-xs sm:text-sm  font-medium">
                      {(() => {
                        const prices = currentCategory.services
                          .filter((s) => typeof s.member_price === "number")
                          .map((s) => s.member_price as number);
                        return prices.length > 0 ? `From AED ${Math.min(...prices)}` : "Custom Pricing";
                      })()}
                    </span>
                  </div>
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
                  {currentCategory.services.map((service) => {
                    const IconComponent = Icons[service.icon as keyof typeof Icons];
                    const image = getServiceImage(service.name);

                    return (
                      <div
                        key={service.id}
                        className="group bg-[#17181b] rounded-xl sm:rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/60 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98]"
                      >
                        {/* Media Section */}
                        <div className="relative w-full h-32 sm:h-48 lg:h-56 overflow-hidden">
                          {image ? (
                            <>
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, (min-width: 640px) 50vw, 50vw"
                                priority={false}
                              />
                              <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/20 to-transparent group-hover:from-black/50 group-hover:via-black/30 transition-colors" />
                              {image.credit !== "Local" && (
                                <div className="absolute bottom-1 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 text-white/60 text-[8px] sm:text-[10px] uppercase tracking-wide opacity-0 sm:opacity-100">
                                  <a
                                    href={image.creditUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate block hover:text-white/90 transition"
                                  >
                                    Photo: {image.credit}
                                  </a>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="relative w-full h-full bg-linear-to-br from-gray-800 via-gray-850 to-gray-900 flex items-center justify-center">
                              <div className="absolute inset-0 opacity-5">
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                  }}
                                ></div>
                              </div>
                              <div className="relative z-10 size-14 sm:size-24 flex items-center justify-center bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 group-hover:bg-white/15 group-hover:scale-110 transition-all duration-300">
                                {IconComponent && (
                                  <IconComponent width={36} height={36} className="sm:w-[56px] sm:h-[56px] transition-transform duration-300" />
                                )}
                              </div>
                              <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 via-blue-500/0 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-2.5 sm:p-4 lg:p-6">
                          {/* Service Name */}
                          <h3 className="text-white text-xs sm:text-base lg:text-xl font-medium font-['Space_Grotesk'] mb-2 sm:mb-3 lg:mb-4 min-h-[36px] sm:min-h-[48px] lg:min-h-[56px] flex items-center leading-tight sm:leading-snug line-clamp-2">
                            {service.name}
                          </h3>

                          {/* Pricing Section */}
                          <div className="flex flex-col gap-2 sm:gap-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-col gap-0.5 sm:gap-1">
                                <span className="text-white/50 text-[10px] sm:text-xs lg:text-sm hidden sm:inline">Starting from</span>
                                <span className="text-white/95 text-sm sm:text-lg lg:text-2xl font-bold font-['Space_Grotesk'] leading-tight">
                                  {formatPrice(service.normal_price)}
                                </span>
                              </div>

                              <button
                                onClick={() => router.push(`/services/${slugify(service.name)}`)}
                                className="w-full sm:w-auto flex justify-center items-center py-1.5 sm:py-2.5 lg:py-3 px-3 sm:px-5 lg:px-6 text-white text-[10px] sm:text-sm lg:text-base rounded-lg sm:rounded-xl bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 active:from-sky-800 active:to-blue-800 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold font-['Space_Grotesk'] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                              >
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">View</span>
                                <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ServicesPage;
