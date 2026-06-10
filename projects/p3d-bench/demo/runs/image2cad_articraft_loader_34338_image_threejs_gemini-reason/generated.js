// Parameters for the stylized tractor/loader
const cMain = 0xcccccc; // Light gray color matching the image
const cEdge = 0x333333; // Dark gray for edge outlines

// Materials
const mainMaterial = new THREE.MeshStandardMaterial({ 
    color: cMain, 
    roughness: 0.7, 
    metalness: 0.1,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});
const edgeMaterial = new THREE.LineBasicMaterial({ color: cEdge });

// Helper function to create a mesh with hard edges (CAD style)
function createPart(geometry, x, y, z) {
    const mesh = new THREE.Mesh(geometry, mainMaterial);
    
    // Add edge lines for the stylized look
    const edges = new THREE.EdgesGeometry(geometry, 20); // 20 degree threshold
    const lines = new THREE.LineSegments(edges, edgeMaterial);
    mesh.add(lines);
    
    mesh.position.set(x, y, z);
    return mesh;
}

// Main group
const tractor = new THREE.Group();

// --- 1. Chassis & Body ---
// Main lower body
tractor.add(createPart(new THREE.BoxGeometry(10, 2.5, 4.5), 0, 2.25, 0));
// Rear deck / fenders
tractor.add(createPart(new THREE.BoxGeometry(6, 0.5, 8), -3, 3.75, 0));
// Front hood area
tractor.add(createPart(new THREE.BoxGeometry(4.5, 2.5, 4), 2.25, 4.75, 0));
// Front grill extension
tractor.add(createPart(new THREE.BoxGeometry(1.5, 2.5, 4), 5.25, 3.5, 0));

// --- 2. Cabin ---
// Cab base
tractor.add(createPart(new THREE.BoxGeometry(4.5, 1.5, 4.5), -3, 4.75, 0));
// Cab pillars (creating empty windows)
const pillarGeom = new THREE.BoxGeometry(0.5, 2.5, 0.5);
tractor.add(createPart(pillarGeom, -5.0, 6.75, 2.0));
tractor.add(createPart(pillarGeom, -1.0, 6.75, 2.0));
tractor.add(createPart(pillarGeom, -5.0, 6.75, -2.0));
tractor.add(createPart(pillarGeom, -1.0, 6.75, -2.0));
// Cab roof
tractor.add(createPart(new THREE.BoxGeometry(4.9, 0.6, 4.9), -3, 8.3, 0));

// --- 3. Exhaust Pipe ---
tractor.add(createPart(new THREE.CylinderGeometry(0.25, 0.25, 3, 16), -5, 6.5, -3.2));

// --- 4. Wheels ---
function createWheel(radius, width, x, y, z) {
    const wheel = new THREE.Group();
    wheel.position.set(x, y, z);

    // Inner Hub
    const hub = createPart(new THREE.CylinderGeometry(radius * 0.4, radius * 0.4, width + 0.2, 16), 0, 0, 0);
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);

    // Main Tire
    const tire = createPart(new THREE.CylinderGeometry(radius, radius, width, 24), 0, 0, 0);
    tire.rotation.x = Math.PI / 2;
    wheel.add(tire);

    // V-shaped Treads
    const numTreads = 16;
    for (let i = 0; i < numTreads; i++) {
        const angle = (i / numTreads) * Math.PI * 2;
        const treadContainer = new THREE.Group();
        
        // Position on the circumference
        treadContainer.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        // Point local Y outward
        treadContainer.rotation.z = angle + Math.PI / 2;

        const treadGeom = new THREE.BoxGeometry(0.4, 0.4, width * 0.45);
        
        // Left tread half
        const treadL = createPart(treadGeom, 0, 0, width * 0.25);
        treadL.rotation.y = Math.PI / 6; // Angle for V-shape
        treadContainer.add(treadL);

        // Right tread half
        const treadR = createPart(treadGeom, 0, 0, -width * 0.25);
        treadR.rotation.y = -Math.PI / 6;
        treadContainer.add(treadR);

        wheel.add(treadContainer);
    }
    tractor.add(wheel);
}

// Place wheels (Rear larger, Front slightly smaller)
createWheel(2.4, 1.8, -3.5, 2.4, 3.8);  // Rear Left
createWheel(2.4, 1.8, -3.5, 2.4, -3.8); // Rear Right
createWheel(2.0, 1.6, 4.5, 2.0, 3.6);   // Front Left
createWheel(2.0, 1.6, 4.5, 2.0, -3.6);  // Front Right

// --- 5. Front Loader Arms ---
const armShape = new THREE.Shape();
armShape.moveTo(0, 0);         // Base attachment
armShape.lineTo(4.5, 1.5);     // Knee bend
armShape.lineTo(9.0, -2.5);    // Bucket attachment
armShape.lineTo(8.0, -3.2);    // Bottom edge
armShape.lineTo(4.0, 0.5);     // Inner knee
armShape.lineTo(0, -1.0);      // Inner base

const armExtrudeSettings = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 1 };
const armGeom = new THREE.ExtrudeGeometry(armShape, armExtrudeSettings);

// Left and Right Arms
const armL = createPart(armGeom, -1, 4.5, 2.3);
const armR = createPart(armGeom, -1, 4.5, -2.8);
tractor.add(armL, armR);

// Arm Crossbars & Hinges
function createHinge(x, y, z, length) {
    const hinge = createPart(new THREE.CylinderGeometry(0.35, 0.35, length, 16), x, y, z);
    hinge.rotation.x = Math.PI / 2;
    tractor.add(hinge);
}
createHinge(-1.0, 4.5, 0, 5.8); // Main pivot
createHinge(3.5, 6.0, 0, 5.8);  // Knee pivot
createHinge(6.0, 1.5, 0, 5.0);  // Middle crossbar
createHinge(8.0, 2.0, 0, 5.8);  // Bucket pivot

// --- 6. Front Bucket ---
const bucketGroup = new THREE.Group();
// Position bucket at the end of the arms
bucketGroup.position.set(8.0, 2.0, 0);

// Bucket Back Plate
const bucketBack = createPart(new THREE.BoxGeometry(0.2, 4.0, 8.4), 0, -2.0, 0);
bucketGroup.add(bucketBack);

// Bucket Bottom Plate
const bucketBottom = createPart(new THREE.BoxGeometry(4.0, 0.2, 8.4), 1.9, -3.9, 0);
bucketGroup.add(bucketBottom);

// Bucket Side Plates (Trapezoidal profile)
const sideShape = new THREE.Shape();
sideShape.moveTo(-0.1, 0.1);
sideShape.lineTo(-0.1, -4.0);
sideShape.lineTo(4.0, -4.0);

const sideGeom = new THREE.ExtrudeGeometry(sideShape, { depth: 0.2, bevelEnabled: false });
const sideL = createPart(sideGeom, 0, 0, 4.0);
const sideR = createPart(sideGeom, 0, 0, -4.2);
bucketGroup.add(sideL, sideR);

// Tilt bucket slightly forward
bucketGroup.rotation.z = -Math.PI / 10;
tractor.add(bucketGroup);

// Add entire model to scene
scene.add(tractor);

// --- 7. Camera Adjustment ---
// Position camera for a nice isometric-style view
camera.position.set(22, 18, 25);
camera.lookAt(2, 3, 0);