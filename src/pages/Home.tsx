import React, { useState, useEffect } from "react";
import { BannerCarousel } from "../components/clicos/BannerCarousel";
import { Ticker } from "../components/clicos/Ticker";
import { ProductCategories } from "../components/clicos/ProductCategories";
import { NewArrivals } from "../components/clicos/NewArrivals";
import { BestSellers } from "../components/clicos/BestSellers";
import { About } from "../components/clicos/About";
import { BrandGrid } from "../components/clicos/BrandGrid";
import { WhyChooseUs } from "../components/clicos/WhyChooseUs";
import { getLiveBanners, getLiveTickers } from "../utils/homepage";
import { useCountry } from "../contexts/CountryContext";

export function Home() {
  const { country } = useCountry();
  const [banners, setBanners] = useState(() => getLiveBanners(country));
  const [tickers, setTickers] = useState(() => getLiveTickers());

  useEffect(() => {
    // Set document title
    document.title = "KOSMERA | Korean Cosmetics & Hair Care Export";
    
    // Ingress metadata description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "KOSMERA exports premium Korean cosmetics, skincare, and hair care products to retail customers and international distributors worldwide."
    );
  }, []);

  useEffect(() => {
    setBanners(getLiveBanners(country));
    setTickers(getLiveTickers());

    const handleStorage = () => {
      setBanners(getLiveBanners(country));
      setTickers(getLiveTickers());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [country]);

  return (
    <div className="bg-white selection:bg-primary-100 selection:text-primary-900 w-full flex flex-col">
      {/* Auto-sliding banner carousel */}
      <BannerCarousel banners={banners} />
      
      {/* Continuous message scroll ticker */}
      <Ticker tickers={tickers} />
      
      {/* New Arrivals Grid */}
      <NewArrivals />

      {/* Best Sellers Grid */}
      <BestSellers />

      {/* Sourced Categories Grid */}
      <ProductCategories />

      {/* Sourcing Corporate Values */}
      <BrandGrid />
      <About />
      <WhyChooseUs />
    </div>
  );
}
