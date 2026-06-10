// ===================================================
// WALL-MOUNTED HOSE REEL WITH SUPPLY PIPE AND NOZZLE
// ===================================================

// === PARAMETERS ===
const discRadius = 8;           // Radius of flange discs
const discThickness = 0.3;      // Thickness of each disc
const hubRadius = 3.2;          // Radius of central drum
const hubWidth = 5.5;           // Width between inner disc faces
const hoseRadius = 0.32;        // Hose tube radius
const coilRadius = 5.5;         // Radius of hose wrapping
const numCoils = 7.5;           // Number of hose wraps (7.5 so ends are 180° apart)
const pipeRadius = 0.2;         // Supply/exit pipe radius
const startAngle = Math.PI / 2; // Helix starts at top → ends at bottom

// Z boundaries for hose winding
const zBack = -(hubWidth / 2) + hoseRadius * 3;
const zFront = (hubWidth / 2) - hoseRadius * 3;

// === MATERIALS ===
const metalMat = new THREE.MeshStandardMaterial({
    color: 0x8c8c8c, metalness: 0.3, roughness: 0.5
});
const hoseMat = new THREE.MeshStandardMaterial({
    color: 0x999999, metalness: 0.1, roughness: 0.65
});
const darkMat = new THREE.MeshStandardMaterial({
    color: 0x5c5c5c, metalness: 0.5, roughness: 0.35
});

// === MAIN ASSEMBLY GROUP ===
const reelAssembly = new THREE.Group();

// --- FRONT FLANGE DISC ---
const discGeo = new THREE.CylinderGeometry(discRadius, discRadius, discThickness, 64);
const frontDisc = new THREE.Mesh(discGeo, metalMat);
frontDisc.rotation.x = Math.PI / 2;
frontDisc.position.z = hubWidth / 2 + discThickness / 2;
reelAssembly.add(frontDisc);

// Front disc edge ring (raised rim)
const edgeRingGeo = new THREE.TorusGeometry(discRadius, 0.12, 12, 64);
const frontEdge = new THREE.Mesh(edgeRingGeo, darkMat);
frontEdge.position.z = hubWidth / 2 + discThickness;
reelAssembly.add(frontEdge);

// --- BACK FLANGE DISC ---
const backDisc = new THREE.Mesh(discGeo.clone(), metalMat);
backDisc.rotation.x = Math.PI / 2;
backDisc.position.z = -(hubWidth / 2 + discThickness / 2);
reelAssembly.add(backDisc);

const backEdge = new THREE.Mesh(edgeRingGeo.clone(), darkMat);
backEdge.position.z = -(hubWidth / 2 + discThickness);
reelAssembly.add(backEdge);

// --- CENTRAL HUB / DRUM ---
const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, hubWidth, 32);
const hubMesh = new THREE.Mesh(hubGeo, metalMat);
hubMesh.rotation.x = Math.PI / 2;
reelAssembly.add(hubMesh);

// Hub lip rings at each end
const lipGeo = new THREE.TorusGeometry(hubRadius, 0.1, 8, 32);
const frontLip = new THREE.Mesh(lipGeo, darkMat);
frontLip.position.z = hubWidth / 2;
reelAssembly.add(frontLip);
const backLip = new THREE.Mesh(lipGeo.clone(), darkMat);
backLip.position.z = -hubWidth / 2;
reelAssembly.add(backLip);

// --- DECORATIVE HOLES ON FRONT DISC ---
// 5 small holes arranged in a cross-like pattern
const holeTorus = new THREE.TorusGeometry(0.28, 0.06, 8, 20);
const holeCoords = [
    [2.8, 2.8], [-2.8, 2.8], [2.8, -2.8], [-2.8, -2.8], [0, 0]
];
holeCoords.forEach(([hx, hy]) => {
    const h = new THREE.Mesh(holeTorus, darkMat);
    h.position.set(hx, hy, hubWidth / 2 + discThickness + 0.01);
    reelAssembly.add(h);
});

// --- WOUND HOSE (HELIX) ---
// 7.5 coils starting at top (π/2), ending at bottom (3π/2)
const windPts = [];
const windRes = 450;
for (let i = 0; i <= windRes; i++) {
    const t = i / windRes;
    const angle = startAngle + t * numCoils * Math.PI * 2;
    windPts.push(new THREE.Vector3(
        coilRadius * Math.cos(angle),
        coilRadius * Math.sin(angle),
        zBack + t * (zFront - zBack)
    ));
}
const windCurve = new THREE.CatmullRomCurve3(windPts);
const windTubeGeo = new THREE.TubeGeometry(windCurve, windRes, hoseRadius, 8, false);
reelAssembly.add(new THREE.Mesh(windTubeGeo, hoseMat));

// --- TOP EXIT HOSE (supply connection, curves upward-left) ---
const topStart = windPts[0]; // (0, coilR, zBack) — top, back side
const topExitPts = [
    topStart.clone(),
    new THREE.Vector3(-1.5, topStart.y + 2.5, topStart.z - 0.5),
    new THREE.Vector3(-3, topStart.y + 5, topStart.z - 1),
    new THREE.Vector3(-2.5, topStart.y + 8, topStart.z - 1),
    new THREE.Vector3(-2, topStart.y + 10, topStart.z - 0.5),
];
const topExitCurve = new THREE.CatmullRomCurve3(topExitPts);
const topExitTube = new THREE.TubeGeometry(topExitCurve, 48, hoseRadius, 8, false);
reelAssembly.add(new THREE.Mesh(topExitTube, hoseMat));

