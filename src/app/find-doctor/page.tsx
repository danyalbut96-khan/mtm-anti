'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientBrowser } from '@/lib/supabaseBrowser';

const SPECIALIZATIONS = [
  "All Specializations",
  "Cardiologist", "Dermatologist", "Orthopedic", "Gynecologist", "Neurologist", 
  "Pediatrician", "General Physician", "Psychiatrist", "ENT Specialist", 
  "Endocrinologist", "Gastroenterologist", "Ophthalmologist", "Urologist", 
  "Pulmonologist", "Nutritionist"
];

const CITIES = [
  "All Cities",
  "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", 
  "Quetta", "Multan", "Faisalabad", "Sialkot", "Wah Cantt"
];

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState('All Specializations');
  const [city, setCity] = useState('All Cities');
  const [type, setType] = useState('all');
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNearby, setIsNearby] = useState(false);

  // Requirement 2 Default State: Fetch All Doctors instantly
  const fetchAllDoctors = async () => {
    setLoading(true);
    setIsNearby(false);
    const supabase = createClientBrowser();
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .order('rating', { ascending: false });
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  // Requirement 2: Advanced Dynamic Filter Execution
  const searchDoctors = async () => {
    setLoading(true);
    setIsNearby(false);
    const supabase = createClientBrowser();
    
    let query = supabase.from('doctors').select('*');

    // Conditional appending based on 'all' bypass locks
    if (city && city !== 'All Cities' && city !== 'all') {
      query = query.ilike('city', `%${city}%`);
    }
    if (searchTerm && searchTerm !== 'All Specializations' && searchTerm !== 'all') {
      query = query.ilike('specialization', `%${searchTerm}%`);
    }
    if (type && type !== 'all') {
      // Convert to appropriate capitalized matches based on DB schema
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      query = query.ilike('consultation_type', `%${capitalizedType}%`);
    }

    let { data, error } = await query.order('rating', { ascending: false });
    
    // 2b. The Cluster fallback requirement loop
    if ((!data || data.length === 0) && city !== 'All Cities') {
        const nearbyCities: Record<string, string[]> = {
            islamabad: ['Rawalpindi', 'Wah Cantt', 'Attock'],
            karachi: ['Hyderabad', 'Thatta'],
            lahore: ['Sheikhupura', 'Kasur', 'Gujranwala'],
            rawalpindi: ['Islamabad', 'Wah Cantt']
        };
        const cluster = nearbyCities[city.toLowerCase()];
        if (cluster) {
            setIsNearby(true);
            // Fallback query against cluster subset
            let fallbackQuery = supabase.from('doctors').select('*').in('city', cluster);
            if (searchTerm && searchTerm !== 'All Specializations') {
                fallbackQuery = fallbackQuery.ilike('specialization', `%${searchTerm}%`);
            }
            const { data: fallbackData } = await fallbackQuery.order('rating', { ascending: false });
            data = fallbackData;
        }
    }

    setDoctors(data || []);
    setLoading(false);
  };

  return (
    <div className="section-bg" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Sticky Dynamic Filters Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #F3F4F6', padding: '20px 0', position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)' }}>
         <div className="container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
             <h3 style={{ fontWeight: 800, marginRight: '20px' }}>Search Grid</h3>
             
             <select 
               className="form-control" 
               style={{ width: 'auto', minWidth: '200px', background: '#F9FAFB' }}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             >
                 {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
             </select>

             <select 
               className="form-control" 
               style={{ width: 'auto', minWidth: '180px', background: '#F9FAFB' }}
               value={city}
               onChange={(e) => setCity(e.target.value)}
             >
                 {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>

             <select 
               className="form-control" 
               style={{ width: 'auto', minWidth: '150px', background: '#F9FAFB' }}
               value={type}
               onChange={(e) => setType(e.target.value)}
             >
                 <option value="all">All Modes</option>
                 <option value="online">Online</option>
                 <option value="physical">Physical</option>
             </select>

             <button className="btn btn-primary" onClick={searchDoctors} disabled={loading} style={{ padding: '10px 25px', borderRadius: '10px', marginLeft: 'auto' }}>
                 {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Apply Filters'}
             </button>
         </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>
          <div style={{ marginBottom: '25px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
                  {searchTerm === 'All Specializations' && city === 'All Cities' ? 'Listing All Providers' : 'Refined Search Results'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                  <span style={{ color: 'var(--text-light)', fontSize: '15px' }}>Showing {doctors.length} specialists</span>
                  {isNearby && (
                      <span className="badge" style={{ background: '#FEF3C7', color: '#D97706', fontWeight: 700, fontSize: '12px' }}>
                          <i className="fa-solid fa-circle-info"></i> Displaying Proximate Clusters
                      </span>
                  )}
              </div>
          </div>

          {doctors.length === 0 && !loading && (
              <div style={{ background: 'white', padding: '80px 20px', textAlign: 'center', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '48px', color: '#E5E7EB', marginBottom: '20px' }}><i className="fa-solid fa-user-slash"></i></div>
                  <h3 style={{ marginBottom: '10px' }}>No Matching Clinicians</h3>
                  <p style={{ color: 'var(--text-light)' }}>We could not locate doctors matching these specific criteria.</p>
                  <button onClick={fetchAllDoctors} className="btn btn-outline" style={{ marginTop: '20px' }}>Reset Filters</button>
              </div>
          )}

          {/* REQUIREMENT: Desktop 3 / Tablet 2 / Mobile 1 grid layout enforced via CSS below */}
          <div className="doctors-directory-grid">
              {doctors.map(doc => (
                 <div key={doc.id} className="card fade-in" style={{ padding: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                         <div style={{ position: 'relative', width: '68px', height: '68px' }}>
                             <Image src={doc.profile_pic || "/assets/doctor-male.png"} alt="doc" fill style={{ borderRadius: '14px', objectFit: 'cover' }} />
                         </div>
                         <div className="badge" style={{ height: 'fit-content', background: doc.is_available ? '#ECFDF5' : '#F3F4F6', color: doc.is_available ? '#059669' : '#6B7280', fontWeight: 700 }}>
                             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: doc.is_available ? '#10B981' : '#9CA3AF', marginRight: '6px' }}></span>
                             {doc.is_available ? 'Available' : 'Unavailable'}
                         </div>
                     </div>
                     
                     <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{doc.name}</h3>
                     <div style={{ fontSize: '13px', fontWeight: 700, color: '#0D9488', background: '#F0FDFA', display: 'inline-block', padding: '3px 10px', borderRadius: '6px', marginBottom: '12px' }}>
                         {doc.specialization}
                     </div>

                     <div style={{ fontSize: '14px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                         <i className="fa-solid fa-location-dot" style={{ width: '14px' }}></i> {doc.city}
                     </div>
                     <div style={{ fontSize: '14px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                         <i className="fa-solid fa-star" style={{ color: '#F59E0B', width: '14px' }}></i> {doc.rating || 5.0} Rating Score
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '20px', borderTop: '1px solid #F3F4F6', marginTop: '10px' }}>
                         <Link href={`/doctor/${doc.id}`} className="btn btn-outline" style={{ fontSize: '13px', padding: '12px 0', textAlign: 'center', display: 'block', borderRadius: '10px', fontWeight: 700 }}>View Profile</Link>
                         <Link href={`/book/${doc.id}`} className="btn btn-primary" style={{ fontSize: '13px', padding: '12px 0', textAlign: 'center', display: 'block', borderRadius: '10px', fontWeight: 700 }}>Book Now</Link>
                     </div>
                 </div>
              ))}
          </div>
      </div>

      <style jsx>{`
         .doctors-directory-grid {
             display: grid;
             grid-template-columns: repeat(3, 1fr);
             gap: 24px;
         }
         @media (max-width: 1024px) {
             .doctors-directory-grid { grid-template-columns: repeat(2, 1fr); }
         }
         @media (max-width: 640px) {
             .doctors-directory-grid { grid-template-columns: 1fr; }
             select { width: 100% !important; }
         }
      `}</style>
    </div>
  );
}
