// ============================================================================
// Parametric 3D Architectural Model: High-Rise Modern Faceted Residential Tower
// Recreated in Three.js with clean CAD / SketchUp edge-line styling
// ============================================================================

// ----------------------------------------------------------------------------
// 1. PARAMETERS & CONFIGURATION
// ----------------------------------------------------------------------------
const numFloors = 20;            // Number of typical residential floors
const floorHeight = 2.7;         // Typical floor-to-floor height
const baseHeight = 4.4;          // Height of ground podium base
const parapetHeight = 1.0;       // Roof parapet wall height
const wallThickness = 0.22;      // Parapet and perimeter wall thickness

const towerRoofY = baseHeight + numFloors * floorHeight; // Y = 58.4
const penthouseHeight = 7.5;     // Height of rooftop mechanical / penthouse bulkheads

// Colors matching the CAD / Revit architectural shaded style
const colorWall = 0xcccccc;      // Main facade concrete / cladding
const colorBase = 0xbebfc4;      // Ground podium concrete
const colorSlab = 0xd8dadf;      // Floor slabs & balcony decks
const colorFrame = 0x242629;     // Dark window frames & mullions
const colorGlass = 0x18191c;     // Dark recessed glass / shadow interiors
const colorRailing = 0x2d2f33;   // Balcony metal railings
const colorEdge = 0x111111;      // Crisp CAD edge outline color

// ----------------------------------------------------------------------------
// 2. MATERIALS
// ----------------------------------------------------------------------------
const wallMaterial = new THREE.MeshStandardMaterial({
  color: colorWall,
  roughness: 0.8,
  metalness: 0.05
});

const baseMaterial = new THREE.MeshStandardMaterial({
  color: colorBase,
  roughness: 0.85,
  metalness: 0.05
});

const slabMaterial = new THREE.MeshStandardMaterial({
  color: colorSlab,
  roughness: 0.7,
  metalness: 0.1
});

const frameMaterial = new THREE.MeshStandardMaterial({
  color: colorFrame,
  roughness: 0.5,
  metalness: 0.2
});

const glassMaterial = new THREE.MeshStandardMaterial({
  color: colorGlass,
  roughness: 0.3,
  metalness: 0.1
});

const railingMaterial = new THREE.MeshStandardMaterial({
  color: colorRailing,
  roughness: 0.4,
  metalness: 0.3
});

const edgeLineMaterial = new THREE.LineBasicMaterial({
  color: colorEdge,
  linewidth: 1
});

// Helper function to create a mesh with SketchUp-like black CAD edges
function createEdgedMesh(geometry, material, addEdges = true, threshold = 25) {
  const mesh = new THREE.Mesh(geometry, material);
  if (addEdges) {
    const edges = new THREE.EdgesGeometry(geometry, threshold);
    const line = new THREE.LineSegments(edges, edgeLineMaterial);
    mesh.add(line);
  }
  return mesh;
}

// Master group for the entire building
const buildingGroup = new THREE.Group();
scene.add(buildingGroup);

// ----------------------------------------------------------------------------
// 3. KEY FOOTPRINT NODES (XZ Plane)
// ----------------------------------------------------------------------------
// The building features a multi-faceted angular footprint
const pBalcLeft   = new THREE.Vector2(-4.2,  1.6);  // Left corner of balcony bay
const pBalcRight  = new THREE.Vector2(-1.0,  2.3);  // Pier between balcony & middle bay
const pMidRight   = new THREE.Vector2( 2.2,  1.1);  // Angled corner to right bay
const pRightEnd   = new THREE.Vector2( 5.5, -2.4);  // Far right chamfered corner
const pRearRight  = new THREE.Vector2( 3.5, -5.6);  // Rear right corner
const pRearApex   = new THREE.Vector2(-0.8, -6.4);  // Rear triangular apex
const pRearLeft   = new THREE.Vector2(-4.2, -3.6);  // Rear left corner

// Recessed balcony back-wall line (setback = 1.4 units inward)
const balcDir = new THREE.Vector2().subVectors(pBalcRight, pBalcLeft).normalize();
const balcNormIn = new THREE.Vector2(balcDir.y, -balcDir.x); // inward pointing
const balcRecessDepth = 1.35;
const pRecessLeft = pBalcLeft.clone().addScaledVector(balcNormIn, balcRecessDepth);
const pRecessRight = pBalcRight.clone().addScaledVector(balcNormIn, balcRecessDepth);

