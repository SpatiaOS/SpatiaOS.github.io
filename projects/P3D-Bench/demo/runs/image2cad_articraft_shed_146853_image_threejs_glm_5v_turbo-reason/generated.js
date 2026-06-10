// ==========================================
// SHED FRAMING MODEL PARAMETERS
// ==========================================

// Overall building dimensions
const BUILDING_WIDTH = 16;      // X-axis (front to back)
const BUILDING_DEPTH = 12;      // Z-axis (side to side)
const WALL_HEIGHT = 8;          // Y-axis (wall height before roof)
const ROOF_PITCH = 0.4;         // Rise over run ratio
const ROOF_OVERHANG = 1;        // Eave extension beyond walls

// Lumber dimensions (nominal sizes scaled down for visualization)
const STUD_WIDTH = 0.15;
const STUD_DEPTH = 0.45;
const PLATE_HEIGHT = 0.15;
const RAFTER_SIZE = 0.15;

// Framing spacing
const STUD_SPACING = 1.5;       // On-center spacing for studs
const RAFTER_SPACING = 1.5;     // On-center spacing for rafters

// Calculated values
const RIDGE_HEIGHT = WALL_HEIGHT + (BUILDING_WIDTH / 2) * ROOF_PITCH;
const RAFTER_LENGTH = Math.sqrt(Math.pow(BUILDING_WIDTH / 2 + ROOF_OVERHANG, 2) + 
                                 Math.pow((BUILDING_WIDTH / 2) * ROOF_PITCH, 2));

// Materials
const lumberMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    roughness: 0.7,
    metalness: 0.1
});

const sheathingMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.9,
    side: THREE.DoubleSide
});

// Helper function to create a stud/post
function createStud(width, height, depth) {
    const geo = new THREE.BoxGeometry(width || STUD_WIDTH, height, depth || STUD_DEPTH);
    return new THREE.Mesh(geo, lumberMaterial);
}

// ==========================================
// FOUNDATION & BASE PLATES
// ==========================================

// Foundation slab
const foundationGeo = new THREE.BoxGeometry(BUILDING_WIDTH + 0.3, 0.3, BUILDING_DEPTH + 0.3);
const foundation = new THREE.Mesh(foundationGeo, new THREE.MeshStandardMaterial({ color: 0x666666 }));
foundation.position.y = -0.15;
scene.add(foundation);

// Bottom plates (sill plates)
function createBottomPlate(length, x, z, rotated = false) {
    const plate = createStud(length, PLATE_HEIGHT, STUD_DEPTH);
    plate.position.set(x, PLATE_HEIGHT / 2, z);
    if (rotated) plate.rotation.y = Math.PI / 2;
    scene.add(plate);
}

// Four sides of bottom plates
createBottomPlate(BUILDING_WIDTH, 0, BUILDING_DEPTH / 2);           // Front
createBottomPlate(BUILDING_WIDTH, 0, -BUILDING_DEPTH / 2);          // Back
createBottomPlate(BUILDING_DEPTH, BUILDING_WIDTH / 2, 0, true);     // Right
createBottomPlate(BUILDING_DEPTH, -BUILDING_WIDTH / 2, 0, true);    // Left

// Top plates
function createTopPlate(length, x, z, rotated = false) {
    const plate = createStud(length, PLATE_HEIGHT, STUD_DEPTH);
    plate.position.set(x, WALL_HEIGHT, z);
    if (rotated) plate.rotation.y = Math.PI / 2;
    scene.add(plate);
}

createTopPlate(BUILDING_WIDTH, 0, BUILDING_DEPTH / 2);
createTopPlate(BUILDING_WIDTH, 0, -BUILDING_DEPTH / 2);
createTopPlate(BUILDING_DEPTH, BUILDING_WIDTH / 2, 0, true);
createTopPlate(BUILDING_DEPTH, -BUILDING_WIDTH / 2, 0, true);

// ==========================================
// WALL STUDS
// ==========================================

