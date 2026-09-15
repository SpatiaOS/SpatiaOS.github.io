// ==========================================================================
//  HAND-CRANK WINCH  /  PLANETARY (INTERNAL RING-GEAR) REDUCTION UNIT
//
//  Interpretation of the reference image:
//    • A large drum whose bore carries an INTERNAL ring gear, seen almost
//      face-on (both the near and the far teeth are visible through the bore).
//    • Inside the drum: a sun gear + 3 planet gears on a spider carrier.
//    • The drum turns on an axle carried by a triangular frame:
//      a solid plate on the near side, an open bar-triangle on the far side,
//      both standing on a rectangular ground frame with 4 foot pads.
//    • An inclined input shaft leaves the drum hub through a tapered housing
//      and runs down/left to a long two-position hand crank with tubular grips.
// ==========================================================================

/* ------------------------------ MATERIAL ------------------------------- */
const steel = new THREE.MeshStandardMaterial({
  color: 0xb1b5ba,
  metalness: 0.35,
  roughness: 0.55
});

/* -------------------------------- ROOT --------------------------------- */
const machine = new THREE.Group();
scene.add(machine);

/* ----------------------------- PARAMETERS ------------------------------ */
// One gear module drives every tooth in the model
const MODULE       = 0.34;

// --- big ring-gear drum -------------------------------------------------
const ringTeeth    = 60;
const ringPitchR   = ringTeeth * MODULE / 2;        // 10.20 pitch radius
const rimInnerR    = ringPitchR + 1.25 * MODULE;    // 10.63 drum bore (tooth root)
const rimOuterR    = 13.0;                          // outer radius of drum
const rimWidth     = 4.2;                           // axial width of drum
const gearFace     = 3.0;                           // face width of all gears

// --- planetary train ----------------------------------------------------
const sunTeeth     = 18;
const planetTeeth  = 21;                            // (ringTeeth-sunTeeth)/2
const nPlanets     = 3;
const sunPitchR    = sunTeeth   * MODULE / 2;       // 3.06
const planetPitchR = planetTeeth* MODULE / 2;       // 3.57
const orbitR       = sunPitchR + planetPitchR;      // 6.63 planet-centre circle

// --- machine layout -----------------------------------------------------
const hubY         = 16.5;      // height of drum axis above ground
const zPlate       = 3.5;       // plane of the near (solid) frame plate
const zBack        = -3.9;      // plane of the far (bar) frame
const railZ        = 4.3;       // ground rails offset from centre plane
const baseXL       = -13.5;     // ground frame extents
const baseXR       =  12.5;
const footH        = 0.9;       // foot pad height
const railTop      = 2.4;       // top of the ground rails

// --- input shaft & crank ------------------------------------------------
const shaftLen     = 19.0;      // hub  ->  crank boss
const bearingAt    = 9.0;       // where the frame plate carries the shaft
const arm1Len      = 32.0;      // long crank arm
const arm2Len      = 20.0;      // short (high-gear) crank arm
const arm1Roll     = 0.30;      // angular positions of the two arms (rad)
const arm2Roll     = -0.20;
const gripLen      = 8.0;
const gripR        = 1.15;

