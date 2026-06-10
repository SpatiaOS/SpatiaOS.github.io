// Parameters
const shaftRadius = 1.2;
const shaftHeight = 36;
const springRadius = 4.5;
const springWireRadius = 0.8;
const springCoils = 7;
const springHeight = 22;
const topGearRadius = 5.5;
const topGearTeeth = 8;
const mountEyeletRadius = 2.5;
const mountEyeletThickness = 1.5;

// Material
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  metalness: 0.8,
  roughness: 0.3
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.5,
  roughness: 0.5
});

// 1. Central Shaft
const shaftGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 32);
const shaft = new THREE.Mesh(shaftGeometry, metalMaterial);
scene.add(shaft);

// 2. Helical Spring
// Generate points for a helix
const points = [];
const segments = 200;
for (let i = 0; i <= segments; i++) {
  const t = i / segments;
  const angle = t * Math.PI * 2 * springCoils;
  const x = Math.cos(angle) * springRadius;
  const y = (t - 0.5) * springHeight; // Center vertically
  const z = Math.sin(angle) * springRadius;
  points.push(new THREE.Vector3(x, y, z));
}

const helixCurve = new THREE.CatmullRomCurve3(points);
const springGeometry = new THREE.TubeGeometry(helixCurve, segments * 2, springWireRadius, 16, false);
const spring = new THREE.Mesh(springGeometry, metalMaterial);
scene.add(spring);

// 3. Top Assembly
const topGroup = new THREE.Group();

// Top Gear / Sprocket
const gearBaseGeo = new THREE.CylinderGeometry(topGearRadius - 1, topGearRadius - 1, 2, 32);
const gearBase = new THREE.Mesh(gearBaseGeo, metalMaterial);
gearBase.position.y = shaftHeight / 2 - 2;
topGroup.add(gearBase);

// Gear Teeth
for (let i = 0; i < topGearTeeth; i++) {
  const angle = (i / topGearTeeth) * Math.PI * 2;
  const toothGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
  const tooth = new THREE.Mesh(toothGeo, metalMaterial);
  
  // Position tooth on the circumference
  const toothX = Math.cos(angle) * (topGearRadius - 0.5);
  const toothZ = Math.sin(angle) * (topGearRadius - 0.5);
  
  tooth.position.set(toothX, shaftHeight / 2 - 2, toothZ);
  tooth.rotation.y = -angle; // Rotate to face outward
  topGroup.add(tooth);
}

// Top Housing Cylinder
const topHousingGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
const topHousing = new THREE.Mesh(topHousingGeo, metalMaterial);
topHousing.position.y = shaftHeight / 2 + 2;
topGroup.add(topHousing);

// Top Eyelet (Mounting point)
// Approximated as a cylinder with a hole (using a dark cylinder inside to simulate hole)
const eyeletGeo = new THREE.CylinderGeometry(mountEyeletRadius, mountEyeletRadius, mountEyeletThickness, 32);
const topEyelet = new THREE.Mesh(eyeletGeo, metalMaterial);
topEyelet.rotation.z = Math.PI / 2; // Rotate to be horizontal
topEyelet.position.y = shaftHeight / 2 + 4;
topGroup.add(topEyelet);

// Fake hole for top eyelet
const holeGeo = new THREE.CylinderGeometry(0.8, 0.8, mountEyeletThickness + 0.1, 16);
const topHole = new THREE.Mesh(holeGeo, darkMaterial);
topHole.rotation.z = Math.PI / 2;
topHole.position.y = shaftHeight / 2 + 4;
topGroup.add(topHole);

scene.add(topGroup);

// 4. Bottom Assembly
const bottomGroup = new THREE.Group();

// Bottom Flange / Base
const baseGeo = new THREE.CylinderGeometry(4, 4, 1, 32);
const base = new THREE.Mesh(baseGeo, metalMaterial);
base.position.y = -shaftHeight / 2 + 1;
bottomGroup.add(base);

// Bottom Eyelet
const bottomEyelet = new THREE.Mesh(eyeletGeo, metalMaterial);
bottomEyelet.rotation.z = Math.PI / 2;
bottomEyelet.position.y = -shaftHeight / 2 - 1;
bottomGroup.add(bottomEyelet);

// Fake hole for bottom eyelet
const bottomHole = new THREE.Mesh(holeGeo, darkMaterial);
bottomHole.rotation.z = Math.PI / 2;
bottomHole.position.y = -shaftHeight / 2 - 1;
bottomGroup.add(bottomHole);

// Bottom Damper Body (visible inside spring at bottom)
const damperBodyGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
const damperBody = new THREE.Mesh(damperBodyGeo, metalMaterial);
damperBody.position.y = -shaftHeight / 2 + 6;
bottomGroup.add(damperBody);

scene.add(bottomGroup);

// Adjust camera
camera.position.set(20, 10, 20);
camera.lookAt(0, 0, 0);