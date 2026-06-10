// ==========================================
// Piston with Connecting Rod - Parameters
// ==========================================

// Piston dimensions
const PISTON_RADIUS = 6;
const PISTON_HEIGHT = 11;
const DOME_HEIGHT = 1.5;
const RING_GROOVE_COUNT = 3;
const GROOVE_HEIGHT = 0.3;
const GROOVE_DEPTH = 0.15;
const LAND_HEIGHT = 0.6;
const TOP_LAND_HEIGHT = 1.0;

// Wrist pin / piston pin
const WRIST_PIN_RADIUS = 1.4;
const WRIST_PIN_LENGTH = 13;
const WRIST_PIN_Y = -6.5; // Distance down from piston crown top

// Piston pin bosses
const BOSS_RADIUS = 3.2;
const BOSS_DEPTH = 1.0;

// Connecting rod dimensions
const ROD_LENGTH = 26;           // Center-to-center distance
const ROD_THICKNESS = 2.0;       // Thickness along crankshaft axis
const SMALL_END_RADIUS = 3.0;
const SMALL_END_WIDTH = 2.2;
const BIG_END_OUTER_RADIUS = 5.0;
const BIG_END_INNER_RADIUS = 3.2;
const BIG_END_WIDTH = 3.5;

// Rod bolts
const BOLT_RADIUS = 0.35;
const BOLT_HEAD_RADIUS = 0.7;
const BOLT_HEAD_HEIGHT = 0.35;
const BOLT_LENGTH = 3.5;

// Materials
const pistonMat = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  roughness: 0.4,
  metalness: 0.7
});
const darkMat = new THREE.MeshStandardMaterial({
  color: 0x777777,
  roughness: 0.5,
  metalness: 0.6
});

// ==========================================
// Piston Head Assembly
// ==========================================
const pistonGroup = new THREE.Group();

// --- Crown (domed top with slight valve pocket) ---
const crownProfile = [];
crownProfile.push(new THREE.Vector2(0, 0));
crownProfile.push(new THREE.Vector2(1.5, 0));          // Valve pocket flat
crownProfile.push(new THREE.Vector2(1.5, -0.2));       // Pocket depth
crownProfile.push(new THREE.Vector2(PISTON_RADIUS - 0.5, -0.8));
crownProfile.push(new THREE.Vector2(PISTON_RADIUS, -DOME_HEIGHT));
crownProfile.push(new THREE.Vector2(PISTON_RADIUS, -DOME_HEIGHT - 0.2));
const crownGeo = new THREE.LatheGeometry(crownProfile, 64);
const crown = new THREE.Mesh(crownGeo, pistonMat);
pistonGroup.add(crown);

// Valve pocket surface indicator (thin dark disc)
const pocketGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
const pocket = new THREE.Mesh(pocketGeo, darkMat);
pocket.position.y = 0.025;
pistonGroup.add(pocket);

// --- Ring pack and skirt (stacked cylinders) ---
let yCursor = -DOME_HEIGHT;

// Top land (cylindrical section just below dome)
const topLandGeo = new THREE.CylinderGeometry(PISTON_RADIUS, PISTON_RADIUS, TOP_LAND_HEIGHT, 64);
const topLand = new THREE.Mesh(topLandGeo, pistonMat);
topLand.position.y = yCursor - TOP_LAND_HEIGHT / 2;
pistonGroup.add(topLand);
yCursor -= TOP_LAND_HEIGHT;

// Groove + land cycles
for (let i = 0; i < RING_GROOVE_COUNT; i++) {
  // Ring groove (slightly reduced radius)
  const grooveGeo = new THREE.CylinderGeometry(
    PISTON_RADIUS - GROOVE_DEPTH,
    PISTON_RADIUS - GROOVE_DEPTH,
    GROOVE_HEIGHT,
    64
  );
  const groove = new THREE.Mesh(grooveGeo, darkMat);
  groove.position.y = yCursor - GROOVE_HEIGHT / 2;
  pistonGroup.add(groove);
  yCursor -= GROOVE_HEIGHT;

  // Land between grooves (full radius) - skip after last groove
  if (i < RING_GROOVE_COUNT - 1) {
    const landGeo = new THREE.CylinderGeometry(PISTON_RADIUS, PISTON_RADIUS, LAND_HEIGHT, 64);
    const land = new THREE.Mesh(landGeo, pistonMat);
    land.position.y = yCursor - LAND_HEIGHT / 2;
    pistonGroup.add(land);
    yCursor -= LAND_HEIGHT;
  }
}

