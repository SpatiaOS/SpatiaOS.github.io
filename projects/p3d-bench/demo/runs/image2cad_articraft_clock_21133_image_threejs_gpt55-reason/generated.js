// Parameters and interpretation:
// The image is modeled as a low, round gray clock face with a thick outer annular rim,
// a recessed inner dial, raised Roman numerals, a central circular boss, and a thin hand
// pointing toward the upper-right area of the dial.

const DEG = Math.PI / 180;
const radialSegments = 128;

// Overall clock proportions
const baseRadius = 10.0;
const baseHeight = 0.75;

const outerRimInnerRadius = 7.45;
const outerRimHeight = 0.55;

const faceRadius = 6.95;
const facePlateHeight = 0.14;

const baseTopY = baseHeight;
const faceTopY = baseTopY + facePlateHeight;
const rimTopY = baseTopY + outerRimHeight;

// Dial decoration
const raisedRingInnerRadius = 6.58;
const raisedRingOuterRadius = 6.78;
const raisedRingHeight = 0.08;

// Roman numerals
const numeralRadius = 5.28;
const numeralReliefHeight = 0.16;
const numeralY = faceTopY + numeralReliefHeight * 0.5;
const numeralCharHeight = 1.12;
const numeralStrokeWidth = 0.16;
const numeralICapWidth = 0.36;
const numeralIAdvance = 0.38;
const numeralWideAdvance = 0.76;
const numeralGap = 0.12;

// Central boss and hand
const centerDiskRadius = 1.68;
const centerDiskHeight = 0.24;
const pivotCollarRadius = 0.58;
const pivotCollarHeight = 0.07;
const hubRadius = 0.39;
const hubHeight = 0.18;
const hubCapRadius = 0.28;
const hubCapHeight = 0.055;

const handClockwiseAngle = 42 * DEG;
const handForwardLength = 6.45;
const handBackLength = 0.35;
const handWidth = 0.16;
const handHeight = 0.085;

// Materials: mostly uniform gray with subtle contrast for recessed/raised features
const matBase = new THREE.MeshStandardMaterial({
  color: 0x8f9093,
  roughness: 0.78,
  metalness: 0.0
});

const matRim = new THREE.MeshStandardMaterial({
  color: 0x999a9d,
  roughness: 0.76,
  metalness: 0.0
});

const matFace = new THREE.MeshStandardMaterial({
  color: 0x87888b,
  roughness: 0.82,
  metalness: 0.0
});

const matGroove = new THREE.MeshStandardMaterial({
  color: 0x68696c,
  roughness: 0.88,
  metalness: 0.0
});

const matRaised = new THREE.MeshStandardMaterial({
  color: 0xb7b8ba,
  roughness: 0.72,
  metalness: 0.0
});

const matPointer = new THREE.MeshStandardMaterial({
  color: 0xc4c5c7,
  roughness: 0.68,
  metalness: 0.0
});

