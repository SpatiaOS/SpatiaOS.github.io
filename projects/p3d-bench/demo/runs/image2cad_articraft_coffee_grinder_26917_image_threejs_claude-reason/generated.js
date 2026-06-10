// Coffee Grinder - inspired by the Fusion 360 model in the image

// Parameters
const baseWidth = 12;
const baseDepth = 12;
const baseHeight = 0.8;
const bodyWidth = 10;
const bodyDepth = 10;
const bodyHeight = 7;
const topPlateWidth = 12.5;
const topPlateDepth = 12.5;
const topPlateHeight = 0.6;
const bowlBottomRadius = 5;
const bowlTopRadius = 7;
const bowlHeight = 7;
const bowlWallThickness = 0.4;
const rimRadius = 0.5;
const handleLength = 7;
const handleHeight = 1.5;
const knobRadius = 0.7;
const drawerKnobRadius = 0.5;

const metalMat = new THREE.MeshStandardMaterial({ 
    color: 0xb0b0b0, 
    metalness: 0.4, 
    roughness: 0.35 
});

const darkMetalMat = new THREE.MeshStandardMaterial({ 
    color: 0x808080, 
    metalness: 0.5, 
    roughness: 0.3 
});

// ====== BASE PLATE ======
const baseGroup = new THREE.Group();

// Bottom base plate with beveled look
const basePlateGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const basePlate = new THREE.Mesh(basePlateGeo, metalMat);
basePlate.position.y = baseHeight / 2;
baseGroup.add(basePlate);

// Thin lip around base
const baseLipGeo = new THREE.BoxGeometry(baseWidth + 1.0, 0.3, baseDepth + 1.0);
const baseLip = new THREE.Mesh(baseLipGeo, metalMat);
baseLip.position.y = 0.15;
baseGroup.add(baseLip);

// ====== BODY ======
const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
const body = new THREE.Mesh(bodyGeo, metalMat);
body.position.y = baseHeight + bodyHeight / 2;
baseGroup.add(body);

// Corner pillars on body
const pillarRadius = 0.4;
const pillarHeight = bodyHeight;
const pillarGeo = new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 12);
const cornerOffsets = [
    [-bodyWidth/2 + pillarRadius, bodyDepth/2 - pillarRadius],
    [bodyWidth/2 - pillarRadius, bodyDepth/2 - pillarRadius],
    [-bodyWidth/2 + pillarRadius, -bodyDepth/2 + pillarRadius],
    [bodyWidth/2 - pillarRadius, -bodyDepth/2 + pillarRadius]
];
cornerOffsets.forEach(([x, z]) => {
    const pillar = new THREE.Mesh(pillarGeo, darkMetalMat);
    pillar.position.set(x, baseHeight + pillarHeight / 2, z);
    baseGroup.add(pillar);
});

// ====== DRAWER FRONT ======
const drawerWidth = bodyWidth * 0.85;
const drawerHeight = bodyHeight * 0.45;
const drawerFrontGeo = new THREE.BoxGeometry(drawerWidth, drawerHeight, 0.3);
const drawerFront = new THREE.Mesh(drawerFrontGeo, metalMat);
drawerFront.position.set(0, baseHeight + drawerHeight / 2 + 0.5, bodyDepth / 2 + 0.15);
baseGroup.add(drawerFront);

// Drawer knob
const drawerKnobGeo = new THREE.SphereGeometry(drawerKnobRadius, 16, 16);
const drawerKnob = new THREE.Mesh(drawerKnobGeo, darkMetalMat);
drawerKnob.position.set(-drawerWidth/3, baseHeight + drawerHeight / 2 + 0.5, bodyDepth / 2 + 0.6);
baseGroup.add(drawerKnob);

// Drawer knob stem
const knobStemGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
const knobStem = new THREE.Mesh(knobStemGeo, darkMetalMat);
knobStem.rotation.x = Math.PI / 2;
knobStem.position.set(-drawerWidth/3, baseHeight + drawerHeight / 2 + 0.5, bodyDepth / 2 + 0.35);
baseGroup.add(knobStem);

