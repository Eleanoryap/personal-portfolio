export type Theme = "light" | "dark";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * Flip the theme, persist it, and iris the change in from `origin` (the control
 * that was clicked) — a disc of the outgoing sky colour that shrinks to nothing
 * where you clicked, revealing the new theme underneath.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const from = getComputedStyle(root).getPropertyValue("--color-sky").trim();
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode — the choice just won't persist */
  }
  window.dispatchEvent(new Event("themechange"));
  wipe(from, origin);
}

function wipe(from: string, origin?: { x: number; y: number }) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let el = document.getElementById("theme-wipe");
  if (!el) {
    el = document.createElement("div");
    el.id = "theme-wipe";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight * 0.22;
  el.style.background = from;
  el.style.setProperty("--wx", `${x}px`);
  el.style.setProperty("--wy", `${y}px`);

  el.classList.remove("is-wiping");
  void el.offsetWidth; // restart the animation
  el.classList.add("is-wiping");
  const done = () => {
    el?.classList.remove("is-wiping");
    el?.removeEventListener("animationend", done);
  };
  el.addEventListener("animationend", done);
}
