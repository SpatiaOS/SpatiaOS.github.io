// ==============================
// Parameters
// ==============================
// Main speaker body dimensions
const bodyWidth = 30;
const bodyHeight = 14;
const bodyDepth = 12;
const bodyColor = 0x5a6572;

// Leg parameters
const legCount = 4;
const legHeight = 18;
const legTopRadius = 1;
const legBottomRadius = 0.6;
const legAngle = 0.22; // Outward angle of legs
const legColor = 0x8b95a1;

// Speaker component parameters
const speakerCount = 2;
const speakerOuterHexRadius = 5.2;
const speakerInnerCircleRadius = 2.8;
const speakerBezelDepth = 0.8;
const speakerFinCount = 32;
const speakerFinThickness = 0.15;

// Top control button parameters
const buttonRadius = 0.8;
const buttonHeight = 0.2;
const buttonSpacing = 2.2;
const buttonColor = 0x333840;

// Material setup
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: bodyColor,
  metalness: 0.5,
  roughness: 0.35
});
const legMaterial = new THREE.MeshStandardMaterial({
  color: legColor,
  metalness: 0.7,
  roughness: 0.2
});
const darkMaterial = new THREE.MeshStandardMaterial({
  color: buttonColor,
  metalness: 0.4,
  roughness: 0.5
});

// ==============================
// Main Speaker Body
// ==============================
const bodyGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
// Position body so bottom sits at top of legs
body.position.y = legHeight + bodyHeight / 2;
scene.add(body);

// Top decorative dividing lines
const topLineGeo = new THREE.BoxGeometry(bodyWidth * 0.95, 0.08, bodyDepth * 0.08);
const topLine1 = new THREE.Mesh(topLineGeo, darkMaterial);
topLine1.position.set(-bodyWidth/6, body.position.y + bodyHeight/2 + 0.04, 0);
scene.add(topLine1);
const topLine2 = topLine1.clone();
topLine2.position.x = bodyWidth/6;
scene.add(topLine2);

// ==============================
// Speaker Grilles (Front Face)
// ==============================
const speakerPositions = [
  new THREE.Vector3(-bodyWidth/4, 0, bodyDepth/2 + speakerBezelDepth/2),
  new THREE.Vector3(bodyWidth/4, 0, bodyDepth/2 + speakerBezelDepth/2)
];

// Hexagonal bezel geometry for speakers
const speakerBezelGeo = new THREE.CylinderGeometry(
  speakerOuterHexRadius, speakerOuterHexRadius, speakerBezelDepth, 6
);
speakerBezelGeo.rotateZ(Math.PI / 6); // Align hex orientation to match reference

for (let i = 0; i < speakerCount; i++) {
  // Add bezel
  const bezel = new THREE.Mesh(speakerBezelGeo, bodyMaterial);
  bezel.position.copy(speakerPositions[i]);
  scene.add(bezel);

  // Add radial fins inside speaker
  for (let f = 0; f < speakerFinCount; f++) {
    const angle = (f / speakerFinCount) * Math.PI * 2;
    const finLength = speakerOuterHexRadius - speakerInnerCircleRadius - 0.3;
    const finGeo = new THREE.BoxGeometry(finLength, speakerBezelDepth * 0.9, speakerFinThickness);
    const fin = new THREE.Mesh(finGeo, darkMaterial);
    fin.position.copy(speakerPositions[i]);
    fin.position.x += Math.cos(angle) * (speakerInnerCircleRadius + finLength/2);
    fin.position.y += Math.sin(angle) * (speakerInnerCircleRadius + finLength/2);
    fin.rotateZ(angle);
    scene.add(fin);
  }

  // Add inner center circle
  const innerCircleGeo = new THREE.CylinderGeometry(
    speakerInnerCircleRadius, speakerInnerCircleRadius, speakerBezelDepth * 0.9, 32
  );
  const innerCircle = new THREE.Mesh(innerCircleGeo, bodyMaterial);
  innerCircle.position.copy(speakerPositions[i]);
  scene.add(innerCircle);
}

// Decorative X logo between speakers
const xBarGeo = new THREE.BoxGeometry(8, speakerBezelDepth, 0.6);
const xBar1 = new THREE.Mesh(xBarGeo, darkMaterial);
xBar1.position.set(0, 0, bodyDepth/2 + speakerBezelDepth/4);
xBar1.rotateZ(Math.PI / 4);
scene.add(xBar1);
const xBar2 = xBar1.clone();
xBar2.rotateZ(Math.PI / 2);
scene.add(xBar2);

// ==============================
// Top Control Buttons
// ==============================
const buttonGeo = new THREE.CylinderGeometry(buttonRadius, buttonRadius, buttonHeight, 24);
const buttonPositions = [
  new THREE.Vector3(bodyWidth/2 - 3, body.position.y + bodyHeight/2 + buttonHeight/2, 2),
  new THREE.Vector3(bodyWidth/2 - 3 - buttonSpacing, body.position.y + bodyHeight/2 + buttonHeight/2, 2),
  new THREE.Vector3(bodyWidth/2 - 3 - buttonSpacing * 2, body.position.y + bodyHeight/2 + buttonHeight/2, 2)
];
buttonPositions.forEach(pos => {
  const button = new THREE.Mesh(buttonGeo, darkMaterial);
  button.position.copy(pos);
  button.rotateX(Math.PI / 2);
  scene.add(button);
});

// ==============================
// Legs
// ==============================
const legGeo = new THREE.CylinderGeometry(legTopRadius, legBottomRadius, legHeight, 12);
const legAttachmentPoints = [
  {x: -bodyWidth/2 + 1.5, z: bodyDepth/2 - 1.5, rotX: legAngle, rotY: -legAngle},
  {x: bodyWidth/2 - 1.5, z: bodyDepth/2 - 1.5, rotX: legAngle, rotY: legAngle},
  {x: -bodyWidth/2 + 1.5, z: -bodyDepth/2 + 1.5, rotX: -legAngle, rotY: -legAngle},
  {x: bodyWidth/2 - 1.5, z: -bodyDepth/2 + 1.5, rotX: -legAngle, rotY: legAngle}
];

legAttachmentPoints.forEach(point => {
  const leg = new THREE.Mesh(legGeo, legMaterial);
  // Attach leg to bottom of body
  leg.position.set(point.x, legHeight/2, point.z);
  leg.rotation.x = point.rotX;
  leg.rotation.y = point.rotY;
  scene.add(leg);
});

// ==============================
// Camera Setup
// ==============================
camera.position.set(45, 35, 45);
camera.lookAt(0, legHeight + bodyHeight / 2, 0);