// Parameters (interpreted from the image's proportions)
const baseRadius = 10;
const baseHeight = 2;
const numFins = 36; // Radial fins for the base grille
const finWidth = 0.2;
const finHeight = 1.5;
const finDepth = 0.1;

const centralRadius = 3;
const centralHeight = 5;

const armLength = 8;
const armWidth = 1;
const armHeight = 1;

const armEndRadius = 0.5;
const armEndHeight = 1;

// Horn profile (flared shape via LatheGeometry)
const hornProfile = [
  new THREE.Vector2(armEndRadius, 0), // Start at arm end (radius, y)
  new THREE.Vector2(5, 5)             // End at horn tip (radius, y)
];

// Base (cylinder + radial fins)
const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Add radial fins to the base
for (let i = 0; i < numFins; i++) {
  const angle = (i * 2 * Math.PI) / numFins;
  const finGeometry = new THREE.BoxGeometry(finWidth, finHeight, finDepth);
  const fin = new THREE.Mesh(finGeometry, baseMaterial);
  fin.position.set(
    Math.cos(angle) * baseRadius,
    baseHeight / 2, // Middle of base height
    Math.sin(angle) * baseRadius
  );
  fin.rotation.y = angle; // Align fin with radial direction
  scene.add(fin);
}

// Central cylinder (housing)
const centralGeometry = new THREE.CylinderGeometry(centralRadius, centralRadius, centralHeight, 32);
const centralMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const central = new THREE.Mesh(centralGeometry, centralMaterial);
central.position.set(0, baseHeight + centralHeight / 2, 0); // Center on base
scene.add(central);

// Arm (connecting cylinder to horn)
const armGeometry = new THREE.BoxGeometry(armLength, armWidth, armHeight);
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const arm = new THREE.Mesh(armGeometry, armMaterial);
arm.position.set(centralRadius, baseHeight + centralHeight, 0); // Attach to central cylinder
scene.add(arm);

// Bolt detail on the arm
const boltRadius = 0.2;
const boltHeight = 0.5;
const boltGeometry = new THREE.CylinderGeometry(boltRadius, boltRadius, boltHeight, 16);
const boltMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
bolt.position.set(
  centralRadius + armLength / 2, // Middle of arm
  baseHeight + centralHeight + boltHeight / 2, // On top of arm
  0
);
scene.add(bolt);

// Arm end cylinder (transition to horn)
const armEndGeometry = new THREE.CylinderGeometry(armEndRadius, armEndRadius, armEndHeight, 32);
const armEndMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const armEnd = new THREE.Mesh(armEndGeometry, armEndMaterial);
armEnd.position.set(centralRadius + armLength, baseHeight + centralHeight, 0);
scene.add(armEnd);

// Horn (flared shape via LatheGeometry)
const hornGeometry = new THREE.LatheGeometry(hornProfile, 32);
const hornMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
const horn = new THREE.Mesh(hornGeometry, hornMaterial);
horn.rotation.y = Math.PI / 2; // Align with arm (x-axis)
horn.position.set(centralRadius + armLength, baseHeight + centralHeight, 0);
scene.add(horn);

// Adjust camera to view the model
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);