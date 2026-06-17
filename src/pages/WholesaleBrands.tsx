import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { getLiveBrandsForCustomers } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";

const TRANSLATED_WHOLESALE_BRANDS: Record<string, Record<string, string>> = {
  EN: {
    title: "B2B Exclusive Brands",
    subtitle: "We partner with top-tier K-beauty brands to offer competitive wholesale opportunities. Explore our portfolio of brands available for B2B distribution.",
    searchPlaceholder: "Search B2B brands...",
    submitInquiry: "Submit Inquiry",
    noBrandsFound: 'No brands found matching "{query}".'
  },
  KO: {
    title: "B2B 독점 브랜드",
    subtitle: "당사는 경쟁력 있는 도매 기회를 제공하기 위해 최고 수준의 K-뷰티 브랜드와 파트너십을 맺고 있습니다. B2B 유통이 가능한 브랜드 포트폴리오를 탐색해 보세요.",
    searchPlaceholder: "B2B 브랜드 검색...",
    submitInquiry: "문의 제출하기",
    noBrandsFound: '"{query}"과 일치하는 브랜드를 찾을 수 없습니다.'
  },
  PT: {
    title: "Marcas Exclusivas B2B",
    subtitle: "Fazemos parceria com as principais marcas de K-beauty para oferecer oportunidades competitivas de atacado. Explore nosso portfólio de marcas disponíveis para distribuição B2B.",
    searchPlaceholder: "Buscar marcas B2B...",
    submitInquiry: "Enviar Consulta",
    noBrandsFound: 'Nenhuma marca encontrada correspondente a "{query}".'
  },
  ES: {
    title: "Marcas Exclusivas B2B",
    subtitle: "Nos asociamos con marcas de K-beauty de primer nivel para ofrecer oportunidades competitivas al por mayor. Explore nuestra cartera de marcas disponibles para distribución B2B.",
    searchPlaceholder: "Buscar marcas B2B...",
    submitInquiry: "Enviar Consulta",
    noBrandsFound: 'No se encontraron marcas que coincidan con "{query}".'
  },
  ZH: {
    title: "B2B 独家合作品牌",
    subtitle: "我们与顶尖韩国美妆品牌合作，为您提供极具竞争力的批发机会。点击探索可供 B2B 分销的品牌组合系列。",
    searchPlaceholder: "搜索 B2B 品牌...",
    submitInquiry: "提交合作咨询",
    noBrandsFound: '未找到与 "{query}" 匹配的品牌。'
  },
  JA: {
    title: "B2B専用独占ブランド",
    subtitle: "競争力のある卸売機会を提供するため、トップクラスのK-Beautyブランドと提携しています。B2B販売が可能な当社のブランドポートフォリオをご覧ください。",
    searchPlaceholder: "B2Bブランドを検索...",
    submitInquiry: "お問い合わせを送信",
    noBrandsFound: '「{query}」に一致するブランドは見つかりませんでした。'
  }
};

export function WholesaleBrands() {
  const [b2bBrands, setB2bBrands] = useState<any[]>([]);
  const [b2bSearchQuery, setB2bSearchQuery] = useState("");
  const { language } = useLanguage();

  const d = (key: string) => {
    return TRANSLATED_WHOLESALE_BRANDS[language]?.[key] || TRANSLATED_WHOLESALE_BRANDS["EN"]?.[key] || key;
  };

  useEffect(() => {
    setB2bBrands(getLiveBrandsForCustomers());
  }, []);

  const filteredBrands = b2bBrands.filter((brand) =>
    brand.name.toLowerCase().includes(b2bSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
            {d("title")}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {d("subtitle")}
          </p>
        </div>

        {/* Search Input for B2B Brands */}
        <div className="mt-10 max-w-md">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-full border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder={d("searchPlaceholder")}
              value={b2bSearchQuery}
              onChange={(e) => setB2bSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
            <li key={brand.name} className="group flex flex-col items-start justify-between">
              <Link to={`/wholesale/brands/${encodeURIComponent(brand.name)}`} className="block w-full">
                <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-white border border-gray-100 mb-6 group-hover:bg-primary-50/50 transition-colors overflow-hidden p-6 shadow-sm">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-3xl font-serif font-bold text-primary-900/40 uppercase tracking-widest">
                      {brand.name.substring(0, 2)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold leading-8 text-gray-900 group-hover:text-primary-800 transition-colors">
                  {brand.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 flex-grow">
                  {brand.description}
                </p>
                <div className="mt-4 text-sm font-semibold text-primary-600 group-hover:text-primary-800 transition-colors flex items-center gap-1">
                  {d("submitInquiry")} <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            </li>
          ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              {d("noBrandsFound").replace("{query}", b2bSearchQuery)}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
