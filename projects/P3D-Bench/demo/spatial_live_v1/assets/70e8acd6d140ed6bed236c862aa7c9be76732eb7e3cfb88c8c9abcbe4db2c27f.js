// A slender, monochrome residential tower with seventeen balcony levels.
// The rear slab is rotated relative to the main facade; its taller flat roof,
// the triangular crown, and the shallow sloping canopy create the stepped top.
const parameters = {
  floors: 17,
  rearExtraFloors: 1,
  floorHeight: 1.65,
  baseHeight: 2.35,
  frontLeft: -5.10,
  frontRight: 3.05,
  frontZ: 5.00,
  recessedZ: 4.18,
  windowPierLeft: 0.55,
  rearWidth: 3.45,
  rearDepth: 8.00,
  rearRotation: THREE.MathUtils.degToRad(28.4),
  parapetHeight: 0.88,
  outlineRadius: 0.014
};

const towerHeight = parameters.floors * parameters.floorHeight;
const roofY = parameters.baseHeight + towerHeight;
const rearHeight =
  (parameters.floors + parameters.rearExtraFloors) * parameters.floorHeight;
const rearRoofY = parameters.baseHeight + rearHeight;

const materials = {
  concrete: new THREE.MeshStandardMaterial({
    color: 0xb9babc, roughness: 0.86
  }),
  trim: new THREE.MeshStandardMaterial({
    color: 0xd3d4d5, roughness: 0.72
  }),
  side: new THREE.MeshStandardMaterial({
    color: 0xa5a6a8, roughness: 0.88
  }),
  roof: new THREE.MeshStandardMaterial({
    color: 0x898b8e, roughness: 0.94
  }),
  outline: new THREE.MeshStandardMaterial({
    color: 0x202123, roughness: 0.85
  }),
  recess: new THREE.MeshStandardMaterial({
    color: 0x101214, roughness: 0.91
  }),
  darkGlass: new THREE.MeshStandardMaterial({
    color: 0x272b2e, roughness: 0.49, metalness: 0.12
  }),
  glass: new THREE.MeshStandardMaterial({
    color: 0xbfc5c8, roughness: 0.46, metalness: 0.12
  }),
  glassLight: new THREE.MeshStandardMaterial({
    color: 0xd5d9da, roughness: 0.49, metalness: 0.08
  }),
  metal: new THREE.MeshStandardMaterial({
    color: 0xb6b9bb, roughness: 0.52, metalness: 0.28
  })
};

// All detail, including the fine outlines, is actual mesh geometry.
const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 6);

function addMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function box(x, y, z, width, height, depth, material, rotationY = 0) {
  const mesh = addMesh(unitBox, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(width, height, depth);
  mesh.rotation.y = rotationY;
  return mesh;
}

function framePoint(frame, u, y, v) {
  const c = Math.cos(frame.angle);
  const s = Math.sin(frame.angle);
  return new THREE.Vector3(
    frame.x + c * u + s * v,
    y,
    frame.z - s * u + c * v
  );
}

function localBox(frame, u, y, v, width, height, depth, material) {
  const p = framePoint(frame, u, y, v);
  return box(p.x, p.y, p.z, width, height, depth, material, frame.angle);
}

function beam(a, b, radius = parameters.outlineRadius, material = materials.outline) {
  const direction = new THREE.Vector3().subVectors(b, a);
  const length = direction.length();
  if (length < 0.0001) return;

  const mesh = addMesh(unitCylinder, material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.scale.set(radius, length, radius);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  return mesh;
}

function polygonGeometry(points, height, holes = []) {
  // Shape coordinates are mapped onto the world XZ plane.
  const shape = new THREE.Shape();
  points.forEach(([x, z], i) => {
    if (i === 0) shape.moveTo(x, -z);
    else shape.lineTo(x, -z);
  });
  shape.closePath();

  holes.forEach(contour => {
    const hole = new THREE.Path();
    contour.forEach(([x, z], i) => {
      if (i === 0) hole.moveTo(x, -z);
      else hole.lineTo(x, -z);
    });
    hole.closePath();
    shape.holes.push(hole);
  });

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function prism(points, bottomY, height, material, holes = []) {
  const mesh = addMesh(polygonGeometry(points, height, holes), material);
  mesh.position.y = bottomY;
  return mesh;
}

function insetPolygon(points, factor) {
  const center = points.reduce(
    (sum, p) => [sum[0] + p[0] / points.length, sum[1] + p[1] / points.length],
    [0, 0]
  );
  return points.map(p => [
    center[0] + (p[0] - center[0]) * factor,
    center[1] + (p[1] - center[1]) * factor
  ]);
}

function outlinePolygon(points, y, radius = parameters.outlineRadius) {
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    beam(
      new THREE.Vector3(p[0], y, p[1]),
      new THREE.Vector3(q[0], y, q[1]),
      radius
    );
  });
}

function outlinedCorners(points, bottom, top) {
  points.forEach(([x, z]) => {
    beam(new THREE.Vector3(x, bottom, z), new THREE.Vector3(x, top, z));
  });
}

// Recessed glazing with a pale surround and dark, physically modeled mullions.
function windowGrid(face, u, y, width, height, columns, rows) {
  localBox(face, u, y, 0.022,
    width + 0.17, height + 0.17, 0.040, materials.outline);
  localBox(face, u, y, 0.047,
    width + 0.11, height + 0.11, 0.040, materials.trim);
  localBox(face, u, y, 0.074,
    width, height, 0.026, materials.recess);

  const border = 0.055;
  const mullionX = 0.055;
  const mullionY = 0.065;
  const paneWidth =
    (width - 2 * border - (columns - 1) * mullionX) / columns;
  const paneHeight =
    (height - 2 * border - (rows - 1) * mullionY) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const px = u - width / 2 + border +
        paneWidth / 2 + col * (paneWidth + mullionX);
      const py = y - height / 2 + border +
        paneHeight / 2 + row * (paneHeight + mullionY);

      localBox(face, px, py, 0.094,
        paneWidth, paneHeight, 0.022,
        (row + col) % 3 === 0 ? materials.glassLight : materials.glass);
    }
  }
}

// Irregular plinth: broad blank front, with a chamfered terrace at the right.
const baseOutline = [
  [-5.28, 5.35],
  [3.50, 5.35],
  [7.35, -0.40],
  [3.25, -7.55],
  [-0.30, -6.00],
  [-3.98, 0.00],
  [-5.28, 2.20]
];

prism(baseOutline, 0, parameters.baseHeight, materials.concrete);
prism(baseOutline, parameters.baseHeight - 0.09, 0.09, materials.side);
outlinePolygon(baseOutline, 0.035);
outlinePolygon(baseOutline, parameters.baseHeight);
outlinedCorners(baseOutline, 0.035, parameters.baseHeight);

// Sparse panel joints on the otherwise unadorned ground-level frontage.
for (const x of [0.55, 3.06]) {
  box(x, parameters.baseHeight / 2, 5.367,
    0.025, parameters.baseHeight - 0.06, 0.020, materials.outline);
}
box(1.80, 1.16, 5.385, 2.31, 2.12, 0.035, materials.trim);

// Low rear-left annex, partially tucked beneath the tower.
const annexOutline = [
  [-7.40, -1.80],
  [-2.60, -1.80],
  [0.80, -7.20],
  [-4.00, -7.20]
];
const annexHeight = 3.08;
const annexInner = insetPolygon(annexOutline, 0.89);

prism(annexOutline, 0, annexHeight, materials.concrete);
prism(annexInner, annexHeight, 0.045, materials.roof);
prism(annexOutline, annexHeight, 0.59, materials.trim, [annexInner]);
outlinePolygon(annexOutline, 0.035);
outlinePolygon(annexOutline, annexHeight);
outlinePolygon(annexOutline, annexHeight + 0.59);
outlinePolygon(annexInner, annexHeight + 0.59);
outlinedCorners(annexOutline, 0.035, annexHeight + 0.59);

// A simple roof hatch and a slender service pipe visible on the low annex.
box(-5.10, annexHeight + 0.065, -3.45,
  1.82, 0.08, 1.72, materials.outline);
box(-5.10, annexHeight + 0.115, -3.45,
  1.70, 0.08, 1.60, materials.side);
