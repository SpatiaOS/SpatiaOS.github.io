// Parameters
const clockRadius = 20;
const baseHeight = 2.0;
const bezelWidth = 2.5;
const bezelRise = 1.2;
const innerRingInnerR = 15.5;
const innerRingOuterR = 16.3;
const innerRingRise = 0.7;
const numeralRadius = 13;
const barWidth = 0.35;
const barDepth = 0.8;
const strokeH = 1.0;
const strokeSp = 0.5;
const vSpread = 0.5;
const compGap = 0.35;
const hubRadius = 2.5;
const hubRise = 1.0;
const pinRadius = 0.5;
const pinRise = 0.4;
const hourLen = 9;
const minLen = 14;
const handW = 0.3;
const handH = 0.15;
const faceY = baseHeight;

// Material - uniform silver-gray metallic finish
const mat = new THREE.MeshStandardMaterial({
    color: 0x999999,
    metalness: 0.35,
    roughness: 0.55
});

// --- Base disc ---
const baseGeo = new THREE.CylinderGeometry(clockRadius, clockRadius, baseHeight, 64);
const baseMesh = new THREE.Mesh(baseGeo, mat);
baseMesh.position.y = baseHeight / 2;
scene.add(baseMesh);

// --- Bezel (outer raised ring) ---
const bezelShape = new THREE.Shape();
bezelShape.absarc(0, 0, clockRadius, 0, Math.PI * 2, false);
const bezelHole = new THREE.Path();
bezelHole.absarc(0, 0, clockRadius - bezelWidth, 0, Math.PI * 2, true);
bezelShape.holes.push(bezelHole);
const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, { depth: bezelRise, bevelEnabled: false });
const bezelMesh = new THREE.Mesh(bezelGeo, mat);
bezelMesh.rotation.x = -Math.PI / 2;
bezelMesh.position.y = faceY;
scene.add(bezelMesh);

// --- Inner ring / track ---
const irShape = new THREE.Shape();
irShape.absarc(0, 0, innerRingOuterR, 0, Math.PI * 2, false);
const irHole = new THREE.Path();
irHole.absarc(0, 0, innerRingInnerR, 0, Math.PI * 2, true);
irShape.holes.push(irHole);
const irGeo = new THREE.ExtrudeGeometry(irShape, { depth: innerRingRise, bevelEnabled: false });
const irMesh = new THREE.Mesh(irGeo, mat);
irMesh.rotation.x = -Math.PI / 2;
irMesh.position.y = faceY;
scene.add(irMesh);

// --- Center hub ---
const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, hubRise, 32);
const hubMesh = new THREE.Mesh(hubGeo, mat);
hubMesh.position.y = faceY + hubRise / 2;
scene.add(hubMesh);

// --- Center pin ---
const pinGeo = new THREE.CylinderGeometry(pinRadius, pinRadius, pinRise, 16);
const pinMesh = new THREE.Mesh(pinGeo, mat);
pinMesh.position.y = faceY + hubRise + pinRise / 2;
scene.add(pinMesh);

// --- Roman Numeral Builder ---
// Each numeral is built in local space: X = left/right, Z = up (radially outward), Y = extrusion
function createNumeral(n) {
    const group = new THREE.Group();

    function addStroke(x1, z1, x2, z2) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const ang = Math.atan2(dx, dz);
        const geo = new THREE.BoxGeometry(barWidth, barDepth, len);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((x1 + x2) / 2, barDepth / 2, (z1 + z2) / 2);
        mesh.rotation.y = ang;
        group.add(mesh);
    }

    const h = strokeH;
    const sp = strokeSp;
    const va = vSpread;
    const cg = compGap;

    // Primitives: I (vertical bar), V (two strokes from bottom point), X (two crossing strokes)
    const I = (x) => addStroke(x, -h, x, h);
    const V = (x) => { addStroke(x, -h, x - va, h); addStroke(x, -h, x + va, h); };
    const X = (x) => { addStroke(x - va, -h, x + va, h); addStroke(x + va, -h, x - va, h); };

    switch (n) {
        case 1: I(0); break;
        case 2: I(-sp / 2); I(sp / 2); break;
        case 3: I(-sp); I(0); I(sp); break;
        case 4: {
            const t = cg + 2 * va;
            I(-t / 2);
            V(-t / 2 + cg + va);
            break;
        }
        case 5: V(0); break;
        case 6: {
            const t = 2 * va + cg;
            V(-t / 2 + va);
            I(t / 2);
            break;
        }
        case 7: {
            const t = 2 * va + cg + sp;
            const s = -t / 2;
            V(s + va);
            I(s + 2 * va + cg);
            I(s + 2 * va + cg + sp);
            break;
        }
        case 8: {
            const t = 2 * va + cg + 2 * sp;
            const s = -t / 2;
            V(s + va);
            I(s + 2 * va + cg);
            I(s + 2 * va + cg + sp);
            I(s + 2 * va + cg + 2 * sp);
            break;
        }
        case 9: {
            const t = cg + 2 * va;
            I(-t / 2);
            X(-t / 2 + cg + va);
            break;
        }
        case 10: X(0); break;
        case 11: {
            const t = 2 * va + cg;
            X(-t / 2 + va);
            I(t / 2);
            break;
        }
        case 12: {
            const t = 2 * va + cg + sp;
            const s = -t / 2;
            X(s + va);
            I(s + 2 * va + cg);
            I(s + 2 * va + cg + sp);
            break;
        }
    }

    return group;
}

// --- Place 12 Roman numerals around the clock face ---
for (let i = 1; i <= 12; i++) {
    const angle = i * Math.PI / 6; // clockwise from 12 o'clock
    const numeral = createNumeral(i);
    numeral.position.z = numeralRadius; // offset radially outward in local space

    const pivot = new THREE.Group();
    pivot.add(numeral);
    pivot.rotation.y = angle;
    pivot.position.y = faceY;
    scene.add(pivot);
}

// --- Clock hands (classic 10:10 display) ---
const handMat = new THREE.MeshStandardMaterial({
    color: 0x777777,
    metalness: 0.4,
    roughness: 0.4
});

function createHand(length, width, height) {
    const geo = new THREE.BoxGeometry(width, height, length);
    const mesh = new THREE.Mesh(geo, handMat);
    mesh.position.z = length / 2; // pivot at one end
    return mesh;
}

// Hour hand pointing at ~10 o'clock (305 degrees from 12)
const hourAngle = (10 + 10 / 60) * Math.PI / 6;
const hourHand = createHand(hourLen, handW, handH);
const hourPivot = new THREE.Group();
hourPivot.add(hourHand);
hourPivot.rotation.y = hourAngle;
hourPivot.position.y = faceY + hubRise + handH;
scene.add(hourPivot);

// Minute hand pointing at ~2 o'clock (60 degrees from 12)
const minAngle = (10 / 60) * 2 * Math.PI;
const minuteHand = createHand(minLen, handW * 0.65, handH);
const minPivot = new THREE.Group();
minPivot.add(minuteHand);
minPivot.rotation.y = minAngle;
minPivot.position.y = faceY + hubRise + handH * 3;
scene.add(minPivot);

// --- Camera ---
camera.position.set(32, 30, 32);
camera.lookAt(0, 1, 0);