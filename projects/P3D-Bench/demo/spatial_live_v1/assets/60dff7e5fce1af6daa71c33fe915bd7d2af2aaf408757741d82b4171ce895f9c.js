// ============================================================================
// Stylized multi-weapon tank (CAD / toy-like AFV)
// Interpretation of the reference:
// - Chunky tracked hull with rounded “loaf” body and stepped track fenders
// - Large spherical turret with oversized short gun, hydraulic lines, cheek pods
// - Commander’s cupola + spotlight/mortar, ribbed canister, whip antenna
// - Rear-deck ball-mount gatling, twin tubes and snorkel pipe
// - Christie-ish large end wheels plus road wheels, grouser pads on tracks
// ============================================================================

// ----- Parameters -----------------------------------------------------------
const TRACK_X = 2.22;
const TRACK_W = 1.32;
const CAP_R = 0.92;
const STRAIGHT = 5.15;          // length of track straight section
const HULL_W = 3.18;
const HULL_L = 5.75;
const HULL_H = 1.68;
const HULL_Y = 1.98;
const TURRET_R = 1.50;
const TURRET_Y = 3.12;
const TURRET_Z = 0.22;

// ----- Materials (single CAD grey, plus dark recesses) ----------------------
const mat = new THREE.MeshStandardMaterial({
  color: 0xc5c5c5,
  metalness: 0.38,
  roughness: 0.48
});
const matDark = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  metalness: 0.55,
  roughness: 0.4
});
const matTrack = new THREE.MeshStandardMaterial({
  color: 0xb3b3b3,
  metalness: 0.28,
  roughness: 0.62
});

// ----- Helpers --------------------------------------------------------------
function addBox(p, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0, m = mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  p.add(mesh);
  return mesh;
}
function addCyl(p, rTop, rBot, h, segs, x, y, z, rx = 0, ry = 0, rz = 0, m = mat) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segs), m);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  p.add(mesh);
  return mesh;
}
function addSphere(p, r, ws, hs, x, y, z, sx = 1, sy = 1, sz = 1, m = mat) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  p.add(mesh);
  return mesh;
}
function addTorus(p, r, tube, rSeg, tSeg, arc, x, y, z, rx = 0, ry = 0, rz = 0, m = mat) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, tube, rSeg, tSeg, arc), m);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  p.add(mesh);
  return mesh;
}
function addCylBetween(p, x1, y1, z1, x2, y2, z2, r, m = mat, segs = 8) {
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const len = Math.hypot(dx, dy, dz);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, segs), m);
  mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(dx, dy, dz).normalize()
  );
  p.add(mesh);
  return mesh;
}
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function makeWheel(radius, width, outerSign, sprocket = false) {
  const g = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 22), matTrack);
  tire.rotation.z = Math.PI / 2;
  g.add(tire);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.78, radius * 0.78, width * 0.55, 22), mat);
  face.rotation.z = Math.PI / 2;
  g.add(face);
  const ox = outerSign * (width * 0.5 + 0.01);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.30, radius * 0.30, 0.14, 14), mat);
  hub.rotation.z = Math.PI / 2;
  hub.position.x = ox;
  g.add(hub);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.13, radius * 0.13, 0.16, 12), mat);
  cap.rotation.z = Math.PI / 2;
  cap.position.x = ox + outerSign * 0.03;
  g.add(cap);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.70, 0.045, 6, 20), mat);
  rim.rotation.y = Math.PI / 2;
  rim.position.x = ox;
  g.add(rim);
  const rim2 = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.46, 0.035, 6, 16), mat);
  rim2.rotation.y = Math.PI / 2;
  rim2.position.x = ox;
  g.add(rim2);
  if (sprocket) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, width + 0.08, 8), matDark);
      hole.rotation.z = Math.PI / 2;
      hole.position.set(0, Math.sin(a) * radius * 0.52, Math.cos(a) * radius * 0.52);
      g.add(hole);
    }
  }
  return g;
}

