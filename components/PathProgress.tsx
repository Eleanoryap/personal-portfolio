"use client";

import { useEffect, useRef } from "react";
import { createFlightPlane, type FlightPlaneController } from "./flightScene";

/**
 * Catmull-Rom through the points as cubic beziers, with each control point's
 * y clamped to its segment's y-range so the whole path stays monotonic in y
 * (the marker is placed by searching y, so a backward bulge would misplace it).
 */
function smoothPath(pts: Array<{ x: number; y: number }>) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const lo = Math.min(p1.y, p2.y);
    const hi = Math.max(p1.y, p2.y);
    const clamp = (v: number) => Math.max(lo, Math.min(hi, v));
    const c1y = clamp(p1.y + (p2.y - p0.y) / 6);
    const c2y = clamp(p2.y - (p3.y - p1.y) / 6);
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const DEG = 180 / Math.PI;
const SAMPLES = 260;

function norm(a: number) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

function signal() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--color-signal")
    .trim();
}

/**
 * A flight path routed through the whole homepage — one long, lazy S that eases
 * out of a hover below the name, glides down the page, then flares level and
 * settles into a slow hovering turntable at the foot of the page. A plane rides
 * a scroll-linked position; where WebGL is available it's a real 3-D mesh flying
 * over the content, otherwise a CSS marker. Desktop only; hidden under reduced
 * motion.
 */
