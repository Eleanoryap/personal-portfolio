"use client";

import { useEffect, useRef } from "react";

/**
 * A thin flight path down the left margin of the homepage. A marker travels
 * it as the reader scrolls; the traced portion fills with the signal colour.
 * Hidden below the large breakpoint. Future: swap the marker for a 3-D plane.
 */
export function PathProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="path" ref={ref} aria-hidden="true">
      <span className="path__fill" />
      <span className="path__marker">
        <svg width="13" height="13" viewBox="-7 -7 14 14" fill="currentColor">
          <path d="M0 -6 L5 5 L0 2 L-5 5 Z" />
        </svg>
      </span>
    </div>
  );
}
