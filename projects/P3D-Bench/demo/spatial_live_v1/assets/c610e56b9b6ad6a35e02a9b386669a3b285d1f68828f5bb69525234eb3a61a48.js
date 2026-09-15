// =====================================================================
//  Residential high-rise tower — parametric Three.js recreation
//  Interpretation of the reference image:
//   * 15-storey point-block tower on a taller ground storey
//   * front-left (+Z) face: ribbon glazing with projecting balconies
//   * right (+X) face: mullioned window bands + banded chamfered corner
//   * louvered fin strip wrapping the front-left corner (stair core)
//   * stepped double-gable penthouse roof + parapetted flat roof
//   * two low annex blocks at the base (front-left and front-right)
// =====================================================================

// ---------------- Parameters ----------------
const towerW   = 16;          // tower width  (X)
const towerD   = 13;          // tower depth  (Z)
const chamfer  = 2.5;         // 45° corner cut at back-right corner
const groundH  = 4.4;         // ground storey height
const floorH   = 3.2;         // typical floor height
const nFloors  = 15;          // number of typical floors
const towerH   = groundH + nFloors * floorH;

const balcProj  = 1.6;        // balcony projection depth
const pentWallH = 1.6;        // penthouse wall height
const ridgeBig  = 3.5;        // main gable rise
const ridgeSm   = 2.0;        // secondary (stepped) gable rise

// ---------------- Materials ----------------
const matWall = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.85, metalness: 0.05 });
const matMid  = new THREE.MeshStandardMaterial({ color: 0xc2c2c2, roughness: 0.80, metalness: 0.05 });
const matRoof = new THREE.MeshStandardMaterial({ color: 0x6a6c6e, roughness: 0.70, metalness: 0.10 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x1b1d1f, roughness: 0.40, metalness: 0.30 });
const edgeMat = new THREE.LineBasicMaterial({ color: 0x111111 });

const building = new THREE.Group();
scene.add(building);

// ---------------- Helpers ----------------
function box(w, h, d, x, y, z, mat, opts = {}) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (opts.rx) m.rotation.x = opts.rx;
  if (opts.ry) m.rotation.y = opts.ry;
  if (opts.rz) m.rotation.z = opts.rz;
  building.add(m);
  if (opts.edges) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat));
  return m;
}

// ---------------- Tower body (chamfered footprint, extruded) ----------------
function towerShape() {
  const s = new THREE.Shape();
  s.moveTo(-towerW / 2, -towerD / 2);
  s.lineTo(towerW / 2 - chamfer, -towerD / 2);   // chamfer starts
  s.lineTo(towerW / 2, -towerD / 2 + chamfer);   // chamfer ends
  s.lineTo(towerW / 2, towerD / 2);
  s.lineTo(-towerW / 2, towerD / 2);
  s.closePath();
  return s;
}
const bodyGeo = new THREE.ExtrudeGeometry(towerShape(), { depth: towerH, bevelEnabled: false });
bodyGeo.rotateX(Math.PI / 2);        // shape XY -> XZ footprint, extrude along -Y
bodyGeo.translate(0, towerH, 0);     // body spans y = 0 .. towerH
const body = new THREE.Mesh(bodyGeo, matWall);
building.add(body);
body.add(new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo, 20), edgeMat));

// ---------------- Typical floors ----------------
const ry45 = Math.PI * 0.75;         // aligns boxes with the chamfer plane
for (let i = 0; i < nFloors; i++) {
  const y0 = groundH + i * floorH;

  // --- left (+Z) face : ribbon window + balcony ---
  box(7.7, 1.6, 0.25, -1.05, y0 + 2.2, 6.55, matDark, { edges: true });         // glazing band
  box(8.1, 0.22, balcProj, -1.25, y0 + 0.11, 6.5 + balcProj / 2, matMid, { edges: true }); // slab
  box(8.1, 0.95, 0.10, -1.25, y0 + 0.72, 6.5 + balcProj - 0.06, matDark);       // railing
  box(0.14, 1.0, balcProj - 0.1, -3.8, y0 + 0.72, 7.25, matWall);               // divider fins
  box(0.14, 1.0, balcProj - 0.1,  1.3, y0 + 0.72, 7.25, matWall);

  // --- left (+Z) face : mullioned grid section near front corner ---
  box(3.9, 1.7, 0.25, 5.45, y0 + 2.05, 6.55, matDark, { edges: true });
  box(0.16, 2.0, 0.20, 4.8, y0 + 2.05, 6.58, matWall);
  box(0.16, 2.0, 0.20, 6.1, y0 + 2.05, 6.58, matWall);

  // --- right (+X) face : two mullioned window bays ---
  box(0.28, 1.7, 4.0, 8.02, y0 + 2.05, -1.3, matDark, { edges: true });
  box(0.28, 1.7, 4.0, 8.02, y0 + 2.05,  3.9, matDark, { edges: true });
  [-2.4, -1.3, -0.2, 2.8, 3.9, 5.0].forEach(z =>
    box(0.20, 2.0, 0.16, 8.05, y0 + 2.05, z, matWall));
  if (i < nFloors - 1) box(0.12, 0.3, 10.6, 8.06, y0 + floorH - 0.15, 1.25, matMid); // floor line

  // --- chamfered corner : dark spandrel + light band per floor ---
  box(3.3, 1.7, 0.14, 6.79, y0 + 2.05, -5.29, matDark, { ry: ry45, edges: true });
  box(3.4, 0.4, 0.16, 6.79, y0 + 0.25, -5.29, matMid, { ry: ry45 });
}

