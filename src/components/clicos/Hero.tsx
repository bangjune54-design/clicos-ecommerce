import React from "react";
import { ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
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
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary-950 pt-20"
    >
      {/* Premium CSS-only gradient background (No photo) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-950 via-primary-900 to-primary-950"></div>
        {/* Soft, floating visual ambient light spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/15 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-primary-500/10 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-primary-950/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center flex flex-col items-center">
        {/* Upper Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-200 ring-1 ring-white/20 bg-white/5 backdrop-blur-md mb-8 animate-fade-in shadow-sm">
          <Globe className="w-3.5 h-3.5 text-accent animate-spin-slow" />
          {t("global_supply_network")}
        </div>

        {/* Headlines */}
        <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-6xl max-w-4xl leading-[1.15] drop-shadow-sm animate-slide-up">
          {t("hero_headline_main")}{" "}
          <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary-300">
            {t("globally")}
          </span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl leading-relaxed text-primary-100 max-w-2xl font-medium opacity-90 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          {t("hero_description")}
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <a
            href="#products"
            onClick={(e) => scrollToSection(e, "products")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-primary-950 bg-white hover:bg-primary-50 active:bg-primary-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("explore_products")}
            <ArrowRight className="w-4 h-4 text-primary-800" />
          </a>
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "contact")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white border border-white/40 bg-white/5 hover:bg-white/10 hover:border-white/60 backdrop-blur-md transition-all hover:-translate-y-0.5"
          >
            {t("contact_us")}
          </a>
        </div>
      </div>

      {/* Elegant Bottom Curve Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-white fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,87.43,26.54,188.8,54.1,262.54,64.12,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}
