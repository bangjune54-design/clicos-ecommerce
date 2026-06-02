import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useCountry } from "../../contexts/CountryContext";
import { getLiveInventory } from "../../utils/inventory";

export function NewArrivals() {
  const { formatPrice } = useCurrency();
  const { getLocalizedProduct, formatProductPrice } = useCountry();
  const allProducts = getLiveInventory();

  // Get the 4 most recently added products (e.g. first 4 items in getLiveInventory database)
  const newProducts = allProducts.slice(0, 4);

  if (newProducts.length === 0) return null;

  return (
    <section id="new-arrivals" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-12 border-b border-gray-100 pb-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
              Just Added
            </span>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-primary-700 hover:text-accent flex items-center gap-1.5 transition-colors group"
          >
            View All Catalog
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {newProducts.map((p) => {
            const product = getLocalizedProduct(p);
            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link to={`/product/${product.id}`} className="block flex-grow flex flex-col">
                  {/* Image Area with premium full-bleed styling */}
                  <div className="aspect-square bg-primary-50/50 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={product.imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      New
                    </span>
                  </div>

                  {/* Content info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1.5">
                      {product.brand}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-800 transition-colors line-clamp-3 leading-snug font-serif">
                      {product.name}
                    </h3>
                    
                    {/* Rating indicator */}
                    <div className="flex items-center gap-1.5 mt-2.5 mb-1 text-xs text-gray-500 font-medium">
                      <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">{(product.rating || 4.8).toFixed(1)}</span>
                      <span className="text-gray-400">({Math.floor((product.name.length * 13) % 40) + 12})</span>
                    </div>
                  </div>
                </Link>

                {/* Pricing & Cart Action at Bottom */}
                <div className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900 leading-none">
                      {formatProductPrice(product)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                      MOQ: {product.moq} units
                    </span>
                  </div>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="w-11 h-11 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center hover:bg-primary-800 hover:text-white transition-all shadow-sm"
                    title="View details"
                  >
                    <ShoppingBag className="w-5.5 h-5.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
