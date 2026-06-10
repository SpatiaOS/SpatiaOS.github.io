// Parameters for overall scale and positioning
const cy = 60; // Center Y axis for main shaft and cylinder
const cx = 25; // X position of the main crankshaft
const matColor = 0x99a0a5;

// Material
const material = new THREE.MeshStandardMaterial({
    color: matColor,
    roughness: 0.4,
    metalness: 0.3,
    side: THREE.DoubleSide
});

// Helper functions for creating and adding meshes
function createMesh(geometry, x, y, z, rotX = 0, rotY = 0, rotZ = 0) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rotX, rotY, rotZ);
    scene.add(mesh);
    return mesh;
}

function addBox(w, h, d, x, y, z) {
    return createMesh(new THREE.BoxGeometry(w, h, d), x, y, z);
}

function addCyl(r, h, x, y, z, rotX = 0, rotY = 0, rotZ = 0) {
    return createMesh(new THREE.CylinderGeometry(r, r, h, 32), x, y, z, rotX, rotY, rotZ);
}

function addHexBolt(r, h, x, y, z, rotX = 0, rotY = 0, rotZ = 0) {
    return createMesh(new THREE.CylinderGeometry(r, r, h, 6), x, y, z, rotX, rotY, rotZ);
}

// --- Base ---
// Tiered base to simulate a cast pedestal
addBox(160, 4, 90, 0, 2, 0);
addBox(154, 4, 84, 0, 6, 0);
addBox(140, 16, 64, 0, 16, 0);
addBox(136, 12, 60, 0, 30, 0);

// --- Main Bearings ---
const bearingZ = 16;
// Left and right bearing blocks
addBox(18, 26, 16, cx, 49, bearingZ);
addBox(18, 26, 16, cx, 49, -bearingZ);
// Bearing caps (rounded tops)
addCyl(9, 16, cx, 62, bearingZ, Math.PI / 2);
addCyl(9, 16, cx, 62, -bearingZ, Math.PI / 2);

// Bearing bolts
for (let z of [bearingZ, -bearingZ]) {
    addHexBolt(1.5, 3, cx - 6, 71, z);
    addHexBolt(1.5, 3, cx + 6, 71, z);
}

// --- Crankshaft ---
// Main shafts extending out
addCyl(4, 45, cx, cy, 32, Math.PI / 2);
addCyl(4, 45, cx, cy, -32, Math.PI / 2);

// Crank webs
const webX = cx - 8; // Center of web
addBox(24, 14, 8, webX, cy, 9);
addBox(24, 14, 8, webX, cy, -9);

// Crank pin
const pinX = cx - 16;
addCyl(4.5, 18, pinX, cy, 0, Math.PI / 2);

// --- Flywheels ---
const fwShape = new THREE.Shape();
fwShape.absarc(0, 0, 44, 0, Math.PI * 2, false);
// Create 5 spokes/holes
for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const hPath = new THREE.Path();
    hPath.absarc(Math.cos(angle) * 23, Math.sin(angle) * 23, 11.5, 0, Math.PI * 2, true);
    fwShape.holes.push(hPath);
}

const fwGeom = new THREE.ExtrudeGeometry(fwShape, {
    depth: 10,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 1,
    bevelThickness: 1,
    curveSegments: 32
});
fwGeom.center(); // Center the extrusion

const fwZ = 42;
createMesh(fwGeom, cx, cy, fwZ);
createMesh(fwGeom, cx, cy, -fwZ);

// Flywheel hubs
addCyl(9, 16, cx, cy, fwZ, Math.PI / 2);
addCyl(9, 16, cx, cy, -fwZ, Math.PI / 2);

// Small output shaft pin on front flywheel
addCyl(2.5, 15, cx, cy, fwZ + 12, Math.PI / 2);

// --- Connecting Rod ---
const crossheadX = -25;
const rodLength = Math.abs(pinX - crossheadX);
const rodCenterX = (pinX + crossheadX) / 2;

// Main rod
addBox(rodLength, 6, 5, rodCenterX, cy, 0);
// Big end (crank side)
addCyl(6, 7, pinX, cy, 0, Math.PI / 2);
// Small end (crosshead side)
addCyl(5, 7, crossheadX, cy, 0, Math.PI / 2);

// --- Crosshead and Guide ---
// Guide block on base
addBox(32, 24, 20, crossheadX, 48, 0);
// Crosshead slider
addBox(14, 12, 14, crossheadX, cy, 0);

// --- Cylinder Assembly ---
const cylStartX = -45;
const cylLength = 40;
const cylCenterX = cylStartX - cylLength / 2;

// Cylinder base mount
addBox(28, 24, 26, cylCenterX + 5, 48, 0);

// Main cylinder body
addCyl(17, cylLength, cylCenterX, cy, 0, 0, 0, Math.PI / 2);

// Cooling fins
const numFins = 22;
const finSpacing = 1.6;
for (let i = 0; i < numFins; i++) {
    const fx = cylStartX - 2 - i * finSpacing;
    addCyl(21, 0.8, fx, cy, 0, 0, 0, Math.PI / 2);
}

// Cylinder head
const headX = cylStartX - cylLength - 2;
addCyl(17, 4, headX, cy, 0, 0, 0, Math.PI / 2);
addCyl(10, 2, headX - 3, cy, 0, 0, 0, Math.PI / 2);

// Cylinder head bolts
for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const bx = headX - 2.5;
    const by = cy + Math.cos(angle) * 13;
    const bz = Math.sin(angle) * 13;
    addHexBolt(1.2, 2, bx, by, bz, 0, 0, Math.PI / 2);
}

// Piston rod (connecting crosshead to cylinder)
addCyl(2.5, Math.abs(crossheadX - cylStartX), (crossheadX + cylStartX) / 2, cy, 0, 0, 0, Math.PI / 2);

// Valve chest on the side
addBox(30, 16, 12, cylCenterX, cy, 18);
addBox(24, 12, 4, cylCenterX, cy, 25); // Cover plate
// Valve rod
addCyl(1.5, 30, cylCenterX + 20, cy, 18, 0, 0, Math.PI / 2);

// Top pipe/valve detail
const pipeX = cylCenterX + 10;
addBox(12, 10, 12, pipeX, cy + 16, 0);
addCyl(4, 10, pipeX, cy + 24, 0);
addCyl(6, 4, pipeX, cy + 30, 0);

// --- Camera Adjustment ---
camera.position.set(110, 100, 140);
camera.lookAt(-10, 45, 0);