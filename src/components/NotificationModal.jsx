import React from 'react';
import { X, Globe, Smartphone, CheckCircle2 } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, systemStatus }) {
  if (!isOpen) return null;

  const incident = systemStatus?.incident;
  // 計算 ETE (基於 SOP: Critical = 60m + penalty)
  const baseClearance = incident?.severity === 'Critical' ? 60 : 40;
  const penalty = 30; // 假設塞車罰則
  const ete = baseClearance + penalty;
  
  const location = incident?.location || '未知路段';
  const alternativeStr = systemStatus?.alternatives?.join(' 或 ') || '替代道路';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 10, 21, 0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div style={{
        background: 'var(--panel-bg)', border: '1px solid var(--panel-border)',
        borderRadius: '12px', width: '90%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
            <Smartphone size={20} color="#06b6d4" />
            細胞廣播 / CMS 電子看板通報
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b', fontSize: '0.875rem' }}>
            <Globe size={16} />
            系統偵測該區外籍漫遊比例達 32%，自動啟動多語文通報 (中/英/日/韓)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 中文 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>[中文]</span>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>【交通快訊】{location}發生事故，該路段已封閉。請改道{alternativeStr}，預計延誤 {ete} 分鐘。請注意安全。</p>
            </div>
            {/* English */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>[English]</span>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>[Traffic Alert] Incident at {location}. Road closed. Please detour to alternative routes. Est. delay {ete} mins. Stay safe.</p>
            </div>
            {/* Japanese */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>[日本語]</span>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>【交通情報】{location}で事故が発生し、通行止めです。迂回してください。約{ete}分の遅れが見込まれます。</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
            取消
          </button>
          <button onClick={() => { alert('已透過 API 派發多通路推播！'); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#06b6d4', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>
            <CheckCircle2 size={16} />
            一鍵發布 (全通路)
          </button>
        </div>
      </div>
    </div>
  );
}
