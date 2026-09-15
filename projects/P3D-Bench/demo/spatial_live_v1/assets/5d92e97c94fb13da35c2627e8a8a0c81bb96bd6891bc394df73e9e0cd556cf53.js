// --------------------------
// PARAMETER DEFINITIONS
// Proportions estimated from reference image, base unit = 1 floor height (~3m real scale)
// --------------------------
// Core height dimensions
const floorHeight = 1;          // Height of a single residential floor
const lowerFloors = 20;         // Number of floors in the full-width lower section with balconies
const upperFloors = 4;          // Number of floors in the setback upper section
const baseHeight = 1.5;         // Height of the ground-floor concrete base
const roofSlabThickness = 0.2;  // Thickness of flat roof slabs
const parapetHeight = 0.6;      // Height of roof parapet walls
const penthouseHeight = 1.4;    // Height of the top corner penthouse structure
const podiumHeight = 2.0;       // Height of the small attached side podium

// Footprint dimensions
const towerWidth = 6;           // Total width of the tower front face (X axis, left-right)
const balconyWidth = 4.8;       // Width of the projecting balcony section (left portion of front)
const balconyDepth = 0.9;       // How far balconies project out from the front face
const balconySlabThick = 0.12;  // Thickness of balcony floor slabs
const towerDepth = 6.5;         // Total depth of the tower (Z axis, front-back)
const upperSetback = 2.2;       // How far the upper tower is set back from the front on the left side
const baseOverhang = 0.2;       // How far the base extends past the tower shaft on all sides
const podiumWidth = 2.2;        // Width of the small side podium
const podiumDepth = 1.8;        // Depth of the small side podium
const chamferSize = 0.7;        // Size of 45-degree chamfer cuts on base and penthouse corners

// Window parameters
const windowInset = 0.05;       // How far windows are recessed into wall faces
const windowPaneSize = 0.28;    // Size of individual window panes
const windowMullion = 0.12;     // Width of concrete mullions between window panes

// --------------------------
// MATERIAL DEFINITIONS
// --------------------------
const concreteMat = new THREE.MeshStandardMaterial({
  color: 0xc0c4cc,
  roughness: 0.85,
  metalness: 0.1
});
const roofMat = new THREE.MeshStandardMaterial({
  color: 0x888c94,
  roughness: 0.75,
  metalness: 0.1
});
const windowMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.2,
  metalness: 0.6
});
const metalMat = new THREE.MeshStandardMaterial({
  color: 0x444444,
  roughness: 0.5,
  metalness: 0.8
});

// --------------------------
// CREATE BUILDING GROUP
// All elements are added to this group to allow easy centering
// --------------------------
const building = new THREE.Group();

// --------------------------
// BASE GEOMETRY (ground floor with chamfered corner)
// Extruded custom shape with 45-degree chamfer on front-right corner
// --------------------------
const baseShape = new THREE.Shape();
const baseTotalW = towerWidth + baseOverhang * 2;
const baseTotalD = towerDepth + baseOverhang * 2;
// Define footprint vertices (in shape XY plane, transformed to XZ world plane)
baseShape.moveTo(-baseOverhang, -baseOverhang);
baseShape.lineTo(baseTotalW - baseOverhang - chamferSize, -baseOverhang);
baseShape.lineTo(baseTotalW - baseOverhang, -baseOverhang + chamferSize);
baseShape.lineTo(baseTotalW - baseOverhang, baseTotalD - baseOverhang);
baseShape.lineTo(-baseOverhang, baseTotalD - baseOverhang);
baseShape.closePath();

const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
  depth: baseHeight,
  bevelEnabled: false
});
// Transform geometry to align shape XY plane to world XZ plane, extrude along Y axis
const alignMatrix = new THREE.Matrix4().set(
  1, 0, 0, 0,
  0, 0, 1, 0,
  0, 1, 0, 0,
  0, 0, 0, 1
);
baseGeom.applyMatrix4(alignMatrix);
const base = new THREE.Mesh(baseGeom, concreteMat);
building.add(base);

// --------------------------
// LOWER TOWER SHAFT (full size, 20 floors)
// --------------------------
const lowerShaftGeom = new THREE.BoxGeometry(
  towerWidth,
  lowerFloors,
  towerDepth
);
const lowerShaft = new THREE.Mesh(lowerShaftGeom, concreteMat);
lowerShaft.position.set(
  towerWidth / 2,
  baseHeight + lowerFloors / 2,
  towerDepth / 2
);
building.add(lowerShaft);

