// ========================================
// Retro Bluetooth Speaker with Mid-Century Modern Legs
// ========================================

// === Parameters ===
const BW = 32;    // body width (X)
const BH = 11;    // body height (Y)
const BD = 9;     // body depth (Z)
const CH = 2.0;   // front edge chamfer size

const LL = 13.5;  // leg length
const LTR = 0.7;  // leg top radius (at body)
const LBR = 0.4;  // leg bottom radius (at floor)
const LA = 14;    // leg splay angle from vertical (degrees)

const SXO = 9.5;  // speaker center X offset from body center
const SOR = 4.7;  // speaker outer octagon radius
const SIR = 1.9;  // speaker center disc radius
const SMR = 3.3;  // speaker mid ring radius
const NT = 28;    // number of radial tick marks

const BTR = 0.45; // button radius
const BTS = 2.0;  // button spacing

// === Computed Values ===
const LAR = LA * Math.PI / 180;
const BBY = LL * Math.cos(LAR);   // body bottom Y
const BCY = BBY + BH / 2;         // body center Y
const BTY = BBY + BH;             // body top Y
const HW = BW / 2;
const HD = BD / 2;

// === Materials ===
const matBody = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.5, metalness: 0.15 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x454545, roughness: 0.85, metalness: 0.05 });
const matFrame = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.35, metalness: 0.3 });
const matLeg = new THREE.MeshStandardMaterial({ color: 0x838383, roughness: 0.35, metalness: 0.2 });
const matLine = new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.8 });

// ===================
// MAIN BODY - extruded cross-section with chamfered front edges
// ===================
const bodyShape = new THREE.Shape();
bodyShape.moveTo(-HW, -HD);        // back-left
bodyShape.lineTo(HW, -HD);         // back-right
bodyShape.lineTo(HW, HD - CH);     // right side approaching front
bodyShape.lineTo(HW - CH, HD);     // right-front chamfer
bodyShape.lineTo(-HW + CH, HD);    // front edge
bodyShape.lineTo(-HW, HD - CH);    // left-front chamfer
bodyShape.closePath();

const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: BH, bevelEnabled: false });
// Rotate so shape XY maps to world XZ, extrusion goes downward (-Y)
bodyGeo.rotateX(Math.PI / 2);
bodyGeo.translate(0, BTY, 0);
scene.add(new THREE.Mesh(bodyGeo, matBody));

// ===================
// TOP PANEL LINES (grooves on top surface)
// ===================
const topY = BTY + 0.05;

// Horizontal groove
const hGrooveGeo = new THREE.BoxGeometry(BW * 0.85, 0.04, 0.08);
const hGroove = new THREE.Mesh(hGrooveGeo, matLine);
hGroove.position.set(0, topY, 0);
scene.add(hGroove);

// Vertical grooves creating panel sections
[-BW * 0.15, BW * 0.05, BW * 0.25].forEach(x => {
    const vGrooveGeo = new THREE.BoxGeometry(0.08, 0.04, BD * 0.85);
    const vGroove = new THREE.Mesh(vGrooveGeo, matLine);
    vGroove.position.set(x, topY, 0);
    scene.add(vGroove);
});

// ===================
// FRONT FACE SECTION DIVIDERS
// ===================
[-4.2, 4.2].forEach(x => {
    const divGeo = new THREE.BoxGeometry(0.1, BH - 1, 0.1);
    const div = new THREE.Mesh(divGeo, matLine);
    div.position.set(x, BCY, HD + 0.02);
    scene.add(div);
});

