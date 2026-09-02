"use client";

import { useEffect, useRef } from "react";

// a band of clouds straddling the hero → statement seam. Percent positions
// within the band; s scales the cloud, lo/hi shade its underside/top.
const PUFFS = [
  { x: 2, y: 10, s: 1.5 },
  { x: 40, y: 5, s: 1.9 },
  { x: 74, y: 12, s: 1.6 },
  { x: 20, y: 24, s: 2.2 },
  { x: 58, y: 26, s: 2.0 },
  { x: 86, y: 22, s: 1.5 },
  { x: -6, y: 36, s: 1.9 },
  { x: 34, y: 42, s: 2.3 },
  { x: 66, y: 40, s: 1.8 },
  { x: 4, y: 52, s: 1.7 },
  { x: 48, y: 54, s: 2.1 },
  { x: 80, y: 50, s: 1.6 },
];

/**
 * A cloud bank across the seam between the hero and the first section. It sits
 * roughly where the two meet, so as the hero scrolls off the top the statement
 * is revealed emerging beneath it — like coming down through a cloud layer.
 * Drifts up a little faster than the scroll. Skipped under reduced motion.
 */
export function CloudVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      const p = Math.max(
        0,
        Math.min(1.4, (window.scrollY - vh * 0.15) / (vh * 1.1)),
      );
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cloud-veil" ref={ref} aria-hidden="true">
      {PUFFS.map((c, i) => (
        <svg
          key={i}
          className="cloud-veil__puff"
          viewBox="0 0 120 62"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.s * 24}rem`,
          }}
        >
          <defs>
            <linearGradient id={`veil${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--veil-hi)" />
              <stop offset="0.55" stopColor="var(--veil-mid)" />
              <stop offset="1" stopColor="var(--veil-lo)" />
            </linearGradient>
          </defs>
          <g fill={`url(#veil${i})`}>
            <ellipse cx="40" cy="42" rx="30" ry="16" />
            <ellipse cx="64" cy="34" rx="26" ry="22" />
            <ellipse cx="88" cy="44" rx="22" ry="15" />
            <ellipse cx="24" cy="46" rx="22" ry="13" />
            <ellipse cx="58" cy="48" rx="38" ry="12" />
          </g>
        </svg>
      ))}
    </div>
  );
}
