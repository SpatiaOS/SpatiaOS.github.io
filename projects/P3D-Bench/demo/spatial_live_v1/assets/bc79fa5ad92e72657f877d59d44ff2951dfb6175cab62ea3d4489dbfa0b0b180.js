// ============================================================================
// Hydraulic / robotic actuator on a pan-tilt pedestal
// Interpretation: machined base + circular turntable, trunnion-bearing turret,
// forked yoke (solid trapezoid + triangular A-frame), long stepped cylinder
// with rear twin fittings and a front nozzle / hex union.
// ============================================================================

// ---------- materials (CAD-like medium gray metal) ----------
const mat = new THREE.MeshStandardMaterial({
  color: 0xa3a7ab,
  metalness: 0.52,
  roughness: 0.38,
});
const matHi = new THREE.MeshStandardMaterial({
  color: 0xb7bcc0,
  metalness: 0.62,
  roughness: 0.28,
});
const matLo = new THREE.MeshStandardMaterial({
  color: 0x7c8186,
  metalness: 0.45,
  roughness: 0.48,
});
const matHole = new THREE.MeshStandardMaterial({
  color: 0x2a2c2e,
  metalness: 0.2,
  roughness: 0.7,
});

// ---------- parameters ----------
const BASE_H = 1.32;
const PIVOT_Y = 4.55;
const PIVOT_R = 1.62;
const ARM_R = 4.55;                 // pivot -> cylinder axis
const TILT = THREE.MathUtils.degToRad(26);
const CYL_R = 0.95;

// ---------- helpers ----------
function addBox(parent, w, h, d, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}
function addCyl(parent, rTop, rBot, height, segs, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, height, segs), material);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}
function addHole(parent, r, depth, x, y, z, rx = 0, ry = 0, rz = 0) {
  return addCyl(parent, r, r, depth, 16, matHole, x, y, z, rx, ry, rz);
}
function addBolt(parent, r, h, x, y, z, rx = 0, ry = 0, rz = 0) {
  return addCyl(parent, r, r, h, 6, matLo, x, y, z, rx, ry, rz);
}

function makePlateGeo(outline, hole, thickness) {
  const shape = new THREE.Shape();
  shape.moveTo(outline[0][0], outline[0][1]);
  for (let i = 1; i < outline.length; i++) shape.lineTo(outline[i][0], outline[i][1]);
  shape.closePath();
  if (hole && hole.length) {
    const p = new THREE.Path();
    p.moveTo(hole[0][0], hole[0][1]);
    for (let i = 1; i < hole.length; i++) p.lineTo(hole[i][0], hole[i][1]);
    p.closePath();
    shape.holes.push(p);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.045,
    bevelSegments: 1,
  });
  geo.translate(0, 0, -thickness * 0.5);
  return geo;
}

const model = new THREE.Group();
scene.add(model);

// ============================================================================
// BASE  — irregular mounting plate with connector, pocket, ears and tab
// X = right (shaft / tab), Y = up, Z = forward-left (cylinder / pocket face)
// ============================================================================
const base = new THREE.Group();
model.add(base);

// main slab
addBox(base, 10.4, BASE_H, 8.4, mat, -0.15, BASE_H * 0.5, 0.05);

// rear-left raised pad
addBox(base, 2.6, 0.42, 3.4, mat, -4.55, BASE_H + 0.2, -2.3);

// left-front connector housing (two face bolts + recess)
addBox(base, 2.7, 1.72, 3.35, mat, -5.15, 0.86, 3.35);
addBox(base, 1.15, 0.55, 0.12, matLo, -5.15, 0.78, 5.04);          // recessed window
addCyl(base, 0.16, 0.16, 0.22, 12, matHi, -5.55, 0.55, 5.05, Math.PI / 2, 0, 0);
addCyl(base, 0.16, 0.16, 0.22, 12, matHi, -4.75, 0.55, 5.05, Math.PI / 2, 0, 0);
addBolt(base, 0.18, 0.16, -5.55, 1.35, 5.04, Math.PI / 2, 0, 0);
addBolt(base, 0.18, 0.16, -4.75, 1.35, 5.04, Math.PI / 2, 0, 0);

// front rectangular pocket
addBox(base, 3.35, 0.78, 0.55, matLo, -0.1, 0.62, 4.28);
addBox(base, 2.85, 0.42, 0.18, matHole, -0.1, 0.58, 4.48);

