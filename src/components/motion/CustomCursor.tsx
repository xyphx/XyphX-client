import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * The site cursor: an ink dot with a trailing ring.
 * Over anything interactive the ring tightens; over elements carrying
 * `data-cursor="Label"` it morphs into a labeled ink pill.
 * Desktop pointers only; disabled for touch and reduced motion.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 26, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 320, damping: 26, mass: 0.55 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.classList.add("cursor-hidden");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest?.("[data-cursor], a, button, [role='button']");
      setActive(!!el);
      setLabel(el?.getAttribute?.("data-cursor") ?? null);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.classList.remove("cursor-hidden");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* dot — locked to the pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[110] h-1.5 w-1.5 rounded-full bg-ink"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: label ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* ring — trails on a spring, morphs over targets */}
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[109] flex items-center justify-center rounded-full ${
          label ? "bg-ink" : "border border-ink/50"
        }`}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 64 : active ? 40 : 28,
          height: label ? 64 : active ? 40 : 28,
          scale: down ? 0.8 : 1,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        {label && (
          <span className="label-mono text-[9px] tracking-[0.14em] text-white">{label}</span>
        )}
      </motion.div>
    </>
  );
}
