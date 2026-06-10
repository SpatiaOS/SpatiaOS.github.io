// Compact wheel-loader / front-loader interpreted from the reference image.
// Coordinate convention: front bucket extends in negative X, Y is vertical, Z is vehicle width.

// Parameters
const PI = Math.PI;
const TWO_PI = Math.PI * 2;

const bodyLength = 6.0;
const bodyWidth = 3.35;
const lowerBodyHeight = 0.55;
const lowerBodyCenterX = 0.85;
const lowerBodyCenterY = 1.72;

const deckLength = 4.45;
const deckWidth = 4.25;
const deckHeight = 0.20;
const deckCenterX = 2.05;
const deckCenterY = 2.36;

const wheelRadius = 1.05;
const wheelWidth = 0.72;
const wheelAxleY = 1.22;
const wheelTrackHalf = 2.08;
const frontAxleX = -1.15;
const rearAxleX = 2.65;
const wheelTreadCount = 18;
const treadTangential = 0.42;
const treadRadial = 0.18;

const cabCenterX = 1.45;
const cabLength = 2.05;
const cabWidth = 2.35;
const cabBaseY = 2.55;
const cabSlabHeight = 0.22;
const cabPostHeight = 2.22;
const cabPostThickness = 0.17;

const bucketFrontX = -6.35;
const bucketBackX = -2.55;
const bucketFrontY = 0.45;
const bucketBackY = 1.12;
const bucketWidth = 5.35;
const bucketSideThickness = 0.14;

const loaderArmZ = 1.52;

// Materials: mostly grey like the source drawing, with dark mesh trim to suggest ink outlines.
const matBody = new THREE.MeshStandardMaterial({ color: 0xb8b8bb, roughness: 0.62, metalness: 0.06 });
const matPanel = new THREE.MeshStandardMaterial({ color: 0x9f9fa3, roughness: 0.66, metalness: 0.05 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x26282b, roughness: 0.75, metalness: 0.05 });
const matTire = new THREE.MeshStandardMaterial({ color: 0x4b4c50, roughness: 0.82, metalness: 0.02, flatShading: true });
const matTread = new THREE.MeshStandardMaterial({ color: 0x6e7075, roughness: 0.80, metalness: 0.03, flatShading: true });
const matRim = new THREE.MeshStandardMaterial({ color: 0xc4c4c7, roughness: 0.58, metalness: 0.08 });
const matMetal = new THREE.MeshStandardMaterial({ color: 0xd6d7d9, roughness: 0.34, metalness: 0.35 });
const matGlass = new THREE.MeshStandardMaterial({
  color: 0x8fa6b8,
  roughness: 0.22,
  metalness: 0.02,
  transparent: true,
  opacity: 0.42,
  side: THREE.DoubleSide
});

// Helpers
function addBox(size, position, rotation, material) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  if (rotation) {
    mesh.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
  }
  scene.add(mesh);
  return mesh;
}

function addCylinder(radiusTop, radiusBottom, height, radialSegments, position, rotation, material) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments || 24);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  if (rotation) {
    mesh.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
  }
  scene.add(mesh);
  return mesh;
}

function addCylinderBetween(p1, p2, radius, material, radialSegments) {
  const start = new THREE.Vector3(p1.x, p1.y, p1.z);
  const end = new THREE.Vector3(p2.x, p2.y, p2.z);
  const axis = new THREE.Vector3().subVectors(end, start);
  const length = axis.length();

  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments || 16);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.normalize());
  scene.add(mesh);
  return mesh;
}

function addBoxBetween(p1, p2, thicknessY, thicknessZ, material) {
  const start = new THREE.Vector3(p1.x, p1.y, p1.z);
  const end = new THREE.Vector3(p2.x, p2.y, p2.z);
  const axis = new THREE.Vector3().subVectors(end, start);
  const length = axis.length();

  const geometry = new THREE.BoxGeometry(length, thicknessY, thicknessZ);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis.normalize());
  scene.add(mesh);
  return mesh;
}

