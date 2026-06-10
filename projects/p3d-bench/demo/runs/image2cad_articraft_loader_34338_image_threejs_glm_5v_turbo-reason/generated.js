// ==========================================
// BULLDOZER / CONSTRUCTION VEHICLE MODEL
// ==========================================

// --- Parameters ---
const params = {
  // Main chassis
  bodyLength: 9,
  bodyWidth: 5.5,
  bodyHeight: 2.8,
  
  // Cabin
  cabinWidth: 3.8,
  cabinDepth: 3.2,
  cabinHeight: 3.2,
  cabinRoofOverhang: 0.3,
  
  // Wheels (4 total, 2 per side visible)
  wheelRadius: 2.0,
  wheelWidth: 1.4,
  wheelTeeth: 16,
  toothDepth: 0.35,
  
  // Front blade/scoop
  bladeWidth: 7,
  bladeHeight: 4,
  bladeDepth: 0.4,
  bladeAngle: Math.PI / 6, // 30 degree tilt
  
  // Hydraulic arms
  armRadius: 0.25,
  
  // Exhaust pipe
  exhaustRadius: 0.35,
  exhaustHeight: 1.8
};

// Material - uniform gray metallic appearance
const bodyMat = new THREE.MeshStandardMaterial({ 
  color: 0x8a8a8a, 
  metalness: 0.4, 
  roughness: 0.5 
});

const darkMat = new THREE.MeshStandardMaterial({ 
  color: 0x505050, 
  metalness: 0.3, 
  roughness: 0.6 
});

// --- Helper: Create toothed wheel ---
function createWheel() {
  const group = new THREE.Group();
  
  // Main wheel disc
  const discGeom = new THREE.CylinderGeometry(
    params.wheelRadius * 0.75, 
    params.wheelRadius * 0.75, 
    params.wheelWidth, 
    32
  );
  const disc = new THREE.Mesh(discGeom, bodyMat);
  disc.rotation.x = Math.PI / 2;
  group.add(disc);
  
  // Outer ring with teeth/treads
  const toothShape = new THREE.Shape();
  const rOuter = params.wheelRadius;
  const rInner = params.wheelRadius - params.toothDepth;
  const teeth = params.wheelTeeth;
  
  for (let i = 0; i < teeth; i++) {
    const angle1 = (i / teeth) * Math.PI * 2;
    const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;
    
    if (i === 0) {
      toothShape.moveTo(Math.cos(angle1) * rOuter, Math.sin(angle1) * rOuter);
    }
    
    toothShape.lineTo(Math.cos(angle2) * rOuter, Math.sin(angle2) * rOuter);
    toothShape.lineTo(Math.cos(angle3) * rInner, Math.sin(angle3) * rInner);
    toothShape.lineTo(Math.cos(angle4) * rInner, Math.sin(angle4) * rInner);
    toothShape.lineTo(Math.cos(((i + 1) / teeth) * Math.PI * 2) * rOuter, 
                      Math.sin(((i + 1) / teeth) * Math.PI * 2) * rOuter);
  }
  
  const extrudeSettings = { depth: params.wheelWidth, bevelEnabled: false };
  const treadGeom = new THREE.ExtrudeGeometry(toothShape, extrudeSettings);
  const tread = new THREE.Mesh(treadGeom, darkMat);
  tread.position.z = -params.wheelWidth / 2;
  group.add(tread);
  
  // Center hub
  const hubGeom = new THREE.CylinderGeometry(0.5, 0.5, params.wheelWidth + 0.2, 16);
  const hub = new THREE.Mesh(hubGeom, bodyMat);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);
  
  return group;
}

// --- Build Vehicle ---

// 1. WHEELS (4 positions)
const wheelPositions = [
  { x: 2.5, z: params.bodyWidth/2 + 0.2 },   // Front right
  { x: -2.5, z: params.bodyWidth/2 + 0.2 },  // Rear right
  { x: 2.5, z: -params.bodyWidth/2 - 0.2 },  // Front left
  { x: -2.5, z: -params.bodyWidth/2 - 0.2 }  // Rear left
];

wheelPositions.forEach(pos => {
  const wheel = createWheel();
  wheel.position.set(pos.x, params.wheelRadius, pos.z);
  scene.add(wheel);
});

