import { useState, useEffect } from 'react';
import { Eye, Clock, ChevronRight, ChevronLeft, Target, CheckCircle, Play, Globe, Phone, Box, Loader2 } from 'lucide-react';
import AlertBar from '../components/AlertBar';

const plants = [
  { id: 'BMW-SPART', name: 'Linea assemblaggio sospensioni PHEV — BMW Spartanburg', country: 'USA', lang: 'EN', asProduct: 'Linea Assemblaggio Sospensioni' },
  { id: 'STELL-BETIM', name: 'Maschera bloccaggio e saldatura lamierati — Stellantis Betim', country: 'Brasile', lang: 'PT', asProduct: 'Maschera Saldatura Lamierati' },
  { id: 'NKE-ALPI', name: 'Banco calibrazione sistemi ADAS — NKE Automation Alpignano', country: 'Italia', lang: 'IT', asProduct: 'Banco Calibrazione ADAS' },
  { id: 'FCA-KRAGU', name: 'Banco assemblaggio e avvitatura — FCA Srbija Kragujevac', country: 'Serbia', lang: 'EN', asProduct: 'Banco Assemblaggio Avvitatura' },
  { id: 'BMW-DING', name: 'Manipolatore carico e movimentazione — BMW Dingolfing', country: 'Germania', lang: 'EN', asProduct: 'Manipolatore Carico' },
];

const plantImages = {
  'BMW-SPART': ['/images/as-products/sospensioni-1.jpg', '/images/as-products/sospensioni-2.jpg', '/images/as-products/sospensioni-3.jpg', '/images/as-products/sospensioni-4.jpg', '/images/as-products/sospensioni-5.jpg'],
  'STELL-BETIM': ['/images/as-products/maschere-1.jpg', '/images/as-products/maschere-2.jpg', '/images/as-products/maschere-3.png', '/images/as-products/maschere-5.jpg', '/images/as-products/maschere-7.jpg'],
  'NKE-ALPI': ['/images/as-products/adas-1-full.jpg', '/images/as-products/adas-2-full.jpg', '/images/as-products/adas-5.jpg', '/images/as-products/adas-6.jpg'],
  'FCA-KRAGU': ['/images/as-products/avvitatura-1.jpg', '/images/as-products/avvitatura-2.jpg', '/images/as-products/avvitatura-3.jpg', '/images/as-products/avvitatura-4.jpg', '/images/as-products/avvitatura-5.jpg'],
  'BMW-DING': ['/images/as-products/manipolatore-1-full.jpg', '/images/as-products/manipolatore-2-full.jpg', '/images/as-products/manipolatore-4.jpg', '/images/as-products/manipolatore-6.jpg'],
};