// front-right mounting ear (vertical plate with two holes) + block
addBox(base, 0.22, 1.55, 1.35, mat, 5.05, 0.95, 4.15);
addHole(base, 0.16, 0.28, 5.05, 1.32, 4.15, 0, 0, Math.PI / 2);
addHole(base, 0.16, 0.28, 5.05, 0.62, 4.15, 0, 0, Math.PI / 2);
addBox(base, 1.15, 0.7, 1.05, mat, 4.55, 0.5, 4.15);
addBox(base, 0.7, 0.85, 0.22, mat, 5.55, 0.72, 3.35);
addHole(base, 0.13, 0.26, 5.55, 0.85, 3.35, Math.PI / 2, 0, 0);

// right-side mounting tab
addBox(base, 1.9, 0.62, 2.15, mat, 5.85, 0.31, -0.35);
addHole(base, 0.2, 0.22, 6.45, 0.64, -0.35);
addCyl(base, 0.38, 0.38, 0.14, 16, matLo, 6.45, 0.64, -0.35);

// right-rear corner step
addBox(base, 1.4, BASE_H, 1.6, mat, 4.7, BASE_H * 0.5, -3.5);

// chamfer-ish front-left lip
addBox(base, 1.8, 0.35, 0.7, mat, -3.4, 0.22, 4.55);

// circular island the turret sits on
addCyl(base, 4.05, 4.05, 0.28, 48, mat, 0.15, BASE_H + 0.14, -0.15);
addCyl(base, 3.55, 3.55, 0.16, 48, matHi, 0.15, BASE_H + 0.34, -0.15);

// a few deck bolts around the island
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + 0.4;
  const rr = 3.72;
  addBolt(base, 0.12, 0.1, Math.cos(a) * rr + 0.15, BASE_H + 0.42, Math.sin(a) * rr - 0.15);
}

// ============================================================================
// TURNTABLE / PEDESTAL  — octagonal frustum + bearing cradle
// ============================================================================
const turret = new THREE.Group();
turret.position.set(0.15, 0, -0.15);
model.add(turret);

addCyl(turret, 3.15, 3.45, 0.42, 8, mat, 0, BASE_H + 0.62, 0);          // faceted ring
addCyl(turret, 2.25, 3.05, 1.55, 8, mat, 0, BASE_H + 1.55, 0);           // inward slope
addCyl(turret, 2.35, 2.55, 0.7, 32, matLo, 0, BASE_H + 2.45, 0);         // round collar

// diamond / cheek faces on the pedestal
addBox(turret, 1.3, 1.7, 3.6, mat, 0, BASE_H + 1.7, 0, 0, Math.PI / 4.8, 0);
addBox(turret, 4.2, 1.15, 1.15, mat, 0, BASE_H + 1.35, 0.15);

// front “chin” slope of the housing
addBox(turret, 2.4, 1.1, 1.8, mat, 0.2, BASE_H + 2.05, 1.35, THREE.MathUtils.degToRad(-28), 0, 0);

// side accessory block (left / -X of trunnion)
addBox(turret, 1.35, 1.25, 1.55, mat, -2.35, PIVOT_Y - 0.35, 0.15);
addCyl(turret, 0.7, 0.7, 1.1, 24, matLo, -2.55, PIVOT_Y, 0.15, 0, 0, Math.PI / 2);

// fixed outer bearing rings (do not pitch with the arm)
addCyl(turret, 2.18, 2.18, 0.55, 40, matHi, 1.55, PIVOT_Y, 0, 0, 0, Math.PI / 2);
addCyl(turret, 2.18, 2.18, 0.42, 40, matHi, -1.35, PIVOT_Y, 0, 0, 0, Math.PI / 2);
addCyl(turret, 1.85, 1.85, 0.22, 40, matLo, 1.85, PIVOT_Y, 0, 0, 0, Math.PI / 2);

// ============================================================================
// ARM  — pitches about the X trunnion
// ============================================================================
const arm = new THREE.Group();
arm.position.set(0, PIVOT_Y, 0);
arm.rotation.x = -TILT;
turret.add(arm);

// rotating drum / hub
addCyl(arm, PIVOT_R, PIVOT_R, 3.35, 40, mat, 0.05, 0, 0, 0, 0, Math.PI / 2);
addCyl(arm, PIVOT_R + 0.22, PIVOT_R + 0.22, 0.38, 40, matHi, -1.55, 0, 0, 0, 0, Math.PI / 2);
addCyl(arm, PIVOT_R + 0.28, PIVOT_R + 0.18, 0.5, 40, mat, 1.45, 0, 0, 0, 0, Math.PI / 2);

