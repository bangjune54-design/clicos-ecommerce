import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Globe, Search, User } from "lucide-react";
import { Button } from "../ui/Button";

import { retailProducts, b2bProductsList } from "../../pages/Shop";
import { b2bBrands } from "../../pages/WholesaleBrands";

interface NavItem {
  name: string;
  href: string;
  submenu?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { 
    name: "Shop", 
    href: "/shop",
    submenu: [
      { name: "All", href: "/shop" },
      { name: "Skincare", href: "/shop?category=skincare" },
      { name: "Makeup", href: "/shop?category=makeup" },
      { name: "Haircare", href: "/shop?category=hair-and-body" },
      { name: "Brands", href: "/brands" },
    ]
  },
  { 
    name: "Wholesale / B2B", 
    href: "/wholesale",
    submenu: [
      { name: "Order", href: "/wholesale" },
      { name: "B2B Brands", href: "/wholesale/brands" },
    ]
  },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const currencies = ["USD", "EUR", "KRW", "JPY", "GBP", "BRL"];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    // Add cart syncing logic
    const updateCartCount = () => {
      const retail = JSON.parse(localStorage.getItem('retailCart') || '[]');
      const b2b = JSON.parse(localStorage.getItem('b2bCart') || '[]');
      const retailQty = retail.reduce((sum: number, item: any) => sum + item.quantity, 0);
      const b2bQty = b2b.reduce((sum: number, item: any) => sum + item.boxQty, 0);
      setCartCount(retailQty + b2bQty);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // Filter recommendations
  // Filter recommendations
  const getRecommendations = () => {
    if (!searchQuery.trim()) return { retail: [], b2b: [], retailBrands: [], b2bBrands: [] };
    const query = searchQuery.toLowerCase();
    
    return {
      retail: retailProducts.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 3),
      b2b: b2bProductsList.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 3),
      retailBrands: b2bBrands.filter(b => b.name.toLowerCase().includes(query)).slice(0, 2),
      b2bBrands: b2bBrands.filter(b => b.name.toLowerCase().includes(query)).slice(0, 2)
    };
  };

  const recommendations = getRecommendations();
  const hasRecommendations = recommendations.retail.length > 0 || recommendations.b2b.length > 0 || recommendations.retailBrands.length > 0 || recommendations.b2bBrands.length > 0;

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">CLICOS</span>
            <div className="text-2xl font-serif font-bold tracking-tight text-primary-900">
              CLICOS
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group/nav py-6 -my-6 flex items-center">
              <Link
                to={item.href}
                className={`text-sm font-semibold leading-6 transition-colors hover:text-primary-600 ${
                  location.pathname === item.href || (location.pathname === '/' && item.href === '/') || (item.href !== '/' && location.pathname.startsWith(item.href))
                    ? "text-primary-800 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary-500"
                    : "text-gray-900"
                }`}
              >
                {item.name}
              </Link>
              {item.submenu && (
                <div className="absolute left-0 top-full mt-0 w-48 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 border border-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden transform group-hover/nav:translate-y-0 translate-y-1">
                  <div className="py-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        to={subitem.href}
                        className="block w-full px-4 py-2.5 text-left text-sm font-bold text-gray-800 hover:bg-primary-50 hover:text-primary-900 transition-colors"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-800 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {currency}
            </button>
            
            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setShowCurrencyDropdown(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-900"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex items-center" ref={searchRef}>
            {isSearchOpen ? (
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search items or brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 lg:w-64 rounded-full border border-primary-200 bg-white px-4 py-1.5 pr-8 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder-gray-400"
                  />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Search Dropdown */}
                {searchQuery.trim() && isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 lg:w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    {hasRecommendations ? (
                      <div className="py-2 max-h-96 overflow-y-auto">
                        
                        {(recommendations.retailBrands.length > 0 || recommendations.retail.length > 0) && (
                          <div className="px-4 py-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Shop (Retail)</h4>
                            
                            {/* Retail Brands */}
                            {recommendations.retailBrands.length > 0 && (
                              <div className="mb-3">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Brands</span>
                                <ul className="space-y-1">
                                  {recommendations.retailBrands.map(brand => (
                                    <li key={`retail-brand-${brand.name}`}>
                                      <Link to={`/shop?category=${encodeURIComponent(brand.name.toLowerCase())}`} onClick={() => setIsSearchOpen(false)} className="block px-2 py-1.5 text-sm font-medium text-gray-900 hover:bg-primary-50 hover:text-primary-800 rounded">
                                        {brand.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Retail Items */}
                            {recommendations.retail.length > 0 && (
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Products</span>
                                <ul className="space-y-2">
                                  {recommendations.retail.map(item => (
                                    <li key={item.id}>
                                      <Link to={`/shop`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 px-2 py-1.5 hover:bg-primary-50 rounded group">
                                        <img src={item.imageSrc} alt={item.name} className="h-8 w-8 rounded object-cover" />
                                        <div className="flex flex-col overflow-hidden">
                                          <span className="text-sm font-medium text-gray-900 group-hover:text-primary-800 truncate">{item.name}</span>
                                          <span className="text-xs text-gray-500">{item.brand}</span>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {(recommendations.b2bBrands.length > 0 || recommendations.b2b.length > 0) && (
                          <div className="px-4 py-2 border-t border-gray-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Wholesale B2B</h4>
                            
                            {/* B2B Brands */}
                            {recommendations.b2bBrands.length > 0 && (
                              <div className="mb-3">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Brands</span>
                                <ul className="space-y-1">
                                  {recommendations.b2bBrands.map(brand => (
                                    <li key={`b2b-brand-${brand.name}`}>
                                      <Link to={`/wholesale/brands/${encodeURIComponent(brand.name)}`} onClick={() => setIsSearchOpen(false)} className="block px-2 py-1.5 text-sm font-medium text-gray-900 hover:bg-primary-50 hover:text-primary-800 rounded">
                                        {brand.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* B2B Items */}
                            {recommendations.b2b.length > 0 && (
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Products</span>
                                <ul className="space-y-2">
                                  {recommendations.b2b.map(item => (
                                    <li key={item.id}>
                                      <Link to={`/wholesale/brands/${encodeURIComponent(item.brand)}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 px-2 py-1.5 hover:bg-primary-50 rounded group">
                                        <img src={item.imageSrc} alt={item.name} className="h-8 w-8 rounded object-cover" />
                                        <div className="flex flex-col overflow-hidden">
                                          <span className="text-sm font-medium text-gray-900 group-hover:text-primary-800 truncate">{item.name}</span>
                                          <span className="text-xs text-gray-500">{item.brand}</span>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="text-gray-700 hover:text-primary-800 transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <span className="sr-only">Search</span>
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="relative group/user py-6 -my-6 flex items-center">
            <button className="text-gray-700 hover:text-primary-800 transition-colors">
              <span className="sr-only">Account</span>
              <User className="h-5 w-5" />
            </button>
            <div className="absolute right-0 top-full mt-0 w-40 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 border border-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden transform group-hover/user:translate-y-0 translate-y-1">
              <div className="py-2">
                {/* Simulated Logged In State (Hardcoded for demonstration) */}
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/my-page"
                      className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-900 transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/track-orders"
                      className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-900 transition-colors"
                    >
                      Track Orders
                    </Link>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm font-bold text-gray-800 hover:bg-red-50 hover:text-red-900 transition-colors"
                      onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        setIsLoggedIn(false);
                        navigate("/");
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-left text-sm font-bold text-gray-800 hover:bg-primary-50 hover:text-primary-900 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Link to="/cart" className="text-gray-700 hover:text-primary-800 transition-colors relative block">
            <span className="sr-only">Cart</span>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">CLICOS</span>
                <div className="text-2xl font-serif font-bold text-primary-900">CLICOS</div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-primary-50 transition-colors ${
                        location.pathname === item.href
                          ? "text-primary-800 bg-primary-50"
                          : "text-gray-900"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <span className="text-sm font-medium text-gray-500">Currency</span>
                    <select
                      className="text-sm font-semibold bg-transparent focus:outline-none"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {currencies.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 justify-center gap-2" onClick={() => navigate(isLoggedIn ? "/my-page" : "/login")}>
                      <User className="h-4 w-4" /> {isLoggedIn ? "Account" : "Login"}
                    </Button>
                    <Button variant="primary" className="flex-1 justify-center gap-2" onClick={() => { setMobileMenuOpen(false); navigate("/cart"); }}>
                      <ShoppingBag className="h-4 w-4" /> Cart ({cartCount})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
