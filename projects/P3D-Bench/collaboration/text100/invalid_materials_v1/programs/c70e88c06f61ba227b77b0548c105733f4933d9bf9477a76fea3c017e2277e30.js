// CAD Model Parameters
// All units are in model coordinate units as specified

// Main Base Parameters
const baseLength = 0.260714;       // Left-to-right extent (X)
const baseWidth = 0.616071;        // Front-to-back extent (Z)
const baseHeight = 0.339286;       // Vertical extrusion from datum (Y: 0 -> +0.3393)
const cornerRadius = 0.035;        // Outline fillet radius for rounded profile

// Central Circular Opening & Underside Axis
const holeCenterX = 0.1304;        // Left-offset
const holeCenterZ = 0.5089;        // Front-offset
const holeRadius = 0.0804;         // Radius of through inner opening

// Upper Shallow Circular Solid Pads
const padRadius = 0.0375;
const padHeight = 0.0268;          // Extrusion height from base datum
const padFrontOffset = 0.3661;     // Front-offset for both pad axes
const pad1LeftOffset = -0.1821;    // Left pad axis
const pad2LeftOffset = 0.4429;     // Right pad axis

// Underside Annular Solids (Stepped concentric rings)
// Ring 1: Shallower outer ring
const ring1OuterR = 0.0804;
const ring1InnerR = 0.0446;
const ring1Depth = 0.0268;         // Extends 0.0268 below underside (Y: 0 -> -0.0268)

// Ring 2: Deeper inner ring
const ring2OuterR = 0.0446;
const ring2InnerR = 0.0268;
const ring2Depth = 0.0714;         // Extends 0.0714 below underside (Y: 0 -> -0.0714)

// Underside Rectangular Protrusion
const underRectLength = 0.053571;  // X size
const underRectWidth = 0.035714;   // Z size
const underRectHeight = 0.178571;  // Y depth below underside (Y: 0 -> -0.1786)
const underRectLeft = 0.1036;      // Edge offset left
const underRectFront = 0.4911;     // Edge offset front

// Central Upper Rectangular Solid (inside circular opening)
const upperRectLength = 0.03993;   // X size
const upperRectWidth = 0.053571;   // Z size
const upperRectHeight = 0.339286;  // Extends upward from datum (Y: 0 -> +0.3393)
const upperRectLeft = 0.1104;      // Edge offset left
const upperRectFront = 0.4821;     // Edge offset front

// Shared CAD Material
const cadMaterial = new THREE.MeshStandardMaterial({
  color: 0x94a8b8,
  metalness: 0.35,
  roughness: 0.4,
  side: THREE.DoubleSide
});

// Master assembly group
const cadModel = new THREE.Group();

// -----------------------------------------------------------------------------
// 1. Main Base Solid with Through Hole and Arc-based Rounded Outline
// -----------------------------------------------------------------------------
const baseShape = new THREE.Shape();
const r = cornerRadius;
const w = baseLength;
const d = baseWidth;

// Counter-clockwise rounded rectangular perimeter
baseShape.moveTo(r, 0);
baseShape.lineTo(w - r, 0);
baseShape.absarc(w - r, r, r, -Math.PI / 2, 0, false);
baseShape.lineTo(w, d - r);
baseShape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
baseShape.lineTo(r, d);
baseShape.absarc(r, d - r, r, Math.PI / 2, Math.PI, false);
baseShape.lineTo(0, r);
baseShape.absarc(r, r, r, Math.PI, Math.PI * 1.5, false);

// Through circular inner opening (clockwise for hole cut)
const holePath = new THREE.Path();
holePath.absarc(holeCenterX, holeCenterZ, holeRadius, 0, Math.PI * 2, true);
baseShape.holes.push(holePath);

const baseExtrudeSettings = {
  depth: baseHeight,
  bevelEnabled: false,
  curveSegments: 64
};

const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
// Rotate so 2D shape lies on X-Z plane and extrudes along +Y
baseGeometry.rotateX(Math.PI / 2);
baseGeometry.translate(0, baseHeight, 0);
baseGeometry.computeVertexNormals();

const baseMesh = new THREE.Mesh(baseGeometry, cadMaterial);
cadModel.add(baseMesh);

