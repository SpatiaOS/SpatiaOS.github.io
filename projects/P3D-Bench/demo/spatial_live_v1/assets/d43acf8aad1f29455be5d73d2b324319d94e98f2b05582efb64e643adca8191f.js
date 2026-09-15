// ============================================================================
// CHIBI BATTLE TANK — stylized "SD" tank with hemispherical turret
// Interpretation of the reference: uniform light-gray "3D print" model with
//  - rounded extruded hull with sloped glacis plate
//  - two wide crawler tracks, chunky pads, dished road wheels with bolts
//  - large squashed-hemisphere turret with panel seams
//  - oversized main cannon with stepped muzzle rings
//  - accessories: commander sight, whip antenna, canister, grab handles,
//    exhaust stacks, twin-port gun pod, 6-barrel rotary (gatling) cannon
// Forward = -Z | Up = +Y | side facing the camera = -X
// ============================================================================

// ----------------------------- parameters ----------------------------------
const HULL_W  = 4.6;    // hull width
const DECK_Y  = 2.35;   // hull deck height
const TRACK_W = 1.15;   // track width
const TRACK_L = 7.2;    // track loop length
const TRACK_R = 1.15;   // track loop radius (= wheel center height)
const TRACK_X = 2.85;   // track center offset from middle
const DOME_R  = 2.35;   // turret dome radius
const DOME_SY = 0.92;   // dome vertical squash
const DOME_Y  = 2.50;   // dome base height
const GUN_Y   = 3.35;   // main gun axis height

// ----------------------------- materials -----------------------------------
const MAT      = new THREE.MeshStandardMaterial({ color: 0xb7bcc2, metalness: 0.30, roughness: 0.42 });
const MAT_DS   = new THREE.MeshStandardMaterial({ color: 0xb7bcc2, metalness: 0.30, roughness: 0.42, side: THREE.DoubleSide });
const MAT_DARK = new THREE.MeshStandardMaterial({ color: 0x2c2f33, metalness: 0.30, roughness: 0.60 });

// ----------------------------- helpers -------------------------------------
const tank = new THREE.Group();
scene.add(tank);

function mesh(geo, mat, parent, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}
// cylinder with axis choice ('y' default, 'x', 'z')
function cylMesh(rt, rb, h, axis, mat, parent, x, y, z, seg = 24) {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg);
  if (axis === 'x') g.rotateZ(Math.PI / 2);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  return mesh(g, mat, parent, x, y, z);
}
// torus with axis choice, optional arc and extra rotation
function torusMesh(r, t, mat, parent, x, y, z, axis = 'z', arc = Math.PI * 2, rx = 0, ry = 0, rz = 0) {
  const g = new THREE.TorusGeometry(r, t, 10, 24, arc);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  if (axis === 'y') g.rotateX(Math.PI / 2);
  return mesh(g, mat, parent, x, y, z, rx, ry, rz);
}
// height of the dome surface above a given (x,z) point
function domeSurfaceY(x, z) {
  const d = Math.hypot(x, z);
  return DOME_Y + DOME_SY * Math.sqrt(Math.max(DOME_R * DOME_R - d * d, 0));
}

// ------------------------------- hull --------------------------------------
// side profile extruded across the width (front at -Z, rounded nose,
// sloped glacis, flat deck, sloped rear)
const hullShape = new THREE.Shape();
hullShape.moveTo(-3.15, 0.55);                                // lower nose
hullShape.quadraticCurveTo(-3.90, 0.60, -3.72, 1.35);         // rounded nose
hullShape.lineTo(-1.95, DECK_Y);                              // glacis slope
hullShape.lineTo( 2.35, DECK_Y);                              // flat deck
hullShape.lineTo( 3.25, 1.85);                                // rear slope
hullShape.lineTo( 3.25, 0.65);                                // rear plate
hullShape.lineTo( 3.05, 0.55);
hullShape.closePath();
const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
  depth: HULL_W, bevelEnabled: true,
  bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 2, curveSegments: 12
});
hullGeo.rotateY(-Math.PI / 2);            // length -> Z, width -> X
hullGeo.translate(HULL_W / 2, 0, 0);
mesh(hullGeo, MAT, tank);

