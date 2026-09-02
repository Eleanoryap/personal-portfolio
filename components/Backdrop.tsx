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
  return Array.from({ length: 118 }, () => {
    const roll = r();
    return {
      cx: +(r() * 100).toFixed(2),
      cy: +(r() * 100).toFixed(2),
      rad: +(0.04 + r() * 0.15).toFixed(3),
      o: +(0.2 + r() * 0.6).toFixed(2),
      tw: r() > 0.58,
      bright: roll > 0.92,
      delay: +(r() * 6).toFixed(2),
    };
  });
})();

type CloudSpec = {
  x: number;
  y: number;
  s: number;
  dur: number;
  delay: number;
  o: number;
  near: boolean;
};

const CLOUDS: CloudSpec[] = (() => {
  const r = rng(41);
  return Array.from({ length: 11 }, (_, i) => ({
    x: +(-6 + r() * 94).toFixed(1),
    y: +(3 + i * 8 + r() * 6).toFixed(1),
    s: +(0.55 + r() * 1.3).toFixed(2),
    dur: +(64 + r() * 90).toFixed(0),
    delay: +(-r() * 140).toFixed(0),
    o: +(0.3 + r() * 0.38).toFixed(2),
    near: r() > 0.66,
  }));
})();

function Cloud({ c, gid }: { c: CloudSpec; gid: number }) {
  return (
    <svg
      className="cloud"
      viewBox="0 0 120 60"
      style={{
        left: `${c.x}%`,
        top: `${c.y}%`,
        width: `${c.s * 22}rem`,
        opacity: c.o,
        animationDuration: `${c.dur}s`,
        animationDelay: `${c.delay}s`,
      }}
    >
      <defs>
        <linearGradient id={`cg${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="1" stopColor="#a8bccb" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <g fill={`url(#cg${gid})`}>
        <ellipse cx="42" cy="40" rx="30" ry="17" />
        <ellipse cx="66" cy="34" rx="24" ry="20" />
        <ellipse cx="86" cy="42" rx="22" ry="15" />
        <ellipse cx="58" cy="46" rx="34" ry="13" />
      </g>
    </svg>
  );
}

/**
 * Fixed sky the page scrolls over. Navigation-chart contours in both themes;
 * in dark a starfield, a galactic band, the moon and drifting planets; in light
 * the sun and drifting clouds. Three parallax layers track the cursor, and it
 * all drifts under scroll. Everything freezes under reduced motion.
 */
export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let drift = 0;
    let raf = 0;

    const frame = () => {
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      el.style.setProperty("--px", px.toFixed(4));
      el.style.setProperty("--py", py.toFixed(4));
      el.style.setProperty("--drift", `${drift.toFixed(1)}px`);
      raf =
        Math.abs(tx - px) > 0.0006 || Math.abs(ty - py) > 0.0006
          ? requestAnimationFrame(frame)
          : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };
    const onScroll = () => {
      drift = window.scrollY * -0.05;
      kick();
    };

    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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

      {/* far: stars, galactic band, moon / sun */}
      <div className="plx plx--far">
        <span className="sky-band" />
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
              className={`${s.tw ? "twinkle " : ""}${s.bright ? "star--bright" : ""}`}
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </svg>
        <span className="orb orb--moon" />
        <span className="orb orb--sun">
          <span className="orb__rays" />
        </span>
      </div>

      {/* mid: planets and high clouds */}
      <div className="plx plx--mid">
        <span className="planet planet--a" />
        <span className="planet planet--b" />
        <div className="backdrop__clouds">
          {CLOUDS.filter((c) => !c.near).map((c, i) => (
            <Cloud key={i} c={c} gid={i} />
          ))}
        </div>
      </div>

      {/* near: foreground clouds and comets */}
      <div className="plx plx--near">
        <span className="comet comet--a" />
        <span className="comet comet--b" />
        <div className="backdrop__clouds">
          {CLOUDS.filter((c) => c.near).map((c, i) => (
            <Cloud key={i} c={c} gid={i + 40} />
          ))}
        </div>
      </div>
    </div>
  );
}
