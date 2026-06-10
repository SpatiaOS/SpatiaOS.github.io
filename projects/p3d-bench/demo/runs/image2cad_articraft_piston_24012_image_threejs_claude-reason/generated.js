// ===== PISTON AND CONNECTING ROD ASSEMBLY =====
// Automotive engine piston with connecting rod, I-beam profile, and big end cap

// === Materials ===
const metalMat = new THREE.MeshStandardMaterial({
    color: 0xb8b8b8, metalness: 0.5, roughness: 0.35
});
const darkMat = new THREE.MeshStandardMaterial({
    color: 0x909090, metalness: 0.6, roughness: 0.3
});
const boreMat = new THREE.MeshStandardMaterial({
    color: 0x505050, metalness: 0.7, roughness: 0.2
});

const S = 64; // circular segments

// === Key Dimensions ===
const pistonRadius = 4;
const pistonHeight = 5.5;
const rodCenterToCenter = 13;

// Vertical layout positions
const wristPinY = 5;
const bigEndY = wristPinY - rodCenterToCenter; // -8
const pistonBottomY = wristPinY - pistonHeight * 0.35; // ~3.08

// Small end (fits inside piston around wrist pin)
const seOuterR = 1.5, seInnerR = 0.65, seWidth = 1.6;

// Big end (connects to crankshaft)
const beOuterR = 2.8, beInnerR = 1.8, beWidth = 2.2;

// ============================================================
// ===== PISTON (LatheGeometry with ring groove detail) =====
// ============================================================
const pistonProfile = [];
const r = pistonRadius;
const grooveStart = pistonHeight * 0.58; // Y position of first ring groove

// Bottom face - from center outward
pistonProfile.push(new THREE.Vector2(0, 0));
pistonProfile.push(new THREE.Vector2(r * 0.55, 0.01));
pistonProfile.push(new THREE.Vector2(r - 0.15, 0.08));
pistonProfile.push(new THREE.Vector2(r, 0.25));

// Skirt wall up to ring groove zone
pistonProfile.push(new THREE.Vector2(r, grooveStart - 0.05));

// Three ring grooves (2 compression + 1 oil control)
for (let i = 0; i < 3; i++) {
    const gy = grooveStart + i * 0.50;
    pistonProfile.push(new THREE.Vector2(r, gy));
    pistonProfile.push(new THREE.Vector2(r - 0.28, gy + 0.02));
    pistonProfile.push(new THREE.Vector2(r - 0.28, gy + 0.13));
    pistonProfile.push(new THREE.Vector2(r, gy + 0.15));
    if (i < 2) pistonProfile.push(new THREE.Vector2(r, gy + 0.48));
}

const grooveTop = grooveStart + 1.0 + 0.15;

// Fire ring land and crown band (slightly wider)
pistonProfile.push(new THREE.Vector2(r, grooveTop + 0.08));
pistonProfile.push(new THREE.Vector2(r + 0.06, grooveTop + 0.12));
pistonProfile.push(new THREE.Vector2(r + 0.06, pistonHeight - 0.30));

// Crown edge with chamfer
pistonProfile.push(new THREE.Vector2(r, pistonHeight - 0.15));
pistonProfile.push(new THREE.Vector2(r - 0.10, pistonHeight));

// Top surface back to center
pistonProfile.push(new THREE.Vector2(0, pistonHeight));

const pistonGeo = new THREE.LatheGeometry(pistonProfile, S);
const pistonMesh = new THREE.Mesh(pistonGeo, metalMat);
pistonMesh.position.y = pistonBottomY;
scene.add(pistonMesh);

// Valve relief depression on piston crown
const pistonTopY = pistonBottomY + pistonHeight;
const reliefShape = new THREE.Shape();
reliefShape.absellipse(0, 0, 1.0, 0.6, 0, Math.PI * 2, false, 0);
const reliefGeo = new THREE.ExtrudeGeometry(reliefShape, {
    depth: 0.06, bevelEnabled: false
});
const reliefMesh = new THREE.Mesh(reliefGeo, darkMat);
reliefMesh.rotation.x = -Math.PI / 2;
reliefMesh.position.set(-0.8, pistonTopY + 0.01, 0.3);
scene.add(reliefMesh);

// Wrist pin boss indicators (visible circles on piston sides)
const bossRingGeo = new THREE.TorusGeometry(0.85, 0.10, 12, 32);
[-1, 1].forEach(side => {
    const boss = new THREE.Mesh(bossRingGeo, darkMat);
    boss.rotation.y = Math.PI / 2;
    boss.position.set(side * (r + 0.06), wristPinY, 0);
    scene.add(boss);
});

// ============================================================
// ===== CONNECTING ROD =====
// ============================================================

// --- Small End Ring (rectangular cross-section washer) ---
const seProfile = [
    new THREE.Vector2(seInnerR, -seWidth / 2),
    new THREE.Vector2(seOuterR, -seWidth / 2),
    new THREE.Vector2(seOuterR, seWidth / 2),
    new THREE.Vector2(seInnerR, seWidth / 2),
    new THREE.Vector2(seInnerR, -seWidth / 2) // close profile
];
const seRingMesh = new THREE.Mesh(new THREE.LatheGeometry(seProfile, S), metalMat);
seRingMesh.rotation.z = Math.PI / 2; // bore axis along X
seRingMesh.position.y = wristPinY;
scene.add(seRingMesh);

