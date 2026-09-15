// =============================================================================
// Architectural high-rise massing model (isometric CAD / BIM look)
// Interpretation of the image:
//  - Rectangular tower on a chamfered podium with a low courtyard annex
//  - +X facade: punched residential window grid (right face in the image)
//  - +Z facade: open-slab atrium / parking with dark void and stacked rooms
//  - Twin vertical fins at the left edge of the atrium
//  - Crown: cantilevered slab + triangular gable + flat-roof penthouse
// =============================================================================

const building = new THREE.Group();

// --- Materials (light-gray massing, dark recesses, CAD edges) ---------------
const wallMat = new THREE.MeshStandardMaterial({
  color: 0xc5c5c5,
  roughness: 0.82,
  metalness: 0.04,
  side: THREE.DoubleSide
});
const slabMat = new THREE.MeshStandardMaterial({
  color: 0xd0d0d0,
  roughness: 0.78,
  metalness: 0.03
});
const roofMat = new THREE.MeshStandardMaterial({
  color: 0xb3b3b3,
  roughness: 0.7,
  metalness: 0.06,
  side: THREE.DoubleSide
});
const podiumMat = new THREE.MeshStandardMaterial({
  color: 0xbdbdbd,
  roughness: 0.85,
  metalness: 0.03,
  side: THREE.DoubleSide
});
const windowMat = new THREE.MeshStandardMaterial({
  color: 0x3a3a3a,
  roughness: 0.45,
  metalness: 0.18
});
const voidMat = new THREE.MeshStandardMaterial({
  color: 0x0c0c0c,
  roughness: 0.9,
  metalness: 0.0
});
const paneMat = new THREE.MeshStandardMaterial({
  color: 0x2f2f2f,
  roughness: 0.4,
  metalness: 0.22
});
const edgeMat = new THREE.LineBasicMaterial({ color: 0x111111 });

// --- Helpers ----------------------------------------------------------------
function addEdges(mesh, threshold = 25) {
  const eg = new THREE.EdgesGeometry(mesh.geometry, threshold);
  mesh.add(new THREE.LineSegments(eg, edgeMat));
}

function addMesh(geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  m.receiveShadow = true;
  addEdges(m);
  building.add(m);
  return m;
}

function box(w, h, d, mat, x, y, z, rx, ry, rz) {
  return addMesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, rx, ry, rz);
}

// Extrude an XZ footprint (points are [x, z], CCW from above) along +Y
function extrudeXZ(points, height, mat, yBottom) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], -points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], -points[i][1]);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 1
  });
  geo.rotateX(-Math.PI / 2);
  return addMesh(geo, mat, 0, yBottom, 0);
}

// Triangular prism (gable): triangle in XY, extruded along Z
function addGable(widthX, heightY, depthZ, mat, cx, yBottom, cz) {
  const shape = new THREE.Shape();
  shape.moveTo(-widthX / 2, 0);
  shape.lineTo(widthX / 2, 0);
  shape.lineTo(0, heightY);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: depthZ, bevelEnabled: false });
  geo.translate(0, 0, -depthZ / 2);
  return addMesh(geo, mat, cx, yBottom, cz);
}

// --- Parameters (units ~ meters) --------------------------------------------
const FLOOR_H = 3.45;
const SLAB_T = 0.38;
const N_OPEN = 16;          // open-slab floors above podium
const PODIUM_H = 9.8;

const APT_W = 7.2;          // +X windowed wing width
const VOID_W = 11.0;        // atrium / open-slab width
const TOWER_D = 15.2;       // Z depth (width of windowed facade)

const openH = N_OPEN * FLOOR_H;          // 55.2
const crownH = 5.8;                      // hat over atrium
const gableH = 6.4;
const aptH = openH + crownH + 3.2;       // windowed shaft continues as penthouse

// Layout: void occupies x in [-VOID_W, 0], apt occupies x in [0, APT_W]
const aptCX = APT_W / 2;
const voidCX = -VOID_W / 2;
const zFront = TOWER_D / 2;              // +Z facade (open slabs, left in image)
const zBack = -TOWER_D / 2;

const yPodiumTop = PODIUM_H;
const yOpenTop = PODIUM_H + openH;
const yAptTop = PODIUM_H + aptH;

// =============================================================================
// 1. Podium — wider base with a 45-ish chamfer on the +X side
// =============================================================================
extrudeXZ(
  [
    [-18.5,  9.4],
    [  5.2,  9.4],
    [  7.4,  8.2],
    [ 16.6,  2.2],
    [ 16.6, -6.4],
    [ 11.2, -11.2],
    [-18.5, -11.2]
  ],
  PODIUM_H,
  podiumMat,
  0
);

// Front lip under the atrium (reads as the solid podium face in the image)
box(VOID_W + APT_W + 1.6, PODIUM_H, 2.4, podiumMat, (APT_W - VOID_W) / 2 - 0.4, PODIUM_H / 2, zFront + 0.55);

