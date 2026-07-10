import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const QUOTE =
  "We're not just building products; we're building the future of Technology.";
/* the words that carry the ink */
const INK_WORDS = new Set(["future", "Technology."]);

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const ink = INK_WORDS.has(word);
  const color = useTransform(progress, [start, end], ["rgb(13 0 26 / 0.14)", ink ? "#5F00B7" : "#0A0014"]);

  return (
    <motion.span style={{ color }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/**
 * Kinetic reading — the manifesto starts as ghost type and is
 * inked in word by word as the reader scrolls across it.
 */
export default function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 50%"],
  });

  const words = QUOTE.split(" ");

  return (
    <section className="relative z-10 px-6 md:px-10 py-32 md:py-48">
      <div ref={ref} className="mx-auto max-w-5xl">
        <p className="label-mono mb-10 text-carbon/40">
          03 — The thesis <span className="text-ink ml-2">read as you scroll</span>
        </p>

        <blockquote className="font-display text-4xl md:text-6xl font-bold leading-[1.12] tracking-[-0.02em]">
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </blockquote>

        <div className="mt-12 flex items-center gap-4">
          <motion.span
            style={{ scaleX: scrollYProgress }}
            className="block h-px w-40 origin-left bg-ink"
            aria-hidden
          />
          <span className="label-mono text-carbon/40">XyphX</span>
        </div>
      </div>
    </section>
  );
}
