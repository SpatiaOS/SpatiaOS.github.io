// ============================================
// STORAGE SHED WITH EXPOSED ROOF TRUSSES
// ============================================

// === BUILDING DIMENSIONS ===
const W = 14;           // Width (X-axis)
const D = 20;           // Depth (Z-axis)
const WH = 8;           // Wall height
const RP = 4.5;         // Roof peak height above walls
const WT = 0.2;         // Wall panel thickness
const OH = 0.8;         // Eave overhang
const GOH = 0.5;        // Gable-end overhang

const halfW = W / 2;
const floorH = 0.35;
const wallTopY = floorH + WH;
const ridgeY = wallTopY + RP;
const roofSlope = RP / halfW;
const eaveY = wallTopY - OH * roofSlope;

// Lumber sizes
const LW = 0.12;
const LH = 0.25;

// Door dimensions
const doorSingleW = 2.6;
const doorH = 6.2;
const doorGap = 0.12;
const totalDoorW = doorSingleW * 2 + doorGap;

// Batten dimensions
const battenSpacing = 1.6;
const battenW = 0.06;
const battenD = 0.04;

// === MATERIALS ===
const panelMat = new THREE.MeshStandardMaterial({ color: 0xBDBDBD });
const frameMat = new THREE.MeshStandardMaterial({ color: 0x8A8A8A });
const doorMat = new THREE.MeshStandardMaterial({ color: 0xADADAD });
const metalMat = new THREE.MeshStandardMaterial({ color: 0x4A4A4A, metalness: 0.5, roughness: 0.6 });
const roofPanelMat = new THREE.MeshStandardMaterial({ color: 0xB5B5B5, side: THREE.DoubleSide });

// === HELPER FUNCTIONS ===
function addBox(w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || panelMat);
    m.position.set(x, y, z);
    scene.add(m);
    return m;
}

function addBeam(x1, y1, z1, x2, y2, z2, w, h, mat) {
    const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 0.01) return null;
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, len),
        mat || frameMat
    );
    mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
    mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(dx, dy, dz).normalize()
    );
    scene.add(mesh);
    return mesh;
}

// === 1. FLOOR PLATFORM ===
addBox(W + 0.5, floorH, D + 0.5, 0, floorH / 2, 0, frameMat);

// === 2. WALLS ===
// Side walls
addBox(WT, WH, D, halfW, floorH + WH / 2, 0);
addBox(WT, WH, D, -halfW, floorH + WH / 2, 0);

// Back wall
addBox(W, WH, WT, 0, floorH + WH / 2, D / 2);

// Front wall with door opening
const sideW = (W - totalDoorW) / 2;
const aboveDoorH = WH - doorH;
addBox(sideW, WH, WT, -halfW + sideW / 2, floorH + WH / 2, -D / 2);
addBox(sideW, WH, WT, halfW - sideW / 2, floorH + WH / 2, -D / 2);
if (aboveDoorH > 0) {
    addBox(totalDoorW, aboveDoorH, WT, 0, floorH + doorH + aboveDoorH / 2, -D / 2);
}

// === 3. GABLE TRIANGLES ===
const gableShape = new THREE.Shape();
gableShape.moveTo(-halfW, 0);
gableShape.lineTo(halfW, 0);
gableShape.lineTo(0, RP);
gableShape.closePath();

const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: WT, bevelEnabled: false });

const frontGable = new THREE.Mesh(gableGeo, panelMat);
frontGable.position.set(0, wallTopY, -D / 2 - WT / 2);
scene.add(frontGable);

const backGable = new THREE.Mesh(gableGeo.clone(), panelMat);
backGable.position.set(0, wallTopY, D / 2 - WT / 2);
scene.add(backGable);

// === 4. DOUBLE DOORS ===
addBox(doorSingleW, doorH, WT * 0.6,
    -(doorSingleW / 2 + doorGap / 2), floorH + doorH / 2, -D / 2 + WT * 0.2, doorMat);
addBox(doorSingleW, doorH, WT * 0.6,
    (doorSingleW / 2 + doorGap / 2), floorH + doorH / 2, -D / 2 + WT * 0.2, doorMat);

// Door vertical battens
[-1, 1].forEach(side => {
    const doorCX = side * (doorSingleW / 2 + doorGap / 2);
    for (let dx = -doorSingleW / 2 + 0.45; dx <= doorSingleW / 2 - 0.3; dx += 0.85) {
        addBox(0.05, doorH - 0.2, 0.04,
            doorCX + dx, floorH + doorH / 2, -D / 2 - 0.01, frameMat);
    }
});

