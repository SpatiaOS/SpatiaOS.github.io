// =====================================================================
//  HAND-CRANKED WINCH  (large internal-tooth ring gear / flywheel)
//  - Big wheel with a ring of internal gear teeth on the inside of its rim
//  - Small pinion + crescent shaped web inside
//  - Central axle carrying a two-arm crank handle (T-grips)
//  - Trapezoidal support plate standing on a base plate with two feet
// =====================================================================

const D2R = Math.PI / 180;               // degrees -> radians

// ------------------------------ PARAMETERS ---------------------------
// Big wheel (ring gear)
const wheelR      = 6.0;                 // outer radius of the wheel
const rimInnerR   = 4.9;                 // inner radius of the rim
const wheelDepth  = 1.2;                 // rim thickness along the axle
const toothCount  = 40;                  // number of internal teeth
const toothLen    = 0.60;                // radial length of a tooth
const toothWide   = 0.26;                // tangential width of a tooth
const toothDepth  = 0.72;                // axial thickness of a tooth

// Hub and axle
const hubR        = 1.30;
const hubDepth    = 2.80;
const axleR       = 0.80;
const axleBack    = -1.0;                // z of the back end of the axle
const axleFront   = 5.7;                 // z of the free (crank) end

// Crank handle (two arms, both in the same plane on the axle)
const crankZ      = 3.0;                 // z of the crank plane
const arm1Len     = 7.6,  arm1Ang = 132 * D2R;   // long arm  (up-left)
const arm2Len     = 5.4,  arm2Ang = 88  * D2R;   // short arm (up)
const armW        = 0.85, armT = 0.70;
const gripR       = 0.42, gripLen = 2.3;

// Support / base  (local frame: axle centre = origin, ground = -wheelR)
const groundY     = -wheelR;
const baseTop     = -3.9;                // top face of the base plate
const baseThick   = 0.9;
const feetH       = baseTop - baseThick - groundY;   // = 1.2
const baseZ       = 3.3;                 // base sits in front of the wheel
const baseD       = 4.8;
const supportZ    = 1.3;                 // support plate sits just in front of the wheel

// ------------------------------ MATERIALS ----------------------------
const matBody  = new THREE.MeshStandardMaterial({ color: 0x9aa1a8, metalness: 0.60, roughness: 0.50 });
const matGear  = new THREE.MeshStandardMaterial({ color: 0xaab1b8, metalness: 0.75, roughness: 0.35 });
const matDark  = new THREE.MeshStandardMaterial({ color: 0x7b8187, metalness: 0.60, roughness: 0.55 });
const matShaft = new THREE.MeshStandardMaterial({ color: 0xbcc3c9, metalness: 0.85, roughness: 0.25 });

// ---------------------------------------------------------------------
//  HELPERS
// ---------------------------------------------------------------------

// Flat ring (rim / washer) lying in the XY plane, extruded along Z
function ringGeometry(outerR, innerR, depth) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false, curveSegments: 72 });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

// Cylinder whose axis is the Z axis
function cylinderZ(radius, length, segments) {
  const geo = new THREE.CylinderGeometry(radius, radius, length, segments || 32);
  geo.rotateX(Math.PI / 2);
  return geo;
}

// Ring of teeth.  sign = -1 -> teeth point inward (ring gear)
//                 sign = +1 -> teeth point outward (pinion)
function teethRing(count, radius, sign, len, wide, depth, material) {
  const grp = new THREE.Group();
  const geo = new THREE.BoxGeometry(wide, len, depth);   // X = tangential, Y = radial
  const r   = radius + sign * len * 0.5;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const t = new THREE.Mesh(geo, material);
    t.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    t.rotation.z = a - Math.PI / 2;                      // local +Y points radially
    grp.add(t);
  }
  return grp;
}

// Straight radial bar between two radii, at a given angle in the XY plane
function spoke(angle, r1, r2, width, depth, material) {
  const len = r2 - r1;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, width, depth), material);
  const rc = r1 + len / 2;
  mesh.position.set(Math.cos(angle) * rc, Math.sin(angle) * rc, 0);
  mesh.rotation.z = angle;
  return mesh;
}

// ---------------------------------------------------------------------
//  ASSEMBLY  (built in local coordinates, axle centre at the origin)
// ---------------------------------------------------------------------
const winch = new THREE.Group();
winch.position.set(0, wheelR, 0);        // lift so the ground is at world y = 0
scene.add(winch);

// ---------- 1. big wheel / ring gear ----------
const rim = new THREE.Mesh(ringGeometry(wheelR, rimInnerR, wheelDepth), matGear);
winch.add(rim);

// internal teeth around the inside of the rim
const ringTeeth = teethRing(toothCount, rimInnerR, -1, toothLen, toothWide, toothDepth, matGear);
winch.add(ringTeeth);

// central hub (bored for the axle)
const hub = new THREE.Mesh(cylinderZ(hubR, hubDepth), matBody);
winch.add(hub);

const hubFlange = new THREE.Mesh(cylinderZ(hubR * 1.9, 0.5), matBody);
hubFlange.position.z = 0.95;
winch.add(hubFlange);

// ---------- 2. pinion and wheel web ----------
const pinAng  = 38 * D2R;
const pinDist = 3.0;
const pinR    = 0.95;

