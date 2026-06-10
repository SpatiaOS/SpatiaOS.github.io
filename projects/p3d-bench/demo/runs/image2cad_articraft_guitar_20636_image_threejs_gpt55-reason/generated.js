{
  // Parametric interpretation of the image:
  // A grey semi-hollow electric guitar with a double-cutaway rounded body, f-holes,
  // two humbucker pickups, bridge/tailpiece hardware, strings, fretted neck, and 3+3 headstock.

  // -----------------------------
  // Materials
  // -----------------------------
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x9fa3a7, roughness: 0.48, metalness: 0.05 });
  const bodyTopMat = new THREE.MeshStandardMaterial({ color: 0xb1b4b8, roughness: 0.45, metalness: 0.04 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.38, metalness: 0.1 });
  const fretboardMat = new THREE.MeshStandardMaterial({ color: 0x202225, roughness: 0.55, metalness: 0.02 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xc8ccd0, roughness: 0.22, metalness: 0.75 });
  const screwMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.28, metalness: 0.65 });
  const stringMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.18, metalness: 0.9 });
  const pearlMat = new THREE.MeshStandardMaterial({ color: 0xe6e2cf, roughness: 0.28, metalness: 0.08 });
  const pickupMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.42, metalness: 0.22 });

  // -----------------------------
  // Main proportions
  // -----------------------------
  const bodyThickness = 0.62;
  const topCapThickness = 0.035;
  const bodyTopZ = bodyThickness / 2;
  const capTopZ = bodyTopZ + topCapThickness;
  const bodyCenterX = 2.15;

  const nutX = -10.05;
  const neckEndX = -1.12;
  const fretboardEndX = 0.86;

  const bridgeX = 3.12;
  const tailpieceX = 4.03;

  // -----------------------------
  // Utility functions
  // -----------------------------
  function createExtrudedShapeMesh(shape, depth, material, zCenter, bevelSize, bevelThickness, bevelSegments) {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: depth,
      steps: 1,
      curveSegments: 36,
      bevelEnabled: bevelSize > 0 || bevelThickness > 0,
      bevelSize: bevelSize || 0,
      bevelThickness: bevelThickness || 0,
      bevelSegments: bevelSegments || 1
    });
    geometry.translate(0, 0, -depth / 2);
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = zCenter;
    scene.add(mesh);
    return mesh;
  }

  function scaleMeshAbout(mesh, sx, sy, cx, cy) {
    mesh.scale.x *= sx;
    mesh.scale.y *= sy;
    mesh.position.x += cx * (1 - sx);
    mesh.position.y += cy * (1 - sy);
  }

  function makeTaperedRectShape(x0, x1, w0, w1) {
    const s = new THREE.Shape();
    s.moveTo(x0, -w0 / 2);
    s.lineTo(x1, -w1 / 2);
    s.lineTo(x1, w1 / 2);
    s.lineTo(x0, w0 / 2);
    s.closePath();
    return s;
  }

  function addBox(width, height, depth, x, y, z, material) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function addCylinderBetween(start, end, radius, material, radialSegments) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    if (length <= 0.0001) return null;

    const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments || 12, 1, false);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

    scene.add(mesh);
    return mesh;
  }

  function addVerticalCylinder(x, y, zCenter, radius, height, material, radialSegments, scaleX, scaleY) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments || 24, 1, false);
    geometry.rotateX(Math.PI / 2);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, zCenter);
    mesh.scale.set(scaleX || 1, scaleY || 1, 1);
    scene.add(mesh);
    return mesh;
  }

  function addDiscOnSurface(x, y, zBase, radius, height, material, radialSegments, scaleX, scaleY) {
    return addVerticalCylinder(x, y, zBase + height / 2, radius, height, material, radialSegments, scaleX, scaleY);
  }

  function addTube(points, radius, material, closed, tubularSegments) {
    const vectors = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(vectors, !!closed, "catmullrom", 0.5);
    const geometry = new THREE.TubeGeometry(curve, tubularSegments || 64, radius, 8, !!closed);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  }

  function pointsToZ(points, z) {
    return points.map(p => [p[0], p[1], z]);
  }

  function scaleXYPoints(points, sx, sy, cx, cy, z) {
    return points.map(p => [cx + (p[0] - cx) * sx, cy + (p[1] - cy) * sy, z]);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function taperedWidthAt(x, x0, x1, w0, w1) {
    const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
    return lerp(w0, w1, t);
  }

  // -----------------------------
  // Semi-hollow double-cutaway body
  // -----------------------------
  function makeBodyShape() {
    const s = new THREE.Shape();

    // Outline estimated from the image: narrow neck pocket at left, broad rounded lower/upper bouts at right.
    s.moveTo(-1.34, -0.42);
    s.bezierCurveTo(-1.77, -0.43, -2.02, -0.78, -1.88, -1.17);
    s.bezierCurveTo(-1.58, -2.05, -0.25, -2.55, 1.20, -2.62);
    s.bezierCurveTo(2.90, -2.80, 4.80, -2.38, 5.72, -1.24);
    s.bezierCurveTo(6.53, -0.23, 6.30, 1.15, 5.26, 1.96);
    s.bezierCurveTo(4.18, 2.78, 2.45, 2.88, 1.02, 2.54);
    s.bezierCurveTo(-0.18, 2.28, -1.36, 1.68, -1.78, 1.02);
    s.bezierCurveTo(-2.06, 0.58, -1.73, 0.40, -1.34, 0.42);
    s.lineTo(-1.34, -0.42);
    s.closePath();

    return s;
  }

  const bodyShape = makeBodyShape();

  // Dark slightly oversized layer suggests the black edge/binding seen around the body.
  const bodyBinding = createExtrudedShapeMesh(bodyShape, bodyThickness + 0.08, darkMat, -0.025, 0.035, 0.035, 4);
  scaleMeshAbout(bodyBinding, 1.018, 1.018, bodyCenterX, 0);

  const body = createExtrudedShapeMesh(bodyShape, bodyThickness, bodyMat, 0, 0.075, 0.075, 5);

  // Raised top cap gives the flat grey archtop/laminated plate impression.
  const bodyTopCap = createExtrudedShapeMesh(bodyShape, topCapThickness, bodyTopMat, bodyTopZ + topCapThickness / 2, 0.012, 0.006, 2);
  scaleMeshAbout(bodyTopCap, 0.972, 0.972, bodyCenterX, 0);

  const bodyOutlineXY = [
    [-1.34, -0.42], [-1.72, -0.50], [-1.88, -1.17], [-1.40, -1.92],
    [-0.25, -2.47], [1.20, -2.62], [3.00, -2.68], [4.80, -2.38],
    [5.72, -1.24], [6.15, -0.25], [5.90, 0.95], [5.26, 1.96],
    [4.18, 2.58], [2.45, 2.76], [1.02, 2.54], [-0.18, 2.28],
    [-1.36, 1.68], [-1.78, 1.02], [-1.72, 0.52], [-1.34, 0.42]
  ];

  addTube(pointsToZ(bodyOutlineXY, capTopZ + 0.028), 0.024, darkMat, true, 150);
  addTube(scaleXYPoints(bodyOutlineXY, 0.948, 0.948, bodyCenterX, 0, capTopZ + 0.033), 0.011, darkMat, true, 140);

  // -----------------------------
  // Neck, fretboard, heel, and headstock
  // -----------------------------
  const neckBackHeight = 0.22;
  const neckZ = bodyTopZ + neckBackHeight / 2 - 0.02;
  const neckTopZ = neckZ + neckBackHeight / 2;

  const neckShape = makeTaperedRectShape(nutX, neckEndX, 0.62, 0.96);
  createExtrudedShapeMesh(neckShape, neckBackHeight, bodyMat, neckZ, 0.018, 0.012, 2);

  // Wider neck heel where it blends into the guitar body.
  const heelShape = makeTaperedRectShape(-1.45, fretboardEndX, 0.98, 1.22);
  createExtrudedShapeMesh(heelShape, 0.18, bodyMat, bodyTopZ + 0.09, 0.02, 0.012, 2);

  const fretboardHeight = 0.09;
  const fretboardStartX = nutX;
  const fretboardNutWidth = 0.66;
  const fretboardEndWidth = 1.18;
  const fretboardZ = neckTopZ + fretboardHeight / 2 - 0.005;
  const fretboardTopZ = fretboardZ + fretboardHeight / 2;

  const fretboardShape = makeTaperedRectShape(fretboardStartX, fretboardEndX, fretboardNutWidth, fretboardEndWidth);
  createExtrudedShapeMesh(fretboardShape, fretboardHeight, fretboardMat, fretboardZ, 0.012, 0.006, 2);

  // Fretboard edge lines.
  addCylinderBetween(
    new THREE.Vector3(fretboardStartX, -fretboardNutWidth / 2, fretboardTopZ + 0.008),
    new THREE.Vector3(fretboardEndX, -fretboardEndWidth / 2, fretboardTopZ + 0.008),
    0.012,
    metalMat,
    8
  );
  addCylinderBetween(
    new THREE.Vector3(fretboardStartX, fretboardNutWidth / 2, fretboardTopZ + 0.008),
    new THREE.Vector3(fretboardEndX, fretboardEndWidth / 2, fretboardTopZ + 0.008),
    0.012,
    metalMat,
    8
  );

  // Nut
  addBox(0.11, fretboardNutWidth + 0.10, 0.13, nutX, 0, fretboardTopZ + 0.055, pearlMat);

  // Frets positioned with a musical 12th-root spacing from nut to bridge.
  const scaleLength = bridgeX - nutX;
  const fretHeight = 0.035;
  const fretPositions = [nutX];

  for (let f = 1; f <= 22; f++) {
    const x = nutX + scaleLength * (1 - Math.pow(2, -f / 12));
    fretPositions.push(x);
    if (x < fretboardEndX - 0.05) {
      const w = taperedWidthAt(x, fretboardStartX, fretboardEndX, fretboardNutWidth, fretboardEndWidth);
      addBox(0.035, w + 0.09, fretHeight, x, 0, fretboardTopZ + fretHeight / 2 + 0.004, metalMat);
    }
  }

  // Dot inlays on the fretboard.
  const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21];
  for (let i = 0; i < markerFrets.length; i++) {
    const f = markerFrets[i];
    if (f < fretPositions.length) {
      const x = (fretPositions[f - 1] + fretPositions[f]) / 2;
      if (x < fretboardEndX - 0.08) {
        if (f === 12) {
          addDiscOnSurface(x, -0.20, fretboardTopZ + 0.004, 0.052, 0.014, pearlMat, 20);
          addDiscOnSurface(x, 0.20, fretboardTopZ + 0.004, 0.052, 0.014, pearlMat, 20);
        } else {
          addDiscOnSurface(x, 0, fretboardTopZ + 0.004, 0.055, 0.014, pearlMat, 20);
        }
      }
    }
  }

  function makeHeadstockShape() {
    const s = new THREE.Shape();

    // Broad 3+3 headstock with rounded, slightly irregular silhouette.
    s.moveTo(nutX, -0.42);
    s.bezierCurveTo(-10.42, -0.64, -11.05, -0.78, -11.45, -0.88);
    s.bezierCurveTo(-12.08, -1.04, -12.54, -0.76, -12.61, -0.36);
    s.bezierCurveTo(-12.66, -0.12, -12.50, 0.12, -12.55, 0.38);
    s.bezierCurveTo(-12.34, 0.82, -11.78, 0.99, -11.13, 0.82);
    s.bezierCurveTo(-10.65, 0.72, -10.26, 0.54, nutX, 0.42);
    s.lineTo(nutX, -0.42);
    s.closePath();

    return s;
  }

  const headstockHeight = 0.20;
  const headstockZ = neckZ - 0.015;
  createExtrudedShapeMesh(makeHeadstockShape(), headstockHeight, bodyMat, headstockZ, 0.025, 0.014, 3);

  const headstockTopZ = headstockZ + headstockHeight / 2;

  const headstockOutlineXY = [
    [nutX, -0.42], [-10.42, -0.64], [-11.05, -0.78], [-11.45, -0.88],
    [-12.08, -1.04], [-12.61, -0.36], [-12.55, 0.38], [-12.34, 0.82],
    [-11.78, 0.99], [-11.13, 0.82], [-10.65, 0.72], [nutX, 0.42]
  ];
  addTube(pointsToZ(headstockOutlineXY, headstockTopZ + 0.02), 0.018, darkMat, true, 90);

  // Truss-rod cover plate.
  addBox(0.44, 0.22, 0.028, -10.42, 0, headstockTopZ + 0.025, darkMat);
  addDiscOnSurface(-10.28, 0, headstockTopZ + 0.044, 0.025, 0.012, metalMat, 14);

  // Tuning machines, three per side.
  const tunerPosts = [
    { x: -11.95, y: -0.61, buttonY: -1.08 },
    { x: -11.35, y: -0.66, buttonY: -1.12 },
    { x: -10.78, y: -0.57, buttonY: -1.02 },
    { x: -10.78, y: 0.57, buttonY: 1.02 },
    { x: -11.35, y: 0.66, buttonY: 1.12 },
    { x: -11.95, y: 0.61, buttonY: 1.08 }
  ];

  for (let i = 0; i < tunerPosts.length; i++) {
    const t = tunerPosts[i];
    addDiscOnSurface(t.x, t.y, headstockTopZ + 0.02, 0.065, 0.12, metalMat, 24);
    addDiscOnSurface(t.x, t.y, headstockTopZ + 0.15, 0.035, 0.035, darkMat, 18);
    addCylinderBetween(
      new THREE.Vector3(t.x, t.y, headstockTopZ + 0.09),
      new THREE.Vector3(t.x, t.buttonY * 0.94, headstockTopZ + 0.09),
      0.025,
      metalMat,
      10
    );
    addDiscOnSurface(t.x, t.buttonY, headstockTopZ + 0.055, 0.13, 0.065, metalMat, 24, 0.72, 1.35);
  }

  // -----------------------------
  // F-holes represented as dark engraved/tubular curves
  // -----------------------------
  function addFHole(cx, cy, mirrorY) {
    const z = capTopZ + 0.04;
    const sign = mirrorY ? -1 : 1;

    const main = [
      [cx - 0.34, cy + sign * 0.55, z],
      [cx - 0.10, cy + sign * 0.48, z],
      [cx + 0.10, cy + sign * 0.25, z],
      [cx + 0.02, cy + sign * 0.02, z],
      [cx - 0.15, cy - sign * 0.20, z],
      [cx - 0.02, cy - sign * 0.46, z],
      [cx + 0.34, cy - sign * 0.54, z]
    ];

    addTube(main, 0.032, darkMat, false, 54);

    addTube([
      [cx - 0.48, cy + sign * 0.36, z],
      [cx - 0.17, cy + sign * 0.48, z]
    ], 0.027, darkMat, false, 10);

    addTube([
      [cx + 0.03, cy - sign * 0.34, z],
      [cx + 0.38, cy - sign * 0.47, z]
    ], 0.027, darkMat, false, 10);

    addDiscOnSurface(cx - 0.34, cy + sign * 0.55, capTopZ + 0.024, 0.045, 0.015, darkMat, 18);
    addDiscOnSurface(cx + 0.34, cy - sign * 0.54, capTopZ + 0.024, 0.045, 0.015, darkMat, 18);
  }

  addFHole(0.78, -1.25, false);
  addFHole(3.55, 1.23, true);

  // -----------------------------
  // Humbucker pickups
  // -----------------------------
  function addPickup(cx, cy) {
    const outerX = 1.05;
    const outerY = 1.30;
    const bar = 0.075;
    const zBase = capTopZ + 0.018;

    // Mounting ring made from four separate bars so the black pickup center remains visible.
    addBox(outerX, bar, 0.070, cx, cy + outerY / 2 - bar / 2, zBase + 0.035, metalMat);
    addBox(outerX, bar, 0.070, cx, cy - outerY / 2 + bar / 2, zBase + 0.035, metalMat);
    addBox(bar, outerY, 0.070, cx - outerX / 2 + bar / 2, cy, zBase + 0.035, metalMat);
    addBox(bar, outerY, 0.070, cx + outerX / 2 - bar / 2, cy, zBase + 0.035, metalMat);

    addBox(outerX - 2 * bar, outerY - 2 * bar, 0.085, cx, cy, zBase + 0.058, pickupMat);

    // Two coil bars.
    addBox(0.25, outerY - 0.28, 0.10, cx - 0.18, cy, zBase + 0.085, darkMat);
    addBox(0.25, outerY - 0.28, 0.10, cx + 0.18, cy, zBase + 0.085, darkMat);

    // Twelve small pole pieces.
    const poleYs = [-0.42, -0.25, -0.08, 0.08, 0.25, 0.42];
    for (let row = 0; row < 2; row++) {
      const px = cx + (row === 0 ? -0.18 : 0.18);
      for (let i = 0; i < poleYs.length; i++) {
        addDiscOnSurface(px, cy + poleYs[i], zBase + 0.135, 0.025, 0.014, metalMat, 14);
      }
    }

    // Mounting screws on ring corners.
    addDiscOnSurface(cx - 0.44, cy - 0.56, zBase + 0.074, 0.035, 0.014, screwMat, 14);
    addDiscOnSurface(cx - 0.44, cy + 0.56, zBase + 0.074, 0.035, 0.014, screwMat, 14);
    addDiscOnSurface(cx + 0.44, cy - 0.56, zBase + 0.074, 0.035, 0.014, screwMat, 14);
    addDiscOnSurface(cx + 0.44, cy + 0.56, zBase + 0.074, 0.035, 0.014, screwMat, 14);
  }

  addPickup(0.95, 0);
  addPickup(2.20, 0);

  // -----------------------------
  // Bridge, saddles, and stop tailpiece
  // -----------------------------
  const bridgeBarZ = capTopZ + 0.19;
  addCylinderBetween(
    new THREE.Vector3(bridgeX, -0.66, bridgeBarZ),
    new THREE.Vector3(bridgeX, 0.66, bridgeBarZ),
    0.060,
    metalMat,
    18
  );

  addDiscOnSurface(bridgeX, -0.66, capTopZ + 0.03, 0.075, 0.18, metalMat, 20);
  addDiscOnSurface(bridgeX, 0.66, capTopZ + 0.03, 0.075, 0.18, metalMat, 20);

  const tailpieceZ = capTopZ + 0.135;
  addCylinderBetween(
    new THREE.Vector3(tailpieceX, -0.72, tailpieceZ),
    new THREE.Vector3(tailpieceX, 0.72, tailpieceZ),
    0.080,
    metalMat,
    22
  );

  addDiscOnSurface(tailpieceX, -0.72, capTopZ + 0.025, 0.090, 0.16, metalMat, 22);
  addDiscOnSurface(tailpieceX, 0.72, capTopZ + 0.025, 0.090, 0.16, metalMat, 22);

  // Saddles aligned with the six strings.
  const stringCount = 6;
  const nutSpread = 0.52;
  const bridgeSpread = 0.98;
  const bridgeYs = [];
  const nutYs = [];

  for (let i = 0; i < stringCount; i++) {
    const t = i / (stringCount - 1);
    nutYs.push(lerp(-nutSpread / 2, nutSpread / 2, t));
    bridgeYs.push(lerp(-bridgeSpread / 2, bridgeSpread / 2, t));
    addBox(0.13, 0.060, 0.050, bridgeX + (i - 2.5) * 0.028, bridgeYs[i], bridgeBarZ + 0.065, metalMat);
  }

  // -----------------------------
  // Controls: knobs, switch, output jack, and decorative screws
  // -----------------------------
  const knobPositions = [
    [4.55, -1.03],
    [5.10, -0.42],
    [4.78, 0.45],
    [5.32, 1.05]
  ];

  for (let i = 0; i < knobPositions.length; i++) {
    const p = knobPositions[i];
    addDiscOnSurface(p[0], p[1], capTopZ + 0.025, 0.135, 0.095, metalMat, 28);
    addDiscOnSurface(p[0], p[1], capTopZ + 0.126, 0.065, 0.018, darkMat, 20);
  }

  // Toggle switch near upper bout.
  addDiscOnSurface(3.78, 1.53, capTopZ + 0.025, 0.13, 0.050, metalMat, 24);
  addCylinderBetween(
    new THREE.Vector3(3.78, 1.53, capTopZ + 0.075),
    new THREE.Vector3(3.93, 1.63, capTopZ + 0.38),
    0.022,
    metalMat,
    12
  );
  addDiscOnSurface(3.95, 1.64, capTopZ + 0.37, 0.045, 0.035, darkMat, 16);

  // Output jack / small dark circular hole on lower right body.
  addDiscOnSurface(5.42, -1.46, capTopZ + 0.025, 0.075, 0.020, darkMat, 20);
  addDiscOnSurface(5.42, -1.46, capTopZ + 0.046, 0.034, 0.012, metalMat, 16);

  // Extra body screws matching the technical drawing look.
  const bodyScrews = [
    [3.55, -0.95], [3.92, -0.88], [4.88, 1.55],
    [5.55, 0.18], [5.75, 0.82], [4.08, 1.92]
  ];
  for (let i = 0; i < bodyScrews.length; i++) {
    addDiscOnSurface(bodyScrews[i][0], bodyScrews[i][1], capTopZ + 0.025, 0.038, 0.016, metalMat, 16);
  }

  // Strap button at the far end of the body.
  addCylinderBetween(
    new THREE.Vector3(6.12, 0, 0.02),
    new THREE.Vector3(6.42, 0, 0.02),
    0.075,
    metalMat,
    18
  );

  // -----------------------------
  // Strings
  // -----------------------------
  const stringRadii = [0.018, 0.016, 0.014, 0.012, 0.010, 0.009];
  const stringZBridge = bridgeBarZ + 0.105;
  const stringZNut = fretboardTopZ + 0.085;
  const stringZTail = tailpieceZ + 0.080;
  const stringZTuner = headstockTopZ + 0.165;

  for (let i = 0; i < stringCount; i++) {
    const r = stringRadii[i];

    // Tailpiece to bridge.
    addCylinderBetween(
      new THREE.Vector3(tailpieceX + 0.05, bridgeYs[i], stringZTail),
      new THREE.Vector3(bridgeX, bridgeYs[i], stringZBridge),
      r,
      stringMat,
      8
    );

    // Bridge to nut over pickups/frets.
    addCylinderBetween(
      new THREE.Vector3(bridgeX, bridgeYs[i], stringZBridge),
      new THREE.Vector3(nutX, nutYs[i], stringZNut),
      r,
      stringMat,
      8
    );

    // Nut to tuning post, fanning out across the headstock.
    addCylinderBetween(
      new THREE.Vector3(nutX, nutYs[i], stringZNut),
      new THREE.Vector3(tunerPosts[i].x, tunerPosts[i].y, stringZTuner),
      r * 0.85,
      stringMat,
      8
    );
  }

  // -----------------------------
  // Camera framing
  // -----------------------------
  camera.position.set(7.8, -12.5, 7.2);
  camera.lookAt(-3.25, 0, 0.35);
}