// Parameters
const baseRadius = 10;
const baseHeight = 1.0;
const faceRadius = 9;
const faceHeight = 0.8;
const numeralRadius = 7;
const hubRadius = 1.5;
const hubHeight = 0.2;
const pinRadius = 0.4;
const pinHeight = 0.1;

// Material
const material = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.1 });

// 1. Base Cylinder (Outer Rim)
// Top surface is at y = 0.5
const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 64);
const baseMesh = new THREE.Mesh(baseGeo, material);
baseMesh.position.y = 0;
scene.add(baseMesh);

// 2. Face Plate (Recessed Area)
// Top surface is at y = 0.4 (creating a 0.1 step down from rim)
const faceGeo = new THREE.CylinderGeometry(faceRadius, faceRadius, faceHeight, 64);
const faceMesh = new THREE.Mesh(faceGeo, material);
faceMesh.position.y = 0;
scene.add(faceMesh);

// 3. Numerals
// Helper to create a single bar mesh
function createBar(w, h, d) {
    const geo = new THREE.BoxGeometry(w, h, d);
    return new THREE.Mesh(geo, material);
}

// Helper to build a Roman Numeral Group
// Local coordinates: X is tangential, Z is radial (positive Z is away from clock center)
function buildNumeral(type) {
    const group = new THREE.Group();
    const barW = 0.25;
    const barH = 0.15;
    const barL = 1.0;

    function addBox(x, z, rotY, length = barL) {
        const mesh = createBar(barW, barH, length);
        mesh.position.set(x, 0, z);
        mesh.rotation.y = rotY;
        group.add(mesh);
    }

    // V Shape: Two bars meeting at the bottom (towards -Z)
    function addVShape(centerX, centerZ) {
        // Left leg
        const m1 = createBar(barW, barH, barL);
        m1.position.set(centerX - 0.35, 0, centerZ + 0.2);
        m1.rotation.y = Math.PI / 6; // ~30 degrees
        group.add(m1);
        // Right leg
        const m2 = createBar(barW, barH, barL);
        m2.position.set(centerX + 0.35, 0, centerZ + 0.2);
        m2.rotation.y = -Math.PI / 6;
        group.add(m2);
    }

    // X Shape: Two crossing bars
    function addXShape(centerX, centerZ) {
        const m1 = createBar(barW, barH, barL * 1.2);
        m1.position.set(centerX, 0, centerZ);
        m1.rotation.y = Math.PI / 4;
        group.add(m1);
        
        const m2 = createBar(barW, barH, barL * 1.2);
        m2.position.set(centerX, 0, centerZ);
        m2.rotation.y = -Math.PI / 4;
        group.add(m2);
    }

    if (type === 'I') {
        addBox(0, 0, 0);
    } else if (type === 'II') {
        addBox(-0.35, 0, 0);
        addBox(0.35, 0, 0);
    } else if (type === 'III') {
        addBox(-0.6, 0, 0);
        addBox(0, 0, 0);
        addBox(0.6, 0, 0);
    } else if (type === 'IV') {
        addBox(-0.6, 0, 0); // I
        addVShape(0.4, 0);  // V
    } else if (type === 'V') {
        addVShape(0, 0);
    } else if (type === 'VI') {
        addVShape(-0.4, 0);
        addBox(0.5, 0, 0);
    } else if (type === 'VII') {
        addVShape(-0.5, 0);
        addBox(0.4, 0, 0);
        addBox(0.9, 0, 0);
    } else if (type === 'VIII') {
        addVShape(-0.6, 0);
        addBox(0.3, 0, 0);
        addBox(0.8, 0, 0);
        addBox(1.3, 0, 0);
    } else if (type === 'IX') {
        addBox(-0.7, 0, 0); // I
        addXShape(0.3, 0);  // X
    } else if (type === 'X') {
        addXShape(0, 0);
    } else if (type === 'XI') {
        addXShape(-0.4, 0);
        addBox(0.5, 0, 0);
    } else if (type === 'XII') {
        addXShape(-0.5, 0);
        addBox(0.4, 0, 0);
        addBox(0.9, 0, 0);
    }

    return group;
}

// Place Numerals
const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
for (let i = 0; i < 12; i++) {
    // Angle: 0 is at 3 o'clock (X axis). We want 12 at -Z (or +Z depending on coord system).
    // Let's assume standard clock: 12 is top (-Z), 3 is right (+X), 6 is bottom (+Z), 9 is left (-X).
    // Angle in radians: Start at -PI/2 (top) and go clockwise.
    // i=0 (XII) -> angle = -PI/2
    // i=1 (I)   -> angle = -PI/2 + PI/6
    const angle = -Math.PI / 2 + (i * Math.PI / 6);
    
    const numeralGroup = buildNumeral(romanNumerals[i]);
    
    // Position on the circle
    const x = Math.cos(angle) * numeralRadius;
    const z = Math.sin(angle) * numeralRadius;
    
    numeralGroup.position.set(x, faceHeight / 2 + 0.05, z); // Sit on top of face plate (y=0.4)
    
    // Rotate numeral to face center (or outward)
    // In local space, +Z is "up" (away from center).
    // We want +Z to point away from clock center.
    // The angle of the position vector is `angle`.
    // So we rotate the group by `angle` around Y.
    numeralGroup.rotation.y = -angle; // Wait, if angle is position angle...
    // If position is (cos a, sin a), the vector points at angle a.
    // We want local +Z to align with this vector.
    // Local +Z is (0, 0, 1). Rotated by `a` around Y becomes (sin a, 0, cos a)?
    // Standard rotation matrix for Y:
    // x' = x cos - z sin
    // z' = x sin + z cos
    // If local point is (0,0,1) -> x'= -sin(a), z'= cos(a).
    // We want x = cos(angle_pos), z = sin(angle_pos).
    // This implies we need to rotate by (angle_pos - PI/2).
    
    // Let's just use lookAt or simple logic.
    // Position is at angle `theta` from X axis.
    // We want the numeral to point radially outward.
    // So rotate Y by `theta`.
    // But my local +Z is "up".
    // If I rotate by `theta`, local +Z (0,0,1) becomes (-sin theta, 0, cos theta).
    // My position is (cos theta, 0, sin theta).
    // These are 90 degrees off.
    // So I need to rotate by `theta - PI/2`.
    
    numeralGroup.rotation.y = angle - Math.PI / 2;
    
    scene.add(numeralGroup);
}

