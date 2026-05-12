import { NextResponse } from 'next/server';
import { createClient, getServiceSupabase } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { patient_id, doctor_id, content } = await request.json();
    
    // Using service role here bypasses RLS safely to enable AI automation pipeline 
    const supabase = getServiceSupabase();

    // 1. Save the Patient message
    const { error: insertError } = await supabase
      .from('messages')
      .insert([{ 
        patient_id, 
        doctor_id, 
        sender_type: 'patient', 
        content 
      }]);

    if (insertError) throw insertError;

    // 2. Check doctor availability status
    const { data: doctor } = await supabase
      .from('doctors')
      .select('is_available, name')
      .eq('id', doctor_id)
      .single();

    // 3. If doctor isn't available, run Claude AI fallback response
    if (!doctor?.is_available) {
      const aiMsg = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        messages: [{ 
            role: "user", 
            content: `You are an automated Medical Assistant for Dr. ${doctor?.name}. The doctor is currently unavailable. Write a short (max 2 sentence) polite auto-reply to this patient message: "${content}". Ask them briefly for their emergency status or to describe symptoms so the doctor can read it later.`
        }],
      });

      let aiText = "I'm currently handling the intake for Dr. Smith. How can I help?";
      const block = aiMsg.content[0];
      if (block && 'text' in block) aiText = block.text;

      // Save AI response back to messages
      await supabase
        .from('messages')
        .insert([{ 
            patient_id, 
            doctor_id, 
            sender_type: 'ai', 
            content: aiText 
        }]);

      return NextResponse.json({ 
        status: 'ai_responded',
        aiResponse: aiText
      });
    }

    return NextResponse.json({ status: 'sent_to_doctor' });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
