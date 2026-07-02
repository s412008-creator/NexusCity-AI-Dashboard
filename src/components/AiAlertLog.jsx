import React from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AI_LOGS = [
  { id: 1, time: 'Just now', type: 'info', msg: '系統自動校準模型預測權重，已納入最新天氣因子 (降雨機率 40%)' },
  { id: 2, time: '2 mins ago', type: 'warning', msg: '預測 22:30 大巨蛋周邊散場人潮將達 1.5 萬人次峰值' },
  { id: 3, time: '15 mins ago', type: 'action', msg: '已預先開啟信義區連鎖號誌計畫，延長忠孝東路綠燈秒數 15s' },
  { id: 4, time: '1 hour ago', type: 'info', msg: '完成早班與午班車流數據匯總，整體車網健康度: 良好' },
];

export default function AiAlertLog() {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ padding: '1.25rem' }}>
        <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Activity size={18} color="var(--accent-primary)" />
          AI 預警與決策日誌
        </h2>
      </div>
      
      <div className="panel-content" style={{ padding: '0 1.25rem 1.25rem 1.25rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {AI_LOGS.map((log, index) => (
            <div key={log.id} style={{
              display: 'flex', gap: '0.75rem', 
              opacity: 1 - (index * 0.15), // 越舊的紀錄越暗
            }}>
              <div style={{ marginTop: '0.25rem' }}>
                {log.type === 'warning' && <AlertTriangle size={16} color="var(--warn-yellow)" />}
                {log.type === 'action' && <CheckCircle2 size={16} color="#10b981" />}
                {log.type === 'info' && <Activity size={16} color="var(--text-secondary)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {log.type === 'warning' ? 'Anomaly Prediction' : log.type === 'action' ? 'Automated Action' : 'System Event'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{log.time}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {log.msg}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
