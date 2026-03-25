import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useCurrency } from "../contexts/CurrencyContext";
import { getLiveInventory, getLiveBrands } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";

// Mocks
const categories = [
  {
    name: "Skincare",
    href: "/shop?category=skincare",
    imageSrc: "/skincare.png",
    description: "Premium serums, toners, and moisturizers for glass skin.",
  },
  {
    name: "Hair Care",
    href: "/shop?category=haircare",
    imageSrc: "/haircare.png",
    description: "Nourishing shampoos and treatments for healthy hair.",
  },
  {
    name: "Makeup",
    href: "/shop?category=makeup",
    imageSrc: "/makeup.png",
    description: "Trendy color cosmetics and tools for expressive makeup.",
  },
];

const features = [
  {
    name: "Authentic K-Beauty",
    description: "100% genuine products sourced directly from Korea.",
    icon: Sparkles,
  },
  {
    name: "Wholesale Ready",
    description: "Competitive pricing and low MOQs for global distributors.",
    icon: ShieldCheck,
  },
  {
    name: "Curated Selection",
    description: "Only the best and trending products tested by experts.",
    icon: Star,
  },
];

export function Home() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const allShopProducts = getLiveInventory();
  const b2bBrands = getLiveBrands();

  const categories = [
    {
      name: t('skincare'),
      href: "/shop?category=skincare",
      imageSrc: "/skincare.png",
      description: t('hero_description').substring(0, 50) + "...",
    },
    {
      name: t('haircare'),
      href: "/shop?category=haircare",
      imageSrc: "/haircare.png",
      description: t('hero_description').substring(0, 50) + "...",
    },
    {
      name: t('makeup'),
      href: "/shop?category=makeup",
      imageSrc: "/makeup.png",
      description: t('hero_description').substring(0, 50) + "...",
    },
  ];

  const features = [
    {
      name: t('authentic_k_beauty'),
      description: t('authentic_k_beauty_desc'),
      icon: Sparkles,
    },
    {
      name: t('wholesale_ready'),
      description: t('wholesale_ready_desc'),
      icon: ShieldCheck,
    },
    {
      name: t('curated_selection'),
      description: t('curated_selection_desc'),
      icon: Star,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-primary-900 pb-16 pt-14 sm:pb-20">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2600&auto=format&fit=crop"
          alt="Cosmetics flatlay"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32 animate-slide-up">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-primary-200 ring-1 ring-white/20 hover:ring-white/40 transition-colors bg-white/5 backdrop-blur-md">
                {t('bulk_title')}{" "}
                <Link to="/wholesale" className="font-semibold text-white">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {t('view_all')} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif">
                {t('hero_title')} <br />
                <span className="text-accent">{t('hero_subtitle')}</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-primary-100">
                {t('hero_description')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/shop">
                  <Button size="lg" className="gap-2">
                    {t('shop_retail')} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  to="/wholesale"
                  className="text-sm font-semibold leading-6 text-white hover:text-accent transition-colors"
                >
                  {t('apply_wholesale')} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Sellers Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold font-serif text-gray-900">{t('best_sellers')}</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors">
            {t('view_all')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            allShopProducts.find(p => p.isBestseller && p.brand === "FWEE"),
            allShopProducts.find(p => p.isBestseller && p.brand === "Torriden"),
            allShopProducts.find(p => p.isBestseller && p.brand === "4PM"),
            allShopProducts.find(p => p.isBestseller && p.brand === "Beauty of Joseon")
          ].filter(Boolean).map((product) => (
            <Card key={product.id} className="group flex flex-col hover:shadow-lg transition-shadow duration-300">
              <Link to={`/product/${product.id}`} className="block h-full flex flex-col">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img src={product.imageSrc} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  <Badge variant="accent" className="absolute top-3 left-3 shadow-sm">{t('bestseller')}</Badge>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <Link 
                    to={`/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
                    className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mb-1 hover:text-primary-600 transition-colors inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {product.brand}
                  </Link>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mt-1 mb-1 text-xs text-gray-500">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-gray-700">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                    <span>({Math.floor((product.name.length * 17) % 200) + 45})</span>
                    <span className="ml-auto text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {(Math.floor((product.name.length * 43) % 800) + 150).toLocaleString()}+ {t('sold')}
                    </span>
                  </div>

                  <div className="mt-auto pt-2 flex items-end justify-between gap-1 w-full overflow-hidden">
                    <div className="flex flex-col truncate">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(product?.price || 0)}</p>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">B2B: <span className="text-accent">{formatPrice(product?.wholesalePrice || 0)}</span></span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 rounded whitespace-nowrap">-{Math.round((1 - (product?.wholesalePrice || 0) / (product?.price || 1)) * 100)}%</span>
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">{t('moq')} {product?.moq}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full shadow-sm hover:bg-primary-50 shrink-0 mb-1" onClick={(e) => e.preventDefault()}>
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Brands Section */}
      <div className="bg-primary-50/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 border-b border-primary-100 pb-4">
            <h2 className="text-3xl font-bold font-serif text-gray-900">{t('featured_brands')}</h2>
            <Link to="/brands" className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors">
              {t('view_all')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {b2bBrands.slice(0, 6).map((brand) => (
              <Link key={brand.name} to={`/wholesale/brands/${encodeURIComponent(brand.name)}`} className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-3 overflow-hidden">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-serif font-bold text-primary-900/40 uppercase">{brand.name.substring(0, 2)}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700 text-center">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold font-serif text-gray-900">{t('recommended_for_you')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            allShopProducts.find(p => !p.isBestseller && p.brand === "FWEE"),
            allShopProducts.find(p => !p.isBestseller && p.brand === "4PM"),
            allShopProducts.find(p => !p.isBestseller && p.brand === "MEDICUBE"),
            allShopProducts.find(p => !p.isBestseller && p.brand === "AESTURA")
          ].filter(Boolean).map((product) => (
            <Card key={product.id} className="group flex flex-col hover:shadow-lg transition-shadow duration-300">
              <Link to={`/product/${product.id}`} className="block h-full flex flex-col">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img src={product.imageSrc} alt={product.name} className="w-full h-full object-contain p-6 mix-blend-multiply object-center group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">{product.brand}</div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(product?.price || 0)}</p>
                    <Button size="sm" variant="outline" className="rounded-full shadow-sm hover:bg-primary-50" onClick={(e) => e.preventDefault()}>
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif heading-gradient">
            {t('shop_by_category')}
          </h2>
          <Link
            to="/shop"
            className="hidden text-sm font-semibold text-primary-600 hover:text-primary-800 sm:block transition-colors"
          >
            {t('browse_all_categories')}<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
          <Link to={categories[0].href} className="group aspect-[2/1] overflow-hidden rounded-2xl sm:aspect-auto sm:row-span-2 relative block cursor-pointer">
            <img
              src={categories[0].imageSrc}
              alt={categories[0].name}
              className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-8 w-full">
              <h3 className="text-2xl font-bold text-white font-serif">{categories[0].name}</h3>
              <p className="mt-2 text-primary-100 text-sm max-w-sm">{categories[0].description}</p>
              <span className="mt-4 inline-block text-white font-semibold text-sm group-hover:text-accent transition-colors">
                {t('shop_now')} &rarr;
              </span>
            </div>
          </Link>
          <Link to={categories[1].href} className="group aspect-[2/1] overflow-hidden rounded-2xl sm:aspect-auto relative block cursor-pointer">
            <img
              src={categories[1].imageSrc}
              alt={categories[1].name}
              className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-6 w-full">
              <h3 className="text-xl font-bold text-white font-serif">{categories[1].name}</h3>
              <p className="mt-1 text-primary-100 text-sm">{categories[1].description}</p>
              <span className="mt-2 inline-block text-white font-semibold text-sm group-hover:text-accent transition-colors">
                {t('shop_now')} &rarr;
              </span>
            </div>
          </Link>
          <Link to={categories[2].href} className="group aspect-[2/1] overflow-hidden rounded-2xl sm:aspect-auto relative block cursor-pointer">
            <img
              src={categories[2].imageSrc}
              alt={categories[2].name}
              className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-6 w-full">
              <h3 className="text-xl font-bold text-white font-serif">{categories[2].name}</h3>
              <p className="mt-1 text-primary-100 text-sm">{categories[2].description}</p>
              <span className="mt-2 inline-block text-white font-semibold text-sm group-hover:text-accent transition-colors">
                {t('shop_now')} &rarr;
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-6 sm:hidden">
          <Link to="/shop" className="block text-sm font-semibold text-primary-600 hover:text-primary-800">
            {t('browse_all_categories')}<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Feature section */}
      <div className="bg-primary-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent tracking-widest uppercase">
              {t('why_choose_clicos')}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
              {t('gateway_to_k_beauty')}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('clicos_description')}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col items-center text-center glass rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100/50 mb-4">
                      <feature.icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                    </div>
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto font-medium text-gray-900 mb-2">{feature.name}</p>
                    <p>{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      {/* B2B CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-primary-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl font-serif">
              {t('bulk_title')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              {t('bulk_description')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/wholesale">
                <Button variant="secondary" size="lg">
                  {t('apply_wholesale')}
                </Button>
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-white hover:text-accent transition-colors">
                {t('partner_login')} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                  <stop stopColor="#a77b6d" />
                  <stop offset={1} stopColor="#a77b6d" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
