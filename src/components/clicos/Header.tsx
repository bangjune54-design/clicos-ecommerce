import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, X, Globe, Search, User, ShoppingBag, ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useCountry, COUNTRIES } from "../../contexts/CountryContext";
import { saveAndClearCartForAccount } from "../../utils/cart";
import { getLiveBrandsForCustomers, getLiveInventoryForCustomers } from "../../utils/inventory";

const getFilteredCategories = () => {
  const uniqueCats = Array.from(
    new Set(
      getLiveInventoryForCustomers()
        .map(p => p.category?.trim())
        .filter(Boolean)
    )
  );

  const hierarchy = ["Skincare", "Makeup", "Hair Care", "Body Care"];
  const subcategoriesMap: Record<string, string[]> = {
    "Skincare": ["Sun Care", "Cleansing", "Serum & Ampoule", "Cream", "Toner", "Mask"],
    "Makeup": ["Lip Makeup", "Face Makeup"]
  };

  const filtered = hierarchy.filter(catName => {
    const isParentPresent = uniqueCats.some(uc => uc.toLowerCase() === catName.toLowerCase());
    const isAnySubPresent = subcategoriesMap[catName]?.some(sub => 
      uniqueCats.some(uc => uc.toLowerCase() === sub.toLowerCase())
    );
    return isParentPresent || isAnySubPresent;
  });

  const hierarchyNames = new Set([
    ...hierarchy.map(c => c.toLowerCase()),
    ...Object.values(subcategoriesMap).flat().map(c => c.toLowerCase())
  ]);

  const custom = uniqueCats
    .filter(uc => !hierarchyNames.has(uc.toLowerCase()))
    .map(uc => uc.charAt(0).toUpperCase() + uc.slice(1));

  return [...filtered, ...custom];
};

