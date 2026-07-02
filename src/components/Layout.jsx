import React, { useState } from 'react';
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
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const langOptions = [
    { code: 'zh', label: '🇹🇼 中文' },
    { code: 'en', label: '🇺🇸 EN' },
    { code: 'ja', label: '🇯🇵 日本語' },
    { code: 'ko', label: '🇰🇷 한국어' }
  ];
  const currentLang = langOptions.find(l => l.code === language) || langOptions[0];

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
            
            {/* 語系切換 (Custom Dropdown) */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <Globe size={16} color="var(--accent-primary)" />
                {currentLang.label}
              </button>

              {isLangMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'rgba(17, 17, 19, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '8px',
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: '120px',
                  zIndex: 1000,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  {langOptions.map(option => (
                    <div 
                      key={option.code}
                      onClick={() => {
                        setLanguage(option.code);
                        setIsLangMenuOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: option.code === language ? '#fff' : 'var(--text-secondary)',
                        background: option.code === language ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if(option.code !== language) e.target.style.background = 'rgba(255,255,255,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if(option.code !== language) e.target.style.background = 'transparent';
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
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
