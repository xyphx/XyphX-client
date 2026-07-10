import React from "react";
import { motion } from "framer-motion";

/* ============================================================
   Custom line-art illustration system.
   Single-weight ink strokes (currentColor), no fills, each shape
   draws itself in on view. These replace stock icons entirely.
   ============================================================ */

const draw = (delay = 0, duration = 1.4) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
});

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

interface ArtProps {
  className?: string;
}

/** DotX — an autonomous agent mesh: scattered nodes, one double-ringed core. */
export function ArtAgents({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <motion.circle cx="120" cy="120" r="16" {...stroke} {...draw(0.1)} />
      <motion.circle cx="120" cy="120" r="26" {...stroke} strokeDasharray="3 6" {...draw(0.3)} />
      <motion.circle cx="48" cy="60" r="7" {...stroke} {...draw(0.4)} />
      <motion.circle cx="196" cy="52" r="9" {...stroke} {...draw(0.5)} />
      <motion.circle cx="204" cy="168" r="6" {...stroke} {...draw(0.6)} />
      <motion.circle cx="56" cy="188" r="8" {...stroke} {...draw(0.7)} />
      <motion.path d="M60 68 L104 106" {...stroke} {...draw(0.8, 0.8)} />
      <motion.path d="M188 58 L140 104" {...stroke} {...draw(0.9, 0.8)} />
      <motion.path d="M198 162 L138 132" {...stroke} {...draw(1.0, 0.8)} />
      <motion.path d="M63 182 L104 136" {...stroke} {...draw(1.1, 0.8)} />
      <motion.path d="M48 60 L196 52" {...stroke} strokeDasharray="2 7" {...draw(1.2)} />
      <motion.circle cx="120" cy="120" r="3" fill="currentColor" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.3 }} />
    </svg>
  );
}

/** ShowMySkills — a fanned stack of portfolio sheets with a rising spark. */
export function ArtPortfolio({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <motion.rect x="52" y="76" width="112" height="132" rx="2" {...stroke} {...draw(0.1)} transform="rotate(-6 108 142)" />
      <motion.rect x="72" y="64" width="112" height="132" rx="2" {...stroke} {...draw(0.35)} transform="rotate(3 128 130)" />
      <motion.path d="M92 100 H156" {...stroke} {...draw(0.7, 0.6)} />
      <motion.path d="M92 120 H168" {...stroke} {...draw(0.8, 0.6)} />
      <motion.path d="M92 140 H140" {...stroke} {...draw(0.9, 0.6)} />
      <motion.path d="M194 44 l4 12 12 4 -12 4 -4 12 -4 -12 -12 -4 12 -4 z" {...stroke} {...draw(1.0)} />
      <motion.path d="M92 168 H120" {...stroke} strokeWidth={3} {...draw(1.1, 0.5)} />
    </svg>
  );
}

/** XyphX OS — a concentric operating system: rings, ticks, one orbiting body. */
export function ArtSystem({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <motion.circle cx="120" cy="120" r="86" {...stroke} {...draw(0.1, 1.8)} />
      <motion.circle cx="120" cy="120" r="58" {...stroke} strokeDasharray="4 8" {...draw(0.4)} />
      <motion.circle cx="120" cy="120" r="28" {...stroke} {...draw(0.7)} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <motion.path
          key={a}
          d={`M ${120 + 90 * Math.cos((a * Math.PI) / 180)} ${120 + 90 * Math.sin((a * Math.PI) / 180)}
              L ${120 + 98 * Math.cos((a * Math.PI) / 180)} ${120 + 98 * Math.sin((a * Math.PI) / 180)}`}
          {...stroke}
          {...draw(0.8 + i * 0.05, 0.4)}
        />
      ))}
      <motion.circle cx="178" cy="120" r="5" fill="currentColor" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }} />
      <motion.path d="M112 120 h16 M120 112 v16" {...stroke} {...draw(1.3, 0.5)} />
    </svg>
  );
}

