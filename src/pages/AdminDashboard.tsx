import React, { useState, useEffect } from "react";
import { Users, ShoppingBag, PackageSearch, Trash2, Edit, Plus, CheckCircle2, Search, Filter, RotateCcw, X, UploadCloud, Store } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { useCurrency, CURRENCY_SYMBOLS } from "../contexts/CurrencyContext";
import { getLiveInventory, saveLiveInventory, getLiveBrands, saveLiveBrands, resetInventoryToDefault } from "../utils/inventory";
import { getLiveBanners, saveLiveBanners, getLiveTickers, saveLiveTickers, Banner } from "../utils/homepage";

// Shared initial mock state
const CATEGORY_STRUCTURE = [
  { name: "Skincare", subcategories: ["Sun Care", "Cleansing", "Serum & Ampoule", "Cream", "Toner", "Mask"] },
  { name: "Makeup", subcategories: ["Lip Makeup", "Face Makeup"] },
  { name: "Hair Care" },
  { name: "Body Care" },
  { name: "Beauty Tools" }
];
const ALL_CATEGORIES = CATEGORY_STRUCTURE.flatMap(c => [c.name, ...(c.subcategories || [])]);

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

const compressImageBase64 = (base64Str: string, maxWidth = 2560, maxHeight = 1440, quality = 0.95): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Only downscale if the image exceeds maxWidth/maxHeight — never upscale
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Detect original format to handle transparency properly
      const isPng = base64Str.startsWith("data:image/png");
      const webpSupported = canvas.toDataURL("image/webp").startsWith("data:image/webp");
      
      if (webpSupported) {
        // WebP has beautiful transparency support and high quality
        resolve(canvas.toDataURL("image/webp", quality));
      } else if (isPng) {
        // Fallback for transparent PNGs
        resolve(canvas.toDataURL("image/png"));
      } else {
        // Fallback for JPEGs
        resolve(canvas.toDataURL("image/jpeg", quality));
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

export function AdminDashboard() {
  const { formatPrice, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<"orders" | "accounts" | "inventory" | "brands" | "homepage" | "settings">("orders");
  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem("globalOrders");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("globalOrders", JSON.stringify(initialMockOrders));
    return initialMockOrders;
  });
  const [accounts, setAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem("allAccounts");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("allAccounts", JSON.stringify(mockAccounts));
    return mockAccounts;
  });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderTotal, setEditOrderTotal] = useState<number>(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductPayload, setEditProductPayload] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, type: 'order' | 'account' | 'product' | null, id: string | null}>({ isOpen: false, type: null, id: null });
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryBrandFilter, setInventoryBrandFilter] = useState("All");
  const [isDragging, setIsDragging] = useState(false);
  
  const [brands, setBrands] = useState<any[]>(() => getLiveBrands());
  const [editingBrandName, setEditingBrandName] = useState<string | null>(null);
  const [editBrandPayload, setEditBrandPayload] = useState<any>({});
  const [isDraggingBrand, setIsDraggingBrand] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Combine some real data strings for the inventory tab
  const [inventory, setInventory] = useState<any[]>(() => getLiveInventory());

  // Homepage custom states
  const [banners, setBanners] = useState<Banner[]>(() => getLiveBanners());
  const [tickers, setTickers] = useState<string[]>(() => getLiveTickers());
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editBannerPayload, setEditBannerPayload] = useState<any>({});
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [newTickerMessage, setNewTickerMessage] = useState("");
  const [exportStr, setExportStr] = useState("");
  const [importStr, setImportStr] = useState("");
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  // Security check mapping
  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    if (email !== "info@clicos.co.kr" && email !== "wholesale@clicos.co.kr") {
      window.location.href = "/login";
    }
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem("globalOrders", JSON.stringify(updated));
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem("globalOrders", JSON.stringify(updated));
  };

  const handleDeleteAccount = (accountId: string) => {
    const updated = accounts.filter(a => a.id !== accountId);
    setAccounts(updated);
    localStorage.setItem("allAccounts", JSON.stringify(updated));
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = inventory.filter(p => p.id !== productId);
    setInventory(updated);
    saveLiveInventory(updated);

    try {
      const deletedIds = JSON.parse(localStorage.getItem("deletedProductIds") || "[]");
      if (!deletedIds.includes(productId)) {
        deletedIds.push(productId);
        localStorage.setItem("deletedProductIds", JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.error("Failed to save deleted product ID:", e);
    }
  };

  const handleDeleteBrand = (brandName: string) => {
    if (window.confirm(`Are you sure you want to delete the brand "${brandName}"? This will remove it from the brands catalog.`)) {
      const updated = brands.filter(b => b.name !== brandName);
      saveLiveBrands(updated);
      setBrands(updated);

      try {
        const deletedNames = JSON.parse(localStorage.getItem("deletedBrandNames") || "[]");
        const lowerName = brandName.toLowerCase();
        if (!deletedNames.includes(lowerName)) {
          deletedNames.push(lowerName);
          localStorage.setItem("deletedBrandNames", JSON.stringify(deletedNames));
        }
      } catch (e) {
        console.error("Failed to save deleted brand name:", e);
      }
    }
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'order' && deleteModal.id) {
      handleDeleteOrder(deleteModal.id);
    } else if (deleteModal.type === 'account' && deleteModal.id) {
      handleDeleteAccount(deleteModal.id);
    } else if (deleteModal.type === 'product' && deleteModal.id) {
      handleDeleteProduct(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  const handleSaveOrder = (id: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, total: editOrderTotal } : o);
    setOrders(updated);
    localStorage.setItem("globalOrders", JSON.stringify(updated));
    setEditingOrderId(null);
  };

  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Clean up temporary options editing helper text before saving
    const cleanedPayload = { ...editProductPayload };
    delete cleanedPayload._optionsText;

    const updated = inventory.map(p => p.id === editingProductId ? { ...p, ...cleanedPayload } : p);
    try { 
      saveLiveInventory(updated); 
      setInventory(updated);
      setEditingProductId(null);
    } catch (e) { 
      // With IndexedDB, we shouldn't hit the 5MB limit anymore.
      console.error("Save error:", e);
      alert("An error occurred while saving. Please try again or check your browser storage settings.");
    }
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
      imageSrc: "/placeholder-product.svg",
      isBestseller: false,
      imageFit: "contain",
      imageScale: "full",
    };
    const updated = [newProduct, ...inventory];
    setInventory(updated);
    saveLiveInventory(updated);
    alert("New product dynamically added to the global catalog!");
  };

  const handleResetInventory = async () => {
    if (window.confirm("Are you sure you want to reset the inventory to the default catalog? All custom edits and added products will be lost.")) {
      const initial = await resetInventoryToDefault(); 
      setInventory(initial);
      alert("Inventory has been fully restored to default.");
    }
  };

  // Banner slide controls
  const handleAddNewBanner = () => {
    setEditingBannerId("new");
    setEditBannerPayload({
      id: `banner-${Date.now()}`,
      title: "",
      subtitle: "",
      image: "",
      link: "/shop"
    });
  };

  const handleSaveBanner = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let updated: Banner[];
    if (editingBannerId === "new") {
      updated = [...banners, editBannerPayload];
    } else {
      updated = banners.map(b => b.id === editingBannerId ? { ...b, ...editBannerPayload } : b);
    }
    saveLiveBanners(updated);
    setBanners(updated);
    setEditingBannerId(null);
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (window.confirm("Are you sure you want to delete this banner slide?")) {
      const updated = banners.filter(b => b.id !== bannerId);
      saveLiveBanners(updated);
      setBanners(updated);
    }
  };

  // Ticker message controls
  const handleAppendTickerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerMessage.trim()) return;
    const updated = [...tickers, newTickerMessage.trim()];
    saveLiveTickers(updated);
    setTickers(updated);
    setNewTickerMessage("");
  };

  const handleDeleteTickerItem = (idx: number) => {
    const updated = tickers.filter((_, i) => i !== idx);
    saveLiveTickers(updated);
    setTickers(updated);
  };

  const handleUpdateTickerItem = (idx: number, newVal: string) => {
    const updated = tickers.map((t, i) => i === idx ? newVal : t);
    saveLiveTickers(updated);
    setTickers(updated);
  };


  const [bankSettings, setBankSettings] = useState(() => {
    return JSON.parse(localStorage.getItem("adminBankSettings") || '{"bankName":"","accountName":"","accountNumber":"","routingNumber":"","payoneerEmail":"","brazilBankAccount":"","pixKey":""}');
  });

  const handleSaveBankSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("adminBankSettings", JSON.stringify(bankSettings));
    alert("Bank settings saved successfully.");
  };

  const handleOptimizeStorage = () => {
    if (window.confirm("This will compress all existing product and brand images to save space. Some image quality might be slightly reduced. Proceed?")) {
      setIsOptimizing(true);
      
      setTimeout(async () => {
        try {
          let inventoryChanged = false;
          const updatedInventory = await Promise.all(inventory.map(async (p) => {
            if (p.imageSrc && p.imageSrc.startsWith("data:image")) {
              const compressed = await compressImageBase64(p.imageSrc);
              if (compressed !== p.imageSrc) {
                inventoryChanged = true;
                return { ...p, imageSrc: compressed };
              }
            }
            return p;
          }));

          let brandsChanged = false;
          const updatedBrands = await Promise.all(brands.map(async (b) => {
            if (b.image && b.image.startsWith("data:image")) {
              const compressed = await compressImageBase64(b.image);
              if (compressed !== b.image) {
                brandsChanged = true;
                return { ...b, image: compressed };
              }
            }
            return b;
          }));

          if (inventoryChanged) {
            setInventory(updatedInventory);
            saveLiveInventory(updatedInventory);
          }
          if (brandsChanged) {
            setBrands(updatedBrands);
            saveLiveBrands(updatedBrands);
          }

          setIsOptimizing(false);
          setTimeout(() => {
            alert("Storage optimization complete! All existing images have been compressed.");
          }, 10);
        } catch (error) {
          console.error("Optimization error:", error);
          setIsOptimizing(false);
          setTimeout(() => {
            alert("An error occurred during optimization. Please try again.");
          }, 10);
        }
      }, 100);
    }
  };

  const handleExportConfig = () => {
    const config = {
      banners,
      tickers,
      inventory,
      brands,
    };
    setExportStr(JSON.stringify(config));
    setCopied(false);
  };

  const handleCopyExportStr = () => {
    navigator.clipboard.writeText(exportStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleImportConfig = () => {
    try {
      const parsed = JSON.parse(importStr.trim());
      if (!parsed || typeof parsed !== "object") {
        setImportStatus("Error: Invalid JSON object format.");
        return;
      }
      
      let updatedCount = 0;
      if (parsed.banners && Array.isArray(parsed.banners)) {
        saveLiveBanners(parsed.banners);
        setBanners(parsed.banners);
        updatedCount++;
      }
      if (parsed.tickers && Array.isArray(parsed.tickers)) {
        saveLiveTickers(parsed.tickers);
        setTickers(parsed.tickers);
        updatedCount++;
      }
      if (parsed.inventory && Array.isArray(parsed.inventory)) {
        saveLiveInventory(parsed.inventory);
        setInventory(parsed.inventory);
        updatedCount++;
      }
      if (parsed.brands && Array.isArray(parsed.brands)) {
        saveLiveBrands(parsed.brands);
        setBrands(parsed.brands);
        updatedCount++;
      }

      if (updatedCount > 0) {
        setImportStatus("Import successful! Data synchronized successfully.");
        setImportStr("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setImportStatus("Error: No valid keys found in JSON (banners, tickers, inventory, brands).");
      }
    } catch (err: any) {
      setImportStatus(`Error: ${err.message || "Failed to parse JSON string."}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        
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
              <PackageSearch className="w-4 h-4" /> Inventory & Products
            </button>
            <button
              onClick={() => setActiveTab("brands")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "brands" ? "border-primary-600 text-primary-800" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Store className="w-4 h-4" /> Brands
            </button>
            <button
              onClick={() => setActiveTab("homepage")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "homepage" ? "border-primary-600 text-primary-800" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Store className="w-4 h-4" /> Homepage Content
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "settings" ? "border-primary-600 text-primary-800" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" /> Settings
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
                          <span className="text-gray-500">{CURRENCY_SYMBOLS[currency]}</span>
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
                          order.status === 'Delivered' || order.status === 'Approved' ? 'text-green-600' :
                          order.status === 'In Transit' ? 'text-blue-600' :
                          order.status === 'Declined' ? 'text-red-600' :
                          order.status === 'Pending Approval' ? 'text-amber-600' : 'text-orange-600'
                        }`}
                      >
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
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
                          onClick={() => setDeleteModal({ isOpen: true, type: 'order', id: order.id })} 
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
                {accounts.map((acc) => (
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
                        onClick={() => setDeleteModal({ isOpen: true, type: 'account', id: acc.id })} 
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
          <div className="space-y-6 animate-fade-in">
            {editingProductId ? (
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-bold font-serif text-gray-900">Edit Product Profile</h3>
                  <div className="flex gap-3 relative z-50">
                    <Button type="button" variant="outline" onClick={() => setEditingProductId(null)}>Cancel</Button>
                    <Button type="button" onClick={handleSaveProduct}>Save Changes</Button>
                  </div>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSaveProduct}>
                  
                  {/* Left Column: Visuals & Text */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Product Image</label>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {((editProductPayload.images?.length > 0 ? editProductPayload.images : undefined) || (editProductPayload.imageSrc ? [editProductPayload.imageSrc] : [])).map((imgSrc: string, index: number) => (
                          <div key={index} className="group relative h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                            <img 
                              src={imgSrc} 
                              alt={`Preview ${index}`} 
                              className="w-full h-full transition-all duration-300" 
                              style={{
                                objectFit: (editProductPayload.imageFit || "contain") as any,
                                transform: `scale(${
                                  editProductPayload.imageScale === "small" ? 0.7 :
                                  editProductPayload.imageScale === "medium" ? 0.8 :
                                  editProductPayload.imageScale === "large" ? 0.9 : 
                                  editProductPayload.imageScale === "xlarge" ? 1.1 :
                                  editProductPayload.imageScale === "xxlarge" ? 1.2 :
                                  editProductPayload.imageScale === "scale140" ? 1.4 :
                                  editProductPayload.imageScale === "scale160" ? 1.6 :
                                  editProductPayload.imageScale === "scale180" ? 1.8 : 1
                                })`
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => {
                                  const currentImages = (editProductPayload.images?.length > 0 ? editProductPayload.images : undefined) || (editProductPayload.imageSrc ? [editProductPayload.imageSrc] : []);
                                  const newImages = currentImages.filter((_: any, i: number) => i !== index);
                                  setEditProductPayload({ 
                                    ...editProductPayload, 
                                    images: newImages,
                                    imageSrc: newImages[0] || ""
                                  });
                                }}
                                className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div 
                        className={`group relative h-24 rounded-xl overflow-hidden mb-3 border-2 border-dashed ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-gray-50/50'} transition-all hover:bg-gray-50`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files) {
                            Array.from(e.dataTransfer.files).forEach(file => {
                              if (file.type.startsWith('image/')) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  compressImageBase64(event.target?.result as string, 1000, 1000, 0.95).then((compressed) => {
                                    setEditProductPayload((prev: any) => {
                                      const currentImages = (prev.images?.length > 0 ? prev.images : undefined) || (prev.imageSrc ? [prev.imageSrc] : []);
                                      const newImages = [...currentImages, compressed];
                                      return {
                                        ...prev,
                                        images: newImages,
                                        imageSrc: newImages[0]
                                      };
                                    });
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            });
                          }
                        }}
                      >
                        <div className="text-center p-4 cursor-pointer flex flex-col items-center justify-center h-full">
                          <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500 font-medium">Drag & drop images</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => document.getElementById("product-file-upload")?.click()}>
                          Select Image Files
                        </Button>
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          className="hidden" 
                          id="product-file-upload" 
                          onChange={(e) => {
                            if (e.target.files) {
                              Array.from(e.target.files).forEach(file => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  compressImageBase64(event.target?.result as string, 1000, 1000, 0.95).then((compressed) => {
                                    setEditProductPayload((prev: any) => {
                                      const currentImages = (prev.images?.length > 0 ? prev.images : undefined) || (prev.imageSrc ? [prev.imageSrc] : []);
                                      const newImages = [...currentImages, compressed];
                                      return {
                                        ...prev,
                                        images: newImages,
                                        imageSrc: newImages[0]
                                      };
                                    });
                                  });
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }}
                        />
                      </div>
                      <Input 
                        value={editProductPayload.imageSrc || ""} 
                        onChange={e => {
                          const val = e.target.value;
                          setEditProductPayload((prev: any) => {
                            const currentImages = (prev.images?.length > 0 ? prev.images : undefined) || (prev.imageSrc ? [prev.imageSrc] : []);
                            let newImages = [...currentImages];
                            if (val) {
                              if (newImages.length === 0) newImages = [val];
                              else newImages[0] = val; // update first image
                            } else {
                              newImages = []; // clear all if user clears input, or maybe just clear the first?
                            }
                            return { ...prev, imageSrc: val, images: newImages.length > 0 ? newImages : undefined };
                          });
                        }} 
                        placeholder="Or Image URL" 
                        className="text-xs"
                      />
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-500">Image Fit Mode</label>
                          <select
                            className="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 text-xs bg-white"
                            value={editProductPayload.imageFit || "contain"}
                            onChange={e => setEditProductPayload({...editProductPayload, imageFit: e.target.value})}
                          >
                            <option value="contain">Fit (Contain)</option>
                            <option value="cover">Fill & Crop (Cover)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-500">Image Scale / Size</label>
                          <select
                            className="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 text-xs bg-white"
                            value={editProductPayload.imageScale || "full"}
                            onChange={e => setEditProductPayload({...editProductPayload, imageScale: e.target.value})}
                          >
                            <option value="scale180">Scale (180%)</option>
                            <option value="scale160">Scale (160%)</option>
                            <option value="scale140">Scale (140%)</option>
                            <option value="xxlarge">Extra Extra Large (120%)</option>
                            <option value="xlarge">Extra Large (110%)</option>
                            <option value="full">Full (100%)</option>
                            <option value="large">Large (90%)</option>
                            <option value="medium">Medium (80%)</option>
                            <option value="small">Small (70%)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Product Name</label>
                      <Input 
                        value={editProductPayload.name || ""} 
                        onChange={e => setEditProductPayload({...editProductPayload, name: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Description</label>
                      <textarea 
                        className="w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 resize-none h-32"
                        value={editProductPayload.description || ""} 
                        onChange={e => setEditProductPayload({...editProductPayload, description: e.target.value})}
                        placeholder="Detailed product features and benefits..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Pricing & Meta */}
                  <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Brand</label>
                      <select
                        className="w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white"
                        value={editProductPayload.brand || ""} 
                        onChange={e => setEditProductPayload({...editProductPayload, brand: e.target.value})}
                      >
                        <option value="">Select Brand</option>
                        {Array.from(new Set([...brands.map(b => b.name), ...inventory.map(p => p.brand).filter(Boolean)])).sort().map(brandName => (
                          <option key={brandName} value={brandName}>{brandName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Category</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
                        value={editProductPayload.category || ""}
                        onChange={e => setEditProductPayload({...editProductPayload, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {CATEGORY_STRUCTURE.map(cat => (
                          cat.subcategories ? (
                            <optgroup key={cat.name} label={cat.name}>
                              <option value={cat.name}>{cat.name} (General)</option>
                              {cat.subcategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))}
                            </optgroup>
                          ) : (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          )
                        ))}
                        {(() => {
                          const customCats = Array.from(new Set(inventory.map(p => p.category).filter(Boolean)))
                            .filter(c => !ALL_CATEGORIES.includes(c));
                          return customCats.length > 0 ? (
                            <optgroup label="Other Categories">
                              {customCats.map(c => <option key={c} value={c}>{c}</option>)}
                            </optgroup>
                          ) : null;
                        })()}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Retail Price ({CURRENCY_SYMBOLS[currency]})</label>
                        <Input 
                          type="number" step="0.01"
                          value={editProductPayload.price || 0} 
                          onChange={e => setEditProductPayload({...editProductPayload, price: parseFloat(e.target.value)})} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-primary-800">B2B Price ({CURRENCY_SYMBOLS[currency]})</label>
                        <Input 
                          type="number" step="0.01"
                          value={editProductPayload.wholesalePrice || 0} 
                          onChange={e => setEditProductPayload({...editProductPayload, wholesalePrice: parseFloat(e.target.value)})} 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Minimum Order Qty (MOQ)</label>
                      <Input 
                        type="number"
                        value={editProductPayload.moq || 1} 
                        onChange={e => setEditProductPayload({...editProductPayload, moq: parseInt(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Option Name (e.g. Volume)</label>
                      <Input 
                        value={editProductPayload.optionName || ""} 
                        onChange={e => setEditProductPayload({...editProductPayload, optionName: e.target.value})} 
                        placeholder="Leave blank if no options"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Options (Comma-separated)</label>
                      <Input 
                        value={editProductPayload._optionsText !== undefined ? editProductPayload._optionsText : (editProductPayload.options || editProductPayload.colors || []).join(", ")} 
                        onChange={e => {
                          const val = e.target.value;
                          const arr = val ? val.split(",").map(s => s.trim()).filter(Boolean) : undefined;
                          setEditProductPayload({
                            ...editProductPayload, 
                            options: arr,
                            _optionsText: val
                          });
                        }} 
                        placeholder="e.g. 50ml, 100ml, 150ml"
                      />
                    </div>
                  </div>
                  
                  {/* Option Images */}
                  {editProductPayload.options && editProductPayload.options.length > 0 && (
                    <div className="pt-4 mt-2 border-t border-gray-100">
                      <label className="block text-sm font-semibold mb-3 text-gray-900">Option Images</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {editProductPayload.options.map((opt: string) => (
                          <div key={opt} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm flex flex-col items-center">
                            <span className="text-xs font-bold mb-2 truncate w-full text-center" title={opt}>{opt}</span>
                            <div className="relative w-full aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-150 flex items-center justify-center">
                              {editProductPayload.optionImages?.[opt] ? (
                                <>
                                  <img src={editProductPayload.optionImages[opt]} alt={opt} className="w-full h-full object-cover" />
                                  <button 
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                                    onClick={() => {
                                      const newOptionImages = { ...editProductPayload.optionImages };
                                      delete newOptionImages[opt];
                                      setEditProductPayload({ ...editProductPayload, optionImages: newOptionImages });
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <div className="text-gray-400 flex flex-col items-center cursor-pointer hover:text-primary-500 transition-colors" onClick={() => document.getElementById(`option-upload-${opt}`)?.click()}>
                                  <UploadCloud className="w-6 h-6 mb-1" />
                                  <span className="text-[10px]">Upload</span>
                                </div>
                              )}
                            </div>
                            <input 
                              type="file"
                              id={`option-upload-${opt}`}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    compressImageBase64(event.target?.result as string, 800, 800, 0.9).then((compressed) => {
                                      setEditProductPayload((prev: any) => ({ 
                                        ...prev, 
                                        optionImages: { ...(prev.optionImages || {}), [opt]: compressed }
                                      }));
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Advanced Country Customization */}
                  <div className="col-span-1 md:col-span-2 pt-6 mt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold font-serif text-gray-900 mb-2">Country Specific Names & Prices</h3>
                    <p className="text-sm text-gray-500 mb-4">Set specific local item names and prices for each country. Leave blank to automatically use standard names and converted prices.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-inner">
                      {([
                        { code: "KR", name: "South Korea", flag: "🇰🇷", currency: "KRW" },
                        { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL" },
                        { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR" },
                        { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY" },
                        { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY" },
                      ]).map(c => (
                        <div key={c.code} className="p-3.5 bg-white rounded-lg shadow-sm border border-gray-200">
                          <h4 className="font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-1.5">
                            <span>{c.flag}</span>
                            <span>{c.name} ({c.currency})</span>
                          </h4>
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-gray-600">Local Item Name</label>
                              <Input 
                                type="text" placeholder="Standard name" className="h-8 text-sm"
                                value={editProductPayload.countryNames?.[c.code] ?? ""} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setEditProductPayload({
                                    ...editProductPayload, 
                                    countryNames: { ...(editProductPayload.countryNames || {}), [c.code]: val || null }
                                  });
                                }} 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-gray-600">Retail Price ({c.currency})</label>
                              <Input 
                                type="number" step="any" placeholder="Auto calc" className="h-8 text-sm"
                                value={editProductPayload.countryPrices?.[c.code] ?? ""} 
                                onChange={e => {
                                  const val = e.target.value;
                                  const priceVal = val ? parseFloat(val) : null;
                                  setEditProductPayload({
                                    ...editProductPayload, 
                                    countryPrices: { ...(editProductPayload.countryPrices || {}), [c.code]: priceVal },
                                    currencyPrices: { ...(editProductPayload.currencyPrices || {}), [c.currency]: priceVal }
                                  });
                                }} 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-primary-700">Wholesale Price ({c.currency})</label>
                              <Input 
                                type="number" step="any" placeholder="Auto calc" className="h-8 text-sm border-primary-200 focus:border-primary-500"
                                value={editProductPayload.countryWholesalePrices?.[c.code] ?? ""} 
                                onChange={e => {
                                  const val = e.target.value;
                                  const priceVal = val ? parseFloat(val) : null;
                                  setEditProductPayload({
                                    ...editProductPayload, 
                                    countryWholesalePrices: { ...(editProductPayload.countryWholesalePrices || {}), [c.code]: priceVal },
                                    currencyWholesalePrices: { ...(editProductPayload.currencyWholesalePrices || {}), [c.currency]: priceVal }
                                  });
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              // Normal Inventory Table View
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm ring-1 ring-gray-900/5">
                  <div className="flex flex-1 w-full sm:w-auto gap-4 items-center">
                    <div className="relative max-w-sm w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={inventoryBrandFilter}
                        onChange={(e) => setInventoryBrandFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-medium"
                      >
                        <option value="All">All Brands</option>
                        {Array.from(new Set([...brands.map(b => b.name), ...inventory.map(p => p.brand).filter(Boolean)])).sort().map(brandName => (
                          <option key={brandName} value={brandName}>{brandName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                    <Button onClick={handleOptimizeStorage} disabled={isOptimizing} variant="outline" className="flex items-center gap-2 text-primary-600 border-primary-100 hover:bg-primary-50 disabled:opacity-50">
                      {isOptimizing ? "Optimizing..." : "Optimize Storage"}
                    </Button>
                    <Button onClick={handleResetInventory} variant="outline" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <RotateCcw className="w-4 h-4" /> Reset Default
                    </Button>
                    <Button onClick={handleAddProduct} className="flex items-center gap-2 shadow-sm">
                      <Plus className="w-4 h-4" /> Add New Product
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-x-auto">
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
                      {inventory
                        .filter(item => inventoryBrandFilter === "All" || item.brand === inventoryBrandFilter)
                        .filter(item => 
                          inventorySearch === "" || 
                          item.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                          (item.brand && item.brand.toLowerCase().includes(inventorySearch.toLowerCase())) ||
                          (item.description && item.description.toLowerCase().includes(inventorySearch.toLowerCase()))
                        )
                        .map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-3">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-md object-cover border border-gray-200" src={item.imageSrc} alt="" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-[200px] cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { setEditingProductId(item.id); setEditProductPayload(item); }}>
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { setEditingProductId(item.id); setEditProductPayload(item); }}>
                            {item.brand || "CLICOS"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { setEditingProductId(item.id); setEditProductPayload(item); }}>
                            {formatPrice(item.price, item.currencyPrices)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-primary-800 font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { setEditingProductId(item.id); setEditProductPayload(item); }}>
                            {formatPrice(item.wholesalePrice, item.currencyWholesalePrices)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => { setEditingProductId(item.id); setEditProductPayload(item); }} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteModal({ isOpen: true, type: 'product', id: item.id })} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Content: Brands */}
        {activeTab === "brands" && (
          <div className="space-y-6 animate-fade-in">
            {editingBrandName ? (
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-bold font-serif text-gray-900">
                    {editingBrandName === "new" ? "Add New Brand" : "Edit Brand Profile"}
                  </h3>
                  <div className="flex gap-3 relative z-50">
                    <Button type="button" variant="outline" onClick={() => setEditingBrandName(null)}>Cancel</Button>
                    <Button type="button" onClick={() => {
                        if (editingBrandName === "new") {
                          if (!editBrandPayload.name || !editBrandPayload.name.trim()) {
                            alert("Please enter a brand name.");
                            return;
                          }
                          const exists = brands.some(b => b.name.toLowerCase() === editBrandPayload.name.trim().toLowerCase());
                          if (exists) {
                            alert("A brand with this name already exists.");
                            return;
                          }
                          const updated = [...brands, { name: editBrandPayload.name.trim(), description: editBrandPayload.description || "", image: editBrandPayload.image || "", hidden: editBrandPayload.hidden || false }];
                          try { saveLiveBrands(updated); } catch(e) { alert("Save error: image might be too large"); return; }
                          setBrands(updated);
                          setEditingBrandName(null);
                        } else {
                          const updated = brands.map(b => b.name === editingBrandName ? { ...b, ...editBrandPayload } : b);
                          try { saveLiveBrands(updated); } catch(e) { alert("Save error: image might be too large"); return; }
                          setBrands(updated);
                          setEditingBrandName(null);
                        }
                    }}>Save Changes</Button>
                  </div>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Brand Image</label>
                      <div 
                        className={`relative w-full h-48 rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center mb-3 group overflow-hidden ${isDraggingBrand ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                        onDragEnter={(e) => { e.preventDefault(); }}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingBrand(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDraggingBrand(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingBrand(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const file = e.dataTransfer.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const dataUrl = event.target?.result as string;
                              compressImageBase64(dataUrl, 1000, 1000, 0.95).then((compressed) => {
                                setEditBrandPayload({ ...editBrandPayload, image: compressed });
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      >
                        {editBrandPayload.image ? (
                          <>
                            <img src={editBrandPayload.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => setEditBrandPayload({ ...editBrandPayload, image: "" })}
                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="w-6 h-6" />
                              </button>
                              <span className="text-white text-sm font-medium mt-2">Click to Remove</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 cursor-pointer">
                            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Drag and drop an image here</p>
                            <p className="text-xs text-gray-400 mt-1">or provide a URL below</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => document.getElementById("brand-file-upload")?.click()}>
                          Select Logo File
                        </Button>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          id="brand-file-upload" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                compressImageBase64(event.target?.result as string, 1000, 1000, 0.95).then((compressed) => {
                                  setEditBrandPayload({ ...editBrandPayload, image: compressed });
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <Input 
                        value={editBrandPayload.image || ""} 
                        onChange={e => setEditBrandPayload({...editBrandPayload, image: e.target.value})} 
                        placeholder="Image URL (or drag & drop / upload above)"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Brand Name</label>
                      <Input 
                        value={editBrandPayload.name || ""} 
                        onChange={e => setEditBrandPayload({...editBrandPayload, name: e.target.value})} 
                        disabled={editingBrandName !== "new"}
                      />
                      {editingBrandName !== "new" && (
                        <span className="text-xs text-gray-500 mt-1 block">Brand name is not editable as it links to existing products.</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Description</label>
                      <textarea 
                        className="w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 resize-none h-32"
                        value={editBrandPayload.description || ""} 
                        onChange={e => setEditBrandPayload({...editBrandPayload, description: e.target.value})}
                        placeholder="Brand description..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer mt-4">
                        <input 
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                          checked={editBrandPayload.hidden || false}
                          onChange={e => setEditBrandPayload({...editBrandPayload, hidden: e.target.checked})}
                        />
                        <span className="text-sm font-semibold text-gray-900">Hide this brand from customers</span>
                      </label>
                      <span className="text-xs text-gray-500 block ml-6 mt-1">
                        Hiding this brand will prevent it and all products under this brand from showing to retail/B2B customers.
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold font-serif text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary-850" /> Brands Catalog ({brands.length})
                  </h3>
                  <Button
                    onClick={() => {
                      setEditingBrandName("new");
                      setEditBrandPayload({
                        name: "",
                        description: "",
                        image: "",
                        hidden: false
                      });
                    }}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add New Brand
                  </Button>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Logo/Image</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Brand Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Visibility</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {brands.map((b) => (
                        <tr key={b.name} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-3">
                            <div className="h-12 w-24 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                              {b.image ? (
                                <img className="h-full w-full object-cover" src={b.image} alt={b.name} />
                              ) : (
                                <Store className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">{b.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{b.description}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {b.hidden ? (
                              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                Hidden
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Visible
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end gap-4 items-center">
                              <button 
                                onClick={() => { setEditingBrandName(b.name); setEditBrandPayload(b); }} 
                                className="text-primary-650 hover:text-primary-900 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteBrand(b.name)} 
                                className="text-red-500 hover:text-red-700 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
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
        )}

        {/* Tab Content: Homepage Management */}
        {activeTab === "homepage" && (
          <div className="space-y-8 animate-fade-in">
            {editingBannerId ? (
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-bold font-serif text-gray-900">
                    {editingBannerId === "new" ? "Create Banner Slide" : "Edit Banner Slide"}
                  </h3>
                  <div className="flex gap-3 relative z-50">
                    <Button type="button" variant="outline" onClick={() => setEditingBannerId(null)}>Cancel</Button>
                    <Button type="button" onClick={handleSaveBanner}>Save Slide</Button>
                  </div>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSaveBanner}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Slide Background Image</label>
                      <div 
                        className={`relative w-full h-48 rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center mb-3 group overflow-hidden ${
                          isDraggingBanner ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingBanner(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDraggingBanner(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingBanner(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const file = e.dataTransfer.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              compressImageBase64(event.target?.result as string, 2560, 1440, 0.95).then((compressed) => {
                                setEditBannerPayload({ ...editBannerPayload, image: compressed });
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      >
                        {editBannerPayload.image ? (
                          <>
                            <img src={editBannerPayload.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => setEditBannerPayload({ ...editBannerPayload, image: "" })}
                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="w-6 h-6" />
                              </button>
                              <span className="text-white text-sm font-medium mt-2">Click to Remove</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Drag & drop a banner image here</p>
                            <p className="text-xs text-gray-400 mt-1">or provide a URL below</p>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        id="banner-file-upload" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              compressImageBase64(event.target?.result as string, 2560, 1440, 0.95).then((compressed) => {
                                setEditBannerPayload({ ...editBannerPayload, image: compressed });
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => document.getElementById("banner-file-upload")?.click()}>
                          Select Image File
                        </Button>
                        <Input 
                          value={editBannerPayload.image || ""} 
                          onChange={e => setEditBannerPayload({...editBannerPayload, image: e.target.value})} 
                          placeholder="Or paste external image URL"
                          className="flex-grow h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Banner Click-Through Link</label>
                      <Input 
                        value={editBannerPayload.link || ""} 
                        onChange={e => setEditBannerPayload({...editBannerPayload, link: e.target.value})} 
                        placeholder="e.g. /shop or /wholesale or /contact"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Input the URL destination of where the banner should lead when a visitor clicks it.</span>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Banners List (7 Columns) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold font-serif text-gray-900">Auto-Sliding Banners</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Manage slides rotated at the top of the homepage.</p>
                    </div>
                    <Button onClick={handleAddNewBanner} className="flex items-center gap-2 text-xs py-2 shadow-sm">
                      <Plus className="w-3.5 h-3.5" /> Add Slide
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {banners.map((b, idx) => (
                      <div key={b.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 items-center justify-between">
                        <div className="flex items-center gap-4 w-full sm:w-[70%]">
                          <div className="w-16 h-12 flex-shrink-0 bg-gradient-to-tr from-primary-950 to-primary-900 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center text-white/50">
                            {b.image ? (
                              <img src={b.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate leading-snug">{b.title}</h4>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{b.subtitle}</p>
                            <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">{b.link}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => { setEditingBannerId(b.id); setEditBannerPayload(b); }}>
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="flex items-center gap-1 text-red-500 hover:text-red-700" onClick={() => handleDeleteBanner(b.id)}>
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticker List (5 Columns) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="pb-4 border-b border-gray-100 mb-6">
                      <h3 className="text-xl font-bold font-serif text-gray-900">Marquee Ticker</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Edit scrolling messages below the banners.</p>
                    </div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {tickers.map((t, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            className="flex-grow rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                            value={t}
                            onChange={(e) => handleUpdateTickerItem(idx, e.target.value)}
                          />
                          <button 
                            type="button" 
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0"
                            onClick={() => handleDeleteTickerItem(idx)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAppendTickerItem} className="pt-6 border-t border-gray-100 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add new scrolling announcement..."
                      className="flex-grow rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-primary-500 focus:outline-none"
                      value={newTickerMessage}
                      onChange={(e) => setNewTickerMessage(e.target.value)}
                    />
                    <Button type="submit" className="text-xs px-4 py-2 shrink-0 shadow-sm">
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8 max-w-2xl">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold font-serif text-gray-900">Payment Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Configure the bank account information to receive incoming payments.</p>
              </div>
              
              <form onSubmit={handleSaveBankSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Bank Name</label>
                  <Input 
                    value={bankSettings.bankName} 
                    onChange={e => setBankSettings({...bankSettings, bankName: e.target.value})} 
                    placeholder="e.g. Chase Bank"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Account Holder Name</label>
                  <Input 
                    value={bankSettings.accountName} 
                    onChange={e => setBankSettings({...bankSettings, accountName: e.target.value})} 
                    placeholder="e.g. CLICOS Inc."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Account Number</label>
                    <Input 
                      value={bankSettings.accountNumber} 
                      onChange={e => setBankSettings({...bankSettings, accountNumber: e.target.value})} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Routing Number / Sort Code</label>
                    <Input 
                      value={bankSettings.routingNumber} 
                      onChange={e => setBankSettings({...bankSettings, routingNumber: e.target.value})} 
                      required
                    />
                  </div>
                </div>
                
                <h4 className="text-lg font-bold font-serif text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">Payoneer Details</h4>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Payoneer Email Address</label>
                  <Input 
                    type="email"
                    value={bankSettings.payoneerEmail || ""} 
                    onChange={e => setBankSettings({...bankSettings, payoneerEmail: e.target.value})} 
                    placeholder="e.g. payments@clicos.co.kr"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your registered Payoneer email to receive B2B payments globally.</p>
                </div>

                <h4 className="text-lg font-bold font-serif text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">Brazil Local Payments</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Brazil Bank Account</label>
                    <Input 
                      value={bankSettings.brazilBankAccount || ""} 
                      onChange={e => setBankSettings({...bankSettings, brazilBankAccount: e.target.value})} 
                      placeholder="e.g. Banco do Brasil 1234-5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Pix Key</label>
                    <Input 
                      value={bankSettings.pixKey || ""} 
                      onChange={e => setBankSettings({...bankSettings, pixKey: e.target.value})} 
                      placeholder="e.g. your-pix-key@email.com"
                    />
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit">Save Settings</Button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8 max-w-2xl mt-8">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold font-serif text-gray-900">Site Synchronization</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Export or import all layout configuration details (banners, tickers, brand lists, and product changes) to synchronize other devices.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">Export Site Configuration</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Click the button below to generate a synchronization code block containing all your desktop edits. Copy this block and paste it in the import section of your other device, or paste it back to the developer to persist it permanently as the system defaults.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleExportConfig}
                    className="mb-4"
                  >
                    Generate Sync Code
                  </Button>
                  {exportStr && (
                    <div className="space-y-2">
                      <textarea
                        readOnly
                        value={exportStr}
                        className="w-full h-32 p-3 font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      />
                      <div className="flex items-center justify-between">
                        <Button 
                          type="button"
                          onClick={handleCopyExportStr}
                          className="text-xs px-4 py-2"
                        >
                          {copied ? "Copied!" : "Copy to Clipboard"}
                        </Button>
                        {copied && (
                          <span className="text-xs text-green-600 font-medium">✓ Code copied to clipboard!</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">Import Site Configuration</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Paste the synchronization code block generated from another device below and click import. This will update the local banners, tickers, brands, and products.
                  </p>
                  <textarea
                    value={importStr}
                    onChange={(e) => setImportStr(e.target.value)}
                    placeholder="Paste sync JSON code here..."
                    className="w-full h-32 p-3 font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <Button 
                      type="button"
                      onClick={handleImportConfig}
                      disabled={!importStr.trim()}
                    >
                      Import & Sync Now
                    </Button>
                    {importStatus && (
                      <span className={`text-xs font-semibold ${importStatus.includes("Error") || importStatus.includes("Invalid") ? "text-red-600" : "text-green-600"}`}>
                        {importStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Custom Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })} />
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative z-10 shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Are you sure?</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              This action cannot be undone. You are about to permanently delete this {deleteModal.type === 'order' ? 'order' : deleteModal.type === 'account' ? 'account' : 'product'}.
            </p>
            <div className="flex items-center gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })}>
                Cancel
              </Button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