// =============================================================================
// 2. Low courtyard annex on the left (–X / +Z)
//    Modeled as a U-shaped parapet around a recessed terrace
// =============================================================================
const ax0 = -24.2, ax1 = -15.4;
const az0 = -1.2, az1 = 11.4;
const annexW = ax1 - ax0;
const annexD = az1 - az0;
const annexCX = (ax0 + ax1) / 2;
const annexCZ = (az0 + az1) / 2;
const wallT = 0.85;

// Terrace floor (slightly below podium top so we look into it)
box(annexW, 0.5, annexD, roofMat, annexCX, PODIUM_H - 1.35, annexCZ);

// Outer walls
box(annexW, PODIUM_H, wallT, podiumMat, annexCX, PODIUM_H / 2, az1 - wallT / 2); // +Z
box(annexW, PODIUM_H, wallT, podiumMat, annexCX, PODIUM_H / 2, az0 + wallT / 2); // -Z
box(wallT, PODIUM_H, annexD, podiumMat, ax0 + wallT / 2, PODIUM_H / 2, annexCZ); // -X
box(wallT, PODIUM_H, annexD * 0.42, podiumMat, ax1 - wallT / 2, PODIUM_H / 2, az0 + annexD * 0.21); // +X partial

// Inner courtyard walls (smaller rectangle, as in the image)
const ix0 = ax0 + 2.6, ix1 = ax1 - 2.4;
const iz0 = az0 + 2.5, iz1 = az1 - 2.8;
const iW = ix1 - ix0, iD = iz1 - iz0;
const iCX = (ix0 + ix1) / 2, iCZ = (iz0 + iz1) / 2;
const iH = 2.6;
box(iW, iH, 0.45, wallMat, iCX, PODIUM_H - 1.1 + iH / 2, iz1 - 0.22);
box(iW, iH, 0.45, wallMat, iCX, PODIUM_H - 1.1 + iH / 2, iz0 + 0.22);
box(0.45, iH, iD, wallMat, ix0 + 0.22, PODIUM_H - 1.1 + iH / 2, iCZ);
box(0.45, iH, iD, wallMat, ix1 - 0.22, PODIUM_H - 1.1 + iH / 2, iCZ);
box(iW - 0.4, 0.3, iD - 0.4, voidMat, iCX, PODIUM_H - 1.05, iCZ);

// Connector slab between annex and main podium
box(4.2, PODIUM_H, 6.5, podiumMat, -16.4, PODIUM_H / 2, 4.2);

// =============================================================================
// 3. Windowed apartment / office shaft (+X wing)
// =============================================================================
box(APT_W, aptH, TOWER_D, wallMat, aptCX, yPodiumTop + aptH / 2, 0);

// Thin spandrel / reveal on the +X face so windows read as punched openings
box(0.18, aptH - 1.2, TOWER_D - 0.4, slabMat, APT_W + 0.02, yPodiumTop + aptH / 2, 0);

// =============================================================================
// 4. Window grid on the +X facade (2 bays, 2x2 panes per floor)
// =============================================================================
const nWinFloors = Math.round(aptH / FLOOR_H) - 1; // leave a solid parapet band
const bayCenters = [-3.55, 3.55];
const paneW = 1.55;
const paneH = 1.12;
const paneGapZ = 1.72;
const paneGapY = 1.28;
const faceX = APT_W + 0.12;

for (let row = 0; row < nWinFloors; row++) {
  const yFloor = yPodiumTop + row * FLOOR_H;
  const yMid = yFloor + FLOOR_H * 0.52;
  for (let b = 0; b < 2; b++) {
    const zc = bayCenters[b];
    for (let py = -0.5; py <= 0.5; py++) {
      for (let pz = -0.5; pz <= 0.5; pz++) {
        box(
          0.22,
          paneH,
          paneW,
          paneMat,
          faceX,
          yMid + py * paneGapY,
          zc + pz * paneGapZ
        );
      }
    }
    // mullions (horizontal + vertical) to match the CAD window bars
    box(0.28, 0.1, paneW * 2 + 0.3, wallMat, faceX + 0.04, yMid, zc);
    box(0.28, paneH * 2 + 0.25, 0.1, wallMat, faceX + 0.04, yMid, zc);
  }
}

// Solid cap / parapet band at the top of the windowed shaft
box(APT_W + 0.3, 1.35, TOWER_D + 0.3, wallMat, aptCX, yAptTop - 0.55, 0);

// =============================================================================
// 5. Open-slab atrium (–X wing) — stacked floor plates over a dark void
// =============================================================================
// Dark interior volume (reads as the black recess in the image)
box(VOID_W - 1.1, openH - 0.4, TOWER_D - 2.2, voidMat, voidCX + 0.15, yPodiumTop + openH / 2, -0.2);

// Back wall of the atrium
box(VOID_W, openH, 0.55, wallMat, voidCX, yPodiumTop + openH / 2, zBack + 0.28);

