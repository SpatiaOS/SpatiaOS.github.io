// Parameters
const reelRadius = 12;
const reelWidth = 8;
const flangeThickness = 1.5;
const hoseRadius = 0.6; // Thickness of the hose
const hoseCoilRadius = 10.5; // Radius of the coiled hose
const numWindings = 7;
const pipeRadius = 0.4;
const materialColor = 0x999999; // Grey plastic/metal look

// Materials
const mainMaterial = new THREE.MeshStandardMaterial({ 
    color: materialColor, 
    roughness: 0.4, 
    metalness: 0.1 
});
const darkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x555555, 
    roughness: 0.7 
});

// --- 1. Reel Assembly ---

const reelGroup = new THREE.Group();

// Back Flange
const backFlangeGeo = new THREE.CylinderGeometry(reelRadius, reelRadius, flangeThickness, 32);
backFlangeGeo.rotateX(Math.PI / 2); // Align with Z axis
const backFlange = new THREE.Mesh(backFlangeGeo, mainMaterial);
backFlange.position.z = -reelWidth / 2;
reelGroup.add(backFlange);

// Front Flange
const frontFlangeGeo = new THREE.CylinderGeometry(reelRadius, reelRadius, flangeThickness, 32);
frontFlangeGeo.rotateX(Math.PI / 2);
const frontFlange = new THREE.Mesh(frontFlangeGeo, mainMaterial);
frontFlange.position.z = reelWidth / 2;
reelGroup.add(frontFlange);

// Central Hub (connecting flanges)
const hubGeo = new THREE.CylinderGeometry(2, 2, reelWidth, 16);
hubGeo.rotateX(Math.PI / 2);
const hub = new THREE.Mesh(hubGeo, mainMaterial);
reelGroup.add(hub);

// Screw holes on front flange (4 holes in a square pattern)
const holeRadius = 0.3;
const holeDist = 6;
const holePositions = [
    [holeDist, holeDist], [holeDist, -holeDist], 
    [-holeDist, holeDist], [-holeDist, -holeDist]
];

holePositions.forEach(pos => {
    // Create a small ring to simulate the hole rim
    const holeRimGeo = new THREE.TorusGeometry(holeRadius, 0.1, 8, 16);
    const holeRim = new THREE.Mesh(holeRimGeo, darkMaterial);
    holeRim.position.set(pos[0], pos[1], reelWidth / 2 + 0.1);
    reelGroup.add(holeRim);
    
    // Dark circle inside to simulate depth
    const holeInnerGeo = new THREE.CircleGeometry(holeRadius, 16);
    const holeInner = new THREE.Mesh(holeInnerGeo, darkMaterial);
    holeInner.position.set(pos[0], pos[1], reelWidth / 2 + 0.05);
    reelGroup.add(holeInner);
});

// --- 2. Hose Windings ---

// Create hose as a series of torus rings stacked along Z
for (let i = 0; i < numWindings; i++) {
    // Distribute windings across the reel width
    const zPos = -reelWidth / 2 + flangeThickness + (i * ((reelWidth - 2 * flangeThickness) / (numWindings - 1)));
    
    const hoseGeo = new THREE.TorusGeometry(hoseCoilRadius, hoseRadius, 16, 50);
    const hoseSegment = new THREE.Mesh(hoseGeo, mainMaterial);
    hoseSegment.position.z = zPos;
    // Rotate to match the reel orientation (Torus is initially in XY plane, which is correct for Z-axis reel)
    reelGroup.add(hoseSegment);
}

// --- 3. Top Inlet Pipe Assembly ---

const topPipeGroup = new THREE.Group();

