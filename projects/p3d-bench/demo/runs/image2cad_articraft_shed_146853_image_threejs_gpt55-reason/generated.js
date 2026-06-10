// Parameters inferred from the reference image: a rectangular timber shed frame
// with vertical wall panels, double front doors, raised base, and an exposed gable roof truss system.
const shedWidth = 12;
const shedLength = 19;
const baseHeight = 0.55;
const wallHeight = 6.2;
const roofRise = 4.15;

const halfW = shedWidth / 2;
const halfL = shedLength / 2;
const eaveY = baseHeight + wallHeight;
const ridgeY = eaveY + roofRise;

const wallThickness = 0.18;
const trimDepth = 0.08;
const battenWidth = 0.12;
const railHeight = 0.18;

const rafterThickness = 0.23;
const ridgeThickness = 0.30;
const eaveBeamThickness = 0.28;
const purlinThickness = 0.13;
const webThickness = 0.11;
const crossBraceThickness = 0.075;

// Materials: neutral gray palette matching the monochrome technical drawing.
const wallMat = new THREE.MeshStandardMaterial({ color: 0xb8b9bb, roughness: 0.72, metalness: 0.02 });
const baseMat = new THREE.MeshStandardMaterial({ color: 0x9fa2a5, roughness: 0.75, metalness: 0.02 });
const frameMat = new THREE.MeshStandardMaterial({ color: 0x8f969c, roughness: 0.68, metalness: 0.02 });
const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x33383d, roughness: 0.7, metalness: 0.02 });
const doorMat = new THREE.MeshStandardMaterial({ color: 0xaeb0b3, roughness: 0.7, metalness: 0.02 });
const hingeMat = new THREE.MeshStandardMaterial({ color: 0x25282c, roughness: 0.55, metalness: 0.05 });
const screwMat = new THREE.MeshStandardMaterial({ color: 0xd0d1d3, roughness: 0.6, metalness: 0.05 });
const roofSheetMat = new THREE.MeshStandardMaterial({ color: 0xbfc1c3, roughness: 0.74, metalness: 0.02 });

// Utility for axis-aligned boards, panels, rails, and trim.
function addBox(cx, cy, cz, sx, sy, sz, material, name) {
  const geometry = new THREE.BoxGeometry(sx, sy, sz);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(cx, cy, cz);
  if (name) mesh.name = name;
  scene.add(mesh);
  return mesh;
}

// Utility for square-section beams between arbitrary 3D points.
function addBeamBetween(start, end, thickness, material, name) {
  const s = new THREE.Vector3(start[0], start[1], start[2]);
  const e = new THREE.Vector3(end[0], end[1], end[2]);
  const length = s.distanceTo(e);
  if (length < 0.001) return null;

  const geometry = new THREE.BoxGeometry(thickness, thickness, length);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(s).add(e).multiplyScalar(0.5);

  const direction = e.clone().sub(s).normalize();
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

  if (name) mesh.name = name;
  scene.add(mesh);
  return mesh;
}

// Roof helpers. t = 0 at ridge, t = 1 at eave. side: -1 left slope, +1 right slope.
function roofPoint(side, t, z) {
  return [side * halfW * t, ridgeY - roofRise * t, z];
}

function roofYAtX(x) {
  return ridgeY - roofRise * Math.abs(x) / halfW;
}

// Thin rectangular sloped roof sheet, used to represent the partially clad roof section.
function addSlopedRoofPanel(side, t0, t1, z0, z1, thickness, material, name) {
  const zMid = (z0 + z1) / 2;
  const a = roofPoint(side, t0, zMid);
  const b = roofPoint(side, t1, zMid);

  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const slopeLength = Math.sqrt(dx * dx + dy * dy);
  const zLength = Math.abs(z1 - z0);

  const geometry = new THREE.BoxGeometry(slopeLength, thickness, zLength);
  const mesh = new THREE.Mesh(geometry, material);

  const angle = Math.atan2(dy, dx);
  mesh.rotation.z = angle;

  const normal = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
  if (normal.y < 0) normal.multiplyScalar(-1);

  mesh.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, zMid);
  mesh.position.addScaledVector(normal, thickness * 0.5 + 0.015);

  if (name) mesh.name = name;
  scene.add(mesh);
  return mesh;
}

// Raised perimeter base.
addBox(0, baseHeight / 2, 0, shedWidth + 0.7, baseHeight, shedLength + 0.7, baseMat, "raised rectangular base");

