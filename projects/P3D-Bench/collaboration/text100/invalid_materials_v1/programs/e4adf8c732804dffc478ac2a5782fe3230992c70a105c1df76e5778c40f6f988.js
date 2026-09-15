// ============================================================================
// Parametric CAD Model: Stepped Nested Cavity Block with Side Feature
// ============================================================================

// --- 1. PARAMETRIC DIMENSIONS & CONFIGURATION ---

// Overall Main Body Dimensions
const bodyWidth  = 130.0;  // X axis dimension
const bodyDepth  = 90.0;   // Z axis dimension
const bodyHeight = 65.0;   // Y axis dimension

const xMin = -bodyWidth / 2.0;  // -65.0
const xMax =  bodyWidth / 2.0;  //  65.0
const zMin = -bodyDepth / 2.0;  // -45.0
const zMax =  bodyDepth / 2.0;  //  45.0

// Cavity Tier 1: Broader Upper Recess surrounded by a thin top rim
const rimThickness = 6.0;
const p1_x0 = xMin + rimThickness;  // -59.0
const p1_x1 = xMax - rimThickness;  //  59.0
const p1_z0 = zMin + rimThickness;  // -39.0
const p1_z1 = zMax - rimThickness;  //  39.0
const p1_y  = 48.0;                 // Depth = 17.0 from top

// Cavity Tier 2: Middle Inset Rectangular Pocket
const p2_x0 = -46.0;
const p2_x1 =  46.0;
const p2_z0 = -27.0;
const p2_z1 =  27.0;
const p2_y  = 30.0;                 // Depth = 18.0 from Tier 1

// Cavity Tier 3: Deepest Pocket (Shifted to -X side, producing uneven interior ledges)
const p3_x0 = -41.0;  // Narrow 5mm ledge on -X side
const p3_x1 =  16.0;  // Broad 30mm ledge on +X side
const p3_z0 = -20.0;  // 7mm ledge on -Z
const p3_z1 =  19.0;  // 8mm ledge on +Z
const p3_y  =  12.0;  // Solid bottom floor (12.0 mm thick solid base)

// Side Feature (+X face): Added Solid Projection & Related Recess
const projWidth  = 16.0;             // Projection outward extension (+X)
const projXMax   = xMax + projWidth; // 81.0
const projZ0     = -24.0;
const projZ1     =  24.0;
const projYMax   =  22.0;            // Height of projection

const recX       =  57.0;            // Inset side recess cuts 8mm into main wall
const recZ0      = -18.0;
const recZ1      =  18.0;
const recY0      =  22.0;            // Starts directly above projection shelf
const recY1      =  44.0;            // Ceiling of side recess

// --- 2. WATERTIGHT GEOMETRY GENERATOR ---

const positions = [];
const normals = [];

// Helper: Add axis-aligned horizontal rectangle (Y-plane)
function addRectY(y, x0, x1, z0, z1, facingUp) {
  const normY = facingUp ? 1.0 : -1.0;
  const a = [x0, y, z1], b = [x1, y, z1], c = [x1, y, z0], d = [x0, y, z0];
  const p1 = facingUp ? a : a;
  const p2 = facingUp ? b : d;
  const p3 = facingUp ? c : c;
  const p4 = facingUp ? d : b;

  // Triangle 1
  positions.push(...p1, ...p2, ...p3);
  normals.push(0, normY, 0, 0, normY, 0, 0, normY, 0);
  // Triangle 2
  positions.push(...p1, ...p3, ...p4);
  normals.push(0, normY, 0, 0, normY, 0, 0, normY, 0);
}

// Helper: Add axis-aligned vertical rectangle (X-plane)
function addRectX(x, y0, y1, z0, z1, facingRight) {
  const normX = facingRight ? 1.0 : -1.0;
  const a = [x, y0, z0], b = [x, y0, z1], c = [x, y1, z1], d = [x, y1, z0];
  const p1 = facingRight ? a : a;
  const p2 = facingRight ? b : d;
  const p3 = facingRight ? c : c;
  const p4 = facingRight ? d : b;

  // Triangle 1
  positions.push(...p1, ...p2, ...p3);
  normals.push(normX, 0, 0, normX, 0, 0, normX, 0);
  // Triangle 2
  positions.push(...p1, ...p3, ...p4);
  normals.push(normX, 0, 0, normX, 0, 0, normX, 0);
}