// Door hinges
for (let i = 0; i < 4; i++) {
    const hy = floorH + 0.8 + i * 1.5;
    addBox(0.2, 0.2, 0.06,
        -(totalDoorW / 2 - 0.12), hy, -D / 2 - WT / 2, metalMat);
    addBox(0.2, 0.2, 0.06,
        (totalDoorW / 2 - 0.12), hy, -D / 2 - WT / 2, metalMat);
}

// Door handles
addBox(0.06, 0.5, 0.06, -doorGap / 2 - 0.2, floorH + doorH * 0.48, -D / 2 - WT / 2, metalMat);
addBox(0.06, 0.5, 0.06, doorGap / 2 + 0.2, floorH + doorH * 0.48, -D / 2 - WT / 2, metalMat);

// === 5. WALL BATTENS (vertical panel lines) ===
// Side walls
for (let z = -D / 2 + battenSpacing; z < D / 2; z += battenSpacing) {
    addBox(battenD, WH, battenW, halfW + WT / 2 + battenD / 2, floorH + WH / 2, z, frameMat);
    addBox(battenD, WH, battenW, -halfW - WT / 2 - battenD / 2, floorH + WH / 2, z, frameMat);
}

// Back wall
for (let x = -halfW + battenSpacing; x < halfW; x += battenSpacing) {
    addBox(battenW, WH, battenD, x, floorH + WH / 2, D / 2 + WT / 2 + battenD / 2, frameMat);
}

// Front wall (skip door area)
for (let x = -halfW + battenSpacing; x < halfW; x += battenSpacing) {
    if (Math.abs(x) > totalDoorW / 2 + 0.3) {
        addBox(battenW, WH, battenD, x, floorH + WH / 2, -D / 2 - WT / 2 - battenD / 2, frameMat);
    }
}

// Gable battens (front)
for (let x = -halfW + battenSpacing; x < halfW; x += battenSpacing) {
    let batH;
    if (x <= 0) {
        batH = (RP / halfW) * (x + halfW);
    } else {
        batH = RP * (1 - x / halfW);
    }
    if (batH > 0.4) {
        addBox(battenW, batH - 0.2, battenD, x, wallTopY + (batH - 0.2) / 2 + 0.1,
            -D / 2 - WT / 2 - battenD / 2, frameMat);
    }
}

// Gable battens (back)
for (let x = -halfW + battenSpacing; x < halfW; x += battenSpacing) {
    let batH;
    if (x <= 0) {
        batH = (RP / halfW) * (x + halfW);
    } else {
        batH = RP * (1 - x / halfW);
    }
    if (batH > 0.4) {
        addBox(battenW, batH - 0.2, battenD, x, wallTopY + (batH - 0.2) / 2 + 0.1,
            D / 2 + WT / 2 + battenD / 2, frameMat);
    }
}

// === 6. ROOF TRUSSES ===
const numTrusses = 10;
const trussSpacing = D / (numTrusses - 1);

for (let i = 0; i < numTrusses; i++) {
    const z = -D / 2 + i * trussSpacing;

    // Bottom chord (tie beam)
    addBeam(-halfW, wallTopY, z, halfW, wallTopY, z, LW, LH);

    // Left rafter (eave to ridge)
    addBeam(-halfW - OH, eaveY, z, 0, ridgeY, z, LW, LH);

    // Right rafter (eave to ridge)
    addBeam(halfW + OH, eaveY, z, 0, ridgeY, z, LW, LH);

    // King post (vertical center member)
    addBeam(0, wallTopY + LH, z, 0, ridgeY - LH, z, LW, LW);

    // Left web diagonal
    addBeam(-halfW * 0.48, wallTopY + LH, z,
        -halfW * 0.13, wallTopY + RP * 0.62, z, LW * 0.7, LW * 0.7);

    // Right web diagonal
    addBeam(halfW * 0.48, wallTopY + LH, z,
        halfW * 0.13, wallTopY + RP * 0.62, z, LW * 0.7, LW * 0.7);

    // Additional struts for larger trusses
    addBeam(-halfW * 0.7, wallTopY + LH, z,
        -halfW * 0.35, wallTopY + RP * 0.38, z, LW * 0.6, LW * 0.6);
    addBeam(halfW * 0.7, wallTopY + LH, z,
        halfW * 0.35, wallTopY + RP * 0.38, z, LW * 0.6, LW * 0.6);
}

