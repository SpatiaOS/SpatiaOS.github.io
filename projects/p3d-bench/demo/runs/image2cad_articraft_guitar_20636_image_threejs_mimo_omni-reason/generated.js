// Parameters - based on typical electric guitar proportions
const bodyLength = 20;
const bodyWidth = 14;
const bodyDepth = 2.5;
const neckLength = 25;
const neckWidth = 2.5;
const neckDepth = 1.5;
const headstockLength = 7;
const headstockWidth = 3;
const headstockAngle = 15; // degrees
const scale = 1; // overall scale factor

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x666666, // gray as shown in the image
    metalness: 0.3,
    roughness: 0.7
});

const neckMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513, // wood-like brown
    metalness: 0.1,
    roughness: 0.8
});

const hardwareMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333, // dark for pickups and bridge
    metalness: 0.8,
    roughness: 0.2
});

const fretboardMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2F1B14, // dark wood
    metalness: 0.1,
    roughness: 0.9
});

// Create guitar body (semi-hollow style with double cutaway)
function createBody() {
    const bodyShape = new THREE.Shape();
    
    // Body outline - approximation of a double cutaway shape
    bodyShape.moveTo(-bodyWidth/2, -bodyLength/2);
    bodyShape.lineTo(-bodyWidth/2, -bodyLength/2 + 3);
    bodyShape.bezierCurveTo(
        -bodyWidth/2 - 1, -bodyLength/2 + 5,
        -bodyWidth/2 - 1, bodyLength/2 - 5,
        -bodyWidth/2, bodyLength/2 - 3
    );
    bodyShape.lineTo(-bodyWidth/2, bodyLength/2);
    bodyShape.lineTo(bodyWidth/2, bodyLength/2);
    bodyShape.lineTo(bodyWidth/2, bodyLength/2 - 3);
    bodyShape.bezierCurveTo(
        bodyWidth/2 + 1, bodyLength/2 - 5,
        bodyWidth/2 + 1, -bodyLength/2 + 5,
        bodyWidth/2, -bodyLength/2 + 3
    );
    bodyShape.lineTo(bodyWidth/2, -bodyLength/2);
    bodyShape.lineTo(-bodyWidth/2, -bodyLength/2);
    
    // F-holes (simplified)
    const fHoleLeft = new THREE.Path();
    fHoleLeft.moveTo(-bodyWidth/4, -bodyLength/4);
    fHoleLeft.bezierCurveTo(
        -bodyWidth/4 - 1, -bodyLength/4 + 2,
        -bodyWidth/4 - 1, bodyLength/4 - 2,
        -bodyWidth/4, bodyLength/4
    );
    bodyShape.holes.push(fHoleLeft);
    
    const fHoleRight = new THREE.Path();
    fHoleRight.moveTo(bodyWidth/4, -bodyLength/4);
    fHoleRight.bezierCurveTo(
        bodyWidth/4 + 1, -bodyLength/4 + 2,
        bodyWidth/4 + 1, bodyLength/4 - 2,
        bodyWidth/4, bodyLength/4
    );
    bodyShape.holes.push(fHoleRight);
    
    const extrudeSettings = {
        steps: 1,
        depth: bodyDepth,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelSegments: 3
    };
    
    const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeometry.center();
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2; // Lay flat
    return body;
}

// Create neck with fretboard
function createNeck() {
    const neckGroup = new THREE.Group();
    
    // Main neck
    const neckGeometry = new THREE.BoxGeometry(neckWidth, neckLength, neckDepth);
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = neckLength / 2;
    neckGroup.add(neck);
    
    // Fretboard
    const fretboardGeometry = new THREE.BoxGeometry(neckWidth - 0.2, neckLength, 0.3);
    const fretboard = new THREE.Mesh(fretboardGeometry, fretboardMaterial);
    fretboard.position.y = neckLength / 2;
    fretboard.position.z = neckDepth / 2 + 0.15;
    neckGroup.add(fretboard);
    
    // Frets (simplified as lines)
    for (let i = 1; i < 22; i++) {
        const fretGeometry = new THREE.BoxGeometry(neckWidth - 0.4, 0.1, 0.1);
        const fret = new THREE.Mesh(fretGeometry, hardwareMaterial);
        fret.position.y = (i / 22) * neckLength;
        fret.position.z = neckDepth / 2 + 0.35;
        neckGroup.add(fret);
    }
    
    return neckGroup;
}

