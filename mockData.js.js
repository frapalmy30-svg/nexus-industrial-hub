export const workOrders = [
  {
    id: 'WO-2026-0151',
    client: 'Cella Robotica NKE Automation',
    supplier: 'SPA Automazioni SAS',
    priority: 'alta',
    value: 185000,
    status: 'backlog',
    dueDate: '2026-05-10',
    progress: 0,
    description: 'Installazione cella robotica per saldatura carrozzeria. Include 4 robot ABB IRB 6700 con controller IRC5, sistema visione 3D Cognex, conveyor intelligente e safety fence perimetrale. Programmazione traiettorie e collaudo FAT previsti.',
    items: ['Robot ABB IRB 6700 x4', 'Controller IRC5 x4', 'Cognex Vision 3D', 'Conveyor System'],
    notes: 'Richiesta formazione operatori post-installazione'
  },
  {
    id: 'WO-2026-0142',
    client: 'Linea Assemblaggio BMW Group',
    supplier: 'EVM SRL',
    priority: 'alta',
    value: 312000,
    status: 'lavorazione',
    dueDate: '2026-04-30',
    progress: 45,
    description: 'Revamping completo linea assemblaggio motori V8 per stabilimento Dingolfing. Sostituzione PLC Siemens S7-1500, upgrade HMI Comfort Panel, integrazione MES con SAP PP. Test vibrazionale e allineamento assi.',
    items: ['PLC Siemens S7-1500 x12', 'HMI KTP900 x6', 'Servo drive Sinamics S120', 'Encoder assoluti'],
    notes: 'Coordinamento con team BMW per fermo impianto programmato'
  },
  {
    id: 'WO-2026-0129',
    client: 'Banco Test Iniettori IVECO',
    supplier: 'Meccanica Surra SNC',
    priority: 'media',
    value: 95000,
    status: 'lavorazione',
    dueDate: '2026-05-15',
    progress: 72,
    description: 'Progettazione e realizzazione banco prova iniettori common rail per motori Cursor 13. Precisione misura portata ±0.5%, pressione max 2500 bar. Sistema acquisizione dati National Instruments e software LabVIEW.',
    items: ['Sensori pressione Kistler', 'DAQ NI cDAQ-9178', 'Pompa alta pressione', 'Software LabVIEW'],
    notes: 'Calibrazione certificata richiesta entro consegna'
  },
  {
    id: 'WO-2026-0125',
    client: 'Linea Pressofusione FCA Srbija',
    supplier: 'Campi International',
    priority: 'media',
    value: 420000,
    status: 'test',
    dueDate: '2026-04-28',
    progress: 88,
    description: 'Automazione isola pressofusione alluminio con pressa Buhler 1600t. Robot di estrazione Fanuc M-20iA, sistema di raffreddamento controllato, taglio materozze automatico e controllo qualità visivo inline.',
    items: ['Robot Fanuc M-20iA', 'Sistema visione Keyence', 'Pressa Buhler 1600t', 'Trimming station'],
    notes: 'FAT completato, in attesa SAT presso stabilimento cliente'
  },
  {
    id: 'WO-2026-0119',
    client: 'Linea Verniciatura Stellantis Europe',
    supplier: 'B2 Progetti SNC',
    priority: 'bassa',
    value: 156000,
    status: 'pronto',
    dueDate: '2026-05-20',
    progress: 100,
    description: 'Sistema di verniciatura automatica a polvere per componenti automotive. Cabina con 6 pistole elettrostatiche Gema, forno polimerizzazione a infrarossi, trasportatore aereo birotaia. Cambio colore rapido < 30sec.',
    items: ['Pistole Gema OptiGun x6', 'Forno IR 200kW', 'Trasportatore birotaia', 'Unità cambio colore'],
    notes: 'Pronto per spedizione, attesa conferma indirizzo'
  },
  {
    id: 'WO-2026-0138',
    client: 'Pinza Robotica Stellantis Automoveis',
    supplier: 'CEV Automacao Indust',
    priority: 'critica',
    value: 67000,
    status: 'bloccate',
    dueDate: '2026-04-25',
    progress: 35,
    description: 'Manutenzione straordinaria pinza di saldatura robotica a 6 assi per linea Fiat 500 elettrica. Sostituzione trasformatore, punte elettrodo, cavi flessibili e taratura forza di chiusura. Urgenza per fermo linea.',
    items: ['Trasformatore MFDC', 'Punte Cu-Cr x24', 'Cavi flessibili 95mm²', 'Encoder ricambio'],
    notes: 'BLOCCATA: In attesa sdoganamento ricambi da Brasile (+60gg)'
  }
];
 
