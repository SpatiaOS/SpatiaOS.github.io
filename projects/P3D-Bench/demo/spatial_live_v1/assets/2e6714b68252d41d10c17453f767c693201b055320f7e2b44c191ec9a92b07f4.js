// Exposed hand-cranked planetary mechanism, interpreted from the reference.
// The wheel lies in the XY plane; its axle and handle grips point along +Z.
// Dimensions are arbitrary engineering units.

const P = {
  wheel: {
    centerY: 3.68,
    outerRadius: 3.42,
    module: 0.063125,
    ringTeeth: 96,
    sunTeeth: 60,
    planetTeeth: 18,
    thickness: 0.60,
    gearThickness: 0.35,
    pressureAngle: THREE.MathUtils.degToRad(20)
  },
  stand: {
    halfWidth: 2.55,
    frontZ: 1.72,
    rearZ: -0.90,
    plateThickness: 0.22,
    baseY: 0.16
  },
  shaft: {
    bodyRadius: 0.405,
    frontZ: 5.92
  },
  levers: {
    longLength: 6.90,
    longLean: THREE.MathUtils.degToRad(43),
    longZ: 4.26,
    uprightLength: 4.82,
    uprightLean: THREE.MathUtils.degToRad(4),
    uprightZ: 4.73,
    shortLength: 3.40,
    shortLean: THREE.MathUtils.degToRad(-66),
    width: 0.28,
    thickness: 0.17,
    gripRadius: 0.14,
    gripLength: 1.03
  }
};

const metal = {
  rim: new THREE.MeshStandardMaterial({
    color: 0xa2a3a8, metalness: 0.48, roughness: 0.43
  }),
  face: new THREE.MeshStandardMaterial({
    color: 0xb5b6ba, metalness: 0.40, roughness: 0.44
  }),
  gear: new THREE.MeshStandardMaterial({
    color: 0xa4a5aa, metalness: 0.48, roughness: 0.40
  }),
  side: new THREE.MeshStandardMaterial({
    color: 0x81838a, metalness: 0.42, roughness: 0.47
  }),
  shaft: new THREE.MeshStandardMaterial({
    color: 0xbfc0c3, metalness: 0.58, roughness: 0.34
  }),
  stand: new THREE.MeshStandardMaterial({
    color: 0x999ba2, metalness: 0.34, roughness: 0.51
  }),
  edge: new THREE.MeshStandardMaterial({
    color: 0x606269, metalness: 0.38, roughness: 0.49
  }),
  recess: new THREE.MeshStandardMaterial({
    color: 0x44474d, metalness: 0.25, roughness: 0.62
  })
};

const cy = P.wheel.centerY;
const mod = P.wheel.module;
const ringPitchRadius = P.wheel.ringTeeth * mod / 2;
const sunPitchRadius = P.wheel.sunTeeth * mod / 2;
const planetPitchRadius = P.wheel.planetTeeth * mod / 2;
const planetOrbitRadius = sunPitchRadius + planetPitchRadius;

// -----------------------------------------------------------------------------
// Geometry utilities
// -----------------------------------------------------------------------------

function addMesh(geometry, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function circleHole(x, y, radius) {
  const path = new THREE.Path();
  path.absarc(x, y, radius, 0, Math.PI * 2, true);
  path.closePath();
  return path;
}

function rectangleHole(x, y, width, height) {
  const path = new THREE.Path();
  path.moveTo(x - width / 2, y - height / 2);
  path.lineTo(x - width / 2, y + height / 2);
  path.lineTo(x + width / 2, y + height / 2);
  path.lineTo(x + width / 2, y - height / 2);
  path.closePath();
  return path;
}

function extrudeShape(
  shape, depth, x, y, z,
  material = metal.face,
  bevel = 0.01,
  sideMaterial = metal.side
) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments: 48,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    material: 0,
    extrudeMaterial: 1
  });

  return addMesh(
    geometry,
    [material, sideMaterial],
    x, y, z - depth / 2
  );
}

function addRing(outer, inner, depth, x, y, z, material = metal.shaft) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outer, 0, Math.PI * 2, false);
  shape.closePath();
  shape.holes.push(circleHole(0, 0, inner));
  return extrudeShape(shape, depth, x, y, z, material, 0.006, material);
}

function cylinderZ(radius, depth, x, y, z, material = metal.shaft, sides = 48) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, sides);
  geometry.rotateX(Math.PI / 2);
  return addMesh(geometry, material, x, y, z);
}

