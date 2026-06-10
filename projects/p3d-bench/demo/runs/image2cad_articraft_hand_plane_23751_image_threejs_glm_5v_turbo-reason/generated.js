// Parameters - Router Plane / Precision Tool Model
const baseLength = 14;
const baseWidth = 8;
const baseThickness = 0.8;

// Knob parameters
const knobRadius = 1.4;
const knobPedestalRadius = 1.0;
const knobPedestalHeight = 0.6;

// Center mechanism parameters
const centerPostHeight = 3.5;
const centerPostRadius = 0.35;
const adjustScrewHeight = 2.8;
const adjustScrewRadius = 0.25;

// Material - metallic gray finish
const material = new THREE.MeshStandardMaterial({ 
  color: 0x888888,
  metalness: 0.6,
  roughness: 0.35
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: 0x444444,
  metalness: 0.7,
  roughness: 0.3
});

// Helper function to create spherical knob with pedestal
function createKnob(x, z) {
  const group = new THREE.Group();
  
  // Pedestal base
  const pedestalGeo = new THREE.CylinderGeometry(knobPedestalRadius * 0.9, knobPedestalRadius, knobPedestalHeight, 32);
  const pedestal = new THREE.Mesh(pedestalGeo, material);
  pedestal.position.y = knobPedestalHeight / 2;
  group.add(pedestal);
  
  // Flange ring under sphere
  const flangeGeo = new THREE.TorusGeometry(knobPedestalRadius * 0.85, 0.15, 16, 32);
  const flange = new THREE.Mesh(flangeGeo, material);
  flange.rotation.x = Math.PI / 2;
  flange.position.y = knobPedestalHeight;
  group.add(flange);
  
  // Spherical handle top
  const sphereGeo = new THREE.SphereGeometry(knobRadius, 32, 24);
  const sphere = new THREE.Mesh(sphereGeo, material);
  sphere.position.y = knobPedestalHeight + knobRadius * 0.85;
  group.add(sphere);
  
  // Flat slot on top of knob
  const slotGeo = new THREE.BoxGeometry(knobRadius * 0.8, 0.12, 0.15);
  const slot = new THREE.Mesh(slotGeo, darkMaterial);
  slot.position.y = knobPedestalHeight + knobRadius * 1.75;
  group.add(slot);
  
  group.position.set(x, 0, z);
  return group;
}

