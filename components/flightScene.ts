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

  // ---- low-poly jet, nose +x, wings ±z, fin +y ----
  const jet = new THREE.Group();

  // slender fuselage tapering to the tail, blunt at the intake
  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.46, 5.4, 10),
    mat,
  );
  fuselage.rotation.z = Math.PI / 2;
  fuselage.position.x = -0.2;
  jet.add(fuselage);

  // sharp nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.7, 10), mat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 3.35;
  jet.add(nose);

  // raised canopy
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 6), mat);
  canopy.scale.set(1.6, 0.42, 0.6);
  canopy.position.set(1.5, 0.34, 0);
  jet.add(canopy);

  // helper: a flat swept panel in the x/z plane, mirrored across the fuselage
  const panel = (
    pts: Array<[number, number]>,
    depth: number,
    y: number,
    dihedral: number,
  ) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) s.lineTo(pts[k][0], pts[k][1]);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
    const r = new THREE.Mesh(g, mat);
    r.rotation.x = -Math.PI / 2;
    r.rotation.z = dihedral;
    r.position.set(0, y, 0);
    jet.add(r);
    const li = r.clone();
    li.scale.z = -1;
    li.rotation.z = -dihedral;
    jet.add(li);
  };

  // main wings — swept delta, long root chord, short raked tip
  panel(
    [
      [1.9, 0],
      [-1.5, 4.1],
      [-2.4, 4.1],
      [-1.7, 0.35],
    ],
    0.12,
    -0.05,
    0.12,
  );

  // tailplane — a small echo of the wing near the tail
  panel(
    [
      [-1.9, 0.2],
      [-2.9, 1.7],
      [-3.35, 1.7],
      [-2.75, 0.2],
    ],
    0.1,
    0.02,
    0.05,
  );

  // single swept vertical fin, in the x/y plane
  const finShape = new THREE.Shape();
  finShape.moveTo(-1.7, 0);
  finShape.lineTo(-2.55, 1.9);
  finShape.lineTo(-3.05, 1.9);
  finShape.lineTo(-2.85, 0);
  finShape.closePath();
  const fin = new THREE.Mesh(
    new THREE.ExtrudeGeometry(finShape, { depth: 0.12, bevelEnabled: false }),
    mat,
  );
  fin.position.z = -0.06;
  jet.add(fin);

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
    renderer.dispose();
  }

  return { setViewport, update, setColor, dispose };
}
