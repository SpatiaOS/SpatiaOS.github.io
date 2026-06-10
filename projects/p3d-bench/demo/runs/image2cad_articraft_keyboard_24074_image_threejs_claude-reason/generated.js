// Slim Apple-style full-size keyboard with numeric keypad
// All dimensions in centimeters

// === PARAMETERS ===
const W = 42;           // Total keyboard width
const D = 11.5;         // Total keyboard depth
const H = 0.45;         // Body thickness
const R = 0.5;          // Body corner radius
const U = 1.8;          // Key pitch (18mm)
const G = 0.22;         // Gap between key edges
const KH = 0.12;        // Key cap protrusion height
const ML = 0.5;         // Left margin
const MT = 0.35;        // Back margin

// Key section column starts (in key units)
const NAV = 15.15;      // Navigation cluster
const NUM = 18.8;       // Numeric keypad

// === MATERIALS ===
const matBody = new THREE.MeshStandardMaterial({
    color: 0xc5c5c5, metalness: 0.7, roughness: 0.2
});
const matKeyBed = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a, metalness: 0.05, roughness: 0.95
});
const matKey = new THREE.MeshStandardMaterial({
    color: 0xb3b3b3, metalness: 0.2, roughness: 0.45
});

// === KEYBOARD BODY (rounded rectangle, extruded) ===
const bodyShape = new THREE.Shape();
const hw = W / 2, hd = D / 2;
bodyShape.moveTo(-hw + R, -hd);
bodyShape.lineTo(hw - R, -hd);
bodyShape.quadraticCurveTo(hw, -hd, hw, -hd + R);
bodyShape.lineTo(hw, hd - R);
bodyShape.quadraticCurveTo(hw, hd, hw - R, hd);
bodyShape.lineTo(-hw + R, hd);
bodyShape.quadraticCurveTo(-hw, hd, -hw, hd - R);
bodyShape.lineTo(-hw, -hd + R);
bodyShape.quadraticCurveTo(-hw, -hd, -hw + R, -hd);

const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: H,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.12,
    bevelSegments: 4
});
const body = new THREE.Mesh(bodyGeo, matBody);
body.rotation.x = -Math.PI / 2;
scene.add(body);

// Surface Y level
const SY = H + 0.06;

// === KEY GRID ORIGIN ===
const ox = -W / 2 + ML;
const oz = D / 2 - MT;

// === DARK KEY BED (recessed area under keys) ===
function addBed(col, row, wu, hu) {
    const w = wu * U + G * 0.5;
    const d = hu * U + G * 0.5;
    const cx = ox + col * U + (wu * U) / 2;
    const cz = oz - row * U - (hu * U) / 2;
    const geo = new THREE.BoxGeometry(w, 0.015, d);
    const mesh = new THREE.Mesh(geo, matKeyBed);
    mesh.position.set(cx, SY + 0.004, cz);
    scene.add(mesh);
}

// Main section bed
addBed(-0.06, -0.06, 14.62, 6.12);
// Nav cluster bed (rows 1-2)
addBed(NAV - 0.06, 0.94, 3.12, 2.12);
// Nav arrows bed (rows 4-5)
addBed(NAV - 0.06, 3.94, 3.12, 2.12);
// Numpad bed
addBed(NUM - 0.06, -0.06, 4.12, 6.12);

// === KEY PLACEMENT FUNCTIONS ===
function addKey(col, row, wu, hu) {
    wu = wu || 1;
    hu = hu || 1;
    const w = wu * U - G;
    const d = hu * U - G;
    const cx = ox + col * U + (wu * U) / 2;
    const cz = oz - row * U - (hu * U) / 2;
    const geo = new THREE.BoxGeometry(w, KH, d);
    const mesh = new THREE.Mesh(geo, matKey);
    mesh.position.set(cx, SY + 0.01 + KH / 2, cz);
    scene.add(mesh);
}

