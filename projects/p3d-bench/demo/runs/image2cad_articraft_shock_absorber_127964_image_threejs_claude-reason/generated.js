// Shock Absorber / Coilover Suspension Component
// Parameters
const springOuterRadius = 3.2;
const springWireRadius = 0.55;
const springCoils = 7;
const springHeight = 13;
const springBottomY = -5;
const shaftRadius = 0.7;
const damperRadius = 1.2;

// Material
const mat = new THREE.MeshStandardMaterial({
    color: 0xA8A8A8,
    metalness: 0.45,
    roughness: 0.45
});
const matDark = new THREE.MeshStandardMaterial({
    color: 0x909090,
    metalness: 0.5,
    roughness: 0.4
});

const group = new THREE.Group();

// ============================================
// BOTTOM EYE MOUNT
// ============================================
const bottomEyeY = -12.5;

// Bottom eye ring (torus rotated so hole is along X axis)
const bTorusGeo = new THREE.TorusGeometry(0.85, 0.45, 20, 32);
const bTorus = new THREE.Mesh(bTorusGeo, mat);
bTorus.position.set(0, bottomEyeY, 0);
bTorus.rotation.x = Math.PI / 2;
group.add(bTorus);

// Bottom eye side plates
const bPlateGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.5, 32);
const bPlate = new THREE.Mesh(bPlateGeo, mat);
bPlate.position.set(0, bottomEyeY, 0);
bPlate.rotation.x = Math.PI / 2;
group.add(bPlate);

// Connecting cylinder from bottom eye upward
const bConnGeo = new THREE.CylinderGeometry(0.9, 1.0, 1.2, 32);
const bConn = new THREE.Mesh(bConnGeo, mat);
bConn.position.y = bottomEyeY + 1.3;
group.add(bConn);

// Small collar/ring
const bCollarGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.5, 32);
const bCollar = new THREE.Mesh(bCollarGeo, mat);
bCollar.position.y = bottomEyeY + 2.1;
group.add(bCollar);

// ============================================
// LOWER DAMPER BODY
// ============================================
const lowerBodyGeo = new THREE.CylinderGeometry(damperRadius, damperRadius, 4.5, 32);
const lowerBody = new THREE.Mesh(lowerBodyGeo, mat);
lowerBody.position.y = bottomEyeY + 4.8;
group.add(lowerBody);

// ============================================
// LOWER SPRING SEAT (wide disc)
// ============================================
const lowerSeatY = springBottomY - 0.3;

// Lower seat base disc
const lSeatBaseGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.5, 32);
const lSeatBase = new THREE.Mesh(lSeatBaseGeo, mat);
lSeatBase.position.y = lowerSeatY;
group.add(lSeatBase);

// Lower seat top rim
const lSeatRimGeo = new THREE.CylinderGeometry(3.0, 3.5, 0.4, 32);
const lSeatRim = new THREE.Mesh(lSeatRimGeo, mat);
lSeatRim.position.y = lowerSeatY + 0.45;
group.add(lSeatRim);

// Inner collar on lower seat
const lSeatCollarGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.7, 32);
const lSeatCollar = new THREE.Mesh(lSeatCollarGeo, mat);
lSeatCollar.position.y = lowerSeatY + 0.8;
group.add(lSeatCollar);

// ============================================
// COIL SPRING
// ============================================
const helixPts = [];
const segments = springCoils * 100;
for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * springCoils * Math.PI * 2;
    const x = springOuterRadius * Math.cos(angle);
    const z = springOuterRadius * Math.sin(angle);
    const y = springBottomY + 0.5 + t * springHeight;
    helixPts.push(new THREE.Vector3(x, y, z));
}
const helixCurve = new THREE.CatmullRomCurve3(helixPts);
const springGeo = new THREE.TubeGeometry(helixCurve, segments, springWireRadius, 14, false);
const springMesh = new THREE.Mesh(springGeo, mat);
group.add(springMesh);

// Central rod visible through spring
const rodGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, springHeight + 5, 32);
const rod = new THREE.Mesh(rodGeo, matDark);
rod.position.y = springBottomY + springHeight / 2;
group.add(rod);

// ============================================
// UPPER SPRING SEAT
// ============================================
const springTopY = springBottomY + springHeight + 1;

// Upper collar below seat
const uCollarGeo = new THREE.CylinderGeometry(1.8, 2.2, 0.7, 32);
const uCollar = new THREE.Mesh(uCollarGeo, mat);
uCollar.position.y = springTopY - 0.2;
group.add(uCollar);

// Upper seat disc
const uSeatGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.5, 32);
const uSeat = new THREE.Mesh(uSeatGeo, mat);
uSeat.position.y = springTopY + 0.4;
group.add(uSeat);

