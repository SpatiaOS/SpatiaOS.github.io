// Hand-cranked mill / grinder with ring-gear reduction
// Interpretation of the CAD model:
// - Cast triangular stand with a stabilizing foot
// - Thick internal ring gear (flywheel housing)
// - Inner 4-spoke gear / spider (planetary-style carrier)
// - Tapered barrel / housing with a hollow nozzle
// - Dual crank handles with tubular grips
// - Side crank on the barrel

// ---------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------
const WHEEL_Y = 6.4;
const WHEEL_OUTER_R = 6.05;
const WHEEL_INNER_R = 4.92;
const WHEEL_THICK = 1.75;
const WHEEL_TEETH = 52;
const WHEEL_TOOTH_DEPTH = 0.34;

const INNER_ROOT_R = 3.98;
const INNER_RIM_W = 0.58;
const INNER_TEETH = 32;
const INNER_TOOTH_DEPTH = 0.24;
const INNER_THICK = 0.62;

const HUB_R = 0.82;
const SPOKE_W = 0.72;
const SPOKE_T = 0.52;

const BASE_T = 0.95;
const HOUSING_LEN = 6.75;

const ARM_T = 0.44;
const GRIP_R = 0.33;
const GRIP_LEN = 1.85;
const GRIP_BORE = 0.16;

// ---------------------------------------------------------------------------
// Materials (matte CAD grey)
// ---------------------------------------------------------------------------
const metal = new THREE.MeshStandardMaterial({
  color: 0xc2c2c2,
  metalness: 0.38,
  roughness: 0.47
});
const metalDark = new THREE.MeshStandardMaterial({
  color: 0x9a9a9a,
  metalness: 0.4,
  roughness: 0.52
});

const machine = new THREE.Group();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toothGeom(depth, rootW, tipW, thick) {
  const s = new THREE.Shape();
  s.moveTo(-rootW / 2, 0);
  s.lineTo(-tipW / 2, depth);
  s.lineTo(tipW / 2, depth);
  s.lineTo(rootW / 2, 0);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false });
  g.translate(0, 0, -thick / 2);
  return g;
}

function addTeeth(parent, opts) {
  const {
    count, radius, depth, rootW, tipW, thick, inward, material, z = 0
  } = opts;
  const g = toothGeom(depth, rootW, tipW, thick);
  const rot = inward ? Math.PI / 2 : -Math.PI / 2;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const m = new THREE.Mesh(g, material);
    m.position.set(Math.cos(a) * radius, Math.sin(a) * radius, z);
    m.rotation.z = a + rot;
    parent.add(m);
  }
}

function annulusGeom(outerR, innerR, depth, segs) {
  const s = new THREE.Shape();
  s.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  h.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  s.holes.push(h);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: false,
    curveSegments: segs
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

function tubeMesh(outerR, innerR, length, segs, material) {
  const m = new THREE.Mesh(annulusGeom(outerR, innerR, length, segs), material);
  return m;
}

function cylZ(rTop, rBot, len, segs, material) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBot, len, segs),
    material
  );
  m.rotation.x = Math.PI / 2;
  return m;
}

// ---------------------------------------------------------------------------
// 1. Stand — triangular plate with shaft bore and mounting hole
// ---------------------------------------------------------------------------
const baseGroup = new THREE.Group();

const baseShape = new THREE.Shape();
baseShape.moveTo(-4.85, 0.42);
baseShape.lineTo(6.15, 0.42);
baseShape.lineTo(0.2, WHEEL_Y + 1.95);
baseShape.closePath();

const shaftHole = new THREE.Path();
shaftHole.absarc(0, WHEEL_Y, 1.52, 0, Math.PI * 2, true);
baseShape.holes.push(shaftHole);

const mountHole = new THREE.Path();
mountHole.absarc(-3.55, 1.35, 0.28, 0, Math.PI * 2, true);
baseShape.holes.push(mountHole);

const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
  depth: BASE_T,
  bevelEnabled: true,
  bevelThickness: 0.04,
  bevelSize: 0.04,
  bevelSegments: 1,
  curveSegments: 32
});
baseGeom.translate(0, 0, -BASE_T / 2);
const basePlate = new THREE.Mesh(baseGeom, metal);
basePlate.position.z = -2.35;
baseGroup.add(basePlate);

// Bearing boss around the shaft (tube so the barrel can pass through)
const boss = tubeMesh(1.88, 1.52, BASE_T + 0.55, 36, metal);
boss.position.set(0, WHEEL_Y, -2.35);
baseGroup.add(boss);

// Bottom rail under the triangle
const rail = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.44, 1.55), metal);
rail.position.set(0.55, 0.22, -2.35);
baseGroup.add(rail);

// Rear foot extending under the wheel (+Z) for stability
const rearFoot = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.44, 7.2), metal);
rearFoot.position.set(4.55, 0.22, 0.7);
baseGroup.add(rearFoot);

const footPad = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 1.35), metal);
footPad.position.set(4.55, 0.28, 3.95);
baseGroup.add(footPad);

