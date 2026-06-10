// Parametric recreation of the pictured coilover shock absorber.
// Interpretation: vertical Y-axis assembly with a helical compression spring,
// central damper body, upper gear-like adjuster collar, and top/bottom mounting eyes.

// ---------- Parameters ----------
const TWO_PI = Math.PI * 2;

const spring = {
  radius: 1.68,
  wireRadius: 0.28,
  startY: -5.25,
  endY: 4.05,
  turns: 4.72,
  phase: Math.PI * 0.32
};

const lowerPerch = {
  y: -5.65,
  radius: 1.85,
  thickness: 0.34,
  rimTube: 0.16
};

const upperPerch = {
  y: 4.22,
  radius: 1.48,
  thickness: 0.32,
  rimTube: 0.13
};

const damper = {
  centralRodRadius: 0.25,
  centralRodHeight: 14.55,
  centralRodY: -0.75,

  bodyRadius: 0.70,
  bodyHeight: 5.25,
  bodyY: -3.00,

  upperTubeRadius: 0.46,
  upperTubeHeight: 4.20,
  upperTubeY: 1.90,

  threadedRadius: 0.76,
  threadedYMin: 4.18,
  threadedYMax: 5.72,

  lowerStemRadius: 0.52,
  lowerStemHeight: 1.52,
  lowerStemY: -6.74
};

const gear = {
  y: 5.92,
  thickness: 0.65,
  teeth: 14,
  rootRadius: 1.62,
  outerRadius: 2.25,
  boreRadius: 0.72
};

const topMount = {
  postRadius: 0.56,
  postBottomY: 6.16,
  postTopY: 8.24,
  eyeY: 8.50,
  eyeOuterRadius: 0.69,
  eyeInnerRadius: 0.28,
  eyeWidth: 1.36
};

const bottomMount = {
  eyeY: -8.16,
  eyeOuterRadius: 0.63,
  eyeInnerRadius: 0.27,
  eyeWidth: 1.24
};

// ---------- Materials ----------
const matMetal = new THREE.MeshStandardMaterial({
  color: 0xbfc3c9,
  metalness: 0.28,
  roughness: 0.34,
  side: THREE.DoubleSide
});

const matLightMetal = new THREE.MeshStandardMaterial({
  color: 0xd8dbe0,
  metalness: 0.34,
  roughness: 0.24,
  side: THREE.DoubleSide
});

const matSpring = new THREE.MeshStandardMaterial({
  color: 0xcfd2d6,
  metalness: 0.30,
  roughness: 0.27
});

const matDark = new THREE.MeshStandardMaterial({
  color: 0x202226,
  metalness: 0.05,
  roughness: 0.70,
  side: THREE.DoubleSide
});

// ---------- Helpers ----------
function addMesh(name, geometry, material, position) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  if (position) mesh.position.copy(position);
  scene.add(mesh);
  return mesh;
}

function addCylinder(name, radiusTop, radiusBottom, height, centerY, material, segments = 72) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1, false);
  geometry.computeVertexNormals();
  return addMesh(name, geometry, material, new THREE.Vector3(0, centerY, 0));
}

function addBox(name, sx, sy, sz, x, y, z, material, rotationY = 0) {
  const geometry = new THREE.BoxGeometry(sx, sy, sz);
  const mesh = addMesh(name, geometry, material, new THREE.Vector3(x, y, z));
  mesh.rotation.y = rotationY;
  return mesh;
}

function addTorusY(name, radius, tube, centerY, material, radialSegments = 14, tubularSegments = 96) {
  const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  return addMesh(name, geometry, material, new THREE.Vector3(0, centerY, 0));
}

function addTorusX(name, radius, tube, position, material, radialSegments = 12, tubularSegments = 72) {
  const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
  geometry.rotateY(Math.PI / 2);
  geometry.computeVertexNormals();
  return addMesh(name, geometry, material, position);
}

function addSphere(name, radius, position, material, widthSegments = 28, heightSegments = 16) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  geometry.computeVertexNormals();
  return addMesh(name, geometry, material, position);
}

function addRadialBlock(name, y, radialCenter, radialDepth, tangentialWidth, height, angle, material) {
  const x = radialCenter * Math.cos(angle);
  const z = radialCenter * Math.sin(angle);
  const mesh = addBox(
    name,
    radialDepth,
    height,
    tangentialWidth,
    x,
    y,
    z,
    material,
    -angle
  );
  return mesh;
}

