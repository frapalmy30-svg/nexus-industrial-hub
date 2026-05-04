import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  Settings, TrendingUp, Radar, MapPin,
  Loader2, CheckCircle
} from 'lucide-react';
import KanbanCard from '../components/KanbanCard';
import AlertBar from '../components/AlertBar';
import { workOrders, kanbanColumns, milkRunStops, suppliers } from '../data/mockData';

import 'leaflet/dist/leaflet.css';

// Fix per i marker di default di Leaflet con Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const routeCoords = milkRunStops.map(s => [s.lat, s.lng]);

function createNumberedIcon(number, color = '#00d4aa') {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      color: #0a0e17;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function Dashboard() {
  // Ottimizzazione: memorizza il valore totale per evitare ricalcoli ai re-render
  const totalValue = useMemo(() => {
    return workOrders.reduce((sum, wo) => sum + (wo.value || 0), 0);
  }, []);

  const [cartOptimized, setCartOptimized] = useState(false);
  const [cartOptimizing, setCartOptimizing] = useState(false);

  const handleOptimizeCart = () => {
    if (cartOptimizing || cartOptimized) return;
    setCartOptimizing(true);
    setTimeout(() => {
      setCartOptimizing(false);
      setCartOptimized(true);
    }, 2000);
  };

  return (
    <div className="space-y-0">
      <AlertBar message="Automazione - ETA aggiornata +2gg lavorativi" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: KANBAN + SUPPLIER RADAR */}
          <div className="space-y-6">
            {/* KANBAN OPERATIVO */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Settings size={18} className="text-[#00d4aa]" />
                <h2 className="text-xl font-bold tracking-wide">KANBAN OPERATIVO</h2>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {workOrders.length} commesse visibili · valore totale{' '}
                <span className="font-bold text-white">{totalValue.toLocaleString('it-IT')} €</span>
              </p>

              <div className="flex gap-2 mb-4 flex-wrap">
                {kanbanColumns.map(col => (
                  <div key={col.id} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                    {col.label} <span className="text-[#00d4aa] ml-1">{col.count}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {kanbanColumns.map(col => {
                  const colOrders = workOrders.filter(wo => wo.status === col.id);
                  return (
                    <div key={col.id} className="kanban-col min-w-[200px] flex-shrink-0">
                      <div className="text-xs font-semibold mb-3 uppercase"
                        style={{ color: 'var(--color-text-secondary)' }}>
                        {col.label}
                      </div>
                      {colOrders.map(order => (
                        <KanbanCard key={order.id} order={order} />
                      ))}
                      {colOrders.length === 0 && (
                        <div className="text-xs text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
                          — vuoto —
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SUPPLIER RADAR */}
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radar size={18} className="text-[#00d4aa]" />
                  <h3 className="font-bold">SUPPLIER RADAR</h3>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                {suppliers.length} fornitori monitorati · sync 5s
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suppliers.slice(0, 6).map((s, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.status === 'OK' ? 'bg-green-400' : 'bg-amber-400'}`} />
                        <span className="text-sm font-semibold">{s.name}</span>
                      </div>
                      <span className={`text-xs font-bold ${s.status === 'OK' ? 'text-green-400' : 'text-amber-400'}`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <span>{s.type}</span>
                      <span>ETA {s.eta}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span style={{ color: 'var(--color-text-secondary)' }}>{s.code}</span>
                      <span className="text-[#00d4aa] font-semibold">trust {s.trust}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MAP + AI PROCUREMENT */}
          <div className="space-y-6">
            {/* MILK-RUN + MAPPA */}
            <div className="card">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-[#00d4aa]" />
                <h3 className="font-bold">MILK-RUN GIORNALIERO</h3>
              </div>
              <h4 className="font-semibold text-sm mb-1">CONSEGNE & RITIRI</h4>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Furgone NX-04 · 6 fermate · area Torino · ETA conclusione <span className="text-[#00d4aa]">1h 35m</span>
              </p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>consegne</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>ritiri</div>
                </div>
              </div>

              {/* MAP */}
              <div className="rounded-xl overflow-hidden mb-3" style={{ height: '300px', border: '1px solid var(--color-border)' }}>
                <MapContainer
                  center={[45.0703, 7.6869]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  {milkRunStops.map((stop, i) => (
                    <Marker
                      key={stop.id}
                      position={[stop.lat, stop.lng]}
                      icon={createNumberedIcon(stop.id, i === 0 ? '#f59e0b' : '#00d4aa')}
                    >
                      <Popup>
                        <div style={{ color: '#0a0e17' }}>
                          <strong>{stop.name}</strong><br />
                          Orario: {stop.time}<br />
                          {stop.action && <span>Tipo: {stop.action}</span>}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <Polyline positions={routeCoords} color="#00d4aa" weight={3} opacity={0.7} dashArray="8 6" />
                </MapContainer>
              </div>

              <div className="text-xs rounded-lg p-2 flex gap-4" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>PROSSIMA FERMATA</span>
                  <div className="font-bold text-[#00d4aa]">SPA</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>DISTANZA TOUR</span>
                  <div className="font-bold">87 km</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>CARICO TOTALE</span>
                  <div className="font-bold">1602 kg</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>POS. FURGONE</span>
                  <div className="font-bold">45.1157°N</div>
                </div>
              </div>
            </div>

            {/* AI PROCUREMENT */}
            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCartIcon />
                <h3 className="font-bold">AI PROCUREMENT · ORDINI ACCORPATI</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                11 righe ordine · 4 bundle fornitori
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-sm">Costo baseline</span>
                  <span className="font-bold">44.868 €</span>
                </div>
                <div className="flex justify-between border-t pt-2" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-sm">Costo previsto</span>
                  <span className={`font-bold ${cartOptimized ? 'text-[#00d4aa]' : ''}`}>{cartOptimized ? '38.138 €' : '44.868 €'}</span>
                </div>
                {cartOptimized && (
                  <div className="p-2 rounded-lg flex justify-between text-sm"
                    style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
                    <span className="text-[#00d4aa]">Risparmio AI</span>
                    <span className="font-bold text-[#00d4aa]">-6.730 €</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleOptimizeCart}
                disabled={cartOptimizing || cartOptimized}
                className={`w-full flex items-center justify-center gap-2 ${cartOptimized ? '' : 'btn-primary'}`}
                style={cartOptimized ? {
                  background: 'rgba(0,212,170,0.1)',
                  border: '1px solid rgba(0,212,170,0.3)',
                  color: '#00d4aa',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                } : {}}
              >
                {cartOptimizing ? (
                  <><Loader2 size={14} className="animate-spin" /> Ottimizzando...</>
                ) : cartOptimized ? (
                  <><CheckCircle size={14} /> Carrello Ottimizzato</>
                ) : (
                  <><TrendingUp size={14} /> Ottimizza Carrello (AI)</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}