// ==========================================
// Manual Coffee Grinder - Three.js Geometry
// ==========================================

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xc0c0c0, 
  metalness: 0.6, 
  roughness: 0.3 
});
const darkMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x808080, 
  metalness: 0.7, 
  roughness: 0.2 
});
const handleMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xa0a0a0, 
  metalness: 0.8, 
  roughness: 0.2 
});

// ==========================================
// BASE STRUCTURE
// ==========================================

// Bottom base plate (stepped foundation)
const baseWidth = 9;
const baseDepth = 9;
const baseHeight = 0.8;

const baseGeom = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const base = new THREE.Mesh(baseGeom, darkMaterial);
base.position.y = -baseHeight / 2;
scene.add(base);

// Main body housing (square prism)
const bodyWidth = 7;
const bodyDepth = 7;
const bodyHeight = 5;

const bodyGeom = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
const body = new THREE.Mesh(bodyGeom, bodyMaterial);
body.position.y = bodyHeight / 2;
scene.add(body);

// Top platform (slightly wider than body)
const topPlatformWidth = 8;
const topPlatformDepth = 8;
const topPlatformHeight = 0.6;

const topPlatformGeom = new THREE.BoxGeometry(topPlatformWidth, topPlatformHeight, topPlatformDepth);
const topPlatform = new THREE.Mesh(topPlatformGeom, bodyMaterial);
topPlatform.position.y = bodyHeight + topPlatformHeight / 2;
scene.add(topPlatform);

// ==========================================
// DRAWER
// ==========================================

const drawerWidth = 4.2;
const drawerHeight = 2.8;
const drawerDepth = 0.7;
const drawerY = 1.8; // Height from bottom of body

const drawerGeom = new THREE.BoxGeometry(drawerWidth, drawerHeight, drawerDepth);
const drawer = new THREE.Mesh(drawerGeom, bodyMaterial);
drawer.position.set(0, drawerY, bodyDepth / 2 + drawerDepth / 2 - 0.05);
scene.add(drawer);

// Drawer faceplate border (slightly larger frame effect)
const faceplateGeom = new THREE.BoxGeometry(drawerWidth + 0.2, drawerHeight + 0.2, 0.15);
const faceplate = new THREE.Mesh(faceplateGeom, darkMaterial);
faceplate.position.set(0, drawerY, bodyDepth / 2 + drawerDepth + 0.05);
scene.add(faceplate);

// Drawer knob
const knobRadius = 0.35;
const knobHeight = 0.4;
const knobGeom = new THREE.CylinderGeometry(knobRadius, knobRadius * 0.9, knobHeight, 16);
const knob = new THREE.Mesh(knobGeom, handleMaterial);
knob.rotation.x = Math.PI / 2;
knob.position.set(0, drawerY - 0.6, bodyDepth / 2 + drawerDepth + knobHeight / 2 + 0.05);
scene.add(knob);

// ==========================================
// HOPPER (Coffee Bean Container)
// ==========================================

const hopperBottomRadius = 3.4;
const hopperTopRadius = 4.4;
const hopperHeight = 4.2;
const hopperSegments = 48;

// Main hopper body (frustum/truncated cone)
const hopperGeom = new THREE.CylinderGeometry(
  hopperTopRadius, 
  hopperBottomRadius, 
  hopperHeight, 
  hopperSegments
);
const hopper = new THREE.Mesh(hopperGeom, bodyMaterial);
hopper.position.y = bodyHeight + topPlatformHeight + hopperHeight / 2;
scene.add(hopper);

// Hopper top rim (thickened edge)
const rimHeight = 0.35;
const rimOuterRadius = hopperTopRadius + 0.25;
const rimInnerRadius = hopperTopRadius - 0.15;
const rimGeom = new THREE.RingGeometry(rimInnerRadius, rimOuterRadius, hopperSegments);
// Convert ring to extruded shape or use torus-like approach - using thin cylinder instead
const rimGeomAlt = new THREE.CylinderGeometry(rimOuterRadius, rimOuterRadius, rimHeight, hopperSegments, 1, true);
const rim = new THREE.Mesh(rimGeomAlt, darkMaterial);
rim.position.y = bodyHeight + topPlatformHeight + hopperHeight + rimHeight / 2 - 0.1;
scene.add(rim);

