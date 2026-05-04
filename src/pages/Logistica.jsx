import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Truck, Package, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import AlertBar from '../components/AlertBar';
import { milkRunStops, fleet } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

// Fix per le icone di default di Leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const routeCoords = [
  [44.9630, 7.6080],
  [45.0930, 7.5220],
  [45.0350, 7.6100],
  [45.0370, 7.5130],
  [45.0950, 7.6700],
  [44.9700, 7.7700],
  [45.0680, 7.6600],
  [45.1350, 7.7650],
];

const optimizedCoords = [
  [44.9630, 7.6080],
  [45.0370, 7.5130],
  [45.0930, 7.5220],
  [45.0350, 7.6100],
  [45.0680, 7.6600],
  [45.0950, 7.6700],
  [45.1350, 7.7650],
  [44.9700, 7.7700],
];

function createStopIcon(number, color = '#00d4aa') {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#0a0e17;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">${number}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14],
  });
}

const originalRoute = [
  { stop: '00 Automazioni HQ', idx: '00' },
  { stop: '01 NKE Alpignano', idx: '01' },
  { stop: '02 Stellantis Mirafiori', idx: '02' },
  { stop: '07 Festo Rivalta', idx: '07', bad: true },
  { stop: '03 IVECO Lungo Stura', idx: '03', bad: true },
  { stop: '06 OMG Cambiano', idx: '06', bad: true },
  { stop: '05 B2 Progetti', idx: '05' },
  { stop: '04 Meccanica Surra', idx: '04' },
];

const optimizedRoute = [
  { stop: '00 Automazioni HQ', idx: '00', changed: false },
  { stop: '07 Festo Rivalta', idx: '07', changed: true },
  { stop: '01 NKE Alpignano', idx: '01', changed: true },
  { stop: '02 Stellantis Mirafiori', idx: '02', changed: false },
  { stop: '05 B2 Progetti', idx: '05', changed: true },
  { stop: '03 IVECO Lungo Stura', idx: '03', changed: true },
  { stop: '04 Meccanica Surra', idx: '04', changed: true },
  { stop: '06 OMG Cambiano', idx: '06', changed: true },
];

