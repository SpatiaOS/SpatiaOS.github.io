// Recreating a stylized tank model based on the provided image.
// The model features a chunky hull, prominent tracks, a domed turret,
// a large main gun, side pods ("cheeks"), and various exhaust pipes/antennas.

// ==========================================
// 1. Parameters and Materials
// ==========================================

// Colors and materials matching the CAD/blueprint aesthetic
const matHull = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.6, roughness: 0.4 });
const matTurret = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.5, roughness: 0.5 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.4, roughness: 0.7 });
const matTrack = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.3, roughness: 0.8 });
const matMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
const matGlass = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.1 });

// Dimensions (approximate scale based on image proportions)
const HULL_WIDTH = 6;
const HULL_LENGTH = 9;
const HULL_HEIGHT = 2;
const TRACK_WIDTH = 1.8;
const TRACK_HEIGHT = 1.8;
const TURRET_RADIUS = 2.8;

// ==========================================
// 2. Geometry Construction
// ==========================================

const tankGroup = new THREE.Group();

// --- Hull ---
const hullGroup = new THREE.Group();

// Lower chassis
const lowerHullGeo = new THREE.BoxGeometry(HULL_WIDTH, HULL_HEIGHT, HULL_LENGTH);
const lowerHull = new THREE.Mesh(lowerHullGeo, matHull);
lowerHull.position.y = HULL_HEIGHT / 2 + TRACK_HEIGHT / 2;
hullGroup.add(lowerHull);

// Upper chassis (slightly narrower)
const upperHullGeo = new THREE.BoxGeometry(HULL_WIDTH - 0.6, HULL_HEIGHT * 0.7, HULL_LENGTH - 1);
const upperHull = new THREE.Mesh(upperHullGeo, matHull);
upperHull.position.y = lowerHull.position.y + HULL_HEIGHT / 2 + (HULL_HEIGHT * 0.7) / 2;
upperHull.position.z = -0.2;
hullGroup.add(upperHull);

// Front Glacis (angled plate)
const glacisGeo = new THREE.BoxGeometry(HULL_WIDTH - 0.4, HULL_HEIGHT * 0.8, 2.5);
const glacis = new THREE.Mesh(glacisGeo, matHull);
glacis.position.set(0, lowerHull.position.y - 0.1, HULL_LENGTH / 2 - 0.5);
glacis.rotation.x = Math.PI / 4;
hullGroup.add(glacis);

// Fenders (over the tracks)
const fenderGeo = new THREE.BoxGeometry(TRACK_WIDTH, 0.3, HULL_LENGTH - 1);
const leftFender = new THREE.Mesh(fenderGeo, matHull);
leftFender.position.set(- (HULL_WIDTH / 2 + TRACK_WIDTH / 2), lowerHull.position.y + 0.5, 0);
hullGroup.add(leftFender);

const rightFender = new THREE.Mesh(fenderGeo, matHull);
rightFender.position.set((HULL_WIDTH / 2 + TRACK_WIDTH / 2), lowerHull.position.y + 0.5, 0);
hullGroup.add(rightFender);

// Front Details (Headlights / Tow Hooks)
const lightGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
const lightPositions = [
    { x: -HULL_WIDTH / 2 + 0.8, y: lowerHull.position.y + 0.4, z: HULL_LENGTH / 2 - 0.2 },
    { x: HULL_WIDTH / 2 - 0.8, y: lowerHull.position.y + 0.4, z: HULL_LENGTH / 2 - 0.2 }
];

lightPositions.forEach(pos => {
    const light = new THREE.Mesh(lightGeo, matMetal);
    light.rotation.x = Math.PI / 2;
    light.position.set(pos.x, pos.y, pos.z);
    hullGroup.add(light);
    
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), matGlass);
    lens.position.set(pos.x, pos.y, pos.z + 0.2);
    hullGroup.add(lens);
});

tankGroup.add(hullGroup);

// --- Tracks and Wheels ---
const trackGroup = new THREE.Group();

