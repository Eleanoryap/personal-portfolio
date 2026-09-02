"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { toggleTheme } from "./theme";

/**
 * The moon (dark) / sun (light) in the sky — a real theme control, not just
 * decoration. Fixed clear of the content column near the top; it fades out
 * once you scroll into the page (the plain switch in the corner stays put for
 * anyone who doesn't spot it).
 */
export function SkyToggle() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const apply = () => {
      ticking = false;
      el.toggleAttribute(
        "data-gone",
        window.scrollY > window.innerHeight * 0.55,
      );
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className="sky-toggle" ref={ref}>
      <button
        type="button"
        className="sky-toggle__orb sky-toggle__orb--moon"
        onClick={onClick}
        aria-label="Switch to light theme"
      />
      <button
        type="button"
        className="sky-toggle__orb sky-toggle__orb--sun"
        onClick={onClick}
        aria-label="Switch to dark theme"
      >
        <span className="sky-toggle__rays" aria-hidden="true" />
      </button>
    </div>
  );
}
