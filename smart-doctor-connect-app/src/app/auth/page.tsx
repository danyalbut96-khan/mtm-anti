'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'patient' | 'doctor'>('patient');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation based purely on direct routing hooks
    if (mode === 'patient') {
      router.push('/dashboard/patient');
    } else {
      router.push('/dashboard/doctor');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f4f7fe', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
           <div 
             onClick={() => setMode('patient')} 
             style={{ flex: 1, padding: '15px', textAlign: 'center', cursor: 'pointer', fontWeight: 600, borderBottom: mode === 'patient' ? '2px solid var(--primary-color)' : 'none', background: mode === 'patient' ? '#f8faff' : 'white', color: mode === 'patient' ? 'var(--primary-color)' : 'var(--text-light)' }}
           >Patient</div>
           <div 
             onClick={() => setMode('doctor')} 
             style={{ flex: 1, padding: '15px', textAlign: 'center', cursor: 'pointer', fontWeight: 600, borderBottom: mode === 'doctor' ? '2px solid var(--primary-color)' : 'none', background: mode === 'doctor' ? '#f8faff' : 'white', color: mode === 'doctor' ? 'var(--primary-color)' : 'var(--text-light)' }}
           >Doctor</div>
        </div>
        
        <div style={{ padding: '30px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '25px' }}>
               Welcome Back {mode === 'patient' ? '' : 'Dr.'}
            </h3>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" placeholder="user@example.com" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>Log In</button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
               New here? <a href="/doctor-register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Create Account</a>
            </div>
        </div>
      </div>
    </div>
  );
}