function createTrack(isLeft) {
    const side = isLeft ? -1 : 1;
    const trackX = side * (HULL_WIDTH / 2 + TRACK_WIDTH / 2);
    
    // Track base (bottom)
    const trackBaseGeo = new THREE.BoxGeometry(TRACK_WIDTH, 0.4, HULL_LENGTH - 0.5);
    const trackBase = new THREE.Mesh(trackBaseGeo, matTrack);
    trackBase.position.set(trackX, TRACK_HEIGHT / 2, 0);
    trackGroup.add(trackBase);

    // Track top (return run)
    const trackTop = new THREE.Mesh(trackBaseGeo, matTrack);
    trackTop.position.set(trackX, TRACK_HEIGHT * 1.5, 0);
    trackGroup.add(trackTop);

    // Front and Rear track guards
    const trackEndGeo = new THREE.BoxGeometry(TRACK_WIDTH, TRACK_HEIGHT, 0.5);
    const frontGuard = new THREE.Mesh(trackEndGeo, matTrack);
    frontGuard.position.set(trackX, TRACK_HEIGHT, HULL_LENGTH / 2 - 0.25);
    trackGroup.add(frontGuard);

    const rearGuard = new THREE.Mesh(trackEndGeo, matTrack);
    rearGuard.position.set(trackX, TRACK_HEIGHT, -HULL_LENGTH / 2 + 0.25);
    trackGroup.add(rearGuard);

    // Road Wheels (4 per side)
    const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, TRACK_WIDTH - 0.2, 24);
    const wheelHubGeo = new THREE.CylinderGeometry(0.3, 0.3, TRACK_WIDTH, 12);
    const wheelBoltGeo = new THREE.CylinderGeometry(0.08, 0.08, TRACK_WIDTH + 0.1, 8);
    
    const wheelZPositions = [-2.8, -0.9, 1.0, 2.9];
    wheelZPositions.forEach(z => {
        const wheel = new THREE.Mesh(wheelGeo, matDark);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(trackX, TRACK_HEIGHT / 2 + 0.4, z);
        trackGroup.add(wheel);

        const hub = new THREE.Mesh(wheelHubGeo, matMetal);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(trackX, TRACK_HEIGHT / 2 + 0.4, z);
        trackGroup.add(hub);

        // Add some bolts to the hub
        for(let i = 0; i < 4; i++) {
            const bolt = new THREE.Mesh(wheelBoltGeo, matHull);
            bolt.rotation.z = Math.PI / 2;
            const angle = (i * Math.PI / 2) + Math.PI/4;
            bolt.position.set(trackX, TRACK_HEIGHT / 2 + 0.4 + Math.cos(angle) * 0.15, z + Math.sin(angle) * 0.15);
            trackGroup.add(bolt);
        }
    });

    // Front Sprocket (Drive Wheel)
    const sprocketGeo = new THREE.CylinderGeometry(0.9, 0.9, TRACK_WIDTH - 0.1, 16);
    const sprocket = new THREE.Mesh(sprocketGeo, matDark);
    sprocket.rotation.z = Math.PI / 2;
    sprocket.position.set(trackX, TRACK_HEIGHT / 2 + 0.2, HULL_LENGTH / 2 - 0.6);
    trackGroup.add(sprocket);

    // Rear Idler
    const idlerGeo = new THREE.CylinderGeometry(0.8, 0.8, TRACK_WIDTH - 0.1, 16);
    const idler = new THREE.Mesh(idlerGeo, matDark);
    idler.rotation.z = Math.PI / 2;
    idler.position.set(trackX, TRACK_HEIGHT / 2 + 0.2, -HULL_LENGTH / 2 + 0.6);
    trackGroup.add(idler);

    // Add Track Links (small segments around the perimeter for detail)
    const linkGeo = new THREE.BoxGeometry(TRACK_WIDTH + 0.1, 0.2, 0.4);
    const linkCount = 12;
    const trackLength = HULL_LENGTH - 1.5;
    const trackRadius = TRACK_HEIGHT / 2;
    
    for (let i = 0; i < linkCount; i++) {
        const t = i / (linkCount - 1);
        const z = -trackLength / 2 + t * trackLength;
        
        // Bottom links
        const linkBottom = new THREE.Mesh(linkGeo, matMetal);
        linkBottom.position.set(trackX, 0.15, z);
        trackGroup.add(linkBottom);
        
        // Top links
        const linkTop = new THREE.Mesh(linkGeo, matMetal);
        linkTop.position.set(trackX, TRACK_HEIGHT * 1.85, z);
        trackGroup.add(linkTop);
    }
}

createTrack(true);
createTrack(false);
tankGroup.add(trackGroup);

// --- Turret ---
const turretGroup = new THREE.Group();
const turretY = 4.8; // Height of turret base

// Turret Base Ring
const baseRingGeo = new THREE.CylinderGeometry(TURRET_RADIUS + 0.2, TURRET_RADIUS + 0.4, 0.6, 32);
const baseRing = new THREE.Mesh(baseRingGeo, matHull);
baseRing.position.set(0, turretY - 0.3, -0.5);
turretGroup.add(baseRing);

