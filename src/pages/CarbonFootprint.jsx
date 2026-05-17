import { useState } from 'react';
import { Leaf, TrendingDown, TrendingUp, Target, Zap, CheckCircle, Loader2, MapPin, Ship, Truck, RefreshCw, AlertTriangle, Info } from 'lucide-react';

// Scope 1 — Emissioni dirette Milk-Run NX-04 (flotta aziendale, Piemonte)
const milkRunLegs = [
  { from: 'HQ Piobesi',          to: 'NKE - Alpignano',     km: 18.4, vehicleType: 'furgone',  co2kg: 4.23,  load: '4 pallet + 2 colli' },
  { from: 'NKE - Alpignano',     to: 'Stellantis - Mirafiori', km: 14.2, vehicleType: 'furgone', co2kg: 3.26, load: 'attrezzatura carrozzeria' },
  { from: 'Stellantis - Mirafiori', to: 'IVECO - Lungo Stura', km: 9.8, vehicleType: 'furgone', co2kg: 2.25, load: 'banco test iniettori' },
  { from: 'IVECO - Lungo Stura', to: 'Meccanica Surra - Settimo', km: 11.3, vehicleType: 'furgone', co2kg: 2.60, load: 'ritiro carpenteria' },
  { from: 'Meccanica Surra',     to: 'B2 Progetti - Torino',  km: 7.6,  vehicleType: 'furgone', co2kg: 1.75, load: 'ritiro disegni tecnici' },
  { from: 'B2 Progetti',         to: 'OMG SRL - Cambiano',    km: 12.4, vehicleType: 'furgone', co2kg: 2.85, load: 'ritiro componenti' },
  { from: 'OMG SRL - Cambiano',  to: 'Festo - Rivalta (TO)', km: 15.1, vehicleType: 'furgone', co2kg: 3.47, load: 'ritiro valvole pneumatiche' },
  { from: 'Festo - Rivalta',     to: 'HQ Piobesi (rientro)', km: 9.2,  vehicleType: 'furgone', co2kg: 2.11, load: 'rientro sede' },
];

// Scope 3 — Emissioni indirette logistica transoceanica (navi cargo Michigan)
const oceanicShipments = [
  {
    id: 'SHP-2026-041',
    route: 'Genova → Detroit (Michigan)',
    carrier: 'MSC Mediterranean',
    vessel: 'MSC Gülsün',
    distanceKm: 8_420,
    weightKg: 4_200,
    co2kg: 1_842,
    status: 'in-transit',
    eta: '2026-05-28',
    desc: 'Linea assemblaggio BMW — 12 stazioni robotizzate',
  },
  {
    id: 'SHP-2026-038',
    route: 'Genova → Detroit (Michigan)',
    carrier: 'CMA CGM',
    vessel: 'CMA CGM Marco Polo',
    distanceKm: 8_420,
    weightKg: 2_800,
    co2kg: 1_228,
    status: 'delivered',
    eta: '2026-05-04',
    desc: 'Attrezzatura collaudo motori V8 — sensori + DAQ',
  },
  {
    id: 'SHP-2026-029',
    route: 'Genova → Detroit (Michigan)',
    carrier: 'Hapag-Lloyd',
    vessel: 'Colombo Express',
    distanceKm: 8_420,
    weightKg: 6_100,
    co2kg: 2_673,
    status: 'delivered',
    eta: '2026-04-17',
    desc: 'Staffaggi e pinze pneumatiche Festo — 3 commesse',
  },
];

// KPI aggregati
const scope1TodayKg = milkRunLegs.reduce((s, l) => s + l.co2kg, 0).toFixed(1);
const scope3MonthKg = oceanicShipments.reduce((s, s2) => s + s2.co2kg, 0);
const scope3PostMichiganKg = Math.round(scope3MonthKg * 0.31); // -69% con polo Michigan
const saving = scope3MonthKg - scope3PostMichiganKg;

// Storico mensile Scope 3 (ultimi 6 mesi)
const scope3History = [
  { month: 'DIC', co2: 8_940 },
  { month: 'GEN', co2: 7_820 },
  { month: 'FEB', co2: 9_310 },
  { month: 'MAR', co2: 6_750 },
  { month: 'APR', co2: 5_743 },
  { month: 'MAG', co2: scope3MonthKg },
];

