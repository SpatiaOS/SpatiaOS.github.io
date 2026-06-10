// ============================================================
// PISTON AND CONNECTING ROD ASSEMBLY
// Parametric Three.js Geometry Generation
// ============================================================

// Materials
const pistonMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x9a9a9a, 
  roughness: 0.35, 
  metalness: 0.75,
  flatShading: false
});

const detailMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x808080, 
  roughness: 0.4, 
  metalness: 0.7 
});

const boltMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x606060, 
  roughness: 0.3, 
  metalness: 0.85 
});

// ============================================================
// PARAMETERS
// ============================================================
const params = {
  // Piston
  pistonDiameter: 10,
  pistonHeight: 8,
  crownHeight: 2,
  ringGrooveCount: 3,
  ringGrooveDepth: 0.15,
  wristPinBossRadius: 1.8,
  wristPinHoleRadius: 0.9,
  
  // Connecting Rod
  rodLength: 24,
  rodSmallEndWidth: 2.8,
  rodBigEndWidth: 5,
  rodThickness: 1.6,
  rodWebThickness: 0.8,
  
  // Big End
  bigEndBoreRadius: 2.2,
  bigEndCapWidth: 4.5,
  boltRadius: 0.35,
  boltHeight: 1.2
};

// ============================================================
// PISTON GROUP
// ============================================================
const pistonAssembly = new THREE.Group();

// Main piston skirt/body
const pistonBodyGeo = new THREE.CylinderGeometry(
  params.pistonDiameter / 2, 
  params.pistonDiameter / 2, 
  params.pistonHeight - params.crownHeight, 
  48
);
const pistonBody = new THREE.Mesh(pistonBodyGeo, pistonMaterial);
pistonBody.position.y = -(params.pistonHeight - params.crownHeight) / 2;
pistonAssembly.add(pistonBody);

// Piston crown (top head) - slightly domed appearance
const crownGeo = new THREE.CylinderGeometry(
  params.pistonDiameter / 2, 
  params.pistonDiameter / 2, 
  params.crownHeight, 
  48
);
const crown = new THREE.Mesh(crownGeo, pistonMaterial);
crown.position.y = params.pistonHeight / 2 - params.crownHeight / 2;
pistonAssembly.add(crown);

// Top surface detail (valve relief or center mark)
const topDetailGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
const topDetail = new THREE.Mesh(topDetailGeo, detailMaterial);
topDetail.position.y = params.pistonHeight / 2;
pistonAssembly.add(topDetail);

// Ring grooves (compression and oil rings)
for (let i = 0; i < params.ringGrooveCount; i++) {
  const grooveY = params.pistonHeight / 2 - params.crownHeight - 0.5 - (i * 0.8);
  const grooveGeo = new THREE.TorusGeometry(params.pistonDiameter / 2 + 0.05, params.ringGrooveDepth, 8, 64);
  const groove = new THREE.Mesh(grooveGeo, detailMaterial);
  groove.position.y = grooveY;
  groove.rotation.x = Math.PI / 2;
  pistonAssembly.add(groove);
}

// Wrist pin boss (the protruding cylinder for the pin connection)
const bossY = -params.pistonHeight / 2 + 2;
const bossGeo = new THREE.CylinderGeometry(
  params.wristPinBossRadius, 
  params.wristPinBossRadius, 
  params.pistonDiameter * 0.6, 
  24
);
const boss = new THREE.Mesh(bossGeo, pistonMaterial);
boss.position.set(params.pistonDiameter / 2 - 0.5, bossY, 0);
boss.rotation.z = Math.PI / 2;
pistonAssembly.add(boss);

// Wrist pin hole (darker interior)
const pinHoleGeo = new THREE.CylinderGeometry(
  params.wristPinHoleRadius, 
  params.wristPinHoleRadius, 
  params.pistonDiameter * 0.65, 
  24
);
const pinHole = new THREE.Mesh(pinHoleGeo, detailMaterial);
pinHole.position.set(params.pistonDiameter / 2 - 0.5, bossY, 0);
pinHole.rotation.z = Math.PI / 2;
pistonAssembly.add(pinHole);

scene.add(pistonAssembly);

