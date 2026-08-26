import * as THREE from 'three';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { DRACOLoader } from './vendor/DRACOLoader.js';
import { RGBELoader } from './vendor/RGBELoader.js';
import {
  EffectComposer, RenderPass, EffectPass,
  SMAAEffect, SMAAPreset, BloomEffect, BlendFunction,
  Reflector, ReflectorMaterial,
} from './vendor/fx.js';

// External links. The paper PDF is produced by build_assets; the code link
// stays a placeholder until the repository is public.
const LINKS = { paper: '#', code: '#' };

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ utils */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (v, a, b) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/* --------------------------------------------------------- hero 3D scene
   Raw three.js: the hero GLB (baked albedo/roughness/GI-occlusion, KHR
   clearcoat) plus a live EdgesGeometry crease-line overlay per part, the
   Freestyle-style technical-drawing look. Scroll scrubs the baked explode
   clip via mixer.setTime and drives the camera orbit through the three
   story panels: assembled hero, exploded parts, reassembled solve. */

const canvas = document.getElementById('scene');
let renderer = null;

try {
  // antialias off: SMAA runs in the post chain instead
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
} catch (e) {
  console.warn('WebGL unavailable, static page only', e);
}

/* camera keyframes per story panel: hero, parts (exploded), solve, exit.
   `pan` slides the frame along the camera's right axis so the model sits
   beside the text block rather than under it. */
const KEYS = [
  { az: 0.79, el: 0.31, r: 4.1, ty: 0.68, pan: 0.62, vpan: -0.3 },
  { az: 1.64, el: 0.52, r: 6.6, ty: 0.1,  pan: -0.7, vpan: -0.12 },
  { az: 5.55, el: 0.3,  r: 4.6, ty: 0.3,  pan: 0.75, vpan: -0.18 },
  { az: 3.39, el: 0.4,  r: 4.8, ty: 0.0,  pan: 0,    vpan: 0 },
];

