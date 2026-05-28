import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";
import { getLiveInventory } from "../../utils/inventory";

export function BestSellers() {
  const { formatPrice } = useCurrency();
  const allProducts = getLiveInventory();

  // Filter products that are designated as bestseller in database, limit to 4
  const bestsellerProducts = allProducts.filter(p => p.isBestseller).slice(0, 4);

  if (bestsellerProducts.length === 0) return null;

  return (
    <section id="best-sellers" className="py-24 sm:py-32 bg-primary-50/50">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-12 border-b border-gray-200 pb-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
              Customer Favorites
            </span>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-primary-700 hover:text-accent flex items-center gap-1.5 transition-colors group"
          >
            Browse Full Shop
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {bestsellerProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <Link to={`/product/${product.id}`} className="block flex-grow flex flex-col">
                {/* Image Area with premium vector placeholder */}
                <div className="aspect-square bg-primary-50/50 flex items-center justify-center p-8 relative overflow-hidden">
                  <img
                    src={product.imageSrc}
                    alt={product.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-primary-800 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Best Seller
                  </span>
                </div>

                {/* Content info */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1.5">
                    {product.brand}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-800 transition-colors line-clamp-2 min-h-[40px] leading-snug font-serif">
                    {product.name}
                  </h3>
                  
                  {/* Rating indicator */}
                  <div className="flex items-center gap-1.5 mt-2.5 mb-1 text-xs text-gray-500 font-medium">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">{(product.rating || 4.9).toFixed(1)}</span>
                    <span className="text-gray-400">({Math.floor((product.name.length * 19) % 100) + 40})</span>
                  </div>
                </div>
              </Link>

              {/* Pricing & Cart Action at Bottom */}
              <div className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 leading-none">
                    {formatPrice(product.price, product.currencyPrices)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                    MOQ: {product.moq} units
                  </span>
                </div>
                
                <Link
                  to={`/product/${product.id}`}
                  className="w-9 h-9 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center hover:bg-primary-800 hover:text-white transition-all shadow-sm"
                  title="View details"
                >
                  <ShoppingBag className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
