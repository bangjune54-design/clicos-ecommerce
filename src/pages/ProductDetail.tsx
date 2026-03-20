import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { allShopProducts } from "./Shop";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType") || "retail";
  
  const product = allShopProducts.find((p) => p.id === id || p.id === `b2b-${p.brand.toLowerCase()}-${id}`);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          We couldn't find the product you're looking for. It may have been removed or the link might be broken.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>
    );
  }

  const isB2B = userType === "wholesale";
  
  // If a retail user tries to view a strictly wholesale product (not available in retail usually, but here they are merged), 
  // they would see retail pricing per the requirement unless restricted.
  // In `Shop.tsx`, b2bProductsList have mocked retail pricing (`price`) alongside `wholesalePrice`.

  const displayPrice = isB2B ? product. wholesalePrice : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color/option before adding to cart.");
      return;
    }

    if (isB2B) {
      const currentB2BCart = JSON.parse(localStorage.getItem("b2bCart") || "[]");
      const existingItem = currentB2BCart.find((item: any) => item.id === product.id && item.color === selectedColor);
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
          color: selectedColor || undefined
        });
      }
      localStorage.setItem("b2bCart", JSON.stringify(currentB2BCart));
      alert(`Added ${quantity} boxes of ${product.name} to Wholesale Quote!`);
    } else {
      const currentRetailCart = JSON.parse(localStorage.getItem("retailCart") || "[]");
      const existingItem = currentRetailCart.find((item: any) => item.id === product.id && item.color === selectedColor);
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
          color: selectedColor || undefined
        });
      }
      localStorage.setItem("retailCart", JSON.stringify(currentRetailCart));
      alert(`Added ${quantity}x ${product.name} to Cart!`);
    }
    
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 gap-2">
          <Link to="/" className="hover:text-primary-800 transition-colors">Home</Link>
          <span>/</span>
          <Link to={isB2B ? "/wholesale/brands" : "/shop"} className="hover:text-primary-800 transition-colors">
            {isB2B ? "Wholesale Brands" : "Shop"}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Image Gallery (Right now, just single image) */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
              <img
                src={product.imageSrc}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.isBestseller && (
                <Badge variant="accent" className="absolute top-4 left-4 shadow-md px-3 py-1 text-sm">
                  Bestseller
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-2 sm:px-0 lg:mt-0 flex flex-col h-full">
            <Link to={`/brands/${product.brand.toLowerCase()}`} className="text-lg font-bold tracking-widest text-primary-600 uppercase mb-2 hover:text-primary-800 transition-colors">
              {product.brand}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-4">
              {product.name}
            </h1>
            
            {/* Reviews Mock */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">{product.rating ? product.rating.toFixed(1) : "5.0"} out of 5</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 hover:text-primary-700 cursor-pointer">{Math.floor(Math.random() * 200) + 15} Reviews</span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <p className="text-3xl font-bold text-gray-900">${displayPrice.toFixed(2)}</p>
              {isB2B && (
                <div className="flex flex-col mb-1 text-sm">
                  <span className="text-gray-500 line-through">${product.price.toFixed(2)} MSRP</span>
                  <span className="text-accent font-semibold">Inbox Qty: {product.moq} units</span>
                </div>
              )}
            </div>

            <p className="text-base text-gray-700 leading-relaxed mb-10 border-b border-gray-200 pb-8">
              Discover the beauty of carefully crafted authentic Korean formulas. This {product.category.toLowerCase()} essentially targets optimal results, ensuring your absolute satisfaction with every use. Premium ingredients combined with advanced technology deliver visible improvements.
            </p>

            <form className="mt-auto">
              {/* Colors Dropdown */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color / Option</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center justify-center rounded-md border py-3 px-3 text-sm font-semibold uppercase sm:flex-1 transition-all ${
                          selectedColor === color
                            ? "border-primary-600 bg-primary-50 text-primary-900 ring-1 ring-primary-600 shadow-sm"
                            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-end mt-8">
                <div className="w-full sm:w-1/3">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity {isB2B && "(Boxes)"}</h3>
                  <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm h-12">
                    <button 
                      type="button" 
                      className="px-4 h-full text-gray-600 hover:bg-gray-100 transition-colors rounded-l-md flex items-center justify-center font-bold" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-gray-900 border-x border-gray-300 w-full text-center">{quantity}</span>
                    <button 
                      type="button" 
                      className="px-4 h-full text-gray-600 hover:bg-gray-100 transition-colors rounded-r-md flex items-center justify-center font-bold" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="w-full sm:w-2/3 h-12">
                  <Button size="lg" className="w-full h-full text-base font-bold gap-2 shadow-lg" onClick={handleAddToCart}>
                    <ShoppingBag className="w-5 h-5" /> 
                    {isB2B ? "Add to Wholesale Quote" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-8">
              <div className="flex gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 flex-shrink-0 text-primary-600" />
                <span>Free shipping on all global orders over {isB2B ? '$1,500' : '$100'}.</span>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-primary-600" />
                <span>100% Authentic Korean Cosmetics. Guaranteed.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
