// =========================================================================
// Hand-cranked planetary-gear drum machine (recreation of the reference)
//
// Interpretation of the image:
//  * Bench-mounted base with feet and an A-frame style support.
//  * A horizontal drum / planet-pinion axle carried by the frame.
//  * A large INTERNAL ring gear (rim + internal teeth + spokes + hub),
//    its centre offset above the drum axle.
//  * A planet pinion on the drum axle meshing with the ring teeth at the
//    bottom and with a small sun gear on the ring centre axle.
//  * A carrier bar linking ring axle and drum axle.
//  * Two crank handles on the drum axle plus a small sun-gear crank.
//
// Axis convention: X = main axle direction, Y = up, Z = horizontal.
// =========================================================================

// ---------------- Materials ----------------
const matFrame = new THREE.MeshStandardMaterial({
  color: 0xa7abb3, metalness: 0.35, roughness: 0.6, side: THREE.DoubleSide
});
const matSteel = new THREE.MeshStandardMaterial({
  color: 0xc8cdd5, metalness: 0.45, roughness: 0.45, side: THREE.DoubleSide
});

// ---------------- Key parameters ----------------
const axleY  = 93;     // height of drum / pinion axle
const ringY  = 140;    // height of ring gear centre
const ringRO = 100;    // ring outer radius
const ringRI = 78;     // ring inner blank radius
const ringW  = 26;     // ring axial width
const ringNT = 54;     // ring internal teeth
const pinNT  = 20;     // planet pinion teeth
const sunNT  = 12;     // sun gear teeth
const drumR  = 25;     // drum radius

// ---------------- Helpers ----------------
function addMesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

// Cylinder whose axis lies along X
function cylX(r, len, x, y, z, mat, seg = 40) {
  const g = new THREE.CylinderGeometry(r, r, len, seg);
  g.rotateZ(Math.PI / 2);
  return addMesh(g, mat, x, y, z);
}

function boxAt(w, h, d, x, y, z, mat) {
  return addMesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
}

// Rectangular bar stretched between two points (t = thickness along X)
function barBetween(ax, ay, az, bx, by, bz, w, t, mat) {
  const a = new THREE.Vector3(ax, ay, az);
  const b = new THREE.Vector3(bx, by, bz);
  const dir = b.clone().sub(a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.BoxGeometry(t, len, w), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  scene.add(m);
  return m;
}

// Flat plate perpendicular to X, defined by (z, y) outline points
function plateYZ(pts, th, xPos, mat) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: th, bevelEnabled: false });
  g.rotateY(Math.PI / 2);
  return addMesh(g, mat, xPos, 0, 0);
}

// Ring of gear teeth around an X axis (each tooth points radially)
function gearTeeth(count, rC, radial, tang, axial, cx, cy, cz, phase, mat) {
  for (let i = 0; i < count; i++) {
    const a = phase + (i * Math.PI * 2) / count;
    const m = addMesh(new THREE.BoxGeometry(axial, radial, tang), mat,
      cx, cy + rC * Math.cos(a), cz + rC * Math.sin(a));
    m.rotation.x = a;
  }
}

// =========================================================================
// 1. Base plate and feet
// =========================================================================
boxAt(170, 12, 120, -25, 6, 0, matFrame);            // base plate
for (const fx of [-100, 50])
  for (const fz of [-48, 48])
    boxAt(22, 8, 26, fx, -4, fz, matFrame);          // rubber feet

// =========================================================================
// 2. Frame: cheeks, ring stand, braces
// =========================================================================
// Big triangular cheek just in front of the ring (holds drum axle)
plateYZ([[-55, 12], [55, 12], [0, 100]], 8, -20, matFrame);
cylX(14, 20, -18, axleY, 0, matFrame);               // its bearing boss

// Smaller front cheek near the drum front
plateYZ([[-22, 12], [22, 12], [0, 100]], 6, -92, matFrame);
cylX(12, 16, -88, axleY, 0, matFrame);               // its bearing boss

// Upright stand behind the ring carrying the ring centre axle
plateYZ([[-26, 12], [26, 12], [12, 146], [-12, 146]], 10, 18, matFrame);
cylX(14, 18, 23, ringY, 0, matFrame);                // stand boss

// Support block under the ring rim bottom
boxAt(10, 34, 30, 5, 29, 0, matFrame);

// Diagonal gusset braces on the big cheek
barBetween(-21, 13, 42, -21, 66, 8, 10, 6, matFrame);
barBetween(-21, 13, -42, -21, 66, -8, 10, 6, matFrame);

// Hex bolt details on the cheek faces
cylX(4, 5, -22.5, 40, 18, matSteel, 6);
cylX(4, 5, -22.5, 40, -18, matSteel, 6);
cylX(4, 5, -94.5, 42, 8, matSteel, 6);

