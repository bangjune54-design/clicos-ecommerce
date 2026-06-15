import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Banner } from "../../utils/homepage";

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);
  const navigate = useNavigate();
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide effect that resets whenever the slide changes or dragging starts/ends
  useEffect(() => {
    if (banners.length <= 1 || isDragging) {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
      return;
    }

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [banners.length, isDragging, currentIdx]);

  // Drag and Swipe Handlers
  const handleDragStart = (clientX: number) => {
    if (banners.length <= 1) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
    setDraggedDistance(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    let diff = clientX - startX;

    // Apply high-quality elastic dampening power when swiping past boundaries
    if (currentIdx === 0 && diff > 0) {
      diff = Math.pow(diff, 0.75); // Dampen right swipe on first banner
    } else if (currentIdx === banners.length - 1 && diff < 0) {
      diff = -Math.pow(Math.abs(diff), 0.75); // Dampen left swipe on last banner
    }

    setDragOffset(diff);
    setDraggedDistance(Math.abs(diff));
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Swipe transition threshold (80px or 10% of window size)
    const threshold = Math.min(window.innerWidth * 0.1, 80);
    if (dragOffset > threshold) {
      // Swipe Right -> Show previous banner if not at index 0
      if (currentIdx > 0) {
        setCurrentIdx(currentIdx - 1);
      }
    } else if (dragOffset < -threshold) {
      // Swipe Left -> Show next banner if not at final banner
      if (currentIdx < banners.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }
    }

    setDragOffset(0);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx < banners.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleDotClick = (idx: number) => {
    setCurrentIdx(idx);
  };

  const handleBannerClick = (e: React.MouseEvent, link: string) => {
    // If user dragged more than a tiny threshold, treat it as a swipe gesture instead of a link click
    if (draggedDistance > 8) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
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
    <section 
      id="home" 
      className="relative w-full h-auto bg-primary-950 overflow-hidden select-none touch-pan-y"
    >
      {/* Draggable Slides Container Track */}
      <div 
        className="w-full flex cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(calc(-${(currentIdx * 100) / banners.length}% + ${dragOffset / banners.length}px))`,
          transition: isDragging ? "none" : "transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          width: `${banners.length * 100}%`
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            onClick={(e) => handleBannerClick(e, banner.link)}
            className="flex-shrink-0 relative cursor-pointer"
            style={{ width: `${100 / banners.length}%` }}
          >
            {/* Image Layer: image starts below the fixed header */}
            <div className="w-full select-none pt-[4.5rem] relative h-[340px] sm:h-[480px] md:h-[600px] lg:h-[700px] xl:h-[780px]">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary-950 via-primary-900 to-primary-950 relative">
                  {/* Abstract ambient decorative light spheres */}
                  <div className="absolute top-1/4 left-1/4 w-36 h-36 sm:w-96 sm:h-96 rounded-full bg-accent/10 blur-[100px] animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-80 sm:h-80 rounded-full bg-primary-500/10 blur-[100px]"></div>
                </div>
              )}

              {/* Text & CTA Overlay */}
              <div className="absolute inset-0 pt-[4.5rem] bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center">
                <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 md:px-20 lg:px-24 flex flex-col items-start text-left text-white">
                  <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent border border-accent/30 bg-accent/5 backdrop-blur-md mb-3 sm:mb-5 shadow-sm">
                    Premium Export Sourced
                  </div>

                  <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight text-white max-w-2xl drop-shadow-md">
                    {banner.title}
                  </h2>
                  
                  <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed text-gray-200 max-w-xl font-medium opacity-90 line-clamp-2 sm:line-clamp-none">
                    {banner.subtitle}
                  </p>

                  <div className="mt-5 sm:mt-7">
                    <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary-950 bg-white hover:bg-primary-50 active:bg-primary-100 transition-all shadow-md">
                      Explore Catalog &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`absolute left-4 top-[calc(50%+2.25rem)] -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white transition-all focus:outline-none ${
              currentIdx === 0 
                ? "opacity-20 cursor-not-allowed pointer-events-none" 
                : "hover:bg-white/15 hover:scale-105 active:scale-95"
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIdx === banners.length - 1}
            className={`absolute right-4 top-[calc(50%+2.25rem)] -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white transition-all focus:outline-none ${
              currentIdx === banners.length - 1 
                ? "opacity-20 cursor-not-allowed pointer-events-none" 
                : "hover:bg-white/15 hover:scale-105 active:scale-95"
            }`}
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
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
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
