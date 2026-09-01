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
const CONTENT_W = 576; // .doc max-width (36rem)
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
 * A flight path routed through the whole homepage — starting below the name,
 * then weaving down the left and right margins, crossing the content only at
 * the terminal rules. A plane rides a scroll-linked position, banking into the
 * curves; where WebGL is available it's a real 3-D mesh, otherwise a CSS
 * pseudo-3-D marker. Desktop only; hidden under reduced motion.
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
    let pitch = 0; // eased, radians — nose up/down, only while parked
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

      const leftX = Math.max(28, (w - CONTENT_W) / 2 - 44);
      const rightX = Math.min(w - 28, (w + CONTENT_W) / 2 + 44);
      // Start well below the name so the two don't crowd each other.
      const startY = vh * 0.62;

      // Cross the content only where a terminal rule sits (low text density);
      // hug a margin between the crossings.
      const rules = wrap.parentElement
        ? Array.from(wrap.parentElement.querySelectorAll<HTMLElement>(".rule"))
        : [];
      const crossings = rules
        .map((el) => {
          const r = el.getBoundingClientRect();
          return r.top + window.scrollY + r.height / 2;
        })
        .filter((y) => y > startY + 60 && y < h - 40);

      const pts: Array<{ x: number; y: number }> = [
        { x: w / 2, y: startY }, // the plane rests here, below the name
        { x: rightX, y: startY + vh * 0.32 }, // then slides out to the right
      ];
      let onLeft = false; // ...and carries on down the right margin
      for (const cy of crossings) {
        pts.push({ x: onLeft ? leftX : rightX, y: cy - 70 });
        pts.push({ x: onLeft ? rightX : leftX, y: cy + 70 });
        onLeft = !onLeft;
      }
      pts.push({ x: onLeft ? leftX : rightX, y: h - vh * 0.4 });
      pts.push({ x: w / 2, y: h - 24 });

      const d = smoothPath(pts);
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      track.setAttribute("d", d);
      trace.setAttribute("d", d);
      len = track.getTotalLength();
      trace.style.strokeDasharray = `${len}`;

      samples = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const l = (i / SAMPLES) * len;
        const pt = track.getPointAtLength(l);
        samples.push({ x: pt.x, y: pt.y, l });
      }

      mesh?.setViewport(w, vh);
    };

    const update = (): boolean => {
      if (samples.length < 2) return false;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const targetY = window.scrollY + vh * (0.62 + 0.3 * prog);
      const flying = window.scrollY > 4;

      let i = 0;
      while (i < samples.length - 2 && samples[i + 1].y < targetY) i++;
      const a = samples[i];
      const b = samples[i + 1];
      const t = b.y !== a.y ? (targetY - a.y) / (b.y - a.y) : 0;
      const x = a.x + (b.x - a.x) * t;
      const l = a.l + (b.l - a.l) * t;

      // path tangent — the nose points wherever the route is heading next
      const after = samples[Math.min(samples.length - 1, i + 4)];
      const t2 = Math.atan2(after.y - b.y, after.x - b.x);

      // Parked (not yet flown): the plane is a toy — it noses, banks and drifts
      // toward the cursor. In flight: the nose follows the path, and where the
      // route doubles back left it rolls 180° about the nose so it stays
      // right-side-up instead of hanging inverted.
      const targetHeading = flying ? t2 : ptrX * 0.4;
      heading += norm(targetHeading - heading) * (flying ? 0.12 : 0.09);
      // hysteresis so a near-vertical straightaway (cos ≈ 0) doesn't flip-flop
      if (Math.cos(t2) < -0.25) facingLeft = true;
      else if (Math.cos(t2) > 0.25) facingLeft = false;
      const targetRoll = flying ? (facingLeft ? 180 : 0) : ptrX * 22;
      bank += (targetRoll - bank) * (flying ? 0.12 : 0.09);
      const targetPitch = flying ? 0 : -ptrY * 0.34;
      pitch += (targetPitch - pitch) * 0.09;
      const yDrift = flying ? 0 : ptrY * 24;

      // large and near at the top, shrinking away into the distance
      const scale = 3 - 1.5 * prog;

      trace.style.strokeDashoffset = `${len - l}`;

      if (mesh) {
        mesh.update({
          x,
          y: targetY - window.scrollY + yDrift,
          heading,
          bank: bank / DEG,
          pitch: flying ? 0 : pitch,
          scale,
        });
      } else {
        plane.style.left = `${x}px`;
        plane.style.top = `${targetY}px`;
        // the fallback marker is symmetric top-to-bottom, so heading alone
        // reads correctly whichever way it flies — no roll needed
        plane.style.transform =
          `translate(-50%, -50%) scale(${scale.toFixed(3)}) ` +
          `perspective(560px) rotateX(13deg) ` +
          `rotateZ(${heading * DEG}deg)`;
      }

      return (
        Math.abs(norm(targetHeading - heading)) > 0.004 ||
        Math.abs(targetRoll - bank) > 0.1 ||
        Math.abs(targetPitch - pitch) > 0.004
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
    <div className="path" ref={wrapRef} aria-hidden="true">
      <svg ref={svgRef} fill="none" preserveAspectRatio="none">
        <path ref={trackRef} className="path__track" />
        <path ref={traceRef} className="path__trace" />
      </svg>
      <canvas ref={canvasRef} className="path__canvas" />
      <div className="path__plane" ref={planeRef}>
        <svg viewBox="-11 -9 22 18">
          <path d="M 9 0 L -3 -2.4 L -9 -7.5 L -6.5 -1.7 L -9 0 L -6.5 1.7 L -9 7.5 L -3 2.4 Z" />
        </svg>
      </div>
    </div>
  );
}
