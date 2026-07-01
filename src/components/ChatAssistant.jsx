import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '您好，我是 CityAI 應變顧問。請問有什麼需要協助的假設性問題 (What-if) 嗎？' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Mock bot response based on keywords
    setTimeout(() => {
      let reply = `根據分析，對於「${input}」的情境，建議啟動標準巡檢程序，確保周邊交通順暢。`;
      
      if (input.includes('塌陷') || input.includes('車禍') || input.includes('事故')) {
        reply = '依據【SOP 第 2 條：車禍與路障應變】：若發生嚴重路段阻斷，應立即篩選主疏散替代道路，引導車流，並更新 CMS 告示「前方事故封閉，請改道，預計延誤 X 分鐘」。';
      } else if (input.includes('大巨蛋') || input.includes('人潮') || input.includes('散場') || input.includes('BL17')) {
        reply = '依據【SOP 第 4 條與第 3 條】：偵測到大巨蛋人潮峰值異常，系統將自動啟動散場模式。建議北捷「過站不停」、通知公車處調度接駁專車、並引導群眾步行至市政府站。';
      } else if (input.includes('號誌') || input.includes('故障') || input.includes('停電')) {
        reply = '依據【SOP 第 5 條：號誌故障應變】：請立即產出人工指揮派遣建議，每個受影響路口配置 2 名警力，並於 CMS 顯示「號誌故障，請依現場指揮通行」。';
      } else if (input.includes('多國') || input.includes('語言') || input.includes('外籍')) {
        reply = '依據【SOP 第 6 條：數位通報與多語化】：當該區域漫遊用戶 (Roaming_User_Pct) >= 30% 時，推播之簡訊與看板訊息將自動產出多國語言版本。';
      }

      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
    }, 1000);
  };

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
      {/* Messages */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ 
              width: 24, height: 24, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: msg.role === 'user' ? 'transparent' : 'var(--panel-border)',
              border: msg.role === 'user' ? '1px solid var(--text-secondary)' : 'none',
              color: msg.role === 'user' ? 'var(--text-secondary)' : 'var(--text-primary)'
            }}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div style={{ 
              background: msg.role === 'user' ? 'transparent' : 'var(--panel-border)',
              border: msg.role === 'user' ? '1px solid var(--panel-border)' : '1px solid transparent',
              color: 'var(--text-primary)',
              padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', lineHeight: 1.5,
              maxWidth: '85%'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-color)', border: '1px solid var(--panel-border)', padding: '0.25rem', borderRadius: '4px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="請輸入欲查詢之應變情境..." 
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem', outline: 'none', fontSize: '0.875rem' }}
          />
          <button 
            onClick={handleSend}
            style={{ 
              background: 'var(--text-primary)', border: 'none', color: 'var(--bg-color)', 
              width: 36, height: 36, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