const tickerItems = [...document.querySelectorAll('#partTicker li')];

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // page-matched background: convert to linear so the sRGB output encode
  // lands on the CSS --bg tone instead of a lifted navy
  const BG_COLOR = new THREE.Color(0x060810).convertSRGBToLinear();
  renderer.setClearColor(BG_COLOR, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG_COLOR.clone(), 7, 16);
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 60);

  // post-processing chain: SMAA + restrained mipmap bloom. Only these two
  // verifiably apply with this three/postprocessing pairing (frozen-frame
  // PSNR audit); vignette and saturation are graded in CSS on the canvas.
  const composer = new EffectComposer(renderer, { multisampling: 0 });
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new EffectPass(camera, new SMAAEffect({ preset: SMAAPreset.HIGH })));
  const bloom = new BloomEffect({
    blendFunction: BlendFunction.SCREEN,
    mipmapBlur: true,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.15,
    intensity: 0.4,
    radius: 0.5,
  });
  composer.addPass(new EffectPass(camera, bloom));

  // environment: same studio HDRI the textures were baked under. Keep the
  // source texture: PMREM targets do not survive a WebGL context restore.
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
  canvas.addEventListener('webglcontextrestored', () => setTimeout(applyEnv, 150));

  // key light exists mostly for the ground contact shadow
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(3, 5, 2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3.2;
  key.shadow.camera.right = 3.2;
  key.shadow.camera.top = 3.2;
  key.shadow.camera.bottom = -3.2;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 16;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 7;
  key.shadow.blurSamples = 16;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0x8899bb, 0x0a0a0c, 0.25));

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x0a0a0c,
    transparent: true,
    opacity: 0.85,
  });

  let mixer = null;
  let clipDuration = 3;
  let floor = null;         // invisible shadow catcher on the mirror floor
  let reflectorMat = null;  // blurred-mirror floor material (fade via uniforms)
  // NOTE: with mirror=1 the reflector shows ONLY baseColor * reflection *
  // mixStrength, so this acts as the reflection tint, not a visible surface
  const FLOOR_COLOR = new THREE.Color(0x55555c);
  const isMobile = window.innerWidth < 768;

  const draco = new DRACOLoader().setDecoderPath('js/vendor/draco/');
  new GLTFLoader().setDRACOLoader(draco).load(
    'assets/hero/hero.glb',
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        // push surfaces back a hair so the coincident lines win the depth test
        child.material.polygonOffset = true;
        child.material.polygonOffsetFactor = 1;
        child.material.polygonOffsetUnits = 1;
        const edges = new THREE.EdgesGeometry(child.geometry, 22);
        child.add(new THREE.LineSegments(edges, lineMat));
      });
      scene.add(gltf.scene);

      mixer = new THREE.AnimationMixer(gltf.scene);
      const clip = gltf.animations[0];
      clipDuration = clip.duration;
      mixer.clipAction(clip).play();
      mixer.setTime(0);

      const worldBox = new THREE.Box3().setFromObject(gltf.scene);
      const floorY = worldBox.min.y;

      // blurred mirror floor (alien.js Reflector)
      if (!isMobile) {
        const reflector = new Reflector({ blurIterations: 8 });
        reflector.setSize(window.innerWidth, window.innerHeight);
        reflectorMat = new ReflectorMaterial({
          color: FLOOR_COLOR.clone(),
          reflectivity: 0.5,
          mirror: 1,
          mixStrength: 6,
          dithering: true,
          fog: scene.fog,
        });
        reflectorMat.uniforms.tReflect = reflector.renderTargetUniform;
        reflectorMat.uniforms.uMatrix = reflector.textureMatrixUniform;
        // large enough that its rim leaves the frame / dissolves into fog
        const mirrorFloor = new THREE.Mesh(new THREE.CircleGeometry(14, 72), reflectorMat);
        mirrorFloor.add(reflector);
        mirrorFloor.rotation.x = -Math.PI / 2;
        mirrorFloor.position.y = floorY - 0.003;
        mirrorFloor.onBeforeRender = (rndr, scn, cam) => {
          mirrorFloor.visible = false;
          reflector.update(rndr, scn, cam);
          mirrorFloor.visible = true;
        };
        scene.add(mirrorFloor);
        window.addEventListener('resize', () => reflector.setSize(window.innerWidth, window.innerHeight));
      }

      floor = new THREE.Mesh(
        new THREE.CircleGeometry(3.2, 48),
        new THREE.ShadowMaterial({ opacity: 0.45 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = floorY - 0.001;
      floor.receiveShadow = true;
      scene.add(floor);

      canvas.classList.add('ready');
      // after the CSS fade-in completes, let the scroll fade drive opacity directly
      setTimeout(() => { canvas.style.transition = 'none'; }, 1400);
    },
    undefined,
    (err) => console.warn('hero model failed to load', err),
  );

  // debug/verification hook: ?p=1.0 pins the scroll progress
  const pinnedP = parseFloat(new URLSearchParams(location.search).get('p') ?? '');
  const pinned = Number.isFinite(pinnedP);

  let smoothP = pinned ? pinnedP : Math.min(window.scrollY / window.innerHeight, 3.4);
  let idleAz = 0;
  let mouseX = 0;
  let mouseY = 0;
  let smX = 0;
  let smY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  const camTarget = new THREE.Vector3();
  const camRight = new THREE.Vector3();
  const camUp = new THREE.Vector3();
  let tickerCount = -1;

  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const p = pinned ? pinnedP : Math.min(window.scrollY / window.innerHeight, 3.4);
    smoothP = (reduceMotion || pinned) ? p : lerp(smoothP, p, 1 - Math.exp(-4.5 * dt));
    if (smoothP > 3.3 && !pinned) return;  // canvas fully faded, skip the frame
    if (!reduceMotion) idleAz += dt * 0.05;
    smX = lerp(smX, mouseX, 1 - Math.exp(-3 * dt));
    smY = lerp(smY, mouseY, 1 - Math.exp(-3 * dt));

    // explosion: assembled in the hero, apart across "parts", reassembled by
    // "solve". Clamp below the clip end: seeking exactly `duration` wraps the
    // looping clip to t=0, which snaps the pose back to assembled.
    const E = smoothstep(smoothP, 0.55, 1.35) * (1 - smoothstep(smoothP, 1.75, 2.55));
    if (mixer) mixer.setTime(Math.min(E * clipDuration, clipDuration - 1 / 60));

    // part-name ticker follows the explosion
    const want = Math.round(smoothstep(E, 0.06, 0.85) * tickerItems.length);
    if (want !== tickerCount) {
      tickerCount = want;
      tickerItems.forEach((li, i) => li.classList.toggle('on', i < want));
    }

    // camera path
    const i = Math.min(Math.floor(smoothP), KEYS.length - 2);
    const t = smoothstep(smoothP - i, 0, 1);
    const a = KEYS[Math.max(i, 0)];
    const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const az = lerp(a.az, b.az, t) + idleAz + smX * 0.07;
    const el = lerp(a.el, b.el, t) - smY * 0.05;
    // pull the camera back on narrow / portrait viewports
    const rScale = Math.max(1, 1.32 - 0.4 * (camera.aspect - 1));
    const r = lerp(a.r, b.r, t) * rScale;
    const ty = lerp(a.ty, b.ty, t);
    // side pan collapses on narrow viewports, where text overlays the model
    const pan = lerp(a.pan, b.pan, t) * clamp01((camera.aspect - 0.9) / 0.5);

    camera.position.set(
      r * Math.cos(el) * Math.sin(az),
      ty + r * Math.sin(el),
      r * Math.cos(el) * Math.cos(az),
    );
    camTarget.set(0, ty, 0);
    camera.lookAt(camTarget);
    // slide the frame sideways so the model sits beside the copy, and on
    // portrait viewports slide it down below the text block instead
    camRight.setFromMatrixColumn(camera.matrix, 0).multiplyScalar(pan);
    const vshift = Math.max(0, 0.95 - camera.aspect) * 1.4;
    const vpan = lerp(a.vpan, b.vpan, t);
    camUp.setFromMatrixColumn(camera.matrix, 1).multiplyScalar(vshift + vpan);
    camera.position.sub(camRight).add(camUp);
    camTarget.sub(camRight).add(camUp);
    camera.lookAt(camTarget);

    const fade = 1 - smoothstep(smoothP, 2.6, 3.1);
    canvas.style.opacity = canvas.classList.contains('ready') ? String(fade) : '0';
    // mirror floor + contact shadow: fade out while exploded, since parts
    // fly below ground level (the reflector fades to the background color)
    const ground = 1 - smoothstep(E, 0.05, 0.5);
    if (floor) floor.material.opacity = 0.45 * ground;
    if (reflectorMat) {
      reflectorMat.uniforms.uReflectivity.value = 0.5 * ground;
      reflectorMat.uniforms.uMixStrength.value = 6 * ground;
      reflectorMat.uniforms.uColor.value.copy(FLOOR_COLOR).lerp(BG_COLOR, 1 - ground);
    }

    composer.render();
  });
} else {
  // no WebGL: reveal the part list statically
  tickerItems.forEach((li) => li.classList.add('on'));
}

