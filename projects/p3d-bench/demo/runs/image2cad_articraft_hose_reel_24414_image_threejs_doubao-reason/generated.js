// --------------------------
// Parameters (proportional to reference drawing)
// --------------------------
// Reel core and flanges
const flangeDiameter = 24;
const flangeThickness = 1;
const spoolCoreDiameter = 12;
const spoolLength = 10;
const hoseRadius = 0.8;
const hoseCoilCount = 7;

// Top outlet hose + nozzle
const outletVerticalHoseLength = 22;
const nozzleHexSize = 1.8;
const nozzleHeight = 2.5;

// Bottom inlet hose + valve
const inletHoseLength = 12;
const valveBodySize = 2;
const valveLeverLength = 3;
const bottomOutletLength = 3;

// Shared stainless steel material
const steelMat = new THREE.MeshStandardMaterial({
  color: 0xC2C2C2,
  metalness: 0.85,
  roughness: 0.25
});

// --------------------------
// Reel Assembly
// --------------------------
// Left flange (disk)
const flangeGeom = new THREE.CylinderGeometry(flangeDiameter/2, flangeDiameter/2, flangeThickness, 64);
flangeGeom.rotateX(Math.PI / 2); // Orient disk along Z axis
const leftFlange = new THREE.Mesh(flangeGeom, steelMat);
leftFlange.position.z = -spoolLength/2 - flangeThickness/2;
scene.add(leftFlange);

// Right flange (disk)
const rightFlange = new THREE.Mesh(flangeGeom, steelMat);
rightFlange.position.z = spoolLength/2 + flangeThickness/2;
scene.add(rightFlange);

// 4 mounting bolts on right flange
const boltGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 6);
boltGeom.rotateX(Math.PI / 2);
const boltOffsets = [
  [flangeDiameter/4, flangeDiameter/4],
  [-flangeDiameter/4, flangeDiameter/4],
  [-flangeDiameter/4, -flangeDiameter/4],
  [flangeDiameter/4, -flangeDiameter/4]
];
boltOffsets.forEach(([x, y]) => {
  const bolt = new THREE.Mesh(boltGeom, steelMat);
  bolt.position.set(x, y, rightFlange.position.z + flangeThickness/2 + 0.2);
  scene.add(bolt);
});

// Spool core (inner cylinder for wrapping hose)
const spoolCoreGeom = new THREE.CylinderGeometry(spoolCoreDiameter/2, spoolCoreDiameter/2, spoolLength, 64);
spoolCoreGeom.rotateX(Math.PI / 2);
const spoolCore = new THREE.Mesh(spoolCoreGeom, steelMat);
scene.add(spoolCore);

// Coiled hose on spool
const coilRadius = spoolCoreDiameter/2 + hoseRadius;
const coilSpacing = spoolLength / (hoseCoilCount - 1);
for (let i = 0; i < hoseCoilCount; i++) {
  const coilGeom = new THREE.TorusGeometry(coilRadius, hoseRadius, 16, 64);
  coilGeom.rotateX(Math.PI / 2);
  const coil = new THREE.Mesh(coilGeom, steelMat);
  coil.position.z = -spoolLength/2 + i * coilSpacing;
  scene.add(coil);
}

// --------------------------
// Top Outlet Hose + Nozzle
// --------------------------
// Curved + vertical outlet hose path
const outletPath = new THREE.CurvePath();
// 90 degree bend coming off leftmost coil
const bendCurve = new THREE.ArcCurve(0, 0, coilRadius, 0, Math.PI/2, false);
const bendPoints = bendCurve.getPoints(32).map(p => new THREE.Vector3(p.x, p.y, -spoolLength/2));
outletPath.add(new THREE.CatmullRomCurve3(bendPoints));
// Straight vertical segment up
const verticalStart = new THREE.Vector3(0, coilRadius, -spoolLength/2);
const verticalEnd = new THREE.Vector3(0, coilRadius + outletVerticalHoseLength, -spoolLength/2);
outletPath.add(new THREE.LineCurve3(verticalStart, verticalEnd));
// Hose geometry
const outletHoseGeom = new THREE.TubeGeometry(outletPath, 64, hoseRadius, 16, false);
const outletHose = new THREE.Mesh(outletHoseGeom, steelMat);
scene.add(outletHose);

