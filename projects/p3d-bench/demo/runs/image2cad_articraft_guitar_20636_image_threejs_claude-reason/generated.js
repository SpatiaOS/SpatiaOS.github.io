// ES-335 Semi-Hollow Body Electric Guitar
// Approximate scale: 1 unit ≈ 1 cm

const guitar = new THREE.Group();

// === Materials ===
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x7e838a, roughness: 0.3, metalness: 0.12 });
const fretboardMat = new THREE.MeshStandardMaterial({ color: 0x191510, roughness: 0.7 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.1, metalness: 0.9 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 });
const ivoryMat = new THREE.MeshStandardMaterial({ color: 0xe0ddd0, roughness: 0.35 });
const stringMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.2 });
const dotMat = new THREE.MeshStandardMaterial({ color: 0xddddcc, roughness: 0.4 });

// ===================== BODY =====================
// Double-cutaway semi-hollow body, neck direction = +Y
const bodyShape = new THREE.Shape();
bodyShape.moveTo(0, -8.5);
// Right side bottom curve
bodyShape.bezierCurveTo(3.5, -8.8, 6.2, -8.0, 7.0, -5.0);
// Right lower bout
bodyShape.bezierCurveTo(7.4, -3.0, 7.3, -0.5, 6.5, 1.2);
// Right waist into cutaway
bodyShape.bezierCurveTo(5.5, 3.2, 3.5, 4.8, 2.5, 5.8);
// Right horn
bodyShape.bezierCurveTo(1.8, 6.5, 1.6, 7.5, 1.4, 8.5);
bodyShape.lineTo(1.1, 9.0);
// Neck pocket
bodyShape.lineTo(-1.1, 9.0);
// Left horn
bodyShape.lineTo(-1.4, 8.5);
bodyShape.bezierCurveTo(-1.6, 7.5, -2.2, 6.2, -3.2, 5.0);
// Left cutaway into upper bout
bodyShape.bezierCurveTo(-4.8, 3.2, -6.2, 1.8, -6.8, 0.0);
// Left lower bout
bodyShape.bezierCurveTo(-7.4, -2.0, -7.3, -4.0, -7.0, -5.5);
// Bottom left curve
bodyShape.bezierCurveTo(-6.2, -8.2, -3.5, -8.8, 0, -8.5);

const bodyDepth = 2.0;
const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: bodyDepth,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.35,
    bevelSegments: 5
});
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
bodyMesh.position.z = -bodyDepth / 2 - 0.4;
guitar.add(bodyMesh);

// ===================== NECK =====================
// Tapers from ~2.1 wide at body to ~1.76 at headstock
const neckLength = 20;
const neckShape = new THREE.Shape();
neckShape.moveTo(-1.05, 0);
neckShape.lineTo(1.05, 0);
neckShape.lineTo(0.88, neckLength);
neckShape.lineTo(-0.88, neckLength);
neckShape.closePath();

const neckGeo = new THREE.ExtrudeGeometry(neckShape, {
    depth: 0.9,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.15,
    bevelSegments: 3
});
const neckMesh = new THREE.Mesh(neckGeo, bodyMat);
neckMesh.position.set(0, 9, -0.75);
guitar.add(neckMesh);

// ===================== FRETBOARD =====================
const fbShape = new THREE.Shape();
fbShape.moveTo(-0.95, 0);
fbShape.lineTo(0.95, 0);
fbShape.lineTo(0.78, neckLength);
fbShape.lineTo(-0.78, neckLength);
fbShape.closePath();

const fbGeo = new THREE.ExtrudeGeometry(fbShape, {
    depth: 0.15,
    bevelEnabled: false
});
const fbMesh = new THREE.Mesh(fbGeo, fretboardMat);
fbMesh.position.set(0, 9, 0.45);
guitar.add(fbMesh);

