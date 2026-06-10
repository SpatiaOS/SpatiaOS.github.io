// Parameters
const width = 10;       // X dimension (Short side with doors)
const length = 16;      // Z dimension (Long side)
const wallHeight = 8;   // Height of the walls
const roofHeight = 4;   // Height of the roof peak above walls
const studSpacing = 2;  // Spacing between studs
const beamThick = 0.3;  // Thickness of plates and beams
const studThick = 0.2;  // Thickness of studs
const doorWidth = 3.6;  // Total width of double doors
const doorHeight = 6;   // Height of doors

// Material - Greyish to match the CAD style
const material = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, 
    roughness: 0.8,
    metalness: 0.1
});

// Helper function to create a box mesh
function createBox(w, h, d, x, y, z) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
}

// 1. Base Frame (Bottom Plates)
// Front (Z=0)
createBox(width, beamThick, beamThick, width / 2, 0, 0);
// Back (Z=length)
createBox(width, beamThick, beamThick, width / 2, 0, length);
// Left (X=0)
createBox(beamThick, beamThick, length, 0, 0, length / 2);
// Right (X=width)
createBox(beamThick, beamThick, length, width, 0, length / 2);

// 2. Walls

// Helper to add vertical studs along an axis
function addWallStuds(start, end, axis, fixedVal, height, spacing, skipStart, skipEnd) {
    const count = Math.floor((end - start) / spacing);
    for (let i = 0; i <= count; i++) {
        let pos = start + i * spacing;
        // Skip if in skip range (for doors)
        if (skipStart !== undefined && pos > skipStart && pos < skipEnd) continue;
        
        // Adjust for exact endpoints
        if (i === 0) pos = start;
        if (i === count) pos = end;

        if (axis === 'x') {
            createBox(studThick, height, studThick, pos, height / 2, fixedVal);
        } else {
            createBox(studThick, height, studThick, fixedVal, height / 2, pos);
        }
    }
}

// Back Wall (Z = length) - Full studs
addWallStuds(0, width, 'x', length, wallHeight, studSpacing);

// Right Wall (X = width) - Full studs
addWallStuds(0, length, 'z', width, wallHeight, studSpacing);

// Left Wall (X = 0) - Full studs
addWallStuds(0, length, 'z', 0, wallHeight, studSpacing);

// Front Wall (Z = 0) - With Doors
// Doors are roughly centered, maybe slightly left.
// Let's say doors are from x=3 to x=6.6 (width 3.6).
const doorStartX = (width - doorWidth) / 2 - 1; // Offset left
const doorEndX = doorStartX + doorWidth;

// Studs for front wall, skipping door area
addWallStuds(0, width, 'x', 0, wallHeight, studSpacing, doorStartX, doorEndX);

// Door Header (Beam above doors)
createBox(doorWidth, beamThick, studThick, (doorStartX + doorEndX) / 2, wallHeight, 0);

// Gable Studs (Front Face - Triangle above wall)
// Slope m = roofHeight / (width/2)
const slope = roofHeight / (width / 2);
// Add studs in the gable area (above wallHeight)
// We iterate x from 0 to width
for (let x = 0; x <= width; x += studSpacing) {
    // Calculate height of roof at this x
    // Peak is at width/2
    let distFromCenter = Math.abs(x - width / 2);
    let roofY = wallHeight + roofHeight - (slope * distFromCenter);
    
    // Only add if above wall height
    if (roofY > wallHeight + beamThick) {
        let studH = roofY - wallHeight;
        // Don't put studs inside the door area if it's low, but doors are lower than gable usually.
        // Actually, doors are 6ft high, wall is 8ft high. So doors are fully below the gable.
        // So we just need to skip the door opening horizontally? 
        // The header is at wallHeight. The gable is above wallHeight.
        // So we add studs above the header.
        // But we shouldn't add studs *inside* the door width if the header supports the gable.
        // The header supports the gable studs above it.
        // So we add studs above the header, but only where there is structure.
        // Actually, standard framing: Header supports the load. Gable studs sit on the header.
        // So we add studs from x=doorStartX to x=doorEndX? No, that's the opening.
        // We add studs on the sides of the door, going up into the gable.
        // And we add studs above the header? Yes, "cripple studs".
        
        // Let's just add studs everywhere above wallHeight, except we need to be careful with the door opening.
        // The door opening is below wallHeight (doorHeight=6, wallHeight=8).
        // So the header is at y=6? No, usually header is at top of door.
        // Let's assume the "Front Wall" studs go up to wallHeight (8).
        // The door is 6ft high. So there is a header at y=6.
        // And studs above the header up to y=8.
        
        // Let's simplify: The image shows studs going all the way up the gable.
        // And the doors are in the lower part.
        // So I need:
        // 1. Studs from y=0 to y=wallHeight (skipping door area).
        // 2. Door Header at y=doorHeight.
        // 3. Studs from y=doorHeight to y=wallHeight (above door).
        // 4. Gable studs from y=wallHeight to y=roofSlope.
        
        // I already added studs from 0 to wallHeight skipping the door area.
        // I need to add studs above the door header up to the wall top plate.
        if (x > doorStartX && x < doorEndX) {
             // Cripple studs above door
             let h = wallHeight - doorHeight;
             createBox(studThick, h, studThick, x, doorHeight + h/2, 0);
        }
        
        // Gable studs (above wallHeight)
        // These sit on the top plate (y=wallHeight)
        let gableH = roofY - wallHeight;
        if (gableH > 0.5) { // Minimum height
             createBox(studThick, gableH, studThick, x, wallHeight + gableH/2, 0);
        }
    }
}
// Note: The loop above for Front Wall studs was incomplete in logic. 
// Let's redo Front Wall logic cleanly.

