/**
 * Lazy three.js scene that extrudes the hero name into flat-shaded 3-D blocks,
 * one mesh per letter, each reacting to the cursor on its own — lifting,
 * tilting and springing back as the pointer sweeps across the word. Loaded only
 * on the desktop homepage, after three.js is already resident for the path, so
 * the extra cost is the Syne TTF (~31 KB) plus opentype.js.
 */

import type { Font, PathCommand } from "opentype.js";

export interface NameBlocksController {
  setViewport(w: number, h: number): void;
  /** pointer position, each axis −1..1 across the viewport; NaN clears it */
  setPointer(nx: number, ny: number): void;
  /** renders a frame; returns true while any letter is still settling */
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
const GLYPH_SIZE = 220; // font units the outline is generated at
const REST_PITCH = -0.15; // the row sits tilted up a touch
const REST_YAW = 0.1;
const GLOBAL_EASE = 0.09;
const LETTER_EASE = 0.16;

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

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#eef2f6"),
    roughness: 0.52,
    metalness: 0.12,
    flatShading: true,
  });

  const scene = new THREE.Scene();
  const pivot = new THREE.Group();
  const row = new THREE.Group(); // holds the letters, centred inside the pivot
  pivot.add(row);
  scene.add(pivot);

  type Letter = {
    g: InstanceType<typeof THREE.Group>;
    rx0: number;
    ry0: number;
    lift: number;
    up: number;
    rx: number;
    ry: number;
    sc: number;
  };
  const letters: Letter[] = [];
  const geos: Array<{ dispose(): void }> = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // one extruded mesh per glyph, kept at its position along the word
  for (const p of font.getPaths(text, 0, 0, GLYPH_SIZE)) {
    const cmds = p.commands as PathCommand[];
    if (!cmds.length) continue; // spaces
    const sp = new THREE.ShapePath();
    for (const c of cmds) {
      if (c.type === "M") sp.moveTo(c.x, -c.y);
      else if (c.type === "L") sp.lineTo(c.x, -c.y);
      else if (c.type === "C")
        sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
      else if (c.type === "Q") sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
    }
    const shapes = sp.toShapes();
    if (!shapes.length) continue;

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 44,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 3,
      bevelSize: 2,
      bevelSegments: 1,
    });
    geo.computeBoundingBox();
    const gb = geo.boundingBox;
    if (!gb) continue;
    // capture the glyph's placed extents — geo.translate() mutates gb in place
    const gx0 = gb.min.x;
    const gx1 = gb.max.x;
    const gy0 = gb.min.y;
    const gy1 = gb.max.y;
    const cx = (gx0 + gx1) / 2;
    const cy = (gy0 + gy1) / 2;
    geo.translate(-cx, -cy, -(gb.min.z + gb.max.z) / 2); // centre on its origin
    geos.push(geo);

    const g = new THREE.Group();
    g.position.set(cx, cy, 0);
    g.add(new THREE.Mesh(geo, mat));
    row.add(g);
    letters.push({
      g,
      rx0: cx,
      ry0: cy,
      lift: 0,
      up: 0,
      rx: 0,
      ry: 0,
      sc: 1,
    });

    minX = Math.min(minX, gx0);
    maxX = Math.max(maxX, gx1);
    minY = Math.min(minY, gy0);
    maxY = Math.max(maxY, gy1);
  }
  if (!letters.length) return null;

  const nameW = maxX - minX || 1;
  row.position.set(-(minX + maxX) / 2, -(minY + maxY) / 2, 0);
  const REACH = (nameW / letters.length) * 2.3; // ≈ two letters of influence

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1600, 1600);
  camera.position.set(0, 14, 120);
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
  let tGX = 0;
  let tGY = 0;
  let cGX = 0;
  let cGY = 0;
  let ptrPx = 0;
  let ptrPy = 0;
  let ptrOn = false;
  const cur = new THREE.Vector3();

  function layout() {
    // fit the word to ~58% of the viewport, capped, with room for the lift
    pivot.scale.setScalar(Math.min(vw * 0.58, 680) / nameW);
    pivot.position.set(0, vh * 0.11, 0);
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
    if (!Number.isFinite(nx) || !Number.isFinite(ny)) {
      ptrOn = false;
      return;
    }
    ptrOn = true;
    ptrPx = (nx * vw) / 2;
    ptrPy = (-ny * vh) / 2;
    tGX = -ny * 0.05; // a mild whole-word lean on top of the per-letter play
    tGY = nx * 0.11;
  }

  function render(): boolean {
    if (!ptrOn) {
      tGX = 0;
      tGY = 0;
    }
    cGX += (tGX - cGX) * GLOBAL_EASE;
    cGY += (tGY - cGY) * GLOBAL_EASE;
    pivot.rotation.set(REST_PITCH + cGX, REST_YAW + cGY, 0);
    pivot.updateMatrixWorld(true);

    // cursor in row-local units — parked far away when the pointer is off
    let lx = 1e7;
    let ly = 1e7;
    if (ptrOn) {
      cur.set(ptrPx, ptrPy, 0);
      row.worldToLocal(cur);
      lx = cur.x;
      ly = cur.y;
    }

    let moving =
      Math.abs(tGX - cGX) > 0.0005 || Math.abs(tGY - cGY) > 0.0005;

    for (const L of letters) {
      const dx = lx - L.rx0;
      const dy = ly - L.ry0;
      const infl = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
      const k = infl * infl;
      const tLift = k * 30;
      const tUp = k * 14;
      const tRy = (dx > 0 ? -1 : 1) * k * 0.5;
      const tRx = (dy > 0 ? 1 : -1) * k * 0.42;
      const tSc = 1 + k * 0.18;
      L.lift += (tLift - L.lift) * LETTER_EASE;
      L.up += (tUp - L.up) * LETTER_EASE;
      L.rx += (tRx - L.rx) * LETTER_EASE;
      L.ry += (tRy - L.ry) * LETTER_EASE;
      L.sc += (tSc - L.sc) * LETTER_EASE;
      L.g.position.set(L.rx0, L.ry0 + L.up, L.lift);
      L.g.rotation.set(L.rx, L.ry, 0);
      L.g.scale.setScalar(L.sc);
      if (
        Math.abs(tLift - L.lift) > 0.04 ||
        Math.abs(tUp - L.up) > 0.04 ||
        Math.abs(tRx - L.rx) > 0.0008 ||
        Math.abs(tRy - L.ry) > 0.0008 ||
        Math.abs(tSc - L.sc) > 0.0006
      ) {
        moving = true;
      }
    }

    renderer.render(scene, camera);
    return moving;
  }

  function setColor(css: string) {
    const c = css.trim();
    if (c) mat.color.set(c);
  }

  function dispose() {
    for (const g of geos) g.dispose();
    mat.dispose();
    renderer.dispose();
  }

  return { setViewport, setPointer, render, setColor, dispose };
}
