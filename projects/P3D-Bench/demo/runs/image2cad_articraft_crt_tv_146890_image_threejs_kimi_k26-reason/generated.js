// Retro CRT Television Parameters
// Based on vintage box-style TV with rabbit-ear antennas
const tvW = 14;
const tvH = 9;
const tvD = 5;
const bezelThick = 0.35;
const bezelDepth = 0.4;
const frontZ = tvD / 2;

// Materials
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const screenMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.15, metalness: 0.6 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x080808 });
const silverMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.9, roughness: 0.1 });

// Main chassis
const body = new THREE.Mesh(new THREE.BoxGeometry(tvW, tvH, tvD), bodyMat);
scene.add(body);

// Screen dimensions and position (left-of-center to make room for control panel)
const screenW = 8;
const screenH = 6;
const screenX = -2.3;
const screenY = 0.4;

// Bezel frame protrudes from front face
const bezelZ = frontZ + bezelDepth / 2;

// Top bezel
const topBezel = new THREE.Mesh(
  new THREE.BoxGeometry(screenW + bezelThick * 2, bezelThick, bezelDepth),
  bodyMat
);
topBezel.position.set(screenX, screenY + screenH / 2 + bezelThick / 2, bezelZ);
scene.add(topBezel);

// Bottom bezel (chin, slightly thicker for branding area)
const botBezelH = 0.9;
const botBezel = new THREE.Mesh(
  new THREE.BoxGeometry(screenW + bezelThick * 2, botBezelH, bezelDepth),
  bodyMat
);
botBezel.position.set(screenX, screenY - screenH / 2 - botBezelH / 2, bezelZ);
scene.add(botBezel);

// Left bezel
const leftBezel = new THREE.Mesh(
  new THREE.BoxGeometry(bezelThick, screenH, bezelDepth),
  bodyMat
);
leftBezel.position.set(screenX - screenW / 2 - bezelThick / 2, screenY, bezelZ);
scene.add(leftBezel);

// Right bezel (divider between screen and control panel)
const rightBezel = new THREE.Mesh(
  new THREE.BoxGeometry(bezelThick, screenH, bezelDepth),
  bodyMat
);
rightBezel.position.set(screenX + screenW / 2 + bezelThick / 2, screenY, bezelZ);
scene.add(rightBezel);

// CRT Screen with subtle spherical curvature
const screenGeo = new THREE.BoxGeometry(screenW, screenH, 0.1, 24, 24, 1);
const posAttr = screenGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  const x = posAttr.getX(i);
  const y = posAttr.getY(i);
  // Parabolic bulge approximating CRT glass curvature
  const bulge = (x * x + y * y) / 80;
  posAttr.setZ(i, posAttr.getZ(i) + bulge);
}
screenGeo.computeVertexNormals();
const screenMesh = new THREE.Mesh(screenGeo, screenMat);
screenMesh.position.set(screenX, screenY, frontZ - 0.15);
scene.add(screenMesh);

// Branding bar on bottom chin
const brandBar = new THREE.Mesh(new THREE.BoxGeometry(2, 0.25, 0.05), blackMat);
brandBar.position.set(screenX, screenY - screenH / 2 - botBezelH / 2, frontZ + bezelDepth + 0.02);
scene.add(brandBar);

// Control panel (right side of front face)
const cpW = 3.0;
const cpH = 7.0;
const cpX = screenX + screenW / 2 + bezelThick + 0.3 + cpW / 2;
const cpY = 0.2;

// Control panel backing plate
const cpPlate = new THREE.Mesh(new THREE.BoxGeometry(cpW, cpH, 0.2), darkMat);
cpPlate.position.set(cpX, cpY, frontZ + 0.1);
scene.add(cpPlate);

// Control knobs (top of panel)
const knobGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16);
const knob1 = new THREE.Mesh(knobGeo, blackMat);
knob1.rotation.x = Math.PI / 2;
knob1.position.set(cpX - 0.5, cpY + cpH / 2 - 0.5, frontZ + 0.25);
scene.add(knob1);

const knob2 = new THREE.Mesh(knobGeo, blackMat);
knob2.rotation.x = Math.PI / 2;
knob2.position.set(cpX + 0.5, cpY + cpH / 2 - 0.5, frontZ + 0.25);
scene.add(knob2);

// Speaker grille (horizontal slats)
const slatCount = 7;
const slatW = cpW - 0.6;
const slatH = 0.12;
const slatGeo = new THREE.BoxGeometry(slatW, slatH, 0.06);
for (let i = 0; i < slatCount; i++) {
  const slat = new THREE.Mesh(slatGeo, blackMat);
  const slatY = cpY + cpH / 2 - 1.2 - i * 0.45;
  slat.position.set(cpX, slatY, frontZ + 0.22);
  scene.add(slat);
}

// Lower dark panel (tape deck / vent area)
const lowerPanel = new THREE.Mesh(
  new THREE.BoxGeometry(cpW - 0.4, cpH / 2 - 0.5, 0.05),
  blackMat
);
lowerPanel.position.set(cpX, cpY - cpH / 4 - 0.2, frontZ + 0.22);
scene.add(lowerPanel);

// Rear chassis bulge (CRT tube housing extends behind main box)
const rearBulge = new THREE.Mesh(
  new THREE.BoxGeometry(tvW - 2, tvH - 1.5, 1.2),
  bodyMat
);
rearBulge.position.set(0, 0.2, -tvD / 2 - 0.6);
scene.add(rearBulge);

// Antennas (rabbit ears) using groups for correct pivoting
const antH = 7;
const antRad = 0.05;
const antGeo = new THREE.CylinderGeometry(antRad, antRad, antH, 8);
const baseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8);

// Antenna 1 (left, angled back and left)
const ant1Group = new THREE.Group();
ant1Group.position.set(screenX + 1.0, tvH / 2, -tvD / 2 + 1.5);
const ant1Mesh = new THREE.Mesh(antGeo, silverMat);
ant1Mesh.position.y = antH / 2;
ant1Group.add(ant1Mesh);
ant1Group.rotation.x = -Math.PI / 7;
ant1Group.rotation.z = 0.3;
scene.add(ant1Group);

const base1 = new THREE.Mesh(baseGeo, darkMat);
base1.position.set(screenX + 1.0, tvH / 2 + 0.15, -tvD / 2 + 1.5);
scene.add(base1);

// Antenna 2 (right, angled back and right)
const ant2Group = new THREE.Group();
ant2Group.position.set(screenX + 3.0, tvH / 2, -tvD / 2 + 1.5);
const ant2Mesh = new THREE.Mesh(antGeo, silverMat);
ant2Mesh.position.y = antH / 2;
ant2Group.add(ant2Mesh);
ant2Group.rotation.x = -Math.PI / 6;
ant2Group.rotation.z = -0.35;
scene.add(ant2Group);

const base2 = new THREE.Mesh(baseGeo, darkMat);
base2.position.set(screenX + 3.0, tvH / 2 + 0.15, -tvD / 2 + 1.5);
scene.add(base2);

// Camera position for isometric-style view matching the reference
camera.position.set(18, 14, 18);
camera.lookAt(0, 0, 0);