// --------------------------
// PARAMETERS (Parametric Design)
// --------------------------
const fanDiameter = 30;               // Overall fan size
const fanGrillThickness = 0.3;        // Thickness of grill wires
const numGrillRadialSpokes = 32;      // Number of straight radial grill lines
const numGrillCircularRings = 6;      // Number of circular concentric grill lines
const numFanBlades = 8;               // Number of fan impeller blades
const motorHousingRadius = 6;         // Radius of central motor body
const motorHousingHeight = 8;         // Height of central motor body
const armLength = 22;                 // Length of arm connecting motor to solar panel
const armRadius = 1.8;                // Radius of connecting arm
const solarDishDiameter = 28;         // Diameter of solar collector dish
const solarDishDepth = 6;             // Depth of curved solar dish
const baseMaterialColor = 0xd8d8d8;   // Base light gray plastic color
const accentMaterialColor = 0xc0c0c0; // Slightly darker gray for components

// --------------------------
// FAN GRILL CONSTRUCTION
// --------------------------
const grillMaterial = new THREE.MeshStandardMaterial({ color: accentMaterialColor, roughness: 0.7 });

// Outer grill ring
const outerRingGeometry = new THREE.TorusGeometry(fanDiameter/2, 0.8, 12, 64);
const outerRing = new THREE.Mesh(outerRingGeometry, grillMaterial);
outerRing.rotation.x = Math.PI / 2;
scene.add(outerRing);

// Radial grill spokes
for (let i = 0; i < numGrillRadialSpokes; i++) {
  const angle = (i / numGrillRadialSpokes) * Math.PI * 2;
  const spokeLength = (fanDiameter/2) - (motorHousingRadius + 1);
  const spokeGeometry = new THREE.BoxGeometry(spokeLength, fanGrillThickness, 0.4);
  const spoke = new THREE.Mesh(spokeGeometry, grillMaterial);
  spoke.position.x = Math.cos(angle) * (spokeLength/2 + motorHousingRadius + 1);
  spoke.position.z = Math.sin(angle) * (spokeLength/2 + motorHousingRadius + 1);
  spoke.rotation.y = -angle;
  scene.add(spoke);
}

// Concentric circular grill rings
for (let i = 1; i <= numGrillCircularRings; i++) {
  const ringRadius = motorHousingRadius + 1 + (i * ((fanDiameter/2 - (motorHousingRadius + 1)) / (numGrillCircularRings + 1)));
  const ringGeometry = new THREE.TorusGeometry(ringRadius, fanGrillThickness/2, 8, 64);
  const ring = new THREE.Mesh(ringGeometry, grillMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
}

// --------------------------
// FAN BLADES
// --------------------------
const bladeMaterial = new THREE.MeshStandardMaterial({ color: accentMaterialColor, roughness: 0.6 });
const bladeLength = (fanDiameter/2) - (motorHousingRadius + 2);
for (let i = 0; i < numFanBlades; i++) {
  const angle = (i / numFanBlades) * Math.PI * 2;
  const bladeGeometry = new THREE.BoxGeometry(bladeLength, 0.2, 2.5);
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.y = -0.5;
  blade.position.x = Math.cos(angle) * (bladeLength/2 + motorHousingRadius + 0.5);
  blade.position.z = Math.sin(angle) * (bladeLength/2 + motorHousingRadius + 0.5);
  blade.rotation.y = -angle;
  blade.rotation.z = 0.12; // Slight pitch for fan blade aerodynamics
  scene.add(blade);
}

// --------------------------
// MOTOR HOUSING
// --------------------------
const motorMaterial = new THREE.MeshStandardMaterial({ color: baseMaterialColor, roughness: 0.5 });
const motorGeometry = new THREE.CylinderGeometry(motorHousingRadius, motorHousingRadius, motorHousingHeight, 32);
const motorHousing = new THREE.Mesh(motorGeometry, motorMaterial);
motorHousing.position.y = motorHousingHeight / 2;
scene.add(motorHousing);

// Motor top cap
const motorTopGeometry = new THREE.CylinderGeometry(motorHousingRadius + 0.2, motorHousingRadius + 0.2, 0.8, 32);
const motorTop = new THREE.Mesh(motorTopGeometry, motorMaterial);
motorTop.position.y = motorHousingHeight + 0.4;
scene.add(motorTop);

// --------------------------
// CONNECTING ARM
// --------------------------
const armMaterial = new THREE.MeshStandardMaterial({ color: baseMaterialColor, roughness: 0.55 });

// Hinge block
const hingeGeometry = new THREE.BoxGeometry(3, 3, 4);
const hinge = new THREE.Mesh(hingeGeometry, armMaterial);
hinge.position.set(motorHousingRadius + 1.5, motorHousingHeight * 0.6, 0);
scene.add(hinge);

// Arm cylinder (tapered)
const armGeometry = new THREE.CylinderGeometry(armRadius, armRadius * 0.8, armLength, 16);
const arm = new THREE.Mesh(armGeometry, armMaterial);
const armAngle = -Math.PI / 6; // 30 degree upward tilt
arm.position.set(
  motorHousingRadius + 1.5 + (armLength/2) * Math.cos(-armAngle),
  motorHousingHeight * 0.6 + (armLength/2) * Math.sin(-armAngle),
  0
);
arm.rotation.z = armAngle;
scene.add(arm);

// --------------------------
// SOLAR DISH
// --------------------------
const dishMaterial = new THREE.MeshStandardMaterial({ color: baseMaterialColor, roughness: 0.4, side: THREE.DoubleSide });
const dishGeometry = new THREE.SphereGeometry(solarDishDiameter/2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
dishGeometry.scale(1, 0.4, 1); // Flatten sphere to make shallow parabolic dish
const solarDish = new THREE.Mesh(dishGeometry, dishMaterial);
// Position at end of arm
const armEndX = motorHousingRadius + 1.5 + armLength * Math.cos(-armAngle);
const armEndY = motorHousingHeight * 0.6 + armLength * Math.sin(-armAngle);
solarDish.position.set(
  armEndX + (solarDishDepth/2) * Math.cos(-armAngle),
  armEndY + (solarDishDepth/2) * Math.sin(-armAngle),
  0
);
solarDish.rotation.y = Math.PI / 2;
solarDish.rotation.z = armAngle;
scene.add(solarDish);

// --------------------------
// CAMERA POSITION (matches reference view)
// --------------------------
camera.position.set(55, 45, 55);
camera.lookAt(0, 5, 0);