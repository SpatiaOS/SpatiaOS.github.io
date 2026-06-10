// Mech Robot - Bionicle-style action figure
// Parameters
const metalColor = 0x8a8a8a;
const darkMetalColor = 0x555555;
const lightMetalColor = 0xaaaaaa;
const jointColor = 0x666666;

// Materials
const mainMat = new THREE.MeshStandardMaterial({ color: metalColor, metalness: 0.6, roughness: 0.35 });
const darkMat = new THREE.MeshStandardMaterial({ color: darkMetalColor, metalness: 0.7, roughness: 0.3 });
const lightMat = new THREE.MeshStandardMaterial({ color: lightMetalColor, metalness: 0.5, roughness: 0.4 });
const jointMat = new THREE.MeshStandardMaterial({ color: jointColor, metalness: 0.8, roughness: 0.2 });

const robot = new THREE.Group();

// ============ FEET ============

// Helper: create a foot
function createFoot() {
    const foot = new THREE.Group();
    
    // Base plate - octagonal
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.6, 8), darkMat);
    foot.add(basePlate);
    
    // Mid section
    const midPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.5, 8), mainMat);
    midPlate.position.set(0, 0.45, 0);
    foot.add(midPlate);
    
    // Toe guard (front curved plate)
    const toeGuard = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 6, 0, Math.PI, 0, Math.PI / 2), mainMat);
    toeGuard.scale.set(1, 0.4, 1.2);
    toeGuard.position.set(0, 0.5, 0.8);
    foot.add(toeGuard);
    
    // Detail bumps on top
    for (let i = -1; i <= 1; i++) {
        const bump = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 6), jointMat);
        bump.position.set(i * 0.6, 0.8, -0.3);
        foot.add(bump);
    }
    
    // Ankle ball
    const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 10), jointMat);
    ankle.position.set(0, 1.5, -0.2);
    foot.add(ankle);
    
    return foot;
}

// Right foot
const rightFoot = createFoot();
rightFoot.position.set(2.5, 0, 0);
rightFoot.rotation.y = -0.2;
robot.add(rightFoot);

// Left foot
const leftFoot = createFoot();
leftFoot.position.set(-2.8, 0, 2);
leftFoot.rotation.y = 0.3;
robot.add(leftFoot);

// ============ LOWER LEGS ============

function createLowerLeg() {
    const leg = new THREE.Group();
    
    // Main shin cylinder
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 4.5, 8), mainMat);
    leg.add(shin);
    
    // Front armor plate
    const armorShape = new THREE.Shape();
    armorShape.moveTo(-0.9, -2);
    armorShape.lineTo(0.9, -2);
    armorShape.lineTo(0.7, 2.2);
    armorShape.lineTo(-0.7, 2.2);
    armorShape.closePath();
    const armorGeo = new THREE.ExtrudeGeometry(armorShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05 });
    const armor = new THREE.Mesh(armorGeo, lightMat);
    armor.rotation.x = 0;
    armor.position.set(0, 0, 0.5);
    leg.add(armor);
    
    // Decorative triangles on armor
    const triShape = new THREE.Shape();
    triShape.moveTo(0, 0.6);
    triShape.lineTo(-0.4, -0.3);
    triShape.lineTo(0.4, -0.3);
    triShape.closePath();
    const triGeo = new THREE.ExtrudeGeometry(triShape, { depth: 0.15, bevelEnabled: false });
    
    for (let i = 0; i < 3; i++) {
        const tri = new THREE.Mesh(triGeo, darkMat);
        tri.position.set(0, -0.5 + i * 1.0, 0.95);
        tri.rotation.z = (i % 2 === 0) ? 0 : Math.PI;
        leg.add(tri);
    }
    
    // Side pistons
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.5, 6), jointMat);
    piston.position.set(0.6, 0.2, -0.3);
    leg.add(piston);
    
    // Circular details on side
    for (let i = 0; i < 3; i++) {
        const circle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 8), jointMat);
        circle.rotation.z = Math.PI / 2;
        circle.position.set(0.8, -0.8 + i * 0.8, 0);
        leg.add(circle);
    }
    
    // Knee joint at top
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), jointMat);
    knee.position.set(0, 2.5, 0);
    leg.add(knee);
    
    return leg;
}

