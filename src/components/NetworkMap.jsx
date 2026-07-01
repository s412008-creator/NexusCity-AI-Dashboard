import React, { useState } from 'react';
import roadData from '../data/road_network_geometry.json';

// 給定每條路的假想座標 (x, y) 範圍 0~100
const layoutCoordinates = {
  "RD_TPE_015": { x: 10, y: 30 }, // 復興南路一段
  "RD_TPE_004": { x: 50, y: 15 }, // 市民大道四段
  "RD_TPE_001": { x: 50, y: 40 }, // 忠孝東路四段
  "RD_TPE_005": { x: 50, y: 65 }, // 仁愛路四段
  "RD_TPE_013": { x: 50, y: 90 }, // 信義路五段
  
  "RD_TPE_006": { x: 30, y: 40 }, // 敦化南路一段
  "RD_TPE_012": { x: 30, y: 75 }, // 敦化南路二段
  "RD_TPE_008": { x: 45, y: 52 }, // 延吉街
  "RD_TPE_002": { x: 60, y: 40 }, // 光復南路
  "RD_TPE_003": { x: 75, y: 55 }, // 基隆路一段
  "RD_TPE_009": { x: 75, y: 25 }, // 基隆路地下道
  
  "RD_TPE_010": { x: 85, y: 55 }, // 市府路
  "RD_TPE_014": { x: 95, y: 55 }, // 松智路
  "RD_TPE_007": { x: 90, y: 40 }, // 松高路
  "RD_TPE_011": { x: 90, y: 70 }, // 松壽路
};

export default function NetworkMap({ systemStatus }) {
  const [hoveredRoad, setHoveredRoad] = useState(null);
  const isAlert = systemStatus.status === 'alert';
  
  // 動態取得事件影響路段與替代道路
  const incidentRoad = systemStatus.incident ? systemStatus.incident.affected_segment : null;
  const alternativeRoads = systemStatus.alternatives || [];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '4px' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        
        {/* Draw background grid */}
        <g stroke="rgba(255,255,255,0.02)" strokeWidth="0.5">
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
          <line x1="20" y1="0" x2="20" y2="100" />
          <line x1="40" y1="0" x2="40" y2="100" />
          <line x1="60" y1="0" x2="60" y2="100" />
          <line x1="80" y1="0" x2="80" y2="100" />
        </g>

        {/* Draw nodes */}
        {roadData.map(road => {
          const coord = layoutCoordinates[road.segment_id];
          if (!coord) return null;

          let color = "#334155"; // 深藍灰 Slate 700 替代原本的灰色
          let r = 2;
          
          if (isAlert) {
            if (road.segment_id === incidentRoad) {
              color = "#dc2626"; // dark red for incident
              r = 4;
            } else if (alternativeRoads.includes(road.segment_id)) {
              color = "#059669"; // 深翡翠綠 Emerald 600
              r = 3;
            } else {
              color = "#1e293b"; // dim others (Slate 800)
            }
          }
          
          const isHovered = hoveredRoad === road.segment_id;

          return (
            <g 
              key={road.segment_id} 
              onMouseEnter={() => setHoveredRoad(road.segment_id)}
              onMouseLeave={() => setHoveredRoad(null)}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              {/* If it's an incident, draw a pulsing circle */}
              {isAlert && road.segment_id === incidentRoad && (
                <circle cx={coord.x} cy={coord.y} r={isHovered ? 10 : 8} fill="rgba(220, 38, 38, 0.2)">
                  <animate attributeName="r" values={isHovered ? "6;14;6" : "4;12;4"} dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              
              <circle cx={coord.x} cy={coord.y} r={isHovered ? r + 1.5 : r} fill={isHovered ? '#fff' : color} />
              
              {/* Background rect for hover tooltip to improve readability */}
              {isHovered && (
                <rect 
                  x={coord.x - 15} 
                  y={coord.y - 12} 
                  width={30} 
                  height={7} 
                  fill="var(--bg-color)" 
                  stroke="var(--panel-border)"
                  strokeWidth="0.5"
                  rx="1"
                />
              )}
              
              <text 
                x={coord.x} 
                y={coord.y - 4} 
                fontSize={isHovered ? "4" : "3.5"} 
                fontWeight={isHovered ? "bold" : "normal"}
                fill={
                  isAlert && road.segment_id === incidentRoad 
                    ? "#ef4444" 
                    : (isAlert && alternativeRoads.includes(road.segment_id) ? "#10b981" : "#94a3b8")
                } 
                textAnchor="middle"
              >
                {road.name}
              </text>
              
              {/* Extra tooltip text on hover */}
              {isHovered && (
                <text x={coord.x} y={coord.y - 7} fontSize="2.5" fill="var(--text-secondary)" textAnchor="middle">
                  {isAlert && road.segment_id === incidentRoad ? '事故封閉中' : 
                   isAlert && alternativeRoads.includes(road.segment_id) ? '系統推薦路線' : 
                   `容量: ${road.capacity} 輛`}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Map Legend */}
      <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '0.7rem', display: 'flex', gap: '10px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', padding: '5px 10px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px'}}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#334155'}}></div> 正常路段</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px'}}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626'}}></div> 事故塌陷</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px'}}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669'}}></div> 系統推薦替代路段</div>
      </div>
    </div>
  );
}
