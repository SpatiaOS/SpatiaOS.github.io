// ========== Parameters ==========
// Material (cast grey metal)
const metalColor = 0x9aa0a6;
const metalRoughness = 0.8;
const metalMetalness = 0.4;

// Flywheel & gear dimensions
const flywheelOuterRadius = 10;
const flywheelThickness = 1.8;
const flywheelRimWidth = 1.2;
const flywheelInnerRadius = flywheelOuterRadius - flywheelRimWidth;
const ringTeethCount = 72;
const gearToothLength = 0.25;
const gearToothWidth = 0.3;
const planetOrbitRadius = 6.3; // Distance from main axis to planet gear centers
const planetTeethCount = 18;
const planetRootRadius = 2.0;
const planetThickness = 1.5;
const sunTeethCount = 36;
const sunRootRadius = 3.8;
const sunThickness = 1.5;
const planetPinRadius = 0.25;
const planetPinLength = 2.2;
const carrierHubRadius = 1.4;
const carrierPlateThickness = 0.4;
const carrierSpokeWidth = 0.7;
const flywheelHubRadius = 1.8;
const flywheelHubLength = 1.0;
const flywheelSpokeWidth = 0.9;
const flywheelSpokeThickness = 0.8;

// Shaft & crank dimensions
const mainShaftRadius = 0.9;
const mainShaftTotalLength = 8.0;
const crankAngle = 120 * Math.PI / 180; // Pointing up-left
const shortCrankLength = 7.0;
const shortCrankZ = -1.0;
const shortCrankWidth = 0.7;
const shortCrankThickness = 0.6;
const longCrankLength = 15.0;
const longCrankZ = -3.0;
const longCrankWidth = 1.0;
const longCrankThickness = 0.6;
const handleRadius = 0.35;
const handleLength = 1.8;
const smallPinLength = 1.5;
const smallPinAngle = -60 * Math.PI / 180; // Pointing down-right
const smallPinGripRadius = 0.25;
const smallPinGripLength = 0.8;
const bearingHubRadius = 1.5;
const bearingHubLength = 2.0;
const endCapRadius = 1.0;
const endCapLength = 0.3;

// Stand dimensions
const standPlateThickness = 1.0;
const standFrontCorner = { x: -2, y: -10.5 };
const standBackCorner = { x: 3, y: -9.5 };
const rearSupportLength = 4.0;
const rearSupportWidth = 2.0;
const rearSupportHeight = 0.8;
const footPadSize = 1.5;
const footPadHeight = 0.6;
const rearFootLength = 6.0;
const rearFootWidth = 1.0;
const footY = -10.8;

// ========== Material ==========
const metalMat = new THREE.MeshStandardMaterial({
  color: metalColor,
  roughness: metalRoughness,
  metalness: metalMetalness
});

// ========== Helper Functions ==========
// Create a single planet gear (disk + external teeth)
function createPlanetGear() {
  const group = new THREE.Group();
  
  // Gear base disk
  const diskGeo = new THREE.CylinderGeometry(
    planetRootRadius, planetRootRadius, planetThickness, 32
  );
  const disk = new THREE.Mesh(diskGeo, metalMat);
  disk.rotation.x = Math.PI / 2;
  group.add(disk);

  // External teeth
  const toothGeo = new THREE.BoxGeometry(
    gearToothLength, gearToothWidth, planetThickness
  );
  for (let i = 0; i < planetTeethCount; i++) {
    const theta = i * Math.PI * 2 / planetTeethCount;
    const tooth = new THREE.Mesh(toothGeo, metalMat);
    const r = planetRootRadius + gearToothLength / 2;
    tooth.position.set(
      r * Math.cos(theta),
      r * Math.sin(theta),
      0
    );
    tooth.rotation.z = theta;
    group.add(tooth);
  }
  return group;
}

