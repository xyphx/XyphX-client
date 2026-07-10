import React from "react";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import { scrollToTop } from "@/lib/scroll";
import { Linkedin, Github } from "lucide-react";

const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/xyphx" },
  { label: "GitHub", href: "https://github.com/xyphx" },
];

export default function Footer({ showContact = true }: { showContact?: boolean }) {
  return (
    <footer id={showContact ? "contact" : undefined} className="relative z-10 px-6 md:px-10 pt-32 pb-8 overflow-hidden">
      <div className="mx-auto max-w-[96rem]">
        {/* the invitation */}
        {showContact && (
        <div className="contact-section">
          <Reveal blur={false}>
          <p className="label-mono mb-8 text-ink">06 — Contact</p>
          <h2 className="max-w-4xl font-display text-4xl md:text-6xl font-bold uppercase leading-[1.02] tracking-[-0.02em] text-carbon">
            Let's build the future together<span className="text-ink">.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <Reveal blur={false} delay={0.12}>
            <div className="flex flex-col gap-2">
              <span className="label-mono text-carbon/40 text-xs uppercase tracking-wider">Business & Partnerships</span>
              <p className="text-sm text-carbon/60 max-w-sm leading-relaxed">
                General inquiries, business inquiries, partnerships, media, and collaborations.
              </p>
              <a
                href="mailto:info@xyphx.com"
                data-cursor="WRITE"
                className="group inline-flex items-baseline gap-2 mt-2 self-start"
              >
                <span className="font-display text-xl md:text-3xl font-medium tracking-tight text-ink underline decoration-1 underline-offset-4 decoration-ink/30 transition-colors duration-300 group-hover:decoration-ink">
                  info@xyphx.com
                </span>
                <span aria-hidden className="font-display text-xl text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal blur={false} delay={0.2}>
            <div className="flex flex-col gap-2">
              <span className="label-mono text-carbon/40 text-xs uppercase tracking-wider">Technical Support</span>
              <p className="text-sm text-carbon/60 max-w-sm leading-relaxed">
                Technical support, product support, bug reports, and account issues.
              </p>
              <a
                href="mailto:support@xyphx.com"
                data-cursor="WRITE"
                className="group inline-flex items-baseline gap-2 mt-2 self-start"
              >
                <span className="font-display text-xl md:text-3xl font-medium tracking-tight text-ink underline decoration-1 underline-offset-4 decoration-ink/30 transition-colors duration-300 group-hover:decoration-ink">
                  support@xyphx.com
                </span>
                <span aria-hidden className="font-display text-xl text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </div>
        </div>
        )}

        {/* ledger */}
        <Reveal blur={false} delay={0.2}>
          <div className="mt-24 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            <div>
              <p className="label-mono mb-3 text-carbon/40">Practice</p>
              <p className="text-carbon/70">Engineering the Future of Tech</p>
            </div>
            <div>
              <p className="label-mono mb-3 text-carbon/40">Follow</p>
              <div className="flex gap-8">
                {social.map((s) => {
                  const Icon = s.label === "LinkedIn" ? Linkedin : Github;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`XyphX on ${s.label}`}
                      className="link-draw flex items-center gap-1.5 text-carbon/70 hover:text-ink transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{s.label} ↗</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* the monument wordmark — each letter answers the cursor */}
        <Reveal blur={false} delay={0.1} amount={0.2}>
          <div className="mt-24 flex select-none justify-center leading-none" aria-hidden>
            {"XYPHX".split("").map((ch, i) => (
              <Magnetic key={i} strength={0.4}>
                <span className="font-display text-[clamp(4.5rem,17vw,15rem)] font-bold tracking-[-0.02em] text-stroke-ink transition-colors duration-500 hover:text-ink hover:[-webkit-text-stroke-width:0]">
                  {ch}
                </span>
              </Magnetic>
            ))}
          </div>
        </Reveal>

        {/* base line */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 md:flex-row">
          <p className="label-mono text-carbon/40">© 2025 XyphX</p>
          <p className="label-mono hidden md:block text-carbon/40">One ink · one field · 8pt grid</p>
          <button onClick={scrollToTop} data-cursor="TOP" className="label-mono link-draw text-ink">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