// Final land before skirt
const bottomLandGeo = new THREE.CylinderGeometry(PISTON_RADIUS, PISTON_RADIUS, LAND_HEIGHT, 64);
const bottomLand = new THREE.Mesh(bottomLandGeo, pistonMat);
bottomLand.position.y = yCursor - LAND_HEIGHT / 2;
pistonGroup.add(bottomLand);
yCursor -= LAND_HEIGHT;

// Skirt (tapers slightly toward bottom)
const skirtHeight = PISTON_HEIGHT - Math.abs(yCursor);
const skirtGeo = new THREE.CylinderGeometry(PISTON_RADIUS, PISTON_RADIUS * 0.98, skirtHeight, 64);
const skirt = new THREE.Mesh(skirtGeo, pistonMat);
skirt.position.y = yCursor - skirtHeight / 2;
pistonGroup.add(skirt);

// --- Wrist pin bosses (protrusions on sides) ---
const bossGeo = new THREE.CylinderGeometry(BOSS_RADIUS, BOSS_RADIUS, BOSS_DEPTH, 32);
const leftBoss = new THREE.Mesh(bossGeo, pistonMat);
leftBoss.rotation.z = Math.PI / 2;
leftBoss.position.set(-(PISTON_RADIUS + BOSS_DEPTH / 2 - 0.1), WRIST_PIN_Y, 0);
pistonGroup.add(leftBoss);

const rightBoss = new THREE.Mesh(bossGeo, pistonMat);
rightBoss.rotation.z = Math.PI / 2;
rightBoss.position.set((PISTON_RADIUS + BOSS_DEPTH / 2 - 0.1), WRIST_PIN_Y, 0);
pistonGroup.add(rightBoss);

// --- Wrist pin (through bosses and rod small end) ---
const pinGeo = new THREE.CylinderGeometry(WRIST_PIN_RADIUS, WRIST_PIN_RADIUS, WRIST_PIN_LENGTH, 24);
const wristPin = new THREE.Mesh(pinGeo, darkMat);
wristPin.rotation.z = Math.PI / 2;
wristPin.position.set(0, WRIST_PIN_Y, 0);
pistonGroup.add(wristPin);

scene.add(pistonGroup);

// ==========================================
// Connecting Rod Assembly
// ==========================================
const rodGroup = new THREE.Group();

// --- Small end bearing (rod eye) ---
const smallEndShape = new THREE.Shape();
smallEndShape.absarc(0, 0, SMALL_END_RADIUS, 0, Math.PI * 2, false);
const smallEndHole = new THREE.Path();
smallEndHole.absarc(0, 0, WRIST_PIN_RADIUS + 0.15, 0, Math.PI * 2, true);
smallEndShape.holes.push(smallEndHole);

const smallEndGeo = new THREE.ExtrudeGeometry(smallEndShape, {
  depth: SMALL_END_WIDTH,
  bevelEnabled: false,
  curveSegments: 64
});
smallEndGeo.translate(0, 0, -SMALL_END_WIDTH / 2);
const smallEnd = new THREE.Mesh(smallEndGeo, pistonMat);
smallEnd.rotation.y = Math.PI / 2;
smallEnd.position.set(0, 0, 0); // Local origin at wrist pin center
rodGroup.add(smallEnd);

// --- Rod beam (I-beam style web with lightening holes) ---
// Profile drawn in XY, later rotated so extrusion runs along crankshaft axis (X)
const beamShape = new THREE.Shape();
const bY1 = -SMALL_END_RADIUS;                 // Top of beam (bottom of small end)
const bY2 = -ROD_LENGTH + BIG_END_OUTER_RADIUS; // Bottom of beam (top of big end)
const bHW1 = 1.2; // Half-width at top
const bHW2 = 1.0; // Half-width at mid
const bHW3 = 2.6; // Half-width at bottom (flared into big end)

