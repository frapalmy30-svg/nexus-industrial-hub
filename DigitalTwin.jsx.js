import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Activity, Settings, CheckCircle, Loader2, Box, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const products = [
  { id: 'adas', name: 'Banchi di Calibrazione Sistemi ADAS', short: 'Banchi Calibrazione ADAS',
    asset: 'BCA-003', catia: 'ADAS_BENCH_v6.4.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/13e11b91-f350-4c48-a362-8f948a92fc7f/digital_twin_jig_1777333973990.png',
    oee: { disponibilita: 94, performance: 91, qualita: 97, uptime: 93, mtbf: 88, mttr: 95 },
    status: 'RUNNING', cycles: '2.108.500', pezziOggi: 48, scarti: 2,
    components: [
      { name: 'Telecamera frontale ADAS', status: 'OK', value: 'Calibrazione OK', eff: 96 },
      { name: 'Radar LRR 77 GHz', status: 'ATTENZIONE', value: 'Allineamento: 0.3°', eff: 82 },
      { name: 'Target riflettente motorizzato', status: 'OK', value: 'Pos: 4.0m ±5mm', eff: 98 },
      { name: 'Laser tracker Leica AT960', status: 'OK', value: 'Precisione: ±15μm', eff: 99 },
      { name: 'Software ECU calibrazione', status: 'OK', value: 'v3.8.2', eff: 95 },
      { name: 'Pannello LED pattern', status: 'OK', value: '2400 lux', eff: 97 },
    ],
    production: [42,45,48,50,46,44], target: [50,50,50,50,50,50],
  },
  { id: 'sospensioni', name: 'Linea Assemblaggio Sospensioni PHEV', short: 'Linea Sospensioni PHEV',
    asset: 'LAS-001', catia: 'SUSP_LINE_v14.2.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/bfed399c-9767-4a8b-8051-24ea20843f0d/dt_assembly_line_1777397303794.png',
    oee: { disponibilita: 89, performance: 85, qualita: 92, uptime: 87, mtbf: 82, mttr: 90 },
    status: 'RUNNING', cycles: '1.245.780', pezziOggi: 267, scarti: 7,
    components: [
      { name: 'Pressa molla elicoidale', status: 'OK', value: '18.5 kN stabile', eff: 94 },
      { name: 'Coppia avvitatura ammort.', status: 'OK', value: '120 Nm ±2%', eff: 96 },
      { name: 'Allineamento laser braccio', status: 'ATTENZIONE', value: 'Offset: 0.08mm', eff: 78 },
      { name: 'Temperatura olio idraulico', status: 'OK', value: '42°C (max 65°C)', eff: 91 },
      { name: 'Sensore corsa ammortizzatore', status: 'OK', value: '0-320mm OK', eff: 97 },
      { name: 'PLC Siemens S7-1500', status: 'OK', value: 'Scan: 4ms', eff: 99 },
    ],
    production: [35,40,42,45,38,42], target: [45,45,45,45,45,45],
  },
  { id: 'avvitatura', name: 'Banchi di Assemblaggio e Avvitatura', short: 'Banchi Avvitatura',
    asset: 'BAV-004', catia: 'ASSEM_BENCH_v4.2.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/bfed399c-9767-4a8b-8051-24ea20843f0d/dt_cnc_enclosure_1777397259683.png',
    oee: { disponibilita: 93, performance: 90, qualita: 95, uptime: 91, mtbf: 89, mttr: 92 },
    status: 'RUNNING', cycles: '45.200', pezziOggi: 180, scarti: 3,
    components: [
      { name: 'Avvitatore Desoutter CVI3', status: 'OK', value: '5-25 Nm ±0.5%', eff: 98 },
      { name: 'Braccio bilanciato pneum.', status: 'OK', value: 'Max 80 kg', eff: 95 },
      { name: 'Sensore coppia reattiva', status: 'OK', value: 'Calibrato', eff: 97 },
      { name: 'Sistema Poka-Yoke', status: 'OK', value: '0 errori', eff: 100 },
      { name: 'Lettore barcode Cognex', status: 'OK', value: '1200 scan/min', eff: 99 },
      { name: 'Monitor HMI', status: 'OK', value: 'Step 24/48', eff: 93 },
    ],
    production: [28,30,32,30,28,32], target: [32,32,32,32,32,32],
  },
  { id: 'ganci', name: 'Ganci di Sollevamento', short: 'Ganci Sollevamento',
    asset: 'GAN-006', catia: 'HOOK_LIFT_v2.1.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/13e11b91-f350-4c48-a362-8f948a92fc7f/digital_twin_crane_beam_1777334003717.png',
    oee: { disponibilita: 97, performance: 94, qualita: 98, uptime: 96, mtbf: 93, mttr: 97 },
    status: 'RUNNING', cycles: '340.200', pezziOggi: 120, scarti: 1,
    components: [
      { name: 'Gancio principale forgiato', status: 'OK', value: '1800 kg', eff: 99 },
      { name: 'Catena sicurezza Gr.80', status: 'OK', value: 'Integra', eff: 98 },
      { name: 'Blocco di sicurezza', status: 'OK', value: 'Attivo', eff: 100 },
      { name: 'Cella di carico', status: 'OK', value: '1800/2000 kg', eff: 90 },
    ],
    production: [18,20,22,20,18,22], target: [22,22,22,22,22,22],
  },
  { id: 'calibri', name: 'Calibri di Controllo', short: 'Calibri Controllo',
    asset: 'CAL-007', catia: 'GAUGE_CTRL_v1.8.CATProduct',
    oee: { disponibilita: 98, performance: 97, qualita: 99, uptime: 97, mtbf: 95, mttr: 98 },
    status: 'RUNNING', cycles: '89.500', pezziOggi: 95, scarti: 0,
    components: [
      { name: 'Corpo calibro temprato', status: 'OK', value: 'Classe 0', eff: 100 },
      { name: 'Corsoio mobile', status: 'OK', value: '0.002mm', eff: 99 },
      { name: 'Nonio digitale', status: 'OK', value: 'Ris: 0.01mm', eff: 98 },
      { name: 'Sensore temperatura', status: 'OK', value: '20.0°C', eff: 97 },
    ],
    production: [15,16,15,16,17,16], target: [16,16,16,16,16,16],
  },
  { id: 'sigle', name: 'Impianti Applicazione Sigle e Modanature', short: 'Impianti Sigle/Modanature',
    asset: 'SIG-008', catia: 'LABEL_APP_v3.5.CATProduct',
    oee: { disponibilita: 91, performance: 88, qualita: 93, uptime: 89, mtbf: 85, mttr: 91 },
    status: 'RUNNING', cycles: '567.300', pezziOggi: 210, scarti: 4,
    components: [
      { name: 'Laser posizionamento', status: 'OK', value: '±0.2mm', eff: 96 },
      { name: 'Ventose di presa', status: 'OK', value: '-0.9 Bar', eff: 94 },
      { name: 'Attuatore lineare', status: 'ATTENZIONE', value: 'Usura: 72%', eff: 80 },
      { name: 'PLC di controllo', status: 'OK', value: 'Ciclo: 8ms', eff: 98 },
    ],
    production: [33,35,36,34,35,37], target: [38,38,38,38,38,38],
  },
  { id: 'montaggio', name: 'Attrezzi di Montaggio Parti Mobili', short: 'Attrezzi Montaggio',
    asset: 'MON-009', catia: 'MOBILE_TOOL_v2.3.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/bfed399c-9767-4a8b-8051-24ea20843f0d/dt_robotic_assembly_1777397246490.png',
    oee: { disponibilita: 95, performance: 92, qualita: 96, uptime: 94, mtbf: 90, mttr: 94 },
    status: 'RUNNING', cycles: '234.100', pezziOggi: 150, scarti: 2,
    components: [
      { name: 'Guida lineare precisione', status: 'OK', value: '0.01mm', eff: 97 },
      { name: 'Supporto ergonomico', status: 'OK', value: 'Regolabile', eff: 95 },
      { name: 'Bloccaggio rapido', status: 'OK', value: '500 N', eff: 98 },
      { name: 'Sensore di contatto', status: 'OK', value: 'Attivo', eff: 96 },
    ],
    production: [23,25,26,24,25,27], target: [27,27,27,27,27,27],
  },
  { id: 'assestamento', name: 'Impianto di Assestamento Sospensioni', short: 'Assestamento Sospensioni',
    asset: 'ASS-010', catia: 'SETTLE_IMP_v5.1.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/bfed399c-9767-4a8b-8051-24ea20843f0d/dt_truck_engine_1777397286702.png',
    oee: { disponibilita: 87, performance: 84, qualita: 90, uptime: 85, mtbf: 80, mttr: 88 },
    status: 'WARNING', cycles: '890.400', pezziOggi: 190, scarti: 5,
    components: [
      { name: 'Cilindro idraulico', status: 'OK', value: '50 kN', eff: 92 },
      { name: 'Pompa olio', status: 'ATTENZIONE', value: '58°C', eff: 76 },
      { name: 'Sensore LVDT', status: 'OK', value: '0-400mm', eff: 98 },
      { name: 'Valvola proporzionale', status: 'OK', value: '180 Bar', eff: 94 },
      { name: 'PLC ciclo automatico', status: 'OK', value: '45s', eff: 97 },
    ],
    production: [28,30,32,33,30,37], target: [35,35,35,35,35,35],
  },
  { id: 'simulazione', name: 'Impianto di Simulazione Manto Stradale', short: 'Simulazione Manto Stradale',
    asset: 'SIM-011', catia: 'ROAD_SIM_v7.0.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/bfed399c-9767-4a8b-8051-24ea20843f0d/dt_laser_cutting_1777397274879.png',
    oee: { disponibilita: 90, performance: 87, qualita: 94, uptime: 88, mtbf: 84, mttr: 91 },
    status: 'RUNNING', cycles: '12.800', pezziOggi: 24, scarti: 0,
    components: [
      { name: 'Attuatore MTS', status: 'OK', value: '±100mm', eff: 95 },
      { name: 'Servovalvola MOOG', status: 'OK', value: '0-50 Hz', eff: 97 },
      { name: 'Cella di carico 100 kN', status: 'OK', value: '0.1%', eff: 99 },
      { name: 'Accelerometro triassiale', status: 'OK', value: '±50g', eff: 98 },
      { name: 'Software acquisizione', status: 'OK', value: '10 kHz', eff: 96 },
    ],
    production: [4,4,4,4,4,4], target: [4,4,4,4,4,4],
  },
  { id: 'maschera', name: 'Maschere di Bloccaggio e Saldatura', short: 'Maschere Saldatura',
    asset: 'MSB-002', catia: 'WELD_MASK_v8.1.CATProduct',
    imageUrl: '/@fs/C:/Users/frapa/.gemini/antigravity/brain/13e11b91-f350-4c48-a362-8f948a92fc7f/digital_twin_van_frame_1777333989135.png',
    oee: { disponibilita: 84, performance: 81, qualita: 88, uptime: 82, mtbf: 78, mttr: 85 },
    status: 'RUNNING', cycles: '892.340', pezziOggi: 340, scarti: 12,
    components: [
      { name: 'Clamp pneumatici (x12)', status: 'OK', value: '6 Bar', eff: 93 },
      { name: 'Trasformatore MFDC', status: 'OK', value: '55°C', eff: 91 },
      { name: 'Punte Cu-Cr elettrodi', status: 'CRITICO', value: 'Usura: 68%', eff: 62 },
      { name: 'Staffaggio posiz.', status: 'OK', value: '±0.05mm', eff: 97 },
      { name: 'Corrente saldatura', status: 'OK', value: '12.5 kA', eff: 95 },
      { name: 'Contacicli saldatura', status: 'ATTENZIONE', value: '892.340', eff: 78 },
    ],
    production: [52,55,58,56,54,57], target: [60,60,60,60,60,60],
  },
  { id: 'geometria', name: 'Attrezzi Leggeri di Geometria', short: 'Attrezzi Geometria',
    asset: 'GEO-012', catia: 'GEOM_LIGHT_v1.5.CATProduct',
    oee: { disponibilita: 97, performance: 96, qualita: 98, uptime: 96, mtbf: 94, mttr: 97 },
    status: 'RUNNING', cycles: '45.600', pezziOggi: 85, scarti: 1,
    components: [
      { name: 'Sagoma A-pillar', status: 'OK', value: '±0.3mm', eff: 98 },
      { name: 'Sagoma B-pillar', status: 'OK', value: '±0.3mm', eff: 97 },
      { name: 'Sagoma parafango', status: 'OK', value: '±0.5mm', eff: 95 },
      { name: 'Marcatore riferimento', status: 'OK', value: 'OK', eff: 99 },
    ],
    production: [13,14,15,14,14,15], target: [15,15,15,15,15,15],
  },
  { id: 'manipolatore', name: 'Manipolatori di Carico e Movimentazione', short: 'Manipolatori Carico',
    asset: 'MAN-005', catia: 'MANIP_LOAD_v3.0.CATProduct',
    oee: { disponibilita: 96, performance: 94, qualita: 97, uptime: 95, mtbf: 92, mttr: 96 },
    status: 'IDLE', cycles: '67.890', pezziOggi: 140, scarti: 1,
    components: [
      { name: 'Motore sollevamento 5.5kW', status: 'OK', value: '450 kg', eff: 94 },
      { name: 'Encoder rotazione', status: 'OK', value: '±0.1°', eff: 99 },
      { name: 'Pinza ventosa vuoto', status: 'OK', value: '-0.85 Bar', eff: 96 },
      { name: 'Finecorsa Cat.4', status: 'OK', value: 'PL-e', eff: 100 },
      { name: 'Bilanciamento pneum.', status: 'OK', value: '5.5 Bar', eff: 95 },
    ],
    production: [22,23,24,23,24,24], target: [25,25,25,25,25,25],
  },
];

