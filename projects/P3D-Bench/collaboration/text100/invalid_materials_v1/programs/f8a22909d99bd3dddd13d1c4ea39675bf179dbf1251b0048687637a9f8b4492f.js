// --- PARAMETRIC CAD MODEL: STEPPED RECIPROCATING LINK ARM ---
// Monolithic subtractive design featuring a rounded annular head,
// coaxial through-bore, upper/lower pocket bands, deeper through-slots,
// concentric arc voids, and a filleted stepped profile.

// --- 1. PRIMARY PARAMETERS ---
// Overall Envelope Dimensions
const headRadius = 35;           // Outer radius of the rounded annular head
const headCenterX = 35;          // Center X of the annular end
const boreRadius = 17.5;         // Coaxial through-void radius (true opening)

const bodyHeight = 70;           // Total height along Y [-35, +35]
const totalThickness = 26;       // Total thickness along Z [-13, +13]
const pocketDepth = 6;           // Depth of shallow pocket cuts on front/back
const webThickness = totalThickness - 2 * pocketDepth; // Central web thickness (14mm)

// Stepped Rear Profile (Subtractive Steps)
const rearProtrusionX = -75;     // Solid central rib rear limit
const rearStepX = -50;           // Upper & lower band rear cut limit
const stepFilletRadius = 5;      // Smooth transition fillet radius for steps

// Upper & Lower Band Definitions (Symmetric about Y = 0)
const ribHalfHeight = 10;        // Solid center portion: Y in [-10, 10]
const pocketYMin = 14;           // Inner Y edge of shallow pocket
const pocketYMax = 30;           // Outer Y edge of shallow pocket
const pocketXMin = -42;          // Rear X edge of shallow pocket
const pocketXMax = 12;           // Forward X edge of shallow pocket
const pocketCornerRadius = 4;    // Fillet radius for pocket corners

// Matching Deeper Through-Slots (Inside Shallow Pockets)
const slotX1 = -34;              // Slot start X
const slotX2 = 4;                // Slot end X
const slotCenterY = 22;          // Centerline Y for upper slot
const slotRadius = 4;            // Slot end radius (8mm total slot width)

// Concentric Arc Through-Slots (In transition to annular head)
const arcSlotInnerRadius = 23.5;
const arcSlotOuterRadius = 29.5;
const arcSlotStartAngle = (115 * Math.PI) / 180;
const arcSlotEndAngle = (155 * Math.PI) / 180;

// --- 2. 2D SHAPE DEFINITIONS ---

// Helper: Clockwise Rounded Rectangle Path
function createRoundedRectPath(xMin, yMin, xMax, yMax, r) {
  const p = new THREE.Path();
  p.moveTo(xMin + r, yMax);
  p.lineTo(xMax - r, yMax);
  p.absarc(xMax - r, yMax - r, r, Math.PI / 2, 0, true);
  p.lineTo(xMax, yMin + r);
  p.absarc(xMax - r, yMin + r, r, 0, -Math.PI / 2, true);
  p.lineTo(xMin + r, yMin);
  p.absarc(xMin + r, yMin + r, r, -Math.PI / 2, -Math.PI, true);
  p.lineTo(xMin, yMax - r);
  p.absarc(xMin + r, yMax - r, r, Math.PI, Math.PI / 2, true);
  return p;
}

// Helper: Clockwise Horizontal Obround Slot Path
function createObroundSlotPath(x1, x2, y, r) {
  const p = new THREE.Path();
  p.moveTo(x1, y + r);
  p.lineTo(x2, y + r);
  p.absarc(x2, y, r, Math.PI / 2, -Math.PI / 2, true);
  p.lineTo(x1, y - r);
  p.absarc(x1, y, r, -Math.PI / 2, -1.5 * Math.PI, true);
  return p;
}

