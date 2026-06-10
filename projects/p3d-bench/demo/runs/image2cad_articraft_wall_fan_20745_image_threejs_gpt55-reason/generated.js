// -------------------------
// Parametric interpretation
// -------------------------
// The reference is modeled as a compact wall-mounted/ceiling-mounted circular fan:
// - Horizontal circular wire safety cage with dense radial ribs and outer hoop.
// - Central vertical cylindrical motor housing with top vents, switch, screws, and base fins.
// - Internal swept fan blades visible through the grille.
// - Side pivot/yoke bracket connected to a tapered support arm.
// - Large shallow concave wall mounting dish with thin stabilizer rods.

const TAU = Math.PI * 2;

// Overall guard / fan head proportions
const guardOuterRadius = 4.0;
const guardInnerRadius = 1.62;
const guardTopY = 0.48;
const guardBottomY = -0.42;
const guardWireRadius = 0.024;
const guardRibCount = 80;

// Motor housing proportions
const motorBodyRadius = 1.36;
const motorBodyHeight = 1.35;
const motorBaseRadius = 1.58;
const motorBaseHeight = 0.42;
const motorBaseCenterY = 0.68;
const motorBodyCenterY = 1.52;
const motorTopCapHeight = 0.16;
const motorTopCapCenterY = motorBodyCenterY + motorBodyHeight / 2 + motorTopCapHeight / 2;
const motorTopSurfaceY = motorTopCapCenterY + motorTopCapHeight / 2;

// Arm and wall plate placement
const wallPlateCenter = new THREE.Vector3(8.25, 3.20, 0);
const wallPlateRadius = 2.35;
const armStartPoint = new THREE.Vector3(2.12, 1.55, 0);
const armEndPoint = new THREE.Vector3(wallPlateCenter.x - 0.72, wallPlateCenter.y - 0.05, 0);

// Materials
const bodyMat = new THREE.MeshStandardMaterial({
  color: 0xb8bcc0,
  metalness: 0.18,
  roughness: 0.48
});

const cageMat = new THREE.MeshStandardMaterial({
  color: 0xc8cbce,
  metalness: 0.22,
  roughness: 0.42
});

const darkMat = new THREE.MeshStandardMaterial({
  color: 0x1f2022,
  metalness: 0.1,
  roughness: 0.75
});

const bladeMat = new THREE.MeshStandardMaterial({
  color: 0x8e9296,
  metalness: 0.18,
  roughness: 0.58,
  side: THREE.DoubleSide
});

const seamMat = new THREE.MeshStandardMaterial({
  color: 0x303234,
  metalness: 0.1,
  roughness: 0.7
});

// -------------------------
// Helper functions
// -------------------------
function addMesh(mesh) {
  scene.add(mesh);
  return mesh;
}

function polarPoint(radius, y, angle) {
  return new THREE.Vector3(
    radius * Math.cos(angle),
    y,
    radius * Math.sin(angle)
  );
}

function cylinderBetween(start, end, radius, material, radialSegments = 12) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();

  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );

  return addMesh(mesh);
}

function taperedCylinderBetween(start, end, radiusStart, radiusEnd, material, radialSegments = 32) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();

  // CylinderGeometry radiusTop maps to the +Y end, radiusBottom to the -Y end.
  const geometry = new THREE.CylinderGeometry(radiusEnd, radiusStart, length, radialSegments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );

  return addMesh(mesh);
}

function addHorizontalTorus(radius, tubeRadius, y, material, tubularSegments = 160) {
  const geometry = new THREE.TorusGeometry(radius, tubeRadius, 12, tubularSegments);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  return addMesh(mesh);
}

function addWallTorus(radius, tubeRadius, x, y, z, material, tubularSegments = 128) {
  const geometry = new THREE.TorusGeometry(radius, tubeRadius, 12, tubularSegments);
  const mesh = new THREE.Mesh(geometry, material);

  // Default torus axis is Z; rotate so axis points along X for the wall dish.
  mesh.rotation.y = Math.PI / 2;
  mesh.position.set(x, y, z);

  return addMesh(mesh);
}

function addAnnularDisk(innerRadius, outerRadius, height, y, material, curveSegments = 128) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, TAU, false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, TAU, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: curveSegments
  });

  geometry.translate(0, 0, -height / 2);
  geometry.rotateX(-Math.PI / 2);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = y;

  return addMesh(mesh);
}

