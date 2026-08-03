import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-primary-800 text-primary-50">
      <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                CLICOS
              </span>
            </Link>
            <p className="text-sm leading-6 text-primary-200">
              Exporting premium Korean cosmetics and hair care products globally. Trusted by retail customers and international distributors alike.
            </p>
            <div className="flex space-x-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary-300 hover:text-white transition-colors" title="Instagram">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-primary-300 hover:text-white transition-colors" title="TikTok">
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.92a6.43 6.43 0 0 0-5.34 2.65 6.43 6.43 0 0 0 4.67 10.43 6.43 6.43 0 0 0 6.43-6.43V9.3a8.16 8.16 0 0 0 4.35 1.25V7.1a4.85 4.85 0 0 1-1.07-.41z"/>
                </svg>
              </a>
              <a href="https://wa.me/5511945122703" target="_blank" rel="noreferrer" className="text-primary-300 hover:text-white transition-colors" title="WhatsApp">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">
                  Shop
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  <li>
                    <Link to="/shop?category=skincare" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Skincare
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=haircare" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Hair Care
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=styling" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Styling Tools
                    </Link>
                  </li>
                  <li>
                    <Link to="/brands" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      All Brands
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">
                  Partners
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  <li>
                    <Link to="/wholesale" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Wholesale Inquiry
                    </Link>
                  </li>
                  <li>
                    <Link to="/wholesale" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      B2B Portal Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Our Sourcing
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  <li>
                    <Link to="/about" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm leading-6 text-primary-200 hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">
                  Newsletter
                </h3>
                <p className="mt-6 text-sm leading-6 text-primary-200">
                  Subscribe to get updates on new products and K-beauty trends.
                </p>
                <form className="mt-4 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/10 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-primary-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:w-64 sm:text-sm sm:leading-6 transition-all"
                    placeholder="Enter your email"
                  />
                  <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-primary-300">
            &copy; {new Date().getFullYear()} CLICOS, Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-primary-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