function BarChart({ data }) {
  const svgW = 480, svgH = 170;
  const padL = 52, padB = 28, padT = 14, padR = 12;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const maxVal = Math.max(...data.map(d => d.co2));
  const barW = chartW / data.length;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = padT + chartH * (1 - f);
        return (
          <g key={f}>
            <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#2a3042" strokeWidth="0.5" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="8" fill="#94a3b8">
              {Math.round(maxVal * f / 1000)}k
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = padL + i * barW + barW * 0.2;
        const bW = barW * 0.6;
        const bH = (d.co2 / maxVal) * chartH;
        const y = padT + chartH - bH;
        const isLast = i === data.length - 1;
        return (
          <g key={d.month}>
            <rect x={x} y={y} width={bW} height={bH}
              fill={isLast ? '#00d4aa' : '#1e3a5f'} rx="3" opacity={isLast ? 1 : 0.75} />
            <text x={x + bW / 2} y={svgH - 8} textAnchor="middle" fontSize="8" fill="#94a3b8">{d.month}</text>
            {isLast && (
              <text x={x + bW / 2} y={y - 4} textAnchor="middle" fontSize="8" fill="#00d4aa" fontWeight="bold">
                {(d.co2 / 1000).toFixed(1)}k
              </text>
            )}
          </g>
        );
      })}
      <text x={padL} y={padT - 2} fontSize="8" fill="#94a3b8">kg CO₂</text>
    </svg>
  );
}

const STATUS_LABEL = { 'in-transit': 'In Transito', delivered: 'Consegnata' };
const STATUS_COLOR = { 'in-transit': '#f59e0b', delivered: '#22c55e' };

