// ==================== PARAMETERS ====================
// Overall tank dimensions (Metal Slug SV-001 style chibi tank)
const TANK_TOTAL_WIDTH = 14;
const TANK_TOTAL_LENGTH = 17;
const GROUND_Y = 0;

// Lower hull
const HULL_WIDTH = 8.4;
const HULL_LENGTH = 14;
const HULL_HEIGHT = 5;
const HULL_BOTTOM_Y = 1;
const HULL_TOP_Y = HULL_BOTTOM_Y + HULL_HEIGHT; // Top of hull at Y=6

// Track assemblies
const TRACK_WIDTH = 2.8;
const TRACK_LENGTH = TANK_TOTAL_LENGTH;
const WHEEL_RADIUS = 2.2;
const WHEEL_THICKNESS = 2.2;
const CLEAT_SIZE = { x: 2.4, y: 0.6, z: 0.8 };
const CLEAT_SPACING = 2;

// Turret (domed sphere half-submerged in hull)
const TURRET_SPHERE_RADIUS = 4.2;
const TURRET_CENTER_Y = HULL_TOP_Y; // Sphere center at hull top, lower half hidden inside hull
const CANNON_LENGTH = 5;
const CANNON_RADIUS = 1.2;

// Rear turret fittings
const EXHAUST_HEIGHT = 4.5;
const EXHAUST_RADIUS = 0.3;
const MAIN_ANTENNA_LENGTH = 8;
const MAIN_ANTENNA_RADIUS = 0.06;
const SHORT_ANTENNA_LENGTH = 3;
const SHORT_ANTENNA_RADIUS = 0.05;
const ANGLED_PIPE_LENGTH = 3;
const ANGLED_PIPE_RADIUS = 0.25;
const MINIGUN_BARREL_COUNT = 6;
const MINIGUN_BARREL_RADIUS = 0.12;
const MINIGUN_BARREL_LENGTH = 4;
const MINIGUN_BARREL_SPREAD = 0.4;

// ==================== MATERIAL ====================
// Single medium gray metallic material matching CAD-style reference render
const tankMat = new THREE.MeshStandardMaterial({
    color: 0xb5bac0,
    metalness: 0.6,
    roughness: 0.5,
});

// ==================== MAIN TANK GROUP ====================
const tank = new THREE.Group();
scene.add(tank);

// ==================== LOWER HULL CONSTRUCTION ====================
// Main hull body
const hullGeo = new THREE.BoxGeometry(HULL_WIDTH, HULL_HEIGHT, HULL_LENGTH);
const hull = new THREE.Mesh(hullGeo, tankMat);
hull.position.y = HULL_BOTTOM_Y + HULL_HEIGHT / 2;
tank.add(hull);

// Sloped front glacis armor plate
const glacisGeo = new THREE.BoxGeometry(HULL_WIDTH, 5.1, 1.5);
const glacis = new THREE.Mesh(glacisGeo, tankMat);
glacis.position.set(0, HULL_BOTTOM_Y + 2.5, -HULL_LENGTH / 2 - 0.75);
glacis.rotation.x = 0.2; // Angle downward toward front
tank.add(glacis);

// Front lower applique armor blocks
const armorBlockGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
for (let i = 0; i < 6; i++) {
    const block = new THREE.Mesh(armorBlockGeo, tankMat);
    block.position.set(
        -3 + i * 1.2,
        HULL_BOTTOM_Y + 0.2,
        -HULL_LENGTH / 2 - 1.2
    );
    tank.add(block);
}

// Cannon mantlet cover on hull top
const mantletGeo = new THREE.BoxGeometry(2, 1, 1.5);
const mantlet = new THREE.Mesh(mantletGeo, tankMat);
mantlet.position.set(0, HULL_TOP_Y + 0.5, -4);
tank.add(mantlet);

// Front left headlight
const headlightBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12);
const headlightBase = new THREE.Mesh(headlightBaseGeo, tankMat);
headlightBase.position.set(-2.5, HULL_TOP_Y + 0.15, -4.5);
tank.add(headlightBase);
const headlightGeo = new THREE.SphereGeometry(0.4, 16, 16);
const headlight = new THREE.Mesh(headlightGeo, tankMat);
headlight.position.set(-2.5, HULL_TOP_Y + 0.6, -4.5);
tank.add(headlight);

