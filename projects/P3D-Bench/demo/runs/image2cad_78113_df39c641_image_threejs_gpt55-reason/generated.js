// Parameters: a stylized vintage cafe-racer motorcycle interpreted from the reference.
// The bike is built along the X axis, with wheels in the X/Y plane and width along Z.
const wheelBase = 5.8;
const frontX = -wheelBase / 2;
const rearX = wheelBase / 2;
const wheelY = 1.12;

const tireMajorRadius = 0.95;
const tireTubeRadius = 0.15;
const tireOuterRadius = tireMajorRadius + tireTubeRadius;
const rimRadius = 0.70;
const rimTubeRadius = 0.035;
const hubRadius = 0.13;
const hubWidth = 0.62;
const spokeCount = 36;
const frameHalfWidth = 0.34;

// Materials: mostly grey CAD-style metal with darker rubber, spokes, chain, and panel lines.
const matPaintFlat = new THREE.MeshStandardMaterial({
  color: 0xb9bbbe,
  metalness: 0.08,
  roughness: 0.58,
  flatShading: true,
  side: THREE.DoubleSide
});

const matPaintSmooth = new THREE.MeshStandardMaterial({
  color: 0xc7c9cc,
  metalness: 0.08,
  roughness: 0.45,
  side: THREE.DoubleSide
});

const matFrame = new THREE.MeshStandardMaterial({
  color: 0x9fa3a7,
  metalness: 0.35,
  roughness: 0.38,
  side: THREE.DoubleSide
});

const matChrome = new THREE.MeshStandardMaterial({
  color: 0xd7d9dc,
  metalness: 0.72,
  roughness: 0.22,
  side: THREE.DoubleSide
});

const matEngine = new THREE.MeshStandardMaterial({
  color: 0xaeb1b4,
  metalness: 0.45,
  roughness: 0.34,
  side: THREE.DoubleSide
});

const matFin = new THREE.MeshStandardMaterial({
  color: 0x777b80,
  metalness: 0.38,
  roughness: 0.42,
  side: THREE.DoubleSide
});

const matRubber = new THREE.MeshStandardMaterial({
  color: 0x1d1d1e,
  metalness: 0.02,
  roughness: 0.88,
  side: THREE.DoubleSide
});

const matSeat = new THREE.MeshStandardMaterial({
  color: 0x262626,
  metalness: 0.02,
  roughness: 0.72,
  side: THREE.DoubleSide
});

const matDark = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 0.18,
  roughness: 0.62,
  side: THREE.DoubleSide
});

const matLine = new THREE.MeshStandardMaterial({
  color: 0x070707,
  metalness: 0.1,
  roughness: 0.5,
  side: THREE.DoubleSide
});

const matLens = new THREE.MeshStandardMaterial({
  color: 0x2b3338,
  metalness: 0.0,
  roughness: 0.18,
  side: THREE.DoubleSide
});

const matTailLens = new THREE.MeshStandardMaterial({
  color: 0x8b1010,
  metalness: 0.0,
  roughness: 0.22,
  side: THREE.DoubleSide
});

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function toVector(p) {
  if (p && p.isVector3) return p.clone();
  return new THREE.Vector3(p[0], p[1], p[2]);
}

function addMesh(geometry, material, position, rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  if (position) mesh.position.copy(toVector(position));
  if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  scene.add(mesh);
  return mesh;
}

function addBox(size, position, rotation, material) {
  if (material === undefined) {
    material = rotation;
    rotation = [0, 0, 0];
  }
  return addMesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material, position, rotation);
}

function addSphere(radius, position, material, widthSegments = 20, heightSegments = 12, scale) {
  const mesh = addMesh(new THREE.SphereGeometry(radius, widthSegments, heightSegments), material, position);
  if (scale) mesh.scale.set(scale[0], scale[1], scale[2]);
  return mesh;
}

function addCylinderBetween(start, end, radius, material, radialSegments = 16) {
  const p1 = toVector(start);
  const p2 = toVector(end);
  const direction = p2.clone().sub(p1);
  const length = direction.length();
  if (length <= 0.0001) return null;

  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(Y_AXIS, direction.normalize());
  scene.add(mesh);
  return mesh;
}

