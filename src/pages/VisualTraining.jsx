import { useState, useEffect } from 'react';
import { Eye, Clock, ChevronRight, ChevronLeft, Target, CheckCircle, Play, Globe, Phone, Box, Loader2, Sparkles } from 'lucide-react';
import AlertBar from '../components/AlertBar';
import HologramViewer from '../components/HologramViewer';
import { useGoogleAI } from '../hooks/useGoogleAI';

const plants = [
  { id: 'BMW-SPART', name: 'Linea assemblaggio sospensioni PHEV — BMW Spartanburg', country: 'USA', lang: 'EN', asProduct: 'Linea Assemblaggio Sospensioni', machineId: 'sospensioni' },
  { id: 'STELL-BETIM', name: 'Maschera bloccaggio e saldatura lamierati — Stellantis Betim', country: 'Brasile', lang: 'PT', asProduct: 'Maschera Saldatura Lamierati', machineId: 'maschera' },
  { id: 'NKE-ALPI', name: 'Banco calibrazione sistemi ADAS — NKE Automation Alpignano', country: 'Italia', lang: 'IT', asProduct: 'Banco Calibrazione ADAS', machineId: 'adas' },
  { id: 'FCA-KRAGU', name: 'Banco assemblaggio e avvitatura — FCA Srbija Kragujevac', country: 'Serbia', lang: 'EN', asProduct: 'Banco Assemblaggio Avvitatura', machineId: 'avvitatura' },
  { id: 'IVECO-TO', name: 'Calibri di controllo dimensionale — IVECO Torino', country: 'Italia', lang: 'IT', asProduct: 'Calibri di Controllo', machineId: 'calibri' },
  { id: 'STELL-MIRA', name: 'Impianti applicazione sigle e modanature — Stellantis Mirafiori', country: 'Italia', lang: 'IT', asProduct: 'Impianti Sigle e Modanature', machineId: 'sigle' },
  { id: 'FCA-MELFI', name: 'Attrezzi montaggio parti mobili (ferratura) — FCA Melfi', country: 'Italia', lang: 'IT', asProduct: 'Attrezzi Montaggio Parti Mobili', machineId: 'montaggio' },
  { id: 'AUDI-ING', name: 'Impianto simulazione manto stradale (banco rulli) — Audi Ingolstadt', country: 'Germania', lang: 'EN', asProduct: 'Banco Rulli Simulazione Manto Stradale', machineId: 'simulazione' },
];

