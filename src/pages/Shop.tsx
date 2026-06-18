import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Filter, 
  ChevronDown, 
  ShoppingBag, 
  Search, 
  Star,
  Sun, 
  Droplets, 
  Sparkles, 
  Wind, 
  Layers, 
  Smile, 
  Brush, 
  Scissors, 
  Heart, 
  Grid 
} from "lucide-react";

function getCategoryIcon(catName: string) {
  const name = catName.toLowerCase();
  if (name === "skincare") {
    return <img src="/categories/skincare.jpg" alt="Skincare" className="w-full h-full object-cover rounded-md" />;
  }
  if (name === "makeup") {
    return <img src="/categories/makeup.jpg" alt="Makeup" className="w-full h-full object-cover rounded-md" />;
  }
  if (name === "hair care" || name === "haircare") {
    return <img src="/categories/hair-care.jpg" alt="Hair Care" className="w-full h-full object-cover rounded-md" />;
  }
  if (name === "body care" || name === "bodycare") {
    return <img src="/categories/body-care.jpg" alt="Body Care" className="w-full h-full object-cover rounded-md" />;
  }
  if (name === "sun care" || name === "suncare" || name.includes("sun")) {
    return <img src="/categories/sun-care.jpg" alt="Sun Care" className="w-full h-full object-cover rounded-md" />;
  }
  if (name.includes("cleansing")) return <Droplets className="w-5 h-5 text-blue-500" />;
  if (name.includes("serum") || name.includes("ampoule")) return <Sparkles className="w-5 h-5 text-emerald-500" />;
  if (name.includes("cream")) return <Layers className="w-5 h-5 text-indigo-500" />;
  if (name.includes("toner")) return <Wind className="w-5 h-5 text-sky-500" />;
  if (name.includes("mask")) return <Smile className="w-5 h-5 text-teal-500" />;
  if (name.includes("makeup") || name.includes("lip") || name.includes("face")) return <Brush className="w-5 h-5 text-pink-500" />;
  if (name.includes("hair")) return <Scissors className="w-5 h-5 text-purple-500" />;
  if (name.includes("body")) return <Heart className="w-5 h-5 text-red-500" />;
  return <Grid className="w-5 h-5 text-gray-500" />;
}
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";
import { getLiveInventoryForCustomers, getLiveBrandsForCustomers } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";

const CATEGORY_STRUCTURE = [
  { name: "All" },
  {
    name: "Skincare",
    subcategories: ["Sun Care", "Cleansing", "Serum & Ampoule", "Cream", "Toner", "Mask"]
  },
  {
    name: "Makeup",
    subcategories: ["Lip Makeup", "Face Makeup"]
  },
  { name: "Hair Care" },
  { name: "Body Care" }
];

const ALL_CATEGORIES = CATEGORY_STRUCTURE.flatMap(c => [c.name, ...(c.subcategories || [])]);

