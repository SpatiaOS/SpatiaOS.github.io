// ============================================================
// Semi-Hollow Electric Guitar (ES-335 Style)
// ============================================================

// --- Dimensions (units roughly proportional to cm) ---
const scaleLength = 65;           // Nut to bridge
const bodyDepth = 4.5;            // Total body thickness
const neckBackThickness = 2.6;    // Neck wood below fretboard
const fretboardThickness = 0.4;
const neckWidthNut = 4.3;         // Width at nut
const neckWidthHeel = 5.8;        // Width where neck meets body
const neckWidthEnd = 6.2;         // Fretboard end over body
const neckLength = 22;            // Nut to neck heel
const fretboardLength = 32;       // Nut to end of fretboard
const headstockLength = 10;
const headstockWidth = 6.5;
const fretCount = 22;

// --- Materials ---
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: 0.3, metalness: 0.1 });
const neckMat = new THREE.MeshStandardMaterial({ color: 0xE3C099, roughness: 0.5 });
const fretboardMat = new THREE.MeshStandardMaterial({ color: 0x2F1B0C, roughness: 0.6 });
const hardwareMat = new THREE.MeshStandardMaterial({ color: 0xDDDDDD, roughness: 0.2, metalness: 0.8 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.2 });
const stringMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.1, metalness: 0.9 });
const inlayMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.4 });

// --- Group ---
const guitar = new THREE.Group();
scene.add(guitar);

// ============================================================
// BODY
// ============================================================
// Approximate single-cutaway semi-hollow outline drawn in XY plane
const bodyShape = new THREE.Shape();
bodyShape.moveTo(20, 3); // neck pocket bass side

// Bass side (long horn, no cutaway)
bodyShape.bezierCurveTo(20, 10, 16, 16, 12, 18);
bodyShape.bezierCurveTo(8, 19, 6, 16, 10, 12);
bodyShape.bezierCurveTo(18, 10, 28, 14, 34, 14); // upper bout
bodyShape.bezierCurveTo(46, 14, 54, 10, 62, 18); // lower bout
bodyShape.bezierCurveTo(70, 14, 72, 6, 72, 0);   // bottom center

// Treble side (cutaway)
bodyShape.bezierCurveTo(72, -6, 70, -14, 62, -18);
bodyShape.bezierCurveTo(54, -10, 46, -14, 34, -14); // upper bout treble
bodyShape.bezierCurveTo(28, -14, 24, -10, 22, -6);  // cutaway curve
bodyShape.bezierCurveTo(20, -2, 18, -2, 16, -6);    // small treble horn tip
bodyShape.bezierCurveTo(18, -10, 19, -8, 20, -3);   // back to neck pocket
bodyShape.lineTo(20, 3);

const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, {
  depth: bodyDepth,
  bevelEnabled: true,
  bevelThickness: 0.6,
  bevelSize: 0.6,
  bevelSegments: 3
});
const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
bodyMesh.position.z = -bodyDepth / 2; // center thickness around Z=0
guitar.add(bodyMesh);

// ============================================================
// F-HOLES (stylized black cutout decals on top)
// ============================================================
const fHoleShape = new THREE.Shape();
fHoleShape.moveTo(0.5, 5);
fHoleShape.bezierCurveTo(2, 5, 2, 2.5, 0.5, 2);
fHoleShape.bezierCurveTo(-1, 1.5, -1.5, 0.5, -0.5, 0);
fHoleShape.bezierCurveTo(0.5, -0.5, 0.5, -1.5, -0.5, -2);
fHoleShape.bezierCurveTo(-2, -3, -2, -5.5, -0.5, -6.5);
fHoleShape.bezierCurveTo(1.5, -7, 2, -4.5, 0.5, -4);
fHoleShape.bezierCurveTo(-0.5, -3.5, -0.5, -2.5, 0, -2);
fHoleShape.bezierCurveTo(0.5, -1.5, 0.5, -0.5, 0, 0);
fHoleShape.bezierCurveTo(-0.5, 0.5, -0.5, 1.5, 0, 2);
fHoleShape.bezierCurveTo(0.5, 2.5, 0.5, 4.5, 0.5, 5);