function addExtrudedXY(points, depth, zCenter, material) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    steps: 1,
    bevelEnabled: false
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = zCenter;
  scene.add(mesh);
  return mesh;
}

// Main chassis and rear engine/deck platform
addBox(
  { x: bodyLength, y: lowerBodyHeight, z: bodyWidth },
  { x: lowerBodyCenterX, y: lowerBodyCenterY, z: 0 },
  null,
  matBody
);

addBox(
  { x: 1.15, y: 0.95, z: 3.45 },
  { x: 3.55, y: 1.72, z: 0 },
  null,
  matPanel
);

addBox(
  { x: deckLength, y: deckHeight, z: deckWidth },
  { x: deckCenterX, y: deckCenterY, z: 0 },
  null,
  matBody
);

// Thin dark deck edges imitate the black line art in the image.
addBox({ x: deckLength + 0.12, y: 0.07, z: 0.07 }, { x: deckCenterX, y: deckCenterY + 0.14, z: deckWidth / 2 + 0.02 }, null, matDark);
addBox({ x: deckLength + 0.12, y: 0.07, z: 0.07 }, { x: deckCenterX, y: deckCenterY + 0.14, z: -deckWidth / 2 - 0.02 }, null, matDark);
addBox({ x: 0.07, y: 0.07, z: deckWidth + 0.12 }, { x: deckCenterX + deckLength / 2 + 0.02, y: deckCenterY + 0.14, z: 0 }, null, matDark);

// Long side fenders/steps above the wheels.
for (const side of [-1, 1]) {
  addBox({ x: 5.20, y: 0.16, z: 0.36 }, { x: 0.80, y: 2.36, z: side * 2.02 }, null, matBody);
  addBox({ x: 5.15, y: 0.06, z: 0.06 }, { x: 0.80, y: 2.48, z: side * 2.24 }, null, matDark);

  addBox({ x: 0.85, y: 0.10, z: 0.46 }, { x: 0.30, y: 1.62, z: side * 2.40 }, null, matPanel);
  addBox({ x: 0.70, y: 0.10, z: 0.38 }, { x: 0.70, y: 1.34, z: side * 2.38 }, null, matPanel);
}

// Wheels with blocky tread lugs and concentric rims.
const tireGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 64);
const treadGeometry = new THREE.BoxGeometry(treadTangential, treadRadial, wheelWidth + 0.16);
const sideLugGeometry = new THREE.BoxGeometry(0.58, 0.12, 0.08);

function createWheel(axleX, axleZ) {
  const side = axleZ >= 0 ? 1 : -1;
  const outerZ = axleZ + side * (wheelWidth / 2 + 0.04);

  const tire = new THREE.Mesh(tireGeometry, matTire);
  tire.position.set(axleX, wheelAxleY, axleZ);
  tire.rotation.x = PI / 2;
  scene.add(tire);

  // Raised rectangular tread blocks around the circumference.
  for (let i = 0; i < wheelTreadCount; i++) {
    const theta = (i / wheelTreadCount) * TWO_PI;
    const r = wheelRadius + treadRadial * 0.5;

    const lug = new THREE.Mesh(treadGeometry, matTread);
    lug.position.set(
      axleX + Math.cos(theta) * r,
      wheelAxleY + Math.sin(theta) * r,
      axleZ
    );
    lug.rotation.z = theta - PI / 2;
    scene.add(lug);
  }

  // Chevron-like sidewall tread marks on the visible outer face.
  for (let i = 0; i < 12; i++) {
    const theta = (i / 12) * TWO_PI;
    const r = wheelRadius * 0.78;

    const sideLug = new THREE.Mesh(sideLugGeometry, matTread);
    sideLug.position.set(
      axleX + Math.cos(theta) * r,
      wheelAxleY + Math.sin(theta) * r,
      outerZ + side * 0.055
    );
    sideLug.rotation.z = theta + (i % 2 === 0 ? 0.75 : -0.75);
    scene.add(sideLug);
  }

  // Outer wheel rim and hub.
  addCylinder(wheelRadius * 0.62, wheelRadius * 0.62, 0.10, 48, { x: axleX, y: wheelAxleY, z: outerZ }, { x: PI / 2, y: 0, z: 0 }, matRim);
  addCylinder(wheelRadius * 0.34, wheelRadius * 0.34, 0.12, 40, { x: axleX, y: wheelAxleY, z: outerZ + side * 0.075 }, { x: PI / 2, y: 0, z: 0 }, matPanel);
  addCylinder(wheelRadius * 0.11, wheelRadius * 0.11, 0.14, 24, { x: axleX, y: wheelAxleY, z: outerZ + side * 0.16 }, { x: PI / 2, y: 0, z: 0 }, matDark);

  // Small rim bolts.
  for (let i = 0; i < 6; i++) {
    const theta = (i / 6) * TWO_PI;
    addCylinder(
      0.035,
      0.035,
      0.055,
      12,
      {
        x: axleX + Math.cos(theta) * wheelRadius * 0.40,
        y: wheelAxleY + Math.sin(theta) * wheelRadius * 0.40,
        z: outerZ + side * 0.185
      },
      { x: PI / 2, y: 0, z: 0 },
      matDark
    );
  }
}