// 2. MAIN BODY / CHASSIS
const bodyGeom = new THREE.BoxGeometry(
  params.bodyLength, 
  params.bodyHeight, 
  params.bodyWidth
);
const body = new THREE.Mesh(bodyGeom, bodyMat);
body.position.set(0, params.wheelRadius + params.bodyHeight/2, 0);
scene.add(body);

// Body top deck (slightly larger platform)
const deckGeom = new THREE.BoxGeometry(
  params.bodyLength * 0.85, 
  0.3, 
  params.bodyWidth * 1.05
);
const deck = new THREE.Mesh(deckGeom, bodyMat);
deck.position.set(
  0.5, 
  params.wheelRadius + params.bodyHeight + 0.15, 
  0
);
scene.add(deck);

// 3. CABIN
const cabinGroup = new THREE.Group();

// Main cabin box
const cabinGeom = new THREE.BoxGeometry(
  params.cabinWidth, 
  params.cabinHeight, 
  params.cabinDepth
);
const cabin = new THREE.Mesh(cabinGeom, bodyMat);
cabinGroup.add(cabin);

// Roof (overhanging)
const roofGeom = new THREE.BoxGeometry(
  params.cabinWidth + params.cabinRoofOverhang * 2, 
  0.25, 
  params.cabinDepth + params.cabinRoofOverhang * 2
);
const roof = new THREE.Mesh(roofGeom, bodyMat);
roof.position.y = params.cabinHeight/2 + 0.125;
cabinGroup.add(roof);

// Window openings (represented as darker recessed panels)
const windowMat = new THREE.MeshStandardMaterial({ 
  color: 0x333333, 
  metalness: 0.1, 
  roughness: 0.2 
});

// Front window
const frontWindowGeom = new THREE.BoxGeometry(params.cabinWidth * 0.7, 1.4, 0.15);
const frontWindow = new THREE.Mesh(frontWindowGeom, windowMat);
frontWindow.position.set(0, 0.3, params.cabinDepth/2 + 0.05);
cabinGroup.add(frontWindow);

// Side windows (left and right)
const sideWindowGeom = new THREE.BoxGeometry(0.15, 1.4, params.cabinDepth * 0.6);
[-1, 1].forEach(side => {
  const sideWindow = new THREE.Mesh(sideWindowGeom, windowMat);
  sideWindow.position.set(side * (params.cabinWidth/2 + 0.05), 0.3, 0.2);
  cabinGroup.add(sideWindow);
});

// Rear window
const rearWindowGeom = new THREE.BoxGeometry(params.cabinWidth * 0.5, 1.2, 0.15);
const rearWindow = new THREE.Mesh(rearWindowGeom, windowMat);
rearWindow.position.set(0, 0.2, -params.cabinDepth/2 - 0.05);
cabinGroup.add(rearWindow);

cabinGroup.position.set(
  1.5, 
  params.wheelRadius + params.bodyHeight + 0.3 + params.cabinHeight/2, 
  0
);
scene.add(cabinGroup);

// 4. EXHAUST PIPE
const exhaustGeom = new THREE.CylinderGeometry(
  params.exhaustRadius, 
  params.exhaustRadius, 
  params.exhaustHeight, 
  16
);
const exhaust = new THREE.Mesh(exhaustGeom, bodyMat);
exhaust.position.set(
  3.2, 
  params.wheelRadius + params.bodyHeight + 0.3 + params.exhaustHeight/2, 
  1.5
);
scene.add(exhaust);

// Small cap on exhaust
const capGeom = new THREE.CylinderGeometry(
  params.exhaustRadius * 0.7, 
  params.exhaustRadius * 0.9, 
  0.2, 
  16
);
const cap = new THREE.Mesh(capGeom, darkMat);
cap.position.set(
  3.2, 
  params.wheelRadius + params.bodyHeight + 0.3 + params.exhaustHeight + 0.1, 
  1.5
);
scene.add(cap);

// 5. FRONT BLADE / SCOPE
const bladeGroup = new THREE.Group();

// Main blade plate (angled)
const bladeShape = new THREE.Shape();
bladeShape.moveTo(-params.bladeWidth/2, 0);
bladeShape.lineTo(params.bladeWidth/2, 0);
bladeShape.lineTo(params.bladeWidth/2, params.bladeHeight);
bladeShape.lineTo(-params.bladeWidth/2, params.bladeHeight);
bladeShape.closePath();

