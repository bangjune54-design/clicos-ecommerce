import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ShoppingBag, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";
import { getLiveInventory } from "../utils/inventory";

// Mocks
const categories = ["All", "Skincare", "Makeup", "Hair Care", "Styling Tools", "Body Care", "Sun Care"];

export function Shop() {
  const allShopProducts = getLiveInventory();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState(
    initialCategory 
      ? categories.find(c => c.toLowerCase().replace(" ", "") === initialCategory) || "All"
      : "All"
  );
  
  // Toggle between retail and wholesale views for testing purposes
  const [isWholesaleView, setIsWholesaleView] = useState(false);
  const [shopSearchQuery, setShopSearchQuery] = useState("");
  
  // Track quantities independently for each product card
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any, isB2B: boolean) => {
    e.preventDefault();
    const qty = getQty(product.id);
    const userType = localStorage.getItem("userType") || "retail"; // default guests to retail
    
    const optionsList = product.options || product.colors;
    const hasOptions = optionsList && optionsList.length > 0;
    const selectedOption = selectedOptions[product.id] || (hasOptions ? optionsList[0] : undefined);

    if (hasOptions && !selectedOption) {
      alert(`Please select an option for ${product.name}`);
      return;
    }

    if (isB2B) {
      if (userType !== "wholesale") {
        alert("Only Wholesale Partners can add wholesale items. Please login as a Wholesale Partner.");
        return;
      }
      const currentB2BCart = JSON.parse(localStorage.getItem('b2bCart') || '[]');
      const existingItem = currentB2BCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
      if (existingItem) {
        existingItem.boxQty += qty;
      } else {
        currentB2BCart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.wholesalePrice,
          inboxQty: product.moq,
          boxQty: qty,
          image: product.imageSrc,
          optionName: product.optionName || "Color / Option",
          optionValue: selectedOption || undefined
        });
      }
      localStorage.setItem('b2bCart', JSON.stringify(currentB2BCart));
      alert(`Added ${qty} boxes of ${product.name} to Wholesale Quote!`);
    } else {
      if (userType === "wholesale") {
        alert("Wholesale Partners cannot add retail items to the cart.");
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
    }
    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    setSelectedOptions(prev => { const next = {...prev}; delete next[product.id]; return next; });
    // Dispatch an event so Navbar can update its badge immediately
    window.dispatchEvent(new Event("storage"));
  };

  const filteredProducts = allShopProducts.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(shopSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="view-toggle" className="text-sm font-medium text-gray-700">
                View:
              </label>
              <select
                id="view-toggle"
                className="rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:ring-primary-500 bg-primary-50"
                value={isWholesaleView ? "wholesale" : "retail"}
                onChange={(e) => setIsWholesaleView(e.target.value === "wholesale")}
              >
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale B2B</option>
              </select>
            </div>
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
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <button
                        onClick={() => {
                          setActiveCategory(category);
                          if (category === "All") {
                            searchParams.delete("category");
                          } else {
                            searchParams.set("category", category.toLowerCase().replace(" ", ""));
                          }
                          setSearchParams(searchParams);
                        }}
                        className={`text-sm ${
                          activeCategory === category
                            ? "font-bold text-primary-800"
                            : "text-gray-600 hover:text-primary-800"
                        } transition-colors`}
                      >
                        {category}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {isWholesaleView && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <h4 className="font-semibold text-primary-900 text-sm mb-2">B2B Quick Info</h4>
                  <ul className="text-xs text-primary-800 space-y-2">
                    <li>• Free international shipping on orders over $1,500.</li>
                    <li>• Average dispatch time: 2-4 business days.</li>
                    <li>• Custom branding available for MOQ &gt; 1,000.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 mb-8 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">{filteredProducts.length}</span> Products
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
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
                      <Button className="w-full gap-2 shadow-md" onClick={(e) => handleAddToCart(e, product, isWholesaleView)}>
                        <ShoppingBag className="w-4 h-4" /> 
                        {isWholesaleView ? "Add to Quote" : "Add to Cart"}
                      </Button>
                    </div>
                  
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <Link to={`/product/${product.id}`} className="hover:text-primary-800 transition-colors group-hover:underline">
                      <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    
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

                    <div className="mt-auto flex items-end justify-between">
                      {isWholesaleView ? (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)} MSRP</p>
                            <p className="text-xl font-bold text-primary-800">{formatPrice(product.wholesalePrice)}</p>
                          </div>
                          <p className="text-xs text-accent font-semibold mt-1">MOQ: {product.moq} units</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-auto mb-3">
                          <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                        </div>
                      )}
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
