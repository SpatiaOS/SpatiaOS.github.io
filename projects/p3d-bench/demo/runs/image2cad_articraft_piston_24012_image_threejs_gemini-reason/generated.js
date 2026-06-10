// Parameters
const pistonRadius = 40;
const pistonHeight = 60;
const pistonY = 140; // Y position of the piston center

const pinRadius = 10;
const pinLength = 74;

const bigEndRadiusOut = 26;
const bigEndRadiusIn = 18;
const bigEndDepth = 20;

const smallEndRadiusOut = 16;
const smallEndRadiusIn = 10;
const smallEndDepth = 16;
const smallEndY = 135;

// Materials
const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.5,
    metalness: 0.5,
    side: THREE.DoubleSide
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.7,
    metalness: 0.3,
    side: THREE.DoubleSide
});

// ==========================================
// 1. Piston Head
// ==========================================
const pistonPoints = [];
let py = pistonHeight / 2;

// Top surface
pistonPoints.push(new THREE.Vector2(0, py));
pistonPoints.push(new THREE.Vector2(pistonRadius, py));

// Top land
py -= 8;
pistonPoints.push(new THREE.Vector2(pistonRadius, py));

// 3 Ring grooves
for (let i = 0; i < 3; i++) {
    pistonPoints.push(new THREE.Vector2(pistonRadius - 3, py)); // inward
    py -= 2;
    pistonPoints.push(new THREE.Vector2(pistonRadius - 3, py)); // down
    pistonPoints.push(new THREE.Vector2(pistonRadius, py));     // outward
    py -= 2;
    pistonPoints.push(new THREE.Vector2(pistonRadius, py));     // down (land)
}

// Skirt
py = -pistonHeight / 2;
pistonPoints.push(new THREE.Vector2(pistonRadius, py));

// Inner hollow
pistonPoints.push(new THREE.Vector2(pistonRadius - 5, py));
py = pistonHeight / 2 - 5;
pistonPoints.push(new THREE.Vector2(pistonRadius - 5, py));
pistonPoints.push(new THREE.Vector2(0, py));

const pistonGeo = new THREE.LatheGeometry(pistonPoints, 64);
const pistonMesh = new THREE.Mesh(pistonGeo, material);
pistonMesh.position.y = pistonY;
scene.add(pistonMesh);

// Piston top details (slit and center indent)
const slitGeo = new THREE.BoxGeometry(pistonRadius * 2, 0.5, 1);
const slitMesh = new THREE.Mesh(slitGeo, darkMaterial);
slitMesh.position.set(0, pistonY + pistonHeight / 2 + 0.1, 0);
scene.add(slitMesh);

const centerIndentGeo = new THREE.CylinderGeometry(8, 8, 0.5, 32);
const centerIndentMesh = new THREE.Mesh(centerIndentGeo, darkMaterial);
centerIndentMesh.position.set(0, pistonY + pistonHeight / 2 + 0.1, 0);
scene.add(centerIndentMesh);

// Piston Pin Boss Rings
const ringGeo = new THREE.TorusGeometry(14, 2, 16, 32);
ringGeo.rotateY(Math.PI / 2);
const ring1 = new THREE.Mesh(ringGeo, material);
ring1.position.set(pistonRadius - 1, pistonY - 5, 0);
const ring2 = new THREE.Mesh(ringGeo, material);
ring2.position.set(-pistonRadius + 1, pistonY - 5, 0);
scene.add(ring1, ring2);

// ==========================================
// 2. Piston Pin
// ==========================================
const pinGeo = new THREE.CylinderGeometry(pinRadius, pinRadius, pinLength, 32);
pinGeo.rotateZ(Math.PI / 2);
const pinMesh = new THREE.Mesh(pinGeo, material);
pinMesh.position.y = pistonY - 5;
scene.add(pinMesh);

// Inner dark hole for the pin
const pinHoleGeo = new THREE.CylinderGeometry(pinRadius - 3, pinRadius - 3, pinLength + 0.2, 32);
pinHoleGeo.rotateZ(Math.PI / 2);
const pinHoleMesh = new THREE.Mesh(pinHoleGeo, darkMaterial);
pinHoleMesh.position.y = pistonY - 5;
scene.add(pinHoleMesh);

// ==========================================
// 3. Connecting Rod - Small End
// ==========================================
const smallEndShape = new THREE.Shape();
smallEndShape.absarc(0, 0, smallEndRadiusOut, 0, Math.PI * 2, false);
const smallEndHole = new THREE.Path();
smallEndHole.absarc(0, 0, smallEndRadiusIn, 0, Math.PI * 2, true);
smallEndShape.holes.push(smallEndHole);

const smallExtrude = { depth: smallEndDepth, bevelEnabled: false, curveSegments: 32 };
const smallEndGeo = new THREE.ExtrudeGeometry(smallEndShape, smallExtrude);
smallEndGeo.translate(0, smallEndY, -smallEndDepth / 2);
const smallEndMesh = new THREE.Mesh(smallEndGeo, material);
scene.add(smallEndMesh);

// ==========================================
// 4. Connecting Rod - Big End
// ==========================================
const bigExtrude = { depth: bigEndDepth, bevelEnabled: false, curveSegments: 32 };

// Top Half
const topHalfShape = new THREE.Shape();
topHalfShape.absarc(0, 0, bigEndRadiusOut, 0, Math.PI, false);
topHalfShape.lineTo(-bigEndRadiusIn, 0);
topHalfShape.absarc(0, 0, bigEndRadiusIn, Math.PI, 0, true);
topHalfShape.lineTo(bigEndRadiusOut, 0);
const topHalfGeo = new THREE.ExtrudeGeometry(topHalfShape, bigExtrude);
topHalfGeo.translate(0, 0, -bigEndDepth / 2);
const topHalfMesh = new THREE.Mesh(topHalfGeo, material);
scene.add(topHalfMesh);

