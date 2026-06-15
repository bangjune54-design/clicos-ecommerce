import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Globe2, Truck, ShieldCheck, ArrowRight, Plus, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { getLiveInventory, getLiveBrands } from "../utils/inventory";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { sendAdminNotification } from "../utils/email";

interface Product {
  id: string;
  name: string;
  category: string;
  wholesalePrice: number;
  moq: number;
  imageSrc: string;
  isBestseller: boolean;
  colors?: string[];
}

const getBrandProducts = (brandName: string): Product[] => {
  return getLiveInventory().filter(p => p.brand === brandName || p.brand?.toUpperCase() === brandName.toUpperCase());
};

const benefits = [
  {
    title: "Global Distribution",
    description: "We ship to over 50 countries with dedicated logistics partners for fast customs clearance.",
    icon: Globe2,
    key: "benefit1",
  },
  {
    title: "Tiered Pricing",
    description: "Access our B2B portal for volume discounts. The more you order, the better the margins.",
    icon: Building2,
    key: "benefit2",
  },
  {
    title: "Fast Dispatch",
    description: "Most wholesale orders ship within 48 hours from our central warehouse in Seoul.",
    icon: Truck,
    key: "benefit3",
  },
  {
    title: "100% Authentic",
    description: "Direct contracts with Korean brands ensure you receive only genuine, unadulterated products.",
    icon: ShieldCheck,
    key: "benefit4",
  },
];

