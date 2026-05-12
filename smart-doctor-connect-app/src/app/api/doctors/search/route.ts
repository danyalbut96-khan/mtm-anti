import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialization = searchParams.get('specialization');
  const city = searchParams.get('city');
  const type = searchParams.get('type'); // online, physical

  const supabase = createClient();
  let query = supabase
    .from('doctors')
    .select('*');

  if (specialization) {
    query = query.ilike('specialization', `%${specialization}%`);
  }
  if (city) {
    query = query.ilike('city', `%${city}%`);
  }
  if (type) {
    query = query.eq('consultation_type', type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ doctors: data });
}
