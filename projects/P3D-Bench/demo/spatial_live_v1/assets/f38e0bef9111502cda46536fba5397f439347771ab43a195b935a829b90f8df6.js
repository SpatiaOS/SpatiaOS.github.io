// Stylized reconnaissance tank, interpreted from the reference.
// Coordinates: +Y is up, +Z is the front, and +X is the visible right side.
// All details are modeled geometry, including the hollow gun barrels and tread links.

const P = {
  hull: {
    halfWidth: 2.58,
    deckY: 2.84,
    frontZ: 3.65,
    rearZ: -3.34
  },
  track: {
    sideX: 3.22,
    centerY: 1.28,
    axleHalfSpacing: 2.55,
    radius: 1.16,
    width: 1.23,
    beltThickness: 0.12,
    links: 36
  },
  turret: {
    z: -0.05,
    radius: 2.16,
    bottomY: 2.87,
    equatorY: 3.80,
    crownHeight: 1.52,
    crownCutY: 5.13
  },
  cannon: {
    y: 3.89,
    muzzleZ: 4.20,
    boreRadius: 0.49
  }
};

const M = {
  hull: new THREE.MeshStandardMaterial({
    color: 0x999da1, metalness: 0.32, roughness: 0.48
  }),
  turret: new THREE.MeshStandardMaterial({
    color: 0xa9adb0, metalness: 0.35, roughness: 0.38
  }),
  armor: new THREE.MeshStandardMaterial({
    color: 0x91969a, metalness: 0.30, roughness: 0.50
  }),
  edge: new THREE.MeshStandardMaterial({
    color: 0xc0c3c5, metalness: 0.48, roughness: 0.33
  }),
  steel: new THREE.MeshStandardMaterial({
    color: 0xa2a7ab, metalness: 0.53, roughness: 0.35
  }),
  track: new THREE.MeshStandardMaterial({
    color: 0x777d82, metalness: 0.35, roughness: 0.58
  }),
  tread: new THREE.MeshStandardMaterial({
    color: 0x9a9ea1, metalness: 0.30, roughness: 0.53
  }),
  recess: new THREE.MeshStandardMaterial({
    color: 0x53595e, metalness: 0.25, roughness: 0.62
  }),
  seam: new THREE.MeshStandardMaterial({
    color: 0x41464a, metalness: 0.20, roughness: 0.63
  }),
  bore: new THREE.MeshStandardMaterial({
    color: 0x252a2e, metalness: 0.15, roughness: 0.78
  })
};

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const Y_AXIS = V(0, 1, 0);
const Z_AXIS = V(0, 0, 1);

function mesh(geometry, material, position) {
  const object = new THREE.Mesh(geometry, material);
  if (position) object.position.copy(position);
  scene.add(object);
  return object;
}

function box(w, h, d, position, material) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, position);
}

function sphere(radius, position, material, scale) {
  const object = mesh(new THREE.SphereGeometry(radius, 32, 20), material, position);
  if (scale) object.scale.set(scale[0], scale[1], scale[2]);
  return object;
}

function cylinderBetween(a, b, radiusA, radiusB, material, segments = 40) {
  const direction = b.clone().sub(a);
  const object = mesh(
    new THREE.CylinderGeometry(radiusB, radiusA, direction.length(), segments),
    material,
    a.clone().add(b).multiplyScalar(0.5)
  );
  object.quaternion.setFromUnitVectors(Y_AXIS, direction.normalize());
  return object;
}

function ring(position, axis, radius, tubeRadius, material) {
  const object = mesh(
    new THREE.TorusGeometry(radius, tubeRadius, 10, 72),
    material,
    position
  );
  object.quaternion.setFromUnitVectors(Z_AXIS, axis.clone().normalize());
  return object;
}

function lathe(profile, origin, axis, material, segments = 72) {
  const geometry = new THREE.LatheGeometry(
    profile.map(p => new THREE.Vector2(p[0], p[1])),
    segments
  );
  const object = mesh(geometry, material, origin);
  object.quaternion.setFromUnitVectors(Y_AXIS, axis.clone().normalize());
  return object;
}

function annulus(origin, axis, length, outerRadius, innerRadius, material) {
  return lathe([
    [innerRadius, 0],
    [outerRadius, 0],
    [outerRadius, length],
    [innerRadius, length],
    [innerRadius, 0]
  ], origin, axis, material, 48);
}

function pipe(points, radius, material, segments = 40) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => Array.isArray(p) ? V(...p) : p),
    false,
    "centripetal"
  );
  return mesh(
    new THREE.TubeGeometry(curve, segments, radius, 10, false),
    material
  );
}

function roundedRectangle(w, h, r) {
  const x = -w / 2;
  const y = -h / 2;
  r = Math.min(r, w / 2, h / 2);

  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  shape.closePath();
  return shape;
}

