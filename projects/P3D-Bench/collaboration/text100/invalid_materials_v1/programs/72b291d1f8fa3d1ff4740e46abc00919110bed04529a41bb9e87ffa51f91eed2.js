// ============================================================================
// CAD MODEL: Rounded-Rectangular Body with Rim, Voids, Blind Holes, and End Slot
// ============================================================================

// ----------------------------------------------------------------------------
// 1. PARAMETRIC DEFINITIONS
// ----------------------------------------------------------------------------
const L           = 140.0; // Overall body length (X axis)
const W           = 72.0;  // Overall body width (Z axis)
const H           = 34.0;  // Total height to top of rim (Y axis)
const cornerR     = 10.0;  // Outer vertical corner radius

// Continuous top rim
const rimH        = 3.5;   // Rim height above the interior top deck
const rimT        = 4.0;   // Rim wall thickness
const deckY       = H - rimH; // Elevation of interior deck (30.5 mm)

// Main void 1: Large elongated top opening (stadium slot)
const elongX      = -12.0; // Center X
const elongL      = 40.0;  // Length in X
const elongW      = 24.0;  // Width in Z
const elongR      = 8.0;   // Corner radius

// Main void 2: Large round opening near one end (+X)
const roundX      = 33.0;  // Center X
const roundR      = 13.0;  // Radius (diameter 26 mm)

// Four small circular blind recesses (two pairs near the ends)
const smallR      = 3.5;   // Radius (diameter 7 mm)
const smallDepth  = 6.5;   // Blind recess depth below deck
const smallFloorY = deckY - smallDepth; // Floor elevation (24.0 mm)
const pair1X      = -53.0; // X position of Pair 1 (-X end)
const pair2X      = 56.0;  // X position of Pair 2 (+X end)
const pairZ       = 20.0;  // ±Z offset for each hole pair

// Stepped end slot cut (enters from -X face at mid-width)
const slotWidth   = 14.0;  // Width in Z (from -7 to +7)
const slotDepth   = 22.0;  // Extends from X = -L/2 (-70) to -48
const slotYBot    = 12.0;  // Slot floor elevation
const slotYTop    = smallFloorY; // Slot ceiling elevation (24.0 mm)

const curveSegments = 32;  // Arc resolution for smooth CAD curves

// ----------------------------------------------------------------------------
// 2. HELPER FUNCTIONS FOR 2D PROFILES
// ----------------------------------------------------------------------------

// Adds a rounded rectangle path
function addRoundedRect(path, x0, y0, x1, y1, r, clockwise = false) {
  if (!clockwise) {
    // Counter-clockwise
    path.moveTo(x0 + r, y0);
    path.lineTo(x1 - r, y0);
    path.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
    path.lineTo(x1, y1 - r);
    path.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
    path.lineTo(x0 + r, y1);
    path.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
    path.lineTo(x0, y0 + r);
    path.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  } else {
    // Clockwise (for hole cutouts)
    path.moveTo(x0 + r, y0);
    path.absarc(x0 + r, y0 + r, r, -Math.PI / 2, -Math.PI, true);
    path.lineTo(x0, y1 - r);
    path.absarc(x0 + r, y1 - r, r, Math.PI, Math.PI / 2, true);
    path.lineTo(x1 - r, y1);
    path.absarc(x1 - r, y1 - r, r, Math.PI / 2, 0, true);
    path.lineTo(x1, y0 + r);
    path.absarc(x1 - r, y0 + r, r, 0, -Math.PI / 2, true);
  }
}

// ----------------------------------------------------------------------------
// 3. LAYERED GEOMETRY GENERATION
// Constructed in stepped vertical tiers to accurately represent voids,
// stepped blind depths, and the continuous rim without boolean artifacts.
// ----------------------------------------------------------------------------

const xMin = -L / 2;
const xMax =  L / 2;
const zMin = -W / 2;
const zMax =  W / 2;