// large right-hand flange / bearing cap (faces +X, circular in isometric)
addCyl(arm, 2.12, 2.12, 0.42, 48, matHi, 2.05, 0, 0, 0, 0, Math.PI / 2);
addCyl(arm, 1.55, 1.55, 0.28, 40, matLo, 2.28, 0, 0, 0, 0, Math.PI / 2);
const rim = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.11, 10, 36), matLo);
rim.rotation.y = Math.PI / 2;
rim.position.set(2.18, 0, 0);
arm.add(rim);

// hexagonal through-shaft + nut
addCyl(arm, 0.48, 0.48, 2.15, 6, matHi, 3.15, 0, 0, 0, 0, Math.PI / 2);
addCyl(arm, 0.72, 0.72, 0.42, 6, matLo, 4.12, 0, 0, 0, Math.PI / 6, Math.PI / 2);
addCyl(arm, 0.22, 0.22, 0.18, 12, matHi, 4.38, 0, 0, 0, 0, Math.PI / 2);

// left drum cap
addCyl(arm, 1.35, 1.35, 0.55, 32, mat, -2.05, 0, 0, 0, 0, Math.PI / 2);
addCyl(arm, 1.05, 0.85, 0.45, 32, matLo, -2.45, 0, 0, 0, 0, Math.PI / 2);

// ---------- forked yoke ----------
// shape is drawn in (z_forward, y_up); mesh.rotation.y = -90 deg maps X->Z
const plateT = 0.52;
const mainGeo = makePlateGeo(
  [
    [-1.35, 0.25],
    [1.85, 0.25],
    [2.55, 4.55],
    [0.35, 4.55],
  ],
  null,
  plateT
);
const mainPlate = new THREE.Mesh(mainGeo, mat);
mainPlate.rotation.y = -Math.PI / 2;
mainPlate.position.set(-1.05, 0, 0);
arm.add(mainPlate);

// inner recess on the trapezoid (reads as a casting pocket)
const pocketGeo = makePlateGeo(
  [
    [-0.55, 1.15],
    [1.15, 1.15],
    [1.55, 3.85],
    [0.55, 3.85],
  ],
  null,
  0.12
);
const pocketMesh = new THREE.Mesh(pocketGeo, matLo);
pocketMesh.rotation.y = -Math.PI / 2;
pocketMesh.position.set(-0.76, 0, 0);
arm.add(pocketMesh);

const braceT = 0.32;
const braceGeo = makePlateGeo(
  [
    [-2.35, 0.2],
    [1.15, 0.2],
    [0.15, 5.15],
    [-1.55, 5.15],
  ],
  [
    [-1.45, 0.85],
    [0.45, 0.85],
    [-0.15, 4.45],
    [-1.15, 4.45],
  ],
  braceT
);
const brace = new THREE.Mesh(braceGeo, mat);
brace.rotation.y = -Math.PI / 2;
brace.position.set(1.42, 0, 0);
arm.add(brace);

// far-side thinner plate (completes the fork)
const farGeo = makePlateGeo(
  [
    [-1.1, 0.35],
    [1.55, 0.35],
    [2.15, 4.4],
    [0.25, 4.4],
  ],
  null,
  0.28
);
const farPlate = new THREE.Mesh(farGeo, mat);
farPlate.rotation.y = -Math.PI / 2;
farPlate.position.set(1.05, 0, 0);
arm.add(farPlate);

// wrap collars where yoke meets the drum
addCyl(arm, PIVOT_R + 0.18, PIVOT_R + 0.18, 0.55, 28, mat, -1.05, 0, 0, 0, 0, Math.PI / 2);
addCyl(arm, PIVOT_R + 0.18, PIVOT_R + 0.18, 0.38, 28, mat, 1.42, 0, 0, 0, 0, Math.PI / 2);

// saddle / clamp under the barrel
addBox(arm, 2.35, 1.15, 2.6, mat, 0, ARM_R - 0.85, 1.15);
addCyl(arm, CYL_R + 0.32, CYL_R + 0.32, 1.55, 28, mat, 0, ARM_R, 1.35, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.42, CYL_R + 0.42, 0.28, 28, matHi, 0, ARM_R, 0.55, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.42, CYL_R + 0.42, 0.28, 28, matHi, 0, ARM_R, 2.15, Math.PI / 2, 0, 0);

// top cross-member between fork plates
addBox(arm, 2.5, 0.45, 0.7, mat, 0, ARM_R - 0.35, -1.15);
addBox(arm, 2.5, 0.38, 0.55, mat, 0, ARM_R - 0.3, 2.45);