beam(
  new THREE.Vector3(-6.18, annexHeight + 0.03, -2.90),
  new THREE.Vector3(-6.18, annexHeight + 0.94, -2.90),
  0.042,
  materials.metal
);

// Taller, rotated rear slab.
const rearFrame = {
  x: -0.05,
  z: -5.57,
  angle: parameters.rearRotation
};

localBox(
  rearFrame,
  parameters.rearWidth / 2,
  parameters.baseHeight + rearHeight / 2,
  parameters.rearDepth / 2,
  parameters.rearWidth,
  rearHeight,
  parameters.rearDepth,
  materials.concrete
);

const rearFrontCenter = framePoint(
  rearFrame, parameters.rearWidth / 2, 0, parameters.rearDepth
);
const rearFrontFace = {
  x: rearFrontCenter.x,
  z: rearFrontCenter.z,
  angle: rearFrame.angle
};

const rearSideCenter = framePoint(rearFrame, 0, 0, parameters.rearDepth / 2);
const rearSideFace = {
  x: rearSideCenter.x,
  z: rearSideCenter.z,
  angle: rearFrame.angle - Math.PI / 2
};

const rearBackCenter = framePoint(rearFrame, parameters.rearWidth / 2, 0, 0);
const rearBackFace = {
  x: rearBackCenter.x,
  z: rearBackCenter.z,
  angle: rearFrame.angle + Math.PI
};

for (let floor = 0; floor < parameters.floors + parameters.rearExtraFloors; floor++) {
  const y = parameters.baseHeight + floor * parameters.floorHeight;

  windowGrid(rearFrontFace, 0, y + 0.88,
    parameters.rearWidth - 0.40, 1.03, 4, 1);

  localBox(rearFrontFace, 0, y + 0.09, 0.055,
    parameters.rearWidth + 0.04, 0.12, 0.095, materials.trim);
  localBox(rearFrontFace, 0, y + 0.17, 0.109,
    parameters.rearWidth + 0.04, 0.022, 0.020, materials.outline);

  // Most of this long elevation is concealed by the projecting front tower.
  for (let bay = 0; bay < 3; bay++) {
    windowGrid(rearSideFace, (bay - 1) * 2.50, y + 0.88,
      2.18, 1.03, 3, 1);
  }
  localBox(rearSideFace, 0, y + 0.09, 0.035,
    parameters.rearDepth, 0.11, 0.07, materials.trim);

  windowGrid(rearBackFace, 0, y + 0.88,
    parameters.rearWidth - 0.48, 1.03, 3, 1);
}

// Rear flat roof with a recessed dark deck and raised perimeter parapet.
localBox(rearFrame, parameters.rearWidth / 2, rearRoofY + 0.035,
  parameters.rearDepth / 2,
  parameters.rearWidth - 0.26, 0.07,
  parameters.rearDepth - 0.26, materials.roof);

const parapetThickness = 0.15;
const parapetCenterY = rearRoofY + parameters.parapetHeight / 2;

for (const u of [parapetThickness / 2, parameters.rearWidth - parapetThickness / 2]) {
  localBox(rearFrame, u, parapetCenterY, parameters.rearDepth / 2,
    parapetThickness, parameters.parapetHeight, parameters.rearDepth,
    materials.trim);
}
for (const v of [parapetThickness / 2, parameters.rearDepth - parapetThickness / 2]) {
  localBox(rearFrame, parameters.rearWidth / 2, parapetCenterY, v,
    parameters.rearWidth, parameters.parapetHeight, parapetThickness,
    materials.trim);
}

const rearRoofOutline = [
  [0, 0],
  [parameters.rearWidth, 0],
  [parameters.rearWidth, parameters.rearDepth],
  [0, parameters.rearDepth]
].map(([u, v]) => {
  const p = framePoint(rearFrame, u, 0, v);
  return [p.x, p.z];
});

outlinePolygon(rearRoofOutline, rearRoofY);
outlinePolygon(rearRoofOutline, rearRoofY + parameters.parapetHeight);
outlinedCorners(rearRoofOutline, rearRoofY, rearRoofY + parameters.parapetHeight);

