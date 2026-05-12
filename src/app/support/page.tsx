'use client';

import { useState, useRef, useEffect } from 'react';

export default function SupportPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I\'m your Smart Doctor Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentMsg = input.trim();
    setInput('');
    const updatedMsgs = [...messages, { role: 'user', content: currentMsg }];
    setMessages(updatedMsgs);
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMsg,
          history: updatedMsgs.slice(-6).map(m => `${m.role}: ${m.content}`)
        })
      });
      
      const data = await res.json();
      const reply = data.response || "We encountered a temporary loading error. Please try again later.";
      
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Technical difficulty communicating with engine." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', padding: '30px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', height: '80vh', padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ background: 'var(--primary-color)', color: 'white', padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
           <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
             <i className="fa-solid fa-robot"></i>
           </div>
           <div>
             <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>SmartDoc AI Assistant</h2>
             <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>24/7 Triage & Scheduling Support</p>
           </div>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '30px', background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {messages.map((m, idx) => (
             <div key={idx} style={{
               maxWidth: '80%',
               padding: '14px 18px',
               borderRadius: '14px',
               fontSize: '15px',
               lineHeight: '1.6',
               boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
               alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
               background: m.role === 'ai' ? 'white' : 'var(--primary-color)',
               color: m.role === 'ai' ? 'var(--text-color)' : 'white',
               borderBottomLeftRadius: m.role === 'ai' ? 0 : '14px',
               borderBottomRightRadius: m.role === 'user' ? 0 : '14px',
               border: m.role === 'ai' ? '1px solid #E5E7EB' : 'none'
             }}>
               {m.content}
             </div>
           ))}
           {isTyping && (
             <div style={{ alignSelf: 'flex-start', padding: '12px 18px', background: 'white', borderRadius: '14px', borderBottomLeftRadius: 0, fontSize: '14px', color: 'var(--text-light)', border: '1px solid #E5E7EB' }}>
               <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> AI is processing your query...
             </div>
           )}
        </div>

        <div style={{ padding: '20px 30px', background: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            className="form-control" 
            style={{ flex: 1, borderRadius: '12px' }}
            placeholder="Describe your symptoms or ask about how to book..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="btn btn-primary" onClick={handleSend} style={{ borderRadius: '12px', padding: '0 25px' }}>
            Send Query
          </button>
        </div>
      </div>
    </div>
  );
}
