{
  // Parametric interpretation of the image:
  // A compact "Fusion 360" mechanical grinder/mixer-like object with a square base,
  // a rectangular machine body, a large open tapered bowl, a central post, and a hand crank.

  // Materials
  const mainMetal = new THREE.MeshStandardMaterial({
    color: 0xb8b8b8,
    roughness: 0.45,
    metalness: 0.18
  });

  const lightMetal = new THREE.MeshStandardMaterial({
    color: 0xd1d3d4,
    roughness: 0.38,
    metalness: 0.16
  });

  const bodyMetal = new THREE.MeshStandardMaterial({
    color: 0xa9abad,
    roughness: 0.5,
    metalness: 0.12
  });

  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1d1d1d,
    roughness: 0.7,
    metalness: 0.05
  });

  const grooveMetal = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.65,
    metalness: 0.08
  });

  const bowlMaterial = new THREE.MeshStandardMaterial({
    color: 0xbfc1c3,
    roughness: 0.42,
    metalness: 0.18,
    side: THREE.DoubleSide
  });

  const innerBowlMaterial = new THREE.MeshStandardMaterial({
    color: 0xacafb2,
    roughness: 0.5,
    metalness: 0.12,
    side: THREE.DoubleSide
  });

  // Helpers
  function roundedRectShape(width, height, radius) {
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w, h);

    const shape = new THREE.Shape();
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    return shape;
  }

  function addRoundedSlab(width, depth, height, radius, centerY, centerX, centerZ, material, bevel = 0.03) {
    const geometry = new THREE.ExtrudeGeometry(roundedRectShape(width, depth, radius), {
      depth: height,
      bevelEnabled: bevel > 0,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 2,
      curveSegments: 14
    });
    geometry.rotateX(-Math.PI / 2);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(centerX, centerY - height / 2, centerZ);
    scene.add(mesh);
    return mesh;
  }

  function addRoundedFrontPanel(width, height, depth, radius, centerX, centerY, zBack, material, bevel = 0.015) {
    const geometry = new THREE.ExtrudeGeometry(roundedRectShape(width, height, radius), {
      depth,
      bevelEnabled: bevel > 0,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 2,
      curveSegments: 14
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(centerX, centerY, zBack - depth);
    scene.add(mesh);
    return mesh;
  }

  function addBox(width, height, depth, x, y, z, material, rx = 0, ry = 0, rz = 0) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    scene.add(mesh);
    return mesh;
  }

  function addCylinder(radiusTop, radiusBottom, height, segments, x, y, z, material, rx = 0, ry = 0, rz = 0, openEnded = false) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1, openEnded);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    scene.add(mesh);
    return mesh;
  }

  function addTorus(majorRadius, tubeRadius, x, y, z, material, tubeSegments = 12, ringSegments = 96) {
    const geometry = new THREE.TorusGeometry(majorRadius, tubeRadius, tubeSegments, ringSegments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function addLathe(points, x, y, z, material, segments = 64) {
    const geometry = new THREE.LatheGeometry(points, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function addFlatExtrudedShape(shape, thickness, originX, centerY, originZ, material, bevel = 0.025) {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: bevel > 0,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 2,
      curveSegments: 14
    });
    geometry.rotateX(-Math.PI / 2);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(originX, centerY - thickness / 2, originZ);
    scene.add(mesh);
    return mesh;
  }

  function addPixelText(text, centerX, centerY, z, cellSize, material) {
    const glyphs = {
      "F": [
        "11111",
        "10000",
        "10000",
        "11110",
        "10000",
        "10000",
        "10000"
      ],
      "U": [
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "11111"
      ],
      "S": [
        "11111",
        "10000",
        "10000",
        "11110",
        "00001",
        "00001",
        "11110"
      ],
      "I": [
        "111",
        "010",
        "010",
        "010",
        "010",
        "010",
        "111"
      ],
      "O": [
        "01110",
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "01110"
      ],
      "N": [
        "10001",
        "11001",
        "10101",
        "10011",
        "10001",
        "10001",
        "10001"
      ],
      "3": [
        "11110",
        "00001",
        "00001",
        "01110",
        "00001",
        "00001",
        "11110"
      ],
      "6": [
        "01110",
        "10000",
        "10000",
        "11110",
        "10001",
        "10001",
        "01110"
      ],
      "0": [
        "01110",
        "10001",
        "10011",
        "10101",
        "11001",
        "10001",
        "01110"
      ],
      " ": [
        "000",
        "000",
        "000",
        "000",
        "000",
        "000",
        "000"
      ]
    };

    const rows = 7;
    const gap = 1;
    let totalCols = 0;

    for (let i = 0; i < text.length; i++) {
      const pattern = glyphs[text[i].toUpperCase()] || glyphs[" "];
      totalCols += pattern[0].length + gap;
    }
    totalCols -= gap;

    const pixelGeometry = new THREE.BoxGeometry(cellSize * 0.78, cellSize * 0.78, 0.045);
    let cursorX = centerX - (totalCols * cellSize) / 2;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i].toUpperCase();
      const pattern = glyphs[ch] || glyphs[" "];
      const cols = pattern[0].length;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (pattern[row][col] === "1") {
            const mesh = new THREE.Mesh(pixelGeometry, material);
            mesh.position.set(
              cursorX + (col + 0.5) * cellSize,
              centerY + ((rows / 2 - row - 0.5) * cellSize),
              z
            );
            scene.add(mesh);
          }
        }
      }

      cursorX += (cols + gap) * cellSize;
    }
  }

  // Overall proportions
  const baseW = 14.6;
  const baseD = 13.8;
  const baseH = 0.55;

  const plinthW = 13.15;
  const plinthD = 12.45;
  const plinthH = 0.28;
  const plinthTopY = baseH + plinthH;

  const bodyW = 9.7;
  const bodyD = 9.3;
  const bodyH = 5.7;
  const bodyBottomY = plinthTopY;
  const bodyTopY = bodyBottomY + bodyH;
  const bodyFrontZ = -bodyD / 2;

  const topPlateW = 13.2;
  const topPlateD = 12.6;
  const topPlateH = 0.55;
  const topPlateTopY = bodyTopY + topPlateH;

  // Base with inset border details
  addRoundedSlab(baseW, baseD, baseH, 0.55, baseH / 2, 0, 0, mainMetal, 0.08);
  addRoundedSlab(plinthW, plinthD, plinthH, 0.35, baseH + plinthH / 2, 0, 0, lightMetal, 0.04);

  const baseLineY = plinthTopY + 0.035;
  const baseTrimW1 = 12.0;
  const baseTrimD1 = 11.3;
  const baseTrimW2 = 10.8;
  const baseTrimD2 = 10.1;

  addBox(baseTrimW1, 0.035, 0.055, 0, baseLineY, -baseTrimD1 / 2, grooveMetal);
  addBox(baseTrimW1, 0.035, 0.055, 0, baseLineY, baseTrimD1 / 2, grooveMetal);
  addBox(0.055, 0.035, baseTrimD1, -baseTrimW1 / 2, baseLineY, 0, grooveMetal);
  addBox(0.055, 0.035, baseTrimD1, baseTrimW1 / 2, baseLineY, 0, grooveMetal);

  addBox(baseTrimW2, 0.03, 0.045, 0, baseLineY + 0.04, -baseTrimD2 / 2, grooveMetal);
  addBox(baseTrimW2, 0.03, 0.045, 0, baseLineY + 0.04, baseTrimD2 / 2, grooveMetal);
  addBox(0.045, 0.03, baseTrimD2, -baseTrimW2 / 2, baseLineY + 0.04, 0, grooveMetal);
  addBox(0.045, 0.03, baseTrimD2, baseTrimW2 / 2, baseLineY + 0.04, 0, grooveMetal);

  // Main rectangular body
  addRoundedSlab(bodyW, bodyD, bodyH, 0.22, bodyBottomY + bodyH / 2, 0, 0, bodyMetal, 0.04);

  // Rounded front corner/edge rods and upper lip
  addCylinder(0.16, 0.16, bodyH - 0.45, 24, -bodyW / 2 + 0.08, bodyBottomY + bodyH / 2, bodyFrontZ - 0.03, lightMetal);
  addCylinder(0.16, 0.16, bodyH - 0.45, 24, bodyW / 2 - 0.08, bodyBottomY + bodyH / 2, bodyFrontZ - 0.03, lightMetal);
  addCylinder(0.17, 0.17, bodyW - 0.3, 32, 0, bodyTopY - 0.36, bodyFrontZ - 0.08, lightMetal, 0, 0, Math.PI / 2);

  // Front access panel with rounded corners
  const panelW = 8.55;
  const panelH = 3.85;
  const panelY = bodyBottomY + 2.35;

  addRoundedFrontPanel(panelW + 0.35, panelH + 0.32, 0.07, 0.46, 0, panelY, bodyFrontZ - 0.01, grooveMetal, 0.02);
  addRoundedFrontPanel(panelW, panelH, 0.13, 0.36, 0, panelY, bodyFrontZ - 0.035, bodyMetal, 0.025);

  const panelFaceZ = bodyFrontZ - 0.17;

  addCylinder(0.12, 0.12, panelH - 0.35, 20, -panelW / 2 + 0.13, panelY, panelFaceZ + 0.02, lightMetal);
  addCylinder(0.12, 0.12, panelH - 0.35, 20, panelW / 2 - 0.13, panelY, panelFaceZ + 0.02, lightMetal);

  // Round front knob
  const frontKnobX = -2.15;
  const frontKnobY = bodyBottomY + 1.75;

  addCylinder(0.55, 0.55, 0.14, 40, frontKnobX, frontKnobY, panelFaceZ - 0.06, lightMetal, Math.PI / 2);
  addCylinder(0.42, 0.32, 0.22, 40, frontKnobX, frontKnobY, panelFaceZ - 0.20, mainMetal, Math.PI / 2);

  const frontKnobCap = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 16), lightMetal);
  frontKnobCap.scale.set(1, 1, 0.43);
  frontKnobCap.position.set(frontKnobX, frontKnobY, panelFaceZ - 0.34);
  scene.add(frontKnobCap);

  // Small oval/rounded nameplate: approximated with pixel block text
  const labelX = -2.1;
  const labelY = bodyTopY - 1.02;

  addRoundedFrontPanel(4.55, 0.95, 0.075, 0.45, labelX, labelY, bodyFrontZ - 0.045, darkMetal, 0.012);
  addRoundedFrontPanel(4.22, 0.68, 0.12, 0.32, labelX, labelY, bodyFrontZ - 0.065, lightMetal, 0.01);
  addPixelText("FUSION 360", labelX, labelY - 0.01, bodyFrontZ - 0.225, 0.065, darkMetal);

  // Top square table/cover plate
  addRoundedSlab(topPlateW, topPlateD, topPlateH, 0.32, bodyTopY + topPlateH / 2, 0, 0, lightMetal, 0.08);

  const topLineY = topPlateTopY + 0.025;
  const topTrimW = topPlateW - 0.85;
  const topTrimD = topPlateD - 0.8;

  addBox(topTrimW, 0.035, 0.055, 0, topLineY, -topTrimD / 2, grooveMetal);
  addBox(topTrimW, 0.035, 0.055, 0, topLineY, topTrimD / 2, grooveMetal);
  addBox(0.055, 0.035, topTrimD, -topTrimW / 2, topLineY, 0, grooveMetal);
  addBox(0.055, 0.035, topTrimD, topTrimW / 2, topLineY, 0, grooveMetal);

  // Large open tapered bowl
  const bowlBottomY = topPlateTopY + 0.2;
  const bowlH = 5.1;
  const bowlTopY = bowlBottomY + bowlH;
  const bowlBottomR = 3.85;
  const bowlTopR = 5.05;
  const bowlWall = 0.42;

  function bowlRadiusAtY(y) {
    const t = (y - bowlBottomY) / bowlH;
    return bowlBottomR + (bowlTopR - bowlBottomR) * t;
  }

  // Bowl lower skirt and stacked circular trim
  addCylinder(bowlBottomR + 0.35, bowlBottomR + 0.24, 0.33, 128, 0, bowlBottomY + 0.165, 0, bowlMaterial, 0, 0, 0, true);
  addTorus(bowlBottomR + 0.15, 0.14, 0, bowlBottomY + 0.06, 0, mainMetal, 12, 128);
  addTorus(bowlBottomR + 0.30, 0.09, 0, bowlBottomY + 0.36, 0, mainMetal, 10, 128);

  // Tapered bowl wall
  addCylinder(bowlTopR, bowlBottomR, bowlH, 128, 0, bowlBottomY + bowlH / 2, 0, bowlMaterial, 0, 0, 0, true);

  // Inner wall surface to make the bowl look hollow
  addCylinder(
    bowlTopR - bowlWall,
    bowlBottomR - bowlWall * 0.75,
    bowlH - 0.45,
    128,
    0,
    bowlBottomY + 0.25 + (bowlH - 0.45) / 2,
    0,
    innerBowlMaterial,
    0,
    0,
    0,
    true
  );

  // Bowl floor disk
  addCylinder(bowlBottomR - bowlWall * 0.85, bowlBottomR - bowlWall * 0.85, 0.16, 128, 0, bowlBottomY + 0.10, 0, innerBowlMaterial);

  // Bowl top lip and decorative circular grooves
  addTorus(bowlTopR - 0.05, 0.18, 0, bowlTopY, 0, mainMetal, 14, 128);
  addTorus(bowlTopR - 0.43, 0.065, 0, bowlTopY - 0.14, 0, lightMetal, 8, 128);
  addTorus(bowlTopR - 0.78, 0.04, 0, bowlTopY - 0.27, 0, grooveMetal, 8, 128);

  const bowlRingYs = [
    bowlTopY - 0.45,
    bowlTopY - 0.72,
    bowlBottomY + 0.55,
    bowlBottomY + 0.82
  ];

  for (let i = 0; i < bowlRingYs.length; i++) {
    const y = bowlRingYs[i];
    addTorus(bowlRadiusAtY(y) + 0.025, 0.055, 0, y, 0, mainMetal, 8, 128);
  }

  // Concentric ribs visible inside the bowl floor
  addTorus(2.15, 0.045, 0, bowlBottomY + 0.25, 0, lightMetal, 8, 96);
  addTorus(2.65, 0.045, 0, bowlBottomY + 0.27, 0, lightMetal, 8, 96);
  addTorus(3.15, 0.045, 0, bowlBottomY + 0.29, 0, lightMetal, 8, 96);

  // Subtle vertical seam on the bowl side
  const seamAngle = -Math.PI / 4;
  const seamRadius = (bowlBottomR + bowlTopR) / 2 + 0.08;
  addCylinder(
    0.025,
    0.025,
    bowlH - 0.65,
    8,
    Math.cos(seamAngle) * seamRadius,
    bowlBottomY + bowlH / 2,
    Math.sin(seamAngle) * seamRadius,
    grooveMetal
  );

  // Central post inside the bowl
  const postX = -0.35;
  const postZ = 0.05;
  const postBottomY = bowlBottomY + 0.22;
  const postTopY = bowlTopY + 0.35;
  const postH = postTopY - postBottomY;

  addCylinder(0.48, 0.48, postH, 64, postX, postBottomY + postH / 2, postZ, lightMetal);
  addCylinder(0.72, 0.62, 0.28, 64, postX, postBottomY + 0.14, postZ, mainMetal);

  // Central rectangular cap plate and hex bolt
  const handleThickness = 0.22;
  const handleCenterY = bowlTopY + 0.34;

  addRoundedSlab(2.25, 1.4, 0.18, 0.09, handleCenterY - 0.055, postX - 0.45, postZ + 0.05, lightMetal, 0.025);

  addCylinder(0.52, 0.52, 0.08, 40, postX, handleCenterY + 0.07, postZ, mainMetal);
  addCylinder(0.38, 0.38, 0.20, 6, postX, handleCenterY + 0.21, postZ, lightMetal);
  addCylinder(0.18, 0.18, 0.028, 32, postX, handleCenterY + 0.325, postZ, darkMetal);

  // Long flat hand crank arm with a slight rounded shoulder
  const armShape = new THREE.Shape();
  armShape.moveTo(0.0, -0.43);
  armShape.lineTo(1.05, -0.43);
  armShape.quadraticCurveTo(1.35, -0.72, 1.75, -0.48);
  armShape.lineTo(6.12, -0.36);
  armShape.quadraticCurveTo(6.45, -0.33, 6.52, -0.15);
  armShape.lineTo(6.52, 0.15);
  armShape.quadraticCurveTo(6.45, 0.33, 6.12, 0.36);
  armShape.lineTo(1.75, 0.48);
  armShape.quadraticCurveTo(1.35, 0.72, 1.05, 0.43);
  armShape.lineTo(0.0, 0.43);
  armShape.quadraticCurveTo(-0.18, 0.25, -0.18, 0.0);
  armShape.quadraticCurveTo(-0.18, -0.25, 0.0, -0.43);

  addFlatExtrudedShape(armShape, handleThickness, postX + 0.22, handleCenterY, postZ + 0.02, lightMetal, 0.035);

  // End pad of the crank
  const padX = postX + 6.75;
  const padZ = postZ - 0.02;
  const padH = 0.18;
  const padCenterY = handleCenterY - 0.045;
  const padTopY = padCenterY + padH / 2;

  addRoundedSlab(1.55, 1.1, padH, 0.12, padCenterY, padX, padZ, lightMetal, 0.025);

  addCylinder(0.095, 0.095, 0.055, 24, padX - 0.52, padTopY + 0.03, padZ - 0.35, darkMetal);
  addCylinder(0.095, 0.095, 0.055, 24, padX + 0.52, padTopY + 0.03, padZ + 0.35, darkMetal);

  // Crank handle spindle and mushroom-shaped knob
  addCylinder(0.23, 0.23, 0.42, 32, padX, padTopY + 0.21, padZ, lightMetal);
  addCylinder(0.48, 0.42, 0.16, 48, padX, padTopY + 0.10, padZ, mainMetal);

  const knobBaseY = padTopY + 0.34;
  const knobProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.32, 0.0),
    new THREE.Vector2(0.55, 0.08),
    new THREE.Vector2(0.72, 0.25),
    new THREE.Vector2(0.64, 0.45),
    new THREE.Vector2(0.42, 0.62),
    new THREE.Vector2(0.10, 0.70),
    new THREE.Vector2(0.0, 0.70)
  ];

  addLathe(knobProfile, padX, knobBaseY, padZ, lightMetal, 72);

  const knobTopY = knobBaseY + 0.70;
  addTorus(0.20, 0.028, padX, knobTopY - 0.025, padZ, darkMetal, 8, 48);
  addCylinder(0.13, 0.13, 0.022, 32, padX, knobTopY - 0.005, padZ, darkMetal);

  // Camera view similar to the reference image: front-right, slightly above
  camera.position.set(15, 13, -18);
  camera.lookAt(0, 6.5, 0);
}