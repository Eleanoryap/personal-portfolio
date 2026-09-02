"use client";

import type { MouseEvent } from "react";
import { useSyncExternalStore } from "react";
import { toggleTheme, type Theme } from "./theme";

function subscribe(onChange: () => void) {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

const getServerSnapshot = (): Theme => "dark";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.14em] text-ink-muted uppercase"
    >
      <span
        aria-hidden="true"
        className="relative block h-3.5 w-7 rounded-full border border-hairline"
      >
        <span
          className={`absolute top-1/2 grid h-2.5 w-2.5 -translate-y-1/2 place-items-center rounded-full text-[6px] leading-none transition-[left,background-color] duration-200 motion-reduce:transition-none ${
            theme === "dark"
              ? "left-[calc(100%-0.6875rem)] bg-signal text-sky"
              : "left-[0.125rem] bg-ink-muted text-sky"
          }`}
        >
          {theme === "dark" ? "☽" : "☀"}
        </span>
      </span>
      {theme}
    </button>
  );
}
