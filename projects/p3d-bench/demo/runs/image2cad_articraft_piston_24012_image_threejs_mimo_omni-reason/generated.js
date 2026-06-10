// Piston Assembly Parameters
// Piston head dimensions
const pistonDiameter = 8;
const pistonBodyHeight = 3.5;
const pistonCrownHeight = 0.5;
const pistonCrownIndentDiameter = 2;
const pistonCrownIndentDepth = 0.15;

// Piston rings
const pistonRingCount = 3;
const pistonRingThickness = 0.25;
const pistonRingHeight = 0.2;
const pistonRingSpacing = 0.15;

// Piston pin (horizontal offset from piston center)
const pistonPinDiameter = 1.2;
const pistonPinLength = pistonDiameter + 0.5;
const pistonPinOffsetY = 1.8; // offset downward from piston vertical center

// Connecting rod dimensions
const conRodTotalLength = 12;
const conRodWebThickness = 0.4;
const conRodFlangeWidth = 2;
const conRodFlangeHeight = 1.2;
const conRodBigEndOuterRadius = 2.5;
const conRodBigEndInnerRadius = 1.75;
const conRodBigEndLength = 2;
const boltRadius = 0.2;
const boltHeight = 1.5;
const boltHeadRadius = 0.35;

// Metallic material for the assembly
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  metalness: 0.8,
  roughness: 0.3
});

// --- Piston Head ---
// Main piston body (cylinder)
const pistonBodyGeo = new THREE.CylinderGeometry(pistonDiameter/2, pistonDiameter/2, pistonBodyHeight, 32);
const pistonBody = new THREE.Mesh(pistonBodyGeo, metalMaterial);
pistonBody.position.y = pistonBodyHeight/2 + pistonCrownHeight;
scene.add(pistonBody);

// Piston crown (top disc)
const pistonCrownGeo = new THREE.CylinderGeometry(pistonDiameter/2, pistonDiameter/2, pistonCrownHeight, 32);
const pistonCrown = new THREE.Mesh(pistonCrownGeo, metalMaterial);
pistonCrown.position.y = pistonBodyHeight + pistonCrownHeight/2;
scene.add(pistonCrown);

// Piston crown indent (depression on top face)
const pistonIndentGeo = new THREE.CylinderGeometry(pistonCrownIndentDiameter/2, pistonCrownIndentDiameter/2, pistonCrownIndentDepth, 32);
const pistonIndent = new THREE.Mesh(pistonIndentGeo, metalMaterial);
pistonIndent.position.y = pistonBodyHeight + pistonCrownHeight - pistonCrownIndentDepth/2;
scene.add(pistonIndent);

// Piston rings (stacked on upper piston body)
for (let i = 0; i < pistonRingCount; i++) {
  const ringGeo = new THREE.CylinderGeometry(
    pistonDiameter/2 + pistonRingThickness,
    pistonDiameter/2 + pistonRingThickness,
    pistonRingHeight,
    32
  );
  const ring = new THREE.Mesh(ringGeo, metalMaterial);
  ring.position.y = pistonBodyHeight + pistonCrownHeight - pistonRingHeight/2 - (i * (pistonRingHeight + pistonRingSpacing));
  scene.add(ring);
}

// Piston pin (horizontal cylinder offset downward from piston center)
const pistonPinGeo = new THREE.CylinderGeometry(pistonPinDiameter/2, pistonPinDiameter/2, pistonPinLength, 32);
const pistonPin = new THREE.Mesh(pistonPinGeo, metalMaterial);
pistonPin.rotation.z = Math.PI/2; // align along X-axis
pistonPin.position.y = (pistonBodyHeight/2 + pistonCrownHeight) - pistonPinOffsetY;
scene.add(pistonPin);

// --- Connecting Rod ---
// I-beam web (central thin box)
const conRodWebGeo = new THREE.BoxGeometry(conRodWebThickness, conRodTotalLength - conRodBigEndLength, conRodFlangeHeight);
const conRodWeb = new THREE.Mesh(conRodWebGeo, metalMaterial);
conRodWeb.position.y = pistonPin.position.y - (conRodTotalLength - conRodBigEndLength)/2;
scene.add(conRodWeb);

// I-beam flanges (top and bottom boxes)
const conRodFlangeGeo = new THREE.BoxGeometry(conRodFlangeWidth, conRodTotalLength - conRodBigEndLength, conRodFlangeHeight);
// Upper flange
const conRodUpperFlange = new THREE.Mesh(conRodFlangeGeo, metalMaterial);
conRodUpperFlange.position.y = pistonPin.position.y - (conRodTotalLength - conRodBigEndLength)/2;
conRodUpperFlange.position.z = conRodFlangeHeight/2 + conRodWebThickness/2;
scene.add(conRodUpperFlange);
// Lower flange
const conRodLowerFlange = new THREE.Mesh(conRodFlangeGeo, metalMaterial);
conRodLowerFlange.position.y = pistonPin.position.y - (conRodTotalLength - conRodBigEndLength)/2;
conRodLowerFlange.position.z = -(conRodFlangeHeight/2 + conRodWebThickness/2);
scene.add(conRodLowerFlange);

// Big end (bearing housing, outer cylinder)
const conRodBigEndOuterGeo = new THREE.CylinderGeometry(conRodBigEndOuterRadius, conRodBigEndOuterRadius, conRodBigEndLength, 32);
const conRodBigEndOuter = new THREE.Mesh(conRodBigEndOuterGeo, metalMaterial);
conRodBigEndOuter.position.y = pistonPin.position.y - conRodTotalLength + conRodBigEndLength/2;
scene.add(conRodBigEndOuter);

// Big end inner bore (hollow cylinder)
const conRodBigEndInnerGeo = new THREE.CylinderGeometry(conRodBigEndInnerRadius, conRodBigEndInnerRadius, conRodBigEndLength + 0.2, 32);
const conRodBigEndInner = new THREE.Mesh(conRodBigEndInnerGeo, new THREE.MeshStandardMaterial({color: 0x333333}));
conRodBigEndInner.position.y = pistonPin.position.y - conRodTotalLength + conRodBigEndLength/2;
scene.add(conRodBigEndInner);

// Bolts on big end (two bolts)
for (let i = 0; i < 2; i++) {
  // Bolt shaft
  const boltGeo = new THREE.CylinderGeometry(boltRadius, boltRadius, boltHeight, 16);
  const bolt = new THREE.Mesh(boltGeo, metalMaterial);
  bolt.position.y = pistonPin.position.y - conRodTotalLength + conRodBigEndLength/2;
  bolt.position.x = (i === 0 ? 1 : -1) * (conRodBigEndOuterRadius - 0.3);
  scene.add(bolt);

  // Bolt head
  const boltHeadGeo = new THREE.CylinderGeometry(boltHeadRadius, boltHeadRadius, 0.3, 16);
  const boltHead = new THREE.Mesh(boltHeadGeo, metalMaterial);
  boltHead.position.y = pistonPin.position.y - conRodTotalLength + conRodBigEndLength/2 + boltHeight/2 + 0.15;
  boltHead.position.x = bolt.position.x;
  scene.add(boltHead);
}

// Adjust camera to view the full assembly
camera.position.set(18, 12, 22);
camera.lookAt(0, pistonPin.position.y - conRodTotalLength/2, 0);