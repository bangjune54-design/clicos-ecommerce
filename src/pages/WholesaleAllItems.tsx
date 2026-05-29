import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ShoppingBag, Search, Star } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";
import { getLiveInventory, getLiveBrands } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";

// Categories structure
const CATEGORY_STRUCTURE = [
  { name: "All" },
  {
    name: "Skincare",
    subcategories: ["Sun Care", "Cleansing", "Serum & Ampoule", "Cream", "Toner", "Mask"]
  },
  { name: "Makeup" },
  { name: "Hair Care" },
  { name: "Body Care" }
];

// Flattened list for URL matching if needed
const ALL_CATEGORIES = CATEGORY_STRUCTURE.flatMap(c => [c.name, ...(c.subcategories || [])]);

const TRANSLATED_WHOLESALE_ITEMS: Record<string, Record<string, string>> = {
  EN: {
    title: "All B2B Items",
    subtitle: "Discover authentic Korean beauty exclusively for B2B distributors.",
    filters: "Filters",
    category: "Category",
    productsCount: "Products",
    searchPlaceholder: "Search products & brands...",
    brandLabel: "Brand",
    b2bPrice: "B2B",
    saveLabel: "Save",
    moqLabel: "MOQ",
    addToQuote: "Add to Quote",
    toastAdded: "Added {qty} boxes of {name} to Wholesale Quote!",
    noProducts: "No products found",
    noProductsDesc: "Try selecting a different category.",
    bestseller: "Bestseller",
    selectOption: "Select option...",
    sold: "sold",
    All: "All",
    selectOptionWarning: "Please select an option for {name}"
  },
  KO: {
    title: "모든 B2B 상품",
    subtitle: "B2B 유통업체를 위한 정품 한국 화장품을 만나보세요.",
    filters: "필터",
    category: "카테고리",
    productsCount: "개 제품",
    searchPlaceholder: "제품 및 브랜드 검색...",
    brandLabel: "브랜드",
    b2bPrice: "도매가",
    saveLabel: "할인",
    moqLabel: "최소주문",
    addToQuote: "견적에 추가",
    toastAdded: "{name} {qty}박스를 도매 견적에 추가했습니다!",
    noProducts: "검색 결과가 없습니다",
    noProductsDesc: "다른 카테고리를 선택해 보세요.",
    bestseller: "베스트셀ラー",
    selectOption: "옵션 선택...",
    sold: "개 판매됨",
    All: "전체",
    selectOptionWarning: "제품 {name}의 옵션을 선택해 주세요."
  },
  PT: {
    title: "Todos os Itens B2B",
    subtitle: "Descubra a autêntica beleza coreana exclusivamente para distribuidores B2B.",
    filters: "Filtros",
    category: "Categoria",
    productsCount: "Produtos",
    searchPlaceholder: "Buscar produtos e marcas...",
    brandLabel: "Marca",
    b2bPrice: "B2B",
    saveLabel: "Economize",
    moqLabel: "MOQ",
    addToQuote: "Adicionar à Cotação",
    toastAdded: "Adicionado {qty} caixas de {name} à Cotação de Atacado!",
    noProducts: "Nenhum produto encontrado",
    noProductsDesc: "Tente selecionar uma categoria diferente.",
    bestseller: "Mais Vendidos",
    selectOption: "Selecionar opção...",
    sold: "vendidos",
    All: "Todos",
    selectOptionWarning: "Selecione uma opção para {name}"
  },
  ES: {
    title: "Todos los Artículos B2B",
    subtitle: "Descubra la auténtica belleza coreana exclusivamente para distribuidores B2B.",
    filters: "Filtros",
    category: "Categoría",
    productsCount: "Productos",
    searchPlaceholder: "Buscar productos y marcas...",
    brandLabel: "Marca",
    b2bPrice: "B2B",
    saveLabel: "Ahorra",
    moqLabel: "MOQ",
    addToQuote: "Añadir a Cotización",
    toastAdded: "¡Añadido {qty} cajas de {name} a la Cotización de Mayoreo!",
    noProducts: "No se encontraron productos",
    noProductsDesc: "Intente seleccionar una categoría diferente.",
    bestseller: "Más Vendido",
    selectOption: "Seleccionar opción...",
    sold: "vendidos",
    All: "Todos",
    selectOptionWarning: "Seleccione una opción para {name}"
  },
  ZH: {
    title: "所有 B2B 商品",
    subtitle: "探索专为 B2B 分销商提供的正宗韩国美妆产品。",
    filters: "筛选器",
    category: "品类",
    productsCount: "件商品",
    searchPlaceholder: "搜索产品和品牌...",
    brandLabel: "品牌",
    b2bPrice: "批发价",
    saveLabel: "节省",
    moqLabel: "起订量",
    addToQuote: "加入报价",
    toastAdded: "已将 {qty} 箱 {name} 加入批发报价！",
    noProducts: "未找到相关产品",
    noProductsDesc: "请尝试选择其他类别。",
    bestseller: "畅销爆款",
    selectOption: "选择选项...",
    sold: "已售",
    All: "全部",
    selectOptionWarning: "请为 {name} 选择一个选项"
  },
  JA: {
    title: "すべてのB2B商品",
    subtitle: "B2Bディストリビューター専用の信頼の本物韓国コスメをご覧ください。",
    filters: "フィルター",
    category: "カテゴリー",
    productsCount: "個の商品",
    searchPlaceholder: "製品やブランドを検索...",
    brandLabel: "ブランド",
    b2bPrice: "B2B卸売",
    saveLabel: "割引",
    moqLabel: "最小注文数",
    addToQuote: "見積に追加",
    toastAdded: "{name}を{qty}箱、卸売見積もりに追加しました！",
    noProducts: "該当する商品は見つかりませんでした",
    noProductsDesc: "別のカテゴリーを選択してください。",
    bestseller: "ベストセラー",
    selectOption: "オプションを選択...",
    sold: "個販売",
    All: "すべて",
    selectOptionWarning: "製品 {name} のオプションを選択してください。"
  }
};

