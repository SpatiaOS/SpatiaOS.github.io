// Parameters for the TV dimensions
const tvW = 22;       // Total width
const tvH = 14;       // Total height
const tvD = 9;        // Main casing depth
const frontZ = 5;     // Z-position of the front face base

// Materials
const matCasing = new THREE.MeshStandardMaterial({ color: 0x8a8d8f, roughness: 0.7 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
const matScreen = new THREE.MeshStandardMaterial({ color: 0x242428, roughness: 0.2, metalness: 0.5 });
const matMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.8 });
const matDetails = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.6 });

// Group to hold all TV parts
const tvGroup = new THREE.Group();

// ==========================================
// 1. Main Body Construction
// ==========================================

// Main Casing
const casingGeo = new THREE.BoxGeometry(tvW - 0.5, tvH - 0.5, tvD);
const casing = new THREE.Mesh(casingGeo, matCasing);
// Positioned so the front aligns with frontZ
casing.position.set(0, 0, frontZ - tvD / 2);
tvGroup.add(casing);

// Decorative seam line around the casing
const seamGeo = new THREE.BoxGeometry(tvW + 0.1, tvH + 0.1, 0.1);
const seam = new THREE.Mesh(seamGeo, matDark);
seam.position.set(0, 0, frontZ - 2.5);
tvGroup.add(seam);

// Top Vents
const ventGeo = new THREE.BoxGeometry(16, 0.2, 3);
const vent = new THREE.Mesh(ventGeo, matDark);
vent.position.set(0, tvH / 2 - 0.15, frontZ - 3);
tvGroup.add(vent);

// Back Bulge (CRT tube housing)
const backW = 14;
const backH = 9;
const backD = 5;
const backGeo = new THREE.BoxGeometry(backW, backH, backD);
const backBulge = new THREE.Mesh(backGeo, matCasing);
backBulge.position.set(0, 0, frontZ - tvD - backD / 2);
tvGroup.add(backBulge);


// ==========================================
// 2. Front Frame (Bezel)
// ==========================================

const rimThick = 0.5;
const rimDepth = 1.0;
const rimZ = frontZ + rimDepth / 2;

// Outer edges
const topRim = new THREE.Mesh(new THREE.BoxGeometry(tvW, rimThick, rimDepth), matCasing);
topRim.position.set(0, tvH / 2 - rimThick / 2, rimZ);
tvGroup.add(topRim);

const botRim = new THREE.Mesh(new THREE.BoxGeometry(tvW, rimThick, rimDepth), matCasing);
botRim.position.set(0, -tvH / 2 + rimThick / 2, rimZ);
tvGroup.add(botRim);

const leftRim = new THREE.Mesh(new THREE.BoxGeometry(rimThick, tvH - rimThick * 2, rimDepth), matCasing);
leftRim.position.set(-tvW / 2 + rimThick / 2, 0, rimZ);
tvGroup.add(leftRim);

const rightRim = new THREE.Mesh(new THREE.BoxGeometry(rimThick, tvH - rimThick * 2, rimDepth), matCasing);
rightRim.position.set(tvW / 2 - rimThick / 2, 0, rimZ);
tvGroup.add(rightRim);

// Vertical divider between screen and control panel
const dividerX = 5;
const divider = new THREE.Mesh(new THREE.BoxGeometry(rimThick, tvH - rimThick * 2, rimDepth), matCasing);
divider.position.set(dividerX, 0, rimZ);
tvGroup.add(divider);


// ==========================================
// 3. Screen Area (Left side)
// ==========================================

// Calculate screen area dimensions based on rims and divider
const scnW = (dividerX - rimThick / 2) - (-tvW / 2 + rimThick / 2); // 15.25
const scnH = tvH - rimThick * 2; // 13
const scnCX = (-tvW / 2 + rimThick / 2 + dividerX - rimThick / 2) / 2; // -2.875

// Dark recessed background
const scnBg = new THREE.Mesh(new THREE.BoxGeometry(scnW, scnH, 0.5), matDark);
scnBg.position.set(scnCX, 0, frontZ + 0.25);
tvGroup.add(scnBg);

// Glass Screen
const glassW = scnW - 2;
const glassH = scnH - 2;
const glass = new THREE.Mesh(new THREE.BoxGeometry(glassW, glassH, 0.4), matScreen);
glass.position.set(scnCX, 0, frontZ + 0.4);
tvGroup.add(glass);

