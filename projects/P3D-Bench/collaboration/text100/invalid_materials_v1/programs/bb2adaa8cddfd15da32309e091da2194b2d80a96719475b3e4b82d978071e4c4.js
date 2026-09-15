// ====================================================================
// CAD MODEL: Parametric Stepped Base Plate with Slotted Upright & Cleat
// ====================================================================

// --- 1. PARAMETERS & DIMENSIONS ---

// Base Plate Dimensions
const BASE_LENGTH = 0.210172; // Dimension along X
const BASE_WIDTH  = 0.578703; // Dimension along Z
const BASE_THICK  = 0.020556; // Dimension along Y (thickness from datum Y=0)

// Circular Through-Hole in Base Plate
const HOLE_CENTER_X = 0.1051; // Offset from left edge (centered)
const HOLE_CENTER_Z = 0.2894; // Offset from front edge (centered)
const HOLE_RADIUS   = 0.0223;

// Front Upper Pad
const PAD_LENGTH  = 0.210172; // Spans full left-to-right length
const PAD_WIDTH   = 0.111;    // Extends from Z=0 to Z=0.111 (back offset: 0.4677)
const PAD_THICK   = 0.020556; // Extrusion depth from Y=0.020556 to Y=0.041112

// Centered Upright Block (Slotted Fork / Clevis)
const UPRIGHT_LENGTH   = 0.0651;   // Footprint length along X
const UPRIGHT_WIDTH    = 0.111;    // Footprint width along Z (flush with pad)
const UPRIGHT_X_START  = 0.0725;   // Left offset (right offset = 0.0726)
const UPRIGHT_Y_START  = PAD_THICK + BASE_THICK; // 0.041112
const UPRIGHT_Y_TOP    = 0.205556; // Reaches 0.2055 relative to datum

// Vertical Recess / Slot in Upright
const SLOT_LENGTH   = 0.023982; // Width of slot cut along X
const SLOT_X_START  = 0.0924;   // Left offset of cut
const SLOT_Y_START  = 0.0942;   // Lower bound of removed vertical band
const SLOT_Y_TOP    = UPRIGHT_Y_TOP; // Cuts through top of upright

// Secondary Upright Extension Wall (Extends forward at front end)
const WALL_LENGTH   = 0.065093; // Centered in same band along X
const WALL_X_START  = 0.0725;
const WALL_WIDTH    = 0.1713;   // Front offset: -0.1713 to Z=0
const WALL_HEIGHT   = 0.171297;
const WALL_Y_TOP    = 0.2056;
const WALL_Y_START  = WALL_Y_TOP - WALL_HEIGHT; // 0.034303

// Paired Stepped Continuation Below Base Underside (Y < 0)
// Step 1: Shallow full-width end footprint
const STEP1_LENGTH  = BASE_LENGTH; // Full width X: 0.210172
const STEP1_WIDTH   = PAD_WIDTH;    // Shared front/back edges in Z: 0.111
const STEP1_Y_MIN   = -0.020556;    // Reaches 0.0206 below base datum
const STEP1_Y_MAX   = 0.0;

// Step 2: Deeper centered upright footprint (contained within Step 1)
const STEP2_LENGTH  = UPRIGHT_LENGTH; // Centered X: 0.0651
const STEP2_X_START = UPRIGHT_X_START;
const STEP2_WIDTH   = PAD_WIDTH;      // Shared front/back edges in Z: 0.111
const STEP2_Y_MIN   = -0.0412;        // Starts 0.0412 below base datum
const STEP2_Y_MAX   = -0.020556;      // Reaches 0.0206 below base datum

// --- 2. MATERIAL DEFINITION ---
const cadMaterial = new THREE.MeshStandardMaterial({
  color: 0x7a9bb5,
  roughness: 0.35,
  metalness: 0.35,
  side: THREE.DoubleSide
});

// Group to hold all solid components
const model = new THREE.Group();

// Helper function to create axis-aligned solid bounding boxes
function addBox(minX, minY, minZ, maxX, maxY, maxZ) {
  const dx = maxX - minX;
  const dy = maxY - minY;
  const dz = maxZ - minZ;
  const geom = new THREE.BoxGeometry(dx, dy, dz);
  const mesh = new THREE.Mesh(geom, cadMaterial);
  mesh.position.set(minX + dx / 2, minY + dy / 2, minZ + dz / 2);
  model.add(mesh);
  return mesh;
}

