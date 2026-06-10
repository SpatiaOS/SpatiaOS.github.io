{
// Parameters: proportions interpreted as a Bionicle-style mechanical creature:
// tall articulated legs, broad arched torso shell, small raptor-like head,
// exposed linkages, circular holes/bolts, fins, rear rods, and asymmetric claws.
const deg = Math.PI / 180;
const frontZ = -1;

// Overall scale reference
const modelHeight = 12.2;
const torsoY = 7.2;
const groundY = 0;

// Materials: gray plastic/metal with dark "ink-outline" mechanical details.
const matLight = new THREE.MeshStandardMaterial({
  color: 0xb9bec4,
  metalness: 0.18,
  roughness: 0.52,
  flatShading: true
});

const matShell = new THREE.MeshStandardMaterial({
  color: 0xd0d3d7,
  metalness: 0.15,
  roughness: 0.48,
  flatShading: true,
  side: THREE.DoubleSide
});

const matMid = new THREE.MeshStandardMaterial({
  color: 0x8e969d,
  metalness: 0.22,
  roughness: 0.55,
  flatShading: true
});

const matDark = new THREE.MeshStandardMaterial({
  color: 0x2c3034,
  metalness: 0.25,
  roughness: 0.62,
  flatShading: true
});

const matBlack = new THREE.MeshStandardMaterial({
  color: 0x070809,
  metalness: 0.1,
  roughness: 0.7,
  flatShading: true
});

const matAccent = new THREE.MeshStandardMaterial({
  color: 0xe8eaed,
  metalness: 0.08,
  roughness: 0.42,
  flatShading: true
});

// ---------- Helpers ----------
function vec(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

function addMesh(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function offsetVec(p, x, y, z) {
  return vec(p.x + x, p.y + y, p.z + z);
}

function rotateYVector(yaw, x, y, z) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return vec(x * c + z * s, y, -x * s + z * c);
}

function localToWorld(center, yaw, x, y, z) {
  const r = rotateYVector(yaw, x, y, z);
  return vec(center.x + r.x, center.y + r.y, center.z + r.z);
}

function box(w, h, d, x, y, z, rx = 0, ry = 0, rz = 0, material = matLight) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  return addMesh(mesh);
}

function sphere(radius, x, y, z, material = matLight, sx = 1, sy = 1, sz = 1) {
  const geometry = new THREE.SphereGeometry(radius, 24, 12);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  return addMesh(mesh);
}

function cylinderBetween(a, b, radius, material = matDark, segments = 16) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  if (len < 0.0001) return null;

  const geometry = new THREE.CylinderGeometry(radius, radius, len, segments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(vec(0, 1, 0), dir.clone().normalize());
  return addMesh(mesh);
}

function boxBetween(a, b, thickX, thickZ, material = matLight) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  if (len < 0.0001) return null;

  const geometry = new THREE.BoxGeometry(thickX, len, thickZ);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(vec(0, 1, 0), dir.clone().normalize());
  return addMesh(mesh);
}

