// ============================================================
// Hand-cranked geared winch / pump model
// Interpretation: a large vertical ring gear (internal teeth)
// with a concentric spoked spur wheel, mounted on a horizontal
// axle held by a triangular frame plate on ground rails.
// A drum/cylinder sits on the axle left of the frame, and two
// crank lever arms with hand grips extend from the axle end.
// ============================================================

// ---- Parameters ----
const groundY      = 0;
const axleY        = 17;      // axle height
const axleR        = 0.9;

const gearX        = 6;       // gear plane position along axle (X)
const ringOuterR   = 16;
const ringInnerR   = 13.4;
const ringDepth    = 3;
const ringTeeth    = 60;      // internal teeth
const ringToothR   = 12.7;

const innerOuterR  = 9.4;     // spoked spur wheel
const innerInnerR  = 7.8;
const innerDepth   = 2.4;
const innerTeeth   = 36;
const innerToothR  = 10.0;
const spokeCount   = 5;

const triX         = -2;      // triangular frame plate
const triThick     = 2;
const triHalfBase  = 9;

const drumX        = -7.5;    // drum on axle
const drumR        = 2.5;
const drumLen      = 7;

const pivotX       = -13.5;   // crank lever pivot at axle end
const armALen      = 27, armAAng = 0.70;   // long lever (rad, from +Y toward -Z)
const armBLen      = 15, armBAng = 0.32;   // short lever
const gripLen      = 5, gripR = 0.9;

const mat = new THREE.MeshStandardMaterial({ color: 0xbfc2c6, metalness: 0.25, roughness: 0.55 });
const matDark = new THREE.MeshStandardMaterial({ color: 0xa8abb0, metalness: 0.3, roughness: 0.5 });

const machine = new THREE.Group();
scene.add(machine);

// ---- Helpers ----
function addBox(w, h, d, x, y, z, rx = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.rotation.x = rx;
    machine.add(m);
    return m;
}
function cylX(r, len, x, y, z, material = mat) {
    const g = new THREE.CylinderGeometry(r, r, len, 24);
    g.rotateZ(Math.PI / 2); // axis along X
    const m = new THREE.Mesh(g, material);
    m.position.set(x, y, z);
    machine.add(m);
    return m;
}
function ringPart(outerR, innerR, depth, xCenter) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
    g.rotateY(Math.PI / 2);          // extrude along X, face in YZ plane
    g.translate(xCenter - depth / 2, 0, 0);
    const m = new THREE.Mesh(g, mat);
    m.position.y = axleY;
    machine.add(m);
    return m;
}

// ---- Base: two ground rails (along Z) with foot pads ----
addBox(1.8, 1.2, 26, triX, 1.4, 0);
addBox(1.8, 1.2, 26, gearX, 1.4, 0);
for (const rx of [triX, gearX]) {
    for (const sz of [-12, 12]) {
        addBox(3.0, 1.2, 3.2, rx, 0.6, sz);
    }
}

// ---- Triangular frame plate (in YZ plane, extruded along X) ----
{
    const s = new THREE.Shape();
    s.moveTo(-triHalfBase, 2);
    s.lineTo(triHalfBase, 2);
    s.lineTo(0, axleY + 0.5);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: triThick, bevelEnabled: false });
    g.rotateY(Math.PI / 2);
    g.translate(triX - triThick / 2, 0, 0);
    // shape x-axis maps to -Z after rotation; mirror not needed (symmetric)
    const m = new THREE.Mesh(g, mat);
    machine.add(m);
}
// hub boss on frame apex
cylX(2.4, 5, triX, axleY, 0);

// ---- Axle ----
cylX(axleR, 23, -3, axleY, 0, matDark);

// ---- Drum / cylinder on axle (left of frame) ----
cylX(drumR, drumLen, drumX, axleY, 0);
cylX(drumR + 0.4, 3, drumX, axleY, 0);          // middle sleeve
cylX(drumR + 0.6, 0.8, drumX + drumLen / 2 - 0.4, axleY, 0); // flange

// ---- Large ring gear with internal teeth ----
ringPart(ringOuterR, ringInnerR, ringDepth, gearX);
for (let i = 0; i < ringTeeth; i++) {
    const a = (i / ringTeeth) * Math.PI * 2;
    const t = addBox(2.6, 1.6, 1.0, 0, 0, 0);
    t.position.set(gearX, axleY + Math.cos(a) * ringToothR, Math.sin(a) * ringToothR);
    t.rotation.x = a;
}

// ---- Inner spoked spur wheel (external teeth) ----
ringPart(innerOuterR, innerInnerR, innerDepth, gearX);
for (let i = 0; i < innerTeeth; i++) {
    const a = (i / innerTeeth) * Math.PI * 2;
    const t = addBox(2.2, 1.4, 0.8, 0, 0, 0);
    t.position.set(gearX, axleY + Math.cos(a) * innerToothR, Math.sin(a) * innerToothR);
    t.rotation.x = a;
}
// spokes + cross rungs (ladder look) + hub
for (let i = 0; i < spokeCount; i++) {
    const a = (i / spokeCount) * Math.PI * 2;
    const sp = addBox(1.8, 6.5, 1.1, 0, 0, 0);
    sp.position.set(gearX, axleY + Math.cos(a) * 4.6, Math.sin(a) * 4.6);
    sp.rotation.x = a;
    const a2 = a + Math.PI / spokeCount;
    const rg = addBox(1.5, 1.0, 3.4, 0, 0, 0);
    rg.position.set(gearX, axleY + Math.cos(a2) * 5.6, Math.sin(a2) * 5.6);
    rg.rotation.x = a2;
}
cylX(2.0, 3.4, gearX, axleY, 0, matDark);

// ---- Crank lever arms with grips (rotate in YZ plane at axle end) ----
cylX(1.6, 1.6, pivotX + 0.5, axleY, 0, matDark); // pivot hub
function lever(len, ang) {
    const g = new THREE.BoxGeometry(1.6, len, 0.9);
    g.translate(0, len / 2, 0);
    const m = new THREE.Mesh(g, mat);
    m.position.set(pivotX, axleY, 0);
    m.rotation.x = -ang; // tilt from +Y toward -Z
    machine.add(m);
    const ty = axleY + Math.cos(ang) * len;
    const tz = -Math.sin(ang) * len;
    cylX(gripR, gripLen, pivotX - 2.2, ty, tz, matDark); // grip parallel to axle
}
lever(armALen, armAAng);
lever(armBLen, armBAng);

// ---- Small side handle rod + peg near drum ----
addBox(9, 0.6, 0.6, -9.5, axleY - 2.8, -3.2);
cylX(0.9, 4.5, -6.5, axleY - 2.8, -3.2, matDark);

// ---- Camera ----
camera.position.set(-52, 40, 52);
camera.lookAt(0, 12, 0);