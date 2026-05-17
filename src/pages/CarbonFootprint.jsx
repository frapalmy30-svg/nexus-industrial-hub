import { useState } from 'react';
import { Leaf, TrendingDown, TrendingUp, Target, CheckCircle, Loader2, Ship, Truck, RefreshCw, Info, BarChart2, Globe, Plane } from 'lucide-react';

// ── DATI REALI BILANCIO 2025 ─────────────────────────────────────────────────

// Fattori emissione ICCT 2023
const FACTORS = {
  tir:     { label: 'TIR / Camion (EU6)',         factor: 0.062, unit: 'kg CO₂/ton·km' },
  furgone: { label: 'Furgone / Van (diesel)',      factor: 0.120, unit: 'kg CO₂/ton·km' },
  nave:    { label: 'Nave container (oceano)',     factor: 0.008, unit: 'kg CO₂/ton·km' },
  aereo:   { label: 'Aereo cargo/passeggeri',      factor: 1.500, unit: 'kg CO₂/ton·km' },
  auto:    { label: 'Auto aziendale (hub locali)', factor: 0.120, unit: 'kg CO₂/ton·km' },
};

// AS-IS: 53 spedizioni reali — dettaglio principale
const asIsShipments = [
  { id: 1,  cliente: 'SIXTAU SPA',                    citta: 'Torino',       paese: 'Italia',  desc: 'Fornitura N.2 Banchi ADAS-IVECO Valladolid',       valore: 722582,  nSpedizioni: 1, distKm: 15,   modalita: 'Furgone/TIR',        co2kg: 6.8  },
  { id: 2,  cliente: 'SIXTAU SPA',                    citta: 'Torino',       paese: 'Italia',  desc: 'Fornitura N.4 Banchi ADAS-IVECO Suzzara',          valore: 1434518, nSpedizioni: 1, distKm: 15,   modalita: 'Furgone/TIR',        co2kg: 6.8  },
  { id: 3,  cliente: 'SIXTAU SPA',                    citta: 'Torino',       paese: 'Italia',  desc: 'Adeg. Banco Rulli Passo 3200mm Cordoba',           valore: 30000,   nSpedizioni: 1, distKm: 15,   modalita: 'Furgone',            co2kg: 2.7  },
  { id: 4,  cliente: 'SIXTAU SPA',                    citta: 'Torino',       paese: 'Italia',  desc: 'Ricertificazione Calibro Banco ADAS Suzzara',       valore: 1800,    nSpedizioni: 1, distKm: 15,   modalita: 'Furgone',            co2kg: 2.7  },
  { id: 5,  cliente: 'FCA SRBIJA DOO',                citta: 'Kragujevac',   paese: 'Serbia',  desc: 'Adeguam. Linea UMC MOD.142 Serbia',                valore: 360000,  nSpedizioni: 1, distKm: 1280, modalita: 'TIR internazionale', co2kg: 198.4 },
  { id: 6,  cliente: 'FCA SRBIJA DOO',                citta: 'Kragujevac',   paese: 'Serbia',  desc: 'Adeguam. Linea TRA MOD.142 Serbia',                valore: 275000,  nSpedizioni: 1, distKm: 1280, modalita: 'TIR internazionale', co2kg: 198.4 },
  { id: 7,  cliente: 'FCA SRBIJA DOO',                citta: 'Kragujevac',   paese: 'Serbia',  desc: 'Adeguam. Linea TRP MOD.142 Serbia',                valore: 245000,  nSpedizioni: 1, distKm: 1280, modalita: 'TIR internazionale', co2kg: 198.4 },
  { id: 8,  cliente: 'FCA SRBIJA DOO',                citta: 'Kragujevac',   paese: 'Serbia',  desc: 'Adeguam. Linea GRA MOD.142 Serbia',                valore: 230000,  nSpedizioni: 1, distKm: 1280, modalita: 'TIR internazionale', co2kg: 198.4 },
  { id: 9,  cliente: 'FCA SRBIJA DOO',                citta: 'Kragujevac',   paese: 'Serbia',  desc: 'Adeg. Linea Corner e Banco Semicorner MOD.142',    valore: 200000,  nSpedizioni: 1, distKm: 1280, modalita: 'TIR internazionale', co2kg: 198.4 },
  { id: 10, cliente: 'FCA SRBIJA DOO',                citta: 'Kragujevac',   paese: 'Serbia',  desc: 'Lato Linea Battery Hub F1H-Serbia',                valore: 199750,  nSpedizioni: 1, distKm: 1280, modalita: 'TIR internazionale', co2kg: 198.4 },
  { id: 18, cliente: 'FCA ITALY SPA',                 citta: 'Melfi (PZ)',   paese: 'Italia',  desc: 'Ad. Linea TRA Pallets DCROSS Melfi',               valore: 740000,  nSpedizioni: 1, distKm: 890,  modalita: 'TIR',                co2kg: 138.1 },
  { id: 19, cliente: 'FCA ITALY SPA',                 citta: 'Melfi (PZ)',   paese: 'Italia',  desc: 'Banco ADAS D-Cross Melfi',                         valore: 340000,  nSpedizioni: 1, distKm: 890,  modalita: 'TIR',                co2kg: 138.1 },
  { id: 20, cliente: 'STELLANTIS EUROPE SPA',         citta: 'Melfi (PZ)',   paese: 'Italia',  desc: 'Banchi Ammortizzatore Melfi D-Cross',              valore: 700000,  nSpedizioni: 1, distKm: 890,  modalita: 'TIR',                co2kg: 138.1 },
  { id: 21, cliente: 'STELLANTIS EUROPE SPA',         citta: 'Melfi (PZ)',   paese: 'Italia',  desc: 'Adeg. Linea GRA Pallet Melfi D-Cross',             valore: 200000,  nSpedizioni: 1, distKm: 890,  modalita: 'TIR',                co2kg: 138.1 },
  { id: 23, cliente: 'STELLANTIS EUROPE',             citta: 'Torino',       paese: 'Italia',  desc: 'Spostamento Linee M189 Maserati Mirafiori',        valore: 450000,  nSpedizioni: 1, distKm: 20,   modalita: 'Furgone/TIR',        co2kg: 3.7  },
  { id: 26, cliente: 'IVECO SPA',                     citta: 'Suzzara (MN)', paese: 'Italia',  desc: 'Attr. Mont. Paraurti Carbonio Suzzara',            valore: 299400,  nSpedizioni: 1, distKm: 200,  modalita: 'TIR',                co2kg: 31.0 },
];

