// ============================================================================
// CAD MODEL: Slotted Arched Bearing Mount / Pillow Block
// Parametric Three.js Reconstruction
// ============================================================================

// ----------------------------------------------------------------------------
// 1. PARAMETERS & DIMENSIONS
// ----------------------------------------------------------------------------

// Main Base Parameters
const BASE_LENGTH = 0.75;
const BASE_WIDTH = 0.249991; // ~0.25
const BASE_HEIGHT = 0.08333; // extrusion depth from Y=0 datum
const BASE_RADIUS = BASE_WIDTH / 2; // 0.125 semicircular ends

// Base Circular Openings (Mounting Holes)
const HOLE_RADIUS = 0.0417;
const HOLE1_X = 0.1254;
const HOLE2_X = 0.6254;
const HOLE_Z = 0.125; // on width centerline

// Upper Body Envelope Reference
const UPPER_OFFSET_X = 0.2168;
const UPPER_LENGTH = 0.333321;
const UPPER_OFFSET_Z = 0.046;
const UPPER_WIDTH = 0.166661;
const UPPER_TOP_Y = 0.2008; // datum top level for central body & right collar

// Left Collar / High Rounded Boss
const LEFT_COLLAR_LENGTH = 0.0558;
const LEFT_COLLAR_WIDTH = 0.1667;
const LEFT_COLLAR_OFFSET_X = 0.2168;
const LEFT_COLLAR_OFFSET_Z = 0.0459;
const LEFT_COLLAR_TOP_Y = 0.2843; // reaches higher top level
const LEFT_COLLAR_RADIUS = LEFT_COLLAR_WIDTH / 2; // 0.08335

// Right Collar / Lower Rounded Boss
const RIGHT_COLLAR_LENGTH = 0.0558;
const RIGHT_COLLAR_WIDTH = 0.1664;
const RIGHT_COLLAR_OFFSET_X = 0.4943;
const RIGHT_COLLAR_OFFSET_Z = 0.0461;
const RIGHT_COLLAR_TOP_Y = 0.2008;

// Arched Clearance Cut (Underside Tunnel)
const ARCH_CUT_LENGTH = 0.2225;
const ARCH_CUT_OFFSET_X = 0.2722;
const ARCH_BASE_Y = 0.0896;
const ARCH_TOP_Y = 0.2008;
const ARCH_RADIUS = ARCH_CUT_LENGTH / 2; // 0.11125
const ARCH_CENTER_X = ARCH_CUT_OFFSET_X + ARCH_RADIUS; // 0.38345

// Longitudinal Top Slot / Cylindrical Bore
const SLOT_RADIUS = 0.0418;
const SLOT_CENTER_Z = 0.1294;
const SLOT_Y_MIN = 0.1838;
const SLOT_Y_MAX = 0.2674;
const SLOT_CENTER_Y = (SLOT_Y_MIN + SLOT_Y_MAX) / 2; // 0.2256

// Shared Material (Machined Satin Metal)
const material = new THREE.MeshStandardMaterial({
  color: 0x8fa8b8,
  metalness: 0.55,
  roughness: 0.35,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
});

// Group to hold all CAD solid components
const cadModel = new THREE.Group();

// ----------------------------------------------------------------------------
// 2. BASE SOLID (Rounded-Ended Base Plate with 2 Through Holes)
// ----------------------------------------------------------------------------

const baseShape = new THREE.Shape();
const xLeftCenter = BASE_RADIUS;
const xRightCenter = BASE_LENGTH - BASE_RADIUS;

// Semicircular rounded ends profile in local (X, Z) plane
baseShape.moveTo(xLeftCenter, 0);
baseShape.lineTo(xRightCenter, 0);
baseShape.absarc(xRightCenter, BASE_RADIUS, BASE_RADIUS, -Math.PI / 2, Math.PI / 2, false);
baseShape.lineTo(xLeftCenter, BASE_WIDTH);
baseShape.absarc(xLeftCenter, BASE_RADIUS, BASE_RADIUS, Math.PI / 2, (3 * Math.PI) / 2, false);