addBox(0, baseHeight + 0.08, -halfL - 0.30, shedWidth + 0.75, 0.24, 0.28, frameMat, "front base rail");
addBox(0, baseHeight + 0.08, halfL + 0.30, shedWidth + 0.75, 0.24, 0.28, frameMat, "rear base rail");
addBox(halfW + 0.30, baseHeight + 0.08, 0, 0.28, 0.24, shedLength + 0.75, frameMat, "right base rail");
addBox(-halfW - 0.30, baseHeight + 0.08, 0, 0.28, 0.24, shedLength + 0.75, frameMat, "left base rail");

// Main wall panels: simple gray slabs under the exposed roof.
const wallCenterY = baseHeight + wallHeight / 2;

addBox(halfW - wallThickness / 2, wallCenterY, 0, wallThickness, wallHeight, shedLength, wallMat, "right wall panel field");
addBox(-halfW + wallThickness / 2, wallCenterY, 0, wallThickness, wallHeight, shedLength, wallMat, "left wall panel field");
addBox(0, wallCenterY, -halfL + wallThickness / 2, shedWidth, wallHeight, wallThickness, wallMat, "front wall panel field");
addBox(0, wallCenterY, halfL - wallThickness / 2, shedWidth, wallHeight, wallThickness, wallMat, "rear wall panel field");

// Corner posts.
const cornerPost = 0.24;
for (const x of [-halfW, halfW]) {
  for (const z of [-halfL, halfL]) {
    addBox(x, wallCenterY, z, cornerPost, wallHeight + 0.05, cornerPost, frameMat, "corner post");
  }
}

// Vertical battens and horizontal rails on the long side walls.
const sideTrimX = halfW + trimDepth / 2;
const longPanelCount = 11;
for (let i = 0; i <= longPanelCount; i++) {
  const z = -halfL + (i * shedLength) / longPanelCount;
  addBox(sideTrimX, wallCenterY, z, trimDepth, wallHeight, battenWidth, frameMat, "right side vertical batten");
  addBox(-sideTrimX, wallCenterY, z, trimDepth, wallHeight, battenWidth, frameMat, "left side vertical batten");
}

for (const x of [sideTrimX, -sideTrimX]) {
  addBox(x, baseHeight + railHeight / 2, 0, trimDepth, railHeight, shedLength + 0.1, frameMat, "side lower wall rail");
  addBox(x, eaveY - railHeight / 2, 0, trimDepth, railHeight, shedLength + 0.1, frameMat, "side upper wall rail");
}

// Vertical battens and rails on front and rear walls.
const frontTrimZ = -halfL - trimDepth / 2;
const rearTrimZ = halfL + trimDepth / 2;
const endPanelCount = 7;

for (let i = 0; i <= endPanelCount; i++) {
  const x = -halfW + (i * shedWidth) / endPanelCount;
  addBox(x, wallCenterY, frontTrimZ, battenWidth, wallHeight, trimDepth, frameMat, "front vertical batten");
  addBox(x, wallCenterY, rearTrimZ, battenWidth, wallHeight, trimDepth, frameMat, "rear vertical batten");
}

for (const z of [frontTrimZ, rearTrimZ]) {
  addBox(0, baseHeight + railHeight / 2, z, shedWidth + 0.1, railHeight, trimDepth, frameMat, "end lower wall rail");
  addBox(0, eaveY - railHeight / 2, z, shedWidth + 0.1, railHeight, trimDepth, frameMat, "end upper wall rail");
}

// Double front doors, placed slightly left of center as in the reference.
const doorCenterX = -2.25;
const doorLeafW = 2.05;
const doorGap = 0.12;
const doorTotalW = doorLeafW * 2 + doorGap;
const doorH = 4.85;
const doorBottom = baseHeight + 0.25;
const doorY = doorBottom + doorH / 2;
const doorZ = -halfL - 0.17;
const doorThickness = 0.12;
const doorFrameDepth = 0.08;
const doorFrameZ = -halfL - 0.255;

const leftDoorX = doorCenterX - (doorLeafW / 2 + doorGap / 2);
const rightDoorX = doorCenterX + (doorLeafW / 2 + doorGap / 2);
const doorLeftEdge = doorCenterX - doorTotalW / 2;
const doorRightEdge = doorCenterX + doorTotalW / 2;