/** Custom software — modular blocks assembling between code brackets. */
export function ArtBuild({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <motion.path d="M64 64 L36 120 L64 176" {...stroke} {...draw(0.1)} />
      <motion.path d="M176 64 L204 120 L176 176" {...stroke} {...draw(0.25)} />
      <motion.rect x="92" y="84" width="28" height="28" rx="2" {...stroke} {...draw(0.5)} />
      <motion.rect x="126" y="84" width="28" height="28" rx="2" {...stroke} {...draw(0.65)} />
      <motion.rect x="92" y="118" width="28" height="28" rx="2" {...stroke} {...draw(0.8)} />
      <motion.rect x="126" y="118" width="28" height="28" rx="2" {...stroke} strokeDasharray="3 5" {...draw(0.95)} />
      <motion.path d="M106 160 L140 160" {...stroke} strokeWidth={3} {...draw(1.1, 0.5)} />
    </svg>
  );
}

/** R&D — a flask whose contents are a circuit, mid-reaction. */
export function ArtResearch({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <motion.path d="M104 48 v44 L60 176 a12 12 0 0 0 11 18 h98 a12 12 0 0 0 11 -18 L136 92 V48" {...stroke} {...draw(0.1, 1.6)} />
      <motion.path d="M96 48 h48" {...stroke} {...draw(0.3, 0.5)} />
      <motion.path d="M84 148 h72" {...stroke} strokeDasharray="4 6" {...draw(0.8)} />
      <motion.circle cx="108" cy="168" r="4" {...stroke} {...draw(1.0, 0.4)} />
      <motion.circle cx="134" cy="176" r="3" {...stroke} {...draw(1.1, 0.4)} />
      <motion.path d="M120 148 v-24 l14 -14" {...stroke} {...draw(1.2, 0.7)} />
      <motion.circle cx="138" cy="106" r="3" fill="currentColor" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }} />
    </svg>
  );
}

/** Next-gen products — a launch trajectory leaving a dashed wake. */
export function ArtLaunch({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden>
      <motion.path d="M40 196 C 90 190, 150 150, 178 62" {...stroke} strokeDasharray="4 8" {...draw(0.1, 1.6)} />
      <motion.path d="M178 62 l-20 8 M178 62 l-4 22" {...stroke} {...draw(0.9, 0.5)} />
      <motion.path d="M166 40 l12 22 22 -6 -14 20 10 20 -24 -8 -18 14 4 -24 -20 -14 24 -2 z" {...stroke} {...draw(1.0, 1.2)} />
      <motion.path d="M40 196 h44" {...stroke} {...draw(0.4, 0.6)} />
      <motion.circle cx="40" cy="196" r="4" {...stroke} {...draw(0.2, 0.4)} />
    </svg>
  );
}

/** About — the company blueprint: services + R&D orbiting one product core. */
export function ArtBlueprint({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden>
      {/* datum lines */}
      <motion.path d="M24 180 H456" {...stroke} strokeDasharray="2 8" {...draw(0.1, 1.6)} />
      <motion.path d="M240 24 V336" {...stroke} strokeDasharray="2 8" {...draw(0.2, 1.6)} />
      {/* core */}
      <motion.circle cx="240" cy="180" r="54" {...stroke} {...draw(0.4, 1.4)} />
      <motion.circle cx="240" cy="180" r="40" {...stroke} strokeDasharray="4 7" {...draw(0.6)} />
      <motion.path d="M226 180 h28 M240 166 v28" {...stroke} {...draw(0.9, 0.6)} />
      {/* satellites */}
      <motion.circle cx="96" cy="96" r="26" {...stroke} {...draw(0.8)} />
      <motion.circle cx="384" cy="92" r="20" {...stroke} {...draw(0.95)} />
      <motion.circle cx="388" cy="268" r="24" {...stroke} {...draw(1.1)} />
      <motion.circle cx="92" cy="266" r="18" {...stroke} {...draw(1.25)} />
      {/* connections */}
      <motion.path d="M116 114 L196 152" {...stroke} {...draw(1.3, 0.7)} />
      <motion.path d="M368 104 L288 152" {...stroke} {...draw(1.4, 0.7)} />
      <motion.path d="M370 254 L288 208" {...stroke} {...draw(1.5, 0.7)} />
      <motion.path d="M108 254 L194 208" {...stroke} {...draw(1.6, 0.7)} />
      {/* dims */}
      <motion.path d="M96 130 v36 M96 148 h-24" {...stroke} strokeDasharray="1 5" {...draw(1.7, 0.6)} />
      <motion.circle cx="240" cy="180" r="4" fill="currentColor" stroke="none" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.8 }} />
    </svg>
  );
}
