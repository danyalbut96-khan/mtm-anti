import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServiceSupabase } from '@/lib/supabase';

const ANALYZER_PROMPT = `You are a high-level medical triage unit for Smart Doctor Connect AI in Pakistan.
Extract context purely. Return invalid nulls if missing. Output JSON object:
- "specialization": string
- "city": string
- "isOffTopic": boolean`;

const CHAT_PROMPT = `You are an expert human-like medical assistant node for Smart Doctor Connect AI. 
Users ask general health queries, symptoms, and logistical questions.
Deliver supportive, empathetic, brief conversational guidance.
NEVER force rigid data capture scripts. 
If you have explicit doctor metadata available in context, recommend them politely.
Otherwise, behave as a helpful chatbot. Maximum 150 words.`;

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json();
    
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || 'placeholder',
      baseURL: "https://openrouter.ai/api/v1",
    });

    // 1. Parallel extraction check purely to see if we CAN inject doctor data
    const analyzeResponse = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [
        { role: "system", content: ANALYZER_PROMPT },
        { role: "user", content: `Current statement: "${message}". Analyze.` }
      ],
      response_format: { type: "json_object" }
    });

    let analysis: any = {};
    try {
      const raw = analyzeResponse.choices[0]?.message?.content || "{}";
      analysis = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, ''));
    } catch (e) {
      analysis = { isOffTopic: false };
    }

    if (analysis.isOffTopic) {
      return NextResponse.json({ response: "My matrix remains strictly locked on medical inquiries and doctor navigation only." });
    }

    let doctors: any[] = [];

    // 2. Attempt context enrichment IF possible
    if (analysis.city && analysis.specialization) {
       const supabase = getServiceSupabase();
       const { data } = await supabase
         .from('doctors')
         .select('id, name, specialization, city, is_available, consultation_type, profile_pic, rating')
         .ilike('city', `%${analysis.city}%`)
         .ilike('specialization', `%${analysis.specialization}%`)
         .order('rating', { ascending: false })
         .limit(3);
       
       if (data && data.length > 0) doctors = data;
    }

    // 3. UNIVERSAL CONVERSATIONAL GEN (Requirement fulfillment)
    // ALWAYS generate response using LLM, passing whatever doctor metadata found
    const finalResponse = await openai.chat.completions.create({
       model: "google/gemini-flash-1.5",
       messages: [
          { role: "system", content: CHAT_PROMPT },
          ...history.map((h: string) => ({ role: h.startsWith('user') ? 'user' : 'assistant', content: h.split(': ').slice(1).join(': ') })),
          { role: "user", content: `${message} (CONTEXTUAL METADATA: ${JSON.stringify(doctors)})` }
       ]
    });

    return NextResponse.json({
        response: finalResponse.choices[0]?.message?.content || "Response frequency unstable. Resend signal.",
        injectedDoctors: doctors.length > 0 ? doctors : null
    });

  } catch (error: any) {
    console.error("Chat Logic Breached:", error);
    // Fallback dynamic apology, avoid hardcoded rigid instructions.
    return NextResponse.json({ response: "Apologies. Connection vector momentarily unstable. Could you re-phrase that query?" });
  }
}