// Brand Logo plate
const logoMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 0.1), matDetails);
logoMesh.position.set(scnCX, -scnH / 2 + 0.6, frontZ + 0.5);
tvGroup.add(logoMesh);


// ==========================================
// 4. Control Panel (Right side)
// ==========================================

const ctrlW = (tvW / 2 - rimThick / 2) - (dividerX + rimThick / 2); // 5.25
const ctrlH = tvH - rimThick * 2; // 13
const ctrlCX = (tvW / 2 - rimThick / 2 + dividerX + rimThick / 2) / 2; // 7.875

// Control Panel Background
const ctrlBg = new THREE.Mesh(new THREE.BoxGeometry(ctrlW, ctrlH, 0.5), matDark);
ctrlBg.position.set(ctrlCX, 0, frontZ + 0.25);
tvGroup.add(ctrlBg);

// Top Channel/Status Indicator
const ind = new THREE.Mesh(new THREE.BoxGeometry(ctrlW - 1, 1.2, 0.2), matScreen);
ind.position.set(ctrlCX, ctrlH / 2 - 1.5, frontZ + 0.5);
tvGroup.add(ind);

// Raised panel for buttons
const btnPanel = new THREE.Mesh(new THREE.BoxGeometry(ctrlW - 0.5, 6.5, 0.4), matCasing);
btnPanel.position.set(ctrlCX, 1.5, frontZ + 0.45);
tvGroup.add(btnPanel);

// Tuning Dials (Top of button panel)
const dialGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
dialGeo.rotateX(Math.PI / 2);
const dial1 = new THREE.Mesh(dialGeo, matDetails);
dial1.position.set(ctrlCX - 1.2, 3.5, frontZ + 0.7);
tvGroup.add(dial1);

const dial2 = new THREE.Mesh(dialGeo, matDetails);
dial2.position.set(ctrlCX + 1.2, 3.5, frontZ + 0.7);
tvGroup.add(dial2);

// Button Grid (3 columns x 4 rows)
const btnGeo = new THREE.BoxGeometry(0.8, 0.35, 0.3);
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
        const btn = new THREE.Mesh(btnGeo, matDetails);
        const bx = ctrlCX + (col - 1) * 1.3;
        const by = 2.0 - row * 0.8;
        btn.position.set(bx, by, frontZ + 0.7);
        tvGroup.add(btn);
    }
}

// Bottom Speaker Grille
const spk = new THREE.Mesh(new THREE.BoxGeometry(ctrlW - 0.8, 4, 0.2), matDark);
spk.position.set(ctrlCX, -ctrlH / 2 + 2.5, frontZ + 0.5);
tvGroup.add(spk);


// ==========================================
// 5. Antennas (Rabbit Ears)
// ==========================================

// Base mounting block
const antBase = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 2), matCasing);
antBase.position.set(0, tvH / 2, frontZ - 5);
tvGroup.add(antBase);

function createAntenna(isLeft) {
    const antGroup = new THREE.Group();
    
    // Hinge/Base joint
    const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), matCasing);
    hinge.position.y = 0.3;
    antGroup.add(hinge);

    // Thick lower segment
    const baseGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 8);
    const baseMesh = new THREE.Mesh(baseGeo, matMetal);
    baseMesh.position.y = 1.5;
    antGroup.add(baseMesh);

    // Long thin telescopic segment
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 16, 8);
    const poleMesh = new THREE.Mesh(poleGeo, matMetal);
    poleMesh.position.y = 10.5; // 2.5 + 16/2
    antGroup.add(poleMesh);

    // End cap/tip
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), matMetal);
    tip.position.y = 18.5;
    antGroup.add(tip);

    // Position on the mounting block
    const sign = isLeft ? -1 : 1;
    antGroup.position.set(sign * 1.5, tvH / 2 + 0.4, frontZ - 5);
    
    // Angle outwards and slightly backwards
    antGroup.rotation.z = isLeft ? (Math.PI / 4.5) : (-Math.PI / 4.5); 
    antGroup.rotation.x = -Math.PI / 10; 

    return antGroup;
}

tvGroup.add(createAntenna(true));  // Left antenna
tvGroup.add(createAntenna(false)); // Right antenna


// Add entire TV model to scene
scene.add(tvGroup);

// ==========================================
// 6. Camera Setup
// ==========================================
camera.position.set(30, 25, 35);
camera.lookAt(0, 2, 0);