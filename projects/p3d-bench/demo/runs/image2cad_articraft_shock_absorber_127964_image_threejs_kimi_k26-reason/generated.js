// ============================================================
// Shock Absorber / Coilover Assembly
// Interpretation from the reference image:
//   - Vertical damper shaft running through a helical coil spring
//   - Top: clevis eyelet mount, adjustment stem, castellated preload nut,
//          threaded collar, and upper spring perch
//   - Middle: 6-turn coil spring centered on the damper shaft
//   - Bottom: lower spring perch, damper body, and bottom clevis eyelet
// ============================================================

// --- Shared Material ---
const steelMat = new THREE.MeshStandardMaterial({
  color: 0xbbbbbb,
  roughness: 0.35,
  metalness: 0.75
});

const holeMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.6,
  metalness: 0.4
});

// --- Unit scale ---
const u = 1.0;

// --- Central Damper Shaft (visible through the spring) ---
const shaftRadius = 1.4 * u;
const shaftTopY = 11.5 * u;
const shaftBottomY = -13.0 * u;
const shaftHeight = shaftTopY - shaftBottomY;
const shaftMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 32),
  steelMat
);
shaftMesh.position.y = (shaftTopY + shaftBottomY) / 2;
scene.add(shaftMesh);

// --- Coil Spring (helix generated with TubeGeometry) ---
const springMeanRadius = 5.0 * u;
const springWireRadius = 0.7 * u;
const springHeight = 18.0 * u;
const springTurns = 6;
const springCenterY = 0;

class HelixCurve extends THREE.Curve {
  constructor(radius, height, turns, offsetY) {
    super();
    this.radius = radius;
    this.height = height;
    this.turns = turns;
    this.offsetY = offsetY;
  }
  getPoint(t) {
    const angle = 2 * Math.PI * this.turns * t;
    const x = this.radius * Math.cos(angle);
    const z = this.radius * Math.sin(angle);
    const y = this.height * t - this.height / 2 + this.offsetY;
    return new THREE.Vector3(x, y, z);
  }
}

const helix = new HelixCurve(springMeanRadius, springHeight, springTurns, springCenterY);
const springGeom = new THREE.TubeGeometry(helix, 240, springWireRadius, 8, false);
const springMesh = new THREE.Mesh(springGeom, steelMat);
scene.add(springMesh);

// --- Spring Perches (seat the top and bottom of the coil) ---
const perchRadius = 6.0 * u;
const perchHeight = 0.8 * u;
const topPerchY = springHeight / 2 + perchHeight / 2;
const bottomPerchY = -springHeight / 2 - perchHeight / 2;

const topPerch = new THREE.Mesh(
  new THREE.CylinderGeometry(perchRadius, perchRadius, perchHeight, 32),
  steelMat
);
topPerch.position.y = topPerchY;
scene.add(topPerch);

const bottomPerch = new THREE.Mesh(
  new THREE.CylinderGeometry(perchRadius, perchRadius, perchHeight, 32),
  steelMat
);
bottomPerch.position.y = bottomPerchY;
scene.add(bottomPerch);

// --- Top Threaded Collar (below the adjustment nut) ---
const threadRadius = 2.2 * u;
const threadHeight = 3.0 * u;
const threadY = topPerchY + threadHeight / 2 + 0.5 * u;
const threadMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(threadRadius, threadRadius, threadHeight, 32),
  steelMat
);
threadMesh.position.y = threadY;
scene.add(threadMesh);

// --- Star / Castellated Preload Nut ---
// 8 rectangular teeth protruding from a cylindrical collar
const nutOuterRadius = 5.5 * u;
const nutInnerRadius = 2.4 * u;
const nutHeight = 2.5 * u;
const nutY = threadY + threadHeight / 2 + nutHeight / 2 + 0.2 * u;
const nutTeeth = 8;

