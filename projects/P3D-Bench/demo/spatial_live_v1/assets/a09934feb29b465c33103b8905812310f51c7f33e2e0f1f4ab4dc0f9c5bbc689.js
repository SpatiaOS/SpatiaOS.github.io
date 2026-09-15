// ============================================================================
// METAL SLUG SV-001 STYLIZED SUPER VEHICLE TANK
// Parametric 3D Model recreation in Three.js
// ============================================================================

// ----------------------------------------------------------------------------
// 1. PALETTE & MATERIALS (Stylized clay / CAD render aesthetic)
// ----------------------------------------------------------------------------
const bodyMat = new THREE.MeshStandardMaterial({
  color: 0xb8bdc5,
  roughness: 0.38,
  metalness: 0.18
});

const darkMat = new THREE.MeshStandardMaterial({
  color: 0x5e646c,
  roughness: 0.45,
  metalness: 0.3
});

const trackMat = new THREE.MeshStandardMaterial({
  color: 0x7c828a,
  roughness: 0.6,
  metalness: 0.15
});

const rimMat = new THREE.MeshStandardMaterial({
  color: 0xa4abb3,
  roughness: 0.35,
  metalness: 0.2
});

const metalMat = new THREE.MeshStandardMaterial({
  color: 0x3e434a,
  roughness: 0.25,
  metalness: 0.55
});

const highlightMat = new THREE.MeshStandardMaterial({
  color: 0xd4d8de,
  roughness: 0.3,
  metalness: 0.1
});

// Root group for the entire tank
const tank = new THREE.Group();
scene.add(tank);

// ----------------------------------------------------------------------------
// 2. CENTRAL LOWER HULL & CHASSIS
// ----------------------------------------------------------------------------
// Main lower chassis box
const hullBaseGeo = new THREE.BoxGeometry(3.6, 1.1, 2.7);
const hullBase = new THREE.Mesh(hullBaseGeo, bodyMat);
hullBase.position.set(0, 0.95, 0);
tank.add(hullBase);

// Front Glacis Plate (angled downward towards -X)
const glacisGroup = new THREE.Group();
glacisGroup.position.set(-1.45, 1.45, 0);

// Sloped armor plate
const glacisPlateGeo = new THREE.BoxGeometry(1.6, 0.2, 2.7);
const glacisPlate = new THREE.Mesh(glacisPlateGeo, bodyMat);
glacisPlate.rotation.z = Math.PI * 0.24;
glacisPlate.position.set(-0.5, -0.2, 0);
glacisGroup.add(glacisPlate);

// Glacis central step / latch wedge
const glacisStepGeo = new THREE.BoxGeometry(0.28, 0.22, 0.35);
const glacisStep = new THREE.Mesh(glacisStepGeo, highlightMat);
glacisStep.rotation.z = Math.PI * 0.24;
glacisStep.position.set(-0.6, 0.02, 0);
glacisGroup.add(glacisStep);

// Glacis elbow pipe (viewer-facing left side)
const elbowCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.15, 0.1, 0.9),
  new THREE.Vector3(-0.4, 0.05, 1.05),
  new THREE.Vector3(-0.55, -0.25, 1.05)
]);
const elbowGeo = new THREE.TubeGeometry(elbowCurve, 16, 0.09, 12, false);
const elbowMesh = new THREE.Mesh(elbowGeo, darkMat);
glacisGroup.add(elbowMesh);

tank.add(glacisGroup);

// Lower front nose & teeth grille
const noseGroup = new THREE.Group();
noseGroup.position.set(-2.05, 0.65, 0);

// Angled under-nose plate
const nosePlateGeo = new THREE.BoxGeometry(0.65, 0.15, 2.5);
const nosePlate = new THREE.Mesh(nosePlateGeo, darkMat);
nosePlate.rotation.z = -Math.PI * 0.28;
nosePlate.position.set(0.15, -0.1, 0);
noseGroup.add(nosePlate);

// Segmented tooth grille slats (Metal Slug iconic lower front grille)
const toothCount = 7;
const toothWidth = 0.24;
const toothSpan = 2.1;
const toothGeo = new THREE.BoxGeometry(0.16, 0.32, 0.16);

