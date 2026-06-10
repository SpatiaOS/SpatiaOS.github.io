// Parameters
const baseWidth = 150;
const baseDepth = 50;
const baseHeight = 8;
const knobHeight = 45;
const bridgeHeight = 16;
const metalRoughness = 0.5;
const metalness = 0.6;

// Materials
const matCastIron = new THREE.MeshStandardMaterial({ color: 0x9599a0, roughness: 0.6, metalness: 0.4 });
const matMachinedSteel = new THREE.MeshStandardMaterial({ color: 0xb8bcc2, roughness: 0.3, metalness: 0.7 });
const matWoodGrey = new THREE.MeshStandardMaterial({ color: 0x8a8d91, roughness: 0.7, metalness: 0.1 });
const matDarkMetal = new THREE.MeshStandardMaterial({ color: 0x333538, roughness: 0.5, metalness: 0.6 });
const matBlack = new THREE.MeshBasicMaterial({ color: 0x111111 });

// Main Group
const routerPlane = new THREE.Group();

// --- 1. BASE ---
const baseGroup = new THREE.Group();

// Left Wing
const leftWingShape = new THREE.Shape();
leftWingShape.moveTo(-28, -18);
leftWingShape.lineTo(-45, -18);
leftWingShape.bezierCurveTo(-55, -18, -60, -25, -75, -25);
leftWingShape.absarc(-75, 0, 25, -Math.PI/2, Math.PI/2, false);
leftWingShape.bezierCurveTo(-60, 25, -55, 18, -45, 18);
leftWingShape.lineTo(-28, 18);

const extrudeOpts = { depth: baseHeight, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 2 };
const leftWing = new THREE.Mesh(new THREE.ExtrudeGeometry(leftWingShape, extrudeOpts), matCastIron);
leftWing.rotation.x = Math.PI / 2;
leftWing.position.y = baseHeight;
baseGroup.add(leftWing);

// Right Wing
const rightWingShape = new THREE.Shape();
rightWingShape.moveTo(28, -18);
rightWingShape.lineTo(45, -18);
rightWingShape.bezierCurveTo(55, -18, 60, -25, 75, -25);
rightWingShape.absarc(75, 0, 25, -Math.PI/2, Math.PI/2, false);
rightWingShape.bezierCurveTo(60, 25, 55, 18, 45, 18);
rightWingShape.lineTo(28, 18);

const rightWing = new THREE.Mesh(new THREE.ExtrudeGeometry(rightWingShape, extrudeOpts), matCastIron);
rightWing.rotation.x = Math.PI / 2;
rightWing.position.y = baseHeight;
baseGroup.add(rightWing);

// Center Bridge (Arch)
const bridgeShape = new THREE.Shape();
bridgeShape.moveTo(-30, baseHeight);
bridgeShape.lineTo(-30, bridgeHeight);
bridgeShape.lineTo(30, bridgeHeight);
bridgeShape.lineTo(30, baseHeight);
bridgeShape.bezierCurveTo(15, bridgeHeight + 6, -15, bridgeHeight + 6, -30, baseHeight); // Arch cutout

const bridgeGeo = new THREE.ExtrudeGeometry(bridgeShape, { depth: 36, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 2 });
const bridge = new THREE.Mesh(bridgeGeo, matCastIron);
bridge.position.set(0, 0, -18);
baseGroup.add(bridge);

// Post Bases on Bridge
const bladeBase = new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 6, 32), matCastIron);
bladeBase.position.set(12, bridgeHeight + 3, 0);
baseGroup.add(bladeBase);

const secPostBase = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 4, 32), matCastIron);
secPostBase.position.set(-12, bridgeHeight + 2, 0);
baseGroup.add(secPostBase);

// Simulated Text Plaques
const rightPlaque = new THREE.Group();
rightPlaque.position.set(45, baseHeight + 0.2, 10);
rightPlaque.rotation.y = -Math.PI / 8;
const bgPlate = new THREE.Mesh(new THREE.BoxGeometry(18, 0.4, 8), matDarkMetal);
rightPlaque.add(bgPlate);
const t1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.6, 4), matCastIron);
t1.position.set(-4, 0, 0);
rightPlaque.add(t1);
const t2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 4), matCastIron);
t2.position.set(3, 0, 0);
rightPlaque.add(t2);
baseGroup.add(rightPlaque);

const logoBox = new THREE.Mesh(new THREE.BoxGeometry(25, 4, 0.5), matDarkMetal);
logoBox.position.set(-15, 12, 18);
logoBox.rotation.y = Math.PI / 12;
logoBox.rotation.x = -Math.PI / 16;
baseGroup.add(logoBox);

routerPlane.add(baseGroup);

// --- 2. KNOBS ---
const knobPoints = [];
knobPoints.push(new THREE.Vector2(0, 0));
knobPoints.push(new THREE.Vector2(16, 0));
knobPoints.push(new THREE.Vector2(14, 4));
knobPoints.push(new THREE.Vector2(9, 10));
knobPoints.push(new THREE.Vector2(10, 15));
knobPoints.push(new THREE.Vector2(18, 25));
knobPoints.push(new THREE.Vector2(22, 35));
knobPoints.push(new THREE.Vector2(15, 46));
knobPoints.push(new THREE.Vector2(8, 50));
knobPoints.push(new THREE.Vector2(0, 50));

const knobGeo = new THREE.LatheGeometry(knobPoints, 32);

