import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import trafficCsv from '../data/city_traffic_flow.csv?raw';
import crowdCsv from '../data/signaling_crowd_density.csv?raw';

export function useCityData() {
  const [data, setData] = useState({
    totalTraffic: 0,
    domeCrowd: 0,
    roamingPct: '0%',
    isLoading: true
  });

  useEffect(() => {
    // 為了展示效能，只在初次載入解析 CSV
    const trafficParsed = Papa.parse(trafficCsv, { header: true, skipEmptyLines: true }).data;
    const crowdParsed = Papa.parse(crowdCsv, { header: true, skipEmptyLines: true }).data;

    // 鎖定展示時間：當晚 20:00 (大巨蛋散場高峰前夕)
    const targetTime = "2026-05-20 20:00";
    
    // 計算該時間點的所有路段總車流
    let totalTraffic = 0;
    trafficParsed.forEach(row => {
      if (row.Timestamp === targetTime) {
        totalTraffic += parseInt(row.Vehicle_Count || 0, 10);
      }
    });

    // 找出大巨蛋該時間點的人潮與漫遊用戶比率
    let domeCrowd = 0;
    let roamingPct = '0%';
    crowdParsed.forEach(row => {
      if (row.Timestamp === targetTime && row.BS_ID === 'BS_TPE_DOME') {
        domeCrowd = parseInt(row.User_Count || 0, 10);
        roamingPct = row.Roaming_User_Pct || '0%';
      }
    });

    setData({
      totalTraffic,
      domeCrowd,
      roamingPct,
      isLoading: false
    });
  }, []);

  return data;
}