// Shared Cutouts: Elongated opening and Large round opening
function addSharedVoids(shape) {
  // Elongated opening void
  const elongHole = new THREE.Path();
  addRoundedRect(
    elongHole,
    elongX - elongL / 2, -elongW / 2,
    elongX + elongL / 2,  elongW / 2,
    elongR,
    true
  );
  shape.holes.push(elongHole);

  // Large round opening void
  const roundHole = new THREE.Path();
  roundHole.absarc(roundX, 0, roundR, 0, Math.PI * 2, true);
  shape.holes.push(roundHole);
}

// Tier 1: Bottom solid base (y: 0 -> slotYBot)
const shapeTier1 = new THREE.Shape();
addRoundedRect(shapeTier1, xMin, zMin, xMax, zMax, cornerR, false);
addSharedVoids(shapeTier1);

// Tier 2: Slot level (y: slotYBot -> slotYTop)
// End slot cuts inward from x = -70 to -48 across z = [-7, +7]
const shapeTier2 = new THREE.Shape();
shapeTier2.moveTo(xMin + cornerR, zMin);
shapeTier2.lineTo(xMax - cornerR, zMin);
shapeTier2.absarc(xMax - cornerR, zMin + cornerR, cornerR, -Math.PI / 2, 0, false);
shapeTier2.lineTo(xMax, zMax - cornerR);
shapeTier2.absarc(xMax - cornerR, zMax - cornerR, cornerR, 0, Math.PI / 2, false);
shapeTier2.lineTo(xMin + cornerR, zMax);
shapeTier2.absarc(xMin + cornerR, zMax - cornerR, cornerR, Math.PI / 2, Math.PI, false);
// Inward cut from -X face
shapeTier2.lineTo(xMin, slotWidth / 2);
shapeTier2.lineTo(xMin + slotDepth, slotWidth / 2);
shapeTier2.lineTo(xMin + slotDepth, -slotWidth / 2);
shapeTier2.lineTo(xMin, -slotWidth / 2);
shapeTier2.lineTo(xMin, zMin + cornerR);
shapeTier2.absarc(xMin + cornerR, zMin + cornerR, cornerR, Math.PI, Math.PI * 1.5, false);
addSharedVoids(shapeTier2);

// Tier 3: Deck level with 4 separate blind circular cuts (y: slotYTop -> deckY)
const shapeTier3 = new THREE.Shape();
addRoundedRect(shapeTier3, xMin, zMin, xMax, zMax, cornerR, false);
addSharedVoids(shapeTier3);

// 4 distinct blind circular recesses
const blindHoles = [
  { x: pair1X, z: -pairZ },
  { x: pair1X, z:  pairZ },
  { x: pair2X, z: -pairZ },
  { x: pair2X, z:  pairZ }
];
blindHoles.forEach(h => {
  const circHole = new THREE.Path();
  circHole.absarc(h.x, h.z, smallR, 0, Math.PI * 2, true);
  shapeTier3.holes.push(circHole);
});

// Tier 4: Continuous top rim (y: deckY -> H)
const shapeTier4 = new THREE.Shape();
addRoundedRect(shapeTier4, xMin, zMin, xMax, zMax, cornerR, false);
// Rim inner opening
const innerRimHole = new THREE.Path();
addRoundedRect(
  innerRimHole,
  xMin + rimT, zMin + rimT,
  xMax - rimT, zMax - rimT,
  Math.max(1.0, cornerR - rimT),
  true
);
shapeTier4.holes.push(innerRimHole);

// Extrude each tier and orient to world Y up
function createExtrudedTier(shape, yBase, height) {
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: curveSegments
  });
  // Extrude aligns along +Z; rotate to make +Y vertical and translate
  geom.rotateX(-Math.PI / 2);
  geom.translate(0, yBase, 0);
  return geom;
}

const geomTier1 = createExtrudedTier(shapeTier1, 0, slotYBot);
const geomTier2 = createExtrudedTier(shapeTier2, slotYBot, slotYTop - slotYBot);
const geomTier3 = createExtrudedTier(shapeTier3, slotYTop, deckY - slotYTop);
const geomTier4 = createExtrudedTier(shapeTier4, deckY, rimH);