// === 7. RIDGE BEAM ===
addBeam(0, ridgeY, -D / 2 - GOH, 0, ridgeY, D / 2 + GOH, LH, LH);

// === 8. PURLINS (horizontal beams along roof slopes) ===
const numPurlins = 5;
for (let i = 1; i <= numPurlins; i++) {
    const t = i / (numPurlins + 1);
    const py = eaveY + (ridgeY - eaveY) * t;

    // Left slope
    const lx = -(halfW + OH) * (1 - t);
    addBeam(lx, py, -D / 2 - GOH, lx, py, D / 2 + GOH, LW, LH);

    // Right slope
    const rx = (halfW + OH) * (1 - t);
    addBeam(rx, py, -D / 2 - GOH, rx, py, D / 2 + GOH, LW, LH);
}

// Eave fascia beams
addBeam(-halfW - OH, eaveY, -D / 2 - GOH,
    -halfW - OH, eaveY, D / 2 + GOH, LH, LW);
addBeam(halfW + OH, eaveY, -D / 2 - GOH,
    halfW + OH, eaveY, D / 2 + GOH, LH, LW);

// Rake trim (gable edge beams)
addBeam(-halfW - OH, eaveY, -D / 2 - GOH, 0, ridgeY, -D / 2 - GOH, LH, LW);
addBeam(halfW + OH, eaveY, -D / 2 - GOH, 0, ridgeY, -D / 2 - GOH, LH, LW);
addBeam(-halfW - OH, eaveY, D / 2 + GOH, 0, ridgeY, D / 2 + GOH, LH, LW);
addBeam(halfW + OH, eaveY, D / 2 + GOH, 0, ridgeY, D / 2 + GOH, LH, LW);

// === 9. ROOF SHEATHING (partial coverage — under construction look) ===
function createRoofPanel(startT, endT, side, zStart, zEnd) {
    const eaveX = side * (halfW + OH);
    const x1 = eaveX + (0 - eaveX) * startT;
    const y1 = eaveY + (ridgeY - eaveY) * startT;
    const x2 = eaveX + (0 - eaveX) * endT;
    const y2 = eaveY + (ridgeY - eaveY) * endT;

    const dx = x2 - x1, dy = y2 - y1;
    const panelLen = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const geo = new THREE.BoxGeometry(panelLen, 0.08, zEnd - zStart);
    const mesh = new THREE.Mesh(geo, roofPanelMat);
    mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2 + 0.05, (zStart + zEnd) / 2);
    mesh.rotation.z = angle;
    scene.add(mesh);
}

// Left slope — lower 65% sheathed
createRoofPanel(0, 0.65, -1, -D / 2 - GOH, D / 2 + GOH);

// Right slope — lower 45% sheathed
createRoofPanel(0, 0.45, 1, -D / 2 - GOH, D / 2 + GOH);

// === 10. WALL TOP PLATES ===
addBeam(-halfW, wallTopY + LH / 2, -D / 2, -halfW, wallTopY + LH / 2, D / 2, LH, LH, frameMat);
addBeam(halfW, wallTopY + LH / 2, -D / 2, halfW, wallTopY + LH / 2, D / 2, LH, LH, frameMat);
addBeam(-halfW, wallTopY + LH / 2, -D / 2, halfW, wallTopY + LH / 2, -D / 2, LH, LH, frameMat);
addBeam(-halfW, wallTopY + LH / 2, D / 2, halfW, wallTopY + LH / 2, D / 2, LH, LH, frameMat);

// === 11. CORNER TRIM ===
const cornerTrimSize = 0.12;
const corners = [
    [-halfW - WT / 2, -D / 2 - WT / 2],
    [halfW + WT / 2, -D / 2 - WT / 2],
    [-halfW - WT / 2, D / 2 + WT / 2],
    [halfW + WT / 2, D / 2 + WT / 2]
];
corners.forEach(([cx, cz]) => {
    addBox(cornerTrimSize, WH, cornerTrimSize, cx, floorH + WH / 2, cz, frameMat);
});

// === CAMERA ===
camera.position.set(-28, 22, -24);
camera.lookAt(0, 5, 0);