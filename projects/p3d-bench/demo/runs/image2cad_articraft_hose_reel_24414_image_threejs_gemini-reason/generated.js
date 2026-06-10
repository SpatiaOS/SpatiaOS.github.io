// Parameters
const spoolRadius = 12;
const spoolWidth = 10;
const coreRadius = 6;
const hoseRadius = 0.8;
const pipeRadius = 0.6;

// Materials
const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0b0b0,
    roughness: 0.4,
    metalness: 0.5
});

const hoseMaterial = new THREE.MeshStandardMaterial({
    color: 0x606060,
    roughness: 0.8,
    metalness: 0.1
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
    metalness: 0.0
});

// Main Group
const reelGroup = new THREE.Group();

// --- Spool Assembly ---

// Central Core
const coreGeo = new THREE.CylinderGeometry(coreRadius, coreRadius, spoolWidth, 32);
const core = new THREE.Mesh(coreGeo, metalMaterial);
core.rotation.x = Math.PI / 2;
reelGroup.add(core);

// Front and Back Flanges
const flangeGeo = new THREE.CylinderGeometry(spoolRadius, spoolRadius, 0.5, 64);

const frontFlange = new THREE.Mesh(flangeGeo, metalMaterial);
frontFlange.rotation.x = Math.PI / 2;
frontFlange.position.z = spoolWidth / 2;
reelGroup.add(frontFlange);

const backFlange = new THREE.Mesh(flangeGeo, metalMaterial);
backFlange.rotation.x = Math.PI / 2;
backFlange.position.z = -spoolWidth / 2;
reelGroup.add(backFlange);

// Flange Details (4 holes on the front)
const holeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16);
const holeOffset = 4;
const holePositions = [
    [holeOffset, holeOffset], [-holeOffset, holeOffset],
    [holeOffset, -holeOffset], [-holeOffset, -holeOffset]
];

holePositions.forEach(pos => {
    const hole = new THREE.Mesh(holeGeo, darkMaterial);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(pos[0], pos[1], spoolWidth / 2);
    reelGroup.add(hole);
});

// --- Coiled Hose ---
const coilCenterRadius = coreRadius + hoseRadius;
const coilGeo = new THREE.TorusGeometry(coilCenterRadius, hoseRadius, 16, 64);
const numCoils = 7;
const coilSpacing = (spoolWidth - 1.5) / numCoils;

for (let i = 0; i < numCoils; i++) {
    const coil = new THREE.Mesh(coilGeo, hoseMaterial);
    // Distribute coils evenly along the core
    coil.position.z = -(spoolWidth / 2) + 1 + (i * coilSpacing);
    reelGroup.add(coil);
}

// --- Upward Hose Extension ---
const hoseZPos = -4; // Positioned near the back flange
const hoseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -coilCenterRadius, hoseZPos),
    new THREE.Vector3(-4, -coilCenterRadius, hoseZPos),
    new THREE.Vector3(-8, -coilCenterRadius, hoseZPos),
    new THREE.Vector3(-11, -5.5, hoseZPos),
    new THREE.Vector3(-12, -2.8, hoseZPos),
    new THREE.Vector3(-12, 0, hoseZPos),
    new THREE.Vector3(-12, 16, hoseZPos)
]);

const upwardHoseGeo = new THREE.TubeGeometry(hoseCurve, 64, hoseRadius, 16, false);
const upwardHose = new THREE.Mesh(upwardHoseGeo, hoseMaterial);
reelGroup.add(upwardHose);

// Hose top metal connector
const upperHoseConn = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.5, 6), metalMaterial);
upperHoseConn.position.set(-12, 16, hoseZPos);
reelGroup.add(upperHoseConn);

// --- Top Fitting (Rotary Union / Valve) ---
const topFittingGroup = new THREE.Group();
topFittingGroup.position.set(-12, 16.75, hoseZPos);

// Main vertical body
const topBody = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.5, 32), metalMaterial);
topBody.position.y = 1.25;
topFittingGroup.add(topBody);

// Hexagonal top cap
const hexTop = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.8, 6), metalMaterial);
hexTop.position.y = 2.9;
topFittingGroup.add(hexTop);

// Side port assembly
const sidePortGroup = new THREE.Group();
sidePortGroup.position.set(0, 1.25, 0);
sidePortGroup.rotation.y = -Math.PI / 4; // Angle out towards viewer and left

const spBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16), metalMaterial);
spBase.rotation.x = Math.PI / 2;
spBase.position.z = 0.75;
sidePortGroup.add(spBase);

const spHex = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 6), metalMaterial);
spHex.rotation.x = Math.PI / 2;
spHex.position.z = 1.7;
sidePortGroup.add(spHex);

const spHole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.41, 16), darkMaterial);
spHole.rotation.x = Math.PI / 2;
spHole.position.z = 1.7;
sidePortGroup.add(spHole);

topFittingGroup.add(sidePortGroup);
reelGroup.add(topFittingGroup);

// --- Downward Pipe ---
const downPipeZPos = 3.5; // Positioned near the front
const downPipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 13, 16);
const downPipe = new THREE.Mesh(downPipeGeo, metalMaterial);
downPipe.position.set(0, -6.5, downPipeZPos);
reelGroup.add(downPipe);

// --- Bottom Fitting (Valve & Nozzle) ---
const bottomFittingGroup = new THREE.Group();
bottomFittingGroup.position.set(0, -13, downPipeZPos);

// Connector to pipe
const botConn = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1, 16), metalMaterial);
botConn.position.y = -0.5;
bottomFittingGroup.add(botConn);

// Valve body (spherical center)
const valveBody = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), metalMaterial);
valveBody.position.y = -2;
bottomFittingGroup.add(valveBody);

// Valve stem
const valveStem = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), metalMaterial);
valveStem.position.set(-1, -2, 0);
valveStem.rotation.z = Math.PI / 2;
bottomFittingGroup.add(valveStem);

// Valve handle
const handleGroup = new THREE.Group();
handleGroup.position.set(-1.5, -2, 0);
handleGroup.rotation.z = -0.15; // Angle slightly downwards
const handleMesh = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 0.6), metalMaterial);
handleMesh.position.set(-1.75, 0, 0); // Offset to hinge at stem
handleGroup.add(handleMesh);
bottomFittingGroup.add(handleGroup);

// Nozzle taper
const nozzleTaper = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.4, 2.5, 16), metalMaterial);
nozzleTaper.position.y = -4.45;
bottomFittingGroup.add(nozzleTaper);

// Nozzle straight tip
const nozzleTip = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16), metalMaterial);
nozzleTip.position.y = -6.1;
bottomFittingGroup.add(nozzleTip);

// Nozzle end rim
const nozzleRim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), metalMaterial);
nozzleRim.position.y = -6.6;
bottomFittingGroup.add(nozzleRim);

reelGroup.add(bottomFittingGroup);

// Add entire assembly to scene
scene.add(reelGroup);

// Position camera for a good isometric view
camera.position.set(35, 25, 45);
camera.lookAt(0, -2, 0);