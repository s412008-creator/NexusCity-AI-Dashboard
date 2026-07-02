import React from 'react';
import { AlertCircle, Zap, Send } from 'lucide-react';
import incidentData from '../data/live_incidents.json';
import roadData from '../data/road_network_geometry.json';

export default function IncidentManager({ systemStatus, setSystemStatus, onShowNotification }) {
  const injectEvent = (index) => {
    const incident = incidentData[index];
    
    // 找出受影響路段的替代道路
    const affectedRoadInfo = roadData.find(r => r.segment_id === incident.affected_segment);
    
    // 智慧過濾：只挑選承載容量 (capacity_vph) 大於 1200 的路段作為推薦替代道路
    let smartAlternatives = [];
    if (affectedRoadInfo && affectedRoadInfo.alternatives) {
      smartAlternatives = affectedRoadInfo.alternatives.filter(altId => {
        const altRoad = roadData.find(r => r.segment_id === altId);
        return altRoad && altRoad.capacity_vph >= 1200;
      });
    }
    
    setSystemStatus({
      status: 'alert',
      incident: incident,
      alternatives: smartAlternatives
    });
  };

  const resetEvent = () => {
    setSystemStatus({ status: 'normal', incident: null, alternatives: [] });
  };

  const isAlert = systemStatus.status === 'alert';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {!isAlert ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>請選擇突發事件情境進行演練：</div>
          <button 
            onClick={() => injectEvent(0)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'rgba(239, 68, 68, 0.1)', color: 'var(--alert-red)', 
              border: '1px solid var(--alert-red)', 
              padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.875rem'
            }}
          >
            <Zap size={16} /> 情境一：光復南路重大車禍 (Critical)
          </button>
          <button 
            onClick={() => injectEvent(1)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', 
              border: '1px solid #f59e0b', 
              padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.875rem'
            }}
          >
            <Zap size={16} /> 情境二：大巨蛋散場推擠 (High)
          </button>
          <button 
            onClick={() => injectEvent(2)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', 
              border: '1px solid #38bdf8', 
              padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.875rem'
            }}
          >
            <Zap size={16} /> 情境三：信義區號誌異常 (Medium)
          </button>
        </div>
      ) : (
        <>
          <button 
            onClick={resetEvent}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'transparent', color: 'var(--text-secondary)', 
              border: '1px solid transparent', 
              padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.875rem'
            }}
          >
            恢復正常狀態
          </button>
          <button 
            onClick={onShowNotification}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'var(--text-primary)', color: 'var(--bg-color)', 
              border: 'none', 
              padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.875rem'
            }}
          >
            <Send size={16} />
            發布多語化通報
          </button>
        </>
      )}
    </div>
  );
}