for (let i = 0; i < toothCount; i++) {
  const zPos = -toothSpan / 2 + (i / (toothCount - 1)) * toothSpan;
  const tooth = new THREE.Mesh(toothGeo, highlightMat);
  tooth.position.set(0.02, -0.15, zPos);
  tooth.rotation.z = -Math.PI * 0.15;
  noseGroup.add(tooth);
}
tank.add(noseGroup);

// Middle sponsons (connect hull to track pods on both flanks)
const sponsonGeo = new THREE.BoxGeometry(1.2, 0.85, 0.85);
const leftSponson = new THREE.Mesh(sponsonGeo, bodyMat);
leftSponson.position.set(0, 0.9, 1.7);
tank.add(leftSponson);

const rightSponson = leftSponson.clone();
rightSponson.position.set(0, 0.9, -1.7);
tank.add(rightSponson);

// ----------------------------------------------------------------------------
// 3. TRACK PODS & CHUNKY TANK TREADS
// ----------------------------------------------------------------------------
// Helper to construct a parametric track pod (Front/Rear, Left/Right)
function createTrackPod(isFront, isLeft) {
  const pod = new THREE.Group();
  const posX = isFront ? -1.35 : 1.35;
  const posZ = isLeft ? 2.15 : -2.15;
  pod.position.set(posX, 0.85, posZ);

  // 1. Wheel Assembly (Large dished wheel with 5 lug nuts)
  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(0, 0, isLeft ? 0.1 : -0.1);

  // Outer tire / rim
  const rimGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.32, 32);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, darkMat);
  wheelGroup.add(rim);

  // Recessed inner web
  const webGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.34, 32);
  webGeo.rotateX(Math.PI / 2);
  const web = new THREE.Mesh(webGeo, rimMat);
  wheelGroup.add(web);

  // Raised center hub
  const hubGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.44, 24);
  hubGeo.rotateX(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, bodyMat);
  wheelGroup.add(hub);

  // Center dome cap
  const capGeo = new THREE.SphereGeometry(0.14, 16, 12);
  const cap = new THREE.Mesh(capGeo, highlightMat);
  cap.position.set(0, 0, isLeft ? 0.22 : -0.22);
  wheelGroup.add(cap);

  // 5 Hexagonal lug nuts
  const nutGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.08, 6);
  nutGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const nut = new THREE.Mesh(nutGeo, metalMat);
    nut.position.set(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, isLeft ? 0.18 : -0.18);
    wheelGroup.add(nut);
  }
  pod.add(wheelGroup);

  // 2. Armored Outer Track Frame with Circular Cutout
  const frameShape = new THREE.Shape();
  const dir = isFront ? 1 : -1;

  frameShape.moveTo(-1.1 * dir, -0.6);
  frameShape.lineTo(1.05 * dir, -0.6);
  frameShape.lineTo(1.2 * dir, -0.1);
  frameShape.lineTo(0.75 * dir, 0.58);
  frameShape.lineTo(-0.85 * dir, 0.25);
  frameShape.lineTo(-1.2 * dir, -0.15);
  frameShape.closePath();

  // Circular hole revealing wheel
  const holePath = new THREE.Path();
  holePath.absarc(0, 0, 0.68, 0, Math.PI * 2, true);
  frameShape.holes.push(holePath);

  const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 };
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
  const frameMesh = new THREE.Mesh(frameGeo, bodyMat);
  frameMesh.position.set(0, 0, isLeft ? 0.18 : -0.3);
  pod.add(frameMesh);

  // 3. Track Shoes (Parametric grousers wrapping around polygon path)
  const trackShoeGeo = new THREE.BoxGeometry(0.24, 0.09, 0.72);
  const cleatGeo = new THREE.BoxGeometry(0.12, 0.08, 0.68);
  const singleShoe = new THREE.Group();
  const shoeBase = new THREE.Mesh(trackShoeGeo, trackMat);
  const shoeCleat = new THREE.Mesh(cleatGeo, darkMat);
  shoeCleat.position.y = 0.07;
  singleShoe.add(shoeBase, shoeCleat);

  // Profile control points for the track loop
  const p1 = new THREE.Vector2(-1.18 * dir, -0.2);
  const p2 = new THREE.Vector2(-0.85 * dir, 0.32);
  const p3 = new THREE.Vector2(0.85 * dir, 0.65);
  const p4 = new THREE.Vector2(1.25 * dir, -0.05);
  const p5 = new THREE.Vector2(0.95 * dir, -0.68);
  const p6 = new THREE.Vector2(-0.95 * dir, -0.68);

  const curvePath = new THREE.CurvePath();
  curvePath.add(new THREE.LineCurve(p1, p2));
  curvePath.add(new THREE.LineCurve(p2, p3));
  curvePath.add(new THREE.LineCurve(p3, p4));
  curvePath.add(new THREE.LineCurve(p4, p5));
  curvePath.add(new THREE.LineCurve(p5, p6));
  curvePath.add(new THREE.LineCurve(p6, p1));

  const numShoes = 18;
  const points = curvePath.getSpacedPoints(numShoes);

  for (let i = 0; i < numShoes; i++) {
    const pt = points[i];
    const nextPt = points[(i + 1) % points.length];
    const tangent = new THREE.Vector2().subVectors(nextPt, pt).normalize();
    const angle = Math.atan2(tangent.y, tangent.x);

    const shoe = singleShoe.clone();
    shoe.position.set(pt.x, pt.y, 0);
    shoe.rotation.z = angle;
    pod.add(shoe);
  }

  // 4. Stepped mudguards / armor flaps on top slope
  const flapGeo = new THREE.BoxGeometry(0.5, 0.06, 0.78);
  const flap1 = new THREE.Mesh(flapGeo, bodyMat);
  flap1.position.set(-0.25 * dir, 0.65, 0);
  flap1.rotation.z = dir * 0.18;
  pod.add(flap1);

  const flap2 = new THREE.Mesh(flapGeo, bodyMat);
  flap2.position.set(0.35 * dir, 0.78, 0);
  flap2.rotation.z = dir * 0.18;
  pod.add(flap2);

  return pod;
}