// --- 3. BASE PLATE WITH CIRCULAR THROUGH-HOLE ---
// Construct 2D cross-section on the X-Z plane and extrude vertically
const baseShape = new THREE.Shape();
baseShape.moveTo(0, 0);
baseShape.lineTo(BASE_LENGTH, 0);
baseShape.lineTo(BASE_LENGTH, -BASE_WIDTH);
baseShape.lineTo(0, -BASE_WIDTH);
baseShape.closePath();

// Circular through-hole opening
const holePath = new THREE.Path();
holePath.absarc(HOLE_CENTER_X, -HOLE_CENTER_Z, HOLE_RADIUS, 0, Math.PI * 2, true);
baseShape.holes.push(holePath);

const baseGeometry = new THREE.ExtrudeGeometry(baseShape, {
  depth: BASE_THICK,
  bevelEnabled: false,
  curveSegments: 48
});

// Rotate so extruded depth corresponds to world +Y
baseGeometry.rotateX(-Math.PI / 2);

const baseMesh = new THREE.Mesh(baseGeometry, cadMaterial);
model.add(baseMesh);

// --- 4. FRONT UPPER PAD ---
// Spans full length (0 to 0.210172), width (0 to 0.111), height (0.020556 to 0.041112)
addBox(
  0, PAD_Y_START, 0,
  PAD_LENGTH, PAD_Y_START + PAD_THICK, PAD_WIDTH
);

// --- 5. CENTERED UPRIGHT WITH SLOT (FORK / CLEVIS) ---
// Lower solid portion of the upright (below slot: Y from 0.041112 to 0.0942)
addBox(
  UPRIGHT_X_START, UPRIGHT_Y_START, 0,
  UPRIGHT_X_START + UPRIGHT_LENGTH, SLOT_Y_START, UPRIGHT_WIDTH
);

// Left upright prong (Y from 0.0942 to 0.205556)
addBox(
  UPRIGHT_X_START, SLOT_Y_START, 0,
  SLOT_X_START, UPRIGHT_Y_TOP, UPRIGHT_WIDTH
);

// Right upright prong (Y from 0.0942 to 0.205556)
addBox(
  SLOT_X_START + SLOT_LENGTH, SLOT_Y_START, 0,
  UPRIGHT_X_START + UPRIGHT_LENGTH, UPRIGHT_Y_TOP, UPRIGHT_WIDTH
);

// --- 6. OTHER SOLID UPRIGHT WALL / EXTENSION ---
// Forward-extending vertical wall in the same centered left-right band
addBox(
  WALL_X_START, WALL_Y_START, -WALL_WIDTH,
  WALL_X_START + WALL_LENGTH, WALL_Y_TOP, 0
);

// --- 7. PAIRED STEPPED CONTINUATION BELOW UNDERSIDE ---
// Shallow full-width step (-0.020556 to 0.0)
addBox(
  0, STEP1_Y_MIN, 0,
  STEP1_LENGTH, STEP1_Y_MAX, STEP1_WIDTH
);

// Deeper centered step (-0.0412 to -0.020556)
addBox(
  STEP2_X_START, STEP2_Y_MIN, 0,
  STEP2_X_START + STEP2_LENGTH, STEP2_Y_MAX, STEP2_WIDTH
);

// --- 8. CENTERING & SCENE GRAPH SETUP ---
// Compute model bounding box center to align model with the origin
const centerX = BASE_LENGTH / 2;
const centerY = (WALL_Y_TOP + STEP2_Y_MIN) / 2;
const centerZ = (BASE_WIDTH - WALL_WIDTH) / 2;

model.position.set(-centerX, -centerY, -centerZ);
scene.add(model);

// --- 9. CAMERA PLACEMENT ---
camera.position.set(0.42, 0.36, 0.48);
camera.lookAt(0, 0, 0);

if (typeof controls !== 'undefined' && controls.target) {
  controls.target.set(0, 0, 0);
  controls.update();
}