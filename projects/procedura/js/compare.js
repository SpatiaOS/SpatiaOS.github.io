// Panel B of compare.html: raw three.js rendering of the hero GLB with a live
// EdgesGeometry crease-line overlay (the "real Freestyle-ish lines" option).
import './vendor/model-viewer.min.js';
import * as THREE from 'three';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { DRACOLoader } from './vendor/DRACOLoader.js';
import { RGBELoader } from './vendor/RGBELoader.js';

const panel = document.getElementById('edgePanel');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(panel.clientWidth, panel.clientHeight);
renderer.setClearColor(0x050506, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
panel.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40, panel.clientWidth / panel.clientHeight, 0.1, 60,
);

// keep the source HDR around: PMREM render targets do not survive a WebGL
// context restore (3 contexts on this page make losses likely), so re-derive
let hdrTex = null;
const applyEnv = () => {
  if (!hdrTex) return;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(hdrTex).texture;
  pmrem.dispose();
};
new RGBELoader().load('env/studio.hdr', (tex) => {
  hdrTex = tex;
  applyEnv();
});
renderer.domElement.addEventListener('webglcontextrestored', () => setTimeout(applyEnv, 150));
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 0.4));

const draco = new DRACOLoader().setDecoderPath('js/vendor/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);

const lineMat = new THREE.LineBasicMaterial({
  color: 0x0a0a0c,
  transparent: true,
  opacity: 0.85,
});

loader.load(
  'assets/hero/buggy.glb',
  (gltf) => {
    let meshes = 0;
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      meshes += 1;
      // push surfaces back a hair so the coincident lines win the depth test
      child.material.polygonOffset = true;
      child.material.polygonOffsetFactor = 1;
      child.material.polygonOffsetUnits = 1;
      const edges = new THREE.EdgesGeometry(child.geometry, 22);
      child.add(new THREE.LineSegments(edges, lineMat));
    });
    scene.add(gltf.scene);
    console.log(`edge panel: loaded ${meshes} meshes`);
  },
  undefined,
  (err) => console.error('edge panel: GLB load failed', err),
);
window.__edgeScene = scene;

const CAM = { az: -Math.PI / 4, r: 4.2, spin: true };
const el = Math.PI / 2 - THREE.MathUtils.degToRad(72); // match MV's 72deg polar
const clock = new THREE.Clock();

// test hook: freeze all three panels at the same orbit for screenshots
window.__lockCam = (azDeg, rM) => {
  CAM.az = THREE.MathUtils.degToRad(azDeg);
  CAM.r = rM;
  CAM.spin = false;
  const orbit = `${azDeg}deg 72deg ${rM}m`;
  for (const id of ['mvA', 'mvB']) {
    const mv = document.getElementById(id);
    mv.removeAttribute('auto-rotate');
    mv.cameraOrbit = orbit;
  }
};

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  if (CAM.spin) CAM.az += dt * THREE.MathUtils.degToRad(12);
  camera.position.set(
    CAM.r * Math.cos(el) * Math.sin(CAM.az),
    CAM.r * Math.sin(el),
    CAM.r * Math.cos(el) * Math.cos(CAM.az),
  );
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
  camera.aspect = panel.clientWidth / panel.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(panel.clientWidth, panel.clientHeight);
});
