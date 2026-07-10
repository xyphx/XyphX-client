import React from "react";
import { motion, type Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "blockquote";
}

const container: Variants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.9em", rotateX: -55 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.21, 0.6, 0.35, 1] },
  },
};

/** Word-by-word rise-and-unfold text reveal for headlines and quotes. */
export default function AnimatedText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  once = true,
  as: Tag = "span",
}: AnimatedTextProps) {
  const MotionTag = motion[Tag] as typeof motion.span;
  const words = text.split(" ");

  return (
    <MotionTag
      className={className}
      variants={container}
      custom={{ delay, stagger }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.6 }}
      aria-label={text}
      style={{ perspective: 600 }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block will-change-transform ${wordClassName ?? ""}`}
            variants={word}
            aria-hidden
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
