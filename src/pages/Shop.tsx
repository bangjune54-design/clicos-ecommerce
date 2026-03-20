import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ShoppingBag, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

// Import all wholesale product data
import { fweeProducts } from "../data/fweeProducts";
import { torridenProducts } from "../data/torridenProducts";
import { ddalmomdeProducts } from "../data/ddalmomdeProducts";
import { fourPmProducts } from "../data/4pmProducts";
import { medicubeProducts } from "../data/medicubeProducts";
import { beautyOfJoseonProducts } from "../data/beautyOfJoseonProducts";
import { manyoProducts } from "../data/manyoProducts";
import { numbuzinProducts } from "../data/numbuzinProducts";
import { meditherapyProducts } from "../data/meditherapyProducts";
import { aesturaProducts } from "../data/aesturaProducts";
import { kerasysProducts } from "../data/kerasysProducts";

// Helper to convert wholesale product shape to retail shape where necessary
const mapB2BProducts = (b2bList: any[], brandName: string, categoryName: string = "Skincare") => {
  return b2bList.map((p, idx) => ({
    id: `b2b-${brandName.toLowerCase()}-${p.id || idx}`,
    name: p.name,
    brand: brandName,
    category: p.category || categoryName,
    price: p.wholesalePrice ? p.wholesalePrice * 1.5 : 30.0, // Mock MSRP based on wholesale
    wholesalePrice: p.wholesalePrice,
    moq: p.moq || 10,
    imageSrc: p.imageSrc || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
    isBestseller: p.isBestseller || false,
    colors: p.colors || undefined,
  }));
};

export const b2bProductsList = [
  ...mapB2BProducts(fweeProducts, "FWEE", "Makeup"),
  ...mapB2BProducts(torridenProducts, "Torriden"),
  ...mapB2BProducts(ddalmomdeProducts, "DDALMOMDE"),
  ...mapB2BProducts(fourPmProducts, "4PM"),
  ...mapB2BProducts(medicubeProducts, "MEDICUBE"),
  ...mapB2BProducts(beautyOfJoseonProducts, "Beauty of Joseon"),
  ...mapB2BProducts(manyoProducts, "Ma:nyo"),
  ...mapB2BProducts(numbuzinProducts, "NUMBUZIN"),
  ...mapB2BProducts(meditherapyProducts, "Meditherapy", "Body Care"),
  ...mapB2BProducts(aesturaProducts, "AESTURA"),
  ...mapB2BProducts(kerasysProducts, "Kerasys", "Hair Care"),
];

// Mocks
const categories = ["All", "Skincare", "Makeup", "Hair Care", "Styling Tools", "Body Care", "Sun Care"];
export const retailProducts = [];

export const allShopProducts = [
  ...retailProducts,
  ...b2bProductsList,
];

export function Shop() {
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
  
  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any, isB2B: boolean) => {
    e.preventDefault();
    const qty = getQty(product.id);
    
    if (isB2B) {
      const currentB2BCart = JSON.parse(localStorage.getItem('b2bCart') || '[]');
      const existingItem = currentB2BCart.find((item: any) => item.id === product.id);
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
          image: product.imageSrc
        });
      }
      localStorage.setItem('b2bCart', JSON.stringify(currentB2BCart));
      alert(`Added ${qty} boxes of ${product.name} to Wholesale Quote!`);
    } else {
      const currentRetailCart = JSON.parse(localStorage.getItem('retailCart') || '[]');
      const existingItem = currentRetailCart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        currentRetailCart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity: qty,
          image: product.imageSrc
        });
      }
      localStorage.setItem('retailCart', JSON.stringify(currentRetailCart));
      alert(`Added ${qty}x ${product.name} to Cart!`);
    }
    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
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
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                    <img
                      src={product.imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isBestseller && (
                      <Badge variant="accent" className="absolute top-3 left-3 shadow-sm">
                        Bestseller
                      </Badge>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 duration-300 bg-white/90 backdrop-blur-sm">
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
                  </div>
                  
                  <CardContent className="flex flex-col flex-grow pt-4">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                      {product.name}
                    </h3>
                    
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-4">
                        <label htmlFor={`color-${product.id}`} className="sr-only">Choose a color</label>
                        <select
                          id={`color-${product.id}`}
                          className="mt-1 block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:border-primary-500 focus:outline-none focus:ring-primary-500 bg-gray-50 bg-white shadow-sm transition-colors border max-w-full truncate"
                          defaultValue=""
                        >
                          <option value="" disabled>Select option...</option>
                          {product.colors.map((color: string) => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mt-auto flex items-end justify-between">
                      {isWholesaleView ? (
                        <div>
                          <p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)} MSRP</p>
                          <p className="text-xl font-bold text-primary-800">${product.wholesalePrice.toFixed(2)}</p>
                          <p className="text-xs text-accent font-semibold mt-1">MOQ: {product.moq} units</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
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
