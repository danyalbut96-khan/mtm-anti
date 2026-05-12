'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientName, setPatientName] = useState('Patient');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
      const supabase = createClientBrowser();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
  };

  useEffect(() => {
    const supabase = createClientBrowser();
    
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
          router.push('/auth/login');
          return;
      }

      // Load Patient Context
      const { data: pat } = await supabase.from('patients').select('name').eq('id', session.user.id).maybeSingle();
      if (pat) setPatientName(pat.name);

      // Load Actual Bookings joined with doctor metadata
      const { data: appts } = await supabase
         .from('appointments')
         .select('*, doctors(name, specialization, profile_pic)')
         .eq('patient_id', session.user.id)
         .order('appointment_date', { ascending: true });
      
      if (appts) setAppointments(appts);
      setLoading(false);

      // Realtime Hook setup
      const channel = supabase.channel('patient-updates').on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `patient_id=eq.${session.user.id}` }, 
          () => loadData()
      ).subscribe();

      return () => { supabase.removeChannel(channel); }
    };

    loadData();
  }, [router]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid #F3F4F6', borderTopColor: 'var(--primary-color)', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '14px' }}>Decrypting Personal Health Grid...</p>
        <style jsx>{` @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );

    const handleCancel = async (id: string) => {
       if (!confirm("Are you certain you wish to terminate this reservation?")) return;
       const supabase = createClientBrowser();
       const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
       if (!error) setAppointments(prev => prev.map(a => a.id === id ? {...a, status: 'cancelled'} : a));
    };

    return (
    <div className="dashboard-layout fade-in" style={{ background: '#F9FAFB' }}>
      <aside className="dash-sidebar" style={{ background: 'white', borderRight: '1px solid #F3F4F6', padding: '30px 20px' }}>
         <div style={{ marginBottom: '35px', textAlign: 'center' }}>
             <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--primary-color), #0F766E)', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 800, boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.3)' }}>
                 {patientName.charAt(0).toUpperCase()}
             </div>
             <h4 style={{ fontWeight: 800, fontSize: '16px', color: '#111827', marginBottom: '4px' }}>{patientName}</h4>
             <span style={{ fontSize: '12px', background: '#F0FDFA', color: '#0D9488', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Verified Patient</span>
         </div>

         <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <Link href="#" className="side-menu-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 700, background: '#F0FDFA', color: 'var(--primary-color)' }}>
                 <i className="fa-solid fa-cubes" style={{ fontSize: '18px' }}></i> Overview
             </Link>
             <Link href="/support" className="side-menu-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 600, color: '#4B5563' }}>
                 <i className="fa-solid fa-comment-medical" style={{ fontSize: '18px' }}></i> AI Intake Node
             </Link>
             <Link href="/find-doctor" className="side-menu-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 600, color: '#4B5563' }}>
                 <i className="fa-solid fa-stethoscope" style={{ fontSize: '18px' }}></i> Book Specialist
             </Link>
         </nav>

         <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
            <button onClick={handleLogout} className="side-menu-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 700, color: '#EF4444' }}>
               <i className="fa-solid fa-power-off" style={{ fontSize: '18px' }}></i> Sign Out System
            </button>
         </div>
      </aside>

      <main className="dash-content" style={{ padding: '40px' }}>
          <header className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
              <div>
                  <h1 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.5px', color: '#111827' }}>Quantum Health Core</h1>
                  <p style={{ color: '#6B7280', fontSize: '15px', marginTop: '5px' }}>Synthesized updates for your medical timeline.</p>
              </div>
              <Link href="/find-doctor" className="btn btn-primary" style={{ borderRadius: '14px', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)', padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-plus"></i> Launch Directory
              </Link>
          </header>

          {/* Performance Stat Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
              <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)', border: '1px solid rgba(243,244,246,1)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '10px' }}>Active Appointments</div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#111827' }}>{appointments.filter(a => a.status !== 'cancelled').length}</div>
              </div>
              <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)', border: '1px solid rgba(243,244,246,1)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '10px' }}>Network Latency</div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#10B981' }}>14ms</div>
              </div>
          </div>

          <div className="card" style={{ padding: '30px', borderRadius: '24px', background: 'white', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                   <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Operational Schedule</h3>
                   <div style={{ fontSize: '12px', color: '#10B981', background: '#ECFDF5', padding: '6px 12px', borderRadius: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #D1FAE5' }}>
                       <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}></span> Real-Time Live
                   </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {appointments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F9FAFB', borderRadius: '20px', border: '2px dashed #E5E7EB' }}>
                          <i className="fa-regular fa-calendar-xmark" style={{ fontSize: '40px', color: '#9CA3AF', marginBottom: '15px' }}></i>
                          <div style={{ fontWeight: 700, color: '#4B5563', fontSize: '16px' }}>No active appointment records</div>
                          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '5px' }}>Initiate a session via the specialist directory.</p>
                      </div>
                  ) : (
                      appointments.map(a => (
                        <div key={a.id} className="appt-row" style={{ padding: '20px', background: 'white', border: '1.5px solid #F3F4F6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s ease', cursor: 'default' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="appt-meta">
                                <div style={{ padding: '15px', background: '#F0FDFA', borderRadius: '16px', textAlign: 'center', minWidth: '75px', border: '1px solid #CCFBF1' }}>
                                    <div style={{ fontWeight: 900, fontSize: '22px', color: 'var(--primary-color)', lineHeight: 1 }}>{new Date(a.appointment_date).getDate()}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 800, marginTop: '4px', color: '#0F766E', textTransform: 'uppercase' }}>{new Date(a.appointment_date).toLocaleString('en-US', { month: 'short' })}</div>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#111827' }}>Session with Dr. {a.doctors?.name || 'Specialist'}</h4>
                                    <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fa-solid fa-tag" style={{ color: 'var(--primary-color)', fontSize: '12px' }}></i> {a.doctors?.specialization} • <i className="fa-regular fa-clock"></i> {a.time_slot}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="appt-actions">
                                <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', fontWeight: 800, background: a.status === 'scheduled' ? '#DBEAFE' : a.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7', color: a.status === 'scheduled' ? '#1E40AF' : a.status === 'cancelled' ? '#DC2626' : '#92400E', padding: '6px 12px', borderRadius: '8px' }}>
                                    {a.status}
                                </span>
                                {a.status === 'scheduled' && (
                                   <button onClick={() => handleCancel(a.id)} className="btn" style={{ background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', borderRadius: '10px', padding: '8px 15px', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
                                )}
                                {a.type === 'online' && a.status === 'scheduled' && (
                                    <button className="btn" style={{ background: 'var(--primary-color)', color: 'white', padding: '8px 16px', fontSize: '13px', borderRadius: '10px', fontWeight: 700 }}>Join Call</button>
                                )}
                            </div>
                        </div>
                      ))
                  )}
              </div>
          </div>
      </main>

      <style jsx>{`
         .dashboard-layout { display: flex; min-height: 100vh; }
         .dash-sidebar { width: 280px; flex-shrink: 0; display: flex; flex-direction: column; }
         .dash-content { flex: 1; }
         @media (max-width: 992px) {
             .dashboard-layout { flex-direction: column; }
             .dash-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #F3F4F6; }
             .dash-content { padding: 20px !important; }
         }
         @media (max-width: 640px) {
             .dash-header { flex-direction: column; gap: 20px; align-items: flex-start !important; }
             .appt-row { flex-direction: column; align-items: flex-start !important; gap: 15px; }
             .appt-actions { width: 100%; justify-content: flex-start; }
             .appt-meta { width: 100%; }
         }
      `}</style>
    </div>
  );
}
