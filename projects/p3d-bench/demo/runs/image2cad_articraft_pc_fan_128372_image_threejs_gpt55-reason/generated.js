// Parameters: estimated from a square 120 mm axial computer fan.
// Coordinate convention: X/Y are the face of the fan, Z is the fan thickness.
const PI2 = Math.PI * 2;

const frameSize = 120;
const frameHalf = frameSize / 2;
const totalHeight = 34;
const plateThickness = 4.5;
const gapHeight = totalHeight - plateThickness * 2;

const topPlateCenterZ = totalHeight / 2 - plateThickness / 2;
const bottomPlateCenterZ = -topPlateCenterZ;
const topSurfaceZ = totalHeight / 2;
const lowerPlateUpperZ = bottomPlateCenterZ + plateThickness / 2;

const cornerRadius = 9;
const centralOpeningRadius = 46.5;
const shroudInnerRadius = centralOpeningRadius;
const shroudOuterRadius = 52;

const screwOffset = frameHalf - cornerRadius;
const screwHoleRadius = 4.5;
const screwBossOuterRadius = 7.5;
const screwRimOuterRadius = 8.7;

const bladeCount = 9;
const hubRadius = 18.5;
const hubHeight = 16;
const hubCenterZ = 2.1;
const bladeInnerRadius = 16.8;
const bladeOuterRadius = 44.2;

// Materials
const bodyMat = new THREE.MeshStandardMaterial({
  color: 0xb8b9bc,
  roughness: 0.5,
  metalness: 0.03,
  side: THREE.DoubleSide
});

const bladeMat = new THREE.MeshStandardMaterial({
  color: 0xc8c9cb,
  roughness: 0.42,
  metalness: 0.03,
  side: THREE.DoubleSide
});

const hubMat = new THREE.MeshStandardMaterial({
  color: 0xa8a9ac,
  roughness: 0.55,
  metalness: 0.03,
  side: THREE.DoubleSide
});

const grooveMat = new THREE.MeshStandardMaterial({
  color: 0x202124,
  roughness: 0.75,
  metalness: 0,
  side: THREE.DoubleSide
});

// ---------- Helper geometry functions ----------

function addRoundedRectCommands(path, width, height, radius, clockwise) {
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = Math.min(radius, width / 2, height / 2);

  if (clockwise) {
    path.moveTo(x + r, y);
    path.quadraticCurveTo(x, y, x, y + r);
    path.lineTo(x, y + h - r);
    path.quadraticCurveTo(x, y + h, x + r, y + h);
    path.lineTo(x + w - r, y + h);
    path.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    path.lineTo(x + w, y + r);
    path.quadraticCurveTo(x + w, y, x + w - r, y);
    path.lineTo(x + r, y);
  } else {
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.quadraticCurveTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r);
    path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h);
    path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
  }

  path.closePath();
}

function makeRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  addRoundedRectCommands(shape, width, height, radius, false);
  return shape;
}

function makeRoundedRectPath(width, height, radius, clockwise) {
  const path = new THREE.Path();
  addRoundedRectCommands(path, width, height, radius, clockwise);
  return path;
}

function makeCirclePath(cx, cy, radius, clockwise) {
  const path = new THREE.Path();
  path.moveTo(cx + radius, cy);
  path.absarc(cx, cy, radius, 0, PI2, clockwise);
  path.closePath();
  return path;
}

function makeAnnularShape(outerRadius, innerRadius) {
  const shape = new THREE.Shape();
  shape.moveTo(outerRadius, 0);
  shape.absarc(0, 0, outerRadius, 0, PI2, false);
  shape.closePath();
  shape.holes.push(makeCirclePath(0, 0, innerRadius, true));
  return shape;
}

function addExtrudedShape(shape, depth, zCenter, material, options = {}) {
  const settings = Object.assign({
    depth: depth,
    steps: 1,
    bevelEnabled: false,
    curveSegments: 40
  }, options);

  settings.depth = depth;

  const geometry = new THREE.ExtrudeGeometry(shape, settings);
  geometry.translate(0, 0, zCenter - depth / 2);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function addAnnularExtrusion(outerRadius, innerRadius, depth, zCenter, material, options = {}, x = 0, y = 0) {
  const mesh = addExtrudedShape(
    makeAnnularShape(outerRadius, innerRadius),
    depth,
    zCenter,
    material,
    options
  );
  mesh.position.set(x, y, 0);
  return mesh;
}

function addRoundedRectRing(width, height, radius, ringWidth, depth, zCenter, material, options = {}) {
  const shape = makeRoundedRectShape(width, height, radius);
  shape.holes.push(
    makeRoundedRectPath(
      width - ringWidth * 2,
      height - ringWidth * 2,
      Math.max(0, radius - ringWidth),
      true
    )
  );
  return addExtrudedShape(shape, depth, zCenter, material, options);
}

function addBox(sizeX, sizeY, sizeZ, x, y, z, rotationZ, material) {
  const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rotationZ || 0;
  scene.add(mesh);
  return mesh;
}

function addBarBetween(x1, y1, x2, y2, width, height, zCenter, material) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  return addBox(length, width, height, (x1 + x2) / 2, (y1 + y2) / 2, zCenter, angle, material);
}

