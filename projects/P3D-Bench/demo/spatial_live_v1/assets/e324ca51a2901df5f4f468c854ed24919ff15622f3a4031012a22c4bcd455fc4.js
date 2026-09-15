// ============================================================
// High-rise wedge-shaped tower block (residential high-rise)
// Interpretation: a tall tower with a chamfered triangular plan,
// ~20 floors of window bands / recessed balconies on 3 facades,
// a wider podium base, a low side annex with parapet courtyard,
// and a roof with parapet rings + raised mechanical penthouses.
// ============================================================

// ---------- Parameters ----------
const FLOORS      = 20;
const FLOOR_H     = 3.0;
const PODIUM_H    = 4.0;
const TOWER_H     = PODIUM_H + FLOORS * FLOOR_H;   // main body height
const PARAPET_H   = 1.5;

// Plan outline (x, z), clockwise chain of visible facades first
const PLAN = [
  [-8,  4],   // left end of balcony facade
  [ 0,  8],   // corner: balcony / window-grid facade
  [ 6,  4],   // corner: window-grid / band facade
  [10, -2],   // right end of band facade
  [10, -10],  // back right
  [-8, -10]   // back left
];
const CENTROID = [1.667, -1.0];

// ---------- Materials ----------
const matConcrete = new THREE.MeshStandardMaterial({ color: 0xc8c8c8 });
const matFrame    = new THREE.MeshStandardMaterial({ color: 0xdddddd });
const matGlass    = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const matSlab     = new THREE.MeshStandardMaterial({ color: 0xb5b5b5 });
const matPodium   = new THREE.MeshStandardMaterial({ color: 0xaeaeae });
const matRoof     = new THREE.MeshStandardMaterial({ color: 0x8a8a8a });

// ---------- Helpers ----------
function scalePts(pts, s, cx, cz) {
  return pts.map(p => [cx + (p[0] - cx) * s, cz + (p[1] - cz) * s]);
}

// Extrude a plan polygon vertically from y0 to y1 (optional hole ring)
function makePrism(pts, y0, y1, mat, holePts) {
  const shape = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], -p[1])));
  if (holePts) {
    const path = new THREE.Path(holePts.slice().reverse().map(p => new THREE.Vector2(p[0], -p[1])));
    shape.holes.push(path);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = y0;
  return mesh;
}

// Box aligned to a facade edge (a->b in plan), pushed out along outward normal
function facadeBox(a, b, y, h, thick, lenFrac, outOffset, mat) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const nx = -dz / len, nz = dx / len;                 // outward normal
  const mx = (a[0] + b[0]) / 2 + nx * outOffset;
  const mz = (a[1] + b[1]) / 2 + nz * outOffset;
  const geo = new THREE.BoxGeometry(len * lenFrac, h, thick);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(mx, y, mz);
  mesh.rotation.y = Math.atan2(-dz, dx);
  return mesh;
}

