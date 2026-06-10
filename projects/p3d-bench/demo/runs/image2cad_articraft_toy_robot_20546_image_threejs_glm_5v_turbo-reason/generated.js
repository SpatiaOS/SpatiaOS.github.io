// Robot Mech Model - Parametric Construction
// Based on the mechanical bipedal figure shown in reference

// Parameters
const scale = 1;
const materialColor = 0x808080;
const darkMetal = 0x404040;
const accentColor = 0x606060;

// Materials
const bodyMat = new THREE.MeshStandardMaterial({ 
    color: materialColor, 
    metalness: 0.7, 
    roughness: 0.3 
});
const darkMat = new THREE.MeshStandardMaterial({ 
    color: darkMetal, 
    metalness: 0.8, 
    roughness: 0.2 
});
const accentMat = new THREE.MeshStandardMaterial({ 
    color: accentColor, 
    metalness: 0.6, 
    roughness: 0.4 
});

// Main robot container
const robot = new THREE.Group();

// ==================== TORSO ====================
const torsoGroup = new THREE.Group();

// Main chest plate
const chestGeo = new THREE.BoxGeometry(2.2, 2.4, 1.2);
const chest = new THREE.Mesh(chestGeo, bodyMat);
chest.position.set(0, 0, 0);
torsoGroup.add(chest);

// Chest armor detail (front plate)
const chestPlateGeo = new THREE.BoxGeometry(1.8, 1.8, 0.3);
const chestPlate = new THREE.Mesh(chestPlateGeo, accentMat);
chestPlate.position.set(0, 0.1, 0.7);
chestPlate.rotation.x = -0.1;
torsoGroup.add(chestPlate);

// Shoulder mounts
const shoulderMountGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.8, 8);
const leftShoulder = new THREE.Mesh(shoulderMountGeo, darkMat);
leftShoulder.position.set(-1.4, 0.9, 0);
leftShoulder.rotation.z = Math.PI / 2;
torsoGroup.add(leftShoulder);

const rightShoulder = new THREE.Mesh(shoulderMountGeo, darkMat);
rightShoulder.position.set(1.4, 0.9, 0);
rightShoulder.rotation.z = Math.PI / 2;
torsoGroup.add(rightShoulder);

// Back pack / Jetpack assembly
const backpackGeo = new THREE.BoxGeometry(1.6, 2.0, 1.0);
const backpack = new THREE.Mesh(backpackGeo, bodyMat);
backpack.position.set(0, 0.2, -0.9);
torsoGroup.add(backpack);

// Backpack fins/vents
const finGeo = new THREE.BoxGeometry(0.3, 1.2, 0.6);
const leftFin = new THREE.Mesh(finGeo, darkMat);
leftFin.position.set(-0.7, 0.8, -1.2);
leftFin.rotation.z = 0.3;
torsoGroup.add(leftFin);

const rightFin = new THREE.Mesh(finGeo, darkMat);
rightFin.position.set(0.7, 0.8, -1.2);
rightFin.rotation.z = -0.3;
torsoGroup.add(rightFin);

robot.add(torsoGroup);
torsoGroup.position.y = 3.5;

// ==================== HEAD ====================
const headGroup = new THREE.Group();

// Main head casing
const headGeo = new THREE.SphereGeometry(0.7, 16, 12);
headGeo.scale(1, 0.85, 0.9);
const head = new THREE.Mesh(headGeo, bodyMat);
head.position.set(0, 0, 0);
headGroup.add(head);

// Visor / Face plate
const visorGeo = new THREE.BoxGeometry(0.9, 0.5, 0.4);
const visor = new THREE.Mesh(visorGeo, darkMat);
visor.position.set(0, -0.1, 0.55);
visor.rotation.x = -0.2;
headGroup.add(visor);

// Head crest / helmet extension
const crestGeo = new THREE.ConeGeometry(0.4, 0.8, 4);
const crest = new THREE.Mesh(crestGeo, accentMat);
crest.position.set(0, 0.6, -0.2);
crest.rotation.x = -0.5;
headGroup.add(crest);

// Side armor pods
const podGeo = new THREE.CapsuleGeometry(0.25, 0.4, 4, 8);
const leftPod = new THREE.Mesh(podGeo, darkMat);
leftPod.position.set(-0.65, 0.15, 0);
leftPod.rotation.z = Math.PI / 2;
headGroup.add(leftPod);

const rightPod = new THREE.Mesh(podGeo, darkMat);
rightPod.position.set(0.65, 0.15, 0);
rightPod.rotation.z = Math.PI / 2;
headGroup.add(rightPod);

robot.add(headGroup);
headGroup.position.set(0, 4.9, 0);