// ==================== TRACK ASSEMBLY CONSTRUCTION ====================
/**
 * Create a complete track assembly for one side
 * @param {number} side - 1 for right side, -1 for left side
 */
function createTrack(side) {
    const trackGroup = new THREE.Group();

    // Main track frame
    const frameGeo = new THREE.BoxGeometry(TRACK_WIDTH - 0.4, 3.4, TRACK_LENGTH - 2);
    const frame = new THREE.Mesh(frameGeo, tankMat);
    frame.position.y = 1 + 3.4 / 2;
    trackGroup.add(frame);

    /** Create a single road/drive wheel */
    function createWheel(zPos) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(0, WHEEL_RADIUS, zPos);

        // Main wheel body
        const wheelGeo = new THREE.CylinderGeometry(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_THICKNESS, 24);
        const wheel = new THREE.Mesh(wheelGeo, tankMat);
        wheel.rotation.z = -Math.PI / 2 * side; // Align axle along left/right (X) axis
        wheelGroup.add(wheel);

        // Outer rim detail
        const rimGeo = new THREE.TorusGeometry(WHEEL_RADIUS - 0.15, 0.15, 8, 24);
        const rim = new THREE.Mesh(rimGeo, tankMat);
        rim.rotation.y = Math.PI / 2;
        rim.position.x = side * (WHEEL_THICKNESS / 2 - 0.1);
        wheelGroup.add(rim);

        // Inner hub
        const hubGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
        const hub = new THREE.Mesh(hubGeo, tankMat);
        hub.rotation.z = -Math.PI / 2 * side;
        hub.position.x = side * (WHEEL_THICKNESS / 2 - 0.1);
        wheelGroup.add(hub);

        // Hub center cap
        const capGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 12);
        const cap = new THREE.Mesh(capGeo, tankMat);
        cap.rotation.z = -Math.PI / 2 * side;
        cap.position.x = side * (WHEEL_THICKNESS / 2);
        wheelGroup.add(cap);

        // Bolt heads around hub
        const boltGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 6);
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2;
            const bolt = new THREE.Mesh(boltGeo, tankMat);
            bolt.rotation.z = -Math.PI / 2 * side;
            bolt.position.set(
                side * (WHEEL_THICKNESS / 2 - 0.05),
                Math.cos(angle) * 1.0,
                Math.sin(angle) * 1.0
            );
            wheelGroup.add(bolt);
        }

        return wheelGroup;
    }

    // Add front and rear wheels
    trackGroup.add(createWheel(-6));
    trackGroup.add(createWheel(6));

    // Add track cleats (spiked treads)
    const cleatGeo = new THREE.BoxGeometry(CLEAT_SIZE.x, CLEAT_SIZE.y, CLEAT_SIZE.z);
    // Lower run (ground contact, spikes pointing down)
    for (let z = -5; z <= 5; z += CLEAT_SPACING) {
        const cleat = new THREE.Mesh(cleatGeo, tankMat);
        cleat.position.set(0, -CLEAT_SIZE.y / 2, z);
        trackGroup.add(cleat);
    }
    // Upper run (spikes pointing up)
    for (let z = -5; z <= 5; z += CLEAT_SPACING) {
        const cleat = new THREE.Mesh(cleatGeo, tankMat);
        cleat.position.set(0, 4.4 + CLEAT_SIZE.y / 2, z);
        trackGroup.add(cleat);
    }
    // Front wheel curved section cleats
    for (let angle = -Math.PI / 2; angle <= Math.PI / 2; angle += Math.PI / 4) {
        const cleat = new THREE.Mesh(cleatGeo, tankMat);
        const cy = WHEEL_RADIUS, cz = -6;
        cleat.position.set(
            0,
            cy + Math.sin(angle) * (WHEEL_RADIUS + CLEAT_SIZE.y / 2),
            cz + Math.cos(angle) * (WHEEL_RADIUS + CLEAT_SIZE.y / 2)
        );
        cleat.rotation.z = angle;
        trackGroup.add(cleat);
    }
    // Rear wheel curved section cleats
    for (let angle = Math.PI / 2; angle <= 3 * Math.PI / 2; angle += Math.PI / 4) {
        const cleat = new THREE.Mesh(cleatGeo, tankMat);
        const cy = WHEEL_RADIUS, cz = 6;
        cleat.position.set(
            0,
            cy + Math.sin(angle) * (WHEEL_RADIUS + CLEAT_SIZE.y / 2),
            cz + Math.cos(angle) * (WHEEL_RADIUS + CLEAT_SIZE.y / 2)
        );
        cleat.rotation.z = angle;
        trackGroup.add(cleat);
    }

    // Sloped fender armor
    const fenderGeo = new THREE.BoxGeometry(3, 0.4, 4);
    const frontFender = new THREE.Mesh(fenderGeo, tankMat);
    frontFender.position.set(0, 4.8, -5);
    frontFender.rotation.x = -0.3;
    trackGroup.add(frontFender);
    const rearFender = new THREE.Mesh(fenderGeo, tankMat);
    rearFender.position.set(0, 4.8, 5);
    rearFender.rotation.x = 0.3;
    trackGroup.add(rearFender);

    // Outer fender spikes
    const spikeGeo = new THREE.BoxGeometry(3, 1, 0.4);
    const frontSpike = new THREE.Mesh(spikeGeo, tankMat);
    frontSpike.position.set(0, 3.5, -7.5);
    frontSpike.rotation.x = -0.5;
    trackGroup.add(frontSpike);
    const rearSpike = new THREE.Mesh(spikeGeo, tankMat);
    rearSpike.position.set(0, 3.5, 7.5);
    rearSpike.rotation.x = 0.5;
    trackGroup.add(rearSpike);

    return trackGroup;
}

