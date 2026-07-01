import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  MessageSquareWarning, 
  Settings, 
  Activity,
  Car,
  Users,
  Bell
} from 'lucide-react';

export default function Layout({ children, headerActions, activeTab, setActiveTab }) {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Activity className="icon" size={28} />
          <span>CityAI.Ops</span>
        </div>
        <nav className="sidebar-nav">
          <div onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            時序監測儀表板
          </div>
          <div onClick={() => setActiveTab('incident')} className={`nav-item ${activeTab === 'incident' ? 'active' : ''}`}>
            <AlertTriangle size={20} />
            事件注入管理
          </div>

          <div onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={20} />
            系統設定
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1>交控中心戰情室 (Command Center)</h1>
          <div className="topbar-actions">
            {headerActions}
            <div className="status-badge">
              <span className="status-dot"></span>
              SOP 系統監控中
            </div>
            <button style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <Bell size={24} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {children}
      </main>
    </div>
  );
}
