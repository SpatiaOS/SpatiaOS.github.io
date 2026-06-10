// ============================================================
// Hose Reel Assembly Parameters
// Interpretation from image:
// - Two large circular flanges with bolt holes on the right face
// - Ribbed drum barrel between flanges (coiled hose / ribbed metal)
// - Top-left inlet pipe with 90° bend into left flange hub
// - Top valve with hexagonal nut and side outlet
// - Bottom outlet pipe with ball valve lever and tapered nozzle
// ============================================================

const flangeRadius = 6;
const flangeThickness = 0.4;
const drumWidth = 5;
const drumCoreRadius = 3.5;
const ribCount = 6;
const ribMajorRadius = 3.6;   // torus ring radius
const ribTubeRadius = 0.35;   // torus tube thickness
const pipeRadius = 0.3;
const bendRadius = 3.0;       // inlet pipe bend radius
const inletTopY = 11;

// Shared silver-metal material
const material = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  roughness: 0.4,
  metalness: 0.5
});

// --------------------------------------------------------
// Helper: Flange with 4 bolt holes (diamond pattern)
// --------------------------------------------------------
function createFlange(xPos, rotY) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, flangeRadius, 0, Math.PI * 2, false);

  const holeDist = 1.5;
  const holeRadius = 0.35;
  for (let i = 0; i < 4; i++) {
    const angle = Math.PI / 4 + (Math.PI / 2) * i; // 45°, 135°, 225°, 315°
    const hx = Math.cos(angle) * holeDist;
    const hy = Math.sin(angle) * holeDist;
    const hole = new THREE.Path();
    hole.absarc(hx, hy, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: flangeThickness,
    bevelEnabled: false,
    curveSegments: 32
  });
  const mesh = new THREE.Mesh(geom, material);
  mesh.rotation.y = rotY;
  mesh.position.x = xPos;
  return mesh;
}

// --------------------------------------------------------
// Drum flanges
// Left flange faces -X; right flange faces +X
// --------------------------------------------------------
const leftFlangeInnerX = -drumWidth / 2;
const rightFlangeInnerX = drumWidth / 2;
scene.add(createFlange(leftFlangeInnerX, Math.PI / 2));
scene.add(createFlange(rightFlangeInnerX, -Math.PI / 2));

// --------------------------------------------------------
// Drum core (central cylinder between flanges)
// --------------------------------------------------------
const coreGeom = new THREE.CylinderGeometry(drumCoreRadius, drumCoreRadius, drumWidth, 32);
coreGeom.rotateZ(Math.PI / 2);
const core = new THREE.Mesh(coreGeom, material);
scene.add(core);

// --------------------------------------------------------
// Ribbed surface / coiled hose represented by stacked torus rings
// --------------------------------------------------------
const ribSpacing = drumWidth / ribCount;
for (let i = 0; i < ribCount; i++) {
  const x = -drumWidth / 2 + ribSpacing / 2 + i * ribSpacing;
  const ribGeom = new THREE.TorusGeometry(ribMajorRadius, ribTubeRadius, 16, 32);
  const rib = new THREE.Mesh(ribGeom, material);
  rib.rotation.y = Math.PI / 2; // align ring plane perpendicular to drum axis
  rib.position.set(x, 0, 0);
  scene.add(rib);
}

// --------------------------------------------------------
// Inlet pipe assembly (top left)
// Vertical riser -> 90° torus bend -> left flange hub
// --------------------------------------------------------
const leftFlangeOuterX = leftFlangeInnerX - flangeThickness;
const inletPipeX = leftFlangeOuterX - bendRadius;

// Vertical riser
const riserHeight = inletTopY - bendRadius;
const riserGeom = new THREE.CylinderGeometry(pipeRadius, pipeRadius, riserHeight, 16);
const riser = new THREE.Mesh(riserGeom, material);
riser.position.set(inletPipeX, bendRadius + riserHeight / 2, 0);
scene.add(riser);

// 90° bend (quarter torus in XY plane)
const bendGeom = new THREE.TorusGeometry(bendRadius, pipeRadius, 16, 16, Math.PI / 2);
const bend = new THREE.Mesh(bendGeom, material);
bend.position.set(inletPipeX, 0, 0);
scene.add(bend);

// Hub on left flange where bend connects
const leftHubGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.8, 16);
leftHubGeom.rotateZ(Math.PI / 2);
const leftHub = new THREE.Mesh(leftHubGeom, material);
leftHub.position.set(leftFlangeOuterX - 0.4, 0, 0);
scene.add(leftHub);

// Top valve body
const inletValveGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.8, 16);
const inletValve = new THREE.Mesh(inletValveGeom, material);
inletValve.position.set(inletPipeX, inletTopY + 0.4, 0);
scene.add(inletValve);

// Hexagonal valve nut
const inletNutGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 6);
const inletNut = new THREE.Mesh(inletNutGeom, material);
inletNut.position.set(inletPipeX, inletTopY + 0.4 + 0.4 + 0.175, 0);
scene.add(inletNut);

// Side outlet on top valve (points left, -X)
const sideOutletGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
const sideOutlet = new THREE.Mesh(sideOutletGeom, material);
sideOutlet.rotation.z = Math.PI / 2;
sideOutlet.position.set(inletPipeX - 0.4, inletTopY + 0.4, 0);
scene.add(sideOutlet);

// --------------------------------------------------------
// Outlet assembly (bottom)
// Vertical drop -> coupling -> ball valve -> tapered nozzle
// --------------------------------------------------------
const outletStartY = -drumCoreRadius;
const outletDrop = 3.5;

// Pipe dropping from drum
const outPipeGeom = new THREE.CylinderGeometry(pipeRadius, pipeRadius, outletDrop, 16);
const outPipe = new THREE.Mesh(outPipeGeom, material);
outPipe.position.set(0, outletStartY - outletDrop / 2, 0);
scene.add(outPipe);

// Hex coupling below pipe
const couplingGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 6);
const coupling = new THREE.Mesh(couplingGeom, material);
coupling.position.set(0, outletStartY - outletDrop - 0.2, 0);
scene.add(coupling);

// Valve body (sphere)
const valveBodyGeom = new THREE.SphereGeometry(0.7, 16, 16);
const valveBody = new THREE.Mesh(valveBodyGeom, material);
valveBody.position.set(0, outletStartY - outletDrop - 0.8, 0);
scene.add(valveBody);

// Lever handle (points left)
const handleGeom = new THREE.BoxGeometry(2.2, 0.15, 0.15);
const handle = new THREE.Mesh(handleGeom, material);
handle.position.set(-0.8, outletStartY - outletDrop - 0.8, 0);
scene.add(handle);

// Tapered nozzle
const nozzleGeom = new THREE.CylinderGeometry(0.45, 0.1, 2.5, 16);
const nozzle = new THREE.Mesh(nozzleGeom, material);
nozzle.position.set(0, outletStartY - outletDrop - 0.8 - 0.7 - 1.25, 0);
scene.add(nozzle);

// --------------------------------------------------------
// Camera position to match the perspective view
// --------------------------------------------------------
camera.position.set(15, 10, 20);
camera.lookAt(0, 2, 0);