const TRANSLATED_WHOLESALE: Record<string, Record<string, string>> = {
  EN: {
    title: "Wholesale & B2B Partnership",
    subtitle: "Scale your beauty business with authentic K-Beauty products. We provide competitive pricing, reliable fulfillment, and dedicated account management for our B2B partners worldwide.",
    whyTitle: "Why Partner With CLICOS?",
    benefit1_title: "Global Distribution",
    benefit1_desc: "We ship to over 50 countries with dedicated logistics partners for fast customs clearance.",
    benefit2_title: "Tiered Pricing",
    benefit2_desc: "Access our B2B portal for volume discounts. The more you order, the better the margins.",
    benefit3_title: "Fast Dispatch",
    benefit3_desc: "Most wholesale orders ship within 48 hours from our central warehouse in Seoul.",
    benefit4_title: "100% Authentic",
    benefit4_desc: "Direct contracts with Korean brands ensure you receive only genuine, unadulterated products.",
    alreadyPartner: "Already a Partner?",
    alreadyPartnerDesc: "Access the B2B portal to view live inventory, place bulk orders, and track shipments.",
    loginPortal: "Login to Portal",
    formTitle: "Wholesale Order",
    formDesc: "Fill out the form below to apply for a wholesale account. Our B2B team will review your application and get back to you within 1-2 business days.",
    firstName: "First name",
    lastName: "Last name",
    companyName: "Company Name",
    workEmail: "Work Email",
    phone: "Phone Number",
    country: "Country",
    businessType: "Business Type",
    orderSelection: "Order Selection",
    selectBrand: "Select Brand",
    chooseBrand: "-- Choose Brand --",
    selectProduct: "Select Product",
    chooseProduct: "-- Choose Product --",
    boxQty: "Box Qty",
    addItem: "Add Item",
    selectedItems: "Selected Items",
    inboxQty: "Inbox Qty",
    boxesCount: "Boxes",
    itemsCount: "items",
    additionalDetails: "Additional Details / Expected Order Volume",
    messagePlaceholder: "e.g. We are looking to order 500 units of the selected items monthly...",
    submitBtn: "Submit Application",
    submittingBtn: "Submitting...",
    successMsg: "Wholesale Quote submitted successfully with {count} items! Our B2B team will contact you shortly.",
    errorMsg: "Oops! There was a problem submitting your application. Please try again.",
    networkError: "Network error. Please try again.",
    us: "United States",
    ca: "Canada",
    uk: "United Kingdom",
    au: "Australia",
    uae: "United Arab Emirates",
    other: "Other",
    onlineRetailer: "Online Retailer",
    brickMortar: "Brick & Mortar Store",
    distributor: "Distributor / Wholesaler",
    salonSpa: "Salon / Spa"
  },
  KO: {
    title: "도매 & B2B 파트너십",
    subtitle: "정품 K-뷰티 제품으로 비즈니스를 확장해보세요. 전 세계 B2B 파트너를 위한 경쟁력 있는 가격, 신뢰할 수 있는 풀필먼트 및 전담 계정 관리를 제공합니다.",
    whyTitle: "왜 CLICOS와 함께해야 할까요?",
    benefit1_title: "글로벌 유통",
    benefit1_desc: "신속한 통관을 위해 전담 물류 파트너와 함께 50개국 이상으로 배송합니다.",
    benefit2_title: "등급별 요금제",
    benefit2_desc: "대량 주문 할인을 받으려면 B2B 포털을 이용하세요. 많이 주문할수록 마진이 향상됩니다.",
    benefit3_title: "빠른 배송",
    benefit3_desc: "대부분의 도매 주문은 서울 중앙 물류창고에서 48시간 이내에 발송됩니다.",
    benefit4_title: "100% 정품 보장",
    benefit4_desc: "한국 브랜드와 직접 계약하여 정품만을 안전하게 보장해 드립니다.",
    alreadyPartner: "이미 파트너이신가요?",
    alreadyPartnerDesc: "B2B 포털에 접속하여 실시간 재고를 확인하고 대량 주문을 진행하거나 배송을 추적하세요.",
    loginPortal: "포털 로그인",
    formTitle: "도매 주문서",
    formDesc: "도매 계정을 신청하시려면 아래 양식을 작성해 주세요. B2B 전담 부서에서 검토 후 1-2영업일 이내에 연락드리겠습니다.",
    firstName: "이름",
    lastName: "성",
    companyName: "회사명",
    workEmail: "회사 이메일",
    phone: "전화번호",
    country: "국가",
    businessType: "업태/업종",
    orderSelection: "주문 품목 선택",
    selectBrand: "브랜드 선택",
    chooseBrand: "-- 브랜드 선택 --",
    selectProduct: "제품 선택",
    chooseProduct: "-- 제품 선택 --",
    boxQty: "박스 수량",
    addItem: "품목 추가",
    selectedItems: "선택된 품목",
    inboxQty: "박스당 수량",
    boxesCount: "박스",
    itemsCount: "개 제품",
    additionalDetails: "기타 문의 사항 / 예상 월간 주문 규모",
    messagePlaceholder: "예: 매월 선택한 품목을 500개 이상 대량 구매하고자 합니다...",
    submitBtn: "신청서 제출",
    submittingBtn: "제출 중...",
    successMsg: "도매 견적 신청서가 성공적으로 제출되었습니다! ({count}개 품목) B2B 전담 부서에서 곧 연락드리겠습니다.",
    errorMsg: "죄송합니다. 제출하는 중 문제가 발생했습니다. 다시 시도해 주세요.",
    networkError: "네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
    us: "미국",
    ca: "캐나다",
    uk: "영국",
    au: "호주",
    uae: "아랍에미리트",
    other: "기타 국가",
    onlineRetailer: "온라인 쇼핑몰",
    brickMortar: "오프라인 매장",
    distributor: "도매/유통업체",
    salonSpa: "살롱 / 스파"
  },
  PT: {
    title: "Parceria de Atacado & B2B",
    subtitle: "Amplie seus negócios de beleza com produtos autênticos de K-Beauty. Oferecemos preços competitivos, atendimento confiável e gerenciamento de conta dedicado para nossos parceiros B2B em todo o mundo.",
    whyTitle: "Por que fazer parceria com a CLICOS?",
    benefit1_title: "Distribuição Global",
    benefit1_desc: "Enviamos para mais de 50 países com parceiros de logística dedicados para liberação alfandegária rápida.",
    benefit2_title: "Preços Progressivos",
    benefit2_desc: "Acesse nosso portal B2B para descontos por volume. Quanto maior o seu pedido, melhores as margens.",
    benefit3_title: "Despacho Rápido",
    benefit3_desc: "A maioria dos pedidos de atacado é enviada em 48 horas a partir de nosso depósito central em Seul.",
    benefit4_title: "100% Autêntico",
    benefit4_desc: "Contratos diretos com marcas coreanas garantem que você receba apenas produtos originais e sem adulteração.",
    alreadyPartner: "Já é um Parceiro?",
    alreadyPartnerDesc: "Acesse o portal B2B para visualizar o inventário em tempo real, fazer pedidos em lote e rastrear remessas.",
    loginPortal: "Entrar no Portal",
    formTitle: "Pedido de Atacado",
    formDesc: "Preencha o formulário abaixo para solicitar uma conta de atacado. Nossa equipe B2B analisará seu pedido e responderá em 1-2 dias úteis.",
    firstName: "Nome",
    lastName: "Sobrenome",
    companyName: "Nome da Empresa",
    workEmail: "E-mail de Trabalho",
    phone: "Telefone",
    country: "País",
    businessType: "Tipo de Negócio",
    orderSelection: "Seleção de Pedidos",
    selectBrand: "Selecionar Marca",
    chooseBrand: "-- Escolher Marca --",
    selectProduct: "Selecionar Produto",
    chooseProduct: "-- Escolher Produto --",
    boxQty: "Qtd de Caixas",
    addItem: "Adicionar Item",
    selectedItems: "Itens Selecionados",
    inboxQty: "Qtd na Caixa",
    boxesCount: "Caixas",
    itemsCount: "itens",
    additionalDetails: "Detalhes Adicionais / Volume de Pedido Esperado",
    messagePlaceholder: "ex: Estamos procurando encomendar 500 unidades dos itens selecionados mensalmente...",
    submitBtn: "Enviar Inscrição",
    submittingBtn: "Enviando...",
    successMsg: "Cotação de atacado enviada com sucesso com {count} itens! Nossa equipe B2B entrará em contato em breve.",
    errorMsg: "Ops! Houve um problema ao enviar sua inscrição. Tente novamente.",
    networkError: "Erro de rede. Tente novamente.",
    us: "Estados Unidos",
    ca: "Canadá",
    uk: "Reino Unido",
    au: "Austrália",
    uae: "Emirados Árabes Unidos",
    other: "Outro",
    onlineRetailer: "Varejista Online",
    brickMortar: "Loja Física",
    distributor: "Distribuidor / Atacadista",
    salonSpa: "Salão / Spa"
  },
  ES: {
    title: "Asociación de Mayoreo & B2B",
    subtitle: "Haga crecer su negocio de belleza con productos auténticos de K-Beauty. Ofrecemos precios competitivos, cumplimiento confiable y gestión de cuenta dedicada para nuestros socios B2B en todo el mundo.",
    whyTitle: "¿Por qué asociarse con CLICOS?",
    benefit1_title: "Distribución Global",
    benefit1_desc: "Enviamos a más de 50 países con socios de logística dedicados para un despacho aduanero rápido.",
    benefit2_title: "Precios Escalonados",
    benefit2_desc: "Acceda a nuestro portal B2B para obtener descuentos por volumen. Cuanto más ordene, mejores serán sus márgenes.",
    benefit3_title: "Despacho Rápido",
    benefit3_desc: "La mayoría de los pedidos al por mayor se envían dentro de las 48 horas desde nuestro almacén central en Seúl.",
    benefit4_title: "100% Auténtico",
    benefit4_desc: "Los contratos directos con marcas coreanas garantizan que reciba únicamente productos genuinos y sin alteraciones.",
    alreadyPartner: "¿Ya es Socio?",
    alreadyPartnerDesc: "Acceda al portal B2B para ver el inventario en vivo, realizar pedidos en volumen y realizar el seguimiento de envíos.",
    loginPortal: "Iniciar Sesión en Portal",
    formTitle: "Pedido de Mayoreo",
    formDesc: "Complete el siguiente formulario para solicitar una cuenta de mayoreo. Nuestro equipo B2B revisará su solicitud y se pondrá en contacto en 1-2 días hábiles.",
    firstName: "Nombre",
    lastName: "Apellido",
    companyName: "Nombre de la Empresa",
    workEmail: "Correo de Trabajo",
    phone: "Número de Teléfono",
    country: "País",
    businessType: "Tipo de Negocio",
    orderSelection: "Selección de Pedido",
    selectBrand: "Seleccionar Marca",
    chooseBrand: "-- Elegir Marca --",
    selectProduct: "Seleccionar Producto",
    chooseProduct: "-- Elegir Producto --",
    boxQty: "Cant. de Cajas",
    addItem: "Añadir Artículo",
    selectedItems: "Artículos Seleccionados",
    inboxQty: "Cant. en Caja",
    boxesCount: "Cajas",
    itemsCount: "artículos",
    additionalDetails: "Detalles Adicionales / Volumen de Pedido Esperado",
    messagePlaceholder: "ej. Buscamos ordenar 500 unidades de los artículos seleccionados mensualmente...",
    submitBtn: "Enviar Solicitud",
    submittingBtn: "Enviando...",
    successMsg: "¡Cotización de mayoreo enviada con éxito con {count} artículos! Nuestro equipo B2B se comunicará pronto.",
    errorMsg: "¡Oops! Hubo un problema al enviar su solicitud. Inténtelo de nuevo.",
    networkError: "Error de red. Inténtelo de nuevo.",
    us: "Estados Unidos",
    ca: "Canadá",
    uk: "Reino Unido",
    au: "Australia",
    uae: "Emiratos Árabes Unidos",
    other: "Otro",
    onlineRetailer: "Minorista en Línea",
    brickMortar: "Tienda Física",
    distributor: "Distribuidor / Mayorista",
    salonSpa: "Salón / Spa"
  },
  ZH: {
    title: "批发与 B2B 合作",
    subtitle: "借助正宗的韩国美妆产品扩展您的美容业务。我们为全球 B2B 合作伙伴提供具有竞争力的价格、可靠的物流以及专职客户经理支持。",
    whyTitle: "为什么选择与 CLICOS 合作？",
    benefit1_title: "全球配送",
    benefit1_desc: "我们与专业的物流伙伴合作，配送至50多个国家，提供快速的清关服务。",
    benefit2_title: "阶梯价格",
    benefit2_desc: "访问我们的 B2B 门户网站获取批量折扣。订购越多，利润越可观。",
    benefit3_title: "快速发货",
    benefit3_desc: "大多数批发订单可在48小时内从首尔的中央仓库发出。",
    benefit4_title: "100% 正品保障",
    benefit4_desc: "与韩国品牌直接签约，确保您收到的只有百分之百的正品，绝无掺假。",
    alreadyPartner: "已经是合作伙伴？",
    alreadyPartnerDesc: "登录 B2B 门户以查看实时库存、进行批量订购并追踪货物发运状态。",
    loginPortal: "登录门户网站",
    formTitle: "批发订货单",
    formDesc: "填写下方表格申请批发账户。我们的 B2B 团队将在1-2个工作日内审核您的申请并与您取得联系。",
    firstName: "名",
    lastName: "姓",
    companyName: "公司名称",
    workEmail: "工作邮箱",
    phone: "电话号码",
    country: "国家",
    businessType: "业务类型",
    orderSelection: "订货清单选择",
    selectBrand: "选择品牌",
    chooseBrand: "-- 选择品牌 --",
    selectProduct: "选择产品",
    chooseProduct: "-- 选择产品 --",
    boxQty: "箱数",
    addItem: "添加商品",
    selectedItems: "已选商品",
    inboxQty: "装箱数",
    boxesCount: "箱",
    itemsCount: "件商品",
    additionalDetails: "其他需求细节 / 预期月订购量",
    messagePlaceholder: "例如：我们希望每月订购 500 件选定的商品...",
    submitBtn: "提交申请",
    submittingBtn: "提交中...",
    successMsg: "批发报价申请已成功提交，共 {count} 项商品！我们的 B2B 团队将尽快与您联系。",
    errorMsg: "哎呀！提交您的申请时出现问题。请重试。",
    networkError: "网络错误，请重试。",
    us: "美国",
    ca: "加拿大",
    uk: "英国",
    au: "澳大利亚",
    uae: "阿拉伯联合酋长国",
    other: "其他",
    onlineRetailer: "在线零售商",
    brickMortar: "实体店",
    distributor: "分销商 / 批发商",
    salonSpa: "美容沙龙 / 水疗中心"
  },
  JA: {
    title: "卸売 & B2B パートナーシップ",
    subtitle: "信頼の本物韓国コスメでビューティービジネスを拡大しましょう。世界中のB2Bパートナー向けに、競争力のある価格、確実なフルフィルメント、および専任アカウントサポートを提供します。",
    whyTitle: "CLICOSとパートナーになる理由",
    benefit1_title: "グローバル流通",
    benefit1_desc: "迅速な通関手続きのため、専任の物流パートナーと協力して50か国以上に配送しています。",
    benefit2_title: "ボリュームディスカウント",
    benefit2_desc: "B2Bポータルにアクセスして大口割引をご利用ください。注文数が多いほど、利益率が高くなります。",
    benefit3_title: "迅速な発送",
    benefit3_desc: "ほとんどの卸売注文は、ソウルの中央倉庫から48時間以内に発送されます。",
    benefit4_title: "100%本物保証",
    benefit4_desc: "韓国ブランドとの直接契約により、偽物のない本物の製品のみをお届けすることをお約束します。",
    alreadyPartner: "既にパートナーですか？",
    alreadyPartnerDesc: "B2Bポータルにアクセスして、リアルタイムの在庫確認、大口発注、および配送追跡を行ってください。",
    loginPortal: "ポータルにログイン",
    formTitle: "卸売注文書",
    formDesc: "卸売アカウントの申請をご希望の方は、以下のフォームにご記入ください。B2Bチームが申請を審査し、1〜2営業日以内にご連絡いたします。",
    firstName: "名",
    lastName: "姓",
    companyName: "会社名",
    workEmail: "仕事用メールアドレス",
    phone: "電話番号",
    country: "国",
    businessType: "業態/ビジネスタイプ",
    orderSelection: "注文アイテム選択",
    selectBrand: "ブランド選択",
    chooseBrand: "-- ブランドを選択 --",
    selectProduct: "製品選択",
    chooseProduct: "-- 製品を選択 --",
    boxQty: "箱数",
    addItem: "アイテム追加",
    selectedItems: "選択されたアイテム",
    inboxQty: "入数 (1箱あたり)",
    boxesCount: "箱",
    itemsCount: "個の製品",
    additionalDetails: "その他のご要望 / 予想される月間発注量",
    messagePlaceholder: "例：選択した商品を毎月500個程度発注したいと考えています...",
    submitBtn: "申請書を送信",
    submittingBtn: "送信中...",
    successMsg: "卸売見積もりが正常に送信されました（{count}個のアイテム）！B2Bチームから折り返しご連絡いたします。",
    errorMsg: "おっと！申請の送信中に問題が発生しました。もう一度お試しください。",
    networkError: "ネットワークエラーが発生しました。もう一度お試しください。",
    us: "アメリカ",
    ca: "カナダ",
    uk: "イギリス",
    au: "オーストラリア",
    uae: "アラブ首長国連邦",
    other: "その他",
    onlineRetailer: "オンライン小売業",
    brickMortar: "実店舗",
    distributor: "代理店 / 卸売業者",
    salonSpa: "サロン / スパ"
  }
};

