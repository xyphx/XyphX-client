import React, { useEffect, useState } from "react";
import Reveal from "@/components/motion/Reveal";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
}

/**
 * Sponsor ticker — a tilted strip of type running across the field,
 * like tape across a drawing board. Pauses on hover.
 */
const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    // Dummy sponsors
    const dummySponsors: Sponsor[] = [
      { id: "1", name: "Xiaomi", logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg" },
      { id: "2", name: "Microsoft", logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
      { id: "4", name: "HP", logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" },
    ];
    setSponsors(dummySponsors);
  }, []);

  if (sponsors.length === 0) return null;

  // Duplicate the 2 sponsors multiple times to create a seamless continuous marquee loop
  const duplicated = Array(8).fill(sponsors).flat();

  return (
    <section className="relative z-10 py-24 overflow-hidden">
      <Reveal amount={0.5} blur={false}>
        <p className="label-mono mb-10 px-6 md:px-10 text-carbon/40">
          Backed by — <span className="text-ink">our sponsors</span>
        </p>
      </Reveal>

      <Reveal amount={0.4} blur={false} delay={0.1}>
        <div className="-mx-8 -rotate-[1.5deg]">
          <div className="pause-on-hover border-y border-line bg-paper py-8 overflow-hidden">
            <div className="flex w-max animate-marquee items-center whitespace-nowrap">
              {duplicated.map((s, i) => (
                <span key={`${s.id}-${i}`} className="group mx-2 flex items-center">
                  <img
                    src={s.logo_url}
                    alt={s.name}
                    className="h-8 md:h-12 w-auto object-contain opacity-90 transition-all duration-300 group-hover:opacity-100"
                  />
                  <span className="mx-12 font-mono text-ink/30" aria-hidden>
                    +
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Sponsors;
