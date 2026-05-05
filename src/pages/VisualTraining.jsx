import { useState, useEffect, useRef } from 'react';
import { Eye, Clock, ChevronRight, ChevronLeft, Target, CheckCircle, Play, Globe, Phone, Box, Loader2, Sparkles, Lock, Unlock, MessageCircle, Send } from 'lucide-react';
import AlertBar from '../components/AlertBar';
import HologramViewer from '../components/HologramViewer';
import { useGoogleAI } from '../hooks/useGoogleAI';

const plants = [
  { id: 'BMW-SPART', name: 'Ganci di Sollevamento', country: 'USA', lang: 'EN', asProduct: 'Ganci Sollevamento', machineId: 'adas' },
  { id: 'STELL-BETIM', name: 'Banchi di Assemblaggio e Avvitatura', country: 'Brasile', lang: 'PT', asProduct: 'Banchi Avvitatura', machineId: 'sospensioni' },
  { id: 'NKE-ALPI', name: 'Attrezzi di Montaggio Parti Mobili (Ferratura)', country: 'Italia', lang: 'IT', asProduct: 'Attrezzi Montaggio', machineId: 'avvitatura' },
  { id: 'FCA-KRAGU', name: 'Linea Assemblaggio Sospensioni PHEV', country: 'Serbia', lang: 'EN', asProduct: 'Linea Sospensioni', machineId: 'calibri' },
  { id: 'IVECO-TO', name: 'Impianti di Applicazione e Compressione Sigle e Modanature su Veicolo', country: 'Italia', lang: 'IT', asProduct: 'Impianti Sigle', machineId: 'sigle' },
  { id: 'STELL-MIRA', name: 'Maschere di Bloccaggio e Saldatura Lamierati', country: 'Italia', lang: 'IT', asProduct: 'Maschere Saldatura', machineId: 'montaggio' },
  { id: 'FCA-MELFI', name: 'Calibri di Controllo', country: 'Italia', lang: 'IT', asProduct: 'Calibri Controllo', machineId: 'simulazione' },
  { id: 'AUDI-ING', name: 'Banchi di Calibrazione Sistemi ADAS', country: 'Germania', lang: 'EN', asProduct: 'Banchi Calibrazione ADAS', machineId: 'maschera' },
];