function roundedBox(w, h, d, radius, bevel, position, material) {
  const b = Math.min(bevel, w * 0.2, h * 0.2, d * 0.2);
  const shape = roundedRectangle(
    w - 2 * b,
    h - 2 * b,
    Math.max(0.001, radius - b)
  );

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: d - 2 * b,
    bevelEnabled: b > 0,
    bevelSize: b,
    bevelThickness: b,
    bevelSegments: 2,
    curveSegments: 6,
    steps: 1
  });
  geometry.translate(0, 0, -d / 2 + b);
  return mesh(geometry, material, position);
}

// A prism extruded along X from a side-view polygon given as [Y, Z].
function sidePrism(width, yzPoints, x, material) {
  const shape = new THREE.Shape();
  yzPoints.forEach((p, i) => {
    if (i === 0) shape.moveTo(-p[1], p[0]);
    else shape.lineTo(-p[1], p[0]);
  });
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: false,
    steps: 1
  });
  geometry.translate(0, 0, -width / 2);
  geometry.rotateY(Math.PI / 2);
  return mesh(geometry, material, V(x, 0, 0));
}

// -----------------------------------------------------------------------------
// Angular central hull and broad sloping glacis.
// -----------------------------------------------------------------------------

const hullLevels = [
  { y: 0.75, w: 2.40, front: 3.31, back: -3.08, corner: 0.27 },
  { y: 1.25, w: 2.58, front: 3.65, back: -3.34, corner: 0.27 },
  { y: 2.65, w: 2.52, front: 2.33, back: -3.15, corner: 0.35 },
  { y: 2.84, w: 2.36, front: 2.05, back: -2.97, corner: 0.32 }
];

const hullVertices = [];
const hullIndices = [];

for (const level of hullLevels) {
  const { y, w, front: f, back: b, corner: c } = level;
  const outline = [
    [-w + c, f], [w - c, f], [w, f - c], [w, b + c],
    [w - c, b], [-w + c, b], [-w, b + c], [-w, f - c]
  ];
  for (const [x, z] of outline) hullVertices.push(x, y, z);
}

for (let level = 0; level < hullLevels.length - 1; level++) {
  for (let j = 0; j < 8; j++) {
    const a = level * 8 + j;
    const b = level * 8 + (j + 1) % 8;
    const c = b + 8;
    const d = a + 8;
    hullIndices.push(a, b, c, a, c, d);
  }
}
for (let j = 1; j < 7; j++) {
  hullIndices.push(0, j + 1, j);
  hullIndices.push(24, 24 + j, 24 + j + 1);
}

let hullGeometry = new THREE.BufferGeometry();
hullGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(hullVertices, 3)
);
hullGeometry.setIndex(hullIndices);
hullGeometry = hullGeometry.toNonIndexed();
hullGeometry.computeVertexNormals();
mesh(hullGeometry, M.hull);

roundedBox(4.62, 0.24, 5.82, 0.12, 0.045, V(0, 0.80, -0.08), M.recess);

const glacisAngle = Math.atan2(1.26, 1.20);
const glacisPosition = V(0, 2.005, 3.015);

const glacisJoint = roundedBox(
  4.66, 0.075, 1.82, 0.035, 0.015,
  glacisPosition, M.seam
);
glacisJoint.rotation.x = glacisAngle;

const glacis = roundedBox(
  4.56, 0.095, 1.74, 0.04, 0.018,
  glacisPosition.clone().add(V(0, 0.025, 0.027)), M.hull
);
glacis.rotation.x = glacisAngle;

// Ribbed lower front bumper.
const bumper = roundedBox(
  4.67, 0.49, 0.21, 0.05, 0.025,
  V(0, 1.02, 3.52), M.armor
);
bumper.rotation.x = -0.13;

for (let i = 0; i < 7; i++) {
  const tooth = roundedBox(
    0.38, 0.44, 0.23, 0.025, 0.012,
    V((i - 3) * 0.62, 0.98, 3.69), M.steel
  );
  tooth.rotation.x = -0.13;
}

// Small raised central latch on the front slope.
const latchBack = box(0.47, 0.50, 0.09, V(0, 1.91, 3.18), M.seam);
latchBack.rotation.x = glacisAngle;
const latch = box(0.36, 0.46, 0.15, V(0, 1.95, 3.24), M.armor);
latch.rotation.x = glacisAngle;
const latchLip = box(0.43, 0.18, 0.30, V(0, 2.13, 3.11), M.edge);
latchLip.rotation.x = glacisAngle;

// Rear engine deck with two banks of louvers.
roundedBox(4.53, 0.12, 1.28, 0.08, 0.025, V(0, 2.80, -2.59), M.armor);
for (const side of [-1, 1]) {
  box(1.75, 0.025, 0.88, V(side * 1.16, 2.877, -2.64), M.recess);
  for (let i = 0; i < 6; i++) {
    const louver = box(
      1.69, 0.065, 0.115,
      V(side * 1.16, 2.914, -2.24 - i * 0.155), M.steel
    );
    louver.rotation.x = -0.17;
  }
}

