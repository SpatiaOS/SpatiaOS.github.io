// === Parameters for the speaker model ===
// Main speaker box dimensions
const mainWidth = 40;
const mainHeight = 20;
const mainDepth = 12;

// Speaker grille parameters
const grilleOuterRadius = 8;
const grilleInnerRadius = 6;
const grilleDepth = 1;
const innerCircleRadius = 5;
const ribCount = 24; // Number of ribs on the speaker grille
const ribThickness = 0.3;

// Control knob parameters
const knobBaseRadius = 0.8;
const knobHeight = 0.5;
const knobTopRadius = 0.5;
const knobTopHeight = 0.2;

// Leg parameters
const legTopRadius = 1.5;
const legBottomRadius = 0.8;
const legHeight = 15;
const legAngle = 30; // Degrees of outward tilt

// === Create main speaker box ===
const mainBoxGeometry = new THREE.BoxGeometry(mainWidth, mainHeight, mainDepth);
const mainMaterial = new THREE.MeshStandardMaterial({ color: 0x707070 });
const mainBox = new THREE.Mesh(mainBoxGeometry, mainMaterial);
scene.add(mainBox);

// === Create speaker grilles (two units, front face) ===
const createSpeakerGrille = (xPos) => {
  // Hexagonal outer frame
  const hexShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const x = Math.cos(angle) * grilleOuterRadius;
    const y = Math.sin(angle) * grilleOuterRadius;
    if (i === 0) hexShape.moveTo(x, y);
    else hexShape.lineTo(x, y);
  }
  hexShape.closePath();

  // Cut inner circle from hexagon
  const innerCircle = new THREE.Path();
  innerCircle.absarc(0, 0, grilleInnerRadius, 0, Math.PI * 2, false);
  hexShape.holes.push(innerCircle);

  const hexExtrudeSettings = { depth: grilleDepth, bevelEnabled: false };
  const hexGeometry = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);
  const hexMesh = new THREE.Mesh(hexGeometry, new THREE.MeshStandardMaterial({ color: 0x505050 }));
  hexMesh.position.set(xPos, 0, mainDepth/2 + grilleDepth/2);
  scene.add(hexMesh);

  // Inner circular speaker with ribs
  const innerCircleGeometry = new THREE.CircleGeometry(innerCircleRadius, 32);
  const innerCircleMesh = new THREE.Mesh(innerCircleGeometry, new THREE.MeshStandardMaterial({ color: 0x303030 }));
  innerCircleMesh.position.set(xPos, 0, mainDepth/2 + grilleDepth + 0.05);
  scene.add(innerCircleMesh);

  // Add ribs around inner circle
  for (let i = 0; i < ribCount; i++) {
    const angle = (i * Math.PI * 2) / ribCount;
    const ribGeometry = new THREE.BoxGeometry(ribThickness, grilleInnerRadius - innerCircleRadius - 0.2, grilleDepth * 0.8);
    const ribMesh = new THREE.Mesh(ribGeometry, new THREE.MeshStandardMaterial({ color: 0x202020 }));
    ribMesh.position.set(
      xPos + Math.cos(angle) * (grilleInnerRadius - (grilleInnerRadius - innerCircleRadius)/2),
      Math.sin(angle) * (grilleInnerRadius - (grilleInnerRadius - innerCircleRadius)/2),
      mainDepth/2 + grilleDepth/2
    );
    ribMesh.rotation.z = angle;
    scene.add(ribMesh);
  }
};

// Add two speaker grilles
createSpeakerGrille(-mainWidth/4);
createSpeakerGrille(mainWidth/4);

// === Create control knobs (top right of main box) ===
const createKnob = (xPos) => {
  // Knob base
  const knobBaseGeometry = new THREE.CylinderGeometry(knobBaseRadius, knobBaseRadius, knobHeight, 16);
  const knobBase = new THREE.Mesh(knobBaseGeometry, new THREE.MeshStandardMaterial({ color: 0x404040 }));
  knobBase.position.set(xPos, mainHeight/2 + knobHeight/2, 0);
  scene.add(knobBase);

  // Knob top
  const knobTopGeometry = new THREE.CylinderGeometry(knobTopRadius, knobTopRadius, knobTopHeight, 16);
  const knobTop = new THREE.Mesh(knobTopGeometry, new THREE.MeshStandardMaterial({ color: 0x606060 }));
  knobTop.position.set(xPos, mainHeight/2 + knobHeight + knobTopHeight/2, 0);
  scene.add(knobTop);
};

// Add three control knobs
createKnob(mainWidth/4 - 2);
createKnob(mainWidth/4);
createKnob(mainWidth/4 + 2);

// === Create angled legs (four total) ===
const createLeg = (xPos, zPos, zRotation) => {
  // Tapered cylinder leg
  const legGeometry = new THREE.CylinderGeometry(legTopRadius, legBottomRadius, legHeight, 16);
  const legMesh = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x808080 }));
  
  // Position leg at box corner, rotate outward
  legMesh.position.set(xPos, -mainHeight/2 - legHeight/2, zPos);
  legMesh.rotation.z = THREE.MathUtils.degToRad(zRotation);
  scene.add(legMesh);
};

// Add four legs, angled outward
createLeg(-mainWidth/2, mainDepth/2, -legAngle);
createLeg(mainWidth/2, mainDepth/2, legAngle);
createLeg(-mainWidth/2, -mainDepth/2, -legAngle);
createLeg(mainWidth/2, -mainDepth/2, legAngle);

// === Adjust camera for better view ===
camera.position.set(60, 40, 60);
camera.lookAt(0, 0, 0);