// Bottom Half (Cap)
const botHalfShape = new THREE.Shape();
botHalfShape.absarc(0, 0, bigEndRadiusOut, Math.PI, Math.PI * 2, false);
botHalfShape.lineTo(bigEndRadiusIn, 0);
botHalfShape.absarc(0, 0, bigEndRadiusIn, Math.PI * 2, Math.PI, true);
botHalfShape.lineTo(-bigEndRadiusOut, 0);
const botHalfGeo = new THREE.ExtrudeGeometry(botHalfShape, bigExtrude);
botHalfGeo.translate(0, 0, -bigEndDepth / 2);
const botHalfMesh = new THREE.Mesh(botHalfGeo, material);
scene.add(botHalfMesh);

// Lugs
const lugGeo = new THREE.BoxGeometry(16, 14, bigEndDepth);
const topLugR = new THREE.Mesh(lugGeo, material); topLugR.position.set(28, 7, 0);
const topLugL = new THREE.Mesh(lugGeo, material); topLugL.position.set(-28, 7, 0);
const botLugR = new THREE.Mesh(lugGeo, material); botLugR.position.set(28, -7, 0);
const botLugL = new THREE.Mesh(lugGeo, material); botLugL.position.set(-28, -7, 0);
scene.add(topLugR, topLugL, botLugR, botLugL);

// Seam lines to visually separate the cap
const seamLugGeo = new THREE.BoxGeometry(16.5, 0.5, bigEndDepth + 0.5);
const seamR = new THREE.Mesh(seamLugGeo, darkMaterial); seamR.position.set(28, 0, 0);
const seamL = new THREE.Mesh(seamLugGeo, darkMaterial); seamL.position.set(-28, 0, 0);
scene.add(seamR, seamL);

// Bolts and Nuts
const boltGeo = new THREE.CylinderGeometry(2.5, 2.5, 36, 16);
const boltR = new THREE.Mesh(boltGeo, darkMaterial); boltR.position.set(29, 0, 0);
const boltL = new THREE.Mesh(boltGeo, darkMaterial); boltL.position.set(-29, 0, 0);
scene.add(boltR, boltL);

const hexGeo = new THREE.CylinderGeometry(4.5, 4.5, 4, 6);
const nutTR = new THREE.Mesh(hexGeo, darkMaterial); nutTR.position.set(29, 16, 0);
const nutTL = new THREE.Mesh(hexGeo, darkMaterial); nutTL.position.set(-29, 16, 0);
const headBR = new THREE.Mesh(hexGeo, darkMaterial); headBR.position.set(29, -16, 0);
const headBL = new THREE.Mesh(hexGeo, darkMaterial); headBL.position.set(-29, -16, 0);
scene.add(nutTR, nutTL, headBR, headBL);

// ==========================================
// 5. Connecting Rod - Shaft (I-Beam with Truss)
// ==========================================
// Web (Central flat part)
const webShape = new THREE.Shape();
webShape.moveTo(-4, 130);
webShape.lineTo(-11, 20);
webShape.lineTo(11, 20);
webShape.lineTo(4, 130);
webShape.lineTo(-4, 130);

// Truss cutouts (triangular holes)
const t1 = new THREE.Path();
t1.moveTo(-6, 32); t1.lineTo(-5, 58); t1.lineTo(6, 45); t1.lineTo(-6, 32);
webShape.holes.push(t1);

const t2 = new THREE.Path();
t2.moveTo(5.5, 64); t2.lineTo(4.5, 90); t2.lineTo(-4.5, 77); t2.lineTo(5.5, 64);
webShape.holes.push(t2);

const t3 = new THREE.Path();
t3.moveTo(-4, 96); t3.lineTo(-3, 114); t3.lineTo(3.5, 106); t3.lineTo(-4, 96);
webShape.holes.push(t3);

const webExtrude = { depth: 4, bevelEnabled: false };
const webGeo = new THREE.ExtrudeGeometry(webShape, webExtrude);
webGeo.translate(0, 0, -2); // Center on Z axis
const webMesh = new THREE.Mesh(webGeo, material);
scene.add(webMesh);

// Side Flanges
const rFlangeShape = new THREE.Shape();
rFlangeShape.moveTo(2.5, 130);
rFlangeShape.lineTo(9, 20);
rFlangeShape.lineTo(12, 20);
rFlangeShape.lineTo(5.5, 130);
rFlangeShape.lineTo(2.5, 130);

const lFlangeShape = new THREE.Shape();
lFlangeShape.moveTo(-5.5, 130);
lFlangeShape.lineTo(-12, 20);
lFlangeShape.lineTo(-9, 20);
lFlangeShape.lineTo(-2.5, 130);
lFlangeShape.lineTo(-5.5, 130);

const flangeExtrude = { depth: 12, bevelEnabled: false };
const rFlangeGeo = new THREE.ExtrudeGeometry(rFlangeShape, flangeExtrude);
rFlangeGeo.translate(0, 0, -6);
const rFlangeMesh = new THREE.Mesh(rFlangeGeo, material);

const lFlangeGeo = new THREE.ExtrudeGeometry(lFlangeShape, flangeExtrude);
lFlangeGeo.translate(0, 0, -6);
const lFlangeMesh = new THREE.Mesh(lFlangeGeo, material);

scene.add(rFlangeMesh, lFlangeMesh);

// ==========================================
// Camera Adjustment
// ==========================================
camera.position.set(150, 150, 200);
camera.lookAt(0, 75, 0);