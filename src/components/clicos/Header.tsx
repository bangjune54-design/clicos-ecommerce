import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, X, Globe, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useCountry, COUNTRIES } from "../../contexts/CountryContext";
import { saveAndClearCartForAccount } from "../../utils/cart";
import { getLiveBrands, getLiveInventory } from "../../utils/inventory";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Dynamic e-commerce states
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { country, setCountry, getLocalizedProduct } = useCountry();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [userFirstName, setUserFirstName] = useState(() => localStorage.getItem("userFirstName") || "");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  // Dropdown hover & mobile accordion states
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileWholesaleOpen, setMobileWholesaleOpen] = useState(false);
  
  // Big search overlay states
  const [showBigSearch, setShowBigSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Keyboard event listener for Escape key to close search overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowBigSearch(false);
        setSearchQuery("");
      }
    };
    if (showBigSearch) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showBigSearch]);

  const [searchParams] = useSearchParams();
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
      setUserFirstName(localStorage.getItem("userFirstName") || "");
      const userType = localStorage.getItem("userType") || "retail";
      const retail = JSON.parse(localStorage.getItem("retailCart") || "[]");
      const b2b = JSON.parse(localStorage.getItem("b2bCart") || "[]");
      const activeItems = userType === "wholesale" ? b2b : retail;
      setCartItems(activeItems);
      setCartCount(activeItems.reduce((sum: number, item: any) => sum + item.quantity, 0));
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

  const cartTotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-md py-4.5"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-5.5"
      }`}
    >
      <nav className="mx-auto max-w-[1800px] px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex lg:flex-initial mr-4 lg:mr-10 xl:mr-16 2xl:mr-20">
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
            <span className="text-3xl lg:text-4xl xl:text-[40px] 2xl:text-[44px] font-serif font-bold tracking-wider text-primary-900 group-hover:text-primary-700 transition-colors">
              CLICOS
            </span>
          </Link>
        </div>

        {/* Desktop Menu (Home, Products, Categories, Brands, Contact, Wholesales) */}
        <div className="hidden md:flex md:gap-x-3 lg:gap-x-6 xl:gap-x-10 2xl:gap-x-14 items-center mr-auto">
          {/* Home */}
          <Link
            to="/"
            onClick={(e) => {
              if (isLandingPage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
              location.pathname === "/" && activeSection === "home"
                ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                : "text-gray-600"
            }`}
          >
            {t('home')}
          </Link>

          {/* Products */}
          <Link
            to="/shop"
            className={`text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
              location.pathname === "/shop" && !searchParams.get("category") && !searchParams.get("brand") && !searchParams.get("collection")
                ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                : "text-gray-600"
            }`}
          >
            {t('products')}
          </Link>

          {/* Categories Dropdown Wrapper */}
          <div
            className="relative py-1.5"
            onMouseEnter={() => setHoveredDropdown("categories")}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <Link
              to="/shop"
              className={`text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 lg:gap-1.5 xl:gap-2 ${
                location.pathname === "/shop" && searchParams.get("category")
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('categories')}
              <ChevronDown className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] xl:w-[22px] xl:h-[22px] 2xl:w-[28px] 2xl:h-[28px] opacity-60 flex-shrink-0 transition-all" />
            </Link>
            {hoveredDropdown === "categories" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[220px] lg:w-[280px] xl:w-[340px] 2xl:w-[420px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-3 lg:p-4 xl:p-5 2xl:p-6 flex flex-col gap-1.5 animate-slide-up">
                  <Link
                    to="/shop?category=skincare"
                    className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('skincare')}
                  </Link>
                  <Link
                    to="/shop?category=makeup"
                    className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('makeup')}
                  </Link>
                  <Link
                    to="/shop?category=haircare"
                    className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('hair_care')}
                  </Link>
                  <Link
                    to="/shop?category=bodycare"
                    className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('body_care')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Brands Dropdown Wrapper */}
          <div
            className="relative py-1.5"
            onMouseEnter={() => setHoveredDropdown("brands")}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <Link
              to="/brands"
              className={`text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 lg:gap-1.5 xl:gap-2 ${
                location.pathname === "/brands" || (location.pathname === "/shop" && searchParams.get("brand"))
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('brands')}
              <ChevronDown className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] xl:w-[22px] xl:h-[22px] 2xl:w-[28px] 2xl:h-[28px] opacity-60 flex-shrink-0 transition-all" />
            </Link>
            {hoveredDropdown === "brands" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[840px] xl:w-[1050px] 2xl:w-[1300px]">
                <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-6 lg:p-8 xl:p-10 2xl:p-12 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-5">
                    <h4 className="text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold text-gray-400 uppercase tracking-widest">Our Partner Brands</h4>
                    <span className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-primary-700 font-semibold bg-primary-50 px-3.5 py-1 rounded-full uppercase">Direct Contracts</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 lg:gap-5 xl:gap-6 2xl:gap-8">
                    {getLiveBrands().map((brand) => (
                      <Link
                        key={brand.name}
                        to={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                        className="flex flex-col items-center p-2 rounded-2xl hover:bg-primary-50/60 transition-all duration-200 group text-center"
                        onClick={() => setHoveredDropdown(null)}
                      >
                        {/* Brand Logo Container */}
                        <div className="w-28 h-20 lg:w-[130px] lg:h-[85px] xl:w-[160px] xl:h-[105px] 2xl:w-[200px] 2xl:h-[135px] rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden mb-2 group-hover:scale-105 transition-transform duration-300 shadow-sm p-1.5 relative shrink-0">
                          {brand.image ? (
                            <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" />
                          ) : (
                            <span className="text-sm lg:text-base xl:text-[18px] 2xl:text-[22px] font-serif font-bold text-primary-900/60 uppercase tracking-wider">
                              {brand.name}
                            </span>
                          )}
                        </div>
                        {/* Brand Name below the picture */}
                        <p className="text-xs lg:text-sm xl:text-[16px] 2xl:text-[19.5px] font-bold text-gray-900 group-hover:text-primary-800 transition-colors uppercase tracking-wide truncate max-w-full">
                          {brand.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                    <Link
                      to="/brands"
                      onClick={() => setHoveredDropdown(null)}
                      className="inline-flex items-center gap-1.5 text-xs lg:text-sm xl:text-[19.5px] 2xl:text-[24.5px] font-bold text-primary-700 hover:text-primary-900 transition-colors"
                    >
                      View All Partner Brands &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            className={`text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
              location.pathname === "/contact"
                ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                : "text-gray-600"
            }`}
          >
            {t('contact')}
          </Link>

          {/* Wholesales Dropdown Wrapper */}
          <div
            className="relative py-1.5"
            onMouseEnter={() => setHoveredDropdown("wholesale")}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <Link
              to="/wholesale"
              className={`text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 lg:gap-1.5 xl:gap-2 ${
                location.pathname.startsWith("/wholesale")
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('wholesales')}
              <ChevronDown className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] xl:w-[22px] xl:h-[22px] 2xl:w-[28px] 2xl:h-[28px] opacity-60 flex-shrink-0 transition-all" />
            </Link>
            {hoveredDropdown === "wholesale" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[220px] lg:w-[280px] xl:w-[340px] 2xl:w-[420px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-3 lg:p-4 xl:p-5 2xl:p-6 flex flex-col gap-1.5 animate-slide-up">
                  <Link
                    to="/wholesale"
                    className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('order_form')}
                  </Link>
                  <Link
                    to="/wholesale/all"
                    className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('wholesale_products')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Far Right Section: Language/Currency, Search, Profile, Cart */}
        <div className="hidden md:flex md:items-center gap-3 lg:gap-6 xl:gap-8 2xl:gap-9 ml-4 lg:ml-6 xl:ml-10 2xl:ml-12">
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 text-gray-700 hover:text-primary-850 transition-colors uppercase font-semibold text-xs lg:text-xs xl:text-sm 2xl:text-base tracking-wide focus:outline-none"
              title="Select Country"
            >
              <Globe className="h-[18px] w-[18px] lg:h-[18px] lg:w-[18px] xl:h-[22px] xl:w-[22px] 2xl:h-[26px] 2xl:w-[26px] text-gray-500 flex-shrink-0 transition-all" />
              <span className="text-xs lg:text-xs xl:text-sm 2xl:text-base">{COUNTRIES.find(c => c.code === country)?.flag}</span>
              <span className="text-xs lg:text-xs xl:text-sm 2xl:text-base font-bold">{COUNTRIES.find(c => c.code === country)?.name}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute right-0 mt-3 w-[260px] lg:w-[320px] xl:w-[380px] 2xl:w-[440px] rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-3 lg:p-4 xl:p-5 2xl:p-6 z-50 flex flex-col gap-2.5 animate-slide-up">
                <h4 className="text-[10px] lg:text-xs xl:text-xs 2xl:text-sm font-bold uppercase tracking-wider text-gray-400 px-3.5 py-2 border-b mb-1.5">Select Country</h4>
                <div className="max-h-72 lg:max-h-80 xl:max-h-96 2xl:max-h-[480px] overflow-y-auto space-y-1.5 scrollbar-thin">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountry(c.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 lg:px-4 lg:py-3 xl:px-5 xl:py-3.5 2xl:px-6 2xl:py-4 text-xs lg:text-sm xl:text-sm 2xl:text-base font-semibold rounded-xl transition-colors ${
                        country === c.code
                          ? "bg-primary-50 text-primary-800"
                          : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3 lg:gap-3.5 xl:gap-4 2xl:gap-5">
                        <span className="text-sm lg:text-base xl:text-base 2xl:text-lg">{c.flag}</span>
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[10px] lg:text-[10px] xl:text-[11px] 2xl:text-xs text-gray-400 font-normal uppercase">({c.language} / {c.currency})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setShowBigSearch(true)}
            className="text-gray-700 hover:text-primary-850 transition-colors focus:outline-none flex items-center"
            title={t("search_catalog")}
          >
            <Search className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px] xl:h-[30px] xl:w-[30px] 2xl:h-[38px] 2xl:w-[38px] flex-shrink-0 transition-all" />
          </button>

          {/* Profile Trigger Wrapper */}
          <div
            className="relative py-2"
            onMouseEnter={() => setHoveredDropdown("profile")}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <button
              onClick={() => navigate(isLoggedIn ? "/my-page" : "/login")}
              className="text-gray-700 hover:text-primary-850 transition-colors focus:outline-none flex items-center"
              title={isLoggedIn ? t("my_account") : t("login")}
            >
              <User className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px] xl:h-[30px] xl:w-[30px] 2xl:h-[38px] 2xl:w-[38px] flex-shrink-0 transition-all" />
            </button>
            {hoveredDropdown === "profile" && (
              <div className="absolute right-0 top-full pt-2 z-50 w-[220px] lg:w-[280px] xl:w-[340px] 2xl:w-[420px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-3 lg:p-4 xl:p-5 2xl:p-6 flex flex-col gap-1.5 animate-slide-up">
                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      onClick={() => setHoveredDropdown(null)}
                      className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
                    >
                      {t("login")}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/my-page"
                        onClick={() => setHoveredDropdown(null)}
                        className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
                      >
                        {userFirstName ? `${userFirstName}'s Account` : t("account")}
                      </Link>
                      <button
                        onClick={() => {
                          setHoveredDropdown(null);
                          const email = localStorage.getItem("userEmail") || "";
                          saveAndClearCartForAccount(email);
                          localStorage.removeItem("isLoggedIn");
                          localStorage.removeItem("userType");
                          localStorage.removeItem("userEmail");
                          localStorage.removeItem("userFirstName");
                          window.dispatchEvent(new Event("storage"));
                          navigate("/");
                        }}
                        className="px-4 py-3 lg:px-5 lg:py-3.5 xl:px-6 xl:py-4 2xl:px-8 2xl:py-5 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold rounded-xl text-red-650 hover:bg-red-50 transition-colors block text-left w-full cursor-pointer"
                      >
                        {t("sign_out")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger Wrapper with dynamic Red Badge and hover dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setHoveredDropdown("cart")}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <button
              onClick={() => navigate(isLoggedIn ? "/cart" : "/login")}
              className="text-gray-700 hover:text-primary-850 transition-colors relative flex items-center focus:outline-none"
              title={t("cart")}
            >
              <ShoppingBag className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px] xl:h-[30px] xl:w-[30px] 2xl:h-[38px] 2xl:w-[38px] flex-shrink-0 transition-all" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-[18px] w-[18px] lg:h-[22px] lg:w-[22px] xl:h-[26px] xl:w-[26px] 2xl:h-[32px] 2xl:w-[32px] flex items-center justify-center text-[10px] lg:text-[12px] xl:text-[14px] 2xl:text-[17px] font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            {hoveredDropdown === "cart" && (
              <div className="absolute right-0 top-full pt-2 z-50 w-[360px] lg:w-[460px] xl:w-[560px] 2xl:w-[700px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-4 lg:p-6 xl:p-8 2xl:p-10 flex flex-col gap-4 lg:gap-5 xl:gap-6 2xl:gap-8 animate-slide-up">
                  <h4 className="text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-bold text-gray-900 border-b border-gray-100 pb-3 lg:pb-4 xl:pb-5 2xl:pb-6">
                    {t("cart_items")} ({cartCount})
                  </h4>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-4 text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] text-gray-400">
                      {t("empty_cart")}
                    </div>
                  ) : (
                    <>
                      <div className="max-h-48 lg:max-h-64 xl:max-h-[300px] 2xl:max-h-[380px] overflow-y-auto space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-8 pr-1 scrollbar-thin">
                        {cartItems.map((item, idx) => (
                          <div key={item.id + (item.optionValue || idx)} className="flex items-center gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                            <div className="w-14 h-14 lg:w-18 lg:h-18 xl:w-[88px] xl:h-[88px] 2xl:w-[110px] 2xl:h-[110px] rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                              <img src={item.image || "/placeholder-product.svg"} alt="" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-xs lg:text-sm xl:text-[16px] 2xl:text-[19.5px] font-bold text-gray-900 truncate">
                                {getLiveInventory().find(p => p.id === item.id) ? getLocalizedProduct(getLiveInventory().find(p => p.id === item.id)).name : item.name}
                              </p>
                              <p className="text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-gray-400 truncate">
                                {item.brand} {item.optionValue ? `| ${item.optionValue}` : ""}
                              </p>
                              <p className="text-[11px] lg:text-xs xl:text-[16px] 2xl:text-[19.5px] text-primary-700 font-semibold mt-0.5">
                                {item.quantity} x {formatPrice(item.price, item.currencyPrices)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 lg:pt-5 xl:pt-6 2xl:pt-8 flex items-center justify-between">
                        <span className="text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-bold text-gray-500">{t("total_price")}</span>
                        <span className="text-base lg:text-[19.5px] 2xl:text-[26px] font-bold text-primary-900">
                          {formatPrice(cartTotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setHoveredDropdown(null);
                          navigate(isLoggedIn ? "/cart" : "/login");
                        }}
                        className="w-full text-center py-3.5 lg:py-4 xl:py-4.5 2xl:py-5.5 bg-primary-800 text-white rounded-xl text-sm lg:text-base xl:text-[19.5px] 2xl:text-[24.5px] font-semibold hover:bg-primary-900 transition-colors shadow-sm mt-1 cursor-pointer"
                      >
                        {t("view_full_cart")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
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
              <div className="mt-8 space-y-1.5">
                {/* Home */}
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-all ${
                    location.pathname === "/" && activeSection === "home"
                      ? "text-primary-800 bg-primary-50/70"
                      : "text-gray-700 hover:text-primary-700 hover:bg-gray-50/50"
                  }`}
                >
                  {t('home')}
                </Link>

                {/* Products */}
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-all ${
                    location.pathname === "/shop" && !searchParams.get("category") && !searchParams.get("brand")
                      ? "text-primary-800 bg-primary-50/70"
                      : "text-gray-700 hover:text-primary-700 hover:bg-gray-50/50"
                  }`}
                >
                  {t('products')}
                </Link>

                {/* Categories Accordion */}
                <div>
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold text-gray-700 hover:text-primary-700 hover:bg-gray-50/50 transition-all focus:outline-none"
                  >
                    <span>{t('categories')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCategoriesOpen && (
                    <div className="pl-6 pr-4 py-1.5 space-y-1 bg-primary-50/30 rounded-xl mt-1 ml-4 border-l border-primary-100">
                      <Link
                        to="/shop"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('all')}
                      </Link>
                      <Link
                        to="/shop?category=skincare"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('skincare')}
                      </Link>
                      <Link
                        to="/shop?category=makeup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('makeup')}
                      </Link>
                      <Link
                        to="/shop?category=haircare"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('hair_care')}
                      </Link>
                      <Link
                        to="/shop?category=bodycare"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('body_care')}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Brands */}
                <Link
                  to="/brands"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-all ${
                    location.pathname === "/brands"
                      ? "text-primary-800 bg-primary-50/70"
                      : "text-gray-700 hover:text-primary-700 hover:bg-gray-50/50"
                  }`}
                >
                  {t('brands')}
                </Link>

                {/* Contact */}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-base font-semibold transition-all ${
                    location.pathname === "/contact"
                      ? "text-primary-800 bg-primary-50/70"
                      : "text-gray-700 hover:text-primary-700 hover:bg-gray-50/50"
                  }`}
                >
                  {t('contact')}
                </Link>

                {/* Wholesales Accordion */}
                <div>
                  <button
                    onClick={() => setMobileWholesaleOpen(!mobileWholesaleOpen)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold text-gray-700 hover:text-primary-700 hover:bg-gray-50/50 transition-all focus:outline-none"
                  >
                    <span>{t('wholesales')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileWholesaleOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileWholesaleOpen && (
                    <div className="pl-6 pr-4 py-1.5 space-y-1 bg-primary-50/30 rounded-xl mt-1 ml-4 border-l border-primary-100">
                      <Link
                        to="/wholesale"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('order_form')}
                      </Link>
                      <Link
                        to="/wholesale/all"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        {t('wholesale_products')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Footer Utilities and CTA */}
            <div className="pb-8 pt-6 border-t border-gray-100 space-y-6">
              {/* Mobile Country Selection */}
              <div className="border-b border-gray-55 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Select Country</span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-lg p-2 focus:outline-none text-gray-700"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.language} / {c.currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Utility shortcuts */}
              <div className="flex gap-4">
                <button 
                  onClick={() => { 
                    setMobileMenuOpen(false); 
                    setShowBigSearch(true); 
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-750 flex items-center justify-center gap-1.5 bg-gray-50/30"
                >
                  <Search className="w-4 h-4" /> {t('search_catalog')}
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate(isLoggedIn ? "/my-page" : "/login"); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-750 flex items-center justify-center gap-1.5 bg-gray-50/30"
                >
                  <User className="w-4 h-4" /> {isLoggedIn ? t('account') : t('login')}
                </button>
              </div>

              {/* Cart CTA */}
              <button
                onClick={() => { setMobileMenuOpen(false); navigate(isLoggedIn ? "/cart" : "/login"); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-800 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white hover:bg-primary-900 shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {t('cart')} ({cartCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Big Search Overlay */}
      {showBigSearch && (
        <div className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xl z-50 animate-slide-down">
          <div className="mx-auto max-w-4xl px-6 py-10 relative">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  setShowBigSearch(false);
                }
              }} 
              className="flex items-center gap-4 border-b-2 border-primary-100 focus-within:border-primary-650 transition-colors pb-2"
            >
              <Search className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_items_brands")}
                className="w-full text-xl font-medium bg-transparent border-0 focus:ring-0 placeholder:text-gray-400 py-1 outline-none focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowBigSearch(false);
                  setSearchQuery("");
                }}
                className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all focus:outline-none flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </form>
            
            {/* Quick Links / Suggestions for a premium e-commerce feel */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">{t("trending")}:</span>
              {["Beauty of Joseon", "Manyo", "Torriden", "Medicube", "FWEE", "Aestura"].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSearchQuery(brand);
                    navigate(`/shop?search=${encodeURIComponent(brand)}`);
                    setShowBigSearch(false);
                  }}
                  className="px-3.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-800 font-semibold rounded-full transition-all hover:scale-105"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
