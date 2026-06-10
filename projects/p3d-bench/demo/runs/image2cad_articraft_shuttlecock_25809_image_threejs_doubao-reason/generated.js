// ========== PARAMETERS ==========
// Core geometry dimensions (stainless steel strainer/infuser interpretation)
const totalLength = 130;       // Total length from top of dome to lowest scallop edge
const topDiameter = 60;        // Diameter of octagonal top opening (where dome attaches)
const bottomDiameter = 100;    // Diameter of octagonal bottom opening
const wallThickness = 1.5;     // Thickness of perforated panel walls
const panelCount = 8;          // 8-sided faceted design, matches visible scalloped bottom
const domeHeight = 22;         // Height of rounded hemispherical top cap
const ribWidth = 3;            // Width of raised structural ribs between panels
const ribProtrusion = 1.2;     // How much ribs extend out from panel surface
const topRimSize = 4;          // Width/thickness of rim at dome base
const scallopDepth = 6;        // Depth of curved scallop at bottom of each panel

// Perforation dimensions
const slotWidth = 2;
const slotLength = 8;
const holeDiameter = 3;
const perforationGap = 4;

// Calculated derived values
const angleStep = (Math.PI * 2) / panelCount;
const frustumHeight = totalLength - domeHeight;
const topRadius = topDiameter / 2;
const bottomRadius = bottomDiameter / 2;
// Length of each octagon edge at top and bottom
const topEdgeLength = 2 * topRadius * Math.sin(Math.PI / panelCount);
const bottomEdgeLength = 2 * bottomRadius * Math.sin(Math.PI / panelCount);
const avgRadius = (topRadius + bottomRadius) / 2; // Average radius for frustum positioning

// Shared material (brushed stainless steel finish)
const steelMat = new THREE.MeshStandardMaterial({
  color: 0xC4C8C9,
  metalness: 0.85,
  roughness: 0.2,
  side: THREE.DoubleSide
});

// ========== CREATE PERFORATED PANELS ==========
// Create one panel shape with cutouts, reuse for all 8 sides
function createPanelShape() {
  const shape = new THREE.Shape();
  
  // Trapezoid panel outline with scalloped bottom edge
  shape.moveTo(-topEdgeLength/2, frustumHeight); // Top left corner
  shape.lineTo(topEdgeLength/2, frustumHeight);  // Top right corner
  shape.lineTo(bottomEdgeLength/2, 0);           // Bottom right corner
  // Scalloped bottom curve
  shape.quadraticCurveTo(0, -scallopDepth, -bottomEdgeLength/2, 0);
  shape.lineTo(-topEdgeLength/2, frustumHeight); // Close shape back to top left

  // Add rectangular slot perforations (left section of panel)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const x = -bottomEdgeLength/2 + 6 + col * (slotWidth + perforationGap);
      const y = 10 + row * (slotLength + perforationGap);
      const slot = new THREE.Path();
      // Manual rectangle draw instead of rect() method for compatibility
      slot.moveTo(x, y);
      slot.lineTo(x + slotWidth, y);
      slot.lineTo(x + slotWidth, y + slotLength);
      slot.lineTo(x, y + slotLength);
      slot.lineTo(x, y);
      shape.holes.push(slot);
    }
  }

  // Add circular hole perforations (right section of panel)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const x = bottomEdgeLength/2 - 20 + col * (holeDiameter + perforationGap);
      const y = 15 + row * (holeDiameter + perforationGap * 1.5);
      const hole = new THREE.Path();
      hole.moveTo(x + holeDiameter/2, y);
      hole.absarc(x, y, holeDiameter/2, 0, Math.PI * 2);
      shape.holes.push(hole);
    }
  }

  // Add small diagonal slot perforations (middle section of panel)
  for (let i = 0; i < 8; i++) {
    const x = -8 + i * 5;
    const y = 20 + i * 3;
    const slot = new THREE.Path();
    // Manual rectangle draw for small slots
    slot.moveTo(x, y);
    slot.lineTo(x + slotWidth, y);
    slot.lineTo(x + slotWidth, y + (slotLength/2));
    slot.lineTo(x, y + (slotLength/2));
    slot.lineTo(x, y);
    shape.holes.push(slot);
  }

  return shape;
}

// Extrude panel shape to wall thickness
const panelShape = createPanelShape();
const panelExtrudeSettings = { depth: wallThickness, bevelEnabled: false };
const panelGeometry = new THREE.ExtrudeGeometry(panelShape, panelExtrudeSettings);

// Position and rotate all 8 panels to form octagonal frustum
for (let i = 0; i < panelCount; i++) {
  const panel = new THREE.Mesh(panelGeometry, steelMat);
  const angle = i * angleStep;
  
  // Rotate panel to face outwards
  panel.rotation.y = angle;
  panel.rotation.x = -Math.PI / 2; // Align extrude depth along radial direction
  
  // Position panel at correct radius for frustum slope
  panel.position.x = Math.cos(angle) * avgRadius;
  panel.position.z = Math.sin(angle) * avgRadius;
  panel.position.y = -frustumHeight/2; // Align to center height
  
  scene.add(panel);
}

// ========== CREATE STRUCTURAL RIBS ==========
const ribGeometry = new THREE.BoxGeometry(ribWidth, frustumHeight + 2, ribProtrusion * 2);
for (let i = 0; i < panelCount; i++) {
  const rib = new THREE.Mesh(ribGeometry, steelMat);
  const angle = i * angleStep + angleStep/2; // Place between panels
  
  rib.position.x = Math.cos(angle) * (avgRadius + wallThickness/2);
  rib.position.z = Math.sin(angle) * (avgRadius + wallThickness/2);
  rib.rotation.y = angle;
  rib.position.y = -frustumHeight/2;
  
  scene.add(rib);
}

// ========== CREATE TOP DOME ==========
const domeGeometry = new THREE.SphereGeometry(
  topRadius,
  32, 16,
  0, Math.PI * 2,
  0, Math.PI / 2 // Only top half of sphere
);
const dome = new THREE.Mesh(domeGeometry, steelMat);
dome.position.y = frustumHeight/2;
scene.add(dome);

// ========== CREATE TOP RIM ==========
const rimGeometry = new THREE.TorusGeometry(
  topRadius + topRimSize/2,
  topRimSize/2,
  16, 32
);
const rim = new THREE.Mesh(rimGeometry, steelMat);
rim.position.y = frustumHeight/2;
rim.rotation.x = Math.PI / 2;
scene.add(rim);

// ========== CAMERA ADJUSTMENT ==========
camera.position.set(180, 120, 180);
camera.lookAt(0, 0, 0);