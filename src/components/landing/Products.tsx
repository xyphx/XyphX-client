import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { ArtAgents, ArtPortfolio, ArtSystem } from "@/components/art/LineArt";

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
    // Dummy products
    const dummyProducts: Product[] = [
      {
        id: "1",
        name: "ShowMySkills",
        description: "Student portfolio, skills, achievements, and career showcase platform.",
        status: "Active",
        rank: 2,
        link: "https://showmyskills.xyphx.com",
        logo: "",
      },
      {
        id: "2",
        name: "XyphX OS",
        description:
          "Core operating platform powering products, services, integrations, authentication, and the XyphX ecosystem.",
        status: "Platform",
        rank: 3,
        link: "https://os.xyphx.com",
        logo: "",
      },
      {
        id: "3",
        name: "DotX",
        description:
          "AI-powered autonomous multi-agent platform for software engineering and enterprise automation.",
        status: "Enterprise",
        rank: 1,
        link: "https://dotx.xyphx.com",
        logo: "",
      },
    ];
    setProducts(dummyProducts);
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

                  <div className="relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 px-6 py-8 md:grid-cols-[6rem_1fr_2fr_auto] md:gap-x-10 md:px-8 md:py-10">
                    <span className="label-mono text-ink/70 transition-colors duration-500 group-hover:text-white/70">
                      P—0{product.rank}
                    </span>

                    <span className="font-display text-3xl md:text-5xl font-bold tracking-tight text-carbon transition-all duration-500 group-hover:text-white group-hover:translate-x-3">
                      {product.name}
                    </span>

                    <span className="col-span-full md:col-span-1 max-w-xl text-sm md:text-base leading-relaxed text-carbon/55 transition-colors duration-500 group-hover:text-white/75">
                      {product.description}
                    </span>

                    <span className="flex items-center gap-4 justify-self-end">
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
