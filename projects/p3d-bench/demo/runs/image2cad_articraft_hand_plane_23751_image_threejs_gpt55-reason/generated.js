// Parameters: approximate a Stanley-style router plane with a low cast base,
// two bulb handles, central depth-adjuster assembly, front arch, cutter, side thumb screw, labels and holes.
const baseThickness = 2.4;
const baseTop = baseThickness;
const handleLeft = { x: -31, z: 9 };
const handleRight = { x: 31, z: -10 };

// Materials
const matCast = new THREE.MeshStandardMaterial({ color: 0xb9bdc3, metalness: 0.35, roughness: 0.34 });
const matCastLight = new THREE.MeshStandardMaterial({ color: 0xd5d7da, metalness: 0.35, roughness: 0.28 });
const matCastDark = new THREE.MeshStandardMaterial({ color: 0x8d9299, metalness: 0.35, roughness: 0.42 });
const matPanel = new THREE.MeshStandardMaterial({ color: 0xaeb3ba, metalness: 0.30, roughness: 0.45 });
const matSteel = new THREE.MeshStandardMaterial({ color: 0xd9dce0, metalness: 0.55, roughness: 0.22 });
const matBlade = new THREE.MeshStandardMaterial({ color: 0x777d84, metalness: 0.60, roughness: 0.25 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x111316, metalness: 0.15, roughness: 0.55 });

// ---------- Helpers ----------
function addMesh(geometry, material, position, rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  if (position) mesh.position.set(position[0], position[1], position[2]);
  if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  scene.add(mesh);
  return mesh;
}

function addBox(w, h, d, x, y, z, mat, rx = 0, ry = 0, rz = 0) {
  return addMesh(new THREE.BoxGeometry(w, h, d), mat, [x, y, z], [rx, ry, rz]);
}

function cylinderY(rTop, rBottom, h, x, y, z, mat, seg = 48) {
  return addMesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg), mat, [x, y, z]);
}

function cylY(r, h, x, y, z, mat, seg = 48) {
  return cylinderY(r, r, h, x, y, z, mat, seg);
}

function cylX(r, length, x, y, z, mat, seg = 32) {
  const mesh = cylY(r, length, x, y, z, mat, seg);
  mesh.rotation.z = Math.PI / 2;
  return mesh;
}

function cylZ(r, length, x, y, z, mat, seg = 32) {
  const mesh = cylY(r, length, x, y, z, mat, seg);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function torusY(radius, tube, x, y, z, mat, radial = 10, tubular = 72) {
  const mesh = addMesh(new THREE.TorusGeometry(radius, tube, radial, tubular), mat, [x, y, z]);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function torusX(radius, tube, x, y, z, mat, radial = 8, tubular = 48) {
  const mesh = addMesh(new THREE.TorusGeometry(radius, tube, radial, tubular), mat, [x, y, z]);
  mesh.rotation.y = Math.PI / 2;
  return mesh;
}

function torusZ(radius, tube, x, y, z, mat, radial = 8, tubular = 48) {
  return addMesh(new THREE.TorusGeometry(radius, tube, radial, tubular), mat, [x, y, z]);
}

function addCylinderBetween(p1, p2, radius, mat, seg = 18) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  if (len <= 0.001) return null;
  const mesh = addMesh(new THREE.CylinderGeometry(radius, radius, len, seg), mat);
  mesh.position.copy(a.add(b).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

function addBoxBetween(p1, p2, w, d, mat) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  if (len <= 0.001) return null;
  const mesh = addMesh(new THREE.BoxGeometry(w, len, d), mat);
  mesh.position.copy(a.add(b).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

// XZ shape helpers: horizontal shapes are drawn in XZ and extruded upward in Y.
function moveXZ(path, x, z) { path.moveTo(x, -z); }
function lineXZ(path, x, z) { path.lineTo(x, -z); }
function quadXZ(path, cx, cz, x, z) { path.quadraticCurveTo(cx, -cz, x, -z); }
function bezierXZ(path, c1x, c1z, c2x, c2z, x, z) {
  path.bezierCurveTo(c1x, -c1z, c2x, -c2z, x, -z);
}

function extrudeXZ(shape, depth, mat, yOffset = 0, bevelSize = 0.12, bevelThickness = 0.06, bevelSegments = 2) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevelSize > 0,
    bevelSize,
    bevelThickness,
    bevelSegments,
    curveSegments: 18
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return addMesh(geometry, mat, [0, yOffset, 0]);
}

function roundedRectPathXZ(cx, cz, w, d, r) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const rr = Math.min(r, w / 2, d / 2);
  const path = new THREE.Path();
  moveXZ(path, x0 + rr, z0);
  lineXZ(path, x1 - rr, z0);
  quadXZ(path, x1, z0, x1, z0 + rr);
  lineXZ(path, x1, z1 - rr);
  quadXZ(path, x1, z1, x1 - rr, z1);
  lineXZ(path, x0 + rr, z1);
  quadXZ(path, x0, z1, x0, z1 - rr);
  lineXZ(path, x0, z0 + rr);
  quadXZ(path, x0, z0, x0 + rr, z0);
  path.closePath();
  return path;
}

function roundedRectShapeXZ(cx, cz, w, d, r) {
  return new THREE.Shape(roundedRectPathXZ(cx, cz, w, d, r).getPoints(20));
}

function roundedRectPointsXZ(cx, cz, w, d, r, seg = 8, y = 0) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const rr = Math.min(r, w / 2, d / 2);
  const pts = [];
  function arc(acx, acz, a0, a1) {
    for (let i = 0; i <= seg; i++) {
      const t = i / seg;
      const a = a0 + (a1 - a0) * t;
      pts.push([acx + rr * Math.cos(a), y, acz + rr * Math.sin(a)]);
    }
  }
  arc(x1 - rr, z0 + rr, -Math.PI / 2, 0);
  arc(x1 - rr, z1 - rr, 0, Math.PI / 2);
  arc(x0 + rr, z1 - rr, Math.PI / 2, Math.PI);
  arc(x0 + rr, z0 + rr, Math.PI, Math.PI * 1.5);
  return pts;
}

function addTube(points, radius, mat, closed = false, tubularSegments = 96) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(p[0], p[1], p[2])),
    closed,
    "catmullrom",
    0.45
  );
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, 10, closed);
  geometry.computeVertexNormals();
  return addMesh(geometry, mat);
}

