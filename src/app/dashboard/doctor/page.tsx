'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="dashboard-layout fade-in">
      <aside className="dash-sidebar">
         <div style={{ marginBottom: '30px', paddingLeft: '16px' }}>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF' }}>Doctor Menu</h4>
         </div>
         
         <Link href="#" className="side-menu-link active">
            <i className="fa-solid fa-chart-pie"></i> Overview
         </Link>
         <Link href="#" className="side-menu-link">
            <i className="fa-solid fa-calendar-days"></i> Schedule
         </Link>
         <Link href="/chat" className="side-menu-link">
            <i className="fa-solid fa-comments"></i> Patient Inbox
         </Link>
         <Link href="#" className="side-menu-link">
            <i className="fa-solid fa-gear"></i> Settings
         </Link>

         <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
            <Link href="/" className="side-menu-link" style={{ color: 'var(--danger-color)' }}>
               <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </Link>
         </div>
      </aside>

      <main className="dash-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Practice Analytics</h1>
                  <p style={{ color: 'var(--text-light)' }}>Track patient metrics and schedule status.</p>
              </div>
              
              {/* Availability Toggler Redesign */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                 <span style={{ fontSize: '14px', fontWeight: 600, color: isOnline ? 'var(--success-color)' : '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                    <span className={isOnline ? "status-dot online" : "status-dot"} style={{ background: isOnline ? 'var(--success-color)' : '#D1D5DB' }}></span>
                    {isOnline ? 'Accepting Patients' : 'Currently Offline'}
                 </span>
                 <div 
                    onClick={() => setIsOnline(!isOnline)} 
                    style={{ width: '46px', height: '24px', background: isOnline ? 'var(--primary-color)' : '#E5E7EB', borderRadius: '12px', padding: '3px', cursor: 'pointer', transition: '0.3s', position: 'relative' }}
                 >
                    <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', left: '3px', transform: isOnline ? 'translateX(22px)' : 'translateX(0)', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                 </div>
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
             <div className="card" style={{ padding: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: 500 }}>Gross Earnings</span>
                    <div style={{ width: '36px', height: '36px', background: '#F0FDFA', color: 'var(--primary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-dollar-sign"></i>
                    </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>$2,450</div>
                <div style={{ fontSize: '12px', color: 'var(--success-color)', fontWeight: 600, marginTop: '4px' }}><i className="fa-solid fa-arrow-trend-up"></i> +12.5% this month</div>
             </div>

             <div className="card" style={{ padding: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: 500 }}>Consultation Count</span>
                    <div style={{ width: '36px', height: '36px', background: '#EFF6FF', color: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-users"></i>
                    </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>12</div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>Upcoming consultations today</div>
             </div>
          </div>

          <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-sm)', padding: '30px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Today's Queued Cases</h3>
                <button className="btn" style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--primary-color)', background: 'var(--primary-light)' }}>View Full Schedule</button>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2].map((item) => (
                    <div key={item} style={{ border: '1px solid #F3F4F6', background: '#FFFFFF', padding: '18px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: '45px', height: '45px', background: '#F3F4F6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '15px' }}>Patient ID Ref #{item}9024</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '2px' }}>Time Slot: 10:00 AM - Initial Screening</div>
                            </div>
                        </div>
                        <button className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '10px' }}>Launch Call</button>
                    </div>
                ))}
             </div>
          </div>
      </main>
    </div>
  );
}
