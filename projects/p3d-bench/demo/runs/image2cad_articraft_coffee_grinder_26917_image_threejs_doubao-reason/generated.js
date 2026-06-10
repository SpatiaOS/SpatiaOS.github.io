// ===================== PARAMETERS =====================
// Base foundation dimensions
const baseWidth = 12;
const baseDepth = 12;
const baseHeight = 0.8;

// Lower cabinet body dimensions
const cabinetWidth = 10;
const cabinetDepth = 10;
const cabinetHeight = 7;

// Upper platform supporting the hopper
const platformWidth = 11;
const platformDepth = 11;
const platformHeight = 0.6;

// Hopper (upper grinding bowl) dimensions
const hopperTopDiameter = 10;
const hopperBottomDiameter = 8;
const hopperHeight = 7;
const hopperRimThickness = 0.4;
const hopperCollarHeight = 0.5;

// Crank handle assembly dimensions
const centerPostDiameter = 1;
const centerPostHeight = 6;
const crankArmLength = 7;
const crankArmWidth = 1;
const crankArmThickness = 0.3;
const crankKnobDiameter = 1.2;

// Front drawer dimensions
const drawerWidth = 8;
const drawerDepth = 8;
const drawerHeight = 3;
const drawerKnobDiameter = 1;

// Shared material (light gray CAD metal appearance)
const metalMat = new THREE.MeshStandardMaterial({
  color: 0xe2e2e2,
  metalness: 0.25,
  roughness: 0.7
});

// ===================== GEOMETRY CONSTRUCTION =====================
// 1. Base plate
const baseGeom = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const base = new THREE.Mesh(baseGeom, metalMat);
base.position.y = baseHeight / 2;
scene.add(base);

// 2. Lower cabinet
const cabinetGeom = new THREE.BoxGeometry(cabinetWidth, cabinetHeight, cabinetDepth);
const cabinet = new THREE.Mesh(cabinetGeom, metalMat);
cabinet.position.y = baseHeight + (cabinetHeight / 2);
scene.add(cabinet);

// 3. Upper platform under hopper
const platformGeom = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
const platform = new THREE.Mesh(platformGeom, metalMat);
platform.position.y = baseHeight + cabinetHeight + (platformHeight / 2);
scene.add(platform);

// 4. Hopper mounting collar
const collarGeom = new THREE.CylinderGeometry(
  (hopperBottomDiameter / 2) + 0.3,
  (hopperBottomDiameter / 2) + 0.3,
  hopperCollarHeight,
  64
);
const collar = new THREE.Mesh(collarGeom, metalMat);
collar.position.y = platform.position.y + (platformHeight / 2) + (hopperCollarHeight / 2);
scene.add(collar);

// 5. Tapered hopper bowl
const hopperGeom = new THREE.CylinderGeometry(
  hopperTopDiameter / 2,
  hopperBottomDiameter / 2,
  hopperHeight,
  64
);
const hopper = new THREE.Mesh(hopperGeom, metalMat);
hopper.position.y = collar.position.y + (hopperCollarHeight / 2) + (hopperHeight / 2);
scene.add(hopper);

// 6. Hopper top rim
const rimGeom = new THREE.CylinderGeometry(
  (hopperTopDiameter / 2) + hopperRimThickness,
  (hopperTopDiameter / 2) + hopperRimThickness,
  hopperRimThickness,
  64
);
const rim = new THREE.Mesh(rimGeom, metalMat);
rim.position.y = hopper.position.y + (hopperHeight / 2) + (hopperRimThickness / 2);
scene.add(rim);

// 7. Central grinding post
const centerPostGeom = new THREE.CylinderGeometry(
  centerPostDiameter / 2,
  centerPostDiameter / 2,
  centerPostHeight,
  32
);
const centerPost = new THREE.Mesh(centerPostGeom, metalMat);
centerPost.position.y = collar.position.y + (hopperCollarHeight / 2) + (centerPostHeight / 2);
scene.add(centerPost);

// 8. Crank arm
const crankArmGeom = new THREE.BoxGeometry(crankArmLength, crankArmThickness, crankArmWidth);
const crankArm = new THREE.Mesh(crankArmGeom, metalMat);
crankArm.position.set(
  (crankArmLength / 2) - 0.5,
  centerPost.position.y + (centerPostHeight / 2) - 0.2,
  0
);
scene.add(crankArm);

// 9. Crank knob base
const knobBaseGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
const knobBase = new THREE.Mesh(knobBaseGeom, metalMat);
knobBase.position.set(
  crankArmLength - 1,
  crankArm.position.y + (crankArmThickness / 2) + 0.1,
  0
);
scene.add(knobBase);

// 10. Crank handle knob
const crankKnobGeom = new THREE.SphereGeometry(crankKnobDiameter / 2, 16, 16);
const crankKnob = new THREE.Mesh(crankKnobGeom, metalMat);
crankKnob.position.set(
  knobBase.position.x,
  knobBase.position.y + 0.1 + (crankKnobDiameter / 2),
  0
);
scene.add(crankKnob);

// 11. Front catch drawer
const drawerGeom = new THREE.BoxGeometry(drawerWidth, drawerHeight, drawerDepth);
const drawer = new THREE.Mesh(drawerGeom, metalMat);
drawer.position.set(
  0,
  baseHeight + (drawerHeight / 2) + 1,
  (cabinetDepth / 2) - (drawerDepth / 2) - 0.1
);
scene.add(drawer);

// 12. Drawer knob
const drawerKnobGeom = new THREE.CylinderGeometry(drawerKnobDiameter / 2, drawerKnobDiameter / 2, 0.4, 16);
drawerKnobGeom.rotateX(Math.PI / 2);
const drawerKnob = new THREE.Mesh(drawerKnobGeom, metalMat);
drawerKnob.position.set(
  0,
  drawer.position.y,
  (cabinetDepth / 2) + 0.2
);
scene.add(drawerKnob);

// 13. Fusion 360 name plate
const namePlateGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.15, 16);
namePlateGeom.scale(1, 0.35, 1);
const namePlate = new THREE.Mesh(namePlateGeom, new THREE.MeshStandardMaterial({ color: 0x222222 }));
namePlate.position.set(
  0,
  drawer.position.y + (drawerHeight / 2) + 1,
  (cabinetDepth / 2) + 0.08
);
scene.add(namePlate);

// ===================== CAMERA POSITION =====================
camera.position.set(28, 22, 28);
camera.lookAt(0, (baseHeight + cabinetHeight) / 2, 0);