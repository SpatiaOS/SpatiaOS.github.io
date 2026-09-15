// =====================================================================
//  Cartoon Battle Tank — parametric Three.js reconstruction
//  Axes:  Y = up | -Z = front | +Z = rear | ±X = left / right flanks
//  Camera is framed from the front-left like the reference render:
//  main gun pointing to the lower-left, gatling mount on the flank.
// =====================================================================

// ----------------------------- Materials -----------------------------
const bodyMat  = new THREE.MeshStandardMaterial({ color: 0xc3c7cc, roughness: 0.5,  metalness: 0.25 });
const steelMat = new THREE.MeshStandardMaterial({ color: 0x8f959c, roughness: 0.42, metalness: 0.5  });
const darkMat  = new THREE.MeshStandardMaterial({ color: 0x50555b, roughness: 0.6,  metalness: 0.4  });

// ---------------------------- Parameters -----------------------------
// Hull — extruded side profile with chamfered deck edges (cartoon slab look)
const HULL_L = 10.4;        // length, front to rear
const HULL_W = 7.2;         // width across
const HULL_BOT = 1.0;       // underside height
const HULL_TOP = 4.2;       // deck height
const HULL_CHAMFER = 0.95;  // deck edge chamfer

// Running gear
const TRACK_L = 10.6;       // track loop length
const TRACK_H = 3.3;        // track loop height
const TRACK_R = 1.05;       // loop corner radius
const TRACK_W = 1.7;        // track width
const TRACK_T = 0.55;       // ring band thickness
const TRACK_X = 3.85;       // track centerline offset from center
const TRACK_Y = 1.9;        // track loop center height
const WHEEL_R = 1.05;       // road wheel radius

// Turret
const DOME_R = 3.1;         // dome radius
const DOME_C = new THREE.Vector3(0, 5.0, -0.3); // dome center

// ----------------------------- Helpers -------------------------------
function add(mesh, x = 0, y = 0, z = 0) { mesh.position.set(x, y, z); scene.add(mesh); return mesh; }
function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function cyl(rT, rB, h, seg, mat, axis = 'y') {
  const g = new THREE.CylinderGeometry(rT, rB, h, seg);
  if (axis === 'x') g.rotateZ(Math.PI / 2);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  return new THREE.Mesh(g, mat);
}
// thin rod / antenna from point A to point B
function rod(r, from, to, mat, seg = 8) {
  const f = new THREE.Vector3(...from), t = new THREE.Vector3(...to);
  const g = new THREE.CylinderGeometry(r, r, f.distanceTo(t), seg);
  g.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(g, mat);
  m.position.copy(f).lerp(t, 0.5);
  m.lookAt(t);
  scene.add(m);
  return m;
}
function roundedRectPath(w, h, r, path) {
  const x = w / 2, y = h / 2;
  path.moveTo(-x + r, -y);
  path.lineTo(x - r, -y);
  path.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  path.lineTo(x, y - r);
  path.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  path.lineTo(-x + r, y);
  path.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  path.lineTo(-x, -y + r);
  path.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  return path;
}

// ------------------------------- Hull --------------------------------
// Side profile (flat bottom, vertical sides, chamfered top edges),
// extruded across the tank width with a small bevel for rounded edges.
(function buildHull() {
  const s = new THREE.Shape();
  const hl = HULL_L / 2, ch = HULL_CHAMFER;
  s.moveTo(-hl, HULL_BOT);
  s.lineTo(hl, HULL_BOT);
  s.lineTo(hl, HULL_TOP - ch);
  s.lineTo(hl - ch, HULL_TOP);
  s.lineTo(-hl + ch, HULL_TOP);
  s.lineTo(-hl, HULL_TOP - ch);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: HULL_W, bevelEnabled: true,
    bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 3
  });
  g.translate(0, 0, -HULL_W / 2);
  g.rotateY(-Math.PI / 2);              // profile length -> world Z, extrusion -> world X
  add(new THREE.Mesh(g, bodyMat));
})();

// Front dozer blade + bolts + tow nubs
add(box(7.6, 1.6, 0.7, bodyMat), 0, 1.85, -5.5);
for (const bx of [-2.8, -1.4, 0, 1.4, 2.8])
  for (const by of [1.45, 2.2])
    add(cyl(0.1, 0.1, 0.14, 10, steelMat, 'z'), bx, by, -5.88);
