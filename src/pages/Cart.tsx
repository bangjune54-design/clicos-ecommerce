import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";

// Mock data for Cart
const mockRetailItems = [
  {
    id: 1,
    name: "Atobarrier 365 Cream (2nd Generation) 80ml",
    brand: "AESTURA",
    price: 32.0,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Water Bank Blue Hyaluronic Cream 50ml",
    brand: "LANEIGE",
    price: 40.0,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1611078489956-65b169b1853d?auto=format&fit=crop&q=80&w=200",
  },
];

const mockB2BItems = [
  {
    id: 101,
    name: "DIVE-IN Low Molecular Hyaluronic Acid Serum 50ml",
    brand: "Torriden",
    price: 15.0,
    inboxQty: 50,
    boxQty: 2, // ordered 2 boxes
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200",
  },
];

export function Cart() {
  const { formatPrice } = useCurrency();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const [retailItems, setRetailItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('retailCart') || '[]');
  });
  const [b2bItems, setB2BItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('b2bCart') || '[]');
  });

  const userType = localStorage.getItem("userType") || "retail";

  const retailTotal = userType !== "wholesale" 
    ? retailItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;
  
  // B2B pricing logic could be different, here we assume price is per item * (boxQty * inboxQty)
  const b2bTotal = userType === "wholesale" 
    ? b2bItems.reduce((acc, item) => acc + item.price * (item.boxQty * item.inboxQty), 0)
    : 0;

  const handleRemoveRetail = (id: number) => {
    const updated = retailItems.filter(item => item.id !== id);
    setRetailItems(updated);
    localStorage.setItem('retailCart', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleRemoveB2B = (id: number) => {
    const updated = b2bItems.filter(item => item.id !== id);
    setB2BItems(updated);
    localStorage.setItem('b2bCart', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const updateRetailQuantity = (id: number, delta: number) => {
    const updated = retailItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setRetailItems(updated);
    localStorage.setItem('retailCart', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const updateB2BQuantity = (id: number, delta: number) => {
    const updated = b2bItems.map(item => {
      if (item.id === id) {
        const newBoxQty = Math.max(1, item.boxQty + delta);
        return { ...item, boxQty: newBoxQty };
      }
      return item;
    });
    setB2BItems(updated);
    localStorage.setItem('b2bCart', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-8 space-y-12">
            
            {/* RETAIL SECTION */}
            {userType !== "wholesale" && (
              <section className="glass p-6 rounded-2xl">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-bold font-serif text-gray-900">Shop Items (Retail)</h2>
                  <span className="text-sm text-gray-500">{retailItems.length} items</span>
                </div>
                
                {retailItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your retail cart is empty.</p>
                ) : (
                <ul className="divide-y divide-gray-200">
                  {retailItems.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2 pr-4">{item.name}</h3>
                            <p className="ml-4 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                          {(item.optionValue || item.color) && (
                            <p className="mt-1 text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-sm">
                              {item.optionName || "Color / Option"}: {item.optionValue || item.color}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              type="button"
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() => updateRetailQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-gray-900 border-x border-gray-300">{item.quantity}</span>
                            <button
                              type="button"
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() => updateRetailQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => handleRemoveRetail(item.id)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            )}

            {/* B2B SECTION */}
            {userType === "wholesale" && (
            <section className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-bold font-serif text-gray-900">B2B Wholesale Items</h2>
                <span className="text-sm text-gray-500">{b2bItems.length} items</span>
              </div>
              
              {b2bItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your wholesale cart is empty.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {b2bItems.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2 pr-4">{item.name}</h3>
                            <p className="ml-4 whitespace-nowrap">{formatPrice(item.price * item.boxQty * item.inboxQty)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                          {(item.optionValue || item.color) && (
                            <p className="mt-1 text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-sm">
                              {item.optionName || "Color / Option"}: {item.optionValue || item.color}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-400">Price per unit: {formatPrice(item.price)}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-2">
                          <div className="text-gray-500 flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                type="button"
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                onClick={() => updateB2BQuantity(item.id, -1)}
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-gray-900 border-x border-gray-300">Box Qty: {item.boxQty}</span>
                              <button
                                type="button"
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                onClick={() => updateB2BQuantity(item.id, 1)}
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs font-semibold text-primary-700">({item.inboxQty * item.boxQty} total units)</span>
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => handleRemoveB2B(item.id)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <section className="glass p-6 rounded-2xl mt-12 lg:col-span-4 lg:mt-0 sticky top-24">
            <h2 className="text-lg font-bold font-serif text-gray-900 mb-6">Order Summary</h2>

            <dl className="space-y-4 text-sm text-gray-600">
              {userType !== "wholesale" && (
                <div className="flex items-center justify-between">
                  <dt>Retail Subtotal</dt>
                  <dd className="font-medium text-gray-900">{formatPrice(retailTotal)}</dd>
                </div>
              )}
              {userType === "wholesale" && (
                <div className="flex items-center justify-between">
                  <dt>Wholesale Subtotal</dt>
                  <dd className="font-medium text-gray-900">{formatPrice(b2bTotal)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="font-medium text-gray-900">Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-bold text-gray-900">Order Total</dt>
                <dd className="text-base font-bold text-gray-900">{formatPrice(retailTotal + b2bTotal)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link to={userType === 'wholesale' ? '/wholesale' : '/checkout'} className="block w-full">
                <Button className="w-full text-lg shadow-md">
                  {userType === 'wholesale' ? 'Submit Wholesale Order' : 'Proceed to Checkout'}
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{" "}
                <Link to="/shop" className="font-medium text-primary-600 hover:text-primary-500">
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
