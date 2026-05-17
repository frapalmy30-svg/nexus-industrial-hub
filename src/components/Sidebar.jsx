import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Truck, ShoppingCart, Warehouse,
  MonitorCog, Eye, AlertTriangle, Zap, Leaf
} from 'lucide-react';

// Ottimo: l'array costante è fuori dal componente per ottimizzare le performance
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'DASHBOARD' },
  { to: '/logistica', icon: Truck, label: 'LOGISTICA' },
  { to: '/acquisti', icon: ShoppingCart, label: 'ACQUISTI' },
  { to: '/magazzino', icon: Warehouse, label: 'MAGAZZINO' },
  { to: '/digital-twin', icon: MonitorCog, label: 'DIGITAL TWIN' },
  { to: '/visual-training', icon: Eye, label: 'AI TRAINING' },
  { to: '/risk-mitigation', icon: AlertTriangle, label: 'RISK MITIGATION' },
  { to: '/carbon-footprint', icon: Leaf, label: 'CARBON' },
];

export default function Sidebar() {
  return (
    <aside 
      className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-4 z-50"
      style={{ background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)' }}
    >
      {/* --- Logo / Header Sidebar --- */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #00d4aa, #00a88a)' }}
        >
          <Zap size={22} color="#0a0e17" aria-hidden="true" />
        </div>
      </div>

      {/* --- Navigazione Principale --- */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-2" aria-label="Navigazione principale">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-center transition-all duration-200 group
              ${isActive
                ? 'text-[#00d4aa] bg-[#00d4aa]/10 border border-[#00d4aa]/30'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1a1f2e] border border-transparent'
              }`
            }
          >
            <Icon size={20} aria-hidden="true" />
            <span className="text-[0.55rem] font-medium leading-tight">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* --- Profilo Utente / Info Turno --- */}
      <div className="mt-auto flex flex-col items-center gap-2 pb-2">
        <div className="text-[0.6rem] text-[#94a3b8] font-medium">PM</div>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
          title="Profilo Utente: FR"
        >
          FR
        </div>
        <div className="text-[0.55rem] text-[#94a3b8] uppercase tracking-wider">turno 1</div>
      </div>
    </aside>
  );
}