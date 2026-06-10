// ==========================================
// RETRO CRT TELEVISION MODEL
// ==========================================

// --- Parameters ---
const TV_WIDTH = 10;
const TV_HEIGHT = 7.5;
const TV_DEPTH = 6.5;
const WALL_THICKNESS = 0.4;

// Screen dimensions (left portion of front face)
const SCREEN_WIDTH = 6.2;
const SCREEN_HEIGHT = 5.2;
const SCREEN_INSET = 0.25; // How far back the screen sits
const CURVE_RADIUS = 12; // CRT screen bulge radius

// Control panel (right side)
const PANEL_WIDTH = 1.8;
const PANEL_HEIGHT = 2.5;
const BUTTON_ROWS = 4;
const BUTTON_COLS = 3;

// Speaker grille (below panel)
const SPEAKER_HEIGHT = 3;

// Antenna
const ANTENNA_LENGTH = 9;
const ANTENNA_RADIUS = 0.04;
const ANTENNA_SPREAD_ANGLE = 0.45; // Radians from center

// --- Materials ---
const bodyMat = new THREE.MeshStandardMaterial({ 
    color: 0x909090, 
    roughness: 0.55,
    name: 'body'
});

const darkMat = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a, 
    roughness: 0.85,
    name: 'dark'
});

const screenMat = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a12, 
    roughness: 0.15,
    metalness: 0.05,
    name: 'screen'
});

const bezelMat = new THREE.MeshStandardMaterial({ 
    color: 0x404040, 
    roughness: 0.4,
    name: 'bezel'
});

const chromeMat = new THREE.MeshStandardMaterial({ 
    color: 0xd0d0d0, 
    metalness: 0.95, 
    roughness: 0.15,
    name: 'chrome'
});

const buttonMat = new THREE.MeshStandardMaterial({ 
    color: 0x606060, 
    roughness: 0.3,
    name: 'button'
});

// --- Main Cabinet ---
const cabinetGeo = new THREE.BoxGeometry(TV_WIDTH, TV_HEIGHT, TV_DEPTH);
const cabinet = new THREE.Mesh(cabinetGeo, bodyMat);
cabinet.position.set(0, 0, 0);
scene.add(cabinet);

// --- Back protrusion (CRT tube depth) ---
const backBulgeGeo = new THREE.BoxGeometry(TV_WIDTH * 0.85, TV_HEIGHT * 0.85, TV_DEPTH * 0.4);
const backBulge = new THREE.Mesh(backBulgeGeo, bodyMat);
backBulge.position.set(0, 0, TV_DEPTH / 2 + TV_DEPTH * 0.2);
scene.add(backBulge);

// --- Screen Assembly ---
// Bezel frame around screen
const bezelWidth = SCREEN_WIDTH + 0.6;
const bezelHeight = SCREEN_HEIGHT + 0.6;
const bezelDepth = 0.5;

const bezelGeo = new THREE.BoxGeometry(bezelWidth, bezelHeight, bezelDepth);
const bezel = new THREE.Mesh(bezelGeo, bezelMat);
bezel.position.set(
    -TV_WIDTH / 4,           // Left side offset
    0, 
    TV_DEPTH / 2 - bezelDepth / 2 + 0.05  // Front face
);
scene.add(bezel);

// Inner bezel (darker ring)
const innerBezelGeo = new THREE.BoxGeometry(SCREEN_WIDTH + 0.2, SCREEN_HEIGHT + 0.2, 0.15);
const innerBezel = new THREE.Mesh(innerBezelGeo, darkMat);
innerBezel.position.set(bezel.position.x, bezel.position.y, bezel.position.z + 0.18);
scene.add(innerBezel);

// Curved CRT Screen (using SphereGeometry segment)
const screenGeo = new THREE.SphereGeometry(
    CURVE_RADIUS,
    32, 24,
    0, Math.PI * 2,        // Horizontal full circle
    0, Math.PI / 4         // Vertical arc (limited for patch)
);
const screenMesh = new THREE.Mesh(screenGeo, screenMat);