// ---------- Main cast base ----------
const baseShape = new THREE.Shape();
// Irregular cast outline: long S-like router-plane sole with rounded handle lobes and scalloped sides.
moveXZ(baseShape, -43, -4);
quadXZ(baseShape, -44, 3, -40, 9);
quadXZ(baseShape, -38, 15, -32, 18);
quadXZ(baseShape, -25, 21, -19, 14);
lineXZ(baseShape, -12, 13);
quadXZ(baseShape, -8, 13, -5, 16);
lineXZ(baseShape, 2, 13);
quadXZ(baseShape, 6, 11, 8, 7);
lineXZ(baseShape, 13, 7);
quadXZ(baseShape, 17, 5, 19, 1);
quadXZ(baseShape, 24, 0, 29, -1);
quadXZ(baseShape, 37, -2, 42, -8);
lineXZ(baseShape, 42, -16);
quadXZ(baseShape, 38, -21, 30, -21);
quadXZ(baseShape, 23, -21, 17, -16);
lineXZ(baseShape, 8, -14);
quadXZ(baseShape, 4, -13, 0, -10);
lineXZ(baseShape, -5, -8);
quadXZ(baseShape, -8, -9, -10, -13);
lineXZ(baseShape, -20, -15);
quadXZ(baseShape, -30, -18, -39, -13);
quadXZ(baseShape, -45, -10, -43, -4);
baseShape.closePath();

// Central open throat.
baseShape.holes.push(roundedRectPathXZ(-1.5, -3, 16, 10, 2.2));

extrudeXZ(baseShape, baseThickness, matCast, 0, 0.55, 0.25, 3);

// Raised outer bead following the casting edge.
const outerRimPts = [
  [-43, -4], [-40, 9], [-32, 18], [-19, 14], [-12, 13], [-5, 16],
  [2, 13], [8, 7], [13, 7], [19, 1], [29, -1], [42, -8],
  [42, -16], [30, -21], [17, -16], [8, -14], [0, -10], [-5, -8],
  [-10, -13], [-20, -15], [-39, -13]
].map(p => [p[0], baseTop + 0.32, p[1]]);
addTube(outerRimPts, 0.24, matCastLight, true, 170);

// Throat rim.
addTube(roundedRectPointsXZ(-1.5, -3, 16, 10, 2.2, 8, baseTop + 0.36), 0.18, matCastLight, true, 88);