export const kanbanColumns = [
  { id: 'backlog', label: 'BACKLOG', count: 2 },
  { id: 'lavorazione', label: 'IN LAVORAZIONE', count: 2 },
  { id: 'test', label: 'TEST', count: 1 },
  { id: 'pronto', label: 'PRONTO SPEDIZIONE', count: 1 },
  { id: 'bloccate', label: 'BLOCCATE', count: 1 }
];
 
export const milkRunStops = [
  { id: '00', name: 'Automazioni & Service (HQ Piobesi)', type: 'SEDE', time: '07:30', lat: 44.9630, lng: 7.6080, action: null, detail: 'Carico materiale per consegne giornaliere — 4 pallet + 2 colli urgenti' },
  { id: '01', name: 'NKE Automation - Alpignano', type: null, time: '08:10', lat: 45.0930, lng: 7.5220, action: 'CONSEGNA', detail: 'Consegna cella robotica WO-2026-0138 — trasformatore MFDC + punte Cu-Cr x24 per linea saldatura' },
  { id: '02', name: 'Stellantis Europe - Mirafiori', type: null, time: '08:55', lat: 45.0350, lng: 7.6100, action: 'CONSEGNA', detail: 'Consegna attrezzatura linea carrozzeria WO-2026-0151 — staffaggi e pinze pneumatiche Festo' },
  { id: '03', name: 'IVECO S.p.A. - Lungo Stura', type: null, time: '09:40', lat: 45.0950, lng: 7.6700, action: 'CONSEGNA', detail: 'Consegna banco test iniettori WO-2026-0129 — sensori Kistler + DAQ NI cDAQ-9178' },
  { id: '04', name: 'Meccanica Surra - Settimo T.se', type: null, time: '10:25', lat: 45.1350, lng: 7.7650, action: 'RITIRO', detail: 'Ritiro carpenteria meccanica lavorata — struttura banco prova + staffaggi (€206.445 annuo)' },
  { id: '05', name: 'B2 Progetti - Torino', type: null, time: '11:10', lat: 45.0680, lng: 7.6600, action: 'RITIRO', detail: 'Ritiro progetti esecutivi e disegni tecnici per commesse Stellantis e FCA (€105.300 annuo)' },
  { id: '06', name: 'OMG SRL - Cambiano', type: null, time: '11:55', lat: 44.9700, lng: 7.7700, action: 'RITIRO', detail: 'Ritiro componenti lavorati — alberi e flange per linea BMW (€89.760 annuo)' },
  { id: '07', name: 'Festo SPA - Rivalta (TO)', type: null, time: '12:20', lat: 45.0370, lng: 7.5130, action: 'RITIRO', detail: 'Ritiro valvole pneumatiche e cilindri per celle robotiche NKE e Stellantis (€58.736 annuo)' },
];
 
export const suppliers = [
  { name: 'SPA Automazioni SAS', type: 'Automazione indu...', code: 'SA-23921', trust: 95, status: 'OK', eta: '24:00' },
  { name: 'Meccanica Surra SNC', type: 'Carpenteria mecc...', code: 'MS-20644', trust: 87, status: 'OK', eta: '42:00' },
  { name: 'Campi International', type: 'Componentistica', code: 'CI-19119', trust: 90, status: 'OK', eta: '36:00' },
  { name: 'EVM SRL', type: 'Elettronica industr...', code: 'EV-18094', trust: 88, status: 'OK', eta: '48:00' },
  { name: 'B2 Progetti SNC', type: 'Progettazione', code: 'B2-10530', trust: 92, status: 'OK', eta: '5gg' },
  { name: 'OMG SRL', type: 'Lavorazioni mecc...', code: 'OM-08976', trust: 85, status: 'OK', eta: '3gg' },
  { name: 'Festo SPA', type: 'Pneumatica industr...', code: 'FE-05873', trust: 91, status: 'OK', eta: '7gg' },
  { name: 'Bosch Rexroth SPA', type: 'Idraulica indust...', code: 'BR-01450', trust: 78, status: 'WARN', eta: '10gg' },
];
 