// ----------------------------------------------------------------------------
// 4. MAIN TOWER SOLID CORE
// ----------------------------------------------------------------------------
// Extrude tower core (with recessed balcony zone)
const towerCoreShape = new THREE.Shape();
towerCoreShape.moveTo(pBalcLeft.x, pBalcLeft.y);
towerCoreShape.lineTo(pRecessLeft.x, pRecessLeft.y);
towerCoreShape.lineTo(pRecessRight.x, pRecessRight.y);
towerCoreShape.lineTo(pBalcRight.x, pBalcRight.y);
towerCoreShape.lineTo(pMidRight.x, pMidRight.y);
towerCoreShape.lineTo(pRightEnd.x, pRightEnd.y);
towerCoreShape.lineTo(pRearRight.x, pRearRight.y);
towerCoreShape.lineTo(pRearApex.x, pRearApex.y);
towerCoreShape.lineTo(pRearLeft.x, pRearLeft.y);
towerCoreShape.closePath();

const extrudeSettings = {
  depth: towerRoofY - baseHeight,
  bevelEnabled: false
};
const coreGeo = new THREE.ExtrudeGeometry(towerCoreShape, extrudeSettings);
// Rotate so extrusion runs along +Y
coreGeo.rotateX(Math.PI / 2);
coreGeo.translate(0, towerRoofY, 0);

const towerCoreMesh = createEdgedMesh(coreGeo, wallMaterial, true, 20);
buildingGroup.add(towerCoreMesh);

// ----------------------------------------------------------------------------
// 5. GROUND PODIUM & LEFT-REAR ANNEX
// ----------------------------------------------------------------------------
// Ground Podium base under main tower (solid full footprint)
const baseShape = new THREE.Shape();
baseShape.moveTo(pBalcLeft.x, pBalcLeft.y);
baseShape.lineTo(pBalcRight.x, pBalcRight.y);
baseShape.lineTo(pMidRight.x, pMidRight.y);
baseShape.lineTo(pRightEnd.x, pRightEnd.y);
baseShape.lineTo(pRearRight.x, pRearRight.y);
baseShape.lineTo(pRearApex.x, pRearApex.y);
baseShape.lineTo(pRearLeft.x, pRearLeft.y);
baseShape.closePath();

const baseGeo = new THREE.ExtrudeGeometry(baseShape, { depth: baseHeight, bevelEnabled: false });
baseGeo.rotateX(Math.PI / 2);
baseGeo.translate(0, baseHeight, 0);
const baseMesh = createEdgedMesh(baseGeo, baseMaterial, true, 20);
buildingGroup.add(baseMesh);

// Scored entrance/panel rectangle on the front base
const basePanelGeo = new THREE.PlaneGeometry(1.8, 2.4);
const basePanelEdges = new THREE.LineSegments(new THREE.EdgesGeometry(basePanelGeo), edgeLineMaterial);
basePanelEdges.position.set(0.6, 1.3, 1.72);
basePanelEdges.rotation.y = -Math.atan2(pMidRight.y - pBalcRight.y, pMidRight.x - pBalcRight.x);
buildingGroup.add(basePanelEdges);

// Low Podium Annex (extended wing on left-rear)
const annexWidth = 5.0;
const annexDepth = 5.8;
const annexHeight = 3.6;
const annexCenter = new THREE.Vector3(-6.8, annexHeight / 2, -2.4);

const annexBodyGeo = new THREE.BoxGeometry(annexWidth, annexHeight, annexDepth);
const annexBody = createEdgedMesh(annexBodyGeo, baseMaterial, true);
annexBody.position.copy(annexCenter);
buildingGroup.add(annexBody);

// Annex parapet walls (U-shaped border on exposed sides)
const annexParapetHeight = 0.8;
const annexPThick = 0.2;

// Front & outer parapet slabs
const ap1Geo = new THREE.BoxGeometry(annexWidth, annexParapetHeight, annexPThick);
const ap1 = createEdgedMesh(ap1Geo, baseMaterial, true);
ap1.position.set(annexCenter.x, annexHeight + annexParapetHeight / 2, annexCenter.z + annexDepth / 2 - annexPThick / 2);
buildingGroup.add(ap1);

const ap2Geo = new THREE.BoxGeometry(annexPThick, annexParapetHeight, annexDepth);
const ap2 = createEdgedMesh(ap2Geo, baseMaterial, true);
ap2.position.set(annexCenter.x - annexWidth / 2 + annexPThick / 2, annexHeight + annexParapetHeight / 2, annexCenter.z);
buildingGroup.add(ap2);