const plantProcedures = {
  'BMW-SPART': {
    videoId: 'oSFZvBm4HFA',
    component: 'Linea Assemblaggio Sospensioni PHEV',
    cadOverlay: 'Linea Assemblaggio Sospensioni PHEV — Modello CAD v14.2',
    steps: [
      { step: 1, it: 'Posizionare molla elicoidale sulla pressa (18.5 kN)', en: 'Position coil spring on the press (18.5 kN)', pt: 'Posicione a mola helicoidal na prensa (18.5 kN)', time: '2 min' },
      { step: 2, it: 'Inserire ammortizzatore nel corpo centrale e allineare', en: 'Insert shock absorber into central body and align', pt: 'Insira o amortecedor no corpo central e alinhe', time: '3 min' },
      { step: 3, it: 'Avvitare supporto superiore a 120 Nm (±2%)', en: 'Tighten upper mount to 120 Nm (±2%)', pt: 'Aperte o suporte superior a 120 Nm (±2%)', time: '3 min' },
      { step: 4, it: 'Verificare allineamento laser braccio (offset max 0.1mm)', en: 'Verify laser arm alignment (max offset 0.1mm)', pt: 'Verifique o alinhamento laser do braço (offset máx 0.1mm)', time: '4 min' },
      { step: 5, it: 'Collegare sensore corsa ammortizzatore (range 0-320mm)', en: 'Connect shock absorber stroke sensor (range 0-320mm)', pt: 'Conecte o sensor de curso do amortecedor (faixa 0-320mm)', time: '2 min' },
      { step: 6, it: 'Riempire circuito olio assestamento (max 65°C)', en: 'Fill settling oil circuit (max 65°C)', pt: 'Preencha o circuito de óleo de assentamento (máx 65°C)', time: '3 min' },
      { step: 7, it: 'Test funzionale completo con PLC Siemens S7-1500', en: 'Complete functional test with Siemens S7-1500 PLC', pt: 'Teste funcional completo com CLP Siemens S7-1500', time: '4 min' },
    ],
  },
  'STELL-BETIM': {
    videoId: 'vsSfa-enwgw',
    component: 'Maschera Bloccaggio Lamierati M-200',
    cadOverlay: 'Maschera Bloccaggio e Saldatura Lamierati — Modello CAD v2.8',
    steps: [
      { step: 1, it: 'Posizionare il lamierato sulla maschera di bloccaggio', en: 'Position the sheet metal on the clamping jig', pt: 'Posicione a chapa na máscara de fixação', time: '2 min' },
      { step: 2, it: 'Attivare i 12 clamp pneumatici in sequenza (6 bar)', en: 'Activate the 12 pneumatic clamps in sequence (6 bar)', pt: 'Ative os 12 grampos pneumáticos em sequência (6 bar)', time: '3 min' },
      { step: 3, it: 'Verificare allineamento staffaggi con comparatore centesimale', en: 'Verify jig alignment with dial indicator (0.01mm)', pt: 'Verifique o alinhamento dos gabaritos com comparador centesimal', time: '5 min' },
      { step: 4, it: 'Inserire punte elettrodi Cu-Cr e avviare trasformatore MFDC', en: 'Insert Cu-Cr electrode tips and start MFDC transformer', pt: 'Insira as pontas de eletrodo Cu-Cr e inicie o transformador MFDC', time: '4 min' },
      { step: 5, it: 'Eseguire ciclo di saldatura a punti (12.5 kA) secondo ISO 14373', en: 'Execute spot welding cycle (12.5 kA) per ISO 14373', pt: 'Execute ciclo de solda a ponto (12.5 kA) conforme ISO 14373', time: '8 min' },
      { step: 6, it: 'Controllo visivo e prova a strappo su campione', en: 'Visual inspection and peel test on sample', pt: 'Inspeção visual e teste de arrancamento em amostra', time: '4 min' },
    ],
  },
  'NKE-ALPI': {
    videoId: 'h42JMHcLdIk',
    component: 'Banco Calibrazione ADAS BC-300',
    cadOverlay: 'Banco Calibrazione Sistemi ADAS — Modello CAD v3.1',
    steps: [
      { step: 1, it: 'Posizionare veicolo su piattaforma calibrazione allineata', en: 'Position vehicle on aligned calibration platform', pt: 'Posicione o veículo na plataforma de calibração alinhada', time: '5 min' },
      { step: 2, it: 'Posizionare target riflettente motorizzato a 4.0m ± 5mm', en: 'Position motorized reflective target at 4.0m ± 5mm', pt: 'Posicione o alvo refletivo motorizado a 4.0m ± 5mm', time: '3 min' },
      { step: 3, it: 'Avviare calibrazione telecamera frontale ADAS via ECU', en: 'Start front ADAS camera calibration via ECU', pt: 'Inicie calibração da câmera frontal ADAS via ECU', time: '8 min' },
      { step: 4, it: 'Verificare allineamento radar LRR 77 GHz (tolleranza 0.2°)', en: 'Verify LRR 77 GHz radar alignment (tolerance 0.2°)', pt: 'Verifique o alinhamento do radar LRR 77 GHz (tolerância 0.2°)', time: '6 min' },
      { step: 5, it: 'Eseguire test su strada virtuale con pannello LED pattern', en: 'Execute virtual road test with LED pattern panel', pt: 'Execute teste em estrada virtual com painel de padrão LED', time: '10 min' },
    ],
  },
  'FCA-KRAGU': {
    videoId: 'wjfg-hrPmsM',
    component: 'Banco Assemblaggio Avvitatura BAV-100',
    cadOverlay: 'Banco Assemblaggio e Avvitatura — Modello CAD v1.9',
    steps: [
      { step: 1, it: 'Posizionare componente sul banco con fixture dedicata', en: 'Position component on bench with dedicated fixture', pt: 'Posicione o componente no banco com fixação dedicada', time: '2 min' },
      { step: 2, it: 'Selezionare programma avvitatura su HMI (coppia 5-25 Nm)', en: 'Select screwing program on HMI (torque 5-25 Nm)', pt: 'Selecione o programa de aparafusamento no HMI (torque 5-25 Nm)', time: '1 min' },
      { step: 3, it: 'Avvitare con braccio bilanciato pneumatico Desoutter CVI3', en: 'Screw with Desoutter CVI3 pneumatic balanced arm', pt: 'Aparafuse com braço balanceado pneumático Desoutter CVI3', time: '4 min' },
      { step: 4, it: 'Verificare coppia tramite sensore reattivo e sistema Poka-Yoke', en: 'Verify torque via reactive sensor and Poka-Yoke system', pt: 'Verifique o torque via sensor reativo e sistema Poka-Yoke', time: '3 min' },
      { step: 5, it: 'Scansionare barcode Cognex e validare tracciabilità', en: 'Scan Cognex barcode and validate traceability', pt: 'Escaneie código de barras Cognex e valide rastreabilidade', time: '1 min' },
    ],
  },
  'BMW-DING': {
    videoId: 'oSFZvBm4HFA',
    component: 'Manipolatore Carico MAN-500',
    cadOverlay: 'Manipolatore Carico e Movimentazione — Modello CAD v5.0',
    steps: [
      { step: 1, it: 'Verificare pressione circuito pneumatico bilanciamento (5.5 bar)', en: 'Verify pneumatic balance circuit pressure (5.5 bar)', pt: 'Verifique a pressão do circuito pneumático de balanceamento (5.5 bar)', time: '2 min' },
      { step: 2, it: 'Posizionare pinza ventosa vuoto sul componente (-0.85 bar)', en: 'Position vacuum suction gripper on component (-0.85 bar)', pt: 'Posicione a garra de ventosa a vácuo no componente (-0.85 bar)', time: '3 min' },
      { step: 3, it: 'Sollevare carico con motore 5.5 kW (max 800 kg)', en: 'Lift load with 5.5 kW motor (max 800 kg)', pt: 'Levante a carga com motor de 5.5 kW (máx 800 kg)', time: '2 min' },
      { step: 4, it: 'Ruotare torretta e traslare alla posizione target', en: 'Rotate turret and translate to target position', pt: 'Gire a torre e translade para a posição alvo', time: '4 min' },
      { step: 5, it: 'Rilasciare componente e verificare finecorsa sicurezza Cat. 4', en: 'Release component and verify Cat. 4 safety limit switch', pt: 'Libere o componente e verifique a chave de segurança Cat. 4', time: '2 min' },
    ],
  },
};

