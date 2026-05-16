import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLB_DATA } from '../data/glbModels.js';
import { getGLBModelIdForProduct } from '../data/glbMapping.js';

const BG_COLOR = 0x040d1a;
const COLOR_LINE_PRIMARY = 0xb8f0ff;
const COLOR_LINE_GLOW = 0x0066cc;

function b64toArrayBuffer(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

const glbLoader = new GLTFLoader();
const glbCache = {};

async function loadGLBModel(modelId) {
  if (glbCache[modelId]) return glbCache[modelId];
  const b64 = GLB_DATA[modelId];
  if (!b64) throw new Error(`GLB model ${modelId} not found`);
  const buf = b64toArrayBuffer(b64);
  return new Promise((resolve, reject) => {
    glbLoader.parse(buf, '', (gltf) => {
      glbCache[modelId] = gltf;
      resolve(gltf);
    }, undefined, reject);
  });
}

function buildWireframe(gltfScene) {
  const root = new THREE.Group();

  gltfScene.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const occMat = new THREE.MeshBasicMaterial({
      color: BG_COLOR,
      side: THREE.FrontSide,
      depthWrite: true,
      colorWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const occ = child.clone();
    occ.material = occMat;
    occ.renderOrder = 0;
    root.add(occ);

    const edges = new THREE.EdgesGeometry(child.geometry, 25);

    const glowMat = new THREE.LineBasicMaterial({
      color: COLOR_LINE_GLOW,
      transparent: true,
      opacity: 0.45,
      depthTest: true,
      depthWrite: false,
      linewidth: 1,
    });
    const lineGlow = new THREE.LineSegments(edges, glowMat);
    lineGlow.position.copy(child.position);
    lineGlow.rotation.copy(child.rotation);
    lineGlow.scale.copy(child.scale);
    lineGlow.renderOrder = 1;
    root.add(lineGlow);

    const primaryMat = new THREE.LineBasicMaterial({
      color: COLOR_LINE_PRIMARY,
      transparent: false,
      opacity: 1.0,
      depthTest: true,
      depthWrite: false,
      linewidth: 1,
    });
    const linePrimary = new THREE.LineSegments(edges, primaryMat);
    linePrimary.position.copy(child.position);
    linePrimary.rotation.copy(child.rotation);
    linePrimary.scale.copy(child.scale);
    linePrimary.renderOrder = 2;
    root.add(linePrimary);
  });

  return root;
}

/**
 * HologramViewer
 *
 * Props:
 *  - machineId          : string identificatore macchina (mappato a GLB)
 *  - style              : stile inline aggiuntivo
 *  - highlights         : array { id, nx, ny, nz, label, hint, color }
 *                         Coordinate (nx,ny,nz) in [0..1] relative al bounding box
 *                         del modello: 0=min, 0.5=centro, 1=max sull'asse.
 *                         I marker vengono proiettati ad ogni frame, così
 *                         seguono zoom/rotazione/pan dell'OrbitControls.
 *  - autoRotate         : se true ruota automaticamente il modello (default true)
 *  - onToggleRotate     : callback per toggle rotazione dal bottone
 */
export default function HologramViewer({ machineId, style, highlights = [], autoRotate = true, onToggleRotate }) {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const stateRef = useRef({
    camera: null,
    renderer: null,
    bbox: null,        // Box3 del modello centrato
    bboxCenter: new THREE.Vector3(),
    bboxSize: new THREE.Vector3(),
    rootRotY: 0,       // rotazione cumulativa del modello
  });
  // Coordinate proiettate degli highlight, aggiornate ad ogni frame
  const [projected, setProjected] = useState([]);
  // Tieni una ref per evitare di ricreare la scena a ogni cambio highlights
  const highlightsRef = useRef(highlights);
  highlightsRef.current = highlights;
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);

    const w = el.clientWidth, h = el.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.001, 2000);
    camera.position.set(10, 6, 14);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(BG_COLOR);
    renderer.outputEncoding = THREE.sRGBEncoding;
    el.appendChild(renderer.domElement);

    stateRef.current.camera = camera;
    stateRef.current.renderer = renderer;

    const grid = new THREE.GridHelper(80, 80, 0x0a2a3a, 0x061a28);
    scene.add(grid);

    const amb = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(amb);
    const dl1 = new THREE.DirectionalLight(0x00ddff, 0.5);
    dl1.position.set(15, 20, 15);
    scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dl2.position.set(-10, 10, -10);
    scene.add(dl2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.05;
    controls.maxDistance = 800;
    controls.zoomSpeed = 1.4;
    controls.enableZoom = true;

    let currentRoot = null;
    let modelLoaded = false;

    const glbModelId = getGLBModelIdForProduct(machineId) || Object.keys(GLB_DATA)[0];

    if (glbModelId && GLB_DATA[glbModelId]) {
      loadGLBModel(glbModelId)
        .then((gltf) => {
          gltf.scene.updateMatrixWorld(true);
          const root = buildWireframe(gltf.scene);

          const box = new THREE.Box3().setFromObject(root);
          const center = box.getCenter(new THREE.Vector3());
          root.position.sub(center);
          const sz = box.getSize(new THREE.Vector3());
          root.position.y += sz.y / 2;

          scene.add(root);
          currentRoot = root;
          modelLoaded = true;

          // Salva bounding box mondo (dopo lo shift) per proiettare highlights
          stateRef.current.bbox = new THREE.Box3().setFromObject(root);
          stateRef.current.bboxCenter = stateRef.current.bbox.getCenter(new THREE.Vector3());
          stateRef.current.bboxSize = stateRef.current.bbox.getSize(new THREE.Vector3());

          const maxD = Math.max(sz.x, sz.y, sz.z);
          const dist = (maxD / 2 / Math.tan(camera.fov * Math.PI / 360)) * 1.6;
          camera.position.set(dist * 0.55, dist * 0.38, dist);
          camera.lookAt(0, sz.y / 2, 0);
          camera.near = Math.max(0.001, maxD * 0.0005);
          camera.far = maxD * 50;
          camera.updateProjectionMatrix();
          controls.target.set(0, sz.y / 2, 0);
          controls.update();
        })
        .catch((err) => console.error('Error loading GLB:', err));
    }

    let frameId;
    const tmp = new THREE.Vector3();
    let lastProj = '';

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (currentRoot && !controls.isDragging && autoRotateRef.current) {
        currentRoot.rotation.y += 0.003;
        stateRef.current.rootRotY = currentRoot.rotation.y;
      }
      controls.update();
      renderer.render(scene, camera);

      // Proietta highlights 3D → coordinate schermo % (0..100)
      // I cerchi rimangono FISICAMENTE nel punto 3D del modello — seguono
      // la rotazione/posizione del modello ma restano sempre su quel componente.
      if (modelLoaded && highlightsRef.current.length > 0 && currentRoot) {
        const box = stateRef.current.bbox;
        const size = stateRef.current.bboxSize;
        // Coordinate locali del bounding box (non shiftato)
        const boxMin = box.min;
        const projs = highlightsRef.current.map((h) => {
          // Coordinate mondo del punto nel bounding box
          // nx,ny,nz ∈ [0..1] → [boxMin, boxMax]
          const worldX = boxMin.x + (h.nx ?? 0.5) * size.x;
          const worldY = boxMin.y + (h.ny ?? 0.5) * size.y;
          const worldZ = boxMin.z + (h.nz ?? 0.5) * size.z;
          tmp.set(worldX, worldY, worldZ);
          // Il punto è in world-space STATICO — NON lo trasformiamo per il modello.
          // Rimane fisico in quel punto anche se il modello ruota.
          // Proiezione clip-space
          tmp.project(camera);
          // Da NDC a percentuale schermo
          const sx = (tmp.x * 0.5 + 0.5) * 100;
          const sy = (-tmp.y * 0.5 + 0.5) * 100;
          // tmp.z fuori da [-1,1] = dietro la camera
          const visible = tmp.z >= -1 && tmp.z <= 1 && sx >= -10 && sx <= 110 && sy >= -10 && sy <= 110;
          return { ...h, sx, sy, visible, depth: tmp.z };
        });
        // Aggiorna stato React solo se cambiate
        const sig = projs.map(p => `${p.id}:${p.sx.toFixed(1)},${p.sy.toFixed(1)},${p.visible}`).join('|');
        if (sig !== lastProj) {
          lastProj = sig;
          setProjected(projs);
        }
      } else if (highlightsRef.current.length === 0 && lastProj !== '') {
        lastProj = '';
        setProjected([]);
      }
    };
    animate();

    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [machineId]);

  const handleToggleRotate = () => {
    if (onToggleRotate) onToggleRotate();
  };

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', background: '#040d1a', position: 'relative', ...style }}>
      {/* Bottone Pausa Rotazione — solo se highlights visibili e callback disponibile */}
      {projected.length > 0 && onToggleRotate && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          pointerEvents: 'auto',
        }}>
          <button
            onClick={handleToggleRotate}
            className="px-2.5 py-1.5 rounded-lg text-[0.65rem] font-bold transition-all hover:opacity-80"
            style={{
              background: autoRotate ? 'rgba(96,165,250,0.2)' : 'rgba(239,68,68,0.2)',
              border: `1px solid ${autoRotate ? 'rgba(96,165,250,0.5)' : 'rgba(239,68,68,0.5)'}`,
              color: autoRotate ? '#60a5fa' : '#ef4444',
              cursor: 'pointer',
            }}
            title={autoRotate ? 'Rotazione ON — clicca per mettere in pausa' : 'Rotazione in pausa — clicca per riprendere'}
          >
            <span style={{ display: 'inline-block', width: '1px', height: '1px', marginRight: '0.4rem' }}>●</span>
            {autoRotate ? 'ROT: AUTO' : 'ROT: PAUSA'}
          </button>
        </div>
      )}
      {/* Overlay SVG con marker 2D proiettati dai punti 3D — fissi nello spazio 3D */}
      {projected.length > 0 && (
        <svg
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="hgGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {projected.map((p, i) => {
            if (!p.visible) return null;
            const c = p.color || '#22c55e';
            const isAlert = p.type === 'alert';

            if (isAlert) {
              // Stile alert: pallino rosso/ambra che pulsa fortemente
              return (
                <g key={p.id ?? i}>
                  {/* Alone esterno ambra pulsante */}
                  <circle cx={p.sx} cy={p.sy} r="2.5" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.5" filter="url(#hgGlow)">
                    <animate attributeName="r" values="2.5;4;2.5" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={p.sx} cy={p.sy} r="1.8" fill="none" stroke="#ef4444" strokeWidth="0.6" opacity="0.7" filter="url(#hgGlow)">
                    <animate attributeName="r" values="1.8;3;1.8" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  {/* Dot centrale rosso brillante */}
                  <circle cx={p.sx} cy={p.sy} r="1.2" fill="#ef4444" opacity="0.95" filter="url(#hgGlow)">
                    <animate attributeName="r" values="1.2;1.5;1.2" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  {/* Punto piccolo al centro */}
                  <circle cx={p.sx} cy={p.sy} r="0.6" fill="#fff" opacity="0.9" />
                </g>
              );
            }

            const baseDist = Math.max(1, 5 - p.depth * 2);
            const r = Math.min(2.8, 1.2 + baseDist * 0.35);

            // Callout laterale: va a destra se il marker è nella metà sinistra, sinistra altrimenti
            const goRight = p.sx < 52;
            const lineLen = 10; // lunghezza segmento orizzontale
            const chipX = goRight ? p.sx + r + lineLen : p.sx - r - lineLen;
            const labelTxt = p.label || '';
            const chipW = Math.max(labelTxt.length * 1.45 + 3, 8);
            // ancora chip: a destra la chip parte da chipX, a sinistra finisce in chipX
            const chipLeft = goRight ? chipX : chipX - chipW;
            // testo centrato dentro il chip
            const textX = chipLeft + chipW / 2;

            return (
              <g key={p.id ?? i}>
                {/* Punto centrale preciso: dot + micro crocino, zero fill */}
                <circle cx={p.sx} cy={p.sy} r={r} fill="none" stroke={c} strokeWidth="0.45" opacity="0.9" filter="url(#hgGlow)">
                  <animate attributeName="opacity" values="0.65;1;0.65" dur="1.4s" repeatCount="indefinite" />
                </circle>
                {/* Piccolo dot pieno al centro */}
                <circle cx={p.sx} cy={p.sy} r="0.55" fill={c} opacity="0.95" />
                {/* Micro crocino a 4 linee courtes */}
                <line x1={p.sx - 1.1} y1={p.sy} x2={p.sx - r - 0.2} y2={p.sy} stroke={c} strokeWidth="0.28" opacity="0.8" />
                <line x1={p.sx + 1.1} y1={p.sy} x2={p.sx + r + 0.2} y2={p.sy} stroke={c} strokeWidth="0.28" opacity="0.8" />
                <line x1={p.sx} y1={p.sy - 1.1} x2={p.sx} y2={p.sy - r - 0.2} stroke={c} strokeWidth="0.28" opacity="0.8" />
                <line x1={p.sx} y1={p.sy + 1.1} x2={p.sx} y2={p.sy + r + 0.2} stroke={c} strokeWidth="0.28" opacity="0.8" />

                {/* Anello pulsante esterno sottilissimo */}
                <circle cx={p.sx} cy={p.sy} r={r + 1.8} fill="none" stroke={c} strokeWidth="0.18" opacity="0.3">
                  <animate attributeName="r" values={`${r + 1.2};${r + 2.6};${r + 1.2}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Linea callout orizzontale dal bordo del cerchio al chip */}
                {labelTxt && (
                  <>
                    <line
                      x1={goRight ? p.sx + r + 0.3 : p.sx - r - 0.3}
                      y1={p.sy}
                      x2={goRight ? p.sx + r + lineLen - 0.5 : p.sx - r - lineLen + 0.5}
                      y2={p.sy}
                      stroke={c} strokeWidth="0.25" opacity="0.7"
                    />
                    {/* Chip etichetta: bordo colorato, sfondo quasi trasparente */}
                    <rect
                      x={chipLeft} y={p.sy - 1.6}
                      width={chipW} height="3.1" rx="0.45"
                      fill="rgba(4,13,26,0.72)" stroke={c} strokeWidth="0.28" opacity="0.95"
                    />
                    <text
                      x={textX} y={p.sy + 0.85}
                      textAnchor="middle" fill={c} fontSize="1.85"
                      fontFamily="monospace" fontWeight="bold" opacity="1"
                    >
                      {labelTxt}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