const rightLowerLeg = createLowerLeg();
rightLowerLeg.position.set(2.5, 4.5, 0);
rightLowerLeg.rotation.z = -0.05;
robot.add(rightLowerLeg);

const leftLowerLeg = createLowerLeg();
leftLowerLeg.position.set(-2.8, 4.2, 2);
leftLowerLeg.rotation.z = 0.08;
leftLowerLeg.rotation.x = -0.1;
robot.add(leftLowerLeg);

// ============ UPPER LEGS ============

function createUpperLeg() {
    const uleg = new THREE.Group();
    
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 3, 8), mainMat);
    uleg.add(thigh);
    
    // Thigh armor
    const thighArmor = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.5, 0.5), lightMat);
    thighArmor.position.set(0, 0, 0.5);
    uleg.add(thighArmor);
    
    // Hip joint
    const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), jointMat);
    hipJoint.position.set(0, 1.8, 0);
    uleg.add(hipJoint);
    
    return uleg;
}

const rightUpperLeg = createUpperLeg();
rightUpperLeg.position.set(2.3, 8.5, 0);
rightUpperLeg.rotation.z = 0.05;
robot.add(rightUpperLeg);

const leftUpperLeg = createUpperLeg();
leftUpperLeg.position.set(-2.5, 8, 2);
leftUpperLeg.rotation.z = -0.08;
leftUpperLeg.rotation.x = -0.05;
robot.add(leftUpperLeg);

// ============ PELVIS / HIPS ============

const pelvis = new THREE.Group();
const pelvisCore = new THREE.Mesh(new THREE.BoxGeometry(4, 1.8, 2.5), darkMat);
pelvis.add(pelvisCore);

// Hip side guards
const hipGuardL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 1.8), mainMat);
hipGuardL.position.set(-2.3, -0.2, 0);
pelvis.add(hipGuardL);

const hipGuardR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 1.8), mainMat);
hipGuardR.position.set(2.3, -0.2, 0);
pelvis.add(hipGuardR);

// Waist detail
const waistRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.2, 6, 12), jointMat);
waistRing.rotation.x = Math.PI / 2;
waistRing.position.set(0, 0.5, 0);
pelvis.add(waistRing);

pelvis.position.set(-0.1, 10.8, 1);
robot.add(pelvis);

// ============ TORSO ============

const torso = new THREE.Group();

// Main chest block
const chest = new THREE.Mesh(new THREE.BoxGeometry(5.5, 4.5, 3.2), mainMat);
torso.add(chest);

// Upper chest curve
const chestTop = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.8, 1.5, 8), mainMat);
chestTop.position.set(0, 2.5, 0);
torso.add(chestTop);

// Front armor plates
const frontPlateL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.5, 0.5), lightMat);
frontPlateL.position.set(-0.8, 0.5, 1.7);
frontPlateL.rotation.y = 0.1;
torso.add(frontPlateL);

const frontPlateR = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.5, 0.5), lightMat);
frontPlateR.position.set(0.8, 0.5, 1.7);
frontPlateR.rotation.y = -0.1;
torso.add(frontPlateR);

// Chest center detail
const chestGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), darkMat);
chestGem.position.set(0, 1.2, 2);
torso.add(chestGem);

// Back pack
const backpack = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 2), darkMat);
backpack.position.set(0, 0.5, -2.2);
torso.add(backpack);

// Side vents
for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 3; i++) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 1.5), jointMat);
        vent.position.set(side * 2.85, -0.5 + i * 0.7, 0);
        torso.add(vent);
    }
}

// Shoulder mounts
const shoulderMountL = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2, 8), jointMat);
shoulderMountL.rotation.z = Math.PI / 2;
shoulderMountL.position.set(-3.5, 1.8, 0);
torso.add(shoulderMountL);

const shoulderMountR = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2, 8), jointMat);
shoulderMountR.rotation.z = Math.PI / 2;
shoulderMountR.position.set(3.5, 1.8, 0);
torso.add(shoulderMountR);

torso.position.set(-0.1, 14.5, 1);
torso.rotation.y = -0.15;
torso.rotation.x = 0.05;
robot.add(torso);

// ============ HEAD ============

const head = new THREE.Group();

