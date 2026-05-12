import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { doctor_id, patient_id, date, time_slot, type, problem_description } = await request.json();
    const supabase = createClient();

    // 1. Check for overlapping existing appointment (Conflict detection)
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .match({ doctor_id, appointment_date: date, time_slot })
      .single();

    if (existing) {
      return NextResponse.json({ error: 'This slot is already booked. Please select another time.' }, { status: 409 });
    }

    // 2. Fetch doctor email for notification
    const { data: doctorData } = await supabase
      .from('doctors')
      .select('email, name')
      .eq('id', doctor_id)
      .single();

    // 3. Insert appointment record
    const { data: apt, error: insErr } = await supabase
      .from('appointments')
      .insert([{
        doctor_id,
        patient_id,
        appointment_date: date,
        time_slot,
        consultation_type: type,
        problem_description,
        status: 'scheduled'
      }])
      .select()
      .single();

    if (insErr) throw insErr;

    // 4. Send Resend email notification to doctor if they have email
    if (doctorData?.email) {
      await resend.emails.send({
        from: 'SmartDoc Connect <onboarding@resend.dev>', // in prod: usage domain
        to: doctorData.email,
        subject: '🔔 New Appointment Scheduled!',
        html: `<p>Hello Dr. ${doctorData.name},</p><p>A new patient has booked an appointment on <strong>${date}</strong> at <strong>${time_slot}</strong>.</p><p>Please log in to your dashboard to view details.</p>`
      });
    }

    return NextResponse.json({ success: true, appointment: apt });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server booking error' }, { status: 500 });
  }
}