// Position and scale to fit the bezel opening
screenMesh.position.set(
    bezel.position.x,
    bezel.position.y,
    TV_DEPTH / 2 - SCREEN_INSET - CURVE_RADIUS * 0.15
);
// Scale to match desired screen size approximately
const scaleX = SCREEN_WIDTH / (CURVE_RADIUS * Math.sin(Math.PI / 4));
const scaleY = SCREEN_HEIGHT / (CURVE_RADIUS * (1 - Math.cos(Math.PI / 4)));
screenMesh.scale.set(scaleX, scaleY, 0.08); // Flatten Z significantly
scene.add(screenMesh);

// Screen glare line (subtle detail)
const glareGeo = new THREE.PlaneGeometry(SCREEN_WIDTH * 0.6, 0.03);
const glareMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.15,
    side: THREE.DoubleSide
});
const glare = new THREE.Mesh(glareGeo, glareMat);
glare.position.set(
    screenMesh.position.x - 0.5,
    screenMesh.position.y + 0.8,
    screenMesh.position.z + 0.02
);
glare.rotation.z = -0.15;
scene.add(glare);

// --- Control Panel (Upper Right) ---
const panelX = TV_WIDTH / 2 - PANEL_WIDTH / 2 - 0.4;
const panelY = 1.0;
const panelZ = TV_DEPTH / 2 - 0.1;

// Panel background
const panelBgGeo = new THREE.BoxGeometry(PANEL_WIDTH, PANEL_HEIGHT, 0.15);
const panelBg = new THREE.Mesh(panelBgGeo, darkMat);
panelBg.position.set(panelX, panelY, panelZ);
scene.add(panelBg);

// Buttons grid
const btnSize = 0.22;
const btnSpacing = 0.35;
const btnStartX = panelX - (BUTTON_COLS - 1) * btnSpacing / 2;
const btnStartY = panelY + (BUTTON_ROWS - 1) * btnSpacing / 2 - 0.2;

for (let row = 0; row < BUTTON_ROWS; row++) {
    for (let col = 0; col < BUTTON_COLS; col++) {
        const btnGeo = new THREE.BoxGeometry(btnSize, btnSize, 0.08);
        const btn = new THREE.Mesh(btnGeo, buttonMat);
        btn.position.set(
            btnStartX + col * btnSpacing,
            btnStartY - row * btnSpacing,
            panelZ + 0.08
        );
        scene.add(btn);
    }
}

// Power LED indicator
const ledGeo = new THREE.CircleGeometry(0.08, 16);
const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const led = new THREE.Mesh(ledGeo, ledMat);
led.position.set(panelX + 0.5, panelY + PANEL_HEIGHT / 2 - 0.3, panelZ + 0.08);
scene.add(led);

// --- Speaker Grille (Lower Right) ---
const speakerY = -TV_HEIGHT / 4 - 0.3;
const speakerGeo = new THREE.BoxGeometry(PANEL_WIDTH - 0.2, SPEAKER_HEIGHT, 0.1);
const speaker = new THREE.Mesh(speakerGeo, darkMat);
speaker.position.set(panelX, speakerY, panelZ);
scene.add(speaker);

// Speaker grille lines (horizontal slats)
const slatCount = 12;
const slatGeo = new THREE.BoxGeometry(PANEL_WIDTH - 0.3, 0.03, 0.06);
const slatMat = new THREE.MeshStandardMaterial({ color: 0x151515 });
for (let i = 0; i < slatCount; i++) {
    const slat = new THREE.Mesh(slatGeo, slatMat);
    const t = i / (slatCount - 1);
    slat.position.set(
        speaker.position.x,
        speaker.position.y + SPEAKER_HEIGHT / 2 - (t * SPEAKER_HEIGHT) - 0.15,
        speaker.position.z + 0.04
    );
    scene.add(slat);
}

