import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, Search, User, ShoppingBag } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCurrency } from "../../contexts/CurrencyContext";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Dynamic e-commerce states
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/";

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Products", id: "new-arrivals" },
    { name: "Categories", id: "products" },
    { name: "Brands", id: "brands" },
    { name: "Contact", id: "contact" },
    { name: "Wholesales", id: "wholesale" } // Wholesale link in main menu
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'KO', name: 'Korean' },
    { code: 'PT', name: 'Portuguese' },
    { code: 'ES', name: 'Spanish' },
    { code: 'ZH', name: 'Chinese' },
    { code: 'JA', name: 'Japanese' }
  ];

  const currencies = ["USD", "EUR", "KRW", "JPY", "GBP", "BRL"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };

    // State syncing logic (cart and auth status)
    const syncState = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      const userType = localStorage.getItem("userType") || "retail";
      const retail = JSON.parse(localStorage.getItem("retailCart") || "[]");
      const b2b = JSON.parse(localStorage.getItem("b2bCart") || "[]");
      setCartCount(userType === "wholesale" ? b2b.length : retail.length);
    };

    syncState();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", syncState);
    };
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

    if (id === "wholesale") {
      e.preventDefault();
      navigate("/wholesale");
      return;
    }

    if (isLandingPage) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Height of sticky navbar
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

        {/* Desktop Menu (Home, Products, Categories, Brands, Contact, Wholesales) */}
        <div className="hidden md:flex md:gap-x-10">
          {navItems.map((item) => {
            const isWholesaleActive = item.id === "wholesale" && location.pathname === "/wholesale";
            const isItemActive = activeSection === item.id || isWholesaleActive;
            
            return (
              <a
                key={item.id}
                href={item.id === "wholesale" ? "/wholesale" : (isLandingPage ? `#${item.id}` : `/#${item.id}`)}
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

        {/* Far Right Section: Language/Currency, Search, Profile, Cart */}
        <div className="hidden md:flex md:flex-1 md:justify-end md:items-center gap-5">
          {/* Language / Currency Toggle */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 text-gray-700 hover:text-primary-850 transition-colors uppercase font-semibold text-xs tracking-wide focus:outline-none"
              title="Change Language / Currency"
            >
              <Globe className="h-4.5 w-4.5" />
              <span>{language}</span>
              <span className="text-[10px] text-gray-400 font-normal">|</span>
              <span>{currency}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-gray-100 shadow-2xl p-4 z-50 flex flex-col gap-4 animate-slide-up">
                {/* Language Picker */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 border-b pb-1.5">Language</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as any);
                          setShowLangDropdown(false);
                        }}
                        className={`px-2 py-1 text-left text-xs font-semibold rounded-lg transition-colors ${
                          language === l.code
                            ? "bg-primary-50 text-primary-800"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Picker */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 border-b pb-1.5">Currency</h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setShowLangDropdown(false);
                        }}
                        className={`px-1.5 py-1 text-center text-xs font-bold rounded-lg transition-colors ${
                          currency === c
                            ? "bg-accent/20 text-accent-hover"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <Link
            to="/shop"
            className="text-gray-700 hover:text-primary-850 transition-colors focus:outline-none"
            title="Search Catalog"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          {/* Profile Trigger */}
          <button
            onClick={() => navigate(isLoggedIn ? "/my-page" : "/login")}
            className="text-gray-700 hover:text-primary-850 transition-colors focus:outline-none"
            title={isLoggedIn ? "My Profile" : "Login / Signup"}
          >
            <User className="h-4.5 w-4.5" />
          </button>

          {/* Cart Trigger with dynamic Red Badge */}
          <button
            onClick={() => navigate(isLoggedIn ? "/cart" : "/login")}
            className="text-gray-700 hover:text-primary-850 transition-colors relative flex items-center focus:outline-none"
            title="Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
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
                    href={item.id === "wholesale" ? "/wholesale" : (isLandingPage ? `#${item.id}` : `/#${item.id}`)}
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

            {/* Mobile Footer Utilities and CTA */}
            <div className="pb-8 pt-6 border-t border-gray-100 space-y-6">
              {/* Language & Currency Selection */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Language</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-lg p-2 focus:outline-none"
                  >
                    {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Currency</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-lg p-2 focus:outline-none"
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Utility shortcuts */}
              <div className="flex gap-4">
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate("/shop"); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-750 flex items-center justify-center gap-1.5 bg-gray-50/30"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate(isLoggedIn ? "/my-page" : "/login"); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-750 flex items-center justify-center gap-1.5 bg-gray-50/30"
                >
                  <User className="w-4 h-4" /> {isLoggedIn ? "Account" : "Login"}
                </button>
              </div>

              {/* Cart CTA */}
              <button
                onClick={() => { setMobileMenuOpen(false); navigate(isLoggedIn ? "/cart" : "/login"); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-800 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white hover:bg-primary-900 shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
