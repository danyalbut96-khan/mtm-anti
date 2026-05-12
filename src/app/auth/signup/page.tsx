'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseBrowser';

const SPECIALIZATIONS = [
  "Cardiologist", "Dermatologist", "Orthopedic", "Gynecologist", "Neurologist", 
  "Pediatrician", "General Physician", "Psychiatrist", "ENT Specialist", 
  "Endocrinologist", "Gastroenterologist", "Ophthalmologist", "Urologist", 
  "Pulmonologist", "Nutritionist"
];

const CITIES = [
  "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", 
  "Quetta", "Multan", "Faisalabad", "Sialkot", "Wah Cantt"
];

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Determine Role context dynamically
  const roleFromUrl = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState<'patient' | 'doctor'>(roleFromUrl);

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '', // Mandatory patient/doctor communication contact
    // Doctor specific fields below:
    specialization: '',
    city: '',
    location: '',
    consultationType: 'Online',
    experience: '',
    bio: ''
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.fullName) newErrors.fullName = "Full Name required";
    if (!formData.email) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "6+ characters required";
    
    // Patient requires contact phone usually for confirmation
    if (role === 'patient' && !formData.phone) newErrors.phone = "Phone contact required";

    // Conditional validation branch only enforced on Doctor flows
    if (role === 'doctor') {
        if (!formData.specialization) newErrors.specialization = "Select specialization";
        if (!formData.city) newErrors.city = "Select primary city";
        if (!formData.location) newErrors.location = "Clinical location required";
        if (!formData.experience) newErrors.experience = "Experience years required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    
    if (!validate()) return;

    setLoading(true);
    const supabase = createClientBrowser();

    try {
      // 1. Common User creation across ALL roles
      const { data, error: authErr } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authErr) throw authErr;

      if (data.user) {
        // 2. Differentiated relational mapping routing
        if (role === 'doctor') {
            const { error: insertErr } = await supabase
              .from('doctors')
              .insert({
                id: data.user.id,
                name: formData.fullName,
                email: formData.email,
                specialization: formData.specialization,
                city: formData.city,
                location: formData.location,
                consultation_type: formData.consultationType,
                experience: parseInt(formData.experience),
                bio: formData.bio,
                rating: 5.0,
                is_available: true,
              });
            if (insertErr) throw insertErr;
            alert("Doctor Account Activated!");
            router.push('/doctor/dashboard');
        } else {
            // Patient branch implementation
            const { error: insertErr } = await supabase
              .from('patients')
              .insert({
                id: data.user.id,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone || 'N/A'
              });
            if (insertErr) throw insertErr;
            alert("Patient Account Activated!");
            router.push('/patient/dashboard');
        }
      } else {
        throw new Error("Session initialization sequence broken.");
      }
    } catch (err: any) {
      setGlobalError(err.message || "Processing constraints failed.");
      console.error("Reg Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }} className="section-bg">
      <div className="card fade-in" style={{ width: '100%', maxWidth: role === 'doctor' ? '650px' : '450px', padding: '40px', border: 'none', boxShadow: 'var(--shadow-lg)', transition: 'all 0.3s ease' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
           <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Start Registration</h1>
           <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Configure your connectivity node below.</p>
        </div>

        {/* Requirement: Inline role switcher explicitly activating standard flows */}
        <div style={{ background: '#F3F4F6', padding: '6px', borderRadius: '12px', display: 'flex', gap: '4px', marginBottom: '25px' }}>
            <button onClick={() => setRole('patient')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: role === 'patient' ? 'white' : 'transparent', boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none', fontWeight: role === 'patient' ? 700 : 500, color: role === 'patient' ? 'var(--primary-color)' : 'var(--text-light)', cursor: 'pointer' }}>
               Patient Mode
            </button>
            <button onClick={() => setRole('doctor')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: role === 'doctor' ? 'white' : 'transparent', boxShadow: role === 'doctor' ? 'var(--shadow-sm)' : 'none', fontWeight: role === 'doctor' ? 700 : 500, color: role === 'doctor' ? 'var(--primary-color)' : 'var(--text-light)', cursor: 'pointer' }}>
               Doctor Mode
            </button>
        </div>

        {globalError && (
           <div style={{ padding: '12px 16px', background: '#FEF2F2', color: 'var(--danger-color)', borderRadius: '8px', fontSize: '14px', marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <i className="fa-solid fa-triangle-exclamation"></i> {globalError}
           </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* UNIVERSAL CORE DATA BLOCKS FOR ALL USERS */}
          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Full Identifier Name <span style={{ color: 'red' }}>*</span></label>
             <input name="fullName" type="text" className="form-control" value={formData.fullName} onChange={handleChange} placeholder="e.g. Hammad Khan" />
             {errors.fullName && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.fullName}</small>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Secured Mail Gateway <span style={{ color: 'red' }}>*</span></label>
             <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="name@mail.pk" />
             {errors.email && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.email}</small>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Auth Cipher Key <span style={{ color: 'red' }}>*</span></label>
             <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
             {errors.password && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.password}</small>}
          </div>

          {/* Phone Contact Input always safe to collect for both */}
          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Contact Connection # <span style={{ color: role === 'patient' ? 'red' : 'transparent' }}>{role === 'patient' && '*'}</span></label>
             <input name="phone" type="text" className="form-control" value={formData.phone} onChange={handleChange} placeholder="+923XXXXXXXXX" />
             {errors.phone && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.phone}</small>}
          </div>

          {/* CONDITIONAL DOCTOR ENRICHMENT OVERLAYS */}
          {role === 'doctor' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '5px 0' }} />
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                     <label className="form-label">Specialization <span style={{ color: 'red' }}>*</span></label>
                     <select name="specialization" className="form-control" value={formData.specialization} onChange={handleChange}>
                        <option value="">Select...</option>
                        {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                     {errors.specialization && <small style={{ color: 'red' }}>{errors.specialization}</small>}
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                     <label className="form-label">Base City <span style={{ color: 'red' }}>*</span></label>
                     <select name="city" className="form-control" value={formData.city} onChange={handleChange}>
                        <option value="">Select...</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     {errors.city && <small style={{ color: 'red' }}>{errors.city}</small>}
                  </div>
               </div>
               
               <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Clinical Registry Loc <span style={{ color: 'red' }}>*</span></label>
                  <input name="location" type="text" className="form-control" placeholder="Phase, Area name" value={formData.location} onChange={handleChange} />
                  {errors.location && <small style={{ color: 'red' }}>{errors.location}</small>}
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                     <label className="form-label">Consult Mode</label>
                     <select name="consultationType" className="form-control" value={formData.consultationType} onChange={handleChange}>
                        <option value="Online">Online</option><option value="Physical">Physical</option><option value="Both">Both</option>
                     </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                     <label className="form-label">Years Exp <span style={{ color: 'red' }}>*</span></label>
                     <input name="experience" type="number" className="form-control" value={formData.experience} onChange={handleChange} />
                     {errors.experience && <small style={{ color: 'red' }}>{errors.experience}</small>}
                  </div>
               </div>
               
               <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Practice Summary</label>
                  <textarea name="bio" rows={2} className="form-control" placeholder="Short biography..." value={formData.bio} onChange={handleChange}></textarea>
               </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '16px', fontWeight: 700 }}>
             {loading ? (
               <> <i className="fa-solid fa-spinner fa-spin"></i> Establishing Network Matrix... </>
             ) : (
               `Finalize ${role === 'doctor' ? 'Practice' : 'Client'} Registration`
             )}
          </button>
        </form>
      </div>
      
      <style jsx>{` @media (max-width: 600px) { div[style*="display: grid"] { grid-template-columns: 1fr !important; } } `}</style>
    </div>
  );
}

export default function UnifiedSignupPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Warming Authorization Nodes...</div>}>
       <SignupFormContent />
    </Suspense>
  );
}
