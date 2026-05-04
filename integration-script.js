/**
 * INTEGRATION SCRIPT - Digital Twin Simulator
 * Estrae i modelli 3D da nexus.html e li integra nel simulator online
 * Applica i colori neon: Cyan (#00FFFF), Blue (#0055FF), Green (#00FF00)
 */

// COLORI NEON (da immagine fornita)
const NEON_COLORS = {
  cyan: '#00FFFF',
  blue: '#0055FF',
  green: '#00FF00',
  darkBackground: '#0a0e17'
};

// MODELLI DA NEXUS.HTML (estratti da nexus.html)
const MODELS_DATA = {
  '1': {
    name: 'IMM-7 — Cella Assembly',
    desc: 'Banco assembly su profilati con gabbia, attuatori verticali e carrello lineare',
    glbData: null // Sarà popolato da script
  },
  '2': {
    name: 'IMM-11 — Impianto Assembly',
    desc: 'Impianto a piano pannellato con stazioni operative e binario passante',
    glbData: null
  },
  '3': {
    name: 'IMM-13 — Fixture + Robot',
    desc: 'Maschera di bloccaggio con robot 6 assi industriale',
    glbData: null
  },
  '4': {
    name: 'Layout 3D — Banco Rulli',
    desc: 'Impianto simulazione manto stradale con travi parallele e drive unit',
    glbData: null
  },
  '5': {
    name: 'Layout-3D — ADAS Calibrazione',
    desc: 'Banco calibrazione front-end ADAS con torri modulari',
    glbData: null
  },
  '6': {
    name: 'Layout 2003 — Modanature',
    desc: 'Stazione applicazione modanature con bilanciatrici e moduli operativi',
    glbData: null
  },
  '7': {
    name: 'Disegno Complessivo 1',
    desc: 'Assembly completo calibro di controllo',
    glbData: null
  },
  '8': {
    name: 'Disegno Complessivo 2',
    desc: 'Assembly attrezzo montaggio tetto apribile',
    glbData: null
  }
};

/**
 * STEP 1: Estrae i dati GLB da nexus.html
 */
function extractModelsFromNexus() {
  console.log('📦 Estrazione modelli da nexus.html...');

  // Questo script deve essere eseguito da una pagina che ha accesso a nexus.html
  // Oppure i dati devono essere copiati manualmente da nexus.html

  return MODELS_DATA;
}

/**
 * STEP 2: Crea la configurazione per il Digital Twin Simulator
 */
function createSimulatorConfig() {
  const config = {
    models: Object.entries(MODELS_DATA).map(([id, model]) => ({
      id,
      name: model.name,
      description: model.desc,
      type: 'glb',
      glbData: model.glbData,
      neonColor: getNeonColorForModel(parseInt(id))
    })),

    theme: {
      background: NEON_COLORS.darkBackground,
      modelColors: [
        NEON_COLORS.cyan,
        NEON_COLORS.blue,
        NEON_COLORS.green,
        NEON_COLORS.cyan,
        NEON_COLORS.blue,
        NEON_COLORS.green,
        NEON_COLORS.cyan,
        NEON_COLORS.blue
      ]
    },

    lighting: {
      ambientIntensity: 0.4,
      directionalIntensity: 1.2,
      neonGlowIntensity: 0.8
    }
  };

  return config;
}

/**
 * Assegna colore neon basato su index del modello
 */
function getNeonColorForModel(index) {
  const colors = [
    NEON_COLORS.cyan,
    NEON_COLORS.blue,
    NEON_COLORS.green,
    NEON_COLORS.cyan,
    NEON_COLORS.blue,
    NEON_COLORS.green,
    NEON_COLORS.cyan,
    NEON_COLORS.blue
  ];
  return colors[index % colors.length];
}

/**
 * STEP 3: Crea lo script per il simulator online
 */
function generateSimulatorIntegrationCode() {
  const code = `
// SCRIPT DI INTEGRAZIONE - Digital Twin Simulator
// Aggiungere questo codice nel simulator online

(function initializeNexusModels() {
  console.log('🚀 Inizializzazione modelli NEXUS...');

  // Configurazione globale
  window.NEXUS_MODELS_CONFIG = {
    models: ${JSON.stringify(createSimulatorConfig().models, null, 2)},
    theme: ${JSON.stringify(createSimulatorConfig().theme, null, 2)}
  };

  // Event listener per caricamento modelli
  if (window.THREE && window.GLTFLoader) {
    loadNexusModels();
  } else {
    console.warn('⚠️ Three.js o GLTFLoader non disponibili');
  }
})();

async function loadNexusModels() {
  console.log('📊 Caricamento modelli 3D in corso...');

  const config = window.NEXUS_MODELS_CONFIG;
  const scene = window.scene || new THREE.Scene();
  const loader = new THREE.GLTFLoader();

  for (const model of config.models) {
    if (!model.glbData) continue;

    try {
      // Converti base64 a blob
      const binaryString = atob(model.glbData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      // Carica il modello
      const gltf = await new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

      // Applica colori neon al modello
      applyNeonMaterials(gltf.scene, model.neonColor);

      // Aggiungi alla scena
      scene.add(gltf.scene);

      console.log('✅ Modello caricato:', model.name);

    } catch (error) {
      console.error('❌ Errore caricamento modello:', model.name, error);
    }
  }
}

function applyNeonMaterials(object, neonColor) {
  object.traverse((child) => {
    if (child.isMesh) {
      // Crea materiale neon
      child.material = new THREE.MeshStandardMaterial({
        color: neonColor,
        emissive: neonColor,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });

      // Aggiungi glow effetto
      child.layers.enable(1); // Per post-processing glow
    }
  });
}
  `;

  return code;
}

