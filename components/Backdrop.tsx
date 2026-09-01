"use client";

import { useEffect, useRef } from "react";

// Deterministic PRNG so SSR and client render the same field.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const CONTOURS = Array.from({ length: 7 }, (_, i) => {
  const y = 90 + i * 150;
  const a = 26 + (i % 3) * 14;
  return `M -80 ${y} C 220 ${y - a}, 420 ${y + a}, 600 ${y - a * 0.6} S 940 ${y + a}, 1180 ${y - a * 0.4}`;
});

const STARS = (() => {
  const r = rng(7);
  return Array.from({ length: 78 }, () => ({
    cx: +(r() * 100).toFixed(2),
    cy: +(r() * 100).toFixed(2),
    rad: +(0.05 + r() * 0.16).toFixed(3),
    o: +(0.22 + r() * 0.6).toFixed(2),
    tw: r() > 0.72,
    delay: +(r() * 6).toFixed(2),
  }));
})();

const CLOUDS = (() => {
  const r = rng(41);
  return Array.from({ length: 6 }, (_, i) => ({
    x: +(6 + r() * 82).toFixed(1),
    y: +(8 + i * 15 + r() * 6).toFixed(1),
    s: +(0.7 + r() * 0.9).toFixed(2),
    dur: +(70 + r() * 60).toFixed(0),
    delay: +(-r() * 60).toFixed(0),
  }));
})();

/**
 * Fixed backdrop that content scrolls over — the basis of the page's depth.
 * Navigation-chart contours in both themes; a starfield in dark, drifting soft
 * clouds in light. Parallax drift under scroll; static under reduced motion.
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
      <svg
        className="backdrop__contours"
        viewBox="0 0 1100 1200"
        preserveAspectRatio="none"
      >
        {CONTOURS.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>

      <svg
        className="backdrop__stars"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.rad}
            opacity={s.o}
            className={s.tw ? "twinkle" : undefined}
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </svg>

      <div className="backdrop__clouds">
        {CLOUDS.map((c, i) => (
          <svg
            key={i}
            className="cloud"
            viewBox="0 0 120 60"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.s * 22}rem`,
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
            }}
          >
            <defs>
              <linearGradient id={`cg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#9fb2c0" stopOpacity="0.28" />
              </linearGradient>
            </defs>
            <g fill={`url(#cg${i})`}>
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