// Clear previous Front Wall logic and do it properly
// Remove the previous addWallStuds call for Front Wall and the loop.
// I will just write the specific code for Front Wall here.

// Front Wall Studs (Below Top Plate)
// Left of door
for (let x = 0; x <= doorStartX; x += studSpacing) {
    createBox(studThick, wallHeight, studThick, x, wallHeight / 2, 0);
}
// Right of door
for (let x = doorEndX; x <= width; x += studSpacing) {
    createBox(studThick, wallHeight, studThick, x, wallHeight / 2, 0);
}
// Above Door (Cripple studs)
for (let x = doorStartX + studSpacing; x < doorEndX; x += studSpacing) {
    let h = wallHeight - doorHeight;
    createBox(studThick, h, studThick, x, doorHeight + h / 2, 0);
}
// Door Header
createBox(doorWidth, beamThick, studThick, (doorStartX + doorEndX) / 2, doorHeight, 0);

// 3. Top Plates (Perimeter at wallHeight)
createBox(width, beamThick, beamThick, width / 2, wallHeight, 0); // Front
createBox(width, beamThick, beamThick, width / 2, wallHeight, length); // Back
createBox(beamThick, beamThick, length, 0, wallHeight, length / 2); // Left
createBox(beamThick, beamThick, length, width, wallHeight, length / 2); // Right

// 4. Doors
const doorThick = 0.2;
// Left Door
createBox(doorWidth / 2 - 0.1, doorHeight, doorThick, doorStartX + (doorWidth / 2 - 0.1) / 2, doorHeight / 2, -beamThick/2 - doorThick/2); // Slightly offset Z
// Actually, doors are usually flush with outside or inside. Let's put them at Z=0 (slightly outside).
createBox(doorWidth / 2 - 0.1, doorHeight, doorThick, doorStartX + (doorWidth / 4 - 0.05), doorHeight / 2, -beamThick/2); 
// Wait, door width is 3.6. Half is 1.8.
// Left door center: doorStartX + 0.9.
createBox(1.8 - 0.1, doorHeight, doorThick, doorStartX + 0.9, doorHeight / 2, -0.2);

// Right Door
createBox(1.8 - 0.1, doorHeight, doorThick, doorEndX - 0.9, doorHeight / 2, -0.2);

// Hinges (Small boxes)
function addHinges(x, yBase, isLeftDoor) {
    const hingeW = 0.1; const hingeH = 0.4; const hingeD = 0.1;
    const hingeX = isLeftDoor ? x - 0.9 : x + 0.9; // Outer edge
    // 3 hinges
    createBox(hingeW, hingeH, hingeD, hingeX, yBase + 1, -0.25);
    createBox(hingeW, hingeH, hingeD, hingeX, yBase + doorHeight / 2, -0.25);
    createBox(hingeW, hingeH, hingeD, hingeX, yBase + doorHeight - 1, -0.25);
}
// Add hinges to the doors
// Left door outer edge is at doorStartX
addHinges(doorStartX + 0.9, 0, true); // Hinges on left side of left door
// Right door outer edge is at doorEndX
addHinges(doorEndX - 0.9, 0, false); // Hinges on right side of right door


// 5. Roof Structure

// Rafters
const rafterSpacing = 2;
const rafterCount = Math.floor(length / rafterSpacing);
const halfWidth = width / 2;
const rafterLength = Math.sqrt(halfWidth * halfWidth + roofHeight * roofHeight);
const rafterAngle = Math.atan2(roofHeight, halfWidth);

