// Parameters for the clock dimensions
const clockRadius = 20;
const rimInnerRadius = 16.5;
const backPlateThickness = 1;
const rimHeight = 1;
const numeralRadius = 12.5;
const numeralHeight = 3;
const numeralThickness = 0.4;
const strokeWidth = 0.6;
const centerCircleRadius = 4.5;
const centerCircleHeight = 0.2;
const pinRadius = 0.6;
const pinHeight = 1.0;

// Materials with a monochrome, slightly metallic aesthetic
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8a8e91, roughness: 0.6, metalness: 0.1 });
const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x959a9c, roughness: 0.5, metalness: 0.15 });
const numeralMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a4a6, roughness: 0.4, metalness: 0.2 });
const handMaterial = new THREE.MeshStandardMaterial({ color: 0x6a6e71, roughness: 0.5, metalness: 0.3 });

// 1. Clock Base (Back Plate)
const backGeom = new THREE.CylinderGeometry(clockRadius, clockRadius, backPlateThickness, 64);
const backMesh = new THREE.Mesh(backGeom, baseMaterial);
// Position so the top face is exactly at y = 0
backMesh.position.y = -backPlateThickness / 2;
scene.add(backMesh);

// 2. Clock Rim (Raised outer edge with slight bevels)
const rimPoints = [];
rimPoints.push(new THREE.Vector2(rimInnerRadius, 0));
rimPoints.push(new THREE.Vector2(clockRadius, 0));
rimPoints.push(new THREE.Vector2(clockRadius, rimHeight - 0.1));
rimPoints.push(new THREE.Vector2(clockRadius - 0.1, rimHeight));
rimPoints.push(new THREE.Vector2(rimInnerRadius + 0.1, rimHeight));
rimPoints.push(new THREE.Vector2(rimInnerRadius, rimHeight - 0.1));
rimPoints.push(new THREE.Vector2(rimInnerRadius, 0));

const rimGeom = new THREE.LatheGeometry(rimPoints, 64);
const rimMesh = new THREE.Mesh(rimGeom, rimMaterial);
// Rests on the back plate at y = 0
scene.add(rimMesh);

// 3. Inner Center Circle
const centerCircGeom = new THREE.CylinderGeometry(centerCircleRadius, centerCircleRadius, centerCircleHeight, 32);
const centerCircMesh = new THREE.Mesh(centerCircGeom, rimMaterial);
centerCircMesh.position.y = centerCircleHeight / 2;
scene.add(centerCircMesh);

// 4. Center Pin
const pinGeom = new THREE.CylinderGeometry(pinRadius, pinRadius, pinHeight, 16);
const pinMesh = new THREE.Mesh(pinGeom, handMaterial);
pinMesh.position.y = pinHeight / 2;
scene.add(pinMesh);

// 5. Roman Numerals Construction
// Helper functions to create basic numeral strokes
function createI() {
    const geom = new THREE.BoxGeometry(strokeWidth, numeralThickness, numeralHeight);
    return new THREE.Mesh(geom, numeralMaterial);
}

function createV() {
    const group = new THREE.Group();
    const geom = new THREE.BoxGeometry(strokeWidth, numeralThickness, numeralHeight + 0.2);
    
    const left = new THREE.Mesh(geom, numeralMaterial);
    left.rotation.y = 0.32; // Lean right
    left.position.set(-0.5, 0, 0);
    
    const right = new THREE.Mesh(geom, numeralMaterial);
    right.rotation.y = -0.32; // Lean left
    right.position.set(0.5, 0, 0);
    
    group.add(left, right);
    return group;
}

function createX() {
    const group = new THREE.Group();
    const geom = new THREE.BoxGeometry(strokeWidth, numeralThickness, numeralHeight + 0.6);
    
    const left = new THREE.Mesh(geom, numeralMaterial);
    left.rotation.y = 0.58;
    
    const right = new THREE.Mesh(geom, numeralMaterial);
    right.rotation.y = -0.58;
    
    group.add(left, right);
    return group;
}