const stepHighlights = {
  'BMW-SPART': [
    { label: 'MOLLA', cx: 130, cy: 100, rx: 35, ry: 65, color: '#ef4444' },
    { label: 'AMMORTIZZATORE', cx: 130, cy: 105, rx: 20, ry: 55, color: '#a855f7' },
    { label: 'SUPPORTO SUP.', cx: 130, cy: 30, rx: 18, ry: 18, color: '#f59e0b' },
    { label: 'LASER BRACCIO', cx: 80, cy: 200, rx: 40, ry: 15, color: '#22c55e' },
    { label: 'SENSORE CORSA', cx: 130, cy: 185, rx: 15, ry: 20, color: '#06b6d4' },
    { label: 'CIRCUITO OLIO', cx: 190, cy: 195, rx: 30, ry: 12, color: '#f97316' },
    { label: 'PLC S7-1500', cx: 45, cy: 45, rx: 30, ry: 18, color: '#60a5fa' },
  ],
  'STELL-BETIM': [
    { label: 'LAMIERATO', cx: 130, cy: 130, rx: 55, ry: 60, color: '#f59e0b' },
    { label: 'CLAMP PNEUM.', cx: 130, cy: 85, rx: 70, ry: 30, color: '#00d4aa' },
    { label: 'STAFFAGGI', cx: 80, cy: 160, rx: 25, ry: 25, color: '#a855f7' },
    { label: 'ELETTRODI Cu-Cr', cx: 130, cy: 150, rx: 15, ry: 15, color: '#ef4444' },
    { label: 'SALDATURA', cx: 130, cy: 130, rx: 25, ry: 25, color: '#f97316' },
    { label: 'CONTROLLO', cx: 130, cy: 130, rx: 70, ry: 70, color: '#22c55e' },
  ],
  'NKE-ALPI': [
    { label: 'PIATTAFORMA', cx: 130, cy: 200, rx: 80, ry: 18, color: '#00d4aa' },
    { label: 'TARGET 4.0m', cx: 130, cy: 75, rx: 60, ry: 40, color: '#ef4444' },
    { label: 'TELECAMERA', cx: 130, cy: 165, rx: 18, ry: 18, color: '#f59e0b' },
    { label: 'RADAR 77GHz', cx: 47, cy: 160, rx: 22, ry: 12, color: '#a855f7' },
    { label: 'TEST LED', cx: 130, cy: 75, rx: 60, ry: 40, color: '#22c55e' },
  ],
  'FCA-KRAGU': [
    { label: 'FIXTURE', cx: 130, cy: 115, rx: 35, ry: 18, color: '#a855f7' },
    { label: 'HMI', cx: 206, cy: 75, rx: 25, ry: 18, color: '#60a5fa' },
    { label: 'AVVITATORE', cx: 151, cy: 60, rx: 18, ry: 22, color: '#00d4aa' },
    { label: 'POKA-YOKE', cx: 130, cy: 115, rx: 35, ry: 18, color: '#f59e0b' },
    { label: 'BARCODE', cx: 75, cy: 40, rx: 20, ry: 15, color: '#22c55e' },
  ],
  'BMW-DING': [
    { label: 'PNEUMATICO', cx: 130, cy: 230, rx: 45, ry: 15, color: '#00d4aa' },
    { label: 'PINZA VENTOSA', cx: 208, cy: 147, rx: 22, ry: 12, color: '#a855f7' },
    { label: 'MOTORE 5.5kW', cx: 130, cy: 55, rx: 25, ry: 12, color: '#f59e0b' },
    { label: 'TORRETTA', cx: 180, cy: 70, rx: 50, ry: 25, color: '#ef4444' },
    { label: 'FINECORSA', cx: 130, cy: 190, rx: 15, ry: 15, color: '#22c55e' },
  ],
};

