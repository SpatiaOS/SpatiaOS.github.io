// Parameters for a standard 120mm computer fan
const fanSize = 120;
const fanThickness = 25;
const plateThickness = 2;
const hubRadius = 22;
const shroudInnerRadius = 58;
const shroudOuterRadius = 60;
const bladeCount = 7;
const cornerHoleOffset = 50;
const cornerHoleRadius = 2.5;

// Materials to give a molded plastic appearance
const frameMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7a7d80, 
    roughness: 0.6, 
    metalness: 0.1 
});

const impellerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8c9094, 
    roughness: 0.4, 
    metalness: 0.15 
});

// Main groups
const fanGroup = new THREE.Group();
const frameGroup = new THREE.Group();
const impellerGroup = new THREE.Group();

// --- 1. FRAME CONSTRUCTION ---

// 1a. Top and Bottom Plates (Square with rounded corners and holes)
const plateShape = new THREE.Shape();
const s = fanSize / 2;
const r_corner = 6;

// Outer rounded square profile
plateShape.moveTo(-s + r_corner, -s);
plateShape.lineTo(s - r_corner, -s);
plateShape.quadraticCurveTo(s, -s, s, -s + r_corner);
plateShape.lineTo(s, s - r_corner);
plateShape.quadraticCurveTo(s, s, s - r_corner, s);
plateShape.lineTo(-s + r_corner, s);
plateShape.quadraticCurveTo(-s, s, -s, s - r_corner);
plateShape.lineTo(-s, -s + r_corner);
plateShape.quadraticCurveTo(-s, -s, -s + r_corner, -s);

// Large center hole for the impeller
const centerHole = new THREE.Path();
centerHole.absarc(0, 0, shroudInnerRadius, 0, Math.PI * 2, false);
plateShape.holes.push(centerHole);

// Corner mounting holes
const holeOffsets = [
    [cornerHoleOffset, cornerHoleOffset],
    [cornerHoleOffset, -cornerHoleOffset],
    [-cornerHoleOffset, cornerHoleOffset],
    [-cornerHoleOffset, -cornerHoleOffset]
];
holeOffsets.forEach(pos => {
    const hole = new THREE.Path();
    hole.absarc(pos[0], pos[1], cornerHoleRadius, 0, Math.PI * 2, false);
    plateShape.holes.push(hole);
});

const plateExtrudeSettings = { depth: plateThickness, bevelEnabled: false, curveSegments: 32 };
const plateGeom = new THREE.ExtrudeGeometry(plateShape, plateExtrudeSettings);
plateGeom.center(); // Center geometry around local origin
plateGeom.rotateX(Math.PI / 2); // Lay flat on XZ plane

const topPlate = new THREE.Mesh(plateGeom, frameMaterial);
topPlate.position.y = fanThickness / 2 - plateThickness / 2;
frameGroup.add(topPlate);

const bottomPlate = new THREE.Mesh(plateGeom, frameMaterial);
bottomPlate.position.y = -fanThickness / 2 + plateThickness / 2;
frameGroup.add(bottomPlate);

// 1b. Main Cylindrical Shroud
const shroudShape = new THREE.Shape();
shroudShape.absarc(0, 0, shroudOuterRadius, 0, Math.PI * 2, false);
const shroudHole = new THREE.Path();
shroudHole.absarc(0, 0, shroudInnerRadius, 0, Math.PI * 2, true);
shroudShape.holes.push(shroudHole);

const shroudHeight = fanThickness - 2 * plateThickness;
const shroudGeom = new THREE.ExtrudeGeometry(shroudShape, { depth: shroudHeight, bevelEnabled: false, curveSegments: 64 });
shroudGeom.center();
shroudGeom.rotateX(Math.PI / 2);
const shroud = new THREE.Mesh(shroudGeom, frameMaterial);
frameGroup.add(shroud);

// 1c. Corner Pillar Tubes (housing the mounting holes between plates)
const tubeShape = new THREE.Shape();
tubeShape.absarc(0, 0, 5, 0, Math.PI * 2, false);
const tubeHole = new THREE.Path();
tubeHole.absarc(0, 0, cornerHoleRadius, 0, Math.PI * 2, true);
tubeShape.holes.push(tubeHole);

const tubeGeom = new THREE.ExtrudeGeometry(tubeShape, { depth: shroudHeight, bevelEnabled: false, curveSegments: 16 });
tubeGeom.center();
tubeGeom.rotateX(Math.PI / 2);

holeOffsets.forEach(pos => {
    const tube = new THREE.Mesh(tubeGeom, frameMaterial);
    tube.position.set(pos[0], 0, pos[1]);
    frameGroup.add(tube);
});