function addCylinderZ(radiusTop, radiusBottom, height, radialSegments, material, x, y, z) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, 1, false);
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x || 0, y || 0, z || 0);
  scene.add(mesh);
  return mesh;
}

function addTorusZ(majorRadius, tubeRadius, x, y, z, material) {
  const geometry = new THREE.TorusGeometry(majorRadius, tubeRadius, 12, 96);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x || 0, y || 0, z || 0);
  scene.add(mesh);
  return mesh;
}

// ---------- Frame plates with central air opening and four screw holes ----------

function makeFramePlateShape() {
  const shape = makeRoundedRectShape(frameSize, frameSize, cornerRadius);

  // Large circular fan aperture.
  shape.holes.push(makeCirclePath(0, 0, centralOpeningRadius, true));

  // Four corner mounting holes.
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      shape.holes.push(makeCirclePath(sx * screwOffset, sy * screwOffset, screwHoleRadius, true));
    }
  }

  return shape;
}

const plateOptions = {
  bevelEnabled: true,
  bevelSize: 0.55,
  bevelThickness: 0.55,
  bevelSegments: 2,
  curveSegments: 48
};

addExtrudedShape(makeFramePlateShape(), plateThickness, topPlateCenterZ, bodyMat, plateOptions);
addExtrudedShape(makeFramePlateShape(), plateThickness, bottomPlateCenterZ, bodyMat, plateOptions);

// ---------- Inner shroud, screw bosses, and side supports ----------

// Cylindrical air-guide wall visible between the top and lower flanges.
addAnnularExtrusion(shroudOuterRadius, shroudInnerRadius, gapHeight, 0, bodyMat, {
  curveSegments: 72
});

// Four vertical screw tubes connecting the two frame flanges.
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    addAnnularExtrusion(
      screwBossOuterRadius,
      screwHoleRadius,
      gapHeight,
      0,
      bodyMat,
      { curveSegments: 36 },
      sx * screwOffset,
      sy * screwOffset
    );
  }
}

// Straight side walls between the two flanges.
const sideWallThickness = 5;
const sideWallLength = 66;
const sideWallOffset = frameHalf - sideWallThickness / 2;

addBox(sideWallLength, sideWallThickness, gapHeight, 0, sideWallOffset, 0, 0, bodyMat);
addBox(sideWallLength, sideWallThickness, gapHeight, 0, -sideWallOffset, 0, 0, bodyMat);
addBox(sideWallThickness, sideWallLength, gapHeight, sideWallOffset, 0, 0, 0, bodyMat);
addBox(sideWallThickness, sideWallLength, gapHeight, -sideWallOffset, 0, 0, 0, bodyMat);

// Diagonal corner webs from the circular shroud toward the screw bosses.
const diagStart = (shroudOuterRadius + 1.2) / Math.sqrt(2);
const diagEnd = frameHalf - 13.5;
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    addBarBetween(
      sx * diagStart,
      sy * diagStart,
      sx * diagEnd,
      sy * diagEnd,
      4.8,
      gapHeight,
      0,
      bodyMat
    );
  }
}

// ---------- Raised lips and decorative triangular corner insets ----------

const raisedDetailHeight = 0.65;
const rimOptions = {
  bevelEnabled: true,
  bevelSize: 0.12,
  bevelThickness: 0.12,
  bevelSegments: 1,
  curveSegments: 40
};

function addSurfaceDetails(zFace) {
  const zDetail = zFace + raisedDetailHeight / 2;

  // Raised outside border around each square flange.
  addRoundedRectRing(
    frameSize - 1.4,
    frameSize - 1.4,
    cornerRadius - 0.5,
    2.4,
    raisedDetailHeight,
    zDetail,
    bodyMat,
    rimOptions
  );

  // Raised circular lip around the main fan aperture.
  addAnnularExtrusion(
    centralOpeningRadius + 2.8,
    centralOpeningRadius + 0.15,
    raisedDetailHeight,
    zDetail,
    bodyMat,
    rimOptions
  );

  // Raised screw-hole bosses on the visible flange faces.
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      addAnnularExtrusion(
        screwRimOuterRadius,
        screwHoleRadius + 0.3,
        raisedDetailHeight,
        zDetail,
        bodyMat,
        rimOptions,
        sx * screwOffset,
        sy * screwOffset
      );
    }
  }

  // Dark triangular inset lines at each corner, matching the CAD-like grooves in the reference.
  const lineHeight = 0.22;
  const lineWidth = 1.05;
  const zLine = zFace + lineHeight / 2 + 0.04;

  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const ax = sx * (frameHalf - 7.5);
      const ay = sy * (frameHalf - 25);
      const bx = sx * (frameHalf - 25);
      const by = sy * (frameHalf - 7.5);
      const cx = sx * 38;
      const cy = sy * 38;

      addBarBetween(ax, ay, cx, cy, lineWidth, lineHeight, zLine, grooveMat);
      addBarBetween(cx, cy, bx, by, lineWidth, lineHeight, zLine, grooveMat);
      addBarBetween(bx, by, ax, ay, lineWidth, lineHeight, zLine, grooveMat);
    }
  }
}

