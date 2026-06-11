"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "li" | "ul" | "ol" | "section" | "span" | "h2" | "h3" | "p";

interface RevealProps {
  children: ReactNode;
  /** Element to render. Use "li" inside lists to keep markup valid. */
  as?: RevealTag;
  className?: string;
  /** Stagger delay in ms — applied as animation-delay so siblings cascade. */
  delay?: number;
  style?: CSSProperties;
}

/**
 * Scroll-reveal wrapper. Content settles in (opacity + slight rise) once it
 * enters the viewport, using BirLiy's ease-birliy curve. Pure CSS animation
 * driven by an IntersectionObserver — no per-frame JS, so it stays smooth on
 * low-end phones. Reduced-motion and no-JS users always see content (see
 * globals.css `.reveal`).
 */
export function Reveal({ children, as = "div", className, delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (typeof IntersectionObserver === "undefined" || prefersReduced) {
      setVisible(true);
      return;
    }

    // Already in or above the viewport (above-the-fold, restored scroll
    // position, anchor jump) → settle in right away rather than wait on IO.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Reveal when it enters view OR once it has been scrolled past — the
        // latter guards against fast flicks/jumps that skip the intersection.
        if (entry && (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return createElement(
    as,
    {
      ref,
      className: cn("reveal", visible && "is-visible", className),
      style: delay ? { ...style, animationDelay: `${delay}ms` } : style,
    },
    children,
  );
}
