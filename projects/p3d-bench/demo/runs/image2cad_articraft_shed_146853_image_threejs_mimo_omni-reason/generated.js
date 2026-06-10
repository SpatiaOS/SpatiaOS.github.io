// Parameters for the shed
const shedWidth = 300;      // Front/back width
const shedDepth = 400;      // Side depth
const wallHeight = 250;     // Height of vertical walls
const roofPitch = 30;       // Roof angle in degrees
const roofOverhang = 20;    // How much roof extends beyond walls
const baseHeight = 15;      // Height of foundation/base

// Derived roof dimensions
const roofHeight = (shedWidth / 2) * Math.tan(roofPitch * Math.PI / 180);
const totalHeight = wallHeight + roofHeight;

// Materials
const woodMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B7355, 
    roughness: 0.8,
    metalness: 0.1
});
const darkWoodMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x5C4033, 
    roughness: 0.9,
    metalness: 0.0
});
const doorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x6B4423, 
    roughness: 0.7,
    metalness: 0.0
});

// Create a group to hold all shed parts
const shedGroup = new THREE.Group();

// 1. Base/Foundation
const baseGeometry = new THREE.BoxGeometry(
    shedWidth + 20, 
    baseHeight, 
    shedDepth + 20
);
const base = new THREE.Mesh(baseGeometry, darkWoodMaterial);
base.position.y = baseHeight / 2;
shedGroup.add(base);

// 2. Walls
const wallThickness = 10;

// Front wall (with door opening)
const frontWallGeometry = new THREE.BoxGeometry(shedWidth, wallHeight, wallThickness);
const frontWall = new THREE.Mesh(frontWallGeometry, woodMaterial);
frontWall.position.set(0, baseHeight + wallHeight/2, shedDepth/2);
shedGroup.add(frontWall);

// Back wall
const backWall = new THREE.Mesh(frontWallGeometry, woodMaterial);
backWall.position.set(0, baseHeight + wallHeight/2, -shedDepth/2);
shedGroup.add(backWall);

// Side walls
const sideWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, shedDepth);
const leftWall = new THREE.Mesh(sideWallGeometry, woodMaterial);
leftWall.position.set(-shedWidth/2, baseHeight + wallHeight/2, 0);
shedGroup.add(leftWall);

const rightWall = new THREE.Mesh(sideWallGeometry, woodMaterial);
rightWall.position.set(shedWidth/2, baseHeight + wallHeight/2, 0);
shedGroup.add(rightWall);

// 3. Roof Structure
// Ridge board
const ridgeGeometry = new THREE.BoxGeometry(10, 10, shedDepth + roofOverhang * 2);
const ridge = new THREE.Mesh(ridgeGeometry, darkWoodMaterial);
ridge.position.set(0, baseHeight + wallHeight + roofHeight, 0);
shedGroup.add(ridge);

// Rafters
const rafterCount = 10;
const rafterSpacing = (shedDepth + roofOverhang * 2) / rafterCount;
const rafterWidth = 8;
const rafterHeight = 15;

for (let i = 0; i <= rafterCount; i++) {
    const zPos = -shedDepth/2 - roofOverhang + i * rafterSpacing;
    
    // Left rafter
    const leftRafterGeometry = new THREE.BoxGeometry(
        Math.sqrt(Math.pow(shedWidth/2 + roofOverhang, 2) + Math.pow(roofHeight, 2)),
        rafterHeight,
        rafterWidth
    );
    const leftRafter = new THREE.Mesh(leftRafterGeometry, darkWoodMaterial);
    leftRafter.position.set(
        -(shedWidth/4 + roofOverhang/2),
        baseHeight + wallHeight + roofHeight/2,
        zPos
    );
    leftRafter.rotation.z = Math.atan2(roofHeight, shedWidth/2 + roofOverhang);
    shedGroup.add(leftRafter);
    
    // Right rafter
    const rightRafter = new THREE.Mesh(leftRafterGeometry, darkWoodMaterial);
    rightRafter.position.set(
        (shedWidth/4 + roofOverhang/2),
        baseHeight + wallHeight + roofHeight/2,
        zPos
    );
    rightRafter.rotation.z = -Math.atan2(roofHeight, shedWidth/2 + roofOverhang);
    shedGroup.add(rightRafter);
}

// 4. Door
const doorWidth = 120;
const doorHeight = 200;
const doorThickness = 8;
const doorOffsetX = -60; // Position on front wall

// Door frame
const frameThickness = 10;
const frameGeometry = new THREE.BoxGeometry(
    doorWidth + frameThickness * 2, 
    doorHeight + frameThickness, 
    wallThickness + 5
);
const doorFrame = new THREE.Mesh(frameGeometry, darkWoodMaterial);
doorFrame.position.set(
    doorOffsetX, 
    baseHeight + doorHeight/2 + frameThickness/2, 
    shedDepth/2
);
shedGroup.add(doorFrame);

// Left door
const doorPanelGeometry = new THREE.BoxGeometry(doorWidth/2 - 5, doorHeight, doorThickness);
const leftDoor = new THREE.Mesh(doorPanelGeometry, doorMaterial);
leftDoor.position.set(
    doorOffsetX - doorWidth/4 + 2.5, 
    baseHeight + doorHeight/2, 
    shedDepth/2 + wallThickness/2 + doorThickness/2
);
shedGroup.add(leftDoor);

