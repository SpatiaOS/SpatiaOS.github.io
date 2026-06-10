{
  // Parameters: interpreted as a compact industrial hose / cable reel with two side flanges,
  // many wound hose loops, a rear feed pipe rising to a small top fitting, and a front drop pipe with valve/nozzle.
  const flangeRadius = 2.15;
  const flangeThickness = 0.32;
  const innerReelWidth = 2.75;
  const rearFlangeX = -innerReelWidth / 2 - flangeThickness / 2;
  const frontFlangeX = innerReelWidth / 2 + flangeThickness / 2;
  const rearOuterFaceX = rearFlangeX - flangeThickness / 2;
  const frontOuterFaceX = frontFlangeX + flangeThickness / 2;

  const coreRadius = 0.82;
  const woundBaseRadius = 1.18;
  const hoseLoopRadius = 0.115;
  const hoseLoopCount = 12;
  const hoseLoopSpacing = innerReelWidth / (hoseLoopCount + 0.4);

  const pipeRadius = 0.075;
  const collarRadius = 0.13;

  // Materials
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xa8a8ad,
    roughness: 0.45,
    metalness: 0.25
  });

  const lightMetalMat = new THREE.MeshStandardMaterial({
    color: 0xc8c8cb,
    roughness: 0.38,
    metalness: 0.22
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x38383b,
    roughness: 0.55,
    metalness: 0.2
  });

  const grooveMat = new THREE.MeshStandardMaterial({
    color: 0x77777d,
    roughness: 0.55,
    metalness: 0.15
  });

  const valveMat = new THREE.MeshStandardMaterial({
    color: 0x8f8f95,
    roughness: 0.45,
    metalness: 0.25
  });

  // Helpers
  function addCylinderAlongX(radiusTop, radiusBottom, length, x, y, z, material, radialSegments) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, radialSegments || 64);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;
    scene.add(mesh);
    return mesh;
  }

  function addCylinderBetween(start, end, radius, material, radialSegments) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments || 18);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    scene.add(mesh);
    return mesh;
  }

  function addTube(points, radius, material, tubularSegments, radialSegments) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, tubularSegments || 72, radius, radialSegments || 14, false);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  }

  function addTorusAlongX(majorRadius, tubeRadius, x, y, z, material, radialSegments, tubularSegments) {
    const geometry = new THREE.TorusGeometry(majorRadius, tubeRadius, radialSegments || 14, tubularSegments || 96);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = Math.PI / 2;
    scene.add(mesh);
    return mesh;
  }

  // Main reel flanges: large circular side plates.
  addCylinderAlongX(flangeRadius, flangeRadius, flangeThickness, rearFlangeX, 0, 0, metalMat, 96);
  addCylinderAlongX(flangeRadius, flangeRadius, flangeThickness, frontFlangeX, 0, 0, metalMat, 96);

  // Slightly raised rounded rims on each flange face.
  const rimTube = 0.04;
  [rearFlangeX - flangeThickness / 2, rearFlangeX + flangeThickness / 2, frontFlangeX - flangeThickness / 2, frontFlangeX + flangeThickness / 2].forEach((x) => {
    addTorusAlongX(flangeRadius - 0.015, rimTube, x, 0, 0, lightMetalMat, 12, 120);
  });

  // Inner circular lines on the flanges, like stamped plate edges.
  addTorusAlongX(flangeRadius * 0.86, 0.018, rearOuterFaceX - 0.01, 0, 0, darkMetalMat, 8, 96);
  addTorusAlongX(flangeRadius * 0.86, 0.018, frontOuterFaceX + 0.012, 0, 0, darkMetalMat, 8, 96);

  // Central spool/core underneath the wound hose.
  addCylinderAlongX(coreRadius, coreRadius, innerReelWidth + 0.18, 0, 0, 0, grooveMat, 80);

  // Base cylinder behind the hose loops, visible as darker grooves between loops.
  addCylinderAlongX(woundBaseRadius, woundBaseRadius, innerReelWidth * 0.96, 0, 0, 0, grooveMat, 96);

  // Wound hose loops: approximated as many torus loops across the reel width.
  for (let i = 0; i < hoseLoopCount; i++) {
    const x = -innerReelWidth / 2 + hoseLoopSpacing * (i + 0.7);
    addTorusAlongX(woundBaseRadius, hoseLoopRadius, x, 0, 0, lightMetalMat, 18, 110);
  }

  // Thin dark groove accents between adjacent hose loops.
  for (let i = 0; i < hoseLoopCount - 1; i++) {
    const x = -innerReelWidth / 2 + hoseLoopSpacing * (i + 1.18);
    addTorusAlongX(woundBaseRadius + 0.02, 0.014, x, 0, 0, darkMetalMat, 8, 90);
  }

  // Small central axle caps at both ends.
  addCylinderAlongX(0.28, 0.28, 0.12, rearOuterFaceX - 0.05, 0, 0, metalMat, 48);
  addCylinderAlongX(0.18, 0.18, 0.08, frontOuterFaceX + 0.035, 0, 0, metalMat, 48);

  // Four small bolt holes/depressions on the visible front flange face.
  const boltCircleRadius = 0.82;
  const boltAngles = [35, 135, 225, 315];
  boltAngles.forEach((deg) => {
    const a = THREE.MathUtils.degToRad(deg);
    const y = Math.sin(a) * boltCircleRadius;
    const z = Math.cos(a) * boltCircleRadius;
    addCylinderAlongX(0.075, 0.075, 0.035, frontOuterFaceX + 0.02, y, z, darkMetalMat, 28);
    addTorusAlongX(0.09, 0.01, frontOuterFaceX + 0.045, y, z, metalMat, 8, 32);
  });

  // Rear outlet stub connecting the reel to the curved feed pipe.
  addCylinderAlongX(0.13, 0.13, 0.48, rearOuterFaceX - 0.20, -1.05, -1.02, metalMat, 24);
  addCylinderAlongX(0.18, 0.18, 0.13, rearOuterFaceX - 0.43, -1.05, -1.02, metalMat, 28);

  // Curved pipe leaving the lower rear of the reel and bending into the tall vertical pipe.
  addTube(
    [
      new THREE.Vector3(rearOuterFaceX - 0.38, -1.05, -1.02),
      new THREE.Vector3(-1.75, -1.45, -1.12),
      new THREE.Vector3(-1.95, -1.78, -1.22),
      new THREE.Vector3(-2.35, -1.75, -1.28),
      new THREE.Vector3(-2.58, -1.35, -1.28)
    ],
    pipeRadius,
    lightMetalMat,
    80,
    16
  );

  // Tall rear/left pipe.
  addCylinderBetween(
    new THREE.Vector3(-2.58, -1.35, -1.28),
    new THREE.Vector3(-2.58, 4.18, -1.28),
    pipeRadius,
    lightMetalMat,
    20
  );

  // Collars on the tall pipe.
  [
    [-2.58, -1.28, -1.28, 0.15],
    [-2.58, 3.72, -1.28, 0.18],
    [-2.58, 4.02, -1.28, 0.16]
  ].forEach((p) => {
    const geometry = new THREE.CylinderGeometry(collarRadius, collarRadius, p[3], 28);
    const mesh = new THREE.Mesh(geometry, metalMat);
    mesh.position.set(p[0], p[1], p[2]);
    scene.add(mesh);
  });

  // Top fitting: stacked collars, angled connector, hex cap, and small circular side wheel/gauge.
  {
    const lowerCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.22, 32), metalMat);
    lowerCollar.position.set(-2.58, 4.19, -1.28);
    scene.add(lowerCollar);

    const upperBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.36, 32), metalMat);
    upperBarrel.position.set(-2.58, 4.42, -1.28);
    scene.add(upperBarrel);

    const hexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.18, 6), metalMat);
    hexNut.position.set(-2.58, 4.68, -1.28);
    hexNut.rotation.y = Math.PI / 6;
    scene.add(hexNut);

    addCylinderBetween(
      new THREE.Vector3(-2.55, 4.34, -1.28),
      new THREE.Vector3(-2.28, 4.58, -1.28),
      0.13,
      metalMat,
      24
    );

    addCylinderBetween(
      new THREE.Vector3(-2.28, 4.58, -1.28),
      new THREE.Vector3(-2.02, 4.67, -1.28),
      0.21,
      metalMat,
      6
    );

    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 6), metalMat);
    topCap.position.set(-2.02, 4.69, -1.28);
    topCap.rotation.z = Math.PI / 2;
    topCap.rotation.y = Math.PI / 6;
    scene.add(topCap);

    // Side wheel/gauge, facing the camera side.
    addCylinderBetween(
      new THREE.Vector3(-2.73, 4.36, -1.22),
      new THREE.Vector3(-2.73, 4.36, -0.93),
      0.055,
      darkMetalMat,
      18
    );

    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 10, 42), darkMetalMat);
    wheel.position.set(-2.73, 4.36, -0.88);
    scene.add(wheel);

    const wheelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.045, 24), darkMetalMat);
    wheelHub.position.set(-2.73, 4.36, -0.855);
    wheelHub.rotation.x = Math.PI / 2;
    scene.add(wheelHub);

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const center = new THREE.Vector3(-2.73, 4.36, -0.86);
      const end = new THREE.Vector3(
        -2.73 + Math.cos(a) * 0.13,
        4.36 + Math.sin(a) * 0.13,
        -0.86
      );
      addCylinderBetween(center, end, 0.01, darkMetalMat, 8);
    }
  }

  // Front lower outlet pipe dropping from the reel.
  const dropX = 0.92;
  const dropZ = 0.58;

  addTube(
    [
      new THREE.Vector3(0.45, -1.18, 0.35),
      new THREE.Vector3(0.62, -1.55, 0.46),
      new THREE.Vector3(dropX, -1.82, dropZ)
    ],
    pipeRadius,
    lightMetalMat,
    50,
    14
  );

  addCylinderBetween(
    new THREE.Vector3(dropX, -1.82, dropZ),
    new THREE.Vector3(dropX, -3.05, dropZ),
    pipeRadius,
    lightMetalMat,
    18
  );

  // Collars and couplings on the lower pipe.
  [
    [-2.22, 0.18],
    [-2.58, 0.16],
    [-2.86, 0.18],
    [-3.03, 0.14]
  ].forEach((c) => {
    const geometry = new THREE.CylinderGeometry(collarRadius, collarRadius, c[1], 28);
    const mesh = new THREE.Mesh(geometry, metalMat);
    mesh.position.set(dropX, c[0], dropZ);
    scene.add(mesh);
  });

  // Round valve body.
  const valveBody = new THREE.Mesh(new THREE.SphereGeometry(0.235, 32, 18), valveMat);
  valveBody.position.set(dropX, -3.32, dropZ);
  valveBody.scale.set(0.95, 1.12, 0.95);
  scene.add(valveBody);

  // Vertical coupling through valve body.
  const valveCoupling = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 32), metalMat);
  valveCoupling.position.set(dropX, -3.32, dropZ);
  scene.add(valveCoupling);

  // Side lever/handle.
  addCylinderBetween(
    new THREE.Vector3(dropX - 0.03, -3.33, dropZ + 0.02),
    new THREE.Vector3(dropX - 0.58, -3.24, dropZ + 0.27),
    0.025,
    darkMetalMat,
    10
  );

  addCylinderBetween(
    new THREE.Vector3(dropX - 0.58, -3.24, dropZ + 0.27),
    new THREE.Vector3(dropX - 0.88, -3.19, dropZ + 0.39),
    0.035,
    darkMetalMat,
    10
  );

  // Tapered lower nozzle.
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.07, 0.72, 32), valveMat);
  nozzle.position.set(dropX, -3.87, dropZ);
  scene.add(nozzle);

  const nozzleTip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.11, 24), darkMetalMat);
  nozzleTip.position.set(dropX, -4.285, dropZ);
  scene.add(nozzleTip);

  const nozzleCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.10, 28), metalMat);
  nozzleCollar.position.set(dropX, -3.55, dropZ);
  scene.add(nozzleCollar);

  // Camera framing similar to the reference: elevated three-quarter view with the front flange dominant.
  camera.position.set(6.5, 4.3, 7.6);
  camera.lookAt(-0.15, 0.15, -0.1);
}