const ap3Geo = new THREE.BoxGeometry(annexWidth, annexParapetHeight, annexPThick);
const ap3 = createEdgedMesh(ap3Geo, baseMaterial, true);
ap3.position.set(annexCenter.x, annexHeight + annexParapetHeight / 2, annexCenter.z - annexDepth / 2 + annexPThick / 2);
buildingGroup.add(ap3);

// Roof surface inside annex parapet
const annexRoofPlane = createEdgedMesh(
  new THREE.BoxGeometry(annexWidth - annexPThick * 2, 0.05, annexDepth - annexPThick * 2),
  slabMaterial,
  false
);
annexRoofPlane.position.set(annexCenter.x, annexHeight + 0.03, annexCenter.z);
buildingGroup.add(annexRoofPlane);

// Thin antenna mast on annex roof as seen in image
const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 6);
const mast = createEdgedMesh(mastGeo, frameMaterial, false);
mast.position.set(-6.8, annexHeight + 1.6, -1.8);
buildingGroup.add(mast);

// ----------------------------------------------------------------------------
// 6. LEFT VERTICAL ARCHITECTURAL FINS
// ----------------------------------------------------------------------------
// 4 vertical fins on the far-left edge running the full height of typical floors
const numFins = 4;
const finWidth = 0.08;
const finDepth = 0.65;
const finHeight = towerRoofY - baseHeight + 0.5;

for (let f = 0; f < numFins; f++) {
  const finGeo = new THREE.BoxGeometry(finWidth, finHeight, finDepth);
  const fin = createEdgedMesh(finGeo, wallMaterial, true);
  // Stacked parallel along the left corner
  fin.position.set(
    pBalcLeft.x - 0.2 - f * 0.18,
    baseHeight + finHeight / 2,
    pBalcLeft.y - 0.2 + f * 0.28
  );
  fin.rotation.y = Math.PI / 12;
  buildingGroup.add(fin);
}

// ----------------------------------------------------------------------------
// 7. BALCONIES & RAILINGS (Left Front Facet)
// ----------------------------------------------------------------------------
// Balcony floor polygon
const balcSlabShape = new THREE.Shape();
balcSlabShape.moveTo(pBalcLeft.x, pBalcLeft.y);
balcSlabShape.lineTo(pBalcRight.x, pBalcRight.y);
balcSlabShape.lineTo(pRecessRight.x, pRecessRight.y);
balcSlabShape.lineTo(pRecessLeft.x, pRecessLeft.y);
balcSlabShape.closePath();

const slabThickness = 0.22;
const balcSlabGeo = new THREE.ExtrudeGeometry(balcSlabShape, { depth: slabThickness, bevelEnabled: false });
balcSlabGeo.rotateX(Math.PI / 2);

const balcWidth = pBalcLeft.distanceTo(pBalcRight);
const balcAngle = Math.atan2(pBalcRight.y - pBalcLeft.y, pBalcRight.x - pBalcLeft.x);
const balcCenter = new THREE.Vector2().addVectors(pBalcLeft, pBalcRight).multiplyScalar(0.5);

// Pier between balconies and middle window bay
const pierGeo = new THREE.BoxGeometry(0.3, towerRoofY - baseHeight, 0.5);
const pierMesh = createEdgedMesh(pierGeo, wallMaterial, true);
pierMesh.position.set(pBalcRight.x - 0.05, baseHeight + (towerRoofY - baseHeight) / 2, pBalcRight.y - 0.15);
pierMesh.rotation.y = -balcAngle;
buildingGroup.add(pierMesh);