for (let i = 0; i <= rafterCount; i++) {
    let z = i * rafterSpacing;
    if (z > length) z = length;

    // Left Rafter Leg
    // Center of rafter leg
    // Start: (0, wallHeight, z)
    // End: (halfWidth, wallHeight + roofHeight, z)
    // Midpoint: (halfWidth/2, wallHeight + roofHeight/2, z)
    // We need to rotate a box.
    // Box dimensions: length = rafterLength, height = beamThick (depth into page), width = studThick (thickness of board)
    // Wait, rafters are usually 2x6 or similar. So "height" in local Y is the wide dimension.
    // Let's say rafter is 0.3 thick (X-axis local) and 0.6 high (Y-axis local).
    // In ThreeJS BoxGeometry(w, h, d):
    // w = thickness (along slope normal) -> No, w is along X local.
    // Let's align the box along the slope.
    // The box length should be along the slope. So d = rafterLength.
    // w = studThick (width of board).
    // h = beamThick * 2 (height of board).
    
    const rafterGeo = new THREE.BoxGeometry(studThick, beamThick * 2, rafterLength);
    const rafterMat = material;
    
    // Left Leg
    const leftRafter = new THREE.Mesh(rafterGeo, rafterMat);
    leftRafter.position.set(halfWidth / 2, wallHeight + roofHeight / 2, z);
    leftRafter.rotation.z = -rafterAngle; // Rotate clockwise to match slope up to right
    // Wait, slope is up from left (0) to center (halfWidth).
    // So angle is positive.
    // Vector (halfWidth, roofHeight). Angle = atan2(roofHeight, halfWidth).
    // Box is aligned with Z axis initially. We rotate around X? No, around Z? No.
    // The rafter runs in X-Y plane. So we rotate around Z axis? No, the rafter is a beam along the slope.
    // The slope is in X-Y plane. The beam extends along the slope.
    // So the "length" of the box is along the slope.
    // Initially Box is along Z. We need to rotate it to be in X-Y plane?
    // No, the rafter runs along the slope (X-Y direction) but has thickness in Z?
    // No, rafters run along the length of the building? No, rafters run across the width (X).
    // Wait. Standard roof: Rafters run from wall plate to ridge. So they run along X axis (mostly).
    // They are spaced along Z axis.
    // So the rafter is a beam oriented along the slope in X-Y plane.
    // Its "length" dimension is along the slope.
    // Its "width" dimension is along Z (thickness of the board).
    // Its "height" dimension is perpendicular to the slope.
    
    // So:
    // Geometry: width = beamThick (Z-thickness), height = beamThick * 2 (Slope-normal thickness), depth = rafterLength (Slope-length).
    // Rotation: The "depth" axis (Z local) needs to align with the slope.
    // Slope vector: (halfWidth, roofHeight, 0).
    // Angle in X-Y plane: atan2(roofHeight, halfWidth).
    // So we rotate around Z axis? No, the slope is in X-Y plane.
    // The beam is along the slope.
    // So we rotate the box around the Z axis? No.
    // If the box is aligned with Z axis (depth), and we want it aligned with slope (in X-Y plane)...
    // We need to rotate 90 degrees around X? Then rotate around Z?
    // Let's use a simpler approach.
    // Create a box with dimensions: thickness (Z), height (perp to slope), length (slope).
    // w = beamThick (Z dimension).
    // h = beamThick * 2.
    // d = rafterLength.
    // Position at midpoint.
    // Rotation: 
    // 1. Rotate 90 deg around X to make 'd' (Z-local) point along Y? No.
    // Let's just use lookAt or manual rotation.
    // Vector from (0, wallHeight, z) to (halfWidth, wallHeight + roofHeight, z).
    // Direction: (halfWidth, roofHeight, 0).
    // We want the Z-axis of the box to point in this direction.
    // So we create a matrix.
    
    // Actually, simpler:
    // BoxGeometry(w, h, d).
    // Let d be the length along the slope.
    // So we want the box's Z-axis to align with the slope vector.
    // The slope vector is in the X-Y plane.
    // So we rotate the box around the X-axis by 90 degrees? No.
    // If we rotate around X by 90, Z becomes Y.
    // Then we rotate around Z by the slope angle.
    
    const rafterMesh = new THREE.Mesh(
        new THREE.BoxGeometry(beamThick, beamThick * 2, rafterLength), // w=Z-thick, h=perp, d=length
        material
    );
    
    // Left Rafter
    rafterMesh.position.set(halfWidth / 2, wallHeight + roofHeight / 2, z);
    rafterMesh.rotation.x = Math.PI / 2; // Align Z-local with Y-world
    rafterMesh.rotation.z = Math.PI - rafterAngle; // Rotate to match slope (up and right)
    // Wait, slope is up and right (positive X, positive Y).
    // Angle is positive.
    // If Z-local points up (after x=90), rotating z by -angle points it up-right.
    rafterMesh.rotation.z = -rafterAngle + Math.PI/2; // Let's trial and error mentally.
    // Vector (1, 1). Angle 45 deg.
    // We want Z-axis to point (1, 1).
    // Default Z is (0, 0, 1).
    // Rotate X by 90 -> Z becomes (0, 1, 0) (Up).
    // Rotate Z by -45 -> (0, 1, 0) becomes (sin45, cos45, 0) = (0.7, 0.7, 0). Correct.
    // So rotation.z = -rafterAngle.
    // But wait, the left rafter goes from Left (0) to Center (halfWidth).
    // So it goes Up and Right.
    // So vector is (+X, +Y).
    // So rotation.z should be negative (clockwise from Up).
    // Yes.
    scene.add(rafterMesh);

    // Right Rafter
    // Goes from Right (width) to Center (halfWidth).
    // Vector (-X, +Y).
    // Mirror of left.
    const rightRafter = rafterMesh.clone();
    rightRafter.position.set(width - halfWidth / 2, wallHeight + roofHeight / 2, z);
    rightRafter.rotation.z = rafterAngle; // Counter-clockwise from Up.
    // Wait, if Z is Up. Rotate Z by +angle -> (-sin, cos). Up and Left. Correct.
    scene.add(rightRafter);
}

