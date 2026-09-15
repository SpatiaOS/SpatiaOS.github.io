// =====================================================================
//  Hand-cranked geared flywheel mechanism (winch style)
//  Interpretation of the reference image:
//   - Large flywheel on the right: outer rim carrying an INTERNAL ring
//     gear (teeth machined into the inner circumference)
//   - Three planetary pinions meshing with the ring gear, mounted on a
//     round carrier plate with lightening holes, crank pins sticking
//     out axially
//   - Central hub + axle, horizontal drum with stepped shaft (left)
//   - Two lever arms (long + short) with cylindrical grip handles
//   - Triangular support gusset standing on a base frame with feet
//  Axes: rotation axis = X (wheel at +X, cranks at -X), up = Y
// =====================================================================

// ---------------------------- parameters ----------------------------
const wheelX       = 7;      // flywheel centre along the axis
const rimOuterR    = 24.2;   // flywheel outer radius
const rimWidth     = 6.5;    // axial width of the rim
const ringRootR    = 20.0;   // internal gear root radius
const ringTipR     = 17.7;   // internal gear tip radius (points inward)
const ringTeeth    = 48;

const planetRootR  = 5.5;    // planetary pinion root radius
const planetTipR   = 6.9;    // pinion tip radius
const planetTeeth  = 16;
const planetWidth  = 4.0;    // pinion face width

const hubR         = 4.8;    // central hub radius
const carrierR     = 11.0;   // carrier plate radius

const drumR        = 4.2;    // crank drum
const drumLen      = 8.5;
const drumX        = -4.75;
const shaftR       = 2.3;    // shaft journals

const groundY      = -26;    // base frame sits here

// derived gear values
const ringPitchR   = (ringRootR + ringTipR) / 2;
const planetPitchR = (planetRootR + planetTipR) / 2;
const orbitR       = ringPitchR - planetPitchR;  // pinion centre orbit

// ---------------------------- materials -----------------------------
const matSteel = new THREE.MeshStandardMaterial({ color: 0x9aa1a8, metalness: 0.65, roughness: 0.4  });
const matFrame = new THREE.MeshStandardMaterial({ color: 0x878d94, metalness: 0.5 , roughness: 0.55 });
const matDark  = new THREE.MeshStandardMaterial({ color: 0x24262a, metalness: 0.3 , roughness: 0.7  });

// ---------------------------- helpers -------------------------------
// polygon of trapezoidal gear teeth (works for internal gears too:
// pass rRoot > rTip so the tips point toward the centre)
function toothedPolygon(rRoot, rTip, teeth) {
  const pts = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(new THREE.Vector2(rRoot * Math.cos(a + step * 0.16), rRoot * Math.sin(a + step * 0.16)));
    pts.push(new THREE.Vector2(rTip  * Math.cos(a + step * 0.34), rTip  * Math.sin(a + step * 0.34)));
    pts.push(new THREE.Vector2(rTip  * Math.cos(a + step * 0.66), rTip  * Math.sin(a + step * 0.66)));
    pts.push(new THREE.Vector2(rRoot * Math.cos(a + step * 0.84), rRoot * Math.sin(a + step * 0.84)));
  }
  return pts;
}
function polygonToPath(pts) {
  const p = new THREE.Path();
  p.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) p.lineTo(pts[i].x, pts[i].y);
  p.closePath();
  return p;
}
// cylinder whose axis lies along X
function xCylinder(r, len, seg, open) {
  const g = new THREE.CylinderGeometry(r, r, len, seg, 1, !!open);
  g.rotateZ(Math.PI / 2);
  return g;
}

const model = new THREE.Group();

// ------------- flywheel rim with internal ring gear ------------------
const rimShape = new THREE.Shape();
rimShape.absarc(0, 0, rimOuterR, 0, Math.PI * 2, false);
rimShape.holes.push(polygonToPath(toothedPolygon(ringRootR, ringTipR, ringTeeth)));
const rimGeo = new THREE.ExtrudeGeometry(rimShape, { depth: rimWidth, bevelEnabled: false, curveSegments: 64 });
const rim = new THREE.Mesh(rimGeo, matSteel);
rim.rotation.y = Math.PI / 2;                      // extrusion dir -> world X
rim.position.set(wheelX - rimWidth / 2, 0, 0);
model.add(rim);