// -----------------------------------------------------------------------------
// Continuous track belts, separate shoes, large end wheels, and center skirts.
// -----------------------------------------------------------------------------

function makeTrackBelt(side) {
  const a = P.track.axleHalfSpacing;
  const r = P.track.radius;
  const ri = r - P.track.beltThickness;

  const shape = new THREE.Shape();
  shape.moveTo(-a, -r);
  shape.lineTo(a, -r);
  shape.absarc(a, 0, r, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(-a, r);
  shape.absarc(-a, 0, r, Math.PI / 2, Math.PI * 1.5, false);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-a, -ri);
  hole.absarc(-a, 0, ri, -Math.PI / 2, -Math.PI * 1.5, true);
  hole.lineTo(a, ri);
  hole.absarc(a, 0, ri, Math.PI / 2, -Math.PI / 2, true);
  hole.closePath();
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: P.track.width,
    bevelEnabled: false,
    curveSegments: 20
  });
  geometry.translate(0, 0, -P.track.width / 2);
  geometry.rotateY(Math.PI / 2);
  mesh(geometry, M.track, V(side * P.track.sideX, P.track.centerY, 0));
}

function trackPoint(distance) {
  const a = P.track.axleHalfSpacing;
  const r = P.track.radius;
  const cy = P.track.centerY;
  const straight = 2 * a;
  const arc = Math.PI * r;

  if (distance < straight) {
    return { y: cy + r, z: a - distance, dy: 0, dz: -1 };
  }
  distance -= straight;
  if (distance < arc) {
    const t = distance / r;
    return {
      y: cy + r * Math.cos(t),
      z: -a - r * Math.sin(t),
      dy: -Math.sin(t),
      dz: -Math.cos(t)
    };
  }
  distance -= arc;
  if (distance < straight) {
    return { y: cy - r, z: -a + distance, dy: 0, dz: 1 };
  }
  distance -= straight;
  const t = distance / r;
  return {
    y: cy - r * Math.cos(t),
    z: a + r * Math.sin(t),
    dy: Math.sin(t),
    dz: Math.cos(t)
  };
}

function makeWheel(side, z) {
  const cy = P.track.centerY;
  const outer = P.track.sideX + P.track.width / 2 + 0.09;
  const axis = V(side, 0, 0);
  const point = offset => V(side * (outer + offset), cy, z);

  cylinderBetween(point(-1.10), point(-0.12), 0.94, 0.94, M.recess);
  cylinderBetween(point(-0.22), point(-0.02), 1.065, 1.065, M.track);
  cylinderBetween(point(-0.13), point(0.015), 1.025, 1.025, M.steel);

  annulus(point(0.010), axis, 0.085, 1.035, 0.895, M.edge);
  cylinderBetween(point(0.014), point(0.048), 0.889, 0.889, M.armor);
  ring(point(0.064), axis, 0.859, 0.026, M.seam);
  ring(point(0.078), axis, 0.935, 0.023, M.steel);

  // Three short radial spokes and recessed fasteners.
  for (let j = 0; j < 3; j++) {
    const angle = j * Math.PI * 2 / 3 + 0.34;
    const radialY = Math.cos(angle);
    const radialZ = Math.sin(angle);

    const spoke = box(
      0.048, 0.48, 0.15,
      V(side * (outer + 0.068), cy + radialY * 0.54, z + radialZ * 0.54),
      M.steel
    );
    spoke.rotation.x = angle;

    const center = V(
      side * (outer + 0.086),
      cy + radialY * 0.71,
      z + radialZ * 0.71
    );
    cylinderBetween(
      center.clone().addScaledVector(axis, -0.008),
      center.clone().addScaledVector(axis, 0.018),
      0.13, 0.13, M.seam, 32
    );
    cylinderBetween(
      center.clone().addScaledVector(axis, 0.019),
      center.clone().addScaledVector(axis, 0.048),
      0.101, 0.101, M.edge, 6
    );
  }

  cylinderBetween(point(0.06), point(0.19), 0.375, 0.34, M.steel);
  sphere(1, point(0.17), M.edge, [0.12, 0.31, 0.31]);
  ring(point(0.289), axis, 0.124, 0.027, M.seam);
  cylinderBetween(point(0.285), point(0.325), 0.089, 0.089, M.steel, 6);
}

const trackLength =
  4 * P.track.axleHalfSpacing + 2 * Math.PI * P.track.radius;
const shoeLength = trackLength / P.track.links * 0.86;
const shoeGeometry = new THREE.BoxGeometry(
  P.track.width + 0.15, 0.125, shoeLength
);
const cleatGeometry = new THREE.BoxGeometry(
  P.track.width + 0.29, 0.065, 0.135
);

