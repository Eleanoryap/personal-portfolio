export type Theme = "light" | "dark";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function persist(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode — the choice just won't persist */
  }
  window.dispatchEvent(new Event("themechange"));
}

/**
 * Flip the theme with an iris: a disc of the outgoing sky colour covers the
 * whole page, the theme swaps underneath it (so nothing visibly jumps), then
 * the disc collapses to the point you clicked, revealing the new theme.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    persist(next);
    return;
  }

  const from = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-sky")
    .trim();

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

  const wipe = el;
  wipe.classList.remove("is-wiping");
  wipe.classList.add("is-covering"); // cover everything, instantly
  void wipe.offsetWidth;

  requestAnimationFrame(() => {
    persist(next); // swap the theme while fully hidden
    requestAnimationFrame(() => {
      wipe.classList.add("is-wiping"); // collapse the disc, revealing it
    });
  });

  const done = () => {
    clearTimeout(failsafe);
    wipe.classList.remove("is-covering", "is-wiping");
    wipe.removeEventListener("animationend", done);
  };
  const failsafe = window.setTimeout(done, 1400);
  wipe.addEventListener("animationend", done);
}