// raised band around the outer circumference (rim step seen in image)
const band = new THREE.Mesh(xCylinder(rimOuterR + 0.4, 2.4, 96, true), matSteel);
band.position.set(wheelX, 0, 0);
model.add(band);

// ------------- planetary pinions, carrier, pins, hub -----------------
const planetShape = new THREE.Shape(toothedPolygon(planetRootR, planetTipR, planetTeeth));
const boreHole = new THREE.Path();
boreHole.absarc(0, 0, 1.7, 0, Math.PI * 2, true);
planetShape.holes.push(boreHole);
const planetGeoBase = new THREE.ExtrudeGeometry(planetShape, { depth: planetWidth, bevelEnabled: false, curveSegments: 24 });

const planetPitchAng = 360 / planetTeeth;
for (let i = 0; i < 3; i++) {
  const thetaDeg = i * 120;                                   // 0 deg = top
  const theta = thetaDeg * Math.PI / 180;
  // phase each pinion so its teeth land in the ring-gear gaps
  const phiDeg = ((thetaDeg + 90 - 0.5 * planetPitchAng) % planetPitchAng + planetPitchAng) % planetPitchAng;
  const g = planetGeoBase.clone().rotateZ(phiDeg * Math.PI / 180).rotateY(Math.PI / 2);
  const pinion = new THREE.Mesh(g, matSteel);
  pinion.position.set(wheelX, orbitR * Math.cos(theta), orbitR * Math.sin(theta));
  model.add(pinion);

  // crank pin sticking out axially from each pinion
  const pin = new THREE.Mesh(xCylinder(1.1, 5.5, 20), matSteel);
  pin.position.set(wheelX - 4.7, orbitR * Math.cos(theta), orbitR * Math.sin(theta));
  model.add(pin);
}

// carrier plate with lightening holes (behind the pinions)
const carrierShape = new THREE.Shape();
carrierShape.absarc(0, 0, carrierR, 0, Math.PI * 2, false);
for (let i = 0; i < 3; i++) {
  const a = i * (Math.PI * 2 / 3);
  const h = new THREE.Path();
  h.absarc(7.6 * Math.cos(a), 7.6 * Math.sin(a), 2.6, 0, Math.PI * 2, true);
  carrierShape.holes.push(h);
}
const carrier = new THREE.Mesh(
  new THREE.ExtrudeGeometry(carrierShape, { depth: 1.8, bevelEnabled: false, curveSegments: 48 }), matFrame);
carrier.rotation.y = Math.PI / 2;
carrier.position.set(wheelX + 2.2, 0, 0);
model.add(carrier);

// hub + front boss
const hub = new THREE.Mesh(xCylinder(hubR, 9, 40), matSteel);
hub.position.set(wheelX, 0, 0);
model.add(hub);
const hubBoss = new THREE.Mesh(xCylinder(3.4, 2.6, 32), matSteel);
hubBoss.position.set(wheelX - 5.6, 0, 0);
model.add(hubBoss);

// axle running from the drum through to the hub
const axle = new THREE.Mesh(xCylinder(shaftR, 15, 24), matSteel);
axle.position.set(-1.4, 0, 0);
model.add(axle);

// ------------------- drum, shaft end, crank arms ---------------------
const drum = new THREE.Mesh(xCylinder(drumR, drumLen, 40), matSteel);
drum.position.set(drumX, 0, 0);
model.add(drum);

const flange = new THREE.Mesh(xCylinder(5.0, 1.0, 40), matSteel);   // drum face flange
flange.position.set(-0.85, 0, 0);
model.add(flange);

const shaft = new THREE.Mesh(xCylinder(shaftR, 5.6, 24), matSteel); // stepped shaft end
shaft.position.set(-11.5, 0, 0);
model.add(shaft);

const collar = new THREE.Mesh(xCylinder(3.0, 1.2, 28), matSteel);
collar.position.set(-13.75, 0, 0);
model.add(collar);

const boreFace = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), matDark); // dark bore
boreFace.rotation.y = -Math.PI / 2;
boreFace.position.set(-14.36, 0, 0);
model.add(boreFace);

// long lever arm (flat bar, up to the left)
const arm1Len = 34, arm1Ang = 137 * Math.PI / 180;
const arm1Start = { x: -3, y: 1.5 };
const arm1 = new THREE.Mesh(new THREE.BoxGeometry(arm1Len, 3.6, 2.0), matFrame);
arm1.position.set(arm1Start.x + 0.5 * arm1Len * Math.cos(arm1Ang),
                  arm1Start.y + 0.5 * arm1Len * Math.sin(arm1Ang), 0);
