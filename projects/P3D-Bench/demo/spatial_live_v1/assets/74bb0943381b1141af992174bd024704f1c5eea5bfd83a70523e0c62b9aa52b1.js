// ============================================================
//  HIGH-RISE TOWER — parametric recreation of the reference
//  Interpretation:
//   - Slender point tower with a chamfered-rectangle plan
//   - 2-storey podium + small attached annex block (left)
//   - Two shaft sections joined by a sloped "skirt"
//   - Front facade: 3 stacked balcony bays (zig-zag fins)
//     flanked by window strips; side facades: 4-window grid
//   - Stepped, tapered crown / mechanical penthouse on top
// ============================================================

// -------------------- PARAMETERS --------------------
const P = {
  // lower shaft plan
  tw: 24, td: 20, ch: 3.5,
  floorH: 3,
  lowFloors: 15,
  // upper shaft plan (slightly larger -> sloped skirt between)
  upW: 26, upD: 24, upCh: 3.5,
  upFloors: 6,
  skirtH: 3.5,
  // podium
  podW: 31, podD: 27, podCh: 3.5, podH: 6.5,
  // annex block
  anW: 11, anD: 9, anH: 8,
  // crown
  cr1W: 21, cr1D: 19, cr1Ch: 3, cr1H: 3,     // straight tier
  cr2W: 15, cr2D: 13, cr2Ch: 2.5, cr2H: 3.2, // tapered tier
  crownDZ: 1.5,                              // crown shifted to rear
  // balconies
  balcW: 3.2, balcDepth: 1.4,
};

// derived heights
const yPod      = P.podH;
const yLowTop   = yPod + P.lowFloors * P.floorH;
const ySkirtTop = yLowTop + P.skirtH;
const yUpTop    = ySkirtTop + P.upFloors * P.floorH;
const yCr1Top   = yUpTop + P.cr1H;
const yCr2Top   = yCr1Top + P.cr2H;

// -------------------- MATERIALS --------------------
const matBody   = new THREE.MeshStandardMaterial({ color: 0xc4c4c4, roughness: 0.9 });
const matSlab   = new THREE.MeshStandardMaterial({ color: 0x7d7d7d, roughness: 0.9 });
const matFrame  = new THREE.MeshStandardMaterial({ color: 0xa6a6a6, roughness: 0.85 });
const matAccent = new THREE.MeshStandardMaterial({ color: 0x8c8c8c, roughness: 0.85 });
const matGlass  = new THREE.MeshStandardMaterial({ color: 0x161a20, roughness: 0.35, metalness: 0.35 });
const matRoof   = new THREE.MeshStandardMaterial({ color: 0xb2b2b2, roughness: 0.9 });
const matGround = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 1.0 });

// -------------------- HELPERS --------------------
// Chamfered rectangle footprint (clockwise seen from +Y -> outward normals)
function chamferedRect(w, d, c) {
  const hw = w / 2, hd = d / 2;
  return [
    [-hw + c, -hd], [-hw, -hd + c],
    [-hw,  hd - c], [-hw + c,  hd],
    [ hw - c,  hd], [ hw,  hd - c],
    [ hw, -hd + c], [ hw - c, -hd],
  ];
}

// Scale / translate footprint points about the origin
function scalePts(pts, kx, kz, dx = 0, dz = 0) {
  return pts.map(([x, z]) => [x * kx + dx, z * kz + dz]);
}

