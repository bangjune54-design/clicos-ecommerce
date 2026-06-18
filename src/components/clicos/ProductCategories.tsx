import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// =========================================================================
// CUSTOM DUAL-TONE LINE ART CATEGORY ICONS (MATCHING GIVEN DESIGNS)
// =========================================================================

function SunCareIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="22" r="11" fill="#FEF08A" stroke="#374151" strokeWidth="2.5" />
      <path d="M20 6v3 M20 35v3 M6 22h3 M31 22h3 M10 12l2 2 M28 30l2 2 M10 32l2-2 M28 12l2-2" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 16h16l-3.5 25h-9z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M37 41h10v4h-10z" fill="#FCA5A5" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="42" cy="26" r="3.5" fill="#FEF08A" stroke="#374151" strokeWidth="1.5" />
      <path d="M42 21v1 M42 30v1 M37 26h1 M46 26h1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CleansingIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 22h16v24H20z" fill="#FCA5A5" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M25 18h6v4h-6z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 12h-6v6h4v-3h2v-3" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#E2E8F0" />
      <path d="M28 28c0 2-2 4-2 4s-2-2-2-4 1-3 2-3 2 1 2 3z" fill="#38BDF8" stroke="#374151" strokeWidth="1.5" />
      <circle cx="38" cy="46" r="6" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" />
      <circle cx="45" cy="45" r="4.5" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" />
      <circle cx="41" cy="39" r="3" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" />
    </svg>
  );
}

function SerumAmpouleIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 28h16v22H32z" fill="#86EFAC" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M36 22h8v6h-8z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="40" cy="37" r="3.5" fill="#FEF08A" stroke="#374151" strokeWidth="1.5" />
      <path d="M28 12l-14 14" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 9l5 5-2.5 2.5-5-5z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 38c0 3-3 6-3 6s-3-3-3-6 1.5-4.5 3-4.5 3 1.5 3 4.5z" fill="#BAE6FD" stroke="#374151" strokeWidth="2.5" />
    </svg>
  );
}

function CreamIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 28h40v18H12z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M10 22h44v6H10z" fill="#475569" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 22c0-8 6-12 12-12s12 4 12 12" fill="#FEF08A" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 22c0-4 3-7 6-7s6 3 6 7" stroke="#374151" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function TonerIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20h16v28H20z" fill="#E0F2FE" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 30h16v8H20z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" />
      <path d="M24 14h8v6h-8z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="42" cy="40" r="8" fill="#F8FAFC" stroke="#374151" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  );
}

function MaskIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="40" height="44" rx="20" fill="#CCFBF1" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="20" y="22" width="8" height="5" rx="2.5" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
      <rect x="36" y="22" width="8" height="5" rx="2.5" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
      <path d="M30 31h4v4h-4z" fill="#FFFFFF" stroke="#374151" strokeWidth="2" strokeLinejoin="round" />
      <rect x="24" y="40" width="16" height="5" rx="2.5" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

function LipMakeupIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 36h12v18H14z" fill="#64748B" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 28h8v8h-8z" fill="#E2E8F0" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M17 18c0 4 1 10 1 10h6s1-6 1-10c0-2-2-4-4-4s-4 2-4 4z" fill="#F43F5E" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 22v26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 12h8v10h-8z" fill="#FDA4AF" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 48c0 2 4 2 4 0v-3h-4v3z" fill="#F43F5E" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

function FaceMakeupIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="46" rx="16" ry="8" fill="#64748B" stroke="#374151" strokeWidth="2.5" />
      <ellipse cx="26" cy="44" rx="11" ry="5" fill="#FDBA74" stroke="#374151" strokeWidth="1.5" />
      <path d="M14 36c0-10 12-16 12-16s12 6 12 16" stroke="#374151" strokeWidth="2.5" fill="#BAE6FD" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 24c0 3 4 5 4 5s4-2 4-5" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M48 24l-3 26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 20l4 4-2 2-4-4z" fill="#E2E8F0" stroke="#374151" strokeWidth="2" />
      <path d="M45 10c0 4 4 10 4 10h-6s0-6 2-10z" fill="#FECACA" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function HairCareIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 22h14v26H16z" fill="#A7F3D0" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M19 16h8v6h-8z" fill="#475569" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M23 30c0 3-3 5-3 5s-3-2-3-5 1.5-4 3-4 3 1 3 4z" fill="#10B981" />
      <path d="M44 14c2 12-10 18-6 32" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="46" r="3" fill="#FDA4AF" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

function BodyCareIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24h14v22H12z" fill="#E2E8F0" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M15 18h8v6h-8z" fill="#94A3B8" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M19 12h-4v6h4v-3h2v-3" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M48 44c-4 0-10-4-10-4s-3 3-5 3-4-2-4-2" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M29 38h16l5-5-2-2-4 2" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M42 32c0-3 3-5 5-5s5 2 5 5-3 3-5 3-5-1-5-3z" fill="#FFFBEB" stroke="#374151" strokeWidth="2" />
    </svg>
  );
}

