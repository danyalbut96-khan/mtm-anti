'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  const roleFromUrl = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  
  const [role, setRole] = useState<'patient' | 'doctor'>(roleFromUrl);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
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
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Minimum 6 characters required";
    if (role === 'patient' && !formData.phone) newErrors.phone = "Mandatory";

    if (role === 'doctor') {
        if (!formData.specialization) newErrors.specialization = "Selection mandatory";
        if (!formData.city) newErrors.city = "Selection mandatory";
        if (!formData.location) newErrors.location = "Field mandatory";
        if (!formData.experience) newErrors.experience = "Field mandatory";
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
      const { data, error: authErr } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
      if (authErr) throw authErr;

      if (data.user) {
        if (role === 'doctor') {
            await supabase.from('doctors').insert({
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
            router.push('/doctor/dashboard');
        } else {
            await supabase.from('patients').insert({
                id: data.user.id,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone || 'N/A'
            });
            router.push('/patient/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      setGlobalError(err.message || "Internal constraint breach.");
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = role === 'doctor' ? '#2563EB' : 'var(--primary-color)';

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 20px', background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', top: '10%', right: '15%', width: '250px', height: '250px', background: `${primaryColor}10`, borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '300px', height: '300px', background: `${primaryColor}08`, borderRadius: '50%', filter: 'blur(70px)', zIndex: 0 }}></div>

      <div className="card fade-in" style={{ width: '100%', maxWidth: role === 'doctor' ? '680px' : '480px', position: 'relative', zIndex: 1, padding: '0', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.06)', borderRadius: '28px', background: 'rgba(255,255,255,0.98)', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        
        <div style={{ background: primaryColor, padding: '40px 30px', textAlign: 'center', color: 'white' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', color: 'white', marginBottom: '5px' }}>Global Matrix Enrollment</h1>
            <p style={{ opacity: 0.9, fontSize: '15px', fontWeight: 500 }}>Initialize new distinct user node within architecture.</p>
        </div>

        <div style={{ padding: '40px' }}>
            <div style={{ background: '#F1F5F9', padding: '6px', borderRadius: '14px', display: 'flex', gap: '4px', marginBottom: '35px' }}>
                <button type="button" onClick={() => setRole('patient')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', background: role === 'patient' ? 'white' : 'transparent', boxShadow: role === 'patient' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', color: role === 'patient' ? 'var(--primary-color)' : '#64748B', cursor: 'pointer', transition: '0.2s' }}>
                   Client Access
                </button>
                <button type="button" onClick={() => setRole('doctor')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', background: role === 'doctor' ? 'white' : 'transparent', boxShadow: role === 'doctor' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', color: role === 'doctor' ? '#2563EB' : '#64748B', cursor: 'pointer', transition: '0.2s' }}>
                   Physician Access
                </button>
            </div>

            {globalError && (
               <div style={{ padding: '14px 18px', background: '#FEF2F2', color: '#DC2626', borderRadius: '12px', fontSize: '14px', fontWeight: 600, marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #FEE2E2' }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> {globalError}
               </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: role === 'doctor' ? '1fr 1fr' : '1fr', gap: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Identity Label</label>
                        <input name="fullName" type="text" className="form-control" style={{ height: '50px', borderRadius: '12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontSize: '15px' }} value={formData.fullName} onChange={handleChange} placeholder="e.g. Alex Morgan" />
                        {errors.fullName && <small style={{ color: '#E11D48', fontWeight: 600, marginTop: '4px', display: 'block' }}>{errors.fullName}</small>}
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Network Channel</label>
                        <input name="email" type="email" className="form-control" style={{ height: '50px', borderRadius: '12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontSize: '15px' }} value={formData.email} onChange={handleChange} placeholder="user@host.com" />
                        {errors.email && <small style={{ color: '#E11D48', fontWeight: 600, marginTop: '4px', display: 'block' }}>{errors.email}</small>}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: role === 'doctor' ? '1fr 1fr' : '1fr', gap: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Encryption Cipher</label>
                        <input name="password" type="password" className="form-control" style={{ height: '50px', borderRadius: '12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontSize: '15px' }} value={formData.password} onChange={handleChange} placeholder="Min 6 AlphaNum" />
                        {errors.password && <small style={{ color: '#E11D48', fontWeight: 600, marginTop: '4px', display: 'block' }}>{errors.password}</small>}
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Mobile Stream Vector</label>
                        <input name="phone" type="text" className="form-control" style={{ height: '50px', borderRadius: '12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontSize: '15px' }} value={formData.phone} onChange={handleChange} placeholder="+92 XXXXXXXXXX" />
                        {errors.phone && <small style={{ color: '#E11D48', fontWeight: 600, marginTop: '4px', display: 'block' }}>{errors.phone}</small>}
                    </div>
                </div>

                {role === 'doctor' && (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '30px', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Sub-Specialization</label>
                                <select name="specialization" className="form-control" style={{ height: '48px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }} value={formData.specialization} onChange={handleChange}>
                                    <option value="">Identify Field...</option>
                                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.specialization && <small style={{ color: '#E11D48', fontWeight: 600 }}>{errors.specialization}</small>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Operational City</label>
                                <select name="city" className="form-control" style={{ height: '48px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }} value={formData.city} onChange={handleChange}>
                                    <option value="">Select Hub...</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.city && <small style={{ color: '#E11D48', fontWeight: 600 }}>{errors.city}</small>}
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Local Anchor Coordinates</label>
                                <input name="location" type="text" className="form-control" placeholder="Suite, Clinic Address" style={{ height: '48px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }} value={formData.location} onChange={handleChange} />
                                {errors.location && <small style={{ color: '#E11D48', fontWeight: 600 }}>{errors.location}</small>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Service Cycles</label>
                                <input name="experience" type="number" className="form-control" placeholder="Years" style={{ height: '48px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }} value={formData.experience} onChange={handleChange} />
                                {errors.experience && <small style={{ color: '#E11D48', fontWeight: 600 }}>{errors.experience}</small>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Clinical Bio Profile</label>
                            <textarea name="bio" rows={2} className="form-control" style={{ borderRadius: '10px', border: '1px solid #CBD5E1', padding: '12px', fontSize: '14px' }} placeholder="Describe practitioner capability matrix..." value={formData.bio} onChange={handleChange}></textarea>
                        </div>
                    </div>
                )}

                <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '16px', marginTop: '10px', fontSize: '16px', fontWeight: 900, background: primaryColor, color: 'white', border: 'none', borderRadius: '14px', boxShadow: `0 10px 20px -5px ${primaryColor}40`, cursor: 'pointer', transition: 'all 0.2s' }}>
                   {loading ? (
                     <> <i className="fa-solid fa-satellite fa-spin" style={{ marginRight: '10px' }}></i> Synthesizing Unique Entry... </>
                   ) : (
                     `Provision Neural Node`
                   )}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748B', fontSize: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '25px' }}>
                Existing registered signal detected? <Link href="/auth/login" style={{ color: primaryColor, fontWeight: 800, textDecoration: 'none', marginLeft: '4px' }}>Recall Auth Session</Link>
            </div>
        </div>
      </div>
      
      <style jsx>{` @media (max-width: 700px) { div[style*="display: grid"] { grid-template-columns: 1fr !important; } } `}</style>
    </div>
  );
}

export default function UnifiedSignupPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Initializing Enrollment Buffers...</div>}>
       <SignupFormContent />
    </Suspense>
  );
}