const plantProcedures = {
  'BMW-SPART': {
    videoId: 'oSFZvBm4HFA',
    component: 'Linea Assemblaggio Sospensioni PHEV',
    cadOverlay: 'Linea Assemblaggio Sospensioni PHEV — Modello CAD v14.2',
    steps: [
      { step: 1, it: 'Caricare molla elicoidale sulla pressa idraulica (forza pressa 18.5 kN ±0.2 kN) — centrare sull\'asse verticale, verificare assenza di torsioni', en: 'Load coil spring onto hydraulic press (18.5 kN ±0.2 kN) — center on vertical axis, check no torsion', pt: 'Carregar mola helicoidal na prensa hidráulica (18.5 kN ±0.2 kN) — centralizar no eixo vertical', time: '2 min' },
      { step: 2, it: 'Inserire stelo ammortizzatore nel corpo pressa dal basso, allineare foro centrale Ø42 mm — tolleranza assiale ±0.5 mm', en: 'Insert shock absorber rod into press body from below, align central bore Ø42 mm — axial tolerance ±0.5 mm', pt: 'Inserir haste do amortecedor no corpo da prensa, alinhar furo central Ø42 mm', time: '3 min' },
      { step: 3, it: 'Serrare dado supporto superiore con chiave dinamometrica a 120 Nm (±2%) — sequenza a croce, 3 passaggi progressivi', en: 'Tighten upper mount nut to 120 Nm (±2%) — cross pattern, 3 progressive passes', pt: 'Apertar porca do suporte superior a 120 Nm (±2%) — sequência em cruz, 3 passagens', time: '3 min' },
      { step: 4, it: 'Verificare allineamento braccio con sistema laser integrato — offset max 0.1 mm su asse X e Y, registrare su foglio controllo', en: 'Verify arm alignment with integrated laser system — max offset 0.1 mm on X and Y axis, record on control sheet', pt: 'Verificar alinhamento do braço com sistema laser — offset máx 0.1 mm nos eixos X e Y', time: '4 min' },
      { step: 5, it: 'Collegare sensore corsa ammortizzatore (connettore M12×1, 4 pin) — range operativo 0–320 mm, orientare freccia verso l\'alto', en: 'Connect stroke sensor (M12×1, 4-pin connector) — operating range 0–320 mm, arrow pointing up', pt: 'Conectar sensor de curso (conector M12×1, 4 pinos) — faixa 0–320 mm, seta para cima', time: '2 min' },
      { step: 6, it: 'Riempire circuito olio assestamento tramite valvola 3/8" — volume 0.8 L, temperatura olio max 65°C, chiudere valvola sfera al raggiungimento', en: 'Fill settling oil circuit via 3/8" valve — volume 0.8 L, max oil temp 65°C, close ball valve on reaching temp', pt: 'Preencher circuito de óleo via válvula 3/8" — volume 0.8 L, temperatura máx 65°C', time: '3 min' },
      { step: 7, it: 'Avviare ciclo TEST_OK su HMI Siemens Comfort Panel — PLC S7-1500 esegue 3 cicli completi, verificare spia verde e assenza allarmi', en: 'Start TEST_OK cycle on Siemens Comfort Panel HMI — S7-1500 PLC runs 3 full cycles, check green light and no alarms', pt: 'Iniciar ciclo TEST_OK no painel HMI Siemens Comfort — PLC S7-1500 executa 3 ciclos completos', time: '4 min' },
    ],
  },
  'STELL-BETIM': {
    videoId: 'vsSfa-enwgw',
    component: 'Maschera Bloccaggio Lamierati M-200',
    cadOverlay: 'Maschera Bloccaggio e Saldatura Lamierati — Modello CAD v2.8',
    steps: [
      { step: 1, it: 'Appoggiare il lamierato sui 3 perni di centraggio Ø12 mm — verificare flush ±0.3 mm con piano di riferimento', en: 'Rest sheet metal on 3 Ø12 mm locating pins — verify flush ±0.3 mm with reference plane', pt: 'Apoiar chapa nos 3 pinos de centragem Ø12 mm — verificar flush ±0.3 mm', time: '2 min' },
      { step: 2, it: 'Attivare i 12 clamp pneumatici in sequenza SX→DX a 6 bar costanti — udire il clic di chiusura di ciascun clamp', en: 'Activate 12 pneumatic clamps in L→R sequence at constant 6 bar — listen for closure click on each clamp', pt: 'Ativar 12 grampos pneumáticos em sequência E→D a 6 bar constantes', time: '3 min' },
      { step: 3, it: 'Verificare allineamento staffaggi con comparatore centesimale — bolla a zero, tolleranza ±0.01 mm su tutti i riferimenti', en: 'Check jig alignment with dial indicator — zero bubble, ±0.01 mm tolerance on all reference points', pt: 'Verificar alinhamento dos gabaritos com comparador centesimal — ±0.01 mm', time: '5 min' },
      { step: 4, it: 'Inserire punte elettrodi Cu-Cr (Ø6 mm, usura < 30%) — avviare trasformatore MFDC 50 Hz, precaricare a 1.5 kN', en: 'Insert Cu-Cr electrode tips (Ø6 mm, wear < 30%) — start MFDC 50 Hz transformer, preload to 1.5 kN', pt: 'Inserir pontas de eletrodo Cu-Cr (Ø6 mm, desgaste < 30%) — iniciar transformador MFDC 50 Hz', time: '4 min' },
      { step: 5, it: 'Eseguire ciclo saldatura a punti: 12.5 kA × 200 ms, forza 4 kN — rispettare ISO 14373, mantenere struttura ferma durante impulso', en: 'Execute spot welding cycle: 12.5 kA × 200 ms, force 4 kN — per ISO 14373, keep structure still during pulse', pt: 'Executar ciclo de solda: 12.5 kA × 200 ms, força 4 kN — conforme ISO 14373', time: '8 min' },
      { step: 6, it: 'Eseguire controllo visivo punti saldatura e prova a strappo (min 1500 N) su campione ogni 50 pezzi prodotti', en: 'Visual inspection of weld spots and peel test (min 1500 N) on sample every 50 produced parts', pt: 'Inspeção visual dos pontos de solda e teste de arrancamento (mín 1500 N) a cada 50 peças', time: '4 min' },
    ],
  },
  'NKE-ALPI': {
    videoId: 'h42JMHcLdIk',
    component: 'Banco Calibrazione ADAS BC-300',
    cadOverlay: 'Banco Calibrazione Sistemi ADAS — Modello CAD v3.1',
    steps: [
      { step: 1, it: 'Posizionare veicolo su piattaforma con piatti allineatori — asse anteriore a 0.0°, verificare livella bolla su 4 punti di contatto', en: 'Position vehicle on platform with aligning plates — front axle at 0.0°, check bubble level on 4 contact points', pt: 'Posicionar veículo na plataforma com pratos alinhadores — eixo dianteiro a 0.0°', time: '5 min' },
      { step: 2, it: 'Posizionare target riflettente motorizzato a 4000 mm ±5 mm dal paraurti anteriore — altezza target = altezza telecamera ±10 mm', en: 'Position motorized reflective target at 4000 mm ±5 mm from front bumper — target height = camera height ±10 mm', pt: 'Posicionar alvo refletivo motorizado a 4000 mm ±5 mm do pára-choque', time: '3 min' },
      { step: 3, it: 'Connettere OBD-II, avviare routine CAL_CAM_01 sull\'ECU — attesa calibrazione ~8 min, non muovere veicolo durante il processo', en: 'Connect OBD-II, start CAL_CAM_01 routine on ECU — calibration wait ~8 min, do not move vehicle during process', pt: 'Conectar OBD-II, iniciar rotina CAL_CAM_01 na ECU — aguardar ~8 min', time: '8 min' },
      { step: 4, it: 'Verificare allineamento radar LRR 77 GHz: azimuth < 0.2°, elevazione ±0.1° — regolare viti di targeting se fuori tolleranza', en: 'Verify LRR 77 GHz radar alignment: azimuth < 0.2°, elevation ±0.1° — adjust targeting screws if out of tolerance', pt: 'Verificar alinhamento do radar LRR 77 GHz: azimute < 0.2°, elevação ±0.1°', time: '6 min' },
      { step: 5, it: 'Avviare test strada virtuale con pannello LED pattern: 2400 lux costanti, 30 secondi, verificare output diagnostico ECU', en: 'Start virtual road test with LED pattern panel: constant 2400 lux, 30 seconds, verify ECU diagnostic output', pt: 'Iniciar teste de estrada virtual com painel LED: 2400 lux constantes, 30 segundos', time: '10 min' },
    ],
  },
  'FCA-KRAGU': {
    videoId: 'wjfg-hrPmsM',
    component: 'Banco Assemblaggio Avvitatura BAV-100',
    cadOverlay: 'Banco Assemblaggio e Avvitatura — Modello CAD v1.9',
    steps: [
      { step: 1, it: 'Inserire componente nella fixture dedicata — clic sul perno Ø8 di riferimento, verificare flush con piano ±0.2 mm', en: 'Insert component into dedicated fixture — click onto Ø8 reference pin, check flush with plane ±0.2 mm', pt: 'Inserir componente na fixação dedicada — encaixar no pino de referência Ø8 mm', time: '2 min' },
      { step: 2, it: 'Selezionare programma P12 su HMI touchscreen — coppia target 18 Nm ±0.5%, velocità 450 rpm, angolo max 720°', en: 'Select program P12 on touchscreen HMI — target torque 18 Nm ±0.5%, speed 450 rpm, max angle 720°', pt: 'Selecionar programa P12 no HMI touchscreen — torque alvo 18 Nm ±0.5%, velocidade 450 rpm', time: '1 min' },
      { step: 3, it: 'Avvitare con Desoutter CVI3 (braccio bilanciato pneumatico) — grilletto continuo 2 s, non rilasciare prima del beep di conferma', en: 'Screw with Desoutter CVI3 (pneumatic balanced arm) — continuous trigger 2 s, do not release before confirmation beep', pt: 'Apertar com Desoutter CVI3 (braço balanceado pneumático) — gatilho contínuo 2 s', time: '4 min' },
      { step: 4, it: 'Verificare spia Poka-Yoke: verde = sequenza e coppia OK, rossa = stop forzato e rework obbligatorio prima di procedere', en: 'Check Poka-Yoke light: green = sequence and torque OK, red = forced stop, rework required before proceeding', pt: 'Verificar luz Poka-Yoke: verde = sequência e torque OK, vermelho = parada forçada', time: '3 min' },
      { step: 5, it: 'Scansionare DataMatrix con lettore Cognex fisso — beep singolo = tracciabilità OK, doppio beep = errore, ripetere scansione', en: 'Scan DataMatrix with fixed Cognex reader — single beep = traceability OK, double beep = error, repeat scan', pt: 'Escanear DataMatrix com leitor Cognex fixo — bipe simples = rastreabilidade OK', time: '1 min' },
    ],
  },
  'IVECO-TO': {
    videoId: 'wjfg-hrPmsM',
    component: 'Calibri di Controllo Dimensionale CC-200',
    cadOverlay: 'Calibri di Controllo — Modello CAD v2.4',
    steps: [
      { step: 1, it: 'Posare il pezzo sul piano termostatato (20°C ±0.5°C) — attendere stabilizzazione termica segnalata dalla spia verde (min 5 min)', en: 'Place part on thermostatically controlled plate (20°C ±0.5°C) — wait for thermal stabilization indicated by green light (min 5 min)', pt: 'Colocar peça no plano termostático (20°C ±0.5°C) — aguardar estabilização térmica (mín 5 min)', time: '2 min' },
      { step: 2, it: 'Selezionare calibro temprato Classe 0 corrispondente alla quota nominale — registrare n° lotto sul foglio di controllo qualità', en: 'Select Class 0 hardened gauge matching nominal dimension — record batch number on quality control sheet', pt: 'Selecionar calibre temperado Classe 0 correspondente à cota nominal — registrar n° lote', time: '1 min' },
      { step: 3, it: 'Misurare quota con corsoio mobile (risoluzione 0.002 mm) — movimento lento e uniforme, forza di contatto < 0.5 N', en: 'Measure dimension with sliding jaw (resolution 0.002 mm) — slow uniform movement, contact force < 0.5 N', pt: 'Medir cota com cursor deslizante (resolução 0.002 mm) — movimento lento e uniforme', time: '3 min' },
      { step: 4, it: 'Leggere valore su display nonio digitale e premere HOLD — trascrivere sul certificato di misura con firma operatore', en: 'Read value on digital vernier display and press HOLD — transcribe to measurement certificate with operator signature', pt: 'Ler valor no display do nônio digital, pressionar HOLD — registrar no certificado de medição', time: '2 min' },
      { step: 5, it: 'Confrontare valore misurato con tolleranza ISO 286 IT6 — per Ø18: campo ±0.011 mm; apporre timbro CONFORME o SCARTO', en: 'Compare measured value with ISO 286 IT6 tolerance — for Ø18: range ±0.011 mm; stamp CONFORM or REJECT', pt: 'Comparar valor medido com tolerância ISO 286 IT6 — para Ø18: faixa ±0.011 mm', time: '2 min' },
    ],
  },
  'STELL-MIRA': {
    videoId: 'h42JMHcLdIk',
    component: 'Impianto Sigle e Modanature SM-150',
    cadOverlay: 'Impianti Applicazione Sigle e Modanature — Modello CAD v3.7',
    steps: [
      { step: 1, it: 'Caricare modanatura sul telaio di alimentazione — guide rulli parallele al bordo veicolo, allineamento ±1 mm', en: 'Load molding onto feed frame — roller guides parallel to vehicle edge, alignment ±1 mm', pt: 'Carregar moldura no quadro de alimentação — guias de rolos paralelas à borda do veículo', time: '2 min' },
      { step: 2, it: 'Allineare laser di posizionamento (precisione ±0.2 mm) — croce rossa centrata sul foro target Ø6 mm della carrozzeria', en: 'Align positioning laser (precision ±0.2 mm) — red cross centered on Ø6 mm target hole in bodywork', pt: 'Alinhar laser de posicionamento (precisão ±0.2 mm) — cruz vermelha centrada no furo alvo Ø6 mm', time: '3 min' },
      { step: 3, it: 'Attivare le 6 ventose di presa a -0.9 bar — manometro deve stabilizzarsi sotto -0.85 bar, spia rossa prima del sollevamento', en: 'Activate 6 suction cups at -0.9 bar — gauge must stabilize below -0.85 bar, red light before lifting', pt: 'Ativar 6 ventosas a -0.9 bar — manômetro deve estabilizar abaixo de -0.85 bar', time: '2 min' },
      { step: 4, it: 'Avviare attuatore lineare (corsa 250 mm, velocità 80 mm/s) — verifica posizione finale su encoder integrato ±0.5 mm', en: 'Start linear actuator (stroke 250 mm, speed 80 mm/s) — verify end position on integrated encoder ±0.5 mm', pt: 'Acionar atuador linear (curso 250 mm, velocidade 80 mm/s) — verificar posição final no encoder', time: '3 min' },
      { step: 5, it: 'Comprimere modanatura sul veicolo: forza 350 N per 8 s — non rilasciare prima del beep OK, temperatura adesivo 23°C ±2°C', en: 'Compress molding onto vehicle: 350 N for 8 s — do not release before OK beep, adhesive temperature 23°C ±2°C', pt: 'Comprimir moldura no veículo: 350 N por 8 s — não soltar antes do bipe OK', time: '1 min' },
      { step: 6, it: 'Verificare adesione su PLC controllo (ciclo scan 8 ms) — LED verde "ADHESION OK" e valore forza > 320 N confermati', en: 'Verify adhesion on control PLC (8 ms scan cycle) — green LED "ADHESION OK" and force value > 320 N confirmed', pt: 'Verificar adesão no PLC de controle (ciclo de scan 8 ms) — LED verde "ADHESION OK"', time: '2 min' },
    ],
  },
  'FCA-MELFI': {
    videoId: 'vsSfa-enwgw',
    component: 'Attrezzo Ferratura Parti Mobili AFP-300',
    cadOverlay: 'Attrezzi Montaggio Parti Mobili — Modello CAD v4.1',
    steps: [
      { step: 1, it: 'Posizionare porta sulla guida lineare di precisione (gioco max 0.01 mm) — verificare scorrimento senza resistenze con comparatore', en: 'Position door on precision linear guide (max clearance 0.01 mm) — verify smooth sliding with dial indicator', pt: 'Posicionar porta na guia linear de precisão (folga máx 0.01 mm)', time: '3 min' },
      { step: 2, it: 'Regolare supporto ergonomico in altezza — manopola verde, quota gomito operatore ±50 mm, bloccare con dado M16', en: 'Adjust ergonomic support height — green knob, operator elbow height ±50 mm, lock with M16 nut', pt: 'Ajustar suporte ergonômico em altura — manopola verde, cota cotovelo ±50 mm', time: '2 min' },
      { step: 3, it: 'Attivare bloccaggio rapido (500 N) — portare leva in basso fino al clic di fine corsa, verificare immobilità porta', en: 'Activate quick clamp (500 N) — pull lever down to end-of-stroke click, verify door immobility', pt: 'Ativar fixação rápida (500 N) — abaixar alavanca até o clique de fim de curso', time: '1 min' },
      { step: 4, it: 'Avvitare cerniera superiore prima (25 Nm), poi inferiore (25 Nm) — sequenza CAD obbligatoria, chiave dinamometrica Gedore', en: 'Tighten upper hinge first (25 Nm), then lower (25 Nm) — mandatory CAD sequence, Gedore torque wrench', pt: 'Apertar dobradiça superior primeiro (25 Nm), depois inferior (25 Nm) — sequência CAD obrigatória', time: '5 min' },
      { step: 5, it: 'Verificare posizione cerniere con sensore di contatto — LED blu = posizione entro 0.05 mm, LED rosso = riallineare e ripetere', en: 'Verify hinge position with contact sensor — blue LED = within 0.05 mm, red LED = realign and repeat', pt: 'Verificar posição das dobradiças com sensor de contato — LED azul = dentro de 0.05 mm', time: '2 min' },
      { step: 6, it: 'Eseguire 5 cicli completi apertura/chiusura (0°→90°→0°) — nessun cigolio, resistenza uniforme, verifica coppia di apertura 1.5–3.0 Nm', en: 'Perform 5 complete open/close cycles (0°→90°→0°) — no squeaking, uniform resistance, opening torque 1.5–3.0 Nm', pt: 'Realizar 5 ciclos completos de abertura/fechamento (0°→90°→0°) — sem rangidos', time: '3 min' },
    ],
  },
  'AUDI-ING': {
    videoId: 'oSFZvBm4HFA',
    component: 'Banco Rulli Simulazione Manto Stradale BR-450',
    cadOverlay: 'Impianto Simulazione Manto Stradale — Modello CAD v6.0',
    steps: [
      { step: 1, it: 'Guidare veicolo sui rulli dinamometrici — bloccare ruote anteriori con fermi meccanici, verificare centratura ±20 mm sull\'asse banco', en: 'Drive vehicle onto dynamometric rollers — lock front wheels with mechanical stops, check centering ±20 mm on bench axis', pt: 'Posicionar veículo nos rolos dinamométricos — travar rodas dianteiras com batentes mecânicos', time: '4 min' },
      { step: 2, it: 'Caricare profilo "ROAD-A2" su controller MTS — configurare corsa ±100 mm, frequenza sweep 0–50 Hz, rampa 30 s', en: 'Load profile "ROAD-A2" on MTS controller — set stroke ±100 mm, frequency sweep 0–50 Hz, 30 s ramp', pt: 'Carregar perfil "ROAD-A2" no controlador MTS — corsa ±100 mm, sweep 0–50 Hz, rampa 30 s', time: '3 min' },
      { step: 3, it: 'Attivare servovalvole MOOG D633 — avviare sweep 0→50 Hz con rampa 30 s, verificare risposta idraulica su display controller', en: 'Activate MOOG D633 servovalves — start 0→50 Hz sweep with 30 s ramp, verify hydraulic response on controller display', pt: 'Ativar servoválvulas MOOG D633 — iniciar sweep 0→50 Hz com rampa 30 s', time: '2 min' },
      { step: 4, it: 'Avviare cicli simulazione — monitorare cella di carico PCB in tempo reale (max 100 kN), sistema si arresta automaticamente se superato', en: 'Start simulation cycles — monitor PCB load cell in real time (max 100 kN), system auto-stops if exceeded', pt: 'Iniciar ciclos de simulação — monitorar célula de carga PCB em tempo real (máx 100 kN)', time: '8 min' },
      { step: 5, it: 'Acquisire dati accelerometro triassiale PCB 356A a 10 kHz — verificare connessioni BNC, RMS su assi X/Y/Z entro limiti progetto', en: 'Acquire data from PCB 356A triaxial accelerometer at 10 kHz — check BNC connections, RMS on X/Y/Z within project limits', pt: 'Adquirir dados do acelerômetro triaxial PCB 356A a 10 kHz — verificar conexões BNC', time: '4 min' },
      { step: 6, it: 'Generare report NVH con software nCode — esportare CSV grezzo + grafico FFT in PDF, archiviare in cartella progetto con data', en: 'Generate NVH report with nCode software — export raw CSV + FFT chart as PDF, archive in project folder with date', pt: 'Gerar relatório NVH com software nCode — exportar CSV bruto + gráfico FFT em PDF', time: '5 min' },
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
    // Passo 1: molla nella zona centrale-bassa della pressa (piano di lavoro)
    [{ label: 'MOLLA 18.5kN', nx: 0.5, ny: 0.22, nz: 0.6, color: '#ef4444', hint: 'Asse verticale pressa — clic su sede molla' }],
    // Passo 2: corpo centrale pressa, zona media
    [{ label: 'AMMORTIZZATORE', nx: 0.5, ny: 0.48, nz: 0.65, color: '#a855f7', hint: 'Inserisci dall\'alto — allinea con sede foro Ø42' }],
    // Passo 3: parte alta della pressa — dado supporto sommità
    [{ label: 'SUPPORTO SUP.', nx: 0.5, ny: 0.88, nz: 0.6, color: '#f59e0b', hint: 'Chiave dinamometrica 120 Nm — senso orario' }],
    // Passo 4: braccio laterale sinistro con emettitore laser
    [{ label: 'LASER BRACCIO', nx: 0.18, ny: 0.35, nz: 0.75, color: '#22c55e', hint: 'Lettura display laterale — offset max 0.1 mm' }],
    // Passo 5: lato frontale centrale, connettore sensore
    [{ label: 'SENSORE CORSA', nx: 0.55, ny: 0.42, nz: 0.92, color: '#06b6d4', hint: 'Connettore M12×1 — freccia verso l\'alto' }],
    // Passo 6: lato destro in alto — raccordo valvola olio
    [{ label: 'CIRCUITO OLIO', nx: 0.85, ny: 0.62, nz: 0.55, color: '#f97316', hint: 'Valvola sfera 3/8" — chiudi quando T>65°C' }],
    // Passo 7: pannello HMI/PLC — quadro frontale centrale in cima alla pressa
    [{ label: 'PLC S7-1500', nx: 0.52, ny: 0.80, nz: 0.88, color: '#60a5fa', hint: 'Tasto START su HMI Comfort — attendi OK verde' }],
  ],
  'STELL-BETIM': [
    // Passo 1: piano centrale maschera dove si appoggia il lamierato
    [{ label: 'LAMIERATO', nx: 0.5, ny: 0.42, nz: 0.55, color: '#f59e0b', hint: 'Appoggiar su 3 perni Ø12 — flush ±0.3 mm' }],
    // Passo 2: clamp pneumatici distribuiti sul perimetro — zona sinistra-media
    [{ label: 'CLAMP PNEUM.', nx: 0.25, ny: 0.52, nz: 0.5, color: '#00d4aa', hint: 'Sequenza SX→DX — 6 bar, udibile il clic' }],
    // Passo 3: staffaggi comparatore — zona frontale bassa
    [{ label: 'STAFFAGGI', nx: 0.3, ny: 0.32, nz: 0.82, color: '#a855f7', hint: 'Comparatore centesimale — bolla a zero ±0.01' }],
    // Passo 4: elettrodi saldatura — zona centrale alta
    [{ label: 'ELETTRODI Cu-Cr', nx: 0.5, ny: 0.72, nz: 0.55, color: '#ef4444', hint: 'Punta Cu-Cr — usura < 30% diametro originale' }],
    // Passo 5: zona di saldatura punti — corpo maschera centrale
    [{ label: 'SALDATURA', nx: 0.5, ny: 0.58, nz: 0.5, color: '#f97316', hint: '12.5 kA × 200 ms — fermo assoluto struttura' }],
    // Passo 6: zona destra — campione per prova strappo
    [{ label: 'CONTROLLO', nx: 0.78, ny: 0.52, nz: 0.45, color: '#22c55e', hint: 'Strappo 1500 N min — ogni 50 pezzi prodotti' }],
  ],
  'NKE-ALPI': [
    // Passo 1: piattaforma di appoggio ruote — parte bassa banco
    [{ label: 'PIATTAFORMA', nx: 0.5, ny: 0.08, nz: 0.5, color: '#00d4aa', hint: 'Ruote su piatti allineatori — 0.0° asse anteriore' }],
    // Passo 2: target riflettente sul palo frontale alto
    [{ label: 'TARGET 4.0m', nx: 0.5, ny: 0.75, nz: 0.95, color: '#ef4444', hint: 'Distanza 4000 mm ±5 mm dal paraurti anteriore' }],
    // Passo 3: telecamera frontale veicolo — zona centrale
    [{ label: 'TELECAMERA', nx: 0.5, ny: 0.52, nz: 0.72, color: '#f59e0b', hint: 'OBD-II connesso — routine "CAL_CAM_01" su ECU' }],
    // Passo 4: radar LRR lato sinistro paraurti
    [{ label: 'RADAR 77GHz', nx: 0.18, ny: 0.42, nz: 0.78, color: '#a855f7', hint: 'Azimuth < 0.2° — tolleranza elevazione ±0.1°' }],
    // Passo 5: pannello LED target frontale
    [{ label: 'TEST LED', nx: 0.5, ny: 0.72, nz: 0.95, color: '#22c55e', hint: 'Pattern dinamico 30 s — 2400 lux costanti' }],
  ],
  'FCA-KRAGU': [
    // Passo 1: fixture di posizionamento al centro del banco
    [{ label: 'FIXTURE', nx: 0.5, ny: 0.45, nz: 0.55, color: '#a855f7', hint: 'Clic sul perno Ø8 di riferimento — flush piano' }],
    // Passo 2: pannello HMI laterale destro
    [{ label: 'HMI', nx: 0.88, ny: 0.68, nz: 0.35, color: '#60a5fa', hint: 'Seleziona P12 — coppia target 18 Nm ±0.5%' }],
    // Passo 3: avvitatore bilanciato sopra il banco
    [{ label: 'AVVITATORE', nx: 0.52, ny: 0.82, nz: 0.52, color: '#00d4aa', hint: 'CVI3 — grilletto 2 s continui, no rilascio precoce' }],
    // Passo 4: sensore Poka-Yoke integrato nella fixture
    [{ label: 'POKA-YOKE', nx: 0.5, ny: 0.52, nz: 0.5, color: '#f59e0b', hint: 'Spia verde = sequenza OK — rossa = stop forzato' }],
    // Passo 5: lettore barcode fisso sulla traversa alta
    [{ label: 'BARCODE', nx: 0.22, ny: 0.82, nz: 0.42, color: '#22c55e', hint: 'DataMatrix — singolo beep = tracciabilità OK' }],
  ],
  'IVECO-TO': [
    // Passo 1: piano termostatato — superficie base del banco
    [{ label: 'PIANO TERMOSTAT.', nx: 0.5, ny: 0.12, nz: 0.5, color: '#00d4aa', hint: 'Attendi 20°C ±0.5 — spia verde stabilizzazione' }],
    // Passo 2: cassettiera calibri — zona sinistra banca
    [{ label: 'CALIBRO CL.0', nx: 0.22, ny: 0.52, nz: 0.48, color: '#a855f7', hint: 'Classe 0 — registra n° lotto su foglio controllo' }],
    // Passo 3: corsoio mobile sul calibro — parte mobile centrale
    [{ label: 'CORSOIO MOBILE', nx: 0.5, ny: 0.52, nz: 0.5, color: '#f59e0b', hint: 'Avanzamento dolce — no spinte laterali > 0.5 N' }],
    // Passo 4: display nonio digitale — zona destra calibro
    [{ label: 'NONIO DIGITALE', nx: 0.72, ny: 0.58, nz: 0.5, color: '#06b6d4', hint: 'Risoluzione 0.002 mm — premi HOLD dopo lettura' }],
    // Passo 5: zona lettura risultato — display certificato
    [{ label: 'CONFORMITÀ', nx: 0.5, ny: 0.52, nz: 0.5, color: '#22c55e', hint: 'IT6: tolleranza ±0.011 mm per Ø18 — vedi disegno' }],
  ],
  'STELL-MIRA': [
    // Passo 1: telaio di alimentazione — zona bassa anteriore
    [{ label: 'TELAIO ALIM.', nx: 0.5, ny: 0.18, nz: 0.52, color: '#a855f7', hint: 'Guide rulli — modanatura parallela al bordo ±1 mm' }],
    // Passo 2: emettitore laser posizionamento — zona centrale-alta
    [{ label: 'LASER POSIZ.', nx: 0.38, ny: 0.62, nz: 0.72, color: '#ef4444', hint: 'Croce rossa — centra su foro target Ø6 veicolo' }],
    // Passo 3: ventose di presa — array centrale struttura
    [{ label: 'VENTOSE', nx: 0.5, ny: 0.52, nz: 0.5, color: '#00d4aa', hint: 'Manometro -0.9 bar — spia rossa prima del sollevamento' }],
    // Passo 4: attuatore lineare — colonna laterale destra
    [{ label: 'ATTUATORE LIN.', nx: 0.68, ny: 0.62, nz: 0.5, color: '#f97316', hint: 'Corsa 250 mm — velocità 80 mm/s programmata HMI' }],
    // Passo 5: zona di compressione sulla carrozzeria
    [{ label: 'COMPRESSIONE', nx: 0.5, ny: 0.52, nz: 0.5, color: '#f59e0b', hint: '350 N × 8 s — non rilasciare prima del beep OK' }],
    // Passo 6: quadro PLC controllo — pannello frontale alta
    [{ label: 'PLC CONTROLLO', nx: 0.52, ny: 0.82, nz: 0.82, color: '#22c55e', hint: 'LED verde "ADHESION OK" — ciclo 8 ms confermato' }],
  ],
  'FCA-MELFI': [
    // Passo 1: guida lineare orizzontale — base del banco
    [{ label: 'GUIDA LINEARE', nx: 0.5, ny: 0.18, nz: 0.52, color: '#a855f7', hint: 'Slitta: gioco max 0.01 mm — verifica con comparatore' }],
    // Passo 2: supporto ergonomico — colonna laterale sinistra
    [{ label: 'SUPPORTO ERGON.', nx: 0.18, ny: 0.52, nz: 0.5, color: '#06b6d4', hint: 'Manopola verde — altezza gomito operatore ±50 mm' }],
    // Passo 3: meccanismo bloccaggio rapido — zona centrale
    [{ label: 'BLOCC. RAPIDO', nx: 0.5, ny: 0.52, nz: 0.55, color: '#ef4444', hint: 'Leva in basso = 500 N — udibile il clic di fine corsa' }],
    // Passo 4: cerniere porta — zona destra alta
    [{ label: 'CERNIERE', nx: 0.72, ny: 0.72, nz: 0.5, color: '#f59e0b', hint: 'Sup prima, poi Inf — 25 Nm chiave dinamometrica' }],
    // Passo 5: sensore contatto posizione cerniera
    [{ label: 'SENSORE CONTATTO', nx: 0.72, ny: 0.48, nz: 0.62, color: '#00d4aa', hint: 'LED blu = entro 0.05 mm — rosso = riallineare' }],
    // Passo 6: zona porta completata — test funzionale
    [{ label: 'TEST APERTURA', nx: 0.5, ny: 0.58, nz: 0.5, color: '#22c55e', hint: '5 cicli 0°→90°→0° — nessun cigolio né resistenza' }],
  ],
  'AUDI-ING': [
    // Passo 1: rulli banco — zona bassa centrale
    [{ label: 'RULLI', nx: 0.5, ny: 0.12, nz: 0.5, color: '#a855f7', hint: 'Veicolo centrato — bloccaggio anteriore attivato' }],
    // Passo 2: attuatori MTS — lato sinistro struttura
    [{ label: 'ATTUATORI MTS', nx: 0.22, ny: 0.48, nz: 0.52, color: '#ef4444', hint: 'Profilo "ROAD-A2" — corsa ±100 mm, 0→50 Hz' }],
    // Passo 3: servovalvole MOOG — lato destro struttura
    [{ label: 'SERVOVALVOLE', nx: 0.78, ny: 0.48, nz: 0.52, color: '#00d4aa', hint: 'MOOG D633 — sweep 0→50 Hz, rampa 30 s' }],
    // Passo 4: cella di carico — zona centrale bassa
    [{ label: 'CELLA CARICO', nx: 0.5, ny: 0.42, nz: 0.52, color: '#f59e0b', hint: 'Lettura live — STOP automatico se > 100 kN' }],
    // Passo 5: accelerometro triassiale — montato su piano banco
    [{ label: 'ACCELEROMETRO', nx: 0.18, ny: 0.78, nz: 0.35, color: '#06b6d4', hint: 'Triassiale PCB 356A — 10 kHz, verifica cavi BNC' }],
    // Passo 6: postazione acquisizione dati — PC laterale
    [{ label: 'REPORT NVH', nx: 0.82, ny: 0.78, nz: 0.35, color: '#22c55e', hint: 'Software nCode — Esporta CSV + FFT in PDF' }],
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


  // aiResults: mappa stepIndex → risultato AI per l'impianto corrente
  const [aiResults, setAiResults] = useState({});
  const [aiRunningCount, setAiRunningCount] = useState(0); // quanti step ancora in elaborazione
  const [aiStepError, setAiStepError] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { callGemini, parseJsonResponse, hasApiKey } = useGoogleAI();

  const proc = plantProcedures[selectedPlant.id];
  const step = proc.steps[currentStep];
  const totalSteps = proc.steps.length;

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

  // Genera guida AI per UN singolo passo (chiamata interna).
  const analyseStep = async (stepIndex, currentProc, plantId) => {
    const s = currentProc.steps[stepIndex];
    const stepNum = stepIndex + 1;
    const allSteps = currentProc.steps.map((x, i) => `${i + 1}. ${x.it}`).join('\n');
    const staticHighlights = stepHighlights3D[plantId]?.[stepIndex] || [];

    const prompt = `Sei un assistente tecnico per operatori industriali di Automazioni & Service Srl (Piobesi Torino).

MACCHINARIO: ${currentProc.component}
PASSO ${stepNum}/${currentProc.steps.length}: ${s.it}
TUTTI I PASSI:
${allSteps}
PUNTI DI INTERVENTO:
${staticHighlights.map(h => `- ${h.label}: ${h.hint}`).join('\n')}

Rispondi SOLO JSON valido:
{
  "stepGuidance": "istruzione operativa 1-2 frasi, cita valori tecnici (kN, Nm, bar, ecc.) del passo",
  "nextAction": "prima azione concreta adesso (max 70 char)",
  "warnings": ["avvertimento solo se c'è rischio reale, altrimenti array vuoto"]
}`;

    const result = await callGemini([{ text: prompt }], {
      responseMimeType: 'application/json',
      temperature: 0.1,
      maxOutputTokens: 300,
    });

    const parsed = result ? parseJsonResponse(result.text) : null;
    const highlights = staticHighlights.map(h => ({
      nx: h.nx, ny: h.ny, nz: h.nz,
      label: h.label, hint: h.hint, color: h.color,
    }));
    return parsed ? { ...parsed, highlights } : { highlights };
  };

  // Avvia analisi AI su TUTTI i passi dell'impianto corrente in parallelo.
  // I risultati arrivano step by step e vengono mostrati man mano.
  const runAllSteps = async () => {
    if (!hasApiKey) { setAiStepError('VITE_GOOGLE_AI_API_KEY mancante in .env.local'); return; }
    setAiStepError(null);
    setAiResults({});
    const total = proc.steps.length;
    setAiRunningCount(total);

    // Cattura snapshot di impianto e proc per evitare stale closure se l'utente cambia impianto
    const snapPlantId = selectedPlant.id;
    const snapProc = proc;

    proc.steps.forEach((_, idx) => {
      analyseStep(idx, snapProc, snapPlantId)
        .then(result => {
          setAiResults(prev => ({ ...prev, [idx]: result }));
        })
        .catch(() => {
          setAiResults(prev => ({ ...prev, [idx]: null }));
        })
        .finally(() => {
          setAiRunningCount(prev => Math.max(0, prev - 1));
        });
    });
  };

  // Reset stato quando cambia impianto
  useEffect(() => {
    setCurrentStep(0);
    setTranslated(false);
    setShowVideo(false);
    setAiResults({});
    setAiRunningCount(0);
    setAiStepError(null);
  }, [selectedPlant]);

  // Chat AI assistente — risponde a domande procedurali dell'operatore
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const stepDesc = proc.steps.map((s, i) => `${i + 1}. ${s.it}`).join('\n');
      const context = `Sei un assistente tecnico per operatori industriali di Automazioni & Service Srl (Piobesi Torino).
Procedura attiva: ${proc.component}
Passo corrente: ${currentStep + 1}. ${step.it}
Lista completa passi:\n${stepDesc}
${aiStepResult?.stepGuidance ? `Guida AI attiva: ${aiStepResult.stepGuidance}` : ''}

Rispondi in modo conciso e pratico. Dai indicazioni operative precise. Usa al massimo 3-4 frasi.`;
      const result = await callGemini([{ text: `${context}\n\nDomanda operatore: ${userMsg}` }], {
        responseMimeType: 'text/plain',
        maxOutputTokens: 300,
        temperature: 0.3,
      });
      const answer = result?.text?.trim() || 'Non ho potuto elaborare la risposta.';
      setChatMessages(prev => [...prev, { role: 'ai', text: answer }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Errore di connessione. Riprova.' }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const aiStepResult = aiResults[currentStep] ?? null;
  const aiStepRunning = aiRunningCount > 0;

  // Highlight 3D: solo da AI, appaiono solo dopo click "Analisi AI"
  const aiHighlights3D = aiStepResult?.highlights?.filter(h => typeof h.nx === 'number') || [];
  const active3DHighlights = aiHighlights3D.map((h, i) => ({
    id: `${selectedPlant.id}-${currentStep}-${i}`,
    nx: h.nx ?? 0.5,
    ny: h.ny ?? 0.5,
    nz: h.nz ?? 0.5,
    label: h.label,
    hint: h.hint,
    color: h.color,
  }));

  return (
    <div className="p-4">
      <AlertBar message="Sessione training attiva — 3 operatori connessi da Detroit, 1 da São Paulo · AI Vision in esecuzione" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Eye size={20} className="text-[#00d4aa]" />
          <div>
            <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>AI VISUAL TRAINING & ONBOARDING</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Vista Operatore · Realtà Aumentata · AI Co-Pilot con traduzione LLM in tempo reale</p>
          </div>
        </div>
      </div>

      {/* Selettore Impianto */}
      <div className="mb-3">
        <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>SELEZIONA IMPIANTO</label>
        <select
          value={selectedPlant.id}
          onChange={e => { setSelectedPlant(plants.find(p => p.id === e.target.value)); setCurrentStep(0); setShowVideo(false); setTranslated(false); setAiStepError(null); setChatMessages([]); }}
          className="w-full p-3 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', outline: 'none' }}>
          {plants.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-12 gap-4">
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
            <div className="relative" style={{ minHeight: '420px', background: '#040d1a' }}>
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
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 flex-wrap max-w-[70%]">
                    <button onClick={() => runAllSteps()} disabled={aiStepRunning || !hasApiKey}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: aiStepRunning ? 'rgba(168,85,247,0.2)' : Object.keys(aiResults).length > 0 ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #4285f4, #1a73e8)',
                        border: `1px solid ${aiStepRunning ? 'rgba(168,85,247,0.4)' : 'rgba(66,133,244,0.4)'}`,
                        color: aiStepRunning ? '#a855f7' : Object.keys(aiResults).length > 0 ? '#22c55e' : '#fff',
                        opacity: hasApiKey ? 1 : 0.5,
                      }}
                      title={hasApiKey ? `Analisi AI su tutti i ${totalSteps} passi` : 'API Key mancante'}>
                      {aiStepRunning
                        ? <><Loader2 size={11} className="animate-spin" /> Analisi {totalSteps - aiRunningCount}/{totalSteps}…</>
                        : <><Sparkles size={11} /> {Object.keys(aiResults).length > 0 ? 'Riesegui Analisi AI' : 'Analisi AI'}</>}
                    </button>
                    <button onClick={() => setAutoRotate(r => !r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: autoRotate ? 'rgba(96,165,250,0.15)' : 'rgba(239,68,68,0.15)',
                        border: `1px solid ${autoRotate ? 'rgba(96,165,250,0.4)' : 'rgba(239,68,68,0.4)'}`,
                        color: autoRotate ? '#60a5fa' : '#ef4444',
                      }}>
                      {autoRotate ? <><Unlock size={11} /> Blocca Rotazione</> : <><Lock size={11} /> Sblocca Rotazione</>}
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

            {/* AI Guidance Panel — appare dopo Analisi AI */}
            {aiStepResult && (
              <div style={{ background: 'rgba(66,133,244,0.07)', borderTop: '1px solid rgba(66,133,244,0.25)' }}>
                {/* Riga guida principale */}
                {aiStepResult.stepGuidance && (
                  <div className="px-4 py-2.5 flex items-start gap-2">
                    <Sparkles size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold leading-snug" style={{ color: '#93c5fd' }}>
                      {aiStepResult.stepGuidance}
                    </span>
                  </div>
                )}
                {/* Prossima azione + avvertimenti */}
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {aiStepResult.nextAction && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-bold"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
                      ▶ {aiStepResult.nextAction}
                    </span>
                  )}
                  {aiStepResult.warnings?.map((w, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-bold"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24' }}>
                      ⚠ {w}
                    </span>
                  ))}
                </div>
                {/* Highlights inline — mostra label e hint di ciascun punto 3D */}
                {active3DHighlights.length > 0 && (
                  <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">
                    {active3DHighlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.65rem]"
                        style={{ background: `${h.color}14`, border: `1px solid ${h.color}45`, color: h.color }}>
                        <span className="font-bold font-mono">{h.label}</span>
                        {h.hint && <span className="opacity-80 text-white">{h.hint}</span>}
                      </div>
                    ))}
                  </div>
                )}
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
        <div className="col-span-5 space-y-3">
          <div className="rounded-xl p-3" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>AI CO-PILOT · CHECKLIST OPERATIVA</h3>
              <span className="text-[0.6rem] px-2 py-0.5 rounded-full font-bold" style={{
                background: 'rgba(0,212,170,0.2)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)',
              }}>LLM Attivo</span>
            </div>

            {/* Passo attivo */}
            <div className="p-3 rounded-lg mb-2" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
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
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1 mb-3">
              {proc.steps.map((s, i) => (
                <button key={i} onClick={() => { setCurrentStep(i); setAiStepError(null); }}
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
              <button onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setAiStepError(null); }}
                disabled={currentStep === 0}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <ChevronLeft size={14} /> Precedente
              </button>
              <span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>
                Passo {currentStep + 1} di {totalSteps}
              </span>
              <button onClick={() => { setCurrentStep(Math.min(totalSteps - 1, currentStep + 1)); setAiStepError(null); }}
                disabled={currentStep === totalSteps - 1}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)', color: '#0a0e17' }}>
                Successivo <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Chat AI assistente */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <button onClick={() => setChatOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-all hover:opacity-80"
              style={{ background: chatOpen ? 'rgba(168,85,247,0.1)' : 'transparent', color: '#a855f7' }}>
              <span className="flex items-center gap-2">
                <MessageCircle size={14} />
                CHIEDI ALL'AI · Assistente Operativo
              </span>
              <span className="text-[0.6rem] px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}>
                {chatOpen ? 'Chiudi' : 'Apri Chat'}
              </span>
            </button>
            {chatOpen && (
              <div className="flex flex-col" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: '200px', minHeight: '80px' }}>
                  {chatMessages.length === 0 && (
                    <p className="text-[0.65rem] text-center py-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Hai dubbi su questo passo? Scrivi qui la tua domanda.
                    </p>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="px-3 py-2 rounded-xl text-[0.7rem] max-w-[85%]"
                        style={{
                          background: m.role === 'user' ? 'rgba(96,165,250,0.15)' : 'rgba(168,85,247,0.1)',
                          border: `1px solid ${m.role === 'user' ? 'rgba(96,165,250,0.3)' : 'rgba(168,85,247,0.3)'}`,
                          color: m.role === 'user' ? '#93c5fd' : '#c084fc',
                        }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="px-3 py-2 rounded-xl text-[0.7rem]" style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
                        <Loader2 size={12} className="animate-spin inline mr-1" /> AI sta elaborando...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Es: Come allineo il laser? Quale coppia usare?"
                    className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                  <button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}
                    className="px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                    style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#a855f7' }}>
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info componente */}
          <div className="rounded-xl p-3" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h4 className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-secondary)' }}>COMPONENTE IN LAVORAZIONE</h4>
            <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{proc.component}</p>
            <p className="text-[0.6rem]" style={{ color: 'var(--color-text-secondary)' }}>{proc.cadOverlay}</p>
            <div className="flex items-center gap-4 mt-2">
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