// ----- Root -----------------------------------------------------------------
const tank = new THREE.Group();
scene.add(tank);

// ============================================================================
// TRACKS
// Solid stadium-shaped track pods, wheels on the outer face, stepped fenders
// ============================================================================
function buildTrack(side) {
  const track = new THREE.Group();
  track.position.x = side * TRACK_X;
  tank.add(track);

  const hl = STRAIGHT / 2; // cap centers at ±hl

  // Solid capsule body (box + end cylinders), sits on y=0
  addBox(track, TRACK_W, CAP_R * 2 - 0.08, STRAIGHT, 0, CAP_R, 0, 0, 0, 0, matTrack);
  addCyl(track, CAP_R, CAP_R, TRACK_W, 22, 0, CAP_R, hl, 0, 0, Math.PI / 2, matTrack);
  addCyl(track, CAP_R, CAP_R, TRACK_W, 22, 0, CAP_R, -hl, 0, 0, Math.PI / 2, matTrack);

  // Inner wall blending into hull
  addBox(track, 0.22, CAP_R * 1.55, STRAIGHT * 0.92, -side * (TRACK_W * 0.38), CAP_R + 0.12, 0);

  // Grousers along the bottom run
  for (let i = 0; i < 11; i++) {
    const z = -hl + 0.22 + i * ((STRAIGHT - 0.44) / 10);
    addBox(track, TRACK_W + 0.1, 0.11, 0.22, 0, 0.06, z, 0, 0, 0, matTrack);
  }
  // Grousers around front / rear caps
  for (const zc of [hl, -hl]) {
    const dir = Math.sign(zc);
    for (let i = 0; i <= 6; i++) {
      const a = dir > 0
        ? (-Math.PI / 2 + (i / 6) * Math.PI)
        : (Math.PI / 2 + (i / 6) * Math.PI);
      const rg = CAP_R + 0.06;
      const y = CAP_R + Math.sin(a) * rg;
      const z = zc + Math.cos(a) * rg;
      addBox(track, TRACK_W + 0.1, 0.11, 0.22, 0, y, z, -a, 0, 0, matTrack);
    }
  }

  // Large front idler + rear sprocket
  const wFront = makeWheel(0.86, 0.42, side, false);
  wFront.position.set(side * 0.28, CAP_R, hl);
  track.add(wFront);
  const wRear = makeWheel(0.86, 0.42, side, true);
  wRear.position.set(side * 0.28, CAP_R, -hl);
  track.add(wRear);

  // Road wheels (visible under the side skirt)
  const roadZ = [-1.55, -0.52, 0.50, 1.52];
  for (const z of roadZ) {
    const w = makeWheel(0.50, 0.36, side, false);
    w.position.set(side * 0.30, 0.52, z);
    track.add(w);
  }

  // Upper side skirt / fender deck
  addBox(track, TRACK_W + 0.18, 0.20, STRAIGHT + 0.15, side * 0.04, CAP_R * 2 - 0.02, 0);
  // Outer vertical lip
  addBox(track, 0.12, 0.62, STRAIGHT * 0.78, side * (TRACK_W * 0.52), CAP_R * 2 - 0.28, 0);

  // Stepped front fender (chunky angular armour from the reference)
  const fz = hl + 0.42;
  addBox(track, TRACK_W + 0.22, 0.78, 0.72, side * 0.06, 1.42, fz - 0.12);
  addBox(track, TRACK_W + 0.22, 0.22, 0.85, side * 0.06, 1.12, fz + 0.18, side * 0.0 + 0.42, 0, 0);
  addBox(track, TRACK_W + 0.18, 0.55, 0.28, side * 0.06, 1.15, fz + 0.38);
  addBox(track, TRACK_W + 0.10, 0.22, 0.55, side * 0.04, 0.58, fz + 0.05);

  // Matching rear fender
  const rz = -hl - 0.42;
  addBox(track, TRACK_W + 0.22, 0.78, 0.70, side * 0.06, 1.42, rz + 0.12);
  addBox(track, TRACK_W + 0.22, 0.22, 0.80, side * 0.06, 1.12, rz - 0.16, -0.42, 0, 0);
  addBox(track, TRACK_W + 0.18, 0.50, 0.26, side * 0.06, 1.15, rz - 0.36);
  addBox(track, TRACK_W + 0.10, 0.20, 0.50, side * 0.04, 0.55, rz - 0.02);

  // Hanging mud / skid plates under the sponson
  addBox(track, 0.42, 0.28, 0.62, side * 0.15, 0.22, 1.05);
  addBox(track, 0.42, 0.24, 0.50, side * 0.15, 0.20, -0.85);
}