// Add vertical studs along each wall
function addWallStuds(startX, endX, z, hasDoor = false, doorStart = 0, doorEnd = 0) {
    const numStuds = Math.floor(Math.abs(endX - startX) / STUD_SPACING) + 1;
    
    for (let i = 0; i <= numStuds; i++) {
        const xPos = startX + (endX - startX) * (i / numStuds);
        
        // Skip positions inside door opening
        if (hasDoor && xPos > doorStart && xPos < doorEnd) continue;
        // Add extra studs at door edges
        if (hasDoor && (Math.abs(xPos - doorStart) < 0.01 || Math.abs(xPos - doorEnd) < 0.01)) {
            // Double stud at door opening
            const stud1 = createStud(STUD_WIDTH, WALL_HEIGHT, STUD_DEPTH);
            stud1.position.set(xPos - 0.05, WALL_HEIGHT / 2, z);
            scene.add(stud1);
            
            const stud2 = createStud(STUD_WIDTH, WALL_HEIGHT, STUD_DEPTH);
            stud2.position.set(xPos + 0.05, WALL_HEIGHT / 2, z);
            scene.add(stud2);
            continue;
        }
        
        const stud = createStud(STUD_WIDTH, WALL_HEIGHT, STUD_DEPTH);
        stud.position.set(xPos, WALL_HEIGHT / 2, z);
        scene.add(stud);
    }
}

// Front wall (with door opening centered)
const DOOR_WIDTH = 4;
const DOOR_HEIGHT = 6.5;
const doorLeft = -DOOR_WIDTH / 2;
const doorRight = DOOR_WIDTH / 2;
addWallStuds(-BUILDING_WIDTH / 2, BUILDING_WIDTH / 2, BUILDING_DEPTH / 2, true, doorLeft, doorRight);

// Back wall
addWallStuds(-BUILDING_WIDTH / 2, BUILDING_WIDTH / 2, -BUILDING_DEPTH / 2);

// Side walls
for (let i = 0; i <= Math.floor(BUILDING_DEPTH / STUD_SPACING) + 1; i++) {
    const zPos = -BUILDING_DEPTH / 2 + (BUILDING_DEPTH * (i / Math.floor(BUILDING_DEPTH / STUD_SPACING)));
    
    // Right side
    const rightStud = createStud(STUD_WIDTH, WALL_HEIGHT, STUD_DEPTH);
    rightStud.position.set(BUILDING_WIDTH / 2, WALL_HEIGHT / 2, zPos);
    scene.add(rightStud);
    
    // Left side
    const leftStud = createStud(STUD_WIDTH, WALL_HEIGHT, STUD_DEPTH);
    leftStud.position.set(-BUILDING_WIDTH / 2, WALL_HEIGHT / 2, zPos);
    scene.add(leftStud);
}

// ==========================================
// DOOR CONSTRUCTION
// ==========================================

// Door header (lintel above door)
const headerGeo = new THREE.BoxGeometry(DOOR_WIDTH + 0.3, STUD_WIDTH, STUD_DEPTH);
const header = new THREE.Mesh(headerGeo, lumberMaterial);
header.position.set(0, DOOR_HEIGHT, BUILDING_DEPTH / 2);
scene.add(header);

// Door panels (sheathing)
const doorPanelGeo = new THREE.BoxGeometry(DOOR_WIDTH / 2 - 0.1, DOOR_HEIGHT - 0.1, 0.08);

const leftDoor = new THREE.Mesh(doorPanelGeo, sheathingMaterial);
leftDoor.position.set(-DOOR_WIDTH / 4, DOOR_HEIGHT / 2, BUILDING_DEPTH / 2 - 0.05);
scene.add(leftDoor);

const rightDoor = new THREE.Mesh(doorPanelGeo, sheathingMaterial);
rightDoor.position.set(DOOR_WIDTH / 4, DOOR_HEIGHT / 2, BUILDING_DEPTH / 2 - 0.05);
scene.add(rightDoor);

// Hinges (small boxes representing hinge hardware)
const hingeGeo = new THREE.BoxGeometry(0.08, 0.25, 0.08);
const hingeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

for (let h = 0; h < 4; h++) {
    const yHinge = 1 + h * 1.5;
    const hingeL = new THREE.Mesh(hingeGeo, hingeMat);
    hingeL.position.set(doorLeft + 0.1, yHinge, BUILDING_DEPTH / 2 - 0.02);
    scene.add(hingeL);
    
    const hingeR = new THREE.Mesh(hingeGeo, hingeMat);
    hingeR.position.set(doorRight - 0.1, yHinge, BUILDING_DEPTH / 2 - 0.02);
    scene.add(hingeR);
}

// ==========================================
// GABLE END FRAMING (FRONT & BACK)
// ==========================================