export const fleet = [
  { id: 'NX-04', driver: 'M. Bruno', status: 'In rotta', statusColor: 'text-amber-400' },
  { id: 'NX-07', driver: 'L. Cinque', status: 'Carico', statusColor: 'text-blue-400' },
  { id: 'NX-12', driver: 'S. Greco', status: 'Disponibile', statusColor: 'text-green-400' }
];
 
export const digitalTwinAssets = [
  {
    id: 'DT-001',
    name: 'Linea Assemblaggio BMW',
    location: 'Stabilimento USA - Detroit',
    status: 'ONLINE',
    healthScore: 94,
    temperature: 42.0,
    tempThreshold: 65,
    power: 8.6,
    powerAvg: 7.2,
    vibration: 2.42,
    vibThreshold: 4.5,
    lastSync: '2m ago',
    uptime: 99.8,
    operators: 12,
    site: 'Detroit, Michigan (USA)',
    description: 'Linea di assemblaggio motori V8 ad alta precisione. Comprende 12 stazioni robotizzate con controllo qualità inline, sistema di tracciabilità RFID e monitoraggio vibrazionale continuo.',
    components: [
      { name: 'Motore mandrino principale', health: 96, status: 'nominal' },
      { name: 'Sistema idraulico', health: 91, status: 'nominal' },
      { name: 'Encoder assi', health: 98, status: 'nominal' },
      { name: 'Sensori temperatura', health: 88, status: 'warning' }
    ]
  },
  {
    id: 'DT-002',
    name: 'Cella Robotica Stellantis',
    location: 'Stabilimento Brasile - São Paulo',
    status: 'ONLINE',
    healthScore: 87,
    temperature: 38.5,
    tempThreshold: 60,
    power: 12.1,
    powerAvg: 11.0,
    vibration: 3.15,
    vibThreshold: 5.0,
    lastSync: '5m ago',
    uptime: 97.2,
    operators: 5,
    site: 'São Paulo (Brasile)',
    description: 'Cella di saldatura robotica con 4 robot antropomorfi per carrozzeria. Sistema di cambio utensile automatico, visione 3D per posizionamento e controllo cordone di saldatura laser.',
    components: [
      { name: 'Robot 1 - Saldatura', health: 89, status: 'nominal' },
      { name: 'Robot 2 - Saldatura', health: 85, status: 'warning' },
      { name: 'Sistema visione 3D', health: 92, status: 'nominal' },
      { name: 'Alimentatore filo', health: 78, status: 'warning' }
    ]
  },
  {
    id: 'DT-003',
    name: 'Banco Test Iniettori',
    location: 'Stabilimento USA - Detroit',
    status: 'WARNING',
    healthScore: 72,
    temperature: 52.3,
    tempThreshold: 65,
    power: 6.2,
    powerAvg: 5.8,
    vibration: 4.1,
    vibThreshold: 4.5,
    lastSync: '12m ago',
    uptime: 98.5,
    operators: 8,
    site: 'Detroit, Michigan (USA)',
    description: 'Banco prova iniettori common rail ad alta pressione (2500 bar). Sistema di misura portata con precisione ±0.5%, acquisizione dati NI e analisi statistica real-time.',
    components: [
      { name: 'Pompa alta pressione', health: 68, status: 'critical' },
      { name: 'Sensori di portata', health: 82, status: 'warning' },
      { name: 'Valvola di regolazione', health: 71, status: 'warning' },
      { name: 'Sistema acquisizione dati', health: 95, status: 'nominal' }
    ]
  },
  {
    id: 'DT-004',
    name: 'Pinza Robotica 6-assi',
    location: 'Stabilimento Brasile - São Paulo',
    status: 'OFFLINE',
    healthScore: 0,
    temperature: 0,
    tempThreshold: 70,
    power: 0,
    powerAvg: 9.5,
    vibration: 0,
    vibThreshold: 4.0,
    lastSync: 'N/A',
    uptime: 0,
    operators: 0,
    site: 'São Paulo (Brasile)',
    description: 'Pinza di saldatura a resistenza per lamiera sottile. Forza di chiusura programmabile 2-8 kN, trasformatore MFDC integrato. Attualmente offline per manutenzione straordinaria.',
    components: [
      { name: 'Trasformatore MFDC', health: 15, status: 'critical' },
      { name: 'Cilindro pneumatico', health: 45, status: 'critical' },
      { name: 'Punte elettrodo', health: 0, status: 'critical' },
      { name: 'Encoder posizione', health: 62, status: 'warning' }
    ]
  }
];
 
