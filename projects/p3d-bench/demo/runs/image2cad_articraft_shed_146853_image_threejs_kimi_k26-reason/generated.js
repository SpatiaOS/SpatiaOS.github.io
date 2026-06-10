// ==========================================
// Shed Framing Model Parameters
// ==========================================
const width = 12;               // Gable-end width (front/back walls)
const depth = 16;               // Side-wall length (left/right walls)
const wallHeight = 8;           // Wall height from floor to top plate
const roofHeight = 4;           // Rise from top plate to ridge
const overhang = 1;             // Eave overhang past side walls
const gableOverhang = 0.5;      // Rafter overhang past gable ends
const studSpacing = 2;          // On-center spacing for studs/rafters
const beamSize = 0.15;          // Cross-section of all framing members
const panelThick = 0.05;        // Thickness of sheathing panels

// Door parameters
const doorWidth = 4;
const doorHeight = 6.5;
const doorLeft = -doorWidth / 2;
const doorRight = doorWidth / 2;

// Materials
const frameMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
const panelMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const floorMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
const doorMat = new THREE.MeshStandardMaterial({ color: 0x999999 });

// ==========================================
// Helpers
// ==========================================

// Add a square-profile beam between two 3D points
function addBeam(p1, p2) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geom = new THREE.BoxGeometry(beamSize, beamSize, len);
    const mesh = new THREE.Mesh(geom, frameMat);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
    mesh.setRotationFromQuaternion(quat);
    scene.add(mesh);
}

// Add a rectangular panel (sheathing, floor, doors)
function addPanel(x, y, z, w, h, d, mat, ry = 0) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    scene.add(mesh);
}

