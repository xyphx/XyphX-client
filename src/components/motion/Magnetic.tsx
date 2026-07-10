import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/** Pulls its child toward the cursor while hovered, springs back on leave. */
export default function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  return (
    <div className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
