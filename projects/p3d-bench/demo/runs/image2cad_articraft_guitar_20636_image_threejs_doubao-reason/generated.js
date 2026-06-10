// --------------------------
// Parameters (proportional to semi-hollow electric guitar standard)
// --------------------------
const totalGuitarLength = 105;
const bodyLength = 42;
const bodyWidth = 34;
const bodyThickness = 4;
const neckLength = 52;
const neckWidthAtNut = 3.2;
const neckWidthAtBody = 4.8;
const neckThickness = 2;
const fretboardThickness = 0.6;
const headstockLength = 11;
const headstockWidth = 7.5;
const headstockTilt = 0.15; // radians backwards tilt

// --------------------------
// Materials
// --------------------------
const woodBodyMat = new THREE.MeshStandardMaterial({ color: 0x660000, roughness: 0.6, metalness: 0.1 });
const woodNeckMat = new THREE.MeshStandardMaterial({ color: 0xc19a6b, roughness: 0.7, metalness: 0.05 });
const fretboardMat = new THREE.MeshStandardMaterial({ color: 0x2b1d18, roughness: 0.5, metalness: 0 });
const hardwareMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.3, metalness: 0.8 });
const pickupMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 });
const cavityMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

// --------------------------
// Guitar Body (semi-hollow ES-style shape)
// --------------------------
const bodyShape = new THREE.Shape();
// Draw symmetrical curved body with cutaways
bodyShape.moveTo(bodyLength * 0.3, 0);
bodyShape.bezierCurveTo(bodyLength * 0.4, bodyWidth * 0.25, bodyLength * 0.9, bodyWidth * 0.35, bodyLength, 0);
bodyShape.bezierCurveTo(bodyLength * 0.9, -bodyWidth * 0.35, bodyLength * 0.4, -bodyWidth * 0.25, bodyLength * 0.3, 0);
bodyShape.bezierCurveTo(bodyLength * 0.1, -bodyWidth * 0.45, -bodyLength * 0.4, -bodyWidth * 0.3, -bodyLength * 0.48, -neckWidthAtBody/2 - 0.5);
bodyShape.lineTo(-bodyLength * 0.48, neckWidthAtBody/2 + 0.5);
bodyShape.bezierCurveTo(-bodyLength * 0.4, bodyWidth * 0.3, bodyLength * 0.1, bodyWidth * 0.45, bodyLength * 0.3, 0);

const bodyExtrudeOpts = { depth: bodyThickness, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 4 };
const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeOpts);
const body = new THREE.Mesh(bodyGeom, woodBodyMat);
body.rotation.x = -Math.PI / 2; // align extrude depth to scene Z axis
body.position.z = bodyThickness / 2;
scene.add(body);

// --------------------------
// Neck (tapered)
// --------------------------
const neckGeom = new THREE.BoxGeometry(neckLength, neckThickness, (neckWidthAtNut + neckWidthAtBody)/2, 10, 1, 1);
// Taper vertices: narrower at headstock, wider at body
const neckPosAttrib = neckGeom.attributes.position;
for (let i = 0; i < neckPosAttrib.count; i++) {
  const x = neckPosAttrib.getX(i);
  const taperFactor = (x + neckLength/2) / neckLength; // 0 = head end, 1 = body end
  const currentWidth = neckWidthAtNut + taperFactor * (neckWidthAtBody - neckWidthAtNut);
  neckPosAttrib.setZ(i, Math.sign(neckPosAttrib.getZ(i)) * currentWidth / 2);
}
neckGeom.attributes.position.needsUpdate = true;
neckGeom.computeVertexNormals();

const neck = new THREE.Mesh(neckGeom, woodNeckMat);
neck.position.x = -neckLength/2 - bodyLength * 0.48;
neck.position.z = neckThickness/2 + bodyThickness / 2;
scene.add(neck);

// --------------------------
// Fretboard with frets
// --------------------------
const fretboardGeom = new THREE.BoxGeometry(neckLength, fretboardThickness, (neckWidthAtNut + neckWidthAtBody)/2 + 0.1, 20, 1, 1);
const fbPosAttrib = fretboardGeom.attributes.position;
for (let i = 0; i < fbPosAttrib.count; i++) {
  const x = fbPosAttrib.getX(i);
  const taperFactor = (x + neckLength/2) / neckLength;
  const currentWidth = neckWidthAtNut + taperFactor * (neckWidthAtBody - neckWidthAtNut) + 0.1;
  fbPosAttrib.setZ(i, Math.sign(fbPosAttrib.getZ(i)) * currentWidth / 2);
}
fretboardGeom.attributes.position.needsUpdate = true;
fretboardGeom.computeVertexNormals();

const fretboard = new THREE.Mesh(fretboardGeom, fretboardMat);
fretboard.position.x = neck.position.x;
fretboard.position.z = neck.position.z + neckThickness/2 + fretboardThickness/2;
scene.add(fretboard);

