'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation logic assume DB entry written successfully
    alert("Profile registration completed. Redirecting to dashboard...");
    router.push('/dashboard/doctor');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', minHeight: 'calc(100vh - 70px)' }} className="register-container-grid">
      <div style={{ background: 'var(--primary-color)', color: 'white', padding: '60px 40px' }}>
         <h2>Join The SmartDoc Network</h2>
         <p style={{ opacity: 0.8, marginTop: '10px' }}>Gain access to hundreds of patients and leverage automated scheduling.</p>
         
         <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '30px', height: '30px', border: '2px solid white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step === 1 ? 'white' : 'transparent', color: step === 1 ? 'var(--primary-color)' : 'white', fontWeight: 700 }}>1</div>
                <span>Basic Details</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '30px', height: '30px', border: '2px solid white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step === 2 ? 'white' : 'transparent', color: step === 2 ? 'var(--primary-color)' : 'white', fontWeight: 700 }}>2</div>
                <span>Professional Setup</span>
            </div>
         </div>
      </div>

      <div className="section-bg" style={{ padding: '60px 40px' }}>
         <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
            {step === 1 ? (
                <form>
                   <h3>Personal Details</h3>
                   <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Let us know who you are.</p>
                   <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" placeholder="Dr. Jane Doe" />
                   </div>
                   <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="jane@example.com" />
                   </div>
                   <div className="form-group">
                      <label className="form-label">Choose Password</label>
                      <input type="password" className="form-control" />
                   </div>
                   <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>Next Step</button>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                   <h3>Professional Info</h3>
                   <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Configure medical credentials.</p>
                   <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <select className="form-control">
                         <option>Cardiology</option>
                         <option>General Physician</option>
                         <option>Dermatologist</option>
                      </select>
                   </div>
                   <div className="form-group">
                      <label className="form-label">Bio Summary</label>
                      <textarea className="form-control" rows={3} placeholder="Brief bio..." />
                   </div>
                   <div style={{ display: 'flex', gap: '15px' }}>
                       <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                       <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Finish & Sign Up</button>
                   </div>
                </form>
            )}
         </div>
      </div>
      <style jsx>{`
         @media (max-width: 800px) {
            .register-container-grid { grid-template-columns: 1fr !important; }
         }
      `}</style>
    </div>
  );
}
