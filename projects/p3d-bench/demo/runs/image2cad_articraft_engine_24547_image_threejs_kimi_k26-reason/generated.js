// ============================================================
// Parametric recreation of a small horizontal single-cylinder engine
// (resembling a hot-air / Stirling engine model with finned cylinder,
// twin spoked flywheels, crankshaft, and connecting rod)
// ============================================================

const material = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  metalness: 0.6,
  roughness: 0.4
});

// --- Base dimensions ---
const baseW = 18, baseD = 20, baseH = 1;
const platW = 12, platD = 14, platH = 4;
const pedW = 6, pedH = 6, pedD = 5;

// --- Flywheel dimensions ---
const fwRadius = 5;
const fwThick = 1.2;
const fwHubR = 1.2;
const fwHoleR = 1.4;
const fwHoleOff = 2.8; // radial offset of lightening holes

// --- Cylinder dimensions ---
const cylRadius = 2.5;
const cylLength = 9;
const cylCenterY = 8;       // centerline height (same as shaft)
const cylCenterX = -5.5;    // barrel centered along X
const finRadius = 2.8;
const finThick = 0.15;
const finCount = 12;

// --- Shaft & crank dimensions ---
const shaftRadius = 0.5;
const leftFwX = 2;
const rightFwX = 10;
const shaftLength = 10;
const crankRadius = 1.2;
const crankPinRadius = 0.4;
const crankPinLength = 1.0;
const crankAngle = Math.PI / 4; // crank-pin angle on flywheel face

// ============================================================
// BASE & PEDESTAL
// ============================================================

// Bottom plate
const baseGeom = new THREE.BoxGeometry(baseW, baseH, baseD);
const base = new THREE.Mesh(baseGeom, material);
base.position.set(2, baseH / 2, 0);
scene.add(base);

// Raised central platform
const platGeom = new THREE.BoxGeometry(platW, platH, platD);
const platform = new THREE.Mesh(platGeom, material);
platform.position.set(3, baseH + platH / 2, 0);
scene.add(platform);

// Main bearing pedestal
const pedGeom = new THREE.BoxGeometry(pedW, pedH, pedD);
const pedestal = new THREE.Mesh(pedGeom, material);
pedestal.position.set(4, baseH + platH + pedH / 2, 0);
scene.add(pedestal);

// Bearing cap on top of pedestal
const capGeom = new THREE.BoxGeometry(pedW + 1, 1.5, pedD);
const bearingCap = new THREE.Mesh(capGeom, material);
bearingCap.position.set(4, baseH + platH + pedH + 0.75, 0);
scene.add(bearingCap);

// ============================================================
// CYLINDER ASSEMBLY (finned barrel, head, cap, foot)
// ============================================================

const cylGroup = new THREE.Group();

// Main barrel
const barrelGeom = new THREE.CylinderGeometry(cylRadius, cylRadius, cylLength, 32);
barrelGeom.rotateZ(Math.PI / 2);
const barrel = new THREE.Mesh(barrelGeom, material);
barrel.position.set(cylCenterX, cylCenterY, 0);
cylGroup.add(barrel);

// Head flange at right end (abuts the barrel)
const headGeom = new THREE.CylinderGeometry(3.2, 3.2, 1, 32);
headGeom.rotateZ(Math.PI / 2);
const head = new THREE.Mesh(headGeom, material);
head.position.set(cylCenterX + cylLength / 2 + 0.5, cylCenterY, 0);
cylGroup.add(head);

// Cooling fins along barrel
for (let i = 0; i < finCount; i++) {
  const fGeom = new THREE.CylinderGeometry(finRadius, finRadius, finThick, 32);
  fGeom.rotateZ(Math.PI / 2);
  const fin = new THREE.Mesh(fGeom, material);
  const x = (cylCenterX - cylLength / 2) + 0.8 + i * 0.65;
  fin.position.set(x, cylCenterY, 0);
  cylGroup.add(fin);
}

// Filler / oiler cap on top of barrel
const fillerGeom = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16);
const filler = new THREE.Mesh(fillerGeom, material);
filler.position.set(cylCenterX + 1, cylCenterY + cylRadius + 0.6, 0);
cylGroup.add(filler);

// Small foot / drain pipe underneath left end
const footGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
const foot = new THREE.Mesh(footGeom, material);
foot.position.set(cylCenterX - cylLength / 2 + 1, cylCenterY - cylRadius - 0.75, 0);
cylGroup.add(foot);