// Raised deck panels on the left and right wings.
extrudeXZ(roundedRectShapeXZ(-25.5, 0.5, 25, 16.5, 3.2), 0.22, matPanel, baseTop + 0.04, 0.08, 0.035, 2);
extrudeXZ(roundedRectShapeXZ(24.5, -9.5, 25.5, 14.5, 3.0), 0.22, matPanel, baseTop + 0.04, 0.08, 0.035, 2);
extrudeXZ(roundedRectShapeXZ(0.2, 7.2, 18, 4.7, 1.6), 0.24, matPanel, baseTop + 0.04, 0.07, 0.035, 2);

addTube(roundedRectPointsXZ(-25.5, 0.5, 25, 16.5, 3.2, 8, baseTop + 0.43), 0.12, matCastLight, true, 78);
addTube(roundedRectPointsXZ(24.5, -9.5, 25.5, 14.5, 3.0, 8, baseTop + 0.43), 0.12, matCastLight, true, 78);
addTube(roundedRectPointsXZ(0.2, 7.2, 18, 4.7, 1.6, 6, baseTop + 0.45), 0.11, matCastLight, true, 60);

// Dark throat shadow below the opening.
addBox(13.5, 0.08, 7.2, -1.5, baseTop + 0.08, -3, matDark);

// ---------- Handles ----------
function addHandle(x, z, slotRot) {
  // Circular cast boss and stepped pedestal.
  cylY(8.7, 0.72, x, baseTop + 0.36, z, matCastDark, 72);
  cylY(7.35, 0.72, x, baseTop + 1.08, z, matCast, 72);
  cylinderY(4.55, 5.65, 2.0, x, baseTop + 2.05, z, matCastLight, 72);
  torusY(8.25, 0.20, x, baseTop + 0.78, z, matCastLight);
  torusY(6.95, 0.16, x, baseTop + 1.48, z, matDark);
  torusY(4.8, 0.16, x, baseTop + 2.88, z, matCastDark);

  // Bulb/egg handle made as a lathe profile.
  const profile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(2.4, 0.0),
    new THREE.Vector2(3.4, 0.5),
    new THREE.Vector2(3.1, 1.5),
    new THREE.Vector2(2.3, 2.4),
    new THREE.Vector2(2.6, 3.8),
    new THREE.Vector2(4.3, 5.2),
    new THREE.Vector2(5.65, 7.7),
    new THREE.Vector2(6.05, 10.1),
    new THREE.Vector2(5.55, 12.8),
    new THREE.Vector2(4.25, 15.1),
    new THREE.Vector2(2.15, 16.6),
    new THREE.Vector2(0.0, 16.95)
  ];
  const knobGeom = new THREE.LatheGeometry(profile, 72);
  knobGeom.computeVertexNormals();
  const knob = addMesh(knobGeom, matCastLight, [x, baseTop + 3.0, z]);

  // Horizontal seam around the bulb and oval screwdriver slot on the crown.
  torusY(5.65, 0.055, x, baseTop + 12.8, z, matDark, 6, 80);

  const slot = cylY(1.0, 0.08, x, baseTop + 19.85, z, matDark, 40);
  slot.scale.set(1.65, 1, 0.55);
  slot.rotation.y = slotRot;
}

addHandle(handleLeft.x, handleLeft.z, 0.55);
addHandle(handleRight.x, handleRight.z, -0.35);

// ---------- Front arched bridge with raised label ----------
const archShape = new THREE.Shape();
archShape.moveTo(-19, 0);
archShape.lineTo(-19, 1.3);
archShape.bezierCurveTo(-18.3, 6.4, -14.9, 10.4, -10, 11.4);
archShape.bezierCurveTo(-5.1, 10.4, -1.7, 6.4, -1, 1.3);
archShape.lineTo(-1, 0);
archShape.lineTo(-19, 0);
archShape.closePath();

const archHole = new THREE.Path();
archHole.moveTo(-15.4, 0.35);
archHole.lineTo(-14.2, 1.15);
archHole.bezierCurveTo(-13.7, 4.5, -12, 6.8, -10, 7.45);
archHole.bezierCurveTo(-8.0, 6.8, -6.3, 4.5, -5.75, 1.15);
archHole.lineTo(-4.6, 0.35);
archHole.lineTo(-15.4, 0.35);
archHole.closePath();
archShape.holes.push(archHole);

