// Parameters
const vehicleColor = 0x888888; // Grey metal
const darkColor = 0x444444;    // Darker metal/tires
const glassColor = 0x222222;   // Windows
const wheelRadius = 1.2;
const wheelWidth = 0.8;
const treadDepth = 0.3;

// Material definitions
const bodyMaterial = new THREE.MeshStandardMaterial({ color: vehicleColor, roughness: 0.6, metalness: 0.3 });
const darkMaterial = new THREE.MeshStandardMaterial({ color: darkColor, roughness: 0.8, metalness: 0.1 });
const glassMaterial = new THREE.MeshStandardMaterial({ color: glassColor, roughness: 0.1, metalness: 0.5 });

// Helper function to create a treaded wheel
function createTreadedWheel(radius, width, treadCount) {
    const wheelGroup = new THREE.Group();

    // Main tire body
    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 32);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, darkMaterial);
    wheelGroup.add(tireMesh);

    // Rim/Hub
    const rimGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width + 0.1, 16);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, bodyMaterial);
    wheelGroup.add(rimMesh);

    // Hub cap
    const hubGeo = new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, width + 0.2, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeo, darkMaterial);
    wheelGroup.add(hubMesh);

    // Treads
    const treadGeo = new THREE.BoxGeometry(width + 0.1, treadDepth, radius * 0.4);
    for (let i = 0; i < treadCount; i++) {
        const angle = (i / treadCount) * Math.PI * 2;
        const tread = new THREE.Mesh(treadGeo, darkMaterial);
        tread.position.set(0, Math.cos(angle) * (radius + treadDepth/2), Math.sin(angle) * (radius + treadDepth/2));
        tread.rotation.x = angle;
        // Chevron pattern adjustment
        tread.rotation.z = (i % 2 === 0) ? 0.3 : -0.3; 
        wheelGroup.add(tread);
    }

    return wheelGroup;
}

// 1. Create Wheels
const frontLeftWheel = createTreadedWheel(wheelRadius, wheelWidth, 12);
const frontRightWheel = createTreadedWheel(wheelRadius, wheelWidth, 12);
const rearLeftWheel = createTreadedWheel(wheelRadius * 1.1, wheelWidth * 1.1, 14); // Rear wheels slightly larger
const rearRightWheel = createTreadedWheel(wheelRadius * 1.1, wheelWidth * 1.1, 14);

// Position wheels
const wheelBaseX = 3.5; // Distance from center to front axle
const wheelBaseZ = 1.8; // Distance from center to side
const wheelY = wheelRadius;

frontLeftWheel.position.set(wheelBaseX, wheelY, wheelBaseZ);
frontRightWheel.position.set(wheelBaseX, wheelY, -wheelBaseZ);
rearLeftWheel.position.set(-wheelBaseX, wheelY * 1.1, wheelBaseZ);
rearRightWheel.position.set(-wheelBaseX, wheelY * 1.1, -wheelBaseZ);

scene.add(frontLeftWheel, frontRightWheel, rearLeftWheel, rearRightWheel);

// 2. Main Chassis / Body
const chassisLength = 7;
const chassisWidth = 3.2;
const chassisHeight = 1.5;
const chassisY = wheelY + chassisHeight / 2 + 0.2; // Sit above wheels

const chassisGeo = new THREE.BoxGeometry(chassisLength, chassisHeight, chassisWidth);
const chassisMesh = new THREE.Mesh(chassisGeo, bodyMaterial);
chassisMesh.position.set(0, chassisY, 0);
scene.add(chassisMesh);

// Hood detail (front part of chassis)
const hoodGeo = new THREE.BoxGeometry(2.5, 0.5, 2.8);
const hoodMesh = new THREE.Mesh(hoodGeo, bodyMaterial);
hoodMesh.position.set(2, chassisY + 0.5, 0);
scene.add(hoodMesh);

// 3. Cabin
const cabinWidth = 2.6;
const cabinHeight = 2.2;
const cabinLength = 2.5;
const cabinY = chassisY + chassisHeight / 2 + cabinHeight / 2 - 0.2;
const cabinZOffset = -0.5; // Slightly towards rear

const cabinGeo = new THREE.BoxGeometry(cabinLength, cabinHeight, cabinWidth);
const cabinMesh = new THREE.Mesh(cabinGeo, bodyMaterial);
cabinMesh.position.set(-0.5, cabinY, cabinZOffset);
scene.add(cabinMesh);

// Cabin Roof (slightly larger)
const roofGeo = new THREE.BoxGeometry(cabinLength + 0.2, 0.2, cabinWidth + 0.2);
const roofMesh = new THREE.Mesh(roofGeo, bodyMaterial);
roofMesh.position.set(-0.5, cabinY + cabinHeight / 2 + 0.1, cabinZOffset);
scene.add(roofMesh);

