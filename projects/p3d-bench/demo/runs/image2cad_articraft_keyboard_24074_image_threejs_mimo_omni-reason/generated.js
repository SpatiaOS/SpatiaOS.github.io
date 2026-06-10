// Parameters for the keyboard model
const baseLength = 40;   // Length of the keyboard base (x-axis)
const baseWidth = 10;    // Width of the keyboard base (z-axis)
const baseHeight = 1;    // Height of the keyboard base (y-axis)
const keyHeight = 0.2;   // Height of individual keys (y-axis)
const keySize = 1;       // Size of small keys (x and z axes)
const spaceBarLength = 10; // Length of the space bar (x-axis)
const spaceBarWidth = 1;  // Width of the space bar (z-axis)
const roundedRadius = 1;  // Radius of the curved front-left corner

// Create the 2D base shape with a rounded front-left corner
const baseShape = new THREE.Shape();
baseShape.moveTo(0, 0);          // Start at the front-left corner
baseShape.lineTo(baseLength, 0); // Draw right to the front-right corner
baseShape.lineTo(baseLength, baseWidth); // Draw up to the back-right corner
baseShape.lineTo(0, baseWidth);  // Draw left to the back-left corner
baseShape.lineTo(0, 0);          // Close the shape
// Add a rounded corner at the front-left (0,0) with radius roundedRadius
baseShape.absarc(0, 0, roundedRadius, Math.PI / 2, 3 * Math.PI / 2, false);

// Extrude the 2D shape to create the 3D base
const baseGeometry = new THREE.ExtrudeGeometry(baseShape, {
  depth: baseHeight,
  bevelEnabled: false // Disable bevel for a sharp edge
});
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray base
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Create keys on top of the base
const numRows = 5;  // Number of key rows (z-axis)
const numCols = 15; // Number of key columns (x-axis)

for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    // Check if this is the space bar (last row, columns 5–14)
    if (row === numRows - 1 && col >= 5 && col <= 14) {
      // Space bar: longer in x, same width as small keys
      const keyGeometry = new THREE.BoxGeometry(spaceBarLength, keyHeight, spaceBarWidth);
      const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 }); // Darker gray keys
      const key = new THREE.Mesh(keyGeometry, keyMaterial);
      // Position the space bar to span columns 5–14
      key.position.x = 5 * keySize + spaceBarLength / 2;
      key.position.z = row * keySize + spaceBarWidth / 2;
      key.position.y = baseHeight + keyHeight / 2; // Place on top of the base
      scene.add(key);
    } else {
      // Regular small key
      const keyGeometry = new THREE.BoxGeometry(keySize, keyHeight, keySize);
      const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 });
      const key = new THREE.Mesh(keyGeometry, keyMaterial);
      // Center the key in its column and row
      key.position.x = col * keySize + keySize / 2;
      key.position.z = row * keySize + keySize / 2;
      key.position.y = baseHeight + keyHeight / 2;
      scene.add(key);
    }
  }
}

// Adjust camera to view the keyboard
camera.position.set(30, 20, 20);
camera.lookAt(20, 0, 5); // Focus on the center of the keyboard