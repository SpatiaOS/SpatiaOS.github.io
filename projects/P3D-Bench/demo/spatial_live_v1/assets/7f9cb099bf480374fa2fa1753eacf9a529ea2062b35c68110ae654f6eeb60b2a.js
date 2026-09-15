// Parameters - Robotic Arm Dimensions & Proportions
const BASE_WIDTH = 3.6;
const BASE_DEPTH = 3.8;
const BASE_HEIGHT = 0.65;

// Joint Angles (matching the pose in the reference image)
const ANG_BASE_Y = -0.22;   // Robot overall orientation to match axonometric view
const ANG_J1 = 0.32;        // Turntable rotation around Y
const ANG_J2 = 0.52;        // Lower arm shoulder pitch (leaning back ~30°)
const ANG_J3 = -1.45;       // Forearm elbow pitch (extending forward ~83° from lower arm)
const ANG_J5 = 0.28;        // Wrist pitch (angled slightly downward)

// Materials - Precise technical CAD styling with subtle tonal variations
const matBody = new THREE.MeshStandardMaterial({
  color: 0x8b939d,
  roughness: 0.38,
  metalness: 0.25
});

const matBodyDark = new THREE.MeshStandardMaterial({
  color: 0x58606a,
  roughness: 0.45,
  metalness: 0.3
});

const matMachined = new THREE.MeshStandardMaterial({
  color: 0xa4acb6,
  roughness: 0.22,
  metalness: 0.45
});

const matSteelShaft = new THREE.MeshStandardMaterial({
  color: 0xc2c8cf,
  roughness: 0.18,
  metalness: 0.6
});

const matDarkAccent = new THREE.MeshStandardMaterial({
  color: 0x2b2e33,
  roughness: 0.55,
  metalness: 0.15
});

const matMotor = new THREE.MeshStandardMaterial({
  color: 0x424850,
  roughness: 0.35,
  metalness: 0.35
});

// Helper function to create cylinders oriented along specific axes ('x', 'y', 'z')
function createCylinder(rTop, rBot, height, segs, mat, axis = 'y') {
  const geo = new THREE.CylinderGeometry(rTop, rBot, height, segs);
  if (axis === 'x') geo.rotateZ(-Math.PI / 2);
  if (axis === 'z') geo.rotateX(Math.PI / 2);
  return new THREE.Mesh(geo, mat);
}

// Root robot assembly
const robot = new THREE.Group();
robot.rotation.y = ANG_BASE_Y;
scene.add(robot);

// ==========================================
// 1. BASE ASSEMBLY (Casting, Plinth & Mounts)
// ==========================================
const baseGroup = new THREE.Group();
robot.add(baseGroup);

// Main heavy rectangular base casting
const baseBody = new THREE.Mesh(
  new THREE.BoxGeometry(BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH),
  matBody
);
baseBody.position.y = BASE_HEIGHT / 2;
baseGroup.add(baseBody);

// Corner mounting tabs with bolt cutouts
const earOffsets = [
  [-BASE_WIDTH / 2 - 0.15, -BASE_DEPTH / 2 + 0.3],
  [BASE_WIDTH / 2 + 0.15, -BASE_DEPTH / 2 + 0.3],
  [-BASE_WIDTH / 2 - 0.15, BASE_DEPTH / 2 - 0.3],
  [BASE_WIDTH / 2 + 0.15, BASE_DEPTH / 2 - 0.3],
];

earOffsets.forEach(([ex, ez]) => {
  const ear = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.6), matBody);
  ear.position.set(ex, 0.1, ez);
  baseGroup.add(ear);

  const hole = createCylinder(0.1, 0.1, 0.22, 16, matDarkAccent);
  hole.position.set(ex, 0.1, ez);
  baseGroup.add(hole);
});

// Front electrical/pneumatic connector panel
const connectorBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.1, 0.45, 0.1),
  matBodyDark
);
connectorBox.position.set(0.3, BASE_HEIGHT * 0.5, BASE_DEPTH / 2 + 0.05);
baseGroup.add(connectorBox);

// Twin circular connector bulkheads
[-0.15, 0.15].forEach((cx) => {
  const connRing = createCylinder(0.1, 0.1, 0.16, 16, matSteelShaft, 'z');
  connRing.position.set(0.3 + cx, BASE_HEIGHT * 0.5 - 0.05, BASE_DEPTH / 2 + 0.12);
  baseGroup.add(connRing);

  const connInner = createCylinder(0.06, 0.06, 0.18, 16, matDarkAccent, 'z');
  connInner.position.copy(connRing.position);
  baseGroup.add(connInner);
});