// Turret Dome (main body)
const domeGeo = new THREE.SphereGeometry(TURRET_RADIUS, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const dome = new THREE.Mesh(domeGeo, matTurret);
dome.scale.y = 1.1; // Slightly squashed
dome.position.set(0, turretY, -0.5);
turretGroup.add(dome);

// Turret Mantlet (Front structure holding the gun)
const mantletGeo = new THREE.BoxGeometry(2.2, 1.8, 2.0);
const mantlet = new THREE.Mesh(mantletGeo, matHull);
mantlet.position.set(0, turretY + 0.4, 1.8);
turretGroup.add(mantlet);

// Mantlet details (angular armor)
const mantletTopGeo = new THREE.BoxGeometry(1.8, 0.4, 1.5);
const mantletTop = new THREE.Mesh(mantletTopGeo, matHull);
mantletTop.position.set(0, turretY + 1.4, 1.8);
turretGroup.add(mantletTop);

// --- Main Gun ---
const gunGroup = new THREE.Group();
gunGroup.position.set(0, turretY + 0.4, 2.5);

// Gun Base (Thicker section)
const gunBaseGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 24);
const gunBase = new THREE.Mesh(gunBaseGeo, matMetal);
gunBase.rotation.x = Math.PI / 2;
gunBase.position.z = 0.75;
gunGroup.add(gunBase);

// Gun Barrel (Main length)
const barrelGeo = new THREE.CylinderGeometry(0.4, 0.4, 4.5, 24);
const barrel = new THREE.Mesh(barrelGeo, matHull);
barrel.rotation.x = Math.PI / 2;
barrel.position.z = 3.5;
gunGroup.add(barrel);

// Gun Muzzle Brake (Thick end)
const muzzleGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.2, 24);
const muzzle = new THREE.Mesh(muzzleGeo, matMetal);
muzzle.rotation.x = Math.PI / 2;
muzzle.position.z = 6.0;
gunGroup.add(muzzle);

// Muzzle Bore (Dark inner hole)
const boreGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.3, 16);
const bore = new THREE.Mesh(boreGeo, matGlass);
bore.rotation.x = Math.PI / 2;
bore.position.z = 6.1;
gunGroup.add(bore);

turretGroup.add(gunGroup);

// --- Turret Side Pods ("Cheeks") ---
function createSidePod(isLeft) {
    const side = isLeft ? -1 : 1;
    const podGroup = new THREE.Group();
    
    // Main box
    const podGeo = new THREE.BoxGeometry(1.4, 1.6, 2.0);
    const pod = new THREE.Mesh(podGeo, matHull);
    pod.position.set(side * 2.1, turretY + 0.2, 1.2);
    podGroup.add(pod);

    // Front angled plate
    const frontPlateGeo = new THREE.BoxGeometry(1.2, 1.4, 0.4);
    const frontPlate = new THREE.Mesh(frontPlateGeo, matHull);
    frontPlate.position.set(side * 2.1, turretY + 0.2, 2.2);
    frontPlate.rotation.x = -Math.PI / 8;
    podGroup.add(frontPlate);

    // Sensor/Light cylinder on the front
    const sensorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const sensor = new THREE.Mesh(sensorGeo, matMetal);
    sensor.rotation.x = Math.PI / 2;
    sensor.position.set(side * 1.8, turretY + 0.4, 2.4);
    podGroup.add(sensor);

    const sensorLens = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), matGlass);
    sensorLens.position.set(side * 1.8, turretY + 0.4, 2.6);
    podGroup.add(sensorLens);

    turretGroup.add(podGroup);
}

createSidePod(true);
createSidePod(false);

// --- Turret Top Details (Cupola, Hatch, Periscope) ---
// Commander's Cupola (Right side)
const cupolaBaseGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.6, 16);
const cupolaBase = new THREE.Mesh(cupolaBaseGeo, matHull);
cupolaBase.position.set(0.8, turretY + 2.8, -0.5);
turretGroup.add(cupolaBase);

const cupolaDomeGeo = new THREE.SphereGeometry(0.9, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
const cupolaDome = new THREE.Mesh(cupolaDomeGeo, matTurret);
cupolaDome.position.set(0.8, turretY + 3.1, -0.5);
turretGroup.add(cupolaDome);

const hatchGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 16);
const hatch = new THREE.Mesh(hatchGeo, matMetal);
hatch.position.set(0.8, turretY + 3.55, -0.5);
turretGroup.add(hatch);