// Add all four track pods
tank.add(createTrackPod(true, true));   // Front Left
tank.add(createTrackPod(false, true));  // Rear Left
tank.add(createTrackPod(true, false));  // Front Right
tank.add(createTrackPod(false, false)); // Rear Right

// ----------------------------------------------------------------------------
// 4. TURRET DOME & MAIN CANNON
// ----------------------------------------------------------------------------
const turretGroup = new THREE.Group();
turretGroup.position.set(-0.1, 2.05, 0);

// Turret collar ring
const turretRingGeo = new THREE.CylinderGeometry(1.5, 1.58, 0.32, 36);
const turretRing = new THREE.Mesh(turretRingGeo, darkMat);
turretRing.position.y = 0.16;
turretGroup.add(turretRing);

// Bulbous hemisphere dome (squashed Metal Slug style)
const domeGeo = new THREE.SphereGeometry(1.48, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.58);
const dome = new THREE.Mesh(domeGeo, bodyMat);
dome.position.set(0, 0.28, 0);
dome.scale.set(1.05, 0.78, 1.05);
turretGroup.add(dome);

// Equator welt / seam ring
const seamGeo = new THREE.TorusGeometry(1.49, 0.035, 12, 48);
seamGeo.rotateX(Math.PI / 2);
const seam = new THREE.Mesh(seamGeo, highlightMat);
seam.position.set(0, 0.62, 0);
turretGroup.add(seam);

// Main Cannon Mantlet (bulbous housing)
const mantletGroup = new THREE.Group();
mantletGroup.position.set(-1.15, 0.68, 0);

const mantletBallGeo = new THREE.SphereGeometry(0.72, 28, 20);
const mantletBall = new THREE.Mesh(mantletBallGeo, bodyMat);
mantletBall.scale.set(0.85, 1.0, 1.0);
mantletGroup.add(mantletBall);

// Cannon Barrel (stubby, thick, facing -X)
const barrelOuterGeo = new THREE.CylinderGeometry(0.44, 0.44, 1.25, 28, 1, true);
barrelOuterGeo.rotateZ(Math.PI / 2);
const barrelOuter = new THREE.Mesh(barrelOuterGeo, bodyMat);
barrelOuter.position.set(-0.7, 0, 0);
mantletGroup.add(barrelOuter);

