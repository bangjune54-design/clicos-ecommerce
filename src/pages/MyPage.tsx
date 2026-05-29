import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  TrendingUp, 
  Truck,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Badge } from "../components/ui/Badge";

const TRANSLATED_TABS: Record<string, Record<string, string>> = {
  EN: {
    "My Page": "My Page",
    "My Shopping": "My Shopping",
    "My Purchase": "My Purchase",
    "Shipping": "Shipping",
    "Purchase History": "Purchase History",
    "Cart": "Cart",
    "My Activities": "My Activities",
    "Contact Us": "Contact Us",
    "Reviews": "Reviews",
    "My Profile": "My Profile",
    "Account Information": "Account Information",
    "Login History": "Login History",
    "Deactivate Account": "Deactivate Account",
    "Content for": "Content for",
    "will be displayed here.": "will be displayed here.",
    "Wholesale Orders": "Wholesale Orders"
  },
  KO: {
    "My Page": "마이페이지",
    "My Shopping": "나의 쇼핑 정보",
    "My Purchase": "구매 내역",
    "Shipping": "배송지 관리",
    "Purchase History": "주문/배송 조회",
    "Cart": "장바구니",
    "My Activities": "나의 활동",
    "Contact Us": "1:1 문의",
    "Reviews": "상품 후기",
    "My Profile": "나의 프로필",
    "Account Information": "회원 정보 수정",
    "Login History": "로그인 기록",
    "Deactivate Account": "회원 탈퇴",
    "Content for": "선택하신",
    "will be displayed here.": "메뉴의 콘텐츠가 여기에 표시됩니다.",
    "Wholesale Orders": "도매 주문 내역"
  },
  PT: {
    "My Page": "Minha Página",
    "My Shopping": "Minhas Compras",
    "My Purchase": "Minha Compra",
    "Shipping": "Envio",
    "Purchase History": "Histórico de Compras",
    "Cart": "Carrinho",
    "My Activities": "Minhas Atividades",
    "Contact Us": "Fale Conosco",
    "Reviews": "Avaliações",
    "My Profile": "Meu Perfil",
    "Account Information": "Informações da Conta",
    "Login History": "Histórico de Acesso",
    "Deactivate Account": "Desativar Conta",
    "Content for": "O conteúdo para",
    "will be displayed here.": "será exibido aqui.",
    "Wholesale Orders": "Pedidos de Atacado"
  },
  ES: {
    "My Page": "Mi Página",
    "My Shopping": "Mis Compras",
    "My Purchase": "Mi Compra",
    "Shipping": "Envío",
    "Purchase History": "Historial de Compras",
    "Cart": "Carrito",
    "My Activities": "Mis Actividades",
    "Contact Us": "Contáctenos",
    "Reviews": "Reseñas",
    "My Profile": "Mi Perfil",
    "Account Information": "Información de la Cuenta",
    "Login History": "Historial de Sesión",
    "Deactivate Account": "Desactivar Cuenta",
    "Content for": "El contenido de",
    "will be displayed here.": "se mostrará aquí.",
    "Wholesale Orders": "Pedidos de Mayoreo"
  },
  ZH: {
    "My Page": "个人中心",
    "My Shopping": "我的购物",
    "My Purchase": "我的购买",
    "Shipping": "配送管理",
    "Purchase History": "购买历史",
    "Cart": "购物车",
    "My Activities": "我的活动",
    "Contact Us": "联系我们",
    "Reviews": "我的评价",
    "My Profile": "我的账号",
    "Account Information": "账户信息",
    "Login History": "登录历史",
    "Deactivate Account": "注销账户",
    "Content for": "选择的",
    "will be displayed here.": "菜单内容将显示在此处。",
    "Wholesale Orders": "批发订单历史"
  },
  JA: {
    "My Page": "マイページ",
    "My Shopping": "マイショッピング",
    "My Purchase": "購入履歴",
    "Shipping": "配送状況",
    "Purchase History": "注文履歴",
    "Cart": "カート",
    "My Activities": "マイアクティビティ",
    "Contact Us": "お問い合わせ",
    "Reviews": "レビュー",
    "My Profile": "マイプロフィール",
    "Account Information": "会員정보변경",
    "Login History": "ログイン履歴",
    "Deactivate Account": "退会する",
    "Content for": "選択した",
    "will be displayed here.": "のコンテンツがここに表示されます。",
    "Wholesale Orders": "卸売注文履歴"
  }
};

