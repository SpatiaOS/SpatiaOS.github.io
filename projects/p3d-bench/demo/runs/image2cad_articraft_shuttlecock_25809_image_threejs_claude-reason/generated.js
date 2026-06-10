// Perforated Conical Strainer/Filter Basket
// Truncated cone with structural ribs, rings, and perforation patterns

// === Parameters ===
const rLarge = 14;          // Large open-end radius
const rSmall = 6;           // Small closed-end radius
const bodyLen = 32;         // Body length
const radSegs = 64;         // Radial smoothness segments
const numRings = 6;         // Horizontal reinforcement rings
const numDiags = 8;         // Diagonal structural ribs
const diagTwist = Math.PI * 0.35; // Spiral twist for diagonal ribs
const ribR = 0.28;          // Rib cross-section radius

// Perforation parameters
const slotsPerRow = 4;
const rowsPerPanel = 3;
const holesPerRib = 10;

// Group container
const basket = new THREE.Group();

// === Materials ===
const shellMat = new THREE.MeshStandardMaterial({
    color: 0x929292, metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide
});
const ribMat = new THREE.MeshStandardMaterial({
    color: 0x7a7a7a, metalness: 0.65, roughness: 0.28
});
const slotMat = new THREE.MeshStandardMaterial({
    color: 0x252525, metalness: 0.1, roughness: 0.9
});

// === Helper functions ===
const rAt = (t) => rLarge * (1 - t) + rSmall * t;  // t: 0=large end, 1=small end
const yAt = (t) => -bodyLen / 2 + t * bodyLen;

// === Main Cone Shell (outer surface) ===
const coneGeo = new THREE.CylinderGeometry(rSmall, rLarge, bodyLen, radSegs, 1, true);
basket.add(new THREE.Mesh(coneGeo, shellMat));

// Inner surface for wall thickness
const wallT = 0.3;
const innerGeo = new THREE.CylinderGeometry(rSmall - wallT, rLarge - wallT, bodyLen, radSegs, 1, true);
basket.add(new THREE.Mesh(innerGeo, shellMat));

// Annular face closing wall at large end
const annularGeo = new THREE.RingGeometry(rLarge - wallT, rLarge, radSegs);
const annular = new THREE.Mesh(annularGeo, shellMat);
annular.rotation.x = Math.PI / 2;
annular.position.y = -bodyLen / 2;
basket.add(annular);

// === End Cap (dome at small end) ===
const capGeo = new THREE.SphereGeometry(rSmall, radSegs, 20, 0, Math.PI * 2, 0, Math.PI / 2.2);
const cap = new THREE.Mesh(capGeo, shellMat);
cap.position.y = bodyLen / 2;
basket.add(cap);

// Small flat cap to fully close
const flatCapGeo = new THREE.CircleGeometry(rSmall * 0.3, radSegs);
const flatCap = new THREE.Mesh(flatCapGeo, shellMat);
flatCap.rotation.x = -Math.PI / 2;
flatCap.position.y = bodyLen / 2 + rSmall * 0.38;
basket.add(flatCap);

// === Rim / Flange at large end ===
const rimGeo = new THREE.TorusGeometry(rLarge, 0.65, 10, radSegs);
const rim = new THREE.Mesh(rimGeo, ribMat);
rim.position.y = -bodyLen / 2;
basket.add(rim);

// Second inner rim ring for flange detail
const rim2Geo = new THREE.TorusGeometry(rLarge - 0.9, 0.3, 8, radSegs);
const rim2 = new THREE.Mesh(rim2Geo, ribMat);
rim2.position.y = -bodyLen / 2 + 0.6;
basket.add(rim2);

// === Horizontal Reinforcement Rings ===
for (let i = 1; i <= numRings; i++) {
    const t = i / (numRings + 1);
    const torusGeo = new THREE.TorusGeometry(rAt(t) + 0.06, ribR, 8, radSegs);
    const torus = new THREE.Mesh(torusGeo, ribMat);
    torus.position.y = yAt(t);
    basket.add(torus);
}

