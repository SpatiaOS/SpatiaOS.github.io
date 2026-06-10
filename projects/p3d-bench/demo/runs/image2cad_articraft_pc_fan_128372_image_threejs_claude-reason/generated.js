// =============================================
// Computer Cooling Fan (80mm) - Three.js Model
// =============================================

// --- Parameters ---
const frameSize = 80;
const frameDepth = 25;
const cornerRadius = 5;
const openingRadius = 37;
const hubRadius = 13;
const hubCapRadius = 16;
const numBlades = 7;
const mountHoleR = 2;
const mountInset = 5.5;

// --- Materials ---
const housingMat = new THREE.MeshStandardMaterial({
    color: 0x787880, metalness: 0.5, roughness: 0.5
});
const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x8a8a92, metalness: 0.3, roughness: 0.45, side: THREE.DoubleSide
});

const fan = new THREE.Group();

// ===== FRAME (square housing with circular opening) =====
const frameShape = new THREE.Shape();
const hs = frameSize / 2;

// Rounded rectangle outline
frameShape.moveTo(-hs + cornerRadius, -hs);
frameShape.lineTo(hs - cornerRadius, -hs);
frameShape.quadraticCurveTo(hs, -hs, hs, -hs + cornerRadius);
frameShape.lineTo(hs, hs - cornerRadius);
frameShape.quadraticCurveTo(hs, hs, hs - cornerRadius, hs);
frameShape.lineTo(-hs + cornerRadius, hs);
frameShape.quadraticCurveTo(-hs, hs, -hs, hs - cornerRadius);
frameShape.lineTo(-hs, -hs + cornerRadius);
frameShape.quadraticCurveTo(-hs, -hs, -hs + cornerRadius, -hs);

// Central circular opening hole
const circleHole = new THREE.Path();
circleHole.absarc(0, 0, openingRadius, 0, Math.PI * 2, true);
frameShape.holes.push(circleHole);

// Corner mounting holes
const md = hs - mountInset;
const mountCorners = [[-md, -md], [md, -md], [md, md], [-md, md]];
mountCorners.forEach(([mx, my]) => {
    const mh = new THREE.Path();
    mh.absarc(mx, my, mountHoleR, 0, Math.PI * 2, true);
    frameShape.holes.push(mh);
});

// Extrude frame and orient (Y-up)
const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
    depth: frameDepth, bevelEnabled: false
});
frameGeo.rotateX(-Math.PI / 2);
fan.add(new THREE.Mesh(frameGeo, housingMat));

// ===== CIRCULAR RIM LIPS at top and bottom =====
[0, frameDepth].forEach(yPos => {
    const rimGeo = new THREE.TorusGeometry(openingRadius, 1.2, 8, 64);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, housingMat);
    rim.position.y = yPos;
    fan.add(rim);
});

// ===== MOUNTING HOLE BOSSES =====
mountCorners.forEach(([mx, my]) => {
    [0.1, frameDepth - 0.1].forEach(yPos => {
        const bossGeo = new THREE.TorusGeometry(mountHoleR + 1.2, 0.6, 8, 16);
        bossGeo.rotateX(Math.PI / 2);
        const boss = new THREE.Mesh(bossGeo, housingMat);
        // shape (x,y) maps to 3D (x, _, -y) after rotateX(-PI/2)
        boss.position.set(mx, yPos, -my);
        fan.add(boss);
    });
});

// ===== SUPPORT STRUTS (connect frame to motor mount) =====
for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2 + Math.PI / 4;
    const strutLen = openingRadius - hubRadius - 1;
    const midR = (openingRadius + hubRadius) / 2;

    const strutGeo = new THREE.BoxGeometry(4, 3.5, strutLen);
    const strut = new THREE.Mesh(strutGeo, housingMat);
    strut.position.set(
        Math.cos(angle) * midR,
        1.75,
        Math.sin(angle) * midR
    );
    // Orient strut radially
    strut.rotation.y = Math.PI / 2 - angle;
    fan.add(strut);
}

// Motor mount at center (connects to struts)
const motorGeo = new THREE.CylinderGeometry(5, 5, 4, 16);
const motorMesh = new THREE.Mesh(motorGeo, housingMat);
motorMesh.position.y = 2;
fan.add(motorMesh);

// ===== CENTRAL HUB (Rotor) =====
const hubHeight = 17;
const hubCenterY = frameDepth / 2;

// Hub body (slightly tapered)
const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius * 0.88, hubHeight, 32);
const hubMesh = new THREE.Mesh(hubGeo, bladeMat);
hubMesh.position.y = hubCenterY;
fan.add(hubMesh);