add(cyl(0.2, 0.2, 0.5, 12, steelMat, 'z'),  2.4, 3.1, -5.5);
add(cyl(0.2, 0.2, 0.5, 12, steelMat, 'z'), -2.4, 3.1, -5.5);

// Rear plate + bolts
add(box(7.6, 1.3, 0.6, bodyMat), 0, 2.05, 5.5);
for (const bx of [-1.5, 1.5])
  for (const by of [1.7, 2.4])
    add(cyl(0.1, 0.1, 0.14, 10, steelMat, 'z'), bx, by, 5.82);

// --------------------------- Running gear ----------------------------
// Hollow track loop (rounded-rectangle ring, extruded across width)
(function buildTrackLoop() {
  const shape = roundedRectPath(TRACK_L, TRACK_H, TRACK_R, new THREE.Shape());
  shape.holes.push(roundedRectPath(
    TRACK_L - 2 * TRACK_T, TRACK_H - 2 * TRACK_T,
    Math.max(0.2, TRACK_R - TRACK_T), new THREE.Path()
  ));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: TRACK_W, bevelEnabled: true,
    bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 20
  });
  g.translate(0, 0, -TRACK_W / 2);
  g.rotateY(-Math.PI / 2);
  for (const side of [-1, 1]) add(new THREE.Mesh(g, darkMat), side * TRACK_X, TRACK_Y, 0);
})();

// Track links — small pads placed evenly along the loop perimeter
(function placeTrackLinks() {
  const L = TRACK_L, H = TRACK_H, r = TRACK_R, segs = [];
  const line = (x1, y1, x2, y2) => {
    const len = Math.hypot(x2 - x1, y2 - y1), th = Math.atan2(y2 - y1, x2 - x1);
    segs.push({ len, at: s => ({ x: x1 + (x2 - x1) * s / len, y: y1 + (y2 - y1) * s / len, th }) });
  };
  const arc = (cx, cy, a1, a2) => {
    const len = r * (a2 - a1);
    segs.push({ len, at: s => {
      const a = a1 + (a2 - a1) * s / len;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), th: a + Math.PI / 2 };
    }});
  };
  line(-L/2 + r, -H/2,  L/2 - r, -H/2);
  arc ( L/2 - r, -H/2 + r, -Math.PI/2, 0);
  line( L/2, -H/2 + r,  L/2,  H/2 - r);
  arc ( L/2 - r,  H/2 - r, 0,  Math.PI/2);
  line( L/2 - r,  H/2, -L/2 + r,  H/2);
  arc (-L/2 + r,  H/2 - r,  Math.PI/2, Math.PI);
  line(-L/2,  H/2 - r, -L/2, -H/2 + r);
  arc (-L/2 + r, -H/2 + r,  Math.PI, Math.PI * 1.5);

  const P = segs.reduce((s, g) => s + g.len, 0);
  const n = Math.floor(P / 0.56);
  const linkGeo = new THREE.BoxGeometry(TRACK_W + 0.28, 0.34, 0.56);
  for (const side of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      let d = (i + 0.5) * P / n, seg = segs[segs.length - 1];
      for (const g of segs) { if (d <= g.len) { seg = g; break; } d -= g.len; }
      const p = seg.at(Math.min(d, seg.len));
      const nx = Math.sin(p.th), ny = -Math.cos(p.th);  // outward normal of loop
      const m = new THREE.Mesh(linkGeo, bodyMat);
      m.position.set(side * TRACK_X, TRACK_Y + p.y + ny * 0.12, p.x);
      m.rotation.x = -p.th;
      scene.add(m);
    }
  }
})();

