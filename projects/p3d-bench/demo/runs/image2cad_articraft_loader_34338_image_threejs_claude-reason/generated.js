// Front-End Wheel Loader

// === MATERIALS ===
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb5b5b5, roughness: 0.55, metalness: 0.3 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.65, metalness: 0.2 });
const tireMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.92, metalness: 0.05 });
const hubMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.4, metalness: 0.45 });
const windowMat = new THREE.MeshStandardMaterial({
    color: 0x3a5a7a, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.4
});
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.1, metalness: 0.85 });
const bucketMat = new THREE.MeshStandardMaterial({ color: 0xa5a5a5, roughness: 0.6, metalness: 0.25, side: THREE.DoubleSide });

const vehicle = new THREE.Group();

// === HELPER ===
function addBox(x, y, z, w, h, d, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    vehicle.add(m);
    return m;
}

// === PARAMETERS ===
const WR = 3.5;    // wheel radius
const WW = 2.0;    // wheel width
const BW = 7.0;    // body width
const frontZ = 4.5; // front axle Z
const rearZ = -5.5; // rear axle Z
const axleHW = BW / 2 + WW / 2 + 0.3; // half-width to wheel center
const aY = WR;      // axle center height

// ===================== WHEELS =====================
function makeWheel() {
    const g = new THREE.Group();

    // Main tire body
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(WR, WR, WW, 32), tireMat);
    tire.rotation.z = Math.PI / 2;
    g.add(tire);

    // Beveled tire edges
    [-1, 1].forEach(s => {
        const bevelGeo = new THREE.CylinderGeometry(WR * 0.92, WR, 0.25, 32);
        const bevel = new THREE.Mesh(bevelGeo, tireMat);
        bevel.rotation.z = Math.PI / 2;
        bevel.position.x = s * (WW / 2 + 0.12);
        if (s === 1) { bevel.scale.x = -1; }
        g.add(bevel);
    });

    // Sidewall details both sides
    [-1, 1].forEach(s => {
        // Outer rim bead
        const rimBead = new THREE.Mesh(new THREE.TorusGeometry(WR * 0.82, 0.13, 8, 32), hubMat);
        rimBead.position.x = s * WW * 0.44;
        rimBead.rotation.y = Math.PI / 2;
        g.add(rimBead);

        // Inner rim ring
        const innerRim = new THREE.Mesh(new THREE.TorusGeometry(WR * 0.46, 0.1, 8, 24), hubMat);
        innerRim.position.x = s * WW * 0.46;
        innerRim.rotation.y = Math.PI / 2;
        g.add(innerRim);

        // Hub disc
        const hubDisc = new THREE.Mesh(new THREE.CylinderGeometry(WR * 0.4, WR * 0.4, 0.22, 20), hubMat);
        hubDisc.rotation.z = Math.PI / 2;
        hubDisc.position.x = s * WW * 0.48;
        g.add(hubDisc);

        // Center cap (raised)
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(WR * 0.16, WR * 0.16, 0.4, 12), bodyMat);
        cap.rotation.z = Math.PI / 2;
        cap.position.x = s * (WW * 0.5 + 0.18);
        g.add(cap);

        // Spoke details (radial lines on hub)
        for (let sp = 0; sp < 5; sp++) {
            const spAngle = (sp / 5) * Math.PI * 2;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, WR * 0.2), hubMat);
            spoke.position.set(
                s * WW * 0.49,
                Math.cos(spAngle) * WR * 0.3,
                Math.sin(spAngle) * WR * 0.3
            );
            spoke.rotation.x = spAngle;
            g.add(spoke);
        }
    });

    // Chevron tread lugs
    const nLugs = 14;
    for (let i = 0; i < nLugs; i++) {
        const a = (i / nLugs) * Math.PI * 2;
        const r = WR + 0.08;
        [-1, 1].forEach(s => {
            const lug = new THREE.Mesh(new THREE.BoxGeometry(WW * 0.33, 0.28, 0.58), tireMat);
            lug.position.set(s * WW * 0.22, Math.cos(a) * r, Math.sin(a) * r);
            lug.rotation.x = a;
            lug.rotation.y = s * 0.4;
            g.add(lug);
        });
    }

    return g;
}

// Place 4 wheels
const wheelPositions = [
    [axleHW, aY, frontZ], [-axleHW, aY, frontZ],
    [axleHW, aY, rearZ], [-axleHW, aY, rearZ]
];
wheelPositions.forEach(p => {
    const w = makeWheel();
    w.position.set(...p);
    vehicle.add(w);
});

// ===================== CHASSIS =====================
// Rear frame (under engine/cab area)
addBox(0, aY + 0.3, rearZ + 1.5, BW, 2.5, 8, bodyMat);