const truckIcon = L.divIcon({
  className: '',
  html: `<div style="background:#f59e0b;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(245,158,11,0.8),0 0 24px rgba(245,158,11,0.4);"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

function MovingTruck({ coords, running }) {
  const [pos, setPos] = useState(coords[0]);
  const stepRef = useRef(0);
  const interpRef = useRef(0);

  useEffect(() => {
    if (!running || coords.length < 2) return;
    stepRef.current = 0;
    interpRef.current = 0;
    setPos(coords[0]);

    const interval = setInterval(() => {
      const step = stepRef.current;
      const interp = interpRef.current;
      if (step >= coords.length - 1) {
        clearInterval(interval);
        return;
      }
      const from = coords[step];
      const to = coords[step + 1];
      const t = interp / 30;
      const lat = from[0] + (to[0] - from[0]) * t;
      const lng = from[1] + (to[1] - from[1]) * t;
      setPos([lat, lng]);
      interpRef.current += 1;
      if (interpRef.current > 30) {
        interpRef.current = 0;
        stepRef.current += 1;
      }
    }, 80);
    return () => clearInterval(interval);
  }, [running, coords]);

  if (!running) return null;
  return <Marker position={pos} icon={truckIcon} />;
}

const shipments = [
  { id: 'WO-2026-0129', desc: 'Banco Test Iniettori — sensori Kistler + DAQ NI', from: 'IVECO S.p.A.', coords: '45.0950°N 7.6700°E', eta: '09:40' },
  { id: 'WO-2026-0138', desc: 'Cella Robotica Saldatura — trasformatore MFDC', from: 'NKE Automation', coords: '45.0930°N 7.5220°E', eta: '08:10' },
  { id: 'WO-2026-0151', desc: 'Attrezzatura linea carrozzeria — staffaggi + pinze', from: 'Stellantis Europe', coords: '45.0350°N 7.6100°E', eta: '08:55' },
];

export default function Logistica() {
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simKey, setSimKey] = useState(0);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
      setSimulating(true);
      setSimKey(k => k + 1);
    }, 2000);
  };

  const currentDistance = optimized ? 52 : 87;
  const currentTime = optimized ? '2h 15m' : '4h 10m';
  const consegne = milkRunStops.filter(s => s.action === 'CONSEGNA').length;
  const ritiri = milkRunStops.filter(s => s.action === 'RITIRO').length;

  return (
    <div className="space-y-0">
      <AlertBar message="Consegna urgente WO-2026-0138 Stellantis — pinza robotica bloccata in attesa ricambi Brasile" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT - MAP AND STOPS */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Truck size={18} className="text-[#00d4aa]" />
                <h2 className="text-xl font-bold">MILK-RUN GIORNALIERO · CONSEGNE & RITIRI</h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Furgone NX-04 · {milkRunStops.length - 1} fermate clienti/fornitori · area Torino sud · ETA conclusione{' '}
                <span className="text-[#00d4aa] font-bold">{currentTime}</span>
              </p>
              <div className="flex gap-3 mt-2">
                <div className="text-center px-4 py-2 rounded-lg" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <div className="text-xl font-bold">{consegne}</div>
                  <div className="text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>consegne</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <div className="text-xl font-bold">{ritiri}</div>
                  <div className="text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>ritiri</div>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden" style={{ height: '320px', border: '1px solid var(--color-border)' }}>
              <MapContainer center={[45.05, 7.58]} zoom={10} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {milkRunStops.map((stop, i) => (
                  <Marker key={stop.id} position={[stop.lat, stop.lng]}
                    icon={createStopIcon(stop.id, i === 0 ? '#f59e0b' : '#00d4aa')}>
                    <Popup>
                      <div style={{ color: '#0a0e17', maxWidth: '220px' }}>
                        <strong>{stop.name}</strong><br />
                        <span style={{ fontSize: '0.8rem' }}>Orario: {stop.time}</span>
                        {stop.action && <><br /><span style={{ fontSize: '0.8rem', color: stop.action === 'CONSEGNA' ? '#16a34a' : '#d97706' }}>⬤ {stop.action}</span></>}
                        {stop.detail && <><br /><span style={{ fontSize: '0.75rem', color: '#555' }}>{stop.detail}</span></>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <Polyline
                  positions={optimized ? optimizedCoords : routeCoords}
                  color={optimized ? '#22c55e' : '#ef4444'}
                  weight={optimized ? 3.5 : 3}
                  opacity={0.85}
                />
                {optimized && (
                  <Polyline positions={routeCoords} color="#ef4444" weight={2} opacity={0.25} dashArray="8 6" />
                )}
                <MovingTruck key={simKey} coords={optimized ? optimizedCoords : routeCoords} running={simulating} />
              </MapContainer>
            </div>

            {/* STOP LIST */}
            <div className="space-y-2">
              {milkRunStops.map((stop, i) => (
                <div key={stop.id} className="card flex items-start gap-3 p-3"
                  style={i === 0 ? { borderLeft: '3px solid #f59e0b' } : { borderLeft: '3px solid transparent' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: i === 0 ? '#f59e0b' : 'var(--color-bg-secondary)', color: i === 0 ? '#0a0e17' : 'var(--color-text-primary)', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                    {stop.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{stop.name}</div>
                    {stop.detail && <div className="text-[0.65rem] mt-0.5 leading-snug" style={{ color: 'var(--color-text-secondary)' }}>{stop.detail}</div>}
                  </div>
                  {stop.action && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${stop.action === 'CONSEGNA' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {stop.action}
                    </span>
                  )}
                  <span className="text-sm font-mono flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{stop.time}</span>
                </div>
              ))}
            </div>

            <div className="card flex gap-4 text-xs">
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>PROSSIMA FERMATA</span>
                <div className="font-bold text-[#00d4aa]">Stellantis Mirafiori</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>DISTANZA TOUR</span>
                <div className={`font-bold ${optimized ? 'text-[#00d4aa]' : ''}`}>{currentDistance} km</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>CARICO TOTALE</span>
                <div className="font-bold">1602 kg</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>POS. FURGONE</span>
                <div className="font-bold">44.963°N</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* ROUTE OPTIMIZATION */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold">OTTIMIZZAZIONE PERCORSO · NEAREST-NEIGHBOUR</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {optimized
                      ? 'Percorso ottimizzato dall\'AI — risparmio 35 km e 1h 55m'
                      : 'Clicca per confrontare la sequenza originale vs. percorso ricalcolato dall\'AI'}
                  </p>
                </div>
                <button
                  className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg font-semibold transition-all ${
                    optimized
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                      : 'btn-primary'
                  }`}
                  onClick={!optimized && !optimizing ? handleOptimize : undefined}
                  disabled={optimizing}
                >
                  {optimizing ? (
                    <><Loader2 size={12} className="animate-spin" /> Ottimizzando...</>
                  ) : optimized ? (
                    <><CheckCircle size={12} /> Ottimizzato</>
                  ) : (
                    <><RefreshCw size={12} /> Ottimizza Percorso</>
                  )}
                </button>
              </div>

              {!optimized && !optimizing && (
                <div className="p-6 rounded-xl text-center"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px dashed var(--color-border)' }}>
                  <RefreshCw size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-secondary)' }} />
                  <p className="text-sm font-semibold mb-1">Percorso non ancora ottimizzato</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Clicca "Ottimizza Percorso" per avviare l'algoritmo Nearest-Neighbour e confrontare i risultati
                  </p>
                </div>
              )}

              {optimizing && (
                <div className="p-6 rounded-xl text-center"
                  style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)' }}>
                  <Loader2 size={32} className="mx-auto mb-3 animate-spin text-[#00d4aa]" />
                  <p className="text-sm font-semibold mb-1 text-[#00d4aa]">Ottimizzazione in corso...</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Calcolo percorso ottimale tra {milkRunStops.length} fermate con vincoli di carico e finestre temporali
                  </p>
                  <div className="w-48 h-1.5 rounded-full mx-auto mt-3 overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div className="h-full rounded-full bg-[#00d4aa] animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              )}

              {optimized && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold">PRIMA</span>
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                      </div>
                      <div className="text-3xl font-bold line-through opacity-60">87 <span className="text-sm font-normal">km</span></div>
                      <div className="text-xs line-through opacity-60" style={{ color: 'var(--color-text-secondary)' }}>4h 10m</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.3)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold">DOPO (AI)</span>
                        <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
                      </div>
                      <div className="text-3xl font-bold text-[#00d4aa]">52 <span className="text-sm font-normal">km</span></div>
                      <div className="text-xs text-[#00d4aa]">2h 15m</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <div className="flex items-center gap-4 text-center">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-green-400">-35 km</div>
                        <div className="text-[0.6rem]" style={{ color: 'var(--color-text-secondary)' }}>Distanza</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-green-400">-1h 55m</div>
                        <div className="text-[0.6rem]" style={{ color: 'var(--color-text-secondary)' }}>Tempo</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-green-400">-40%</div>
                        <div className="text-[0.6rem]" style={{ color: 'var(--color-text-secondary)' }}>CO₂</div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>CONFRONTO SEQUENZA</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="text-xs font-semibold pb-1 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Originale</div>
                    <div className="text-xs font-semibold pb-1 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Ottimizzato (AI)</div>
                    {originalRoute.map((r, i) => (
                      <div key={`orig-${i}`} className={`text-xs py-0.5 ${r.bad ? 'text-red-400 font-semibold' : ''}`}>{r.stop} {r.bad ? '⚠' : ''}</div>
                    ))}
                    {optimizedRoute.map((r, i) => (
                      <div key={`opt-${i}`} className={`text-xs py-0.5 ${r.changed ? 'text-[#00d4aa] font-semibold' : ''}`} style={{ gridColumn: 2, gridRow: i + 2 }}>
                        {r.stop}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FLOTTA */}
            <div className="card">
              <h3 className="font-bold mb-3">FLOTTA INTERNA</h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {fleet.map(v => (
                  <div key={v.id} className="p-3 rounded-lg text-center" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                    <div className="text-sm font-bold">{v.id} <span className="inline-block w-2 h-2 rounded-full bg-green-400 ml-1"></span></div>
                    <div className="text-xs">{v.driver}</div>
                    <div className={`text-xs font-semibold ${v.statusColor}`}>{v.status}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div><span style={{ color: 'var(--color-text-secondary)' }}>KM OGGI</span><div className="text-xl font-bold">184</div></div>
                <div><span style={{ color: 'var(--color-text-secondary)' }}>SATURAZIONE</span><div className="text-xl font-bold">71%</div></div>
                <div><span style={{ color: 'var(--color-text-secondary)' }}>ON-TIME</span><div className="text-xl font-bold text-[#00d4aa]">94%</div></div>
              </div>
            </div>

            {/* SPEDIZIONI IN ARRIVO */}
            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-[#00d4aa]" />
                <h3 className="font-bold">SPEDIZIONI IN CORSO</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                {shipments.length} commesse in consegna/ritiro oggi
              </p>
              {shipments.map(s => (
                <div key={s.id} className="card p-3 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#00d4aa]">{s.id}</span>
                    <span className="text-sm font-mono">{s.eta}</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{s.desc}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Da/Per: <span className="font-semibold text-white/80">{s.from}</span></div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <MapPin size={10} className="text-[#00d4aa]" />
                    <span style={{ color: 'var(--color-text-secondary)' }}>{s.coords}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}