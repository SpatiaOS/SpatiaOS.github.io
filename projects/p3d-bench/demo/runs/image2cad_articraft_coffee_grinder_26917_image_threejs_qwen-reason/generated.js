// Parameters
const baseWidth = 10;
const baseDepth = 10;
const baseHeight = 8;
const basePlateThickness = 0.5;
const basePlateWidth = 12;
const basePlateDepth = 12;

const hopperBottomRadius = 4;
const hopperTopRadius = 5;
const hopperHeight = 5;
const hopperWallThickness = 0.3;

const shaftRadius = 0.4;
const shaftHeight = 4;
const armLength = 5;
const knobRadius = 0.8;

// Materials
const greyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xaaaaaa, 
    roughness: 0.4, 
    metalness: 0.2 
});
const darkGreyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    roughness: 0.5, 
    metalness: 0.1 
});

// --- Base Assembly ---
const baseGroup = new THREE.Group();

// Bottom Plate
const bottomPlateGeo = new THREE.BoxGeometry(basePlateWidth, basePlateThickness, basePlateDepth);
const bottomPlate = new THREE.Mesh(bottomPlateGeo, greyMaterial);
bottomPlate.position.y = basePlateThickness / 2;
baseGroup.add(bottomPlate);

// Main Body
const bodyGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const body = new THREE.Mesh(bodyGeo, greyMaterial);
body.position.y = basePlateThickness + baseHeight / 2;
baseGroup.add(body);

// Top Plate
const topPlateGeo = new THREE.BoxGeometry(baseWidth + 1, basePlateThickness, baseDepth + 1);
const topPlate = new THREE.Mesh(topPlateGeo, greyMaterial);
topPlate.position.y = basePlateThickness + baseHeight + basePlateThickness / 2;
baseGroup.add(topPlate);

// Drawer Front
const drawerWidth = 8;
const drawerHeight = 4;
const drawerDepth = 0.5;
const drawerGeo = new THREE.BoxGeometry(drawerWidth, drawerHeight, drawerDepth);
const drawer = new THREE.Mesh(drawerGeo, greyMaterial);
// Position on the front face (z is positive in front)
drawer.position.set(0, basePlateThickness + 2, baseDepth / 2 + drawerDepth / 2);
baseGroup.add(drawer);

// Drawer Knob
const knobGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
const drawerKnob = new THREE.Mesh(knobGeo, darkGreyMaterial);
drawerKnob.rotation.x = Math.PI / 2;
drawerKnob.position.set(0, basePlateThickness + 2, baseDepth / 2 + drawerDepth + 0.4);
baseGroup.add(drawerKnob);

// Logo Plate (Oval)
const logoPlateGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
const logoPlate = new THREE.Mesh(logoPlateGeo, darkGreyMaterial);
logoPlate.scale.y = 0.4; // Make it oval
logoPlate.rotation.x = Math.PI / 2;
logoPlate.position.set(0, basePlateThickness + baseHeight - 1.5, baseDepth / 2 + 0.1);
baseGroup.add(logoPlate);

scene.add(baseGroup);

// --- Hopper Assembly ---
const hopperGroup = new THREE.Group();
const hopperBaseY = basePlateThickness + baseHeight + basePlateThickness;

// Outer Hopper (Frustum)
const hopperOuterGeo = new THREE.CylinderGeometry(hopperTopRadius, hopperBottomRadius, hopperHeight, 32);
const hopperOuter = new THREE.Mesh(hopperOuterGeo, greyMaterial);
hopperOuter.position.y = hopperBaseY + hopperHeight / 2;
hopperGroup.add(hopperOuter);

// Inner Hopper (to create wall thickness illusion)
const hopperInnerRadiusTop = hopperTopRadius - hopperWallThickness;
const hopperInnerRadiusBottom = hopperBottomRadius - hopperWallThickness;
const hopperInnerHeight = hopperHeight - 0.2; // Slightly shorter to show bottom rim
const hopperInnerGeo = new THREE.CylinderGeometry(hopperInnerRadiusTop, hopperInnerRadiusBottom, hopperInnerHeight, 32);
const hopperInner = new THREE.Mesh(hopperInnerGeo, darkGreyMaterial);
hopperInner.position.y = hopperBaseY + hopperInnerHeight / 2 + 0.1;
hopperGroup.add(hopperInner);

// Hopper Rim
const rimGeo = new THREE.TorusGeometry(hopperTopRadius - hopperWallThickness/2, hopperWallThickness/2, 16, 32);
const rim = new THREE.Mesh(rimGeo, greyMaterial);
rim.rotation.x = Math.PI / 2;
rim.position.y = hopperBaseY + hopperHeight;
hopperGroup.add(rim);

// Inner Bottom Detail (Concentric circles)
const innerBottomGeo = new THREE.CylinderGeometry(hopperInnerRadiusBottom - 0.5, hopperInnerRadiusBottom - 0.5, 0.1, 32);
const innerBottom = new THREE.Mesh(innerBottomGeo, darkGreyMaterial);
innerBottom.position.y = hopperBaseY + 0.2;
hopperGroup.add(innerBottom);

scene.add(hopperGroup);

// --- Mechanism Assembly ---
const mechGroup = new THREE.Group();

// Central Shaft
const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 16);
const shaft = new THREE.Mesh(shaftGeo, darkGreyMaterial);
shaft.position.y = hopperBaseY + shaftHeight / 2;
mechGroup.add(shaft);

// Shaft Top Nut/Head
const shaftHeadGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 6);
const shaftHead = new THREE.Mesh(shaftHeadGeo, darkGreyMaterial);
shaftHead.position.y = hopperBaseY + shaftHeight;
mechGroup.add(shaftHead);

// Crank Arm
const armGeo = new THREE.BoxGeometry(armLength, 0.3, 0.8);
const arm = new THREE.Mesh(armGeo, greyMaterial);
// Position arm attached to the shaft top
arm.position.set(armLength / 2 + shaftRadius, hopperBaseY + shaftHeight - 0.5, 0);
mechGroup.add(arm);

// Crarm Arm Mounting bracket detail
const mountGeo = new THREE.BoxGeometry(1, 0.5, 1);
const mount = new THREE.Mesh(mountGeo, darkGreyMaterial);
mount.position.set(shaftRadius, hopperBaseY + shaftHeight - 0.5, 0);
mechGroup.add(mount);

// Handle Knob
const handleKnobGeo = new THREE.SphereGeometry(knobRadius, 16, 16);
const handleKnob = new THREE.Mesh(handleKnobGeo, greyMaterial);
handleKnob.position.set(armLength + shaftRadius, hopperBaseY + shaftHeight - 0.5, 0);
mechGroup.add(handleKnob);

scene.add(mechGroup);

// Adjust camera
camera.position.set(15, 15, 15);
camera.lookAt(0, 5, 0);