buildTrack(1);
buildTrack(-1);

// ============================================================================
// HULL
// Rounded loaf body sitting between the track pods, turret ring on the roof
// ============================================================================
const hull = new THREE.Group();
tank.add(hull);

const hullShape = roundedRectShape(HULL_L, HULL_H, 0.74);
const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
  depth: HULL_W,
  bevelEnabled: true,
  bevelThickness: 0.10,
  bevelSize: 0.08,
  bevelSegments: 2,
  curveSegments: 10
});
hullGeo.translate(0, 0, -HULL_W / 2);
hullGeo.rotateY(Math.PI / 2);
const hullMesh = new THREE.Mesh(hullGeo, mat);
hullMesh.position.set(0, HULL_Y, 0.08);
hull.add(hullMesh);

// Slightly wider lower chassis / belly
addBox(hull, HULL_W + 0.15, 0.42, HULL_L * 0.82, 0, 1.22, 0.05);

// Front glacis / nose rounding (cylinder along X)
addCyl(hull, 0.72, 0.72, HULL_W * 0.92, 20, 0, 1.92, 2.55, 0, 0, Math.PI / 2);
addSphere(hull, 0.85, 16, 12, 0, 1.95, 2.35, 1.55, 0.72, 0.7);

// Rear rounding
addCyl(hull, 0.62, 0.62, HULL_W * 0.85, 18, 0, 1.88, -2.55, 0, 0, Math.PI / 2);

// Upper deck plates
addBox(hull, HULL_W * 0.92, 0.16, 2.2, 0, 2.72, -1.55);
addBox(hull, HULL_W * 0.55, 0.14, 1.1, 0, 2.78, 1.55);

// Turret ring / collar on the hull roof
addCyl(hull, 1.68, 1.68, 0.28, 32, 0, 2.78, TURRET_Z);
addTorus(hull, 1.62, 0.06, 8, 28, Math.PI * 2, 0, 2.92, TURRET_Z, Math.PI / 2, 0, 0);

// Driver visor slit on the nose
addBox(hull, 0.55, 0.14, 0.10, 0, 2.18, 2.78, 0, 0, 0, matDark);
addBox(hull, 0.70, 0.22, 0.12, 0, 2.18, 2.70);

// Front towing loops
addTorus(hull, 0.11, 0.035, 6, 10, Math.PI * 2, 0.55, 1.45, 2.72, 0, 0, 0);
addTorus(hull, 0.11, 0.035, 6, 10, Math.PI * 2, -0.55, 1.45, 2.72, 0, 0, 0);

// Side toolbox / exhaust housing (hull right)
addBox(hull, 0.55, 0.42, 0.85, 1.55, 1.72, 1.15);
addCyl(hull, 0.16, 0.16, 0.55, 12, 1.55, 2.05, 1.15, 0, 0, Math.PI / 2);

