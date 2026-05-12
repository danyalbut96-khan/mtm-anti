'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your AI Health Assistant. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // We mockup specific ID links for logic simulation
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            // Mock static ID for patient demonstration purposes
            patient_id: '00000000-0000-0000-0000-000000000000',
            doctor_id: '00000000-0000-0000-0000-000000000000', // Simulated static id fallback
            content: userMsg.text
        })
      });
      const data = await response.json();
      
      if (data.status === 'ai_responded') {
          setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.aiResponse }]);
      } else {
          // Fallback static if backend keys unconfigured
          setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Received. I have recorded your query for the doctor." }]);
      }
    } catch (error) {
       console.error("Backend link failing without env vars set, simulating locally.");
       setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: "I'm processing that. Please provide standard details..." }]);
    } finally {
       setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Mock Sidebar */}
      <div className="dash-sidebar" style={{ background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: '20px', fontWeight: 700, borderBottom: '1px solid #eee' }}>All Messages</div>
         <div style={{ padding: '15px', background: 'var(--bg-light)', cursor: 'pointer' }}>
             <div style={{ fontWeight: 600 }}>AI Assistant</div>
             <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Active Portal</div>
         </div>
      </div>

      {/* Active Chat View */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#f3f4f6', height: '100%' }}>
         {/* Header */}
         <div style={{ height: '60px', background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Intake Chat Window</h4>
         </div>

         {/* Messages Area */}
         <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {messages.map((m) => (
                 <div key={m.id} className={m.sender === 'bot' ? 'bubble bubble-bot' : 'bubble bubble-user'}>
                     {m.text}
                 </div>
             ))}
             {isTyping && <div className="bubble bubble-bot">AI is typing...</div>}
         </div>

         {/* Footer Input */}
         <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
             <input 
                type="text" 
                className="form-control" 
                placeholder="Describe symptoms or type messages here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
             />
             <button className="btn btn-primary" onClick={sendMessage}>Send</button>
         </div>
      </div>
    </div>
  );
}
