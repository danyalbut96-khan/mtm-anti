'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

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
            <Link href="/auth/signup?role=doctor">For Doctors</Link>
            <Link href="/support">AI Support</Link>
          </div>

          <div className="nav-actions">
            <Link href="/auth/login" className="btn btn-outline desktop-only">Sign In</Link>
            <Link href="/auth/login" className="btn btn-primary desktop-only">Get Started</Link>
            
            {/* Requirement Part 3: Interactive Hamburger toggle */}
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

      {/* Full Mobile Dropdown Drawer Requirement */}
      {isOpen && (
        <div className="mobile-nav-drawer fade-in">
           <Link href="/" onClick={closeMenu}>Home</Link>
           <Link href="/find-doctor" onClick={closeMenu}>Find Doctor</Link>
           <Link href="/auth/signup?role=doctor" onClick={closeMenu}>For Doctors</Link>
           <Link href="/support" onClick={closeMenu}>AI Support</Link>
           <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />
           <Link href="/auth/login" className="btn btn-outline" onClick={closeMenu}>Sign In</Link>
        </div>
      )}

      <style jsx>{`
        .hamburger-btn {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text-color);
            cursor: pointer;
            padding: 5px;
            width: 44px; height: 44px; /* Touch-target optimization Requirement */
            align-items: center; justify-content: center;
        }
        .mobile-nav-drawer {
            position: fixed;
            top: 70px; left: 0; width: 100%;
            background: white;
            box-shadow: var(--shadow-lg);
            z-index: 999;
            display: flex; flex-direction: column;
            padding: 20px; gap: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        .mobile-nav-drawer a {
            font-weight: 600;
            color: var(--text-color);
            font-size: 16px;
            padding: 10px 5px;
        }
        @media (max-width: 768px) {
            .nav-links, .desktop-only { display: none !important; }
            .hamburger-btn { display: flex; }
        }
      `}</style>
    </>
  );
}
