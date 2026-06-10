// ============================================================
// Manual Coffee Grinder Recreation
// ============================================================

// --- Parameters ---
const baseSize = 8;               // Width/depth of main body
const baseHeight = 6;             // Height of main body
const plinthHeight = 0.5;         // Bottom molding height
const plinthOverhang = 0.6;       // How much plinth extends past body
const plateSize = 11;             // Top platform width/depth
const plateHeight = 0.8;          // Top platform thickness
const hopperTopR = 4.5;           // Hopper top opening radius
const hopperBotR = 3.0;           // Hopper bottom radius
const hopperHeight = 4.5;         // Hopper wall height
const shaftRadius = 0.7;          // Central drive shaft radius
const shaftHeight = 6.2;          // Shaft protruding above plate
const crankLength = 5.5;          // Crank arm length
const crankWidth = 1.2;           // Crank arm width
const crankThick = 0.35;          // Crank arm thickness
const knobRadius = 0.7;           // Crank ball-knob radius

// --- Materials ---
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.1 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.2 });

// --- Base Plinth (bottom molding) ---
const plinthGeo = new THREE.BoxGeometry(baseSize + plinthOverhang * 2, plinthHeight, baseSize + plinthOverhang * 2);
const plinth = new THREE.Mesh(plinthGeo, bodyMat);
plinth.position.y = plinthHeight / 2;
scene.add(plinth);

// --- Main Body (square box) ---
const bodyGeo = new THREE.BoxGeometry(baseSize, baseHeight, baseSize);
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = plinthHeight + baseHeight / 2;
scene.add(body);

// --- Base Molding (thin strip between body and plinth) ---
const moldGeo = new THREE.BoxGeometry(baseSize + 0.2, 0.3, baseSize + 0.2);
const molding = new THREE.Mesh(moldGeo, bodyMat);
molding.position.y = plinthHeight + 0.15;
scene.add(molding);

// --- Drawer Front ---
const drawerW = 5.0;
const drawerH = 3.5;
const drawerD = 0.25;
const drawerGeo = new THREE.BoxGeometry(drawerW, drawerH, drawerD);
const drawer = new THREE.Mesh(drawerGeo, darkMat);
// Positioned on front face (positive Z) of main body
drawer.position.set(0, plinthHeight + baseHeight / 2 - 0.3, baseSize / 2 + drawerD / 2);
scene.add(drawer);

// --- Drawer Knob ---
const drawerKnobGeo = new THREE.SphereGeometry(0.45, 16, 16);
const drawerKnob = new THREE.Mesh(drawerKnobGeo, bodyMat);
drawerKnob.position.set(0, plinthHeight + baseHeight / 2 - 0.3, baseSize / 2 + drawerD + 0.35);
scene.add(drawerKnob);

// --- Top Platform (overhanging square plate) ---
const plateGeo = new THREE.BoxGeometry(plateSize, plateHeight, plateSize);
const plate = new THREE.Mesh(plateGeo, bodyMat);
const plateY = plinthHeight + baseHeight + plateHeight / 2;
plate.position.y = plateY;
scene.add(plate);

// --- Hopper Seat (raised ring on top plate where hopper rests) ---
const seatGeo = new THREE.CylinderGeometry(hopperBotR + 0.3, hopperBotR + 0.3, 0.2, 32);
const seat = new THREE.Mesh(seatGeo, darkMat);
seat.position.y = plateY + plateHeight / 2 + 0.1;
scene.add(seat);

// --- Hopper (conical bowl) ---
const hopperGeo = new THREE.CylinderGeometry(hopperTopR, hopperBotR, hopperHeight, 32);
const hopper = new THREE.Mesh(hopperGeo, bodyMat);
const hopperY = plateY + plateHeight / 2 + hopperHeight / 2;
hopper.position.y = hopperY;
scene.add(hopper);

// --- Hopper Top Rim (torus lip) ---
const rimGeo = new THREE.TorusGeometry(hopperTopR, 0.15, 8, 32);
const rim = new THREE.Mesh(rimGeo, bodyMat);
rim.position.y = hopperY + hopperHeight / 2;
rim.rotation.x = Math.PI / 2; // lay flat
scene.add(rim);

// --- Central Shaft ---
const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 16);
const shaft = new THREE.Mesh(shaftGeo, bodyMat);
const shaftBottomY = plateY + plateHeight / 2;
shaft.position.y = shaftBottomY + shaftHeight / 2;
scene.add(shaft);

// --- Shaft Collar (base of shaft) ---
const collarGeo = new THREE.CylinderGeometry(shaftRadius + 0.4, shaftRadius + 0.4, 0.25, 16);
const collar = new THREE.Mesh(collarGeo, bodyMat);
collar.position.y = shaftBottomY + 0.125;
scene.add(collar);

// --- Crank Arm (flat bar) ---
const armGeo = new THREE.BoxGeometry(crankLength, crankThick, crankWidth);
const arm = new THREE.Mesh(armGeo, bodyMat);
// Positioned near top of shaft, extending along +X
const armY = shaftBottomY + shaftHeight - 0.3;
arm.position.set(crankLength / 2, armY, 0);
scene.add(arm);

// --- Top Nut (hex nut holding crank) ---
const nutGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 6);
const nut = new THREE.Mesh(nutGeo, darkMat);
nut.position.y = shaftBottomY + shaftHeight + 0.2;
scene.add(nut);

// --- Crank Knob Post (small cylinder under ball) ---
const postGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 8);
const post = new THREE.Mesh(postGeo, bodyMat);
post.position.set(crankLength, armY + 0.1, 0);
scene.add(post);

// --- Crank Knob (ball handle) ---
const crankKnobGeo = new THREE.SphereGeometry(knobRadius, 16, 16);
const crankKnob = new THREE.Mesh(crankKnobGeo, bodyMat);
crankKnob.position.set(crankLength, armY + 0.1 + knobRadius * 0.8, 0);
scene.add(crankKnob);

// --- Camera framing ---
camera.position.set(18, 20, 18);
camera.lookAt(0, 7, 0);