const footLip = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.95, 0.48), metal);
footLip.position.set(4.55, 0.48, 4.45);
baseGroup.add(footLip);

machine.add(baseGroup);

// ---------------------------------------------------------------------------
// 2. Tapered barrel / housing (lathed hollow profile, axis along Z)
// ---------------------------------------------------------------------------
const housingPts = [
  [0.36, 0.00],
  [1.62, 0.00],
  [1.62, 0.40],
  [1.38, 0.72],
  [1.18, 1.85],
  [1.05, 2.85],
  [0.98, 3.65],
  [0.98, 4.42],
  [0.80, 4.55],
  [0.80, 5.22],
  [0.62, 5.36],
  [0.62, 6.12],
  [0.50, 6.26],
  [0.50, 6.62],
  [0.30, 6.62],
  [0.30, 0.00]
].map((p) => new THREE.Vector2(p[0], p[1]));

const housingGeom = new THREE.LatheGeometry(housingPts, 48);
const housing = new THREE.Mesh(housingGeom, metal);
// Lathe is around Y; map Y -> -Z so the nozzle points toward the camera
housing.rotation.x = -Math.PI / 2;
housing.position.set(0, WHEEL_Y, -WHEEL_THICK / 2);
machine.add(housing);

// Flange where the barrel meets the ring
const flange = cylZ(1.92, 1.92, 0.28, 36, metal);
flange.position.set(0, WHEEL_Y, -WHEEL_THICK / 2 - 0.05);
machine.add(flange);

// Collar on the barrel (visible step)
const collar = cylZ(1.12, 1.12, 0.32, 28, metal);
collar.position.set(0, WHEEL_Y, -2.55);
machine.add(collar);

// ---------------------------------------------------------------------------
// 3. Outer internal ring gear
// ---------------------------------------------------------------------------
const wheelGroup = new THREE.Group();
wheelGroup.position.set(0, WHEEL_Y, 0);

const ringShape = new THREE.Shape();
ringShape.absarc(0, 0, WHEEL_OUTER_R, 0, Math.PI * 2, false);
const ringHole = new THREE.Path();
ringHole.absarc(0, 0, WHEEL_INNER_R, 0, Math.PI * 2, true);
ringShape.holes.push(ringHole);

const ringGeom = new THREE.ExtrudeGeometry(ringShape, {
  depth: WHEEL_THICK - 0.22,
  bevelEnabled: true,
  bevelThickness: 0.11,
  bevelSize: 0.1,
  bevelSegments: 2,
  curveSegments: 64
});
ringGeom.translate(0, 0, -(WHEEL_THICK - 0.22) / 2);
wheelGroup.add(new THREE.Mesh(ringGeom, metal));

addTeeth(wheelGroup, {
  count: WHEEL_TEETH,
  radius: WHEEL_INNER_R,
  depth: WHEEL_TOOTH_DEPTH,
  rootW: 0.40,
  tipW: 0.20,
  thick: WHEEL_THICK * 0.9,
  inward: true,
  material: metal
});

machine.add(wheelGroup);

// ---------------------------------------------------------------------------
// 4. Inner spoked gear + spider / carrier
// ---------------------------------------------------------------------------
const innerGroup = new THREE.Group();
innerGroup.position.set(0, WHEEL_Y, 0.12);

// Toothed rim (open centre so spokes read clearly)
const innerRim = new THREE.Mesh(
  annulusGeom(INNER_ROOT_R, INNER_ROOT_R - INNER_RIM_W, INNER_THICK, 48),
  metal
);
innerGroup.add(innerRim);

addTeeth(innerGroup, {
  count: INNER_TEETH,
  radius: INNER_ROOT_R,
  depth: INNER_TOOTH_DEPTH,
  rootW: 0.34,
  tipW: 0.16,
  thick: INNER_THICK * 0.92,
  inward: false,
  material: metal
});

// Hub
const hub = cylZ(HUB_R, HUB_R, 1.15, 24, metal);
innerGroup.add(hub);

const hubFace = cylZ(1.05, 0.55, 0.42, 24, metal);
hubFace.position.z = -0.55;
innerGroup.add(hubFace);

// Bevel-like cone facing the camera
const centerCone = cylZ(0.32, 0.92, 0.7, 20, metal);
centerCone.position.z = -0.72;
innerGroup.add(centerCone);

const nose = cylZ(0.28, 0.28, 0.5, 16, metal);
nose.position.z = -1.05;
innerGroup.add(nose);

// Four spokes + bosses / pins at the rim
const spokeLen = INNER_ROOT_R - INNER_RIM_W - HUB_R + 0.08;
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2;
  const mid = HUB_R + spokeLen / 2 - 0.04;

  const spoke = new THREE.Mesh(
    new THREE.BoxGeometry(SPOKE_W, spokeLen, SPOKE_T),
    metal
  );
  spoke.position.set(Math.cos(a) * mid, Math.sin(a) * mid, -0.22);
  spoke.rotation.z = a - Math.PI / 2;
  innerGroup.add(spoke);

  const endR = INNER_ROOT_R - INNER_RIM_W * 0.55;
  const bossPin = cylZ(0.36, 0.36, SPOKE_T + 0.55, 14, metal);
  bossPin.position.set(Math.cos(a) * endR, Math.sin(a) * endR, -0.22);
  innerGroup.add(bossPin);

  const pinCap = cylZ(0.22, 0.22, SPOKE_T + 0.95, 12, metal);
  pinCap.position.set(Math.cos(a) * endR, Math.sin(a) * endR, -0.22);
  innerGroup.add(pinCap);
}

