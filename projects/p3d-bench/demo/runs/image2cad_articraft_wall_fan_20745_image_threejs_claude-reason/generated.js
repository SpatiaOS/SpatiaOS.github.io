// Gramophone / Phonograph 3D Model

// === Materials ===
const mainMat = new THREE.MeshStandardMaterial({
    color: 0xb5b5b5,
    metalness: 0.35,
    roughness: 0.42,
    side: THREE.DoubleSide
});

const grillMat = new THREE.MeshStandardMaterial({
    color: 0x929292,
    metalness: 0.4,
    roughness: 0.5,
    side: THREE.DoubleSide
});

const model = new THREE.Group();

// === PARAMETERS ===
const baseRadius = 8;
const baseThick = 0.3;

const grillInner = 3.3;
const grillOuter = 7.5;
const grillH = 2.0;
const numFins = 64;

const cylR = 3.0;
const cylH = 4.5;
const cylBaseY = grillH + baseThick;

const armStartY = cylBaseY + cylH * 0.78;
const armLen = 11;
const armR1 = 0.55;
const armR2 = 0.35;

const bellMaxR = 5.8;
const bellLen = 5.5;

// === BASE DISC ===
const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius * 1.01, baseThick, 64);
const baseMesh = new THREE.Mesh(baseGeo, mainMat);
baseMesh.position.y = baseThick / 2;
model.add(baseMesh);

// Outer edge bead
const edgeBead = new THREE.Mesh(
    new THREE.TorusGeometry(baseRadius, 0.15, 10, 64), mainMat
);
edgeBead.rotation.x = Math.PI / 2;
edgeBead.position.y = baseThick;
model.add(edgeBead);

// Inner decorative edge
const innerEdge = new THREE.Mesh(
    new THREE.TorusGeometry(baseRadius - 0.5, 0.08, 8, 64), grillMat
);
innerEdge.rotation.x = Math.PI / 2;
innerEdge.position.y = baseThick;
model.add(innerEdge);

// === RADIAL GRILLE ===
// Vertical radial fins
for (let i = 0; i < numFins; i++) {
    const angle = (i / numFins) * Math.PI * 2;
    const len = grillOuter - grillInner;
    const finGeo = new THREE.BoxGeometry(len, grillH, 0.05);
    const fin = new THREE.Mesh(finGeo, grillMat);
    const mr = (grillInner + grillOuter) / 2;
    fin.position.set(
        Math.cos(angle) * mr,
        baseThick + grillH / 2,
        Math.sin(angle) * mr
    );
    fin.rotation.y = -angle + Math.PI / 2;
    model.add(fin);
}

// Concentric structural rings at various heights
const ringHeights = [0, 0.4, 0.7, 1.0];
const ringRadii = [grillInner, grillInner + (grillOuter - grillInner) * 0.33,
    grillInner + (grillOuter - grillInner) * 0.66, grillOuter];

ringHeights.forEach(hFrac => {
    const y = baseThick + grillH * hFrac;
    ringRadii.forEach(r => {
        const rGeo = new THREE.TorusGeometry(r, 0.06, 6, 64);
        const ring = new THREE.Mesh(rGeo, grillMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        model.add(ring);
    });
});

// Grille top plate (ring)
const grillTopGeo = new THREE.RingGeometry(grillInner - 0.1, grillOuter + 0.1, 64);
const grillTopMesh = new THREE.Mesh(grillTopGeo, mainMat);
grillTopMesh.rotation.x = -Math.PI / 2;
grillTopMesh.position.y = baseThick + grillH;
model.add(grillTopMesh);

// Grille bottom plate
const grillBotMesh = new THREE.Mesh(grillTopGeo.clone(), mainMat);
grillBotMesh.rotation.x = -Math.PI / 2;
grillBotMesh.position.y = baseThick + 0.01;
model.add(grillBotMesh);

// === CENTRAL HOUSING CYLINDER ===
const cylGeo = new THREE.CylinderGeometry(cylR, cylR, cylH, 32);
const cylMesh = new THREE.Mesh(cylGeo, mainMat);
cylMesh.position.y = cylBaseY + cylH / 2;
model.add(cylMesh);

// Top lip/rim
const topLip = new THREE.Mesh(
    new THREE.CylinderGeometry(cylR + 0.2, cylR + 0.2, 0.25, 32), mainMat
);
topLip.position.y = cylBaseY + cylH;
model.add(topLip);

// Top disc
const topDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(cylR + 0.2, cylR + 0.2, 0.1, 32), mainMat
);
topDisc.position.y = cylBaseY + cylH + 0.15;
model.add(topDisc);

// Vent slots on top face
for (let i = -4; i <= 4; i++) {
    const slotGeo = new THREE.BoxGeometry(2.2, 0.12, 0.1);
    const slot = new THREE.Mesh(slotGeo, grillMat);
    slot.position.set(-0.3, cylBaseY + cylH + 0.26, i * 0.28);
    model.add(slot);
}

// Indicator arrow on top
const arrowGeo = new THREE.ConeGeometry(0.2, 0.8, 3);
const arrow = new THREE.Mesh(arrowGeo, grillMat);
arrow.rotation.x = Math.PI / 2;
arrow.position.set(-0.3, cylBaseY + cylH + 0.26, -1.8);
model.add(arrow);

// Small circle on top
const dotGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);
const dot = new THREE.Mesh(dotGeo, grillMat);
dot.position.set(-1.0, cylBaseY + cylH + 0.26, 1.2);
model.add(dot);

