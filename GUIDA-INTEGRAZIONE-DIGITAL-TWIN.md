# 🔧 Guida Integrazione Digital Twin Simulator

**Obiettivo:** Integrare i 8 modelli 3D da `nexus.html` nel simulator online con colori neon cyan/blu/verde.

---

## 📋 Modelli da Integrare

| ID | Nome | Descrizione |
|----|------|------------|
| 1 | IMM-7 — Cella Assembly | Banco assembly su profilati con gabbia, attuatori verticali e carrello lineare |
| 2 | IMM-11 — Impianto Assembly | Impianto a piano pannellato con stazioni operative e binario passante |
| 3 | IMM-13 — Fixture + Robot | Maschera di bloccaggio con robot 6 assi industriale |
| 4 | Layout 3D — Banco Rulli | Impianto simulazione manto stradale con travi parallele e drive unit |
| 5 | Layout-3D — ADAS Calibrazione | Banco calibrazione front-end ADAS con torri modulari |
| 6 | Layout 2003 — Modanature | Stazione applicazione modanature con bilanciatrici e moduli operativi |
| 7 | Disegno Complessivo 1 | Assembly completo calibro di controllo |
| 8 | Disegno Complessivo 2 | Assembly attrezzo montaggio tetto apribile |

---

## 🎨 Colori Neon (da immagine)

```javascript
const NEON_COLORS = {
  cyan: '#00FFFF',      // Ciano brillante
  blue: '#0055FF',      // Blu scuro
  green: '#00FF00',     // Verde neon
  darkBackground: '#0a0e17'  // Sfondo scuro
};
```

**Pattern rotazione colori:**
1. IMM-7 → Cyan (#00FFFF)
2. IMM-11 → Blue (#0055FF)
3. IMM-13 → Green (#00FF00)
4. Layout 3D → Cyan (#00FFFF)
5. Layout-3D → Blue (#0055FF)
6. Layout 2003 → Green (#00FF00)
7. Disegno 1 → Cyan (#00FFFF)
8. Disegno 2 → Blue (#0055FF)

---

## 🔧 STEP 1: Estrazione Dati GLB da nexus.html

### Metodo 1: Estrazione Browser Console

1. Apri `nexus.html` in un browser
2. Apri DevTools (F12)
3. Vai a Console e esegui:

```javascript
// Estrai i dati GLB_DATA
const glbData = window.GLB_DATA;

// Per ogni modello, esporta il base64
Object.entries(glbData).forEach(([id, base64Data]) => {
  console.log(`Modello ${id}:`, base64Data.substring(0, 100) + '...');
  // Salva in file: copia il base64 e incollalo in integration-script.js
});
```

### Metodo 2: Estrazione da File

```bash
# Estrai i dati GLB da nexus.html usando regex
grep -oP '"1":\s*"\K[^"]+' nexus.html > glb-model-1.txt
grep -oP '"2":\s*"\K[^"]+' nexus.html > glb-model-2.txt
# ...e così via per tutti gli 8 modelli
```

---

## 🚀 STEP 2: Preparazione per il Simulator Online

### Opzione A: Modifica diretta nel simulator

1. Accedi a: `https://dist-fmwkbjau.devinapps.com/digital-twin`
2. Apri DevTools (F12)
3. Incolla il codice di integrazione dal file `integration-script.js`
4. Popola `MODELS_DATA` con i dati GLB estratti

### Opzione B: Creazione HTML standalone

Usa il template HTML generato da `integration-script.js`:

```html
<!-- File: nexus-digital-twin-viewer.html -->
<!-- Salva e apri in un browser -->
<!-- Include Three.js, GLTFLoader, e script di caricamento -->
```

---

## 💻 STEP 3: Codice di Integrazione

### Configurazione Modelli

```javascript
const MODELS_CONFIG = {
  models: [
    {
      id: '1',
      name: 'IMM-7 — Cella Assembly',
      desc: 'Banco assembly su profilati con gabbia, attuatori verticali e carrello lineare',
      glbData: 'Z2xURgIAAAAsXhwA...', // Base64 da nexus.html
      neonColor: '#00FFFF' // Cyan
    },
    // ... altri 7 modelli
  ],
  theme: {
    background: '#0a0e17',
    ambientIntensity: 0.4,
    directionalIntensity: 1.2,
    neonGlowIntensity: 0.8
  }
};
```

### Caricamento Modelli

```javascript
async function loadNexusModel(modelData) {
  // 1. Converti base64 a Blob
  const binaryString = atob(modelData.glbData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  // 2. Carica con GLTFLoader
  const gltf = await loader.loadAsync(url);

  // 3. Applica materiali neon
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: modelData.neonColor,
        emissive: modelData.neonColor,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });
    }
  });

  // 4. Aggiungi alla scena
  scene.add(gltf.scene);
}
```

### Illuminazione Neon

```javascript
// Lighting per effetto neon
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Post-processing per glow
const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85 // threshold
);
composer.addPass(bloomPass);
```

---

## 📊 STEP 4: Rimozione Modelli Vecchi

Nel Digital Twin Simulator online:

1. Identifica i modelli vecchi nel codice
2. Rimuovi o commenta le sezioni di caricamento
3. Sostituisci con SOLO i 8 modelli da nexus.html

```javascript
// RIMUOVERE QUESTI
// oldModels.forEach(m => scene.remove(m));

// AGGIUNGERE QUESTI
nexusModels.forEach(m => scene.add(m));
```

---

## 🎯 STEP 5: Validazione

Controlla che:

✅ Tutti e 8 i modelli siano caricati  
✅ I colori neon siano applicati correttamente  
✅ I modelli vecchi siano rimossi  
✅ L'illuminazione crei l'effetto neon desiderato  
✅ Le performance siano buone (60 FPS)

```javascript
// Debug Console
console.log('Modelli in scena:', scene.children.length);
scene.children.forEach(child => {
  console.log('- ' + (child.name || child.type));
});
```

---

## 📝 Checklist Implementazione

- [ ] Estrai dati GLB da `nexus.html`
- [ ] Popola `MODELS_DATA` in `integration-script.js`
- [ ] Testa caricamento localmente con HTML
- [ ] Accedi a simulator online
- [ ] Incolla codice integrazione
- [ ] Verifica caricamento modelli
- [ ] Applica colori neon
- [ ] Rimuovi modelli vecchi
- [ ] Valida performance
- [ ] Deploy

---

## 🔗 Link Utili

- **Simulator:** https://dist-fmwkbjau.devinapps.com/digital-twin
- **nexus.html:** `C:\Users\frapa\Desktop\nexus\nexus.html`
- **Script integrazione:** `C:\Users\frapa\Desktop\nexus\integration-script.js`

---

## 📞 Support

Se incontri problemi:

1. **Modelli non carichi?** → Verifica base64 data in `MODELS_DATA`
2. **Colori non neon?** → Aumenta `emissiveIntensity` a 0.8-1.0
3. **Performance lenta?** → Riduci qualità geometria o numero di modelli
4. **Errori console?** → Controlla che Three.js e GLTFLoader siano caricati

---

**Creato:** 2026-04-30  
**Ultimo aggiornamento:** Integration Guide v1.0
