"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

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
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      root.setAttribute("data-scrolled", "");
      return () => root.removeAttribute("data-scrolled");
    }

    let ticking = false;
    const update = () => {
      const past = window.scrollY > Math.min(window.innerHeight * 0.25, 180);
      root.toggleAttribute("data-scrolled", past);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return (
    <>
      <h1 className="brand brand--home">{site.name}</h1>

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