function cylinderY(radius, depth, x, y, z, material = metal.shaft, sides = 32) {
  return addMesh(
    new THREE.CylinderGeometry(radius, radius, depth, sides),
    material, x, y, z
  );
}

function roundedCylinderZ(radius, length, x, y, z, material = metal.shaft) {
  const bevel = Math.min(radius * 0.17, length * 0.12);
  const profile = [
    new THREE.Vector2(0, -length / 2),
    new THREE.Vector2(radius - bevel, -length / 2),
    new THREE.Vector2(radius, -length / 2 + bevel),
    new THREE.Vector2(radius, length / 2 - bevel),
    new THREE.Vector2(radius - bevel, length / 2),
    new THREE.Vector2(0, length / 2)
  ];
  const geometry = new THREE.LatheGeometry(profile, 48);
  geometry.rotateX(Math.PI / 2);
  return addMesh(geometry, material, x, y, z);
}

function torusZ(radius, tube, x, y, z, material = metal.edge) {
  return addMesh(
    new THREE.TorusGeometry(radius, tube, 8, 160),
    material, x, y, z
  );
}

function box(width, height, depth, x, y, z, material = metal.stand) {
  return addMesh(
    new THREE.BoxGeometry(width, height, depth),
    material, x, y, z
  );
}

function beamXY(ax, ay, bx, by, width, depth, z, material = metal.face) {
  const dx = bx - ax;
  const dy = by - ay;
  const mesh = box(
    width, Math.hypot(dx, dy), depth,
    (ax + bx) / 2, (ay + by) / 2, z, material
  );
  mesh.rotation.z = -Math.atan2(dx, dy);
  return mesh;
}

function boltZ(x, y, z, radius = 0.105) {
  addRing(radius * 1.50, radius * 0.62, 0.028, x, y, z, metal.side);
  cylinderZ(radius * 0.61, 0.11, x, y, z + 0.04, metal.shaft, 24);
  const head = cylinderZ(radius, 0.085, x, y, z + 0.072, metal.shaft, 6);
  head.rotation.z = Math.PI / 6;
}

function boltY(x, y, z, radius = 0.10) {
  cylinderY(radius * 1.45, 0.025, x, y, z, metal.side);
  cylinderY(radius, 0.09, x, y + 0.055, z, metal.shaft, 6);
}