// -----------------------------------------------------------------------------
// 2. Separate Shallow Circular Solid Pads on Upper Side
// -----------------------------------------------------------------------------
const padGeometry = new THREE.CylinderGeometry(padRadius, padRadius, padHeight, 64);

// Pad 1 (Left offset -0.1821)
const pad1Mesh = new THREE.Mesh(padGeometry, cadMaterial);
pad1Mesh.position.set(pad1LeftOffset, padHeight / 2, padFrontOffset);
cadModel.add(pad1Mesh);

// Pad 2 (Left offset 0.4429)
const pad2Mesh = new THREE.Mesh(padGeometry, cadMaterial);
pad2Mesh.position.set(pad2LeftOffset, padHeight / 2, padFrontOffset);
cadModel.add(pad2Mesh);

// -----------------------------------------------------------------------------
// Helper: Create Hollow Annular Ring Solid
// -----------------------------------------------------------------------------
function createAnnularGeometry(innerR, outerR, depth) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const extrudeSettings = {
    depth: depth,
    bevelEnabled: false,
    curveSegments: 64
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Re-orient to hang downward from base underside (Y = 0 down to Y = -depth)
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

// -----------------------------------------------------------------------------
// 3. Coaxial Annular Underside Solids (Stepped concentric hollow rings)
// -----------------------------------------------------------------------------
// Ring 1 (shallower ring, depth 0.0268 below base underside)
const ring1Geometry = createAnnularGeometry(ring1InnerR, ring1OuterR, ring1Depth);
const ring1Mesh = new THREE.Mesh(ring1Geometry, cadMaterial);
ring1Mesh.position.set(holeCenterX, 0, holeCenterZ);
cadModel.add(ring1Mesh);

// Ring 2 (deeper ring, starting from base underside shoulder down to 0.0714)
const ring2Geometry = createAnnularGeometry(ring2InnerR, ring2OuterR, ring2Depth);
const ring2Mesh = new THREE.Mesh(ring2Geometry, cadMaterial);
ring2Mesh.position.set(holeCenterX, 0, holeCenterZ);
cadModel.add(ring2Mesh);

// -----------------------------------------------------------------------------
// 4. Solid Rectangular Underside Protrusion
// -----------------------------------------------------------------------------
const underRectGeometry = new THREE.BoxGeometry(underRectLength, underRectHeight, underRectWidth);
const underRectCenterX = underRectLeft + underRectLength / 2;
const underRectCenterY = -underRectHeight / 2;
const underRectCenterZ = underRectFront + underRectWidth / 2;

const underRectMesh = new THREE.Mesh(underRectGeometry, cadMaterial);
underRectMesh.position.set(underRectCenterX, underRectCenterY, underRectCenterZ);
cadModel.add(underRectMesh);

// -----------------------------------------------------------------------------
// 5. Central Upper Rectangular Solid (inside circular opening)
// -----------------------------------------------------------------------------
const upperRectGeometry = new THREE.BoxGeometry(upperRectLength, upperRectHeight, upperRectWidth);
const upperRectCenterX = upperRectLeft + upperRectLength / 2;
const upperRectCenterY = upperRectHeight / 2;
const upperRectCenterZ = upperRectFront + upperRectWidth / 2;

const upperRectMesh = new THREE.Mesh(upperRectGeometry, cadMaterial);
upperRectMesh.position.set(upperRectCenterX, upperRectCenterY, upperRectCenterZ);
cadModel.add(upperRectMesh);

// -----------------------------------------------------------------------------
// Center Assembly & Setup Viewport
// -----------------------------------------------------------------------------
// Center assembly about reference axes for clean orbit navigation
const centerX = (pad1LeftOffset - padRadius + pad2LeftOffset + padRadius) / 2;
const centerY = (baseHeight - underRectHeight) / 2;
const centerZ = baseWidth / 2;
cadModel.position.set(-centerX, -centerY, -centerZ);

scene.add(cadModel);

// Adjust camera perspective to frame all CAD features
camera.position.set(0.7, 0.6, 0.8);
camera.lookAt(0, 0, 0);

if (typeof controls !== 'undefined' && controls) {
  controls.target.set(0, 0, 0);
  controls.update();
}
```