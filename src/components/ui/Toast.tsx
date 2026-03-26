import React, { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export function ToastProvider() {
  const [toasts, setToasts] = useState<{ id: number, message: string }[]>([]);

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: customEvent.detail.message }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="bg-white border text-left border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-4 flex items-center gap-3 w-80 pointer-events-auto transform transition-all duration-300 translate-y-0 opacity-100"
          style={{ animation: "0.4s ease-out 0s 1 normal forwards running slideUp" }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />
          <div className="flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 flex-1 leading-snug">{toast.message}</p>
          <button 
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
