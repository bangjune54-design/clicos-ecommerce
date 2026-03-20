import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Globe2, Truck, ShieldCheck, ArrowRight, Plus, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { b2bBrands } from "./WholesaleBrands";
import { getLiveInventory } from "../utils/inventory";

interface Product {
  id: string;
  name: string;
  category: string;
  wholesalePrice: number;
  moq: number;
  imageSrc: string;
  isBestseller: boolean;
  colors?: string[];
}

const getBrandProducts = (brandName: string): Product[] => {
  // Use a quick case-insensitive comparison or direct match from the live inventory hub
  return getLiveInventory().filter(p => p.brand === brandName || p.brand?.toUpperCase() === brandName.toUpperCase());
};

const benefits = [
  {
    title: "Global Distribution",
    description: "We ship to over 50 countries with dedicated logistics partners for fast customs clearance.",
    icon: Globe2,
  },
  {
    title: "Tiered Pricing",
    description: "Access our B2B portal for volume discounts. The more you order, the better the margins.",
    icon: Building2,
  },
  {
    title: "Fast Dispath",
    description: "Most wholesale orders ship within 48 hours from our central warehouse in Seoul.",
    icon: Truck,
  },
  {
    title: "100% Authentic",
    description: "Direct contracts with Korean brands ensure you receive only genuine, unadulterated products.",
    icon: ShieldCheck,
  },
];

export function Wholesale() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<{brand: string, product: string, quantity: number, inboxQty: number}[]>([]);

  const handleAddItem = () => {
    if (selectedBrand && selectedProduct && selectedQuantity > 0) {
      const productObj = getBrandProducts(selectedBrand).find(p => p.name === selectedProduct);
      const inboxQty = productObj ? productObj.moq : 1;
      
      setOrderItems([...orderItems, { 
        brand: selectedBrand, 
        product: selectedProduct, 
        quantity: selectedQuantity,
        inboxQty 
      }]);
      setSelectedProduct("");
      setSelectedQuantity(1);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-primary-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif">
            Wholesale & B2B Partnership
          </h1>
          <p className="mt-6 text-lg leading-8 text-primary-100 max-w-2xl mx-auto">
            Scale your beauty business with authentic K-Beauty products. We provide competitive pricing, reliable fulfillment, and dedicated account management for our B2B partners worldwide.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - Info & Portal Login CTA */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif mb-8">
              Why Partner With CLICOS?
            </h2>
            
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="relative pl-12">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <benefit.icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                    </div>
                    {benefit.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-gray-600">
                    {benefit.description}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">
                Already a Partner?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Access the B2B portal to view live inventory, place bulk orders, and track shipments.
              </p>
              <Button variant="primary" className="w-full sm:w-auto gap-2">
                Login to Portal <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="glass rounded-3xl p-8 sm:p-10 shadow-xl border-gray-100 relative">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6">
              Wholesale Order
            </h3>
            <p className="text-sm text-gray-600 mb-8">
              Fill out the form below to apply for a wholesale account. Our B2B team will review your application and get back to you within 1-2 business days.
            </p>

            <form action="#" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    First name
                  </label>
                  <Input id="first-name" name="first-name" type="text" placeholder="Jane" required />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Last name
                  </label>
                  <Input id="last-name" name="last-name" type="text" placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Company Name
                </label>
                <Input id="company" name="company" type="text" placeholder="Your Beauty Store LLC" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Work Email
                  </label>
                  <Input id="email" name="email" type="email" placeholder="jane@company.com" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>United Arab Emirates</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="business-type" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Business Type
                </label>
                <select
                  id="business-type"
                  name="business-type"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                >
                  <option>Online Retailer</option>
                  <option>Brick & Mortar Store</option>
                  <option>Distributor / Wholesaler</option>
                  <option>Salon / Spa</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Order Selection</h4>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="select-brand" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      Select Brand
                    </label>
                    <select
                      id="select-brand"
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedProduct("");
                      }}
                      className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                    >
                      <option value="">-- Choose Brand --</option>
                      {b2bBrands.map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="select-product" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      Select Product
                    </label>
                    <select
                      id="select-product"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      disabled={!selectedBrand}
                      className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent disabled:opacity-50"
                    >
                      <option value="">-- Choose Product --</option>
                      {selectedBrand && getBrandProducts(selectedBrand).map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-24 shrink-0">
                    <label htmlFor="select-quantity" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      Box Qty
                    </label>
                    <Input
                      id="select-quantity"
                      type="number"
                      min={1}
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                </div>
                <div className="flex justify-end mb-6">
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem} disabled={!selectedBrand || !selectedProduct} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </div>

                {orderItems.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 ring-1 ring-inset ring-gray-200">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Selected Items ({orderItems.length})</h5>
                    <ul className="space-y-3">
                      {orderItems.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between gap-4 bg-white p-3 rounded-md shadow-sm">
                          <div className="flex-1">
                            <Badge variant="outline" className="text-[10px] mb-1">{item.brand}</Badge>
                            <p className="text-sm font-medium text-gray-900 leading-tight">{item.product}</p>
                            <p className="text-xs text-gray-500 mt-1">Inbox Qty: {item.inboxQty}</p>
                          </div>
                          <div className="text-sm font-bold text-primary-700 shrink-0 text-right">
                            <div>{item.quantity} Boxes</div>
                            <div className="text-xs text-gray-500 font-normal">({item.quantity * item.inboxQty} items)</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Additional Details / Expected Order Volume
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent resize-none"
                  placeholder="e.g. We are looking to order 500 units of the selected items monthly..."
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full">
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
