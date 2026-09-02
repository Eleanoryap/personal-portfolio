"use client";

import type { MouseEvent } from "react";
import { toggleTheme } from "./theme";

/**
 * The moon (dark) / sun (light) sitting in the sky — a real theme control, not
 * just decoration. Fixed above the content so it stays clickable; the plain
 * switch in the corner is there for anyone who doesn't spot it.
 */
export function SkyToggle() {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className="sky-toggle">
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
