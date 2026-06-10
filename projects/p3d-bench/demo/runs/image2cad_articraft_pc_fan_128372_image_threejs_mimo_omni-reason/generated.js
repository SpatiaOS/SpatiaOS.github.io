// Parameters for the fan model (based on standard 120mm fan proportions)
const frameOuterSize = 120; // Outer dimension of square frame (mm)
const frameInnerSize = 90; // Inner cutout size (creates frame walls)
const frameHeight = 25; // Distance between top and bottom frame plates
const mountingHoleRadius = 4; // Radius of corner mounting holes
const hubRadius = 22; // Central hub radius
const hubHeight = 12; // Height of central hub
const bladeCount = 7; // Number of fan blades (matches image)
const bladeLength = 38; // Length from hub edge to inner frame
const bladeWidth = 18; // Width of each blade at hub
const bladeCurvature = 0.8; // Curvature factor for aerodynamic blade shape

// Create top/bottom frame plates with mounting holes
function createFramePlate(isTop) {
  const plateGroup = new THREE.Group();
  const plateMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    metalness: 0.7, 
    roughness: 0.3 
  });

  // Create square ring shape for frame plate
  const frameShape = new THREE.Shape();
  // Outer square outline
  frameShape.moveTo(-frameOuterSize/2, -frameOuterSize/2);
  frameShape.lineTo(frameOuterSize/2, -frameOuterSize/2);
  frameShape.lineTo(frameOuterSize/2, frameOuterSize/2);
  frameShape.lineTo(-frameOuterSize/2, frameOuterSize/2);
  frameShape.lineTo(-frameOuterSize/2, -frameOuterSize/2);

  // Inner square cutout
  const innerHole = new THREE.Path();
  innerHole.moveTo(-frameInnerSize/2, -frameInnerSize/2);
  innerHole.lineTo(frameInnerSize/2, -frameInnerSize/2);
  innerHole.lineTo(frameInnerSize/2, frameInnerSize/2);
  innerHole.lineTo(-frameInnerSize/2, frameInnerSize/2);
  innerHole.lineTo(-frameInnerSize/2, -frameInnerSize/2);
  frameShape.holes.push(innerHole);

  // Add corner mounting holes
  const cornerOffset = frameOuterSize/2 - 10;
  const corners = [[cornerOffset, cornerOffset], [cornerOffset, -cornerOffset], [-cornerOffset, cornerOffset], [-cornerOffset, -cornerOffset]];
  corners.forEach(([x, y]) => {
    const hole = new THREE.Path();
    hole.absarc(x, y, mountingHoleRadius, 0, Math.PI * 2, true);
    frameShape.holes.push(hole);
  });

  // Extrude shape to create 3D plate
  const plateGeo = new THREE.ExtrudeGeometry(frameShape, {
    depth: 3,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelSegments: 2
  });
  const plate = new THREE.Mesh(plateGeo, plateMaterial);
  plate.position.z = isTop ? frameHeight/2 : -frameHeight/2;
  plateGroup.add(plate);

  return plateGroup;
}

// Create corner pillars connecting top/bottom plates
function createCornerPillars() {
  const pillarGroup = new THREE.Group();
  const pillarGeo = new THREE.CylinderGeometry(3, 3, frameHeight, 8);
  const pillarMat = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    metalness: 0.7, 
    roughness: 0.3 
  });

  const cornerOffset = frameOuterSize/2 - 10;
  const corners = [[cornerOffset, cornerOffset], [cornerOffset, -cornerOffset], [-cornerOffset, cornerOffset], [-cornerOffset, -cornerOffset]];
  corners.forEach(([x, y]) => {
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(x, y, 0);
    pillarGroup.add(pillar);
  });

  return pillarGroup;
}

// Create central rotating hub
function createHub() {
  const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, hubHeight, 32);
  const hubMat = new THREE.MeshStandardMaterial({ 
    color: 0x666666, 
    metalness: 0.8, 
    roughness: 0.2 
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.rotation.x = Math.PI/2; // Align with vertical axis
  return hub;
}

// Create a single aerodynamic fan blade
function createBlade() {
  const bladeShape = new THREE.Shape();
  const startWidth = bladeWidth;
  const endWidth = bladeWidth * 0.6;

  // Curved blade path from hub to inner frame
  bladeShape.moveTo(hubRadius, -startWidth/2);
  bladeShape.quadraticCurveTo(
    hubRadius + bladeLength/2, 
    -endWidth/2 + bladeCurvature * bladeLength, 
    hubRadius + bladeLength, 
    -endWidth/2
  );
  bladeShape.lineTo(hubRadius + bladeLength, endWidth/2);
  bladeShape.quadraticCurveTo(
    hubRadius + bladeLength/2, 
    endWidth/2 - bladeCurvature * bladeLength, 
    hubRadius, 
    startWidth/2
  );
  bladeShape.lineTo(hubRadius, -startWidth/2);

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 2, bevelEnabled: false });
  const bladeMat = new THREE.MeshStandardMaterial({ 
    color: 0x999999, 
    metalness: 0.6, 
    roughness: 0.4 
  });
  return new THREE.Mesh(bladeGeo, bladeMat);
}

// Assemble all blades in radial arrangement
function createBlades() {
  const bladesGroup = new THREE.Group();
  const singleBlade = createBlade();

  for (let i = 0; i < bladeCount; i++) {
    const blade = singleBlade.clone();
    blade.rotation.z = (i / bladeCount) * Math.PI * 2; // Radial rotation
    bladesGroup.add(blade);
  }

  return bladesGroup;
}

// Assemble complete fan model
const fanModel = new THREE.Group();
fanModel.add(createFramePlate(true));
fanModel.add(createFramePlate(false));
fanModel.add(createCornerPillars());
fanModel.add(createHub());
fanModel.add(createBlades());

// Add to scene
scene.add(fanModel);

// Adjust camera for optimal view
camera.position.set(160, 160, 160);
camera.lookAt(0, 0, 0);