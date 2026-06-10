// Parameters
const drumLength = 16;
const drumRadius = 3.5; // Apothem (distance from center to flat face)
const numPanels = 6;
const panelThickness = 0.15;
const ribWidth = 0.3;
const ribHeight = 0.5; // Radial protrusion
const ringThickness = 0.3;

// Calculate corner radius (distance from center to vertex of hexagon)
// radius = apothem / cos(PI/6)
const cornerRadius = drumRadius / Math.cos(Math.PI / numPanels);

// Materials
const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.6,
    roughness: 0.4,
    side: THREE.DoubleSide
});

const ribMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.8,
    roughness: 0.3
});

// --- Create Panel Geometry with Holes ---
function createScreenPanelGeometry() {
    // Width of the flat panel (chord length of hexagon)
    const width = 2 * drumRadius * Math.sin(Math.PI / numPanels);
    const height = drumLength;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    shape.lineTo(0, 0);

    // Helper: Rectangular Hole
    function addRectHole(x, y, w, h) {
        const path = new THREE.Path();
        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.lineTo(x, y);
        shape.holes.push(path);
    }

    // Helper: Circular Hole
    function addCircleHole(x, y, r) {
        const path = new THREE.Path();
        path.absarc(x, y, r, 0, Math.PI * 2, false);
        shape.holes.push(path);
    }

    // Zone 1: Rectangular Slots (Front section)
    const slotW = 0.25;
    const slotH = 1.0;
    const gapX = 0.5;
    const gapY = 0.3;
    
    for (let y = 0.5; y < 5; y += slotH + gapY) {
        for (let x = 0.3; x < width - 0.3; x += slotW + gapX) {
            addRectHole(x, y, slotW, slotH);
        }
    }

    // Zone 2: Circular Holes (Middle section)
    const circleR = 0.3;
    const circleGap = 0.8;
    
    for (let y = 5.5; y < 10; y += circleGap) {
        // Stagger rows
        const rowOffset = (Math.floor((y - 5.5) / circleGap) % 2 === 0) ? 0 : circleGap / 2;
        for (let x = circleR + 0.2 + rowOffset; x < width - circleR - 0.2; x += circleGap) {
            addCircleHole(x, y, circleR);
        }
    }

    // Zone 3: Diagonal/Small Slots (Rear section)
    // Simulating diagonal pattern by shifting X based on Y
    const smallSlotW = 0.15;
    const smallSlotH = 0.5;
    
    for (let y = 10.5; y < 15; y += smallSlotH + 0.2) {
        const diagonalShift = (y - 10.5) * 0.5; // Shift right as we go up
        for (let x = 0.2 + diagonalShift; x < width - 0.2; x += smallSlotW + 0.3) {
             // Wrap around logic not needed, just clip
             if (x < width - smallSlotW) {
                 addRectHole(x, y, smallSlotW, smallSlotH);
             }
        }
    }

    const extrudeSettings = { depth: panelThickness, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center the geometry so rotation/positioning is easier
    geometry.center();
    
    return geometry;
}

const panelGeometry = createScreenPanelGeometry();

// --- Build Drum Assembly ---
const drumGroup = new THREE.Group();

// 1. Panels
for (let i = 0; i < numPanels; i++) {
    const angle = (i / numPanels) * Math.PI * 2;
    
    const pivot = new THREE.Object3D();
    pivot.rotation.z = angle;
    
    const panelMesh = new THREE.Mesh(panelGeometry, screenMaterial);
    
    // Orientation:
    // Geometry is in XY plane (thickness in Z).
    // Rotate X 90 deg -> Geometry in XZ plane (thickness in -Y).
    // The "face" is now vertical.
    panelMesh.rotation.x = Math.PI / 2;
    
    // Position:
    // Move along the local Y of the pivot (which is rotated by `angle`).
    // This places the panel at the correct circumferential position.
    panelMesh.position.y = drumRadius;
    
    pivot.add(panelMesh);
    drumGroup.add(pivot);
}

// 2. Longitudinal Ribs (at the corners)
const ribGeo = new THREE.BoxGeometry(ribWidth, ribHeight, drumLength);
// Center rib geometry
ribGeo.translate(0, 0, 0); 

for (let i = 0; i < numPanels; i++) {
    // Corners are halfway between panel centers
    const cornerAngle = ((i + 0.5) / numPanels) * Math.PI * 2;
    
    const ribMesh = new THREE.Mesh(ribGeo, ribMaterial);
    
    // Position at corner radius
    // x = r * sin(theta), y = r * cos(theta) because 0 angle is +Y in our setup
    ribMesh.position.set(
        cornerRadius * Math.sin(cornerAngle),
        cornerRadius * Math.cos(cornerAngle),
        0
    );
    
    // Rotate to align with corner (radial direction)
    // Default box Y is "up". We want box Y to point radially outward.
    // Radial outward at `cornerAngle` corresponds to rotation Z = cornerAngle.
    ribMesh.rotation.z = cornerAngle;
    
    drumGroup.add(ribMesh);
}

// 3. Circumferential Rings
// Hexagonal rings using CylinderGeometry with 6 segments
const ringZPositions = [2, 6, 10, 15]; // Spacing along the drum

ringZPositions.forEach(z => {
    // Cylinder along Y axis. We want it in XY plane (perpendicular to Z drum axis).
    // So rotate X 90 deg.
    const ringGeo = new THREE.CylinderGeometry(cornerRadius, cornerRadius, ringThickness, numPanels, 1, true);
    const ringMesh = new THREE.Mesh(ringGeo, ribMaterial);
    
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.z = z - drumLength / 2; // Adjust for centering later
    
    drumGroup.add(ringMesh);
});

// 4. End Cap (Solid ring at the back)
const capGeo = new THREE.CylinderGeometry(cornerRadius, cornerRadius, 0.5, numPanels);
const capMesh = new THREE.Mesh(capGeo, ribMaterial);
capMesh.rotation.x = Math.PI / 2;
capMesh.position.z = (drumLength / 2) - 0.25; // At the very end
drumGroup.add(capMesh);

// Center the entire drum group along Z
// Currently spans roughly -8 to +8 (if rings are relative).
// My rings were placed at z=2,6,10,15 relative to group origin.
// Panel is 0 to 16 relative to group origin (before centering).
// Wait, panelGeometry.center() moved it to -8 to +8.
// So the drum is roughly centered at 0.
// Let's just add it.
scene.add(drumGroup);

// Adjust Camera
camera.position.set(15, 12, 15);
camera.lookAt(0, 0, 0);