addSurfaceDetails(topSurfaceZ);
addSurfaceDetails(lowerPlateUpperZ);

// ---------- Curved fan blades ----------

function createBladeGeometry(innerR, outerR, sweepAngle, halfWidthInner, halfWidthOuter, thickness, radialSegments, widthSegments, zBase, pitch, arch) {
  const vertices = [];
  const indices = [];
  const row = widthSegments + 1;
  const layerVertCount = (radialSegments + 1) * row;

  function pushVertex(i, j, layerSign) {
    const t = i / radialSegments;
    const s = j / widthSegments;
    const u = s * 2 - 1;

    const r = innerR + (outerR - innerR) * t;
    const centerTheta = sweepAngle * (0.18 * t + 0.82 * t * t) - 0.07 * Math.sin(Math.PI * t);
    const halfWidth = halfWidthInner * (1 - t) + halfWidthOuter * t;
    const theta = centerTheta + u * halfWidth;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    // Pitch and camber make each blade look like a swept, twisted impeller vane.
    const pitchTerm = pitch * u * (0.58 - 0.18 * t);
    const radialDrop = -1.1 * t;
    const camber = arch * Math.sin(Math.PI * t) * (1 - 0.25 * Math.abs(u));
    const z = zBase + pitchTerm + radialDrop + camber + layerSign * thickness / 2;

    vertices.push(x, y, z);
  }

  // Top and bottom blade skins.
  for (const sign of [1, -1]) {
    for (let i = 0; i <= radialSegments; i++) {
      for (let j = 0; j <= widthSegments; j++) {
        pushVertex(i, j, sign);
      }
    }
  }

  // Top surface.
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * row + j;
      const b = (i + 1) * row + j;
      const c = i * row + j + 1;
      const d = (i + 1) * row + j + 1;
      indices.push(a, b, c, c, b, d);
    }
  }

  // Bottom surface, reversed.
  const bottom = layerVertCount;
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = bottom + i * row + j;
      const b = bottom + (i + 1) * row + j;
      const c = bottom + i * row + j + 1;
      const d = bottom + (i + 1) * row + j + 1;
      indices.push(a, c, b, c, d, b);
    }
  }

  // Leading and trailing side faces.
  for (let i = 0; i < radialSegments; i++) {
    let a = i * row;
    let b = (i + 1) * row;
    let a2 = bottom + i * row;
    let b2 = bottom + (i + 1) * row;
    indices.push(a, a2, b, b, a2, b2);

    a = i * row + widthSegments;
    b = (i + 1) * row + widthSegments;
    a2 = bottom + i * row + widthSegments;
    b2 = bottom + (i + 1) * row + widthSegments;
    indices.push(a, b, a2, b, b2, a2);
  }

  // Inner and outer end faces.
  for (let j = 0; j < widthSegments; j++) {
    let a = j;
    let b = j + 1;
    let a2 = bottom + j;
    let b2 = bottom + j + 1;
    indices.push(a, b, a2, b, b2, a2);

    const outerOffset = radialSegments * row;
    a = outerOffset + j;
    b = outerOffset + j + 1;
    a2 = bottom + outerOffset + j;
    b2 = bottom + outerOffset + j + 1;
    indices.push(a, a2, b, b, a2, b2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const bladeGeometry = createBladeGeometry(
  bladeInnerRadius,
  bladeOuterRadius,
  0.62,
  0.20,
  0.31,
  1.6,
  18,
  5,
  4.2,
  5.2,
  1.15
);

for (let i = 0; i < bladeCount; i++) {
  const blade = new THREE.Mesh(bladeGeometry, bladeMat);
  blade.rotation.z = i * PI2 / bladeCount - 0.18;
  scene.add(blade);
}

// ---------- Central rotor hub ----------

addCylinderZ(hubRadius, hubRadius, hubHeight, 96, hubMat, 0, 0, hubCenterZ);
addTorusZ(hubRadius - 0.25, 0.45, 0, 0, hubCenterZ + hubHeight / 2, hubMat);
addTorusZ(hubRadius - 0.25, 0.45, 0, 0, hubCenterZ - hubHeight / 2, hubMat);

// Smaller underside motor collar visible through the lower opening.
addCylinderZ(hubRadius * 0.72, hubRadius * 0.72, 5.2, 72, hubMat, 0, 0, hubCenterZ - hubHeight / 2 - 2.6);

// Camera framing
camera.position.set(112, -132, 82);
camera.lookAt(0, 0, 0);