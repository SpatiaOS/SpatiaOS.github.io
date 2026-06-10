// ==========================================
// SPEAKER CABINET MODEL PARAMETERS
// ==========================================

// Main cabinet dimensions
const cabinetWidth = 12;
const cabinetHeight = 6;
const cabinetDepth = 5;

// Leg parameters
const legHeight = 4;
const legRadiusTop = 0.15;
const legRadiusBottom = 0.35;

// Speaker driver parameters
const speakerRadius = 1.4;
const speakerDepth = 0.3;
const hexFrameSize = 2.4;
const hexFrameDepth = 0.15;

// Button parameters
const buttonRadius = 0.25;
const buttonDepth = 0.1;

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x888888, 
  roughness: 0.4,
  metalness: 0.1
});

const darkMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x333333, 
  roughness: 0.6 
});

const accentMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x666666, 
  roughness: 0.5 
});

const legMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x999999, 
  roughness: 0.3,
  metalness: 0.4
});

// ==========================================
// MAIN CABINET BODY
// ==========================================
const cabinetGeometry = new THREE.BoxGeometry(cabinetWidth, cabinetHeight, cabinetDepth);
const cabinet = new THREE.Mesh(cabinetGeometry, bodyMaterial);
cabinet.position.y = cabinetHeight / 2 + legHeight;
scene.add(cabinet);

// ==========================================
// FRONT PANEL DECORATIONS
// ==========================================
const frontZ = cabinetDepth / 2 + cabinet.position.z;

// Create speaker assembly function
function createSpeakerAssembly(xPos) {
  const group = new THREE.Group();
  
  // Hexagonal frame base (outer)
  const hexShape = new THREE.Shape();
  const sides = 6;
  const size = hexFrameSize;
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + Math.PI / 6;
    const px = Math.cos(angle) * size;
    const py = Math.sin(angle) * size;
    if (i === 0) hexShape.moveTo(px, py);
    else hexShape.lineTo(px, py);
  }
  hexShape.closePath();
  
  // Extrude hexagonal frame
  const hexGeo = new THREE.ExtrudeGeometry(hexShape, {
    depth: hexFrameDepth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2
  });
  const hexFrame = new THREE.Mesh(hexGeo, accentMaterial);
  hexFrame.rotation.x = -Math.PI / 2;
  group.add(hexFrame);
  
  // Radial sunburst/gear pattern inside hexagon
  const teethCount = 36;
  const innerR = speakerRadius + 0.25;
  const outerR = hexFrameSize - 0.3;
  
  for (let i = 0; i < teethCount; i++) {
    const angle = (i / teethCount) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(0.08, (outerR - innerR) * 0.7, 0.08);
    const tooth = new THREE.Mesh(toothGeo, darkMaterial);
    tooth.position.set(
      Math.cos(angle) * ((innerR + outerR) / 2),
      Math.sin(angle) * ((innerR + outerR) / 2),
      hexFrameDepth + 0.04
    );
    tooth.rotation.z = angle + Math.PI / 2;
    group.add(tooth);
  }
  
  // Inner ring detail
  const ringGeo = new THREE.RingGeometry(speakerRadius + 0.15, speakerRadius + 0.25, 32);
  const ringMat = new THREE.MeshStandardMaterial({ 
    color: 0x555555, 
    side: THREE.DoubleSide,
    roughness: 0.5
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.z = hexFrameDepth + 0.02;
  group.add(ring);
  
  // Main speaker cone (cylinder)
  const coneGeo = new THREE.CylinderGeometry(speakerRadius, speakerRadius * 0.9, speakerDepth, 32);
  const cone = new THREE.Mesh(coneGeo, darkMaterial);
  cone.rotation.x = Math.PI / 2;
  cone.position.z = hexFrameDepth + speakerDepth / 2;
  group.add(cone);
  
  // Center dome
  const domeGeo = new THREE.SphereGeometry(speakerRadius * 0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, accentMaterial);
  dome.rotation.x = -Math.PI / 2;
  dome.position.z = hexFrameDepth + speakerDepth;
  group.add(dome);
  
  group.position.set(xPos, cabinet.position.y, frontZ);
  return group;
}

// Add left and right speakers
const leftSpeaker = createSpeakerAssembly(-cabinetWidth * 0.28);
scene.add(leftSpeaker);

const rightSpeaker = createSpeakerAssembly(cabinetWidth * 0.28);
scene.add(rightSpeaker);

// ==========================================
// CENTER DECORATIVE ELEMENT (X/Hourglass)
// ==========================================
const centerGroup = new THREE.Group();

// Create X shape using two angled bars
const barWidth = 0.4;
const barLength = 1.8;
const barGeo = new THREE.BoxGeometry(barWidth, barLength, 0.15);

const bar1 = new THREE.Mesh(barGeo, accentMaterial);
bar1.rotation.z = Math.PI / 4;
centerGroup.add(bar1);

const bar2 = new THREE.Mesh(barGeo, accentMaterial);
bar2.rotation.z = -Math.PI / 4;
centerGroup.add(bar2);

// Diamond shapes at ends of X
function createDiamond(size) {
  const shape = new THREE.Shape();
  shape.moveTo(0, size);
  shape.lineTo(size, 0);
  shape.lineTo(0, -size);
  shape.lineTo(-size, 0);
  shape.closePath();
  
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false });
  return geo;
}