const H = '/images/machines/holo/';
const plantImages = {
  'BMW-SPART':  [H+'linea assemblaggio sospensioni 3d.jpeg', H+'impianto di assestamento sospensioni veicolo.jpeg'],
  'STELL-BETIM':[H+'maschere di bloccaggio saldatura lamierati 3d.jpeg'],
  'NKE-ALPI':   [H+'banchi di calibrazione sistemi adas 3d.jpeg'],
  'FCA-KRAGU':  [H+'banchi di assemblaggio e avvitatura 3d.jpeg'],
  'IVECO-TO':   [H+'calibri di controllo 3d.jpeg'],
  'STELL-MIRA': [H+'impianti di applicazione e compressione sigle e modanature su veicolo.jpeg'],
  'FCA-MELFI':  [H+'Attrezzi di montaggio parti mobili (ferratura) 3d.jpg', H+'attrezzi leggeri di geometria(carbonio) 3d.jpeg'],
  'AUDI-ING':   [H+'impianto di simulazione manto stradale( banco a rulli).jpeg'],
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
  'IVECO-TO': {
    videoId: 'wjfg-hrPmsM',
    component: 'Calibri di Controllo Dimensionale CC-200',
    cadOverlay: 'Calibri di Controllo — Modello CAD v2.4',
    steps: [
      { step: 1, it: 'Posizionare il pezzo sul piano di controllo termostatato (20°C ±0.5)', en: 'Place the part on the thermostatically controlled inspection plate (20°C ±0.5)', pt: 'Coloque a peça no plano de controle termostático (20°C ±0.5)', time: '2 min' },
      { step: 2, it: 'Selezionare calibro temprato classe 0 corrispondente alla quota nominale', en: 'Select Class 0 hardened gauge matching nominal dimension', pt: 'Selecione o calibre temperado classe 0 correspondente à cota nominal', time: '1 min' },
      { step: 3, it: 'Misurare quota con corsoio mobile (risoluzione 0.002 mm)', en: 'Measure dimension with mobile slider (resolution 0.002 mm)', pt: 'Meça a cota com cursor móvel (resolução 0.002 mm)', time: '3 min' },
      { step: 4, it: 'Leggere valore su nonio digitale e registrare nel certificato', en: 'Read value on digital vernier and record in certificate', pt: 'Leia o valor no nônio digital e registre no certificado', time: '2 min' },
      { step: 5, it: 'Verificare conformità entro tolleranza ISO 286 IT6', en: 'Verify compliance within ISO 286 IT6 tolerance', pt: 'Verifique conformidade dentro da tolerância ISO 286 IT6', time: '2 min' },
    ],
  },
  'STELL-MIRA': {
    videoId: 'h42JMHcLdIk',
    component: 'Impianto Sigle e Modanature SM-150',
    cadOverlay: 'Impianti Applicazione Sigle e Modanature — Modello CAD v3.7',
    steps: [
      { step: 1, it: 'Posizionare la modanatura sul telaio di alimentazione', en: 'Place molding on feed frame', pt: 'Posicione a moldura no quadro de alimentação', time: '2 min' },
      { step: 2, it: 'Allineare laser di posizionamento (precisione ±0.2 mm)', en: 'Align positioning laser (precision ±0.2 mm)', pt: 'Alinhe o laser de posicionamento (precisão ±0.2 mm)', time: '3 min' },
      { step: 3, it: 'Attivare ventose di presa (depressione -0.9 bar)', en: 'Activate suction cups (vacuum -0.9 bar)', pt: 'Ative as ventosas (vácuo -0.9 bar)', time: '2 min' },
      { step: 4, it: 'Avviare attuatore lineare di applicazione (corsa 250 mm)', en: 'Start linear application actuator (stroke 250 mm)', pt: 'Acione o atuador linear de aplicação (curso 250 mm)', time: '3 min' },
      { step: 5, it: 'Comprimere modanatura sul veicolo per 8 secondi (forza 350 N)', en: 'Compress molding onto vehicle for 8 seconds (force 350 N)', pt: 'Comprima a moldura no veículo por 8 segundos (força 350 N)', time: '1 min' },
      { step: 6, it: 'Verificare adesione su PLC di controllo (ciclo 8 ms)', en: 'Verify adhesion on control PLC (cycle 8 ms)', pt: 'Verifique a adesão no PLC de controle (ciclo 8 ms)', time: '2 min' },
    ],
  },
  'FCA-MELFI': {
    videoId: 'vsSfa-enwgw',
    component: 'Attrezzo Ferratura Parti Mobili AFP-300',
    cadOverlay: 'Attrezzi Montaggio Parti Mobili — Modello CAD v4.1',
    steps: [
      { step: 1, it: 'Posizionare la porta sulla guida lineare di precisione (±0.01 mm)', en: 'Position the door on the precision linear guide (±0.01 mm)', pt: 'Posicione a porta na guia linear de precisão (±0.01 mm)', time: '3 min' },
      { step: 2, it: 'Regolare il supporto ergonomico in altezza per l\'operatore', en: 'Adjust ergonomic support height for operator', pt: 'Ajuste a altura do suporte ergonômico para o operador', time: '2 min' },
      { step: 3, it: 'Attivare bloccaggio rapido (forza 500 N)', en: 'Activate quick clamp (force 500 N)', pt: 'Ative a fixação rápida (força 500 N)', time: '1 min' },
      { step: 4, it: 'Avvitare cerniere superiore e inferiore secondo sequenza CAD', en: 'Tighten upper and lower hinges per CAD sequence', pt: 'Aperte as dobradiças superior e inferior conforme sequência CAD', time: '5 min' },
      { step: 5, it: 'Verificare tramite sensore di contatto la posizione delle cerniere', en: 'Verify hinge position via contact sensor', pt: 'Verifique a posição das dobradiças pelo sensor de contato', time: '2 min' },
      { step: 6, it: 'Eseguire prova di apertura/chiusura porta (5 cicli)', en: 'Perform door open/close test (5 cycles)', pt: 'Realize teste de abertura/fechamento da porta (5 ciclos)', time: '3 min' },
    ],
  },
  'AUDI-ING': {
    videoId: 'oSFZvBm4HFA',
    component: 'Banco Rulli Simulazione Manto Stradale BR-450',
    cadOverlay: 'Impianto Simulazione Manto Stradale — Modello CAD v6.0',
    steps: [
      { step: 1, it: 'Posizionare veicolo sui rulli e bloccare ruote anteriori', en: 'Position vehicle on rollers and lock front wheels', pt: 'Posicione o veículo nos rolos e trave as rodas dianteiras', time: '4 min' },
      { step: 2, it: 'Configurare attuatori MTS per profilo strada (corsa ±100 mm)', en: 'Configure MTS actuators for road profile (stroke ±100 mm)', pt: 'Configure os atuadores MTS para perfil de estrada (curso ±100 mm)', time: '3 min' },
      { step: 3, it: 'Attivare servovalvole MOOG (range 0-50 Hz)', en: 'Activate MOOG servovalves (range 0-50 Hz)', pt: 'Ative as servoválvulas MOOG (faixa 0-50 Hz)', time: '2 min' },
      { step: 4, it: 'Avviare cicli simulazione manto e monitorare cella di carico (100 kN)', en: 'Start road simulation cycles and monitor load cell (100 kN)', pt: 'Inicie ciclos de simulação de pista e monitore célula de carga (100 kN)', time: '8 min' },
      { step: 5, it: 'Acquisire dati accelerometro triassiale a 10 kHz', en: 'Acquire triaxial accelerometer data at 10 kHz', pt: 'Adquira dados de acelerômetro triaxial a 10 kHz', time: '4 min' },
      { step: 6, it: 'Generare report NVH con software acquisizione', en: 'Generate NVH report with acquisition software', pt: 'Gere relatório NVH com software de aquisição', time: '5 min' },
    ],
  },
};

