'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('Cardiologist');
  const [city, setCity] = useState('Islamabad');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [activeChatDoc, setActiveChatDoc] = useState<any | null>(null);
  const [miniChatInput, setMiniChatInput] = useState('');
  const [chatLogs, setChatLogs] = useState<Record<string, any[]>>({});

  const handleSearch = async () => {
    setLoading(true);
    setIsNearby(false);
    try {
      const res = await fetch(`/api/doctors/search?specialization=${searchTerm}&city=${city}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
      if (data.isNearbyFallback) {
        setIsNearby(true);
      }
    } catch (error) {
      console.error("Fetch Failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="section-bg" style={{ minHeight: '100vh' }}>
      <div className="container section fade-in">
        
        {/* Optimized Top Mini-Search Bar for Results View */}
        <div style={{ background: 'white', padding: '10px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', display: 'flex', gap: '8px', marginBottom: '40px', border: '1px solid rgba(0,0,0,0.03)'}}>
          <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: '#F9FAFB', borderRadius: '10px', padding: '0 15px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-light)', opacity: 0.6 }}></i>
            <input 
              type="text" 
              className="form-control" 
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Specialization..."
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#F9FAFB', borderRadius: '10px', padding: '0 15px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--text-light)', opacity: 0.6 }}></i>
            <input 
              type="text" 
              className="form-control" 
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }} 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ padding: '0 30px', borderRadius: '10px' }}>
            {loading ? '...' : 'Update'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="responsive-grid-stack">
          {/* Sidebar Filter Refinement */}
          <aside>
             <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
                <h4 style={{ marginBottom: '16px', color: '#111827' }}>Refine Results</h4>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', marginBottom: '12px' }}>Mode</div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', fontSize: '15px' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-color)' }} /> 🌐 Tele-Health Online
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '15px' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-color)' }} /> 🏥 In-Clinic Local
                    </label>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '20px 0' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)' }}>Status</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', fontSize: '15px' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-color)' }} /> Show Available Only
                </label>
             </div>
          </aside>

          <main>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700 }}>{doctors.length} Matches Found</h3>
              {isNearby && (
                <p style={{ color: 'var(--warning-color)', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                  <i className="fa-solid fa-circle-info"></i> No exact matches in {city}. Showing doctors in nearby cities.
                </p>
              )}
            </div>

            {doctors.length === 0 && !loading && (
                <div style={{ background: 'white', padding: '60px 20px', textAlign: 'center', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '40px', color: '#E5E7EB', marginBottom: '15px' }}><i className="fa-regular fa-folder-open"></i></div>
                    <h4 style={{ color: 'var(--text-color)' }}>No Real-Time Data</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px', maxWidth: '300px', margin: '5px auto 0' }}>Populate your Supabase schema and database records to initialize result streaming.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {doctors.map((doc) => (
                <div key={doc.id} className="card" style={{ padding: '24px' }}>
                   
                   {/* Online Availability Status Dot */}
                   <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        {doc.is_available ? (
                           <span className="badge badge-online"><span className="status-dot online"></span>Online</span>
                        ) : (
                           <span className="badge" style={{ background: '#F3F4F6', color: '#6B7280' }}>Offline</span>
                        )}
                   </div>

                   <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
                           <Image 
                             src={doc.profile_pic || "/assets/doctor-male.png"} 
                             alt="PFP" 
                             fill 
                             style={{ borderRadius: '12px', objectFit: 'cover', border: '2px solid #F3F4F6' }}
                           />
                        </div>
                        <div style={{ paddingTop: '4px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>{doc.name}</h3>
                            <span style={{ fontSize: '13px', background: '#F0FDFA', color: '#0F766E', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>{doc.specialization}</span>
                            
                            {/* Rating Stars Redesign */}
                            <div className="rating-stars" style={{ marginTop: '8px' }}>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star-half-stroke"></i>
                                <span style={{ color: 'var(--text-light)', fontSize: '12px', marginLeft: '4px' }}>({doc.rating || "5.0"})</span>
                            </div>
                        </div>
                   </div>

                   <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: '#9CA3AF' }}></i> {doc.city}, {doc.location || "Main Campus"}
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                        <Link href={`/doctor/${doc.id}`} className="btn btn-outline" style={{ padding: '10px' }}>Profile</Link>
                        <div style={{ display: 'flex', gap: '8px' }}>
                           <Link href={`/book/${doc.id}`} className="btn btn-primary" style={{ flex: 1, padding: '10px', fontWeight: 700 }}>Book Now</Link>
                           <button 
                             title="Quick Query"
                             onClick={() => setActiveChatDoc(doc)} 
                             style={{ width: '45px', background: '#F0FDFA', border: 'none', color: '#0D9488', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}
                           >
                             <i className="fa-solid fa-comment-dots"></i>
                           </button>
                        </div>
                   </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Floating Mini-Chat Widget Integration per Phase 3 */}
        {activeChatDoc && (
           <div className="fade-in" style={{ position: 'fixed', bottom: '20px', right: '20px', width: '340px', height: '400px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 2000 }}>
              <div style={{ background: 'var(--primary-color)', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Chat with Dr. {activeChatDoc.name.split(' ').pop()}</div>
                  <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }} onClick={() => setActiveChatDoc(null)}></i>
              </div>
              <div style={{ flex: 1, background: '#F9FAFB', padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ alignSelf: 'flex-start', background: 'white', padding: '8px 12px', borderRadius: '10px', borderBottomLeftRadius: 0, fontSize: '13px', border: '1px solid #E5E7EB' }}>
                      Hello! How can I help you specifically today?
                  </div>
                  {(chatLogs[activeChatDoc.id] || []).map((log: any, i: number) => (
                      <div key={i} style={{
                          alignSelf: log.role === 'user' ? 'flex-end' : 'flex-start',
                          background: log.role === 'user' ? 'var(--primary-color)' : 'white',
                          color: log.role === 'user' ? 'white' : 'var(--text-color)',
                          padding: '8px 12px', borderRadius: '10px',
                          fontSize: '13px',
                          border: log.role === 'user' ? 'none' : '1px solid #E5E7EB'
                      }}>
                          {log.content}
                      </div>
                  ))}
              </div>
              <div style={{ padding: '10px', background: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '6px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '8px' }} 
                    placeholder="Type a quick message..."
                    value={miniChatInput}
                    onChange={(e) => setMiniChatInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') {
                        const docId = activeChatDoc.id;
                        setChatLogs(p => ({...p, [docId]: [...(p[docId]||[]), {role:'user', content: miniChatInput}, {role:'ai', content:"Got it! The doctor will respond soon."}]}));
                        setMiniChatInput('');
                    }}}
                  />
              </div>
           </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-grid-stack { grid-template-columns: 1fr !important; }
          aside { display: none; }
        }
      `}</style>
    </div>
  );
}
