"use client";

/** Re-runs the homepage intro — the name masks out and back in from centre. */
export function ReplayIntro() {
  function replay() {
    const root = document.documentElement;
    window.scrollTo({ top: 0, behavior: "auto" });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.removeAttribute("data-scrolled");
    root.removeAttribute("data-loaded");
    window.setTimeout(() => root.setAttribute("data-loaded", ""), 380);
  }

  return (
    <button
      type="button"
      onClick={replay}
      className="font-mono text-xs tracking-[0.14em] text-ink-muted uppercase hover:text-signal"
    >
      ↺ Replay intro
    </button>
  );
}
