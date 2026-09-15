// ====================================================================
// PARAMETRIC CAD MODEL: Solid Base Block with Stepped Cut Features
// ====================================================================
// Description:
//   A single solid mechanical block featuring:
//   1. Paired circular blind bores (separate round profiles, smooth curves)
//   2. A rectangular side recess (notch open to the side face)
//   3. Stepped interior depths: the rectangular recess floor is at Y = 24,
//      and the circular removals reach deeper to Y = 14, creating distinct
//      stepped interior faces within the block.
// ====================================================================

// --- 1. PARAMETERS & DIMENSIONS ---
// Overall block bounding envelope
const blockWidth = 120;       // Total length along X axis
const blockDepth = 70;        // Total width along Z axis
const blockHeight = 40;       // Total vertical height along Y axis

// Stepped interior depth elevations (along Y)
const floorHolesY = 14;       // Elevation of the circular cuts' floor (depth = 26mm)
const floorRecessY = 24;      // Elevation of the rectangular recess floor (depth = 16mm)

// Paired circular cutouts parameters
const holeRadius = 11;        // Radius of each round cutout
const holeCenterX = -30;      // X center position for both holes
const holeCenterZ1 = -16;     // Z center position for hole 1
const holeCenterZ2 = 16;      // Z center position for hole 2
const holeCurveSegments = 48; // Segment count for smooth cylindrical curvature

// Rectangular side recess parameters
const recessStartX = 12;      // Recess inner boundary along X (cuts to +blockWidth/2)
const recessHalfZ = 22;       // Half-span along Z (recess spans from -22 to +22)

// Derived half-dimensions for centering
const halfW = blockWidth / 2; // 60
const halfD = blockDepth / 2; // 35

// --- 2. LAYER SLICE DEFINITIONS (Extruded Sections) ---
// The solid block is partitioned into 3 vertically continuous layers
// so all cuts and stepped interior floors are created with exact geometry.

// Extrusion settings helper
const extrudeOpts = (depth, segments = 16) => ({
  depth: depth,
  bevelEnabled: false,
  curveSegments: segments
});

// Helper to orient extruded shapes from local Z to world +Y
function orientLayer(geometry, yElevation) {
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, yElevation, 0);
}

// --------------------------------------------------------------------
// SLICE 1: Solid Base (Y: 0 -> floorHolesY)
// Uncut solid material beneath all features.
// --------------------------------------------------------------------
const shape1 = new THREE.Shape();
shape1.moveTo(-halfW, halfD);
shape1.lineTo(-halfW, -halfD);
shape1.lineTo(halfW, -halfD);
shape1.lineTo(halfW, halfD);
shape1.closePath();

const geom1 = new THREE.ExtrudeGeometry(shape1, extrudeOpts(floorHolesY));
orientLayer(geom1, 0);

// --------------------------------------------------------------------
// SLICE 2: Intermediate Layer (Y: floorHolesY -> floorRecessY)
// Contains the paired circular cutouts. Its top face at the +X side
// forms the stepped floor of the rectangular side recess.
// --------------------------------------------------------------------
const shape2 = new THREE.Shape();
shape2.moveTo(-halfW, halfD);
shape2.lineTo(-halfW, -halfD);
shape2.lineTo(halfW, -halfD);
shape2.lineTo(halfW, halfD);
shape2.closePath();

// Paired circular removals (separate round profiles, clockwise winding for holes)
const hole2_1 = new THREE.Path();
hole2_1.absarc(holeCenterX, -holeCenterZ1, holeRadius, 0, Math.PI * 2, true);
shape2.holes.push(hole2_1);

const hole2_2 = new THREE.Path();
hole2_2.absarc(holeCenterX, -holeCenterZ2, holeRadius, 0, Math.PI * 2, true);
shape2.holes.push(hole2_2);

const thickness2 = floorRecessY - floorHolesY;
const geom2 = new THREE.ExtrudeGeometry(shape2, extrudeOpts(thickness2, holeCurveSegments));
orientLayer(geom2, floorHolesY);

