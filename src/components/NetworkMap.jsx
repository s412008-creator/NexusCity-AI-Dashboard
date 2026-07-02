import React, { useState } from 'react';
import roadNetworkData from '../data/road_network_geometry.json';
import { MapContainer, TileLayer, Polyline, Tooltip, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// 台北市信義區各主要路段的真實經緯度近似陣列 (Lat, Lng)
const ROAD_COORDINATES = {
  "RD_TPE_001": [[25.0415, 121.5435], [25.0413, 121.5513], [25.0410, 121.5645]], // 忠孝東路四段
  "RD_TPE_002": [[25.0440, 121.5562], [25.0410, 121.5560], [25.0375, 121.5558]], // 光復南路
  "RD_TPE_003": [[25.0425, 121.5646], [25.0385, 121.5645], [25.0335, 121.5642]], // 基隆路一段
  "RD_TPE_004": [[25.0445, 121.5438], [25.0445, 121.5515], [25.0443, 121.5560]], // 市民大道四段
  "RD_TPE_005": [[25.0375, 121.5430], [25.0375, 121.5558], [25.0373, 121.5615]], // 仁愛路四段
  "RD_TPE_006": [[25.0445, 121.5492], [25.0415, 121.5492], [25.0375, 121.5492]], // 敦化南路一段
  "RD_TPE_007": [[25.0392, 121.5645], [25.0390, 121.5680]], // 松高路
  "RD_TPE_008": [[25.0413, 121.5535], [25.0375, 121.5535]], // 延吉街
  "RD_TPE_009": [[25.0410, 121.5645], [25.0450, 121.5650]], // 基隆路地下道
  "RD_TPE_010": [[25.0373, 121.5615], [25.0350, 121.5615]], // 市府路
  "RD_TPE_011": [[25.0355, 121.5642], [25.0355, 121.5680]], // 松壽路
  "RD_TPE_012": [[25.0375, 121.5492], [25.0330, 121.5490]], // 敦化南路二段
  "RD_TPE_013": [[25.0330, 121.5642], [25.0330, 121.5680]], // 信義路五段
  "RD_TPE_014": [[25.0390, 121.5660], [25.0355, 121.5660], [25.0330, 121.5660]], // 松智路
  "RD_TPE_015": [[25.0445, 121.5438], [25.0415, 121.5435]]  // 復興南路一段
};

export default function NetworkMap({ systemStatus }) {
  const [hoveredRoad, setHoveredRoad] = useState(null);
  const isAlert = systemStatus.status === 'alert';
  const incidentRoad = systemStatus.incident?.affected_segment;
  // 直接接收 IncidentManager 傳來的字串陣列 (segment_id)
  const alternativeRoads = systemStatus.alternatives || [];

  // 地圖中心點 (大巨蛋周邊)
  const mapCenter = [25.0395, 121.5560];

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={15} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* 使用 CartoDB Dark Matter 深色極簡圖磚，融入戰情室黑灰風格 */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {roadNetworkData.map((road) => {
          const coords = ROAD_COORDINATES[road.segment_id];
          if (!coords) return null; // 若沒有給定經緯度則跳過

          let color = "#3b82f6"; // 預設企業藍
          let weight = 4;
          let dashArray = null;

          if (isAlert) {
            if (road.segment_id === incidentRoad) {
              color = "#ef4444"; // 事故點：紅色
              weight = 6;
            } else if (alternativeRoads.includes(road.segment_id)) {
              color = "#10b981"; // 替代道路：翡翠綠
              weight = 5;
            } else {
              color = "#334155"; // 其他道路：暗藍灰 (Slate 700)
              weight = 3;
            }
          }

          const isHovered = hoveredRoad === road.segment_id;
          
          return (
            <React.Fragment key={road.segment_id}>
              {/* 若為事故路段，添加底部的脈衝光環 (用半透明的粗線條模擬) */}
              {isAlert && road.segment_id === incidentRoad && (
                <Polyline 
                  positions={coords} 
                  pathOptions={{ color: '#ef4444', weight: 15, opacity: 0.2 }} 
                />
              )}
              
              <Polyline 
                positions={coords} 
                pathOptions={{ 
                  color: isHovered ? '#fff' : color, 
                  weight: isHovered ? weight + 3 : weight,
                  dashArray: dashArray,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
                eventHandlers={{
                  mouseover: () => setHoveredRoad(road.segment_id),
                  mouseout: () => setHoveredRoad(null),
                }}
              >
                {/* 套用自訂的毛玻璃 Glassmorphism Tooltip */}
                <Tooltip sticky className="glass-tooltip">
                  <div style={{ fontWeight: '600', marginBottom: '2px', color: 
                    (isAlert && road.segment_id === incidentRoad) ? '#ef4444' : 
                    (isAlert && alternativeRoads.includes(road.segment_id)) ? '#10b981' : '#fff'
                  }}>
                    {road.name}
                  </div>
                  <div>容量: {road.capacity_vph} 輛/小時</div>
                  {isAlert && road.segment_id === incidentRoad && (
                    <div style={{ color: '#fca5a5', fontSize: '11px', marginTop: '2px' }}>⚠️ 事故封閉中</div>
                  )}
                  {isAlert && alternativeRoads.includes(road.segment_id) && (
                    <div style={{ color: '#6ee7b7', fontSize: '11px', marginTop: '2px' }}>✅ 系統推薦替代路線</div>
                  )}
                </Tooltip>
              </Polyline>

              {/* 為了讓視覺上路口連線更好看，在端點加上小圓點 */}
              {isHovered && (
                <>
                  <CircleMarker center={coords[0]} radius={4} pathOptions={{ color: '#fff', fillOpacity: 1 }} />
                  <CircleMarker center={coords[coords.length-1]} radius={4} pathOptions={{ color: '#fff', fillOpacity: 1 }} />
                </>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div style={{ 
        position: 'absolute', bottom: 10, left: 10, zIndex: 1000, 
        fontSize: '0.75rem', display: 'flex', gap: '12px', 
        background: 'rgba(17, 17, 19, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '6px', 
        color: 'var(--text-secondary)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{ width: 12, height: 4, borderRadius: '2px', background: '#3b82f6'}}></div> 正常車流</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{ width: 12, height: 4, borderRadius: '2px', background: '#ef4444'}}></div> 事故封閉</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{ width: 12, height: 4, borderRadius: '2px', background: '#10b981'}}></div> 推薦替代路線</div>
      </div>
    </div>
  );
}
