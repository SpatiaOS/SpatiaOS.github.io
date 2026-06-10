// Parameters
const kbWidth = 34;          // Overall keyboard width
const kbDepth = 12;          // Overall keyboard depth (front-to-back)
const kbThickness = 0.35;    // Thickness of the base chassis
const unit = 1.55;           // Center-to-center key spacing (1u)
const keyGap = 0.15;         // Visual gap between adjacent key caps
const keySize = unit - keyGap; // 1u key cap width/depth (square chiclet style)
const keyHeight = 0.25;      // Height of each key

// Materials
const baseMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  roughness: 0.3,
  metalness: 0.7
});
const keyMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.4,
  metalness: 0.1
});

// --- Base with front lip ---
// The image shows a thin chassis with a subtle downward-curving lip at the front edge.
// We model this by extruding a profile that has a small forward/downward quadratic curve
// at the front (x = kbDepth) while the rear remains a simple rectangle.
const profile = new THREE.Shape();
profile.moveTo(0, kbThickness);                    // rear top
profile.lineTo(kbDepth, kbThickness);              // top surface to front
profile.lineTo(kbDepth, 0.2);                      // front face down to lip start
profile.quadraticCurveTo(kbDepth + 0.15, 0.2, kbDepth + 0.15, 0); // lip curls down & slightly forward
profile.lineTo(0, 0);                              // bottom surface back to rear
profile.closePath();

const baseGeom = new THREE.ExtrudeGeometry(profile, {
  depth: kbWidth,
  bevelEnabled: false
});
const baseMesh = new THREE.Mesh(baseGeom, baseMaterial);
// ExtrudeGeometry extrudes along +Z. Rotate so extrusion runs along world X
// and the profile's X (depth) runs along world Z.
baseMesh.rotation.y = -Math.PI / 2;
baseMesh.position.set(kbWidth / 2, 0, -kbDepth / 2);
scene.add(baseMesh);

// --- Keys ---
const keysGroup = new THREE.Group();

function addKey(w, d, cx, cz) {
  const geom = new THREE.BoxGeometry(w, keyHeight, d);
  const mesh = new THREE.Mesh(geom, keyMaterial);
  // Sit flush on top of the base
  mesh.position.set(cx, kbThickness + keyHeight / 2, cz);
  keysGroup.add(mesh);
}

// Row definitions: each row has a Z position and an array of key widths in "units".
// The layout approximates a compact low-profile keyboard (similar to an Apple-style
// chiclet board) with staggered wide keys for Backspace, Tab, Caps, Shift, etc.
const rows = [
  { z: -3.875, keys: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] },                 // 15u  Function/Top
  { z: -2.325, keys: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2] },                 // 15u  Number (2u Backspace)
  { z: -0.775, keys: [1.5,1,1,1,1,1,1,1,1,1,1,1,1,1,1.5] },             // 15u  QWERTY (1.5u Tab/\)
  { z:  0.775, keys: [1.75,1,1,1,1,1,1,1,1,1,1,1,1,2.25] },             // 15u  ASDF (1.75u Caps, 2.25u Enter)
  { z:  2.325, keys: [2.25,1,1,1,1,1,1,1,1,1,1,1,2.75] },               // 15u  ZXCV (2.25u / 2.75u Shifts)
  { z:  3.875, keys: [1.25,1.25,1.25,1.25,6.25,1.25,1.25,1.25] }        // 15u  Bottom row + Space
];

let maxX = 0;

// Place the main alphanumeric block
rows.forEach(row => {
  let x = 0;
  row.keys.forEach(ku => {
    const w = ku * unit - keyGap;   // actual cap width for this key
    const cx = x + (ku * unit) / 2; // center X in local row coordinates
    addKey(w, keySize, cx, row.z);
    x += ku * unit;
  });
  if (x > maxX) maxX = x; // track rightmost edge of the main block
});

// Arrow cluster (inverted T) positioned to the right of the main block
const arrowX = maxX + unit * 0.6; // small gap before arrow keys
addKey(keySize, keySize, arrowX + 0 * unit, 3.875);        // Left
addKey(keySize, keySize, arrowX + 1 * unit, 3.875);        // Down
addKey(keySize, keySize, arrowX + 2 * unit, 3.875);        // Right
addKey(keySize, keySize, arrowX + 1 * unit, 3.875 - unit); // Up (above Down)

const arrowRightEdge = arrowX + 2 * unit + keySize / 2;
const totalKeySpan = Math.max(maxX, arrowRightEdge);

// Center the entire key set over the base
keysGroup.position.x = -totalKeySpan / 2;
scene.add(keysGroup);

// Camera positioned for an isometric-style view matching the reference image
camera.position.set(28, 24, 28);
camera.lookAt(0, 0, 0);