// Helper: Add axis-aligned vertical rectangle (Z-plane)
function addRectZ(z, x0, x1, y0, y1, facingFront) {
  const normZ = facingFront ? 1.0 : -1.0;
  const a = [x0, y0, z], b = [x1, y0, z], c = [x1, y1, z], d = [x0, y1, z];
  const p1 = facingFront ? a : a;
  const p2 = facingFront ? b : d;
  const p3 = facingFront ? c : c;
  const p4 = facingFront ? d : b;

  // Triangle 1
  positions.push(...p1, ...p2, ...p3);
  normals.push(0, 0, normZ, 0, 0, normZ, 0, 0, normZ);
  // Triangle 2
  positions.push(...p1, ...p3, ...p4);
  normals.push(0, 0, normZ, 0, 0, normZ, 0, 0, normZ);
}

// --- 3. CONSTRUCTING MODEL SURFACES ---

// A. Bottom Faces (Solid Bottom at Y = 0)
addRectY(0, xMin, xMax, zMin, zMax, false);
addRectY(0, xMax, projXMax, projZ0, projZ1, false); // Bottom of side projection

// B. Outer Perimeter Walls
addRectX(xMin, 0, bodyHeight, zMin, zMax, false); // -X left outer wall
addRectZ(zMin, xMin, xMax, 0, bodyHeight, false); // -Z rear outer wall
addRectZ(zMax, xMin, xMax, 0, bodyHeight, true);  // +Z front outer wall

// C. Side Feature Geometry (+X Wall, Projection, and Side Recess)
// Projection outer faces:
addRectZ(projZ0, xMax, projXMax, 0, projYMax, false); // Projection -Z side
addRectZ(projZ1, xMax, projXMax, 0, projYMax, true);  // Projection +Z side
addRectX(projXMax, 0, projYMax, projZ0, projZ1, true); // Projection outward +X face
addRectY(projYMax, xMax, projXMax, projZ0, projZ1, true); // Top shelf of projection

// Side recess faces (stepped depth tier cut inward above projection):
addRectY(recY0, recX, xMax, recZ0, recZ1, true);       // Recess horizontal floor
addRectX(recX, recY0, recY1, recZ0, recZ1, true);       // Recess vertical back wall
addRectZ(recZ0, recX, xMax, recY0, recY1, true);       // Recess side wall (-Z)
addRectZ(recZ1, recX, xMax, recY0, recY1, false);      // Recess side wall (+Z)
addRectY(recY1, recX, xMax, recZ0, recZ1, false);      // Recess horizontal ceiling

// Remaining visible regions on +X main body wall:
addRectX(xMax, 0, bodyHeight, zMin, projZ0, true);     // +X wall (rear section)
addRectX(xMax, 0, bodyHeight, projZ1, zMax, true);     // +X wall (front section)
addRectX(xMax, recY1, bodyHeight, projZ0, projZ1, true); // +X wall above recess
addRectX(xMax, recY0, recY1, projZ0, recZ0, true);     // +X wall left flank of recess
addRectX(xMax, recY0, recY1, recZ1, projZ1, true);     // +X wall right flank of recess

// D. Top Rim (Surrounding Tier 1 Upper Recess)
addRectY(bodyHeight, xMin, p1_x0, zMin, zMax, true); // Left rim strip
addRectY(bodyHeight, p1_x1, xMax, zMin, zMax, true); // Right rim strip
addRectY(bodyHeight, p1_x0, p1_x1, zMin, p1_z0, true); // Rear rim strip
addRectY(bodyHeight, p1_x0, p1_x1, p1_z1, zMax, true); // Front rim strip