// ----------------------------------------------------------------------------
// 4. MERGE TIERS INTO A SINGLE SOLID CAD GEOMETRY
// ----------------------------------------------------------------------------
function mergeGeometries(geoms) {
  let totalVerts = 0;
  let totalIndices = 0;
  geoms.forEach(g => {
    totalVerts += g.attributes.position.count;
    totalIndices += g.index.count;
  });

  const positions = new Float32Array(totalVerts * 3);
  const normals   = new Float32Array(totalVerts * 3);
  const indices   = new Uint32Array(totalIndices);

  let vOffset = 0;
  let iOffset = 0;

  geoms.forEach(g => {
    const pos = g.attributes.position;
    const norm = g.attributes.normal;
    const idx = g.index;

    positions.set(pos.array, vOffset * 3);
    if (norm) normals.set(norm.array, vOffset * 3);

    for (let i = 0; i < idx.count; i++) {
      indices[iOffset + i] = idx.getX(i) + vOffset;
    }

    iOffset += idx.count;
    vOffset += pos.count;
  });

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  return merged;
}

const bodyGeometry = mergeGeometries([geomTier1, geomTier2, geomTier3, geomTier4]);

// Professional satin-finished engineering metal
const cadMaterial = new THREE.MeshStandardMaterial({
  color: 0x5a7d9a,
  roughness: 0.32,
  metalness: 0.35,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
});

const bodyMesh = new THREE.Mesh(bodyGeometry, cadMaterial);
scene.add(bodyMesh);

// ----------------------------------------------------------------------------
// 5. CRISP CAD FEATURE EDGES
// Exact analytic lines highlighting geometric features (rim, voids, slot, holes)
// ----------------------------------------------------------------------------
const lineSegments = [];

function addLine(x0, y0, z0, x1, y1, z1) {
  lineSegments.push(x0, y0, z0, x1, y1, z1);
}

function addPolylinePoints(pts, closed = false) {
  for (let i = 0; i < pts.length - 1; i++) {
    addLine(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
  }
  if (closed && pts.length > 2) {
    const last = pts.length - 1;
    addLine(pts[last].x, pts[last].y, pts[last].z, pts[0].x, pts[0].y, pts[0].z);
  }
}

function getRoundedRectLoop(x0, z0, x1, z1, r, y, segs = 16) {
  const pts = [];
  pts.push(new THREE.Vector3(x0 + r, y, z0));
  pts.push(new THREE.Vector3(x1 - r, y, z0));
  for (let i = 0; i <= segs; i++) {
    const a = -Math.PI / 2 + (Math.PI / 2) * (i / segs);
    pts.push(new THREE.Vector3(x1 - r + r * Math.cos(a), y, z0 + r + r * Math.sin(a)));
  }
  pts.push(new THREE.Vector3(x1, y, z1 - r));
  for (let i = 0; i <= segs; i++) {
    const a = (Math.PI / 2) * (i / segs);
    pts.push(new THREE.Vector3(x1 - r + r * Math.cos(a), y, z1 - r + r * Math.sin(a)));
  }
  pts.push(new THREE.Vector3(x0 + r, y, z1));
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI / 2 + (Math.PI / 2) * (i / segs);
    pts.push(new THREE.Vector3(x0 + r + r * Math.cos(a), y, z1 - r + r * Math.sin(a)));
  }
  pts.push(new THREE.Vector3(x0, y, z0 + r));
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI + (Math.PI / 2) * (i / segs);
    pts.push(new THREE.Vector3(x0 + r + r * Math.cos(a), y, z0 + r + r * Math.sin(a)));
  }
  return pts;
}

function getCircleLoop(cx, cz, r, y, segs = 36) {
  const pts = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    pts.push(new THREE.Vector3(cx + r * Math.cos(a), y, cz + r * Math.sin(a)));
  }
  return pts;
}

