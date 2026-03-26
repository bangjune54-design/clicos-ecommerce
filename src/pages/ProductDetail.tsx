import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Star, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";
import { Badge } from "../components/ui/Badge";
import { getLiveInventory } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";

export function ProductDetail() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { id } = useParams<{ id: string }>();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType") || "retail";
  
  const product = getLiveInventory().find((p) => p.id === id || p.id === `b2b-${p.brand.toLowerCase()}-${id}`);
  
  const [quantity, setQuantity] = React.useState(1);
  const [selectedOption, setSelectedOption] = React.useState("");

  React.useEffect(() => {
    if (hash === "#reviews") {
      setTimeout(() => {
        const element = document.getElementById("reviews");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [hash, product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{t('product_not_found')}</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          {t('product_not_found_desc')}
        </p>
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('go_back')}
        </Button>
      </div>
    );
  }

  const isB2B = userType === "wholesale";
  
  // If a retail user tries to view a strictly wholesale product (not available in retail usually, but here they are merged), 
  // they would see retail pricing per the requirement unless restricted.
  // In `Shop.tsx`, b2bProductsList have mocked retail pricing (`price`) alongside `wholesalePrice`.

  const displayPrice = isB2B ? product.wholesalePrice : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const hasOptions = (product.options && product.options.length > 0) || (product.colors && product.colors.length > 0);
    if (hasOptions && !selectedOption) {
      alert(`Please select an option before adding to cart.`);
      return;
    }

    try {
      if (isB2B) {
        const currentB2BCart = JSON.parse(localStorage.getItem("b2bCart") || "[]");
        const existingItem = currentB2BCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
        if (existingItem) {
          existingItem.boxQty += quantity;
        } else {
          currentB2BCart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.wholesalePrice,
            inboxQty: product.moq,
            boxQty: quantity,
            image: product.imageSrc,
            optionName: product.optionName || "Color / Option",
            optionValue: selectedOption || undefined
          });
        }
        localStorage.setItem("b2bCart", JSON.stringify(currentB2BCart));
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: `Added ${quantity} boxes of ${product.name} to Wholesale Quote!` } }));
      } else {
        const currentRetailCart = JSON.parse(localStorage.getItem("retailCart") || "[]");
        const existingItem = currentRetailCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          currentRetailCart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            quantity: quantity,
            image: product.imageSrc,
            optionName: product.optionName || "Color / Option",
            optionValue: selectedOption || undefined
          });
        }
        localStorage.setItem("retailCart", JSON.stringify(currentRetailCart));
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: `Added ${quantity}x ${product.name} to Cart!` } }));
      }
      
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Cart update failed:", err);
      alert("Failed to update cart. Please check if your browser allows cookies/local storage.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 gap-2">
          <Link to="/" className="hover:text-primary-800 transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link to={isB2B ? "/wholesale/brands" : "/shop"} className="hover:text-primary-800 transition-colors">
            {isB2B ? t('wholesale_brands') : t('shop')}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Image Gallery (Right now, just single image) */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
              <img
                src={product.imageSrc}
                alt={product.name}
                className="w-full h-full object-contain p-8 mix-blend-multiply object-center"
              />
              {product.isBestseller && (
                <Badge variant="accent" className="absolute top-4 left-4 shadow-md px-3 py-1 text-sm">
                  {t('bestseller')}
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-2 sm:px-0 lg:mt-0 flex flex-col h-full">
            <Link 
              to={isB2B ? `/wholesale/brands/${encodeURIComponent(product.brand)}` : `/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
              className="text-lg font-bold tracking-widest text-primary-400 uppercase mb-2 hover:text-primary-600 transition-colors"
            >
              {product.brand}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-4">
              {product.name}
            </h1>
            
            {/* Reviews Mock & Sales */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
              <span className="text-gray-300">|</span>
              <a href="#reviews" onClick={(e) => { e.preventDefault(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm text-gray-500 hover:text-primary-700 cursor-pointer underline underline-offset-4 decoration-gray-300 hover:decoration-primary-700 transition-colors">
                {Math.floor((product.name.length * 17) % 200) + 45} {t('reviews')}
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {(Math.floor((product.name.length * 43) % 800) + 150).toLocaleString()}+ {t('sold')}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-gray-900">{formatPrice(displayPrice)}</p>
              {isB2B ? (
                <div className="flex flex-col ml-2 border-l border-gray-200 pl-4 py-1">
                  <span className="text-gray-500 line-through">{formatPrice(product.price)} {t('msrp')}</span>
                  <span className="text-sm font-semibold text-accent mt-1">
                    {t('wholesale_price')} ({product.moq} {t('moq')})
                  </span>
                </div>
              ) : (
                <div className="flex flex-col ml-2 border-l border-gray-200 pl-4 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">{t('wholesale')} B2B: <span className="text-accent font-bold">{formatPrice(product.wholesalePrice)}</span></span>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded shadow-sm">
                      {t('save')} {Math.round((1 - product.wholesalePrice / product.price) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{t('moq')}: {product.moq} {t('boxes')}</span>
                    <Link to={`/wholesale/brands/${encodeURIComponent(product.brand)}?search=${encodeURIComponent(product.name)}`} className="text-xs text-primary-600 hover:text-primary-800 font-medium underline">
                      {t('apply_b2b')} →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <p className="text-base text-gray-700 leading-relaxed mb-10 border-b border-gray-200 pb-8">
              {product.description || "Discover the beauty of carefully crafted authentic Korean formulas. This " + product.category.toLowerCase() + " essentially targets optimal results, ensuring your absolute satisfaction with every use. Premium ingredients combined with advanced technology deliver visible improvements."}
            </p>

            <form className="mt-auto">
              {/* Options Dropdown */}
              {((product.options && product.options.length > 0) || (product.colors && product.colors.length > 0)) && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{product.optionName || "Color / Option"}</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(product.options || product.colors).map((opt: string) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`flex items-center justify-center rounded-md border py-3 px-3 text-sm font-semibold uppercase sm:flex-1 transition-all ${
                          selectedOption === opt
                            ? "border-primary-600 bg-primary-50 text-primary-900 ring-1 ring-primary-600 shadow-sm"
                            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-end mt-8">
                <div className="w-full sm:w-1/3">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('quantity')} {isB2B && `(${t('boxes')})`}</h3>
                  <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm h-12">
                    <button 
                      type="button" 
                      className="px-4 h-full text-gray-600 hover:bg-gray-100 transition-colors rounded-l-md flex items-center justify-center font-bold" 
                      onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-gray-900 border-x border-gray-300 w-full text-center">{quantity}</span>
                    <button 
                      type="button" 
                      className="px-4 h-full text-gray-600 hover:bg-gray-100 transition-colors rounded-r-md flex items-center justify-center font-bold" 
                      onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1); }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="w-full sm:w-2/3 h-12">
                  <Button size="lg" className="w-full h-full text-base font-bold gap-2 shadow-lg" onClick={handleAddToCart}>
                    <ShoppingBag className="w-5 h-5" /> 
                    {isB2B ? t('add_to_quote') : t('add_to_cart')}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-8">
              <div className="flex gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 flex-shrink-0 text-primary-600" />
                <span>{t('free_shipping')} {isB2B ? '$1,500' : '$100'}.</span>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-primary-600" />
                <span>{t('authentic_guarantee')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <section id="reviews" className="mt-24 pt-16 border-t border-gray-200 scroll-mt-24">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-10">{t('customer_reviews')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Review Summary */}
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="text-5xl font-bold text-gray-900 mb-4">{product.rating ? product.rating.toFixed(1) : "5.0"}</div>
              <div className="flex items-center text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500">{t('based_on')} {Math.floor((product.name.length * 17) % 200) + 45} {t('reviews')}</p>
            </div>
            
            {/* Reviews List */}
            <div className="md:col-span-2 space-y-8">
              {[
                { name: "Sarah M.", date: "October 12, 2025", rating: 5, text: "Absolutely love this! I've been using it for a few weeks and the results are amazing. It arrived perfectly packaged and the quality is exactly what you'd expect from authentic Korean beauty products." },
                { name: "Jessica T.", date: "September 28, 2025", rating: 5, text: "Holy grail status. I have sensitive skin and this didn't cause any breakouts. The texture is beautiful and it layers perfectly under my makeup. Will definitely repurchase!" },
                { name: "Emily R.", date: "September 15, 2025", rating: 4, text: "Really good product overall. It took a little while to see the full effects, but my skin has definitely improved. The packaging is very premium too." }
              ].map((review, i) => (
                <div key={i} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                    </div>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
