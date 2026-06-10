// Clock Model Parameters
const outerRadius = 10;
const baseThickness = 1.5;
const innerRadius = 8;
const recessDepth = 0.5;
const numeralHeight = 0.3;
const numeralThickness = 0.4;
const numeralRadiusFromCenter = 7;
const handLength = 6;
const handWidth = 0.3;
const handThickness = 0.2;
const centralHubRadius = 0.8;
const centralHubHeight = 0.2;

// Create base disk (outer circle)
const baseGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, baseThickness, 64);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = baseThickness / 2;
scene.add(base);

// Create recessed inner face
const innerFaceGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, recessDepth, 64);
const innerFaceMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const innerFace = new THREE.Mesh(innerFaceGeometry, innerFaceMaterial);
innerFace.position.y = baseThickness - recessDepth / 2;
scene.add(innerFace);

// Roman numeral definitions (position angle, numeral type)
// Angles: 0 = top (XII), 30 = I, 60 = II, etc. (360/12 = 30 degrees per numeral)
const numerals = [
  { angle: 0, type: "XII" },
  { angle: 30, type: "I" },
  { angle: 60, type: "II" },
  { angle: 90, type: "III" },
  { angle: 120, type: "IV" },
  { angle: 150, type: "V" },
  { angle: 180, type: "VI" },
  { angle: 210, type: "VII" },
  { angle: 240, type: "VIII" },
  { angle: 270, type: "IX" },
  { angle: 300, type: "X" },
  { angle: 330, type: "XI" }
];

