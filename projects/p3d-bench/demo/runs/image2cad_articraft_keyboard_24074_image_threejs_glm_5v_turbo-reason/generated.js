// ==========================================
// KEYBOARD PARAMETERS
// ==========================================

// Overall dimensions (approximate scale)
const KB_WIDTH = 44;        // Total width of keyboard
const KB_DEPTH = 14;        // Total depth (front to back)
const KB_THICKNESS = 0.6;   // Base chassis thickness
const CORNER_RADIUS = 0.8;  // Rounded corner radius

// Key parameters
const KEY_SIZE = 1.18;      // Standard key width/depth (square-ish)
const KEY_HEIGHT = 0.75;    // Height of keys above base
const KEY_GAP = 0.06;       // Gap between keys
const KEY_ROUND = 0.08;     // Slight rounding on key edges

// Layout offsets
const BASE_OFFSET_Y = -KB_DEPTH / 2 + 1.2;  // Start Y for first row
const BASE_OFFSET_X = -KB_WIDTH / 2 + 1.5;  // Start X for first column

// Materials
const baseMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  metalness: 0.25,
  roughness: 0.35,
});

const keyMaterial = new THREE.MeshStandardMaterial({
  color: 0x9a9a9a,
  metalness: 0.15,
  roughness: 0.45,
});

// ==========================================
// CREATE BASE CHASSIS (ROUNDED RECTANGLE)
// ==========================================

const baseShape = new THREE.Shape();
const w = KB_WIDTH;
const h = KB_DEPTH;
const r = CORNER_RADIUS;

// Draw rounded rectangle path
baseShape.moveTo(-w/2 + r, -h/2);
baseShape.lineTo(w/2 - r, -h/2);
baseShape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
baseShape.lineTo(w/2, h/2 - r);
baseShape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
baseShape.lineTo(-w/2 + r, h/2);
baseShape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
baseShape.lineTo(-w/2, -h/2 + r);
baseShape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

const extrudeSettings = {
  depth: KB_THICKNESS,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 2
};

const baseGeometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
baseMesh.rotation.x = -Math.PI / 2;  // Lay flat on XZ plane
scene.add(baseMesh);

// ==========================================
// KEY CREATION HELPER
// ==========================================

const keyGeometry = new THREE.BoxGeometry(KEY_SIZE - KEY_GAP, KEY_HEIGHT, KEY_SIZE - KEY_GAP);

// Add slight bevel effect by scaling vertices or using multiple geometries
// For simplicity we use boxes which approximate the chiclet style well

function createKey(x, z, widthMult = 1, depthMult = 1) {
  const geo = new THREE.BoxGeometry(
    (KEY_SIZE - KEY_GAP) * widthMult, 
    KEY_HEIGHT, 
    (KEY_SIZE - KEY_GAP) * depthMult
  );
  const mesh = new THREE.Mesh(geo, keyMaterial);
  mesh.position.set(x, KB_THICKNESS + KEY_HEIGHT / 2, z);
  scene.add(mesh);
}

// ==========================================
// KEYBOARD LAYOUT DEFINITION
// ==========================================

const step = KEY_SIZE;  // Spacing step between keys

// Row 1 (Top number row): 14 keys + numpad
let row = 0;
for (let col = 0; col < 14; col++) {
  createKey(BASE_OFFSET_X + col * step, BASE_OFFSET_Y + row * step);
}
// Numpad row 1
for (let col = 0; col < 5; col++) {
  createKey(BASE_OFFSET_X + 15 * step + col * step, BASE_OFFSET_Y + row * step);
}

// Row 2 (QWERTY row): Tab + 12 keys + numpad
row = 1;
createKey(BASE_OFFSET_X + 0 * step, BASE_OFFSET_Y + row * step); // Tab (1u)
for (let col = 1; col < 13; col++) {
  createKey(BASE_OFFSET_X + col * step, BASE_OFFSET_Y + row * step);
}
createKey(BASE_OFFSET_X + 13 * step, BASE_OFFSET_Y + row * step); // Backspace
// Numpad row 2
for (let col = 0; col < 5; col++) {
  createKey(BASE_OFFSET_X + 15 * step + col * step, BASE_OFFSET_Y + row * step);
}

// Row 3 (Home row): Caps + 11 keys + Enter + numpad
row = 2;
createKey(BASE_OFFSET_X + 0 * step, BASE_OFFSET_Y + row * step, 1.5, 1); // Caps lock
for (let col = 1.5; col < 12.5; col++) {
  createKey(BASE_OFFSET_X + col * step, BASE_OFFSET_Y + row * step);
}
createKey(BASE_OFFSET_X + 12.5 * step, BASE_OFFSET_Y + row * step, 1.5, 1); // Enter
// Numpad row 3
for (let col = 0; col < 5; col++) {
  createKey(BASE_OFFSET_X + 15 * step + col * step, BASE_OFFSET_Y + row * step);
}

// Row 4 (Shift row): Left Shift + 10 keys + Right Shift + numpad
row = 3;
createKey(BASE_OFFSET_X + 0 * step, BASE_OFFSET_Y + row * step, 1.8, 1); // Left Shift
for (let col = 1.8; col < 11.8; col++) {
  createKey(BASE_OFFSET_X + col * step, BASE_OFFSET_Y + row * step);
}
createKey(BASE_OFFSET_X + 11.8 * step, BASE_OFFSET_Y + row * step, 2.2, 1); // Right Shift
// Numpad row 4
for (let col = 0; col < 2; col++) {
  createKey(BASE_OFFSET_X + 15 * step + col * step, BASE_OFFSET_Y + row * step);
}
createKey(BASE_OFFSET_X + 17 * step, BASE_OFFSET_Y + row * step, 2, 1); // Numpad Enter
createKey(BASE_OFFSET_X + 19 * step, BASE_OFFSET_Y + row * step); // Numpad +

// Row 5 (Bottom row): Ctrl/Win/Alt + Spacebar + Alt/Win/Menu + numpad
row = 4;
createKey(BASE_OFFSET_X + 0 * step, BASE_OFFSET_Y + row * step, 1.3, 1); // Ctrl/Fn
createKey(BASE_OFFSET_X + 1.3 * step, BASE_OFFSET_Y + row * step, 1.3, 1); // Win/Cmd
createKey(BASE_OFFSET_X + 2.6 * step, BASE_OFFSET_Y + row * step, 1.3, 1); // Alt
createKey(BASE_OFFSET_X + 3.9 * step, BASE_OFFSET_Y + row * step, 6.25, 1); // Spacebar
createKey(BASE_OFFSET_X + 10.15 * step, BASE_OFFSET_Y + row * step, 1.3, 1); // Alt Gr
createKey(BASE_OFFSET_X + 11.45 * step, BASE_OFFSET_Y + row * step, 1.3, 1); // Win/Cmd
createKey(BASE_OFFSET_X + 12.75 * step, BASE_OFFSET_Y + row * step, 1.3, 1); // Menu/Ctrl
// Numpad bottom
for (let col = 0; col < 5; col++) {
  if (col !== 2) { // Skip middle for 0 key spanning
    createKey(BASE_OFFSET_X + 15 * step + col * step, BASE_OFFSET_Y + row * step);
  }
}
createKey(BASE_OFFSET_X + 16 * step, BASE_OFFSET_Y + row * step, 2, 1); // Numpad 0 (wide)
createKey(BASE_OFFSET_X + 19 * step, BASE_OFFSET_Y + row * step); // Numpad .

// ==========================================
// CAMERA POSITIONING
// ==========================================

camera.position.set(30, 25, 30);
camera.lookAt(0, 0, 0);