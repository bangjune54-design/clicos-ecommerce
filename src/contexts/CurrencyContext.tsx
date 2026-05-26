import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Mock Exchange Rates against USD base
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  KRW: 1350.50,
  EUR: 0.92,
  JPY: 151.20,
  GBP: 0.79,
  BRL: 5.06,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  KRW: "₩",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  BRL: "R$",
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  getLocalPrice: (basePriceUSD: number, overrides?: Record<string, number | null | undefined>) => number;
  formatLocalPrice: (localAmount: number) => string;
  formatPrice: (priceUSD: number, overrides?: Record<string, number | null | undefined>) => string;
  currencies: string[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Store the user's currency preference in localStorage, default to USD
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });

  // Effect to save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("preferredCurrency", currency);
  }, [currency]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "preferredCurrency" && e.newValue && e.newValue !== currency) {
        setCurrencyState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currency]);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
  };

  const getLocalPrice = (basePriceUSD: number, overrides?: Record<string, number | null | undefined>) => {
    if (overrides && overrides[currency] !== undefined && overrides[currency] !== null) {
      return Number(overrides[currency]);
    }
    const rate = EXCHANGE_RATES[currency] || 1.0;
    return basePriceUSD * rate;
  };

  const formatLocalPrice = (localAmount: number) => {
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    if (currency === "KRW" || currency === "JPY") {
      return `${symbol} ${Math.round(localAmount).toLocaleString()}`;
    }
    return `${symbol} ${localAmount.toFixed(2)}`;
  };

  const formatPrice = (priceUSD: number, overrides?: Record<string, number | null | undefined>) => {
    const localAmount = getLocalPrice(priceUSD, overrides);
    return formatLocalPrice(localAmount);
  };

  const availableCurrencies = Object.keys(EXCHANGE_RATES);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, getLocalPrice, formatLocalPrice, formatPrice, currencies: availableCurrencies }}>
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
