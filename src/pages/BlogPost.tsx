import React from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "lucide-react";

const articleContent = {
  1: {
    title: "New Elastosome Technology Boosts EGF Penetration for Superior Anti-Ageing Results",
    date: "Feb 09, 2026",
    author: "Editorial Team",
    category: "Technology",
    imageSrc: "https://www.cosmeticsdesign-asia.com/resizer/v2/LIOPNETJEFHT3IRFJNH5ETDODI.jpg?auth=9f46f15677b834caa2490c0f9f10ef808a534d3bd9959c1f59db235bf2baa9f7&width=1200&smart=true",
    content: (
      <>
        <p className="lead text-xl text-gray-600 mb-8 font-serif">
          Researchers in South Korea have developed a high-performance delivery system that pushes large-molecule anti-ageing ingredients deep into the skin.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Technical Stability for Commercial Manufacturing</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          One of the major hurdles in formulating with Epidermal Growth Factor (EGF) has been its instability in commercial manufacturing environments. The new elastosome technology effectively encapsulates these large molecules, ensuring they remain active and potent from production to application. This breakthrough allows for more reliable and shelf-stable anti-ageing products.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Proven Penetration in Lab Testing</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          Lab tests have demonstrated that the elastosome delivery system significantly enhances the penetration of EGF into the deeper layers of the epidermis. Utilizing flexible liposomal structures, the active ingredients can pass through the stratum corneum more efficiently than traditional formulations, directly reaching the cells that need them most.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Clinical Results Show Younger Looking Skin</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          In clinical trials, participants using the elastosome-enhanced EGF treatments showed marked improvements in skin elasticity, reduction in fine lines, and overall youthfulness. The enhanced delivery ensures that the EGF can effectively stimulate collagen and elastin production.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Massive Gains in Hydration and Barrier Repair</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          Beyond anti-ageing, the formulation also contributed to massive gains in skin hydration. The technology reinforces the skin barrier, preventing transepidermal water loss and promoting a healthy, resilient complexion. This dual-action approach—repairing the barrier while delivering potent growth factors—sets a new standard in dermatological skincare.
        </p>
      </>
    )
  },
  2: {
    title: "Exclusive: Lula, Lee Elevate Ties to Strategic Partnership",
    date: "Feb 23, 2026",
    author: "Global Business Desk",
    category: "Global Trade",
    imageSrc: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop",
    content: (
      <>
        <p className="lead text-xl text-gray-600 mb-8 font-serif">
          Presidents expand cooperation in supply chains, critical minerals, and clean energy during state visit, sparking positive changes for international trade.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Elevating the Strategic Partnership</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          In an exclusive report, South Korea and Brazil have elevated their diplomatic ties to a strategic partnership. During his state visit, Brazilian President Lula da Silva met with South Korean President Lee to discuss and solidify agreements that will have widespread implications across multiple global industries.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Impact on the Cosmetics Supply Chain</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          A significant pillar of this expanded cooperation is the securing of supply chains and critical minerals. For the Korean cosmetics industry—which relies heavily on consistent and high-quality raw materials sourced globally—this partnership promises greater stability. Clean energy initiatives established between the two nations will also support the shift towards more sustainable, eco-friendly manufacturing practices in the beauty sector.
        </p>
      </>
    )
  },
  3: {
    title: "20 Best Korean Skin Care Products for Your K-Beauty Routine",
    date: "Feb 23, 2026",
    author: "Sarah Y. Wu",
    category: "Recommendations",
    imageSrc: "/article-3-products.png",
    content: (
      <>
        <p className="lead text-xl text-gray-600 mb-8 font-serif">
          From face masks you can sleep in to serums that brighten and soothe, here are the top picks for curating the ultimate K-Beauty routine.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Expert-Tested K-Beauty Essentials</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          Veteran beauty editors have tested hundreds of contenders to narrow down the absolute best Korean skin care products. With the ever-evolving trends in Seoul—from squishy donut lip serum applicators to deeply hydrating toner pads—the bar for K-beauty excellence continues to rise.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Best Cleanser: BePlain Mung Bean Cleansing Foam</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          Renowned for its gentle effectiveness, the BePlain Mung Bean Cleansing Foam is perfect for a purifying wash without stripping your skin. It remains a staple for those seeking a balanced, soothing cleanse.
        </p>
        <h3 className="text-2xl font-bold mt-10 mb-4 font-serif text-gray-900">Best Cleansing Oil: Ma:nyo Pure Cleansing Oil Deep Clean</h3>
        <p className="mb-6 text-gray-600 leading-relaxed">
          A cult classic that frequently takes first place at major K-beauty awards. Formulated with plant oils like grape seed, lavender, and sunflower seed, it easily shifts stubborn waterproof makeup. Dermatologists praise its lightweight, noncomedogenic texture that cleanses pores without leaving a heavy or greasy residue.
        </p>
        <p className="mb-6 text-gray-600 leading-relaxed italic">
          Whether you're looking for profound hydration, effective sun protection, or advanced PDRN formulations, keeping an eye on these top-rated products is key to maintaining a flawless glass skin complexion.
        </p>
      </>
    )
  }
};

export function BlogPost() {
  const { id } = useParams();
  const article = articleContent[id as keyof typeof articleContent];

  if (!article) {
    return (
      <div className="py-24 sm:py-32 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
        <Link to="/blog" className="text-primary-600 hover:text-primary-800 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link to="/blog" className="text-gray-500 hover:text-gray-900 mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
        <div className="mb-8 flex items-center gap-x-4 text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {article.date}
          </span>
          <span className="rounded-full bg-primary-50 px-3 py-1.5 font-medium text-primary-800">
            {article.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-serif mb-8">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            <User className="w-5 h-5 text-gray-400" />
            {article.author}
          </div>
        </div>
        
        <img
          src={article.imageSrc}
          alt={article.title}
          className="w-full rounded-2xl bg-gray-100 object-cover mb-12 aspect-[2/1]"
        />
        
        <div className="prose prose-lg prose-primary max-w-none text-gray-600">
          {article.content}
        </div>
      </div>
    </div>
  );
}
