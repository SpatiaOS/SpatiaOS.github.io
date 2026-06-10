// ==========================================
// CLOCK MODEL PARAMETERS
// ==========================================
const clockRadius = 5;           // Total outer radius
const clockThickness = 1;        // Depth/thickness of the clock body
const rimWidth = 1.2;            // Width of the raised outer rim
const dialRadius = 3.8;          // Radius of the inner dial face
const hubRadius = 1.3;           // Radius of the center hub
const hubHeight = 0.25;          // Height of the center hub above dial
const numeralRadius = 3.0;       // Distance of numerals from center
const numeralHeight = 0.25;      // Extrusion height of numerals
const minuteHandLength = 3.2;    // Length of minute hand
const hourHandLength = 2.2;      // Length of hour hand
const handThickness = 0.12;      // Thickness of hands
const handHeight = 0.15;         // Height of hands above surface

// Material - metallic gray appearance matching the reference
const clockMaterial = new THREE.MeshStandardMaterial({
    color: 0x9a9a9a,
    roughness: 0.35,
    metalness: 0.15,
    flatShading: false
});

// ==========================================
// MAIN CLOCK BODY (Base cylinder)
// ==========================================
const baseGeometry = new THREE.CylinderGeometry(
    clockRadius, 
    clockRadius, 
    clockThickness, 
    64
);
const baseMesh = new THREE.Mesh(baseGeometry, clockMaterial);
scene.add(baseMesh);

// ==========================================
// OUTER RIM (Raised edge)
// ==========================================
const rimGeometry = new THREE.CylinderGeometry(
    clockRadius, 
    clockRadius, 
    clockThickness + 0.3, 
    64
);
const rimMesh = new THREE.Mesh(rimGeometry, clockMaterial);
rimMesh.position.y = 0.15; // Raise slightly above base
scene.add(rimMesh);

// Inner recessed area (slightly lower than rim)
const dialGeometry = new THREE.CylinderGeometry(
    dialRadius, 
    dialRadius, 
    clockThickness - 0.1, 
    64
);
const dialMesh = new THREE.Mesh(dialGeometry, clockMaterial);
dialMesh.position.y = -0.05; // Slightly recessed
scene.add(dialMesh);

// ==========================================
// CENTER HUB
// ==========================================
const hubGeometry = new THREE.CylinderGeometry(
    hubRadius, 
    hubRadius, 
    hubHeight, 
    32
);
const hubMesh = new THREE.Mesh(hubGeometry, clockMaterial);
hubMesh.position.y = (clockThickness / 2) + (hubHeight / 2) - 0.05;
scene.add(hubMesh);

// Center cap/pin
const pinGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.35, 16);
const pinMesh = new THREE.Mesh(pinGeometry, clockMaterial);
pinMesh.position.y = (clockThickness / 2) + hubHeight + 0.1;
scene.add(pinMesh);

// ==========================================
// ROMAN NUMERALS GENERATOR
// Creates simplified 3D Roman numerals from box geometries
// ==========================================
function createRomanNumeral(num) {
    const group = new THREE.Group();
    const w = 0.18;  // stroke width
    const h = 0.7;   // character height
    const mat = clockMaterial;
    
    // Helper to add a box
    function addBox(x, y, bw, bh) {
        const geom = new THREE.BoxGeometry(bw, bh, numeralHeight);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(x, y, numeralHeight / 2);
        group.add(mesh);
    }
    
    switch(num) {
        case 12: // XII
            addBox(-0.25, 0, w, h);
            addBox(0, 0, w, h);
            addBox(0.25, 0, w, h);
            break;
        case 1: // I
            addBox(0, 0, w, h);
            break;
        case 2: // II
            addBox(-0.12, 0, w, h);
            addBox(0.12, 0, w, h);
            break;
        case 3: // III
            addBox(-0.24, 0, w, h);
            addBox(0, 0, w, h);
            addBox(0.24, 0, w, h);
            break;
        case 4: // IV
            addBox(-0.18, 0, w, h); // I
            addBox(0.08, h*0.15, w, h*0.7); // V left leg
            addBox(0.28, h*0.15, w, h*0.7); // V right leg
            addBox(0.18, -h*0.2, w*1.5, w); // V crossbar
            break;
        case 5: // V
            addBox(-0.2, h*0.15, w, h*0.7);
            addBox(0.2, h*0.15, w, h*0.7);
            addBox(0, -h*0.2, w*1.8, w);
            break;
        case 6: // VI
            addBox(-0.22, 0, w, h); // V
            addBox(-0.1, h*0.15, w, h*0.7);
            addBox(0.1, h*0.15, w, h*0.7);
            addBox(0, -h*0.2, w*1.8, w);
            addBox(0.3, 0, w, h); // I
            break;
        case 7: // VII
            addBox(-0.35, 0, w, h); // V left
            addBox(-0.15, h*0.15, w, h*0.7);
            addBox(0.05, h*0.15, w, h*0.7);
            addBox(-0.05, -h*0.2, w*1.8, w);
            addBox(0.15, 0, w, h); // I
            addBox(0.35, 0, w, h); // II
            break;
        case 8: // VIII
            for(let i = -2; i <= 2; i++) {
                addBox(i * 0.18, 0, w, h);
            }
            break;
        case 9: // IX
            addBox(-0.3, 0, w, h); // I
            addBox(-0.05, h*0.15, w, h*0.7); // X parts
            addBox(0.15, h*0.15, w, h*0.7);
            addBox(-0.05, -h*0.2, w, h*0.7);
            addBox(0.15, -h*0.2, w, h*0.7);
            addBox(0.3, 0, w, h); // extra I? No, IX is I before X
            // Actually IX: I on left, X on right
            // Redo:
            group.clear();
            addBox(-0.3, 0, w, h); // I
            // X shape
            addBox(-0.05, 0, w, h * 0.85);
            addBox(0.15, 0, w, h * 0.85);
            addBox(0.02, 0.15, w * 1.2, w);
            addBox(0.02, -0.15, w * 1.2, w);
            break;
        case 10: // X
            addBox(-0.12, 0, w, h * 0.85);
            addBox(0.12, 0, w, h * 0.85);
            addBox(0, 0.17, w * 1.4, w);
            addBox(0, -0.17, w * 1.4, w);
            break;
        case 11: // XI
            addBox(-0.28, 0, w, h * 0.85); // X left
            addBox(-0.04, 0, w, h * 0.85); // X right
            addBox(-0.16, 0.17, w * 1.4, w);
            addBox(-0.16, -0.17, w * 1.4, w);
            addBox(0.25, 0, w, h); // I
            break;
    }
    
    return group;
}

