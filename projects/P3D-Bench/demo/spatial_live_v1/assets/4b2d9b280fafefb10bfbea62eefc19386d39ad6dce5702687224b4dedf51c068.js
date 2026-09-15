// ============================================================================
//  4-AXIS PALLETIZING / MATERIAL-HANDLING ROBOT  (parametric reconstruction)
//
//  Interpretation of the reference image:
//    - Square mounting base plate with stepped corner pads + bolt bosses
//      and a small connector box on one side face
//    - Circular slew bearing / turntable  (axis 1, rotation about Y)
//    - Chunky faceted pedestal casting carrying a large ringed gearbox hub
//      with a hexagonal output shaft pointing toward the viewer (axis 2)
//    - Boxy lower arm leaning up/left + slim rear parallel link
//    - Long tubular forearm (axis 3) with corrugated bellows section,
//      wrist drive motors mounted on its rear end
//    - Small wrist / tool flange with clevis ears at the tip
//
//  Local design convention: the arm works in the local X-Y plane, all joint
//  axes are parallel to local Z.  The whole arm assembly is then swung about
//  Y (axis 1) so the shoulder shaft points toward the camera, as in the image.
// ============================================================================

// ------------------------------- Materials ---------------------------------
const matBody = new THREE.MeshStandardMaterial({ color: 0xb6babf, metalness: 0.35, roughness: 0.55 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x8f949a, metalness: 0.45, roughness: 0.45 });

// ------------------------------- Helpers -----------------------------------
function place(geo, parent, x, y, z, rx, ry, rz, mtl) {
  const m = new THREE.Mesh(geo, mtl || matBody);
  m.position.set(x || 0, y || 0, z || 0);
  m.rotation.set(rx || 0, ry || 0, rz || 0);
  parent.add(m);
  return m;
}
function boxG(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
// cylinder with its axis along 'x', 'y' (default) or 'z'
function cylG(rT, rB, len, seg, axis) {
  const g = new THREE.CylinderGeometry(rT, rB, len, seg || 32);
  if (axis === 'x') g.rotateZ(-Math.PI / 2);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  return g;
}
// faceted casting: 2D profile in local XY, extruded (centred) along local Z
function prismG(profile, thick) {
  const shape = new THREE.Shape(profile.map(p => new THREE.Vector2(p[0], p[1])));
  const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
  g.translate(0, 0, -thick / 2);
  return g;
}

// ---------------------------- Main parameters ------------------------------
const plateW      = 230;   // base plate width  (X)
const plateD      = 230;   // base plate depth  (Z)
const plateH      = 18;    // base plate thickness
const riserH      = 14;    // raised boss on top of the plate
const padS        = 62;    // corner mounting pad size
const padH        = 26;    // corner mounting pad height

const swingAngle  = Math.PI / 2 + 0.10;  // axis 1 (arm heading in the image)
const pedThick    = 104;   // pedestal casting width along the joint axis
const shX         = 26;    // shoulder axis position in the pedestal frame
const shY         = 112;
const armLean     = 0.33;  // axis 2  (~19 deg lean of the lower arm)
const L1          = 168;   // shoulder -> elbow distance
const armThick    = 84;    // lower arm width
const armZ        = -12;   // lower arm sits behind the big gearbox hub
const foreElev    = 0.14;  // axis 3 -> forearm ~8 deg above horizontal

const robot = new THREE.Group();
scene.add(robot);

// ============================ 1. BASE PLATE ================================
const baseGrp = new THREE.Group();
robot.add(baseGrp);

place(boxG(plateW, plateH, plateD), baseGrp, 0, plateH / 2, 0);                     // main plate
place(boxG(plateW - 60, riserH, plateD - 60), baseGrp, 0, plateH + riserH / 2, 0);  // raised boss

// stepped corner pads with bolt bosses
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => {
  const px = sx * (plateW / 2 - padS / 2 + 10);
  const pz = sz * (plateD / 2 - padS / 2 + 10);
  place(boxG(padS, padH, padS), baseGrp, px, padH / 2, pz);
  place(cylG(7, 7, 5, 16, 'y'), baseGrp, px - sx * 14, padH + 2, pz - sz * 14, 0, 0, 0, matDark);
  place(cylG(7, 7, 5, 16, 'y'), baseGrp, px + sx * 14, padH + 2, pz + sz * 14, 0, 0, 0, matDark);
});