/* ------------------------------ HELPERS -------------------------------- */
function mesh(geo, parent, x, y, z, rx, ry, rz) {
  const m = new THREE.Mesh(geo, steel);
  m.position.set(x || 0, y || 0, z || 0);
  m.rotation.set(rx || 0, ry || 0, rz || 0);
  (parent || machine).add(m);
  return m;
}
function box(parent, w, h, d, x, y, z, rx, ry, rz) {
  return mesh(new THREE.BoxGeometry(w, h, d), parent, x, y, z, rx, ry, rz);
}
// cylinder with its axis along local Z
function cylZ(parent, r, h, x, y, z, seg) {
  return mesh(new THREE.CylinderGeometry(r, r, h, seg || 24),
              parent, x, y, z, Math.PI / 2, 0, 0);
}
// cylinder with its axis along local X (radiusTop faces +X)
function cylX(parent, rTop, rBot, h, x, y, z, seg) {
  return mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg || 24),
              parent, x, y, z, 0, 0, -Math.PI / 2);
}
// flat bar between two points of an XY plane at height z
function strut(parent, x1, y1, x2, y2, z, w, d) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  return box(parent, len, w, d, (x1 + x2) / 2, (y1 + y2) / 2, z,
             0, 0, Math.atan2(dy, dx));
}
// flat ring (annulus) extruded along Z
function annulus(parent, rOut, rIn, width, x, y, z) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  h.absarc(0, 0, rIn, 0, Math.PI * 2, true);
  s.holes.push(h);
  const g = new THREE.ExtrudeGeometry(s, { depth: width, bevelEnabled: false, curveSegments: 120 });
  g.translate(0, 0, -width / 2);
  return mesh(g, parent, x, y, z);
}
// flat polygonal plate extruded along Z
function plate(parent, pts, thickness, z) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thickness, bevelEnabled: false });
  g.translate(0, 0, -thickness / 2);
  return mesh(g, parent, 0, 0, z);
}
// external spur gear (body + simplified rectangular teeth)
function spurGear(parent, cx, cy, cz, nTeeth, face, phase) {
  const g = new THREE.Group();
  g.position.set(cx, cy, cz);
  g.rotation.z = phase || 0;
  parent.add(g);
  const pitchR = nTeeth * MODULE / 2;
  const rootR  = pitchR - 1.25 * MODULE;
  const tipR   = pitchR + MODULE;
  const tH     = tipR - rootR;
  const tW     = Math.PI * MODULE * 0.55;
  cylZ(g, rootR, face, 0, 0, 0, 40);
  for (let i = 0; i < nTeeth; i++) {
    const a = i * 2 * Math.PI / nTeeth;
    box(g, tH, tW, face, Math.cos(a) * (rootR + tH / 2), Math.sin(a) * (rootR + tH / 2), 0, 0, 0, a);
  }
  return g;
}
// internal ring-gear teeth (teeth point inwards from the drum bore)
function internalTeeth(parent, nTeeth, face) {
  const pitchR = nTeeth * MODULE / 2;
  const rootR  = pitchR + 1.25 * MODULE;   // outside (attached to drum bore)
  const tipR   = pitchR - MODULE;          // inside
  const tH     = rootR - tipR;
  const tW     = Math.PI * MODULE * 0.55;
  for (let i = 0; i < nTeeth; i++) {
    const a = i * 2 * Math.PI / nTeeth;
    box(parent, tH, tW, face, Math.cos(a) * (tipR + tH / 2), Math.sin(a) * (tipR + tH / 2), 0, 0, 0, a);
  }
}

/* ========================= 1.  GROUND FRAME ============================= */
const frame = new THREE.Group();
machine.add(frame);

// two long ground rails (running across the drum axis)
box(frame, baseXR - baseXL, railTop - footH, 1.8, (baseXL + baseXR) / 2, (railTop + footH) / 2,  railZ);
box(frame, baseXR - baseXL, railTop - footH, 1.8, (baseXL + baseXR) / 2, (railTop + footH) / 2, -railZ);
// two cross rails
box(frame, 1.8, railTop - footH, 2 * railZ + 1.8, baseXL + 0.9, (railTop + footH) / 2, 0);
box(frame, 1.8, railTop - footH, 2 * railZ + 1.8, baseXR - 0.9, (railTop + footH) / 2, 0);
// four foot pads
[[baseXL + 0.6, railZ], [baseXL + 0.6, -railZ],
 [baseXR - 0.6, railZ], [baseXR - 0.6, -railZ]].forEach(function (p) {
  box(frame, 3.2, footH, 2.8, p[0], footH / 2, p[1]);
});

/* -------- near side: solid triangular plate carrying the shaft --------- */
// apex sits exactly on the inclined input-shaft axis
const plateOutline = [
  [baseXL + 1.0, railTop],
  [ 6.5,         railTop],
  [-7.0,        14.7],
  [-9.9,        14.0]
];
plate(frame, plateOutline, 0.8, zPlate);
// edge stiffener along the sloping face
strut(frame, 6.5, railTop + 0.3, -7.0, 14.4, zPlate + 0.75, 1.0, 0.7);

/* -------- far side: open bar triangle around the drum axle ------------- */
strut(frame, -11.5, railTop, -1.1, hubY - 0.6, zBack, 1.5, 1.0);
strut(frame,  11.5, railTop,  1.1, hubY - 0.6, zBack, 1.5, 1.0);
cylZ(frame, 2.3, 1.6, 0, hubY, zBack, 28);           // rear bearing boss

/* ========================= 2.  DRUM / RING GEAR ========================= */
const drum = new THREE.Group();
drum.position.set(0, hubY, 0);
machine.add(drum);

