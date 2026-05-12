'use client';

import Link from 'next/link';

export default function PatientDashboard() {
  return (
    <div className="dashboard-layout">
      <aside className="dash-sidebar">
         <h4 style={{ marginBottom: '20px', padding: '0 15px' }}>My Menu</h4>
         <a href="#" className="side-menu-link active"><i className="fa-solid fa-table-columns" style={{ marginRight: '10px' }}></i> Dashboard</a>
         <Link href="/chat" className="side-menu-link"><i className="fa-solid fa-comment" style={{ marginRight: '10px' }}></i> Messages</Link>
         <a href="#" className="side-menu-link"><i className="fa-solid fa-file-medical" style={{ marginRight: '10px' }}></i> Records</a>
         <hr style={{ margin: '20px 0', borderColor: '#eee' }} />
         <Link href="/" className="side-menu-link" style={{ color: 'var(--danger-color)' }}>Logout</Link>
      </aside>

      <main className="dash-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                  <h1 style={{ fontSize: '24px' }}>Welcome Back, Patient!</h1>
                  <p style={{ color: 'var(--text-light)' }}>Overview of your upcoming care.</p>
              </div>
              <Link href="/search" className="btn btn-primary">+ Book Specialist</Link>
          </div>

          <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px' }}>Active Bookings</h3>
              
              <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ padding: '10px', background: '#e8f0fe', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                          <div style={{ fontWeight: 700 }}>15</div>
                          <div style={{ fontSize: '10px', opacity: 0.7 }}>MAY</div>
                      </div>
                      <div>
                          <h4 style={{ fontSize: '16px' }}>General Checkup Appointment</h4>
                          <p style={{ fontSize: '13px', color: 'var(--primary-color)' }}>Time Slot: 10:00 AM</p>
                      </div>
                  </div>
                  <span className="badge badge-online">Status: Active</span>
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff, #f0f7ff)', border: '1px solid #cfe2ff' }}>
                  <div style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: '10px' }}><i className="fa-solid fa-brain"></i></div>
                  <h4>AI Doctor Recommendation</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '5px' }}>Matching you with top ranked neurologists near your updated health history records.</p>
                  <Link href="/search?specialization=Neurology" style={{ display: 'inline-block', marginTop: '15px', fontWeight: 600, color: 'var(--primary-color)', fontSize: '14px' }}>View recommendations →</Link>
              </div>
          </div>
      </main>
    </div>
  );
}
