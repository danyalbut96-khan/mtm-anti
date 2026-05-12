'use client';

export default function Page() {
  return (
    <div className="section-bg" style={{ minHeight: '100vh', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'white', padding: '50px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontWeight: 800, marginBottom: '30px', fontSize: '32px' }}>Platform Transparency Matrix</h1>
        <div style={{ color: 'var(--text-color)', lineHeight: 1.8, fontSize: '16px' }}>
            <p style={{ marginBottom: '20px' }}>We strive for maximum observable logic within our triage pipeline operations. Transparency dictates all underlying algorithms fueling your match sequences.</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>1. Algorithm Weight Distribution</h3>
            <p style={{ marginBottom: '20px' }}>Doctor indexing incorporates two vectors: Availability state (binary) and Rating composite (weighted decimal). No financial prioritization influences grid sorting.</p>

            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>2. Source Declarations</h3>
            <p style={{ marginBottom: '20px' }}>Large Language Models deployed act strictly through isolated API token authorizations (Claude/Gemini engines) ensuring minimal trace leakage back to training hubs.</p>

            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>3. Performance Metric Disclosure</h3>
            <p style={{ marginBottom: '20px' }}>Platform uptime vectors maintain consistent 99.9% target states enabling total accountability for scheduling flows.</p>
        </div>
      </div>
    </div>
  );
}
