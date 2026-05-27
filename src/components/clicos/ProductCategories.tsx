import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// =========================================================================
// CUSTOM DUAL-TONE LINE ART CATEGORY ICONS (MATCHING GIVEN DESIGNS)
// =========================================================================

// 1. Sun Care Icon
function SunCareIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun Background */}
      <circle cx="20" cy="22" r="11" fill="#FEF08A" stroke="#374151" strokeWidth="2.5" />
      <path d="M20 6v3 M20 35v3 M6 22h3 M31 22h3 M10 12l2 2 M28 30l2 2 M10 32l2-2 M28 12l2-2" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Sunscreen Tube */}
      <path d="M34 16h16l-3.5 25h-9z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Screw Cap */}
      <path d="M37 41h10v4h-10z" fill="#FCA5A5" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Tube Label Sun */}
      <circle cx="42" cy="26" r="3.5" fill="#FEF08A" stroke="#374151" strokeWidth="1.5" />
      <path d="M42 21v1 M42 30v1 M37 26h1 M46 26h1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 2. Cleansing Icon
function CleansingIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pump Bottle Base */}
      <path d="M20 22h16v24H20z" fill="#FCA5A5" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Bottle Neck & Cap */}
      <path d="M25 18h6v4h-6z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Pump Nozzle */}
      <path d="M28 12h-6v6h4v-3h2v-3" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#E2E8F0" />
      {/* B2B Water Droplet on label */}
      <path d="M28 28c0 2-2 4-2 4s-2-2-2-4 1-3 2-3 2 1 2 3z" fill="#38BDF8" stroke="#374151" strokeWidth="1.5" />
      {/* Bubbly Foam at bottom right */}
      <circle cx="38" cy="46" r="6" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" />
      <circle cx="45" cy="45" r="4.5" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" />
      <circle cx="41" cy="39" r="3" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" />
    </svg>
  );
}

// 3. Serum & Ampoule Icon
function SerumAmpouleIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ampoule Bottle */}
      <path d="M32 28h16v22H32z" fill="#86EFAC" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M36 22h8v6h-8z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Label Circle */}
      <circle cx="40" cy="37" r="3.5" fill="#FEF08A" stroke="#374151" strokeWidth="1.5" />
      
      {/* Dropper Pipette */}
      <path d="M28 12l-14 14" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      {/* Rubber Bulb */}
      <path d="M25 9l5 5-2.5 2.5-5-5z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Falling droplet */}
      <path d="M16 38c0 3-3 6-3 6s-3-3-3-6 1.5-4.5 3-4.5 3 1.5 3 4.5z" fill="#BAE6FD" stroke="#374151" strokeWidth="2.5" />
    </svg>
  );
}

// 4. Cream Icon
function CreamIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Jar base */}
      <path d="M12 28h40v18H12z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Lid */}
      <path d="M10 22h44v6H10z" fill="#475569" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Whipped Cream swirl */}
      <path d="M20 22c0-8 6-12 12-12s12 4 12 12" fill="#FEF08A" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 22c0-4 3-7 6-7s6 3 6 7" stroke="#374151" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

// 5. Toner Icon
function TonerIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Toner Bottle */}
      <path d="M20 20h16v28H20z" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Pink stripe on bottle */}
      <path d="M20 30h16v8H20z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" />
      {/* Bottle Cap */}
      <path d="M24 14h8v6h-8z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Cotton Pad leaning on right */}
      <circle cx="42" cy="40" r="8" fill="#F8FAFC" stroke="#374151" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  );
}

// 6. Mask Icon
function MaskIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sheet Mask Face */}
      <rect x="12" y="10" width="40" height="44" rx="20" fill="#CCFBF1" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Eye Cutouts */}
      <rect x="20" y="22" width="8" height="5" rx="2.5" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
      <rect x="36" y="22" width="8" height="5" rx="2.5" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
      {/* Nose Cutout */}
      <path d="M30 31h4v4h-4z" fill="#FFFFFF" stroke="#374151" strokeWidth="2" strokeLinejoin="round" />
      {/* Mouth Cutout */}
      <rect x="24" y="40" width="16" height="5" rx="2.5" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

// 7. Lip Makeup Icon
function LipMakeupIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lipstick Base Case */}
      <path d="M14 36h12v18H14z" fill="#64748B" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Metal Collar */}
      <path d="M16 28h8v8h-8z" fill="#E2E8F0" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Lipstick Tip */}
      <path d="M17 18c0 4 1 10 1 10h6s1-6 1-10c0-2-2-4-4-4s-4 2-4 4z" fill="#F43F5E" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Lip Gloss Wand */}
      <path d="M42 22v26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lip Gloss Cap */}
      <path d="M38 12h8v10h-8z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Gloss Applicator Tip */}
      <path d="M40 48c0 2 4 2 4 0v-3h-4v3z" fill="#F43F5E" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

// 8. Face Makeup Icon
function FaceMakeupIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Compact Powder Base */}
      <ellipse cx="26" cy="46" rx="16" ry="8" fill="#64748B" stroke="#374151" strokeWidth="2.5" />
      {/* Powder Inside */}
      <ellipse cx="26" cy="44" rx="11" ry="5" fill="#FDBA74" stroke="#374151" strokeWidth="1.5" />
      
      {/* Compact Open Lid (Mirror) */}
      <path d="M14 36c0-10 12-16 12-16s12 6 12 16" stroke="#374151" strokeWidth="2.5" fill="#BAE6FD" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 24c0 3 4 5 4 5s4-2 4-5" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Fluffy Powder Brush */}
      <path d="M48 24l-3 26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      {/* Brush Ferrule */}
      <path d="M44 20l4 4-2 2-4-4z" fill="#E2E8F0" stroke="#374151" strokeWidth="2" />
      {/* Fluffy Bristles */}
      <path d="M45 10c0 4 4 10 4 10h-6s0-6 2-10z" fill="#FECACA" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