// Create a planet carrier plate (hub + 3 spokes)
function createCarrier(zPos) {
  const group = new THREE.Group();
  
  // Central hub
  const hubGeo = new THREE.CylinderGeometry(
    carrierHubRadius, carrierHubRadius, carrierPlateThickness, 24
  );
  const hub = new THREE.Mesh(hubGeo, metalMat);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = zPos;
  group.add(hub);

  // Three spokes
  const spokeLength = planetOrbitRadius - carrierHubRadius;
  const spokeGeo = new THREE.BoxGeometry(
    spokeLength, carrierSpokeWidth, carrierPlateThickness
  );
  for (let i = 0; i < 3; i++) {
    const theta = i * Math.PI * 2 / 3;
    const spoke = new THREE.Mesh(spokeGeo, metalMat);
    const r = carrierHubRadius + spokeLength / 2;
    spoke.position.set(
      r * Math.cos(theta),
      r * Math.sin(theta),
      zPos
    );
    spoke.rotation.z = theta;
    group.add(spoke);
  }
  return group;
}

// ========== Build Stand Assembly ==========
// Main triangular stand plate
const standShape = new THREE.Shape();
standShape.moveTo(0, 0);
standShape.lineTo(standFrontCorner.x, standFrontCorner.y);
standShape.lineTo(standBackCorner.x, standBackCorner.y);
standShape.lineTo(0, 0);
const standGeo = new THREE.ExtrudeGeometry(standShape, {
  depth: standPlateThickness,
  bevelEnabled: false,
  curveSegments: 12
});
const stand = new THREE.Mesh(standGeo, metalMat);
stand.position.z = -standPlateThickness / 2;
scene.add(stand);

// Bearing hub at top of stand
const bearingHubGeo = new THREE.CylinderGeometry(
  bearingHubRadius, bearingHubRadius, bearingHubLength, 24
);
const bearingHub = new THREE.Mesh(bearingHubGeo, metalMat);
bearingHub.rotation.x = Math.PI / 2;
bearingHub.position.z = 0;
scene.add(bearingHub);

// Rear support bar
const rearSupportGeo = new THREE.BoxGeometry(
  rearSupportWidth, rearSupportHeight, rearSupportLength
);
const rearSupport = new THREE.Mesh(rearSupportGeo, metalMat);
rearSupport.position.set(
  standBackCorner.x + rearSupportWidth / 2,
  footY + footPadHeight / 2 + rearSupportHeight / 2,
  rearSupportLength / 2
);
scene.add(rearSupport);

// Foot pads
const frontFootGeo = new THREE.BoxGeometry(footPadSize, footPadHeight, footPadSize);
const frontFoot = new THREE.Mesh(frontFootGeo, metalMat);
frontFoot.position.set(
  standFrontCorner.x,
  footY,
  -standPlateThickness / 2
);
scene.add(frontFoot);

const standBackFootGeo = new THREE.BoxGeometry(footPadSize, footPadHeight, footPadSize);
const standBackFoot = new THREE.Mesh(standBackFootGeo, metalMat);
standBackFoot.position.set(
  standBackCorner.x,
  standFrontCorner.y,
  standPlateThickness / 2
);
scene.add(standBackFoot);

const rearFootGeo = new THREE.BoxGeometry(rearFootLength, footPadHeight, rearFootWidth);
const rearFoot = new THREE.Mesh(rearFootGeo, metalMat);
rearFoot.position.set(
  5, footY, rearSupportLength + rearFootWidth / 2 - 0.5
);
scene.add(rearFoot);

// ========== Build Shaft & Crank Assembly ==========
// Main shaft
const shaftGeo = new THREE.CylinderGeometry(
  mainShaftRadius, mainShaftRadius, mainShaftTotalLength, 24
);
const shaft = new THREE.Mesh(shaftGeo, metalMat);
shaft.rotation.x = Math.PI / 2;
shaft.position.z = 0;
scene.add(shaft);

