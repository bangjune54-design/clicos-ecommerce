import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useCurrency } from "../contexts/CurrencyContext";
import { ArrowLeft, CheckCircle2, CreditCard, Wallet, X } from "lucide-react";

export function Checkout() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'payoneer'>('card');
  const [adminSettings] = useState(() => JSON.parse(localStorage.getItem('adminBankSettings') || '{}'));
  const [email, setEmail] = useState('');
  const [showRetailError, setShowRetailError] = useState(false);
  
  const [retailItems, setRetailItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('retailCart') || '[]');
  });
  const [b2bItems, setB2BItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('b2bCart') || '[]');
  });

  const userType = localStorage.getItem("userType") || "retail";

  const retailTotal = userType !== "wholesale" 
    ? retailItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;
  
  const b2bTotal = userType === "wholesale" 
    ? b2bItems.reduce((acc, item) => acc + item.price * (item.boxQty * item.inboxQty), 0)
    : 0;

  const orderTotal = retailTotal + b2bTotal;

  useEffect(() => {
    if (orderTotal === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [orderTotal, navigate, orderComplete]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType !== "wholesale") {
      setShowRetailError(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call and payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      
      // Simulate sending email
      console.log(`[SIMULATION] Email sent to ${email}: Thank you for your order! We will get back to you as soon as possible.`);
      
      // Clear cart
      if (userType !== "wholesale") {
        localStorage.removeItem('retailCart');
      } else {
        localStorage.removeItem('b2bCart');
      }
      window.dispatchEvent(new Event("storage"));
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-16 flex items-center justify-center">
        <div className="bg-white p-10 py-16 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center mx-4">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for your order! We will contact you in 1-2 business days with further details. 
            An email summary has been sent to <span className="font-bold text-gray-900">{email}</span>.
          </p>
          <Button onClick={() => navigate('/shop')} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (showRetailError) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-16 flex items-center justify-center">
        <div className="bg-white p-10 py-16 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center mx-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Action Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            You cannot request a wholesale order with a retail account. Only approved wholesale partners can submit order requests.
          </p>
          <div className="space-y-4">
            <Button onClick={() => navigate('/wholesale')} className="w-full">
              Create Wholesale Account
            </Button>
            <button 
              onClick={() => setShowRetailError(false)} 
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Go back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/cart')} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </button>

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Shipping Address */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 pb-4 border-b border-gray-100">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">First Name</label>
                    <Input required placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Last Name</label>
                    <Input required placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Email Address</label>
                    <Input 
                      type="email" 
                      required 
                      placeholder="jane.doe@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Address line 1</label>
                    <Input required placeholder="123 Shopping Avenue" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">City</label>
                    <Input required placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">State / Province</label>
                    <Input required placeholder="NY" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Zip / Postal code</label>
                    <Input required placeholder="10001" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Country</label>
                    <select className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                      <option>United States</option>
                      <option>South Korea</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment Details */}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold font-serif text-gray-900">Payment Information</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')} className="text-primary-600 focus:ring-primary-600 w-4 h-4 cursor-pointer" 
                    />
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className="font-semibold text-gray-900">Bank Card</span>
                  </label>
                  <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'payoneer' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" name="paymentMethod" value="payoneer" checked={paymentMethod === 'payoneer'} 
                      onChange={() => setPaymentMethod('payoneer')} className="text-primary-600 focus:ring-primary-600 w-4 h-4 cursor-pointer" 
                    />
                    <Wallet className={`w-5 h-5 ${paymentMethod === 'payoneer' ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className="font-semibold text-gray-900">Payoneer Transfer</span>
                  </label>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Card Number</label>
                      <Input required placeholder="0000 0000 0000 0000" maxLength={19} pattern="[0-9\s]{13,19}" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900">Expiration Date (MM/YY)</label>
                        <Input required placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-900">CVC</label>
                        <Input required placeholder="123" maxLength={4} pattern="[0-9]{3,4}" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Name on Card</label>
                      <Input required placeholder="JANE DOE" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 flex items-start gap-4">
                      <div className="bg-white p-2 rounded-lg shrink-0">
                        <Wallet className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-primary-900 mb-1">Send the <strong className="font-bold">Total Amount</strong> via Payoneer to:</p>
                        <p className="text-lg font-bold font-mono text-primary-800 tracking-tight">
                          {adminSettings?.payoneerEmail || 'payments@clicos.co.kr'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-900">Your Payoneer Email Address</label>
                      <Input required type="email" placeholder="example@business.com" />
                      <p className="text-xs text-gray-500 mt-2">We will use this email to verify that your payment was received.</p>
                    </div>
                  </div>
                )}
              </section>
            </form>
          </div>

          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8 sticky top-24">
              <h2 className="text-lg font-bold font-serif text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <ul className="divide-y divide-gray-100 mb-6">
                {(userType === "wholesale" ? b2bItems : retailItems).map((item) => (
                  <li key={item.id} className="py-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 flex-1 pr-4">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover border border-gray-200" />
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {userType === "wholesale" ? item.boxQty : item.quantity}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-2">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(
                        userType === "wholesale" 
                          ? item.price * (item.boxQty * item.inboxQty) 
                          : item.price * item.quantity
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between items-center">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-gray-900">{formatPrice(orderTotal)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-gray-900">Free</dd>
                </div>
              </dl>

              <div className="border-t border-gray-100 pt-6 mb-8 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold font-serif text-primary-900">{formatPrice(orderTotal)}</span>
              </div>

              <Button form="checkout-form" type="submit" disabled={isSubmitting} className="w-full text-lg py-4">
                {isSubmitting ? "Processing Payment..." : `Pay ${formatPrice(orderTotal)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
