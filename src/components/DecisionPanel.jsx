import React from 'react';
import { BookOpen, Clock, Activity, Target, Zap, HeartPulse, Plane } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function DecisionPanel({ systemStatus }) {
  const { t } = useLanguage();

  if (systemStatus.status !== 'alert' || !systemStatus.incident) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', gap: '1rem', minHeight: '300px' }}>
        <Activity size={48} opacity={0.2} />
        <p>{t('no_incidents_monitoring')}</p>
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
    sopTitle = t('sop_title_road_accident');
    baseClearance = 60;
    penalty = 45;
    sopContent = (
      <>
        <span style={{color: 'var(--text-secondary)'}}>{t('sop_desc_road_accident_1')}</span> <b style={{color: 'var(--text-primary)'}}>{alternatives.length > 0 ? alternatives.join(', ') : t('nearby_roads')}</b>。<br/>
        <span style={{color: 'var(--text-secondary)'}}>{t('cms_suggestion')}：</span><span style={{color: 'var(--text-primary)'}}>"{incident.location}{t('road_closed_delay', { time: baseClearance + penalty })}"</span>
      </>
    );
  } else if (incident.type === 'Crowd_Surge_Injury') {
    sopTitle = t('sop_title_crowd_surge');
    baseClearance = 30;
    penalty = 15;
    sopContent = (
      <>
        <span style={{color: 'var(--text-secondary)'}}>{t('sop_desc_crowd_surge_1')}</span><br/>
        <span style={{color: 'var(--text-secondary)'}}>{t('disposal_suggestion')}：</span><span style={{color: 'var(--text-primary)'}}>"{t('crowd_action_advice')}"</span>
      </>
    );
  } else {
    sopTitle = t('sop_title_signal_error');
    baseClearance = 20;
    penalty = 10;
    sopContent = (
      <>
        <span style={{color: 'var(--text-secondary)'}}>{t('sop_desc_signal_error_1')}</span><br/>
        <span style={{color: 'var(--text-secondary)'}}>{t('disposal_suggestion')}：</span><span style={{color: 'var(--text-primary)'}}>"{t('signal_action_advice')}"</span>
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
            {t('ai_verdict')}: {incident.severity === 'Critical' ? t('severity_a') : incident.severity === 'High' ? t('severity_b') : t('severity_c')}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {t('ai_confidence')}: 98.5%
          </span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {t('detected_event', { location: incident.location, type: incident.type })}。<br/>
          {t('description')}: {incident.description}
        </p>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <BookOpen size={14} />
          {t('triggered_sop')}
        </h4>
        <div style={{ background: 'var(--bg-color)', border: '1px solid var(--panel-border)', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid var(--accent-primary)' }}>
          <strong style={{color: 'var(--text-primary)'}}>{sopTitle}：</strong><br/>
          {sopContent}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Zap size={14} color="#10b981" />
          Smart Grid & Energy Dispatch
        </h4>
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid #10b981' }}>
          <strong style={{color: '#10b981'}}>Microgrid Protection Protocol Initiated:</strong><br/>
          <span style={{color: 'var(--text-secondary)'}}>Automatically cutting non-essential power in the incident zone to prevent energy waste.</span><br/>
          <span style={{color: 'var(--text-primary)'}}>Backup power prioritized and routed to nearby hospitals and shelters.</span>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <HeartPulse size={14} color="#ec4899" />
          Biomedical Data Platform Link
        </h4>
        <div style={{ background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid #ec4899' }}>
          <strong style={{color: '#ec4899'}}>Dynamic Medical Capacity Balancing:</strong><br/>
          <span style={{color: 'var(--text-secondary)'}}>Connected to regional biomedical DB to analyze ER capacity. Hospital A ER reaching limit;</span><br/>
          <span style={{color: 'var(--text-primary)'}}>AI has redirected inbound ambulances to Hospital B and pre-transmitted triage data.</span>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Plane size={14} color="#f59e0b" />
          Autonomous Drone & Digital Twin
        </h4>
        <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid #f59e0b' }}>
          <strong style={{color: '#f59e0b'}}>Digital Twin 3D Modeling Initiated:</strong><br/>
          <span style={{color: 'var(--text-secondary)'}}>Dispatched 3 scout drones to the scene. Integrating with IoT sensors,</span><br/>
          <span style={{color: 'var(--text-primary)'}}>damage assessments are being mapped onto the Digital Twin model in real-time.</span>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Clock size={14} />
          {t('ete_recovery_time')}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', border: '1px solid var(--panel-border)', padding: '1rem', borderRadius: '4px' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ete} <span style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>{t('minutes')}</span></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('includes_compensation')}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {t('calculated_by_formula')}:<br/>
            ({t('base')} {baseClearance}m + {t('penalty')} {penalty}m)
          </div>
        </div>
      </div>
    </div>
  );
}
