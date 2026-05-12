'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

export default function ConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const supabase = createClientBrowser();

    const handleSessionCheck = async () => {
      // Trigger automatic authentication confirmation process
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
         setStatus('success');
         // Direct checks against relational structure
         const { data: doctor } = await supabase
           .from('doctors')
           .select('id')
           .eq('id', session.user.id)
           .single();

         setTimeout(() => {
           if (doctor) router.push('/doctor/dashboard');
           else router.push('/patient/dashboard');
         }, 2000);
      } else {
         // Wait briefly in case lifecycle listener fires on load
         const { data: authListener } = supabase.auth.onAuthStateChange(
           async (event, currentSession) => {
             if (event === 'SIGNED_IN' && currentSession) {
               setStatus('success');
               const { data: doctor } = await supabase
                 .from('doctors')
                 .select('id')
                 .eq('id', currentSession.user.id)
                 .single();

               setTimeout(() => {
                 if (doctor) router.push('/doctor/dashboard');
                 else router.push('/patient/dashboard');
               }, 2000);
             } else if (event === 'SIGNED_OUT' && status === 'loading') {
                setStatus('error');
             }
           }
         );
         return () => authListener.subscription.unsubscribe();
      }
    };

    handleSessionCheck();
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
      <div className="card fade-in" style={{ textAlign: 'center', padding: '40px', maxWidth: '420px', width: '100%', margin: '0 20px', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        {status === 'loading' && (
          <>
            <div style={{ width: '48px', height: '48px', border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#374151' }}>Confirming Verification Hash...</h2>
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-color)' }}>Identity Confirmed!</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>Establishing secure session... forwarding to portal dashboard.</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--danger-color)' }}>Verification Issue</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '10px', lineHeight: 1.6 }}>Authentication request timed out or the security token expired. Please re-login to initialize session.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="btn btn-primary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Return to Hub
            </button>
          </>
        )}
      </div>
    </div>
  );
}
