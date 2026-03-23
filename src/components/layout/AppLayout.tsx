import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const isAdmin = userEmail === "info@clicos.co.kr" || userEmail === "wholesale@clicos.co.kr";
    
    // If the user is an admin and tries to access anything other than admin or login, redirect to admin
    if (isAdmin && location.pathname !== "/admin" && location.pathname !== "/login") {
      navigate("/admin", { replace: true });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col pt-16 -mt-16">
        {/* We use pt-16 -mt-16 to offset the fixed navbar visually while keeping it in flow if needed, 
            though here navbar is sticky so we just rely on normal flow and letting Outlet take remaining space */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