// Highlights 3D fallback per ogni step di ogni impianto.
// Coordinate normalizzate (nx, ny, nz) ∈ [0..1] nel bounding box del modello 3D.
// Quando l'AI Gemini è disponibile, queste vengono SOSTITUITE dai punti suggeriti
// dall'AI in base al contesto del passo. Quando non c'è AI o c'è errore,
// servono come highlights statici di base così l'operatore vede comunque il punto.
const stepHighlights3D = {
  'BMW-SPART': [
    [{ label: 'MOLLA 18.5kN', nx: 0.5, ny: 0.4, nz: 0.5, color: '#ef4444', hint: 'Centra la molla sull\'asse della pressa' }],
    [{ label: 'AMMORTIZZATORE', nx: 0.5, ny: 0.6, nz: 0.5, color: '#a855f7', hint: 'Inserisci dall\'alto, allinea foro centrale' }],
    [{ label: 'SUPPORTO SUP.', nx: 0.5, ny: 0.92, nz: 0.5, color: '#f59e0b', hint: 'Coppia 120 Nm con chiave dinamometrica' }],
    [{ label: 'LASER BRACCIO', nx: 0.2, ny: 0.3, nz: 0.7, color: '#22c55e', hint: 'Verifica offset < 0.1 mm sul display' }],
    [{ label: 'SENSORE CORSA', nx: 0.5, ny: 0.45, nz: 0.85, color: '#06b6d4', hint: 'Connettore M12, orientamento freccia' }],
    [{ label: 'CIRCUITO OLIO', nx: 0.8, ny: 0.5, nz: 0.6, color: '#f97316', hint: 'Apri valvola, chiudi a 65°C max' }],
    [{ label: 'PLC S7-1500', nx: 0.15, ny: 0.85, nz: 0.2, color: '#60a5fa', hint: 'Avvia ciclo TEST_OK su HMI Comfort' }],
  ],
  'STELL-BETIM': [
    [{ label: 'LAMIERATO', nx: 0.5, ny: 0.45, nz: 0.5, color: '#f59e0b', hint: 'Appoggia, verifica perni di centraggio' }],
    [{ label: 'CLAMP PNEUM.', nx: 0.35, ny: 0.55, nz: 0.5, color: '#00d4aa', hint: '12 clamp in sequenza, 6 bar costanti' }],
    [{ label: 'STAFFAGGI', nx: 0.25, ny: 0.4, nz: 0.6, color: '#a855f7', hint: 'Comparatore: bolla a centro 0.01 mm' }],
    [{ label: 'ELETTRODI Cu-Cr', nx: 0.5, ny: 0.7, nz: 0.5, color: '#ef4444', hint: 'Verifica usura punte < 30%' }],
    [{ label: 'SALDATURA', nx: 0.5, ny: 0.6, nz: 0.5, color: '#f97316', hint: '12.5 kA, 200 ms, non muovere maschera' }],
    [{ label: 'CONTROLLO', nx: 0.7, ny: 0.55, nz: 0.5, color: '#22c55e', hint: 'Strappo 1500 N campione ogni 50 pz' }],
  ],
  'NKE-ALPI': [
    [{ label: 'PIATTAFORMA', nx: 0.5, ny: 0.1, nz: 0.5, color: '#00d4aa', hint: 'Veicolo allineato 0.0° su ruote anteriori' }],
    [{ label: 'TARGET 4.0m', nx: 0.5, ny: 0.7, nz: 0.95, color: '#ef4444', hint: 'Distanza 4000 mm ±5 mm dal paraurti' }],
    [{ label: 'TELECAMERA', nx: 0.5, ny: 0.5, nz: 0.7, color: '#f59e0b', hint: 'ECU connessa OBD-II, avvia routine CAL' }],
    [{ label: 'RADAR 77GHz', nx: 0.2, ny: 0.45, nz: 0.7, color: '#a855f7', hint: 'Tolleranza azimuth < 0.2°' }],
    [{ label: 'TEST LED', nx: 0.5, ny: 0.7, nz: 0.95, color: '#22c55e', hint: 'Pattern dinamico 30s a 2400 lux' }],
  ],
  'FCA-KRAGU': [
    [{ label: 'FIXTURE', nx: 0.5, ny: 0.5, nz: 0.5, color: '#a855f7', hint: 'Inserisci pezzo, clic sul perno di riferimento' }],
    [{ label: 'HMI', nx: 0.85, ny: 0.7, nz: 0.3, color: '#60a5fa', hint: 'Programma "P12" coppia 18 Nm ±0.5%' }],
    [{ label: 'AVVITATORE', nx: 0.55, ny: 0.85, nz: 0.5, color: '#00d4aa', hint: 'Desoutter CVI3 premi grilletto 2 sec' }],
    [{ label: 'POKA-YOKE', nx: 0.5, ny: 0.55, nz: 0.5, color: '#f59e0b', hint: 'Spia verde = sequenza corretta' }],
    [{ label: 'BARCODE', nx: 0.25, ny: 0.85, nz: 0.4, color: '#22c55e', hint: 'Scansiona DataMatrix, beep singolo OK' }],
  ],
  'IVECO-TO': [
    [{ label: 'PIANO TERMOSTAT.', nx: 0.5, ny: 0.15, nz: 0.5, color: '#00d4aa', hint: 'Attendi stabilizzazione 20°C ±0.5' }],
    [{ label: 'CALIBRO CL.0', nx: 0.3, ny: 0.55, nz: 0.5, color: '#a855f7', hint: 'Selezione da cassettiera, registro lotto' }],
    [{ label: 'CORSOIO MOBILE', nx: 0.5, ny: 0.55, nz: 0.5, color: '#f59e0b', hint: 'Movimento dolce, no forzature laterali' }],
    [{ label: 'NONIO DIGITALE', nx: 0.7, ny: 0.6, nz: 0.5, color: '#06b6d4', hint: 'Leggi ris. 0.01 mm, premi HOLD' }],
    [{ label: 'CONFORMITÀ', nx: 0.5, ny: 0.55, nz: 0.5, color: '#22c55e', hint: 'IT6 = entro tolleranza disegno' }],
  ],
  'STELL-MIRA': [
    [{ label: 'TELAIO ALIM.', nx: 0.5, ny: 0.2, nz: 0.5, color: '#a855f7', hint: 'Scivolo rulli, modanatura su guide' }],
    [{ label: 'LASER POSIZ.', nx: 0.4, ny: 0.6, nz: 0.7, color: '#ef4444', hint: 'Croce rossa centrata sul foro target' }],
    [{ label: 'VENTOSE', nx: 0.5, ny: 0.55, nz: 0.5, color: '#00d4aa', hint: 'Manometro -0.9 bar prima di sollevare' }],
    [{ label: 'ATTUATORE LIN.', nx: 0.65, ny: 0.65, nz: 0.5, color: '#f97316', hint: 'Corsa programmata 250 mm su HMI' }],
    [{ label: 'COMPRESSIONE', nx: 0.5, ny: 0.55, nz: 0.5, color: '#f59e0b', hint: '350 N per 8 sec, non rilasciare prima' }],
    [{ label: 'PLC CONTROLLO', nx: 0.15, ny: 0.85, nz: 0.3, color: '#22c55e', hint: 'LED verde "ADHESION OK"' }],
  ],
  'FCA-MELFI': [
    [{ label: 'GUIDA LINEARE', nx: 0.5, ny: 0.2, nz: 0.5, color: '#a855f7', hint: 'Slitta scorre senza giochi (< 0.01 mm)' }],
    [{ label: 'SUPPORTO ERGON.', nx: 0.2, ny: 0.55, nz: 0.5, color: '#06b6d4', hint: 'Manopola verde altezza spalla operatore' }],
    [{ label: 'BLOCC. RAPIDO', nx: 0.5, ny: 0.55, nz: 0.5, color: '#ef4444', hint: 'Leva in basso = 500 N applicati' }],
    [{ label: 'CERNIERE', nx: 0.7, ny: 0.7, nz: 0.5, color: '#f59e0b', hint: 'Sup→Inf, coppia 25 Nm secondo CAD' }],
    [{ label: 'SENSORE CONTATTO', nx: 0.7, ny: 0.5, nz: 0.6, color: '#00d4aa', hint: 'LED blu = posizione cerniera entro 0.05 mm' }],
    [{ label: 'TEST APERTURA', nx: 0.5, ny: 0.6, nz: 0.5, color: '#22c55e', hint: '5 cicli completi, nessun cigolio' }],
  ],
  'AUDI-ING': [
    [{ label: 'RULLI', nx: 0.5, ny: 0.15, nz: 0.5, color: '#a855f7', hint: 'Veicolo centrato, bloccaggio anteriore attivo' }],
    [{ label: 'ATTUATORI MTS', nx: 0.25, ny: 0.5, nz: 0.5, color: '#ef4444', hint: 'Profilo "ROAD-A2", corsa ±100 mm' }],
    [{ label: 'SERVOVALVOLE', nx: 0.75, ny: 0.5, nz: 0.5, color: '#00d4aa', hint: 'MOOG attive, sweep 0→50 Hz' }],
    [{ label: 'CELLA CARICO', nx: 0.5, ny: 0.45, nz: 0.5, color: '#f59e0b', hint: 'Lettura live max 100 kN, non superare' }],
    [{ label: 'ACCELEROMETRO', nx: 0.15, ny: 0.85, nz: 0.3, color: '#06b6d4', hint: 'Triassiale 10 kHz, RMS X/Y/Z' }],
    [{ label: 'REPORT NVH', nx: 0.85, ny: 0.85, nz: 0.3, color: '#22c55e', hint: 'Esporta CSV + grafico FFT' }],
  ],
};

