// ==================================================================
//  Slender high-rise tower with gabled roof cap
//  Interpretation of the reference image:
//   - Tall rectangular slab tower (22 x 14 footprint, ~22 floors)
//   - Tapered / flared base (podium skirt) at the bottom
//   - Front face: deep recessed glass bays with projecting slabs
//   - Side faces: dense window grid (spandrels + vertical mullions)
//   - Stepped crown: cornice -> setback block -> steep gable roof
//   - Low parapeted annex wing to the lower-left
// ==================================================================

// ---------------------------- Parameters ----------------------------
const towerWidth  = 22;    // X - width of the tower slab
const towerDepth  = 14;    // Z - depth of the tower slab
const floorCount  = 22;    // number of typical floors
const floorHeight = 3.8;   // floor-to-floor height
const flareHeight = 8;     // height of the tapered base

const halfW = towerWidth / 2;                    // 11
const halfD = towerDepth / 2;                    // 7
const shaftHeight = floorCount * floorHeight;    // 83.6
const shaftTop    = flareHeight + shaftHeight;   // 91.6

// Crown / setback
const setbackW = 17;
const setbackD = 10.5;
const setbackTop = shaftTop + 6;                 // 97.6

// Gable roof cap
const roofW = 20;
const roofD = 13;
const roofH = 9.5;

// Low annex wing (lower-left)
const annexW = 20.4;
const annexD = 12;
const annexH = 5;
const annexX = -21;
const annexZ = 5;

// ---------------------------- Materials ----------------------------
const matConcrete    = new THREE.MeshStandardMaterial({ color: 0xdcdcde, roughness: 0.90, metalness: 0.02 });
const matConcreteMid = new THREE.MeshStandardMaterial({ color: 0xc0c4c8, roughness: 0.90, metalness: 0.02 });
const matGlass       = new THREE.MeshStandardMaterial({ color: 0x14171b, roughness: 0.35, metalness: 0.60 });

// ---------------------------- Helper ----------------------------
function addBox(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

// ==================================================================
//  1. Tower core (dark glass mass that reads through all openings)
// ==================================================================
addBox(towerWidth, shaftTop, towerDepth, matGlass, 0, shaftTop / 2, 0);

// ==================================================================
//  2. Flared / tapered base  (4-sided frustum = square taper)
// ==================================================================
const skirtGeo = new THREE.CylinderGeometry(1, 1.30, flareHeight, 4, 1);
skirtGeo.rotateY(Math.PI / 4);                       // align faces to X / Z axes
const skirt = new THREE.Mesh(skirtGeo, matConcreteMid);
skirt.scale.set((halfW + 0.6) * Math.SQRT2, 1, (halfD + 0.6) * Math.SQRT2);
skirt.position.y = flareHeight / 2;
scene.add(skirt);

// ==================================================================
//  3. Facade: per-floor horizontal slabs and side window grid
// ==================================================================
const facadeTop = flareHeight + shaftHeight;

for (let i = 0; i < floorCount; i++) {
  const yFloor = flareHeight + i * floorHeight;

  // ---- Front & back protruding balcony / floor slabs ----
  addBox(towerWidth + 0.2, 0.9, 2.5, matConcrete, 0, yFloor + 0.45,  halfD + 0.55);
  addBox(towerWidth + 0.2, 0.9, 2.5, matConcrete, 0, yFloor + 0.45, -(halfD + 0.55));

  // ---- Side spandrel bands (create the window grid) ----
  const ySpan = yFloor + floorHeight - 0.6;
  addBox(1.1, 1.0, towerDepth + 0.7, matConcrete,  halfW + 0.45, ySpan, 0);
  addBox(1.1, 1.0, towerDepth + 0.7, matConcrete, -(halfW + 0.45), ySpan, 0);
}

// ---- Vertical corner piers framing the front / back facades ----
const pierH = shaftHeight;
const pierY = flareHeight + shaftHeight / 2;
addBox(2.7, pierH, 1.7, matConcrete, -(halfW - 1.15), pierY,  halfD + 0.4);
addBox(2.7, pierH, 1.7, matConcrete,  (halfW - 1.15), pierY,  halfD + 0.4);
addBox(2.7, pierH, 1.7, matConcrete, -(halfW - 1.15), pierY, -(halfD + 0.4));
addBox(2.7, pierH, 1.7, matConcrete,  (halfW - 1.15), pierY, -(halfD + 0.4));

// ---- Vertical mullions on the two long sides ----
[-6.3, -2.1, 2.1, 6.3].forEach((zPos) => {
  addBox(1.0, pierH, 0.9, matConcrete,  halfW + 0.35, pierY, zPos);
  addBox(1.0, pierH, 0.9, matConcrete, -(halfW + 0.35), pierY, zPos);
});

// ==================================================================
//  4. Crown : cornice -> setback block -> gable roof
// ==================================================================
// Cornice band capping the shaft (slightly oversized, hides core top)
addBox(towerWidth + 1.5, 2.0, towerDepth + 1.5, matConcrete, 0, shaftTop - 0.5, 0);

// Setback block (penetrates the cornice -> no coplanar faces)
const setbackH = 6.5;
addBox(setbackW, setbackH, setbackD, matConcreteMid, 0, shaftTop + 2.75, 0);

// Dark glazing band around the setback
addBox(setbackW + 0.4, setbackH * 0.55, setbackD + 0.4, matGlass, 0, shaftTop + 2.5, 0);

// ---- Gable roof: triangular prism, ridge running along Z ----
const roofShape = new THREE.Shape();
roofShape.moveTo(-roofW / 2, 0);
roofShape.lineTo( roofW / 2, 0);
roofShape.lineTo(0, roofH);
roofShape.closePath();

const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: roofD, bevelEnabled: false });
roofGeo.translate(0, 0, -roofD / 2);          // centre the extrusion on the tower axis

const roof = new THREE.Mesh(roofGeo, matConcrete);
roof.position.y = setbackTop - 0.1;           // sink into the setback (avoids z-fighting)
scene.add(roof);

// ==================================================================
//  5. Low parapeted annex wing (lower-left of the tower)
// ==================================================================
addBox(annexW, annexH, annexD, matConcrete, annexX, annexH / 2, annexZ);

// Parapet walls around the annex roof (gives the open "roof tray" look)
const parapetH = 1.6;
const parapetT = 0.5;
const inset    = 0.1;
const pY       = annexH + parapetH / 2 - inset;

// front / back walls
addBox(annexW, parapetH, parapetT, matConcreteMid,
       annexX, pY, annexZ + annexD / 2 - inset - parapetT / 2);
addBox(annexW, parapetH, parapetT, matConcreteMid,
       annexX, pY, annexZ - annexD / 2 + inset + parapetT / 2);

// left / right walls (fit between the front and back walls)
const sideLen = annexD - 2 * inset - 2 * parapetT;
addBox(parapetT, parapetH, sideLen, matConcreteMid,
       annexX - annexW / 2 + inset + parapetT / 2, pY, annexZ);
addBox(parapetT, parapetH, sideLen, matConcreteMid,
       annexX + annexW / 2 - inset - parapetT / 2, pY, annexZ);

// ==================================================================
//  6. Camera
// ==================================================================
camera.position.set(80, 85, 120);
camera.lookAt(0, 50, 0);