// ------------------------------ tracks -------------------------------------
// stadium-shaped (capsule) loop extruded across track width
const halfL = TRACK_L / 2 - TRACK_R;
const trackShape = new THREE.Shape();
trackShape.moveTo(halfL, -TRACK_R);
trackShape.absarc( halfL, 0, TRACK_R, -Math.PI / 2, Math.PI / 2, false);
trackShape.lineTo(-halfL, TRACK_R);
trackShape.absarc(-halfL, 0, TRACK_R,  Math.PI / 2, Math.PI * 1.5, false);
trackShape.lineTo(halfL, -TRACK_R);
const trackGeo = new THREE.ExtrudeGeometry(trackShape, {
  depth: TRACK_W, bevelEnabled: true,
  bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 24
});
trackGeo.rotateY(-Math.PI / 2);
trackGeo.translate(TRACK_W / 2, 0, 0);

const padGeo  = new THREE.BoxGeometry(TRACK_W + 0.30, 0.16, 0.62);  // shared
const flapGeo = new THREE.BoxGeometry(TRACK_W + 0.36, 0.14, 1.05);

function buildWheel(parent, side, zPos) {
  const w = new THREE.Group();
  w.position.set(side * (TRACK_W / 2 + 0.17), 0, zPos);
  parent.add(w);
  const s = side;
  cylMesh(0.95, 0.95, 0.22, 'x', MAT, w, 0, 0, 0, 32);            // rim disk
  cylMesh(0.60, 0.60, 0.04, 'x', MAT_DARK, w, s * 0.10, 0, 0, 28);// dark recess
  torusMesh(0.62, 0.07, MAT, w, s * 0.13, 0, 0, 'x');             // raised ring
  cylMesh(0.28, 0.28, 0.36, 'x', MAT, w, s * 0.06, 0, 0, 20);     // hub
  mesh(new THREE.SphereGeometry(0.11, 12, 8), MAT, w, s * 0.24, 0, 0); // hub cap
  for (let i = 0; i < 5; i++) {                                    // bolts
    const a = i * Math.PI * 2 / 5;
    cylMesh(0.065, 0.065, 0.30, 'x', MAT, w,
      s * 0.10, Math.cos(a) * 0.50, Math.sin(a) * 0.50, 10);
  }
}

function buildTrack(side) {
  const g = new THREE.Group();
  g.position.set(side * TRACK_X, TRACK_R, 0);
  tank.add(g);
  mesh(trackGeo, MAT, g);

  // track pads: top & bottom runs
  for (let i = 0; i < 7; i++) {
    const z = -2.1 + i * 0.7;
    mesh(padGeo, MAT, g, 0,  TRACK_R + 0.06, z);
    mesh(padGeo, MAT, g, 0, -TRACK_R - 0.06, z);
  }
  // track pads wrapped around front & rear arcs
  for (const a of [-60, -20, 20, 60]) {
    const t = a * Math.PI / 180;
    const rr = TRACK_R + 0.06;
    mesh(padGeo, MAT, g, 0, Math.sin(t) * rr, -halfL - Math.cos(t) * rr, t - Math.PI / 2);
    mesh(padGeo, MAT, g, 0, Math.sin(t) * rr,  halfL + Math.cos(t) * rr, Math.PI / 2 - t);
  }
  // big mudflap plates at lower front / rear
  const ft = 50 * Math.PI / 180, fr = TRACK_R + 0.32;
  mesh(flapGeo, MAT, g, 0, -Math.sin(ft) * fr, -halfL - Math.cos(ft) * fr, -ft - Math.PI / 2);
  mesh(flapGeo, MAT, g, 0, -Math.sin(ft) * fr,  halfL + Math.cos(ft) * fr,  Math.PI / 2 + ft);

  buildWheel(g, side, -halfL);   // front wheel
  buildWheel(g, side,  halfL);   // rear wheel
}
buildTrack(-1);
buildTrack(+1);