for (const side of [-1, 1]) {
  makeTrackBelt(side);

  for (let i = 0; i < P.track.links; i++) {
    const p = trackPoint((i + 0.5) * trackLength / P.track.links);
    const rotation = Math.atan2(-p.dy, p.dz);
    const outward = V(0, -p.dz, p.dy);
    const center = V(side * P.track.sideX, p.y, p.z);

    const shoe = mesh(shoeGeometry, i % 3 === 0 ? M.armor : M.tread, center);
    shoe.rotation.x = rotation;

    const cleat = mesh(
      cleatGeometry,
      M.steel,
      center.clone().addScaledVector(outward, 0.093)
    );
    cleat.rotation.x = rotation;

    const pinCenter = V(
      side * (P.track.sideX + P.track.width / 2 + 0.10), p.y, p.z
    );
    cylinderBetween(
      pinCenter,
      pinCenter.clone().add(V(side * 0.045, 0, 0)),
      0.045, 0.045, M.recess, 12
    );
  }

  makeWheel(side, P.track.axleHalfSpacing);
  makeWheel(side, -P.track.axleHalfSpacing);

  // The reference has a broad rounded armor cover between the two exposed wheels.
  const skirt = roundedBox(
    2.54, 2.10, 1.39, 0.34, 0.075,
    V(side * P.track.sideX, 1.64, -0.03), M.hull
  );
  skirt.rotation.y = Math.PI / 2;

  const skirtJoint = roundedBox(
    2.40, 1.94, 0.045, 0.29, 0.01,
    V(side * 3.937, 1.64, -0.03), M.seam
  );
  skirtJoint.rotation.y = side * Math.PI / 2;

  const skirtPanel = roundedBox(
    2.35, 1.89, 0.06, 0.27, 0.012,
    V(side * 3.961, 1.64, -0.03), M.armor
  );
  skirtPanel.rotation.y = side * Math.PI / 2;

  box(0.014, 0.025, 2.33, V(side * 4.00, 1.52, -0.03), M.seam);

  // Rounded leading edge of the skirt doubles as a protective side rail.
  pipe([
    [side * 2.66, 2.73, 1.26],
    [side * 3.17, 2.73, 1.26],
    [side * 3.75, 2.64, 1.26],
    [side * 3.91, 2.42, 1.26],
    [side * 3.94, 1.94, 1.26],
    [side * 3.94, 0.88, 1.26],
    [side * 3.82, 0.66, 1.26]
  ], 0.085, M.edge);

  // Broad sheet-metal fenders over the front and rear track ends.
  const frontFender = box(
    1.51, 0.115, 1.20,
    V(side * P.track.sideX, 2.48, 3.04), M.armor
  );
  frontFender.rotation.x = 0.34;

  const frontLip = box(
    1.54, 0.18, 0.13,
    V(side * P.track.sideX, 2.285, 3.60), M.edge
  );
  frontLip.rotation.x = 0.34;

  const mudFlap = box(
    1.27, 1.02, 0.12,
    V(side * P.track.sideX, 1.33, 3.78), M.armor
  );
  mudFlap.rotation.x = 0.25;

  const flapEdge = box(
    1.30, 0.115, 0.15,
    V(side * P.track.sideX, 0.85, 3.66), M.steel
  );
  flapEdge.rotation.x = 0.25;

  const rearFender = box(
    1.50, 0.105, 1.00,
    V(side * P.track.sideX, 2.49, -3.04), M.armor
  );
  rearFender.rotation.x = -0.25;

  const rearFin = box(
    1.10, 0.48, 0.09,
    V(side * P.track.sideX, 2.77, -3.18), M.steel
  );
  rearFin.rotation.x = -0.13;
}

// -----------------------------------------------------------------------------
// Rounded turret: straight lower band, ellipsoidal crown, and subtle panel seams.
// -----------------------------------------------------------------------------

lathe([
  [0, 2.85], [2.01, 2.85], [2.12, 2.90], [2.16, 3.01],
  [2.16, 3.77], [2.15, 3.81], [0, 3.81], [0, 2.85]
], V(0, 0, P.turret.z), Y_AXIS, M.turret);

ring(V(0, 2.89, P.turret.z), Y_AXIS, 2.095, 0.047, M.steel);
ring(V(0, 2.97, P.turret.z), Y_AXIS, 2.144, 0.021, M.edge);

const crownStartAngle = Math.acos(
  (P.turret.crownCutY - P.turret.equatorY) / P.turret.crownHeight
);
const crownProfile = [[0, P.turret.equatorY]];

for (let i = 0; i <= 36; i++) {
  const t = Math.PI / 2 +
    (crownStartAngle - Math.PI / 2) * i / 36;
  crownProfile.push([
    P.turret.radius * Math.sin(t),
    P.turret.equatorY + P.turret.crownHeight * Math.cos(t)
  ]);
}
crownProfile.push([0, P.turret.crownCutY], [0, P.turret.equatorY]);
lathe(crownProfile, V(0, 0, P.turret.z), Y_AXIS, M.turret, 96);

ring(V(0, 3.805, P.turret.z), Y_AXIS, 2.162, 0.012, M.seam);

