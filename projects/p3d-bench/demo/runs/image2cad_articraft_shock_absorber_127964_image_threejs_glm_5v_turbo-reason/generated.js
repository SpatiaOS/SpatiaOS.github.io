// ==========================================
// Shock Absorber / Spring Assembly Model
// ==========================================

// Material definition - metallic gray finish
const material = new THREE.MeshStandardMaterial({ 
  color: 0xaaaaaa, 
  metalness: 0.7, 
  roughness: 0.3 
});

// ==========================================
// PARAMETERS
// ==========================================
const totalHeight = 12;
const topMountRadius = 0.8;
const topMountHeight = 1.5;
const gearRadius = 1.8;
const gearHeight = 0.8;
const gearTeethCount = 10;
const gearToothHeight = 0.4;
const springCoils = 7;
const springRadius = 1.2;
const springWireRadius = 0.18;
const mainCylinderRadius = 0.9;
const mainCylinderHeight = 3;
const baseFlangeRadius = 1.6;
const baseFlangeHeight = 0.3;
const bottomMountRadius = 0.7;
const bottomMountHeight = 1.2;

// ==========================================
// TOP MOUNT ASSEMBLY
// ==========================================

// Top cylindrical body
const topBodyGeo = new THREE.CylinderGeometry(topMountRadius * 0.85, topMountRadius, topMountHeight, 32);
const topBody = new THREE.Mesh(topBodyGeo, material);
topBody.position.y = totalHeight / 2 - topMountHeight / 2;
scene.add(topBody);