// Create each Roman numeral as 3D geometry
numerals.forEach(numeral => {
  const angleRad = THREE.MathUtils.degToRad(numeral.angle);
  const x = Math.sin(angleRad) * numeralRadiusFromCenter;
  const z = Math.cos(angleRad) * numeralRadiusFromCenter;
  
  let numeralGeometry;
  switch(numeral.type) {
    case "I":
      numeralGeometry = new THREE.BoxGeometry(0.2, numeralHeight, numeralThickness);
      break;
    case "II":
      numeralGeometry = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      break;
    case "III":
      numeralGeometry = new THREE.BoxGeometry(1.0, numeralHeight, numeralThickness);
      break;
    case "IV":
      // IV: I followed by V
      const ivGroup = new THREE.Group();
      const iGeo = new THREE.BoxGeometry(0.2, numeralHeight, numeralThickness);
      const vGeo = new THREE.BoxGeometry(0.5, numeralHeight, numeralThickness);
      const iMesh = new THREE.Mesh(iGeo, baseMaterial);
      iMesh.position.x = -0.2;
      const vMesh = new THREE.Mesh(vGeo, baseMaterial);
      vMesh.position.x = 0.3;
      ivGroup.add(iMesh, vMesh);
      ivGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      ivGroup.rotation.y = angleRad;
      scene.add(ivGroup);
      return;
    case "V":
      numeralGeometry = new THREE.BoxGeometry(0.5, numeralHeight, numeralThickness);
      break;
    case "VI":
      // VI: V followed by I
      const viGroup = new THREE.Group();
      const vGeo2 = new THREE.BoxGeometry(0.5, numeralHeight, numeralThickness);
      const iGeo2 = new THREE.BoxGeometry(0.2, numeralHeight, numeralThickness);
      const vMesh2 = new THREE.Mesh(vGeo2, baseMaterial);
      vMesh2.position.x = -0.2;
      const iMesh2 = new THREE.Mesh(iGeo2, baseMaterial);
      iMesh2.position.x = 0.3;
      viGroup.add(vMesh2, iMesh2);
      viGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      viGroup.rotation.y = angleRad;
      scene.add(viGroup);
      return;
    case "VII":
      // VII: V followed by II
      const viiGroup = new THREE.Group();
      const vGeo3 = new THREE.BoxGeometry(0.5, numeralHeight, numeralThickness);
      const iiGeo = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      const vMesh3 = new THREE.Mesh(vGeo3, baseMaterial);
      vMesh3.position.x = -0.3;
      const iiMesh = new THREE.Mesh(iiGeo, baseMaterial);
      iiMesh.position.x = 0.4;
      viiGroup.add(vMesh3, iiMesh);
      viiGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      viiGroup.rotation.y = angleRad;
      scene.add(viiGroup);
      return;
    case "VIII":
      // VIII: V followed by III
      const viiiGroup = new THREE.Group();
      const vGeo4 = new THREE.BoxGeometry(0.5, numeralHeight, numeralThickness);
      const iiiGeo = new THREE.BoxGeometry(1.0, numeralHeight, numeralThickness);
      const vMesh4 = new THREE.Mesh(vGeo4, baseMaterial);
      vMesh4.position.x = -0.4;
      const iiiMesh = new THREE.Mesh(iiiGeo, baseMaterial);
      iiiMesh.position.x = 0.5;
      viiiGroup.add(vMesh4, iiiMesh);
      viiiGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      viiiGroup.rotation.y = angleRad;
      scene.add(viiiGroup);
      return;
    case "IX":
      // IX: I followed by X
      const ixGroup = new THREE.Group();
      const iGeo3 = new THREE.BoxGeometry(0.2, numeralHeight, numeralThickness);
      const xGeo = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      const iMesh3 = new THREE.Mesh(iGeo3, baseMaterial);
      iMesh3.position.x = -0.2;
      const xMesh = new THREE.Mesh(xGeo, baseMaterial);
      xMesh.position.x = 0.3;
      ixGroup.add(iMesh3, xMesh);
      ixGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      ixGroup.rotation.y = angleRad;
      scene.add(ixGroup);
      return;
    case "X":
      numeralGeometry = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      break;
    case "XI":
      // XI: X followed by I
      const xiGroup = new THREE.Group();
      const xGeo2 = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      const iGeo4 = new THREE.BoxGeometry(0.2, numeralHeight, numeralThickness);
      const xMesh2 = new THREE.Mesh(xGeo2, baseMaterial);
      xMesh2.position.x = -0.2;
      const iMesh4 = new THREE.Mesh(iGeo4, baseMaterial);
      iMesh4.position.x = 0.3;
      xiGroup.add(xMesh2, iMesh4);
      xiGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      xiGroup.rotation.y = angleRad;
      scene.add(xiGroup);
      return;
    case "XII":
      // XII: X followed by II
      const xiiGroup = new THREE.Group();
      const xGeo3 = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      const iiGeo2 = new THREE.BoxGeometry(0.6, numeralHeight, numeralThickness);
      const xMesh3 = new THREE.Mesh(xGeo3, baseMaterial);
      xMesh3.position.x = -0.3;
      const iiMesh2 = new THREE.Mesh(iiGeo2, baseMaterial);
      iiMesh2.position.x = 0.4;
      xiiGroup.add(xMesh3, iiMesh2);
      xiiGroup.position.set(x, innerFace.position.y + numeralHeight/2, z);
      xiiGroup.rotation.y = angleRad;
      scene.add(xiiGroup);
      return;
  }
  
  // Create and position single-part numerals
  const numeralMesh = new THREE.Mesh(numeralGeometry, baseMaterial);
  numeralMesh.position.set(x, innerFace.position.y + numeralHeight/2, z);
  numeralMesh.rotation.y = angleRad;
  scene.add(numeralMesh);
});

// Central hub
const hubGeometry = new THREE.CylinderGeometry(centralHubRadius, centralHubRadius, centralHubHeight, 32);
const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const hub = new THREE.Mesh(hubGeometry, hubMaterial);
hub.position.y = innerFace.position.y + centralHubHeight/2;
scene.add(hub);

// Clock hand (pointing to 2 o'clock, 60 degrees from top)
const handGeometry = new THREE.BoxGeometry(handWidth, handThickness, handLength);
const handMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const hand = new THREE.Mesh(handGeometry, handMaterial);
hand.position.set(0, innerFace.position.y + handThickness/2 + 0.1, 0);
// Rotate to point to 2 o'clock: 60 degrees from top (positive y), so rotate around y-axis by 60 degrees
hand.rotation.y = THREE.MathUtils.degToRad(60);
hand.position.z = handLength/2 * Math.cos(THREE.MathUtils.degToRad(60));
hand.position.x = handLength/2 * Math.sin(THREE.MathUtils.degToRad(60));
scene.add(hand);

// Adjust camera to view the clock
camera.position.set(20, 15, 20);
camera.lookAt(0, 0, 0);