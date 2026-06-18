import { fweeProducts } from "../data/fweeProducts";
import { torridenProducts } from "../data/torridenProducts";
import { medicubeProducts } from "../data/medicubeProducts";
import { aesturaProducts } from "../data/aesturaProducts";
import { fourPmProducts } from "../data/4pmProducts";
import { ddalmomdeProducts } from "../data/ddalmomdeProducts";
import { kerasysProducts } from "../data/kerasysProducts";
import { atsProducts } from "../data/atsProducts";
import { beautyOfJoseonProducts } from "../data/beautyOfJoseonProducts";
import { manyoProducts } from "../data/manyoProducts";
import { numbuzinProducts } from "../data/numbuzinProducts";
import { meditherapyProducts } from "../data/meditherapyProducts";

// Helper to convert wholesale product shape to retail shape where necessary
const mapB2BProducts = (b2bList: any[], brandName: string, categoryName: string = "Skincare") => {
  return b2bList.map((p, idx) => ({
    id: `b2b-${brandName.toLowerCase()}-${p.id || idx}`,
    name: p.name,
    brand: brandName,
    category: p.category || categoryName,
    price: p.wholesalePrice ? p.wholesalePrice * 1.5 : 30.0,
    wholesalePrice: p.wholesalePrice,
    moq: p.moq || 10,
    imageSrc: "/placeholder-product.svg",
    description: p.description || `Discover the beauty of carefully crafted authentic Korean formulas. This ${p.category || categoryName} essentially targets optimal results, ensuring your absolute satisfaction with every use. Premium ingredients combined with advanced technology deliver visible improvements.`,
    rating: 4.5 + Math.random() * 0.5,
    isBestseller: p.isBestseller || false,
    optionName: p.optionName || (p.colors ? "Color / Option" : undefined),
    options: p.options || p.colors || undefined,
    currencyPrices: p.currencyPrices,
    currencyWholesalePrices: p.currencyWholesalePrices,
  }));
};

import { INITIAL_INVENTORY, INITIAL_BRANDS } from "./syncedDefaults";

// Global cache for synchronous access
let inventoryCache: any[] | null = null;
let brandsCache: any[] | null = null;
let isInitialized = false;

// IndexedDB Constants
const DB_NAME = "ClicosStore";
const STORE_NAME = "appData";

