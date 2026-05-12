import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const STRICT_SYSTEM_PROMPT = `You are a medical assistant for Smart Doctor Connect AI, a Pakistani doctor booking platform. 
Your ONLY job is to help users with:
1. Understanding their symptoms
2. Suggesting which doctor specialization they need
3. Explaining how to book an appointment on this platform
4. Answering questions about doctors listed on this platform

You must REFUSE to answer anything outside of these topics.
If asked anything unrelated to health or this platform, respond:
"I can only help you with medical queries and doctor bookings on this platform."
Keep all responses short, clear, and helpful.
Pakistan-focused. Do not mention any foreign hospitals, cities, or services.

IMPORTANT: Maintain responses under 150 words maximum at all times. Do not start general conversation.`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || 'placeholder',
      baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      max_tokens: 250, // ensures small completion to enforce word count
      messages: [
        { role: "system", content: STRICT_SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    });

    const aiResponse = response.choices[0]?.message?.content || "Connection temporarily unstable. Please try asking again.";
    
    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("Support AI route failed:", error);
    return NextResponse.json({ error: "System processing issue. Ensure API keys populated." }, { status: 500 });
  }
}