// Attach left and right tracks
const leftTrack = createTrack(-1);
leftTrack.position.x = -(TANK_TOTAL_WIDTH / 2) + TRACK_WIDTH / 2;
tank.add(leftTrack);
const rightTrack = createTrack(1);
rightTrack.position.x = (TANK_TOTAL_WIDTH / 2) - TRACK_WIDTH / 2;
tank.add(rightTrack);

// ==================== TURRET ASSEMBLY CONSTRUCTION ====================
const turret = new THREE.Group();
turret.position.set(0, TURRET_CENTER_Y, 0);
tank.add(turret);

// Main domed turret (lower half is completely hidden inside hull, no clipping needed)
const turretDomeGeo = new THREE.SphereGeometry(TURRET_SPHERE_RADIUS, 32, 32);
const turretDome = new THREE.Mesh(turretDomeGeo, tankMat);
turret.add(turretDome);

// Main forward cannon
const cannonGroup = new THREE.Group();
cannonGroup.rotation.x = -Math.PI / 2; // Point cannon along -Z (forward)
cannonGroup.position.z = -TURRET_SPHERE_RADIUS - CANNON_LENGTH / 2 + 0.2; // Slight penetration to avoid gaps
const cannonBarrelGeo = new THREE.CylinderGeometry(CANNON_RADIUS, CANNON_RADIUS, CANNON_LENGTH, 24);
const cannonBarrel = new THREE.Mesh(cannonBarrelGeo, tankMat);
cannonGroup.add(cannonBarrel);

// Muzzle brake
const muzzleGeo = new THREE.CylinderGeometry(CANNON_RADIUS + 0.2, CANNON_RADIUS + 0.2, 0.6, 24);
const muzzle = new THREE.Mesh(muzzleGeo, tankMat);
muzzle.position.y = CANNON_LENGTH / 2 - 0.3;
cannonGroup.add(muzzle);

