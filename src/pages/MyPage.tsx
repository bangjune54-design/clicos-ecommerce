import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

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
    "will be displayed here.": "will be displayed here."
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
    "will be displayed here.": "메뉴의 콘텐츠가 여기에 표시됩니다."
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
    "will be displayed here.": "será exibido aqui."
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
    "will be displayed here.": "se mostrará aquí."
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
    "will be displayed here.": "菜单内容将显示在此处。"
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
    "Account Information": "会員情報変更",
    "Login History": "ログイン履歴",
    "Deactivate Account": "退会する",
    "Content for": "選択した",
    "will be displayed here.": "のコンテンツがここに表示されます。"
  }
};

export function MyPage() {
  const [activeTab, setActiveTab] = useState("Purchase History");
  const { language } = useLanguage();

  const d = (key: string) => {
    return TRANSLATED_TABS[language]?.[key] || key;
  };

  const sidebarMenus = [
    {
      title: "My Shopping",
      items: ["My Purchase", "Shipping", "Purchase History", "Cart"],
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
              <div className="text-gray-500 flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl">
                <p>
                  {language === "KO" 
                    ? `${d("Content for")} "${d(activeTab)}" ${d("will be displayed here.")}` 
                    : `${d("Content for")} "${d(activeTab)}" ${d("will be displayed here.")}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