function ARModel({ plantId, currentStep }) {
  const highlights = stepHighlights[plantId] || [];
  const active = highlights[currentStep] || highlights[0];

  return (
    <>
      <defs>
        <linearGradient id="arHoloGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00d4aa" stopOpacity="0.15" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" /></linearGradient>
        <filter id="arGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="activeGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {plantId === 'BMW-SPART' && <>
        <ellipse cx="130" cy="220" rx="85" ry="22" fill="rgba(0,212,170,0.03)" stroke="#00d4aa" strokeWidth="0.5" opacity="0.2" />
        {Array.from({ length: 7 }, (_, i) => <ellipse key={`sp${i}`} cx={130} cy={55 + i * 22} rx={32 - i * 0.8} ry={9} fill="none" stroke="#00d4aa" strokeWidth={1.2} opacity={0.25} />)}
        <rect x="112" y="40" width="36" height="130" rx="5" fill="rgba(59,130,246,0.03)" stroke="#3b82f6" strokeWidth="0.8" opacity="0.25" />
        <rect x="120" y="25" width="20" height="28" rx="3" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="0.8" opacity="0.25" />
        <line x1="130" y1="8" x2="130" y2="40" stroke="#f59e0b" strokeWidth="1.5" opacity="0.25" />
        <circle cx="130" cy="8" r="7" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.25" />
        <circle cx="130" cy="210" r="9" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.25" />
        <line x1="55" y1="200" x2="130" y2="210" stroke="#00d4aa" strokeWidth="1" opacity="0.2" />
        <line x1="205" y1="200" x2="130" y2="210" stroke="#00d4aa" strokeWidth="1" opacity="0.2" />
        <rect x="40" y="192" width="28" height="15" rx="3" fill="none" stroke="#00d4aa" strokeWidth="0.6" opacity="0.2" />
        <rect x="192" y="192" width="28" height="15" rx="3" fill="none" stroke="#00d4aa" strokeWidth="0.6" opacity="0.2" />
      </>}

      {plantId === 'STELL-BETIM' && <>
        <polygon points="130,25 230,70 230,185 130,230 30,185 30,70" fill="url(#arHoloGrad)" stroke="#00d4aa" strokeWidth="0.6" opacity="0.2" />
        <polygon points="130,60 190,90 190,170 130,200 70,170 70,90" fill="rgba(245,158,11,0.03)" stroke="#f59e0b" strokeWidth="0.8" opacity="0.25" />
        {[[82,82],[115,62],[145,62],[178,82],[188,120],[178,160],[145,180],[115,180],[72,160],[72,120],[105,92],[155,92]].map(([x,y], i) => (
          <g key={`cl${i}`}><circle cx={x} cy={y} r="3.5" fill="rgba(0,212,170,0.06)" stroke="#00d4aa" strokeWidth="0.8" opacity="0.3" /></g>
        ))}
        <circle cx="130" cy="112" r="5" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.25" />
        <circle cx="130" cy="150" r="5" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.25" />
      </>}

      {plantId === 'NKE-ALPI' && <>
        <polygon points="130,215 250,178 250,172 130,210 10,172 10,178" fill="rgba(0,212,170,0.03)" stroke="#00d4aa" strokeWidth="0.4" opacity="0.2" />
        <rect x="50" y="25" width="160" height="110" rx="4" fill="rgba(59,130,246,0.03)" stroke="#3b82f6" strokeWidth="0.8" opacity="0.25" />
        <rect x="70" y="45" width="120" height="70" fill="none" stroke="#00d4aa" strokeWidth="0.4" opacity="0.2" strokeDasharray="4 2" />
        <rect x="115" y="148" width="30" height="25" rx="4" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="0.8" opacity="0.25" />
        <circle cx="130" cy="160" r="5" fill="none" stroke="#f59e0b" strokeWidth="0.6" opacity="0.2" />
        <line x1="130" y1="173" x2="130" y2="200" stroke="#94a3b8" strokeWidth="1.2" opacity="0.2" />
        <rect x="30" y="153" width="35" height="16" rx="3" fill="rgba(168,85,247,0.04)" stroke="#a855f7" strokeWidth="0.6" opacity="0.2" />
      </>}

      {plantId === 'FCA-KRAGU' && <>
        <polygon points="130,75 240,120 240,132 130,180 20,132 20,120" fill="url(#arHoloGrad)" stroke="#00d4aa" strokeWidth="0.6" opacity="0.2" />
        <line x1="45" y1="132" x2="45" y2="225" stroke="#00d4aa" strokeWidth="0.8" opacity="0.15" />
        <line x1="215" y1="132" x2="215" y2="225" stroke="#00d4aa" strokeWidth="0.8" opacity="0.15" />
        <line x1="75" y1="118" x2="75" y2="35" stroke="#f59e0b" strokeWidth="1.2" opacity="0.2" />
        <line x1="75" y1="35" x2="150" y2="48" stroke="#f59e0b" strokeWidth="1.2" opacity="0.2" />
        <rect x="140" y="40" width="22" height="30" rx="3" fill="rgba(0,212,170,0.04)" stroke="#00d4aa" strokeWidth="0.8" opacity="0.25" />
        <rect x="102" y="105" width="56" height="25" rx="3" fill="rgba(168,85,247,0.03)" stroke="#a855f7" strokeWidth="0.6" opacity="0.2" />
        <rect x="185" y="60" width="42" height="30" rx="3" fill="rgba(96,165,250,0.04)" stroke="#60a5fa" strokeWidth="0.6" opacity="0.2" />
      </>}

      {plantId === 'BMW-DING' && <>
        <ellipse cx="130" cy="230" rx="45" ry="12" fill="rgba(0,212,170,0.03)" stroke="#00d4aa" strokeWidth="0.6" opacity="0.2" />
        <rect x="120" y="55" width="20" height="175" rx="2" fill="rgba(59,130,246,0.03)" stroke="#3b82f6" strokeWidth="0.8" opacity="0.2" />
        <ellipse cx="130" cy="55" rx="22" ry="7" fill="none" stroke="#00d4aa" strokeWidth="1" opacity="0.25" />
        <line x1="130" y1="55" x2="225" y2="72" stroke="#f59e0b" strokeWidth="1.5" opacity="0.2" />
        <line x1="225" y1="72" x2="208" y2="140" stroke="#f59e0b" strokeWidth="1.2" opacity="0.2" />
        <rect x="193" y="140" width="30" height="14" rx="3" fill="rgba(0,212,170,0.05)" stroke="#00d4aa" strokeWidth="0.8" opacity="0.25" />
        {Array.from({ length: 4 }, (_, i) => <circle key={`vc${i}`} cx={198 + i * 6} cy={154} r="1.5" fill="none" stroke="#a855f7" strokeWidth="0.6" opacity="0.2" />)}
      </>}

      {active && <>
        <ellipse cx={active.cx} cy={active.cy} rx={active.rx + 8} ry={active.ry + 8} fill="none" stroke={active.color} strokeWidth="1" opacity="0.15" strokeDasharray="4 3">
          <animate attributeName="rx" values={`${active.rx + 6};${active.rx + 12};${active.rx + 6}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="ry" values={`${active.ry + 6};${active.ry + 12};${active.ry + 6}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx={active.cx} cy={active.cy} rx={active.rx} ry={active.ry} fill={`${active.color}10`} stroke={active.color} strokeWidth="2" opacity="0.8" filter="url(#activeGlow)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        <line x1={active.cx + active.rx + 5} y1={active.cy - active.ry} x2={active.cx + active.rx + 35} y2={active.cy - active.ry - 20} stroke={active.color} strokeWidth="1.5" opacity="0.8" />
        <rect x={active.cx + active.rx + 30} y={active.cy - active.ry - 32} width={active.label.length * 6.5 + 12} height="20" rx="4" fill={`${active.color}20`} stroke={active.color} strokeWidth="1.5" opacity="0.9" />
        <text x={active.cx + active.rx + 36 + active.label.length * 3.25} y={active.cy - active.ry - 18} textAnchor="middle" fill={active.color} fontSize="7" fontFamily="monospace" fontWeight="bold">{active.label}</text>
        <text x={active.cx} y={active.cy + active.ry + 16} textAnchor="middle" fill={active.color} fontSize="6" fontFamily="monospace" fontWeight="bold" opacity="0.7">▼ PASSO {currentStep + 1}</text>
      </>}
    </>
  );
}

export default function VisualTraining() {
  const [selectedPlant, setSelectedPlant] = useState(plants[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [targetLang, setTargetLang] = useState('en');

  const [calling, setCalling] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const proc = plantProcedures[selectedPlant.id];
  const step = proc.steps[currentStep];
  const totalSteps = proc.steps.length;
  const currentImages = plantImages[selectedPlant.id] || [];
  const currentImage = currentImages[imgIndex % currentImages.length] || currentImages[0];

  const getTranslatedText = (s) => {
    if (!translated) return null;
    if (targetLang === 'en') return s.en;
    if (targetLang === 'pt') return s.pt;
    return s.en;
  };

  const handleTranslate = () => {
    if (translating || translated) return;
    setTranslating(true);
    setTimeout(() => { setTranslating(false); setTranslated(true); }, 1500);
  };

  const handleCall = () => {
    if (calling) return;
    setCalling(true);
    setTimeout(() => setCalling(false), 3000);
  };

  useEffect(() => {
    setCurrentStep(0);
    setTranslated(false);
    setShowVideo(false);

  }, [selectedPlant]);

  return (
    <div className="p-6">
      <AlertBar message="Sessione training attiva — 3 operatori connessi da Detroit, 1 da São Paulo · AI Vision in esecuzione" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Eye size={22} className="text-[#00d4aa]" />
          <div>
            <h2 className="text-xl font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>AI VISUAL TRAINING & ONBOARDING</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Vista Operatore · Realtà Aumentata · AI Co-Pilot con traduzione LLM in tempo reale</p>
          </div>
        </div>
      </div>

      {/* Selettore Impianto */}
      <div className="mb-5">
        <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>SELEZIONA IMPIANTO</label>
        <select
          value={selectedPlant.id}
          onChange={e => { setSelectedPlant(plants.find(p => p.id === e.target.value)); setImgIndex(0); setCurrentStep(0); setShowVideo(false); setTranslated(false); }}
          className="w-full p-3 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }}>
          {plants.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* CENTER: Viewport Centrale in Realtà Aumentata (AR) */}
        <div className="col-span-7">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            {/* Barra superiore AR */}
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-400">VISIONE AI ATTIVA</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                  GEMELLO DIGITALE: {proc.cadOverlay}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>Passo {currentStep + 1}/{totalSteps}</span>
              </div>
            </div>

            {/* Viewport principale */}
            <div className="relative" style={{ minHeight: '380px', background: '#0a0e17' }}>
              {showVideo ? (
                <div className="w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${proc.videoId}?autoplay=1&rel=0`}
                    title="Video Tutorial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Sfondo con immagine reale dal sito A&S */}
                    <div className="absolute inset-0" style={{ background: '#0d1117' }}>
                      <img
                        src={currentImage}
                        alt={selectedPlant.asProduct}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                        style={{ opacity: 0.6, filter: 'brightness(0.7)' }}
                      />
                      {/* Griglia AR sovrapposta */}
                      <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {Array.from({ length: 10 }, (_, i) => (
                          <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#00d4aa" strokeWidth="0.2" />
                        ))}
                        {Array.from({ length: 10 }, (_, i) => (
                          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#00d4aa" strokeWidth="0.2" />
                        ))}
                      </svg>

                      {/* Sovrapposizione Olografica — Ologramma 3D del pezzo da montare */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="w-64 h-64 rounded-lg relative" style={{ border: '2px solid rgba(0,212,170,0.4)', background: 'rgba(0,212,170,0.03)' }}>
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 260">
                              <ARModel plantId={selectedPlant.id} currentStep={currentStep} />
                            </svg>
                          </div>

                          {/* Frecce AR che guidano visivamente l'operatore */}
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="text-[#00d4aa] text-xl animate-bounce">↓</span>
                            <span className="text-[0.5rem] bg-[#00d4aa]/20 text-[#00d4aa] px-2 py-0.5 rounded font-mono font-bold">PASSO {currentStep + 1}</span>
                          </div>
                          <div className="absolute top-1/2 -right-16 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-cyan-400 text-xl">→</span>
                            <span className="text-[0.5rem] bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">{step.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Indicatore REC */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[0.55rem] text-red-400 font-mono font-bold">REC · LIVE CANTIERE</span>
                      </div>

                      {/* Etichetta Gemello Digitale */}
                      <div className="absolute top-3 right-3">
                        <span className="text-[0.6rem] text-[#00d4aa] font-mono bg-[#00d4aa]/10 px-2 py-1 rounded">
                          OLOGRAMMA 3D · {proc.component}
                        </span>
                      </div>

                      {/* Info basso */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                        <span className="text-[0.5rem] text-white/50 font-mono">{selectedPlant.name}</span>
                        <button onClick={() => setShowVideo(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
                          <Play size={12} /> Guarda Video Tutorial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image gallery thumbnails */}
            <div className="flex items-center gap-2 px-4 py-2" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
              <span className="text-[0.55rem] font-mono mr-2" style={{ color: 'var(--color-text-secondary)' }}>FOTO IMPIANTO:</span>
              {currentImages.map((img, i) => (
                <button key={i} onClick={() => { setImgIndex(i); setShowVideo(false); }}
                  className="rounded overflow-hidden transition-all"
                  style={{ border: imgIndex === i ? '2px solid #00d4aa' : '2px solid transparent', opacity: imgIndex === i ? 1 : 0.5, width: 48, height: 36 }}>
                  <img src={img} alt={`${selectedPlant.asProduct} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <span className="text-[0.5rem] font-mono ml-auto" style={{ color: 'var(--color-text-secondary)' }}>{imgIndex + 1}/{currentImages.length}</span>
            </div>

            {/* Tasti di interazione */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
              <button onClick={handleTranslate}
                disabled={translating || translated}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: translated ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                  border: `1px solid ${translated ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
                  color: translated ? '#22c55e' : '#60a5fa',
                }}>
                {translating ? <><Loader2 size={14} className="animate-spin" /> Traduzione AI...</> : translated ? <><CheckCircle size={14} /> Tradotto ({targetLang.toUpperCase()})</> : <><Globe size={14} /> Richiedi Traduzione AI</>}
              </button>
              {!translated && (
                <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
                  className="text-xs px-2 py-2 rounded-lg"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }}>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              )}
              {stepHighlights[selectedPlant.id] && stepHighlights[selectedPlant.id][currentStep] && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    background: `${stepHighlights[selectedPlant.id][currentStep].color}15`,
                    border: `1px solid ${stepHighlights[selectedPlant.id][currentStep].color}40`,
                    color: stepHighlights[selectedPlant.id][currentStep].color,
                  }}>
                  <Box size={14} /> 3D: {stepHighlights[selectedPlant.id][currentStep].label}
                </div>
              )}
              <button onClick={handleCall}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ml-auto"
                style={{
                  background: calling ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171',
                }}>
                <Phone size={14} /> {calling ? 'Chiamata in corso...' : 'Chiama Supervisore in Italia (Emergenza)'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Co-Pilot — Checklist Operativa */}
        <div className="col-span-5 space-y-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>AI CO-PILOT · CHECKLIST OPERATIVA</h3>
              <span className="text-[0.6rem] px-2 py-0.5 rounded-full font-bold" style={{
                background: 'rgba(0,212,170,0.2)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)',
              }}>LLM Attivo</span>
            </div>

            <p className="text-[0.6rem] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Istruzioni generate dall'Intelligenza Artificiale a partire dai manuali tecnici italiani. Premi "Richiedi Traduzione AI" per tradurre nella lingua dell'operatore locale.
            </p>

            {/* Passo attivo */}
            <div className="p-4 rounded-lg mb-3" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
                  {currentStep + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    {step.it}
                  </p>
                  {translated && (
                    <p className="text-xs mb-1 px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <Globe size={10} className="inline mr-1" />
                      {getTranslatedText(step)}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>
                      <Clock size={10} /> {step.time}
                    </span>
                    <span className="flex items-center gap-1 text-[0.65rem] text-[#00d4aa]">
                      <Target size={10} /> Assistenza AI attiva
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista passi */}
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 mb-4">
              {proc.steps.map((s, i) => (
                <button key={i} onClick={() => setCurrentStep(i)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all"
                  style={{
                    background: i === currentStep ? 'rgba(0,212,170,0.08)' : 'transparent',
                    border: i === currentStep ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
                    opacity: i < currentStep ? 0.5 : 1,
                  }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.55rem] font-bold"
                    style={{
                      background: i < currentStep ? '#22c55e' : i === currentStep ? '#00d4aa' : 'var(--color-bg-secondary)',
                      color: i <= currentStep ? '#0a0e17' : 'var(--color-text-secondary)',
                    }}>
                    {i < currentStep ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  <span className="flex-1 truncate" style={{ color: 'var(--color-text-primary)' }}>{s.it}</span>
                  <span className="text-[0.55rem] flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{s.time}</span>
                </button>
              ))}
            </div>

            {/* Navigazione */}
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <ChevronLeft size={14} /> Precedente
              </button>
              <span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>
                Passo {currentStep + 1} di {totalSteps}
              </span>
              <button onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                disabled={currentStep === totalSteps - 1}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
                Successivo <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Info componente */}
          <div className="rounded-xl p-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>COMPONENTE IN LAVORAZIONE</h4>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{proc.component}</p>
            <p className="text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>{proc.cadOverlay}</p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <div className="text-lg font-bold text-[#00d4aa]">{totalSteps}</div>
                <div className="text-[0.55rem]" style={{ color: 'var(--color-text-secondary)' }}>Passi totali</div>
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {proc.steps.reduce((acc, s) => acc + parseInt(s.time), 0)} min
                </div>
                <div className="text-[0.55rem]" style={{ color: 'var(--color-text-secondary)' }}>Durata stimata</div>
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: '#60a5fa' }}>{selectedPlant.country}</div>
                <div className="text-[0.55rem]" style={{ color: 'var(--color-text-secondary)' }}>Stabilimento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}