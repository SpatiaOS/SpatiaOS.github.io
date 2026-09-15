/* =====================================================================
   Industrial articulated robot arm — reconstructed from reference image
   Interpretation (scene units, Y-up, arm sweeps in the X-Y plane):
     1. Rectangular mounting base plate with fixing holes / cable slot
     2. Cylindrical turret (J1 azimuth base) with mounting flange
     3. Shoulder joint (J2) with side discs + exposed hex drive shaft
     4. Tapered lower-arm link with parallel brace strut & balance cylinder
     5. Elbow joint (J3) with side flanges
     6. Long cylindrical forearm tube sloping down-forward
     7. Stepped wrist nose + small end-effector flange with tool bolts
   ===================================================================== */

// ---------------- Materials ----------------
const matBody = new THREE.MeshStandardMaterial({ color: 0xb4b8bc, metalness: 0.35, roughness: 0.55 });
const matMid  = new THREE.MeshStandardMaterial({ color: 0x8f9498, metalness: 0.45, roughness: 0.50 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x4b5054, metalness: 0.55, roughness: 0.45 });

// ---------------- Helpers ----------------
function addMesh(mesh, x = 0, y = 0, z = 0) { mesh.position.set(x, y, z); scene.add(mesh); return mesh; }
function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function cylY(rt, rb, h, mat, seg = 32) { return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); }
function cylZ(rt, rb, h, mat, seg = 32) {           // cylinder along Z axis
  const g = new THREE.CylinderGeometry(rt, rb, h, seg); g.rotateX(Math.PI / 2);
  return new THREE.Mesh(g, mat);
}
function hexZ(r, h, mat) {                          // hex-profile shaft along Z
  const g = new THREE.CylinderGeometry(r, r, h, 6); g.rotateX(Math.PI / 2);
  return new THREE.Mesh(g, mat);
}
function strut(a, b, r, mat) {                      // cylinder spanning two points
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = cylY(r, r, dir.length(), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

// ---------------- 1. Base plate ----------------
const PLATE = { w: 5.8, d: 5.2, h: 0.7, x: 0.3 };
addMesh(box(PLATE.w, PLATE.h, PLATE.d, matBody), PLATE.x, PLATE.h / 2, 0);
// stepped right-hand extension (fixing tabs)
addMesh(box(1.7, 0.5, 3.6, matBody), 3.7, 0.25, -0.3);
addMesh(box(1.0, 0.35, 0.9, matBody), 3.3, 0.175, 2.15);
// mounting holes on extension
addMesh(cylY(0.14, 0.14, 0.06, matDark), 4.9, 0.53, -1.1);
addMesh(cylY(0.14, 0.14, 0.06, matDark), 4.9, 0.53,  0.5);
// cable slot + pilot holes on the front face
addMesh(box(1.5, 0.34, 0.1, matDark), -0.6, 0.36, PLATE.d / 2 - 0.02);
addMesh(cylZ(0.09, 0.09, 0.1, matDark),  1.7, 0.28, PLATE.d / 2);
addMesh(cylZ(0.09, 0.09, 0.1, matDark),  2.0, 0.28, PLATE.d / 2 - 0.6);

// ---------------- 2. Turret (J1) ----------------
const T = { x: 0.3, z: 0 };
addMesh(cylY(1.95, 1.95, 0.30, matMid ), T.x, PLATE.h + 0.15, T.z);   // base flange
addMesh(cylY(1.70, 1.70, 0.50, matBody), T.x, PLATE.h + 0.55, T.z);   // ring
addMesh(cylY(1.45, 1.45, 1.30, matBody), T.x, PLATE.h + 1.45, T.z);   // barrel
addMesh(cylY(1.60, 1.60, 0.35, matMid ), T.x, PLATE.h + 2.25, T.z);   // top ring
for (let i = 0; i < 6; i++) {                                          // flange bolts
  const a = i * Math.PI / 3;
  addMesh(cylY(0.08, 0.08, 0.08, matDark), T.x + Math.cos(a) * 1.75, PLATE.h + 0.32, T.z + Math.sin(a) * 1.75);
}

// ---------------- 3. Shoulder (J2) ----------------
const S = new THREE.Vector3(0.2, 3.6, 0);
addMesh(box(1.8, 1.0, 1.6, matBody), 0.25, 3.0, 0);                   // turret-to-shoulder bridge
addMesh(cylZ(1.25, 1.25, 1.7, matBody), S.x, S.y, S.z);               // joint housing
addMesh(cylZ(1.42, 1.42, 0.35, matMid), S.x, S.y, S.z - 0.95);        // side disc
addMesh(cylZ(1.42, 1.42, 0.35, matMid), S.x, S.y, S.z + 0.95);        // side disc
addMesh(cylZ(0.50, 0.50, 0.12, matDark), S.x, S.y, S.z + 1.18);       // washer
addMesh(hexZ(0.32, 1.30, matDark), S.x, S.y, S.z + 1.85);             // exposed hex shaft
addMesh(hexZ(0.42, 0.22, matDark), S.x, S.y, S.z + 2.55);             // hex retaining nut
// balance cylinder angled under the arm root (J2 brake/motor housing)
addMesh(strut(new THREE.Vector3(-0.1, 3.3, 0), new THREE.Vector3(-1.6, 2.6, 0), 0.60, matMid));
addMesh(strut(new THREE.Vector3(-1.6, 2.6, 0), new THREE.Vector3(-2.1, 2.4, 0), 0.32, matDark));

// ---------------- 4. Lower arm (tapered link) ----------------
const E = new THREE.Vector3(-0.8, 7.2, 0);                            // elbow centre
const SE = new THREE.Vector3().subVectors(E, S);
const colGeo = new THREE.CylinderGeometry(1.12, 0.85, SE.length() + 0.6, 4);
colGeo.rotateY(Math.PI / 4);                                          // flat faces front/back
const column = new THREE.Mesh(colGeo, matBody);
column.position.copy(S).addScaledVector(SE, 0.5);
column.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), SE.clone().normalize());
scene.add(column);
// parallel brace strut (shoulder -> elbow), offset to one side
const P1 = new THREE.Vector3( 1.15, 4.40, 0.85);
const P2 = new THREE.Vector3( 0.05, 7.05, 0.85);
scene.add(strut(P1, P2, 0.17, matMid));
addMesh(cylZ(0.34, 0.34, 0.20, matMid), P1.x, P1.y, P1.z);
addMesh(cylZ(0.34, 0.34, 0.20, matMid), P2.x, P2.y, P2.z);