function addTubeThrough(points, radius, material, tubularSegments = 18, radialSegments = 8) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  const mesh = new THREE.Mesh(geometry, material);
  return addMesh(mesh);
}

function addRadialBox(angle, radius, y, radialLength, height, tangentialWidth, material) {
  const geometry = new THREE.BoxGeometry(radialLength, height, tangentialWidth);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(radius * Math.cos(angle), y, radius * Math.sin(angle));
  mesh.rotation.y = -angle;

  return addMesh(mesh);
}

function addCylinderSurfacePanel(angle, radius, yCenter, width, height, material) {
  const geometry = new THREE.BoxGeometry(width, height, 0.025);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(radius * Math.cos(angle), yCenter, radius * Math.sin(angle));
  mesh.rotation.y = Math.PI / 2 - angle;

  return addMesh(mesh);
}

function addRoundedSlot(x, z, length, width, angle, y, material) {
  const raisedHeight = 0.018;
  const bodyLength = Math.max(0.001, length - width);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(bodyLength, raisedHeight, width),
    material
  );
  body.position.set(x, y, z);
  body.rotation.y = -angle;
  addMesh(body);

  const dx = Math.cos(angle) * bodyLength / 2;
  const dz = Math.sin(angle) * bodyLength / 2;

  for (let s = -1; s <= 1; s += 2) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(width / 2, width / 2, raisedHeight, 16),
      material
    );
    cap.position.set(x + s * dx, y, z + s * dz);
    addMesh(cap);
  }
}

function addTopDisc(x, z, radius, y, material) {
  const geometry = new THREE.CylinderGeometry(radius, radius, 0.018, 24);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return addMesh(mesh);
}

function addFaceDiscOnWall(x, y, z, radius, depth, material) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, 24);
  const mesh = new THREE.Mesh(geometry, material);

  // Rotate cylinder axis from Y to X.
  mesh.rotation.z = -Math.PI / 2;
  mesh.position.set(x, y, z);

  return addMesh(mesh);
}

function armPoint(t) {
  return armStartPoint.clone().lerp(armEndPoint, t);
}

// -------------------------
// Internal swept fan blades
// -------------------------
function createBlade(angleOffset) {
  const bladeInnerRadius = 0.55;
  const bladeOuterRadius = 3.18;
  const bladeSegments = 16;
  const bladeY = -0.06;
  const thickness = 0.075;

  const edgeA = [];
  const edgeB = [];

  for (let i = 0; i <= bladeSegments; i++) {
    const t = i / bladeSegments;
    const radius = bladeInnerRadius + (bladeOuterRadius - bladeInnerRadius) * t;

    // Swept/twisted shape, wider toward the outer rim.
    const centerAngle = angleOffset + 0.58 * t - 0.12;
    const halfTangentialWidth = 0.11 + 0.38 * Math.sin(t * Math.PI / 2);
    const halfAngle = halfTangentialWidth / radius;

    const yCenter = bladeY + 0.03 * (1 - t);
    const pitch = 0.11 * (1 - 0.25 * t);

    const a1 = centerAngle - halfAngle;
    const a2 = centerAngle + halfAngle;

    edgeA.push({
      x: radius * Math.cos(a1),
      y: yCenter + pitch / 2,
      z: radius * Math.sin(a1)
    });

    edgeB.push({
      x: radius * Math.cos(a2),
      y: yCenter - pitch / 2,
      z: radius * Math.sin(a2)
    });
  }

  const loop = edgeA.concat(edgeB.slice().reverse());
  const positions = [];
  const indices = [];

  // Top vertices
  for (const p of loop) {
    positions.push(p.x, p.y, p.z);
  }

  // Bottom vertices
  for (const p of loop) {
    positions.push(p.x, p.y - thickness, p.z);
  }

  const n = loop.length;

  // Top face
  for (let i = 1; i < n - 1; i++) {
    indices.push(0, i, i + 1);
  }

  // Bottom face
  for (let i = 1; i < n - 1; i++) {
    indices.push(n, n + i + 1, n + i);
  }

  // Side faces
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    indices.push(i, j, n + j);
    indices.push(i, n + j, n + i);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, bladeMat);
  return addMesh(mesh);
}

for (let i = 0; i < 5; i++) {
  createBlade(i * TAU / 5 + 0.22);
}

// Central fan hub beneath the guard
const bladeHub = new THREE.Mesh(
  new THREE.CylinderGeometry(0.62, 0.70, 0.24, 48),
  bodyMat
);
bladeHub.position.y = -0.03;
addMesh(bladeHub);