// Turntable circular plinth
const plinth = createCylinder(1.72, 1.82, 0.22, 48, matBodyDark);
plinth.position.y = BASE_HEIGHT + 0.11;
baseGroup.add(plinth);

const plinthBevel = createCylinder(1.54, 1.68, 0.12, 48, matMachined);
plinthBevel.position.y = BASE_HEIGHT + 0.28;
baseGroup.add(plinthBevel);

// ==========================================
// 2. AXIS 1 (J1) - TURNTABLE & SHOULDER
// ==========================================
const j1Group = new THREE.Group();
j1Group.position.y = BASE_HEIGHT + 0.34;
j1Group.rotation.y = ANG_J1;
robot.add(j1Group);

// Rotating base disk
const j1Disk = createCylinder(1.48, 1.48, 0.18, 48, matBody);
j1Disk.position.y = 0.09;
j1Group.add(j1Disk);

const j1Collar = createCylinder(1.36, 1.44, 0.16, 48, matMachined);
j1Collar.position.y = 0.26;
j1Group.add(j1Collar);

// Shoulder vertical casting supporting J2 pivot
const shoulderColumn = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.25, 1.45),
  matBody
);
shoulderColumn.position.set(0, 0.95, -0.15);
j1Group.add(shoulderColumn);

// Chamfered front cover of shoulder
const shoulderFront = new THREE.Mesh(
  new THREE.CylinderGeometry(0.72, 0.72, 1.25, 24, 1, false, 0, Math.PI),
  matBody
);
shoulderFront.position.set(0, 0.95, 0.35);
j1Group.add(shoulderFront);

// Side bearing support housings for J2 horizontal axis
const j2RightBoss = createCylinder(0.8, 0.8, 0.35, 36, matBody, 'x');
j2RightBoss.position.set(0.72, 1.25, -0.15);
j1Group.add(j2RightBoss);

const j2LeftBoss = createCylinder(0.72, 0.72, 0.3, 36, matBody, 'x');
j2LeftBoss.position.set(-0.72, 1.25, -0.15);
j1Group.add(j2LeftBoss);

// Lower bracket for the parallel linkage bar
const linkLowerClevis1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.45), matBodyDark);
linkLowerClevis1.position.set(0.58, 0.75, -0.7);
j1Group.add(linkLowerClevis1);

const linkLowerClevis2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.45), matBodyDark);
linkLowerClevis2.position.set(0.72, 0.75, -0.7);
j1Group.add(linkLowerClevis2);

const linkLowerPin = createCylinder(0.08, 0.08, 0.26, 16, matSteelShaft, 'x');
linkLowerPin.position.set(0.65, 0.75, -0.7);
j1Group.add(linkLowerPin);

// ==========================================
// 3. AXIS 2 (J2) - LOWER ARM & DRIVE SHAFT
// ==========================================
const J2_PIVOT_Y = 1.25;
const J2_PIVOT_Z = -0.15;

const j2Group = new THREE.Group();
j2Group.position.set(0, J2_PIVOT_Y, J2_PIVOT_Z);
j2Group.rotation.x = ANG_J2;
j1Group.add(j2Group);

// Large side hub & prominent hexagonal drive shaft (visible on right side)
const rightFlange = createCylinder(0.85, 0.85, 0.16, 48, matMachined, 'x');
rightFlange.position.set(0.76, 0, 0);
j2Group.add(rightFlange);

const rightDarkRing = createCylinder(0.76, 0.76, 0.05, 48, matDarkAccent, 'x');
rightDarkRing.position.set(0.85, 0, 0);
j2Group.add(rightDarkRing);

const rightStepRing = createCylinder(0.68, 0.68, 0.22, 48, matBodyDark, 'x');
rightStepRing.position.set(0.96, 0, 0);
j2Group.add(rightStepRing);

const rightInnerCollar = createCylinder(0.48, 0.48, 0.18, 48, matMachined, 'x');
rightInnerCollar.position.set(1.1, 0, 0);
j2Group.add(rightInnerCollar);

// Prominent Hexagonal Shaft
const hexShaft = createCylinder(0.25, 0.25, 1.0, 6, matMachined, 'x');
hexShaft.position.set(1.6, 0, 0);
j2Group.add(hexShaft);

const hexEndCap = createCylinder(0.28, 0.28, 0.08, 6, matBodyDark, 'x');
hexEndCap.position.set(2.1, 0, 0);
j2Group.add(hexEndCap);

const hexCenterBolt = createCylinder(0.14, 0.14, 0.08, 6, matSteelShaft, 'x');
hexCenterBolt.position.set(2.16, 0, 0);
j2Group.add(hexCenterBolt);

