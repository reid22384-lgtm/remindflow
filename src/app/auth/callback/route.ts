import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  // Handle magic link / OTP login
  if (type === 'magiclink' || type === 'signup' || type === 'recovery') {
    if (tokenHash) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type === 'recovery' ? 'recovery' : 'email',
      });

      if (error || !data.session) {
        return NextResponse.redirect(new URL('/login?error=invalid-link', request.url));
      }

      // Redirect to app with session
      const redirectUrl = new URL('/app', request.url);
      redirectUrl.searchParams.set('access_token', data.session.access_token);
      redirectUrl.searchParams.set('refresh_token', data.session.refresh_token);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle OAuth code exchange
  if (code) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      return NextResponse.redirect(new URL('/login?error=auth-failed', request.url));
    }

    const redirectUrl = new URL('/app', request.url);
    redirectUrl.searchParams.set('access_token', data.session.access_token);
    redirectUrl.searchParams.set('refresh_token', data.session.refresh_token);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