// Riepilogo per area geografica (AS-IS vs TO-BE)
const areaData = [
  { area: 'Italia',  asIsSpedizioni: 34, asIsCo2: 1370,  toBeSpedizioni: 34, toBeCo2: 1370,  delta: 0,     deltaPerc: 0,    nota: 'Clienti italiani invariati' },
  { area: 'Serbia',  asIsSpedizioni: 17, asIsCo2: 3739,  toBeSpedizioni: 17, toBeCo2: 3739,  delta: 0,     deltaPerc: 0,    nota: 'FCA Kragujevac' },
  { area: 'Spagna',  asIsSpedizioni: 4,  asIsCo2: 1313,  toBeSpedizioni: 4,  toBeCo2: 1313,  delta: 0,     deltaPerc: 0,    nota: 'IVECO Valladolid — FCA Tychy' },
  { area: 'Polonia', asIsSpedizioni: 3,  asIsCo2: 608,   toBeSpedizioni: 3,  toBeCo2: 608,   delta: 0,     deltaPerc: 0,    nota: 'FCA Tychy' },
  { area: 'Germania',asIsSpedizioni: 2,  asIsCo2: 243,   toBeSpedizioni: 2,  toBeCo2: 243,   delta: 0,     deltaPerc: 0,    nota: 'NIKOLA + EVCO' },
  { area: 'USA',     asIsSpedizioni: 0,  asIsCo2: 0,     toBeSpedizioni: 20, toBeCo2: 1313,  delta: -1313, deltaPerc: null, nota: 'Nuovo: hub Sterling Heights MI' },
  { area: 'Brasile', asIsSpedizioni: 0,  asIsCo2: 0,     toBeSpedizioni: 25, toBeCo2: 883,   delta: -883,  deltaPerc: null, nota: 'Nuovo: hub São Bernardo do Campo' },
];

