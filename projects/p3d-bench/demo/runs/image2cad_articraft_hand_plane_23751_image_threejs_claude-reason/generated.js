// ============================================
// Dual Ball Mount Trailer Hitch Adapter
// Two different-sized tow balls on a shaped base plate
// with central pivot/locking mechanism
// ============================================

// === Materials ===
const metalMat = new THREE.MeshStandardMaterial({
    color: 0xb8b8b8,
    metalness: 0.65,
    roughness: 0.28,
});

const darkMat = new THREE.MeshStandardMaterial({
    color: 0x454545,
    metalness: 0.8,
    roughness: 0.5,
});

const labelMat = new THREE.MeshStandardMaterial({
    color: 0x252525,
    metalness: 0.2,
    roughness: 0.8,
});

// === Parameters ===
const plateThick = 0.55;
const leftBallX = -4.5;
const rightBallX = 4.5;
const largeBallRadius = 1.15;
const smallBallRadius = 1.0;

// ================================================
// 1. BASE PLATE - Dumbbell/dog-bone shape
// ================================================
const plateShape = new THREE.Shape();

plateShape.moveTo(-7, 0);
// Top half (clockwise, left to right)
plateShape.bezierCurveTo(-7, 2.2, -6.2, 3.2, -4.5, 3.2);
plateShape.bezierCurveTo(-3.0, 3.2, -2.0, 2.6, -0.5, 1.8);
plateShape.bezierCurveTo(0.5, 1.3, 1.5, 1.3, 2.5, 1.8);
plateShape.bezierCurveTo(3.5, 2.3, 4.0, 2.7, 4.5, 2.7);
plateShape.bezierCurveTo(5.8, 2.7, 6.8, 1.8, 6.8, 0);
// Bottom half (right to left)
plateShape.bezierCurveTo(6.8, -1.8, 5.8, -2.7, 4.5, -2.7);
plateShape.bezierCurveTo(4.0, -2.7, 3.5, -2.3, 2.5, -1.8);
plateShape.bezierCurveTo(1.5, -1.3, 0.5, -1.3, -0.5, -1.8);
plateShape.bezierCurveTo(-2.0, -2.6, -3.0, -3.2, -4.5, -3.2);
plateShape.bezierCurveTo(-6.2, -3.2, -7, -2.2, -7, 0);

// Mounting pin holes in bridge area
const addHole = (cx, cy, r) => {
    const h = new THREE.Path();
    h.absellipse(cx, cy, r, r, 0, Math.PI * 2, false);
    plateShape.holes.push(h);
};
addHole(2.2, 0, 0.25);
addHole(3.2, 0, 0.25);
addHole(1.8, 0.7, 0.18);
addHole(1.8, -0.7, 0.18);

const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
    depth: plateThick,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 3,
});
const plateMesh = new THREE.Mesh(plateGeo, metalMat);
plateMesh.rotation.x = -Math.PI / 2;
scene.add(plateMesh);

// Raised rim/step on plate (slightly inset, thinner layer on top)
const rimShape = new THREE.Shape();
rimShape.moveTo(-6.5, 0);
rimShape.bezierCurveTo(-6.5, 1.9, -5.8, 2.8, -4.5, 2.8);
rimShape.bezierCurveTo(-3.2, 2.8, -2.2, 2.2, -0.7, 1.5);
rimShape.bezierCurveTo(0.3, 1.1, 1.3, 1.1, 2.3, 1.5);
rimShape.bezierCurveTo(3.3, 1.9, 3.8, 2.3, 4.5, 2.3);
rimShape.bezierCurveTo(5.5, 2.3, 6.3, 1.5, 6.3, 0);
rimShape.bezierCurveTo(6.3, -1.5, 5.5, -2.3, 4.5, -2.3);
rimShape.bezierCurveTo(3.8, -2.3, 3.3, -1.9, 2.3, -1.5);
rimShape.bezierCurveTo(1.3, -1.1, 0.3, -1.1, -0.7, -1.5);
rimShape.bezierCurveTo(-2.2, -2.2, -3.2, -2.8, -4.5, -2.8);
rimShape.bezierCurveTo(-5.8, -2.8, -6.5, -1.9, -6.5, 0);

