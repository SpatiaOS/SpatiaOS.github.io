// --------------------------
// Industrial Robot Arm - 3D Model
// Proportions matched to reference isometric technical drawing
// All dimensions in generic units, Y is up axis
// --------------------------

// ==============================================
// Parameter Definitions
// ==============================================
// Base assembly
const BASE_WIDTH = 12;
const BASE_DEPTH = 10;
const BASE_THICKNESS = 2.5;
const BASE_LUG_EXTEND = 1.5;
const BASE_LUG_THICKNESS = 1.2;
const PLINTH_RADIUS = 3;
const PLINTH_HEIGHT = 1.2;

// Waist and Shoulder joint (J2)
const WAIST_HEIGHT = 1.0;
const SHOULDER_AXIS_Y = 6.0;
const SHOULDER_SHAFT_RADIUS = 0.8;
const SHOULDER_SHAFT_LENGTH = 4.0;
const SHOULDER_BEARING_RADIUS = 2.3;
const SHOULDER_BEARING_THICKNESS = 1.0;
const HEX_HEAD_RADIUS = 1.0;
const HEX_HEAD_THICKNESS = 0.7;

// Lower arm (J2 to J3 Elbow)
const LOWER_ARM_LENGTH = 5.5;
const LOWER_ARM_ANGLE = 130 * Math.PI / 180; // Angled up-left from shoulder
const LOWER_ARM_WIDTH = 2.2;
const LOWER_ARM_THICKNESS = 2.0;
const ELBOW_BEARING_RADIUS = 1.5;
const ELBOW_BEARING_THICKNESS = 0.8;

// Elbow detail parts
const STUB_RADIUS = 0.25;
const STUB_LENGTH = 1.2;
const STUB_OFFSET_Z = 0.5;

// Diagonal support link
const STRUT_WIDTH = 0.8;
const STRUT_THICKNESS = 0.8;
const STRUT_BOTTOM = new THREE.Vector3(1, 7, 0);

// Upper arm (J3 Elbow to Wrist)
const UPPER_ARM_LENGTH = 7.0;
const UPPER_ARM_ANGLE = 210 * Math.PI / 180; // Angled down-left from elbow
const UPPER_ARM_RADIUS = 1.0;
const UPPER_ARM_BEARING_RADIUS = 1.6;
const UPPER_ARM_BEARING_THICKNESS = 0.6;

// Wrist and End Effector
const END_EFFECTOR_ANGLE = 220 * Math.PI / 180; // Slightly steeper down angle at wrist
const WRIST_SEGMENTS = [
    { length: 1.0, radius: 1.3 },
    { length: 0.8, radius: 1.0 },
    { length: 0.7, radius: 0.7 },
    { length: 0.8, radius: 0.2 }
];
const TIP_RADIUS = 0.3;
const TIP_THICKNESS = 0.1;

// Materials - industrial cast steel gray finish
const mainMat = new THREE.MeshStandardMaterial({
    color: 0x8c9096,
    metalness: 0.6,
    roughness: 0.5
});
const detailMat = new THREE.MeshStandardMaterial({
    color: 0x6e7378,
    metalness: 0.7,
    roughness: 0.4
});

// Create main robot container group
const robot = new THREE.Group();

// ==============================================
// Base Assembly (fixed platform)
// ==============================================
// Main base plate
const baseBlockGeo = new THREE.BoxGeometry(BASE_WIDTH, BASE_THICKNESS, BASE_DEPTH);
const baseBlock = new THREE.Mesh(baseBlockGeo, mainMat);
baseBlock.position.y = BASE_THICKNESS / 2;
robot.add(baseBlock);

// Front mounting tab (towards +Z)
const lugFrontGeo = new THREE.BoxGeometry(4, BASE_LUG_THICKNESS, BASE_LUG_EXTEND);
const lugFront = new THREE.Mesh(lugFrontGeo, mainMat);
lugFront.position.set(1, BASE_LUG_THICKNESS / 2, BASE_DEPTH / 2 + BASE_LUG_EXTEND / 2);
robot.add(lugFront);