const TRANSLATED_SHOP: Record<string, Record<string, string>> = {
  EN: {
    "Shop All Products": "Shop All Products",
    "Shop Subtitle": "Discover authentic Korean beauty shipped directly to your door.",
    "Filters": "Filters",
    "Collection": "Collection",
    "All Products": "All Products",
    "New Arrivals": "New Arrivals",
    "Best Sellers": "Best Sellers",
    "Category": "Category",
    "Brand": "Brand",
    "No products found": "No products found",
    "Try different category": "Try selecting a different category or search term.",
    "Add to Cart": "Add to Cart",
    "Bestseller": "Bestseller",
    "Search placeholder": "Search products & brands...",
    "Select option": "Select option...",
    "sold": "sold",
    "All": "All",
    "Products": "Products"
  },
  KO: {
    "Shop All Products": "모든 제품 보기",
    "Shop Subtitle": "대문 앞까지 직배송되는 믿을 수 있는 K-뷰티 정품을 만나보세요.",
    "Filters": "필터",
    "Collection": "컬렉션",
    "All Products": "모든 상품",
    "New Arrivals": "신상품",
    "Best Sellers": "베스트셀러",
    "Category": "카테고리",
    "Brand": "브랜드",
    "No products found": "검색 결과가 없습니다.",
    "Try different category": "다른 카테고리를 선택하거나 검색어를 변경해 보세요.",
    "Add to Cart": "장바구니 담기",
    "Bestseller": "인기 상품",
    "Search placeholder": "제품 및 브랜드 검색...",
    "Select option": "옵션 선택...",
    "sold": "개 판매됨",
    "All": "전체",
    "Products": "제품"
  },
  PT: {
    "Shop All Products": "Todos os Produtos",
    "Shop Subtitle": "Descubra a autêntica beleza coreana enviada diretamente para sua porta.",
    "Filters": "Filtros",
    "Collection": "Coleção",
    "All Products": "Todos os Produtos",
    "New Arrivals": "Novidades",
    "Best Sellers": "Mais Vendidos",
    "Category": "Categoria",
    "Brand": "Marca",
    "No products found": "Nenhum produto encontrado",
    "Try different category": "Tente selecionar uma categoria diferente ou termo de busca.",
    "Add to Cart": "Comprar",
    "Bestseller": "Mais Vendido",
    "Search placeholder": "Buscar produtos e marcas...",
    "Select option": "Selecionar opção...",
    "sold": "vendidos",
    "All": "Todos",
    "Products": "Produtos"
  },
  ES: {
    "Shop All Products": "Todos los Productos",
    "Shop Subtitle": "Descubra la auténtica belleza coreana enviada directamente a su puerta.",
    "Filters": "Filtros",
    "Collection": "Colección",
    "All Products": "Todos los Productos",
    "New Arrivals": "Novedades",
    "Best Sellers": "Más Vendidos",
    "Category": "Categoría",
    "Brand": "Marca",
    "No products found": "No se encontraron productos",
    "Try different category": "Intente seleccionar una categoría diferente o término de búsqueda.",
    "Add to Cart": "Añadir al Carrito",
    "Bestseller": "Más Vendido",
    "Search placeholder": "Buscar productos y marcas...",
    "Select option": "Seleccionar opción...",
    "sold": "vendidos",
    "All": "Todos",
    "Products": "Productos"
  },
  ZH: {
    "Shop All Products": "全部产品",
    "Shop Subtitle": "探索直接送达您家门口的正宗韩国美妆。",
    "Filters": "筛选器",
    "Collection": "系列分类",
    "All Products": "全部商品",
    "New Arrivals": "新品上市",
    "Best Sellers": "畅销明星",
    "Category": "品类",
    "Brand": "品牌",
    "No products found": "未找到相关产品",
    "Try different category": "请尝试选择其他类别或更改您的搜索词。",
    "Add to Cart": "加入购物车",
    "Bestseller": "畅销爆款",
    "Search placeholder": "搜索产品和品牌...",
    "Select option": "选择选项...",
    "sold": "已售",
    "All": "全部",
    "Products": "产品"
  },
  JA: {
    "Shop All Products": "全商品一覧",
    "Shop Subtitle": "ご自宅に直接お届けする、安心の本物韓国コスメをご覧ください。",
    "Filters": "フィルター",
    "Collection": "コレクション",
    "All Products": "すべての商品",
    "New Arrivals": "新着商品",
    "Best Sellers": "ベストセラー",
    "Category": "カテゴリー",
    "Brand": "ブランド",
    "No products found": "該当する商品は見つかりませんでした",
    "Try different category": "別のカテゴリーを選択するか、検索ワードを変更してください。",
    "Add to Cart": "カートに入れる",
    "Bestseller": "ベストセラー",
    "Search placeholder": "製品やブランドを検索...",
    "Select option": "オプションを選択...",
    "sold": "個販売",
    "All": "すべて",
    "Products": "商品"
  }
};

