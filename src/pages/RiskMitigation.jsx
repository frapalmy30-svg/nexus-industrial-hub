import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Brain, FileText, Send, Loader2, Truck, Terminal, X, Calendar, Package, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import AlertBar from '../components/AlertBar';
import { useGoogleAI } from '../hooks/useGoogleAI';

// Foto reali dal sito ufficiale Automazioni & Service Srl, Piobesi Torino
// automazioniservice.com — immagini di macchinari reali in officina/stabilimento
const DAMAGE_IMG = {
  manipolatore: '/images/damage-claims/ticket-402.jpg',  // Manipolatore BMW: braccio in acciaio con sistema di presa
  sospensioni:  '/images/damage-claims/ticket-398.jpg',  // Linea sospensioni: struttura pressa con guide e stazioni
  saldatura:    '/images/damage-claims/ticket-395.jpg',  // Maschera saldatura: fixture lamierati con clamp
  bancoCicli:   '/images/damage-claims/ticket-390.png',  // Banco rulli: impianto simulazione manto stradale
  telaioSald:   '/images/damage-claims/ticket-387.jpg',  // Telaio saldatura: struttura portante in acciaio
};

const tickets = [
  {
    id: '#402',
    title: 'Cedimento Giunto Manipolatore BMW',
    client: 'BMW Group (USA - Spartanburg)',
    product: 'Manipolatore di Carico MAN-300',
    image: DAMAGE_IMG.manipolatore,
    date: '2026-04-22',
    component: 'Giunto rotante braccio principale',
    damageType: 'Rottura per fatica del perno di rotazione',
    boundingBoxes: [
      { x: 18, y: 30, w: 28, h: 22, label: 'Giunto ceduto', severity: 'critico' },
      { x: 52, y: 22, w: 20, h: 16, label: 'Perno fessurato', severity: 'alto' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: joint-fatigue-detector-v4.1',
      '> Analisi geometria giunto vs disegno costruttivo: COMPLETATA',
      '> Gioco rilevato sul perno: 0.8mm (tolleranza max: 0.05mm)',
      '> Pattern fessurazione: propagazione da cricca da fatica',
      '>   compatibile con 280.000 cicli oltre vita utile.',
      '> Nessuna traccia di urto esterno o sovraccarico istantaneo.',
      '> ESITO CAUSA: Usura ciclo-vita — fine vita utile perno.',
      '> Confidenza analisi: 93.4%',
    ],
    verdict: 'APPROVATA',
    verdictReason: 'Rottura per fatica ciclo-vita oltre i 280.000 cicli previsti — difetto non imputabile a uso improprio',
    confidence: 93.4,
  },
  {
    id: '#398',
    title: 'Allentamento Guide Linea Sospensioni',
    client: 'Stellantis Automoveis (Brasile)',
    product: 'Linea Assemblaggio Sospensioni LAS-200',
    image: DAMAGE_IMG.sospensioni,
    date: '2026-04-18',
    component: 'Guide prismatiche stazione pressa molla',
    damageType: 'Usura e gioco eccessivo su guide lineari',
    boundingBoxes: [
      { x: 25, y: 28, w: 30, h: 26, label: 'Gioco guide', severity: 'medio' },
      { x: 60, y: 42, w: 18, h: 14, label: 'Striscianti usurati', severity: 'medio' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: linear-guide-wear-v3.2',
      '> Analisi gioco su coppie prismatiche: COMPLETATA',
      '> Gioco misurato: 0.35mm (tolleranza max: 0.08mm)',
      '> Analisi lubrificazione: grasso solidificato rilevato.',
      '> Intervallo lubrificazione: >18 mesi (specifica: 6 mesi).',
      '> ESITO CAUSA: Mancata manutenzione lubrificazione guide.',
      '> Confidenza analisi: 87.6%',
    ],
    verdict: 'RIFIUTATA',
    verdictReason: 'Manutenzione lubrificazione non eseguita nei tempi — gioco 0.35mm su guide (max 0.08mm ammesso)',
    confidence: 87.6,
  },
  {
    id: '#395',
    title: 'Deformazione Clamp Maschera Saldatura',
    client: 'FCA US LLC (Detroit)',
    product: 'Maschera Bloccaggio Saldatura MBS-400',
    image: DAMAGE_IMG.saldatura,
    date: '2026-04-15',
    component: 'Braccio clamp pneumatico lato sinistro',
    damageType: 'Deformazione plastica per sovrapressione',
    boundingBoxes: [
      { x: 20, y: 22, w: 32, h: 24, label: 'Braccio deformato', severity: 'critico' },
      { x: 58, y: 46, w: 16, h: 14, label: 'Foro ovalizzato', severity: 'alto' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: clamp-deformation-analyzer-v2.5',
      '> Analisi geometria braccio clamp vs CAD: COMPLETATA',
      '> Deviazione asse perno: 2.1mm (tolleranza: 0.1mm)',
      '> Pressione operativa impostata: 9.5 bar (max spec: 6 bar)',
      '> Rilevamento: deformazione da sovrapressione prolungata.',
      '> ESITO CAUSA: Pressione alimentazione fuori specifica.',
      '> Confidenza analisi: 92.1%',
    ],
    verdict: 'RIFIUTATA',
    verdictReason: 'Pressione impostata a 9.5 bar vs massimo 6 bar — deformazione per uso improprio non coperta da garanzia',
    confidence: 92.1,
  },
  {
    id: '#390',
    title: 'Usura Rulli Banco Simulazione Stradale',
    client: 'Audi AG (Ingolstadt)',
    product: 'Banco Rulli Simulazione Manto Stradale BR-500',
    image: DAMAGE_IMG.bancoCicli,
    date: '2026-04-10',
    component: 'Coppia rulli dinamometrici anteriori',
    damageType: 'Usura normale superficie rugosa',
    boundingBoxes: [
      { x: 28, y: 36, w: 26, h: 20, label: 'Superficie usurata', severity: 'basso' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: roller-surface-analyzer-v2.1',
      '> Analisi profilo superficie vs tolleranza Ra: COMPLETATA',
      '> Rugosità rilevata: Ra 3.8μm (specifica: Ra ≤ 4.0μm)',
      '> Ore funzionamento: 12.400h (vita attesa: 10.000h)',
      '> Rilevamento: usura compatibile con fine vita nominale.',
      '> Nessun segno di uso improprio o sovraccarico.',
      '> ESITO CAUSA: Fine vita utile componente.',
      '> Confidenza analisi: 96.1%',
    ],
    verdict: 'APPROVATA',
    verdictReason: 'Usura normale a fine vita utile — 12.400h su vita attesa 10.000h, nessuna negligenza rilevata',
    confidence: 96.1,
  },
  {
    id: '#387',
    title: 'Rottura Montante Telaio Portante',
    client: 'NKE Automation (Alpignano)',
    product: 'Maschera Bloccaggio Lamierati MBL-600',
    image: DAMAGE_IMG.telaioSald,
    date: '2026-04-05',
    component: 'Montante verticale telaio in acciaio S355',
    damageType: 'Deformazione da urto con mezzo di movimentazione',
    boundingBoxes: [
      { x: 12, y: 25, w: 36, h: 30, label: 'Montante deformato', severity: 'critico' },
      { x: 56, y: 16, w: 18, h: 16, label: 'Impronta impatto', severity: 'medio' },
    ],
    aiLog: [
      '> Inizializzazione scansione LMM (Costo: 0,002 $)...',
      '> Caricamento modello: structural-deformation-v3.0',
      '> Analisi deformazione vs carichi di esercizio: COMPLETATA',
      '> Deformazione rilevata: 14mm su asse Y (tolleranza: 0.5mm)',
      '> Pattern: deformazione puntiforme incompatibile con',
      '>   stress termico o fatica strutturale da saldatura.',
      '> Vernice asportata: impronta 180×40mm su montante.',
      '> ESITO CAUSA: Urto accidentale con carrello elevatore.',
      '> Confidenza analisi: 97.8%',
    ],
    verdict: 'RIFIUTATA',
    verdictReason: 'Urto carrello elevatore — deformazione 14mm su montante incompatibile con carichi operativi normali',
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
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [shipData, setShipData] = useState({
    sparePart: '',
    quantity: 1,
    address: '',
    courier: 'DHL Express',
    deliveryDate: '',
    priority: 'standard',
    notes: '',
  });
  const [shipConfirmation, setShipConfirmation] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  const { detectDamageBoundingBoxes, hasApiKey, error: googleAIError } = useGoogleAI();

  // Scansione AI reale tramite Gemini Vision
  const runAI = async () => {
    setAiRunning(true);
    setAiComplete(false);
    setAiError(null);
    setAiResult(null);
    setAiLineIndex(0);

    if (!hasApiKey) {
      setAiError('VITE_GOOGLE_AI_API_KEY mancante in .env.local');
      setAiRunning(false);
      return;
    }

    try {
      const result = await detectDamageBoundingBoxes(selectedTicket.image, {
        product: selectedTicket.product,
        component: selectedTicket.component,
        damageType: selectedTicket.damageType,
      });

      if (!result) {
        setAiError(googleAIError || 'Errore di rete o API non disponibile');
        setAiRunning(false);
        return;
      }
      if (result.parseError) {
        setAiError('Risposta AI non interpretabile');
        setAiRunning(false);
        return;
      }

      setAiResult(result);
    } catch (err) {
      setAiError(err.message || 'Errore durante la scansione AI');
      setAiRunning(false);
    }
  };

  // Animazione del log AI (linea per linea)
  useEffect(() => {
    if (!aiRunning || !aiResult) return;
    const log = aiResult.aiLog || [];
    if (aiLineIndex < log.length) {
      const timer = setTimeout(() => setAiLineIndex(aiLineIndex + 1), 350);
      return () => clearTimeout(timer);
    } else {
      setAiRunning(false);
      setAiComplete(true);
    }
  }, [aiRunning, aiLineIndex, aiResult]);

  const handleSelectTicket = (t) => {
    setSelectedTicket(t);
    setAiComplete(false);
    setAiRunning(false);
    setAiLineIndex(0);
    setGenerated(false);
    setSentRefusal(false);
    setPlannedShip(false);
    setAiResult(null);
    setAiError(null);
  };

  // Generazione PDF reale via jsPDF — scaricabile e stampabile
  const handleGenerate = async () => {
    if (generating || generated || !aiResult) return;
    setGenerating(true);

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      let y = 20;

      // Header
      doc.setFillColor(10, 14, 23);
      doc.rect(0, 0, pageW, 35, 'F');
      doc.setTextColor(0, 212, 170);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('NEXUS · REPORT LEGALE GARANZIA', 14, 16);
      doc.setTextColor(150, 160, 175);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Documento generato il ${new Date().toLocaleString('it-IT')} · Powered by Google Gemini Vision AI`, 14, 23);
      doc.text(`Ticket ${selectedTicket.id} · ${selectedTicket.client}`, 14, 29);

      y = 45;

      // Sezione 1: Dati ticket
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DATI DEL RECLAMO', 14, y); y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const rows = [
        ['Ticket', selectedTicket.id],
        ['Cliente', selectedTicket.client],
        ['Prodotto', selectedTicket.product],
        ['Componente', selectedTicket.component],
        ['Tipo danno dichiarato', selectedTicket.damageType],
        ['Data apertura', selectedTicket.date],
        ['Titolo reclamo', selectedTicket.title],
      ];
      rows.forEach(([k, v]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${k}:`, 14, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(v), 60, y);
        y += 6;
      });

      y += 5;

      // Sezione 2: Verdetto AI
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('2. ESITO ANALISI AI', 14, y); y += 7;
      const verdictRGB = aiResult.verdict === 'RIFIUTATA' ? [220, 50, 50] : [40, 170, 80];
      doc.setFillColor(...verdictRGB);
      doc.roundedRect(14, y - 4, 60, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(`GARANZIA ${aiResult.verdict || 'IN ESAME'}`, 17, y + 2);
      doc.setTextColor(20, 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Confidenza: ${aiResult.confidence || 0}%`, 80, y + 2);
      y += 12;

      doc.setFont('helvetica', 'bold');
      doc.text('Motivazione:', 14, y); y += 5;
      doc.setFont('helvetica', 'normal');
      const reasonLines = doc.splitTextToSize(aiResult.verdictReason || 'Non disponibile', pageW - 28);
      doc.text(reasonLines, 14, y); y += reasonLines.length * 5 + 3;

      if (aiResult.damageType) {
        doc.setFont('helvetica', 'bold');
        doc.text('Causa identificata:', 14, y);
        doc.setFont('helvetica', 'normal');
        doc.text(aiResult.damageType, 60, y);
        y += 7;
      }

      // Sezione 3: Dettagli tecnici
      if (aiResult.technicalDetails && aiResult.technicalDetails.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('3. DETTAGLI TECNICI', 14, y); y += 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        aiResult.technicalDetails.forEach((d) => {
          if (y > pageH - 20) { doc.addPage(); y = 20; }
          const lines = doc.splitTextToSize(`• ${d}`, pageW - 28);
          doc.text(lines, 14, y);
          y += lines.length * 5 + 1;
        });
        y += 3;
      }

      // Sezione 4: Bounding box (aree danno)
      if (aiResult.boundingBoxes && aiResult.boundingBoxes.length > 0) {
        if (y > pageH - 40) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('4. AREE DANNO RILEVATE', 14, y); y += 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        aiResult.boundingBoxes.forEach((bb, i) => {
          if (y > pageH - 15) { doc.addPage(); y = 20; }
          doc.text(`${i + 1}. ${bb.label} — Severità: ${bb.severity?.toUpperCase() || 'N/D'} — Pos: (${bb.x},${bb.y}) ${bb.w}×${bb.h}%`, 14, y);
          y += 6;
        });
        y += 3;
      }

      // Sezione 5: Log Console AI
      if (aiResult.aiLog && aiResult.aiLog.length > 0) {
        if (y > pageH - 40) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('5. CONSOLE REFERTO AI (LOG)', 14, y); y += 7;
        doc.setFontSize(8);
        doc.setFont('courier', 'normal');
        doc.setFillColor(15, 18, 25);
        const logH = aiResult.aiLog.length * 4.2 + 6;
        if (y + logH > pageH - 10) { doc.addPage(); y = 20; }
        doc.rect(14, y - 2, pageW - 28, logH, 'F');
        doc.setTextColor(180, 230, 255);
        aiResult.aiLog.forEach((line) => {
          doc.text(line.slice(0, 95), 17, y + 2);
          y += 4.2;
        });
        y += 6;
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text(`Pagina ${i} di ${pageCount} · NEXUS Industrial Hub · Documento legale ai sensi del DPR 224/88`, 14, pageH - 8);
      }

      const fileName = `Report_Legale_${selectedTicket.id.replace('#', '')}_${selectedTicket.client.split(' ')[0]}_${Date.now()}.pdf`;
      doc.save(fileName);

      setGenerated(true);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Errore generazione PDF: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendRefusal = () => {
    if (sendingRefusal || sentRefusal) return;
    setSendingRefusal(true);
    setTimeout(() => { setSendingRefusal(false); setSentRefusal(true); }, 1500);
  };

  // Apri modal di pianificazione spedizione
  const handlePlanShip = () => {
    if (plannedShip) return;
    // Pre-popola dati spedizione partendo dal ticket
    const today = new Date();
    const eta = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    setShipData({
      sparePart: `Ricambio ${selectedTicket.component}`,
      quantity: 1,
      address: selectedTicket.client,
      courier: 'DHL Express',
      deliveryDate: eta.toISOString().split('T')[0],
      priority: 'standard',
      notes: `Sostituzione a seguito di ${selectedTicket.title.toLowerCase()} — riferimento ticket ${selectedTicket.id}`,
    });
    setShipModalOpen(true);
  };

  const handleConfirmShipment = () => {
    setPlanningShip(true);
    setTimeout(() => {
      const trackingNumber = `DHL${Date.now().toString().slice(-10)}IT`;
      const orderId = `SPED-${selectedTicket.id.replace('#', '')}-${Date.now().toString().slice(-6)}`;
      const priorityCost = shipData.priority === 'express' ? 240 : shipData.priority === 'overnight' ? 480 : 95;
      setShipConfirmation({
        trackingNumber,
        orderId,
        cost: priorityCost,
        eta: shipData.deliveryDate,
        courier: shipData.courier,
        sparePart: shipData.sparePart,
        quantity: shipData.quantity,
        address: shipData.address,
      });
      setPlanningShip(false);
      setPlannedShip(true);
    }, 1800);
  };

  const handleCloseShipModal = () => {
    setShipModalOpen(false);
  };

  // Verdetto e bounding box vengono dall'AI (Gemini), non dai dati statici
  const verdict = aiResult?.verdict;
  const verdictColor = verdict === 'RIFIUTATA' ? '#ef4444' : verdict === 'APPROVATA' ? '#22c55e' : '#94a3b8';
  const verdictBg = verdict === 'RIFIUTATA' ? 'rgba(239,68,68,0.08)' : verdict === 'APPROVATA' ? 'rgba(34,197,94,0.08)' : 'transparent';
  const aiBoxes = aiResult?.boundingBoxes || [];
  const aiLogLines = aiResult?.aiLog || [];

  return (
    <div className="p-4">
      <AlertBar message="ALERT: 2 reclami garanzia in attesa di analisi AI — Coda di elaborazione attiva" />

      <div className="flex items-center gap-2 mb-3">
        <Shield size={20} className="text-[#00d4aa]" />
        <div>
          <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>RISK MITIGATION & CLAIMS</h2>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Modalità Post-Vendita · Analisi AI danni · Gestione garanzie</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
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

                {/* Bounding boxes generati da Gemini AI in tempo reale */}
                {(aiComplete || aiRunning) && aiBoxes.map((bb, i) => {
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

                {/* Scan line animation durante chiamata API */}
                {aiRunning && aiLogLines.length > 0 && (
                  <div className="absolute left-0 right-0 h-0.5" style={{
                    background: 'linear-gradient(90deg, transparent, #4285f4, transparent)',
                    top: `${(aiLineIndex / Math.max(aiLogLines.length, 1)) * 100}%`,
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
                <span className="text-[0.55rem] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(66,133,244,0.15)', color: '#4285f4' }}>
                  GEMINI VISION
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <button onClick={runAI} disabled={aiRunning || !hasApiKey}
                  className="text-[0.6rem] px-3 py-1.5 rounded-lg font-bold transition-all"
                  style={{
                    background: aiRunning ? 'rgba(168,85,247,0.15)' : aiComplete ? 'rgba(34,197,94,0.1)' : 'linear-gradient(135deg, #4285f4, #1a73e8)',
                    border: `1px solid ${aiRunning ? 'rgba(168,85,247,0.3)' : 'rgba(66,133,244,0.4)'}`,
                    color: aiRunning ? '#a855f7' : aiComplete ? '#22c55e' : '#fff',
                    opacity: hasApiKey ? 1 : 0.5,
                  }}
                  title={hasApiKey ? 'Avvia analisi AI con Google Gemini' : 'API Key mancante in .env.local'}>
                  {aiRunning ? <><Loader2 size={10} className="inline animate-spin mr-1" />Analisi Gemini in corso...</> : aiComplete ? '▶ Riesegui Scansione AI' : <><Brain size={10} className="inline mr-1" />Avvia Scansione AI</>}
                </button>
              </div>
              {aiError && (
                <div className="absolute bottom-12 left-2 right-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <span className="text-[0.6rem] font-mono" style={{ color: '#ef4444' }}>⚠ {aiError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Verdict from Gemini AI */}
          {aiComplete && aiResult ? (
            <div className="mt-4 rounded-xl p-4" style={{ background: verdictBg, border: `2px solid ${verdictColor}40` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${verdictColor}20`, border: `3px solid ${verdictColor}` }}>
                    {verdict === 'RIFIUTATA' ? <XCircle size={24} style={{ color: verdictColor }} /> : <CheckCircle size={24} style={{ color: verdictColor }} />}
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: verdictColor }}>
                      GARANZIA {verdict}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{aiResult.verdictReason}</div>
                    {aiResult.technicalDetails && aiResult.technicalDetails.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {aiResult.technicalDetails.map((d, i) => (
                          <li key={i} className="text-[0.65rem] flex items-start gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                            <span style={{ color: verdictColor }}>▸</span> {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold" style={{ color: verdictColor }}>{aiResult.confidence}%</div>
                  <div className="text-[0.55rem]" style={{ color: 'var(--color-text-secondary)' }}>Confidenza Gemini</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl p-4 flex items-center justify-center gap-3" style={{ background: 'var(--color-bg-card)', border: '2px dashed var(--color-border)', minHeight: '80px' }}>
              {aiRunning ? (
                <><Loader2 size={20} className="animate-spin" style={{ color: '#4285f4' }} /><span className="text-sm font-semibold" style={{ color: '#4285f4' }}>Gemini sta analizzando l'immagine in tempo reale...</span></>
              ) : (
                <><Brain size={20} style={{ color: 'var(--color-text-secondary)' }} /><span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Premi "Avvia Scansione AI" — Gemini Vision analizzerà l'immagine</span></>
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
              {!aiRunning && !aiComplete && (
                <div style={{ color: '#4a5568' }}>&gt; In attesa di scansione Gemini Vision...<br/>&gt; Premi "Avvia Scansione AI"<br/>&gt; _</div>
              )}
              {(aiRunning || aiComplete) && aiLogLines.slice(0, aiComplete ? aiLogLines.length : aiLineIndex).map((line, i) => {
                let lineColor = '#94a3b8';
                if (line.includes('ESITO')) lineColor = verdict === 'RIFIUTATA' ? '#ef4444' : '#22c55e';
                else if (line.includes('Confidenza') || line.includes('Rilevamento') || line.includes('Rilevate')) lineColor = '#f59e0b';
                else if (line.includes('Inizializzazione') || line.includes('Analisi')) lineColor = '#4285f4';
                return <div key={i} style={{ color: lineColor }}>{line}</div>;
              })}
              {aiRunning && <span className="inline-block w-2 h-3 bg-blue-400 animate-pulse" />}
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

          {/* Token usage info from Gemini */}
          {aiResult?.usage && (
            <div className="rounded-xl p-3 text-[0.6rem] flex justify-between font-mono" style={{ background: 'rgba(66,133,244,0.05)', border: '1px solid rgba(66,133,244,0.2)', color: 'var(--color-text-secondary)' }}>
              <span>Gemini · {aiResult.usage.totalTokenCount || 0} token</span>
              <span>${((aiResult.usage.totalTokenCount || 0) * 0.00001).toFixed(5)} per scansione</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            <button onClick={handleGenerate} disabled={generating || generated || !aiComplete}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={generated
                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                : { background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
              {generating ? <><Loader2 size={14} className="animate-spin" /> Generazione in corso...</> : generated ? <><CheckCircle size={14} /> Report Legale PDF Generato</> : <><FileText size={14} /> Genera Report Legale (PDF)</>}
            </button>

            {aiComplete && verdict === 'RIFIUTATA' && (
              <button onClick={handleSendRefusal} disabled={sendingRefusal || sentRefusal}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={sentRefusal
                  ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                  : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {sendingRefusal ? <><Loader2 size={14} className="animate-spin" /> Invio rifiuto...</> : sentRefusal ? <><CheckCircle size={14} /> Rifiuto Inviato al Cliente</> : <><Send size={14} /> Invia Rifiuto al Cliente</>}
              </button>
            )}

            {aiComplete && verdict === 'RIFIUTATA' && <button onClick={handlePlanShip} disabled={planningShip || plannedShip}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={plannedShip
                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                : { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
              {planningShip ? <><Loader2 size={14} className="animate-spin" /> Pianificazione...</> : plannedShip ? <><CheckCircle size={14} /> Spedizione Pianificata</> : <><Truck size={14} /> Pianifica Spedizione Ricambio a Pagamento</>}
            </button>}

            {/* Riepilogo spedizione confermata */}
            {plannedShip && shipConfirmation && (
              <div className="rounded-xl p-3 mt-2" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={14} className="text-green-400" />
                  <span className="text-xs font-bold text-green-400">SPEDIZIONE CONFERMATA</span>
                </div>
                <div className="space-y-1 text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex justify-between"><span>Ordine</span><span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>{shipConfirmation.orderId}</span></div>
                  <div className="flex justify-between"><span>Tracking</span><span className="font-mono font-bold" style={{ color: '#60a5fa' }}>{shipConfirmation.trackingNumber}</span></div>
                  <div className="flex justify-between"><span>Corriere</span><span style={{ color: 'var(--color-text-primary)' }}>{shipConfirmation.courier}</span></div>
                  <div className="flex justify-between"><span>ETA</span><span style={{ color: 'var(--color-text-primary)' }}>{shipConfirmation.eta}</span></div>
                  <div className="flex justify-between pt-1 mt-1 border-t" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
                    <span>Costo totale</span><span className="font-bold" style={{ color: '#22c55e' }}>€{shipConfirmation.cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Pianificazione Spedizione */}
      {shipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,8,16,0.85)', backdropFilter: 'blur(8px)' }} onClick={handleCloseShipModal}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)', background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(59,130,246,0.05))' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)' }}>
                  <Truck size={18} style={{ color: '#0a0e17' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>PIANIFICA SPEDIZIONE RICAMBIO</h3>
                  <p className="text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>Ticket {selectedTicket.id} · {selectedTicket.client}</p>
                </div>
              </div>
              <button onClick={handleCloseShipModal} className="p-2 rounded-lg transition hover:bg-white/5">
                <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>RICAMBIO</label>
                  <input type="text" value={shipData.sparePart} onChange={e => setShipData({ ...shipData, sparePart: e.target.value })}
                    className="w-full p-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>QUANTITÀ</label>
                  <input type="number" min="1" value={shipData.quantity} onChange={e => setShipData({ ...shipData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label className="text-[0.65rem] font-bold flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <MapPin size={10} /> INDIRIZZO DESTINAZIONE
                </label>
                <input type="text" value={shipData.address} onChange={e => setShipData({ ...shipData, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <Package size={10} /> CORRIERE
                  </label>
                  <select value={shipData.courier} onChange={e => setShipData({ ...shipData, courier: e.target.value })}
                    className="w-full p-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }}>
                    <option>DHL Express</option>
                    <option>UPS Industrial</option>
                    <option>FedEx Priority</option>
                    <option>BRT Logistica</option>
                    <option>SDA Industriale</option>
                  </select>
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar size={10} /> DATA CONSEGNA
                  </label>
                  <input type="date" value={shipData.deliveryDate} onChange={e => setShipData({ ...shipData, deliveryDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>PRIORITÀ</label>
                  <select value={shipData.priority} onChange={e => setShipData({ ...shipData, priority: e.target.value })}
                    className="w-full p-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }}>
                    <option value="standard">Standard (€95)</option>
                    <option value="express">Express 48h (€240)</option>
                    <option value="overnight">Overnight (€480)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[0.65rem] font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>NOTE</label>
                <textarea rows="2" value={shipData.notes} onChange={e => setShipData({ ...shipData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-lg text-sm resize-none"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }} />
              </div>

              <div className="rounded-lg p-3" style={{ background: 'rgba(66,133,244,0.06)', border: '1px solid rgba(66,133,244,0.2)' }}>
                <p className="text-[0.65rem] font-bold mb-1" style={{ color: '#60a5fa' }}>RIEPILOGO COSTO</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{shipData.quantity}x {shipData.sparePart || 'ricambio'} via {shipData.courier} ({shipData.priority})</span>
                  <span className="text-xl font-bold" style={{ color: '#00d4aa' }}>
                    €{(shipData.priority === 'express' ? 240 : shipData.priority === 'overnight' ? 480 : 95).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
              <button onClick={handleCloseShipModal}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition"
                style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                Annulla
              </button>
              <button onClick={() => { handleConfirmShipment(); handleCloseShipModal(); }}
                disabled={planningShip || !shipData.sparePart || !shipData.address || !shipData.deliveryDate}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
                {planningShip ? <><Loader2 size={14} className="animate-spin" /> Pianificazione...</> : <><Truck size={14} /> Conferma Spedizione</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}