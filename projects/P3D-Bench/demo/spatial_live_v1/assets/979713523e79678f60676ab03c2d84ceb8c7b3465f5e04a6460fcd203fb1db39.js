// ============================================================================
//  Chibi "Super Vehicle" battle tank  (Metal Slug SV-001 flavour)
//  ---------------------------------------------------------------------------
//  Interpretation of the reference render:
//    * short & wide hull carried by two stadium shaped tracks with big road wheels
//    * toothed / stepped armour skirts above the tracks
//    * large round dome turret carrying a stubby big-bore cannon with a
//      wide hollow muzzle
//    * side mounted gatling gun on a ball mount, small auto-cannon,
//      sensor box, roof mini-turret, multi-tube launcher, two antennae
//  +Z = front of the tank, +X = right side, +Y = up, ground plane at y = 0
// ============================================================================

// ------------------------------------------------------------- MATERIALS ---
const matBody = new THREE.MeshStandardMaterial({ color: 0xc4c9ce, metalness: 0.25, roughness: 0.55 });
const matPart = new THREE.MeshStandardMaterial({ color: 0xb2b8be, metalness: 0.30, roughness: 0.50 });
const matTrim = new THREE.MeshStandardMaterial({ color: 0x99a0a6, metalness: 0.35, roughness: 0.55 });
const matBore = new THREE.MeshStandardMaterial({ color: 0x4c5055, metalness: 0.20, roughness: 0.85 });

// ------------------------------------------------------------ PARAMETERS ---
const HULL_W  = 13.0;                              // hull width   (X)
const HULL_L  = 24.0;                              // hull length  (Z)
const HULL_H  = 7.5;                               // hull height  (Y)

const TRACK_R = 4.4;                               // radius of the rounded track ends
const TRACK_L = 25.0;                              // overall track length
const TRACK_W = 4.2;                               // track width
const TRACK_X = HULL_W / 2 + TRACK_W / 2 - 0.5;    // track centre line (X)
const TRACK_Y = TRACK_R;                           // axle height -> belt touches y = 0

const HULL_Y  = TRACK_Y + 1.7;                     // hull centre height
const DECK_Y  = HULL_Y + HULL_H / 2;               // top deck / turret ring height

const DOME_R  = 6.4;                               // turret dome radius
const DOME_SY = 0.82;                              // dome vertical squash

// -------------------------------------------------------------- HELPERS ----
// Box with rounded vertical corners (rounded in XY, bevelled along Z)
function roundedBoxGeo(w, h, d, r) {
  const bev = Math.min(0.3, d * 0.22, w * 0.12, h * 0.12);
  const sw = w - 2 * bev, sh = h - 2 * bev;
  const sr = Math.max(0.05, Math.min(r - bev, sw / 2 - 0.02, sh / 2 - 0.02));
  const x = sw / 2 - sr, y = sh / 2 - sr;
  const s = new THREE.Shape();
  s.moveTo(-x, -sh / 2);
  s.lineTo(x, -sh / 2);
  s.absarc(x, -y, sr, -Math.PI / 2, 0, false);
  s.lineTo(sw / 2, y);
  s.absarc(x, y, sr, 0, Math.PI / 2, false);
  s.lineTo(-x, sh / 2);
  s.absarc(-x, y, sr, Math.PI / 2, Math.PI, false);
  s.lineTo(-sw / 2, -y);
  s.absarc(-x, -y, sr, Math.PI, Math.PI * 1.5, false);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: d - 2 * bev, bevelEnabled: true, bevelSize: bev,
    bevelThickness: bev, bevelSegments: 2, curveSegments: 6
  });
  g.translate(0, 0, -(d - 2 * bev) / 2);
  return g;
}

// Real hollow tube (open bore at both ends) – used for gun muzzles / barrels
function hollowTubeGeo(rIn, rOut, len, seg = 18) {
  const pts = [
    new THREE.Vector2(rIn, 0), new THREE.Vector2(rIn, len),
    new THREE.Vector2(rOut, len), new THREE.Vector2(rOut, 0),
    new THREE.Vector2(rIn, 0)
  ];
  const g = new THREE.LatheGeometry(pts, seg);
  g.translate(0, -len / 2, 0);
  return g;
}