// ===================
// SPEAKER GRILLE CREATION
// ===================
function createSpeaker(cx, cy, cz) {
    const grp = new THREE.Group();

    // Octagonal geometry helpers
    function octPoints(r) {
        return Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
            return [Math.cos(a) * r, Math.sin(a) * r];
        });
    }

    function makeOctShape(r) {
        const s = new THREE.Shape();
        const p = octPoints(r);
        s.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < 8; i++) s.lineTo(p[i][0], p[i][1]);
        s.closePath();
        return s;
    }

    function makeOctPath(r) {
        const path = new THREE.Path();
        const p = octPoints(r);
        path.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < 8; i++) path.lineTo(p[i][0], p[i][1]);
        path.closePath();
        return path;
    }

    function makeOctRing(outerR, innerR, d) {
        const s = makeOctShape(outerR);
        s.holes.push(makeOctPath(innerR));
        return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    }

    // Dark background fill inside octagon
    const bg = new THREE.Mesh(new THREE.ShapeGeometry(makeOctShape(SOR - 0.2)), matDark);
    bg.position.z = 0.03;
    grp.add(bg);

    // Outer octagonal frame (raised rim)
    grp.add(new THREE.Mesh(makeOctRing(SOR + 0.2, SOR - 0.25, 0.5), matFrame));

    // Second concentric octagonal ring at mid-radius
    const midRing = new THREE.Mesh(makeOctRing(SMR + 0.15, SMR - 0.15, 0.3), matFrame);
    midRing.position.z = 0.1;
    grp.add(midRing);

    // Inner concentric ring (between center and mid)
    const innerRingR = (SIR + SMR) / 2;
    const innerRing = new THREE.Mesh(makeOctRing(innerRingR + 0.08, innerRingR - 0.08, 0.2), matFrame);
    innerRing.position.z = 0.08;
    grp.add(innerRing);

    // Center disc (speaker dome)
    const discGeo = new THREE.CylinderGeometry(SIR, SIR, 0.4, 32);
    discGeo.rotateX(Math.PI / 2);
    const disc = new THREE.Mesh(discGeo, matFrame);
    disc.position.z = 0.25;
    grp.add(disc);

    // Center disc inner ring detail
    const discRingGeo = new THREE.TorusGeometry(SIR * 0.6, 0.06, 8, 24);
    const discRing = new THREE.Mesh(discRingGeo, matLine);
    discRing.position.z = 0.46;
    grp.add(discRing);

    // Radial tick marks between concentric rings
    for (let i = 0; i < NT; i++) {
        const a = (i / NT) * Math.PI * 2;
        const ca = Math.cos(a), sa = Math.sin(a);

        // Outer ticks (between mid ring and outer frame)
        const oR1 = SMR + 0.28, oR2 = SOR - 0.35;
        if (oR2 > oR1) {
            const tl = oR2 - oR1, mr = (oR1 + oR2) / 2;
            const t = new THREE.Mesh(new THREE.BoxGeometry(0.09, tl, 0.11), matDark);
            t.position.set(ca * mr, sa * mr, 0.18);
            t.rotation.z = a - Math.PI / 2;
            grp.add(t);
        }

        // Mid ticks (between inner ring and mid ring)
        const mR1 = innerRingR + 0.18, mR2 = SMR - 0.25;
        if (mR2 > mR1) {
            const tl = mR2 - mR1, mr = (mR1 + mR2) / 2;
            const t = new THREE.Mesh(new THREE.BoxGeometry(0.08, tl, 0.1), matDark);
            t.position.set(ca * mr, sa * mr, 0.14);
            t.rotation.z = a - Math.PI / 2;
            grp.add(t);
        }

        // Inner ticks (between center disc and inner ring)
        const iR1 = SIR + 0.2, iR2 = innerRingR - 0.18;
        if (iR2 > iR1) {
            const tl = iR2 - iR1, mr = (iR1 + iR2) / 2;
            const t = new THREE.Mesh(new THREE.BoxGeometry(0.07, tl, 0.1), matDark);
            t.position.set(ca * mr, sa * mr, 0.12);
            t.rotation.z = a - Math.PI / 2;
            grp.add(t);
        }
    }

    grp.position.set(cx, cy, cz);
    return grp;
}

// Add left and right speakers to front face
scene.add(createSpeaker(-SXO, BCY, HD));
scene.add(createSpeaker(SXO, BCY, HD));