for (const azimuth of [-0.78, 0.65, 2.22, 3.78]) {
  const points = [];
  for (let i = 0; i <= 30; i++) {
    const t = crownStartAngle +
      (Math.PI / 2 - crownStartAngle) * i / 30;
    const r = P.turret.radius * Math.sin(t) + 0.009;
    points.push(V(
      r * Math.sin(azimuth),
      P.turret.equatorY + P.turret.crownHeight * Math.cos(t) + 0.006,
      P.turret.z + r * Math.cos(azimuth)
    ));
  }
  pipe(points, 0.011, M.seam, 48);
}

// -----------------------------------------------------------------------------
// Short, thick main cannon with stepped mantlet and an actual recessed bore.
// -----------------------------------------------------------------------------

const cannonAxis = V(0, 0, 1);
const cannonOrigin = V(0, P.cannon.y, 1.69);

lathe([
  [0, 0], [0.76, 0], [0.90, 0.14], [0.93, 0.27],
  [0.90, 0.39], [0.78, 0.53], [0, 0.53], [0, 0]
], cannonOrigin, cannonAxis, M.armor);

ring(V(0, P.cannon.y, 2.045), cannonAxis, 0.886, 0.043, M.edge);
annulus(V(0, P.cannon.y, 2.17), cannonAxis, 0.17, 0.78, 0.56, M.steel);

// The lathed profile closes around the inside wall rather than capping the muzzle.
lathe([
  [0.52, 0],
  [0.725, 0],
  [0.725, 0.16],
  [0.625, 1.72],
  [0.654, 1.75],
  [0.654, 1.84],
  [0.49, 1.84],
  [0.49, 0.48],
  [0.52, 0],
], V(0, P.cannon.y, 2.36), cannonAxis, M.steel);

ring(V(0, P.cannon.y, P.cannon.muzzleZ), cannonAxis, 0.625, 0.024, M.edge);
ring(V(0, P.cannon.y, 4.205), cannonAxis, 0.503, 0.017, M.seam);

cylinderBetween(
  V(0, P.cannon.y, 3.47),
  V(0, P.cannon.y, 3.50),
  0.487, 0.487, M.bore
);

// Fine longitudinal rifling ridges are visible inside the short muzzle.
for (let i = 0; i < 8; i++) {
  const angle = i * Math.PI / 4;
  const x = 0.481 * Math.cos(angle);
  const y = P.cannon.y + 0.481 * Math.sin(angle);
  cylinderBetween(
    V(x, y, 3.52), V(x, y, 4.185),
    0.020, 0.020, M.armor, 10
  );
}

// Thick curved handholds to either side of the mantlet.
for (const side of [-1, 1]) {
  pipe([
    [side * 1.02, 4.42, 1.71],
    [side * 1.22, 4.40, 1.86],
    [side * 1.32, 4.24, 2.04],
    [side * 1.31, 3.88, 2.09],
    [side * 1.29, 3.48, 2.04],
    [side * 1.10, 3.35, 1.90],
    [side * 0.97, 3.39, 1.78]
  ], 0.095, M.edge, 48);

  sphere(0.119, V(side * 1.02, 4.42, 1.71), M.armor);
  sphere(0.119, V(side * 0.97, 3.39, 1.78), M.armor);
}

// -----------------------------------------------------------------------------
// Tall side cheek pods, each with two stacked circular recessed ports.
// -----------------------------------------------------------------------------

for (const side of [-1, 1]) {
  roundedBox(
    0.94, 1.62, 1.42, 0.20, 0.055,
    V(side * 2.18, 4.03, 0.35), M.armor
  );

  roundedBox(
    0.96, 1.64, 0.095, 0.17, 0.02,
    V(side * 2.18, 4.03, 1.075), M.steel
  );

  const sidePanel = roundedBox(
    1.22, 1.39, 0.095, 0.23, 0.02,
    V(side * 2.675, 4.015, 0.28), M.hull
  );
  sidePanel.rotation.y = side * Math.PI / 2;

  // An angular overhanging roof visually joins each box to the dome.
  sidePrism(0.99, [
    [4.79, 1.10], [4.94, 0.69], [4.92, -0.41], [4.75, -0.34]
  ], side * 2.13, M.armor);

  for (const y of [3.64, 4.37]) {
    const x = side * 2.20;
    cylinderBetween(
      V(x, y, 1.112), V(x, y, 1.13),
      0.265, 0.265, M.bore
    );
    annulus(V(x, y, 1.12), Z_AXIS, 0.105, 0.302, 0.225, M.edge);
    annulus(V(x, y, 1.15), Z_AXIS, 0.086, 0.208, 0.164, M.steel);
    ring(V(x, y, 1.235), Z_AXIS, 0.222, 0.015, M.seam);
    cylinderBetween(
      V(x, y, 1.151), V(x, y, 1.157),
      0.161, 0.161, M.recess
    );
  }
}

// -----------------------------------------------------------------------------
// Flat roof hatch with bevels, hinges, and bent grab rails.
// -----------------------------------------------------------------------------