/**
 * STEP 4: Crea HTML per il Digital Twin Simulator
 */
function generateSimulatorHTML() {
  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEXUS Digital Twin Simulator - 3D Model Viewer</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace;
      background: #0a0e17;
      color: #00FFFF;
      overflow: hidden;
    }

    #canvas {
      display: block;
      width: 100%;
      height: 100vh;
    }

    #ui-panel {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 320px;
      background: rgba(10, 14, 23, 0.9);
      border: 2px solid #00FFFF;
      border-radius: 8px;
      padding: 20px;
      backdrop-filter: blur(10px);
      z-index: 100;
    }

    #ui-panel h1 {
      color: #00FFFF;
      font-size: 18px;
      margin-bottom: 15px;
      text-shadow: 0 0 10px #00FFFF;
    }

    .model-selector {
      margin-bottom: 15px;
    }

    .model-selector label {
      display: block;
      color: #00FF00;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .model-selector select {
      width: 100%;
      padding: 8px;
      background: #1a1f2e;
      border: 1px solid #0055FF;
      color: #00FFFF;
      font-family: 'Courier New', monospace;
      border-radius: 4px;
    }

    .stats {
      font-size: 11px;
      color: #00FF00;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #0055FF;
    }

    .stat-item {
      margin: 5px 0;
    }

    #info-panel {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: rgba(10, 14, 23, 0.9);
      border: 2px solid #00FF00;
      border-radius: 8px;
      padding: 15px;
      max-width: 300px;
      font-size: 12px;
      backdrop-filter: blur(10px);
    }

    #info-panel h3 {
      color: #00FF00;
      margin-bottom: 10px;
      text-shadow: 0 0 10px #00FF00;
    }

    #info-panel p {
      color: #0055FF;
      line-height: 1.6;
    }

    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #00FFFF;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div id="canvas-container"></div>

  <div id="ui-panel">
    <h1>◆ NEXUS 3D VIEWER</h1>

    <div class="model-selector">
      <label>Modello:</label>
      <select id="model-select">
        <option value="">-- Seleziona Modello --</option>
        <option value="1">IMM-7 — Cella Assembly</option>
        <option value="2">IMM-11 — Impianto Assembly</option>
        <option value="3">IMM-13 — Fixture + Robot</option>
        <option value="4">Layout 3D — Banco Rulli</option>
        <option value="5">Layout-3D — ADAS Calibrazione</option>
        <option value="6">Layout 2003 — Modanature</option>
        <option value="7">Disegno Complessivo 1</option>
        <option value="8">Disegno Complessivo 2</option>
      </select>
    </div>

    <div class="stats">
      <div class="stat-item">● LIVE</div>
      <div class="stat-item">Modelli: 8</div>
      <div class="stat-item">Formato: GLB</div>
      <div class="stat-item">Tema: NEON</div>
    </div>
  </div>

  <div id="info-panel">
    <h3>Informazioni Modello</h3>
    <p id="model-info">Seleziona un modello per visualizzare i dettagli...</p>
  </div>

  <div id="loading" class="loading" style="display:none;">
    ⟳ Caricamento in corso...
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/loaders/GLTFLoader.js"></script>

  <script>
    // Script di integrazione NEXUS (da inserire qui)
  </script>
</body>
</html>
  `;

  return html;
}

/**
 * MAIN - Esporta tutti gli artefatti
 */
console.log('🔧 NEXUS Digital Twin Integration Script');
console.log('==========================================');
console.log('');
console.log('CONFIGURAZIONE SIMULATOR:', createSimulatorConfig());
console.log('');
console.log('CODICE INTEGRAZIONE:');
console.log(generateSimulatorIntegrationCode());
console.log('');
console.log('HTML SIMULATOR:');
console.log(generateSimulatorHTML());

export {
  NEON_COLORS,
  MODELS_DATA,
  createSimulatorConfig,
  generateSimulatorIntegrationCode,
  generateSimulatorHTML
};
