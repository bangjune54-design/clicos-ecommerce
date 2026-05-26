import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Products", id: "new-arrivals" },
    { name: "Categories", id: "products" },
    { name: "Brands", id: "brands" },
    { name: "Contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    setMobileMenuOpen(false);

    if (isLandingPage) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Height of the sticky navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            to="/"
            onClick={(e) => {
              if (isLandingPage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl font-serif font-bold tracking-wider text-primary-900 group-hover:text-primary-700 transition-colors">
              CLICOS
            </span>
          </Link>
        </div>

        {/* Desktop Menu (Home, Products, Categories, Brands, Contact) */}
        <div className="hidden md:flex md:gap-x-10">
          {navItems.map((item) => {
            const isItemActive = activeSection === item.id;
            
            return (
              <a
                key={item.id}
                href={isLandingPage ? `#${item.id}` : `/#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-sm font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1 ${
                  isItemActive
                    ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>

        {/* Wholesale Tab all the way on the right */}
        <div className="hidden md:flex md:flex-1 md:justify-end">
          <Link
            to="/wholesale"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover active:bg-accent rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Wholesales
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-primary-800 transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-2xl transition-all duration-300 animate-slide-up flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <Link
                  to="/"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (isLandingPage) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="text-2xl font-serif font-bold text-primary-900"
                >
                  CLICOS
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="mt-8 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={isLandingPage ? `#${item.id}` : `/#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`block rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                      activeSection === item.id
                        ? "text-primary-800 bg-primary-50/70"
                        : "text-gray-700 hover:text-primary-700 hover:bg-gray-50/50"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Footer CTA: Wholesale Link */}
            <div className="pb-8 pt-6 border-t border-gray-100">
              <Link
                to="/wholesale"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-center text-sm font-semibold uppercase tracking-widest text-white hover:bg-accent-hover shadow-md transition-colors"
              >
                Wholesales
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 text-center text-xs text-gray-400 font-medium">
                Premium Korean Beauty Export & Supply
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