// --- Brand label area (below screen) ---
const brandGeo = new THREE.BoxGeometry(1.5, 0.3, 0.05);
const brand = new THREE.Mesh(brandGeo, darkMat);
brand.position.set(bezel.position.x, -SCREEN_HEIGHT / 2 - 0.6, TV_DEPTH / 2 - 0.05);
scene.add(brand);

// --- Antennas (Rabbit Ears) ---
const antennaBaseX = 0;
const antennaBaseY = TV_HEIGHT / 2;
const antennaBaseZ = TV_DEPTH / 2 - 1;

// Base housing for antennas
const baseHousingGeo = new THREE.BoxGeometry(1.2, 0.4, 0.8);
const baseHousing = new THREE.Mesh(baseHousingGeo, bodyMat);
baseHousing.position.set(antennaBaseX, antennaBaseY + 0.2, antennaBaseZ);
scene.add(baseHousing);

// Left antenna
function createAntenna(angleOffset) {
    const group = new THREE.Group();
    
    // Lower segment (thicker)
    const lowerLen = ANTENNA_LENGTH * 0.4;
    const lowerGeo = new THREE.CylinderGeometry(ANTENNA_RADIUS * 1.5, ANTENNA_RADIUS * 1.5, lowerLen, 8);
    const lower = new THREE.Mesh(lowerGeo, chromeMat);
    lower.rotation.x = Math.PI / 2 + angleOffset;
    lower.position.y = -lowerLen / 2 * Math.cos(angleOffset);
    lower.position.z = -lowerLen / 2 * Math.sin(angleOffset);
    group.add(lower);
    
    // Upper segment (thinner, telescopic)
    const upperLen = ANTENNA_LENGTH * 0.65;
    const upperGeo = new THREE.CylinderGeometry(ANTENNA_RADIUS, ANTENNA_RADIUS, upperLen, 8);
    const upper = new THREE.Mesh(upperGeo, chromeMat);
    
    // Position at end of lower segment
    const endY = -lowerLen * Math.cos(angleOffset);
    const endZ = -lowerLen * Math.sin(angleOffset);
    upper.rotation.x = Math.PI / 2 + angleOffset * 0.8; // Slight angle change
    upper.position.set(0, endY - upperLen / 2 * Math.cos(angleOffset * 0.8), endZ - upperLen / 2 * Math.sin(angleOffset * 0.8));
    group.add(upper);
    
    // Tip ball
    const tipGeo = new THREE.SphereGeometry(ANTENNA_RADIUS * 2, 8, 8);
    const tip = new THREE.Mesh(tipGeo, chromeMat);
    tip.position.copy(upper.position);
    tip.position.y -= upperLen / 2 * Math.cos(angleOffset * 0.8);
    tip.position.z -= upperLen / 2 * Math.sin(angleOffset * 0.8);
    group.add(tip);
    
    return group;
}

const leftAntenna = createAntenna(ANTENNA_SPREAD_ANGLE);
leftAntenna.position.set(antennaBaseX - 0.2, antennaBaseY + 0.4, antennaBaseZ);
scene.add(leftAntenna);

const rightAntenna = createAntenna(-ANTENNA_SPREAD_ANGLE);
rightAntenna.position.set(antennaBaseX + 0.2, antennaBaseY + 0.4, antennaBaseZ);
scene.add(rightAntenna);

// --- Ventilation slots on top (optional detail) ---
const ventCount = 8;
const ventGeo = new THREE.BoxGeometry(TV_WIDTH * 0.6, 0.08, 0.3);
const ventMat = new THREE.MeshStandardMaterial({ color: 0x707070 });
for (let i = 0; i < ventCount; i++) {
    const vent = new THREE.Mesh(ventGeo, ventMat);
    vent.position.set(0, TV_HEIGHT / 2 + 0.05, -TV_DEPTH / 4 + i * (TV_DEPTH / 2 / ventCount));
    scene.add(vent);
}

// --- Camera Setup ---
camera.position.set(14, 10, 16);
camera.lookAt(0, 0, 0);