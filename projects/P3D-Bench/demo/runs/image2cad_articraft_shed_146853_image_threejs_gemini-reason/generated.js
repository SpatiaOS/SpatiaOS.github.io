// Parameters
const shedWidth = 12;
const shedDepth = 18;
const wallHeight = 8;
const roofHeight = 4;
const wallBaseY = 1.0; // Elevation of the wall bottom

// Materials
const matBase = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 });
const matTrim = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
const matRoof = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.9 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });

// 1. Base and Floor
const baseTrimGeom = new THREE.BoxGeometry(shedWidth + 0.2, 1.0, shedDepth + 0.2);
const baseTrim = new THREE.Mesh(baseTrimGeom, matTrim);
baseTrim.position.y = 0.5;
scene.add(baseTrim);

const floorGeom = new THREE.BoxGeometry(shedWidth, 0.1, shedDepth);
const floor = new THREE.Mesh(floorGeom, matTrim);
floor.position.y = wallBaseY + 0.05;
scene.add(floor);

// 2. Walls
// Front Wall (with door opening)
const frontLeftGeom = new THREE.BoxGeometry(3, wallHeight, 0.2);
const frontLeft = new THREE.Mesh(frontLeftGeom, matBase);
frontLeft.position.set(-4.5, wallBaseY + wallHeight / 2, shedDepth / 2 - 0.1);
scene.add(frontLeft);

const frontRightGeom = new THREE.BoxGeometry(3, wallHeight, 0.2);
const frontRight = new THREE.Mesh(frontRightGeom, matBase);
frontRight.position.set(4.5, wallBaseY + wallHeight / 2, shedDepth / 2 - 0.1);
scene.add(frontRight);

const frontTopGeom = new THREE.BoxGeometry(6, 1.5, 0.2);
const frontTop = new THREE.Mesh(frontTopGeom, matBase);
frontTop.position.set(0, wallBaseY + wallHeight - 0.75, shedDepth / 2 - 0.1);
scene.add(frontTop);

// Back Wall
const backWallGeom = new THREE.BoxGeometry(shedWidth, wallHeight, 0.2);
const backWall = new THREE.Mesh(backWallGeom, matBase);
backWall.position.set(0, wallBaseY + wallHeight / 2, -shedDepth / 2 + 0.1);
scene.add(backWall);