// ===================== FRETS =====================
const scaleLength = neckLength;
for (let i = 1; i <= 22; i++) {
    const fretY = scaleLength * (1 - Math.pow(2, -i / 12));
    const t = fretY / scaleLength;
    const halfW = 0.95 - 0.17 * t;

    const fretGeo = new THREE.BoxGeometry(halfW * 2, 0.06, 0.07);
    const fret = new THREE.Mesh(fretGeo, chromeMat);
    fret.position.set(0, 9 + fretY, 0.63);
    guitar.add(fret);
}

// ===================== FRET MARKERS =====================
const singleDots = [3, 5, 7, 9, 15, 17, 19, 21];
singleDots.forEach(f => {
    const y1 = scaleLength * (1 - Math.pow(2, -(f - 1) / 12));
    const y2 = scaleLength * (1 - Math.pow(2, -f / 12));
    const yMid = (y1 + y2) / 2;
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), dotMat);
    dot.position.set(0, 9 + yMid, 0.61);
    guitar.add(dot);
});
// Double dots at 12th fret
const y12a = scaleLength * (1 - Math.pow(2, -11 / 12));
const y12b = scaleLength * (1 - Math.pow(2, -12 / 12));
const y12Mid = (y12a + y12b) / 2;
[-0.3, 0.3].forEach(xOff => {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), dotMat);
    dot.position.set(xOff, 9 + y12Mid, 0.61);
    guitar.add(dot);
});

// ===================== HEADSTOCK =====================
const headShape = new THREE.Shape();
headShape.moveTo(-0.88, 0);
headShape.lineTo(0.88, 0);
headShape.bezierCurveTo(1.5, 0.5, 1.65, 2.5, 1.55, 4.5);
headShape.bezierCurveTo(1.45, 6.0, 0.8, 7.0, 0, 7.2);
headShape.bezierCurveTo(-0.8, 7.0, -1.45, 6.0, -1.55, 4.5);
headShape.bezierCurveTo(-1.65, 2.5, -1.5, 0.5, -0.88, 0);

const headGeo = new THREE.ExtrudeGeometry(headShape, {
    depth: 0.65,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 3
});
const headMesh = new THREE.Mesh(headGeo, bodyMat);
headMesh.position.set(0, 29, -0.55);
guitar.add(headMesh);

// ===================== TUNING PEGS (3+3) =====================
for (let i = 0; i < 6; i++) {
    const side = i < 3 ? 1 : -1;
    const idx = i < 3 ? i : i - 3;
    const yPos = 30.0 + idx * 2.0;

    // Machine head button
    const buttonGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.9, 12);
    const button = new THREE.Mesh(buttonGeo, darkMat);
    button.rotation.z = Math.PI / 2;
    button.position.set(side * 2.1, yPos, -0.15);
    guitar.add(button);

    // Machine head housing
    const housingGeo = new THREE.BoxGeometry(0.4, 0.55, 0.35);
    const housing = new THREE.Mesh(housingGeo, darkMat);
    housing.position.set(side * 1.35, yPos, -0.15);
    guitar.add(housing);

    // String post on headstock face
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8);
    const post = new THREE.Mesh(postGeo, chromeMat);
    post.rotation.x = Math.PI / 2;
    post.position.set(side * 0.85, yPos, 0.35);
    guitar.add(post);
}

// ===================== NUT =====================
const nutGeo = new THREE.BoxGeometry(1.9, 0.12, 0.15);
const nutMesh = new THREE.Mesh(nutGeo, ivoryMat);
nutMesh.position.set(0, 29, 0.55);
guitar.add(nutMesh);

