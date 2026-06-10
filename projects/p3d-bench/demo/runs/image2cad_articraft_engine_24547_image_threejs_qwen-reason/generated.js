// Parameters
const baseWidth = 16;
const baseDepth = 8;
const baseHeight = 0.5;

const drumRadius = 1.2;
const drumFlangeRadius = 1.7;
const drumLength = 3.5;
const drumX = -4.5;

const wheelRadiusFront = 1.8;
const wheelRadiusBack = 2.0;
const wheelXFront = 0;
const wheelXBack = 4.5;

const supportHeight = 2.5;
const shaftHeight = 3.5; // Center of shafts

// Material
const metalMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xaaaaaa, 
    roughness: 0.4, 
    metalness: 0.6 
});

// --- Base ---
const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const base = new THREE.Mesh(baseGeo, metalMaterial);
base.position.y = baseHeight / 2;
scene.add(base);

// --- Drum Assembly (Left) ---
const drumGroup = new THREE.Group();
drumGroup.position.set(drumX, shaftHeight, 0);

// Drum Core
const drumCoreGeo = new THREE.CylinderGeometry(drumRadius, drumRadius, drumLength, 32);
drumCoreGeo.rotateZ(Math.PI / 2);
const drumCore = new THREE.Mesh(drumCoreGeo, metalMaterial);
drumGroup.add(drumCore);

// Drum Flanges
const flangeGeo = new THREE.CylinderGeometry(drumFlangeRadius, drumFlangeRadius, 0.2, 32);
flangeGeo.rotateZ(Math.PI / 2);

const flangeLeft = new THREE.Mesh(flangeGeo, metalMaterial);
flangeLeft.position.x = -drumLength / 2 - 0.1;
drumGroup.add(flangeLeft);

const flangeRight = new THREE.Mesh(flangeGeo, metalMaterial);
flangeRight.position.x = drumLength / 2 + 0.1;
drumGroup.add(flangeRight);

// Rope/Grooves simulation
const ropeGeo = new THREE.TorusGeometry(drumRadius + 0.05, 0.06, 8, 32);
ropeGeo.rotateY(Math.PI / 2); // Orient perpendicular to X axis

for (let i = -1.5; i <= 1.5; i += 0.13) {
    const ropeRing = new THREE.Mesh(ropeGeo, metalMaterial);
    ropeRing.position.x = i;
    drumGroup.add(ropeRing);
}

scene.add(drumGroup);

// --- Front Wheel Assembly (Center) ---
const frontWheelGroup = new THREE.Group();
frontWheelGroup.position.set(wheelXFront, shaftHeight, 1.5); // Offset Z towards camera

// Rim
const frontRimGeo = new THREE.TorusGeometry(wheelRadiusFront, 0.2, 16, 32);
const frontRim = new THREE.Mesh(frontRimGeo, metalMaterial);
frontWheelGroup.add(frontRim);

// Hub
const frontHubGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
frontHubGeo.rotateZ(Math.PI / 2);
const frontHub = new THREE.Mesh(frontHubGeo, metalMaterial);
frontWheelGroup.add(frontHub);

// Spokes (4 spokes)
const spokeGeo = new THREE.BoxGeometry(0.2, 0.2, wheelRadiusFront - 0.4);
for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(spokeGeo, metalMaterial);
    spoke.position.y = (wheelRadiusFront + 0.4) / 2;
    const spokePivot = new THREE.Group();
    spokePivot.add(spoke);
    spokePivot.rotation.z = (Math.PI / 2) * i;
    frontWheelGroup.add(spokePivot);
}

// Shaft sticking out (Handle shaft)
const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
shaftGeo.rotateZ(Math.PI / 2);
const shaft = new THREE.Mesh(shaftGeo, metalMaterial);
shaft.position.x = -1.0; // Stick out to the left
frontWheelGroup.add(shaft);

scene.add(frontWheelGroup);

// --- Back Wheel Assembly (Right) ---
const backWheelGroup = new THREE.Group();
backWheelGroup.position.set(wheelXBack, shaftHeight, -0.5); // Offset Z away

// Rim
const backRimGeo = new THREE.TorusGeometry(wheelRadiusBack, 0.2, 16, 32);
const backRim = new THREE.Mesh(backRimGeo, metalMaterial);
backWheelGroup.add(backRim);

// Hub
const backHubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32);
backHubGeo.rotateZ(Math.PI / 2);
const backHub = new THREE.Mesh(backHubGeo, metalMaterial);
backWheelGroup.add(backHub);

// Spokes
const backSpokeGeo = new THREE.BoxGeometry(0.2, 0.2, wheelRadiusBack - 0.5);
for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(backSpokeGeo, metalMaterial);
    spoke.position.y = (wheelRadiusBack + 0.5) / 2;
    const spokePivot = new THREE.Group();
    spokePivot.add(spoke);
    spokePivot.rotation.z = (Math.PI / 2) * i;
    backWheelGroup.add(spokePivot);
}

scene.add(backWheelGroup);

// --- Supports ---
// Support under Drum
const supportGeo = new THREE.BoxGeometry(1.5, supportHeight, 1.5);
const supportDrum = new THREE.Mesh(supportGeo, metalMaterial);
supportDrum.position.set(drumX, supportHeight / 2 + baseHeight, 0);
scene.add(supportDrum);

// Support under Front Wheel
const supportFront = new THREE.Mesh(supportGeo, metalMaterial);
supportFront.position.set(wheelXFront, supportHeight / 2 + baseHeight, 1.5);
scene.add(supportFront);

// Support under Back Wheel
const supportBack = new THREE.Mesh(supportGeo, metalMaterial);
supportBack.position.set(wheelXBack, supportHeight / 2 + baseHeight, -0.5);
scene.add(supportBack);

// --- Central Gearbox/Linkage Block ---
const gearboxGeo = new THREE.BoxGeometry(2.5, 1.5, 1.5);
const gearbox = new THREE.Mesh(gearboxGeo, metalMaterial);
gearbox.position.set(2.25, shaftHeight - 0.5, 0.5);
scene.add(gearbox);

// --- Small details: Bolts/Nuts on flanges ---
const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
boltGeo.rotateZ(Math.PI / 2);
// Add a few bolts to the drum flange
for(let i=0; i<6; i++) {
    const bolt = new THREE.Mesh(boltGeo, metalMaterial);
    const angle = (Math.PI * 2 / 6) * i;
    bolt.position.set(drumX + drumLength/2 + 0.2, shaftHeight + Math.cos(angle)*1.2, Math.sin(angle)*1.2);
    scene.add(bolt);
}

// Adjust camera
camera.position.set(10, 8, 12);
camera.lookAt(0, 2, 0);