// ==================== ARMS ====================
function createArm(isLeft) {
    const armGroup = new THREE.Group();
    const dir = isLeft ? -1 : 1;

    // Upper arm
    const upperArmGeo = new THREE.BoxGeometry(0.6, 1.4, 0.6);
    const upperArm = new THREE.Mesh(upperArmGeo, bodyMat);
    upperArm.position.set(dir * 0.3, -0.7, 0);
    armGroup.add(upperArm);

    // Elbow joint
    const elbowGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const elbow = new THREE.Mesh(elbowGeo, darkMat);
    elbow.position.set(dir * 0.3, -1.45, 0);
    armGroup.add(elbow);

    // Lower arm
    const lowerArmGeo = new THREE.BoxGeometry(0.5, 1.2, 0.5);
    const lowerArm = new THREE.Mesh(lowerArmGeo, accentMat);
    lowerArm.position.set(dir * 0.35, -2.1, 0.1);
    armGroup.add(lowerArm);

    // Wrist
    const wristGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 8);
    const wrist = new THREE.Mesh(wristGeo, darkMat);
    wrist.position.set(dir * 0.35, -2.75, 0.1);
    wrist.rotation.x = Math.PI / 2;
    armGroup.add(wrist);

    // Claw/Hand assembly
    const clawGroup = new THREE.Group();
    
    // Claw base
    const clawBaseGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
    const clawBase = new THREE.Mesh(clawBaseGeo, bodyMat);
    clawGroup.add(clawBase);

    // Upper claw prong
    const prong1Geo = new THREE.BoxGeometry(0.15, 0.8, 0.2);
    const prong1 = new THREE.Mesh(prong1Geo, darkMat);
    prong1.position.set(-0.15, 0.5, 0.1);
    prong1.rotation.z = 0.3;
    clawGroup.add(prong1);

    // Lower claw prong
    const prong2 = new THREE.Mesh(prong1Geo, darkMat);
    prong2.position.set(-0.15, -0.5, 0.1);
    prong2.rotation.z = -0.3;
    clawGroup.add(prong2);

    // Center spike
    const spikeGeo = new THREE.ConeGeometry(0.1, 0.6, 6);
    const spike = new THREE.Mesh(spikeGeo, accentMat);
    spike.position.set(-0.4, 0, 0.1);
    spike.rotation.z = -Math.PI / 2;
    clawGroup.add(spike);

    clawGroup.position.set(dir * 0.35, -3.1, 0.2);
    clawGroup.rotation.z = isLeft ? 0.3 : -0.3;
    armGroup.add(clawGroup);

    return armGroup;
}

const leftArm = createArm(true);
leftArm.position.set(-1.4, 4.4, 0);
leftArm.rotation.z = 0.4; // Arm raised slightly
robot.add(leftArm);

const rightArm = createArm(false);
rightArm.position.set(1.4, 4.2, 0);
rightArm.rotation.z = -0.6; // Arm forward
robot.add(rightArm);

// ==================== LEGS ====================
function createLeg(isLeft) {
    const legGroup = new THREE.Group();
    const dir = isLeft ? -1 : 1;

    // Hip joint
    const hipGeo = new THREE.SphereGeometry(0.4, 12, 12);
    const hip = new THREE.Mesh(hipGeo, darkMat);
    hip.position.set(dir * 0.5, 0, 0);
    legGroup.add(hip);

    // Upper leg (thigh)
    const thighGeo = new THREE.BoxGeometry(0.7, 1.6, 0.7);
    const thigh = new THREE.Mesh(thighGeo, bodyMat);
    thigh.position.set(dir * 0.5, -0.9, 0);
    legGroup.add(thigh);

    // Knee armor
    const kneeGeo = new THREE.BoxGeometry(0.6, 0.5, 0.8);
    const knee = new THREE.Mesh(kneeGeo, accentMat);
    knee.position.set(dir * 0.5, -1.75, 0.15);
    legGroup.add(knee);

    // Lower leg (shin) - angled forward like digitigrade
    const shinGroup = new THREE.Group();
    
    const shinGeo = new THREE.BoxGeometry(0.6, 1.4, 0.6);
    const shin = new THREE.Mesh(shinGeo, bodyMat);
    shin.position.set(0, -0.7, 0);
    shinGroup.add(shin);

    // Shin armor detail
    const shinArmorGeo = new THREE.BoxGeometry(0.65, 0.8, 0.3);
    const shinArmor = new THREE.Mesh(shinArmorGeo, darkMat);
    shinArmor.position.set(0, -0.5, 0.35);
    shinGroup.add(shinArmor);

    shinGroup.position.set(dir * 0.5, -1.95, 0.2);
    shinGroup.rotation.x = 0.4; // Bent knee
    legGroup.add(shinGroup);

    // Foot assembly
    const footGroup = new THREE.Group();
    
    // Main foot
    const footGeo = new THREE.BoxGeometry(0.8, 0.4, 1.4);
    const foot = new THREE.Mesh(footGeo, darkMat);
    foot.position.set(0, 0, 0.2);
    footGroup.add(foot);

    // Toe/foot extension
    const toeGeo = new THREE.BoxGeometry(0.7, 0.3, 0.6);
    const toe = new THREE.Mesh(toeGeo, accentMat);
    toe.position.set(0, -0.1, 0.9);
    toe.rotation.x = -0.3;
    footGroup.add(toe);

    // Heel spur
    const heelGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const heel = new THREE.Mesh(heelGeo, bodyMat);
    heel.position.set(0, -0.2, -0.4);
    footGroup.add(heel);

    footGroup.position.set(dir * 0.5, -3.2, 0.6);
    legGroup.add(footGroup);

    return legGroup;
}

const leftLeg = createLeg(true);
leftLeg.position.set(-0.7, 2.3, 0);
leftLeg.rotation.z = 0.05; // Slight outward angle
robot.add(leftLeg);

const rightLeg = createLeg(false);
rightLeg.position.set(0.7, 2.3, 0.3); // Slightly forward for walking pose
rightLeg.rotation.z = -0.05;
robot.add(rightLeg);

// Add robot to scene
scene.add(robot);

// Adjust camera to view the robot
camera.position.set(8, 6, 10);
camera.lookAt(0, 3.5, 0);

// Optional: Add subtle ambient details (gear decorations on torso)
for(let i = 0; i < 3; i++) {
    const gearGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    const gear = new THREE.Mesh(gearGeo, darkMat);
    gear.position.set(0.6, 0.3 + i * 0.5, 0.65);
    torsoGroup.add(gear);
}