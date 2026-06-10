// Parameters
const baseLength = 20;
const baseWidth = 10;
const baseHeight = 2;

const wheelOuterRadius = 8;
const wheelInnerRadius = 6;
const wheelThickness = 2;
const spokeCount = 4;
const spokeRadius = 2;
const hubRadius = 1.5;
const hubHeight = 3;
const spokeDistance = (wheelOuterRadius + hubRadius) / 2;

const drumRadius = 3;
const drumHeight = 15;
const ropeThickness = 0.2;
const ropeCoils = 20;

const knobRadius = 0.5;
const knobHeight = 1;

const axleRadius = 0.5;
const axleLength = wheelOuterRadius * 2 + 5;

const supportWidth = 2;
const supportHeight = 5;
const supportDepth = 2;

// Base (rectangular platform)
const baseGeometry = new THREE.BoxGeometry(baseLength, baseHeight, baseWidth);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = baseHeight / 2;
scene.add(base);

// Wheel shape (with holes for hub and spokes)
const wheelShape = new THREE.Shape();
wheelShape.moveTo(wheelOuterRadius, 0);
wheelShape.absarc(0, 0, wheelOuterRadius, 0, Math.PI * 2, false);

// Hub hole
const hubHole = new THREE.Path();
hubHole.moveTo(hubRadius, 0);
hubHole.absarc(0, 0, hubRadius, 0, Math.PI * 2, true);
wheelShape.holes.push(hubHole);

// Spoke holes (4 holes)
for (let i = 0; i < spokeCount; i++) {
  const angle = (i * 2 * Math.PI) / spokeCount;
  const x = Math.cos(angle) * spokeDistance;
  const y = Math.sin(angle) * spokeDistance;
  const spokeHole = new THREE.Path();
  spokeHole.moveTo(x + spokeRadius, y);
  spokeHole.absarc(x, y, spokeRadius, 0, Math.PI * 2, true);
  wheelShape.holes.push(spokeHole);
}

// Extrude wheel shape to 3D
const wheelExtrudeSettings = {
  depth: wheelThickness,
  bevelEnabled: true,
  bevelThickness: 0.2,
  bevelSize: 0.2,
  bevelSegments: 2
};
const wheelGeometry = new THREE.ExtrudeGeometry(wheelShape, wheelExtrudeSettings);
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 });

// Create two wheels (left and right)
const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
leftWheel.position.set(-axleLength / 2, wheelThickness / 2, 0);
rightWheel.position.set(axleLength / 2, wheelThickness / 2, 0);
scene.add(leftWheel);
scene.add(rightWheel);

// Hub (cylindrical center of each wheel)
const hubGeometry = new THREE.CylinderGeometry(hubRadius, hubRadius, hubHeight, 16);
const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x606060 });

const leftHub = new THREE.Mesh(hubGeometry, hubMaterial);
leftHub.position.set(-axleLength / 2, wheelThickness / 2, 0);
scene.add(leftHub);

const rightHub = new THREE.Mesh(hubGeometry, hubMaterial);
rightHub.position.set(axleLength / 2, wheelThickness / 2, 0);
scene.add(rightHub);

// Axle (connects the two wheels)
const axleGeometry = new THREE.CylinderGeometry(axleRadius, axleRadius, axleLength, 16);
const axleMaterial = new THREE.MeshStandardMaterial({ color: 0x505050 });
const axle = new THREE.Mesh(axleGeometry, axleMaterial);
axle.rotation.z = Math.PI / 2; // Align along x-axis
axle.position.set(0, wheelThickness / 2, 0);
scene.add(axle);

// Drum (cylindrical component with rope)
const drumGeometry = new THREE.CylinderGeometry(drumRadius, drumRadius, drumHeight, 32);
const drumMaterial = new THREE.MeshStandardMaterial({ color: 0x707070 });
const drum = new THREE.Mesh(drumGeometry, drumMaterial);
drum.position.set(0, baseHeight + drumRadius, -axleLength / 2 - drumHeight / 2);
scene.add(drum);

// Knob (on top of the drum)
const knobGeometry = new THREE.CylinderGeometry(knobRadius, knobRadius, knobHeight, 16);
const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x909090 });
const knob = new THREE.Mesh(knobGeometry, knobMaterial);
knob.position.set(0, drum.position.y + drumHeight / 2 + knobHeight / 2, drum.position.z);
scene.add(knob);

// Rope (series of torus coils around the drum)
const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x303030 });
for (let i = 0; i < ropeCoils; i++) {
  const torusGeometry = new THREE.TorusGeometry(drumRadius + ropeThickness, ropeThickness, 8, 32);
  const ropeCoil = new THREE.Mesh(torusGeometry, ropeMaterial);
  ropeCoil.position.set(0, drum.position.y - drumHeight / 2 + (i * drumHeight / ropeCoils), drum.position.z);
  ropeCoil.rotation.x = Math.PI / 2; // Align with drum axis
  scene.add(ropeCoil);
}

// Supports (hold the axle and wheels)
const supportGeometry = new THREE.BoxGeometry(supportWidth, supportHeight, supportDepth);
const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x606060 });

const leftSupport = new THREE.Mesh(supportGeometry, supportMaterial);
leftSupport.position.set(-axleLength / 2, baseHeight + supportHeight / 2, 0);
scene.add(leftSupport);

const rightSupport = new THREE.Mesh(supportGeometry, supportMaterial);
rightSupport.position.set(axleLength / 2, baseHeight + supportHeight / 2, 0);
scene.add(rightSupport);

// Adjust camera for viewing
camera.position.set(30, 20, 30);
camera.lookAt(0, 0, 0);