// Muzzle Flange
const muzzleRingGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.22, 28);
muzzleRingGeo.rotateZ(Math.PI / 2);
const muzzleRing = new THREE.Mesh(muzzleRingGeo, highlightMat);
muzzleRing.position.set(-1.28, 0, 0);
mantletGroup.add(muzzleRing);

// Dark inner hollow bore
const boreGeo = new THREE.CylinderGeometry(0.36, 0.36, 1.22, 24);
boreGeo.rotateZ(Math.PI / 2);
const bore = new THREE.Mesh(boreGeo, metalMat);
bore.position.set(-0.75, 0, 0);
mantletGroup.add(bore);

// Visible internal rifling grooves inside the muzzle
for (let i = 0; i < 8; i++) {
  const riflingAngle = (i * Math.PI * 2) / 8;
  const riflingGeo = new THREE.BoxGeometry(0.6, 0.03, 0.04);
  const rifling = new THREE.Mesh(riflingGeo, highlightMat);
  rifling.position.set(-1.05, Math.cos(riflingAngle) * 0.33, Math.sin(riflingAngle) * 0.33);
  mantletGroup.add(rifling);
}

// Curved mantlet side pipes (connecting mantlet to turret dome)
function createMantletPipe(isLeft) {
  const zSign = isLeft ? 1 : -1;
  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.1, 0.58 * zSign),
    new THREE.Vector3(0.05, 0.05, 0.9 * zSign),
    new THREE.Vector3(0.5, -0.05, 0.98 * zSign)
  ]);
  const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.065, 12, false);
  const pipe = new THREE.Mesh(pipeGeo, darkMat);

  // Joint collar
  const collarGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
  collarGeo.rotateX(Math.PI / 2);
  const collar = new THREE.Mesh(collarGeo, highlightMat);
  collar.position.set(-0.32, 0.1, 0.58 * zSign);
  pipe.add(collar);

  return pipe;
}
mantletGroup.add(createMantletPipe(true));
mantletGroup.add(createMantletPipe(false));

turretGroup.add(mantletGroup);

// ----------------------------------------------------------------------------
// 5. TURRET SIDE PODS (Sensors & Smoke Dischargers)
// ----------------------------------------------------------------------------
// Left Pod (+Z): Sensor box with 2 diagonally offset lens ports
const leftPodGroup = new THREE.Group();
leftPodGroup.position.set(0.12, 0.72, 1.4);

const podBoxGeo = new THREE.BoxGeometry(0.85, 0.65, 0.42);
const leftPodBody = new THREE.Mesh(podBoxGeo, bodyMat);
leftPodGroup.add(leftPodBody);

// Two lens openings
function createSensorPort(x, y) {
  const portGroup = new THREE.Group();
  portGroup.position.set(x, y, 0.21);

  const outerPortGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 20);
  outerPortGeo.rotateX(Math.PI / 2);
  const outerPort = new THREE.Mesh(outerPortGeo, highlightMat);

  const innerLensGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.09, 20);
  innerLensGeo.rotateX(Math.PI / 2);
  const innerLens = new THREE.Mesh(innerLensGeo, metalMat);

  portGroup.add(outerPort, innerLens);
  return portGroup;
}
leftPodGroup.add(createSensorPort(-0.16, 0.12));
leftPodGroup.add(createSensorPort(0.18, -0.12));

turretGroup.add(leftPodGroup);

// Right Pod (-Z): Launcher box with 3 smoke discharger tubes
const rightPodGroup = new THREE.Group();
rightPodGroup.position.set(0.12, 0.72, -1.4);

const rightPodBody = new THREE.Mesh(podBoxGeo, bodyMat);
rightPodGroup.add(rightPodBody);

for (let i = 0; i < 3; i++) {
  const tubeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.28, 16);
  tubeGeo.rotateX(-Math.PI / 2);
  const tube = new THREE.Mesh(tubeGeo, darkMat);
  tube.position.set(-0.24 + i * 0.24, 0.14 - i * 0.14, -0.22);
  tube.rotation.y = -0.15;
  rightPodGroup.add(tube);
}
turretGroup.add(rightPodGroup);