// Add a door hinge as a small block
function addHinge(x, y, z) {
    const geom = new THREE.BoxGeometry(0.08, 0.25, 0.04);
    const mesh = new THREE.Mesh(geom, frameMat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}

// ==========================================
// Floor
// ==========================================
addPanel(0, -0.05, 0, width + 1, 0.1, depth + 1, floorMat);

// ==========================================
// Wall Plates (bottom and top)
// ==========================================
// Bottom plates
addBeam(new THREE.Vector3(-width/2, beamSize/2, -depth/2), new THREE.Vector3(width/2, beamSize/2, -depth/2));
addBeam(new THREE.Vector3(-width/2, beamSize/2, depth/2), new THREE.Vector3(width/2, beamSize/2, depth/2));
addBeam(new THREE.Vector3(-width/2, beamSize/2, -depth/2), new THREE.Vector3(-width/2, beamSize/2, depth/2));
addBeam(new THREE.Vector3(width/2, beamSize/2, -depth/2), new THREE.Vector3(width/2, beamSize/2, depth/2));

// Top plates
addBeam(new THREE.Vector3(-width/2, wallHeight + beamSize/2, -depth/2), new THREE.Vector3(width/2, wallHeight + beamSize/2, -depth/2));
addBeam(new THREE.Vector3(-width/2, wallHeight + beamSize/2, depth/2), new THREE.Vector3(width/2, wallHeight + beamSize/2, depth/2));
addBeam(new THREE.Vector3(-width/2, wallHeight + beamSize/2, -depth/2), new THREE.Vector3(-width/2, wallHeight + beamSize/2, depth/2));
addBeam(new THREE.Vector3(width/2, wallHeight + beamSize/2, -depth/2), new THREE.Vector3(width/2, wallHeight + beamSize/2, depth/2));

// ==========================================
// Corner Studs
// ==========================================
const corners = [
    [-width/2, -depth/2], [width/2, -depth/2],
    [-width/2, depth/2],  [width/2, depth/2]
];
corners.forEach(([cx, cz]) => {
    addBeam(
        new THREE.Vector3(cx, beamSize/2, cz),
        new THREE.Vector3(cx, wallHeight + beamSize/2, cz)
    );
});

// ==========================================
// Long Wall Studs & Sheathing (Left / Right)
// ==========================================
const longStudZs = [-depth/2];
for (let i = 1; i < Math.floor(depth / studSpacing); i++) {
    longStudZs.push(-depth/2 + i * studSpacing);
}
longStudZs.push(depth/2);

// Place studs and sheathing panels between them
for (let i = 1; i < longStudZs.length - 1; i++) {
    const z = longStudZs[i];
    // Left and right studs
    addBeam(new THREE.Vector3(-width/2, beamSize/2, z), new THREE.Vector3(-width/2, wallHeight + beamSize/2, z));
    addBeam(new THREE.Vector3(width/2, beamSize/2, z), new THREE.Vector3(width/2, wallHeight + beamSize/2, z));
}

for (let i = 0; i < longStudZs.length - 1; i++) {
    const zCenter = (longStudZs[i] + longStudZs[i+1]) / 2;
    const zSize = longStudZs[i+1] - longStudZs[i] - beamSize;
    // Inset sheathing slightly so studs read as visible ridges
    // Left wall
    addPanel(-width/2 + beamSize/2 - panelThick/2 - 0.01, wallHeight/2 + beamSize/2, zCenter, panelThick, wallHeight, zSize, panelMat);
    // Right wall
    addPanel(width/2 - beamSize/2 + panelThick/2 + 0.01, wallHeight/2 + beamSize/2, zCenter, panelThick, wallHeight, zSize, panelMat);
}

// ==========================================
// Back Wall (gable end, no door)
// ==========================================
const backStudXs = [-width/2];
for (let i = 1; i < Math.floor(width / studSpacing); i++) backStudXs.push(-width/2 + i * studSpacing);
backStudXs.push(width/2);

for (let i = 0; i < backStudXs.length; i++) {
    const x = backStudXs[i];
    // Full-height stud
    addBeam(new THREE.Vector3(x, beamSize/2, -depth/2), new THREE.Vector3(x, wallHeight + beamSize/2, -depth/2));
    // Gable stud above top plate (triangular area)
    if (x !== -width/2 && x !== width/2) {
        const yTop = wallHeight + roofHeight * (1 - Math.abs(x) / (width/2));
        addBeam(new THREE.Vector3(x, wallHeight + beamSize/2, -depth/2), new THREE.Vector3(x, yTop, -depth/2));
    }
}

// Back wall sheathing below top plate
for (let i = 0; i < backStudXs.length - 1; i++) {
    const xCenter = (backStudXs[i] + backStudXs[i+1]) / 2;
    const xSize = backStudXs[i+1] - backStudXs[i] - beamSize;
    addPanel(xCenter, wallHeight/2 + beamSize/2, -depth/2 + beamSize/2 - panelThick/2 - 0.01, xSize, wallHeight, panelThick, panelMat);
}

// Back gable sheathing (triangular panel)
const gableShape = new THREE.Shape();
gableShape.moveTo(-width/2 + beamSize/2, wallHeight + beamSize);
gableShape.lineTo(width/2 - beamSize/2, wallHeight + beamSize);
gableShape.lineTo(0, wallHeight + roofHeight);
gableShape.closePath();
const gableGeom = new THREE.ExtrudeGeometry(gableShape, { depth: panelThick, bevelEnabled: false });
const backGable = new THREE.Mesh(gableGeom, panelMat);
backGable.position.z = -depth/2 + beamSize/2 - panelThick - 0.01;
scene.add(backGable);

// ==========================================
// Front Wall (gable end with double doors)
// ==========================================
let frontStudXs = [-width/2];
for (let i = 1; i < Math.floor(width / studSpacing); i++) {
    const x = -width/2 + i * studSpacing;
    if (x <= doorLeft || x >= doorRight) frontStudXs.push(x);
}
// Ensure king studs at door sides
if (!frontStudXs.includes(doorLeft)) frontStudXs.push(doorLeft);
if (!frontStudXs.includes(doorRight)) frontStudXs.push(doorRight);
frontStudXs.sort((a, b) => a - b);

// Studs and gable studs
for (let i = 0; i < frontStudXs.length; i++) {
    const x = frontStudXs[i];
    const isKing = (x === doorLeft || x === doorRight);
    if (isKing || x < doorLeft || x > doorRight) {
        addBeam(new THREE.Vector3(x, beamSize/2, depth/2), new THREE.Vector3(x, wallHeight + beamSize/2, depth/2));
    }
    if (x !== -width/2 && x !== width/2) {
        const yTop = wallHeight + roofHeight * (1 - Math.abs(x) / (width/2));
        addBeam(new THREE.Vector3(x, wallHeight + beamSize/2, depth/2), new THREE.Vector3(x, yTop, depth/2));
    }
}

// Header above door
addBeam(
    new THREE.Vector3(doorLeft, doorHeight + beamSize/2, depth/2),
    new THREE.Vector3(doorRight, doorHeight + beamSize/2, depth/2)
);

// Cripple studs above header
const crippleCount = Math.floor((doorRight - doorLeft) / studSpacing);
for (let i = 1; i < crippleCount; i++) {
    const cx = doorLeft + i * studSpacing;
    addBeam(new THREE.Vector3(cx, doorHeight + beamSize, depth/2), new THREE.Vector3(cx, wallHeight + beamSize/2, depth/2));
}

// Front wall sheathing (skip door bay)
for (let i = 0; i < frontStudXs.length - 1; i++) {
    const x1 = frontStudXs[i];
    const x2 = frontStudXs[i+1];
    const xSize = x2 - x1 - beamSize;
    if (xSize <= 0) continue;

    const left = Math.max(x1, doorLeft);
    const right = Math.min(x2, doorRight);
    if (left < right) {
        // Bay overlaps door: sheathe left and right fragments only
        if (x1 < doorLeft) {
            const w = doorLeft - x1 - beamSize;
            if (w > 0) addPanel((x1 + doorLeft)/2, wallHeight/2 + beamSize/2, depth/2 - beamSize/2 + panelThick/2 + 0.01, w, wallHeight, panelThick, panelMat);
        }
        if (x2 > doorRight) {
            const w = x2 - doorRight - beamSize;
            if (w > 0) addPanel((doorRight + x2)/2, wallHeight/2 + beamSize/2, depth/2 - beamSize/2 + panelThick/2 + 0.01, w, wallHeight, panelThick, panelMat);
        }
    } else {
        // Full bay
        addPanel((x1 + x2)/2, wallHeight/2 + beamSize/2, depth/2 - beamSize/2 + panelThick/2 + 0.01, xSize, wallHeight, panelThick, panelMat);
    }
}

// Front gable sheathing
const frontGable = new THREE.Mesh(gableGeom, panelMat);
frontGable.position.z = depth/2 - beamSize/2 + 0.01;
scene.add(frontGable);

// ==========================================
// Doors
// ==========================================
const doorThick = 0.1;
const singleDoorWidth = (doorRight - doorLeft - 0.1) / 2;
const doorZ = depth/2 - beamSize/2 - doorThick/2;

// Left door
addPanel(doorLeft + singleDoorWidth/2, doorHeight/2 + beamSize/2, doorZ, singleDoorWidth, doorHeight, doorThick, doorMat);
// Right door
addPanel(doorRight - singleDoorWidth/2, doorHeight/2 + beamSize/2, doorZ, singleDoorWidth, doorHeight, doorThick, doorMat);

// Hinges
for (let h = 1; h <= 3; h++) {
    const hy = beamSize + h * (doorHeight / 4);
    addHinge(doorLeft + 0.06, hy, doorZ);          // left door hinges
    addHinge(doorRight - 0.06, hy, doorZ);         // right door hinges
}

// ==========================================
// Roof Framing
// ==========================================
// Ridge beam
addBeam(
    new THREE.Vector3(0, wallHeight + roofHeight, -depth/2 - gableOverhang),
    new THREE.Vector3(0, wallHeight + roofHeight, depth/2 + gableOverhang)
);

// Rafters
const rafterCount = Math.floor((depth + 2 * gableOverhang) / studSpacing) + 1;
for (let i = 0; i < rafterCount; i++) {
    const z = -depth/2 - gableOverhang + i * studSpacing;
    // Left rafter
    addBeam(new THREE.Vector3(0, wallHeight + roofHeight, z), new THREE.Vector3(-width/2 - overhang, wallHeight + beamSize, z));
    // Right rafter
    addBeam(new THREE.Vector3(0, wallHeight + roofHeight, z), new THREE.Vector3(width/2 + overhang, wallHeight + beamSize, z));
}

// ==========================================
// Roof Sheathing Panel (partial, left slope near front)
// ==========================================
const panelSlopeWidth = 4;
const panelDepthSize = 6;
const roofAngle = Math.atan2(roofHeight, width/2 + overhang);
const slopeVec = new THREE.Vector3(Math.cos(roofAngle), Math.sin(roofAngle), 0); // up the left slope toward ridge

const eaveZ = depth/2 - panelDepthSize/2;
const eavePos = new THREE.Vector3(-width/2 - overhang, wallHeight + beamSize, eaveZ);
const panelCenter = eavePos.clone().add(slopeVec.clone().multiplyScalar(panelSlopeWidth / 2));

const roofPanelGeom = new THREE.BoxGeometry(panelSlopeWidth, panelThick, panelDepthSize);
const roofPanel = new THREE.Mesh(roofPanelGeom, panelMat);
roofPanel.position.copy(panelCenter);
const panelQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), slopeVec);
roofPanel.setRotationFromQuaternion(panelQuat);
scene.add(roofPanel);

// ==========================================
// Camera
// ==========================================
camera.position.set(25, 20, 25);
camera.lookAt(0, wallHeight / 2, 0);