// LEGACY: Highlights 2D per il viewport SVG (non più usati come overlay principale,
// mantenuti per il chip "3D: <label>" sotto al modello)
const stepHighlights = {
  'BMW-SPART': [
    { label: 'MOLLA 18.5kN', cx: 130, cy: 130, rx: 16, ry: 22, color: '#ef4444', hint: 'Centra la molla sulla pressa (asse verticale)' },
    { label: 'AMMORTIZZATORE', cx: 130, cy: 110, rx: 10, ry: 28, color: '#a855f7', hint: 'Inserisci dall\'alto, allinea con foro centrale' },
    { label: 'SUPPORTO SUP.', cx: 130, cy: 38, rx: 12, ry: 10, color: '#f59e0b', hint: 'Coppia 120 Nm — usa chiave dinamometrica' },
    { label: 'LASER BRACCIO', cx: 60, cy: 195, rx: 14, ry: 8, color: '#22c55e', hint: 'Verifica offset < 0.1 mm sul display' },
    { label: 'SENSORE CORSA', cx: 130, cy: 175, rx: 10, ry: 14, color: '#06b6d4', hint: 'Connettore M12 — orientamento freccia' },
    { label: 'CIRCUITO OLIO', cx: 195, cy: 185, rx: 14, ry: 8, color: '#f97316', hint: 'Apri valvola superiore, chiudi a 65°C max' },
    { label: 'PLC S7-1500', cx: 50, cy: 50, rx: 14, ry: 10, color: '#60a5fa', hint: 'Avvia ciclo TEST_OK su HMI Comfort' },
  ],
  'STELL-BETIM': [
    { label: 'LAMIERATO', cx: 130, cy: 140, rx: 22, ry: 18, color: '#f59e0b', hint: 'Appoggia, verifica perni di centraggio' },
    { label: 'CLAMP PNEUM.', cx: 110, cy: 100, rx: 8, ry: 8, color: '#00d4aa', hint: '12 clamp in sequenza, 6 bar costanti' },
    { label: 'STAFFAGGI', cx: 80, cy: 165, rx: 10, ry: 10, color: '#a855f7', hint: 'Comparatore: bolla a centro 0.01 mm' },
    { label: 'ELETTRODI Cu-Cr', cx: 130, cy: 135, rx: 6, ry: 8, color: '#ef4444', hint: 'Verifica usura punte < 30%' },
    { label: 'SALDATURA', cx: 130, cy: 130, rx: 10, ry: 10, color: '#f97316', hint: '12.5 kA, 200 ms — non muovere maschera' },
    { label: 'CONTROLLO', cx: 150, cy: 130, rx: 12, ry: 12, color: '#22c55e', hint: 'Strappo 1500 N — campione ogni 50 pz' },
  ],
  'NKE-ALPI': [
    { label: 'PIATTAFORMA', cx: 130, cy: 215, rx: 22, ry: 8, color: '#00d4aa', hint: 'Veicolo allineato 0.0° su ruote anteriori' },
    { label: 'TARGET 4.0m', cx: 130, cy: 80, rx: 14, ry: 12, color: '#ef4444', hint: 'Distanza 4000 mm ±5 mm dal paraurti' },
    { label: 'TELECAMERA', cx: 130, cy: 170, rx: 8, ry: 8, color: '#f59e0b', hint: 'ECU connessa OBD-II, avvia routine CAL' },
    { label: 'RADAR 77GHz', cx: 50, cy: 165, rx: 10, ry: 6, color: '#a855f7', hint: 'Tolleranza azimuth < 0.2°' },
    { label: 'TEST LED', cx: 130, cy: 80, rx: 16, ry: 14, color: '#22c55e', hint: 'Pattern dinamico — 30 sec a 2400 lux' },
  ],
  'FCA-KRAGU': [
    { label: 'FIXTURE', cx: 130, cy: 130, rx: 16, ry: 10, color: '#a855f7', hint: 'Inserisci pezzo — clic sul perno di riferimento' },
    { label: 'HMI', cx: 200, cy: 80, rx: 14, ry: 10, color: '#60a5fa', hint: 'Programma "P12" — coppia 18 Nm ±0.5%' },
    { label: 'AVVITATORE', cx: 145, cy: 70, rx: 8, ry: 12, color: '#00d4aa', hint: 'Desoutter CVI3 — premi grilletto 2 sec' },
    { label: 'POKA-YOKE', cx: 130, cy: 130, rx: 14, ry: 8, color: '#f59e0b', hint: 'Spia verde = sequenza corretta' },
    { label: 'BARCODE', cx: 75, cy: 45, rx: 10, ry: 8, color: '#22c55e', hint: 'Scansiona DataMatrix — beep singolo OK' },
  ],
  'IVECO-TO': [
    { label: 'PIANO TERMOSTAT.', cx: 130, cy: 200, rx: 22, ry: 8, color: '#00d4aa', hint: 'Attendi stabilizzazione 20°C ±0.5' },
    { label: 'CALIBRO CL.0', cx: 90, cy: 110, rx: 12, ry: 14, color: '#a855f7', hint: 'Selezione da cassettiera — registro lotto' },
    { label: 'CORSOIO MOBILE', cx: 130, cy: 110, rx: 14, ry: 10, color: '#f59e0b', hint: 'Movimento dolce, no forzature laterali' },
    { label: 'NONIO DIGITALE', cx: 175, cy: 90, rx: 12, ry: 8, color: '#06b6d4', hint: 'Leggi ris. 0.01 mm — premi HOLD' },
    { label: 'CONFORMITÀ', cx: 130, cy: 110, rx: 18, ry: 14, color: '#22c55e', hint: 'IT6 = entro tolleranza disegno' },
  ],
  'STELL-MIRA': [
    { label: 'TELAIO ALIM.', cx: 130, cy: 200, rx: 20, ry: 8, color: '#a855f7', hint: 'Scivolo rulli — modanatura su guide' },
    { label: 'LASER POSIZ.', cx: 100, cy: 100, rx: 14, ry: 6, color: '#ef4444', hint: 'Croce rossa centrata sul foro target' },
    { label: 'VENTOSE', cx: 130, cy: 130, rx: 12, ry: 8, color: '#00d4aa', hint: 'Manometro -0.9 bar prima di sollevare' },
    { label: 'ATTUATORE LIN.', cx: 160, cy: 90, rx: 10, ry: 14, color: '#f97316', hint: 'Corsa programmata 250 mm su HMI' },
    { label: 'COMPRESSIONE', cx: 130, cy: 140, rx: 12, ry: 10, color: '#f59e0b', hint: '350 N per 8 sec — non rilasciare prima' },
    { label: 'PLC CONTROLLO', cx: 50, cy: 50, rx: 14, ry: 10, color: '#22c55e', hint: 'LED verde "ADHESION OK" — passa al pz successivo' },
  ],
  'FCA-MELFI': [
    { label: 'GUIDA LINEARE', cx: 130, cy: 200, rx: 22, ry: 8, color: '#a855f7', hint: 'Slitta scorre senza giochi (< 0.01 mm)' },
    { label: 'SUPPORTO ERGON.', cx: 70, cy: 100, rx: 12, ry: 10, color: '#06b6d4', hint: 'Manopola verde — altezza spalla operatore' },
    { label: 'BLOCC. RAPIDO', cx: 130, cy: 130, rx: 10, ry: 8, color: '#ef4444', hint: 'Leva in basso = 500 N applicati' },
    { label: 'CERNIERE', cx: 175, cy: 90, rx: 10, ry: 10, color: '#f59e0b', hint: 'Sup→Inf, coppia 25 Nm secondo CAD' },
    { label: 'SENSORE CONTATTO', cx: 175, cy: 130, rx: 8, ry: 8, color: '#00d4aa', hint: 'LED blu = posizione cerniera entro 0.05 mm' },
    { label: 'TEST APERTURA', cx: 130, cy: 110, rx: 18, ry: 14, color: '#22c55e', hint: '5 cicli completi — nessun cigolio' },
  ],
  'AUDI-ING': [
    { label: 'RULLI', cx: 130, cy: 200, rx: 22, ry: 10, color: '#a855f7', hint: 'Veicolo centrato — bloccaggio anteriore attivo' },
    { label: 'ATTUATORI MTS', cx: 80, cy: 130, rx: 14, ry: 12, color: '#ef4444', hint: 'Profilo "ROAD-A2" — corsa ±100 mm' },
    { label: 'SERVOVALVOLE', cx: 180, cy: 130, rx: 12, ry: 8, color: '#00d4aa', hint: 'MOOG attive — sweep 0→50 Hz' },
    { label: 'CELLA CARICO', cx: 130, cy: 150, rx: 12, ry: 8, color: '#f59e0b', hint: 'Lettura live max 100 kN — non superare' },
    { label: 'ACCELEROMETRO', cx: 50, cy: 50, rx: 12, ry: 8, color: '#06b6d4', hint: 'Triassiale 10 kHz — RMS X/Y/Z' },
    { label: 'REPORT NVH', cx: 200, cy: 50, rx: 14, ry: 10, color: '#22c55e', hint: 'Esporta CSV + grafico FFT' },
  ],
};