// Left side pivot cap
const leftHubCap = createCylinder(0.72, 0.72, 0.18, 36, matBodyDark, 'x');
leftHubCap.position.set(-0.76, 0, 0);
j2Group.add(leftHubCap);

const leftCenterBolt = createCylinder(0.32, 0.32, 0.12, 24, matMachined, 'x');
leftCenterBolt.position.set(-0.86, 0, 0);
j2Group.add(leftCenterBolt);

// Lower Arm (Boom) Casting
const boomCenterSleeve = createCylinder(0.58, 0.58, 1.25, 36, matBody, 'x');
j2Group.add(boomCenterSleeve);

// Rear counterbalance boss
const rearBoss = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.6), matBodyDark);
rearBoss.position.set(0, 0.1, -0.5);
j2Group.add(rearBoss);

// Segmented, tapered industrial arm casting
const boomLower = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.0, 0.95), matBody);
boomLower.position.set(0, 0.55, 0.02);
j2Group.add(boomLower);

const boomMid = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.8), matBody);
boomMid.position.set(0, 1.35, 0.04);
j2Group.add(boomMid);

const boomUpper = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.85, 0.7), matBody);
boomUpper.position.set(0, 2.1, 0.06);
j2Group.add(boomUpper);

// Longitudinal stiffening side ribs
[-0.48, 0.48].forEach((sx) => {
  const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.2), matMachined);
  rib.position.set(sx, 1.35, 0.4);
  j2Group.add(rib);
});

// Upper clevis ears for J3 elbow pivot
const J3_OFFSET_Y = 2.65;
const J3_OFFSET_Z = 0.06;

const forkLeft = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 0.6), matBody);
forkLeft.position.set(-0.4, J3_OFFSET_Y, J3_OFFSET_Z);
j2Group.add(forkLeft);

const forkRight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 0.6), matBody);
forkRight.position.set(0.4, J3_OFFSET_Y, J3_OFFSET_Z);
j2Group.add(forkRight);

const j3CrossShaft = createCylinder(0.24, 0.24, 0.96, 32, matMachined, 'x');
j3CrossShaft.position.set(0, J3_OFFSET_Y, J3_OFFSET_Z);
j2Group.add(j3CrossShaft);

// ==========================================
// 4. AXIS 3 (J3) - ELBOW & FOREARM
// ==========================================
const j3Group = new THREE.Group();
j3Group.position.set(0, J3_OFFSET_Y, J3_OFFSET_Z);
j3Group.rotation.x = ANG_J3;
j2Group.add(j3Group);

// Elbow central housing
const elbowCenter = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.65, 0.7), matBody);
elbowCenter.position.set(0, 0, -0.1);
j3Group.add(elbowCenter);

// Dual Servo Motors on elbow rear (Z-)
// Motor 1 (Right)
const m1Cyl = createCylinder(0.17, 0.17, 0.85, 24, matMotor, 'z');
m1Cyl.position.set(0.18, 0.24, -0.85);
j3Group.add(m1Cyl);

const m1Cap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.18), matDarkAccent);
m1Cap.position.set(0.18, 0.24, -1.35);
j3Group.add(m1Cap);

// Motor 2 (Left)
const m2Cyl = createCylinder(0.15, 0.15, 0.78, 24, matMotor, 'z');
m2Cyl.position.set(-0.18, 0.22, -0.8);
j3Group.add(m2Cyl);

const m2Cap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.16), matDarkAccent);
m2Cap.position.set(-0.18, 0.22, -1.26);
j3Group.add(m2Cap);

// Forearm Transition Cone
const armTransition = createCylinder(0.28, 0.4, 0.5, 32, matBody, 'z');
armTransition.position.set(0, 0, 0.45);
j3Group.add(armTransition);

// Stepped decorative rings at base of forearm tube
const collar1 = createCylinder(0.36, 0.36, 0.14, 36, matMachined, 'z');
collar1.position.set(0, 0, 0.72);
j3Group.add(collar1);

const collar2 = createCylinder(0.32, 0.32, 0.08, 36, matBodyDark, 'z');
collar2.position.set(0, 0, 0.84);
j3Group.add(collar2);

// Long Cylindrical Forearm Tube
const forearmTube = createCylinder(0.25, 0.25, 2.2, 36, matBody, 'z');
forearmTube.position.set(0, 0, 1.95);
j3Group.add(forearmTube);

// Intermediate ring
const tubeBand = createCylinder(0.28, 0.28, 0.05, 36, matMachined, 'z');
tubeBand.position.set(0, 0, 1.95);
j3Group.add(tubeBand);

