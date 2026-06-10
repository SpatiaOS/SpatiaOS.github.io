// Parameters for the speaker model
const bw = 24; // Body width
const bh = 11; // Body height
const bd = 8;  // Body depth
const cornerRadius = 0.5;

// Materials
const bodyMat = new THREE.MeshStandardMaterial({ 
    color: 0x999999, 
    roughness: 0.5, 
    metalness: 0.1 
});
const darkMat = new THREE.MeshStandardMaterial({ 
    color: 0x444444, 
    roughness: 0.7,
    metalness: 0.2
});
const blackMat = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.9 
});

// --- 1. Main Body ---
// Create a rounded rectangle shape for the main body
function createRoundedRect(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
    return shape;
}

const bodyShape = createRoundedRect(bw, bh, cornerRadius);
const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: bd,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.1,
    bevelThickness: 0.1
});
bodyGeo.translate(0, 0, -bd/2); // Center the body on the Z axis
const body = new THREE.Mesh(bodyGeo, bodyMat);
scene.add(body);

const faceZ = bd/2 + 0.1; // Z position of the front face (accounting for bevel)
const topY = bh/2 + 0.1;  // Y position of the top face
const bottomY = -bh/2 - 0.1; // Y position of the bottom face

// --- 2. Split Lines / Grooves ---
const grooveMat = blackMat;
const gW = 0.08;

// Front vertical groove
const gFrontV = new THREE.Mesh(new THREE.BoxGeometry(gW, bh, gW), grooveMat);
gFrontV.position.set(0, 0, faceZ);
scene.add(gFrontV);

// Top front-to-back groove
const gTopFB = new THREE.Mesh(new THREE.BoxGeometry(gW, gW, bd), grooveMat);
gTopFB.position.set(0, topY, 0);
scene.add(gTopFB);

// Top left-to-right groove
const gTopLR = new THREE.Mesh(new THREE.BoxGeometry(bw, gW, gW), grooveMat);
gTopLR.position.set(0, topY, 0);
scene.add(gTopLR);

// --- 3. Speakers ---
function createSpeaker(xPos) {
    const group = new THREE.Group();

    const hexOuterR = 4.8;
    const hexInnerR = 3.8;
    const speakerR = 2.5;

    // Hexagon Frame
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * hexOuterR;
        const y = Math.sin(angle) * hexOuterR;
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
    }
    const hexHole = new THREE.Path();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * hexInnerR;
        const y = Math.sin(angle) * hexInnerR;
        if (i === 0) hexHole.moveTo(x, y);
        else hexHole.lineTo(x, y);
    }
    hexShape.holes.push(hexHole);

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const hexGeo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    const hexMesh = new THREE.Mesh(hexGeo, bodyMat);
    hexMesh.position.z = faceZ;
    group.add(hexMesh);

    // Dark backing behind the speaker
    const backingGeo = new THREE.CylinderGeometry(hexInnerR, hexInnerR, 0.2, 32);
    backingGeo.rotateX(Math.PI / 2);
    const backing = new THREE.Mesh(backingGeo, blackMat);
    backing.position.z = faceZ + 0.1;
    group.add(backing);

    // Textured ring (radial fins)
    const finCount = 72;
    const finGeo = new THREE.BoxGeometry(1, 0.06, 0.15);
    finGeo.translate(0.5, 0, 0); // Move origin to base of fin

    for(let i=0; i<finCount; i++) {
        const angle = (i / finCount) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, bodyMat);
        fin.rotation.z = angle;
        fin.position.set(Math.cos(angle) * speakerR, Math.sin(angle) * speakerR, faceZ + 0.2);
        
        // Randomize length to create a jagged barcode-like inner ring
        const maxLen = hexInnerR - speakerR - 0.2;
        fin.scale.x = maxLen * (0.5 + Math.random() * 0.5);
        group.add(fin);
    }

    // Speaker cone
    const coneGeo = new THREE.CylinderGeometry(speakerR, speakerR * 0.7, 0.3, 32);
    coneGeo.rotateX(Math.PI / 2);
    const coneMesh = new THREE.Mesh(coneGeo, bodyMat);
    coneMesh.position.z = faceZ + 0.25;
    group.add(coneMesh);

    // Center dome
    const domeGeo = new THREE.SphereGeometry(speakerR * 0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeo.rotateX(Math.PI / 2);
    domeGeo.scale(1, 1, 0.4); // Flatten the dome
    const domeMesh = new THREE.Mesh(domeGeo, darkMat);
    domeMesh.position.z = faceZ + 0.4;
    group.add(domeMesh);

    group.position.x = xPos;
    return group;
}