// ----------------------------------------------------------------------------
// 6. TOP HATCH & HOODED SEARCHLIGHT
// ----------------------------------------------------------------------------
// Hatch Base Plate
const hatchPlateGeo = new THREE.BoxGeometry(1.05, 0.12, 0.95);
const hatchPlate = new THREE.Mesh(hatchPlateGeo, bodyMat);
hatchPlate.position.set(-0.15, 1.45, 0);
turretGroup.add(hatchPlate);

// Hatch Grab Handle
const handleCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.15, 1.52, -0.2),
  new THREE.Vector3(0.15, 1.62, -0.2),
  new THREE.Vector3(0.15, 1.62, 0.2),
  new THREE.Vector3(0.15, 1.52, 0.2)
]);
const handleGeo = new THREE.TubeGeometry(handleCurve, 16, 0.03, 8, false);
const handle = new THREE.Mesh(handleGeo, highlightMat);
turretGroup.add(handle);

// Searchlight Assembly (forward on the hatch)
const searchlightGroup = new THREE.Group();
searchlightGroup.position.set(-0.48, 1.58, 0);

// Base swivel post
const postGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.22, 16);
const post = new THREE.Mesh(postGeo, darkMat);
searchlightGroup.add(post);

// Light cylindrical body
const lightBodyGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.44, 24);
lightBodyGeo.rotateZ(Math.PI / 2);
const lightBody = new THREE.Mesh(lightBodyGeo, bodyMat);
lightBody.position.set(-0.15, 0.25, 0);
searchlightGroup.add(lightBody);

// Hooded Cowl / Visor (protective upper eyelid hood)
const hoodGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.32, 24, 1, true, -Math.PI * 0.8, Math.PI * 1.6);
hoodGeo.rotateZ(Math.PI / 2);
const hood = new THREE.Mesh(hoodGeo, highlightMat);
hood.position.set(-0.28, 0.25, 0);
searchlightGroup.add(hood);

// Recessed front lens
const lensGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 20);
lensGeo.rotateZ(Math.PI / 2);
const lens = new THREE.Mesh(lensGeo, metalMat);
lens.position.set(-0.35, 0.25, 0);
searchlightGroup.add(lens);

turretGroup.add(searchlightGroup);

// ----------------------------------------------------------------------------
// 7. TWIN REAR VULCAN / GATLING CANNONS
// ----------------------------------------------------------------------------
function createVulcanGun(isLeft) {
  const vulcan = new THREE.Group();
  const zSign = isLeft ? 1 : -1;
  vulcan.position.set(0.92, 0.82, 0.95 * zSign);

  // Swivel mounting ball
  const ballGeo = new THREE.SphereGeometry(0.25, 18, 14);
  const ball = new THREE.Mesh(ballGeo, darkMat);
  vulcan.add(ball);

  // Aiming orientation: Angled rearward (+X), outward (+/- Z), upward (+Y)
  const gunAssembly = new THREE.Group();

  // Receiver housing
  const recvGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.45, 18);
  const recv = new THREE.Mesh(recvGeo, bodyMat);
  gunAssembly.add(recv);

  // Central axle rod
  const axleGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.3, 12);
  const axle = new THREE.Mesh(axleGeo, metalMat);
  axle.position.y = 0.65;
  gunAssembly.add(axle);

  // 6 rotary gun barrels
  const numBarrels = 6;
  const clusterRadius = 0.13;
  const barrelGeo = new THREE.CylinderGeometry(0.032, 0.032, 1.25, 10);

  for (let i = 0; i < numBarrels; i++) {
    const angle = (i * Math.PI * 2) / numBarrels;
    const b = new THREE.Mesh(barrelGeo, metalMat);
    b.position.set(Math.cos(angle) * clusterRadius, 0.65, Math.sin(angle) * clusterRadius);
    gunAssembly.add(b);
  }

  // Support rings holding the barrel cluster
  const spacerRingGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 18);
  const ring1 = new THREE.Mesh(spacerRingGeo, highlightMat);
  ring1.position.y = 0.6;
  const ring2 = new THREE.Mesh(spacerRingGeo, highlightMat);
  ring2.position.y = 1.15;
  gunAssembly.add(ring1, ring2);

  // Orient gun towards rear-up-outward
  gunAssembly.rotation.order = 'ZYX';
  gunAssembly.rotation.z = -Math.PI * 0.32;
  gunAssembly.rotation.x = zSign * Math.PI * 0.15;
  gunAssembly.rotation.y = zSign * 0.2;

  vulcan.add(gunAssembly);
  return vulcan;
}

