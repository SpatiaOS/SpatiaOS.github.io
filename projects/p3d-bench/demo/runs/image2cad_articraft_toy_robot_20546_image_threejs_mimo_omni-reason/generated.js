// Global scale factor for the entire robot
const robotScale = 1.0;
// Base material for the robot: metallic silver
const robotMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    metalness: 0.7, 
    roughness: 0.3 
});

// ------------------------------
// Torso Component
// ------------------------------
// Main cylindrical torso body
const torsoRadius = 2.5 * robotScale;
const torsoHeight = 4 * robotScale;
const torsoGeometry = new THREE.CylinderGeometry(torsoRadius, torsoRadius * 1.2, torsoHeight, 16);
const torso = new THREE.Mesh(torsoGeometry, robotMaterial);
torso.position.y = 8 * robotScale;
scene.add(torso);

// Torso top dome
const torsoDomeGeometry = new THREE.SphereGeometry(torsoRadius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
const torsoDome = new THREE.Mesh(torsoDomeGeometry, robotMaterial);
torsoDome.position.y = 8 * robotScale + torsoHeight / 2;
scene.add(torsoDome);

// Back thruster array
const thrusterCount = 3;
for(let i = 0; i < thrusterCount; i++) {
    const thrusterGeometry = new THREE.CylinderGeometry(0.4 * robotScale, 0.5 * robotScale, 1.5 * robotScale, 8);
    const thruster = new THREE.Mesh(thrusterGeometry, robotMaterial);
    thruster.position.set(
        (i - 1) * 1.2 * robotScale,
        8 * robotScale + 1 * robotScale,
        -torsoRadius - 0.7 * robotScale
    );
    thruster.rotation.x = Math.PI / 2;
    scene.add(thruster);
}

// ------------------------------
// Head Component
// ------------------------------
// Main head block
const headGeometry = new THREE.BoxGeometry(1.8 * robotScale, 1.2 * robotScale, 1.5 * robotScale);
const head = new THREE.Mesh(headGeometry, robotMaterial);
head.position.set(0, 10.5 * robotScale, 0.3 * robotScale);
scene.add(head);

// Head visor/face plate
const visorGeometry = new THREE.BoxGeometry(1.4 * robotScale, 0.6 * robotScale, 0.2 * robotScale);
const visorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
const visor = new THREE.Mesh(visorGeometry, visorMaterial);
visor.position.set(0, 10.5 * robotScale, 0.3 * robotScale + 0.75 * robotScale);
scene.add(visor);

// ------------------------------
// Arm Components (Left Arm)
// ------------------------------
const armGroup = new THREE.Group();

// Upper arm segment
const upperArmGeometry = new THREE.BoxGeometry(0.8 * robotScale, 3 * robotScale, 0.8 * robotScale);
const upperArm = new THREE.Mesh(upperArmGeometry, robotMaterial);
upperArm.position.set(-2.2 * robotScale, 7.5 * robotScale, 0);
armGroup.add(upperArm);

// Lower arm segment
const lowerArmGeometry = new THREE.BoxGeometry(0.6 * robotScale, 4 * robotScale, 0.6 * robotScale);
const lowerArm = new THREE.Mesh(lowerArmGeometry, robotMaterial);
lowerArm.position.set(-3 * robotScale, 5 * robotScale, 0);
lowerArm.rotation.z = Math.PI / 6;
armGroup.add(lowerArm);

// Claw prongs (3 prongs)
const clawProngGeometry = new THREE.BoxGeometry(0.2 * robotScale, 1.5 * robotScale, 0.2 * robotScale);
for(let i = -1; i <= 1; i++) {
    const prong = new THREE.Mesh(clawProngGeometry, robotMaterial);
    prong.position.set(-3.8 * robotScale + i * 0.3 * robotScale, 3.2 * robotScale, i * 0.2 * robotScale);
    prong.rotation.z = Math.PI / 8 * i;
    armGroup.add(prong);
}

// Arm joint details (cylinders)
const jointGeometry = new THREE.CylinderGeometry(0.5 * robotScale, 0.5 * robotScale, 0.8 * robotScale, 8);
const shoulderJoint = new THREE.Mesh(jointGeometry, robotMaterial);
shoulderJoint.position.set(-1.8 * robotScale, 8.5 * robotScale, 0);
shoulderJoint.rotation.x = Math.PI / 2;
armGroup.add(shoulderJoint);

const elbowJoint = new THREE.Mesh(jointGeometry, robotMaterial);
elbowJoint.position.set(-2.6 * robotScale, 6 * robotScale, 0);
elbowJoint.rotation.x = Math.PI / 2;
armGroup.add(elbowJoint);

scene.add(armGroup);

// ------------------------------
// Leg Components (Right Leg)
// ------------------------------
const legGroup = new THREE.Group();

// Upper leg segment
const upperLegGeometry = new THREE.BoxGeometry(1.2 * robotScale, 5 * robotScale, 1 * robotScale);
const upperLeg = new THREE.Mesh(upperLegGeometry, robotMaterial);
upperLeg.position.set(1.2 * robotScale, 3.5 * robotScale, 0);
legGroup.add(upperLeg);

// Lower leg segment
const lowerLegGeometry = new THREE.BoxGeometry(1 * robotScale, 6 * robotScale, 0.8 * robotScale);
const lowerLeg = new THREE.Mesh(lowerLegGeometry, robotMaterial);
lowerLeg.position.set(1.5 * robotScale, 0, 0);
lowerLeg.rotation.z = -Math.PI / 12;
legGroup.add(lowerLeg);

// Knee joint
const kneeJoint = new THREE.Mesh(jointGeometry, robotMaterial);
kneeJoint.position.set(1.3 * robotScale, 1 * robotScale, 0);
kneeJoint.rotation.x = Math.PI / 2;
legGroup.add(kneeJoint);

// ------------------------------
// Foot Component (Right Foot)
// ------------------------------
// Main foot block
const footGeometry = new THREE.BoxGeometry(3 * robotScale, 1 * robotScale, 2.5 * robotScale);
const foot = new THREE.Mesh(footGeometry, robotMaterial);
foot.position.set(1.8 * robotScale, -3 * robotScale, 0);
legGroup.add(foot);

// Foot tread details
const treadGeometry = new THREE.BoxGeometry(2.5 * robotScale, 0.2 * robotScale, 2 * robotScale);
const tread = new THREE.Mesh(treadGeometry, new THREE.MeshStandardMaterial({ color: 0x555555 }));
tread.position.set(1.8 * robotScale, -3.4 * robotScale, 0);
legGroup.add(tread);

scene.add(legGroup);

// ------------------------------
// Duplicate Leg for Left Side
// ------------------------------
const leftLegGroup = legGroup.clone();
leftLegGroup.position.x = -2.4 * robotScale;
leftLegGroup.scale.x = -1; // Mirror the leg
scene.add(leftLegGroup);

// ------------------------------
// Camera Setup
// ------------------------------
camera.position.set(15 * robotScale, 12 * robotScale, 15 * robotScale);
camera.lookAt(0, 6 * robotScale, 0);