const fHoleGeom = new THREE.ExtrudeGeometry(fHoleShape, { depth: 0.1, bevelEnabled: false });

const fHole1 = new THREE.Mesh(fHoleGeom, blackMat);
fHole1.position.set(38, 7, bodyDepth / 2 + 0.01);
fHole1.rotation.z = 0.18;
guitar.add(fHole1);

const fHole2 = new THREE.Mesh(fHoleGeom, blackMat);
fHole2.position.set(38, -7, bodyDepth / 2 + 0.01);
fHole2.scale.y = -1; // mirror across centerline
fHole2.rotation.z = 0.18;
guitar.add(fHole2);

// ============================================================
// NECK & HEADSTOCK
// ============================================================
// Neck back (wood under fretboard) – continuous from headstock to heel
const neckBackShape = new THREE.Shape();
neckBackShape.moveTo(-headstockLength, -headstockWidth / 2);
neckBackShape.lineTo(-headstockLength, headstockWidth / 2);
neckBackShape.lineTo(0, neckWidthNut / 2);
neckBackShape.lineTo(neckLength, neckWidthHeel / 2);
neckBackShape.lineTo(neckLength, -neckWidthHeel / 2);
neckBackShape.lineTo(0, -neckWidthNut / 2);
neckBackShape.lineTo(-headstockLength, -headstockWidth / 2);

const neckBackGeom = new THREE.ExtrudeGeometry(neckBackShape, { depth: neckBackThickness, bevelEnabled: false });
const neckBack = new THREE.Mesh(neckBackGeom, neckMat);
neckBack.position.z = bodyDepth / 2 - fretboardThickness - neckBackThickness;
guitar.add(neckBack);

// Fretboard
const fbShape = new THREE.Shape();
fbShape.moveTo(0, -neckWidthNut / 2);
fbShape.lineTo(0, neckWidthNut / 2);
fbShape.lineTo(fretboardLength, neckWidthEnd / 2);
fbShape.lineTo(fretboardLength, -neckWidthEnd / 2);
fbShape.lineTo(0, -neckWidthNut / 2);

const fbGeom = new THREE.ExtrudeGeometry(fbShape, { depth: fretboardThickness, bevelEnabled: false });
const fretboard = new THREE.Mesh(fbGeom, fretboardMat);
fretboard.position.z = bodyDepth / 2 - fretboardThickness;
guitar.add(fretboard);

// Frets
for (let i = 1; i <= fretCount; i++) {
  const dist = scaleLength * (1 - Math.pow(2, -i / 12));
  if (dist > fretboardLength) break;
  const t = dist / fretboardLength;
  const w = neckWidthNut + (neckWidthEnd - neckWidthNut) * t;
  const fretGeom = new THREE.BoxGeometry(0.12, w + 0.2, 0.08);
  const fret = new THREE.Mesh(fretGeom, hardwareMat);
  fret.position.set(dist, 0, bodyDepth / 2 + 0.04);
  guitar.add(fret);
}

// Block inlays
const inlayFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21];
for (const f of inlayFrets) {
  const dist = scaleLength * (1 - Math.pow(2, -f / 12));
  if (dist > fretboardLength) continue;
  const inlayGeom = new THREE.BoxGeometry(1.2, 0.7, 0.02);
  const inlay = new THREE.Mesh(inlayGeom, inlayMat);
  inlay.position.set(dist, 0, bodyDepth / 2 + 0.01);
  guitar.add(inlay);
}

// ============================================================
// HEADSTOCK HARDWARE (tuners)
// ============================================================
const tunerSpacing = 1.35;
const tunerStart = -8;
for (let i = 0; i < 6; i++) {
  const x = tunerStart + i * tunerSpacing;
  // Post
  const postGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
  const post = new THREE.Mesh(postGeom, hardwareMat);
  post.rotation.x = Math.PI / 2;
  post.position.set(x, headstockWidth / 2 + 0.4, bodyDepth / 2);
  guitar.add(post);
  // Knob
  const knobGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 10);
  const knob = new THREE.Mesh(knobGeom, blackMat);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(x, headstockWidth / 2 + 0.9, bodyDepth / 2);
  guitar.add(knob);
}

