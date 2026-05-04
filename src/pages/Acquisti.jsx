import { useState } from 'react';
import { ShoppingCart, Zap, Brain, CheckCircle, Loader2 } from 'lucide-react';
import AlertBar from '../components/AlertBar';
import { procurementData, suppliers } from '../data/mockData';

export default function Acquisti() {
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = () => {
    if (optimizing) return;
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 2000);
  };

  const discount = optimized ? 0.15 : 0;
  const forecastCost = optimized 
    ? Math.round(procurementData.baselineCost * (1 - discount)) 
    : procurementData.forecastCost;
  const savings = procurementData.baselineCost - forecastCost;

  return (
    <div className="space-y-0">
      <AlertBar message="URGENTE: Previsti +60gg sdoganamento per Stellantis Brasile - Spedizioni Italia bloccate in automatico" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT - BUNDLES */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart size={18} className="text-[#00d4aa]" />
              <h2 className="text-xl font-bold">ORDINI ACCORPATI · BUNDLE FORNITORI</h2>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {procurementData.totalLines} righe ordine raggruppate in {procurementData.totalBundles} bundle
            </p>

            <div className="space-y-4">
              {procurementData.bundles.map((bundle, bi) => {
                const bundleDiscount = optimized
                  ? (bundle.lines >= 3 ? 0.18 : bundle.lines === 2 ? 0.12 : 0.05)
                  : 0;
                const discountedTotal = optimized
                  ? Math.round(bundle.total * (1 - bundleDiscount))
                  : bundle.total;

                return (
                  <div key={bi} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${bi % 2 === 0 ? 'bg-amber-400' : 'bg-green-400'}`} />
                        <span className="font-bold">{bundle.supplier}</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{bundle.lines} righe</span>
                        {optimized && (
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold">
                            -{Math.round(bundleDiscount * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {optimized && (
                          <div className="text-xs line-through" style={{ color: 'var(--color-text-secondary)' }}>
                            {bundle.total.toLocaleString('it-IT')} €
                          </div>
                        )}
                        <span className="text-xl font-bold text-[#00d4aa]">{discountedTotal.toLocaleString('it-IT')} €</span>
                      </div>
                    </div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          <th className="text-left py-1">SKU</th>
                          <th className="text-left py-1">DESCRIZIONE</th>
                          <th className="text-right py-1">QTY</th>
                          <th className="text-right py-1">PREZZO UNIT.</th>
                          {optimized && <th className="text-right py-1">SCONTO</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {bundle.items.map((item, ii) => (
                          <tr key={ii} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                            <td className="py-2 font-mono text-xs text-[#00d4aa]">{item.sku}</td>
                            <td className="py-2">{item.desc}</td>
                            <td className="py-2 text-right">{item.qty}</td>
                            <td className="py-2 text-right">{item.price} €</td>
                            {optimized && (
                              <td className="py-2 text-right text-green-400 font-bold">
                                {Math.round(item.price * bundleDiscount)} €
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* COST SUMMARY */}
            <div className="card">
              <h3 className="font-bold mb-3">RIEPILOGO COSTI</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Costo baseline</span>
                  <span className="text-2xl font-bold">{procurementData.baselineCost.toLocaleString('it-IT')} €</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                  <span>Costo previsto</span>
                  <span className={`text-2xl font-bold ${optimized ? 'text-[#00d4aa]' : ''}`}>{forecastCost.toLocaleString('it-IT')} €</span>
                </div>
                {optimized && (
                  <div className="p-3 rounded-lg flex items-center justify-between"
                    style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
                    <span className="text-[#00d4aa] font-semibold">Risparmio AI</span>
                    <span className="text-xl font-bold text-[#00d4aa]">-{savings.toLocaleString('it-IT')} €</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleOptimize}
                disabled={optimizing || optimized}
                className={`w-full mt-4 flex items-center justify-center gap-2 ${optimized ? '' : 'btn-primary'}`}
                style={optimized ? {
                  background: 'rgba(0,212,170,0.1)',
                  border: '1px solid rgba(0,212,170,0.3)',
                  color: '#00d4aa',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                } : {}}
              >
                {optimizing ? (
                  <><Loader2 size={14} className="animate-spin" /> Ottimizzando carrello...</>
                ) : optimized ? (
                  <><CheckCircle size={14} /> Carrello Ottimizzato</>
                ) : (
                  <><Zap size={14} /> Ottimizza Carrello (AI)</>
                )}
              </button>
            </div>

            {/* AI LOGIC */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-[#00d4aa]" />
                <h3 className="font-bold">LOGICA AI</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                L'AI raggruppa le righe d'ordine per fornitore e applica sconti quantità simulati:
              </p>
              <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                <p className="text-sm font-semibold mb-2">Sconti quantità:</p>
                <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>· 5% per 1 riga</li>
                  <li>· 12% per 2 righe</li>
                  <li>· 18% per 3 o più righe consolidate</li>
                </ul>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Il modello considera: storico fornitore, lead-time medio, esposizione contrattuale e disponibilità di alternative.
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Ordini accorpati riducono anche i costi logistici (un solo trasporto per fornitore).
              </p>
            </div>

            {/* SUPPLIER RELIABILITY */}
            <div className="card">
              <h3 className="font-bold mb-3">AFFIDABILITÀ FORNITORI</h3>
              <div className="space-y-3">
                {suppliers.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-32">{s.name}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.trust}%`,
                          background: s.trust >= 90 ? '#22c55e' : s.trust >= 80 ? '#00d4aa' : s.trust >= 70 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{s.trust}</span>
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