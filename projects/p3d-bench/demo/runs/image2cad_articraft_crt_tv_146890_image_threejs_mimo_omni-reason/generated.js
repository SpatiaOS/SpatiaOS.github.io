// === Parametric Dimensions (adjust these to scale the TV) ===
const mainBodyWidth = 8;
const mainBodyHeight = 5;
const mainBodyDepth = 4;

// Screen dimensions (recessed inside front bezel)
const screenWidth = 6;
const screenHeight = 4;
const screenRecess = 0.3;

// Control panel (right side of front face)
const controlPanelWidth = mainBodyWidth - screenWidth;
const controlPanelHeight = mainBodyHeight - 0.4;
const controlPanelDepth = 0.5;

// Antenna parameters
const antennaLength = 5;
const antennaThickness = 0.08;
const antennaAngle = 35 * (Math.PI / 180); // Convert degrees to radians

// Back panel dimensions
const backPanelWidth = 7;
const backPanelHeight = 4.5;
const backPanelDepth = 1;

// === Materials ===
const mainBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray cabinet
const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a }); // Dark screen
const speakerGrilleMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Black speaker
const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 }); // Gray buttons
const displayMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, emissive: 0x002200 }); // Small green display
const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 }); // Metallic antennas

// === 1. Main TV Body (Cabinet) ===
const mainBodyGeometry = new THREE.BoxGeometry(mainBodyWidth, mainBodyHeight, mainBodyDepth);
const mainBody = new THREE.Mesh(mainBodyGeometry, mainBodyMaterial);
scene.add(mainBody);

// === 2. Front Bezel & Recessed Screen ===
// Create screen (recessed into main body front)
const screenGeometry = new THREE.BoxGeometry(screenWidth, screenHeight, screenRecess);
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
// Position screen: center of left front, recessed back
screen.position.set(
  (screenWidth/2 - mainBodyWidth/2), 
  0, 
  (mainBodyDepth/2 - screenRecess/2)
);
scene.add(screen);

// Front bezel frame (visual detail around screen)
const bezelThickness = 0.2;
const bezelGeometry = new THREE.BoxGeometry(
  screenWidth + bezelThickness*2,
  screenHeight + bezelThickness*2,
  0.1
);
const bezel = new THREE.Mesh(bezelGeometry, mainBodyMaterial);
bezel.position.set(
  screen.position.x,
  screen.position.y,
  mainBodyDepth/2 + 0.05
);
scene.add(bezel);

// === 3. Right Side Control Panel ===
// Control panel housing
const controlPanelGeometry = new THREE.BoxGeometry(controlPanelWidth, controlPanelHeight, controlPanelDepth);
const controlPanel = new THREE.Mesh(controlPanelGeometry, mainBodyMaterial);
controlPanel.position.set(
  (mainBodyWidth/2 - controlPanelWidth/2),
  0,
  (mainBodyDepth/2 - controlPanelDepth/2)
);
scene.add(controlPanel);

// Speaker grille (bottom of control panel)
const speakerGrilleGeometry = new THREE.BoxGeometry(controlPanelWidth - 0.4, controlPanelHeight * 0.6, 0.05);
const speakerGrille = new THREE.Mesh(speakerGrilleGeometry, speakerGrilleMaterial);
speakerGrille.position.set(
  controlPanel.position.x,
  controlPanel.position.y - controlPanelHeight * 0.2,
  controlPanel.position.z + controlPanelDepth/2
);
scene.add(speakerGrille);

// Control buttons (top of control panel)
const buttonCount = 6;
const buttonSize = 0.3;
const buttonSpacing = 0.15;
const buttonRowWidth = buttonCount * buttonSize + (buttonCount - 1) * buttonSpacing;
const buttonStartX = controlPanel.position.x - buttonRowWidth/2 + buttonSize/2;
const buttonY = controlPanel.position.y + controlPanelHeight * 0.3;

for (let i = 0; i < buttonCount; i++) {
  const buttonGeometry = new THREE.BoxGeometry(buttonSize, buttonSize, 0.1);
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button.position.set(
    buttonStartX + i * (buttonSize + buttonSpacing),
    buttonY,
    controlPanel.position.z + controlPanelDepth/2
  );
  scene.add(button);
}

// Small display (above buttons)
const displayGeometry = new THREE.BoxGeometry(controlPanelWidth * 0.6, 0.4, 0.1);
const display = new THREE.Mesh(displayGeometry, displayMaterial);
display.position.set(
  controlPanel.position.x,
  buttonY + buttonSize/2 + 0.3,
  controlPanel.position.z + controlPanelDepth/2
);
scene.add(display);

// === 4. Antennas (Top of TV) ===
// Antenna 1 (left angled)
const antenna1Geometry = new THREE.CylinderGeometry(antennaThickness/2, antennaThickness/2, antennaLength, 8);
const antenna1 = new THREE.Mesh(antenna1Geometry, antennaMaterial);
// Position at top left, rotate to angle
antenna1.position.set(
  -1.5,
  mainBodyHeight/2 + antennaLength/2 * Math.cos(antennaAngle),
  0
);
antenna1.rotation.z = antennaAngle;
antenna1.rotation.x = -antennaAngle * 0.3; // Slight forward tilt
scene.add(antenna1);

// Antenna 2 (right angled)
const antenna2Geometry = new THREE.CylinderGeometry(antennaThickness/2, antennaThickness/2, antennaLength, 8);
const antenna2 = new THREE.Mesh(antenna2Geometry, antennaMaterial);
// Position at top right, rotate to opposite angle
antenna2.position.set(
  1.5,
  mainBodyHeight/2 + antennaLength/2 * Math.cos(antennaAngle),
  0
);
antenna2.rotation.z = -antennaAngle;
antenna2.rotation.x = -antennaAngle * 0.3;
scene.add(antenna2);

// === 5. Back Panel ===
const backPanelGeometry = new THREE.BoxGeometry(backPanelWidth, backPanelHeight, backPanelDepth);
const backPanel = new THREE.Mesh(backPanelGeometry, mainBodyMaterial);
backPanel.position.set(
  0,
  0,
  -mainBodyDepth/2 - backPanelDepth/2
);
scene.add(backPanel);

// === Camera Setup ===
camera.position.set(15, 10, 15);
camera.lookAt(0, 0, 0);