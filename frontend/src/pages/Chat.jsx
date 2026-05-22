import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const QUICK_REPLIES = ['Feeling anxious', "Can't sleep", 'Feeling lonely', 'Stressed about studies', 'Had a good day'];

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Mira, your wellness companion. I'm here to listen without judgment — you can share anything with me. How are you feeling right now? 💚", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/chat/message', { message: msg, history });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }]);
      if (data.crisisDetected) setCrisisAlert(true);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of trouble connecting right now. If you need immediate help, please call iCall at 9152987821. 💚", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) => {
    const t = new Date(d);
    const h = t.getHours(), m = t.getMinutes();
    return `${h % 12 || 12}:${m < 10 ? '0' : ''}${m} ${h < 12 ? 'AM' : 'PM'}`;
  };

  return (
    <div className="chat-shell" style={{ height: 'calc(100dvh - 0px)' }}>
      <div className="chat-header">
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>M</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Mira — AI Companion</div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>Non-judgmental · Never gives medical advice</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--green)' }}>
          <div style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%' }} />
          Online
        </div>
      </div>

      {crisisAlert && (
        <div className="crisis-banner" style={{ margin: '12px 16px 0' }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div className="crisis-text">
            If you're in crisis, please call <strong>iCall: 9152987821</strong> or <strong>Vandrevala: 1860-2662-345</strong>
          </div>
          <button className="btn-crisis" onClick={() => navigate('/crisis')}>More help</button>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'assistant' ? 'ai' : 'user'}`}>
            <div className="msg-bubble">{m.content}</div>
            <div className="msg-time">{formatTime(m.timestamp)}</div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-bubble" style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite' }} />
              <span style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
              <span style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>

      <div className="quick-replies">
        {QUICK_REPLIES.map(r => (
          <button key={r} className="quick-chip" onClick={() => sendMessage(r)}>{r}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type how you feel..."
          disabled={loading}
        />
        <button className="send-btn" onClick={() => sendMessage()} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
