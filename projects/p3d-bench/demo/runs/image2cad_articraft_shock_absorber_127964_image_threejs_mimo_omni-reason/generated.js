// ============================================
// Shock Absorber Assembly
// ============================================

// --- Global Parameters ---
const scaleFactor = 1.0;

// Top Mount Parameters
const topMountRadius = 2.0 * scaleFactor;
const topMountHeight = 5.0 * scaleFactor;
const topEyeletRadius = 1.5 * scaleFactor;
const topEyeletLength = 3.5 * scaleFactor;

// Upper Spring Retainer (Star/Gear Shape)
const retainerRadius = 4.5 * scaleFactor;
const retainerHeight = 1.5 * scaleFactor;
const retainerTeeth = 10;
const retainerToothWidth = 0.8 * scaleFactor;
const retainerToothHeight = 1.2 * scaleFactor;

// Coil Spring Parameters
const springCoils = 7;
const springRadius = 4.0 * scaleFactor;
const springWireRadius = 0.6 * scaleFactor;
const springHeight = 14.0 * scaleFactor;

// Damper Body Parameters
const damperBodyRadius = 1.8 * scaleFactor;
const damperBodyHeight = 16.0 * scaleFactor;
const damperRodRadius = 0.8 * scaleFactor;
const damperRodHeight = 10.0 * scaleFactor;

// Lower Spring Seat
const lowerSeatRadius = 4.2 * scaleFactor;
const lowerSeatHeight = 1.0 * scaleFactor;

// Bottom Mount Parameters
const bottomMountRadius = 2.2 * scaleFactor;
const bottomMountHeight = 4.5 * scaleFactor;
const bottomEyeletRadius = 1.5 * scaleFactor;
const bottomEyeletLength = 3.5 * scaleFactor;

// Material
const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x888899,
    metalness: 0.6,
    roughness: 0.35
});

// ============================================
// Helper Functions
// ============================================

function createCylinder(radiusTop, radiusBottom, height, material, segments = 32) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
    return new THREE.Mesh(geometry, material);
}

function createEyelet(radius, length, material, segments = 24) {
    // Horizontal cylinder with rounded ends (capsule-like)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
}

function createStarShape(outerRadius, innerRadius, teeth, height) {
    const shape = new THREE.Shape();
    const angleStep = (Math.PI * 2) / teeth;
    const toothAngle = angleStep * 0.35;
    
    for (let i = 0; i < teeth; i++) {
        const angle = i * angleStep;
        const a1 = angle - toothAngle;
        const a2 = angle + toothAngle;
        
        if (i === 0) {
            shape.moveTo(Math.cos(a1) * innerRadius, Math.sin(a1) * innerRadius);
        }
        shape.lineTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius);
        shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
        shape.lineTo(Math.cos(a2) * innerRadius, Math.sin(a2) * innerRadius);
        
        const nextA1 = (i + 1) * angleStep - toothAngle;
        shape.lineTo(Math.cos(nextA1) * innerRadius, Math.sin(nextA1) * innerRadius);
    }
    shape.closePath();
    
    // Add center hole
    const holePath = new THREE.Path();
    const holeRadius = innerRadius * 0.4;
    holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(holePath);
    
    const extrudeSettings = {
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    return geometry;
}

function createHelix(radius, height, coils, wireRadius) {
    const points = [];
    const segments = coils * 36;
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * coils * Math.PI * 2;
        const y = t * height - height / 2;
        points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius
        ));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, segments * 2, wireRadius, 12, false);
    return geometry;
}

// ============================================
// Assembly Group
// ============================================
const shockAbsorber = new THREE.Group();

// ============================================
// 1. Top Mount Assembly
// ============================================

// Main vertical cylinder of top mount
const topMount = createCylinder(topMountRadius, topMountRadius, topMountHeight, metalMaterial);
topMount.position.y = springHeight / 2 + topMountHeight / 2 + retainerHeight;
shockAbsorber.add(topMount);

// Top eyelet (horizontal bushing mount)
const topEyelet = createEyelet(topEyeletRadius, topEyeletLength, metalMaterial);
topEyelet.position.y = springHeight / 2 + topMountHeight + topEyeletRadius * 0.7;
shockAbsorber.add(topEyelet);

