"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { createNameBlocks, type NameBlocksController } from "./nameScene";
import { ThemeToggle } from "./ThemeToggle";

function inkColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--color-ink")
    .trim();
}

const NAV = [
  { href: "#statement", label: "Statement" },
  { href: "#work", label: "Work" },
  { href: "#reflection", label: "Reflection" },
  { href: "#contact", label: "Contact" },
  { href: "/about", label: "About" },
];

/**
 * Fixed viewport furniture for the homepage. The name rests centred over the
 * first screen and settles into the top-left corner once the reader scrolls;
 * the rest of the furniture fades in around it. Under reduced-motion the
 * corner state is set immediately and nothing animates.
 */
export function HomeChrome() {
  const nameCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      root.setAttribute("data-scrolled", "");
      return () => root.removeAttribute("data-scrolled");
    }

    // Arm the name entrance (it hides behind the loader, then reveals).
    root.setAttribute("data-intro", "");

    // ---- 3-D block name (desktop, WebGL, motion-OK only) ----------
    let name: NameBlocksController | null = null;
    let raf = 0;
    let cancelled = false;
    const frame = () => {
      raf = name && name.render() ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (name && !raf) raf = requestAnimationFrame(frame);
    };

    let scrolled = false;
    let ticking = false;
    const update = () => {
      const past = window.scrollY > Math.min(window.innerHeight * 0.25, 180);
      root.toggleAttribute("data-scrolled", past);
      if (past !== scrolled) {
        scrolled = past;
        if (past) name?.setPointer(NaN, NaN); // let the letters settle before it fades
        kick();
      }
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (scrolled || !name) return;
      name.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
      kick();
    };
    const onPointerLeave = () => {
      name?.setPointer(NaN, NaN); // let the letters spring back
      kick();
    };
    const onResize = () => {
      name?.setViewport(window.innerWidth, window.innerHeight);
      kick();
    };
    const onTheme = () => {
      name?.setColor(inkColor());
      kick();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Desktop with a real pointer only. Touch devices (phones, tablets) get
    // the flat <h1> — there's no cursor to drive the 3-D name, and the flip
    // to the corner on scroll is all they need.
    const canvas = nameCanvasRef.current;
    const desktop = window.matchMedia(
      "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
    ).matches;
    if (canvas && desktop) {
      createNameBlocks(canvas, site.name)
        .then((ctrl) => {
          if (!ctrl) return;
          if (cancelled) {
            ctrl.dispose();
            return;
          }
          name = ctrl;
          ctrl.setColor(inkColor());
          ctrl.setViewport(window.innerWidth, window.innerHeight);
          root.setAttribute("data-name3d", "");
          kick();
          window.addEventListener("pointermove", onPointerMove, {
            passive: true,
          });
          document.documentElement.addEventListener(
            "pointerleave",
            onPointerLeave,
          );
          window.addEventListener("resize", onResize, { passive: true });
          window.addEventListener("themechange", onTheme);
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      window.removeEventListener("resize", onResize);
      window.removeEventListener("themechange", onTheme);
      if (raf) cancelAnimationFrame(raf);
      name?.dispose();
      root.removeAttribute("data-scrolled");
      root.removeAttribute("data-intro");
      root.removeAttribute("data-name3d");
    };
  }, []);

  return (
    <>
      <canvas className="brand-canvas" ref={nameCanvasRef} aria-hidden="true" />
      <h1 className="brand brand--home">{site.name}</h1>
      <span className="brand brand--corner" aria-hidden="true">
        {site.name}
      </span>

      <div className="chrome chrome--home">
        <p className="chrome__fx chrome__fx--tl">
          <span className="chrome__mk">{"//"}</span> {site.role}
        </p>

        <nav
          className="chrome__fx chrome__fx--tr chrome__nav"
          aria-label="Sections"
        >
          {NAV.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <p className="chrome__fx chrome__fx--bl">{site.location}</p>

        <div className="chrome__fx chrome__fx--br flex flex-col items-end gap-1.5">
          <span className="chrome__meta">© {new Date().getFullYear()}</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="hero-cue" aria-hidden="true">
        Scroll
        <span className="hero-cue__chev" />
      </div>
    </>
  );
}
