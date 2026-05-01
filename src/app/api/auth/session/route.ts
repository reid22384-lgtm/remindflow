import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ session: null }, { status: 200 });
  }
}