// pinion body + external teeth, meshing with the ring gear
const pinion = new THREE.Group();
const pinionBody = new THREE.Mesh(cylinderZ(pinR, 0.85), matGear);
pinion.add(pinionBody);
pinion.add(teethRing(14, pinR, +1, 0.30, 0.16, 0.85, matGear));
pinion.position.set(Math.cos(pinAng) * pinDist, Math.sin(pinAng) * pinDist, 0.15);
winch.add(pinion);

// pinion axle stub pointing out of the wheel
const pinAxle = new THREE.Mesh(cylinderZ(0.45, 2.4), matShaft);
pinAxle.position.set(Math.cos(pinAng) * pinDist, Math.sin(pinAng) * pinDist, 1.1);
winch.add(pinAxle);

// bracket tying the pinion back to the hub
winch.add(spoke(pinAng, 0.6, pinDist + 0.3, 0.70, 0.65, matBody));

// crescent shaped web on the opposite side of the wheel
const arcShape = new THREE.Shape();
arcShape.absarc(0, 0, 2.75, 105 * D2R, 255 * D2R, false);
arcShape.absarc(0, 0, 2.05, 255 * D2R, 105 * D2R, true);
const arcGeo = new THREE.ExtrudeGeometry(arcShape, { depth: 0.80, bevelEnabled: false, curveSegments: 48 });
arcGeo.translate(0, 0, -0.40);
winch.add(new THREE.Mesh(arcGeo, matBody));

// a second straight spoke for the lower part of the web
winch.add(spoke(-68 * D2R, 0.8, rimInnerR - 0.1, 0.70, 0.70, matBody));

// ---------- 3. axle ----------
const axle = new THREE.Mesh(cylinderZ(axleR, axleFront - axleBack), matShaft);
axle.position.z = (axleFront + axleBack) / 2;
winch.add(axle);

// collar where the crank is mounted
const crankHub = new THREE.Mesh(cylinderZ(1.5, 1.6), matBody);
crankHub.position.set(0, 0, crankZ - 0.2);
winch.add(crankHub);

// square block + end flange on the free end of the axle
const sqBlock = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 0.9), matDark);
sqBlock.position.set(0, 0, 4.45);
sqBlock.rotation.z = 45 * D2R;
winch.add(sqBlock);

const endFlange = new THREE.Mesh(cylinderZ(1.15, 0.55), matShaft);
endFlange.position.z = 5.35;
winch.add(endFlange);

// ---------- 4. crank arms with T-grips ----------
function crankArm(length, angle, z) {
  const g = new THREE.Group();

  // arm bar, extending along +X from the axle centre
  const bar = new THREE.Mesh(new THREE.BoxGeometry(length, armW, armT), matBody);
  bar.position.x = length / 2;
  g.add(bar);

  // grip: rod perpendicular to the arm (in the wheel plane) with rounded ends
  const handle = new THREE.Group();
  handle.add(new THREE.Mesh(new THREE.CylinderGeometry(gripR, gripR, gripLen, 20), matShaft));
  const capGeo = new THREE.SphereGeometry(gripR, 20, 12);
  const cap1 = new THREE.Mesh(capGeo, matShaft); cap1.position.y =  gripLen / 2; handle.add(cap1);
  const cap2 = new THREE.Mesh(capGeo, matShaft); cap2.position.y = -gripLen / 2; handle.add(cap2);
  handle.position.x = length;
  g.add(handle);

  g.rotation.z = angle;
  g.position.z = z;
  return g;
}

winch.add(crankArm(arm1Len, arm1Ang, crankZ));
winch.add(crankArm(arm2Len, arm2Ang, crankZ + 0.05));

// ---------- 5. trapezoidal support plate ----------
const plateShape = new THREE.Shape();
plateShape.moveTo(-6.0, baseTop);        // wide bottom edge
plateShape.lineTo( 6.6, baseTop);
plateShape.lineTo( 3.2, -0.30);          // narrow top edge, under the axle
plateShape.lineTo(-2.4, -0.30);
plateShape.closePath();

const supportPlate = new THREE.Mesh(
  new THREE.ExtrudeGeometry(plateShape, { depth: 0.6, bevelEnabled: false }),
  matBody
);
supportPlate.position.z = supportZ;
winch.add(supportPlate);

// bearing block where the axle passes through the support plate
const bearing = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 1.6), matDark);
bearing.position.set(0.3, -0.5, supportZ + 0.3);
winch.add(bearing);

// small mounting boss on the plate
const boss = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 0.9), matDark);
boss.position.set(-2.2, -2.0, supportZ + 0.4);
boss.rotation.z = 15 * D2R;
winch.add(boss);

// ---------- 6. base plate and feet ----------
const basePlate = new THREE.Mesh(new THREE.BoxGeometry(14, baseThick, baseD), matBody);
basePlate.position.set(0.3, baseTop - baseThick / 2, baseZ);
winch.add(basePlate);

const footGeo = new THREE.BoxGeometry(2.4, feetH, 4.6);
[-4.6, 4.6].forEach(function (x) {
  const foot = new THREE.Mesh(footGeo, matBody);
  foot.position.set(x, groundY + feetH / 2, baseZ);
  winch.add(foot);
});

// ---------------------------------------------------------------------
//  CAMERA
// ---------------------------------------------------------------------
camera.position.set(18, 14, 17);
camera.lookAt(-1.5, 5.5, 0);