// Parameters for the shuttlecock geometry
const numSegments = 16;
const baseRadius = 12;
const topRadius = 40;
const skirtHeight = 55;
const slantHeight = Math.sqrt(Math.pow(topRadius - baseRadius, 2) + Math.pow(skirtHeight, 2));
const tiltAngle = Math.asin((topRadius - baseRadius) / slantHeight);
const panelThickness = 0.6;

// Calculate width of each panel at bottom and top to form a closed frustum
// Using a slightly smaller width (0.98) to leave a tiny gap for ribs, preventing z-fighting
const wBottom = 2 * baseRadius * Math.tan(Math.PI / numSegments) * 0.98;
const wTop = 2 * topRadius * Math.tan(Math.PI / numSegments) * 0.98;

// Main group to hold all parts
const shuttlecock = new THREE.Group();

// Material
const material = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide,
    flatShading: false
});

// --- Helper Functions for Cutouts ---

// Adds a rotated rectangular hole to a shape
function addRectHole(shape, cx, cy, w, h, angle = 0) {
    const path = new THREE.Path();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const hw = w / 2;
    const hh = h / 2;
    
    // Draw clockwise to define a hole
    const pts = [
        {x: -hw, y: hh},
        {x: hw, y: hh},
        {x: hw, y: -hh},
        {x: -hw, y: -hh}
    ];
    
    for (let i = 0; i < 4; i++) {
        const rx = pts[i].x * cos - pts[i].y * sin + cx;
        const ry = pts[i].x * sin + pts[i].y * cos + cy;
        if (i === 0) path.moveTo(rx, ry);
        else path.lineTo(rx, ry);
    }
    path.closePath();
    shape.holes.push(path);
}

// Adds a circular hole to a shape
function addCircleHole(shape, cx, cy, r) {
    const path = new THREE.Path();
    // true for clockwise winding (hole)
    path.absarc(cx, cy, r, 0, Math.PI * 2, true);
    shape.holes.push(path);
}

// --- Create Skirt Panel Shape ---

const shape = new THREE.Shape();
// Draw main trapezoid (counter-clockwise)
shape.moveTo(-wBottom / 2, 0);
shape.lineTo(wBottom / 2, 0);
shape.lineTo(wTop / 2, slantHeight);
// Scalloped top edge
shape.quadraticCurveTo(0, slantHeight - 3, -wTop / 2, slantHeight);
shape.lineTo(-wBottom / 2, 0);

// Add Cutout Patterns
// Row 1: Top Rectangles
for(let i = -2; i <= 2; i++) {
    addRectHole(shape, i * 2.8, 50, 1.2, 5);
}

// Row 2: Upper Diagonal Slots (////)
for(let i = -3; i <= 3; i++) {
    addRectHole(shape, i * 1.6, 38, 0.8, 4.5, Math.PI / 6);
}

// Row 3: Circular Holes
// Loop logic creates 6 holes: -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
for(let i = -2.5; i <= 2.5; i++) {
    addCircleHole(shape, i * 1.5, 26, 0.6);
}

// Row 4: Lower Diagonal Slots (\\\\)
for(let i = -2; i <= 2; i++) {
    addRectHole(shape, i * 1.3, 14, 0.6, 3.5, -Math.PI / 6);
}

// Row 5: Small Bottom Rectangles
for(let i = -1.5; i <= 1.5; i++) {
    addRectHole(shape, i * 1.0, 5, 0.5, 2);
}

// Extrude the panel shape
const extrudeSettings = {
    depth: panelThickness,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
    curveSegments: 12
};
const panelGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
// Center the geometry along the Z axis (thickness)
panelGeo.translate(0, 0, -panelThickness / 2);

// --- Assemble the Skirt ---

const ribGeo = new THREE.BoxGeometry(0.8, slantHeight + 1, 1.5);
// Translate rib so its bottom sits at local y=0
ribGeo.translate(0, slantHeight / 2, 0);

for (let i = 0; i < numSegments; i++) {
    const angle = i * (Math.PI * 2 / numSegments);

    // 1. Add Panel
    const panel = new THREE.Mesh(panelGeo, material);
    const panelPivot = new THREE.Group();
    panelPivot.add(panel);
    // Tilt panel outwards
    panelPivot.rotation.x = tiltAngle;
    // Move out to base radius
    panelPivot.position.z = baseRadius;

    const panelContainer = new THREE.Group();
    panelContainer.add(panelPivot);
    // Rotate into final radial position
    panelContainer.rotation.y = angle;
    shuttlecock.add(panelContainer);

    // 2. Add Rib (placed between panels)
    const rib = new THREE.Mesh(ribGeo, material);
    const ribPivot = new THREE.Group();
    ribPivot.add(rib);
    ribPivot.rotation.x = tiltAngle;
    // Ribs sit slightly further out than the panel base
    ribPivot.position.z = baseRadius + 0.2;

    const ribContainer = new THREE.Group();
    ribContainer.add(ribPivot);
    // Offset angle by half a segment to cover the seam
    ribContainer.rotation.y = angle + (Math.PI / numSegments);
    shuttlecock.add(ribContainer);
}

// --- Add Horizontal Reinforcing Bands ---

const createBand = (radius, yPos) => {
    const bandGeo = new THREE.TorusGeometry(radius, 0.5, 8, 64);
    const band = new THREE.Mesh(bandGeo, material);
    band.rotation.x = Math.PI / 2;
    band.position.y = yPos;
    shuttlecock.add(band);
};

// Calculate approximate radius at different heights along the cone
const getRadiusAtY = (y) => baseRadius + (topRadius - baseRadius) * (y / skirtHeight);

createBand(getRadiusAtY(48), 48);
createBand(getRadiusAtY(32), 32);
createBand(getRadiusAtY(10), 10);

// --- Create Base (Cork) ---

const baseGroup = new THREE.Group();

// Main rounded part
const corkGeo = new THREE.SphereGeometry(12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const cork = new THREE.Mesh(corkGeo, material);
// Point hemisphere downwards and scale slightly to elongate
cork.rotation.x = Math.PI;
cork.scale.y = 1.1;
cork.position.y = -4;
baseGroup.add(cork);

// Cylindrical collar connecting cork to skirt
const collarGeo = new THREE.CylinderGeometry(12, 12, 4, 32);
const collar = new THREE.Mesh(collarGeo, material);
collar.position.y = -2;
baseGroup.add(collar);

shuttlecock.add(baseGroup);

// --- Final Scene Setup ---

// Orient the shuttlecock to match the image perspective (lying down, angled)
shuttlecock.rotation.z = -Math.PI / 2;
shuttlecock.rotation.x = 0.3;
shuttlecock.rotation.y = -0.6;

scene.add(shuttlecock);

// Adjust camera to frame the object nicely
camera.position.set(80, 50, 90);
camera.lookAt(0, 0, 0);