// Muzzle slot details (notched look)
const muzzleSlotGeo = new THREE.BoxGeometry(0.2, 0.3, 0.4);
for (let i = 0; i < 4; i++) {
    const slot = new THREE.Mesh(muzzleSlotGeo, tankMat);
    const angle = i * Math.PI / 2;
    slot.position.set(
        Math.cos(angle) * (CANNON_RADIUS - 0.1),
        CANNON_LENGTH / 2 + 0.1,
        Math.sin(angle) * (CANNON_RADIUS - 0.1)
    );
    cannonGroup.add(slot);
}

// Cannon base ring
const cannonRingGeo = new THREE.TorusGeometry(CANNON_RADIUS + 0.1, 0.15, 8, 24);
const cannonRing = new THREE.Mesh(cannonRingGeo, tankMat);
cannonRing.rotation.x = Math.PI / 2;
cannonRing.position.y = -CANNON_LENGTH / 2 + 0.2;
cannonGroup.add(cannonRing);
turret.add(cannonGroup);

// Curved grab handles on turret front (U-shaped half toruses)
function createGrabHandle(x, z, rotY) {
    const handleGeo = new THREE.TorusGeometry(1.0, 0.15, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeo, tankMat);
    handle.position.set(x, 0, z);
    handle.rotation.y = rotY;
    handle.rotation.x = Math.PI / 2;
    turret.add(handle);
}
createGrabHandle(-1.4, -3.0, Math.PI / 2);  // Left of cannon
createGrabHandle(1.1, -2.0, -Math.PI / 2);  // Right upper
createGrabHandle(1.3, -0.8, -Math.PI / 2);  // Right lower

// Top access hatch
const hatchGeo = new THREE.BoxGeometry(3, 0.3, 3);
const hatch = new THREE.Mesh(hatchGeo, tankMat);
hatch.position.set(0, 3.8, 0);
turret.add(hatch);
// Hatch handles
const hatchHandleGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 12, Math.PI);
const hatchHandle1 = new THREE.Mesh(hatchHandleGeo, tankMat);
hatchHandle1.position.set(-0.7, 4.0, 0);
hatchHandle1.rotation.x = Math.PI / 2;
turret.add(hatchHandle1);
const hatchHandle2 = new THREE.Mesh(hatchHandleGeo, tankMat);
hatchHandle2.position.set(0.7, 4.0, 0);
hatchHandle2.rotation.x = Math.PI / 2;
turret.add(hatchHandle2);

// Forward-facing periscope sight
const periscopeGroup = new THREE.Group();
periscopeGroup.position.set(0, 4.0, 0);
periscopeGroup.rotation.x = -0.2; // Tilt slightly upward
const periscopeBaseGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
const periscopeBase = new THREE.Mesh(periscopeBaseGeo, tankMat);
periscopeBase.position.y = 0.2;
periscopeGroup.add(periscopeBase);
const periscopeBodyGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 20, 1, true); // Open tube
const periscopeBody = new THREE.Mesh(periscopeBodyGeo, tankMat);
periscopeBody.rotation.x = -Math.PI / 2; // Point forward
periscopeBody.position.y = 1.0;
periscopeGroup.add(periscopeBody);
const periscopeLensGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
const periscopeLens = new THREE.Mesh(periscopeLensGeo, tankMat);
periscopeLens.rotation.x = -Math.PI / 2;
periscopeLens.position.set(0, 1.0, -0.7);
periscopeGroup.add(periscopeLens);
turret.add(periscopeGroup);

// Left side sensor ports
const portGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
const leftPort1 = new THREE.Mesh(portGeo, tankMat);
leftPort1.rotation.z = Math.PI / 2; // Face left
leftPort1.position.set(-TURRET_SPHERE_RADIUS + 0.1, 1.0, 0);
turret.add(leftPort1);
const leftPort2 = new THREE.Mesh(portGeo, tankMat);
leftPort2.rotation.z = Math.PI / 2;
leftPort2.position.set(-TURRET_SPHERE_RADIUS + 0.1, -1.0, 0);
turret.add(leftPort2);

