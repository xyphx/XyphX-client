import React, { useCallback } from "react";
import Magnetic from "./Magnetic";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
}

/** System CTA: ink pill, magnetic pull, click ripple. Ghost = hairline pill. */
export default function MagneticButton({
  children,
  variant = "primary",
  size = "lg",
  className = "",
  onClick,
  ...rest
}: MagneticButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ink = document.createElement("span");
      const d = Math.max(rect.width, rect.height);
      ink.className = "ripple-ink";
      ink.style.width = ink.style.height = `${d}px`;
      ink.style.left = `${e.clientX - rect.left - d / 2}px`;
      ink.style.top = `${e.clientY - rect.top - d / 2}px`;
      btn.appendChild(ink);
      setTimeout(() => ink.remove(), 700);
      onClick?.(e);
    },
    [onClick]
  );

  const base =
    "ripple group relative inline-flex items-center justify-center gap-3 rounded-full font-display font-medium tracking-tight transition-all duration-500 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";

  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary: "bg-ink text-white hover:bg-ink-deep hover:shadow-[0_16px_48px_-16px_rgb(95_0_183/0.55)]",
    ghost: "border border-line text-carbon bg-transparent hover:border-ink hover:text-ink",
  };

  return (
    <Magnetic strength={0.25}>
      <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={handleClick} {...rest}>
        {children}
      </button>
    </Magnetic>
  );
}