// Side Walls
const sideWallGeom = new THREE.BoxGeometry(0.2, wallHeight, shedDepth);
const leftWall = new THREE.Mesh(sideWallGeom, matBase);
leftWall.position.set(-shedWidth / 2 + 0.1, wallBaseY + wallHeight / 2, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(sideWallGeom, matBase);
rightWall.position.set(shedWidth / 2 - 0.1, wallBaseY + wallHeight / 2, 0);
scene.add(rightWall);

// 3. Gables
const gableGeom = new THREE.BufferGeometry();
const gableVertices = new Float32Array([
    -shedWidth / 2, 0, 0.1,
    shedWidth / 2, 0, 0.1,
    0, roofHeight, 0.1,
    -shedWidth / 2, 0, -0.1,
    0, roofHeight, -0.1,
    shedWidth / 2, 0, -0.1,
]);
const gableIndices = [
    0, 1, 2, // front
    5, 3, 4, // back
    0, 2, 4, 0, 4, 3, // left
    1, 5, 4, 1, 4, 2, // right
    0, 3, 5, 0, 5, 1  // bottom
];
gableGeom.setAttribute('position', new THREE.BufferAttribute(gableVertices, 3));
gableGeom.setIndex(gableIndices);
gableGeom.computeVertexNormals();

const frontGable = new THREE.Mesh(gableGeom, matBase);
frontGable.position.set(0, wallBaseY + wallHeight, shedDepth / 2 - 0.1);
scene.add(frontGable);

const backGable = new THREE.Mesh(gableGeom, matBase);
backGable.position.set(0, wallBaseY + wallHeight, -shedDepth / 2 + 0.1);
scene.add(backGable);

// 4. Trims and Battens (Vertical panel lines)
const cornerTrimGeom = new THREE.BoxGeometry(0.4, wallHeight, 0.4);
const corners = [
    [-shedWidth / 2, shedDepth / 2], [shedWidth / 2, shedDepth / 2],
    [-shedWidth / 2, -shedDepth / 2], [shedWidth / 2, -shedDepth / 2]
];
corners.forEach(pos => {
    const corner = new THREE.Mesh(cornerTrimGeom, matTrim);
    corner.position.set(pos[0], wallBaseY + wallHeight / 2, pos[1]);
    scene.add(corner);
});

const topTrimFrontGeom = new THREE.BoxGeometry(shedWidth + 0.4, 0.4, 0.2);
const topTrimFront = new THREE.Mesh(topTrimFrontGeom, matTrim);
topTrimFront.position.set(0, wallBaseY + wallHeight - 0.2, shedDepth / 2 + 0.1);
scene.add(topTrimFront);

const topTrimBack = new THREE.Mesh(topTrimFrontGeom, matTrim);
topTrimBack.position.set(0, wallBaseY + wallHeight - 0.2, -shedDepth / 2 - 0.1);
scene.add(topTrimBack);

const topTrimSideGeom = new THREE.BoxGeometry(0.2, 0.4, shedDepth + 0.4);
const topTrimLeft = new THREE.Mesh(topTrimSideGeom, matTrim);
topTrimLeft.position.set(-shedWidth / 2 - 0.1, wallBaseY + wallHeight - 0.2, 0);
scene.add(topTrimLeft);

const topTrimRight = new THREE.Mesh(topTrimSideGeom, matTrim);
topTrimRight.position.set(shedWidth / 2 + 0.1, wallBaseY + wallHeight - 0.2, 0);
scene.add(topTrimRight);

// Vertical Battens
const battenGeom = new THREE.BoxGeometry(0.05, wallHeight, 0.05);
for (let z = -shedDepth / 2 + 1.0; z < shedDepth / 2; z += 1.0) {
    const battenL = new THREE.Mesh(battenGeom, matTrim);
    battenL.position.set(-shedWidth / 2 - 0.025, wallBaseY + wallHeight / 2, z);
    scene.add(battenL);
    const battenR = new THREE.Mesh(battenGeom, matTrim);
    battenR.position.set(shedWidth / 2 + 0.025, wallBaseY + wallHeight / 2, z);
    scene.add(battenR);
}

[-5, -4, 4, 5].forEach(x => {
    const bFront = new THREE.Mesh(battenGeom, matTrim);
    bFront.position.set(x, wallBaseY + wallHeight / 2, shedDepth / 2 + 0.025);
    scene.add(bFront);
});

for (let x = -5; x <= 5; x += 1.0) {
    if (x === 0) continue;
    const bBack = new THREE.Mesh(battenGeom, matTrim);
    bBack.position.set(x, wallBaseY + wallHeight / 2, -shedDepth / 2 - 0.025);
    scene.add(bBack);
}

// Gable Battens
[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].forEach(x => {
    const h = roofHeight * (1 - Math.abs(x) / (shedWidth / 2));
    if (h > 0.1) {
        const bGeom = new THREE.BoxGeometry(0.05, h, 0.05);
        const bFront = new THREE.Mesh(bGeom, matTrim);
        bFront.position.set(x, wallBaseY + wallHeight + h / 2, shedDepth / 2 + 0.025);
        scene.add(bFront);
        const bBack = new THREE.Mesh(bGeom, matTrim);
        bBack.position.set(x, wallBaseY + wallHeight + h / 2, -shedDepth / 2 - 0.025);
        scene.add(bBack);
    }
});

// 5. Doors
const doorGroup = new THREE.Group();
doorGroup.position.set(0, wallBaseY, shedDepth / 2 + 0.05);

const doorGeom = new THREE.BoxGeometry(2.9, 6.4, 0.1);
const doorLeft = new THREE.Mesh(doorGeom, matBase);
doorLeft.position.set(-1.5, 3.2, 0);
doorGroup.add(doorLeft);

const doorRight = new THREE.Mesh(doorGeom, matBase);
doorRight.position.set(1.5, 3.2, 0);
doorGroup.add(doorRight);

const doorFrameVertGeom = new THREE.BoxGeometry(0.3, 6.4, 0.15);
const doorFrameHorizGeom = new THREE.BoxGeometry(2.9, 0.3, 0.15);
const doorBattenGeom = new THREE.BoxGeometry(0.05, 6.4, 0.05);

[doorLeft, doorRight].forEach((door, index) => {
    const sign = index === 0 ? -1 : 1;
    const dLeft = new THREE.Mesh(doorFrameVertGeom, matTrim);
    dLeft.position.set(-1.3, 0, 0);
    door.add(dLeft);
    const dRight = new THREE.Mesh(doorFrameVertGeom, matTrim);
    dRight.position.set(1.3, 0, 0);
    door.add(dRight);
    const dTop = new THREE.Mesh(doorFrameHorizGeom, matTrim);
    dTop.position.set(0, 3.05, 0);
    door.add(dTop);
    const dBot = new THREE.Mesh(doorFrameHorizGeom, matTrim);
    dBot.position.set(0, -3.05, 0);
    door.add(dBot);

    [-0.5, 0.5].forEach(bx => {
        const db = new THREE.Mesh(doorBattenGeom, matTrim);
        db.position.set(bx, 0, 0.075);
        door.add(db);
    });

    const hingeGeom = new THREE.BoxGeometry(0.2, 0.4, 0.2);
    [-2.5, 0, 2.5].forEach(y => {
        const hinge = new THREE.Mesh(hingeGeom, matDark);
        hinge.position.set(sign * 1.45, y, 0.1);
        door.add(hinge);
    });
});

const handleGeom = new THREE.BoxGeometry(0.1, 0.4, 0.1);
const handle = new THREE.Mesh(handleGeom, matDark);
handle.position.set(-1.2, 0, 0.15);
doorRight.add(handle);
scene.add(doorGroup);

// 6. Roof Framing
const angle = Math.atan2(roofHeight, shedWidth / 2);
const rafterLength = 7.8;
const rafterGeomX = new THREE.BoxGeometry(rafterLength, 0.6, 0.2);

// Ridge Beam
const ridgeGeom = new THREE.BoxGeometry(0.2, 0.6, shedDepth + 0.2);
const ridge = new THREE.Mesh(ridgeGeom, matRoof);
ridge.position.set(0, wallBaseY + wallHeight + roofHeight - 0.3, 0);
scene.add(ridge);

// Rafters and Collar Ties
const numRafters = 11;
const rafterSpacing = shedDepth / (numRafters - 1);
const tieGeom = new THREE.BoxGeometry(6, 0.4, 0.2);

for (let i = 0; i < numRafters; i++) {
    const z = -shedDepth / 2 + i * rafterSpacing;
    
    const rafterL = new THREE.Mesh(rafterGeomX, matRoof);
    rafterL.position.set(-3.25, wallBaseY + 10.835, z);
    rafterL.rotation.z = angle;
    scene.add(rafterL);
    
    const rafterR = new THREE.Mesh(rafterGeomX, matRoof);
    rafterR.position.set(3.25, wallBaseY + 10.835, z);
    rafterR.rotation.z = -angle;
    scene.add(rafterR);
    
    if (i > 0 && i < numRafters - 1) {
        const tie = new THREE.Mesh(tieGeom, matRoof);
        tie.position.set(0, wallBaseY + 10, z);
        scene.add(tie);
    }
}

// Fly Rafters (Gable Trims)
const gableTrims = [
    { x: -3.25, z: shedDepth / 2 + 0.1, a: angle },
    { x: 3.25, z: shedDepth / 2 + 0.1, a: -angle },
    { x: -3.25, z: -shedDepth / 2 - 0.1, a: angle },
    { x: 3.25, z: -shedDepth / 2 - 0.1, a: -angle }
];
gableTrims.forEach(pos => {
    const gTrim = new THREE.Mesh(rafterGeomX, matTrim);
    gTrim.position.set(pos.x, wallBaseY + 10.835, pos.z);
    gTrim.rotation.z = pos.a;
    scene.add(gTrim);
});

// Purlins
const purlinGeom = new THREE.BoxGeometry(0.15, 0.15, shedDepth + 0.2);
const numPurlins = 6;
const purlinSpacingDist = rafterLength / numPurlins;

for (let i = 1; i < numPurlins; i++) {
    const dist = i * purlinSpacingDist;
    
    const dxL = -dist * Math.cos(angle);
    const dyL = -dist * Math.sin(angle);
    const nxL = -Math.sin(angle);
    const nyL = Math.cos(angle);
    
    const purlinL = new THREE.Mesh(purlinGeom, matRoof);
    purlinL.position.set(dxL + nxL * 0.375, wallBaseY + 13 + dyL + nyL * 0.375, 0);
    purlinL.rotation.z = angle;
    scene.add(purlinL);
    
    const dxR = dist * Math.cos(angle);
    const dyR = -dist * Math.sin(angle);
    const nxR = Math.sin(angle);
    const nyR = Math.cos(angle);
    
    const purlinR = new THREE.Mesh(purlinGeom, matRoof);
    purlinR.position.set(dxR + nxR * 0.375, wallBaseY + 13 + dyR + nyR * 0.375, 0);
    purlinR.rotation.z = -angle;
    scene.add(purlinR);
}

// Roof Sheathing (Partial Cover on Front-Left)
const sheathingDepth = 5.5;
const sheathingGeom = new THREE.BoxGeometry(rafterLength, 0.1, sheathingDepth);
const sheathing = new THREE.Mesh(sheathingGeom, matBase);
sheathing.position.set(-3.527, wallBaseY + 11.251, 6.35);
sheathing.rotation.z = angle;
scene.add(sheathing);

// Adjust Camera
camera.position.set(25, 20, 30);
camera.lookAt(0, 5, 0);