// connector box + 3 small connectors on the front face
place(boxG(66, 32, 28), baseGrp, -22, 16, plateD / 2 - 3);
place(cylG(4.5, 4.5, 5, 12, 'z'), baseGrp, -42, 10, plateD / 2 + 13, 0, 0, 0, matDark);
place(cylG(4.5, 4.5, 5, 12, 'z'), baseGrp, -28, 10, plateD / 2 + 13, 0, 0, 0, matDark);
place(cylG(4.5, 4.5, 5, 12, 'z'), baseGrp, -35, 22, plateD / 2 + 13, 0, 0, 0, matDark);
// small flat cover plate on the same face
place(boxG(38, 18, 5), baseGrp, 40, 11, plateD / 2 + 1, 0, 0, 0, matDark);
// small locating bracket at the front edge
place(boxG(34, 10, 16), baseGrp, 0, plateH + 5, plateD / 2 + 4);

// ====================== 2. SLEW BEARING / TURNTABLE ========================
const baseTop = plateH + riserH;                                   // y = 32
place(cylG(92, 98, 12, 48, 'y'), baseGrp, 0, baseTop + 6, 0);       // stationary ring

const swingGrp = new THREE.Group();                                 // axis 1
swingGrp.position.set(0, baseTop + 12, 0);
swingGrp.rotation.y = swingAngle;
robot.add(swingGrp);

place(cylG(84, 90, 14, 48, 'y'), swingGrp, 0, 7, 0);                // rotating disc
place(cylG(74, 80, 10, 48, 'y'), swingGrp, 0, 19, 0, 0, 0, 0, matDark); // collar

// ======================= 3. PEDESTAL CASTING (axis 2) =====================
const pedGrp = new THREE.Group();
pedGrp.position.set(0, 24, 0);
swingGrp.add(pedGrp);

const pedProfile = [
  [-76,   0], [ 68,   0], [ 80,  32], [ 64,  96],
  [ 26, 118], [-34, 116], [-64,  86], [-80,  34]
];
place(prismG(pedProfile, pedThick), pedGrp, 0, 0, 0);

// large ringed gearbox hub on the near side of the shoulder axis
place(cylG(52, 52, 46, 48, 'z'), pedGrp, shX, shY, 60);
place(cylG(46, 46, 10, 48, 'z'), pedGrp, shX, shY, 88, 0, 0, 0, matDark);
place(cylG(39, 39,  9, 40, 'z'), pedGrp, shX, shY, 96);
place(cylG(28, 28, 12, 32, 'z'), pedGrp, shX, shY, 104, 0, 0, 0, matDark);
place(cylG(17, 17, 58,  6, 'z'), pedGrp, shX, shY, 136);            // hex output shaft
place(cylG(11, 11,  8,  6, 'z'), pedGrp, shX, shY, 168, 0, 0, 0, matDark);

// smaller bearing boss on the far side
place(cylG(40, 40, 22, 40, 'z'), pedGrp, shX, shY, -60);
place(cylG(30, 30, 12, 32, 'z'), pedGrp, shX, shY, -76, 0, 0, 0, matDark);

// ========================= 4. LOWER ARM (axis 2) ===========================
const armGrp = new THREE.Group();
armGrp.position.set(shX, shY, armZ);
armGrp.rotation.z = armLean;
pedGrp.add(armGrp);

const armProfile = [
  [-46, -28], [ 46, -24], [ 44,  50], [ 36, 140],
  [ 18, L1 - 2], [-26, L1 - 4], [-40, 130], [-48, 30]
];
place(prismG(armProfile, armThick), armGrp);
place(boxG(72, 44, armThick + 8), armGrp, -2, L1 - 34, 0);          // upper facet block
place(boxG(26, 88, armThick - 14), armGrp, -52, 70, 0);             // side bulge / motor pad
place(cylG(16, 16, armThick + 6, 24, 'z'), armGrp, -52, 70, 0, 0, 0, 0, matDark);