export function WholesaleAllItems() {
  const b2bBrandNames = new Set(getLiveBrands().map(b => b.name));
  const allShopProducts = getLiveInventory().filter(p => b2bBrandNames.has(p.brand));
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const { getLocalizedProduct, formatProductPrice } = useCountry();
  
  const d = (key: string) => {
    return TRANSLATED_WHOLESALE_ITEMS[language]?.[key] || TRANSLATED_WHOLESALE_ITEMS["EN"]?.[key] || key;
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
    
    return t(key) || catName;
  };

  const initialCategory = searchParams.get("category");
  const initialBrand = searchParams.get("brand");
  
  const [activeCategory, setActiveCategory] = useState(
    initialCategory 
      ? ALL_CATEGORIES.find(c => c.toLowerCase().replace(/ & /g, "").replace(/ /g, "") === initialCategory) || "All"
      : "All"
  );

  const [activeBrand, setActiveBrand] = useState(initialBrand || null);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    CATEGORY_STRUCTURE.find(c => c.name === activeCategory || c.subcategories?.includes(activeCategory))?.name || null
  );
  
  const [shopSearchQuery, setShopSearchQuery] = useState("");
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = getQty(product.id);
    
    const optionsList = product.options || product.colors;
    const hasOptions = optionsList && optionsList.length > 0;
    const selectedOption = selectedOptions[product.id];

    if (hasOptions && !selectedOption) {
      alert("please choose the option for the item");
      return;
    }

    try {
      const currentB2BCart = JSON.parse(localStorage.getItem('b2bCart') || '[]');
      const existingItem = currentB2BCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
      if (existingItem) {
        existingItem.boxQty += qty;
      } else {
        currentB2BCart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.wholesalePrice,
          inboxQty: product.moq,
          boxQty: qty,
          image: product.imageSrc,
          optionName: product.optionName || "Color / Option",
          optionValue: selectedOption || undefined
        });
      }
      localStorage.setItem('b2bCart', JSON.stringify(currentB2BCart));
      
      const addedMsg = d("toastAdded")
        .replace("{qty}", String(qty))
        .replace("{name}", product.name);

      window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: addedMsg } }));

      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
      setSelectedOptions(prev => { const next = {...prev}; delete next[product.id]; return next; });
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("B2B cart update failed:", err);
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
    
    return matchesCategory && matchesSearch && matchesBrand;
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-serif">
              {d("title")}
            </h1>
            <p className="mt-2 text-primary-600">
              {d("subtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h3 className="flex items-center gap-2 text-lg font-bold font-serif mb-4">
                <Filter className="w-5 h-5" /> {d("filters")}
              </h3>
              
              <div className="border-t border-gray-200 py-6">
                <h4 className="font-semibold text-gray-900 mb-4">{d("category")}</h4>
                <div className="space-y-3">
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
                          className={`text-sm flex items-center justify-between w-full text-left py-1 ${
                            isActive
                              ? "font-bold text-primary-800"
                              : "text-gray-600 hover:text-primary-800"
                          } transition-colors`}
                        >
                          {translateCategory(category.name)}
                          {hasSubcategories && (
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          )}
                        </button>
                        
                        {/* Subcategories Dropdown */}
                        {hasSubcategories && isExpanded && (
                          <div className="pl-4 mt-2 space-y-2 border-l-2 border-primary-100 ml-1">
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
                                  className={`block text-sm text-left w-full py-1 ${
                                    isSubActive ? "font-bold text-primary-700" : "text-gray-500 hover:text-primary-700"
                                  } transition-colors`}
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

            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-100 mb-8 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">{filteredProducts.length}</span> {d("productsCount")}
                {activeBrand && (
                  <button 
                    onClick={() => {
                      setActiveBrand(null);
                      searchParams.delete("brand");
                      setSearchParams(searchParams);
                    }}
                    className="ml-2 flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-primary-100 transition-colors"
                  >
                    {d("brandLabel")}: {activeBrand} <span className="ml-1 text-[10px] opacity-70">✕</span>
                  </button>
                )}
              </div>
              
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder={d("searchPlaceholder")}
                  value={shopSearchQuery}
                  onChange={(e) => setShopSearchQuery(e.target.value)}
                  className="block w-full rounded-full border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const product = getLocalizedProduct(p);
                return (
                  <Card key={product.id} className="group flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.imageSrc}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 mix-blend-multiply object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isBestseller && (
                        <Badge variant="accent" className="absolute top-3 left-3 shadow-sm z-10">
                          {d("bestseller")}
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="flex flex-col flex-grow pt-4 relative">
                    
                    <div className="absolute inset-x-0 bottom-full p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 duration-300 bg-white/90 backdrop-blur-sm shadow-md pointer-events-auto z-20">
                      <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm font-semibold">
                        <button type="button" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-1/3 text-center rounded-l-md" onClick={(e) => { e.preventDefault(); updateQty(product.id, -1); }}>-</button>
                        <span className="px-2 py-1.5 text-sm font-bold text-gray-900 w-1/3 text-center border-x border-gray-300">{getQty(product.id)}</span>
                        <button type="button" className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors w-1/3 text-center rounded-r-md" onClick={(e) => { e.preventDefault(); updateQty(product.id, 1); }}>+</button>
                      </div>
                      <Button className="w-full gap-2 shadow-md" onClick={(e) => handleAddToCart(e, product)}>
                        <ShoppingBag className="w-4 h-4" /> 
                        {d("addToQuote")}
                      </Button>
                    </div>
                  
                    <Link to={`/product/${product.id}`} className="hover:text-primary-800 transition-colors group-hover:underline">
                      <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveBrand(product.brand);
                            searchParams.set("brand", product.brand.toLowerCase());
                            setSearchParams(searchParams);
                          }}
                          className="text-gray-400 font-medium hover:text-primary-600 transition-colors mr-1 cursor-pointer"
                        >
                          {product.brand}
                        </span>
                        {product.name}
                      </h3>
                    </Link>
                    
                    <Link 
                      to={`/product/${product.id}#reviews`}
                      className="flex items-center gap-1.5 mt-1 mb-3 text-xs text-gray-500 hover:text-primary-700 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-gray-700">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                      <span>({Math.floor((product.name.length * 17) % 200) + 45})</span>
                      <span className="ml-auto text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                        {(Math.floor((product.name.length * 43) % 800) + 150).toLocaleString()}+ {d("sold")}
                      </span>
                    </Link>
                    
                    {((product.options && product.options.length > 0) || (product.colors && product.colors.length > 0)) && (
                      <div className="mb-4">
                        <label htmlFor={`option-${product.id}`} className="sr-only">Choose an option</label>
                        <select
                          id={`option-${product.id}`}
                          className="mt-1 block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:border-primary-500 focus:outline-none focus:ring-primary-500 bg-gray-50 bg-white shadow-sm transition-colors border max-w-full truncate"
                          defaultValue=""
                          onChange={(e) => {
                             setSelectedOptions(prev => ({...prev, [product.id]: e.target.value}));
                          }}
                        >
                          <option value="" disabled>{d("selectOption")}</option>
                          {(product.options || product.colors).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mt-auto flex flex-col mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">{formatProductPrice(product, false)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{d("b2bPrice")}: <span className="text-accent">{formatProductPrice(product, true)}</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 rounded shadow-sm whitespace-nowrap">{d("saveLabel")} {Math.round((1 - product.wholesalePrice / product.price) * 100)}%</span>
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">{d("moqLabel")} {product.moq}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">{d("noProducts")}</h3>
                <p className="mt-1 text-gray-500">{d("noProductsDesc")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