// Add same holes to rim
addHole.bind(null);
const rimHoles = [[2.2, 0, 0.25], [3.2, 0, 0.25], [1.8, 0.7, 0.18], [1.8, -0.7, 0.18]];
rimHoles.forEach(([cx, cy, r]) => {
    const h = new THREE.Path();
    h.absellipse(cx, cy, r, r, 0, Math.PI * 2, false);
    rimShape.holes.push(h);
});

const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
});
const rimMesh = new THREE.Mesh(rimGeo, metalMat);
rimMesh.rotation.x = -Math.PI / 2;
rimMesh.position.y = plateThick;
scene.add(rimMesh);

// ================================================
// 2. LEFT TOW BALL (larger, ~2-5/16")
// ================================================
const leftGroup = new THREE.Group();
leftGroup.position.set(leftBallX, plateThick + 0.15, 0);

// Flared base collar
const lBaseGeo = new THREE.CylinderGeometry(0.85, 1.15, 0.35, 32);
const lBase = new THREE.Mesh(lBaseGeo, metalMat);
lBase.position.y = 0.175;
leftGroup.add(lBase);

// Upper collar ring
const lCollarGeo = new THREE.CylinderGeometry(0.75, 0.85, 0.15, 32);
const lCollar = new THREE.Mesh(lCollarGeo, metalMat);
lCollar.position.y = 0.425;
leftGroup.add(lCollar);

// Neck/stem
const lNeckGeo = new THREE.CylinderGeometry(0.48, 0.52, 1.2, 20);
const lNeck = new THREE.Mesh(lNeckGeo, metalMat);
lNeck.position.y = 0.5 + 0.6;
leftGroup.add(lNeck);

// Transition to ball
const lTransGeo = new THREE.SphereGeometry(0.55, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const lTrans = new THREE.Mesh(lTransGeo, metalMat);
lTrans.position.y = 1.1 + 0.45;
leftGroup.add(lTrans);

// Ball (slightly egg-shaped)
const lBallGeo = new THREE.SphereGeometry(largeBallRadius, 32, 24);
const lBall = new THREE.Mesh(lBallGeo, metalMat);
lBall.position.y = 1.7 + largeBallRadius * 0.8;
lBall.scale.y = 1.12;
leftGroup.add(lBall);

// Slot on top of ball
const lSlotGeo = new THREE.BoxGeometry(1.0, 0.1, 0.18);
const lSlot = new THREE.Mesh(lSlotGeo, darkMat);
lSlot.position.y = 1.7 + largeBallRadius * 2.15;
leftGroup.add(lSlot);

scene.add(leftGroup);

// ================================================
// 3. RIGHT TOW BALL (smaller, ~2")
// ================================================
const rightGroup = new THREE.Group();
rightGroup.position.set(rightBallX, plateThick + 0.15, 0);

// Flared base collar
const rBaseGeo = new THREE.CylinderGeometry(0.72, 0.95, 0.3, 32);
const rBase = new THREE.Mesh(rBaseGeo, metalMat);
rBase.position.y = 0.15;
rightGroup.add(rBase);

// Upper collar ring
const rCollarGeo = new THREE.CylinderGeometry(0.62, 0.72, 0.12, 32);
const rCollar = new THREE.Mesh(rCollarGeo, metalMat);
rCollar.position.y = 0.36;
rightGroup.add(rCollar);

// Neck/stem
const rNeckGeo = new THREE.CylinderGeometry(0.4, 0.45, 1.0, 20);
const rNeck = new THREE.Mesh(rNeckGeo, metalMat);
rNeck.position.y = 0.42 + 0.5;
rightGroup.add(rNeck);

// Ball
const rBallGeo = new THREE.SphereGeometry(smallBallRadius, 32, 24);
const rBall = new THREE.Mesh(rBallGeo, metalMat);
rBall.position.y = 1.42 + smallBallRadius * 0.8;
rBall.scale.y = 1.1;
rightGroup.add(rBall);

// Slot on top
const rSlotGeo = new THREE.BoxGeometry(0.8, 0.1, 0.15);
const rSlot = new THREE.Mesh(rSlotGeo, darkMat);
rSlot.position.y = 1.42 + smallBallRadius * 2.1;
rightGroup.add(rSlot);

scene.add(rightGroup);

// ================================================
// 4. CENTRAL PIVOT/LOCKING MECHANISM
// ================================================
const centerGroup = new THREE.Group();
centerGroup.position.set(0, plateThick + 0.15, 0);

// Lower fixed disc
const cLowerDiscGeo = new THREE.CylinderGeometry(1.55, 1.65, 0.2, 32);
const cLowerDisc = new THREE.Mesh(cLowerDiscGeo, metalMat);
cLowerDisc.position.y = 0.1;
centerGroup.add(cLowerDisc);

// Groove ring (visual separation between fixed and rotating parts)
const cGrooveGeo = new THREE.TorusGeometry(1.5, 0.06, 8, 32);
const cGroove = new THREE.Mesh(cGrooveGeo, darkMat);
cGroove.position.y = 0.2;
cGroove.rotation.x = Math.PI / 2;
centerGroup.add(cGroove);

// Upper rotating disc
const cUpperDiscGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.25, 32);
const cUpperDisc = new THREE.Mesh(cUpperDiscGeo, metalMat);
cUpperDisc.position.y = 0.2 + 0.125;
centerGroup.add(cUpperDisc);

