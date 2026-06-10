// ==========================================
// Steam Engine / Air Compressor Model
// Parametric Three.js Geometry Generation
// ==========================================

// Material definition - metallic gray finish
const material = new THREE.MeshStandardMaterial({ 
  color: 0xaaaaaa, 
  metalness: 0.3, 
  roughness: 0.6,
  side: THREE.DoubleSide
});

const darkMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x666666, 
  metalness: 0.4, 
  roughness: 0.5
});

// ==========================================
// PARAMETERS
// ==========================================
const params = {
  // Base platform
  baseWidth: 14,
  baseDepth: 10,
  baseHeight: 1.2,
  baseChamfer: 0.8,
  
  // Finned cylinder (left side)
  cylinderLength: 7,
  cylinderRadius: 2.2,
  cylinderFinCount: 24,
  cylinderFinThickness: 0.15,
  cylinderFinSpacing: 0.25,
  
  // Flywheel parameters
  flywheelRadius: 4.5,
  flywheelThickness: 1.0,
  flywheelHoleCount: 5,
  flywheelHoleRadius: 1.2,
  hubRadius: 1.0,
  hubLength: 1.5,
  
  // Right flywheel (slightly different)
  rightFlywheelRadius: 4.8,
  
  // Positions
  cylinderOffsetX: -5,
  leftFlywheelX: 0,
  rightFlywheelX: 5,
  baseY: -3,
  
  // Small details
  valveKnobRadius: 0.5,
  valveKnobHeight: 0.8,
  pinRadius: 0.2,
  pinLength: 1.5
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Create chamfered box base
function createBase() {
  const shape = new THREE.Shape();
  const w = params.baseWidth / 2;
  const d = params.baseDepth / 2;
  const c = params.baseChamfer;
  
  // Draw chamfered rectangle
  shape.moveTo(-w + c, -d);
  shape.lineTo(w - c, -d);
  shape.quadraticCurveTo(w, -d, w, -d + c);
  shape.lineTo(w, d - c);
  shape.quadraticCurveTo(w, d, w - c, d);
  shape.lineTo(-w + c, d);
  shape.quadraticCurveTo(-w, d, -w, d - c);
  shape.lineTo(-w, -d + c);
  shape.quadraticCurveTo(-w, -d, -w + c, -d);
  
  const extrudeSettings = {
    depth: params.baseHeight,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.2,
    bevelSegments: 3
  };
  
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(-Math.PI / 2);
  return new THREE.Mesh(geometry, material);
}

// Create finned cylinder (heat sink style)
function createFinnedCylinder() {
  const group = new THREE.Group();
  
  // Main cylinder body (solid core)
  const coreGeom = new THREE.CylinderGeometry(
    params.cylinderRadius * 0.85, 
    params.cylinderRadius * 0.85, 
    params.cylinderLength, 
    32
  );
  coreGeom.rotateZ(Math.PI / 2);
  const core = new THREE.Mesh(coreGeom, material);
  group.add(core);
  
  // Fins
  const finCount = params.cylinderFinCount;
  const finSpacing = params.cylinderLength / (finCount + 1);
  
  for (let i = 0; i < finCount; i++) {
    const finGeom = new THREE.TorusGeometry(
      params.cylinderRadius, 
      params.cylinderFinThickness, 
      8, 
      32
    );
    finGeom.rotateY(Math.PI / 2);
    
    const fin = new THREE.Mesh(finGeom, material);
    fin.position.x = -params.cylinderLength / 2 + finSpacing * (i + 1);
    group.add(fin);
  }
  
  // End caps
  const capGeom = new THREE.CylinderGeometry(
    params.cylinderRadius, 
    params.cylinderRadius, 
    0.3, 
    32
  );
  capGeom.rotateZ(Math.PI / 2);
  
  const leftCap = new THREE.Mesh(capGeom, material);
  leftCap.position.x = -params.cylinderLength / 2;
  group.add(leftCap);
  
  const rightCap = new THREE.Mesh(capGeom, material);
  rightCap.position.x = params.cylinderLength / 2;
  group.add(rightCap);
  
  // Valve knob on top
  const knobGeom = new THREE.CylinderGeometry(
    params.valveKnobRadius, 
    params.valveKnobRadius * 0.8, 
    params.valveKnobHeight, 
    16
  );
  const knob = new THREE.Mesh(knobGeom, darkMaterial);
  knob.position.set(
    params.cylinderLength / 4, 
    params.cylinderRadius + params.valveKnobHeight / 2, 
    0
  );
  group.add(knob);
  
  // Knob top
  const knobTopGeom = new THREE.CylinderGeometry(
    params.valveKnobRadius * 0.9, 
    params.valveKnobRadius, 
    0.2, 
    16
  );
  const knobTop = new THREE.Mesh(knobTopGeom, darkMaterial);
  knobTop.position.set(
    params.cylinderLength / 4, 
    params.cylinderRadius + params.valveKnobHeight + 0.1, 
    0
  );
  group.add(knobTop);
  
  return group;
}

// Create flywheel with holes using shape extrusion
function createFlywheel(isRight = false) {
  const group = new THREE.Group();
  const radius = isRight ? params.rightFlywheelRadius : params.flywheelRadius;
  const thickness = params.flywheelThickness;
  
  // Create wheel profile with holes using Shape
  const wheelShape = new THREE.Shape();
  
  // Outer circle
  wheelShape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  
  // Inner holes (cutouts)
  if (!isRight) {
    // Left flywheel: 5 evenly spaced round holes
    const holeRadius = params.flywheelHoleRadius;
    const holeDistance = radius * 0.55;
    
    for (let i = 0; i < params.flywheelHoleCount; i++) {
      const angle = (i / params.flywheelHoleCount) * Math.PI * 2;
      const hx = Math.cos(angle) * holeDistance;
      const hy = Math.sin(angle) * holeDistance;
      
      const holePath = new THREE.Path();
      holePath.absarc(hx, hy, holeRadius, 0, Math.PI * 2, true);
      wheelShape.holes.push(holePath);
    }
    
    // Center hole for axle
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, params.hubRadius * 0.6, 0, Math.PI * 2, true);
    wheelShape.holes.push(centerHole);
    
  } else {
    // Right flywheel: irregular cutout pattern (cam/eccentric style)
    const cutoutRadius = radius * 0.35;
    const positions = [
      { x: radius * 0.4, y: radius * 0.3 },
      { x: -radius * 0.35, y: radius * 0.4 },
      { x: radius * 0.2, y: -radius * 0.45 },
      { x: -radius * 0.45, y: -radius * 0.25 }
    ];
    
    positions.forEach(pos => {
      const holePath = new THREE.Path();
      holePath.absarc(pos.x, pos.y, cutoutRadius, 0, Math.PI * 2, true);
      wheelShape.holes.push(holePath);
    });
    
    // Center area
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, radius * 0.25, 0, Math.PI * 2, true);
    wheelShape.holes.push(centerHole);
  }
  
  // Extrude the wheel
  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 2
  };
  
  const wheelGeom = new THREE.ExtrudeGeometry(wheelShape, extrudeSettings);
  wheelGeom.center();
  
  const wheel = new THREE.Mesh(wheelGeom, material);
  group.add(wheel);
  
  // Center hub
  const hubGeom = new THREE.CylinderGeometry(
    params.hubRadius, 
    params.hubRadius, 
    params.hubLength + thickness, 
    24
  );
  const hub = new THREE.Mesh(hubGeom, darkMaterial);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);
  
  // Axle pin through hub (for left flywheel mainly)
  if (!isRight) {
    const pinGeom = new THREE.CylinderGeometry(
      params.pinRadius, 
      params.pinRadius, 
      params.pinLength + params.hubLength, 
      12
    );
    const pin = new THREE.Mesh(pinGeom, darkMaterial);
    pin.rotation.z = Math.PI / 2;
    pin.position.x = params.pinLength / 2;
    group.add(pin);
  }
  
  return group;
}