// === Diagonal Structural Ribs (tube geometry along cone surface) ===
for (let i = 0; i < numDiags; i++) {
    const baseAng = (i / numDiags) * Math.PI * 2;
    const pts = [];
    const nSteps = 48;
    for (let j = 0; j <= nSteps; j++) {
        const t = j / nSteps;
        const r = rAt(t) + ribR * 0.4;
        const ang = baseAng + t * diagTwist;
        pts.push(new THREE.Vector3(Math.cos(ang) * r, yAt(t), Math.sin(ang) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, nSteps, ribR, 6, false);
    basket.add(new THREE.Mesh(tubeGeo, ribMat));
}

// === Additional axial ribs (secondary structure visible in image) ===
const numAxialRibs = 16;
for (let i = 0; i < numAxialRibs; i++) {
    const ang = (i / numAxialRibs) * Math.PI * 2;
    const pts = [];
    for (let j = 0; j <= 30; j++) {
        const t = j / 30;
        const r = rAt(t) + ribR * 0.2;
        pts.push(new THREE.Vector3(Math.cos(ang) * r, yAt(t), Math.sin(ang) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, ribR * 0.5, 5, false);
    basket.add(new THREE.Mesh(tubeGeo, ribMat));
}

// === Rectangular Slot Perforations ===
// Placed in panels between horizontal rings and diagonal ribs
const slotGeoProto = new THREE.BoxGeometry(1, 1, 1);

for (let h = 0; h <= numRings; h++) {
    const t1 = h / (numRings + 1);
    const t2 = (h + 1) / (numRings + 1);

    for (let d = 0; d < numDiags; d++) {
        const a1base = (d / numDiags) * Math.PI * 2;
        const a2base = ((d + 1) / numDiags) * Math.PI * 2;

        for (let row = 0; row < rowsPerPanel; row++) {
            const tR = t1 + (t2 - t1) * (row + 0.5) / rowsPerPanel;
            const r = rAt(tR) + 0.12;
            const y = yAt(tR);

            // Account for diagonal rib twist offset
            const aOff = tR * diagTwist;
            const aStart = a1base + aOff + 0.07;
            const aEnd = a2base + aOff - 0.07;
            let span = aEnd - aStart;
            if (span <= 0) span += Math.PI * 2;
            if (span > Math.PI * 0.9) continue; // skip wrapping panels

            const nSlots = Math.min(slotsPerRow, Math.max(1, Math.floor(span * r / 2.8)));
            const slotW = Math.min(1.5, span * r * 0.11);

            for (let s = 0; s < nSlots; s++) {
                const ang = aStart + span * (s + 0.5) / nSlots;
                const x = Math.cos(ang) * r;
                const z = Math.sin(ang) * r;

                const slot = new THREE.Mesh(slotGeoProto, slotMat);
                slot.position.set(x, y, z);
                slot.scale.set(slotW, 0.28, 0.6);

                // Orient slot: X=tangential, Y=axial, Z=radial
                const outward = new THREE.Vector3(x, 0, z).normalize();
                const tangent = new THREE.Vector3(-Math.sin(ang), 0, Math.cos(ang));
                const up = new THREE.Vector3(0, 1, 0);
                const m = new THREE.Matrix4().makeBasis(tangent, up, outward);
                slot.rotation.setFromRotationMatrix(m);

                basket.add(slot);
            }
        }
    }
}

// === Circular Holes along diagonal ribs ===
const holeGeoProto = new THREE.CylinderGeometry(0.32, 0.32, 0.6, 10);

for (let i = 0; i < numDiags; i++) {
    const baseAng = (i / numDiags) * Math.PI * 2;

    for (let j = 1; j <= holesPerRib; j++) {
        const t = j / (holesPerRib + 1);
        const ang = baseAng + t * diagTwist + 0.12; // offset from rib center
        const r = rAt(t) + 0.1;

        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;

        const hole = new THREE.Mesh(holeGeoProto, slotMat);
        hole.position.set(x, yAt(t), z);

        // Orient cylinder radially outward
        const outDir = new THREE.Vector3(x, 0, z).normalize();
        hole.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outDir);

        basket.add(hole);
    }
}

// === Second set of holes on other side of diagonal ribs ===
for (let i = 0; i < numDiags; i++) {
    const baseAng = (i / numDiags) * Math.PI * 2;

    for (let j = 1; j <= holesPerRib; j++) {
        const t = j / (holesPerRib + 1);
        const ang = baseAng + t * diagTwist - 0.12;
        const r = rAt(t) + 0.1;

        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;

        const hole = new THREE.Mesh(holeGeoProto, slotMat);
        hole.position.set(x, yAt(t), z);

        const outDir = new THREE.Vector3(x, 0, z).normalize();
        hole.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outDir);

        basket.add(hole);
    }
}

// === Orient basket to match image perspective ===
// Large end facing front-left, small end going back-right
basket.rotation.x = -0.45;
basket.rotation.z = 0.25;
basket.rotation.y = 0.3;

scene.add(basket);

// === Camera ===
camera.position.set(28, 18, 38);
camera.lookAt(0, 0, 0);