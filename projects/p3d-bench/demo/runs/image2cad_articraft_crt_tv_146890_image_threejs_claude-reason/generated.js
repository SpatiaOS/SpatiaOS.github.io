// Retro CRT Television with Rabbit Ear Antennas
// Parameters
const tvWidth = 20;
const tvHeight = 14;
const tvDepth = 14;
const bezelThickness = 0.4;
const screenWidth = 14;
const screenHeight = 10.5;
const controlPanelWidth = tvWidth - screenWidth - 2.5;
const antennaLength = 14;
const antennaBaseSize = 0.8;

// Colors
const bodyColor = 0x9a9a9a;
const darkPanelColor = 0x2a2a2a;
const screenColor = 0x445566;
const screenGlare = 0x778899;
const buttonColor = 0x555555;
const antennaColor = 0x888888;

// Main TV group
const tvGroup = new THREE.Group();

// --- Main Body (slightly tapered towards back) ---
const bodyShape = new THREE.Shape();
bodyShape.moveTo(-tvWidth/2, -tvHeight/2);
bodyShape.lineTo(tvWidth/2, -tvHeight/2);
bodyShape.lineTo(tvWidth/2, tvHeight/2);
bodyShape.lineTo(-tvWidth/2, tvHeight/2);
bodyShape.lineTo(-tvWidth/2, -tvHeight/2);

const bodyGeo = new THREE.BoxGeometry(tvWidth, tvHeight, tvDepth);
const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.6, metalness: 0.1 });
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
tvGroup.add(bodyMesh);

// --- Slight taper at the back (CRT bulge effect) ---
// Create a slightly smaller back piece to simulate taper
const backTaperGeo = new THREE.BoxGeometry(tvWidth - 1, tvHeight - 1, 2);
const backTaperMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 });
const backTaper = new THREE.Mesh(backTaperGeo, backTaperMat);
backTaper.position.z = -tvDepth/2 - 0.5;
tvGroup.add(backTaper);

// --- Front face bezel (frame around the whole front) ---
const frontPanelGeo = new THREE.BoxGeometry(tvWidth + 0.1, tvHeight + 0.1, 0.5);
const frontPanelMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.5 });
const frontPanel = new THREE.Mesh(frontPanelGeo, frontPanelMat);
frontPanel.position.z = tvDepth/2 + 0.2;
tvGroup.add(frontPanel);

// --- Inner bezel around screen area ---
const innerBezelGeo = new THREE.BoxGeometry(screenWidth + 1.8, screenHeight + 1.8, 0.6);
const innerBezelMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.4 });
const innerBezel = new THREE.Mesh(innerBezelGeo, innerBezelMat);
innerBezel.position.set(-controlPanelWidth/2 - 0.3, 0.3, tvDepth/2 + 0.4);
tvGroup.add(innerBezel);

// --- Screen border (dark frame) ---
const screenBorderGeo = new THREE.BoxGeometry(screenWidth + 0.8, screenHeight + 0.8, 0.3);
const screenBorderMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3 });
const screenBorder = new THREE.Mesh(screenBorderGeo, screenBorderMat);
screenBorder.position.set(-controlPanelWidth/2 - 0.3, 0.3, tvDepth/2 + 0.65);
tvGroup.add(screenBorder);

// --- CRT Screen (slightly curved) ---
const screenGeo = new THREE.SphereGeometry(30, 32, 32, 
    Math.PI/2 - Math.atan(screenWidth/2/30), 
    2*Math.atan(screenWidth/2/30),
    Math.PI/2 - Math.atan(screenHeight/2/30),
    2*Math.atan(screenHeight/2/30)
);
// Simpler approach - use a slightly scaled box with rounded edges
const screenGeo2 = new THREE.PlaneGeometry(screenWidth, screenHeight, 20, 20);
// Add slight bulge to screen vertices
const screenPositions = screenGeo2.attributes.position;
for (let i = 0; i < screenPositions.count; i++) {
    const x = screenPositions.getX(i);
    const y = screenPositions.getY(i);
    const bulge = 0.6 * (1 - (x*x)/(screenWidth*screenWidth/4) * 0.3 - (y*y)/(screenHeight*screenHeight/4) * 0.3);
    screenPositions.setZ(i, bulge);
}
screenGeo2.computeVertexNormals();

const screenMat = new THREE.MeshPhongMaterial({ 
    color: screenColor, 
    specular: 0xaaaaaa,
    shininess: 80,
    transparent: true,
    opacity: 0.9
});
const screenMesh = new THREE.Mesh(screenGeo2, screenMat);
screenMesh.position.set(-controlPanelWidth/2 - 0.3, 0.3, tvDepth/2 + 0.8);
tvGroup.add(screenMesh);

