// Parameters
const bodyColor = 0x888888;
const neckColor = 0x554433;
const fretboardColor = 0x222222;
const hardwareColor = 0xcccccc;

const guitarGroup = new THREE.Group();

// --- BODY ---
// ES-335 Style Double Cutaway
const bodyShape = new THREE.Shape();
bodyShape.moveTo(0, -11);
bodyShape.bezierCurveTo(4, -11, 6, -7, 6, -3);
bodyShape.bezierCurveTo(6, 1, 4, 3, 3, 5);
bodyShape.bezierCurveTo(4, 7, 5, 9, 2, 10);
bodyShape.lineTo(1, 12);
bodyShape.lineTo(-1, 12);
bodyShape.lineTo(-2, 10);
bodyShape.bezierCurveTo(-5, 9, -4, 7, -3, 5);
bodyShape.bezierCurveTo(-4, 3, -6, 1, -6, -3);
bodyShape.bezierCurveTo(-6, -7, -4, -11, 0, -11);

const bodyExtrudeSettings = { depth: 1.2, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15, bevelSegments: 4 };
const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
bodyGeometry.center(); 
const bodyMaterial = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.6, metalness: 0.1 });
const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
guitarGroup.add(bodyMesh);

// --- NECK ---
const neckLength = 16;
const neckWidth = 1.8;
const neckThickness = 0.6;
const neckGeometry = new THREE.BoxGeometry(neckWidth, neckLength, neckThickness);
const neckMaterial = new THREE.MeshStandardMaterial({ color: neckColor });
const neckMesh = new THREE.Mesh(neckGeometry, neckMaterial);
// Position neck to overlap the top of the body
neckMesh.position.set(0, 10 + neckLength/2 - 2, 0); 
guitarGroup.add(neckMesh);

// --- FRETBOARD ---
const fretboardLength = 16;
const fretboardWidth = 2.0;
const fretboardThickness = 0.1;
const fretboardGeometry = new THREE.BoxGeometry(fretboardWidth, fretboardLength, fretboardThickness);
const fretboardMaterial = new THREE.MeshStandardMaterial({ color: fretboardColor });
const fretboardMesh = new THREE.Mesh(fretboardGeometry, fretboardMaterial);
fretboardMesh.position.copy(neckMesh.position);
fretboardMesh.position.z += (neckThickness/2 + fretboardThickness/2);
guitarGroup.add(fretboardMesh);

// --- FRETS ---
const numFrets = 22;
const fretMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8 });
const neckStartY = 8; // Approximate start of neck relative to group center
for (let i = 0; i < numFrets; i++) {
    const dist = (i + 1) * 0.7; 
    const fretGeo = new THREE.BoxGeometry(fretboardWidth + 0.1, 0.05, 0.05);
    const fretMesh = new THREE.Mesh(fretGeo, fretMaterial);
    fretMesh.position.set(0, neckStartY + dist, fretboardMesh.position.z + fretboardThickness/2 + 0.03);
    guitarGroup.add(fretMesh);
}

// --- HEADSTOCK ---
const headstockLength = 4;
const headstockWidth = 2.2;
const headstockThickness = 0.5;
const headstockGroup = new THREE.Group();
const headstockGeometry = new THREE.BoxGeometry(headstockWidth, headstockLength, headstockThickness);
const headstockMesh = new THREE.Mesh(headstockGeometry, neckMaterial);
headstockGroup.add(headstockMesh);

const pegMaterial = new THREE.MeshStandardMaterial({ color: hardwareColor, metalness: 0.9 });
const pegGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12);
for (let i = 0; i < 3; i++) {
    const pegL = new THREE.Mesh(pegGeo, pegMaterial);
    pegL.rotation.z = Math.PI / 2;
    pegL.position.set(-headstockWidth/2 - 0.4, -1 + i * 1.2, 0);
    headstockGroup.add(pegL);
    
    const pegR = new THREE.Mesh(pegGeo, pegMaterial);
    pegR.rotation.z = Math.PI / 2;
    pegR.position.set(headstockWidth/2 + 0.4, -1 + i * 1.2, 0);
    headstockGroup.add(pegR);
}