// --- Big End Ring ---
const beProfile = [
    new THREE.Vector2(beInnerR, -beWidth / 2),
    new THREE.Vector2(beOuterR, -beWidth / 2),
    new THREE.Vector2(beOuterR, beWidth / 2),
    new THREE.Vector2(beInnerR, beWidth / 2),
    new THREE.Vector2(beInnerR, -beWidth / 2) // close profile
];
const beRingMesh = new THREE.Mesh(new THREE.LatheGeometry(beProfile, S), metalMat);
beRingMesh.rotation.z = Math.PI / 2; // bore axis along X
beRingMesh.position.y = bigEndY;
scene.add(beRingMesh);

// Big end bore interior (dark cylinder to simulate depth)
const boreVisGeo = new THREE.CylinderGeometry(beInnerR - 0.05, beInnerR - 0.05, beWidth + 0.4, S);
const boreVisMesh = new THREE.Mesh(boreVisGeo, boreMat);
boreVisMesh.rotation.z = Math.PI / 2;
boreVisMesh.position.y = bigEndY;
scene.add(boreVisMesh);

// Bearing insert ring inside bore
const bearingGeo = new THREE.TorusGeometry(beInnerR - 0.10, 0.08, 12, S);
const bearingMesh = new THREE.Mesh(bearingGeo, darkMat);
bearingMesh.rotation.z = Math.PI / 2;
bearingMesh.position.y = bigEndY;
scene.add(bearingMesh);

// --- I-Beam Rod Beam ---
const beamBottom = bigEndY + beOuterR * 0.65;  // ~-6.18
const beamTop = wristPinY - seOuterR * 0.65;   // ~4.03
const beamLength = beamTop - beamBottom;

// I-beam cross-section dimensions
const flangeHW = 0.95;    // flange half-width (X)
const flangeT = 0.22;     // flange thickness
const webHW = 0.22;       // web half-width (X)
const webHD = 0.65;       // web half-depth (becomes Z after rotation)

const iBeamShape = new THREE.Shape();
iBeamShape.moveTo(-flangeHW, -(webHD + flangeT));
iBeamShape.lineTo(flangeHW, -(webHD + flangeT));
iBeamShape.lineTo(flangeHW, -webHD);
iBeamShape.lineTo(webHW, -webHD);
iBeamShape.lineTo(webHW, webHD);
iBeamShape.lineTo(flangeHW, webHD);
iBeamShape.lineTo(flangeHW, webHD + flangeT);
iBeamShape.lineTo(-flangeHW, webHD + flangeT);
iBeamShape.lineTo(-flangeHW, webHD);
iBeamShape.lineTo(-webHW, webHD);
iBeamShape.lineTo(-webHW, -webHD);
iBeamShape.lineTo(-flangeHW, -webHD);
iBeamShape.closePath();

const beamGeo = new THREE.ExtrudeGeometry(iBeamShape, {
    depth: beamLength, bevelEnabled: false
});
// Rotate so extrude direction (Z) becomes Y (vertical)
beamGeo.rotateX(-Math.PI / 2);
beamGeo.translate(0, beamBottom, 0);

const beamMesh = new THREE.Mesh(beamGeo, metalMat);
scene.add(beamMesh);

// --- Transition: Beam to Big End (flared cone) ---
const transBotGeo = new THREE.CylinderGeometry(
    flangeHW * 1.0,    // top radius (beam side)
    beOuterR * 0.62,   // bottom radius (big end side)
    beOuterR * 1.3,    // height
    20
);
const transBotMesh = new THREE.Mesh(transBotGeo, metalMat);
transBotMesh.position.y = beamBottom - beOuterR * 0.1;
scene.add(transBotMesh);

// --- Transition: Beam to Small End (flared cone) ---
const transTopGeo = new THREE.CylinderGeometry(
    seOuterR * 0.75,   // top radius (small end side)
    flangeHW * 0.95,   // bottom radius (beam side)
    seOuterR * 1.4,    // height
    20
);
const transTopMesh = new THREE.Mesh(transTopGeo, metalMat);
transTopMesh.position.y = beamTop + seOuterR * 0.05;
scene.add(transTopMesh);

// --- Cap Split Lines (dark marks at parting plane) ---
[-1, 1].forEach(side => {
    const splitGeo = new THREE.BoxGeometry(beWidth + 0.08, 0.05, 0.12);
    const splitMesh = new THREE.Mesh(splitGeo, boreMat);
    splitMesh.position.set(0, bigEndY, side * beOuterR);
    scene.add(splitMesh);
});

// --- Bolt Bosses and Fasteners ---
[-1, 1].forEach(side => {
    const boltZ = side * beOuterR;
    const boltY = bigEndY - 0.35;

    // Bolt boss block
    const bossGeo = new THREE.BoxGeometry(beWidth * 0.45, 1.4, 0.75);
    const bossMesh = new THREE.Mesh(bossGeo, metalMat);
    bossMesh.position.set(0, boltY, boltZ);
    scene.add(bossMesh);

    // Bolt shaft
    const shaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.6, 12);
    const shaftMesh = new THREE.Mesh(shaftGeo, darkMat);
    shaftMesh.position.set(0, boltY, boltZ);
    scene.add(shaftMesh);

    // Hex nut at bottom
    const nutGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.26, 6);
    const nutMesh = new THREE.Mesh(nutGeo, boreMat);
    nutMesh.position.set(0, boltY - 0.95, boltZ);
    scene.add(nutMesh);

    // Washer under nut
    const washerGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 16);
    const washerMesh = new THREE.Mesh(washerGeo, darkMat);
    washerMesh.position.set(0, boltY - 0.78, boltZ);
    scene.add(washerMesh);
});

// ============================================================
// ===== CAMERA SETUP =====
// ============================================================
camera.position.set(16, 8, 16);
camera.lookAt(0, -1, 0);