function keyRow(row, startCol, widths) {
    let col = startCol;
    for (const w of widths) {
        addKey(col, row, w, 1);
        col += w;
    }
}

// === KEYBOARD LAYOUT ===

// --- Row 0: Function keys ---
// Main: Esc + F1-F12 + extra = 14 keys × 1U
keyRow(0, 0, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
// Above numpad: F13-F16
keyRow(0, NUM, [1, 1, 1, 1]);

// --- Row 1: Number row ---
// backtick + 1-0 + - + = + delete(1.5U) = 14.5U
keyRow(1, 0, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5]);
// Nav: Insert, Home, PageUp
keyRow(1, NAV, [1, 1, 1]);
// Numpad: Clear, =, /, *
keyRow(1, NUM, [1, 1, 1, 1]);

// --- Row 2: QWERTY row ---
// Tab(1.5U) + Q W E R T Y U I O P [ ] (12) + \(1U) = 14.5U
keyRow(2, 0, [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
// Nav: Delete, End, PageDown
keyRow(2, NAV, [1, 1, 1]);
// Numpad: 7, 8, 9, -
keyRow(2, NUM, [1, 1, 1, 1]);

// --- Row 3: Home row ---
// Caps(1.75U) + A-' (11 keys) + Return(1.75U) = 14.5U
keyRow(3, 0, [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75]);
// Numpad: 4, 5, 6, +
keyRow(3, NUM, [1, 1, 1, 1]);

// --- Row 4: Shift row ---
// LShift(2.25U) + Z-/ (10 keys) + RShift(2.25U) = 14.5U
keyRow(4, 0, [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25]);
// Up arrow (centered in nav section)
addKey(NAV + 1, 4, 1, 1);
// Numpad: 1, 2, 3
keyRow(4, NUM, [1, 1, 1]);
// Numpad Enter (tall key spanning rows 4-5)
addKey(NUM + 3, 4, 1, 2);

// --- Row 5: Bottom row ---
// Fn + Ctrl + Opt + Cmd + Space + Cmd + Opt
keyRow(5, 0, [1.25, 1.25, 1.25, 1.5, 6.25, 1.5, 1.25]);
// Arrow keys: Left, Down, Right
keyRow(5, NAV, [1, 1, 1]);
// Numpad: 0 (2U wide), decimal point
addKey(NUM, 5, 2, 1);
addKey(NUM + 2, 5, 1, 1);

// === THIN BOTTOM EDGE PLATE (slight wedge visual) ===
const edgeShape = new THREE.Shape();
const ew = W / 2 - 0.15, ed = D / 2 - 0.15;
edgeShape.moveTo(-ew + R, -ed);
edgeShape.lineTo(ew - R, -ed);
edgeShape.quadraticCurveTo(ew, -ed, ew, -ed + R);
edgeShape.lineTo(ew, ed - R);
edgeShape.quadraticCurveTo(ew, ed, ew - R, ed);
edgeShape.lineTo(-ew + R, ed);
edgeShape.quadraticCurveTo(-ew, ed, -ew, ed - R);
edgeShape.lineTo(-ew, -ed + R);
edgeShape.quadraticCurveTo(-ew, -ed, -ew + R, -ed);

const edgeGeo = new THREE.ExtrudeGeometry(edgeShape, {
    depth: 0.08,
    bevelEnabled: false
});
const edgeMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, metalness: 0.6, roughness: 0.3
});
const edge = new THREE.Mesh(edgeGeo, edgeMat);
edge.rotation.x = -Math.PI / 2;
edge.position.y = -0.08;
scene.add(edge);

// === USB-C PORT (back edge, left of center) ===
const portGeo = new THREE.BoxGeometry(0.9, 0.25, 0.4);
const portMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5, roughness: 0.4 });
const port = new THREE.Mesh(portGeo, portMat);
port.position.set(-W / 4, SY / 2, D / 2);
scene.add(port);

// === CAMERA ===
camera.position.set(32, 20, 28);
camera.lookAt(0, 0, 0);