// Straight supply pipe going up
const tpBase = topExitPts[topExitPts.length - 1];
const tpLen = 3.5;
const tpGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, tpLen, 16);
const topPipe = new THREE.Mesh(tpGeo, darkMat);
topPipe.position.set(tpBase.x, tpBase.y + tpLen / 2, tpBase.z);
reelAssembly.add(topPipe);

// Swivel joint at hose-to-pipe junction
const swivelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.45, 16);
const swivel = new THREE.Mesh(swivelGeo, darkMat);
swivel.position.set(tpBase.x, tpBase.y + 0.1, tpBase.z);
reelAssembly.add(swivel);

// Swivel ring
const sRingGeo = new THREE.TorusGeometry(0.42, 0.05, 8, 20);
const sRing = new THREE.Mesh(sRingGeo, darkMat);
sRing.rotation.x = Math.PI / 2;
sRing.position.set(tpBase.x, tpBase.y + 0.3, tpBase.z);
reelAssembly.add(sRing);

// Hex nut at top of pipe
const hexY = tpBase.y + tpLen + 0.3;
const hexGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.55, 6);
const hexNut = new THREE.Mesh(hexGeo, darkMat);
hexNut.position.set(tpBase.x, hexY, tpBase.z);
reelAssembly.add(hexNut);

// Small outlet connector above hex
const outletGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 16);
const outlet = new THREE.Mesh(outletGeo, darkMat);
outlet.position.set(tpBase.x, hexY + 0.5, tpBase.z);
reelAssembly.add(outlet);

// Connector ball
const connBall = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), darkMat);
connBall.position.set(tpBase.x, hexY + 0.85, tpBase.z);
reelAssembly.add(connBall);

// --- BOTTOM EXIT HOSE (to nozzle, curves downward) ---
const botStart = windPts[windPts.length - 1]; // (0, -coilR, zFront) — bottom, front side
const botExitPts = [
    botStart.clone(),
    new THREE.Vector3(0, botStart.y - 2, botStart.z - 0.3),
    new THREE.Vector3(-0.3, botStart.y - 4, botStart.z - 1),
    new THREE.Vector3(-0.3, botStart.y - 6, botStart.z - 1.5),
];
const botExitCurve = new THREE.CatmullRomCurve3(botExitPts);
const botExitTube = new THREE.TubeGeometry(botExitCurve, 36, hoseRadius, 8, false);
reelAssembly.add(new THREE.Mesh(botExitTube, hoseMat));

// Straight pipe below bottom exit hose
const bpBase = botExitPts[botExitPts.length - 1];
const bpLen = 2.5;
const bpGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, bpLen, 16);
const botPipe = new THREE.Mesh(bpGeo, darkMat);
botPipe.position.set(bpBase.x, bpBase.y - bpLen / 2, bpBase.z);
reelAssembly.add(botPipe);

// Valve body
const valveY = bpBase.y - bpLen - 0.4;
const valveGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
const valve = new THREE.Mesh(valveGeo, darkMat);
valve.position.set(bpBase.x, valveY, bpBase.z);
reelAssembly.add(valve);

// Valve collar ring
const vCollarGeo = new THREE.TorusGeometry(0.42, 0.06, 8, 16);
const vCollar = new THREE.Mesh(vCollarGeo, darkMat);
vCollar.rotation.x = Math.PI / 2;
vCollar.position.set(bpBase.x, valveY + 0.3, bpBase.z);
reelAssembly.add(vCollar);

// T-Handle bar (horizontal)
const handleGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.4, 8);
const handleBar = new THREE.Mesh(handleGeo, darkMat);
handleBar.rotation.z = Math.PI / 2;
handleBar.position.set(bpBase.x, valveY, bpBase.z);
reelAssembly.add(handleBar);

// Handle knobs at each end
const knobGeo = new THREE.SphereGeometry(0.13, 8, 8);
[-1.2, 1.2].forEach(dx => {
    const knob = new THREE.Mesh(knobGeo, darkMat);
    knob.position.set(bpBase.x + dx, valveY, bpBase.z);
    reelAssembly.add(knob);
});

// Handle stem (connects perpendicular to valve body)
const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);
const stem = new THREE.Mesh(stemGeo, darkMat);
stem.rotation.x = Math.PI / 2;
stem.position.set(bpBase.x, valveY, bpBase.z + 0.3);
reelAssembly.add(stem);

// Nozzle collar
const nzCollarGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16);
const nzCollar = new THREE.Mesh(nzCollarGeo, darkMat);
nzCollar.position.set(bpBase.x, valveY - 0.6, bpBase.z);
reelAssembly.add(nzCollar);

// Nozzle / spout (tapered cone)
const nozzleGeo = new THREE.ConeGeometry(0.3, 1.5, 16);
const nozzle = new THREE.Mesh(nozzleGeo, darkMat);
nozzle.position.set(bpBase.x, valveY - 1.55, bpBase.z);
reelAssembly.add(nozzle);

// --- WALL MOUNTING BRACKET ---
// Cylindrical bracket connecting back disc to wall
const bracketGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 16);
const bracket = new THREE.Mesh(bracketGeo, darkMat);
bracket.rotation.x = Math.PI / 2;
bracket.position.z = -(hubWidth / 2 + discThickness + 1.25);
reelAssembly.add(bracket);

// Wall mounting plate
const plateGeo = new THREE.BoxGeometry(3.5, 3.5, 0.25);
const mountPlate = new THREE.Mesh(plateGeo, darkMat);
mountPlate.position.z = -(hubWidth / 2 + discThickness + 2.55);
reelAssembly.add(mountPlate);

// === ADD TO SCENE ===
scene.add(reelAssembly);

// === CAMERA - Angled view matching the reference image ===
camera.position.set(22, 8, 24);
camera.lookAt(0, -2, 0);