annulus(drum, rimOuterR, rimInnerR, rimWidth, 0, 0, 0);                       // drum body
annulus(drum, rimOuterR + 0.45, rimOuterR - 0.9, 0.9, 0, 0,  rimWidth/2 - 0.45); // front lip
annulus(drum, rimOuterR + 0.45, rimOuterR - 0.9, 0.9, 0, 0, -rimWidth/2 + 0.45); // rear lip
internalTeeth(drum, ringTeeth, gearFace);                                    // internal teeth

/* ======================= 3.  PLANETARY TRAIN =========================== */
const train = new THREE.Group();
drum.add(train);

// sun gear on the drum axle
spurGear(train, 0, 0, 0, sunTeeth, gearFace, 0);

// three planets + pins + spider arms
for (let i = 0; i < nPlanets; i++) {
  const a = Math.PI / 2 + i * 2 * Math.PI / nPlanets;
  const px = Math.cos(a) * orbitR, py = Math.sin(a) * orbitR;
  spurGear(train, px, py, 0, planetTeeth, gearFace, Math.PI / planetTeeth); // half-tooth phase
  cylZ(train, 0.8, 6.6, px, py, -1.0, 16);                                  // planet pin
  strut(train, 0, 0, px, py, -2.7, 1.7, 1.0);                               // carrier arm
}
cylZ(train, 2.1, 1.4, 0, 0, -2.7, 28);        // carrier hub
cylZ(machine, 1.35, 7.4, 0, hubY, -2.0, 24);  // main axle (drum -> rear bearing)

/* ==================== 4.  INCLINED INPUT SHAFT ========================= */
// local frame:  X = shaft axis, Y = "up" perpendicular, Z = side
const shaftAxis = new THREE.Vector3(-0.95, -0.28, 0.12).normalize();
const yLocal = new THREE.Vector3(0, 1, 0)
  .sub(shaftAxis.clone().multiplyScalar(shaftAxis.y)).normalize();
const zLocal = new THREE.Vector3().crossVectors(shaftAxis, yLocal).normalize();

const drive = new THREE.Group();
drive.position.set(0, hubY, 2.4);                       // starts at the drum hub
drive.quaternion.setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(shaftAxis, yLocal, zLocal));
machine.add(drive);

cylX(drive, 1.7, 3.5, 7.0, 3.5, 0, 0, 28);              // tapered gearbox nose
cylX(drive, 1.05, 1.05, shaftLen, shaftLen / 2, 0, 0);  // shaft
cylX(drive, 2.15, 2.15, 2.6, bearingAt, 0, 0, 28);      // bearing inside frame plate
cylX(drive, 1.55, 1.55, 2.0, shaftLen - 1.2, 0, 0);     // outboard boss
// ratchet / pawl release rod running parallel under the shaft
cylX(drive, 0.55, 0.55, 11.0, 12.0, -2.3, 1.2, 16);
cylX(drive, 0.95, 0.95, 1.2, 17.8, -2.3, 1.2, 16);

/* ========================= 5.  HAND CRANK ============================== */
const crank = new THREE.Group();
crank.position.set(shaftLen + 0.5, 0, 0);               // sits on the shaft end
drive.add(crank);
cylX(crank, 1.7, 1.7, 2.2, 0, 0, 0, 24);                // crank boss

function crankArm(roll, len) {
  const g = new THREE.Group();
  g.rotation.x = roll;                                   // angular position on the shaft
  crank.add(g);
  box(g, 1.35, len, 1.1, 0.9, len / 2, 0);               // main bar
  box(g, 3.8, 1.35, 1.1, 2.6, len + 0.2, 0);             // elbow towards the grip
  cylX(g, gripR, gripR, gripLen, 4.5 + gripLen / 2, len + 0.2, 0, 20);  // tubular grip
  cylX(g, 0.55, 0.55, 1.0, 4.5 + gripLen + 0.4, len + 0.2, 0, 16);      // grip end pin
  cylX(g, 1.45, 1.45, 0.8, 4.4, len + 0.2, 0, 20);       // grip collar
  return g;
}
crankArm(arm1Roll, arm1Len);   // long / low-gear arm
crankArm(arm2Roll, arm2Len);   // short / high-gear arm

/* ================= 6.  CENTRE MODEL & SET THE VIEW ===================== */
machine.position.set(13, -20, 0);       // put the assembly centre near origin

camera.position.set(-40, 26, 53);
camera.lookAt(0, 0, 0);