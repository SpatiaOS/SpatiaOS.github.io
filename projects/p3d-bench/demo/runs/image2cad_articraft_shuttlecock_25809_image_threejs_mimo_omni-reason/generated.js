// Parameters
const mainRadius = 5;       // Radius of the main cylindrical body
const mainHeight = 20;      // Height of the main cylindrical body
const endRadius = 4;        // Radius of the smaller end cylinder
const endHeight = 5;        // Height of the smaller end cylinder
const sliceThickness = 1;   // Thickness of each sliced layer
const numSlices = 8;        // Number of sliced layers
const sliceOuterRadius = 5; // Outer radius of each sliced layer (matches main cylinder)
const sliceInnerRadius = 4; // Inner radius of each sliced layer (matches end cylinder)

// Create main cylindrical body
const mainGeometry = new THREE.CylinderGeometry(mainRadius, mainRadius, mainHeight, 32);
const mainMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const mainCylinder = new THREE.Mesh(mainGeometry, mainMaterial);
scene.add(mainCylinder);

// Create smaller end cylinder (attached to main body)
const endGeometry = new THREE.CylinderGeometry(endRadius, endRadius, endHeight, 32);
const endMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const endCylinder = new THREE.Mesh(endGeometry, endMaterial);
endCylinder.position.z = mainHeight / 2 + endHeight / 2; // Position at the end of the main cylinder
scene.add(endCylinder);

// Create sliced layers (annuli) with alternating patterns
for (let i = 0; i < numSlices; i++) {
  // Create annular (hollow) cylinder for each slice
  const sliceGeometry = new THREE.CylinderGeometry(
    sliceOuterRadius, sliceOuterRadius, sliceThickness, 32, 1, true
  );
  const sliceMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x808080, 
    side: THREE.DoubleSide 
  });
  const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
  slice.position.z = -mainHeight / 2 + i * sliceThickness + sliceThickness / 2;
  scene.add(slice);

  // Alternate between rectangular slots and circular holes
  if (i % 2 === 0) {
    // Rectangular slots (8 slots per slice)
    const numSlots = 8;
    const slotWidth = 0.5;
    const slotHeight = sliceThickness;
    const slotDepth = sliceOuterRadius - sliceInnerRadius;
    for (let j = 0; j < numSlots; j++) {
      const slotGeometry = new THREE.BoxGeometry(slotWidth, slotHeight, slotDepth);
      const slotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const slot = new THREE.Mesh(slotGeometry, slotMaterial);
      const angle = (j * 2 * Math.PI) / numSlots;
      const x = Math.cos(angle) * (sliceOuterRadius - slotDepth / 2);
      const y = Math.sin(angle) * (sliceOuterRadius - slotDepth / 2);
      slot.position.set(x, y, slice.position.z);
      slot.rotation.z = angle; // Align with the annulus
      scene.add(slot);
    }
  } else {
    // Circular holes (8 holes per slice)
    const numHoles = 8;
    const holeRadius = 0.5;
    for (let j = 0; j < numHoles; j++) {
      const holeGeometry = new THREE.CylinderGeometry(holeRadius, holeRadius, sliceThickness, 16);
      const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const hole = new THREE.Mesh(holeGeometry, holeMaterial);
      const angle = (j * 2 * Math.PI) / numHoles;
      const x = Math.cos(angle) * (sliceOuterRadius - (sliceOuterRadius - sliceInnerRadius) / 2);
      const y = Math.sin(angle) * (sliceOuterRadius - (sliceOuterRadius - sliceInnerRadius) / 2);
      hole.position.set(x, y, slice.position.z);
      scene.add(hole);
    }
  }
}

// Adjust camera to view the model
camera.position.set(15, 15, 15);
camera.lookAt(0, 0, 0);