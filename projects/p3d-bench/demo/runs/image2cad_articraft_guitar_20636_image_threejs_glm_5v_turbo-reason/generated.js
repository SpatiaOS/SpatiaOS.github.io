// ==========================================
// Electric Guitar (Semi-Hollow Body Style)
// Parametric 3D Model Generation
// ==========================================

// --- Main Dimensions ---
const scale = 1.0;
const bodyLength = 14 * scale;        // Lower bout to upper bout
const upperBoutWidth = 10 * scale;     // Width at top of body
const lowerBoutWidth = 13 * scale;     // Width at bottom of body
const waistWidth = 7.5 * scale;        // Narrowest point (waist)
const bodyDepth = 1.8 * scale;         // Thickness of body
const bodyEdgeRadius = 0.8 * scale;    // Rounded edge bevel effect

const neckLength = 24 * scale;         // From body to start of headstock
const neckWidthAtNut = 1.65 * scale;   // Width at nut (top of neck)
const neckWidthAtBody = 2.6 * scale;   // Width where neck meets body
const neckThickness = 0.85 * scale;    // Neck thickness
const fretboardThickness = 0.15 * scale; // Fretboard overlay

const headstockLength = 6 * scale;
const headstockMaxWidth = 4.5 * scale;
const headstockMinWidth = 3.2 * scale;

// --- Material Definitions ---
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xC4A484,      // Natural wood / maple
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide
});

const neckMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A3728,      // Dark rosewood / mahogany
    roughness: 0.6,
    metalness: 0.02
});

const fretboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x2D1F14,      // Ebony/dark rosewood
    roughness: 0.4,
    metalness: 0.05
});

const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4D4D4,      // Chrome/nickel
    roughness: 0.25,
    metalness: 0.9
});

const blackPlasticMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
    metalness: 0.0
});

const pickupMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,      // Black pickup covers
    roughness: 0.7,
    metalness: 0.2
});

// --- Helper Function: Create Guitar Body Shape ---
function createGuitarBodyShape() {
    const shape = new THREE.Shape();
    
    // Starting from bottom center, drawing clockwise
    const lbX = lowerBoutWidth / 2;   // Lower bout X extent
    const ubX = upperBoutWidth / 2;   // Upper bout X extent
    const wX = waistWidth / 2;        // Waist X extent
    
    const blY = -bodyLength * 0.42;   // Bottom Y
    const wLowY = -bodyLength * 0.15; // Lower waist Y
    const wHighY = bodyLength * 0.15; // Upper waist Y
    const tY = bodyLength * 0.38;     // Top Y (where neck begins)
    
    // Lower bout (right side) - large curve
    shape.moveTo(0, blY);
    shape.quadraticCurveTo(lbX + 1, blY, lbX, blY + 3);
    shape.quadraticCurveTo(lbX + 0.5, wLowY + 1, wX, wLowY);
    
    // Upper bout (right side)
    shape.quadraticCurveTo(wX + 1, wHighY - 1, ubX, wHighY);
    shape.quadraticCurveTo(ubX + 0.5, tY - 1, 0, tY);
    
    // Upper bout (left side) - mirror
    shape.quadraticCurveTo(-ubX - 0.5, tY - 1, -ubX, wHighY);
    shape.quadraticCurveTo(-wX - 1, wHighY - 1, -wX, wHighY);
    
    // Lower bout (left side) - mirror
    shape.quadraticCurveTo(-wX - 1, wLowY + 1, -lbX, blY + 3);
    shape.quadraticCurveTo(-lbX - 1, blY, 0, blY);
    
    return shape;
}

// --- Helper Function: Create F-Hole Shape ---
function createFHoleShape(isLeft) {
    const fShape = new THREE.Shape();
    const direction = isLeft ? -1 : 1;
    const xPos = direction * 3.2;
    const yPos = -1.5;
    
    // Simplified f-hole shape (stylized)
    fShape.moveTo(xPos, yPos + 2.2);
    fShape.bezierCurveTo(xPos + 0.8 * direction, yPos + 2.2, 
                         xPos + 0.8 * direction, yPos + 0.5, 
                         xPos + 0.3 * direction, yPos);
    fShape.bezierCurveTo(xPos + 0.6 * direction, yPos - 0.8, 
                         xPos + 0.2 * direction, yPos - 1.5, 
                         xPos - 0.3 * direction, yPos - 1.8);
    fShape.lineTo(xPos - 0.5 * direction, yPos - 1.6);
    fShape.bezierCurveTo(xPos - 0.1 * direction, yPos - 1.2, 
                         xPos - 0.3 * direction, yPos - 0.6, 
                         xPos - 0.5 * direction, yPos);
    fShape.bezierCurveTo(xPos - 1.0 * direction, yPos + 1.0, 
                         xPos - 1.0 * direction, yPos + 2.2, 
                         xPos, yPos + 2.2);
    
    return fShape;
}

