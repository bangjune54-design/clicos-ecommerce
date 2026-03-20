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
    rating: 4.5 + Math.random() * 0.5,
    isBestseller: p.isBestseller || false,
    colors: p.colors || undefined,
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