// Right mounting tab (towards +X)
const lugRightGeo = new THREE.BoxGeometry(BASE_LUG_EXTEND, BASE_LUG_THICKNESS, 4);
const lugRight = new THREE.Mesh(lugRightGeo, mainMat);
lugRight.position.set(BASE_WIDTH / 2 + BASE_LUG_EXTEND / 2, BASE_LUG_THICKNESS / 2, 2);
robot.add(lugRight);

// Left side inspection cover
const coverGeo = new THREE.BoxGeometry(0.2, 0.8, 1.8);
const cover = new THREE.Mesh(coverGeo, mainMat);
cover.position.set(-BASE_WIDTH / 2 - 0.1, 1.2, 1.5);
robot.add(cover);

// Front connector ports
const portGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
const port1 = new THREE.Mesh(portGeo, detailMat);
port1.rotation.x = Math.PI / 2; // Align port axis to +Z
port1.position.set(2, 1.8, BASE_DEPTH / 2 + 0.15);
robot.add(port1);
const port2 = new THREE.Mesh(portGeo, detailMat);
port2.rotation.x = Math.PI / 2;
port2.position.set(2, 1.2, BASE_DEPTH / 2 + 0.15);
robot.add(port2);

// Fixed plinth for waist rotation
const plinthGeo = new THREE.CylinderGeometry(PLINTH_RADIUS, PLINTH_RADIUS, PLINTH_HEIGHT, 32);
const plinth = new THREE.Mesh(plinthGeo, mainMat);
plinth.position.y = BASE_THICKNESS + PLINTH_HEIGHT / 2;
robot.add(plinth);

// Rotating waist turntable
const turntableGeo = new THREE.CylinderGeometry(PLINTH_RADIUS * 0.95, PLINTH_RADIUS * 0.95, WAIST_HEIGHT, 32);
const turntable = new THREE.Mesh(turntableGeo, mainMat);
turntable.position.y = BASE_THICKNESS + PLINTH_HEIGHT + WAIST_HEIGHT / 2;
robot.add(turntable);

// ==============================================
// Shoulder Joint (J2)
// ==============================================
// Main shoulder housing block
const shoulderHousingGeo = new THREE.BoxGeometry(5, 4, 4);
const shoulderHousing = new THREE.Mesh(shoulderHousingGeo, mainMat);
shoulderHousing.position.y = SHOULDER_AXIS_Y;
robot.add(shoulderHousing);

// Small side boss (-X direction)
const bossGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.0, 16);
const boss = new THREE.Mesh(bossGeo, mainMat);
boss.rotation.z = Math.PI / 2; // Align axis to -X direction
boss.position.set(-3, 6.5, -1);
robot.add(boss);

// Shoulder pivot shaft (axis along Z)
const shoulderShaftGeo = new THREE.CylinderGeometry(SHOULDER_SHAFT_RADIUS, SHOULDER_SHAFT_RADIUS, 6, 24);
const shoulderShaft = new THREE.Mesh(shoulderShaftGeo, mainMat);
shoulderShaft.rotation.x = Math.PI / 2; // Align axis to Z
shoulderShaft.position.set(0, SHOULDER_AXIS_Y, 1); // Shaft spans Z=-2 to Z=+4
robot.add(shoulderShaft);

// Stepped shoulder bearing housing
const shoulderBearing1 = new THREE.Mesh(
    new THREE.CylinderGeometry(SHOULDER_BEARING_RADIUS, SHOULDER_BEARING_RADIUS, SHOULDER_BEARING_THICKNESS, 32),
    mainMat
);
shoulderBearing1.rotation.x = Math.PI / 2;
shoulderBearing1.position.set(0, SHOULDER_AXIS_Y, 1.5);
robot.add(shoulderBearing1);

const shoulderBearing2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 0.8, 32),
    mainMat
);
shoulderBearing2.rotation.x = Math.PI / 2;
shoulderBearing2.position.set(0, SHOULDER_AXIS_Y, 1.5);
robot.add(shoulderBearing2);

const shoulderBearing3 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.4, 0.6, 32),
    mainMat
);
shoulderBearing3.rotation.x = Math.PI / 2;
shoulderBearing3.position.set(0, SHOULDER_AXIS_Y, 1.5);
robot.add(shoulderBearing3);

