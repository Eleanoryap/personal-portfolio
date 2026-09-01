"use client";

import { useEffect, useRef } from "react";

/** Catmull-Rom through the points, emitted as cubic beziers. */
function smoothPath(pts: Array<{ x: number; y: number }>) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const CONTENT_W = 576; // .doc max-width (36rem)
const SAMPLES = 260;

/**
 * A flight path routed through the whole homepage — starting level beside the
 * name, then weaving down the left and right margins. A plane marker rides it
 * as the reader scrolls, staying in view and banking to the path's tangent,
 * while the traced portion fills with the signal colour. Desktop only; hidden
 * under reduced motion. Future: swap the 2-D plane for a 3-D model.
 */
export function PathProgress() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const trace = traceRef.current;
    const plane = planeRef.current;
    if (!wrap || !svg || !track || !trace || !plane) return;

    let len = 0;
    let samples: Array<{ x: number; y: number; l: number }> = [];

    const build = () => {
      const w = window.innerWidth;
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
        { x: w / 2 - 120, y: startY },
        { x: w / 2 + 40, y: startY + 4 }, // level departure below the name
      ];
      let onLeft = true;
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
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      if (samples.length < 2) return;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // Sits on the path start below the name, drifting toward the foot.
      const targetY = window.scrollY + vh * (0.62 + 0.3 * prog);

      let i = 0;
      while (i < samples.length - 2 && samples[i + 1].y < targetY) i++;
      const a = samples[i];
      const b = samples[i + 1];
      const t = b.y !== a.y ? (targetY - a.y) / (b.y - a.y) : 0;
      const x = a.x + (b.x - a.x) * t;
      const l = a.l + (b.l - a.l) * t;
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

      trace.style.strokeDashoffset = `${len - l}`;
      plane.setAttribute(
        "transform",
        `translate(${x} ${targetY}) rotate(${angle})`,
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const rebuild = () => {
      build();
      update();
    };

    build();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", rebuild, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(rebuild);
    const settle = window.setTimeout(rebuild, 600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", rebuild);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <div className="path" ref={wrapRef} aria-hidden="true">
      <svg ref={svgRef} fill="none" preserveAspectRatio="none">
        <path ref={trackRef} className="path__track" />
        <path ref={traceRef} className="path__trace" />
        <g ref={planeRef} className="path__plane">
          <path d="M 8 0 L -7 -5 L -3 0 L -7 5 Z" />
        </g>
      </svg>
    </div>
  );
}
