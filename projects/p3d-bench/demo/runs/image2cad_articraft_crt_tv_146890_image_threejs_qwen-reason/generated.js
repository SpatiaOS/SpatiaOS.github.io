// Parameters for the Retro TV
const tvWidth = 24;
const tvHeight = 15;
const tvDepth = 14;
const casingThickness = 0.5;
const screenInset = 1.0;

// Materials
const casingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    roughness: 0.6, 
    metalness: 0.1 
});
const darkPlasticMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333, 
    roughness: 0.8 
});
const screenMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.2, 
    metalness: 0.5 
});
const antennaMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, 
    roughness: 0.3, 
    metalness: 0.8 
});
const buttonMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222 
});

// Group to hold the entire TV
const tvGroup = new THREE.Group();

// 1. Main Body (The large back casing)
// Slightly smaller than the front face to simulate the casing wrapping around
const mainBodyGeo = new THREE.BoxGeometry(tvWidth - 1, tvHeight - 1, tvDepth - 2);
const mainBody = new THREE.Mesh(mainBodyGeo, casingMaterial);
mainBody.position.set(0, 0, -0.5); // Push back slightly
tvGroup.add(mainBody);

// 2. Front Casing / Bezel
// This is the main front face
const frontCasingGeo = new THREE.BoxGeometry(tvWidth, tvHeight, casingThickness);
const frontCasing = new THREE.Mesh(frontCasingGeo, casingMaterial);
frontCasing.position.z = tvDepth / 2 - casingThickness / 2;
tvGroup.add(frontCasing);

// 3. Screen Area
// The screen is on the left side of the front face
const screenAreaWidth = tvWidth * 0.65;
const screenAreaHeight = tvHeight * 0.75;
const screenX = -tvWidth / 2 + screenAreaWidth / 2 + 1.5; // Offset to left
const screenY = 0;

// Screen Bezel (The frame around the glass)
const bezelThickness = 1.5;
const bezelGeo = new THREE.BoxGeometry(screenAreaWidth + bezelThickness * 2, screenAreaHeight + bezelThickness * 2, 0.5);
const bezel = new THREE.Mesh(bezelGeo, darkPlasticMaterial);
bezel.position.set(screenX, screenY, tvDepth / 2 - 0.2);
tvGroup.add(bezel);

// The actual CRT Screen (Curved glass effect)
// Using a sphere segment to simulate the curve of a CRT
const screenGeo = new THREE.SphereGeometry(6, 32, 32, 0, Math.PI * 0.6, 0, Math.PI * 0.5); 
// Adjusting geometry to look like a flat-ish screen with curve
const crtScreenGeo = new THREE.BoxGeometry(screenAreaWidth - 1, screenAreaHeight - 1, 0.5);
// To make it look like the image, let's just use a box with a dark material inside the bezel
const crtScreen = new THREE.Mesh(crtScreenGeo, screenMaterial);
crtScreen.position.set(screenX, screenY, tvDepth / 2 - 0.6);
tvGroup.add(crtScreen);

// Screen reflection/glare (optional visual flair)
const glareGeo = new THREE.PlaneGeometry(screenAreaWidth * 0.4, screenAreaHeight * 0.4);
const glareMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, side: THREE.DoubleSide });
const glare = new THREE.Mesh(glareGeo, glareMat);
glare.position.set(screenX - 1, screenY + 1, tvDepth / 2 - 0.55);
glare.rotation.z = -0.2;
tvGroup.add(glare);

// 4. Control Panel Area (Right side)
const controlPanelWidth = tvWidth * 0.3;
const controlPanelX = tvWidth / 2 - controlPanelWidth / 2 - 0.5;

// Control Panel Background
const controlPanelGeo = new THREE.BoxGeometry(controlPanelWidth, tvHeight - 2, 0.2);
const controlPanel = new THREE.Mesh(controlPanelGeo, darkPlasticMaterial);
controlPanel.position.set(controlPanelX, 0, tvDepth / 2 - 0.1);
tvGroup.add(controlPanel);

// Buttons / Knobs (Top part of control panel)
const buttonRows = 4;
const buttonCols = 2;
const startY = 3;
const spacingY = 1.2;
const spacingX = 1.5;

