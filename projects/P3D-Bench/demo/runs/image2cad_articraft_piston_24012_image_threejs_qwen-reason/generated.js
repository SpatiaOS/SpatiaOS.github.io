// Parameters
const pistonRadius = 4.0;
const pistonHeight = 5.0;
const pistonPinOffset = -1.0; // Y offset of wrist pin relative to piston center
const pinRadius = 1.2;
const pinLength = 7.5; // Width of the wrist pin boss

const rodLength = 16.0;
const rodSmallEndRadius = 2.0;
const rodBigEndRadius = 3.5;
const rodBigEndThickness = 2.0;

// Material - Metallic Grey
const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.8,
    roughness: 0.3
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.5,
    roughness: 0.8
});

// --- PISTON ASSEMBLY ---
const pistonGroup = new THREE.Group();

// 1. Piston Skirt (Main Body)
const skirtGeo = new THREE.CylinderGeometry(pistonRadius, pistonRadius, pistonHeight, 32);
const skirt = new THREE.Mesh(skirtGeo, metalMaterial);
pistonGroup.add(skirt);

// 2. Piston Crown (Top)
// Slightly tapered or stepped top
const crownGeo = new THREE.CylinderGeometry(pistonRadius, pistonRadius * 0.95, 1.5, 32);
const crown = new THREE.Mesh(crownGeo, metalMaterial);
crown.position.y = pistonHeight / 2 + 0.5;
pistonGroup.add(crown);

// 3. Valve Pocket / Top Feature
// A circular feature on the top center
const pocketGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
const pocket = new THREE.Mesh(pocketGeo, metalMaterial);
pocket.position.y = pistonHeight / 2 + 1.5;
pistonGroup.add(pocket);

// 4. Piston Rings (Grooves)
// Simulated by stacking slightly smaller cylinders
const ringYStart = pistonHeight / 2 - 0.5;
const ringCount = 3;
for (let i = 0; i < ringCount; i++) {
    // Groove
    const grooveGeo = new THREE.CylinderGeometry(pistonRadius - 0.15, pistonRadius - 0.15, 0.25, 32);
    const groove = new THREE.Mesh(grooveGeo, metalMaterial);
    groove.position.y = ringYStart - (i * 0.45);
    pistonGroup.add(groove);
    
    // Ring land (the raised part between grooves) - implicit in the main skirt, 
    // but we can add a thin ring to emphasize the separation if needed. 
    // The groove simulation is sufficient for this level of detail.
}

// 5. Wrist Pin Boss
// Cylinder protruding from the side (along X axis)
const bossGeo = new THREE.CylinderGeometry(1.8, 1.8, pinLength, 16);
const boss = new THREE.Mesh(bossGeo, metalMaterial);
boss.rotation.z = Math.PI / 2; // Rotate to align with X axis
boss.position.y = pistonPinOffset;
pistonGroup.add(boss);

// 6. Wrist Pin Hole (Visual representation)
const pinHoleGeo = new THREE.CylinderGeometry(pinRadius, pinRadius, pinLength + 0.2, 16);
const pinHole = new THREE.Mesh(pinHoleGeo, darkMaterial);
pinHole.rotation.z = Math.PI / 2;
pinHole.position.y = pistonPinOffset;
pistonGroup.add(pinHole);

// Position Piston
pistonGroup.position.y = 10;
scene.add(pistonGroup);


// --- CONNECTING ROD ASSEMBLY ---
const rodGroup = new THREE.Group();

// 1. Small End (Top of rod)
// Connects to the wrist pin. Cylinder along X axis.
const smallEndGeo = new THREE.CylinderGeometry(rodSmallEndRadius, rodSmallEndRadius, 2.5, 32);
const smallEnd = new THREE.Mesh(smallEndGeo, metalMaterial);
smallEnd.rotation.z = Math.PI / 2;
smallEnd.position.y = rodLength / 2 - 1; // Position at top of rod
rodGroup.add(smallEnd);

// 2. Connecting Rod Shank (I-Beam)
// We use ExtrudeGeometry to create an I-beam profile.
const shankShape = new THREE.Shape();
const w = 2.2; // Flange width
const h = 3.2; // Total height of I-profile
const t = 0.5; // Thickness of web and flanges