addHorizontalTorus(0.62, 0.025, 0.10, seamMat, 96);

// -------------------------
// Circular wire safety cage
// -------------------------

// Solid lower outer rim ring
addAnnularDisk(guardOuterRadius - 0.52, guardOuterRadius + 0.10, 0.16, guardBottomY - 0.10, bodyMat, 128);

// Main upper and lower guard hoops
addHorizontalTorus(guardOuterRadius, 0.065, guardTopY, cageMat, 192);
addHorizontalTorus(guardOuterRadius, 0.075, guardBottomY, cageMat, 192);
addHorizontalTorus(guardInnerRadius, 0.05, guardTopY + 0.015, cageMat, 144);

// Concentric top guard rings
const topGuardRings = [2.15, 2.65, 3.12, 3.58];
for (const r of topGuardRings) {
  addHorizontalTorus(r, 0.030, guardTopY + 0.02, cageMat, 160);
}

// Concentric lower guard rings
const lowerGuardRings = [1.05, 1.85, 2.70, 3.45];
for (const r of lowerGuardRings) {
  addHorizontalTorus(r, 0.024, guardBottomY + 0.10, cageMat, 144);
}

// Curved ribs: each rib starts near the motor, travels outward, then turns down at the outer rim.
for (let i = 0; i < guardRibCount; i++) {
  const angle = i * TAU / guardRibCount;
  const thick = i % 10 === 0;
  const ribRadius = thick ? 0.036 : guardWireRadius;

  const points = [
    polarPoint(guardInnerRadius, guardTopY + 0.035, angle),
    polarPoint(2.25, guardTopY + 0.065, angle),
    polarPoint(3.42, guardTopY + 0.020, angle),
    polarPoint(guardOuterRadius - 0.04, 0.10, angle),
    polarPoint(guardOuterRadius - 0.02, guardBottomY, angle)
  ];

  addTubeThrough(points, ribRadius, cageMat, 18, thick ? 10 : 8);
}

// Lower underside spokes and a smaller underside hoop visible below the front rim.
addHorizontalTorus(guardOuterRadius - 0.62, 0.034, guardBottomY - 0.32, cageMat, 160);

for (let i = 0; i < guardRibCount; i += 2) {
  const angle = i * TAU / guardRibCount;

  cylinderBetween(
    polarPoint(0.82, guardBottomY + 0.10, angle),
    polarPoint(guardOuterRadius - 0.65, guardBottomY + 0.10, angle),
    0.016,
    cageMat,
    8
  );

  cylinderBetween(
    polarPoint(guardOuterRadius - 0.04, guardBottomY, angle),
    polarPoint(guardOuterRadius - 0.62, guardBottomY - 0.32, angle),
    0.017,
    cageMat,
    8
  );
}

// Small side latches/clips on the outer guard rim.
for (const angle of [0, Math.PI]) {
  addRadialBox(angle, guardOuterRadius + 0.09, guardBottomY - 0.02, 0.22, 0.34, 0.46, bodyMat);
  addRadialBox(angle, guardOuterRadius + 0.21, guardBottomY - 0.02, 0.05, 0.14, 0.20, darkMat);
}

// -------------------------
// Central motor housing
// -------------------------

// Raised annular mount at the center of the grille.
addAnnularDisk(motorBodyRadius * 0.96, guardInnerRadius + 0.22, 0.12, guardTopY + 0.035, bodyMat, 128);

// Lower motor skirt
const motorBase = new THREE.Mesh(
  new THREE.CylinderGeometry(motorBaseRadius, motorBaseRadius * 0.96, motorBaseHeight, 96),
  bodyMat
);
motorBase.position.y = motorBaseCenterY;
addMesh(motorBase);

// Main vertical motor cylinder
const motorBody = new THREE.Mesh(
  new THREE.CylinderGeometry(motorBodyRadius, motorBodyRadius, motorBodyHeight, 96),
  bodyMat
);
motorBody.position.y = motorBodyCenterY;
addMesh(motorBody);

// Top cap / service cover
const motorTopCap = new THREE.Mesh(
  new THREE.CylinderGeometry(motorBodyRadius * 1.03, motorBodyRadius * 1.08, motorTopCapHeight, 96),
  bodyMat
);
motorTopCap.position.y = motorTopCapCenterY;
addMesh(motorTopCap);

