// ================================================
// Steam Winch / Hoisting Engine Model
// ================================================

// --- Materials ---
const metalMat = new THREE.MeshStandardMaterial({ 
    color: 0x9a9a9e, metalness: 0.3, roughness: 0.55 
});
const darkMetalMat = new THREE.MeshStandardMaterial({ 
    color: 0x606068, metalness: 0.5, roughness: 0.4 
});

// --- Layout: shaft along Z axis, Y up ---
const shaftY = 9; // shaft center height above ground

// =====================
//  BASE PLATE
// =====================

// Bottom mounting flange
const baseFlange = new THREE.Mesh(
    new THREE.BoxGeometry(19, 0.5, 22), metalMat
);
baseFlange.position.set(0, 0.25, 1.5);
scene.add(baseFlange);

// Raised base platform
const basePlatform = new THREE.Mesh(
    new THREE.BoxGeometry(15, 1.5, 20), metalMat
);
basePlatform.position.set(0, 1.25, 1.5);
scene.add(basePlatform);

// Mounting bolt pads at corners
[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([sx, sz]) => {
    const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 0.3, 16), metalMat
    );
    pad.position.set(sx * 8, 0.15, 1.5 + sz * 9.5);
    scene.add(pad);
});

// =====================
//  SUPPORT HOUSING
// =====================

// Main support block between drum and wheels
const supportBlock = new THREE.Mesh(
    new THREE.BoxGeometry(12, 6.5, 9), metalMat
);
supportBlock.position.set(0, 5.25, 2.5);
scene.add(supportBlock);

// Bearing housings (cylindrical bosses for shaft journals)
const bearingGeo = new THREE.CylinderGeometry(3.2, 3.5, 1.8, 32);

const bearing1 = new THREE.Mesh(bearingGeo, metalMat);
bearing1.rotation.x = Math.PI / 2;
bearing1.position.set(0, shaftY, -0.5);
scene.add(bearing1);

const bearing2 = new THREE.Mesh(bearingGeo, metalMat);
bearing2.rotation.x = Math.PI / 2;
bearing2.position.set(0, shaftY, 6);
scene.add(bearing2);

// Side gusset plates (structural reinforcement)
for (const sx of [-1, 1]) {
    const gusset = new THREE.Mesh(
        new THREE.BoxGeometry(1, 5, 7), metalMat
    );
    gusset.position.set(sx * 6.5, 4.5, 2.5);
    scene.add(gusset);
}

// =====================
//  GROOVED CABLE DRUM
// =====================
const drumR = 5;
const drumLen = 11;
const drumCenterZ = -5;
const numGrooves = 24;

// Build grooved drum profile for LatheGeometry
// Points are (radius, height_along_Y)
const drumProfile = [];

// End flange 1 (bottom, Y=0)
drumProfile.push(new THREE.Vector2(0, 0));
drumProfile.push(new THREE.Vector2(drumR + 0.5, 0));
drumProfile.push(new THREE.Vector2(drumR + 0.5, 0.35));
drumProfile.push(new THREE.Vector2(drumR, 0.45));

// Grooved rope channel section
for (let i = 0; i <= numGrooves; i++) {
    const y = 0.5 + (i / numGrooves) * (drumLen - 1.0);
    drumProfile.push(new THREE.Vector2(drumR - 0.2, y));
    if (i < numGrooves) {
        const yMid = 0.5 + ((i + 0.5) / numGrooves) * (drumLen - 1.0);
        drumProfile.push(new THREE.Vector2(drumR + 0.15, yMid));
    }
}

// End flange 2 (top, Y=drumLen)
drumProfile.push(new THREE.Vector2(drumR, drumLen - 0.45));
drumProfile.push(new THREE.Vector2(drumR + 0.5, drumLen - 0.35));
drumProfile.push(new THREE.Vector2(drumR + 0.5, drumLen));
drumProfile.push(new THREE.Vector2(0, drumLen));

const drumGeo = new THREE.LatheGeometry(drumProfile, 48);
const drumMesh = new THREE.Mesh(drumGeo, metalMat);
// LatheGeometry is along Y; rotate to align along Z axis
drumMesh.rotation.x = -Math.PI / 2;
// After rotation (x,y,0) → (x,0,-y), drum goes Z=0 to Z=-drumLen
drumMesh.position.set(0, shaftY, drumCenterZ + drumLen / 2);
scene.add(drumMesh);

// =====================
//  FLYWHEEL GENERATOR
// =====================
function createFlywheelGeometry(radius, thickness, numHoles, holeRadius, holeOrbitRadius) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    
    // Circular lightening holes
    for (let i = 0; i < numHoles; i++) {
        const angle = (i / numHoles) * Math.PI * 2 + Math.PI / 6;
        const holePath = new THREE.Path();
        holePath.absarc(
            Math.cos(angle) * holeOrbitRadius,
            Math.sin(angle) * holeOrbitRadius,
            holeRadius, 0, Math.PI * 2, true
        );
        shape.holes.push(holePath);
    }
    
    // Center shaft bore
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 1.2, 0, Math.PI * 2, true);
    shape.holes.push(centerHole);
    
    return new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: false
    });
}

// =====================
//  FRONT FLYWHEEL (smaller, closer to drum)
// =====================
const fwRadius = 7;
const fwZ = 2.5;
const wheelThickness = 1.0;

