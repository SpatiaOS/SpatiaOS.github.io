// Parameters (measured in mm, based on mechanical part proportions)
// Base plate dimensions
const baseThickness = 8;
const baseLength = 120;
const baseWidth = 60;
const baseCutoutRadius = 15;

// Spherical handle parameters
const handleSphereRadius = 18;
const handleBaseRadius = 12;
const handleBaseHeight = 10;
const handleSphereOffset = 50; // distance from center to each handle

// Central posts
const mainPostHeight = 40;
const mainPostRadius = 8;
const secondaryPostHeight = 25;
const secondaryPostRadius = 6;

// Adjustment screw & knob
const screwLength = 35;
const screwRadius = 3;
const adjustmentKnobRadius = 12;
const adjustmentKnobHeight = 6;

// Materials (using standard material for mechanical look)
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.3, roughness: 0.6 });
const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.4 });
const screwMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.7, roughness: 0.3 });
const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.4, roughness: 0.5 });

// 1. Main Base Plate (custom extruded shape)
const baseShape = new THREE.Shape();
// Draw the contoured base shape
baseShape.moveTo(-baseLength/2, -baseWidth/2);
baseShape.lineTo(baseLength/2, -baseWidth/2);
baseShape.quadraticCurveTo(baseLength/2 + 10, 0, baseLength/2, baseWidth/2);
baseShape.lineTo(-baseLength/2, baseWidth/2);
baseShape.quadraticCurveTo(-baseLength/2 - 10, 0, -baseLength/2, -baseWidth/2);

// Add cutout in the center
const cutoutPath = new THREE.Path();
cutoutPath.absarc(0, 0, baseCutoutRadius, 0, Math.PI*2, true);
baseShape.holes.push(cutoutPath);

const baseExtrudeSettings = {
  steps: 1,
  depth: baseThickness,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelSegments: 3
};
const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
baseMesh.position.set(0, 0, -baseThickness/2); // center the base
baseMesh.rotation.x = Math.PI/2; // lay flat on XY plane
scene.add(baseMesh);

// 2. Spherical Handle Assemblies (two identical, mirrored)
function createHandle(xPos) {
  const handleGroup = new THREE.Group();
  
  // Handle base cylinder
  const baseCylGeo = new THREE.CylinderGeometry(handleBaseRadius, handleBaseRadius, handleBaseHeight, 24);
  const baseCyl = new THREE.Mesh(baseCylGeo, handleMaterial);
  baseCyl.position.y = handleBaseHeight/2;
  handleGroup.add(baseCyl);
  
  // Sphere knob
  const sphereGeo = new THREE.SphereGeometry(handleSphereRadius, 32, 32);
  const sphere = new THREE.Mesh(sphereGeo, handleMaterial);
  sphere.position.y = handleBaseHeight + handleSphereRadius;
  handleGroup.add(sphere);
  
  // Position the handle on the base
  handleGroup.position.set(xPos, baseThickness/2, 0);
  scene.add(handleGroup);
}

// Add left and right handles
createHandle(-handleSphereOffset);
createHandle(handleSphereOffset);

// 3. Central Main Post
const mainPostGeo = new THREE.CylinderGeometry(mainPostRadius, mainPostRadius, mainPostHeight, 24);
const mainPost = new THREE.Mesh(mainPostGeo, screwMaterial);
mainPost.position.set(0, baseThickness/2 + mainPostHeight/2, 0);
scene.add(mainPost);

// 4. Secondary Post with Adjustment Screw
const secondaryPostGeo = new THREE.CylinderGeometry(secondaryPostRadius, secondaryPostRadius, secondaryPostHeight, 24);
const secondaryPost = new THREE.Mesh(secondaryPostGeo, screwMaterial);
secondaryPost.position.set(20, baseThickness/2 + secondaryPostHeight/2, 0);
scene.add(secondaryPost);

// Adjustment Screw & Knob
const screwGeo = new THREE.CylinderGeometry(screwRadius, screwRadius, screwLength, 16);
const screw = new THREE.Mesh(screwGeo, screwMaterial);
screw.position.set(20, baseThickness/2 + secondaryPostHeight + screwLength/2, 0);
scene.add(screw);

// Knurled adjustment knob
const knobGeo = new THREE.CylinderGeometry(adjustmentKnobRadius, adjustmentKnobRadius, adjustmentKnobHeight, 24);
const knob = new THREE.Mesh(knobGeo, knobMaterial);
knob.position.set(20, baseThickness/2 + secondaryPostHeight + screwLength + adjustmentKnobHeight/2, 0);
scene.add(knob);

// Add knurling effect (simple torus to simulate texture)
const knurlGeo = new THREE.TorusGeometry(adjustmentKnobRadius - 1, 0.5, 8, 24);
const knurl = new THREE.Mesh(knurlGeo, knobMaterial);
knurl.position.copy(knob.position);
knurl.rotation.x = Math.PI/2;
scene.add(knurl);

// 5. Small Side Screw (left side)
const sideScrewGeo = new THREE.CylinderGeometry(2, 2, 15, 12);
const sideScrew = new THREE.Mesh(sideScrewGeo, screwMaterial);
sideScrew.position.set(-30, baseThickness/2 + 7.5, 0);
scene.add(sideScrew);

// Adjust camera to view the entire assembly
camera.position.set(150, 100, 150);
camera.lookAt(0, 0, 0);