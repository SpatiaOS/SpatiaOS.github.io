// Parameters
const colorMain = 0xaaaaaa; // Light grey metal
const colorDark = 0x555555; // Dark grey mechanical parts
const colorDetail = 0x222222; // Black/Dark details

const matMain = new THREE.MeshStandardMaterial({ color: colorMain, roughness: 0.5, metalness: 0.4 });
const matDark = new THREE.MeshStandardMaterial({ color: colorDark, roughness: 0.4, metalness: 0.6 });
const matDetail = new THREE.MeshStandardMaterial({ color: colorDetail, roughness: 0.2, metalness: 0.8 });

const robot = new THREE.Group();

// --- TORSO ---
const torsoGroup = new THREE.Group();

// Main Body (Cylindrical core)
const torsoGeo = new THREE.CylinderGeometry(2.2, 1.8, 4.5, 16);
const torso = new THREE.Mesh(torsoGeo, matMain);
torso.position.y = 7;
torsoGroup.add(torso);

// Back Shell (Large curved piece resembling a backpack/shield)
// Using a cylinder segment to create the curved back
const backShellGeo = new THREE.CylinderGeometry(3.2, 3.2, 4.2, 16, 1, false, Math.PI * 0.6, Math.PI * 1.4);
const backShell = new THREE.Mesh(backShellGeo, matDark);
backShell.rotation.y = Math.PI; // Face backward
backShell.position.set(0, 7.5, -0.5);
torsoGroup.add(backShell);

// Top details on back (Antennae/Vents sticking up)
const ventGeo = new THREE.BoxGeometry(0.4, 1.5, 0.4);
const vent1 = new THREE.Mesh(ventGeo, matDetail);
vent1.position.set(-1.2, 9.5, -2.8);
vent1.rotation.x = -0.3;
torsoGroup.add(vent1);

const vent2 = new THREE.Mesh(ventGeo, matDetail);
vent2.position.set(1.2, 9.5, -2.8);
vent2.rotation.x = -0.3;
torsoGroup.add(vent2);

// Chest Plate
const chestGeo = new THREE.BoxGeometry(2.5, 2, 0.8);
const chest = new THREE.Mesh(chestGeo, matDark);
chest.position.set(0, 8, 2);
torsoGroup.add(chest);

robot.add(torsoGroup);

// --- HEAD ---
const headGroup = new THREE.Group();
const neckGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 8);
const neck = new THREE.Mesh(neckGeo, matDark);
neck.position.y = 9.5;
headGroup.add(neck);

const headGeo = new THREE.SphereGeometry(1.1, 16, 16);
const head = new THREE.Mesh(headGeo, matMain);
head.position.y = 10.5;
head.scale.set(1, 0.9, 1); // Slightly flattened
headGroup.add(head);

// Eye/Visor strip
const visorGeo = new THREE.BoxGeometry(1.4, 0.25, 0.6);
const visor = new THREE.Mesh(visorGeo, matDetail);
visor.position.set(0, 10.6, 0.9);
headGroup.add(visor);

robot.add(headGroup);

// --- LEFT ARM (CLAW) - Viewer's Left ---
const leftArmGroup = new THREE.Group();

// Shoulder Joint
const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), matDark);
leftArmGroup.add(lShoulder);

// Upper Arm
const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3.5, 8), matMain);
lUpperArm.rotation.z = Math.PI / 3;
lUpperArm.position.set(-1.8, -1.2, 0);
leftArmGroup.add(lUpperArm);

// Elbow Joint
const lElbow = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), matDark);
lElbow.position.set(-3, -2.8, 0);
leftArmGroup.add(lElbow);

// Forearm
const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.5, 8), matMain);
lForearm.rotation.z = -Math.PI / 6;
lForearm.position.set(-4.5, -4, 0);
leftArmGroup.add(lForearm);

// Wrist Joint
const lWrist = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), matDark);
lWrist.position.set(-5.5, -5.2, 0);
leftArmGroup.add(lWrist);

// Claw Assembly
const clawGroup = new THREE.Group();
clawGroup.position.set(-6, -5.5, 0);

// Claw Base
const clawBase = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), matDark);
clawGroup.add(clawBase);

// Claw Finger Top
const fingerTopGeo = new THREE.BoxGeometry(3, 0.25, 0.25);
const fingerTop = new THREE.Mesh(fingerTopGeo, matMain);
fingerTop.position.set(1.5, 0.5, 0);
fingerTop.rotation.z = -0.15;
clawGroup.add(fingerTop);

// Claw Finger Bottom
const fingerBotGeo = new THREE.BoxGeometry(3, 0.25, 0.25);
const fingerBot = new THREE.Mesh(fingerBotGeo, matMain);
fingerBot.position.set(1.5, -0.5, 0);
fingerBot.rotation.z = 0.15;
clawGroup.add(fingerBot);

