// Parameters: perforated faceted cylindrical basket/drum with open scalloped front and smooth rounded rear cap
const TWO_PI = Math.PI * 2;
const panelCount = 12;
const outerRadius = 3.0;
const bodyLength = 10.4;
const frontX = -5.45;
const backX = frontX + bodyLength;
const bodyCenterX = (frontX + backX) * 0.5;
const pitch = TWO_PI / panelCount;
const panelChord = 2 * outerRadius * Math.sin(pitch * 0.5);
const panelApothem = outerRadius * Math.cos(pitch * 0.5);
const panelWidth = panelChord * 0.94;
const panelThickness = 0.065;
const domeBaseX = backX + 0.42;
const domeDepth = 1.65;

// Materials
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xb8bcc0,
  metalness: 0.28,
  roughness: 0.38,
  side: THREE.DoubleSide
});

const ribMaterial = new THREE.MeshStandardMaterial({
  color: 0x969ca1,
  metalness: 0.35,
  roughness: 0.34,
  side: THREE.DoubleSide
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: 0x202326,
  metalness: 0.08,
  roughness: 0.75,
  side: THREE.DoubleSide
});

// Helper: rounded slot/capsule hole in a flat panel shape
function addCapsuleHole(shape, cx, cy, length, width, angle, segments) {
  const r = width * 0.5;
  const straight = Math.max(0.001, length * 0.5 - r);
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const pts = [];
  const segs = segments || 6;

  // Clockwise outline: right rounded end, bottom edge, left rounded end, top edge.
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI * 0.5 - (i / segs) * Math.PI;
    const lx = straight + r * Math.cos(a);
    const ly = r * Math.sin(a);
    pts.push({
      x: cx + lx * cosA - ly * sinA,
      y: cy + lx * sinA + ly * cosA
    });
  }

  for (let i = 0; i <= segs; i++) {
    const a = -Math.PI * 0.5 - (i / segs) * Math.PI;
    const lx = -straight + r * Math.cos(a);
    const ly = r * Math.sin(a);
    pts.push({
      x: cx + lx * cosA - ly * sinA,
      y: cy + lx * sinA + ly * cosA
    });
  }

  const path = new THREE.Path();
  path.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    path.lineTo(pts[i].x, pts[i].y);
  }
  path.lineTo(pts[0].x, pts[0].y);
  shape.holes.push(path);
}

// Helper: circular punched hole
function addCircularHole(shape, cx, cy, radius) {
  const path = new THREE.Path();
  path.absellipse(cx, cy, radius, radius, 0, TWO_PI, true, 0);
  shape.holes.push(path);
}

// Create one perforated flat facet of the drum; the facets form a dodecagonal cylinder.
function createPerforatedPanelGeometry(panelIndex) {
  const halfL = bodyLength * 0.5;
  const halfW = panelWidth * 0.5;

  const shape = new THREE.Shape();
  shape.moveTo(-halfL, -halfW);
  shape.lineTo(halfL, -halfW);
  shape.lineTo(halfL, halfW);
  shape.lineTo(-halfL, halfW);
  shape.lineTo(-halfL, -halfW);

  const sign = panelIndex % 2 === 0 ? 1 : -1;
  const vRows = [-0.48, -0.24, 0.0, 0.24, 0.48];

  // Front bank of long narrow slots, matching the repeated rectangular perforations.
  for (let c = 0; c < 3; c++) {
    const u = -4.48 + c * 0.42;
    for (let r = 0; r < vRows.length; r++) {
      addCapsuleHole(shape, u, vRows[r], 0.32, 0.072, 0, 5);
    }
  }

  // Rear bank of parallel slots.
  for (let c = 0; c < 4; c++) {
    const u = 2.02 + c * 0.42;
    for (let r = 0; r < vRows.length; r++) {
      addCapsuleHole(shape, u, vRows[r], 0.34, 0.072, 0, 5);
    }
  }

  // Row of round holes running through the center of each panel.
  for (let k = 0; k < 9; k++) {
    const u = -2.76 + k * 0.48;
    addCircularHole(shape, u, -0.34 * sign, 0.118);
  }

  // Diagonal slash perforations on the opposite side of the panel.
  for (let k = 0; k < 9; k++) {
    const u = -2.86 + k * 0.53;
    const v = sign * (0.29 + (k % 2) * 0.065);
    addCapsuleHole(shape, u, v, 0.42, 0.065, sign * 0.95, 5);
  }

  // A few shorter dash perforations to break up the central field.
  for (let k = 0; k < 5; k++) {
    const u = -1.9 + k * 0.68;
    addCapsuleHole(shape, u, 0.02 * sign, 0.24, 0.055, 0, 4);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: panelThickness,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 8
  });

  geometry.translate(0, 0, -panelThickness * 0.5);
  geometry.computeVertexNormals();
  return geometry;
}

