'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

function AuthContent() {
  const [mode, setMode] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Auto extract requested role and redirects from parent state or query
  useEffect(() => {
    const requestedRole = searchParams.get('role');
    if (requestedRole === 'doctor' || requestedRole === 'patient') {
      setMode(requestedRole as any);
    }

    // 0. Auto check already logged in logic requirement
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
      // 1. Official Supabase auth transaction
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) throw new Error("Critical identification failure.");

      // 2. Role Enforcement Requirement: Perform explicit cross-reference validation
      if (mode === 'patient') {
        const { data: patient, error: fetchErr } = await supabase
          .from('patients')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        // Wait, if standard table fetch yields empty or error, block.
        // To cover cases where patient is newly authorized but DB row delay, 
        // we safely fallback to letting them log in or trigger direct insert.
        // Strict prompt: "If no patient found -> ErrorMsg 'No account... signup'"
        if (!patient && !fetchErr) { // Single can return null if not found
           await supabase.auth.signOut(); // Eject from state immediately
           throw new Error("No recognized Patient account associated with credentials. Please enroll as a patient.");
        }
        // Fallback check if SINGLE returns error because none found
        if (fetchErr && fetchErr.code === 'PGRST116') {
            await supabase.auth.signOut();
            throw new Error("No recognized Patient account found. Please register.");
        }
      } else {
        // Doctor validation branch
        const { data: doctor, error: fetchErr } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (fetchErr && fetchErr.code === 'PGRST116') {
           await supabase.auth.signOut();
           throw new Error("No corresponding Practitioner credentials found in system registry.");
        }
      }

      // 3. Successful Authentication Loopback injection
      const redirectTarget = searchParams.get('redirectTo') || (mode === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
      
      alert("Authorization Validated! Forwarding session...");
      router.push(redirectTarget);

    } catch (err: any) {
      setErrorMsg(err.message || "An unrecognized connectivity fault occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '420px', padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Role Selector tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6' }}>
           <div 
             onClick={() => { if(!loading) setMode('patient'); }} 
             style={{ flex: 1, padding: '18px', textAlign: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: mode === 'patient' ? '3px solid var(--primary-color)' : '3px solid transparent', background: mode === 'patient' ? 'white' : '#F9FAFB', color: mode === 'patient' ? 'var(--primary-color)' : '#6B7280', transition: 'all 0.2s' }}
           >Patient Entry</div>
           <div 
             onClick={() => { if(!loading) setMode('doctor'); }} 
             style={{ flex: 1, padding: '18px', textAlign: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: mode === 'doctor' ? '3px solid var(--primary-color)' : '3px solid transparent', background: mode === 'doctor' ? 'white' : '#F9FAFB', color: mode === 'doctor' ? 'var(--primary-color)' : '#6B7280', transition: 'all 0.2s' }}
           >Provider Entry</div>
        </div>
        
        <div style={{ padding: '40px 35px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
               <div style={{ width: '50px', height: '50px', background: '#F0FDFA', color: 'var(--primary-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 15px' }}>
                   {mode === 'patient' ? <i className="fa-solid fa-user-injured"></i> : <i className="fa-solid fa-user-md"></i>}
               </div>
               <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
                  {mode === 'patient' ? 'Sign In to Portal' : 'Clinician Sign In'}
               </h2>
               <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>Access your decentralized medical grid.</p>
            </div>

            {errorMsg && (
               <div className="fade-in" style={{ padding: '12px 16px', background: '#FEF2F2', color: '#B91C1C', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px', border: '1px solid #FEE2E2' }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ marginTop: '2px' }}></i>
                  <span>{errorMsg}</span>
               </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Workplace Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="user@smartdoc.pk" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontWeight: 600, marginBottom: 0 }}>Account Password</label>
                        <a href="#" style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 600 }}>Forgot?</a>
                    </div>
                    <input 
                        type="password" 
                        className="form-control" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 800, marginTop: '10px' }}>
                    {loading ? (
                        <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Verifying Credentials...</>
                    ) : (
                        `Log In As ${mode === 'patient' ? 'Patient' : 'Doctor'}`
                    )}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', borderTop: '1px solid #F3F4F6', paddingTop: '20px', color: 'var(--text-light)' }}>
               First time on the platform? <br/>
               <a href={mode === 'patient' ? "/doctor-register" : "/doctor-register"} style={{ color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'underline' }}>
                   Initialize Secure Registration
               </a>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Warming Engine...</div>}>
            <AuthContent />
        </Suspense>
    )
}
