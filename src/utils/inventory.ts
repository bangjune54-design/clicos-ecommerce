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
    imageSrc: p.imageSrc || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
    description: p.description || `Discover the beauty of carefully crafted authentic Korean formulas. This ${p.category || categoryName} essentially targets optimal results, ensuring your absolute satisfaction with every use. Premium ingredients combined with advanced technology deliver visible improvements.`,
    rating: 4.5 + Math.random() * 0.5,
    isBestseller: p.isBestseller || false,
    optionName: p.optionName || (p.colors ? "Color / Option" : undefined),
    options: p.options || p.colors || undefined,
  }));
};

const INITIAL_INVENTORY = [
  ...mapB2BProducts(fweeProducts, "FWEE", "Makeup"),
  ...mapB2BProducts(torridenProducts, "Torriden"),
  ...mapB2BProducts(ddalmomdeProducts, "DDALMOMDE"),
  ...mapB2BProducts(fourPmProducts, "4PM"),
  ...mapB2BProducts(medicubeProducts, "MEDICUBE"),
  ...mapB2BProducts(beautyOfJoseonProducts, "Beauty of Joseon"),
  ...mapB2BProducts(manyoProducts, "Ma:nyo"),
  ...mapB2BProducts(numbuzinProducts, "NUMBUZIN"),
  ...mapB2BProducts(meditherapyProducts, "Meditherapy", "Body Care"),
  ...mapB2BProducts(aesturaProducts, "AESTURA"),
  ...mapB2BProducts(kerasysProducts, "Kerasys", "Hair Care"),
  ...mapB2BProducts(atsProducts, "ATS", "Hair Care"),
];

export function getLiveInventory(): any[] {
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
  localStorage.setItem("globalInventory", JSON.stringify(inventory));
}

export const INITIAL_BRANDS = [
  { name: "4PM", description: "Premium, functional skincare solutions.", image: "/4pm-b2b.jpg" },
  { name: "AESTURA", description: "Derma-cosmetics representing dermatology-grade barrier repair.", image: "/aestura-b2b.png" },
  { name: "DDALMOMDE", description: "Innovative beauty focused on natural radiance.", image: "https://ecimg.cafe24img.com/pg296b84565315057/ddalmomde/web/product/big/20250601/286db4d145a35e2181a733b08b008e16.jpg" },
  { name: "ATS", description: "Professional hair and scalp care brand." },
  { name: "MEDICUBE", description: "Clinically tested dermocosmetics for sensitive and troubled skin.", image: "https://themedicube.com.sg/cdn/shop/products/86e27ee7b7a7a18211c0bd6d5ecf4d2c.png" },
  { name: "NUMBUZIN", description: "Number-based customized skincare solutions." },
  { name: "Ma:nyo", description: "Pure ingredient-oriented skincare brand for a healthy barrier." },
  { name: "Meditherapy", description: "Home-care healing solutions merging devices and cosmetics." },
  { name: "FWEE", description: "Trendy color cosmetics focused on expressive makeup." },
  { name: "Torriden", description: "Clean beauty brand focusing on deep hydration with hyaluronic acid." },
  { name: "Beauty of Joseon", description: "Hanbang (traditional Korean herbal medicine) skincare for modern routines." },
  { name: "Kerasys", description: "Premium hair clinics and body care with rich, perfumed scents.", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&auto=format&fit=crop" },
];

export function getLiveBrands(): any[] {
  const local = localStorage.getItem("globalBrands");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return INITIAL_BRANDS;
    }
  }
  return INITIAL_BRANDS;
}

export function saveLiveBrands(brands: any[]) {
  localStorage.setItem("globalBrands", JSON.stringify(brands));
}

