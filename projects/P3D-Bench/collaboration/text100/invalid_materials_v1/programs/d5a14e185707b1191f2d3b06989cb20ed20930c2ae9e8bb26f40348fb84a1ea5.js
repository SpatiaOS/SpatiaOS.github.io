// Parametric CAD Model: Stepped Annular Mounting Base
// All dimensions derived from specification datum

// --- 1. PARAMETRIC SPECIFICATIONS ---
const BASE_LENGTH       = 0.706169; // Full length along X
const BASE_SLAB_WIDTH   = 0.233766; // Base slab front-to-back width along Z
const REAR_STRIP_WIDTH  = 0.058442; // Rear solid strip width along Z
const BASE_HEIGHT       = 0.073052; // Extrusion height from datum (Y)
const TOTAL_WIDTH       = BASE_SLAB_WIDTH + REAR_STRIP_WIDTH; // 0.292208

// Circular raised feature shared axis
const AXIS_X            = 0.5162;   // 0.5162 from left reference edge
const AXIS_Z            = 0.2922;   // 0.2922 from front reference edge

// Lower annular collar parameters
const COLLAR_R_OUTER    = 0.1899;   // Outer circle radius
const COLLAR_R_INNER    = 0.1266;   // Inner circle radius
const COLLAR_REACH      = 0.0779;   // Stepped height above base shoulder

// Coaxial upper sleeve parameters
const SLEEVE_R_OUTER    = 0.1266;   // Outer circle radius (matches collar inner)
const SLEEVE_R_INNER    = 0.0779;   // Inner open circle radius (through hole)
const SLEEVE_REACH      = 0.1023;   // Stepped height above base shoulder

// --- 2. MATERIALS ---
const baseMaterial = new THREE.MeshStandardMaterial({
  color: 0x5a768d,
  roughness: 0.4,
  metalness: 0.25,
  side: THREE.DoubleSide
});

const collarMaterial = new THREE.MeshStandardMaterial({
  color: 0x6a89a3,
  roughness: 0.35,
  metalness: 0.3,
  side: THREE.DoubleSide
});

const sleeveMaterial = new THREE.MeshStandardMaterial({
  color: 0x7e9eb8,
  roughness: 0.3,
  metalness: 0.35,
  side: THREE.DoubleSide
});

// Master group to allow centering in the viewer
const cadModel = new THREE.Group();

// --- 3. BASE SLAB & REAR CONTOUR (2D SHAPE) ---
// Coordinate convention for ExtrudeGeometry:
// Shape (x, y) maps to CAD (X, -Z) so that after rotating geometry by -90 deg on X,
// 3D coordinates become X = x, Y = height (datum reaching up), Z = -y.
const baseShape = new THREE.Shape();
const cornerR = 0.02;

// Helper to convert CAD (X, Z) to Shape (x, y)
const toShape = (x, z) => new THREE.Vector2(x, -z);

// Outer Perimeter Profile (Counter-Clockwise in Shape coordinates)
// Starting from left edge, moving along front side with arced cut-away
baseShape.moveTo(cornerR, 0);

// Front edge section 1
baseShape.lineTo(0.20, 0);

// Arced side cut-away on front side (concave circular recess with rounded ends)
// Arc spans from X = 0.20 to X = 0.40, sweeping inward to Z = 0.055
const cutStartX = 0.20;
const cutEndX   = 0.40;
const cutDepth  = 0.055;
const cutSteps  = 24;
for (let i = 0; i <= cutSteps; i++) {
  const t = i / cutSteps;
  const cx = cutStartX + t * (cutEndX - cutStartX);
  // Smooth sine-based parabolic curve ensuring tangent rounded ends
  const cz = Math.sin(t * Math.PI) * cutDepth;
  baseShape.lineTo(cx, -cz);
}

// Front edge section 2
baseShape.lineTo(BASE_LENGTH - cornerR, 0);

// Front-right rounded corner
baseShape.quadraticCurveTo(BASE_LENGTH, 0, BASE_LENGTH, -cornerR);

// Right edge reaching the boss centerline (Z = AXIS_Z)
baseShape.lineTo(BASE_LENGTH, -AXIS_Z);

// Upper-side solid curved section preserving the circular boss outline
// Arc centered at (AXIS_X, -AXIS_Z) of radius COLLAR_R_OUTER from angle 0 to Math.PI
const arcSteps = 36;
for (let i = 0; i <= arcSteps; i++) {
  const theta = (i / arcSteps) * Math.PI; // 0 to PI
  const ax = AXIS_X + Math.cos(theta) * COLLAR_R_OUTER;
  const az = AXIS_Z + Math.sin(theta) * COLLAR_R_OUTER;
  baseShape.lineTo(ax, -az);
}