// Hex bolt head on shaft end
const hexGeo = new THREE.CylinderGeometry(HEX_HEAD_RADIUS, HEX_HEAD_RADIUS, HEX_HEAD_THICKNESS, 6);
const hexHead = new THREE.Mesh(hexGeo, detailMat);
hexHead.rotation.x = Math.PI / 2;
hexHead.position.set(0, SHOULDER_AXIS_Y, 4 + HEX_HEAD_THICKNESS / 2);
robot.add(hexHead);

// ==============================================
// Lower Arm & Elbow Joint (J3)
// ==============================================
// Calculate elbow joint center position
const elbowX = LOWER_ARM_LENGTH * Math.cos(LOWER_ARM_ANGLE);
const elbowY = SHOULDER_AXIS_Y + LOWER_ARM_LENGTH * Math.sin(LOWER_ARM_ANGLE);
const elbowPos = new THREE.Vector3(elbowX, elbowY, 0);

// Lower arm structural beam
const lowerArmGeo = new THREE.BoxGeometry(LOWER_ARM_LENGTH, LOWER_ARM_WIDTH, LOWER_ARM_THICKNESS);
const lowerArm = new THREE.Mesh(lowerArmGeo, mainMat);
lowerArm.rotation.z = LOWER_ARM_ANGLE;
lowerArm.position.set((0 + elbowX)/2, (SHOULDER_AXIS_Y + elbowY)/2, 0);
robot.add(lowerArm);

// Elbow cast housing
const elbowHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(2.0, 2.0, 2.2, 24),
    mainMat
);
elbowHousing.rotation.x = Math.PI/2; // Axis along Z
elbowHousing.position.copy(elbowPos);
robot.add(elbowHousing);

// Stepped elbow bearing
const elbowBearing1 = new THREE.Mesh(
    new THREE.CylinderGeometry(ELBOW_BEARING_RADIUS, ELBOW_BEARING_RADIUS, ELBOW_BEARING_THICKNESS, 32),
    mainMat
);
elbowBearing1.rotation.x = Math.PI/2;
elbowBearing1.position.copy(elbowPos);
robot.add(elbowBearing1);

const elbowBearing2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, 0.6, 32),
    mainMat
);
elbowBearing2.rotation.x = Math.PI/2;
elbowBearing2.position.copy(elbowPos);
robot.add(elbowBearing2);

// Diagonal support strut (parallelogram linkage)
const strutTop = new THREE.Vector3(
    elbowX + Math.cos(Math.PI/6) * 1.0,
    elbowY + Math.sin(Math.PI/6) * 1.0,
    0
);
const strutLength = STRUT_BOTTOM.distanceTo(strutTop);
const strutAngle = Math.atan2(strutTop.y - STRUT_BOTTOM.y, strutTop.x - STRUT_BOTTOM.x);
const strut = new THREE.Mesh(
    new THREE.BoxGeometry(strutLength, STRUT_WIDTH, STRUT_THICKNESS),
    mainMat
);
strut.rotation.z = strutAngle;
strut.position.set(
    (STRUT_BOTTOM.x + strutTop.x)/2,
    (STRUT_BOTTOM.y + strutTop.y)/2,
    0
);
robot.add(strut);

// Rear elbow stub shafts
const stubAngle = Math.PI/6; // 30 degrees, pointing up/back
const stubGeo = new THREE.CylinderGeometry(STUB_RADIUS, STUB_RADIUS, STUB_LENGTH, 12);
const stubBaseX = elbowX + Math.cos(stubAngle) * 0.2;
const stubBaseY = elbowY + Math.sin(stubAngle) * 0.2;
const stubMidX = stubBaseX + Math.cos(stubAngle) * (STUB_LENGTH/2);
const stubMidY = stubBaseY + Math.sin(stubAngle) * (STUB_LENGTH/2);

const stub1 = new THREE.Mesh(stubGeo, mainMat);
stub1.rotation.z = stubAngle - Math.PI/2;
stub1.position.set(stubMidX, stubMidY, STUB_OFFSET_Z);
robot.add(stub1);

const stub2 = new THREE.Mesh(stubGeo, mainMat);
stub2.rotation.z = stubAngle - Math.PI/2;
stub2.position.set(stubMidX, stubMidY, -STUB_OFFSET_Z);
robot.add(stub2);

