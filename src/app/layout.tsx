import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SmartDoc AI - Find the Right Doctor Instantly",
  description: "Deep Teal medical portal powered by real-time Gemini AI matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body>
        {/* Elegant Navbar with Glassmorphism defaults */}
        <nav className="navbar">
          <div className="container nav-container">
            <Link href="/" className="logo">
              <i className="fa-solid fa-notes-medical"></i> SmartDoc <span>AI</span>
            </Link>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/search">Find Doctor</Link>
              <Link href="/doctor-register">For Doctors</Link>
              <Link href="/chat">AI Support</Link>
            </div>
            <div className="nav-actions">
              <Link href="/auth" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px' }}>Sign In</Link>
              <Link href="/auth" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Get Started</Link>
            </div>
          </div>
        </nav>

        {/* Unified Main injection with fade-in wrapper */}
        <main className="fade-in">{children}</main>

        {/* Floating Chat Widget Requirement - Placed Globally per Phase 2 prompt */}
        <Link href="/chat" className="floating-chat-widget" title="Quick AI Intake Chat">
             <i className="fa-solid fa-comment-medical"></i>
        </Link>

        {/* Standardized Footer containing Mandatory Footer credits */}
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <div className="footer-logo">
                   <i className="fa-solid fa-notes-medical" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> 
                   SmartDoc AI
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.7', maxWidth: '300px' }}>
                  Pioneering smart medical matching, leveraging hyper-fast AI pipelines to bridge patients with elite worldwide specialists instantly.
                </p>
              </div>
              <div className="footer-col">
                <h4>Medical Resources</h4>
                <ul>
                  <li><Link href="/search">Search Index</Link></li>
                  <li><Link href="/doctor-register">Provider Sign Up</Link></li>
                  <li><Link href="/chat">Emergency AI Triage</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Platforms</h4>
                <ul>
                  <li><Link href="/dashboard/patient">Patient Dashboard</Link></li>
                  <li><Link href="/dashboard/doctor">Clinician Portal</Link></li>
                  <li><a href="#">System Status</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Compliance</h4>
                <ul>
                  <li><a href="#">Data Privacy</a></li>
                  <li><a href="#">Terms of Use</a></li>
                  <li><a href="#">Contact Center</a></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Smart Doctor Connect AI. Licensed Platform.</p>
              
              {/* MANDATORY PHASE 2 BRANDING LINK */}
              <div className="cloudex-credit">
                  Made with ❤️ by <a href="https://cloudexify.site" target="_blank" rel="noopener noreferrer">Cloudexify</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