// Right door
const rightDoor = new THREE.Mesh(doorPanelGeometry, doorMaterial);
rightDoor.position.set(
    doorOffsetX + doorWidth/4 - 2.5, 
    baseHeight + doorHeight/2, 
    shedDepth/2 + wallThickness/2 + doorThickness/2
);
shedGroup.add(rightDoor);

// Hinges (simplified)
const hingeGeometry = new THREE.BoxGeometry(5, 20, 3);
const hingePositions = [
    [doorOffsetX - doorWidth/2 + 5, baseHeight + 50, shedDepth/2 + wallThickness/2 + 2],
    [doorOffsetX - doorWidth/2 + 5, baseHeight + doorHeight/2, shedDepth/2 + wallThickness/2 + 2],
    [doorOffsetX - doorWidth/2 + 5, baseHeight + doorHeight - 50, shedDepth/2 + wallThickness/2 + 2],
    [doorOffsetX + doorWidth/2 - 5, baseHeight + 50, shedDepth/2 + wallThickness/2 + 2],
    [doorOffsetX + doorWidth/2 - 5, baseHeight + doorHeight/2, shedDepth/2 + wallThickness/2 + 2],
    [doorOffsetX + doorWidth/2 - 5, baseHeight + doorHeight - 50, shedDepth/2 + wallThickness/2 + 2]
];

hingePositions.forEach(pos => {
    const hinge = new THREE.Mesh(hingeGeometry, darkWoodMaterial);
    hinge.position.set(pos[0], pos[1], pos[2]);
    shedGroup.add(hinge);
});

// 5. Vertical Siding (Board and Batten style)
const boardWidth = 15;
const boardSpacing = 35;
const battenWidth = 5;

// Front wall boards
const boardsPerSide = Math.floor((shedWidth - doorWidth) / boardSpacing);
for (let i = 0; i < boardsPerSide; i++) {
    // Left of door
    if (i < boardsPerSide/2) {
        const xPos = -shedWidth/2 + 20 + i * boardSpacing;
        if (Math.abs(xPos - doorOffsetX) > doorWidth/2 + 10) {
            const boardGeometry = new THREE.BoxGeometry(boardWidth, wallHeight, 3);
            const board = new THREE.Mesh(boardGeometry, darkWoodMaterial);
            board.position.set(xPos, baseHeight + wallHeight/2, shedDepth/2 + 2);
            shedGroup.add(board);
        }
    }
    // Right of door
    else {
        const xPos = doorOffsetX + doorWidth/2 + 20 + (i - boardsPerSide/2) * boardSpacing;
        if (xPos < shedWidth/2 - 20) {
            const boardGeometry = new THREE.BoxGeometry(boardWidth, wallHeight, 3);
            const board = new THREE.Mesh(boardGeometry, darkWoodMaterial);
            board.position.set(xPos, baseHeight + wallHeight/2, shedDepth/2 + 2);
            shedGroup.add(board);
        }
    }
}

// Side wall boards (simplified - just a few representative boards)
const sideBoardsCount = 8;
for (let i = 0; i < sideBoardsCount; i++) {
    const zPos = -shedDepth/2 + 40 + i * (shedDepth - 80) / (sideBoardsCount - 1);
    
    // Left side
    const leftBoardGeometry = new THREE.BoxGeometry(3, wallHeight, boardWidth);
    const leftBoard = new THREE.Mesh(leftBoardGeometry, darkWoodMaterial);
    leftBoard.position.set(-shedWidth/2 - 2, baseHeight + wallHeight/2, zPos);
    shedGroup.add(leftBoard);
    
    // Right side
    const rightBoard = new THREE.Mesh(leftBoardGeometry, darkWoodMaterial);
    rightBoard.position.set(shedWidth/2 + 2, baseHeight + wallHeight/2, zPos);
    shedGroup.add(rightBoard);
}

// 6. Roof Sheathing (simplified representation)
const sheathingThickness = 5;
const leftRoofGeometry = new THREE.BoxGeometry(
    Math.sqrt(Math.pow(shedWidth/2 + roofOverhang, 2) + Math.pow(roofHeight, 2)),
    sheathingThickness,
    shedDepth + roofOverhang * 2
);
const leftRoof = new THREE.Mesh(leftRoofGeometry, woodMaterial);
leftRoof.position.set(
    -(shedWidth/4 + roofOverhang/2),
    baseHeight + wallHeight + roofHeight/2 + sheathingThickness/2,
    0
);
leftRoof.rotation.z = Math.atan2(roofHeight, shedWidth/2 + roofOverhang);
shedGroup.add(leftRoof);

const rightRoof = new THREE.Mesh(leftRoofGeometry, woodMaterial);
rightRoof.position.set(
    (shedWidth/4 + roofOverhang/2),
    baseHeight + wallHeight + roofHeight/2 + sheathingThickness/2,
    0
);
rightRoof.rotation.z = -Math.atan2(roofHeight, shedWidth/2 + roofOverhang);
shedGroup.add(rightRoof);

// Add the complete shed to the scene
scene.add(shedGroup);

// Adjust camera to view the shed
camera.position.set(400, 300, 400);
camera.lookAt(0, baseHeight + totalHeight/2, 0);