const diamondGeo = createDiamond(0.35);
const d1 = new THREE.Mesh(diamondGeo, darkMaterial);
d1.position.set(-0.7, 0.7, 0);
d1.rotation.z = Math.PI / 4;
centerGroup.add(d1);

const d2 = new THREE.Mesh(diamondGeo, darkMaterial);
d2.position.set(0.7, 0.7, 0);
d2.rotation.z = -Math.PI / 4;
centerGroup.add(d2);

const d3 = new THREE.Mesh(diamondGeo, darkMaterial);
d3.position.set(-0.7, -0.7, 0);
d3.rotation.z = -Math.PI / 4;
centerGroup.add(d3);

const d4 = new THREE.Mesh(diamondGeo, darkMaterial);
d4.position.set(0.7, -0.7, 0);
d4.rotation.z = Math.PI / 4;
centerGroup.add(d4);

centerGroup.position.set(0, cabinet.position.y, frontZ + 0.1);
scene.add(centerGroup);

// ==========================================
// TOP CONTROL BUTTONS
// ==========================================
const topY = cabinetHeight / 2 + cabinet.position.y;
const topZ = cabinet.position.z;

function createButton(xPos, symbol) {
  const btnGroup = new THREE.Group();
  
  // Button base (slight indentation)
  const baseGeo = new THREE.CylinderGeometry(buttonRadius + 0.1, buttonRadius + 0.1, 0.08, 24);
  const base = new THREE.Mesh(baseGeo, darkMaterial);
  btnGroup.add(base);
  
  // Button top
  const btnGeo = new THREE.CylinderGeometry(buttonRadius, buttonRadius, buttonDepth, 24);
  const btn = new THREE.Mesh(btnGeo, accentMaterial);
  btn.position.y = buttonDepth / 2 + 0.02;
  btnGroup.add(btn);
  
  // Symbol on button (simple circle indicator)
  const dotGeo = new THREE.CircleGeometry(buttonRadius * 0.4, 16);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.rotation.x = -Math.PI / 2;
  dot.position.y = buttonDepth + 0.03;
  btnGroup.add(dot);
  
  btnGroup.position.set(xPos, topY, topZ - cabinetDepth * 0.15);
  return btnGroup;
}

// Add three control buttons
scene.add(createButton(cabinetWidth * 0.32));
scene.add(createButton(cabinetWidth * 0.38));
scene.add(createButton(cabinetWidth * 0.44));

// ==========================================
// TAPERED LEGS
// ==========================================
function createLeg(xPos, zPos) {
  const legGeo = new THREE.CylinderGeometry(
    legRadiusTop, 
    legRadiusBottom, 
    legHeight, 
    16
  );
  const leg = new THREE.Mesh(legGeo, legMaterial);
  leg.position.set(xPos, legHeight / 2, zPos);
  return leg;
}

// Position four legs at corners with slight inward angle offset
const legOffsetX = cabinetWidth * 0.42;
const legOffsetZ = cabinetDepth * 0.38;

scene.add(createLeg(-legOffsetX, -legOffsetZ));  // Front left
scene.add(createLeg(legOffsetX, -legOffsetZ));   // Front right
scene.add(createLeg(-legOffsetX, legOffsetZ));   // Back left
scene.add(createLeg(legOffsetX, legOffsetZ));    // Back right

// ==========================================
// CAMERA POSITIONING
// ==========================================
camera.position.set(14, 10, 16);
camera.lookAt(0, cabinetHeight / 2 + legHeight / 2, 0);