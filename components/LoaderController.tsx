"use client";

import { useEffect } from "react";

/**
 * Fades out the server-rendered #loader once fonts are ready and a short
 * minimum has passed, so it never merely flashes, and signals the page has
 * loaded (which triggers the hero name's entrance). The overlay is hidden,
 * not removed — it's React-owned markup. A CSS animation on .loader is the
 * failsafe if this never runs.
 */
export function LoaderController() {
  useEffect(() => {
    const el = document.getElementById("loader");
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      document.documentElement.setAttribute("data-loaded", "");
      window.setTimeout(() => {
        el.style.visibility = "hidden";
        el.setAttribute("aria-hidden", "true");
      }, 450);
    };

    const minWait = new Promise<void>((resolve) =>
      window.setTimeout(resolve, reduce ? 250 : 600),
    );
    const fontsReady = document.fonts
      ? document.fonts.ready
      : Promise.resolve();

    Promise.all([minWait, fontsReady]).then(finish);
    const failsafe = window.setTimeout(finish, 3000);

    return () => window.clearTimeout(failsafe);
  }, []);

  return null;
}