// Nozzle assembly
const nozzleBaseGeom = new THREE.CylinderGeometry(hoseRadius*1.2, hoseRadius*1.2, 1, 16);
const nozzleBase = new THREE.Mesh(nozzleBaseGeom, steelMat);
nozzleBase.position.copy(verticalEnd);
nozzleBase.position.y += 0.5;
scene.add(nozzleBase);

// Hex valve head
const nozzleHexGeom = new THREE.CylinderGeometry(nozzleHexSize, nozzleHexSize, nozzleHeight, 6);
const nozzleHex = new THREE.Mesh(nozzleHexGeom, steelMat);
nozzleHex.position.copy(nozzleBase.position);
nozzleHex.position.y += nozzleHeight/2 + 0.5;
scene.add(nozzleHex);

// Nozzle tip
const nozzleTipGeom = new THREE.CylinderGeometry(hoseRadius*0.8, hoseRadius*0.6, 1, 16);
const nozzleTip = new THREE.Mesh(nozzleTipGeom, steelMat);
nozzleTip.position.set(-nozzleHexSize * 0.7, nozzleHex.position.y, -spoolLength/2);
nozzleTip.rotation.z = Math.PI/2;
scene.add(nozzleTip);

// --------------------------
// Bottom Inlet Hose + Valve
// --------------------------
// Straight inlet hose down
const inletStart = new THREE.Vector3(0, -coilRadius, spoolLength/2);
const inletEnd = new THREE.Vector3(0, -coilRadius - inletHoseLength, spoolLength/2);
const inletHoseGeom = new THREE.CylinderGeometry(hoseRadius, hoseRadius, inletHoseLength, 16);
const inletHose = new THREE.Mesh(inletHoseGeom, steelMat);
inletHose.position.copy(inletStart).add(inletEnd).multiplyScalar(0.5);
scene.add(inletHose);

// Valve assembly
const valveConnectorGeom = new THREE.CylinderGeometry(hoseRadius*1.2, hoseRadius*1.2, 1, 16);
const valveConnector = new THREE.Mesh(valveConnectorGeom, steelMat);
valveConnector.position.copy(inletEnd);
valveConnector.position.y -= 0.5;
scene.add(valveConnector);

const valveBodyGeom = new THREE.CylinderGeometry(valveBodySize, valveBodySize, valveBodySize*1.5, 16);
const valveBody = new THREE.Mesh(valveBodyGeom, steelMat);
valveBody.position.copy(valveConnector.position);
valveBody.position.y -= valveBodySize*0.75 + 0.5;
scene.add(valveBody);

// Valve lever handle
const leverGeom = new THREE.BoxGeometry(valveLeverLength, 0.3, 0.6);
const lever = new THREE.Mesh(leverGeom, steelMat);
lever.position.copy(valveBody.position);
lever.position.x -= valveLeverLength/2 + valveBodySize*0.3;
lever.rotation.z = -Math.PI/6;
scene.add(lever);

// Bottom outlet nozzle
const bottomNozzleGeom = new THREE.CylinderGeometry(hoseRadius*1.1, hoseRadius*0.7, bottomOutletLength, 16);
const bottomNozzle = new THREE.Mesh(bottomNozzleGeom, steelMat);
bottomNozzle.position.copy(valveBody.position);
bottomNozzle.position.y -= bottomOutletLength/2 + valveBodySize*0.75;
scene.add(bottomNozzle);

// --------------------------
// Camera Setup
// --------------------------
camera.position.set(45, 35, 45);
camera.lookAt(0, 0, 0);