// Hole 1 (Left through opening)
const holePath1 = new THREE.Path();
holePath1.absarc(HOLE1_X, HOLE_Z, HOLE_RADIUS, 0, Math.PI * 2, true);
baseShape.holes.push(holePath1);

// Hole 2 (Right through opening)
const holePath2 = new THREE.Path();
holePath2.absarc(HOLE2_X, HOLE_Z, HOLE_RADIUS, 0, Math.PI * 2, true);
baseShape.holes.push(holePath2);

const baseGeometry = new THREE.ExtrudeGeometry(baseShape, {
  depth: BASE_HEIGHT,
  bevelEnabled: false,
  curveSegments: 36
});

// Map extrusion along +Z into +Y (height datum)
const basePos = baseGeometry.attributes.position;
for (let i = 0; i < basePos.count; i++) {
  const x = basePos.getX(i);
  const z = basePos.getY(i);
  const y = basePos.getZ(i);
  basePos.setXYZ(i, x, y, z);
}
// Flip index winding to keep normals facing outward
const baseIdx = baseGeometry.index;
for (let i = 0; i < baseIdx.count; i += 3) {
  const tmp = baseIdx.getX(i);
  baseIdx.setX(i, baseIdx.getX(i + 1));
  baseIdx.setX(i + 1, tmp);
}
baseGeometry.computeVertexNormals();

const baseMesh = new THREE.Mesh(baseGeometry, material);
cadModel.add(baseMesh);

// ----------------------------------------------------------------------------
// 3. LEFT ROUNDED END / COLLAR SOLID (Enclosed Sleeve with Bore)
// ----------------------------------------------------------------------------

const leftShape = new THREE.Shape();
const lz1 = LEFT_COLLAR_OFFSET_Z;
const lz2 = LEFT_COLLAR_OFFSET_Z + LEFT_COLLAR_WIDTH;
const lzMid = (lz1 + lz2) / 2; // 0.12925

leftShape.moveTo(lz1, BASE_HEIGHT);
leftShape.lineTo(lz2, BASE_HEIGHT);
leftShape.lineTo(lz2, UPPER_TOP_Y);
leftShape.absarc(lzMid, UPPER_TOP_Y, LEFT_COLLAR_RADIUS, 0, Math.PI, false);
leftShape.lineTo(lz1, BASE_HEIGHT);

// Circular slot profile through opening
const leftBore = new THREE.Path();
leftBore.absarc(SLOT_CENTER_Z, SLOT_CENTER_Y, SLOT_RADIUS, 0, Math.PI * 2, true);
leftShape.holes.push(leftBore);

const leftCollarGeom = new THREE.ExtrudeGeometry(leftShape, {
  depth: LEFT_COLLAR_LENGTH,
  bevelEnabled: false,
  curveSegments: 36
});

// Map local (Z, Y, X_depth) to World (X, Y, Z)
const leftPos = leftCollarGeom.attributes.position;
for (let i = 0; i < leftPos.count; i++) {
  const zCoord = leftPos.getX(i);
  const yCoord = leftPos.getY(i);
  const xCoord = leftPos.getZ(i) + LEFT_COLLAR_OFFSET_X;
  leftPos.setXYZ(i, xCoord, yCoord, zCoord);
}
const leftIdx = leftCollarGeom.index;
for (let i = 0; i < leftIdx.count; i += 3) {
  const tmp = leftIdx.getX(i);
  leftIdx.setX(i, leftIdx.getX(i + 1));
  leftIdx.setX(i + 1, tmp);
}
leftCollarGeom.computeVertexNormals();

const leftCollarMesh = new THREE.Mesh(leftCollarGeom, material);
cadModel.add(leftCollarMesh);

// ----------------------------------------------------------------------------
// 4. RIGHT LOWER-HEIGHT COLLAR SOLID (Slotted Cradle at Level 0.2008)
// ----------------------------------------------------------------------------

// Calculate intersection between cradle circle and top boundary Y = 0.2008
const deltaY = UPPER_TOP_Y - SLOT_CENTER_Y; // 0.2008 - 0.2256 = -0.0248
const deltaZ = Math.sqrt(Math.max(0, SLOT_RADIUS * SLOT_RADIUS - deltaY * deltaY));
const zCutLeft = SLOT_CENTER_Z - deltaZ;   // ~0.09575
const zCutRight = SLOT_CENTER_Z + deltaZ;  // ~0.16305