// Build 20 typical balcony levels
for (let i = 0; i < numFloors; i++) {
  const yElev = baseHeight + i * floorHeight;

  // 1. Balcony Slab
  const slabInstance = createEdgedMesh(balcSlabGeo, slabMaterial, true);
  slabInstance.position.set(0, yElev + slabThickness, 0);
  buildingGroup.add(slabInstance);

  // 2. Dark glass recess backing (doors/windows into apartments)
  const recessBackingGeo = new THREE.PlaneGeometry(balcWidth * 0.9, floorHeight - slabThickness);
  const recessBacking = new THREE.Mesh(recessBackingGeo, glassMaterial);
  const recessCenter = new THREE.Vector2().addVectors(pRecessLeft, pRecessRight).multiplyScalar(0.5);
  recessBacking.position.set(recessCenter.x, yElev + floorHeight / 2, recessCenter.y);
  recessBacking.rotation.y = -balcAngle;
  buildingGroup.add(recessBacking);

  // 3. Horizontal dark railings
  const railingHeight = 0.95;
  const railTopGeo = new THREE.BoxGeometry(balcWidth - 0.15, 0.06, 0.05);
  const railMidGeo = new THREE.BoxGeometry(balcWidth - 0.15, 0.04, 0.04);
  const railBottomGeo = new THREE.BoxGeometry(balcWidth - 0.15, 0.04, 0.04);

  const topRail = createEdgedMesh(railTopGeo, railingMaterial, false);
  topRail.position.set(balcCenter.x, yElev + railingHeight, balcCenter.y);
  topRail.rotation.y = -balcAngle;
  buildingGroup.add(topRail);

  const midRail = createEdgedMesh(railMidGeo, railingMaterial, false);
  midRail.position.set(balcCenter.x, yElev + railingHeight * 0.6, balcCenter.y);
  midRail.rotation.y = -balcAngle;
  buildingGroup.add(midRail);

  const bottomRail = createEdgedMesh(railBottomGeo, railingMaterial, false);
  bottomRail.position.set(balcCenter.x, yElev + 0.15, balcCenter.y);
  bottomRail.rotation.y = -balcAngle;
  buildingGroup.add(bottomRail);

  // Balcony end return railings (sides)
  const leftSideRailGeo = new THREE.BoxGeometry(0.04, 0.05, balcRecessDepth - 0.1);
  const leftSideRail = createEdgedMesh(leftSideRailGeo, railingMaterial, false);
  leftSideRail.position.set(pBalcLeft.x + 0.12, yElev + railingHeight, pBalcLeft.y - balcRecessDepth / 2);
  buildingGroup.add(leftSideRail);

  const rightSideRailGeo = new THREE.BoxGeometry(0.04, 0.05, balcRecessDepth - 0.1);
  const rightSideRail = createEdgedMesh(rightSideRailGeo, railingMaterial, false);
  rightSideRail.position.set(pBalcRight.x - 0.12, yElev + railingHeight, pBalcRight.y - balcRecessDepth / 2);
  buildingGroup.add(rightSideRail);
}

// ----------------------------------------------------------------------------
// 8. MIDDLE FACET (3x3 Multi-Pane Grid Windows)
// ----------------------------------------------------------------------------
const midWidth = pBalcRight.distanceTo(pMidRight);
const midAngle = Math.atan2(pMidRight.y - pBalcRight.y, pMidRight.x - pBalcRight.x);
const midCenter = new THREE.Vector2().addVectors(pBalcRight, pMidRight).multiplyScalar(0.5);

// Outward offset normal for window frames
const midDir = new THREE.Vector2().subVectors(pMidRight, pBalcRight).normalize();
const midNormOut = new THREE.Vector2(-midDir.y, midDir.x);

const winMWidth = 2.0;
const winMHeight = 1.85;

for (let i = 0; i < numFloors; i++) {
  const yCenter = baseHeight + (i + 0.5) * floorHeight;
  const winGroup = new THREE.Group();

  // Glass backdrop
  const glassGeo = new THREE.PlaneGeometry(winMWidth, winMHeight);
  const glass = new THREE.Mesh(glassGeo, glassMaterial);
  winGroup.add(glass);

  // Outer frame
  const outerEdges = new THREE.EdgesGeometry(glassGeo);
  const outerLine = new THREE.LineSegments(outerEdges, edgeLineMaterial);
  winGroup.add(outerLine);

  // 3x3 Window grid mullions (2 vertical, 2 horizontal)
  const mullionMat = edgeLineMaterial;
  const colW = winMWidth / 3;
  const rowH = winMHeight / 3;

  const mullionGeo = new THREE.BufferGeometry();
  const pts = [];
  // 2 vertical bars
  pts.push(new THREE.Vector3(-colW / 2, -winMHeight / 2, 0.01), new THREE.Vector3(-colW / 2, winMHeight / 2, 0.01));
  pts.push(new THREE.Vector3( colW / 2, -winMHeight / 2, 0.01), new THREE.Vector3( colW / 2, winMHeight / 2, 0.01));
  // 2 horizontal bars
  pts.push(new THREE.Vector3(-winMWidth / 2, -rowH / 2, 0.01), new THREE.Vector3(winMWidth / 2, -rowH / 2, 0.01));
  pts.push(new THREE.Vector3(-winMWidth / 2,  rowH / 2, 0.01), new THREE.Vector3(winMWidth / 2,  rowH / 2, 0.01));

  mullionGeo.setFromPoints(pts);
  const mullions = new THREE.LineSegments(mullionGeo, mullionMat);
  winGroup.add(mullions);

  // Position on facade
  const pos = midCenter.clone().addScaledVector(midNormOut, 0.05);
  winGroup.position.set(pos.x, yCenter, pos.y);
  winGroup.rotation.y = -midAngle;
  buildingGroup.add(winGroup);
}

