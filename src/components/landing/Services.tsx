import React, { useState } from "react";
import Reveal from "@/components/motion/Reveal";
import { ArtBuild, ArtResearch, ArtLaunch } from "@/components/art/LineArt";

const services = [
  {
    title: "Custom Software Solutions",
    description:
      "Tailored software development that transforms your business processes and drives digital innovation.",
    details:
      "From web applications to enterprise solutions, we build scalable software that grows with your business.",
    Art: ArtBuild,
  },
  {
    title: "Technology Research & Development",
    description: "Innovative technology research driving the future of software solutions.",
    details:
      "Our R&D team focuses on exploring new technologies, improving systems, and creating cutting-edge solutions to solve complex technical challenges.",
    Art: ArtResearch,
  },
  {
    title: "Next-Gen Tech Product Development",
    description: "Innovative technology solutions addressing real-world challenges across industries.",
    details:
      "Developing scalable systems that tackle problems like resource optimization, connectivity, and automation to improve daily lives and business efficiency.",
    Art: ArtLaunch,
  },
];

/**
 * The services dossier — three files, one open at a time.
 * Opening a file draws its illustration.
 */
export default function Services() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section id="services" className="relative z-10 px-6 md:px-10 py-32 md:py-40">
      <div className="mx-auto max-w-[96rem]">
        <Reveal blur={false}>
          <div className="mb-4 flex items-end justify-between border-b border-line pb-4">
            <p className="label-mono text-ink">05 — Services</p>
            <p className="label-mono hidden sm:block text-carbon/40">Hover to open a file</p>
          </div>
        </Reveal>
        <Reveal blur={false} delay={0.1}>
          <h2 className="mb-16 font-display text-5xl md:text-7xl font-bold uppercase tracking-[-0.02em] text-carbon">
            What we do<span className="text-ink">.</span>
          </h2>
        </Reveal>

        <div>
          {services.map((s, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={s.title} blur={false} delay={i * 0.08} amount={0.3}>
                <div
                  onMouseEnter={() => setOpenIndex(i)}
                  onMouseLeave={() => setOpenIndex(-1)}
                  className={`border-b border-line first:border-t transition-colors duration-500 ${open ? "bg-ink-soft" : ""}`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    data-cursor={open ? "CLOSE" : "OPEN"}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-8 text-left md:grid-cols-[6rem_1fr_auto] md:gap-10 md:px-8"
                  >
                    <span className="label-mono text-ink/70">S—0{i + 1}</span>
                    <span
                      className={`font-display text-2xl md:text-4xl font-bold tracking-tight transition-colors duration-300 ${
                        open ? "text-ink" : "text-carbon group-hover:text-ink"
                      }`}
                    >
                      {s.title}
                    </span>
                    {/* plus that becomes × */}
                    <span className="relative h-6 w-6 justify-self-end" aria-hidden>
                      <span
                        className={`absolute left-0 right-0 top-1/2 h-px bg-ink transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                      />
                      <span
                        className={`absolute top-0 bottom-0 left-1/2 w-px bg-ink transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-10 px-6 pb-12 md:grid-cols-[6rem_1fr_auto] md:gap-10 md:px-8">
                        <span className="hidden md:block" />
                        <div className="max-w-xl">
                          <p className="mb-4 text-lg leading-relaxed text-carbon/70">{s.description}</p>
                          <p className="text-sm leading-relaxed text-carbon/50">{s.details}</p>
                        </div>
                        {open && <s.Art className="h-44 w-44 text-ink justify-self-start md:justify-self-end" />}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
