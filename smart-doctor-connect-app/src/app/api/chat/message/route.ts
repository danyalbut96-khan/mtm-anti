import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  try {
    const { patient_id, doctor_id, content } = await request.json();
    const supabase = getServiceSupabase();

    // 1. Save the Patient message
    const { error: insertError } = await supabase
      .from('messages')
      .insert([{ patient_id, doctor_id, sender_type: 'patient', content }]);

    if (insertError) throw insertError;

    // 2. Check doctor availability status
    const { data: doctor } = await supabase
      .from('doctors')
      .select('is_available, name')
      .eq('id', doctor_id)
      .single();

    // 3. If doctor isn't available, run OpenRouter/Gemini fallback response
    if (!doctor?.is_available) {
      const response = await openai.chat.completions.create({
        model: "google/gemini-flash-1.5",
        max_tokens: 150,
        messages: [{ 
            role: "user", 
            content: `You are an automated Medical Assistant for Dr. ${doctor?.name}. The doctor is currently unavailable. Write a short (max 2 sentence) polite auto-reply to this patient message: "${content}". Ask them briefly for their emergency status or to describe symptoms so the doctor can read it later.`
        }],
      });

      const aiText = response.choices[0]?.message?.content || "I have recorded your inquiry for Dr. Smith.";

      await supabase
        .from('messages')
        .insert([{ patient_id, doctor_id, sender_type: 'ai', content: aiText }]);

      return NextResponse.json({ status: 'ai_responded', aiResponse: aiText });
    }

    return NextResponse.json({ status: 'sent_to_doctor' });
  } catch (error: any) {
    console.error("Chat AI Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
