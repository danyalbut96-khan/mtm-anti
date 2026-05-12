'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('Cardiologist');
  const [city, setCity] = useState('New York, NY');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/search?specialization=${searchTerm}&city=${city}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Search fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="section-bg" style={{ minHeight: '100vh' }}>
      <div className="container section">
        
        {/* Modernized Search Header */}
        <div className="search-header-box" style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px', marginBottom: '25px'}}>
          <div style={{ flex: 2, position: 'relative' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-light)' }}></i>
            <input 
              type="text" 
              className="form-control" 
              style={{ paddingLeft: '40px' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter specialization"
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <i className="fa-solid fa-location-dot" style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-light)' }}></i>
            <input 
              type="text" 
              className="form-control" 
              style={{ paddingLeft: '40px' }} 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Location"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }} className="responsive-grid-stack">
          {/* Placeholder Sidebar for Visual Alignment */}
          <aside style={{ background: 'white', padding: '20px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
            <h3>Filters</h3>
            <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '10px', fontSize: '15px' }}>Consultation</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked /> Online
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked /> In-Clinic
              </label>
            </div>
          </aside>

          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px' }}>{doctors.length} Doctors Found</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Matching current system data</p>
              </div>
            </div>

            {doctors.length === 0 && !loading && (
                <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
                    <p>No database matches found yet. Run the Supabase schema & populate data to see results here!</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {doctors.map((doc) => (
                <div key={doc.id} className="card" style={{ padding: '20px', position: 'relative' }}>
                   <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                           <Image 
                             src={doc.profile_pic || "/assets/doctor-male.png"} 
                             alt="Avatar" 
                             fill 
                             style={{ borderRadius: '10px', objectFit: 'cover' }}
                           />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px' }}>{doc.name}</h3>
                            <p style={{ color: 'var(--primary-color)', fontSize: '14px', fontWeight: 500 }}>{doc.specialization}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-light)' }}><i className="fa-solid fa-location-dot"></i> {doc.city}</p>
                        </div>
                   </div>
                   <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                      {doc.consultation_type && (
                         <span className="badge badge-online" style={{ textTransform: 'capitalize' }}>{doc.consultation_type}</span>
                      )}
                      {doc.is_available && <span className="badge badge-success">Available</span>}
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <Link href={`/doctor/${doc.id}`} className="btn btn-outline" style={{ fontSize: '13px' }}>View</Link>
                        <Link href={`/booking?docId=${doc.id}`} className="btn btn-primary" style={{ fontSize: '13px' }}>Book Now</Link>
                   </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-grid-stack {
             grid-template-columns: 1fr !important;
          }
          aside { display: none; }
        }
      `}</style>
    </div>
  );
}
