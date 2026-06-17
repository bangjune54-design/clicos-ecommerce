import React from "react";
import { Link } from "react-router-dom";
import { getLiveBrandsForCustomers } from "../../utils/inventory";

export function BrandGrid() {
  const brands = [
    {
      name: "4PM",
      tagline: "Premium, functional skincare solutions.",
      initials: "4P",
      bgClass: "bg-orange-50 text-orange-700 border-orange-100"
    },
    {
      name: "AESTURA",
      tagline: "Dermatology-grade barrier repair & hydration.",
      initials: "AS",
      bgClass: "bg-sky-50 text-sky-800 border-sky-100"
    },
    {
      name: "FWEE",
      tagline: "Trendy makeup and vibrant color cosmetics.",
      initials: "FW",
      bgClass: "bg-pink-50 text-pink-700 border-pink-100"
    },
    {
      name: "Torriden",
      tagline: "Deep hydration clean K-beauty skincare.",
      initials: "TR",
      bgClass: "bg-blue-50 text-blue-700 border-blue-100"
    },
    {
      name: "Beauty of Joseon",
      tagline: "Modernized herbal K-beauty formulas.",
      initials: "BJ",
      bgClass: "bg-amber-50 text-amber-800 border-amber-100"
    },
    {
      name: "MEDICUBE",
      tagline: "Clinically proven dermatological solutions.",
      initials: "MC",
      bgClass: "bg-red-50 text-red-700 border-red-100"
    },
    {
      name: "NUMBUZIN",
      tagline: "Customized skincare designated by numbers.",
      initials: "NZ",
      bgClass: "bg-indigo-50 text-indigo-700 border-indigo-100"
    },
    {
      name: "Ma:nyo",
      tagline: "Eco-friendly, pure botanical ingredients.",
      initials: "MY",
      bgClass: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
      name: "Meditherapy",
      tagline: "Innovating wellness devices and serums.",
      initials: "MT",
      bgClass: "bg-purple-50 text-purple-700 border-purple-100"
    },
    {
      name: "Kerasys",
      tagline: "Salon-grade clinical hair & scalp nourishment.",
      initials: "KS",
      bgClass: "bg-slate-50 text-slate-700 border-slate-100"
    },
    {
      name: "ATS",
      tagline: "Professional salon-trusted clinical formulas.",
      initials: "AT",
      bgClass: "bg-neutral-50 text-neutral-700 border-neutral-100"
    }
  ];

  const liveBrands = getLiveBrandsForCustomers();

  // Enrich static default brands with database images and taglines
  const enrichedBrands = brands
    .map((b) => {
      const live = liveBrands.find((lb) => lb.name.toLowerCase() === b.name.toLowerCase());
      if (!live) return null;
      return {
        ...b,
        image: live.image || "",
        tagline: live.description || b.tagline
      };
    })
    .filter((b): b is any => b !== null);

  // Add any custom brands added in the admin panel that are not in the default list
  const staticNames = new Set(brands.map(b => b.name.toLowerCase()));
  const customBrands = liveBrands
    .filter(lb => !staticNames.has(lb.name.toLowerCase()))
    .map(lb => ({
      name: lb.name,
      tagline: lb.description || "Premium Korean Cosmetics brand.",
      initials: lb.name.substring(0, 2).toUpperCase(),
      bgClass: "bg-primary-50 text-primary-800 border-primary-100",
      image: lb.image || ""
    }));

  const allDisplayBrands = [...enrichedBrands, ...customBrands];

  return (
    <section id="brands" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
            Brand Partners
          </span>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted K-Beauty Global Distribution
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 font-medium">
            We source and export an extensive portfolio of renowned Korean beauty and professional hair care brands, ensuring authentic product delivery worldwide.
          </p>
        </div>

        {/* Brand Grid Container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {allDisplayBrands.map((brand, idx) => (
            <Link
              key={idx}
              to={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
              className="group flex flex-col items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="w-full flex flex-col items-center">
                {/* Brand Logo Container */}
                <div className="w-28 h-20 rounded-2xl flex items-center justify-center mb-4 overflow-hidden border border-gray-100 relative bg-white p-2.5 shadow-sm">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={`${brand.name} logo`}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center font-serif text-xl font-bold uppercase ${brand.bgClass} rounded-2xl`}>
                      {brand.initials}
                    </div>
                  )}
                </div>

                {/* Brand Name */}
                <h3 className="text-sm font-bold tracking-wide text-gray-900 group-hover:text-primary-800 transition-colors uppercase">
                  {brand.name}
                </h3>
              </div>

              {/* Tagline */}
              <p className="mt-2 text-[10px] text-gray-400 font-medium text-center leading-normal">
                {brand.tagline}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
