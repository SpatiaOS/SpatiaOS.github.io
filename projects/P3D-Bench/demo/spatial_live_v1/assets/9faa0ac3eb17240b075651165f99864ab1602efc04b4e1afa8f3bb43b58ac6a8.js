// Industrial manipulator reconstructed from the reference.
// Y is vertical. The horizontal tool barrel runs along X; hinge pins run along Z.
// Dimensions are proportional engineering units (approximately 100 mm per unit).

const robot = {
  baseWidth: 4.65,
  baseDepth: 3.85,
  baseHeight: 0.76,
  baseBottom: 0.04,

  turretX: 0.22,
  turretRadius: 1.12,

  shoulderX: 0.15,
  shoulderY: 3.06,
  shoulderRadius: 0.91,
  shoulderShaftLength: 1.12,

  elbowX: -0.98,
  elbowY: 6.12,
  armDepth: 1.02,

  barrelY: 6.61,
  barrelZ: 0,
  barrelFront: -3.78,
  barrelBack: -0.78,
  barrelRadius: 0.445,

  radialSegments: 64
};

const materials = {
  casting: new THREE.MeshStandardMaterial({
    color: 0x999b9e, metalness: 0.28, roughness: 0.64
  }),
  castingSide: new THREE.MeshStandardMaterial({
    color: 0x85888c, metalness: 0.25, roughness: 0.68
  }),
  panel: new THREE.MeshStandardMaterial({
    color: 0xa5a7aa, metalness: 0.24, roughness: 0.61
  }),
  panelDark: new THREE.MeshStandardMaterial({
    color: 0x909397, metalness: 0.25, roughness: 0.65
  }),
  steel: new THREE.MeshStandardMaterial({
    color: 0xb9bdc1, metalness: 0.52, roughness: 0.40
  }),
  steelSide: new THREE.MeshStandardMaterial({
    color: 0x9b9fa4, metalness: 0.47, roughness: 0.46
  }),
  seam: new THREE.MeshStandardMaterial({
    color: 0x4d5156, metalness: 0.22, roughness: 0.73
  }),
  recess: new THREE.MeshStandardMaterial({
    color: 0x34383d, metalness: 0.12, roughness: 0.85
  })
};

// ---------- Geometry helpers ----------

function addRobotMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function polygonShape(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();
  return shape;
}

function plateXY(points, depth, zCenter, material, bevel = 0.025) {
  const b = Math.min(bevel, depth * 0.24);
  const geometry = new THREE.ExtrudeGeometry(polygonShape(points), {
    depth: depth - 2 * b,
    steps: 1,
    bevelEnabled: b > 0,
    bevelSegments: 1,
    bevelSize: b,
    bevelThickness: b,
    curveSegments: 24
  });
  const mesh = addRobotMesh(geometry, material);
  mesh.position.z = zCenter - depth / 2 + b;
  return mesh;
}

function bevelBox(width, height, depth, x, y, z, material, bevel = 0.025) {
  const b = Math.min(bevel, width / 5, height / 5, depth / 5);
  const points = [
    [-width / 2 + b, -height / 2 + b],
    [ width / 2 - b, -height / 2 + b],
    [ width / 2 - b,  height / 2 - b],
    [-width / 2 + b,  height / 2 - b]
  ];
  const mesh = plateXY(points, depth, z, material, b);
  mesh.position.x = x;
  mesh.position.y = y;
  return mesh;
}

function axisCylinder(start, end, radiusStart, radiusEnd, material, segments = robot.radialSegments) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const geometry = new THREE.CylinderGeometry(
    radiusEnd, radiusStart, direction.length(), segments, 1, false
  );
  const mesh = addRobotMesh(geometry, material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), direction.normalize()
  );
  return mesh;
}

function cylinderX(x0, x1, radius, y, z, material, segments = robot.radialSegments) {
  return axisCylinder([x0, y, z], [x1, y, z], radius, radius, material, segments);
}

