import React, { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getLiveBrandsForCustomers } from "../utils/inventory";
import { fweeProducts } from "../data/fweeProducts";
import { torridenProducts } from "../data/torridenProducts";
import { ddalmomdeProducts } from "../data/ddalmomdeProducts";
import { fourPmProducts } from "../data/4pmProducts";
import { medicubeProducts } from "../data/medicubeProducts";
import { beautyOfJoseonProducts } from "../data/beautyOfJoseonProducts";
import { manyoProducts } from "../data/manyoProducts";
import { numbuzinProducts } from "../data/numbuzinProducts";
import { aesturaProducts } from "../data/aesturaProducts";
import { kerasysProducts } from "../data/kerasysProducts";
import { atsProducts } from "../data/atsProducts";
import { getLiveInventoryForCustomers } from "../utils/inventory";
import { meditherapyProducts } from "../data/meditherapyProducts";
import { Card, CardContent } from "../components/ui/Card";
import { useCountry } from "../contexts/CountryContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ShoppingBag, ArrowLeft, Search, Star } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLanguage } from "../contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  category: string;
  wholesalePrice: number;
  moq: number;
  imageSrc: string;
  isBestseller: boolean;
  colors?: string[];
  options?: string[];
  optionName?: string;
}

const TRANSLATED_BRAND_DETAIL: Record<string, Record<string, string>> = {
  EN: {
    backToBrands: "Back to Brands",
    brandNotFound: "Brand not found",
    wholesaleItems: "Wholesale Items",
    productsAvailable: "Products Available",
    searchPlaceholder: "Search products...",
    bestseller: "Bestseller",
    addToQuote: "Add to Quote",
    selectOption: "Select option...",
    sold: "sold",
    moq: "MOQ",
    units: "units",
    authError: "Only approved Wholesale Partners can request wholesale orders. Please log in with your wholesale account.",
    selectOptionWarning: "Please select an option for {name}",
    toastAdded: "Added {qty} boxes of {name} to Wholesale Quote!"
  },
  KO: {
    backToBrands: "브랜드 목록으로 돌아가기",
    brandNotFound: "브랜드를 찾을 수 없습니다",
    wholesaleItems: "도매 제품 리스트",
    productsAvailable: "개의 제품 이용 가능",
    searchPlaceholder: "제품 검색...",
    bestseller: "베스트셀러",
    addToQuote: "견적에 추가",
    selectOption: "옵션 선택...",
    sold: "개 판매됨",
    moq: "최소주문",
    units: "개",
    authError: "승인된 도매 파트너만 도매 주문을 신청할 수 있습니다. 도매 계정으로 로그인해 주세요.",
    selectOptionWarning: "제품 {name}의 옵션을 선택해 주세요.",
    toastAdded: "{name} {qty}박스를 도매 견적에 추가했습니다!"
  },
  PT: {
    backToBrands: "Voltar para Marcas",
    brandNotFound: "Marca não encontrada",
    wholesaleItems: "Itens de Atacado",
    productsAvailable: "Produtos Disponíveis",
    searchPlaceholder: "Buscar produtos...",
    bestseller: "Mais Vendidos",
    addToQuote: "Adicionar à Cotação",
    selectOption: "Selecionar opção...",
    sold: "vendidos",
    moq: "MOQ",
    units: "unidades",
    authError: "Apenas parceiros de atacado aprovados podem solicitar pedidos de atacado. Faça login com sua conta de atacado.",
    selectOptionWarning: "Selecione uma opção para {name}",
    toastAdded: "Adicionado {qty} caixas de {name} à Cotação de Atacado!"
  },
  ES: {
    backToBrands: "Volver a Marcas",
    brandNotFound: "Marca no encontrada",
    wholesaleItems: "Artículos de Mayoreo",
    productsAvailable: "Productos Disponibles",
    searchPlaceholder: "Buscar productos...",
    bestseller: "Más Vendido",
    addToQuote: "Añadir a Cotización",
    selectOption: "Seleccionar opción...",
    sold: "vendidos",
    moq: "MOQ",
    units: "unidades",
    authError: "Solo los socios de mayoreo aprobados pueden solicitar pedidos al por mayor. Inicie sesión con su cuenta de mayoreo.",
    selectOptionWarning: "Seleccione una opción para {name}",
    toastAdded: "¡Añadido {qty} cajas de {name} a la Cotización de Mayoreo!"
  },
  ZH: {
    backToBrands: "返回品牌列表",
    brandNotFound: "未找到该品牌",
    wholesaleItems: "批发产品",
    productsAvailable: "件可选产品",
    searchPlaceholder: "搜索产品...",
    bestseller: "畅销爆款",
    addToQuote: "加入报价",
    selectOption: "选择选项...",
    sold: "已售",
    moq: "起订量",
    units: "件",
    authError: "只有经批准的批发合作伙伴才能申请批发订单。请使用您的批发账户登录。",
    selectOptionWarning: "请为 {name} 选择一个选项",
    toastAdded: "已将 {qty} 箱 {name} 加入批发报价！"
  },
  JA: {
    backToBrands: "ブランド一覧に戻る",
    brandNotFound: "ブランドが見つかりません",
    wholesaleItems: "卸売製品一覧",
    productsAvailable: "個の製品が利用可能",
    searchPlaceholder: "製品を検索...",
    bestseller: "ベストセラー",
    addToQuote: "見積に追加",
    selectOption: "オプションを選択...",
    sold: "個販売",
    moq: "最小注文数",
    units: "個",
    authError: "承認された卸売パートナーのみが卸売注文を申請できます。卸売アカウントでログインしてください。",
    selectOptionWarning: "製品 {name} のオプションを選択してください。",
    toastAdded: "{name}を{qty}箱、卸売見積もりに追加しました！"
  }
};

