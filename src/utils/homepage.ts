export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string; // Base64 or URL
  link: string;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Exporting Premium Korean Cosmetics & Hair Care",
    subtitle: "Trusted by retail customers and international distributors alike.",
    image: "", // Empty string uses gorgeous CSS theme gradient
    link: "/contact"
  },
  {
    id: "banner-2",
    title: "Sourced Directly from Seoul's Authorized Labs",
    subtitle: "Carefully curated selections target optimal results, meeting standard safety requirements.",
    image: "",
    link: "#products"
  },
  {
    id: "banner-3",
    title: "Comprehensive B2B Supply & Shipping Support",
    subtitle: "Worry-free customs, flexible wholesale tiers, and low MOQ frameworks.",
    image: "",
    link: "/contact"
  }
];

const DEFAULT_TICKERS: string[] = [
  "✨ 100% Authentic Korean Beauty Products Sourced Directly From Authorized Brands in Seoul",
  "📦 Worry-Free Worldwide Shipping & Full International Customs Support",
  "💼 B2B Wholesale Pricing Tiers Now Open - Apply Today via Contact",
  "🔥 Partnered with Leading Brands: FWEE, Torriden, Beauty of Joseon, AESTURA, MEDICUBE, ATS, Kerasys, and more"
];

export function getLiveBanners(): Banner[] {
  const saved = localStorage.getItem("homepageBanners");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_BANNERS;
    }
  }
  // Initialize in localStorage
  localStorage.setItem("homepageBanners", JSON.stringify(DEFAULT_BANNERS));
  return DEFAULT_BANNERS;
}

export function saveLiveBanners(banners: Banner[]) {
  localStorage.setItem("homepageBanners", JSON.stringify(banners));
}

export function getLiveTickers(): string[] {
  const saved = localStorage.getItem("homepageTickers");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_TICKERS;
    }
  }
  // Initialize in localStorage
  localStorage.setItem("homepageTickers", JSON.stringify(DEFAULT_TICKERS));
  return DEFAULT_TICKERS;
}

export function saveLiveTickers(tickers: string[]) {
  localStorage.setItem("homepageTickers", JSON.stringify(tickers));
}
