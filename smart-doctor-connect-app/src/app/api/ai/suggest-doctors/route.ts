import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: Request) {
  try {
    const { symptoms } = await request.json();

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 });
    }

    // 1. Prompt OpenRouter/Gemini Flash to analyze symptoms 
    const response = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      max_tokens: 50,
      messages: [{ 
        role: "user", 
        content: `Analyze the patient's statement: "${symptoms}". Identify ONE exact single-word medical specialization this patient should see (e.g., Cardiologist, Dermatologist, Pediatrician, Neurologist, General Physician). Reply with ONLY that single word.`
      }],
    });
    
    const contentText = response.choices[0]?.message?.content?.trim() || 'General Physician';

    // 2. Query database for top 3 available doctors in that category
    const supabase = createClient();
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select('*')
      .ilike('specialization', `%${contentText}%`)
      .eq('is_available', true)
      .order('rating', { ascending: false })
      .limit(3);

    if (error) throw error;

    return NextResponse.json({
      detectedSpecialization: contentText,
      doctors: doctors || []
    });

  } catch (error: any) {
    console.error("OpenRouter AI Error:", error);
    return NextResponse.json({ error: 'Failed to analyze via AI' }, { status: 500 });
  }
}