// Rear shaft end cap
const endCapGeo = new THREE.CylinderGeometry(
  endCapRadius, endCapRadius, endCapLength, 16
);
const rearCap = new THREE.Mesh(endCapGeo, metalMat);
rearCap.rotation.x = Math.PI / 2;
rearCap.position.z = mainShaftTotalLength/2 + endCapLength/2;
scene.add(rearCap);

// Short crank arm
const shortCrankGeo = new THREE.BoxGeometry(
  shortCrankLength, shortCrankWidth, shortCrankThickness
);
const shortCrank = new THREE.Mesh(shortCrankGeo, metalMat);
shortCrank.position.set(shortCrankLength / 2, 0, shortCrankZ);
shortCrank.rotation.z = crankAngle;
scene.add(shortCrank);

// Long crank arm
const longCrankGeo = new THREE.BoxGeometry(
  longCrankLength, longCrankWidth, longCrankThickness
);
const longCrank = new THREE.Mesh(longCrankGeo, metalMat);
longCrank.position.set(longCrankLength / 2, 0, longCrankZ);
longCrank.rotation.z = crankAngle;
scene.add(longCrank);

// Crank arm set screw bosses (square details)
const bossGeo = new THREE.BoxGeometry(0.9, 0.9, 0.7);
const shortBoss = new THREE.Mesh(bossGeo, metalMat);
shortBoss.position.set(0, 0, shortCrankZ);
shortBoss.rotation.z = crankAngle;
scene.add(shortBoss);

const longBoss = new THREE.Mesh(bossGeo, metalMat);
longBoss.position.set(0, 0, longCrankZ);
longBoss.rotation.z = crankAngle;
scene.add(longBoss);

// Crank handles
const handleGeo = new THREE.CylinderGeometry(
  handleRadius, handleRadius, handleLength, 16
);
const shortHandle = new THREE.Mesh(handleGeo, metalMat);
shortHandle.rotation.x = Math.PI / 2;
shortHandle.position.set(
  shortCrankLength * Math.cos(crankAngle),
  shortCrankLength * Math.sin(crankAngle),
  shortCrankZ - handleLength / 2
);
scene.add(shortHandle);

const longHandle = new THREE.Mesh(handleGeo, metalMat);
longHandle.rotation.x = Math.PI / 2;
longHandle.position.set(
  longCrankLength * Math.cos(crankAngle),
  longCrankLength * Math.sin(crankAngle),
  longCrankZ - handleLength / 2
);
scene.add(longHandle);

// Small down-right starter pin
const smallPinGeo = new THREE.BoxGeometry(smallPinLength, 0.4, 0.4);
const smallPin = new THREE.Mesh(smallPinGeo, metalMat);
smallPin.position.set(smallPinLength / 2, 0, 0.2);
smallPin.rotation.z = smallPinAngle;
scene.add(smallPin);

const smallGripGeo = new THREE.CylinderGeometry(
  smallPinGripRadius, smallPinGripRadius, smallPinGripLength, 12
);
const smallGrip = new THREE.Mesh(smallGripGeo, metalMat);
smallGrip.rotation.x = Math.PI / 2;
smallGrip.position.set(
  smallPinLength * Math.cos(smallPinAngle),
  smallPinLength * Math.sin(smallPinAngle),
  0.2 - smallPinGripLength / 2
);
scene.add(smallGrip);

// ========== Build Flywheel Assembly ==========
// Outer flywheel rim (hollow cylinder)
const flywheelShape = new THREE.Shape();
flywheelShape.absarc(0, 0, flywheelOuterRadius, 0, Math.PI * 2, false);
const flywheelHole = new THREE.Path();
flywheelHole.absarc(0, 0, flywheelInnerRadius, 0, Math.PI * 2, true);
flywheelShape.holes.push(flywheelHole);
const flywheelGeo = new THREE.ExtrudeGeometry(flywheelShape, {
  depth: flywheelThickness,
  bevelEnabled: false,
  curveSegments: 64
});
const flywheel = new THREE.Mesh(flywheelGeo, metalMat);
flywheel.position.z = 1.5;
scene.add(flywheel);

