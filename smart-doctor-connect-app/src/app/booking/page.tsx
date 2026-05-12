'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get('docId');
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'online',
    date: '',
    time_slot: '',
    problem_description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: docId || '00000000-0000-0000-0000-000000000000', // simulated fallback
          patient_id: '00000000-0000-0000-0000-000000000000', // Mock for demonstration
          date: formData.date || '2026-05-15',
          time_slot: formData.time_slot || '10:00 AM',
          type: formData.type,
          problem_description: formData.problem_description
        })
      });
      
      if (response.ok) {
        alert('Booking Confirmed successfully!');
        router.push('/dashboard/patient');
      } else {
        const data = await response.json();
        alert(data.error || 'Booking Failed');
      }
    } catch (err) {
      alert('An error occurred. Simulation assumed successful.');
      router.push('/dashboard/patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <div className="step-indicator">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-num">1</div>
            <span>Consultation</span>
          </div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-num">2</div>
            <span>Details</span>
          </div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-num">3</div>
            <span>Done</span>
          </div>
        </div>

        <div className="card" style={{ padding: '40px', marginTop: '20px' }}>
          {step === 1 && (
            <>
              <h2>Select Consultation Type</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Choose how you want to meet.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div 
                  onClick={() => setFormData({...formData, type: 'online'})} 
                  style={{ border: formData.type === 'online' ? '2px solid var(--primary-color)' : '2px solid #eee', padding: '30px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: formData.type === 'online' ? 'var(--bg-light)' : 'white' }}
                >
                  <i className="fa-solid fa-video" style={{ fontSize: '30px', color: 'var(--primary-color)', marginBottom: '15px' }}></i>
                  <div style={{ fontWeight: 600 }}>Online Call</div>
                </div>
                <div 
                  onClick={() => setFormData({...formData, type: 'physical'})} 
                  style={{ border: formData.type === 'physical' ? '2px solid var(--primary-color)' : '2px solid #eee', padding: '30px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: formData.type === 'physical' ? 'var(--bg-light)' : 'white' }}
                >
                  <i className="fa-solid fa-hospital" style={{ fontSize: '30px', color: 'var(--primary-color)', marginBottom: '15px' }}></i>
                  <div style={{ fontWeight: 600 }}>Clinic Visit</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Next Step</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Patient Information</h2>
              <div style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Select Date</label>
                  <input type="date" className="form-control" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Time</label>
                  <select className="form-control" onChange={(e) => setFormData({...formData, time_slot: e.target.value})}>
                     <option value="10:00 AM">10:00 AM</option>
                     <option value="11:30 AM">11:30 AM</option>
                     <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Symptoms/Problem Description</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    placeholder="Briefly describe why you are visiting..."
                    onChange={(e) => setFormData({...formData, problem_description: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={handleBooking} disabled={isSubmitting}>
                     {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Loading scheduler...</div>}>
      <BookingContent />
    </Suspense>
  );
}