// ===================== HUMBUCKER PICKUPS =====================
function createPickup(y) {
    const g = new THREE.Group();

    // Mounting ring / surround
    const ringGeo = new THREE.BoxGeometry(3.8, 1.9, 0.12);
    g.add(new THREE.Mesh(ringGeo, darkMat));

    // Chrome cover
    const coverGeo = new THREE.BoxGeometry(3.2, 1.35, 0.4);
    const cover = new THREE.Mesh(coverGeo, chromeMat);
    cover.position.z = 0.15;
    g.add(cover);

    // Pole piece rows
    for (let i = 0; i < 6; i++) {
        for (let r = -1; r <= 1; r += 2) {
            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 0.1, 6),
                darkMat
            );
            pole.rotation.x = Math.PI / 2;
            pole.position.set(-1.1 + i * 0.44, r * 0.32, 0.4);
            g.add(pole);
        }
    }

    // Mounting screws at corners
    [[-1.7, -0.8], [1.7, -0.8], [-1.7, 0.8], [1.7, 0.8]].forEach(([sx, sy]) => {
        const screw = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 0.15, 6),
            chromeMat
        );
        screw.rotation.x = Math.PI / 2;
        screw.position.set(sx, sy, 0.1);
        g.add(screw);
    });

    g.position.set(0, y, 1.0);
    return g;
}

guitar.add(createPickup(4.0));   // Neck pickup
guitar.add(createPickup(-1.0));  // Bridge pickup

// ===================== BRIDGE (Tune-O-Matic) =====================
const bridgeGrp = new THREE.Group();

const bridgeBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.7, 0.5),
    chromeMat
);
bridgeGrp.add(bridgeBase);

// Saddles
for (let i = 0; i < 6; i++) {
    const saddle = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.5, 0.3),
        chromeMat
    );
    saddle.position.set(-1.1 + i * 0.44, 0, 0.3);
    bridgeGrp.add(saddle);
}

// Bridge posts
for (let s = -1; s <= 1; s += 2) {
    const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 1.2, 12),
        chromeMat
    );
    post.rotation.x = Math.PI / 2;
    post.position.set(s * 1.5, 0, -0.15);
    bridgeGrp.add(post);
}

bridgeGrp.position.set(0, -3.5, 1.15);
guitar.add(bridgeGrp);

// ===================== TAILPIECE (Stop bar) =====================
const tailGrp = new THREE.Group();

const tailBar = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.55, 0.45),
    chromeMat
);
tailGrp.add(tailBar);

// Tailpiece studs
for (let s = -1; s <= 1; s += 2) {
    const stud = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.9, 12),
        chromeMat
    );
    stud.rotation.x = Math.PI / 2;
    stud.position.set(s * 1.2, 0, -0.15);
    tailGrp.add(stud);
}

tailGrp.position.set(0, -5.8, 1.1);
guitar.add(tailGrp);

// ===================== CONTROL KNOBS (2 vol + 2 tone) =====================
const knobPositions = [
    [3.5, -5.5],   // Treble volume
    [5.0, -3.0],   // Treble tone
    [-3.5, -6.0],  // Bass volume
    [-5.0, -3.8],  // Bass tone
];

knobPositions.forEach(([kx, ky]) => {
    // Knob body
    const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.52, 0.5, 20),
        ivoryMat
    );
    knob.rotation.x = Math.PI / 2;
    knob.position.set(kx, ky, 1.35);
    guitar.add(knob);

    // Knob top ring detail
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.04, 6, 20),
        chromeMat
    );
    ring.position.set(kx, ky, 1.62);
    guitar.add(ring);
});

// ===================== TOGGLE SWITCH =====================
const swPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.1, 14),
    chromeMat
);
swPlate.rotation.x = Math.PI / 2;
swPlate.position.set(5.2, 3.5, 1.1);
guitar.add(swPlate);

const swArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8),
    chromeMat
);
swArm.rotation.x = Math.PI / 2;
swArm.position.set(5.2, 3.5, 1.5);
guitar.add(swArm);

const swTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 10, 10),
    ivoryMat
);
swTip.position.set(5.2, 3.5, 1.85);
guitar.add(swTip);