const bladeExtrudeSettings = { depth: params.bladeDepth, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 };
const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, bladeExtrudeSettings);
const blade = new THREE.Mesh(bladeGeom, bodyMat);
blade.rotation.x = params.bladeAngle;
blade.position.z = -params.bladeDepth/2;
bladeGroup.add(blade);

// Blade side reinforcements
const reinforceGeom = new THREE.BoxGeometry(0.3, params.bladeHeight * 0.8, params.bladeDepth + 0.4);
[-1, 1].forEach(side => {
  const reinforce = new THREE.Mesh(reinforceGeom, darkMat);
  reinforce.position.set(side * (params.bladeWidth/2 - 0.15), params.bladeHeight * 0.4, 0);
  bladeGroup.add(reinforce);
});

// Position blade in front of vehicle
bladeGroup.position.set(
  params.bodyLength/2 + params.bladeHeight * Math.sin(params.bladeAngle) + 0.5, 
  params.wheelRadius + params.bladeHeight/2 * Math.cos(params.bladeAngle) - 0.5, 
  0
);
scene.add(bladeGroup);

// 6. HYDRAULIC ARM ASSEMBLY
function createHydraulicCylinder(length) {
  const group = new THREE.Group();
  
  // Outer cylinder
  const outerGeom = new THREE.CylinderGeometry(params.armRadius * 1.4, params.armRadius * 1.4, length * 0.6, 12);
  const outer = new THREE.Mesh(outerGeom, darkMat);
  group.add(outer);
  
  // Inner rod
  const rodGeom = new THREE.CylinderGeometry(params.armRadius * 0.8, params.armRadius * 0.8, length * 0.5, 12);
  const rod = new THREE.Mesh(rodGeom, bodyMat);
  rod.position.y = length * 0.55;
  group.add(rod);
  
  return group;
}

// Upper hydraulic arms (from body to blade top)
const upperArmLength = 4;
const upperArmLeft = createHydraulicCylinder(upperArmLength);
upperArmLeft.rotation.z = Math.PI / 2 + 0.3;
upperArmLeft.rotation.y = 0.2;
upperArmLeft.position.set(
  1.5,
  params.wheelRadius + params.bodyHeight + 0.5,
  params.bodyWidth/2 - 0.5
);
scene.add(upperArmLeft);

const upperArmRight = createHydraulicCylinder(upperArmLength);
upperArmRight.rotation.z = Math.PI / 2 + 0.3;
upperArmRight.rotation.y = -0.2;
upperArmRight.position.set(
  1.5,
  params.wheelRadius + params.bodyHeight + 0.5,
  -params.bodyWidth/2 + 0.5
);
scene.add(upperArmRight);

// Lower support arms
const lowerArmGeom = new THREE.BoxGeometry(5, 0.5, 0.6);
const lowerArmLeft = new THREE.Mesh(lowerArmGeom, bodyMat);
lowerArmLeft.position.set(
  params.bodyLength/2 - 0.5,
  params.wheelRadius + 1.5,
  params.bodyWidth/2 - 0.3
);
lowerArmLeft.rotation.z = 0.4;
scene.add(lowerArmLeft);

const lowerArmRight = new THREE.Mesh(lowerArmGeom, bodyMat);
lowerArmRight.position.set(
  params.bodyLength/2 - 0.5,
  params.wheelRadius + 1.5,
  -params.bodyWidth/2 + 0.3
);
lowerArmRight.rotation.z = 0.4;
scene.add(lowerArmRight);

// 7. ADDITIONAL DETAILS

// Riser steps on front (ladder-like structure)
for (let i = 0; i < 3; i++) {
  const stepGeom = new THREE.BoxGeometry(1.8, 0.15, 0.4);
  const step = new THREE.Mesh(stepGeom, darkMat);
  step.position.set(
    -0.5 + i * 0.8,
    params.wheelRadius + 0.5 + i * 0.6,
    params.bodyWidth/2 + 0.2
  );
  scene.add(step);
}

// Small details on cabin roof (vents/antenna base)
const ventGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 8);
const vent = new THREE.Mesh(ventGeom, darkMat);
vent.position.set(
  0.5,
  params.wheelRadius + params.bodyHeight + 0.3 + params.cabinHeight + 0.45,
  -0.8
);
scene.add(vent);

// --- Camera Setup ---
camera.position.set(18, 14, 18);
camera.lookAt(0, params.wheelRadius + 2, 0);