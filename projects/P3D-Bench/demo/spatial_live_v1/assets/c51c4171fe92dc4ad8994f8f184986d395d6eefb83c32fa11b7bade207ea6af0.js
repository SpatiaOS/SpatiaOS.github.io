// Parameters & Dimensions
// Mechanical planetary gear winch / educational epicyclic drive model
const params = {
  // Stand dimensions
  standHeight: 56,          // Distance from base to shaft center
  standBaseWidth: 76,       // Base width of triangular uprights
  standPlateThickness: 3.5, // Thickness of front/rear plates
  standSpacing: 20,         // Z-distance between front and rear plates
  standApexRadius: 13,      // Radius around central bearing at apex
  
  // Ring Gear (Annulus)
  ringOuterRadius: 52,
  ringPitchRadius: 42,
  ringToothHeight: 3.4,
  ringNumTeeth: 48,
  ringWidth: 16,
  ringZ: -14,
  
  // Epicyclic Gear Train (Planetary)
  sunPitchRadius: 14,
  sunNumTeeth: 16,
  sunWidth: 14,
  planetPitchRadius: 14,
  planetNumTeeth: 16,
  planetToothHeight: 3.4,
  planetWidth: 12,
  numPlanets: 3,
  
  // Crank Levers
  arm1Length: 88,    // Long diagonal crank
  arm1Angle: 2.36,   // ~135 degrees (up-left)
  arm2Length: 54,    // Near-vertical crank
  arm2Angle: 1.48,   // ~85 degrees (up)
  arm3Length: 30,    // Lower crank / reaction lever
  arm3Angle: -0.28,  // ~-16 degrees (down-right)
  handleGripRadius: 3.2,
  handleGripLength: 19,
  
  // Shafts
  shaftRadius: 4.8,
  shaftBoreRadius: 2.8
};

// Materials (Monochromatic technical CAD appearance with metallic shading)
const matStand = new THREE.MeshStandardMaterial({
  color: 0xb4b9c1,
  roughness: 0.45,
  metalness: 0.25
});

const matRingGear = new THREE.MeshStandardMaterial({
  color: 0x9ea4ae,
  roughness: 0.4,
  metalness: 0.35
});

const matSpurGear = new THREE.MeshStandardMaterial({
  color: 0xd2d7df,
  roughness: 0.3,
  metalness: 0.4
});

const matCarrier = new THREE.MeshStandardMaterial({
  color: 0xc4c9d2,
  roughness: 0.35,
  metalness: 0.3
});

const matShaft = new THREE.MeshStandardMaterial({
  color: 0xcdd2da,
  roughness: 0.3,
  metalness: 0.35
});

const matLever = new THREE.MeshStandardMaterial({
  color: 0xbcc2cb,
  roughness: 0.35,
  metalness: 0.25
});

const matGrip = new THREE.MeshStandardMaterial({
  color: 0x767c86,
  roughness: 0.5,
  metalness: 0.2
});

// Root group
const model = new THREE.Group();
scene.add(model);

// ==========================================
// 1. GEAR GENERATION HELPERS
// ==========================================

// Helper: Generates an external spur gear with realistic teeth
function createSpurGearGeometry(numTeeth, pitchRadius, toothHeight, width, holeRadius) {
  const shape = new THREE.Shape();
  const rRoot = pitchRadius - toothHeight * 0.55;
  const rTip = pitchRadius + toothHeight * 0.45;
  const dTheta = (Math.PI * 2) / numTeeth;

  for (let i = 0; i < numTeeth; i++) {
    const angle = i * dTheta;
    const a0 = angle - dTheta * 0.26;
    const a1 = angle - dTheta * 0.12;
    const a2 = angle + dTheta * 0.12;
    const a3 = angle + dTheta * 0.26;

    const p0 = [Math.cos(a0) * rRoot, Math.sin(a0) * rRoot];
    const p1 = [Math.cos(a1) * rTip, Math.sin(a1) * rTip];
    const p2 = [Math.cos(a2) * rTip, Math.sin(a2) * rTip];
    const p3 = [Math.cos(a3) * rRoot, Math.sin(a3) * rRoot];

    if (i === 0) shape.moveTo(p0[0], p0[1]);
    else shape.lineTo(p0[0], p0[1]);
    shape.lineTo(p1[0], p1[1]);
    shape.lineTo(p2[0], p2[1]);
    shape.lineTo(p3[0], p3[1]);
  }
  shape.closePath();

  if (holeRadius > 0) {
    const hole = new THREE.Path();
    const segs = 24;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const x = Math.cos(a) * holeRadius;
      const y = Math.sin(a) * holeRadius;
      if (i === 0) hole.moveTo(x, y);
      else hole.lineTo(x, y);
    }
    shape.holes.push(hole);
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.35,
    bevelThickness: 0.35
  });
  geom.center();
  return geom;
}