function addFlatOval(name, y, radialDistance, ovalLength, ovalWidth, angle, material) {
  const geometry = new THREE.CylinderGeometry(ovalWidth * 0.5, ovalWidth * 0.5, 0.026, 32);
  const x = radialDistance * Math.cos(angle);
  const z = radialDistance * Math.sin(angle);
  const mesh = addMesh(name, geometry, material, new THREE.Vector3(x, y, z));
  mesh.scale.x = ovalLength / ovalWidth;
  mesh.rotation.y = -angle;
  return mesh;
}

function helixPoint(radius, y0, y1, turns, phase, t) {
  const theta = phase + turns * TWO_PI * t;
  return new THREE.Vector3(
    radius * Math.cos(theta),
    y0 + (y1 - y0) * t,
    radius * Math.sin(theta)
  );
}

function addHelixTube(name, radius, tubeRadius, y0, y1, turns, phase, material, samplesPerTurn = 72, radialSegments = 16) {
  const samples = Math.max(32, Math.floor(turns * samplesPerTurn));
  const points = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    points.push(helixPoint(radius, y0, y1, turns, phase, t));
  }

  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  const geometry = new THREE.TubeGeometry(curve, samples, tubeRadius, radialSegments, false);
  geometry.computeVertexNormals();
  return addMesh(name, geometry, material, new THREE.Vector3(0, 0, 0));
}

function createAnnularExtrudeGeometry(outerRadius, innerRadius, depth, bevelSize = 0.025, curveSegments = 56) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, TWO_PI, false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, TWO_PI, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    steps: 1,
    bevelEnabled: bevelSize > 0,
    bevelThickness: bevelSize,
    bevelSize: bevelSize,
    bevelSegments: 3,
    curveSegments: curveSegments
  });

  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function addEyeX(name, centerY, outerRadius, innerRadius, width, material, centerZ = 0) {
  // Mounting eye is modeled as a real annular extrusion, with a through-hole along X.
  const eyeGeometry = createAnnularExtrudeGeometry(outerRadius, innerRadius, width, 0.035, 72);
  eyeGeometry.rotateY(Math.PI / 2);
  addMesh(name, eyeGeometry, material, new THREE.Vector3(0, centerY, centerZ));

  // Raised circular bosses on each face, matching the visible bearing collars.
  const bossGeometryA = createAnnularExtrudeGeometry(innerRadius + 0.18, innerRadius, 0.075, 0.010, 48);
  bossGeometryA.rotateY(Math.PI / 2);
  addMesh(`${name} right face boss`, bossGeometryA, material, new THREE.Vector3(width / 2 + 0.045, centerY, centerZ));

  const bossGeometryB = createAnnularExtrudeGeometry(innerRadius + 0.18, innerRadius, 0.075, 0.010, 48);
  bossGeometryB.rotateY(Math.PI / 2);
  addMesh(`${name} left face boss`, bossGeometryB, material, new THREE.Vector3(-width / 2 - 0.045, centerY, centerZ));

  addTorusX(`${name} right bore roundover`, innerRadius, 0.030, new THREE.Vector3(width / 2 + 0.090, centerY, centerZ), matDark, 10, 60);
  addTorusX(`${name} left bore roundover`, innerRadius, 0.030, new THREE.Vector3(-width / 2 - 0.090, centerY, centerZ), matDark, 10, 60);
}

function createGearGeometry(teeth, rootRadius, outerRadius, boreRadius, thickness) {
  // Spur/castle-like collar: alternating root and outer radii gives rectangular gear teeth.
  const pitch = TWO_PI / teeth;
  const halfToothTop = pitch * 0.29;

  const shape = new THREE.Shape();
  let first = true;

  for (let i = 0; i < teeth; i++) {
    const center = i * pitch;
    const a0 = center - pitch / 2;
    const a1 = center - halfToothTop;
    const a2 = center + halfToothTop;
    const a3 = center + pitch / 2;

    const pts = [
      [rootRadius, a0],
      [rootRadius, a1],
      [outerRadius, a1],
      [outerRadius, a2],
      [rootRadius, a2],
      [rootRadius, a3]
    ];

    for (const p of pts) {
      const x = p[0] * Math.cos(p[1]);
      const y = p[0] * Math.sin(p[1]);

      if (first) {
        shape.moveTo(x, y);
        first = false;
      } else {
        shape.lineTo(x, y);
      }
    }
  }

  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, boreRadius, 0, TWO_PI, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 2,
    curveSegments: 48
  });

  geometry.translate(0, 0, -thickness / 2);
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

// ---------- Central damper and shafts ----------
addCylinder(
  "continuous central damper rod",
  damper.centralRodRadius,
  damper.centralRodRadius,
  damper.centralRodHeight,
  damper.centralRodY,
  matLightMetal,
  56
);