beamShape.moveTo(-bHW1, bY1);
beamShape.lineTo(-bHW2, bY1 - 5);
beamShape.lineTo(-bHW3, bY2);
beamShape.lineTo(bHW3, bY2);
beamShape.lineTo(bHW2, bY1 - 5);
beamShape.lineTo(bHW1, bY1);
beamShape.closePath();

// Lightening holes in web
const h1 = new THREE.Path();
h1.absarc(0, bY1 - 3.5, 0.9, 0, Math.PI * 2, true);
beamShape.holes.push(h1);

const h2 = new THREE.Path();
h2.absarc(0, (bY1 + bY2) / 2 + 1, 0.8, 0, Math.PI * 2, true);
beamShape.holes.push(h2);

const h3 = new THREE.Path();
h3.absarc(0, bY2 + 3.5, 0.7, 0, Math.PI * 2, true);
beamShape.holes.push(h3);

const beamGeo = new THREE.ExtrudeGeometry(beamShape, {
  depth: ROD_THICKNESS,
  bevelEnabled: false,
  curveSegments: 64
});
beamGeo.translate(0, 0, -ROD_THICKNESS / 2);
const beam = new THREE.Mesh(beamGeo, pistonMat);
beam.rotation.y = Math.PI / 2;
rodGroup.add(beam);

// --- Big end bearing (crankshaft end) ---
const bigEndShape = new THREE.Shape();
bigEndShape.absarc(0, 0, BIG_END_OUTER_RADIUS, 0, Math.PI * 2, false);
const bigEndHole = new THREE.Path();
bigEndHole.absarc(0, 0, BIG_END_INNER_RADIUS, 0, Math.PI * 2, true);
bigEndShape.holes.push(bigEndHole);

const bigEndGeo = new THREE.ExtrudeGeometry(bigEndShape, {
  depth: BIG_END_WIDTH,
  bevelEnabled: false,
  curveSegments: 64
});
bigEndGeo.translate(0, 0, -BIG_END_WIDTH / 2);
const bigEnd = new THREE.Mesh(bigEndGeo, pistonMat);
bigEnd.rotation.y = Math.PI / 2;
bigEnd.position.set(0, -ROD_LENGTH, 0);
rodGroup.add(bigEnd);

// --- Cap bolts (two bolts on sides of big end) ---
const boltGeo = new THREE.CylinderGeometry(BOLT_RADIUS, BOLT_RADIUS, BOLT_LENGTH, 8);
const boltHeadGeo = new THREE.CylinderGeometry(BOLT_HEAD_RADIUS, BOLT_HEAD_RADIUS, BOLT_HEAD_HEIGHT, 6);

const boltZ = BIG_END_OUTER_RADIUS * 0.75;
const boltY = -ROD_LENGTH - 1.2;

for (const zSign of [-1, 1]) {
  // Bolt shank
  const bolt = new THREE.Mesh(boltGeo, darkMat);
  bolt.position.set(0, boltY, zSign * boltZ);
  rodGroup.add(bolt);

  // Bolt head (bottom)
  const head = new THREE.Mesh(boltHeadGeo, darkMat);
  head.position.set(0, boltY - BOLT_LENGTH / 2 - BOLT_HEAD_HEIGHT / 2, zSign * boltZ);
  rodGroup.add(head);

  // Nut (top)
  const nut = new THREE.Mesh(boltHeadGeo, darkMat);
  nut.position.set(0, boltY + BOLT_LENGTH / 2 + BOLT_HEAD_HEIGHT / 2, zSign * boltZ);
  rodGroup.add(nut);
}

// Position entire rod so small end aligns with wrist pin
rodGroup.position.set(0, WRIST_PIN_Y, 0);
scene.add(rodGroup);

// ==========================================
// Camera framing
// ==========================================
camera.position.set(30, 15, 40);
camera.lookAt(0, -10, 0);