export default function CarbonFootprint() {
  const [gr1Loading, setGr1Loading] = useState(false);
  const [gr1Done, setGr1Done] = useState(false);
  const [gr3Loading, setGr3Loading] = useState(false);
  const [gr3Done, setGr3Done] = useState(false);

  const simulateGreenRouter = (setLoading, setDone) => {
    if (setLoading === setGr1Loading ? gr1Done || gr1Loading : gr3Done || gr3Loading) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2200);
  };

  return (
    <div className="space-y-0">
      {/* Alert bar */}
      <div className="px-4 py-2.5 text-xs font-semibold flex items-center gap-2"
        style={{ background: 'rgba(0,212,170,0.07)', borderBottom: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
        <Leaf size={13} />
        Carbon Tracker · GHG Scope 1 &amp; Scope 3 · Aggiornamento in tempo reale via GreenRouter API
      </div>

      <div className="p-4 space-y-4">

        {/* KPI row */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={17} style={{ color: '#00d4aa' }} />
            <h1 className="text-lg font-bold tracking-wide">CARBON TRACKER</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-1"
              style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)' }}>
              GreenRouter integrato
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Truck,        label: 'Scope 1 — Oggi',         value: `${scope1TodayKg} kg`, sub: 'Milk-Run NX-04 · Piemonte',    color: '#00d4aa' },
              { icon: Ship,         label: 'Scope 3 — Mese corrente', value: `${(scope3MonthKg/1000).toFixed(1)}t`,  sub: 'Logistica transoceanica',       color: '#f59e0b' },
              { icon: TrendingDown, label: 'Risparmio stimato Michigan',value: `-${(saving/1000).toFixed(1)}t`,      sub: 'vs logistica attuale (-69%)',    color: '#22c55e' },
              { icon: Target,       label: 'Scope 3 post-Michigan',   value: `${(scope3PostMichiganKg/1000).toFixed(1)}t`, sub: 'proiezione con polo USA', color: '#00d4aa' },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="card p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon size={13} style={{ color }} />
                  <span className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: '#94a3b8' }}>{label}</span>
                </div>
                <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
                <div className="text-[0.6rem] mt-0.5" style={{ color: '#94a3b8' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* LEFT — Scope 1: Milk-Run */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} style={{ color: '#00d4aa' }} />
                <span className="font-bold text-sm">SCOPE 1 — EMISSIONI DIRETTE</span>
              </div>
              <button
                onClick={() => simulateGreenRouter(setGr1Loading, setGr1Done)}
                disabled={gr1Loading || gr1Done}
                className="flex items-center gap-1.5 text-[0.6rem] font-bold px-2.5 py-1 rounded-lg transition-all"
                style={gr1Done
                  ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                  : { background: 'linear-gradient(135deg,#00d4aa,#00a88a)', color: '#0a0e17' }}>
                {gr1Loading ? <Loader2 size={11} className="animate-spin" />
                  : gr1Done ? <><CheckCircle size={11} /> Sincronizzato</>
                  : <><RefreshCw size={11} /> Sincronizza GreenRouter</>}
              </button>
            </div>
            <p className="text-[0.65rem]" style={{ color: '#94a3b8' }}>
              Furgone NX-04 · Piobesi Torinese → 7 fermate clienti/fornitori area Piemonte
            </p>

            {/* Legs table */}
            <div className="space-y-1.5">
              {milkRunLegs.map((leg, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-bold flex-shrink-0"
                    style={{ background: i === 0 ? '#f59e0b' : 'var(--color-border)', color: i === 0 ? '#0a0e17' : '#94a3b8' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.65rem] font-semibold truncate" style={{ color: '#f1f5f9' }}>
                      {leg.from} → {leg.to.replace(' (rientro)', '')}
                    </p>
                    <p className="text-[0.58rem] truncate" style={{ color: '#94a3b8' }}>{leg.load}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[0.65rem] font-mono font-bold" style={{ color: '#00d4aa' }}>{leg.co2kg} kg</div>
                    <div className="text-[0.58rem]" style={{ color: '#94a3b8' }}>{leg.km} km</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scope 1 total */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.25)' }}>
              <span className="text-xs font-bold" style={{ color: '#00d4aa' }}>Totale emissioni giornaliere NX-04</span>
              <span className="text-sm font-bold font-mono" style={{ color: '#00d4aa' }}>{scope1TodayKg} kg CO₂</span>
            </div>

            {gr1Done && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.65rem]"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
                <CheckCircle size={12} />
                GreenRouter: dati certificati GHG Protocol · emissioni validate · report pronto
              </div>
            )}
          </div>

          {/* RIGHT — Scope 3: Trasporti oceanici */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ship size={15} style={{ color: '#f59e0b' }} />
                <span className="font-bold text-sm">SCOPE 3 — LOGISTICA TRANSOCEANICA</span>
              </div>
              <button
                onClick={() => simulateGreenRouter(setGr3Loading, setGr3Done)}
                disabled={gr3Loading || gr3Done}
                className="flex items-center gap-1.5 text-[0.6rem] font-bold px-2.5 py-1 rounded-lg transition-all"
                style={gr3Done
                  ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }
                  : { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b' }}>
                {gr3Loading ? <Loader2 size={11} className="animate-spin" />
                  : gr3Done ? <><CheckCircle size={11} /> Sincronizzato</>
                  : <><RefreshCw size={11} /> Sincronizza GreenRouter</>}
              </button>
            </div>
            <p className="text-[0.65rem]" style={{ color: '#94a3b8' }}>
              Rotte Genova → Detroit (Michigan, USA) · Vettori marittimi internazionali
            </p>

            {/* Shipments */}
            <div className="space-y-2">
              {oceanicShipments.map(s => (
                <div key={s.id} className="p-3 rounded-xl space-y-2"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[0.6rem] font-bold font-mono" style={{ color: '#94a3b8' }}>{s.id}</span>
                        <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${STATUS_COLOR[s.status]}18`, color: STATUS_COLOR[s.status], border: `1px solid ${STATUS_COLOR[s.status]}40` }}>
                          {STATUS_LABEL[s.status]}
                        </span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: '#f1f5f9' }}>{s.desc}</p>
                      <p className="text-[0.6rem] mt-0.5" style={{ color: '#94a3b8' }}>
                        {s.carrier} · {s.vessel} · {s.distanceKm.toLocaleString()} km
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold font-mono" style={{ color: '#f59e0b' }}>
                        {(s.co2kg / 1000).toFixed(2)}t
                      </div>
                      <div className="text-[0.6rem]" style={{ color: '#94a3b8' }}>CO₂</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[0.6rem]" style={{ color: '#94a3b8' }}>
                    <span>Peso: <span className="font-bold text-[#f1f5f9]">{(s.weightKg / 1000).toFixed(1)}t</span></span>
                    <span>ETA/Consegna: <span className="font-bold text-[#f1f5f9]">{s.eta}</span></span>
                  </div>
                </div>
              ))}
            </div>

            {gr3Done && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.65rem]"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
                <CheckCircle size={12} />
                GreenRouter: calcolo GLEC Framework validato · fattori IMO 2023 applicati
              </div>
            )}
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Storico Scope 3 mensile */}
          <div className="card">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={14} style={{ color: '#00d4aa' }} />
              <span className="font-bold text-sm">TREND SCOPE 3 — ULTIMI 6 MESI</span>
            </div>
            <p className="text-[0.65rem] mb-3" style={{ color: '#94a3b8' }}>
              Emissioni logistica transoceanica · kg CO₂ · fonte: GreenRouter
            </p>
            <BarChart data={scope3History} />
          </div>

          {/* Proiezione polo Michigan */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <Target size={14} style={{ color: '#22c55e' }} />
              <span className="font-bold text-sm">IMPATTO POLO MICHIGAN — PROIEZIONE</span>
            </div>
            <p className="text-[0.65rem]" style={{ color: '#94a3b8' }}>
              Stima riduzione Scope 3 con delocalizzazione produttiva in loco a Detroit
            </p>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div className="text-[0.6rem] font-bold uppercase mb-1" style={{ color: '#f59e0b' }}>Scenario Attuale</div>
                <div className="text-2xl font-bold font-mono" style={{ color: '#f59e0b' }}>
                  {(scope3MonthKg / 1000).toFixed(1)}t
                </div>
                <div className="text-[0.6rem] mt-1" style={{ color: '#94a3b8' }}>CO₂/mese · 3 navi</div>
              </div>
              <div className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <div className="text-[0.6rem] font-bold uppercase mb-1" style={{ color: '#22c55e' }}>Post Michigan</div>
                <div className="text-2xl font-bold font-mono" style={{ color: '#22c55e' }}>
                  {(scope3PostMichiganKg / 1000).toFixed(1)}t
                </div>
                <div className="text-[0.6rem] mt-1" style={{ color: '#94a3b8' }}>CO₂/mese · solo EU</div>
              </div>
            </div>

            {/* Saving bar */}
            <div>
              <div className="flex justify-between text-[0.65rem] mb-1" style={{ color: '#94a3b8' }}>
                <span>Riduzione emissioni</span>
                <span className="font-bold" style={{ color: '#22c55e' }}>-69% · {(saving / 1000).toFixed(1)}t CO₂ risparmiata</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: '69%', background: 'linear-gradient(90deg, #22c55e, #00d4aa)' }} />
              </div>
            </div>

            {/* Info note */}
            <div className="flex gap-2 p-2.5 rounded-lg text-[0.62rem]"
              style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)', color: '#94a3b8' }}>
              <Info size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#00d4aa' }} />
              <span>
                Il polo produttivo Michigan elimina la tratta transoceanica per le commesse USA,
                riducendo drasticamente le emissioni Scope 3. I rimanenti{' '}
                <span style={{ color: '#f1f5f9' }}>{(scope3PostMichiganKg / 1000).toFixed(1)}t</span>{' '}
                riguardano spedizioni intra-europee.
              </span>
            </div>

            {/* GreenRouter CTA */}
            <div className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#00d4aa,#00a88a)' }}>
                <Leaf size={16} color="#0a0e17" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.65rem] font-bold" style={{ color: '#f1f5f9' }}>GreenRouter API</p>
                <p className="text-[0.58rem]" style={{ color: '#94a3b8' }}>
                  demo.greenrouter.it · GLEC Framework · GHG Protocol
                </p>
              </div>
              <span className="text-[0.55rem] font-bold px-2 py-1 rounded-full"
                style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
