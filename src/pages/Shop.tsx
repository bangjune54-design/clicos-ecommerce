import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ShoppingBag, Search, Star } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";
import { getLiveInventory } from "../utils/inventory";

// Mocks
// Categories structure
const CATEGORY_STRUCTURE = [
  { name: "All" },
  {
    name: "Skincare",
    subcategories: ["Sun Care", "Cleansing", "Serum & Ampoule", "Cream", "Toner", "Mask"]
  },
  { name: "Makeup" },
  { name: "Hair Care" },
  { name: "Body Care" }
];

// Flattened list for URL matching if needed
const ALL_CATEGORIES = CATEGORY_STRUCTURE.flatMap(c => [c.name, ...(c.subcategories || [])]);

export function Shop() {
  const allShopProducts = getLiveInventory();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialBrand = searchParams.get("brand");
  
  const [activeCategory, setActiveCategory] = useState(
    initialCategory 
      ? ALL_CATEGORIES.find(c => c.toLowerCase().replace(/ & /g, "").replace(/ /g, "") === initialCategory) || "All"
      : "All"
  );

  const [activeBrand, setActiveBrand] = useState(initialBrand || null);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    CATEGORY_STRUCTURE.find(c => c.name === activeCategory || c.subcategories?.includes(activeCategory))?.name || null
  );
  
  // Shop is strictly retail
  const [shopSearchQuery, setShopSearchQuery] = useState("");
  
  // Track quantities independently for each product card
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    const qty = getQty(product.id);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      window.location.href = "/login";
      return;
    }
    const userType = localStorage.getItem("userType") || "retail"; // default guests to retail
    
    if (userType === "wholesale") {
      alert("Wholesale Partners should use the Wholesale portal for bulk orders. Redirecting to Cart...");
    }

    const optionsList = product.options || product.colors;
    const hasOptions = optionsList && optionsList.length > 0;
    const selectedOption = selectedOptions[product.id] || (hasOptions ? optionsList[0] : undefined);

    if (hasOptions && !selectedOption) {
      alert(`Please select an option for ${product.name}`);
      return;
    }

    const currentRetailCart = JSON.parse(localStorage.getItem('retailCart') || '[]');
    const existingItem = currentRetailCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      currentRetailCart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: qty,
        image: product.imageSrc,
        optionName: product.optionName || "Color / Option",
        optionValue: selectedOption || undefined
      });
    }
    localStorage.setItem('retailCart', JSON.stringify(currentRetailCart));
    alert(`Added ${qty}x ${product.name} to Cart!`);

    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    setSelectedOptions(prev => { const next = {...prev}; delete next[product.id]; return next; });
    // Dispatch an event so Navbar can update its badge immediately
    window.dispatchEvent(new Event("storage"));
  };

  const filteredProducts = allShopProducts.filter(p => {
    let matchesCategory = false;
    
    if (activeCategory === "All") {
      matchesCategory = true;
    } else {
      // If clicking a parent category like "Skincare", it should show products that are "Skincare" OR any of its subcategories.
      const parentCat = CATEGORY_STRUCTURE.find(c => c.name === activeCategory);
      if (parentCat && parentCat.subcategories) {
        matchesCategory = p.category === activeCategory || parentCat.subcategories.includes(p.category);
      } else {
        // Otherwise exact match for subcategories or basic categories
        matchesCategory = p.category === activeCategory;
      }
    }

    const matchesSearch = p.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(shopSearchQuery.toLowerCase());
    
    const matchesBrand = !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase();
    
    return matchesCategory && matchesSearch && matchesBrand;
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-serif">
              Shop All Products
            </h1>
            <p className="mt-2 text-primary-600">
              Discover authentic Korean beauty shipped directly to your door.
            </p>
          </div>


        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h3 className="flex items-center gap-2 text-lg font-bold font-serif mb-4">
                <Filter className="w-5 h-5" /> Filters
              </h3>
              
              <div className="border-t border-gray-200 py-6">
                <h4 className="font-semibold text-gray-900 mb-4">Category</h4>
                <div className="space-y-3">
                  {CATEGORY_STRUCTURE.map((category) => {
                    const isExpanded = expandedCategory === category.name;
                    const isActive = activeCategory === category.name;
                    const hasSubcategories = !!category.subcategories;

                    return (
                      <div key={category.name} className="flex flex-col">
                        <button
                          onClick={() => {
                            if (hasSubcategories) {
                              setExpandedCategory(isExpanded ? null : category.name);
                            } else {
                              setExpandedCategory(null);
                            }
                            
                            setActiveCategory(category.name);
                            if (category.name === "All") {
                              searchParams.delete("category");
                            } else {
                              searchParams.set("category", category.name.toLowerCase().replace(/ & /g, "").replace(/ /g, ""));
                            }
                            setSearchParams(searchParams);
                          }}
                          className={`text-sm flex items-center justify-between w-full text-left py-1 ${
                            isActive
                              ? "font-bold text-primary-800"
                              : "text-gray-600 hover:text-primary-800"
                          } transition-colors`}
                        >
                          {category.name}
                          {hasSubcategories && (
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          )}
                        </button>
                        
                        {/* Subcategories Dropdown */}
                        {hasSubcategories && isExpanded && (
                          <div className="pl-4 mt-2 space-y-2 border-l-2 border-primary-100 ml-1">
                            {category.subcategories?.map(sub => {
                              const isSubActive = activeCategory === sub;
                              return (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    setActiveCategory(sub);
                                    searchParams.set("category", sub.toLowerCase().replace(/ & /g, "").replace(/ /g, ""));
                                    setSearchParams(searchParams);
                                  }}
                                  className={`block text-sm text-left w-full py-1 ${
                                    isSubActive ? "font-bold text-primary-700" : "text-gray-500 hover:text-primary-700"
                                  } transition-colors`}
                                >
                                  {sub}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 mb-8 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">{filteredProducts.length}</span> Products
                {activeBrand && (
                  <button 
                    onClick={() => {
                      setActiveBrand(null);
                      searchParams.delete("brand");
                      setSearchParams(searchParams);
                    }}
                    className="ml-2 flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-primary-100 transition-colors"
                  >
                    Brand: {activeBrand} <span className="ml-1 text-[10px] opacity-70">✕</span>
                  </button>
                )}
              </div>
              
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search products & brands..."
                  value={shopSearchQuery}
                  onChange={(e) => setShopSearchQuery(e.target.value)}
                  className="block w-full rounded-full border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.imageSrc}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 mix-blend-multiply object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isBestseller && (
                        <Badge variant="accent" className="absolute top-3 left-3 shadow-sm z-10">
                          Bestseller
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="flex flex-col flex-grow pt-4 relative">
                    
                    <div className="absolute inset-x-0 bottom-full p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 duration-300 bg-white/90 backdrop-blur-sm shadow-md pointer-events-auto z-20">
                      <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm font-semibold">
                        <button type="button" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-1/3 text-center rounded-l-md" onClick={(e) => { e.preventDefault(); updateQty(product.id, -1); }}>-</button>
                        <span className="px-2 py-1.5 text-sm font-bold text-gray-900 w-1/3 text-center border-x border-gray-300">{getQty(product.id)}</span>
                        <button type="button" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-1/3 text-center rounded-r-md" onClick={(e) => { e.preventDefault(); updateQty(product.id, 1); }}>+</button>
                      </div>
                      <Button className="w-full gap-2 shadow-md" onClick={(e) => handleAddToCart(e, product)}>
                        <ShoppingBag className="w-4 h-4" /> 
                        Add to Cart
                      </Button>
                    </div>
                  
                    <Link 
                      to={`/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveBrand(product.brand);
                        searchParams.set("brand", product.brand.toLowerCase());
                        setSearchParams(searchParams);
                      }}
                      className="text-xs text-gray-400 mb-1 hover:text-primary-600 transition-colors inline-block"
                    >
                      {product.brand}
                    </Link>
                    <Link to={`/product/${product.id}`} className="hover:text-primary-800 transition-colors group-hover:underline">
                      <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1.5 mt-1 mb-3 text-xs text-gray-500">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-gray-700">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                      <span>({Math.floor((product.name.length * 17) % 200) + 45})</span>
                      <span className="ml-auto text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                        {(Math.floor((product.name.length * 43) % 800) + 150).toLocaleString()}+ sold
                      </span>
                    </div>
                    
                    {((product.options && product.options.length > 0) || (product.colors && product.colors.length > 0)) && (
                      <div className="mb-4">
                        <label htmlFor={`option-${product.id}`} className="sr-only">Choose an option</label>
                        <select
                          id={`option-${product.id}`}
                          className="mt-1 block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:border-primary-500 focus:outline-none focus:ring-primary-500 bg-gray-50 bg-white shadow-sm transition-colors border max-w-full truncate"
                          defaultValue=""
                          onChange={(e) => {
                             setSelectedOptions(prev => ({...prev, [product.id]: e.target.value}));
                          }}
                        >
                          <option value="" disabled>Select option...</option>
                          {(product.options || product.colors).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mt-auto flex flex-col mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">B2B: <span className="text-accent">{formatPrice(product.wholesalePrice)}</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 rounded shadow-sm whitespace-nowrap">Save {Math.round((1 - product.wholesalePrice / product.price) * 100)}%</span>
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">MOQ {product.moq}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Try selecting a different category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