// Helper: Generates an internal ring gear (annulus) with internal teeth
function createRingGearGeometry(numTeeth, pitchRadius, toothHeight, outerRadius, width) {
  const shape = new THREE.Shape();
  const segs = 64;
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const x = Math.cos(a) * outerRadius;
    const y = Math.sin(a) * outerRadius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  const hole = new THREE.Path();
  const rRoot = pitchRadius + toothHeight * 0.55;
  const rTip = pitchRadius - toothHeight * 0.45;
  const dTheta = (Math.PI * 2) / numTeeth;

  for (let i = 0; i < numTeeth; i++) {
    const angle = i * dTheta;
    const a0 = angle - dTheta * 0.26;
    const a1 = angle - dTheta * 0.12;
    const a2 = angle + dTheta * 0.12;
    const a3 = angle + dTheta * 0.26;

    const p0 = [Math.cos(a0) * rRoot, Math.sin(a0) * rRoot];
    const p1 = [Math.cos(a1) * rTip, Math.sin(a1) * rTip];
    const p2 = [Math.cos(a2) * rTip, Math.sin(a2) * rTip];
    const p3 = [Math.cos(a3) * rRoot, Math.sin(a3) * rRoot];

    if (i === 0) hole.moveTo(p0[0], p0[1]);
    else hole.lineTo(p0[0], p0[1]);
    hole.lineTo(p1[0], p1[1]);
    hole.lineTo(p2[0], p2[1]);
    hole.lineTo(p3[0], p3[1]);
  }
  hole.closePath();
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.4,
    bevelThickness: 0.4
  });
  geom.center();
  return geom;
}

// ==========================================
// 2. RING GEAR & PLANETARY MECHANISM
// ==========================================

// Outer Ring Gear
const ringGeom = createRingGearGeometry(
  params.ringNumTeeth,
  params.ringPitchRadius,
  params.ringToothHeight,
  params.ringOuterRadius,
  params.ringWidth
);
const ringMesh = new THREE.Mesh(ringGeom, matRingGear);
ringMesh.position.set(0, 0, params.ringZ);
model.add(ringMesh);

// Central Sun Gear
const sunGeom = createSpurGearGeometry(
  params.sunNumTeeth,
  params.sunPitchRadius,
  params.planetToothHeight,
  params.sunWidth,
  params.shaftRadius
);
const sunMesh = new THREE.Mesh(sunGeom, matSpurGear);
sunMesh.position.set(0, 0, params.ringZ);
model.add(sunMesh);

// Planet Gears & Carrier Assembly
const orbitRadius = params.sunPitchRadius + params.planetPitchRadius;
const carrierGroup = new THREE.Group();
carrierGroup.position.set(0, 0, params.ringZ);
model.add(carrierGroup);

// Central spider hub of carrier
const carrierCenterHub = new THREE.Mesh(
  new THREE.CylinderGeometry(8.5, 8.5, 5, 24),
  matCarrier
);
carrierCenterHub.rotation.x = Math.PI / 2;
carrierCenterHub.position.z = params.planetWidth / 2 + 1;
carrierGroup.add(carrierCenterHub);

