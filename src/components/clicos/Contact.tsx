import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Send, Facebook, Instagram, Twitter } from "lucide-react";
import { sendAdminNotification } from "../../utils/email";

export function Contact() {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple Validation
    let hasError = false;
    const newErrors = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // TODO: Connect this frontend form submission with your production backend/email delivery API (e.g. Resend, EmailJS, NodeMailer).
    // Currently, we use the local simulated email notifier that logs details to the console and generates a UI Toast.
    sendAdminNotification(`CLICOS Contact Inquiry: From ${formData.name} (${formData.company || "Individual"})`, {
      name: formData.name,
      email: formData.email,
      company: formData.company || "Not provided",
      message: formData.message,
      submittedAt: new Date().toISOString()
    });

    setSuccess(true);
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
            Get In Touch
          </span>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
            Let's Expand Your Business
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 font-medium">
            Ready to partner with us or request bulk pricing catalog? Submit an inquiry and our export team will contact you within 24 hours.
          </p>
        </div>

        {/* Content Box */}
        <div className="mx-auto max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Contact info (5 Cols) */}
          <div className="md:col-span-5 bg-primary-900 px-8 py-12 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold tracking-wide mb-2 text-accent">
                CLICOS
              </h3>
              <p className="text-xs text-primary-200 font-medium leading-relaxed mb-10">
                Premium Korean cosmetics & hair care export and supply chains globally.
              </p>

              {/* Detail Items */}
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-primary-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary-300">
                      Headquarters
                    </h4>
                    <p className="mt-1 text-sm font-medium text-primary-100 leading-normal">
                      20, Dongjak-daero 11-gil, Dongjak-gu, Seoul, 07014 Republic of Korea
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-primary-200">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary-300">
                      Inquiries Email
                    </h4>
                    <p className="mt-1 text-sm font-medium text-primary-100 leading-normal">
                      info@clicos.co.kr<br />
                      wholesale@clicos.co.kr
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-primary-200">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary-300">
                      Direct Support
                    </h4>
                    <p className="mt-1 text-sm font-medium text-primary-100 leading-normal">
                      +82 010-3734-1492<br />
                      <span className="text-[10px] text-primary-300 font-medium">Mon - Fri: 9am - 6pm KST</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-12 pt-8 border-t border-white/15 flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary-200 hover:text-white hover:bg-white/20 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary-200 hover:text-white hover:bg-white/20 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary-200 hover:text-white hover:bg-white/20 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Form (7 Cols) */}
          <div className="md:col-span-7 px-8 py-12 flex flex-col justify-center bg-white">
            {success ? (
              <div className="text-center py-10 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">
                  Message Transmitted!
                </h3>
                <p className="text-sm text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
                  Thank you for reaching out. We have logged your request. Our export and supply team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-900 border border-primary-200 bg-transparent rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
                      errors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Your organization (B2B/B2C)"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 resize-none ${
                      errors.message
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    placeholder="Please specify which product categories or brands you are interested in..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-800 hover:bg-primary-900 text-white font-semibold py-3.5 text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Send Inquiry
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
