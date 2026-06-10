// Industrial UFO High-Bay LED Light Fixture
// Parametric recreation of a warehouse light with radial heat-sink fins,
// central driver housing, angled mounting arm, and circular junction-box plate.

// ---------- Parameters ----------
const heatSinkRadius = 10.0;
const heatSinkHeight = 1.2;
const housingRadius = 3.8;
const housingHeight = 3.5;
const armLength = 13.0;
const armRadius = 1.0;
const mountPlateRadius = 7.5;
const mountPlateThickness = 0.6;
const finCount = 40;
const finHeight = 2.0;
const finThickness = 0.15;

// ---------- Materials ----------
const metalMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.3,
    metalness: 0.75
});
const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.6
});

// ---------- Master Group ----------
const fixture = new THREE.Group();

// ---------- 1. Heat Sink Base (main circular disc) ----------
const baseGeom = new THREE.CylinderGeometry(heatSinkRadius, heatSinkRadius, heatSinkHeight, 64);
const base = new THREE.Mesh(baseGeom, metalMat);
fixture.add(base);

// ---------- 2. Radial Cooling Fins (underside) ----------
const finInnerR = housingRadius + 0.5;
const finOuterR = heatSinkRadius - 0.3;
const finMidR = (finInnerR + finOuterR) * 0.5;
const finLen = finOuterR - finInnerR;

for (let i = 0; i < finCount; i++) {
    const angle = (i / finCount) * Math.PI * 2;
    const finGeom = new THREE.BoxGeometry(finThickness, finHeight, finLen);
    const fin = new THREE.Mesh(finGeom, metalMat);
    fin.position.set(
        Math.cos(angle) * finMidR,
        -heatSinkHeight * 0.5 - finHeight * 0.5,
        Math.sin(angle) * finMidR
    );
    fin.rotation.y = -angle;
    fixture.add(fin);
}

// ---------- 3. Outer Rim Ring ----------
const rimGeom = new THREE.TorusGeometry(heatSinkRadius, 0.25, 16, 64);
const rim = new THREE.Mesh(rimGeom, metalMat);
rim.rotation.x = Math.PI / 2;
rim.position.y = -heatSinkHeight * 0.5 - finHeight;
fixture.add(rim);

// ---------- 4. Central Driver Housing ----------
const housingGeom = new THREE.CylinderGeometry(housingRadius, housingRadius, housingHeight, 32);
const housing = new THREE.Mesh(housingGeom, metalMat);
housing.position.y = heatSinkHeight * 0.5 + housingHeight * 0.5;
fixture.add(housing);

// Slight overhang cap on housing
const capGeom = new THREE.CylinderGeometry(housingRadius + 0.3, housingRadius, 0.4, 32);
const cap = new THREE.Mesh(capGeom, metalMat);
cap.position.y = heatSinkHeight * 0.5 + housingHeight + 0.2;
fixture.add(cap);

// ---------- 5. Housing Top Details (vent slots) ----------
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const slotGeom = new THREE.BoxGeometry(0.6, 0.05, 0.2);
    const slot = new THREE.Mesh(slotGeom, darkMetalMat);
    slot.position.set(
        Math.cos(angle) * (housingRadius - 0.8),
        heatSinkHeight * 0.5 + housingHeight + 0.05,
        Math.sin(angle) * (housingRadius - 0.8)
    );
    slot.rotation.y = -angle;
    fixture.add(slot);
}

// ---------- 6. Mounting Arm Assembly ----------
const armGroup = new THREE.Group();
// Attach to side of housing, slightly above mid-height
armGroup.position.set(housingRadius - 0.2, heatSinkHeight * 0.5 + housingHeight * 0.6, 0);

// Joint coupling (hexagonal)
const couplingGeom = new THREE.CylinderGeometry(armRadius * 1.5, armRadius * 1.5, 1.2, 6);
const coupling = new THREE.Mesh(couplingGeom, darkMetalMat);
coupling.rotation.z = Math.PI / 2;
armGroup.add(coupling);

// Through bolt
const boltGeom = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 8);
const bolt = new THREE.Mesh(boltGeom, darkMetalMat);
bolt.rotation.z = Math.PI / 2;
armGroup.add(bolt);

// Arm tube
const armGeom = new THREE.CylinderGeometry(armRadius, armRadius, armLength, 16);
const arm = new THREE.Mesh(armGeom, metalMat);
arm.rotation.z = Math.PI / 2;
arm.position.x = armLength * 0.5;
armGroup.add(arm);

// Circular mounting plate at arm end
const plateGeom = new THREE.CylinderGeometry(mountPlateRadius, mountPlateRadius, mountPlateThickness, 32);
const plate = new THREE.Mesh(plateGeom, metalMat);
plate.rotation.z = Math.PI / 2;
plate.position.x = armLength;
armGroup.add(plate);

// Raised hub on mounting plate
const bossGeom = new THREE.CylinderGeometry(2.0, 2.0, mountPlateThickness + 0.3, 16);
const boss = new THREE.Mesh(bossGeom, metalMat);
boss.rotation.z = Math.PI / 2;
boss.position.x = armLength - 0.15;
armGroup.add(boss);

// Angle arm upward ~30°
armGroup.rotation.z = Math.PI / 6;
fixture.add(armGroup);

// ---------- 7. Support Rods / Safety Wires ----------
const rodLength = 10.5;
const rodGeom = new THREE.CylinderGeometry(0.08, 0.08, rodLength, 6);

const rod1 = new THREE.Mesh(rodGeom, darkMetalMat);
rod1.position.set(8.0, 5.5, 1.5);
rod1.rotation.z = 0.55;
rod1.rotation.x = 0.15;
fixture.add(rod1);

const rod2 = new THREE.Mesh(rodGeom, darkMetalMat);
rod2.position.set(8.0, 5.5, -1.5);
rod2.rotation.z = 0.55;
rod2.rotation.x = -0.15;
fixture.add(rod2);

// ---------- Add to Scene ----------
scene.add(fixture);

// ---------- Camera ----------
camera.position.set(30, 25, 30);
camera.lookAt(5, 8, 0);