roundedBox(2.66, 0.25, 2.29, 0.22, 0.035, V(0, 4.995, -0.10), M.armor);
roundedBox(2.56, 0.055, 2.19, 0.19, 0.012, V(0, 5.128, -0.10), M.seam);
roundedBox(2.50, 0.135, 2.13, 0.18, 0.025, V(0, 5.195, -0.10), M.steel);

pipe([
  [-1.03, 5.28, 0.82], [-1.03, 5.43, 0.82],
  [-0.90, 5.48, 0.82], [0.66, 5.48, 0.82],
  [0.78, 5.41, 0.82], [0.78, 5.28, 0.82]
], 0.044, M.edge);

pipe([
  [1.05, 5.28, 0.55], [1.05, 5.43, 0.51],
  [1.05, 5.48, 0.38], [1.05, 5.48, -0.57],
  [1.05, 5.39, -0.68], [1.05, 5.28, -0.68]
], 0.043, M.edge);

for (const x of [-0.78, 0.56]) {
  cylinderBetween(
    V(x - 0.18, 5.29, -1.10),
    V(x + 0.18, 5.29, -1.10),
    0.084, 0.084, M.armor
  );
}

for (const x of [-1.05, 1.05]) {
  for (const z of [-0.88, 0.71]) {
    cylinderBetween(
      V(x, 5.261, z), V(x, 5.29, z),
      0.047, 0.047, M.recess, 6
    );
  }
}

// -----------------------------------------------------------------------------
// Roof-mounted round optic/searchlight with a split horseshoe-like front guard.
// -----------------------------------------------------------------------------

const optic = { x: -0.47, y: 5.99, z: -0.18 };

cylinderBetween(
  V(optic.x, 5.25, -0.34), V(optic.x, 5.43, -0.34),
  0.35, 0.30, M.edge
);
roundedBox(0.35, 0.44, 0.32, 0.06, 0.025, V(optic.x, 5.58, -0.34), M.armor);

cylinderBetween(
  V(optic.x, optic.y, -0.78),
  V(optic.x, optic.y, -0.40),
  0.43, 0.47, M.armor, 8
);
ring(V(optic.x, optic.y, -0.73), Z_AXIS, 0.42, 0.031, M.edge);

cylinderBetween(
  V(optic.x, optic.y, -0.43),
  V(optic.x, optic.y, 0.24),
  0.515, 0.545, M.steel
);

annulus(
  V(optic.x, optic.y, 0.245), Z_AXIS,
  0.10, 0.554, 0.425, M.armor
);
cylinderBetween(
  V(optic.x, optic.y, 0.265),
  V(optic.x, optic.y, 0.31),
  0.419, 0.419, M.recess
);
cylinderBetween(
  V(optic.x, optic.y, 0.311),
  V(optic.x, optic.y, 0.326),
  0.366, 0.366, M.hull
);
ring(V(optic.x, optic.y, 0.335), Z_AXIS, 0.405, 0.025, M.edge);

function opticGuardArc(start, end) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 0.60, start, end, false);
  shape.lineTo(0.477 * Math.cos(end), 0.477 * Math.sin(end));
  shape.absarc(0, 0, 0.477, end, start, true);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.075,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    bevelSegments: 2,
    curveSegments: 24
  });
  mesh(geometry, M.edge, V(optic.x, optic.y, 0.345));
}
opticGuardArc(0.09 * Math.PI, 0.94 * Math.PI);
opticGuardArc(1.10 * Math.PI, 1.96 * Math.PI);

for (const side of [-1, 1]) {
  cylinderBetween(
    V(optic.x + side * 0.49, optic.y, -0.13),
    V(optic.x + side * 0.59, optic.y, -0.13),
    0.16, 0.16, M.armor
  );
}
cylinderBetween(
  V(optic.x - 0.085, optic.y + 0.015, 0.33),
  V(optic.x - 0.085, optic.y + 0.015, 0.354),
  0.072, 0.072, M.seam
);

// -----------------------------------------------------------------------------
// Rear dorsal bracket, ribbed vertical canister, and two tall radio aerials.
// -----------------------------------------------------------------------------

sidePrism(0.76, [
  [5.18, -0.88], [5.18, -1.95],
  [6.00, -1.71], [5.86, -1.32]
], 0.04, M.armor);

sidePrism(0.032, [
  [5.28, -1.08], [5.28, -1.80],
  [5.88, -1.65], [5.77, -1.35]
], 0.438, M.steel);

const canisterCenter = V(-0.60, 5.75, -1.61);
const canisterLength = 1.50;

cylinderBetween(
  canisterCenter,
  canisterCenter.clone().add(V(0, canisterLength, 0)),
  0.277, 0.277, M.steel
);

for (let i = 0; i < 7; i++) {
  const a = i * Math.PI * 2 / 7;
  const offset = V(0.279 * Math.cos(a), 0, 0.279 * Math.sin(a));
  cylinderBetween(
    canisterCenter.clone().add(offset).add(V(0, 0.10, 0)),
    canisterCenter.clone().add(offset).add(V(0, 1.41, 0)),
    0.026, 0.026, i % 2 ? M.edge : M.armor, 10
  );
}

