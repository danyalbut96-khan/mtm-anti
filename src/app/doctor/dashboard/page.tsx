'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

export default function DoctorDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('Practitioner');
  const [loadingState, setLoadingState] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);

  const router = useRouter();

  const handleLogout = async () => {
      const supabase = createClientBrowser();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
  };

  const fetchData = async () => {
    const supabase = createClientBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
       router.push('/auth/login');
       return;
    }

    setDoctorId(session.user.id);

    // Load Context
    const { data: doc } = await supabase.from('doctors').select('is_available, name').eq('id', session.user.id).maybeSingle();
    if (doc) {
        setIsOnline(doc.is_available);
        setDoctorName(doc.name);
    }

    // Load Real Queued Consultations joined with patient details
    const { data: appts } = await supabase
        .from('appointments')
        .select('*, patients(name)')
        .eq('doctor_id', session.user.id)
        .order('appointment_date', { ascending: true });
    
    if (appts) setAppointments(appts);
    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
    
    // Dynamic Realtime Listening for Doctor
    const supabase = createClientBrowser();
    const channel = supabase.channel('doctor-hub').on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => fetchData()
    ).subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  const handleToggle = async () => {
     if (!doctorId) return;
     const supabase = createClientBrowser();
     const nextState = !isOnline;
     setLoadingState(true);
     setIsOnline(nextState);

     try {
        await supabase.from('doctors').update({ is_available: nextState }).eq('id', doctorId);
     } catch(e) {
        setIsOnline(!nextState);
     } finally {
        setLoadingState(false);
     }
  };

  if (pageLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid #F3F4F6', borderTopColor: 'var(--primary-color)', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '14px' }}>Initializing Physician Hub Matrices...</p>
        <style jsx>{` @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );

  return (
    <div className="dashboard-layout fade-in" style={{ background: '#F8FAFC' }}>
      <aside className="dash-sidebar" style={{ background: '#0F172A', color: '#94A3B8', padding: '30px 20px', border: 'none' }}>
         <div style={{ marginBottom: '35px', textAlign: 'center' }}>
             <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                 <i className="fa-solid fa-user-md"></i>
             </div>
             <h4 style={{ fontWeight: 800, fontSize: '16px', color: 'white', marginBottom: '4px' }}>Dr. {doctorName.split(' ').pop()}</h4>
             <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#CBD5E1', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Provider Command</span>
         </div>
         
         <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
             <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.08)', color: 'white' }}>
                <i className="fa-solid fa-chart-pie" style={{ fontSize: '18px', color: 'var(--primary-color)' }}></i> Analytics Matrix
             </Link>
             <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 600, color: '#94A3B8' }}>
                <i className="fa-solid fa-calendar-check" style={{ fontSize: '18px' }}></i> Master Roster
             </Link>
             <Link href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 600, color: '#94A3B8' }}>
                <i className="fa-solid fa-message" style={{ fontSize: '18px' }}></i> Comm Hub
             </Link>
         </nav>

         <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
            <button onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontWeight: 700, color: '#F87171' }}>
               <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '18px' }}></i> Sever Session
            </button>
         </div>
      </aside>

      <main className="dash-content" style={{ padding: '40px' }}>
          <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                  <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px', color: '#0F172A' }}>Operation Command</h1>
                  <p style={{ color: '#64748B', fontSize: '15px', marginTop: '5px' }}>Review and control real-time practitioner streams.</p>
              </div>
              
              {/* HIGH FIDELITY SWITCHER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '14px 22px', borderRadius: '20px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9', opacity: loadingState ? 0.6 : 1 }}>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isOnline ? '#059669' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {isOnline ? '🟢 BROADCASTING' : '🔴 STEALTH MODE'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px', fontWeight: 600 }}>Visibility Sequence</div>
                 </div>
                 <div 
                    onClick={handleToggle} 
                    style={{ width: '50px', height: '26px', background: isOnline ? 'var(--primary-color)' : '#E2E8F0', borderRadius: '20px', padding: '4px', cursor: loadingState ? 'wait' : 'pointer', transition: 'all 0.3s ease', position: 'relative' }}
                 >
                    <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', left: '4px', transform: isOnline ? 'translateX(24px)' : 'translateX(0)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}></div>
                 </div>
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px', marginBottom: '40px' }}>
             <div style={{ padding: '30px', borderRadius: '24px', background: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                     <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Volume</span>
                     <div style={{ width: '40px', height: '40px', background: '#F0FDF4', color: '#16A34A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}><i className="fa-solid fa-hand-holding-dollar"></i></div>
                 </div>
                 <div style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A' }}>PKR 45K</div>
                 <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 700, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}><i className="fa-solid fa-arrow-trend-up"></i> +8.4% Velocity</div>
             </div>

             <div style={{ padding: '30px', borderRadius: '24px', background: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                     <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Quota</span>
                     <div style={{ width: '40px', height: '40px', background: '#EFF6FF', color: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}><i className="fa-solid fa-users-rectangle"></i></div>
                 </div>
                 <div style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A' }}>{appointments.length}</div>
                 <div style={{ fontSize: '13px', color: '#64748B', marginTop: '5px', fontWeight: 600 }}>Current Cycle Cumulative</div>
             </div>
          </div>

          <div style={{ padding: '35px', borderRadius: '28px', background: 'white', border: '1px solid #F1F5F9', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.02)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>Assigned Grid Load</h3>
                <button onClick={fetchData} className="btn" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 16px', fontSize: '13px', color: '#475569', fontWeight: 700, borderRadius: '10px' }}>Force Refresh</button>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', background: '#F8FAFC', borderRadius: '20px', border: '2px dashed #CBD5E1' }}>
                        <div style={{ fontWeight: 700, color: '#64748B' }}>Queue is currently depleted.</div>
                    </div>
                ) : (
                    appointments.map((apt) => (
                        <div key={apt.id} className="appt-row" style={{ border: '1px solid #F1F5F9', background: '#FFFFFF', padding: '22px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }} className="appt-meta">
                                <div style={{ width: '50px', height: '50px', background: '#F1F5F9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '20px' }}>
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '17px', color: '#0F172A' }}>{apt.patients?.name || 'Remote Client'}</div>
                                    <div style={{ fontSize: '14px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-regular fa-calendar"></i> {new Date(apt.appointment_date).toLocaleDateString()} • <i className="fa-regular fa-clock"></i> {apt.time_slot}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }} className="appt-actions">
                                <span style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 800, borderRadius: '8px', background: apt.type === 'online' ? '#F0FDFA' : '#FFF7ED', color: apt.type === 'online' ? '#0D9488' : '#EA580C', textTransform: 'uppercase' }}>{apt.type}</span>
                                <Link href={`/chat?patientId=${apt.patient_id}`} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 10px rgba(13, 148, 136, 0.2)' }}>Message</Link>
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
             .dash-sidebar { width: 100%; border-right: none; padding: 20px !important; }
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