addCylinder(
  "larger lower shock body inside spring",
  damper.bodyRadius,
  damper.bodyRadius,
  damper.bodyHeight,
  damper.bodyY,
  matMetal,
  80
);

addTorusY("lower shock body bottom crimp", damper.bodyRadius, 0.050, damper.bodyY - damper.bodyHeight / 2, matLightMetal);
addTorusY("lower shock body top crimp", damper.bodyRadius, 0.050, damper.bodyY + damper.bodyHeight / 2, matLightMetal);

addCylinder(
  "narrow upper piston tube inside spring",
  damper.upperTubeRadius,
  damper.upperTubeRadius,
  damper.upperTubeHeight,
  damper.upperTubeY,
  matLightMetal,
  64
);

addTorusY("upper piston tube lower shoulder", damper.upperTubeRadius, 0.040, damper.upperTubeY - damper.upperTubeHeight / 2, matMetal);
addTorusY("upper piston tube upper shoulder", damper.upperTubeRadius, 0.040, damper.upperTubeY + damper.upperTubeHeight / 2, matMetal);

// ---------- Lower spring perch and bottom mount ----------
addCylinder(
  "lower spring seat tapered dish",
  lowerPerch.radius,
  lowerPerch.radius * 0.88,
  lowerPerch.thickness,
  lowerPerch.y,
  matMetal,
  96
);

addTorusY("lower spring seat upper rolled rim", lowerPerch.radius - lowerPerch.rimTube, lowerPerch.rimTube, lowerPerch.y + lowerPerch.thickness / 2 - 0.02, matLightMetal);
addTorusY("lower spring seat lower edge bead", lowerPerch.radius * 0.90, 0.070, lowerPerch.y - lowerPerch.thickness / 2 - 0.02, matMetal);
addTorusY("lower spring seat outer groove", lowerPerch.radius * 0.98, 0.030, lowerPerch.y - 0.04, matDark, 8, 96);

addCylinder("lower seat central raised boss", 0.88, 0.78, 0.48, lowerPerch.y + 0.06, matMetal, 72);
addTorusY("lower seat boss fillet", 0.82, 0.060, lowerPerch.y + 0.29, matLightMetal);

for (let i = 0; i < 3; i++) {
  addFlatOval(
    `dark crescent relief slot on lower perch ${i + 1}`,
    lowerPerch.y + lowerPerch.thickness / 2 + 0.018,
    1.27,
    0.58,
    0.20,
    i * TWO_PI / 3 + Math.PI * 0.18,
    matDark
  );
}

addCylinder(
  "lower vertical mounting stem",
  damper.lowerStemRadius,
  damper.lowerStemRadius,
  damper.lowerStemHeight,
  damper.lowerStemY,
  matMetal,
  72
);

addBox("lower clevis left cheek plate", 0.22, 1.34, 0.70, -0.46, -7.48, 0, matMetal);
addBox("lower clevis right cheek plate", 0.22, 1.34, 0.70, 0.46, -7.48, 0, matMetal);
addEyeX(
  "bottom mounting eye with through hole",
  bottomMount.eyeY,
  bottomMount.eyeOuterRadius,
  bottomMount.eyeInnerRadius,
  bottomMount.eyeWidth,
  matMetal
);

// ---------- Helical coil spring ----------
addHelixTube(
  "large helical compression spring",
  spring.radius,
  spring.wireRadius,
  spring.startY,
  spring.endY,
  spring.turns,
  spring.phase,
  matSpring,
  80,
  20
);

addSphere(
  "rounded spring lower end",
  spring.wireRadius,
  helixPoint(spring.radius, spring.startY, spring.endY, spring.turns, spring.phase, 0),
  matSpring,
  24,
  14
);

addSphere(
  "rounded spring upper end",
  spring.wireRadius,
  helixPoint(spring.radius, spring.startY, spring.endY, spring.turns, spring.phase, 1),
  matSpring,
  24,
  14
);

// ---------- Upper spring perch, threaded sleeve, and adjuster rings ----------
addCylinder(
  "upper spring seat shallow cup",
  upperPerch.radius * 0.82,
  upperPerch.radius,
  upperPerch.thickness,
  upperPerch.y,
  matMetal,
  96
);

addTorusY("upper spring seat lower rolled rim", upperPerch.radius - upperPerch.rimTube, upperPerch.rimTube, upperPerch.y - upperPerch.thickness / 2 + 0.03, matLightMetal);
addTorusY("upper spring seat top shoulder", upperPerch.radius * 0.78, 0.070, upperPerch.y + upperPerch.thickness / 2, matMetal);

