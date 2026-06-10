// Parameters: slim full-size low-profile keyboard interpreted from the image
const keyboardLength = 25.8;
const keyboardDepth = 7.0;
const baseThickness = 0.16;
const baseCornerRadius = 0.30;

const unitX = 1.0;
const unitZ = 0.86;
const keyGapX = 0.18;
const keyGapZ = 0.20;
const keyRim = 0.065;
const keyPlinthHeight = 0.052;
const keyCapHeight = 0.105;
const keyCornerRadius = 0.075;

const baseTopY = baseThickness;
const keyPlinthY = baseTopY + 0.010;
const keyCapY = keyPlinthY + keyPlinthHeight - 0.010;

// Materials: gray body/keys with black geometry used as CAD-like outlines and gaps
const baseMaterial = new THREE.MeshStandardMaterial({
  color: 0x8f9297,
  roughness: 0.62,
  metalness: 0.04
});

const keyMaterial = new THREE.MeshStandardMaterial({
  color: 0xa5a7ab,
  roughness: 0.58,
  metalness: 0.03
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: 0x07080a,
  roughness: 0.75,
  metalness: 0.02
});

const undersideMaterial = new THREE.MeshStandardMaterial({
  color: 0x1b1c20,
  roughness: 0.72,
  metalness: 0.02
});

// Rounded rectangle extrusion helper.
// Width is X, depth is Z, extrusion height is Y after rotation.
function roundedRectShape(width, depth, radius) {
  const r = Math.min(radius, width * 0.5, depth * 0.5);
  const x = -width / 2;
  const y = -depth / 2;
  const shape = new THREE.Shape();

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + depth - r);
  shape.quadraticCurveTo(x + width, y + depth, x + width - r, y + depth);
  shape.lineTo(x + r, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

const roundedGeometryCache = {};

function roundedBoxGeometry(width, depth, height, radius, bevel) {
  const safeBevel = Math.max(0, Math.min(bevel, height * 0.35, width * 0.18, depth * 0.18));
  const key = [
    width.toFixed(3),
    depth.toFixed(3),
    height.toFixed(3),
    radius.toFixed(3),
    safeBevel.toFixed(3)
  ].join("_");

  if (!roundedGeometryCache[key]) {
    const shape = roundedRectShape(width, depth, radius);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      steps: 1,
      bevelEnabled: safeBevel > 0,
      bevelSize: safeBevel,
      bevelThickness: safeBevel,
      bevelSegments: 3,
      curveSegments: 10
    });

    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    roundedGeometryCache[key] = geometry;
  }

  return roundedGeometryCache[key];
}

