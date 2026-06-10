// ==================== PARAMETERS ====================
// Keyboard base dimensions
const keyboardLength = 30;    // X-axis total length
const keyboardWidth = 11;     // Z-axis total width
const baseThickness = 0.3;    // Y-axis height of base plate
const baseColor = 0xaaaaaa;   // Light gray aluminum-style base

// Key dimensions (standard 1u key)
const keyUnitSize = 0.8;      // Width/height of 1 unit key
const keyThickness = 0.15;    // Y-axis height of keycaps
const keyGap = 0.15;          // Spacing between adjacent keys
const keyColor = 0x666666;    // Dark gray keycaps
const keyStep = keyUnitSize + keyGap; // Distance between centers of adjacent 1u keys

// ==================== BASE PLATE ====================
const baseGeometry = new THREE.BoxGeometry(keyboardLength, baseThickness, keyboardWidth);
const baseMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.8, metalness: 0.2 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = baseThickness / 2; // Position so base sits flat on Y=0 plane
scene.add(base);

// ==================== HELPER FUNCTION TO CREATE KEYS ====================
// Creates a key of custom size (in key units) at given X/Z position
function createKey(widthUnits, heightUnits, posX, posZ) {
  const keyW = widthUnits * keyUnitSize + (widthUnits - 1) * keyGap;
  const keyH = heightUnits * keyUnitSize + (heightUnits - 1) * keyGap;
  const keyGeometry = new THREE.BoxGeometry(keyW, keyThickness, keyH);
  const keyMaterial = new THREE.MeshStandardMaterial({ color: keyColor, roughness: 0.7 });
  const key = new THREE.Mesh(keyGeometry, keyMaterial);
  // Position key on top of base plate
  key.position.set(posX, baseThickness + (keyThickness / 2), posZ);
  scene.add(key);
  return key;
}

// ==================== MAIN KEYBOARD LAYOUT (LEFT ALPHANUMERIC AREA) ====================
const mainStartX = -13;       // Leftmost key X position
const mainStartZ = 4;         // Topmost key Z position

// Row 1 (Top function key row)
for (let i = 0; i < 12; i++) createKey(1, 1, mainStartX + i * keyStep, mainStartZ);
for (let i = 0; i < 4; i++) createKey(1, 1, mainStartX + (13 + i) * keyStep, mainStartZ);

// Row 2 (Number/tilde row)
createKey(1, 1, mainStartX, mainStartZ - keyStep);
for (let i = 0; i < 12; i++) createKey(1, 1, mainStartX + (i + 1) * keyStep, mainStartZ - keyStep);
createKey(2, 1, mainStartX + 13 * keyStep + (keyStep / 2), mainStartZ - keyStep); // 2u backspace

// Row 3 (Tab/QWERTY row)
createKey(1.5, 1, mainStartX + (keyStep * 0.25), mainStartZ - 2 * keyStep); // 1.5u tab
for (let i = 0; i < 12; i++) createKey(1, 1, mainStartX + 1.5 * keyStep + i * keyStep, mainStartZ - 2 * keyStep);
createKey(1.5, 1, mainStartX + 1.5*keyStep + 12*keyStep + (keyStep*0.25), mainStartZ - 2 * keyStep); // 1.5u backslash

// Row 4 (Caps lock/ASDF row)
createKey(1.75, 1, mainStartX + (keyStep * 0.375), mainStartZ - 3 * keyStep); // 1.75u caps lock
for (let i = 0; i < 11; i++) createKey(1, 1, mainStartX + 1.75 * keyStep + i * keyStep, mainStartZ - 3 * keyStep);
createKey(2.25, 1, mainStartX + 1.75*keyStep + 11*keyStep + (keyStep*0.625), mainStartZ - 3 * keyStep); // 2.25u enter

// Row 5 (Shift/ZXCV row)
createKey(2.25, 1, mainStartX + (keyStep * 0.625), mainStartZ - 4 * keyStep); // 2.25u left shift
for (let i = 0; i < 10; i++) createKey(1, 1, mainStartX + 2.25 * keyStep + i * keyStep, mainStartZ - 4 * keyStep);
createKey(2.75, 1, mainStartX + 2.25*keyStep + 10*keyStep + (keyStep*0.875), mainStartZ - 4 * keyStep); // 2.75u right shift

// Row 6 (Bottom control/space row)
createKey(1.25, 1, mainStartX + (keyStep * 0.125), mainStartZ - 5 * keyStep); // 1.25u ctrl
createKey(1.25, 1, mainStartX + 1.25*keyStep + (keyStep * 0.125), mainStartZ - 5 * keyStep); // 1.25u win
createKey(1.25, 1, mainStartX + 2.5*keyStep + (keyStep * 0.125), mainStartZ - 5 * keyStep); // 1.25u alt
createKey(6.25, 1, mainStartX + 3.75*keyStep + (keyStep * 3.125), mainStartZ - 5 * keyStep); // 6.25u spacebar
createKey(1.25, 1, mainStartX + 10*keyStep + (keyStep * 0.125), mainStartZ - 5 * keyStep); // 1.25u alt gr
createKey(1, 1, mainStartX + 11.25*keyStep, mainStartZ - 5 * keyStep); // Fn key
createKey(1, 1, mainStartX + 12.25*keyStep, mainStartZ - 5 * keyStep); // Menu key
createKey(1.25, 1, mainStartX + 13.25*keyStep + (keyStep * 0.125), mainStartZ - 5 * keyStep); // 1.25u right ctrl

// ==================== NUMPAD LAYOUT (RIGHT AREA) ====================
const numpadStartX = 7;       // Leftmost numpad key X position

// Numpad row 1 (top)
for (let i = 0; i < 4; i++) createKey(1, 1, numpadStartX + i * keyStep, mainStartZ);

// Numpad row 2
for (let i = 0; i < 3; i++) createKey(1, 1, numpadStartX + i * keyStep, mainStartZ - keyStep);
createKey(1, 2, numpadStartX + 3 * keyStep, mainStartZ - keyStep - (keyStep/2)); // 2u tall plus key

// Numpad row 3
for (let i = 0; i < 3; i++) createKey(1, 1, numpadStartX + i * keyStep, mainStartZ - 2 * keyStep);

// Numpad row 4
for (let i = 0; i < 3; i++) createKey(1, 1, numpadStartX + i * keyStep, mainStartZ - 3 * keyStep);
createKey(1, 2, numpadStartX + 3 * keyStep, mainStartZ - 3 * keyStep - (keyStep/2)); // 2u tall enter key

// Numpad row 5 (bottom)
createKey(2, 1, numpadStartX + (keyStep/2), mainStartZ - 4 * keyStep); // 2u wide 0 key
createKey(1, 1, numpadStartX + 2 * keyStep, mainStartZ - 4 * keyStep); // . key

// ==================== CAMERA POSITION ====================
camera.position.set(25, 20, 25);
camera.lookAt(0, baseThickness, 0);