scene.add(cylGroup);

// Support bracket under cylinder head
const bracketH = cylCenterY - (baseH + platH);
const bracketGeom = new THREE.BoxGeometry(2, bracketH, 3);
const bracket = new THREE.Mesh(bracketGeom, material);
bracket.position.set(-0.5, baseH + platH + bracketH / 2, 0);
scene.add(bracket);

// ============================================================
// FLYWHEELS (spoked with 4 lightening holes)
// ============================================================

function makeFlywheel() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, fwRadius, 0, Math.PI * 2, false);

  // Central hub hole
  const hub = new THREE.Path();
  hub.absarc(0, 0, fwHubR, 0, Math.PI * 2, true);
  shape.holes.push(hub);

  // Four circular lightening holes
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * (Math.PI / 2);
    const h = new THREE.Path();
    h.absarc(Math.cos(a) * fwHoleOff, Math.sin(a) * fwHoleOff, fwHoleR, 0, Math.PI * 2, true);
    shape.holes.push(h);
  }

  // Extrude and orient perpendicular to X-axis (shaft axis)
  const geom = new THREE.ExtrudeGeometry(shape, { depth: fwThick, bevelEnabled: false });
  geom.translate(0, 0, -fwThick / 2);
  geom.rotateY(Math.PI / 2);

  const mesh = new THREE.Mesh(geom, material);

  // Hub boss
  const bossGeom = new THREE.CylinderGeometry(1.6, 1.6, fwThick + 0.4, 16);
  bossGeom.rotateZ(Math.PI / 2);
  const boss = new THREE.Mesh(bossGeom, material);
  mesh.add(boss);

  return mesh;
}

const leftFW = makeFlywheel();
leftFW.position.set(leftFwX, cylCenterY, 0);
scene.add(leftFW);

const rightFW = makeFlywheel();
rightFW.position.set(rightFwX, cylCenterY, 0);
scene.add(rightFW);

// ============================================================
// CRANKSHAFT, WEB, CRANK PIN
// ============================================================

// Main shaft
const shaftGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 16);
shaftGeom.rotateZ(Math.PI / 2);
const shaft = new THREE.Mesh(shaftGeom, material);
shaft.position.set((leftFwX + rightFwX) / 2, cylCenterY, 0);
scene.add(shaft);

// Crank web (thick disk on inner face of left flywheel)
const webGeom = new THREE.CylinderGeometry(2, 2, 0.6, 16);
webGeom.rotateZ(Math.PI / 2);
const web = new THREE.Mesh(webGeom, material);
web.position.set(leftFwX + fwThick / 2 + 0.3, cylCenterY, 0);
scene.add(web);

// Crank pin (offset from shaft center on flywheel plane)
const pinGeom = new THREE.CylinderGeometry(crankPinRadius, crankPinRadius, crankPinLength, 12);
pinGeom.rotateZ(Math.PI / 2);
const crankPin = new THREE.Mesh(pinGeom, material);
crankPin.position.set(
  leftFwX + fwThick / 2 + crankPinLength / 2,
  cylCenterY + Math.sin(crankAngle) * crankRadius,
  Math.cos(crankAngle) * crankRadius
);
scene.add(crankPin);

// ============================================================
// CONNECTING ROD & CROSSHEAD
// ============================================================

// Rod end at piston / crosshead (just right of cylinder head)
const rodStart = new THREE.Vector3(0.5, cylCenterY, 0);
const rodEnd = new THREE.Vector3(crankPin.position.x, crankPin.position.y, crankPin.position.z);
const rodVec = new THREE.Vector3().subVectors(rodEnd, rodStart);
const rodLen = rodVec.length();
const rodMid = new THREE.Vector3().addVectors(rodStart, rodEnd).multiplyScalar(0.5);

const rodGeom = new THREE.CylinderGeometry(0.25, 0.25, rodLen, 8);
const rod = new THREE.Mesh(rodGeom, material);
rod.position.copy(rodMid);
rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rodVec.clone().normalize());
scene.add(rod);

// Crosshead slider block
const crossGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const crosshead = new THREE.Mesh(crossGeom, material);
crosshead.position.copy(rodStart);
scene.add(crosshead);

// ============================================================
// CAMERA
// ============================================================
camera.position.set(22, 18, 22);
camera.lookAt(2, 6, 0);