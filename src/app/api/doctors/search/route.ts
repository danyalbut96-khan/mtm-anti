import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Pakistani City Proximity Map configuration
const NEARBY_CITIES_MAP: Record<string, string[]> = {
  'islamabad': ['rawalpindi', 'wah cantt', 'attock'],
  'karachi': ['hyderabad', 'thatta'],
  'lahore': ['sheikhupura', 'kasur', 'gujranwala']
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialization = searchParams.get('specialization');
  let city = searchParams.get('city');
  
  // Default setting per instruction
  if (!city || city.trim() === "") {
    city = "Islamabad";
  }

  const supabase = createClient();
  let query = supabase.from('doctors').select('*');

  if (specialization) {
    query = query.ilike('specialization', `%${specialization}%`);
  }
  
  query = query.ilike('city', `%${city}%`);

  let { data: doctors, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let nearbyResults: any[] = [];
  let showingNearby = false;

  // Check fallback logic if zero direct results found
  if ((!doctors || doctors.length === 0)) {
    const normalizedCity = city.toLowerCase().trim();
    const fallbacks = NEARBY_CITIES_MAP[normalizedCity];

    if (fallbacks && fallbacks.length > 0) {
      let fallbackQuery = supabase.from('doctors').select('*');
      
      if (specialization) {
        fallbackQuery = fallbackQuery.ilike('specialization', `%${specialization}%`);
      }

      // Filter by list of fallback cities
      fallbackQuery = fallbackQuery.in('city', fallbacks.map(c => c.charAt(0).toUpperCase() + c.slice(1)));

      const { data: fallbackData } = await fallbackQuery;
      if (fallbackData && fallbackData.length > 0) {
        doctors = fallbackData;
        showingNearby = true;
      }
    }
  }

  return NextResponse.json({ 
    doctors: doctors || [], 
    citySearched: city,
    isNearbyFallback: showingNearby 
  });
}