// Helper to open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Helper for DB operations
const dbGet = async (key: string): Promise<any> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbSet = async (key: string, value: any): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export async function initializeStorage() {
  if (isInitialized) return;

  try {
    const APP_VERSION = "2.0";
    const currentVersion = localStorage.getItem("clicosVersion");
    if (currentVersion !== APP_VERSION) {
      localStorage.removeItem("homepageBanners");
      localStorage.removeItem("homepageTickers");
      try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.clear();
      } catch (e) {
        console.error("Failed to clear store", e);
      }
      localStorage.setItem("clicosVersion", APP_VERSION);
    }

    // 1. Try to load from IndexedDB
    let inv = await dbGet("globalInventory");
    let brd = await dbGet("globalBrands");

    // Guarantee English by default for returning users migrating from legacy KO default versions
    const savedLang = localStorage.getItem("language");
    if (!savedLang || savedLang === "KO") {
      localStorage.setItem("language", "EN");
    }

    // 2. Fallback to localStorage + Migration
    if (!inv) {
      const localInv = localStorage.getItem("globalInventory");
      if (localInv) {
        let parsedInv = JSON.parse(localInv);
        if (Array.isArray(parsedInv)) {
          parsedInv = parsedInv.map(p => {
            if (p.imageSrc && p.imageSrc !== "/placeholder-product.svg" && !p.imageSrc.startsWith("data:")) {
              return { ...p, imageSrc: "/placeholder-product.svg" };
            }
            return p;
          });
        }
        inv = parsedInv;
      }
      localStorage.removeItem("globalInventory");
    } else {
      localStorage.removeItem("globalInventory");
    }

    if (!brd) {
      const localBrd = localStorage.getItem("globalBrands");
      if (localBrd) {
        brd = JSON.parse(localBrd);
      }
      localStorage.removeItem("globalBrands");
    } else {
      localStorage.removeItem("globalBrands");
    }

    // 3. Merge default static assets/code changes (e.g. brand SVGs, product updates) into loaded cache
    let deletedBrands: string[] = [];
    try {
      deletedBrands = JSON.parse(localStorage.getItem("deletedBrandNames") || "[]");
    } catch {}

    let deletedProducts: string[] = [];
    try {
      deletedProducts = JSON.parse(localStorage.getItem("deletedProductIds") || "[]");
    } catch {}

    if (brd && Array.isArray(brd)) {
      let brandsChanged = false;
      const mergedBrands = [...brd];
      INITIAL_BRANDS.forEach(defaultBrand => {
        if (deletedBrands.includes(defaultBrand.name.toLowerCase())) {
          return;
        }
        const existingIdx = mergedBrands.findIndex(b => b.name.toLowerCase() === defaultBrand.name.toLowerCase());
        if (existingIdx > -1) {
          const existing = mergedBrands[existingIdx];
          
          // Identify if the image is an old default SVG that should be updated to the new default SVG.
          // Any custom uploaded brand image (WebP/PNG/JPEG/GIF/URLs/local paths) will be preserved.
          const isOldDefaultSvg = existing.image && 
            existing.image.startsWith("data:image/svg+xml") && 
            existing.image !== defaultBrand.image;
            
          const isPlaceholderOrEmpty = !existing.image || 
            existing.image === "/placeholder-brand.svg";
            
          const shouldUpdateImage = isPlaceholderOrEmpty || isOldDefaultSvg;
          
          const hasImageDiff = existing.image !== defaultBrand.image && shouldUpdateImage;
          const hasDescDiff = existing.description !== defaultBrand.description && !existing.description; // Keep custom description if it exists
          
          if (hasImageDiff || hasDescDiff) {
            mergedBrands[existingIdx] = {
              ...existing,
              description: hasDescDiff ? defaultBrand.description : existing.description,
              image: hasImageDiff ? defaultBrand.image : existing.image
            };
            brandsChanged = true;
          }
        } else {
          mergedBrands.push(defaultBrand);
          brandsChanged = true;
        }
      });
      brandsCache = mergedBrands;
      if (brandsChanged) {
        await dbSet("globalBrands", mergedBrands);
      }
    } else {
      brandsCache = INITIAL_BRANDS.filter(b => !deletedBrands.includes(b.name.toLowerCase()));
      await dbSet("globalBrands", brandsCache);
    }

    if (inv && Array.isArray(inv)) {
      let invChanged = false;
      const mergedInventory = [...inv];
      INITIAL_INVENTORY.forEach(defaultProduct => {
        if (deletedProducts.includes(defaultProduct.id)) {
          return;
        }
        const existingIdx = mergedInventory.findIndex(p => p.id === defaultProduct.id);
        if (existingIdx > -1) {
          const existing = mergedInventory[existingIdx];
          const keysToCompare = ['name', 'brand', 'category', 'price', 'wholesalePrice', 'moq', 'description', 'isBestseller', 'optionName', 'options', 'imageSrc', 'imageFit', 'imageScale'] as const;
          let hasDiff = false;
          
          const isCustomProductImage = existing.imageSrc && 
            existing.imageSrc !== "/placeholder-product.svg" && (
              existing.imageSrc.startsWith("data:") ||
              existing.imageSrc.startsWith("http://") ||
              existing.imageSrc.startsWith("https://") ||
              existing.imageSrc.startsWith("/")
            );
          
          keysToCompare.forEach(key => {
            if (JSON.stringify(existing[key]) !== JSON.stringify(defaultProduct[key])) {
              if (key === 'imageSrc' && isCustomProductImage) {
                return; // Keep admin custom uploaded image/URL
              }
              hasDiff = true;
            }
          });
          if (hasDiff) {
            mergedInventory[existingIdx] = {
              ...existing,
              ...defaultProduct,
              imageSrc: isCustomProductImage ? existing.imageSrc : defaultProduct.imageSrc,
              imageFit: existing.imageFit,
              imageScale: existing.imageScale
            };
            invChanged = true;
          }
        } else {
          mergedInventory.push(defaultProduct);
          invChanged = true;
        }
      });

      // Sanitize inventory by removing legacy unauthenticated image links, but PRESERVE codebase defaults and custom URLs
      let needsReset = false;
      const sanitizedInventory = mergedInventory.map(p => {
        const defaultProduct = INITIAL_INVENTORY.find(dp => dp.id === p.id);
        const isDefaultImage = defaultProduct && defaultProduct.imageSrc === p.imageSrc;
        
        const isCustomProductImage = p.imageSrc && 
          p.imageSrc !== "/placeholder-product.svg" && (
            p.imageSrc.startsWith("data:") ||
            p.imageSrc.startsWith("http://") ||
            p.imageSrc.startsWith("https://") ||
            p.imageSrc.startsWith("/")
          );
        
        if (p.imageSrc && p.imageSrc !== "/placeholder-product.svg" && !isCustomProductImage && !isDefaultImage) {
          needsReset = true;
          return { ...p, imageSrc: "/placeholder-product.svg" };
        }
        return p;
      });

      inventoryCache = sanitizedInventory;
      if (invChanged || needsReset) {
        await dbSet("globalInventory", sanitizedInventory);
      }
    } else {
      inventoryCache = INITIAL_INVENTORY;
      await dbSet("globalInventory", INITIAL_INVENTORY);
    }

  } catch (e) {
    console.error("Storage Initialization Error:", e);
    // Fallbacks
    if (!inventoryCache) inventoryCache = INITIAL_INVENTORY;
    if (!brandsCache) brandsCache = INITIAL_BRANDS;
  }

  isInitialized = true;
}

