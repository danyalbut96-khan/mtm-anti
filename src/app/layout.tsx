import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SmartDoc AI - Find the Right Doctor Instantly",
  description: "AI-powered modern medical appointment booking and tele-health portal.",
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
        {/* Universal Navbar */}
        <nav className="navbar">
          <div className="container nav-container">
            <Link href="/" className="logo">
              <i className="fa-solid fa-user-doctor"></i> SmartDoc <span>AI</span>
            </Link>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/search">Find Doctor</Link>
              <Link href="/doctor-register">For Doctors</Link>
              <Link href="/chat">AI Chat</Link>
            </div>
            <div className="nav-actions">
              <Link href="/auth" className="btn btn-outline">Sign in</Link>
            </div>
          </div>
        </nav>

        {/* Page Content Injection */}
        <main>{children}</main>

        {/* Universal Footer */}
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <div className="footer-logo"><i className="fa-solid fa-user-doctor"></i> SmartDoc AI</div>
                <p style={{ color: '#9aa0a6', fontSize: '14px' }}>Connecting patients with top quality healthcare through smart technology.</p>
              </div>
              <div className="footer-col">
                <h4>For Patients</h4>
                <ul>
                  <li><Link href="/search">Search for Doctors</Link></li>
                  <li><Link href="/chat">AI Health Chat</Link></li>
                  <li><Link href="/dashboard/patient">Dashboard</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>For Doctors</h4>
                <ul>
                  <li><Link href="/doctor-register">Join Network</Link></li>
                  <li><Link href="/dashboard/doctor">Doctor Portal</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Smart Doctor Connect AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