// Curved pipe connecting reel side to vertical pipe
// Using a tube geometry for the curve
class CustomCurve extends THREE.Curve {
    getPoint(t) {
        // Start at left side of reel (-x), go up
        // Simple L-shape curve approximation
        const x = -12 - (t * 0); // Keep x constant mostly, maybe slight curve
        const y = t * 15;
        const z = 0;
        return new THREE.Vector3(x, y, z);
    }
}
// Actually, let's just build it with cylinders for simplicity and robustness
// Vertical part
const topVerticalPipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 16, 16);
const topVerticalPipe = new THREE.Mesh(topVerticalPipeGeo, mainMaterial);
topVerticalPipe.position.set(-13, 8, 0);
topPipeGroup.add(topVerticalPipe);

// Elbow connecting to reel
const elbowGeo = new THREE.TorusGeometry(1.5, pipeRadius, 8, 16, Math.PI / 2);
const elbow = new THREE.Mesh(elbowGeo, mainMaterial);
elbow.position.set(-11.5, 0, 0);
elbow.rotation.y = Math.PI / 2; // Face correct way
elbow.rotation.z = Math.PI; // Orient curve
topPipeGroup.add(elbow);

// Short horizontal connector to reel
const shortConnGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 1.5, 16);
shortConnGeo.rotateZ(Math.PI / 2);
const shortConn = new THREE.Mesh(shortConnGeo, mainMaterial);
shortConn.position.set(-12.25, 0, 0);
topPipeGroup.add(shortConn);

// Top Connector / Nozzle
const topNozzleBaseGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 16);
const topNozzleBase = new THREE.Mesh(topNozzleBaseGeo, mainMaterial);
topNozzleBase.position.set(-13, 16.5, 0);
topPipeGroup.add(topNozzleBase);

// Hex nut on top
const hexGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 6);
const hexNut = new THREE.Mesh(hexGeo, darkMaterial);
hexNut.position.set(-13, 17.2, 0);
topPipeGroup.add(hexNut);

// Small nozzle tip
const tipGeo = new THREE.CylinderGeometry(0.3, 0.5, 0.5, 16);
const tip = new THREE.Mesh(tipGeo, darkMaterial);
tip.position.set(-13, 17.6, 0);
topPipeGroup.add(tip);

// --- 4. Bottom Outlet Pipe Assembly ---

const bottomPipeGroup = new THREE.Group();

// Vertical pipe coming down from center
const bottomVerticalPipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 10, 16);
const bottomVerticalPipe = new THREE.Mesh(bottomVerticalPipeGeo, mainMaterial);
bottomVerticalPipe.position.set(0, -18, 0);
bottomPipeGroup.add(bottomVerticalPipe);

// Connection to reel hub area
const bottomConnGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 2, 16);
const bottomConn = new THREE.Mesh(bottomConnGeo, mainMaterial);
bottomConn.position.set(0, -13, 0);
bottomPipeGroup.add(bottomConn);

// Valve Assembly
// Valve body
const valveBodyGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 16);
const valveBody = new THREE.Mesh(valveBodyGeo, mainMaterial);
valveBody.position.set(0, -23.5, 0);
bottomPipeGroup.add(valveBody);

// Valve Handle (Lever)
const handleStemGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
const handleStem = new THREE.Mesh(handleStemGeo, darkMaterial);
handleStem.position.set(0, -23, 0);
handleStem.rotation.z = Math.PI / 2;
bottomPipeGroup.add(handleStem);

const handleGeo = new THREE.BoxGeometry(0.2, 0.2, 3);
const handle = new THREE.Mesh(handleGeo, darkMaterial);
handle.position.set(0, -23, 1.2); // Offset to end of stem
bottomPipeGroup.add(handle);

// Nozzle tip at bottom
const bottomNozzleGeo = new THREE.CylinderGeometry(0.2, 0.5, 1.5, 16);
const bottomNozzle = new THREE.Mesh(bottomNozzleGeo, mainMaterial);
bottomNozzle.position.set(0, -25, 0);
bottomPipeGroup.add(bottomNozzle);


// --- Add everything to scene ---

scene.add(reelGroup);
scene.add(topPipeGroup);
scene.add(bottomPipeGroup);

// Adjust camera to view the object nicely
camera.position.set(20, 10, 25);
camera.lookAt(0, 0, 0);