// Helmet main shape
const helmet = new THREE.Mesh(new THREE.SphereGeometry(1.3, 10, 10), mainMat);
helmet.scale.set(1, 0.85, 1.15);
head.add(helmet);

// Visor
const visorMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
const visor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.8), visorMat);
visor.position.set(0, -0.15, 0.7);
head.add(visor);

// Helmet crest/fin
const crestShape = new THREE.Shape();
crestShape.moveTo(0, 0);
crestShape.lineTo(0, 1.2);
crestShape.lineTo(-1.2, 0.3);
crestShape.closePath();
const crestGeo = new THREE.ExtrudeGeometry(crestShape, { depth: 0.15, bevelEnabled: false });
const crest = new THREE.Mesh(crestGeo, darkMat);
crest.position.set(-0.075, 0.2, -0.5);
head.add(crest);

// Cheek guards
const cheekL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 1), mainMat);
cheekL.position.set(-0.9, -0.3, 0.3);
head.add(cheekL);

const cheekR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 1), mainMat);
cheekR.position.set(0.9, -0.3, 0.3);
head.add(cheekR);

// Neck
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.2, 8), jointMat);
neck.position.set(0, -1.3, 0);
head.add(neck);

// Eye glow details
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), 
    new THREE.MeshStandardMaterial({ color: 0xccddff, emissive: 0x4466aa, emissiveIntensity: 0.5 }));
eyeL.position.set(-0.35, -0.1, 1.15);
head.add(eyeL);

const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xccddff, emissive: 0x4466aa, emissiveIntensity: 0.5 }));
eyeR.position.set(0.35, -0.1, 1.15);
head.add(eyeR);

head.position.set(0.2, 19.2, 1.5);
head.rotation.y = -0.2;
robot.add(head);

// ============ RIGHT ARM (Claw arm - extended forward) ============

const rightArm = new THREE.Group();

// Shoulder pad
const shoulderPadR = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 10), mainMat);
shoulderPadR.scale.set(1, 0.8, 0.9);
rightArm.add(shoulderPadR);

// Upper arm
const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 3, 8), mainMat);
upperArmR.position.set(0, -2, 0);
rightArm.add(upperArmR);

// Elbow joint
const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), jointMat);
elbowR.position.set(0, -3.5, 0);
rightArm.add(elbowR);

// Forearm
const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 3.5, 8), mainMat);
forearmR.position.set(1.5, -4.5, 1.5);
forearmR.rotation.z = -0.7;
forearmR.rotation.x = -0.4;
rightArm.add(forearmR);

// Wrist joint
const wristR = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), jointMat);
wristR.position.set(2.8, -5.3, 2.8);
rightArm.add(wristR);

// Claw mechanism housing
const clawHousing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.2), darkMat);
clawHousing.position.set(3.2, -5.5, 3.5);
rightArm.add(clawHousing);

// Claw fingers - upper
const clawFingerU = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 2.5), lightMat);
clawFingerU.position.set(3.1, -5.2, 4.8);
clawFingerU.rotation.y = 0.15;
rightArm.add(clawFingerU);

const clawFingerU2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 2.5), lightMat);
clawFingerU2.position.set(3.4, -5.2, 4.8);
clawFingerU2.rotation.y = -0.15;
rightArm.add(clawFingerU2);

// Claw fingers - lower
const clawFingerL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 2.5), lightMat);
clawFingerL.position.set(3.1, -5.8, 4.8);
clawFingerL.rotation.y = 0.15;
rightArm.add(clawFingerL);

const clawFingerL2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 2.5), lightMat);
clawFingerL2.position.set(3.4, -5.8, 4.8);
clawFingerL2.rotation.y = -0.15;
rightArm.add(clawFingerL2);

// Claw ribbed section
for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 4, 8), jointMat);
    rib.rotation.y = Math.PI / 2;
    rib.position.set(3.25, -5.5, 3.0 + i * 0.25);
    rightArm.add(rib);
}

rightArm.position.set(4, 16.3, 1);
rightArm.rotation.z = 0.4;
rightArm.rotation.x = -0.3;
rightArm.rotation.y = -0.5;
robot.add(rightArm);

// ============ LEFT ARM (Weapon/cannon arm) ============

