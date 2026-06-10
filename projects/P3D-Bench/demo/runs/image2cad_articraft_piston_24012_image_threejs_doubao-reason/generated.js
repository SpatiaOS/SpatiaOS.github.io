// --------------------------
// Parameters (proportioned to match the reference drawing)
// --------------------------
const pistonDiameter = 10;          // Diameter of piston crown
const pistonHeight = 8;             // Total height of piston body
const ringCount = 3;                // Number of piston rings near crown
const wristPinDiameter = 2;         // Diameter of piston wrist pin
const rodLength = 25;               // Center-to-center length of connecting rod (wrist pin to big end)
const rodWidth = 2;                 // Thickness of connecting rod
const bigEndOuterDiameter = 7;      // Outer diameter of rod big end
const bigEndInnerDiameter = 4;      // Inner diameter of rod big end (crank pin bore)
const boltSize = 1;                 // Size of big end bolt heads
const boltHeight = 1.5;             // Height of bolt heads

// Shared material (aluminum/steel alloy finish for engine components)
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xb0b4b8,
  metalness: 0.85,
  roughness: 0.3,
});

// --------------------------
// Piston Assembly
// --------------------------
// Main piston body
const pistonGeo = new THREE.CylinderGeometry(pistonDiameter/2, pistonDiameter/2, pistonHeight, 32);
const piston = new THREE.Mesh(pistonGeo, metalMaterial);
piston.position.y = rodLength; // Align wrist pin bore with rod top end
scene.add(piston);

// Piston top recess detail
const pistonTopRecessGeo = new THREE.CylinderGeometry(1, 1, 0.2, 24);
const pistonTopRecess = new THREE.Mesh(pistonTopRecessGeo, metalMaterial);
pistonTopRecess.position.y = rodLength + (pistonHeight/2) - 0.1;
scene.add(pistonTopRecess);

// Piston rings
for(let i = 0; i < ringCount; i++) {
  const ringGeo = new THREE.CylinderGeometry(
    (pistonDiameter/2) + 0.12, 
    (pistonDiameter/2) + 0.12, 
    0.3, 32
  );
  const ring = new THREE.Mesh(ringGeo, metalMaterial);
  ring.position.y = rodLength + (pistonHeight/2) - 1 - (i * 0.6);
  scene.add(ring);
}

// Wrist pin (connects piston to connecting rod)
const wristPinGeo = new THREE.CylinderGeometry(wristPinDiameter/2, wristPinDiameter/2, pistonDiameter + 1, 24);
wristPinGeo.rotateZ(Math.PI/2); // Align pin along X axis
const wristPin = new THREE.Mesh(wristPinGeo, metalMaterial);
wristPin.position.y = rodLength;
scene.add(wristPin);

// Wrist pin access cap detail (side of piston)
const pinCapGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 24);
pinCapGeo.rotateY(Math.PI/2);
const pinCap = new THREE.Mesh(pinCapGeo, metalMaterial);
pinCap.position.set(pistonDiameter/2 + 0.05, rodLength, 0);
scene.add(pinCap);

// --------------------------
// Connecting Rod Assembly
// --------------------------
// Small end (top of rod, accepts wrist pin)
const smallEndGeo = new THREE.CylinderGeometry(1.5, 1.5, rodWidth, 24);
smallEndGeo.rotateX(Math.PI/2);
const smallEnd = new THREE.Mesh(smallEndGeo, metalMaterial);
smallEnd.position.y = rodLength;
scene.add(smallEnd);

// I-beam rod body (main structural part of connecting rod)
const rodBodyGeo = new THREE.BoxGeometry(3, rodLength - 6, rodWidth);
const rodBody = new THREE.Mesh(rodBodyGeo, metalMaterial);
rodBody.position.y = rodLength / 2;
scene.add(rodBody);

// Internal I-beam reinforcement ribs (triangular cutout detail)
for(let i = 0; i < 6; i++) {
  const ribGeo = new THREE.BoxGeometry(0.2, 2, rodWidth - 0.3);
  const rib = new THREE.Mesh(ribGeo, metalMaterial);
  rib.position.set(
    (i % 2 === 0) ? -1.2 : 1.2,
    rodLength - 5 - (i * 2.8),
    0
  );
  scene.add(rib);
}

// Big end (bottom of rod, connects to crankshaft)
const bigEndGeo = new THREE.CylinderGeometry(bigEndOuterDiameter/2, bigEndOuterDiameter/2, rodWidth + 0.5, 32);
// Cut inner bore for crank pin (create ring shape)
const bigEndBoreGeo = new THREE.CylinderGeometry(bigEndInnerDiameter/2, bigEndInnerDiameter/2, rodWidth + 0.6, 32);
bigEndGeo.rotateX(Math.PI/2);
bigEndBoreGeo.rotateX(Math.PI/2);
// Merge to create hollow big end (use CSG approximation by adding inner as negative, simplified here)
const bigEnd = new THREE.Mesh(bigEndGeo, metalMaterial);
bigEnd.position.y = 0;
scene.add(bigEnd);
const bigEndBore = new THREE.Mesh(bigEndBoreGeo, new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide}));
bigEndBore.position.y = 0;
scene.add(bigEndBore);

// Big end cap
const bigEndCapGeo = new THREE.BoxGeometry(bigEndOuterDiameter, 1, rodWidth + 0.6);
const bigEndCap = new THREE.Mesh(bigEndCapGeo, metalMaterial);
bigEndCap.position.y = - (bigEndOuterDiameter/2) - 0.5;
scene.add(bigEndCap);

// Big end bolts (2 bolts with nuts on both sides)
const boltPositions = [
  [-2.6, -3, 1.4], [-2.6, -3, -1.4],
  [2.6, -3, 1.4], [2.6, -3, -1.4]
];
boltPositions.forEach(pos => {
  const boltGeo = new THREE.BoxGeometry(boltSize, boltHeight, boltSize);
  const bolt = new THREE.Mesh(boltGeo, metalMaterial);
  bolt.position.set(pos[0], pos[1], pos[2]);
  scene.add(bolt);
});

// --------------------------
// Camera Setup
// --------------------------
camera.position.set(30, 20, 35);
camera.lookAt(0, rodLength/2, 0);