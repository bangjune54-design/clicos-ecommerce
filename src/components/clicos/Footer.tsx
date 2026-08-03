import React from "react";
import { Facebook, Instagram, Twitter, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

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

      <div className="mx-auto max-w-[1800px] px-6 lg:px-8 relative z-10">
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
              <Link
                to="/"
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/shop"
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Products
              </Link>
              <Link
                to="/brands"
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Brands
              </Link>
              <Link
                to="/#why-choose-us"
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors col-span-2"
              >
                Why Choose Us
              </Link>
              <Link
                to="/contact"
                className="text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Social and Top Trigger (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary-700 mb-4">
                Follow Us
              </h4>
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Instagram"
                  className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:text-white hover:bg-primary-800 transition-all shadow-sm"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  title="TikTok"
                  className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:text-white hover:bg-primary-800 transition-all shadow-sm"
                >
                  <span className="sr-only">TikTok</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.92a6.43 6.43 0 0 0-5.34 2.65 6.43 6.43 0 0 0 4.67 10.43 6.43 6.43 0 0 0 6.43-6.43V9.3a8.16 8.16 0 0 0 4.35 1.25V7.1a4.85 4.85 0 0 1-1.07-.41z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/5511945122703" 
                  target="_blank" 
                  rel="noreferrer" 
                  title="WhatsApp"
                  className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:text-white hover:bg-primary-800 transition-all shadow-sm"
                >
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
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