addBox(leftDoorX, doorY, doorZ, doorLeafW, doorH, doorThickness, doorMat, "left front door leaf");
addBox(rightDoorX, doorY, doorZ, doorLeafW, doorH, doorThickness, doorMat, "right front door leaf");

// Door outer frame, center mullion, and threshold.
const doorRail = 0.16;
addBox(doorCenterX, doorBottom + doorH + doorRail / 2, doorFrameZ, doorTotalW + 0.45, doorRail, doorFrameDepth, frameMat, "door top frame");
addBox(doorCenterX, doorBottom - doorRail / 2, doorFrameZ, doorTotalW + 0.45, doorRail, doorFrameDepth, frameMat, "door threshold");
addBox(doorLeftEdge - doorRail / 2, doorY, doorFrameZ, doorRail, doorH + 0.35, doorFrameDepth, frameMat, "door left jamb");
addBox(doorRightEdge + doorRail / 2, doorY, doorFrameZ, doorRail, doorH + 0.35, doorFrameDepth, frameMat, "door right jamb");
addBox(doorCenterX, doorY, doorFrameZ, doorRail, doorH + 0.25, doorFrameDepth, frameMat, "door center mullion");

// Inset rectangular trim on each door leaf.
for (const cx of [leftDoorX, rightDoorX]) {
  const insetW = doorLeafW - 0.55;
  const insetH = doorH - 0.65;
  addBox(cx - insetW / 2, doorY, doorFrameZ - 0.02, 0.10, insetH, 0.055, frameMat, "door inset vertical trim");
  addBox(cx + insetW / 2, doorY, doorFrameZ - 0.02, 0.10, insetH, 0.055, frameMat, "door inset vertical trim");
  addBox(cx, doorBottom + 0.34, doorFrameZ - 0.02, insetW, 0.10, 0.055, frameMat, "door inset lower trim");
  addBox(cx, doorBottom + doorH - 0.34, doorFrameZ - 0.02, insetW, 0.10, 0.055, frameMat, "door inset upper trim");
}

// Hinges and small screw heads.
const hingeW = 0.18;
const hingeH = 0.38;
const hingeD = 0.06;
const hingeZ = -halfL - 0.32;
const hingeYs = [doorBottom + 0.75, doorBottom + doorH / 2, doorBottom + doorH - 0.75];
const hingeXs = [doorLeftEdge + 0.18, doorRightEdge - 0.18];

for (const hx of hingeXs) {
  for (const hy of hingeYs) {
    addBox(hx, hy, hingeZ, hingeW, hingeH, hingeD, hingeMat, "door hinge plate");

    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        addBox(
          hx + sx * 0.045,
          hy + sy * 0.105,
          hingeZ - 0.04,
          0.035,
          0.035,
          0.025,
          screwMat,
          "hinge screw head"
        );
      }
    }
  }
}

// Small handles near the meeting line.
addBox(doorCenterX - 0.12, doorBottom + doorH * 0.55, hingeZ - 0.02, 0.055, 0.34, 0.055, hingeMat, "left door handle");
addBox(doorCenterX + 0.12, doorBottom + doorH * 0.55, hingeZ - 0.02, 0.055, 0.34, 0.055, hingeMat, "right door handle");

// Partially installed solid roof sheet on the visible front-right slope.
addSlopedRoofPanel(
  1,
  0.05,
  0.98,
  -halfL + 0.35,
  -halfL + 5.55,
  0.08,
  roofSheetMat,
  "partial solid roof sheet"
);

// Main roof outline: ridge, eave beams, and gable rake boards.
addBeamBetween([0, ridgeY, -halfL - 0.25], [0, ridgeY, halfL + 0.25], ridgeThickness, frameMat, "ridge beam");

addBeamBetween([-halfW, eaveY, -halfL - 0.25], [-halfW, eaveY, halfL + 0.25], eaveBeamThickness, frameMat, "left eave beam");
addBeamBetween([halfW, eaveY, -halfL - 0.25], [halfW, eaveY, halfL + 0.25], eaveBeamThickness, frameMat, "right eave beam");

for (const z of [-halfL, halfL]) {
  addBeamBetween(roofPoint(-1, 1, z), roofPoint(-1, 0, z), rafterThickness + 0.04, frameMat, "gable rake beam");
  addBeamBetween(roofPoint(1, 0, z), roofPoint(1, 1, z), rafterThickness + 0.04, frameMat, "gable rake beam");
}