// Custom annular cylinder so rings have true holes instead of stacked solid disks.
function makeAnnularCylinderGeometry(innerRadius, outerRadius, height, segments) {
  const positions = [];
  const yTop = height * 0.5;
  const yBottom = -height * 0.5;

  function pushVertex(p) {
    positions.push(p[0], p[1], p[2]);
  }

  function tri(a, b, c) {
    pushVertex(a);
    pushVertex(b);
    pushVertex(c);
  }

  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;

    const co0 = Math.cos(a0);
    const so0 = Math.sin(a0);
    const co1 = Math.cos(a1);
    const so1 = Math.sin(a1);

    const o0t = [outerRadius * co0, yTop, outerRadius * so0];
    const o1t = [outerRadius * co1, yTop, outerRadius * so1];
    const i0t = [innerRadius * co0, yTop, innerRadius * so0];
    const i1t = [innerRadius * co1, yTop, innerRadius * so1];

    const o0b = [outerRadius * co0, yBottom, outerRadius * so0];
    const o1b = [outerRadius * co1, yBottom, outerRadius * so1];
    const i0b = [innerRadius * co0, yBottom, innerRadius * so0];
    const i1b = [innerRadius * co1, yBottom, innerRadius * so1];

    // Top annular face
    tri(o0t, i1t, o1t);
    tri(o0t, i0t, i1t);

    // Bottom annular face
    tri(o0b, o1b, i1b);
    tri(o0b, i1b, i0b);

    // Outer cylindrical wall
    tri(o0t, o1t, o1b);
    tri(o0t, o1b, o0b);

    // Inner cylindrical wall
    tri(i0t, i1b, i1t);
    tri(i0t, i0b, i1b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.computeVertexNormals();
  return geometry;
}

function addCylinder(radius, height, yBottom, material, name) {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = yBottom + height * 0.5;
  if (name) mesh.name = name;
  scene.add(mesh);
  return mesh;
}

function addAnnularCylinder(innerRadius, outerRadius, height, yBottom, material, name) {
  const geometry = makeAnnularCylinderGeometry(innerRadius, outerRadius, height, radialSegments);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = yBottom + height * 0.5;
  if (name) mesh.name = name;
  scene.add(mesh);
  return mesh;
}

function addBox(sizeX, sizeY, sizeZ, x, y, z, yaw, material, name) {
  const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.y = yaw;
  if (name) mesh.name = name;
  scene.add(mesh);
  return mesh;
}

function addLocalBox(originX, originZ, baseYaw, localX, localZ, localYaw, sizeX, sizeY, sizeZ, yCenter, material, name) {
  const c = Math.cos(baseYaw);
  const s = Math.sin(baseYaw);

  const worldX = originX + localX * c + localZ * s;
  const worldZ = originZ - localX * s + localZ * c;

  return addBox(sizeX, sizeY, sizeZ, worldX, yCenter, worldZ, baseYaw + localYaw, material, name);
}

// Main circular body
addCylinder(baseRadius, baseHeight, 0, matBase, "solid lower circular base");

// Raised outer rim surrounding the recessed dial
addAnnularCylinder(outerRimInnerRadius, baseRadius, outerRimHeight, baseTopY, matRim, "thick raised outer annular rim");

// Recessed inner dial floor
addCylinder(faceRadius, facePlateHeight, baseTopY, matFace, "recessed circular clock face");

// Dark circular groove between dial and rim, visible as the shadowed step in the image
addAnnularCylinder(faceRadius + 0.04, outerRimInnerRadius - 0.06, 0.035, baseTopY + 0.01, matGroove, "shadow groove around recessed dial");

// Thin raised circular line near the edge of the dial face
addAnnularCylinder(raisedRingInnerRadius, raisedRingOuterRadius, raisedRingHeight, faceTopY, matRaised, "raised inner dial border ring");

// Roman numeral construction using simple raised cuboid strokes.
// Each numeral is oriented radially outward like the image's raised clock markings.
function romanAdvance(ch) {
  return ch === "I" ? numeralIAdvance : numeralWideAdvance;
}

function addRomanSegment(originX, originZ, baseYaw, x0, z0, x1, z1, name) {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const length = Math.sqrt(dx * dx + dz * dz);
  const midX = (x0 + x1) * 0.5;
  const midZ = (z0 + z1) * 0.5;
  const localYaw = Math.atan2(dx, dz);

  addLocalBox(
    originX,
    originZ,
    baseYaw,
    midX,
    midZ,
    localYaw,
    numeralStrokeWidth,
    numeralReliefHeight,
    length,
    numeralY,
    matRaised,
    name
  );
}

function addRomanCharacter(ch, charCenterX, originX, originZ, baseYaw, label) {
  const h = numeralCharHeight;
  const w = numeralWideAdvance * 0.86;

  if (ch === "I") {
    // Main radial bar
    addLocalBox(
      originX,
      originZ,
      baseYaw,
      charCenterX,
      0,
      0,
      numeralStrokeWidth,
      numeralReliefHeight,
      h,
      numeralY,
      matRaised,
      label + "_I_stem"
    );

    // Small top and bottom caps for a more Roman-inscription feel
    addLocalBox(
      originX,
      originZ,
      baseYaw,
      charCenterX,
      h * 0.46,
      0,
      numeralICapWidth,
      numeralReliefHeight,
      numeralStrokeWidth,
      numeralY,
      matRaised,
      label + "_I_top_cap"
    );

    addLocalBox(
      originX,
      originZ,
      baseYaw,
      charCenterX,
      -h * 0.46,
      0,
      numeralICapWidth,
      numeralReliefHeight,
      numeralStrokeWidth,
      numeralY,
      matRaised,
      label + "_I_bottom_cap"
    );
  }

  if (ch === "V") {
    // Point inward, open outward
    addRomanSegment(originX, originZ, baseYaw, charCenterX, -h * 0.5, charCenterX - w * 0.5, h * 0.5, label + "_V_left");
    addRomanSegment(originX, originZ, baseYaw, charCenterX, -h * 0.5, charCenterX + w * 0.5, h * 0.5, label + "_V_right");
  }

  if (ch === "X") {
    addRomanSegment(originX, originZ, baseYaw, charCenterX - w * 0.5, -h * 0.5, charCenterX + w * 0.5, h * 0.5, label + "_X_diag_a");
    addRomanSegment(originX, originZ, baseYaw, charCenterX + w * 0.5, -h * 0.5, charCenterX - w * 0.5, h * 0.5, label + "_X_diag_b");
  }
}

function addRomanNumeral(text, hour) {
  const angle = Math.PI / 2 - (hour % 12) * Math.PI / 6;
  const originX = numeralRadius * Math.cos(angle);
  const originZ = numeralRadius * Math.sin(angle);

  // Rotate local +Z to point radially outward.
  const baseYaw = Math.PI / 2 - angle;

  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += romanAdvance(text[i]);
    if (i < text.length - 1) totalWidth += numeralGap;
  }

  let cursor = -totalWidth * 0.5;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const adv = romanAdvance(ch);
    const charCenterX = cursor + adv * 0.5;
    addRomanCharacter(ch, charCenterX, originX, originZ, baseYaw, "hour_" + hour + "_" + ch + "_" + i);
    cursor += adv + numeralGap;
  }
}