function cylinderY(y0, y1, radius, x, z, material, segments = robot.radialSegments) {
  return axisCylinder([x, y0, z], [x, y1, z], radius, radius, material, segments);
}

function cylinderZ(z0, z1, radius, x, y, material, segments = robot.radialSegments) {
  return axisCylinder([x, y, z0], [x, y, z1], radius, radius, material, segments);
}

function torusRing(radius, thickness, center, normal, material) {
  const mesh = addRobotMesh(
    new THREE.TorusGeometry(radius, thickness, 8, robot.radialSegments),
    material
  );
  mesh.position.set(...center);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(...normal).normalize()
  );
  return mesh;
}

function annularRing(outerRadius, innerRadius, depth, center, normal, material) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: false, steps: 1, curveSegments: 48
  });
  geometry.translate(0, 0, -depth / 2);

  const mesh = addRobotMesh(geometry, material);
  mesh.position.set(...center);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(...normal).normalize()
  );
  return mesh;
}

function horizontalPlate(pointsXZ, bottom, height, material, holes = [], bevel = 0.022) {
  const shape = polygonShape(pointsXZ.map(([x, z]) => [x, -z]));

  for (const holeData of holes) {
    const hole = new THREE.Path();
    hole.absarc(holeData.x, -holeData.z, holeData.radius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height - bevel * 2,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 1,
    steps: 1,
    curveSegments: 24
  });

  const mesh = addRobotMesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = bottom + bevel;
  return mesh;
}

function turnedBarrel(profile, material) {
  const points = profile.map(([x, radius]) => new THREE.Vector2(radius, x));
  const mesh = addRobotMesh(
    new THREE.LatheGeometry(points, robot.radialSegments),
    material
  );
  mesh.rotation.z = -Math.PI / 2;
  mesh.position.set(0, robot.barrelY, robot.barrelZ);
  return mesh;
}

function chamferedRectangle(cx, cz, width, depth, chamfer) {
  const x0 = cx - width / 2, x1 = cx + width / 2;
  const z0 = cz - depth / 2, z1 = cz + depth / 2;
  return [
    [x0 + chamfer, z0], [x1 - chamfer, z0],
    [x1, z0 + chamfer], [x1, z1 - chamfer],
    [x1 - chamfer, z1], [x0 + chamfer, z1],
    [x0, z1 - chamfer], [x0, z0 + chamfer]
  ];
}

// ---------- Stepped square foundation and drilled mounting ears ----------

const hx = robot.baseWidth / 2;
const hz = robot.baseDepth / 2;
const deckY = robot.baseBottom + robot.baseHeight;

// Deep corner reliefs expose the low mounting tabs.
const baseOutline = [
  [-hx, -hz + 0.62],
  [-hx + 0.50, -hz + 0.62],
  [-hx + 0.72, -hz + 0.40],
  [-hx + 0.72, -hz],
  [ hx - 0.72, -hz],
  [ hx - 0.72, -hz + 0.40],
  [ hx - 0.50, -hz + 0.62],
  [ hx, -hz + 0.62],
  [ hx, hz - 0.62],
  [ hx - 0.50, hz - 0.62],
  [ hx - 0.72, hz - 0.40],
  [ hx - 0.72, hz],
  [-hx + 0.72, hz],
  [-hx + 0.72, hz - 0.40],
  [-hx + 0.50, hz - 0.62],
  [-hx, hz - 0.62]
];

horizontalPlate(
  baseOutline, robot.baseBottom, robot.baseHeight,
  [materials.casting, materials.castingSide]
);

for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    const cx = sx * (hx - 0.32);
    const cz = sz * (hz - 0.20);

    horizontalPlate(
      chamferedRectangle(cx, cz, 0.98, 0.84, 0.12),
      0, 0.25,
      [materials.panel, materials.castingSide],
      [
        { x: cx - 0.17, z: cz + sz * 0.05, radius: 0.076 },
        { x: cx + 0.17, z: cz + sz * 0.05, radius: 0.076 }
      ]
    );
  }
}