// Disc cap
const cCapGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.15, 32);
const cCap = new THREE.Mesh(cCapGeo, metalMat);
cCap.position.y = 0.45 + 0.075;
centerGroup.add(cCap);

// Central cylindrical boss
const cBossGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.4, 24);
const cBoss = new THREE.Mesh(cBossGeo, metalMat);
cBoss.position.y = 0.6 + 0.2;
centerGroup.add(cBoss);

// Threaded bolt shaft
const cBoltGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.5, 12);
const cBolt = new THREE.Mesh(cBoltGeo, metalMat);
cBolt.position.y = 1.0 + 0.75;
centerGroup.add(cBolt);

// Thread detail (torus rings along bolt)
for (let i = 0; i < 10; i++) {
    const threadGeo = new THREE.TorusGeometry(0.2, 0.018, 4, 24);
    const thread = new THREE.Mesh(threadGeo, metalMat);
    thread.position.y = 1.0 + 0.15 + i * 0.11;
    thread.rotation.x = Math.PI / 2;
    centerGroup.add(thread);
}

// Flat washer
const cWasherGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24);
const cWasher = new THREE.Mesh(cWasherGeo, metalMat);
cWasher.position.y = 1.0 + 1.3;
centerGroup.add(cWasher);

// Knurled washer (dark, thicker)
const cKnurlGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.18, 32);
const cKnurl = new THREE.Mesh(cKnurlGeo, darkMat);
cKnurl.position.y = 1.0 + 1.42;
centerGroup.add(cKnurl);

// Knurl detail (small ridges around edge)
for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const ridgeGeo = new THREE.BoxGeometry(0.04, 0.16, 0.08);
    const ridge = new THREE.Mesh(ridgeGeo, darkMat);
    ridge.position.set(
        Math.cos(angle) * 0.58,
        1.0 + 1.42,
        Math.sin(angle) * 0.58
    );
    ridge.rotation.y = -angle;
    centerGroup.add(ridge);
}

// Hex nut on top
const nutRadius = 0.42;
const nutShp = new THREE.Shape();
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const nx = Math.cos(angle) * nutRadius;
    const ny = Math.sin(angle) * nutRadius;
    if (i === 0) nutShp.moveTo(nx, ny);
    else nutShp.lineTo(nx, ny);
}
nutShp.closePath();
const nutGeo = new THREE.ExtrudeGeometry(nutShp, { depth: 0.3, bevelEnabled: false });
const nutMesh = new THREE.Mesh(nutGeo, metalMat);
nutMesh.rotation.x = -Math.PI / 2;
nutMesh.position.y = 1.0 + 1.55;
centerGroup.add(nutMesh);

