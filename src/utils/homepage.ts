export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string; // Base64 or URL
  link: string;
}

const toBase64Svg = (svg: string) => {
  const cleanSvg = svg.trim();
  if (typeof btoa !== "undefined") {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanSvg)))}`;
  } else if (typeof Buffer !== "undefined") {
    return `data:image/svg+xml;base64,${Buffer.from(cleanSvg, "utf-8").toString("base64")}`;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
};

// Beautiful premium default banner SVGs that look like custom graphic banners
const banner1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#FBF9F6"/>
  <path d="M 0,200 Q 400,100 800,300 T 1600,200 L 1600,800 L 0,800 Z" fill="#F3ECE3" opacity="0.6"/>
  <path d="M 0,400 Q 500,300 1000,500 T 1600,400 L 1600,800 L 0,800 Z" fill="#EAE0D5" opacity="0.4"/>
  <circle cx="1300" cy="300" r="150" fill="#E6C5B3" opacity="0.2"/>
  <circle cx="300" cy="600" r="200" fill="#E8DCD1" opacity="0.3"/>
  <text x="800" y="320" font-family="Georgia, serif" font-weight="bold" font-size="56" fill="#3D312A" text-anchor="middle" letter-spacing="2">CLICOS BEAUTY</text>
  <text x="800" y="410" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#1A130F" text-anchor="middle" letter-spacing="4">PREMIUM KOREAN COSMETICS</text>
  <text x="800" y="480" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="24" fill="#6E5D53" text-anchor="middle" letter-spacing="8">AUTHENTIC SKINCARE &amp; HAIR CARE SOLUTIONS</text>
  <rect x="700" y="540" width="200" height="50" rx="25" fill="#3D312A"/>
  <text x="800" y="572" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">EXPLORE CATALOG</text>
</svg>`;

const banner2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#F1F6FA"/>
  <path d="M 0,300 Q 600,450 1200,250 T 1600,350 L 1600,800 L 0,800 Z" fill="#E2EDF5" opacity="0.6"/>
  <circle cx="1200" cy="500" r="250" fill="#1E3A8A" opacity="0.04"/>
  <circle cx="200" cy="200" r="100" fill="#3B82F6" opacity="0.05"/>
  <path d="M 150,400 L 1450,400" stroke="#3B82F6" stroke-width="1" stroke-dasharray="8 8" opacity="0.2"/>
  <text x="800" y="320" font-family="Georgia, serif" font-weight="bold" font-size="56" fill="#1E293B" text-anchor="middle" letter-spacing="2">CLICOS DERMA</text>
  <text x="800" y="410" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#0F172A" text-anchor="middle" letter-spacing="4">AUTHORIZED K-BEAUTY LABS</text>
  <text x="800" y="480" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="24" fill="#475569" text-anchor="middle" letter-spacing="8">DIRECT CONTRACT SOURCING FROM SEOUL</text>
  <rect x="700" y="540" width="200" height="50" rx="25" fill="#0F172A"/>
  <text x="800" y="572" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">VIEW PRODUCTS</text>
</svg>`;

const banner3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0F172A"/>
  <path d="M 0,500 Q 400,300 800,600 T 1600,450 L 1600,800 L 0,800 Z" fill="#1E293B" opacity="0.7"/>
  <circle cx="400" cy="300" r="180" fill="#D4AF37" opacity="0.04"/>
  <circle cx="1300" cy="600" r="220" fill="#D4AF37" opacity="0.03"/>
  <text x="800" y="320" font-family="Georgia, serif" font-weight="bold" font-size="56" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">CLICOS GLOBAL</text>
  <text x="800" y="410" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">COMPREHENSIVE B2B SUPPLY</text>
  <text x="800" y="480" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="24" fill="#94A3B8" text-anchor="middle" letter-spacing="8">CUSTOMS CLEARANCE &amp; GLOBAL LOGISTICS SUPPORT</text>
  <rect x="700" y="540" width="200" height="50" rx="25" fill="#D4AF37"/>
  <text x="800" y="572" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#0F172A" text-anchor="middle" letter-spacing="3">GET IN TOUCH</text>
</svg>`;

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Exporting Premium Korean Cosmetics & Hair Care",
    subtitle: "Trusted by retail customers and international distributors alike.",
    image: toBase64Svg(banner1Svg),
    link: "/contact"
  },
  {
    id: "banner-2",
    title: "Sourced Directly from Seoul's Authorized Labs",
    subtitle: "Carefully curated selections target optimal results, meeting standard safety requirements.",
    image: toBase64Svg(banner2Svg),
    link: "#products"
  },
  {
    id: "banner-3",
    title: "Comprehensive B2B Supply & Shipping Support",
    subtitle: "Worry-free customs, flexible wholesale tiers, and low MOQ frameworks.",
    image: toBase64Svg(banner3Svg),
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
  let list = DEFAULT_BANNERS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed.map((pb: any) => {
          const defaultBanner = DEFAULT_BANNERS.find(db => db.id === pb.id);
          // Auto-migrate banners that have empty images so they display the beautiful premium SVGs
          if (defaultBanner && (!pb.image || pb.image === "")) {
            return {
              ...pb,
              title: pb.title || defaultBanner.title,
              subtitle: pb.subtitle || defaultBanner.subtitle,
              image: defaultBanner.image
            };
          }
          return pb;
        });
      }
    } catch {
      list = DEFAULT_BANNERS;
    }
  }
  localStorage.setItem("homepageBanners", JSON.stringify(list));
  return list;
}

export function saveLiveBanners(banners: Banner[]) {
  localStorage.setItem("homepageBanners", JSON.stringify(banners));
}

export function getLiveTickers(): string[] {
  const saved = localStorage.getItem("homepageTickers");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return DEFAULT_TICKERS;
    } catch {
      return DEFAULT_TICKERS;
    }
  }
  localStorage.setItem("homepageTickers", JSON.stringify(DEFAULT_TICKERS));
  return DEFAULT_TICKERS;
}

export function saveLiveTickers(tickers: string[]) {
  localStorage.setItem("homepageTickers", JSON.stringify(tickers));
}
