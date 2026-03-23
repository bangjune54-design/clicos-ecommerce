import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLiveBrands } from "../utils/inventory";

export function Brands() {
  const [b2bBrands, setB2bBrands] = useState<any[]>([]);

  useEffect(() => {
    setB2bBrands(getLiveBrands());
  }, []);
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
            Our Brands
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We partner directly with the most innovative and trusted brands in Korean beauty to bring you authentic products straight from Seoul.
          </p>
        </div>
        
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {b2bBrands.map((brand) => (
            <li key={brand.name} className="group">
              <Link to={`/shop?category=${encodeURIComponent(brand.name.toLowerCase())}`} className="block">
                <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-primary-50 border border-primary-100 mb-6 group-hover:bg-primary-100 transition-colors overflow-hidden">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl font-serif font-bold text-primary-900/40 uppercase tracking-widest">
                      {brand.name.substring(0, 2)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold leading-8 text-gray-900 group-hover:text-primary-800 transition-colors">
                  {brand.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {brand.description}
                </p>
                <div className="mt-4 text-sm font-semibold text-primary-600 group-hover:text-primary-800 transition-colors">
                  Shop brand <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