// Ridge Board
createBox(beamThick, beamThick * 2, length, halfWidth, wallHeight + roofHeight, length / 2);

// Purlins (Horizontal beams along Z, on top of rafters)
// Let's add 2 purlins per side.
// Position along the slope: 1/3 and 2/3.
const purlinOffsets = [0.33, 0.66];
purlinOffsets.forEach(offset => {
    // Height at offset
    // y = wallHeight + roofHeight * offset
    // x_left = halfWidth * offset
    // x_right = width - halfWidth * offset
    
    const y = wallHeight + roofHeight * offset;
    const xLeft = halfWidth * offset;
    const xRight = width - halfWidth * offset;
    
    // Purlins run along Z.
    // But they are on the slope. So they are horizontal?
    // In the image, purlins look horizontal (parallel to ground)?
    // Or parallel to the roof slope?
    // Usually purlins are horizontal (level) or perpendicular to rafters.
    // In the image, the lines running along Z look horizontal (level).
    // Let's assume level purlins.
    
    createBox(width, beamThick, beamThick, halfWidth, y, length / 2); 
    // Wait, a single beam across the whole width?
    // No, purlins are on the roof surface.
    // So two beams, one on left slope, one on right slope.
    // But if they are level, they are at height y.
    // Left purlin: from x=0 to x=halfWidth? No, on the slope.
    // At height y, the slope width is xLeft.
    // So the purlin is at x=xLeft? No, it's a beam along Z.
    // It sits on the rafters.
    // So it's a beam at position (xLeft, y).
    // But it needs to be long enough to span the rafter spacing?
    // No, purlins run along the length (Z).
    // So it's a beam of length `length`.
    // Positioned at x=xLeft, y=y.
    
    createBox(studThick, beamThick, length, xLeft, y, length / 2);
    createBox(studThick, beamThick, length, xRight, y, length / 2);
});

// Ceiling Joists (Horizontal beams along X, at the bottom of the roof triangle)
// Usually run across the width (X) to tie the walls.
// Spaced along Z.
for (let i = 0; i <= rafterCount; i++) {
    let z = i * rafterSpacing;
    if (z > length) z = length;
    // Joist from x=0 to x=width at y=wallHeight
    // But rafters are there.
    // Joists are usually between the walls.
    createBox(width, beamThick, studThick, halfWidth, wallHeight, z);
}

// Fascia (Board at the edge of the roof)
// Front Fascia (at Z=0)
// It follows the roof outline? Or just horizontal?
// In the image, there is a horizontal board at the bottom of the roof overhang.
// And vertical boards at the ends?
// Let's add a horizontal fascia at the bottom edge of the rafters.
// Left side: y=wallHeight.
// Right side: y=wallHeight.
// So a beam along X at y=wallHeight, z=0 (slightly offset).
createBox(width, beamThick, beamThick, halfWidth, wallHeight, -beamThick);

// Back Fascia
createBox(width, beamThick, beamThick, halfWidth, wallHeight, length + beamThick);

// Adjust Camera
camera.position.set(20, 15, -10); // Front-Right view
camera.lookAt(width / 2, wallHeight / 2, length / 2);