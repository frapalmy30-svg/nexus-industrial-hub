/**
 * ESTRATTORE DATI GLB - Estrae i modelli 3D da nexus.html
 *
 * UTILIZZO:
 * 1. Apri nexus.html in un browser
 * 2. Apri DevTools (F12)
 * 3. Incolla questo script in Console
 * 4. Esegui: extractAndExportGLBData()
 * 5. Copia l'output JSON
 */

function extractAndExportGLBData() {
  console.log('🔍 Estrazione dati GLB da nexus.html...');
  console.log('');

  // Accedi ai dati GLB globali (definiti in nexus.html)
  if (typeof window.GLB_DATA === 'undefined') {
    console.error('❌ GLB_DATA non trovato in window. Assicurati che nexus.html sia caricato.');
    return null;
  }

  const glbData = window.GLB_DATA;
  const models = {};

  // Metadati dei modelli (da MODEL_META in nexus.html)
  const modelMeta = {
    '1': { name: 'IMM-7 — Cella Assembly', desc: 'Banco assembly su profilati con gabbia, attuatori verticali e carrello lineare' },
    '2': { name: 'IMM-11 — Impianto Assembly', desc: 'Impianto a piano pannellato con stazioni operative e binario passante' },
    '3': { name: 'IMM-13 — Fixture + Robot', desc: 'Maschera di bloccaggio con robot 6 assi industriale' },
    '4': { name: 'Layout 3D — Banco Rulli', desc: 'Impianto simulazione manto stradale con travi parallele e drive unit' },
    '5': { name: 'Layout-3D — ADAS Calibrazione', desc: 'Banco calibrazione front-end ADAS con torri modulari' },
    '6': { name: 'Layout 2003 — Modanature', desc: 'Stazione applicazione modanature con bilanciatrici e moduli operativi' },
    '7': { name: 'Disegno Complessivo 1', desc: 'Assembly completo calibro di controllo' },
    '8': { name: 'Disegno Complessivo 2', desc: 'Assembly attrezzo montaggio tetto apribile' }
  };

  // Estrai i dati base64 per ogni modello
  for (let i = 1; i <= 8; i++) {
    const key = String(i);
    const meta = modelMeta[key] || {};

    if (glbData[key]) {
      const base64Data = glbData[key];
      const sizeKb = Math.round(base64Data.length / 1024);

      models[key] = {
        id: key,
        name: meta.name || `Modello ${key}`,
        description: meta.desc || 'Descrizione non disponibile',
        glbBase64: base64Data,
        sizeKb: sizeKb,
        preview: base64Data.substring(0, 50) + '...'
      };

      console.log(`✅ Modello ${key}: ${meta.name} (${sizeKb} KB)`);
    } else {
      console.warn(`⚠️  Modello ${key} non trovato`);
    }
  }

  console.log('');
  console.log('📦 Totale modelli estratti:', Object.keys(models).length);
  console.log('');

  // Crea la configurazione completa
  const config = {
    timestamp: new Date().toISOString(),
    source: 'nexus.html',
    models: models,
    theme: {
      background: '#0a0e17',
      neonColors: {
        cyan: '#00FFFF',
        blue: '#0055FF',
        green: '#00FF00'
      }
    },
    colorAssignment: {
      '1': '#00FFFF',  // Cyan
      '2': '#0055FF',  // Blue
      '3': '#00FF00',  // Green
      '4': '#00FFFF',  // Cyan
      '5': '#0055FF',  // Blue
      '6': '#00FF00',  // Green
      '7': '#00FFFF',  // Cyan
      '8': '#0055FF'   // Blue
    }
  };

  // Stampa il JSON completo
  console.log('📋 CONFIGURAZIONE COMPLETA (JSON):');
  console.log('===================================');
  console.log(JSON.stringify(config, null, 2));
  console.log('');

  // Copia negli appunti
  const jsonString = JSON.stringify(config, null, 2);
  copyToClipboard(jsonString);
  console.log('✨ JSON copiato negli appunti!');
  console.log('');

  // Esporta come file
  console.log('💾 Download automatico del file JSON...');
  downloadJSON(config, 'nexus-glb-models.json');

  return config;
}

/**
 * Copia testo negli appunti del browser
 */
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * Scarica oggetto come file JSON
 */
function downloadJSON(obj, filename) {
  const dataStr = JSON.stringify(obj, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Valida i dati estratti
 */
function validateExtractedData(config) {
  console.log('🔍 Validazione dati estratti...');
  console.log('');

  let valid = true;

  // Controlla numero modelli
  if (Object.keys(config.models).length !== 8) {
    console.warn(`⚠️  Attesi 8 modelli, trovati ${Object.keys(config.models).length}`);
    valid = false;
  }

  // Controlla dimensioni
  for (const [id, model] of Object.entries(config.models)) {
    if (!model.glbBase64 || model.glbBase64.length === 0) {
      console.error(`❌ Modello ${id} ha dati GLB vuoti`);
      valid = false;
    }
    if (model.sizeKb < 100) {
      console.warn(`⚠️  Modello ${id} molto piccolo (${model.sizeKb} KB)`);
    }
  }

  // Controlla assegnazione colori
  for (const [id, color] of Object.entries(config.colorAssignment)) {
    if (!color.match(/^#[0-9A-F]{6}$/i)) {
      console.error(`❌ Colore non valido per modello ${id}: ${color}`);
      valid = false;
    }
  }

  console.log('');
  if (valid) {
    console.log('✅ Validazione completata - Dati OK!');
  } else {
    console.log('⚠️  Validazione completata - Controlla gli avvisi sopra');
  }

  return valid;
}

/**
 * Stampa statistiche
 */
function printStatistics(config) {
  console.log('');
  console.log('📊 STATISTICHE:');
  console.log('===============');

  let totalSize = 0;
  let minSize = Infinity;
  let maxSize = 0;

  for (const [id, model] of Object.entries(config.models)) {
    const size = model.sizeKb;
    totalSize += size;
    minSize = Math.min(minSize, size);
    maxSize = Math.max(maxSize, size);
  }

  const avgSize = Math.round(totalSize / Object.keys(config.models).length);

  console.log(`Modelli: ${Object.keys(config.models).length}`);
  console.log(`Dimensione totale: ${totalSize} KB (${(totalSize / 1024).toFixed(2)} MB)`);
  console.log(`Dimensione media: ${avgSize} KB`);
  console.log(`Min: ${minSize} KB, Max: ${maxSize} KB`);
  console.log('');
}

// ============================================
// ESECUZIONE PRINCIPALE
// ============================================

console.log('');
console.log('╔═══════════════════════════════════════════════════╗');
console.log('║  ESTRATTORE DATI GLB - nexus.html                ║');
console.log('╚═══════════════════════════════════════════════════╝');
console.log('');

// Estrai dati
const extractedConfig = extractAndExportGLBData();

if (extractedConfig) {
  // Valida dati
  validateExtractedData(extractedConfig);

  // Stampa statistiche
  printStatistics(extractedConfig);

  console.log('🎯 PROSSIMI STEP:');
  console.log('1. Copia il JSON scaricato (nexus-glb-models.json)');
  console.log('2. Incolla in integration-script.js');
  console.log('3. Usa il codice di integrazione nel simulator online');
  console.log('');
}
