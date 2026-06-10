// Parameters for the wall-mounted fan
const baseRadius = 24;
const baseDepth = 12;
const neckRadius = 4.5;

const armLength = 26;
const armRadius = 3.5;

const motorRadius = 13;
const motorHeight = 20;

const grilleRadius = 32;
const grilleDepth = 14;

// Materials
const material = new THREE.MeshStandardMaterial({ 
    color: 0xbdc3c7, // Light industrial gray
    roughness: 0.4, 
    metalness: 0.3 
});

const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2c3e50, 
    roughness: 0.7,
    metalness: 0.1
});

// Main assembly group
const fanGroup = new THREE.Group();
scene.add(fanGroup);

// ==========================================
// 1. Wall Mount Base
// ==========================================
const basePoints = [];
for ( let i = 0; i <= 24; i ++ ) {
    const t = i / 24;
    // Creates a smooth bell-like curve
    const r = neckRadius + (baseRadius - neckRadius) * Math.pow(1 - t, 2.5);
    const d = baseDepth * t;
    basePoints.push( new THREE.Vector2( r, d ) );
}
const baseGeom = new THREE.LatheGeometry(basePoints, 64);
const base = new THREE.Mesh(baseGeom, material);
// Lathe revolves around Y. Rotate to point along +Z.
base.rotation.x = Math.PI / 2; 
fanGroup.add(base);

// Horizontal wire guide passing through the neck
const guideRodGeom = new THREE.CylinderGeometry(0.3, 0.3, 30, 16);
const guideRod = new THREE.Mesh(guideRodGeom, material);
guideRod.rotation.z = Math.PI / 2;
guideRod.position.set(0, 0, baseDepth + 2);
fanGroup.add(guideRod);

// ==========================================
// 2. Extension Arm
// ==========================================
const armGeom = new THREE.CylinderGeometry(armRadius, armRadius * 0.85, armLength, 32);
const arm = new THREE.Mesh(armGeom, material);
arm.rotation.x = Math.PI / 2;
arm.position.set(0, 0, baseDepth + armLength / 2);
fanGroup.add(arm);

// ==========================================
// 3. Hinge Mechanism
// ==========================================
const hingeZ = baseDepth + armLength;

// Bracket attached to the end of the arm
const bracketGeom = new THREE.BoxGeometry(armRadius * 2.2, armRadius * 2.2, 8);
const bracket = new THREE.Mesh(bracketGeom, material);
bracket.position.set(0, 0, hingeZ + 2);
fanGroup.add(bracket);

// Tilt Group allows the fan head to angle downwards
const tiltGroup = new THREE.Group();
tiltGroup.position.set(0, 0, hingeZ + 6);
// Tilt down and away from the wall
tiltGroup.rotation.x = -Math.PI / 3.5; 
fanGroup.add(tiltGroup);

// Hinge bolt
const boltGeom = new THREE.CylinderGeometry(1.5, 1.5, armRadius * 3.5, 16);
const bolt = new THREE.Mesh(boltGeom, material);
bolt.rotation.z = Math.PI / 2;
tiltGroup.add(bolt);

// Hex nut on the bolt
const nutGeom = new THREE.CylinderGeometry(2.2, 2.2, 1, 6);
const nut = new THREE.Mesh(nutGeom, material);
nut.rotation.z = Math.PI / 2;
nut.position.set(armRadius * 1.75 + 0.5, 0, 0);
tiltGroup.add(nut);

// Connector block from hinge to motor
const connectorGeom = new THREE.BoxGeometry(7, 9, 12);
const connector = new THREE.Mesh(connectorGeom, material);
connector.position.set(0, 0, 6); // Spans from z=0 to z=12
tiltGroup.add(connector);

// ==========================================
// 4. Motor Housing
// ==========================================
const motorGroup = new THREE.Group();
// Place motor so its side touches the connector (12 + radius)
motorGroup.position.set(0, 0, 12 + motorRadius);
tiltGroup.add(motorGroup);

const motorGeom = new THREE.CylinderGeometry(motorRadius, motorRadius, motorHeight, 64);
const motor = new THREE.Mesh(motorGeom, material);
motorGroup.add(motor);

// Raised top section
const topRaisedGeom = new THREE.CylinderGeometry(motorRadius * 0.85, motorRadius * 0.85, 2, 32);
const topRaised = new THREE.Mesh(topRaisedGeom, material);
topRaised.position.set(0, motorHeight / 2 + 1, 0);
motorGroup.add(topRaised);

// Vents on top
const ventGroup = new THREE.Group();
const ventGeom = new THREE.BoxGeometry(0.8, 2.2, 16);
for (let i = -7; i <= 7; i++) {
    if (Math.abs(i) < 2) continue; // Space for switch
    const vent = new THREE.Mesh(ventGeom, darkMaterial);
    vent.position.set(i * 1.4, motorHeight / 2 + 0.5, -1);
    
    // Scale length to fit within the circular top
    const maxLen = 2 * Math.sqrt(Math.pow(motorRadius * 0.8, 2) - Math.pow(i * 1.4, 2));
    if (maxLen > 0 && !isNaN(maxLen)) {
        vent.scale.z = maxLen / 16;
        ventGroup.add(vent);
    }
}
motorGroup.add(ventGroup);

