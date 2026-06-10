// Parameters
const scale = 1;
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xc2c2c2, roughness: 0.6, metalness: 0.15 });
const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.8 });

// Component dimension definitions
const chassisLength = 12 * scale;
const chassisWidth = 8 * scale;
const chassisHeight = 3 * scale;

const cabLength = 6 * scale;
const cabWidth = 5 * scale;
const cabHeight = 7 * scale;

const wheelRadius = 3.5 * scale;
const wheelThickness = 2 * scale;
const treadCount = 12;
const treadDepth = 0.5 * scale;

const armLength = 9 * scale;
const armWidth = 1 * scale;
const armHeight = 2.5 * scale;
const crossBarCount = 3;
const crossBarRadius = 0.3 * scale;

const bucketWidth = 14 * scale;
const bucketHeight = 5 * scale;
const bucketDepth = 3 * scale;
const bucketTilt = -0.2; // Radians tilt up

const exhaustRadius = 0.4 * scale;
const exhaustHeight = 2 * scale;

// ------------------------------
// Base Chassis
// ------------------------------
const chassisGeo = new THREE.BoxGeometry(chassisWidth, chassisHeight, chassisLength);
const chassis = new THREE.Mesh(chassisGeo, baseMaterial);
chassis.position.y = chassisHeight / 2;
scene.add(chassis);

// ------------------------------
// Operator Cab
// ------------------------------
const cabGeo = new THREE.BoxGeometry(cabWidth, cabHeight, cabLength);
const cab = new THREE.Mesh(cabGeo, baseMaterial);
cab.position.set(0, chassisHeight + (cabHeight / 2), chassisLength * 0.22); // Mount on chassis, rearward position
scene.add(cab);

// Cab window cutouts (simulated with dark material)
const windowGeo = new THREE.BoxGeometry(cabWidth * 0.92, cabHeight * 0.5, cabLength * 0.3);
const frontWindow = new THREE.Mesh(windowGeo, darkMaterial);
frontWindow.position.set(0, cab.position.y, cab.position.z - cabLength * 0.3);
scene.add(frontWindow);

const rearWindow = new THREE.Mesh(windowGeo, darkMaterial);
rearWindow.position.set(0, cab.position.y, cab.position.z + cabLength * 0.3);
scene.add(rearWindow);

// ------------------------------
// Exhaust Pipe
// ------------------------------
const exhaustGeo = new THREE.CylinderGeometry(exhaustRadius, exhaustRadius, exhaustHeight, 16);
const exhaust = new THREE.Mesh(exhaustGeo, baseMaterial);
exhaust.position.set(chassisWidth/2 - 1, chassisHeight + exhaustHeight/2, chassisLength/2 - 1.5);
scene.add(exhaust);

// ------------------------------
// Wheels with Treads
// ------------------------------
function createWheel() {
  const wheel = new THREE.Group();

  // Inner hub
  const hubGeo = new THREE.CylinderGeometry(wheelRadius - treadDepth, wheelRadius - treadDepth, wheelThickness, 24);
  const hub = new THREE.Mesh(hubGeo, baseMaterial);
  hub.rotation.z = Math.PI / 2; // Align wheel to face correct direction
  wheel.add(hub);

  // Center recess
  const centerRecessGeo = new THREE.CylinderGeometry(wheelRadius * 0.5, wheelRadius * 0.5, wheelThickness + 0.1, 24);
  const centerRecess = new THREE.Mesh(centerRecessGeo, darkMaterial);
  centerRecess.rotation.z = Math.PI / 2;
  wheel.add(centerRecess);

  // Add tread segments
  for (let i = 0; i < treadCount; i++) {
    const angle = (i / treadCount) * Math.PI * 2;
    const treadGeo = new THREE.BoxGeometry(wheelThickness + 0.2, treadDepth * 2, ((Math.PI * 2 * wheelRadius) / treadCount) * 0.75);
    const tread = new THREE.Mesh(treadGeo, baseMaterial);
    tread.position.x = Math.cos(angle) * (wheelRadius - treadDepth);
    tread.position.y = Math.sin(angle) * (wheelRadius - treadDepth);
    tread.rotation.z = angle + Math.PI / 2;
    wheel.add(tread);
  }
  return wheel;
}

// Position all 4 wheels
const wheelPositions = [
  {x: -chassisWidth/2 - wheelThickness/2, z: -chassisLength/2 + 2}, // Front Left
  {x: chassisWidth/2 + wheelThickness/2, z: -chassisLength/2 + 2},  // Front Right
  {x: -chassisWidth/2 - wheelThickness/2, z: chassisLength/2 - 2},  // Rear Left
  {x: chassisWidth/2 + wheelThickness/2, z: chassisLength/2 - 2}    // Rear Right
];

wheelPositions.forEach(pos => {
  const wheel = createWheel();
  wheel.position.set(pos.x, wheelRadius, pos.z);
  scene.add(wheel);
});

// ------------------------------
// Loader Arm Assembly
// ------------------------------
const leftArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armLength), baseMaterial);
leftArm.position.set(-chassisWidth/2 + armWidth/2, chassisHeight/2 + 1, -chassisLength/2 + 1);
leftArm.rotation.x = 0.3; // Upward angle
scene.add(leftArm);

const rightArm = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight, armLength), baseMaterial);
rightArm.position.set(chassisWidth/2 - armWidth/2, chassisHeight/2 + 1, -chassisLength/2 + 1);
rightArm.rotation.x = 0.3;
scene.add(rightArm);

// Cross support bars between arms
for (let i = 0; i < crossBarCount; i++) {
  const crossBarGeo = new THREE.CylinderGeometry(crossBarRadius, crossBarRadius, chassisWidth - armWidth * 2, 12);
  const crossBar = new THREE.Mesh(crossBarGeo, baseMaterial);
  crossBar.rotation.z = Math.PI / 2;
  const zOffset = -armLength * 0.3 + (i * armLength * 0.2);
  crossBar.position.set(
    0,
    chassisHeight/2 + 1 + (i * 0.5),
    -chassisLength/2 + 1 + (zOffset * Math.cos(0.3))
  );
  crossBar.position.y += zOffset * Math.sin(0.3);
  scene.add(crossBar);
}

// ------------------------------
// Front Bucket
// ------------------------------
const bucketGroup = new THREE.Group();
const bucketGeo = new THREE.BoxGeometry(bucketWidth, bucketHeight, bucketDepth);
const bucketMain = new THREE.Mesh(bucketGeo, baseMaterial);
bucketGroup.add(bucketMain);

// Bucket side plates
const sidePlateGeo = new THREE.BoxGeometry(0.5, bucketHeight + 1, bucketDepth + 2);
const leftSidePlate = new THREE.Mesh(sidePlateGeo, baseMaterial);
leftSidePlate.position.set(-bucketWidth/2, 0, -0.5);
bucketGroup.add(leftSidePlate);

const rightSidePlate = new THREE.Mesh(sidePlateGeo, baseMaterial);
rightSidePlate.position.set(bucketWidth/2, 0, -0.5);
bucketGroup.add(rightSidePlate);

// Position bucket at end of loader arms
bucketGroup.rotation.x = bucketTilt;
bucketGroup.position.set(0, chassisHeight + 2, -chassisLength/2 - armLength * Math.cos(0.3) + 2);
scene.add(bucketGroup);

// ------------------------------
// Camera Setup
// ------------------------------
camera.position.set(32, 28, 32);
camera.lookAt(0, 0, 0);