// Create connecting mechanism between flywheels
function createConnectingMechanism() {
  const group = new THREE.Group();
  
  // Main bearing block
  const blockGeom = new THREE.BoxGeometry(3, 2.5, 2.5);
  const block = new THREE.Mesh(blockGeom, material);
  block.position.set(2.5, 0, 0);
  group.add(block);
  
  // Crank arm / connector
  const crankGeom = new THREE.BoxGeometry(2, 0.8, 0.8);
  const crank = new THREE.Mesh(crankGeom, darkMaterial);
  crank.position.set(3.5, 1.5, 0);
  crank.rotation.z = -Math.PI / 6;
  group.add(crank);
  
  // Small bearing housings
  const housingGeom = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16);
  
  const housing1 = new THREE.Mesh(housingGeom, darkMaterial);
  housing1.rotation.x = Math.PI / 2;
  housing1.position.set(1.5, 0.8, 1.2);
  group.add(housing1);
  
  const housing2 = new THREE.Mesh(housingGeom, darkMaterial);
  housing2.rotation.x = Math.PI / 2;
  housing2.position.set(3.5, 0.8, 1.2);
  group.add(housing2);
  
  // Piston rod connection point
  const rodEndGeom = new THREE.SphereGeometry(0.5, 16, 16);
  const rodEnd = new THREE.Mesh(rodEndGeom, darkMaterial);
  rodEnd.position.set(4.2, 2.2, 0);
  group.add(rodEnd);
  
  return group;
}

// ==========================================
// ASSEMBLY
// ==========================================

// Create and position base
const base = createBase();
base.position.y = params.baseY;
scene.add(base);

// Create finned cylinder
const cylinder = createFinnedCylinder();
cylinder.position.set(params.cylinderOffsetX, params.baseY + params.baseHeight + params.cylinderRadius, 0);
scene.add(cylinder);

// Create left flywheel
const leftFlywheel = createFlywheel(false);
leftFlywheel.position.set(
  params.leftFlywheelX, 
  params.baseY + params.baseHeight + params.flywheelRadius, 
  0
);
scene.add(leftFlywheel);

// Create right flywheel
const rightFlywheel = createFlywheel(true);
rightFlywheel.position.set(
  params.rightFlywheelX, 
  params.baseY + params.baseHeight + params.rightFlywheelRadius, 
  1.5  // Slightly offset in Z to show depth
);
scene.add(rightFlywheel);

// Create connecting mechanism
const mechanism = createConnectingMechanism();
mechanism.position.set(
  params.leftFlywheelX, 
  params.baseY + params.baseHeight + 1.5, 
  0
);
scene.add(mechanism);

// Additional detail: small feet/bolts on base
const footGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 16);
const footPositions = [
  [-5, -4], [5, -4], [-5, 4], [5, 4]
];

footPositions.forEach(pos => {
  const foot = new THREE.Mesh(footGeom, darkMaterial);
  foot.position.set(pos[0], params.baseY - 0.15, pos[1]);
  scene.add(foot);
});

// ==========================================
// CAMERA SETUP
// ==========================================
camera.position.set(18, 12, 18);
camera.lookAt(0, params.baseY, 0);