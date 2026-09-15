// ============================================================
// Stylized cartoon tank recreation
// Interpretation: chunky hull with side tracks + cleats, big
// road wheels, sloped fenders, dome turret with main gun,
// searchlight, hatch rails, antenna, mortar tube, gatling pod,
// exhaust pipes, side equipment box with twin ports.
// Forward = +Z, Up = +Y
// ============================================================

// ---------- Parameters ----------
const hullWidth = 7.6, hullHeight = 2.8, hullLength = 11.0, hullY = 2.6;
const trackWidth = 2.6, trackHeight = 3.0, trackLength = 14.0, trackCY = 1.9;
const trackX = hullWidth / 2 + trackWidth / 2;          // track center offset
const turretY = 4.6, turretR = 3.4;
const gunY = turretY;

// ---------- Materials ----------
const matBody  = new THREE.MeshStandardMaterial({ color: 0xc9c9c9, roughness: 0.55, metalness: 0.25 });
const matDark  = new THREE.MeshStandardMaterial({ color: 0xa9a9a9, roughness: 0.65, metalness: 0.25 });
const matDetail= new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.5,  metalness: 0.3 });

// ---------- Helper ----------
function mesh(geo, mat, x, y, z, rx, ry, rz, parent) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0);
    (parent || scene).add(m);
    return m;
}

// ============================================================
// HULL
// ============================================================
mesh(new THREE.BoxGeometry(hullWidth, hullHeight, hullLength), matBody, 0, hullY, 0);
// sloped front glacis & rear plate
mesh(new THREE.BoxGeometry(hullWidth * 0.95, 0.5, 4.0), matBody, 0, hullY + 1.3, hullLength / 2 - 0.8, -0.5);
mesh(new THREE.BoxGeometry(hullWidth * 0.90, 0.5, 3.0), matBody, 0, hullY + 1.2, -hullLength / 2 + 0.6, 0.55);
// glacis hatch + diamond emblem + lower teeth row
mesh(new THREE.BoxGeometry(1.6, 0.5, 1.3), matDetail, 0, hullY + 1.55, hullLength / 2 - 0.6, -0.5);
mesh(new THREE.BoxGeometry(0.8, 0.8, 0.35), matDetail, 0, hullY - 0.4, hullLength / 2 + 0.35, -0.5, 0, Math.PI / 4);
for (let i = 0; i < 7; i++) {
    mesh(new THREE.BoxGeometry(0.5, 0.9, 0.45), matDark, -3 + i, 1.5, hullLength / 2 + 0.15);
}

// ============================================================
// TRACKS (both sides): body, cleats, wheels, fenders
// ============================================================
[-1, 1].forEach(s => {
    const cx = s * trackX;
    mesh(new THREE.BoxGeometry(trackWidth, trackHeight, trackLength), matDark, cx, trackCY, 0);
    // cleats around track loop
    const N = 16, rz = trackLength / 2 + 0.05, ry = trackHeight / 2 + 0.05;
    for (let i = 0; i < N; i++) {
        const a = i / N * Math.PI * 2;
        mesh(new THREE.BoxGeometry(trackWidth * 0.85, 0.28, 0.9), matDark,
            cx, trackCY + Math.sin(a) * ry, Math.cos(a) * rz,
            Math.PI / 2 - a);
    }
    // big road wheels front & rear (outer face)
    [1, -1].forEach(zs => {
        const wz = zs * (trackLength / 2 - 1.7);
        mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 28), matBody, s * (trackX + trackWidth / 2 - 0.1), trackCY, wz, 0, 0, Math.PI / 2);
        mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.7, 20), matDetail, s * (trackX + trackWidth / 2 - 0.05), trackCY, wz, 0, 0, Math.PI / 2);
        mesh(new THREE.TorusGeometry(1.05, 0.1, 10, 28), matDetail, s * (trackX + trackWidth / 2 + 0.16), trackCY, wz, 0, Math.PI / 2);
    });
    // sloped fenders front/rear + outer skirt plate
    mesh(new THREE.BoxGeometry(trackWidth + 1.0, 0.22, 2.6), matBody, cx, trackCY + 1.7, trackLength / 2 - 0.2, -0.45);
    mesh(new THREE.BoxGeometry(trackWidth + 1.0, 0.22, 2.6), matBody, cx, trackCY + 1.7, -trackLength / 2 + 0.2, 0.45);
    mesh(new THREE.BoxGeometry(0.22, 1.5, 2.8), matBody, s * (trackX + trackWidth / 2 + 0.35), trackCY + 0.7, trackLength / 2 - 1.2, 0, 0, s * 0.35);
});

// ============================================================
// TURRET DOME + top plate
// ============================================================
const turret = mesh(new THREE.SphereGeometry(turretR, 32, 24), matBody, 0, turretY, 0);
turret.scale.set(1.05, 0.8, 1.15);
mesh(new THREE.BoxGeometry(3.6, 0.25, 4.2), matDetail, 0, turretY + 2.65, 0.2);
mesh(new THREE.BoxGeometry(0.25, 0.2, 3.4), matDetail, -0.9, turretY + 2.85, 0.2);
mesh(new THREE.BoxGeometry(0.25, 0.2, 3.4), matDetail,  0.9, turretY + 2.85, 0.2);