// ---------------- Louvered fin strip (front-left corner, full height) ----------------
box(3.0, towerH - 0.5, 0.20, -6.45, towerH / 2, 6.56, matDark);                   // dark backing (+Z side)
for (let k = 0; k < 5; k++)
  box(0.34, towerH - 0.5, 0.14, -7.75 + k * 0.5, towerH / 2, 6.84, matWall);      // vertical slats
box(0.20, towerH - 0.5, 1.5, -8.31, towerH / 2, 5.55, matDark);                   // backing wraps corner
[5.95, 5.45, 4.95].forEach(z =>
  box(0.14, towerH - 0.5, 0.34, -8.60, towerH / 2, z, matWall));

// ---------------- Roof : parapet + stepped gable penthouse ----------------
box(16.6, 0.9, 0.26,  0,    towerH + 0.45,  6.63, matWall, { edges: true });      // front parapet
box( 0.26, 0.9, 5.4, -8.13, towerH + 0.45,  3.90, matWall);                       // left parapet
box( 0.26, 0.9, 10.6, 8.13, towerH + 0.45,  1.30, matWall);                       // right parapet
box(12.9, 0.9, 0.26, -2.05, towerH + 0.45, -6.62, matWall);                       // back parapet
box( 4.0, 0.9, 0.26,  6.84, towerH + 0.45, -5.34, matWall, { ry: ry45 });         // chamfer parapet

box(15, pentWallH, 7.4, 0, towerH + pentWallH / 2, -2.2, matWall, { edges: true }); // penthouse wall
box(15.8, 0.30, 8.4, 0, towerH + pentWallH - 0.15, -2.2, matMid, { edges: true });  // eave slab

function gable(halfBase, rise, cx, z0) {                                          // ridge along Z
  const sh = new THREE.Shape();
  sh.moveTo(-halfBase, 0); sh.lineTo(halfBase, 0); sh.lineTo(0, rise); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 7.2, bevelEnabled: false });
  g.translate(cx, towerH + pentWallH, z0);
  const m = new THREE.Mesh(g, [matWall, matRoof]);  // light gable ends, dark slopes
  building.add(m);
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), edgeMat));
}
gable(4.5,  ridgeBig, -2.5, -5.8);   // main gable (apex toward left)
gable(2.75, ridgeSm,   4.75, -5.8);  // stepped lower gable toward the right

box(5.4, 0.18, 3.0, -5.6, towerH + 2.55, 2.9, matMid, { rz: 0.34, edges: true }); // shed canopy over fin top

// ---------------- Right annex (wraps base of right face) ----------------
box(6.5, 6.4, 13, 11.25, 3.2, 3.5, matWall, { edges: true });                     // main volume
box(0.16, 2.0, 11.6, 14.56, 1.6, 3.2, matDark, { edges: true });                  // dark bands (+X)
box(0.16, 2.0, 11.6, 14.56, 4.6, 3.2, matDark, { edges: true });
[-0.5, 3.5, 7.5].forEach(z => box(0.20, 5.4, 0.30, 14.60, 3.0, z, matWall));      // light fins
box(0.14, 0.3, 12.4, 14.55, 3.25, 3.5, matMid);                                   // floor line
box(1.0, 5.9, 1.0, 14.15, 3.0, 9.65, matDark);                                    // dark corner slot
box(1.3, 2.4, 0.16, 10.8, 1.2, 10.06, matDark);                                   // entrance door (+Z)
box(1.8, 1.5, 0.16, 13.2, 4.5, 10.06, matDark);                                   // upper window (+Z)
box(6.9, 0.5, 0.24, 11.25, 6.65, 10.12, matWall);                                 // parapet
box(0.24, 0.5, 13.6, 14.62, 6.65, 3.40, matWall);

// ---------------- Left annex (low block with overhanging roof slab) ----------------
box(7.0, 4.6, 5.5, -11.0, 2.3, 3.75, matWall, { edges: true });
box(7.7, 0.35, 6.3, -11.2, 4.78, 3.70, matMid, { edges: true });                  // overhanging roof slab
box(2.4, 1.3, 0.16, -10.2, 3.1, 6.56, matDark);                                   // window (+Z)
box(0.95, 2.0, 0.16, -13.4, 1.0, 6.56, matDark);                                  // door (+Z)
box(0.16, 1.1, 1.6, -14.56, 1.9, 2.4, matDark);                                   // small opening (-X)

// ---------------- Ground storey details ----------------
box(2.2, 2.7, 0.18, 3.5, 1.35, 6.56, matDark);                                    // main entrance (+Z)
box(3.2, 0.16, 1.0, 3.5, 2.85, 6.90, matMid, { edges: true });                    // entrance canopy
box(0.6, 2.2, 0.12, 6.2, 1.1, 6.55, matDark);                                     // narrow slot
box(0.18, 2.6, 2.6, 8.06, 1.3, -0.6, matDark);                                    // side entrance (+X)
box(0.9, 0.14, 3.2, 8.45, 2.75, -0.6, matMid);                                    // side canopy

// ---------------- Camera ----------------
camera.position.set(52, 38, 62);
camera.lookAt(0, 24, 1);
if (typeof controls !== 'undefined' && controls && controls.target) {
  controls.target.set(0, 24, 1);
  if (controls.update) controls.update();
}