const rightShape = new THREE.Shape();
const rz1 = RIGHT_COLLAR_OFFSET_Z;
const rz2 = RIGHT_COLLAR_OFFSET_Z + RIGHT_COLLAR_WIDTH;

const angleRight = Math.atan2(deltaY, deltaZ);
const angleLeft = Math.atan2(deltaY, -deltaZ);

rightShape.moveTo(rz1, BASE_HEIGHT);
rightShape.lineTo(rz2, BASE_HEIGHT);
rightShape.lineTo(rz2, RIGHT_COLLAR_TOP_Y);
rightShape.lineTo(zCutRight, RIGHT_COLLAR_TOP_Y);
// Circular trough arc dipping down to Y = 0.1838
rightShape.absarc(SLOT_CENTER_Z, SLOT_CENTER_Y, SLOT_RADIUS, angleRight, angleLeft, true);
rightShape.lineTo(rz1, RIGHT_COLLAR_TOP_Y);
rightShape.lineTo(rz1, BASE_HEIGHT);

const rightCollarGeom = new THREE.ExtrudeGeometry(rightShape, {
  depth: RIGHT_COLLAR_LENGTH,
  bevelEnabled: false,
  curveSegments: 36
});

const rightPos = rightCollarGeom.attributes.position;
for (let i = 0; i < rightPos.count; i++) {
  const zCoord = rightPos.getX(i);
  const yCoord = rightPos.getY(i);
  const xCoord = rightPos.getZ(i) + RIGHT_COLLAR_OFFSET_X;
  rightPos.setXYZ(i, xCoord, yCoord, zCoord);
}
const rightIdx = rightCollarGeom.index;
for (let i = 0; i < rightIdx.count; i += 3) {
  const tmp = rightIdx.getX(i);
  rightIdx.setX(i, rightIdx.getX(i + 1));
  rightIdx.setX(i + 1, tmp);
}
rightCollarGeom.computeVertexNormals();

const rightCollarMesh = new THREE.Mesh(rightCollarGeom, material);
cadModel.add(rightCollarMesh);

// ----------------------------------------------------------------------------
// 5. CENTRAL ARCHED BRIDGE (Front & Back Sidewalls)
// ----------------------------------------------------------------------------

const bridgeStartX = LEFT_COLLAR_OFFSET_X + LEFT_COLLAR_LENGTH; // 0.2726
const bridgeEndX = RIGHT_COLLAR_OFFSET_X;                       // 0.4943

// Profile of the arched clearance cut in the (X, Y) plane
const dxLeft = bridgeStartX - ARCH_CENTER_X;
const dxRight = bridgeEndX - ARCH_CENTER_X;
const dyArchEnds = Math.sqrt(Math.max(0, ARCH_RADIUS * ARCH_RADIUS - dxLeft * dxLeft));
const archAngleRight = Math.atan2(dyArchEnds, dxRight);
const archAngleLeft = Math.atan2(dyArchEnds, dxLeft);

const bridgeWallShape = new THREE.Shape();
bridgeWallShape.moveTo(bridgeStartX, UPPER_TOP_Y);
bridgeWallShape.lineTo(bridgeEndX, UPPER_TOP_Y);
bridgeWallShape.lineTo(bridgeEndX, ARCH_BASE_Y + dyArchEnds);
bridgeWallShape.absarc(ARCH_CENTER_X, ARCH_BASE_Y, ARCH_RADIUS, archAngleRight, archAngleLeft, false);
bridgeWallShape.lineTo(bridgeStartX, UPPER_TOP_Y);

// Front sidewall
const frontWallThickness = zCutLeft - UPPER_OFFSET_Z;
const frontWallGeom = new THREE.ExtrudeGeometry(bridgeWallShape, {
  depth: frontWallThickness,
  bevelEnabled: false,
  curveSegments: 36
});
frontWallGeom.translate(0, 0, UPPER_OFFSET_Z);
const frontWallMesh = new THREE.Mesh(frontWallGeom, material);
cadModel.add(frontWallMesh);

