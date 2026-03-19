import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export const b2bBrands = [
  { name: "4PM", description: "Premium, functional skincare solutions.", image: "/4pm-b2b.jpg" },
  { name: "AESTURA", description: "Derma-cosmetics representing dermatology-grade barrier repair.", image: "/aestura-b2b.png" },
  { name: "DDALMOMDE", description: "Innovative beauty focused on natural radiance." },
  { name: "ATS", description: "Professional hair and scalp care brand." },
  { name: "MEDICUBE", description: "Clinically tested dermocosmetics for sensitive and troubled skin." },
  { name: "NUMBUZIN", description: "Number-based customized skincare solutions." },
  { name: "Ma:nyo", description: "Pure ingredient-oriented skincare brand for a healthy barrier." },
  { name: "Meditherapy", description: "Home-care healing solutions merging devices and cosmetics." },
  { name: "FWEE", description: "Trendy color cosmetics focused on expressive makeup." },
  { name: "Torriden", description: "Clean beauty brand focusing on deep hydration with hyaluronic acid." },
  { name: "Beauty of Joseon", description: "Hanbang (traditional Korean herbal medicine) skincare for modern routines." },
  { name: "Kerasys", description: "Premium hair clinics and body care with rich, perfumed scents.", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&auto=format&fit=crop" },
];

export function WholesaleBrands() {
  const [b2bSearchQuery, setB2bSearchQuery] = useState("");

  const filteredBrands = b2bBrands.filter((brand) =>
    brand.name.toLowerCase().includes(b2bSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
            B2B Exclusive Brands
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We partner with top-tier K-beauty brands to offer competitive wholesale opportunities. Explore our portfolio of brands available for B2B distribution.
          </p>
        </div>

        {/* Search Input for B2B Brands */}
        <div className="mt-10 max-w-md">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-full border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search B2B brands..."
              value={b2bSearchQuery}
              onChange={(e) => setB2bSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
            <li key={brand.name} className="group flex flex-col items-start justify-between">
              <Link to={`/wholesale/brands/${encodeURIComponent(brand.name)}`} className="block w-full">
                <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-primary-50 border border-primary-100 mb-6 group-hover:bg-primary-100 transition-colors overflow-hidden">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-serif font-bold text-primary-900/40 uppercase tracking-widest">
                      {brand.name.substring(0, 2)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold leading-8 text-gray-900 group-hover:text-primary-800 transition-colors">
                  {brand.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 flex-grow">
                  {brand.description}
                </p>
                <div className="mt-4 text-sm font-semibold text-primary-600 group-hover:text-primary-800 transition-colors flex items-center gap-1">
                  Submit Inquiry <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            </li>
          ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No brands found matching "{b2bSearchQuery}".
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