function createGableTruss(zPos) {
    // Vertical studs in gable end (triangular shape)
    const gableHeight = RIDGE_HEIGHT - WALL_HEIGHT;
    const numGableStuds = 6;
    
    for (let i = 0; i <= numGableStuds; i++) {
        const xPos = -BUILDING_WIDTH / 2 + (BUILDING_WIDTH * (i / numGableStuds));
        const distFromCenter = Math.abs(xPos);
        // Calculate height at this position based on roof slope
        const studHeightAtPos = Math.max(0.5, gableHeight * (1 - (distFromCenter / (BUILDING_WIDTH / 2))));
        
        const gableStud = createStud(STUD_WIDTH, studHeightAtPos, STUD_DEPTH);
        gableStud.position.set(xPos, WALL_HEIGHT + studHeightAtPos / 2, zPos);
        scene.add(gableStud);
    }
}

createGableTruss(BUILDING_DEPTH / 2);
createGableTruss(-BUILDING_DEPTH / 2);

// ==========================================
// ROOF FRAME
// ==========================================

// Ridge board (peak beam running length of building)
const ridgeLength = BUILDING_DEPTH + 2;
const ridgeGeo = new THREE.BoxGeometry(RAFTER_SIZE, RAFTER_SIZE, ridgeLength);
const ridge = new THREE.Mesh(ridgeGeo, lumberMaterial);
ridge.position.set(0, RIDGE_HEIGHT, 0);
scene.add(ridge);

// Rafters (diagonal beams from walls to ridge)
const NUM_RAFTERS_EACH_SIDE = Math.floor(BUILDING_DEPTH / RAFTER_SPACING) + 1;

for (let r = 0; r < NUM_RAFTERS_EACH_SIDE; r++) {
    const zPos = -BUILDING_DEPTH / 2 + (BUILDING_DEPTH * (r / (NUM_RAFTERS_EACH_SIDE - 1)));
    
    // Left rafter (from left wall to ridge)
    const leftRafterGeo = new THREE.BoxGeometry(RAFTER_SIZE, RAFTER_SIZE, RAFTER_LENGTH);
    const leftRafter = new THREE.Mesh(leftRafterGeo, lumberMaterial);
    leftRafter.position.set(
        -BUILDING_WIDTH / 4 - ROOF_OVERHANG / 2,
        (WALL_HEIGHT + RIDGE_HEIGHT) / 2,
        zPos
    );
    // Rotate to match roof pitch
    const angle = Math.atan(ROOF_PITCH);
    leftRafter.rotation.y = -angle;
    leftRafter.rotation.z = angle;
    scene.add(leftRafter);
    
    // Right rafter (from right wall to ridge)
    const rightRafter = new THREE.Mesh(leftRafterGeo.clone(), lumberMaterial);
    rightRafter.position.set(
        BUILDING_WIDTH / 4 + ROOF_OVERHANG / 2,
        (WALL_HEIGHT + RIDGE_HEIGHT) / 2,
        zPos
    );
    rightRafter.rotation.y = angle;
    rightRafter.rotation.z = -angle;
    scene.add(rightRafter);
}

// Purlins (horizontal boards across rafters)
const NUM_PURLINS = 4;
for (let p = 1; p <= NUM_PURLINS; p++) {
    const fraction = p / (NUM_PURLINS + 1);
    const yPurlin = WALL_HEIGHT + (RIDGE_HEIGHT - WALL_HEIGHT) * fraction;
    const xOffset = (BUILDING_WIDTH / 2) * (1 - fraction);
    
    const purlinGeo = new THREE.BoxGeometry(RAFTER_SIZE, RAFTER_SIZE, BUILDING_DEPTH + 2);
    
    // Left side purlin
    const leftPurlin = new THREE.Mesh(purlinGeo, lumberMaterial);
    leftPurlin.position.set(-xOffset, yPurlin, 0);
    scene.add(leftPurlin);
    
    // Right side purlin
    const rightPurlin = new THREE.Mesh(purlinGeo, lumberMaterial);
    rightPurlin.position.set(xOffset, yPurlin, 0);
    scene.add(rightPurlin);
}

// ==========================================
// SHEATHING (partial, as shown in image)
// ==========================================

// Partial roof sheathing on front slope (as seen in image)
const sheathWidth = BUILDING_WIDTH / 3;
const sheathDepth = BUILDING_DEPTH / 2;
const sheathGeo = new THREE.PlaneGeometry(sheathWidth, sheathDepth);
const roofSheath = new THREE.Mesh(sheathGeo, sheathingMaterial);
roofSheath.position.set(-BUILDING_WIDTH / 4, WALL_HEIGHT + 1.5, BUILDING_DEPTH / 4);
roofSheath.rotation.x = -Math.PI / 2 + Math.atan(ROOF_PITCH);
scene.add(roofSheath);

// ==========================================
// CAMERA POSITIONING
// ==========================================

camera.position.set(20, 15, 20);
camera.lookAt(0, WALL_HEIGHT / 2, 0);