// elbow bearing (axis 3)
place(cylG(34, 34, armThick + 14, 40, 'z'), armGrp, 0, L1, 0);
place(cylG(27, 27, armThick + 34, 32, 'z'), armGrp, 0, L1, 0, 0, 0, 0, matDark);

// ------------------- rear parallel link of the linkage ---------------------
const linkX = 62;
place(prismG([[-11, -18], [11, -18], [9, 132], [-9, 132]], 26), armGrp, linkX, 4, 0);
place(cylG(15, 15, 34, 24, 'z'), armGrp, linkX, -14, 0, 0, 0, 0, matDark);
place(cylG(15, 15, 34, 24, 'z'), armGrp, linkX, 136, 0, 0, 0, 0, matDark);
// diagonal tie from the link head to the elbow
place(boxG(58, 24, 24), armGrp, 38, 153, 0, 0, 0, Math.atan2(30, -47));

// ========================== 5. FOREARM (axis 3) ============================
const feGrp = new THREE.Group();
feGrp.position.set(0, L1, 0);
feGrp.rotation.z = Math.PI - foreElev - armLean;   // absolute pointing direction
armGrp.add(feGrp);

// rear housing (straddles the elbow, carries the wrist drives)
place(boxG(118, 76, 86), feGrp, -8, 0, 0);
place(boxG(74, 24, 74), feGrp, -24, 44, 0);
place(cylG(38, 38, 78, 40, 'z'), feGrp, 12, 0, 0);                  // elbow shell

// wrist drive motors on the rear end
[28, -28].forEach(zo => {
  place(cylG(22, 22, 12, 32, 'x'), feGrp, -62, 6, zo, 0, 0, 0, matDark);
  place(cylG(16, 16, 44, 28, 'x'), feGrp, -84, 6, zo);
  place(cylG(13, 13, 10,  6, 'x'), feGrp, -110, 6, zo, 0, 0, 0, matDark);
});

// main tube
place(cylG(38, 38, 18, 40, 'x'), feGrp, 48, 0, 0, 0, 0, 0, matDark);  // rear collar
place(cylG(32, 32, 150, 40, 'x'), feGrp, 125, 0, 0);                  // tube
place(cylG(36, 36, 14, 40, 'x'), feGrp, 194, 0, 0, 0, 0, 0, matDark); // front collar

// corrugated bellows / roll joint (axis 4)
const bStart = 200, bCount = 5, bPitch = 11;
for (let i = 0; i < bCount; i++) {
  const r = 34 - i * 2.6;
  place(cylG(r, r, 7, 32, 'x'), feGrp, bStart + i * bPitch, 0, 0, 0, 0, 0, matDark);
  place(cylG(r - 7, r - 7, bPitch, 24, 'x'), feGrp, bStart + i * bPitch + bPitch / 2, 0, 0);
}

// ======================== 6. WRIST / TOOL FLANGE ===========================
const wx = bStart + bCount * bPitch;      // ≈ 255
place(cylG(21, 21, 14, 32, 'x'), feGrp, wx + 6, 0, 0);
place(cylG(15, 15, 18, 24, 'x'), feGrp, wx + 20, 0, 0, 0, 0, 0, matDark);
place(cylG(23, 23, 10, 32, 'x'), feGrp, wx + 33, 0, 0);              // tool flange
place(boxG(14, 16, 24), feGrp, wx + 44, 15, 0);                      // clevis ear
place(boxG(14, 16, 24), feGrp, wx + 44, -15, 0);                     // clevis ear
place(cylG(6, 6, 34, 16, 'z'), feGrp, wx + 44, 0, 0, 0, 0, 0, matDark); // pivot pin
place(cylG(13, 13, 14, 6, 'x'), feGrp, wx + 44, 0, 0);               // hex boss
place(cylG(7, 7, 14, 16, 'x'), feGrp, wx + 57, 0, 0, 0, 0, 0, matDark); // centre pin

// ============================== CAMERA =====================================
camera.position.set(472, 440, 472);
camera.lookAt(0, 170, 0);