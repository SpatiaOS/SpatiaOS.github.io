// Parametric interpretation: a silver piston with ring grooves, a visible wrist-pin boss,
// and a long open-web connecting rod with a split big-end bearing and bolts.
// Y is vertical. The rod/big-end plane is yawed slightly to match the isometric reference.

const cylinderSegments = 96;
const rodYaw = Math.PI / 7.5;

// Main dimensions
const pistonRadius = 5.0;
const pistonHeight = 5.8;
const pistonTopY = 14.0;
const pistonBottomY = pistonTopY - pistonHeight;
const pistonCenterY = (pistonTopY + pistonBottomY) / 2;

const rodDepth = 0.90;
const bigEndDepth = 1.10;
const bigEndCenterY = -14.0;
const bigEndOuterRadius = 3.05;
const bigEndInnerRadius = 1.75;

// Materials
const pistonMaterial = new THREE.MeshStandardMaterial({
  color: 0xbfc2c7,
  metalness: 0.12,
  roughness: 0.38,
  side: THREE.DoubleSide
});

const darkerMetalMaterial = new THREE.MeshStandardMaterial({
  color: 0x8d9299,
  metalness: 0.10,
  roughness: 0.45,
  side: THREE.DoubleSide
});

const lightMetalMaterial = new THREE.MeshStandardMaterial({
  color: 0xd2d4d7,
  metalness: 0.10,
  roughness: 0.34,
  side: THREE.DoubleSide
});

const darkLineMaterial = new THREE.MeshStandardMaterial({
  color: 0x151515,
  metalness: 0.02,
  roughness: 0.62,
  side: THREE.DoubleSide
});

const recessMaterial = new THREE.MeshStandardMaterial({
  color: 0x9da1a6,
  metalness: 0.08,
  roughness: 0.50,
  side: THREE.DoubleSide
});

const boltMaterial = new THREE.MeshStandardMaterial({
  color: 0xa9adb3,
  metalness: 0.18,
  roughness: 0.36,
  side: THREE.DoubleSide
});

// Orientation helpers for the yawed connecting-rod plane
const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),
  rodYaw
);

const cylinderYToLocalZQuaternion = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(1, 0, 0),
  Math.PI / 2
);

function localToWorld(x, y, z) {
  return new THREE.Vector3(x, y, z).applyQuaternion(yawQuaternion);
}

function addBoxLocal(width, height, depth, x, y, z, material, rotZ) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(localToWorld(x, y, z));

  const zQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    rotZ || 0
  );

  mesh.quaternion.copy(yawQuaternion).multiply(zQuaternion);
  scene.add(mesh);
  return mesh;
}

function addFlatBarLocal(x1, y1, x2, y2, width, depth, material, localZ) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = -Math.atan2(dx, dy);

  return addBoxLocal(
    width,
    length,
    depth,
    (x1 + x2) / 2,
    (y1 + y2) / 2,
    localZ || 0,
    material,
    angle
  );
}

function addCylinderWorldY(radiusTop, radiusBottom, height, x, y, z, material, segments) {
  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    segments || 64,
    1
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

function addTorusWorldY(majorRadius, tubeRadius, x, y, z, material, tubularSegments) {
  const geometry = new THREE.TorusGeometry(
    majorRadius,
    tubeRadius,
    10,
    tubularSegments || 128
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

function addCylinderLocalZ(radius, length, x, y, z, material, segments) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    length,
    segments || 48,
    1
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(localToWorld(x, y, z));
  mesh.quaternion.copy(yawQuaternion).multiply(cylinderYToLocalZQuaternion);
  scene.add(mesh);
  return mesh;
}

function addVerticalCylinderLocal(radius, height, x, y, z, material, segments) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    segments || 32,
    1
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(localToWorld(x, y, z));
  mesh.quaternion.copy(yawQuaternion);
  scene.add(mesh);
  return mesh;
}

function addTorusLocalZ(majorRadius, tubeRadius, x, y, z, material, tubularSegments) {
  const geometry = new THREE.TorusGeometry(
    majorRadius,
    tubeRadius,
    10,
    tubularSegments || 128
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(localToWorld(x, y, z));
  mesh.quaternion.copy(yawQuaternion);
  scene.add(mesh);
  return mesh;
}

function addAnnulusLocal(outerRadius, innerRadius, depth, x, y, z, material, segments) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: false,
    curveSegments: segments || 96,
    steps: 1
  });

  geometry.translate(0, 0, -depth / 2);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(localToWorld(x, y, z));
  mesh.quaternion.copy(yawQuaternion);
  scene.add(mesh);
  return mesh;
}

// -------------------- Piston --------------------
const pistonGeometry = new THREE.CylinderGeometry(
  pistonRadius,
  pistonRadius * 0.99,
  pistonHeight,
  cylinderSegments,
  4
);
const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
piston.position.set(0, pistonCenterY, 0);
scene.add(piston);