// Raised pads and interrupted edges on the front of the base.
for (const z of [-0.98, 0.98]) {
  bevelBox(
    0.62, 0.095, 0.57,
    -hx + 0.32, deckY + 0.025, z,
    [materials.panel, materials.castingSide], 0.015
  );
}

// Small framed identification plate, without introducing a texture.
bevelBox(0.045, 0.39, 0.71, -hx - 0.015, 0.39, -0.34, materials.seam, 0.01);
bevelBox(0.055, 0.33, 0.63, -hx - 0.038, 0.39, -0.34, materials.steel, 0.01);
bevelBox(0.058, 0.285, 0.57, -hx - 0.044, 0.39, -0.34, materials.panel, 0.007);

for (const y of [0.265, 0.515]) {
  for (const z of [-0.60, -0.08]) {
    cylinderX(-hx - 0.078, -hx - 0.064, 0.017, y, z, materials.seam, 12);
  }
}

// Two small circular connector caps visible on the front face.
for (const y of [0.25, 0.47]) {
  cylinderX(-hx - 0.11, -hx + 0.008, 0.080, y, 0.86, materials.steel, 24);
  cylinderX(-hx - 0.12, -hx - 0.112, 0.050, y, 0.86, materials.panelDark, 24);
}

for (const z of [1.08, 1.19]) {
  bevelBox(0.014, 0.66, 0.019, -hx - 0.009, 0.40, z, materials.seam, 0);
}

// ---------- Concentric vertical-axis turntable ----------

const tx = robot.turretX;
const tr = robot.turretRadius;

cylinderY(deckY, deckY + 0.06, tr * 0.97, tx, 0, materials.seam);
cylinderY(deckY + 0.04, deckY + 0.15, tr, tx, 0, materials.steel);
cylinderY(deckY + 0.15, deckY + 0.35, tr * 0.96, tx, 0, materials.casting);
cylinderY(deckY + 0.34, deckY + 0.43, tr * 1.025, tx, 0, materials.steel);
cylinderY(deckY + 0.43, deckY + 0.55, tr * 1.065, tx, 0, materials.casting);
cylinderY(deckY + 0.55, deckY + 0.65, tr, tx, 0, materials.steel);

axisCylinder(
  [tx, deckY + 0.64, 0], [tx, deckY + 0.83, 0],
  1.04, 0.81, materials.casting
);
cylinderY(deckY + 0.74, deckY + 1.50, 0.79, tx, 0, materials.casting);
cylinderY(deckY + 1.47, deckY + 1.56, 0.81, tx, 0, materials.panel);

for (const [y, radius] of [
  [deckY + 0.145, tr],
  [deckY + 0.35, tr * 0.965],
  [deckY + 0.555, tr * 1.015],
  [deckY + 1.47, 0.795]
]) {
  torusRing(radius, 0.010, [tx, y, 0], [0, 1, 0], materials.seam);
}

// ---------- Angular lower saddle above the turntable ----------

const sx = robot.shoulderX;
const sy = robot.shoulderY;

const saddleOutline = [
  [sx - 1.03, 2.57],
  [sx - 0.97, 2.22],
  [sx - 0.50, 1.50],
  [sx + 0.42, 1.39],
  [sx + 0.89, 1.73],
  [sx + 0.88, 2.80],
  [sx + 0.45, 3.15],
  [sx - 0.35, 3.12]
];

plateXY(
  saddleOutline, 1.23, 0.02,
  [materials.casting, materials.castingSide], 0.055
);

// Broad, differently angled-looking casting panels beneath the large bearing.
plateXY([
  [sx - 0.96, 2.23],
  [sx - 0.49, 1.51],
  [sx + 0.40, 1.41],
  [sx + 0.15, 1.78],
  [sx - 0.22, 2.43]
], 0.035, 0.645, materials.panelDark, 0.008);

plateXY([
  [sx - 0.20, 2.44],
  [sx + 0.17, 1.77],
  [sx + 0.42, 1.42],
  [sx + 0.87, 1.75],
  [sx + 0.86, 2.77]
], 0.035, 0.646, materials.panel, 0.008);

