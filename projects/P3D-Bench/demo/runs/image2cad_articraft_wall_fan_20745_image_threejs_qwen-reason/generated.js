// Parameters
const baseRadius = 12;
const baseThickness = 1.5;
const housingRadius = 3.5;
const housingHeight = 4;
const armLength = 9;
const armRadiusStart = 1.2;
const armRadiusEnd = 2.0;
const dishRadius = 7;
const dishDepth = 4;

// Materials
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xd0d0d0,
  metalness: 0.6,
  roughness: 0.4,
  side: THREE.DoubleSide
});

const darkMetalMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  metalness: 0.8,
  roughness: 0.3
});

// --- Base Assembly (The large circular "UFO" part) ---
const baseGroup = new THREE.Group();

// Main base disc
const baseDiscGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseThickness, 64);
const baseDisc = new THREE.Mesh(baseDiscGeo, metalMaterial);
baseDisc.position.y = -baseThickness / 2;
baseGroup.add(baseDisc);

// Radial bars (The "spokes" of the grid)
const numRadialBars = 48;
const barWidth = 0.15;
const barHeight = 0.8;
for (let i = 0; i < numRadialBars; i++) {
  const angle = (i / numRadialBars) * Math.PI * 2;
  const barGeo = new THREE.BoxGeometry(baseRadius - housingRadius - 0.5, barHeight, barWidth);
  const bar = new THREE.Mesh(barGeo, metalMaterial);
  
  // Position bar halfway between housing and edge
  bar.position.x = Math.cos(angle) * (housingRadius + (baseRadius - housingRadius) / 2);
  bar.position.z = Math.sin(angle) * (housingRadius + (baseRadius - housingRadius) / 2);
  bar.position.y = 0.2; // Slightly above base
  bar.rotation.y = -angle;
  baseGroup.add(bar);
}

// Concentric rings
const numRings = 5;
for (let i = 1; i <= numRings; i++) {
  const r = housingRadius + (baseRadius - housingRadius) * (i / numRings);
  const ringGeo = new THREE.TorusGeometry(r, 0.1, 8, 64);
  const ring = new THREE.Mesh(ringGeo, metalMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.2;
  baseGroup.add(ring);
}

// Bottom edge fins/details
const numFins = 60;
for (let i = 0; i < numFins; i++) {
  const angle = (i / numFins) * Math.PI * 2;
  const finGeo = new THREE.BoxGeometry(0.2, 0.5, 0.4);
  const fin = new THREE.Mesh(finGeo, metalMaterial);
  fin.position.x = Math.cos(angle) * (baseRadius - 0.2);
  fin.position.z = Math.sin(angle) * (baseRadius - 0.2);
  fin.position.y = -baseThickness;
  fin.rotation.y = -angle;
  baseGroup.add(fin);
}

scene.add(baseGroup);

// --- Central Housing ---
const housingGroup = new THREE.Group();

// Main cylinder
const housingGeo = new THREE.CylinderGeometry(housingRadius, housingRadius, housingHeight, 32);
const housing = new THREE.Mesh(housingGeo, metalMaterial);
housing.position.y = housingHeight / 2;
housingGroup.add(housing);

// Top plate details (vents/latches)
const topPlateGeo = new THREE.CylinderGeometry(housingRadius - 0.2, housingRadius - 0.2, 0.2, 32);
const topPlate = new THREE.Mesh(topPlateGeo, darkMetalMaterial);
topPlate.position.y = housingHeight;
housingGroup.add(topPlate);

// Rectangular vent/detail on top
const ventGeo = new THREE.BoxGeometry(2, 0.1, 4);
const vent = new THREE.Mesh(ventGeo, darkMetalMaterial);
vent.position.y = housingHeight + 0.15;
housingGroup.add(vent);

// Small slots on top
for(let k=0; k<3; k++) {
    const slotGeo = new THREE.BoxGeometry(0.2, 0.1, 1.5);
    const slot = new THREE.Mesh(slotGeo, darkMetalMaterial);
    slot.position.set(1.5, housingHeight + 0.15, -1 + k * 1);
    housingGroup.add(slot);
}

scene.add(housingGroup);

// --- Spotlight Assembly ---
const spotlightGroup = new THREE.Group();

// Position the spotlight group at the side of the housing, slightly up
spotlightGroup.position.set(housingRadius + 1, housingHeight * 0.6, 0);

// Pivot Bracket (connects housing to arm)
const bracketGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
const bracket = new THREE.Mesh(bracketGeo, metalMaterial);
spotlightGroup.add(bracket);

// Pivot Cylinder
const pivotGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
const pivot = new THREE.Mesh(pivotGeo, darkMetalMaterial);
pivot.rotation.z = Math.PI / 2;
spotlightGroup.add(pivot);

// Arm (Tapered cylinder)
const armGeo = new THREE.CylinderGeometry(armRadiusStart, armRadiusEnd, armLength, 16);
const arm = new THREE.Mesh(armGeo, metalMaterial);
arm.position.y = armLength / 2; // Extend upwards/outwards
spotlightGroup.add(arm);

// Dish (Reflector) - Using LatheGeometry
// Profile points relative to the end of the arm
const dishPoints = [];
// Start at the back center
dishPoints.push(new THREE.Vector2(0, 0)); 
// Curve out to the rim
dishPoints.push(new THREE.Vector2(2, 1));
dishPoints.push(new THREE.Vector2(dishRadius - 1, dishDepth - 1));
dishPoints.push(new THREE.Vector2(dishRadius, dishDepth));
// Rim thickness
dishPoints.push(new THREE.Vector2(dishRadius, dishDepth + 0.3));
// Back to axis
dishPoints.push(new THREE.Vector2(0, dishDepth + 0.3));

const dishGeo = new THREE.LatheGeometry(dishPoints, 32);
const dish = new THREE.Mesh(dishGeo, metalMaterial);
dish.position.y = armLength; // At the end of the arm
spotlightGroup.add(dish);

// Thin rod/antenna sticking out of the dish
const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 12, 8);
const rod = new THREE.Mesh(rodGeo, darkMetalMaterial);
rod.position.y = armLength + dishDepth / 2;
spotlightGroup.add(rod);

// Rotate the entire spotlight assembly to match the image angle
// It points up and to the right
spotlightGroup.rotation.z = -Math.PI / 4; // Tilt up
spotlightGroup.rotation.y = -Math.PI / 4; // Rotate around vertical axis

scene.add(spotlightGroup);

// Adjust camera
camera.position.set(25, 20, 25);
camera.lookAt(0, 2, 0);