function addMesh(parent, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

// cylinder whose axis lies along Z
function zCyl(rt, rb, h, seg, mat) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.rotation.x = Math.PI / 2;
  return m;
}
// cylinder whose axis lies along X
function xCyl(rt, rb, h, seg, mat) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.rotation.z = Math.PI / 2;
  return m;
}

const tank = new THREE.Group();
scene.add(tank);

// ============================================================================
//  RUNNING GEAR : belt, tread blocks, road wheels
// ============================================================================
function buildTrack(sign) {
  const g = new THREE.Group();
  const half = TRACK_L / 2 - TRACK_R;              // half distance between end centres

  // ---- belt body : stadium profile extruded across the tank ----------------
  const shape = new THREE.Shape();
  shape.absarc( half, 0, TRACK_R, -Math.PI / 2,  Math.PI / 2, false);
  shape.absarc(-half, 0, TRACK_R,  Math.PI / 2,  Math.PI * 1.5, false);
  shape.closePath();
  const belt = new THREE.ExtrudeGeometry(shape, {
    depth: TRACK_W, bevelEnabled: true, bevelSize: 0.30,
    bevelThickness: 0.30, bevelSegments: 2, curveSegments: 22
  });
  belt.translate(0, 0, -TRACK_W / 2);
  belt.rotateY(Math.PI / 2);                       // profile -> ZY plane, extrusion -> X
  g.add(new THREE.Mesh(belt, matPart));

  // ---- tread blocks distributed along the belt perimeter -------------------
  const nT = 30;
  const straight = 2 * half, arc = Math.PI * TRACK_R;
  const total = 2 * straight + 2 * arc;
  const blockGeo = new THREE.BoxGeometry(TRACK_W + 0.7, 0.6, 1.15);
  for (let i = 0; i < nT; i++) {
    const s = (i / nT) * total;
    let px, py, ang;
    if (s < straight) {                            // bottom run
      px = -half + s; py = -TRACK_R; ang = 0;
    } else if (s < straight + arc) {               // front wheel arc
      const a = (s - straight) / TRACK_R - Math.PI / 2;
      px = half + TRACK_R * Math.cos(a); py = TRACK_R * Math.sin(a); ang = a + Math.PI / 2;
    } else if (s < 2 * straight + arc) {           // top run
      const d = s - straight - arc;
      px = half - d; py = TRACK_R; ang = Math.PI;
    } else {                                       // rear wheel arc
      const a = (s - 2 * straight - arc) / TRACK_R + Math.PI / 2;
      px = -half + TRACK_R * Math.cos(a); py = TRACK_R * Math.sin(a); ang = a + Math.PI / 2;
    }
    const nx = Math.sin(ang), ny = -Math.cos(ang); // outward normal in the profile plane
    const b = new THREE.Mesh(blockGeo, matTrim);
    b.position.set(0, py + ny * 0.22, px + nx * 0.22);
    b.rotation.x = -ang;
    g.add(b);
  }

  // ---- road wheels on the outer face ---------------------------------------
  const faceX = sign * (TRACK_W / 2 + 0.05);
  function wheel(zPos, rad) {
    const w = new THREE.Group();
    const disc = xCyl(rad, rad, 0.8, 22, matPart); w.add(disc);
    const rim  = xCyl(rad * 0.88, rad * 0.88, 1.1, 22, matTrim); w.add(rim);
    const hub  = xCyl(rad * 0.30, rad * 0.30, 1.5, 14, matPart); w.add(hub);
    addMesh(w, new THREE.CylinderGeometry(rad * 0.13, rad * 0.13, 1.8, 10), matTrim)
      .rotation.z = Math.PI / 2;
    for (let i = 0; i < 5; i++) {                  // bolt / lightening holes
      const a = (i / 5) * Math.PI * 2 + 0.3;
      const bolt = xCyl(rad * 0.11, rad * 0.11, 1.4, 8, matTrim);
      bolt.position.set(0, Math.sin(a) * rad * 0.58, Math.cos(a) * rad * 0.58);
      w.add(bolt);
    }
    w.position.set(faceX + sign * 0.25, 0, zPos);
    return w;
  }
  g.add(wheel(0,      3.05));                      // big centre road wheel
  g.add(wheel( half,  3.30));                      // front idler
  g.add(wheel(-half,  3.30));                      // rear sprocket

  g.position.set(sign * TRACK_X, TRACK_Y, 0);
  return g;
}
tank.add(buildTrack( 1));
tank.add(buildTrack(-1));