// Edged lips/seams
addHorizontalTorus(motorBaseRadius, 0.026, motorBaseCenterY + motorBaseHeight / 2, seamMat, 128);
addHorizontalTorus(motorBodyRadius, 0.022, motorBodyCenterY - motorBodyHeight / 2, seamMat, 128);
addHorizontalTorus(motorBodyRadius * 1.04, 0.024, motorTopSurfaceY - 0.01, seamMat, 128);

// Radial cooling fins around the motor base.
const finCount = 58;
for (let i = 0; i < finCount; i++) {
  const angle = i * TAU / finCount;

  // Leave a small visual gap at the right side where the yoke bracket attaches.
  if (Math.cos(angle) > 0.92 && Math.abs(Math.sin(angle)) < 0.42) continue;

  addRadialBox(
    angle,
    motorBaseRadius + 0.11,
    0.62,
    0.34,
    0.46,
    0.034,
    cageMat
  );
}

// A dark service-panel/notch on the visible side of the motor body.
addCylinderSurfacePanel(Math.PI * 0.72, motorBodyRadius + 0.016, 1.24, 0.42, 0.86, seamMat);

// Top cover slotted vents: dark raised/inset-looking shapes on the cap.
const slotY = motorTopSurfaceY + 0.014;

// Parallel slots on one half of the cover.
for (let i = -3; i <= 3; i++) {
  const z = i * 0.16 - 0.04;
  const x = -0.28 + Math.abs(i) * 0.035;
  const length = 0.78 - Math.abs(i) * 0.06;
  addRoundedSlot(x, z, length, 0.055, 0.12, slotY, darkMat);
}

// Fan-like radial vent slots near the rear/right part of the top cover.
const ventStart = -1.08;
const ventEnd = 1.08;
const ventCount = 20;
for (let i = 0; i < ventCount; i++) {
  const t = i / (ventCount - 1);
  const angle = ventStart + (ventEnd - ventStart) * t;
  const radius = 1.14;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);

  addRoundedSlot(x, z, 0.46, 0.052, angle, slotY, darkMat);
}

// Small switch block and lever on top.
const switchBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.46, 0.065, 0.26),
  darkMat
);
switchBase.position.set(-0.42, slotY + 0.040, -0.38);
switchBase.rotation.y = -0.18;
addMesh(switchBase);

const switchLever = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.11, 0.34),
  bodyMat
);
switchLever.position.set(-0.38, slotY + 0.115, -0.38);
switchLever.rotation.y = -0.62;
addMesh(switchLever);

// Screw heads / holes on top plate.
const topScrews = [
  [0.92, 0.62],
  [-0.94, 0.58],
  [0.58, -0.98],
  [-0.96, -0.70],
  [0.10, 1.10]
];

for (const s of topScrews) {
  addTopDisc(s[0], s[1], 0.062, slotY + 0.006, darkMat);
}

// Decorative seam line across the top cap.
addRoundedSlot(0.24, -0.98, 1.18, 0.026, 0.16, slotY + 0.004, seamMat);

// -------------------------
// Pivot bracket and tapered support arm
// -------------------------

// Block welded/attached to motor side.
const bracketBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.44, 0.58, 0.82),
  bodyMat
);
bracketBase.position.set(1.58, 1.48, 0);
addMesh(bracketBase);

// Clevis/yoke side plates.
for (const z of [-0.45, 0.45]) {
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.60, 0.13),
    bodyMat
  );
  plate.position.set(1.95, 1.48, z);
  addMesh(plate);
}

// Inner spacer block at yoke.
const yokeSpacer = new THREE.Mesh(
  new THREE.BoxGeometry(0.38, 0.36, 0.44),
  bodyMat
);
yokeSpacer.position.set(2.08, 1.50, 0);
addMesh(yokeSpacer);

// Pivot bolt and washers through the yoke.
cylinderBetween(
  new THREE.Vector3(1.86, 1.48, -0.62),
  new THREE.Vector3(1.86, 1.48, 0.62),
  0.16,
  seamMat,
  24
);

cylinderBetween(
  new THREE.Vector3(1.86, 1.48, -0.72),
  new THREE.Vector3(1.86, 1.48, -0.60),
  0.27,
  bodyMat,
  28
);

cylinderBetween(
  new THREE.Vector3(1.86, 1.48, 0.60),
  new THREE.Vector3(1.86, 1.48, 0.72),
  0.27,
  bodyMat,
  28
);

addFaceDiscOnWall(1.86, 1.48, 0.735, 0.09, 0.018, darkMat);