// =========================================================================
// 3. Ring gear (rim + internal teeth + spokes + hub)
// =========================================================================
const rimPts = [
  new THREE.Vector2(ringRI, -ringW / 2),
  new THREE.Vector2(ringRO, -ringW / 2),
  new THREE.Vector2(ringRO,  ringW / 2),
  new THREE.Vector2(ringRI,  ringW / 2),
  new THREE.Vector2(ringRI, -ringW / 2)
];
const rimGeo = new THREE.LatheGeometry(rimPts, 96);
rimGeo.rotateZ(Math.PI / 2);                          // lathe axis Y -> X
addMesh(rimGeo, matSteel, 0, ringY, 0);

// Internal teeth (pointing inward); phase 0 leaves a tooth gap at the
// bottom (270 deg) where the planet pinion tooth engages
gearTeeth(ringNT, 73.5, 9, 3.8, 24, 0, ringY, 0, 0, matSteel);

// Five spokes (gap left at the bottom for the pinion)
for (let k = 0; k < 5; k++) {
  const a = (18 + 72 * k) * Math.PI / 180;
  const m = addMesh(new THREE.BoxGeometry(10, 60, 14), matSteel,
    0, ringY + 47 * Math.cos(a), 47 * Math.sin(a));
  m.rotation.x = a;
}
cylX(13, 26, 0, ringY, 0, matSteel);                  // ring hub

// =========================================================================
// 4. Sun gear on the fixed centre axle + axle itself
// =========================================================================
gearTeeth(sunNT, 14.6, 6.4, 3.6, 12, -5, ringY, 0, Math.PI / 12, matSteel);
cylX(8, 56, 2, ringY, 0, matSteel);                   // centre axle

// =========================================================================
// 5. Drum axle, drum and planet pinion
// =========================================================================
cylX(8, 113, -43.5, axleY, 0, matSteel);              // main axle
cylX(drumR, 58, -51, axleY, 0, matSteel, 48);         // drum body
cylX(26.5, 14, -51, axleY, 0, matSteel, 48);          // drum centre band
cylX(29, 6, -77, axleY, 0, matSteel, 48);             // front flange
cylX(29, 6, -25, axleY, 0, matSteel, 48);             // rear flange
cylX(12.5, 16, -84, axleY, 0, matSteel);              // front collar

// Planet pinion (meshes with ring teeth at bottom) - tooth points down
cylX(24, 24, 1, axleY, 0, matSteel, 48);              // pinion root
gearTeeth(pinNT, 27.25, 6.5, 3.9, 24, 1, axleY, 0, -Math.PI / 2, matSteel);

// =========================================================================
// 6. Planet carrier bar (ring axle -> drum axle)
// =========================================================================
boxAt(6, 56, 14, -20, 116.5, 0, matSteel);
cylX(10, 14, -20, ringY, 0, matSteel);                // carrier top boss

// =========================================================================
// 7. Crank handles
// =========================================================================
// --- Long crank (front of drum axle) ---
cylX(11, 10, -98, axleY, 0, matSteel);                // crank hub
cylX(12.5, 5, -105.5, axleY, 0, matSteel);            // end cap
barBetween(-98, axleY, 0, -102, 248, -34, 16, 8, matSteel);   // arm
cylX(12, 12, -102, 248, -34, matSteel);               // elbow boss
cylX(9, 40, -128, 248, -34, matSteel, 28);            // grip
cylX(10.5, 4, -150, 248, -34, matSteel, 28);          // grip end cap

// --- Short crank (mounted on drum front flange) ---
cylX(11, 8, -73, axleY, 0, matSteel);                 // crank hub
barBetween(-72, axleY, 0, -75, 194, -8, 15, 8, matSteel);     // arm
cylX(11, 11, -75, 194, -8, matSteel);                 // elbow boss
cylX(8, 34, -96, 194, -8, matSteel, 28);              // grip
cylX(9.5, 4, -115, 194, -8, matSteel, 28);            // grip end cap

// --- Small sun-gear crank inside the ring ---
cylX(9, 8, -31, ringY, 0, matSteel);                  // hub
barBetween(-31, ringY, 0, -34, 182, -10, 12, 6, matSteel);    // arm
cylX(9, 9, -34, 182, -10, matSteel);                  // elbow boss
cylX(7, 22, -48, 182, -10, matSteel, 24);             // grip

// =========================================================================
// 8. Small locking-pin detail below the drum front
// =========================================================================
cylX(5, 20, -102, 70, 5, matSteel, 20);
boxAt(10, 12, 14, -113, 70, 5, matSteel);

// =========================================================================
// 9. Camera
// =========================================================================
camera.position.set(-300, 250, 300);
camera.lookAt(-42, 116, 0);
if (typeof controls !== "undefined" && controls.target) {
  controls.target.set(-42, 116, 0);
  controls.update();
}