// --- Screen glare (subtle reflection) ---
const glareShape = new THREE.Shape();
glareShape.moveTo(-3, -2);
glareShape.quadraticCurveTo(-4, 0, -3, 3);
glareShape.quadraticCurveTo(-1, 2, 0, -1);
glareShape.quadraticCurveTo(-1, -2, -3, -2);
const glareGeo = new THREE.ShapeGeometry(glareShape);
const glareMat = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.15,
    side: THREE.DoubleSide
});
const glareMesh = new THREE.Mesh(glareGeo, glareMat);
glareMesh.position.set(-controlPanelWidth/2 - 2.5, -0.5, tvDepth/2 + 1.5);
tvGroup.add(glareMesh);

// --- Control Panel (right side, dark area) ---
const controlPanelGeo = new THREE.BoxGeometry(controlPanelWidth + 0.5, tvHeight * 0.55, 0.6);
const controlPanelMat = new THREE.MeshStandardMaterial({ color: darkPanelColor, roughness: 0.7 });
const controlPanel = new THREE.Mesh(controlPanelGeo, controlPanelMat);
controlPanel.position.set(tvWidth/2 - controlPanelWidth/2 - 1, -tvHeight * 0.15, tvDepth/2 + 0.45);
tvGroup.add(controlPanel);

// --- Control panel upper area (lighter) ---
const upperControlGeo = new THREE.BoxGeometry(controlPanelWidth + 0.5, tvHeight * 0.3, 0.6);
const upperControlMat = new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.5 });
const upperControl = new THREE.Mesh(upperControlGeo, upperControlMat);
upperControl.position.set(tvWidth/2 - controlPanelWidth/2 - 1, tvHeight * 0.25, tvDepth/2 + 0.45);
tvGroup.add(upperControl);

// --- Buttons on control panel (3 rows of 4 buttons) ---
const buttonGeo = new THREE.BoxGeometry(0.7, 0.5, 0.3);
const buttonMat = new THREE.MeshStandardMaterial({ color: buttonColor, roughness: 0.4 });

for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
        const button = new THREE.Mesh(buttonGeo, buttonMat);
        button.position.set(
            tvWidth/2 - controlPanelWidth/2 - 1 - 1.2 + col * 1.2,
            -tvHeight * 0.05 - row * 0.9,
            tvDepth/2 + 0.9
        );
        tvGroup.add(button);
    }
}

// --- Small indicator lights / controls at top of control panel ---
const smallBtnGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
const smallBtnMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3 });
for (let i = 0; i < 3; i++) {
    const btn = new THREE.Mesh(smallBtnGeo, smallBtnMat);
    btn.rotation.x = Math.PI/2;
    btn.position.set(
        tvWidth/2 - controlPanelWidth/2 - 1 - 0.8 + i * 0.8,
        tvHeight * 0.22,
        tvDepth/2 + 0.9
    );
    tvGroup.add(btn);
}

// --- Brand label area (bottom left of screen) ---
const labelGeo = new THREE.BoxGeometry(4, 0.3, 0.1);
const labelMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.3, metalness: 0.3 });
const label = new THREE.Mesh(labelGeo, labelMat);
label.position.set(-tvWidth/2 + 4, -tvHeight/2 + 1.2, tvDepth/2 + 0.55);
tvGroup.add(label);

// --- Top surface detail (ridge/lip) ---
const topRidgeGeo = new THREE.BoxGeometry(tvWidth + 0.2, 0.3, tvDepth - 2);
const topRidgeMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.5 });
const topRidge = new THREE.Mesh(topRidgeGeo, topRidgeMat);
topRidge.position.set(0, tvHeight/2 + 0.15, -1);
tvGroup.add(topRidge);

// --- Antenna base plate ---
const antennaBasePlateGeo = new THREE.BoxGeometry(3, 0.4, 2);
const antennaBasePlateMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.4, metalness: 0.2 });
const antennaBasePlate = new THREE.Mesh(antennaBasePlateGeo, antennaBasePlateMat);
antennaBasePlate.position.set(tvWidth/2 - controlPanelWidth/2 - 1, tvHeight/2 + 0.5, tvDepth/2 - 2);
tvGroup.add(antennaBasePlate);

// --- Antenna base joint ---
const antennaBaseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 12);
const antennaBaseMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.3, metalness: 0.4 });

// Left antenna base
const leftAntennaBase = new THREE.Mesh(antennaBaseGeo, antennaBaseMat);
leftAntennaBase.position.set(tvWidth/2 - controlPanelWidth/2 - 1.8, tvHeight/2 + 0.9, tvDepth/2 - 2);
tvGroup.add(leftAntennaBase);

// Right antenna base
const rightAntennaBase = new THREE.Mesh(antennaBaseGeo, antennaBaseMat);
rightAntennaBase.position.set(tvWidth/2 - controlPanelWidth/2 - 0.2, tvHeight/2 + 0.9, tvDepth/2 - 2);
tvGroup.add(rightAntennaBase);

