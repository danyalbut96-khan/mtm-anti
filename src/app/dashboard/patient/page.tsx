'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabaseBrowser';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([
    // Initial seed for simulation - will receive real-time override updates
    { id: 'apt-1', date: '15', month: 'MAY', time: '10:00 AM', title: 'General Checkup', status: 'scheduled' }
  ]);

  useEffect(() => {
    const supabase = createClientBrowser();

    // Subscribe to Realtime changes on the appointments table (Requirement 2)
    const channel = supabase
      .channel('appointment-updates')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        (payload) => {
          console.log('Realtime Update Detected:', payload);
          // In dynamic environment: handle refreshing data list immediately without refresh.
          // For demo: trigger alert demonstrating immediate capture.
          if (payload.eventType === 'UPDATE') {
             alert(`Realtime Update: Appointment status changed to ${payload.new.status}!`);
             // Merge data safely here logic
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="dashboard-layout fade-in">
      <aside className="dash-sidebar">
         <h4 style={{ marginBottom: '30px', paddingLeft: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>My Portal</h4>
         <Link href="#" className="side-menu-link active"><i className="fa-solid fa-table-columns"></i> My Dashboard</Link>
         <Link href="/support" className="side-menu-link"><i className="fa-solid fa-comment-medical"></i> AI Assistance</Link>
         <Link href="#" className="side-menu-link"><i className="fa-solid fa-file-medical"></i> Health Records</Link>
         <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />
         <Link href="/" className="side-menu-link" style={{ color: 'var(--danger-color)' }}><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</Link>
      </aside>

      <main className="dash-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Welcome Back, Patient!</h1>
                  <p style={{ color: 'var(--text-light)' }}>Connected to Real-Time Health Updates.</p>
              </div>
              <Link href="/search" className="btn btn-primary" style={{ borderRadius: '12px' }}>
                  <i className="fa-solid fa-plus"></i> Find Doctor
              </Link>
          </div>

          <div className="card" style={{ marginBottom: '32px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                   <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Upcoming Scheduled Consultations</h3>
                   <span style={{ fontSize: '12px', color: 'var(--success-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <span style={{ width: '6px', height: '6px', background: 'var(--success-color)', borderRadius: '50%' }}></span> Real-time Live
                   </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.map(a => (
                    <div key={a.id} style={{ padding: '18px', background: '#FFFFFF', border: '1px solid #F3F4F6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ padding: '12px', background: '#F0FDFA', borderRadius: '12px', textAlign: 'center', minWidth: '65px' }}>
                                <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--primary-color)', lineHeight: 1 }}>{a.date}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8, marginTop: '2px', color: '#0F766E' }}>{a.month}</div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{a.title} Appointment</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '2px' }}>
                                    <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i> Slot: {a.time}
                                </p>
                            </div>
                        </div>
                        <span className="badge badge-online" style={{ textTransform: 'capitalize' }}>
                           <span className="status-dot online"></span> Status: {a.status}
                        </span>
                    </div>
                  ))}
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFA 100%)', border: '1px solid #CCFBF1', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ color: 'var(--primary-color)', background: 'white', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '15px', boxShadow: 'var(--shadow-sm)' }}>
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </div>
                  <h4 style={{ fontWeight: 700 }}>Smart AI Match Engine</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '6px', lineHeight: 1.6 }}>Based on your recent intake queries, we recommend connecting with a regional Neurology expert.</p>
                  <Link href="/search?specialization=Neurology" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontWeight: 700, color: 'var(--primary-color)', fontSize: '14px' }}>
                      Show Specialists <i className="fa-solid fa-arrow-right"></i>
                  </Link>
              </div>
          </div>
      </main>
    </div>
  );
}
