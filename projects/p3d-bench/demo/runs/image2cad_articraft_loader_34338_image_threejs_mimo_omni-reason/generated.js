// Parametric Dimensions (based on visual proportions)
const bodyLength = 12;
const bodyWidth = 6;
const bodyHeight = 3;

// Wheel parameters
const wheelRadius = 2.2;
const wheelWidth = 1.2;
const wheelTreadDepth = 0.3;
const wheelSpacing = 2; // distance from body center to wheel center

// Cabin parameters
const cabinWidth = 4;
const cabinDepth = 3;
const cabinHeight = 4;
const cabinRoofOverhang = 0.4;
const cabinPillarWidth = 0.4;

// Bucket parameters
const bucketWidth = 6;
const bucketHeight = 2.5;
const bucketDepth = 4;
const bucketLipHeight = 0.3;

// Exhaust pipe parameters
const exhaustRadius = 0.4;
const exhaustHeight = 2;

// Helper function to create a treaded wheel
function createTreadedWheel() {
    const wheelGroup = new THREE.Group();
    
    // Main wheel cylinder
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
    wheelMesh.rotation.x = Math.PI / 2;
    wheelGroup.add(wheelMesh);
    
    // Treads (using extruded shape for the zigzag pattern)
    const treadShape = new THREE.Shape();
    treadShape.moveTo(0, 0);
    treadShape.lineTo(wheelTreadDepth, 0);
    treadShape.lineTo(wheelTreadDepth, wheelWidth * 0.8);
    treadShape.lineTo(0, wheelWidth * 0.8);
    treadShape.lineTo(0, 0);
    
    const treadGeo = new THREE.ExtrudeGeometry(treadShape, {
        depth: wheelTreadDepth,
        bevelEnabled: false
    });
    const treadMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    
    // Add 12 treads around the wheel
    for (let i = 0; i < 12; i++) {
        const tread = new THREE.Mesh(treadGeo, treadMat);
        const angle = (i / 12) * Math.PI * 2;
        tread.position.x = Math.cos(angle) * (wheelRadius + wheelTreadDepth/2);
        tread.position.z = Math.sin(angle) * (wheelRadius + wheelTreadDepth/2);
        tread.rotation.y = angle + Math.PI/2;
        wheelGroup.add(tread);
    }
    
    // Hub cap
    const hubGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI/2;
    hub.position.z = wheelWidth/2 + 0.1;
    wheelGroup.add(hub);
    
    return wheelGroup;
}

// Create main body/chassis
const bodyGeo = new THREE.BoxGeometry(bodyLength, bodyHeight, bodyWidth);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
scene.add(body);

// Create and position wheels
const wheelPositions = [
    [-bodyLength/2 + 2, -bodyHeight/2 - wheelRadius, wheelSpacing], // front left
    [-bodyLength/2 + 2, -bodyHeight/2 - wheelRadius, -wheelSpacing], // front right
    [bodyLength/2 - 2, -bodyHeight/2 - wheelRadius, wheelSpacing], // rear left
    [bodyLength/2 - 2, -bodyHeight/2 - wheelRadius, -wheelSpacing] // rear right
];
wheelPositions.forEach(pos => {
    const wheel = createTreadedWheel();
    wheel.position.set(pos[0], pos[1], pos[2]);
    scene.add(wheel);
});

// Create cabin
const cabinGroup = new THREE.Group();

// Cabin base
const cabinBaseGeo = new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinDepth);
const cabinBaseMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
const cabinBase = new THREE.Mesh(cabinBaseGeo, cabinBaseMat);
cabinGroup.add(cabinBase);

// Cabin roof
const roofGeo = new THREE.BoxGeometry(cabinWidth + cabinRoofOverhang*2, 0.4, cabinDepth + cabinRoofOverhang*2);
const roofMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
const roof = new THREE.Mesh(roofGeo, roofMat);
roof.position.y = cabinHeight/2 + 0.2;
cabinGroup.add(roof);

// Cabin pillars (4 corner pillars)
const pillarGeo = new THREE.BoxGeometry(cabinPillarWidth, cabinHeight, cabinPillarWidth);
const pillarMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
const pillarPositions = [
    [cabinWidth/2 - cabinPillarWidth/2, 0, cabinDepth/2 - cabinPillarWidth/2],
    [-cabinWidth/2 + cabinPillarWidth/2, 0, cabinDepth/2 - cabinPillarWidth/2],
    [cabinWidth/2 - cabinPillarWidth/2, 0, -cabinDepth/2 + cabinPillarWidth/2],
    [-cabinWidth/2 + cabinPillarWidth/2, 0, -cabinDepth/2 + cabinPillarWidth/2]
];
pillarPositions.forEach(pos => {
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(pos[0], pos[1], pos[2]);
    cabinGroup.add(pillar);
});

// Position cabin on body
cabinGroup.position.set(2, bodyHeight/2 + cabinHeight/2, 0);
scene.add(cabinGroup);

// Create front loader bucket
const bucketGroup = new THREE.Group();

// Bucket main shape (using extruded geometry for the scoop)
const bucketShape = new THREE.Shape();
bucketShape.moveTo(-bucketWidth/2, 0);
bucketShape.lineTo(bucketWidth/2, 0);
bucketShape.lineTo(bucketWidth/2 - bucketLipHeight, bucketHeight);
bucketShape.lineTo(-bucketWidth/2 + bucketLipHeight, bucketHeight);
bucketShape.lineTo(-bucketWidth/2, 0);

const bucketGeo = new THREE.ExtrudeGeometry(bucketShape, {
    depth: bucketDepth,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2
});
const bucketMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
const bucket = new THREE.Mesh(bucketGeo, bucketMat);
bucket.rotation.x = Math.PI/2;
bucketGroup.add(bucket);

// Bucket lifting arms (two curved arms)
const armGeo = new THREE.BoxGeometry(0.5, 1.5, 4);
const armMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
const arm1 = new THREE.Mesh(armGeo, armMat);
arm1.position.set(-bucketWidth/2 + 1, bucketHeight/2, -bucketDepth/2 - 1);
arm1.rotation.z = Math.PI/6;
bucketGroup.add(arm1);

const arm2 = arm1.clone();
arm2.position.set(bucketWidth/2 - 1, bucketHeight/2, -bucketDepth/2 - 1);
arm2.rotation.z = -Math.PI/6;
bucketGroup.add(arm2);

// Position bucket at front of body
bucketGroup.position.set(-bodyLength/2 - bucketDepth/2, -bodyHeight/2 + bucketHeight/2, 0);
scene.add(bucketGroup);

// Create exhaust pipe
const exhaustGeo = new THREE.CylinderGeometry(exhaustRadius, exhaustRadius, exhaustHeight, 16);
const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
exhaust.position.set(bodyLength/2 - 1, bodyHeight/2 + exhaustHeight/2, bodyWidth/2 - 1);
scene.add(exhaust);

// Rear engine cover detail
const engineCoverGeo = new THREE.BoxGeometry(3, 1.5, bodyWidth - 1);
const engineCoverMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
const engineCover = new THREE.Mesh(engineCoverGeo, engineCoverMat);
engineCover.position.set(bodyLength/2 - 2, bodyHeight/2 + 0.75, 0);
scene.add(engineCover);

// Adjust camera to view the bulldozer
camera.position.set(15, 10, 15);
camera.lookAt(0, 0, 0);