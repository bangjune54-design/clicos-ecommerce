import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLiveBrands } from "../utils/inventory";
import { fweeProducts } from "../data/fweeProducts";
import { torridenProducts } from "../data/torridenProducts";
import { ddalmomdeProducts } from "../data/ddalmomdeProducts";
import { fourPmProducts } from "../data/4pmProducts";
import { medicubeProducts } from "../data/medicubeProducts";
import { beautyOfJoseonProducts } from "../data/beautyOfJoseonProducts";
import { manyoProducts } from "../data/manyoProducts";
import { numbuzinProducts } from "../data/numbuzinProducts";
import { aesturaProducts } from "../data/aesturaProducts";
import { kerasysProducts } from "../data/kerasysProducts";
import { atsProducts } from "../data/atsProducts";
import { getLiveInventory } from "../utils/inventory";
import { meditherapyProducts } from "../data/meditherapyProducts";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ShoppingBag, ArrowLeft, Search } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";

interface Product {
  id: string;
  name: string;
  category: string;
  wholesalePrice: number;
  moq: number;
  imageSrc: string;
  isBestseller: boolean;
  colors?: string[];
  options?: string[];
  optionName?: string;
}

// Removed static mock generator, now relying on global inventory to show LIVE edits.

export function WholesaleBrandDetail() {
  const b2bBrands = getLiveBrands();
  const { formatPrice } = useCurrency();
  const { brandId } = useParams();
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  
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
    const userType = localStorage.getItem("userType") || "retail";
    
    if (userType !== "wholesale") {
      alert("Only Wholesale Partners can add wholesale items. Please login as a Wholesale Partner.");
      return;
    }

    const optionsList = product.options || product.colors;
    const hasOptions = optionsList && optionsList.length > 0;
    const selectedOption = selectedOptions[product.id] || (hasOptions ? optionsList[0] : undefined);

    if (hasOptions && !selectedOption) {
      alert(`Please select an option for ${product.name}`);
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
    
    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    setSelectedOptions(prev => { const next = {...prev}; delete next[product.id]; return next; });
    // Dispatch an event so Navbar can update its badge immediately
    window.dispatchEvent(new Event("storage"));
  };
  
  const brandName = brandId ? decodeURIComponent(brandId) : "";
  const brand = b2bBrands.find(b => b.name === brandName);

  if (!brand) {
    return (
      <div className="py-32 text-center text-gray-900">
        <h2 className="text-2xl font-bold font-serif">Brand not found</h2>
        <Link to="/wholesale/brands" className="text-primary-600 hover:text-primary-800 mt-4 inline-block">
          &larr; Back to Brands
        </Link>
      </div>
    );
  }

  const products = getLiveInventory().filter(p => p.brand === brand.name);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-gray-900 flex items-center justify-center">
        {brand.image && (
          <img 
            src={brand.image} 
            alt={brand.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
          <Link to="/wholesale/brands" className="absolute top-0 sm:-top-8 left-4 sm:left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Brands
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-white tracking-widest uppercase mb-4 mt-8 sm:mt-0 drop-shadow-lg">
            {brand.name}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-md">
            {brand.description}
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Wholesale Items</h2>
            <span className="text-sm text-gray-500 font-medium">{filteredProducts.length} Products Available</span>
          </div>

          {/* Search Input for items in brand */}
          <div className="w-full sm:w-auto relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full sm:w-64 rounded-full border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search products..."
              value={brandSearchQuery}
              onChange={(e) => setBrandSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
                  <Button className="w-full gap-2 shadow-md" onClick={(e) => handleAddToCart(e, product)}>
                    <ShoppingBag className="w-4 h-4" /> Add to Quote
                  </Button>
                </div>
              
                <p className="text-xs text-gray-500 mb-1">{brand.name}</p>
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
                    <div>
                      <p className="text-xl font-bold text-primary-800">{formatPrice(product.wholesalePrice)}</p>
                      <p className="text-xs text-accent font-semibold mt-1">MOQ: {product.moq} units</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