// ============================================================================
//  ARMOUR SKIRTS  (stepped / toothed plates above each track)
// ============================================================================
function buildSkirt(sign) {
  const g = new THREE.Group();
  const topY = TRACK_Y + TRACK_R;

  // continuous fender over the middle of the track
  addMesh(g, roundedBoxGeo(TRACK_W + 1.8, 0.8, TRACK_L * 0.5, 0.3), matBody,
          sign * (TRACK_X + 0.3), topY + 0.55, 0);

  // fanned "teeth" toward the front and the rear
  for (const dir of [1, -1]) {
    for (let i = 0; i < 3; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(TRACK_W + 1.4 + i * 0.5, 0.55, 3.2), matBody);
      fin.position.set(sign * (TRACK_X + 0.45 + i * 0.45),
                       topY + 0.2 + i * 1.05,
                       dir * (TRACK_L * 0.24 + i * 1.25));
      fin.rotation.set(dir * 0.42, 0, -sign * 0.20);
      g.add(fin);
    }
    // wedge shaped end cap of the skirt
    const wedge = new THREE.Mesh(new THREE.BoxGeometry(TRACK_W + 1.0, 3.6, 1.0), matBody);
    wedge.position.set(sign * (TRACK_X + 0.3), topY - 1.4, dir * (TRACK_L * 0.42));
    wedge.rotation.x = dir * 0.38;
    g.add(wedge);
  }
  return g;
}
tank.add(buildSkirt( 1));
tank.add(buildSkirt(-1));

// ============================================================================
//  HULL
// ============================================================================
const hull = new THREE.Group();
hull.position.set(0, HULL_Y, 0);
tank.add(hull);

// main body (rounded top / bottom edges, bevelled nose & tail)
addMesh(hull, roundedBoxGeo(HULL_W, HULL_H, HULL_L, 1.7), matBody, 0, 0, 0);

// raised top deck plate in front of the turret
addMesh(hull, roundedBoxGeo(8.5, 0.8, 5.0, 0.6), matPart, 0, HULL_H / 2 + 0.15, 6.2);

// front trim band, small hatch and lower louvres
addMesh(hull, new THREE.BoxGeometry(HULL_W - 1.0, 1.0, 0.6), matPart, 0, 1.4, HULL_L / 2 + 0.15);
addMesh(hull, roundedBoxGeo(2.4, 1.5, 0.5, 0.25), matTrim, -1.2, 0.1, HULL_L / 2 + 0.25);
for (let i = 0; i < 6; i++) {
  addMesh(hull, new THREE.BoxGeometry(0.95, 2.8, 0.55), matTrim,
          -4.4 + i * 1.5, -1.9, HULL_L / 2 + 0.2);
}
// rear plate
addMesh(hull, roundedBoxGeo(HULL_W - 1.5, 4.0, 0.8, 0.4), matPart, 0, -0.6, -HULL_L / 2 - 0.15);

// stubby pipe / launcher tube on the front deck (left of the turret)
const frontPipe = new THREE.Group();
frontPipe.position.set(-3.0, HULL_H / 2 + 0.6, 6.6);
frontPipe.rotation.set(-1.05, 0.25, 0);
addMesh(frontPipe, new THREE.CylinderGeometry(0.95, 0.95, 3.6, 16), matPart, 0, 0, 0);
addMesh(frontPipe, new THREE.SphereGeometry(0.95, 16, 10), matPart, 0, 1.8, 0);
hull.add(frontPipe);

// ============================================================================
//  TURRET  (origin sits on the deck, y = 0 is the turret ring)
// ============================================================================
const turret = new THREE.Group();
turret.position.set(0, DECK_Y, -0.6);
tank.add(turret);

// turret ring / collar
addMesh(turret, new THREE.CylinderGeometry(6.2, 6.5, 1.3, 32), matPart, 0, 0.45, 0);

// main dome (squashed half sphere)
const dome = addMesh(turret,
  new THREE.SphereGeometry(DOME_R, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2), matBody, 0, 1.0, 0);
dome.scale.set(1.0, DOME_SY, 0.97);
const DOME_TOP = 1.0 + DOME_R * DOME_SY;           // ~6.25

// roof hatch : raised pad + smaller plate
addMesh(turret, roundedBoxGeo(6.0, 0.9, 4.2, 0.5), matPart, 0, DOME_TOP - 0.35, 0.6);
addMesh(turret, roundedBoxGeo(4.2, 0.4, 2.4, 0.3), matTrim, 0, DOME_TOP + 0.3, 0.6);