export function Shop() {
  const allShopProducts = getLiveInventoryForCustomers();
  const b2bBrands = getLiveBrandsForCustomers();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const { getLocalizedProduct, formatProductPrice } = useCountry();
  const [mobileFilterTab, setMobileFilterTab] = useState<"none" | "category" | "brand">("none");
  
  const d = (key: string) => {
    return TRANSLATED_SHOP[language]?.[key] || key;
  };

  const translateCategory = (catName: string) => {
    const key = catName.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_");
    if (key === "all") return d("All");
    if (key === "skincare") return t("skincare");
    if (key === "makeup") return t("makeup");
    if (key === "hair_care" || key === "haircare") return t("hair_care");
    if (key === "body_care" || key === "bodycare") return t("body_care");
    
    // Subcategories
    if (key === "sun_care") return t("cat_sun_care");
    if (key === "cleansing") return t("cat_cleansing");
    if (key === "serum_ampoule") return t("cat_serum");
    if (key === "cream") return t("cat_cream");
    if (key === "toner") return t("cat_toner");
    if (key === "facial_mask" || key === "mask") return t("cat_mask");
    if (key === "lip_makeup") return t("cat_lip_makeup") || "Lip Makeup";
    if (key === "face_makeup") return t("cat_face_makeup") || "Face Makeup";
    
    return t(key) || catName;
  };

  const initialCategory = searchParams.get("category");
  const initialBrand = searchParams.get("brand");
  const initialCollection = searchParams.get("collection") || "all";
  const initialSearch = searchParams.get("search") || "";
  
  const [activeCategory, setActiveCategory] = useState(
    initialCategory 
      ? ALL_CATEGORIES.find(c => c.toLowerCase().replace(/ & /g, "").replace(/ /g, "") === initialCategory) || "All"
      : "All"
  );

  const [activeBrand, setActiveBrand] = useState(initialBrand || null);
  const [activeCollection, setActiveCollection] = useState<string>(initialCollection);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    CATEGORY_STRUCTURE.find(c => c.name === activeCategory || c.subcategories?.includes(activeCategory))?.name || null
  );
  
  const [shopSearchQuery, setShopSearchQuery] = useState(initialSearch);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  React.useEffect(() => {
    if (initialCategory) {
      const matched = ALL_CATEGORIES.find(c => c.toLowerCase().replace(/ & /g, "").replace(/ /g, "") === initialCategory);
      setActiveCategory(matched || "All");
      setExpandedCategory(CATEGORY_STRUCTURE.find(c => c.name === matched || c.subcategories?.includes(matched))?.name || null);
    } else {
      setActiveCategory("All");
    }
    
    setActiveBrand(initialBrand || null);
    setActiveCollection(initialCollection);
    setShopSearchQuery(initialSearch);
  }, [initialCategory, initialBrand, initialCollection, initialSearch]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = getQty(product.id);
    const userType = localStorage.getItem("userType") || "retail";
    
    if (userType === "wholesale") {
      alert("Wholesale Partners should use the Wholesale portal for bulk orders. Redirecting to Cart...");
    }

    const optionsList = product.options || product.colors;
    const hasOptions = optionsList && optionsList.length > 0;
    const selectedOption = selectedOptions[product.id];

    if (hasOptions && !selectedOption) {
      alert("please choose the option for the item");
      return;
    }

    try {
      const currentRetailCart = JSON.parse(localStorage.getItem('retailCart') || '[]');
      const existingItem = currentRetailCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        currentRetailCart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity: qty,
          image: product.imageSrc,
          optionName: product.optionName || "Color / Option",
          optionValue: selectedOption || undefined
        });
      }
      localStorage.setItem('retailCart', JSON.stringify(currentRetailCart));
      
      window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: `Added ${qty}x ${product.name} to Cart!` } }));

      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
      setSelectedOptions(prev => { const next = {...prev}; delete next[product.id]; return next; });
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Retail cart update failed:", err);
      alert("Failed to update cart. Please check your browser storage settings.");
    }
  };

  const filteredProducts = allShopProducts.filter(p => {
    let matchesCategory = false;
    
    if (activeCategory === "All") {
      matchesCategory = true;
    } else {
      const parentCat = CATEGORY_STRUCTURE.find(c => c.name === activeCategory);
      if (parentCat && parentCat.subcategories) {
        matchesCategory = p.category === activeCategory || parentCat.subcategories.includes(p.category);
      } else {
        matchesCategory = p.category === activeCategory;
      }
    }

    const matchesSearch = p.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(shopSearchQuery.toLowerCase());
    
    const matchesBrand = !activeBrand || p.brand.toLowerCase() === activeBrand.toLowerCase();
    
    let matchesCollection = true;
    if (activeCollection === "new-arrivals") {
      const newArrivalIds = allShopProducts.slice(0, 8).map(prod => prod.id);
      matchesCollection = newArrivalIds.includes(p.id);
    } else if (activeCollection === "best-sellers") {
      matchesCollection = !!p.isBestseller;
    }
    
    return matchesCategory && matchesSearch && matchesBrand && matchesCollection;
  });

  return (
    <div className="bg-white">
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-serif">
              {d("Shop All Products")}
            </h1>
            <p className="mt-2 text-primary-600">
              {d("Shop Subtitle")}
            </p>
          </div>
        </div>

        {/* Mobile Filter Options Tab Bar (Mobile only) */}
        <div className="block lg:hidden w-full border-b border-gray-200 pb-4 mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setMobileFilterTab(mobileFilterTab === "category" ? "none" : "category")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider border text-center transition-all focus:outline-none flex items-center justify-center gap-2 ${
                mobileFilterTab === "category"
                  ? "bg-primary-50/50 text-primary-900 border-primary-600 font-extrabold ring-1 ring-primary-600 shadow-sm"
                  : mobileFilterTab === "brand"
                    ? "bg-white text-gray-400 border-gray-200 font-medium"
                    : "bg-white text-gray-700 border-gray-200 font-bold hover:bg-gray-50"
              }`}
            >
              <span>Category</span>
              <span className="text-[9px] lowercase opacity-80 font-normal truncate max-w-[80px]">
                {activeCategory !== "All" ? `(${translateCategory(activeCategory)})` : ""}
              </span>
            </button>
            <button
              onClick={() => setMobileFilterTab(mobileFilterTab === "brand" ? "none" : "brand")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider border text-center transition-all focus:outline-none flex items-center justify-center gap-2 ${
                mobileFilterTab === "brand"
                  ? "bg-primary-50/50 text-primary-900 border-primary-600 font-extrabold ring-1 ring-primary-600 shadow-sm"
                  : mobileFilterTab === "category"
                    ? "bg-white text-gray-400 border-gray-200 font-medium"
                    : "bg-white text-gray-700 border-gray-200 font-bold hover:bg-gray-50"
              }`}
            >
              <span>Brand</span>
              <span className="text-[9px] lowercase opacity-80 font-normal truncate max-w-[80px]">
                {activeBrand ? `(${activeBrand})` : ""}
              </span>
            </button>
          </div>

          {/* Category horizontal scroll container */}
          {mobileFilterTab === "category" && (
            <div className="mt-4 animate-slide-down">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Category</span>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setExpandedCategory(null);
                      searchParams.delete("category");
                      setSearchParams(searchParams);
                    }}
                    className="text-[10px] font-bold text-primary-700 hover:text-primary-900"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              
              <div 
                className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth touch-pan-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {CATEGORY_STRUCTURE.map((cat) => {
                  const isCatActive = activeCategory === cat.name;
                  const isSubcatActive = cat.subcategories?.includes(activeCategory);
                  const isSelected = isCatActive || isSubcatActive;
                  
                  return (
                    <div key={cat.name} className="flex flex-col items-center shrink-0">
                      <button
                        onClick={() => {
                          setActiveCategory(cat.name);
                          if (cat.name === "All") {
                            searchParams.delete("category");
                          } else {
                            searchParams.set("category", cat.name.toLowerCase().replace(/ & /g, "").replace(/ /g, ""));
                          }
                          setSearchParams(searchParams);
                        }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-sm ${
                          isSelected
                            ? "bg-primary-100 border-primary-350 text-primary-900 scale-105"
                            : "bg-white border-gray-150 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-11 h-11 flex items-center justify-center">
                          {getCategoryIcon(cat.name)}
                        </div>
                      </button>
                      <span className={`mt-1 text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-primary-800" : "text-gray-500"}`}>
                        {translateCategory(cat.name)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Subcategories horizontal drawer if parent has them */}
              {(() => {
                const activeParentName = CATEGORY_STRUCTURE.find(c => c.name === expandedCategory || c.name === activeCategory)?.name;
                const activeParent = CATEGORY_STRUCTURE.find(c => c.name === activeParentName);
                if (activeParent && activeParent.subcategories) {
                  return (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {activeParent.subcategories.map((sub) => {
                        const isSubActive = activeCategory === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => {
                              setActiveCategory(sub);
                              searchParams.set("category", sub.toLowerCase().replace(/ & /g, "").replace(/ /g, ""));
                              setSearchParams(searchParams);
                            }}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                              isSubActive
                                ? "bg-primary-800 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {translateCategory(sub)}
                          </button>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Brand horizontal scroll container */}
          {mobileFilterTab === "brand" && (
            <div className="mt-4 animate-slide-down">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Brand</span>
                {activeBrand && (
                  <button
                    onClick={() => {
                      setActiveBrand(null);
                      searchParams.delete("brand");
                      setSearchParams(searchParams);
                    }}
                    className="text-[10px] font-bold text-primary-700 hover:text-primary-900"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div 
                className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth touch-pan-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {b2bBrands.map((brand) => {
                  const isBrandActive = activeBrand?.toLowerCase() === brand.name.toLowerCase();
                  return (
                    <button
                      key={brand.name}
                      onClick={() => {
                        if (isBrandActive) {
                          setActiveBrand(null);
                          searchParams.delete("brand");
                        } else {
                          setActiveBrand(brand.name);
                          searchParams.set("brand", brand.name.toLowerCase());
                        }
                        setSearchParams(searchParams);
                      }}
                      className="flex flex-col items-center shrink-0 focus:outline-none"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-white border flex items-center justify-center overflow-hidden shadow-sm transition-all ${
                        isBrandActive
                          ? "border-primary-600 ring-2 ring-primary-100 scale-105"
                          : "border-gray-150 hover:border-gray-300"
                      }`}>
                        {brand.image ? (
                          <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-serif font-bold text-primary-900/40 uppercase tracking-wider">
                            {brand.name.substring(0, 2)}
                          </span>
                        )}
                      </div>
                      <span className={`mt-1 text-[9px] font-bold uppercase tracking-wider max-w-[64px] truncate text-center ${
                        isBrandActive ? "text-primary-850" : "text-gray-500"
                      }`}>
                        {brand.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-bold font-serif border-b border-gray-100 pb-3">
                <Filter className="w-5 h-5" /> {d("Filters")}
              </h3>
              
              {/* Collection Quick Filters */}
              <div className="py-2">
                <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">{d("Collection")}</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveCollection("all");
                      searchParams.delete("collection");
                      setSearchParams(searchParams);
                    }}
                    className={`flex items-center justify-between w-full text-left text-sm py-2 px-3 rounded-xl transition-all ${
                      activeCollection === "all"
                        ? "bg-primary-50 font-bold text-primary-800"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{d("All Products")}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full font-semibold">
                      {allShopProducts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveCollection("new-arrivals");
                      searchParams.set("collection", "new-arrivals");
                      setSearchParams(searchParams);
                    }}
                    className={`flex items-center justify-between w-full text-left text-sm py-2 px-3 rounded-xl transition-all ${
                      activeCollection === "new-arrivals"
                        ? "bg-primary-50 font-bold text-primary-800"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{d("New Arrivals")}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full font-semibold">
                      8
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveCollection("best-sellers");
                      searchParams.set("collection", "best-sellers");
                      setSearchParams(searchParams);
                    }}
                    className={`flex items-center justify-between w-full text-left text-sm py-2 px-3 rounded-xl transition-all ${
                      activeCollection === "best-sellers"
                        ? "bg-primary-50 font-bold text-primary-800"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{d("Best Sellers")}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full font-semibold">
                      {allShopProducts.filter(p => p.isBestseller).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Categories Filter */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">{d("Category")}</h4>
                <div className="space-y-2">
                  {CATEGORY_STRUCTURE.map((category) => {
                    const isExpanded = expandedCategory === category.name;
                    const isActive = activeCategory === category.name;
                    const hasSubcategories = !!category.subcategories;

                    return (
                      <div key={category.name} className="flex flex-col">
                        <button
                          onClick={() => {
                            if (hasSubcategories) {
                              setExpandedCategory(isExpanded ? null : category.name);
                            } else {
                              setExpandedCategory(null);
                            }
                            setActiveCategory(category.name);
                            if (category.name === "All") {
                              searchParams.delete("category");
                            } else {
                              searchParams.set("category", category.name.toLowerCase().replace(/ & /g, "").replace(/ /g, ""));
                            }
                            setSearchParams(searchParams);
                          }}
                          className={`text-base flex items-center justify-between w-full text-left py-1.5 px-2 rounded-xl transition-all ${
                            isActive
                              ? "bg-primary-50 font-bold text-primary-800"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {category.name !== "All" && (
                              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg border border-gray-150">
                                {getCategoryIcon(category.name)}
                              </div>
                            )}
                            <span>{translateCategory(category.name)}</span>
                          </div>
                          {hasSubcategories && (
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          )}
                        </button>
                        
                        {hasSubcategories && isExpanded && (
                          <div className="pl-4 mt-2 space-y-1.5 border-l-2 border-primary-100 ml-3">
                            {category.subcategories?.map(sub => {
                              const isSubActive = activeCategory === sub;
                              return (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    setActiveCategory(sub);
                                    searchParams.set("category", sub.toLowerCase().replace(/ & /g, "").replace(/ /g, ""));
                                    setSearchParams(searchParams);
                                  }}
                                  className={`block text-sm text-left w-full py-1 px-2 rounded-lg transition-all ${
                                    isSubActive ? "bg-primary-50 font-bold text-primary-750" : "text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {translateCategory(sub)}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">{d("Brand")}</h4>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                  {b2bBrands.map((brand) => {
                    const isActive = activeBrand?.toLowerCase() === brand.name.toLowerCase();
                    return (
                      <button
                        key={brand.name}
                        onClick={() => {
                          if (isActive) {
                            setActiveBrand(null);
                            searchParams.delete("brand");
                          } else {
                            setActiveBrand(brand.name);
                            searchParams.set("brand", brand.name.toLowerCase());
                          }
                          setSearchParams(searchParams);
                        }}
                        className={`flex items-center justify-between w-full text-left text-xs py-1.5 px-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary-50 font-bold text-primary-800"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span>{brand.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 mb-8 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">{filteredProducts.length}</span> {d("Products")}
                {activeBrand && (
                  <button 
                    onClick={() => {
                      setActiveBrand(null);
                      searchParams.delete("brand");
                      setSearchParams(searchParams);
                    }}
                    className="ml-2 flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-primary-100 transition-colors"
                  >
                    {d("Brand")}: {activeBrand} <span className="ml-1 text-[10px] opacity-70">✕</span>
                  </button>
                )}
              </div>
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder={d("Search placeholder")}
                  value={shopSearchQuery}
                  onChange={(e) => setShopSearchQuery(e.target.value)}
                  className="block w-full rounded-full border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((p) => {
                const product = getLocalizedProduct(p);
                return (
                  <Card key={product.id} className="group flex flex-col hover:shadow-lg transition-shadow duration-300 rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-white relative p-2 sm:p-4 flex items-center justify-center">
                      <img
                        src={product.imageSrc}
                        alt={product.name}
                        className="w-full h-full object-center admin-custom-image"
                        style={{
                          objectFit: product.imageFit || 'contain',
                          '--scale-val': product.imageScale === 'small' ? 0.7 :
                                         product.imageScale === 'medium' ? 0.8 :
                                         product.imageScale === 'large' ? 0.9 : 1
                        } as React.CSSProperties}
                        loading="lazy"
                      />
                      {product.isBestseller && (
                        <Badge variant="accent" className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 shadow-sm z-10 text-[7px] sm:text-[9px] px-1.5 py-0.5 rounded-full scale-90 sm:scale-100">
                          {d("Bestseller")}
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="flex flex-col flex-grow p-2 sm:p-4 pt-1.5 sm:pt-4 relative">
                    
                    <div className="absolute inset-x-0 bottom-full p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 duration-300 bg-white/90 backdrop-blur-sm shadow-md pointer-events-auto z-20 hidden sm:flex">
                      <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm font-semibold">
                        <button type="button" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-1/3 text-center rounded-l-md" onClick={(e) => { e.preventDefault(); updateQty(product.id, -1); }}>-</button>
                        <span className="px-2 py-1.5 text-sm font-bold text-gray-900 w-1/3 text-center border-x border-gray-300">{getQty(product.id)}</span>
                        <button type="button" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-1/3 text-center rounded-r-md" onClick={(e) => { e.preventDefault(); updateQty(product.id, 1); }}>+</button>
                      </div>
                      <Button className="w-full gap-2 shadow-md" onClick={(e) => handleAddToCart(e, product)}>
                        <ShoppingBag className="w-4 h-4" /> 
                        {d("Add to Cart")}
                      </Button>
                    </div>
                  
                    <Link to={`/product/${product.id}`} className="hover:text-primary-800 transition-colors group-hover:underline">
                      <h3 className="text-[10px] sm:text-base font-bold text-gray-900 mb-1 leading-tight sm:leading-snug line-clamp-2 sm:line-clamp-3">
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveBrand(product.brand);
                            searchParams.set("brand", product.brand.toLowerCase());
                            setSearchParams(searchParams);
                          }}
                          className="text-gray-400 font-medium hover:text-primary-600 transition-colors mr-1 cursor-pointer text-[9px] sm:text-sm"
                        >
                          {product.brand}
                        </span>
                        {product.name}
                      </h3>
                    </Link>
                    
                    <Link 
                      to={`/product/${product.id}#reviews`}
                      className="flex items-center gap-1.5 mt-1 mb-3 text-xs text-gray-500 hover:text-primary-700 transition-colors hidden sm:flex"
                    >
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-gray-700">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                      <span>({Math.floor((product.name.length * 17) % 200) + 45})</span>
                      <span className="ml-auto text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                        {(Math.floor((product.name.length * 43) % 800) + 150).toLocaleString()}+ {d("sold")}
                      </span>
                    </Link>
                    
                    {((product.options && product.options.length > 0) || (product.colors && product.colors.length > 0)) && (
                      <div className="mb-4 hidden sm:block">
                        <label htmlFor={`option-${product.id}`} className="sr-only">Choose an option</label>
                        <select
                          id={`option-${product.id}`}
                          className="mt-1 block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:border-primary-500 focus:outline-none focus:ring-primary-500 bg-gray-50 bg-white shadow-sm transition-colors border max-w-full truncate"
                          defaultValue=""
                          onChange={(e) => {
                             setSelectedOptions(prev => ({...prev, [product.id]: e.target.value}));
                          }}
                        >
                          <option value="" disabled>{d("Select option")}</option>
                          {(product.options || product.colors).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}
 
                    <div className="mt-auto flex flex-col mb-1 sm:mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-base font-bold text-gray-900 leading-none">{formatProductPrice(product)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <h3 className="text-lg font-medium text-gray-900">{d("No products found")}</h3>
                <p className="mt-1 text-gray-500">{d("Try different category")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