// 4. Center Hub
const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, hubHeight, 32);
const hubMesh = new THREE.Mesh(hubGeo, material);
hubMesh.position.y = faceHeight / 2 + hubHeight / 2; // 0.4 + 0.1 = 0.5
scene.add(hubMesh);

const pinGeo = new THREE.CylinderGeometry(pinRadius, pinRadius, pinHeight, 16);
const pinMesh = new THREE.Mesh(pinGeo, material);
pinMesh.position.y = faceHeight / 2 + hubHeight + pinHeight / 2; // 0.4 + 0.2 + 0.05 = 0.65
scene.add(pinMesh);

// 5. Hands
// Time: 10:10
// Hour hand: 10 + 10/60 = 10.166 hours.
// Angle: 10.166 * 30 degrees = 305 degrees. (From 12 o'clock clockwise).
// In radians from -Z (12 o'clock):
// 12 is 0 deg. 3 is 90 deg.
// 10 is 300 deg (or -60 deg).
// 10.166 is 305 deg.
// Standard math angle (from +X, CCW):
// 12 o'clock is 90 deg (PI/2).
// 10 o'clock is 150 deg (5PI/6).
// 10:10 is 150 - (10/60)*30 = 150 - 5 = 145 deg.
const hourAngle = (145 * Math.PI) / 180;

// Minute hand: 10 minutes.
// 10 min is at 2 o'clock.
// 2 o'clock is 60 deg from 12.
// Standard math angle: 90 - 60 = 30 deg (PI/6).
const minuteAngle = (30 * Math.PI) / 180;

function createHand(length, width, angle) {
    const group = new THREE.Group();
    // Geometry centered at (0, length/2, 0) so pivot is at (0,0,0)
    const geo = new THREE.BoxGeometry(width, 0.05, length);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = length / 2; // Shift up so bottom is at 0
    // Actually, hands lie flat on XZ plane usually.
    // Let's make them lie on XZ plane.
    // BoxGeometry(w, h, d).
    // w = width (tangential), h = thickness (y), d = length (radial).
    // Pivot at one end.
    // So center of box is at (0, 0, length/2).
    
    const handGeo = new THREE.BoxGeometry(width, 0.05, length);
    const handMesh = new THREE.Mesh(handGeo, material);
    handMesh.position.set(0, 0.05, length / 2); // Lift slightly above pin
    
    group.add(handMesh);
    group.rotation.y = -angle; // Rotate to position. 
    // Wait, standard rotation:
    // If angle is 0 (3 o'clock, +X), we want hand along +X.
    // My box is along +Z.
    // So I need to rotate -90 deg (or +270) to align +Z with +X.
    // Then add the clock angle.
    
    // Let's simplify:
    // Hand points along +Z in local space.
    // We want it to point at `clockAngle` (from 12 o'clock clockwise).
    // 12 o'clock is -Z.
    // So we want local +Z to point at `clockAngle` from -Z.
    // This is confusing.
    
    // Let's use the angles calculated in standard math (from +X, CCW).
    // hourAngle = 145 deg.
    // We want the hand to point in that direction.
    // My box points along +Z (90 deg).
    // So I need to rotate by (targetAngle - 90 deg).
    
    group.rotation.y = -(angle - Math.PI / 2); 
    // Wait, rotation.y is clockwise?
    // Three.js Y rotation is counter-clockwise looking from top? No, standard right hand rule.
    // Thumb up (Y), fingers curl X to Z.
    // So positive rotation moves +X towards +Z.
    // +X is 0 deg. +Z is 90 deg.
    // So positive rotation adds angle.
    // My box is at +Z (90 deg).
    // I want it at `angle`.
    // So rotation = angle - 90 deg.
    
    group.rotation.y = angle - Math.PI / 2;
    
    // Position at center
    group.position.y = pinMesh.position.y + pinHeight / 2;
    return group;
}

// Hour Hand (Shorter)
const hourHand = createHand(4.5, 0.3, hourAngle);
scene.add(hourHand);

// Minute Hand (Longer)
const minuteHand = createHand(7.0, 0.2, minuteAngle);
scene.add(minuteHand);

// Adjust Camera
camera.position.set(15, 15, 15);
camera.lookAt(0, 0, 0);