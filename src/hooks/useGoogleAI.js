import { useState, useCallback } from 'react';

/**
 * Hook per integrare Google Gemini AI nel gestionale.
 *
 * SETUP CHIAVE API:
 * 1. Crea il file .env.local nella root del progetto
 * 2. Aggiungi: VITE_GOOGLE_AI_API_KEY=la_tua_chiave
 * 3. Riavvia il dev server
 * 4. Ottieni la chiave da: https://aistudio.google.com/app/apikey
 */

const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
// Catena di modelli con fallback automatico in caso di 404/429.
// gemini-2.5-flash-lite è il free-tier con quota più alta disponibile;
// gemini-flash-latest e 2.0-flash-lite seguono come ulteriori fallback.
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
const GEMINI_URL_FALLBACK = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
const GEMINI_URL_FALLBACK_2 = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

export function useGoogleAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasApiKey = Boolean(GOOGLE_AI_API_KEY);

  // ───────────────────────────────────────────────────────────
  // CORE: chiamata a Gemini text + vision
  // ───────────────────────────────────────────────────────────
  const callGemini = useCallback(async (parts, generationConfig = {}) => {
    if (!hasApiKey) {
      const err = 'VITE_GOOGLE_AI_API_KEY mancante in .env.local';
      setError(err);
      return null;
    }

    setLoading(true);
    setError(null);

    const body = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
        // Disabilita thinking tokens (consumano budget e non servono per JSON output)
        thinkingConfig: { thinkingBudget: 0 },
        ...generationConfig,
      },
    };

    const tryFetch = async (url) => {
      const response = await fetch(`${url}?key=${GOOGLE_AI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data?.error?.message || `Errore API: ${response.status}`;
        const code = data?.error?.code || response.status;
        const err = new Error(msg);
        err.code = code;
        throw err;
      }
      return data;
    };

    const shouldFallback = (e) => e.code === 404 || e.code === 429
      || /not found|not supported|quota|exceeded/i.test(e.message);

    try {
      let data;
      try {
        data = await tryFetch(GEMINI_URL);
      } catch (e1) {
        if (!shouldFallback(e1)) throw e1;
        console.warn(`Modello primario fallito (${e1.code}), provo fallback 1:`, e1.message);
        try {
          data = await tryFetch(GEMINI_URL_FALLBACK);
        } catch (e2) {
          if (!shouldFallback(e2)) throw e2;
          console.warn(`Fallback 1 fallito (${e2.code}), provo fallback 2:`, e2.message);
          data = await tryFetch(GEMINI_URL_FALLBACK_2);
        }
      }

      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '';
      const finishReason = candidate?.finishReason;

      return { text, usage: data.usageMetadata || {}, finishReason };
    } catch (err) {
      const friendly = /quota|exceeded|RESOURCE_EXHAUSTED/i.test(err.message)
        ? 'Quota Gemini esaurita. Attendi qualche minuto o controlla https://ai.dev/rate-limit'
        : /API key|API_KEY|invalid/i.test(err.message)
        ? 'Chiave API non valida. Verifica VITE_GOOGLE_AI_API_KEY in .env.local'
        : err.message;
      setError(friendly);
      console.error('Gemini error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasApiKey]);

  // ───────────────────────────────────────────────────────────
  // Convert image URL to base64 for inline_data
  // ───────────────────────────────────────────────────────────
  const imageToBase64 = useCallback(async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve({ base64, mimeType: blob.type || 'image/jpeg' });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // ───────────────────────────────────────────────────────────
  // Parse JSON robusto (Gemini a volte aggiunge markdown)
  // ───────────────────────────────────────────────────────────
  const parseJsonResponse = useCallback((text) => {
    if (!text || typeof text !== 'string') return null;

    // Strategy 1: parse direct (responseMimeType: application/json già pulisce tutto)
    try { return JSON.parse(text); } catch {}

    // Strategy 2: rimuovi markdown fence e prova
    const noFence = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    try { return JSON.parse(noFence); } catch {}

    // Strategy 3: estrai il primo blocco JSON valido (oggetto o array) bilanciando le parentesi
    const findBalanced = (str, openChar, closeChar) => {
      const start = str.indexOf(openChar);
      if (start === -1) return null;
      let depth = 0;
      let inString = false;
      let escape = false;
      for (let i = start; i < str.length; i++) {
        const ch = str[i];
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (ch === openChar) depth++;
        else if (ch === closeChar) {
          depth--;
          if (depth === 0) return str.slice(start, i + 1);
        }
      }
      return null;
    };

    const objCandidate = findBalanced(noFence, '{', '}');
    if (objCandidate) {
      try { return JSON.parse(objCandidate); } catch {}
    }
    const arrCandidate = findBalanced(noFence, '[', ']');
    if (arrCandidate) {
      try { return JSON.parse(arrCandidate); } catch {}
    }

    // Strategy 4: ripara JSON troncato (chiude parentesi mancanti)
    try {
      let fixed = noFence;
      const openBraces = (fixed.match(/\{/g) || []).length;
      const closeBraces = (fixed.match(/\}/g) || []).length;
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;
      // chiudi virgolette aperte
      const quotes = (fixed.match(/(?<!\\)"/g) || []).length;
      if (quotes % 2 === 1) fixed += '"';
      // rimuovi trailing comma
      fixed = fixed.replace(/,\s*([}\]])/g, '$1');
      // chiudi parentesi
      for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += ']';
      for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}';
      return JSON.parse(fixed);
    } catch {}

    return null;
  }, []);

  // ───────────────────────────────────────────────────────────
  // RISK MITIGATION: rileva bounding box dei danni in tempo reale
  // ───────────────────────────────────────────────────────────
  const detectDamageBoundingBoxes = useCallback(async (imageUrl, componentInfo = {}) => {
    const { base64, mimeType } = await imageToBase64(imageUrl);

    const prompt = `Sei un perito tecnico che analizza foto di componenti industriali danneggiati.

COMPONENTE: ${componentInfo.product || 'componente industriale'}
PARTE: ${componentInfo.component || 'non specificato'}
DANNO DICHIARATO: ${componentInfo.damageType || 'non specificato'}

ANALIZZA L'IMMAGINE e identifica tutte le aree di danno visibili.
Per ogni area di danno rilevata fornisci coordinate normalizzate 0-100 (percentuale rispetto alle dimensioni dell'immagine).

Rispondi SOLO con JSON valido (no markdown):
{
  "boundingBoxes": [
    { "x": 18, "y": 22, "w": 25, "h": 18, "label": "etichetta breve danno", "severity": "critico|alto|medio|basso" }
  ],
  "verdict": "APPROVATA|RIFIUTATA",
  "confidence": numero 0-100,
  "damageType": "usura normale|difetto fabbrica|negligenza|urto|sovraccarico",
  "verdictReason": "motivazione concisa",
  "aiLog": [
    "> Inizializzazione scansione Gemini Vision...",
    "> Analisi pixel e pattern danno...",
    "> Rilevate N anomalie nell'immagine",
    "> Confronto con database difetti...",
    "> ESITO: descrizione",
    "> Confidenza: XX%"
  ],
  "technicalDetails": ["dettaglio 1", "dettaglio 2"]
}

REGOLE:
- APPROVATA solo per difetto fabbrica o usura normale entro vita utile
- RIFIUTATA per negligenza, urti, sovraccarico oltre specifica
- x,y = coordinate angolo top-left in % (0-100)
- w,h = larghezza/altezza in % (0-100)`;

    const result = await callGemini([
      { text: prompt },
      { inline_data: { mime_type: mimeType, data: base64 } },
    ]);

    if (!result) return null;

    const parsed = parseJsonResponse(result.text);
    if (!parsed) {
      return { rawText: result.text, parseError: true, usage: result.usage };
    }
    return { ...parsed, usage: result.usage };
  }, [callGemini, imageToBase64, parseJsonResponse]);

  // ───────────────────────────────────────────────────────────
  // VISUAL TRAINING: riconoscimento step in tempo reale
  // ───────────────────────────────────────────────────────────
  const detectTrainingStep = useCallback(async (imageUrl, procedureContext) => {
    const { base64, mimeType } = await imageToBase64(imageUrl);

    const stepsList = procedureContext.steps
      .map((s, i) => `${i + 1}. ${s.it || s}`)
      .join('\n');

    const expectedStep = procedureContext.expectedStep;
    const expectedStepDesc = expectedStep != null
      ? procedureContext.steps[expectedStep - 1]?.it || procedureContext.steps[expectedStep - 1]
      : null;

    const focusBlock = expectedStep
      ? `\nPASSO ATTESO IN CORSO (focus): ${expectedStep}. ${expectedStepDesc}\nVerifica se l'operatore sta eseguendo CORRETTAMENTE questo passo specifico.\n`
      : '';

    const prompt = `Sei un AI assistente per operatori industriali durante l'assemblaggio.
Analizza l'immagine del macchinario e genera guida operativa CONCRETA per il passo specifico.

PROCEDURA: ${procedureContext.component || 'Assemblaggio'}
PASSI:
${stepsList}
${focusBlock}
COMPITO:
1. Conferma il passo (currentStep) considerando il PASSO ATTESO indicato sopra (se presente)
2. Indica MAX 3 PUNTI PRECISI sul macchinario dove l'operatore deve INTERVENIRE per completare il passo
3. Per ogni punto fornisci coordinate 3D NORMALIZZATE (nx,ny,nz) in [0..1]
   relative al bounding box del modello 3D:
     nx=0 sinistra, nx=1 destra
     ny=0 basso,    ny=1 alto
     nz=0 dietro,   nz=1 davanti
   Es: la parte alta-frontale-centrale = (0.5, 0.85, 0.85)
4. Etichette CORTE e hint AZIONABILI (cosa deve fare l'operatore ORA)

Rispondi SOLO JSON valido (no markdown):
{
  "currentStep": numero (1-${procedureContext.steps.length}),
  "confidence": numero 0-100,
  "highlights": [
    {
      "label": "TESTO BREVE max 14 char",
      "nx": 0.5, "ny": 0.7, "nz": 0.5,
      "color": "#22c55e",
      "hint": "azione specifica AZIONABILE per l'operatore (max 60 char)"
    }
  ],
  "stepGuidance": "guida concreta 1-2 frasi: cosa fare ORA per completare lo step",
  "nextAction": "prossima azione concreta (max 80 char)",
  "warnings": ["avvertimento se vedi qualcosa di sbagliato"],
  "aiLog": [
    "> Analisi modello 3D via Gemini Vision...",
    "> Identificati N punti di intervento per il passo",
    "> Step ${expectedStep ?? 'auto'}: pianificazione highlights 3D",
    "> Generata guida operativa contestuale"
  ]
}

REGOLE STRETTE:
- nx, ny, nz tra 0 e 1 (coordinate normalizzate nel bounding box, NON pixel)
- Massimo 3 highlights — qualità > quantità
- Punti SPECIFICI sul componente del passo, non posizioni generiche
- Colori: #22c55e (azione corretta), #f59e0b (attenzione/coppia), #ef4444 (pericolo/critico), #06b6d4 (info/sensore), #a855f7 (allineamento), #f97316 (calore/temp)
- "hint" deve essere AZIONABILE (es: "Stringere 25 Nm CW", "Verifica LED verde", non "vite")
- Distribuisci i punti su parti DIVERSE del modello 3D (no sovrapposti)`;

    const result = await callGemini([
      { text: prompt },
      { inline_data: { mime_type: mimeType, data: base64 } },
    ]);

    if (!result) return null;

    const parsed = parseJsonResponse(result.text);
    if (!parsed) {
      return { rawText: result.text, parseError: true, usage: result.usage };
    }
    return { ...parsed, usage: result.usage };
  }, [callGemini, imageToBase64, parseJsonResponse]);

  // ───────────────────────────────────────────────────────────
  // DIGITAL TWIN: ottimizzazione carrello/spazio/produzione
  // ───────────────────────────────────────────────────────────
  const optimizeProduction = useCallback(async (productData) => {
    const prompt = `Sei un AI di ottimizzazione produzione industriale (Digital Twin).
Analizza i dati del macchinario e fornisci suggerimenti di ottimizzazione.

DATI MACCHINARIO:
${JSON.stringify(productData, null, 2)}

Fornisci JSON con:
{
  "optimizationScore": numero 0-100,
  "bottlenecks": ["collo di bottiglia 1"],
  "suggestions": [
    {
      "category": "carrello|spazio|tempi|energia|qualita",
      "priority": "alta|media|bassa",
      "title": "titolo breve",
      "description": "descrizione dettagliata",
      "expectedSaving": "stima risparmio (es: -2 sec/ciclo)"
    }
  ],
  "predictedOEE": {
    "currentOEE": numero,
    "optimizedOEE": numero,
    "delta": numero
  },
  "criticalAlerts": ["allarme critico"],
  "simulationLog": [
    "> Caricamento dati Digital Twin...",
    "> Algoritmo genetico avviato...",
    "> Iterazione 5000/15000...",
    "> Convergenza raggiunta",
    "> Risparmio stimato: ..."
  ]
}`;

    const result = await callGemini([{ text: prompt }]);
    if (!result) return null;
    const parsed = parseJsonResponse(result.text);
    if (!parsed) return { rawText: result.text, parseError: true, usage: result.usage };
    return { ...parsed, usage: result.usage };
  }, [callGemini, parseJsonResponse]);

  return {
    loading,
    error,
    hasApiKey,
    detectDamageBoundingBoxes,
    detectTrainingStep,
    optimizeProduction,
  };
}
