import React, { useState } from "react";
import { Link } from "react-router-dom";

export function MyPage() {
  const [activeTab, setActiveTab] = useState("Purchase History");

  const sidebarMenus = [
    {
      title: "My Shopping",
      items: ["My Purchase", "Shipping", "Purchase History", "Cart"],
    },
    {
      title: "My Activities",
      items: ["Contact Us", "Reviews"],
    },
    {
      title: "My Profile",
      items: ["Account Information", "Login History", "Deactivate Account"],
    },
  ];

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">My Page</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="glass p-6 rounded-2xl space-y-8">
              {sidebarMenus.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <button
                          onClick={() => setActiveTab(item)}
                          className={`text-sm w-full text-left py-1.5 px-2 rounded-md transition-colors ${
                            activeTab === item
                              ? "bg-primary-50 text-primary-900 font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="glass p-8 rounded-2xl min-h-[500px]">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">{activeTab}</h2>
              <div className="text-gray-500 flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl">
                <p>Content for {activeTab} will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