// Assembler for complex numerals
function buildNumeral(str) {
    const group = new THREE.Group();
    const widths = { 'I': 0.6, 'V': 2.0, 'X': 1.8 };
    const spacing = 0.4;
    
    let totalWidth = 0;
    for (let i = 0; i < str.length; i++) {
        totalWidth += widths[str[i]];
        if (i < str.length - 1) totalWidth += spacing;
    }

    let currentX = -totalWidth / 2;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        let mesh;
        if (char === 'I') mesh = createI();
        else if (char === 'V') mesh = createV();
        else if (char === 'X') mesh = createX();

        currentX += widths[char] / 2;
        mesh.position.x = currentX;
        group.add(mesh);
        currentX += widths[char] / 2 + spacing;
    }
    return group;
}

// Place numerals around the clock face
const numeralsList = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
for (let i = 0; i < 12; i++) {
    const hour = i + 1;
    const numGroup = buildNumeral(numeralsList[i]);
    
    // Calculate angle (12 o'clock is 0 radians, moving clockwise)
    const angle = (hour / 12) * Math.PI * 2;
    
    // Position in a circle
    numGroup.position.x = numeralRadius * Math.sin(angle);
    numGroup.position.z = -numeralRadius * Math.cos(angle);
    numGroup.position.y = numeralThickness / 2; // Rest on the floor
    
    // Rotate so the bottom of the numeral points towards the center
    numGroup.rotation.y = -angle;
    
    scene.add(numGroup);
}

// 6. Clock Hands
const handExtrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 };

// Minute Hand (Longer, points to ~1:10)
const minHandGroup = new THREE.Group();
const minBaseGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32);
const minBaseMesh = new THREE.Mesh(minBaseGeom, handMaterial);
minHandGroup.add(minBaseMesh);

const minHandShape = new THREE.Shape();
minHandShape.moveTo(0.3, 0);
minHandShape.lineTo(0.3, 9);
minHandShape.lineTo(1.2, 10.5); // Diamond wide point
minHandShape.lineTo(0, 14);     // Tip
minHandShape.lineTo(-1.2, 10.5);
minHandShape.lineTo(-0.3, 9);
minHandShape.lineTo(-0.3, 0);

const minHandGeom = new THREE.ExtrudeGeometry(minHandShape, handExtrudeSettings);
minHandGeom.rotateX(-Math.PI / 2); // Lay flat on XZ plane
minHandGeom.translate(0, -0.075, 0); // Center vertically with base
const minPointerMesh = new THREE.Mesh(minHandGeom, handMaterial);
minHandGroup.add(minPointerMesh);

minHandGroup.position.y = 0.6;
minHandGroup.rotation.y = -0.6; // Angle for ~1:10
scene.add(minHandGroup);

// Hour Hand (Shorter, points to ~10:10)
const hourHandGroup = new THREE.Group();
const hourBaseGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 32);
const hourBaseMesh = new THREE.Mesh(hourBaseGeom, handMaterial);
hourHandGroup.add(hourBaseMesh);

const hourHandShape = new THREE.Shape();
hourHandShape.moveTo(0.4, 0);
hourHandShape.lineTo(0.4, 5);
hourHandShape.lineTo(1.4, 6.5); // Diamond wide point
hourHandShape.lineTo(0, 9);     // Tip
hourHandShape.lineTo(-1.4, 6.5);
hourHandShape.lineTo(-0.4, 5);
hourHandShape.lineTo(-0.4, 0);

const hourHandGeom = new THREE.ExtrudeGeometry(hourHandShape, handExtrudeSettings);
hourHandGeom.rotateX(-Math.PI / 2);
hourHandGeom.translate(0, -0.075, 0);
const hourPointerMesh = new THREE.Mesh(hourHandGeom, handMaterial);
hourHandGroup.add(hourPointerMesh);

hourHandGroup.position.y = 0.35;
hourHandGroup.rotation.y = 0.9; // Angle for ~10:10
scene.add(hourHandGroup);

// Adjust camera to match the isometric-style perspective in the image
camera.position.set(0, 35, 45);
camera.lookAt(0, 0, 0);