// Create main base using extruded shape for organic form
function createBase() {
  const shape = new THREE.Shape();
  
  // Define the organic base profile
  shape.moveTo(-baseLength * 0.45, -baseWidth * 0.55);
  shape.quadraticCurveTo(-baseLength * 0.5, 0, -baseLength * 0.45, baseWidth * 0.45);
  shape.quadraticCurveTo(-baseLength * 0.3, baseWidth * 0.55, 0, baseWidth * 0.5);
  shape.quadraticCurveTo(baseLength * 0.35, baseWidth * 0.58, baseLength * 0.48, baseWidth * 0.35);
  shape.quadraticCurveTo(baseLength * 0.52, 0, baseLength * 0.48, -baseWidth * 0.4);
  shape.quadraticCurveTo(baseLength * 0.35, -baseWidth * 0.55, 0, -baseWidth * 0.5);
  shape.quadraticCurveTo(-baseLength * 0.25, -baseWidth * 0.58, -baseLength * 0.45, -baseWidth * 0.55);

  // Cutout in front center (arch)
  const holePath = new THREE.Path();
  holePath.moveTo(-1.5, -baseWidth * 0.42);
  holePath.absarc(0, -baseWidth * 0.35, 1.8, Math.PI, 0, true);
  holePath.lineTo(1.8, -baseWidth * 0.42);
  shape.holes.push(holePath);

  const extrudeSettings = {
    depth: baseThickness,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.15,
    bevelSegments: 3
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(-Math.PI / 2);
  
  return new THREE.Mesh(geometry, material);
}

// Create center post assembly
function createCenterMechanism(x, z) {
  const group = new THREE.Group();
  
  // Main vertical post
  const postGeo = new THREE.CylinderGeometry(centerPostRadius, centerPostRadius * 1.2, centerPostHeight, 16);
  const post = new THREE.Mesh(postGeo, material);
  post.position.y = centerPostHeight / 2;
  group.add(post);
  
  // Post cap
  const capGeo = new THREE.CylinderGeometry(centerPostRadius * 1.3, centerPostRadius, 0.3, 16);
  const cap = new THREE.Mesh(capGeo, material);
  cap.position.y = centerPostHeight;
  group.add(cap);
  
  group.position.set(x, baseThickness, z);
  return group;
}

// Create adjustment screw with thumb wheel
function createAdjustmentAssembly(x, z) {
  const group = new THREE.Group();
  
  // Lower mounting cylinder
  const mountGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.8, 24);
  const mount = new THREE.Mesh(mountGeo, material);
  mount.position.y = 0.4;
  group.add(mount);
  
  // Screw shaft
  const shaftGeo = new THREE.CylinderGeometry(adjustScrewRadius, adjustScrewRadius, adjustScrewHeight, 16);
  const shaft = new THREE.Mesh(shaftGeo, material);
  shaft.position.y = 0.8 + adjustScrewHeight / 2;
  group.add(shaft);
  
  // Thread indication (visual only - ridged appearance via slightly larger cylinders)
  for (let i = 0; i < 12; i++) {
    const threadGeo = new THREE.TorusGeometry(adjustScrewRadius + 0.03, 0.04, 8, 16);
    const thread = new THREE.Mesh(threadGeo, darkMaterial);
    thread.rotation.x = Math.PI / 2;
    thread.position.y = 1.0 + i * 0.18;
    group.add(thread);
  }
  
  // Thumb wheel (knurled adjustment knob)
  const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.35, 24);
  const wheel = new THREE.Mesh(wheelGeo, material);
  wheel.position.y = 0.8 + adjustScrewHeight + 0.17;
  group.add(wheel);
  
  // Wheel knurling marks
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const knurlGeo = new THREE.BoxGeometry(0.06, 0.38, 0.08);
    const knurl = new THREE.Mesh(knurlGeo, darkMaterial);
    knurl.position.set(Math.cos(angle) * 0.62, 0.8 + adjustScrewHeight + 0.17, Math.sin(angle) * 0.62);
    knurl.rotation.y = -angle;
    group.add(knurl);
  }
  
  // Top nut
  const nutGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 6);
  const nut = new THREE.Mesh(nutGeo, darkMaterial);
  nut.position.y = 0.8 + adjustScrewHeight + 0.65;
  group.add(nut);
  
  // Side thumb screw
  const sideScrewGroup = new THREE.Group();
  const sideShaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 12);
  const sideShaft = new THREE.Mesh(sideShaftGeo, material);
  sideShaft.rotation.z = Math.PI / 2;
  sideShaft.position.x = 0.5;
  sideScrewGroup.add(sideShaft);
  
  const sideHeadGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16);
  const sideHead = new THREE.Mesh(sideHeadGeo, material);
  sideHead.rotation.z = Math.PI / 2;
  sideHead.position.x = 1.05;
  sideScrewGroup.add(sideHead);
  
  sideScrewGroup.position.set(0, 2.2, 0);
  sideScrewGroup.rotation.y = Math.PI / 6;
  group.add(sideScrewGroup);
  
  group.position.set(x, baseThickness, z);
  return group;
}

// Create secondary smaller post
function createSmallPost(x, z, height) {
  const geo = new THREE.CylinderGeometry(0.28, 0.32, height, 12);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, baseThickness + height / 2, z);
  return mesh;
}

// Build the complete model
const model = new THREE.Group();

// Add main base
const base = createBase();
model.add(base);

// Add left knob (rear-left position)
const leftKnob = createKnob(-baseLength * 0.38, -baseWidth * 0.22);
model.add(leftKnob);

// Add right knob (front-right position)
const rightKnob = createKnob(baseLength * 0.38, baseWidth * 0.18);
model.add(rightKnob);

// Add center mechanisms
const centerPost1 = createCenterMechanism(-1.8, -0.5);
model.add(centerPost1);

const centerPost2 = createCenterMechanism(0.3, 0.8);
model.add(centerPost2);

// Add adjustment screw assembly
const adjustAssembly = createAdjustmentAssembly(1.2, -0.2);
model.add(adjustAssembly);

// Add small secondary post
const smallPost = createSmallPost(-2.8, 1.0, 2.8);
model.add(smallPost);

// Add decorative detail plates on base
const plateGeo = new THREE.BoxGeometry(1.8, 0.08, 0.9);
const plate1 = new THREE.Mesh(plateGeo, darkMaterial);
plate1.position.set(-2.0, baseThickness + 0.04, 0.5);
plate1.rotation.y = 0.3;
model.add(plate1);

const plate2 = new THREE.Mesh(plateGeo, darkMaterial);
plate2.position.set(3.0, baseThickness + 0.04, 1.2);
plate2.rotation.y = -0.2;
model.add(plate2);

// Add small fastener heads (decorative screws)
function addScrewHead(x, z) {
  const screwGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12);
  const screw = new THREE.Mesh(screwGeo, darkMaterial);
  screw.position.set(x, baseThickness + 0.05, z);
  return screw;
}

model.add(addScrewHead(-3.5, -1.5));
model.add(addScrewHead(3.8, 2.0));
model.add(addScrewHead(-1.0, 2.2));

scene.add(model);

// Position camera for good viewing angle
camera.position.set(18, 14, 20);
camera.lookAt(0, 1, 0);