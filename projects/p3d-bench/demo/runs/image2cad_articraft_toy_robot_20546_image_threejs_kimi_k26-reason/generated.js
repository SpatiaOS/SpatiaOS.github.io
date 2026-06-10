// ==========================================
// LEGO Bionicle-style Mech Robot
// ==========================================

// Parameters
const scale = 1.0;

// Materials
const matLight = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.6, roughness: 0.3 });
const matDark  = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
const matBlack = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.5 });

// Main robot group
const robot = new THREE.Group();
scene.add(robot);

// Helper: create box and add to parent
function addBox(parent, w, h, d, x, y, z, mat, rx=0, ry=0, rz=0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
}

// Helper: create cylinder and add to parent
function addCyl(parent, rt, rb, h, seg, x, y, z, mat, rx=0, ry=0, rz=0) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
}

// ==========================================
// TORSO & HEAD
// ==========================================

// Pelvis
addBox(robot, 2.0, 1.2, 2.2, 0, 4.6, 0, matDark);

// Lower torso
addBox(robot, 2.0, 2.0, 2.3, 0.2, 6.2, 0, matLight);

// Upper torso / chest
addBox(robot, 2.2, 2.2, 2.4, 0.6, 8.2, 0, matLight);

// Back canopy (curved shell approximated with angled box)
addBox(robot, 3.0, 3.2, 3.0, -0.3, 9.2, 0, matLight, 0, 0, -0.35);

// Canopy rim
addBox(robot, 0.3, 2.8, 2.8, 1.4, 9.0, 0, matDark, 0, 0, -0.2);

// Head (tucked under canopy front)
addBox(robot, 1.0, 0.9, 1.1, 1.8, 9.4, 0, matDark);

// Head dome / helmet top
addBox(robot, 0.8, 0.4, 1.0, 1.8, 9.9, 0, matLight);

// Visor
addBox(robot, 0.6, 0.3, 0.9, 2.3, 9.6, 0, matBlack, 0, 0, 0.15);

// Helmet crest (angled back)
addBox(robot, 0.4, 0.6, 0.2, 1.5, 10.2, 0, matDark, 0, 0, 0.3);

// ==========================================
// RIGHT ARM (extends forward, robot's right side)
// ==========================================

const rArm = new THREE.Group();
rArm.position.set(0.3, 8.2, -1.6);
robot.add(rArm);

// Shoulder block
addBox(rArm, 1.0, 1.0, 0.9, 0, 0, 0, matDark);
// Shoulder joint
addCyl(rArm, 0.5, 0.5, 0.8, 8, 0, 0, 0, matBlack, Math.PI/2, 0, 0);
// Upper arm (angled forward-down)
addBox(rArm, 0.6, 2.0, 0.6, 0.8, -0.8, 0, matLight, 0, 0, 0.5);
// Elbow
addCyl(rArm, 0.4, 0.4, 0.8, 8, 1.6, -1.6, 0, matDark, Math.PI/2, 0, 0);
// Forearm
addBox(rArm, 0.5, 1.8, 0.5, 2.2, -1.5, 0, matLight, 0, 0, 0.3);
// Wrist
addBox(rArm, 0.7, 0.7, 0.7, 3.1, -1.8, 0, matDark);
// Claw base
addBox(rArm, 0.8, 0.5, 0.6, 3.7, -1.8, 0, matBlack);
// Top pincers
addBox(rArm, 1.2, 0.15, 0.15, 4.5, -1.6, 0.2, matLight, 0, 0, 0.15);
addBox(rArm, 1.2, 0.15, 0.15, 4.5, -1.6, -0.2, matLight, 0, 0, -0.15);
// Bottom pincers
addBox(rArm, 1.2, 0.15, 0.15, 4.5, -2.0, 0.2, matLight, 0, 0, -0.15);
addBox(rArm, 1.2, 0.15, 0.15, 4.5, -2.0, -0.2, matLight, 0, 0, 0.15);
// Arm piston / spring detail
addCyl(rArm, 0.08, 0.08, 1.5, 6, 0.8, 0.3, 0.2, matDark, 0.5, 0, 0);

// ==========================================
// LEFT ARM (bent back, robot's left side)
// ==========================================

const lArm = new THREE.Group();
lArm.position.set(0.0, 8.0, 1.6);
robot.add(lArm);

