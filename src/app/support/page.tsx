'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  role: 'ai' | 'user';
  content: string;
  doctors?: any[]; // Injected data container
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Greetings! I am the SmartDoctor Assistant Node. Describe any symptoms, or let me know your region to directly synthesize practitioner availability data.' }
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
    const updatedMsgs: Message[] = [...messages, { role: 'user', content: currentMsg }];
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
      
      // Requirement fulfillment: Capturing injected rich visual streams
      setMessages(prev => [...prev, { 
          role: 'ai', 
          content: data.response || "Connecting to centralized engine...", 
          doctors: data.injectedDoctors || null 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Constraint breach: Backend logic gateway error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', padding: '30px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', height: '82vh', padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-xl)' }}>
        
        <div style={{ background: 'var(--primary-color)', color: 'white', padding: '20px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.2px' }}>Global Ecosystem AI</h2>
                <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></span> Distributed Query Pipeline Active
                </div>
              </div>
           </div>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '30px', background: '#F3F4F6', display: 'flex', flexDirection: 'column', gap: '25px' }}>
           {messages.map((m, idx) => (
             <div key={idx} style={{
               alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
               maxWidth: '85%',
               display: 'flex',
               flexDirection: 'column',
               gap: '12px'
             }}>
                 {/* Main Message Body */}
                 <div style={{
                   padding: '16px 20px',
                   borderRadius: '18px',
                   fontSize: '15px',
                   lineHeight: '1.6',
                   boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.03)' : '0 4px 12px rgba(13, 148, 136, 0.2)',
                   background: m.role === 'ai' ? 'white' : 'var(--primary-color)',
                   color: m.role === 'ai' ? 'var(--text-color)' : 'white',
                   borderBottomLeftRadius: m.role === 'ai' ? 0 : '18px',
                   borderBottomRightRadius: m.role === 'user' ? 0 : '18px',
                   border: m.role === 'ai' ? '1px solid #E5E7EB' : 'none',
                   whiteSpace: 'pre-wrap'
                 }}>
                   {m.content}
                 </div>

                 {/* REQUIREMENT: Dynamic Doctor Injected Stream Layout */}
                 {m.doctors && m.doctors.length > 0 && (
                    <div className="fade-in" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '5px' }}>
                        {m.doctors.map((doc: any) => (
                            <div key={doc.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '15px', width: '220px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
                                        <Image src={doc.profile_pic || "/assets/doctor-male.png"} alt="doc" fill style={{ borderRadius: '8px', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontWeight: 800, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                                        <div style={{ fontSize: '11px', color: '#0D9488', fontWeight: 600 }}>{doc.specialization}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="fa-solid fa-location-dot"></i> {doc.city}
                                </div>
                                <Link href={`/doctor/${doc.id}`} className="btn btn-primary" style={{ width: '100%', padding: '8px 0', fontSize: '12px', textAlign: 'center', display: 'block', borderRadius: '8px', fontWeight: 700 }}>
                                    Open Profile
                                </Link>
                            </div>
                        ))}
                    </div>
                 )}
             </div>
           ))}
           
           {isTyping && (
             <div style={{ alignSelf: 'flex-start', padding: '15px 20px', background: 'white', borderRadius: '18px', borderBottomLeftRadius: 0, fontSize: '14px', color: 'var(--text-light)', border: '1px solid #E5E7EB', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
               <i className="fa-solid fa-wave-square fa-beat-fade" style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i> Synthesizing real-time medical graph data...
             </div>
           )}
        </div>

        <div style={{ padding: '25px 30px', background: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                style={{ paddingRight: '50px', height: '52px', borderRadius: '14px', background: '#F9FAFB', border: '1.5px solid #F3F4F6', fontSize: '15px' }}
                placeholder="Detail physical triggers or specify target jurisdiction..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', opacity: 0.5 }}></i>
          </div>
          <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()} style={{ height: '52px', borderRadius: '14px', padding: '0 25px', fontWeight: 700, boxShadow: 'var(--shadow-md)', opacity: !input.trim() ? 0.6 : 1 }}>
            Push Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
