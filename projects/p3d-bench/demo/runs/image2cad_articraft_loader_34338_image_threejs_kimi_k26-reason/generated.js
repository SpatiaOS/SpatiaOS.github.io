// ==========================================
// Wheel Loader Parameters
// ==========================================
const params = {
    // Dimensions
    wheelRadius: 2.2,
    wheelWidth: 1.4,
    trackWidth: 3.2,      // half-distance between wheel centers (X)
    wheelBaseFront: 3.0,  // Z position of front axle
    wheelBaseRear: -3.0,  // Z position of rear axle

    chassisWidth: 5.0,
    chassisHeight: 2.5,
    chassisLength: 8.0,
    chassisY: 3.5,

    cabWidth: 3.5,
    cabHeight: 3.5,
    cabLength: 3.0,
    cabY: 6.5,
    cabZ: -0.5,

    bucketWidth: 8.0,
    bucketHeight: 3.0,
    bucketDepth: 3.0,
    bucketY: 2.0,
    bucketZ: 6.0,

    // Colors
    bodyColor: 0xcccccc,
    tireColor: 0x333333,
    rimColor: 0x888888,
    glassColor: 0x222222,
    metalColor: 0x555555,
};

// ==========================================
// Materials
// ==========================================
const bodyMat = new THREE.MeshStandardMaterial({ color: params.bodyColor, roughness: 0.4, metalness: 0.3 });
const tireMat = new THREE.MeshStandardMaterial({ color: params.tireColor, roughness: 0.9 });
const rimMat = new THREE.MeshStandardMaterial({ color: params.rimColor, roughness: 0.3, metalness: 0.6 });
const glassMat = new THREE.MeshStandardMaterial({ color: params.glassColor, roughness: 0.1, metalness: 0.8 });
const metalMat = new THREE.MeshStandardMaterial({ color: params.metalColor, roughness: 0.5, metalness: 0.5 });

// ==========================================
// Helper: Create a treaded wheel
// ==========================================
function createWheel(radius, width) {
    const group = new THREE.Group();

    // Tire
    const tireGeom = new THREE.CylinderGeometry(radius, radius, width, 24);
    const tire = new THREE.Mesh(tireGeom, tireMat);
    tire.rotation.z = Math.PI / 2;
    group.add(tire);

    // Rim
    const rimGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width * 1.02, 24);
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.rotation.z = Math.PI / 2;
    group.add(rim);

    // Hub
    const hubGeom = new THREE.CylinderGeometry(radius * 0.15, radius * 0.15, width * 1.06, 16);
    const hub = new THREE.Mesh(hubGeom, bodyMat);
    hub.rotation.z = Math.PI / 2;
    group.add(hub);

    // Tread blocks arranged around circumference
    const treadCount = 16;
    const treadGeom = new THREE.BoxGeometry(width * 0.85, radius * 0.22, radius * 0.2);
    for (let i = 0; i < treadCount; i++) {
        const angle = (i / treadCount) * Math.PI * 2;
        const tread = new THREE.Mesh(treadGeom, tireMat);
        tread.position.set(0, Math.sin(angle) * radius, Math.cos(angle) * radius);
        tread.rotation.x = -angle;
        group.add(tread);
    }

    return group;
}

// ==========================================
// Helper: Create an arm between two points
// ==========================================
function createArm(p1, p2, thickness) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geom = new THREE.BoxGeometry(thickness, len, thickness * 0.6);
    const mesh = new THREE.Mesh(geom, bodyMat);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return mesh;
}

// ==========================================
// Chassis & Rear Engine Deck
// ==========================================
const chassisGeom = new THREE.BoxGeometry(params.chassisWidth, params.chassisHeight, params.chassisLength);
const chassis = new THREE.Mesh(chassisGeom, bodyMat);
chassis.position.set(0, params.chassisY, 0);
scene.add(chassis);

// Engine deck behind cab
const engineLength = 3.0;
const engineGeom = new THREE.BoxGeometry(params.chassisWidth, 2.0, engineLength);
const engine = new THREE.Mesh(engineGeom, bodyMat);
engine.position.set(0, params.chassisY + 0.5, -params.chassisLength / 2 + engineLength / 2 - 0.5);
scene.add(engine);

// Exhaust pipe on engine deck
const exhaustGeom = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16);
const exhaust = new THREE.Mesh(exhaustGeom, bodyMat);
exhaust.position.set(2.0, params.chassisY + 2.0, -params.chassisLength / 2 + engineLength / 2 - 0.5);
scene.add(exhaust);

// Rear grill
const grillGeom = new THREE.BoxGeometry(params.chassisWidth - 0.5, 1.5, 0.1);
const grill = new THREE.Mesh(grillGeom, metalMat);
grill.position.set(0, params.chassisY + 0.5, -params.chassisLength / 2 - 0.05);
scene.add(grill);

// ==========================================
// Operator Cab
// ==========================================
const cabGeom = new THREE.BoxGeometry(params.cabWidth, params.cabHeight, params.cabLength);
const cab = new THREE.Mesh(cabGeom, bodyMat);
cab.position.set(0, params.cabY, params.cabZ);
scene.add(cab);

// Roof overhang
const roofGeom = new THREE.BoxGeometry(params.cabWidth + 0.4, 0.3, params.cabLength + 0.4);
const roof = new THREE.Mesh(roofGeom, bodyMat);
roof.position.set(0, params.cabY + params.cabHeight / 2 + 0.15, params.cabZ);
scene.add(roof);