// --------------------------------------------------------------------
// SLICE 3: Top Layer (Y: floorRecessY -> blockHeight)
// Contains both the paired circular cutouts AND the rectangular side recess.
// The outer boundary notches inward on the +X face.
// --------------------------------------------------------------------
const shape3 = new THREE.Shape();
// Perimeter with rectangular side recess cut out on the +X side
shape3.moveTo(-halfW, halfD);
shape3.lineTo(-halfW, -halfD);
shape3.lineTo(halfW, -halfD);
shape3.lineTo(halfW, -recessHalfZ);
shape3.lineTo(recessStartX, -recessHalfZ); // Inner recess wall
shape3.lineTo(recessStartX, recessHalfZ);  // Inner recess floor span
shape3.lineTo(halfW, recessHalfZ);         // Exit recess to outer edge
shape3.lineTo(halfW, halfD);
shape3.closePath();

// Paired circular removals continuing through the top surface
const hole3_1 = new THREE.Path();
hole3_1.absarc(holeCenterX, -holeCenterZ1, holeRadius, 0, Math.PI * 2, true);
shape3.holes.push(hole3_1);

const hole3_2 = new THREE.Path();
hole3_2.absarc(holeCenterX, -holeCenterZ2, holeRadius, 0, Math.PI * 2, true);
shape3.holes.push(hole3_2);

const thickness3 = blockHeight - floorRecessY;
const geom3 = new THREE.ExtrudeGeometry(shape3, extrudeOpts(thickness3, holeCurveSegments));
orientLayer(geom3, floorRecessY);

// --- 3. MERGE SLICES INTO A SINGLE SOLID CAD GEOMETRY ---
function mergeGeometries(geometries) {
  let totalPos = 0;
  let totalIdx = 0;

  for (const g of geometries) {
    totalPos += g.attributes.position.count;
    if (g.index) totalIdx += g.index.count;
  }

  const posArray = new Float32Array(totalPos * 3);
  const normArray = new Float32Array(totalPos * 3);
  const uvArray = new Float32Array(totalPos * 2);
  const idxArray = totalPos > 65535 ? new Uint32Array(totalIdx) : new Uint16Array(totalIdx);

  let pOffset = 0;
  let iOffset = 0;

  for (const g of geometries) {
    const pos = g.attributes.position;
    const norm = g.attributes.normal;
    const uv = g.attributes.uv;

    posArray.set(pos.array, pOffset * 3);
    if (norm) normArray.set(norm.array, pOffset * 3);
    if (uv) uvArray.set(uv.array, pOffset * 2);

    if (g.index) {
      const idx = g.index;
      for (let i = 0; i < idx.count; i++) {
        idxArray[iOffset + i] = idx.array[i] + pOffset;
      }
      iOffset += idx.count;
    }

    pOffset += pos.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normArray, 3));
  merged.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
  merged.setIndex(new THREE.BufferAttribute(idxArray, 1));
  return merged;
}

const cadGeometry = mergeGeometries([geom1, geom2, geom3]);

// Clean up individual temporary slice geometries
geom1.dispose();
geom2.dispose();
geom3.dispose();

// --- 4. MATERIAL & MESH CREATION ---
// Industrial machined-metal appearance with smooth normal interpolation
const cadMaterial = new THREE.MeshStandardMaterial({
  color: 0x5a6e82,        // Slate CAD blue-gray
  metalness: 0.35,        // Mild metallic reflection
  roughness: 0.3,         // Satin machined surface
  flatShading: false      // Smooth curves on circular cylindrical walls
});

const blockMesh = new THREE.Mesh(cadGeometry, cadMaterial);
blockMesh.castShadow = true;
blockMesh.receiveShadow = true;
scene.add(blockMesh);

// --- 5. CAMERA ORIENTATION ---
// Position camera at an isometric angle clearly showing top face,
// the stepped floor of the rectangular recess, and down into both circular bores
camera.position.set(110, 95, 120);
camera.lookAt(0, 18, 0);

if (typeof controls !== 'undefined' && controls && controls.target) {
  controls.target.set(0, 18, 0);
  controls.update();
}