// E. Cavity Tier 1: Vertical Walls (down to Y = p1_y)
addRectX(p1_x0, p1_y, bodyHeight, p1_z0, p1_z1, true);  // Left wall
addRectX(p1_x1, p1_y, bodyHeight, p1_z0, p1_z1, false); // Right wall
addRectZ(p1_z0, p1_x0, p1_x1, p1_y, bodyHeight, true);  // Rear wall
addRectZ(p1_z1, p1_x0, p1_x1, p1_y, bodyHeight, false); // Front wall

// F. Interior Ledge 1 at Y = p1_y (Step between Tier 1 and Tier 2)
addRectY(p1_y, p1_x0, p2_x0, p1_z0, p1_z1, true); // Left ledge
addRectY(p1_y, p2_x1, p1_x1, p1_z0, p1_z1, true); // Right ledge
addRectY(p1_y, p2_x0, p2_x1, p1_z0, p2_z0, true); // Rear ledge
addRectY(p1_y, p2_x0, p2_x1, p2_z1, p1_z1, true); // Front ledge

// G. Cavity Tier 2: Vertical Walls (down to Y = p2_y)
addRectX(p2_x0, p2_y, p1_y, p2_z0, p2_z1, true);  // Left wall
addRectX(p2_x1, p2_y, p1_y, p2_z0, p2_z1, false); // Right wall
addRectZ(p2_z0, p2_x0, p2_x1, p2_y, p1_y, true);  // Rear wall
addRectZ(p2_z1, p2_x0, p2_x1, p2_y, p1_y, false); // Front wall

// H. Interior Ledge 2 at Y = p2_y (Uneven Step between Tier 2 and Deepest Tier 3)
addRectY(p2_y, p2_x0, p3_x0, p2_z0, p2_z1, true); // Narrow left ledge
addRectY(p2_y, p3_x1, p2_x1, p2_z0, p2_z1, true); // Broad right shelf
addRectY(p2_y, p3_x0, p3_x1, p2_z0, p3_z0, true); // Rear ledge
addRectY(p2_y, p3_x0, p3_x1, p3_z1, p2_z1, true); // Front ledge

// I. Cavity Tier 3: Deepest Pocket Walls (down to solid floor at Y = p3_y)
addRectX(p3_x0, p3_y, p2_y, p3_z0, p3_z1, true);  // Left wall
addRectX(p3_x1, p3_y, p2_y, p3_z0, p3_z1, false); // Right wall
addRectZ(p3_z0, p3_x0, p3_x1, p3_y, p2_y, true);  // Rear wall
addRectZ(p3_z1, p3_x0, p3_x1, p3_y, p2_y, false); // Front wall

// J. Deepest Cavity Solid Floor at Y = p3_y
addRectY(p3_y, p3_x0, p3_x1, p3_z0, p3_z1, true);

// --- 4. ASSEMBLE THREE.JS BUFFER GEOMETRY & MATERIAL ---

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

// Premium CAD shaded solid material
const cadMaterial = new THREE.MeshStandardMaterial({
  color: 0xc4cdd5,
  roughness: 0.3,
  metalness: 0.25,
  side: THREE.DoubleSide
});

const cadMesh = new THREE.Mesh(geometry, cadMaterial);

// Sharp feature edge outlines for clean CAD engineering aesthetics
const edgesGeo = new THREE.EdgesGeometry(geometry, 25);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x1f2937,
  linewidth: 1.5
});
const wireframeEdges = new THREE.LineSegments(edgesGeo, lineMaterial);

// Group parts together and add to scene
const cadModelGroup = new THREE.Group();
cadModelGroup.add(cadMesh);
cadModelGroup.add(wireframeEdges);
scene.add(cadModelGroup);

// --- 5. CAMERA ORIENTATION ---
// Elevated perspective clearly highlighting nested tiers, asymmetric shelf, and side feature
camera.position.set(135, 115, 125);
camera.lookAt(5, 25, 0);
if (controls) {
  controls.target.set(5, 25, 0);
  controls.update();
}
```