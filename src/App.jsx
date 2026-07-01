import React, { useState } from 'react';
import Layout from './components/Layout';
import TrafficChart from './components/TrafficChart';
import ChatAssistant from './components/ChatAssistant';
import DecisionPanel from './components/DecisionPanel';
import IncidentManager from './components/IncidentManager';
import NotificationModal from './components/NotificationModal';
import NetworkMap from './components/NetworkMap';
import { Users, Car, AlertTriangle, ShieldCheck } from 'lucide-react';
import './App.css';

function App() {
  const [systemStatus, setSystemStatus] = useState({
    status: 'normal',
    incident: null,
    alternatives: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isNormal = systemStatus.status === 'normal';

  return (
    <Layout 
      headerActions={
        <IncidentManager 
          systemStatus={systemStatus} 
          setSystemStatus={setSystemStatus} 
          onShowNotification={() => setIsModalOpen(true)}
        />
      }
    >
      <div className="dashboard-grid">
        {/* Top Stat Cards */}
        <div className="col-span-3 glass-panel stat-card">
          <div className="stat-icon">
            <Car size={24} />
          </div>
          <div className="stat-info">
            <h3>信義區總車流</h3>
            <div className="value">4,205 <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>↑ 12%</span></div>
          </div>
        </div>
        
        <div className="col-span-3 glass-panel stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>大巨蛋周邊人潮</h3>
            <div className="value">18,520 <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>↑ 34%</span></div>
          </div>
        </div>

        <div className="col-span-3 glass-panel stat-card">
          <div className="stat-icon">
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>AI 判定級別</h3>
            <div className="value">SOP 監控中</div>
          </div>
        </div>

        <div className="col-span-3 glass-panel stat-card" style={{ borderColor: isNormal ? 'transparent' : 'var(--alert-red)' }}>
          <div className="stat-icon" style={{ color: isNormal ? 'var(--text-secondary)' : 'var(--alert-red)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>突發事件警報</h3>
            <div className="value" style={{ color: isNormal ? 'var(--text-secondary)' : 'var(--alert-red)' }}>
              {isNormal ? '無異常' : '偵測到異常'}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="col-span-8 glass-panel">
          <div className="panel-header">
            <h2 className="panel-title">動態時序車人流監測 (Live Time-Series)</h2>
            <div className="status-badge">
              <span className="status-dot"></span>
              Live
            </div>
          </div>
          <div className="panel-content">
            <TrafficChart />
          </div>
        </div>

        {/* AI Decision Panel */}
        <div className="col-span-4 glass-panel">
          <div className="panel-header">
            <h2 className="panel-title">AI 推理與決策分析</h2>
          </div>
          <div className="panel-content" style={{ height: '300px', overflowY: 'auto' }}>
            <DecisionPanel systemStatus={systemStatus} />
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="col-span-8 glass-panel">
          <div className="panel-header">
            <h2 className="panel-title">智慧路網與疏散路徑</h2>
          </div>
          <div className="panel-content" style={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <NetworkMap systemStatus={systemStatus} />
          </div>
        </div>

        {/* Chat Assistant */}
        <div className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <h2 className="panel-title">互動式策略諮詢</h2>
          </div>
          <ChatAssistant />
        </div>

      </div>

      <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} systemStatus={systemStatus} />
    </Layout>
  );
}

export default App;