export const connectedSites = [
  { name: 'Piobesi Torinese (HQ)', operators: 12, uptime: 99.8, connected: true },
  { name: 'Detroit, Michigan (USA)', operators: 8, uptime: 98.5, connected: true },
  { name: 'São Paulo (Brasile)', operators: 5, uptime: 97.2, connected: true }
];
 
export const performanceTrend = [
  { metric: 'Disponibilità', value: 99.2, change: '+0.3%' },
  { metric: 'Efficienza', value: 94.7, change: '-0.5%' },
  { metric: 'Affidabilità', value: 96.8, change: '+1.2%' },
  { metric: 'MTBF', value: '2847h', change: '+124h' }
];
 
export const recentEvents = [
  { id: 'DT-001', text: 'Manutenzione preventiva completata', time: '1h', type: 'success' },
  { id: 'DT-003', text: 'Temperatura anomala rilevata', time: '12m', type: 'danger' },
  { id: 'DT-004', text: 'Connessione ripristinata', time: '2h', type: 'info' },
  { id: 'DT-002', text: 'Ciclo produttivo completato', time: '4h', type: 'success' }
];
 
export const warrantyClaims = [
  {
    id: 'CLM-2026-041',
    date: '2026-04-22',
    status: 'RIFIUTATA',
    confidence: 94,
    product: 'Motore Asincrono 15kW',
    plant: 'FCA US Plant - Detroit',
    description: 'Analisi Visiva LMM completata. Segni di usura anomala da impatto rilevati sulla superficie del rotore. Causa: Negligenza operatore. Garanzia: RIFIUTATA',
    aiAnalysis: 'Pattern di usura compatibile con sovraccarico meccanico. Analisi termografica mostra hot-spot localizzato sul lato B del cuscinetto. Probabilità guasto operatore: 94%.',
    photo: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
    photoCaption: 'Usura anomala rotore motore asincrono — segni di impatto visibili',
    recommendations: [
      'Implementare protocollo ispezione pre-operativa',
      'Formazione operatori su movimentazione'
    ]
  },
  {
    id: 'CLM-2026-038',
    date: '2026-04-18',
    status: 'APPROVATA',
    confidence: 98,
    product: 'Riduttore Epicicloidale',
    plant: 'Stellantis Mirafiori',
    description: 'Difetto di fabbricazione confermato su ingranaggio planetario. Micro-cricche rilevate con analisi ultrasonora. Sostituzione in garanzia approvata.',
    aiAnalysis: 'Difetto metallurgico nel trattamento termico. Durezza superficiale sotto specifica (58 HRC vs 62 HRC richiesti). Lotto produzione identificato per richiamo.',
    photo: 'https://images.unsplash.com/photo-1530124566582-a45a7c79de8b?w=600&h=400&fit=crop',
    photoCaption: 'Micro-cricche su ingranaggio planetario — difetto trattamento termico',
    recommendations: [
      'Controllo qualità rinforzato sul lotto 2026-B',
      'Audit fornitore ingranaggi'
    ]
  },
  {
    id: 'CLM-2026-035',
    date: '2026-04-15',
    status: 'IN ATTESA',
    confidence: null,
    product: 'Servomotore Bosch MSK030',
    plant: 'BMW Group - Spartanburg',
    description: 'Perdita di coppia intermittente durante cicli ad alta velocità. In attesa di analisi dati encoder e log di funzionamento per determinare causa.',
    aiAnalysis: 'Dati insufficienti per analisi conclusiva. Necessari log encoder ultimi 30 giorni e profilo di carico effettivo.',
    photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop',
    photoCaption: 'Servomotore Bosch MSK030 — analisi coppia in corso',
    recommendations: [
      'Richiedere log encoder al cliente',
      'Eseguire test benchmark su unità identica'
    ]
  }
];
 
