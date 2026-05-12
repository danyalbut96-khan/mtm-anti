import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServiceSupabase } from '@/lib/supabase'; // Using service role for global query safety in AI scope

const ANALYZER_PROMPT = `You are an intent analyzer for a Pakistani medical platform. 
Read the user message and analyze context.
Output ONLY a pure JSON object. Do not include markdown code blocks. 
Extract these properties:
- "specialization": string (e.g. "Cardiologist", "General Physician", etc based on described symptoms. Null if unknown.)
- "city": string (Pakistani city mentioned. Null if not found.)
- "isOffTopic": boolean (True only if asking about non-health/non-Pakistan topics)
- "nextRecommendedQuestion": string (A polite reply asking for missing data, e.g. "Which city are you located in?")

If both specialization and city are known, keep nextRecommendedQuestion null.`;

const FINAL_PROMPT = `You are an expert medical assistant for Smart Doctor Connect AI. 
Based on the supplied doctor data, generate a professional, polite recommendation in plain text.
Use specific formatting for doctor listings:
- Doctor Name, Specialization, City
- Status: 🟢 Available Now (if is_available=true) OR 🔴 Currently Unavailable (if false)

Rules:
- Be concise, maximum 120 words.
- Direct user to book appointment on the platform.
- NEVER mention foreign entities.`;

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json();
    
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || 'placeholder',
      baseURL: "https://openrouter.ai/api/v1",
    });

    // --- PHASE 1: INTENT ANALYSIS & SLOT FILLING ---
    const analyzeResponse = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [
        { role: "system", content: ANALYZER_PROMPT },
        { role: "user", content: `Analyze this input. User Message: "${message}". Previous history summary if any: ${JSON.stringify(history.slice(-3))}` }
      ],
      response_format: { type: "json_object" }
    });

    let analysis: any = {};
    try {
      const raw = analyzeResponse.choices[0]?.message?.content || "{}";
      // Sanitize markdown json blocks if present
      const cleanRaw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = JSON.parse(cleanRaw);
    } catch (e) {
       analysis = { isOffTopic: false };
    }

    if (analysis.isOffTopic) {
      return NextResponse.json({ response: "I can only assist with medical queries and doctor bookings on this platform." });
    }

    // --- PHASE 2: DATA FETCHING (THE SMART FORK) ---
    // If we have a specialization and a city extracted, we perform REALTIME SUPABASE lookup!
    if (analysis.city && analysis.specialization) {
      const supabase = getServiceSupabase();
      
      // Real-time Supabase Access Requirement 
      let { data: doctors } = await supabase
        .from('doctors')
        .select('id, name, specialization, city, is_available, consultation_type, profile_pic, rating')
        .ilike('city', `%${analysis.city}%`)
        .ilike('specialization', `%${analysis.specialization}%`)
        .order('rating', { ascending: false })
        .limit(3);

      // FALLBACK LOGIC: If empty, query nearby clusters identical to search engine
      if (!doctors || doctors.length === 0) {
         const NEARBY_MAP: Record<string, string[]> = {
           'islamabad': ['Rawalpindi', 'Wah Cantt'],
           'karachi': ['Hyderabad'],
           'lahore': ['Gujranwala', 'Kasur']
         };
         const cluster = NEARBY_MAP[analysis.city.toLowerCase().trim()];
         if (cluster) {
            const { data: fallback } = await supabase
              .from('doctors')
              .select('id, name, specialization, city, is_available, consultation_type, profile_pic, rating')
              .ilike('specialization', `%${analysis.specialization}%`)
              .in('city', cluster)
              .limit(3);
            
            if (fallback && fallback.length > 0) doctors = fallback;
         }
      }

      // Pass the real-time data to the LLM to forge a human-grade reply!
      const finalResponse = await openai.chat.completions.create({
        model: "google/gemini-flash-1.5",
        max_tokens: 250,
        messages: [
          { role: "system", content: FINAL_PROMPT },
          { role: "user", content: `User needs ${analysis.specialization} in ${analysis.city}. FOUND DOCTORS DATA: ${JSON.stringify(doctors)}. Formulate valid recommendation text.` }
        ]
      });

      return NextResponse.json({ 
        response: finalResponse.choices[0]?.message?.content || "Refined matches synthesized.",
        injectedDoctors: doctors || [], // Requirement: Structured payload injection
        detected: { city: analysis.city, spec: analysis.specialization } 
      });
    }

    // --- PHASE 3: FALLBACK SLOT FILLER ---
    // If we lack details, use the recommended conversational bridge question generated by the LLM
    const bridgeMsg = analysis.nextRecommendedQuestion || "Understood. To find the right match, could you specify which city you are currently located in?";
    return NextResponse.json({ response: bridgeMsg });

  } catch (error: any) {
    console.error("Advanced Support pipeline error:", error);
    return NextResponse.json({ response: "Connecting to engine... Please detail your location and symptoms again clearly." });
  }
}