// --- Build Body ---
const bodyShape = createGuitarBodyShape();
const bodyExtrudeSettings = {
    depth: bodyDepth,
    bevelEnabled: true,
    bevelThickness: bodyEdgeRadius * 0.4,
    bevelSize: bodyEdgeRadius * 0.3,
    bevelSegments: 3
};

const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
bodyGeometry.center(); // Center geometry for easier positioning
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotation.x = -Math.PI / 2; // Lay flat on XZ plane
scene.add(body);

// --- Build Neck (Tapered Box) ---
// Using BufferGeometry for tapered shape
const neckGeometry = new THREE.BoxGeometry(
    (neckWidthAtNut + neckWidthAtBody) / 2, 
    neckLength, 
    neckThickness
);

// Adjust vertices for tapering
const posAttr = neckGeometry.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    // Taper width based on Y position (along length)
    const t = (y + neckLength/2) / neckLength; // 0 at body, 1 at nut
    const currentWidth = neckWidthAtBody - t * (neckWidthAtBody - neckWidthAtNut);
    const x = posAttr.getX(i);
    if (Math.abs(x) > 0.01) { // Only adjust side vertices
        const sign = x > 0 ? 1 : -1;
        posAttr.setX(i, sign * (currentWidth / 2));
    }
}
posAttr.needsUpdate = true;
neckGeometry.computeVertexNormals();

const neck = new THREE.Mesh(neckGeometry, neckMaterial);
neck.position.set(0, neckThickness/2 + bodyDepth/2 - 0.1, bodyLength/2 + neckLength/2);
scene.add(neck);

// --- Build Fretboard ---
const fretboardGeometry = new THREE.BoxGeometry(
    neckWidthAtNut + 0.1, 
    neckLength, 
    fretboardThickness
);
const fretboardPosAttr = fretboardGeometry.attributes.position;
for (let i = 0; i < fretboardPosAttr.count; i++) {
    const y = fretboardPosAttr.getY(i);
    const t = (y + neckLength/2) / neckLength;
    const currentWidth = (neckWidthAtBody + 0.05) - t * ((neckWidthAtBody + 0.05) - (neckWidthAtNut + 0.1));
    const x = fretboardPosAttr.getX(i);
    if (Math.abs(x) > 0.01) {
        const sign = x > 0 ? 1 : -1;
        fretboardPosAttr.setX(i, sign * (currentWidth / 2));
    }
}
fretboardPosAttr.needsUpdate = true;
fretboardGeometry.computeVertexNormals();

const fretboard = new THREE.Mesh(fretboardGeometry, fretboardMaterial);
fretboard.position.set(0, neckThickness + fretboardThickness/2 + bodyDepth/2 - 0.1, 
                       bodyLength/2 + neckLength/2);
scene.add(fretboard);

// --- Add Frets (thin metal strips) ---
const numFrets = 22;
const fretWireGeometry = new THREE.BoxGeometry(neckWidthAtNut + 0.15, 0.03, 0.06);
for (let i = 0; i < numFrets; i++) {
    // Calculate fret position (using rule of 18 approximation)
    const distFromNut = neckLength * (1 - Math.pow(0.9439, i)); // Simplified fret spacing
    const fretZ = (bodyLength/2 + neckLength/2) - neckLength/2 + distFromNut;
    
    // Calculate local width at this fret position
    const t = distFromNut / neckLength;
    const localWidth = (neckWidthAtBody + 0.05) - t * ((neckWidthAtBody + 0.05) - (neckWidthAtNut + 0.1));
    
    const fretGeom = new THREE.BoxGeometry(localWidth, 0.03, 0.06);
    const fret = new THREE.Mesh(fretGeom, metalMaterial);
    fret.position.set(0, neckThickness + fretboardThickness + 0.02 + bodyDepth/2 - 0.1, fretZ);
    scene.add(fret);
}

// --- Build Headstock ---
const headstockShape = new THREE.Shape();
const hsL = headstockLength;
const hsWTop = headstockMaxWidth / 2;
const hsWBot = headstockMinWidth / 2;

headstockShape.moveTo(-hsWBot, 0);
headstockShape.lineTo(-hsWTop, hsL);
headstockShape.quadraticCurveTo(-hsWTop + 0.3, hsL + 0.5, -hsWTop + 0.8, hsL + 0.5);
headstockShape.lineTo(hsWTop - 0.8, hsL + 0.5);
headstockShape.quadraticCurveTo(hsWTop - 0.3, hsL + 0.5, hsWTop, hsL);
headstockShape.lineTo(hsWBot, 0);
headstockShape.lineTo(-hsWBot, 0);

