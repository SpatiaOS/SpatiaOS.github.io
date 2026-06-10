// Materials
const mainMat = new THREE.MeshStandardMaterial({ 
    color: 0xaaaaaa, 
    roughness: 0.6, 
    metalness: 0.3 
});
const darkMat = new THREE.MeshStandardMaterial({ 
    color: 0x444444, 
    roughness: 0.7, 
    metalness: 0.5 
});
const shieldMat = new THREE.MeshStandardMaterial({ 
    color: 0x999999, 
    roughness: 0.5, 
    metalness: 0.4, 
    side: THREE.DoubleSide 
});

// Main Robot Group
const robot = new THREE.Group();
robot.position.y = 9; // Elevate to stand on ground
scene.add(robot);

// --- Pelvis ---
const pelvisGeom = new THREE.BoxGeometry(3, 1.5, 2);
const pelvis = new THREE.Mesh(pelvisGeom, mainMat);
robot.add(pelvis);

// --- Legs ---
function addLeg(isLeft) {
    const sign = isLeft ? 1 : -1;
    const hipX = 1.8 * sign;

    const hipPivot = new THREE.Group();
    hipPivot.position.set(hipX, 0, 0);
    hipPivot.rotation.z = -0.1 * sign; // Slight spread
    
    // Asymmetric pose
    if (isLeft) {
        hipPivot.rotation.x = 0.5;   // Thigh forward
    } else {
        hipPivot.rotation.x = 0.2;   // Thigh straighter
    }
    pelvis.add(hipPivot);

    const hipSphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), darkMat);
    hipPivot.add(hipSphere);

    // Upper Leg
    const upperLegGroup = new THREE.Group();
    upperLegGroup.position.set(0, -2, 0);
    hipPivot.add(upperLegGroup);
    
    const ulMain = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4, 0.8), mainMat);
    upperLegGroup.add(ulMain);
    
    // Technic holes detail
    for(let i=-1; i<=1; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.9, 8), darkMat);
        hole.rotation.x = Math.PI/2;
        hole.position.set(0, i*1.2, 0);
        upperLegGroup.add(hole);
    }

    // Knee
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -2, 0);
    if (isLeft) {
        kneePivot.rotation.x = -0.9; // Bend backward
    } else {
        kneePivot.rotation.x = -0.4;
    }
    upperLegGroup.add(kneePivot);

    const kneeCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 16), darkMat);
    kneeCyl.rotation.z = Math.PI/2;
    kneePivot.add(kneeCyl);

    // Lower Leg
    const lowerLegGroup = new THREE.Group();
    lowerLegGroup.position.set(0, -2, 0);
    kneePivot.add(lowerLegGroup);

    const llMain = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4, 0.6), mainMat);
    lowerLegGroup.add(llMain);
    
    for(let i=-1; i<=1; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 8), darkMat);
        hole.rotation.x = Math.PI/2;
        hole.position.set(0, i*1.2, 0);
        lowerLegGroup.add(hole);
    }

    // Ankle & Foot
    const anklePivot = new THREE.Group();
    anklePivot.position.set(0, -2, 0);
    if (isLeft) {
        anklePivot.rotation.x = 0.4; // Level foot
    } else {
        anklePivot.rotation.x = 0.2;
    }
    lowerLegGroup.add(anklePivot);

    const ankleSphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), darkMat);
    anklePivot.add(ankleSphere);

    const footGroup = new THREE.Group();
    footGroup.position.set(0, -0.6, 0.5);
    anklePivot.add(footGroup);

    const fBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 3.5), mainMat);
    footGroup.add(fBody);

    const toe = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16, 1, false, 0, Math.PI), mainMat);
    toe.rotation.z = Math.PI/2;
    toe.position.set(0, 0.6, 1.75);
    footGroup.add(toe);
}

addLeg(true);
addLeg(false);

// --- Torso ---
const torsoPivot = new THREE.Group();
torsoPivot.position.set(0, 0.5, 0);
torsoPivot.rotation.x = 0.3; // Lean forward
pelvis.add(torsoPivot);

const torso = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 2.5), mainMat);
torso.position.set(0, 2.5, 0);
torsoPivot.add(torso);

const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3, 0.5), mainMat);
chestPlate.position.set(0, 3, 1.3);
chestPlate.rotation.x = -0.2;
torsoPivot.add(chestPlate);

// Shoulder joints/gears
const gearGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16);
const gearL = new THREE.Mesh(gearGeom, darkMat);
gearL.rotation.z = Math.PI/2;
gearL.position.set(1.5, 4, 0);
torsoPivot.add(gearL);
const gearR = gearL.clone();
gearR.position.set(-1.5, 4, 0);
torsoPivot.add(gearR);

// --- Back Shield ---
const shieldGroup = new THREE.Group();
shieldGroup.position.set(0, 2.5, -0.5);
shieldGroup.rotation.x = -0.3; // Tilt back over the body
torsoPivot.add(shieldGroup);

