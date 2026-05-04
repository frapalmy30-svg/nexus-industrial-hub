/**
 * ============================================
 * NEXUS DIGITAL TWIN SIMULATOR - Integration Code
 * ============================================
 *
 * COME USARE:
 * 1. Apri: https://dist-fmwkbjau.devinapps.com/digital-twin
 * 2. Premi F12 → Console
 * 3. Copia TUTTO il codice qui sotto
 * 4. Incolla in Console e premi Enter
 * 5. Esegui: initializeNexusModels()
 *
 * ============================================
 */

// Dati GLB estratti da nexus.html (base64 encodati)
const NEXUS_MODELS_DATA = {
  "1": {
    "id": "1",
    "name": "IMM-7 — Cella Assembly",
    "description": "Banco assembly su profilati con gabbia, attuatori verticali e carrello lineare",
    "neonColor": "#00FFFF",
    "sizeKb": 2420.7,
    "glbBase64": "Z2xURgIAAAAsXhwAjAQAAEpTT057ImFjY2Vzc29ycyI6W3siYnVmZmVyVmlldyI6MCwiY29tcG9uZW50VHlwZSI6NTEyMywiY291bnQiOjM3MjkzLCJ0eXBlIjoiU0NBTEFSIn0seyJidWZmZXJWaWV3IjoxLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTE0MzMsIm1heCI6WzAuMzYwMjM3Mzg5ODAyOTMyNzQsMC41MDAzMzEwNDQxOTcwODI1LDAuMzE0MDI5OTkxNjI2NzM5NV0sIm1pbiI6Wy0wLjM1OTc3OTAzMDA4NDYxLC0wLjUwMDYwMjY2MjU2MzMyNCwtMC4zMTI5NDI1OTQyODk3Nzk2Nl0sInR5cGUiOiJWRUMzIn0seyJidWZmZXJWaWV3IjoyLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTE0MzMsInR5cGUiOiJWRUMyIn1dLCJhc3NldCI6eyJ2ZXJzaW9uIjoiMi4wIn0sImJ1ZmZlclZpZXdzIjpbeyJidWZmZXIiOjAsImJ5dGVMZW5ndGgiOjc0NTg2LCJ0YXJnZXQiOjM0OTYzfSx7ImJ1ZmZlciI6MCwiYnl0ZUxlbmd0aCI6MTM3MTk2LCJieXRlT2Zmc2V0Ijo3NDU4NiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVMZW5ndGgiOjkxNDY0LCJieXRlT2Zmc2V0IjoyMTE3ODIsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlTGVuZ3RoIjoxNTU0Njc2LCJieXRlT2Zmc2V0IjozMDMyNDZ9XSwiYnVmZmVycyI6W3siYnl0ZUxlbmd0aCI6MTg1NzkyMn1dLCJpbWFnZXMiOlt7ImJ1ZmZlclZpZXciOjMsIm1pbWVUeXBlIjoiaW1hZ2UvcG5nIiwibmFtZSI6Ijc5YTRiMWZkMjgzNDM5MmU1ZjUyMDUxOWE5NzNlYmVmIn1dLCJtYXRlcmlhbHMiOlt7InBick1ldGFsbGljUm91Z2huZXNzIjp7ImJhc2VDb2xvclRleHR1cmUiOnsiaW5kZXgiOjB9fX1dLCJtZXNoZXMiOlt7InByaW1pdGl2ZXMiOlt7ImF0dHJpYnV0ZXMiOnsiUE9TSVRJT04iOjEsIlRFWENPT1JEXzAiOjJ9LCJpbmRpY2VzIjowLCJtYXRlcmlhbCI6MCwibW9kZSI6NH1dfV0sIm5vZGVzIjpbeyJtZXNoIjowLCJuYW1lIjoiZ2VvbWV0cnlfMCJ9LHsiY2hpbGRyZW4iOlswXSwibmFtZSI6IndvcmxkIn1dLCJzYW1wbGVycyI6W3sid3JhcFMiOjEwNDk3LCJ3cmFwVCI6MTA0OTd9XSwic2NlbmUiOjAsInNjZW5lcyI6W3sibm9kZXMiOlsxXX1dLCJ0ZXh0dXJlcyI6W3sibmFtZSI6Ijc5YTRiMWZkMjgzNDM5MmU1ZjUyMDUxOWE5NzNlYmVmIiwic2FtcGxlciI6MCwic291cmNlIjowfV19"
  }
  // NOTA: Gli altri 7 modelli verranno inseriti nel file completo
  // Questo è un esempio - il file completo contiene tutti i dati base64
};

// ============================================
// FUNZIONI DI INTEGRAZIONE
// ============================================

/**
 * Inizializza i modelli NEXUS nel simulator
 */