// ====== BADGE / LABEL ======
const badgeGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.15, 32);
const badgeMat = new THREE.MeshStandardMaterial({ color: 0x707070, metalness: 0.6, roughness: 0.2 });
const badge = new THREE.Mesh(badgeGeo, badgeMat);
badge.rotation.x = Math.PI / 2;
badge.position.set(0, baseHeight + bodyHeight * 0.65, bodyDepth / 2 + 0.2);
// Make it elliptical by scaling
badge.scale.set(1.6, 1, 0.6);
baseGroup.add(badge);

// ====== TOP PLATE ======
const topPlateY = baseHeight + bodyHeight;

// Top plate - main
const topPlateGeo = new THREE.BoxGeometry(topPlateWidth, topPlateHeight, topPlateDepth);
const topPlate = new THREE.Mesh(topPlateGeo, metalMat);
topPlate.position.y = topPlateY + topPlateHeight / 2;
baseGroup.add(topPlate);

// Top plate lip
const topLipGeo = new THREE.BoxGeometry(topPlateWidth + 0.5, 0.2, topPlateDepth + 0.5);
const topLip = new THREE.Mesh(topLipGeo, metalMat);
topLip.position.y = topPlateY + topPlateHeight + 0.1;
baseGroup.add(topLip);

// ====== RING / COLLAR where bowl sits on plate ======
const collarY = topPlateY + topPlateHeight;
const collarInnerR = bowlBottomRadius - 0.3;
const collarOuterR = bowlBottomRadius + 0.5;
const collarHeight = 0.6;

const collarShape = new THREE.Shape();
collarShape.absarc(0, 0, collarOuterR, 0, Math.PI * 2, false);
const collarHole = new THREE.Path();
collarHole.absarc(0, 0, collarInnerR, 0, Math.PI * 2, true);
collarShape.holes.push(collarHole);

const collarExtrudeSettings = { depth: collarHeight, bevelEnabled: false };
const collarGeo = new THREE.ExtrudeGeometry(collarShape, collarExtrudeSettings);
const collar = new THREE.Mesh(collarGeo, metalMat);
collar.rotation.x = -Math.PI / 2;
collar.position.y = collarY;
baseGroup.add(collar);

// ====== BOWL ======
const bowlGroup = new THREE.Group();
const bowlY = collarY + collarHeight;

// Bowl - using lathe geometry for tapered cylinder
const bowlSegments = 64;
const bowlPoints = [];
// Inner bottom
bowlPoints.push(new THREE.Vector2(0, 0));
bowlPoints.push(new THREE.Vector2(bowlBottomRadius - bowlWallThickness, 0));
// Inner wall going up
bowlPoints.push(new THREE.Vector2(bowlTopRadius - bowlWallThickness, bowlHeight - 0.5));
bowlPoints.push(new THREE.Vector2(bowlTopRadius - bowlWallThickness, bowlHeight));
// Top rim - outer edge
bowlPoints.push(new THREE.Vector2(bowlTopRadius + 0.3, bowlHeight));
bowlPoints.push(new THREE.Vector2(bowlTopRadius + 0.3, bowlHeight - 0.5));
// Outer wall going down
bowlPoints.push(new THREE.Vector2(bowlBottomRadius, 0));
bowlPoints.push(new THREE.Vector2(0, 0));

const bowlGeo = new THREE.LatheGeometry(bowlPoints, bowlSegments);
const bowl = new THREE.Mesh(bowlGeo, metalMat);
bowl.position.y = bowlY;
bowlGroup.add(bowl);

// Bowl rim torus
const rimTorusGeo = new THREE.TorusGeometry(bowlTopRadius - 0.1, rimRadius, 16, bowlSegments);
const rimTorus = new THREE.Mesh(rimTorusGeo, metalMat);
rimTorus.rotation.x = Math.PI / 2;
rimTorus.position.y = bowlY + bowlHeight;
bowlGroup.add(rimTorus);

