// Parameters
const baseColor = 0xd3d3d3; // Light grey
const darkColor = 0x222222; // Dark grey/Black
const mainMaterial = new THREE.MeshStandardMaterial({ 
    color: baseColor, 
    roughness: 0.4, 
    metalness: 0.5 
});
const blackMaterial = new THREE.MeshStandardMaterial({ 
    color: darkColor, 
    roughness: 0.8, 
    metalness: 0.2 
});

// 1. Base Plate Construction
// The base is a complex shape, roughly dumbbell-like with a bridge.
const baseShape = new THREE.Shape();

// Define the outer perimeter
// Start bottom-left
baseShape.moveTo(-7.5, -3.5);
baseShape.lineTo(-7.5, 3.5);
// Top-left curve
baseShape.quadraticCurveTo(-5.5, 3.5, -3.5, 2.5);
// Bridge top edge
baseShape.lineTo(-1.5, 1.5);
baseShape.lineTo(1.5, 1.5);
// Top-right curve
baseShape.quadraticCurveTo(3.5, 2.5, 5.5, 3.5);
baseShape.lineTo(7.5, 3.5);
// Right side
baseShape.lineTo(7.5, -3.5);
// Bottom-right curve
baseShape.quadraticCurveTo(5.5, -3.5, 3.5, -2.5);
// Bridge bottom edge
baseShape.lineTo(1.5, -1.5);
baseShape.lineTo(-1.5, -1.5);
// Bottom-left curve
baseShape.quadraticCurveTo(-3.5, -2.5, -5.5, -3.5);
baseShape.lineTo(-7.5, -3.5);

// Add mounting holes (simple circles)
const hole1 = new THREE.Path();
hole1.absarc(-5.5, 0, 0.4, 0, Math.PI * 2, false);
baseShape.holes.push(hole1);

const hole2 = new THREE.Path();
hole2.absarc(5.5, 0, 0.4, 0, Math.PI * 2, false);
baseShape.holes.push(hole2);

// Extrude settings for the base
const baseExtrudeSettings = { 
    depth: 0.6, 
    bevelEnabled: true, 
    bevelThickness: 0.1, 
    bevelSize: 0.1, 
    bevelSegments: 3 
};

const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
const baseMesh = new THREE.Mesh(baseGeometry, mainMaterial);
// Rotate to lie flat on XZ plane
baseMesh.rotation.x = -Math.PI / 2;
baseMesh.position.y = 0;
scene.add(baseMesh);

// Add raised "pads" for labels (SIM and MK II)
const padGeo = new THREE.BoxGeometry(2, 0.1, 1);
const leftPad = new THREE.Mesh(padGeo, mainMaterial);
leftPad.position.set(-5, 0.7, 1.5);
scene.add(leftPad);

const rightPad = new THREE.Mesh(padGeo, mainMaterial);
rightPad.position.set(5, 0.7, -1.5);
scene.add(rightPad);

// 2. Left Ball Mount Assembly
const leftBallGroup = new THREE.Group();
leftBallGroup.position.set(-6, 0.6, 0);

// Cup Base
const cupBaseGeo = new THREE.CylinderGeometry(1.0, 1.4, 0.6, 32);
const cupBase = new THREE.Mesh(cupBaseGeo, mainMaterial);
cupBase.position.y = 0.3;
leftBallGroup.add(cupBase);

// Cup Neck (The ring holding the ball)
// Using a Torus to simulate the clamping ring
const cupNeckGeo = new THREE.TorusGeometry(1.1, 0.25, 16, 32);
const cupNeck = new THREE.Mesh(cupNeckGeo, mainMaterial);
cupNeck.rotation.x = Math.PI / 2;
cupNeck.position.y = 0.9;
leftBallGroup.add(cupNeck);

// The Ball
const ballGeo = new THREE.SphereGeometry(1.6, 32, 32);
const ball = new THREE.Mesh(ballGeo, mainMaterial);
ball.position.y = 1.6;
leftBallGroup.add(ball);