plateXY([
  [sx - 1.01, 2.56],
  [sx + 0.86, 2.79],
  [sx + 0.86, 2.65],
  [sx - 0.97, 2.41]
], 0.055, 0.664, materials.steelSide, 0.01);

// Rear cylindrical shoulder housing and a small projecting drive enclosure.
cylinderZ(-0.96, -0.39, 0.67, sx, sy, materials.casting);
cylinderZ(-1.01, -0.90, 0.71, sx, sy, materials.panel);
torusRing(0.65, 0.012, [sx, sy, -1.015], [0, 0, 1], materials.seam);

bevelBox(
  0.72, 0.43, 0.66,
  sx - 1.12, sy + 0.47, -0.26,
  [materials.panel, materials.castingSide], 0.065
);
bevelBox(
  0.075, 0.34, 0.55,
  sx - 1.47, sy + 0.47, -0.26,
  materials.steelSide, 0.018
);

// ---------- Broad, tapered, inclined main arm ----------

const armDX = robot.elbowX - sx;
const armDY = robot.elbowY - sy;
const armLength = Math.hypot(armDX, armDY);
const armDirection = { x: armDX / armLength, y: armDY / armLength };
const armNormal = { x: armDirection.y, y: -armDirection.x };

function armPoint(across, fraction) {
  return [
    sx + armDirection.x * armLength * fraction + armNormal.x * across,
    sy + armDirection.y * armLength * fraction + armNormal.y * across
  ];
}

// Section changes reproduce the angular taper and transverse panel seams.
const armSections = [
  { t: -0.035, left: 0.52, right: 0.52 },
  { t:  0.20,  left: 0.66, right: 0.65 },
  { t:  0.36,  left: 0.62, right: 0.57 },
  { t:  0.66,  left: 0.53, right: 0.49 },
  { t:  0.84,  left: 0.47, right: 0.43 },
  { t:  1.00,  left: 0.36, right: 0.34 }
];

function armOutline(sections) {
  return [
    ...sections.map(s => armPoint(s.right, s.t)),
    ...sections.slice().reverse().map(s => armPoint(-s.left, s.t))
  ];
}

plateXY(
  armOutline(armSections.slice(0, -1)),
  robot.armDepth - 0.22, 0,
  [materials.casting, materials.castingSide], 0.035
);

// Separate side cheeks leave the uppermost fork open beneath the barrel.
const cheekCenter = robot.armDepth / 2 - 0.055;
for (const z of [-cheekCenter, cheekCenter]) {
  plateXY(
    armOutline(armSections), 0.14, z,
    [materials.panelDark, materials.castingSide], 0.023
  );
}

// Slightly raised face panels leave thin, dark casting divisions between sections.
for (let i = 0; i < armSections.length - 1; i++) {
  const a = armSections[i];
  const b = armSections[i + 1];
  const gap = 0.003;
  const points = [
    armPoint(-a.left + 0.026, a.t + gap),
    armPoint( a.right - 0.026, a.t + gap),
    armPoint( b.right - 0.026, b.t - gap),
    armPoint(-b.left + 0.026, b.t - gap)
  ];
  plateXY(
    points, 0.018, cheekCenter + 0.073,
    i % 2 === 0 ? materials.panel : materials.casting,
    0.004
  );
}

// Visible cross-pin inside the upper fork.
cylinderZ(-0.62, 0.64, 0.225, robot.elbowX, robot.elbowY, materials.steelSide);
cylinderZ(0.57, 0.66, 0.255, robot.elbowX, robot.elbowY, materials.steel);
cylinderZ(0.66, 0.685, 0.092, robot.elbowX, robot.elbowY, materials.panelDark, 6);

// ---------- Slender outer return linkage and its open triangular gap ----------

const upperLink = {
  x: robot.elbowX + 0.95,
  y: robot.elbowY + 0.10
};
const lowerLink = {
  x: sx + 1.08,
  y: sy + 0.18
};
const linkBend = {
  x: lowerLink.x - 0.035,
  y: lowerLink.y + 1.04
};

