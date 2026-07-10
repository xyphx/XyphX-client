import React from "react";

/** Boot screen — the field assembling: wordmark, one drawing line, mono status. */
const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-field [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_30%,transparent_80%)]" aria-hidden />

      <div className="relative flex flex-col items-center animate-fade-in">
        <img src="/logo.png" alt="XyphX" className="mb-8 h-20 w-20 object-contain" />

        <p className="font-display text-4xl font-bold tracking-tight text-carbon">
          XYPHX
        </p>

        {/* drawing line */}
        <div className="relative mt-8 h-px w-56 bg-line" aria-hidden>
          <span className="absolute inset-0 bg-ink" style={{ animation: "splash-draw 1.8s cubic-bezier(0.65,0,0.35,1) infinite" }} />
        </div>
        <style>{`
          @keyframes splash-draw {
            0% { transform: scaleX(0); transform-origin: left; }
            45% { transform: scaleX(1); transform-origin: left; }
            55% { transform: scaleX(1); transform-origin: right; }
            100% { transform: scaleX(0); transform-origin: right; }
          }
        `}</style>

        <p className="label-mono mt-6 text-carbon/50">
          Initializing <span className="text-ink">the field</span>
        </p>
      </div>

      <p className="label-mono absolute bottom-8 text-carbon/30">Engineering the Future of Tech</p>
    </div>
  );
};

export default SplashScreen;