function createStarNutShape(outerR, innerR, teeth) {
  const shape = new THREE.Shape();
  const baseR = outerR - 1.2 * u;
  const step = (Math.PI * 2) / teeth;
  const toothAngle = step * 0.45;

  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const a0 = a - toothAngle / 2;
    const a1 = a + toothAngle / 2;
    if (i === 0) {
      shape.moveTo(Math.cos(a0) * baseR, Math.sin(a0) * baseR);
    } else {
      shape.lineTo(Math.cos(a0) * baseR, Math.sin(a0) * baseR);
    }
    shape.lineTo(Math.cos(a0) * outerR, Math.sin(a0) * outerR);
    shape.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    shape.lineTo(Math.cos(a1) * baseR, Math.sin(a1) * baseR);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

const nutShape = createStarNutShape(nutOuterRadius, nutInnerRadius, nutTeeth);
const nutGeom = new THREE.ExtrudeGeometry(nutShape, {
  depth: nutHeight,
  bevelEnabled: false,
  curveSegments: 32
});
nutGeom.rotateX(-Math.PI / 2);
nutGeom.translate(0, -nutHeight / 2, 0); // center vertically
const nutMesh = new THREE.Mesh(nutGeom, steelMat);
nutMesh.position.y = nutY;
scene.add(nutMesh);

// --- Top Mount Stem (connects nut to eyelet) ---
const topStemRadius = 2.5 * u;
const topStemHeight = 3.5 * u;
const topStemY = nutY + nutHeight / 2 + topStemHeight / 2 + 0.5 * u;
const topStem = new THREE.Mesh(
  new THREE.CylinderGeometry(topStemRadius, topStemRadius, topStemHeight, 32),
  steelMat
);
topStem.position.y = topStemY;
scene.add(topStem);

// Rounded dome cap at the very top of the stem
const topCap = new THREE.Mesh(
  new THREE.SphereGeometry(topStemRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  steelMat
);
topCap.position.y = topStemY + topStemHeight / 2;
scene.add(topCap);

// --- Eyelet Helper (extruded ring with through-hole) ---
function createEyelet(outerR, innerR, width, mat) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: false,
    curveSegments: 32
  });
  geom.translate(0, 0, -width / 2);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.y = Math.PI / 2; // hole now runs along X
  return mesh;
}

// --- Top Eyelet (clevis / bushing mount) ---
const eyeletOuterRadius = 3.0 * u;
const eyeletHoleRadius = 1.2 * u;
const eyeletWidth = 5.5 * u;
const topEyeletY = topStemY + topStemHeight / 2 + 1.5 * u;

const topEyelet = createEyelet(eyeletOuterRadius, eyeletHoleRadius, eyeletWidth, steelMat);
topEyelet.position.y = topEyeletY;
scene.add(topEyelet);

// Dark inner cylinder to visually represent the empty through-hole
const topEyeletHole = new THREE.Mesh(
  new THREE.CylinderGeometry(eyeletHoleRadius, eyeletHoleRadius, eyeletWidth + 0.2, 32),
  holeMat
);
topEyeletHole.rotation.z = Math.PI / 2;
topEyeletHole.position.y = topEyeletY;
scene.add(topEyeletHole);

// --- Bottom Damper Body (below the lower spring perch) ---
const bottomBodyRadius = 3.0 * u;
const bottomBodyHeight = 5.0 * u;
const bottomBodyY = bottomPerchY - bottomBodyHeight / 2 - 0.5 * u;
const bottomBody = new THREE.Mesh(
  new THREE.CylinderGeometry(bottomBodyRadius, bottomBodyRadius, bottomBodyHeight, 32),
  steelMat
);
bottomBody.position.y = bottomBodyY;
scene.add(bottomBody);

// --- Bottom Eyelet ---
const bottomEyeletY = bottomBodyY - bottomBodyHeight / 2 - 1.5 * u;

const bottomEyelet = createEyelet(eyeletOuterRadius * 1.1, eyeletHoleRadius * 1.1, eyeletWidth * 1.1, steelMat);
bottomEyelet.position.y = bottomEyeletY;
scene.add(bottomEyelet);

const bottomEyeletHole = new THREE.Mesh(
  new THREE.CylinderGeometry(eyeletHoleRadius * 1.1, eyeletHoleRadius * 1.1, eyeletWidth * 1.1 + 0.2, 32),
  holeMat
);
bottomEyeletHole.rotation.z = Math.PI / 2;
bottomEyeletHole.position.y = bottomEyeletY;
scene.add(bottomEyeletHole);

// --- Camera framing ---
camera.position.set(30, 25, 30);
camera.lookAt(0, 2, 0);