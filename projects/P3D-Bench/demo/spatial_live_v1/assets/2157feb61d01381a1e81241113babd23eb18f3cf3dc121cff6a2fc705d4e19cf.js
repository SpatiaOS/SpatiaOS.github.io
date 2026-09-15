// ============================================================
// Industrial 6-axis robot arm (articulated manipulator)
// Interpretation: square base plate with mounting tabs,
// rotary swivel, tilted shoulder housing, elbow joint drum
// with hex shaft, tilted upper arm link, parallel support rod,
// and a segmented cylindrical wrist ending in a tool flange.
// Arm motion plane = Y-Z plane; joint axes along X.
// ============================================================

// ---------- Parameters ----------
const baseW = 36, baseH = 6, baseD = 36;      // base plate
const tabL = 8, tabW = 12, tabH = 4;          // mounting tabs
const swivelR = 9, swivelH = 4;               // rotary base
const jointY = 18, jointZ = 4;                // elbow/shoulder drum center
const jointR = 6.5, jointLen = 14;
const housingTilt = THREE.MathUtils.degToRad(18);  // shoulder housing lean
const upperLen = 20;
const upperTilt = THREE.MathUtils.degToRad(25);    // upper arm lean from vertical
const wristElev = THREE.MathUtils.degToRad(35);    // wrist axis above horizontal

const matBody = new THREE.MeshStandardMaterial({ color: 0xb4b7bc, metalness: 0.25, roughness: 0.55 });

// ---------- Helpers ----------
function addPart(geo, parent, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, matBody);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (r, h, seg = 32) => new THREE.CylinderGeometry(r, r, h, seg);
function cylBetween(a, b, r, parent = scene) {
  const va = new THREE.Vector3(a[0], a[1], a[2]);
  const vb = new THREE.Vector3(b[0], b[1], b[2]);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 24), matBody);
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  parent.add(m);
  return m;
}

// ---------- Base plate with mounting tabs ----------
addPart(box(baseW, baseH, baseD), scene, 0, baseH / 2, 0);
addPart(box(tabL, tabH, tabW), scene,  baseW / 2 + tabL / 2 - 1, baseH / 2, 0);
addPart(box(tabL, tabH, tabW), scene, -baseW / 2 - tabL / 2 + 1, baseH / 2, 0);
addPart(box(tabW, tabH, tabL), scene, 0, baseH / 2,  baseD / 2 + tabL / 2 - 1);
addPart(box(tabW, tabH, tabL), scene, 0, baseH / 2, -baseD / 2 - tabL / 2 + 1);
// front face panel + connector details
addPart(box(10, 4, 1), scene, -5, 3, baseD / 2 + 0.4);
addPart(cyl(1.2, 1.2, 16), scene, 4, 3, baseD / 2 + 0.4, Math.PI / 2, 0, 0);
addPart(cyl(1.2, 1.2, 16), scene, 7, 3, baseD / 2 + 0.4, Math.PI / 2, 0, 0);

// ---------- Rotary swivel ----------
addPart(cyl(swivelR, swivelH, 40), scene, 0, baseH + swivelH / 2, 0);
addPart(cyl(swivelR - 1.5, 3, 40), scene, 0, baseH + swivelH + 1.5, 0);

// ---------- Tilted shoulder housing ----------
addPart(box(12, 15, 12), scene, 0, 12, 2, housingTilt, 0, 0);
addPart(box(5, 6, 6), scene, -8, 15, 2); // side motor stub