/* -------------------------------------------------- reveal + counters */

const fmt = (v, decimals) =>
  v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function runCounter(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  if (reduceMotion) { el.firstChild.nodeValue = fmt(target, decimals); return; }
  const start = performance.now();
  const dur = 1500;
  const tick = (now) => {
    const t = clamp01((now - start) / dur);
    const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo
    el.firstChild.nodeValue = fmt(target * (t >= 1 ? 1 : eased), decimals);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// story panels re-trigger; content sections reveal once
const panelIO = new IntersectionObserver((entries) => {
  for (const entry of entries) entry.target.classList.toggle('in', entry.isIntersecting);
}, { threshold: 0.35 });
document.querySelectorAll('.panel').forEach((s) => panelIO.observe(s));

const revealIO = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('in');
    entry.target.querySelectorAll('[data-count]').forEach(runCounter);
    if (entry.target.dataset.count !== undefined) runCounter(entry.target);
    revealIO.unobserve(entry.target);
  }
}, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.page-body .reveal').forEach((el) => revealIO.observe(el));

/* ------------------------------------------------------ header state */

const header = document.getElementById('siteHeader');
const hero = document.getElementById('hero');
new IntersectionObserver((entries) => {
  header.classList.toggle('scrolled', !entries[0].isIntersecting);
}, { threshold: 0.12 }).observe(hero);