const archGeom = new THREE.ExtrudeGeometry(archShape, {
  depth: 1.35,
  bevelEnabled: true,
  bevelSize: 0.16,
  bevelThickness: 0.08,
  bevelSegments: 2,
  curveSegments: 24
});
archGeom.computeVertexNormals();
addMesh(archGeom, matCast, [0, baseTop, -8.85]);

// Arch feet and ribs leading to the cutter opening.
addCylinderBetween([-18.2, baseTop + 0.65, -8.25], [-7.0, baseTop + 0.75, -6.6], 0.35, matCastLight, 18);
addCylinderBetween([-2.0, baseTop + 0.65, -8.25], [7.0, baseTop + 0.75, -5.0], 0.35, matCastLight, 18);

// Block-stroke lettering approximation.
function letterStrokes(ch, w, h) {
  const m = h * 0.5;
  const cx = w * 0.5;
  ch = ch.toUpperCase();
  if (ch === "S") return [[0, h, w, h], [0, h, 0, m], [0, m, w, m], [w, m, w, 0], [0, 0, w, 0]];
  if (ch === "T") return [[0, h, w, h], [cx, h, cx, 0]];
  if (ch === "A") return [[0, 0, 0, h], [w, 0, w, h], [0, h, w, h], [0, m, w, m]];
  if (ch === "N") return [[0, 0, 0, h], [w, 0, w, h], [0, h, w, 0]];
  if (ch === "L") return [[0, h, 0, 0], [0, 0, w, 0]];
  if (ch === "E") return [[0, 0, 0, h], [0, h, w, h], [0, m, w * 0.85, m], [0, 0, w, 0]];
  if (ch === "Y") return [[0, h, cx, m], [w, h, cx, m], [cx, m, cx, 0]];
  if (ch === "O" || ch === "0") return [[0, 0, 0, h], [w, 0, w, h], [0, h, w, h], [0, 0, w, 0]];
  if (ch === "7") return [[0, h, w, h], [w, h, w * 0.25, 0]];
  if (ch === "1") return [[cx, h, cx, 0], [cx - w * 0.35, 0, cx + w * 0.35, 0], [cx - w * 0.2, h * 0.82, cx, h]];
  return [];
}

function addFrontStroke(x1, y1, x2, y2, z, stroke, depth, mat) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len <= 0.001) return;
  addBox(len, stroke, depth, (x1 + x2) / 2, (y1 + y2) / 2, z, mat, 0, 0, Math.atan2(dy, dx));
}

function addStrokeTextFront(text, startX, baseY, z, h, mat) {
  const stroke = h * 0.11;
  const depth = 0.14;
  let cursor = startX;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w = ch === " " ? h * 0.25 : h * 0.55;
    const strokes = letterStrokes(ch, w, h);
    for (let j = 0; j < strokes.length; j++) {
      const s = strokes[j];
      addFrontStroke(cursor + s[0], baseY + s[1], cursor + s[2], baseY + s[3], z, stroke, depth, mat);
    }
    cursor += w + h * 0.18;
  }
}

addStrokeTextFront("STANLEY", -15.8, baseTop + 5.55, -7.42, 1.25, matDark);

// ---------- Central guide post and cutter ----------
function addGuidePost() {
  const x = -6.2;
  const z = -0.8;

  addBox(5.6, 0.55, 5.6, x, baseTop + 0.34, z, matCastDark, 0, Math.PI / 4, 0);
  cylinderY(2.25, 4.25, 4.5, x, baseTop + 2.65, z, matCast, 44);
  cylY(1.52, 12.6, x, baseTop + 11.25, z, matSteel, 44);
  cylY(1.95, 0.72, x, baseTop + 17.9, z, matCastLight, 44);
  torusY(1.55, 0.08, x, baseTop + 17.52, z, matDark, 6, 52);
}

addGuidePost();

// Sloping blade and support block descending into the central throat.
addBoxBetween([-1.5, baseTop + 2.0, -6.2], [6.8, baseTop + 10.8, -2.0], 1.7, 0.72, matBlade);
addBoxBetween([-6.0, baseTop + 3.2, -2.5], [5.8, baseTop + 5.0, -1.7], 1.65, 1.15, matCastDark);
addBox(2.1, 0.55, 4.8, 1.8, baseTop + 0.48, -5.7, matDark, 0, -0.18, 0);

// ---------- Central circular depth-adjuster assembly ----------
function addThreadedScrewY(x, z, y0, h, r) {
  cylY(r, h, x, y0 + h / 2, z, matSteel, 28);
  for (let y = y0 + 0.25; y <= y0 + h - 0.15; y += 0.46) {
    torusY(r + 0.035, 0.035, x, y, z, matDark, 6, 30);
  }
}

