(function () {
  // Parametric interpretation: a vintage portable television / compact monitor.
  // Main features from the image: wide grey cabinet, large recessed CRT-like screen
  // on the left, narrow vertical speaker/control column on the right, raised top
  // plate with a long slot, visible right side panel, black technical-outline edges,
  // and twin telescoping antennas.

  // -------------------- Parameters --------------------
  const bodyW = 13.2;
  const bodyH = 5.8;
  const bodyD = 4.8;

  const lineT = 0.055;
  const detailD = 0.045;
  const frameD = 0.18;

  const leftX = -bodyW / 2;
  const rightX = bodyW / 2;
  const bottomY = -bodyH / 2;
  const topY = bodyH / 2;
  const frontZ = -bodyD / 2;
  const backZ = bodyD / 2;

  const frameZ = frontZ - frameD / 2;
  const detailZ = frontZ - frameD - detailD / 2 - 0.012;

  // -------------------- Materials --------------------
  const matCabinet = new THREE.MeshStandardMaterial({ color: 0x8e9093, roughness: 0.58, metalness: 0.12 });
  const matCabinetDark = new THREE.MeshStandardMaterial({ color: 0x686a6d, roughness: 0.62, metalness: 0.12 });
  const matTrim = new THREE.MeshStandardMaterial({ color: 0xa6a8aa, roughness: 0.52, metalness: 0.16 });
  const matTop = new THREE.MeshStandardMaterial({ color: 0x999b9e, roughness: 0.55, metalness: 0.16 });
  const matSide = new THREE.MeshStandardMaterial({ color: 0x939598, roughness: 0.60, metalness: 0.12 });
  const matInk = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.70, metalness: 0.00 });
  const matBlack = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.75, metalness: 0.00 });
  const matDarkGrey = new THREE.MeshStandardMaterial({ color: 0x222326, roughness: 0.65, metalness: 0.05 });
  const matSteel = new THREE.MeshStandardMaterial({ color: 0xd0d1d2, roughness: 0.36, metalness: 0.55 });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x8f969d,
    roughness: 0.22,
    metalness: 0.05,
    side: THREE.DoubleSide
  });
  const matReflection = new THREE.MeshStandardMaterial({ color: 0x41474d, roughness: 0.40, metalness: 0.05 });

  // -------------------- Helpers --------------------
  function addBox(w, h, d, x, y, z, material, rx, ry, rz) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx || 0, ry || 0, rz || 0);
    scene.add(mesh);
    return mesh;
  }

  function addSphere(radius, x, y, z, material, segments) {
    const geometry = new THREE.SphereGeometry(radius, segments || 16, segments || 16);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function addFrontDisk(x, y, z, radius, depth, material, segments) {
    const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments || 24, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function addCylinderBetween(start, end, radius, material, radialSegments) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    if (length <= 0.0001) {
      return null;
    }

    const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments || 12, 1);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

    scene.add(mesh);
    return mesh;
  }

  function addOrientedBox(w, h, d, center, direction, material) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(center);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    scene.add(mesh);
    return mesh;
  }

  function addCurvedScreen(cx, cy, baseZ, w, h, bulge, material) {
    const segX = 28;
    const segY = 16;
    const positions = [];
    const indices = [];

    for (let iy = 0; iy <= segY; iy++) {
      const v = iy / segY;
      const y = cy - h / 2 + v * h;
      const yn = (v - 0.5) * 2;

      for (let ix = 0; ix <= segX; ix++) {
        const u = ix / segX;
        const x = cx - w / 2 + u * w;
        const xn = (u - 0.5) * 2;

        // Slight convex CRT bow, strongest near the middle.
        const falloff = Math.max(0, 1 - xn * xn) * Math.max(0, 1 - yn * yn);
        const z = baseZ - bulge * falloff;

        positions.push(x, y, z);
      }
    }

    for (let iy = 0; iy < segY; iy++) {
      for (let ix = 0; ix < segX; ix++) {
        const a = iy * (segX + 1) + ix;
        const b = a + 1;
        const c = a + (segX + 1);
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  }

  function addTube(points, radius, material) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 36, radius, 7, false);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  }

  function addTelescopingAntenna(start, end) {
    const dir = new THREE.Vector3().subVectors(end, start).normalize();

    const segments = [
      { a: 0.00, b: 0.38, r: 0.045 },
      { a: 0.38, b: 0.70, r: 0.036 },
      { a: 0.70, b: 1.00, r: 0.027 }
    ];

    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      const p0 = new THREE.Vector3().lerpVectors(start, end, s.a);
      const p1 = new THREE.Vector3().lerpVectors(start, end, s.b);
      addCylinderBetween(p0, p1, s.r, matSteel, 12);
    }

    for (let i = 0; i < 2; i++) {
      const f = i === 0 ? 0.38 : 0.70;
      const c = new THREE.Vector3().lerpVectors(start, end, f);
      const half = dir.clone().multiplyScalar(0.075);
      addCylinderBetween(c.clone().sub(half), c.clone().add(half), 0.055, matInk, 12);
    }

    addSphere(0.105, start.x, start.y, start.z, matSteel, 16);
    addOrientedBox(0.18, 0.12, 0.10, end.clone(), dir, matSteel);
    addSphere(0.055, end.x, end.y, end.z, matInk, 12);
  }

  // -------------------- Main cabinet --------------------
  addBox(bodyW, bodyH, bodyD, 0, 0, 0, matCabinet);

  // Slightly raised front face.
  addBox(bodyW - 0.55, bodyH - 0.55, 0.10, -0.05, 0, frontZ - 0.052, matCabinetDark);

  // Black edge lines echo the crisp drawn outlines in the reference.
  addBox(bodyW, lineT, lineT, 0, topY + lineT / 2, frontZ - lineT / 2, matInk);
  addBox(bodyW, lineT, lineT, 0, bottomY - lineT / 2, frontZ - lineT / 2, matInk);
  addBox(lineT, bodyH, lineT, leftX - lineT / 2, 0, frontZ - lineT / 2, matInk);
  addBox(lineT, bodyH, lineT, rightX + lineT / 2, 0, frontZ - lineT / 2, matInk);

  addBox(lineT, lineT, bodyD, rightX + lineT / 2, topY + lineT / 2, 0, matInk);
  addBox(lineT, lineT, bodyD, rightX + lineT / 2, bottomY - lineT / 2, 0, matInk);
  addBox(lineT, bodyH, lineT, rightX + lineT / 2, 0, backZ + lineT / 2, matInk);
  addBox(bodyW, lineT, lineT, 0, topY + lineT / 2, backZ + lineT / 2, matInk);

  // -------------------- Top raised lid and slot --------------------
  const topPlateT = 0.12;
  const topPlateW = bodyW - 0.75;
  const topPlateD = bodyD - 0.65;
  const topPlateY = topY + topPlateT / 2;

  addBox(topPlateW, topPlateT, topPlateD, -0.05, topPlateY, 0, matTop);

  const topSurfaceY = topY + topPlateT;

  addBox(topPlateW, lineT * 0.75, lineT, -0.05, topSurfaceY + 0.015, -topPlateD / 2, matInk);
  addBox(topPlateW, lineT * 0.75, lineT, -0.05, topSurfaceY + 0.015, topPlateD / 2, matInk);
  addBox(lineT, lineT * 0.75, topPlateD, -0.05 - topPlateW / 2, topSurfaceY + 0.015, 0, matInk);
  addBox(lineT, lineT * 0.75, topPlateD, -0.05 + topPlateW / 2, topSurfaceY + 0.015, 0, matInk);

  // Long narrow top slot / handle recess.
  const slotW = 4.55;
  const slotD = 0.18;
  const slotX = 1.65;
  const slotZ = -0.42;
  const slotY = topSurfaceY + 0.028;

  addBox(slotW, 0.035, slotD, slotX, slotY, slotZ, matBlack);
  addBox(slotW + 0.18, 0.025, 0.025, slotX, slotY + 0.016, slotZ - slotD / 2 - 0.025, matInk);
  addBox(slotW + 0.18, 0.025, 0.025, slotX, slotY + 0.016, slotZ + slotD / 2 + 0.025, matInk);
  addBox(0.025, 0.025, slotD + 0.10, slotX - slotW / 2 - 0.04, slotY + 0.016, slotZ, matInk);
  addBox(0.025, 0.025, slotD + 0.10, slotX + slotW / 2 + 0.04, slotY + 0.016, slotZ, matInk);

  // -------------------- Large CRT / glass window on the left --------------------
  const screenOuterW = 9.75;
  const screenOuterH = 4.75;
  const screenInnerW = 8.45;
  const screenInnerH = 3.45;
  const screenX = -1.25;
  const screenY = 0;
  const screenFrameT = (screenOuterW - screenInnerW) / 2;

  // Raised rectangular outer frame.
  addBox(screenOuterW, screenFrameT, frameD, screenX, screenY + screenOuterH / 2 - screenFrameT / 2, frameZ, matTrim);
  addBox(screenOuterW, screenFrameT, frameD, screenX, screenY - screenOuterH / 2 + screenFrameT / 2, frameZ, matTrim);
  addBox(screenFrameT, screenOuterH, frameD, screenX - screenOuterW / 2 + screenFrameT / 2, screenY, frameZ, matTrim);
  addBox(screenFrameT, screenOuterH, frameD, screenX + screenOuterW / 2 - screenFrameT / 2, screenY, frameZ, matTrim);

  // Inner bevel strips.
  addBox(screenInnerW + 0.32, 0.18, frameD * 0.8, screenX, screenY + screenInnerH / 2 + 0.13, frameZ - 0.035, matCabinetDark);
  addBox(screenInnerW + 0.32, 0.18, frameD * 0.8, screenX, screenY - screenInnerH / 2 - 0.13, frameZ - 0.035, matCabinetDark);
  addBox(0.18, screenInnerH + 0.30, frameD * 0.8, screenX - screenInnerW / 2 - 0.13, screenY, frameZ - 0.035, matCabinetDark);
  addBox(0.18, screenInnerH + 0.30, frameD * 0.8, screenX + screenInnerW / 2 + 0.13, screenY, frameZ - 0.035, matCabinetDark);

  // Drawn-looking outlines around the window frame.
  addBox(screenOuterW + 0.12, lineT, detailD, screenX, screenY + screenOuterH / 2, detailZ, matInk);
  addBox(screenOuterW + 0.12, lineT, detailD, screenX, screenY - screenOuterH / 2, detailZ, matInk);
  addBox(lineT, screenOuterH + 0.12, detailD, screenX - screenOuterW / 2, screenY, detailZ, matInk);
  addBox(lineT, screenOuterH + 0.12, detailD, screenX + screenOuterW / 2, screenY, detailZ, matInk);

  addBox(screenInnerW + 0.12, lineT, detailD, screenX, screenY + screenInnerH / 2, detailZ - 0.01, matInk);
  addBox(screenInnerW + 0.12, lineT, detailD, screenX, screenY - screenInnerH / 2, detailZ - 0.01, matInk);
  addBox(lineT, screenInnerH + 0.12, detailD, screenX - screenInnerW / 2, screenY, detailZ - 0.01, matInk);
  addBox(lineT, screenInnerH + 0.12, detailD, screenX + screenInnerW / 2, screenY, detailZ - 0.01, matInk);

  // Convex grey screen surface.
  addCurvedScreen(screenX, screenY, frontZ - 0.205, screenInnerW - 0.35, screenInnerH - 0.22, 0.115, matGlass);

  // Curved reflection / contour line on the glass.
  addTube(
    [
      new THREE.Vector3(screenX - 3.35, 0.52, frontZ - 0.39),
      new THREE.Vector3(screenX - 2.15, 0.12, frontZ - 0.46),
      new THREE.Vector3(screenX - 0.55, -0.34, frontZ - 0.48),
      new THREE.Vector3(screenX + 1.05, -0.65, frontZ - 0.44)
    ],
    0.012,
    matReflection
  );

  // Small brand mark at the lower center of the door frame.
  addBox(0.52, 0.055, detailD, screenX, screenY - screenOuterH / 2 + 0.29, detailZ - 0.025, matInk);
  addBox(0.075, 0.045, detailD, screenX - 0.22, screenY - screenOuterH / 2 + 0.29, detailZ - 0.05, matTrim);
  addBox(0.075, 0.045, detailD, screenX - 0.10, screenY - screenOuterH / 2 + 0.29, detailZ - 0.05, matTrim);

  // -------------------- Vertical separator --------------------
  const separatorX = screenX + screenOuterW / 2 + 0.22;

  addBox(0.16, screenOuterH + 0.25, frameD, separatorX, 0, frameZ, matCabinetDark);
  addBox(lineT, screenOuterH + 0.34, detailD, separatorX - 0.105, 0, detailZ, matInk);
  addBox(lineT, screenOuterH + 0.34, detailD, separatorX + 0.105, 0, detailZ, matInk);

  // -------------------- Right control / speaker column --------------------
  const ctrlOuterW = 2.05;
  const ctrlOuterH = 4.75;
  const ctrlX = 5.08;
  const ctrlY = 0;

  addBox(ctrlOuterW, ctrlOuterH, frameD, ctrlX, ctrlY, frameZ, matTrim);

  addBox(ctrlOuterW + 0.10, lineT, detailD, ctrlX, ctrlY + ctrlOuterH / 2, detailZ, matInk);
  addBox(ctrlOuterW + 0.10, lineT, detailD, ctrlX, ctrlY - ctrlOuterH / 2, detailZ, matInk);
  addBox(lineT, ctrlOuterH + 0.10, detailD, ctrlX - ctrlOuterW / 2, ctrlY, detailZ, matInk);
  addBox(lineT, ctrlOuterH + 0.10, detailD, ctrlX + ctrlOuterW / 2, ctrlY, detailZ, matInk);

  // Upper display and small circular buttons.
  addBox(1.62, 0.72, detailD, ctrlX, 1.78, detailZ - 0.02, matDarkGrey);
  addBox(0.92, 0.25, detailD, ctrlX - 0.24, 1.83, detailZ - 0.05, matBlack);

  addFrontDisk(ctrlX + 0.48, 1.88, detailZ - 0.055, 0.052, 0.045, matSteel, 18);
  addFrontDisk(ctrlX + 0.65, 1.88, detailZ - 0.055, 0.052, 0.045, matSteel, 18);
  addFrontDisk(ctrlX + 0.48, 1.70, detailZ - 0.055, 0.045, 0.045, matSteel, 18);
  addFrontDisk(ctrlX + 0.65, 1.70, detailZ - 0.055, 0.045, 0.045, matSteel, 18);

  // Middle grille / speaker slat area.
  const grilleW = 1.48;
  const grilleH = 1.42;
  const grilleY = 0.55;

  addBox(grilleW, grilleH, detailD, ctrlX, grilleY, detailZ - 0.025, matBlack);

  addBox(grilleW + 0.20, 0.07, detailD, ctrlX, grilleY + grilleH / 2 + 0.055, detailZ - 0.035, matInk);
  addBox(grilleW + 0.20, 0.07, detailD, ctrlX, grilleY - grilleH / 2 - 0.055, detailZ - 0.035, matInk);
  addBox(0.07, grilleH + 0.18, detailD, ctrlX - grilleW / 2 - 0.055, grilleY, detailZ - 0.035, matInk);
  addBox(0.07, grilleH + 0.18, detailD, ctrlX + grilleW / 2 + 0.055, grilleY, detailZ - 0.035, matInk);

  for (let i = 0; i < 7; i++) {
    const y = grilleY - grilleH / 2 + 0.18 + i * 0.18;
    const xoff = i % 2 === 0 ? -0.035 : 0.035;
    const angle = i % 2 === 0 ? 0.10 : -0.10;
    addBox(grilleW * 0.78, 0.052, 0.055, ctrlX + xoff, y, detailZ - 0.065, matSteel, 0, 0, angle);
  }

  addBox(0.052, grilleH * 0.78, 0.055, ctrlX - 0.42, grilleY, detailZ - 0.075, matCabinetDark);
  addBox(0.052, grilleH * 0.78, 0.055, ctrlX + 0.42, grilleY, detailZ - 0.075, matCabinetDark);

  // Lower black rectangular panel.
  const lowerPanelW = 1.55;
  const lowerPanelH = 1.95;
  const lowerPanelY = -1.43;

  addBox(lowerPanelW + 0.22, lowerPanelH + 0.22, detailD, ctrlX, lowerPanelY, detailZ - 0.025, matCabinetDark);
  addBox(lowerPanelW, lowerPanelH, detailD, ctrlX, lowerPanelY, detailZ - 0.065, matBlack);

  addBox(lowerPanelW + 0.20, lineT, detailD, ctrlX, lowerPanelY + lowerPanelH / 2 + 0.10, detailZ - 0.09, matInk);
  addBox(lowerPanelW + 0.20, lineT, detailD, ctrlX, lowerPanelY - lowerPanelH / 2 - 0.10, detailZ - 0.09, matInk);
  addBox(lineT, lowerPanelH + 0.20, detailD, ctrlX - lowerPanelW / 2 - 0.10, lowerPanelY, detailZ - 0.09, matInk);
  addBox(lineT, lowerPanelH + 0.20, detailD, ctrlX + lowerPanelW / 2 + 0.10, lowerPanelY, detailZ - 0.09, matInk);

  // Far-right front cabinet edge.
  addBox(0.12, bodyH - 0.30, frameD, rightX - 0.25, 0, frameZ, matCabinetDark);
  addBox(lineT, bodyH - 0.16, detailD, rightX - 0.33, 0, detailZ, matInk);
  addBox(lineT, bodyH - 0.16, detailD, rightX - 0.16, 0, detailZ, matInk);

  // -------------------- Right side panel visible in perspective --------------------
  addBox(0.12, bodyH - 0.65, bodyD - 0.55, rightX + 0.065, -0.05, 0.15, matSide);

  const sideDetailX = rightX + 0.14;

  addBox(0.06, lineT, bodyD - 0.85, sideDetailX, topY - 0.35, 0.25, matInk);
  addBox(0.06, lineT, bodyD - 0.85, sideDetailX, bottomY + 0.35, 0.25, matInk);
  addBox(0.06, bodyH - 1.00, lineT, sideDetailX, -0.05, frontZ + 0.42, matInk);
  addBox(0.06, bodyH - 1.00, lineT, sideDetailX, -0.05, backZ - 0.32, matInk);
  addBox(0.06, bodyH - 0.85, lineT, sideDetailX + 0.02, -0.02, backZ - 0.78, matCabinetDark);

  addBox(0.08, 0.12, 0.78, sideDetailX + 0.02, bottomY + 0.55, backZ - 0.75, matInk);
  addBox(0.08, 0.12, 0.68, sideDetailX + 0.02, bottomY + 0.77, backZ - 0.75, matCabinetDark);

  // Small bottom feet.
  addBox(1.05, 0.18, 0.58, -5.15, bottomY - 0.09, frontZ + 0.55, matDarkGrey);
  addBox(0.95, 0.18, 0.58, 5.25, bottomY - 0.09, frontZ + 0.55, matDarkGrey);

  // -------------------- Antenna hinge and twin rods --------------------
  const hingeBaseX = 2.20;
  const hingeBaseZ = -0.22;
  const baseY = topSurfaceY + 0.085;
  const hingeY = topSurfaceY + 0.235;

  addBox(1.35, 0.17, 0.42, hingeBaseX, baseY, hingeBaseZ, matDarkGrey);
  addBox(1.48, 0.04, 0.50, hingeBaseX, baseY + 0.105, hingeBaseZ, matInk);

  addCylinderBetween(
    new THREE.Vector3(hingeBaseX - 0.58, hingeY, hingeBaseZ),
    new THREE.Vector3(hingeBaseX + 0.58, hingeY, hingeBaseZ),
    0.075,
    matSteel,
    16
  );

  const antennaStartL = new THREE.Vector3(1.92, hingeY + 0.06, hingeBaseZ);
  const antennaStartR = new THREE.Vector3(2.46, hingeY + 0.06, hingeBaseZ);

  const antennaEndL = new THREE.Vector3(-2.35, 11.15, -1.85);
  const antennaEndR = new THREE.Vector3(7.35, 8.85, -1.82);

  addTelescopingAntenna(antennaStartL, antennaEndL);
  addTelescopingAntenna(antennaStartR, antennaEndR);

  // Camera view similar to the reference: front-right, slightly above.
  camera.position.set(14, 9, -13);
  camera.lookAt(0, 1.6, 0);
})();