// Main curved shell (arches over Y axis)
const shieldMainGeom = new THREE.CylinderGeometry(4.5, 4.5, 4, 32, 1, true, 0, Math.PI);
const shieldMain = new THREE.Mesh(shieldMainGeom, shieldMat);
shieldMain.rotation.z = Math.PI/2;
shieldGroup.add(shieldMain);

// Central crest
const crest = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.3, 8, 32, Math.PI), mainMat);
crest.rotation.y = Math.PI/2;
shieldGroup.add(crest);

// Back spikes
const spikeGeom = new THREE.CylinderGeometry(0.1, 0.3, 1.5);
const spike1 = new THREE.Mesh(spikeGeom, darkMat);
spike1.position.set(1.5, 2.5, -3.5);
spike1.rotation.x = -1.0;
shieldGroup.add(spike1);
const spike2 = new THREE.Mesh(spikeGeom, darkMat);
spike2.position.set(-1.5, 2.5, -3.5);
spike2.rotation.x = -1.0;
shieldGroup.add(spike2);

// --- Head ---
const neckPivot = new THREE.Group();
neckPivot.position.set(0, 4.5, 1.2);
neckPivot.rotation.x = 0.4; // Look down
torsoPivot.add(neckPivot);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5), darkMat);
neck.rotation.x = Math.PI/2;
neckPivot.add(neck);

const head = new THREE.Group();
head.position.set(0, 0, 1);
neckPivot.add(head);

const hBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 2), mainMat);
head.add(hBase);
const hTop = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2, 16, 1, false, 0, Math.PI), mainMat);
hTop.rotation.z = Math.PI/2;
hTop.position.set(0, 0.5, 0);
head.add(hTop);

// --- Arms ---
function addArm(isLeft) {
    const sign = isLeft ? 1 : -1;
    
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(1.8 * sign, 4, 0);
    shoulderPivot.rotation.x = Math.PI / 2 - 0.2; // Point forward
    shoulderPivot.rotation.z = 0.3 * sign; // Point outward slightly
    torsoPivot.add(shoulderPivot);

    const shoulderSphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), darkMat);
    shoulderPivot.add(shoulderSphere);

    const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3, 0.8), mainMat);
    upperArm.position.set(0, -1.5, 0);
    shoulderPivot.add(upperArm);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -3, 0);
    elbowPivot.rotation.x = -0.6; // Bend up/forward
    shoulderPivot.add(elbowPivot);

    const elbowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), darkMat);
    elbowPivot.add(elbowSphere);

    const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, 0.6), mainMat);
    lowerArm.position.set(0, -1.5, 0);
    elbowPivot.add(lowerArm);

    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, -3, 0);
    elbowPivot.add(wristPivot);

    if (isLeft) {
        // Complex Claw (Foreground)
        const clawBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.2), darkMat);
        wristPivot.add(clawBase);

        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4), mainMat);
        rod.position.set(0, -2, 0);
        wristPivot.add(rod);

        const pTopPivot = new THREE.Group();
        pTopPivot.position.set(0, -0.5, 0.6);
        pTopPivot.rotation.x = -0.2;
        wristPivot.add(pTopPivot);
        const pTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 0.4), mainMat);
        pTop.position.set(0, -1.75, 0);
        pTopPivot.add(pTop);

        const pBotPivot = new THREE.Group();
        pBotPivot.position.set(0, -0.5, -0.6);
        pBotPivot.rotation.x = 0.2;
        wristPivot.add(pBotPivot);
        const pBot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 0.4), mainMat);
        pBot.position.set(0, -1.75, 0);
        pBotPivot.add(pBot);

        // Spring rings
        const springGeom = new THREE.TorusGeometry(0.3, 0.05, 8, 16);
        for(let i=0; i<6; i++) {
            const s = new THREE.Mesh(springGeom, darkMat);
            s.rotation.x = Math.PI/2;
            s.position.set(0, -1 - i*0.3, 0);
            wristPivot.add(s);
        }
    } else {
        // Right Arm Weapon (Background)
        const wBase = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 1), darkMat);
        wristPivot.add(wBase);

        const barrelGeom = new THREE.CylinderGeometry(0.15, 0.15, 4);
        const b1 = new THREE.Mesh(barrelGeom, mainMat);
        b1.position.set(0.3, -2, 0);
        wristPivot.add(b1);
        const b2 = new THREE.Mesh(barrelGeom, mainMat);
        b2.position.set(-0.3, -2, 0);
        wristPivot.add(b2);

        const cross = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 0.2), darkMat);
        cross.position.set(0, -3, 0);
        wristPivot.add(cross);
    }
}

addArm(true);
addArm(false);

// Adjust camera for a good 3/4 perspective view
camera.position.set(18, 15, 22);
camera.lookAt(0, 8, 0);