// Shoulder block
addBox(lArm, 1.0, 1.0, 0.9, 0, 0, 0, matDark);
// Shoulder joint
addCyl(lArm, 0.5, 0.5, 0.8, 8, 0, 0, 0, matBlack, Math.PI/2, 0, 0);
// Upper arm (angled back)
addBox(lArm, 0.6, 1.8, 0.6, -0.5, -0.5, 0, matLight, 0, 0, -0.4);
// Elbow
addCyl(lArm, 0.4, 0.4, 0.8, 8, -1.0, -1.2, 0, matDark, Math.PI/2, 0, 0);
// Forearm (angled down)
addBox(lArm, 0.5, 1.6, 0.5, -1.2, -2.0, 0, matLight, 0, 0, 0.1);
// Hand
addBox(lArm, 0.6, 0.6, 0.6, -1.2, -3.2, 0, matDark);

// ==========================================
// RIGHT LEG (forward, robot's right side)
// ==========================================

const rLeg = new THREE.Group();
rLeg.position.set(0, 4.0, -1.1);
robot.add(rLeg);

// Hip joint
addCyl(rLeg, 0.5, 0.5, 1.0, 8, 0, 0, 0, matDark, Math.PI/2, 0, 0);
// Thigh (angled forward)
addBox(rLeg, 0.7, 2.4, 0.7, 0.6, -1.5, 0, matLight, 0, 0, 0.35);
// Knee
addCyl(rLeg, 0.4, 0.4, 0.8, 8, 1.2, -2.8, 0, matDark, Math.PI/2, 0, 0);
// Shin outer strut
addBox(rLeg, 0.5, 2.8, 0.15, 0.8, -4.5, 0.3, matLight, 0, 0, -0.25);
// Shin inner strut
addBox(rLeg, 0.5, 2.8, 0.15, 0.8, -4.5, -0.3, matLight, 0, 0, -0.25);
// Shin cross-brace
addBox(rLeg, 0.1, 2.2, 0.6, 0.8, -4.5, 0, matDark, 0, 0, -0.25);
// Ankle
addBox(rLeg, 0.7, 0.7, 0.7, 1.0, -6.0, 0, matDark);
// Foot main
addBox(rLeg, 1.8, 0.7, 1.3, 1.5, -6.6, 0, matLight);
// Foot toe
addBox(rLeg, 0.5, 0.4, 1.1, 2.5, -6.4, 0, matDark);

// ==========================================
// LEFT LEG (back, robot's left side)
// ==========================================

const lLeg = new THREE.Group();
lLeg.position.set(-0.3, 4.0, 1.1);
robot.add(lLeg);

// Hip joint
addCyl(lLeg, 0.5, 0.5, 1.0, 8, 0, 0, 0, matDark, Math.PI/2, 0, 0);
// Thigh (angled back)
addBox(lLeg, 0.7, 2.4, 0.7, -0.6, -1.5, 0, matLight, 0, 0, -0.25);
// Knee
addCyl(lLeg, 0.4, 0.4, 0.8, 8, -1.0, -2.8, 0, matDark, Math.PI/2, 0, 0);
// Shin outer strut
addBox(lLeg, 0.5, 2.8, 0.15, -0.8, -4.5, 0.3, matLight, 0, 0, 0.15);
// Shin inner strut
addBox(lLeg, 0.5, 2.8, 0.15, -0.8, -4.5, -0.3, matLight, 0, 0, 0.15);
// Shin cross-brace
addBox(lLeg, 0.1, 2.2, 0.6, -0.8, -4.5, 0, matDark, 0, 0, 0.15);
// Ankle
addBox(lLeg, 0.7, 0.7, 0.7, -1.0, -6.0, 0, matDark);
// Foot main
addBox(lLeg, 1.8, 0.7, 1.3, -1.5, -6.6, 0, matLight);
// Foot heel
addBox(lLeg, 0.5, 0.4, 1.1, -2.5, -6.4, 0, matDark);

// ==========================================
// BACK DETAILS
// ==========================================

// Antenna / sensor rods
addCyl(robot, 0.08, 0.08, 2.5, 6, -1.0, 10.0, 0.6, matDark, 0.6, 0, 0.4);
addCyl(robot, 0.08, 0.08, 2.0, 6, -1.2, 9.5, -0.6, matDark, 0.8, 0, -0.3);

// Back vents / exhaust
addBox(robot, 0.6, 0.6, 1.8, -1.0, 8.5, 0, matDark, 0, 0, 0);

// ==========================================
// CAMERA
// ==========================================
camera.position.set(18, 14, 18);
camera.lookAt(0, 5, 0);