// Global material for all CAD gray parts
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  roughness: 0.6,
  metalness: 0.25
});

// --------------------------
// Parameter Definitions
// --------------------------
// Base plate params
const baseWidth = 22;
const baseDepth = 13;
const baseThickness = 1.6;

// Main stand params
const standWidth = 5.5;
const standHeight = 7.2;
const standDepth = 6.2;

// Flywheel params (two identical flywheels)
const flywheelOuterRadius = 6.2;
const flywheelInnerRadius = 4.1;
const flywheelThickness = 1.9;
const flywheelHoleCount = 5;
const flywheelHoleRadius = 1.3;
const flywheelCenterHeight = baseThickness + standHeight - 1.2;
const distanceBetweenFlywheels = 6.2;
const flywheelHubRadius = 1.6;
const shaftRadius = 0.4;
const shaftLength = 2.2;

// Ribbed cylinder params (left side)
const cylinderLength = 12.5;
const cylinderRadius = 3.1;
const ribCount = 28;
const ribHeight = 0.32;
const ribThickness = 0.22;
const cylinderPortRadius = 0.55;
const cylinderPortHeight = 1.6;

// --------------------------
// Base Construction
// --------------------------
const baseGeometry = new THREE.BoxGeometry(baseWidth, baseThickness, baseDepth);
const base = new THREE.Mesh(baseGeometry, metalMaterial);
base.position.y = baseThickness / 2;
scene.add(base);

// --------------------------
// Main Stand Construction
// --------------------------
const standGeometry = new THREE.BoxGeometry(standWidth, standHeight, standDepth);
const stand = new THREE.Mesh(standGeometry, metalMaterial);
stand.position.set(0, baseThickness + standHeight / 2, 0);
scene.add(stand);

// --------------------------
// Flywheel Geometry Generator (reusable for both flywheels)
// --------------------------
function buildFlywheelGeometry() {
  const flywheelShape = new THREE.Shape();
  // Outer rim shape
  flywheelShape.moveTo(flywheelOuterRadius, 0);
  flywheelShape.absarc(0, 0, flywheelOuterRadius, 0, Math.PI * 2);
  
  // Inner ring cutout
  const innerCutout = new THREE.Path();
  innerCutout.moveTo(flywheelInnerRadius, 0);
  innerCutout.absarc(0, 0, flywheelInnerRadius, 0, Math.PI * 2);
  flywheelShape.holes.push(innerCutout);
  
  // Spoke cutouts
  for (let i = 0; i < flywheelHoleCount; i++) {
    const angle = (i / flywheelHoleCount) * Math.PI * 2;
    const holeX = Math.cos(angle) * (flywheelInnerRadius * 0.85 + flywheelHoleRadius);
    const holeY = Math.sin(angle) * (flywheelInnerRadius * 0.85 + flywheelHoleRadius);
    const spokeHole = new THREE.Path();
    spokeHole.moveTo(holeX + flywheelHoleRadius, holeY);
    spokeHole.absarc(holeX, holeY, flywheelHoleRadius, 0, Math.PI * 2);
    flywheelShape.holes.push(spokeHole);
  }
  
  // Extrude 2D shape to 3D
  return new THREE.ExtrudeGeometry(flywheelShape, {
    depth: flywheelThickness,
    bevelEnabled: false
  });
}

// Left flywheel
const leftFlywheel = new THREE.Mesh(buildFlywheelGeometry(), metalMaterial);
leftFlywheel.rotation.x = Math.PI / 2;
leftFlywheel.position.set(-distanceBetweenFlywheels / 2, flywheelCenterHeight, 0);
scene.add(leftFlywheel);

// Right flywheel
const rightFlywheel = new THREE.Mesh(buildFlywheelGeometry(), metalMaterial);
rightFlywheel.rotation.x = Math.PI / 2;
rightFlywheel.position.set(distanceBetweenFlywheels / 2, flywheelCenterHeight, 0);
scene.add(rightFlywheel);

// --------------------------
// Flywheel Hubs and Shafts
// --------------------------
// Left hub + shaft
const leftHubGeometry = new THREE.CylinderGeometry(flywheelHubRadius, flywheelHubRadius, 1.1, 32);
leftHubGeometry.rotateZ(Math.PI / 2);
const leftHub = new THREE.Mesh(leftHubGeometry, metalMaterial);
leftHub.position.set(-distanceBetweenFlywheels/2 - flywheelThickness/2 - 0.6, flywheelCenterHeight, 0);
scene.add(leftHub);

const leftShaftGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 32);
leftShaftGeometry.rotateZ(Math.PI / 2);
const leftShaft = new THREE.Mesh(leftShaftGeometry, metalMaterial);
leftShaft.position.set(leftHub.position.x - 0.6 - shaftLength/2, flywheelCenterHeight, 0);
scene.add(leftShaft);

// Right hub
const rightHubGeometry = new THREE.CylinderGeometry(flywheelHubRadius, flywheelHubRadius, 1.1, 32);
rightHubGeometry.rotateZ(Math.PI / 2);
const rightHub = new THREE.Mesh(rightHubGeometry, metalMaterial);
rightHub.position.set(distanceBetweenFlywheels/2 + flywheelThickness/2 + 0.6, flywheelCenterHeight, 0);
scene.add(rightHub);

// --------------------------
// Crank Mechanism Between Flywheels
// --------------------------
const crankBlockGeometry = new THREE.BoxGeometry(3.2, 2.2, 4.2);
const crankBlock = new THREE.Mesh(crankBlockGeometry, metalMaterial);
crankBlock.position.set(0, flywheelCenterHeight, 0);
scene.add(crankBlock);

// --------------------------
// Ribbed Cylinder (Left Side)
// --------------------------
const mainCylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderLength, 64);
mainCylinderGeometry.rotateZ(Math.PI / 2);
const mainCylinder = new THREE.Mesh(mainCylinderGeometry, metalMaterial);
mainCylinder.position.set(
  -distanceBetweenFlywheels/2 - flywheelThickness - 2.2 - cylinderLength/2,
  flywheelCenterHeight,
  0
);
scene.add(mainCylinder);

// Add cooling ribs to cylinder
for (let i = 0; i < ribCount; i++) {
  const ribX = mainCylinder.position.x - cylinderLength/2 + 0.6 + i * (cylinderLength - 1.2) / ribCount;
  const ribGeometry = new THREE.CylinderGeometry(
    cylinderRadius + ribHeight,
    cylinderRadius + ribHeight,
    ribThickness,
    64
  );
  ribGeometry.rotateZ(Math.PI / 2);
  const rib = new THREE.Mesh(ribGeometry, metalMaterial);
  rib.position.set(ribX, flywheelCenterHeight, 0);
  scene.add(rib);
}

// Cylinder top port
const cylinderPortGeometry = new THREE.CylinderGeometry(cylinderPortRadius, cylinderPortRadius, cylinderPortHeight, 32);
const cylinderPort = new THREE.Mesh(cylinderPortGeometry, metalMaterial);
cylinderPort.position.set(
  mainCylinder.position.x,
  flywheelCenterHeight + cylinderRadius + cylinderPortHeight/2,
  0
);
scene.add(cylinderPort);

// Cylinder support foot
const cylinderFootGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
const cylinderFoot = new THREE.Mesh(cylinderFootGeometry, metalMaterial);
cylinderFoot.position.set(
  mainCylinder.position.x + cylinderLength/3,
  baseThickness + 1.1,
  0
);
scene.add(cylinderFoot);

// --------------------------
// Camera Setup
// --------------------------
camera.position.set(38, 32, 42);
camera.lookAt(0, flywheelCenterHeight, 0);