// Claw "Teeth" details (ridges inside the claw)
const toothGeo = new THREE.BoxGeometry(0.15, 0.35, 0.15);
for(let i=0; i<4; i++) {
    const t1 = new THREE.Mesh(toothGeo, matDetail);
    t1.position.set(0.5 + i*0.6, 0.35, 0);
    clawGroup.add(t1);
    
    const t2 = new THREE.Mesh(toothGeo, matDetail);
    t2.position.set(0.5 + i*0.6, -0.35, 0);
    clawGroup.add(t2);
}

leftArmGroup.add(clawGroup);

// Position Left Arm in scene (Extended forward-left)
leftArmGroup.position.set(1.5, 8.5, 1.5);
leftArmGroup.rotation.y = Math.PI / 3;
leftArmGroup.rotation.z = Math.PI / 6;
leftArmGroup.rotation.x = -Math.PI / 6; 
robot.add(leftArmGroup);


// --- RIGHT ARM (WEAPON) - Viewer's Right ---
const rightArmGroup = new THREE.Group();

// Shoulder Joint
const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), matDark);
rightArmGroup.add(rShoulder);

// Upper Arm
const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3, 8), matMain);
rUpperArm.rotation.z = -Math.PI / 4;
rUpperArm.position.set(1.8, -1.2, 0);
rightArmGroup.add(rUpperArm);

// Elbow Joint
const rElbow = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), matDark);
rElbow.position.set(3, -2.8, 0);
rightArmGroup.add(rElbow);

// Forearm
const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 8), matMain);
rForearm.rotation.z = Math.PI / 4;
rForearm.position.set(4.5, -4, 0);
rightArmGroup.add(rForearm);

// Weapon (Blaster/Tool)
const weaponGroup = new THREE.Group();
weaponGroup.position.set(5.5, -5.2, 0);

const weaponBase = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1.5), matDark);
weaponGroup.add(weaponBase);

const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.5, 8), matDetail);
barrel.rotation.z = Math.PI / 2;
barrel.position.set(0, 0, 1.5);
weaponGroup.add(barrel);

// Weapon tip
const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.5, 8), matMain);
tip.rotation.z = Math.PI / 2;
tip.position.set(0, 0, 3);
weaponGroup.add(tip);

rightArmGroup.add(weaponGroup);

// Position Right Arm (Held closer to body)
rightArmGroup.position.set(-1.5, 8.5, 1);
rightArmGroup.rotation.y = -Math.PI / 4;
rightArmGroup.rotation.z = -Math.PI / 6;
robot.add(rightArmGroup);


// --- LEGS (Digitigrade Structure) ---

function buildLeg(side) {
    const leg = new THREE.Group();
    const x = side === 'left' ? -1.2 : 1.2;
    
    // Hip Joint
    const hip = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 16), matDark);
    hip.position.set(x, 5, 0);
    leg.add(hip);
    
    // Thigh (Upper Leg) - Angled back
    const thigh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4, 1.4), matMain);
    thigh.position.set(x, 3, -0.8);
    thigh.rotation.x = -0.5; // Angle backwards
    leg.add(thigh);
    
    // Knee Joint
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), matDark);
    knee.position.set(x, 1, -2.2);
    leg.add(knee);
    
    // Shin (Lower Leg) - Angled forward/down
    const shin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.5, 1.2), matMain);
    shin.position.set(x, -0.8, -1.2);
    shin.rotation.x = 0.6; // Angle forwards
    leg.add(shin);
    
    // Ankle Joint
    const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), matDark);
    ankle.position.set(x, -2.5, 0);
    leg.add(ankle);
    
    // Foot Base
    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 3), matMain);
    foot.position.set(x, -3.2, 1.2);
    leg.add(foot);
    
    // Toes/Claws
    const toeGeo = new THREE.BoxGeometry(0.5, 0.5, 1);
    const toe1 = new THREE.Mesh(toeGeo, matDark);
    toe1.position.set(x + 0.5, -3.2, 2.5);
    leg.add(toe1);
    
    const toe2 = new THREE.Mesh(toeGeo, matDark);
    toe2.position.set(x - 0.5, -3.2, 2.5);
    leg.add(toe2);

    return leg;
}

// Left Leg (Viewer's Left - Forward Stance)
const leftLeg = buildLeg('left');
leftLeg.position.z = 1.5;
leftLeg.rotation.x = -0.2; // Slight forward lean
robot.add(leftLeg);

// Right Leg (Viewer's Right - Back Stance)
const rightLeg = buildLeg('right');
rightLeg.position.z = -1;
rightLeg.rotation.x = 0.3; // Leaning back
robot.add(rightLeg);

// Add robot to scene
scene.add(robot);

// Adjust camera to match the isometric-like view
camera.position.set(15, 12, 15);
camera.lookAt(0, 5, 0);