// Hub cap (wider disc on top)
const capGeo = new THREE.CylinderGeometry(hubCapRadius, hubCapRadius, 2, 32);
const capMesh = new THREE.Mesh(capGeo, bladeMat);
capMesh.position.y = hubCenterY + hubHeight / 2 + 0.5;
fan.add(capMesh);

// Smooth dome on top of cap
const domeGeo = new THREE.SphereGeometry(hubCapRadius, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2);
domeGeo.scale(1, 0.15, 1);
const domeMesh = new THREE.Mesh(domeGeo, bladeMat);
domeMesh.position.y = hubCenterY + hubHeight / 2 + 1.5;
fan.add(domeMesh);

// ===== FAN BLADES (7 curved, twisted blades) =====
for (let i = 0; i < numBlades; i++) {
    const bladeBase = (i / numBlades) * Math.PI * 2;

    const rSegs = 20;   // radial resolution
    const wSegs = 10;   // width resolution
    const verts = [];
    const idx = [];

    // Each blade spans ~55% of the angular slot
    const arcWidth = (2 * Math.PI / numBlades) * 0.55;

    for (let ri = 0; ri <= rSegs; ri++) {
        const t = ri / rSegs; // 0 = hub edge, 1 = outer tip

        // Radial position
        const rad = hubRadius + 2 + t * (openingRadius - hubRadius - 5);

        // Blade curves forward (sweep) with increasing radius
        const sweep = t * t * 0.55;

        // Angular width narrows slightly toward tip
        const width = arcWidth * (1 - 0.1 * t);

        // Vertical span (pitch) decreases from hub to tip
        const vertSpan = hubHeight * 0.7 * (1 - t * 0.6);

        // Base Y shifts upward toward tip
        const baseY = hubCenterY - vertSpan / 2 + t * 3;

        for (let wi = 0; wi <= wSegs; wi++) {
            const s = wi / wSegs; // 0 = leading edge, 1 = trailing edge
            const theta = bladeBase + sweep + s * width;

            // Add slight concave curvature to blade surface
            const curvature = Math.sin(s * Math.PI) * 1.2 * (1 - t * 0.5);

            verts.push(
                Math.cos(theta) * rad,
                baseY + s * vertSpan - curvature,
                Math.sin(theta) * rad
            );
        }
    }

    // Build triangle indices
    for (let ri = 0; ri < rSegs; ri++) {
        for (let wi = 0; wi < wSegs; wi++) {
            const a = ri * (wSegs + 1) + wi;
            const b = a + 1;
            const c = (ri + 1) * (wSegs + 1) + wi;
            const d = c + 1;
            idx.push(a, c, b, b, c, d);
        }
    }

    const bladeGeo = new THREE.BufferGeometry();
    bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    bladeGeo.setIndex(idx);
    bladeGeo.computeVertexNormals();
    fan.add(new THREE.Mesh(bladeGeo, bladeMat));
}

// ===== CORNER GUIDE VANES (decorative curved ribs on frame top) =====
for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2 + Math.PI / 4;
    const vaneSegs = 12;
    const vaneVerts = [];
    const vaneIdx = [];

    for (let j = 0; j <= vaneSegs; j++) {
        const t = j / vaneSegs;
        const a1 = angle - 0.55 + t * 1.1;
        const r1 = openingRadius + 0.5;
        const r2 = openingRadius + 3 + Math.sin(t * Math.PI) * 4;

        vaneVerts.push(Math.cos(a1) * r1, frameDepth, Math.sin(a1) * r1);
        vaneVerts.push(Math.cos(a1) * r2, frameDepth, Math.sin(a1) * r2);
    }

    for (let j = 0; j < vaneSegs; j++) {
        const a = j * 2, b = a + 1, c = a + 2, d = a + 3;
        vaneIdx.push(a, c, b, b, c, d);
    }

    const vaneGeo = new THREE.BufferGeometry();
    vaneGeo.setAttribute('position', new THREE.Float32BufferAttribute(vaneVerts, 3));
    vaneGeo.setIndex(vaneIdx);
    vaneGeo.computeVertexNormals();

    const vaneMat = new THREE.MeshStandardMaterial({
        color: 0x6e6e76, metalness: 0.5, roughness: 0.5
    });
    const vane = new THREE.Mesh(vaneGeo, vaneMat);
    vane.position.y = 0.3;
    fan.add(vane);
}

// ===== Add to scene =====
scene.add(fan);

// ===== Camera (isometric view matching reference image) =====
camera.position.set(75, 60, 75);
camera.lookAt(0, frameDepth / 2, 0);