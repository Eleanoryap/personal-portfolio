/**
 * Lazy three.js scene that extrudes the hero name into flat-shaded 3-D blocks,
 * lit to match the flight-path plane. Loaded only on the desktop homepage and
 * only after three.js is already resident for the path, so the extra cost is
 * the Syne TTF (~31 KB) plus opentype.js. Returns an imperative controller.
 */

import type { Font, PathCommand } from "opentype.js";

export interface NameBlocksController {
  setViewport(w: number, h: number): void;
  /** pointer position, each axis normalised to −1..1 across the viewport */
  setPointer(nx: number, ny: number): void;
  /** renders a frame; returns true while still easing toward the pointer */
  render(): boolean;
  setColor(css: string): void;
  dispose(): void;
}

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

const FONT_URL = "/fonts/syne-800.ttf";
const GLYPH_SIZE = 200; // font units the outline is generated at
const EASE = 0.09;
const REST_PITCH = 0.13; // the blocks sit at a slight angle so the depth reads
const REST_YAW = 0.11;

export async function createNameBlocks(
  canvas: HTMLCanvasElement,
  text: string,
): Promise<NameBlocksController | null> {
  if (!webglOk()) return null;

  let THREE: typeof import("three");
  let buf: ArrayBuffer;
  let parseFont: (b: ArrayBuffer) => Font;
  try {
    const [three, otMod, res] = await Promise.all([
      import("three"),
      import("opentype.js"),
      fetch(FONT_URL),
    ]);
    if (!res.ok) return null;
    THREE = three;
    buf = await res.arrayBuffer();
    parseFont = otMod.parse as (b: ArrayBuffer) => Font;
    if (typeof parseFont !== "function") return null;
  } catch {
    return null;
  }

  let font: Font;
  try {
    font = parseFont(buf);
  } catch {
    return null;
  }

  // ---- glyph outlines → one filled shape set (y flipped to three's up) ----
  const commands = font.getPath(text, 0, 0, GLYPH_SIZE).commands as PathCommand[];
  const sp = new THREE.ShapePath();
  for (const c of commands) {
    if (c.type === "M") sp.moveTo(c.x, -c.y);
    else if (c.type === "L") sp.lineTo(c.x, -c.y);
    else if (c.type === "C")
      sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
    else if (c.type === "Q") sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
  }
  const shapes = sp.toShapes();
  if (!shapes.length) return null;

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 46,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 3,
    bevelSize: 2,
    bevelSegments: 1,
  });
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  if (!bb) return null;
  const nameW = bb.max.x - bb.min.x || 1;
  geo.translate(
    -(bb.max.x + bb.min.x) / 2,
    -(bb.max.y + bb.min.y) / 2,
    -(bb.max.z + bb.min.z) / 2,
  );

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#eef2f6"),
    roughness: 0.52,
    metalness: 0.12,
    flatShading: true,
  });
  const pivot = new THREE.Group();
  pivot.add(new THREE.Mesh(geo, mat));

  const scene = new THREE.Scene();
  scene.add(pivot);

  // High, slightly-forward camera so the extruded tops catch the light.
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1200, 1200);
  camera.position.set(0, 44, 120);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-0.7, 1.1, 0.9);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(0.9, -0.3, -0.4);
  scene.add(fill);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  let vw = 1;
  let vh = 1;
  let tgtX = 0;
  let tgtY = 0;
  let curX = 0;
  let curY = 0;

  function layout() {
    // fit the name across most of the column; cap so it never gets huge
    pivot.scale.setScalar(Math.min(vw * 0.64, 760) / nameW);
    // centred across, optical centre ~40% down the first screen
    pivot.position.set(0, vh * 0.1, 0);
  }

  function setViewport(w: number, h: number) {
    vw = w;
    vh = h;
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    layout();
  }

  function setPointer(nx: number, ny: number) {
    tgtY = nx * 0.22; // extra yaw toward the cursor
    tgtX = -ny * 0.12; // extra pitch, opposite the cursor's vertical
  }

  function render(): boolean {
    curX += (tgtX - curX) * EASE;
    curY += (tgtY - curY) * EASE;
    pivot.rotation.set(REST_PITCH + curX, REST_YAW + curY, 0);
    if (!document.hidden) renderer.render(scene, camera);
    return Math.abs(tgtX - curX) > 0.0008 || Math.abs(tgtY - curY) > 0.0008;
  }

  function setColor(css: string) {
    const c = css.trim();
    if (c) mat.color.set(c);
  }

  function dispose() {
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  }

  return { setViewport, setPointer, render, setColor, dispose };
}
