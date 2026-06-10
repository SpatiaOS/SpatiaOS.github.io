// Parameters for the perforated conical basket (centrifuge/filter component)
const largeRadius = 8;          // Radius at open (scalloped) end
const smallRadius = 5;          // Radius at closed (domed) end
const totalLength = 14;         // Total axial length
const lobeCount = 8;            // Number of scalloped lobes at open end
const lobeAmplitude = 1.8;      // Depth of scalloping wave
const wallThickness = 0.12;     // Visual thickness indication
const ribCount = 8;             // Number of longitudinal structural ribs

// Material definition - brushed metallic appearance
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x909090,
  side: THREE.DoubleSide,
  metalness: 0.65,
  roughness: 0.35,
  flatShading: false
});

const ribMaterial = new THREE.MeshStandardMaterial({
  color: 0x707070,
  metalness: 0.75,
  roughness: 0.25
});

const holeMaterial = new THREE.MeshStandardMaterial({
  color: 0x151515,
  side: THREE.DoubleSide,
  roughness: 0.9
});

// ============================================
// MAIN CONICAL BODY WITH SCALLOPED EDGE
// ============================================
const lathePoints = [];
const latheSegments = 80;

for (let i = 0; i <= latheSegments; i++) {
  const t = i / latheSegments;
  const y = t * totalLength;
  
  // Conical radius interpolation (linear taper)
  let radius = largeRadius - (largeRadius - smallRadius) * t;
  
  // Apply sinusoidal scalloping at the open end (top 20% of height)
  if (t > 0.82) {
    const scallopPhase = (t - 0.82) / 0.18; // 0 to 1 over scalloped region
    const wave = Math.sin(scallopPhase * Math.PI * 2 * lobeCount);
    radius -= Math.abs(wave) * lobeAmplitude * scallopPhase;
  }
  
  lathePoints.push(new THREE.Vector2(radius, y));
}

const bodyGeometry = new THREE.LatheGeometry(lathePoints, 96);
const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
scene.add(bodyMesh);

// ============================================
// DOMED END CAP (closed end)
// ============================================
const domeGeometry = new THREE.SphereGeometry(
  smallRadius, 
  48, 
  24, 
  0, 
  Math.PI * 2, 
  0, 
  Math.PI / 2
);
// Position dome at the narrow end of the cone
domeGeometry.translate(0, totalLength, 0);
const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
scene.add(domeMesh);

// Reinforcing ring at base of dome
const ringGeometry = new THREE.TorusGeometry(smallRadius, 0.25, 16, 48);
ringGeometry.rotateX(Math.PI / 2);
ringGeometry.translate(0, totalLength, 0);
const ringMesh = new THREE.Mesh(ringGeometry, ribMaterial);
scene.add(ringMesh);

// ============================================
// LONGITUDINAL STRUCTURAL RIBS
// ============================================
const taperAngle = Math.atan2(largeRadius - smallRadius, totalLength);

for (let i = 0; i < ribCount; i++) {
  const theta = (i / ribCount) * Math.PI * 2;
  
  // Rib dimensions
  const ribWidth = 0.35;
  const ribHeight = 0.18;
  const ribLength = totalLength * 0.92;
  
  const ribGeom = new THREE.BoxGeometry(ribWidth, ribLength, ribHeight);
  const ribMesh = new THREE.Mesh(ribGeom, ribMaterial);
  
  // Calculate midpoint position on cone surface
  const midT = 0.5;
  const midRadius = largeRadius - (largeRadius - smallRadius) * midT;
  
  ribMesh.position.set(
    Math.cos(theta) * midRadius,
    totalLength * midT,
    Math.sin(theta) * midRadius
  );
  
  // Orient rib to follow cone surface
  ribMesh.rotation.y = -theta;
  ribMesh.rotation.x = taperAngle;
  
  scene.add(ribMesh);
}

// ============================================
// RECTANGULAR SLOT PERFORATIONS
// ============================================
const slotCount = 320;
const slotGeom = new THREE.BoxGeometry(0.12, 0.55, 0.02);
const slots = new THREE.InstancedMesh(slotGeom, holeMaterial, slotCount);

const tempMatrix = new THREE.Matrix4();
const pos = new THREE.Vector3();
const quat = new THREE.Quaternion();
const scale = new THREE.Vector3(1, 1, 1);
let slotIdx = 0;

// Create grid of rectangular slots following the conical surface
for (let row = 0; row < 12 && slotIdx < slotCount; row++) {
  const yPos = 1.0 + row * 1.0;
  if (yPos >= totalLength - 1.5) continue;
  
  const rowRadius = largeRadius - (largeRadius - smallRadius) * (yPos / totalLength);
  const slotsPerRow = Math.floor(rowRadius * 1.8);
  
  for (let col = 0; col < slotsPerRow && slotIdx < slotCount; col++) {
    const angle = (col / slotsPerRow) * Math.PI * 2;
    
    pos.set(
      Math.cos(angle) * rowRadius,
      yPos,
      Math.sin(angle) * rowRadius
    );
    
    quat.setFromEuler(new THREE.Euler(-Math.PI/2, -angle, 0, 'XYZ'));
    tempMatrix.compose(pos, quat, scale);
    slots.setMatrixAt(slotIdx++, tempMatrix);
  }
}
slots.instanceMatrix.needsUpdate = true;
scene.add(slots);

// ============================================
// CIRCULAR HOLE PATTERNS (curved rows)
// ============================================
const circleHoleCount = 120;
const circleHoleGeom = new THREE.CircleGeometry(0.22, 20);
const circleHoles = new THREE.InstancedMesh(circleHoleGeom, holeMaterial, circleHoleCount);

let holeIdx = 0;

// Diagonal curved rows of circular holes
for (let spiral = 0; spiral < 6 && holeIdx < circleHoleCount; spiral++) {
  const startAngle = (spiral / 6) * Math.PI * 2;
  const holesInSpiral = 18;
  
  for (let h = 0; h < holesInSpiral && holeIdx < circleHoleCount; h++) {
    const progress = h / holesInSpiral;
    const yPos = 2.5 + progress * (totalLength - 4.5);
    const currentRadius = largeRadius - (largeRadius - smallRadius) * (yPos / totalLength);
    const angle = startAngle + progress * Math.PI * 1.2;
    
    // Offset slightly inward so holes appear on surface
    const rOffset = currentRadius - 0.015;
    
    pos.set(
      Math.cos(angle) * rOffset,
      yPos,
      Math.sin(angle) * rOffset
    );
    
    // Orient holes to face outward radially
    quat.setFromEuler(new THREE.Euler(0, -angle + Math.PI/2, 0, 'XYZ'));
    tempMatrix.compose(pos, quat, scale);
    circleHoles.setMatrixAt(holeIdx++, tempMatrix);
  }
}
circleHoles.instanceMatrix.needsUpdate = true;
scene.add(circleHoles);

// ============================================
// CAMERA POSITIONING
// ============================================
camera.position.set(20, 10, 20);
camera.lookAt(0, totalLength * 0.45, 0);