// ----------------------------------------------------------------------------
// 9. RIGHT FACET (Wide Horizontal Windows)
// ----------------------------------------------------------------------------
const rightWidth = pMidRight.distanceTo(pRightEnd);
const rightAngle = Math.atan2(pRightEnd.y - pMidRight.y, pRightEnd.x - pMidRight.x);
const rightCenter = new THREE.Vector2().addVectors(pMidRight, pRightEnd).multiplyScalar(0.5);

const rightDir = new THREE.Vector2().subVectors(pRightEnd, pMidRight).normalize();
const rightNormOut = new THREE.Vector2(-rightDir.y, rightDir.x);

const winRWidth = 3.6;
const winRHeight = 1.6;

// In the image, right facet windows continue up into the penthouse for +2 floors (total 22 floors)
const totalRightFloors = numFloors + 2;

for (let i = 0; i < totalRightFloors; i++) {
  const yCenter = baseHeight + (i + 0.5) * floorHeight;
  const winGroup = new THREE.Group();

  // Glass backing
  const glassGeo = new THREE.PlaneGeometry(winRWidth, winRHeight);
  const glass = new THREE.Mesh(glassGeo, glassMaterial);
  winGroup.add(glass);

  // Outer frame
  const outerLine = new THREE.LineSegments(new THREE.EdgesGeometry(glassGeo), edgeLineMaterial);
  winGroup.add(outerLine);

  // Internal mullions: 1 center vertical divider, 1 upper transom line
  const pts = [];
  // Center vertical
  pts.push(new THREE.Vector3(0, -winRHeight / 2, 0.01), new THREE.Vector3(0, winRHeight / 2, 0.01));
  // Top horizontal transom
  const transomY = winRHeight * 0.25;
  pts.push(new THREE.Vector3(-winRWidth / 2, transomY, 0.01), new THREE.Vector3(winRWidth / 2, transomY, 0.01));

  const mullionGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const mullions = new THREE.LineSegments(mullionGeo, edgeLineMaterial);
  winGroup.add(mullions);

  // Position on facade
  const pos = rightCenter.clone().addScaledVector(rightNormOut, 0.05);
  winGroup.position.set(pos.x, yCenter, pos.y);
  winGroup.rotation.y = -rightAngle;
  buildingGroup.add(winGroup);
}

// ----------------------------------------------------------------------------
// 10. ROOF TERRACE & PENTHOUSE BULKHEADS
// ----------------------------------------------------------------------------
// 1. Front Roof Parapet (enclosing terrace above typical floors)
const frontParapetShape = new THREE.Shape();
frontParapetShape.moveTo(pBalcLeft.x, pBalcLeft.y);
frontParapetShape.lineTo(pBalcRight.x, pBalcRight.y);
frontParapetShape.lineTo(pMidRight.x, pMidRight.y);
// Setback line to penthouse wall
frontParapetShape.lineTo(pMidRight.x - 0.2, pMidRight.y - 1.2);
frontParapetShape.lineTo(pBalcLeft.x + 0.5, pBalcLeft.y - 1.2);
frontParapetShape.closePath();

const frontParapetGeo = new THREE.ExtrudeGeometry(frontParapetShape, { depth: parapetHeight, bevelEnabled: false });
frontParapetGeo.rotateX(Math.PI / 2);
frontParapetGeo.translate(0, towerRoofY + parapetHeight, 0);
const frontParapet = createEdgedMesh(frontParapetGeo, wallMaterial, true, 20);
buildingGroup.add(frontParapet);

// Front flat roof floor surface
const frontRoofPlaneGeo = new THREE.BoxGeometry(balcWidth + midWidth, 0.05, 3.0);
const frontRoofPlane = createEdgedMesh(frontRoofPlaneGeo, slabMaterial, false);
frontRoofPlane.position.set(0.0, towerRoofY + 0.05, 0.2);
buildingGroup.add(frontRoofPlane);

