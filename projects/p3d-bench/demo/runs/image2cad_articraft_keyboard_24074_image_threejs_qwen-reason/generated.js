// Parameters
const KEY_SIZE = 1.8;
const KEY_GAP = 0.2;
const KEY_UNIT = KEY_SIZE + KEY_GAP; // 2.0
const KEY_HEIGHT = 0.3; // Thickness of keys
const BASE_THICKNESS = 0.4;
const BASE_COLOR = 0x888888; // Silver/Grey aluminum
const KEY_COLOR = 0x222222; // Dark keys

// Helper to create a rounded keycap
function createKey(widthUnits, heightUnits) {
    // Using a BoxGeometry. To simulate rounded corners slightly, we can use a high segment count or just rely on lighting.
    // Standard BoxGeometry is sufficient for this scale.
    const w = widthUnits * KEY_SIZE + (widthUnits - 1) * KEY_GAP;
    const h = heightUnits * KEY_SIZE + (heightUnits - 1) * KEY_GAP;
    const geometry = new THREE.BoxGeometry(w, KEY_HEIGHT, h);
    
    // Slightly bevel edges visually by using a material that catches light on edges, 
    // or we could use a custom shape, but Box is standard.
    // Let's make the top face slightly smaller to simulate the chiclet slope? 
    // No, simple box is best for performance and clean code.
    
    const material = new THREE.MeshStandardMaterial({ 
        color: KEY_COLOR, 
        roughness: 0.6, 
        metalness: 0.1 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

// Helper to create the base plate
function createBase(width, depth) {
    // Create a rounded rectangle shape for the base
    const shape = new THREE.Shape();
    const radius = 1.5;
    const x = -width / 2;
    const y = -depth / 2;
    const w = width;
    const h = depth;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + w - radius, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + radius);
    shape.lineTo(x + w, y + h - radius);
    shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    shape.lineTo(x + radius, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
        steps: 1,
        depth: BASE_THICKNESS,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry
    geometry.center();
    
    // Rotate so it lies flat on XZ plane (Extrude creates along Z usually, need to rotate X -90)
    // Actually ExtrudeGeometry extrudes along Z. We want flat on XZ, so we rotate X by -90 deg.
    // But wait, standard orientation: Y is up.
    // If I extrude along Z, the face is XY. I want the face to be XZ (flat on ground).
    // So I need to rotate the mesh -90 deg around X.
    
    const material = new THREE.MeshStandardMaterial({ 
        color: BASE_COLOR, 
        roughness: 0.3, 
        metalness: 0.6 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    return mesh;
}

// --- Layout Definition ---
// We will define rows of keys. 
// Each row is an array of objects: { type: 'key', w: width_in_units, h: height_in_units (usually 1) }
// Or just width, assuming height 1.

const rows = [];

// Row 0: Function Row
// Esc, gap, F1-F4, gap, F5-F8, gap, F9-F12
// Approximate widths: Esc(1), F1(1)...
// Let's simplify: 12 F-keys + Esc + Delete? No, Delete is usually on number row on Mac keyboards.
// Image looks like Apple Magic Keyboard with Numeric Keypad.
// Row 0: Esc(1), F1(1), F2(1), F3(1), F4(1), F5(1), F6(1), F7(1), F8(1), F9(1), F10(1), F11(1), F12(1).
// Wait, usually there are gaps.
// Let's just place them sequentially for now, maybe add gaps by using width 0 or spacing logic.
// Actually, let's just define a grid.

// Let's build the layout manually based on visual estimation of the image.
// The image shows a compact layout.

// Row 1 (Top): Esc, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12
// (Skipping gaps for simplicity, or adding them as spacers)
rows.push([
    { w: 1 }, { w: 1 }, { w: 1 }, { w: 1 }, { w: 1 }, // Esc + F1-4 (Wait, Esc is usually separate)
    // Let's restart row definition to be more precise.
]);

// Let's use a coordinate system approach.
// x starts from left.
const keysToPlace = [];

// Helper to add a key definition
// r: row index (0 is top), c: column index (0 is left)
// w, h: size in units
function addKey(r, c, w = 1, h = 1) {
    keysToPlace.push({ r, c, w, h });
}

// --- Row 0: Function Keys ---
// Esc
addKey(0, 0, 1); 
// Gap
// F1-F4
addKey(0, 2, 1); addKey(0, 3, 1); addKey(0, 4, 1); addKey(0, 5, 1);
// Gap
// F5-F8
addKey(0, 7, 1); addKey(0, 8, 1); addKey(0, 9, 1); addKey(0, 10, 1);
// Gap
// F9-F12
addKey(0, 12, 1); addKey(0, 13, 1); addKey(0, 14, 1); addKey(0, 15, 1);
// Note: On Mac keyboards, F-keys are often half height or same height. Here they look same height.

// --- Row 1: Number Row ---
// ` ~
addKey(1, 0, 1);
// 1-0
for (let i = 0; i < 10; i++) addKey(1, 1 + i, 1);
// - =
addKey(1, 11, 1); addKey(1, 12, 1);
// Delete (Backspace) - usually wider
addKey(1, 13, 2); 

// --- Row 2: Tab Row ---
// Tab
addKey(2, 0, 1.5);
// Q-P
const q_row_keys = ['Q','W','E','R','T','Y','U','I','O','P'];
for (let i = 0; i < 10; i++) addKey(2, 1.5 + i, 1);
// [ ]
addKey(2, 11.5, 1); addKey(2, 12.5, 1);
// \ (Backslash)
addKey(2, 13.5, 1.5);

// --- Row 3: Caps Row ---
// Caps Lock
addKey(3, 0, 1.75);
// A-L
for (let i = 0; i < 9; i++) addKey(3, 1.75 + i, 1);
// ; '
addKey(3, 10.75, 1); addKey(3, 11.75, 1);
// Enter
addKey(3, 12.75, 2.25); // Enter is tall/wide

// --- Row 4: Shift Row ---
// Left Shift
addKey(4, 0, 2.25);
// Z-M
for (let i = 0; i < 7; i++) addKey(4, 2.25 + i, 1);
// , . /
addKey(4, 9.25, 1); addKey(4, 10.25, 1); addKey(4, 11.25, 1);
// Right Shift
addKey(4, 12.25, 2.75);

// --- Row 5: Bottom Row (Main block) ---
// Ctrl, Alt/Option, Cmd, Space
addKey(5, 0, 1); // Ctrl
addKey(5, 1, 1); // Alt
addKey(5, 2, 1); // Cmd
addKey(5, 3, 6); // Spacebar
addKey(5, 9, 1); // Cmd
addKey(5, 10, 1); // Alt
// Arrows (Inverted T usually, but here compact)
// Left, Down, Up, Right
// Looking at image, there are arrow keys next to the spacebar area?
// Actually, looking at the right side of the main block, there are arrow keys.
// Let's assume standard compact layout: Left, Down/Up, Right.
addKey(5, 11, 1); // Left
addKey(5, 12, 1); // Down (and Up stacked? No, usually separate rows or compact).
// Let's look at the image again.
// The image shows a Numpad on the right.
// The main block ends with arrow keys.
// Let's assume: Left(1), Down(1), Up(1), Right(1) are in the bottom right corner of the main block.
// But row 5 is the bottom row.
// Usually: Ctrl, Alt, Cmd, Space, Cmd, Alt, Left, Down, Up, Right.
// Let's place:
addKey(5, 11, 1); // Left
// Down/Up are often shifted up or in same row.
// Let's assume a compact cluster: Left, Down, Up, Right.
// In the image, the bottom right of the main block has keys.
// Let's just fill the row.
addKey(5, 12, 1); // Down
addKey(5, 13, 1); // Up (This would overlap if same row. Usually Up is row 4 bottom?)
// Let's simplify: Just put Left, Down, Up, Right in a block.
// For this code, I'll place them in row 5 and maybe row 4 bottom right?
// No, let's look at the "Apple Magic Keyboard with Numeric Keypad".
// It has: Ctrl, Option, Cmd, Space, Cmd, Option, Left, Down, Up, Right.
// Wait, Down and Up are usually stacked.
// Let's assume:
// Row 5: ... Space ... Left, Down, Right.
// Row 4 (bottom part): ... Shift ... Up.
// This is getting too detailed. I will approximate the bottom right of the main block.
// Let's assume: Left, Down, Up, Right are in a 2x2 block (roughly).
// I'll add them at specific coordinates.
// Left: r=5, c=11
// Down: r=5, c=12
// Up: r=4, c=12 (Shifted up) -> Wait, row 4 has Right Shift.
// Okay, let's look at the image really closely.
// The main block has 6 rows.
// Row 5 (bottom): Ctrl, Alt, Cmd, Space, Cmd, Alt, Left, Down, Up, Right? No.
// Standard Mac layout:
// Row 5: Ctrl, Opt, Cmd, Space, Cmd, Opt, Left, Down, Up, Right.
// Actually, Down and Up are often in the same row as Left/Right on compact keyboards? No.
// On Apple Magic Keyboard:
// Bottom row: Ctrl, Opt, Cmd, Space, Cmd, Opt, Left, Down, Up, Right.
// Wait, Down and Up are usually above Right? Or Left/Right are bottom, Up/Down are above?
// On the image, it looks like: Left, Down, Up, Right are in the bottom right corner.
// Let's assume:
// Row 5: ... Space ... Left(1), Down(1), Right(1).
// Row 4 (end): ... Shift ... Up(1).
// This fits the "Inverted T" shape.
// So, addKey(4, 12, 1) for Up? But row 4 has Right Shift.
// Right Shift is usually shorter on these keyboards to make room for Up arrow?
// Yes! On Apple keyboards, Right Shift is shorter.
// So Row 4: Shift(2.25), Z... /, Shift(1.25), Up(1).
// Row 5: ... Space ... Left(1), Down(1), Right(1).
// Let's adjust Row 4 and 5.

// Revised Row 4:
// Left Shift (2.25), Z(1)... /(1), Right Shift (1.25), Up Arrow (1).
// Revised Row 5:
// Ctrl(1), Alt(1), Cmd(1), Space(6), Cmd(1), Alt(1), Left(1), Down(1), Right(1).
// Wait, Down is usually between Left and Right? Or Left, Down, Right?
// Standard: Left, Down, Right. Up is above Down.
// So Row 5: ... Left, Down, Right.
// Row 4: ... Up.

// Let's re-define Row 4 and 5 based on this.
// Clear previous Row 4 and 5 additions? No, I haven't added them to the array yet, just planned.
// I need to remove the previous "Row 4" and "Row 5" logic and replace.

// --- Row 4 Revised ---
// Left Shift
// (Remove previous addKey(4,0...)) -> I will just overwrite the logic in the final list generation.
// I'll create a clean list.

const finalKeys = [];
function add(r, c, w=1, h=1) { finalKeys.push({r, c, w, h}); }

// Row 0
add(0, 0, 1); // Esc
add(0, 2, 1); add(0, 3, 1); add(0, 4, 1); add(0, 5, 1); // F1-4
add(0, 7, 1); add(0, 8, 1); add(0, 9, 1); add(0, 10, 1); // F5-8
add(0, 12, 1); add(0, 13, 1); add(0, 14, 1); add(0, 15, 1); // F9-12

// Row 1
add(1, 0, 1); // `
for(let i=0; i<10; i++) add(1, 1+i, 1); // 1-0
add(1, 11, 1); add(1, 12, 1); // - =
add(1, 13, 2); // Delete

// Row 2
add(2, 0, 1.5); // Tab
for(let i=0; i<10; i++) add(2, 1.5+i, 1); // Q-P
add(2, 11.5, 1); add(2, 12.5, 1); // [ ]
add(2, 13.5, 1.5); // \

// Row 3
add(3, 0, 1.75); // Caps
for(let i=0; i<9; i++) add(3, 1.75+i, 1); // A-L
add(3, 10.75, 1); add(3, 11.75, 1); // ; '
add(3, 12.75, 2.25); // Enter

// Row 4 (Shift row + Up arrow)
add(4, 0, 2.25); // L-Shift
for(let i=0; i<7; i++) add(4, 2.25+i, 1); // Z-M
add(4, 9.25, 1); add(4, 10.25, 1); add(4, 11.25, 1); // , . /
add(4, 12.25, 1.25); // R-Shift (shortened)
add(4, 13.5, 1); // Up Arrow

// Row 5 (Bottom row + Left/Down/Right)
add(5, 0, 1); // Ctrl
add(5, 1, 1); // Alt
add(5, 2, 1); // Cmd
add(5, 3, 6); // Space
add(5, 9, 1); // Cmd
add(5, 10, 1); // Alt
add(5, 11, 1); // Left
add(5, 12, 1); // Down
add(5, 13, 1); // Right

// --- Numpad ---
// The numpad is to the right of the main block.
// Main block ends at approx x=15 (13.5 + 1.5 for backslash).
// Numpad starts around x=16 or 17.
// Let's say Numpad starts at col 17.
// Numpad Layout:
// Row 0: (Empty or F-keys extended? No, usually separate).
// On Apple Magic Keyboard with Numpad:
// The numpad aligns with the main rows.
// Row 1 (aligns with Number row): Num Lock, /, *, -
// Row 2 (aligns with Tab row): 7, 8, 9, + (tall)
// Row 3 (aligns with Caps row): 4, 5, 6, + (cont)
// Row 4 (aligns with Shift row): 1, 2, 3, Enter (tall)
// Row 5 (aligns with Bottom row): 0 (wide), ., Enter (cont)

// Let's map Numpad columns starting at c=17.
// Row 1 (Index 1 in my rows, which is Number row)
add(1, 17, 1); // Num Lock
add(1, 18, 1); // /
add(1, 19, 1); // *
add(1, 20, 1); // -

// Row 2 (Index 2)
add(2, 17, 1); // 7
add(2, 18, 1); // 8
add(2, 19, 1); // 9
add(2, 20, 1, 2); // + (Tall, spans row 2 and 3) -> h=2

// Row 3 (Index 3)
add(3, 17, 1); // 4
add(3, 18, 1); // 5
add(3, 19, 1); // 6
// + is handled above

// Row 4 (Index 4)
add(4, 17, 1); // 1
add(4, 18, 1); // 2
add(4, 19, 1); // 3
add(4, 20, 1, 2); // Enter (Tall, spans row 4 and 5) -> h=2

// Row 5 (Index 5)
add(5, 17, 2); // 0 (Wide)
add(5, 19, 1); // .
// Enter is handled above

// --- Build Scene ---

// Calculate total dimensions to center everything
// Max Col: 20 (Numpad + Enter). Width ~ 21 units.
// Max Row: 5. Depth ~ 6 units.
const totalWidthUnits = 22;
const totalDepthUnits = 6;

// Create Base
// Width in world units: totalWidthUnits * KEY_UNIT
// Depth in world units: totalDepthUnits * KEY_UNIT
const baseWidth = totalWidthUnits * KEY_UNIT + 2; // Extra margin
const baseDepth = totalDepthUnits * KEY_UNIT + 2;
const baseMesh = createBase(baseWidth, baseDepth);
scene.add(baseMesh);

// Create Keys
const keyboardGroup = new THREE.Group();

// Offset to center the keyboard on the base
// Base is centered at 0,0.
// Keys need to be centered.
// My grid starts at c=0, r=0.
// Center of grid:
// X center: (max_c + min_c) / 2 * KEY_UNIT. 
// Max c is roughly 20. Min c is 0. Center c ~ 10.
// Z center: (max_r + min_r) / 2 * KEY_UNIT.
// Max r is 5. Min r is 0. Center r ~ 2.5.

const offsetX = - (10 * KEY_UNIT); 
const offsetZ = - (2.5 * KEY_UNIT);
const yPos = BASE_THICKNESS / 2 + KEY_HEIGHT / 2 + 0.05; // Sit on top of base

finalKeys.forEach(k => {
    const mesh = createKey(k.w, k.h);
    
    // Position
    // x = c * KEY_UNIT + offsetX
    // z = r * KEY_UNIT + offsetZ
    // But wait, my 'c' values are floats (e.g., 1.5).
    // So x = k.c * KEY_UNIT + offsetX
    // z = k.r * KEY_UNIT + offsetZ
    
    // Refine offsets to center visually
    // The numpad goes up to col 20 (width 1) or 21 (width 2 for 0).
    // Let's say max extent is col 21.
    // Center X should be around 10.5.
    // So offsetX = -10.5 * KEY_UNIT.
    
    // Max extent Z is row 5.
    // Center Z should be around 2.5.
    // So offsetZ = -2.5 * KEY_UNIT.
    
    mesh.position.x = k.c * KEY_UNIT - (11 * KEY_UNIT); // Approx centering
    mesh.position.z = k.r * KEY_UNIT - (2.5 * KEY_UNIT);
    mesh.position.y = yPos;
    
    keyboardGroup.add(mesh);
});

scene.add(keyboardGroup);

// Adjust Camera
camera.position.set(0, 25, 25);
camera.lookAt(0, 0, 0);