'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="dashboard-layout">
      <aside className="dash-sidebar" style={{ background: '#1a202c', color: 'white' }}>
         <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
            <h4 style={{ color: 'white' }}>Dr. Clinician View</h4>
         </div>
         <a href="#" className="side-menu-link" style={{ color: 'white', background: 'var(--primary-color)' }}>Dashboard</a>
         <Link href="/chat" className="side-menu-link" style={{ color: '#cbd5e0' }}>Consults Inbox</Link>
         <Link href="/" className="side-menu-link" style={{ color: '#ea4335', marginTop: '40px' }}>Log Out</Link>
      </aside>

      <main className="dash-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1>Practice Overview</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <span style={{ fontSize: '14px', fontWeight: 600, color: isOnline ? 'var(--success-color)' : 'var(--text-light)' }}>
                    {isOnline ? 'Receiving Patients' : 'Offline'}
                 </span>
                 <div 
                    onClick={() => setIsOnline(!isOnline)} 
                    style={{ width: '50px', height: '26px', background: isOnline ? 'var(--success-color)' : '#ccc', borderRadius: '13px', padding: '3px', cursor: 'pointer', transition: '0.3s' }}
                 >
                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', transform: isOnline ? 'translateX(24px)' : 'translateX(0)', transition: '0.3s' }}></div>
                 </div>
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
             <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>Total Earnings</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-color)' }}>$2,450</div>
             </div>
             <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>Active Cases</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary-color)' }}>12</div>
             </div>
          </div>

          <div className="card">
             <h3 style={{ marginBottom: '20px' }}>Appointments Queue Today</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[1, 2].map((item) => (
                    <div key={item} style={{ borderLeft: '4px solid var(--primary-color)', background: 'var(--bg-light)', padding: '15px', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Patient Case #{item}05</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Status: Pending Confirmation</div>
                        </div>
                        <button className="btn btn-outline" style={{ padding: '8px 15px', fontSize: '12px' }}>Open Case</button>
                    </div>
                ))}
             </div>
          </div>
      </main>
    </div>
  );
}
