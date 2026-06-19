import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Star, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCurrency } from "../contexts/CurrencyContext";
import { Badge } from "../components/ui/Badge";
import { getLiveInventoryForCustomers, getLiveBrandsForCustomers } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { ImageCarousel } from "../components/clicos/ImageCarousel";

const TRANSLATED_DETAIL: Record<string, Record<string, string>> = {
  EN: {
    "default_desc_prefix": "Discover the beauty of carefully crafted authentic Korean formulas. This",
    "default_desc_suffix": "essentially targets optimal results, ensuring your absolute satisfaction with every use. Premium ingredients combined with advanced technology deliver visible improvements.",
    "Color / Option": "Color / Option",
    "Select option before adding to cart": "Please select an option before adding to cart.",
    "Bestseller": "Bestseller"
  },
  KO: {
    "default_desc_prefix": "정성스럽게 개발된 정품 한국 화장품 포뮬러의 아름다움을 느껴보세요. 본",
    "default_desc_suffix": "제품은 최적의 케어 효과를 선사하며 사용 시 마다 탁월한 만족감을 드립니다. 프리미엄 성분과 첨단 뷰티 공학 기술이 결합되어 탁월한 개선 효과를 실현합니다.",
    "Color / Option": "색상 / 옵션",
    "Select option before adding to cart": "장바구니에 담기 전에 옵션을 선택해 주세요.",
    "Bestseller": "베스트셀러"
  },
  PT: {
    "default_desc_prefix": "Descubra a beleza das fórmulas coreanas autênticas e cuidadosamente elaboradas. Este",
    "default_desc_suffix": "visa resultados ideais, garantindo a sua absoluta satisfação a cada uso. Ingredientes premium combinados com tecnologia avançada proporcionam melhorias visíveis.",
    "Color / Option": "Cor / Opção",
    "Select option before adding to cart": "Por favor, selecione uma opção antes de adicionar ao carrinho.",
    "Bestseller": "Mais Vendido"
  },
  ES: {
    "default_desc_prefix": "Descubra la belleza de las fórmulas coreanas auténticas cuidadosamente elaboradas. Este",
    "default_desc_suffix": "tiene como objetivo obtener resultados óptimos, garantizando su absoluta satisfacción con cada uso. Los ingredientes de primera calidad combinados con tecnología avanzada ofrecen mejoras visibles.",
    "Color / Option": "Color / Opción",
    "Select option before adding to cart": "Por favor, seleccione una opción antes de añadir al carrito.",
    "Bestseller": "Más Vendido"
  },
  ZH: {
    "default_desc_prefix": "探索精心打造的正宗韩国配方的魅力。该",
    "default_desc_suffix": "产品旨在实现最佳效果，确保您在每次使用时都获得绝对满意的体验。优质成分与先进技术相结合，带来肉眼可见的改善。",
    "Color / Option": "颜色 / 规格",
    "Select option before adding to cart": "请在加入购物车前选择一个规格选项。",
    "Bestseller": "畅销爆款"
  },
  JA: {
    "default_desc_prefix": "丁寧に作り上げられた本物の韓国コスメの美しさをご体験ください。この",
    "default_desc_suffix": "製品は最適な効果をもたらし、使用するたびに最高の満足感をお届けします。厳選されたプレミアム成分と先進技術が、目に見える改善を約束します。",
    "Color / Option": "カラー / オプション",
    "Select option before adding to cart": "カートに入れる前にオプションを選択してください。",
    "Bestseller": "ベストセラー"
  }
};

