import React from "react";
import { ShieldCheck, Award, Sparkles } from "lucide-react";

export function About() {
  const highlights = [
    {
      title: "100% Authentic Guarantee",
      desc: "All cosmetics, skincare, and hair care products are sourced directly from authorized brand labs and suppliers in Seoul.",
      icon: ShieldCheck,
    },
    {
      title: "Comprehensive Export Support",
      desc: "Worry-free logistics, reliable customized documentation, and robust packaging designed for overseas shipping.",
      icon: Award,
    },
    {
      title: "K-Beauty Sourcing Expertise",
      desc: "Continuous curation of trending formulas, indie innovations, and market-ready staples to elevate your supply catalog.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Premium CSS Vector Box (No photos) (5 columns) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Vector Container */}
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-primary-100/50 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 p-6 flex flex-col justify-between group">
              {/* Ambient lighting spheres */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/15 blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-12 left-6 w-24 h-24 rounded-full bg-primary-300/10 blur-xl pointer-events-none"></div>
              
              {/* High-Tech Global Map Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center p-6">
                <svg className="w-full h-full text-primary-200/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
                  <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                  <ellipse cx="50" cy="50" rx="45" ry="18" />
                  <ellipse cx="50" cy="50" rx="45" ry="32" />
                  <ellipse cx="50" cy="50" rx="18" ry="45" />
                  <ellipse cx="50" cy="50" rx="32" ry="45" />
                  <line x1="5" y1="50" x2="95" y2="50" />
                  <line x1="50" y1="5" x2="50" y2="95" />
                  <path d="M20 50 Q 50 20 80 50" strokeDasharray="2 2" strokeWidth="1.2" />
                  <path d="M25 60 Q 50 35 75 40" strokeDasharray="2 2" strokeWidth="1.2" />
                  <path d="M15 40 Q 50 65 85 45" strokeDasharray="2 2" strokeWidth="1.2" />
                  <circle cx="20" cy="50" r="2.5" fill="currentColor" />
                  <circle cx="80" cy="50" r="2.5" fill="currentColor" />
                  <circle cx="25" cy="60" r="2" fill="currentColor" />
                  <circle cx="75" cy="40" r="2.5" fill="currentColor" />
                  <circle cx="50" cy="27" r="2" fill="currentColor" />
                  <circle cx="50" cy="65" r="3" fill="#FDA4AF" />
                </svg>
              </div>

              {/* Premium Vector Bottle Illustration */}
              <div className="flex-grow flex items-center justify-center relative z-10">
                <svg className="w-36 h-36 text-primary-200/30 group-hover:scale-105 transition-transform duration-500 ease-out" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <rect x="32" y="40" width="36" height="46" rx="8" />
                  <path d="M43 40V24c0-2 2-3 4-3h6c2 0 4 1 4 3v16" strokeWidth="1.5" />
                  <rect x="45" y="32" width="10" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
                  <circle cx="50" cy="63" r="8" strokeWidth="1.5" />
                  <path d="M47 63h6" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Decorative accent card overlay */}
              <div className="relative z-10 p-6 rounded-2xl glass shadow-lg flex flex-col gap-2">
                <div className="text-3xl font-serif font-bold text-primary-900 leading-none">
                  50+
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Countries Supplied
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Connecting premium Korean formulations directly to global retail networks and beauty enthusiasts.
                </p>
              </div>
            </div>
            {/* Soft decorative background circles */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-primary-100/40 -z-10 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-accent/20 -z-10 blur-3xl"></div>
          </div>

          {/* Right Side: Copy Content (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
              Who We Are
            </span>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl leading-tight">
              Bridging International Markets with Premium{" "}
              <span className="heading-gradient font-serif">K-Beauty</span>
            </h2>
            
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-600 font-medium">
              CLICOS connects international buyers with premium Korean beauty and hair care products. We work with trusted Korean brands and suppliers to provide reliable sourcing, product selection, and export support for retailers and distributors worldwide.
            </p>

            {/* List of Highlights */}
            <div className="mt-10 space-y-6">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-gray-50 hover:border-primary-100 hover:bg-primary-50/20 transition-all duration-300">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50">
                    <item.icon className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 font-serif">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 leading-normal font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