// Thin vertical drive / lock rod seen in the inner cage
const vRod = new THREE.Mesh(
  new THREE.CylinderGeometry(0.09, 0.09, 3.35, 8),
  metal
);
vRod.position.set(0.05, 1.55, -0.48);
innerGroup.add(vRod);

const vBlock = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), metal);
vBlock.position.set(0.05, 3.15, -0.48);
innerGroup.add(vBlock);

machine.add(innerGroup);

// Shaft through the wheel, protruding on the far side
const shaft = cylZ(0.40, 0.40, WHEEL_THICK + 1.6, 16, metal);
shaft.position.set(0, WHEEL_Y, 0.15);
machine.add(shaft);

const backCap = cylZ(0.72, 0.72, 0.32, 20, metal);
backCap.position.set(0, WHEEL_Y, WHEEL_THICK / 2 + 0.12);
machine.add(backCap);

const backNut = cylZ(0.5, 0.5, 0.28, 6, metal);
backNut.position.set(0, WHEEL_Y, WHEEL_THICK / 2 + 0.38);
machine.add(backNut);

// ---------------------------------------------------------------------------
// 5. Dual crank handles
// ---------------------------------------------------------------------------
function makeCrank(armLen, tiltZ, pivot, gripZOff) {
  const g = new THREE.Group();

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(ARM_T, armLen, ARM_T),
    metal
  );
  arm.position.y = armLen / 2;
  g.add(arm);

  const endBlk = new THREE.Mesh(
    new THREE.BoxGeometry(ARM_T * 1.35, ARM_T * 1.25, ARM_T * 1.35),
    metal
  );
  endBlk.position.y = armLen;
  g.add(endBlk);

  const grip = tubeMesh(GRIP_R, GRIP_BORE, GRIP_LEN, 18, metal);
  grip.position.set(0, armLen, gripZOff);
  g.add(grip);

  g.position.copy(pivot);
  g.rotation.z = tiltZ;
  return g;
}

const handlePivot = new THREE.Vector3(-0.15, WHEEL_Y + 1.42, -3.05);

// Mounting block + pivot pin on top of the barrel
const mountBlk = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.55), metal);
mountBlk.position.set(-0.1, WHEEL_Y + 1.05, -3.05);
machine.add(mountBlk);

const pivotPin = cylZ(0.27, 0.27, 1.7, 14, metal);
pivotPin.position.set(-0.1, WHEEL_Y + 1.55, -3.05);
machine.add(pivotPin);

// Short, nearly vertical crank
machine.add(makeCrank(6.15, 0.16, handlePivot, 0.22));

// Long angled crank
const longPivot = new THREE.Vector3(-0.55, WHEEL_Y + 0.55, -3.55);
machine.add(makeCrank(11.4, 0.82, longPivot, 0.18));

// Hinge where the long crank meets the barrel
const hinge = cylZ(0.3, 0.3, 1.15, 14, metal);
hinge.position.copy(longPivot);
machine.add(hinge);

const hingeBlk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.9), metal);
hingeBlk.position.set(-0.55, WHEEL_Y + 0.55, -3.55);
machine.add(hingeBlk);

// ---------------------------------------------------------------------------
// 6. Small side crank on the barrel
// ---------------------------------------------------------------------------
const sideArm = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 2.15), metal);
sideArm.position.set(0.95, WHEEL_Y - 0.55, -5.15);
machine.add(sideArm);

const sideTab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.45), metal);
sideTab.position.set(0.55, WHEEL_Y - 0.55, -4.25);
machine.add(sideTab);

const sideGrip = tubeMesh(0.28, 0.12, 1.55, 14, metal);
sideGrip.position.set(0.95, WHEEL_Y - 0.55, -6.05);
machine.add(sideGrip);

// Nozzle lip (emphasise the hollow end)
const nozzleLip = tubeMesh(0.52, 0.30, 0.18, 20, metal);
nozzleLip.position.set(0, WHEEL_Y, -WHEEL_THICK / 2 - HOUSING_LEN - 0.02);
machine.add(nozzleLip);

// Dark bore insert so the nozzle reads as hollow
const bore = cylZ(0.29, 0.29, 0.9, 16, metalDark);
bore.position.set(0, WHEEL_Y, -WHEEL_THICK / 2 - HOUSING_LEN + 0.35);
machine.add(bore);

scene.add(machine);

// ---------------------------------------------------------------------------
// Camera — isometric view matching the reference (handles left, wheel right)
// ---------------------------------------------------------------------------
camera.position.set(-18, 15, -22);
camera.lookAt(0, 5.2, -2);