/* ------------------------------------------------------ external links */

document.querySelectorAll('[data-link]').forEach((a) => {
  a.href = LINKS[a.dataset.link] || '#';
});

/* --------------------------------------------------------------- bibtex */

const bibCopy = document.getElementById('bibCopy');
if (bibCopy) {
  bibCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById('bibText').textContent);
      bibCopy.textContent = 'Copied';
      setTimeout(() => { bibCopy.textContent = 'Copy'; }, 1600);
    } catch {
      bibCopy.textContent = 'Select and copy';
    }
  });
}

/* --------------------------------------------- data: palette + gallery */

const prettyName = (id) => {
  if (/^\d+$/.test(id)) return `Component ${Number(id)}`;
  return id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bV12\b/i, 'V12')
    .replace(/\bTlr\b/, 'TLR');
};

fetch('assets/data.json')
  .then((r) => r.json())
  .then((data) => {
    // materials palette (the buggy's extracted library, first 12 entries)
    const pal = document.getElementById('palette');
    if (pal && data.palette) {
      const frag = document.createDocumentFragment();
      for (const m of data.palette.slice(0, 12)) {
        const sw = document.createElement('div');
        sw.className = 'swatch';
        sw.innerHTML = `<i style="background:${m.hex}"></i><span>${m.name}</span>` +
          `<span class="sw-pbr">r${m.rough} m${m.metal}</span>`;
        frag.appendChild(sw);
      }
      pal.appendChild(frag);
    }

    // articulation strip: real Isaac clips, playing while in view
    const artic = document.getElementById('articStrip');
    if (artic && data.motion) {
      const vio = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const v = e.target;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      }, { root: artic, threshold: 0.35 });
      for (const id of data.motion) {
        const fig = document.createElement('figure');
        fig.innerHTML = `
          <video muted loop playsinline preload="none"
            poster="assets/motion_videos/${id}.jpg"
            src="assets/motion_videos/${id}.mp4"
            aria-label="${prettyName(id)} articulation in Isaac Sim"></video>
          <figcaption>${prettyName(id)}</figcaption>`;
        artic.appendChild(fig);
        vio.observe(fig.querySelector('video'));
      }
    }

    // gallery: AO render, painted on hover, reference inset
    const grid = document.getElementById('galleryGrid');
    if (!grid || !data.cases) return;
    const frag = document.createDocumentFragment();
    for (const c of data.cases) {
      const card = document.createElement('div');
      card.className = 'card';
      const paint = c.paint
        ? `<img class="card-paint" loading="lazy" src="assets/gallery/${c.id}_paint.jpg" alt="${prettyName(c.id)}, painted">`
        : '';
      card.innerHTML = `
        <div class="card-media">
          <img loading="lazy" src="assets/gallery/${c.id}_ao.jpg" alt="${prettyName(c.id)}, ambient-occlusion render">
          ${paint}
          <img class="card-ref" loading="lazy" src="assets/gallery/${c.id}_ref.jpg" alt="Reference view">
        </div>
        <span class="card-name">${prettyName(c.id)}</span>`;
      // touch: tap toggles the painted layer
      card.addEventListener('touchstart', () => card.classList.toggle('painted'), { passive: true });
      frag.appendChild(card);
    }
    grid.appendChild(frag);
  })
  .catch((e) => console.warn('data.json failed to load', e));