// 2. Rooftop Triangular Penthouse (Center-Left bulkhed)
const triPentShape = new THREE.Shape();
const triP1 = new THREE.Vector2(-4.2, -0.2);
const triP2 = new THREE.Vector2( 0.4, -0.6);
const triP3 = new THREE.Vector2(-2.2, -4.8);
triPentShape.moveTo(triP1.x, triP1.y);
triPentShape.lineTo(triP2.x, triP2.y);
triPentShape.lineTo(triP3.x, triP3.y);
triPentShape.closePath();

const triPentHeight = penthouseHeight - 1.2;
const triPentGeo = new THREE.ExtrudeGeometry(triPentShape, { depth: triPentHeight, bevelEnabled: false });
triPentGeo.rotateX(Math.PI / 2);
triPentGeo.translate(0, towerRoofY + triPentHeight, 0);
const triPentMesh = createEdgedMesh(triPentGeo, wallMaterial, true, 20);
buildingGroup.add(triPentMesh);

// Triangular Penthouse Parapet on its top
const triParapetGeo = new THREE.ExtrudeGeometry(triPentShape, { depth: parapetHeight, bevelEnabled: false });
triParapetGeo.rotateX(Math.PI / 2);
triParapetGeo.translate(0, towerRoofY + triPentHeight + parapetHeight, 0);
const triParapetMesh = createEdgedMesh(triParapetGeo, wallMaterial, true, 20);
buildingGroup.add(triParapetMesh);

// Triangular inner roof recess
const triRoofGeo = new THREE.ExtrudeGeometry(triPentShape, { depth: 0.05, bevelEnabled: false });
triRoofGeo.rotateX(Math.PI / 2);
triRoofGeo.translate(0, towerRoofY + triPentHeight + 0.02, 0);
const triRoofMesh = createEdgedMesh(triRoofGeo, slabMaterial, false);
buildingGroup.add(triRoofMesh);

// 3. Rooftop Trapezoidal Penthouse (Right/Rear bulkhead)
// Houses elevator core and supports the 2 upper levels of right-side windows
const trapPentShape = new THREE.Shape();
trapPentShape.moveTo( 0.4, -0.6);
trapPentShape.lineTo(pMidRight.x, pMidRight.y);
trapPentShape.lineTo(pRightEnd.x, pRightEnd.y);
trapPentShape.lineTo(pRearRight.x, pRearRight.y);
trapPentShape.lineTo(-1.2, -5.2);
trapPentShape.closePath();

const trapPentGeo = new THREE.ExtrudeGeometry(trapPentShape, { depth: penthouseHeight, bevelEnabled: false });
trapPentGeo.rotateX(Math.PI / 2);
trapPentGeo.translate(0, towerRoofY + penthouseHeight, 0);
const trapPentMesh = createEdgedMesh(trapPentGeo, wallMaterial, true, 20);
buildingGroup.add(trapPentMesh);

// Trapezoid rooftop parapet
const trapParapetGeo = new THREE.ExtrudeGeometry(trapPentShape, { depth: parapetHeight, bevelEnabled: false });
trapParapetGeo.rotateX(Math.PI / 2);
trapParapetGeo.translate(0, towerRoofY + penthouseHeight + parapetHeight, 0);
const trapParapetMesh = createEdgedMesh(trapParapetGeo, wallMaterial, true, 20);
buildingGroup.add(trapParapetMesh);

// Trapezoid inner roof deck
const trapRoofGeo = new THREE.ExtrudeGeometry(trapPentShape, { depth: 0.05, bevelEnabled: false });
trapRoofGeo.rotateX(Math.PI / 2);
trapRoofGeo.translate(0, towerRoofY + penthouseHeight + 0.02, 0);
const trapRoofMesh = createEdgedMesh(trapRoofGeo, slabMaterial, false);
buildingGroup.add(trapRoofMesh);

// ----------------------------------------------------------------------------
// 11. CAMERA CONFIGURATION
// ----------------------------------------------------------------------------
// Setup an axonometric-style perspective camera matching the reference drawing
camera.position.set(42, 54, 48);
const target = new THREE.Vector3(-0.5, 30.0, -1.0);
camera.lookAt(target);

if (typeof controls !== 'undefined' && controls) {
  controls.target.copy(target);
  controls.update();
}