// ===================== F-HOLES =====================
function createFHole(x, y, mirror) {
    const g = new THREE.Group();
    const m = mirror ? -1 : 1;

    // Main S-curve of the f-hole
    const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -2.2, 0),
        new THREE.Vector3(0.8 * m, -0.7, 0),
        new THREE.Vector3(-0.8 * m, 0.7, 0),
        new THREE.Vector3(0, 2.2, 0)
    );

    const fTube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 30, 0.08, 6, false),
        darkMat
    );
    g.add(fTube);

    // Horizontal notch bars at waist of f
    [-1.0, 1.0].forEach(ny => {
        const notch = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.06, 0.06),
            darkMat
        );
        notch.position.y = ny;
        g.add(notch);
    });

    // Small circle details at ends of f-hole
    [-2.2, 2.2].forEach(ny => {
        const endDot = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            darkMat
        );
        endDot.position.y = ny;
        g.add(endDot);
    });

    g.position.set(x, y, 1.05);
    return g;
}

guitar.add(createFHole(-3.8, 1.5, false));
guitar.add(createFHole(3.8, 1.5, true));

// ===================== STRINGS =====================
for (let i = 0; i < 6; i++) {
    const radius = 0.013 + i * 0.004;
    const xTail = -0.8 + i * 0.32;
    const xHead = -0.5 + i * 0.2;

    // String from tailpiece to beyond nut (to tuning peg area)
    const side = i < 3 ? 1 : -1;
    const pegIdx = i < 3 ? i : i - 3;
    const pegY = 30.0 + pegIdx * 2.0;
    const pegX = side * 0.85;

    const points = [
        new THREE.Vector3(xTail, -5.8, 1.45),
        new THREE.Vector3(xTail * 0.7, 0, 1.35),
        new THREE.Vector3(xHead, 20, 0.78),
        new THREE.Vector3(xHead, 29, 0.7),
        new THREE.Vector3(pegX, pegY, 0.5)
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const sGeo = new THREE.TubeGeometry(curve, 40, radius, 5, false);
    guitar.add(new THREE.Mesh(sGeo, stringMat));
}

// ===================== STRAP BUTTONS =====================
// Bottom strap button
const strapBot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.12, 0.4, 10),
    chromeMat
);
strapBot.rotation.x = Math.PI / 2;
strapBot.position.set(0, -8.8, 0.5);
guitar.add(strapBot);

// Upper strap button (on horn)
const strapTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.1, 0.3, 10),
    chromeMat
);
strapTop.rotation.z = -Math.PI / 4;
strapTop.position.set(1.3, 9.2, 0);
guitar.add(strapTop);

// ===================== OUTPUT JACK =====================
const jackPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.1, 14),
    chromeMat
);
jackPlate.rotation.x = Math.PI / 2;
jackPlate.position.set(3.5, -7.8, 1.1);
guitar.add(jackPlate);

const jackHole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.15, 10),
    darkMat
);
jackHole.rotation.x = Math.PI / 2;
jackHole.position.set(3.5, -7.8, 1.15);
guitar.add(jackHole);

// ===================== PICKGUARD =====================
// Subtle dark pickguard near neck pickup area
const pgShape = new THREE.Shape();
pgShape.moveTo(0, 0);
pgShape.bezierCurveTo(-2.5, 0.3, -4, 2, -4.5, 4);
pgShape.bezierCurveTo(-4.8, 5.5, -4, 7, -2, 8);
pgShape.lineTo(-1.2, 8);
pgShape.bezierCurveTo(-3.5, 7, -4.2, 5, -3.8, 3.5);
pgShape.bezierCurveTo(-3.2, 1.8, -1.8, 0.6, 0, 0.3);
pgShape.closePath();

const pgGeo = new THREE.ExtrudeGeometry(pgShape, {
    depth: 0.08,
    bevelEnabled: false
});
const pgMesh = new THREE.Mesh(pgGeo, darkMat);
pgMesh.position.set(0, 1, 1.02);
guitar.add(pgMesh);

// ===================== FINAL POSITIONING =====================
// Rotate guitar to match the perspective in the reference image
// Neck goes toward upper-left, body lower-right, slight top-down view
guitar.rotation.set(-0.45, 0, -0.65);
guitar.position.set(2, 1, 0);

scene.add(guitar);

// Camera setup for a good view
camera.position.set(5, 25, 38);
camera.lookAt(1, 2, 0);