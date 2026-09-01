"use client";

import { useEffect } from "react";

/**
 * Arms and drives the `[data-reveal]` entrance: elements start recessed and
 * tilted, then settle as they enter the viewport. Arming is JS-only, so
 * without JS everything is simply visible; reduced motion skips it entirely.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (els.length === 0) return;

    // Whatever is already on screen stays put — only below-the-fold blocks
    // get the entrance.
    const pending: HTMLElement[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add("is-in");
      } else {
        pending.push(el);
      }
    }
    root.setAttribute("data-reveal-armed", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    pending.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.removeAttribute("data-reveal-armed");
    };
  }, []);

  return null;
}
