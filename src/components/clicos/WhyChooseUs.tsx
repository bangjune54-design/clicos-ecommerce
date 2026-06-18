import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake, Compass } from "lucide-react";

export function WhyChooseUs() {
  const cards = [
    {
      title: "Korean Beauty Expertise",
      desc: "Our deep ties with leading laboratories and brands in Seoul allow us to source the most innovative and trending formulations in K-Beauty first.",
      icon: Sparkles,
      color: "text-accent bg-accent/10 border-accent/20"
    },
    {
      title: "Reliable Export Support",
      desc: "We manage customs compliance, export documentation, packaging safety, and international freight options, making sourcing simple.",
      icon: ShieldCheck,
      color: "text-primary-700 bg-primary-50 border-primary-100"
    },
    {
      title: "Retail & B2B Friendly",
      desc: "We operate with flexible structures, competitive pricing tiers, and reasonable Minimum Order Quantities to serve both retailers and distributors.",
      icon: HeartHandshake,
      color: "text-rose-700 bg-rose-50 border-rose-100"
    },
    {
      title: "Premium Product Selection",
      desc: "Every single product is strictly selected, verified for 100% authenticity, and complies with standard global safety regulations.",
      icon: Compass,
      color: "text-indigo-700 bg-indigo-50 border-indigo-100"
    }
  ];

  return (
    <section id="why-choose-us" className="py-12 sm:py-16 md:py-20 bg-primary-50/50">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sourcing Excellence You Can Trust
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 font-medium">
            CLICOS is dedicated to ensuring that global beauty merchants have access to authentic, high-quality Korean formulations with seamless logistics.
          </p>
        </div>

        {/* Features Card Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group flex flex-col p-8 rounded-3xl bg-white border border-gray-100/80 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Feature Icon */}
              <div className={`flex items-center justify-center w-16 h-16 rounded-[24px] border mb-6 transition-transform group-hover:scale-105 duration-300 ${card.color}`}>
                <card.icon className="w-7 h-7" />
              </div>

              {/* Feature Title */}
              <h3 className="text-lg font-bold text-gray-900 font-serif mb-3">
                {card.title}
              </h3>

              {/* Feature Description */}
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
