'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

function BookingContent({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'online',
    date: '',
    time_slot: '10:00 AM',
    problem_description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    const supabase = createClientBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctorId,
          patient_id: session.user.id,
          date: formData.date || '2026-05-20',
          time_slot: formData.time_slot,
          type: formData.type,
          problem_description: formData.problem_description
        })
      });
      
      if (response.ok) {
        alert('Booking Confirmed successfully!');
        // Requirement: Correct canonical path redirect
        router.push('/patient/dashboard');
      } else {
        const data = await response.json();
        alert(data.error || 'Booking Failed. Please refresh.');
      }
    } catch (err) {
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '60px 20px' }}>
        
        <div className="step-indicator" style={{ marginBottom: '30px' }}>
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}><div className="step-num">1</div><span style={{ fontSize: '13px', fontWeight: 600 }}>Mode</span></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}><div className="step-num">2</div><span style={{ fontSize: '13px', fontWeight: 600 }}>Details</span></div>
        </div>

        <div className="card fade-in" style={{ padding: '40px', border: 'none', boxShadow: 'var(--shadow-md)' }}>
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Choose Consult Mode</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Select where and how you prefer your session.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div onClick={() => setFormData({...formData, type: 'online'})} style={{ border: formData.type === 'online' ? '2px solid var(--primary-color)' : '1.5px solid var(--border-color)', padding: '30px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', background: formData.type === 'online' ? '#F0FDFA' : 'white', transition: 'all 0.2s' }}>
                  <i className="fa-solid fa-video" style={{ fontSize: '32px', color: formData.type === 'online' ? 'var(--primary-color)' : '#9CA3AF', marginBottom: '15px' }}></i>
                  <div style={{ fontWeight: 700 }}>Remote Online</div>
                </div>
                <div onClick={() => setFormData({...formData, type: 'physical'})} style={{ border: formData.type === 'physical' ? '2px solid var(--primary-color)' : '1.5px solid var(--border-color)', padding: '30px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', background: formData.type === 'physical' ? '#F0FDFA' : 'white', transition: 'all 0.2s' }}>
                  <i className="fa-solid fa-hospital" style={{ fontSize: '32px', color: formData.type === 'physical' ? 'var(--primary-color)' : '#9CA3AF', marginBottom: '15px' }}></i>
                  <div style={{ fontWeight: 700 }}>In-Clinic</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Proceed</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Finalize Visit Data</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Target Date</label>
                  <input type="date" className="form-control" required onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Desired Time</label>
                  <select className="form-control" onChange={(e) => setFormData({...formData, time_slot: e.target.value})}>
                     <option value="10:00 AM">10:00 AM</option>
                     <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Problem</label>
                  <textarea className="form-control" rows={3} onChange={(e) => setFormData({...formData, problem_description: e.target.value})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={handleBooking} disabled={isSubmitting}>
                     {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {showAuthModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <div className="fade-in" style={{ background: 'white', maxWidth: '400px', width: '90%', padding: '35px', borderRadius: '20px', textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 800 }}>Sign In Required</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '25px' }}>Please log in to establish the connection.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Ensure login redirect uses canonical new /auth/login */}
                      <button onClick={() => router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)} className="btn btn-primary">Sign In</button>
                      <button onClick={() => router.push(`/auth/signup?redirectTo=${encodeURIComponent(window.location.pathname)}`)} className="btn btn-outline">Sign Up</button>
                  </div>
              </div>
          </div>
        )}
      </div>
      <style jsx>{` @media (max-width: 600px) { div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; } } `}</style>
    </div>
  );
}

export default function BookingPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const unwrapped = use(params);
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Warming Scheduler...</div>}>
      <BookingContent doctorId={unwrapped.doctorId} />
    </Suspense>
  );
}