createWheel(frontAxleX, wheelTrackHalf);
createWheel(frontAxleX, -wheelTrackHalf);
createWheel(rearAxleX, wheelTrackHalf);
createWheel(rearAxleX, -wheelTrackHalf);

// Axle rods spanning side-to-side.
addCylinderBetween({ x: frontAxleX, y: wheelAxleY, z: -wheelTrackHalf }, { x: frontAxleX, y: wheelAxleY, z: wheelTrackHalf }, 0.12, matDark, 16);
addCylinderBetween({ x: rearAxleX, y: wheelAxleY, z: -wheelTrackHalf }, { x: rearAxleX, y: wheelAxleY, z: wheelTrackHalf }, 0.12, matDark, 16);

// Sloped hood / front engine cover with top ribs.
addExtrudedXY(
  [
    [-2.25, 1.60],
    [0.75, 1.62],
    [0.75, 2.55],
    [-0.55, 2.88],
    [-2.25, 2.22]
  ],
  3.05,
  0,
  matPanel
);

// Hood grille and raised strips.
for (let i = 0; i < 5; i++) {
  addBox(
    { x: 0.055, y: 0.055, z: 2.45 },
    { x: -2.29, y: 1.86 + i * 0.15, z: 0 },
    null,
    matDark
  );
}

for (const z of [-1.08, -0.54, 0, 0.54, 1.08]) {
  addBoxBetween(
    { x: -2.00, y: 2.40, z: z },
    { x: -0.42, y: 2.76, z: z },
    0.055,
    0.065,
    matDark
  );
}

// Cab with open-frame pillars, transparent panes, and overhanging roof.
const cabFrontX = cabCenterX - cabLength / 2;
const cabBackX = cabCenterX + cabLength / 2;
const cabPostBottomY = cabBaseY + cabSlabHeight / 2;
const cabPostTopY = cabPostBottomY + cabPostHeight;
const cabPostCenterY = (cabPostBottomY + cabPostTopY) / 2;
const cabRoofY = cabPostTopY + 0.20;

addBox(
  { x: cabLength + 0.36, y: cabSlabHeight, z: cabWidth + 0.36 },
  { x: cabCenterX, y: cabBaseY, z: 0 },
  null,
  matBody
);

// Corner posts.
for (const x of [cabFrontX, cabBackX]) {
  for (const z of [-cabWidth / 2, cabWidth / 2]) {
    addBox(
      { x: cabPostThickness, y: cabPostHeight, z: cabPostThickness },
      { x: x, y: cabPostCenterY, z: z },
      null,
      matBody
    );
  }
}

