import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { symptoms } = await request.json();

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 });
    }

    // 1. Prompt Claude to analyze symptoms and return standard specialization keywords
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 50,
      messages: [{ 
        role: "user", 
        content: `Analyze the patient's statement: "${symptoms}". Identify ONE exact single-word medical specialization this patient should see (e.g., Cardiologist, Dermatologist, Pediatrician, Neurologist, General Physician). Reply with ONLY that single word.`
      }],
    });
    
    let contentText = '';
    const contentBlock = msg.content[0];
    if (contentBlock && 'text' in contentBlock) {
        contentText = contentBlock.text.trim();
    }

    const suggestedSpecialization = contentText || 'General Physician';

    // 2. Query database for top 3 available doctors in that category
    const supabase = createClient();
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select('*')
      .ilike('specialization', `%${suggestedSpecialization}%`)
      .eq('is_available', true)
      .order('rating', { ascending: false })
      .limit(3);

    if (error) {
        throw error;
    }

    return NextResponse.json({
      detectedSpecialization: suggestedSpecialization,
      doctors: doctors || []
    });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Failed to analyze via AI' }, { status: 500 });
  }
}