// Tapered support arm and collars.
taperedCylinderBetween(armPoint(0.00), armPoint(0.16), 0.42, 0.48, bodyMat, 32);
taperedCylinderBetween(armPoint(0.13), armPoint(0.82), 0.43, 0.60, bodyMat, 48);
cylinderBetween(armPoint(0.79), armPoint(1.00), 0.62, bodyMat, 48);

// Narrow dark seams/collars along the arm.
cylinderBetween(armPoint(0.145), armPoint(0.175), 0.51, seamMat, 32);
cylinderBetween(armPoint(0.785), armPoint(0.815), 0.64, seamMat, 32);

// -------------------------
// Wall mounting dish / concave plate
// -------------------------

// Lathed shallow dish: a rounded saucer/lens profile revolved around its axis.
const dishProfile = [
  new THREE.Vector2(0.00, -0.48),
  new THREE.Vector2(0.35, -0.50),
  new THREE.Vector2(1.08, -0.40),
  new THREE.Vector2(1.78, -0.22),
  new THREE.Vector2(2.24, 0.03),
  new THREE.Vector2(2.40, 0.22),
  new THREE.Vector2(2.30, 0.40),
  new THREE.Vector2(1.55, 0.33),
  new THREE.Vector2(0.62, 0.12),
  new THREE.Vector2(0.00, -0.22)
];

const dishGeometry = new THREE.LatheGeometry(dishProfile, 112);
const wallDish = new THREE.Mesh(dishGeometry, bodyMat);

// Lathe axis is local Y; rotate it so the dish axis points along world X.
wallDish.rotation.z = -Math.PI / 2;
wallDish.position.copy(wallPlateCenter);
addMesh(wallDish);

// Raised rim and subtle inner contour rings on the wall plate.
addWallTorus(wallPlateRadius, 0.060, wallPlateCenter.x + 0.03, wallPlateCenter.y, wallPlateCenter.z, bodyMat, 160);
addWallTorus(1.54, 0.020, wallPlateCenter.x - 0.26, wallPlateCenter.y, wallPlateCenter.z, seamMat, 128);

// Central boss connecting arm to dish.
cylinderBetween(
  new THREE.Vector3(wallPlateCenter.x - 0.92, wallPlateCenter.y, 0),
  new THREE.Vector3(wallPlateCenter.x - 0.10, wallPlateCenter.y, 0),
  0.56,
  bodyMat,
  48
);

cylinderBetween(
  new THREE.Vector3(wallPlateCenter.x - 0.95, wallPlateCenter.y, 0),
  new THREE.Vector3(wallPlateCenter.x - 0.84, wallPlateCenter.y, 0),
  0.62,
  seamMat,
  48
);

// Wall plate screw heads arranged around the dish.
for (let i = 0; i < 6; i++) {
  const angle = i * TAU / 6 + Math.PI / 6;
  const r = 1.55;

  addFaceDiscOnWall(
    wallPlateCenter.x - 0.38,
    wallPlateCenter.y + r * Math.cos(angle),
    wallPlateCenter.z + r * Math.sin(angle),
    0.075,
    0.025,
    darkMat
  );
}

// Thin stabilizer rods visible around the main arm.
cylinderBetween(
  new THREE.Vector3(1.05, 2.12, -0.78),
  new THREE.Vector3(wallPlateCenter.x - 0.30, wallPlateCenter.y + 0.06, -0.78),
  0.018,
  cageMat,
  8
);

const lowerStrutStart = armPoint(0.70).add(new THREE.Vector3(0, 0, 0.26));
const lowerStrutEnd = new THREE.Vector3(wallPlateCenter.x - 0.42, wallPlateCenter.y - 1.54, 0.26);

cylinderBetween(lowerStrutStart, lowerStrutEnd, 0.032, cageMat, 10);

const strutKnob1 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 8), seamMat);
strutKnob1.position.copy(lowerStrutStart);
addMesh(strutKnob1);

const strutKnob2 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 8), seamMat);
strutKnob2.position.copy(lowerStrutEnd);
addMesh(strutKnob2);

// A second slimmer brace offset behind the arm.
cylinderBetween(
  new THREE.Vector3(2.00, 1.82, 0.70),
  new THREE.Vector3(wallPlateCenter.x - 0.18, wallPlateCenter.y - 0.08, 0.70),
  0.017,
  cageMat,
  8
);

// -------------------------
// Camera placement
// -------------------------
camera.position.set(8.2, 6.1, 8.8);
camera.lookAt(2.6, 1.05, 0);