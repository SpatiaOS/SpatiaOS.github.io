// Parameters - Wall-mounted fan/reflector unit
const baseRadius = 5;
const baseHeight = 1;
const motorRadius = 2.5;
const motorHeight = 3;
const armLength = 8;
const armRadiusStart = 1.2;
const armRadiusEnd = 0.9;
const dishRadius = 6;
const dishDepth = 0.6;

// Material - metallic gray appearance
const material = new THREE.MeshStandardMaterial({ 
  color: 0xaaaaaa, 
  metalness: 0.7, 
  roughness: 0.3 
});

// Group to hold all parts
const fanAssembly = new THREE.Group();

// 1. Base Grill - circular grid pattern
// Outer ring
const outerRingGeom = new THREE.TorusGeometry(baseRadius, 0.15, 16, 64);
const outerRing = new THREE.Mesh(outerRingGeom, material);
outerRing.rotation.x = Math.PI / 2;
fanAssembly.add(outerRing);

// Inner concentric rings for grill effect
for (let i = 1; i <= 4; i++) {
  const ringRadius = baseRadius * (i / 5);
  const ringGeom = new THREE.TorusGeometry(ringRadius, 0.06, 8, 48);
  const ring = new THREE.Mesh(ringGeom, material);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  fanAssembly.add(ring);
}

// Radial spokes for grill
const spokeCount = 24;
for (let i = 0; i < spokeCount; i++) {
  const angle = (i / spokeCount) * Math.PI * 2;
  const spokeGeom = new THREE.BoxGeometry(baseRadius * 2, 0.08, 0.12);
  const spoke = new THREE.Mesh(spokeGeom, material);
  spoke.rotation.y = angle;
  spoke.position.y = 0.05;
  fanAssembly.add(spoke);
}

// Base plate (solid bottom)
const basePlateGeom = new THREE.CylinderGeometry(baseRadius * 0.95, baseRadius * 0.95, 0.15, 64);
const basePlate = new THREE.Mesh(basePlateGeom, material);
basePlate.position.y = -0.07;
fanAssembly.add(basePlate);

// 2. Motor Housing - main cylinder
const motorGeom = new THREE.CylinderGeometry(motorRadius, motorRadius, motorHeight, 32);
const motor = new THREE.Mesh(motorGeom, material);
motor.position.y = motorHeight / 2 + baseHeight / 2;
fanAssembly.add(motor);

// Motor top cap with detail (slightly smaller cylinder)
const topCapGeom = new THREE.CylinderGeometry(motorRadius * 0.85, motorRadius * 0.9, 0.8, 32);
const topCap = new THREE.Mesh(topCapGeom, material);
topCap.position.y = motorHeight + baseHeight / 2 + 0.1;
fanAssembly.add(topCap);

// Control panel detail on top
const panelGeom = new THREE.BoxGeometry(motorRadius * 1.2, 0.15, motorRadius * 0.8);
const panel = new THREE.Mesh(panelGeom, material);
panel.position.set(0, motorHeight + baseHeight / 2 + 0.55, 0);
panel.rotation.y = Math.PI / 6;
fanAssembly.add(panel);

// 3. Mounting bracket/joint between motor and arm
const jointGeom = new THREE.BoxGeometry(1.2, 1, 1.5);
const joint = new THREE.Mesh(jointGeom, material);
joint.position.set(0, motorHeight + baseHeight / 2 - 0.3, motorRadius + 0.5);
joint.rotation.z = Math.PI / 6;
fanAssembly.add(joint);

// 4. Arm - tapered cylinder extending up and out
// Using multiple segments for taper effect
const armSegments = 8;
const armAngle = -Math.PI / 5; // Angle upward
const armStartPos = new THREE.Vector3(
  Math.sin(armAngle) * (motorRadius + 0.5),
  motorHeight + baseHeight / 2,
  Math.cos(armAngle) * (motorRadius + 0.5)
);

for (let i = 0; i < armSegments; i++) {
  const t = i / armSegments;
  const tNext = (i + 1) / armSegments;
  const rStart = armRadiusStart + (armRadiusEnd - armRadiusStart) * t;
  const rEnd = armRadiusStart + (armRadiusEnd - armRadiusStart) * tNext;
  
  const segLength = armLength / armSegments;
  const segGeom = new THREE.CylinderGeometry(rEnd, rStart, segLength, 16);
  const segment = new THREE.Mesh(segGeom, material);
  
  // Position along arm path
  const offset = t * armLength + segLength / 2;
  segment.position.x = armStartPos.x + Math.sin(armAngle) * offset;
  segment.position.y = armStartPos.y + Math.cos(armAngle) * offset * 0.4;
  segment.position.z = armStartPos.z + Math.cos(armAngle) * offset;
  
  // Rotate to align with arm direction
  segment.rotation.z = Math.PI / 2 - armAngle * 0.4;
  segment.rotation.x = armAngle * 0.3;
  
  fanAssembly.add(segment);
}

// 5. Dish/Reflector - large disc at end of arm
const dishPosition = new THREE.Vector3(
  armStartPos.x + Math.sin(armAngle) * armLength,
  armStartPos.y + Math.cos(armAngle) * armLength * 0.4 + 1,
  armStartPos.z + Math.cos(armAngle) * armLength
);

// Main dish - sphere scaled to create dish shape
const dishGeom = new THREE.SphereGeometry(dishRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
const dish = new THREE.Mesh(dishGeom, material);
dish.position.copy(dishPosition);
dish.rotation.x = Math.PI * 0.1;
dish.rotation.z = -Math.PI * 0.15;
fanAssembly.add(dish);

// Dish backing/rim
const dishRimGeom = new THREE.TorusGeometry(dishRadius, 0.2, 16, 64);
const dishRim = new THREE.Mesh(dishRimGeom, material);
dishRim.position.copy(dishPosition);
dishRim.position.x += 0.3;
dishRim.rotation.y = Math.PI / 2 + 0.15;
dishRim.rotation.x = 0.1;
fanAssembly.add(dishRim);

// Support struts from arm to dish (thin cylinders)
const strutPositions = [
  { angle: 0.3 },
  { angle: -0.3 }
];

strutPositions.forEach(strut => {
  const strutGeom = new THREE.CylinderGeometry(0.04, 0.04, 4, 8);
  const strutMesh = new THREE.Mesh(strutGeom, material);
  strutMesh.position.x = dishPosition.x - 2;
  strutMesh.position.y = dishPosition.y - 1 + strut.angle * 2;
  strutMesh.position.z = dishPosition.z - 1;
  strutMesh.rotation.z = Math.PI / 4 + strut.angle;
  strutMesh.rotation.y = -0.2;
  fanAssembly.add(strutMesh);
});

// Add assembly to scene
scene.add(fanAssembly);

// Adjust camera to view the model nicely
camera.position.set(18, 12, 18);
camera.lookAt(0, 4, 0);