// ===================
// DECORATIVE X PATTERN (between speakers)
// ===================
(function () {
    const g = new THREE.Group();
    const lw = 0.2, ld = 0.14;

    function seg(x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.01) return;
        const ang = Math.atan2(dy, dx);
        const m = new THREE.Mesh(new THREE.BoxGeometry(len, lw, ld), matFrame);
        m.position.set((x1 + x2) / 2, (y1 + y2) / 2, ld / 2);
        m.rotation.z = ang;
        g.add(m);
    }

    const w = 3.5, h = 4.5;

    // Main X diagonal lines
    seg(-w, -h, w, h);
    seg(-w, h, w, -h);

    // Center diamond outline
    const dw = 2.0, dh = 2.5;
    seg(-dw, 0, 0, dh);
    seg(0, dh, dw, 0);
    seg(dw, 0, 0, -dh);
    seg(0, -dh, -dw, 0);

    // Horizontal center lines (bowtie sides)
    seg(-w, 0, -dw * 0.6, 0);
    seg(dw * 0.6, 0, w, 0);

    // Vertical center accent
    seg(0, -h * 0.65, 0, h * 0.65);

    // Arrow/chevron pointing left
    seg(-w, h * 0.45, -dw * 0.3, 0);
    seg(-w, -h * 0.45, -dw * 0.3, 0);

    // Arrow/chevron pointing right
    seg(w, h * 0.45, dw * 0.3, 0);
    seg(w, -h * 0.45, dw * 0.3, 0);

    // Upper and lower border segments
    seg(-w, h, -w * 0.25, h);
    seg(w * 0.25, h, w, h);
    seg(-w, -h, -w * 0.25, -h);
    seg(w * 0.25, -h, w, -h);

    // Small inner chevrons
    seg(-dw * 0.5, dh * 0.5, 0, dh * 0.85);
    seg(dw * 0.5, dh * 0.5, 0, dh * 0.85);
    seg(-dw * 0.5, -dh * 0.5, 0, -dh * 0.85);
    seg(dw * 0.5, -dh * 0.5, 0, -dh * 0.85);

    g.position.set(0, BCY, HD + 0.02);
    scene.add(g);
})();

// ===================
// BUTTONS ON RIGHT SIDE
// ===================
for (let i = -1; i <= 1; i++) {
    // Button cylinder protruding from right face
    const btnGeo = new THREE.CylinderGeometry(BTR, BTR, 0.2, 16);
    btnGeo.rotateZ(Math.PI / 2);
    const btn = new THREE.Mesh(btnGeo, matFrame);
    btn.position.set(HW + 0.1, BCY + 1.8, i * BTS);
    scene.add(btn);

    // Ring detail on button face
    const ringGeo = new THREE.TorusGeometry(BTR * 0.7, 0.05, 8, 16);
    ringGeo.rotateY(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, matLine);
    ring.position.set(HW + 0.21, BCY + 1.8, i * BTS);
    scene.add(ring);

    // Small icon dot in center of button
    const dotGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const dot = new THREE.Mesh(dotGeo, matLine);
    dot.position.set(HW + 0.22, BCY + 1.8, i * BTS);
    scene.add(dot);
}

// ===================
// LEGS - 4 tapered cylinders angled outward
// ===================
const legAttachPoints = [
    { x: -HW + 2.5, z: HD - 1.5 },   // front-left
    { x: -HW + 2.5, z: -HD + 1.5 },  // back-left
    { x: HW - 2.5, z: HD - 1.5 },    // front-right
    { x: HW - 2.5, z: -HD + 1.5 },   // back-right
];

legAttachPoints.forEach(pt => {
    // Outward direction from body center
    const dist = Math.sqrt(pt.x * pt.x + pt.z * pt.z);
    const outX = pt.x / dist;
    const outZ = pt.z / dist;

    // Leg direction: downward with outward splay
    const sinA = Math.sin(LAR);
    const cosA = Math.cos(LAR);
    const dir = new THREE.Vector3(outX * sinA, -cosA, outZ * sinA).normalize();

    // Tapered cylinder - thick at top (body), thin at bottom (floor)
    const legGeo = new THREE.CylinderGeometry(LTR, LBR, LL, 12);
    legGeo.translate(0, -LL / 2, 0); // top of leg at local origin

    const leg = new THREE.Mesh(legGeo, matLeg);
    leg.position.set(pt.x, BBY, pt.z);

    // Rotate leg from (0,-1,0) to desired splay direction
    leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);

    scene.add(leg);

    // Small rounded cap at top of leg where it meets body
    const capGeo = new THREE.SphereGeometry(LTR * 1.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    capGeo.rotateX(Math.PI);
    const cap = new THREE.Mesh(capGeo, matLeg);
    cap.position.set(pt.x, BBY + 0.05, pt.z);
    scene.add(cap);
});

// ===================
// CAMERA POSITIONING (isometric-like view matching reference)
// ===================
camera.position.set(38, 30, 32);
camera.lookAt(0, BCY - 2, 0);