// Front frame (under arms area)
addBox(0, aY - 0.1, frontZ - 0.5, BW - 0.5, 1.8, 5, bodyMat);

// Articulation joint
addBox(0, aY + 0.3, (frontZ + rearZ) / 2, 3.5, 2.5, 2, darkMat);

// Skid plate / underside
addBox(0, aY - 1.2, 0, BW - 2, 0.3, 4, darkMat);

// ===================== ENGINE COMPARTMENT =====================
const engH = 3.8;
const engZ = rearZ + 0.5;
addBox(0, aY + 1.25 + engH / 2, engZ, BW - 0.3, engH, 5.5, bodyMat);

// Engine top plate
addBox(0, aY + 1.25 + engH + 0.2, engZ, BW - 1, 0.35, 5, bodyMat);

// Side panel grilles
[-1, 1].forEach(s => {
    // Panel backdrop
    addBox(s * (BW / 2 - 0.08), aY + 1.25 + engH / 2, engZ, 0.1, engH - 0.3, 5.2, darkMat);
    // Horizontal louver slats
    for (let i = 0; i < 5; i++) {
        addBox(s * (BW / 2 + 0.02), aY + 1.8 + i * 0.7, engZ, 0.06, 0.15, 3.8, bodyMat);
    }
});

// Rear counterweight (rounded back)
addBox(0, aY + 1.8, rearZ - 2.5, BW + 0.4, 3.5, 1.3, darkMat);
addBox(0, aY + 3.8, rearZ - 2.2, BW - 0.5, 1.5, 0.8, darkMat);

// ===================== EXHAUST PIPE =====================
const exhX = BW / 2 - 1.3;
const exhZ = rearZ - 0.8;
const exhMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 3.5, 12), darkMat);
exhMesh.position.set(exhX, aY + 6.8, exhZ);
vehicle.add(exhMesh);

// Exhaust cap
const exhCap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, 0.2, 12), darkMat);
exhCap.position.set(exhX, aY + 8.65, exhZ);
vehicle.add(exhCap);

// ===================== CAB =====================
const cabW = 5.5, cabH = 4.2, cabD = 3.5;
const cabBaseY = aY + 1.5;
const cabY = cabBaseY + cabH / 2;
const cabZ = (frontZ + rearZ) / 2 + 1.5;

// Cab main structure
addBox(0, cabY, cabZ, cabW, cabH, cabD, bodyMat);

// Roof with overhang
addBox(0, cabY + cabH / 2 + 0.2, cabZ, cabW + 0.5, 0.35, cabD + 0.35, bodyMat);

// Front window
const wfGeo = new THREE.PlaneGeometry(cabW - 1.5, cabH - 1.5);
const wf = new THREE.Mesh(wfGeo, windowMat);
wf.position.set(0, cabY + 0.2, cabZ + cabD / 2 + 0.06);
vehicle.add(wf);

// Side windows
[-1, 1].forEach(s => {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(cabD - 1, cabH - 1.5), windowMat);
    sw.position.set(s * (cabW / 2 + 0.06), cabY + 0.2, cabZ);
    sw.rotation.y = Math.PI / 2;
    vehicle.add(sw);
});

// Rear window
const rw = new THREE.Mesh(new THREE.PlaneGeometry(cabW - 1.8, cabH - 2), windowMat);
rw.position.set(0, cabY + 0.3, cabZ - cabD / 2 - 0.06);
vehicle.add(rw);

// Front window pillars (3 vertical bars)
[-cabW / 2 + 0.3, 0, cabW / 2 - 0.3].forEach(x => {
    addBox(x, cabY + 0.2, cabZ + cabD / 2 + 0.08, 0.22, cabH - 0.8, 0.15, bodyMat);
});

// Corner pillars
[-1, 1].forEach(sx => {
    [-1, 1].forEach(sz => {
        addBox(sx * cabW / 2, cabY, cabZ + sz * cabD / 2, 0.28, cabH, 0.28, bodyMat);
    });
});

// Window sill (horizontal divider)
addBox(0, cabY - cabH / 2 + 1.2, cabZ + cabD / 2 + 0.06, cabW - 0.2, 0.25, 0.15, bodyMat);

// Door outline on right side
addBox(cabW / 2 + 0.07, cabY - 0.5, cabZ, 0.05, cabH * 0.7, cabD * 0.6, darkMat);

