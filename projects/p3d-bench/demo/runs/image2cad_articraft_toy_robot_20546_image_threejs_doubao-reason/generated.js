// Parameters - all values are scalable via baseScale
const baseScale = 1;
const mainMatColor = 0xB0B4B9; // Light metallic gray for main robot parts
const detailMatColor = 0x333333; // Dark gray for accents and joints
const totalHeight = 24 * baseScale;

// Materials
const mainMaterial = new THREE.MeshStandardMaterial({ 
  color: mainMatColor, 
  metalness: 0.7, 
  roughness: 0.3 
});
const detailMaterial = new THREE.MeshStandardMaterial({ 
  color: detailMatColor, 
  metalness: 0.5, 
  roughness: 0.4 
});

// Master robot group for easy positioning
const robot = new THREE.Group();
scene.add(robot);

// ------------------------------
// Head
// ------------------------------
const headGeo = new THREE.SphereGeometry(2.2 * baseScale, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.75);
const head = new THREE.Mesh(headGeo, mainMaterial);
head.rotation.x = -0.3;
head.position.y = totalHeight - 2 * baseScale;
robot.add(head);
// Eye detail
const eyeGeo = new THREE.SphereGeometry(0.5 * baseScale, 8, 8);
const eye = new THREE.Mesh(eyeGeo, detailMaterial);
eye.position.set(1.2 * baseScale, 0, 1 * baseScale);
head.add(eye);

// ------------------------------
// Torso
// ------------------------------
const torsoGeo = new THREE.CapsuleGeometry(3 * baseScale, 8 * baseScale, 8, 12);
const torso = new THREE.Mesh(torsoGeo, mainMaterial);
torso.rotation.z = 0.15;
torso.rotation.x = -0.2;
torso.position.y = totalHeight - 9 * baseScale;
robot.add(torso);
// Back spike details
for (let i = 0; i < 3; i++) {
  const spikeGeo = new THREE.CylinderGeometry(0.2 * baseScale, 0.2 * baseScale, (6 - i) * baseScale, 6);
  const spike = new THREE.Mesh(spikeGeo, mainMaterial);
  spike.position.set(-2 * baseScale, 4 - i * 1.2, -3 * baseScale);
  spike.rotation.z = 0.4 - i * 0.1;
  torso.add(spike);
}
// Rear bar attachments
const rearBarGeo = new THREE.CylinderGeometry(0.2 * baseScale, 0.2 * baseScale, 7 * baseScale, 6);
const rearBar1 = new THREE.Mesh(rearBarGeo, detailMaterial);
rearBar1.rotation.set(0, 0.5, 1);
rearBar1.position.set(-1, 1, -3);
torso.add(rearBar1);
const rearBar2 = rearBar1.clone();
rearBar2.position.set(-1, -1, -3);
torso.add(rearBar2);

// ------------------------------
// Arms
// ------------------------------
// Right arm (viewer left, claw arm)
const rightUpperArmGeo = new THREE.CapsuleGeometry(0.8 * baseScale, 6 * baseScale, 6, 8);
const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, mainMaterial);
rightUpperArm.rotation.z = 0.8;
rightUpperArm.rotation.y = 0.2;
rightUpperArm.position.set(5 * baseScale, totalHeight - 11 * baseScale, 2 * baseScale);
robot.add(rightUpperArm);
// Right lower arm + claw
const rightLowerArmGeo = new THREE.CapsuleGeometry(0.7 * baseScale, 5 * baseScale, 6, 8);
const rightLowerArm = new THREE.Mesh(rightLowerArmGeo, mainMaterial);
rightLowerArm.rotation.z = 1.2;
rightLowerArm.position.set(5 * baseScale, 0, 0);
rightUpperArm.add(rightLowerArm);
// Claw prongs
const clawProngGeo = new THREE.BoxGeometry(6 * baseScale, 0.5 * baseScale, 0.8 * baseScale);
const clawTop = new THREE.Mesh(clawProngGeo, mainMaterial);
clawTop.rotation.z = 0.2;
clawTop.position.set(4 * baseScale, 1 * baseScale, 0);
rightLowerArm.add(clawTop);
const clawBottom = clawTop.clone();
clawBottom.rotation.z = -0.2;
clawBottom.position.y = -1 * baseScale;
rightLowerArm.add(clawBottom);
// Claw middle detail
const clawMiddleGeo = new THREE.CylinderGeometry(0.3 * baseScale, 0.3 * baseScale, 2 * baseScale, 6);
const clawMiddle = new THREE.Mesh(clawMiddleGeo, detailMaterial);
clawMiddle.rotation.x = Math.PI/2;
clawMiddle.position.set(3 * baseScale, 0, 0);
rightLowerArm.add(clawMiddle);