for (const h of [0.06, 1.43]) {
  cylinderBetween(
    canisterCenter.clone().add(V(0, h, 0)),
    canisterCenter.clone().add(V(0, h + 0.105, 0)),
    0.326, 0.326, M.edge
  );
  ring(
    canisterCenter.clone().add(V(0, h + 0.012, 0)),
    Y_AXIS, 0.326, 0.014, M.seam
  );
}

cylinderBetween(
  canisterCenter.clone().add(V(0, 1.535, 0)),
  canisterCenter.clone().add(V(0, 1.56, 0)),
  0.283, 0.283, M.armor
);

for (let i = 0; i < 5; i++) {
  const a = i * Math.PI * 2 / 5;
  const point = canisterCenter.clone().add(
    V(0.174 * Math.cos(a), 1.561, 0.174 * Math.sin(a))
  );
  cylinderBetween(point, point.clone().add(V(0, 0.013, 0)), 0.069, 0.069, M.bore, 18);
}

const aerialBase = V(0.29, 5.60, -1.45);
const aerialTip = V(0.53, 9.48, -2.26);
cylinderBetween(
  aerialBase.clone().add(V(0, -0.19, 0)), aerialBase,
  0.105, 0.081, M.edge
);
cylinderBetween(aerialBase, aerialTip, 0.041, 0.027, M.edge, 16);
sphere(0.062, aerialTip, M.steel);

const secondaryBase = V(0.03, 5.61, -1.40);
const secondaryTip = V(0.39, 7.92, -1.98);
cylinderBetween(secondaryBase, secondaryTip, 0.024, 0.014, M.steel, 12);
sphere(0.033, secondaryTip, M.edge);

// -----------------------------------------------------------------------------
// Rear auxiliary pipes: one open mortar-like tube and one crooked exhaust.
// -----------------------------------------------------------------------------

const auxiliaryBase = V(1.04, 4.53, -1.50);
const auxiliaryAxis = V(0.25, 0.961, -0.12).normalize();
sphere(0.285, auxiliaryBase, M.armor);

annulus(
  auxiliaryBase.clone().addScaledVector(auxiliaryAxis, 0.04),
  auxiliaryAxis, 0.32, 0.247, 0.147, M.armor
);
annulus(
  auxiliaryBase.clone().addScaledVector(auxiliaryAxis, 0.25),
  auxiliaryAxis, 1.31, 0.198, 0.134, M.steel
);
annulus(
  auxiliaryBase.clone().addScaledVector(auxiliaryAxis, 1.49),
  auxiliaryAxis, 0.10, 0.221, 0.137, M.edge
);
cylinderBetween(
  auxiliaryBase.clone().addScaledVector(auxiliaryAxis, 1.29),
  auxiliaryBase.clone().addScaledVector(auxiliaryAxis, 1.31),
  0.132, 0.132, M.bore
);

const exhaustBase = V(1.76, 4.07, -1.66);
const exhaustAxis = V(0.12, 0.991, -0.06).normalize();
cylinderBetween(
  exhaustBase,
  exhaustBase.clone().addScaledVector(exhaustAxis, 1.12),
  0.19, 0.17, M.edge
);
annulus(
  exhaustBase.clone().addScaledVector(exhaustAxis, 1.07),
  exhaustAxis, 0.10, 0.218, 0.105, M.armor
);

const exhaustTop = exhaustBase.clone().addScaledVector(exhaustAxis, 1.16);
pipe([
  exhaustTop,
  exhaustTop.clone().add(V(0.04, 0.20, -0.01)),
  exhaustTop.clone().add(V(0.10, 0.44, -0.04)),
  exhaustTop.clone().add(V(0.37, 0.59, -0.13))
], 0.055, M.edge, 24);

// -----------------------------------------------------------------------------
// Seven-barrel rotary gun, angled upward on a spherical right-rear mounting.
// -----------------------------------------------------------------------------

roundedBox(0.76, 0.30, 0.86, 0.09, 0.025, V(2.13, 3.06, -1.52), M.armor);
cylinderBetween(
  V(2.13, 3.10, -1.52), V(2.32, 3.72, -1.55),
  0.23, 0.22, M.steel
);

const rotaryBase = V(2.36, 3.85, -1.55);
const rotaryAxis = V(0.25, 0.956, -0.154).normalize();
sphere(0.405, rotaryBase, M.turret);

const rotaryRotation = new THREE.Quaternion()
  .setFromUnitVectors(Z_AXIS, rotaryAxis);
const radialU = V(1, 0, 0).applyQuaternion(rotaryRotation);
const radialV = V(0, 1, 0).applyQuaternion(rotaryRotation);

const alongRotary = distance =>
  rotaryBase.clone().addScaledVector(rotaryAxis, distance);

cylinderBetween(
  alongRotary(0.16), alongRotary(0.47),
  0.235, 0.285, M.armor
);