// 9. Hair Care Icon
function HairCareIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shampoo Bottle */}
      <path d="M16 22h14v26H16z" fill="#A7F3D0" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Cap */}
      <path d="M19 16h8v6h-8z" fill="#475569" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Leaf Emblem on Label */}
      <path d="M23 30c0 3-3 5-3 5s-3-2-3-5 1.5-4 3-4 3 1 3 4z" fill="#10B981" />
      
      {/* Hair Strand */}
      <path d="M44 14c2 12-10 18-6 32" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Root Bulb */}
      <circle cx="38" cy="46" r="3" fill="#FDA4AF" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

// 10. Body Care Icon
function BodyCareIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body Lotion Bottle */}
      <path d="M12 24h14v22H12z" fill="#E2E8F0" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M15 18h8v6h-8z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Pump */}
      <path d="M19 12h-4v6h4v-3h2v-3" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Hand holding Lotion */}
      <path d="M48 44c-4 0-10-4-10-4s-3 3-5 3-4-2-4-2" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M29 38h16l5-5-2-2-4 2" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Lotion Heap */}
      <path d="M42 32c0-3 3-5 5-5s5 2 5 5-3 3-5 3-5-1-5-3z" fill="#FFFBEB" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

export function ProductCategories() {
  const categories = [
    {
      title: "Sun Care",
      desc: "Broad-spectrum UV protection and cooling sun creams.",
      icon: SunCareIcon,
      badge: "UV Shield",
      gradient: "from-yellow-100/60 to-orange-50/40",
      href: "/shop?category=suncare"
    },
    {
      title: "Cleansing",
      desc: "Deep foaming cleansers, oils, and makeup removers.",
      icon: CleansingIcon,
      badge: "Pure Skin",
      gradient: "from-rose-100/60 to-red-50/40",
      href: "/shop?category=cleansing"
    },
    {
      title: "Serum & Ampoule",
      desc: "Concentrated nourishing treatments for targeted repair.",
      icon: SerumAmpouleIcon,
      badge: "Nourish",
      gradient: "from-green-100/60 to-emerald-50/40",
      href: "/shop?category=serum"
    },
    {
      title: "Cream",
      desc: "Rich moisturizing creams and lightweight soothing gels.",
      icon: CreamIcon,
      badge: "Hydration",
      gradient: "from-blue-100/60 to-indigo-50/40",
      href: "/shop?category=cream"
    },
    {
      title: "Toner",
      desc: "Balancing, hydrating, and skin-refining liquid toners.",
      icon: TonerIcon,
      badge: "Refining",
      gradient: "from-sky-100/60 to-blue-50/40",
      href: "/shop?category=toner"
    },
    {
      title: "Facial Mask",
      desc: "Soothing sheet masks and clarifying clay packs.",
      icon: MaskIcon,
      badge: "Soothing",
      gradient: "from-teal-100/60 to-cyan-50/40",
      href: "/shop?category=mask"
    },
    {
      title: "Lip Makeup",
      desc: "Glossy lip tints, long-wear lipsticks, and lip balms.",
      icon: LipMakeupIcon,
      badge: "Color Gloss",
      gradient: "from-pink-100/60 to-rose-50/40",
      href: "/shop?category=makeup"
    },
    {
      title: "Face Makeup",
      desc: "Glowing cushions, liquid foundations, and concealers.",
      icon: FaceMakeupIcon,
      badge: "Perfect Glow",
      gradient: "from-amber-100/60 to-yellow-50/40",
      href: "/shop?category=makeup"
    },
    {
      title: "Hair Care",
      desc: "Nourishing clinic shampoos, treatments, and hair serums.",
      icon: HairCareIcon,
      badge: "Scalp Care",
      gradient: "from-emerald-100/60 to-teal-50/40",
      href: "/shop?category=haircare"
    },
    {
      title: "Body Care",
      desc: "Gentle body washes, moisturizing lotions, and body oils.",
      icon: BodyCareIcon,
      badge: "Body Therapy",
      gradient: "from-slate-100/60 to-zinc-50/40",
      href: "/shop?category=bodycare"
    }
  ];

  return (
    <section id="products" className="py-24 sm:py-32 bg-primary-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
            Our Portfolios
          </span>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shop By Category
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 font-medium">
            Explore our curated product categories. Select a category to browse our authentic Korean beauty catalog directly in the retail store.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            
            return (
              <Link
                key={idx}
                to={cat.href}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-gray-100 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-left"
              >
                <div>
                  {/* Category Gradient Vector Box */}
                  <div className={`aspect-[16/10] w-full flex items-center justify-center relative bg-gradient-to-tr ${cat.gradient}`}>
                    {/* Floating Premium Icon */}
                    <div className="flex items-center justify-center w-28 h-28 rounded-2xl shadow-inner border border-white/50 group-hover:scale-110 transition-transform duration-500 bg-white/40 backdrop-blur-[2px]">
                      <IconComponent />
                    </div>
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-primary-900 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold font-serif text-gray-900 group-hover:text-primary-800 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500 leading-normal font-medium min-h-[36px]">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-1">
                  <div
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                  >
                    Shop Now
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
