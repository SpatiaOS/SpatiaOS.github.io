// Parameters for the keyboard
const U = 1.0; // Base unit size
const KEY_GAP = 0.1;
const CORNER_RADIUS = 0.08;
const KEY_HEIGHT = 0.15;
const BASE_COLOR = 0xcccccc; // Silver aluminum base
const KEY_COLOR = 0xeeeeee;  // White keys

// Materials
const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: BASE_COLOR, 
    metalness: 0.5, 
    roughness: 0.5 
});
const keyMaterial = new THREE.MeshStandardMaterial({ 
    color: KEY_COLOR, 
    metalness: 0.1, 
    roughness: 0.8 
});

// Master group
const keyboard = new THREE.Group();

// --- Geometry Cache for Keys ---
const keyGeometries = {};

function getKeyGeometry(w, d) {
    const keyStr = `${w}_${d}`;
    if (!keyGeometries[keyStr]) {
        const shape = new THREE.Shape();
        const hw = (w - KEY_GAP) / 2;
        const hd = (d - KEY_GAP) / 2;
        const r = CORNER_RADIUS;

        // Draw rounded rectangle centered at origin
        shape.moveTo(-hw + r, -hd);
        shape.lineTo(hw - r, -hd);
        shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
        shape.lineTo(hw, hd - r);
        shape.quadraticCurveTo(hw, hd, hw - r, hd);
        shape.lineTo(-hw + r, hd);
        shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
        shape.lineTo(-hw, -hd + r);
        shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

        const extrudeSettings = {
            depth: KEY_HEIGHT,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.02,
            bevelThickness: 0.04
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Center vertically and lay flat on XZ plane
        geometry.translate(0, 0, -KEY_HEIGHT / 2);
        geometry.rotateX(-Math.PI / 2);
        
        keyGeometries[keyStr] = geometry;
    }
    return keyGeometries[keyStr];
}

// --- Layout Definition ---
// Array format: [x, z, width, depth]
const keysData = [];
let cx = 0;

// 1. Main Block
// Row 0 (Function keys)
cx = 0;
for(let i=0; i<14; i++) { keysData.push([cx, 0, 1, 0.5]); cx += 1; }
// Row 1 (Numbers)
cx = 0;
for(let i=0; i<13; i++) { keysData.push([cx, 0.5, 1, 1]); cx += 1; }
keysData.push([cx, 0.5, 2, 1]); // Backspace
// Row 2 (QWERTY)
cx = 0;
keysData.push([cx, 1.5, 1.5, 1]); cx += 1.5; // Tab
for(let i=0; i<12; i++) { keysData.push([cx, 1.5, 1, 1]); cx += 1; }
keysData.push([cx, 1.5, 1.5, 1]); // \|
// Row 3 (ASDF)
cx = 0;
keysData.push([cx, 2.5, 1.75, 1]); cx += 1.75; // Caps
for(let i=0; i<11; i++) { keysData.push([cx, 2.5, 1, 1]); cx += 1; }
keysData.push([cx, 2.5, 2.25, 1]); // Enter
// Row 4 (ZXCV)
cx = 0;
keysData.push([cx, 3.5, 2.25, 1]); cx += 2.25; // LShift
for(let i=0; i<10; i++) { keysData.push([cx, 3.5, 1, 1]); cx += 1; }
keysData.push([cx, 3.5, 2.75, 1]); // RShift
// Row 5 (Spacebar row)
cx = 0;
[1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25].forEach(w => {
    keysData.push([cx, 4.5, w, 1]); cx += w;
});

// 2. Navigation Block
const navX = 15.5;
for(let i=0; i<3; i++) keysData.push([navX + i, 0, 1, 0.5]);
for(let i=0; i<3; i++) keysData.push([navX + i, 0.5, 1, 1]);
for(let i=0; i<3; i++) keysData.push([navX + i, 1.5, 1, 1]);
// Arrows
keysData.push([navX, 4.5, 1, 1]);       // Left
keysData.push([navX + 1, 4.5, 1, 0.5]); // Up
keysData.push([navX + 1, 5.0, 1, 0.5]); // Down
keysData.push([navX + 2, 4.5, 1, 1]);   // Right

// 3. Numpad Block
const numX = 19.0;
for(let i=0; i<4; i++) keysData.push([numX + i, 0, 1, 0.5]);
for(let i=0; i<4; i++) keysData.push([numX + i, 0.5, 1, 1]);
for(let i=0; i<4; i++) keysData.push([numX + i, 1.5, 1, 1]);
for(let i=0; i<4; i++) keysData.push([numX + i, 2.5, 1, 1]);
for(let i=0; i<4; i++) keysData.push([numX + i, 3.5, 1, 1]);
keysData.push([numX, 4.5, 2, 1]);     // 0
keysData.push([numX + 2, 4.5, 1, 1]); // .
keysData.push([numX + 3, 4.5, 1, 1]); // Enter

// --- Generate Key Meshes ---
keysData.forEach(([x, z, w, d]) => {
    const geom = getKeyGeometry(w, d);
    const mesh = new THREE.Mesh(geom, keyMaterial);
    
    // Position at the center of the grid cell
    mesh.position.set(x + w / 2, KEY_HEIGHT / 2, z + d / 2);
    keyboard.add(mesh);
});

// --- Base Plate & Stand ---
const baseWidth = 23.4;
const baseDepth = 5.9;
const baseThickness = 0.15;

// Main flat plate
const baseGeom = new THREE.BoxGeometry(baseWidth, baseThickness, baseDepth);
const baseMesh = new THREE.Mesh(baseGeom, baseMaterial);
baseMesh.position.set(11.5, -baseThickness / 2, 2.75); // Centered relative to keys
keyboard.add(baseMesh);

// Cylindrical stand/battery compartment at the back
const cylinderGeom = new THREE.CylinderGeometry(0.3, 0.3, baseWidth, 32);
const cylinderMesh = new THREE.Mesh(cylinderGeom, baseMaterial);
cylinderMesh.rotation.z = Math.PI / 2;
cylinderMesh.position.set(11.5, -0.2, -0.1);
keyboard.add(cylinderMesh);

// --- Final Positioning ---
// Center the entire keyboard group in the scene
keyboard.position.set(-11.5, 0, -2.75);

// Add a slight ergonomic tilt
keyboard.rotation.x = 0.08; 

scene.add(keyboard);

// --- Camera Adjustment ---
camera.position.set(18, 16, 20);
camera.lookAt(0, 0, 0);