import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const isAdmin = userEmail === "info@clicos.co.kr" || userEmail === "wholesale@clicos.co.kr";
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {!isLandingPage && <Navbar />}
      <main className={`flex-grow flex flex-col ${!isLandingPage ? "pt-16 -mt-16" : ""}`}>
        <Outlet />
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
}

