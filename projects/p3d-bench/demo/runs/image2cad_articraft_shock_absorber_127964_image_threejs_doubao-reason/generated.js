// Shock Absorber Parameters
const totalHeight = 22;
const mainRodRadius = 1.2;
const mainRodHeight = 13;
const springOuterRadius = 3;
const springWireRadius = 0.6;
const springTurns = 5.5;
const springHeight = 8.2;
const gearOuterRadius = 4;
const gearInnerRadius = 3;
const gearTeeth = 10;
const gearThickness = 0.8;
const endPlateRadius = 3.5;
const endPlateThickness = 0.5;
const mountRadius = 1.8;
const mountHeight = 2;
const mountLugRadius = 1.2;
const mountHoleRadius = 0.6;

// Shared metal material
const metalMat = new THREE.MeshStandardMaterial({
  color: 0xb8b8b8,
  metalness: 0.7,
  roughness: 0.3
});
const holeMat = new THREE.MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.5
});

// 1. Central piston rod
const rodGeom = new THREE.CylinderGeometry(mainRodRadius, mainRodRadius, mainRodHeight, 16);
const rod = new THREE.Mesh(rodGeom, metalMat);
scene.add(rod);

// 2. Helical spring
class HelixCurve extends THREE.Curve {
  constructor(rad, height, turns) {
    super();
    this.rad = rad;
    this.height = height;
    this.turns = turns;
  }
  getPoint(t) {
    const angle = t * Math.PI * 2 * this.turns;
    const y = -springHeight/2 + this.height * t;
    return new THREE.Vector3(
      Math.cos(angle) * this.rad,
      y,
      Math.sin(angle) * this.rad
    );
  }
}
const helixPath = new HelixCurve(springOuterRadius, springHeight, springTurns);
const springGeom = new THREE.TubeGeometry(helixPath, 128, springWireRadius, 12, false);
const spring = new THREE.Mesh(springGeom, metalMat);
scene.add(spring);

// 3. Upper adjustment gear (star shape)
const gearShape = new THREE.Shape();
for (let i = 0; i < gearTeeth * 2; i++) {
  const angle = (i / (gearTeeth * 2)) * Math.PI * 2;
  const r = i % 2 === 0 ? gearOuterRadius : gearInnerRadius;
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  i === 0 ? gearShape.moveTo(x, y) : gearShape.lineTo(x, y);
}
gearShape.lineTo(Math.cos(0) * gearInnerRadius, Math.sin(0) * gearInnerRadius);
const gearExtrudeSettings = { depth: gearThickness, bevelEnabled: false };
const gearGeom = new THREE.ExtrudeGeometry(gearShape, gearExtrudeSettings);
const gear = new THREE.Mesh(gearGeom, metalMat);
gear.rotation.x = Math.PI / 2;
gear.position.y = springHeight/2 + gearThickness/2 + 0.2;
scene.add(gear);

// 4. Upper spring retainer plate
const upperPlateGeom = new THREE.CylinderGeometry(endPlateRadius, endPlateRadius, endPlateThickness, 16);
const upperPlate = new THREE.Mesh(upperPlateGeom, metalMat);
upperPlate.position.y = springHeight/2 + endPlateThickness/2;
scene.add(upperPlate);

// 5. Lower spring retainer plate
const lowerPlateGeom = new THREE.CylinderGeometry(endPlateRadius, endPlateRadius, endPlateThickness, 16);
const lowerPlate = new THREE.Mesh(lowerPlateGeom, metalMat);
lowerPlate.position.y = -springHeight/2 - endPlateThickness/2;
scene.add(lowerPlate);

// Helper function to create end mounts (top and bottom identical)
function createMount(yPos) {
  // Mount body
  const bodyGeom = new THREE.CylinderGeometry(mountRadius, mountRadius, mountHeight, 16);
  const body = new THREE.Mesh(bodyGeom, metalMat);
  body.position.y = yPos;
  scene.add(body);

  // Side lugs
  const lugGeom = new THREE.CylinderGeometry(mountLugRadius, mountLugRadius, 0.7, 16);
  lugGeom.rotateY(Math.PI / 2);
  const lugLeft = new THREE.Mesh(lugGeom, metalMat);
  lugLeft.position.set(-mountRadius, yPos, 0);
  scene.add(lugLeft);
  const lugRight = new THREE.Mesh(lugGeom, metalMat);
  lugRight.position.set(mountRadius, yPos, 0);
  scene.add(lugRight);

  // Mount hole
  const holeGeom = new THREE.CylinderGeometry(mountHoleRadius, mountHoleRadius, mountRadius * 2 + 2, 12);
  holeGeom.rotateY(Math.PI / 2);
  const hole = new THREE.Mesh(holeGeom, holeMat);
  hole.position.y = yPos;
  scene.add(hole);
}

// Create top and bottom mounts
createMount(totalHeight/2 - mountHeight/2);
createMount(-totalHeight/2 + mountHeight/2);

// Adjust camera position
camera.position.set(18, 12, 18);
camera.lookAt(0, 0, 0);