// Bottom flange
const flange = new THREE.Mesh(
    new THREE.CylinderGeometry(cylR + 0.4, cylR + 0.5, 0.3, 32), mainMat
);
flange.position.y = cylBaseY + 0.15;
model.add(flange);

// Notch/slot in housing front
const notchGeo = new THREE.BoxGeometry(0.6, 1.2, 0.5);
const notch = new THREE.Mesh(notchGeo, grillMat);
notch.position.set(cylR - 0.1, cylBaseY + 0.8, 0);
model.add(notch);

// === CONNECTION BLOCK ===
const blockGeo = new THREE.BoxGeometry(1.2, 1.4, 1.3);
const block = new THREE.Mesh(blockGeo, mainMat);
block.position.set(cylR + 0.6, armStartY, 0);
model.add(block);

// Small detail cube
const detailCube = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6), mainMat
);
detailCube.position.set(cylR + 1.4, armStartY, 0);
model.add(detailCube);

// Small knob on block
const knob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8), mainMat
);
knob.rotation.x = Math.PI / 2;
knob.position.set(cylR + 0.6, armStartY - 0.3, 0.8);
model.add(knob);

// === HORN ARM (slightly angled upward) ===
const armAngle = 0.06; // slight upward tilt
const armGroup = new THREE.Group();

const armGeo = new THREE.CylinderGeometry(armR2, armR1, armLen, 16);
const armMesh = new THREE.Mesh(armGeo, mainMat);
armMesh.rotation.z = -Math.PI / 2;
armMesh.position.set(armLen / 2, 0, 0);
armGroup.add(armMesh);

// Arm rings (decorative)
[0.5, armLen - 0.5].forEach(pos => {
    const ringGeo = new THREE.TorusGeometry(armR1 * 1.1, 0.05, 8, 16);
    const ring = new THREE.Mesh(ringGeo, grillMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(pos, 0, 0);
    armGroup.add(ring);
});

armGroup.position.set(cylR + 1.7, armStartY, 0);
armGroup.rotation.z = armAngle;
model.add(armGroup);

// === NEEDLE ARM WIRES ===
const wireMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, metalness: 0.5, roughness: 0.3 });
const wireLen = 6;
[-0.15, 0.15].forEach(offset => {
    const wireGeo = new THREE.CylinderGeometry(0.025, 0.025, wireLen, 4);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.rotation.z = -Math.PI / 2 + 0.3;
    wire.position.set(
        cylR + 1.5 + wireLen * 0.4,
        armStartY + wireLen * 0.15 + 0.5,
        offset
    );
    model.add(wire);
});

// === BELL / HORN ===
const bellPts = [];
const nBellPts = 50;

// Main exponential flare
for (let i = 0; i <= nBellPts; i++) {
    const t = i / nBellPts;
    const r = armR2 + (bellMaxR - armR2) * Math.pow(t, 1.7);
    const y = t * bellLen;
    bellPts.push(new THREE.Vector2(r, y));
}

// Curved lip rolling back
const lipR = 0.6;
const lipPts = 12;
for (let i = 1; i <= lipPts; i++) {
    const t = i / lipPts;
    const angle = t * Math.PI * 0.55;
    const r = bellMaxR - lipR * (1 - Math.cos(angle));
    const y = bellLen + lipR * Math.sin(angle);
    if (r > 1.0) bellPts.push(new THREE.Vector2(r, y));
}

// Inner surface curving back
const innerPts = 20;
const lastPt = bellPts[bellPts.length - 1];
const innerStartR = lastPt.x;
const innerStartY = lastPt.y;
for (let i = 1; i <= innerPts; i++) {
    const t = i / innerPts;
    const r = innerStartR - t * (innerStartR - 2.0);
    const y = innerStartY - t * 1.5;
    bellPts.push(new THREE.Vector2(r, y));
}

const bellGeo = new THREE.LatheGeometry(bellPts, 48);
const bellMesh = new THREE.Mesh(bellGeo, mainMat);
bellMesh.rotation.z = Math.PI / 2 + armAngle;

const bellStartX = cylR + 1.7 + armLen * Math.cos(armAngle);
const bellStartYPos = armStartY + armLen * Math.sin(armAngle);
bellMesh.position.set(bellStartX, bellStartYPos, 0);
model.add(bellMesh);

// Bell rim highlight ring
const rimRing = new THREE.Mesh(
    new THREE.TorusGeometry(bellMaxR - 0.1, 0.12, 8, 48), mainMat
);
const rimAngle = armAngle;
const rimDist = bellLen + lipR * 0.85;
rimRing.rotation.x = Math.PI / 2;
rimRing.position.set(
    bellStartX + rimDist * Math.cos(-rimAngle + Math.PI / 2) * 0,
    bellStartYPos,
    0
);

// Position rim at bell opening
const rimGroup = new THREE.Group();
rimGroup.add(rimRing);
rimRing.position.set(0, 0, 0);
rimGroup.position.set(
    bellStartX + (bellLen + lipR * 0.4) * Math.cos(armAngle),
    bellStartYPos + (bellLen + lipR * 0.4) * Math.sin(armAngle),
    0
);
rimGroup.rotation.z = armAngle;
model.add(rimGroup);

// === Add model to scene ===
scene.add(model);

// === Camera positioning ===
camera.position.set(30, 22, 25);
camera.lookAt(8, 5, 0);