// Parameters
const baseWidth = 10;
const baseHeight = 8;
const baseDepth = 10;
const moldHeight = 0.5;

// Materials
// Using standard materials with slightly different shades of grey to mimic the CAD screenshot
const matWood = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7, metalness: 0.1 });
const matMetal = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.4, metalness: 0.5 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.2 });

// --- BASE ---
// Main body (slightly inset to allow for corner posts)
const bodyGeom = new THREE.BoxGeometry(baseWidth - 0.5, baseHeight, baseDepth - 0.5);
const bodyMesh = new THREE.Mesh(bodyGeom, matWood);
scene.add(bodyMesh);

// Corner posts
const postGeom = new THREE.BoxGeometry(0.5, baseHeight, 0.5);
const postPositions = [
    [-4.75, 4.75], [4.75, 4.75], [-4.75, -4.75], [4.75, -4.75]
];
postPositions.forEach(pos => {
    const post = new THREE.Mesh(postGeom, matWood);
    post.position.set(pos[0], 0, pos[1]);
    scene.add(post);
});

// Bottom Moldings
const botMold1Geom = new THREE.BoxGeometry(baseWidth + 1, moldHeight, baseDepth + 1);
const botMold1 = new THREE.Mesh(botMold1Geom, matWood);
botMold1.position.y = -baseHeight / 2 - moldHeight / 2;
scene.add(botMold1);

const botMold2Geom = new THREE.BoxGeometry(baseWidth + 2, moldHeight, baseDepth + 2);
const botMold2 = new THREE.Mesh(botMold2Geom, matWood);
botMold2.position.y = -baseHeight / 2 - moldHeight * 1.5;
scene.add(botMold2);

// Top Moldings
const topMold1Geom = new THREE.BoxGeometry(baseWidth + 1, moldHeight, baseDepth + 1);
const topMold1 = new THREE.Mesh(topMold1Geom, matWood);
topMold1.position.y = baseHeight / 2 + moldHeight / 2;
scene.add(topMold1);

const topMold2Geom = new THREE.BoxGeometry(baseWidth + 2, moldHeight, baseDepth + 2);
const topMold2 = new THREE.Mesh(topMold2Geom, matWood);
topMold2.position.y = baseHeight / 2 + moldHeight * 1.5;
scene.add(topMold2);

// --- DRAWER ---
const drawerZ = baseDepth / 2 - 0.25;

// Dark background to simulate the gap
const drawerGapGeom = new THREE.BoxGeometry(8.2, 5.2, 0.1);
const drawerGap = new THREE.Mesh(drawerGapGeom, matDark);
drawerGap.position.set(0, -0.5, drawerZ + 0.05);
scene.add(drawerGap);

// Drawer base panel
const drawerBaseGeom = new THREE.BoxGeometry(8.0, 5.0, 0.2);
const drawerBase = new THREE.Mesh(drawerBaseGeom, matWood);
drawerBase.position.set(0, -0.5, drawerZ + 0.2);
scene.add(drawerBase);

// Drawer raised face
const drawerFaceGeom = new THREE.BoxGeometry(7.2, 4.2, 0.2);
const drawerFace = new THREE.Mesh(drawerFaceGeom, matWood);
drawerFace.position.set(0, -0.5, drawerZ + 0.4);
scene.add(drawerFace);

// Drawer Knob
const knobBaseGeom = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 16);
knobBaseGeom.rotateX(Math.PI / 2);
const knobBase = new THREE.Mesh(knobBaseGeom, matWood);
knobBase.position.set(0, -0.5, drawerZ + 0.65);
scene.add(knobBase);

const knobSphereGeom = new THREE.SphereGeometry(0.4, 16, 16);
const knobSphere = new THREE.Mesh(knobSphereGeom, matWood);
knobSphere.position.set(0, -0.5, drawerZ + 0.8);
scene.add(knobSphere);

// --- PLAQUE (Fusion 360 Label Area) ---
const plaqueGroup = new THREE.Group();
plaqueGroup.position.set(0, 2.5, drawerZ + 0.1);

const pGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
pGeom.rotateX(Math.PI / 2);
pGeom.scale(1, 0.4, 1); // Make it oval
const pMesh = new THREE.Mesh(pGeom, matMetal);
plaqueGroup.add(pMesh);

const pInnerGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.12, 32);
pInnerGeom.rotateX(Math.PI / 2);
pInnerGeom.scale(1, 0.4, 1);
const pInnerMesh = new THREE.Mesh(pInnerGeom, matDark);
plaqueGroup.add(pInnerMesh);

// Plaque Screws
const screwGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8);
screwGeom.rotateX(Math.PI / 2);
const screw1 = new THREE.Mesh(screwGeom, matMetal);
screw1.position.set(-1.4, 0, 0.05);
plaqueGroup.add(screw1);
const screw2 = new THREE.Mesh(screwGeom, matMetal);
screw2.position.set(1.4, 0, 0.05);
plaqueGroup.add(screw2);

scene.add(plaqueGroup);

// --- BOWL / HOPPER ---
const bowlBaseY = baseHeight / 2 + moldHeight * 2; 

