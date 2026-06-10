// Parameters - based on visual proportions
const reelOuterRadius = 30;
const reelInnerRadius = 20;
const reelThickness = 5;
const hubRadius = 15;
const hubLength = 40;
const hoseRadius = 3;
const hoseLength = 200;
const nozzleLength = 25;
const valveHeight = 20;

// Create reel group
const reelGroup = new THREE.Group();

// Reel back plate
const backPlateGeometry = new THREE.CylinderGeometry(reelOuterRadius, reelOuterRadius, reelThickness, 32);
const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const backPlate = new THREE.Mesh(backPlateGeometry, metalMaterial);
backPlate.rotation.x = Math.PI / 2;
backPlate.position.z = -hubLength / 2 - reelThickness / 2;
reelGroup.add(backPlate);

// Reel front plate
const frontPlateGeometry = new THREE.CylinderGeometry(reelOuterRadius, reelOuterRadius, reelThickness, 32);
const frontPlate = new THREE.Mesh(frontPlateGeometry, metalMaterial);
frontPlate.rotation.x = Math.PI / 2;
frontPlate.position.z = hubLength / 2 + reelThickness / 2;
reelGroup.add(frontPlate);

// Hub cylinder
const hubGeometry = new THREE.CylinderGeometry(hubRadius, hubRadius, hubLength, 32);
const hub = new THREE.Mesh(hubGeometry, metalMaterial);
hub.rotation.x = Math.PI / 2;
reelGroup.add(hub);

// Hose material (rubber-like)
const hoseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

// Create coiled hose using torus segments
const hoseCoils = 8;
const coilSpacing = hubLength / hoseCoils;

for (let i = 0; i < hoseCoils; i++) {
    const coilRadius = reelInnerRadius - (i * (reelInnerRadius - hubRadius) / hoseCoils);
    const torusGeometry = new THREE.TorusGeometry(coilRadius, hoseRadius, 16, 64);
    const coil = new THREE.Mesh(torusGeometry, hoseMaterial);
    coil.position.z = -hubLength / 2 + coilSpacing / 2 + i * coilSpacing;
    reelGroup.add(coil);
}

// Straight hose section from reel to nozzle
const straightHoseGeometry = new THREE.CylinderGeometry(hoseRadius, hoseRadius, hoseLength, 16);
const straightHose = new THREE.Mesh(straightHoseGeometry, hoseMaterial);
straightHose.position.set(-reelOuterRadius - hoseLength / 2, 0, hubLength / 2);
straightHose.rotation.z = Math.PI / 2;
reelGroup.add(straightHose);

// Nozzle assembly
const nozzleGroup = new THREE.Group();

// Nozzle body
const nozzleBodyGeometry = new THREE.CylinderGeometry(5, 3, nozzleLength, 16);
const nozzleBody = new THREE.Mesh(nozzleBodyGeometry, metalMaterial);
nozzleGroup.add(nozzleBody);

// Nozzle tip (conical)
const nozzleTipGeometry = new THREE.ConeGeometry(3, 10, 16);
const nozzleTip = new THREE.Mesh(nozzleTipGeometry, metalMaterial);
nozzleTip.position.y = nozzleLength / 2 + 5;
nozzleTip.rotation.x = -Math.PI / 2;
nozzleGroup.add(nozzleTip);

// Nozzle handle
const handleGeometry = new THREE.BoxGeometry(20, 5, 5);
const handle = new THREE.Mesh(handleGeometry, metalMaterial);
handle.position.set(0, -nozzleLength / 2 - 2.5, 0);
nozzleGroup.add(handle);

// Position nozzle at end of straight hose
nozzleGroup.position.set(-reelOuterRadius - hoseLength, 0, hubLength / 2);
nozzleGroup.rotation.z = Math.PI / 2;
reelGroup.add(nozzleGroup);

// Valve assembly
const valveGroup = new THREE.Group();

// Valve body
const valveBodyGeometry = new THREE.CylinderGeometry(6, 6, valveHeight, 16);
const valveBody = new THREE.Mesh(valveBodyGeometry, metalMaterial);
valveGroup.add(valveBody);

// Valve handle (lever)
const valveHandleGeometry = new THREE.BoxGeometry(15, 4, 4);
const valveHandle = new THREE.Mesh(valveHandleGeometry, metalMaterial);
valveHandle.position.set(10, 0, 0);
valveGroup.add(valveHandle);

// Valve connection to reel
const valveConnectionGeometry = new THREE.CylinderGeometry(4, 4, 30, 16);
const valveConnection = new THREE.Mesh(valveConnectionGeometry, metalMaterial);
valveConnection.position.y = -valveHeight / 2 - 15;
valveGroup.add(valveConnection);

// Position valve below reel
valveGroup.position.set(0, -reelOuterRadius - valveHeight / 2 - 30, 0);
reelGroup.add(valveGroup);

// Add reel group to scene
scene.add(reelGroup);

// Adjust camera to view the model
camera.position.set(80, 60, 80);
camera.lookAt(0, 0, 0);