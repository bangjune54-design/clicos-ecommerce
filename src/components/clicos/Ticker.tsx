import React from "react";

interface TickerProps {
  tickers: string[];
}

export function Ticker({ tickers }: TickerProps) {
  if (!tickers || tickers.length === 0) return null;

  // Joint text with elegant spacers
  const jointText = tickers.join("   •   ") + "   •   ";

  return (
    <div className="w-full bg-accent text-white py-3 overflow-hidden relative shadow-sm border-y border-accent-hover/20 z-20 select-none">
      <div className="flex whitespace-nowrap w-full">
        {/* Replicated marquee boxes to produce absolute seamless loops */}
        <div className="animate-marquee flex shrink-0 items-center gap-12 pl-6 pr-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest font-sans">
            {jointText}
          </span>
        </div>
        <div className="animate-marquee flex shrink-0 items-center gap-12 pl-6 pr-6" aria-hidden="true">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest font-sans">
            {jointText}
          </span>
        </div>
      </div>

      {/* Embedded hardware-accelerated scroll keyframes */}
      <style>{`
        .animate-marquee {
          animation: marquee-scroll 35s linear infinite;
        }
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