function box(w, h, d, x, y, z, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

// ---------- Tower body ----------
scene.add(makePrism(PLAN, 0, TOWER_H, matConcrete));

// Vertical corner mullions on the two front corners
scene.add(box(1.0, TOWER_H, 1.0, PLAN[1][0], TOWER_H / 2, PLAN[1][1], matFrame));
scene.add(box(1.0, TOWER_H, 1.0, PLAN[2][0], TOWER_H / 2, PLAN[2][1], matFrame));

// ---------- Facade detailing per floor ----------
const faceBalcony = [PLAN[0], PLAN[1]];
const faceGrid    = [PLAN[1], PLAN[2]];
const faceBand    = [PLAN[2], PLAN[3]];

for (let f = 0; f < FLOORS; f++) {
  const fy = PODIUM_H + f * FLOOR_H;

  // floor slab line (all three facades)
  scene.add(facadeBox(faceBalcony[0], faceBalcony[1], fy + 0.25, 0.5, 0.35, 1.0, 0.15, matSlab));
  scene.add(facadeBox(faceGrid[0],    faceGrid[1],    fy + 0.25, 0.5, 0.35, 1.0, 0.15, matSlab));
  scene.add(facadeBox(faceBand[0],    faceBand[1],    fy + 0.25, 0.5, 0.35, 1.0, 0.15, matSlab));

  // Balcony facade: dark recessed opening + projecting balcony slab & side walls
  scene.add(facadeBox(faceBalcony[0], faceBalcony[1], fy + 1.7, 2.2, 0.3, 0.8, 0.05, matGlass));
  scene.add(facadeBox(faceBalcony[0], faceBalcony[1], fy + 0.6, 0.3, 1.6, 0.85, 0.8, matSlab));
  const bA = faceBalcony[0], bB = faceBalcony[1];
  const bdx = bB[0] - bA[0], bdz = bB[1] - bA[1], bl = Math.hypot(bdx, bdz);
  const bnx = -bdz / bl, bnz = bdx / bl;
  for (const s of [-0.42, 0.42]) {
    const wx = (bA[0] + bB[0]) / 2 + bdx * s + bnx * 0.8;
    const wz = (bA[1] + bB[1]) / 2 + bdz * s + bnz * 0.8;
    const w = box(0.3, 2.6, 1.6, wx, fy + 1.5, wz, matFrame);
    w.rotation.y = Math.atan2(-bdz, bdx);
    scene.add(w);
  }

  // Window-grid facade: light frame + dark glazing
  scene.add(facadeBox(faceGrid[0], faceGrid[1], fy + 1.7, 2.2, 0.2, 0.92, 0.08, matFrame));
  scene.add(facadeBox(faceGrid[0], faceGrid[1], fy + 1.7, 1.8, 0.2, 0.78, 0.2, matGlass));

  // Band facade: horizontal ribbon window + spandrel
  scene.add(facadeBox(faceBand[0], faceBand[1], fy + 1.8, 1.6, 0.2, 0.85, 0.08, matGlass));
  scene.add(facadeBox(faceBand[0], faceBand[1], fy + 2.8, 0.5, 0.2, 0.9, 0.08, matFrame));
}

// ---------- Podium base (slightly larger footprint) ----------
scene.add(makePrism(scalePts(PLAN, 1.15, CENTROID[0], CENTROID[1]), 0, PODIUM_H, matPodium));

// ---------- Side annex (low block with parapet courtyard) ----------
const anX = -14, anZ = -2, anW = 9, anD = 12, anH = 6;
scene.add(box(anW, anH, anD, anX, anH / 2, anZ, matConcrete));
scene.add(box(anW - 1.6, 0.4, anD - 1.6, anX, anH + 0.1, anZ, matRoof));   // recessed deck
const t = 0.6, ph = 1.4;
scene.add(box(anW, ph, t, anX, anH + ph / 2, anZ - anD / 2 + t / 2, matConcrete));
scene.add(box(anW, ph, t, anX, anH + ph / 2, anZ + anD / 2 - t / 2, matConcrete));
scene.add(box(t, ph, anD, anX - anW / 2 + t / 2, anH + ph / 2, anZ, matConcrete));
scene.add(box(t, ph, anD, anX + anW / 2 - t / 2, anH + ph / 2, anZ, matConcrete));

// ---------- Roof: deck, parapet ring, raised penthouse volumes ----------
scene.add(makePrism(scalePts(PLAN, 0.85, CENTROID[0], CENTROID[1]), TOWER_H, TOWER_H + 0.4, matRoof));
scene.add(makePrism(PLAN, TOWER_H, TOWER_H + PARAPET_H, matConcrete,
                    scalePts(PLAN, 0.88, CENTROID[0], CENTROID[1])));

// Raised triangular penthouse (front-left of roof)
const triPts = scalePts(PLAN, 0.55, CENTROID[0], CENTROID[1]).map(p => [p[0] - 2.5, p[1] + 2.5]);
scene.add(makePrism(triPts, TOWER_H + PARAPET_H, TOWER_H + PARAPET_H + 3.0, matConcrete,
                    scalePts(triPts, 0.8, -2.5 + CENTROID[0] * 0.45, 2.5 + CENTROID[1] * 0.45)));

// Raised rectangular penthouse (back-right of roof)
const rx = 5, rz = -4, rw = 9, rd = 7, rt = 0.8, rh0 = TOWER_H + PARAPET_H, rh1 = TOWER_H + PARAPET_H + 2.6;
scene.add(box(rw, rh1 - rh0, rt, rx, (rh0 + rh1) / 2, rz - rd / 2, matConcrete));
scene.add(box(rw, rh1 - rh0, rt, rx, (rh0 + rh1) / 2, rz + rd / 2, matConcrete));
scene.add(box(rt, rh1 - rh0, rd, rx - rw / 2, (rh0 + rh1) / 2, rz, matConcrete));
scene.add(box(rt, rh1 - rh0, rd, rx + rw / 2, (rh0 + rh1) / 2, rz, matConcrete));

// ---------- Camera ----------
camera.position.set(46, 52, 82);
camera.lookAt(0, 34, 0);
if (typeof controls !== 'undefined') {
  controls.target.set(0, 34, 0);
  controls.update();
}