// Rounded, drilled links used for the three-arm planet carrier.
function carrierLink(ax, ay, bx, by, width, depth, z, material = metal.face) {
  const length = Math.hypot(bx - ax, by - ay);
  const r = width / 2;
  const shape = new THREE.Shape();

  shape.moveTo(-r, 0);
  shape.lineTo(-r, length);
  shape.absarc(0, length, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.absarc(0, 0, r, 0, -Math.PI, true);
  shape.closePath();

  shape.holes.push(circleHole(0, 0, width * 0.24));
  shape.holes.push(circleHole(0, length, width * 0.24));

  const mesh = extrudeShape(shape, depth, ax, ay, z, material, 0.008);
  mesh.rotation.z = -Math.atan2(bx - ax, by - ay);
  return mesh;
}

// Curved sector cutout: leaves a hub, radial spokes and a continuous gear rim.
function sectorHole(inner, outer, start, end) {
  const path = new THREE.Path();
  path.moveTo(inner * Math.cos(start), inner * Math.sin(start));
  path.absarc(0, 0, inner, start, end, false);
  path.lineTo(outer * Math.cos(end), outer * Math.sin(end));
  path.absarc(0, 0, outer, end, start, true);
  path.closePath();
  return path;
}

// Spur gears use sampled involute flanks, rather than separate rectangular teeth.
function spurGearShape(teeth, bore, options = {}) {
  const pitch = teeth * mod / 2;
  const root = pitch - 1.25 * mod;
  const tip = pitch + mod;
  const base = pitch * Math.cos(P.wheel.pressureAngle);
  const angularPitch = Math.PI * 2 / teeth;
  const halfTooth = Math.PI / (2 * teeth);
  const shape = new THREE.Shape();

  function involute(radius) {
    const t = Math.sqrt(Math.max(0, radius * radius / (base * base) - 1));
    return t - Math.atan(t);
  }

  const pitchInvolute = involute(pitch);

  function halfWidth(radius) {
    return halfTooth + pitchInvolute - involute(Math.max(radius, base));
  }

  let first = true;

  function point(radius, angle) {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (first) {
      shape.moveTo(x, y);
      first = false;
    } else {
      shape.lineTo(x, y);
    }
  }

  const flankStart = Math.max(root, base);

  for (let i = 0; i < teeth; i++) {
    const a = i * angularPitch;

    point(root, a - angularPitch / 2);
    point(root, a - halfWidth(flankStart) - angularPitch * 0.035);

    for (let j = 0; j <= 4; j++) {
      const r = flankStart + (tip - flankStart) * j / 4;
      point(r, a - halfWidth(r));
    }

    const tipHalfAngle = halfWidth(tip);
    for (let j = 1; j <= 3; j++) {
      point(tip, a - tipHalfAngle + 2 * tipHalfAngle * j / 3);
    }

    for (let j = 3; j >= 0; j--) {
      const r = flankStart + (tip - flankStart) * j / 4;
      point(r, a + halfWidth(r));
    }

    point(root, a + halfWidth(flankStart) + angularPitch * 0.035);
  }

  shape.closePath();
  shape.holes.push(circleHole(0, 0, bore));

  if (options.spokes) {
    const spacing = Math.PI * 2 / options.spokes;
    const gap = options.spokeGap || 0.24;
    const phase = options.windowPhase || 0;

    for (let i = 0; i < options.spokes; i++) {
      const a = phase + i * spacing;
      shape.holes.push(sectorHole(
        options.windowInner,
        options.windowOuter,
        a + gap / 2,
        a + spacing - gap / 2
      ));
    }
  }

  if (options.drillCount) {
    for (let i = 0; i < options.drillCount; i++) {
      const a = i * Math.PI * 2 / options.drillCount;
      shape.holes.push(circleHole(
        options.drillOrbit * Math.cos(a),
        options.drillOrbit * Math.sin(a),
        options.drillRadius
      ));
    }
  }

  return shape;
}

function addGear(teeth, bore, depth, x, y, z, options = {}) {
  const mesh = extrudeShape(
    spurGearShape(teeth, bore, options),
    depth, x, y, z,
    metal.gear, 0.006, metal.side
  );
  mesh.rotation.z = options.rotation || 0;
  return mesh;
}

// -----------------------------------------------------------------------------
// Triangular pedestal, rear A-frame and connecting foot rails
// -----------------------------------------------------------------------------

const halfWidth = P.stand.halfWidth;
const frontZ = P.stand.frontZ;
const rearZ = P.stand.rearZ;
const baseY = P.stand.baseY;

for (const side of [-1, 1]) {
  const x = side * halfWidth;

  box(0.29, 0.23, frontZ - rearZ + 0.42,
    x, 0.18, (frontZ + rearZ) / 2, metal.side);

  for (const z of [rearZ - 0.10, frontZ + 0.10]) {
    box(0.48, 0.11, 0.62, x, 0.055, z, metal.stand);
    boltY(x, 0.13, z + 0.14, 0.095);
  }

  beamXY(
    side * (halfWidth - 0.06), 0.25,
    side * 0.12, cy + 0.13,
    0.27, 0.24, rearZ, metal.stand
  );
}

box(halfWidth * 2 + 0.28, 0.27, 0.28,
  0, 0.21, rearZ, metal.stand);

box(halfWidth * 2 + 0.16, 0.22, 0.28,
  0, 0.19, frontZ, metal.stand);

// Solid front cheek plate, with the characteristic broad triangular silhouette.
const pedestal = new THREE.Shape();
pedestal.moveTo(-halfWidth + 0.15, baseY);
pedestal.lineTo(halfWidth - 0.12, baseY);
pedestal.lineTo(halfWidth, baseY + 0.14);
pedestal.lineTo(0.48, cy + 0.12);
pedestal.quadraticCurveTo(0.37, cy + 0.50, 0, cy + 0.51);
pedestal.quadraticCurveTo(-0.35, cy + 0.50, -0.48, cy + 0.12);
pedestal.lineTo(-halfWidth, baseY + 0.15);
pedestal.closePath();
pedestal.holes.push(circleHole(0, cy, 0.415));

extrudeShape(
  pedestal, P.stand.plateThickness,
  0, 0, frontZ, metal.stand, 0.018
);

// Narrow raised strips along the plate's sloping edges.
for (const side of [-1, 1]) {
  beamXY(
    side * 0.49, cy + 0.05,
    side * (halfWidth - 0.04), baseY + 0.16,
    side > 0 ? 0.16 : 0.105,
    0.07,
    frontZ + P.stand.plateThickness / 2 + 0.035,
    metal.face
  );

  const tab = box(
    0.32, 0.40, 0.11,
    side * (halfWidth - 0.19), 0.39, frontZ + 0.18, metal.face
  );
  tab.rotation.z = side * 0.45;

  boltZ(side * (halfWidth - 0.19), 0.39, frontZ + 0.25, 0.10);
}

// Front and rear bearing seats.
addRing(0.515, 0.407, 0.54, 0, cy, frontZ, metal.face);
addRing(0.540, 0.407, 0.085, 0, cy, frontZ + 0.30, metal.side);
addRing(0.485, 0.225, 0.38, 0, cy, rearZ, metal.face);
addRing(0.355, 0.225, 0.085, 0, cy, rearZ - 0.24, metal.side);

// Small lubrication cap on top of the front bearing.
cylinderY(0.165, 0.05, 0, cy + 0.52, frontZ - 0.06, metal.side);
cylinderY(0.125, 0.13, 0, cy + 0.60, frontZ - 0.06, metal.shaft);
cylinderY(0.14, 0.055, 0, cy + 0.69, frontZ - 0.06, metal.face);

// -----------------------------------------------------------------------------
// Upright internally toothed outer ring
// -----------------------------------------------------------------------------

const internalRoot = ringPitchRadius + 1.25 * mod;
const internalTip = ringPitchRadius - mod;
const ringShape = new THREE.Shape();
ringShape.absarc(0, 0, P.wheel.outerRadius, 0, Math.PI * 2, false);
ringShape.closePath();

const internalBoundary = new THREE.Path();
const toothPitch = Math.PI * 2 / P.wheel.ringTeeth;
let firstRingPoint = true;

// Broad roots and narrower inward tooth tips reproduce the deep internal teeth.
for (let i = 0; i < P.wheel.ringTeeth; i++) {
  const center = i * toothPitch;
  const profile = [
    [-0.50, internalRoot],
    [-0.33, internalRoot],
    [-0.205, internalTip],
    [0.205, internalTip],
    [0.33, internalRoot]
  ];

  for (const [offset, radius] of profile) {
    const a = center + offset * toothPitch;
    const x = radius * Math.cos(a);
    const y = radius * Math.sin(a);

    if (firstRingPoint) {
      internalBoundary.moveTo(x, y);
      firstRingPoint = false;
    } else {
      internalBoundary.lineTo(x, y);
    }
  }
}

internalBoundary.closePath();
ringShape.holes.push(internalBoundary);

extrudeShape(
  ringShape, P.wheel.thickness,
  0, cy, 0, metal.rim, 0.008, metal.side
);

// Smooth annular lips leave the entire internal tooth row exposed.
for (const z of [-P.wheel.thickness / 2 - 0.023, P.wheel.thickness / 2 + 0.023]) {
  addRing(
    P.wheel.outerRadius + 0.005,
    internalRoot + 0.009,
    0.045, 0, cy, z, metal.face
  );

  torusZ(P.wheel.outerRadius, 0.008, 0, cy, z + Math.sign(z) * 0.025);
}

torusZ(
  internalRoot + 0.012, 0.007,
  0, cy, P.wheel.thickness / 2 + 0.050, metal.side
);

// Rear mounting blocks tie the stationary ring to the pedestal legs.
for (const side of [-1, 1]) {
  const x = side * 1.88;
  const y = cy - Math.sqrt(
    Math.pow(P.wheel.outerRadius - 0.035, 2) - x * x
  );
  box(0.44, 0.27, 0.55, x, y, -0.62, metal.stand);
}

// -----------------------------------------------------------------------------
// Open central sun wheel and three equally spaced planet gears
// -----------------------------------------------------------------------------

const sunRoot = sunPitchRadius - 1.25 * mod;

addGear(
  P.wheel.sunTeeth, 0.235, P.wheel.gearThickness,
  0, cy, -0.025,
  {
    spokes: 6,
    windowInner: 0.62,
    windowOuter: sunRoot - 0.24,
    spokeGap: 0.24,
    windowPhase: Math.PI / 12
  }
);

addRing(sunRoot - 0.018, sunRoot - 0.15, 0.025,
  0, cy, 0.164, metal.face);

addRing(0.435, 0.225, 0.19, 0, cy, 0.235, metal.shaft);
addRing(0.350, 0.225, 0.36, 0, cy, 0.49, metal.side);

const planetAngles = [
  Math.PI / 2,
  Math.PI * 7 / 6,
  Math.PI * 11 / 6
];

const planetCenters = [];

for (const angle of planetAngles) {
  const x = planetOrbitRadius * Math.cos(angle);
  const y = cy + planetOrbitRadius * Math.sin(angle);
  planetCenters.push({ x, y });

  addGear(
    P.wheel.planetTeeth, 0.108, P.wheel.gearThickness,
    x, y, -0.025,
    {
      drillCount: 3,
      drillOrbit: 0.285,
      drillRadius: 0.063
    }
  );

  // Axial pins, recessed bushes, and visible front spacers.
  cylinderZ(0.103, 1.55, x, y, 0.37, metal.shaft);
  addRing(0.205, 0.106, 0.075, x, y, -0.265, metal.side);
  addRing(0.193, 0.106, 0.070, x, y, 0.21, metal.face);
  cylinderZ(0.138, 0.48, x, y, 0.54, metal.shaft);
  addRing(0.184, 0.105, 0.07, x, y, 0.80, metal.side);
}

// A second, smaller reduction pair is visible in front of the main open wheel.
const auxiliaryTeeth = 32;
const inputPinionTeeth = 16;
const auxiliaryAngle = THREE.MathUtils.degToRad(146);
const auxiliaryOrbit = (auxiliaryTeeth + inputPinionTeeth) * mod / 2;
const auxiliaryX = auxiliaryOrbit * Math.cos(auxiliaryAngle);
const auxiliaryY = cy + auxiliaryOrbit * Math.sin(auxiliaryAngle);
const auxiliaryRoot = auxiliaryTeeth * mod / 2 - 1.25 * mod;

addGear(inputPinionTeeth, 0.225, 0.22, 0, cy, 0.49);

addGear(
  auxiliaryTeeth, 0.105, 0.25,
  auxiliaryX, auxiliaryY, 0.49,
  {
    spokes: 3,
    windowInner: 0.30,
    windowOuter: auxiliaryRoot - 0.19,
    spokeGap: 0.40,
    windowPhase: 0.22,
    rotation: 0.045
  }
);

cylinderZ(0.102, 0.74, auxiliaryX, auxiliaryY, 0.43, metal.shaft);
addRing(0.23, 0.105, 0.10, auxiliaryX, auxiliaryY, 0.675, metal.face);

carrierLink(
  0, cy, auxiliaryX, auxiliaryY,
  0.17, 0.09, 0.77, metal.side
);
boltZ(auxiliaryX, auxiliaryY, 0.84, 0.105);

// The narrow three-arm carrier stands forward of the toothed wheels.
for (const { x, y } of planetCenters) {
  carrierLink(0, cy, x, y, 0.205, 0.135, 0.965, metal.face);
  addRing(0.235, 0.107, 0.15, x, y, 0.975, metal.face);
  boltZ(x, y, 1.095, 0.12);
}

addRing(0.490, 0.225, 0.25, 0, cy, 0.97, metal.face);
addRing(0.395, 0.225, 0.075, 0, cy, 1.13, metal.side);

// -----------------------------------------------------------------------------
// Long projecting axle, turned collars and hollow front boss
// -----------------------------------------------------------------------------

cylinderZ(0.222, 2.28, 0, cy, 0.01, metal.shaft);
cylinderZ(0.285, 0.14, 0, cy, rearZ - 0.31, metal.shaft);

const transitionProfile = [
  new THREE.Vector2(0, -0.29),
  new THREE.Vector2(0.29, -0.29),
  new THREE.Vector2(0.32, -0.23),
  new THREE.Vector2(P.shaft.bodyRadius, 0.18),
  new THREE.Vector2(P.shaft.bodyRadius, 0.29),
  new THREE.Vector2(0, 0.29)
];
const transitionGeometry = new THREE.LatheGeometry(transitionProfile, 48);
transitionGeometry.rotateX(Math.PI / 2);
addMesh(transitionGeometry, metal.shaft, 0, cy, 1.32);

roundedCylinderZ(P.shaft.bodyRadius, 3.08, 0, cy, 3.00, metal.shaft);
addRing(0.453, 0.398, 0.15, 0, cy, 4.43, metal.face);
torusZ(0.452, 0.009, 0, cy, 4.515, metal.side);

cylinderZ(0.285, 0.93, 0, cy, 4.93, metal.shaft);

addRing(0.495, 0.283, 0.30, 0, cy, P.levers.longZ, metal.face);
addRing(0.473, 0.283, 0.085, 0, cy, 4.48, metal.side);
addRing(0.455, 0.283, 0.27, 0, cy, P.levers.uprightZ, metal.face);
addRing(0.382, 0.281, 0.075, 0, cy, 4.925, metal.side);

const noseZ = P.shaft.frontZ;
addRing(0.315, 0.19, 0.85, 0, cy, noseZ - 0.32, metal.shaft);
addRing(0.397, 0.19, 0.22, 0, cy, noseZ - 0.25, metal.face);
addRing(0.380, 0.19, 0.065, 0, cy, noseZ - 0.065, metal.side);
addRing(0.340, 0.19, 0.13, 0, cy, noseZ + 0.04, metal.face);
torusZ(0.332, 0.009, 0, cy, noseZ + 0.11, metal.edge);

// Recessed bore closure leaves a genuinely hollow-looking front opening.
cylinderZ(0.188, 0.025, 0, cy, noseZ - 0.16, metal.recess);

// -----------------------------------------------------------------------------
// Two tall flat crank levers and the shorter forward crank
// -----------------------------------------------------------------------------

function addHandle(x, y, mountZ, length = P.levers.gripLength) {
  addRing(0.166, 0.075, 0.05, x, y, mountZ + 0.055, metal.side);
  cylinderZ(0.075, length + 0.23, x, y,
    mountZ + 0.11 + length / 2, metal.shaft, 32);
  cylinderZ(0.105, 0.12, x, y, mountZ + 0.14, metal.shaft);

  const gripStart = mountZ + 0.21;
  roundedCylinderZ(
    P.levers.gripRadius, length,
    x, y, gripStart + length / 2, metal.face
  );

  const endZ = gripStart + length;
  torusZ(P.levers.gripRadius * 0.86, 0.007, x, y, endZ, metal.edge);
  cylinderZ(P.levers.gripRadius * 0.79, 0.009,
    x, y, endZ + 0.003, metal.rim);
}

function crankLever({
  length, lean, z,
  width = P.levers.width,
  depth = P.levers.thickness,
  gripY = length,
  slotY = null,
  slotWidth = 0.11,
  slotHeight = 0.17,
  gripLength = P.levers.gripLength
}) {
  const w = width / 2;
  const chamfer = 0.042;
  const bottom = -0.16;
  const top = length + 0.18;

  const shape = new THREE.Shape();
  shape.moveTo(-w + chamfer, bottom);
  shape.lineTo(w - chamfer, bottom);
  shape.lineTo(w, bottom + chamfer);
  shape.lineTo(w, top - chamfer);
  shape.lineTo(w - chamfer, top);
  shape.lineTo(-w + chamfer, top);
  shape.lineTo(-w, top - chamfer);
  shape.lineTo(-w, bottom + chamfer);
  shape.closePath();

  shape.holes.push(circleHole(0, 0, 0.095));
  shape.holes.push(circleHole(0, gripY, 0.077));

  if (slotY !== null) {
    shape.holes.push(rectangleHole(0, slotY, slotWidth, slotHeight));
  }

  const lever = extrudeShape(
    shape, depth, 0, cy, z, metal.face, 0.009, metal.side
  );
  lever.rotation.z = lean;

  const gripX = -Math.sin(lean) * gripY;
  const gripWorldY = cy + Math.cos(lean) * gripY;

  addHandle(gripX, gripWorldY, z + depth / 2, gripLength);
  return lever;
}

// Rear lever sweeps strongly up and left; the nearer lever is almost vertical.
crankLever({
  length: P.levers.longLength,
  lean: P.levers.longLean,
  z: P.levers.longZ,
  width: 0.29,
  gripLength: 1.05
});

crankLever({
  length: P.levers.uprightLength,
  lean: P.levers.uprightLean,
  z: P.levers.uprightZ,
  width: 0.285,
  slotY: 0.73,
  slotWidth: 0.105,
  slotHeight: 0.17,
  gripLength: 1.04
});

// The shorter crank crosses in front of the axle. Its grip sits inboard of
// a small rectangular opening at the squared-off tip.
crankLever({
  length: P.levers.shortLength,
  lean: P.levers.shortLean,
  z: noseZ - 0.18,
  width: 0.30,
  depth: 0.16,
  gripY: P.levers.shortLength - 0.40,
  slotY: P.levers.shortLength + 0.015,
  slotWidth: 0.13,
  slotHeight: 0.18,
  gripLength: 0.99
});

camera.position.set(12.0, 11.7, 15.6);
camera.lookAt(-0.65, 4.45, 1.90);