// Windows (Front and Side)
// Front Window
const frontWinGeo = new THREE.BoxGeometry(0.1, 1.2, 2.0);
const frontWinMesh = new THREE.Mesh(frontWinGeo, glassMaterial);
frontWinMesh.position.set(-0.5 + cabinLength/2 - 0.1, cabinY, cabinZOffset);
scene.add(frontWinMesh);

// Side Windows
const sideWinGeo = new THREE.BoxGeometry(1.5, 1.2, 0.1);
const leftWinMesh = new THREE.Mesh(sideWinGeo, glassMaterial);
leftWinMesh.position.set(-0.5, cabinY, cabinZOffset + cabinWidth/2 - 0.1);
scene.add(leftWinMesh);

const rightWinMesh = new THREE.Mesh(sideWinGeo, glassMaterial);
rightWinMesh.position.set(-0.5, cabinY, cabinZOffset - cabinWidth/2 + 0.1);
scene.add(rightWinMesh);

// 4. Exhaust Pipe
const exhaustHeight = 1.5;
const exhaustRadius = 0.2;
const exhaustGeo = new THREE.CylinderGeometry(exhaustRadius, exhaustRadius, exhaustHeight, 16);
const exhaustMesh = new THREE.Mesh(exhaustGeo, darkMaterial);
exhaustMesh.position.set(-2.5, chassisY + chassisHeight/2 + exhaustHeight/2, -1.2);
scene.add(exhaustMesh);

// 5. Bucket Assembly
const bucketWidth = 4.5;
const bucketHeight = 1.5;
const bucketDepth = 1.5;
const bucketX = wheelBaseX + 2.5;
const bucketY = 1.0; // Low to ground

// Bucket Group
const bucketGroup = new THREE.Group();

// Bucket Back
const bucketBackGeo = new THREE.BoxGeometry(0.2, bucketHeight, bucketWidth);
const bucketBackMesh = new THREE.Mesh(bucketBackGeo, bodyMaterial);
bucketBackMesh.position.set(0, bucketHeight/2, 0);
bucketGroup.add(bucketBackMesh);

// Bucket Bottom
const bucketBottomGeo = new THREE.BoxGeometry(bucketDepth, 0.2, bucketWidth);
const bucketBottomMesh = new THREE.Mesh(bucketBottomGeo, bodyMaterial);
bucketBottomMesh.position.set(bucketDepth/2, 0.1, 0);
bucketGroup.add(bucketBottomMesh);

// Bucket Sides
const bucketSideGeo = new THREE.BoxGeometry(bucketDepth, bucketHeight, 0.2);
const leftSideMesh = new THREE.Mesh(bucketSideGeo, bodyMaterial);
leftSideMesh.position.set(bucketDepth/2, bucketHeight/2, bucketWidth/2 - 0.1);
leftSideMesh.rotation.z = -0.2; // Flare out
bucketGroup.add(leftSideMesh);

const rightSideMesh = new THREE.Mesh(bucketSideGeo, bodyMaterial);
rightSideMesh.position.set(bucketDepth/2, bucketHeight/2, -bucketWidth/2 + 0.1);
rightSideMesh.rotation.z = 0.2; // Flare out
bucketGroup.add(rightSideMesh);

// Bucket Top Lip
const lipGeo = new THREE.BoxGeometry(0.2, 0.2, bucketWidth + 0.4);
const lipMesh = new THREE.Mesh(lipGeo, darkMaterial);
lipMesh.position.set(0, bucketHeight, 0);
bucketGroup.add(lipMesh);

bucketGroup.position.set(bucketX - bucketDepth, bucketY, 0);
scene.add(bucketGroup);

// 6. Hydraulic Arms
// Main Arms connecting chassis to bucket
const armLength = 2.5;
const armGeo = new THREE.BoxGeometry(armLength, 0.3, 0.4);

// Left Arm
const leftArm = new THREE.Mesh(armGeo, bodyMaterial);
leftArm.position.set((bucketX - 1), chassisY + 0.5, 1.2);
leftArm.rotation.z = -0.3; // Angle down towards bucket
scene.add(leftArm);

// Right Arm
const rightArm = new THREE.Mesh(armGeo, bodyMaterial);
rightArm.position.set((bucketX - 1), chassisY + 0.5, -1.2);
rightArm.rotation.z = -0.3;
scene.add(rightArm);

// Hydraulic Pistons (Cylinders)
const pistonGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 8);
pistonGeo.rotateZ(Math.PI / 2);

const leftPiston = new THREE.Mesh(pistonGeo, darkMaterial);
leftPiston.position.set(1.5, chassisY + 1.0, 0.8);
leftPiston.rotation.z = -0.5;
scene.add(leftPiston);

const rightPiston = new THREE.Mesh(pistonGeo, darkMaterial);
rightPiston.position.set(1.5, chassisY + 1.0, -0.8);
rightPiston.rotation.z = -0.5;
scene.add(rightPiston);

// Adjust camera to match the isometric view
camera.position.set(12, 10, 12);
camera.lookAt(0, 2, 0);