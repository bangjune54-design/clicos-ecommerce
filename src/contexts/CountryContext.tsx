import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { useCurrency } from "./CurrencyContext";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  language: "EN" | "KO" | "PT" | "ES" | "ZH" | "JA";
  currency: string;
  dialCode: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "KR", name: "South Korea", flag: "🇰🇷", language: "KO", currency: "KRW", dialCode: "+82" },
  { code: "US", name: "United States", flag: "🇺🇸", language: "EN", currency: "USD", dialCode: "+1" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", language: "PT", currency: "BRL", dialCode: "+55" },
];

interface CountryContextType {
  country: string; // "US" | "KR" | "BR"
  setCountry: (code: string) => void;
  getLocalizedProduct: (product: any) => any;
  formatProductPrice: (product: any, isWholesale?: boolean) => string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const { setLanguage } = useLanguage();
  const { setCurrency, formatLocalPrice, formatPrice } = useCurrency();
  
  const [country, setCountryState] = useState(() => {
    return localStorage.getItem("selectedCountry") || "BR";
  });

  const changeCountry = (code: string) => {
    const matched = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
    setCountryState(matched.code);
    localStorage.setItem("selectedCountry", matched.code);
    
    // Automatically update language and currency context
    setLanguage(matched.language);
    setCurrency(matched.currency);
    
    // Dispatch storage event to keep tabs synchronized
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    // Initial sync on mount
    const matched = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];
    setLanguage(matched.language);
    setCurrency(matched.currency);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selectedCountry" && e.newValue && e.newValue !== country) {
        const matched = COUNTRIES.find(c => c.code === e.newValue) || COUNTRIES[0];
        setCountryState(matched.code);
        setLanguage(matched.language);
        setCurrency(matched.currency);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [country, setLanguage, setCurrency]);

  const getLocalizedProduct = (product: any) => {
    if (!product) return product;
    
    const localizedName = product.countryNames?.[country] || product.name;
    
    // Check if country override price exists, otherwise keep base price
    let localizedPrice = product.price;
    if (product.countryPrices?.[country] !== undefined && product.countryPrices?.[country] !== null && product.countryPrices?.[country] !== "") {
      localizedPrice = Number(product.countryPrices[country]);
    }
    
    let localizedWholesalePrice = product.wholesalePrice;
    if (product.countryWholesalePrices?.[country] !== undefined && product.countryWholesalePrices?.[country] !== null && product.countryWholesalePrices?.[country] !== "") {
      localizedWholesalePrice = Number(product.countryWholesalePrices[country]);
    }
    
    return {
      ...product,
      name: localizedName,
      price: localizedPrice,
      wholesalePrice: localizedWholesalePrice
    };
  };

  const formatProductPrice = (product: any, isWholesale?: boolean) => {
    if (!product) return "";
    
    const userType = localStorage.getItem("userType") || "retail";
    const useWholesale = isWholesale !== undefined ? isWholesale : (userType === "wholesale");
    
    const overrides = useWholesale ? product.countryWholesalePrices : product.countryPrices;
    const currencyOverrides = useWholesale ? product.currencyWholesalePrices : product.currencyPrices;
    
    // 1. If country override exists, format it directly (no double conversion)
    if (overrides && overrides[country] !== undefined && overrides[country] !== null && overrides[country] !== "") {
      let amount = Number(overrides[country]);
      if (useWholesale) {
        const retailOverride = product.countryPrices?.[country];
        const retailAmount = (retailOverride !== undefined && retailOverride !== null && retailOverride !== "") ? Number(retailOverride) : Number(product.price);
        if (amount > retailAmount) amount = retailAmount;
      }
      return formatLocalPrice(amount);
    }
    
    // 2. Otherwise use the standard formatPrice on base price
    let basePrice = Number(product.price || 0);
    if (useWholesale) {
      const wp = (product.wholesalePrice !== undefined && product.wholesalePrice !== null && Number(product.wholesalePrice) > 0) ? Number(product.wholesalePrice) : basePrice;
      basePrice = wp <= basePrice ? wp : basePrice;
    }
    
    return formatPrice(basePrice, currencyOverrides);
  };

  return (
    <CountryContext.Provider value={{ country, setCountry: changeCountry, getLocalizedProduct, formatProductPrice }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
