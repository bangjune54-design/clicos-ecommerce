import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../clicos/Header";
import { Footer } from "../clicos/Footer";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const isAdmin = userEmail ? userEmail.toLowerCase().endsWith("@clicos.co.kr") : false;
  }, [location.pathname, navigate]);

  // Setup active section tracking observer for the sticky header (runs only on landing page)
  useEffect(() => {
    if (!isLandingPage) {
      setActiveSection("");
      return;
    }

    const sections = ["home", "products", "new-arrivals", "best-sellers", "brands", "about", "why-choose-us", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px", // Optimizes sweet spot for highlights
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "new-arrivals" || id === "best-sellers") {
            setActiveSection("new-arrivals"); // "Products" tab
          } else if (id === "products") {
            setActiveSection("products"); // "Categories" tab
          } else if (id === "about" || id === "why-choose-us" || id === "contact") {
            setActiveSection("contact"); // "Contact" tab
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
  }, [isLandingPage]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Rebuilt Sticky Navbar shared across all routes */}
      <Header activeSection={activeSection} />
      
      {/* Main content body */}
      <main className="flex-grow flex flex-col pt-[56px] md:pt-[64px]">
        <Outlet />
      </main>
      
      {/* Rebuilt High-Contrast Footer shared across all routes */}
      <Footer />
    </div>
  );
}