// Main tower footprint: recessed left facade, solid right window pier,
// and a triangular core tapering into the rear slab.
const mainOutline = [
  [parameters.frontLeft, parameters.recessedZ],
  [parameters.windowPierLeft, parameters.recessedZ],
  [parameters.windowPierLeft, parameters.frontZ],
  [parameters.frontRight, parameters.frontZ],
  [parameters.frontRight, 0],
  [-0.05, -5.57],
  [-3.60, 0],
  [-3.60, 2.35],
  [parameters.frontLeft, 2.35]
];

prism(mainOutline, parameters.baseHeight, towerHeight, materials.concrete);

// Thin, closely spaced full-height fins on the narrow left return.
box(-5.105, parameters.baseHeight + towerHeight / 2, 3.68,
  0.15, towerHeight, 2.72, materials.side);

for (const z of [2.44, 2.98, 3.52, 4.06, 4.66, 4.96]) {
  box(-5.195, parameters.baseHeight + towerHeight / 2, z,
    0.055, towerHeight, 0.19, materials.outline);
  box(-5.29, parameters.baseHeight + towerHeight / 2, z,
    0.18, towerHeight + 0.025, 0.095, materials.trim);
  box(-5.389, parameters.baseHeight + towerHeight / 2, z,
    0.017, towerHeight, 0.025, materials.outline);
}

const mainFace = { x: 0, z: parameters.frontZ, angle: 0 };
const windowPierCenter = (parameters.windowPierLeft + parameters.frontRight) / 2;
const windowPierWidth = parameters.frontRight - parameters.windowPierLeft;
const balconyLeft = -4.94;
const balconyRight = 0.48;
const balconyWidth = balconyRight - balconyLeft;
const balconyCenter = (balconyLeft + balconyRight) / 2;

for (let floor = 0; floor < parameters.floors; floor++) {
  const y = parameters.baseHeight + floor * parameters.floorHeight;

  // Two broad, dark recessed door/window bays behind the balcony rail.
  box(-3.09, y + 0.87, 4.218,
    3.68, 1.47, 0.065, materials.recess);

  for (const x of [-4.02, -2.16]) {
    box(x, y + 0.88, 4.259,
      1.76, 1.36, 0.026, materials.darkGlass);
  }
  for (const x of [-4.94, -3.09, -1.24]) {
    box(x, y + 0.87, 4.287,
      0.047, 1.47, 0.047, materials.metal);
  }
  for (const height of [0.63, 1.27]) {
    box(-3.09, y + height, 4.285,
      3.67, 0.030, 0.035, materials.metal);
  }

  // Small door opening behind the projecting right-hand balcony nook.
  box(-0.37, y + 0.88, 4.224,
    1.14, 1.43, 0.060, materials.recess);
  box(-0.37, y + 0.89, 4.263,
    0.97, 1.29, 0.024, materials.darkGlass);
  box(-0.37, y + 0.88, 4.285,
    0.035, 1.31, 0.025, materials.metal);

  // Continuous floor plate and a thin dark line beneath its exposed nose.
  box(balconyCenter, y + 0.065, 4.66,
    balconyWidth + 0.21, 0.13, 1.12, materials.trim);
  box(balconyCenter, y + 0.021, 5.228,
    balconyWidth + 0.21, 0.025, 0.021, materials.outline);

  // Alternating pale parapet panel and darker railing infill.
  box(-4.025, y + 0.325, 5.065,
    1.72, 0.43, 0.085, materials.trim);
  box(-4.025, y + 0.548, 5.114,
    1.76, 0.023, 0.026, materials.outline);

  box(-2.165, y + 0.400, 5.055,
    1.76, 0.58, 0.060, materials.recess);

  for (const railHeight of [0.61, 0.75, 0.91]) {
    box(-3.09, y + railHeight, 5.112,
      3.77, 0.035, 0.045, materials.metal);
  }
  for (const x of [-4.96, -3.09, -1.22]) {
    box(x, y + 0.525, 5.105,
      0.047, 0.88, 0.050, materials.trim);
  }

  // Repeated small U-shaped balconies beside the solid window pier.
  const nookCenter = -0.35;
  box(nookCenter, y + 0.12, 4.75,
    1.62, 0.15, 1.14, materials.trim);
  box(nookCenter, y + 0.345, 5.285,
    1.62, 0.32, 0.12, materials.trim);
  for (const x of [-1.12, 0.42]) {
    box(x, y + 0.41, 4.79,
      0.105, 0.47, 1.05, materials.trim);
    box(x, y + 0.65, 4.79,
      0.11, 0.026, 1.07, materials.outline);
  }
  box(nookCenter, y + 0.515, 5.29,
    1.64, 0.026, 0.125, materials.outline);

  // Compact three-by-three window grids on the right front pier.
  windowGrid(mainFace, windowPierCenter, y + 0.89, 1.87, 1.09, 3, 3);
  localBox(mainFace, windowPierCenter, y + 0.105, 0.059,
    windowPierWidth, 0.105, 0.10, materials.trim);
  localBox(mainFace, windowPierCenter, y + 0.172, 0.115,
    windowPierWidth, 0.021, 0.021, materials.outline);
}