// Curved pipe on the forward hull (right)
addSphere(hull, 0.08, 8, 8, 1.35, 2.15, 1.85);
addCylBetween(hull, 1.35, 2.15, 1.85, 1.15, 1.72, 2.35, 0.07);
addSphere(hull, 0.08, 8, 8, 1.15, 1.72, 2.35);
addCylBetween(hull, 1.15, 1.72, 2.35, 0.75, 1.55, 2.55, 0.07);

// Travel lock / lamp under the gun
addCyl(hull, 0.13, 0.13, 0.42, 10, 0.0, 2.42, 2.35, Math.PI / 2, 0, 0);
addSphere(hull, 0.14, 10, 8, 0.0, 2.42, 2.55);

// Small hanging belly plates
addBox(hull, 0.55, 0.32, 0.7, 1.15, 0.55, 1.35);
addBox(hull, 0.55, 0.32, 0.7, -1.15, 0.55, 1.35);
addBox(hull, 0.50, 0.28, 0.55, 1.15, 0.50, -1.15);
addBox(hull, 0.50, 0.28, 0.55, -1.15, 0.50, -1.15);

// ============================================================================
// TURRET  (dome + collar + greebles)
// ============================================================================
const turret = new THREE.Group();
turret.position.set(0, TURRET_Y, TURRET_Z);
tank.add(turret);

// Main dome and lower collar
addSphere(turret, TURRET_R, 36, 28, 0, 0.05, 0);
addCyl(turret, TURRET_R * 0.98, TURRET_R * 1.02, 0.55, 32, 0, -0.22, 0);
addSphere(turret, TURRET_R * 0.92, 28, 18, 0, 0.15, 0, 1, 0.72, 1); // slightly flattened crown

// Top rear bustle / equipment deck
addBox(turret, 1.35, 0.32, 1.05, 0.05, 1.12, -0.72);

// ----- Main gun -------------------------------------------------------------
const gun = new THREE.Group();
gun.position.set(0, 0.02, 0);
turret.add(gun);

// Mantlet (thick cylindrical shield)
addCyl(gun, 0.72, 0.82, 0.78, 24, 0, 0.02, 1.28, Math.PI / 2, 0, 0);
addCyl(gun, 0.62, 0.62, 0.22, 20, 0, 0.02, 1.62, Math.PI / 2, 0, 0);

// Barrel (slight taper) + muzzle ring + dark bore
addCyl(gun, 0.40, 0.50, 1.85, 22, 0, 0.02, 2.55, Math.PI / 2, 0, 0);
addCyl(gun, 0.48, 0.48, 0.16, 20, 0, 0.02, 3.45, Math.PI / 2, 0, 0);
addCyl(gun, 0.52, 0.52, 0.10, 20, 0, 0.02, 3.52, Math.PI / 2, 0, 0);
addCyl(gun, 0.30, 0.30, 0.22, 16, 0, 0.02, 3.50, Math.PI / 2, 0, 0, matDark);
addTorus(gun, 0.50, 0.045, 8, 20, Math.PI * 2, 0, 0.02, 3.52, Math.PI / 2, 0, 0);

// Hydraulic / coolant pipes looping from turret cheeks to the mantlet
function addGunPipe(sx) {
  addSphere(gun, 0.09, 8, 8, sx * 0.95, -0.05, 0.85);
  addCylBetween(gun, sx * 0.95, -0.05, 0.85, sx * 0.78, -0.52, 1.15, 0.075);
  addSphere(gun, 0.09, 8, 8, sx * 0.78, -0.52, 1.15);
  addCylBetween(gun, sx * 0.78, -0.52, 1.15, sx * 0.55, -0.48, 1.55, 0.075);
  addSphere(gun, 0.09, 8, 8, sx * 0.55, -0.48, 1.55);
  addCylBetween(gun, sx * 0.55, -0.48, 1.55, sx * 0.48, -0.12, 1.72, 0.075);
  addSphere(gun, 0.085, 8, 8, sx * 0.48, -0.12, 1.72);
}
addGunPipe(1);
addGunPipe(-1);