export function isStorageReady() {
  return isInitialized;
}

export function getLiveInventory(): any[] {
  // If initialized, use cache. If not, try localStorage for immediate sync needs (SSR or race conditions)
  if (isInitialized && inventoryCache) return inventoryCache;
  
  const local = localStorage.getItem("globalInventory");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return INITIAL_INVENTORY;
    }
  }
  return INITIAL_INVENTORY;
}

export function saveLiveInventory(inventory: any[]) {
  inventoryCache = inventory;
  dbSet("globalInventory", inventory).catch(console.error);
  
  // Redundant LCD save removed to prevent quota issues for cart/other small data
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

const svg4PM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <defs>
    <linearGradient id="g4pm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23FFF5F0"/>
      <stop offset="100%" stop-color="%23FFECE2"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(%23g4pm)" rx="16"/>
  <circle cx="80" cy="50" r="32" fill="none" stroke="%23FF6B35" stroke-width="1.5" stroke-dasharray="1 3" opacity="0.6"/>
  <path d="M80 26 V50 H96" fill="none" stroke="%23FF6B35" stroke-width="2" stroke-linecap="round"/>
  <text x="80" y="56" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="%23FF6B35" text-anchor="middle" letter-spacing="1">4PM</text>
</svg>`;

const svgAESTURA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#F0F7FF" rx="16"/>
  <path d="M80 18 C90 18 95 24 95 32 C95 45 80 54 80 54 C80 54 65 45 65 32 C65 24 70 18 80 18 Z" fill="#0066CC" opacity="0.15"/>
  <path d="M80 23 V41 M71 32 H89" fill="none" stroke="#0066CC" stroke-width="3" stroke-linecap="round"/>
  <text x="80" y="72" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" fill="#0F2C59" text-anchor="middle" letter-spacing="2">AESTURA</text>
  <text x="80" y="84" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="7" fill="#0066CC" text-anchor="middle" letter-spacing="3">DERMA SCIENCE</text>
</svg>`;

const svgDDALMOMDE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#FAF6F0" rx="16"/>
  <circle cx="80" cy="38" r="18" fill="#E6DED4" opacity="0.4"/>
  <path d="M72 38 C72 30 88 30 88 38 C88 46 72 46 72 38 Z M80 22 C80 22 75 30 80 38 C85 30 80 22 80 22" fill="none" stroke="#8A7A6E" stroke-width="1.5" stroke-linecap="round"/>
  <text x="80" y="70" font-family="Georgia, serif" font-weight="700" font-size="12" fill="#4A3E3D" text-anchor="middle" letter-spacing="2.5">DDALMOMDE</text>
  <text x="80" y="82" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="6" fill="#8A7A6E" text-anchor="middle" letter-spacing="2">NATURAL RADIANCE</text>
</svg>`;

const svgATS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#1A1A1A" rx="16"/>
  <path d="M50 35 C70 15 90 55 110 35" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M50 45 C70 25 90 65 110 45" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  <text x="80" y="74" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">ATS</text>
  <text x="80" y="85" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="6.5" fill="#D4AF37" text-anchor="middle" letter-spacing="3">PROFESSIONAL</text>
</svg>`;

const svgMEDICUBE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#FFF5F5" rx="16"/>
  <rect x="68" y="16" width="24" height="24" rx="6" fill="#E53E3E"/>
  <path d="M80 22 V34 M74 28 H86" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <text x="80" y="66" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#1A202C" text-anchor="middle" letter-spacing="1.5">medicube</text>
  <text x="80" y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="7" fill="#E53E3E" text-anchor="middle" letter-spacing="3">CLINICAL SKIN</text>
</svg>`;

const svgNUMBUZIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#FAF8F5" rx="16"/>
  <text x="80" y="52" font-family="Georgia, serif" font-weight="800" font-size="44" fill="#C3A683" opacity="0.25" text-anchor="middle">5</text>
  <text x="80" y="65" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" fill="#3D3D3D" text-anchor="middle" letter-spacing="1">numbuz:n</text>
  <text x="80" y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="7" fill="#8C8C8C" text-anchor="middle" letter-spacing="2">No. Skincare Solutions</text>
</svg>`;

const svgMANYO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#F4F7F4" rx="16"/>
  <path d="M80 18 C88 28 84 38 80 42 C76 38 72 28 80 18 Z M80 28 V42" fill="none" stroke="#2D6A4F" stroke-width="1.5" stroke-linecap="round"/>
  <text x="80" y="66" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="16" fill="#1B4332" text-anchor="middle" letter-spacing="1.5">ma:nyo</text>
  <text x="80" y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="7" fill="#52B788" text-anchor="middle" letter-spacing="3">PURE NATURE</text>
</svg>`;

const svgMEDITHERAPY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#F8FAFC" rx="16"/>
  <circle cx="68" cy="30" r="4" fill="#6366F1"/>
  <circle cx="92" cy="30" r="4" fill="#6366F1"/>
  <circle cx="80" cy="40" r="6" fill="none" stroke="#6366F1" stroke-width="2"/>
  <line x1="72" y1="30" x2="76" y2="35" stroke="#6366F1" stroke-width="1.5"/>
  <line x1="88" y1="30" x2="84" y2="35" stroke="#6366F1" stroke-width="1.5"/>
  <text x="80" y="68" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="13" fill="#1E293B" text-anchor="middle" letter-spacing="1">Meditherapy</text>
  <text x="80" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="6.5" fill="#6366F1" text-anchor="middle" letter-spacing="2">BEAUTY TECH</text>
</svg>`;

const svgFWEE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#FFF0F5" rx="16"/>
  <circle cx="80" cy="32" r="14" fill="#FFB6C1" opacity="0.6"/>
  <text x="80" y="66" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#E05286" text-anchor="middle" letter-spacing="0">fwee</text>
  <text x="80" y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="7.5" fill="#E05286" text-anchor="middle" letter-spacing="2">COLOR CLUB</text>
</svg>`;

const svgTORRIDEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#E0F2FE" rx="16"/>
  <path d="M80 18 C80 18 90 28 90 35 C90 41 85 46 80 46 C75 46 70 41 70 35 C70 28 80 18 80 18 Z" fill="#0EA5E9" opacity="0.2"/>
  <circle cx="80" cy="36" r="4" fill="#0EA5E9"/>
  <text x="80" y="68" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#0369A1" text-anchor="middle" letter-spacing="1.5">Torriden</text>
  <text x="80" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="7" fill="#0EA5E9" text-anchor="middle" letter-spacing="3.5">YOUR SKIN OUR PLANET</text>
</svg>`;

const svgBEAUTYOFJOSEON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#FAF6F0" rx="16"/>
  <path d="M64 36 Q80 20 96 36" fill="none" stroke="#5C4D3C" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="80" cy="34" r="10" fill="none" stroke="#5C4D3C" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
  <text x="80" y="64" font-family="Georgia, serif" font-weight="700" font-size="11" fill="#3D3124" text-anchor="middle" letter-spacing="1">Beauty of Joseon</text>
  <text x="80" y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="6" fill="#8C7A6B" text-anchor="middle" letter-spacing="4">HANBANG SKINCARE</text>
</svg>`;

const svgKERASYS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
  <rect width="100%" height="100%" fill="#111111" rx="16"/>
  <path d="M50 40 C65 25 95 55 110 40" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
  <text x="80" y="68" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">Kerasys</text>
  <text x="80" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="7" fill="#D4AF37" text-anchor="middle" letter-spacing="3">HAIR CLINIC SYSTEM</text>
</svg>`;

// INITIAL_BRANDS is imported from syncedDefaults

export function getLiveBrands(): any[] {
  if (isInitialized && brandsCache) return brandsCache;

  const local = localStorage.getItem("globalBrands");
  let brandsList = INITIAL_BRANDS;
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        brandsList = parsed.map((pb: any) => {
          const defaultBrand = INITIAL_BRANDS.find(
            (ib) => ib.name.toLowerCase() === pb.name.toLowerCase()
          );
          if (defaultBrand) {
            return {
              ...defaultBrand,
              ...pb,
              image: pb.image || defaultBrand.image,
              hidden: pb.hidden !== undefined ? pb.hidden : false
            };
          }
          return {
            ...pb,
            hidden: pb.hidden !== undefined ? pb.hidden : false
          };
        });
      }
    } catch {
      brandsList = INITIAL_BRANDS;
    }
  }

  // Ensure all brands have a hidden field defined
  brandsList = brandsList.map(b => ({
    ...b,
    hidden: b.hidden !== undefined ? b.hidden : false
  }));

  brandsCache = brandsList;
  return brandsList;
}

export function getLiveBrandsForCustomers(): any[] {
  return getLiveBrands().filter(b => !b.hidden);
}

export function getLiveInventoryForCustomers(): any[] {
  const hiddenBrandNames = new Set(
    getLiveBrands()
      .filter(b => b.hidden)
      .map(b => b.name.toLowerCase())
  );
  return getLiveInventory().filter(
    p => !p.brand || !hiddenBrandNames.has(p.brand.toLowerCase())
  );
}

export function saveLiveBrands(brands: any[]) {
  brandsCache = brands;
  dbSet("globalBrands", brands).catch(console.error);

  // Redundant LCD save removed
}

export async function resetInventoryToDefault() {
  inventoryCache = [...INITIAL_INVENTORY];
  await dbSet("globalInventory", INITIAL_INVENTORY);
  localStorage.removeItem("deletedProductIds");
  localStorage.removeItem("deletedBrandNames");
  return inventoryCache;
}