// Top and bottom rim outlines
addTorusWorldY(pistonRadius + 0.01, 0.035, 0, pistonTopY + 0.01, 0, darkLineMaterial);
addTorusWorldY(pistonRadius * 0.99 + 0.01, 0.035, 0, pistonBottomY + 0.05, 0, darkLineMaterial);

// Piston crown lower seam
addTorusWorldY(pistonRadius + 0.015, 0.026, 0, pistonTopY - 1.08, 0, darkLineMaterial);

// Ring pack: several close black grooves around the upper skirt
const grooveStartY = pistonTopY - 1.45;
const grooveSpacing = 0.18;
for (let i = 0; i < 7; i++) {
  addTorusWorldY(
    pistonRadius + 0.018,
    0.022,
    0,
    grooveStartY - i * grooveSpacing,
    0,
    darkLineMaterial,
    128
  );
}

// Lower skirt grooves / oil-control band near the bottom
const lowerGrooveYs = [
  pistonBottomY + 0.32,
  pistonBottomY + 0.52,
  pistonBottomY + 0.76
];

for (let i = 0; i < lowerGrooveYs.length; i++) {
  addTorusWorldY(
    pistonRadius * 0.99 + 0.018,
    0.024,
    0,
    lowerGrooveYs[i],
    0,
    darkLineMaterial,
    128
  );
}

// Shallow circular depression on piston crown
const topRecessRadius = 0.78;
const topRecessX = 0.38;
const topRecessZ = 0.18;
addCylinderWorldY(
  topRecessRadius,
  topRecessRadius,
  0.045,
  topRecessX,
  pistonTopY + 0.027,
  topRecessZ,
  recessMaterial,
  72
);
addTorusWorldY(
  topRecessRadius,
  0.026,
  topRecessX,
  pistonTopY + 0.058,
  topRecessZ,
  darkLineMaterial,
  96
);

// Wrist-pin boss on the visible side of the piston, aligned with the rod plane
const pinBossRadius = 1.24;
const pinHoleRadius = 0.57;
const pinBossDepth = 0.92;
const pinBossY = pistonBottomY + 2.25;
const pinBossCenterZ = pistonRadius + pinBossDepth / 2 - 0.12;
const pinBossFaceZ = pistonRadius + pinBossDepth - 0.08;

addCylinderLocalZ(
  pinBossRadius,
  pinBossDepth,
  0,
  pinBossY,
  pinBossCenterZ,
  pistonMaterial,
  72
);

addCylinderLocalZ(
  pinHoleRadius,
  0.07,
  0,
  pinBossY,
  pinBossFaceZ + 0.035,
  darkLineMaterial,
  64
);

addTorusLocalZ(
  pinBossRadius,
  0.034,
  0,
  pinBossY,
  pinBossFaceZ + 0.07,
  darkLineMaterial,
  96
);

addTorusLocalZ(
  pinHoleRadius,
  0.045,
  0,
  pinBossY,
  pinBossFaceZ + 0.08,
  darkLineMaterial,
  96
);

// -------------------- Connecting rod shank --------------------
const rodTopY = pistonBottomY - 0.10;
const shankBottomY = bigEndCenterY + bigEndOuterRadius + 0.18;
const topHalfWidth = 0.62;
const bottomHalfWidth = 1.70;

// Small rectangular neck disappearing into the piston underside
addBoxLocal(
  1.18,
  2.60,
  rodDepth * 0.92,
  0,
  pistonBottomY - 1.15,
  0,
  pistonMaterial,
  0
);

addBoxLocal(
  0.055,
  2.40,
  0.050,
  0,
  pistonBottomY - 1.15,
  rodDepth / 2 + 0.040,
  darkLineMaterial,
  0
);

// Tapered side flanges of the rod
addFlatBarLocal(
  -topHalfWidth,
  rodTopY,
  -bottomHalfWidth,
  shankBottomY,
  0.56,
  rodDepth,
  pistonMaterial,
  0
);

addFlatBarLocal(
  topHalfWidth,
  rodTopY,
  bottomHalfWidth,
  shankBottomY,
  0.56,
  rodDepth,
  pistonMaterial,
  0
);

// Inner web and diagonal triangular bracing
addFlatBarLocal(
  0.0,
  rodTopY - 0.8,
  0.0,
  shankBottomY + 0.8,
  0.20,
  rodDepth * 0.62,
  lightMetalMaterial,
  0
);

addFlatBarLocal(
  -0.28,
  rodTopY - 2.00,
  0.86,
  2.15,
  0.25,
  rodDepth * 0.64,
  pistonMaterial,
  0
);

addFlatBarLocal(
  0.86,
  2.15,
  -0.88,
  -3.50,
  0.25,
  rodDepth * 0.64,
  pistonMaterial,
  0
);

addFlatBarLocal(
  -0.88,
  -3.50,
  1.18,
  shankBottomY + 1.18,
  0.25,
  rodDepth * 0.64,
  pistonMaterial,
  0
);

