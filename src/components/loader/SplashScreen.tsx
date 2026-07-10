import React from "react";

/** Boot screen — the field assembling: wordmark, one drawing line, mono status. */
const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-paper">
      {/* Background Grid - The Field */}
      <div className="absolute inset-0 bg-field [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" aria-hidden />

      <div className="relative flex flex-col items-center animate-fade-in mt-[-5vh]">
        {/* Logo */}
        <img src="/logo.png" alt="XyphX" className="mb-12 h-40 w-40 object-contain" />

        {/* Loading Progress Bar */}
        <div className="relative h-[1px] w-48 bg-line overflow-hidden" aria-hidden>
          <span className="absolute inset-0 bg-ink" style={{ animation: "splash-draw 2s cubic-bezier(0.65,0,0.35,1) infinite" }} />
        </div>
        <style>{`
          @keyframes splash-draw {
            0% { transform: scaleX(0); transform-origin: left; }
            45% { transform: scaleX(1); transform-origin: left; }
            55% { transform: scaleX(1); transform-origin: right; }
            100% { transform: scaleX(0); transform-origin: right; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SplashScreen;
