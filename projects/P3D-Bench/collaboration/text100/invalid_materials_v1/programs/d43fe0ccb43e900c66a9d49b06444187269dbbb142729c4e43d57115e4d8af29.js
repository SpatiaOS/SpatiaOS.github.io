// ====================================================================
// PARAMETRIC CAD MODEL: ELECTRONIC ENCLOSURE / CHASSIS
// Features: Rounded corners, stepped inner rim cavity, multiple wall
// cutouts/recesses at varied heights, bottom pocket, and underside posts.
// ====================================================================

// --- 1. PARAMETRIC DEFINITIONS ---
const outerWidth    = 100.0;  // Total dimension along X
const outerDepth    = 70.0;   // Total dimension along Z
const totalHeight   = 42.0;   // Total body height along Y
const cornerRadius  = 8.0;    // Outer corner curvature radius
const wallThickness = 8.0;    // Nominal wall thickness

// Cavity & Stepped Rim Parameters
const floorHeight   = 8.0;    // Nominal floor thickness from bottom (Y = 0 to 8)
const rimStepWidth  = 3.0;    // Width of horizontal step ledge inside cavity
const rimStepHeight = 4.0;    // Depth from top down to the stepped ledge (Y = 38)
const stepLedgeY    = totalHeight - rimStepHeight; // Y = 38.0

// Wall coordinates partition:
// Corner centers:
const xc = outerWidth / 2.0 - cornerRadius; // 42.0
const zc = outerDepth / 2.0 - cornerRadius; // 27.0

// Bottom Pocket Parameters (removed upward from lower face)
const pocketWidth  = 36.0;    // X-span: -18 to +18
const pocketDepth  = 28.0;    // Z-span: -14 to +14
const pocketHeight = 4.0;     // Removed depth upward into floor (Y = 0 to 4)

// Underside Circular Posts (mounting pads)
const padRadius    = 6.0;
const padHeight    = 4.5;
const padOffsetX   = 28.0;    // Positioned outside bottom pocket at X = ±28

// --- 2. MATERIAL DEFINITION ---
// Uniform precision-machined / anodized aerospace aluminum finish
const cadMaterial = new THREE.MeshStandardMaterial({
    color: 0x487d99,
    metalness: 0.35,
    roughness: 0.32,
    side: THREE.FrontSide
});

// Root group to hold the entire CAD assembly
const chassisGroup = new THREE.Group();

// --- 3. UTILITY FUNCTIONS ---

// Creates an axis-aligned solid box bounded by min/max coordinates
function addBox(minX, maxX, minY, maxY, minZ, maxZ) {
    const w = maxX - minX;
    const h = maxY - minY;
    const d = maxZ - minZ;
    if (w <= 0 || h <= 0 || d <= 0) return null;
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, cadMaterial);
    mesh.position.set(minX + w / 2.0, minY + h / 2.0, minZ + d / 2.0);
    chassisGroup.add(mesh);
    return mesh;
}

// Creates an extruded 90-degree corner pillar (quarter-cylinder)
function createCornerPillar(centerX, centerZ, radius, startAngle, height) {
    const shape = new THREE.Shape();
    shape.moveTo(centerX, centerZ);
    shape.absarc(centerX, centerZ, radius, startAngle, startAngle + Math.PI / 2.0, false);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
        curveSegments: 20
    });

    // Reorient extrusion (along Z) so it aligns vertically along Y
    geom.rotateX(Math.PI / 2.0);
    geom.translate(0, height, 0);

    const mesh = new THREE.Mesh(geom, cadMaterial);
    chassisGroup.add(mesh);
    return mesh;
}

// --- 4. CORNER PILLARS ---
// 4 smooth vertical rounded corners connecting the exterior walls
createCornerPillar( xc,  zc, cornerRadius, 0.0,               totalHeight); // Front-Right
createCornerPillar(-xc,  zc, cornerRadius, Math.PI / 2.0,     totalHeight); // Front-Left
createCornerPillar(-xc, -zc, cornerRadius, Math.PI,           totalHeight); // Back-Left
createCornerPillar( xc, -zc, cornerRadius, Math.PI * 1.5,     totalHeight); // Back-Right

// --- 5. BASE FLOOR WITH UNDER-SIDE RECTANGULAR POCKET ---
// Upper floor plate: continuous floor below the interior cavity
addBox(-xc, xc, pocketHeight, floorHeight, -zc, zc);

// Lower floor sections: surrounds the bottom-side removed pocket (Y = 0 to 4)
const pxHalf = pocketWidth / 2.0;  // 18.0
const pzHalf = pocketDepth / 2.0;  // 14.0

addBox(-xc, -pxHalf, 0.0, pocketHeight, -zc, zc);       // Left of pocket
addBox( pxHalf,  xc, 0.0, pocketHeight, -zc, zc);       // Right of pocket
addBox(-pxHalf, pxHalf, 0.0, pocketHeight,  pzHalf, zc); // Front of pocket
addBox(-pxHalf, pxHalf, 0.0, pocketHeight, -zc, -pzHalf); // Back of pocket
// Space [-18 to 18, 0 to 4, -14 to 14] remains an open upward pocket

// --- 6. BACK WALL (-Z): LONG HORIZONTAL OPENING (LOW ON WALL) ---
// Back Wall bounds: X [-42, 42], Z [-35, -27]. Slot: Y [6, 14], X [-26, 26]
const backSlotY0 = 6.0;
const backSlotY1 = 14.0;
const backSlotX0 = -26.0;
const backSlotX1 = 26.0;

