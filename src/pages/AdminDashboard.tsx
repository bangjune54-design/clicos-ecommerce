import React, { useState, useEffect } from "react";
import { Users, ShoppingBag, PackageSearch, Trash2, Edit, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { useCurrency } from "../contexts/CurrencyContext";
import { torridenProducts } from "../data/torridenProducts";
import { fweeProducts } from "../data/fweeProducts";

// Shared initial mock state
const initialMockOrders = [
  { 
    id: "KOR-8X912-39L", date: "March 15, 2026", status: "Processing", 
    customerName: "Jane Doe", customerEmail: "jane.doe@example.com", total: 345.50,
    address: "123 Main St, New York, NY 10001, USA",
    items: [
      { name: "Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum 50ml", qty: 2, price: 21.00 },
      { name: "FWEE Lip & Cheek Blurry Pudding Pot", qty: 3, price: 18.00 }
    ]
  },
  { 
    id: "KOR-7B421-99A", date: "February 28, 2026", status: "Delivered", 
    customerName: "John Smith", customerEmail: "retail_shop@b2b.com", total: 128.00,
    address: "88 Retail Ave, Los Angeles, CA 90015, USA",
    items: [
      { name: "CosRX Advanced Snail 96 Mucin Power Essence", qty: 5, price: 16.00 }
    ]
  },
  { 
    id: "KOR-9C111-22B", date: "March 18, 2026", status: "In Transit", 
    customerName: "Admin Setup", customerEmail: "wholesale@clicos.co.kr", total: 450.00,
    address: "1 Clicos Warehouse, Seoul, South Korea",
    items: [
      { name: "Beauty of Joseon Relief Sun : Rice + Probiotics", qty: 20, price: 14.50 },
      { name: "Laneige Lip Sleeping Mask", qty: 10, price: 16.00 }
    ]
  }
];

const mockAccounts = [
  { id: "USR-001", name: "Jane Doe", email: "jane.doe@example.com", type: "Retail", joined: "Jan 12, 2026", status: "Active" },
  { id: "USR-002", name: "John Smith", email: "retail_shop@b2b.com", type: "Wholesale", joined: "Feb 05, 2026", status: "Active" },
  { id: "USR-003", name: "Admin Setup", email: "info@clicos.co.kr", type: "Admin", joined: "Dec 01, 2025", status: "Active" },
];

export function AdminDashboard() {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<"orders" | "accounts" | "inventory">("orders");
  const [orders, setOrders] = useState(initialMockOrders);
  const [accounts, setAccounts] = useState(mockAccounts);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderTotal, setEditOrderTotal] = useState<number>(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductPayload, setEditProductPayload] = useState<any>({});
  
  // Combine some real data strings for the inventory tab
  const [inventory, setInventory] = useState<any[]>(() => {
    const localInv = localStorage.getItem("adminInventory");
    if (localInv) return JSON.parse(localInv);
    return [...fweeProducts, ...torridenProducts]; // Initialize with a subset of real products
  });

  // Security check mapping
  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    if (email !== "info@clicos.co.kr" && email !== "wholesale@clicos.co.kr") {
      window.location.href = "/login";
    }
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel/delete this order?")) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter(a => a.id !== accountId));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = inventory.filter(p => p.id !== productId);
    setInventory(updated);
    localStorage.setItem("adminInventory", JSON.stringify(updated));
  };

  const handleSaveOrder = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, total: editOrderTotal } : o));
    setEditingOrderId(null);
  };

  const handleSaveProduct = (id: string) => {
    const updated = inventory.map(p => p.id === id ? { ...p, ...editProductPayload } : p);
    setInventory(updated);
    localStorage.setItem("adminInventory", JSON.stringify(updated));
    setEditingProductId(null);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: `custom-${Date.now()}`,
      name: "New Custom Product",
      brand: "CLICOS",
      category: "Skincare",
      price: 25.0,
      wholesalePrice: 12.0,
      moq: 50,
      imageSrc: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
      isBestseller: false,
    };
    const updated = [newProduct, ...inventory];
    setInventory(updated);
    localStorage.setItem("adminInventory", JSON.stringify(updated));
    alert("New product dynamically added to localStorage catalog!");
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl font-serif sm:tracking-tight">
              Administrator Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage accounts, control order shipping statuses, and maintain the global product catalog.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("orders")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "orders" ? "border-primary-600 text-primary-800" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders Management
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "accounts" ? "border-primary-600 text-primary-800" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" /> User Accounts
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "inventory" ? "border-primary-600 text-primary-800" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <PackageSearch className="w-4 h-4" /> Inventory & Brands
            </button>
          </nav>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === "orders" && (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Shipping Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary-900">{order.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="font-semibold text-gray-900">{order.customerName}</div>
                      <div className="text-xs">{order.customerEmail}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-semibold">
                      {editingOrderId === order.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">$</span>
                          <input 
                            type="number" 
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={editOrderTotal}
                            onChange={(e) => setEditOrderTotal(Number(e.target.value))}
                          />
                        </div>
                      ) : (
                        formatPrice(order.total)
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-sm rounded-md border-gray-300 font-semibold focus:ring-primary-500 focus:border-primary-500 ${
                          order.status === 'Delivered' ? 'text-green-600' :
                          order.status === 'In Transit' ? 'text-blue-600' : 'text-orange-600'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-3 items-center">
                        {editingOrderId === order.id ? (
                          <button onClick={() => handleSaveOrder(order.id)} className="text-green-600 hover:text-green-900 font-semibold flex items-center gap-1">
                            Save
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setEditingOrderId(order.id); setEditOrderTotal(order.total); }} 
                            className="text-primary-600 hover:text-primary-900 font-semibold flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4"/> Edit
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteOrder(order.id)} 
                          className="text-red-400 hover:text-red-600 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4"/> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Dropdown Content */}
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="animate-fade-in origin-top space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Items List */}
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><PackageSearch className="w-4 h-4"/> Ordered Items</h4>
                              <ul className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="flex justify-between items-start text-sm">
                                    <span className="text-gray-700 max-w-[70%] leading-tight text-xs font-medium">{item.name} <span className="text-gray-400 font-normal block mt-0.5">Qty: {item.qty}</span></span>
                                    <span className="font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Destination/Customer Info */}
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Destination Details</h4>
                              <dl className="space-y-3 text-sm">
                                <div>
                                  <dt className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Recipient Name</dt>
                                  <dd className="font-medium text-gray-900 mt-0.5">{order.customerName}</dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Delivery Address</dt>
                                  <dd className="font-medium text-gray-900 mt-0.5 max-w-[80%] leading-snug">{order.address}</dd>
                                </div>
                              </dl>
                            </div>
                            
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Accounts */}
        {activeTab === "accounts" && (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Account ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Email Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{acc.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-semibold">{acc.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{acc.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Badge variant={acc.type === 'Wholesale' ? 'accent' : acc.type === 'Admin' ? 'secondary' : 'primary'} className="uppercase text-[10px]">
                        {acc.type}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{acc.joined}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-left text-sm">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-green-700 bg-green-50 ring-1 ring-inset ring-green-600/20">
                        <CheckCircle2 className="w-3 h-3" /> {acc.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteAccount(acc.id)} 
                        className="text-red-400 hover:text-red-600 font-semibold flex items-center gap-1 justify-end w-full"
                      >
                        <Trash2 className="w-4 h-4"/> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Inventory */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleAddProduct} className="flex items-center gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> Add New Product
              </Button>
            </div>
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Preview</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Product ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Brand Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Retail Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">B2B Price</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-md object-cover border border-gray-200" src={item.imageSrc} alt="" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {editingProductId === item.id ? (
                          <input type="text" className="w-full px-2 py-1 border rounded" value={editProductPayload.name || ""} onChange={e => setEditProductPayload({...editProductPayload, name: e.target.value})} />
                        ) : item.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-semibold">
                        {editingProductId === item.id ? (
                          <input type="text" className="w-full px-2 py-1 border rounded" value={editProductPayload.brand || ""} onChange={e => setEditProductPayload({...editProductPayload, brand: e.target.value})} />
                        ) : (item.brand || "CLICOS")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {editingProductId === item.id ? (
                          <input type="number" className="w-20 px-2 py-1 border rounded" value={editProductPayload.price || 0} onChange={e => setEditProductPayload({...editProductPayload, price: Number(e.target.value)})} />
                        ) : formatPrice(item.price)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-primary-800 font-bold">
                        {editingProductId === item.id ? (
                          <input type="number" className="w-20 px-2 py-1 border rounded" value={editProductPayload.wholesalePrice || 0} onChange={e => setEditProductPayload({...editProductPayload, wholesalePrice: Number(e.target.value)})} />
                        ) : formatPrice(item.wholesalePrice)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          {editingProductId === item.id ? (
                            <button onClick={() => handleSaveProduct(item.id)} className="text-green-600 hover:text-green-900 font-semibold">
                              Save
                            </button>
                          ) : (
                            <button onClick={() => { setEditingProductId(item.id); setEditProductPayload(item); }} className="text-gray-400 hover:text-gray-900 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteProduct(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