function disc(position, radius, thickness, axis, material = matBlack, segments = 24) {
  const geometry = new THREE.CylinderGeometry(radius, radius, thickness, segments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.quaternion.setFromUnitVectors(vec(0, 1, 0), axis.clone().normalize());
  return addMesh(mesh);
}

function coneAlong(center, direction, length, radius, material = matLight, segments = 4) {
  const geometry = new THREE.ConeGeometry(radius, length, segments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(center);
  mesh.quaternion.setFromUnitVectors(vec(0, 1, 0), direction.clone().normalize());
  return addMesh(mesh);
}

function torus(position, major, tube, axis, material = matDark, radialSegments = 8, tubularSegments = 28) {
  const geometry = new THREE.TorusGeometry(major, tube, radialSegments, tubularSegments);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.quaternion.setFromUnitVectors(vec(0, 0, 1), axis.clone().normalize());
  return addMesh(mesh);
}

function triPrismGeometry(length, height, depth) {
  // Triangular prism with its pointed tip along local +X.
  const l = length / 2;
  const h = height / 2;
  const d = depth / 2;

  const vertices = [
    -l, -h,  d,   l, 0,  d,  -l,  h,  d,
    -l, -h, -d,   l, 0, -d,  -l,  h, -d
  ];

  const indices = [
    0, 1, 2,
    5, 4, 3,
    0, 3, 4,  0, 4, 1,
    1, 4, 5,  1, 5, 2,
    2, 5, 3,  2, 3, 0
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function triPrism(length, height, depth, x, y, z, rx = 0, ry = 0, rz = 0, material = matLight) {
  const mesh = new THREE.Mesh(triPrismGeometry(length, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  return addMesh(mesh);
}

function verticalFinGeometry(height, depth, thickness) {
  // Upright triangular plate: base low, tip high, like the back fins in the reference.
  const x = thickness / 2;
  const y0 = -height / 2;
  const y1 = height / 2;
  const z0 = -depth / 2;
  const z1 = depth / 2;
  const zTip = depth * 0.15;

  const vertices = [
    -x, y0, z0,  -x, y0, z1,  -x, y1, zTip,
     x, y0, z0,   x, y0, z1,   x, y1, zTip
  ];

  const indices = [
    0, 1, 2,
    3, 5, 4,
    0, 3, 4,  0, 4, 1,
    1, 4, 5,  1, 5, 2,
    2, 5, 3,  2, 3, 0
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function verticalFin(height, depth, thickness, position, rotationY = 0, material = matShell) {
  const mesh = new THREE.Mesh(verticalFinGeometry(height, depth, thickness), material);
  mesh.position.copy(position);
  mesh.rotation.y = rotationY;
  return addMesh(mesh);
}

function curvedShellGeometry(width, radius, thickness, angleStart, angleEnd, segments) {
  // Thick partial cylindrical shell used for the large curved torso armor.
  const vertices = [];
  const indices = [];
  const rOuter = radius;
  const rInner = radius - thickness;

  for (let i = 0; i <= segments; i++) {
    const t = angleStart + (angleEnd - angleStart) * (i / segments);
    const s = Math.sin(t);
    const c = Math.cos(t);

    vertices.push(-width / 2, rOuter * s, rOuter * c);
    vertices.push( width / 2, rOuter * s, rOuter * c);
    vertices.push(-width / 2, rInner * s, rInner * c);
    vertices.push( width / 2, rInner * s, rInner * c);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 4;
    const b = (i + 1) * 4;

    indices.push(a, b, b + 1, a, b + 1, a + 1);         // outer skin
    indices.push(a + 2, a + 3, b + 3, a + 2, b + 3, b + 2); // inner skin
    indices.push(a, a + 2, b + 2, a, b + 2, b);         // left rim
    indices.push(a + 1, b + 1, b + 3, a + 1, b + 3, a + 3); // right rim
  }

  const s0 = 0;
  const e0 = segments * 4;
  indices.push(s0, s0 + 1, s0 + 3, s0, s0 + 3, s0 + 2);
  indices.push(e0, e0 + 2, e0 + 3, e0, e0 + 3, e0 + 1);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createCoils(start, end, count, major, tube, material = matDark) {
  const axis = new THREE.Vector3().subVectors(end, start).normalize();
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const p = start.clone().lerp(end, t);
    torus(p, major, tube, axis, material, 6, 20);
  }
}

// ---------- Feet and legs ----------
function createFoot(center, side, yaw) {
  // Layered oversized mechanical foot with boot-like ankle block and toe plates.
  const pSole = localToWorld(center, yaw, 0, 0.14, 0.0);
  box(1.75, 0.26, 1.45, pSole.x, pSole.y, pSole.z, 0, yaw, 0, matDark);

  const pUpper = localToWorld(center, yaw, 0, 0.39, -0.08);
  box(1.36, 0.28, 1.03, pUpper.x, pUpper.y, pUpper.z, 0, yaw, 0, matLight);

  const pHeel = localToWorld(center, yaw, 0, 0.48, 0.58);
  box(0.95, 0.32, 0.54, pHeel.x, pHeel.y, pHeel.z, 0, yaw, 0, matMid);

  const pToeC = localToWorld(center, yaw, 0, 0.47, -0.83);
  box(0.54, 0.26, 0.75, pToeC.x, pToeC.y, pToeC.z, 0, yaw, 0, matLight);

  const pToeL = localToWorld(center, yaw, -0.52, 0.42, -0.62);
  box(0.42, 0.22, 0.65, pToeL.x, pToeL.y, pToeL.z, 0, yaw, 0, matLight);

  const pToeR = localToWorld(center, yaw, 0.52, 0.42, -0.62);
  box(0.42, 0.22, 0.65, pToeR.x, pToeR.y, pToeR.z, 0, yaw, 0, matLight);

  const frontAxis = rotateYVector(yaw, 0, 0, -1);
  coneAlong(localToWorld(center, yaw, 0, 0.46, -1.27), frontAxis, 0.42, 0.12, matShell, 4);
  coneAlong(localToWorld(center, yaw, -0.52, 0.41, -1.08), frontAxis, 0.34, 0.09, matShell, 4);
  coneAlong(localToWorld(center, yaw, 0.52, 0.41, -1.08), frontAxis, 0.34, 0.09, matShell, 4);

  const pTower = localToWorld(center, yaw, 0, 0.86, 0.08);
  box(0.76, 0.72, 0.66, pTower.x, pTower.y, pTower.z, 0, yaw, 0, matMid);

  const axisX = rotateYVector(yaw, 1, 0, 0);
  const axisNX = rotateYVector(yaw, -1, 0, 0);
  disc(localToWorld(center, yaw, 0.45, 0.88, 0.07), 0.14, 0.05, axisX, matBlack, 20);
  disc(localToWorld(center, yaw, -0.45, 0.88, 0.07), 0.14, 0.05, axisNX, matBlack, 20);

  const pSidePlateOuter = localToWorld(center, yaw, side * 0.78, 0.31, -0.04);
  box(0.22, 0.22, 1.05, pSidePlateOuter.x, pSidePlateOuter.y, pSidePlateOuter.z, 0, yaw, 0, matDark);

  const pAnkleRing = localToWorld(center, yaw, 0, 1.15, 0.04);
  torus(pAnkleRing, 0.35, 0.045, axisX, matDark, 6, 24);
}

function createLeg(hip, knee, ankle, footCenter, side, footYaw) {
  createFoot(footCenter, side, footYaw);

  // Hip ball and socket.
  sphere(0.35, hip.x, hip.y, hip.z, matMid);
  torus(offsetVec(hip, side * 0.03, 0, 0), 0.36, 0.055, vec(side, 0, 0), matDark, 8, 28);

  // Upper thigh: a chunky central link plus parallel rods and exposed triangular bracing.
  boxBetween(offsetVec(hip, side * 0.05, -0.08, -0.02), offsetVec(knee, side * 0.04, 0.08, -0.02), 0.46, 0.30, matMid);
  cylinderBetween(offsetVec(hip, 0, 0.02, -0.30), offsetVec(knee, 0, 0.04, -0.30), 0.075, matDark, 12);
  cylinderBetween(offsetVec(hip, side * 0.28, -0.02, 0.22), offsetVec(knee, side * 0.24, 0.04, 0.22), 0.075, matDark, 12);

  cylinderBetween(offsetVec(hip, side * 0.28, -0.10, -0.24), offsetVec(knee, -side * 0.15, 0.08, -0.24), 0.038, matBlack, 10);
  cylinderBetween(offsetVec(hip, -side * 0.10, -0.08, -0.24), offsetVec(knee, side * 0.28, 0.08, -0.24), 0.038, matBlack, 10);

  for (const t of [0.34, 0.62]) {
    const p = hip.clone().lerp(knee, t).add(vec(0, 0, -0.39));
    torus(p, 0.15, 0.030, vec(0, 0, frontZ), matBlack, 6, 20);
  }

  // Knee joint.
  sphere(0.40, knee.x, knee.y, knee.z, matLight);
  torus(knee, 0.38, 0.060, vec(1, 0, 0), matDark, 8, 28);
  disc(offsetVec(knee, side * 0.38, 0, 0), 0.18, 0.07, vec(side, 0, 0), matBlack, 20);

  // Lower shin: two open side beams with fake circular holes on the front face.
  boxBetween(offsetVec(knee, 0, -0.10, -0.06), offsetVec(ankle, 0, 0.08, -0.06), 0.42, 0.22, matShell);
  cylinderBetween(offsetVec(knee, side * 0.27, -0.02, 0.18), offsetVec(ankle, side * 0.20, 0.02, 0.18), 0.080, matDark, 12);
  cylinderBetween(offsetVec(knee, -side * 0.22, -0.02, 0.18), offsetVec(ankle, -side * 0.20, 0.02, 0.18), 0.080, matDark, 12);

  cylinderBetween(offsetVec(knee, side * 0.24, -0.10, -0.24), offsetVec(ankle, -side * 0.20, 0.06, -0.24), 0.040, matBlack, 10);
  cylinderBetween(offsetVec(knee, -side * 0.20, -0.10, -0.24), offsetVec(ankle, side * 0.24, 0.06, -0.24), 0.040, matBlack, 10);

  for (const t of [0.27, 0.50, 0.73]) {
    const p = knee.clone().lerp(ankle, t).add(vec(0, 0, -0.34));
    torus(p, 0.16, 0.035, vec(0, 0, frontZ), matBlack, 6, 22);
    disc(offsetVec(p, 0, 0, -0.015), 0.095, 0.025, vec(0, 0, frontZ), matBlack, 18);
  }

  // Ankle socket and short piston into the foot.
  sphere(0.32, ankle.x, ankle.y, ankle.z, matMid);
  torus(ankle, 0.31, 0.050, vec(1, 0, 0), matDark, 8, 24);

  const footTop = localToWorld(footCenter, footYaw, 0, 1.20, 0.04);
  cylinderBetween(ankle, footTop, 0.115, matDark, 14);
  cylinderBetween(offsetVec(ankle, side * 0.22, -0.02, 0.12), localToWorld(footCenter, footYaw, side * 0.22, 1.02, 0.22), 0.055, matLight, 12);
}

// ---------- Torso and pelvis ----------
box(1.50, 0.90, 1.22, 0, 5.25, 0.02, 0, 0, 0, matMid);
box(1.95, 0.34, 1.45, 0, 4.73, 0.05, 0, 0, 0, matDark);
box(1.28, 0.95, 0.98, 0, 6.22, -0.08, 0.03, 0, 0, matDark);
box(2.10, 1.08, 1.16, 0, 7.13, -0.12, -0.08, 0, 0, matMid);

// Pelvis/abdomen round mechanical sockets.
for (const x of [-0.55, 0.55]) {
  torus(vec(x, 5.56, -0.62), 0.19, 0.035, vec(0, 0, frontZ), matBlack, 6, 22);
  disc(vec(x, 5.56, -0.65), 0.105, 0.035, vec(0, 0, frontZ), matBlack, 18);
}

for (const x of [-0.82, 0.82]) {
  torus(vec(x, 5.05, 0.00), 0.34, 0.055, vec(Math.sign(x), 0, 0), matDark, 8, 28);
}

// Shoulder axle and sockets.
cylinderBetween(vec(-2.15, 7.68, -0.16), vec(2.15, 7.68, -0.16), 0.16, matDark, 18);
sphere(0.39, -2.08, 7.68, -0.16, matMid);
sphere(0.39, 2.08, 7.68, -0.16, matMid);
torus(vec(-2.10, 7.68, -0.16), 0.43, 0.060, vec(1, 0, 0), matDark, 8, 30);
torus(vec(2.10, 7.68, -0.16), 0.43, 0.060, vec(1, 0, 0), matDark, 8, 30);

// Large arched torso armor shell.
const shellCenter = vec(0, 7.35, -0.22);
const shellWidth = 3.25;
const shellRadius = 2.05;
const shellThickness = 0.32;
const shellStart = -116 * deg;
const shellEnd = 72 * deg;

const shell = new THREE.Mesh(
  curvedShellGeometry(shellWidth, shellRadius, shellThickness, shellStart, shellEnd, 28),
  matShell
);
shell.position.copy(shellCenter);
addMesh(shell);

// Dark raised ribs on the shell mimic the black line-art edges in the image.
function shellPoint(x, theta, r = shellRadius + 0.035) {
  return vec(shellCenter.x + x, shellCenter.y + r * Math.sin(theta), shellCenter.z + r * Math.cos(theta));
}

cylinderBetween(shellPoint(-shellWidth / 2, shellStart), shellPoint(shellWidth / 2, shellStart), 0.055, matDark, 12);
cylinderBetween(shellPoint(-shellWidth / 2, shellEnd), shellPoint(shellWidth / 2, shellEnd), 0.055, matDark, 12);

for (let i = 1; i < 6; i++) {
  const t = shellStart + (shellEnd - shellStart) * (i / 6);
  cylinderBetween(shellPoint(-shellWidth / 2, t), shellPoint(shellWidth / 2, t), 0.034, matDark, 10);
}

for (const sx of [-1, 1]) {
  for (let i = 0; i < 14; i++) {
    const a = shellStart + (shellEnd - shellStart) * (i / 14);
    const b = shellStart + (shellEnd - shellStart) * ((i + 1) / 14);
    cylinderBetween(shellPoint(sx * shellWidth / 2, a), shellPoint(sx * shellWidth / 2, b), 0.040, matDark, 10);
  }
}

// Chest fake holes/bolts.
for (const x of [-0.56, 0, 0.56]) {
  torus(vec(x, 6.72, -0.73), 0.145, 0.030, vec(0, 0, frontZ), matBlack, 6, 20);
  disc(vec(x, 6.72, -0.755), 0.075, 0.030, vec(0, 0, frontZ), matBlack, 16);
}

// Side gear/fan on the right torso.
const gearCenter = vec(1.38, 8.05, 0.58);
torus(gearCenter, 0.55, 0.060, vec(1, 0, 0), matDark, 8, 34);
disc(gearCenter, 0.19, 0.16, vec(1, 0, 0), matMid, 24);
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3;
  cylinderBetween(
    gearCenter,
    gearCenter.clone().add(vec(0, 0.45 * Math.cos(a), 0.45 * Math.sin(a))),
    0.025,
    matBlack,
    8
  );
}

// Small side barrel on lower right torso.
cylinderBetween(vec(1.18, 6.48, -0.43), vec(2.55, 6.30, -0.72), 0.13, matMid, 18);
torus(vec(2.58, 6.30, -0.72), 0.17, 0.035, vec(1, -0.15, -0.18), matBlack, 6, 22);
disc(vec(1.16, 6.48, -0.43), 0.20, 0.10, vec(1, 0, 0), matDark, 22);

// ---------- Neck and head ----------
cylinderBetween(vec(-0.28, 8.95, -0.07), vec(-1.05, 10.12, -0.43), 0.12, matDark, 14);
cylinderBetween(vec(0.18, 8.90, 0.22), vec(-0.78, 10.05, -0.15), 0.10, matMid, 14);
sphere(0.30, -1.03, 10.14, -0.42, matMid);

// Main angular head and wedge snout, tilted left like the reference.
box(1.16, 0.66, 0.86, -1.75, 10.75, -0.55, 0.05, -0.10, 0.18, matShell);
coneAlong(vec(-2.35, 10.76, -0.55), vec(-1, 0.04, 0), 0.95, 0.43, matShell, 4);
box(0.95, 0.18, 0.66, -2.12, 10.36, -0.55, 0, 0, -0.05, matDark);
coneAlong(vec(-2.55, 10.34, -0.55), vec(-1, -0.07, 0), 0.58, 0.20, matDark, 4);

// Round eye/cap details.
torus(vec(-1.86, 11.15, -0.78), 0.22, 0.045, vec(0, 1, 0), matBlack, 8, 28);
disc(vec(-1.86, 11.16, -0.78), 0.115, 0.040, vec(0, 1, 0), matAccent, 20);
disc(vec(-2.16, 10.86, -0.99), 0.12, 0.045, vec(0, 0, frontZ), matBlack, 20);
disc(vec(-1.28, 10.55, -0.98), 0.15, 0.050, vec(0, 0, frontZ), matBlack, 20);

cylinderBetween(vec(-1.28, 10.95, -0.16), vec(-0.63, 11.18, 0.38), 0.035, matDark, 8);
cylinderBetween(vec(-1.10, 10.62, -0.02), vec(-0.55, 10.84, 0.30), 0.045, matDark, 8);

// ---------- Back fins and rear rods ----------
verticalFin(2.35, 1.05, 0.18, vec(0.10, 10.12, 0.76), -0.10, matShell);
verticalFin(1.65, 0.78, 0.15, vec(-0.52, 9.73, 0.74), 0.18, matShell);
verticalFin(1.50, 0.72, 0.15, vec(0.67, 9.55, 0.92), -0.25, matShell);

// Dark fin ribs.
box(0.12, 1.22, 0.055, 0.10, 10.15, 0.90, 0.52, -0.10, 0, matDark);
box(0.12, 0.82, 0.050, -0.52, 9.70, 0.83, -0.55, 0.18, 0, matDark);
box(0.12, 0.75, 0.050, 0.67, 9.55, 1.00, 0.45, -0.25, 0, matDark);

// Rear fork/cannon rods visible behind the torso.
const tailStartA = vec(0.82, 8.98, 0.80);
const tailEndA = vec(3.55, 9.35, 2.25);
const tailStartB = vec(0.78, 8.48, 0.68);
const tailEndB = vec(3.35, 8.76, 2.10);
cylinderBetween(tailStartA, tailEndA, 0.075, matDark, 12);
cylinderBetween(tailStartB, tailEndB, 0.075, matDark, 12);
boxBetween(vec(0.55, 8.78, 0.58), vec(1.12, 8.82, 0.88), 0.38, 0.26, matMid);
createCoils(vec(1.15, 8.82, 0.96), vec(2.30, 9.00, 1.55), 8, 0.18, 0.025, matBlack);

boxBetween(tailEndA, tailEndA.clone().add(vec(0.45, 0.06, 0.25)), 0.10, 0.10, matDark);
boxBetween(tailEndB, tailEndB.clone().add(vec(0.42, 0.03, 0.22)), 0.10, 0.10, matDark);
triPrism(0.55, 0.18, 0.13, 3.98, 9.43, 2.47, 0, -0.95, 0.10, matShell);
triPrism(0.52, 0.16, 0.12, 3.76, 8.82, 2.30, 0, -0.95, 0.05, matShell);

// ---------- Left extended arm with pincer ----------
const leftShoulder = vec(-2.08, 7.68, -0.16);
const leftElbow = vec(-3.55, 6.75, -0.26);
const leftWrist = vec(-5.16, 5.94, -0.36);

boxBetween(leftShoulder, leftElbow, 0.34, 0.32, matMid);
cylinderBetween(offsetVec(leftShoulder, 0, 0.20, 0.22), offsetVec(leftElbow, 0, 0.20, 0.22), 0.070, matDark, 12);
cylinderBetween(offsetVec(leftShoulder, 0, -0.18, -0.18), offsetVec(leftElbow, 0, -0.18, -0.18), 0.070, matDark, 12);
sphere(0.33, leftElbow.x, leftElbow.y, leftElbow.z, matLight);
torus(leftElbow, 0.31, 0.050, vec(0, 0, frontZ), matDark, 8, 26);

boxBetween(offsetVec(leftElbow, -0.10, 0, 0), offsetVec(leftWrist, 0.10, 0, 0), 0.30, 0.24, matMid);
cylinderBetween(offsetVec(leftElbow, 0, 0.18, 0.18), offsetVec(leftWrist, 0, 0.18, 0.18), 0.075, matLight, 12);
cylinderBetween(offsetVec(leftElbow, 0, -0.18, -0.18), offsetVec(leftWrist, 0, -0.18, -0.18), 0.075, matLight, 12);
cylinderBetween(offsetVec(leftElbow, 0.00, 0.27, -0.10), offsetVec(leftWrist, 0.00, -0.24, -0.10), 0.035, matBlack, 8);
cylinderBetween(offsetVec(leftElbow, 0.00, -0.24, -0.10), offsetVec(leftWrist, 0.00, 0.25, -0.10), 0.035, matBlack, 8);

for (const t of [0.27, 0.52, 0.76]) {
  const p = leftElbow.clone().lerp(leftWrist, t).add(vec(0, 0, -0.31));
  torus(p, 0.15, 0.030, vec(0, 0, frontZ), matBlack, 6, 20);
}

createCoils(vec(-4.25, 6.38, -0.36), vec(-5.06, 5.98, -0.36), 7, 0.21, 0.025, matBlack);

sphere(0.29, leftWrist.x, leftWrist.y, leftWrist.z, matMid);
torus(leftWrist, 0.28, 0.045, vec(1, 0, 0), matDark, 8, 24);
box(0.70, 0.45, 0.55, -5.58, 5.78, -0.36, 0, 0, -0.12, matMid);

triPrism(1.40, 0.28, 0.16, -6.30, 6.08, -0.50, 0, 0, Math.PI - 0.24, matShell);
triPrism(1.40, 0.28, 0.16, -6.30, 5.53, -0.50, 0, 0, Math.PI + 0.24, matShell);
triPrism(0.55, 0.16, 0.12, -6.98, 6.25, -0.50, 0, 0, Math.PI - 0.24, matDark);
triPrism(0.55, 0.16, 0.12, -6.98, 5.36, -0.50, 0, 0, Math.PI + 0.24, matDark);

// ---------- Right bent arm with compact gripper ----------
const rightShoulder = vec(2.08, 7.68, -0.16);
const rightElbow = vec(3.05, 6.72, -0.08);
const rightWrist = vec(1.76, 5.55, -0.68);

boxBetween(rightShoulder, rightElbow, 0.34, 0.32, matMid);
cylinderBetween(offsetVec(rightShoulder, 0, 0.18, 0.20), offsetVec(rightElbow, 0, 0.18, 0.20), 0.070, matDark, 12);
cylinderBetween(offsetVec(rightShoulder, 0, -0.18, -0.18), offsetVec(rightElbow, 0, -0.18, -0.18), 0.070, matDark, 12);
sphere(0.33, rightElbow.x, rightElbow.y, rightElbow.z, matLight);
torus(rightElbow, 0.31, 0.050, vec(0, 0, frontZ), matDark, 8, 26);

boxBetween(rightElbow, rightWrist, 0.32, 0.24, matMid);
cylinderBetween(offsetVec(rightElbow, 0.12, 0.10, 0.18), offsetVec(rightWrist, 0.12, 0.10, 0.18), 0.070, matLight, 12);
cylinderBetween(offsetVec(rightElbow, -0.12, -0.10, -0.18), offsetVec(rightWrist, -0.12, -0.10, -0.18), 0.070, matLight, 12);

sphere(0.28, rightWrist.x, rightWrist.y, rightWrist.z, matMid);
box(0.70, 0.55, 0.55, 1.62, 5.32, -0.80, 0, 0.10, 0.10, matMid);
disc(vec(1.62, 5.35, -1.10), 0.13, 0.05, vec(0, 0, frontZ), matBlack, 20);

cylinderBetween(vec(1.35, 5.17, -1.02), vec(1.02, 4.98, -1.55), 0.060, matDark, 10);
cylinderBetween(vec(1.86, 5.19, -1.02), vec(2.13, 5.00, -1.55), 0.060, matDark, 10);
coneAlong(vec(0.94, 4.94, -1.66), vec(-0.28, -0.15, frontZ), 0.34, 0.08, matShell, 4);
coneAlong(vec(2.20, 4.96, -1.66), vec(0.28, -0.15, frontZ), 0.34, 0.08, matShell, 4);

// ---------- Legs ----------
createLeg(
  vec(-0.82, 5.03, -0.03),
  vec(-1.90, 3.45, -0.24),
  vec(-1.43, 1.22, -0.17),
  vec(-1.55, groundY, -0.30),
  -1,
  0.16
);

createLeg(
  vec(0.88, 5.02, 0.08),
  vec(1.72, 3.36, 0.22),
  vec(1.34, 1.16, 0.12),
  vec(1.35, groundY, 0.08),
  1,
  -0.13
);

// Extra central pelvis-to-leg pistons.
cylinderBetween(vec(-0.35, 5.12, 0.45), vec(-1.32, 3.90, 0.10), 0.055, matDark, 10);
cylinderBetween(vec(0.35, 5.10, 0.45), vec(1.22, 3.78, 0.36), 0.055, matDark, 10);
cylinderBetween(vec(-0.18, 4.82, -0.55), vec(-1.28, 3.70, -0.55), 0.045, matLight, 10);
cylinderBetween(vec(0.18, 4.82, -0.55), vec(1.25, 3.62, -0.36), 0.045, matLight, 10);

// Camera framing.
camera.position.set(13, 10, -18);
camera.lookAt(0, 5.6, 0);
}