// Parameters for the clock
const outerRadius = 12;
const innerRadius = 10;
const baseThickness = 1.0;
const rimHeight = 0.6;
const numeralRadius = 7.5;
const numeralDepth = 0.25;
const numeralStrokeWidth = 0.22;
const numeralStrokeLen = 1.0;
const handThickness = 0.12;
const hourHandLength = 4.5;
const hourHandWidth = 0.45;
const minuteHandLength = 7.0;
const minuteHandWidth = 0.3;
const centerHubRadius = 0.6;
const centerHubHeight = 0.35;

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const faceMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
const detailMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

// 1. Main base cylinder (the clock body)
const baseGeom = new THREE.CylinderGeometry(outerRadius, outerRadius, baseThickness, 64);
const baseMesh = new THREE.Mesh(baseGeom, bodyMaterial);
scene.add(baseMesh);

// 2. Raised outer rim created by extruding a ring shape
const rimShape = new THREE.Shape();
rimShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
const holePath = new THREE.Path();
holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
rimShape.holes.push(holePath);
const rimGeom = new THREE.ExtrudeGeometry(rimShape, {
  depth: rimHeight,
  bevelEnabled: false,
  curveSegments: 64
});
rimGeom.rotateX(-Math.PI / 2); // Lay flat so extrusion goes up in Y
const rimMesh = new THREE.Mesh(rimGeom, bodyMaterial);
rimMesh.position.y = baseThickness / 2;
scene.add(rimMesh);

// 3. Inner face disk (slightly different shade for visual contrast)
const faceGeom = new THREE.CylinderGeometry(innerRadius, innerRadius, 0.02, 64);
const faceMesh = new THREE.Mesh(faceGeom, faceMaterial);
faceMesh.position.y = baseThickness / 2;
scene.add(faceMesh);

// 3b. Slight raised center boss (visible in image)
const bossRadius = 2.2;
const bossHeight = 0.08;
const bossGeom = new THREE.CylinderGeometry(bossRadius, bossRadius, bossHeight, 64);
const bossMesh = new THREE.Mesh(bossGeom, faceMaterial);
bossMesh.position.y = baseThickness / 2 + bossHeight / 2;
scene.add(bossMesh);

// 4. Center hub (cap over the hand pivot)
const handY = baseThickness / 2 + numeralDepth + 0.02;
const hubGeom = new THREE.CylinderGeometry(centerHubRadius, centerHubRadius, centerHubHeight, 32);
const hubMesh = new THREE.Mesh(hubGeom, detailMaterial);
hubMesh.position.y = handY + handThickness + centerHubHeight / 2 + 0.01;
scene.add(hubMesh);

// Helper to add a single stroke (bar) for Roman numerals
function addStroke(group, x, z, length, angle, width = numeralStrokeWidth) {
  const geom = new THREE.BoxGeometry(width, numeralDepth, length);
  const mesh = new THREE.Mesh(geom, detailMaterial);
  mesh.position.set(x, baseThickness / 2 + numeralDepth / 2, z);
  mesh.rotation.y = angle;
  group.add(mesh);
}

// Build Roman numerals from simple box strokes lying flat on the face
function createRomanNumeral(value) {
  const group = new THREE.Group();
  const s = numeralStrokeWidth;
  const L = numeralStrokeLen;

  switch (value) {
    case 'I':
      addStroke(group, 0, 0, L, 0);
      break;
    case 'II':
      addStroke(group, -0.35, 0, L, 0);
      addStroke(group, 0.35, 0, L, 0);
      break;
    case 'III':
      addStroke(group, -0.4, 0, L, 0);
      addStroke(group, 0, 0, L, 0);
      addStroke(group, 0.4, 0, L, 0);
      break;
    case 'IV':
      addStroke(group, -0.55, 0, L, 0, s);
      addStroke(group, 0.15, -0.1, L * 1.05, 0.35, s);
      addStroke(group, 0.55, -0.1, L * 1.05, -0.35, s);
      break;
    case 'V':
      addStroke(group, -0.2, -0.1, L * 1.05, 0.35, s);
      addStroke(group, 0.2, -0.1, L * 1.05, -0.35, s);
      break;
    case 'VI':
      addStroke(group, -0.2, -0.1, L * 1.05, 0.35, s);
      addStroke(group, 0.2, -0.1, L * 1.05, -0.35, s);
      addStroke(group, 0.6, 0, L, 0, s);
      break;
    case 'VII':
      addStroke(group, -0.3, -0.1, L * 1.05, 0.35, s);
      addStroke(group, 0.1, -0.1, L * 1.05, -0.35, s);
      addStroke(group, 0.5, 0, L, 0, s);
      addStroke(group, 0.9, 0, L, 0, s);
      break;
    case 'VIII':
      addStroke(group, -0.35, -0.1, L * 1.05, 0.35, s);
      addStroke(group, 0.05, -0.1, L * 1.05, -0.35, s);
      addStroke(group, 0.45, 0, L, 0, s);
      addStroke(group, 0.85, 0, L, 0, s);
      addStroke(group, 1.25, 0, L, 0, s);
      break;
    case 'IX':
      addStroke(group, -0.55, 0, L, 0, s);
      addStroke(group, 0.15, 0, L * 1.1, Math.PI / 4, s);
      addStroke(group, 0.15, 0, L * 1.1, -Math.PI / 4, s);
      break;
    case 'X':
      addStroke(group, 0, 0, L * 1.1, Math.PI / 4, s);
      addStroke(group, 0, 0, L * 1.1, -Math.PI / 4, s);
      break;
    case 'XI':
      addStroke(group, -0.25, 0, L * 1.1, Math.PI / 4, s);
      addStroke(group, -0.25, 0, L * 1.1, -Math.PI / 4, s);
      addStroke(group, 0.55, 0, L, 0, s);
      break;
    case 'XII':
      addStroke(group, -0.25, 0, L * 1.1, Math.PI / 4, s);
      addStroke(group, -0.25, 0, L * 1.1, -Math.PI / 4, s);
      addStroke(group, 0.45, 0, L, 0, s);
      addStroke(group, 0.85, 0, L, 0, s);
      break;
  }
  return group;
}

// Place Roman numerals around the clock face
const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const numeralGroup = createRomanNumeral(numerals[i]);
  numeralGroup.position.set(
    Math.sin(angle) * numeralRadius,
    0,
    Math.cos(angle) * numeralRadius
  );
  numeralGroup.rotation.y = angle;
  scene.add(numeralGroup);
}

// 5. Hour hand
const hourHandGeom = new THREE.BoxGeometry(hourHandWidth, handThickness, hourHandLength);
hourHandGeom.translate(0, 0, hourHandLength / 2 - 0.2);
const hourHand = new THREE.Mesh(hourHandGeom, detailMaterial);
hourHand.position.y = handY + handThickness / 2;
hourHand.rotation.y = -Math.PI / 3; // ~2 o'clock
scene.add(hourHand);

// 6. Minute hand
const minuteHandGeom = new THREE.BoxGeometry(minuteHandWidth, handThickness, minuteHandLength);
minuteHandGeom.translate(0, 0, minuteHandLength / 2 - 0.2);
const minuteHand = new THREE.Mesh(minuteHandGeom, detailMaterial);
minuteHand.position.y = handY + handThickness / 2 + 0.03;
minuteHand.rotation.y = Math.PI / 6; // ~11 o'clock
scene.add(minuteHand);

// Adjust camera
camera.position.set(20, 25, 20);
camera.lookAt(0, 0, 0);