// Helper: Clockwise Curved Arc Slot Path with Semicircular End Caps
function createArcSlotPath(cx, cy, rInner, rOuter, aStart, aEnd) {
  const p = new THREE.Path();
  const rMid = (rInner + rOuter) / 2;
  const rCap = (rOuter - rInner) / 2;
  const arcSteps = 24;
  const capSteps = 12;

  // Outer Arc
  for (let i = 0; i <= arcSteps; i++) {
    const u = i / arcSteps;
    const a = aStart + u * (aEnd - aStart);
    const x = cx + rOuter * Math.cos(a);
    const y = cy + rOuter * Math.sin(a);
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }

  // End Cap at aEnd
  const cap2X = cx + rMid * Math.cos(aEnd);
  const cap2Y = cy + rMid * Math.sin(aEnd);
  for (let i = 1; i <= capSteps; i++) {
    const u = i / capSteps;
    const a = aEnd + u * Math.PI;
    p.lineTo(cap2X + rCap * Math.cos(a), cap2Y + rCap * Math.sin(a));
  }

  // Inner Arc (Return)
  for (let i = 0; i <= arcSteps; i++) {
    const u = i / arcSteps;
    const a = aEnd - u * (aEnd - aStart);
    p.lineTo(cx + rInner * Math.cos(a), cy + rInner * Math.sin(a));
  }

  // End Cap at aStart
  const cap1X = cx + rMid * Math.cos(aStart);
  const cap1Y = cy + rMid * Math.sin(aStart);
  for (let i = 1; i < capSteps; i++) {
    const u = i / capSteps;
    const a = aStart + Math.PI + u * Math.PI;
    p.lineTo(cap1X + rCap * Math.cos(a), cap1Y + rCap * Math.sin(a));
  }

  p.closePath();
  return p;
}

// --- 3. CREATE OUTER PROFILE WITH FILLETED STEPPED SIDES ---
// Outer contour traces the annular head and stepped side profile counter-clockwise.
const baseOuterShape = new THREE.Shape();

// Annular Semicircular Head
baseOuterShape.absarc(headCenterX, 0, headRadius, -Math.PI / 2, Math.PI / 2, false);

// Top Edge to Upper Band Step
baseOuterShape.lineTo(rearStepX + stepFilletRadius, headRadius);
baseOuterShape.absarc(
  rearStepX + stepFilletRadius,
  headRadius - stepFilletRadius,
  stepFilletRadius,
  Math.PI / 2,
  Math.PI,
  false
);

// Upper Step Dropping Inward to Middle Rib
baseOuterShape.lineTo(rearStepX, ribHalfHeight + stepFilletRadius);
baseOuterShape.absarc(
  rearStepX - stepFilletRadius,
  ribHalfHeight + stepFilletRadius,
  stepFilletRadius,
  0,
  -Math.PI / 2,
  true
);

// Solid Middle Tongue Extending Rearward
baseOuterShape.lineTo(rearProtrusionX + stepFilletRadius, ribHalfHeight);
baseOuterShape.absarc(
  rearProtrusionX + stepFilletRadius,
  ribHalfHeight - stepFilletRadius,
  stepFilletRadius,
  Math.PI / 2,
  Math.PI,
  false
);

// Rearmost Vertical Face of Middle Tongue
baseOuterShape.lineTo(rearProtrusionX, -(ribHalfHeight - stepFilletRadius));
baseOuterShape.absarc(
  rearProtrusionX + stepFilletRadius,
  -(ribHalfHeight - stepFilletRadius),
  stepFilletRadius,
  Math.PI,
  1.5 * Math.PI,
  false
);

// Lower Tongue Edge Returning Inward
baseOuterShape.lineTo(rearStepX - stepFilletRadius, -ribHalfHeight);
baseOuterShape.absarc(
  rearStepX - stepFilletRadius,
  -(ribHalfHeight + stepFilletRadius),
  stepFilletRadius,
  Math.PI / 2,
  0,
  true
);

// Lower Step Continuing Down to Bottom Edge
baseOuterShape.lineTo(rearStepX, -(headRadius - stepFilletRadius));
baseOuterShape.absarc(
  rearStepX + stepFilletRadius,
  -(headRadius - stepFilletRadius),
  stepFilletRadius,
  Math.PI,
  1.5 * Math.PI,
  false
);

// Bottom Edge Closing to Annular Head
baseOuterShape.lineTo(headCenterX, -headRadius);

// --- 4. PREPARE HOLES AND CUTOUTS ---
// 1. Coaxial Through-Hole at Annular Head
const annularBoreHole = new THREE.Path();
annularBoreHole.absarc(headCenterX, 0, boreRadius, 0, Math.PI * 2, true);