// Frustum between two footprints (flat-shaded, capped)
function frustum(bot, top, y0, y1) {
  const pos = [];
  const n = bot.length;
  for (let i = 0; i < n; i++) {                    // side walls
    const j = (i + 1) % n;
    const b0 = bot[i], b1 = bot[j], t0 = top[i], t1 = top[j];
    pos.push(b0[0], y0, b0[1], b1[0], y0, b1[1], t1[0], y1, t1[1]);
    pos.push(b0[0], y0, b0[1], t1[0], y1, t1[1], t0[0], y1, t0[1]);
  }
  for (let i = 1; i < n - 1; i++) {                // top + bottom caps
    pos.push(top[0][0], y1, top[0][1], top[i][0], y1, top[i][1], top[i + 1][0], y1, top[i + 1][1]);
    pos.push(bot[0][0], y0, bot[0][1], bot[i + 1][0], y0, bot[i + 1][1], bot[i][0], y0, bot[i][1]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// Straight prism from a footprint
function prism(pts, y0, y1, mat) {
  return new THREE.Mesh(frustum(pts, pts, y0, y1), mat);
}

// Protruding horizontal slab band following the footprint
function band(pts, w, d, y, h, out, mat) {
  const s = scalePts(pts, (w + 2 * out) / w, (d + 2 * out) / d);
  return prism(s, y, y + h, mat);
}

// Box helper
function addBox(parent, w, h, d, x, y, z, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

// Evenly spread n centres between a and b
function spread(n, a, b) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(a + (b - a) * (n === 1 ? 0.5 : i / (n - 1)));
  return arr;
}

// -------------------- FOOTPRINTS --------------------
const lowerPts = chamferedRect(P.tw, P.td, P.ch);
const upperPts = chamferedRect(P.upW, P.upD, P.upCh);
const podPts   = chamferedRect(P.podW, P.podD, P.podCh);

// -------------------- BALCONY (zig-zag bays) --------------------
function balcony(x, y, hd, flip) {
  const g = new THREE.Group();
  const w = P.balcW, d = P.balcDepth, zf = -hd;
  addBox(g, w, 0.25, d, x, y + 0.13, zf - d / 2, matSlab);              // slab
  addBox(g, w, 1.0, 0.1, x, y + 0.75, zf - d + 0.05, matFrame);         // front parapet
  addBox(g, 0.1, 1.0, d - 0.1, x - w / 2 + 0.05, y + 0.75, zf - d / 2, matFrame); // sides
  addBox(g, 0.1, 1.0, d - 0.1, x + w / 2 - 0.05, y + 0.75, zf - d / 2, matFrame);
  const fin = addBox(g, 0.12, 2.0, d * 0.9, x + flip * (w / 2 - 0.1), y + 1.3, zf - d / 2 + 0.05, matAccent); // sloped fin
  fin.rotation.x = 0.42;
  addBox(g, w - 0.5, 2.1, 0.1, x, y + 1.45, zf - 0.03, matGlass);       // dark door glass
  return g;
}

// -------------------- SHAFT BUILDER --------------------
function buildShaft(pts, w, d, floors, yBase, opt) {
  const hw = w / 2, hd = d / 2, H = floors * P.floorH;
  const g = new THREE.Group();
  g.add(prism(pts, yBase, yBase + H, matBody));                          // main mass

  // vertical pilasters framing the front balcony zone
  [-5.55, 5.55].forEach(x => addBox(g, 0.5, H, 0.3, x, yBase + H / 2, -hd - 0.12, matSlab));

  const sideZ = spread(4, opt.sideMin, opt.sideMax);
  for (let i = 0; i < floors; i++) {
    const y = yBase + i * P.floorH;
    const wy = y + 1.5;
    g.add(band(pts, w, d, y, 0.32, 0.14, matSlab));                      // floor line
    [-7.2, 7.2].forEach(x => addBox(g, 2.2, 1.7, 0.14, x, wy, -hd - 0.05, matGlass));   // front windows
    spread(3, -5.5, 5.5).forEach(x => addBox(g, 3, 1.7, 0.14, x, wy, hd + 0.05, matGlass)); // rear windows
    sideZ.forEach(z => {                                                 // side window grids
      addBox(g, 0.14, 1.7, opt.sideWinW,  hw + 0.05, wy, z, matGlass);
      addBox(g, 0.14, 1.7, opt.sideWinW, -hw - 0.05, wy, z, matGlass);
    });
    if (opt.balconies) {                                                 // balcony bays
      [-3.4, 0, 3.4].forEach((bx, k) =>
        g.add(balcony(bx, y, hd, ((i + k) % 2 === 0) ? 1 : -1)));
    }
  }
  g.add(band(pts, w, d, yBase + H, 0.5, 0.2, matSlab));                  // top band
  return g;
}

// -------------------- PODIUM & ANNEX --------------------
scene.add(prism(podPts, 0, P.podH, matBody));                                     // podium mass
scene.add(band(podPts, P.podW, P.podD, 0.4, 3.2, 0.12, matGlass));                // glazed storefront
scene.add(band(podPts, P.podW, P.podD, P.podH - 0.35, 0.35, 0.35, matSlab));      // roof slab edge

// sloped glass canopy on the podium's right side (angular base feature)
const canopy = addBox(scene, 7, 0.25, 10, P.podW / 2 + 2.4, 4.1, 3, matGlass);
canopy.rotation.z = -0.5;
addBox(scene, 0.3, 2.4, 10, P.podW / 2 + 5.5, 1.2, 3, matFrame);                  // canopy low wall

// annex block attached to the left
const ax = -(P.podW / 2) - P.anW / 2 + 2.5, az = -4;
addBox(scene, P.anW, P.anH, P.anD, ax, P.anH / 2, az, matBody);
addBox(scene, P.anW + 0.5, 1.0, P.anD + 0.5, ax, P.anH - 0.4, az, matBody);       // parapet rim
addBox(scene, P.anW - 1.2, 0.2, P.anD - 1.2, ax, P.anH + 0.05, az, matGlass);     // recessed roof
addBox(scene, P.anW - 2, 1.6, 0.14, ax, 5.2, az - P.anD / 2 - 0.05, matGlass);    // annex windows
addBox(scene, P.anW - 2, 1.6, 0.14, ax, 2.4, az - P.anD / 2 - 0.05, matGlass);
addBox(scene, 0.14, 1.6, P.anD - 2, ax - P.anW / 2 - 0.05, 5.2, az, matGlass);
addBox(scene, 0.14, 1.6, P.anD - 2, ax - P.anW / 2 - 0.05, 2.4, az, matGlass);

// -------------------- TOWER SHAFTS + SKIRT --------------------
scene.add(buildShaft(lowerPts, P.tw, P.td, P.lowFloors, yPod,
  { sideWinW: 2.2, sideMin: -4.5, sideMax: 4.5, balconies: true }));
scene.add(buildShaft(upperPts, P.upW, P.upD, P.upFloors, ySkirtTop,
  { sideWinW: 3.0, sideMin: -6, sideMax: 6, balconies: true }));

// sloped transition skirt between the two sections
scene.add(new THREE.Mesh(frustum(lowerPts, upperPts, yLowTop, ySkirtTop), matRoof));

// -------------------- CROWN --------------------
const cr1 = scalePts(chamferedRect(P.cr1W, P.cr1D, P.cr1Ch), 1, 1, 0, P.crownDZ);
const cr2 = scalePts(chamferedRect(P.cr2W, P.cr2D, P.cr2Ch), 1, 1, 0, P.crownDZ);
scene.add(band(upperPts, P.upW, P.upD, yUpTop, 0.9, 0.25, matBody));              // roof parapet
scene.add(prism(cr1, yUpTop, yCr1Top, matBody));                                  // penthouse tier
scene.add(new THREE.Mesh(frustum(cr1, cr2, yCr1Top, yCr2Top), matRoof));          // tapered hip cap
addBox(scene, 8, 1.6, 0.14, 0, yUpTop + 1.5, -(P.cr1D / 2) + P.crownDZ - 0.05, matGlass);  // louvres F
addBox(scene, 0.14, 1.6, 8,  P.cr1W / 2 + 0.05, yUpTop + 1.5, P.crownDZ, matGlass);        // louvres R
addBox(scene, 0.14, 1.6, 8, -P.cr1W / 2 - 0.05, yUpTop + 1.5, P.crownDZ, matGlass);        // louvres L
addBox(scene, 7, 1.8, 5, 1, yCr2Top + 0.9, P.crownDZ + 2, matBody);               // bulkhead
addBox(scene, 8, 0.3, 6, 1, yCr2Top + 1.95, P.crownDZ + 2, matSlab);              // cap slab

// -------------------- GROUND & CAMERA --------------------
addBox(scene, 170, 1, 170, 0, -0.5, 0, matGround);

camera.position.set(62, 64, -88);
camera.lookAt(-4, 32, 0);
if (typeof controls !== 'undefined') controls.target.set(-4, 32, 0);