// Draw I-Beam cross section (in local XY plane)
shankShape.moveTo(-w/2, -h/2);
shankShape.lineTo(w/2, -h/2);
shankShape.lineTo(w/2, -h/2 + t);
shankShape.lineTo(t/2, -h/2 + t);
shankShape.lineTo(t/2, h/2 - t);
shankShape.lineTo(w/2, h/2 - t);
shankShape.lineTo(w/2, h/2);
shankShape.lineTo(-w/2, h/2);
shankShape.lineTo(-w/2, h/2 - t);
shankShape.lineTo(-t/2, h/2 - t);
shankShape.lineTo(-t/2, -h/2 + t);
shankShape.lineTo(-w/2, -h/2 + t);
shankShape.lineTo(-w/2, -h/2);

const extrudeSettings = { steps: 1, depth: rodLength - 5, bevelEnabled: false };
const shankGeo = new THREE.ExtrudeGeometry(shankShape, extrudeSettings);
const shank = new THREE.Mesh(shankGeo, metalMaterial);

// Orientation:
// ExtrudeGeometry extrudes along +Z.
// We want the rod to go down (-Y).
// Rotate X by 90 deg: XY plane becomes XZ plane (vertical cross section? No).
// Let's visualize:
// Original: Shape in XY. Extrusion +Z.
// Rotate X 90 deg: Shape in XZ. Extrusion +Y.
// We want Extrusion -Y. So Rotate X -90 deg?
// Rotate X -90 deg: Y becomes -Z. Z becomes Y.
// So Extrusion (Z) becomes Y (Up).
// We want Down.
// Let's just Rotate X 90 deg (Extrusion becomes Y-up) and then flip or position accordingly.
// Actually, simpler:
// Rotate X = Math.PI / 2. Shape is in XZ plane. Extrusion is along +Y.
// We want the shank to go from Small End (Top) to Big End (Bottom).
// So we place the shank such that its +Y extrusion goes UP towards the small end?
// Or we place it and rotate 180?
// Let's try: Rotate X = Math.PI / 2. Extrusion is +Y (Up).
// So the shank grows upwards.
// We want it to grow downwards from the small end.
// So we position the base of the shank at the bottom and let it grow up to the small end.
shank.rotation.x = Math.PI / 2; 
shank.position.y = -rodLength / 2 + 2; // Base of shank
rodGroup.add(shank);

// 3. Big End (Bottom)
// A thick ring (Torus) in the X-Y plane (vertical ring).
// This assumes the crankshaft axis is Z (perpendicular to wrist pin X).
const bigEndGeo = new THREE.TorusGeometry(rodBigEndRadius, 0.9, 16, 32);
const bigEnd = new THREE.Mesh(bigEndGeo, metalMaterial);
bigEnd.position.y = -rodLength / 2 + 1;
rodGroup.add(bigEnd);

// 4. Big End Cap
// The bottom part of the big end assembly.
const capGeo = new THREE.BoxGeometry(rodBigEndRadius * 2 + 1, 1.5, 2.5);
const cap = new THREE.Mesh(capGeo, metalMaterial);
cap.position.y = -rodLength / 2 - rodBigEndRadius + 0.5;
rodGroup.add(cap);

// 5. Bolts
// Hexagonal bolts securing the cap.
const boltShaftGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.5, 6);
const boltHeadGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 6);

const boltYBase = -rodLength / 2 - 0.5;
const boltXOffset = rodBigEndRadius - 0.5;

// Left Bolt
const boltL_Shaft = new THREE.Mesh(boltShaftGeo, metalMaterial);
boltL_Shaft.position.set(-boltXOffset, boltYBase, 0);
rodGroup.add(boltL_Shaft);

const boltL_Head = new THREE.Mesh(boltHeadGeo, metalMaterial);
boltL_Head.position.set(-boltXOffset, boltYBase + 1.5, 0);
rodGroup.add(boltL_Head);

// Right Bolt
const boltR_Shaft = new THREE.Mesh(boltShaftGeo, metalMaterial);
boltR_Shaft.position.set(boltXOffset, boltYBase, 0);
rodGroup.add(boltR_Shaft);

const boltR_Head = new THREE.Mesh(boltHeadGeo, metalMaterial);
boltR_Head.position.set(boltXOffset, boltYBase + 1.5, 0);
rodGroup.add(boltR_Head);

// Position Rod Group
// Align Small End with Piston Wrist Pin Boss
// Piston Boss World Y = 10 + pistonPinOffset = 9.
// Rod Small End Local Y = rodLength/2 - 1 = 7.
// We need: RodGroup.y + 7 = 9  => RodGroup.y = 2.
rodGroup.position.y = 2;
scene.add(rodGroup);

// Adjust Camera
camera.position.set(15, 10, 25);
camera.lookAt(0, 2, 0);