// small bolt bosses on the clamp
addBolt(arm, 0.14, 0.2, -0.7, ARM_R + 0.55, 1.35);
addBolt(arm, 0.14, 0.2, 0.7, ARM_R + 0.55, 1.35);

// ============================================================================
// CYLINDER ASSEMBLY  — along local +Z, sitting on the saddle
// ============================================================================
const cy = ARM_R; // local Y of cylinder axis

// main barrel
addCyl(arm, CYL_R, CYL_R, 6.2, 36, matHi, 0, cy, 1.55, Math.PI / 2, 0, 0);

// rear collar stack
addCyl(arm, CYL_R + 0.22, CYL_R + 0.22, 0.38, 32, mat, 0, cy, -1.7, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.12, CYL_R + 0.12, 0.22, 32, matLo, 0, cy, -1.42, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.28, CYL_R + 0.28, 0.32, 32, mat, 0, cy, -2.02, Math.PI / 2, 0, 0);

// rear end-block + twin hydraulic / optical fittings
addBox(arm, 1.15, 1.35, 0.7, mat, 0, cy, -2.48);
addCyl(arm, 0.32, 0.32, 0.85, 20, matHi, 0, cy + 0.38, -3.05, Math.PI / 2, 0, 0);
addCyl(arm, 0.32, 0.32, 0.85, 20, matHi, 0, cy - 0.38, -3.05, Math.PI / 2, 0, 0);
addCyl(arm, 0.38, 0.38, 0.18, 6, matLo, 0, cy + 0.38, -2.62, Math.PI / 2, 0, 0);
addCyl(arm, 0.38, 0.38, 0.18, 6, matLo, 0, cy - 0.38, -2.62, Math.PI / 2, 0, 0);
addCyl(arm, 0.22, 0.22, 0.16, 16, matLo, 0, cy + 0.38, -3.5, Math.PI / 2, 0, 0);
addCyl(arm, 0.22, 0.22, 0.16, 16, matLo, 0, cy - 0.38, -3.5, Math.PI / 2, 0, 0);

// front stepped collars (union nuts)
addCyl(arm, CYL_R + 0.26, CYL_R + 0.26, 0.42, 32, mat, 0, cy, 4.85, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.08, CYL_R + 0.08, 0.28, 32, matLo, 0, cy, 5.18, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.24, CYL_R + 0.24, 0.38, 32, mat, 0, cy, 5.48, Math.PI / 2, 0, 0);

// reducing neck
addCyl(arm, 0.55, 0.78, 0.55, 28, matHi, 0, cy, 5.9, Math.PI / 2, 0, 0);
addCyl(arm, 0.48, 0.48, 0.45, 24, matHi, 0, cy, 6.32, Math.PI / 2, 0, 0);

// hex union
addCyl(arm, 0.52, 0.52, 0.62, 6, matLo, 0, cy, 6.75, Math.PI / 6, Math.PI / 2, 0);
addBox(arm, 0.85, 0.7, 0.55, mat, 0, cy, 6.75);

// nozzle tip + aperture
addCyl(arm, 0.34, 0.34, 0.35, 20, matHi, 0, cy, 7.15, Math.PI / 2, 0, 0);
addCyl(arm, 0.26, 0.22, 0.32, 20, mat, 0, cy, 7.42, Math.PI / 2, 0, 0);
addCyl(arm, 0.12, 0.12, 0.18, 16, matHole, 0, cy, 7.58, Math.PI / 2, 0, 0);

// knurled thumb-screw on the +X side of the hex union
addCyl(arm, 0.22, 0.22, 0.42, 12, matLo, 0.58, cy + 0.15, 6.72, 0, 0, Math.PI / 2);
addCyl(arm, 0.28, 0.28, 0.14, 12, matHi, 0.78, cy + 0.15, 6.72, 0, 0, Math.PI / 2);
addCyl(arm, 0.08, 0.08, 0.12, 10, matHole, 0.92, cy + 0.15, 6.72, 0, 0, Math.PI / 2);

// decorative barrel bands
addCyl(arm, CYL_R + 0.05, CYL_R + 0.05, 0.12, 32, matLo, 0, cy, 0.35, Math.PI / 2, 0, 0);
addCyl(arm, CYL_R + 0.05, CYL_R + 0.05, 0.12, 32, matLo, 0, cy, 3.55, Math.PI / 2, 0, 0);

// ============================================================================
// CAMERA — CAD isometric matching the reference (viewing +X / +Y / +Z)
// ============================================================================
camera.position.set(22, 16.5, 21);
camera.lookAt(0.2, 4.2, 1.2);