import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ImageCarouselProps {
  images: string[];
  productName: string;
  imageFit?: 'contain' | 'cover';
  imageScale?: string;
  isBestseller?: boolean;
}

export function ImageCarousel({ images, productName, imageFit = 'contain', imageScale = 'full', isBestseller = false }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number>(0);
  const currentTranslate = useRef<number>(0);
  const prevTranslate = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Only valid images
  const validImages = images.filter(Boolean);
  const hasMultiple = validImages.length > 1;

  // Reset to first slide if the primary image changes (e.g. when an option is selected)
  const firstImage = validImages[0];
  useEffect(() => {
    setCurrentIndex(0);
  }, [firstImage]);

  // Auto slide
  useEffect(() => {
    if (!hasMultiple || isLightboxOpen || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hasMultiple, isLightboxOpen, isDragging, validImages.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasMultiple) return;
    setIsDragging(true);
    startX.current = e.clientX;
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
      carouselRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !hasMultiple) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    currentTranslate.current = prevTranslate.current + diff;
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !hasMultiple) return;
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.releasePointerCapture(e.pointerId);
      carouselRef.current.style.transition = 'transform 0.3s ease-out';
      carouselRef.current.style.transform = ''; // Let css classes take over
    }
    
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe right, go to previous
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
      } else {
        // swipe left, go to next
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
      }
    } else if (Math.abs(diff) < 5) {
       // It was a click
       setIsLightboxOpen(true);
    }
    prevTranslate.current = 0;
  };

  const scaleMap: Record<string, number> = {
    small: 0.7,
    medium: 0.8,
    large: 0.9,
    xlarge: 1.1,
    xxlarge: 1.2,
    scale140: 1.4,
    scale160: 1.6,
    scale180: 1.8,
    full: 1
  };
  const scale = scaleMap[imageScale] || 1;

  if (validImages.length === 0) return null;

  return (
    <>
      <div 
        className="aspect-square bg-white rounded-2xl overflow-hidden relative shadow-sm border border-gray-100 touch-none select-none group"
      >
        <div 
          ref={carouselRef}
          className="w-full h-full flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing bg-white"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={() => {
            if (!isDragging) setIsLightboxOpen(true);
          }}
        >
          {validImages.map((src, i) => (
            <div key={i} className="min-w-full h-full flex items-center justify-center p-8 bg-white">
              <img
                src={src}
                alt={`${productName} ${i + 1}`}
                className="w-full h-full mix-blend-multiply bg-white transition-all duration-300 pointer-events-none"
                style={{
                  objectFit: imageFit,
                  transform: `scale(${scale})`
                }}
              />
            </div>
          ))}
        </div>

        {isBestseller && (
          <Badge variant="accent" className="absolute top-4 left-4 shadow-md px-3 py-1 text-sm pointer-events-none">
            Bestseller
          </Badge>
        )}

        {hasMultiple && (
          <>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
              {validImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-primary-600 w-4' : 'bg-gray-300'}`} 
                />
              ))}
            </div>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1); }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % validImages.length); }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setIsLightboxOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          
          {hasMultiple && (
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1); }}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          <img 
            src={validImages[currentIndex]} 
            alt={productName} 
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
          />

          {hasMultiple && (
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % validImages.length); }}
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}
          
          {hasMultiple && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
              {validImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/30'}`} 
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
