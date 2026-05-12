import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Redesigned Centralized Large Hero Section */}
      <section className="hero-centered">
        <div className="container fade-in">
          <div className="badge badge-online" style={{ marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
             <i className="fa-solid fa-bolt" style={{ marginRight: '6px' }}></i> Next Generation Healthcare
          </div>
          <h1>Find Top-Rated Doctors,<br />Matched by <span style={{ color: 'var(--primary-color)', background: 'linear-gradient(120deg, #0D9488 0%, #14B8A6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart AI</span></h1>
          <p>Connect with global board-certified medical specialists within minutes. Secure, intelligent, and entirely seamless.</p>
          
          {/* The Large Centered Search Component */}
          <div className="centered-hero-search">
              <div className="search-input-item">
                  <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-light)', opacity: 0.7 }}></i>
                  <input type="text" placeholder="Symptoms (e.g. persistent cough)" />
              </div>
              <div className="search-input-item">
                  <i className="fa-solid fa-user-doctor" style={{ color: 'var(--text-light)', opacity: 0.7 }}></i>
                  <input type="text" placeholder="Specialization or Name" />
              </div>
              <div className="search-input-item">
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--text-light)', opacity: 0.7 }}></i>
                  <input type="text" placeholder="Location" />
              </div>
              <Link href="/search" className="btn btn-primary" style={{ padding: '14px 28px', marginLeft: '5px', borderRadius: '14px' }}>
                  Search
              </Link>
          </div>

          {/* AI Suggestion Chips (Per Prompt requirement) */}
          <div className="suggestion-chips">
              <span style={{ fontSize: '13px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', marginRight: '5px' }}>AI Suggestions:</span>
              <Link href="/search?specialization=Cardiology" className="chip">Cardiologist</Link>
              <Link href="/search?specialization=Dermatology" className="chip">Dermatology</Link>
              <Link href="/search?specialization=Neurology" className="chip">Neurology</Link>
              <Link href="/search?specialization=Pediatrics" className="chip">Pediatrician</Link>
          </div>
        </div>
      </section>

      {/* Modern Value Props with enhanced card designs */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className="features-grid">
            <div className="card" style={{ border: 'none', background: 'var(--bg-light)', padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#E0F2FE', color: '#0284C7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h3 style={{ marginBottom: '10px' }}>Dynamic AI Logic</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>Deep Gemini Flash processing maps patient language directly into precise specialist availability channels instantly.</p>
            </div>

            <div className="card" style={{ border: 'none', background: 'var(--bg-light)', padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#ECFDF5', color: '#059669', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>
                  <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3 style={{ marginBottom: '10px' }}>Verified Scheduling</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>Skip long clinic lines. Our distributed architecture guarantees conflict-free automated reservation systems.</p>
            </div>

            <div className="card" style={{ border: 'none', background: 'var(--bg-light)', padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#FFF1F2', color: '#E11D48', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>
                  <i className="fa-solid fa-headset"></i>
              </div>
              <h3 style={{ marginBottom: '10px' }}>Continuous Care</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>Offline status fallback automation routes real-time queries to integrated LLM triage modules round the clock.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
