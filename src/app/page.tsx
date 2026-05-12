'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// REQUIRED FIX 1: AI MAPPING CONSTANT
const symptomToSpecialization: Record<string, string> = {
  headache: 'Neurologist',
  migraine: 'Neurologist',
  fever: 'General Physician',
  cold: 'General Physician',
  cough: 'Pulmonologist',
  'chest pain': 'Cardiologist',
  heart: 'Cardiologist',
  skin: 'Dermatologist',
  acne: 'Dermatologist',
  rash: 'Dermatologist',
  'back pain': 'Orthopedic',
  bone: 'Orthopedic',
  joint: 'Orthopedic',
  stomach: 'Gastroenterologist',
  digestion: 'Gastroenterologist',
  eye: 'Ophthalmologist',
  ear: 'ENT Specialist',
  throat: 'ENT Specialist',
  nose: 'ENT Specialist',
  child: 'Pediatrician',
  baby: 'Pediatrician',
  pregnancy: 'Gynecologist',
  women: 'Gynecologist',
  anxiety: 'Psychiatrist',
  depression: 'Psychiatrist',
  diabetes: 'Endocrinologist',
  thyroid: 'Endocrinologist',
  kidney: 'Urologist',
  urine: 'Urologist',
  lung: 'Pulmonologist',
  breathing: 'Pulmonologist',
  weight: 'Nutritionist',
  diet: 'Nutritionist',
};

const getSpecialization = (symptom: string): string => {
  const lower = symptom.toLowerCase();
  for (const [key, value] of Object.entries(symptomToSpecialization)) {
    if (lower.includes(key)) return value;
  }
  return 'General Physician'; // default fallback
};

const CHIPS = ["Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Orthopedic"];