scene.add(createSpeaker(-6.5));
scene.add(createSpeaker(6.5));

// --- 4. Center Geometric Detail ---
const centerGroup = new THREE.Group();
centerGroup.position.z = faceZ;
scene.add(centerGroup);

// Vertical bar
const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 9, 0.25), bodyMat);
centerGroup.add(vBar);

// Helper to create hollow diamond shapes
function createDiamond(w, h, thickness) {
    const shape = new THREE.Shape();
    shape.moveTo(0, h); shape.lineTo(w, 0); shape.lineTo(0, -h); shape.lineTo(-w, 0); shape.lineTo(0, h);
    const hole = new THREE.Path();
    const scale = (w - thickness) / w;
    hole.moveTo(0, h * scale); hole.lineTo(w * scale, 0); hole.lineTo(0, -h * scale); hole.lineTo(-w * scale, 0); hole.lineTo(0, h * scale);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {depth: 0.2, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 1});
    return new THREE.Mesh(geo, bodyMat);
}

const outerDiamond = createDiamond(2.2, 4.5, 0.3);
centerGroup.add(outerDiamond);

const innerDiamond = createDiamond(1.4, 3.0, 0.2);
innerDiamond.position.z = 0.05;
centerGroup.add(innerDiamond);

// --- 5. Buttons ---
const btnR = 0.6;
const btnH = 0.2;
const btnGeo = new THREE.CylinderGeometry(btnR, btnR, btnH, 32);
const btnYPos = topY + btnH/2;
const symY = btnYPos + btnH/2; // Y position for the symbols
const symMat = blackMat;

// Button bases
const btn1 = new THREE.Mesh(btnGeo, bodyMat); btn1.position.set(5, btnYPos, 0); scene.add(btn1);
const btn2 = new THREE.Mesh(btnGeo, bodyMat); btn2.position.set(7.5, btnYPos, 0); scene.add(btn2);
const btn3 = new THREE.Mesh(btnGeo, bodyMat); btn3.position.set(10, btnYPos, 0); scene.add(btn3);

// Minus symbol
const minus = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.1), symMat);
minus.position.set(5, symY, 0);
scene.add(minus);

// Plus symbol
const plusGroup = new THREE.Group();
plusGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.1), symMat));
plusGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.5), symMat));
plusGroup.position.set(7.5, symY, 0);
scene.add(plusGroup);

// Power symbol
const powerGroup = new THREE.Group();
const ringGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 24, Math.PI * 1.5);
const ring = new THREE.Mesh(ringGeo, symMat);
ring.rotation.x = Math.PI / 2;
ring.rotation.z = -Math.PI * 0.75; // Rotate gap to the top
const pLine = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.2), symMat);
pLine.position.z = -0.1;
powerGroup.add(ring, pLine);
powerGroup.position.set(10, symY, 0);
scene.add(powerGroup);

// --- 6. Legs ---
const legH = 10;
const legRTop = 0.7;
const legRBot = 0.3;
const legGeo = new THREE.CylinderGeometry(legRTop, legRBot, legH, 32);
legGeo.translate(0, -legH/2, 0); // Origin at the top of the leg

function createLeg(x, z, rotX, rotZ) {
    const leg = new THREE.Mesh(legGeo, bodyMat);
    leg.position.set(x, bottomY, z);
    leg.rotation.set(rotX, 0, rotZ);
    return leg;
}

const legInX = bw/2 - 2.5;
const legInZ = bd/2 - 1.5;
const angleX = 0.35;
const angleZ = 0.35;

scene.add(createLeg(-legInX, legInZ, angleX, -angleZ));   // Front Left
scene.add(createLeg(legInX, legInZ, angleX, angleZ));     // Front Right
scene.add(createLeg(-legInX, -legInZ, -angleX, -angleZ)); // Back Left
scene.add(createLeg(legInX, -legInZ, -angleX, angleZ));   // Back Right

// --- 7. Camera Adjustment ---
camera.position.set(25, 20, 30);
camera.lookAt(0, 0, 0);