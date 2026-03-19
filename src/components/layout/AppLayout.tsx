import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout() {
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
