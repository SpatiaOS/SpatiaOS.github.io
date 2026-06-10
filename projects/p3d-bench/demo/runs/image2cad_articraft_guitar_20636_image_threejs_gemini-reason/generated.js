// Parameters for the guitar model
const scale = 1;
const bodyThickness = 2.5;
const neckLength = 30;
const neckWidth = 3.5;
const stringCount = 6;

// Materials
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.3, metalness: 0.2 });
const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8, metalness: 0.0 });
const hardwareMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.2, metalness: 0.8 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
const pickguardMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3 });
const stringMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.1, metalness: 1.0 });

// Main Group
const guitarGroup = new THREE.Group();

// 1. Guitar Body (Double Cutaway Hollow-body style)
const bodyShape = new THREE.Shape();
bodyShape.moveTo(0, -20);
// Right half
bodyShape.bezierCurveTo(12, -20, 17, -15, 17, -7);     // Lower bout
bodyShape.bezierCurveTo(17, -1, 11, -1, 11, 3);        // Waist
bodyShape.bezierCurveTo(11, 8, 14, 10, 14, 14);        // Upper bout
bodyShape.bezierCurveTo(14, 17, 11, 18, 9, 16);        // Cutaway horn
bodyShape.bezierCurveTo(7.5, 14.5, 6, 14, 3, 18);      // Dip to neck joint
bodyShape.lineTo(-3, 18);                              // Neck joint
// Left half (mirrored)
bodyShape.bezierCurveTo(-6, 14, -7.5, 14.5, -9, 16);
bodyShape.bezierCurveTo(-11, 18, -14, 17, -14, 14);
bodyShape.bezierCurveTo(-14, 10, -11, 8, -11, 3);
bodyShape.bezierCurveTo(-11, -1, -17, -1, -17, -7);
bodyShape.bezierCurveTo(-17, -15, -12, -20, 0, -20);

const bodyExtrudeSettings = {
    depth: bodyThickness,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.5,
    bevelThickness: 0.5
};
const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
bodyMesh.position.z = -bodyThickness; // Surface flush with Z=0
guitarGroup.add(bodyMesh);

// 2. F-Holes (Simulated with black inset geometries for clean rendering)
class FHoleCurve extends THREE.Curve {
    constructor() { super(); }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const ty = (0.5 - t) * 10;
        const tx = Math.sin(t * Math.PI * 1.5) * 1.2;
        return optionalTarget.set(tx, ty, 0);
    }
}

function createFHole(x, y, isLeft) {
    const fGroup = new THREE.Group();
    fGroup.position.set(x, y, 0.05); // Slightly above body to prevent z-fighting
    if (!isLeft) fGroup.scale.x = -1;

    // Main slit
    const fHoleTubeGeo = new THREE.TubeGeometry(new FHoleCurve(), 32, 0.25, 8, false);
    const tube = new THREE.Mesh(fHoleTubeGeo, blackMat);
    tube.scale.z = 0.1; // Flatten
    fGroup.add(tube);

    // End circles
    const topCircle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16), blackMat);
    topCircle.position.set(-1.2, 5, 0);
    topCircle.rotation.x = Math.PI / 2;
    fGroup.add(topCircle);

    const botCircle = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 16), blackMat);
    botCircle.position.set(1.2, -5, 0);
    botCircle.rotation.x = Math.PI / 2;
    fGroup.add(botCircle);

    return fGroup;
}
guitarGroup.add(createFHole(-8.5, 3, true));
guitarGroup.add(createFHole(8.5, 3, false));

// 3. Neck and Fretboard
const neckGeo = new THREE.BoxGeometry(neckWidth, neckLength, 1.5);
const neckMesh = new THREE.Mesh(neckGeo, bodyMat);
neckMesh.position.set(0, 18 + neckLength / 2, -0.75);
guitarGroup.add(neckMesh);

const fretboardGeo = new THREE.BoxGeometry(neckWidth + 0.2, neckLength, 0.3);
const fretboardMesh = new THREE.Mesh(fretboardGeo, darkWoodMat);
fretboardMesh.position.set(0, 18 + neckLength / 2, 0.15);
guitarGroup.add(fretboardMesh);

// Frets
const fretGeo = new THREE.BoxGeometry(neckWidth + 0.2, 0.1, 0.1);
for (let i = 0; i < 22; i++) {
    const fret = new THREE.Mesh(fretGeo, hardwareMat);
    const t = i / 21;
    const yPos = 18 + neckLength - Math.pow(t, 0.8) * (neckLength - 2);
    fret.position.set(0, yPos, 0.3);
    guitarGroup.add(fret);
}

// 4. Headstock
const headGroup = new THREE.Group();
headGroup.position.set(0, 18 + neckLength, 0);
headGroup.rotation.x = -0.15; // Angled back

const headShape = new THREE.Shape();
headShape.moveTo(-1.8, 0);
headShape.lineTo(1.8, 0);
headShape.lineTo(2.8, 5);
headShape.lineTo(2.2, 11);
headShape.lineTo(1.0, 13);
headShape.lineTo(0, 12);
headShape.lineTo(-1.0, 13);
headShape.lineTo(-2.2, 11);
headShape.lineTo(-2.8, 5);
headShape.lineTo(-1.8, 0);

