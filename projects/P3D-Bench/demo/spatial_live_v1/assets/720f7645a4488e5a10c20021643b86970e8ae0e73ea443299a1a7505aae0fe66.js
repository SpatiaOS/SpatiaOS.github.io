// =============================================================
//  HIGH-RISE RESIDENTIAL TOWER
//  Interpretation of the image:
//   - 2-storey podium base (wider than the shaft, chamfered corner)
//   - ~16 typical floors:  stacked balconies on one facade,
//     punched window-walls on the adjacent facade
//   - one corner of the plan is cut at 45 deg
//   - crown storey + projecting canopy + gable (pitched) roof
//   - low open-top annex block in front of the podium
// =============================================================

// ------------------------- PARAMETERS -------------------------
const floorH      = 3.0;    // typical floor-to-floor height
const numFloors   = 16;     // number of typical floors of the shaft
const towerW      = 13.0;   // plan dimension along X  (balcony facade width)
const towerD      = 17.0;   // plan dimension along Z  (window facade depth)
const cham        = 4.5;    // 45-degree corner cut  (+X / -Z corner)
const podiumH     = 7.0;    // two-storey podium height
const podiumOut   = 1.6;    // podium overhang beyond the shaft
const crownH      = 4.5;    // crown / plant storey
const roofH       = 5.5;    // gable roof height
const bandT       = 0.32;   // thickness of the expressed floor slab bands
const bandOut     = 0.28;   // projection of the floor bands

const balDepth    = 2.3;    // balcony projection
const balBays     = 2;      // balconies per floor (+Z facade)
const bayGap      = 0.5;    // gap between balcony bays
const railH       = 1.15;   // balcony railing height

const winPerFloor = 3;      // window bays per floor (+X facade)
const winW        = 3.0;    // width of one window bay
const winH        = 1.9;    // height of one window bay

const hw = towerW / 2;
const hd = towerD / 2;
const shaftTop = podiumH + numFloors * floorH;   // top of typical floors

// ------------------------- MATERIALS --------------------------
const matWall  = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.9,  metalness: 0.0 });
const matSlab  = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.9,  metalness: 0.0 });
const matTrim  = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8,  metalness: 0.0 });
const matGlass = new THREE.MeshStandardMaterial({ color: 0x3b3b3b, roughness: 0.35, metalness: 0.25 });
const matRail  = new THREE.MeshStandardMaterial({ color: 0x9d9d9d, roughness: 0.6,  metalness: 0.35 });

// ------------------------- CONTAINER --------------------------
const building = new THREE.Group();
scene.add(building);

// ------------------------- HELPERS ----------------------------
// Simple box helper
function addBox(w, h, d, x, y, z, mat, rotY) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (rotY) m.rotation.y = rotY;
  building.add(m);
  return m;
}

// Tower footprint : rectangle with one 45-deg chamfered corner.
// (shape XY -> world XZ ; shape +y maps to world -z)
function plan(inset) {
  const w = hw + inset, d = hd + inset;
  const s = new THREE.Shape();
  s.moveTo(-w, -d);
  s.lineTo( w, -d);
  s.lineTo( w,  d - cham);
  s.lineTo( w - cham, d);
  s.lineTo(-w,  d);
  s.lineTo(-w, -d);
  return s;
}

// Extrude a plan shape vertically between yBase and yBase+height
function addPrism(shape, height, yBase, mat) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);      // lay the plan flat, extrude upward
  g.translate(0, yBase, 0);
  const m = new THREE.Mesh(g, mat);
  building.add(m);
  return m;
}

// Gable (pitched) roof : triangular prism, gable ends facing +/-Z
function addGableRoof(w, d, h, yBase, mat) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo( w / 2, 0);
  s.lineTo( 0,     h);
  s.lineTo(-w / 2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  g.translate(0, yBase, -d / 2);
  const m = new THREE.Mesh(g, mat);
  building.add(m);
  return m;
}

// =============================================================
// 1. PODIUM  (two-storey base, wider than the shaft)
// =============================================================
addPrism(plan(podiumOut), podiumH, 0.0, matWall);                       // base mass
addPrism(plan(podiumOut + 0.7), 0.7, podiumH - 0.7, matSlab);           // cornice at podium top
addPrism(plan(podiumOut + 0.4), 0.6, 0.0, matSlab);                     // plinth

// glazed / recessed bands of the base (entrance level)
addBox(towerW + 1.5, 3.0, 0.25, -0.5, 3.4,  hd + podiumOut + 0.05, matGlass);
addBox(0.25, 3.0, towerD * 0.45, hw + podiumOut + 0.05, 3.4, hd * 0.35, matGlass);
addBox(4.0, 4.2, 0.25, 4.0, 2.6,  hd + podiumOut + 0.08, matTrim);      // entrance panel

// =============================================================
// 2. TOWER SHAFT + EXPRESSED FLOOR SLAB BANDS
// =============================================================
addPrism(plan(0), shaftTop, 0.0, matWall);

for (let i = 0; i <= numFloors; i++) {
  const y = podiumH + i * floorH;
  addPrism(plan(bandOut), bandT, y - bandT * 0.5, matSlab);
}

// =============================================================
// 3. BALCONIES  (on the +Z facade, two bays per floor)
// =============================================================
const bayW = (towerW - bayGap * (balBays + 1)) / balBays;