const headstockExtrudeSettings = {
    depth: neckThickness * 0.75,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 2
};
const headstockGeometry = new THREE.ExtrudeGeometry(headstockShape, headstockExtrudeSettings);
const headstock = new THREE.Mesh(headstockGeometry, neckMaterial);
headstock.rotation.x = -Math.PI / 2;
headstock.position.set(0, neckThickness/2 + bodyDepth/2 - 0.05, 
                       bodyLength/2 + neckLength);
scene.add(headstock);

// --- Tuning Pegs (6 per side, 3+3 configuration typical) ---
const tuningPegGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 12);
const pegPositions = [
    // Left side (bass strings)
    {x: -1.8, z: 2.5}, {x: -2.0, z: 3.5}, {x: -2.1, z: 4.5},
    // Right side (treble strings)  
    {x: 1.8, z: 2.5}, {x: 2.0, z: 3.5}, {x: 2.1, z: 4.5}
];

pegPositions.forEach(pos => {
    const peg = new THREE.Mesh(tuningPegGeometry, metalMaterial);
    peg.rotation.x = Math.PI / 2;
    peg.position.set(pos.x, neckThickness + 0.3 + bodyDepth/2, 
                     bodyLength/2 + neckLength + pos.z);
    scene.add(peg);
});

// --- Pickups (Humbucker style - 2 pickups) ---
const pickupWidth = 1.6;
const pickupLength = 3.2;
const pickupHeight = 0.35;
const pickupGeometry = new THREE.BoxGeometry(pickupWidth, pickupHeight, pickupLength);

// Bridge Pickup (near bridge)
const bridgePickup = new THREE.Mesh(pickupGeometry, pickupMaterial);
bridgePickup.position.set(0, bodyDepth/2 + pickupHeight/2, 1.5);
scene.add(bridgePickup);

// Neck Pickup (near neck)
const neckPickup = new THREE.Mesh(pickupGeometry, pickupMaterial);
neckPickup.position.set(0, bodyDepth/2 + pickupHeight/2, 5.5);
scene.add(neckPickup);

// Pickup pole pieces (small cylinders on top of pickups)
const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8);
for (let p = 0; p < 2; p++) { // For each pickup
    const baseZ = p === 0 ? 5.5 : 1.5;
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 6; col++) {
            const pole = new THREE.Mesh(poleGeometry, metalMaterial);
            pole.position.set(
                -pickupWidth/2 + 0.25 + col * 0.22,
                bodyDepth/2 + pickupHeight + 0.05,
                baseZ - pickupLength/2 + 0.5 + row * 2.2
            );
            scene.add(pole);
        }
    }
}

// --- Bridge (Tune-o-matic style) ---
const bridgeBaseGeometry = new THREE.BoxGeometry(2.4, 0.25, 0.8);
const bridgeBase = new THREE.Mesh(bridgeBaseGeometry, metalMaterial);
bridgeBase.position.set(0, bodyDepth/2 + 0.125, -1.0);
scene.add(bridgeBase);

// Bridge saddles
for (let s = 0; s < 6; s++) {
    const saddleGeo = new THREE.BoxGeometry(0.15, 0.2, 0.35);
    const saddle = new THREE.Mesh(saddleGeo, metalMaterial);
    saddle.position.set(-0.9 + s * 0.36, bodyDepth/2 + 0.35, -1.0);
    scene.add(saddle);
}

// Tailpiece / Stop bar
const tailpieceGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.2, 12);
const tailpiece = new THREE.Mesh(tailpieceGeo, metalMaterial);
tailpiece.rotation.x = Math.PI / 2;
tailpiece.position.set(0, bodyDepth/2 + 0.5, -3.5);
scene.add(tailpiece);

// Tailpiece posts
const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
const post1 = new THREE.Mesh(postGeo, metalMaterial);
post1.position.set(-0.7, bodyDepth/2 + 0.3, -3.5);
scene.add(post1);
const post2 = new THREE.Mesh(postGeo, metalMaterial);
post2.position.set(0.7, bodyDepth/2 + 0.3, -3.5);
scene.add(post2);

// --- Controls (Knobs) ---
const knobGeometry = new THREE.CylinderGeometry(0.28, 0.32, 0.25, 16);
const knobPositions = [
    {x: 3.5, z: -2.0, label: 'Volume'},
    {x: 4.2, z: -2.5, label: 'Tone'},
    {x: 4.9, z: -3.0, label: 'Tone 2'},
    {x: 5.6, z: -3.5, label: 'Volume 2'}
];

