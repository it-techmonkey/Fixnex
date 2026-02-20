'use client';

import { useEffect, useState, useCallback } from "react";

const SCROLL_TRIGGER = 240;

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_TRIGGER);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Safari-compatible smooth scroll with fallback
    try {
      // Check if smooth scroll is supported
      const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      
      if (supportsSmoothScroll) {
        // Use native smooth scroll
        window.scrollTo({ 
          top: 0, 
          behavior: "smooth" 
        });
      } else {
        // Fallback for Safari: Use requestAnimationFrame for smooth scrolling
        const scrollToTop = () => {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          
          if (currentScroll > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, currentScroll - currentScroll / 8);
          } else {
            window.scrollTo(0, 0);
          }
        };
        scrollToTop();
      }
    } catch (error) {
      // Ultimate fallback: instant scroll
      console.warn('Scroll error:', error);
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`group fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      style={{
        // Safari: Ensure button doesn't cause layout issues
        WebkitTransform: isVisible ? 'translateY(0)' : 'translateY(1rem)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg shadow-black/40 backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:-translate-y-1"
          aria-hidden="true"
        >
          <path
            d="M12 5L12 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 11L12 5L18 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
};

export default ScrollToTopButton;

