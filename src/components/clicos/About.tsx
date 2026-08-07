import React from "react";
import { ShieldCheck, Award, Sparkles } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function About() {
  const { t } = useLanguage();

  const highlights = [
    {
      titleKey: "highlight_1_title",
      descKey: "highlight_1_desc",
      icon: ShieldCheck,
    },
    {
      titleKey: "highlight_2_title",
      descKey: "highlight_2_desc",
      icon: Award,
    },
    {
      titleKey: "highlight_3_title",
      descKey: "highlight_3_desc",
      icon: Sparkles,
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Premium Cargo Ship Card (6 columns) */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Image Card Container */}
            <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-primary-100/50 bg-primary-950 p-6 flex flex-col justify-end group">
              
              {/* Cargo Ship Background Image in Brown/Sepia theme */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <img
                  src="/cargo-ship-brown.png"
                  alt="Global Cargo Ship Logistics"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
              </div>

              {/* Decorative accent card overlay at the bottom */}
              <div className="relative z-10 p-7 rounded-2xl glass shadow-lg flex flex-col gap-2.5 bg-white/70 backdrop-blur-md">
                <div className="text-5xl font-serif font-bold text-primary-900 leading-none">
                  50+
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {t("countries_supplied")}
                </div>
                <p className="text-sm text-gray-650 font-medium">
                  {t("countries_supplied_desc")}
                </p>
              </div>
            </div>
            {/* Soft decorative background circles */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-primary-100/40 -z-10 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-accent/20 -z-10 blur-3xl"></div>
          </div>

          {/* Right Side: Copy Content (6 columns) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
              {t("who_we_are")}
            </span>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl leading-tight">
              {t("about_headline")}
            </h2>
            
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-600 font-medium">
              {t("about_paragraph")}
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
                      {t(item.titleKey)}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 leading-normal font-medium">
                      {t(item.descKey)}
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
