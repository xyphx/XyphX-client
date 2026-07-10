import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

const roadmapItems = [
  {
    phase: "Phase 1",
    title: "Expand Services",
    description:
      "Scaling our service offerings and building strategic partnerships to serve more clients across diverse industries.",
  },
  {
    phase: "Phase 2",
    title: "Deepen R&D",
    description:
      "Investing heavily in research, building proprietary algorithms, and developing breakthrough technologies.",
  },
  {
    phase: "Phase 3",
    title: "Launch Tech Products",
    description:
      "Releasing revolutionary products that will transform how businesses operate and people interact with technology.",
  },
];

/* station x-positions along the drawn trajectory (viewBox 1200 × 320) */
const stations = [
  { x: 8, y: 62, align: "below" },
  { x: 50, y: 38, align: "above" },
  { x: 92, y: 18, align: "below" },
];

/**
 * The roadmap is a single trajectory drawn across the field as you
 * scroll — three stations, each a crosshair on the line.
 */
export default function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const path = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="roadmap" className="relative z-10 px-6 md:px-10 py-32 md:py-40">
      <div className="mx-auto max-w-[96rem]">
        <Reveal blur={false}>
          <div className="mb-4 flex items-end justify-between border-b border-line pb-4">
            <p className="label-mono text-ink">04 — Roadmap</p>
            <p className="label-mono hidden sm:block text-carbon/40">Trajectory · three phases</p>
          </div>
        </Reveal>
        <Reveal blur={false} delay={0.1}>
          <h2 className="mb-20 font-display text-5xl md:text-7xl font-bold uppercase tracking-[-0.02em] text-carbon">
            Where this goes<span className="text-ink">.</span>
          </h2>
        </Reveal>

        {/* ——— desktop: the drawn trajectory ——— */}
        <div ref={ref} className="relative hidden md:block" style={{ height: "34rem" }}>
          <svg viewBox="0 0 1200 320" className="absolute inset-x-0 top-24 w-full" fill="none" aria-hidden>
            {/* ghost of the full path */}
            <path
              d="M 60 240 C 300 250, 420 160, 600 140 C 780 120, 960 90, 1140 40"
              stroke="rgb(13 0 26 / 0.1)"
              strokeWidth="1.5"
              strokeDasharray="3 7"
            />
            {/* the inked trajectory */}
            <motion.path
              d="M 60 240 C 300 250, 420 160, 600 140 C 780 120, 960 90, 1140 40"
              stroke="#5F00B7"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: path }}
            />
          </svg>

          {stations.map((s, i) => {
            const item = roadmapItems[i];
            const last = i === stations.length - 1;
            return (
              <div
                key={item.phase}
                className={`absolute w-72 ${last ? "text-right" : ""}`}
                style={
                  last
                    ? { right: "0", top: `${s.y}%` }
                    : { left: `${s.x}%`, top: `${s.y}%`, transform: "translateX(-1.5rem)" }
                }
              >
                {/* crosshair station */}
                <Reveal blur={false} delay={0.3 + i * 0.25} amount={0.6}>
                  <div className={`relative mb-6 h-12 w-12 ${last ? "ml-auto" : ""}`}>
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/40" />
                    <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-ink/40" />
                    <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper" />
                  </div>

                  <p className="label-mono mb-2 text-ink">
                    {String(i + 1).padStart(2, "0")} / {item.phase}
                  </p>
                  <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-carbon">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-carbon/55">{item.description}</p>
                </Reveal>
              </div>
            );
          })}
        </div>

        {/* ——— mobile: stations stacked on a rail ——— */}
        <div className="md:hidden border-l border-ink/30 pl-8 space-y-16">
          {roadmapItems.map((item, i) => (
            <Reveal key={item.phase} blur={false} delay={i * 0.1}>
              <div className="relative">
                <span className="absolute -left-8 top-2 h-px w-8 bg-ink/40" aria-hidden />
                <span className="absolute -left-[2.35rem] top-[3px] h-3 w-3 rounded-full border-2 border-ink bg-paper" aria-hidden />
                <p className="label-mono mb-2 text-ink">
                  {String(i + 1).padStart(2, "0")} / {item.phase}
                </p>
                <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-carbon">{item.title}</h3>
                <p className="text-sm leading-relaxed text-carbon/55">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