export function Wholesale() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "retail";
  const isWholesale = isLoggedIn && userType === "wholesale";
  const userEmail = localStorage.getItem("userEmail") || "";

  const b2bBrands = getLiveBrands();
  const { language } = useLanguage();
  const { getLocalizedProduct } = useCountry();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<{brand: string, product: string, quantity: number, inboxQty: number}[]>(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('b2bCart') || '[]');
      if (cart.length > 0) {
        return cart.map((item: any) => ({
          brand: item.brand,
          product: `${item.name}${item.optionValue ? ` (${item.optionValue})` : ''}`,
          quantity: item.boxQty,
          inboxQty: item.inboxQty || 1
        }));
      }
    } catch {}
    return [];
  });

  const d = (key: string) => {
    return TRANSLATED_WHOLESALE[language]?.[key] || TRANSLATED_WHOLESALE["EN"]?.[key] || key;
  };

  const handleAddItem = () => {
    if (selectedBrand && selectedProduct && selectedQuantity > 0) {
      const productObj = getBrandProducts(selectedBrand).find(p => p.name === selectedProduct);
      const inboxQty = productObj ? productObj.moq : 1;
      
      setOrderItems([...orderItems, { 
        brand: selectedBrand, 
        product: selectedProduct, 
        quantity: selectedQuantity,
        inboxQty 
      }]);
      setSelectedProduct("");
      setSelectedQuantity(1);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative bg-primary-950 py-24 sm:py-32 overflow-hidden mt-8 sm:mt-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        {/* Cargo Ship Background Image in Brown/Sepia theme */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/cargo-ship-brown.png"
            alt="Wholesale & B2B Partnership"
            className="w-full h-full object-cover opacity-45 object-center"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/80 to-primary-950/90"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif drop-shadow-md">
            {d("title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-primary-100 max-w-2xl mx-auto font-medium opacity-90">
            {d("subtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - Info & Portal Login CTA */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif mb-8">
              {d("whyTitle")}
            </h2>
            
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {benefits.map((benefit) => (
                <div key={benefit.key} className="relative pl-12">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <benefit.icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                    </div>
                    {d(benefit.key + "_title")}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-gray-600">
                    {d(benefit.key + "_desc")}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">
                {d("alreadyPartner")}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {d("alreadyPartnerDesc")}
              </p>
              <Button variant="primary" className="w-full sm:w-auto gap-2">
                {d("loginPortal")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Inquiry Form / Gate */}
          {!isWholesale ? (
            <div className="glass rounded-3xl p-8 sm:p-12 shadow-xl border-primary-100/50 bg-gradient-to-b from-primary-50/20 to-white text-center relative overflow-hidden min-h-[500px] flex flex-col justify-center items-center">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary-600"></div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700 mb-6 border border-primary-200">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">
                Wholesale Portal Locked
              </h3>
              <p className="text-sm text-gray-600 mb-8 max-w-sm leading-relaxed">
                Only registered wholesale accounts can submit wholesale order forms. Log in with your partner account or apply for a wholesale partnership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link to="/login?type=wholesale" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full gap-2 font-semibold">
                    Log In as B2B Partner <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/signup?type=wholesale" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full font-semibold border-primary-600 text-primary-700 hover:bg-primary-50">
                    Apply for Partnership
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 sm:p-10 shadow-xl border-gray-100 relative">
              <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6">
                {d("formTitle")}
              </h3>
              <p className="text-sm text-gray-600 mb-8">
                {d("formDesc")}
              </p>

              <form action="https://formspree.io/f/xpqyvkra" method="POST" className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
                if (submitBtn) { submitBtn.textContent = d("submittingBtn"); submitBtn.disabled = true; }
                
                const formData = new FormData(form);
                
                // Format the selected items into a readable string for the email
                const itemsList = orderItems.length > 0 
                  ? orderItems.map(item => `- ${item.quantity} box(es) of ${item.brand} ${item.product} (${item.quantity * item.inboxQty} items total)`).join('\n')
                  : 'No specific items selected.';
                  
                formData.append("Selected_Items_List", itemsList);

                // Build a structured list of items with their wholesale prices and calculate the order total
                let calculatedTotal = 0;
                const formattedItemsForStorage = orderItems.map(item => {
                  const productsOfBrand = getBrandProducts(item.brand);
                  const matchedProduct = productsOfBrand.find(p => p.name === item.product || `${p.name}${p.colors ? ` (${item.product.split('(')[1]?.replace(')', '')})` : ''}` === item.product);
                  const price = matchedProduct ? matchedProduct.wholesalePrice : 15.00;
                  const qtyTotal = item.quantity * item.inboxQty;
                  calculatedTotal += qtyTotal * price;
                  
                  return {
                    name: `${item.brand} ${item.product}`,
                    qty: qtyTotal,
                    price: price
                  };
                });

                // Create a mock order structure to save in globalOrders
                const globalOrders = JSON.parse(localStorage.getItem("globalOrders") || "[]");
                const orderId = `WHL-${Math.floor(100000 + Math.random() * 900000)}`;
                const firstName = formData.get("first-name") as string || "";
                const lastName = formData.get("last-name") as string || "";
                
                const newOrder = {
                  id: orderId,
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                  status: "Pending Approval",
                  customerName: `${firstName} ${lastName}`.trim(),
                  customerEmail: userEmail,
                  total: calculatedTotal,
                  address: formData.get("country") as string || "Other",
                  items: formattedItemsForStorage
                };

                try {
                  // Attempt calling real Vercel API
                  const response = await fetch("/api/wholesale", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      firstName,
                      lastName,
                      email: formData.get("email") as string,
                      phone: formData.get("phone") as string,
                      company: formData.get("company") as string,
                      country: formData.get("country") as string,
                      businessType: formData.get("business-type") as string,
                      selectedItemsList: itemsList,
                      message: formData.get("message") as string,
                    })
                  });

                  // Trigger simulation toast
                  sendAdminNotification(
                    `New Wholesale Order Quote Request from ${formData.get("company")}`,
                    newOrder,
                    "info@clicos.co.kr, wholesales@clicos.co.kr"
                  );

                  // Always persist order to localStorage and show success
                  localStorage.setItem("globalOrders", JSON.stringify([newOrder, ...globalOrders]));
                  alert(d("successMsg").replace("{count}", String(orderItems.length)));
                  setOrderItems([]);
                  localStorage.removeItem('b2bCart');
                  window.dispatchEvent(new Event('storage'));
                  window.location.href = '/my-page';
                } catch (error) {
                  console.error("API error, falling back to local simulation:", error);
                  
                  // Local persistence fallback
                  localStorage.setItem("globalOrders", JSON.stringify([newOrder, ...globalOrders]));
                  sendAdminNotification(
                    `New Wholesale Order Quote Request from ${formData.get("company")}`,
                    newOrder,
                    "info@clicos.co.kr, wholesales@clicos.co.kr"
                  );

                  alert(d("successMsg").replace("{count}", String(orderItems.length)));
                  setOrderItems([]);
                  localStorage.removeItem('b2bCart');
                  window.dispatchEvent(new Event('storage'));
                  window.location.href = '/my-page';
                }
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      {d("firstName")}
                    </label>
                    <Input id="first-name" name="first-name" type="text" placeholder="Jane" required />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      {d("lastName")}
                    </label>
                    <Input id="last-name" name="last-name" type="text" placeholder="Doe" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("companyName")}
                  </label>
                  <Input id="company" name="company" type="text" placeholder="Your Beauty Store LLC" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      {d("workEmail")}
                    </label>
                    <Input id="email" name="email" type="email" placeholder="jane@company.com" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                      {d("phone")}
                    </label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("country")}
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                  >
                    <option value="United States">{d("us")}</option>
                    <option value="Canada">{d("ca")}</option>
                    <option value="United Kingdom">{d("uk")}</option>
                    <option value="Australia">{d("au")}</option>
                    <option value="United Arab Emirates">{d("uae")}</option>
                    <option value="Other">{d("other")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="business-type" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("businessType")}
                  </label>
                  <select
                    id="business-type"
                    name="business-type"
                    className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                  >
                    <option value="Online Retailer">{d("onlineRetailer")}</option>
                    <option value="Brick & Mortar Store">{d("brickMortar")}</option>
                    <option value="Distributor / Wholesaler">{d("distributor")}</option>
                    <option value="Salon / Spa">{d("salonSpa")}</option>
                    <option value="Other">{d("other")}</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">{d("orderSelection")}</h4>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <label htmlFor="select-brand" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        {d("selectBrand")}
                      </label>
                      <select
                        id="select-brand"
                        value={selectedBrand}
                        onChange={(e) => {
                          setSelectedBrand(e.target.value);
                          setSelectedProduct("");
                        }}
                        className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                      >
                        <option value="">{d("chooseBrand")}</option>
                        {b2bBrands.map(b => (
                          <option key={b.name} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="select-product" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        {d("selectProduct")}
                      </label>
                      <select
                        id="select-product"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        disabled={!selectedBrand}
                        className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent disabled:opacity-50"
                      >
                        <option value="">{d("chooseProduct")}</option>
                        {selectedBrand && getBrandProducts(selectedBrand).map(p => (
                          <option key={p.id} value={p.name}>{getLocalizedProduct(p).name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-24 shrink-0">
                      <label htmlFor="select-quantity" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        {d("boxQty")}
                      </label>
                      <Input
                        id="select-quantity"
                        type="number"
                        min={1}
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mb-6">
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem} disabled={!selectedBrand || !selectedProduct} className="gap-2">
                      <Plus className="w-4 h-4" /> {d("addItem")}
                    </Button>
                  </div>

                  {orderItems.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 ring-1 ring-inset ring-gray-200">
                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        {d("selectedItems")} ({orderItems.length})
                      </h5>
                      <ul className="space-y-3">
                        {orderItems.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-between gap-4 bg-white p-3 rounded-md shadow-sm">
                            <div className="flex-1">
                              <Badge variant="outline" className="text-[10px] mb-1">{item.brand}</Badge>
                              <p className="text-sm font-medium text-gray-900 leading-tight">{item.product}</p>
                              <p className="text-xs text-gray-500 mt-1">{d("inboxQty")}: {item.inboxQty}</p>
                            </div>
                            <div className="text-sm font-bold text-primary-700 shrink-0 text-right">
                              <div>{item.quantity} {d("boxesCount")}</div>
                              <div className="text-xs text-gray-500 font-normal">({item.quantity * item.inboxQty} {d("itemsCount")})</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("additionalDetails")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent resize-none"
                    placeholder={d("messagePlaceholder")}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full">
                    {d("submitBtn")}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