// Create headstock with tuning pegs
function createHeadstock() {
    const headstockGroup = new THREE.Group();
    
    // Main headstock
    const headstockGeometry = new THREE.BoxGeometry(headstockWidth, headstockLength, 0.8);
    const headstock = new THREE.Mesh(headstockGeometry, neckMaterial);
    headstockGroup.add(headstock);
    
    // Tuning pegs (3 per side)
    for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 3; i++) {
            const pegGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
            const peg = new THREE.Mesh(pegGeometry, hardwareMaterial);
            peg.rotation.z = Math.PI / 2;
            peg.position.set(side * (headstockWidth/2 + 0.4), -headstockLength/2 + 1.5 + i * 2, 0);
            headstockGroup.add(peg);
            
            // Tuning key
            const keyGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.1);
            const key = new THREE.Mesh(keyGeometry, hardwareMaterial);
            key.position.set(side * (headstockWidth/2 + 0.8), -headstockLength/2 + 1.5 + i * 2, 0);
            headstockGroup.add(key);
        }
    }
    
    // Angle the headstock
    headstockGroup.rotation.z = THREE.MathUtils.degToRad(headstockAngle);
    
    return headstockGroup;
}

// Create pickups
function createPickups() {
    const pickupGroup = new THREE.Group();
    
    // Two humbucker pickups
    for (let i = 0; i < 2; i++) {
        const pickupGeometry = new THREE.BoxGeometry(4, 1.5, 0.8);
        const pickup = new THREE.Mesh(pickupGeometry, hardwareMaterial);
        pickup.position.set(0, -3 + i * 4, bodyDepth/2 + 0.4);
        pickupGroup.add(pickup);
        
        // Pole pieces (simplified)
        for (let j = -2.5; j <= 2.5; j += 1) {
            const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6);
            const pole = new THREE.Mesh(poleGeometry, hardwareMaterial);
            pole.position.set(j, -3 + i * 4, bodyDepth/2 + 0.9);
            pickupGroup.add(pole);
        }
    }
    
    return pickupGroup;
}

// Create bridge and tailpiece
function createBridge() {
    const bridgeGroup = new THREE.Group();
    
    // Bridge
    const bridgeGeometry = new THREE.BoxGeometry(5, 1, 0.5);
    const bridge = new THREE.Mesh(bridgeGeometry, hardwareMaterial);
    bridge.position.set(0, -6, bodyDepth/2 + 0.25);
    bridgeGroup.add(bridge);
    
    // Tailpiece
    const tailpieceGeometry = new THREE.BoxGeometry(4, 0.5, 0.3);
    const tailpiece = new THREE.Mesh(tailpieceGeometry, hardwareMaterial);
    tailpiece.position.set(0, -7.5, bodyDepth/2 + 0.15);
    bridgeGroup.add(tailpiece);
    
    // Strings (simplified as lines)
    for (let i = -2.5; i <= 2.5; i += 1) {
        const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, neckLength + 5, 4);
        const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.set(i, neckLength/2 - 2, bodyDepth/2 + 0.5);
        string.rotation.x = Math.PI / 2;
        bridgeGroup.add(string);
    }
    
    return bridgeGroup;
}

// Create control knobs (renamed function to avoid conflict with 'controls')
function createControlKnobs() {
    const knobGroup = new THREE.Group();
    const knobPositions = [
        { x: 4, y: -5 },
        { x: 4, y: -3 },
        { x: 4, y: -1 }
    ];
    
    knobPositions.forEach(pos => {
        const knobGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const knob = new THREE.Mesh(knobGeometry, hardwareMaterial);
        knob.position.set(pos.x, pos.y, bodyDepth/2 + 0.15);
        knobGroup.add(knob);
        
        // Knob indicator
        const indicatorGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.3);
        const indicator = new THREE.Mesh(indicatorGeometry, new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
        indicator.position.set(pos.x, pos.y, bodyDepth/2 + 0.35);
        knobGroup.add(indicator);
    });
    
    // Toggle switch
    const switchGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    const switchMesh = new THREE.Mesh(switchGeometry, hardwareMaterial);
    switchMesh.position.set(3, 1, bodyDepth/2 + 0.15);
    knobGroup.add(switchMesh);
    
    return knobGroup;
}

// Assemble the guitar
const guitarGroup = new THREE.Group();

// Create and position all parts
const body = createBody();
guitarGroup.add(body);

const neck = createNeck();
neck.position.y = bodyLength/2;
guitarGroup.add(neck);

const headstock = createHeadstock();
headstock.position.y = bodyLength/2 + neckLength;
headstock.position.z = neckDepth/2;
guitarGroup.add(headstock);

const pickups = createPickups();
guitarGroup.add(pickups);

const bridge = createBridge();
guitarGroup.add(bridge);

const controlKnobs = createControlKnobs();
guitarGroup.add(controlKnobs);

// Add the complete guitar to the scene
scene.add(guitarGroup);

// Adjust camera to view the entire guitar
camera.position.set(30, 20, 30);
camera.lookAt(0, 0, 0);