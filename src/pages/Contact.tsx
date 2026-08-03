import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useLanguage } from "../contexts/LanguageContext";

const TRANSLATED_TEXT: Record<string, Record<string, string>> = {
  EN: {
    "Contact Us": "Contact Us",
    "Contact Subtitle": "Have questions about an order, wholesale inquiry, or specific brands? We're here to help.",
    "Get in Touch": "Get in Touch",
    "Seoul Headquarters": "Seoul Headquarters",
    "Email Us": "Email Us",
    "Call Us": "Call Us",
    "Message Sent!": "Message Sent!",
    "Message Sent Desc": "Your message has been sent successfully.",
    "Send Another Message": "Send Another Message",
    "First name": "First name",
    "Last name": "Last name",
    "Customer Type": "Customer Type (B2B/B2C)",
    "Select Type": "Select B2B or B2C",
    "B2B Option": "B2B (Wholesale / Business)",
    "B2C Option": "B2C (Retail / Individual)",
    "Email": "Email",
    "Country": "Country",
    "Select Country": "Select your country",
    "Specify Country": "Please specify your country",
    "Subject": "Subject",
    "Message": "Message",
    "Sending...": "Sending...",
    "Send Message": "Send Message",
    "Validation Error 1": "First name and Last name are required.",
    "Validation Error 2": "Email address is required.",
    "Validation Error 3": "Please enter a valid email address.",
    "Validation Error 4": "Message is required.",
    "Mon-Fri": "Mon-Fri 9am-6pm KST",
    "Retail": "Retail",
    "B2B Sales": "B2B Sales",
    "US": "United States",
    "CA": "Canada",
    "KR": "South Korea",
    "JP": "Japan",
    "CN": "China",
    "UK": "United Kingdom",
    "DE": "Germany",
    "FR": "France",
    "IT": "Italy",
    "AU": "Australia",
    "OTHER": "Other...",
    "Order Inquiry": "Order Inquiry (Retail)",
    "Wholesale/B2B": "Wholesale/B2B (New)",
    "Brand Partnership": "Brand Partnership",
    "General Support": "General Support"
  },
  KO: {
    "Contact Us": "문의하기",
    "Contact Subtitle": "주문 문의, 도매 관련 질문 또는 특정 브랜드에 대해 궁금한 점이 있으신가요? 기꺼이 도와드리겠습니다.",
    "Get in Touch": "연락처",
    "Seoul Headquarters": "서울 본사",
    "Email Us": "이메일 문의",
    "Call Us": "전화 문의",
    "Message Sent!": "메시지 전송 완료!",
    "Message Sent Desc": "메시지가 성공적으로 전송되었습니다.",
    "Send Another Message": "추가 메시지 보내기",
    "First name": "이름",
    "Last name": "성",
    "Customer Type": "고객 유형 (B2B/B2C)",
    "Select Type": "B2B 또는 B2C 선택",
    "B2B Option": "B2B (도매 / 기업 고객)",
    "B2C Option": "B2C (소매 / 개인 고객)",
    "Email": "이메일",
    "Country": "국가",
    "Select Country": "국가 선택",
    "Specify Country": "국가를 입력해 주세요",
    "Subject": "제목",
    "Message": "내용",
    "Sending...": "전송 중...",
    "Send Message": "메시지 보내기",
    "Validation Error 1": "이름과 성은 필수 항목입니다.",
    "Validation Error 2": "이메일 주소는 필수 항목입니다.",
    "Validation Error 3": "올바른 이메일 주소를 입력하세요.",
    "Validation Error 4": "메시지 내용은 필수 항목입니다.",
    "Mon-Fri": "월-금 오전 9시 - 오후 6시 (한국 표준시)",
    "Retail": "소매 고객",
    "B2B Sales": "도매/B2B 고객",
    "US": "미국",
    "CA": "캐나다",
    "KR": "대한민국",
    "JP": "일본",
    "CN": "중국",
    "UK": "영국",
    "DE": "독일",
    "FR": "프랑스",
    "IT": "이탈リア",
    "AU": "호주",
    "OTHER": "기타...",
    "Order Inquiry": "주문 관련 문의 (소매)",
    "Wholesale/B2B": "도매/B2B 입점 문의 (신규)",
    "Brand Partnership": "브랜드 제휴 문의",
    "General Support": "일반 문의 사항"
  },
  PT: {
    "Contact Us": "Fale Conosco",
    "Contact Subtitle": "Tem perguntas sobre um pedido, consultas de atacado ou marcas específicas? Estamos aqui para ajudar.",
    "Get in Touch": "Entre em Contato",
    "Seoul Headquarters": "Sede em Seul",
    "Email Us": "Envie-nos um E-mail",
    "Call Us": "Ligue para Nós",
    "Message Sent!": "Mensagem Enviada!",
    "Message Sent Desc": "Sua mensagem foi enviada com sucesso.",
    "Send Another Message": "Enviar Outra Mensagem",
    "First name": "Primeiro nome",
    "Last name": "Sobrenome",
    "Customer Type": "Tipo de Cliente (B2B/B2C)",
    "Select Type": "Selecione B2B ou B2C",
    "B2B Option": "B2B (Atacado / Empresa)",
    "B2C Option": "B2C (Varejo / Individual)",
    "Email": "E-mail",
    "Country": "País",
    "Select Country": "Selecione seu país",
    "Specify Country": "Por favor, especifique seu país",
    "Subject": "Assunto",
    "Message": "Mensagem",
    "Sending...": "Enviando...",
    "Send Message": "Enviar Mensagem",
    "Validation Error 1": "Nome e sobrenome são obrigatórios.",
    "Validation Error 2": "O endereço de e-mail é obrigatório.",
    "Validation Error 3": "Por favor, insira um e-mail válido.",
    "Validation Error 4": "A mensagem é obrigatória.",
    "Mon-Fri": "Seg-Sex das 9h às 18h KST",
    "Retail": "Varejo",
    "B2B Sales": "Vendas B2B",
    "US": "Estados Unidos",
    "CA": "Canadá",
    "KR": "Coreia do Sul",
    "JP": "Japão",
    "CN": "China",
    "UK": "Reino Unido",
    "DE": "Alemanha",
    "FR": "França",
    "IT": "Itália",
    "AU": "Austrália",
    "OTHER": "Outro...",
    "Order Inquiry": "Consulta de Pedidos (Varejo)",
    "Wholesale/B2B": "Atacado/B2B (Novo)",
    "Brand Partnership": "Parceria de Marcas",
    "General Support": "Suporte Geral"
  },
  ES: {
    "Contact Us": "Contáctenos",
    "Contact Subtitle": "¿Tiene preguntas sobre un pedido, una consulta de mayoreo o marcas específicas? Estamos aquí para ayudarle.",
    "Get in Touch": "Ponerse en Contacto",
    "Seoul Headquarters": "Sede en Seúl",
    "Email Us": "Envíenos un Correo",
    "Call Us": "Llámenos",
    "Message Sent!": "¡Mensaje Enviado!",
    "Message Sent Desc": "Su mensaje ha sido enviado con éxito.",
    "Send Another Message": "Enviar Otro Mensaje",
    "First name": "Nombre",
    "Last name": "Apellido",
    "Customer Type": "Tipo de Cliente (B2B/B2C)",
    "Select Type": "Seleccione B2B o B2C",
    "B2B Option": "B2B (Venta al por mayor / Empresa)",
    "B2C Option": "B2C (Venta al por menor / Individual)",
    "Email": "Correo electrónico",
    "Country": "País",
    "Select Country": "Seleccione su país",
    "Specify Country": "Por favor especifique su país",
    "Subject": "Asunto",
    "Message": "Mensaje",
    "Sending...": "Enviando...",
    "Send Message": "Enviar Mensaje",
    "Validation Error 1": "El nombre y el apellido son obligatorios.",
    "Validation Error 2": "El correo electrónico es obligatorio.",
    "Validation Error 3": "Por favor, introduzca un correo electrónico válido.",
    "Validation Error 4": "El mensaje es obligatorio.",
    "Mon-Fri": "Lun-Vie 9am-6pm KST",
    "Retail": "Venta al por menor",
    "B2B Sales": "Ventas B2B",
    "US": "Estados Unidos",
    "CA": "Canadá",
    "KR": "Corea del Sur",
    "JP": "Japón",
    "CN": "China",
    "UK": "Reino Unido",
    "DE": "Alemania",
    "FR": "Francia",
    "IT": "Italia",
    "AU": "Australia",
    "OTHER": "Otro...",
    "Order Inquiry": "Consulta de Pedido (Minorista)",
    "Wholesale/B2B": "Mayoreo/B2B (Nuevo)",
    "Brand Partnership": "Asociación de Marca",
    "General Support": "Soporte General"
  },
  ZH: {
    "Contact Us": "联系我们",
    "Contact Subtitle": "对订单、批发咨询或特定品牌有任何疑问吗？我们随时为您提供帮助。",
    "Get in Touch": "联系方式",
    "Seoul Headquarters": "首尔总部",
    "Email Us": "发送邮件",
    "Call Us": "电话联系",
    "Message Sent!": "消息已发送！",
    "Message Sent Desc": "您的消息已成功发送。",
    "Send Another Message": "发送另一条消息",
    "First name": "名字",
    "Last name": "姓氏",
    "Customer Type": "客户类型 (B2B/B2C)",
    "Select Type": "选择 B2B 或 B2C",
    "B2B Option": "B2B (批发 / 企业)",
    "B2C Option": "B2C (零售 / 个人)",
    "Email": "电子邮箱",
    "Country": "国家/地区",
    "Select Country": "选择您的国家/地区",
    "Specify Country": "请指定您的国家",
    "Subject": "主题",
    "Message": "消息内容",
    "Sending...": "正在发送...",
    "Send Message": "发送消息",
    "Validation Error 1": "名字和姓氏均为必填项。",
    "Validation Error 2": "电子邮箱为必填项。",
    "Validation Error 3": "请输入有效的电子邮箱地址。",
    "Validation Error 4": "消息内容为必填项。",
    "Mon-Fri": "周一至周五 上午9点至下午6点 (韩国时间)",
    "Retail": "零售商",
    "B2B Sales": "B2B 批发业务",
    "US": "美国",
    "CA": "加拿大",
    "KR": "韩国",
    "JP": "日本",
    "CN": "中国",
    "UK": "英国",
    "DE": "德国",
    "FR": "法国",
    "IT": "意大利",
    "AU": "澳大利亚",
    "OTHER": "其他国家...",
    "Order Inquiry": "订单咨询 (零售)",
    "Wholesale/B2B": "批发合作 (新客户)",
    "Brand Partnership": "品牌合作联络",
    "General Support": "通用客户支持"
  },
  JA: {
    "Contact Us": "お問い合わせ",
    "Contact Subtitle": "ご注文、卸売に関するお問い合わせ、特定のブランドについてご質問はございますか？お気軽にお問い合わせください。",
    "Get in Touch": "連絡先",
    "Seoul Headquarters": "ソウル本社",
    "Email Us": "メールでのお問い合わせ",
    "Call Us": "お電話でのお問い合わせ",
    "Message Sent!": "送信完了！",
    "Message Sent Desc": "メッセージは正常に送信されました。",
    "Send Another Message": "別のメッセージを送信",
    "First name": "名",
    "Last name": "姓",
    "Customer Type": "お客様タイプ (B2B/B2C)",
    "Select Type": "B2BまたはB2Cを選択",
    "B2B Option": "B2B (卸売 / 法人のお客様)",
    "B2C Option": "B2C (小売 / 個人のお客様)",
    "Email": "メールアドレス",
    "Country": "国",
    "Select Country": "国を選択してください",
    "Specify Country": "国名を指定してください",
    "Subject": "件名",
    "Message": "メッセージ内容",
    "Sending...": "送信中...",
    "Send Message": "メッセージを送信",
    "Validation Error 1": "お名前（姓・名）は必須です。",
    "Validation Error 2": "メールアドレスは必須です。",
    "Validation Error 3": "有効なメールアドレスを入力してください。",
    "Validation Error 4": "メッセージ内容は必須です。",
    "Mon-Fri": "月-金 9:00-18:00 (韓国時間)",
    "Retail": "一般小売り",
    "B2B Sales": "卸売/B2B営業部",
    "US": "アメリカ合衆国",
    "CA": "カナダ",
    "KR": "大韓民国",
    "JP": "日本",
    "CN": "中華人民共和国",
    "UK": "イギリス",
    "DE": "ドイツ",
    "FR": "フランス",
    "IT": "イタリア",
    "AU": "オーストラリア",
    "OTHER": "その他...",
    "Order Inquiry": "ご注文についてのお問い合わせ (小売)",
    "Wholesale/B2B": "卸売/B2Bのご相談 (新規)",
    "Brand Partnership": "ブランドパートナーシップ",
    "General Support": "カスタマーサポート"
  }
};

