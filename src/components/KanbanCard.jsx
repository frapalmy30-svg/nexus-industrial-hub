import { useState } from 'react';
import { X, Package, Calendar, FileText, AlertCircle } from 'lucide-react';

// --- COSTANTI GLOBALI SPOSTATE FUORI DAI COMPONENTI PER OTTIMIZZARE LE PERFORMANCE ---
const STATUS_CONFIG = {
  backlog: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: 'Backlog', border: '#6b7280' },
  lavorazione: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'In Lavorazione', border: '#3b82f6' },
  test: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Test', border: '#f59e0b' },
  pronto: { color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Pronto', border: '#22c55e' },
  bloccate: { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Bloccata', border: '#ef4444' }
};

const PRIORITY_COLORS = {
  critica: 'bg-red-500/20 text-red-400 border-red-500/30',
  alta: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  bassa: 'bg-green-500/20 text-green-400 border-green-500/30'
};

// --- COMPONENTI UI SECONDARI ---
function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${config?.color || ''}`}>
      {config?.label || status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border uppercase ${PRIORITY_COLORS[priority] || ''}`}>
      {priority}
    </span>
  );
}

// --- MODALE DETTAGLIO ---
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()} // Previene la chiusura cliccando dentro la card
      >
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#00d4aa] font-mono font-bold text-sm">{order.id}</span>
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
            </div>
            <h3 className="text-lg font-bold">{order.client}</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{order.supplier}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center p-3 rounded border border-gray-700/50">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Valore</div>
              <div className="text-lg font-bold text-[#00d4aa]">
                {order.value?.toLocaleString('it-IT')} €
              </div>
            </div>
            <div className="card text-center p-3 rounded border border-gray-700/50">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Scadenza</div>
              <div className="text-lg font-bold flex items-center justify-center gap-1">
                <Calendar size={14} />
                {order.dueDate}
              </div>
            </div>
            <div className="card text-center p-3 rounded border border-gray-700/50">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Progresso</div>
              <div className="text-lg font-bold">{order.progress}%</div>
              <div className="w-full h-1.5 rounded-full mt-1" style={{ background: 'var(--color-border)' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${order.progress}%`,
                    background: order.progress === 100 ? '#22c55e' : order.progress > 50 ? '#00d4aa' : '#f59e0b'
                  }} 
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText size={14} className="text-[#00d4aa]" />
              Descrizione
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {order.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Package size={14} className="text-[#00d4aa]" />
              Componenti / Materiali
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="flex items-start gap-2 p-3 rounded-lg"
              style={{
                background: order.status === 'bloccate' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${order.status === 'bloccate' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`
              }}>
              <AlertCircle size={16} className={order.status === 'bloccate' ? 'text-red-400' : 'text-amber-400'} />
              <p className="text-sm" style={{ color: order.status === 'bloccate' ? '#fca5a5' : '#fcd34d' }}>
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPALE ---
export default function KanbanCard({ order }) {
  const [showDetail, setShowDetail] = useState(false);
  const statusColor = STATUS_CONFIG[order.status]?.border || '#6b7280';

  return (
    <>
      <div
        className="card card-hover cursor-pointer p-3 mb-2"
        style={{ borderLeft: `3px solid ${statusColor}` }}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#00d4aa] font-mono text-xs font-semibold">{order.id}</span>
          <PriorityBadge priority={order.priority} />
        </div>
        <div className="text-sm font-medium mb-1 truncate" title={order.client}>{order.client}</div>
        <div className="text-xs mb-2 truncate" style={{ color: 'var(--color-text-secondary)' }} title={order.supplier}>
          {order.supplier}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {order.progress}/100
          </span>
          <span className="text-xs font-semibold" style={{ color: statusColor }}>
            BOL
          </span>
        </div>
        
        {order.progress > 0 && (
          <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'var(--color-border)' }}>
            <div 
              className="h-full rounded-full"
              style={{ width: `${order.progress}%`, background: statusColor }} 
            />
          </div>
        )}
      </div>

      {showDetail && <OrderDetailModal order={order} onClose={() => setShowDetail(false)} />}
    </>
  );
}