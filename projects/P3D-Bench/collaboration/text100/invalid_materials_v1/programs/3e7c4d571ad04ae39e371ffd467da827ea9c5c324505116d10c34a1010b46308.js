// ==========================================
// PARAMETRIC CAD MODEL: BRACKET WITH SIDE WALLS & RECESSED BOSS
// ==========================================

// --- Base Dimensions ---
const baseWidth = 80;          // Total width of the base (X-axis)
const baseLength = 150;        // Total length of the base (Z-axis)
const baseThickness = 10;      // Thickness/height of the base (Y-axis)

// --- Upright Side Wall Dimensions ---
const wallThickness = 10;      // Thickness of each side wall (X-axis)
const wallHeight = 45;         // Height of walls above the base upper face (Y-axis)
const wallLength = baseLength; // Side walls run along the full length of base edges

// --- Side Wall Through-Hole (Opening) Parameters ---
const wallHoleRadius = 11;     // Radius of the round opening through each wall
const wallHoleOffsetZ = 45;    // Offset along length (Z-axis) toward one end
const wallHoleCenterY = 24;    // Center height of opening above the base upper face

// --- Central Raised Feature Dimensions ---
const raisedWidth = 44;        // Width along X-axis (centered between side walls)
const raisedLength = 56;       // Length along Z-axis
const raisedHeight = 24;       // Total height above the base upper face (Y-axis)
const raisedCenterZ = 15;      // Center offset along Z-axis (clear of the wall holes)

// --- Circular Recess / Cut Features ---
const recessRadius = 8;        // Radius of each circular recess
const recessDepth = 10;        // Depth of cut tier (shallower than raisedHeight)
const recessSpacing = 26;      // Center-to-center distance between the two cuts along Z

// ==========================================
// MATERIALS SETUP
// ==========================================

// Base and side walls: Satin anodized aluminum finish
const structuralMaterial = new THREE.MeshStandardMaterial({
  color: 0x90a4ae,
  metalness: 0.35,
  roughness: 0.28,
  flatShading: false
});

// Central raised feature: Contrasting precision machined steel finish
const raisedFeatureMaterial = new THREE.MeshStandardMaterial({
  color: 0x546e7a,
  metalness: 0.45,
  roughness: 0.22,
  flatShading: false
});

// ==========================================
// 1. SOLID RECTANGULAR BASE
// ==========================================

const baseGeometry = new THREE.BoxGeometry(baseWidth, baseThickness, baseLength);
const baseMesh = new THREE.Mesh(baseGeometry, structuralMaterial);

// Position base so bottom rests at Y = 0; upper face is at Y = baseThickness
baseMesh.position.set(0, baseThickness / 2, 0);
baseMesh.castShadow = true;
baseMesh.receiveShadow = true;
scene.add(baseMesh);

// ==========================================
// 2. UPRIGHT SIDE WALLS WITH ROUND VOID OPENINGS
// ==========================================

// Construct the 2D profile of the wall with the round opening as a hole
const wallShape = new THREE.Shape();
const halfWallLength = wallLength / 2;

// Outer rectangular profile: length along shape-X, height along shape-Y
wallShape.moveTo(-halfWallLength, 0);
wallShape.lineTo(halfWallLength, 0);
wallShape.lineTo(halfWallLength, wallHeight);
wallShape.lineTo(-halfWallLength, wallHeight);
wallShape.closePath();

// Circular through-void opening located near one end of the wall
const wallHole = new THREE.Path();
wallHole.absarc(wallHoleOffsetZ, wallHoleCenterY, wallHoleRadius, 0, Math.PI * 2, true);
wallShape.holes.push(wallHole);

// Extrude wall geometry through its thickness
const wallExtrudeSettings = {
  steps: 1,
  depth: wallThickness,
  bevelEnabled: false,
  curveSegments: 48
};

const wallGeometry = new THREE.ExtrudeGeometry(wallShape, wallExtrudeSettings);