function addRoundedBox(width, depth, height, radius, material, x, y, z, bevel) {
  const geometry = roundedBoxGeometry(width, depth, height, radius, bevel);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

// Keyboard case: a dark lower plate creates the black perimeter visible in the reference.
addRoundedBox(
  keyboardLength + 0.10,
  keyboardDepth + 0.10,
  0.095,
  baseCornerRadius + 0.04,
  undersideMaterial,
  0,
  -0.055,
  0,
  0.025
);

addRoundedBox(
  keyboardLength,
  keyboardDepth,
  baseThickness,
  baseCornerRadius,
  baseMaterial,
  0,
  0,
  0,
  0.035
);

// Subtle cylindrical front lip/rolled edge, matching the thin curled side profile in the image.
const frontLipRadius = 0.105;
const frontLipGeometry = new THREE.CylinderGeometry(
  frontLipRadius,
  frontLipRadius,
  keyboardLength - 0.55,
  28,
  1
);
frontLipGeometry.rotateZ(Math.PI / 2);
const frontLip = new THREE.Mesh(frontLipGeometry, baseMaterial);
frontLip.position.set(0, 0.048, -keyboardDepth / 2 + 0.045);
scene.add(frontLip);

// Thin black top perimeter lines to reproduce the drawn outline around the plate.
const borderLine = 0.042;
const borderHeight = 0.018;
addRoundedBox(keyboardLength - 0.75, borderLine, borderHeight, 0.020, darkMaterial, 0, baseTopY + 0.004, keyboardDepth / 2 - 0.20, 0.002);
addRoundedBox(keyboardLength - 0.75, borderLine, borderHeight, 0.020, darkMaterial, 0, baseTopY + 0.004, -keyboardDepth / 2 + 0.20, 0.002);
addRoundedBox(borderLine, keyboardDepth - 0.75, borderHeight, 0.020, darkMaterial, -keyboardLength / 2 + 0.20, baseTopY + 0.004, 0, 0.002);
addRoundedBox(borderLine, keyboardDepth - 0.75, borderHeight, 0.020, darkMaterial, keyboardLength / 2 - 0.20, baseTopY + 0.004, 0, 0.002);

// Key construction: every key has a black plinth slightly larger than the gray cap,
// creating the black outlines/gaps seen around each key in the image.
function addKey(x, z, unitsX = 1, unitsZ = 1, depthScale = 1) {
  const plinthWidth = Math.max(0.12, unitsX * unitX - keyGapX);
  const plinthDepth = Math.max(0.12, (unitsZ * unitZ - keyGapZ) * depthScale);

  const capWidth = Math.max(0.08, plinthWidth - keyRim * 2);
  const capDepth = Math.max(0.08, plinthDepth - keyRim * 2);

  addRoundedBox(
    plinthWidth,
    plinthDepth,
    keyPlinthHeight,
    keyCornerRadius,
    darkMaterial,
    x,
    keyPlinthY,
    z,
    0.010
  );

  addRoundedBox(
    capWidth,
    capDepth,
    keyCapHeight,
    keyCornerRadius * 0.85,
    keyMaterial,
    x,
    keyCapY,
    z,
    0.023
  );
}

function gap(units) {
  return { gap: units };
}

function placeKeyRow(leftX, z, layout, depthScale = 1) {
  let cursor = leftX;

  for (const item of layout) {
    if (typeof item === "number") {
      const centerX = cursor + (item * unitX) / 2;
      addKey(centerX, z, item, 1, depthScale);
      cursor += item * unitX;
    } else if (item && item.gap) {
      cursor += item.gap * unitX;
    }
  }
}

// Row positions. Function row sits slightly farther back with smaller key depth.
const zFunction = 2.35;
const zNumber = 1.30;
const zQ = 0.43;
const zHome = -0.44;
const zShift = -1.31;
const zBottom = -2.18;

// Cluster starting positions: main keyboard, navigation island, and numeric keypad.
const mainStartX = -12.20;
const navStartX = mainStartX + 15.0 * unitX + 0.75;
const numStartX = navStartX + 3.0 * unitX + 1.20;

// Main alphanumeric block.
placeKeyRow(mainStartX, zFunction, [
  1,
  gap(0.55),
  1, 1, 1, 1,
  gap(0.35),
  1, 1, 1, 1,
  gap(0.35),
  1, 1, 1, 1
], 0.78);

placeKeyRow(mainStartX, zNumber, [
  ...Array(13).fill(1),
  2
]);

placeKeyRow(mainStartX, zQ, [
  1.5,
  ...Array(12).fill(1),
  1.5
]);

placeKeyRow(mainStartX, zHome, [
  1.75,
  ...Array(11).fill(1),
  2.25
]);

placeKeyRow(mainStartX, zShift, [
  2.25,
  ...Array(10).fill(1),
  2.75
]);

placeKeyRow(mainStartX, zBottom, [
  1.25,
  1.25,
  1.25,
  6.25,
  1.25,
  1.25,
  1.25,
  1.25
]);

// Navigation block: top system keys, insert/delete island, and inverted-T arrows.
for (let col = 0; col < 3; col++) {
  const x = navStartX + (col + 0.5) * unitX;
  addKey(x, zFunction, 1, 1, 0.78);
  addKey(x, zNumber);
  addKey(x, zQ);
}

addKey(navStartX + 1.5 * unitX, zShift);

for (let col = 0; col < 3; col++) {
  addKey(navStartX + (col + 0.5) * unitX, zBottom);
}

// Numeric keypad with wide zero key and tall plus/enter keys.
for (let col = 0; col < 4; col++) {
  addKey(numStartX + (col + 0.5) * unitX, zFunction, 1, 1, 0.78);
}

for (let col = 0; col < 4; col++) {
  addKey(numStartX + (col + 0.5) * unitX, zNumber);
}

// 7 8 9 and tall plus
for (let col = 0; col < 3; col++) {
  addKey(numStartX + (col + 0.5) * unitX, zQ);
}
addKey(numStartX + 3.5 * unitX, (zQ + zHome) / 2, 1, 2);

// 4 5 6
for (let col = 0; col < 3; col++) {
  addKey(numStartX + (col + 0.5) * unitX, zHome);
}

// 1 2 3 and tall enter
for (let col = 0; col < 3; col++) {
  addKey(numStartX + (col + 0.5) * unitX, zShift);
}
addKey(numStartX + 3.5 * unitX, (zShift + zBottom) / 2, 1, 2);

// Wide 0 and decimal key
addKey(numStartX + 1.0 * unitX, zBottom, 2);
addKey(numStartX + 2.5 * unitX, zBottom);

// Small dark underside feet/shadow strips along the visible front edge.
addRoundedBox(
  keyboardLength - 1.35,
  0.070,
  0.030,
  0.025,
  darkMaterial,
  0,
  -0.082,
  -keyboardDepth / 2 + 0.58,
  0.004
);

addRoundedBox(
  keyboardLength - 1.90,
  0.055,
  0.026,
  0.022,
  darkMaterial,
  0,
  -0.076,
  keyboardDepth / 2 - 0.55,
  0.004
);

// Camera adjusted to an isometric-like view similar to the reference image.
camera.position.set(16, 10, 10);
camera.lookAt(0, 0, 0);