// --------------------------
// ADD BALCONIES, RAILINGS, AND BALCONY OPENINGS
// --------------------------
for (let i = 0; i < lowerFloors; i++) {
  const floorY = baseHeight + i * floorHeight;
  const slabY = floorY + floorHeight - balconySlabThick / 2;

  // Balcony floor slab
  const balconySlabGeom = new THREE.BoxGeometry(balconyWidth, balconySlabThick, balconyDepth);
  const balconySlab = new THREE.Mesh(balconySlabGeom, concreteMat);
  balconySlab.position.set(
    balconyWidth / 2,
    slabY,
    -balconyDepth / 2
  );
  building.add(balconySlab);

  // Balcony front railing
  const railingGeom = new THREE.BoxGeometry(balconyWidth, 0.3, 0.05);
  const railing = new THREE.Mesh(railingGeom, concreteMat);
  railing.position.set(
    balconyWidth / 2,
    slabY + balconySlabThick/2 + 0.15,
    -balconyDepth + 0.025
  );
  building.add(railing);

  // Dark window/door opening behind balcony
  const openingGeom = new THREE.BoxGeometry(balconyWidth, floorHeight - balconySlabThick, 0.05);
  const opening = new THREE.Mesh(openingGeom, windowMat);
  opening.position.set(
    balconyWidth / 2,
    floorY + (floorHeight - balconySlabThick)/2,
    0
  );
  building.add(opening);
}

// --------------------------
// ADD WINDOWS TO FRONT FACE RIGHT SECTION (3x3 per floor, full 24 floors)
// --------------------------
const totalFloors = lowerFloors + upperFloors;
for (let floor = 0; floor < totalFloors; floor++) {
  const floorBaseY = baseHeight + floor * floorHeight;

  for (let wx = 0; wx < 3; wx++) {
    for (let wy = 0; wy < 3; wy++) {
      const paneX = balconyWidth + windowMullion + wx*(windowPaneSize + windowMullion) + windowPaneSize/2;
      const paneY = floorBaseY + windowMullion + wy*(windowPaneSize + windowMullion) + windowPaneSize/2;
      const paneGeom = new THREE.BoxGeometry(windowPaneSize, windowPaneSize, 0.05);
      const pane = new THREE.Mesh(paneGeom, windowMat);
      pane.position.set(
        paneX,
        paneY,
        windowInset / 2
      );
      building.add(pane);
    }
  }
}

// --------------------------
// ADD WINDOWS TO EAST (RIGHT) FACE (3x3 per floor, full 24 floors)
// --------------------------
for (let floor = 0; floor < totalFloors; floor++) {
  const floorBaseY = baseHeight + floor * floorHeight;

  for (let wz = 0; wz < 3; wz++) {
    for (let wy = 0; wy < 3; wy++) {
      const paneZ = windowMullion + wz*(windowPaneSize + windowMullion) + windowPaneSize/2;
      const paneY = floorBaseY + windowMullion + wy*(windowPaneSize + windowMullion) + windowPaneSize/2;
      const paneGeom = new THREE.BoxGeometry(0.05, windowPaneSize, windowPaneSize);
      const pane = new THREE.Mesh(paneGeom, windowMat);
      pane.position.set(
        towerWidth - windowInset/2,
        paneY,
        paneZ
      );
      building.add(pane);
    }
  }
}

// --------------------------
// UPPER TOWER SECTION (L-shaped, set back on left side, 4 floors)
// --------------------------
// Right continuous strip (full depth, full height)
const upperRightGeom = new THREE.BoxGeometry(
  towerWidth - balconyWidth,
  upperFloors,
  towerDepth
);
const upperRight = new THREE.Mesh(upperRightGeom, concreteMat);
upperRight.position.set(
  balconyWidth + (towerWidth - balconyWidth)/2,
  baseHeight + lowerFloors + upperFloors/2,
  towerDepth / 2
);
building.add(upperRight);

// Rear upper section (set back on left side)
const upperRearGeom = new THREE.BoxGeometry(
  balconyWidth,
  upperFloors,
  towerDepth - upperSetback
);
const upperRear = new THREE.Mesh(upperRearGeom, concreteMat);
upperRear.position.set(
  balconyWidth/2,
  baseHeight + lowerFloors + upperFloors/2,
  upperSetback + (towerDepth - upperSetback)/2
);
building.add(upperRear);

// --------------------------
// LOWER ROOF SLAB (over 20th floor terrace, medium gray)
// Extends forward past balconies, covers setback area
// --------------------------
const lowerRoofGeom = new THREE.BoxGeometry(
  towerWidth + 0.4,
  roofSlabThickness,
  upperSetback + balconyDepth + 0.4
);
const lowerRoof = new THREE.Mesh(lowerRoofGeom, roofMat);
lowerRoof.position.set(
  towerWidth / 2,
  baseHeight + lowerFloors + roofSlabThickness/2,
  (-balconyDepth -0.2 + upperSetback)/2
);
building.add(lowerRoof);

