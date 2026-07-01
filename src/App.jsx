import React, { useState, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import IncidentManager from './components/IncidentManager';
import NotificationModal from './components/NotificationModal';

// 動態載入大型元件 (Code-Splitting) 以大幅提升首屏載入速度
const TrafficChart = lazy(() => import('./components/TrafficChart'));
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
const DecisionPanel = lazy(() => import('./components/DecisionPanel'));
const NetworkMap = lazy(() => import('./components/NetworkMap'));
import { Users, Car, AlertTriangle, ShieldCheck } from 'lucide-react';
import './App.css';

function App() {
  const [systemStatus, setSystemStatus] = useState({
    status: 'normal',
    incident: null,
    alternatives: []
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isNormal = systemStatus.status === 'normal';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Top Stat Cards */}
            <div className="col-span-3 glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="stat-icon"><Car size={24} /></div>
              <div className="stat-info">
                <h3>信義區總車流</h3>
                <div className="value">4,205 <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>↑ 12%</span></div>
              </div>
            </div>
            
            <div className="col-span-3 glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info">
                <h3>大巨蛋周邊人潮</h3>
                <div className="value">18,520 <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>↑ 34%</span></div>
              </div>
            </div>

            <div className="col-span-3 glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="stat-icon"><ShieldCheck size={24} /></div>
              <div className="stat-info">
                <h3>AI 判定級別</h3>
                <div className="value">SOP 監控中</div>
              </div>
            </div>

            <div className="col-span-3 glass-panel stat-card animate-fade-in" style={{ animationDelay: '0.4s', borderColor: isNormal ? '' : 'var(--alert-red)' }}>
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

            {/* Chart Section (滿版) */}
            <div className="col-span-12 glass-panel animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="panel-header">
                <h2 className="panel-title">動態時序車人流監測 (Live Time-Series)</h2>
                <div className="status-badge"><span className="status-dot"></span>Live</div>
              </div>
              <div className="panel-content">
                <TrafficChart />
              </div>
            </div>
          </>
        );

      case 'incident':
        return (
          <>
            <div className="col-span-4 glass-panel animate-fade-in">
              <div className="panel-header">
                <h2 className="panel-title">AI 推理與決策分析</h2>
              </div>
              <div className="panel-content" style={{ height: '500px', overflowY: 'auto' }}>
                <DecisionPanel systemStatus={systemStatus} />
              </div>
            </div>
            <div className="col-span-8 glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="panel-header">
                <h2 className="panel-title">智慧路網與疏散路徑</h2>
              </div>
              <div className="panel-content" style={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <NetworkMap systemStatus={systemStatus} />
              </div>
            </div>
          </>
        );

      case 'consulting':
        return (
          <div className="col-span-12 glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
            <div className="panel-header">
              <h2 className="panel-title">互動式策略諮詢</h2>
            </div>
            <ChatAssistant />
          </div>
        );

      case 'settings':
        return (
          <div className="col-span-12 glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>系統設定 (System Settings)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid var(--panel-border)', borderRadius: '4px', background: 'var(--bg-color)' }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>AI 疏散決策敏感度</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>調整觸發 SOP 事件之數據門檻 (目前設定：高)</div>
                </div>
                <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>高 (High)</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid var(--panel-border)', borderRadius: '4px', background: 'var(--bg-color)' }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>多語化通報模組</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>自動偵測漫遊比率並翻譯告警內容至細胞廣播</div>
                </div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>已啟用 (Active)</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid var(--panel-border)', borderRadius: '4px', background: 'var(--bg-color)' }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>中華電信大數據 API</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>即時車流與信令資料源狀態</div>
                </div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>連線正常 (Connected)</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      headerActions={
        <IncidentManager 
          systemStatus={systemStatus} 
          setSystemStatus={setSystemStatus} 
          onShowNotification={() => setIsModalOpen(true)}
        />
      }
    >
      <div className="dashboard-grid">
        <Suspense fallback={
          <div className="col-span-12" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: '1rem', opacity: 0.5 }}>模組載入中 (Loading Module...)</div>
          </div>
        }>
          {renderContent()}
        </Suspense>
      </div>

      <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} systemStatus={systemStatus} />
    </Layout>
  );
}

export default App;
