import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/motion/MagneticButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper p-6">
      <div className="absolute inset-0 bg-field [mask-image:radial-gradient(ellipse_85%_75%_at_50%_45%,black_30%,transparent_82%)]" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="relative text-center"
      >
        <p className="label-mono mb-6 text-ink">Error — off the field</p>

        <p className="font-display text-[clamp(6rem,22vw,14rem)] font-bold leading-none tracking-[-0.03em] text-stroke-ink select-none" aria-hidden>
          404
        </p>

        <h1 className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight text-carbon">
          Page not found<span className="text-ink">.</span>
        </h1>
        <p className="mx-auto mt-4 mb-12 max-w-md text-carbon/55">
          The coordinates you followed don't exist on this drawing. Let's get you back to the origin.
        </p>

        <MagneticButton onClick={() => (window.location.href = "/")}>
          Back to home
          <span aria-hidden>→</span>
        </MagneticButton>
      </motion.div>
    </div>
  );
};

export default NotFound;