function addTaperedCylinderBetween(start, end, radiusStart, radiusEnd, material, radialSegments = 18) {
  const p1 = toVector(start);
  const p2 = toVector(end);
  const direction = p2.clone().sub(p1);
  const length = direction.length();
  if (length <= 0.0001) return null;

  const geometry = new THREE.CylinderGeometry(radiusEnd, radiusStart, length, radialSegments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(Y_AXIS, direction.normalize());
  scene.add(mesh);
  return mesh;
}

function addDiscZ(x, y, z, radius, depth, material, radialSegments = 40) {
  return addCylinderBetween([x, y, z - depth / 2], [x, y, z + depth / 2], radius, material, radialSegments);
}

function addDiscX(x, y, z, radius, depth, material, radialSegments = 40) {
  return addCylinderBetween([x - depth / 2, y, z], [x + depth / 2, y, z], radius, material, radialSegments);
}

function addDiscY(x, y, z, radius, depth, material, radialSegments = 40) {
  return addCylinderBetween([x, y - depth / 2, z], [x, y + depth / 2, z], radius, material, radialSegments);
}

function addTorus(majorRadius, tubeRadius, position, material, radialSegments = 12, tubularSegments = 96, arc = Math.PI * 2, rotation) {
  const geometry = new THREE.TorusGeometry(majorRadius, tubeRadius, radialSegments, tubularSegments, arc);
  return addMesh(geometry, material, position, rotation);
}

function addPathTube(points, radius, material, tubularSegments = 48, radialSegments = 10) {
  const curvePoints = points.map(toVector);
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  return addMesh(geometry, material);
}

function addHelixBetween(start, end, helixRadius, tubeRadius, turns, material) {
  const p1 = toVector(start);
  const p2 = toVector(end);
  const direction = p2.clone().sub(p1);
  const length = direction.length();
  const steps = Math.max(40, Math.floor(turns * 24));
  const pts = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = Math.PI * 2 * turns * t;
    pts.push(new THREE.Vector3(
      Math.cos(angle) * helixRadius,
      -length / 2 + length * t,
      Math.sin(angle) * helixRadius
    ));
  }

  const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps, tubeRadius, 7, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(Y_AXIS, direction.normalize());
  scene.add(mesh);
  return mesh;
}