// grab handle on the left flank of the dome
const handleCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4.6, 4.6,  1.4),
  new THREE.Vector3(-5.9, 3.2,  2.6),
  new THREE.Vector3(-5.6, 1.4,  4.0),
  new THREE.Vector3(-4.0, 0.8,  4.8)
]);
turret.add(new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 24, 0.22, 8, false), matTrim));

// ----------------------------------------------------------- MAIN CANNON ---
const gun = new THREE.Group();
gun.position.set(0, 2.5, 0);
turret.add(gun);

addMesh(gun, new THREE.SphereGeometry(3.4, 24, 16), matBody, 0, 0, 4.4).scale.set(1, 0.95, 0.7);
gun.add(zCyl(2.9, 3.1, 2.0, 24, matPart)).position.z = 5.9;   // mantlet
gun.add(zCyl(3.25, 3.25, 0.7, 24, matTrim)).position.z = 6.6; // flange ring
gun.add(zCyl(1.75, 1.9, 8.6, 24, matPart)).position.z = 10.9; // barrel

// wide hollow muzzle
const muzzle = new THREE.Mesh(hollowTubeGeo(1.78, 2.25, 3.0, 16), matPart);
muzzle.rotation.x = Math.PI / 2;
muzzle.position.z = 16.0;
gun.add(muzzle);
gun.add(zCyl(2.35, 2.35, 0.5, 16, matTrim)).position.z = 14.6;

// ------------------------------------------------------------- GATLING -----
function buildGatling() {
  const g = new THREE.Group();
  const ring = 0.95, bR = 0.36, len = 7.6;
  g.add(zCyl(1.55, 1.7, 2.2, 18, matPart)).position.z = -0.7;   // breech
  for (let i = 0; i < 6; i++) {                                  // outer barrels
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const b = new THREE.Mesh(hollowTubeGeo(bR * 0.55, bR, len, 10), matPart);
    b.rotation.x = Math.PI / 2;
    b.position.set(Math.cos(a) * ring, Math.sin(a) * ring, len / 2);
    g.add(b);
  }
  const c = new THREE.Mesh(hollowTubeGeo(bR * 0.55, bR, len, 10), matPart);  // centre barrel
  c.rotation.x = Math.PI / 2; c.position.z = len / 2; g.add(c);
  [1.3, len - 1.6].forEach(z => {                                // clamp rings
    g.add(zCyl(ring + bR + 0.15, ring + bR + 0.15, 0.55, 18, matTrim)).position.z = z;
  });
  return g;
}
const gatMount = new THREE.Group();
gatMount.position.set(4.8, 3.4, 2.2);
addMesh(gatMount, new THREE.SphereGeometry(1.85, 20, 14), matBody, 0, 0, 0);
const gat = buildGatling();
gat.rotation.set(-0.34, 0.22, 0);
gatMount.add(gat);
turret.add(gatMount);

// -------------------------------------------------- SMALL AUTO-CANNON ------
const autoCannon = new THREE.Group();
autoCannon.position.set(2.3, 4.6, 2.6);
autoCannon.rotation.set(-0.38, -0.10, 0);
addMesh(autoCannon, roundedBoxGeo(1.7, 1.6, 2.0, 0.4), matPart, 0, 0, 0);
autoCannon.add(zCyl(0.62, 0.78, 6.4, 16, matPart)).position.z = 3.6;
autoCannon.add(zCyl(0.85, 0.85, 0.7, 16, matTrim)).position.z = 6.4;
turret.add(autoCannon);

// bent pipe / grab hook next to the auto-cannon
const pipeCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2.9, 3.4, 3.6),
  new THREE.Vector3(3.1, 5.0, 3.5),
  new THREE.Vector3(3.3, 6.0, 2.9),
  new THREE.Vector3(2.6, 6.2, 2.0)
]);
turret.add(new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 24, 0.22, 8, false), matTrim));

// ---------------------------------------------------------- SENSOR BOX -----
const sensor = new THREE.Group();
sensor.position.set(4.9, 0.9, 1.9);
sensor.rotation.y = -0.12;
addMesh(sensor, roundedBoxGeo(3.4, 3.4, 3.2, 0.5), matBody, 0, 0, 0);
sensor.add(xCyl(0.75, 0.75, 0.9, 16, matTrim)).position.set(1.9, 0.75, 0.3);
sensor.add(xCyl(0.60, 0.60, 0.9, 16, matTrim)).position.set(1.9, -0.9, 0.3);
turret.add(sensor);

