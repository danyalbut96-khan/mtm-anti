'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get('docId');
  
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
    
    // 1. Secure Part 3 Auth Verification
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Execute part 2 logic: Send genuine user.id obtained via session
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: docId,
          patient_id: session.user.id,
          date: formData.date || '2026-05-20',
          time_slot: formData.time_slot,
          type: formData.type,
          problem_description: formData.problem_description
        })
      });
      
      if (response.ok) {
        alert('Booking Confirmed successfully!');
        router.push('/dashboard/patient');
      } else {
        const data = await response.json();
        alert(data.error || 'Booking Failed. Please refresh.');
      }
    } catch (err) {
      alert('An unexpected error occurred during booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '60px 20px' }}>
        
        <div className="step-indicator" style={{ marginBottom: '30px' }}>
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-num">1</div>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Mode</span>
          </div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-num">2</div>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Details</span>
          </div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-num">3</div>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Finalize</span>
          </div>
        </div>

        <div className="card fade-in" style={{ padding: '40px', border: 'none', boxShadow: 'var(--shadow-md)' }}>
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Choose Consult Mode</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Select where and how you prefer your session.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div 
                  onClick={() => setFormData({...formData, type: 'online'})} 
                  style={{ border: formData.type === 'online' ? '2px solid var(--primary-color)' : '1.5px solid var(--border-color)', padding: '30px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', background: formData.type === 'online' ? '#F0FDFA' : 'white', transition: 'all 0.2s' }}
                >
                  <i className="fa-solid fa-video" style={{ fontSize: '32px', color: formData.type === 'online' ? 'var(--primary-color)' : '#9CA3AF', marginBottom: '15px' }}></i>
                  <div style={{ fontWeight: 700, color: formData.type === 'online' ? '#0F766E' : 'var(--text-color)' }}>Remote Online Video</div>
                </div>
                <div 
                  onClick={() => setFormData({...formData, type: 'physical'})} 
                  style={{ border: formData.type === 'physical' ? '2px solid var(--primary-color)' : '1.5px solid var(--border-color)', padding: '30px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', background: formData.type === 'physical' ? '#F0FDFA' : 'white', transition: 'all 0.2s' }}
                >
                  <i className="fa-solid fa-hospital" style={{ fontSize: '32px', color: formData.type === 'physical' ? 'var(--primary-color)' : '#9CA3AF', marginBottom: '15px' }}></i>
                  <div style={{ fontWeight: 700, color: formData.type === 'physical' ? '#0F766E' : 'var(--text-color)' }}>In-Clinic Physical Visit</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '14px 30px' }} onClick={() => setStep(2)}>Proceed to Schedule</button>
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
                  <label className="form-label" style={{ fontWeight: 600 }}>Desired Time Frame</label>
                  <select className="form-control" onChange={(e) => setFormData({...formData, time_slot: e.target.value})}>
                     <option value="10:00 AM">10:00 AM - Morning</option>
                     <option value="11:30 AM">11:30 AM - Morning</option>
                     <option value="02:00 PM">02:00 PM - Afternoon</option>
                     <option value="04:30 PM">04:30 PM - Afternoon</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Clinical Issue Description</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    placeholder="Describe symptoms briefly to assist your practitioner..."
                    onChange={(e) => setFormData({...formData, problem_description: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)} style={{ borderRadius: '12px' }}>Back</button>
                  <button className="btn btn-primary" onClick={handleBooking} disabled={isSubmitting} style={{ borderRadius: '12px', padding: '14px 30px', fontWeight: 700 }}>
                     {isSubmitting ? 'Establishing Record...' : 'Confirm Booking Now'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Requirement Part 3: The Post-Confirm Authentication Portal Gated Dialog */}
        {showAuthModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <div className="fade-in" style={{ background: 'white', maxWidth: '450px', width: '90%', padding: '35px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
                  <div style={{ width: '50px', height: '50px', background: '#F0FDFA', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '20px' }}>
                      <i className="fa-solid fa-lock"></i>
                  </div>
                  <h3 style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 800 }}>Authentication Required</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '15px', marginBottom: '25px', lineHeight: 1.5 }}>Please sign in as a Patient to confirm your booking so we can save your appointment details.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => router.push(`/auth?role=patient&redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`)} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Sign In As Patient</button>
                      <button onClick={() => router.push(`/auth?role=patient&mode=signup&redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`)} className="btn btn-outline" style={{ width: '100%', padding: '12px' }}>Create New Account</button>
                      <button onClick={() => setShowAuthModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '13px', marginTop: '10px', cursor: 'pointer' }}>Dismiss</button>
                  </div>
              </div>
          </div>
        )}
      </div>
      <style jsx>{`
         @media (max-width: 600px) {
            div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
         }
      `}</style>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-light)' }}><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Establishing secure schedule gateway...</div>}>
      <BookingContent />
    </Suspense>
  );
}
