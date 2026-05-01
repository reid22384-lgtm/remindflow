import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseWithToken } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseWithToken(accessToken);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check subscription status
    const { data: subscription } = await (supabase.from('subscriptions') as any)
      .select('*')
      .eq('email', user.email)
      .single();

    return NextResponse.json({
      hasSubscription: !!subscription,
      plan: subscription?.plan || null,
      status: subscription?.status || null,
      currentPeriodEnd: subscription?.current_period_end || null,
    });
  } catch (error: any) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
