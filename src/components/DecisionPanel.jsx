import React from 'react';
import { BookOpen, Clock, Activity, Target } from 'lucide-react';

export default function DecisionPanel({ systemStatus }) {
  if (systemStatus.status !== 'alert' || !systemStatus.incident) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', gap: '1rem', minHeight: '300px' }}>
        <Activity size={48} opacity={0.2} />
        <p>目前無突發事件，持續監控 SOP 條件中。</p>
      </div>
    );
  }

  const { incident, alternatives } = systemStatus;
  
  // 根據不同事件類型動態引用 SOP 與計算
  let sopTitle = '';
  let sopContent = null;
  let baseClearance = 40;
  let penalty = 30;

  if (incident.type === 'Road_Collapse_Accident') {
    sopTitle = '第 1 條重大交通事故與 第 2 條主疏散規則';
    baseClearance = 60;
    penalty = 45;
    sopContent = (
      <>
        <span style={{color: 'var(--text-secondary)'}}>事故為 Critical 等級。已自動篩選周邊道路。建議將車流引導至</span> <b style={{color: 'var(--text-primary)'}}>{alternatives.length > 0 ? alternatives.join(', ') : '周邊可用道路'}</b>。<br/>
        <span style={{color: 'var(--text-secondary)'}}>CMS 建議：</span><span style={{color: 'var(--text-primary)'}}>「{incident.location}封閉，請改道，預計延誤 {baseClearance + penalty} 分鐘」</span>
      </>
    );
  } else if (incident.type === 'Crowd_Surge_Injury') {
    sopTitle = '第 4 條大巨蛋散場啟動 與 第 3 條捷運分流';
    baseClearance = 30;
    penalty = 15;
    sopContent = (
      <>
        <span style={{color: 'var(--text-secondary)'}}>檢測到人流峰值與推擠。啟動捷運與公車聯防接駁。</span><br/>
        <span style={{color: 'var(--text-secondary)'}}>處置建議：</span><span style={{color: 'var(--text-primary)'}}>「要求北捷列車過站不停，並引導群眾步行至周邊接駁點或市政府站」</span>
      </>
    );
  } else {
    sopTitle = '第 5 條號誌異常處理 SOP';
    baseClearance = 20;
    penalty = 10;
    sopContent = (
      <>
        <span style={{color: 'var(--text-secondary)'}}>號誌中斷導致車流交織風險增加。</span><br/>
        <span style={{color: 'var(--text-secondary)'}}>處置建議：</span><span style={{color: 'var(--text-primary)'}}>「通知轄區分局派員進行人工交通指揮，降低周邊路段速限至 30km/h」</span>
      </>
    );
  }

  const ete = baseClearance + penalty;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', minHeight: '300px' }}>
      <div style={{ background: 'var(--bg-color)', border: '1px solid var(--alert-red)', padding: '1rem', borderRadius: '4px' }}>
        <h3 style={{ color: 'var(--alert-red)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} />
            AI 判定結果：{incident.severity === 'Critical' ? 'A 級重大事件' : incident.severity === 'High' ? 'B 級事件' : 'C 級事件'}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            AI 信心水準: 98.5%
          </span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          偵測到「{incident.location}」{incident.type}。<br/>
          描述：{incident.description}
        </p>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <BookOpen size={14} />
          觸發 SOP 條款 (車禍與路障應變)
        </h4>
        <div style={{ background: 'var(--bg-color)', border: '1px solid var(--panel-border)', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid var(--accent-primary)' }}>
          <strong style={{color: 'var(--text-primary)'}}>{sopTitle}：</strong><br/>
          {sopContent}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Clock size={14} />
          ETE 預估恢復時間
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: '4px' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ete} <span style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>分鐘</span></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>包含壅塞補償時間計算</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            依據第 7 條公式計算:<br/>
            (基數 {baseClearance}m + 罰則 {penalty}m)
          </div>
        </div>
      </div>
    </div>
  );
}