// Top cap detail
const topCap = createCylinder(topMountRadius * 0.7, topMountRadius * 0.9, 0.8, metalMaterial);
topCap.position.y = springHeight / 2 + topMountHeight + 0.4;
shockAbsorber.add(topCap);

// ============================================
// 2. Upper Spring Retainer (Star/Gear Shape)
// ============================================

const retainerGeometry = createStarShape(
    retainerRadius,
    retainerRadius * 0.75,
    retainerTeeth,
    retainerHeight
);
const upperRetainer = new THREE.Mesh(retainerGeometry, metalMaterial);
upperRetainer.rotation.x = Math.PI / 2;
upperRetainer.position.y = springHeight / 2 + retainerHeight / 2;
shockAbsorber.add(upperRetainer);

// ============================================
// 3. Coil Spring
// ============================================

const springGeometry = createHelix(springRadius, springHeight, springCoils, springWireRadius);
const spring = new THREE.Mesh(springGeometry, metalMaterial);
spring.position.y = 0;
shockAbsorber.add(spring);

// ============================================
// 4. Damper Body (Central Cylinder)
// ============================================

// Main damper body cylinder
const damperBody = createCylinder(damperBodyRadius, damperBodyRadius, damperBodyHeight, metalMaterial);
damperBody.position.y = -springHeight / 2 + damperBodyHeight / 2 - 2;
shockAbsorber.add(damperBody);

// Damper rod (extends upward through spring)
const damperRod = createCylinder(damperRodRadius, damperRodRadius, damperRodHeight, metalMaterial);
damperRod.position.y = springHeight / 2 - damperRodHeight / 2 + 2;
shockAbsorber.add(damperRod);

// Rod seal/cap at top of damper body
const rodSeal = createCylinder(damperRodRadius * 1.5, damperRodRadius * 1.5, 0.5, metalMaterial);
rodSeal.position.y = springHeight / 2 - damperRodHeight + 2.25;
shockAbsorber.add(rodSeal);

// ============================================
// 5. Lower Spring Seat
// ============================================

// Main lower seat disc
const lowerSeat = createCylinder(lowerSeatRadius, lowerSeatRadius, lowerSeatHeight, metalMaterial);
lowerSeat.position.y = -springHeight / 2 - lowerSeatHeight / 2;
shockAbsorber.add(lowerSeat);

// Lower seat lip/ring
const lowerSeatRing = createCylinder(lowerSeatRadius + 0.3, lowerSeatRadius + 0.3, 0.3, metalMaterial);
lowerSeatRing.position.y = -springHeight / 2 - lowerSeatHeight - 0.15;
shockAbsorber.add(lowerSeatRing);

// ============================================
// 6. Bottom Mount Assembly
// ============================================

// Main vertical cylinder of bottom mount
const bottomMount = createCylinder(bottomMountRadius, bottomMountRadius, bottomMountHeight, metalMaterial);
bottomMount.position.y = -springHeight / 2 - lowerSeatHeight - bottomMountHeight / 2 - 0.5;
shockAbsorber.add(bottomMount);

// Bottom eyelet (horizontal bushing mount)
const bottomEyelet = createEyelet(bottomEyeletRadius, bottomEyeletLength, metalMaterial);
bottomEyelet.position.y = -springHeight / 2 - lowerSeatHeight - bottomMountHeight - bottomEyeletRadius * 0.7;
shockAbsorber.add(bottomEyelet);

// Bottom transition piece
const bottomTransition = createCylinder(bottomMountRadius * 0.8, damperBodyRadius, 1.5, metalMaterial);
bottomTransition.position.y = -springHeight / 2 - lowerSeatHeight - 0.75;
shockAbsorber.add(bottomTransition);

// ============================================
// Add to Scene
// ============================================
scene.add(shockAbsorber);

// Center and adjust camera
const totalAssemblyHeight = topMountHeight + springHeight + bottomMountHeight + 6;
camera.position.set(totalAssemblyHeight * 0.8, totalAssemblyHeight * 0.3, totalAssemblyHeight * 0.8);
camera.lookAt(0, 0, 0);