import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Brain, FileText, Send, Loader2, Truck, Terminal } from 'lucide-react';
import AlertBar from '../components/AlertBar';

const tickets = [
  {
    id: '#402',
    title: 'Rottura Motore Pneumatico',
    client: 'Stellantis Automoveis (Brasile)',
    product: 'Motore Pneumatico MP-200',
    image: '/images/as-products/sospensioni-3.jpg',
    date: '2026-04-22',
    component: 'Albero di trasmissione principale',
    damageType: 'Urto meccanico contundente',
    boundingBoxes: [
      { x: 18, y: 22, w: 25, h: 18, label: 'Segni di urto', severity: 'critico' },
      { x: 55, y: 35, w: 20, h: 15, label: 'Graffi profondi', severity: 'alto' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: visual-damage-detector-v4.1',
      '> Analisi tolleranze fisiche vs Digital Twin: COMPLETATA',
      '> Confronto con specifica dimensionale originale: ±0.02mm',
      '> Rilevamento: Evidenti segni di urto meccanico contundente',
      '>   non derivanti dal normale ciclo di lavoro.',
      '> Deformazione albero: 0.35mm (tolleranza max: 0.05mm)',
      '> Pattern di usura incompatibile con rotazione standard.',
      '> ESITO CAUSA: Negligenza operatore.',
      '> Confidenza analisi: 94.7%',
    ],
    verdict: 'RIFIUTATA',
    verdictReason: 'Danno causato da negligenza operatore — urto meccanico non compatibile con ciclo di lavoro standard',
    confidence: 94.7,
  },
  {
    id: '#398',
    title: 'Vibrazioni Anomale Riduttore',
    client: 'BMW Group (USA - Spartanburg)',
    product: 'Riduttore Epicicloidale RE-400',
    image: '/images/as-products/sospensioni-1.jpg',
    date: '2026-04-18',
    component: 'Cuscinetto reggispinta interno',
    damageType: 'Usura prematura',
    boundingBoxes: [
      { x: 30, y: 28, w: 30, h: 22, label: 'Usura cuscinetto', severity: 'medio' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: bearing-wear-classifier-v3.2',
      '> Analisi pattern di usura vs cicli di vita attesi: COMPLETATA',
      '> Ore di funzionamento dichiarate: 2.340h',
      '> Vita utile attesa cuscinetto: 8.000h (SKF 6308-2RS)',
      '> Rilevamento: Usura prematura non attribuibile a uso improprio.',
      '> Possibile lotto difettoso: SKF batch #LT-2025-0892',
      '> ESITO CAUSA: Difetto componente fornitore.',
      '> Confidenza analisi: 88.2%',
    ],
    verdict: 'APPROVATA',
    verdictReason: 'Difetto di fabbricazione cuscinetto SKF — usura prematura a 2.340h su vita attesa di 8.000h',
    confidence: 88.2,
  },
  {
    id: '#395',
    title: 'Malfunzionamento Pinza Saldatura',
    client: 'FCA US LLC (Detroit)',
    product: 'Pinza Robotica 6-assi PR-600',
    image: '/images/as-products/maschere-2.jpg',
    date: '2026-04-15',
    component: 'Trasformatore MFDC',
    damageType: 'Sovraccarico elettrico',
    boundingBoxes: [
      { x: 20, y: 15, w: 35, h: 25, label: 'Bruciatura trasformatore', severity: 'critico' },
      { x: 60, y: 50, w: 15, h: 12, label: 'Fusione connettore', severity: 'alto' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: electrical-damage-analyzer-v2.5',
      '> Analisi termica e pattern di bruciatura: COMPLETATA',
      '> Corrente nominale trasformatore: 18kA @ 50% duty cycle',
      '> Rilevamento: Sovraccarico elettrico da uso oltre specifica.',
      '>   Duty cycle effettivo stimato: 85% (max consentito: 50%)',
      '>   Temperatura interna stimata: >180°C (max: 120°C)',
      '> Causa: utilizzo continuativo senza pause di raffreddamento.',
      '> ESITO CAUSA: Negligenza operatore — uso oltre specifica.',
      '> Confidenza analisi: 91.3%',
    ],
    verdict: 'RIFIUTATA',
    verdictReason: 'Sovraccarico elettrico da uso oltre specifica — duty cycle 85% vs max consentito 50%',
    confidence: 91.3,
  },
  {
    id: '#390',
    title: 'Perdita Olio Banco Test',
    client: 'IVECO S.p.A. (Torino)',
    product: 'Banco Iniettori BT-200',
    image: '/images/as-products/avvitatura-3.jpg',
    date: '2026-04-10',
    component: 'Guarnizione alta pressione',
    damageType: 'Usura normale',
    boundingBoxes: [
      { x: 35, y: 40, w: 22, h: 15, label: 'Guarnizione usurata', severity: 'basso' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: seal-integrity-checker-v1.8',
      '> Analisi stato guarnizione vs cicli pressione: COMPLETATA',
      '> Cicli pressurizzazione effettuati: 45.200',
      '> Vita attesa guarnizione: 40.000 cicli (Parker Hannifin)',
      '> Rilevamento: Usura compatibile con ciclo di vita nominale.',
      '> Nessun segno di uso improprio o sovrapressione.',
      '> ESITO CAUSA: Usura normale — fine vita utile componente.',
      '> Confidenza analisi: 96.1%',
    ],
    verdict: 'APPROVATA',
    verdictReason: 'Usura normale guarnizione — 45.200 cicli su vita attesa di 40.000 cicli',
    confidence: 96.1,
  },
  {
    id: '#387',
    title: 'Deformazione Telaio Stazione',
    client: 'NKE Automation (Alpignano)',
    product: 'Stazione Saldatura S-12',
    image: '/images/as-products/maschere-3.png',
    date: '2026-04-05',
    component: 'Telaio portante in acciaio S355',
    damageType: 'Urto con muletto',
    boundingBoxes: [
      { x: 10, y: 30, w: 40, h: 30, label: 'Deformazione telaio', severity: 'critico' },
      { x: 55, y: 20, w: 18, h: 14, label: 'Segni pneumatico', severity: 'medio' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: structural-deformation-v3.0',
      '> Analisi deformazione vs carichi di esercizio: COMPLETATA',
      '> Deformazione rilevata: 12mm su asse Y (tolleranza: 0.5mm)',
      '> Pattern di deformazione puntiforme — incompatibile con',
      '>   stress termico o fatica strutturale.',
      '> Rilevamento: Segni compatibili con urto da mezzo mobile.',
      '> Tracce di gomma industriale identificate sulla superficie.',
      '> ESITO CAUSA: Urto accidentale con muletto.',
      '> Confidenza analisi: 97.8%',
    ],
    verdict: 'RIFIUTATA',
    verdictReason: 'Urto accidentale da muletto — deformazione 12mm incompatibile con stress operativo normale',
    confidence: 97.8,
  },
];

export default function RiskMitigation() {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiLineIndex, setAiLineIndex] = useState(0);
  const [aiComplete, setAiComplete] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [sendingRefusal, setSendingRefusal] = useState(false);
  const [sentRefusal, setSentRefusal] = useState(false);
  const [planningShip, setPlanningShip] = useState(false);
  const [plannedShip, setPlannedShip] = useState(false);

  const runAI = () => {
    setAiRunning(true);
    setAiLineIndex(0);
    setAiComplete(false);
  };

  useEffect(() => {
    if (aiRunning && aiLineIndex < selectedTicket.aiLog.length) {
      const timer = setTimeout(() => setAiLineIndex(aiLineIndex + 1), 400);
      return () => clearTimeout(timer);
    } else if (aiRunning && aiLineIndex >= selectedTicket.aiLog.length) {
      setAiRunning(false);
      setAiComplete(true);
    }
  }, [aiRunning, aiLineIndex, selectedTicket]);

  const handleSelectTicket = (t) => {
    setSelectedTicket(t);
    setAiComplete(false);
    setAiRunning(false);
    setAiLineIndex(0);
    setGenerated(false);
    setSentRefusal(false);
    setPlannedShip(false);
  };

  const handleGenerate = () => {
    if (generating || generated) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };
  
  const handleSendRefusal = () => {
    if (sendingRefusal || sentRefusal) return;
    setSendingRefusal(true);
    setTimeout(() => { setSendingRefusal(false); setSentRefusal(true); }, 1500);
  };
  
  const handlePlanShip = () => {
    if (planningShip || plannedShip) return;
    setPlanningShip(true);
    setTimeout(() => { setPlanningShip(false); setPlannedShip(true); }, 1500);
  };

  const verdictColor = selectedTicket.verdict === 'RIFIUTATA' ? '#ef4444' : '#22c55e';
  const verdictBg = selectedTicket.verdict === 'RIFIUTATA' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)';

  return (
    <div className="p-6">
      <AlertBar message="ALERT: 2 reclami garanzia in attesa di analisi AI — Coda di elaborazione attiva" />

      <div className="flex items-center gap-2 mb-5">
        <Shield size={22} className="text-[#00d4aa]" />
        <div>
          <h2 className="text-xl font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>RISK MITIGATION & CLAIMS</h2>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Modalità Post-Vendita · Analisi AI danni · Gestione garanzie</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* LEFT: Ticket list */}
        <div className="col-span-3 space-y-2">
          <h3 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>RECLAMI APERTI</h3>
          {tickets.map(t => (
            <button key={t.id} onClick={() => handleSelectTicket(t)}
              className="w-full text-left rounded-xl p-3 transition-all"
              style={{
                background: t.id === selectedTicket.id ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
                border: `1px solid ${t.id === selectedTicket.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-accent)' }}>Ticket {t.id}</span>
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-text-secondary)', opacity: 0.4 }} />
              </div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{t.title}</p>
              <p className="text-[0.6rem]" style={{ color: 'var(--color-text-secondary)' }}>{t.client}</p>
              <p className="text-[0.55rem] mt-1" style={{ color: 'var(--color-text-secondary)' }}>{t.date}</p>
            </button>
          ))}
        </div>

        {/* CENTER: Damage viewer with bounding boxes */}
        <div className="col-span-5">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>VISUALIZZATORE DANNI — AI ANALYSIS</span>
              <span className="text-[0.6rem] font-mono" style={{ color: 'var(--color-text-secondary)' }}>Ticket {selectedTicket.id}</span>
            </div>

            {/* Damage visualization area */}
            <div className="relative" style={{ minHeight: '300px', background: '#0d1117' }}>
              {/* Real photo of the component */}
              <div className="absolute inset-0">
                <img src={selectedTicket.image} alt={selectedTicket.component}
                  className="w-full h-full object-cover" style={{ opacity: 0.7, minHeight: '300px' }} />
                {/* Dark overlay for better bounding box visibility */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />

                {/* Bounding boxes from AI */}
                {(aiComplete || aiRunning) && selectedTicket.boundingBoxes.map((bb, i) => {
                  const color = bb.severity === 'critico' ? '#ef4444' : bb.severity === 'alto' ? '#f97316' : bb.severity === 'medio' ? '#f59e0b' : '#3b82f6';
                  return (
                    <div key={i} className="absolute transition-opacity duration-500" style={{
                      left: `${bb.x}%`, top: `${bb.y}%`, width: `${bb.w}%`, height: `${bb.h}%`,
                      border: `2px solid ${color}`, borderRadius: '4px',
                      background: `${color}10`,
                      animation: 'pulse 2s ease-in-out infinite',
                      opacity: aiComplete ? 1 : 0.4,
                    }}>
                      <div className="absolute -top-4 left-0 flex items-center gap-1">
                        <AlertTriangle size={8} style={{ color }} />
                        <span className="text-[0.5rem] font-mono font-bold px-1 py-0.5 rounded" style={{ background: `${color}20`, color }}>{bb.label}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Scan line animation */}
                {aiRunning && (
                  <div className="absolute left-0 right-0 h-0.5" style={{
                    background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)',
                    top: `${(aiLineIndex / selectedTicket.aiLog.length) * 100}%`,
                    transition: 'top 0.3s ease',
                  }} />
                )}
              </div>

              {/* Info overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${aiRunning ? 'bg-amber-500 animate-pulse' : aiComplete ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-[0.55rem] font-mono font-bold" style={{ color: aiRunning ? '#f59e0b' : aiComplete ? '#22c55e' : '#94a3b8' }}>
                  {aiRunning ? 'SCANSIONE IN CORSO...' : aiComplete ? 'ANALISI COMPLETATA' : 'IN ATTESA DI SCANSIONE'}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-[0.55rem] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa' }}>
                  LMM v4.1
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <button onClick={runAI} disabled={aiRunning}
                  className="text-[0.6rem] px-3 py-1.5 rounded-lg font-bold transition-all"
                  style={{ background: aiRunning ? 'rgba(249,115,22,0.15)' : aiComplete ? 'rgba(0,212,170,0.1)' : 'linear-gradient(135deg, #00d4aa, #00a88a)', border: `1px solid ${aiRunning ? 'rgba(249,115,22,0.3)' : 'rgba(0,212,170,0.4)'}`, color: aiRunning ? '#f97316' : aiComplete ? '#00d4aa' : '#0a0e17' }}>
                  {aiRunning ? <><Loader2 size={10} className="inline animate-spin mr-1" />Scansione LMM in corso...</> : aiComplete ? '▶ Riesegui Scansione AI' : <><Brain size={10} className="inline mr-1" />Avvia Scansione AI</>}
                </button>
              </div>
            </div>
          </div>

          {/* Verdict semaphore - only visible after AI scan completes */}
          {aiComplete ? (
            <div className="mt-4 rounded-xl p-4" style={{ background: verdictBg, border: `2px solid ${verdictColor}40` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${verdictColor}20`, border: `3px solid ${verdictColor}` }}>
                    {selectedTicket.verdict === 'RIFIUTATA' ? <XCircle size={24} style={{ color: verdictColor }} /> : <CheckCircle size={24} style={{ color: verdictColor }} />}
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: verdictColor }}>
                      GARANZIA {selectedTicket.verdict}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{selectedTicket.verdictReason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold" style={{ color: verdictColor }}>{selectedTicket.confidence}%</div>
                  <div className="text-[0.55rem]" style={{ color: 'var(--color-text-secondary)' }}>Confidenza AI</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl p-4 flex items-center justify-center gap-3" style={{ background: 'var(--color-bg-card)', border: '2px dashed var(--color-border)', minHeight: '80px' }}>
              {aiRunning ? (
                <><Loader2 size={20} className="animate-spin" style={{ color: '#f59e0b' }} /><span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Analisi AI in corso — attendere verdetto...</span></>
              ) : (
                <><Brain size={20} style={{ color: 'var(--color-text-secondary)' }} /><span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Premi "Avvia Scansione AI" per ottenere il verdetto garanzia</span></>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: AI Console + Actions */}
        <div className="col-span-4 space-y-4">
          {/* AI Console */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#1a1b26', border: '1px solid #2a2b36' }}>
            <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid #2a2b36', background: '#16171f' }}>
              <Terminal size={12} className="text-green-400" />
              <span className="text-[0.6rem] font-mono font-bold text-green-400">CONSOLE REFERTO AI</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="p-3 font-mono text-[0.65rem] leading-relaxed max-h-64 overflow-y-auto" style={{ color: '#e2e8f0' }}>
              {!aiRunning && !aiComplete && aiLineIndex === 0 && (
                <div style={{ color: '#4a5568' }}>&gt; In attesa di scansione...<br/>&gt; Seleziona un ticket e premi "Avvia Scansione AI"<br/>&gt; _</div>
              )}
              {(aiRunning || aiComplete) && selectedTicket.aiLog.slice(0, aiComplete ? selectedTicket.aiLog.length : aiLineIndex).map((line, i) => {
                let lineColor = '#94a3b8';
                if (line.includes('ESITO CAUSA')) lineColor = selectedTicket.verdict === 'RIFIUTATA' ? '#ef4444' : '#22c55e';
                else if (line.includes('COMPLETATA')) lineColor = '#22c55e';
                else if (line.includes('Rilevamento') || line.includes('Confidenza')) lineColor = '#f59e0b';
                else if (line.includes('Inizializzazione') || line.includes('Caricamento')) lineColor = '#60a5fa';
                return <div key={i} style={{ color: lineColor }}>{line}</div>;
              })}
              {aiRunning && <span className="inline-block w-2 h-3 bg-green-400 animate-pulse" />}
            </div>
          </div>

          {/* Ticket info */}
          <div className="rounded-xl p-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>DETTAGLI TICKET</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Prodotto</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{selectedTicket.product}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Componente</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{selectedTicket.component}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Tipo danno</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{selectedTicket.damageType}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Data</span>
                <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>{selectedTicket.date}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button onClick={handleGenerate} disabled={generating || generated || !aiComplete}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={generated
                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                : { background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
              {generating ? <><Loader2 size={14} className="animate-spin" /> Generazione in corso...</> : generated ? <><CheckCircle size={14} /> Report Legale PDF Generato</> : <><FileText size={14} /> Genera Report Legale (PDF)</>}
            </button>

            {aiComplete && selectedTicket.verdict === 'RIFIUTATA' && (
              <button onClick={handleSendRefusal} disabled={sendingRefusal || sentRefusal}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={sentRefusal
                  ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                  : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {sendingRefusal ? <><Loader2 size={14} className="animate-spin" /> Invio rifiuto...</> : sentRefusal ? <><CheckCircle size={14} /> Rifiuto Inviato al Cliente</> : <><Send size={14} /> Invia Rifiuto al Cliente</>}
              </button>
            )}

            <button onClick={handlePlanShip} disabled={planningShip || plannedShip || !aiComplete}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={plannedShip
                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                : { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
              {planningShip ? <><Loader2 size={14} className="animate-spin" /> Pianificazione...</> : plannedShip ? <><CheckCircle size={14} /> Spedizione Pianificata</> : <><Truck size={14} /> Pianifica Spedizione Ricambio a Pagamento</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}