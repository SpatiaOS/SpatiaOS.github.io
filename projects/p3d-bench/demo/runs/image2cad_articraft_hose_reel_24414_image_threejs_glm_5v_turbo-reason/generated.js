// ==========================================
// HOSE REEL MODEL PARAMETERS
// ==========================================

// Main reel dimensions
const reelOuterRadius = 4.5;      // Outer radius of flanges
const reelInnerRadius = 1.6;       // Inner hub radius
const reelWidth = 2.8;             // Distance between flanges (Z-axis thickness)
const flangeThickness = 0.35;      // Thickness of each flange disk

// Hose parameters
const hoseRadius = 0.17;           // Radius of the hose tube
const hoseCoilCount = 14;          // Number of hose coils
const hoseCoilRadius = 3.0;        // Radius where hose coils sit (between inner and outer)

// Pipe dimensions
const bottomPipeLength = 4.5;      // Length of bottom mounting pipe
const bottomPipeRadius = 0.28;     // Radius of bottom pipe
const topPipeLength = 3.2;         // Length of vertical top inlet pipe
const topPipeRadius = 0.22;        // Radius of top pipe

// Materials
const steelMaterial = new THREE.MeshStandardMaterial({
  color: 0x9a9a9a,
  roughness: 0.45,
  metalness: 0.7
});

const hoseMaterial = new THREE.MeshStandardMaterial({
  color: 0x707070,
  roughness: 0.65,
  metalness: 0.3
});

const darkSteelMaterial = new THREE.MeshStandardMaterial({
  color: 0x505050,
  roughness: 0.5,
  metalness: 0.6
});

// ==========================================
// FLANGES (Front and Back Disks)
// ==========================================

// Back flange
const backFlangeGeom = new THREE.CylinderGeometry(
  reelOuterRadius, reelOuterRadius, flangeThickness, 64
);
const backFlange = new THREE.Mesh(backFlangeGeom, steelMaterial);
backFlange.rotation.x = Math.PI / 2;
backFlange.position.z = -reelWidth / 2;
scene.add(backFlange);

// Front flange (facing camera, with mounting holes)
const frontFlangeGeom = new THREE.CylinderGeometry(
  reelOuterRadius, reelOuterRadius, flangeThickness, 64
);
const frontFlange = new THREE.Mesh(frontFlangeGeom, steelMaterial);
frontFlange.rotation.x = Math.PI / 2;
frontFlange.position.z = reelWidth / 2;
scene.add(frontFlange);

// Mounting holes on front flange (4 holes in rectangular pattern)
const holeOffsetX = 2.2;
const holeOffsetY = 2.2;
const holeRadius = 0.18;
const holePositions = [
  { x: holeOffsetX, y: holeOffsetY },
  { x: -holeOffsetX, y: holeOffsetY },
  { x: holeOffsetX, y: -holeOffsetY },
  { x: -holeOffsetX, y: -holeOffsetY }
];

holePositions.forEach(pos => {
  const holeGeom = new THREE.CylinderGeometry(
    holeRadius, holeRadius, flangeThickness + 0.02, 24
  );
  const holeMesh = new THREE.Mesh(holeGeom, darkSteelMaterial);
  holeMesh.rotation.x = Math.PI / 2;
  holeMesh.position.set(pos.x, pos.y, reelWidth / 2);
  scene.add(holeMesh);
});

// ==========================================
// CENTRAL HUB (Cylinder between flanges)
// ==========================================

const hubGeom = new THREE.CylinderGeometry(
  reelInnerRadius, reelInnerRadius, reelWidth * 0.92, 32
);
const hub = new THREE.Mesh(hubGeom, steelMaterial);
hub.rotation.x = Math.PI / 2;
scene.add(hub);

// ==========================================
// COILED HOSE (Helical geometry)
// ==========================================

// Custom helix curve class for hose path
class HoseHelixCurve extends THREE.Curve {
  constructor(radius, height, turns) {
    super();
    this.radius = radius;
    this.height = height;
    this.turns = turns;
  }

  getPoint(t) {
    const angle = t * Math.PI * 2 * this.turns;
    const x = this.radius * Math.cos(angle);
    const y = this.radius * Math.sin(angle);
    // Distribute along Z-axis (width of reel)
    const z = (t - 0.5) * this.height;
    return new THREE.Vector3(x, y, z);
  }
}

// Generate coiled hose geometry
const hosePath = new HoseHelixCurve(hoseCoilRadius, reelWidth * 0.85, hoseCoilCount);
const hoseTubeGeom = new THREE.TubeGeometry(hosePath, 300, hoseRadius, 12, false);
const coiledHose = new THREE.Mesh(hoseTubeGeom, hoseMaterial);
scene.add(coiledHose);

// ==========================================
// BOTTOM MOUNTING ASSEMBLY
// ==========================================

// Main vertical pipe
const bottomPipeGeom = new THREE.CylinderGeometry(
  bottomPipeRadius, bottomPipeRadius, bottomPipeLength, 20
);
const bottomPipe = new THREE.Mesh(bottomPipeGeom, steelMaterial);
bottomPipe.position.set(0, -reelOuterRadius - bottomPipeLength / 2, 0);
scene.add(bottomPipe);