addBox(-xc, xc, 0.0, backSlotY0, -35.0, -27.0);          // Solid base below slot
addBox(-xc, backSlotX0, backSlotY0, backSlotY1, -35.0, -27.0); // Wall left of slot
addBox(backSlotX1, xc, backSlotY0, backSlotY1, -35.0, -27.0);  // Wall right of slot
addBox(-xc, xc, backSlotY1, totalHeight, -35.0, -27.0);  // Solid wall above slot

// --- 7. FRONT WALL (+Z): SHALLOW RECESS AND THROUGH-SLOT OPENING ---
// Front Wall bounds: X [-42, 42], Z [27, 35]
// Feature 1: Left Shallow Recess at X [-32, -10], Y [16, 32], cut 2.5mm deep into outer face
// Feature 2: Right Through-Slot opening at X [10, 30], Y [18, 28]

// Column 1: Far-left solid post
addBox(-xc, -32.0, 0.0, totalHeight, 27.0, 35.0);

// Column 2: Shallow recessed panel
addBox(-32.0, -10.0, 0.0, 16.0, 27.0, 35.0);            // Sub-panel below recess
addBox(-32.0, -10.0, 16.0, 32.0, 27.0, 32.5);           // Recessed web (2.5mm cut)
addBox(-32.0, -10.0, 32.0, totalHeight, 27.0, 35.0);   // Sub-panel above recess

// Column 3: Central divider
addBox(-10.0, 10.0, 0.0, totalHeight, 27.0, 35.0);

// Column 4: Through-slot opening
addBox(10.0, 30.0, 0.0, 18.0, 27.0, 35.0);              // Wall below slot
// (Y: 18 to 28 is left open through the wall)
addBox(10.0, 30.0, 28.0, totalHeight, 27.0, 35.0);      // Wall above slot

// Column 5: Far-right solid post
addBox(30.0, xc, 0.0, totalHeight, 27.0, 35.0);

// --- 8. LEFT WALL (-X): DEEP HIGH-LEVEL RECESS ---
// Left Wall bounds: X [-50, -42], Z [-27, 27]
// Deep cut at Z [-14, 14], Y [26, 36], depth 5.5mm into wall (thin 2.5mm web remains inside)
addBox(-50.0, -42.0, 0.0, totalHeight, -27.0, -14.0);    // Back section
addBox(-50.0, -42.0, 0.0, 26.0, -14.0, 14.0);            // Below deep recess
addBox(-44.5, -42.0, 26.0, 36.0, -14.0, 14.0);           // Thin inner web (deep cut)
addBox(-50.0, -42.0, 36.0, totalHeight, -14.0, 14.0);    // Above deep recess
addBox(-50.0, -42.0, 0.0, totalHeight, 14.0, 27.0);     // Front section

// --- 9. RIGHT WALL (+X): SHALLOW MID-LOW RECESS ---
// Right Wall bounds: X [42, 50], Z [-27, 27]
// Shallow recess at Z [-15, 15], Y [10, 22], depth 2.0mm into outer face
addBox(42.0, 50.0, 0.0, totalHeight, -27.0, -15.0);     // Back section
addBox(42.0, 50.0, 0.0, 10.0, -15.0, 15.0);             // Below shallow recess
addBox(42.0, 48.0, 10.0, 22.0, -15.0, 15.0);            // Recess backplate (2mm cut)
addBox(42.0, 50.0, 22.0, totalHeight, -15.0, 15.0);     // Above shallow recess
addBox(42.0, 50.0, 0.0, totalHeight, 15.0, 27.0);      // Front section

// --- 10. STEPPED INNER RIM LEDGE ---
// Creates a distinct stepped shoulder along the interior rim perimeter
// From floor (Y = 8) up to stepLedgeY (Y = 38). Ledge width is 3.0mm.
const inX = xc - rimStepWidth; // 39.0
const inZ = zc - rimStepWidth; // 24.0

addBox(-inX, inX, floorHeight, stepLedgeY, inZ, zc);      // Front inner step ledge
addBox(-inX, inX, floorHeight, stepLedgeY, -zc, -inZ);    // Back inner step ledge
addBox(-xc, -inX, floorHeight, stepLedgeY, -zc, zc);      // Left inner step ledge
addBox( inX,  xc, floorHeight, stepLedgeY, -zc, zc);      // Right inner step ledge

// --- 11. UNDERSIDE MOUNTING POSTS / CIRCULAR PADS ---
// Pair of solid circular cylindrical pads attached below base (not a rectangular plate)
const padGeom = new THREE.CylinderGeometry(padRadius, padRadius, padHeight, 32);

// Left mounting pad
const padLeft = new THREE.Mesh(padGeom, cadMaterial);
padLeft.position.set(-padOffsetX, -padHeight / 2.0, 0.0);
chassisGroup.add(padLeft);

// Right mounting pad
const padRight = new THREE.Mesh(padGeom, cadMaterial);
padRight.position.set(padOffsetX, -padHeight / 2.0, 0.0);
chassisGroup.add(padRight);

// --- 12. ADD TO SCENE & POSITION CAMERA ---
scene.add(chassisGroup);

// Elevate camera for a clear 3/4 perspective viewing the cavity, step, and exterior cuts
camera.position.set(100.0, 85.0, 115.0);
camera.lookAt(0.0, 16.0, 0.0);
if (controls && controls.target) {
    controls.target.set(0.0, 16.0, 0.0);
}
controls.update();
```