const leftArm = new THREE.Group();

// Shoulder pad
const shoulderPadL = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 10), mainMat);
shoulderPadL.scale.set(1, 0.8, 0.9);
leftArm.add(shoulderPadL);

// Upper arm
const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 2.5, 8), mainMat);
upperArmL.position.set(0, -1.8, 0);
leftArm.add(upperArmL);

// Elbow joint
const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), jointMat);
elbowL.position.set(0, -3.2, 0);
leftArm.add(elbowL);

// Forearm - weapon housing
const weaponHousing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 3), mainMat);
weaponHousing.position.set(-0.5, -4.5, 1);
leftArm.add(weaponHousing);

// Weapon front plate
const weaponFront = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.4), lightMat);
weaponFront.position.set(-0.5, -4.5, 2.6);
leftArm.add(weaponFront);

// Cannon barrels
const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3, 8), darkMat);
barrel1.rotation.x = Math.PI / 2;
barrel1.position.set(-0.2, -4.2, 3.5);
leftArm.add(barrel1);

const barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3, 8), darkMat);
barrel2.rotation.x = Math.PI / 2;
barrel2.position.set(-0.8, -4.2, 3.5);
leftArm.add(barrel2);

const barrel3 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.5, 8), darkMat);
barrel3.rotation.x = Math.PI / 2;
barrel3.position.set(-0.5, -4.8, 3.3);
leftArm.add(barrel3);

// Side details on weapon
const sideBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 1.8), jointMat);
sideBox.position.set(0.6, -4.5, 1);
leftArm.add(sideBox);

// Round detail
const roundDetail = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 8), jointMat);
roundDetail.rotation.z = Math.PI / 2;
roundDetail.position.set(0.85, -4.5, 1.5);
leftArm.add(roundDetail);

leftArm.position.set(-4.2, 16.3, 1);
leftArm.rotation.z = -0.3;
leftArm.rotation.x = -0.15;
leftArm.rotation.y = 0.3;
robot.add(leftArm);

// ============ BACK-MOUNTED WEAPONS ============

// Weapon 1 - right back shoulder gun
const backWeapon1 = new THREE.Group();
const gunBase1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 1.5), darkMat);
backWeapon1.add(gunBase1);
const gunBarrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.5, 6), jointMat);
gunBarrel1.rotation.x = Math.PI / 2;
gunBarrel1.position.set(0, 0.15, 2.8);
backWeapon1.add(gunBarrel1);
const gunBarrel1b = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4, 6), jointMat);
gunBarrel1b.rotation.x = Math.PI / 2;
gunBarrel1b.position.set(0, -0.15, 2.5);
backWeapon1.add(gunBarrel1b);
// Muzzle
const muzzle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.4, 8), darkMat);
muzzle1.rotation.x = Math.PI / 2;
muzzle1.position.set(0, 0.15, 5.1);
backWeapon1.add(muzzle1);

backWeapon1.position.set(1.5, 17.5, -1.5);
backWeapon1.rotation.x = -0.25;
backWeapon1.rotation.y = 0.3;
robot.add(backWeapon1);

// Weapon 2 - left back
const backWeapon2 = new THREE.Group();
const gunBase2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.2), darkMat);
backWeapon2.add(gunBase2);
const gunBarrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.5, 6), jointMat);
gunBarrel2.rotation.x = Math.PI / 2;
gunBarrel2.position.set(0, 0.1, 2.2);
backWeapon2.add(gunBarrel2);

backWeapon2.position.set(-0.8, 17, -2);
backWeapon2.rotation.x = -0.15;
backWeapon2.rotation.y = -0.2;
robot.add(backWeapon2);

// ============ ADDITIONAL DETAILS ============

// Chest vent/grill details
const grillGroup = new THREE.Group();
for (let i = 0; i < 4; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.3), jointMat);
    slat.position.set(0, i * 0.25, 0);
    grillGroup.add(slat);
}
grillGroup.position.set(-0.1, 13.2, 3);
robot.add(grillGroup);

// Final positioning and pose
robot.position.set(0, -10, 0);
robot.rotation.y = -0.4;

scene.add(robot);

// Camera setup
camera.position.set(18, 10, 22);
camera.lookAt(0, 3, 0);