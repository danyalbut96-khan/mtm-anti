'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [loading, setLoading] = useState(true);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const supabase = createClientBrowser();
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
         const { data: docData } = await supabase.from('doctors').select('name').eq('id', session.user.id).maybeSingle();
         
         if (docData) {
             setUser(docData);
             setRole('doctor');
         } else {
             const { data: patData } = await supabase.from('patients').select('name').eq('id', session.user.id).maybeSingle();
             if (patData) {
                 setUser(patData);
                 setRole('patient');
             } else {
                 setUser({ name: session.user.email?.split('@')[0] });
             }
         }
      } else {
         setUser(null);
         setRole(null);
      }
      setLoading(false);
    };

    checkAuth();

    // Requirement: Watch Auth-State live across dynamic redirects
    const { data: listener } = supabase.auth.onAuthStateChange(() => checkAuth());
    
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
      const supabase = createClientBrowser();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link href="/" className="logo" onClick={closeMenu}>
            <i className="fa-solid fa-notes-medical"></i> SmartDoc <span>AI</span>
          </Link>

          {/* Desktop Linkages */}
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/find-doctor">Find Doctor</Link>
            {(!user || role === 'patient') && <Link href="/auth/signup?role=doctor">For Doctors</Link>}
            <Link href="/support">AI Support</Link>
          </div>

          <div className="nav-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {loading ? (
                <div style={{ width: '40px', height: '40px', border: '2px solid #F3F4F6', borderTop: '2px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            ) : user ? (
                <div className="desktop-only" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                   <Link href={role === 'doctor' ? "/doctor/dashboard" : "/patient/dashboard"} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 15px', border: '1px solid #E5E7EB' }}>
                       <div style={{ width: '24px', height: '24px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                           {user.name?.charAt(0).toUpperCase() || 'U'}
                       </div>
                       <span style={{ fontWeight: 600, fontSize: '14px' }}>Dashboard</span>
                   </Link>
                   <button onClick={handleLogout} className="btn" style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '14px', padding: '8px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                       Log Out
                   </button>
                </div>
            ) : (
                <div className="desktop-only" style={{ display: 'flex', gap: '10px' }}>
                  <Link href="/auth/login" className="btn btn-outline">Sign In</Link>
                  <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
                </div>
            )}
            
            <button 
               className="hamburger-btn" 
               onClick={() => setIsOpen(!isOpen)}
               aria-label="Toggle Menu"
            >
              <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="mobile-nav-drawer fade-in">
           <Link href="/" onClick={closeMenu}>Home</Link>
           <Link href="/find-doctor" onClick={closeMenu}>Find Doctor</Link>
           {(!user || role === 'patient') && <Link href="/auth/signup?role=doctor" onClick={closeMenu}>For Doctors</Link>}
           <Link href="/support" onClick={closeMenu}>AI Support</Link>
           <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />
           {user ? (
               <>
                  <Link href={role === 'doctor' ? "/doctor/dashboard" : "/patient/dashboard"} onClick={closeMenu} style={{ fontWeight: 800, color: 'var(--primary-color)' }}>Go to Dashboard</Link>
                  <button onClick={() => { handleLogout(); closeMenu(); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#DC2626', fontWeight: 600, fontSize: '16px', padding: '10px 5px', cursor: 'pointer' }}>Log Out</button>
               </>
           ) : (
               <Link href="/auth/login" className="btn btn-outline" onClick={closeMenu}>Sign In</Link>
           )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .hamburger-btn {
            display: none;
            background: none; border: none;
            font-size: 24px; color: var(--text-color);
            cursor: pointer; padding: 5px;
            width: 44px; height: 44px;
            align-items: center; justify-content: center;
        }
        .mobile-nav-drawer {
            position: fixed; top: 70px; left: 0; width: 100%;
            background: white; box-shadow: var(--shadow-lg);
            z-index: 999; display: flex; flex-direction: column;
            padding: 20px; gap: 15px; border-bottom: 1px solid var(--border-color);
        }
        .mobile-nav-drawer a {
            font-weight: 600; color: var(--text-color);
            font-size: 16px; padding: 10px 5px;
        }
        @media (max-width: 768px) {
            .nav-links, .desktop-only { display: none !important; }
            .hamburger-btn { display: flex; }
        }
      `}</style>
    </>
  );
}
