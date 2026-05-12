import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function DoctorProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!doctor || error) {
    return notFound(); // Or handle "Not found UI"
  }

  return (
    <div className="section-bg" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="container" style={{ paddingTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        
        <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="card" style={{ display: 'flex', gap: '25px', marginBottom: '30px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <Image 
                        src={doctor.profile_pic || "/assets/doctor-male.png"} 
                        alt="Doc" 
                        fill 
                        style={{ borderRadius: '16px', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>{doctor.name}</h1>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{doctor.specialization}</p>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '5px' }}>
                        <i className="fa-solid fa-location-dot"></i> {doctor.location || doctor.city}
                    </p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>About Doctor</h3>
                <p style={{ color: 'var(--text-light)' }}>{doctor.bio || "Experience dedicated patient care with individualized attention and modern protocols."}</p>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '15px' }}>Stats & Meta</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ background: 'var(--bg-light)', padding: '15px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                        <strong>{doctor.experience || 5}+</strong>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>Years Exp</div>
                    </div>
                    <div style={{ background: 'var(--bg-light)', padding: '15px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                        <strong>{doctor.rating || 5.0}</strong>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>Avg Rating</div>
                    </div>
                </div>
            </div>
        </div>

        <aside style={{ width: '350px', position: 'sticky', top: '90px', height: 'fit-content' }}>
            <div className="card" style={{ boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Action Portal</h3>
                <Link href={`/booking?docId=${doctor.id}`} className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
                    Book Appointment Now
                </Link>
                <Link href={`/chat?docId=${doctor.id}`} className="btn btn-outline" style={{ width: '100%' }}>
                    <i className="fa-regular fa-comment-dots"></i> Start AI Intake Chat
                </Link>
                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                   Consultation type preference: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{doctor.consultation_type}</span>
                </div>
            </div>
        </aside>

      </div>
    </div>
  );
}
