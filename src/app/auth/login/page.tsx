'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabaseBrowser';

function AuthContent() {
  const [mode, setMode] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const requestedRole = searchParams.get('role');
    if (requestedRole === 'doctor' || requestedRole === 'patient') {
      setMode(requestedRole as any);
    }

    const checkActiveSession = async () => {
       const supabase = createClientBrowser();
       const { data: { session } } = await supabase.auth.getSession();
       if (session) {
          const targetRedirect = searchParams.get('redirectTo') || '/';
          router.push(targetRedirect);
       }
    }
    checkActiveSession();
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClientBrowser();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Critical identification failure.");

      if (mode === 'patient') {
        const { data: patient, error: fetchErr } = await supabase.from('patients').select('*').eq('id', data.user.id).maybeSingle();
        if (!patient) {
           await supabase.auth.signOut();
           throw new Error("No recognized Patient account associated with credentials. Please enroll as a patient.");
        }
      } else {
        const { data: doctor } = await supabase.from('doctors').select('*').eq('id', data.user.id).maybeSingle();
        if (!doctor) {
           await supabase.auth.signOut();
           throw new Error("No corresponding Practitioner credentials found in system registry.");
        }
      }

      const redirectTarget = searchParams.get('redirectTo') || (mode === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
      router.push(redirectTarget);
      router.refresh();

    } catch (err: any) {
      setErrorMsg(err.message || "An unrecognized connectivity fault occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', background: 'linear-gradient(135deg, #F9FAFB 0%, #EDF2F7 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorator Blobs */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(13, 148, 136, 0.05)', borderRadius: '50%', top: '-100px', right: '-100px', filter: 'blur(60px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(37, 99, 235, 0.04)', borderRadius: '50%', bottom: '-50px', left: '-50px', filter: 'blur(50px)', zIndex: 0 }}></div>

      <div className="fade-in" style={{ width: '100%', maxWidth: '450px', padding: 0, position: 'relative', zIndex: 1, borderRadius: '24px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(255,255,255,0.7)', overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
           <div 
             onClick={() => { if(!loading) setMode('patient'); }} 
             style={{ flex: 1, padding: '20px', textAlign: 'center', cursor: 'pointer', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: mode === 'patient' ? 'var(--primary-color)' : '#94A3B8', background: mode === 'patient' ? 'white' : 'transparent', borderBottom: mode === 'patient' ? '3px solid var(--primary-color)' : '3px solid transparent', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
           >Patient Node</div>
           <div 
             onClick={() => { if(!loading) setMode('doctor'); }} 
             style={{ flex: 1, padding: '20px', textAlign: 'center', cursor: 'pointer', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: mode === 'doctor' ? '#2563EB' : '#94A3B8', background: mode === 'doctor' ? 'white' : 'transparent', borderBottom: mode === 'doctor' ? '3px solid #2563EB' : '3px solid transparent', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
           >Provider Node</div>
        </div>
        
        <div style={{ padding: '45px 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
               <div style={{ width: '55px', height: '55px', background: mode === 'patient' ? '#F0FDFA' : '#EFF6FF', color: mode === 'patient' ? 'var(--primary-color)' : '#2563EB', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 15px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}>
                   {mode === 'patient' ? <i className="fa-solid fa-hospital-user"></i> : <i className="fa-solid fa-user-doctor"></i>}
               </div>
               <h2 style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px', color: '#111827' }}>
                  {mode === 'patient' ? 'System Ingress' : 'Clinician Matrix'}
               </h2>
               <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px', fontWeight: 500 }}>Verify credentials to unlock secure core.</p>
            </div>

            {errorMsg && (
               <div className="fade-in" style={{ padding: '14px 18px', background: '#FFF1F2', color: '#E11D48', borderRadius: '12px', fontSize: '13px', fontWeight: 600, marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '10px', border: '1px solid #FFE4E6' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '2px' }}></i>
                  <span>{errorMsg}</span>
               </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#4B5563', letterSpacing: '0.02em' }}>Network Alias</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="secure@domain.pk" 
                        required 
                        style={{ height: '50px', borderRadius: '12px', background: '#F9FAFB', border: '1.5px solid #F3F4F6', fontSize: '15px' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', color: '#4B5563', letterSpacing: '0.02em', marginBottom: 0 }}>Auth Cipher</label>
                        <a href="#" style={{ fontSize: '12px', color: mode === 'patient' ? 'var(--primary-color)' : '#2563EB', fontWeight: 700 }}>Reroute Cipher?</a>
                    </div>
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="••••••••"
                        required 
                        style={{ height: '50px', borderRadius: '12px', background: '#F9FAFB', border: '1.5px solid #F3F4F6', fontSize: '15px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '15px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', marginTop: '10px', background: mode === 'patient' ? 'var(--primary-color)' : '#2563EB', color: 'white', border: 'none', cursor: 'pointer', boxShadow: mode === 'patient' ? '0 10px 15px -3px rgba(13, 148, 136, 0.2)' : '0 10px 15px -3px rgba(37, 99, 235, 0.2)', transition: 'all 0.2s ease' }}>
                    {loading ? (
                        <><i className="fa-solid fa-gear fa-spin" style={{ marginRight: '10px' }}></i> Decrypting Sequence...</>
                    ) : (
                        `Establish Secure Link`
                    )}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '25px', color: '#6B7280' }}>
               Zero existing identification? <br/>
               <Link href={mode === 'patient' ? "/auth/signup" : "/auth/signup?role=doctor"} style={{ color: mode === 'patient' ? 'var(--primary-color)' : '#2563EB', fontWeight: 800, marginTop: '6px', display: 'inline-block', fontSize: '14px' }}>
                   Initiate Enrollment Wave <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px', marginLeft: '4px' }}></i>
               </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Synchronizing Cryptographic Clock...</div>}>
            <AuthContent />
        </Suspense>
    )
}
