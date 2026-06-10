// --------------------------
// Parameter Definitions
// --------------------------
// Main TV cabinet dimensions
const mainWidth = 60;
const mainHeight = 36;
const mainDepth = 12;
const plasticGray = 0xaaaaaa;

// Rear CRT housing dimensions (bulge at back of TV)
const crtWidth = 52;
const crtHeight = 28;
const crtDepth = 26;
const crtBackOffset = mainDepth/2 + crtDepth/2;

// Screen parameters
const bezelThickness = 3;
const screenWidth = mainWidth * 0.68;
const screenHeight = mainHeight - bezelThickness * 2;
const screenGray = 0x777777;
const screenFrontOffset = -mainDepth/2 + 2;

// Control panel (right side of screen)
const controlPanelWidth = mainWidth - screenWidth - bezelThickness * 2;
const controlPanelHeight = screenHeight;
const controlPanelXOffset = (screenWidth/2) + (controlPanelWidth/2);

// Antenna parameters
const antennaLength = 55;
const antennaRadius = 0.2;
const silver = 0xcccccc;
const antennaLeftAngle = Math.PI / 6; // 30deg from vertical
const antennaRightAngle = -Math.PI / 6;
const antennaForwardTilt = Math.PI / 12; // 15deg forward tilt

// --------------------------
// Material Definitions
// --------------------------
const plasticMat = new THREE.MeshStandardMaterial({ color: plasticGray, roughness: 0.8, metalness: 0.1 });
const screenMat = new THREE.MeshStandardMaterial({ color: screenGray, roughness: 0.4, metalness: 0.05 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
const silverMat = new THREE.MeshStandardMaterial({ color: silver, roughness: 0.2, metalness: 0.8 });

// --------------------------
// Geometry Construction
// --------------------------
// Main front cabinet
const mainCabinetGeo = new THREE.BoxGeometry(mainWidth, mainHeight, mainDepth);
const mainCabinet = new THREE.Mesh(mainCabinetGeo, plasticMat);
scene.add(mainCabinet);

// Rear CRT enclosure
const crtHousingGeo = new THREE.BoxGeometry(crtWidth, crtHeight, crtDepth);
const crtHousing = new THREE.Mesh(crtHousingGeo, plasticMat);
crtHousing.position.z = crtBackOffset;
scene.add(crtHousing);

// Curved CRT screen (uses shallow cylinder arc for natural curvature)
const screenGeo = new THREE.CylinderGeometry(
  120, 120, screenHeight, 32, 1, true, Math.PI * 0.08, Math.PI * 0.16
);
screenGeo.rotateY(Math.PI/2);
screenGeo.scale(1, 1, screenWidth / screenHeight);
const screen = new THREE.Mesh(screenGeo, screenMat);
screen.position.set(-controlPanelWidth/2, 0, screenFrontOffset);
scene.add(screen);

// Control panel base
const controlPanelGeo = new THREE.BoxGeometry(controlPanelWidth, controlPanelHeight, 2);
const controlPanel = new THREE.Mesh(controlPanelGeo, plasticMat);
controlPanel.position.set(controlPanelXOffset, 0, screenFrontOffset);
scene.add(controlPanel);

// Speaker grille upper section
const speakerHeight = controlPanelHeight * 0.45;
const speakerGeo = new THREE.BoxGeometry(controlPanelWidth - 2, speakerHeight, 2.1);
const speakerGrille = new THREE.Mesh(speakerGeo, blackMat);
speakerGrille.position.set(controlPanelXOffset, controlPanelHeight/2 - speakerHeight/2 - 1, screenFrontOffset + 0.05);
scene.add(speakerGrille);

// Speaker grille horizontal vent lines
for (let i = 0; i < 6; i++) {
  const ventGeo = new THREE.BoxGeometry(controlPanelWidth - 3, 0.8, 2.2);
  const vent = new THREE.Mesh(ventGeo, plasticMat);
  vent.position.set(controlPanelXOffset, speakerGrille.position.y + speakerHeight/2 - 2 - (i * 2.5), screenFrontOffset + 0.1);
  scene.add(vent);
}

// Lower black control section
const lowerControlHeight = controlPanelHeight * 0.5;
const lowerControlGeo = new THREE.BoxGeometry(controlPanelWidth - 2, lowerControlHeight, 2.1);
const lowerControl = new THREE.Mesh(lowerControlGeo, blackMat);
lowerControl.position.set(controlPanelXOffset, -controlPanelHeight/2 + lowerControlHeight/2 + 1, screenFrontOffset + 0.05);
scene.add(lowerControl);

// Top right control buttons
const buttonGeo = new THREE.BoxGeometry(1.5, 1.5, 0.8);
for (let i = 0; i < 3; i++) {
  const button = new THREE.Mesh(buttonGeo, blackMat);
  button.position.set(controlPanelXOffset + (controlPanelWidth/2 - 2), controlPanelHeight/2 - 2 - (i * 2), screenFrontOffset - 0.5);
  scene.add(button);
}

// Telescoping antennas
const antennaGeo = new THREE.CylinderGeometry(antennaRadius, antennaRadius, antennaLength, 8);
// Left antenna
const leftAntenna = new THREE.Mesh(antennaGeo, silverMat);
leftAntenna.position.set(-8, mainHeight/2 - 0.5, 0);
leftAntenna.rotation.z = antennaLeftAngle;
leftAntenna.rotation.x = antennaForwardTilt;
leftAntenna.translateY(antennaLength/2);
scene.add(leftAntenna);
// Right antenna
const rightAntenna = new THREE.Mesh(antennaGeo, silverMat);
rightAntenna.position.set(8, mainHeight/2 - 0.5, 0);
rightAntenna.rotation.z = antennaRightAngle;
rightAntenna.rotation.x = antennaForwardTilt;
rightAntenna.translateY(antennaLength/2);
scene.add(rightAntenna);

// Antenna tip caps
const tipGeo = new THREE.SphereGeometry(antennaRadius * 1.5, 6);
const leftTip = new THREE.Mesh(tipGeo, silverMat);
leftTip.position.copy(leftAntenna.position);
leftTip.translateOnAxis(new THREE.Vector3(Math.sin(antennaLeftAngle)*Math.cos(antennaForwardTilt), Math.cos(antennaLeftAngle), Math.sin(antennaLeftAngle)*Math.sin(antennaForwardTilt)), antennaLength);
scene.add(leftTip);
const rightTip = new THREE.Mesh(tipGeo, silverMat);
rightTip.position.copy(rightAntenna.position);
rightTip.translateOnAxis(new THREE.Vector3(Math.sin(antennaRightAngle)*Math.cos(antennaForwardTilt), Math.cos(antennaRightAngle), Math.sin(antennaRightAngle)*Math.sin(antennaForwardTilt)), antennaLength);
scene.add(rightTip);

// --------------------------
// Camera Setup
// --------------------------
camera.position.set(90, 70, 90);
camera.lookAt(0, 0, 0);