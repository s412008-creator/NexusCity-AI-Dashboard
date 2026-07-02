import React from 'react';
import { Camera, Radio } from 'lucide-react';

const CCTV_FEEDS = [
  { id: 1, location: '光復南路 / 忠孝東路口', status: 'LIVE', active: true },
  { id: 2, location: '大巨蛋 - 北側散場出口', status: 'LIVE', active: true },
  { id: 3, location: '信義區 - 基隆路地下道', status: 'LIVE', active: true },
  { id: 4, location: '市民大道 / 延吉街口', status: 'REC', active: false },
];

export default function CctvPanel() {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ padding: '1.25rem' }}>
        <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Camera size={18} color="var(--accent-primary)" />
          關鍵路口即時影像
        </h2>
        <div className="status-badge"><span className="status-dot"></span>網狀監控網</div>
      </div>
      
      <div className="panel-content" style={{ padding: '0 1.25rem 1.25rem 1.25rem', flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {CCTV_FEEDS.map(feed => (
          <div key={feed.id} style={{
            background: '#050505',
            border: '1px solid var(--panel-border)',
            borderRadius: '6px',
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* 模擬監視器畫面背景 */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(45deg, #111, #1a1a1a)',
              opacity: 0.8
            }}>
               {/* CSS Scanlines effect */}
               <div style={{
                 position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                 background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)'
               }}></div>
            </div>

            {/* 地名與狀態列 */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, padding: '0.25rem 0.5rem',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '0.65rem', color: 'var(--text-secondary)'
            }}>
              <span>CAM-{feed.id.toString().padStart(2, '0')} | {feed.location}</span>
              {feed.active && (
                <span style={{ color: 'var(--alert-red)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, animation: 'pulse 2s infinite' }}>
                  <Radio size={10} /> {feed.status}
                </span>
              )}
            </div>

            {/* 畫面中央十字線 */}
            <div style={{ position: 'absolute', width: '20px', height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ position: 'absolute', width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>

            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
              2026-07-02 {feed.active ? new Date().toLocaleTimeString() : '13:00:00'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