// Periscope / Viewport (Front of turret top)
const periscopeBaseGeo = new THREE.BoxGeometry(1.2, 0.4, 1.0);
const periscopeBase = new THREE.Mesh(periscopeBaseGeo, matHull);
periscopeBase.position.set(0, turretY + 2.6, 1.2);
turretGroup.add(periscopeBase);

const periscopeGlassGeo = new THREE.BoxGeometry(0.9, 0.2, 0.1);
const periscopeGlass = new THREE.Mesh(periscopeGlassGeo, matGlass);
periscopeGlass.position.set(0, turretY + 2.6, 1.7);
turretGroup.add(periscopeGlass);

// Grab Handles (Torus shapes on the sides of the turret)
const handleGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 16, Math.PI);
const handleLeft = new THREE.Mesh(handleGeo, matMetal);
handleLeft.position.set(-2.4, turretY + 1.5, 0.5);
handleLeft.rotation.y = Math.PI / 2;
turretGroup.add(handleLeft);

const handleRight = new THREE.Mesh(handleGeo, matMetal);
handleRight.position.set(2.4, turretY + 1.5, 0.5);
handleRight.rotation.y = -Math.PI / 2;
turretGroup.add(handleRight);

tankGroup.add(turretGroup);

// --- Exhaust Pipes, Antennas, and Secondary Weapons ---
const accessoriesGroup = new THREE.Group();

// Large Exhaust Pipe (Center-left)
const exhaust1Geo = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 16);
const exhaust1 = new THREE.Mesh(exhaust1Geo, matMetal);
exhaust1.position.set(-1.0, turretY + 2.0, -1.5);
exhaust1.rotation.x = -0.2;
accessoriesGroup.add(exhaust1);

// Exhaust Pipe Cap
const exhaustCapGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16);
const exhaustCap = new THREE.Mesh(exhaustCapGeo, matDark);
exhaustCap.position.set(-1.0, turretY + 3.25, -1.75);
exhaustCap.rotation.x = -0.2;
accessoriesGroup.add(exhaustCap);

// Secondary Gun / Launcher (Right side cluster)
const launcherBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
const launcherBase = new THREE.Mesh(launcherBaseGeo, matMetal);
launcherBase.position.set(1.6, turretY + 1.8, -1.0);
launcherBase.rotation.x = -0.4;
accessoriesGroup.add(launcherBase);

// Launcher Barrels (Cluster of small cylinders)
const barrelClusterGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.8, 8);
for (let i = 0; i < 4; i++) {
    const barrel = new THREE.Mesh(barrelClusterGeo, matHull);
    const offset = (i - 1.5) * 0.25;
    barrel.position.set(1.6 + offset, turretY + 2.5, -1.6);
    barrel.rotation.x = -0.4;
    accessoriesGroup.add(barrel);
}

// Another Pipe (Left side, smaller)
const pipe2Geo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 12);
const pipe2 = new THREE.Mesh(pipe2Geo, matMetal);
pipe2.position.set(-1.8, turretY + 1.5, -1.0);
pipe2.rotation.x = -0.6;
accessoriesGroup.add(pipe2);

// Antenna Base
const antennaBaseGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
const antennaBase = new THREE.Mesh(antennaBaseGeo, matHull);
antennaBase.position.set(0.2, turretY + 3.0, -1.0);
accessoriesGroup.add(antennaBase);

// Long Antenna
const antennaGeo = new THREE.CylinderGeometry(0.04, 0.04, 6, 8);
const antenna = new THREE.Mesh(antennaGeo, matMetal);
antenna.position.set(0.2, turretY + 6.0, -1.0);
antenna.rotation.x = -0.15;
antenna.rotation.z = 0.1;
accessoriesGroup.add(antenna);

// Antenna Tip
const antennaTipGeo = new THREE.SphereGeometry(0.08, 8, 8);
const antennaTip = new THREE.Mesh(antennaTipGeo, matMetal);
antennaTip.position.set(0.2, turretY + 9.0, -1.5); // Approximate tip position
accessoriesGroup.add(antennaTip);

// Rear Stowage Box
const stowageGeo = new THREE.BoxGeometry(2.0, 0.8, 1.2);
const stowage = new THREE.Mesh(stowageGeo, matHull);
stowage.position.set(0, turretY + 1.0, -2.5);
stowage.rotation.x = 0.1;
accessoriesGroup.add(stowage);

tankGroup.add(accessoriesGroup);

// ==========================================
// 3. Final Scene Assembly
// ==========================================

// Add the entire tank to the scene
scene.add(tankGroup);

// Adjust camera to match the 3/4 isometric view of the reference image
camera.position.set(15, 12, 15);
camera.lookAt(0, 3, 0);