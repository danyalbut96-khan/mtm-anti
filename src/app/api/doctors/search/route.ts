import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// CRITERIA 1: Expanded Pakistani City Proximity Map configuration
const NEARBY_CITIES_MAP: Record<string, string[]> = {
  'islamabad': ['rawalpindi', 'wah cantt', 'attock'],
  'karachi': ['hyderabad', 'thatta'],
  'lahore': ['sheikhupura', 'kasur', 'gujranwala'],
  'peshawar': ['mardan', 'nowshera'],
  'multan': ['bahawalpur', 'sahiwal']
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialization = searchParams.get('specialization');
  let city = searchParams.get('city');
  
  // Ensure location default condition fulfilled
  if (!city || city.trim() === "") {
    city = "Islamabad";
  }

  const supabase = createClient();
  
  // CRITERIA 5: Select only required columns for listing bandwidth stability
  let query = supabase
    .from('doctors')
    .select('id, name, specialization, city, rating, is_available, profile_pic, location, consultation_type');

  if (specialization) {
    query = query.ilike('specialization', `%${specialization}%`);
  }
  
  query = query.ilike('city', `%${city}%`);

  // CRITERIA 1: Exact Availability + Rating composite sort prioritization
  query = query
    .order('is_available', { ascending: false })
    .order('rating', { ascending: false });

  let { data: doctors, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let showingNearby = false;

  // Check fallback logic if zero direct results found
  if ((!doctors || doctors.length === 0)) {
    const normalizedCity = city.toLowerCase().trim();
    const fallbacks = NEARBY_CITIES_MAP[normalizedCity];

    if (fallbacks && fallbacks.length > 0) {
      let fallbackQuery = supabase
        .from('doctors')
        .select('id, name, specialization, city, rating, is_available, profile_pic, location, consultation_type');
      
      if (specialization) {
        fallbackQuery = fallbackQuery.ilike('specialization', `%${specialization}%`);
      }

      // Map normalization to standard title-case strings found in DB
      const formattedFallbacks = fallbacks.map(c => c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      fallbackQuery = fallbackQuery.in('city', formattedFallbacks);

      // Apply uniform ordering on fallback dataset
      fallbackQuery = fallbackQuery
        .order('is_available', { ascending: false })
        .order('rating', { ascending: false });

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
