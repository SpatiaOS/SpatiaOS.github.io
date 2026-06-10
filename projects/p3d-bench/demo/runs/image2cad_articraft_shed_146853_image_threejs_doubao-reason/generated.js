// --------------------------
// Parameters (all dimensions in meters)
// --------------------------
const shedWidth = 4;       // Side-to-side width of the shed
const shedDepth = 6;       // Front-to-back depth of the shed
const wallHeight = 2.4;    // Height of exterior walls from base to top plate
const roofPeakHeight = 4;  // Total height from base to highest roof point
const studSize = 0.1;      // Cross-section dimension of framing lumber
const studSpacing = 0.6;   // Spacing between vertical wall studs
const trussSpacing = 0.6;  // Spacing between roof trusses along depth
const sheathingThickness = 0.05; // Thickness of wall/roof panel sheathing
const baseHeight = 0.2;    // Height of the bottom foundation sill plate
const doorWidth = 1.8;     // Total width of double front doors
const doorHeight = 2;      // Height of front doors

// Calculated derived parameters
const roofRise = roofPeakHeight - (baseHeight + wallHeight);
const roofRun = shedWidth / 2;
const rafterLength = Math.hypot(roofRun, roofRise);
const roofAngle = Math.atan2(roofRise, roofRun); // Angle of roof slope in radians

// Materials
const framingMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.7 });
const sheathingMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.6 });

// --------------------------
// Base Foundation Sill
// --------------------------
const baseGeom = new THREE.BoxGeometry(shedWidth, baseHeight, shedDepth);
const base = new THREE.Mesh(baseGeom, framingMat);
base.position.y = baseHeight / 2;
scene.add(base);

// --------------------------
// Exterior Wall Sheathing
// --------------------------
// Left side wall
const leftWallGeom = new THREE.BoxGeometry(sheathingThickness, wallHeight, shedDepth);
const leftWall = new THREE.Mesh(leftWallGeom, sheathingMat);
leftWall.position.set(-shedWidth/2 + sheathingThickness/2, baseHeight + wallHeight/2, 0);
scene.add(leftWall);

// Right side wall
const rightWall = leftWall.clone();
rightWall.position.x = shedWidth/2 - sheathingThickness/2;
scene.add(rightWall);

// Back wall
const backWallGeom = new THREE.BoxGeometry(shedWidth, wallHeight, sheathingThickness);
const backWall = new THREE.Mesh(backWallGeom, sheathingMat);
backWall.position.set(0, baseHeight + wallHeight/2, -shedDepth/2 + sheathingThickness/2);
scene.add(backWall);

// Front wall (split around door opening)
const frontWallLeftGeom = new THREE.BoxGeometry((shedWidth - doorWidth)/2, wallHeight, sheathingThickness);
const frontWallLeft = new THREE.Mesh(frontWallLeftGeom, sheathingMat);
frontWallLeft.position.set(-shedWidth/2 + (shedWidth - doorWidth)/4, baseHeight + wallHeight/2, shedDepth/2 - sheathingThickness/2);
scene.add(frontWallLeft);

const frontWallRight = frontWallLeft.clone();
frontWallRight.position.x = shedWidth/2 - (shedWidth - doorWidth)/4;
scene.add(frontWallRight);

// Lintel above door
const doorLintelGeom = new THREE.BoxGeometry(doorWidth, wallHeight - doorHeight, sheathingThickness);
const doorLintel = new THREE.Mesh(doorLintelGeom, sheathingMat);
doorLintel.position.set(0, baseHeight + doorHeight + (wallHeight - doorHeight)/2, shedDepth/2 - sheathingThickness/2);
scene.add(doorLintel);

// Double front doors
const doorGeom = new THREE.BoxGeometry(doorWidth/2, doorHeight, sheathingThickness);
const leftDoor = new THREE.Mesh(doorGeom, sheathingMat);
leftDoor.position.set(-doorWidth/4, baseHeight + doorHeight/2, shedDepth/2 - sheathingThickness/2);
scene.add(leftDoor);

const rightDoor = leftDoor.clone();
rightDoor.position.x = doorWidth/4;
scene.add(rightDoor);

// Door hinges (small detail)
const hingeGeom = new THREE.BoxGeometry(0.05, 0.08, 0.02);
for(let i = 0; i < 3; i++) {
  const leftHinge = new THREE.Mesh(hingeGeom, framingMat);
  leftHinge.position.set(-doorWidth/2 + 0.03, baseHeight + 0.4 + i*0.6, shedDepth/2 - sheathingThickness/2 + 0.01);
  scene.add(leftHinge);
  
  const rightHinge = leftHinge.clone();
  rightHinge.position.x = doorWidth/2 - 0.03;
  scene.add(rightHinge);
}

