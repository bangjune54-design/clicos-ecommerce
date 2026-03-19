import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-primary-800 text-primary-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
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
            <div className="flex space-x-6">
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" aria-hidden="true" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" aria-hidden="true" />
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