for (let i = 0; i < params.numPlanets; i++) {
  const angle = (i * Math.PI * 2) / params.numPlanets + Math.PI / 6; // 3 planets at 120 deg
  const px = Math.cos(angle) * orbitRadius;
  const py = Math.sin(angle) * orbitRadius;

  // Planet Spur Gear
  const planetGeom = createSpurGearGeometry(
    params.planetNumTeeth,
    params.planetPitchRadius,
    params.planetToothHeight,
    params.planetWidth,
    3
  );
  const planetMesh = new THREE.Mesh(planetGeom, matSpurGear);
  planetMesh.position.set(px, py, 0);
  planetMesh.rotation.z = -angle * 1.5;
  carrierGroup.add(planetMesh);

  // Planet axle pin
  const pinMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.6, params.planetWidth + 6, 16),
    matShaft
  );
  pinMesh.rotation.x = Math.PI / 2;
  pinMesh.position.set(px, py, 1);
  carrierGroup.add(pinMesh);

  // Planet axle retaining front nut
  const nutMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.2, 1.8, 6),
    matCarrier
  );
  nutMesh.rotation.x = Math.PI / 2;
  nutMesh.position.set(px, py, params.planetWidth / 2 + 3);
  carrierGroup.add(nutMesh);

  // Radial double-bracket arms for carrier (characteristic technical rails)
  const armLen = orbitRadius;
  const railGeom = new THREE.BoxGeometry(2, armLen - 4, 2.5);
  
  const rail1 = new THREE.Mesh(railGeom, matCarrier);
  rail1.position.set(Math.cos(angle) * (armLen * 0.45), Math.sin(angle) * (armLen * 0.45), params.planetWidth / 2 + 1.5);
  rail1.rotation.z = angle - Math.PI / 2;
  rail1.position.x += Math.cos(angle + Math.PI / 2) * 2.8;
  rail1.position.y += Math.sin(angle + Math.PI / 2) * 2.8;
  carrierGroup.add(rail1);

  const rail2 = new THREE.Mesh(railGeom, matCarrier);
  rail2.position.set(Math.cos(angle) * (armLen * 0.45), Math.sin(angle) * (armLen * 0.45), params.planetWidth / 2 + 1.5);
  rail2.rotation.z = angle - Math.PI / 2;
  rail2.position.x -= Math.cos(angle + Math.PI / 2) * 2.8;
  rail2.position.y -= Math.sin(angle + Math.PI / 2) * 2.8;
  carrierGroup.add(rail2);
}

// ==========================================
// 3. A-FRAME STAND & HOUSING
// ==========================================

// Helper: Creates A-frame triangular upright plate with bottom tabs
function createStandPlateShape() {
  const shape = new THREE.Shape();
  const halfBase = params.standBaseWidth / 2;
  const bottomY = -params.standHeight;
  const apexR = params.standApexRadius;

  // Bottom edge with notched corner feet
  shape.moveTo(-halfBase - 3, bottomY);
  shape.lineTo(-halfBase + 7, bottomY);
  shape.lineTo(-halfBase + 7, bottomY + 3);
  shape.lineTo(-halfBase + 3, bottomY + 3);
  
  // Left sloping edge up to apex
  shape.lineTo(-apexR * 0.85, -2);
  shape.absarc(0, 0, apexR, Math.PI * 0.88, Math.PI * 0.12, true);
  
  // Right sloping edge down to base
  shape.lineTo(halfBase - 3, bottomY + 3);
  shape.lineTo(halfBase - 7, bottomY + 3);
  shape.lineTo(halfBase - 7, bottomY);
  shape.lineTo(halfBase + 3, bottomY);
  shape.lineTo(halfBase + 3, bottomY - 3);
  shape.lineTo(-halfBase - 3, bottomY - 3);
  shape.closePath();

  // Central bearing bore
  const hole = new THREE.Path();
  hole.absarc(0, 0, 8.5, 0, Math.PI * 2, false);
  shape.holes.push(hole);

  return shape;
}

const standPlateGeom = new THREE.ExtrudeGeometry(createStandPlateShape(), {
  depth: params.standPlateThickness,
  bevelEnabled: true,
  bevelSegments: 1,
  steps: 1,
  bevelSize: 0.5,
  bevelThickness: 0.5
});
standPlateGeom.center();