function OEERadar({ data }) {
  const labels = ['Disponibilità', 'Performance', 'Qualità', 'Uptime', 'MTBF', 'MTTR'];
  const keys = ['disponibilita', 'performance', 'qualita', 'uptime', 'mtbf', 'mttr'];
  const cx = 120, cy = 110, r = 70;
  const angles = keys.map((_, i) => (Math.PI * 2 * i) / keys.length - Math.PI / 2);
  const rings = [0.25, 0.5, 0.75, 1];
  const pts = keys.map((k, i) => {
    const v = (data[k] || 0) / 100;
    return [cx + r * v * Math.cos(angles[i]), cy + r * v * Math.sin(angles[i])];
  });
  return (
    <svg viewBox="0 0 240 220" className="w-full">
      {rings.map((s, i) => <polygon key={i} points={angles.map(a => `${cx + r * s * Math.cos(a)},${cy + r * s * Math.sin(a)}`).join(' ')} fill="none" stroke="#1e293b" strokeWidth="0.8" />)}
      {angles.map((a, i) => <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#1e293b" strokeWidth="0.5" />)}
      <polygon points={pts.map(p => p.join(',')).join(' ')} fill="rgba(0,212,170,0.15)" stroke="#00d4aa" strokeWidth="2" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#00d4aa" />)}
      {labels.map((l, i) => {
        const lx = cx + (r + 22) * Math.cos(angles[i]);
        const ly = cy + (r + 22) * Math.sin(angles[i]);
        return <text key={i} x={lx} y={ly} fill="#00d4aa" fontSize="7.5" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" opacity="0.8">{l}</text>;
      })}
    </svg>
  );
}

function MachineModel({ type, focusIndex, components }) {
  const hl = focusIndex >= 0 && components[focusIndex] ? focusIndex : -1;
  const hc = hl >= 0 ? (components[hl].status === 'OK' ? '#00d4aa' : components[hl].status === 'ATTENZIONE' ? '#f59e0b' : '#ef4444') : null;

  const dimO = (base, dimmed) => hl >= 0 ? dimmed : base;
  const partO = (idx, base) => hl >= 0 ? (hl === idx ? 1 : 0.15) : base;

  return (
    <svg viewBox="0 0 600 500" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 30px rgba(0,212,170,0.12))' }}>
      <defs>
        <linearGradient id="dtG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00d4aa" stopOpacity="0.08" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" /></linearGradient>
        <filter id="dtGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="dtFocus"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <pattern id="dtGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" /></pattern>
      </defs>
      <rect x="0" y="0" width="600" height="500" fill="url(#dtGrid)" opacity="0.4" />

      {type === 'adas' && <>
        {/* Main bench base - isometric box */}
        <g opacity={dimO(0.9, 0.2)}>
          <polygon points="300,380 520,330 520,315 300,365 80,315 80,330" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5" />
          <polygon points="300,365 520,315 520,260 300,310 80,260 80,315" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1" />
          <polygon points="300,310 520,260 300,210 80,260" fill="rgba(30,41,59,0.6)" stroke="#475569" strokeWidth="1" />
          {Array.from({length:8},(_, i)=><line key={i} x1={120+i*50} y1={250-i*3} x2={120+i*50} y2={320-i*3} stroke="#475569" strokeWidth="0.5" opacity="0.3" />)}
          <line x1="100" y1="337" x2="80" y2="337" stroke="#00d4aa" strokeWidth="0.6" opacity="0.5" /><line x1="100" y1="280" x2="80" y2="280" stroke="#00d4aa" strokeWidth="0.6" opacity="0.5" />
          <text x="72" y="310" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="end" opacity="0.5">350mm</text>
        </g>

        {/* Camera unit - part 0 */}
        <g opacity={partO(0, 0.85)} filter={hl===0?"url(#dtFocus)":""}>
          <rect x="265" y="120" width="70" height="55" rx="6" fill="rgba(30,41,59,0.9)" stroke={hl===0?hc:"#3b82f6"} strokeWidth={hl===0?3:1.5} />
          <circle cx="300" cy="147" r="18" fill="rgba(59,130,246,0.1)" stroke={hl===0?hc:"#3b82f6"} strokeWidth="2" />
          <circle cx="300" cy="147" r="10" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" strokeWidth="1.5" />
          <circle cx="300" cy="147" r="4" fill="#3b82f6" opacity="0.6" />
          <rect x="320" y="128" width="8" height="5" rx="1" fill="#22c55e" opacity="0.6" />
          <text x="300" y="113" fill={hl===0?hc:"#3b82f6"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">CAM ADAS</text>
          {hl===0&&<circle cx="300" cy="147" r="22" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></circle>}
        </g>

        {/* Radar module - part 1 */}
        <g opacity={partO(1, 0.85)} filter={hl===1?"url(#dtFocus)":""}>
          <rect x="115" y="145" width="55" height="35" rx="4" fill="rgba(245,158,11,0.08)" stroke={hl===1?hc:"#f59e0b"} strokeWidth={hl===1?3:1.5} />
          {Array.from({length:5},(_, i)=><path key={i} d={`M${170+i*12},162 Q${176+i*12},152 ${182+i*12},162`} fill="none" stroke="#f59e0b" strokeWidth="1" opacity={0.6-i*0.1} />)}
          <text x="142" y="140" fill={hl===1?hc:"#f59e0b"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">RADAR 77GHz</text>
          {hl===1&&<rect x="110" y="140" width="65" height="45" rx="6" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>

        {/* Target reflector - part 2 */}
        <g opacity={partO(2, 0.85)} filter={hl===2?"url(#dtFocus)":""}>
          <rect x="370" y="135" width="80" height="65" rx="3" fill="rgba(15,23,42,0.9)" stroke={hl===2?hc:"#94a3b8"} strokeWidth={hl===2?3:1.5} />
          {Array.from({length:4},(_, r)=>Array.from({length:5},(_, c)=><rect key={`t${r}${c}`} x={375+c*15} y={140+r*15} width="13" height="13" fill={(r+c)%2===0?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.3)'} />))}
          <line x1="410" y1="200" x2="410" y2="240" stroke="#94a3b8" strokeWidth="2" opacity="0.6" />
          <rect x="400" y="240" width="20" height="8" rx="2" fill="#475569" opacity="0.5" />
          <text x="410" y="130" fill={hl===2?hc:"#94a3b8"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">TARGET RIFL.</text>
          {hl===2&&<rect x="365" y="130" width="90" height="75" rx="5" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>

        {/* Laser tracker - part 3 */}
        <g opacity={partO(3, 0.85)} filter={hl===3?"url(#dtFocus)":""}>
          <rect x="480" y="190" width="40" height="50" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===3?hc:"#a855f7"} strokeWidth={hl===3?3:1.5} />
          <circle cx="500" cy="210" r="10" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="500" cy="210" r="4" fill="#a855f7" opacity="0.5" />
          <line x1="500" y1="210" x2="300" y2="147" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="6 3" opacity="0.4" />
          <text x="500" y="183" fill={hl===3?hc:"#a855f7"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">LASER LEICA</text>
          {hl===3&&<circle cx="500" cy="210" r="16" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></circle>}
        </g>

        {/* ECU software panel - part 4 */}
        <g opacity={partO(4, 0.85)} filter={hl===4?"url(#dtFocus)":""}>
          <rect x="85" y="225" width="65" height="45" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===4?hc:"#22c55e"} strokeWidth={hl===4?3:1.5} />
          <rect x="92" y="232" width="51" height="28" rx="2" fill="rgba(34,197,94,0.06)" />
          <text x="117" y="245" fill="#22c55e" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">ECU</text>
          <text x="117" y="254" fill="#22c55e" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">v3.8.2</text>
          <rect x="95" y="264" width="8" height="3" rx="1" fill="#22c55e" opacity="0.3" /><rect x="106" y="264" width="8" height="3" rx="1" fill="#22c55e" opacity="0.3" /><rect x="117" y="264" width="8" height="3" rx="1" fill="#22c55e" opacity="0.3" />
          {hl===4&&<rect x="80" y="220" width="75" height="55" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>

        {/* LED pattern panel - part 5 */}
        <g opacity={partO(5, 0.85)} filter={hl===5?"url(#dtFocus)":""}>
          <rect x="200" y="185" width="100" height="70" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===5?hc:"#60a5fa"} strokeWidth={hl===5?3:1.5} />
          {Array.from({length:3},(_, r)=>Array.from({length:5},(_, c)=><circle key={`led${r}${c}`} cx={215+c*18} cy={200+r*18} r="4" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="0.8" />))}
          <text x="250" y="265" fill={hl===5?hc:"#60a5fa"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">LED PATTERN</text>
          {hl===5&&<rect x="195" y="180" width="110" height="80" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>

        <line x1="80" y1="383" x2="520" y2="383" stroke="#00d4aa" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 2" />
        <text x="300" y="395" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.35">3200 × 1800 × 350 mm</text>
      </>}

      {type === 'sospensioni' && <>
        <g opacity={dimO(0.9, 0.2)}>
          <polygon points="300,420 540,365 540,350 300,405 60,350 60,365" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5" />
          <polygon points="300,405 540,350 540,280 300,335 60,280 60,350" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1" />
          <polygon points="300,335 540,280 300,225 60,280" fill="rgba(30,41,59,0.6)" stroke="#475569" strokeWidth="1" />
          {Array.from({length:6},(_, i)=><line key={i} x1={110+i*72} y1={275-i*4} x2={110+i*72} y2={350-i*4} stroke="#475569" strokeWidth="0.5" opacity="0.3" />)}
        </g>
        <g opacity={partO(0, 0.85)} filter={hl===0?"url(#dtFocus)":""}>
          <rect x="145" y="100" width="70" height="130" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===0?hc:"#00d4aa"} strokeWidth={hl===0?3:1.8} />
          {Array.from({length:10},(_, i)=><ellipse key={i} cx={180} cy={115+i*11} rx={30-i*0.5} ry={7} fill="none" stroke="#00d4aa" strokeWidth={2-i*0.1} opacity={0.8-i*0.04} />)}
          <line x1="180" y1="95" x2="180" y2="100" stroke="#f59e0b" strokeWidth="3" opacity="0.7" />
          <text x="180" y="90" fill={hl===0?hc:"#00d4aa"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">PRESSA 18.5kN</text>
          <text x="180" y="242" fill="#00d4aa" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.4">Ø110mm</text>
          {hl===0&&<rect x="140" y="95" width="80" height="140" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(1, 0.85)} filter={hl===1?"url(#dtFocus)":""}>
          <rect x="255" y="115" width="90" height="100" rx="6" fill="rgba(15,23,42,0.9)" stroke={hl===1?hc:"#3b82f6"} strokeWidth={hl===1?3:1.5} />
          <circle cx="300" cy="155" r="22" fill="rgba(59,130,246,0.05)" stroke="#3b82f6" strokeWidth="2" />
          <line x1="300" y1="133" x2="300" y2="177" stroke="#3b82f6" strokeWidth="3" />
          <path d="M282,155 L300,140 L318,155" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          <text x="300" y="108" fill={hl===1?hc:"#3b82f6"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">AVVIT. 120Nm</text>
          {hl===1&&<rect x="250" y="110" width="100" height="110" rx="8" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(2, 0.85)} filter={hl===2?"url(#dtFocus)":""}>
          <line x1="380" y1="140" x2="480" y2="180" stroke={hl===2?hc:"#ef4444"} strokeWidth={hl===2?3:2} />
          <circle cx="380" cy="140" r="6" fill="#ef4444" opacity="0.3" /><circle cx="480" cy="180" r="6" fill="#ef4444" opacity="0.3" />
          {Array.from({length:6},(_, i)=><circle key={i} cx={380+i*17} cy={140+i*6.7} r="2" fill="#ef4444" opacity="0.6" />)}
          <text x="430" y="130" fill={hl===2?hc:"#ef4444"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">LASER ±0.1mm</text>
          {hl===2&&<ellipse cx="430" cy="160" rx="60" ry="30" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></ellipse>}
        </g>
        <g opacity={partO(3, 0.85)} filter={hl===3?"url(#dtFocus)":""}>
          <rect x="400" y="220" width="55" height="40" rx="4" fill="rgba(245,158,11,0.06)" stroke={hl===3?hc:"#f59e0b"} strokeWidth={hl===3?3:1.5} />
          <rect x="408" y="228" width="39" height="24" rx="2" fill="rgba(30,41,59,0.9)" />
          <text x="427" y="244" fill="#f59e0b" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">42°C</text>
          <text x="427" y="214" fill={hl===3?hc:"#f59e0b"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">TEMP OLIO</text>
          {hl===3&&<rect x="395" y="215" width="65" height="50" rx="6" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(4, 0.85)} filter={hl===4?"url(#dtFocus)":""}>
          <rect x="105" y="245" width="50" height="60" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===4?hc:"#a855f7"} strokeWidth={hl===4?3:1.5} />
          <line x1="115" y1="265" x2="145" y2="265" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
          <line x1="115" y1="275" x2="145" y2="275" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
          <line x1="115" y1="285" x2="145" y2="285" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
          <text x="130" y="258" fill="#a855f7" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">0-320mm</text>
          <text x="130" y="239" fill={hl===4?hc:"#a855f7"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">LVDT</text>
          {hl===4&&<rect x="100" y="240" width="60" height="70" rx="6" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(5, 0.85)} filter={hl===5?"url(#dtFocus)":""}>
          <rect x="485" y="260" width="55" height="45" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===5?hc:"#22c55e"} strokeWidth={hl===5?3:1.5} />
          <text x="512" y="280" fill="#22c55e" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" opacity="0.7">PLC</text>
          <text x="512" y="292" fill="#22c55e" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">S7-1500</text>
          <circle cx="530" cy="268" r="3" fill="#22c55e" opacity="0.6"><animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" /></circle>
          {hl===5&&<rect x="480" y="255" width="65" height="55" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <text x="300" y="440" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.35">4500 × 2200 × 1800 mm</text>
      </>}

      {type === 'avvitatura' && <>
        <g opacity={dimO(0.9, 0.2)}>
          <polygon points="300,370 500,320 500,305 300,355 100,305 100,320" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5" />
          <polygon points="300,355 500,305 500,245 300,295 100,245 100,305" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1" />
          <polygon points="300,295 500,245 300,195 100,245" fill="rgba(30,41,59,0.6)" stroke="#475569" strokeWidth="1" />
        </g>
        <g opacity={partO(0, 0.85)} filter={hl===0?"url(#dtFocus)":""}>
          <line x1="200" y1="195" x2="200" y2="70" stroke={hl===0?hc:"#00d4aa"} strokeWidth={hl===0?4:2.5} />
          <line x1="200" y1="70" x2="330" y2="95" stroke={hl===0?hc:"#00d4aa"} strokeWidth={hl===0?4:2.5} />
          <rect x="318" y="82" width="28" height="45" rx="5" fill="rgba(0,212,170,0.08)" stroke={hl===0?hc:"#00d4aa"} strokeWidth={hl===0?3:2} />
          <line x1="332" y1="127" x2="332" y2="170" stroke="#00d4aa" strokeWidth="3" />
          <polygon points="325,170 332,185 339,170" fill="#00d4aa" opacity="0.6" />
          <text x="332" y="75" fill={hl===0?hc:"#00d4aa"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">AVVITATORE CVI3</text>
          <text x="332" y="200" fill="#00d4aa" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.4">5-25 Nm</text>
          {hl===0&&<circle cx="332" cy="170" r="20" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></circle>}
        </g>
        <g opacity={partO(1, 0.85)} filter={hl===1?"url(#dtFocus)":""}>
          <circle cx="200" cy="195" r="8" fill="rgba(59,130,246,0.15)" stroke={hl===1?hc:"#3b82f6"} strokeWidth="2" />
          <circle cx="200" cy="70" r="6" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="175" y="65" fill={hl===1?hc:"#3b82f6"} fontSize="5.5" fontFamily="monospace" textAnchor="end" opacity="0.7">BRACCIO BILAN.</text>
          {hl===1&&<ellipse cx="265" cy="130" rx="80" ry="70" fill="none" stroke={hc} strokeWidth="2" opacity="0.4"><animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" /></ellipse>}
        </g>
        <g opacity={partO(2, 0.85)} filter={hl===2?"url(#dtFocus)":""}>
          <rect x="345" y="155" width="30" height="20" rx="3" fill="rgba(245,158,11,0.08)" stroke={hl===2?hc:"#f59e0b"} strokeWidth={hl===2?3:1.5} />
          <text x="360" y="150" fill={hl===2?hc:"#f59e0b"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">COPPIA</text>
        </g>
        <g opacity={partO(3, 0.85)} filter={hl===3?"url(#dtFocus)":""}>
          <rect x="230" y="210" width="100" height="55" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===3?hc:"#22c55e"} strokeWidth={hl===3?3:1.5} />
          {[[250,225],[280,225],[310,225],[250,245],[280,245],[310,245]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="7" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />)}
          <text x="280" y="272" fill="#22c55e" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">POKA-YOKE</text>
          {hl===3&&<rect x="225" y="205" width="110" height="65" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(4, 0.85)} filter={hl===4?"url(#dtFocus)":""}>
          <rect x="420" y="200" width="50" height="35" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===4?hc:"#a855f7"} strokeWidth={hl===4?3:1.5} />
          <text x="445" y="222" fill="#a855f7" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">SCAN</text>
          <circle cx="460" cy="208" r="3" fill="#a855f7" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="1s" repeatCount="indefinite" /></circle>
          <text x="445" y="193" fill={hl===4?hc:"#a855f7"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">BARCODE</text>
        </g>
        <g opacity={partO(5, 0.85)} filter={hl===5?"url(#dtFocus)":""}>
          <rect x="120" y="220" width="75" height="50" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===5?hc:"#60a5fa"} strokeWidth={hl===5?3:1.5} />
          <rect x="128" y="228" width="59" height="34" rx="2" fill="rgba(96,165,250,0.05)" />
          <text x="157" y="250" fill="#60a5fa" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">HMI</text>
          <text x="157" y="213" fill={hl===5?hc:"#60a5fa"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">MONITOR</text>
          {hl===5&&<rect x="115" y="215" width="85" height="60" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <text x="300" y="390" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.35">2400 × 1600 × 1200 mm</text>
      </>}

      {type === 'maschera' && <>
        <g opacity={dimO(0.9, 0.2)}>
          <polygon points="300,400 520,340 520,325 300,385 80,325 80,340" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5" />
          <polygon points="300,385 520,325 520,265 300,325 80,265 80,325" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1" />
        </g>
        <g opacity={partO(0, 0.85)} filter={hl===0?"url(#dtFocus)":""}>
          <polygon points="300,60 440,130 440,280 300,350 160,280 160,130" fill="rgba(0,212,170,0.03)" stroke={hl===0?hc:"#00d4aa"} strokeWidth={hl===0?3:2} />
          <polygon points="300,100 400,145 400,255 300,300 200,255 200,145" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="5 3" />
          {[[205,130],[250,100],[300,85],[350,100],[395,130],[440,170],[395,225],[350,255],[300,270],[250,255],[205,225],[160,170]].map(([x,y],i)=>(
            <g key={i}><circle cx={x} cy={y} r="8" fill={`rgba(0,212,170,0.1)`} stroke={hl===0?hc:"#00d4aa"} strokeWidth="2" opacity="0.8" /><text x={x} y={y-12} fill="#00d4aa" fontSize="4" fontFamily="monospace" textAnchor="middle" opacity="0.5">C{i+1}</text></g>
          ))}
          <text x="300" y="52" fill={hl===0?hc:"#00d4aa"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">CLAMP PNEUM. ×12</text>
          {hl===0&&<polygon points="300,55 445,128 445,285 300,355 155,285 155,128" fill="none" stroke={hc} strokeWidth="2" opacity="0.4"><animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" /></polygon>}
        </g>
        <g opacity={partO(1, 0.85)} filter={hl===1?"url(#dtFocus)":""}>
          <rect x="460" y="190" width="60" height="40" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===1?hc:"#3b82f6"} strokeWidth={hl===1?3:1.5} />
          <text x="490" y="215" fill="#3b82f6" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">MFDC</text>
          <text x="490" y="183" fill={hl===1?hc:"#3b82f6"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">TRASFORMATORE</text>
        </g>
        <g opacity={partO(2, 0.85)} filter={hl===2?"url(#dtFocus)":""}>
          <circle cx="300" cy="155" r="14" fill="rgba(239,68,68,0.12)" stroke={hl===2?hc:"#ef4444"} strokeWidth={hl===2?3:2.5} />
          <circle cx="300" cy="225" r="14" fill="rgba(239,68,68,0.12)" stroke={hl===2?hc:"#ef4444"} strokeWidth={hl===2?3:2.5} />
          <text x="320" y="157" fill="#ef4444" fontSize="5" fontFamily="monospace" opacity="0.7">SP1</text>
          <text x="320" y="227" fill="#ef4444" fontSize="5" fontFamily="monospace" opacity="0.7">SP2</text>
          <text x="300" y="40" fill={hl===2?hc:"#ef4444"} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">PUNTE Cu-Cr 12.5kA</text>
          {hl===2&&<><circle cx="300" cy="155" r="20" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" /></circle><circle cx="300" cy="225" r="20" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" /></circle></>}
        </g>
        <g opacity={partO(3, 0.85)} filter={hl===3?"url(#dtFocus)":""}><rect x="80" y="150" width="55" height="35" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===3?hc:"#f59e0b"} strokeWidth={hl===3?3:1.5} /><text x="107" y="172" fill="#f59e0b" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">±0.05mm</text><text x="107" y="143" fill={hl===3?hc:"#f59e0b"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">STAFFAGGIO</text></g>
        <g opacity={partO(4, 0.85)} filter={hl===4?"url(#dtFocus)":""}><rect x="80" y="210" width="55" height="35" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===4?hc:"#a855f7"} strokeWidth={hl===4?3:1.5} /><text x="107" y="232" fill="#a855f7" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">12.5kA</text><text x="107" y="203" fill={hl===4?hc:"#a855f7"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">CORRENTE</text></g>
        <g opacity={partO(5, 0.85)} filter={hl===5?"url(#dtFocus)":""}><rect x="460" y="250" width="55" height="35" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===5?hc:"#22c55e"} strokeWidth={hl===5?3:1.5} /><text x="487" y="272" fill="#22c55e" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">892.340</text><text x="487" y="244" fill={hl===5?hc:"#22c55e"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">CONTACICLI</text></g>
        <text x="300" y="415" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.35">3000 × 2200 × 1500 mm</text>
      </>}

      {type === 'manipolatore' && <>
        <g opacity={dimO(0.9, 0.2)}>
          <ellipse cx="300" cy="430" rx="80" ry="25" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5" />
          <rect x="280" y="100" width="40" height="330" rx="5" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1.5" />
        </g>
        <g opacity={partO(0, 0.85)} filter={hl===0?"url(#dtFocus)":""}>
          <rect x="275" y="350" width="50" height="60" rx="5" fill="rgba(15,23,42,0.9)" stroke={hl===0?hc:"#00d4aa"} strokeWidth={hl===0?3:2} />
          <text x="300" y="385" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">5.5kW</text>
          <text x="300" y="345" fill={hl===0?hc:"#00d4aa"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">MOTORE</text>
          {hl===0&&<rect x="270" y="345" width="60" height="70" rx="7" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(1, 0.85)} filter={hl===1?"url(#dtFocus)":""}>
          <ellipse cx="300" cy="100" rx="40" ry="18" fill="rgba(59,130,246,0.05)" stroke={hl===1?hc:"#3b82f6"} strokeWidth={hl===1?3:2} />
          <circle cx="300" cy="100" r="10" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="300" y="76" fill={hl===1?hc:"#3b82f6"} fontSize="5.5" fontFamily="monospace" textAnchor="middle" opacity="0.7">ENCODER ±0.1°</text>
          {hl===1&&<ellipse cx="300" cy="100" rx="48" ry="24" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></ellipse>}
        </g>
        <g opacity={partO(2, 0.85)} filter={hl===2?"url(#dtFocus)":""}>
          <line x1="300" y1="100" x2="460" y2="135" stroke={hl===2?hc:"#f59e0b"} strokeWidth={hl===2?4:3} />
          <circle cx="460" cy="135" r="8" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="2" />
          <line x1="460" y1="135" x2="430" y2="230" stroke="#f59e0b" strokeWidth="2.5" />
          <rect x="415" y="230" width="40" height="22" rx="4" fill="rgba(0,212,170,0.08)" stroke={hl===2?hc:"#00d4aa"} strokeWidth={hl===2?3:2} />
          {Array.from({length:4},(_, i)=><circle key={i} cx={423+i*8} cy={257} r="4" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.7" />)}
          <text x="435" y="264" fill={hl===2?hc:"#a855f7"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">VENTOSE</text>
          {hl===2&&<rect x="410" y="225" width="50" height="40" rx="6" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
        </g>
        <g opacity={partO(3, 0.85)} filter={hl===3?"url(#dtFocus)":""}><rect x="325" y="380" width="50" height="25" rx="3" fill="rgba(239,68,68,0.05)" stroke={hl===3?hc:"#ef4444"} strokeWidth={hl===3?3:1.5} /><text x="350" y="397" fill="#ef4444" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">PL-e Cat.4</text><text x="350" y="373" fill={hl===3?hc:"#ef4444"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">FINECORSA</text></g>
        <g opacity={partO(4, 0.85)} filter={hl===4?"url(#dtFocus)":""}><rect x="130" y="150" width="55" height="35" rx="4" fill="rgba(15,23,42,0.9)" stroke={hl===4?hc:"#60a5fa"} strokeWidth={hl===4?3:1.5} /><text x="157" y="172" fill="#60a5fa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.7">5.5 Bar</text><text x="157" y="143" fill={hl===4?hc:"#60a5fa"} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.7">PNEUM.</text></g>
        <text x="300" y="465" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.35">Portata max 800 kg</text>
      </>}

      {/* Fallback for other types */}
      {!['adas','sospensioni','avvitatura','maschera','manipolatore'].includes(type) && <>
        <g opacity={dimO(0.9, 0.2)}>
          <polygon points="300,400 500,340 500,320 300,380 100,320 100,340" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1.5" />
          <polygon points="300,380 500,320 500,260 300,320 100,260 100,320" fill="rgba(15,23,42,0.9)" stroke="#334155" strokeWidth="1" />
          <polygon points="300,320 500,260 300,200 100,260" fill="rgba(30,41,59,0.6)" stroke="#475569" strokeWidth="1" />
        </g>
        {components.map((c, i) => {
          const x = 120 + (i % 3) * 160, y = 100 + Math.floor(i / 3) * 120;
          const clr = c.status === 'OK' ? '#00d4aa' : c.status === 'ATTENZIONE' ? '#f59e0b' : '#ef4444';
          return (
            <g key={i} opacity={partO(i, 0.85)} filter={hl===i?"url(#dtFocus)":""}>
              <rect x={x} y={y} width="120" height="70" rx="6" fill="rgba(15,23,42,0.9)" stroke={hl===i?hc:clr} strokeWidth={hl===i?3:1.5} />
              <text x={x+60} y={y+30} fill={clr} fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.8">{c.name.substring(0,18)}</text>
              <text x={x+60} y={y+48} fill={clr} fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" opacity="0.6">{c.value}</text>
              {hl===i&&<rect x={x-5} y={y-5} width="130" height="80" rx="8" fill="none" stroke={hc} strokeWidth="2" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" /></rect>}
            </g>
          );
        })}
        <text x="300" y="420" fill="#00d4aa" fontSize="6" fontFamily="monospace" textAnchor="middle" opacity="0.35">{products.find(p=>p.id===type)?.catia || ''}</text>
      </>}
    </svg>
  );
}

const hours = ['06:00','08:00','10:00','12:00','14:00','16:00'];
const statusColors = { OK: '#22c55e', ATTENZIONE: '#f59e0b', CRITICO: '#ef4444', RUNNING: '#22c55e', WARNING: '#f59e0b', IDLE: '#3b82f6' };

export default function DigitalTwin() {
  const [selected, setSelected] = useState(products[0]);
  const [focusComp, setFocusComp] = useState(-1);
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(15);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [synced, setSynced] = useState(true);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosed, setDiagnosed] = useState(false);
  const [diagResults, setDiagResults] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [simLines, setSimLines] = useState([]);
  const viewportRef = useRef(null);
  const simIntervalRef = useRef(null);

  useEffect(() => {
    if (!autoRotate || focusComp >= 0) return;
    const iv = setInterval(() => setRotY(a => (a + 0.5) % 360), 40);
    return () => clearInterval(iv);
  }, [autoRotate, focusComp]);

  useEffect(() => {
    if (simIntervalRef.current) { clearInterval(simIntervalRef.current); simIntervalRef.current = null; }
    setFocusComp(-1); setDiagnosed(false); setDiagResults([]); setSimulating(false); setSimulated(false); setSimLines([]); setAutoRotate(true); setZoom(1); setRotY(0); setRotX(15);
  }, [selected]);

  useEffect(() => {
    return () => { if (simIntervalRef.current) clearInterval(simIntervalRef.current); };
  }, []);

  const handleMouseDown = useCallback((e) => { setDragging(true); setDragStart({ x: e.clientX, y: e.clientY }); setAutoRotate(false); }, []);
  const handleMouseMove = useCallback((e) => { if (!dragging) return; setRotY(r => r + (e.clientX - dragStart.x) * 0.5); setRotX(r => Math.max(-30, Math.min(45, r + (e.clientY - dragStart.y) * 0.3))); setDragStart({ x: e.clientX, y: e.clientY }); }, [dragging, dragStart]);
  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleDiagnose = () => {
    if (diagnosing) return;
    setDiagnosing(true); setDiagnosed(false); setDiagResults([]);
    const results = selected.components.map(c => ({
      name: c.name,
      status: c.status,
      eff: c.eff,
      alert: c.eff < 80 ? 'CRITICO' : c.eff < 90 ? 'MONITORARE' : 'OK'
    }));
    setTimeout(() => { setDiagResults(results); setDiagnosing(false); setDiagnosed(true); }, 2000);
  };

  const simLog = [
    `> Caricamento modello CATIA V5: ${selected.catia}`,
    '> Importazione vincoli cinematici e materiali...',
    '> Ambiente virtuale inizializzato — Digital Twin sincronizzato',
    '> Avvio simulazione euristica: Algoritmo Genetico + Simulated Annealing',
    '> Popolazione iniziale: 500 individui — Generazioni: 30',
    '> Iterazione 1.000/15.000 — Fitness migliore: -0.4s a ciclo',
    '> Iterazione 5.000/15.000 — Fitness migliore: -1.1s a ciclo',
    '> Iterazione 10.000/15.000 — Fitness migliore: -1.7s a ciclo',
    '> Iterazione 15.000/15.000 — Convergenza raggiunta',
    '> ═══════════════════════════════════════════════',
    `> SIMULAZIONE COMPLETATA (15.000 iterazioni)`,
    `> Ottimizzazione movimenti: -2 secondi a ciclo`,
    `> Risparmio annuo stimato: 14.400s = 4 ore produzione`,
  ];
  const faultLines = selected.components.filter(c => c.eff < 85).map(c => `> [!] ALLARME: ${c.name} — Efficienza ${c.eff}% (soglia: 85%) — Intervento necessario`);

  const handleSimulate = () => {
    if (simulating) return;
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setSimulating(true); setSimulated(false); setSimLines([]);
    const allLines = [...simLog, ...faultLines];
    let idx = 0;
    simIntervalRef.current = setInterval(() => {
      if (idx < allLines.length) {
        const line = allLines[idx] || '';
        idx++;
        setSimLines(p => [...p, line]);
      } else {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
        setSimulating(false);
        setSimulated(true);
      }
    }, 400);
  };

  const avgOee = Math.round(Object.values(selected.oee).reduce((s, v) => s + v, 0) / 6);
  const faultyCount = selected.components.filter(c => c.status !== 'OK').length;

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      {/* LEFT: Product Selector */}
      <div className="w-56 flex-shrink-0 overflow-y-auto" style={{ background: 'var(--color-bg-card)', borderRight: '1px solid var(--color-border)' }}>
        <div className="p-3 pb-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>Seleziona Prodotto</h3>
          <span className="text-[0.45rem]" style={{ color: 'var(--color-text-secondary)' }}>{products.length} asset monitorati</span>
        </div>
        <div className="py-1">
          {products.map(p => (
            <button key={p.id} onClick={() => setSelected(p)}
              className="w-full text-left px-3 py-2 text-[0.65rem] transition-all"
              style={{
                background: p.id === selected.id ? 'linear-gradient(90deg, rgba(0,212,170,0.15), transparent)' : 'transparent',
                color: p.id === selected.id ? '#00d4aa' : 'var(--color-text-secondary)',
                borderLeft: p.id === selected.id ? '3px solid #00d4aa' : '3px solid transparent',
                fontWeight: p.id === selected.id ? 700 : 400,
              }}>
              {p.short}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER + RIGHT */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Asset info card with OEE radar + Sync/Diagnosi */}
        <div className="rounded-xl p-4" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[0.55rem] font-mono font-bold" style={{ color: '#00d4aa' }}>ASSET: {selected.asset}</span>
                <span className="text-[0.5rem] px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColors[selected.status]}15`, color: statusColors[selected.status], border: `1px solid ${statusColors[selected.status]}40` }}>{selected.status}</span>
              </div>
              <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{selected.name}</h2>
              <div className="flex items-center gap-4 text-[0.5rem] font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                <span>Cicli: {selected.cycles}</span>
                <span>Pezzi: {selected.pezziOggi}</span>
                <span>Scarti: {selected.scarti}</span>
                <span>OEE: {avgOee}%</span>
              </div>
            </div>
            <div className="w-44 flex-shrink-0">
              <OEERadar data={selected.oee} />
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={() => setSynced(!synced)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-semibold transition-all"
                style={{ border: '1px solid rgba(0,212,170,0.4)', color: '#00d4aa', background: synced ? 'rgba(0,212,170,0.08)' : 'transparent' }}>
                <RefreshCw size={11} /> {synced ? 'Sincronizzato' : 'Sincronizza'}
              </button>
              <button onClick={handleDiagnose} disabled={diagnosing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.6rem] font-semibold transition-all"
                style={{ border: `1px solid ${diagnosed ? (faultyCount > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)') : 'rgba(0,212,170,0.4)'}`, color: diagnosed ? (faultyCount > 0 ? '#ef4444' : '#22c55e') : '#00d4aa', background: diagnosed ? (faultyCount > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)') : 'transparent' }}>
                {diagnosing ? <><Loader2 size={11} className="animate-spin" /> Diagnosi...</> : diagnosed ? <><CheckCircle size={11} /> {faultyCount > 0 ? `${faultyCount} Allarmi` : 'Diagnosi OK'}</> : <><Activity size={11} /> Diagnosi AI</>}
              </button>
            </div>
          </div>
          {diagnosed && diagResults.length > 0 && (
            <div className="mt-2 pt-2 grid grid-cols-3 gap-1" style={{ borderTop: '1px solid var(--color-border)' }}>
              {diagResults.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded text-[0.5rem]" style={{ background: r.alert === 'CRITICO' ? 'rgba(239,68,68,0.08)' : r.alert === 'MONITORARE' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.05)' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.alert === 'CRITICO' ? '#ef4444' : r.alert === 'MONITORARE' ? '#f59e0b' : '#22c55e' }} />
                  <span className="truncate" style={{ color: 'var(--color-text-primary)' }}>{r.name}</span>
                  <span className="ml-auto font-bold font-mono" style={{ color: r.alert === 'CRITICO' ? '#ef4444' : r.alert === 'MONITORARE' ? '#f59e0b' : '#22c55e' }}>{r.eff}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* 3D VIEWPORT — TONY STARK HOLOGRAPHIC — 2 cols */}
          <div className="col-span-2 rounded-xl overflow-hidden" style={{ background: '#020408', border: '1px solid rgba(0,212,170,0.15)' }}>
            {/* HUD Top Bar */}
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(0,212,170,0.1)', background: 'linear-gradient(90deg, rgba(0,212,170,0.03), transparent, rgba(0,212,170,0.03))' }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-[0.6rem] font-mono font-bold text-green-400">LIVE</span></div>
                <span className="text-xs font-bold tracking-widest" style={{ color: '#00d4aa' }}>HOLOGRAPHIC TWIN</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.5rem] font-mono" style={{ color: 'rgba(0,212,170,0.5)' }}>{selected.catia}</span>
                <span className="text-[0.5rem] font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>{Math.round(zoom*100)}%</span>
                <span className="text-[0.5rem] font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>X:{Math.round(rotX)}° Y:{Math.round(rotY%360)}°</span>
              </div>
            </div>

            <div ref={viewportRef} className="relative select-none"
              style={{ minHeight: '520px', background: 'radial-gradient(ellipse at 50% 60%, rgba(0,212,170,0.04) 0%, #020408 70%)', cursor: dragging ? 'grabbing' : 'grab', overflow: 'hidden' }}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
              onWheel={(e) => { e.preventDefault(); setZoom(z => Math.max(0.3, Math.min(4, z - e.deltaY * 0.002))); }}>

              {/* Holographic CSS Animations */}
              <style>{`
                @keyframes holoSpin { from { transform: rotateZ(0deg); } to { transform: rotateZ(360deg); } }
                @keyframes holoSpinR { from { transform: rotateZ(360deg); } to { transform: rotateZ(0deg); } }
                @keyframes holoScanline { 0% { top: -10%; } 100% { top: 110%; } }
                @keyframes holoPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.8; } }
                @keyframes holoFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
                @keyframes holoGlitch { 0%,92%,100% { transform: translate(0,0) skewX(0deg); opacity:1; } 93% { transform: translate(-3px,1px) skewX(-2deg); opacity:0.8; } 96% { transform: translate(2px,-1px) skewX(1deg); opacity:0.9; } }
                @keyframes particleDrift { 0% { transform: translateY(0) translateX(0); opacity:0; } 10% { opacity:0.6; } 90% { opacity:0.6; } 100% { transform: translateY(-400px) translateX(30px); opacity:0; } }
                @keyframes energyBeam { 0%,100% { opacity:0.1; height:30%; } 50% { opacity:0.4; height:60%; } }
                @keyframes dataFloat { 0%,100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-3px) translateX(2px); } 75% { transform: translateY(2px) translateX(-2px); } }
              `}</style>

              {/* Background Grid */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06, pointerEvents: 'none' }}>
                <defs><pattern id="holoGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4aa" strokeWidth="0.5" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#holoGrid)" />
              </svg>

              {/* Floating Particles */}
              {Array.from({length: 35}, (_, i) => (
                <div key={`p${i}`} className="absolute rounded-full pointer-events-none" style={{
                  width: `${1 + Math.random() * 3}px`, height: `${1 + Math.random() * 3}px`,
                  background: i % 3 === 0 ? '#00d4aa' : i % 3 === 1 ? '#3b82f6' : '#a855f7',
                  left: `${5 + Math.random() * 90}%`, bottom: `${Math.random() * 20}%`,
                  animation: `particleDrift ${6 + Math.random() * 10}s linear ${Math.random() * 8}s infinite`,
                  boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
                }} />
              ))}

              {/* Energy Beams from base */}
              {[20, 35, 50, 65, 80].map((x, i) => (
                <div key={`beam${i}`} className="absolute pointer-events-none" style={{
                  left: `${x}%`, bottom: '12%', width: '1px',
                  background: `linear-gradient(to top, rgba(0,212,170,0.3), transparent)`,
                  animation: `energyBeam ${3 + i * 0.7}s ease-in-out ${i * 0.5}s infinite`,
                }} />
              ))}

              {/* HOLOGRAPHIC PLATFORM — Rotating Rings */}
              <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[70%] max-w-[450px]" style={{ perspective: '600px' }}>
                <div style={{ transform: 'rotateX(70deg)', transformStyle: 'preserve-3d' }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={`ring${i}`} className="absolute rounded-full" style={{
                      width: `${100 - i * 15}%`, height: `${100 - i * 15}%`,
                      left: `${i * 7.5}%`, top: `${i * 7.5}%`,
                      border: `${i === 0 ? 2 : 1}px ${i % 2 === 0 ? 'solid' : 'dashed'} rgba(0,212,170,${0.5 - i * 0.08})`,
                      animation: `${i % 2 === 0 ? 'holoSpin' : 'holoSpinR'} ${8 + i * 4}s linear infinite`,
                      boxShadow: i === 0 ? '0 0 20px rgba(0,212,170,0.2), inset 0 0 20px rgba(0,212,170,0.05)' : 'none',
                    }} />
                  ))}
                  {/* Platform glow */}
                  <div className="absolute inset-[10%] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.12) 0%, transparent 70%)' }} />
                  {/* Cross-hair center */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="absolute left-1/2 top-0 w-[1px] h-full bg-[rgba(0,212,170,0.4)]" />
                    <div className="absolute top-1/2 left-0 h-[1px] w-full bg-[rgba(0,212,170,0.4)]" />
                  </div>
                </div>
              </div>

              {/* THE HOLOGRAM — Multi-layer 3D */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px', perspectiveOrigin: '50% 45%' }}>
                <div style={{
                  transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
                  transformStyle: 'preserve-3d',
                  transition: dragging ? 'none' : 'transform 0.15s ease-out',
                  width: '80%', maxWidth: '480px',
                  animation: 'holoFloat 6s ease-in-out infinite, holoGlitch 12s ease-in-out infinite',
                }}>
                  {selected.imageUrl ? (
                    <div className="relative w-full" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Back depth layer (ghost) */}
                      <div className="absolute inset-0" style={{ transform: 'translateZ(-25px) scale(0.97)', filter: 'blur(2px) brightness(0.4)' }}>
                        <img src={selected.imageUrl} alt="" className="w-full h-auto object-contain opacity-30" style={{ mixBlendMode: 'screen' }} />
                      </div>
                      {/* Middle depth layer */}
                      <div className="absolute inset-0" style={{ transform: 'translateZ(-10px) scale(0.99)', filter: 'blur(0.5px) brightness(0.7)' }}>
                        <img src={selected.imageUrl} alt="" className="w-full h-auto object-contain opacity-40" style={{ mixBlendMode: 'screen' }} />
                      </div>
                      {/* Main hologram layer */}
                      <div className="relative" style={{ transform: 'translateZ(0px)' }}>
                        <img src={selected.imageUrl} alt={selected.name} className="w-full h-auto object-contain" style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 25px rgba(0,212,170,0.4)) drop-shadow(0 0 60px rgba(0,212,170,0.15)) brightness(1.1) contrast(1.05)' }} />
                      </div>
                      {/* Front highlight layer */}
                      <div className="absolute inset-0" style={{ transform: 'translateZ(15px) scale(1.01)', filter: 'blur(1.5px) brightness(1.3)' }}>
                        <img src={selected.imageUrl} alt="" className="w-full h-auto object-contain opacity-15" style={{ mixBlendMode: 'screen' }} />
                      </div>
                      {/* Animated scanline */}
                      <div className="absolute left-0 w-full h-[3px] pointer-events-none" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.6), transparent)',
                        animation: 'holoScanline 4s linear infinite',
                        boxShadow: '0 0 15px rgba(0,212,170,0.4), 0 0 30px rgba(0,212,170,0.2)',
                      }} />
                      {/* Edge glow outline */}
                      <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
                        boxShadow: 'inset 0 0 40px rgba(0,212,170,0.06)',
                        border: '1px solid rgba(0,212,170,0.08)',
                      }} />
                      {/* Focus component highlight */}
                      {focusComp >= 0 && selected.components[focusComp] && (
                        <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
                          border: '2px solid #00d4aa',
                          boxShadow: 'inset 0 0 50px rgba(0,212,170,0.3), 0 0 40px rgba(0,212,170,0.3)',
                          animation: 'holoPulse 2s ease-in-out infinite',
                        }} />
                      )}
                    </div>
                  ) : (
                    <MachineModel type={selected.id} focusIndex={focusComp} components={selected.components} />
                  )}
                </div>
              </div>

              {/* HUD Floating Data Labels */}
              <div className="absolute top-3 left-3 pointer-events-none" style={{ animation: 'dataFloat 8s ease-in-out infinite' }}>
                <div className="px-2 py-1 rounded text-[0.5rem] font-mono" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa', backdropFilter: 'blur(4px)' }}>
                  <div className="font-bold text-[0.55rem] mb-0.5">◆ {selected.asset}</div>
                  <div style={{ color: 'rgba(0,212,170,0.6)' }}>OEE: {avgOee}% · Cicli: {selected.cycles}</div>
                </div>
              </div>

              <div className="absolute top-3 right-3 pointer-events-none" style={{ animation: 'dataFloat 9s ease-in-out 1s infinite' }}>
                <div className="px-2 py-1 rounded text-[0.5rem] font-mono text-right" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', backdropFilter: 'blur(4px)' }}>
                  <div className="font-bold text-[0.55rem] mb-0.5">◆ TELEMETRIA</div>
                  <div style={{ color: 'rgba(59,130,246,0.6)' }}>Pezzi: {selected.pezziOggi} · Scarti: {selected.scarti}</div>
                </div>
              </div>

              {/* Floating component labels around hologram */}
              {selected.components.slice(0, 4).map((c, i) => {
                const positions = [
                  { left: '5%', top: '35%' },
                  { right: '5%', top: '30%' },
                  { left: '8%', top: '60%' },
                  { right: '8%', top: '65%' },
                ];
                const stColor = c.status === 'OK' ? '#00d4aa' : c.status === 'ATTENZIONE' ? '#f59e0b' : '#ef4444';
                return (
                  <div key={`label${i}`} className="absolute pointer-events-none" style={{ ...positions[i], animation: `dataFloat ${7 + i * 2}s ease-in-out ${i * 0.8}s infinite` }}>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.4rem] font-mono" style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${stColor}30`, color: stColor, backdropFilter: 'blur(4px)' }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: stColor, boxShadow: `0 0 4px ${stColor}` }} />
                      {c.name.substring(0, 20)} <span style={{ opacity: 0.6 }}>{c.eff}%</span>
                    </div>
                  </div>
                );
              })}

              {/* Focus component detail overlay */}
              {focusComp >= 0 && selected.components[focusComp] && (
                <div className="absolute bottom-16 right-4 flex items-center gap-2 px-3 py-2 rounded-lg text-[0.6rem] font-bold" style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,212,170,0.5)', color: '#00d4aa', backdropFilter: 'blur(12px)', boxShadow: '0 0 30px rgba(0,212,170,0.15)' }}>
                  <Box size={12} style={{ filter: 'drop-shadow(0 0 4px #00d4aa)' }} />
                  <div>
                    <div>{selected.components[focusComp].name}</div>
                    <div className="text-[0.5rem] font-normal" style={{ color: 'rgba(0,212,170,0.6)' }}>{selected.components[focusComp].value}</div>
                  </div>
                </div>
              )}

              {/* Bottom control bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <button onClick={() => { setAutoRotate(!autoRotate); if (focusComp >= 0) setFocusComp(-1); }} className="text-[0.55rem] px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all hover:scale-105" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa', backdropFilter: 'blur(8px)' }}>
                    {autoRotate && focusComp < 0 ? <><Pause size={10} /> STOP</> : <><Play size={10} /> ORBIT</>}
                  </button>
                  <button onClick={() => setZoom(z => Math.min(4, z + 0.3))} className="text-[0.55rem] px-2 py-1.5 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa', backdropFilter: 'blur(8px)' }}><ZoomIn size={12} /></button>
                  <button onClick={() => setZoom(z => Math.max(0.3, z - 0.3))} className="text-[0.55rem] px-2 py-1.5 rounded-lg transition-all hover:scale-105" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa', backdropFilter: 'blur(8px)' }}><ZoomOut size={12} /></button>
                  {(focusComp >= 0 || zoom !== 1 || rotX !== 15) && (
                    <button onClick={() => { setFocusComp(-1); setZoom(1); setRotX(15); setRotY(0); setAutoRotate(true); }} className="text-[0.55rem] px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all hover:scale-105" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7', backdropFilter: 'blur(8px)' }}>
                      <RotateCcw size={10} /> RESET
                    </button>
                  )}
                </div>
                <div className="text-[0.45rem] font-mono px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(0,212,170,0.4)', border: '1px solid rgba(0,212,170,0.1)' }}>
                  DRAG ↔ ORBIT · SCROLL ↕ ZOOM · CLICK COMPONENT → FOCUS
                </div>
              </div>

              {/* Corner brackets HUD frame */}
              <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[rgba(0,212,170,0.3)] pointer-events-none" />
              <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[rgba(0,212,170,0.3)] pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[rgba(0,212,170,0.3)] pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[rgba(0,212,170,0.3)] pointer-events-none" />
            </div>
          </div>

          {/* RIGHT: Components */}
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(0,212,170,0.03)' }}>
                <div className="flex items-center gap-1.5"><Settings size={11} className="text-[#00d4aa]" /><h3 className="text-[0.65rem] font-bold" style={{ color: 'var(--color-text-primary)' }}>COMPONENTI</h3></div>
                <span className="text-[0.45rem] font-mono" style={{ color: faultyCount > 0 ? '#f59e0b' : '#22c55e' }}>{selected.components.length - faultyCount}/{selected.components.length} OK</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {selected.components.map((c, i) => {
                  const isActive = focusComp === i;
                  const stColor = statusColors[c.status] || '#22c55e';
                  return (
                    <div key={i} onClick={() => { setFocusComp(isActive ? -1 : i); setAutoRotate(false); if (isActive) setAutoRotate(true); }}
                      className="px-3 py-1.5 cursor-pointer transition-all"
                      style={{ background: isActive ? 'rgba(0,212,170,0.06)' : 'transparent', borderLeft: isActive ? '3px solid #00d4aa' : '3px solid transparent' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: stColor, boxShadow: c.status !== 'OK' ? `0 0 4px ${stColor}` : 'none' }} />
                          <span className="text-[0.55rem] font-semibold truncate" style={{ color: isActive ? '#00d4aa' : 'var(--color-text-primary)' }}>{c.name}</span>
                        </div>
                        <span className="text-[0.4rem] px-1 py-0.5 rounded-full font-bold flex-shrink-0 ml-1" style={{ background: `${stColor}15`, color: stColor }}>{c.status}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[0.45rem] font-mono" style={{ color: 'var(--color-text-secondary)' }}>{c.value}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
                            <div className="h-full rounded-full" style={{ width: `${c.eff}%`, background: c.eff > 90 ? '#00d4aa' : c.eff > 75 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span className="text-[0.4rem] font-mono w-6 text-right" style={{ color: 'var(--color-text-secondary)' }}>{c.eff}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Production mini chart */}
            <div className="rounded-xl p-2.5" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-[0.6rem] font-bold" style={{ color: 'var(--color-text-primary)' }}>PRODUZIONE</h3>
                <span className="text-[0.45rem] font-mono" style={{ color: '#3b82f6' }}>{selected.pezziOggi} pz</span>
              </div>
              <div className="flex items-end gap-0.5" style={{ height: '45px' }}>
                {selected.production.map((v, i) => {
                  const maxV = Math.max(...selected.target);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full relative" style={{ height: '38px' }}>
                        <div className="absolute bottom-0 w-full rounded-t" style={{ height: `${(selected.target[i] / maxV) * 100}%`, background: 'rgba(59,130,246,0.08)', borderTop: '1px dashed rgba(59,130,246,0.3)' }} />
                        <div className="absolute bottom-0 w-full rounded-t" style={{ height: `${(v / maxV) * 100}%`, background: v >= selected.target[i] ? 'rgba(0,212,170,0.5)' : 'rgba(245,158,11,0.5)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Simulation */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-1.5"><Zap size={11} className="text-[#a855f7]" /><h3 className="text-[0.65rem] font-bold" style={{ color: 'var(--color-text-primary)' }}>SIMULAZIONE LINEA & OTTIMIZZAZIONE EURISTICA</h3></div>
            <button onClick={handleSimulate} disabled={simulating} className="text-[0.5rem] px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-all"
              style={{ background: simulated ? 'rgba(34,197,94,0.1)' : simulating ? 'rgba(168,85,247,0.1)' : 'rgba(0,212,170,0.1)', border: `1px solid ${simulated ? 'rgba(34,197,94,0.3)' : simulating ? 'rgba(168,85,247,0.3)' : 'rgba(0,212,170,0.3)'}`, color: simulated ? '#22c55e' : simulating ? '#a855f7' : '#00d4aa' }}>
              {simulating ? <><Loader2 size={9} className="animate-spin" /> Simulazione...</> : simulated ? <><CheckCircle size={9} /> Completata</> : <><Zap size={9} /> Avvia Simulazione</>}
            </button>
          </div>
          <div className="p-2.5 font-mono text-[0.5rem] leading-relaxed overflow-y-auto" style={{ maxHeight: '110px', color: '#00d4aa', background: 'rgba(0,0,0,0.3)' }}>
            {simLines.length > 0 ? simLines.map((l, i) => (
              <div key={i} style={{ color: (l||'').includes('[!]') ? '#ef4444' : (l||'').includes('COMPLETATA') || (l||'').includes('Ottimizzazione') || (l||'').includes('Risparmio') ? '#22c55e' : '#00d4aa', fontWeight: (l||'').includes('COMPLETATA') || (l||'').includes('[!]') ? 700 : 400 }}>{l}</div>
            )) : (
              <div style={{ color: 'var(--color-text-secondary)' }}>Simula l'intera linea: il Digital Twin testa 15.000 configurazioni e segnala componenti fuori soglia.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}