// Front center post and side door/window separator posts.
addBox({ x: cabPostThickness * 0.85, y: cabPostHeight * 0.92, z: cabPostThickness * 0.85 }, { x: cabFrontX, y: cabPostCenterY, z: 0 }, null, matBody);
for (const side of [-1, 1]) {
  addBox({ x: cabPostThickness * 0.85, y: cabPostHeight * 0.92, z: cabPostThickness * 0.85 }, { x: cabCenterX, y: cabPostCenterY, z: side * cabWidth / 2 }, null, matBody);
}

// Front/back horizontal window bars.
for (const x of [cabFrontX, cabBackX]) {
  addBox({ x: 0.15, y: 0.14, z: cabWidth + 0.08 }, { x: x, y: cabPostBottomY + 0.60, z: 0 }, null, matBody);
  addBox({ x: 0.15, y: 0.14, z: cabWidth + 0.08 }, { x: x, y: cabPostTopY - 0.10, z: 0 }, null, matBody);
}

// Side horizontal bars and lower door panels.
for (const side of [-1, 1]) {
  addBox({ x: cabLength + 0.08, y: 0.14, z: 0.15 }, { x: cabCenterX, y: cabPostBottomY + 0.60, z: side * cabWidth / 2 }, null, matBody);
  addBox({ x: cabLength + 0.08, y: 0.14, z: 0.15 }, { x: cabCenterX, y: cabPostTopY - 0.10, z: side * cabWidth / 2 }, null, matBody);
  addBox({ x: cabLength - 0.22, y: 0.44, z: 0.08 }, { x: cabCenterX, y: cabPostBottomY + 0.26, z: side * (cabWidth / 2 + 0.02) }, null, matPanel);
}

// Window panes.
addBox({ x: 0.035, y: 1.38, z: cabWidth - 0.50 }, { x: cabFrontX - 0.04, y: cabPostBottomY + 1.36, z: 0 }, null, matGlass);
addBox({ x: 0.035, y: 1.28, z: cabWidth - 0.50 }, { x: cabBackX + 0.04, y: cabPostBottomY + 1.32, z: 0 }, null, matGlass);

for (const side of [-1, 1]) {
  addBox({ x: cabLength - 0.46, y: 1.30, z: 0.035 }, { x: cabCenterX, y: cabPostBottomY + 1.34, z: side * (cabWidth / 2 + 0.045) }, null, matGlass);
  addBox({ x: 0.08, y: 0.08, z: 0.06 }, { x: cabCenterX + 0.30, y: cabPostBottomY + 1.08, z: side * (cabWidth / 2 + 0.115) }, null, matDark);
}

// Cab roof: slab plus round front/rear edges to approximate the softened roof corners.
addBox(
  { x: cabLength + 0.56, y: 0.24, z: cabWidth + 0.56 },
  { x: cabCenterX, y: cabRoofY, z: 0 },
  null,
  matBody
);

addBox(
  { x: cabLength + 0.25, y: 0.12, z: cabWidth + 0.25 },
  { x: cabCenterX, y: cabRoofY + 0.18, z: 0 },
  null,
  matPanel
);

addCylinder(0.13, 0.13, cabWidth + 0.58, 24, { x: cabFrontX - 0.28, y: cabRoofY - 0.04, z: 0 }, { x: PI / 2, y: 0, z: 0 }, matBody);
addCylinder(0.13, 0.13, cabWidth + 0.58, 24, { x: cabBackX + 0.28, y: cabRoofY - 0.04, z: 0 }, { x: PI / 2, y: 0, z: 0 }, matBody);

addBox({ x: cabLength + 0.64, y: 0.055, z: 0.055 }, { x: cabCenterX, y: cabPostTopY + 0.03, z: cabWidth / 2 + 0.31 }, null, matDark);
addBox({ x: cabLength + 0.64, y: 0.055, z: 0.055 }, { x: cabCenterX, y: cabPostTopY + 0.03, z: -cabWidth / 2 - 0.31 }, null, matDark);
addBox({ x: 0.055, y: 0.055, z: cabWidth + 0.64 }, { x: cabFrontX - 0.31, y: cabPostTopY + 0.03, z: 0 }, null, matDark);