for (let r = 0; r < buttonRows; r++) {
    for (let c = 0; c < buttonCols; c++) {
        // Small rectangular buttons
        const btnGeo = new THREE.BoxGeometry(0.8, 0.4, 0.3);
        const btn = new THREE.Mesh(btnGeo, buttonMaterial);
        btn.position.set(
            controlPanelX - spacingX/2 + c * spacingX, 
            startY - r * spacingY, 
            tvDepth / 2 + 0.1
        );
        tvGroup.add(btn);
    }
}

// Speaker Grill (Bottom part of control panel - dark rectangle)
const speakerHeight = 5;
const speakerY = -tvHeight / 2 + speakerHeight / 2 + 1.5;
const speakerGeo = new THREE.BoxGeometry(controlPanelWidth - 1, speakerHeight, 0.1);
const speaker = new THREE.Mesh(speakerGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
speaker.position.set(controlPanelX, speakerY, tvDepth / 2 + 0.15);
tvGroup.add(speaker);

// 5. Antennas
// Two telescopic antennas extending from the top center
const antennaBaseX = 0;
const antennaBaseY = tvHeight / 2;
const antennaBaseZ = tvDepth / 2 - 2;

// Left Antenna
const antennaLength = 12;
const antennaAngle = Math.PI / 4; // 45 degrees

// Base segment
const ant1Seg1Geo = new THREE.CylinderGeometry(0.15, 0.2, 4, 8);
const ant1Seg1 = new THREE.Mesh(ant1Seg1Geo, antennaMaterial);
ant1Seg1.position.set(antennaBaseX - 1, antennaBaseY + 2, antennaBaseZ);
ant1Seg1.rotation.z = antennaAngle;
ant1Seg1.rotation.x = -0.2; // Tilt slightly back
tvGroup.add(ant1Seg1);

// Tip segment
const ant1Seg2Geo = new THREE.CylinderGeometry(0.05, 0.12, 6, 8);
const ant1Seg2 = new THREE.Mesh(ant1Seg2Geo, antennaMaterial);
// Position relative to the end of the first segment
const seg1EndY = 2 + 4 * Math.cos(antennaAngle); // Approximate
const seg1EndX = -1 - 4 * Math.sin(antennaAngle);
ant1Seg2.position.set(ant1Seg1.position.x - 3 * Math.sin(antennaAngle), ant1Seg1.position.y + 3 * Math.cos(antennaAngle), ant1Seg1.position.z);
ant1Seg2.rotation.z = antennaAngle;
ant1Seg2.rotation.x = -0.2;
tvGroup.add(ant1Seg2);

// Right Antenna
const ant2Seg1Geo = new THREE.CylinderGeometry(0.15, 0.2, 4, 8);
const ant2Seg1 = new THREE.Mesh(ant2Seg1Geo, antennaMaterial);
ant2Seg1.position.set(antennaBaseX + 1, antennaBaseY + 2, antennaBaseZ);
ant2Seg1.rotation.z = -antennaAngle;
ant2Seg1.rotation.x = -0.2;
tvGroup.add(ant2Seg1);

const ant2Seg2Geo = new THREE.CylinderGeometry(0.05, 0.12, 6, 8);
const ant2Seg2 = new THREE.Mesh(ant2Seg2Geo, antennaMaterial);
ant2Seg2.position.set(ant2Seg1.position.x + 3 * Math.sin(antennaAngle), ant2Seg1.position.y + 3 * Math.cos(antennaAngle), ant2Seg1.position.z);
ant2Seg2.rotation.z = -antennaAngle;
ant2Seg2.rotation.x = -0.2;
tvGroup.add(ant2Seg2);

// 6. Bottom Vents
const ventWidth = screenAreaWidth;
const ventY = -tvHeight / 2 + 1.5;
for(let i=0; i<5; i++) {
    const ventGeo = new THREE.BoxGeometry(ventWidth - 2, 0.2, 0.1);
    const vent = new THREE.Mesh(ventGeo, darkPlasticMaterial);
    vent.position.set(screenX, ventY - i * 0.5, tvDepth / 2 + 0.1);
    tvGroup.add(vent);
}

// 7. Back Protrusion (Cable area / Power supply bump)
const backBumpGeo = new THREE.BoxGeometry(4, 6, 2);
const backBump = new THREE.Mesh(backBumpGeo, casingMaterial);
backBump.position.set(tvWidth / 2 - 3, -2, -tvDepth / 2 - 1);
tvGroup.add(backBump);

// Add the whole TV to the scene
scene.add(tvGroup);

// Adjust camera to frame the object nicely
camera.position.set(25, 20, 25);
camera.lookAt(0, 0, 0);