plateXY([
  [upperLink.x - 0.15, upperLink.y - 0.06],
  [upperLink.x + 0.08, upperLink.y + 0.12],
  [linkBend.x + 0.14, linkBend.y + 0.08],
  [lowerLink.x + 0.14, lowerLink.y],
  [lowerLink.x - 0.13, lowerLink.y - 0.07],
  [linkBend.x - 0.14, linkBend.y - 0.03]
], 0.20, 0.10, [materials.panelDark, materials.castingSide], 0.025);

// Lower connecting lug is largely hidden behind the shoulder wheel.
plateXY([
  [sx - 0.06, sy - 0.13],
  [lowerLink.x + 0.02, lowerLink.y - 0.13],
  [lowerLink.x + 0.02, lowerLink.y + 0.13],
  [sx - 0.06, sy + 0.13]
], 0.26, 0.10, materials.casting, 0.035);

cylinderZ(-0.10, 0.30, 0.18, lowerLink.x, lowerLink.y, materials.steelSide);
cylinderZ(0.30, 0.35, 0.105, lowerLink.x, lowerLink.y, materials.steel, 12);

// Teardrop-like upper bracket beside the rear barrel flange.
plateXY([
  [upperLink.x - 0.40, upperLink.y - 0.22],
  [upperLink.x - 0.42, upperLink.y - 0.05],
  [upperLink.x - 0.15, upperLink.y + 0.30],
  [upperLink.x + 0.10, upperLink.y + 0.28],
  [upperLink.x + 0.15, upperLink.y + 0.09],
  [upperLink.x + 0.09, upperLink.y - 0.11],
  [upperLink.x - 0.06, upperLink.y - 0.22]
], 0.17, 0.56, [materials.panel, materials.castingSide], 0.04);

cylinderZ(-0.17, 0.65, 0.15, upperLink.x, upperLink.y, materials.steelSide);
cylinderZ(0.64, 0.675, 0.092, upperLink.x, upperLink.y, materials.panel, 24);

// ---------- Large concentric shoulder bearing and square-ended spindle ----------

const sr = robot.shoulderRadius;

cylinderZ(-0.40, 0.48, sr * 0.65, sx, sy, materials.steelSide);
cylinderZ(0.32, 0.53, sr * 0.84, sx, sy, materials.casting);
cylinderZ(0.48, 0.66, sr, sx, sy, materials.steelSide);

axisCylinder(
  [sx, sy, 0.66], [sx, sy, 0.78],
  sr * 1.035, sr, materials.steel
);

cylinderZ(0.77, 0.86, sr * 0.945, sx, sy, materials.casting);
cylinderZ(0.85, 0.90, sr * 0.875, sx, sy, materials.panel);

annularRing(sr * 0.915, sr * 0.755, 0.075, [sx, sy, 0.914], [0, 0, 1], materials.steel);
annularRing(sr * 0.785, sr * 0.595, 0.045, [sx, sy, 0.950], [0, 0, 1], materials.steelSide);
cylinderZ(0.90, 0.976, sr * 0.595, sx, sy, materials.panel);

for (const [radius, z] of [
  [sr * 0.995, 0.785],
  [sr * 0.852, 0.957],
  [sr * 0.737, 0.978],
  [sr * 0.598, 0.981]
]) {
  torusRing(radius, 0.010, [sx, sy, z], [0, 0, 1], materials.seam);
}

// The reference has a long chamfered rectangular shaft, not a round crank.
bevelBox(0.57, 0.50, 0.038, sx, sy, 0.985, materials.seam, 0.025);

const shaftWidth = 0.48;
const shaftHeight = 0.42;
const shaftChamfer = 0.055;
const shaftStart = 0.975;
const shaftEnd = shaftStart + robot.shoulderShaftLength;
const sw = shaftWidth / 2;
const sh = shaftHeight / 2;