// Small round roof detail visible in the drawing.
addCylinder(0.18, 0.18, 0.10, 24, { x: cabBackX - 0.20, y: cabRoofY + 0.31, z: 0.80 }, null, matPanel);
addCylinder(0.22, 0.22, 0.055, 24, { x: cabBackX - 0.20, y: cabRoofY + 0.39, z: 0.80 }, null, matDark);

// Exhaust stack on the rear deck.
const exhaustX = 3.45;
const exhaustZ = 1.42;
const deckTopY = deckCenterY + deckHeight / 2;

addCylinder(0.22, 0.22, 0.10, 32, { x: exhaustX, y: deckTopY + 0.05, z: exhaustZ }, null, matDark);
addCylinder(0.16, 0.16, 1.32, 32, { x: exhaustX, y: deckTopY + 0.71, z: exhaustZ }, null, matBody);
addCylinder(0.20, 0.20, 0.12, 32, { x: exhaustX, y: deckTopY + 1.41, z: exhaustZ }, null, matDark);

// Front bucket: open scoop with sloped floor, tall back wall, triangular side cheeks, and cutting lip.
const bucketFloorLength = Math.hypot(bucketBackX - bucketFrontX, bucketBackY - bucketFrontY);
const bucketFloorAngle = Math.atan2(bucketBackY - bucketFrontY, bucketBackX - bucketFrontX);

addBox(
  { x: bucketFloorLength, y: 0.13, z: bucketWidth },
  {
    x: (bucketFrontX + bucketBackX) / 2,
    y: (bucketFrontY + bucketBackY) / 2,
    z: 0
  },
  { x: 0, y: 0, z: bucketFloorAngle },
  matBody
);

addBox(
  { x: 0.18, y: 1.34, z: bucketWidth + 0.05 },
  { x: bucketBackX + 0.03, y: bucketBackY + 0.62, z: 0 },
  { x: 0, y: 0, z: -0.04 },
  matBody
);

addBox(
  { x: 0.36, y: 0.13, z: bucketWidth + 0.35 },
  { x: bucketFrontX + 0.12, y: bucketFrontY + 0.02, z: 0 },
  { x: 0, y: 0, z: bucketFloorAngle },
  matDark
);

const bucketSidePoints = [
  [bucketFrontX, bucketFrontY - 0.02],
  [bucketFrontX + 0.22, bucketFrontY + 0.72],
  [bucketBackX - 0.07, bucketBackY + 0.92],
  [bucketBackX, bucketBackY]
];

for (const side of [-1, 1]) {
  addExtrudedXY(bucketSidePoints, bucketSideThickness, side * (bucketWidth / 2 + bucketSideThickness / 2), matBody);

  const z = side * (bucketWidth / 2 + bucketSideThickness + 0.03);
  for (let i = 0; i < bucketSidePoints.length; i++) {
    const a = bucketSidePoints[i];
    const b = bucketSidePoints[(i + 1) % bucketSidePoints.length];
    addBoxBetween({ x: a[0], y: a[1], z: z }, { x: b[0], y: b[1], z: z }, 0.065, 0.065, matDark);
  }
}

addBoxBetween(
  { x: bucketFrontX + 0.22, y: bucketFrontY + 0.72, z: -bucketWidth / 2 },
  { x: bucketFrontX + 0.22, y: bucketFrontY + 0.72, z: bucketWidth / 2 },
  0.09,
  0.09,
  matDark
);

addBoxBetween(
  { x: bucketBackX - 0.05, y: bucketBackY + 0.92, z: -bucketWidth / 2 },
  { x: bucketBackX - 0.05, y: bucketBackY + 0.92, z: bucketWidth / 2 },
  0.10,
  0.10,
  matDark
);