// Right side sensor box
const sensorBoxGeo = new THREE.BoxGeometry(1.6, 2.8, 2.4);
const sensorBox = new THREE.Mesh(sensorBoxGeo, tankMat);
sensorBox.position.set(TURRET_SPHERE_RADIUS - 0.3, 0, 0);
turret.add(sensorBox);
// Sensors on box face
const boxSensorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
const rightSensor1 = new THREE.Mesh(boxSensorGeo, tankMat);
rightSensor1.rotation.z = -Math.PI / 2; // Face right
rightSensor1.position.set(TURRET_SPHERE_RADIUS + 0.5, 0.8, 0);
turret.add(rightSensor1);
const rightSensor2 = new THREE.Mesh(boxSensorGeo, tankMat);
rightSensor2.rotation.z = -Math.PI / 2;
rightSensor2.position.set(TURRET_SPHERE_RADIUS + 0.5, -0.8, 0);
turret.add(rightSensor2);

// Rear angled equipment base block
const rearBaseGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
const rearBase = new THREE.Mesh(rearBaseGeo, tankMat);
rearBase.position.set(0, 3.2, 2.0);
rearBase.rotation.x = -0.3;
rearBase.rotation.z = 0.1;
turret.add(rearBase);

// Dual vertical exhaust pipes
function createExhaust(xPos) {
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(xPos, 2.5, 3.0);
    const exhaustGeo = new THREE.CylinderGeometry(EXHAUST_RADIUS, EXHAUST_RADIUS, EXHAUST_HEIGHT, 12);
    const exhaust = new THREE.Mesh(exhaustGeo, tankMat);
    exhaust.position.y = EXHAUST_HEIGHT / 2;
    exhaustGroup.add(exhaust);
    const capGeo = new THREE.CylinderGeometry(EXHAUST_RADIUS + 0.05, EXHAUST_RADIUS + 0.05, 0.15, 12);
    const cap = new THREE.Mesh(capGeo, tankMat);
    cap.position.y = EXHAUST_HEIGHT;
    exhaustGroup.add(cap);
    return exhaustGroup;
}
turret.add(createExhaust(-0.4));
turret.add(createExhaust(0.4));

// Main long whip antenna
const mainAntennaGroup = new THREE.Group();
mainAntennaGroup.position.set(0.5, 4.0, 2.6);
mainAntennaGroup.rotation.x = -0.2;  // Tilt backward
mainAntennaGroup.rotation.z = 0.15; // Tilt right
const mainAntennaGeo = new THREE.CylinderGeometry(MAIN_ANTENNA_RADIUS, MAIN_ANTENNA_RADIUS, MAIN_ANTENNA_LENGTH, 8);
const mainAntenna = new THREE.Mesh(mainAntennaGeo, tankMat);
mainAntenna.position.y = MAIN_ANTENNA_LENGTH / 2;
mainAntennaGroup.add(mainAntenna);
const antennaTipGeo = new THREE.SphereGeometry(0.15, 12, 12);
const mainAntennaTip = new THREE.Mesh(antennaTipGeo, tankMat);
mainAntennaTip.position.y = MAIN_ANTENNA_LENGTH;
mainAntennaGroup.add(mainAntennaTip);
turret.add(mainAntennaGroup);

// Short secondary antenna
const shortAntennaGroup = new THREE.Group();
shortAntennaGroup.position.set(1.0, 3.8, 2.7);
shortAntennaGroup.rotation.x = -0.25;
shortAntennaGroup.rotation.z = 0.1;
const shortAntennaGeo = new THREE.CylinderGeometry(SHORT_ANTENNA_RADIUS, SHORT_ANTENNA_RADIUS, SHORT_ANTENNA_LENGTH, 8);
const shortAntenna = new THREE.Mesh(shortAntennaGeo, tankMat);
shortAntenna.position.y = SHORT_ANTENNA_LENGTH / 2;
shortAntennaGroup.add(shortAntenna);
const shortAntennaTip = new THREE.Mesh(antennaTipGeo, tankMat);
shortAntennaTip.position.y = SHORT_ANTENNA_LENGTH;
shortAntennaGroup.add(shortAntennaTip);
turret.add(shortAntennaGroup);