// ----- Right cheek pod (box with two circular covers) -----------------------
addBox(turret, 0.92, 0.95, 1.18, 1.52, 0.08, 0.12);
addBox(turret, 0.18, 0.95, 1.18, 1.98, 0.08, 0.12);
addCyl(turret, 0.24, 0.24, 0.14, 16, 2.05, 0.32, 0.12, 0, 0, Math.PI / 2);
addCyl(turret, 0.24, 0.24, 0.14, 16, 2.05, -0.14, 0.12, 0, 0, Math.PI / 2);
addTorus(turret, 0.24, 0.04, 8, 16, Math.PI * 2, 2.10, 0.32, 0.12, 0, Math.PI / 2, 0);
addTorus(turret, 0.24, 0.04, 8, 16, Math.PI * 2, 2.10, -0.14, 0.12, 0, Math.PI / 2, 0);
addCyl(turret, 0.12, 0.12, 0.08, 12, 2.12, 0.32, 0.12, 0, 0, Math.PI / 2, matDark);
addCyl(turret, 0.12, 0.12, 0.08, 12, 2.12, -0.14, 0.12, 0, 0, Math.PI / 2, matDark);

// ----- Left cheek: three stacked circular disks -----------------------------
for (let i = 0; i < 3; i++) {
  addCyl(turret, 0.30, 0.30, 0.16, 16, -1.48, 0.22 - i * 0.08, 0.55 - i * 0.42, 0, 0, Math.PI / 2);
  addTorus(turret, 0.22, 0.035, 6, 14, Math.PI * 2, -1.56, 0.22 - i * 0.08, 0.55 - i * 0.42, 0, Math.PI / 2, 0);
}

// ----- Commander cupola + short weapon on a ring mount ----------------------
addCyl(turret, 0.52, 0.52, 0.22, 20, -0.12, 1.38, 0.42);
addTorus(turret, 0.48, 0.07, 8, 20, Math.PI * 2, -0.12, 1.50, 0.42, Math.PI / 2, 0, 0);
addCyl(turret, 0.20, 0.20, 0.16, 14, -0.12, 1.55, 0.42);

// Fat short barrel in a cradle (searchlight / mortar from the reference)
addBox(turret, 0.55, 0.16, 0.38, 0.08, 1.38, 0.92);
addCyl(turret, 0.12, 0.12, 0.42, 10, -0.18, 1.42, 0.92, 0, 0, Math.PI / 2);
addCyl(turret, 0.12, 0.12, 0.42, 10, 0.34, 1.42, 0.92, 0, 0, Math.PI / 2);
addCyl(turret, 0.30, 0.28, 0.62, 18, 0.08, 1.58, 1.05, 1.05, 0, 0);
addCyl(turret, 0.18, 0.18, 0.12, 14, 0.08, 1.78, 1.22, 1.05, 0, 0, matDark);

// ----- Ribbed vertical canister behind the cupola ---------------------------
const canX = -0.05, canZ = -0.55;
addCyl(turret, 0.22, 0.20, 1.05, 14, canX, 1.55, canZ);
addCyl(turret, 0.24, 0.24, 0.10, 14, canX, 1.10, canZ);
addCyl(turret, 0.22, 0.22, 0.08, 14, canX, 2.05, canZ);
addTorus(turret, 0.22, 0.03, 6, 14, Math.PI * 2, canX, 1.35, canZ, Math.PI / 2, 0, 0);
addTorus(turret, 0.21, 0.03, 6, 14, Math.PI * 2, canX, 1.65, canZ, Math.PI / 2, 0, 0);
addTorus(turret, 0.21, 0.03, 6, 14, Math.PI * 2, canX, 1.90, canZ, Math.PI / 2, 0, 0);