// Flared shoulders into the big end
addFlatBarLocal(
  -bottomHalfWidth,
  shankBottomY + 0.15,
  -2.35,
  bigEndCenterY + 1.72,
  0.66,
  rodDepth,
  pistonMaterial,
  0
);

addFlatBarLocal(
  bottomHalfWidth,
  shankBottomY + 0.15,
  2.35,
  bigEndCenterY + 1.72,
  0.66,
  rodDepth,
  pistonMaterial,
  0
);

// -------------------- Big-end bearing --------------------
addAnnulusLocal(
  bigEndOuterRadius,
  bigEndInnerRadius,
  bigEndDepth,
  0,
  bigEndCenterY,
  0,
  pistonMaterial,
  128
);

// Front bearing insert / stepped inner bore
const bearingOuterRadius = bigEndInnerRadius + 0.58;
const bearingInnerRadius = bigEndInnerRadius * 0.88;
addAnnulusLocal(
  bearingOuterRadius,
  bearingInnerRadius,
  0.10,
  0,
  bigEndCenterY,
  bigEndDepth / 2 + 0.065,
  lightMetalMaterial,
  128
);

// Dark circular outlines on bearing face
addTorusLocalZ(
  bigEndOuterRadius,
  0.035,
  0,
  bigEndCenterY,
  bigEndDepth / 2 + 0.075,
  darkLineMaterial,
  128
);

addTorusLocalZ(
  bigEndInnerRadius,
  0.035,
  0,
  bigEndCenterY,
  bigEndDepth / 2 + 0.080,
  darkLineMaterial,
  128
);

addTorusLocalZ(
  bearingInnerRadius,
  0.030,
  0,
  bigEndCenterY,
  bigEndDepth / 2 + 0.135,
  darkLineMaterial,
  128
);

// Split cap and side lugs
const capBlockX = bigEndOuterRadius + 0.58;
const capBlockHeight = 4.20;
const capBlockWidth = 0.95;
const capBlockCenterY = bigEndCenterY - 0.85;

addBoxLocal(
  capBlockWidth,
  capBlockHeight,
  bigEndDepth * 1.08,
  -capBlockX,
  capBlockCenterY,
  0,
  pistonMaterial,
  0
);

addBoxLocal(
  capBlockWidth,
  capBlockHeight,
  bigEndDepth * 1.08,
  capBlockX,
  capBlockCenterY,
  0,
  pistonMaterial,
  0
);

// Lower removable cap block
addBoxLocal(
  bigEndOuterRadius * 2.18,
  0.72,
  bigEndDepth * 1.06,
  0,
  bigEndCenterY - bigEndOuterRadius + 0.38,
  0,
  pistonMaterial,
  0
);

// Split line on front face, broken around the central bore
const frontZ = bigEndDepth / 2 + 0.085;
const splitLineY = bigEndCenterY - 1.08;
addBoxLocal(
  1.45,
  0.055,
  0.050,
  -2.30,
  splitLineY,
  frontZ,
  darkLineMaterial,
  0
);
addBoxLocal(
  1.45,
  0.055,
  0.050,
  2.30,
  splitLineY,
  frontZ,
  darkLineMaterial,
  0
);

// Bolts and hex nuts on both sides of the big-end cap
for (let side = -1; side <= 1; side += 2) {
  const bx = side * capBlockX;
  const boltZ = bigEndDepth / 2 + 0.32;

  // Long front through-bolt/stud
  addVerticalCylinderLocal(
    0.17,
    4.75,
    bx,
    bigEndCenterY - 0.45,
    boltZ,
    boltMaterial,
    20
  );

  // Upper and lower hex nuts
  addVerticalCylinderLocal(
    0.38,
    0.34,
    bx,
    bigEndCenterY + 2.42,
    boltZ,
    boltMaterial,
    6
  );

  addVerticalCylinderLocal(
    0.38,
    0.34,
    bx,
    bigEndCenterY - 3.28,
    boltZ,
    boltMaterial,
    6
  );

  // Washer collars
  addVerticalCylinderLocal(
    0.46,
    0.10,
    bx,
    bigEndCenterY + 2.18,
    boltZ,
    darkerMetalMaterial,
    32
  );

  addVerticalCylinderLocal(
    0.46,
    0.10,
    bx,
    bigEndCenterY - 3.04,
    boltZ,
    darkerMetalMaterial,
    32
  );

  // Hex heads on the front face of the cap blocks
  addCylinderLocalZ(
    0.34,
    0.18,
    bx,
    bigEndCenterY + 1.18,
    bigEndDepth / 2 + 0.13,
    boltMaterial,
    6
  );

  addCylinderLocalZ(
    0.34,
    0.18,
    bx,
    bigEndCenterY - 2.22,
    bigEndDepth / 2 + 0.13,
    boltMaterial,
    6
  );
}

// Camera framing
camera.position.set(24, 18, 32);
camera.lookAt(0, -1.6, 0);