// Left arm (viewer right, shorter arm)
const leftUpperArmGeo = new THREE.CapsuleGeometry(0.7 * baseScale, 4 * baseScale, 6, 8);
const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, mainMaterial);
leftUpperArm.rotation.z = -0.6;
leftUpperArm.rotation.y = 0.3;
leftUpperArm.position.set(-3 * baseScale, totalHeight - 10 * baseScale, 2 * baseScale);
robot.add(leftUpperArm);
const leftLowerArmGeo = new THREE.CapsuleGeometry(0.6 * baseScale, 3 * baseScale, 6, 8);
const leftLowerArm = new THREE.Mesh(leftLowerArmGeo, mainMaterial);
leftLowerArm.rotation.z = -0.9;
leftLowerArm.position.set(-2.5 * baseScale, 0, 0);
leftUpperArm.add(leftLowerArm);

// ------------------------------
// Legs
// ------------------------------
// Right leg (viewer left)
const rightUpperLegGeo = new THREE.CapsuleGeometry(1 * baseScale, 6 * baseScale, 6, 8);
const rightUpperLeg = new THREE.Mesh(rightUpperLegGeo, mainMaterial);
rightUpperLeg.rotation.z = 0.2;
rightUpperLeg.position.set(2.5 * baseScale, totalHeight - 17 * baseScale, 0);
robot.add(rightUpperLeg);
// Right lower leg
const rightLowerLegGeo = new THREE.CapsuleGeometry(0.9 * baseScale, 7 * baseScale, 6, 8);
const rightLowerLeg = new THREE.Mesh(rightLowerLegGeo, mainMaterial);
rightLowerLeg.rotation.z = -0.4;
rightLowerLeg.position.set(1 * baseScale, -6 * baseScale, 0);
rightUpperLeg.add(rightLowerLeg);
// Right foot
const rightFootGeo = new THREE.BoxGeometry(5 * baseScale, 1.2 * baseScale, 3 * baseScale);
const rightFoot = new THREE.Mesh(rightFootGeo, mainMaterial);
rightFoot.position.set(-2 * baseScale, -4 * baseScale, 0);
rightLowerLeg.add(rightFoot);

// Left leg (viewer right)
const leftUpperLegGeo = new THREE.CapsuleGeometry(1 * baseScale, 6 * baseScale, 6, 8);
const leftUpperLeg = new THREE.Mesh(leftUpperLegGeo, mainMaterial);
leftUpperLeg.rotation.z = -0.15;
leftUpperLeg.position.set(-1 * baseScale, totalHeight - 17 * baseScale, -1 * baseScale);
robot.add(leftUpperLeg);
// Left lower leg
const leftLowerLegGeo = new THREE.CapsuleGeometry(0.9 * baseScale, 7 * baseScale, 6, 8);
const leftLowerLeg = new THREE.Mesh(leftLowerLegGeo, mainMaterial);
leftLowerLeg.rotation.z = 0.2;
leftLowerLeg.position.set(-0.5 * baseScale, -6 * baseScale, 0);
leftUpperLeg.add(leftLowerLeg);
// Left foot
const leftFoot = rightFoot.clone();
leftFoot.position.set(-2 * baseScale, -4 * baseScale, 0);
leftLowerLeg.add(leftFoot);

// Add joint spheres for all connection points (ball joint style matching Bionicle)
const jointPositions = [
  [4, totalHeight - 11, 2], [-2, totalHeight - 10, 2], // Shoulder joints
  [0, totalHeight - 16, 0], [2, totalHeight - 16, -1], // Hip joints
  [3.5, totalHeight - 16, 0], [-1, totalHeight - 16, -1], // Knee joints
  [1, totalHeight - 22, 0], [-2, totalHeight - 22, -1] // Ankle joints
];
jointPositions.forEach(pos => {
  const jointGeo = new THREE.SphereGeometry(1 * baseScale, 8, 8);
  const joint = new THREE.Mesh(jointGeo, mainMaterial);
  joint.position.set(pos[0], pos[1], pos[2]);
  robot.add(joint);
});

// ------------------------------
// Camera positioning
// ------------------------------
camera.position.set(35 * baseScale, 28 * baseScale, 40 * baseScale);
camera.lookAt(robot.position);