// 1d. Structural Ribs (connecting corner pillars to the main shroud)
const ribGeom = new THREE.BoxGeometry(2, shroudHeight, 12);
const ribDist = 46;
const ribPositions = [
    { x: ribDist, z: ribDist, rot: Math.PI / 4 },
    { x: ribDist, z: -ribDist, rot: -Math.PI / 4 },
    { x: -ribDist, z: ribDist, rot: -Math.PI / 4 },
    { x: -ribDist, z: -ribDist, rot: Math.PI / 4 }
];
ribPositions.forEach(p => {
    const rib = new THREE.Mesh(ribGeom, frameMaterial);
    rib.position.set(p.x, 0, p.z);
    rib.rotation.y = p.rot;
    frameGroup.add(rib);
});

// 1e. Motor Support Struts (at the back/bottom of the fan)
const strutGeom = new THREE.BoxGeometry(shroudInnerRadius - hubRadius, 2, 4);
strutGeom.translate(hubRadius + (shroudInnerRadius - hubRadius) / 2, 0, 0);
for (let i = 0; i < 4; i++) {
    const strut = new THREE.Mesh(strutGeom, frameMaterial);
    strut.position.y = -6; // Connects near the bottom of the hub
    strut.rotation.y = (i * Math.PI) / 2;
    frameGroup.add(strut);
}

// --- 2. IMPELLER CONSTRUCTION ---

// 2a. Central Hub Base
const hubHeight = 14;
const hubBaseGeom = new THREE.CylinderGeometry(hubRadius, hubRadius, hubHeight, 32);
const hubBase = new THREE.Mesh(hubBaseGeom, impellerMaterial);
impellerGroup.add(hubBase);

// 2b. Hub Cap (Domed top)
const hubCapGeom = new THREE.SphereGeometry(hubRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
hubCapGeom.scale(1, 0.25, 1); // Flatten the sphere
const hubCap = new THREE.Mesh(hubCapGeom, impellerMaterial);
hubCap.position.y = hubHeight / 2; // Position on top of the base cylinder
impellerGroup.add(hubCap);

// Center detail sticker/indent
const stickerGeom = new THREE.CylinderGeometry(hubRadius * 0.6, hubRadius * 0.6, 0.2, 32);
const stickerMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
const sticker = new THREE.Mesh(stickerGeom, stickerMat);
sticker.position.y = hubHeight / 2 + hubRadius * 0.25;
impellerGroup.add(sticker);

// 2c. Fan Blades
// Using a deformed BoxGeometry to create thick, curved, and twisted parametric blades
const bladeGeom = new THREE.BoxGeometry(1, 1, 1, 30, 15, 2);
const pos = bladeGeom.attributes.position;
const r0 = hubRadius - 1; // Slight overlap with hub
const r1 = shroudInnerRadius - 0.5; // Small clearance from shroud

for (let i = 0; i < pos.count; i++) {
    // Map bounding box [-0.5, 0.5] to [0, 1] for parametric calculation
    const u = pos.getX(i) + 0.5; // Radial distance (hub to tip)
    const v = pos.getY(i) + 0.5; // Chordwise position (trailing to leading edge)
    const w = pos.getZ(i);       // Thickness

    const r = r0 + u * (r1 - r0);
    
    // Blade shaping logic
    const sweep = -u * 1.3; // Curving backwards
    const widthAngle = 0.5 + u * 0.3; // Blade gets wider towards the tip
    const theta = sweep + (v - 0.5) * widthAngle;
    
    const pitch = (1 - u) * 0.6 + 0.2; // Twist: steeper at hub, flatter at tip
    
    // Calculate base coordinates
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    
    // Add a droop curve to make it look organic and scoop air
    const droop = Math.sin(u * Math.PI) * 2.0;
    const y_base = (v - 0.5) * r * Math.sin(pitch) + droop;
    
    // Taper thickness towards the tip
    const thickness = 1.2 - u * 0.4;
    const y = y_base + w * thickness;
    
    pos.setXYZ(i, x, y, z);
}
bladeGeom.computeVertexNormals();

// Instantiate and arrange blades radially around the hub
const bladeMesh = new THREE.Mesh(bladeGeom, impellerMaterial);
for (let i = 0; i < bladeCount; i++) {
    const blade = bladeMesh.clone();
    blade.rotation.y = (i / bladeCount) * Math.PI * 2;
    impellerGroup.add(blade);
}

// Slightly rotate impeller for a dynamic starting pose
impellerGroup.rotation.y = Math.PI / 6;

// --- 3. ASSEMBLY ---
fanGroup.add(frameGroup);
fanGroup.add(impellerGroup);
scene.add(fanGroup);

// --- 4. CAMERA SETUP ---
// Position camera for a clear isometric overview of the fan
camera.position.set(100, 80, 110);
camera.lookAt(0, 0, 0);