const getSubcategories = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  const uniqueCats = Array.from(
    new Set(
      getLiveInventoryForCustomers()
        .map(p => p.category?.trim())
        .filter(Boolean)
    )
  );

  let subs: string[] = [];
  if (name === "skincare") {
    subs = ["Sun Care", "Cleansing", "Serum & Ampoule", "Cream", "Toner", "Mask"];
  } else if (name === "makeup") {
    subs = ["Lip Makeup", "Face Makeup"];
  }

  return subs.filter(sub => uniqueCats.some(uc => uc.toLowerCase() === sub.toLowerCase()));
};

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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
  const [mobileWholesaleOpen, setMobileWholesaleOpen] = useState(false);

  // Mobile horizontal bar dropdown states & refs
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileWholesalesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileWholesalesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCartDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCartButtonRef = useRef<HTMLButtonElement>(null);
  const [mobileCategoriesDropdownOpen, setMobileCategoriesDropdownOpen] = useState(false);
  const [mobileWholesalesDropdownOpen, setMobileWholesalesDropdownOpen] = useState(false);
  const [mobileProfileDropdownOpen, setMobileProfileDropdownOpen] = useState(false);
  const [mobileCartDropdownOpen, setMobileCartDropdownOpen] = useState(false);
  const [mobileBrandsDropdownOpen, setMobileBrandsDropdownOpen] = useState(false);
  
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

  const [liveBrands, setLiveBrands] = useState(() => getLiveBrandsForCustomers());
  const [uniqueCategories, setUniqueCategories] = useState(() => getFilteredCategories());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      const isOutsideDesktop = !dropdownRef.current || !dropdownRef.current.contains(target);
      const isOutsideMobile = !mobileDropdownRef.current || !mobileDropdownRef.current.contains(target);
      if (isOutsideDesktop && isOutsideMobile) {
        setShowLangDropdown(false);
      }
      
      if (
        mobileCategoriesDropdownRef.current && 
        !mobileCategoriesDropdownRef.current.contains(target) &&
        (!mobileCategoriesButtonRef.current || !mobileCategoriesButtonRef.current.contains(target))
      ) {
        setMobileCategoriesDropdownOpen(false);
      }
      if (
        mobileWholesalesDropdownRef.current && 
        !mobileWholesalesDropdownRef.current.contains(target) &&
        (!mobileWholesalesButtonRef.current || !mobileWholesalesButtonRef.current.contains(target))
      ) {
        setMobileWholesalesDropdownOpen(false);
      }
      if (
        mobileProfileDropdownRef.current && 
        !mobileProfileDropdownRef.current.contains(target) &&
        (!mobileProfileButtonRef.current || !mobileProfileButtonRef.current.contains(target))
      ) {
        setMobileProfileDropdownOpen(false);
      }
      if (
        mobileCartDropdownRef.current && 
        !mobileCartDropdownRef.current.contains(target) &&
        (!mobileCartButtonRef.current || !mobileCartButtonRef.current.contains(target))
      ) {
        setMobileCartDropdownOpen(false);
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
      setLiveBrands(getLiveBrandsForCustomers());
      setUniqueCategories(Array.from(new Set(getLiveInventoryForCustomers().map(p => p.category).filter(Boolean))));
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
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-md py-1"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-1.5"
      }`}
    >
      <nav className="hidden md:flex mx-auto max-w-[1800px] px-6 lg:px-8 items-center justify-between">
        {/* Logo */}
        <div className="flex lg:flex-initial mr-4 lg:mr-8 xl:mr-12">
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
            <span className="text-xl lg:text-2xl font-serif font-bold tracking-wider text-primary-900 group-hover:text-primary-700 transition-colors">
              KOSMERA
            </span>
          </Link>
        </div>

        {/* Desktop Menu (Home, Products, Categories, Brands, Contact, Wholesales) */}
        <div className="hidden md:flex md:gap-x-4 lg:gap-x-7 xl:gap-x-9 items-center mr-auto">
          {/* Home */}
          <Link
            to="/"
            onClick={(e) => {
              if (isLandingPage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`text-sm lg:text-base font-bold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
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
            className={`text-sm lg:text-base font-bold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
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
              className={`text-sm lg:text-base font-bold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 ${
                location.pathname === "/shop" && searchParams.get("category")
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('categories')}
              <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0 transition-all" />
            </Link>
            {hoveredDropdown === "categories" && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 flex items-start gap-3"
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Main Categories Panel */}
                <div className="w-[140px] lg:w-[160px] rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2 flex flex-col gap-1 animate-slide-up">
                  <Link
                    to="/shop"
                    onClick={() => setHoveredDropdown(null)}
                    className="px-3 py-1.5 text-xs lg:text-sm font-bold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors flex items-center justify-center border-b border-gray-100 pb-1.5 mb-1"
                  >
                    {t('all')}
                  </Link>
                  {uniqueCategories.map((cat: any) => {
                    const hasSubs = getSubcategories(cat).length > 0;
                    return (
                      <Link
                        key={cat}
                        to={`/shop?category=${encodeURIComponent(cat.toLowerCase().replace(/ & /g, "").replace(/ /g, ""))}`}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onClick={() => setHoveredDropdown(null)}
                        className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-xl transition-colors flex items-center justify-between ${
                          hoveredCategory === cat
                            ? "bg-primary-50 text-primary-800"
                            : "text-gray-700 hover:bg-primary-50 hover:text-primary-800"
                        }`}
                      >
                        <span className="truncate">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        {hasSubs && (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Subcategories Flyout Panel */}
                {hoveredCategory && getSubcategories(hoveredCategory).length > 0 && (
                  <div className="w-[140px] lg:w-[160px] rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2 flex flex-col gap-1 animate-slide-up">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5 mb-1">
                      {hoveredCategory} Categories
                    </div>
                    {getSubcategories(hoveredCategory).map((sub: string) => (
                      <Link
                        key={sub}
                        to={`/shop?category=${encodeURIComponent(sub.toLowerCase().replace(/ & /g, "").replace(/ /g, ""))}`}
                        onClick={() => {
                          setHoveredDropdown(null);
                          setHoveredCategory(null);
                        }}
                        className="px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors flex items-center justify-between"
                      >
                        <span>{sub}</span>
                      </Link>
                    ))}
                  </div>
                )}
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
              className={`text-sm lg:text-base font-bold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 ${
                location.pathname === "/brands" || (location.pathname === "/shop" && searchParams.get("brand"))
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('brands')}
              <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0 transition-all" />
            </Link>
            {hoveredDropdown === "brands" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[420px] lg:w-[480px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-4 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("our_partner_brands")}</h4>
                    <span className="text-[10px] text-primary-700 font-semibold bg-primary-50 px-2 py-0.5 rounded-full uppercase">{t("direct_contracts")}</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {getLiveBrandsForCustomers().map((brand) => (
                      <Link
                        key={brand.name}
                        to={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                        className="flex flex-col items-center p-1 rounded-xl hover:bg-primary-50/60 transition-all duration-200 group text-center"
                        onClick={() => setHoveredDropdown(null)}
                      >
                        <div className="w-16 h-11 lg:w-20 lg:h-14 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden mb-1 group-hover:scale-105 transition-transform duration-300 shadow-sm relative shrink-0">
                          {brand.image ? (
                            <img src={brand.image} alt={brand.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-serif font-bold text-primary-900/60 uppercase tracking-wider">
                              {brand.name}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] lg:text-xs font-bold text-gray-900 group-hover:text-primary-800 transition-colors uppercase tracking-wide truncate max-w-full">
                          {brand.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                    <Link
                      to="/brands"
                      onClick={() => setHoveredDropdown(null)}
                      className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-bold text-primary-700 hover:text-primary-900 transition-colors"
                    >
                      {t("view_all_partner_brands")}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            className={`text-sm lg:text-base font-bold tracking-wide transition-all duration-200 hover:text-primary-600 relative py-1.5 ${
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
              className={`text-sm lg:text-base font-bold tracking-wide transition-all duration-200 hover:text-primary-600 flex items-center gap-1 ${
                location.pathname.startsWith("/wholesale")
                  ? "text-primary-800 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full"
                  : "text-gray-600"
              }`}
            >
              {t('wholesales')}
              <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0 transition-all" />
            </Link>
            {hoveredDropdown === "wholesale" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[150px] lg:w-[170px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2 flex flex-col gap-1 animate-slide-up">
                  <Link
                    to="/wholesale"
                    className="px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {t('order_form')}
                  </Link>
                  <Link
                    to="/wholesale/all"
                    className="px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
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
              title={t("select_country")}
            >
              <Globe className="h-[18px] w-[18px] lg:h-[18px] lg:w-[18px] xl:h-[22px] xl:w-[22px] 2xl:h-[26px] 2xl:w-[26px] text-gray-500 flex-shrink-0 transition-all" />
              <span className="text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-none">{COUNTRIES.find(c => c.code === country)?.flag}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute right-0 mt-3 w-[160px] lg:w-[190px] xl:w-[220px] 2xl:w-[250px] rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 z-50 flex flex-col gap-2 animate-slide-up">
                <h4 className="text-[10px] lg:text-xs xl:text-xs 2xl:text-sm font-bold uppercase tracking-wider text-gray-400 px-3.5 py-2 border-b mb-1.5">{t("select_country")}</h4>
                <div className="max-h-72 lg:max-h-80 xl:max-h-96 2xl:max-h-[480px] overflow-y-auto space-y-1.5 scrollbar-thin">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountry(c.code);
                        setLanguage(c.language);
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
            <Search className="h-[16px] w-[16px] lg:h-[18px] lg:w-[18px] xl:h-[22px] xl:w-[22px] 2xl:h-[26px] 2xl:w-[26px] flex-shrink-0 transition-all" />
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
              <User className="h-[16px] w-[16px] lg:h-[18px] lg:w-[18px] xl:h-[22px] xl:w-[22px] 2xl:h-[26px] 2xl:w-[26px] flex-shrink-0 transition-all" />
            </button>
            {hoveredDropdown === "profile" && (
              <div className="absolute right-0 top-full pt-2 z-50 w-[110px] lg:w-[125px] xl:w-[140px] 2xl:w-[155px]">
                <div className="rounded-xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-1.5 lg:p-2 xl:p-2.5 2xl:p-3 flex flex-col gap-1 animate-slide-up">
                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      onClick={() => setHoveredDropdown(null)}
                      className="px-3 py-2 lg:px-3.5 lg:py-2.5 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5 text-xs lg:text-sm xl:text-[15px] 2xl:text-[18px] font-semibold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
                    >
                      {t("login")}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/my-page"
                        onClick={() => setHoveredDropdown(null)}
                        className="px-3 py-2 lg:px-3.5 lg:py-2.5 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5 text-xs lg:text-sm xl:text-[15px] 2xl:text-[18px] font-semibold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
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
                        className="px-3 py-2 lg:px-3.5 lg:py-2.5 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5 text-xs lg:text-sm xl:text-[15px] 2xl:text-[18px] font-semibold rounded-lg text-red-650 hover:bg-red-50 transition-colors block text-left w-full cursor-pointer"
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
              <ShoppingBag className="h-[16px] w-[16px] lg:h-[18px] lg:w-[18px] xl:h-[22px] xl:w-[22px] 2xl:h-[26px] 2xl:w-[26px] flex-shrink-0 transition-all" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-[15px] w-[15px] lg:h-[18px] lg:w-[18px] xl:h-[20px] xl:w-[20px] 2xl:h-[24px] 2xl:w-[24px] flex items-center justify-center text-[9px] lg:text-[10px] xl:text-[12px] 2xl:text-[14px] font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            {hoveredDropdown === "cart" && (
              <div className="absolute right-0 top-full pt-2 z-50 w-[220px] lg:w-[270px] xl:w-[320px] 2xl:w-[370px]">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-primary-100 shadow-2xl p-3 lg:p-4 xl:p-5 2xl:p-6 flex flex-col gap-2.5 lg:gap-3.5 xl:gap-4 animate-slide-up">
                  <h4 className="text-xs lg:text-sm xl:text-base font-bold text-gray-900 border-b border-gray-100 pb-2 lg:pb-2.5">
                    {t("cart_items")} ({cartCount})
                  </h4>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-3 text-xs lg:text-sm text-gray-400">
                      {t("empty_cart")}
                    </div>
                  ) : (
                    <>
                      <div className="max-h-40 lg:max-h-52 xl:max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {cartItems.map((item, idx) => (
                          <div key={item.id + (item.optionValue || idx)} className="flex items-center gap-2.5 lg:gap-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg bg-white border border-gray-100 p-0.5 flex items-center justify-center flex-shrink-0">
                              <img src={item.image || "/placeholder-product.svg"} alt="" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-xs lg:text-sm xl:text-[16px] 2xl:text-[19.5px] font-bold text-gray-900 truncate">
                                {getLiveInventoryForCustomers().find(p => p.id === item.id) ? getLocalizedProduct(getLiveInventoryForCustomers().find(p => p.id === item.id)).name : item.name}
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

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden flex-col gap-2.5 px-4 w-full">
        {/* Row 1: Logo & Icons */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
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
            <span className="text-sm sm:text-base font-serif font-bold tracking-wider text-primary-900">
              KOSMERA
            </span>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Country/Language Selector */}
            <div className="relative font-sans" ref={mobileDropdownRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 text-gray-700 focus:outline-none"
                title="Select Country"
              >
                <Globe className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="text-base font-bold leading-none">{COUNTRIES.find(c => c.code === country)?.flag}</span>
              </button>
              
              {showLangDropdown && (
                <div className="absolute right-0 mt-3 w-[240px] rounded-xl bg-white border border-primary-100 shadow-xl p-2.5 z-50 flex flex-col gap-2 animate-slide-up">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2.5 py-1.5 border-b mb-1">Select Country</h4>
                  <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCountry(c.code);
                          setLanguage(c.language);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          country === c.code
                            ? "bg-primary-50 text-primary-800"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-normal uppercase">({c.currency})</span>
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
              <Search className="h-5 w-5 text-gray-500" />
            </button>

            {/* Profile Trigger */}
            <div className="relative font-sans">
              <button
                ref={mobileProfileButtonRef}
                onClick={() => {
                  setMobileProfileDropdownOpen(!mobileProfileDropdownOpen);
                  setMobileCartDropdownOpen(false);
                  setMobileCategoriesDropdownOpen(false);
                  setMobileBrandsDropdownOpen(false);
                  setMobileWholesalesDropdownOpen(false);
                }}
                className="text-gray-700 hover:text-primary-850 transition-colors focus:outline-none flex items-center"
                title={isLoggedIn ? t("my_account") : t("login")}
              >
                <User className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Trigger */}
            <div className="relative font-sans">
              <button
                ref={mobileCartButtonRef}
                onClick={() => {
                  setMobileCartDropdownOpen(!mobileCartDropdownOpen);
                  setMobileProfileDropdownOpen(false);
                  setMobileCategoriesDropdownOpen(false);
                  setMobileBrandsDropdownOpen(false);
                  setMobileWholesalesDropdownOpen(false);
                }}
                className="text-gray-700 hover:text-primary-850 transition-colors relative flex items-center focus:outline-none"
                title={t("cart")}
              >
                <ShoppingBag className="h-5 w-5 text-gray-500" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Tabs */}
        <div 
          className="flex items-center gap-4 overflow-x-auto whitespace-nowrap py-1 border-t border-gray-100 scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Home */}
          <Link
            to="/"
            onClick={(e) => {
              if (isLandingPage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-primary-700 py-1 ${
              location.pathname === "/" && activeSection === "home"
                ? "text-primary-855 border-b-2 border-primary-600 pb-0.5"
                : "text-gray-500"
            }`}
          >
            {t('home')}
          </Link>
 
          {/* Products */}
          <Link
            to="/shop"
            className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-primary-700 py-1 ${
              location.pathname === "/shop" && !searchParams.get("category") && !searchParams.get("brand")
                ? "text-primary-855 border-b-2 border-primary-600 pb-0.5"
                : "text-gray-500"
            }`}
          >
            {t('products')}
          </Link>
 
          {/* Categories */}
          <div className="relative font-sans">
            <button
              ref={mobileCategoriesButtonRef}
              onClick={() => {
                setMobileCategoriesDropdownOpen(!mobileCategoriesDropdownOpen);
                setMobileWholesalesDropdownOpen(false);
                setMobileBrandsDropdownOpen(false);
              }}
              className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-primary-700 py-1 flex items-center gap-0.5 focus:outline-none ${
                location.pathname === "/shop" && searchParams.get("category")
                  ? "text-primary-855 border-b-2 border-primary-600 pb-0.5"
                  : "text-gray-500"
              }`}
            >
              <span>{t('categories')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
 
          {/* Brands */}
          <div className="relative font-sans">
            <button
              onClick={() => {
                setMobileBrandsDropdownOpen(!mobileBrandsDropdownOpen);
                setMobileCategoriesDropdownOpen(false);
                setMobileWholesalesDropdownOpen(false);
              }}
              className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-primary-700 py-1 flex items-center gap-0.5 focus:outline-none ${
                location.pathname === "/brands" || searchParams.get("brand")
                  ? "text-primary-855 border-b-2 border-primary-600 pb-0.5"
                  : "text-gray-500"
              }`}
            >
              <span>{t('brands')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
 
          {/* Contact */}
          <Link
            to="/contact"
            className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-primary-700 py-1 ${
              location.pathname === "/contact" ? "text-primary-855 border-b-2 border-primary-600 pb-0.5" : "text-gray-500"
            }`}
          >
            {t('contact')}
          </Link>
 
          {/* Wholesales */}
          <div className="relative font-sans">
            <button
              ref={mobileWholesalesButtonRef}
              onClick={() => {
                setMobileWholesalesDropdownOpen(!mobileWholesalesDropdownOpen);
                setMobileCategoriesDropdownOpen(false);
                setMobileBrandsDropdownOpen(false);
              }}
              className={`text-xs font-bold tracking-wide uppercase transition-colors hover:text-primary-700 py-1 flex items-center gap-0.5 focus:outline-none ${
                location.pathname.startsWith("/wholesale")
                  ? "text-primary-855 border-b-2 border-primary-600 pb-0.5"
                  : "text-gray-500"
              }`}
            >
              <span>{t('wholesales')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdowns (rendered outside overflow-x-auto scroll container to prevent clipping on mobile viewports) */}
      {mobileCategoriesDropdownOpen && (
        <div 
          ref={mobileCategoriesDropdownRef}
          className="absolute top-full left-4 mt-2 z-50 w-[200px] rounded-xl bg-white border border-primary-100 shadow-xl p-2 flex flex-col gap-1 animate-slide-up"
        >
          <Link
            to="/shop"
            onClick={() => setMobileCategoriesDropdownOpen(false)}
            className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
          >
            {t('all')}
          </Link>
          {uniqueCategories.map((cat: any) => (
            <Link
              key={cat}
              to={`/shop?category=${encodeURIComponent(cat.toLowerCase().replace(/ & /g, "").replace(/ /g, ""))}`}
              onClick={() => setMobileCategoriesDropdownOpen(false)}
              className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors flex items-center gap-3"
            >
              <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            </Link>
          ))}
        </div>
      )}

      {mobileBrandsDropdownOpen && (
        <div 
          className="absolute top-full left-1/4 mt-2 z-50 w-[200px] rounded-xl bg-white border border-primary-100 shadow-xl p-2 flex flex-col gap-1 animate-slide-up"
        >
          <Link
            to="/brands"
            onClick={() => setMobileBrandsDropdownOpen(false)}
            className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
          >
            All Brands
          </Link>
          {liveBrands.map(brand => (
            <Link
              key={brand.id}
              to={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
              onClick={() => setMobileBrandsDropdownOpen(false)}
              className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors flex items-center gap-3"
            >
              <span>{brand.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Mobile Wholesales Dropdown (rendered outside overflow-x-auto scroll container to prevent clipping on mobile viewports) */}
      {mobileWholesalesDropdownOpen && (
        <div 
          ref={mobileWholesalesDropdownRef}
          className="absolute top-full right-4 mt-2 z-50 w-[180px] rounded-xl bg-white border border-primary-100 shadow-xl p-2 flex flex-col gap-1 animate-slide-up"
        >
          <Link
            to="/wholesale"
            onClick={() => setMobileWholesalesDropdownOpen(false)}
            className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
          >
            {t('order_form')}
          </Link>
          <Link
            to="/wholesale/all"
            onClick={() => setMobileWholesalesDropdownOpen(false)}
            className="px-3 py-2 text-xs font-bold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
          >
            {t('wholesale_products')}
          </Link>
        </div>
      )}

      {/* Mobile Profile Dropdown (rendered outside overflow-x-auto scroll container to prevent clipping) */}
      {mobileProfileDropdownOpen && (
        <div 
          ref={mobileProfileDropdownRef}
          className="absolute top-[60px] right-14 z-50 w-[150px] rounded-xl bg-white border border-primary-100 shadow-xl p-2 flex flex-col gap-1 animate-slide-up"
        >
          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setMobileProfileDropdownOpen(false)}
              className="px-3 py-2 text-xs font-semibold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
            >
              {t("login")}
            </Link>
          ) : (
            <>
              <Link
                to="/my-page"
                onClick={() => setMobileProfileDropdownOpen(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors block text-left"
              >
                {userFirstName ? `${userFirstName}'s Account` : t("account")}
              </Link>
              <button
                onClick={() => {
                  setMobileProfileDropdownOpen(false);
                  localStorage.setItem("isLoggedIn", "false");
                  localStorage.removeItem("userFirstName");
                  localStorage.removeItem("userEmail");
                  localStorage.removeItem("userType");
                  saveAndClearCartForAccount();
                  setIsLoggedIn(false);
                  setUserFirstName("");
                  window.dispatchEvent(new Event("storage"));
                  navigate("/");
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg text-red-650 hover:bg-red-50 transition-colors block text-left w-full cursor-pointer"
              >
                {t("sign_out")}
              </button>
            </>
          )}
        </div>
      )}

      {/* Mobile Cart Dropdown (rendered outside overflow-x-auto scroll container to prevent clipping) */}
      {mobileCartDropdownOpen && (
        <div 
          ref={mobileCartDropdownRef}
          className="absolute top-[60px] right-4 z-50 w-[280px] rounded-xl bg-white border border-primary-100 shadow-xl p-3 flex flex-col gap-3 animate-slide-up"
        >
          <h4 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
            {t("cart_items")} ({cartCount})
          </h4>
          {cartItems.length === 0 ? (
            <div className="text-center py-2 text-xs text-gray-400">
              {t("empty_cart")}
            </div>
          ) : (
            <>
              <div className="max-h-40 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {cartItems.map((item, idx) => (
                  <div key={item.id + (item.optionValue || idx)} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded bg-white border border-gray-100 p-0.5 flex items-center justify-center flex-shrink-0">
                      <img src={item.image || "/placeholder-product.svg"} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-bold text-gray-900 truncate">
                        {getLiveInventoryForCustomers().find(p => p.id === item.id) ? getLocalizedProduct(getLiveInventoryForCustomers().find(p => p.id === item.id)).name : item.name}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate">
                        {item.brand} {item.optionValue ? `| ${item.optionValue}` : ""}
                      </p>
                      <p className="text-[9px] text-primary-700 font-semibold mt-0.5">
                        {item.quantity} x {formatPrice(item.price, item.currencyPrices)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500">{t("total_price")}</span>
                <span className="text-xs font-bold text-primary-900">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <button
                onClick={() => {
                  setMobileCartDropdownOpen(false);
                  navigate(isLoggedIn ? "/cart" : "/login");
                }}
                className="w-full text-center py-2 bg-primary-800 text-white rounded-lg text-xs font-semibold hover:bg-primary-900 transition-colors shadow-sm cursor-pointer"
              >
                {t("view_full_cart")}
              </button>
            </>
          )}
        </div>
      )}

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
                  KOSMERA
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
                      {uniqueCategories.map((cat: any) => (
                        <Link
                          key={cat}
                          to={`/shop?category=${encodeURIComponent(cat.toLowerCase().replace(/ & /g, "").replace(/ /g, ""))}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors flex items-center gap-3"
                        >
                          <span className="font-medium text-gray-800">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brands Accordion */}
                <div>
                  <button
                    onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold text-gray-700 hover:text-primary-700 hover:bg-gray-50/50 transition-all focus:outline-none"
                  >
                    <span>{t('brands')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileBrandsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileBrandsOpen && (
                    <div className="pl-6 pr-4 py-1.5 space-y-1 bg-primary-50/30 rounded-xl mt-1 ml-4 border-l border-primary-100">
                      <Link
                        to="/brands"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors"
                      >
                        All Brands
                      </Link>
                      {liveBrands.map(brand => (
                        <Link
                          key={brand.id}
                          to={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 text-sm font-semibold text-gray-600 hover:text-primary-800 transition-colors flex items-center gap-3"
                        >
                          <span className="font-medium text-gray-800">{brand.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

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
                  <User className="w-4 h-4" /> {isLoggedIn ? (userFirstName ? `${userFirstName}'s Account` : t('account')) : t('login')}
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
