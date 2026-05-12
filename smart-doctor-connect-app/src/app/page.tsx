import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section">
        <div className="container hero">
          <div className="hero-content">
            <h1>Find the Right Doctor, <span>Instantly</span> with AI</h1>
            <p>Describe your symptoms and get matched with top-rated doctors in your area. Book instant virtual or physical consultations.</p>
            
            <div className="search-box-container">
              <div className="search-input-group">
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                <input type="text" placeholder="Search symptoms, specialities..." />
              </div>
              <div className="search-input-group">
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i>
                <input type="text" placeholder="City or location" />
              </div>
              <Link href="/search" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                Search Now
              </Link>
            </div>
            <small style={{ color: 'var(--text-light)' }}>Popular: Cardiologist, Dermatologist, General Physician</small>
          </div>
          <div className="hero-image">
            <Image 
              src="/assets/hero.png" 
              alt="SmartDoc AI Healthcare Illustration" 
              width={600} 
              height={400} 
              priority 
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Advanced Healthcare Features</h2>
            <p>Experience the future of appointment booking powered by medical AI.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-brain"></i></div>
              <h3>AI-Powered Matching</h3>
              <p>Our intelligent system analyzes symptoms and preferences to connect you with the optimal specialist.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-bolt"></i></div>
              <h3>Instant Appointments</h3>
              <p>Skip wait lists. Real-time availability synchronization for quick confirmed consultations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-comments"></i></div>
              <h3>24/7 AI Assistant</h3>
              <p>Need triage? Chat with our automated agent anytime for support and automated bookings.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