// --------------------------
// Wall Framing Studs
// --------------------------
// Left + Right wall studs
for(let z = -shedDepth/2 + studSpacing; z < shedDepth/2; z += studSpacing) {
  const studGeom = new THREE.BoxGeometry(studSize, wallHeight, studSize);
  const leftStud = new THREE.Mesh(studGeom, framingMat);
  leftStud.position.set(-shedWidth/2 + studSize/2 + sheathingThickness, baseHeight + wallHeight/2, z);
  scene.add(leftStud);
  
  const rightStud = leftStud.clone();
  rightStud.position.x = shedWidth/2 - studSize/2 - sheathingThickness;
  scene.add(rightStud);
}

// Back wall studs
for(let x = -shedWidth/2 + studSpacing; x < shedWidth/2; x += studSpacing) {
  const studGeom = new THREE.BoxGeometry(studSize, wallHeight, studSize);
  const stud = new THREE.Mesh(studGeom, framingMat);
  stud.position.set(x, baseHeight + wallHeight/2, -shedDepth/2 + studSize/2 + sheathingThickness);
  scene.add(stud);
}

// Front wall studs (skip door opening)
for(let x = -shedWidth/2 + studSpacing; x < shedWidth/2; x += studSpacing) {
  if(Math.abs(x) > doorWidth/2) {
    const studGeom = new THREE.BoxGeometry(studSize, wallHeight, studSize);
    const stud = new THREE.Mesh(studGeom, framingMat);
    stud.position.set(x, baseHeight + wallHeight/2, shedDepth/2 - studSize/2 - sheathingThickness);
    scene.add(stud);
  }
}

// Top wall plates (perimeter frame on top of walls)
const topPlateSideGeom = new THREE.BoxGeometry(studSize, studSize, shedDepth);
const leftTopPlate = new THREE.Mesh(topPlateSideGeom, framingMat);
leftTopPlate.position.set(-shedWidth/2 + studSize/2, baseHeight + wallHeight + studSize/2, 0);
scene.add(leftTopPlate);

const rightTopPlate = leftTopPlate.clone();
rightTopPlate.position.x = shedWidth/2 - studSize/2;
scene.add(rightTopPlate);

const topPlateEndGeom = new THREE.BoxGeometry(shedWidth, studSize, studSize);
const frontTopPlate = new THREE.Mesh(topPlateEndGeom, framingMat);
frontTopPlate.position.set(0, baseHeight + wallHeight + studSize/2, shedDepth/2 - studSize/2);
scene.add(frontTopPlate);

const backTopPlate = frontTopPlate.clone();
backTopPlate.position.z = -shedDepth/2 + studSize/2;
scene.add(backTopPlate);

// --------------------------
// Roof Framing
// --------------------------
// Trusses (gable frames spaced along shed depth)
for(let z = -shedDepth/2; z <= shedDepth/2; z += trussSpacing) {
  // Left rafter
  const rafterGeom = new THREE.BoxGeometry(rafterLength, studSize, studSize);
  const leftRafter = new THREE.Mesh(rafterGeom, framingMat);
  leftRafter.rotation.z = -roofAngle;
  leftRafter.position.set(-roofRun/2, baseHeight + wallHeight + studSize/2 + roofRise/2, z);
  scene.add(leftRafter);
  
  // Right rafter
  const rightRafter = leftRafter.clone();
  rightRafter.rotation.z = roofAngle;
  rightRafter.position.x = roofRun/2;
  scene.add(rightRafter);
  
  // Ceiling joist (bottom of truss)
  const joistGeom = new THREE.BoxGeometry(shedWidth, studSize, studSize);
  const joist = new THREE.Mesh(joistGeom, framingMat);
  joist.position.set(0, baseHeight + wallHeight + studSize/2, z);
  scene.add(joist);
}

// Roof purlins (horizontal members running along roof slope across trusses)
const purlinCount = 5;
for(let i = 1; i < purlinCount; i++) {
  const distAlongRafter = (i / purlinCount) * rafterLength;
  const purlinGeom = new THREE.BoxGeometry(studSize, studSize, shedDepth);
  
  // Left side purlin
  const leftPurlin = new THREE.Mesh(purlinGeom, framingMat);
  leftPurlin.position.set(
    -roofRun + distAlongRafter * Math.cos(roofAngle),
    baseHeight + wallHeight + studSize + distAlongRafter * Math.sin(roofAngle),
    0
  );
  scene.add(leftPurlin);
  
  // Right side purlin
  const rightPurlin = leftPurlin.clone();
  rightPurlin.position.x = roofRun - distAlongRafter * Math.cos(roofAngle);
  scene.add(rightPurlin);
}

// Partial roof sheathing (as shown in the reference image)
const roofSheathingGeom = new THREE.BoxGeometry(rafterLength, sheathingThickness, shedDepth * 0.4);
const roofSheathing = new THREE.Mesh(roofSheathingGeom, sheathingMat);
roofSheathing.rotation.z = -roofAngle;
roofSheathing.position.set(
  -roofRun/2,
  baseHeight + wallHeight + studSize + roofRise/2,
  shedDepth/2 - (shedDepth * 0.4)/2
);
scene.add(roofSheathing);

// --------------------------
// Camera Setup (isometric view matching reference)
// --------------------------
camera.position.set(10, 8, 12);
camera.lookAt(0, baseHeight + (wallHeight + roofPeakHeight)/2, 0);