// Windows
const winFront = new THREE.Mesh(new THREE.BoxGeometry(params.cabWidth - 0.4, params.cabHeight - 0.6, 0.1), glassMat);
winFront.position.set(0, params.cabY, params.cabZ + params.cabLength / 2 + 0.01);
scene.add(winFront);

const winSideGeom = new THREE.BoxGeometry(0.1, params.cabHeight - 0.6, params.cabLength - 0.4);
const winLeft = new THREE.Mesh(winSideGeom, glassMat);
winLeft.position.set(params.cabWidth / 2 + 0.01, params.cabY, params.cabZ);
scene.add(winLeft);
const winRight = new THREE.Mesh(winSideGeom, glassMat);
winRight.position.set(-params.cabWidth / 2 - 0.01, params.cabY, params.cabZ);
scene.add(winRight);

// ==========================================
// Loader Arms & Linkage
// ==========================================
const armStartL = new THREE.Vector3(params.trackWidth - 0.3, 4.5, 0.5);
const armEndL = new THREE.Vector3(params.trackWidth - 0.3, 2.8, 5.5);
const armStartR = new THREE.Vector3(-(params.trackWidth - 0.3), 4.5, 0.5);
const armEndR = new THREE.Vector3(-(params.trackWidth - 0.3), 2.8, 5.5);

const armL = createArm(armStartL, armEndL, 0.5);
scene.add(armL);
const armR = createArm(armStartR, armEndR, 0.5);
scene.add(armR);

// Cross rungs (steps) between arms
const rungGeom = new THREE.BoxGeometry(params.trackWidth * 2 - 0.4, 0.15, 0.4);
for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    const posL = new THREE.Vector3().lerpVectors(armStartL, armEndL, t);
    const rung = new THREE.Mesh(rungGeom, bodyMat);
    rung.position.set(0, posL.y, posL.z);
    scene.add(rung);
}

// Hitch plate where arms meet bucket
const hitchGeom = new THREE.BoxGeometry(3.0, 0.6, 0.4);
const hitch = new THREE.Mesh(hitchGeom, bodyMat);
hitch.position.set(0, 3.2, 5.5);
scene.add(hitch);

// Hydraulic cylinders (simplified)
const hydroGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.8, 12);
const hydroL = new THREE.Mesh(hydroGeom, metalMat);
hydroL.position.set(params.trackWidth - 0.3, 5.0, 1.5);
hydroL.rotation.x = -0.7;
scene.add(hydroL);

const hydroR = new THREE.Mesh(hydroGeom, metalMat);
hydroR.position.set(-(params.trackWidth - 0.3), 5.0, 1.5);
hydroR.rotation.x = -0.7;
scene.add(hydroR);

// ==========================================
// Front Bucket
// ==========================================
const bucketGroup = new THREE.Group();

// Main scoop body - tapered box to simulate bucket shape
const bucketGeom = new THREE.BoxGeometry(params.bucketWidth, params.bucketHeight, params.bucketDepth, 1, 1, 1);
const bPos = bucketGeom.attributes.position;
for (let i = 0; i < bPos.count; i++) {
    const y = bPos.getY(i);
    if (y > 0) {
        bPos.setX(i, bPos.getX(i) * 0.78);
        bPos.setZ(i, bPos.getZ(i) * 0.75);
    }
}
bPos.needsUpdate = true;
bucketGeom.computeVertexNormals();
const bucketMesh = new THREE.Mesh(bucketGeom, bodyMat);
bucketGroup.add(bucketMesh);

// Cutting edge / blade
const bladeGeom = new THREE.BoxGeometry(params.bucketWidth + 0.2, 0.4, 0.3);
const blade = new THREE.Mesh(bladeGeom, metalMat);
blade.position.set(0, -params.bucketHeight / 2 + 0.2, params.bucketDepth / 2 + 0.1);
bucketGroup.add(blade);

// Side plates
const sidePlateGeom = new THREE.BoxGeometry(0.3, params.bucketHeight * 0.8, params.bucketDepth * 0.8);
const sideLeft = new THREE.Mesh(sidePlateGeom, bodyMat);
sideLeft.position.set(params.bucketWidth / 2 - 0.15, 0, 0);
bucketGroup.add(sideLeft);
const sideRight = new THREE.Mesh(sidePlateGeom, bodyMat);
sideRight.position.set(-params.bucketWidth / 2 + 0.15, 0, 0);
bucketGroup.add(sideRight);

bucketGroup.position.set(0, params.bucketY, params.bucketZ);
bucketGroup.rotation.x = 0.25; // Digging angle
scene.add(bucketGroup);

// ==========================================
// Wheels
// ==========================================
const frontLeft = createWheel(params.wheelRadius, params.wheelWidth);
frontLeft.position.set(-params.trackWidth, params.wheelRadius, params.wheelBaseFront);
scene.add(frontLeft);

const frontRight = createWheel(params.wheelRadius, params.wheelWidth);
frontRight.position.set(params.trackWidth, params.wheelRadius, params.wheelBaseFront);
scene.add(frontRight);

const rearLeft = createWheel(params.wheelRadius, params.wheelWidth);
rearLeft.position.set(-params.trackWidth, params.wheelRadius, params.wheelBaseRear);
scene.add(rearLeft);

const rearRight = createWheel(params.wheelRadius, params.wheelWidth);
rearRight.position.set(params.trackWidth, params.wheelRadius, params.wheelBaseRear);
scene.add(rearRight);

// ==========================================
// Camera
// ==========================================
camera.position.set(18, 14, 18);
camera.lookAt(0, 4, 0);