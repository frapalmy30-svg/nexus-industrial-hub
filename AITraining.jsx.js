import { useState } from 'react';
import { Brain, Cpu, Database, Zap, Play, Pause, RotateCcw, ChevronRight, CheckCircle, Clock, AlertCircle, BarChart3, Target, Layers, Activity, Shield, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import AlertBar from '../components/AlertBar';
import { aiTrainingModels, aiTrainingStats } from '../data/mockData';

function StatusBadge({ status }) {
  const styles = {
    deployed: 'bg-green-500/20 text-green-400 border-green-500/30',
    training: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    validation: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const labels = {
    deployed: 'DEPLOYED',
    training: 'TRAINING',
    validation: 'VALIDATION',
    failed: 'FAILED',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function MetricGauge({ label, value, maxValue = 100, color = '#00d4aa' }) {
  const percentage = (value / maxValue) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

function ModelDetail({ model, onClose }) {
  if (!model) return null;

  const metricsRadar = [
    { metric: 'Precision', value: model.metrics.precision },
    { metric: 'Recall', value: model.metrics.recall },
    { metric: 'F1 Score', value: model.metrics.f1Score },
    { metric: 'Accuracy', value: model.accuracy },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-[#00d4aa]">{model.id}</span>
              <StatusBadge status={model.status} />
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
              <AlertCircle size={18} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
          <h3 className="text-xl font-bold mt-2">{model.name}</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{model.type}</p>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{model.description}</p>

          <div className="grid grid-cols-4 gap-3">
            <div className="card text-center">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Accuracy</div>
              <div className="text-2xl font-bold text-[#00d4aa]">{model.accuracy}%</div>
            </div>
            <div className="card text-center">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Precision</div>
              <div className="text-2xl font-bold">{model.metrics.precision}%</div>
            </div>
            <div className="card text-center">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Recall</div>
              <div className="text-2xl font-bold">{model.metrics.recall}%</div>
            </div>
            <div className="card text-center">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>F1 Score</div>
              <div className="text-2xl font-bold">{model.metrics.f1Score}%</div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-3">Training History - Loss & Accuracy</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>Loss</h5>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={model.trainingHistory}>
                    <defs>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" />
                    <XAxis dataKey="epoch" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2a3042', borderRadius: '8px', color: '#f1f5f9' }} />
                    <Area type="monotone" dataKey="loss" stroke="#ef4444" fill="url(#lossGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h5 className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>Accuracy</h5>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={model.trainingHistory}>
                    <defs>
                      <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" />
                    <XAxis dataKey="epoch" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2a3042', borderRadius: '8px', color: '#f1f5f9' }} />
                    <Area type="monotone" dataKey="accuracy" stroke="#00d4aa" fill="url(#accGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-3">Performance Radar</h4>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={metricsRadar}>
                <PolarGrid stroke="#2a3042" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <RechartsRadar name="Performance" dataKey="value" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="card">
              <span style={{ color: 'var(--color-text-secondary)' }}>Data Points</span>
              <div className="font-bold text-lg">{model.dataPoints.toLocaleString()}</div>
            </div>
            <div className="card">
              <span style={{ color: 'var(--color-text-secondary)' }}>False Positive Rate</span>
              <div className="font-bold text-lg">{model.metrics.falsePositiveRate}%</div>
            </div>
            <div className="card">
              <span style={{ color: 'var(--color-text-secondary)' }}>Last Trained</span>
              <div className="font-bold text-lg">{model.lastTrained}</div>
            </div>
            <div className="card">
              <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
              <div className="mt-1"><StatusBadge status={model.status} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AITraining() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [actionStates, setActionStates] = useState({ training: 'idle', retrain: 'idle', deploy: 'idle' });

  const handleAction = (action, label) => {
    if (actionStates[action] !== 'idle') return;
    setActionStates(prev => ({ ...prev, [action]: 'loading' }));
    setTimeout(() => {
      setActionStates(prev => ({ ...prev, [action]: 'done' }));
    }, 2000);
  };

  const allTrainingData = aiTrainingModels[0].trainingHistory.map((_, i) => ({
    epoch: aiTrainingModels[0].trainingHistory[i].epoch,
    ...Object.fromEntries(
      aiTrainingModels.map(m => [m.id, m.trainingHistory[i]?.accuracy || 0])
    )
  }));

  return (
    <div className="space-y-0">
      <AlertBar message="MDL-002 Quality Vision: Training epoch 47/100 - ETA completamento 3h 15m" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Brain size={22} className="text-[#00d4aa]" />
              <h2 className="text-xl font-bold">AI TRAINING · MODEL MANAGEMENT</h2>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Gestione modelli AI · Training pipeline · Performance monitoring · Data management
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card text-center">
            <Layers size={20} className="mx-auto mb-2 text-[#00d4aa]" />
            <div className="text-2xl font-bold">{aiTrainingStats.totalModels}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Modelli Totali</div>
          </div>
          <div className="card text-center">
            <CheckCircle size={20} className="mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-green-400">{aiTrainingStats.deployed}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Deployed</div>
          </div>
          <div className="card text-center">
            <Activity size={20} className="mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-blue-400">1</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>In Training</div>
          </div>
          <div className="card text-center">
            <Database size={20} className="mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">{aiTrainingStats.totalDataPoints}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Data Points</div>
          </div>
          <div className="card text-center">
            <Target size={20} className="mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold text-[#00d4aa]">{aiTrainingStats.avgAccuracy}%</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Avg Accuracy</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - MODELS */}
          <div className="lg:col-span-2 space-y-4">
            {/* GLOBAL COMPARISON */}
            <div className="card">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <BarChart3 size={16} className="text-[#00d4aa]" />
                Confronto Accuracy Modelli nel Tempo
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={allTrainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" />
                  <XAxis dataKey="epoch" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Epoch', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -5 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2a3042', borderRadius: '8px', color: '#f1f5f9' }} />
                  {aiTrainingModels.map((m, i) => {
                    const colors = ['#00d4aa', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'];
                    return <Line key={m.id} type="monotone" dataKey={m.id} stroke={colors[i]} strokeWidth={2} dot={false} name={m.name} />;
                  })}
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {aiTrainingModels.map((m, i) => {
                  const colors = ['#00d4aa', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'];
                  return (
                    <div key={m.id} className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-0.5 rounded" style={{ background: colors[i] }} />
                      <span style={{ color: 'var(--color-text-secondary)' }}>{m.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MODEL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiTrainingModels.map(model => {
                const iconMap = {
                  'MDL-001': <Activity size={16} className="text-[#00d4aa]" />,
                  'MDL-002': <Target size={16} className="text-blue-400" />,
                  'MDL-003': <Shield size={16} className="text-amber-400" />,
                  'MDL-004': <Brain size={16} className="text-purple-400" />,
                  'MDL-005': <Zap size={16} className="text-red-400" />,
                };
                return (
                  <div key={model.id}
                    className="card card-hover cursor-pointer"
                    onClick={() => setSelectedModel(model)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {iconMap[model.id]}
                        <span className="font-mono text-sm font-bold text-[#00d4aa]">{model.id}</span>
                      </div>
                      <StatusBadge status={model.status} />
                    </div>
                    <h4 className="font-bold mb-1">{model.name}</h4>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>{model.type}</p>

                    <div className="space-y-2 mb-3">
                      <MetricGauge label="Accuracy" value={model.accuracy} color="#00d4aa" />
                      <MetricGauge label="Precision" value={model.metrics.precision} color="#3b82f6" />
                      <MetricGauge label="Recall" value={model.metrics.recall} color="#a855f7" />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {model.dataPoints.toLocaleString()} data points
                      </span>
                      <span className="text-[#00d4aa] flex items-center gap-1">
                        Dettagli <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* GPU STATUS */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={16} className="text-[#00d4aa]" />
                <h3 className="font-bold">GPU CLUSTER STATUS</h3>
              </div>
              <div className="space-y-3">
                <MetricGauge label="GPU Utilization" value={aiTrainingStats.gpuUtilization} color="#00d4aa" />
                <MetricGauge label="VRAM Usage" value={67} color="#3b82f6" />
                <MetricGauge label="Temperature" value={72} maxValue={100} color="#f59e0b" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-center p-2 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Device</div>
                  <div className="text-sm font-bold">NVIDIA A100</div>
                </div>
                <div className="text-center p-2 rounded" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>VRAM</div>
                  <div className="text-sm font-bold">80 GB</div>
                </div>
              </div>
            </div>

            {/* TRAINING QUEUE */}
            <div className="card">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                Training Queue
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg flex items-center justify-between"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <div>
                    <div className="text-sm font-semibold">MDL-002 Quality Vision</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Epoch 47/100 · ETA 3h 15m</div>
                    <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'var(--color-border)' }}>
                      <div className="h-full rounded-full bg-blue-400" style={{ width: '47%' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <Pause size={14} className="text-blue-400 cursor-pointer" />
                  </div>
                </div>
                <div className="p-3 rounded-lg flex items-center justify-between"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div className="text-sm font-semibold">MDL-005 Energy Optimizer</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>In coda · Priorità: Media</div>
                  </div>
                  <Play size={14} style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </div>
            </div>

            {/* DATA PIPELINE */}
            <div className="card">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Database size={16} className="text-[#00d4aa]" />
                Data Pipeline
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Sensori IoT', count: '1.2M', status: 'live', color: '#22c55e' },
                  { label: 'Log Manutenzione', count: '450K', status: 'sync', color: '#3b82f6' },
                  { label: 'Immagini Qualità', count: '320K', status: 'live', color: '#22c55e' },
                  { label: 'Dati Logistica', count: '180K', status: 'batch', color: '#f59e0b' },
                  { label: 'Storico Garanzie', count: '85K', status: 'sync', color: '#3b82f6' },
                ].map((source, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: source.color }} />
                      <span className="text-sm">{source.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold">{source.count}</span>
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full" style={{
                        background: `${source.color}20`,
                        color: source.color,
                        border: `1px solid ${source.color}40`
                      }}>{source.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card">
              <h3 className="font-bold mb-3">Azioni Rapide</h3>
              <div className="space-y-2">
                {[
                  { key: 'training', icon: Play, label: 'Avvia Nuovo Training', doneLabel: 'Training Avviato' },
                  { key: 'retrain', icon: RotateCcw, label: 'Re-train Modello', doneLabel: 'Re-training Avviato' },
                  { key: 'deploy', icon: Zap, label: 'Deploy in Produzione', doneLabel: 'Deploy Completato' },
                ].map(({ key, icon: Icon, label, doneLabel }) => (
                  <button key={key}
                    onClick={() => handleAction(key)}
                    disabled={actionStates[key] !== 'idle'}
                    className="w-full p-3 rounded-lg text-left text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                    style={actionStates[key] === 'done'
                      ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }
                      : { background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }
                    }>
                    {actionStates[key] === 'loading' ? (
                      <><Loader2 size={14} className="text-[#00d4aa] animate-spin" /> {label}...</>
                    ) : actionStates[key] === 'done' ? (
                      <><CheckCircle size={14} className="text-green-400" /> <span className="text-green-400">{doneLabel}</span></>
                    ) : (
                      <><Icon size={14} className="text-[#00d4aa]" /> {label}</>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedModel && <ModelDetail model={selectedModel} onClose={() => setSelectedModel(null)} />}
    </div>
  );
}