arm1.rotation.z = arm1Ang;
model.add(arm1);

// short crank arm
const arm2Len = 17, arm2Ang = 115 * Math.PI / 180;
const arm2Start = { x: -4.2, y: -0.8 };
const arm2 = new THREE.Mesh(new THREE.BoxGeometry(arm2Len, 3.2, 2.0), matFrame);
arm2.position.set(arm2Start.x + 0.5 * arm2Len * Math.cos(arm2Ang),
                  arm2Start.y + 0.5 * arm2Len * Math.sin(arm2Ang), 0);
arm2.rotation.z = arm2Ang;
model.add(arm2);

// grip handles (parallel to the drum axis) with end caps
function grip(x, y, r, len) {
  const g = new THREE.Mesh(xCylinder(r, len, 20), matFrame);
  g.position.set(x, y, 0);
  model.add(g);
  const c1 = new THREE.Mesh(xCylinder(r + 0.35, 1.2, 20), matFrame);
  c1.position.set(x - len / 2 + 0.6, y, 0);
  model.add(c1);
  const c2 = c1.clone();
  c2.position.x = x + len / 2 - 0.6;
  model.add(c2);
}
const end1 = { x: arm1Start.x + arm1Len * Math.cos(arm1Ang), y: arm1Start.y + arm1Len * Math.sin(arm1Ang) };
grip(end1.x - 3.0, end1.y, 1.15, 9);          // long-arm handle
const end2 = { x: arm2Start.x + arm2Len * Math.cos(arm2Ang), y: arm2Start.y + arm2Len * Math.sin(arm2Ang) };
grip(end2.x - 2.0, end2.y, 1.05, 8);          // short-arm handle

// small square plate on the long arm near the drum
const tab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 0.6), matSteel);
tab.position.set(arm1Start.x + 5.5 * Math.cos(arm1Ang),
                 arm1Start.y + 5.5 * Math.sin(arm1Ang), 1.3);
tab.rotation.z = arm1Ang;
model.add(tab);

// small detail pins near the drum bottom
const pinA = new THREE.Mesh(xCylinder(0.9, 4.5, 16), matSteel);
pinA.position.set(-7.6, -5.0, 0);
model.add(pinA);
const pinB = new THREE.Mesh(xCylinder(0.9, 4.2, 16), matSteel);
pinB.rotation.y = Math.PI / 2;
pinB.position.set(-4.9, -4.7, 1.7);
model.add(pinB);

// --------------------- support frame ---------------------------------
// triangular gusset plate (parallel to the wheel) carrying the axle
const gShape = new THREE.Shape();
gShape.moveTo(-2.5, 3.5);
gShape.lineTo(2.5, 3.5);
gShape.lineTo(13, -22);
gShape.lineTo(-11, -22);
gShape.closePath();
const gHole = new THREE.Path();
gHole.absarc(-5.5, -8, 1.4, 0, Math.PI * 2, true);
gShape.holes.push(gHole);
const gusset = new THREE.Mesh(
  new THREE.ExtrudeGeometry(gShape, { depth: 2.4, bevelEnabled: false, curveSegments: 24 }), matFrame);
gusset.rotation.y = -Math.PI / 2;
gusset.position.set(3.2, 0, 0);
model.add(gusset);

// bearing boss where the axle passes through the gusset apex
const gBoss = new THREE.Mesh(xCylinder(3.8, 3.0, 28), matFrame);
gBoss.position.set(2.0, 0, 0);
model.add(gBoss);

// base frame: two rails along the axis, cross bars and feet
for (const z of [-8, 8]) {
  const rail = new THREE.Mesh(new THREE.BoxGeometry(27, 2.4, 2.4), matFrame);
  rail.position.set(0, groundY + 2.8, z);
  model.add(rail);
  for (const x of [-10.5, 10.5]) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(5, 1.6, 4.6), matFrame);
    foot.position.set(x, groundY + 0.8, z);
    model.add(foot);
  }
}
for (const x of [-11.5, 11.5]) {
  const cross = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 18.4), matFrame);
  cross.position.set(x, groundY + 2.8, 0);
  model.add(cross);
}

scene.add(model);

// ---------------------------- camera ---------------------------------
camera.position.set(-36, 24, 56);
camera.lookAt(-9, 1, 0);