// Top Slot on the ball
const slotGeo = new THREE.BoxGeometry(0.15, 0.6, 1.6);
const slot = new THREE.Mesh(slotGeo, blackMaterial);
slot.position.y = 3.0;
leftBallGroup.add(slot);

scene.add(leftBallGroup);

// 3. Right Ball Mount Assembly (Mirrored)
const rightBallGroup = new THREE.Group();
rightBallGroup.position.set(6, 0.6, 0);

const rCupBase = new THREE.Mesh(cupBaseGeo, mainMaterial);
rCupBase.position.y = 0.3;
rightBallGroup.add(rCupBase);

const rCupNeck = new THREE.Mesh(cupNeckGeo, mainMaterial);
rCupNeck.rotation.x = Math.PI / 2;
rCupNeck.position.y = 0.9;
rightBallGroup.add(rCupNeck);

const rBall = new THREE.Mesh(ballGeo, mainMaterial);
rBall.position.y = 1.6;
rightBallGroup.add(rBall);

const rSlot = new THREE.Mesh(slotGeo, blackMaterial);
rSlot.position.y = 3.0;
rightBallGroup.add(rSlot);

scene.add(rightBallGroup);

// 4. Central Mechanism Assembly
const centerGroup = new THREE.Group();
centerGroup.position.set(0, 0.6, 0);

// Central Base Platform
const centerBaseGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.5, 32);
const centerBase = new THREE.Mesh(centerBaseGeo, mainMaterial);
centerBase.position.y = 0.25;
centerGroup.add(centerBase);

// Vertical Locking Pin (Left side of center mechanism)
const pinGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.2, 16);
const pin = new THREE.Mesh(pinGeo, mainMaterial);
pin.position.set(-1.0, 1.3, 0);
centerGroup.add(pin);

// Small Lever at base of pin
const leverGeo = new THREE.BoxGeometry(0.6, 0.15, 0.15);
const lever = new THREE.Mesh(leverGeo, mainMaterial);
lever.position.set(-1.0, 0.6, 0.6);
lever.rotation.y = Math.PI / 4;
centerGroup.add(lever);

// Main Clamp Body Base
const clampBaseGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.4, 32);
const clampBase = new THREE.Mesh(clampBaseGeo, mainMaterial);
clampBase.position.set(0.8, 0.5, 0);
centerGroup.add(clampBase);

// Two Vertical Posts for the clamp
const postGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.6, 16);
const post1 = new THREE.Mesh(postGeo, mainMaterial);
post1.position.set(0.5, 1.5, 0);
centerGroup.add(post1);

const post2 = new THREE.Mesh(postGeo, mainMaterial);
post2.position.set(1.1, 1.5, 0);
centerGroup.add(post2);

// Threaded Rod / Screw rising through the clamp
const screwGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16);
const screw = new THREE.Mesh(screwGeo, mainMaterial);
screw.position.set(0.8, 1.9, 0);
centerGroup.add(screw);

// Top Black Knob/Washer
const washerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
const washer = new THREE.Mesh(washerGeo, blackMaterial);
washer.position.set(0.8, 3.0, 0);
centerGroup.add(washer);

// Top Nut
const nutGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.25, 6);
const nut = new THREE.Mesh(nutGeo, mainMaterial);
nut.position.set(0.8, 3.2, 0);
centerGroup.add(nut);

// Side Tightening Knob (Knurled appearance simulated by cylinder)
const sideKnobGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.7, 32);
const sideKnob = new THREE.Mesh(sideKnobGeo, mainMaterial);
sideKnob.rotation.z = Math.PI / 2;
sideKnob.position.set(1.7, 1.5, 0);
centerGroup.add(sideKnob);

// Shaft for side knob
const sideShaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
const sideShaft = new THREE.Mesh(sideShaftGeo, mainMaterial);
sideShaft.rotation.z = Math.PI / 2;
sideShaft.position.set(1.3, 1.5, 0);
centerGroup.add(sideShaft);

scene.add(centerGroup);

// Adjust camera to view the whole assembly
camera.position.set(12, 12, 12);
camera.lookAt(0, 1, 0);