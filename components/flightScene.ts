/**
 * A tiny three.js scene: a low-poly plane, an orthographic camera matched 1:1
 * to CSS pixels, and lights. Lazy-loaded by PathProgress so three.js stays off
 * the initial bundle. Returns an imperative controller.
 */

export interface FlightPlaneController {
  setViewport(w: number, h: number): void;
  update(o: {
    x: number; // screen px, viewport-relative
    y: number; // screen px, viewport-relative
    heading: number; // radians, screen space (atan2 of screen dy, dx)
    bank: number; // radians, roll about the nose
    pitch?: number; // radians, nose up / down (used only at rest)
    scale: number;
  }): void;
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

export async function createFlightPlane(
  canvas: HTMLCanvasElement,
): Promise<FlightPlaneController | null> {
  if (!webglOk()) return null;

  const THREE = await import("three");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  // Slight downward tilt so we see the plane from above-front, not edge-on.
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -400, 400);
  camera.position.set(0, 26, 100);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-0.7, 1.1, 0.9);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.55);
  fill.position.set(0.9, -0.3, -0.5);
  scene.add(fill);

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#f0793f"),
    roughness: 0.5,
    metalness: 0.1,
    flatShading: true,
  });
  // dark, semi-gloss — canopy glass and the exhaust nozzle
  const dark = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#3a434f"),
    roughness: 0.26,
    metalness: 0.5,
    flatShading: true,
  });

  // ---- low-poly jet, nose +x, wings ±z, fins +y ----
  const jet = new THREE.Group();

  // slender fuselage, blunt intake to a tapered tail
  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.44, 5.8, 12),
    mat,
  );
  fuselage.rotation.z = Math.PI / 2;
  fuselage.position.x = -0.25;
  jet.add(fuselage);

  // sharp nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.44, 2, 12), mat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 3.65;
  jet.add(nose);

  // exhaust nozzle
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.22, 0.55, 12),
    dark,
  );
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.x = -3.35;
  jet.add(nozzle);

  // low, faired canopy
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.46, 12, 8), dark);
  canopy.scale.set(1.9, 0.5, 0.58);
  canopy.position.set(1.45, 0.36, 0);
  jet.add(canopy);

  // helper: a flat panel (shape = chord × span, thin in y), one mesh per side.
  // The two sides differ only by the sign of the −90°/+90° x-rotation, so the
  // span maps to −z and +z respectively — no mirrored scale, no flipped normals.
  const panel = (pts: Array<[number, number]>, depth: number, y: number) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) s.lineTo(pts[k][0], pts[k][1]);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2); // centre the thickness on the fuselage
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(g, mat);
      m.rotation.x = (side * Math.PI) / 2;
      m.position.y = y;
      jet.add(m);
    }
  };

  // main wings — blended root extension sweeping back to a raked tip
  panel(
    [
      [2.7, 0.12],
      [-1.6, 4.4],
      [-2.7, 4.4],
      [-1.95, 0.32],
    ],
    0.12,
    -0.04,
  );

  // all-moving tailplane
  panel(
    [
      [-2, 0.18],
      [-3.05, 1.8],
      [-3.5, 1.8],
      [-2.9, 0.18],
    ],
    0.1,
    0.02,
  );

  // twin canted fins
  const finShape = new THREE.Shape();
  finShape.moveTo(-1.7, 0);
  finShape.lineTo(-2.5, 1.5);
  finShape.lineTo(-3, 1.5);
  finShape.lineTo(-2.9, 0);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.1,
    bevelEnabled: false,
  });
  const finR = new THREE.Mesh(finGeo, mat);
  finR.rotation.x = 0.4; // cant outward
  finR.position.set(0, 0.1, 0.5);
  jet.add(finR);
  const finL = finR.clone();
  finL.rotation.x = -0.4;
  finL.position.z = -0.5;
  jet.add(finL);

  new THREE.Box3().setFromObject(jet).getCenter(jet.position).negate();
  const model = new THREE.Group();
  model.add(jet);
  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot);

  // The model is ~6u long; this makes scale 1 ≈ 36px.
  const BASE = 6;

  let vw = 1;
  let vh = 1;

  function setViewport(w: number, h: number) {
    vw = w;
    vh = h;
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function update(o: {
    x: number;
    y: number;
    heading: number;
    bank: number;
    pitch?: number;
    scale: number;
  }) {
    pivot.position.set(o.x - vw / 2, vh / 2 - o.y, 0);
    pivot.scale.setScalar(BASE * o.scale);

    pivot.rotation.set(0, 0, 0);
    pivot.rotateZ(-o.heading); // nose along the path (screen y is flipped)
    pivot.rotateX(-o.bank); // roll into the turn, around the nose axis
    if (o.pitch) pivot.rotateY(o.pitch); // nose up / down toward the cursor

    if (!document.hidden) renderer.render(scene, camera);
  }

  function setColor(css: string) {
    const c = css.trim();
    if (c) mat.color.set(c);
  }

  function dispose() {
    scene.traverse((obj) => {
      const m = obj as { geometry?: { dispose(): void } };
      m.geometry?.dispose();
    });
    mat.dispose();
    dark.dispose();
    renderer.dispose();
  }

  return { setViewport, update, setColor, dispose };
}
