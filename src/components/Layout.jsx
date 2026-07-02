import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  MessageSquareWarning, 
  Settings, 
  Activity,
  Car,
  Users,
  Bell,
  Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout({ children, headerActions, activeTab, setActiveTab }) {
  const { language, setLanguage, t } = useLanguage();
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
            {t('menu_dashboard')}
          </div>
          <div onClick={() => setActiveTab('incident')} className={`nav-item ${activeTab === 'incident' ? 'active' : ''}`}>
            <AlertTriangle size={20} />
            {t('menu_incident')}
          </div>

          <div onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={20} />
            {t('menu_settings')}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1>{t('app_title')}</h1>
          <div className="topbar-actions">
            {headerActions}
            
            {/* 語系切換 */}
            <div style={{ position: 'relative' }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="zh">🇹🇼 中文</option>
                <option value="en">🇺🇸 EN</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ko">🇰🇷 한국어</option>
              </select>
            </div>

            <div className="status-badge">
              <span className="status-dot"></span>
              {t('status_monitoring')}
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