// Valve body (wider section)
const valveBodyGeom = new THREE.CylinderGeometry(0.42, 0.38, 1.1, 20);
const valveBody = new THREE.Mesh(valveBodyGeom, steelMaterial);
valveBody.position.set(0, -reelOuterRadius - bottomPipeLength - 0.55, 0);
scene.add(valveBody);

// Valve handle (lever)
const handleGroup = new THREE.Group();

const handleBarGeom = new THREE.BoxGeometry(0.9, 0.08, 0.06);
const handleBar = new THREE.Mesh(handleBarGeom, steelMaterial);
handleBar.position.x = -0.45;
handleGroup.add(handleBar);

// Handle grip
const handleGripGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12);
const handleGrip = new THREE.Mesh(handleGripGeom, darkSteelMaterial);
handleGrip.rotation.z = Math.PI / 2;
handleGrip.position.x = -0.9;
handleGroup.add(handleGrip);

handleGroup.position.set(-0.35, -reelOuterRadius - bottomPipeLength - 0.2, 0.28);
handleGroup.rotation.z = -Math.PI / 7; // Angled slightly upward
scene.add(handleGroup);

// Nozzle/tip at very bottom
const tipGeom = new THREE.CylinderGeometry(0.22, 0.15, 0.7, 16);
const tip = new THREE.Mesh(tipGeom, steelMaterial);
tip.position.set(0, -reelOuterRadius - bottomPipeLength - 1.2, 0);
scene.add(tip);

// ==========================================
// TOP INLET PIPE WITH FITTING
// ==========================================

// Position offset for top pipe (attached to left side of back flange)
const topAttachX = -reelOuterRadius + 0.8;
const topAttachZ = -reelWidth / 2;

// Vertical riser pipe
const topRiserGeom = new THREE.CylinderGeometry(topPipeRadius, topPipeRadius, topPipeLength, 18);
const topRiser = new THREE.Mesh(topRiserGeom, steelMaterial);
topRiser.position.set(topAttachX, topPipeLength / 2 + 0.5, topAttachZ);
scene.add(topRiser);

// Elbow joint (90-degree bend)
const elbowTorusGeom = new THREE.TorusGeometry(0.45, topPipeRadius, 16, 16, Math.PI / 2);
const elbow = new THREE.Mesh(elbowTorusGeom, steelMaterial);
elbow.position.set(topAttachX, topPipeLength + 0.5, topAttachZ);
elbow.rotation.y = Math.PI / 2;
elbow.rotation.x = Math.PI / 2;
scene.add(elbow);

// Horizontal outlet section after elbow
const outletSectionGeom = new THREE.CylinderGeometry(topPipeRadius, topPipeRadius, 0.6, 16);
const outletSection = new THREE.Mesh(outletSectionGeom, steelMaterial);
outletSection.rotation.z = Math.PI / 2;
outletSection.position.set(topAttachX, topPipeLength + 0.5, topAttachZ - 0.75);
scene.add(outletSection);

// Garden hose fitting (nozzle with hex shape approximation)
const fittingGroup = new THREE.Group();

// Main fitting body
const fittingBodyGeom = new THREE.CylinderGeometry(0.32, 0.28, 0.7, 6); // Hexagonal look
const fittingBody = new THREE.Mesh(fittingBodyGeom, steelMaterial);
fittingGroup.add(fittingBody);

// Fitting end cap
const capGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.15, 16);
const cap = new THREE.Mesh(capGeom, darkSteelMaterial);
cap.position.y = -0.4;
fittingGroup.add(cap);

fittingGroup.rotation.x = Math.PI / 2;
fittingGroup.position.set(topAttachX, topPipeLength + 0.5, topAttachZ - 1.15);
scene.add(fittingGroup);

// ==========================================
// CONNECTION HOSE (from reel to top pipe)
// ==========================================

// Curved hose connecting reel to inlet
const connectionCurve = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-reelOuterRadius + 0.5, -0.5, -reelWidth / 2),  // Start at reel edge
  new THREE.Vector3(-reelOuterRadius - 1.5, 0, -reelWidth / 2),     // Control point 1
  new THREE.Vector3(topAttachX - 1, 1.5, topAttachZ),                // Control point 2
  new THREE.Vector3(topAttachX, 0.5, topAttachZ)                     // End at pipe base
);

const connectionTubeGeom = new THREE.TubeGeometry(connectionCurve, 30, 0.14, 10, false);
const connectionHose = new THREE.Mesh(connectionTubeGeom, hoseMaterial);
scene.add(connectionHose);

// Small coupling at connection points
const couplingGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 12);

const coupling1 = new THREE.Mesh(couplingGeom, steelMaterial);
coupling1.rotation.x = Math.PI / 2;
coupling1.position.set(-reelOuterRadius + 0.5, -0.5, -reelWidth / 2);
scene.add(coupling1);

const coupling2 = new THREE.Mesh(couplingGeom, steelMaterial);
coupling2.position.set(topAttachX, 0.5, topAttachZ);
scene.add(coupling2);

// ==========================================
// CAMERA POSITIONING
// ==========================================

camera.position.set(11, 9, 11);
camera.lookAt(0, -1, 0);