for (let i = 0; i < numFloors; i++) {
  const yF = podiumH + i * floorH;                       // slab level

  for (let b = 0; b < balBays; b++) {
    const cx = -hw + bayGap + bayW / 2 + b * (bayW + bayGap);

    // balcony slab
    addBox(bayW, 0.25, balDepth, cx, yF + 0.13, hd + balDepth / 2, matSlab);

    // side (party) walls of the balcony
    addBox(0.16, railH, balDepth, cx - bayW / 2, yF + 0.25 + railH / 2, hd + balDepth / 2, matTrim);
    addBox(0.16, railH, balDepth, cx + bayW / 2, yF + 0.25 + railH / 2, hd + balDepth / 2, matTrim);

    // horizontal railing slats (the "louvred" look in the drawing)
    for (let s = 0; s < 4; s++) {
      addBox(bayW, 0.13, 0.10, cx, yF + 0.50 + s * 0.26, hd + balDepth - 0.06, matRail);
    }
    // top rail
    addBox(bayW + 0.1, 0.14, 0.22, cx, yF + 0.25 + railH, hd + balDepth - 0.05, matTrim);

    // dark glazed wall behind the balcony
    addBox(bayW - 0.6, floorH - 0.9, 0.12, cx, yF + floorH * 0.55, hd + 0.03, matGlass);
    // slim mullion in the glazing
    addBox(0.12, floorH - 0.9, 0.18, cx, yF + floorH * 0.55, hd + 0.06, matTrim);
  }
}

// =============================================================
// 4. WINDOW WALL  (on the +X facade, 3 bays per floor,
//    each split into 3 x 2 panes by light mullions)
// =============================================================
const zStart = -hd + cham + 0.5;         // +X facade only starts after the chamfer
const zEnd   =  hd - 0.5;
const faceLen = zEnd - zStart;
const wGap = (faceLen - winPerFloor * winW) / (winPerFloor + 1);

for (let i = 0; i < numFloors; i++) {
  const yC = podiumH + i * floorH + floorH * 0.55;

  for (let k = 0; k < winPerFloor; k++) {
    const zc = zStart + wGap + winW / 2 + k * (winW + wGap);

    // recessed dark opening
    addBox(0.35, winH, winW, hw - 0.10, yC, zc, matGlass);
    // vertical mullions (3 panes wide)
    addBox(0.14, winH, 0.11, hw + 0.04, yC, zc - winW / 6, matTrim);
    addBox(0.14, winH, 0.11, hw + 0.04, yC, zc + winW / 6, matTrim);
    // horizontal transom (2 panes high)
    addBox(0.14, 0.11, winW, hw + 0.04, yC, zc, matTrim);
  }

  // one window on the chamfered corner facade
  const cmX = hw - cham / 2, cmZ = -hd + cham / 2;
  addBox(cham * Math.SQRT2 - 1.2, winH, 0.30, cmX, yC, cmZ, matGlass, Math.PI * 0.75);
  addBox(0.12, winH, 0.36, cmX + 0.05, yC, cmZ - 0.05, matTrim, Math.PI * 0.75);
}

// =============================================================
// 5. CROWN, CANOPY AND PITCHED ROOF
// =============================================================
// large sloping canopy above the balcony stack
const canY = shaftTop - floorH * 1.15;
const canopy = addBox(towerW + 3.2, 0.7, 5.4, 0.0, canY, hd + 2.0, matSlab);
canopy.rotation.x = 0.13;                 // slopes down towards the balcony side

// cornice band at the base of the crown storey
addPrism(plan(1.2), 0.9, shaftTop - 0.3, matSlab);

// crown / plant storey
addPrism(plan(0.35), crownH, shaftTop, matWall);
addBox(towerW * 0.55, crownH * 0.55, 0.25, -1.0, shaftTop + crownH * 0.5, hd + 0.5, matGlass);

// top parapet ring
addPrism(plan(0.85), 0.7, shaftTop + crownH - 0.7, matSlab);

// gable roof (the triangular cap seen at the top of the image)
addGableRoof(towerW + 0.7, towerD + 0.7, roofH, shaftTop + crownH, matWall);

// =============================================================
// 6. LOW ANNEX BLOCK  (open-top volume in front of the podium)
// =============================================================
const lbW = 12.0, lbD = 11.0, lbH = 5.2, lbT = 0.7;
const lbX = -(hw + podiumOut) - lbW / 2 + 4.0;
const lbZ =  (hd + podiumOut) + lbD / 2 - 5.0;

addBox(lbW, 0.6, lbD, lbX, 0.3, lbZ, matSlab);                                   // floor slab
addBox(lbT, lbH, lbD, lbX - lbW / 2 + lbT / 2, lbH / 2, lbZ, matWall);           // -X wall
addBox(lbT, lbH, lbD, lbX + lbW / 2 - lbT / 2, lbH / 2, lbZ, matWall);           // +X wall
addBox(lbW, lbH, lbT, lbX, lbH / 2, lbZ - lbD / 2 + lbT / 2, matWall);           // -Z wall
addBox(lbW, lbH, lbT, lbX, lbH / 2, lbZ + lbD / 2 - lbT / 2, matWall);           // +Z wall

// internal ramp / low partition (the diagonal line inside the box)
const ramp = addBox(0.3, 1.0, lbD * 0.75, lbX + 1.0, 0.9, lbZ, matTrim);
ramp.rotation.y = 0.35;

// =============================================================
// 7. CAMERA
// =============================================================
camera.position.set(78, 62, 88);
camera.lookAt(0, shaftTop * 0.45, 0);