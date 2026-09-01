"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const DARK_MQ = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DARK_MQ);
  mq.addEventListener("change", onChange);
  window.addEventListener("themechange", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("themechange", onChange);
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia(DARK_MQ).matches ? "dark" : "light";
}

const getServerSnapshot = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the choice just won't persist */
    }
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.14em] text-ink-muted uppercase"
    >
      <span
        aria-hidden="true"
        className="relative block h-3.5 w-7 rounded-full border border-hairline"
      >
        <span
          className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200 motion-reduce:transition-none ${
            theme === "dark"
              ? "left-[calc(100%-0.625rem)] bg-signal"
              : "left-[0.125rem] bg-ink-muted"
          }`}
        />
      </span>
      {theme}
    </button>
  );
}