// Disc with lightening holes
const fwDisc = new THREE.Mesh(
    createFlywheelGeometry(fwRadius, wheelThickness, 3, 1.8, 4.0),
    metalMat
);
fwDisc.position.set(0, shaftY, fwZ - wheelThickness / 2);
scene.add(fwDisc);

// Raised outer rim (torus, rotated so hole faces along Z)
const fwRim = new THREE.Mesh(
    new THREE.TorusGeometry(fwRadius, 0.5, 12, 64),
    metalMat
);
fwRim.rotation.x = Math.PI / 2;
fwRim.position.set(0, shaftY, fwZ);
scene.add(fwRim);

// Inner rim ring
const fwInnerRim = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.3, 12, 48),
    metalMat
);
fwInnerRim.rotation.x = Math.PI / 2;
fwInnerRim.position.set(0, shaftY, fwZ);
scene.add(fwInnerRim);

// Central hub boss
const fwHub = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 2.0, 32),
    metalMat
);
fwHub.rotation.x = Math.PI / 2;
fwHub.position.set(0, shaftY, fwZ);
scene.add(fwHub);

// =====================
//  REAR FLYWHEEL (larger)
// =====================
const rwRadius = 8.5;
const rwZ = 9;

// Disc with lightening holes
const rwDisc = new THREE.Mesh(
    createFlywheelGeometry(rwRadius, wheelThickness, 3, 2.3, 5.2),
    metalMat
);
rwDisc.position.set(0, shaftY, rwZ - wheelThickness / 2);
scene.add(rwDisc);

// Raised outer rim
const rwRim = new THREE.Mesh(
    new THREE.TorusGeometry(rwRadius, 0.6, 12, 64),
    metalMat
);
rwRim.rotation.x = Math.PI / 2;
rwRim.position.set(0, shaftY, rwZ);
scene.add(rwRim);

// Inner rim ring
const rwInnerRim = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.35, 12, 48),
    metalMat
);
rwInnerRim.rotation.x = Math.PI / 2;
rwInnerRim.position.set(0, shaftY, rwZ);
scene.add(rwInnerRim);

// Central hub boss
const rwHub = new THREE.Mesh(
    new THREE.CylinderGeometry(2.0, 2.0, 2.2, 32),
    metalMat
);
rwHub.rotation.x = Math.PI / 2;
rwHub.position.set(0, shaftY, rwZ);
scene.add(rwHub);

// =====================
//  MAIN SHAFT
// =====================
const mainShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 24, 16),
    darkMetalMat
);
mainShaft.rotation.x = Math.PI / 2;
mainShaft.position.set(0, shaftY, -0.5);
scene.add(mainShaft);

// Crank pin protruding from front wheel (~7 o'clock position)
const crankPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 1.8, 12),
    darkMetalMat
);
crankPin.rotation.x = Math.PI / 2;
crankPin.position.set(-2.5, shaftY - 3, fwZ - 1.2);
scene.add(crankPin);

// Crank pin cap
const crankCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.3, 12),
    darkMetalMat
);
crankCap.rotation.x = Math.PI / 2;
crankCap.position.set(-2.5, shaftY - 3, fwZ - 2.1);
scene.add(crankCap);

// =====================
//  PIPE / VALVE ON TOP OF DRUM
// =====================
const pipeZ = drumCenterZ + 3;

// Pipe body
const pipeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 2.5, 16),
    metalMat
);
pipeBody.position.set(0, shaftY + drumR + 1.25, pipeZ);
scene.add(pipeBody);

// Pipe cap / rim
const pipeCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.35, 16),
    metalMat
);
pipeCap.position.set(0, shaftY + drumR + 2.7, pipeZ);
scene.add(pipeCap);

// =====================
//  CROSSHEAD / LINKAGE MECHANISM
// =====================
const linkageZ = (fwZ + rwZ) / 2;

// Crosshead guide block
const crosshead = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 2.5, 2.5),
    metalMat
);
crosshead.position.set(3.5, shaftY + 1.8, linkageZ);
scene.add(crosshead);

// Crosshead guide bars (parallel to shaft)
for (const dy of [-0.8, 0.8]) {
    const guideBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
        darkMetalMat
    );
    guideBar.rotation.x = Math.PI / 2;
    guideBar.position.set(3.5, shaftY + 1.8 + dy, linkageZ);
    scene.add(guideBar);
}

// Connecting rod (from crosshead down to crank)
const conRod = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 3.5, 0.5),
    darkMetalMat
);
conRod.position.set(3.5, shaftY + 0.3, linkageZ);
conRod.rotation.z = 0.15;
scene.add(conRod);

// Eccentric / crank connection on rear wheel
const eccentric = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 1.0, 16),
    darkMetalMat
);
eccentric.rotation.x = Math.PI / 2;
eccentric.position.set(3, shaftY + 2, rwZ - 1.5);
scene.add(eccentric);

// Small valve rod
const valveRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 6, 8),
    darkMetalMat
);
valveRod.rotation.x = Math.PI / 2;
valveRod.position.set(3.5, shaftY + 2.5, linkageZ - 1);
scene.add(valveRod);

// =====================
//  CAMERA SETUP
// =====================
camera.position.set(28, 22, -18);
camera.lookAt(0, 6, 2);