export function MyPage() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userType = localStorage.getItem("userType") || "retail";
  const userEmail = localStorage.getItem("userEmail") || "";

  const [activeTab, setActiveTab] = useState(userType === "wholesale" ? "Wholesale Orders" : "Purchase History");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const d = (key: string) => {
    return TRANSLATED_TABS[language]?.[key] || key;
  };

  // Get orders and filter by logged-in B2B user
  const allOrders = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("globalOrders") || "[]");
    } catch {
      return [];
    }
  }, []);

  const wholesaleOrders = React.useMemo(() => {
    return allOrders.filter((order: any) => 
      order.customerEmail?.toLowerCase() === userEmail.toLowerCase() && 
      (order.id?.startsWith("WHL-") || order.status === "Pending Approval" || order.status === "Approved" || order.status === "Declined")
    );
  }, [allOrders, userEmail]);

  const retailOrders = React.useMemo(() => {
    return allOrders.filter((order: any) => 
      order.customerEmail?.toLowerCase() === userEmail.toLowerCase() && 
      !order.id?.startsWith("WHL-") && order.status !== "Pending Approval" && order.status !== "Approved" && order.status !== "Declined"
    );
  }, [allOrders, userEmail]);

  const sidebarMenus = [
    {
      title: "My Shopping",
      items: [
        ...(userType === "wholesale" ? ["Wholesale Orders"] : []),
        "My Purchase", 
        "Shipping", 
        "Purchase History", 
        "Cart"
      ],
    },
    {
      title: "My Activities",
      items: ["Contact Us", "Reviews"],
    },
    {
      title: "My Profile",
      items: ["Account Information", "Login History", "Deactivate Account"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "Declined":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case "Pending Approval":
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case "Delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "In Transit":
        return <Truck className="w-5 h-5 text-blue-500 animate-bounce" />;
      case "Processing":
      default:
        return <Package className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Declined":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "Pending Approval":
        return "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse";
      case "Delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "In Transit":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Processing":
      default:
        return "bg-orange-50 text-orange-700 border border-orange-200";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ID: ${text}`);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">{d("My Page")}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="glass p-6 rounded-2xl space-y-8">
              {sidebarMenus.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    {d(section.title)}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <button
                          onClick={() => setActiveTab(item)}
                          className={`text-sm w-full text-left py-1.5 px-2 rounded-md transition-colors ${
                            activeTab === item
                              ? "bg-primary-50 text-primary-900 font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {d(item)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="glass p-8 rounded-2xl min-h-[500px]">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">{d(activeTab)}</h2>
              
              {/* Wholesale Orders Tab Rendering */}
              {activeTab === "Wholesale Orders" && userType === "wholesale" && (
                <div className="space-y-6">
                  {wholesaleOrders.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50/50">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">No Wholesale Orders Yet</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                        Submit a bulk order or request pricing details through our dedicated B2B order panel.
                      </p>
                      <Link to="/wholesale">
                        <Badge className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 cursor-pointer text-sm gap-2 rounded-xl">
                          Open Wholesale Form <ArrowRight className="w-4 h-4" />
                        </Badge>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {wholesaleOrders.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                          
                          {/* Card Header */}
                          <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1 text-sm">
                              <div>
                                <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Date Submitted</h4>
                                <p className="text-gray-900 font-medium">{order.date}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Calculated Total</h4>
                                <p className="text-primary-800 font-bold text-base">{formatPrice(order.total)}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-1 sm:text-right">
                                <h4 className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Wholesale ID</h4>
                                <div className="flex items-center sm:justify-end gap-1.5">
                                  <span className="font-mono text-gray-900 font-bold">{order.id}</span>
                                  <button onClick={() => copyToClipboard(order.id)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6">
                            
                            {/* Status Indicator */}
                            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6 gap-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                                  {getStatusIcon(order.status)}
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Approval Status</div>
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans mt-0.5 ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>

                              <button 
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                className="flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900 transition-colors px-4 py-2 hover:bg-primary-50 rounded-xl"
                              >
                                {expandedOrderId === order.id ? (
                                  <>Hide Items <ChevronUp className="w-4 h-4" /></>
                                ) : (
                                  <>View Items ({order.items?.length || 0}) <ChevronDown className="w-4 h-4" /></>
                                )}
                              </button>
                            </div>

                            {/* Status Alert/Help Content */}
                            <div className={`p-4 rounded-xl flex gap-3 text-xs leading-relaxed border ${
                              order.status === "Pending Approval" ? "bg-amber-50/50 border-amber-200 text-amber-800" :
                              order.status === "Approved" ? "bg-emerald-50/50 border-emerald-200 text-emerald-800" :
                              order.status === "Declined" ? "bg-rose-50/50 border-rose-200 text-rose-800" :
                              "bg-primary-50/50 border-primary-200 text-primary-800"
                            }`}>
                              {order.status === "Pending Approval" && (
                                <>
                                  <Clock className="w-4 h-4 shrink-0 text-amber-500" />
                                  <p>
                                    Your order request is currently undergoing review by the CLICOS B2B approval department. Email updates will be dispatched to <strong>info@clicos.co.kr</strong> and your work contact details shortly.
                                  </p>
                                </>
                              )}
                              {order.status === "Approved" && (
                                <>
                                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                                  <p>
                                    <strong>Congratulations!</strong> This wholesale order inquiry has been officially approved. Our distribution warehouse in Seoul has begun scheduling dispatch. You will receive tracking numbers shortly.
                                  </p>
                                </>
                              )}
                              {order.status === "Declined" && (
                                <>
                                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                                  <p>
                                    This wholesale order could not be approved at this time. Common reasons include catalog modifications, country distribution constraints, or inventory levels. Please contact support.
                                  </p>
                                </>
                              )}
                              {["Processing", "In Transit", "Delivered"].includes(order.status) && (
                                <>
                                  <Package className="w-4 h-4 shrink-0 text-primary-500" />
                                  <p>
                                    This approved wholesale order is currently in its operational shipping phase: <strong>{order.status}</strong>. Please check your tracking timeline or contact your B2B account specialist for questions.
                                  </p>
                                </>
                              )}
                            </div>

                            {/* Expanded Item Details */}
                            {expandedOrderId === order.id && order.items && (
                              <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in origin-top">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Ordered Wholesale Items</h4>
                                <ul className="divide-y divide-gray-100 bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
                                  {order.items.map((item: any, idx: number) => (
                                    <li key={idx} className="p-4 flex justify-between items-center text-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-400">
                                          B2B
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 leading-tight">{item.name}</p>
                                          <p className="text-[10px] text-gray-500 mt-0.5">Wholesale Unit Price: {formatPrice(item.price)}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                                        <p className="text-[10px] text-gray-500">Qty: {item.qty} units</p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Purchase History Tab */}
              {activeTab === "Purchase History" && (
                <div className="space-y-6">
                  {retailOrders.length === 0 ? (
                    <div className="text-gray-500 flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl">
                      <p>{d("Content for")} "{d(activeTab)}" {d("will be displayed here.")}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {retailOrders.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <span className="font-mono text-gray-500 text-xs">#{order.id}</span>
                              <h4 className="font-bold text-gray-900 text-sm mt-0.5">{order.date}</h4>
                            </div>
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="text-gray-500">Items: {order.items?.length || 0}</span>
                            <span className="text-gray-900">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Standard Placeholder Tab Rendering */}
              {activeTab !== "Wholesale Orders" && activeTab !== "Purchase History" && (
                <div className="text-gray-500 flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl">
                  <p>
                    {language === "KO" 
                      ? `${d("Content for")} "${d(activeTab)}" ${d("will be displayed here.")}` 
                      : `${d("Content for")} "${d(activeTab)}" ${d("will be displayed here.")}`}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