headstockGroup.position.set(0, neckStartY + fretboardLength + headstockLength/2 - 1, 0);
headstockGroup.rotation.x = -0.2; 
guitarGroup.add(headstockGroup);

// --- PICKUPS ---
const pickupMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
const pickupGeo = new THREE.BoxGeometry(2.2, 0.8, 0.3);
const pickupNeck = new THREE.Mesh(pickupGeo, pickupMaterial);
pickupNeck.position.set(0, 2, 0.8); 
guitarGroup.add(pickupNeck);
const pickupBridge = new THREE.Mesh(pickupGeo, pickupMaterial);
pickupBridge.position.set(0, -1, 0.8);
guitarGroup.add(pickupBridge);

// --- BRIDGE AND TAILPIECE ---
const bridgeGeo = new THREE.BoxGeometry(2.5, 0.3, 0.5);
const bridgeMat = new THREE.MeshStandardMaterial({ color: hardwareColor, metalness: 0.9 });
const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
bridgeMesh.position.set(0, -3.5, 0.8);
guitarGroup.add(bridgeMesh);

const tailpieceShape = new THREE.Shape();
tailpieceShape.moveTo(-1.5, 0);
tailpieceShape.lineTo(1.5, 0);
tailpieceShape.lineTo(1.2, -0.5);
tailpieceShape.lineTo(-1.2, -0.5);
tailpieceShape.lineTo(-1.5, 0);
const tailpieceGeo = new THREE.ExtrudeGeometry(tailpieceShape, { depth: 0.3, bevelEnabled: false });
const tailpieceMesh = new THREE.Mesh(tailpieceGeo, bridgeMat);
tailpieceMesh.position.set(0, -5, 0.6);
guitarGroup.add(tailpieceMesh);

// --- KNOBS ---
const knobGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16);
const knobMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const knobLocs = [
    { x: 3, y: 2 },
    { x: 3, y: 0 },
    { x: 3, y: -2 },
    { x: 3, y: -4 }
];
for (let k of knobLocs) {
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.rotation.x = Math.PI / 2; 
    knob.position.set(k.x, k.y, 0.6);
    guitarGroup.add(knob);
}

// --- SWITCH ---
const switchGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
const switchMesh = new THREE.Mesh(switchGeo, new THREE.MeshStandardMaterial({color: 0xcccccc}));
switchMesh.rotation.z = Math.PI / 2;
switchMesh.position.set(0, 4, 0.8);
guitarGroup.add(switchMesh);

// --- F-HOLES (Black overlays) ---
function createFHoleShape() {
    const s = new THREE.Shape();
    s.moveTo(0, 1.8);
    s.bezierCurveTo(0.8, 1.8, 0.8, 1.0, 0.4, 0.6);
    s.lineTo(0.2, -0.8);
    s.bezierCurveTo(0.2, -1.4, -0.5, -1.4, -0.5, -0.8);
    s.bezierCurveTo(-0.5, -0.4, 0, -0.4, 0, 0);
    s.lineTo(0, 1.8);
    return s;
}

const fHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const fHoleGeo = new THREE.ShapeGeometry(createFHoleShape());

const fHoleR = new THREE.Mesh(fHoleGeo, fHoleMat);
fHoleR.position.set(3, 4, 0.65); 
fHoleR.rotation.z = -0.2;
guitarGroup.add(fHoleR);

const fHoleL = new THREE.Mesh(fHoleGeo, fHoleMat);
fHoleL.position.set(-3, 4, 0.65);
fHoleL.rotation.z = 0.2; 
fHoleL.scale.x = -1; 
guitarGroup.add(fHoleL);

// --- ORIENTATION ---
// Rotate to match image: Neck top-left, Body bottom-right.
guitarGroup.rotation.z = Math.PI * 0.75;
guitarGroup.rotation.x = 0.4;

scene.add(guitarGroup);

camera.position.set(15, 15, 15);
camera.lookAt(0, 0, 0);