// Second rim (outer)
const rimTorus2Geo = new THREE.TorusGeometry(bowlTopRadius + 0.3, rimRadius * 0.6, 12, bowlSegments);
const rimTorus2 = new THREE.Mesh(rimTorus2Geo, metalMat);
rimTorus2.rotation.x = Math.PI / 2;
rimTorus2.position.y = bowlY + bowlHeight;
bowlGroup.add(rimTorus2);

baseGroup.add(bowlGroup);

// ====== GRINDING MECHANISM (center shaft) ======
const shaftRadius = 0.35;
const shaftHeight = bowlHeight + handleHeight + 1;
const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 16);
const shaft = new THREE.Mesh(shaftGeo, darkMetalMat);
shaft.position.y = bowlY + shaftHeight / 2 - 1;
baseGroup.add(shaft);

// Shaft top nut
const nutGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 6);
const nut = new THREE.Mesh(nutGeo, darkMetalMat);
nut.position.y = bowlY + shaftHeight - 0.5;
baseGroup.add(nut);

// ====== HANDLE ARM ======
const handleY = bowlY + bowlHeight + 0.3;

// Handle bar - horizontal
const handleBarGeo = new THREE.CylinderGeometry(0.2, 0.2, handleLength, 12);
const handleBar = new THREE.Mesh(handleBarGeo, darkMetalMat);
handleBar.rotation.z = Math.PI / 2;
handleBar.position.set(handleLength / 2 - 1, handleY, 0);
baseGroup.add(handleBar);

// Vertical support at the center end of handle
const supportHeight = 2.5;
const supportGeo = new THREE.CylinderGeometry(0.2, 0.2, supportHeight, 12);
const support = new THREE.Mesh(supportGeo, darkMetalMat);
support.position.set(0, handleY - supportHeight / 2 + 0.2, 0);
baseGroup.add(support);

// Handle bar bracket/flat piece
const bracketGeo = new THREE.BoxGeometry(handleLength * 0.5, 0.15, 1.2);
const bracket = new THREE.Mesh(bracketGeo, darkMetalMat);
bracket.position.set(handleLength * 0.35, handleY - 0.1, 0);
baseGroup.add(bracket);

// Handle knob at the end
const handleKnobGeo = new THREE.SphereGeometry(knobRadius, 16, 16);
const handleKnob = new THREE.Mesh(handleKnobGeo, darkMetalMat);
handleKnob.position.set(handleLength - 1.5, handleY, 0);
baseGroup.add(handleKnob);

// Handle knob stem (vertical piece for grip)
const handleGripGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 12);
const handleGrip = new THREE.Mesh(handleGripGeo, darkMetalMat);
handleGrip.position.set(handleLength - 1.5, handleY + 0.2, 0);
baseGroup.add(handleGrip);

// ====== CURVED GRINDING BLADES inside bowl ======
// Two curved bars inside the bowl
for (let i = 0; i < 2; i++) {
    const angle = i * Math.PI;
    const curvePoints = [];
    for (let t = 0; t <= 1; t += 0.05) {
        const a = angle + t * Math.PI * 0.8;
        const r = 1.5 + t * 3;
        const y = bowlY + 2 + t * 3;
        curvePoints.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.15, 8, false);
    const blade = new THREE.Mesh(tubeGeo, darkMetalMat);
    baseGroup.add(blade);
}

// ====== Decorative ring on top plate where bowl sits ======
const ringGeo = new THREE.TorusGeometry(bowlBottomRadius + 0.2, 0.25, 12, 48);
const ring = new THREE.Mesh(ringGeo, metalMat);
ring.rotation.x = Math.PI / 2;
ring.position.y = collarY + 0.1;
baseGroup.add(ring);

// Position entire model
baseGroup.position.y = -8;
scene.add(baseGroup);

// Camera positioning
camera.position.set(22, 18, 22);
camera.lookAt(0, 2, 0);