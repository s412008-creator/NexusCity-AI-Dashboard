import React from 'react';
import { Train, Bus, ParkingSquare } from 'lucide-react';

export default function TransitStatus() {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ padding: '1.25rem' }}>
        <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Train size={18} color="var(--accent-primary)" />
          公共運輸與基礎設施
        </h2>
      </div>
      
      <div className="panel-content" style={{ padding: '0 1.25rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* MRT Status */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#005599' }}></span>
              捷運板南線 (國父紀念館站)
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--warn-yellow)' }}>65% 擁擠</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '65%', background: 'var(--warn-yellow)', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* Bus Status */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bus size={14} color="var(--text-secondary)" />
              周邊公車調度站運能
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>充足</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '30%', background: '#10b981', borderRadius: '3px' }}></div>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', textAlign: 'right' }}>待命車輛: 12 輛</div>
        </div>

        {/* Parking Status */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ParkingSquare size={14} color="var(--text-secondary)" />
              松壽廣場地下停車場
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--alert-red)' }}>爆滿</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '95%', background: 'var(--alert-red)', borderRadius: '3px' }}></div>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', textAlign: 'right' }}>剩餘車位: 15 / 350</div>
        </div>

      </div>
    </div>
  );
}