// Internal ring gear teeth
const ringToothGeo = new THREE.BoxGeometry(
  gearToothLength, gearToothWidth, flywheelThickness
);
for (let i = 0; i < ringTeethCount; i++) {
  const theta = i * Math.PI * 2 / ringTeethCount;
  const tooth = new THREE.Mesh(ringToothGeo, metalMat);
  const r = flywheelInnerRadius - gearToothLength / 2;
  tooth.position.set(
    r * Math.cos(theta),
    r * Math.sin(theta),
    1.5 + flywheelThickness / 2
  );
  tooth.rotation.z = theta;
  scene.add(tooth);
}

// Flywheel rear hub and spokes
const flywheelHubGeo = new THREE.CylinderGeometry(
  flywheelHubRadius, flywheelHubRadius, flywheelHubLength, 24
);
const flywheelHub = new THREE.Mesh(flywheelHubGeo, metalMat);
flywheelHub.rotation.x = Math.PI / 2;
flywheelHub.position.z = 1.5 + flywheelThickness + flywheelHubLength / 2;
scene.add(flywheelHub);

const flywheelSpokeLength = flywheelInnerRadius - flywheelHubRadius;
const flywheelSpokeGeo = new THREE.BoxGeometry(
  flywheelSpokeLength, flywheelSpokeWidth, flywheelSpokeThickness
);
for (let i = 0; i < 3; i++) {
  const theta = i * Math.PI * 2 / 3;
  const spoke = new THREE.Mesh(flywheelSpokeGeo, metalMat);
  const r = flywheelHubRadius + flywheelSpokeLength / 2;
  spoke.position.set(
    r * Math.cos(theta),
    r * Math.sin(theta),
    1.5 + flywheelThickness - flywheelSpokeThickness / 2
  );
  spoke.rotation.z = theta;
  scene.add(spoke);
}

// ========== Build Planetary Gear Set ==========
// Front and rear carrier plates
const frontCarrier = createCarrier(1.8);
scene.add(frontCarrier);
const rearCarrier = createCarrier(3.0);
scene.add(rearCarrier);

// Planet gear pins
const pinGeo = new THREE.CylinderGeometry(
  planetPinRadius, planetPinRadius, planetPinLength, 12
);
for (let i = 0; i < 3; i++) {
  const theta = i * Math.PI * 2 / 3;
  const pin = new THREE.Mesh(pinGeo, metalMat);
  pin.rotation.x = Math.PI / 2;
  pin.position.set(
    planetOrbitRadius * Math.cos(theta),
    planetOrbitRadius * Math.sin(theta),
    2.5
  );
  scene.add(pin);
}

// Planet gears
for (let i = 0; i < 3; i++) {
  const theta = i * Math.PI * 2 / 3;
  const planet = createPlanetGear();
  planet.position.set(
    planetOrbitRadius * Math.cos(theta),
    planetOrbitRadius * Math.sin(theta),
    2.5
  );
  scene.add(planet);
}

// Central sun gear
const sunDiskGeo = new THREE.CylinderGeometry(
  sunRootRadius, sunRootRadius, sunThickness, 48
);
const sunDisk = new THREE.Mesh(sunDiskGeo, metalMat);
sunDisk.rotation.x = Math.PI / 2;
sunDisk.position.z = 2.5;
scene.add(sunDisk);

const sunToothGeo = new THREE.BoxGeometry(
  gearToothLength, gearToothWidth, sunThickness
);
for (let i = 0; i < sunTeethCount; i++) {
  const theta = i * Math.PI * 2 / sunTeethCount;
  const tooth = new THREE.Mesh(sunToothGeo, metalMat);
  const r = sunRootRadius + gearToothLength / 2;
  tooth.position.set(
    r * Math.cos(theta),
    r * Math.sin(theta),
    2.5
  );
  tooth.rotation.z = theta;
  scene.add(tooth);
}

// ========== Adjust Camera for Isometric View ==========
camera.position.set(22, -9, 26);
camera.lookAt(-2, 7, -1);