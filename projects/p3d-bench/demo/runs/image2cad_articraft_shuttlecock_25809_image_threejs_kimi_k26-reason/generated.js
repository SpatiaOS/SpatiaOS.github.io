// Parameters – estimated proportions from the reference image
const drumRadius = 18;           // Main cylindrical radius
const drumLength = 50;           // Length of the perforated barrel
const wallThickness = 1.5;       // Thickness of the drum wall
const numPanels = 6;             // Number of perforated sections around circumference
const panelAngle = (Math.PI * 2) / numPanels;
const panelArcWidth = drumRadius * panelAngle; // Flat width of each unwrapped panel
const panelOverlap = 0.3;        // Slight overlap to avoid gaps between panels

// Perforation pattern
const colsPerPanel = 4;          // Axial columns of holes per panel (slots vs circles)
const rowsPerPanel = 7;          // Features along the drum length
const holeRadius = 1.0;          // Circular hole radius
const slotLength = 3.2;          // Elongated slot length (axial)
const slotWidth = 0.9;           // Elongated slot width

// Structural ribs
const ribWidth = 2.0;            // Width of each axial rib
const ribDepth = 1.0;            // How far ribs protrude outward
const numRibs = numPanels;       // One rib at every panel seam

// End cap & rim
const domeRadius = drumRadius + wallThickness;
const rimTube = 2.0;             // Thickness of the rolled front lip

// Material – brushed metal appearance
const material = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.7,
    roughness: 0.35,
    side: THREE.DoubleSide
});

// Group to hold the entire drum assembly
const drumGroup = new THREE.Group();

/**
 * Creates one flat perforated panel using ExtrudeGeometry with Shape holes,
 * then bends its vertices around the X-axis to form a cylindrical segment.
 */
function createPerforatedPanel(panelIndex) {
    const shape = new THREE.Shape();
    const w = panelArcWidth + panelOverlap;
    const h = drumLength;

    // Outer contour (clockwise)
    shape.moveTo(0, -w / 2);
    shape.lineTo(0, w / 2);
    shape.lineTo(h, w / 2);
    shape.lineTo(h, -w / 2);
    shape.lineTo(0, -w / 2);

    // Hole grid: alternate axial columns between slots and circles
    const colSpacing = h / (rowsPerPanel + 1);
    const rowSpacing = w / (colsPerPanel + 1);

    for (let c = 0; c < colsPerPanel; c++) {
        const cy = -w / 2 + rowSpacing * (c + 1);
        const isSlot = (c % 2 === 0); // even columns = slots, odd = circles

        for (let r = 0; r < rowsPerPanel; r++) {
            const cx = colSpacing * (r + 1);

            if (isSlot) {
                // Rounded slot elongated along the drum axis
                const slotPath = new THREE.Path();
                slotPath.absellipse(cx, cy, slotLength / 2, slotWidth / 2, 0, Math.PI * 2, true, 0);
                shape.holes.push(slotPath);
            } else {
                // Circular vent hole
                const circlePath = new THREE.Path();
                circlePath.absarc(cx, cy, holeRadius, 0, Math.PI * 2, true);
                shape.holes.push(circlePath);
            }
        }
    }

    const extrudeSettings = {
        depth: wallThickness,
        bevelEnabled: false,
        curveSegments: 12
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Bend the flat extrusion around the X-axis to match the drum curvature
    const pos = geometry.attributes.position;
    const centerX = h / 2;

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i); // axial coordinate
        const y = pos.getY(i); // circumferential flat coordinate
        const z = pos.getZ(i); // radial thickness (0 .. wallThickness)

        const angle = y / drumRadius;
        const r = drumRadius + z; // inner surface + wall offset

        pos.setX(i, x - centerX);
        pos.setY(i, r * Math.sin(angle));
        pos.setZ(i, r * Math.cos(angle));
    }

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    // Rotate panel to its angular position around the drum
    mesh.rotation.x = panelIndex * panelAngle;
    return mesh;
}

// Build the cylindrical shell from bent perforated panels
for (let i = 0; i < numPanels; i++) {
    drumGroup.add(createPerforatedPanel(i));
}

// Axial ribs at each panel seam for structural detail
for (let i = 0; i < numRibs; i++) {
    const angle = i * panelAngle;
    const ribGeo = new THREE.BoxGeometry(drumLength, ribWidth, wallThickness + ribDepth);
    const rib = new THREE.Mesh(ribGeo, material);

    const r = drumRadius + wallThickness + ribDepth / 2;
    rib.position.set(0, r * Math.sin(angle), r * Math.cos(angle));
    rib.rotation.x = angle;

    drumGroup.add(rib);
}

// Solid hemispherical dome closing the back end (+X)
const domeGeo = new THREE.SphereGeometry(domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const dome = new THREE.Mesh(domeGeo, material);
dome.rotation.z = -Math.PI / 2; // Orient flat face toward the cylinder
dome.position.x = drumLength / 2;
drumGroup.add(dome);

// Rolled front rim at the open end (-X)
const rimGeo = new THREE.TorusGeometry(drumRadius + wallThickness, rimTube, 16, 64);
const rim = new THREE.Mesh(rimGeo, material);
rim.rotation.y = Math.PI / 2; // Ring around the X-axis
rim.position.x = -drumLength / 2;
drumGroup.add(rim);

// Tilt the entire drum to match the reference viewing angle
drumGroup.rotation.x = Math.PI / 12;
drumGroup.rotation.y = -Math.PI / 6;
drumGroup.rotation.z = Math.PI / 8;

scene.add(drumGroup);

// Camera positioned for a similar isometric view
camera.position.set(60, 45, 60);
camera.lookAt(0, 0, 0);