export const warrantyStats = {
  processed: { value: 127, change: '+8' },
  approved: { value: 89, percentage: '70%' },
  rejected: { value: 38, percentage: '30%' },
  avgAnalysisTime: { value: '2.3h', change: '-15m' }
};
 
export const warehouseData = {
  totalArea: 448,
  dimensions: '28 x 16',
  units: 11,
  totalPositions: 22,
  saturation: 43.3,
  usedArea: 194,
  freeSpace: 254,
  blockedInArea: 1,
  inventory: [
    { type: 'COMMESSA', client: 'BMW Group', size: '8x5', color: '#3b82f6' },
    { type: 'COMMESSA', client: 'NKE Automation', size: '5x4', color: '#a855f7' },
    { type: 'COMMESSA', client: 'FCA Srbija', size: '12x7', color: '#ec4899' },
    { type: 'COMMESSA', client: 'IVECO S.p.A.', size: '4x3', color: '#3b82f6' },
    { type: 'COMMESSA', client: 'Stellantis Europe', size: '7x6', color: '#f97316' },
    { type: 'COMMESSA', client: 'Lucid Motors', size: '10x6', color: '#ef4444' },
    { type: 'MATERIA PRIMA', client: 'Stock Meccanica Surra', size: '4x3', color: '#22c55e' },
    { type: 'MATERIA PRIMA', client: 'Stock EVM SRL', size: '4x2', color: '#22c55e' },
    { type: 'STOCK', client: 'Stock Festo SPA', size: '3x3', color: '#84cc16' }
  ]
};
 
export const procurementData = {
  totalLines: 11,
  totalBundles: 4,
  baselineCost: 44868,
  forecastCost: 44868,
  bundles: [
    {
      supplier: 'Bosch Rexroth',
      lines: 3,
      total: 21280,
      items: [
        { sku: 'BR-IndraDrive-7', desc: 'IndraDrive 7,5kW', qty: 2, price: 3200 },
        { sku: 'BR-LinAxis-4', desc: 'Asse lineare CKK', qty: 4, price: 2100 },
        { sku: 'BR-Servo-3', desc: 'Servo MSK030', qty: 1, price: 4480 }
      ]
    },
    {
      supplier: 'Ferriera Padana',
      lines: 3,
      total: 14300,
      items: [
        { sku: 'AC-S355-12', desc: 'Lamiera S355 12mm', qty: 24, price: 143 },
        { sku: 'AC-S275-20', desc: 'Lamiera S275 20mm', qty: 16, price: 188 },
        { sku: 'AC-INOX-316L', desc: 'Inox 316L 6mm', qty: 80, price: 98 }
      ]
    },
    {
      supplier: 'Festo',
      lines: 2,
      total: 4680,
      items: [
        { sku: 'FE-DSBC-32', desc: 'Cilindro Festo DSBC-32-100', qty: 12, price: 184 },
        { sku: 'FE-VUVS-16', desc: 'Valvola 5/2 VUVS', qty: 8, price: 156 }
      ]
    },
    {
      supplier: 'SKF',
      lines: 3,
      total: 4608,
      items: [
        { sku: 'SK-6205-2RS', desc: 'Cuscinetto 6205-2RS', qty: 32, price: 28 },
        { sku: 'SK-NU310', desc: 'Cuscinetto NU310', qty: 8, price: 185 },
        { sku: 'SK-SY35TF', desc: 'Supporto SY35TF', qty: 16, price: 95 }
      ]
    }
  ]
};
 
