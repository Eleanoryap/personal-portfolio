"use client";

import { useEffect, useRef } from "react";

// Faint navigation-chart contours behind everything.
const LINES = Array.from({ length: 7 }, (_, i) => {
  const y = 90 + i * 150;
  const a = 26 + (i % 3) * 14;
  return `M -80 ${y} C 220 ${y - a}, 420 ${y + a}, 600 ${y - a * 0.6} S 940 ${y + a}, 1180 ${y - a * 0.4}`;
});

/**
 * A fixed backdrop layer that content scrolls over — the basis of the page's
 * sense of depth. Drifts a little slower than the page under scroll (parallax);
 * static under reduced motion.
 */
export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      el.style.setProperty("--drift", `${window.scrollY * -0.045}px`);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="backdrop" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1100 1200" preserveAspectRatio="none">
        {LINES.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </div>
  );
}