// Place all 12 numerals around the dial
const numerals = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
numerals.forEach((num, index) => {
    const angle = (index * 30 - 90) * (Math.PI / 180); // Start from top (-90 deg)
    const numeralGroup = createRomanNumeral(num);
    
    // Position at radius, rotated to face outward properly
    const x = Math.cos(angle) * numeralRadius;
    const z = Math.sin(angle) * numeralRadius;
    
    numeralGroup.position.set(
        x, 
        (clockThickness / 2) - 0.05 + (numeralHeight / 2), 
        z
    );
    
    // Rotate numeral so it's oriented correctly (facing outward from center, upright)
    numeralGroup.rotation.y = -angle - (Math.PI / 2);
    
    scene.add(numeralGroup);
});

// ==========================================
// HOUR MARKS (Small ticks between numerals)
// ==========================================
for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) { // Skip where numerals are
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const isQuarter = i % 15 === 0;
        const tickLength = isQuarter ? 0.4 : 0.25;
        const tickWidth = isQuarter ? 0.08 : 0.05;
        
        const tickGeom = new THREE.BoxGeometry(tickWidth, tickLength, 0.1);
        const tickMesh = new THREE.Mesh(tickGeom, clockMaterial);
        
        const r = dialRadius - 0.3;
        tickMesh.position.set(
            Math.cos(angle) * r,
            (clockThickness / 2) - 0.05 + 0.05,
            Math.sin(angle) * r
        );
        tickMesh.rotation.y = -angle;
        
        scene.add(tickMesh);
    }
}

// ==========================================
// CLOCK HANDS
// ==========================================

// Hour hand (shorter, thicker)
const hourHandGeom = new THREE.BoxGeometry(handThickness * 1.5, hourHandLength, handHeight);
const hourHand = new THREE.Mesh(hourHandGeom, clockMaterial);
hourHand.position.set(0, (clockThickness / 2) + handHeight / 2, hourHandLength / 2 - 0.2);
hourHand.rotation.x = -Math.PI / 2; // Lay flat
hourHand.rotation.z = (1.5 * 30) * (Math.PI / 180); // Point to ~1:30 position roughly
scene.add(hourHand);

// Minute hand (longer, thinner)
const minuteHandGeom = new THREE.BoxGeometry(handThickness, minuteHandLength, handHeight);
const minuteHand = new THREE.Mesh(minuteHandGeom, clockMaterial);
minuteHand.position.set(0, (clockThickness / 2) + handHeight / 2 + 0.02, minuteHandLength / 2 - 0.2);
minuteHand.rotation.x = -Math.PI / 2;
minuteHand.rotation.z = (8 * 6) * (Math.PI / 180); // Point to ~8 min position (matching image approx)
scene.add(minuteHand);

// ==========================================
// CAMERA POSITIONING
// Isometric view similar to reference image
// ==========================================
camera.position.set(8, 10, 8);
camera.lookAt(0, 0, 0);