export function PathProgress() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const trace = traceRef.current;
    const plane = planeRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !svg || !track || !trace || !plane || !canvas) return;

    let len = 0;
    let samples: Array<{ x: number; y: number; l: number }> = [];
    let bank = 0; // eased roll, degrees — 0 upright, 180 when doubled back left
    let heading = 0; // eased, radians — 0 (level) until the reader flies it
    let pitch = 0; // eased, radians — cursor nose-tilt when parked, yaw when landed
    let spin = 0; // free-running turntable angle once landed
    let curScale = 3.7; // eased, so the landed size doesn't pop
    let landX = 0; // eased screen position (tracks live pos, glides in on landing)
    let landY = 0;
    let facingLeft = false; // hysteretic: which way the route last committed
    let ptrX = 0; // cursor, −1..1 across the viewport (drives the parked plane)
    let ptrY = 0;
    let mesh: FlightPlaneController | null = null;

    const build = () => {
      // clientWidth, not innerWidth — the SVG renders inside the scrollbar,
      // so its user units must map 1:1 to the plane's CSS pixels.
      const w = wrap.clientWidth;
      const h = Math.max(1, wrap.clientHeight);
      const vh = window.innerHeight;

      const startY = vh * 0.62; // hovers here, below the name, until scroll
      const flareY = h - vh * 0.5; // the descent eases into a level glide here
      const restY = h - vh * 0.16; // and finally hovers here at the foot
      // swing nearly the full width, so the plane really crosses the screen
      const amp = Math.min(w * 0.42, w / 2 - 100);

      const pts: Array<{ x: number; y: number }> = [{ x: w / 2, y: startY }];

      // one long, lazy S: ~2 wide swings, the amplitude only tapering near the
      // very top and the landing, so the nose is never straight down for long
      const STEPS = 12;
      for (let k = 1; k <= STEPS; k++) {
        const f = k / STEPS;
        const y = startY + (flareY - startY) * f;
        const env = Math.sin(f * Math.PI) ** 0.55; // full through the middle
        const x = w / 2 + Math.sin(0.5 + f * Math.PI * 2.1) * amp * env;
        pts.push({ x, y });
      }

      // flare: bank round, level off, then a short horizontal run to the hover
      // point — the last points share a y, so the final tangent is flat
      pts.push({ x: w / 2 - amp * 0.55, y: flareY + (restY - flareY) * 0.5 });
      pts.push({ x: w / 2 - amp * 0.25, y: restY });
      pts.push({ x: w / 2 + amp * 0.12, y: restY });
      pts.push({ x: w / 2 + amp * 0.4, y: restY });

      const d = smoothPath(pts);
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      track.setAttribute("d", d);
      trace.setAttribute("d", d);
      len = track.getTotalLength();
      trace.style.strokeDasharray = `${len}`;

      samples = [];
      for (let k = 0; k <= SAMPLES; k++) {
        const sl = (k / SAMPLES) * len;
        const pt = track.getPointAtLength(sl);
        samples.push({ x: pt.x, y: pt.y, l: sl });
      }

      mesh?.setViewport(w, vh);
    };

    const update = (): boolean => {
      if (samples.length < 2) return false;
      const vh = window.innerHeight;
      const w = wrap.clientWidth;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const prog =
        maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      const flying = window.scrollY > 4;
      const landed = maxScroll > 0 && window.scrollY >= maxScroll - 6;

      const targetY = window.scrollY + vh * (0.62 + 0.3 * prog);
      let i = 0;
      while (i < samples.length - 2 && samples[i + 1].y < targetY) i++;
      const a = samples[i];
      const b = samples[i + 1];
      const t = b.y !== a.y ? (targetY - a.y) / (b.y - a.y) : 0;
      const pathX = a.x + (b.x - a.x) * t;
      const l = a.l + (b.l - a.l) * t;

      // path tangent — the nose points wherever the route is heading next
      const after = samples[Math.min(samples.length - 1, i + 4)];
      const t2 = Math.atan2(after.y - b.y, after.x - b.x);

      trace.style.strokeDashoffset = `${len - l}`;

      if (landed) spin = (spin + 0.011) % (2 * Math.PI);

      // ---- orientation targets ----------------------------------------
      let tHead: number;
      let tRoll: number;
      let tPitch: number;
      if (landed) {
        tHead = 0; // face forward, level
        tRoll = 0;
        tPitch = spin; // slow turntable yaw (rotateY)
      } else if (flying) {
        tHead = t2; // nose along the route
        if (Math.cos(t2) < -0.25) facingLeft = true;
        else if (Math.cos(t2) > 0.25) facingLeft = false;
        tRoll = facingLeft ? 180 : 0; // roll upright when doubled back left
        tPitch = 0;
      } else {
        tHead = ptrX * 0.4; // parked: a toy that follows the cursor
        tRoll = ptrX * 22;
        tPitch = -ptrY * 0.34;
      }

      const tight = flying && !landed;
      heading = norm(heading + norm(tHead - heading) * (tight ? 0.12 : 0.09));
      bank += (tRoll - bank) * (tight ? 0.12 : 0.09);
      pitch = norm(pitch + norm(tPitch - pitch) * (landed ? 0.16 : 0.09));

      const tScale = landed ? 2.1 : 3.7 - 1.9 * prog;
      curScale += (tScale - curScale) * 0.08;

      // ---- screen position ------------------------------------------
      let sx: number;
      let sy: number;
      if (landed) {
        landX += (w / 2 - landX) * 0.06;
        landY += (vh * 0.82 - landY) * 0.06;
        sx = landX;
        sy = landY + Math.sin(performance.now() * 0.0017) * 7; // hover bob
      } else {
        sx = pathX;
        sy = targetY - window.scrollY + (flying ? 0 : ptrY * 24);
        landX = sx; // keep synced so the landing glide starts from here
        landY = sy;
      }

      if (mesh) {
        mesh.update({
          x: sx,
          y: sy,
          heading,
          bank: bank / DEG,
          pitch: landed || !flying ? pitch : 0,
          scale: curScale,
        });
      } else {
        plane.style.left = `${sx}px`;
        plane.style.top = `${landed ? window.scrollY + sy : targetY}px`;
        plane.style.transform =
          `translate(-50%, -50%) scale(${curScale.toFixed(3)}) ` +
          `perspective(560px) rotateX(13deg) ` +
          `rotateZ(${heading * DEG}deg) ` +
          `rotateY(${landed ? pitch * DEG : 0}deg)`;
      }

      return (
        landed ||
        Math.abs(norm(tHead - heading)) > 0.004 ||
        Math.abs(tRoll - bank) > 0.1 ||
        Math.abs(norm(tPitch - pitch)) > 0.004 ||
        Math.abs(tScale - curScale) > 0.01
      );
    };

    let raf = 0;
    const tick = () => {
      raf = update() ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (window.scrollY > 4) return; // in flight the path is in charge
      ptrX = (e.clientX / window.innerWidth) * 2 - 1;
      ptrY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const rebuild = () => {
      build();
      update();
    };
    const onTheme = () => mesh?.setColor(signal());

    build();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", rebuild, { passive: true });
    window.addEventListener("themechange", onTheme);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(rebuild);
    const settle = window.setTimeout(rebuild, 600);

    // Upgrade to a real 3-D plane once three.js has loaded — desktop only, so
    // the ~180 KB stays off phones and tablets that can't drive it anyway.
    let cancelled = false;
    if (window.matchMedia("(min-width: 64rem)").matches) {
      createFlightPlane(canvas).then((ctrl) => {
        if (cancelled || !ctrl) return;
        mesh = ctrl;
        ctrl.setColor(signal());
        wrap.classList.add("path--3d");
        canvas.style.opacity = "1";
        rebuild();
      });
    }

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("pointermove", onPointerMove);
      window.clearTimeout(settle);
      mesh?.dispose();
    };
  }, []);

  return (
    <>
      <div className="path" ref={wrapRef} aria-hidden="true">
        <svg ref={svgRef} fill="none" preserveAspectRatio="none">
          <path ref={trackRef} className="path__track" />
          <path ref={traceRef} className="path__trace" />
        </svg>
        <div className="path__plane" ref={planeRef}>
          <svg viewBox="-11 -9 22 18">
            <path d="M 9 0 L -3 -2.4 L -9 -7.5 L -6.5 -1.7 L -9 0 L -6.5 1.7 L -9 7.5 L -3 2.4 Z" />
          </svg>
        </div>
      </div>
      <canvas ref={canvasRef} className="path__canvas" aria-hidden="true" />
    </>
  );
}