// 2. Deeper Through-Slots in Upper and Lower Bands
const upperThroughSlot = createObroundSlotPath(slotX1, slotX2, slotCenterY, slotRadius);
const lowerThroughSlot = createObroundSlotPath(slotX1, slotX2, -slotCenterY, slotRadius);

// 3. Curved Arc Through-Slots (Concentric with Annular Head)
const upperArcSlot = createArcSlotPath(
  headCenterX, 0,
  arcSlotInnerRadius, arcSlotOuterRadius,
  arcSlotStartAngle, arcSlotEndAngle
);
const lowerArcSlot = createArcSlotPath(
  headCenterX, 0,
  arcSlotInnerRadius, arcSlotOuterRadius,
  -arcSlotEndAngle, -arcSlotStartAngle
);

// 4. Shallow Pockets (Upper and Lower Bands)
const upperPocket = createRoundedRectPath(pocketXMin, pocketYMin, pocketXMax, pocketYMax, pocketCornerRadius);
const lowerPocket = createRoundedRectPath(pocketXMin, -pocketYMax, pocketXMax, -pocketYMin, pocketCornerRadius);

// --- 5. BUILD SUBTRACTIVE SOLID LAYERS ---
// Layer A: Central Web (Thickness = 14mm, Z: [-7, +7])
// Contains solid pocket floors, but cuts through-slots, arc slots, and center bore.
const shapeWeb = baseOuterShape.clone();
shapeWeb.holes.push(annularBoreHole);
shapeWeb.holes.push(upperThroughSlot);
shapeWeb.holes.push(lowerThroughSlot);
shapeWeb.holes.push(upperArcSlot);
shapeWeb.holes.push(lowerArcSlot);

// Layer B: Raised Bands / Exterior Shell (Thickness = 6mm each)
// Pockets are cut out here, exposing Layer A as the floor and creating steps.
const shapeFlange = baseOuterShape.clone();
shapeFlange.holes.push(annularBoreHole);
shapeFlange.holes.push(upperPocket);
shapeFlange.holes.push(lowerPocket);
shapeFlange.holes.push(upperArcSlot);
shapeFlange.holes.push(lowerArcSlot);

// Extrusion Settings
const curveResolution = 64;
const geomWeb = new THREE.ExtrudeGeometry(shapeWeb, {
  depth: webThickness,
  bevelEnabled: false,
  curveSegments: curveResolution
});

const geomFlange = new THREE.ExtrudeGeometry(shapeFlange, {
  depth: pocketDepth,
  bevelEnabled: false,
  curveSegments: curveResolution
});

// --- 6. MATERIALS & ASSEMBLY ---
// Precision Machined Satin Titanium Material
const cadMaterial = new THREE.MeshStandardMaterial({
  color: 0x8ea2b0,
  metalness: 0.75,
  roughness: 0.3,
  side: THREE.DoubleSide
});

const cadModelGroup = new THREE.Group();

// Central Web Mesh (Z: -7 to +7)
const webMesh = new THREE.Mesh(geomWeb, cadMaterial);
webMesh.position.z = -webThickness / 2;
cadModelGroup.add(webMesh);

// Front Flange Mesh (Z: +7 to +13) -> Creates 6mm recessed front pockets
const frontFlangeMesh = new THREE.Mesh(geomFlange, cadMaterial);
frontFlangeMesh.position.z = webThickness / 2;
cadModelGroup.add(frontFlangeMesh);

// Back Flange Mesh (Z: -13 to -7) -> Creates 6mm recessed back pockets
const backFlangeMesh = new THREE.Mesh(geomFlange, cadMaterial);
backFlangeMesh.position.z = -totalThickness / 2;
cadModelGroup.add(backFlangeMesh);

// Add Assembly to Scene
scene.add(cadModelGroup);

// --- 7. CAMERA POSITIONING & ALIGNMENT ---
// Position camera for 3/4 isometric inspection of stepped sides, head, and voids
const targetCenterX = (rearProtrusionX + headCenterX + headRadius) / 2; // Approx -2.5
camera.position.set(100, 75, 115);
camera.lookAt(targetCenterX, 0, 0);

if (typeof controls !== 'undefined' && controls && controls.target) {
  controls.target.set(targetCenterX, 0, 0);
  controls.update();
}
```