// --- Left Antenna (tall, angled left-back) ---
function createAntenna(length, baseRadius, tipRadius) {
    const segments = 3;
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const r = baseRadius * (1 - t) + tipRadius * t;
        points.push(new THREE.Vector2(r, t * length));
    }
    return new THREE.LatheGeometry(points, 8);
}

const leftAntennaGeo = createAntenna(antennaLength, 0.12, 0.03);
const antennaMat = new THREE.MeshStandardMaterial({ color: antennaColor, roughness: 0.2, metalness: 0.7 });
const leftAntenna = new THREE.Mesh(leftAntennaGeo, antennaMat);
leftAntenna.position.set(tvWidth/2 - controlPanelWidth/2 - 1.8, tvHeight/2 + 1.2, tvDepth/2 - 2);
leftAntenna.rotation.x = -0.15;
leftAntenna.rotation.z = 0.55;
tvGroup.add(leftAntenna);

// --- Right Antenna (shorter, angled right-back) ---
const rightAntennaGeo = createAntenna(antennaLength * 0.7, 0.1, 0.025);
const rightAntenna = new THREE.Mesh(rightAntennaGeo, antennaMat);
rightAntenna.position.set(tvWidth/2 - controlPanelWidth/2 - 0.2, tvHeight/2 + 1.2, tvDepth/2 - 2);
rightAntenna.rotation.x = -0.3;
rightAntenna.rotation.z = -0.6;
tvGroup.add(rightAntenna);

// --- Antenna tips (small balls) ---
const tipGeo = new THREE.SphereGeometry(0.12, 8, 8);
const tipMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.3, metalness: 0.5 });

// --- Side vents (right side of TV) ---
const ventMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.6 });
for (let i = 0; i < 6; i++) {
    const ventGeo = new THREE.BoxGeometry(0.1, 0.3, tvDepth * 0.4);
    const vent = new THREE.Mesh(ventGeo, ventMat);
    vent.position.set(tvWidth/2 + 0.05, tvHeight/2 - 3 - i * 0.8, -1);
    tvGroup.add(vent);
}

// --- Bottom edge / feet ---
const footGeo = new THREE.BoxGeometry(2, 0.4, 3);
const footMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7 });

const leftFoot = new THREE.Mesh(footGeo, footMat);
leftFoot.position.set(-tvWidth/2 + 2, -tvHeight/2 - 0.2, tvDepth/2 - 2);
tvGroup.add(leftFoot);

const rightFoot = new THREE.Mesh(footGeo, footMat);
rightFoot.position.set(tvWidth/2 - 2, -tvHeight/2 - 0.2, tvDepth/2 - 2);
tvGroup.add(rightFoot);

// --- Front bottom strip ---
const bottomStripGeo = new THREE.BoxGeometry(tvWidth + 0.2, 0.8, 0.4);
const bottomStripMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.5 });
const bottomStrip = new THREE.Mesh(bottomStripGeo, bottomStripMat);
bottomStrip.position.set(0, -tvHeight/2 + 0.3, tvDepth/2 + 0.3);
tvGroup.add(bottomStrip);

// --- Vertical divider between screen and controls ---
const dividerGeo = new THREE.BoxGeometry(0.3, tvHeight - 1, 0.7);
const dividerMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.5 });
const divider = new THREE.Mesh(dividerGeo, dividerMat);
divider.position.set(tvWidth/2 - controlPanelWidth - 1.3, 0, tvDepth/2 + 0.5);
tvGroup.add(divider);

// --- Back of TV (slightly darker) ---
const backGeo = new THREE.BoxGeometry(tvWidth - 0.5, tvHeight - 0.5, 0.3);
const backMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.7 });
const back = new THREE.Mesh(backGeo, backMat);
back.position.set(0, 0, -tvDepth/2 - 0.1);
tvGroup.add(back);

// --- Edge trim lines on front (horizontal) ---
const trimGeo = new THREE.BoxGeometry(tvWidth + 0.3, 0.15, 0.15);
const trimMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.2 });

const topTrim = new THREE.Mesh(trimGeo, trimMat);
topTrim.position.set(0, tvHeight/2 - 0.5, tvDepth/2 + 0.5);
tvGroup.add(topTrim);

const midTrim = new THREE.Mesh(trimGeo.clone(), trimMat);
midTrim.position.set(0, -tvHeight/2 + 1, tvDepth/2 + 0.5);
tvGroup.add(midTrim);

// Position the entire TV
tvGroup.position.set(0, 0, 0);
scene.add(tvGroup);

// Adjust camera for nice isometric-like view matching the reference
camera.position.set(25, 18, 25);
camera.lookAt(0, 0, 0);