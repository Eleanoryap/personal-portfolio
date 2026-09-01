"use client";

import { useEffect, useRef } from "react";

/**
 * A curving flight path down the left margin of the homepage. A small plane
 * marker travels it as the reader scrolls, banking to the path's tangent,
 * while the traced portion fills with the signal colour. Desktop only.
 * Future: swap the 2-D plane for a 3-D model.
 */
export function PathProgress() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const trace = traceRef.current;
    const plane = planeRef.current;
    if (!wrap || !svg || !track || !trace || !plane) return;

    let len = 0;

    const buildPath = () => {
      const h = Math.max(1, wrap.clientHeight);
      const w = 44;
      const d = [
        "M 22 0",
        `C 8 ${h * 0.16}, 8 ${h * 0.32}, 23 ${h * 0.46}`,
        `C 38 ${h * 0.6}, 37 ${h * 0.78}, 21 ${h * 0.9}`,
        `C 13 ${h * 0.97}, 18 ${h}, 22 ${h}`,
      ].join(" ");
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      track.setAttribute("d", d);
      trace.setAttribute("d", d);
      len = track.getTotalLength();
      trace.style.strokeDasharray = `${len}`;
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      trace.style.strokeDashoffset = `${len * (1 - p)}`;
      const at = track.getPointAtLength(len * p);
      const ahead = track.getPointAtLength(Math.min(len, len * p + 2));
      const angle =
        (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI;
      plane.setAttribute(
        "transform",
        `translate(${at.x} ${at.y}) rotate(${angle})`,
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      buildPath();
      update();
    };

    buildPath();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="path" ref={wrapRef} aria-hidden="true">
      <svg ref={svgRef} fill="none" preserveAspectRatio="none">
        <path ref={trackRef} className="path__track" />
        <path ref={traceRef} className="path__trace" />
        <path
          ref={planeRef}
          className="path__plane"
          d="M 7 0 L -6 -4.5 L -2.5 0 L -6 4.5 Z"
        />
      </svg>
    </div>
  );
}
