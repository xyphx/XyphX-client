import React from "react";
import Reveal from "@/components/motion/Reveal";
import { ArtBlueprint } from "@/components/art/LineArt";

const facets = [
  { index: "A", label: "Services", note: "Client work, shipped fast" },
  { index: "B", label: "R&D", note: "Proprietary research" },
  { index: "C", label: "Products", note: "The end goal" },
];

export default function About() {
  return (
    <section id="about" className="relative z-10 px-6 md:px-10 py-32 md:py-40">
      <div className="mx-auto max-w-[96rem]">
        <div className="grid gap-16 md:grid-cols-12">
          {/* sticky index column */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <Reveal blur={false}>
                <p className="label-mono mb-6 text-ink">01 — Who we are</p>
                <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-carbon">
                  Who
                  <br />
                  we are<span className="text-ink">.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.2} blur={false}>
                <ul className="mt-12 border-t border-line">
                  {facets.map((f) => (
                    <li
                      key={f.index}
                      className="group flex items-baseline gap-4 border-b border-line py-4 transition-colors duration-300 hover:bg-ink-soft"
                    >
                      <span className="label-mono text-ink/60">{f.index}</span>
                      <span className="font-display text-lg font-medium text-carbon">{f.label}</span>
                      <span className="label-mono ml-auto text-carbon/40 transition-colors duration-300 group-hover:text-ink">
                        {f.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {/* editorial copy */}
          <div className="md:col-span-8 md:pt-4">
            <Reveal delay={0.1} blur={false}>
              <p className="text-2xl md:text-[2rem] leading-snug text-carbon/75 font-light">
                XyphX is a pioneering{" "}
                <em className="not-italic font-medium text-ink">AI startup and digital product studio</em> built on a bold
                ambition — to engineer the future of intelligent systems. We build autonomous multi-agent systems,
                smart automation tools, and next-gen platforms ready to redefine industries.
              </p>
            </Reveal>
            <Reveal delay={0.25} blur={false}>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-carbon/60">
                Our journey began with a vision to bridge the gap between traditional software systems and the vast,
                untapped potential of autonomous intelligence. Today, we craft scalable AI agents and custom digital
                ecosystems that are <em className="not-italic text-ink">designed with tomorrow in mind</em>.
              </p>
            </Reveal>

            {/* the company blueprint, drawn live */}
            <Reveal delay={0.2} blur={false}>
              <figure className="mt-20 border-t border-line pt-8">
                <ArtBlueprint className="w-full max-w-2xl text-ink" />
                <figcaption className="label-mono mt-4 flex justify-between text-carbon/40">
                  <span>Fig. 01 — The XyphX system</span>
                  <span>Services · R&D · Products → one core</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