// Continuous facade corner strips make the window pier read as a solid shaft.
for (const x of [parameters.windowPierLeft + 0.035, parameters.frontRight - 0.035]) {
  box(x, parameters.baseHeight + towerHeight / 2, 5.066,
    0.12, towerHeight, 0.13, materials.trim);
  box(x - 0.053, parameters.baseHeight + towerHeight / 2, 5.139,
    0.019, towerHeight, 0.022, materials.outline);
}

// Broad shallow shed roof over the balcony face, with a notch at the left rear.
const canopyOutline = [
  [-5.32, 5.28],
  [3.20, 5.28],
  [3.20, -0.05],
  [-3.68, -0.05],
  [-3.68, 2.27],
  [-5.32, 2.27]
];

const canopyThickness = 0.14;
const canopyBackY = roofY + 0.47;
const canopySlope = -0.47 / 5.28;
const canopyGeometry = polygonGeometry(canopyOutline, canopyThickness);
const canopyPositions = canopyGeometry.attributes.position;

for (let i = 0; i < canopyPositions.count; i++) {
  canopyPositions.setY(
    i,
    canopyPositions.getY(i) +
    canopyBackY +
    canopySlope * canopyPositions.getZ(i)
  );
}
canopyPositions.needsUpdate = true;
canopyGeometry.computeVertexNormals();
canopyGeometry.computeBoundingBox();
canopyGeometry.computeBoundingSphere();
addMesh(canopyGeometry, materials.roof);

canopyOutline.forEach((p, i) => {
  const q = canopyOutline[(i + 1) % canopyOutline.length];
  beam(
    new THREE.Vector3(
      p[0], canopyBackY + canopySlope * p[1] + canopyThickness, p[1]
    ),
    new THREE.Vector3(
      q[0], canopyBackY + canopySlope * q[1] + canopyThickness, q[1]
    ),
    0.018
  );
});

// Triangular rooftop crown: a tall pale fascia and a recessed gray roof
// enclosed by a low, sharply outlined triangular rim.
const crownOutline = [
  [-3.60, 0],
  [parameters.frontRight, 0],
  [-0.05, -5.57]
];
const crownInner = insetPolygon(crownOutline, 0.89);
const crownBottomY = roofY + 0.47;
const crownDeckY = roofY + 1.72;
const crownRimHeight = 0.22;

prism(crownOutline, crownBottomY, crownDeckY - crownBottomY, materials.concrete);
prism(crownInner, crownDeckY, 0.045, materials.roof);
prism(crownOutline, crownDeckY, crownRimHeight, materials.trim, [crownInner]);

outlinePolygon(crownOutline, crownBottomY);
outlinePolygon(crownOutline, crownDeckY + crownRimHeight, 0.018);
outlinePolygon(crownInner, crownDeckY + crownRimHeight, 0.016);
outlinedCorners(crownOutline, crownBottomY, crownDeckY + crownRimHeight);

// Slightly elevated front-left view reveals the narrow fins, balcony recesses,
// diagonal rear wing, and both roof enclosures.
camera.position.set(-12.5, 42.5, 43.0);
camera.lookAt(-0.25, 16.5, -0.5);