// Parameters for a standard 120mm axial cooling fan
const fanSize = 120;           // Outer frame width/depth (mm)
const fanThickness = 25;       // Frame height (mm)
const innerRadius = 55;        // Inner shroud radius (mm)
const wallThick = 2.5;         // Outer wall thickness (mm)
const rimThick = 2;            // Top/bottom flange thickness (mm)
const bossSize = 15;           // Corner mounting boss size (mm)
const bossHoleRadius = 2.25;   // Mounting hole radius (mm)
const hubRadius = 19;          // Central hub radius (mm)
const hubHeight = 18;          // Central hub height (mm)
const bladeCount = 7;          // Number of impeller blades
const bladeRootR = 20;         // Blade root radius (mm)
const bladeTipR = 53;          // Blade tip radius (mm)
const bladeRootW = 24;         // Blade chord width at root (mm)
const bladeTipW = 16;          // Blade chord width at tip (mm)
const bladeSweep = 40;         // Blade sweep angle in plan view (degrees)
const bladeAxial = 10;         // Total axial twist offset from root to tip (mm)

// Shared material – gray plastic/metal fan housing
const fanMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  roughness: 0.5,
  metalness: 0.3,
  side: THREE.DoubleSide
});

// --- OUTER FRAME WALLS ---
// Four thin walls forming the square duct between corner bosses
const wallLen = fanSize - 2 * bossSize;
const wallGeoH = new THREE.BoxGeometry(wallLen, fanThickness, wallThick);
const wallGeoV = new THREE.BoxGeometry(wallThick, fanThickness, wallLen);

const wallFront = new THREE.Mesh(wallGeoH, fanMaterial);
wallFront.position.set(0, fanThickness / 2, fanSize / 2 - wallThick / 2);
scene.add(wallFront);

const wallBack = new THREE.Mesh(wallGeoH, fanMaterial);
wallBack.position.set(0, fanThickness / 2, -fanSize / 2 + wallThick / 2);
scene.add(wallBack);

const wallRight = new THREE.Mesh(wallGeoV, fanMaterial);
wallRight.position.set(fanSize / 2 - wallThick / 2, fanThickness / 2, 0);
scene.add(wallRight);

const wallLeft = new THREE.Mesh(wallGeoV, fanMaterial);
wallLeft.position.set(-fanSize / 2 + wallThick / 2, fanThickness / 2, 0);
scene.add(wallLeft);

// --- CORNER MOUNTING BOSSES ---
// Square bosses with through-holes at standard 105mm hole pattern
const bossShape = new THREE.Shape();
const bHalf = bossSize / 2;
bossShape.moveTo(-bHalf, -bHalf);
bossShape.lineTo(bHalf, -bHalf);
bossShape.lineTo(bHalf, bHalf);
bossShape.lineTo(-bHalf, bHalf);
bossShape.lineTo(-bHalf, -bHalf);

const bossHole = new THREE.Path();
bossHole.absarc(0, 0, bossHoleRadius, 0, Math.PI * 2, true);
bossShape.holes.push(bossHole);

const bossGeo = new THREE.ExtrudeGeometry(bossShape, {
  depth: fanThickness,
  bevelEnabled: false
});
bossGeo.rotateX(-Math.PI / 2);

const holeInset = fanSize / 2 - 7.5; // 52.5 mm from center
const cornerSigns = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
cornerSigns.forEach(([sx, sz]) => {
  const boss = new THREE.Mesh(bossGeo, fanMaterial);
  boss.position.set(sx * holeInset, 0, sz * holeInset);
  scene.add(boss);
});

// --- INNER SHROUD ---
// Thin cylindrical surface guiding airflow
const shroudGeo = new THREE.CylinderGeometry(
  innerRadius, innerRadius, fanThickness, 64, 1, true
);
const shroud = new THREE.Mesh(shroudGeo, fanMaterial);
shroud.position.y = fanThickness / 2;
scene.add(shroud);

// --- TOP & BOTTOM RIMS ---
// Square rings that cap the frame and join outer walls to inner shroud
const rimShape = new THREE.Shape();
const oHalf = fanSize / 2;
rimShape.moveTo(-oHalf, -oHalf);
rimShape.lineTo(oHalf, -oHalf);
rimShape.lineTo(oHalf, oHalf);
rimShape.lineTo(-oHalf, oHalf);
rimShape.lineTo(-oHalf, -oHalf);

const rimHole = new THREE.Path();
rimHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
rimShape.holes.push(rimHole);

const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
  depth: rimThick,
  bevelEnabled: false
});
rimGeo.rotateX(-Math.PI / 2);

const topRim = new THREE.Mesh(rimGeo, fanMaterial);
topRim.position.y = fanThickness - rimThick;
scene.add(topRim);

const bottomRim = new THREE.Mesh(rimGeo, fanMaterial);
bottomRim.position.y = 0;
scene.add(bottomRim);

// --- CENTRAL HUB ---
const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, hubHeight, 32);
const hub = new THREE.Mesh(hubGeo, fanMaterial);
hub.position.y = fanThickness / 2;
scene.add(hub);

// Slightly recessed hub cap
const capGeo = new THREE.CylinderGeometry(hubRadius * 0.85, hubRadius, 2, 32);
const cap = new THREE.Mesh(capGeo, fanMaterial);
cap.position.y = fanThickness / 2 + hubHeight / 2 + 1;
scene.add(cap);

// --- IMPELLER BLADES ---
// Custom curved, twisted blades generated as parametric surfaces
function createBladeGeometry(rootR, tipR, rootW, tipW, sweepDeg, axialOffset) {
  const sweepRad = sweepDeg * Math.PI / 180;
  const xSegs = 8; // radial segments
  const ySegs = 2; // chord segments
  const vertices = [];
  const indices = [];

  for (let ix = 0; ix <= xSegs; ix++) {
    const t = ix / xSegs;
    const r = rootR + t * (tipR - rootR);
    const w = rootW + t * (tipW - rootW);
    const angle = t * sweepRad;
    const y = t * axialOffset;
    const chordAngle = angle + Math.PI / 2;

    for (let iy = 0; iy <= ySegs; iy++) {
      const s = (iy / ySegs) - 0.5; // -0.5 .. 0.5 across blade width
      const offset = s * w;
      const vx = r * Math.cos(angle) + offset * Math.cos(chordAngle);
      const vz = r * Math.sin(angle) + offset * Math.sin(chordAngle);
      const vy = y;
      vertices.push(vx, vy, vz);
    }
  }

  for (let ix = 0; ix < xSegs; ix++) {
    for (let iy = 0; iy < ySegs; iy++) {
      const a = ix * (ySegs + 1) + iy;
      const b = a + 1;
      const c = a + (ySegs + 1);
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

const bladeGeo = createBladeGeometry(
  bladeRootR, bladeTipR, bladeRootW, bladeTipW, bladeSweep, bladeAxial
);

for (let i = 0; i < bladeCount; i++) {
  const blade = new THREE.Mesh(bladeGeo, fanMaterial);
  const angle = (i / bladeCount) * Math.PI * 2;
  blade.rotation.y = angle;
  blade.position.y = 7; // vertically centered within the frame cavity
  scene.add(blade);
}

// --- CAMERA ---
camera.position.set(120, 100, 120);
camera.lookAt(0, fanThickness / 2, 0);