const leftKnob = new THREE.Mesh(knobGeo, matWoodGrey);
leftKnob.position.set(-75, baseHeight, 0);
routerPlane.add(leftKnob);

const rightKnob = new THREE.Mesh(knobGeo, matWoodGrey);
rightKnob.position.set(75, baseHeight, 0);
routerPlane.add(rightKnob);

// Knob Screws
const screwGeo = new THREE.CylinderGeometry(3, 3, 2, 16);
const slotGeo = new THREE.BoxGeometry(6, 2.2, 0.8);
[-75, 75].forEach(x => {
    const screw = new THREE.Mesh(screwGeo, matMachinedSteel);
    screw.position.set(x, baseHeight + 50, 0);
    const slot = new THREE.Mesh(slotGeo, matBlack);
    slot.position.set(x, baseHeight + 50, 0);
    slot.rotation.y = Math.PI / 4;
    routerPlane.add(screw);
    routerPlane.add(slot);
});

// --- 3. SECONDARY POST (Left) ---
const secPostGroup = new THREE.Group();
secPostGroup.position.set(-12, bridgeHeight + 4, 0);

const secPostCyl = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 30, 16), matMachinedSteel);
secPostCyl.position.y = 15;
secPostGroup.add(secPostCyl);

const secPostTop = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), matMachinedSteel);
secPostTop.position.y = 30;
secPostGroup.add(secPostTop);

// Thumbscrew
const ts1Group = new THREE.Group();
ts1Group.position.set(0, 4, 3.5);
ts1Group.rotation.x = Math.PI / 2;
ts1Group.rotation.y = -Math.PI / 4;

const ts1Base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 6, 16), matMachinedSteel);
ts1Base.position.y = 3;
ts1Group.add(ts1Base);

const ts1Head = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 2.5, 16), matMachinedSteel);
ts1Head.position.y = 7;
ts1Group.add(ts1Head);
secPostGroup.add(ts1Group);

routerPlane.add(secPostGroup);

// --- 4. BLADE MECHANISM (Right) ---
const bladeGroup = new THREE.Group();
bladeGroup.position.set(12, bridgeHeight + 6, 0);

// Main Shaft (Octagonal)
const shaft = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 50, 8), matMachinedSteel);
shaft.position.y = 15;
bladeGroup.add(shaft);

const shaftTop1 = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 2.5, 16), matMachinedSteel);
shaftTop1.position.y = 41.25;
bladeGroup.add(shaftTop1);

const shaftTop2 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 2, 16), matMachinedSteel);
shaftTop2.position.y = 43.5;
bladeGroup.add(shaftTop2);

// Blade
const bladePart = new THREE.Group();
bladePart.position.set(0, -10, 0);

const bladeVert = new THREE.Mesh(new THREE.BoxGeometry(6, 20, 6), matMachinedSteel);
bladePart.add(bladeVert);

const bladeCutShape = new THREE.Shape();
bladeCutShape.moveTo(-3, -10);
bladeCutShape.lineTo(-18, -10);
bladeCutShape.lineTo(-18, -12);
bladeCutShape.lineTo(-3, -15);
bladeCutShape.lineTo(3, -15);
bladeCutShape.lineTo(3, -10);

const bladeCut = new THREE.Mesh(new THREE.ExtrudeGeometry(bladeCutShape, { depth: 6, bevelEnabled: false }), matMachinedSteel);
bladeCut.position.set(0, 0, -3);
bladePart.add(bladeCut);
bladeGroup.add(bladePart);

// Collar
const collar = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 10, 32), matCastIron);
collar.position.y = 8;
bladeGroup.add(collar);

const collarRing = new THREE.Mesh(new THREE.TorusGeometry(12, 1.5, 16, 32), matCastIron);
collarRing.position.y = 8;
collarRing.rotation.x = Math.PI / 2;
bladeGroup.add(collarRing);

// Collar Thumbscrew
const collarTsGroup = new THREE.Group();
collarTsGroup.position.set(10, 8, 0);
collarTsGroup.rotation.y = -Math.PI / 5;

const collarTsShaft = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 16), matMachinedSteel);
collarTsShaft.rotation.z = -Math.PI / 2;
collarTsShaft.position.x = 4;
collarTsGroup.add(collarTsShaft);

const collarTsHead = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 3, 16), matMachinedSteel);
collarTsHead.rotation.z = -Math.PI / 2;
collarTsHead.position.x = 9;
collarTsGroup.add(collarTsHead);
bladeGroup.add(collarTsGroup);

// Adjustment Threaded Rod
const rod = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 35, 16), matMachinedSteel);
rod.position.set(0, 22, -10);
bladeGroup.add(rod);

// Top Bracket
const bracket = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 15), matCastIron);
bracket.position.set(0, 38, -5);
bladeGroup.add(bracket);

// Knurled Nut
const nutGroup = new THREE.Group();
nutGroup.position.set(0, 30, -10);

const nutCore = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 3.5, 32), matDarkMetal);
nutGroup.add(nutCore);

for(let i = 0; i < 24; i++) {
    const knurl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.5, 8), matDarkMetal);
    const angle = (i / 24) * Math.PI * 2;
    knurl.position.set(Math.cos(angle) * 9, 0, Math.sin(angle) * 9);
    nutGroup.add(knurl);
}
bladeGroup.add(nutGroup);

routerPlane.add(bladeGroup);

// Add entire assembly to scene
scene.add(routerPlane);

// Adjust Camera
camera.position.set(120, 100, 140);
camera.lookAt(0, 20, 0);