// ===================== LIFT ARMS =====================
[-1, 1].forEach(side => {
    const armX = side * (BW / 2 - 0.3);
    const sY = cabY + 1.0;       // arm start Y (high, at body)
    const sZ = cabZ - cabD / 2;  // arm start Z
    const eY = aY + 1.5;         // arm end Y (lower, at bucket)
    const eZ = frontZ + 5.5;     // arm end Z (forward, at bucket)

    const dx = eZ - sZ;
    const dy = eY - sY;
    const armLen = Math.sqrt(dx * dx + dy * dy);
    const armAng = Math.atan2(sY - eY, eZ - sZ);

    // Main upper lift arm
    const armGeo = new THREE.BoxGeometry(0.4, 0.7, armLen);
    const armMesh = new THREE.Mesh(armGeo, bodyMat);
    armMesh.position.set(armX, (sY + eY) / 2, (sZ + eZ) / 2);
    armMesh.rotation.x = armAng;
    vehicle.add(armMesh);

    // Secondary lower arm (Z-bar linkage)
    const a2Len = armLen * 0.55;
    const a2StartY = sY - 2.5;
    const a2EndY = eY - 0.5;
    const a2StartZ = sZ + 2;
    const a2EndZ = eZ - 1;
    const a2Ang = Math.atan2(a2StartY - a2EndY, a2EndZ - a2StartZ);

    const arm2Geo = new THREE.BoxGeometry(0.3, 0.5, a2Len);
    const arm2Mesh = new THREE.Mesh(arm2Geo, bodyMat);
    arm2Mesh.position.set(armX, (a2StartY + a2EndY) / 2, (a2StartZ + a2EndZ) / 2);
    arm2Mesh.rotation.x = a2Ang;
    vehicle.add(arm2Mesh);

    // Lift hydraulic cylinder (body to mid-arm)
    const cylLen = 5.5;
    const cylStartY = aY + 2.5;
    const cylStartZ = sZ + 1;
    const cylEndY = sY - 0.3;
    const cylEndZ = sZ + 5;
    const cylAng = Math.atan2(cylStartY - cylEndY, cylEndZ - cylStartZ);

    const cylGeo = new THREE.CylinderGeometry(0.22, 0.3, cylLen * 0.6, 10);
    const cylMesh = new THREE.Mesh(cylGeo, darkMat);
    cylMesh.position.set(armX - side * 0.3, cylStartY + 0.5, cylStartZ + 1.5);
    cylMesh.rotation.x = -(Math.PI / 2 - 0.5);
    vehicle.add(cylMesh);

    // Piston rod
    const rodGeo = new THREE.CylinderGeometry(0.13, 0.13, cylLen * 0.4, 8);
    const rodMesh = new THREE.Mesh(rodGeo, chromeMat);
    rodMesh.position.set(armX - side * 0.3, cylEndY + 0.5, cylEndZ - 1);
    rodMesh.rotation.x = -(Math.PI / 2 - 0.35);
    vehicle.add(rodMesh);

    // Tilt cylinder (on arm, near bucket)
    const tiltCylGeo = new THREE.CylinderGeometry(0.18, 0.22, 3, 8);
    const tiltCyl = new THREE.Mesh(tiltCylGeo, darkMat);
    tiltCyl.position.set(armX, eY + 1.2, eZ - 2);
    tiltCyl.rotation.x = -(Math.PI / 2 - 0.6);
    vehicle.add(tiltCyl);

    // Pivot pins at connection points
    [[sY, sZ], [eY, eZ]].forEach(([py, pz]) => {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 8), darkMat);
        pin.position.set(armX, py, pz);
        pin.rotation.z = Math.PI / 2;
        vehicle.add(pin);
    });
});

// Cross-bar connecting arms at bucket end
addBox(0, aY + 1.5, frontZ + 5.5, BW - 1, 0.5, 0.5, bodyMat);

// ===================== FRONT BUCKET =====================
const bW = BW + 3;       // bucket width
const bD = 5.0;           // bucket depth
const bBackZ = frontZ + 5.5; // back of bucket
const bFrontZ = bBackZ + bD;
const bBotY = aY - 2.0;   // back bottom Y
const bTopY = aY + 2.5;   // back top Y
const scAngle = 0.2;      // scoop angle

// Back plate (vertical connection to arms)
addBox(0, (bBotY + bTopY) / 2, bBackZ, bW, bTopY - bBotY, 0.25, bodyMat);

// Upper reinforcement bar on back plate
addBox(0, bTopY - 0.2, bBackZ + 0.2, bW - 1, 0.3, 0.3, bodyMat);

// Bottom plate (angled scoop)
const botLen = bD / Math.cos(scAngle);
const botPlate = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.15, botLen), bucketMat);
const bpCenterY = bBotY - (bD * Math.sin(scAngle)) / 2;
botPlate.position.set(0, bpCenterY, bBackZ + bD / 2);
botPlate.rotation.x = scAngle;
vehicle.add(botPlate);

