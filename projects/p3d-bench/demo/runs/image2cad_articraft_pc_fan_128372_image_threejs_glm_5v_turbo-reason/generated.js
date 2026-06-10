// ==========================================
// Computer Cooling Fan Model Parameters
// ==========================================

// Overall dimensions (80mm fan standard)
const frameSize = 80;           // Outer frame width/height
const frameThickness = 10;      // Frame depth
const frameWidth = 8;           // Width of the frame border

// Fan assembly
const fanDiameter = 72;         // Diameter of the fan sweep
const hubDiameter = 28;         // Central hub diameter
const hubHeight = 12;           // Hub height (protruding)

// Blade parameters
const bladeCount = 7;           // Number of fan blades
const bladeLength = 20;         // Radial length of blade
const bladeWidth = 22;          // Chord width of blade
const bladeTwist = 35;          // Twist angle in degrees

// Mounting holes
const holeDiameter = 5;         // Mounting hole diameter
const holeOffset = 6;           // Distance from corner to hole center

// Struts (support between frame and hub)
const strutWidth = 3;
const strutCount = 4;

// Materials
const plasticMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a2a2a, 
  roughness: 0.4, 
  metalness: 0.1 
});

const hubMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x404040, 
  roughness: 0.3, 
  metalness: 0.2 
});

const bladeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x353535, 
  roughness: 0.5, 
  metalness: 0.1,
  side: THREE.DoubleSide
});

// ==========================================
// Helper function: Create rounded rectangle shape
// ==========================================
function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  
  return shape;
}

// ==========================================
// 1. CREATE OUTER FRAME
// ==========================================

// Main frame body (hollow square with rounded corners)
const frameOuter = createRoundedRectShape(frameSize, frameSize, 6);
const frameInner = createRoundedRectShape(frameSize - frameWidth * 2, frameSize - frameWidth * 2, 4);
frameOuter.holes.push(new THREE.Path(frameInner.getPoints()));

// Add mounting holes at corners
const holeRadius = holeDiameter / 2;
const cornerPositions = [
  { x: -frameSize/2 + holeOffset, y: -frameSize/2 + holeOffset },
  { x: frameSize/2 - holeOffset, y: -frameSize/2 + holeOffset },
  { x: frameSize/2 - holeOffset, y: frameSize/2 - holeOffset },
  { x: -frameSize/2 + holeOffset, y: frameSize/2 - holeOffset }
];

cornerPositions.forEach(pos => {
  const holePath = new THREE.Path();
  holePath.absarc(pos.x, pos.y, holeRadius, 0, Math.PI * 2, false);
  frameOuter.holes.push(holePath);
});

const frameGeometry = new THREE.ExtrudeGeometry(frameOuter, {
  depth: frameThickness,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 0.5,
  bevelSegments: 3
});
const frameMesh = new THREE.Mesh(frameGeometry, plasticMaterial);
frameMesh.position.z = -frameThickness / 2;
scene.add(frameMesh);

// ==========================================
// 2. CREATE FAN HOUSING RING
// ==========================================

const housingRingGeometry = new THREE.TorusGeometry(fanDiameter / 2, 2.5, 16, 64);
const housingRing = new THREE.Mesh(housingRingGeometry, plasticMaterial);
housingRing.rotation.x = Math.PI / 2;
scene.add(housingRing);

// Back housing ring (slightly smaller, behind)
const backRingGeometry = new THREE.TorusGeometry(fanDiameter / 2 - 2, 2, 16, 64);
const backRing = new THREE.Mesh(backRingGeometry, plasticMaterial);
backRing.rotation.x = Math.PI / 2;
backRing.position.z = -frameThickness + 2;
scene.add(backRing);

// ==========================================
// 3. CREATE CENTRAL HUB
// ==========================================

// Main hub cylinder
const hubGeometry = new THREE.CylinderGeometry(
  hubDiameter / 2, 
  hubDiameter / 2, 
  hubHeight, 
  32
);
const hub = new THREE.Mesh(hubGeometry, hubMaterial);
hub.rotation.x = Math.PI / 2;
hub.position.z = hubHeight / 2 - 2;
scene.add(hub);