// === Side-mounted thumb/set screw ===
const screwGroup = new THREE.Group();

// Screw shaft
const scShaftGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 8);
const scShaft = new THREE.Mesh(scShaftGeo, metalMat);
screwGroup.add(scShaft);

// Thread on screw shaft
for (let i = 0; i < 6; i++) {
    const stGeo = new THREE.TorusGeometry(0.08, 0.012, 4, 12);
    const st = new THREE.Mesh(stGeo, metalMat);
    st.position.y = -0.3 + i * 0.08;
    st.rotation.x = Math.PI / 2;
    screwGroup.add(st);
}

// Knurled thumb head
const scHeadGeo = new THREE.CylinderGeometry(0.25, 0.22, 0.4, 20);
const scHead = new THREE.Mesh(scHeadGeo, metalMat);
scHead.position.y = 0.7;
screwGroup.add(scHead);

// Knurl on head
for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const krGeo = new THREE.BoxGeometry(0.03, 0.35, 0.05);
    const kr = new THREE.Mesh(krGeo, metalMat);
    kr.position.set(Math.cos(a) * 0.25, 0.7, Math.sin(a) * 0.25);
    kr.rotation.y = -a;
    screwGroup.add(kr);
}

// Rotate to horizontal and position
screwGroup.rotation.z = Math.PI / 2;
screwGroup.position.set(1.0, 0.85, -0.8);
screwGroup.rotation.order = 'YXZ';
screwGroup.rotation.y = Math.PI * 0.15;
centerGroup.add(screwGroup);

// === Vertical locating pins ===
// Pin 1 (left of center)
const pin1Geo = new THREE.CylinderGeometry(0.09, 0.09, 1.0, 8);
const pin1 = new THREE.Mesh(pin1Geo, metalMat);
pin1.position.set(-0.75, 0.5, -0.3);
centerGroup.add(pin1);

// Pin 2 (small post)
const pin2Geo = new THREE.CylinderGeometry(0.09, 0.09, 0.7, 8);
const pin2 = new THREE.Mesh(pin2Geo, metalMat);
pin2.position.set(0.4, 0.35, 0.6);
centerGroup.add(pin2);

// Pin 3 (taller post near center)
const pin3Geo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 10);
const pin3 = new THREE.Mesh(pin3Geo, metalMat);
pin3.position.set(-0.4, 0.6, 0.5);
centerGroup.add(pin3);

scene.add(centerGroup);

// ================================================
// 5. LABELS / NAMEPLATES on plate surface
// ================================================
// Left label near left ball ("STAN" text area)
const lab1Geo = new THREE.BoxGeometry(1.2, 0.03, 0.7);
const lab1 = new THREE.Mesh(lab1Geo, labelMat);
lab1.position.set(-3.2, plateThick + 0.17, 1.2);
scene.add(lab1);

// Right label near right ball ("Mk II" text area)
const lab2Geo = new THREE.BoxGeometry(0.9, 0.03, 0.5);
const lab2 = new THREE.Mesh(lab2Geo, labelMat);
lab2.position.set(3.5, plateThick + 0.17, 0.8);
scene.add(lab2);

// Small label near left ball
const lab3Geo = new THREE.BoxGeometry(0.8, 0.03, 0.5);
const lab3 = new THREE.Mesh(lab3Geo, labelMat);
lab3.position.set(-2.8, plateThick + 0.17, -0.8);
scene.add(lab3);

// ================================================
// 6. EDGE CHAMFER DETAIL - Arch-shaped cutouts
// (Represented as concave cylinders at plate edges)
// ================================================
// Left side arch cutout (front edge)
const archGeo1 = new THREE.CylinderGeometry(1.5, 1.5, plateThick + 0.4, 16, 1, true, 0, Math.PI);
const archMat = new THREE.MeshStandardMaterial({
    color: 0xb8b8b8,
    metalness: 0.65,
    roughness: 0.28,
    side: THREE.BackSide
});

// ================================================
// Camera Setup
// ================================================
camera.position.set(18, 13, 16);
camera.lookAt(0, 1.5, 0);