const threadedHeight = damper.threadedYMax - damper.threadedYMin;
addCylinder(
  "threaded adjuster sleeve under gear",
  damper.threadedRadius,
  damper.threadedRadius,
  threadedHeight,
  (damper.threadedYMin + damper.threadedYMax) / 2,
  matLightMetal,
  72
);

addHelixTube(
  "fine helical thread line on upper sleeve",
  damper.threadedRadius + 0.025,
  0.023,
  damper.threadedYMin + 0.05,
  damper.threadedYMax - 0.05,
  7.6,
  Math.PI * 0.15,
  matDark,
  42,
  8
);

for (let i = 0; i < 8; i++) {
  const y = damper.threadedYMin + 0.14 + i * ((threadedHeight - 0.28) / 7);
  addTorusY(`thin thread shadow ring ${i + 1}`, damper.threadedRadius + 0.006, 0.010, y, matDark, 6, 56);
}

addCylinder("lower lock nut ring", 1.05, 1.05, 0.20, 4.54, matMetal, 96);
addTorusY("lower lock nut upper bevel", 0.98, 0.045, 4.65, matLightMetal);
addTorusY("lower lock nut lower bevel", 0.98, 0.045, 4.43, matLightMetal);

addCylinder("upper lock nut ring", 0.98, 0.98, 0.18, 4.88, matMetal, 96);
addTorusY("upper lock nut upper bevel", 0.91, 0.040, 4.98, matLightMetal);
addTorusY("upper lock nut lower bevel", 0.91, 0.040, 4.78, matLightMetal);

// ---------- Gear-like adjustment collar ----------
const gearGeometry = createGearGeometry(
  gear.teeth,
  gear.rootRadius,
  gear.outerRadius,
  gear.boreRadius,
  gear.thickness
);
addMesh("top gear-like adjustment collar", gearGeometry, matMetal, new THREE.Vector3(0, gear.y, 0));

addTorusY("gear inner upper chamfer ring", gear.boreRadius + 0.10, 0.050, gear.y + gear.thickness / 2 + 0.015, matLightMetal);
addTorusY("gear inner lower chamfer ring", gear.boreRadius + 0.10, 0.050, gear.y - gear.thickness / 2 - 0.015, matLightMetal);

const tabHeight = 0.60;
for (let i = 0; i < gear.teeth; i++) {
  const angle = i * TWO_PI / gear.teeth + Math.PI / gear.teeth;
  addRadialBlock(
    `vertical castellated skirt tab ${i + 1}`,
    gear.y - gear.thickness / 2 - tabHeight / 2 + 0.03,
    1.32,
    0.42,
    0.25,
    tabHeight,
    angle,
    matMetal
  );
}

// ---------- Top post and mounting eye ----------
addCylinder("round collar above adjuster gear", 1.02, 0.92, 0.34, 6.32, matMetal, 96);
addTorusY("top collar lower fillet", 0.96, 0.060, 6.14, matLightMetal);
addTorusY("top collar upper fillet", 0.88, 0.055, 6.50, matLightMetal);

addCylinder(
  "upper vertical shock tower post",
  topMount.postRadius,
  topMount.postRadius,
  topMount.postTopY - topMount.postBottomY,
  (topMount.postBottomY + topMount.postTopY) / 2,
  matMetal,
  72
);

addTorusY("top post base roundover", topMount.postRadius, 0.045, topMount.postBottomY, matLightMetal);
addTorusY("top post shoulder below eye", topMount.postRadius, 0.045, topMount.postTopY, matLightMetal);

// Side cheek plates visually connect the vertical tower to the horizontal eye.
addBox("top yoke left cheek", 0.22, 1.45, 0.74, -0.46, 7.72, 0, matMetal);
addBox("top yoke right cheek", 0.22, 1.45, 0.74, 0.46, 7.72, 0, matMetal);

addEyeX(
  "top mounting eye with through hole",
  topMount.eyeY,
  topMount.eyeOuterRadius,
  topMount.eyeInnerRadius,
  topMount.eyeWidth,
  matMetal
);

// Small circular cap on the very top, echoing the visible round top surface in the reference.
addCylinder(
  "small circular cap on top eye",
  0.42,
  0.42,
  0.10,
  topMount.eyeY + topMount.eyeOuterRadius + 0.045,
  matLightMetal,
  56
);
addTorusY(
  "top cap bevel",
  0.38,
  0.035,
  topMount.eyeY + topMount.eyeOuterRadius + 0.100,
  matMetal,
  10,
  64
);

// ---------- Camera ----------
camera.position.set(7.5, 6.5, 20);
camera.lookAt(0, 0.15, 0);