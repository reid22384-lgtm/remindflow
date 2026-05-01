import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendLaunchEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Protect with CRON_SECRET
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch all waitlist emails
    const { data: waitlist, error } = await supabase
      .from('waitlist')
      .select('email')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch waitlist:', error);
      return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
    }

    if (!waitlist || waitlist.length === 0) {
      return NextResponse.json({ message: 'No waitlist subscribers found', sent: 0 });
    }

    // Send launch email to each subscriber
    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const { email } of waitlist) {
      try {
        const result = await sendLaunchEmail(email);
        results.push({
          email,
          success: result?.success ?? false,
          error: result?.success ? undefined : String(result?.error),
        });
        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        results.push({ email, success: false, error: String(err) });
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Launch emails sent to ${sent} of ${waitlist.length} subscribers`,
      total: waitlist.length,
      sent,
      failed,
      results,
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}
