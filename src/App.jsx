import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AppLayout } from "@/components/layout/AppLayout";
import { ToastProvider } from "@/components/ui/Toast";
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { Wholesale } from "@/pages/Wholesale";
import { WholesaleBrands } from "@/pages/WholesaleBrands";
import { WholesaleBrandDetail } from "@/pages/WholesaleBrandDetail";
import { Brands } from "@/pages/Brands";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { MyPage } from "@/pages/MyPage";
import { Orders } from "@/pages/Orders";
import { Cart } from "@/pages/Cart";
import { About } from "@/pages/About";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { Contact } from "@/pages/Contact";
import { ProductDetail } from "@/pages/ProductDetail";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { Checkout } from "@/pages/Checkout";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { initializeStorage } from "@/utils/inventory";

function App() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    initializeStorage().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mb-4"></div>
          <p className="text-gray-400 text-sm font-medium">Loading catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider />
      <LanguageProvider>
        <CurrencyProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/wholesale/brands" element={<WholesaleBrands />} />
              <Route path="/wholesale/brands/:brandId" element={<WholesaleBrandDetail />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Catch-all route to home for demo purposes */}
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </CurrencyProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