// eslint-disable-next-line no-unused-vars
function ARModelLegacy({ plantId, currentStep }) {
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

      {plantId === 'IVECO-TO' && <>
        <rect x="30" y="195" width="200" height="20" rx="3" fill="rgba(0,212,170,0.04)" stroke="#00d4aa" strokeWidth="0.6" opacity="0.25" />
        <rect x="60" y="80" width="60" height="50" rx="3" fill="rgba(168,85,247,0.04)" stroke="#a855f7" strokeWidth="0.8" opacity="0.25" />
        <rect x="115" y="100" width="40" height="20" rx="2" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="0.8" opacity="0.3" />
        <rect x="155" y="80" width="40" height="20" rx="2" fill="rgba(6,182,212,0.05)" stroke="#06b6d4" strokeWidth="0.8" opacity="0.3" />
        {Array.from({ length: 5 }, (_, i) => <line key={`mk${i}`} x1={70 + i * 15} y1="195" x2={70 + i * 15} y2="200" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />)}
      </>}

      {plantId === 'STELL-MIRA' && <>
        <polygon points="130,30 220,80 220,180 130,225 40,180 40,80" fill="url(#arHoloGrad)" stroke="#00d4aa" strokeWidth="0.5" opacity="0.2" />
        <rect x="100" y="190" width="60" height="20" rx="2" fill="rgba(168,85,247,0.04)" stroke="#a855f7" strokeWidth="0.6" opacity="0.25" />
        <line x1="100" y1="100" x2="160" y2="100" stroke="#ef4444" strokeWidth="0.6" opacity="0.3" strokeDasharray="3 2" />
        <line x1="130" y1="80" x2="130" y2="120" stroke="#ef4444" strokeWidth="0.6" opacity="0.3" strokeDasharray="3 2" />
        {[[120,125],[130,125],[140,125]].map(([x,y], i) => <circle key={`vt${i}`} cx={x} cy={y} r="3" fill="rgba(0,212,170,0.06)" stroke="#00d4aa" strokeWidth="0.8" opacity="0.3" />)}
        <rect x="148" y="78" width="22" height="32" rx="2" fill="rgba(249,115,22,0.04)" stroke="#f97316" strokeWidth="0.8" opacity="0.25" />
        <rect x="40" y="40" width="22" height="20" rx="2" fill="rgba(34,197,94,0.05)" stroke="#22c55e" strokeWidth="0.6" opacity="0.25" />
      </>}

      {plantId === 'FCA-MELFI' && <>
        <rect x="30" y="195" width="200" height="14" rx="2" fill="rgba(168,85,247,0.04)" stroke="#a855f7" strokeWidth="0.6" opacity="0.25" />
        <rect x="55" y="85" width="32" height="32" rx="3" fill="rgba(6,182,212,0.04)" stroke="#06b6d4" strokeWidth="0.8" opacity="0.25" />
        <rect x="100" y="100" width="60" height="60" rx="3" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="0.6" opacity="0.25" />
        <circle cx="170" cy="85" r="6" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.3" />
        <circle cx="170" cy="135" r="6" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.3" />
        <line x1="100" y1="115" x2="170" y2="92" stroke="#94a3b8" strokeWidth="0.6" opacity="0.2" />
        <line x1="100" y1="150" x2="170" y2="135" stroke="#94a3b8" strokeWidth="0.6" opacity="0.2" />
      </>}

      {plantId === 'AUDI-ING' && <>
        <ellipse cx="130" cy="205" rx="90" ry="12" fill="rgba(168,85,247,0.04)" stroke="#a855f7" strokeWidth="0.6" opacity="0.25" />
        <circle cx="80" cy="200" r="10" fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.3" />
        <circle cx="180" cy="200" r="10" fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.3" />
        <rect x="65" y="115" width="32" height="40" rx="3" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="0.8" opacity="0.25" />
        <rect x="160" y="120" width="30" height="22" rx="3" fill="rgba(0,212,170,0.04)" stroke="#00d4aa" strokeWidth="0.8" opacity="0.25" />
        <rect x="115" y="135" width="30" height="22" rx="3" fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="0.6" opacity="0.25" />
        <rect x="35" y="35" width="30" height="20" rx="2" fill="rgba(6,182,212,0.04)" stroke="#06b6d4" strokeWidth="0.6" opacity="0.25" />
        <rect x="185" y="35" width="35" height="22" rx="2" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="0.6" opacity="0.25" />
      </>}

      {active && <>
        {/* Pulsazione esterna molto sottile (1px in più, opacity bassa) */}
        <ellipse cx={active.cx} cy={active.cy} rx={active.rx + 4} ry={active.ry + 4} fill="none" stroke={active.color} strokeWidth="0.6" opacity="0.2" strokeDasharray="2 2">
          <animate attributeName="rx" values={`${active.rx + 3};${active.rx + 6};${active.rx + 3}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="ry" values={`${active.ry + 3};${active.ry + 6};${active.ry + 3}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Cerchio principale piccolo e nitido */}
        <ellipse cx={active.cx} cy={active.cy} rx={active.rx} ry={active.ry} fill={`${active.color}15`} stroke={active.color} strokeWidth="1.5" opacity="0.9" filter="url(#activeGlow)">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Crocino centrale per puntamento preciso */}
        <line x1={active.cx - 3} y1={active.cy} x2={active.cx + 3} y2={active.cy} stroke={active.color} strokeWidth="1" opacity="0.9" />
        <line x1={active.cx} y1={active.cy - 3} x2={active.cx} y2={active.cy + 3} stroke={active.color} strokeWidth="1" opacity="0.9" />
        {/* Etichetta + linea callout */}
        <line x1={active.cx + active.rx + 2} y1={active.cy - active.ry} x2={active.cx + active.rx + 28} y2={active.cy - active.ry - 16} stroke={active.color} strokeWidth="1.2" opacity="0.85" />
        <rect x={active.cx + active.rx + 24} y={active.cy - active.ry - 26} width={active.label.length * 5.2 + 8} height="14" rx="3" fill={`${active.color}25`} stroke={active.color} strokeWidth="1" opacity="0.95" />
        <text x={active.cx + active.rx + 28 + active.label.length * 2.6} y={active.cy - active.ry - 16} textAnchor="middle" fill={active.color} fontSize="6" fontFamily="monospace" fontWeight="bold">{active.label}</text>
        <text x={active.cx} y={active.cy + active.ry + 12} textAnchor="middle" fill={active.color} fontSize="5.5" fontFamily="monospace" fontWeight="bold" opacity="0.75">▼ PASSO {currentStep + 1}</text>
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

  const [aiStepResult, setAiStepResult] = useState(null);
  const [aiStepRunning, setAiStepRunning] = useState(false);
  const [aiStepError, setAiStepError] = useState(null);
  const [autoAI, setAutoAI] = useState(true);  // ricalcolo automatico ad ogni step
  const [autoRotate, setAutoRotate] = useState(true);

  const { detectTrainingStep, hasApiKey, error: googleAIError } = useGoogleAI();

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

  // Rileva passo attuale tramite Gemini Vision in tempo reale.
  // expectedStepArg permette di passare il passo target esplicitamente,
  // utile per l'auto-trigger che parte prima dello state aggiornamento.
  const runDetectStep = async (expectedStepArg) => {
    setAiStepRunning(true);
    setAiStepError(null);

    if (!hasApiKey) {
      setAiStepError('VITE_GOOGLE_AI_API_KEY mancante in .env.local');
      setAiStepRunning(false);
      return;
    }

    try {
      const referenceImage = currentImage || plantImages[selectedPlant.id]?.[0];
      if (!referenceImage) {
        setAiStepError('Immagine di riferimento non disponibile');
        setAiStepRunning(false);
        return;
      }

      const targetStep = expectedStepArg ?? (currentStep + 1);

      const result = await detectTrainingStep(referenceImage, {
        component: proc.component,
        steps: proc.steps,
        expectedStep: targetStep,
      });

      if (!result) {
        setAiStepError(googleAIError || 'Errore di rete o API non disponibile');
        setAiStepRunning(false);
        return;
      }
      if (result.parseError) {
        setAiStepError('Risposta AI non interpretabile');
        setAiStepRunning(false);
        return;
      }

      setAiStepResult(result);
      // L'AI conferma lo step ma NON sovrascriviamo l'UI se l'utente è
      // navigato manualmente — l'AI risponde sempre per il passo target.
    } catch (err) {
      setAiStepError(err.message || 'Errore durante rilevamento AI');
    } finally {
      setAiStepRunning(false);
    }
  };

  // Reset stato quando cambia impianto
  useEffect(() => {
    setCurrentStep(0);
    setTranslated(false);
    setShowVideo(false);
    setAiStepResult(null);
    setAiStepError(null);
  }, [selectedPlant]);

  // Auto-trigger AI ad ogni cambio step (debounced 350ms per evitare spam
  // se l'utente clicca rapidamente "Successivo" più volte di fila).
  useEffect(() => {
    if (!autoAI || !hasApiKey || showVideo) return;
    const targetStep = currentStep + 1;
    const timer = setTimeout(() => {
      runDetectStep(targetStep);
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, selectedPlant.id, autoAI, hasApiKey, showVideo]);

  // Highlight 3D correnti: AI > fallback statico
  const fallback3D = (stepHighlights3D[selectedPlant.id]?.[currentStep]) || [];
  const aiHighlights3D = aiStepResult?.highlights?.filter(h => typeof h.nx === 'number') || [];
  const active3DHighlights = (aiHighlights3D.length > 0 ? aiHighlights3D : fallback3D).map((h, i) => ({
    id: `${selectedPlant.id}-${currentStep}-${i}`,
    nx: h.nx ?? 0.5,
    ny: h.ny ?? 0.5,
    nz: h.nz ?? 0.5,
    label: h.label,
    hint: h.hint,
    color: h.color,
  }));

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
            <div className="relative" style={{ minHeight: '480px', background: '#040d1a' }}>
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
                <div className="absolute inset-0">
                  {/* Digital Twin 3D con highlight 3D ancorati al modello — seguono zoom/rotazione */}
                  <HologramViewer
                    machineId={selectedPlant.machineId}
                    highlights={active3DHighlights}
                    autoRotate={autoRotate}
                    onToggleRotate={() => setAutoRotate(!autoRotate)}
                    style={{ width: '100%', height: '100%' }}
                  />

                  {/* Indicatore REC */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[0.55rem] text-red-400 font-mono font-bold">REC · LIVE</span>
                  </div>

                  {/* Etichetta Gemello Digitale */}
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className="text-[0.6rem] text-[#67e8f9] font-mono bg-[rgba(0,8,22,0.7)] px-2 py-1 rounded border border-[rgba(0,200,255,0.3)]">
                      OLOGRAMMA 3D · PASSO {currentStep + 1}/{totalSteps}
                    </span>
                  </div>

                  {/* Controlli AI + 3D */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 flex-wrap max-w-[60%]">
                    <button onClick={() => runDetectStep()} disabled={aiStepRunning || !hasApiKey}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: aiStepRunning ? 'rgba(168,85,247,0.2)' : aiStepResult ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #4285f4, #1a73e8)',
                        border: `1px solid ${aiStepRunning ? 'rgba(168,85,247,0.4)' : 'rgba(66,133,244,0.4)'}`,
                        color: aiStepRunning ? '#a855f7' : aiStepResult ? '#22c55e' : '#fff',
                        opacity: hasApiKey ? 1 : 0.5,
                      }}
                      title={hasApiKey ? 'Forza analisi Gemini sul passo corrente' : 'API Key mancante'}>
                      {aiStepRunning ? <><Loader2 size={11} className="animate-spin" /> Gemini analizza...</> : <><Sparkles size={11} /> {aiStepResult ? 'Riesegui AI' : 'Rileva con AI'}</>}
                    </button>
                    <button onClick={() => setAutoAI(!autoAI)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all"
                      style={{
                        background: autoAI ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.1)',
                        border: `1px solid ${autoAI ? 'rgba(34,197,94,0.4)' : 'rgba(148,163,184,0.3)'}`,
                        color: autoAI ? '#22c55e' : '#94a3b8',
                      }}
                      title="Quando ON, l'AI ricalcola automaticamente i punti su ogni passo">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: autoAI ? '#22c55e' : '#94a3b8' }} />
                      AUTO-AI {autoAI ? 'ON' : 'OFF'}
                    </button>
                    <button onClick={() => setAutoRotate(!autoRotate)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.6rem] font-bold transition-all"
                      style={{
                        background: autoRotate ? 'rgba(96,165,250,0.15)' : 'rgba(148,163,184,0.1)',
                        border: `1px solid ${autoRotate ? 'rgba(96,165,250,0.4)' : 'rgba(148,163,184,0.3)'}`,
                        color: autoRotate ? '#60a5fa' : '#94a3b8',
                      }}
                      title="Rotazione automatica del modello 3D">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: autoRotate ? '#60a5fa' : '#94a3b8' }} />
                      ROT {autoRotate ? 'ON' : 'OFF'}
                    </button>
                    {aiStepError && (
                      <span className="text-[0.55rem] font-mono px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                        ⚠ {aiStepError.slice(0, 40)}
                      </span>
                    )}
                  </div>

                  {/* Info basso */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {aiStepResult?.confidence && (
                      <span className="text-[0.6rem] font-mono px-2 py-1 rounded" style={{ background: 'rgba(66,133,244,0.15)', color: '#4285f4' }}>
                        Gemini · {aiStepResult.confidence}%
                      </span>
                    )}
                    <button onClick={() => setShowVideo(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
                      <Play size={12} /> Video Tutorial
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Step Guidance dynamic from Gemini */}
            {aiStepResult?.stepGuidance && (
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(66,133,244,0.05)', borderTop: '1px solid rgba(66,133,244,0.2)' }}>
                <Sparkles size={12} className="text-blue-400 flex-shrink-0" />
                <span className="text-[0.7rem] flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong style={{ color: '#4285f4' }}>Gemini AI:</strong> {aiStepResult.stepGuidance}
                </span>
              </div>
            )}


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
              {active3DHighlights.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    background: `${active3DHighlights[0].color}15`,
                    border: `1px solid ${active3DHighlights[0].color}40`,
                    color: active3DHighlights[0].color,
                  }}>
                  <Box size={14} /> 3D: {active3DHighlights[0].label}
                  {active3DHighlights.length > 1 && <span className="opacity-60">+{active3DHighlights.length - 1}</span>}
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