export function ProductDetail() {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { getLocalizedProduct, formatProductPrice } = useCountry();
  const { id } = useParams<{ id: string }>();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType") || "retail";
  
  const rawProduct = getLiveInventoryForCustomers().find((p) => p.id === id || p.id === `b2b-${p.brand.toLowerCase()}-${id}`);
  const product = getLocalizedProduct(rawProduct);
  
  const [quantity, setQuantity] = React.useState(1);
  const [selectedOption, setSelectedOption] = React.useState("");

  React.useEffect(() => {
    if (hash === "#reviews") {
      setTimeout(() => {
        const element = document.getElementById("reviews");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [hash, product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{t('product_not_found')}</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          {t('product_not_found_desc')}
        </p>
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('go_back')}
        </Button>
      </div>
    );
  }

  const isB2BUser = userType === "wholesale";
  const isWholesaleBrand = getLiveBrandsForCustomers().some(b => b.name === product.brand);
  const isB2B = isB2BUser || isWholesaleBrand;
  const displayPrice = isB2B ? product.wholesalePrice : product.price;

  const d = (key: string) => {
    return TRANSLATED_DETAIL[language]?.[key] || key;
  };

  const translateCategory = (catName: string) => {
    const key = catName.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_");
    if (key === "skincare") return t("skincare");
    if (key === "makeup") return t("makeup");
    if (key === "hair_care" || key === "haircare") return t("hair_care");
    if (key === "body_care" || key === "bodycare") return t("body_care");
    
    // Subcategories
    if (key === "sun_care") return t("cat_sun_care");
    if (key === "cleansing") return t("cat_cleansing");
    if (key === "serum_ampoule" || key === "serum_&_ampoule") return t("cat_serum");
    if (key === "cream") return t("cat_cream");
    if (key === "toner") return t("cat_toner");
    if (key === "facial_mask" || key === "mask") return t("cat_mask");
    
    return t(key) || catName;
  };

  const getTranslatedDescription = (desc: string, catName: string) => {
    if (!desc || desc.startsWith("Discover the beauty of carefully crafted")) {
      const translatedCat = translateCategory(catName);
      return `${d("default_desc_prefix")} ${translatedCat.toLowerCase()} ${d("default_desc_suffix")}`;
    }
    
    const descMap: Record<string, Record<string, string>> = {
      KO: {
        "Premium, functional skincare solutions.": "프리미엄 기능성 스킨케어 솔루션.",
        "Derma-cosmetics representing dermatology-grade barrier repair.": "피부과 전문의 수준의 장벽 회복을 나타내는 더마 코스메틱.",
        "Innovative beauty focused on natural radiance.": "자연스러운 광채에 집중한 혁신적인 뷰티 브랜드.",
        "Professional hair and scalp care brand.": "헤어 및 두피 전문 클리닉 관리 브랜드.",
        "Clinically tested dermocosmetics for sensitive and troubled skin.": "민감성 및 문제성 피부를 위해 임상 테스트를 완료한 더마 코스메틱.",
        "Number-based customized skincare solutions.": "숫자로 맞춤형 솔루션을 제안하는 커스터마이징 스킨케어.",
        "Pure ingredient-oriented skincare brand for a healthy barrier.": "건강한 피부 장벽을 위해 순수 성분을 지향하는 스킨케어 브랜드.",
        "Home-care healing solutions merging devices and cosmetics.": "뷰티 디바이스와 화장품을 결합한 홈케어 힐링 솔루션.",
        "Trendy color cosmetics focused on expressive makeup.": "트렌디하고 감각적인 자기 표현을 위한 메이크업 브랜드.",
        "Clean beauty brand focusing on deep hydration with hyaluronic acid.": "히알루론산으로 깊은 수분 충전에 집중하는 클린 뷰티 브랜드.",
        "Hanbang (traditional Korean herbal medicine) skincare for modern routines.": "현대적인 루틴을 위해 한방(전통 한국 약재)을 담은 스킨케어.",
        "Premium hair clinics and body care with rich, perfumed scents.": "풍부한 향기를 담은 프리미엄 헤어 클리닉 및 바디 케어."
      },
      PT: {
        "Premium, functional skincare solutions.": "Soluções premium e funcionais de cuidados com a pele.",
        "Derma-cosmetics representing dermatology-grade barrier repair.": "Dermocosméticos focados na restauração da barreira cutânea.",
        "Innovative beauty focused on natural radiance.": "Beleza inovadora focada no brilho natural.",
        "Professional hair and scalp care brand.": "Marca profissional de cuidados com o cabelo e couro cabelo.",
        "Clinically tested dermocosmetics for sensitive and troubled skin.": "Dermocosméticos clinicamente testados para pele sensível e com problemas.",
        "Number-based customized skincare solutions.": "Soluções personalizadas baseadas em números.",
        "Pure ingredient-oriented skincare brand for a healthy barrier.": "Ingredientes puros para uma barreira cutânea saudável.",
        "Home-care healing solutions merging devices and cosmetics.": "Soluções de cuidados domésticos unindo aparelhos e cosméticos.",
        "Trendy color cosmetics focused on expressive makeup.": "Cosméticos de cores modernas focados em maquiagem expressiva.",
        "Clean beauty brand focusing on deep hydration with hyaluronic acid.": "Marca clean beauty focada em hidratação profunda.",
        "Hanbang (traditional Korean herbal medicine) skincare for modern routines.": "Skincare com ervas tradicionais coreanas para rotinas modernas.",
        "Premium hair clinics and body care with rich, perfumed scents.": "Clínicas capilares e cuidados corporais com fragrâncias ricas."
      },
      ES: {
        "Premium, functional skincare solutions.": "Soluciones de cuidado de la piel premium y funcionales.",
        "Derma-cosmetics representing dermatology-grade barrier repair.": "Dermocosméticos que representan la reparación de la barrera cutánea.",
        "Innovative beauty focused on natural radiance.": "Belleza innovadora centrada en el brillo natural.",
        "Professional hair and scalp care brand.": "Marca profesional de cuidado del cabello y cuero cabelludo.",
        "Clinically tested dermocosmetics for sensitive and troubled skin.": "Dermocosméticos clínicamente probados para pieles sensibles.",
        "Number-based customized skincare solutions.": "Soluciones personalizadas basadas en números para el cuidado de la piel.",
        "Pure ingredient-oriented skincare brand for a healthy barrier.": "Marca de cuidado de la piel orientada a ingredientes puros.",
        "Home-care healing solutions merging devices and cosmetics.": "Soluciones de curación para el cuidado en el hogar.",
        "Trendy color cosmetics focused on expressive makeup.": "Cosméticos de color de moda centrados en el maquillaje expresivo.",
        "Clean beauty brand focusing on deep hydration with hyaluronic acid.": "Marca de belleza limpia que se centra en la hidratación profunda.",
        "Hanbang (traditional Korean herbal medicine) skincare for modern routines.": "Cuidado de la piel Hanbang para rutinas modernas.",
        "Premium hair clinics and body care with rich, perfumed scents.": "Clínica capilar y cuidado corporal premium con ricas fragancias."
      },
      ZH: {
        "Premium, functional skincare solutions.": "优质、功能性的护肤解决方案。",
        "Derma-cosmetics representing dermatology-grade barrier repair.": "代表皮肤科级屏障修复的皮肤学化妆品。",
        "Innovative beauty focused on natural radiance.": "专注于自然光彩的创新美妆。",
        "Professional hair and scalp care brand.": "专业美发与头皮护理品牌。",
        "Clinically tested dermocosmetics for sensitive and troubled skin.": "针对敏感和问题肌肤的临床测试护肤品。",
        "Number-based customized skincare solutions.": "基于数字的定制化护肤解决方案。",
        "Pure ingredient-oriented skincare brand for a healthy barrier.": "旨在打造健康屏障的纯净成分护肤品牌。",
        "Home-care healing solutions merging devices and cosmetics.": "融合美容仪器与化妆品的居家护理修复方案。",
        "Trendy color cosmetics focused on expressive makeup.": "专注于个性表达的潮流彩妆产品。",
        "Clean beauty brand focusing on deep hydration with hyaluronic acid.": "专注于透明质酸深层补水的纯净美妆品牌。",
        "Hanbang (traditional Korean herbal medicine) skincare for modern routines.": "融合传统韩方草药的现代日常护肤品牌。",
        "Premium hair clinics and body care with rich, perfumed scents.": "拥有丰富香氛的优质沙龙级洗护及身体护理产品。"
      },
      JA: {
        "Premium, functional skincare solutions.": "プレミアムで機能的なスキンケアソリューション。",
        "Derma-cosmetics representing dermatology-grade barrier repair.": "皮膚科レベルのバリア修復を叶えるダーマコスメ。",
        "Innovative beauty focused on natural radiance.": "自然な輝きに焦点を当てた革新的なビューティー。",
        "Professional hair and scalp care brand.": "プロフェッショナルなヘア＆頭皮ケアブランド。",
        "Clinically tested dermocosmetics for sensitive and troubled skin.": "敏感肌や肌荒れのために臨床テストされたダーマコスメ。",
        "Number-based customized skincare solutions.": "番号別でアプローチするカスタマイズスキンケア。",
        "Pure ingredient-oriented skincare brand for a healthy barrier.": "健やかなバリアのための純粋成分指向スキンケアブランド。",
        "Home-care healing solutions merging devices and cosmetics.": "美顔器とコスメを融合させたホームケアヒーリングソリューション。",
        "Trendy color cosmetics focused on expressive makeup.": "表現豊かなメイクに焦点を当てたトレンディなカラーコスメ。",
        "Clean beauty brand focusing on deep hydration with hyaluronic acid.": "ヒアルロン酸による深層水分チャージに特化したクリーンビューティー。",
        "Hanbang (traditional Korean herbal medicine) skincare for modern routines.": "現代のルーティンのための韓方スキンケアブランド。",
        "Premium hair clinics and body care with rich, perfumed scents.": "豊かな香りに包まれるサロン品質のヘアケア＆ボディケア。"
      }
    };
    
    return descMap[language]?.[desc] || desc;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const hasOptions = (product.options && product.options.length > 0) || (product.colors && product.colors.length > 0);
    if (hasOptions && !selectedOption) {
      alert("please choose the option for the item");
      return;
    }

    try {
      if (isB2B) {
        const currentB2BCart = JSON.parse(localStorage.getItem("b2bCart") || "[]");
        const existingItem = currentB2BCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
        if (existingItem) {
          existingItem.boxQty += quantity;
        } else {
          currentB2BCart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.wholesalePrice,
            inboxQty: product.moq,
            boxQty: quantity,
            image: product.imageSrc,
            optionName: product.optionName || "Color / Option",
            optionValue: selectedOption || undefined
          });
        }
        localStorage.setItem("b2bCart", JSON.stringify(currentB2BCart));
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: `Added ${quantity} boxes of ${product.name} to Wholesale Quote!` } }));
      } else {
        const currentRetailCart = JSON.parse(localStorage.getItem("retailCart") || "[]");
        const existingItem = currentRetailCart.find((item: any) => item.id === product.id && (item.optionValue || item.color || "") === (selectedOption || ""));
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          currentRetailCart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            quantity: quantity,
            image: product.imageSrc,
            optionName: product.optionName || "Color / Option",
            optionValue: selectedOption || undefined
          });
        }
        localStorage.setItem("retailCart", JSON.stringify(currentRetailCart));
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: `Added ${quantity}x ${product.name} to Cart!` } }));
      }
      
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Cart update failed:", err);
      alert("Failed to update cart. Please check if your browser allows cookies/local storage.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 gap-2">
          <Link to="/" className="hover:text-primary-800 transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link to={isB2B ? "/wholesale/brands" : "/shop"} className="hover:text-primary-800 transition-colors">
            {isB2B ? t('wholesale_brands') : t('shop')}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <ImageCarousel 
              images={(() => {
                const productObj = product as any;
                const optionImg = selectedOption ? productObj.optionImages?.[selectedOption] : null;
                const baseImgs = productObj.images?.length > 0 ? productObj.images : [product.imageSrc];
                return optionImg ? [optionImg, ...baseImgs.filter((img: string) => img !== optionImg)] : baseImgs;
              })()}
              productName={product.name}
              imageFit={product.imageFit as any}
              imageScale={product.imageScale}
              isBestseller={product.isBestseller}
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-2 sm:px-0 lg:mt-0 flex flex-col h-full">
            <Link 
              to={isB2B ? `/wholesale/brands/${encodeURIComponent(product.brand)}` : `/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
              className="text-lg font-bold tracking-widest text-primary-400 uppercase mb-2 hover:text-primary-600 transition-colors"
            >
              {product.brand}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-4">
              {product.name}
            </h1>
            
            {/* Reviews Mock & Sales */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
              <span className="text-gray-300">|</span>
              <a href="#reviews" onClick={(e) => { e.preventDefault(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); className="text-sm text-gray-500 hover:text-primary-700 cursor-pointer underline underline-offset-4 decoration-gray-300 hover:decoration-primary-700 transition-colors" }}>
                {Math.floor((product.name.length * 17) % 200) + 45} {t('reviews')}
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {(Math.floor((product.name.length * 43) % 800) + 150).toLocaleString()}+ {t('sold')}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-gray-900">{formatProductPrice(product, isB2B)}</p>
              {isB2B ? (
                <div className="flex flex-col ml-2 border-l border-gray-200 pl-4 py-1">
                  <span className="text-gray-500 line-through">{formatProductPrice(product, false)} {t('msrp')}</span>
                  <span className="text-sm font-semibold text-accent mt-1">
                    {t('wholesale_price')} ({product.moq} {t('moq')})
                  </span>
                </div>
              ) : (
                <div className="flex flex-col ml-2 border-l border-gray-200 pl-4 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">{t('wholesale')} B2B: <span className="text-accent font-bold">{formatProductPrice(product, true)}</span></span>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded shadow-sm">
                      {t('save')} {Math.round((1 - product.wholesalePrice / product.price) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{t('moq')}: {product.moq} {t('boxes')}</span>
                    <Link to={`/wholesale/brands/${encodeURIComponent(product.brand)}?search=${encodeURIComponent(product.name)}`} className="text-xs text-primary-600 hover:text-primary-800 font-medium underline">
                      {t('apply_b2b')} →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <p className="text-base text-gray-700 leading-relaxed mb-10 border-b border-gray-200 pb-8">
              {getTranslatedDescription(product.description, product.category)}
            </p>

            <form className="mt-auto">
              {/* Options Dropdown */}
              {((product.options && product.options.length > 0) || (product.colors && product.colors.length > 0)) && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{d(product.optionName || "Color / Option")}</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(product.options || product.colors).map((opt: string) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`flex items-center justify-center rounded-md border py-3 px-3 text-sm font-semibold uppercase sm:flex-1 transition-all ${
                          selectedOption === opt
                            ? "border-primary-600 bg-primary-50 text-primary-900 ring-1 ring-primary-600 shadow-sm"
                            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-end mt-8">
                <div className="w-full sm:w-1/3">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('quantity')} {isB2B && `(${t('boxes')})`}</h3>
                  <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm h-12">
                    <button 
                      type="button" 
                      className="px-4 h-full text-gray-600 hover:bg-gray-100 transition-colors rounded-l-md flex items-center justify-center font-bold" 
                      onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-gray-900 border-x border-gray-300 w-full text-center">{quantity}</span>
                    <button 
                      type="button" 
                      className="px-4 h-full text-gray-600 hover:bg-gray-100 transition-colors rounded-r-md flex items-center justify-center font-bold" 
                      onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1); }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="w-full sm:w-2/3 h-12">
                  <Button size="lg" className="w-full h-full text-base font-bold gap-2 shadow-lg" onClick={handleAddToCart}>
                    <ShoppingBag className="w-5 h-5" /> 
                    {isB2B ? t('add_to_quote') : t('add_to_cart')}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-8">
              <div className="flex gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 flex-shrink-0 text-primary-600" />
                <span>{t('free_shipping')} {isB2B ? formatPrice(1500) : formatPrice(100)}.</span>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-primary-600" />
                <span>{t('authentic_guarantee')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <section id="reviews" className="mt-24 pt-16 border-t border-gray-200 scroll-mt-24">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-10">{t('customer_reviews')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="text-5xl font-bold text-gray-900 mb-4">{product.rating ? product.rating.toFixed(1) : "5.0"}</div>
              <div className="flex items-center text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500">{t('based_on')} {Math.floor((product.name.length * 17) % 200) + 45} {t('reviews')}</p>
            </div>
            
            <div className="md:col-span-2 space-y-8">
              {[
                { name: "Sarah M.", date: "October 12, 2025", rating: 5, text: "Absolutely love this! I've been using it for a few weeks and the results are amazing. It arrived perfectly packaged and the quality is exactly what you'd expect from authentic Korean beauty products." },
                { name: "Jessica T.", date: "September 28, 2025", rating: 5, text: "Holy grail status. I have sensitive skin and this didn't cause any breakouts. The texture is beautiful and it layers perfectly under my makeup. Will definitely repurchase!" },
                { name: "Emily R.", date: "September 15, 2025", rating: 4, text: "Really good product overall. It took a little while to see the full effects, but my skin has definitely improved. The packaging is very premium too." }
              ].map((review, i) => (
                <div key={i} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                    </div>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