function addThreadedScrewX(x0, x1, y, z, r) {
  const len = x1 - x0;
  cylX(r, len, x0 + len / 2, y, z, matSteel, 28);
  for (let x = x0 + 0.25; x <= x1 - 0.15; x += 0.46) {
    torusX(r + 0.035, 0.035, x, y, z, matDark, 6, 30);
  }
}

function addCentralAdjuster() {
  const x = 6.8;
  const z = 1.8;

  // Stacked circular collar.
  cylinderY(7.2, 7.45, 1.0, x, baseTop + 0.55, z, matCast, 72);
  cylinderY(5.75, 6.55, 1.55, x, baseTop + 1.75, z, matCastLight, 72);
  torusY(7.12, 0.22, x, baseTop + 1.08, z, matCastDark);
  torusY(5.75, 0.18, x, baseTop + 2.48, z, matDark);

  // Central sleeve.
  cylY(1.55, 9.5, x, baseTop + 7.6, z, matSteel, 38);
  torusY(1.62, 0.09, x, baseTop + 3.3, z, matDark, 6, 44);

  // Twin guide uprights.
  const postY0 = baseTop + 3.0;
  const postH = 12.4;
  const offsets = [-2.35, 2.35];
  for (let i = 0; i < offsets.length; i++) {
    const px = x + offsets[i];
    const pz = z - 1.55;
    cylY(0.88, postH, px, postY0 + postH / 2, pz, matSteel, 28);
    cylY(1.35, 0.55, px, postY0 + 0.28, pz, matCast, 36);
    cylY(1.35, 0.55, px, postY0 + postH + 0.25, pz, matCastLight, 36);
  }

  addBox(6.4, 0.75, 2.25, x, postY0 + postH + 0.65, z - 1.55, matCastLight);

  // Threaded vertical adjuster screw with large washer and nuts.
  const sx = x + 4.05;
  const sz = z + 2.15;
  addThreadedScrewY(sx, sz, baseTop + 3.7, 17.0, 0.48);
  cylY(3.25, 0.62, sx, baseTop + 16.65, sz, matDark, 64);
  cylY(1.15, 0.65, sx, baseTop + 17.35, sz, matSteel, 32);
  cylinderY(1.5, 1.5, 0.78, sx, baseTop + 18.15, sz, matSteel, 6);
  cylinderY(1.16, 1.16, 0.72, sx, baseTop + 19.05, sz, matSteel, 6);
  cylY(0.62, 1.15, sx, baseTop + 19.95, sz, matSteel, 24);
}

addCentralAdjuster();

// ---------- Side thumb screw and perforated wheel ----------
function addSideThumbScrew() {
  const shaftY = baseTop + 9.9;
  const shaftZ = 5.5;
  const x0 = 10.8;
  const x1 = 20.2;

  addCylinderBetween([8.1, shaftY, 2.9], [x0, shaftY, shaftZ], 0.72, matCast, 24);
  cylX(1.0, 1.25, x0 - 0.45, shaftY, shaftZ, matCastLight, 36);
  addThreadedScrewX(x0, x1, shaftY, shaftZ, 0.45);

  const wheelX = x1 + 1.35;

  // Main wheel disk faces the viewer side, with scalloped/knurled perimeter.
  cylX(3.25, 0.78, wheelX, shaftY, shaftZ, matCastLight, 72);
  torusX(3.05, 0.16, wheelX + 0.42, shaftY, shaftZ, matCastDark, 8, 72);
  torusX(2.45, 0.06, wheelX + 0.45, shaftY, shaftZ, matDark, 6, 60);
  cylX(0.85, 1.05, wheelX, shaftY, shaftZ, matSteel, 36);

  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    addBox(
      0.82, 0.22, 0.62,
      wheelX,
      shaftY + Math.cos(a) * 3.42,
      shaftZ + Math.sin(a) * 3.42,
      matCastDark,
      a,
      0,
      0
    );
  }

  // Perforation pattern: dark disks on the front face.
  const rings = [
    { r: 1.15, count: 6, dot: 0.15 },
    { r: 2.05, count: 12, dot: 0.13 }
  ];
  for (let k = 0; k < rings.length; k++) {
    for (let i = 0; i < rings[k].count; i++) {
      const a = (i / rings[k].count) * Math.PI * 2 + (k * 0.16);
      cylX(
        rings[k].dot,
        0.08,
        wheelX + 0.46,
        shaftY + Math.cos(a) * rings[k].r,
        shaftZ + Math.sin(a) * rings[k].r,
        matDark,
        12
      );
    }
  }
}