// Outer perimeter edges: Bottom (y=0) and Top of Rim (y=H)
addPolylinePoints(getRoundedRectLoop(xMin, zMin, xMax, zMax, cornerR, 0), true);
addPolylinePoints(getRoundedRectLoop(xMin, zMin, xMax, zMax, cornerR, H), true);

// Inner rim edges: Top of Rim (y=H) and Deck Surface (y=deckY)
const inX0 = xMin + rimT, inX1 = xMax - rimT;
const inZ0 = zMin + rimT, inZ1 = zMax - rimT;
const inR  = Math.max(1.0, cornerR - rimT);
addPolylinePoints(getRoundedRectLoop(inX0, inZ0, inX1, inZ1, inR, H), true);
addPolylinePoints(getRoundedRectLoop(inX0, inZ0, inX1, inZ1, inR, deckY), true);

// Void 1: Elongated opening edges (Top and Bottom)
const eX0 = elongX - elongL / 2, eX1 = elongX + elongL / 2;
const eZ0 = -elongW / 2, eZ1 = elongW / 2;
addPolylinePoints(getRoundedRectLoop(eX0, eZ0, eX1, eZ1, elongR, deckY), true);
addPolylinePoints(getRoundedRectLoop(eX0, eZ0, eX1, eZ1, elongR, 0), true);

// Void 2: Large round opening edges (Top and Bottom)
addPolylinePoints(getCircleLoop(roundX, 0, roundR, deckY), true);
addPolylinePoints(getCircleLoop(roundX, 0, roundR, 0), true);

// 4 Small circular blind recesses: Top deck circles and recessed bottom discs
blindHoles.forEach(h => {
  addPolylinePoints(getCircleLoop(h.x, h.z, smallR, deckY), true);
  addPolylinePoints(getCircleLoop(h.x, h.z, smallR, smallFloorY), true);
});

// End Slot feature lines
const sXIn = xMin + slotDepth;
const sZHalf = slotWidth / 2;

// Slot mouth (on end face x = xMin)
addLine(xMin, slotYBot, -sZHalf, xMin, slotYBot, sZHalf);
addLine(xMin, slotYTop, -sZHalf, xMin, slotYTop, sZHalf);
addLine(xMin, slotYBot, -sZHalf, xMin, slotYTop, -sZHalf);
addLine(xMin, slotYBot,  sZHalf, xMin, slotYTop,  sZHalf);

// Slot interior floor (y = slotYBot)
addLine(xMin, slotYBot, -sZHalf, sXIn, slotYBot, -sZHalf);
addLine(sXIn, slotYBot, -sZHalf, sXIn, slotYBot,  sZHalf);
addLine(sXIn, slotYBot,  sZHalf, xMin, slotYBot,  sZHalf);

// Slot interior ceiling (y = slotYTop)
addLine(xMin, slotYTop, -sZHalf, sXIn, slotYTop, -sZHalf);
addLine(sXIn, slotYTop, -sZHalf, sXIn, slotYTop,  sZHalf);
addLine(sXIn, slotYTop,  sZHalf, xMin, slotYTop,  sZHalf);

// Slot interior vertical rear corners
addLine(sXIn, slotYBot, -sZHalf, sXIn, slotYTop, -sZHalf);
addLine(sXIn, slotYBot,  sZHalf, sXIn, slotYTop,  sZHalf);

// Build feature lines mesh
const edgeGeo = new THREE.BufferGeometry();
edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineSegments, 3));
const edgeMat = new THREE.LineBasicMaterial({ color: 0x122230, linewidth: 1 });
const edgesMesh = new THREE.LineSegments(edgeGeo, edgeMat);
scene.add(edgesMesh);

// ----------------------------------------------------------------------------
// 6. CAMERA POSITIONING
// ----------------------------------------------------------------------------
camera.position.set(125, 95, 120);
if (controls && controls.target) {
  controls.target.set(0, H * 0.45, 0);
  controls.update();
} else {
  camera.lookAt(0, H * 0.45, 0);
}