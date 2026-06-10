// ============================================================
// Parameters – scaled to approximate the router plane proportions
// ============================================================
const BASE_THICKNESS = 1.2;
const BASE_BEVEL = 0.25;
const KNOB_SPHERE_R = 2.6;
const KNOB_STEM_H = 1.4;
const KNOB_STEM_R = 0.9;
const KNOB_FLANGE_H = 0.6;
const POST_HEIGHT = 7.5;
const POST_R = 1.3;
const SCREW_R = 0.6;
const WHEEL_R = 2.4;
const WHEEL_H = 0.7;
const STOP_POST_H = 4.5;

// ============================================================
// Materials
// ============================================================
const metalMat = new THREE.MeshStandardMaterial({
  color: 0xbbbbbb,
  roughness: 0.4,
  metalness: 0.5,
});
const darkMetalMat = new THREE.MeshStandardMaterial({
  color: 0x444444,
  roughness: 0.6,
  metalness: 0.6,
});
const blackMetalMat = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.7,
  metalness: 0.4,
});

// ============================================================
// Helper: spherical knob with stem, flange and equator seam
// ============================================================
function createKnob() {
  const group = new THREE.Group();

  // Lower flared boss
  const flange = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 3.2, KNOB_FLANGE_H, 32),
    metalMat
  );
  flange.position.y = KNOB_FLANGE_H / 2;
  flange.castShadow = true;
  group.add(flange);

  // Cylindrical stem
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(KNOB_STEM_R, KNOB_STEM_R, KNOB_STEM_H, 32),
    metalMat
  );
  stem.position.y = KNOB_FLANGE_H + KNOB_STEM_H / 2;
  group.add(stem);

  // Main spherical grip
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(KNOB_SPHERE_R, 32, 32),
    metalMat
  );
  sphere.position.y = KNOB_FLANGE_H + KNOB_STEM_H + KNOB_SPHERE_R * 0.55;
  sphere.castShadow = true;
  group.add(sphere);

  // Visible equator seam (two–halves of the knob)
  const seam = new THREE.Mesh(
    new THREE.TorusGeometry(KNOB_SPHERE_R, 0.04, 8, 48),
    darkMetalMat
  );
  seam.position.y = sphere.position.y;
  seam.rotation.x = Math.PI / 2;
  group.add(seam);

  return group;
}

// ============================================================
// Base plate – extruded spline outline with front arch cutout
// ============================================================
const baseShape = new THREE.Shape();
const boundary = [
  new THREE.Vector2(0, 8),        // back center
  new THREE.Vector2(-7, 8),       // back left
  new THREE.Vector2(-9.5, 4),     // left rear side
  new THREE.Vector2(-9.5, 0),     // left side
  new THREE.Vector2(-7.5, -4),    // left front outer
  new THREE.Vector2(-5, -5.5),    // left pad front
  new THREE.Vector2(-3, -6.5),    // arch left wall (front)
  new THREE.Vector2(-1.5, -3.5),  // arch left wall (back)
  new THREE.Vector2(0, -2),       // arch deepest point
  new THREE.Vector2(1.5, -3.5),   // arch right wall (back)
  new THREE.Vector2(3, -6.5),     // arch right wall (front)
  new THREE.Vector2(5, -5.5),     // right pad front
  new THREE.Vector2(7.5, -4),     // right front outer
  new THREE.Vector2(9.5, 0),      // right side
  new THREE.Vector2(9.5, 4),      // right rear side
  new THREE.Vector2(7, 8),        // back right
];
baseShape.moveTo(boundary[0].x, boundary[0].y);
baseShape.splineThru(boundary.slice(1));
baseShape.closePath();

const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
  depth: BASE_THICKNESS,
  bevelEnabled: true,
  bevelThickness: BASE_BEVEL,
  bevelSize: BASE_BEVEL,
  bevelSegments: 3,
});
const baseMesh = new THREE.Mesh(baseGeom, metalMat);
baseMesh.rotation.x = -Math.PI / 2; // lay flat, shape Y becomes world +Z (mirrored correctly by point order)
baseMesh.position.y = 0;
baseMesh.castShadow = true;
baseMesh.receiveShadow = true;
scene.add(baseMesh);

// ============================================================
// Handles / knobs
// Left knob sits on the rear-left pad; right knob on front-right pad
// ============================================================
const leftKnob = createKnob();
leftKnob.position.set(-6, BASE_THICKNESS, -3);
scene.add(leftKnob);

const rightKnob = createKnob();
rightKnob.position.set(6, BASE_THICKNESS, 3);
scene.add(rightKnob);

// ============================================================
// Central boss & main vertical post
// ============================================================
const bossGeom = new THREE.CylinderGeometry(3.2, 3.6, 1.2, 32);
const boss = new THREE.Mesh(bossGeom, metalMat);
boss.position.set(0, BASE_THICKNESS + 0.6, -0.5);
boss.castShadow = true;
scene.add(boss);

const postGeom = new THREE.CylinderGeometry(POST_R, POST_R, POST_HEIGHT, 32);
const post = new THREE.Mesh(postGeom, metalMat);
post.position.set(0, BASE_THICKNESS + 1.2 + POST_HEIGHT / 2, -0.5);
post.castShadow = true;
scene.add(post);