// Spoked road wheels + small return rollers
function makeRoadWheel(r) {
  const g = new THREE.Group();
  g.add(cyl(r, r, 0.52, 28, darkMat, 'x'));                 // tire
  g.add(cyl(r * 0.7, r * 0.7, 0.58, 28, bodyMat, 'x'));     // face disc
  g.add(cyl(r * 0.26, r * 0.26, 0.7, 16, darkMat, 'x'));    // hub
  for (let i = 0; i < 6; i++) {                             // spokes
    const a = i / 6 * Math.PI * 2;
    const sp = box(0.5, r * 0.62, 0.16, bodyMat);
    sp.rotation.x = a;
    sp.position.set(0, Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42);
    g.add(sp);
  }
  return g;
}
for (const side of [-1, 1]) {
  for (const wz of [-3.5, -1.17, 1.17, 3.5]) {
    const w = makeRoadWheel(WHEEL_R);
    w.position.set(side * TRACK_X, TRACK_Y - TRACK_H / 2 + WHEEL_R + 0.02, wz);
    scene.add(w);
  }
  for (const rz of [-2.4, 2.4]) {
    const roller = cyl(0.3, 0.3, 0.45, 14, darkMat, 'x');
    roller.position.set(side * TRACK_X, TRACK_Y + TRACK_H / 2 - TRACK_T - 0.32, rz);
    scene.add(roller);
  }
  // sloped armor wedges at the ends of each track + top fender
  const fw = box(1.95, 3.1, 1.4, bodyMat);
  fw.position.set(side * TRACK_X, 2.15, -4.75); fw.rotation.x = -0.55; scene.add(fw);
  const rw = box(1.95, 3.1, 1.4, bodyMat);
  rw.position.set(side * TRACK_X, 2.15,  4.75); rw.rotation.x =  0.55; scene.add(rw);
  add(box(1.95, 0.28, 8.2, bodyMat), side * TRACK_X, 3.85, 0);
}

// ------------------------- Deck details ------------------------------
// Driver hatch plate with hinges (front deck, right of dome)
add(box(1.7, 0.2, 2.3, bodyMat), 1.7, 4.33, -3.2);
add(cyl(0.12, 0.12, 0.55, 10, steelMat, 'x'), 1.15, 4.44, -4.32);
add(cyl(0.12, 0.12, 0.55, 10, steelMat, 'x'), 2.25, 4.44, -4.32);

// Stowage box with two round ports on the left flank
add(box(0.55, 1.1, 1.7, bodyMat), -3.72, 4.72, 1.6);
add(cyl(0.2, 0.2, 0.16, 14, darkMat, 'x'), -4.02, 4.95, 1.25);
add(cyl(0.2, 0.2, 0.16, 14, darkMat, 'x'), -4.02, 4.55, 1.95);

// ----------------------------- Turret --------------------------------
// Tapered skirt + half-sphere dome + seam trim ring
add(cyl(3.05, 3.45, 1.0, 40, bodyMat), DOME_C.x, DOME_C.y - 0.45, DOME_C.z);
add(new THREE.Mesh(new THREE.SphereGeometry(DOME_R, 48, 28, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat),
    DOME_C.x, DOME_C.y, DOME_C.z);
const trim = new THREE.Mesh(new THREE.TorusGeometry(DOME_R, 0.09, 12, 48), steelMat);
trim.rotation.x = Math.PI / 2;
add(trim, DOME_C.x, DOME_C.y + 0.02, DOME_C.z);

// Commander hatch on dome top (base plate, lid, two hinges)
const hatch = new THREE.Group();
hatch.position.set(0, 7.9, 0.25);
hatch.add(box(2.75, 0.35, 2.05, bodyMat));
const lid = box(2.5, 0.28, 1.85, bodyMat); lid.position.y = 0.3; hatch.add(lid);
for (const hx of [-0.68, 0.68]) {
  const hg = cyl(0.13, 0.13, 0.6, 12, steelMat, 'x');
  hg.position.set(hx, 0.33, -1.02); hatch.add(hg);
}
scene.add(hatch);

// Periscope / sight with hooded lens on the dome front
const scopeDir = new THREE.Vector3(0.5, 0.55, -0.67).normalize();
const scopePos = DOME_C.clone().addScaledVector(scopeDir, DOME_R - 0.15);
const scope = new THREE.Group();
scope.add(cyl(0.36, 0.36, 1.1, 18, bodyMat, 'z'));
const sHood = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.1, 10, 20), steelMat);
sHood.position.z = 0.45; scope.add(sHood);
const sLens = cyl(0.27, 0.27, 0.1, 16, darkMat, 'z'); sLens.position.z = 0.5; scope.add(sLens);
scope.position.copy(scopePos);
scope.lookAt(scopePos.clone().add(scopeDir));
scene.add(scope);

// Two round view ports on the left flank of the dome
function domePort(nx, ny, nz) {
  const dir = new THREE.Vector3(nx, ny, nz).normalize();
  const pos = DOME_C.clone().addScaledVector(dir, DOME_R - 0.05);
  const g = new THREE.Group();
  g.add(cyl(0.36, 0.36, 0.4, 18, bodyMat, 'z'));
  const cap = cyl(0.29, 0.29, 0.12, 16, darkMat, 'z'); cap.position.z = 0.2; g.add(cap);
  g.position.copy(pos);
  g.lookAt(pos.clone().add(dir));
  scene.add(g);
}
domePort(-0.88,  0.28, 0.38);
domePort(-0.97, -0.02, 0.26);

