import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, Copy, MapPin, Ship, Plane } from "lucide-react";
import { Badge } from "../components/ui/Badge";

// Mock Data
const mockOrders = [
  {
    id: "KOR-8X912-39L",
    date: "March 15, 2026",
    status: "In Transit",
    statusDescription: "Shipped from Korea — En route to Destination",
    total: 345.50,
    items: [
      {
        id: 1,
        name: "Atobarrier 365 Cream (2nd Generation) 80ml",
        brand: "AESTURA",
        price: 32.0,
        qty: 2,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: 2,
        name: "DIVE-IN Low Molecular Hyaluronic Acid Serum 50ml",
        brand: "Torriden",
        price: 15.0,
        qty: 5,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200",
      }
    ]
  },
  {
    id: "KOR-7B421-99A",
    date: "February 28, 2026",
    status: "Delivered",
    statusDescription: "Package delivered to your address.",
    total: 128.00,
    items: [
      {
        id: 3,
        name: "Water Bank Blue Hyaluronic Cream 50ml",
        brand: "LANEIGE",
        price: 40.0,
        qty: 1,
        image: "https://images.unsplash.com/photo-1611078489956-65b169b1853d?auto=format&fit=crop&q=80&w=200",
      }
    ]
  },
  {
    id: "KOR-9C111-22B",
    date: "March 18, 2026",
    status: "Processing",
    statusDescription: "Processing in Korea Store — Preparing for Shipment",
    total: 450.00,
    items: [
      {
        id: 4,
        name: "Repair Spa Shampoo (1000ml)",
        brand: "ATS",
        price: 45.0,
        qty: 10,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200",
      }
    ]
  }
];

const trackingSteps = [
  { id: 1, name: "Korea warehouse", icon: Package },
  { id: 2, name: "Port (Korea)", icon: Ship },
  { id: 3, name: "Shipping", icon: Plane },
  { id: 4, name: "Port (Destination)", icon: Ship },
  { id: 5, name: "Arrived", icon: MapPin },
];

export function Orders() {
  const [expandedTrackingId, setExpandedTrackingId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "In Transit":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Processing":
      default:
        return <Package className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "accent";
      case "Processing":
      default:
        return "warning";
    }
  };

  const getActiveStep = (status: string) => {
    switch(status) {
      case "Processing": return 1;
      case "In Transit": return 3;
      case "Delivered": return 5;
      default: return 1;
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Your Orders</h1>
          <p className="text-gray-500 max-w-2xl">
            Track your recent purchases, view their shipping status from our distribution center in Korea, and check your invoice details.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {mockOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Order Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-6 sm:flex sm:items-center sm:justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Order Placed</h3>
                    <p className="text-gray-500">{order.date}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Total</h3>
                    <p className="text-gray-500">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-2 sm:text-right">
                    <h3 className="font-semibold text-gray-900 mb-1">Order # {order.id}</h3>
                    <button className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center gap-1 transition-colors">
                      <Copy className="w-3 h-3" /> Copy ID
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                {/* Status Bar */}
                <div className="flex items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  <div className="bg-gray-50 p-3 rounded-full border border-gray-100">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-bold text-gray-900">{order.status}</h2>
                    </div>
                    <p className="text-sm text-gray-500">{order.statusDescription}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <button 
                      onClick={() => setExpandedTrackingId(expandedTrackingId === order.id ? null : order.id)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {expandedTrackingId === order.id ? "Hide Tracking" : "Track Package"}
                    </button>
                  </div>
                </div>

                {/* Tracking Dropdown */}
                {expandedTrackingId === order.id && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in origin-top">
                    <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Tracking Timeline</h4>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />
                      <div 
                        className="absolute top-5 left-0 h-1 bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${((getActiveStep(order.status) - 1) / (trackingSteps.length - 1)) * 100}%` }}
                      />
                      
                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {trackingSteps.map((step) => {
                          const StepIcon = step.icon;
                          const isActive = step.id <= getActiveStep(order.status);
                          
                          return (
                            <div key={step.id} className="flex flex-col items-center w-24">
                              <div className={`w-10 h-10 rounded-full border-4 border-gray-50 flex items-center justify-center z-10 transition-colors duration-500 ${isActive ? 'bg-primary-500 text-white' : 'bg-white text-gray-300'}`}>
                                <StepIcon className="w-4 h-4" />
                              </div>
                              <p className={`mt-3 text-xs font-semibold text-center leading-tight transition-colors duration-500 ${isActive ? 'text-primary-900' : 'text-gray-400'}`}>
                                {step.name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-6 flex first:pt-0 last:pb-0">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-bold text-gray-900 line-clamp-2">{item.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 ml-4">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                          <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                            Buy it again
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