const shaftProfile = [
  [sx - sw + shaftChamfer, sy - sh],
  [sx + sw - shaftChamfer, sy - sh],
  [sx + sw, sy - sh + shaftChamfer],
  [sx + sw, sy + sh - shaftChamfer],
  [sx + sw - shaftChamfer, sy + sh],
  [sx - sw + shaftChamfer, sy + sh],
  [sx - sw, sy + sh - shaftChamfer],
  [sx - sw, sy - sh + shaftChamfer]
];

plateXY(
  shaftProfile, robot.shoulderShaftLength, (shaftStart + shaftEnd) / 2,
  [materials.steel, materials.steelSide], 0.008
);

cylinderZ(shaftEnd - 0.035, shaftEnd + 0.065, 0.32, sx, sy, materials.steelSide, 8);

// An actual hexagonal socket in the octagonal end cap.
const endOuter = [];
const endInner = [];
for (let i = 0; i < 8; i++) {
  const angle = Math.PI / 8 + i * Math.PI / 4;
  endOuter.push([Math.cos(angle) * 0.292, Math.sin(angle) * 0.292]);
}
for (let i = 0; i < 6; i++) {
  const angle = -i * Math.PI / 3;
  endInner.push([Math.cos(angle) * 0.155, Math.sin(angle) * 0.155]);
}

const socketShape = polygonShape(endOuter);
const socketHole = new THREE.Path();
socketHole.moveTo(...endInner[0]);
for (let i = 1; i < endInner.length; i++) socketHole.lineTo(...endInner[i]);
socketHole.closePath();
socketShape.holes.push(socketHole);

const socketGeometry = new THREE.ExtrudeGeometry(socketShape, {
  depth: 0.085, steps: 1, bevelEnabled: false
});
const socketMesh = addRobotMesh(socketGeometry, materials.steel);
socketMesh.position.set(sx, sy, shaftEnd + 0.063);

cylinderZ(
  shaftEnd + 0.065, shaftEnd + 0.068,
  0.15, sx, sy, materials.recess, 6
);

// ---------- Horizontal cylindrical upper assembly ----------

const by = robot.barrelY;
const bz = robot.barrelZ;
const front = robot.barrelFront;
const back = robot.barrelBack;
const radialScale = robot.barrelRadius / 0.445;

cylinderX(front, back, robot.barrelRadius, by, bz, materials.casting);

// Turned front collar: neck, tapered shoulder, two broad rims, and rear sleeve.
turnedBarrel([
  [front - 0.76, 0],
  [front - 0.76, 0.235],
  [front - 0.72, 0.280],
  [front - 0.66, 0.280],
  [front - 0.66, 0.330],
  [front - 0.56, 0.330],
  [front - 0.48, 0.445],
  [front - 0.41, 0.490],
  [front - 0.41, 0.535],
  [front - 0.34, 0.580],
  [front - 0.25, 0.580],
  [front - 0.25, 0.535],
  [front - 0.18, 0.535],
  [front - 0.18, 0.553],
  [front - 0.10, 0.553],
  [front - 0.04, 0.505],
  [front + 0.15, 0.505],
  [front + 0.22, 0.479],
  [front + 0.31, 0.479],
  [front + 0.31, 0]
].map(([x, r]) => [x, r * radialScale]), materials.steelSide);

// Rear clamp flange and stepped end cap.
turnedBarrel([
  [back - 0.17, 0],
  [back - 0.17, 0.445],
  [back - 0.10, 0.445],
  [back - 0.10, 0.487],
  [back + 0.02, 0.487],
  [back + 0.04, 0.530],
  [back + 0.10, 0.530],
  [back + 0.10, 0.590],
  [back + 0.17, 0.610],
  [back + 0.25, 0.610],
  [back + 0.25, 0.550],
  [back + 0.33, 0.550],
  [back + 0.33, 0.570],
  [back + 0.40, 0.570],
  [back + 0.50, 0.490],
  [back + 0.56, 0.490],
  [back + 0.56, 0]
].map(([x, r]) => [x, r * radialScale]), materials.steelSide);