// --------------------------
// UPPER ROOF AND PENTHOUSE
// --------------------------
// Upper roof slab
const upperRoofGeom = new THREE.BoxGeometry(
  towerWidth,
  roofSlabThickness,
  towerDepth - upperSetback
);
const upperRoof = new THREE.Mesh(upperRoofGeom, roofMat);
upperRoof.position.set(
  towerWidth/2,
  baseHeight + lowerFloors + upperFloors + roofSlabThickness/2,
  upperSetback + (towerDepth - upperSetback)/2
);
building.add(upperRoof);

// Penthouse structure with chamfered corner (same method as base)
const penthouseShape = new THREE.Shape();
const penthouseChamfer = 1.5;
penthouseShape.moveTo(balconyWidth, upperSetback);
penthouseShape.lineTo(towerWidth - penthouseChamfer, upperSetback);
penthouseShape.lineTo(towerWidth, upperSetback + penthouseChamfer);
penthouseShape.lineTo(towerWidth, upperSetback + 2.5);
penthouseShape.lineTo(balconyWidth, upperSetback + 2.5);
penthouseShape.closePath();

const penthouseGeom = new THREE.ExtrudeGeometry(penthouseShape, {
  depth: penthouseHeight,
  bevelEnabled: false
});
penthouseGeom.applyMatrix4(alignMatrix); // Reuse same alignment matrix from base
const penthouse = new THREE.Mesh(penthouseGeom, concreteMat);
penthouse.position.y = baseHeight + lowerFloors + upperFloors + roofSlabThickness;
building.add(penthouse);

// Parapet walls around upper roof perimeter
// West parapet
const parapetWestGeom = new THREE.BoxGeometry(0.15, parapetHeight, towerDepth - upperSetback);
const parapetWest = new THREE.Mesh(parapetWestGeom, concreteMat);
parapetWest.position.set(
  -0.075,
  baseHeight + lowerFloors + upperFloors + roofSlabThickness + parapetHeight/2,
  upperSetback + (towerDepth - upperSetback)/2
);
building.add(parapetWest);

// East parapet
const parapetEastGeom = new THREE.BoxGeometry(0.15, parapetHeight, towerDepth - upperSetback);
const parapetEast = new THREE.Mesh(parapetEastGeom, concreteMat);
parapetEast.position.set(
  towerWidth + 0.075,
  baseHeight + lowerFloors + upperFloors + roofSlabThickness + parapetHeight/2,
  upperSetback + (towerDepth - upperSetback)/2
);
building.add(parapetEast);

// North (back) parapet
const parapetNorthGeom = new THREE.BoxGeometry(towerWidth, parapetHeight, 0.15);
const parapetNorth = new THREE.Mesh(parapetNorthGeom, concreteMat);
parapetNorth.position.set(
  towerWidth/2,
  baseHeight + lowerFloors + upperFloors + roofSlabThickness + parapetHeight/2,
  towerDepth + 0.075
);
building.add(parapetNorth);

// --------------------------
// SMALL ATTACHED PODIUM (lower left)
// --------------------------
const podiumGeom = new THREE.BoxGeometry(podiumWidth, podiumHeight, podiumDepth);
const podium = new THREE.Mesh(podiumGeom, concreteMat);
podium.position.set(
  -podiumWidth/2,
  podiumHeight/2,
  0.5 + podiumDepth/2
);
building.add(podium);

// Podium roof parapet
const podiumParapetGeom = new THREE.BoxGeometry(podiumWidth + 0.1, 0.3, podiumDepth +0.1);
const podiumParapet = new THREE.Mesh(podiumParapetGeom, concreteMat);
podiumParapet.position.set(
  -podiumWidth/2,
  podiumHeight + 0.15,
  0.5 + podiumDepth/2
);
building.add(podiumParapet);

// Antenna poles on podium roof
const poleGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
const pole1 = new THREE.Mesh(poleGeom, metalMat);
pole1.position.set(-podiumWidth*0.7, podiumHeight + 0.4, 0.5 + podiumDepth*0.7);
building.add(pole1);
const pole2 = new THREE.Mesh(poleGeom, metalMat);
pole2.position.set(-podiumWidth*0.3, podiumHeight + 0.4, 0.5 + podiumDepth*0.3);
building.add(pole2);

// --------------------------
// CENTER BUILDING AND POSITION CAMERA
// --------------------------
// Shift building so its center is at origin for easy camera targeting
building.position.set(-towerWidth/2, 0, -towerDepth/2);
scene.add(building);

// Set camera to oblique front-right-elevated view matching reference
const totalBuildingHeight = baseHeight + lowerFloors + upperFloors + roofSlabThickness + penthouseHeight;
camera.position.set(14, totalBuildingHeight * 0.7, -18);
camera.lookAt(0, totalBuildingHeight/2, 0);