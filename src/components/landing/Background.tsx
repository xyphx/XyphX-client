import React, { useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/* fixed crosshair registration marks scattered on the field */
const marks = [
  { top: "14%", left: "6%" },
  { top: "22%", left: "88%" },
  { top: "46%", left: "12%" },
  { top: "58%", left: "92%" },
  { top: "78%", left: "8%" },
  { top: "88%", left: "80%" },
];



/**
 * "The field": a drafting canvas the whole site sits on.
 * Baseline grid, registration marks, one slow ink wash tied to scroll,
 * film grain, and a live scroll coordinate. Fixed, pointer-transparent.
 */
const Background = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 24 });
  const washY = useTransform(progress, [0, 1], ["-10%", "40%"]);
  const washX = useTransform(progress, [0, 1], ["60%", "-20%"]);
  const mobileY = useTransform(progress, [0, 1], ["0px", "580px"]);
  const mobileX = useTransform(progress, [0, 1], ["60px", "-100px"]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* baseline grid, fading toward the edges */}
      <div className="absolute inset-0 bg-field [mask-image:radial-gradient(ellipse_90%_85%_at_50%_45%,black_35%,transparent_85%)]" />

      {/* Mobile background logo (placed above the text, shifts on scroll) */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-none md:hidden w-[60vw] aspect-square" aria-hidden="true">
        <motion.div
          style={{ y: mobileY, x: mobileX, opacity: 0.04 }}
          className="w-full h-full"
        >
          <img src="/logo.png" alt="" className="w-full h-full object-contain filter grayscale" />
        </motion.div>
      </div>

      {/* Desktop background logo (faded, shifts on scroll) */}
      <motion.div
        style={{ y: washY, x: washX, opacity: 0.05 }}
        className="absolute -top-[10%] -left-[10%] w-[70vw] max-w-[60rem] aspect-square pointer-events-none hidden md:block"
      >
        <img src="/logo.png" alt="" className="w-full h-full object-contain mix-blend-multiply filter grayscale" />
      </motion.div>

      {/* registration marks */}
      {marks.map((m, i) => (
        <span
          key={i}
          style={{ top: m.top, left: m.left }}
          className={`absolute font-mono text-sm select-none ${i % 3 === 0 ? "text-ink/30" : "text-carbon/15"}`}
        >
          +
        </span>
      ))}

      {/* margin rules */}
      <div className="absolute inset-y-0 left-10 w-px bg-line-soft hidden xl:block" />
      <div className="absolute inset-y-0 right-10 w-px bg-line-soft hidden xl:block" />



      {/* film grain */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-multiply" />
    </div>
  );
};

export default Background;
