'use client';

export default function Page() {
  return (
    <div className="section-bg" style={{ minHeight: '100vh', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', background: 'white', padding: '50px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontWeight: 800, marginBottom: '30px', fontSize: '32px' }}>Data Privacy Protocol</h1>
        <div style={{ color: 'var(--text-color)', lineHeight: 1.8, fontSize: '16px' }}>
            <p style={{ marginBottom: '20px' }}>Smart Doctor Connect AI takes high-level information custody critically. All metadata is isolated conforming to globally adopted hygiene schemas.</p>
            
            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>1. Transit Encryptional Isolation</h3>
            <p style={{ marginBottom: '20px' }}>Interactions dispatched via the interface undergo total protocol conversion using SSL/TLS 1.3 barriers, shielding client histories from interception vectors.</p>

            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>2. Zero-Knowledge Persistence</h3>
            <p style={{ marginBottom: '20px' }}>We operate within isolated backend architectures. Relational clinical notes survive purely within user-bounded permission graphs.</p>

            <h3 style={{ marginTop: '30px', marginBottom: '10px', fontWeight: 700 }}>3. De-Identification Pipeline</h3>
            <p style={{ marginBottom: '20px' }}>AI tuning sequences are subjected to absolute scrub operations, annihilating specific user identities from predictive training telemetry sets.</p>
        </div>
      </div>
    </div>
  );
}