// ==============================================
// Upper Arm (long cylindrical section)
// ==============================================
// Calculate wrist joint position
const wristX = elbowX + UPPER_ARM_LENGTH * Math.cos(UPPER_ARM_ANGLE);
const wristY = elbowY + UPPER_ARM_LENGTH * Math.sin(UPPER_ARM_ANGLE);
const wristPos = new THREE.Vector3(wristX, wristY, 0);

// Main upper arm cylinder
const upperArmGeo = new THREE.CylinderGeometry(UPPER_ARM_RADIUS, UPPER_ARM_RADIUS, UPPER_ARM_LENGTH, 24);
const upperArm = new THREE.Mesh(upperArmGeo, mainMat);
const upperArmRotZ = UPPER_ARM_ANGLE - Math.PI/2;
upperArm.rotation.z = upperArmRotZ;
upperArm.position.set((elbowX + wristX)/2, (elbowY + wristY)/2, 0);
robot.add(upperArm);

// Bearing flanges at elbow end of upper arm
const flangeElbow1 = new THREE.Mesh(
    new THREE.CylinderGeometry(UPPER_ARM_BEARING_RADIUS, UPPER_ARM_BEARING_RADIUS, UPPER_ARM_BEARING_THICKNESS, 32),
    mainMat
);
flangeElbow1.rotation.z = upperArmRotZ;
flangeElbow1.position.set(
    elbowX + Math.cos(UPPER_ARM_ANGLE) * 0.3,
    elbowY + Math.sin(UPPER_ARM_ANGLE) * 0.3,
    0
);
robot.add(flangeElbow1);

const flangeElbow2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 0.4, 32),
    mainMat
);
flangeElbow2.rotation.z = upperArmRotZ;
flangeElbow2.position.copy(flangeElbow1.position);
robot.add(flangeElbow2);

// Bearing flanges at wrist end of upper arm
const flangeWrist1 = new THREE.Mesh(
    new THREE.CylinderGeometry(UPPER_ARM_BEARING_RADIUS, UPPER_ARM_BEARING_RADIUS, UPPER_ARM_BEARING_THICKNESS, 32),
    mainMat
);
flangeWrist1.rotation.z = upperArmRotZ;
flangeWrist1.position.set(
    wristX - Math.cos(UPPER_ARM_ANGLE) * 0.3,
    wristY - Math.sin(UPPER_ARM_ANGLE) * 0.3,
    0
);
robot.add(flangeWrist1);

const flangeWrist2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 0.4, 32),
    mainMat
);
flangeWrist2.rotation.z = upperArmRotZ;
flangeWrist2.position.copy(flangeWrist1.position);
robot.add(flangeWrist2);

// ==============================================
// Wrist & End Effector
// ==============================================
const wristRotZ = END_EFFECTOR_ANGLE - Math.PI/2;
let currentX = wristX;
let currentY = wristY;

// Build stepped wrist segments
WRIST_SEGMENTS.forEach(seg => {
    const segMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(seg.radius, seg.radius, seg.length, 24),
        mainMat
    );
    segMesh.rotation.z = wristRotZ;
    segMesh.position.set(
        currentX + Math.cos(END_EFFECTOR_ANGLE) * (seg.length/2),
        currentY + Math.sin(END_EFFECTOR_ANGLE) * (seg.length/2),
        0
    );
    robot.add(segMesh);
    // Advance current position to end of segment
    currentX += Math.cos(END_EFFECTOR_ANGLE) * seg.length;
    currentY += Math.sin(END_EFFECTOR_ANGLE) * seg.length;
});

// Tool tip end cap
const tip = new THREE.Mesh(
    new THREE.CylinderGeometry(TIP_RADIUS, TIP_RADIUS, TIP_THICKNESS, 24),
    detailMat
);
tip.rotation.z = wristRotZ;
tip.position.set(
    currentX + Math.cos(END_EFFECTOR_ANGLE) * (TIP_THICKNESS/2),
    currentY + Math.sin(END_EFFECTOR_ANGLE) * (TIP_THICKNESS/2),
    0
);
robot.add(tip);

// ==============================================
// Final Orientation & Scene Setup
// ==============================================
// Rotate entire robot to match isometric reference view
robot.rotation.y = -Math.PI / 6;
scene.add(robot);

// Position camera to frame the complete robot
camera.position.set(22, 16, 24);
camera.lookAt(-4, 7, 0);