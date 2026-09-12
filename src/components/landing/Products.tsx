import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { ArtAgents, ArtPortfolio, ArtSystem } from "@/components/art/LineArt";
import { API_BASE_URL } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  status: string;
  rank: number;
  link: string;
  logo: string;
}

/* each product owns a custom illustration */
const artFor: Record<string, React.ComponentType<{ className?: string }>> = {
  DotX: ArtAgents,
  ShowMySkills: ArtPortfolio,
  "XyphX OS": ArtSystem,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  // illustration panel removed per request

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/products`);
        if (response.ok) {
          const data = await response.json();
          const dynamicProducts: Product[] = data.map((item: any, index: number) => ({
            id: item.id || String(index + 1),
            name: item.name,
            description: item.description || "No description provided.",
            status: "Active",
            rank: index + 1,
            link: item.link || "#",
            logo: "",
          }));
          setProducts(dynamicProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // hover art removed

  return (
    <section id="products" className="relative z-10 px-6 md:px-10 py-32 md:py-40">
      <div className="mx-auto max-w-[96rem]">
        <Reveal blur={false}>
          <div className="mb-4 flex items-end justify-between border-b border-line pb-4">
            <p className="label-mono text-ink">02 — Products</p>
            <p className="label-mono hidden sm:block text-carbon/40">{products.length} entries · ranked</p>
          </div>
        </Reveal>

        <Reveal blur={false} delay={0.1}>
          <h2 className="mb-16 font-display text-5xl md:text-7xl font-bold uppercase tracking-[-0.02em] text-carbon">
            The index<span className="text-ink">.</span>
          </h2>
        </Reveal>

        {/* the index — full-width editorial rows */}
        <div onMouseLeave={() => setHovered(null)}>
          {products
            .sort((a, b) => a.rank - b.rank)
            .map((product, i) => (
              <Reveal key={product.id} blur={false} delay={i * 0.08} amount={0.3}>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="OPEN"
                  onMouseEnter={() => setHovered(product.name)}
                  className="group relative block overflow-hidden border-b border-line first:border-t"
                >
                  {/* ink flood on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-top scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100"
                  />

                  <div className="relative flex flex-col gap-4 px-6 py-8 md:grid md:grid-cols-[6rem_1fr_2fr_auto] md:items-baseline md:gap-x-10 md:px-8 md:py-10">
                    <div className="flex items-baseline justify-between gap-4 md:contents">
                      <span className="label-mono shrink-0 text-ink/70 transition-colors duration-500 group-hover:text-white/70">
                        P—0{product.rank}
                      </span>

                      <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-carbon text-right md:text-left transition-all duration-500 group-hover:text-white md:group-hover:translate-x-3">
                        {product.name}
                      </span>
                    </div>

                    <span className="max-w-xl text-sm md:text-base leading-relaxed text-carbon/55 transition-colors duration-500 group-hover:text-white/75">
                      {product.description}
                    </span>

                    <span className="flex items-center gap-4 mt-2 md:mt-0 md:justify-self-end">
                      <span className="label-mono border border-line px-3 py-1.5 text-carbon/60 transition-colors duration-500 group-hover:border-white/40 group-hover:text-white">
                        {product.status}
                      </span>
                      <span
                        aria-hidden
                        className="font-display text-2xl text-ink transition-all duration-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
        </div>
      </div>

      {/* cursor-following illustration panel removed */}
    </section>
  );
}