// Whip antenna with ball tip (tilted back) + thinner companion pole
addCyl(turret, 0.035, 0.025, 3.35, 6, 0.22, 2.85, -0.78, 0.22, 0, 0.05);
addSphere(turret, 0.07, 8, 8, 0.30, 4.48, -1.15);
addCyl(turret, 0.018, 0.014, 1.6, 5, 0.42, 2.35, -0.62, 0.35, 0, -0.1);

// Twin angled tubes on turret rear-right
addCyl(turret, 0.11, 0.11, 1.15, 10, 0.72, 1.55, -0.42, 0.55, 0.15, -0.25);
addCyl(turret, 0.11, 0.11, 1.15, 10, 0.95, 1.48, -0.28, 0.55, 0.15, -0.25);
addCyl(turret, 0.13, 0.13, 0.12, 10, 0.72, 1.05, -0.22, 0.55, 0.15, -0.25);
addCyl(turret, 0.13, 0.13, 0.12, 10, 0.95, 1.00, -0.08, 0.55, 0.15, -0.25);

// Bent snorkel / periscope pipe
addCyl(turret, 0.055, 0.055, 0.85, 8, 1.18, 1.45, -0.05);
addTorus(turret, 0.18, 0.055, 6, 10, Math.PI / 2, 1.18, 1.88, -0.05, 0, 0, Math.PI / 2);
addCyl(turret, 0.055, 0.055, 0.35, 8, 1.18, 2.06, 0.13, Math.PI / 2, 0, 0);

// Small lifting lugs on turret sides
addTorus(turret, 0.10, 0.03, 6, 10, Math.PI * 2, 0.9, 0.85, 0.9, 0, 0, Math.PI / 2);
addTorus(turret, 0.10, 0.03, 6, 10, Math.PI * 2, -0.9, 0.85, 0.9, 0, 0, Math.PI / 2);

// ============================================================================
// REAR DECK WEAPONS  (ball-mount gatling from the reference)
// ============================================================================
const rear = new THREE.Group();
rear.position.set(1.15, 2.85, -2.35);
tank.add(rear);

addSphere(rear, 0.38, 18, 14, 0, 0, 0);
addCyl(rear, 0.22, 0.28, 0.28, 12, 0, -0.28, 0); // pedestal

const gatling = new THREE.Group();
gatling.position.set(0.05, 0.18, -0.05);
gatling.rotation.set(0.72, 0.15, -0.35); // up and back
rear.add(gatling);

addCyl(gatling, 0.20, 0.20, 0.22, 14, 0, 0.12, 0);
addCyl(gatling, 0.22, 0.22, 0.10, 14, 0, 0.28, 0);

const nBar = 6;
const bundleR = 0.105;
for (let i = 0; i < nBar; i++) {
  const a = (i / nBar) * Math.PI * 2;
  addCyl(gatling, 0.042, 0.042, 1.28, 8, Math.cos(a) * bundleR, 0.92, Math.sin(a) * bundleR);
  addCyl(gatling, 0.028, 0.028, 0.08, 6, Math.cos(a) * bundleR, 1.56, Math.sin(a) * bundleR, 0, 0, 0, matDark);
}
addCyl(gatling, 0.175, 0.175, 0.10, 14, 0, 0.55, 0);
addCyl(gatling, 0.175, 0.175, 0.08, 14, 0, 1.42, 0);
addTorus(gatling, 0.175, 0.03, 6, 14, Math.PI * 2, 0, 1.42, 0, Math.PI / 2, 0, 0);

// Extra rear-deck tubes (left of gatling)
addCyl(hull, 0.10, 0.10, 0.95, 10, 0.35, 3.15, -2.15, 0.45, 0, 0.2);
addCyl(hull, 0.08, 0.08, 0.70, 8, 0.55, 3.05, -1.95, 0.35, 0, 0.35);

// ============================================================================
// Camera – 3/4 front-right elevated view matching the reference
// ============================================================================
camera.position.set(9.2, 7.4, 10.4);
camera.lookAt(0, 2.15, 0.15);