// Fan parameters (standard 80x80x25mm PC cooling fan, matches standard proportions)
const fanSize = 80; // Square outer dimension of fan frame
const fanThickness = 25; // Total depth of the fan
const flangeThickness = 2; // Thickness of top/bottom mounting flanges
const mountingHoleDiameter = 3; // Diameter of screw mounting holes
const mountingHoleOffset = 7; // Distance from frame edge to mounting hole center
const innerShroudDiameter = 72; // Diameter of internal cylindrical fan housing
const hubDiameter = 25; // Diameter of center rotor hub
const hubHeight = 10; // Height of center hub
const bladeCount = 7; // Number of fan blades, matches reference image
const bladePitchAngle = Math.PI / 6; // 30 degree blade pitch for airflow
const materialColor = 0xaaaaaa; // Light gray plastic finish
const postSize = 4; // Size of corner connecting posts between flanges
const bladeThickness = 1; // Thickness of individual fan blades

// Shared plastic material for all fan components
const fanMaterial = new THREE.MeshStandardMaterial({ color: materialColor });

// ------------------------------
// Frame construction
// ------------------------------
// Create 2D shape for mounting flanges with cutouts
const flangeShape = new THREE.Shape();
// Outer square profile
flangeShape.moveTo(-fanSize/2, -fanSize/2);
flangeShape.lineTo(fanSize/2, -fanSize/2);
flangeShape.lineTo(fanSize/2, fanSize/2);
flangeShape.lineTo(-fanSize/2, fanSize/2);
flangeShape.closePath();

// Add large center cutout for fan blades
const centerHole = new THREE.Path();
centerHole.absarc(0, 0, innerShroudDiameter/2, 0, Math.PI * 2);
flangeShape.holes.push(centerHole);

// Add 4 corner mounting holes
const holePositions = [
  [fanSize/2 - mountingHoleOffset, fanSize/2 - mountingHoleOffset],
  [fanSize/2 - mountingHoleOffset, -fanSize/2 + mountingHoleOffset],
  [-fanSize/2 + mountingHoleOffset, -fanSize/2 + mountingHoleOffset],
  [-fanSize/2 + mountingHoleOffset, fanSize/2 - mountingHoleOffset]
];
// Fixed: added forEach to iterate over hole positions array
holePositions.forEach(pos => {
  const hole = new THREE.Path();
  hole.absarc(pos[0], pos[1], mountingHoleDiameter/2, 0, Math.PI * 2);
  flangeShape.holes.push(hole);
});

// Extrude 2D shape to create 3D flange geometry
const flangeGeometry = new THREE.ExtrudeGeometry(flangeShape, { depth: flangeThickness, bevelEnabled: false });

// Top flange
const topFlange = new THREE.Mesh(flangeGeometry, fanMaterial);
topFlange.position.z = fanThickness/2 - flangeThickness;
scene.add(topFlange);

// Bottom flange (flipped to face downward)
const bottomFlange = new THREE.Mesh(flangeGeometry, fanMaterial);
bottomFlange.rotation.x = Math.PI;
bottomFlange.position.z = -fanThickness/2 + flangeThickness;
scene.add(bottomFlange);

// Internal cylindrical shroud
const shroudGeometry = new THREE.CylinderGeometry(innerShroudDiameter/2, innerShroudDiameter/2, fanThickness - flangeThickness * 2, 32);
const shroud = new THREE.Mesh(shroudGeometry, fanMaterial);
shroud.rotation.x = Math.PI / 2; // Align cylinder to Z axis
scene.add(shroud);

// Corner connecting posts between top and bottom flanges
const postGeometry = new THREE.BoxGeometry(postSize, postSize, fanThickness - flangeThickness * 2);
const postPositions = [
  [fanSize/2 - postSize/2, fanSize/2 - postSize/2],
  [fanSize/2 - postSize/2, -fanSize/2 + postSize/2],
  [-fanSize/2 + postSize/2, -fanSize/2 + postSize/2],
  [-fanSize/2 + postSize/2, fanSize/2 - postSize/2]
];
postPositions.forEach(pos => {
  const post = new THREE.Mesh(postGeometry, fanMaterial);
  post.position.set(pos[0], pos[1], 0);
  scene.add(post);
});

// ------------------------------
// Rotor construction
// ------------------------------
// Center rotor hub
const hubGeometry = new THREE.CylinderGeometry(hubDiameter/2, hubDiameter/2, hubHeight, 32);
const hub = new THREE.Mesh(hubGeometry, fanMaterial);
hub.rotation.x = Math.PI / 2;
scene.add(hub);

// Fan blades
const bladeLength = (innerShroudDiameter/2) - (hubDiameter/2) - 1; // 1mm gap between blade tip and shroud
const bladeWidth = 15;
// Fixed: replaced pitch angle with actual blade thickness for BoxGeometry parameter
const bladeGeometry = new THREE.BoxGeometry(bladeLength, bladeWidth, bladeThickness);
for (let i = 0; i < bladeCount; i++) {
  const blade = new THREE.Mesh(bladeGeometry, fanMaterial);
  // Position blade extending from hub to shroud
  blade.position.x = (hubDiameter/2) + (bladeLength / 2);
  // Apply blade pitch angle
  blade.rotation.y = bladePitchAngle;
  // Rotate blade around fan center axis
  blade.rotation.z = (i / bladeCount) * Math.PI * 2;
  scene.add(blade);
}

// ------------------------------
// Camera setup (isometric view matching reference)
// ------------------------------
camera.position.set(120, 120, 120);
camera.lookAt(0, 0, 0);