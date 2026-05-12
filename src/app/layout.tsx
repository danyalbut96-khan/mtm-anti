import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
      {/* Requirement Part 3: Body configuration enabling full control preventing side overflow */}
      <body style={{ overflowX: 'hidden', width: '100vw' }}>
        
        {/* Unified Dynamic Responsive Hook */}
        <Navbar />

        <main className="fade-in" style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <Link href="/support" className="floating-chat-widget" title="Quick AI Intake Chat">
             <i className="fa-solid fa-comment-medical"></i>
        </Link>

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
                  {/* Requirement: Canonical Paths mapped strictly */}
                  <li><Link href="/find-doctor">Search Index</Link></li>
                  <li><Link href="/auth/signup?role=doctor">Provider Sign Up</Link></li>
                  <li><Link href="/support">AI Diagnostics</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Platforms</h4>
                <ul>
                  <li><Link href="/patient/dashboard">Patient Dashboard</Link></li>
                  <li><Link href="/doctor/dashboard">Clinician Portal</Link></li>
                  <li><Link href="/terms">Terms of Use</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Compliance</h4>
                <ul>
                  <li><Link href="/privacy">Data Privacy</Link></li>
                  <li><Link href="/transparency">Transparency</Link></li>
                  <li><a href="#">Contact Center</a></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Smart Doctor Connect AI. Licensed.</p>
              
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