// Front and rear gable triangular truss frames.
for (const z of [-halfL, halfL]) {
  addBeamBetween([-halfW, eaveY, z], [halfW, eaveY, z], 0.18, frameMat, "gable bottom chord");
  addBeamBetween([0, eaveY, z], [0, ridgeY, z], webThickness, frameMat, "gable king post");

  const gableStudXs = [-halfW * 0.72, -halfW * 0.45, -halfW * 0.22, halfW * 0.22, halfW * 0.45, halfW * 0.72];
  for (const x of gableStudXs) {
    addBeamBetween([x, eaveY, z], [x, roofYAtX(x), z], 0.09, frameMat, "gable vertical web");
  }

  addBeamBetween([-halfW, eaveY, z], [-halfW * 0.30, roofYAtX(-halfW * 0.30), z], 0.09, darkFrameMat, "gable diagonal brace");
  addBeamBetween([halfW, eaveY, z], [halfW * 0.30, roofYAtX(halfW * 0.30), z], 0.09, darkFrameMat, "gable diagonal brace");
  addBeamBetween([0, eaveY, z], [-halfW * 0.58, roofYAtX(-halfW * 0.58), z], 0.085, darkFrameMat, "gable interior diagonal");
  addBeamBetween([0, eaveY, z], [halfW * 0.58, roofYAtX(halfW * 0.58), z], 0.085, darkFrameMat, "gable interior diagonal");
}

// Repeating roof trusses along the length.
const interiorTrussCount = 8;
const trussZs = [];

for (let i = 1; i <= interiorTrussCount; i++) {
  const z = -halfL + (i * shedLength) / (interiorTrussCount + 1);
  trussZs.push(z);

  addBeamBetween(roofPoint(-1, 1, z), roofPoint(-1, 0, z), rafterThickness, frameMat, "left roof rafter");
  addBeamBetween(roofPoint(1, 0, z), roofPoint(1, 1, z), rafterThickness, frameMat, "right roof rafter");

  addBeamBetween([-halfW + 0.06, eaveY + 0.03, z], [halfW - 0.06, eaveY + 0.03, z], 0.16, frameMat, "roof bottom chord");
  addBeamBetween([0, eaveY + 0.05, z], [0, ridgeY, z], webThickness, frameMat, "roof king post");

  addBeamBetween([0, eaveY + 0.08, z], roofPoint(-1, 0.55, z), webThickness, frameMat, "left roof web brace");
  addBeamBetween([0, eaveY + 0.08, z], roofPoint(1, 0.55, z), webThickness, frameMat, "right roof web brace");
}

// Long purlins running along each roof slope.
const purlinLevels = [0.20, 0.40, 0.62, 0.82];

for (const side of [-1, 1]) {
  for (const t of purlinLevels) {
    addBeamBetween(
      roofPoint(side, t, -halfL - 0.20),
      roofPoint(side, t, halfL + 0.20),
      purlinThickness,
      frameMat,
      "long roof purlin"
    );
  }
}

// Alternating diagonal bracing across the roof planes, matching the lattice-like drawing.
const roofGridZs = [-halfL, ...trussZs, halfL];

for (let i = 0; i < roofGridZs.length - 1; i++) {
  const z0 = roofGridZs[i] + 0.13;
  const z1 = roofGridZs[i + 1] - 0.13;

  for (const side of [-1, 1]) {
    if (i % 2 === 0) {
      addBeamBetween(roofPoint(side, 0.24, z0), roofPoint(side, 0.84, z1), crossBraceThickness, darkFrameMat, "roof diagonal lattice brace");
    } else {
      addBeamBetween(roofPoint(side, 0.84, z0), roofPoint(side, 0.24, z1), crossBraceThickness, darkFrameMat, "roof diagonal lattice brace");
    }
  }
}

// Subtle interior wall studs visible beneath the open roof.
const innerStudInset = 0.22;
for (let i = 0; i <= longPanelCount; i++) {
  const z = -halfL + (i * shedLength) / longPanelCount;
  addBox(halfW - innerStudInset, wallCenterY, z, 0.10, wallHeight, 0.08, frameMat, "right interior wall stud");
  addBox(-halfW + innerStudInset, wallCenterY, z, 0.10, wallHeight, 0.08, frameMat, "left interior wall stud");
}

// Camera positioned to show the front doors, right side wall panels, and open trussed roof.
camera.position.set(18, 14, -24);
camera.lookAt(0, 5.4, 0);