// Side plates using BufferGeometry for trapezoidal shape
const ceY = bBotY - bD * Math.sin(scAngle); // cutting edge Y

[-1, 1].forEach(s => {
    const x = s * bW / 2;
    const y0 = bBotY;          // back bottom
    const y1 = ceY;            // front bottom (cutting edge)
    const y2 = bTopY;          // back top
    const y3 = y1 + 2.0;       // front top edge

    // Create two triangles forming a quad
    const positions = new Float32Array(s > 0 ? [
        x, y0, bBackZ,  x, y1, bFrontZ,  x, y3, bFrontZ,
        x, y0, bBackZ,  x, y3, bFrontZ,  x, y2, bBackZ,
    ] : [
        x, y0, bBackZ,  x, y3, bFrontZ,  x, y1, bFrontZ,
        x, y0, bBackZ,  x, y2, bBackZ,   x, y3, bFrontZ,
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    vehicle.add(new THREE.Mesh(geo, bucketMat));

    // Side plate edge reinforcement
    addBox(x + s * 0.1, (y1 + y3) / 2, bFrontZ - 0.05, 0.12, y3 - y1, 0.12, darkMat);
    addBox(x + s * 0.1, (y0 + y2) / 2, bBackZ + 0.05, 0.12, y2 - y0, 0.12, darkMat);
});

// Cutting edge (reinforced bottom lip)
addBox(0, ceY - 0.12, bFrontZ, bW + 0.5, 0.35, 0.4, darkMat);

// Top lip reinforcement
addBox(0, ceY + 1.8, bFrontZ - 0.15, bW + 0.2, 0.2, 0.15, bodyMat);

// Horizontal reinforcement ribs across bucket face
for (let i = 0; i < 3; i++) {
    addBox(0, ceY + 0.4 + i * 0.5, bFrontZ - 0.25, bW - 0.5, 0.12, 0.1, bodyMat);
}

// Corner gussets on side plates
[-1, 1].forEach(s => {
    const x = s * (bW / 2 + 0.12);
    addBox(x, ceY + 0.5, bFrontZ - 0.2, 0.2, 1.2, 0.5, darkMat);
    addBox(x, (bBotY + bTopY) / 2, bBackZ + 0.5, 0.2, bTopY - bBotY - 0.5, 1, darkMat);
});

// ===================== WHEEL FENDERS =====================
wheelPositions.forEach(([x, y, z]) => {
    // Top fender plate
    addBox(x, aY + WR + 0.35, z, WW + 1.6, 0.22, WR * 1.7, bodyMat);
    // Inner and outer fender sides
    [-1, 1].forEach(s => {
        addBox(x + s * (WW / 2 + 0.7), aY + WR - 0.15, z, 0.12, 1.3, WR * 1.7, bodyMat);
    });
    // Front/rear fender lips
    [-1, 1].forEach(s => {
        addBox(x, aY + WR - 0.1, z + s * WR * 0.85, WW + 1.6, 0.6, 0.12, bodyMat);
    });
});

// ===================== PLATFORM / STEPS =====================
// Step on right side
addBox(BW / 2 + 0.6, aY - 0.3, cabZ - 0.5, 1.0, 0.15, 2, darkMat);
addBox(BW / 2 + 0.6, aY + 0.5, cabZ - 0.5, 1.0, 0.15, 2, darkMat);

// ===================== LIGHTS =====================
// Front work lights on cab roof
[-1.2, 1.2].forEach(x => {
    addBox(x, cabY + cabH / 2 + 0.5, cabZ + cabD / 2 + 0.15, 0.5, 0.3, 0.2, darkMat);
});

// Headlights on front frame
[-2.2, 2.2].forEach(x => {
    const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12), hubMat);
    hl.position.set(x, aY + 0.8, frontZ + 1.8);
    hl.rotation.x = Math.PI / 2;
    vehicle.add(hl);
});

// ===================== GRILLE DETAIL =====================
// Grille on front of engine (between cab and engine)
const grilleZ = cabZ - cabD / 2 - 0.2;
for (let i = 0; i < 4; i++) {
    addBox(0, aY + 2 + i * 0.6, grilleZ, BW - 2, 0.15, 0.08, darkMat);
}

// ===================== MUDGUARDS =====================
// Additional mud flaps behind wheels
wheelPositions.forEach(([x, y, z]) => {
    addBox(x, aY, z - WR - 0.5, WW + 0.5, WR, 0.1, darkMat);
});

scene.add(vehicle);

// Camera positioned for isometric-like view matching the reference
camera.position.set(22, 17, 25);
camera.lookAt(0, 3.5, 2);