// Octagonal loft used for faceted tank, engine cases, and seat cowl.
function createLoftedChamferedBoxGeometry(length, height, width, chamfer, slices) {
  const s = slices || [
    { x: -0.5, sy: 1, sz: 1, y: 0 },
    { x: 0.5, sy: 1, sz: 1, y: 0 }
  ];

  const verts = [];
  const indices = [];
  const ringCount = 8;

  for (let i = 0; i < s.length; i++) {
    const slice = s[i];
    const x = slice.x * length;
    const sy = slice.sy === undefined ? 1 : slice.sy;
    const sz = slice.sz === undefined ? 1 : slice.sz;
    const yOff = slice.y || 0;
    const h = height * sy;
    const w = width * sz;
    const c = Math.min(chamfer, h * 0.45, w * 0.45);

    const ring = [
      [ h / 2 - c, -w / 2 ],
      [ h / 2,     -w / 2 + c ],
      [ h / 2,      w / 2 - c ],
      [ h / 2 - c,  w / 2 ],
      [-h / 2 + c,  w / 2 ],
      [-h / 2,      w / 2 - c ],
      [-h / 2,     -w / 2 + c ],
      [-h / 2 + c, -w / 2 ]
    ];

    for (let j = 0; j < ring.length; j++) {
      verts.push(x, yOff + ring[j][0], ring[j][1]);
    }
  }

  for (let i = 0; i < s.length - 1; i++) {
    for (let j = 0; j < ringCount; j++) {
      const a = i * ringCount + j;
      const b = i * ringCount + ((j + 1) % ringCount);
      const c = (i + 1) * ringCount + ((j + 1) % ringCount);
      const d = (i + 1) * ringCount + j;
      indices.push(a, b, d, b, c, d);
    }
  }

  const startCenter = verts.length / 3;
  verts.push(s[0].x * length, s[0].y || 0, 0);
  for (let j = 0; j < ringCount; j++) {
    indices.push(startCenter, j, (j + 1) % ringCount);
  }

  const endCenter = verts.length / 3;
  const endStart = (s.length - 1) * ringCount;
  verts.push(s[s.length - 1].x * length, s[s.length - 1].y || 0, 0);
  for (let j = 0; j < ringCount; j++) {
    indices.push(endCenter, endStart + ((j + 1) % ringCount), endStart + j);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Curved rectangular strip for the fenders, with inner/outer radius and lateral width.
function createFenderGeometry(innerRadius, thickness, width, startAngle, endAngle, segments) {
  const verts = [];
  const indices = [];
  const outerRadius = innerRadius + thickness;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = startAngle + (endAngle - startAngle) * t;
    const ca = Math.cos(a);
    const sa = Math.sin(a);

    verts.push(innerRadius * ca, innerRadius * sa, -width / 2);
    verts.push(innerRadius * ca, innerRadius * sa,  width / 2);
    verts.push(outerRadius * ca, outerRadius * sa,  width / 2);
    verts.push(outerRadius * ca, outerRadius * sa, -width / 2);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 4;
    const b = (i + 1) * 4;

    indices.push(a, b, a + 1, b, b + 1, a + 1);
    indices.push(a + 3, a + 2, b + 3, a + 2, b + 2, b + 3);
    indices.push(a, a + 3, b, a + 3, b + 3, b);
    indices.push(a + 1, b + 1, a + 2, a + 2, b + 1, b + 2);
  }

  indices.push(0, 1, 2, 0, 2, 3);

  const e = segments * 4;
  indices.push(e, e + 3, e + 2, e, e + 2, e + 1);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createTriPrismGeometry(points, zCenter, thickness) {
  const z0 = zCenter - thickness / 2;
  const z1 = zCenter + thickness / 2;
  const verts = [
    points[0][0], points[0][1], z0,
    points[1][0], points[1][1], z0,
    points[2][0], points[2][1], z0,
    points[0][0], points[0][1], z1,
    points[1][0], points[1][1], z1,
    points[2][0], points[2][1], z1
  ];

  const idx = [
    0, 1, 2,
    5, 4, 3,
    0, 3, 1, 1, 3, 4,
    1, 4, 2, 2, 4, 5,
    2, 5, 0, 0, 5, 3
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();
  return geometry;
}

// Wheels: slim vintage tires, polished rims, hubs, brake rotors, and cross-laced spokes.
function addWheel(x, isFront) {
  addTorus(tireMajorRadius, tireTubeRadius, [x, wheelY, 0], matRubber, 18, 128);
  addTorus(tireMajorRadius - 0.02, 0.018, [x, wheelY, 0], matDark, 8, 128);

  addTorus(rimRadius, rimTubeRadius, [x, wheelY, 0], matChrome, 10, 96);
  addTorus(rimRadius, 0.018, [x, wheelY, -0.085], matChrome, 8, 96);
  addTorus(rimRadius, 0.018, [x, wheelY,  0.085], matChrome, 8, 96);
  addTorus(rimRadius * 0.78, 0.017, [x, wheelY, 0], matFrame, 8, 80);

  addCylinderBetween([x, wheelY, -hubWidth / 2], [x, wheelY, hubWidth / 2], hubRadius, matChrome, 32);
  addCylinderBetween([x, wheelY, -0.24], [x, wheelY, -0.18], 0.18, matChrome, 32);
  addCylinderBetween([x, wheelY,  0.18], [x, wheelY,  0.24], 0.18, matChrome, 32);
  addCylinderBetween([x, wheelY, -0.48], [x, wheelY, 0.48], 0.045, matDark, 20);

  const hubFlangeR = 0.18;
  const spokeR = 0.0065;
  const cross = 0.43;

  for (let i = 0; i < spokeCount; i++) {
    const theta = (i / spokeCount) * Math.PI * 2;

    for (const side of [-1, 1]) {
      const startTheta = theta;
      const endTheta = theta + side * cross;
      const start = [
        x + hubFlangeR * Math.cos(startTheta),
        wheelY + hubFlangeR * Math.sin(startTheta),
        side * 0.20
      ];
      const end = [
        x + rimRadius * Math.cos(endTheta),
        wheelY + rimRadius * Math.sin(endTheta),
        side * 0.055
      ];
      addCylinderBetween(start, end, spokeR, matLine, 5);
    }
  }

  const rotorZ = isFront ? 0.31 : -0.31;
  const rotorRadius = isFront ? 0.34 : 0.29;
  addDiscZ(x, wheelY, rotorZ, rotorRadius, 0.026, matChrome, 56);
  addTorus(rotorRadius * 0.78, 0.012, [x, wheelY, rotorZ + (isFront ? 0.018 : -0.018)], matLine, 6, 56);

  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    addDiscZ(
      x + rotorRadius * 0.58 * Math.cos(a),
      wheelY + rotorRadius * 0.58 * Math.sin(a),
      rotorZ + (isFront ? 0.025 : -0.025),
      0.018,
      0.012,
      matDark,
      10
    );
  }

  addSphere(0.065, [x, wheelY, -0.52], matFrame, 16, 10);
  addSphere(0.065, [x, wheelY,  0.52], matFrame, 16, 10);
}

addWheel(frontX, true);
addWheel(rearX, false);

// Fenders: partial curved sheet metal, positioned over the upper arcs of both wheels.
addMesh(
  createFenderGeometry(tireOuterRadius + 0.045, 0.075, 0.68, Math.PI * 0.16, Math.PI * 0.86, 36),
  matPaintSmooth,
  [frontX, wheelY, 0]
);

addMesh(
  createFenderGeometry(tireOuterRadius + 0.045, 0.075, 0.70, Math.PI * 0.08, Math.PI * 0.78, 34),
  matPaintSmooth,
  [rearX, wheelY, 0]
);

// Tubular frame: double side rails, lower cradle, triangular rear supports, and swingarm.
for (const side of [-1, 1]) {
  const z = side * frameHalfWidth;

  addCylinderBetween([-1.82, 2.94, z], [1.28, 2.30, z], 0.047, matFrame, 14);
  addCylinderBetween([1.20, 2.26, z], [3.10, 2.06, z], 0.043, matFrame, 14);
  addCylinderBetween([-1.82, 2.94, z], [-0.72, 1.05, z], 0.052, matFrame, 14);
  addCylinderBetween([-0.72, 1.05, z], [1.28, 0.98, z], 0.052, matFrame, 14);
  addCylinderBetween([1.28, 0.98, z], [1.04, 1.27, z], 0.048, matFrame, 14);
  addCylinderBetween([1.04, 1.27, z], [1.35, 2.22, z], 0.043, matFrame, 14);
  addCylinderBetween([1.04, 1.27, z], [2.75, 1.16, z], 0.055, matFrame, 14);
  addCylinderBetween([1.12, 1.42, z], [rearX, wheelY + 0.18, z], 0.043, matFrame, 14);
  addCylinderBetween([1.35, 2.22, z], [2.38, 1.56, z], 0.039, matFrame, 12);
  addCylinderBetween([2.38, 1.56, z], [3.10, 2.06, z], 0.038, matFrame, 12);
  addCylinderBetween([-0.65, 1.08, z], [-0.38, 1.95, z], 0.036, matFrame, 12);
}

addCylinderBetween([-1.82, 2.94, -0.42], [-1.82, 2.94, 0.42], 0.055, matFrame, 16);
addCylinderBetween([1.04, 1.27, -0.42], [1.04, 1.27, 0.42], 0.055, matFrame, 16);
addCylinderBetween([1.30, 0.98, -0.38], [1.30, 0.98, 0.38], 0.042, matFrame, 14);
addCylinderBetween([3.05, 2.05, -0.38], [3.05, 2.05, 0.38], 0.04, matFrame, 14);
addCylinderBetween([rearX, wheelY, -0.52], [rearX, wheelY, 0.52], 0.045, matDark, 18);

// Front fork: raked twin tubes, larger lower sliders, triple clamps, and axle brackets.
const forkTopX = -2.04;
const forkTopY = 3.18;
const forkTubeZ = 0.31;

for (const side of [-1, 1]) {
  const z = side * forkTubeZ;
  const top = new THREE.Vector3(forkTopX, forkTopY, z);
  const axle = new THREE.Vector3(frontX, wheelY, z);
  const lowerStart = top.clone().lerp(axle, 0.55);
  const lowerBand = top.clone().lerp(axle, 0.70);

  addCylinderBetween(top, lowerStart, 0.046, matChrome, 18);
  addTaperedCylinderBetween(lowerStart, axle, 0.075, 0.095, matPaintSmooth, 20);
  addCylinderBetween(lowerBand.clone().add(new THREE.Vector3(0.01, 0.04, 0)), lowerBand.clone().add(new THREE.Vector3(-0.01, -0.04, 0)), 0.089, matChrome, 18);
  addSphere(0.105, [frontX, wheelY, z], matFrame, 18, 12);

  addCylinderBetween([frontX + 0.10, wheelY + 0.15, z], [frontX + 0.28, wheelY + 0.55, z], 0.018, matFrame, 8);
  addCylinderBetween([frontX - 0.28, wheelY + 0.64, z], [frontX - 0.43, wheelY + 0.96, z], 0.016, matFrame, 8);
}

addBox([0.16, 0.09, 1.02], [forkTopX, 3.10, 0], [0, 0, -0.04], matFrame);
addBox([0.14, 0.075, 0.92], [forkTopX - 0.13, 2.86, 0], [0, 0, -0.04], matFrame);
addCylinderBetween([-1.78, 2.94, 0], [forkTopX, 3.14, 0], 0.07, matFrame, 18);

// Fuel tank: long faceted rectangular tank with chamfered edges, raised top panel, filler cap, and side badges.
const tankGeometry = createLoftedChamferedBoxGeometry(2.95, 0.72, 0.90, 0.13, [
  { x: -0.50, sy: 0.66, sz: 0.70, y: -0.04 },
  { x: -0.39, sy: 0.98, sz: 0.95, y: 0.02 },
  { x:  0.30, sy: 1.05, sz: 1.00, y: 0.02 },
  { x:  0.50, sy: 0.78, sz: 0.78, y: -0.05 }
]);
addMesh(tankGeometry, matPaintFlat, [-0.12, 2.84, 0], [0, 0, -0.035]);

addMesh(
  createLoftedChamferedBoxGeometry(0.72, 0.055, 0.42, 0.025),
  matPaintFlat,
  [-0.50, 3.24, 0],
  [0, 0, -0.035]
);

addDiscY(-1.05, 3.29, 0, 0.13, 0.06, matChrome, 34);

for (const side of [-1, 1]) {
  const z = side * 0.466;

  addCylinderBetween([-1.32, 3.03, z], [1.10, 2.95, z], 0.008, matLine, 6);
  addCylinderBetween([-1.28, 2.60, z], [1.08, 2.56, z], 0.007, matLine, 6);
  addCylinderBetween([-1.29, 2.78, z], [-1.43, 2.99, z], 0.007, matLine, 6);
  addCylinderBetween([1.05, 2.56, z], [1.30, 2.76, z], 0.007, matLine, 6);

  addTorus(0.125, 0.012, [0.82, 2.77, z + side * 0.006], matLine, 8, 36);
  addDiscZ(0.82, 2.77, z + side * 0.011, 0.073, 0.012, matDark, 24);
}

addCylinderBetween([-0.86, 3.275, -0.23], [0.00, 3.245, -0.23], 0.006, matLine, 6);
addCylinderBetween([-0.86, 3.275,  0.23], [0.00, 3.245,  0.23], 0.006, matLine, 6);

// Seat and rear cafe-racer tail cowl.
addMesh(
  createLoftedChamferedBoxGeometry(1.48, 0.18, 0.74, 0.055, [
    { x: -0.50, sy: 0.82, sz: 0.86, y: -0.02 },
    { x: -0.10, sy: 1.00, sz: 1.00, y: 0.00 },
    { x:  0.50, sy: 0.90, sz: 0.88, y: 0.02 }
  ]),
  matSeat,
  [2.22, 2.32, 0],
  [0, 0, -0.045]
);

addMesh(
  createLoftedChamferedBoxGeometry(0.58, 0.32, 0.76, 0.08, [
    { x: -0.50, sy: 0.70, sz: 0.88, y: -0.02 },
    { x:  0.15, sy: 1.00, sz: 1.00, y: 0.03 },
    { x:  0.50, sy: 0.75, sz: 0.80, y: 0.00 }
  ]),
  matPaintFlat,
  [3.02, 2.37, 0],
  [0, 0, -0.04]
);

addBox([1.78, 0.07, 0.68], [2.35, 2.17, 0], [0, 0, -0.045], matFrame);

// Triangular side plates under the seat with dark circular hole details.
const sidePlatePoints = [
  [1.28, 1.61],
  [2.18, 2.14],
  [2.30, 1.55]
];

for (const side of [-1, 1]) {
  const z = side * 0.405;
  addMesh(createTriPrismGeometry(sidePlatePoints, z, 0.045), matPaintFlat);

  addDiscZ(1.60, 1.78, z + side * 0.035, 0.043, 0.012, matDark, 18);
  addDiscZ(1.84, 1.91, z + side * 0.035, 0.038, 0.012, matDark, 18);
  addDiscZ(2.02, 1.70, z + side * 0.035, 0.037, 0.012, matDark, 18);
}

// Single-cylinder engine: crankcase, side covers, tilted finned cylinder barrel, head, carburetor, and small fasteners.
addMesh(
  createLoftedChamferedBoxGeometry(0.92, 0.56, 0.62, 0.075, [
    { x: -0.50, sy: 0.85, sz: 0.90, y: -0.03 },
    { x: -0.15, sy: 1.05, sz: 1.00, y: 0.02 },
    { x:  0.50, sy: 0.92, sz: 0.95, y: -0.02 }
  ]),
  matEngine,
  [0.18, 1.03, 0],
  [0, 0, -0.08]
);

for (const side of [-1, 1]) {
  addDiscZ(0.04, 1.22, side * 0.355, 0.37, 0.11, matEngine, 48);
  addDiscZ(0.43, 1.05, side * 0.405, 0.25, 0.105, matEngine, 40);
  addDiscZ(-0.30, 1.03, side * 0.380, 0.15, 0.09, matEngine, 32);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    addDiscZ(
      0.04 + 0.27 * Math.cos(a),
      1.22 + 0.27 * Math.sin(a),
      side * 0.425,
      0.018,
      0.012,
      matLine,
      8
    );
  }
}

const barrelBottom = new THREE.Vector3(-0.10, 1.42, 0);
const barrelTop = new THREE.Vector3(-0.46, 2.13, 0);
const barrelAxis = barrelTop.clone().sub(barrelBottom);
const barrelAngle = Math.atan2(-barrelAxis.x, barrelAxis.y);

addTaperedCylinderBetween(barrelBottom, barrelTop, 0.20, 0.24, matEngine, 28);

const finCount = 12;
for (let i = 0; i < finCount; i++) {
  const t = i / (finCount - 1);
  const pos = barrelBottom.clone().lerp(barrelTop, t);
  const finWidth = 0.56 + 0.10 * (1 - Math.abs(t - 0.5) * 2);
  addBox([finWidth, 0.026, 0.60], pos, [0, 0, barrelAngle], i % 2 === 0 ? matFin : matLine);
}

addBox([0.62, 0.24, 0.60], barrelTop.clone().add(new THREE.Vector3(-0.04, 0.08, 0)), [0, 0, barrelAngle], matEngine);
addBox([0.55, 0.08, 0.56], barrelTop.clone().add(new THREE.Vector3(-0.10, 0.22, 0)), [0, 0, barrelAngle], matFin);

addCylinderBetween(
  [barrelTop.x - 0.08, barrelTop.y + 0.20, 0.13],
  [barrelTop.x - 0.22, barrelTop.y + 0.40, 0.17],
  0.022,
  matDark,
  8
);

addPathTube([
  [-0.12, 1.98, -0.33],
  [0.18, 1.94, -0.43],
  [0.56, 1.82, -0.43]
], 0.055, matDark, 28, 10);

addDiscZ(0.62, 1.80, -0.43, 0.13, 0.14, matChrome, 24);
addBox([0.42, 0.34, 0.34], [1.42, 1.30, -0.29], [0, 0, -0.06], matPaintFlat);

// Exhaust: sweeping chrome header pipe wrapping down and back to a tapered muffler.
addPathTube([
  [-0.52, 2.02, 0.38],
  [-0.82, 1.70, 0.47],
  [-0.66, 1.20, 0.52],
  [0.10, 0.82, 0.51],
  [1.45, 0.76, 0.50],
  [2.20, 0.78, 0.50]
], 0.055, matChrome, 72, 12);

addTaperedCylinderBetween([1.82, 0.77, 0.50], [3.26, 0.76, 0.50], 0.125, 0.165, matChrome, 28);
addDiscX(3.30, 0.76, 0.50, 0.145, 0.045, matDark, 28);
addCylinderBetween([2.15, 0.90, 0.50], [2.92, 0.88, 0.50], 0.018, matLine, 8);

// Subtle mirrored exhaust stub on the opposite side to make the exported model read from both sides.
addPathTube([
  [-0.48, 1.96, -0.38],
  [-0.70, 1.47, -0.49],
  [-0.10, 0.88, -0.49],
  [1.18, 0.82, -0.49]
], 0.041, matChrome, 52, 10);

// Chain drive and sprockets on the left side.
addTorus(0.38, 0.035, [rearX, wheelY, -0.44], matFrame, 10, 56);
addTorus(0.22, 0.027, [0.72, 1.05, -0.44], matFrame, 10, 44);
addCylinderBetween([0.73, 1.25, -0.465], [rearX, 1.45, -0.465], 0.025, matDark, 8);
addCylinderBetween([0.73, 0.86, -0.465], [rearX, 0.85, -0.465], 0.025, matDark, 8);

for (let i = 0; i < 12; i++) {
  const t = i / 11;
  addBox(
    [0.055, 0.018, 0.045],
    [0.73 + (rearX - 0.73) * t, 1.25 + (1.45 - 1.25) * t, -0.465],
    [0, 0, 0.10],
    matLine
  );
}

// Rear shocks with visible coil springs.
for (const side of [-1, 1]) {
  const z = side * 0.46;
  const shockTop = new THREE.Vector3(2.18, 2.14, z);
  const shockBottom = new THREE.Vector3(2.68, 1.26, z);

  addCylinderBetween(shockTop, shockBottom, 0.034, matChrome, 16);
  addHelixBetween(shockTop, shockBottom, 0.087, 0.012, 5.6, matLine);
  addSphere(0.082, shockTop, matFrame, 16, 10);
  addSphere(0.082, shockBottom, matFrame, 16, 10);
}

// Fender and tail struts.
for (const side of [-1, 1]) {
  const z = side * 0.38;
  addCylinderBetween([2.05, 2.12, z], [3.18, 1.86, z], 0.020, matFrame, 8);
  addCylinderBetween([2.58, 2.05, z], [3.56, 1.62, z], 0.018, matFrame, 8);
}

addBox([0.30, 0.08, 0.42], [3.48, 2.05, 0], [0, 0, -0.08], matDark);
addDiscX(3.62, 2.09, 0, 0.125, 0.12, matTailLens, 28);

// Headlight, instruments, clip-on handlebars, grips, and cables.
addDiscX(-2.78, 3.16, 0, 0.245, 0.30, matPaintSmooth, 40);
addDiscX(-2.95, 3.16, 0, 0.205, 0.035, matLens, 40);
addCylinderBetween([-2.61, 3.14, -0.31], [-2.35, 3.06, -0.46], 0.025, matFrame, 10);
addCylinderBetween([-2.61, 3.14,  0.31], [-2.35, 3.06,  0.46], 0.025, matFrame, 10);

addDiscY(-2.08, 3.38, -0.16, 0.13, 0.075, matPaintSmooth, 32);
addDiscY(-2.08, 3.38,  0.16, 0.13, 0.075, matPaintSmooth, 32);
addDiscY(-2.08, 3.425, -0.16, 0.105, 0.014, matDark, 32);
addDiscY(-2.08, 3.425,  0.16, 0.105, 0.014, matDark, 32);

const barCenter = [-2.12, 3.30, 0];
for (const side of [-1, 1]) {
  const inner = [-2.38, 3.38, side * 0.46];
  const gripStart = [-2.55, 3.34, side * 0.70];
  const gripEnd = [-2.64, 3.31, side * 0.96];

  addCylinderBetween(barCenter, inner, 0.030, matChrome, 12);
  addCylinderBetween(inner, gripStart, 0.030, matChrome, 12);
  addCylinderBetween(gripStart, gripEnd, 0.043, matRubber, 14);
  addSphere(0.050, gripEnd, matDark, 14, 8);

  addCylinderBetween(gripStart, [-2.72, 3.10, side * 0.77], 0.012, matLine, 6);
}

addPathTube([
  [-2.55, 3.34, 0.72],
  [-2.35, 3.05, 0.64],
  [-2.18, 2.55, 0.52],
  [-2.52, 1.62, 0.35]
], 0.010, matLine, 38, 5);

addPathTube([
  [-2.52, 3.32, -0.72],
  [-2.20, 2.90, -0.58],
  [-1.28, 2.25, -0.42],
  [-0.58, 2.06, -0.35]
], 0.010, matLine, 38, 5);

// Front brake caliper on the visible rotor side.
addBox([0.16, 0.25, 0.15], [frontX + 0.35, wheelY + 0.38, 0.39], [0, 0, -0.55], matFrame);
addCylinderBetween([frontX + 0.28, wheelY + 0.49, 0.39], [frontX + 0.18, wheelY + 0.62, 0.39], 0.018, matDark, 8);

// Foot pegs, pedals, and kickstand details.
for (const side of [-1, 1]) {
  addCylinderBetween([0.62, 1.05, side * 0.36], [0.62, 1.05, side * 0.72], 0.042, matRubber, 14);
  addCylinderBetween([0.32, 1.14, side * 0.38], [0.60, 1.05, side * 0.57], 0.020, matFrame, 8);
  addSphere(0.055, [0.62, 1.05, side * 0.74], matDark, 14, 8);
}

addCylinderBetween([0.88, 0.96, -0.39], [1.26, 0.08, -0.76], 0.026, matDark, 8);
addBox([0.34, 0.045, 0.095], [1.32, 0.05, -0.78], [0, 0, -0.25], matDark);

// Small brackets and cross details under the tank and around the engine.
addCylinderBetween([-0.98, 2.42, -0.29], [0.24, 1.42, -0.29], 0.026, matFrame, 10);
addCylinderBetween([-0.98, 2.42,  0.29], [0.24, 1.42,  0.29], 0.026, matFrame, 10);
addCylinderBetween([-0.30, 2.35, -0.34], [0.72, 1.52, -0.34], 0.020, matFrame, 8);
addCylinderBetween([-0.30, 2.35,  0.34], [0.72, 1.52,  0.34], 0.020, matFrame, 8);

addBox([0.34, 0.12, 0.42], [-1.75, 2.78, 0], [0, 0, 0.50], matFrame);
addCylinderBetween([-1.90, 2.86, -0.21], [-1.90, 2.86, 0.21], 0.035, matChrome, 12);

// Rear axle caps and small fender-mounted lamp/fastener details.
addSphere(0.075, [rearX, wheelY, -0.54], matFrame, 16, 10);
addSphere(0.075, [rearX, wheelY,  0.54], matFrame, 16, 10);
addDiscX(3.08, 2.40, 0, 0.055, 0.08, matLine, 16);

// Camera adjusted to a three-quarter elevated view similar to the reference.
camera.position.set(6.4, 4.3, 5.6);
camera.lookAt(0, 1.75, 0);