// Rear edge along the full-length upper-side rectangular strip back offset
baseShape.lineTo(cornerR, -TOTAL_WIDTH);

// Rear-left rounded corner
baseShape.quadraticCurveTo(0, -TOTAL_WIDTH, 0, -(TOTAL_WIDTH - cornerR));

// Left edge
baseShape.lineTo(0, -cornerR);

// Front-left rounded corner closing the profile
baseShape.quadraticCurveTo(0, 0, cornerR, 0);

// --- 4. THROUGH OPENINGS IN THE BASE SLAB ---

// 4a. Elongated Rounded Slot (Through Opening)
// Stadium slot centered at X = 0.14, Z = 0.115 with rounded semicircular ends
const slotCenterX = 0.14;
const slotCenterZ = 0.115;
const slotHalfLen = 0.045;
const slotRadius  = 0.026;
const slotHole    = new THREE.Path();

const sX1 = slotCenterX - slotHalfLen;
const sX2 = slotCenterX + slotHalfLen;

slotHole.moveTo(sX1, -(slotCenterZ - slotRadius));
slotHole.lineTo(sX2, -(slotCenterZ - slotRadius));
slotHole.absarc(sX2, -slotCenterZ, slotRadius, Math.PI / 2, -Math.PI / 2, true);
slotHole.lineTo(sX1, -(slotCenterZ + slotRadius));
slotHole.absarc(sX1, -slotCenterZ, slotRadius, -Math.PI / 2, Math.PI / 2, true);
baseShape.holes.push(slotHole);

// 4b. Central Circular Through Hole (Coaxial with Upper Sleeve)
const boreHole = new THREE.Path();
boreHole.absarc(AXIS_X, -AXIS_Z, SLEEVE_R_INNER, 0, Math.PI * 2, true);
baseShape.holes.push(boreHole);

// Extrude Base Slab Geometry
const baseExtrudeSettings = {
  depth: BASE_HEIGHT,
  bevelEnabled: false,
  curveSegments: 64
};
const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
baseGeometry.rotateX(-Math.PI / 2); // Orient extrusion upward along +Y
const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
cadModel.add(baseMesh);

// --- 5. CIRCULAR RAISED FEATURES (COAXIAL ANNULAR STEPPED TIERS) ---

// Helper to create true concentric annular geometry
function createAnnularGeometry(rInner, rOuter, reachHeight, segments = 64) {
  const annulusShape = new THREE.Shape();
  annulusShape.absarc(0, 0, rOuter, 0, Math.PI * 2, false);

  const innerPath = new THREE.Path();
  innerPath.absarc(0, 0, rInner, 0, Math.PI * 2, true);
  annulusShape.holes.push(innerPath);

  const extrudeSettings = {
    depth: reachHeight,
    bevelEnabled: false,
    curveSegments: segments
  };
  const geom = new THREE.ExtrudeGeometry(annulusShape, extrudeSettings);
  geom.rotateX(-Math.PI / 2); // Orient along +Y
  return geom;
}

// 5a. Lower Annular Collar: Radii [0.1266, 0.1899], reach 0.0779 from starting shoulder
const collarGeometry = createAnnularGeometry(COLLAR_R_INNER, COLLAR_R_OUTER, COLLAR_REACH);
const collarMesh = new THREE.Mesh(collarGeometry, collarMaterial);
collarMesh.position.set(AXIS_X, BASE_HEIGHT, AXIS_Z);
cadModel.add(collarMesh);

// 5b. Smaller Coaxial Upper Sleeve: Radii [0.0779, 0.1266], reach 0.1023 from starting shoulder
const sleeveGeometry = createAnnularGeometry(SLEEVE_R_INNER, SLEEVE_R_OUTER, SLEEVE_REACH);
const sleeveMesh = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
sleeveMesh.position.set(AXIS_X, BASE_HEIGHT, AXIS_Z);
cadModel.add(sleeveMesh);

// --- 6. POSITIONING & CAMERA SETUP ---
// Center model at coordinate origin (0, 0, 0)
const totalBoundingDepth = AXIS_Z + COLLAR_R_OUTER; // 0.4821
cadModel.position.set(
  -BASE_LENGTH / 2,
  -(BASE_HEIGHT + SLEEVE_REACH) / 2,
  -totalBoundingDepth / 2
);
scene.add(cadModel);

// Adjust camera for a balanced perspective viewing all features
camera.position.set(0.65, 0.55, 0.70);
camera.lookAt(0, 0, 0);
if (controls && controls.target) {
  controls.target.set(0, 0, 0);
  controls.update();
}
```