const headGeo = new THREE.ExtrudeGeometry(headShape, { depth: 1.2, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
const headMesh = new THREE.Mesh(headGeo, bodyMat);
headMesh.position.set(0, 0, -1.2);
headGroup.add(headMesh);

// Tuning Pegs
const pegGeo = new THREE.CylinderGeometry(0.25, 0.25, 2, 16);
const buttonGeo = new THREE.BoxGeometry(0.8, 1.2, 0.4);
const pegYs = [3, 6.5, 10];

pegYs.forEach(y => {
    // Left side
    const pegL = new THREE.Mesh(pegGeo, hardwareMat);
    pegL.position.set(-2.5, y, -0.6);
    pegL.rotation.z = Math.PI / 2;
    headGroup.add(pegL);
    
    const btnL = new THREE.Mesh(buttonGeo, hardwareMat);
    btnL.position.set(-3.5, y, -0.6);
    headGroup.add(btnL);

    // Right side
    const pegR = new THREE.Mesh(pegGeo, hardwareMat);
    pegR.position.set(2.5, y, -0.6);
    pegR.rotation.z = Math.PI / 2;
    headGroup.add(pegR);
    
    const btnR = new THREE.Mesh(buttonGeo, hardwareMat);
    btnR.position.set(3.5, y, -0.6);
    headGroup.add(btnR);
});
guitarGroup.add(headGroup);

// 5. Hardware (Pickups, Bridge, Tailpiece)
// Humbucker Pickups
const pickupGeo = new THREE.BoxGeometry(7, 3.5, 1.2);
const pickup1 = new THREE.Mesh(pickupGeo, hardwareMat);
pickup1.position.set(0, 14, 0.6);
guitarGroup.add(pickup1);

const pickup2 = new THREE.Mesh(pickupGeo, hardwareMat);
pickup2.position.set(0, 6, 0.6);
guitarGroup.add(pickup2);

// Bridge
const bridgeGeo = new THREE.BoxGeometry(8, 1.2, 1.2);
const bridge = new THREE.Mesh(bridgeGeo, hardwareMat);
bridge.position.set(0, 1, 0.6);
guitarGroup.add(bridge);

// Tailpiece
const tailGeo = new THREE.BoxGeometry(7, 1.5, 1.0);
const tail = new THREE.Mesh(tailGeo, hardwareMat);
tail.position.set(0, -6, 0.5);
guitarGroup.add(tail);

// Tailpiece Studs
const studGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5);
const stud1 = new THREE.Mesh(studGeo, hardwareMat);
stud1.position.set(-3.5, -6, 0.5);
stud1.rotation.x = Math.PI / 2;
guitarGroup.add(stud1);
const stud2 = stud1.clone();
stud2.position.set(3.5, -6, 0.5);
guitarGroup.add(stud2);

// 6. Pickguard
const pgShape = new THREE.Shape();
pgShape.moveTo(3.5, 16);
pgShape.lineTo(8, 15);
pgShape.bezierCurveTo(10, 10, 11, 5, 9, 0);
pgShape.lineTo(4, 0);
pgShape.bezierCurveTo(6, 6, 6, 12, 3.5, 16);

const pgGeo = new THREE.ExtrudeGeometry(pgShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
const pickguard = new THREE.Mesh(pgGeo, pickguardMat);
pickguard.position.set(0, 0, 0.8);
guitarGroup.add(pickguard);

// 7. Knobs & Switch
const knobGeo = new THREE.CylinderGeometry(0.7, 0.8, 1.0, 16);
const knobPositions = [ [7, -10], [11, -9], [8, -14], [12, -13] ];
knobPositions.forEach(pos => {
    const knob = new THREE.Mesh(knobGeo, blackMat);
    knob.position.set(pos[0], pos[1], 0.5);
    knob.rotation.x = Math.PI / 2;
    guitarGroup.add(knob);
});

// Toggle Switch
const switchBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16), hardwareMat);
switchBase.position.set(-9, 12, 0.1);
switchBase.rotation.x = Math.PI / 2;
guitarGroup.add(switchBase);

const switchStick = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2), hardwareMat);
switchStick.position.set(-9, 12, 0.7);
switchStick.rotation.x = Math.PI / 2 + 0.2;
guitarGroup.add(switchStick);

// 8. Strings
const stringLength = 54;
const stringCylGeo = new THREE.CylinderGeometry(0.03, 0.03, stringLength);
for(let i = 0; i < stringCount; i++) {
    const string = new THREE.Mesh(stringCylGeo, stringMat);
    const xPos = -1.5 + i * 0.6;
    // Position strings from tailpiece (y=-6) to headstock (y=48)
    string.position.set(xPos, 21, 1.25);
    guitarGroup.add(string);
}

// Add entire guitar to scene
guitarGroup.rotation.x = -Math.PI / 2;
guitarGroup.rotation.z = Math.PI / 6;
scene.add(guitarGroup);

// Adjust camera
camera.position.set(40, 45, 55);
camera.lookAt(0, 0, 0);