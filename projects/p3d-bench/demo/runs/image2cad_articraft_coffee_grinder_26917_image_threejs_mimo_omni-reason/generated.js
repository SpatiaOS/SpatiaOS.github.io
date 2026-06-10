// --------------------------
// Parametric Dimensions (adjustable)
// --------------------------
// Base platform (bottom)
const baseWidth = 20;
const baseDepth = 20;
const baseHeight = 2;

// Main cabinet box
const cabinetWidth = 18;
const cabinetDepth = 18;
const cabinetHeight = 12;

// Drawer
const drawerWidth = 14;
const drawerDepth = 18;
const drawerHeight = 8;
const drawerKnobRadius = 1;
const drawerKnobDepth = 0.5;

// Top plate (above cabinet)
const topPlateWidth = 22;
const topPlateDepth = 22;
const topPlateHeight = 1;

// Tapered bowl (frustum)
const bowlBottomRadius = 8;
const bowlTopRadius = 10;
const bowlHeight = 10;

// Central column
const columnRadius = 2;
const columnHeight = 8;

// Cross arm + hardware
const armLength = 12;
const armWidth = 1.5;
const armThickness = 0.5;
const armKnobRadius = 1.5;
const boltRadius = 0.8;
const boltHexHeight = 0.3;

// Common material
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0x777777,
  metalness: 0.6,
  roughness: 0.3
});

// --------------------------
// 1. Base Platform
// --------------------------
const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const base = new THREE.Mesh(baseGeometry, metalMaterial);
base.position.y = baseHeight / 2;
scene.add(base);

// --------------------------
// 2. Main Cabinet Box
// --------------------------
const cabinetGeometry = new THREE.BoxGeometry(cabinetWidth, cabinetHeight, cabinetDepth);
const cabinet = new THREE.Mesh(cabinetGeometry, metalMaterial);
// Position on top of base, centered
cabinet.position.y = baseHeight + cabinetHeight / 2;
scene.add(cabinet);

// --------------------------
// 3. Drawer + Knob
// --------------------------
// Drawer front
const drawerGeometry = new THREE.BoxGeometry(drawerWidth, drawerHeight, 1);
const drawer = new THREE.Mesh(drawerGeometry, metalMaterial);
drawer.position.set(
  0,
  baseHeight + drawerHeight / 2 + 1,
  cabinetDepth / 2 + 0.5
);
scene.add(drawer);

// Drawer knob
const drawerKnobGeometry = new THREE.CylinderGeometry(drawerKnobRadius, drawerKnobRadius, drawerKnobDepth, 16);
drawerKnobGeometry.rotateX(Math.PI / 2); // Align to front
const drawerKnob = new THREE.Mesh(drawerKnobGeometry, metalMaterial);
drawerKnob.position.set(
  0,
  baseHeight + drawerHeight / 2 + 1,
  cabinetDepth / 2 + 0.5 + drawerKnobDepth / 2
);
scene.add(drawerKnob);

// --------------------------
// 4. Top Plate (above cabinet)
// --------------------------
const topPlateGeometry = new THREE.BoxGeometry(topPlateWidth, topPlateHeight, topPlateDepth);
const topPlate = new THREE.Mesh(topPlateGeometry, metalMaterial);
topPlate.position.y = baseHeight + cabinetHeight + topPlateHeight / 2;
scene.add(topPlate);

// --------------------------
// 5. Tapered Bowl (Frustum)
// --------------------------
const bowlGeometry = new THREE.CylinderGeometry(
  bowlTopRadius,
  bowlBottomRadius,
  bowlHeight,
  32,
  1,
  true // open top/bottom, we'll add a bottom later
);
const bowl = new THREE.Mesh(bowlGeometry, metalMaterial);
// Position on top of the plate
bowl.position.y = baseHeight + cabinetHeight + topPlateHeight + bowlHeight / 2;
scene.add(bowl);

// Bowl bottom (closed base)
const bowlBottomGeometry = new THREE.CylinderGeometry(bowlBottomRadius, bowlBottomRadius, 0.2, 32);
const bowlBottom = new THREE.Mesh(bowlBottomGeometry, metalMaterial);
bowlBottom.position.y = baseHeight + cabinetHeight + topPlateHeight + 0.1;
scene.add(bowlBottom);

// --------------------------
// 6. Central Column
// --------------------------
const columnGeometry = new THREE.CylinderGeometry(columnRadius, columnRadius, columnHeight, 16);
const column = new THREE.Mesh(columnGeometry, metalMaterial);
// Position centered in bowl, bottom at bowl base
column.position.y = baseHeight + cabinetHeight + topPlateHeight + columnHeight / 2;
scene.add(column);

// --------------------------
// 7. Cross Arm + Hardware
// --------------------------
// Cross arm bar
const armGeometry = new THREE.BoxGeometry(armLength, armWidth, armThickness);
const arm = new THREE.Mesh(armGeometry, metalMaterial);
arm.position.set(
  armLength / 2 - 0.5,
  baseHeight + cabinetHeight + topPlateHeight + columnHeight,
  0
);
scene.add(arm);

// Arm end knob (sphere)
const armKnobGeometry = new THREE.SphereGeometry(armKnobRadius, 16, 16);
const armKnob = new THREE.Mesh(armKnobGeometry, metalMaterial);
armKnob.position.set(
  armLength,
  baseHeight + cabinetHeight + topPlateHeight + columnHeight,
  0
);
scene.add(armKnob);

// Top bolt on column
const boltGeometry = new THREE.CylinderGeometry(boltRadius, boltRadius, boltHexHeight, 6); // Hexagon shape
const bolt = new THREE.Mesh(boltGeometry, metalMaterial);
bolt.position.set(
  0,
  baseHeight + cabinetHeight + topPlateHeight + columnHeight + boltHexHeight / 2,
  0
);
scene.add(bolt);

// Bolt on arm end
const armBolt = bolt.clone();
armBolt.position.set(
  armLength,
  baseHeight + cabinetHeight + topPlateHeight + columnHeight + boltHexHeight / 2,
  0
);
scene.add(armBolt);

// --------------------------
// Camera Adjustment
// --------------------------
camera.position.set(35, 30, 35);
camera.lookAt(0, baseHeight + cabinetHeight / 2, 0);