// Front A-frame upright
const frontPlate = new THREE.Mesh(standPlateGeom, matStand);
frontPlate.position.set(0, -params.standHeight / 2, 10);
model.add(frontPlate);

// Rear A-frame upright (behind front plate)
const rearPlate = new THREE.Mesh(standPlateGeom, matStand);
rearPlate.position.set(0, -params.standHeight / 2, -params.standSpacing + 10);
model.add(rearPlate);

// Base Tie Bars connecting front & rear plates at the bottom
const tieBarGeom = new THREE.BoxGeometry(6, 5, params.standSpacing + 4);
const tieBarRight = new THREE.Mesh(tieBarGeom, matStand);
tieBarRight.position.set(params.standBaseWidth * 0.38, -params.standHeight - 1, 0);
model.add(tieBarRight);

const tieBarLeft = new THREE.Mesh(tieBarGeom, matStand);
tieBarLeft.position.set(-params.standBaseWidth * 0.38, -params.standHeight - 1, 0);
model.add(tieBarLeft);

// Corner Base Pads / Feet
const padGeom = new THREE.BoxGeometry(7, 3.5, 6);
[
  [-params.standBaseWidth / 2 - 0.5, 11],
  [params.standBaseWidth / 2 + 0.5, 11],
  [-params.standBaseWidth / 2 - 0.5, -params.standSpacing + 9],
  [params.standBaseWidth / 2 + 0.5, -params.standSpacing + 9]
].forEach(([px, pz]) => {
  const pad = new THREE.Mesh(padGeom, matStand);
  pad.position.set(px, -params.standHeight - 2, pz);
  model.add(pad);
});

// Central Bearing Sleeve across the apex
const apexSleeve = new THREE.Mesh(
  new THREE.CylinderGeometry(8.4, 8.4, params.standSpacing + 14, 28),
  matStand
);
apexSleeve.rotation.x = Math.PI / 2;
apexSleeve.position.set(0, 0, 4);
model.add(apexSleeve);

// Extended housing cone / collar extending forward
const housingExtension = new THREE.Mesh(
  new THREE.CylinderGeometry(7.2, 8.4, 12, 28),
  matStand
);
housingExtension.rotation.x = Math.PI / 2;
housingExtension.position.set(0, 0, 18);
model.add(housingExtension);

// Small top lubricating cup / oiler boss at the apex
const oilerBoss = new THREE.Mesh(
  new THREE.CylinderGeometry(1.8, 1.8, 4, 16),
  matStand
);
oilerBoss.position.set(0, 10, 14);
model.add(oilerBoss);

// ==========================================
// 4. MAIN SHAFT & CONCENTRIC SLEEVES
// ==========================================

// Concentric collar for Vertical Crank (Arm 2)
const collar2 = new THREE.Mesh(
  new THREE.CylinderGeometry(6.6, 6.6, 7, 24),
  matShaft
);
collar2.rotation.x = Math.PI / 2;
collar2.position.set(0, 0, 26);
model.add(collar2);

// Concentric collar for Long Crank (Arm 1)
const collar1 = new THREE.Mesh(
  new THREE.CylinderGeometry(5.8, 5.8, 7, 24),
  matShaft
);
collar1.rotation.x = Math.PI / 2;
collar1.position.set(0, 0, 34);
model.add(collar1);

// Inner Core Shaft protruding forward
const coreShaft = new THREE.Mesh(
  new THREE.CylinderGeometry(params.shaftRadius, params.shaftRadius, 76, 28),
  matShaft
);
coreShaft.rotation.x = Math.PI / 2;
coreShaft.position.set(0, 0, 12);
model.add(coreShaft);

// Front Shaft Tip with concentric hollow bore
const tipRing = new THREE.Mesh(
  new THREE.CylinderGeometry(5.2, 5.2, 5, 24),
  matShaft
);
tipRing.rotation.x = Math.PI / 2;
tipRing.position.set(0, 0, 48);
model.add(tipRing);