// ============================================================
// CONNECTING ROD GROUP
// ============================================================
const rodAssembly = new THREE.Group();
const rodStartY = -params.pistonHeight / 2 - 1;

// Create I-beam profile shape for the connecting rod
function createRodProfile(yTop, yBottom, widthTop, widthBottom, thickness, webThickness) {
  const rodGroup = new THREE.Group();
  
  // Calculate midpoint and dimensions
  const length = yBottom - yTop;
  const midY = yTop + length / 2;
  
  // Center web (the thin middle part of the I-beam)
  const avgWidth = (widthTop + widthBottom) / 2;
  const webGeo = new THREE.BoxGeometry(webThickness, length * 0.85, thickness * 0.6);
  const web = new THREE.Mesh(webGeo, pistonMaterial);
  web.position.set(0, midY, 0);
  rodGroup.add(web);
  
  // Top flange (wider at top)
  const topFlangeGeo = new THREE.BoxGeometry(widthTop, thickness, thickness);
  const topFlange = new THREE.Mesh(topFlangeGeo, pistonMaterial);
  topFlange.position.set(0, yTop + thickness / 2, 0);
  rodGroup.add(topFlange);
  
  // Bottom flange (wider at bottom - big end side)
  const bottomFlangeGeo = new THREE.BoxGeometry(widthBottom, thickness, thickness);
  const bottomFlange = new THREE.Mesh(bottomFlangeGeo, pistonMaterial);
  bottomFlange.position.set(0, yBottom - thickness / 2, 0);
  rodGroup.add(bottomFlange);
  
  // Tapered transition pieces (triangular supports between flanges and web)
  // Left side taper
  const leftTaperShape = new THREE.Shape();
  leftTaperShape.moveTo(-webThickness / 2, yTop + thickness);
  leftTaperShape.lineTo(-widthTop / 2, yTop + thickness);
  leftTaperShape.lineTo(-widthBottom / 2, yBottom - thickness);
  leftTaperShape.lineTo(-webThickness / 2, yBottom - thickness);
  leftTaperShape.closePath();
  
  const leftTaperGeo = new THREE.ExtrudeGeometry(leftTaperShape, { depth: thickness * 0.55, bevelEnabled: false });
  const leftTaper = new THREE.Mesh(leftTaperGeo, pistonMaterial);
  leftTaper.position.z = -thickness * 0.275;
  rodGroup.add(leftTaper);
  
  // Right side taper
  const rightTaperShape = new THREE.Shape();
  rightTaperShape.moveTo(webThickness / 2, yTop + thickness);
  rightTaperShape.lineTo(widthTop / 2, yTop + thickness);
  rightTaperShape.lineTo(widthBottom / 2, yBottom - thickness);
  rightTaperShape.lineTo(webThickness / 2, yBottom - thickness);
  rightTaperShape.closePath();
  
  const rightTaperGeo = new THREE.ExtrudeGeometry(rightTaperShape, { depth: thickness * 0.55, bevelEnabled: false });
  const rightTaper = new THREE.Mesh(rightTaperGeo, pistonMaterial);
  rightTaper.position.z = -thickness * 0.275;
  rodGroup.add(rightTaper);
  
  return rodGroup;
}

// Generate the main rod body (I-beam section)
const rodBody = createRodProfile(
  0, 
  params.rodLength - 3, 
  params.rodSmallEndWidth, 
  params.rodBigEndWidth, 
  params.rodThickness, 
  params.rodWebThickness
);
rodAssembly.add(rodBody);

// Small end eye (connects to wrist pin)
const smallEndOuterGeo = new THREE.CylinderGeometry(
  params.rodSmallEndWidth / 2 + 0.8, 
  params.rodSmallEndWidth / 2 + 0.8, 
  params.rodThickness * 1.2, 
  24
);
const smallEndOuter = new THREE.Mesh(smallEndOuterGeo, pistonMaterial);
smallEndOuter.rotation.x = Math.PI / 2;
smallEndOuter.position.y = 0;
rodAssembly.add(smallEndOuter);