// ============================================================
// MAIN GUN (mantlet, barrel, muzzle sleeve + hollow ring)
// ============================================================
mesh(new THREE.CylinderGeometry(1.35, 1.45, 2.0, 24), matBody, 0, gunY, 3.0, Math.PI / 2);
mesh(new THREE.TorusGeometry(1.35, 0.12, 10, 28), matDetail, 0, gunY, 3.9);
mesh(new THREE.CylinderGeometry(0.72, 0.88, 5.0, 24), matBody, 0, gunY, 5.4, Math.PI / 2);
mesh(new THREE.CylinderGeometry(0.95, 0.95, 1.3, 24), matBody, 0, gunY, 7.5, Math.PI / 2);
mesh(new THREE.TorusGeometry(0.8, 0.16, 12, 28), matDetail, 0, gunY, 8.15);
mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.25, 20), matDark, 0, gunY, 8.05, Math.PI / 2);
// curved guard pipes around mantlet
[-1, 1].forEach(s => {
    mesh(new THREE.TorusGeometry(1.3, 0.15, 10, 20, Math.PI * 0.85), matDetail,
        s * 1.7, gunY - 0.1, 2.7, -0.3, Math.PI / 2, s * 0.9);
});
// small curved pipe on hull front right
mesh(new THREE.TorusGeometry(0.9, 0.14, 10, 18, Math.PI * 0.9), matDetail, 1.8, 4.0, 3.6, 0.4, Math.PI / 2, 0.4);

// ============================================================
// SEARCHLIGHT on turret top-front
// ============================================================
const sl = new THREE.Group();
sl.position.set(-1.3, turretY + 2.5, 1.5);
scene.add(sl);
mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.7, 12), matDetail, 0, 0.3, 0, 0, 0, 0, sl);
mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.1, 20), matBody, 0, 0.95, 0.15, Math.PI / 2, 0, 0, sl);
mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.2, 20, 1, true, 0, Math.PI), matDetail, 0, 0.95, 0.15, Math.PI / 2, 0, 0, sl);
mesh(new THREE.TorusGeometry(0.75, 0.1, 10, 24), matDetail, 0, 0.95, 0.72, 0, 0, 0, sl);

// ============================================================
// VERTICAL MORTAR TUBE (turret top rear)
// ============================================================
const mor = new THREE.Group();
mor.position.set(0.9, turretY + 2.5, -1.4);
mor.rotation.set(-0.12, 0, -0.1);
scene.add(mor);
mesh(new THREE.CylinderGeometry(0.5, 0.55, 2.2, 20), matBody, 0, 1.1, 0, 0, 0, 0, mor);
mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.12, 20), matDark, 0, 2.15, 0, 0, 0, 0, mor);
mesh(new THREE.TorusGeometry(0.5, 0.08, 10, 22), matDetail, 0, 2.2, 0, Math.PI / 2, 0, 0, mor);

// ============================================================
// ANTENNAS (long whip + short rod)
// ============================================================
const ant = new THREE.Group();
ant.position.set(1.5, turretY + 2.4, -2.0);
ant.rotation.set(-0.12, 0, -0.2);
scene.add(ant);
mesh(new THREE.CylinderGeometry(0.05, 0.07, 6.4, 8), matDetail, 0, 3.2, 0, 0, 0, 0, ant);
mesh(new THREE.SphereGeometry(0.1, 8, 8), matDetail, 0, 6.4, 0, 0, 0, 0, ant);
mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.6, 8), matDetail, 2.1, turretY + 2.2, -1.6, -0.1, 0, -0.45);

// ============================================================
// RIGHT-SIDE PIPES: exhaust stub + bent thin rod
// ============================================================
mesh(new THREE.CylinderGeometry(0.3, 0.34, 2.4, 16), matBody, 2.3, turretY + 2.0, 0.4, -0.15, 0, -0.5);
mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16), matDetail, 2.87, turretY + 3.05, 0.36, -0.15, 0, -0.5);
mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.8, 10), matDetail, 2.9, turretY + 1.7, -0.5, 0, 0, -0.4);
mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.8, 10), matDetail, 3.25, turretY + 2.55, -0.5, 0, 0, -1.3);

// ============================================================
// SIDE EQUIPMENT BOX with twin circular ports (front face)
// ============================================================
mesh(new THREE.BoxGeometry(1.5, 2.1, 2.0), matBody, 3.3, turretY + 0.4, 1.4);
[0.55, -0.45].forEach(dy => {
    mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20), matDetail, 3.3, turretY + 0.4 + dy, 2.45, Math.PI / 2);
    mesh(new THREE.TorusGeometry(0.5, 0.08, 10, 22), matDetail, 3.3, turretY + 0.4 + dy, 2.6);
});

// ============================================================
// GATLING POD (right rear): sphere base + 6 barrels + clamps
// ============================================================
const gat = new THREE.Group();
gat.position.set(3.6, turretY + 0.6, -1.8);
gat.rotation.set(0.55, 0, -0.55);
scene.add(gat);
mesh(new THREE.SphereGeometry(0.85, 20, 16), matBody, 0, 0, 0, 0, 0, 0, gat);
for (let k = 0; k < 6; k++) {
    const a = k / 6 * Math.PI * 2;
    mesh(new THREE.CylinderGeometry(0.11, 0.11, 3.4, 10), matDetail,
        Math.cos(a) * 0.34, 1.6, Math.sin(a) * 0.34, 0, 0, 0, gat);
}
mesh(new THREE.CylinderGeometry(0.13, 0.13, 3.6, 10), matDetail, 0, 1.6, 0, 0, 0, 0, gat);
mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.22, 16), matBody, 0, 1.1, 0, 0, 0, 0, gat);
mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.22, 16), matBody, 0, 2.3, 0, 0, 0, 0, gat);
mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 16), matDetail, 0, 3.2, 0, 0, 0, 0, gat);

// ============================================================
// Camera
// ============================================================
camera.position.set(24, 16, 24);
camera.lookAt(0, 3.5, 0);