// Narrow dark parting lines emphasize the machined concentric rings.
for (const [x, radius] of [
  [front - 0.69, 0.282],
  [front - 0.42, 0.493],
  [front - 0.30, 0.580],
  [front - 0.15, 0.553],
  [front + 0.23, 0.480],
  [back - 0.075, 0.489],
  [back + 0.07, 0.532],
  [back + 0.21, 0.610],
  [back + 0.355, 0.571]
]) {
  torusRing(radius * radialScale, 0.009, [x, by, bz], [1, 0, 0], materials.seam);
}

cylinderX(back + 0.53, back + 0.66, 0.495, by, bz, materials.panel, 12);
cylinderX(back + 0.65, back + 0.71, 0.355, by, bz, materials.steelSide, 32);

// Under-barrel saddle bridges the open upper arm cheeks.
bevelBox(
  0.68, 0.22, 0.68,
  robot.elbowX + 0.03, by - 0.48, bz,
  [materials.casting, materials.castingSide], 0.04
);

// Two short rectangular rear lugs are a distinctive feature of the reference.
for (const dy of [0.34, -0.12]) {
  bevelBox(
    0.59, 0.19, 0.285,
    back + 0.93, by + dy, bz,
    [materials.panel, materials.steelSide], 0.027
  );
  bevelBox(
    0.040, 0.194, 0.291,
    back + 1.165, by + dy, bz,
    materials.steelSide, 0.009
  );
}

// ---------- Compact wrist and fork-like tool at the left end ----------

cylinderX(front - 0.97, front - 0.73, 0.183, by, bz, materials.steel);
cylinderX(front - 1.09, front - 0.88, 0.255, by, bz, materials.steelSide);
torusRing(0.251, 0.010, [front - 1.04, by, bz], [1, 0, 0], materials.seam);

cylinderX(front - 1.43, front - 1.06, 0.186, by, bz, materials.steelSide);

// Closely spaced ribs on the small end coupling.
for (const x of [front - 1.40, front - 1.31, front - 1.22]) {
  cylinderX(x - 0.021, x + 0.021, 0.234, by, bz, materials.steel);
  torusRing(0.233, 0.008, [x - 0.015, by, bz], [1, 0, 0], materials.seam);
}

const jawAnchor = front - 1.01;
const jawProfile = [
  [jawAnchor + 0.025, by + 0.155],
  [jawAnchor - 0.300, by + 0.155],
  [jawAnchor - 0.535, by + 0.025],
  [jawAnchor - 0.560, by - 0.155],
  [jawAnchor - 0.415, by - 0.235],
  [jawAnchor - 0.105, by - 0.150],
  [jawAnchor + 0.045, by - 0.020]
];

// Parallel beveled cheek jaws with a visible central gap.
for (const side of [-1, 1]) {
  plateXY(
    jawProfile, 0.105, bz + side * 0.245,
    [materials.panel, materials.steelSide], 0.025
  );

  const z0 = bz + side * 0.300;
  const z1 = bz + side * 0.345;
  cylinderZ(
    Math.min(z0, z1), Math.max(z0, z1),
    0.070, jawAnchor - 0.10, by + 0.005,
    materials.steel, 16
  );
}

const toolTipX = front - 1.66;
const toolTipY = by - 0.13;

cylinderX(toolTipX, toolTipX + 0.24, 0.120, toolTipY, bz, materials.steelSide, 12);
annularRing(
  0.160, 0.098, 0.055,
  [toolTipX - 0.013, toolTipY, bz],
  [1, 0, 0], materials.steel
);
cylinderX(
  toolTipX - 0.017, toolTipX - 0.012,
  0.095, toolTipY, bz, materials.recess, 32
);
torusRing(
  0.135, 0.013,
  [toolTipX - 0.043, toolTipY, bz],
  [1, 0, 0], materials.steelSide
);

// View from the tool end and the exposed shoulder-spindle side.
camera.position.set(-11.6, 11.5, 10.8);
camera.lookAt(-1.25, 3.6, 0);