export const aiTrainingModels = [
  {
    id: 'MDL-001',
    name: 'Predictive Maintenance',
    type: 'LSTM Neural Network',
    status: 'deployed',
    accuracy: 94.2,
    lastTrained: '2026-04-20',
    dataPoints: 1250000,
    description: 'Modello di manutenzione predittiva basato su reti neurali LSTM. Analizza pattern di vibrazione, temperatura e consumo energetico per prevedere guasti con anticipo di 72h.',
    metrics: {
      precision: 92.1,
      recall: 96.3,
      f1Score: 94.2,
      falsePositiveRate: 3.8
    },
    trainingHistory: [
      { epoch: 1, loss: 0.45, accuracy: 72 },
      { epoch: 5, loss: 0.28, accuracy: 81 },
      { epoch: 10, loss: 0.15, accuracy: 88 },
      { epoch: 20, loss: 0.08, accuracy: 92 },
      { epoch: 30, loss: 0.05, accuracy: 94.2 }
    ]
  },
  {
    id: 'MDL-002',
    name: 'Quality Vision Inspector',
    type: 'CNN ResNet-50',
    status: 'training',
    accuracy: 88.7,
    lastTrained: '2026-04-24',
    dataPoints: 450000,
    description: 'Sistema di visione artificiale per controllo qualità inline. Rileva difetti superficiali su componenti metallici con risoluzione sub-millimetrica.',
    metrics: {
      precision: 87.5,
      recall: 90.1,
      f1Score: 88.7,
      falsePositiveRate: 5.2
    },
    trainingHistory: [
      { epoch: 1, loss: 0.62, accuracy: 58 },
      { epoch: 5, loss: 0.41, accuracy: 71 },
      { epoch: 10, loss: 0.29, accuracy: 79 },
      { epoch: 20, loss: 0.18, accuracy: 85 },
      { epoch: 30, loss: 0.12, accuracy: 88.7 }
    ]
  },
  {
    id: 'MDL-003',
    name: 'Route Optimizer',
    type: 'Reinforcement Learning',
    status: 'deployed',
    accuracy: 91.5,
    lastTrained: '2026-04-19',
    dataPoints: 320000,
    description: 'Algoritmo di ottimizzazione percorsi logistici basato su Reinforcement Learning. Minimizza distanza, tempo e consumo carburante considerando vincoli di carico e finestre temporali.',
    metrics: {
      precision: 90.2,
      recall: 92.8,
      f1Score: 91.5,
      falsePositiveRate: 4.1
    },
    trainingHistory: [
      { epoch: 1, loss: 0.58, accuracy: 62 },
      { epoch: 5, loss: 0.35, accuracy: 74 },
      { epoch: 10, loss: 0.22, accuracy: 83 },
      { epoch: 20, loss: 0.11, accuracy: 89 },
      { epoch: 30, loss: 0.07, accuracy: 91.5 }
    ]
  },
  {
    id: 'MDL-004',
    name: 'Warranty Claim Analyzer',
    type: 'Transformer (BERT)',
    status: 'deployed',
    accuracy: 96.1,
    lastTrained: '2026-04-21',
    dataPoints: 85000,
    description: 'Analisi automatica reclami garanzia con NLP. Classifica causa del difetto, determina responsabilità e suggerisce azione basandosi su storico reclami e documentazione tecnica.',
    metrics: {
      precision: 95.8,
      recall: 96.4,
      f1Score: 96.1,
      falsePositiveRate: 2.1
    },
    trainingHistory: [
      { epoch: 1, loss: 0.52, accuracy: 65 },
      { epoch: 5, loss: 0.30, accuracy: 78 },
      { epoch: 10, loss: 0.16, accuracy: 87 },
      { epoch: 20, loss: 0.06, accuracy: 93 },
      { epoch: 30, loss: 0.03, accuracy: 96.1 }
    ]
  },
  {
    id: 'MDL-005',
    name: 'Energy Optimizer',
    type: 'Gradient Boosting',
    status: 'validation',
    accuracy: 89.3,
    lastTrained: '2026-04-23',
    dataPoints: 180000,
    description: 'Ottimizzazione consumo energetico degli impianti. Predice il consumo per turno e suggerisce configurazioni operative per ridurre costi energetici del 15-20%.',
    metrics: {
      precision: 88.7,
      recall: 89.9,
      f1Score: 89.3,
      falsePositiveRate: 6.3
    },
    trainingHistory: [
      { epoch: 1, loss: 0.55, accuracy: 60 },
      { epoch: 5, loss: 0.38, accuracy: 72 },
      { epoch: 10, loss: 0.25, accuracy: 80 },
      { epoch: 20, loss: 0.14, accuracy: 86 },
      { epoch: 30, loss: 0.09, accuracy: 89.3 }
    ]
  }
];
 
export const aiTrainingStats = {
  totalModels: 5,
  deployed: 3,
  training: 1,
  validation: 1,
  totalDataPoints: '2.3M',
  avgAccuracy: 91.96,
  gpuUtilization: 78,
  trainingQueue: 2
};