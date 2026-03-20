import React, { createContext, useContext, useState, ReactNode } from "react";

// Mock Exchange Rates against USD base
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  KRW: 1350.50,
  EUR: 0.92,
  JPY: 151.20,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  EUR: "€",
  JPY: "¥",
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (priceUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Store the user's currency preference in localStorage, default to USD
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });

  const setCurrency = (newCurrency: string) => {
    localStorage.setItem("preferredCurrency", newCurrency);
    setCurrencyState(newCurrency);
  };

  const formatPrice = (priceUSD: number) => {
    const rate = EXCHANGE_RATES[currency] || 1.0;
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    const converted = priceUSD * rate;
    
    // For KRW and JPY, typically we do not show decimals
    if (currency === "KRW" || currency === "JPY") {
      return `${symbol} ${Math.round(converted).toLocaleString()}`;
    }
    
    return `${symbol} ${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
