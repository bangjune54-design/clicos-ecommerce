import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, X, Globe, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { saveAndClearCartForAccount } from "../../utils/cart";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Dynamic e-commerce states
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-md py-4"
          : "bg-transparent py-7"
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
            <span className="text-[33px] font-serif font-bold tracking-wider text-primary-900 group-hover:text-primary-700 transition-colors">
              CLICOS
            </span>
          </Link>
        </div>

        {/* Desktop Menu (Home, Products, Categories, Brands, Contact, Wholesales) */}
        <div className="hidden md:flex md:gap-x-10 items-center">
          {/* Home */}
          <Link
            to="/"
            onClick={(e) => {
              if (isLandingPage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`text-[16.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
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
            className={`text-[16.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
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
              className={`text-[16.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 ${
                location.pathname === "/shop" && searchParams.get("category")
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('categories')}
              <ChevronDown className="w-4 h-4 opacity-60" />
            </Link>
            {hoveredDropdown === "categories" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-48">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2 flex flex-col gap-0.5 animate-slide-up">
                  <Link
                    to="/shop?category=skincare"
                    className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('skincare')}
                  </Link>
                  <Link
                    to="/shop?category=makeup"
                    className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('makeup')}
                  </Link>
                  <Link
                    to="/shop?category=haircare"
                    className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('hair_care')}
                  </Link>
                  <Link
                    to="/shop?category=bodycare"
                    className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('body_care')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Brands */}
          <Link
            to="/brands"
            className={`text-[16.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
              location.pathname === "/brands" || (location.pathname === "/shop" && searchParams.get("brand"))
                ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                : "text-gray-600"
            }`}
          >
            {t('brands')}
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className={`text-[16.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
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
              className={`text-[16.5px] font-semibold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 ${
                location.pathname.startsWith("/wholesale")
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('wholesales')}
              <ChevronDown className="w-4 h-4 opacity-60" />
            </Link>
            {hoveredDropdown === "wholesale" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-48">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2 flex flex-col gap-0.5 animate-slide-up">
                  <Link
                    to="/wholesale"
                    className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('order_form')}
                  </Link>
                  <Link
                    to="/wholesale/all"
                    className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('wholesale_products')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Far Right Section: Language/Currency, Search, Profile, Cart */}
        <div className="hidden md:flex md:flex-1 md:justify-end md:items-center gap-6">
          {/* Language / Currency Toggle */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 text-gray-700 hover:text-primary-850 transition-colors uppercase font-semibold text-xs tracking-wide focus:outline-none"
              title={t("language") + " / " + t("currency")}
            >
              <Globe className="h-5 w-5" />
              <span className="text-[14px]">{language}</span>
              <span className="text-[10px] text-gray-400 font-normal">|</span>
              <span className="text-[14px]">{currency}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-gray-100 shadow-2xl p-4 z-50 flex flex-col gap-4 animate-slide-up">
                {/* Language Picker */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 border-b pb-1.5">{t("language")}</h4>
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
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 border-b pb-1.5">{t("currency")}</h4>
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
          <button
            onClick={() => setShowBigSearch(true)}
            className="text-gray-700 hover:text-primary-850 transition-colors focus:outline-none flex items-center"
            title={t("search_catalog")}
          >
            <Search className="h-5 w-5" />
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
              <User className="h-5 w-5" />
            </button>
            {hoveredDropdown === "profile" && (
              <div className="absolute right-0 top-full pt-2 z-50 w-40">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2 flex flex-col gap-0.5 animate-slide-up">
                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      onClick={() => setHoveredDropdown(null)}
                      className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
                    >
                      {t("login")}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/my-page"
                        onClick={() => setHoveredDropdown(null)}
                        className="px-3 py-2 text-xs font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
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
                        className="px-3 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 transition-colors block text-left w-full"
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
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            {hoveredDropdown === "cart" && (
              <div className="absolute right-0 top-full pt-2 z-50 w-72">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-4 flex flex-col gap-3 animate-slide-up">
                  <h4 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
                    {t("cart_items")} ({cartCount})
                  </h4>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-4 text-xs text-gray-400">
                      {t("empty_cart")}
                    </div>
                  ) : (
                    <>
                      <div className="max-h-48 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {cartItems.map((item, idx) => (
                          <div key={item.id + (item.optionValue || idx)} className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                              <img src={item.image || "/placeholder-product.svg"} alt="" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-[11px] font-bold text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-[9px] text-gray-400 truncate">
                                {item.brand} {item.optionValue ? `| ${item.optionValue}` : ""}
                              </p>
                              <p className="text-[10px] text-primary-700 font-semibold mt-0.5">
                                {item.quantity} x {formatPrice(item.price, item.currencyPrices)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">{t("total_price")}</span>
                        <span className="text-sm font-bold text-primary-900">
                          {formatPrice(cartTotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setHoveredDropdown(null);
                          navigate(isLoggedIn ? "/cart" : "/login");
                        }}
                        className="w-full text-center py-2.5 bg-primary-800 text-white rounded-xl text-xs font-semibold hover:bg-primary-900 transition-colors shadow-sm mt-1"
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
              {/* Language & Currency Selection */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('language')}</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-lg p-2 focus:outline-none"
                  >
                    {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('currency')}</span>
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
