"use client";

import { useEffect, useRef } from "react";

// puffs scattered through the fog band for texture (percent positions)
const PUFFS = [
  { x: 6, y: 26, s: 1.7, o: 0.9 },
  { x: 54, y: 20, s: 2.1, o: 0.85 },
  { x: 28, y: 44, s: 2.4, o: 0.95 },
  { x: 72, y: 50, s: 1.8, o: 0.82 },
  { x: -8, y: 58, s: 2.2, o: 0.9 },
  { x: 44, y: 66, s: 2.6, o: 0.92 },
  { x: 82, y: 36, s: 1.9, o: 0.8 },
  { x: 16, y: 72, s: 2.0, o: 0.86 },
  { x: 62, y: 78, s: 2.3, o: 0.88 },
];

/**
 * A bank of cloud rushing up past the viewport on the first scroll — it fills
 * the screen as the hero clears, then lifts away to reveal the first section,
 * like descending through a cloud layer. Scroll-driven; skipped entirely under
 * reduced motion (the content just scrolls in as normal).
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
      // 0 → 1 across the first screen of scroll, finishing as the hero clears
      const p = Math.max(
        0,
        Math.min(1, (window.scrollY - vh * 0.14) / (vh * 0.82)),
      );
      el.style.setProperty("--p", p.toFixed(4));
      el.style.visibility = p <= 0 || p >= 1 ? "hidden" : "visible";
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
      <div className="cloud-veil__band">
        {PUFFS.map((c, i) => (
          <svg
            key={i}
            className="cloud-veil__puff"
            viewBox="0 0 120 60"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.s * 26}rem`,
              opacity: c.o,
            }}
          >
            <g>
              <ellipse cx="42" cy="40" rx="30" ry="17" />
              <ellipse cx="66" cy="34" rx="24" ry="20" />
              <ellipse cx="86" cy="42" rx="22" ry="15" />
              <ellipse cx="58" cy="46" rx="34" ry="13" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}