const smallEndInnerGeo = new THREE.CylinderGeometry(
  params.wristPinHoleRadius + 0.2, 
  params.wristPinHoleRadius + 0.2, 
  params.rodThickness * 1.3, 
  24
);
const smallEndInner = new THREE.Mesh(smallEndInnerGeo, detailMaterial);
smallEndInner.rotation.x = Math.PI / 2;
smallEndInner.position.y = 0;
rodAssembly.add(smallEndInner);

// Big End Assembly (crankshaft end)
const bigEndY = params.rodLength - 3;

// Main big end body (half circle)
const bigEndShape = new THREE.Shape();
bigEndShape.absarc(0, 0, params.bigEndBoreRadius + 1.2, 0, Math.PI, false);
bigEndShape.absarc(0, 0, params.bigEndBoreRadius - 0.3, Math.PI, 0, true);
bigEndShape.closePath();

const bigEndGeo = new THREE.ExtrudeGeometry(bigEndShape, { 
  depth: params.rodThickness * 1.1, 
  bevelEnabled: false 
});
const bigEndMain = new THREE.Mesh(bigEndGeo, pistonMaterial);
bigEndMain.rotation.x = -Math.PI / 2;
bigEndMain.position.set(0, bigEndY, params.rodThickness * 0.05);
rodAssembly.add(bigEndMain);

// Bearing cap (bottom half)
const capShape = new THREE.Shape();
capShape.absarc(0, 0, params.bigEndBoreRadius + 1.2, Math.PI, 0, false);
capShape.absarc(0, 0, params.bigEndBoreRadius - 0.3, 0, Math.PI, true);
capShape.closePath();

const capGeo = new THREE.ExtrudeGeometry(capShape, { 
  depth: params.rodThickness * 1.1, 
  bevelEnabled: false 
});
const bearingCap = new THREE.Mesh(capGeo, pistonMaterial);
bearingCap.rotation.x = -Math.PI / 2;
bearingCap.position.set(0, bigEndY - 0.8, params.rodThickness * 0.05);
rodAssembly.add(bearingCap);

// Big end bore hole
const boreGeo = new THREE.CylinderGeometry(
  params.bigEndBoreRadius, 
  params.bigEndBoreRadius, 
  params.rodThickness * 1.3, 
  32
);
const bore = new THREE.Mesh(boreGeo, detailMaterial);
bore.rotation.x = Math.PI / 2;
bore.position.set(0, bigEndY - 0.4, 0);
rodAssembly.add(bore);

// Bolts and nuts (two sides)
const boltPositions = [
  { x: params.bigEndBoreRadius + 0.9, z: params.rodThickness * 0.45 },
  { x: -(params.bigEndBoreRadius + 0.9), z: params.rodThickness * 0.45 }
];

boltPositions.forEach((pos, idx) => {
  // Bolt shank
  const boltShankGeo = new THREE.CylinderGeometry(
    params.boltRadius, 
    params.boltRadius, 
    params.boltHeight, 
    12
  );
  const boltShank = new THREE.Mesh(boltShankGeo, boltMaterial);
  boltShank.position.set(pos.x, bigEndY - 0.4, pos.z);
  rodAssembly.add(boltShank);
  
  // Bolt head
  const boltHeadGeo = new THREE.CylinderGeometry(
    params.boltRadius * 1.8, 
    params.boltRadius * 1.8, 
    params.boltHeight * 0.6, 
    6
  );
  const boltHead = new THREE.Mesh(boltHeadGeo, boltMaterial);
  boltHead.position.set(pos.x, bigEndY - 0.4 + params.boltHeight / 2 + params.boltHeight * 0.3, pos.z);
  rodAssembly.add(boltHead);
  
  // Nut (bottom side)
  const nutGeo = new THREE.CylinderGeometry(
    params.boltRadius * 1.7, 
    params.boltRadius * 1.7, 
    params.boltHeight * 0.5, 
    6
  );
  const nut = new THREE.Mesh(nutGeo, boltMaterial);
  nut.position.set(pos.x, bigEndY - 0.4 - params.boltHeight / 2 - params.boltHeight * 0.25, pos.z);
  rodAssembly.add(nut);
});

// Position the entire rod assembly below the piston
rodAssembly.position.y = rodStartY;
scene.add(rodAssembly);

// ============================================================
// CAMERA SETUP
// ============================================================
camera.position.set(18, 12, 22);
camera.lookAt(0, -5, 0);