// ---------------- 5. Elbow (J3) ----------------
addMesh(cylZ(1.02, 1.02, 1.6, matBody), E.x, E.y, E.z);               // joint housing
addMesh(cylZ(1.18, 1.18, 0.3, matMid ), E.x, E.y, E.z - 0.9);         // side flange
addMesh(cylZ(1.18, 1.18, 0.3, matMid ), E.x, E.y, E.z + 0.9);         // side flange
addMesh(cylZ(0.45, 0.45, 0.5, matDark), E.x, E.y, E.z - 1.3);         // rear motor stub

// ---------------- 6. Forearm tube + wrist ----------------
const W = new THREE.Vector3(-5.3, 5.8, 0);                            // wrist centre
const EW = new THREE.Vector3().subVectors(W, E);
const FG = new THREE.Group();                                         // local +Y runs toward wrist
FG.position.copy(E);
FG.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), EW.clone().normalize());
scene.add(FG);
const put = (mesh, y, x = 0, z = 0) => { mesh.position.set(x, y, z); FG.add(mesh); return mesh; };

put(cylY(0.78, 0.78, 3.40, matBody), 2.00);                           // main tube
put(cylY(0.95, 0.95, 0.55, matMid ), 0.35);                           // elbow-end collar
put(cylY(0.86, 0.86, 0.28, matMid ), 2.55);                           // mid ring
put(cylY(0.55, 0.72, 0.50, matBody), 3.95);                           // tapering nose cone
put(cylY(0.60, 0.60, 0.30, matMid ), 4.30);                           // wrist collar
put(cylY(0.42, 0.42, 0.55, matBody), 4.70);                           // wrist barrel
put(cylY(0.46, 0.46, 0.12, matMid ), 5.00);                           // tool flange
// brace link from elbow down to collar lug (parallelogram linkage)
put(box(0.45, 0.55, 0.35, matBody), 0.95, 0, 0.80);
scene.add(strut(new THREE.Vector3(E.x, E.y + 0.8, 0.85),
                new THREE.Vector3(E.x - 0.955 * 0.9, E.y - 0.297 * 0.9, 0.85), 0.14, matMid));
// end effector
put(box(0.50, 0.42, 0.55, matBody), 5.25);                            // tool body
put(cylY(0.15, 0.15, 0.50, matDark), 5.60);                           // output shaft
put(cylY(0.30, 0.30, 0.10, matMid ), 5.85);                           // tool tip disc
const motor = put(cylY(0.13, 0.13, 0.55, matDark), 5.35, 0.28, 0.28); // tiny angled drive motor
motor.rotation.x = 0.6;
for (let i = 0; i < 4; i++) {                                          // flange bolts
  const a = i * Math.PI / 2 + Math.PI / 4;
  put(cylY(0.05, 0.05, 0.14, matDark), 5.07, Math.cos(a) * 0.34, Math.sin(a) * 0.34);
}

// ---------------- Camera ----------------
camera.position.set(8.5, 7.5, 11);
camera.lookAt(-1.0, 3.4, 0);