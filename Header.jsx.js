import { Leaf, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <header 
      className="flex items-center justify-between px-6 py-3"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
          NEXUS INDUSTRIAL HUB
        </h1>
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Automazioni & Service s.r.l. · PMIS ≡ SCM Sync
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.3)' }}
        >
          <Leaf size={14} style={{ color: 'var(--color-accent)' }} />
          <div className="text-right">
            <div className="text-[0.65rem]" style={{ color: 'var(--color-text-secondary)' }}>
              CO₂ Risparmiati
            </div>
            <div className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
              2847 kg
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          style={{ color: 'var(--color-text-secondary)' }}
          title={darkMode ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
          aria-label="Attiva/Disattiva Dark Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}