// Parameters
const bodyWidth = 60;
const bodyHeight = 20;
const bodyDepth = 20;
const legHeight = 25;
const legRadiusTop = 1.5;
const legRadiusBottom = 0.8;
const legSplayAngle = 0.2; // Radians
const speakerRadius = 8;
const speakerDepth = 2;

// Materials
const mainMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, 
    roughness: 0.3, 
    metalness: 0.1 
});
const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333, 
    roughness: 0.5 
});
const accentMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2194ce, 
    roughness: 0.2 
});

// 1. Main Chassis
// The body is a rectangular box.
const chassisGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
const chassis = new THREE.Mesh(chassisGeometry, mainMaterial);
chassis.position.y = bodyHeight / 2 + legHeight * Math.cos(legSplayAngle) - 2; // Adjust Y to sit on legs
chassis.castShadow = true;
chassis.receiveShadow = true;
scene.add(chassis);

// Helper function to create a hexagonal speaker unit
function createSpeakerUnit(xPos) {
    const group = new THREE.Group();
    
    // Outer Hexagonal Frame
    const outerHexGeo = new THREE.CylinderGeometry(speakerRadius + 2, speakerRadius + 2, speakerDepth, 6);
    // Rotate to face forward (cylinder defaults to Y-up)
    outerHexGeo.rotateX(Math.PI / 2); 
    const outerHex = new THREE.Mesh(outerHexGeo, mainMaterial);
    outerHex.position.z = bodyDepth / 2 + speakerDepth / 2;
    group.add(outerHex);

    // Inner Hexagonal Ring
    const innerHexGeo = new THREE.CylinderGeometry(speakerRadius, speakerRadius, speakerDepth + 0.5, 6);
    innerHexGeo.rotateX(Math.PI / 2);
    const innerHex = new THREE.Mesh(innerHexGeo, darkMaterial);
    innerHex.position.z = bodyDepth / 2 + speakerDepth / 2;
    group.add(innerHex);

    // Central Cone
    const coneGeo = new THREE.CylinderGeometry(speakerRadius * 0.6, speakerRadius * 0.6, speakerDepth + 1, 32);
    coneGeo.rotateX(Math.PI / 2);
    const cone = new THREE.Mesh(coneGeo, mainMaterial);
    cone.position.z = bodyDepth / 2 + speakerDepth / 2;
    group.add(cone);

    // Grille Lines (Radial spokes)
    const spokeCount = 24;
    for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2;
        // Create a thin box for each spoke
        const spokeGeo = new THREE.BoxGeometry(0.2, speakerRadius * 0.5, 0.2);
        const spoke = new THREE.Mesh(spokeGeo, darkMaterial);
        
        // Position spoke
        const dist = speakerRadius * 0.8;
        spoke.position.x = Math.cos(angle) * dist;
        spoke.position.y = Math.sin(angle) * dist;
        spoke.position.z = bodyDepth / 2 + speakerDepth / 2 + 0.5;
        
        // Rotate spoke to point to center
        spoke.rotation.z = angle;
        group.add(spoke);
    }

    // Concentric Hexagon details inside
    const midHexGeo = new THREE.CylinderGeometry(speakerRadius * 0.85, speakerRadius * 0.85, speakerDepth + 0.2, 6);
    midHexGeo.rotateX(Math.PI / 2);
    const midHex = new THREE.Mesh(midHexGeo, mainMaterial); // Wireframe-like look
    midHex.position.z = bodyDepth / 2 + speakerDepth / 2;
    // Using edges geometry for the wireframe look seen in the image
    const midHexEdges = new THREE.EdgesGeometry(midHexGeo);
    const midHexLine = new THREE.LineSegments(midHexEdges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    midHexLine.position.copy(midHex.position);
    group.add(midHexLine);

    group.position.x = xPos;
    return group;
}

// Add Speakers
const speakerLeft = createSpeakerUnit(-bodyWidth / 4);
const speakerRight = createSpeakerUnit(bodyWidth / 4);
scene.add(speakerLeft);
scene.add(speakerRight);

// 2. Center Geometric Decoration
// A star/cross shape between speakers
const centerGroup = new THREE.Group();
const starMat = new THREE.MeshStandardMaterial({ color: 0x888888 });

// Vertical bar
const vBarGeo = new THREE.BoxGeometry(1, 10, 1);
const vBar = new THREE.Mesh(vBarGeo, starMat);
centerGroup.add(vBar);

// Horizontal bar
const hBarGeo = new THREE.BoxGeometry(10, 1, 1);
const hBar = new THREE.Mesh(hBarGeo, starMat);
centerGroup.add(hBar);

// Diagonal bars to make an X
const dBarGeo = new THREE.BoxGeometry(8, 1, 1);
const dBar1 = new THREE.Mesh(dBarGeo, starMat);
dBar1.rotation.z = Math.PI / 4;
centerGroup.add(dBar1);

const dBar2 = new THREE.Mesh(dBarGeo, starMat);
dBar2.rotation.z = -Math.PI / 4;
centerGroup.add(dBar2);

centerGroup.position.z = bodyDepth / 2 + 0.5;
scene.add(centerGroup);

// 3. Legs
const legPositions = [
    { x: -bodyWidth / 2 + 3, z: -bodyDepth / 2 + 3, rotZ: legSplayAngle, rotX: -legSplayAngle }, // Back Left
    { x: bodyWidth / 2 - 3, z: -bodyDepth / 2 + 3, rotZ: -legSplayAngle, rotX: -legSplayAngle }, // Back Right
    { x: -bodyWidth / 2 + 3, z: bodyDepth / 2 - 3, rotZ: legSplayAngle, rotX: legSplayAngle },   // Front Left
    { x: bodyWidth / 2 - 3, z: bodyDepth / 2 - 3, rotZ: -legSplayAngle, rotX: legSplayAngle }    // Front Right
];

// Adjust Y position of chassis so legs touch ground (y=0)
// Leg length projected on Y axis
const legYProjection = legHeight * Math.cos(legSplayAngle);
chassis.position.y = legYProjection + bodyHeight / 2;

legPositions.forEach(pos => {
    const legGeo = new THREE.CylinderGeometry(legRadiusTop, legRadiusBottom, legHeight, 12);
    const leg = new THREE.Mesh(legGeo, mainMaterial);
    
    // Position relative to chassis bottom
    leg.position.set(pos.x, -legYProjection / 2, pos.z);
    
    // Rotate
    leg.rotation.x = pos.rotX;
    leg.rotation.z = pos.rotZ;
    
    scene.add(leg);
});

// 4. Top Controls (Buttons/Knobs)
const buttonGroup = new THREE.Group();
const buttonGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
buttonGeo.rotateX(Math.PI / 2); // Face up

const buttonPositions = [
    { x: bodyWidth / 2 - 8, z: 0 },
    { x: bodyWidth / 2 - 13, z: -4 },
    { x: bodyWidth / 2 - 3, z: 4 }
];

buttonPositions.forEach((pos, index) => {
    const btn = new THREE.Mesh(buttonGeo, index === 1 ? accentMaterial : darkMaterial);
    btn.position.set(pos.x, bodyHeight / 2 + 0.5, pos.z);
    buttonGroup.add(btn);
});
scene.add(buttonGroup);

// Adjust Camera
camera.position.set(50, 40, 60);
camera.lookAt(0, 10, 0);