// Helper: orient local panel/rib coordinates so local X is drum length, local Y tangent, local Z radial.
function orientMeshOnDrum(mesh, theta, radius, xOffset) {
  const radial = new THREE.Vector3(0, Math.cos(theta), Math.sin(theta));
  const tangent = new THREE.Vector3(0, -Math.sin(theta), Math.cos(theta));
  const axis = new THREE.Vector3(1, 0, 0);

  const basis = new THREE.Matrix4();
  basis.makeBasis(axis, tangent, radial);
  mesh.quaternion.setFromRotationMatrix(basis);
  mesh.position.set(xOffset, radial.y * radius, radial.z * radius);
}

// Helper: simple open cylinder surface along X axis.
function createCylinderSurfaceGeometry(x0, x1, radius, radialSegments, xSegments) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= xSegments; i++) {
    const x = x0 + (x1 - x0) * (i / xSegments);
    for (let j = 0; j <= radialSegments; j++) {
      const theta = TWO_PI * (j / radialSegments);
      const cy = Math.cos(theta);
      const sz = Math.sin(theta);

      positions.push(x, radius * cy, radius * sz);
      normals.push(0, cy, sz);
      uvs.push(j / radialSegments, i / xSegments);
    }
  }

  const row = radialSegments + 1;
  for (let i = 0; i < xSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * row + j;
      const b = a + 1;
      const c = (i + 1) * row + j;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

// Helper: ellipsoid dome closing the rear end.
function createEllipsoidDomeGeometry(baseX, radius, depth, radialSegments, ringCount) {
  const positions = [];
  const indices = [];

  for (let i = 0; i < ringCount; i++) {
    const t = i / ringCount;
    const phi = t * Math.PI * 0.5;
    const x = baseX + depth * Math.sin(phi);
    const rr = radius * Math.cos(phi);

    for (let j = 0; j <= radialSegments; j++) {
      const theta = TWO_PI * (j / radialSegments);
      positions.push(x, rr * Math.cos(theta), rr * Math.sin(theta));
    }
  }

  const poleIndex = positions.length / 3;
  positions.push(baseX + depth, 0, 0);

  const row = radialSegments + 1;
  for (let i = 0; i < ringCount - 1; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * row + j;
      const b = a + 1;
      const c = (i + 1) * row + j;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const last = (ringCount - 1) * row;
  for (let j = 0; j < radialSegments; j++) {
    indices.push(last + j, poleIndex, last + j + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Helper: scalloped/lobed front rim, interpreted from the petal-like open edge in the image.
function createLobedRimGeometry(xCenter, depth, baseRadius, radialWidth, lobeAmplitude, lobes, segments) {
  const positions = [];
  const indices = [];
  const xFront = xCenter - depth * 0.5;
  const xBack = xCenter + depth * 0.5;

  for (let j = 0; j < segments; j++) {
    const theta = TWO_PI * (j / segments);
    const lobe = lobeAmplitude * Math.cos(lobes * (theta - pitch * 0.5));
    const centerR = baseRadius + lobe;
    const rOuter = centerR + radialWidth * 0.5;
    const rInner = centerR - radialWidth * 0.5;
    const cy = Math.cos(theta);
    const sz = Math.sin(theta);

    positions.push(xFront, rOuter * cy, rOuter * sz);
    positions.push(xFront, rInner * cy, rInner * sz);
    positions.push(xBack, rOuter * cy, rOuter * sz);
    positions.push(xBack, rInner * cy, rInner * sz);
  }

  function idx(j, loop) {
    return ((j + segments) % segments) * 4 + loop;
  }

  for (let j = 0; j < segments; j++) {
    const n = (j + 1) % segments;

    // Front annular face
    indices.push(idx(j, 0), idx(n, 0), idx(n, 1));
    indices.push(idx(j, 0), idx(n, 1), idx(j, 1));

    // Back annular face
    indices.push(idx(j, 2), idx(n, 3), idx(n, 2));
    indices.push(idx(j, 2), idx(j, 3), idx(n, 3));

    // Outer wall
    indices.push(idx(j, 0), idx(j, 2), idx(n, 0));
    indices.push(idx(n, 0), idx(j, 2), idx(n, 2));

    // Inner wall
    indices.push(idx(j, 1), idx(n, 1), idx(j, 3));
    indices.push(idx(n, 1), idx(n, 3), idx(j, 3));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Helper: torus ring aligned around X axis.
function addTorusX(x, radius, tube, material, radialSegments, tubularSegments) {
  const geometry = new THREE.TorusGeometry(radius, tube, radialSegments || 10, tubularSegments || 128);
  geometry.rotateY(Math.PI * 0.5);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  scene.add(mesh);
  return mesh;
}

// Helper: raised rectangular strip on drum surface.
// angle = 0 runs along X, angle = PI/2 runs circumferentially.
function addSurfaceBox(surfaceRadius, x, theta, length, width, thickness, angle, material) {
  const geometry = new THREE.BoxGeometry(length, width, thickness);
  const mesh = new THREE.Mesh(geometry, material);

  const radial = new THREE.Vector3(0, Math.cos(theta), Math.sin(theta));
  const tangent = new THREE.Vector3(0, -Math.sin(theta), Math.cos(theta));
  const c = Math.cos(angle || 0);
  const s = Math.sin(angle || 0);

  const xVec = new THREE.Vector3(c, tangent.y * s, tangent.z * s).normalize();
  const yVec = new THREE.Vector3(-s, tangent.y * c, tangent.z * c).normalize();

  const basis = new THREE.Matrix4();
  basis.makeBasis(xVec, yVec, radial);
  mesh.quaternion.setFromRotationMatrix(basis);

  const rr = surfaceRadius + thickness * 0.5;
  mesh.position.set(x, radial.y * rr, radial.z * rr);
  scene.add(mesh);
  return mesh;
}

// Helper: faceted circumferential reinforcing band made from short straight strips.
function addFacetedCircumferentialBand(x, axialWidth, tangentialScale, thickness, material) {
  for (let i = 0; i < panelCount; i++) {
    const theta = i * pitch + pitch * 0.5;
    addSurfaceBox(
      panelApothem + panelThickness * 0.5,
      x,
      theta,
      panelWidth * tangentialScale,
      axialWidth,
      thickness,
      Math.PI * 0.5,
      material
    );
  }
}

// Helper: segmented helical/diagonal raised rib.
function addHelicalRib(surfaceRadius, x0, x1, theta0, theta1, width, thickness, material, segmentCount) {
  for (let i = 0; i < segmentCount; i++) {
    const a = i / segmentCount;
    const b = (i + 1) / segmentCount;

    const xa = x0 + (x1 - x0) * a;
    const xb = x0 + (x1 - x0) * b;
    const ta = theta0 + (theta1 - theta0) * a;
    const tb = theta0 + (theta1 - theta0) * b;

    const dx = xb - xa;
    const dTheta = tb - ta;
    const length = Math.sqrt(dx * dx + Math.pow(surfaceRadius * dTheta, 2));
    const angle = Math.atan2(surfaceRadius * dTheta, dx);

    addSurfaceBox(surfaceRadius, (xa + xb) * 0.5, (ta + tb) * 0.5, length, width, thickness, angle, material);
  }
}

// Dark inner liner/shadow surface so punched holes read as dark openings.
const linerGeometry = createCylinderSurfaceGeometry(frontX + 0.35, backX - 0.70, panelApothem - 0.14, 96, 1);
const liner = new THREE.Mesh(linerGeometry, darkMaterial);
scene.add(liner);

// Perforated faceted drum shell
for (let i = 0; i < panelCount; i++) {
  const theta = i * pitch + pitch * 0.5;
  const panelGeometry = createPerforatedPanelGeometry(i);
  const panelMesh = new THREE.Mesh(panelGeometry, metalMaterial);
  orientMeshOnDrum(panelMesh, theta, panelApothem, bodyCenterX);
  scene.add(panelMesh);
}

// Long seams at each facet boundary.
for (let i = 0; i < panelCount; i++) {
  const theta = i * pitch;
  addSurfaceBox(
    outerRadius + panelThickness * 0.5,
    bodyCenterX,
    theta,
    bodyLength - 0.65,
    0.085,
    0.13,
    0,
    ribMaterial
  );
}

// A few broader longitudinal stiffening strips.
for (let i = 0; i < panelCount; i += 3) {
  const theta = i * pitch + pitch * 0.5;
  addSurfaceBox(
    panelApothem + panelThickness * 0.5,
    bodyCenterX + 0.15,
    theta,
    bodyLength - 1.15,
    0.17,
    0.13,
    0,
    ribMaterial
  );
}

// Circumferential reinforcement bands visible around the body.
addFacetedCircumferentialBand(frontX + 0.42, 0.17, 0.92, 0.105, ribMaterial);
addFacetedCircumferentialBand(bodyCenterX + 0.20, 0.11, 0.90, 0.085, ribMaterial);
addFacetedCircumferentialBand(backX - 0.58, 0.22, 0.94, 0.12, ribMaterial);

// Diagonal/helical raised seams that create the overlapping triangular panel feel.
for (let i = 0; i < panelCount; i += 4) {
  addHelicalRib(
    panelApothem + panelThickness * 0.5,
    frontX + 0.72,
    bodyCenterX + 1.10,
    i * pitch + 0.10,
    i * pitch + pitch * 1.45,
    0.12,
    0.12,
    ribMaterial,
    7
  );

  addHelicalRib(
    panelApothem + panelThickness * 0.5,
    bodyCenterX - 0.75,
    backX - 0.82,
    i * pitch + pitch * 1.45,
    i * pitch + pitch * 2.05,
    0.105,
    0.115,
    ribMaterial,
    6
  );
}

for (let i = 2; i < panelCount; i += 4) {
  addHelicalRib(
    panelApothem + panelThickness * 0.5,
    frontX + 0.38,
    frontX + 3.25,
    i * pitch + pitch * 0.72,
    i * pitch - pitch * 0.20,
    0.10,
    0.115,
    ribMaterial,
    5
  );
}

// Scalloped open front rim.
const frontRimGeometry = createLobedRimGeometry(
  frontX - 0.03,
  0.28,
  outerRadius + 0.02,
  0.30,
  0.065,
  panelCount,
  panelCount * 14
);
const frontRim = new THREE.Mesh(frontRimGeometry, ribMaterial);
scene.add(frontRim);

// Thin front lip rings and small locking tabs around the open end.
addTorusX(frontX + 0.08, outerRadius + 0.005, 0.040, ribMaterial, 10, 144);
addTorusX(frontX - 0.10, outerRadius - 0.15, 0.026, ribMaterial, 8, 128);

for (let i = 0; i < panelCount; i++) {
  const theta = i * pitch;
  addSurfaceBox(outerRadius + 0.045, frontX - 0.10, theta, 0.20, 0.24, 0.13, 0, ribMaterial);
}

// Rear collar before the smooth rounded cap.
const rearCollarGeometry = createCylinderSurfaceGeometry(backX - 0.50, domeBaseX, outerRadius + 0.018, 128, 1);
const rearCollar = new THREE.Mesh(rearCollarGeometry, ribMaterial);
scene.add(rearCollar);

addTorusX(backX - 0.43, outerRadius + 0.018, 0.040, ribMaterial, 10, 144);
addTorusX(backX + 0.03, outerRadius + 0.018, 0.036, ribMaterial, 10, 144);
addTorusX(domeBaseX, outerRadius + 0.010, 0.050, ribMaterial, 12, 144);

// Smooth rounded rear cap.
const domeGeometry = createEllipsoidDomeGeometry(domeBaseX, outerRadius, domeDepth, 128, 14);
const dome = new THREE.Mesh(domeGeometry, metalMaterial);
scene.add(dome);

// Subtle rear cap groove rings.
function domeRadiusAt(offset) {
  const t = Math.max(-0.98, Math.min(0.98, offset / domeDepth));
  return outerRadius * Math.sqrt(1 - t * t);
}

addTorusX(domeBaseX + 0.30, domeRadiusAt(0.30) + 0.006, 0.022, ribMaterial, 8, 128);
addTorusX(domeBaseX + 0.58, domeRadiusAt(0.58) + 0.004, 0.018, ribMaterial, 8, 128);

// Camera view similar to the reference: open front on the left, rounded cap receding to the right.
camera.position.set(-9.5, -9.0, 6.0);
camera.lookAt(0.4, 0, 0);