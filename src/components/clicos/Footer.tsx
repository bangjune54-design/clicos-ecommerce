import React from "react";
import { Facebook, Instagram, Twitter, ArrowUp } from "lucide-react";

export function Footer() {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-primary-50 text-gray-800 pt-16 pb-12 relative overflow-hidden border-t border-primary-100">
      
      {/* Curved Divider at Footer start (rendered in light cream color to blend perfectly) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] text-primary-50 fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,87.43,26.54,188.8,54.1,262.54,64.12,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-primary-100">
          
          {/* Brand Tag (5 cols) */}
          <div className="md:col-span-5">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "home")}
              className="text-2xl font-serif font-bold tracking-wider text-primary-800 inline-block mb-4 hover:text-primary-900 transition-colors"
            >
              CLICOS
            </a>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm font-medium">
              We connect global retailers and distributors with authenticated, premium Korean cosmetics and hair care products sourced directly from manufacturers in Seoul.
            </p>
          </div>

          {/* Quick Links (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-700 mb-4">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, "home")}
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                About Us
              </a>
              <a
                href="#products"
                onClick={(e) => scrollToSection(e, "products")}
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Products
              </a>
              <a
                href="#brands"
                onClick={(e) => scrollToSection(e, "brands")}
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Brands
              </a>
              <a
                href="#why-choose-us"
                onClick={(e) => scrollToSection(e, "why-choose-us")}
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors col-span-2"
              >
                Why Choose Us
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Social and Top Trigger (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary-700 mb-4">
                Follow Us
              </h4>
              <div className="flex items-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:text-white hover:bg-primary-800 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:text-white hover:bg-primary-800 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:text-white hover:bg-primary-800 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Scroll back to top button */}
            <button
              onClick={scrollToTop}
              className="mt-8 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-700 hover:text-accent transition-colors focus:outline-none"
            >
              Back To Top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright Area */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-gray-500 font-medium">
          <p>
            © 2026 CLICOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary-800 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary-800 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
