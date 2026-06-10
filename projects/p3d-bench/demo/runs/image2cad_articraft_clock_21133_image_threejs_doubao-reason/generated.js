// ==================== PARAMETERS ====================
const overallDiameter = 10;       // Total size of the clock
const baseThickness = 0.8;        // Thickness of the main base disc
const rimHeight = 0.3;            // Height difference between outer rim and inner face
const rimWidth = 1.0;             // Width of the outer raised rim
const innerFaceRadius = (overallDiameter / 2) - rimWidth;
const numeralHeight = 0.15;       // Height of raised Roman numerals
const numeralSize = 0.6;          // Length of each numeral marker
const centerHubRadius = 0.8;      // Radius of the center pivot hub
const centerHubHeight = 0.2;      // Height of center hub
const handLength = 3.4;           // Length of the clock hand
const handWidth = 0.22;           // Width of the clock hand
const handThickness = 0.12;       // Thickness of the clock hand
const greyMaterial = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.6, metalness: 0.2 });

// ==================== BASE GEOMETRY ====================
// Main outer base disc
const baseGeometry = new THREE.CylinderGeometry(overallDiameter / 2, overallDiameter / 2, baseThickness, 64);
const base = new THREE.Mesh(baseGeometry, greyMaterial);
base.position.y = baseThickness / 2;
scene.add(base);

// Recessed inner clock face
const innerFaceGeometry = new THREE.CylinderGeometry(innerFaceRadius, innerFaceRadius, 0.01, 64);
const innerFace = new THREE.Mesh(innerFaceGeometry, greyMaterial);
innerFace.position.y = baseThickness - rimHeight + 0.005;
scene.add(innerFace);

// ==================== ROMAN NUMERAL MARKERS ====================
const numeralGeometry = new THREE.BoxGeometry(numeralSize, numeralHeight, numeralSize * 0.3);
// Place 12 numerals around the clock face, 30 degrees apart
for (let i = 0; i < 12; i++) {
  const angle = (i * 30) * Math.PI / 180;
  const numeral = new THREE.Mesh(numeralGeometry, greyMaterial);
  // Position around center at radius 80% of inner face
  numeral.position.x = Math.cos(angle) * (innerFaceRadius * 0.8);
  numeral.position.z = Math.sin(angle) * (innerFaceRadius * 0.8);
  numeral.position.y = innerFace.position.y + (numeralHeight / 2);
  // Rotate numeral to face outward
  numeral.rotation.y = -angle;
  scene.add(numeral);
}

// ==================== CENTER HUB ====================
const centerHubGeometry = new THREE.CylinderGeometry(centerHubRadius, centerHubRadius, centerHubHeight, 32);
const centerHub = new THREE.Mesh(centerHubGeometry, greyMaterial);
centerHub.position.y = innerFace.position.y + (centerHubHeight / 2);
scene.add(centerHub);

// Small center pivot dot
const centerDotGeometry = new THREE.CylinderGeometry(0.2, 0.2, centerHubHeight + 0.02, 16);
const centerDot = new THREE.Mesh(centerDotGeometry, greyMaterial);
centerDot.position.y = centerHub.position.y;
scene.add(centerDot);

// ==================== CLOCK HAND ====================
const handGeometry = new THREE.BoxGeometry(handLength, handThickness, handWidth);
// Translate geometry so pivot point is at the center hub
handGeometry.translate(handLength / 2, 0, 0);
const hand = new THREE.Mesh(handGeometry, greyMaterial);
hand.position.y = centerHub.position.y + (centerHubHeight / 2) + 0.05;
// Rotate hand to ~2 o'clock position matching reference image
hand.rotation.y = -60 * Math.PI / 180;
scene.add(hand);

// ==================== CAMERA ADJUSTMENT ====================
camera.position.set(12, 10, 12);
camera.lookAt(0, baseThickness / 2, 0);