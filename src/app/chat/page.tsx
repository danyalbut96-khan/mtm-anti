'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';
import Link from 'next/link';

function ChatInterface() {
  const searchParams = useSearchParams();
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [otherUserName, setOtherUserName] = useState('Connecting...');
  
  const targetPatient = searchParams.get('patientId');
  const targetDoctor = searchParams.get('doctorId');

  useEffect(() => {
      const supabase = createClientBrowser();

      const initializeChat = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          setSessionUser(session.user);

          // Resolve current state identities
          let pId = targetPatient || '';
          let dId = targetDoctor || '';

          // If only one target param was given, figure out the other based on current session role
          if (targetDoctor && !targetPatient) pId = session.user.id;
          if (targetPatient && !targetDoctor) dId = session.user.id;

          // Resolve display name for the 'other' entity
          if (targetDoctor) {
              const { data } = await supabase.from('doctors').select('name').eq('id', targetDoctor).single();
              if (data) setOtherUserName(data.name);
          } else if (targetPatient) {
              const { data } = await supabase.from('patients').select('name').eq('id', targetPatient).single();
              if (data) setOtherUserName(data.name);
          }

          // Initial fetch of dialogue history
          const { data: msgs } = await supabase
              .from('messages')
              .select('*')
              .eq('patient_id', pId)
              .eq('doctor_id', dId)
              .order('created_at', { ascending: true });
          
          setMessages(msgs || []);
          setLoading(false);

          // Real-time channel linkup
          const channel = supabase.channel(`chat_${pId}_${dId}`).on(
              'postgres_changes',
              { event: 'INSERT', schema: 'public', table: 'messages', filter: `patient_id=eq.${pId}` },
              (payload) => {
                  // Only append if it specifically correlates with this target doctor to avoid collisions
                  if (payload.new.doctor_id === dId) {
                     setMessages(prev => [...prev, payload.new]);
                  }
              }
          ).subscribe();

          return () => { supabase.removeChannel(channel); };
      };

      initializeChat();
  }, [targetDoctor, targetPatient]);

  useEffect(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
      if (!input.trim() || !sessionUser) return;
      const supabase = createClientBrowser();

      let pId = targetPatient || '';
      let dId = targetDoctor || '';
      if (targetDoctor && !targetPatient) pId = sessionUser.id;
      if (targetPatient && !targetDoctor) dId = sessionUser.id;

      // Determine if active user is doctor or patient based on query context
      const senderRole = targetDoctor ? 'patient' : 'doctor'; 

      const msgText = input.trim();
      setInput(''); // Immediate input wipe for instant responsive feel
      
      await supabase.from('messages').insert({
          patient_id: pId,
          doctor_id: dId,
          content: msgText,
          sender_type: senderRole
      });
  };

  if (loading) return <div style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-light)' }}>Initializing Encryption Gateway...</div>;

  return (
      <div style={{ height: 'calc(100vh - 70px)', background: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
          <header style={{ background: 'white', padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ width: '45px', height: '45px', background: '#F0FDFA', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <i className="fa-solid fa-user-circle"></i>
              </div>
              <div>
                  <div style={{ fontWeight: 800, fontSize: '16px' }}>{otherUserName}</div>
                  <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></span> Online System</div>
              </div>
              <Link href="/" style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>Exit Term</Link>
          </header>

          <main ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#9CA3AF', fontSize: '14px' }}>Secure peer-to-peer channel initiated. Begin transmission below.</div>
              )}
              {messages.map((m) => {
                  // Determine side based on user role matches
                  const isOwn = (targetDoctor && m.sender_type === 'patient') || (targetPatient && m.sender_type === 'doctor');
                  return (
                      <div key={m.id} style={{ 
                          alignSelf: isOwn ? 'flex-end' : 'flex-start',
                          background: isOwn ? 'var(--primary-color)' : 'white',
                          color: isOwn ? 'white' : 'var(--text-color)',
                          padding: '12px 18px',
                          borderRadius: '16px',
                          borderBottomRightRadius: isOwn ? 0 : '16px',
                          borderBottomLeftRadius: isOwn ? '16px' : 0,
                          maxWidth: '75%',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                          fontWeight: 500,
                          fontSize: '15px'
                      }}>
                          {m.content}
                      </div>
                  );
              })}
          </main>

          <footer style={{ background: 'white', padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="form-control" 
                style={{ flex: 1, borderRadius: '12px', background: '#F9FAFB' }}
                placeholder="Encode communication packet..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '0 25px', fontWeight: 700 }} onClick={sendMessage}>Transmit</button>
          </footer>
      </div>
  );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading Environment...</div>}>
            <ChatInterface />
        </Suspense>
    );
}