// ============================================================
// PICKUPS & RINGS
// ============================================================
function createPickupRing() {
  const s = new THREE.Shape();
  s.moveTo(-1.6, -3.4);
  s.lineTo(1.6, -3.4);
  s.lineTo(1.6, 3.4);
  s.lineTo(-1.6, 3.4);
  s.lineTo(-1.6, -3.4);
  const h = new THREE.Path();
  h.moveTo(-1.4, -3.2);
  h.lineTo(1.4, -3.2);
  h.lineTo(1.4, 3.2);
  h.lineTo(-1.4, 3.2);
  h.lineTo(-1.4, -3.2);
  s.holes.push(h);
  return new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: false });
}

const pickupGeom = new THREE.BoxGeometry(2.8, 6, 1.1);
const ringGeom = createPickupRing();

// Neck pickup
const neckPU = new THREE.Mesh(pickupGeom, blackMat);
neckPU.position.set(42, 0, bodyDepth / 2 + 0.55);
guitar.add(neckPU);
const neckRing = new THREE.Mesh(ringGeom, hardwareMat);
neckRing.position.set(42, 0, bodyDepth / 2 + 0.1);
guitar.add(neckRing);

// Bridge pickup
const bridgePU = new THREE.Mesh(pickupGeom, blackMat);
bridgePU.position.set(58, 0, bodyDepth / 2 + 0.55);
guitar.add(bridgePU);
const bridgeRing = new THREE.Mesh(ringGeom, hardwareMat);
bridgeRing.position.set(58, 0, bodyDepth / 2 + 0.1);
guitar.add(bridgeRing);

// ============================================================
// BRIDGE & TAILPIECE
// ============================================================
const bridgeGeom = new THREE.BoxGeometry(3.5, 1.6, 0.5);
const bridge = new THREE.Mesh(bridgeGeom, hardwareMat);
bridge.position.set(scaleLength, 0, bodyDepth / 2 + 0.25);
guitar.add(bridge);

const tailGeom = new THREE.BoxGeometry(3.5, 1.2, 0.5);
const tailpiece = new THREE.Mesh(tailGeom, hardwareMat);
tailpiece.position.set(72, 0, bodyDepth / 2 + 0.25);
guitar.add(tailpiece);

// ============================================================
// KNOBS & SWITCH
// ============================================================
const knobGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.9, 16);
const knobPos = [
  { x: 50, y: 10 }, { x: 54, y: 12 },
  { x: 50, y: -10 }, { x: 54, y: -12 }
];
for (const p of knobPos) {
  const k = new THREE.Mesh(knobGeom, blackMat);
  k.position.set(p.x, p.y, bodyDepth / 2 + 0.45);
  guitar.add(k);
}

const switchGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
const switchMesh = new THREE.Mesh(switchGeom, hardwareMat);
switchMesh.position.set(48, -10, bodyDepth / 2 + 0.4);
guitar.add(switchMesh);

// ============================================================
// STRINGS
// ============================================================
const stringSpacing = 3.2 / 5; // 6 strings across ~3.2 width
for (let i = 0; i < 6; i++) {
  const y = -1.6 + i * stringSpacing;

  // Tuner to nut
  const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 8, 4), stringMat);
  s1.rotation.z = Math.PI / 2;
  s1.position.set(-4, y, bodyDepth / 2 + 0.15);
  guitar.add(s1);

  // Nut to bridge (scale length)
  const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, scaleLength, 4), stringMat);
  s2.rotation.z = Math.PI / 2;
  s2.position.set(scaleLength / 2, y, bodyDepth / 2 + 0.15);
  guitar.add(s2);

  // Bridge to tailpiece
  const s3 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 7, 4), stringMat);
  s3.rotation.z = Math.PI / 2;
  s3.position.set(scaleLength + 3.5, y, bodyDepth / 2 + 0.15);
  guitar.add(s3);
}

// ============================================================
// CAMERA
// ============================================================
camera.position.set(30, -80, 70);
camera.lookAt(35, 0, 0);