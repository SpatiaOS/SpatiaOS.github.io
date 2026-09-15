// =====================================================================
//  Industrial 6-axis robot arm — reconstructed from the reference image
//  Y is up.  The forearm reaches toward -X (screen upper-left) while the
//  shoulder / elbow rotary axes run along Z (+Z faces the viewer's right).
// =====================================================================

// ------------------------------ materials ----------------------------
const matBody  = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.60, roughness: 0.50 });
const matLight = new THREE.MeshStandardMaterial({ color: 0xb9bfc5, metalness: 0.55, roughness: 0.55 });
const matDark  = new THREE.MeshStandardMaterial({ color: 0x6f767b, metalness: 0.70, roughness: 0.45 });

// ------------------------------- helpers ------------------------------
const Y_UP = new THREE.Vector3(0, 1, 0);
const deg  = (d) => d * Math.PI / 180;

function addBox(w, h, d, x, y, z, mat, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || matBody);
  m.position.set(x, y, z);
  (parent || scene).add(m);
  return m;
}

function addCyl(rTop, rBot, h, seg, x, y, z, mat, parent) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat || matBody);
  m.position.set(x, y, z);
  (parent || scene).add(m);
  return m;
}

// flat disc whose face points along +Z (used for the joint ring stacks)
function addDiscZ(r, h, x, y, z, mat, parent) {
  const m = addCyl(r, r, h, 32, x, y, z, mat || matLight, parent);
  m.rotation.x = Math.PI / 2;
  return m;
}

// hex bolt head, axis = 'x' | 'y' | 'z'
function addBolt(x, y, z, r, h, axis, parent, mat) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.92, h, 6), mat || matDark);
  m.position.set(x, y, z);
  if (axis === 'z')      m.rotation.x = Math.PI / 2;
  else if (axis === 'x') m.rotation.z = Math.PI / 2;
  (parent || scene).add(m);
  return m;
}

// cylinder spanning two points
function addRod(p1, p2, r, seg, mat) {
  const d = new THREE.Vector3().subVectors(p2, p1);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), seg || 16), mat || matBody);
  m.position.copy(p1).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(Y_UP, d.clone().normalize());
  scene.add(m);
  return m;
}

// =====================================================================
//  1.  BASE  — square mounting plate with side lugs and corner pads
// =====================================================================
const baseW  = 10;          // footprint
const baseD  = 10;
const plateH = 0.9;         // lower plate
const lipH   = 0.5;         // step on top of it

addBox(baseW, plateH, baseD, 0, plateH / 2, 0);                       // 0.0 -> 0.9
addBox(baseW - 1.2, lipH, baseD - 1.2, 0, plateH + lipH / 2, 0);      // 0.9 -> 1.4

// four side lugs, each carrying two hex bolts
const lugH = 0.8, lugL = 3.0, lugOut = 1.5;
[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
  const isX = dx !== 0;
  const lx  = dx * (baseW / 2 + lugOut / 2 - 0.1);
  const lz  = dz * (baseD / 2 + lugOut / 2 - 0.1);
  addBox(isX ? lugOut : lugL, lugH, isX ? lugL : lugOut, lx, 0.5, lz);
  [-1, 1].forEach(s => {
    addBolt(isX ? lx : s * 0.9, lugH + 0.2, isX ? s * 0.9 : lz, 0.28, 0.30, 'y');
  });
});

// corner pads with a bolt
const cOff = baseW / 2 - 1.4;
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => {
  addBox(1.9, 0.5, 1.9, sx * cOff, plateH + lipH + 0.25, sz * cOff);
  addBolt(sx * cOff, plateH + lipH + 0.65, sz * cOff, 0.30, 0.30, 'y');
});

// =====================================================================
//  2.  PLINTH, TURNTABLE AND SWIVEL RIM
// =====================================================================
addBox(6.6, 1.0, 6.6, 0, 1.90, 0);                       // plinth       1.4 -> 2.4
addBox(5.4, 0.5, 5.4, 0, 2.65, 0);                       // stepped top  2.4 -> 2.9

// small service panel with two bolts on the front face
addBox(1.6, 1.2, 0.25, 0.4, 1.90, 3.32, matLight);
addBolt(0.05, 1.75, 3.48, 0.16, 0.25, 'z');
addBolt(0.75, 1.75, 3.48, 0.16, 0.25, 'z');

addCyl(2.90, 2.90, 1.00, 48, 0, 3.40, 0, matLight);      // turntable    2.9 -> 3.9
addDiscZ(2.45, 0.35, 0, 4.075, 0, matDark);              // rotating rim 3.9 -> 4.25

// =====================================================================
//  3.  WAIST (lower body) — sits on the turntable
// =====================================================================
addBox(4.6, 3.0, 4.2, 0, 5.50, 0);                       // 4.0 -> 7.0
addBox(4.0, 1.6, 3.6, 0, 7.50, 0);                       // shoulder bracket 6.7 -> 8.3
addBox(4.8, 0.5, 4.4, 0, 4.25, 0, matLight);             // skirt ring

// =====================================================================
//  4.  SHOULDER JOINT — cylinder along Z with concentric ring stack
// =====================================================================
const shX = 0.30, shY = 6.90, shZ = 0.60;                // shoulder centre
const shR = 1.85;

const hub = addCyl(shR, shR, 3.4, 40, shX, shY, shZ, matBody);
hub.rotation.x = Math.PI / 2;                            // axis -> Z  (z -1.1 .. 2.3)