addSideThumbScrew();

// ---------- Small gauge plate, screw holes, and name plates ----------
function addCountersunkHole(x, z, r = 0.8) {
  cylY(r, 0.07, x, baseTop + 0.72, z, matDark, 32);
  torusY(r + 0.16, 0.055, x, baseTop + 0.76, z, matSteel, 6, 42);
}

function addSlottedScrew(x, z, r = 0.76, slotRot = 0) {
  cylY(r, 0.18, x, baseTop + 0.75, z, matSteel, 36);
  addBox(r * 1.45, 0.05, r * 0.24, x, baseTop + 0.86, z, matDark, 0, slotRot, 0);
}

addCountersunkHole(-20.2, -7.4, 0.62);
addSlottedScrew(-14.5, -8.0, 0.58, 0.2);
addCountersunkHole(16.0, -12.2, 0.68);
addCountersunkHole(22.3, -10.7, 1.15);
addSlottedScrew(28.5, -13.0, 0.56, -0.3);

// Small graduated dial/plate near the left-center of the body.
cylY(2.75, 0.18, -12.8, baseTop + 0.62, -1.3, matCastDark, 48);
cylY(0.42, 0.12, -12.8, baseTop + 0.78, -1.3, matDark, 24);
for (let i = 0; i < 13; i++) {
  const a = -Math.PI * 0.85 + i * (Math.PI * 1.15 / 12);
  cylY(0.105, 0.05, -12.8 + Math.cos(a) * 1.75, baseTop + 0.80, -1.3 + Math.sin(a) * 1.75, matDark, 8);
}

// Name plate on right wing.
addBox(8.6, 0.12, 3.8, 26.0, baseTop + 0.75, -5.2, matDark);
addBox(7.55, 0.13, 2.85, 26.0, baseTop + 0.84, -5.2, matPanel);

// Small tilted plate on left wing.
addBox(6.4, 0.12, 3.8, -14.3, baseTop + 0.74, 2.0, matDark, 0, -0.38, 0);
addBox(5.45, 0.13, 2.85, -14.3, baseTop + 0.83, 2.0, matPanel, 0, -0.38, 0);
addSlottedScrew(-16.6, 2.2, 0.42, 0.8);
addSlottedScrew(-12.0, 1.8, 0.42, -0.25);

function addTopStroke(x1, z1, x2, z2, y, stroke, height, mat) {
  const dx = x2 - x1, dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len <= 0.001) return;
  addBox(len, height, stroke, (x1 + x2) / 2, y, (z1 + z2) / 2, mat, 0, -Math.atan2(dz, dx), 0);
}

function addStrokeTextTop(text, startX, startZ, y, h, mat) {
  const stroke = h * 0.105;
  const height = 0.055;
  let cursor = startX;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w = ch === " " ? h * 0.25 : h * 0.55;
    const strokes = letterStrokes(ch, w, h);
    for (let j = 0; j < strokes.length; j++) {
      const s = strokes[j];
      addTopStroke(cursor + s[0], startZ + s[1], cursor + s[2], startZ + s[3], y, stroke, height, mat);
    }
    cursor += w + h * 0.18;
  }
}

addStrokeTextTop("NO71", 24.55, -5.85, baseTop + 0.94, 0.82, matDark);

// Decorative side notches along the front edge.
addBox(4.6, 0.12, 0.35, 29.2, 0.9, -20.6, matDark);
addBox(4.4, 0.12, 0.35, -30.8, 0.9, -14.4, matDark);

// Extra cast ribs tying the body together.
addCylinderBetween([-21.0, baseTop + 0.80, 9.2], [-3.8, baseTop + 0.80, 8.0], 0.32, matCastLight, 18);
addCylinderBetween([11.0, baseTop + 0.80, -4.9], [27.5, baseTop + 0.80, -10.6], 0.32, matCastLight, 18);
addCylinderBetween([-10.0, baseTop + 0.78, -7.1], [8.5, baseTop + 0.78, -5.6], 0.28, matCastDark, 18);

// Camera framing.
camera.position.set(68, 44, 52);
camera.lookAt(0, 8, 0);