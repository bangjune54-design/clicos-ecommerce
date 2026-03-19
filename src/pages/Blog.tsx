import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "New Elastosome Technology Boosts EGF Penetration for Superior Anti-Ageing Results",
    excerpt: "Researchers in South Korea have developed a high-performance delivery system that pushes large-molecule anti-ageing ingredients deep into the skin.",
    imageSrc: "https://www.cosmeticsdesign-asia.com/resizer/v2/LIOPNETJEFHT3IRFJNH5ETDODI.jpg?auth=9f46f15677b834caa2490c0f9f10ef808a534d3bd9959c1f59db235bf2baa9f7&width=824&height=465&smart=true",
    date: "Feb 09, 2026",
    author: "Editorial Team",
    category: "Technology",
  },
  {
    id: 2,
    title: "Exclusive: Lula, Lee Elevate Ties to Strategic Partnership",
    excerpt: "Presidents to expand cooperation in supply chains, critical minerals, and clean energy during an exclusive state visit.",
    imageSrc: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop",
    date: "Feb 23, 2026",
    author: "Global Business Desk",
    category: "Global Trade",
  },
  {
    id: 3,
    title: "20 Best Korean Skin Care Products for Your K-Beauty Routine",
    excerpt: "From face masks you can sleep in to serums that brighten and soothe, leading beauty editors reveal the ultimate K-Beauty must-haves.",
    imageSrc: "/article-3-products.png",
    date: "Feb 23, 2026",
    author: "Sarah Y. Wu",
    category: "Recommendations",
  },
];

export function Blog() {
  return (
    <div className="bg-white pb-24 sm:pb-32">
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-gray-200">
        <div className="absolute inset-0">
          <img
            src="/blog-banner-mixsoon.jpg"
            alt="Korean Skincare Routine Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#4A3018]/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl font-serif">
              The CLICOS Journal
            </h2>
            <p className="mt-4 text-2xl leading-8 text-gray-200">
              Insights, trends, and expert tips on the world of Korean beauty.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between group">
              <div className="relative w-full">
                <img
                  src={post.imageSrc}
                  alt={post.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="relative z-10 rounded-full bg-primary-50 px-3 py-1.5 font-medium text-primary-800 hover:bg-primary-100 transition-colors">
                    {post.category}
                  </span>
                </div>
                
                <div className="group relative">
                  <h3 className="mt-3 text-xl font-bold font-serif leading-6 text-gray-900 group-hover:text-primary-800 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {post.author}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-accent group-hover:text-primary-800 transition-colors">
                  Read article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