// Rounded dome on top
const domeGeo = new THREE.SphereGeometry(topMountRadius * 0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const dome = new THREE.Mesh(domeGeo, material);
dome.position.y = totalHeight / 2;
scene.add(dome);

// Side eyelet (mounting point) at top
const eyeletGroup = new THREE.Group();
const eyeletOuter = new THREE.TorusGeometry(0.35, 0.15, 16, 24);
const eyeletMesh = new THREE.Mesh(eyeletOuter, material);
eyeletMesh.rotation.x = Math.PI / 2;
eyeletMesh.position.x = 0.35;
eyeletGroup.add(eyeletMesh);

// Eyelet connector arm
const armGeo = new THREE.BoxGeometry(0.25, 0.5, 0.35);
const armMesh = new THREE.Mesh(armGeo, material);
armMesh.position.set(0.17, 0, 0);
eyeletGroup.add(armMesh);

eyeletGroup.position.set(topMountRadius + 0.1, totalHeight / 2 - topMountHeight * 0.3, 0);
scene.add(eyeletGroup);

// ==========================================
// GEAR / SPROCKET SECTION
// ==========================================

const gearYPos = totalHeight / 2 - topMountHeight - gearHeight / 2 - 0.1;

// Gear central hub
const gearHubGeo = new THREE.CylinderGeometry(gearRadius * 0.75, gearRadius * 0.75, gearHeight, 32);
const gearHub = new THREE.Mesh(gearHubGeo, material);
gearHub.position.y = gearYPos;
scene.add(gearHub);

// Gear teeth (arranged radially)
for (let i = 0; i < gearTeethCount; i++) {
  const angle = (i / gearTeethCount) * Math.PI * 2;
  const toothGeo = new THREE.BoxGeometry(gearToothHeight, gearHeight * 0.9, gearRadius * 0.35);
  const tooth = new THREE.Mesh(toothGeo, material);
  
  const radius = gearRadius * 0.75 + gearToothHeight / 2;
  tooth.position.x = Math.cos(angle) * radius;
  tooth.position.z = Math.sin(angle) * radius;
  tooth.position.y = gearYPos;
  tooth.rotation.y = -angle + Math.PI / 2;
  
  scene.add(tooth);
}

// ==========================================
// HELICAL SPRING
// ==========================================

const springStartY = gearYPos - gearHeight / 2 - 0.2;
const springEndY = -totalHeight / 2 + baseFlangeHeight + mainCylinderHeight + 0.3;
const springLength = springStartY - springEndY;

// Create helix path for spring
const points = [];
const turns = springCoils;
const segmentsPerTurn = 20;
const totalSegments = turns * segmentsPerTurn;

for (let i = 0; i <= totalSegments; i++) {
  const t = i / totalSegments;
  const angle = t * turns * Math.PI * 2;
  const y = springStartY - t * springLength;
  
  points.push(new THREE.Vector3(
    Math.cos(angle) * springRadius,
    y,
    Math.sin(angle) * springRadius
  ));
}

const springPath = new THREE.CatmullRomCurve3(points);
const springGeo = new THREE.TubeGeometry(springPath, totalSegments * 2, springWireRadius, 12, false);
const spring = new THREE.Mesh(springGeo, material);
scene.add(spring);

// Inner rod (visible through spring coils)
const innerRodGeo = new THREE.CylinderGeometry(0.25, 0.25, springLength * 0.7, 16);
const innerRod = new THREE.Mesh(innerRodGeo, material);
innerRod.position.y = (springStartY + springEndY) / 2;
scene.add(innerRod);

// ==========================================
// MAIN CYLINDER BODY
// ==========================================

const mainCylY = springEndY - mainCylinderHeight / 2 - 0.2;
const mainCylinderGeo = new THREE.CylinderGeometry(mainCylinderRadius, mainCylinderRadius * 1.05, mainCylinderHeight, 32);
const mainCylinder = new THREE.Mesh(mainCylinderGeo, material);
mainCylinder.position.y = mainCylY;
scene.add(mainCylinder);

// ==========================================
// BASE FLANGE
// ==========================================

const flangeY = mainCylY - mainCylinderHeight / 2 - baseFlangeHeight / 2;
const flangeGeo = new THREE.CylinderGeometry(baseFlangeRadius, baseFlangeRadius, baseFlangeHeight, 48);
const flange = new THREE.Mesh(flangeGeo, material);
flange.position.y = flangeY;
scene.add(flange);

// Flange detail ring
const ringGeo = new THREE.TorusGeometry(baseFlangeRadius * 0.85, 0.08, 8, 48);
const ring = new THREE.Mesh(ringGeo, material);
ring.rotation.x = Math.PI / 2;
ring.position.y = flangeY;
scene.add(ring);

// ==========================================
// BOTTOM MOUNT
// ==========================================

const bottomY = flangeY - baseFlangeHeight / 2 - bottomMountHeight / 2;

// Bottom cylindrical body
const bottomBodyGeo = new THREE.CylinderGeometry(bottomMountRadius, bottomMountRadius * 1.1, bottomMountHeight, 32);
const bottomBody = new THREE.Mesh(bottomBodyGeo, material);
bottomBody.position.y = bottomY;
scene.add(bottomBody);

// Rounded bottom cap
const bottomCapGeo = new THREE.SphereGeometry(bottomMountRadius * 1.1, 32, 16, Math.PI, Math.PI);
const bottomCap = new THREE.Mesh(bottomCapGeo, material);
bottomCap.position.y = bottomY - bottomMountHeight / 2;
scene.add(bottomCap);

// Bottom eyelet (mounting point)
const bottomEyeletGroup = new THREE.Group();
const bottomEyeletOuter = new THREE.TorusGeometry(0.3, 0.12, 16, 24);
const bottomEyeletMesh = new THREE.Mesh(bottomEyeletOuter, material);
bottomEyeletMesh.rotation.x = Math.PI / 2;
bottomEyeletMesh.position.x = 0.3;
bottomEyeletGroup.add(bottomEyeletMesh);

// Eyelet connector
const bottomArmGeo = new THREE.BoxGeometry(0.22, 0.45, 0.3);
const bottomArmMesh = new THREE.Mesh(bottomArmGeo, material);
bottomArmMesh.position.set(0.15, 0, 0);
bottomEyeletGroup.add(bottomArmMesh);

bottomEyeletGroup.position.set(bottomMountRadius + 0.05, bottomY - bottomMountHeight * 0.2, 0);
bottomEyeletGroup.rotation.z = Math.PI * 0.1; // Slight angle
scene.add(bottomEyeletGroup);

// Second smaller eyelet on opposite side (offset)
const bottomEyeletGroup2 = bottomEyeletGroup.clone();
bottomEyeletGroup2.position.set(-(bottomMountRadius + 0.05), bottomY - bottomMountHeight * 0.3, 0);
bottomEyeletGroup2.rotation.z = -Math.PI * 0.15;
scene.add(bottomEyeletGroup2);

// ==========================================
// CAMERA SETUP
// ==========================================
camera.position.set(10, 6, 10);
camera.lookAt(0, 0, 0);