// Lathe profile for the bowl (closed loop for solid geometry)
const bowlPoints = [];
bowlPoints.push(new THREE.Vector2(0, bowlBaseY + 0.5));     // Center bottom inner
bowlPoints.push(new THREE.Vector2(3.5, bowlBaseY + 0.5));   // Edge bottom inner
bowlPoints.push(new THREE.Vector2(6.0, bowlBaseY + 4.5));   // Top inner
bowlPoints.push(new THREE.Vector2(6.0, bowlBaseY + 5.0));   // Top rim inner
bowlPoints.push(new THREE.Vector2(6.8, bowlBaseY + 5.0));   // Top rim outer
bowlPoints.push(new THREE.Vector2(6.8, bowlBaseY + 4.6));   // Rim bottom outer
bowlPoints.push(new THREE.Vector2(6.3, bowlBaseY + 4.3));   // Rim taper
bowlPoints.push(new THREE.Vector2(4.0, bowlBaseY));         // Edge bottom outer
bowlPoints.push(new THREE.Vector2(0, bowlBaseY));           // Center bottom outer
bowlPoints.push(new THREE.Vector2(0, bowlBaseY + 0.5));     // Close loop

const bowlGeom = new THREE.LatheGeometry(bowlPoints, 64);
const bowl = new THREE.Mesh(bowlGeom, matMetal);
scene.add(bowl);

// --- GRINDER MECHANISM ---
// Inner ring at the bottom of the bowl
const ringGeom = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
const ring = new THREE.Mesh(ringGeom, matMetal);
ring.position.set(0, bowlBaseY + 0.75, 0);
scene.add(ring);

const innerRingGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.6, 32);
const innerRing = new THREE.Mesh(innerRingGeom, matDark);
innerRing.position.set(0, bowlBaseY + 0.8, 0);
scene.add(innerRing);

// Central Shaft
const shaftHeight = 6.5;
const shaftY = bowlBaseY + shaftHeight / 2;
const shaftGeom = new THREE.CylinderGeometry(0.6, 0.6, shaftHeight, 16);
const shaft = new THREE.Mesh(shaftGeom, matMetal);
shaft.position.set(0, shaftY, 0);
scene.add(shaft);

// --- CRANK HANDLE ---
const crankGroup = new THREE.Group();
const handleBaseY = bowlBaseY + shaftHeight - 0.2; // Top of the shaft
crankGroup.position.set(0, handleBaseY, 0);

// Crank Arm (Extruded Shape)
const hShape = new THREE.Shape();
hShape.moveTo(-1.0, 0);
hShape.lineTo(2.0, 0);
hShape.lineTo(3.5, 1.2); // Step up
hShape.lineTo(7.5, 1.2);
hShape.lineTo(7.5, 1.0); // Thickness
hShape.lineTo(3.6, 1.0);
hShape.lineTo(2.1, -0.2);
hShape.lineTo(-1.0, -0.2);
hShape.lineTo(-1.0, 0);

const extrudeSettings = {
    depth: 1.2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05
};
const handleGeom = new THREE.ExtrudeGeometry(hShape, extrudeSettings);
handleGeom.translate(0, 0, -0.6); // Center the depth on Z axis
const handle = new THREE.Mesh(handleGeom, matMetal);
crankGroup.add(handle);

// Top Nut (Hex + Acorn top)
const nutHexGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 6);
const nutHex = new THREE.Mesh(nutHexGeom, matMetal);
nutHex.position.set(0, 0.2, 0);
crankGroup.add(nutHex);

const nutTopGeom = new THREE.SphereGeometry(0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const nutTop = new THREE.Mesh(nutTopGeom, matMetal);
nutTop.position.set(0, 0.4, 0);
crankGroup.add(nutTop);

// Handle Knob Pin
const pinGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16);
const pin = new THREE.Mesh(pinGeom, matMetal);
pin.position.set(7.0, 1.7, 0);
crankGroup.add(pin);

// Handle Knob (Curvy wooden piece)
const knobProfile = [];
knobProfile.push(new THREE.Vector2(0, 0));
knobProfile.push(new THREE.Vector2(0.6, 0));
knobProfile.push(new THREE.Vector2(0.3, 0.3));
knobProfile.push(new THREE.Vector2(0.3, 0.8));
knobProfile.push(new THREE.Vector2(0.9, 1.5));
knobProfile.push(new THREE.Vector2(0.8, 2.2));
knobProfile.push(new THREE.Vector2(0.4, 2.5));
knobProfile.push(new THREE.Vector2(0.5, 2.7));
knobProfile.push(new THREE.Vector2(0, 2.7));

const crankKnobGeom = new THREE.LatheGeometry(knobProfile, 32);
const crankKnob = new THREE.Mesh(crankKnobGeom, matWood);
crankKnob.position.set(7.0, 1.2, 0);
crankGroup.add(crankKnob);

// Rotate crank to match the dynamic angle in the image
crankGroup.rotation.y = Math.PI / 4;
scene.add(crankGroup);

// --- CAMERA ADJUSTMENT ---
camera.position.set(18, 22, 22);
camera.lookAt(0, 4, 0);