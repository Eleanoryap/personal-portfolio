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
    bank: number; // radians
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

  // ---- low-poly aircraft, nose +x, wings ±z, fin +y ----
  const jet = new THREE.Group();

  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.62, 4.6, 7),
    mat,
  );
  fuselage.rotation.z = Math.PI / 2; // lie along x
  jet.add(fuselage);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.5, 7), mat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 3.05;
  jet.add(nose);

  const wingShape = new THREE.Shape();
  wingShape.moveTo(1.2, 0);
  wingShape.lineTo(-1.1, 3.6);
  wingShape.lineTo(-1.9, 3.6);
  wingShape.lineTo(-1.4, 0);
  wingShape.closePath();
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.16,
    bevelEnabled: false,
  });
  const wingR = new THREE.Mesh(wingGeo, mat);
  wingR.rotation.x = -Math.PI / 2;
  wingR.rotation.z = 0.16; // dihedral
  wingR.position.set(0.1, 0, 0.1);
  jet.add(wingR);
  const wingL = wingR.clone();
  wingL.scale.z = -1;
  wingL.rotation.z = -0.16;
  jet.add(wingL);

  const tailShape = new THREE.Shape();
  tailShape.moveTo(0.5, 0);
  tailShape.lineTo(-0.7, 1.5);
  tailShape.lineTo(-1.1, 1.5);
  tailShape.lineTo(-0.6, 0);
  tailShape.closePath();
  const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.14,
    bevelEnabled: false,
  });
  const tailR = new THREE.Mesh(tailGeo, mat);
  tailR.rotation.x = -Math.PI / 2;
  tailR.position.set(-2.1, 0, 0.07);
  jet.add(tailR);
  const tailL = tailR.clone();
  tailL.scale.z = -1;
  jet.add(tailL);

  const finShape = new THREE.Shape();
  finShape.moveTo(0.4, 0);
  finShape.lineTo(-0.9, 1.5);
  finShape.lineTo(-1.4, 1.5);
  finShape.lineTo(-0.5, 0);
  finShape.closePath();
  const fin = new THREE.Mesh(
    new THREE.ExtrudeGeometry(finShape, { depth: 0.13, bevelEnabled: false }),
    mat,
  );
  fin.position.set(-2.0, 0, -0.065);
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
    scale: number;
  }) {
    pivot.position.set(o.x - vw / 2, vh / 2 - o.y, 0);
    pivot.scale.setScalar(BASE * o.scale);

    pivot.rotation.set(0, 0, 0);
    pivot.rotateZ(-o.heading); // nose along the path (screen y is flipped)
    pivot.rotateX(-o.bank); // roll into the turn, around the nose axis

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
