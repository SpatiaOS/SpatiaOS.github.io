// Parameters
const materialColor = 0xb0b5b9;
const metalness = 0.5;
const roughness = 0.4;

const topMountY = 52;
const bottomMountY = -45.5;
const bodyRadius = 12;
const mainCylRadius = 10;
const shaftRadius = 4.5;
const springRadius = 18;
const springWireRadius = 3.5;

// Material
const material = new THREE.MeshStandardMaterial({
    color: materialColor,
    metalness: metalness,
    roughness: roughness,
});

// Group to hold all parts
const shockGroup = new THREE.Group();

// --- Helper Functions ---

// 1. Custom Curve for the Spring
class HelixCurve extends THREE.Curve {
    constructor(radius, height, coils) {
        super();
        this.radius = radius;
        this.height = height;
        this.coils = coils;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const angle = t * Math.PI * 2 * this.coils;
        const y = (0.5 - t) * this.height;
        const x = Math.cos(angle) * this.radius;
        const z = Math.sin(angle) * this.radius;
        return optionalTarget.set(x, y, z);
    }
}

// 2. Eyelet Generator
function createEyelet() {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 6.5, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 3.5, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.5,
        bevelThickness: 0.5,
        curveSegments: 24
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.translate(0, 0, -4); // Center depth
    return new THREE.Mesh(geo, material);
}

// --- Build Components ---

// 1. Top Mount
const topDomeGeo = new THREE.SphereGeometry(bodyRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const topDome = new THREE.Mesh(topDomeGeo, material);
topDome.position.y = topMountY + 8; // 52 + 8 = 60
shockGroup.add(topDome);

const topBodyGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, 16, 32);
const topBody = new THREE.Mesh(topBodyGeo, material);
topBody.position.y = topMountY;
shockGroup.add(topBody);

const leftTopEyelet = createEyelet();
leftTopEyelet.rotation.y = Math.PI / 2;
leftTopEyelet.position.set(-13, topMountY, 0);
shockGroup.add(leftTopEyelet);

const rightTopEyelet = createEyelet();
rightTopEyelet.rotation.y = Math.PI / 2;
rightTopEyelet.position.set(13, topMountY, 0);
shockGroup.add(rightTopEyelet);

// 2. Main Body (Upper Thick Cylinder)
const mainBodyGeo = new THREE.CylinderGeometry(mainCylRadius, mainCylRadius, 49, 32);
const mainBody = new THREE.Mesh(mainBodyGeo, material);
mainBody.position.y = 19.5; // Extends from 44 down to -5
shockGroup.add(mainBody);

// Threads on Main Body
const threadGeo = new THREE.TorusGeometry(mainCylRadius, 0.4, 8, 32);
for (let y = 0; y <= 35; y += 1.5) {
    const thread = new THREE.Mesh(threadGeo, material);
    thread.rotation.x = Math.PI / 2;
    thread.position.y = y;
    shockGroup.add(thread);
}

// 3. Preload Adjuster (Gear and Collar)
const gearShape = new THREE.Shape();
const teeth = 12;
const outerR = 24;
const innerR = 19;
const holeR = mainCylRadius + 0.5;

for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
    const midAngle1 = angle + (nextAngle - angle) * 0.25;
    const midAngle2 = angle + (nextAngle - angle) * 0.75;

    if (i === 0) gearShape.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
    else gearShape.lineTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);

    gearShape.lineTo(Math.cos(midAngle1) * innerR, Math.sin(midAngle1) * innerR);
    gearShape.lineTo(Math.cos(midAngle1) * outerR, Math.sin(midAngle1) * outerR);
    gearShape.lineTo(Math.cos(midAngle2) * outerR, Math.sin(midAngle2) * outerR);
    gearShape.lineTo(Math.cos(midAngle2) * innerR, Math.sin(midAngle2) * innerR);
}
gearShape.closePath();
const gearHole = new THREE.Path();
gearHole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
gearShape.holes.push(gearHole);

const gearGeo = new THREE.ExtrudeGeometry(gearShape, {
    depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.4, bevelThickness: 0.4, curveSegments: 24
});
gearGeo.translate(0, 0, -2.5);
const gear = new THREE.Mesh(gearGeo, material);
gear.rotation.x = Math.PI / 2;
gear.position.y = 38;
shockGroup.add(gear);

const collarGeo = new THREE.CylinderGeometry(16, 16, 4, 32);
const collar = new THREE.Mesh(collarGeo, material);
collar.position.y = 33.5;
shockGroup.add(collar);

// 4. Spring
const springHeight = 67.5;
const springCurve = new HelixCurve(springRadius, springHeight, 6.5);
const springGeo = new THREE.TubeGeometry(springCurve, 250, springWireRadius, 16, false);
const spring = new THREE.Mesh(springGeo, material);
spring.position.y = -2.25; // Center between 31.5 and -36
shockGroup.add(spring);

// Round off spring ends
const endSphereGeo = new THREE.SphereGeometry(springWireRadius, 16, 16);
const topEnd = new THREE.Mesh(endSphereGeo, material);
topEnd.position.copy(springCurve.getPoint(0)).add(spring.position);
shockGroup.add(topEnd);

const bottomEnd = new THREE.Mesh(endSphereGeo, material);
bottomEnd.position.copy(springCurve.getPoint(1)).add(spring.position);
shockGroup.add(bottomEnd);

// 5. Shaft (Lower Thin Cylinder)
const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, 33, 32);
const shaft = new THREE.Mesh(shaftGeo, material);
shaft.position.y = -21.5; // Extends from -5 down to -38
shockGroup.add(shaft);

// 6. Bottom Spring Seat
const seatLipGeo = new THREE.TorusGeometry(23, 1.2, 16, 64);
const seatLip = new THREE.Mesh(seatLipGeo, material);
seatLip.rotation.x = Math.PI / 2;
seatLip.position.y = -36.5;
shockGroup.add(seatLip);

const seatBaseGeo = new THREE.CylinderGeometry(24, 24, 2, 32);
const seatBase = new THREE.Mesh(seatBaseGeo, material);
seatBase.position.y = -37.5;
shockGroup.add(seatBase);

const seatGuideGeo = new THREE.CylinderGeometry(15, 15, 3, 32);
const seatGuide = new THREE.Mesh(seatGuideGeo, material);
seatGuide.position.y = -35;
shockGroup.add(seatGuide);

// 7. Bottom Mount
const bottomBodyGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, 14, 32);
const bottomBody = new THREE.Mesh(bottomBodyGeo, material);
bottomBody.position.y = bottomMountY;
shockGroup.add(bottomBody);

const bottomDomeGeo = new THREE.SphereGeometry(bodyRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const bottomDome = new THREE.Mesh(bottomDomeGeo, material);
bottomDome.position.y = bottomMountY - 7; // -45.5 - 7 = -52.5
shockGroup.add(bottomDome);

const leftBottomEyelet = createEyelet();
leftBottomEyelet.rotation.y = Math.PI / 2;
leftBottomEyelet.position.set(-13, bottomMountY, 0);
shockGroup.add(leftBottomEyelet);

const rightBottomEyelet = createEyelet();
rightBottomEyelet.rotation.y = Math.PI / 2;
rightBottomEyelet.position.set(13, bottomMountY, 0);
shockGroup.add(rightBottomEyelet);

// Add entire assembly to scene
scene.add(shockGroup);

// Adjust camera
camera.position.set(80, 40, 110);
camera.lookAt(0, 0, 0);