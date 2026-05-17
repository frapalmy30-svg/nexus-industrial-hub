import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Logistica from './pages/Logistica';
import Acquisti from './pages/Acquisti';
import Magazzino from './pages/Magazzino';
import DigitalTwin from './pages/DigitalTwin';
import VisualTraining from './pages/VisualTraining';
import RiskMitigation from './pages/RiskMitigation';
import CarbonFootprint from './pages/CarbonFootprint';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
        <Sidebar />
        <main className="flex-1 ml-20 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/logistica" element={<Logistica />} />
              <Route path="/acquisti" element={<Acquisti />} />
              <Route path="/magazzino" element={<Magazzino />} />
              <Route path="/digital-twin" element={<DigitalTwin />} />
              <Route path="/visual-training" element={<VisualTraining />} />
              <Route path="/risk-mitigation" element={<RiskMitigation />} />
              <Route path="/carbon-footprint" element={<CarbonFootprint />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;