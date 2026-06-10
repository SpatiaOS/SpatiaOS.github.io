// ============================================================
// Retro Radio / Speaker Console
// Interpretation: A mid-century modern stereo unit with diagonal
// hexagonal speaker grilles, geometric front emblem, top controls,
// and four splayed tapered legs.
// ============================================================

// --- Parameters ---
const bodyWidth = 22;
const bodyHeight = 9;
const bodyDepth = 7;

const legLength = 10;
const legTopRadius = 0.6;
const legBottomRadius = 0.25;
const legSplay = Math.PI / 7; // ~25° outward splay
const legInset = 1.5;         // inset from side edges

const speakerOuterRadius = 3.6;
const speakerInnerRadius = 2.5;
const speakerCapRadius = 1.6;
const speakerRibCount = 24;

const starOuterRadius = 2.2;
const starInnerRadius = 0.7;

// --- Material ---
const material = new THREE.MeshStandardMaterial({
  color: 0xb0b0b0,
  roughness: 0.4,
  metalness: 0.1
});

// --- Main Body ---
const bodyGeom = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
const body = new THREE.Mesh(bodyGeom, material);
scene.add(body);

// --- Helper: Hexagonal Speaker Grille ---
function createSpeakerGrille() {
  const group = new THREE.Group();

  // Outer hexagonal rim
  const outerHex = new THREE.Mesh(
    new THREE.CylinderGeometry(speakerOuterRadius, speakerOuterRadius, 0.4, 6),
    material
  );
  outerHex.rotation.x = Math.PI / 2;
  outerHex.position.z = 0.2;
  group.add(outerHex);

  // Inner hexagonal rim
  const innerHex = new THREE.Mesh(
    new THREE.CylinderGeometry(speakerInnerRadius, speakerInnerRadius, 0.5, 6),
    material
  );
  innerHex.rotation.x = Math.PI / 2;
  innerHex.position.z = 0.25;
  group.add(innerHex);

  // Central circular speaker cap
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(speakerCapRadius, speakerCapRadius, 0.6, 32),
    material
  );
  cap.rotation.x = Math.PI / 2;
  cap.position.z = 0.3;
  group.add(cap);

  // Radial ribs between cap and inner hexagon
  const ribStart = speakerCapRadius + 0.1;
  const ribEnd = speakerInnerRadius - 0.1;
  const ribMid = (ribStart + ribEnd) / 2;
  const ribLen = ribEnd - ribStart;

  for (let i = 0; i < speakerRibCount; i++) {
    const angle = (i / speakerRibCount) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, ribLen, 0.35),
      material
    );
    rib.position.set(Math.cos(angle) * ribMid, Math.sin(angle) * ribMid, 0.25);
    rib.rotation.z = angle;
    group.add(rib);
  }

  return group;
}

// Left speaker (upper-left on front face)
const leftSpeaker = createSpeakerGrille();
leftSpeaker.position.set(-5.5, 2, bodyDepth / 2);
scene.add(leftSpeaker);

// Right speaker (lower-right on front face)
const rightSpeaker = createSpeakerGrille();
rightSpeaker.position.set(5.5, -2, bodyDepth / 2);
scene.add(rightSpeaker);

// --- Center Star Emblem ---
// Four-pointed star extruded slightly from the front face
const starShape = new THREE.Shape();
const points = 4;
for (let i = 0; i < points * 2; i++) {
  const r = i % 2 === 0 ? starOuterRadius : starInnerRadius;
  const a = (i / (points * 2)) * Math.PI * 2;
  const x = Math.cos(a) * r;
  const y = Math.sin(a) * r;
  if (i === 0) starShape.moveTo(x, y);
  else starShape.lineTo(x, y);
}
starShape.closePath();

const starGeom = new THREE.ExtrudeGeometry(starShape, {
  depth: 0.4,
  bevelEnabled: false
});
const star = new THREE.Mesh(starGeom, material);
star.position.set(0, 0, bodyDepth / 2 + 0.2);
scene.add(star);

// --- Top Panel Dividers ---
// Two shallow ridges dividing the top into three strips along the depth
const dividerGeom = new THREE.BoxGeometry(bodyWidth - 0.2, 0.15, 0.15);
const divider1 = new THREE.Mesh(dividerGeom, material);
divider1.position.set(0, bodyHeight / 2 + 0.075, -bodyDepth / 6);
scene.add(divider1);

const divider2 = new THREE.Mesh(dividerGeom, material);
divider2.position.set(0, bodyHeight / 2 + 0.075, bodyDepth / 6);
scene.add(divider2);

// --- Top Control Buttons ---
// Three small cylindrical knobs on the right side, arranged front-to-back
const buttonGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
const buttonZPositions = [1.5, 0, -1.5];
buttonZPositions.forEach(z => {
  const btn = new THREE.Mesh(buttonGeom, material);
  btn.position.set(bodyWidth / 2 - 2.5, bodyHeight / 2 + 0.15, z);
  scene.add(btn);
});

// --- Legs ---
// Tapered cylinders with pivot at top so rotation splays the foot outward
function addLeg(x, z, rotX, rotZ) {
  const geom = new THREE.CylinderGeometry(legTopRadius, legBottomRadius, legLength, 12);
  geom.translate(0, -legLength / 2, 0); // pivot at top
  const leg = new THREE.Mesh(geom, material);
  leg.position.set(x, -bodyHeight / 2, z);
  leg.rotation.x = rotX;
  leg.rotation.z = rotZ;
  scene.add(leg);
}

const lx = bodyWidth / 2 - legInset;
const lz = bodyDepth / 2 - legInset;

// Front-Left: splay forward (+Z) and left (-X)
addLeg(-lx, lz, -legSplay, -legSplay);
// Back-Left: splay backward (-Z) and left (-X)
addLeg(-lx, -lz, legSplay, -legSplay);
// Front-Right: splay forward (+Z) and right (+X)
addLeg(lx, lz, -legSplay, legSplay);
// Back-Right: splay backward (-Z) and right (+X)
addLeg(lx, -lz, legSplay, legSplay);

// --- Camera ---
camera.position.set(25, 20, 25);
camera.lookAt(0, 0, 0);