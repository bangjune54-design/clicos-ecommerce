import React from "react";

export function About() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-serif">
            Bringing Seoul to the <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-primary-800 to-accent">World</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Founded in the heart of South Korea, CLICOS is a premier exporter of authentic Korean cosmetics and hair care products to retail and wholesale customers globally.
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
              alt="Seoul cityscape"
              className="rounded-3xl shadow-xl border border-primary-100"
            />
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 font-serif mb-4">Our Sourcing Philosophy</h3>
              <p className="text-gray-600 leading-relaxed">
                The K-Beauty market moves fast. We stay ahead of the curve by partnering directly with leading laboratories, indie brands, and established names in Seoul. We carefully curate our selection, ensuring every product we export meets rigorous quality standards, is 100% authentic, and reflects the true innovation of Korean skincare and hair care.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-4xl font-bold text-primary-900 font-serif mb-2">50+</div>
                <div className="text-sm font-semibold text-gray-900">Countries Served</div>
                <div className="mt-1 text-sm text-gray-500">Shipping K-Beauty worldwide.</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-900 font-serif mb-2">100%</div>
                <div className="text-sm font-semibold text-gray-900">Authenticity Guarantee</div>
                <div className="mt-1 text-sm text-gray-500">Direct from manufacturers.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-primary-900 py-24 sm:py-32 mt-16 text-primary-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-serif">
              Our Core Values
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-200">
              We believe in building long-term relationships with our customers and retail partners based on trust, quality, and mutual success.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-xl font-semibold leading-7 text-white font-serif">
                  Trust & Authenticity
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary-200">
                  <p className="flex-auto">In a market flooded with counterfeits, we provide a reliable channel for 100% genuine products sourced directly from Korea.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-semibold leading-7 text-white font-serif">
                  Innovation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary-200">
                  <p className="flex-auto">We constantly monitor the latest trends in Seoul, bringing you the newest formulations and groundbreaking beauty technologies first.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-semibold leading-7 text-white font-serif">
                  Global Partnership
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary-200">
                  <p className="flex-auto">We don't just sell products; we help our B2B partners grow by providing marketing support, competitive margins, and reliable supply chains.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
