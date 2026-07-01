import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Key, Check } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sopText from '../data/emergency_traffic_sop.txt?raw';

export default function ChatAssistant() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [isKeySetup, setIsKeySetup] = useState(!!apiKey);
  const [messages, setMessages] = useState([
    { role: 'model', content: '您好，我是 CityAI 應變顧問 (Powered by Gemini 1.5 Flash)。我已載入大會交通應變 SOP，請問有什麼我可以幫忙分析的情境嗎？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // 自動置底
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsKeySetup(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `你是一位專業的「智慧城市交控中心 AI 應變顧問」。請嚴格根據以下的「交通應變標準程序 (SOP)」來回答指揮官的問題，不可自行虛構或給出違反 SOP 的處置建議。\n\nSOP 內容：\n${sopText}`
      });

      // 建立對話歷史 (轉換格式)
      const history = messages.slice(1).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMsg);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: `⚠️ API 呼叫失敗：${error.message}。請確認您的 API Key 是否有效。` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isKeySetup) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Key size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>啟用真實 AI (Gemini)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '80%' }}>
          為了在黑客松中展現真實的 LLM 推理能力且兼顧資安，請在此輸入您的 Gemini API Key。金鑰只會保存在您的瀏覽器 (localStorage) 中。
        </p>
        <input 
          type="password" 
          placeholder="輸入您的 Gemini API Key" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: '80%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'var(--bg-color)', color: 'white', marginBottom: '1rem' }}
        />
        <button 
          onClick={handleSaveKey}
          style={{ padding: '0.75rem 2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Check size={18} /> 儲存並啟用
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
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
              maxWidth: '85%',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--panel-border)' }}>
              <Bot size={14} />
            </div>
            <div style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              思考中... (Gemini Inference)
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="請輸入狀況，例如：大巨蛋散場遇到雨天..."
            style={{ 
              flex: 1, padding: '0.75rem', borderRadius: '4px', 
              border: '1px solid var(--panel-border)', background: 'var(--bg-color)', 
              color: 'var(--text-primary)', outline: 'none'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{ 
              padding: '0 1rem', background: isLoading ? 'var(--panel-border)' : 'var(--accent-primary)', 
              color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