// Dark interior for bore effect
const boreInterior = new THREE.Mesh(
  new THREE.CylinderGeometry(params.shaftBoreRadius, params.shaftBoreRadius, 6, 24),
  matGrip
);
boreInterior.rotation.x = Math.PI / 2;
boreInterior.position.set(0, 0, 49.5);
model.add(boreInterior);

// ==========================================
// 5. CRANK ARMS & PARALLEL HANDLES
// ==========================================

// Helper: Constructs a crank lever with square elbow and parallel forward handle
function createCrankAssembly(armLength, armAngle, zPos, armWidth, armThick) {
  const group = new THREE.Group();
  group.position.set(0, 0, zPos);

  const cosA = Math.cos(armAngle);
  const sinA = Math.sin(armAngle);

  // Rectangular arm bar
  const barGeom = new THREE.BoxGeometry(armThick, armLength, armWidth);
  const bar = new THREE.Mesh(barGeom, matLever);
  bar.position.set(cosA * (armLength * 0.5), sinA * (armLength * 0.5), 0);
  bar.rotation.z = armAngle - Math.PI / 2;
  group.add(bar);

  // Square elbow block at arm tip
  const elbowSize = armWidth * 1.25;
  const elbowGeom = new THREE.BoxGeometry(elbowSize, elbowSize, elbowSize);
  const elbow = new THREE.Mesh(elbowGeom, matLever);
  elbow.position.set(cosA * armLength, sinA * armLength, 0);
  group.add(elbow);

  // Cylindrical handle grip pointing parallel along +Z
  const gripGeom = new THREE.CylinderGeometry(
    params.handleGripRadius,
    params.handleGripRadius,
    params.handleGripLength,
    20
  );
  const grip = new THREE.Mesh(gripGeom, matGrip);
  grip.rotation.x = Math.PI / 2;
  grip.position.set(
    cosA * armLength,
    sinA * armLength,
    params.handleGripLength * 0.5 + elbowSize * 0.4
  );
  group.add(grip);

  // Rounded end cap on the handle
  const capGeom = new THREE.CylinderGeometry(
    params.handleGripRadius,
    params.handleGripRadius * 0.85,
    1.2,
    20
  );
  const cap = new THREE.Mesh(capGeom, matLever);
  cap.rotation.x = Math.PI / 2;
  cap.position.set(
    cosA * armLength,
    sinA * armLength,
    params.handleGripLength + elbowSize * 0.4 + 0.6
  );
  group.add(cap);

  return group;
}

// 1. Long Diagonal Crank Arm (~135 degrees)
const crank1 = createCrankAssembly(
  params.arm1Length,
  params.arm1Angle,
  34,
  5.8,
  4.0
);
model.add(crank1);

// 2. Near-Vertical Crank Arm (~85 degrees)
const crank2 = createCrankAssembly(
  params.arm2Length,
  params.arm2Angle,
  26,
  5.5,
  3.8
);
model.add(crank2);

// 3. Lower Crank / Lever (~ -16 degrees)
const crank3 = createCrankAssembly(
  params.arm3Length,
  params.arm3Angle,
  44,
  4.8,
  3.5
);
model.add(crank3);

// Collar boss for crank 3
const collar3 = new THREE.Mesh(
  new THREE.CylinderGeometry(5.4, 5.4, 5, 24),
  matShaft
);
collar3.rotation.x = Math.PI / 2;
collar3.position.set(0, 0, 44);
model.add(collar3);

// ==========================================
// 6. CAMERA & LIGHTING CALIBRATION
// ==========================================

// Add distinct directional lighting to produce crisp CAD edge highlights
const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight1.position.set(-80, 100, 120);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xdce6f2, 0.45);
dirLight2.position.set(100, 40, -60);
scene.add(dirLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

// Position camera to match the isometric CAD view in the reference image:
// Elevated viewpoint from front-left, looking slightly down at the mechanism
camera.position.set(-105, 80, 125);
camera.lookAt(-4, -10, 8);