// Parameters
const FAN_SIZE = 12;
const FRAME_THICKNESS = 1.0;
const PILLAR_HEIGHT = 2.5;
const BLADE_RADIUS = 5.2;
const HUB_RADIUS = 1.8;
const CORNER_HOLE_RADIUS = 0.5;
const CORNER_RADIUS = 1.2;
const BLADE_COUNT = 7;

// Materials
const greyMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.2 });
const darkGreyMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.5, metalness: 0.3 });

const fanGroup = new THREE.Group();
scene.add(fanGroup);

// --- Helper: Create Frame Shape ---
function createFrameShape(hasCenterHole) {
    const shape = new THREE.Shape();
    const hs = FAN_SIZE / 2;
    const r = CORNER_RADIUS;
    
    // Rounded Rectangle
    shape.moveTo(-hs + r, -hs);
    shape.lineTo(hs - r, -hs);
    shape.quadraticCurveTo(hs, -hs, hs, -hs + r);
    shape.lineTo(hs, hs - r);
    shape.quadraticCurveTo(hs, hs, hs - r, hs);
    shape.lineTo(-hs + r, hs);
    shape.quadraticCurveTo(-hs, hs, -hs, hs - r);
    shape.lineTo(-hs, -hs + r);
    shape.quadraticCurveTo(-hs, -hs, -hs + r, -hs);
    
    // Center Hole
    if (hasCenterHole) {
        const hole = new THREE.Path();
        hole.absarc(0, 0, BLADE_RADIUS + 0.6, 0, Math.PI * 2, false);
        shape.holes.push(hole);
    }
    
    // Corner Holes
    const dist = hs - 0.8;
    const corners = [[dist, dist], [-dist, dist], [-dist, -dist], [dist, -dist]];
    corners.forEach(p => {
        const h = new THREE.Path();
        h.absarc(p[0], p[1], CORNER_HOLE_RADIUS, 0, Math.PI * 2, false);
        shape.holes.push(h);
    });
    
    return shape;
}

// --- Top Frame ---
const topShape = createFrameShape(true);
const topGeo = new THREE.ExtrudeGeometry(topShape, {
    depth: FRAME_THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
});
const topFrame = new THREE.Mesh(topGeo, greyMat);
// Rotate to lie flat in XZ plane (Extrude is along Z, so rotate X -90)
topFrame.rotation.x = -Math.PI / 2; 
topFrame.position.y = PILLAR_HEIGHT;
fanGroup.add(topFrame);

// --- Bottom Frame ---
// The bottom frame is similar but acts as a base (no large center hole visible in the same way, or it's a grill)
// Based on image, it looks like a solid plate with corner holes.
const bottomShape = createFrameShape(false); 
const bottomGeo = new THREE.ExtrudeGeometry(bottomShape, {
    depth: FRAME_THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
});
const bottomFrame = new THREE.Mesh(bottomGeo, greyMat);
bottomFrame.rotation.x = -Math.PI / 2;
bottomFrame.position.y = 0;
fanGroup.add(bottomFrame);

// --- Pillars ---
const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, PILLAR_HEIGHT, 16);
const dist = FAN_SIZE / 2 - 0.8;
const corners = [[dist, dist], [-dist, dist], [-dist, -dist], [dist, -dist]];

corners.forEach(p => {
    // Pillar
    const pillar = new THREE.Mesh(pillarGeo, darkGreyMat);
    pillar.position.set(p[0], PILLAR_HEIGHT / 2, p[1]);
    fanGroup.add(pillar);
    
    // Top Nut/Washer detail
    const nutGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 16);
    const topNut = new THREE.Mesh(nutGeo, darkGreyMat);
    topNut.position.set(p[0], PILLAR_HEIGHT, p[1]);
    fanGroup.add(topNut);
    
    // Bottom Nut/Washer detail
    const botNut = new THREE.Mesh(nutGeo, darkGreyMat);
    botNut.position.set(p[0], 0, p[1]);
    fanGroup.add(botNut);
});

// --- Hub ---
const hubGeo = new THREE.CylinderGeometry(HUB_RADIUS, HUB_RADIUS, FRAME_THICKNESS + 0.2, 32);
const hub = new THREE.Mesh(hubGeo, darkGreyMat);
hub.position.y = PILLAR_HEIGHT - FRAME_THICKNESS / 2;
fanGroup.add(hub);

// --- Blades ---
const bladeShape = new THREE.Shape();
const rIn = HUB_RADIUS + 0.1;
const rOut = BLADE_RADIUS;

// Curved Blade Shape (Airfoil-like)
bladeShape.moveTo(rIn, 0);
// Leading Edge (Swept forward/curved)
bladeShape.quadraticCurveTo(rIn + 2, 1.5, rOut - 0.5, 2.8);
// Tip
bladeShape.lineTo(rOut, 2.0);
// Trailing Edge
bladeShape.quadraticCurveTo(rIn + 2, 0.5, rIn, -0.8);
bladeShape.lineTo(rIn, 0);

const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.15, // Blade thickness
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2
});

for (let i = 0; i < BLADE_COUNT; i++) {
    const pivot = new THREE.Group();
    const angle = (i / BLADE_COUNT) * Math.PI * 2;
    pivot.rotation.y = angle;
    
    const blade = new THREE.Mesh(bladeGeo, greyMat);
    // Orient blade:
    // 1. Lay flat (X -90) -> Face in XZ, Thickness in -Y
    blade.rotation.x = -Math.PI / 2;
    // 2. Pitch (Z rotation) -> Tilt leading edge up to create angle of attack
    blade.rotation.z = 0.6; 
    
    pivot.add(blade);
    fanGroup.add(pivot);
}

// Adjust Camera for Isometric View
camera.position.set(18, 18, 18);
camera.lookAt(0, 0, 0);