// Left (–X) party wall — its +Z edge is the outer fin of the open facade
box(0.55, openH, TOWER_D, wallMat, -VOID_W + 0.28, yPodiumTop + openH / 2, 0);

// Floor slabs at every storey
for (let i = 0; i <= N_OPEN; i++) {
  const y = yPodiumTop + i * FLOOR_H;
  // primary plate spanning atrium
  box(VOID_W - 0.15, SLAB_T, TOWER_D - 0.35, slabMat, voidCX + 0.1, y, 0.1);
  // slightly projecting front nosing (the dense horizontal lines on +Z)
  box(VOID_W - 0.15, SLAB_T * 0.7, 0.7, slabMat, voidCX + 0.1, y - 0.05, zFront + 0.15);
}

// A couple of interior columns in the void
box(0.55, openH, 0.55, wallMat, -VOID_W * 0.38, yPodiumTop + openH / 2, 1.8);
box(0.55, openH, 0.55, wallMat, -VOID_W * 0.62, yPodiumTop + openH / 2, -2.6);

// =============================================================================
// 6. Twin vertical fins at the left edge of the +Z facade
// =============================================================================
const finH = openH + 0.2;
box(0.42, finH, 1.35, wallMat, -VOID_W + 0.55, yPodiumTop + finH / 2, zFront - 0.35);
box(0.38, finH, 1.15, wallMat, -VOID_W + 1.25, yPodiumTop + finH / 2, zFront - 0.25);
// dark slit between fins
box(0.28, finH - 0.4, 0.2, voidMat, -VOID_W + 0.9, yPodiumTop + finH / 2, zFront + 0.15);

// =============================================================================
// 7. Stacked rooms / balconies on the atrium side of the apartment wing
//    These are the “toothed” boxes along the right of the open facade
// =============================================================================
for (let i = 0; i < N_OPEN; i++) {
  const y0 = yPodiumTop + i * FLOOR_H;
  const bh = FLOOR_H - SLAB_T - 0.18;
  const by = y0 + SLAB_T + bh / 2;

  // room volume projecting into the atrium from the apt –X face, toward +Z
  const rw = 3.9;
  const rd = 5.4;
  const rx = -rw / 2 + 0.15;
  const rz = zFront - rd / 2 - 0.15;
  box(rw, bh, rd, wallMat, rx, by, rz);

  // dark opening facing +Z (balcony / room mouth)
  box(rw - 0.7, bh * 0.72, 0.22, voidMat, rx, by - 0.05, rz + rd / 2 - 0.05);

  // thinner side opening toward the void (–X)
  box(0.18, bh * 0.55, rd * 0.45, voidMat, rx - rw / 2 + 0.02, by, rz + 0.4);

  // extra slab tongue over each room (the stepped shelves in the image)
  box(rw + 0.8, SLAB_T, rd + 0.9, slabMat, rx - 0.2, y0 + FLOOR_H, rz + 0.2);
}

// =============================================================================
// 8. Crown — thick cantilevered “hat” over the open-slab wing
// =============================================================================
const crownY = yOpenTop + crownH / 2;
box(
  VOID_W + 1.8,
  crownH,
  TOWER_D + 3.4,
  wallMat,
  voidCX + 0.3,
  crownY,
  0.9
);
// underside shadow band
box(VOID_W + 1.4, 0.35, TOWER_D + 2.8, voidMat, voidCX + 0.3, yOpenTop + 0.2, 0.7);

// =============================================================================
// 9. Triangular gable sitting on the front of the crown (faces +Z)
// =============================================================================
const gableY = yOpenTop + crownH;
const gableZ = zFront + 0.6;
addGable(VOID_W - 0.6, gableH, 6.2, roofMat, voidCX + 0.5, gableY, gableZ);

// small rectangular attic block behind the gable, under the penthouse
box(VOID_W - 1.2, 3.4, 7.5, wallMat, voidCX + 0.4, gableY + 1.7, -1.2);

// =============================================================================
// 10. Penthouse roof (flat, with parapet) — continuation of the +X shaft
// =============================================================================
box(APT_W + 0.55, 0.42, TOWER_D + 0.55, roofMat, aptCX, yAptTop + 0.22, 0);

// parapet walls
const parH = 1.15;
const parT = 0.28;
const ry = yAptTop + 0.42 + parH / 2;
box(APT_W + 0.55, parH, parT, wallMat, aptCX, ry, zFront + 0.27);
box(APT_W + 0.55, parH, parT, wallMat, aptCX, ry, zBack - 0.27);
box(parT, parH, TOWER_D + 0.55, wallMat, APT_W + 0.27, ry, 0);
box(parT, parH, TOWER_D + 0.55, wallMat, -0.12, ry, 0);

// roof surface inside parapet
box(APT_W - 0.1, 0.12, TOWER_D - 0.15, roofMat, aptCX, yAptTop + 0.48, 0);

scene.add(building);

// --- Camera (high isometric, matching the reference view) -------------------
camera.position.set(92, 82, 98);
camera.lookAt(-1, 38, 0);