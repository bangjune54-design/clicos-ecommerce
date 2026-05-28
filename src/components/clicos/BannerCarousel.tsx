import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Banner } from "../../utils/homepage";

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % banners.length);
  };

  const handleDotClick = (idx: number) => {
    setCurrentIdx(idx);
  };

  const handleBannerClick = (e: React.MouseEvent, link: string) => {
    if (!link) return;
    
    if (link.startsWith("#")) {
      e.preventDefault();
      const id = link.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      navigate(link);
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section id="home" className="relative w-full h-[75vh] sm:h-[80vh] bg-primary-950 overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {banners.map((banner, idx) => {
          const isActive = idx === currentIdx;
          
          return (
            <div
              key={banner.id}
              onClick={(e) => handleBannerClick(e, banner.link)}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center justify-center cursor-pointer ${
                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0 pointer-events-none"
              }`}
            >
              {/* Background Layer: image starts below the fixed header so the full image is visible */}
              <div className="absolute inset-x-0 bottom-0 top-[72px] z-0 select-none pointer-events-none">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center opacity-100 select-none"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-primary-950 via-primary-900 to-primary-950">
                    {/* Abstract ambient decorative light spheres */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px]"></div>
                  </div>
                )}
              </div>

              {/* Foreground Content removed to prevent covering the banner image */}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-[calc(50%+36px)] -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white hover:scale-105 active:scale-95 transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-[calc(50%+36px)] -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white hover:scale-105 active:scale-95 transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIdx ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
}