export function Contact() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { language } = useLanguage();

  const d = (key: string) => {
    return TRANSLATED_TEXT[language]?.[key] || key;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get("first-name") as string || "").trim();
    const lastName = (formData.get("last-name") as string || "").trim();
    const name = `${firstName} ${lastName}`.trim();
    const email = (formData.get("email") as string || "").trim();
    const message = (formData.get("message") as string || "").trim();
    const customerType = formData.get("customer-type") as string || "";
    const country = formData.get("country") as string || "";
    const manualCountry = formData.get("manual-country") as string || "";
    const subject = formData.get("subject") as string || "";

    // Frontend validations
    if (!name) {
      setErrorMsg(d("Validation Error 1"));
      return;
    }
    if (!email) {
      setErrorMsg(d("Validation Error 2"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(d("Validation Error 3"));
      return;
    }
    if (!message) {
      setErrorMsg(d("Validation Error 4"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          message,
          customerType,
          country: country === "OTHER" ? manualCountry : country,
          subject
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const resData = await response.json().catch(() => ({}));
        setErrorMsg(resData.message || "Something went wrong. Please try again later.");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">{d("Contact Us")}</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            {d("Contact Subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="bg-primary-50 p-10 rounded-3xl border border-primary-100">
              <h3 className="text-2xl font-bold text-gray-900 font-serif mb-8">{d("Get in Touch")}</h3>
              
              <div className="space-y-8">
                <div className="flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <MapPin className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-7 text-gray-900">{d("Headquarters")}</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      AV BRIGADEIRO FARIA LIMA 1811 CONJ 115 CXPST 11248
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <Mail className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-7 text-gray-900">{d("Email Us")}</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {d("Retail")}: info@clicos.com<br />
                      {d("B2B Sales")}: wholesale@clicos.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <Phone className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-7 text-gray-900">{d("Call Us")}</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      +55 (11) 94512-2703<br />
                      {d("Mon-Fri")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            {success ? (
              <div className="bg-green-50 text-green-800 p-8 py-16 rounded-3xl flex flex-col items-center justify-center text-center border border-green-200 h-full animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold font-serif mb-4">{d("Message Sent!")}</h3>
                <p className="text-green-700 max-w-sm mb-8">{d("Message Sent Desc")}</p>
                <Button onClick={() => { setSuccess(false); setErrorMsg(""); }} variant="outline" className="border-green-300 text-green-800 hover:bg-green-100">{d("Send Another Message")}</Button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("First name")}
                  </label>
                  <Input id="first-name" name="first-name" type="text" required />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("Last name")}
                  </label>
                  <Input id="last-name" name="last-name" type="text" required />
                </div>
              </div>

              <div>
                <label htmlFor="customer-type" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  {d("Customer Type")}
                </label>
                <select
                  id="customer-type"
                  name="customer-type"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent border border-gray-300"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>{d("Select Type")}</option>
                  <option value="B2B">{d("B2B Option")}</option>
                  <option value="B2C">{d("B2C Option")}</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  {d("Email")}
                </label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  {d("Country")}
                </label>
                <select
                  id="country"
                  name="country"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent border border-gray-300"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  required
                >
                  <option value="" disabled>{d("Select Country")}</option>
                  <option value="US">{d("US")}</option>
                  <option value="CA">{d("CA")}</option>
                  <option value="KR">{d("KR")}</option>
                  <option value="JP">{d("JP")}</option>
                  <option value="CN">{d("CN")}</option>
                  <option value="UK">{d("UK")}</option>
                  <option value="DE">{d("DE")}</option>
                  <option value="FR">{d("FR")}</option>
                  <option value="IT">{d("IT")}</option>
                  <option value="AU">{d("AU")}</option>
                  <option value="OTHER">{d("OTHER")}</option>
                </select>
              </div>

              {selectedCountry === "OTHER" && (
                <div className="animate-fade-in">
                  <label htmlFor="manual-country" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {d("Specify Country")}
                  </label>
                  <Input id="manual-country" name="manual-country" type="text" required autoFocus />
                </div>
              )}

              <div>
                <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  {d("Subject")}
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent border border-gray-300"
                >
                  <option>{d("Order Inquiry")}</option>
                  <option>{d("Wholesale/B2B")}</option>
                  <option>{d("Brand Partnership")}</option>
                  <option>{d("General Support")}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  {d("Message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent resize-none animate-fade-in"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? d("Sending...") : d("Send Message")}
              </Button>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