knobPositions.forEach(kp => {
    const knob = new THREE.Mesh(knobGeometry, blackPlasticMaterial);
    knob.position.set(kp.x, bodyDepth/2 + 0.125, kp.z);
    scene.add(knob);
    
    // Metal cap on knob
    const capGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
    const cap = new THREE.Mesh(capGeo, metalMaterial);
    cap.position.set(kp.x, bodyDepth/2 + 0.27, kp.z);
    scene.add(cap);
});

// --- Switch (Toggle switch for pickup selection) ---
const switchBaseGeo = new THREE.BoxGeometry(0.5, 0.15, 0.25);
const switchBase = new THREE.Mesh(switchBaseGeo, blackPlasticMaterial);
switchBase.position.set(3.0, bodyDepth/2 + 0.075, 3.0);
scene.add(switchBase);

const switchTipGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
const switchTip = new THREE.Mesh(switchTipGeo, blackPlasticMaterial); // Fixed: was plasticMaterial
switchTip.rotation.z = Math.PI / 2;
switchTip.position.set(3.0, bodyDepth/2 + 0.2, 3.0);
scene.add(switchTip);

// --- Input Jack ---
const jackHousingGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 12);
const jackHousing = new THREE.Mesh(jackHousingGeo, metalMaterial);
jackHousing.rotation.x = Math.PI / 2;
jackHousing.position.set(-lowerBoutWidth/2 + 1.5, bodyDepth/2 - 0.15, -bodyLength*0.35);
scene.add(jackHousing);

// --- Strings (visual representation) ---
const stringMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37, // Gold/bronze string color
    roughness: 0.3,
    metalness: 0.95
});

const stringGauges = [0.04, 0.05, 0.06, 0.07, 0.08, 0.09]; // Visual thickness variation
const stringSpacing = 0.32;
const startX = -stringSpacing * 2.5;

for (let s = 0; s < 6; s++) {
    const stringRadius = stringGauges[s] * 0.8;
    const stringGeo = new THREE.CylinderGeometry(stringRadius, stringRadius, 
                                                  neckLength + bodyLength*0.85, 8);
    const guitarString = new THREE.Mesh(stringGeo, stringMaterial);
    
    // Position string along the neck and body
    const xOffset = startX + s * stringSpacing;
    guitarString.rotation.x = Math.PI / 2;
    guitarString.position.set(
        xOffset, 
        neckThickness + fretboardThickness + 0.15 + bodyDepth/2 - 0.1,
        bodyLength/2 + neckLength/2 - neckLength/2 - 1
    );
    scene.add(guitarString);
}

// --- F-Holes (Visual cutouts represented as dark shapes) ---
const fHoleMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, // Very dark (represents hole into body)
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide
});

// Left F-Hole
const leftFHoleShape = createFHoleShape(true);
const fHoleSettings = { depth: bodyDepth + 0.1, bevelEnabled: false };
const leftFHoleGeo = new THREE.ExtrudeGeometry(leftFHoleShape, fHoleSettings);
const leftFHole = new THREE.Mesh(leftFHoleGeo, fHoleMaterial);
leftFHole.rotation.x = -Math.PI / 2;
leftFHole.position.y = bodyDepth/2 - 0.05;
scene.add(leftFHole);

// Right F-Hole (mirrored)
const rightFHoleShape = createFHoleShape(false);
const rightFHoleGeo = new THREE.ExtrudeGeometry(rightFHoleShape, fHoleSettings);
const rightFHole = new THREE.Mesh(rightFHoleGeo, fHoleMaterial);
rightFHole.rotation.x = -Math.PI / 2;
rightFHole.position.y = bodyDepth/2 - 0.05;
scene.add(rightFHole);

// --- Pickguard (optional aesthetic detail) ---
const pickguardShape = new THREE.Shape();
pickguardShape.moveTo(0, 0);
pickguardShape.quadraticCurveTo(3, 1, 4, -1);
pickguardShape.quadraticCurveTo(4.5, -3, 3, -5);
pickguardShape.quadraticCurveTo(1, -6, -1, -5);
pickguardShape.quadraticCurveTo(-2, -3, 0, 0);

const pickguardGeo = new THREE.ExtrudeGeometry(pickguardShape, {
    depth: 0.08,
    bevelEnabled: false
});
const pickguardMat = new THREE.MeshStandardMaterial({
    color: 0x111111, // Black pickguard
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9
});
const pickguard = new THREE.Mesh(pickguardGeo, pickguardMat);
pickguard.rotation.x = -Math.PI / 2;
pickguard.position.set(1.5, bodyDepth/2 + 0.04, 2.0);
scene.add(pickguard);

// --- Camera Setup ---
camera.position.set(20, 16, 30);
camera.lookAt(0, 0, 5); // Look slightly toward the body of the guitar