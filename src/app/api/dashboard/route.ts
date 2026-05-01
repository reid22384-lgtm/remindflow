import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ stats: {}, recent: [] });
    }

    // Total signups
    const { count: totalCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    // Today's signups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // This week's signups
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: weekCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    // Recent signups
    const { data: recent } = await supabase
      .from('waitlist')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      stats: {
        totalSignups: totalCount || 0,
        todaySignups: todayCount || 0,
        weekSignups: weekCount || 0,
        conversionRate: 0,
      },
      recent: recent || [],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ stats: {}, recent: [] });
  }
}
