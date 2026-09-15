// ============================================================================
// INDUSTRIAL ARTICULATED ROBOT ARM (6-axis style)
// Interpretation of the reference CAD render:
//   - rectangular machine base plate with corner mounting tabs
//   - stacked-flange rotary turntable (J1 axis)
//   - cast pedestal housing leaning slightly backwards
//   - large shoulder joint (J2) with concentric seal rings + stub shaft
//   - open A-frame forearm link rising to the elbow (J3)
//   - long cylindrical upper-arm tube ending in a stepped wrist coupling
// ============================================================================

// ------------------------------ Materials ---------------------------------
const matMain = new THREE.MeshStandardMaterial({ color: 0xbcC0c7, metalness: 0.55, roughness: 0.42 });
const matMid  = new THREE.MeshStandardMaterial({ color: 0x9ea4ad, metalness: 0.60, roughness: 0.45 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x7d838d, metalness: 0.60, roughness: 0.50 });

// ------------------------------ Helpers -----------------------------------
// Axis-aligned box, optionally rotated about Z (arm links lie in the XY plane)
function box(w, h, d, x, y, z, mat, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.z = rz;
  scene.add(m);
  return m;
}

// Cylinder along a principal axis ('x' | 'y' | 'z'); seg=6 gives hex prisms
function cyl(r, len, x, y, z, mat, axis = 'y', seg = 32) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

// Cylinder starting at `start`, extending along arbitrary direction `dir`
function cylAlong(r, len, start, dir, mat, seg = 32) {
  const d = dir.clone().normalize();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  m.position.copy(start).addScaledVector(d, len / 2);
  scene.add(m);
  return m;
}

// Box whose local Y axis follows arbitrary direction `dir`
function boxAlong(w, len, d, start, dir, mat) {
  const dn = dir.clone().normalize();
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, d), mat);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dn);
  m.position.copy(start).addScaledVector(dn, len / 2);
  scene.add(m);
  return m;
}

// ============================ 1. BASE PLATE ================================
const baseW = 18, baseH = 1.8, baseD = 18;
box(baseW, baseH, baseD, 0, baseH / 2, 0, matMain);

// Corner mounting tabs with hex anchor bolts
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => {
  box(3.4, 1.5, 3.4, sx * 9.0, 0.75, sz * 9.0, matMain);
  cyl(0.42, 0.55, sx * 9.0, 1.75, sz * 9.0, matDark, 'y', 6);
});

// Smaller mid-edge feet seen between the corner tabs
box(1.6, 1.4, 3.6,  9.4, 0.7, 0, matMain);
box(1.6, 1.4, 3.6, -9.4, 0.7, 0, matMain);
box(3.6, 1.4, 1.6, 0, 0.7,  9.4, matMain);
box(3.6, 1.4, 1.6, 0, 0.7, -9.4, matMain);

// ============================ 2. TURNTABLE (J1) ============================
// Stacked concentric ring flanges on top of the base plate
cyl(5.4, 0.9, 0, 2.25, 0, matMid);    // lower ring
cyl(4.7, 1.0, 0, 3.20, 0, matMain);   // main bearing ring
cyl(4.1, 0.8, 0, 4.10, 0, matDark);   // seal ring
cyl(3.8, 0.5, 0, 4.75, 0, matMain);   // top mounting disc

// ============================ 3. PEDESTAL HOUSING ==========================
box(8.2, 3.6, 8.2, 0.7, 6.8, 0, matMain);          // lower cast block
box(6.6, 3.6, 6.8, 0.2, 9.9, 0, matMain, -0.10);   // tilted upper housing
box(4.6, 2.2, 0.35, 0.7, 6.8,  4.15, matDark);     // front service cover
box(4.6, 2.2, 0.35, 0.7, 6.8, -4.15, matDark);     // rear service cover

// Rear counter-shaft stub with hex cap (left side of pedestal)
cyl(0.95, 1.6, -3.9, 8.2, 0, matMain, 'x');
cyl(0.70, 0.5, -4.9, 8.2, 0, matDark, 'x', 6);

// ============================ 4. SHOULDER JOINT (J2) =======================
// Large ringed joint on the side of the pedestal, axis along +Z
const S = new THREE.Vector3(-1.6, 10.9, 0);        // shoulder pivot point
cyl(3.1, 5.6, S.x, S.y, 0, matMain, 'z');          // main barrel
cyl(2.7, 0.55, S.x, S.y,  2.95, matMid,  'z');     // concentric seal rings
cyl(2.3, 0.55, S.x, S.y,  3.35, matMain, 'z');
cyl(1.8, 0.55, S.x, S.y,  3.75, matMid,  'z');
cyl(0.95, 2.2, S.x, S.y,  4.70, matMain, 'z');     // output stub shaft
cyl(0.78, 0.6, S.x, S.y,  6.00, matDark, 'z', 6);  // hex fastener
cyl(2.30, 0.6, S.x, S.y, -2.95, matDark, 'z');     // rear bearing cap