turretGroup.add(createVulcanGun(true));
turretGroup.add(createVulcanGun(false));

// ----------------------------------------------------------------------------
// 8. EXHAUSTS, BREATHER PIPE & DUAL ANTENNAS
// ----------------------------------------------------------------------------
// Primary angled exhaust pipe
const exhaustGroup = new THREE.Group();
exhaustGroup.position.set(0.68, 1.15, 0.38);

const exhaustPipeGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.85, 18);
const exhaustPipe = new THREE.Mesh(exhaustPipeGeo, darkMat);
exhaustPipe.rotation.z = -0.45;
exhaustPipe.rotation.x = 0.2;
exhaustGroup.add(exhaustPipe);

// Hollow beveled rim
const exhaustLipGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.12, 18);
const exhaustLip = new THREE.Mesh(exhaustLipGeo, highlightMat);
exhaustLip.position.set(0.18, 0.36, 0.08);
exhaustLip.rotation.z = -0.45;
exhaustLip.rotation.x = 0.2;
exhaustGroup.add(exhaustLip);

turretGroup.add(exhaustGroup);

// Secondary bent breather snorkel tube
const breatherCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.72, 1.1, 0.58),
  new THREE.Vector3(0.85, 1.6, 0.65),
  new THREE.Vector3(0.92, 1.68, 0.72),
  new THREE.Vector3(0.88, 1.62, 0.82)
]);
const breatherGeo = new THREE.TubeGeometry(breatherCurve, 20, 0.038, 10, false);
const breather = new THREE.Mesh(breatherGeo, darkMat);
turretGroup.add(breather);

// Dual whip antennas (thin tapered rods with terminal spheres)
function createAntenna(length, tipRadius, rotZ, rotX, offsetX, offsetZ) {
  const antGroup = new THREE.Group();
  antGroup.position.set(0.48 + offsetX, 1.35, -0.45 + offsetZ);

  // Antenna base socket
  const baseGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12);
  const base = new THREE.Mesh(baseGeo, highlightMat);
  antGroup.add(base);

  // Whip rod
  const rodGeo = new THREE.CylinderGeometry(0.01, 0.028, length, 8);
  const rod = new THREE.Mesh(rodGeo, metalMat);
  rod.position.y = length / 2;
  rod.rotation.z = rotZ;
  rod.rotation.x = rotX;
  antGroup.add(rod);

  // Tip ball
  const ballGeo = new THREE.SphereGeometry(tipRadius, 12, 10);
  const ball = new THREE.Mesh(ballGeo, highlightMat);
  const endX = -Math.sin(rotZ) * length;
  const endY = Math.cos(rotZ) * length;
  const endZ = Math.sin(rotX) * length;
  ball.position.set(endX, endY, endZ);
  antGroup.add(ball);

  return antGroup;
}

turretGroup.add(createAntenna(2.5, 0.05, -0.22, 0.12, 0, 0));       // Tall whip antenna
turretGroup.add(createAntenna(1.7, 0.042, -0.32, -0.15, 0.12, 0.15)); // Secondary antenna

// Add the entire Turret assembly to the tank
tank.add(turretGroup);

// ----------------------------------------------------------------------------
// 9. CAMERA & VIEW CONFIGURATION
// Matching the dramatic isometric 3/4 high angle in the reference image
// ----------------------------------------------------------------------------
camera.position.set(-11.5, 9.8, 11.2);
camera.lookAt(-0.2, 1.7, 0);

if (controls) {
  controls.target.set(-0.2, 1.7, 0);
  controls.update();
}