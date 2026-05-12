'use client';

export default function Page() {
  return (
    <div className="section-bg" style={{ minHeight: '100vh', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'white', padding: '50px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontWeight: 800, marginBottom: '30px', fontSize: '32px' }}>Standardized Terms of Use</h1>
        <div style={{ color: 'var(--text-color)', lineHeight: 1.8, fontSize: '16px' }}>
            <p style={{ marginBottom: '20px' }}>Welcome to Smart Doctor Connect AI. By utilizing our platform, services, and artificial intelligence triage streams, you explicitly consent to standard operational guidelines detailed below.</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>1. Intellectual Utilization</h3>
            <p style={{ marginBottom: '20px' }}>Our ecosystem acts as an aggregator. Medical diagnosis results projected via native AI nodes represent predictive intent generators and NEVER replace legal clinical oversight.</p>

            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>2. Account Stewardship</h3>
            <p style={{ marginBottom: '20px' }}>Users possess ultimate accountability regarding cryptographic safe keys. Unauthorized matrix accesses resulting from leaked sessions are user liabilities.</p>

            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>3. Dynamic Evolution</h3>
            <p style={{ marginBottom: '20px' }}>We reserve implicit privilege to refactor functionality distribution hierarchies periodically ensuring continuous scalability.</p>
        </div>
      </div>
    </div>
  );
}