// ring stack on the +Z face
const rings = [[1.55, 0.30], [1.20, 0.28], [0.85, 0.26], [0.55, 0.24]];
let ringZ = shZ + 1.7;                                   // = 2.30
rings.forEach(([r, h]) => {
  addDiscZ(r, h, shX, shY, ringZ + h / 2, matLight);
  ringZ += h;
});

// protruding output shaft with a hexagonal end fitting + bore
addDiscZ(0.45, 0.95, shX, shY, ringZ + 0.475, matBody);  // shaft
const hexEndZ = ringZ + 0.95;
const hexEnd = addCyl(0.78, 0.78, 0.70, 6, shX, shY, hexEndZ + 0.35, matDark);
hexEnd.rotation.x = Math.PI / 2;
addDiscZ(0.45, 0.30, shX, shY, hexEndZ + 0.85, matBody); // end cap
const bore = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.09, 8, 24), matDark);
bore.position.set(shX, shY, hexEndZ + 1.00);
scene.add(bore);

// =====================================================================
//  5.  UPPER ARM — tilts 23° toward -X, carries the elbow at its top
// =====================================================================
const ARM_LEAN = deg(23);
const ARM_LEN  = 5.0;                                    // shoulder -> elbow

const arm = new THREE.Group();
arm.position.set(shX, shY, 0.8);
arm.rotation.z = ARM_LEAN;                               // local +Y leans to -X
scene.add(arm);

addBox(3.0, 2.6, 3.4, 0, 1.30, 0, matBody,  arm);        // lower housing
addBox(2.3, 2.6, 2.8, 0, 3.70, 0, matBody,  arm);        // upper housing
addBox(2.8, 1.0, 3.6, 0, 0.30, 0, matLight, arm);        // base collar

// elbow of the group (world position)
const elbow = new THREE.Vector3(
  shX - ARM_LEN * Math.sin(ARM_LEAN),
  shY + ARM_LEN * Math.cos(ARM_LEAN),
  0.8
);

// elbow joint barrel (axis along Z) + ring
const elbowBarrel = addCyl(1.20, 1.20, 3.0, 32, elbow.x, elbow.y, elbow.z, matBody);
elbowBarrel.rotation.x = Math.PI / 2;
addDiscZ(0.85, 0.28, elbow.x, elbow.y, elbow.z + 1.64, matLight);
addDiscZ(0.42, 0.65, elbow.x, elbow.y, elbow.z + 2.10, matBody);

// =====================================================================
//  6.  FOREARM TUBE + WRIST  (rises 17° above horizontal toward -X)
// =====================================================================
const TUBE_ANGLE = deg(17);
const tubeDir = new THREE.Vector3(-Math.cos(TUBE_ANGLE), Math.sin(TUBE_ANGLE), 0).normalize();

const forearm = new THREE.Group();
forearm.position.copy(elbow);
forearm.quaternion.setFromUnitVectors(Y_UP, tubeDir);   // local +Y = tube axis
scene.add(forearm);

// --- tube ---
addCyl(0.68, 0.68, 6.40, 32, 0, 2.20, 0, matBody, forearm);      // local y -1.0 .. 5.4

// --- flanges near the elbow ---
addDiscZ(1.05, 0.40, 0, -0.85, 0, matLight, forearm);
addDiscZ(0.95, 0.35, 0, -0.30, 0, matBody,  forearm);
addDiscZ(1.15, 0.45, 0,  0.35, 0, matLight, forearm);

// --- wrist: stepped rings down to the tool flange ---
const wrist = [
  [1.00, 0.50, 5.65],
  [0.78, 0.40, 6.10],
  [0.60, 0.35, 6.48],
  [0.85, 0.30, 6.80]        // tool flange
];
wrist.forEach(([r, h, y]) => addDiscZ(r, h, 0, y, 0, matLight, forearm));

// bolts on the tool flange face
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2 + Math.PI / 4;
  addBolt(Math.cos(a) * 0.62, 6.98, Math.sin(a) * 0.62, 0.10, 0.22, 'y', forearm);
}

addCyl(0.35, 0.35, 0.90, 20, 0, 7.40, 0, matBody,  forearm);     // small shaft
addCyl(0.50, 0.50, 0.30, 20, 0, 8.00, 0, matLight, forearm);     // end disc
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2 + Math.PI / 4;
  addBolt(Math.cos(a) * 0.32, 8.20, Math.sin(a) * 0.32, 0.08, 0.15, 'y', forearm);
}

// --- clevis plates that clamp the tube at the elbow ---
[-1.30, 1.30].forEach(dz => {
  addBox(2.20, 2.00, 0.35, 0, 0.60, dz, matLight, forearm);
});

// =====================================================================
//  7.  PARALLEL LINK ROD  (top of arm  ->  bracket near the shoulder)
// =====================================================================
const linkTop = new THREE.Vector3(elbow.x + 0.25, elbow.y - 0.35, 2.35);
const linkBot = new THREE.Vector3(0.95, 7.85, 1.90);

addRod(linkTop, linkBot, 0.17, 14, matBody);
[linkTop, linkBot].forEach(p => {
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), matDark);
  ball.position.copy(p);
  scene.add(ball);
});
addBox(0.7, 0.9, 0.6, linkBot.x, linkBot.y, linkBot.z, matBody);   // pivot bracket

// =====================================================================
//  8.  CAMERA
// =====================================================================
camera.position.set(17, 14, 17);
camera.lookAt(-1.5, 6.5, 0);