// Step up from seat
const uStepGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.5, 32);
const uStep = new THREE.Mesh(uStepGeo, mat);
uStep.position.y = springTopY + 0.9;
group.add(uStep);

// ============================================
// CASTELLATED NOTCH RING (small detail)
// ============================================
const notchY = springTopY + 1.4;
const notchRingGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.6, 32);
const notchRing = new THREE.Mesh(notchRingGeo, matDark);
notchRing.position.y = notchY;
group.add(notchRing);

// Small notches around the ring
const numNotches = 16;
for (let i = 0; i < numNotches; i++) {
    const angle = (i / numNotches) * Math.PI * 2;
    const nGeo = new THREE.BoxGeometry(0.35, 0.6, 0.35);
    const nMesh = new THREE.Mesh(nGeo, matDark);
    nMesh.position.x = Math.cos(angle) * 2.15;
    nMesh.position.z = Math.sin(angle) * 2.15;
    nMesh.position.y = notchY;
    nMesh.rotation.y = -angle;
    group.add(nMesh);
}

// ============================================
// GEAR / PRELOAD ADJUSTMENT RING
// ============================================
const gearY = springTopY + 2.4;
const gearBaseRadius = 2.5;
const numTeeth = 10;
const gearH = 1.6;

// Hub
const gearHubGeo = new THREE.CylinderGeometry(gearBaseRadius, gearBaseRadius, gearH, 32);
const gearHub = new THREE.Mesh(gearHubGeo, mat);
gearHub.position.y = gearY;
group.add(gearHub);

// Teeth
for (let i = 0; i < numTeeth; i++) {
    const angle = (i / numTeeth) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(1.0, gearH, 1.4);
    const tooth = new THREE.Mesh(toothGeo, mat);
    const dist = gearBaseRadius + 0.5;
    tooth.position.x = Math.cos(angle) * dist;
    tooth.position.z = Math.sin(angle) * dist;
    tooth.position.y = gearY;
    tooth.rotation.y = -angle + Math.PI / 2;
    group.add(tooth);
}

// Top cap of gear ring
const gearCapGeo = new THREE.CylinderGeometry(2.2, gearBaseRadius, 0.5, 32);
const gearCap = new THREE.Mesh(gearCapGeo, mat);
gearCap.position.y = gearY + gearH / 2 + 0.2;
group.add(gearCap);

// ============================================
// UPPER NECK / BODY
// ============================================
const neckY = gearY + 1.8;
const neckGeo = new THREE.CylinderGeometry(1.4, 1.8, 1.8, 32);
const neck = new THREE.Mesh(neckGeo, mat);
neck.position.y = neckY;
group.add(neck);

// Transition piece
const transGeo = new THREE.CylinderGeometry(1.5, 1.4, 1.0, 32);
const trans = new THREE.Mesh(transGeo, mat);
trans.position.y = neckY + 1.4;
group.add(trans);

// ============================================
// TOP EYE MOUNT
// ============================================
const topEyeY = neckY + 3.2;

// Main body block of eye mount
const topBlockGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.0, 32);
const topBlock = new THREE.Mesh(topBlockGeo, mat);
topBlock.position.y = topEyeY;
group.add(topBlock);

// Rounded top
const topDomeGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const topDome = new THREE.Mesh(topDomeGeo, mat);
topDome.position.y = topEyeY + 1.0;
group.add(topDome);

// Eye cheeks (two side plates)
const cheekGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.0, 32);
const leftCheek = new THREE.Mesh(cheekGeo, mat);
leftCheek.position.set(0, topEyeY + 1.0, 0);
leftCheek.rotation.x = Math.PI / 2;
group.add(leftCheek);

// Eye torus (the mounting ring with hole)
const tTorusGeo = new THREE.TorusGeometry(0.9, 0.5, 20, 32);
const tTorus = new THREE.Mesh(tTorusGeo, mat);
tTorus.position.set(0, topEyeY + 1.0, 0);
tTorus.rotation.x = Math.PI / 2;
group.add(tTorus);

// Small cylindrical bushings visible in eye
const bushingGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.2, 32);
const bushing = new THREE.Mesh(bushingGeo, matDark);
bushing.position.set(0, topEyeY + 1.0, 0);
bushing.rotation.x = Math.PI / 2;
group.add(bushing);

// ============================================
// BOTTOM EYE DETAIL - bushing ring
// ============================================
const bBushingGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 32);
const bBushing = new THREE.Mesh(bBushingGeo, matDark);
bBushing.position.set(0, bottomEyeY, 0);
bBushing.rotation.x = Math.PI / 2;
group.add(bBushing);

// Add to scene
scene.add(group);

// Position camera for good view
camera.position.set(16, 8, 16);
camera.lookAt(0, 2, 0);