// ------------------------- Main gun ----------------------------------
// Large cannon with mantlet collar, barrel, dark bore and muzzle ring,
// tilted slightly downward, plus bent feed pipes running to the dome.
const gun = new THREE.Group();
gun.position.set(0, 5.5, -2.7);
gun.rotation.x = -0.12;
const gBall = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 18), bodyMat);
gBall.scale.set(1, 1, 0.75); gBall.position.z = 0.15; gun.add(gBall);
const gCollar = cyl(1.35, 1.15, 0.9, 28, steelMat, 'z'); gCollar.position.z = -0.35; gun.add(gCollar);
const gBarrel = cyl(1.02, 0.96, 3.2, 28, bodyMat, 'z'); gBarrel.position.z = -2.1; gun.add(gBarrel);
const gBore = cyl(0.78, 0.76, 3.4, 20, darkMat, 'z'); gBore.position.z = -2.2; gun.add(gBore);
const gMuzzle = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.2, 14, 28), steelMat);
gMuzzle.position.z = -3.7; gun.add(gMuzzle);
scene.add(gun);

function bentPipe(radius, x, y, z) {
  const t = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.11, 10, 24, Math.PI * 0.85), steelMat);
  t.position.set(x, y, z);
  t.rotation.y = Math.PI / 2;
  scene.add(t);
}
bentPipe(0.7,  1.25, 5.85, -2.7);
bentPipe(0.5,  1.6,  5.65, -2.75);

// --------------------- Rear deck: exhaust + antennas ------------------
const exG = new THREE.Group();
exG.position.set(-0.6, 4.25, 3.5);
const exBracket = box(1.6, 0.7, 1.0, bodyMat); exBracket.position.y = 0.3; exG.add(exBracket);
for (const ex of [-0.4, 0.4]) {
  const stack = cyl(0.3, 0.32, 2.2, 16, steelMat, 'y'); stack.position.set(ex, 1.35, 0); exG.add(stack);
  const plate = cyl(0.42, 0.42, 0.1, 16, bodyMat, 'y'); plate.position.set(ex, 2.45, 0); exG.add(plate);
  for (let i = 0; i < 6; i++) {           // little cage pipes on top
    const a = i / 6 * Math.PI * 2;
    const mini = cyl(0.09, 0.09, 0.55, 8, darkMat, 'y');
    mini.position.set(ex + Math.cos(a) * 0.22, 2.7, Math.sin(a) * 0.22);
    exG.add(mini);
  }
}
scene.add(exG);

rod(0.045, [-0.5, 6.6, 3.7], [-1.9, 13.8, 6.2], steelMat);   // tall whip antenna

// --------------------- Flank weapon: gatling mount --------------------
const gat = new THREE.Group();
const gtBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 14), steelMat);
gtBall.position.z = -1.0; gat.add(gtBall);
const gtBlock = box(0.65, 0.75, 0.85, bodyMat); gtBlock.position.z = -0.35; gat.add(gtBlock);
const gtHub = cyl(0.24, 0.24, 2.3, 14, steelMat, 'z'); gtHub.position.z = 0.85; gat.add(gtHub);
for (let i = 0; i < 6; i++) {
  const a = i / 6 * Math.PI * 2;
  const b = cyl(0.085, 0.085, 2.1, 10, darkMat, 'z');
  b.position.set(Math.cos(a) * 0.23, Math.sin(a) * 0.23, 1.15);
  gat.add(b);
}
const gtRing = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.07, 10, 18), steelMat);
gtRing.position.z = 2.25; gat.add(gtRing);
gat.position.set(-2.95, 5.25, 2.45);
gat.lookAt(-5.4, 9.4, 5.8);          // aimed up and to the rear
scene.add(gat);

// Ammo box with feed chute, and a thin whip rod next to the mount
const ammo = box(0.8, 0.95, 0.8, bodyMat);
ammo.position.set(-3.35, 4.45, 3.15); ammo.rotation.y = 0.35; scene.add(ammo);
rod(0.1, [-3.2, 4.95, 3.0], [-3.5, 5.45, 2.35], steelMat);
rod(0.05, [-2.35, 5.2, 1.7], [-3.7, 8.7, 3.0], steelMat);

// ----------------------------- Camera --------------------------------
camera.position.set(-15, 10.5, -16);
camera.lookAt(0, 3.2, 0);