// Interior bucket ribs on the sloped floor.
for (const z of [-1.60, 0, 1.60]) {
  addBoxBetween(
    { x: bucketFrontX + 0.55, y: bucketFrontY + 0.13, z: z },
    { x: bucketBackX - 0.22, y: bucketBackY + 0.14, z: z },
    0.055,
    0.075,
    matDark
  );
}

// Loader lift arms, linkages, pivot plates, and hydraulic cylinders.
function addPivotDisk(point, side) {
  addCylinder(
    0.16,
    0.16,
    0.10,
    24,
    { x: point.x, y: point.y, z: point.z + side * 0.08 },
    { x: PI / 2, y: 0, z: 0 },
    matDark
  );
}

for (const side of [-1, 1]) {
  const z = side * loaderArmZ;

  const rearPivot = { x: 0.42, y: 2.58, z: z };
  const upperElbow = { x: -1.62, y: 2.86, z: z };
  const frontPivot = { x: -3.70, y: 1.86, z: z };
  const lowerBodyPivot = { x: -0.70, y: 1.84, z: z };
  const bucketLowerPivot = { x: -3.15, y: 1.22, z: z };

  // The lift arms are approximated as two straight heavy bars per side.
  addBoxBetween(rearPivot, upperElbow, 0.20, 0.17, matBody);
  addBoxBetween(upperElbow, frontPivot, 0.20, 0.17, matBody);
  addBoxBetween(lowerBodyPivot, bucketLowerPivot, 0.15, 0.14, matBody);

  // Triangular bucket linkage plates.
  addBoxBetween(frontPivot, { x: bucketBackX - 0.08, y: bucketBackY + 0.82, z: z }, 0.13, 0.13, matBody);
  addBoxBetween(frontPivot, { x: bucketBackX + 0.05, y: bucketBackY, z: z }, 0.13, 0.13, matBody);

  // Hydraulic sleeve and shiny rod.
  addCylinderBetween({ x: -0.52, y: 1.72, z: z }, { x: -1.78, y: 2.34, z: z }, 0.12, matDark, 18);
  addCylinderBetween({ x: -1.78, y: 2.34, z: z }, { x: -3.48, y: 1.62, z: z }, 0.065, matMetal, 18);

  // Short bucket tilt cylinder.
  addCylinderBetween({ x: -2.05, y: 2.42, z: z }, { x: -3.42, y: 1.76, z: z }, 0.09, matDark, 18);
  addCylinderBetween({ x: -3.42, y: 1.76, z: z }, { x: -4.10, y: 1.44, z: z }, 0.055, matMetal, 18);

  for (const p of [rearPivot, upperElbow, frontPivot, lowerBodyPivot, bucketLowerPivot]) {
    addPivotDisk(p, side);
  }
}

// Cross tubes tying the loader arms together.
addCylinderBetween({ x: -1.62, y: 2.86, z: -loaderArmZ }, { x: -1.62, y: 2.86, z: loaderArmZ }, 0.10, matBody, 18);
addCylinderBetween({ x: -3.70, y: 1.86, z: -loaderArmZ }, { x: -3.70, y: 1.86, z: loaderArmZ }, 0.105, matBody, 18);
addCylinderBetween({ x: -0.55, y: 2.18, z: -1.35 }, { x: -0.55, y: 2.18, z: 1.35 }, 0.08, matDark, 16);

// Small front guard bars over the hood, matching the grill/rail details in the drawing.
for (const z of [-1.25, 1.25]) {
  addBoxBetween({ x: -2.25, y: 1.95, z: z }, { x: -1.00, y: 2.70, z: z }, 0.08, 0.08, matBody);
}
addCylinderBetween({ x: -2.05, y: 2.05, z: -1.25 }, { x: -2.05, y: 2.05, z: 1.25 }, 0.065, matBody, 16);

// Camera set to an isometric front/side view similar to the reference.
camera.position.set(-8.6, 6.0, 7.6);
camera.lookAt(-1.1, 2.35, 0);