// ---------- Main joint drum (axis X) with hex shaft ----------
const J = [0, jointY, jointZ];
addPart(cyl(jointR, jointLen, 40), scene, J[0], J[1], J[2], 0, 0, Math.PI / 2);
addPart(cyl(jointR + 0.8, 2, 40), scene, J[0] - 7, J[1], J[2], 0, 0, Math.PI / 2);   // bearing ring
addPart(cyl(jointR - 1.2, 3, 40), scene, J[0] - 9, J[1], J[2], 0, 0, Math.PI / 2);   // inner ring
addPart(new THREE.CylinderGeometry(2.3, 2.3, 9, 6), scene, J[0] + 11, J[1], J[2], 0, 0, Math.PI / 2); // hex shaft
addPart(new THREE.CylinderGeometry(1.6, 1.6, 2, 6), scene, J[0] + 16, J[1], J[2], 0, 0, Math.PI / 2); // hex cap

// ---------- Upper arm link (tilted box with segment plates) ----------
const uV = new THREE.Vector3(0, Math.cos(upperTilt), Math.sin(upperTilt));
const WV = new THREE.Vector3(J[0], J[1] + upperLen * uV.y, J[2] + upperLen * uV.z);
const armMid = new THREE.Vector3(J[0], J[1], J[2]).addScaledVector(uV, upperLen / 2);
addPart(box(9, upperLen + 3, 7), scene, armMid.x, armMid.y, armMid.z, upperTilt, 0, 0);
for (const t of [8, 14]) { // segment ridges
  const p = new THREE.Vector3(J[0], J[1], J[2]).addScaledVector(uV, t);
  addPart(box(9.6, 1.2, 7.6), scene, p.x, p.y, p.z, upperTilt, 0, 0);
}

// ---------- Wrist pivot at top of upper arm ----------
addPart(cyl(4, 12, 32), scene, WV.x, WV.y, WV.z, 0, 0, Math.PI / 2);
addPart(new THREE.CylinderGeometry(1.5, 1.5, 3, 6), scene, WV.x + 7, WV.y, WV.z, 0, 0, Math.PI / 2);

// ---------- Wrist assembly (segmented cylinder chain + tool flange) ----------
const wrist = new THREE.Group();
wrist.position.copy(WV);
wrist.rotation.x = Math.PI / 2 - wristElev; // local +Y = wrist axis
scene.add(wrist);
addPart(box(9, 8, 8), wrist, 0, 2, 0);                 // wrist joint block
addPart(cyl(3.4, 20, 32), wrist, 0, 12, 0);            // main wrist tube
addPart(cyl(4.4, 3, 32), wrist, 0, 23, 0);             // roll ring 1
addPart(cyl(3.6, 6, 32), wrist, 0, 27, 0);             // tube segment 2
addPart(cyl(4.3, 2.5, 32), wrist, 0, 31, 0);           // roll ring 2
addPart(cyl(2.5, 5, 32), wrist, 0, 34.5, 0);           // tube segment 3
addPart(box(5, 4, 5), wrist, 0, 38, 0);                // tool flange block
addPart(cyl(2.0, 1.5, 24), wrist, 0, 40.5, 0);         // flange disc
addPart(cyl(1.1, 3, 20), wrist, 0, 42.2, 0);           // tool tip
// two counterbalance / motor stubs on top rear of wrist
addPart(cyl(1.1, 6, 16), wrist, 0, 9, -6, Math.PI / 2, 0, 0);
addPart(cyl(1.1, 6, 16), wrist, 0, 3, -6, Math.PI / 2, 0, 0);

// ---------- Parallel support rod behind upper arm ----------
const dV = new THREE.Vector3(0, Math.sin(wristElev), Math.cos(wristElev)); // wrist axis dir
const pV = new THREE.Vector3(0, Math.cos(wristElev), -Math.sin(wristElev)); // perpendicular in arm plane
const rodA = WV.clone().addScaledVector(pV, 5).addScaledVector(dV, 4);
const rodB = new THREE.Vector3(J[0], J[1], J[2]).addScaledVector(pV, 6).add(new THREE.Vector3(0, 2, 0));
cylBetween([rodA.x, rodA.y, rodA.z], [rodB.x, rodB.y, rodB.z], 1.4);

// ---------- Camera ----------
camera.position.set(70, 55, 70);
camera.lookAt(0, 22, 4);