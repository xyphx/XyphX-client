import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { scrollToId } from "@/lib/scroll";

/* ————————————————————————————————————————————————
   Headline line: rises in behind a mask on load; characters
   answer the cursor with a quiet ink response.
   ———————————————————————————————————————————————— */
function HeadlineLine({
  text,
  ink = false,
  delay = 0,
  className = "",
}: {
  text: string;
  ink?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.65, 0, 0.35, 1] }}
        aria-hidden
      >
        {text.split("").map((ch, i) =>
          ch === " " ? (
            <span key={i} className="inline-block w-[0.24em]" />
          ) : (
            <span
              key={i}
              className={`inline-block transition-colors duration-300 ${
                ink ? "text-ink" : "text-carbon hover:text-ink"
              }`}
            >
              {ch}
            </span>
          )
        )}
      </motion.span>
    </span>
  );
}

/**
 * Hero — pinned for the first stretch of scroll. On exit, the layers
 * separate: headline lines slide at different rates, the frame settles into the About section.
 */
export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  // layered exit choreography
  const metaOpacity = useTransform(progress, [0, 0.25], [1, 0]);
  const metaY = useTransform(progress, [0, 0.3], [0, -24]);
  const line1Y = useTransform(progress, [0, 1], [0, -220]);
  const line2Y = useTransform(progress, [0, 1], [0, -140]);
  const line3Y = useTransform(progress, [0, 1], [0, -60]);
  const titleOpacity = useTransform(progress, [0.45, 0.95], [1, 0]);
  const titleScale = useTransform(progress, [0, 0.9], [1, 0.96]);
  const cueOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  const still = { y: 0, opacity: 1, scale: 1 } as const;

  return (
    /* 150vh track — the extra height is the scrub for the exit sequence */
    <div ref={trackRef} className="relative z-10 h-[110vh] md:h-[150vh]">
      <section className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-10 pt-24 pb-16">

        <div className="relative mx-auto w-full max-w-[96rem]">
          {/* meta row — first layer to leave */}
          <motion.div style={reduce ? still : { opacity: metaOpacity, y: metaY }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mb-14 flex items-center justify-between border-b border-line pb-4"
            >
              <span className="label-mono text-carbon/50">001 — Welcome to XyphX</span>
              <span className="label-mono hidden sm:block text-carbon/50">Field of work: AI & Software</span>
              <span className="label-mono hidden md:block text-ink">Crafting tomorrow's tech, today</span>
            </motion.div>
          </motion.div>

          {/* the monument — stepped composition, lines shear apart on scroll */}
          <motion.h1
            style={reduce ? still : { opacity: titleOpacity, scale: titleScale }}
            className="origin-left font-display font-bold uppercase leading-[0.94] tracking-[-0.03em] text-[clamp(2.9rem,9.6vw,9.5rem)] select-none"
            aria-label="Engineering the future of tech"
          >
            <motion.span style={reduce ? still : { y: line1Y }} className="block">
              <HeadlineLine text="Engineering" delay={0.35} />
            </motion.span>
            <motion.span style={reduce ? still : { y: line2Y }} className="block md:pl-[7vw]">
              <HeadlineLine text="the Future" ink delay={0.5} />
            </motion.span>
            <motion.span style={reduce ? still : { y: line3Y }} className="block md:pl-[14vw]">
              <span className="flex items-center gap-[0.18em]">
                <HeadlineLine text="of Tech" delay={0.65} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 14 }}
                  className="mt-[0.28em] inline-block h-[0.13em] w-[0.13em] rounded-full bg-ink"
                  aria-hidden
                />
              </span>
            </motion.span>
          </motion.h1>

          {/* statement and buttons removed per request */}
        </div>

        {/* scroll cue — gone the moment you move */}
        <motion.div
          style={reduce ? still : { opacity: cueOpacity }}
          className="absolute bottom-8 left-6 md:left-10"
        >
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={() => scrollToId("about")}
            className="flex items-center gap-3"
            aria-label="Scroll to About"
          >
            <span className="block h-12 w-px bg-ink animate-cue" aria-hidden />
            <span className="label-mono text-carbon/50">Scroll</span>
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