// ------------------------------ turret -------------------------------------
cylMesh(2.50, 2.55, 0.55, 'y', MAT, tank, 0, 2.32, 0, 48);          // turret ring
const dome = mesh(
  new THREE.SphereGeometry(DOME_R, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
  MAT, tank, 0, DOME_Y, 0
);
dome.scale.set(1, DOME_SY, 1);

// horizontal panel seam around the dome
const seamHL = 0.55 / DOME_SY;
const seamR  = DOME_R * Math.sqrt(1 - (seamHL / DOME_R) ** 2);
torusMesh(seamR, 0.035, MAT, tank, 0, DOME_Y + 0.55, 0, 'y');
// vertical panel seam over the top (front-to-back)
const vSeam = torusMesh(DOME_R, 0.035, MAT, tank, 0, DOME_Y, 0, 'x');
vSeam.scale.y = DOME_SY;

// ----------------------------- main gun ------------------------------------
cylMesh(0.92, 0.98, 0.60, 'z', MAT, tank, 0, GUN_Y, -2.00, 32);     // mantlet
torusMesh(0.72, 0.10, MAT, tank, 0, GUN_Y, -2.32);                  // mantlet ring
cylMesh(0.70, 0.74, 0.50, 'z', MAT, tank, 0, GUN_Y, -2.50, 28);     // collar
cylMesh(0.60, 0.53, 2.75, 'z', MAT, tank, 0, GUN_Y, -3.90, 28);     // barrel (tapered)
torusMesh(0.545, 0.08, MAT, tank, 0, GUN_Y, -5.28);                 // muzzle rim
// stepped rings inside the muzzle (as seen in the reference)
cylMesh(0.47, 0.47, 0.12, 'z', MAT_DS, tank, 0, GUN_Y, -5.33, 24);
cylMesh(0.41, 0.41, 0.12, 'z', MAT_DS, tank, 0, GUN_Y, -5.43, 24);
cylMesh(0.35, 0.35, 0.12, 'z', MAT_DS, tank, 0, GUN_Y, -5.53, 24);
cylMesh(0.33, 0.33, 0.90, 'z', MAT_DARK, tank, 0, GUN_Y, -5.90, 20);// dark bore

// ----------------------- turret accessories --------------------------------
// commander panoramic sight (top, slightly forward-left)
const sight = new THREE.Group();
sight.position.set(-0.55, domeSurfaceY(-0.55, -0.7) - 0.12, -0.7);
sight.rotation.x = -0.22;
tank.add(sight);
cylMesh(0.44, 0.48, 0.25, 'y', MAT, sight, 0, 0.12, 0, 28);
cylMesh(0.36, 0.40, 1.05, 'y', MAT, sight, 0, 0.75, 0, 28);
torusMesh(0.30, 0.05, MAT, sight, 0, 1.28, 0, 'y');
mesh(new THREE.BoxGeometry(0.42, 0.34, 0.06), MAT_DARK, sight, 0, 0.98, -0.33, -0.35);
cylMesh(0.11, 0.11, 0.35, 'z', MAT, sight, 0, 0.45, 0.42);          // eyepiece

// cylindrical canister with lid (top-rear of dome)
const jar = new THREE.Group();
jar.position.set(0.35, domeSurfaceY(0.35, 1.25) - 0.15, 1.25);
tank.add(jar);
cylMesh(0.34, 0.36, 0.95, 'y', MAT, jar, 0, 0.45, 0, 24);
torusMesh(0.35, 0.035, MAT, jar, 0, 0.62, 0, 'y');
torusMesh(0.35, 0.035, MAT, jar, 0, 0.78, 0, 'y');
cylMesh(0.41, 0.41, 0.16, 'y', MAT, jar, 0, 0.98, 0, 24);
cylMesh(0.07, 0.07, 0.14, 'y', MAT, jar, 0, 1.10, 0);

// tall whip antenna (leaning slightly rearward)
const ant = new THREE.Group();
ant.position.set(0.85, domeSurfaceY(0.85, 1.6) - 0.10, 1.6);
ant.rotation.set(0.10, 0, 0.06);
tank.add(ant);
cylMesh(0.10, 0.12, 0.30, 'y', MAT, ant, 0, 0.15, 0);
cylMesh(0.035, 0.045, 4.40, 'y', MAT, ant, 0, 2.45, 0);
mesh(new THREE.SphereGeometry(0.075, 12, 8), MAT, ant, 0, 4.68, 0);

// twin-port gun pod (front-left of dome, two stacked barrels)
const pod = new THREE.Group();
pod.position.set(-1.55, 3.35, -1.45);
pod.rotation.y = Math.atan2(-1.55, -1.45);
tank.add(pod);
mesh(new THREE.BoxGeometry(1.0, 1.05, 0.8), MAT, pod, 0, 0, 0.05);
for (const dy of [0.27, -0.27]) {
  cylMesh(0.17, 0.17, 0.35, 'z', MAT, pod, 0, dy, 0.45);
  torusMesh(0.17, 0.045, MAT, pod, 0, dy, 0.60);
  cylMesh(0.11, 0.11, 0.05, 'z', MAT_DARK, pod, 0, dy, 0.60);
}

// round side port (opposite side of dome)
const port = new THREE.Group();
port.position.set(2.02, 3.45, -0.45);
port.rotation.y = Math.atan2(2.02, -0.45);
tank.add(port);
cylMesh(0.26, 0.28, 0.55, 'z', MAT, port, 0, 0, 0.15);
torusMesh(0.20, 0.05, MAT, port, 0, 0, 0.42);
cylMesh(0.16, 0.16, 0.04, 'z', MAT_DARK, port, 0, 0, 0.42);

// U-shaped grab handles around the dome base
const handleGeo = new THREE.TorusGeometry(0.21, 0.05, 8, 16, Math.PI);
for (const [hx, hz] of [[-1.68, -1.62], [1.68, -1.62], [-2.32, 0.15], [2.32, 0.15]]) {
  mesh(handleGeo, MAT, tank, hx, 2.72, hz, 0, Math.atan2(hx, hz), 0);
}

// --------------------- exhaust stacks & pipes ------------------------------
cylMesh(0.24, 0.26, 1.50, 'y', MAT, tank, -1.35, DECK_Y + 0.65, 1.90, 20);
torusMesh(0.24, 0.045, MAT, tank, -1.35, DECK_Y + 1.40, 1.90, 'y');
const st2 = cylMesh(0.19, 0.21, 1.10, 'y', MAT, tank, -1.95, DECK_Y + 0.45, 1.30, 18);
st2.rotation.z = 0.14;                                              // leaning stack
// thin bent pipe
cylMesh(0.055, 0.055, 0.90, 'y', MAT, tank, -0.80, DECK_Y + 0.40, 2.20, 10);
const bp2 = cylMesh(0.055, 0.055, 0.70, 'y', MAT, tank, -0.80, DECK_Y + 0.95, 2.42, 10);
bp2.rotation.x = 0.65;
mesh(new THREE.SphereGeometry(0.07, 10, 8), MAT, tank, -0.80, DECK_Y + 1.20, 2.62);

// ----------------------- rotary (gatling) cannon ---------------------------
const gat = new THREE.Group();
gat.position.set(-2.05, DECK_Y + 0.05, 2.05);                       // rear-left deck corner
tank.add(gat);
cylMesh(0.30, 0.36, 0.55, 'y', MAT, gat, 0, 0.25, 0, 20);           // pedestal
mesh(new THREE.SphereGeometry(0.46, 20, 14), MAT, gat, 0, 0.72, 0); // ball mount
const cluster = new THREE.Group();
cluster.position.set(0, 0.95, 0.10);
cluster.rotation.set(0.95, 0, 0.25);                                // tilted up & rear-left
gat.add(cluster);
cylMesh(0.42, 0.46, 0.85, 'y', MAT, cluster, 0, 0.10, 0, 20);       // breech housing
const gatBarrelGeo = new THREE.CylinderGeometry(0.085, 0.085, 2.30, 12);
const gatTipGeo    = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 10);
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3;
  mesh(gatBarrelGeo, MAT, cluster, Math.cos(a) * 0.26, 1.35, Math.sin(a) * 0.26);
  mesh(gatTipGeo, MAT_DARK, cluster, Math.cos(a) * 0.26, 2.52, Math.sin(a) * 0.26);
}
cylMesh(0.34, 0.34, 0.14, 'y', MAT, cluster, 0, 0.95, 0, 20);       // mid clamp ring
cylMesh(0.34, 0.34, 0.14, 'y', MAT, cluster, 0, 1.85, 0, 20);       // front clamp ring
cylMesh(0.33, 0.33, 0.12, 'y', MAT, cluster, 0, 2.45, 0, 20);       // muzzle plate

// -------------------------- hull details -----------------------------------
const GLACIS_RX = -Math.atan(1.0 / 1.77);          // glacis slope angle
const glacisY = z => 1.35 + (z + 3.72) * (1.0 / 1.77);
mesh(new THREE.BoxGeometry(0.85, 0.12, 0.65), MAT, tank, -0.55, glacisY(-2.70) + 0.18, -2.70, GLACIS_RX); // hatch plate
mesh(new THREE.BoxGeometry(0.40, 0.32, 0.40), MAT, tank,  0.95, glacisY(-2.90) + 0.24, -2.90, GLACIS_RX); // headlight box
torusMesh(0.17, 0.055, MAT, tank, 0, 1.00, -3.86);        // tow eye on the nose
// rear deck cooling slats
for (let i = 0; i < 3; i++) {
  const z = 2.50 + i * 0.26;
  mesh(new THREE.BoxGeometry(1.20, 0.08, 0.20), MAT, tank,
    0.20, 2.35 - (z - 2.35) * (0.5 / 0.9) + 0.10, z, 0.51);
}

// --------------------------- final placement -------------------------------
tank.position.y = 0.14;   // rest track pads on the ground plane

camera.position.set(-13.5, 12, -15);
camera.lookAt(0, 2.8, 0.3);