export default function HomePage() {
  const [symptom, setSymptom] = useState('');
  const [city, setCity] = useState('Islamabad');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isNearby, setIsNearby] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);

  const runSearch = async ({ spec, targetCity }: { spec: string, targetCity: string }) => {
    setLoading(true);
    setIsNearby(false);
    setSearchedOnce(true);
    try {
      // Re-using hardened API route which handles Pakistani fallback logic internally!
      const response = await fetch(`/api/doctors/search?specialization=${encodeURIComponent(spec)}&city=${encodeURIComponent(targetCity)}`);
      const data = await response.json();
      setResults(data.doctors || []);
      if (data.isNearbyFallback) setIsNearby(true);
    } catch (err) {
      console.error("Homepage instant search err:", err);
    } finally {
      setLoading(false);
    }
  };

  // Automated triggering when symptom typing matures or city changes instantly!
  const handleSearchClick = () => {
    const derivedSpec = getSpecialization(symptom);
    runSearch({ spec: derivedSpec, targetCity: city || 'Islamabad' });
  };

  // Requirement FIX 3: Click Chip behavior
  const handleChipClick = (clickedSpec: string) => {
    setSymptom(''); // Clear existing input
    runSearch({ spec: clickedSpec, targetCity: city || 'Islamabad' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Centered High-Impact Search Engine */}
      <section className="hero-centered" style={{ paddingBottom: results.length > 0 ? '50px' : '100px' }}>
        <div className="container fade-in">
          <div className="badge badge-online" style={{ marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>
             <i className="fa-solid fa-bolt" style={{ marginRight: '6px' }}></i> Medical Grid v2.0
          </div>
          <h1 style={{ marginBottom: '1rem' }}>Find Certified Doctors,<br />Detected by <span style={{ color: 'var(--primary-color)', background: 'linear-gradient(120deg, #0D9488 0%, #14B8A6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Native AI</span></h1>
          <p style={{ maxWidth: '600px', margin: '0 auto 35px', fontSize: '17px' }}>Input symptoms directly. Our semantic pipeline maps diagnoses to elite specialist hubs instantaneously.</p>
          
          <div className="centered-hero-search" style={{ transition: 'all 0.3s ease' }}>
              <div className="search-input-item" style={{ flex: 1.5 }}>
                  <i className="fa-solid fa-notes-medical" style={{ color: 'var(--primary-color)', opacity: 0.8, fontSize: '18px' }}></i>
                  <input 
                    type="text" 
                    placeholder="Describe symptoms (e.g. headache, skin rash)" 
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                    style={{ fontSize: '15px' }}
                  />
              </div>
              <div className="search-input-item">
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--text-light)', opacity: 0.7 }}></i>
                  <input 
                    type="text" 
                    placeholder="Location (e.g. Islamabad)" 
                    value={city}
                    onChange={(e) => {
                        const val = e.target.value;
                        setCity(val);
                        // Requirement Fix 2: City change reruns instantly if already engaged!
                        if(searchedOnce) {
                            const curSpec = getSpecialization(symptom);
                            runSearch({ spec: curSpec, targetCity: val || 'Islamabad' });
                        }
                    }}
                    style={{ fontSize: '15px' }}
                  />
              </div>
              <button onClick={handleSearchClick} className="btn btn-primary" style={{ padding: '14px 35px', marginLeft: '5px', borderRadius: '14px', fontWeight: 700 }}>
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Match Doctors"}
              </button>
          </div>

          {/* Requirement Fix 3: AI Suggestion Chips */}
          <div className="suggestion-chips" style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', marginRight: '5px', fontWeight: 500 }}>Quick Filter:</span>
              {CHIPS.map(c => (
                  <button key={c} onClick={() => handleChipClick(c)} className="chip" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                      {c}
                  </button>
              ))}
          </div>
        </div>
      </section>

      {/* INSTANT SEARCH RESULTS GRID (NO RELOAD INJECTED HERE!) */}
      {searchedOnce && (
          <section className="section fade-in" style={{ background: '#FFFFFF', paddingTop: '20px', paddingBottom: '60px' }}>
             <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #F3F4F6', paddingBottom: '15px' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
                           {loading ? 'Scanning Practitioner Database...' : `${results.length} Realtime Matches`}
                        </h2>
                        {isNearby && !loading && (
                           <p style={{ color: '#D97706', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                               <i className="fa-solid fa-circle-info"></i> No exact area hits. Propagating nearby clusters for {city || 'Islamabad'}...
                           </p>
                        )}
                    </div>
                </div>

                {results.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-light)', borderRadius: '20px' }}>
                        <div style={{ fontSize: '40px', color: '#D1D5DB', marginBottom: '15px' }}><i className="fa-regular fa-face-frown"></i></div>
                        <h3>No exact clinician coverage found.</h3>
                        <p style={{ color: 'var(--text-light)' }}>Try generalized symptoms or change the target municipality.</p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {results.map(doc => (
                        <div key={doc.id} className="card fade-in" style={{ padding: '24px', border: '1px solid #F3F4F6' }}>
                            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                {doc.is_available ? (
                                    <span className="badge" style={{ background: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: 700 }}><span className="status-dot online"></span>Online Now</span>
                                ) : (
                                    <span className="badge" style={{ background: '#F3F4F6', color: '#6B7280', fontSize: '12px' }}>Off Hours</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                                    <Image src={doc.profile_pic || "/assets/doctor-male.png"} alt="pfp" fill style={{ borderRadius: '12px', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '2px' }}>{doc.name}</h3>
                                    <span style={{ fontSize: '12px', background: '#F0FDFA', color: '#0F766E', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>{doc.specialization}</span>
                                </div>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fa-solid fa-map-marker-alt"></i> {doc.city}, {doc.location || "Registered Campus"}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '15px', borderTop: '1px solid #F3F4F6' }}>
                                <Link href={`/doctor/${doc.id}`} className="btn btn-outline" style={{ padding: '10px', fontSize: '13px' }}>Profile</Link>
                                <Link href={`/book/${doc.id}`} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px', fontWeight: 700 }}>Book Visit</Link>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </section>
      )}

      {/* Modern Value Props statically anchored below */}
      <section className="section-bg section" style={{ paddingTop: '60px' }}>
        <div className="container">
          {!searchedOnce && (
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <h2 style={{ fontWeight: 800 }}>Intelligent Infrastructure</h2>
                  <p style={{ color: 'var(--text-light)' }}>Underlying protocols power seamless distribution logic.</p>
              </div>
          )}
          <div className="features-grid">
            <div className="card" style={{ border: 'none', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '56px', height: '56px', background: '#F0FDFA', color: 'var(--primary-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Instant AI Intent</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Semantic translation converts natural language symptoms into precise clinical channel alignments immediately.</p>
            </div>

            <div className="card" style={{ border: 'none', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '56px', height: '56px', background: '#EFF6FF', color: '#2563EB', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>
                  <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Global Registry</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Cross-referenced database ensures conflicts are eradicated globally via resilient booking timestamps.</p>
            </div>

            <div className="card" style={{ border: 'none', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '56px', height: '56px', background: '#FFF1F2', color: '#E11D48', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px' }}>
                  <i className="fa-solid fa-headset"></i>
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>24/7 Pipeline</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Continuous intake vectors automatically load balance incoming queries without downtime degradations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