// Inner hopper wall (visible interior)
const innerHopperGeom = new THREE.CylinderGeometry(
  hopperTopRadius - 0.2, 
  hopperBottomRadius - 0.2, 
  hopperHeight - 0.3, 
  hopperSegments
);
const innerHopper = new THREE.Mesh(innerHopperGeom, darkMaterial);
innerHopper.position.y = bodyHeight + topPlatformHeight + hopperHeight / 2;
scene.add(innerHopper);

// Hopper base ring (where it meets platform)
const baseRingGeom = new THREE.TorusGeometry(hopperBottomRadius + 0.15, 0.2, 8, hopperSegments);
const baseRing = new THREE.Mesh(baseRingGeom, darkMaterial);
baseRing.rotation.x = Math.PI / 2;
baseRing.position.y = bodyHeight + topPlatformHeight + 0.1;
scene.add(baseRing);

// ==========================================
// GRINDING MECHANISM & HANDLE
// ==========================================

const mechanismY = bodyHeight + topPlatformHeight + hopperHeight * 0.4;

// Central shaft (vertical post)
const shaftRadius = 0.55;
const shaftHeight = 2.8;
const shaftGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 24);
const shaft = new THREE.Mesh(shaftGeom, handleMaterial);
shaft.position.set(0, mechanismY + shaftHeight / 2, 0);
scene.add(shaft);

// Shaft cap/top nut
const nutRadius = 0.4;
const nutHeight = 0.35;
const nutGeom = new THREE.CylinderGeometry(nutRadius, nutRadius, nutHeight, 6); // Hexagonal look
const nut = new THREE.Mesh(nutGeom, darkMaterial);
nut.position.set(0, mechanismY + shaftHeight + nutHeight / 2, 0);
scene.add(nut);

// Handle mounting bracket
const bracketWidth = 1.2;
const bracketThickness = 0.25;
const bracketLength = 1.0;
const bracketGeom = new THREE.BoxGeometry(bracketThickness, bracketWidth, bracketLength);
const bracket = new THREE.Mesh(bracketGeom, handleMaterial);
bracket.position.set(0.1, mechanismY + shaftHeight * 0.75, 0);
bracket.rotation.y = Math.PI / 6;
scene.add(bracket);

// Crank arm (horizontal bar)
const crankLength = 3.2;
const crankWidth = 0.45;
const crankThickness = 0.28;
const crankGeom = new THREE.BoxGeometry(crankLength, crankThickness, crankWidth);
const crank = new THREE.Mesh(crankGeom, handleMaterial);
crank.position.set(
  crankLength / 2 + 0.3, 
  mechanismY + shaftHeight * 0.75, 
  0.2
);
crank.rotation.z = -Math.PI / 12; // Slight downward angle
crank.rotation.y = Math.PI / 16; // Slight twist
scene.add(crank);

// Handle knob (grip)
const handleKnobRadius = 0.55;
const handleKnobGeom = new THREE.SphereGeometry(handleKnobRadius, 20, 16);
const handleKnob = new THREE.Mesh(handleKnobGeom, handleMaterial);
handleKnob.position.set(
  crankLength + 0.5, 
  mechanismY + shaftHeight * 0.75 - 0.4, 
  0.4
);
scene.add(handleKnob);

// Handle knob base (where it connects to crank)
const knobBaseRadius = 0.35;
const knobBaseHeight = 0.3;
const knobBaseGeom = new THREE.CylinderGeometry(knobBaseRadius, knobBaseRadius * 0.8, knobBaseHeight, 16);
const knobBase = new THREE.Mesh(knobBaseGeom, handleMaterial);
knobBase.rotation.x = Math.PI / 2;
knobBase.rotation.z = Math.PI / 12;
knobBase.position.set(
  crankLength + 0.1, 
  mechanismY + shaftHeight * 0.75 - 0.15, 
  0.3
);
scene.add(knobBase);

// ==========================================
// CAMERA POSITIONING
// ==========================================

camera.position.set(14, 12, 14);
camera.lookAt(0, 4, 0);