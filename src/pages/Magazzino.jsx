import { useState } from 'react';
import { Warehouse, Zap, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import AlertBar from '../components/AlertBar';
import { warehouseData } from '../data/mockData';

const fifoBlocks = [
  { woId: 'WO-2026-0142', client: 'BMW Group', w: 8, h: 5, x: 0, y: 0, type: 'commessa', color: '#3b82f6' },
  { woId: 'WO-2026-0138', client: 'Stellantis Automoveis', w: 5, h: 4, x: 9, y: 0, type: 'commessa', color: '#a855f7' },
  { woId: 'WO-2026-0151', client: 'NKE Automation', w: 4, h: 3, x: 16, y: 0, type: 'commessa', color: '#22c55e' },
  { woId: 'WO-2026-0129', client: 'IVECO S.p.A.', w: 4, h: 3, x: 0, y: 6, type: 'commessa', color: '#06b6d4' },
  { woId: 'WO-2026-0119', client: 'Stellantis Europe', w: 7, h: 6, x: 5, y: 6, type: 'commessa', color: '#f97316' },
  { woId: null, client: 'BMW Group - spedizi...', w: 5, h: 4, x: 15, y: 5, type: 'pallet', color: '#ec4899' },
  { woId: null, client: 'Stock Meccanica S...', w: 4, h: 2, x: 0, y: 10, type: 'materia_prima', color: '#f59e0b' },
  { woId: null, client: 'Stock Festo SPA', w: 3, h: 3, x: 5, y: 12, type: 'stock', color: '#22c55e' },
  { woId: null, client: 'Stock Campi Intl', w: 5, h: 2, x: 8, y: 12, type: 'materia_prima', color: '#f59e0b' },
  { woId: null, client: 'Stock EVM SRL', w: 3, h: 3, x: 14, y: 12, type: 'stock', color: '#22c55e' },
  { woId: null, client: 'NKE - sped...', w: 4, h: 3, x: 18, y: 12, type: 'pallet', color: '#ec4899' },
];

const optimizedBlocks = [
  // Row 0: top strip — commesse riorganizzate compatte
  { woId: 'WO-2026-0142', client: 'BMW Group', w: 8, h: 5, x: 0, y: 0, type: 'commessa', color: '#3b82f6' },
  { woId: 'WO-2026-0138', client: 'Stellantis Automoveis', w: 5, h: 4, x: 8, y: 0, type: 'commessa', color: '#a855f7' },
  { woId: 'WO-2026-0151', client: 'NKE Automation', w: 4, h: 3, x: 13, y: 0, type: 'commessa', color: '#22c55e' },
  { woId: 'WO-2026-0157', client: 'Lucid Motors', w: 7, h: 5, x: 17, y: 0, type: 'commessa', color: '#ef4444', isNew: true },
  // Row 5: second strip
  { woId: 'WO-2026-0129', client: 'IVECO S.p.A.', w: 4, h: 3, x: 0, y: 5, type: 'commessa', color: '#06b6d4' },
  { woId: 'WO-2026-0119', client: 'Stellantis Europe', w: 7, h: 5, x: 4, y: 5, type: 'commessa', color: '#f97316' },
  { woId: null, client: 'BMW Group - spediz.', w: 5, h: 4, x: 11, y: 5, type: 'pallet', color: '#ec4899' },
  { woId: 'WO-2026-0160', client: 'FCA US LLC', w: 5, h: 3, x: 16, y: 5, type: 'commessa', color: '#10b981', isNew: true },
  // Row 8-9: stock e materia prima ricompattati
  { woId: null, client: 'Stock Meccanica S...', w: 4, h: 2, x: 0, y: 10, type: 'materia_prima', color: '#f59e0b' },
  { woId: null, client: 'Stock Festo SPA', w: 3, h: 3, x: 4, y: 10, type: 'stock', color: '#22c55e' },
  { woId: null, client: 'Stock Campi Intl', w: 5, h: 2, x: 7, y: 10, type: 'materia_prima', color: '#f59e0b' },
  { woId: null, client: 'Stock EVM SRL', w: 3, h: 3, x: 12, y: 10, type: 'stock', color: '#22c55e' },
  { woId: null, client: 'NKE - sped.', w: 4, h: 3, x: 15, y: 10, type: 'pallet', color: '#ec4899' },
];

const GRID_W = 28;
const GRID_H = 16;

export default function Magazzino() {
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const blocks = optimized ? optimizedBlocks : fifoBlocks;
  const saturation = optimized ? 58.9 : 43.3;
  const usedArea = optimized ? 264 : 194;
  const units = optimized ? 13 : 11;
  const freeSpace = optimized ? 184 : 254;
  const blocked = optimized ? 0 : 2;
  const risparmio = optimized ? '+15.6%' : '—';

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(!optimized);
    }, 1800);
  };

  return (
    <div className="space-y-0">
      <AlertBar message={optimized
        ? "Tutte le unità stoccate con successo — saturazione 58.9% — WO-0157 Lucid Motors e WO-0160 FCA US LLC ora allocate"
        : "Impossibile allocare 2 commesse: WO-2026-0157 Lucid Motors e WO-2026-0160 FCA US LLC — spazio insufficiente con layout FIFO"
      } />

      <div className="p-6 space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Warehouse size={20} className="text-[#00d4aa]" />
              <h2 className="text-xl font-bold">MAGAZZINO VIRTUALE · ALLOCAZIONE COMMESSE & STOCK</h2>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Area totale {warehouseData.dimensions} = {warehouseData.totalArea} m² · {units} unità in giacenza · Layout {optimized ? 'ottimizzato (AI)' : 'naive (FIFO)'}
            </p>
          </div>
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              optimized ? 'text-[#00d4aa] hover:bg-[#00d4aa]/10' : 'btn-primary'
            }`}
            style={optimized ? { border: '1px solid rgba(0,212,170,0.4)', background: 'rgba(0,212,170,0.05)' } : {}}
          >
            {optimizing ? (
              <><Loader2 size={16} className="animate-spin" /> Ottimizzando...</>
            ) : optimized ? (
              <><Zap size={16} /> Ottimizzato (AI)</>
            ) : (
              <><Zap size={16} /> Ottimizza Spazio (AI)</>
            )}
          </button>
        </div>

        {/* ALERT */}
        {!optimized && !optimizing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              <AlertTriangle size={16} />
              Impossibile allocare <strong>WO-2026-0157 Lucid Motors</strong> (7×5 = 35 m²) — spazio insufficiente
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              <AlertTriangle size={16} />
              Impossibile allocare <strong>WO-2026-0160 FCA US LLC</strong> (5×3 = 15 m²) — layout FIFO troppo frammentato
            </div>
          </div>
        )}
        {optimized && !optimizing && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
            <CheckCircle size={16} />
            Tutte le unità stoccate con successo — WO-0157 Lucid Motors e WO-0160 FCA US LLC ora allocate — saturazione {saturation}%
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* WAREHOUSE GRID */}
          <div className="card p-4">
            <div className="relative w-full" style={{ aspectRatio: `${GRID_W}/${GRID_H}`, background: '#0d1117', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              {optimizing && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg"
                  style={{ background: 'rgba(10,14,23,0.85)', backdropFilter: 'blur(4px)' }}>
                  <div className="text-center">
                    <Loader2 size={36} className="mx-auto mb-2 animate-spin text-[#00d4aa]" />
                    <p className="text-sm font-bold text-[#00d4aa]">{optimized ? 'Ripristino layout FIFO...' : 'Ottimizzazione bin-packing 2D...'}</p>
                  </div>
                </div>
              )}

              {blocks.map((block, i) => {
                const left = (block.x / GRID_W) * 100;
                const top = (block.y / GRID_H) * 100;
                const width = (block.w / GRID_W) * 100;
                const height = (block.h / GRID_H) * 100;
                const area = block.w * block.h;
                return (
                  <div
                    key={`${optimized ? 'ai' : 'fifo'}-${i}`}
                    className="absolute flex flex-col justify-between rounded cursor-pointer group"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                      background: block.isNew ? `${block.color}30` : `${block.color}15`,
                      border: block.isNew ? `2px dashed ${block.color}` : `1.5px solid ${block.color}66`,
                      padding: '6px 8px',
                      transition: 'all 0.5s ease',
                      transitionDelay: `${i * 40}ms`,
                      boxShadow: block.isNew ? `0 0 12px ${block.color}40` : 'none',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-1">
                        {block.woId && (
                          <div className="text-[0.6rem] font-mono font-bold truncate" style={{ color: block.color }}>{block.woId}</div>
                        )}
                        {block.isNew && (
                          <span className="text-[0.45rem] px-1 py-0.5 rounded font-bold bg-green-500 text-white">ALLOCATA</span>
                        )}
                      </div>
                      <div className="text-[0.6rem] font-semibold truncate mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
                        {block.client}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-[0.5rem]" style={{ color: 'var(--color-text-secondary)' }}>{block.w}×{block.h}</span>
                      <span className="text-[0.5rem]" style={{ color: 'var(--color-text-secondary)' }}>{area}m²</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* SATURAZIONE */}
            <div className="card">
              <h3 className="font-bold mb-3">SATURAZIONE</h3>
              <div className="w-full h-3 rounded-full mb-2" style={{ background: 'var(--color-border)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${saturation}%`,
                    background: optimized
                      ? 'linear-gradient(90deg, #3b82f6, #00d4aa)'
                      : 'linear-gradient(90deg, #ef4444, #f59e0b)'
                  }}
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {usedArea} / {warehouseData.totalArea} m²
                </span>
                <span className={`text-3xl font-bold ${optimized ? 'text-[#00d4aa]' : 'text-red-400'}`}>
                  {saturation}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="text-[0.65rem] uppercase" style={{ color: 'var(--color-text-secondary)' }}>Unità posizionate</div>
                  <div className="text-2xl font-bold">{units}/{warehouseData.totalPositions}</div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="text-[0.65rem] uppercase" style={{ color: 'var(--color-text-secondary)' }}>Spazio libero</div>
                  <div className="text-2xl font-bold">{freeSpace} <span className="text-sm font-normal">m²</span></div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="text-[0.65rem] uppercase" style={{ color: 'var(--color-text-secondary)' }}>Bloccate in area</div>
                  <div className={`text-2xl font-bold ${blocked > 0 ? 'text-red-400' : 'text-green-400'}`}>{blocked}</div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="text-[0.65rem] uppercase" style={{ color: 'var(--color-text-secondary)' }}>Risparmio AI</div>
                  <div className="text-2xl font-bold">{risparmio}</div>
                </div>
              </div>
            </div>

            {/* LEGENDA */}
            <div className="card">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 rounded" style={{ background: '#3b82f630', border: '1px solid #3b82f666' }} />
                  <span className="text-xs">Commessa</span>
                  <span className="text-xs font-bold ml-auto">5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 rounded" style={{ background: '#22c55e30', border: '1px solid #22c55e66' }} />
                  <span className="text-xs">Stock</span>
                  <span className="text-xs font-bold ml-auto">5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 rounded" style={{ background: '#ec489930', border: '1px solid #ec489966' }} />
                  <span className="text-xs">Pallet</span>
                  <span className="text-xs font-bold ml-auto">5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 rounded" style={{ background: '#f59e0b30', border: '1px solid #f59e0b66' }} />
                  <span className="text-xs">Materia prima</span>
                  <span className="text-xs font-bold ml-auto">6</span>
                </div>
              </div>
            </div>

            {/* INVENTARIO */}
            <div className="card">
              <h3 className="font-bold mb-3">INVENTARIO</h3>
              <div className="space-y-2 max-h-[340px] overflow-y-auto">
                {warehouseData.inventory.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <div className="flex-1">
                      <div className="text-[0.6rem] uppercase" style={{ color: 'var(--color-text-secondary)' }}>{item.type}</div>
                      <div className="text-sm font-semibold">{item.client}</div>
                    </div>
                    <span className="text-sm font-mono font-bold">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}