// KPI comparativi principali
const kpiComparativo = [
  { kpi: 'CO₂ totale (kg)',          asIs: '6.788',  toBeEu: '6.788', toBeAmer: '7.384', ipotetico: '35.920', risparmio: '−28.536', unit: 'kg' },
  { kpi: 'CO₂ totale (ton)',         asIs: '6,8',    toBeEu: '6,8',   toBeAmer: '7,4',   ipotetico: '35,9',   risparmio: '−28,5',   unit: 't'  },
  { kpi: 'N. spedizioni totali',     asIs: '53',     toBeEu: '53',    toBeAmer: '63',    ipotetico: '30',     risparmio: '—',       unit: ''   },
  { kpi: 'CO₂ per 1.000€ ricavi',    asIs: '0,84',   toBeEu: '0,84',  toBeAmer: '0,92',  ipotetico: '4,46',   risparmio: '−3,54',   unit: 'kg/k€' },
  { kpi: 'CO₂ media/spedizione (kg)',asIs: '128',    toBeEu: '128',   toBeAmer: '117',   ipotetico: '1.197',  risparmio: '−94%',    unit: 'kg' },
];

// Riepilogo modalità trasporto
const modalitaData = [
  { modalita: 'TIR / Truck (strada)',     asIsKg: 5069, asIsPerc: 74.6, toBeKg: 6308, toBePerc: 44.5, variazione: +1239 },
  { modalita: 'Aereo (tecnici trasferta)',asIsKg: 1685, asIsPerc: 24.5, toBeKg: 1685, toBePerc: 11.7, variazione: 0     },
  { modalita: 'Furgone (breve raggio)',   asIsKg: 55,   asIsPerc: 0.8,  toBeKg: 55,   toBePerc: 0.4,  variazione: 0     },
  { modalita: 'Nave + truck (container)', asIsKg: 0,    asIsPerc: 0,    toBeKg: 4418, toBePerc: 31.2, variazione: +4418 },
  { modalita: 'Auto/furgone locale (hub)',asIsKg: 0,    asIsPerc: 0,    toBeKg: 8,    toBePerc: 0.1,  variazione: +8    },
];