// Reorient extruded wall:
// - rotateY transforms shape-X (length) to Z and extrusion depth to X
// - translate centers the wall thickness in local X
wallGeometry.rotateY(Math.PI / 2);
wallGeometry.translate(-wallThickness / 2, 0, 0);
wallGeometry.computeVertexNormals();

// Left upright side wall (placed flush along negative X edge)
const leftWallMesh = new THREE.Mesh(wallGeometry, structuralMaterial);
leftWallMesh.position.set(-baseWidth / 2 + wallThickness / 2, baseThickness, 0);
leftWallMesh.castShadow = true;
leftWallMesh.receiveShadow = true;
scene.add(leftWallMesh);

// Right upright side wall (placed flush along positive X edge)
const rightWallMesh = new THREE.Mesh(wallGeometry, structuralMaterial);
rightWallMesh.position.set(baseWidth / 2 - wallThickness / 2, baseThickness, 0);
rightWallMesh.castShadow = true;
rightWallMesh.receiveShadow = true;
scene.add(rightWallMesh);

// ==========================================
// 3. RAISED FEATURE WITH TWO RECESSED CUTS
// ==========================================

// Lower tier: solid rectangular base block that forms the floor of the recesses
const lowerTierHeight = raisedHeight - recessDepth;
const lowerTierGeometry = new THREE.BoxGeometry(raisedWidth, lowerTierHeight, raisedLength);
const lowerTierMesh = new THREE.Mesh(lowerTierGeometry, raisedFeatureMaterial);

lowerTierMesh.position.set(
  0,
  baseThickness + lowerTierHeight / 2,
  raisedCenterZ
);
lowerTierMesh.castShadow = true;
lowerTierMesh.receiveShadow = true;
scene.add(lowerTierMesh);

// Upper tier: extruded rectangular plate containing the two circular cut voids
const raisedUpperShape = new THREE.Shape();
const halfRaisedWidth = raisedWidth / 2;
const halfRaisedLength = raisedLength / 2;

// Outer perimeter of the raised feature
raisedUpperShape.moveTo(-halfRaisedWidth, -halfRaisedLength);
raisedUpperShape.lineTo(halfRaisedWidth, -halfRaisedLength);
raisedUpperShape.lineTo(halfRaisedWidth, halfRaisedLength);
raisedUpperShape.lineTo(-halfRaisedWidth, halfRaisedLength);
raisedUpperShape.closePath();

// First circular recess void (at matching height)
const recessVoid1 = new THREE.Path();
recessVoid1.absarc(0, -recessSpacing / 2, recessRadius, 0, Math.PI * 2, true);
raisedUpperShape.holes.push(recessVoid1);

// Second circular recess void (at matching height)
const recessVoid2 = new THREE.Path();
recessVoid2.absarc(0, recessSpacing / 2, recessRadius, 0, Math.PI * 2, true);
raisedUpperShape.holes.push(recessVoid2);

const upperExtrudeSettings = {
  steps: 1,
  depth: recessDepth,
  bevelEnabled: false,
  curveSegments: 48
};

const upperTierGeometry = new THREE.ExtrudeGeometry(raisedUpperShape, upperExtrudeSettings);

// Rotate so extrusion direction points upward along world +Y
upperTierGeometry.rotateX(-Math.PI / 2);
upperTierGeometry.computeVertexNormals();

const upperTierMesh = new THREE.Mesh(upperTierGeometry, raisedFeatureMaterial);

// Sit upper tier directly on top of the lower tier; the top of lower tier forms the recess floors
upperTierMesh.position.set(
  0,
  baseThickness + lowerTierHeight,
  raisedCenterZ
);
upperTierMesh.castShadow = true;
upperTierMesh.receiveShadow = true;
scene.add(upperTierMesh);

// ==========================================
// CAMERA & VIEWPORT CONFIGURATION
// ==========================================

camera.position.set(130, 110, 140);
camera.lookAt(0, 22, 0);

if (typeof controls !== 'undefined' && controls) {
  controls.target.set(0, 22, 0);
  controls.update();
}
```