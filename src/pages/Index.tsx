import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis, scrollToId } from "@/lib/scroll";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import Vision from "@/components/landing/Vision";
import Roadmap from "@/components/landing/Roadmap";
import Sponsors from "@/components/landing/Sponsors";
import Products from "@/components/landing/Products";
import Footer from "@/components/landing/Footer";
import Background from "@/components/landing/Background";

const Index = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    setLenis(lenis);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Scroll to target hash fragment on initial page render
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        scrollToId(id);
      }, 400);
    }

    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Sponsors />
        <Products />
        <Vision />
        <Roadmap />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