async function initializeNexusModels() {
  console.log('🚀 Inizializzo modelli NEXUS...');

  // Salva la configurazione globale
  window.NEXUS_CONFIG = {
    models: NEXUS_MODELS_DATA,
    theme: {
      background: '#0a0e17',
      neonColors: ['#00FFFF', '#0055FF', '#00FF00']
    }
  };

  // Carica tutti i modelli
  await loadAllNexusModels();

  console.log('✅ Integrazione NEXUS completata!');
}

/**
 * Carica tutti gli 8 modelli NEXUS
 */
async function loadAllNexusModels() {
  console.log('📦 Caricamento modelli...\n');

  const loader = new THREE.GLTFLoader();
  let loadedCount = 0;

  for (const [modelId, modelData] of Object.entries(NEXUS_MODELS_DATA)) {
    try {
      // 1. Converti base64 a blob
      const binaryString = atob(modelData.glbBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      // 2. Carica con GLTFLoader
      const gltf = await new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

      // 3. Applica materiali neon
      applyNeonMaterialToModel(gltf.scene, modelData.neonColor);

      // 4. Aggiungi alla scena
      if (window.scene) {
        window.scene.add(gltf.scene);
      }

      loadedCount++;
      console.log(`✅ ${modelId}. ${modelData.name} (${modelData.sizeKb} KB)`);

    } catch (error) {
      console.error(`❌ Errore caricamento model ${modelId}:`, error);
    }
  }

  console.log(`\n📊 Totale caricati: ${loadedCount}/${Object.keys(NEXUS_MODELS_DATA).length}`);

  // Rimuovi modelli vecchi (opzionale)
  removeOldModels();
}

/**
 * Applica materiali neon a un modello
 */
function applyNeonMaterialToModel(object, neonColor) {
  const hexColor = neonColor.replace('#', '0x');
  const colorValue = parseInt(hexColor, 16);

  object.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: colorValue,
        emissive: colorValue,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2
      });

      // Abilita il layer per il bloom
      child.layers.enable(1);
    }
  });
}

/**
 * Rimuove i modelli vecchi dal simulator
 */
function removeOldModels() {
  console.log('🗑️ Rimozione modelli vecchi...');

  if (!window.scene) return;

  const nexusModelNames = [
    'IMM-7', 'IMM-11', 'IMM-13', 'Layout 3D',
    'Layout-3D', 'Layout 2003', 'Disegno'
  ];

  const toRemove = [];

  window.scene.children.forEach((child) => {
    const isNexusModel = nexusModelNames.some(name =>
      child.name?.includes(name) || child.userData?.isNexus
    );

    if (!isNexusModel && child.type === 'Group') {
      toRemove.push(child);
    }
  });

  toRemove.forEach(model => {
    window.scene.remove(model);
    console.log(`🗑️ Rimosso: ${model.name}`);
  });

  console.log(`✅ Rimossi ${toRemove.length} modelli vecchi`);
}

/**
 * Mostra statistiche sui modelli caricati
 */
function showNexusStats() {
  console.clear();
  console.log('═══════════════════════════════════');
  console.log('  NEXUS DIGITAL TWIN STATISTICS');
  console.log('═══════════════════════════════════\n');

  const totalSize = Object.values(NEXUS_MODELS_DATA)
    .reduce((sum, m) => sum + m.sizeKb, 0);

  console.log(`📦 Modelli: ${Object.keys(NEXUS_MODELS_DATA).length}`);
  console.log(`📊 Dimensione totale: ${totalSize.toFixed(1)} KB (${(totalSize/1024).toFixed(2)} MB)`);
  console.log(`🎨 Tema: Neon (Cyan/Blue/Green)`);
  console.log(`💾 Sorgente: nexus.html\n`);

  console.log('Modelli disponibili:');
  for (const [id, model] of Object.entries(NEXUS_MODELS_DATA)) {
    console.log(`  ${id}. ${model.name} - ${model.neonColor}`);
  }

  console.log('\n═══════════════════════════════════');
  console.log('  ✨ Integrazione NEXUS Attiva ✨');
  console.log('═══════════════════════════════════');
}

// ============================================
// ESECUZIONE AUTOMATICA
// ============================================

// Esegui automaticamente al caricamento
console.log('%c🚀 NEXUS Digital Twin Integration Pronto!',
  'color: #00FFFF; font-size: 14px; font-weight: bold; text-shadow: 0 0 10px #00FFFF;');

console.log('%c\n⏩ Esegui: initializeNexusModels()\n',
  'color: #00FF00; font-size: 12px;');

// Se il simulator è già caricato, inizializza automaticamente
if (window.scene && window.THREE) {
  console.log('✅ Scene trovata - Inizializzazione automatica in corso...\n');
  setTimeout(() => {
    initializeNexusModels();
    showNexusStats();
  }, 500);
}