// Back sidewall
const backWallThickness = (UPPER_OFFSET_Z + UPPER_WIDTH) - zCutRight;
const backWallGeom = new THREE.ExtrudeGeometry(bridgeWallShape, {
  depth: backWallThickness,
  bevelEnabled: false,
  curveSegments: 36
});
backWallGeom.translate(0, 0, zCutRight);
const backWallMesh = new THREE.Mesh(backWallGeom, material);
cadModel.add(backWallMesh);

// ----------------------------------------------------------------------------
// 6. CONNECTING TROUGH WEBS (Transitions between Arch and Top Slot)
// ----------------------------------------------------------------------------

// Calculate where slot bottom Y=0.1838 intersects clearance arch Y_arch
const deltaYArchCut = SLOT_Y_MIN - ARCH_BASE_Y; // 0.1838 - 0.0896 = 0.0942
const deltaXArchBreak = Math.sqrt(Math.max(0, ARCH_RADIUS * ARCH_RADIUS - deltaYArchCut * deltaYArchCut));
const xBreakLeft = ARCH_CENTER_X - deltaXArchBreak;  // ~0.3243
const xBreakRight = ARCH_CENTER_X + deltaXArchBreak; // ~0.4426

function buildTroughWeb(xStart, xEnd, nx = 12, nz = 12) {
  const positions = [];
  const indices = [];

  for (let i = 0; i <= nx; i++) {
    const u = i / nx;
    const x = xStart + u * (xEnd - xStart);
    const dx = x - ARCH_CENTER_X;
    const yArch = ARCH_BASE_Y + Math.sqrt(Math.max(0, ARCH_RADIUS * ARCH_RADIUS - dx * dx));

    for (let j = 0; j <= nz; j++) {
      const v = j / nz;
      const z = zCutLeft + v * (zCutRight - zCutLeft);
      const dz = z - SLOT_CENTER_Z;
      const dySlot = Math.sqrt(Math.max(0, SLOT_RADIUS * SLOT_RADIUS - dz * dz));
      const ySlot = SLOT_CENTER_Y - dySlot;
      const yTop = Math.max(yArch, ySlot);

      positions.push(x, yTop, z);
      positions.push(x, yArch, z);
    }
  }

  const stride = nz + 1;
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      const t00 = 2 * (i * stride + j);
      const t01 = 2 * (i * stride + j + 1);
      const t10 = 2 * ((i + 1) * stride + j);
      const t11 = 2 * ((i + 1) * stride + j + 1);

      const b00 = t00 + 1;
      const b01 = t01 + 1;
      const b10 = t10 + 1;
      const b11 = t11 + 1;

      // Top surface
      indices.push(t00, t10, t01);
      indices.push(t01, t10, t11);

      // Underside arch surface
      indices.push(b00, b01, b10);
      indices.push(b01, b11, b10);

      // Boundary cap at start
      if (i === 0) {
        indices.push(t00, b00, t01);
        indices.push(t01, b00, b01);
      }
      // Boundary cap at end
      if (i === nx - 1) {
        indices.push(t10, t11, b10);
        indices.push(t11, b11, b10);
      }
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

// Left connecting trough web
const leftWebGeom = buildTroughWeb(bridgeStartX, xBreakLeft);
cadModel.add(new THREE.Mesh(leftWebGeom, material));

// Right connecting trough web
const rightWebGeom = buildTroughWeb(xBreakRight, bridgeEndX);
cadModel.add(new THREE.Mesh(rightWebGeom, material));

// ----------------------------------------------------------------------------
// 7. ASSEMBLY, POSITIONING & CAMERA SETUP
// ----------------------------------------------------------------------------

// Center the entire assembly at the origin in X and Z, resting on datum Y=0
cadModel.position.set(-BASE_LENGTH / 2, 0, -BASE_WIDTH / 2);
scene.add(cadModel);

// Adjust camera for a clear, isometric engineering overview
camera.position.set(0.65, 0.45, 0.6);
camera.lookAt(0, 0.12, 0);