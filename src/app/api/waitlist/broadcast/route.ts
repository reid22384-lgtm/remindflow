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

    const body = await request.json();
    const testEmail = body?.test_email as string | undefined;

    const supabase = getSupabaseAdmin();

    // If test_email provided, send only to that address
    let emails: string[];
    if (testEmail) {
      emails = [testEmail];
    } else {
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

      emails = waitlist.map((w: any) => w.email);
    }

    // Debug: check env vars
    const hasResendKey = !!process.env.RESEND_API_KEY;
    const resendKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 8) || 'none';
    console.log(`RESEND_API_KEY present: ${hasResendKey}, prefix: ${resendKeyPrefix}`);

    // Send launch email to each subscriber
    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const email of emails) {
      try {
        console.log(`Sending launch email to: ${email}`);
        const result = await sendLaunchEmail(email);
        console.log(`Result for ${email}:`, JSON.stringify(result));
        results.push({
          email,
          success: result?.success ?? false,
          error: result?.success ? undefined : JSON.stringify(result?.error),
        });
        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 200));
      } catch (err: any) {
        console.error(`Error sending to ${email}:`, err);
        results.push({ email, success: false, error: err?.message || String(err) });
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Launch emails sent to ${sent} of ${emails.length} subscriber${testEmail ? ' (test mode)' : 's'}`,
      total: emails.length,
      sent,
      failed,
      test_mode: !!testEmail,
      results,
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}