export function WholesaleBrandDetail() {
  const b2bBrands = getLiveBrandsForCustomers();
  const { formatPrice } = useCurrency();
  const { brandId } = useParams();
  const [searchParams] = useSearchParams();
  const [brandSearchQuery, setBrandSearchQuery] = useState(searchParams.get("search") || "");
  const { language } = useLanguage();
  const { getLocalizedProduct, formatProductPrice } = useCountry();
  
  const d = (key: string) => {
    return TRANSLATED_BRAND_DETAIL[language]?.[key] || TRANSLATED_BRAND_DETAIL["EN"]?.[key] || key;
  };

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const getQty = (id: string) => quantities[id] || 1;
  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };
  
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    const qty = getQty(product.id);
    const userType = localStorage.getItem("userType") || "retail";
    
    if (userType !== "wholesale") {
      alert(d("authError"));
      return;
    }

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
      console.error("Wholesale cart update failed:", err);
      alert("Failed to update cart. Please check your browser storage settings.");
    }
  };
  
  const brandName = brandId ? decodeURIComponent(brandId) : "";
  const brand = b2bBrands.find(b => b.name === brandName);

  if (!brand) {
    return (
      <div className="py-32 text-center text-gray-900">
        <h2 className="text-2xl font-bold font-serif">{d("brandNotFound")}</h2>
        <Link to="/wholesale/brands" className="text-primary-600 hover:text-primary-800 mt-4 inline-block">
          &larr; {d("backToBrands")}
        </Link>
      </div>
    );
  }

  const products = getLiveInventoryForCustomers().filter(p => p.brand === brand.name);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 w-auto bg-primary-950 flex items-center justify-center mt-8 sm:mt-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden">
        {/* Ambient decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-36 h-36 sm:w-96 sm:h-96 rounded-full bg-accent/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-80 sm:h-80 rounded-full bg-primary-500/10 blur-[100px]"></div>

        {brand.image && (
          <img 
            src={brand.image} 
            alt={brand.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-15 blur-sm select-none pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 w-full max-w-[1800px] mx-auto flex flex-col items-center">
          <Link to="/wholesale/brands" className="absolute top-0 sm:-top-8 left-4 sm:left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> {d("backToBrands")}
          </Link>
          
          {/* Dedicated brand logo card */}
          {brand.image && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-4 mt-6 sm:mt-0 select-none pointer-events-none overflow-hidden">
              <img 
                src={brand.image} 
                alt={`${brand.name} logo`} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-widest uppercase mb-3 drop-shadow-lg">
            {brand.name}
          </h1>
          <p className="text-white/95 text-xs sm:text-lg max-w-2xl mx-auto drop-shadow-md line-clamp-2">
            {brand.description}
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900">{d("wholesaleItems")}</h2>
            <span className="text-sm text-gray-500 font-medium">{filteredProducts.length} {d("productsAvailable")}</span>
          </div>

          {/* Search Input for items in brand */}
          <div className="w-full sm:w-auto relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full sm:w-64 rounded-full border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder={d("searchPlaceholder")}
              value={brandSearchQuery}
              onChange={(e) => setBrandSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-6">
          {filteredProducts.map((p) => {
            const product = getLocalizedProduct(p);
            return (
              <Card key={product.id} className="group flex flex-col hover:shadow-lg transition-shadow duration-300">
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-white relative p-4 flex items-center justify-center">
                   <img
                     src={product.imageSrc}
                     alt={product.name}
                     className="w-full h-full object-center admin-custom-image"
                     style={{
                       objectFit: product.imageFit || 'contain',
                       '--scale-val': product.imageScale === 'small' ? 0.7 :
                                      product.imageScale === 'medium' ? 0.8 :
                                      product.imageScale === 'large' ? 0.9 : 
                                      product.imageScale === 'xlarge' ? 1.1 :
                                      product.imageScale === 'xxlarge' ? 1.2 : 1
                     } as React.CSSProperties}
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
                    <ShoppingBag className="w-4 h-4" /> {d("addToQuote")}
                  </Button>
                </div>
              
                <Link to={`/product/${product.id}`} className="hover:text-primary-800 transition-colors group-hover:underline">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug line-clamp-3">
                    <span 
                      className="text-gray-400 font-medium mr-1"
                    >
                      {brand.name}
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
                
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-base font-bold text-primary-800">{formatProductPrice(product, true)}</p>
                    <p className="text-xs text-accent font-semibold mt-1">{d("moq")}: {product.moq} {d("units")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