// --------------------------------------------------- ROOF MINI TURRET ------
const mini = new THREE.Group();
mini.position.set(-2.7, DOME_TOP - 0.9, 2.4);
mini.rotation.set(-0.18, -0.95, 0);
addMesh(mini, new THREE.CylinderGeometry(1.0, 1.2, 1.2, 16), matPart, 0, -0.6, 0);   // pedestal
addMesh(mini, roundedBoxGeo(0.6, 2.4, 2.2, 0.25), matPart, -1.6, 0.4, 0);            // yoke
addMesh(mini, roundedBoxGeo(0.6, 2.4, 2.2, 0.25), matPart,  1.6, 0.4, 0);
const drum = new THREE.Mesh(hollowTubeGeo(1.05, 1.45, 3.4, 18), matPart);            // open drum
drum.rotation.x = Math.PI / 2;
drum.position.set(0, 0.5, 0.7);
mini.add(drum);
mini.add(zCyl(1.55, 1.55, 0.6, 18, matTrim)).position.set(0, 0.5, -0.6);
turret.add(mini);

// ------------------------------------------------- MULTI-TUBE LAUNCHER -----
const launcher = new THREE.Group();
launcher.position.set(-2.0, DOME_TOP - 1.4, -2.4);
launcher.rotation.set(0.16, 0, -0.13);
const tubeLen = 5.6, tubeR = 0.42, tubeRing = 0.9;
for (let i = 0; i < 6; i++) {
  const a = (i / 6) * Math.PI * 2;
  const t = new THREE.Mesh(hollowTubeGeo(tubeR * 0.6, tubeR, tubeLen, 10), matPart);
  t.position.set(Math.cos(a) * tubeRing, tubeLen / 2, Math.sin(a) * tubeRing);
  launcher.add(t);
}
addMesh(launcher, hollowTubeGeo(tubeR * 0.6, tubeR, tubeLen, 10), matPart, 0, tubeLen / 2, 0);
[1.0, tubeLen - 1.1].forEach(y =>
  addMesh(launcher, new THREE.CylinderGeometry(tubeRing + tubeR + 0.14, tubeRing + tubeR + 0.14, 0.55, 18), matTrim, 0, y, 0));
addMesh(launcher, new THREE.CylinderGeometry(1.5, 1.7, 1.0, 18), matPart, 0, 0.1, 0);
turret.add(launcher);

// ------------------------------------------------------------- ANTENNAE ----
// long whip antenna
const ant = new THREE.Group();
ant.position.set(-0.4, DOME_TOP - 0.6, -3.4);
ant.rotation.set(0.10, 0, 0.14);
addMesh(ant, new THREE.CylinderGeometry(0.16, 0.16, 1.2, 10), matTrim, 0, 0.6, 0);   // base
addMesh(ant, new THREE.CylinderGeometry(0.05, 0.17, 15.5, 8), matTrim, 0, 8.9, 0);   // tapered whip
addMesh(ant, new THREE.SphereGeometry(0.16, 10, 8), matTrim, 0, 16.7, 0);            // tip bead
turret.add(ant);

// short bent antenna / sensor rod
const rodCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.9, DOME_TOP - 0.6, -2.2),
  new THREE.Vector3(1.1, DOME_TOP + 3.0, -1.9),
  new THREE.Vector3(1.5, DOME_TOP + 6.0, -1.0),
  new THREE.Vector3(2.6, DOME_TOP + 7.6,  0.2)
]);
turret.add(new THREE.Mesh(new THREE.TubeGeometry(rodCurve, 30, 0.12, 7, false), matTrim));

// small rear boxes on the turret shoulders
addMesh(turret, roundedBoxGeo(3.0, 1.2, 2.2, 0.35), matPart,  3.4, 4.3, -2.6);
addMesh(turret, roundedBoxGeo(2.6, 1.0, 2.0, 0.35), matPart, -4.0, 3.3, -3.0);

// ============================================================================
//  VIEW
// ============================================================================
camera.position.set(38, 30, 44);
camera.lookAt(0, 9, 0);
if (typeof controls !== 'undefined' && controls && controls.target) {
  controls.target.set(0, 9, 0);
  controls.update();
}