'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
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
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Valid email is required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be 6+ chars";
    if (!formData.specialization) newErrors.specialization = "Please select specialization";
    if (!formData.city) newErrors.city = "Please select your city";
    if (!formData.location) newErrors.location = "Clinical location area is required";
    if (!formData.consultationType) newErrors.consultationType = "Required";
    if (!formData.experience) newErrors.experience = "Total experience years required";
    
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
      // 1. Attempt Supabase Auth Sign Up
      const { data, error: authErr } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authErr) throw authErr;

      if (data.user) {
        // 2. Insert detailed relational profile mapping as requested
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

        // 3. Routing override on perfect capture
        alert("Registration Successful! Profile data recorded.");
        router.push('/dashboard/doctor');
      } else {
        throw new Error("Failed to create user session.");
      }

    } catch (err: any) {
      setGlobalError(err.message || "A technical constraint occurred during processing.");
      console.error("Reg error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }} className="section-bg">
      <div className="card fade-in" style={{ width: '100%', maxWidth: '650px', padding: '40px', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
           <div style={{ width: '60px', height: '60px', background: '#F0FDFA', color: 'var(--primary-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 15px', border: '1px solid #CCFBF1' }}>
              <i className="fa-solid fa-user-doctor"></i>
           </div>
           <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Join Medical Network</h1>
           <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Establish your digitized medical practice profile instantly.</p>
        </div>

        {globalError && (
           <div style={{ padding: '12px 16px', background: '#FEF2F2', color: 'var(--danger-color)', borderRadius: '8px', fontSize: '14px', marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <i className="fa-solid fa-triangle-exclamation"></i> {globalError}
           </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Basic Info Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name <span style={{ color: 'red' }}>*</span></label>
                <input name="fullName" type="text" className="form-control" placeholder="Dr. Hamza" value={formData.fullName} onChange={handleChange} />
                {errors.fullName && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.fullName}</small>}
             </div>
             <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Email Address <span style={{ color: 'red' }}>*</span></label>
                <input name="email" type="email" className="form-control" placeholder="hamza@clinic.pk" value={formData.email} onChange={handleChange} />
                {errors.email && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.email}</small>}
             </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Choose Password <span style={{ color: 'red' }}>*</span></label>
             <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} />
             {errors.password && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.password}</small>}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6' }} />

          {/* Professional Data */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Specialization <span style={{ color: 'red' }}>*</span></label>
                <select name="specialization" className="form-control" value={formData.specialization} onChange={handleChange}>
                   <option value="">Select specialization</option>
                   {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialization && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.specialization}</small>}
             </div>
             <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Primary City <span style={{ color: 'red' }}>*</span></label>
                <select name="city" className="form-control" value={formData.city} onChange={handleChange}>
                   <option value="">Select City</option>
                   {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.city}</small>}
             </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Clinical Address Location <span style={{ color: 'red' }}>*</span></label>
             <input name="location" type="text" className="form-control" placeholder="e.g., Blue Area, Islamabad" value={formData.location} onChange={handleChange} />
             {errors.location && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.location}</small>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Consultation Type <span style={{ color: 'red' }}>*</span></label>
                <select name="consultationType" className="form-control" value={formData.consultationType} onChange={handleChange}>
                   <option value="Online">Online</option>
                   <option value="Physical">Physical</option>
                   <option value="Both">Both</option>
                </select>
             </div>
             <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Experience Years <span style={{ color: 'red' }}>*</span></label>
                <input name="experience" type="number" className="form-control" placeholder="Total years" value={formData.experience} onChange={handleChange} />
                {errors.experience && <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{errors.experience}</small>}
             </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
             <label className="form-label">Bio (Optional)</label>
             <textarea name="bio" rows={3} className="form-control" placeholder="Briefly describe your medical practice focus..." value={formData.bio} onChange={handleChange}></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '15px', marginTop: '10px', fontSize: '16px' }}>
             {loading ? (
               <> <i className="fa-solid fa-spinner fa-spin"></i> Registering Portal Account... </>
             ) : (
               "Finalize & Create Practice Account"
             )}
          </button>
        </form>
      </div>
      
      <style jsx>{`
         @media (max-width: 600px) {
            div[style*="display: grid"] { grid-template-columns: 1fr !important; }
         }
      `}</style>
    </div>
  );
}
