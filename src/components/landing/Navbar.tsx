import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links: Array<{ label: string; id?: string; path?: string; href?: string }> = [
  { label: "Products", id: "products", path: "/" },
  { label: "Pricing", path: "/pricing" },
  { label: "API", path: "/console" },
  { label: "Contact", id: "contact", path: "/" },
  { label: "Careers", href: "https://careers.xyphx.com" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayLinks = links.filter(l => {
    if (l.label === "API" && location.pathname === "/console") {
      return false;
    }
    return true;
  }).map(l => {
    if (l.id === "products" && location.pathname !== "/") {
      return { ...l, label: "Home", id: undefined };
    }
    return l;
  });

  const handleActionClickBtn = async () => {
    setOpen(false);
    if (user) {
      if (location.pathname === "/console") {
        await logout();
        navigate("/");
      } else {
        navigate("/console");
      }
    } else {
      navigate("/login");
    }
  };

  const actionLabel = user 
    ? (location.pathname === "/console" ? "Logout" : "Console") 
    : "Continue";

  const handleLinkClick = (l: typeof links[0]) => {
    setOpen(false);
    if (l.id && location.pathname === "/") {
      scrollToId(l.id);
    } else if (l.id) {
      navigate(`${l.path}#${l.id}`);
    } else if (l.path) {
      navigate(l.path);
    }
  };

  const scrollTo = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      {/* scroll progress — a single ink hairline */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[70] h-px origin-left bg-ink"
        style={{ scaleX: progress }}
      />

      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
        className={`fixed top-0 inset-x-0 z-[60] transition-all duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-md border-b border-line-soft" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[96rem] items-center justify-between px-6 md:px-10">
          {/* wordmark */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 group"
            aria-label="Back to top"
            data-cursor="TOP"
          >
            <img src="/nav-logo.png" alt="XyphX" className="h-7 w-7" />
            <span className="font-display text-lg font-bold tracking-tight text-carbon">
              XYPHX
            </span>
          </button>

          {/* desktop index */}
          <div className="hidden md:flex items-center gap-8">
            {displayLinks.map((l, i) =>
              l.href ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono link-draw text-carbon/60 hover:text-ink transition-colors duration-300"
                >
                  <span className="text-ink/50 mr-1.5">0{i + 1}</span>
                  {l.label}&nbsp;↗
                </a>
              ) : (
                <button
                  key={l.label}
                  onClick={() => handleLinkClick(l)}
                  className="label-mono link-draw text-carbon/60 hover:text-ink transition-colors duration-300"
                >
                  <span className="text-ink/50 mr-1.5">0{i + 1}</span>
                  {l.label}
                </button>
              )
            )}
            <button
              onClick={handleActionClickBtn}
              className="label-mono rounded-full border border-carbon/20 px-5 py-2.5 text-carbon transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              {actionLabel}
            </button>
          </div>

          {/* mobile toggle — two lines that become × */}
          <button
            className="md:hidden relative h-10 w-10"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`absolute left-2 right-2 top-1/2 h-px bg-carbon transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute left-2 right-2 top-1/2 h-px bg-carbon transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </nav>
      </motion.header>

      {/* mobile menu — full-page paper sheet, giant index */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[55] md:hidden bg-paper pt-24 px-6 flex flex-col"
          >
            <div className="border-t border-line" />
            {displayLinks.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + 0.06 * i }}
                className="border-b border-line"
              >
                {l.href ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline gap-4 py-5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="label-mono text-ink/60">0{i + 1}</span>
                    <span className="font-display text-4xl font-bold tracking-tight text-carbon">
                      {l.label} <span className="text-ink">↗</span>
                    </span>
                  </a>
                ) : (
                  <button onClick={() => handleLinkClick(l)} className="flex w-full items-baseline gap-4 py-5 text-left">
                    <span className="label-mono text-ink/60">0{i + 1}</span>
                    <span className="font-display text-4xl font-bold tracking-tight text-carbon">{l.label}</span>
                  </button>
                )}
              </motion.div>
            ))}
            <button
              onClick={handleActionClickBtn}
              className="mt-8 rounded-full bg-ink px-6 py-4 font-display font-medium text-white"
            >
              {actionLabel}
            </button>
            <p className="label-mono mt-auto mb-8 text-carbon/40">XYPHX — Engineering the Future of Tech</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