// ============================================================
// Threaded screw & depth-adjustment wheel
// ============================================================
const screwGeom = new THREE.CylinderGeometry(SCREW_R, SCREW_R, POST_HEIGHT + 2.5, 16);
const screw = new THREE.Mesh(screwGeom, darkMetalMat);
screw.position.set(0, BASE_THICKNESS + 1.2 + (POST_HEIGHT + 2.5) / 2, -0.5);
scene.add(screw);

// Main adjustment wheel (knurled look via flat shading)
const wheelGeom = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, WHEEL_H, 32);
const wheelMat = new THREE.MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.6,
  metalness: 0.5,
  flatShading: true,
});
const wheel = new THREE.Mesh(wheelGeom, wheelMat);
wheel.position.set(0, BASE_THICKNESS + 1.2 + POST_HEIGHT * 0.55, -0.5);
scene.add(wheel);

// Wheel hub
const hubGeom = new THREE.CylinderGeometry(0.9, 0.9, WHEEL_H + 0.2, 16);
const hub = new THREE.Mesh(hubGeom, darkMetalMat);
hub.position.copy(wheel.position);
scene.add(hub);

// Top hex nut & bolt end
const nutGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 6);
const nut = new THREE.Mesh(nutGeom, metalMat);
nut.position.set(0, BASE_THICKNESS + 1.2 + POST_HEIGHT + 0.8, -0.5);
scene.add(nut);

const boltEndGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);
const boltEnd = new THREE.Mesh(boltEndGeom, metalMat);
boltEnd.position.set(0, BASE_THICKNESS + 1.2 + POST_HEIGHT + 1.5, -0.5);
scene.add(boltEnd);

// Small locking lever beside the wheel
const lever = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.4), darkMetalMat);
lever.position.set(1.4, wheel.position.y, -0.5);
scene.add(lever);

// ============================================================
// Depth stop post (small cylinder left of main post)
// ============================================================
const stopGeom = new THREE.CylinderGeometry(0.6, 0.6, STOP_POST_H, 16);
const stopPost = new THREE.Mesh(stopGeom, metalMat);
stopPost.position.set(-2.4, BASE_THICKNESS + STOP_POST_H / 2, -0.2);
scene.add(stopPost);

const stopCap = new THREE.Mesh(
  new THREE.SphereGeometry(0.65, 16, 16),
  metalMat
);
stopCap.position.set(-2.4, BASE_THICKNESS + STOP_POST_H + 0.2, -0.2);
scene.add(stopCap);

// ============================================================
// Small thumb screws / set screws
// ============================================================
// Left pad thumb wheel
const thumbHeadGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.35, 16);
const thumb1 = new THREE.Mesh(thumbHeadGeom, blackMetalMat);
thumb1.position.set(-5, BASE_THICKNESS + 0.18, -3);
scene.add(thumb1);

const thumb1Stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.35, 0.35, 0.8, 8),
  darkMetalMat
);
thumb1Stem.position.set(-5, BASE_THICKNESS + 0.6, -3);
scene.add(thumb1Stem);

// Right-side locking thumb screw entering the boss
const thumb2 = new THREE.Mesh(thumbHeadGeom, blackMetalMat);
thumb2.rotation.z = Math.PI / 2;
thumb2.position.set(3.8, BASE_THICKNESS + 1.4, -0.5);
scene.add(thumb2);

const thumb2Stem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.35, 0.35, 1.0, 8),
  darkMetalMat
);
thumb2Stem.rotation.z = Math.PI / 2;
thumb2Stem.position.set(3.3, BASE_THICKNESS + 1.4, -0.5);
scene.add(thumb2Stem);

// ============================================================
// Name plates (rectangular inlays where text appears in the drawing)
// ============================================================
// "STANLEY" curved front face of the arch
const stanleyPlate = new THREE.Mesh(
  new THREE.BoxGeometry(4.5, 1.0, 0.15),
  darkMetalMat
);
stanleyPlate.position.set(0, BASE_THICKNESS + 0.7, 6.4);
stanleyPlate.rotation.x = -0.25;
scene.add(stanleyPlate);

// "No 71" plate on right pad
const no71Plate = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 0.08, 1.0),
  darkMetalMat
);
no71Plate.position.set(6, BASE_THICKNESS + 0.06, 3.2);
scene.add(no71Plate);

// Small plate on left pad
const leftPlate = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 0.08, 0.8),
  darkMetalMat
);
leftPlate.position.set(-5.5, BASE_THICKNESS + 0.06, -2);
scene.add(leftPlate);

// ============================================================
// Mounting / weight-reduction holes in pads
// ============================================================
const holeMat = darkMetalMat;
const holeGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 16);

const h1 = new THREE.Mesh(holeGeom, holeMat);
h1.position.set(5.2, BASE_THICKNESS + 0.08, 4.2);
scene.add(h1);

const h2 = new THREE.Mesh(holeGeom, holeMat);
h2.position.set(7.2, BASE_THICKNESS + 0.08, 1.8);
scene.add(h2);

const h3 = new THREE.Mesh(holeGeom, holeMat);
h3.position.set(-6.8, BASE_THICKNESS + 0.08, -1.2);
scene.add(h3);

// ============================================================
// Camera framing
// ============================================================
camera.position.set(22, 18, 22);
camera.lookAt(0, 2, 0);