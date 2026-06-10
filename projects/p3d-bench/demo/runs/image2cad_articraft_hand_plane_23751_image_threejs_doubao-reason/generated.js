// Recreation of Stanley No. 71 Router Plane (hand woodworking tool)
// --------------------------
// Parameters
// --------------------------
// Base plate dimensions
const baseLength = 22;
const baseWidth = 10;
const baseThickness = 0.8;

// Handle parameters (identical left/right)
const handleDiameter = 3.2;
const handleHeight = 3.8;
const handleBaseDiameter = 2.4;
const handleBaseHeight = 0.6;

// Left fence post parameters
const fencePostDiameter = 0.8;
const fencePostHeight = 4.6;
const fencePostBaseDiameter = 1.4;
const fencePostBaseHeight = 0.5;

// Main central post assembly parameters
const mainPostDiameter = 1.1;
const mainPostHeight = 6.2;
const mainClampDiameter = 3.0;
const mainClampThickness = 1.0;

// Adjustment hardware parameters
const thumbWheelDiameter = 1.6;
const thumbWheelThickness = 0.3;
const screwDiameter = 0.4;
const topScrewHeight = 2.0;
const topScrewKnobDiameter = 1.0;

// Cast steel material for all tool components
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xC6C6C6,
  metalness: 0.65,
  roughness: 0.35
});

// --------------------------
// Base Plate Construction
// --------------------------
const baseShape = new THREE.Shape();
// Simplified symmetrical base outline matching the original tool shape
baseShape.moveTo(-baseLength/2, 0);
baseShape.bezierCurveTo(-baseLength/2 + 2, baseWidth/2 - 1, -baseLength/4, baseWidth/2, 0, baseWidth/2 - 1);
baseShape.bezierCurveTo(baseLength/4, baseWidth/2, baseLength/2 - 2, baseWidth/2 - 1, baseLength/2, 0);
baseShape.bezierCurveTo(baseLength/2 - 2, -baseWidth/2 + 1, baseLength/4, -baseWidth/2, 0, -baseWidth/2 + 1);
baseShape.bezierCurveTo(-baseLength/4, -baseWidth/2, -baseLength/2 + 2, -baseWidth/2 + 1, -baseLength/2, 0);

// Center cutout for cutting iron access
const centerCutout = new THREE.Path();
centerCutout.ellipse(0, 0, 3, 2, 0, Math.PI * 2);
baseShape.holes.push(centerCutout);

const baseExtrudeSettings = { depth: baseThickness, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
const base = new THREE.Mesh(baseGeometry, metalMaterial);
base.rotation.x = -Math.PI / 2; // Lay flat on XZ plane
scene.add(base);

// --------------------------
// Handle Construction
// --------------------------
function createHandle() {
  // 2D profile for lathe geometry to make the teardrop handle shape
  const handleProfile = new THREE.Shape();
  handleProfile.moveTo(0, 0);
  handleProfile.lineTo(handleBaseDiameter/2, 0);
  handleProfile.lineTo(handleBaseDiameter/2, handleBaseHeight);
  handleProfile.lineTo(handleDiameter/2 * 0.7, handleBaseHeight + 0.2);
  handleProfile.lineTo(handleDiameter/2, handleBaseHeight + handleHeight * 0.6);
  handleProfile.quadraticCurveTo(handleDiameter/2 * 0.9, handleBaseHeight + handleHeight, 0, handleBaseHeight + handleHeight);

  const handleGeometry = new THREE.LatheGeometry(handleProfile.getPoints(), 32);
  return new THREE.Mesh(handleGeometry, metalMaterial);
}

// Add left handle
const leftHandle = createHandle();
leftHandle.position.set(-baseLength/2 + 2.5, 0, 0);
scene.add(leftHandle);

// Add right handle
const rightHandle = createHandle();
rightHandle.position.set(baseLength/2 - 2.5, 0, 0);
scene.add(rightHandle);

// --------------------------
// Left Fence Post Assembly
// --------------------------
// Fence post mounting base
const fenceBaseGeometry = new THREE.CylinderGeometry(fencePostBaseDiameter, fencePostBaseDiameter, fencePostBaseHeight, 32);
const fenceBase = new THREE.Mesh(fenceBaseGeometry, metalMaterial);
fenceBase.position.set(-3, baseThickness/2 + fencePostBaseHeight/2, 0);
scene.add(fenceBase);

// Fence guide post
const fencePostGeometry = new THREE.CylinderGeometry(fencePostDiameter, fencePostDiameter, fencePostHeight, 32);
const fencePost = new THREE.Mesh(fencePostGeometry, metalMaterial);
fencePost.position.set(-3, baseThickness + fencePostBaseHeight + fencePostHeight/2, 0);
scene.add(fencePost);

// Fence locking thumb wheel
const thumbWheelGeometry = new THREE.CylinderGeometry(thumbWheelDiameter, thumbWheelDiameter, thumbWheelThickness, 24);
const fenceThumbWheel = new THREE.Mesh(thumbWheelGeometry, metalMaterial);
fenceThumbWheel.rotation.z = Math.PI / 2;
fenceThumbWheel.position.set(-3.5, baseThickness + 1.2, 1.2);
scene.add(fenceThumbWheel);

// --------------------------
// Central Cutting Iron Assembly
// --------------------------
// Main vertical post
const mainPostGeometry = new THREE.CylinderGeometry(mainPostDiameter, mainPostDiameter, mainPostHeight, 32);
const mainPost = new THREE.Mesh(mainPostGeometry, metalMaterial);
mainPost.position.set(0, baseThickness + mainPostHeight/2, 0);
scene.add(mainPost);

// Depth adjustment clamp body
const mainClampGeometry = new THREE.CylinderGeometry(mainClampDiameter, mainClampDiameter, mainClampThickness, 32);
const mainClamp = new THREE.Mesh(mainClampGeometry, metalMaterial);
mainClamp.position.set(0, baseThickness + 3, 0);
scene.add(mainClamp);

// Clamp locking thumb wheel
const clampThumbWheel = new THREE.Mesh(thumbWheelGeometry, metalMaterial);
clampThumbWheel.rotation.z = Math.PI / 2;
clampThumbWheel.position.set(1.2, baseThickness + 3, 1.8);
scene.add(clampThumbWheel);

// Top fine adjustment screw
const topScrewGeometry = new THREE.CylinderGeometry(screwDiameter, screwDiameter, topScrewHeight, 16);
const topScrew = new THREE.Mesh(topScrewGeometry, metalMaterial);
topScrew.position.set(0, baseThickness + 3 + mainClampThickness/2 + topScrewHeight/2, 0);
scene.add(topScrew);

// Top adjustment screw knob
const topKnobGeometry = new THREE.CylinderGeometry(topScrewKnobDiameter, topScrewKnobDiameter, 0.4, 16);
const topKnob = new THREE.Mesh(topKnobGeometry, metalMaterial);
topKnob.position.set(0, baseThickness + 3 + mainClampThickness/2 + topScrewHeight + 0.2, 0);
scene.add(topKnob);

// Simplified lower cutter arm
const cutterArmGeometry = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 16);
const cutterArm = new THREE.Mesh(cutterArmGeometry, metalMaterial);
cutterArm.rotation.z = Math.PI / 6;
cutterArm.position.set(-0.5, baseThickness + 1.2, 0);
scene.add(cutterArm);

// --------------------------
// Camera Positioning
// --------------------------
camera.position.set(28, 26, 32);
camera.lookAt(0, 2, 0);