// Angled vent pipe
const angledPipeGroup = new THREE.Group();
angledPipeGroup.position.set(2.0, 1.5, 2.5);
angledPipeGroup.rotation.x = -0.5;
angledPipeGroup.rotation.z = -0.3;
const angledPipeGeo = new THREE.CylinderGeometry(ANGLED_PIPE_RADIUS, ANGLED_PIPE_RADIUS, ANGLED_PIPE_LENGTH, 12);
const angledPipe = new THREE.Mesh(angledPipeGeo, tankMat);
angledPipe.position.y = ANGLED_PIPE_LENGTH / 2;
angledPipeGroup.add(angledPipe);
turret.add(angledPipeGroup);

// Right rear minigun (Gatling cannon)
const minigunGroup = new THREE.Group();
minigunGroup.position.set(3.0, -0.5, 2.5);
// Ball joint mount
const ballMountGeo = new THREE.SphereGeometry(0.7, 16, 16);
const ballMount = new THREE.Mesh(ballMountGeo, tankMat);
minigunGroup.add(ballMount);
// Aim rotation group
const minigunAim = new THREE.Group();
minigunAim.rotation.x = -0.6; // Tilt upward
minigunAim.rotation.z = 0.5;  // Tilt right
minigunGroup.add(minigunAim);
// Minigun hub
const minigunHubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16);
const minigunHub = new THREE.Mesh(minigunHubGeo, tankMat);
minigunHub.rotation.x = -Math.PI / 2; // Point away from turret
minigunHub.position.z = -0.5;
minigunAim.add(minigunHub);
// Rotating barrel cluster
const barrelGeo = new THREE.CylinderGeometry(MINIGUN_BARREL_RADIUS, MINIGUN_BARREL_RADIUS, MINIGUN_BARREL_LENGTH, 8);
for (let i = 0; i < MINIGUN_BARREL_COUNT; i++) {
    const angle = (i / MINIGUN_BARREL_COUNT) * Math.PI * 2;
    const barrel = new THREE.Mesh(barrelGeo, tankMat);
    barrel.rotation.x = -Math.PI / 2;
    barrel.position.set(
        Math.cos(angle) * MINIGUN_BARREL_SPREAD,
        Math.sin(angle) * MINIGUN_BARREL_SPREAD,
        -1.0 - MINIGUN_BARREL_LENGTH / 2
    );
    minigunAim.add(barrel);
}
// Barrel retaining clamps
const clampGeo = new THREE.TorusGeometry(MINIGUN_BARREL_SPREAD + MINIGUN_BARREL_RADIUS, 0.08, 8, 16);
const clamp1 = new THREE.Mesh(clampGeo, tankMat);
clamp1.rotation.x = Math.PI / 2;
clamp1.position.z = -1.5;
minigunAim.add(clamp1);
const clamp2 = new THREE.Mesh(clampGeo, tankMat);
clamp2.rotation.x = Math.PI / 2;
clamp2.position.z = -1.0 - MINIGUN_BARREL_LENGTH + 0.5;
minigunAim.add(clamp2);
turret.add(minigunGroup);

// Small bent exhaust pipe next to minigun
const smallExhaustGroup = new THREE.Group();
smallExhaustGroup.position.set(3.2, 0.5, 1.5);
const exhaustLowerGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 10);
const exhaustLower = new THREE.Mesh(exhaustLowerGeo, tankMat);
exhaustLower.position.y = 0.6;
smallExhaustGroup.add(exhaustLower);
const exhaustUpperGroup = new THREE.Group();
exhaustUpperGroup.position.y = 1.2;
exhaustUpperGroup.rotation.z = 0.6;
const exhaustUpperGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 10);
const exhaustUpper = new THREE.Mesh(exhaustUpperGeo, tankMat);
exhaustUpper.position.y = 0.4;
exhaustUpperGroup.add(exhaustUpper);
smallExhaustGroup.add(exhaustUpperGroup);
turret.add(smallExhaustGroup);

// ==================== CAMERA POSITION ====================
// Set 3/4 isometric-style view matching reference angle
camera.position.set(28, 22, -32);
camera.lookAt(0, 6, 0);
controls.target.set(0, 6, 0);