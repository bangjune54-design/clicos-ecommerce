import React, { useState, useEffect } from "react";
import { Header } from "../components/clicos/Header";
import { BannerCarousel } from "../components/clicos/BannerCarousel";
import { Ticker } from "../components/clicos/Ticker";
import { ProductCategories } from "../components/clicos/ProductCategories";
import { NewArrivals } from "../components/clicos/NewArrivals";
import { BestSellers } from "../components/clicos/BestSellers";
import { About } from "../components/clicos/About";
import { BrandGrid } from "../components/clicos/BrandGrid";
import { WhyChooseUs } from "../components/clicos/WhyChooseUs";
import { Contact } from "../components/clicos/Contact";
import { Footer } from "../components/clicos/Footer";
import { getLiveBanners, getLiveTickers } from "../utils/homepage";

export function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [banners, setBanners] = useState(() => getLiveBanners());
  const [tickers, setTickers] = useState(() => getLiveTickers());

  useEffect(() => {
    // Set document title
    document.title = "CLICOS | Korean Cosmetics & Hair Care Export";
    
    // Ingress metadata description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "CLICOS exports premium Korean cosmetics, skincare, and hair care products to retail customers and international distributors worldwide."
    );

    // Sync live banners and tickers from storage
    setBanners(getLiveBanners());
    setTickers(getLiveTickers());

    // Setup intersection observer to dynamically highlight the current active section in sticky header
    const sections = ["home", "products", "new-arrivals", "best-sellers", "brands", "about", "why-choose-us", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px", // Optimizes target range for header active highlights
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "new-arrivals" || id === "best-sellers") {
            setActiveSection("new-arrivals"); // Matches the "Products" tab
          } else if (id === "products") {
            setActiveSection("products"); // Matches the "Categories" tab
          } else if (id === "about" || id === "why-choose-us" || id === "contact") {
            setActiveSection("contact"); // Highlights Contact for footer sections
          } else {
            setActiveSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden antialiased text-gray-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Rebuilt Sticky Navbar */}
      <Header activeSection={activeSection} />

      {/* Main Single Page Sections */}
      <main>
        {/* Banner carousel at top */}
        <BannerCarousel banners={banners} />
        
        {/* Ticker bar directly below the banner carousel */}
        <Ticker tickers={tickers} />
        
        {/* Shop by Category linked directly to retail categories */}
        <ProductCategories />

        {/* New arrivals product showcase grid */}
        <NewArrivals />

        {/* Bestsellers favorites product grid */}
        <BestSellers />

        {/* Corporate branding sections */}
        <About />
        <BrandGrid />
        <WhyChooseUs />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