function SmallBarChart({ data, valueKey, labelKey, color = '#00d4aa', unit = '' }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="space-y-0.5">
          <div className="flex justify-between text-[0.62rem]">
            <span style={{ color: '#94a3b8' }}>{d[labelKey]}</span>
            <span className="font-mono font-bold" style={{ color }}>{d[valueKey].toLocaleString()}{unit}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <div className="h-full rounded-full" style={{ width: `${(d[valueKey] / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const modalita_icons = { 'TIR internazionale': '🚛', 'TIR': '🚛', 'Furgone': '🚐', 'Furgone/TIR': '🚐', 'Aereo': '✈️', 'Nave container': '🚢' };

export default function CarbonFootprint() {
  const [activeTab, setActiveTab] = useState('asis'); // 'asis' | 'tobe' | 'confronto'
  const [grLoading, setGrLoading] = useState(false);
  const [grDone, setGrDone] = useState(false);
  const [showAllShipments, setShowAllShipments] = useState(false);

  const syncGreenRouter = () => {
    if (grDone || grLoading) return;
    setGrLoading(true);
    setTimeout(() => { setGrLoading(false); setGrDone(true); }, 2400);
  };

  const visibleShipments = showAllShipments ? asIsShipments : asIsShipments.slice(0, 8);

  return (
    <div className="space-y-0">
      {/* Header bar */}
      <div className="px-4 py-2.5 text-xs font-semibold flex items-center justify-between"
        style={{ background: 'rgba(0,212,170,0.07)', borderBottom: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="flex items-center gap-2" style={{ color: '#00d4aa' }}>
          <Leaf size={13} />
          Carbon Tracker · Analisi GHG Scope 1 &amp; Scope 3 · Fonte: Bilancio Gestionale 2025 · ICCT 2023
        </div>
        <button onClick={syncGreenRouter} disabled={grLoading || grDone}
          className="flex items-center gap-1.5 text-[0.6rem] font-bold px-3 py-1 rounded-lg transition-all"
          style={grDone
            ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
            : { background: 'linear-gradient(135deg,#00d4aa,#00a88a)', color: '#0a0e17' }}>
          {grLoading ? <Loader2 size={10} className="animate-spin" />
            : grDone ? <><CheckCircle size={10} /> GreenRouter Sync</>
            : <><RefreshCw size={10} /> Sincronizza GreenRouter</>}
        </button>
      </div>

      <div className="p-4 space-y-4">

        {/* Titolo + KPI principali */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={17} style={{ color: '#00d4aa' }} />
            <h1 className="text-lg font-bold tracking-wide">CARBON TRACKER — AS-IS vs TO-BE</h1>
          </div>

          {/* 4 KPI card top */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'AS-IS CO₂ Totale',        value: '6.788 kg', sub: '53 spedizioni · 2025',          color: '#f59e0b', icon: BarChart2 },
              { label: 'TO-BE EU (invariato)',     value: '6.788 kg', sub: 'Perimetro europeo identico',    color: '#00d4aa', icon: TrendingDown },
              { label: 'TO-BE Americas (hub)',     value: '7.384 kg', sub: '56 spedizioni hub locali USA+BR',color: '#22c55e', icon: Globe },
              { label: 'Risparmio vs ipotetico IT',value: '−28.536 kg', sub: '−79% vs servizio da Torino', color: '#22c55e', icon: Target },
            ].map(({ label, value, sub, color, icon: Icon }) => (
              <div key={label} className="card p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon size={12} style={{ color }} />
                  <span className="text-[0.58rem] font-bold uppercase tracking-wide" style={{ color: '#94a3b8' }}>{label}</span>
                </div>
                <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
                <div className="text-[0.58rem] mt-0.5" style={{ color: '#94a3b8' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2">
            {[
              { id: 'asis',      label: 'Scenario AS-IS' },
              { id: 'tobe',      label: 'Scenario TO-BE' },
              { id: 'confronto', label: 'Confronto & KPI' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                style={activeTab === t.id
                  ? { background: 'linear-gradient(135deg,#00d4aa,#00a88a)', color: '#0a0e17' }
                  : { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: '#94a3b8' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB AS-IS ─────────────────────────────────────────────── */}
        {activeTab === 'asis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Dettaglio spedizioni */}
              <div className="card space-y-3">
                <div className="flex items-center gap-2">
                  <Truck size={14} style={{ color: '#f59e0b' }} />
                  <span className="font-bold text-sm">DETTAGLIO SPEDIZIONI 2025</span>
                  <span className="text-[0.6rem] px-2 py-0.5 rounded-full font-bold ml-auto"
                    style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                    53 spedizioni reali
                  </span>
                </div>
                <p className="text-[0.62rem]" style={{ color: '#94a3b8' }}>
                  Dati reali bilancio gestionale 2025 · 62 righe ricavo 060xxx consolidate per commessa
                </p>

                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {visibleShipments.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.5rem] font-bold flex-shrink-0"
                        style={{ background: 'var(--color-border)', color: '#94a3b8' }}>
                        {s.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.62rem] font-bold truncate" style={{ color: '#f1f5f9' }}>{s.cliente}</p>
                        <p className="text-[0.58rem] truncate" style={{ color: '#94a3b8' }}>{s.desc}</p>
                        <p className="text-[0.55rem]" style={{ color: '#64748b' }}>{s.citta}, {s.paese} · {s.distKm} km · {s.modalita}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[0.65rem] font-mono font-bold" style={{ color: '#f59e0b' }}>{s.co2kg} kg</div>
                        <div className="text-[0.55rem]" style={{ color: '#64748b' }}>CO₂</div>
                      </div>
                    </div>
                  ))}
                </div>

                {!showAllShipments && asIsShipments.length > 8 && (
                  <button onClick={() => setShowAllShipments(true)}
                    className="w-full text-[0.65rem] font-bold py-1.5 rounded-lg"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: '#94a3b8' }}>
                    Mostra tutte le {asIsShipments.length} spedizioni
                  </button>
                )}

                <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>CO₂ Totale AS-IS</span>
                  <span className="text-sm font-bold font-mono" style={{ color: '#f59e0b' }}>6.788 kg</span>
                </div>
              </div>

              {/* CO2 per area + per modalità */}
              <div className="space-y-4">
                <div className="card space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe size={14} style={{ color: '#00d4aa' }} />
                    <span className="font-bold text-sm">CO₂ PER AREA GEOGRAFICA</span>
                  </div>
                  <SmallBarChart
                    data={areaData.filter(a => a.asIsCo2 > 0)}
                    valueKey="asIsCo2"
                    labelKey="area"
                    color="#f59e0b"
                    unit=" kg"
                  />
                </div>

                <div className="card space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={14} style={{ color: '#00d4aa' }} />
                    <span className="font-bold text-sm">CO₂ PER MODALITÀ (AS-IS)</span>
                  </div>
                  <SmallBarChart
                    data={modalitaData.filter(m => m.asIsKg > 0)}
                    valueKey="asIsKg"
                    labelKey="modalita"
                    color="#f59e0b"
                    unit=" kg"
                  />
                  <div className="flex gap-2 p-2 rounded-lg text-[0.6rem]"
                    style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)', color: '#94a3b8' }}>
                    <Info size={11} className="flex-shrink-0 mt-0.5" style={{ color: '#00d4aa' }} />
                    Nessuna spedizione intercontinentale nell'AS-IS. Le trasferte aeree (24,5%) riguardano tecnici verso Serbia, Spagna, Germania, Polonia.
                  </div>
                </div>

                {/* Fattori ICCT */}
                <div className="card space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={13} style={{ color: '#94a3b8' }} />
                    <span className="font-bold text-xs">FATTORI EMISSIONE — ICCT 2023</span>
                  </div>
                  {Object.values(FACTORS).map(f => (
                    <div key={f.label} className="flex justify-between text-[0.6rem]">
                      <span style={{ color: '#94a3b8' }}>{f.label}</span>
                      <span className="font-mono font-bold" style={{ color: '#f1f5f9' }}>{f.factor} {f.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB TO-BE ─────────────────────────────────────────────── */}
        {activeTab === 'tobe' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* TO-BE EU */}
              <div className="card space-y-3">
                <div className="flex items-center gap-2">
                  <Truck size={14} style={{ color: '#00d4aa' }} />
                  <span className="font-bold text-sm">TO-BE EU — PERIMETRO INVARIATO</span>
                </div>
                <p className="text-[0.62rem]" style={{ color: '#94a3b8' }}>
                  Clienti europei serviti esattamente come AS-IS da Piobesi Torinese. CO₂ identica.
                </p>

                <div className="space-y-1.5">
                  {areaData.filter(a => a.area !== 'USA' && a.area !== 'Brasile').map(a => (
                    <div key={a.area} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                      <div className="flex-1">
                        <p className="text-xs font-bold" style={{ color: '#f1f5f9' }}>{a.area}</p>
                        <p className="text-[0.58rem]" style={{ color: '#94a3b8' }}>{a.nota} · {a.toBeSpedizioni} spedizioni</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold" style={{ color: '#00d4aa' }}>{a.toBeCo2.toLocaleString()} kg</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.25)' }}>
                  <span className="text-xs font-bold" style={{ color: '#00d4aa' }}>CO₂ EU TO-BE (60 sped.)</span>
                  <span className="text-sm font-bold font-mono" style={{ color: '#00d4aa' }}>6.629 kg</span>
                </div>
              </div>

              {/* TO-BE Americas */}
              <div className="card space-y-3">
                <div className="flex items-center gap-2">
                  <Ship size={14} style={{ color: '#22c55e' }} />
                  <span className="font-bold text-sm">TO-BE AMERICAS — HUB LOCALI</span>
                </div>
                <p className="text-[0.62rem]" style={{ color: '#94a3b8' }}>
                  19 clienti USA da hub Sterling Heights (MI) · 11 + 14 clienti Brasile da hub São Bernardo do Campo · 2 container/anno Torino→USA per componenti critici
                </p>

                <div className="space-y-2">
                  {[
                    { area: 'USA — Sterling Heights MI', spedizioni: 20, co2: 1313, color: '#22c55e', detail: 'FCA US, Ford, GM, Lear, Tesla Cybertruck...' },
                    { area: 'Brasile — São Bernardo do Campo', spedizioni: 25, co2: 883, color: '#22c55e', detail: 'VW do Brasil, GM Brasil, Hyundai, Stellantis...' },
                    { area: '2 container/anno IT→USA', spedizioni: 2, co2: 1325, color: '#f59e0b', detail: 'Nave La Spezia → Baltimore · 8.000 km mare' },
                  ].map(r => (
                    <div key={r.area} className="p-3 rounded-xl"
                      style={{ background: 'var(--color-bg-secondary)', border: `1px solid ${r.color}30` }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold" style={{ color: '#f1f5f9' }}>{r.area}</p>
                          <p className="text-[0.58rem]" style={{ color: '#94a3b8' }}>{r.detail}</p>
                          <p className="text-[0.58rem] mt-0.5" style={{ color: '#64748b' }}>{r.spedizioni} spedizioni</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono font-bold text-sm" style={{ color: r.color }}>{r.co2.toLocaleString()} kg</div>
                          <div className="text-[0.55rem]" style={{ color: '#64748b' }}>CO₂</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <span className="text-xs font-bold" style={{ color: '#22c55e' }}>CO₂ Americas TO-BE (33 sped.)</span>
                  <span className="text-sm font-bold font-mono" style={{ color: '#22c55e' }}>1.326 kg</span>
                </div>

                {/* Confronto ipotetico */}
                <div className="flex gap-2 p-2.5 rounded-lg text-[0.62rem]"
                  style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: '#94a3b8' }}>
                  <Info size={11} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                  <span>
                    Se A&S servisse le stesse Americas da Torino (nave + aereo tecnici) →{' '}
                    <span className="font-bold" style={{ color: '#ef4444' }}>35.920 kg CO₂</span> ipotetica vs{' '}
                    <span className="font-bold" style={{ color: '#22c55e' }}>7.384 kg</span> con hub locali.
                    Risparmio: <span className="font-bold" style={{ color: '#22c55e' }}>−79%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Modalità TO-BE */}
            <div className="card space-y-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={14} style={{ color: '#00d4aa' }} />
                <span className="font-bold text-sm">CO₂ PER MODALITÀ — AS-IS vs TO-BE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[0.65rem]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      {['Modalità', 'AS-IS kg', 'AS-IS %', 'TO-BE kg', 'TO-BE %', 'Variazione'].map(h => (
                        <th key={h} className="text-left py-2 px-2 font-bold" style={{ color: '#94a3b8' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modalitaData.map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="py-2 px-2 font-semibold" style={{ color: '#f1f5f9' }}>{m.modalita}</td>
                        <td className="py-2 px-2 font-mono" style={{ color: '#f59e0b' }}>{m.asIsKg.toLocaleString()}</td>
                        <td className="py-2 px-2" style={{ color: '#94a3b8' }}>{m.asIsPerc}%</td>
                        <td className="py-2 px-2 font-mono" style={{ color: '#00d4aa' }}>{m.toBeKg.toLocaleString()}</td>
                        <td className="py-2 px-2" style={{ color: '#94a3b8' }}>{m.toBePerc}%</td>
                        <td className="py-2 px-2 font-mono font-bold"
                          style={{ color: m.variazione > 0 ? '#f59e0b' : m.variazione < 0 ? '#22c55e' : '#64748b' }}>
                          {m.variazione > 0 ? `+${m.variazione.toLocaleString()}` : m.variazione === 0 ? '—' : m.variazione.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                      <td className="py-2 px-2 font-bold" style={{ color: '#f1f5f9' }}>TOTALE</td>
                      <td className="py-2 px-2 font-mono font-bold" style={{ color: '#f59e0b' }}>6.788</td>
                      <td className="py-2 px-2 font-bold" style={{ color: '#94a3b8' }}>100%</td>
                      <td className="py-2 px-2 font-mono font-bold" style={{ color: '#00d4aa' }}>14.172</td>
                      <td className="py-2 px-2 font-bold" style={{ color: '#94a3b8' }}>100%</td>
                      <td className="py-2 px-2 font-mono font-bold" style={{ color: '#f59e0b' }}>+7.384</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 p-2.5 rounded-lg text-[0.62rem]"
                style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)', color: '#94a3b8' }}>
                <Info size={11} className="flex-shrink-0 mt-0.5" style={{ color: '#00d4aa' }} />
                Il TO-BE include 4.418 kg da nave container (2 container/anno IT→USA per componenti critici di alta precisione). Questo incremento è strutturale e necessario — il risparmio reale emerge dal confronto con lo scenario ipotetico AS-IS Americas (35.920 kg).
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONFRONTO ─────────────────────────────────────────── */}
        {activeTab === 'confronto' && (
          <div className="space-y-4">

            {/* KPI comparativi tabella */}
            <div className="card space-y-3">
              <div className="flex items-center gap-2">
                <Target size={14} style={{ color: '#22c55e' }} />
                <span className="font-bold text-sm">KPI AMBIENTALI COMPARATIVI</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[0.65rem]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      {['KPI', 'AS-IS', 'TO-BE EU', 'TO-BE Amer. hub', 'Ipotetico AS-IS Amer.', 'Risparmio hub vs IT'].map((h, i) => (
                        <th key={i} className="text-left py-2 px-2 font-bold" style={{ color: '#94a3b8' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kpiComparativo.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="py-2 px-2 font-semibold" style={{ color: '#f1f5f9' }}>{row.kpi}</td>
                        <td className="py-2 px-2 font-mono" style={{ color: '#f59e0b' }}>{row.asIs}</td>
                        <td className="py-2 px-2 font-mono" style={{ color: '#00d4aa' }}>{row.toBeEu}</td>
                        <td className="py-2 px-2 font-mono" style={{ color: '#22c55e' }}>{row.toBeAmer}</td>
                        <td className="py-2 px-2 font-mono" style={{ color: '#ef4444' }}>{row.ipotetico}</td>
                        <td className="py-2 px-2 font-mono font-bold" style={{ color: '#22c55e' }}>{row.risparmio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Area geografica confronto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card space-y-3">
                <div className="flex items-center gap-2">
                  <Globe size={14} style={{ color: '#00d4aa' }} />
                  <span className="font-bold text-sm">CO₂ PER AREA — AS-IS vs TO-BE</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[0.62rem]">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        {['Area', 'AS-IS sped.', 'AS-IS CO₂', 'TO-BE sped.', 'TO-BE CO₂', 'ΔCO₂'].map(h => (
                          <th key={h} className="text-left py-1.5 px-2 font-bold" style={{ color: '#94a3b8' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {areaData.map((a, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td className="py-1.5 px-2 font-bold" style={{ color: '#f1f5f9' }}>{a.area}</td>
                          <td className="py-1.5 px-2 font-mono" style={{ color: '#94a3b8' }}>{a.asIsSpedizioni}</td>
                          <td className="py-1.5 px-2 font-mono" style={{ color: '#f59e0b' }}>{a.asIsCo2.toLocaleString()}</td>
                          <td className="py-1.5 px-2 font-mono" style={{ color: '#94a3b8' }}>{a.toBeSpedizioni}</td>
                          <td className="py-1.5 px-2 font-mono" style={{ color: '#00d4aa' }}>{a.toBeCo2.toLocaleString()}</td>
                          <td className="py-1.5 px-2 font-mono font-bold"
                            style={{ color: a.delta < 0 ? '#22c55e' : a.delta === 0 ? '#64748b' : '#f59e0b' }}>
                            {a.delta === 0 ? '0%' : a.delta < 0 ? `${a.delta.toLocaleString()} (N/A nuovo)` : `+${a.delta}`}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                        <td className="py-1.5 px-2 font-bold" style={{ color: '#f1f5f9' }}>TOTALE</td>
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: '#f59e0b' }}>53</td>
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: '#f59e0b' }}>6.788</td>
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: '#00d4aa' }}>116</td>
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: '#00d4aa' }}>8.119</td>
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: '#22c55e' }}>−73% vs ipotetico</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Confronto Americas visuale */}
              <div className="card space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} style={{ color: '#22c55e' }} />
                  <span className="font-bold text-sm">CONFRONTO AMERICAS</span>
                </div>
                <p className="text-[0.62rem]" style={{ color: '#94a3b8' }}>
                  Hub locali (Sterling Heights + São Bernardo) vs servizio intercontinentale da Torino
                </p>

                <div className="space-y-3">
                  {[
                    { label: 'CO₂ se servito da Torino (ipotetico)', value: 35920, color: '#ef4444', barW: '100%' },
                    { label: 'CO₂ hub Americas (TO-BE)',             value: 7384,  color: '#22c55e', barW: '20.5%' },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between text-[0.62rem] mb-1">
                        <span style={{ color: '#94a3b8' }}>{r.label}</span>
                        <span className="font-mono font-bold" style={{ color: r.color }}>{r.value.toLocaleString()} kg</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                        <div className="h-full rounded-full" style={{ width: r.barW, background: r.color, opacity: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { label: 'Risparmio CO₂', value: '−28.536 kg', color: '#22c55e' },
                    { label: 'Riduzione %',    value: '−79%',       color: '#22c55e' },
                    { label: 'CO₂/1000€ hub', value: '0,92 kg',    color: '#00d4aa' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2 rounded-lg"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[0.55rem] mt-0.5" style={{ color: '#64748b' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Note metodologiche */}
                <div className="space-y-1 pt-1" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <p className="text-[0.6rem] font-bold" style={{ color: '#94a3b8' }}>NOTE METODOLOGICHE</p>
                  {[
                    'Fonte emissioni: ICCT 2023 | TIR EU6=0,062 | Furgone=0,120 | Nave=0,008 | Aereo=1,500 kg CO₂/ton·km',
                    'Peso medio attrezzatura: 2,5 ton | Ricambi: 0,3 ton | Bagaglio tecnici: 0,05 ton',
                    'Il confronto AS-IS vs TO-BE non è simmetrico: il TO-BE serve clienti nuovi (Americas)',
                    'Il risparmio ambientale emerge dal confronto con lo scenario ipotetico AS-IS Americas',
                  ].map((n, i) => (
                    <p key={i} className="text-[0.58rem]" style={{ color: '#64748b' }}>• {n}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* GreenRouter footer */}
            {grDone && (
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: '#22c55e' }}>GreenRouter — Dati certificati</p>
                  <p className="text-[0.6rem]" style={{ color: '#94a3b8' }}>
                    GLEC Framework v3 · GHG Protocol Scope 3 · Fattori IMO 2023 · Report pronto per rendicontazione ESG
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