// Hub top cap (slightly smaller, raised detail)
const hubCapGeometry = new THREE.CylinderGeometry(
  hubDiameter / 2 - 2, 
  hubDiameter / 2 - 1, 
  3, 
  32
);
const hubCap = new THREE.Mesh(hubCapGeometry, hubMaterial);
hubCap.rotation.x = Math.PI / 2;
hubCap.position.z = hubHeight - 1;
scene.add(hubCap);

// Center spindle (small cylinder in middle)
const spindleGeometry = new THREE.CylinderGeometry(3, 3, 4, 16);
const spindle = new THREE.Mesh(spindleGeometry, hubMaterial);
spindle.rotation.x = Math.PI / 2;
spindle.position.z = hubHeight + 1;
scene.add(spindle);

// ==========================================
// 4. CREATE FAN BLADES
// ==========================================

function createBlade() {
  const bladeGroup = new THREE.Group();
  
  // Create blade profile shape
  const bladeShape = new THREE.Shape();
  const w = bladeWidth;
  const l = bladeLength;
  
  // Curved blade profile
  bladeShape.moveTo(0, 0);
  bladeShape.quadraticCurveTo(w * 0.3, l * 0.3, w * 0.15, l * 0.7);
  bladeShape.quadraticCurveTo(w * 0.05, l, 0, l);
  bladeShape.quadraticCurveTo(-w * 0.05, l, -w * 0.15, l * 0.7);
  bladeShape.quadraticCurveTo(-w * 0.3, l * 0.3, 0, 0);
  
  // Extrude with twist
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.2,
    bevelSegments: 2,
    curveSegments: 12
  });
  
  const blade = new THREE.Mesh(bladeGeo, bladeMaterial);
  
  // Apply twist transformation
  blade.rotation.x = THREE.MathUtils.degToRad(bladeTwist);
  
  // Position at root
  blade.position.set(-w / 4, 0, -0.75);
  
  return bladeGroup;
}

// Add blades in radial pattern
for (let i = 0; i < bladeCount; i++) {
  const blade = createBlade();
  const angle = (i / bladeCount) * Math.PI * 2;
  
  blade.position.x = Math.cos(angle) * (hubDiameter / 2 + 2);
  blade.position.y = Math.sin(angle) * (hubDiameter / 2 + 2);
  blade.position.z = 2;
  blade.rotation.z = angle + Math.PI / 2;
  
  // Add actual blade mesh to group
  const bladeShape = new THREE.Shape();
  const w = bladeWidth;
  const l = bladeLength;
  
  bladeShape.moveTo(0, 0);
  bladeShape.bezierCurveTo(w * 0.4, l * 0.25, w * 0.3, l * 0.65, w * 0.1, l);
  bladeShape.lineTo(-w * 0.1, l);
  bladeShape.bezierCurveTo(-w * 0.3, l * 0.65, -w * 0.4, l * 0.25, 0, 0);
  
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 1.2,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.3,
    bevelSegments: 3
  });
  
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMaterial);
  bladeMesh.rotation.x = THREE.MathUtils.degToRad(bladeTwist);
  bladeMesh.position.set(0, 0, -0.6);
  
  blade.add(bladeMesh);
  scene.add(blade);
}

// ==========================================
// 5. CREATE SUPPORT STRUTS
// ==========================================

function createStrut(angle) {
  const strutGroup = new THREE.Group();
  
  // Strut connects from near hub to frame
  const innerRadius = hubDiameter / 2 + 4;
  const outerRadius = (frameSize / 2) - frameWidth - 4;
  const length = outerRadius - innerRadius;
  
  const strutGeo = new THREE.BoxGeometry(strutWidth, length, frameThickness - 4);
  const strut = new THREE.Mesh(strutGeo, plasticMaterial);
  strut.position.y = innerRadius + length / 2;
  strut.position.z = -frameThickness / 2 + 2;
  
  strutGroup.add(strut);
  return strutGroup;
}

// Place struts at 45 degree offsets from cardinal directions
for (let i = 0; i < strutCount; i++) {
  const angle = (i / strutCount) * Math.PI * 2 + Math.PI / 4;
  const strut = createStrut(angle);
  strut.rotation.z = angle;
  scene.add(strut);
}

// ==========================================
// CAMERA POSITIONING
// ==========================================

camera.position.set(90, 70, 100);
camera.lookAt(0, 0, 0);