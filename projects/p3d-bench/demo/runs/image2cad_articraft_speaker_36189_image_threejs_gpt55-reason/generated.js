{
  // Parametric interpretation of the image:
  // A long, shallow rectangular cabinet with rounded/chamfered edges, two ornate front speaker grilles,
  // angular decorative inlays, three top buttons, top panel seams, and four angled tapered legs.

  // ---------- Parameters ----------
  const TWO_PI = Math.PI * 2;

  const bodyWidth = 12.0;
  const bodyHeight = 4.3;
  const bodyDepth = 2.2;
  const bodyCenterY = 3.25;
  const bodyCornerRadius = 0.16;
  const bodyBevel = 0.035;

  const bodyFrontZ = bodyDepth / 2;
  const bodyBackZ = -bodyDepth / 2;
  const bodyTopY = bodyCenterY + bodyHeight / 2;
  const bodyBottomY = bodyCenterY - bodyHeight / 2;

  const frontPanelWidth = 11.45;
  const frontPanelHeight = 3.95;
  const frontPanelDepth = 0.065;
  const frontPanelBaseZ = bodyFrontZ + 0.005;
  const faceSurfaceZ = frontPanelBaseZ + frontPanelDepth;

  const speakerCenterY = bodyCenterY - 0.03;
  const speakerOffsetX = 3.75;

  // ---------- Materials ----------
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x9b9b9e,
    roughness: 0.58,
    metalness: 0.04
  });

  const panelMat = new THREE.MeshStandardMaterial({
    color: 0xa8a8ab,
    roughness: 0.62,
    metalness: 0.03
  });

  const raisedMat = new THREE.MeshStandardMaterial({
    color: 0xb9b9bb,
    roughness: 0.52,
    metalness: 0.04
  });

  const facetMat = new THREE.MeshStandardMaterial({
    color: 0x929295,
    roughness: 0.68,
    metalness: 0.02
  });

  const grilleMat = new THREE.MeshStandardMaterial({
    color: 0xb2b2b4,
    roughness: 0.55,
    metalness: 0.05
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.5,
    metalness: 0.08
  });

  const grooveMat = new THREE.MeshStandardMaterial({
    color: 0x2b2b2e,
    roughness: 0.6,
    metalness: 0.04
  });

  const legMat = new THREE.MeshStandardMaterial({
    color: 0xc2c2c4,
    roughness: 0.36,
    metalness: 0.18
  });

  const buttonMat = new THREE.MeshStandardMaterial({
    color: 0x9d9d9f,
    roughness: 0.42,
    metalness: 0.12
  });

  // ---------- Utility helpers ----------
  function addMesh(mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function roundedRectShape(width, height, radius) {
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    shape.closePath();

    return shape;
  }

  function addExtrudedShape(shape, depth, material, x, y, z, bevelSize = 0, bevelSegments = 1) {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: depth,
      bevelEnabled: bevelSize > 0,
      bevelSize: bevelSize,
      bevelThickness: bevelSize,
      bevelSegments: bevelSegments,
      curveSegments: 16
    });
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return addMesh(mesh);
  }

  function addBox(width, height, depth, x, y, z, material, rx = 0, ry = 0, rz = 0) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    return addMesh(mesh);
  }

  function addFrontStrip(x1, y1, x2, y2, stripWidth, depth, baseZ, material) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const geometry = new THREE.BoxGeometry(length, stripWidth, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, baseZ + depth / 2);
    mesh.rotation.z = angle;
    return addMesh(mesh);
  }

  function addFrontPolygon(points, depth, baseZ, material) {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i][0], points[i][1]);
    }
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: depth,
      bevelEnabled: false
    });
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, baseZ);
    return addMesh(mesh);
  }

  function ringShape(outerRadius, innerRadius) {
    const shape = new THREE.Shape();
    shape.moveTo(outerRadius, 0);
    shape.absarc(0, 0, outerRadius, 0, TWO_PI, false);
    shape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(innerRadius, 0);
    hole.absarc(0, 0, innerRadius, 0, TWO_PI, true);
    hole.closePath();

    shape.holes.push(hole);
    return shape;
  }

  function addFrontRing(cx, cy, outerRadius, innerRadius, depth, baseZ, material) {
    return addExtrudedShape(
      ringShape(outerRadius, innerRadius),
      depth,
      material,
      cx,
      cy,
      baseZ
    );
  }

  function addFrontCylinder(cx, cy, radius, depth, baseZ, material, segments = 72) {
    const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments);
    const mesh = new THREE.Mesh(geometry, material);

    // Cylinder axis is Y by default; rotate so the circular face is on the cabinet front.
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(cx, cy, baseZ + depth / 2);

    return addMesh(mesh);
  }

  function polygonPoints(rx, ry, sides, rotation) {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const a = rotation + (i / sides) * TWO_PI;
      points.push(new THREE.Vector2(Math.cos(a) * rx, Math.sin(a) * ry));
    }
    return points;
  }

  function addFrontPolygonRing(cx, cy, outerRx, outerRy, innerRx, innerRy, sides, rotation, depth, baseZ, material) {
    const outer = polygonPoints(outerRx, outerRy, sides, rotation);
    const inner = polygonPoints(innerRx, innerRy, sides, rotation).reverse();

    const shape = new THREE.Shape();
    shape.moveTo(outer[0].x, outer[0].y);
    for (let i = 1; i < outer.length; i++) {
      shape.lineTo(outer[i].x, outer[i].y);
    }
    shape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(inner[0].x, inner[0].y);
    for (let i = 1; i < inner.length; i++) {
      hole.lineTo(inner[i].x, inner[i].y);
    }
    hole.closePath();

    shape.holes.push(hole);

    return addExtrudedShape(shape, depth, material, cx, cy, baseZ);
  }

  function addTaperedCylinderBetween(topPoint, bottomPoint, topRadius, bottomRadius, material, segments = 32) {
    const axis = new THREE.Vector3().subVectors(topPoint, bottomPoint);
    const length = axis.length();

    const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, length, segments, 1, false);
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(new THREE.Vector3().addVectors(topPoint, bottomPoint).multiplyScalar(0.5));

    // Local +Y points to the top cap, so align +Y with bottom->top.
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      axis.clone().normalize()
    );

    return addMesh(mesh);
  }

  // ---------- Main cabinet ----------
  addExtrudedShape(
    roundedRectShape(bodyWidth, bodyHeight, bodyCornerRadius),
    bodyDepth,
    bodyMat,
    0,
    bodyCenterY,
    bodyBackZ,
    bodyBevel,
    2
  );

  // Slightly raised front face plate.
  addExtrudedShape(
    roundedRectShape(frontPanelWidth, frontPanelHeight, 0.08),
    frontPanelDepth,
    panelMat,
    0,
    bodyCenterY,
    frontPanelBaseZ,
    0.01,
    1
  );

  // Front plate perimeter grooves/edges.
  const panelHalfW = frontPanelWidth / 2;
  const panelHalfH = frontPanelHeight / 2;
  const panelTop = bodyCenterY + panelHalfH;
  const panelBottom = bodyCenterY - panelHalfH;
  const panelLeft = -panelHalfW;
  const panelRight = panelHalfW;
  const borderZ = faceSurfaceZ + 0.012;

  addFrontStrip(panelLeft + 0.08, panelTop, panelRight - 0.08, panelTop, 0.035, 0.026, borderZ, grooveMat);
  addFrontStrip(panelLeft + 0.08, panelBottom, panelRight - 0.08, panelBottom, 0.035, 0.026, borderZ, grooveMat);
  addFrontStrip(panelLeft, panelBottom + 0.08, panelLeft, panelTop - 0.08, 0.035, 0.026, borderZ, grooveMat);
  addFrontStrip(panelRight, panelBottom + 0.08, panelRight, panelTop - 0.08, 0.035, 0.026, borderZ, grooveMat);

  // ---------- Speaker assembly ----------
  function addSpeaker(cx, cy) {
    // Large clipped-octagon raised frame around each circular speaker.
    addFrontPolygonRing(cx, cy, 1.90, 1.66, 1.58, 1.38, 8, Math.PI / 8, 0.09, faceSurfaceZ + 0.015, raisedMat);

    // Nested dark octagonal grooves like the fine black outlines in the image.
    addFrontPolygonRing(cx, cy, 1.78, 1.55, 1.71, 1.48, 8, Math.PI / 8, 0.026, faceSurfaceZ + 0.115, darkMat);
    addFrontPolygonRing(cx, cy, 1.53, 1.33, 1.47, 1.27, 8, Math.PI / 8, 0.026, faceSurfaceZ + 0.115, darkMat);

    // Raised circular grille field.
    addFrontRing(cx, cy, 1.34, 0.82, 0.06, faceSurfaceZ + 0.075, grilleMat);

    // Circular dark boundary rings.
    addFrontRing(cx, cy, 1.36, 1.29, 0.026, faceSurfaceZ + 0.135, darkMat);
    addFrontRing(cx, cy, 0.91, 0.84, 0.026, faceSurfaceZ + 0.135, darkMat);

    // Dense radial grille slots, approximated with narrow black raised/inset strips.
    const grilleCount = 56;
    for (let i = 0; i < grilleCount; i++) {
      const a = (i / grilleCount) * TWO_PI;
      const c = Math.cos(a);
      const s = Math.sin(a);

      const longSlot = i % 4 === 0;
      const innerR = longSlot ? 0.86 : 0.96;
      const outerR = i % 7 === 0 ? 1.32 : 1.27;
      const slotWidth = i % 6 === 0 ? 0.052 : 0.036;

      addFrontStrip(
        cx + c * innerR,
        cy + s * innerR,
        cx + c * outerR,
        cy + s * outerR,
        slotWidth,
        0.032,
        faceSurfaceZ + 0.152,
        darkMat
      );
    }

    // Plain central speaker disk.
    addFrontCylinder(cx, cy, 0.80, 0.078, faceSurfaceZ + 0.178, panelMat, 72);
    addFrontRing(cx, cy, 0.82, 0.78, 0.018, faceSurfaceZ + 0.263, darkMat);
  }

  addSpeaker(-speakerOffsetX, speakerCenterY);
  addSpeaker(speakerOffsetX, speakerCenterY);

  // ---------- Angular chevrons beside speakers ----------
  function addChevron(sign) {
    // sign -1 = left side points inward to the right; sign +1 = right side points inward to the left.
    const outerX = sign * 2.05;
    const pointX = sign * 1.25;
    const topY = speakerCenterY + 1.55;
    const midY = speakerCenterY;
    const botY = speakerCenterY - 1.55;

    // Raised broad chevron.
    addFrontStrip(outerX, topY, pointX, midY, 0.18, 0.050, faceSurfaceZ + 0.030, raisedMat);
    addFrontStrip(pointX, midY, outerX, botY, 0.18, 0.050, faceSurfaceZ + 0.030, raisedMat);

    // Dark inner groove on the chevron.
    addFrontStrip(outerX, topY, pointX, midY, 0.048, 0.026, faceSurfaceZ + 0.095, darkMat);
    addFrontStrip(pointX, midY, outerX, botY, 0.048, 0.026, faceSurfaceZ + 0.095, darkMat);

    // Smaller parallel inner chevron, giving the stepped layered look.
    const innerOuterX = sign * 1.82;
    const innerPointX = sign * 1.43;
    const innerTopY = speakerCenterY + 1.20;
    const innerBotY = speakerCenterY - 1.20;

    addFrontStrip(innerOuterX, innerTopY, innerPointX, midY, 0.052, 0.026, faceSurfaceZ + 0.115, grooveMat);
    addFrontStrip(innerPointX, midY, innerOuterX, innerBotY, 0.052, 0.026, faceSurfaceZ + 0.115, grooveMat);
  }

  addChevron(-1);
  addChevron(1);

  // Slender angled side bars near the central motif.
  addFrontStrip(-1.06, speakerCenterY - 0.82, -1.28, speakerCenterY + 0.72, 0.13, 0.045, faceSurfaceZ + 0.040, raisedMat);
  addFrontStrip(-1.06, speakerCenterY - 0.82, -1.28, speakerCenterY + 0.72, 0.040, 0.026, faceSurfaceZ + 0.105, darkMat);

  addFrontStrip(1.06, speakerCenterY - 0.82, 1.28, speakerCenterY + 0.72, 0.13, 0.045, faceSurfaceZ + 0.040, raisedMat);
  addFrontStrip(1.06, speakerCenterY - 0.82, 1.28, speakerCenterY + 0.72, 0.040, 0.026, faceSurfaceZ + 0.105, darkMat);

  // ---------- Central angular X/star inlay ----------
  const centerTopY = speakerCenterY + 1.70;
  const centerBottomY = speakerCenterY - 1.70;
  const centerMidY = speakerCenterY;

  // Subtle triangular facets underneath the dark line work.
  addFrontPolygon(
    [
      [-0.70, centerTopY],
      [0.00, centerMidY],
      [-0.70, centerBottomY]
    ],
    0.025,
    faceSurfaceZ + 0.018,
    facetMat
  );

  addFrontPolygon(
    [
      [0.70, centerTopY],
      [0.00, centerMidY],
      [0.70, centerBottomY]
    ],
    0.025,
    faceSurfaceZ + 0.018,
    facetMat
  );

  // Sharp black line work forming the central X and triangular cuts.
  addFrontStrip(-0.70, centerTopY, 0.70, centerBottomY, 0.040, 0.028, faceSurfaceZ + 0.100, darkMat);
  addFrontStrip(-0.70, centerBottomY, 0.70, centerTopY, 0.040, 0.028, faceSurfaceZ + 0.100, darkMat);
  addFrontStrip(-0.70, centerTopY, 0.00, centerMidY, 0.032, 0.028, faceSurfaceZ + 0.118, grooveMat);
  addFrontStrip(0.00, centerMidY, -0.70, centerBottomY, 0.032, 0.028, faceSurfaceZ + 0.118, grooveMat);
  addFrontStrip(0.70, centerTopY, 0.00, centerMidY, 0.032, 0.028, faceSurfaceZ + 0.118, grooveMat);
  addFrontStrip(0.00, centerMidY, 0.70, centerBottomY, 0.032, 0.028, faceSurfaceZ + 0.118, grooveMat);

  // ---------- Top surface seams ----------
  // Thin dark raised/groove strips divide the top into rectangular panels.
  addBox(0.035, 0.026, bodyDepth - 0.28, -2.10, bodyTopY + 0.018, 0, grooveMat);
  addBox(0.035, 0.026, bodyDepth - 0.28, 1.55, bodyTopY + 0.018, 0, grooveMat);
  addBox(0.035, 0.026, bodyDepth - 0.28, 4.25, bodyTopY + 0.018, 0, grooveMat);

  // Top/front and right-side edge accents to emphasize the box outline.
  addBox(bodyWidth - 0.45, 0.024, 0.036, 0, bodyTopY + 0.020, bodyFrontZ + 0.010, grooveMat);
  addBox(0.036, 0.024, bodyDepth - 0.26, bodyWidth / 2 + 0.015, bodyTopY + 0.020, 0, grooveMat);
  addBox(0.040, bodyHeight - 0.45, 0.035, bodyWidth / 2 + 0.018, bodyCenterY, bodyFrontZ - 0.015, grooveMat);
  addBox(0.040, bodyHeight - 0.45, 0.035, bodyWidth / 2 + 0.018, bodyCenterY, bodyBackZ + 0.015, grooveMat);

  // ---------- Top buttons ----------
  function addTopButton(x, z, type) {
    const baseH = 0.085;
    const capH = 0.036;

    const baseGeom = new THREE.CylinderGeometry(0.245, 0.245, baseH, 36);
    const base = new THREE.Mesh(baseGeom, darkMat);
    base.position.set(x, bodyTopY + baseH / 2, z);
    addMesh(base);

    const capGeom = new THREE.CylinderGeometry(0.175, 0.175, capH, 36);
    const cap = new THREE.Mesh(capGeom, buttonMat);
    cap.position.set(x, bodyTopY + baseH + capH / 2, z);
    addMesh(cap);

    const iconY = bodyTopY + baseH + capH + 0.008;
    const iconH = 0.012;

    if (type === "minus") {
      addBox(0.19, iconH, 0.035, x, iconY, z, darkMat);
    } else if (type === "plus") {
      addBox(0.19, iconH, 0.035, x, iconY, z, darkMat);
      addBox(0.035, iconH, 0.19, x, iconY, z, darkMat);
    } else {
      // Small simplified power/U icon.
      addBox(0.035, iconH, 0.145, x - 0.055, iconY, z + 0.010, darkMat);
      addBox(0.035, iconH, 0.145, x + 0.055, iconY, z + 0.010, darkMat);
      addBox(0.150, iconH, 0.035, x, iconY, z - 0.060, darkMat);
    }
  }

  addTopButton(3.75, 0.43, "minus");
  addTopButton(4.45, 0.43, "plus");
  addTopButton(5.15, 0.43, "power");

  // ---------- Legs and sockets ----------
  function addLegSocket(x, z) {
    const socketH = 0.22;
    const geometry = new THREE.CylinderGeometry(0.30, 0.24, socketH, 32);
    const socket = new THREE.Mesh(geometry, legMat);
    socket.position.set(x, bodyBottomY - socketH / 2, z);
    return addMesh(socket);
  }

  const socketH = 0.22;
  const legTopY = bodyBottomY - socketH + 0.02;

  const legs = [
    // Front-left leg: long and strongly splayed, matching the prominent left leg in the image.
    {
      top: new THREE.Vector3(-4.90, legTopY, 0.72),
      bottom: new THREE.Vector3(-6.15, -1.55, 1.95)
    },
    // Rear-left/inner leg, partly hidden behind the cabinet.
    {
      top: new THREE.Vector3(-3.05, legTopY, -0.72),
      bottom: new THREE.Vector3(-2.65, -1.35, -1.62)
    },
    // Front-right leg, nearly vertical but slightly forward.
    {
      top: new THREE.Vector3(4.20, legTopY, 0.72),
      bottom: new THREE.Vector3(4.35, -1.70, 1.42)
    },
    // Rear-right leg, splayed outward/back.
    {
      top: new THREE.Vector3(5.20, legTopY, -0.72),
      bottom: new THREE.Vector3(6.25, -1.50, -1.85)
    }
  ];

  for (let i = 0; i < legs.length; i++) {
    addLegSocket(legs[i].top.x, legs[i].top.z);
    addTaperedCylinderBetween(legs[i].top, legs[i].bottom, 0.23, 0.145, legMat, 36);
  }

  // ---------- Camera ----------
  camera.position.set(9.0, 7.4, 8.8);
  camera.lookAt(0, 2.45, 0);
}