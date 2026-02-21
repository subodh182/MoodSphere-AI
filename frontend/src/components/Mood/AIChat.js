import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AIChat.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function AIChat({ mood, userName }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hey ${userName || 'Yaar'}! Main MoodBot hoon 🤖 Tere ${mood} mood ke baare mein baat karte hain? Kuch bhi pucho!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { from: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/ai/chat`, { message: userMsg, mood, userName });
      setMessages(m => [...m, { from: 'bot', text: res.data.reply, isAI: res.data.isAI }]);
    } catch {
      setMessages(m => [...m, { from: 'bot', text: 'Yaar, thodi connectivity issue hai! Baad mein try karo 😅' }]);
    }
    setLoading(false);
  };

  return (
    <div className="ai-chat glass-card">
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div>
          <div className="chat-title">MoodBot — AI Dost</div>
          <div className="chat-sub">Powered by Claude AI · Tere mood ke liye specially trained</div>
        </div>
        <div className="chat-status"><span className="online-dot" /> Online</div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.from === 'user' ? 'user-msg' : 'bot-msg'}`}>
            {msg.from === 'bot' && <span className="msg-avatar">🤖</span>}
            <div className="msg-bubble">
              {msg.text}
              {msg.isAI && <span className="ai-badge">✨ AI</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg bot-msg">
            <span className="msg-avatar">🤖</span>
            <div className="msg-bubble typing"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="input-field chat-input"
          placeholder="Kuch bhi pucho MoodBot se..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? '...' : '➤'}
        </button>
      </div>

      <div className="chat-suggestions">
        {['Kya karu abhi?', 'Motivate karo!', 'Ek tip do'].map(s => (
          <button key={s} className="suggestion-chip" onClick={() => { setInput(s); }}>{s}</button>
        ))}
      </div>
    </div>
  );
}
