import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Contact() {
  const [selectedCountry, setSelectedCountry] = useState("");
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">Contact Us</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Have questions about an order, wholesale inquiry, or specific brands? We're here to help.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="bg-primary-50 p-10 rounded-3xl border border-primary-100">
              <h3 className="text-2xl font-bold text-gray-900 font-serif mb-8">Get in Touch</h3>
              
              <div className="space-y-8">
                <div className="flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <MapPin className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-7 text-gray-900">Seoul Headquarters</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      20, Dongjak-daero 11-gil<br />
                      Dongjak-gu, Seoul<br />
                      07014 Republic of Korea
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <Mail className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-7 text-gray-900">Email Us</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Retail: info@clicos.com<br />
                      B2B Sales: wholesale@clicos.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <Phone className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold leading-7 text-gray-900">Call Us</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      +82 010-3734-1492<br />
                      Mon-Fri 9am-6pm KST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form action="#" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    First name
                  </label>
                  <Input id="first-name" name="first-name" type="text" required />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Last name
                  </label>
                  <Input id="last-name" name="last-name" type="text" required />
                </div>
              </div>

              <div>
                <label htmlFor="customer-type" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Customer Type (B2B/B2C)
                </label>
                <select
                  id="customer-type"
                  name="customer-type"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select B2B or B2C</option>
                  <option value="B2B">B2B (Wholesale / Business)</option>
                  <option value="B2C">B2C (Retail / Individual)</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Email
                </label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="KR">South Korea</option>
                  <option value="JP">Japan</option>
                  <option value="CN">China</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="AU">Australia</option>
                  <option value="OTHER">Other...</option>
                </select>
              </div>

              {selectedCountry === "OTHER" && (
                <div className="animate-fade-in">
                  <label htmlFor="manual-country" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Please specify your country
                  </label>
                  <Input id="manual-country" name="manual-country" type="text" required autoFocus />
                </div>
              )}

              <div>
                <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent"
                >
                  <option>Order Inquiry (Retail)</option>
                  <option>Wholesale/B2B (New)</option>
                  <option>Brand Partnership</option>
                  <option>General Support</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 bg-transparent resize-none"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