const romanNumerals = [
  { hour: 1, text: "I" },
  { hour: 2, text: "II" },
  { hour: 3, text: "III" },
  { hour: 4, text: "IV" },
  { hour: 5, text: "V" },
  { hour: 6, text: "VI" },
  { hour: 7, text: "VII" },
  { hour: 8, text: "VIII" },
  { hour: 9, text: "IX" },
  { hour: 10, text: "X" },
  { hour: 11, text: "XI" },
  { hour: 12, text: "XII" }
];

for (let i = 0; i < romanNumerals.length; i++) {
  addRomanNumeral(romanNumerals[i].text, romanNumerals[i].hour);
}

// Central raised circular disk
addCylinder(centerDiskRadius, centerDiskHeight, faceTopY, matRaised, "central raised circular boss");

// Small circular collar around the pivot, under the hand
const centerDiskTopY = faceTopY + centerDiskHeight;
addCylinder(pivotCollarRadius, pivotCollarHeight, centerDiskTopY, matRaised, "small pivot collar");

// Thin clock hand / pointer extending toward the upper-right
const handTotalLength = handForwardLength + handBackLength;
const handCenterOffset = (handForwardLength - handBackLength) * 0.5;
const handCenterX = Math.sin(handClockwiseAngle) * handCenterOffset;
const handCenterZ = Math.cos(handClockwiseAngle) * handCenterOffset;
const handBottomY = centerDiskTopY + pivotCollarHeight + 0.015;
const handCenterY = handBottomY + handHeight * 0.5;

addBox(
  handWidth,
  handHeight,
  handTotalLength,
  handCenterX,
  handCenterY,
  handCenterZ,
  handClockwiseAngle,
  matPointer,
  "slender clock hand"
);

// Raised hub on top of the hand
const hubBottomY = handCenterY + handHeight * 0.12;
addCylinder(hubRadius, hubHeight, hubBottomY, matRaised, "central round pivot hub");
addCylinder(hubCapRadius, hubCapHeight, hubBottomY + hubHeight, matRaised, "small pivot cap");

// Camera adjusted to match the oblique top-down reference view
camera.position.set(13.5, 8.2, 13.5);
camera.lookAt(0, 0.7, 0);