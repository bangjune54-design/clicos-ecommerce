import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Scissors, Smile, Wrench, ShieldCheck } from "lucide-react";

export function ProductCategories() {
  const categories = [
    {
      title: "Skincare",
      desc: "Premium serums, hydrating toners, and deep moisturizers for glass skin.",
      icon: Sparkles,
      badge: "K-Beauty Trend",
      gradient: "from-primary-100 to-primary-50",
      iconColor: "text-primary-700 bg-primary-100/50",
      href: "/shop?category=skincare"
    },
    {
      title: "Hair Care",
      desc: "Nourishing clinic shampoos, nourishing ampoules, and scalp care treatments.",
      icon: Scissors,
      badge: "Salon Quality",
      gradient: "from-secondary-100 to-secondary-50",
      iconColor: "text-secondary-700 bg-secondary-100/50",
      href: "/shop?category=hair-and-body"
    },
    {
      title: "Cosmetics",
      desc: "Trendy lip formulas, glowing cushions, and high-pigment decorative cosmetics.",
      icon: Smile,
      badge: "Expressive Colors",
      gradient: "from-accent/25 to-accent/5",
      iconColor: "text-accent-hover bg-accent/25",
      href: "/shop?category=makeup"
    },
    {
      title: "Beauty Tools",
      desc: "High-grade makeup brushes, puffs, cleansing devices, and accessories.",
      icon: Wrench,
      badge: "Professional",
      gradient: "from-neutral-100 to-neutral-50",
      iconColor: "text-gray-700 bg-gray-200/50",
      href: "/shop"
    },
    {
      title: "Wholesale / B2B Supply",
      desc: "Comprehensive supply chains, customizable bulk terms, and low MOQs.",
      icon: ShieldCheck,
      badge: "Bulk / Distributors",
      gradient: "from-primary-200/30 to-accent/10",
      iconColor: "text-primary-800 bg-primary-200/50",
      href: "/wholesale"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {categories.map((cat, idx) => {
            const isLast = idx === categories.length - 1;
            const IconComponent = cat.icon;
            
            return (
              <div
                key={idx}
                className={`group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-gray-100 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                  isLast ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  {/* Category Gradient Vector Box */}
                  <div className={`aspect-[16/10] w-full flex items-center justify-center relative bg-gradient-to-tr ${cat.gradient}`}>
                    {/* Floating Premium Icon */}
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-inner border border-white/50 group-hover:scale-110 transition-transform duration-500 ${cat.iconColor}`}>
                      <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-primary-900 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-primary-800 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 leading-normal font-medium min-h-[40px]">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={cat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-700 hover:text-accent group-hover:translate-x-0.5 transition-all"
                  >
                    Shop Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