// Add metal fret lines
for (let fretNum = 0; fretNum < 20; fretNum++) {
  const fretX = -neckLength/2 + (fretNum/20) * neckLength - bodyLength * 0.48;
  const fretWidth = neckWidthAtNut + (fretNum/20)*(neckWidthAtBody - neckWidthAtNut) + 0.2;
  const fretGeom = new THREE.BoxGeometry(0.1, 0.1, fretWidth);
  const fret = new THREE.Mesh(fretGeom, hardwareMat);
  fret.position.set(fretX, 0, fretboard.position.z + fretboardThickness/2 + 0.05);
  scene.add(fret);
}

// --------------------------
// Headstock with tuning pegs
// --------------------------
const headstockGeom = new THREE.BoxGeometry(headstockLength, neckThickness, headstockWidth);
const headstock = new THREE.Mesh(headstockGeom, woodNeckMat);
headstock.position.x = neck.position.x - neckLength/2 - headstockLength/2 + 1;
headstock.position.z = neck.position.z;
headstock.rotation.x = headstockTilt;
headstock.rotation.y = 0.2;
scene.add(headstock);

// 6 tuning pegs, 3 per side
for (let side = 0; side < 2; side++) {
  const zOffset = side === 0 ? headstockWidth/2 + 0.5 : -headstockWidth/2 - 0.5;
  for (let pegNum = 0; pegNum < 3; pegNum++) {
    const pegX = headstock.position.x - headstockLength/2 + 2 + pegNum * 2.5;
    const pegGeom = new THREE.CylinderGeometry(0.4, 0.4, 1, 8);
    pegGeom.rotateX(Math.PI/2);
    const peg = new THREE.Mesh(pegGeom, hardwareMat);
    peg.position.set(pegX, 0, zOffset);
    scene.add(peg);
  }
}

// --------------------------
// Hardware: Pickups, Bridge, Knobs
// --------------------------
// Two humbucker pickups
for (let puIndex = 0; puIndex < 2; puIndex++) {
  const puX = bodyLength * 0.1 + puIndex * 6;
  const puGeom = new THREE.BoxGeometry(7, 0.5, 4);
  const pickup = new THREE.Mesh(puGeom, pickupMat);
  pickup.position.set(puX, 0, bodyThickness + 0.25);
  scene.add(pickup);

  // Add metal pole pieces
  for (let z = -1.5; z <= 1.5; z += 1) {
    for (let xOff = -2.5; xOff <= 2.5; xOff += 1.25) {
      const poleGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6);
      poleGeom.rotateX(Math.PI/2);
      const pole = new THREE.Mesh(poleGeom, hardwareMat);
      pole.position.set(puX + xOff, z, bodyThickness + 0.5 + 0.1);
      scene.add(pole);
    }
  }
}

// Bridge
const bridgeGeom = new THREE.BoxGeometry(8, 0.6, 5);
const bridge = new THREE.Mesh(bridgeGeom, hardwareMat);
bridge.position.set(bodyLength * 0.35, 0, bodyThickness + 0.3);
scene.add(bridge);

// 4 control knobs
for (let knobIndex = 0; knobIndex < 4; knobIndex++) {
  const kx = bodyLength * 0.6 + (knobIndex % 2) * 3;
  const ky = -bodyWidth * 0.15 + Math.floor(knobIndex/2) * 4;
  const knobGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.7, 10);
  knobGeom.rotateX(Math.PI/2);
  const knob = new THREE.Mesh(knobGeom, hardwareMat);
  knob.position.set(kx, ky, bodyThickness + 0.35);
  scene.add(knob);
}

// F-holes
const fHoleShape = new THREE.Shape();
fHoleShape.moveTo(0, 0);
fHoleShape.bezierCurveTo(2, 0.5, 4, 3, 2, 5);
fHoleShape.bezierCurveTo(0, 4, -1, 2, 0, 0);
const fHoleGeom = new THREE.ExtrudeGeometry(fHoleShape, { depth: 0.4, bevelEnabled: false });

// Left f-hole
const fHoleLeft = new THREE.Mesh(fHoleGeom, cavityMat);
fHoleLeft.position.set(bodyLength * 0.2, bodyWidth * 0.2, bodyThickness - 0.1);
fHoleLeft.rotation.z = -Math.PI / 4;
fHoleLeft.rotation.x = Math.PI / 2;
scene.add(fHoleLeft);

// Right f-hole
const fHoleRight = new THREE.Mesh(fHoleGeom, cavityMat);
fHoleRight.position.set(bodyLength * 0.2, -bodyWidth * 0.2, bodyThickness - 0.1);
fHoleRight.rotation.z = Math.PI / 4 + Math.PI;
fHoleRight.rotation.x = Math.PI / 2;
scene.add(fHoleRight);

// --------------------------
// Camera positioning matching reference view
// --------------------------
camera.position.set(-25, -90, 65);
camera.lookAt(0, 0, 10);