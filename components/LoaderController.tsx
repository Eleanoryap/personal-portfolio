"use client";

import { useEffect } from "react";

/**
 * Dismisses the server-rendered #loader overlay once fonts are ready and a
 * short minimum has passed, so it never merely flashes. A CSS animation on
 * .loader is the failsafe if this never runs.
 */
export function LoaderController() {
  useEffect(() => {
    const el = document.getElementById("loader");
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let removed = false;
    const finish = () => {
      if (removed) return;
      removed = true;
      el.classList.add("is-done");
      window.setTimeout(() => el.remove(), 450);
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