// ============================ 5. FOREARM (A-FRAME) =========================
// Open link from shoulder pivot S up to elbow pivot E
const E = new THREE.Vector3(-6.5, 19.5, 0);        // elbow pivot point
const armLen = Math.hypot(E.x - S.x, E.y - S.y);
const armAng = Math.atan2(E.y - S.y, E.x - S.x);
const ux = Math.cos(armAng), uy = Math.sin(armAng);
const armPoint = (t, z) => [S.x + ux * armLen * t, S.y + uy * armLen * t, z];

let p;
p = armPoint(0.30,  1.5); box(armLen * 0.62, 3.8, 1.6, p[0], p[1], p[2], matMain, armAng); // near plate (wide)
p = armPoint(0.78,  1.5); box(armLen * 0.48, 2.7, 1.7, p[0], p[1], p[2], matMain, armAng); // near plate (tapered)
p = armPoint(0.50, -1.9); box(armLen,        2.4, 1.1, p[0], p[1], p[2], matMain, armAng); // far straight link
p = armPoint(0.86,  2.5); box(2.4, 2.0, 0.7,              p[0], p[1], p[2], matMid,  armAng); // outer gusset

// ============================ 6. ELBOW (J3) + MOTORS =======================
cyl(2.5, 5.4, E.x, E.y,  0.0, matMain, 'z');       // elbow barrel
cyl(2.1, 0.5, E.x, E.y,  2.9, matMid,  'z');       // front seal rings
cyl(1.7, 0.5, E.x, E.y,  3.25, matMain, 'z');
cyl(2.1, 0.5, E.x, E.y, -2.9, matDark, 'z');       // rear cap

// Twin small actuator stubs sticking up/back from the elbow
const mDir = new THREE.Vector3(0.45, 0.89, 0).normalize();
[1.0, -1.0].forEach(zoff => {
  const st = new THREE.Vector3(E.x + 0.5, E.y + 1.6, zoff);
  cylAlong(0.68, 2.4, st, mDir, matMain);
  cylAlong(0.55, 0.5, st.clone().addScaledVector(mDir, 2.4), mDir, matDark, 6);
});

// Horizontal motor barrel behind the elbow (resting on pedestal top)
cyl(1.45, 3.0, 3.3, 12.8, 0, matMain, 'x');
cyl(1.10, 0.55, 5.0, 12.8, 0, matMid, 'x');

// ============================ 7. UPPER ARM TUBE ============================
// Long cylindrical arm running at ~27° above horizontal toward -X
const tAng  = THREE.MathUtils.degToRad(27);
const tDir  = new THREE.Vector3(-Math.cos(tAng), Math.sin(tAng), 0);
const tubeR = 1.55, tubeLen = 11.0;
const tubeStart = E.clone().addScaledVector(tDir, 0.6);
const tubeEnd   = tubeStart.clone().addScaledVector(tDir, tubeLen);

cylAlong(tubeR, tubeLen, tubeStart, tDir, matMain, 40);                    // arm tube
cylAlong(2.0, 1.3,  E.clone().addScaledVector(tDir, -0.2), tDir, matMid);  // elbow collar
cylAlong(1.8, 0.45, E.clone().addScaledVector(tDir, 1.05), tDir, matMain); // collar ring
cylAlong(1.8, 0.5,  tubeEnd.clone().addScaledVector(tDir, -1.0), tDir, matMid); // wrist collar

// ============================ 8. WRIST + TOOL COUPLING =====================
// Stepped, decreasing-diameter flanges at the tube tip
cylAlong(2.00, 0.9, tubeEnd.clone().addScaledVector(tDir, -0.2), tDir, matMid);  // mounting flange
cylAlong(1.75, 0.5, tubeEnd.clone().addScaledVector(tDir,  0.7), tDir, matMain); // ring
cylAlong(1.45, 1.1, tubeEnd.clone().addScaledVector(tDir,  1.2), tDir, matMain); // wrist body
cylAlong(1.25, 0.5, tubeEnd.clone().addScaledVector(tDir,  2.3), tDir, matMid);  // seal ring
cylAlong(1.40, 0.6, tubeEnd.clone().addScaledVector(tDir,  2.8), tDir, matMain); // tool flange

// Small two-prong tool coupling block at the very tip
const cplStart = tubeEnd.clone().addScaledVector(tDir, 3.4);
boxAlong(1.35, 1.5, 1.35, cplStart, tDir, matDark);
const perp = new THREE.Vector3(tDir.y, -tDir.x, 0);   // in-plane perpendicular
[-0.45, 0.45].forEach(off => {
  const s = cplStart.clone().addScaledVector(tDir, 1.4).addScaledVector(perp, off);
  cylAlong(0.30, 1.1, s, tDir, matMain, 16);
});

// ============================ CAMERA =======================================
// View from the wrist side so the arm sweeps up-left as in the reference
camera.position.set(-29, 24, 43);
camera.lookAt(-3, 12, 0);