const barrelOffsets = [[0, 0]];
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3;
  barrelOffsets.push([0.247 * Math.cos(a), 0.247 * Math.sin(a)]);
}

for (let i = 0; i < barrelOffsets.length; i++) {
  const [u, v] = barrelOffsets[i];
  const offset = radialU.clone().multiplyScalar(u).addScaledVector(radialV, v);
  const start = alongRotary(0.36).add(offset);

  annulus(
    start, rotaryAxis, 2.47,
    0.082, 0.054, i % 2 === 0 ? M.edge : M.steel
  );

  annulus(
    alongRotary(2.79).add(offset),
    rotaryAxis, 0.054, 0.087, 0.055, M.edge
  );

  cylinderBetween(
    alongRotary(2.64).add(offset),
    alongRotary(2.66).add(offset),
    0.053, 0.053, M.bore, 24
  );
}

for (const distance of [0.42, 1.54]) {
  annulus(alongRotary(distance), rotaryAxis, 0.125, 0.366, 0.298, M.armor);
  ring(alongRotary(distance + 0.01), rotaryAxis, 0.366, 0.018, M.edge);
  ring(alongRotary(distance + 0.117), rotaryAxis, 0.365, 0.014, M.seam);
}

// A genuinely perforated muzzle plate preserves the visible cluster of bores.
const rotaryFace = new THREE.Shape();
rotaryFace.absarc(0, 0, 0.367, 0, Math.PI * 2, false);

for (const [u, v] of barrelOffsets) {
  const hole = new THREE.Path();
  hole.absarc(u, v, 0.058, 0, Math.PI * 2, true);
  rotaryFace.holes.push(hole);
}

const rotaryFaceGeometry = new THREE.ExtrudeGeometry(rotaryFace, {
  depth: 0.095,
  bevelEnabled: false,
  curveSegments: 12,
  steps: 1
});
const muzzlePlate = mesh(rotaryFaceGeometry, M.steel, alongRotary(2.72));
muzzlePlate.quaternion.copy(rotaryRotation);

annulus(alongRotary(2.715), rotaryAxis, 0.12, 0.389, 0.340, M.edge);
ring(alongRotary(2.833), rotaryAxis, 0.377, 0.014, M.seam);

// Small mechanical pivot cap on the outward side of the spherical mount.
cylinderBetween(
  V(2.65, 3.84, -1.55), V(2.77, 3.84, -1.55),
  0.146, 0.146, M.armor, 32
);

// -----------------------------------------------------------------------------
// Paired armored, cage-lined lamps on the forward hull shoulders.
// -----------------------------------------------------------------------------

function makeArmoredLamp(side) {
  const center = V(side * 1.51, 2.66, 2.68);
  const rotation = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), -0.49);
  const localToWorld = point => point.clone().applyQuaternion(rotation).add(center);

  pipe([
    [side * 1.20, 3.14, 1.76],
    [side * 1.36, 3.07, 2.01],
    [side * 1.50, 2.89, 2.39],
    [side * 1.51, 2.80, 2.51]
  ], 0.132, M.steel, 30);

  const housing = sphere(1, center, M.steel, [0.37, 0.51, 0.35]);
  housing.quaternion.copy(rotation);

  // Fine ribs follow the curved front of each oval armored lamp.
  const rx = 0.374;
  const ry = 0.515;
  const rz = 0.354;

  for (const x of [-0.19, 0, 0.19]) {
    const yLimit = ry * Math.sqrt(1 - (x * x) / (rx * rx)) * 0.98;
    const points = [];
    for (let j = 0; j <= 24; j++) {
      const y = -yLimit + 2 * yLimit * j / 24;
      const z = rz * Math.sqrt(Math.max(
        0, 1 - x * x / (rx * rx) - y * y / (ry * ry)
      )) + 0.008;
      points.push(localToWorld(V(x, y, z)));
    }
    pipe(points, 0.013, M.seam, 30);
  }

  for (const y of [-0.27, 0.035, 0.29]) {
    const xLimit = rx * Math.sqrt(1 - (y * y) / (ry * ry)) * 0.98;
    const points = [];
    for (let j = 0; j <= 24; j++) {
      const x = -xLimit + 2 * xLimit * j / 24;
      const z = rz * Math.sqrt(Math.max(
        0, 1 - x * x / (rx * rx) - y * y / (ry * ry)
      )) + 0.009;
      points.push(localToWorld(V(x, y, z)));
    }
    pipe(points, 0.014, M.seam, 30);
  }

  const perimeter = [];
  for (let j = 0; j <= 64; j++) {
    const a = j * Math.PI * 2 / 64;
    perimeter.push(localToWorld(V(rx * Math.cos(a), ry * Math.sin(a), 0.009)));
  }
  pipe(perimeter, 0.021, M.edge, 72);
}

makeArmoredLamp(-1);
makeArmoredLamp(1);

// Front-right three-quarter view, leaving room for the tall aerial.
camera.position.set(12.5, 11.5, 15.0);
camera.lookAt(0, 4.25, 0);