// Switch box assembly
const switchBaseGeom = new THREE.BoxGeometry(5, 2.5, 7);
const switchBase = new THREE.Mesh(switchBaseGeom, material);
switchBase.position.set(0, motorHeight / 2 + 1.25, 3);
motorGroup.add(switchBase);

const switchButtonGeom = new THREE.BoxGeometry(1.5, 1, 2.5);
const switchButton = new THREE.Mesh(switchButtonGeom, darkMaterial);
switchButton.position.set(0, motorHeight / 2 + 2.8, 3);
motorGroup.add(switchButton);

// ==========================================
// 5. Fan Grille (Cage)
// ==========================================
const grilleGroup = new THREE.Group();
// Attach to the bottom face of the motor
grilleGroup.position.set(0, -motorHeight / 2, 0);
motorGroup.add(grilleGroup);

// Back concentric rings
for (let i = 1; i <= 4; i++) {
    const r = motorRadius + (grilleRadius - motorRadius) * (i / 4);
    const ringGeom = new THREE.TorusGeometry(r, 0.4, 8, 64);
    const ring = new THREE.Mesh(ringGeom, material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1 - (i * 0.5); // Slight curve backward
    grilleGroup.add(ring);
}

// Front concentric rings
for (let i = 1; i <= 6; i++) {
    const r = 5 + (grilleRadius - 6) * (i / 6);
    const ringGeom = new THREE.TorusGeometry(r, 0.4, 8, 64);
    const ring = new THREE.Mesh(ringGeom, material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -grilleDepth + 1 + Math.pow(1 - i/6, 2) * 2;
    grilleGroup.add(ring);
}

// Outer Rim
const rimGeom = new THREE.TorusGeometry(grilleRadius, 1.2, 16, 64);
const rim = new THREE.Mesh(rimGeom, material);
rim.rotation.x = Math.PI / 2;
rim.position.y = -grilleDepth / 2;
grilleGroup.add(rim);

// Radial cage wires using TubeGeometry
const wirePathPoints = [
    new THREE.Vector3(motorRadius - 1, 0, 0),
    new THREE.Vector3(grilleRadius - 1.5, -2, 0),
    new THREE.Vector3(grilleRadius + 0.5, -grilleDepth / 2, 0),
    new THREE.Vector3(grilleRadius - 1.5, -grilleDepth + 2, 0),
    new THREE.Vector3(3, -grilleDepth + 1, 0)
];
const wireCurve = new THREE.CatmullRomCurve3(wirePathPoints);
const radialWireGeom = new THREE.TubeGeometry(wireCurve, 20, 0.35, 6, false);

const wireCount = 60;
for (let i = 0; i < wireCount; i++) {
    const wire = new THREE.Mesh(radialWireGeom, material);
    wire.rotation.y = (i / wireCount) * Math.PI * 2;
    grilleGroup.add(wire);
}

// Front center cap
const capGeom = new THREE.CylinderGeometry(4.5, 4.5, 1.5, 32);
const cap = new THREE.Mesh(capGeom, material);
cap.position.set(0, -grilleDepth + 1, 0);
grilleGroup.add(cap);

// ==========================================
// 6. Fan Blades
// ==========================================
const bladeGroup = new THREE.Group();
bladeGroup.position.set(0, -grilleDepth / 2, 0);
grilleGroup.add(bladeGroup);

// Rotor hub
const hubGeom = new THREE.CylinderGeometry(4.5, 4.5, 3, 32);
const hub = new THREE.Mesh(hubGeom, material);
bladeGroup.add(hub);

// Blade shape definition
const bladeShape = new THREE.Shape();
bladeShape.moveTo(4, -1.5);
bladeShape.bezierCurveTo(12, -4, grilleRadius * 0.7, -7, grilleRadius - 2.5, -3);
bladeShape.bezierCurveTo(grilleRadius * 0.8, 4, 15, 5, 4, 1.5);
bladeShape.closePath();

const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.15,
    bevelThickness: 0.15
};
const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);

const numBlades = 5;
for (let i = 0; i < numBlades; i++) {
    const blade = new THREE.Mesh(bladeGeom, material);
    
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / numBlades) * Math.PI * 2;
    
    // Pitch and angle the blade for aerodynamics
    blade.rotation.x = -Math.PI / 7; 
    blade.rotation.z = Math.PI / 16;
    blade.position.z = -0.2; 
    
    pivot.add(blade);
    bladeGroup.add(pivot);
}

// ==========================================
// Camera Adjustment
// ==========================================
// Position camera to view the fan from the top-right-front, matching the image composition
camera.position.set(85, 65, 110);
camera.lookAt(0, -15, 35);