function HairCareImageIcon() {
  return <img src="/categories/hair-care.jpg" alt="Hair Care" className="w-full h-full object-cover rounded-xl sm:rounded-3xl" />;
}

function BodyCareImageIcon() {
  return <img src="/categories/body-care.jpg" alt="Body Care" className="w-full h-full object-cover rounded-xl sm:rounded-3xl" />;
}

function SunCareImageIcon() {
  return <img src="/categories/sun-care.jpg" alt="Sun Care" className="w-full h-full object-cover rounded-xl sm:rounded-3xl" />;
}

export function ProductCategories() {
  const { t } = useLanguage();

  const categories = [
    { titleKey: "cat_sun_care",   descKey: "cat_sun_care_desc",   badgeKey: "cat_sun_care_badge",   icon: SunCareImageIcon,   gradient: "from-yellow-100/60 to-orange-50/40",  href: "/shop?category=suncare"   },
    { titleKey: "cat_cleansing",  descKey: "cat_cleansing_desc",  badgeKey: "cat_cleansing_badge",  icon: CleansingIcon,    gradient: "from-rose-100/60 to-red-50/40",       href: "/shop?category=cleansing" },
    { titleKey: "cat_serum",      descKey: "cat_serum_desc",      badgeKey: "cat_serum_badge",      icon: SerumAmpouleIcon, gradient: "from-green-100/60 to-emerald-50/40",  href: "/shop?category=serum"     },
    { titleKey: "cat_cream",      descKey: "cat_cream_desc",      badgeKey: "cat_cream_badge",      icon: CreamIcon,        gradient: "from-blue-100/60 to-indigo-50/40",    href: "/shop?category=cream"     },
    { titleKey: "cat_toner",      descKey: "cat_toner_desc",      badgeKey: "cat_toner_badge",      icon: TonerIcon,        gradient: "from-sky-100/60 to-blue-50/40",       href: "/shop?category=toner"     },
    { titleKey: "cat_mask",       descKey: "cat_mask_desc",       badgeKey: "cat_mask_badge",       icon: MaskIcon,         gradient: "from-teal-100/60 to-cyan-50/40",      href: "/shop?category=mask"      },
    { titleKey: "cat_lip_makeup", descKey: "cat_lip_makeup_desc", badgeKey: "cat_lip_makeup_badge", icon: LipMakeupIcon,    gradient: "from-pink-100/60 to-rose-50/40",      href: "/shop?category=makeup"    },
    { titleKey: "cat_face_makeup",descKey: "cat_face_makeup_desc",badgeKey: "cat_face_makeup_badge",icon: FaceMakeupIcon,   gradient: "from-amber-100/60 to-yellow-50/40",   href: "/shop?category=makeup"    },
    { titleKey: "cat_hair_care",  descKey: "cat_hair_care_desc",  badgeKey: "cat_hair_care_badge",  icon: HairCareImageIcon,gradient: "from-emerald-100/60 to-teal-50/40",   href: "/shop?category=haircare"  },
    { titleKey: "cat_body_care",  descKey: "cat_body_care_desc",  badgeKey: "cat_body_care_badge",  icon: BodyCareImageIcon,gradient: "from-slate-100/60 to-zinc-50/40",     href: "/shop?category=bodycare"  },
  ];

  return (
    <section id="products" className="py-12 sm:py-24 md:py-32 bg-primary-50/50">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
            {t("cat_section_label")}
          </span>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("shop_by_category")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 font-medium">
            {t("cat_section_desc")}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-8">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isImageIcon = cat.titleKey.includes("hair") || cat.titleKey.includes("body") || cat.titleKey.includes("sun");
            return (
              <Link
                key={idx}
                to={cat.href}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center sm:text-left"
              >
                <div>
                  <div className={`aspect-square sm:aspect-[16/10] w-full flex items-center justify-center relative bg-gradient-to-tr ${cat.gradient}`}>
                    <div className={`flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-3xl shadow-inner border border-white/50 group-hover:scale-110 transition-transform duration-500 bg-white/40 backdrop-blur-[2px] ${
                      isImageIcon ? "p-0 overflow-hidden" : "p-2 sm:p-4"
                    }`}>
                      <IconComponent />
                    </div>
                    <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm text-[8px] sm:text-[9px] font-bold text-primary-900 px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm scale-90 sm:scale-100">
                      {t(cat.badgeKey)}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-5">
                    <h3 className="text-xs sm:text-lg font-bold font-serif text-gray-900 group-hover:text-primary-800 transition-colors line-clamp-1 sm:line-clamp-none">
                      {t(cat.titleKey)}
                    </h3>
                    <p className="mt-1 text-[10px] sm:text-xs text-gray-500 leading-normal font-medium min-h-[30px] hidden sm:block">
                      {t(cat.descKey)}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-1 hidden sm:block">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all">
                    {t("shop_now")}
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