// Forearm Front Bearing Flange & Reducer Housing
const frontFlange = createCylinder(0.42, 0.42, 0.18, 36, matBody, 'z');
frontFlange.position.set(0, 0, 2.92);
j3Group.add(frontFlange);

const frontTaper = createCylinder(0.35, 0.42, 0.14, 36, matMachined, 'z');
frontTaper.position.set(0, 0, 3.08);
j3Group.add(frontTaper);

// ==========================================
// 5. AXES 4, 5, 6 - WRIST & END EFFECTOR
// ==========================================
// Axis 4 - Roll section
const j4Collar = createCylinder(0.34, 0.35, 0.2, 32, matBodyDark, 'z');
j4Collar.position.set(0, 0, 3.25);
j3Group.add(j4Collar);

const j4Reducer = createCylinder(0.26, 0.32, 0.22, 32, matMachined, 'z');
j4Reducer.position.set(0, 0, 3.46);
j3Group.add(j4Reducer);

// Axis 5 - Pitch Gimbal / Wrist Pivot
const J5_POS_Z = 3.65;
const j5Group = new THREE.Group();
j5Group.position.set(0, 0, J5_POS_Z);
j5Group.rotation.x = ANG_J5;
j3Group.add(j5Group);

// Gimbal block with side pivot cylinders
const j5Hub = createCylinder(0.17, 0.17, 0.38, 24, matMachined, 'x');
j5Group.add(j5Hub);

const j5Body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.28), matBody);
j5Group.add(j5Body);

// Axis 6 - Tool Flange & Inspection/Welding Tool
const toolFlange = createCylinder(0.22, 0.22, 0.08, 32, matSteelShaft, 'z');
toolFlange.position.set(0, 0, 0.22);
j5Group.add(toolFlange);

// Tool base mount
const toolBase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 0.16), matBodyDark);
toolBase.position.set(0, 0, 0.34);
j5Group.add(toolBase);

// Tool sensor/applicator ribbed block
const toolBlock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.18), matBody);
toolBlock.position.set(0, 0, 0.5);
j5Group.add(toolBlock);

// Tool cylindrical nozzle stem
const toolStem = createCylinder(0.08, 0.08, 0.16, 24, matSteelShaft, 'z');
toolStem.position.set(0, 0, 0.66);
j5Group.add(toolStem);

// Outer circular sensor ring / nozzle tip
const toolTip = createCylinder(0.16, 0.16, 0.06, 32, matMachined, 'z');
toolTip.position.set(0, 0, 0.76);
j5Group.add(toolTip);

const toolAperture = createCylinder(0.1, 0.1, 0.02, 24, matDarkAccent, 'z');
toolAperture.position.set(0, 0, 0.79);
j5Group.add(toolAperture);

// ==========================================
// 6. PARALLEL LINKAGE ROD (Dog-Leg Balance Arm)
// ==========================================
// Connects from shoulder lower pin to the upper elbow linkage bracket
const linkGroup = new THREE.Group();
j1Group.add(linkGroup);

// Lower pivot eye
const linkEyeLower = createCylinder(0.16, 0.16, 0.18, 24, matMachined, 'x');
linkEyeLower.position.set(0.65, 0.75, -0.7);
linkGroup.add(linkEyeLower);

// Lower straight segment (rising vertically/slightly forward)
const barLower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.16), matBody);
barLower.position.set(0.65, 1.35, -0.62);
barLower.rotation.x = -0.15;
linkGroup.add(barLower);

// Middle dog-leg knee bend
const kneeJunction = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.28, 0.2), matBodyDark);
kneeJunction.position.set(0.65, 1.95, -0.52);
linkGroup.add(kneeJunction);

// Upper angled segment (reaching back to elbow)
const barUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.16), matBody);
barUpper.position.set(0.61, 2.65, -0.85);
barUpper.rotation.x = 0.44;
linkGroup.add(barUpper);

// Upper pivot eye attached to elbow structure
const linkEyeUpper = createCylinder(0.15, 0.15, 0.18, 24, matMachined, 'x');
linkEyeUpper.position.set(0.58, 3.32, -1.2);
linkGroup.add(linkEyeUpper);

const linkUpperPin = createCylinder(0.08, 0.08, 0.24, 16, matSteelShaft, 'x');
linkUpperPin.position.copy(linkEyeUpper.position);
linkGroup.add(linkUpperPin);

// ==========================================
// 7. CAMERA SETUP
// ==========================================
// Isometric axonometric vantage point matching the reference CAD projection
camera.position.set(7.5, 6.2, 7.8);
camera.lookAt(0, 2.4, 0);

if (typeof controls !== 'undefined' && controls && controls.target) {
  controls.target.set(0, 2.4, 0);
  controls.update();
}